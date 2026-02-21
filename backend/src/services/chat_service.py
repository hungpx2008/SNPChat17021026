from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Iterable
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import get_settings
from src.core.db import SessionLocal, init_engine
from src.core.mem0_config import embed_text, get_client
from src.core.qdrant_setup import search_vectors, upsert_vectors
from src.core.redis_client import get_redis
from src.repositories.messages import MessageRepository
from src.repositories.sessions import SessionRepository
from src.schemas.schemas import MessageCreate, SearchQuery


import httpx
from src.worker.tasks import process_chat_response, store_memory

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.settings = get_settings()
        self.session_repo = SessionRepository(session)
        self.message_repo = MessageRepository(session)
        self.redis = get_redis()

    async def create_session(
        self,
        user_id: str | None,
        department: str | None,
        title: str | None,
        external_id: str | None,
    ):
        chat_session = await self.session_repo.create_session(
            user_id=user_id, department=department, title=title, external_id=external_id
        )
        return chat_session

    async def list_sessions(self, user_id: str) -> list:
        return await self.session_repo.list_sessions_for_user(
            user_id, limit=self.settings.chat_max_sessions
        )

    async def get_session_with_messages(self, session_id: UUID, limit: int | None = None):
        cache_key = self._cache_key(session_id)
        if limit is None:
            cached = await self.redis.get(cache_key)
            if cached:
                return json.loads(cached)

        messages = await self.message_repo.list_messages(session_id, limit=limit)
        payload = [self.serialize_message(message) for message in messages]
        if limit is None:
            await self.redis.set(cache_key, json.dumps(payload), ex=3600)
        return payload

    async def add_message(
        self,
        session_id: UUID,
        message: MessageCreate,
        *,
        user_id: str | None,
        department: str | None,
    ):
        db_message = await self.message_repo.create_message(
            session_id=session_id,
            role=message.role,
            content=message.content,
            metadata=message.metadata or {},
        )
        await self.session.flush()

        # Update cache immediately with the new message
        cache_key = self._cache_key(session_id)
        all_messages = await self.message_repo.list_messages(session_id)
        cache_payload = [self.serialize_message(msg) for msg in all_messages]
        await self.redis.set(cache_key, json.dumps(cache_payload), ex=3600)

        # Explicit Agent Routing — user selects mode, no keyword guessing
        mode = getattr(message, 'mode', 'chat')

        if mode == "sql":
            from src.worker.tasks import run_sql_query
            run_sql_query.delay(
                question=message.content,
                session_id=str(session_id),
                user_id=user_id,
            )
        elif mode == "rag":
            from src.worker.tasks import rag_document_search
            rag_document_search.delay(
                question=message.content,
                session_id=str(session_id),
                user_id=user_id,
                department=department,
            )
        else:  # mode == "chat" (default)
            process_chat_response.delay(
                session_id=str(session_id),
                message_id=str(db_message.id),
                content=message.content,
                role=message.role,
                user_id=user_id,
                department=department,
            )

        # Trigger memory storage if condition met
        if user_id and len(message.content.strip()) > 10:
            store_memory.delay(
                user_id=user_id,
                content=message.content,
                role=message.role,
                session_id=str(session_id),
                department=department,
            )

        # Trigger async summary every 10 messages (runs in background)
        msg_count = len(all_messages)
        if msg_count > 0 and msg_count % 10 == 0:
            from src.worker.tasks import summarize_session_history
            summarize_session_history.delay(session_id=str(session_id))

        # Return message + mode so API can signal frontend
        db_message._intent_type = mode
        return db_message

    # NOTE: _process_message_background and _chunk_and_store have been
    # migrated to Celery worker tasks (process_chat_response in tasks.py).
    # They are no longer needed here.

    async def semantic_search(self, query: SearchQuery):
        query_vector = await embed_text(query.query)
        filters: dict[str, Any] = {}
        if query.user_id:
            filters["user_id"] = query.user_id
        if query.department:
            filters["department"] = query.department

        # Define search tasks
        async def search_qdrant():
            return search_vectors(
                collection="chat_chunks",
                vector=query_vector,
                limit=query.limit,
                filters=filters or None,
            )

        async def search_mem0():
            if not query.user_id:
                return []
            try:
                client = get_client()
                resp = await client.post(
                    f"{self.settings.mem0_url.rstrip('/')}/search",
                    json={
                        "query": query.query,
                        "user_id": query.user_id,
                        "limit": query.limit
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("results", [])
            except Exception as e:
                logger.warning(f"Mem0 search failed: {e}")
            return []

        # Run searches in parallel
        chunk_results, mem0_results = await asyncio.gather(search_qdrant(), search_mem0())

        def convert_qdrant(points):
            return [
                {
                    "text": point.payload.get("text", ""),
                    "score": point.score or 0.0,
                    "metadata": point.payload,
                    "source": "short_term"
                }
                for point in points
            ]

        def convert_mem0(results):
            return [
                {
                    "text": item.get("text") or item.get("memory") or "",
                    "score": item.get("score") or 0.0,
                    "metadata": item.get("metadata") or {},
                    "source": "long_term"
                }
                for item in results
            ]

        combined = convert_qdrant(chunk_results) + convert_mem0(mem0_results)
        # Filter by minimum score threshold (unified across sources)
        SCORE_THRESHOLD = 0.45
        combined = [item for item in combined if item["score"] >= SCORE_THRESHOLD]
        combined.sort(key=lambda item: item["score"], reverse=True)
        return combined[: query.limit]



    def _cache_key(self, session_id: UUID) -> str:
        return f"chat:session:{session_id}"

    def serialize_message(self, message) -> dict[str, Any]:
        return {
            "id": str(message.id),
            "session_id": str(message.session_id),
            "role": message.role,
            "content": message.content,
            "metadata": message.meta or {},
            "created_at": message.created_at.isoformat(),
        }


def chunk_text(text: str, chunk_size: int) -> list[str]:
    words = text.split()
    chunks: list[str] = []
    current_words: list[str] = []
    current_length = 0
    for word in words:
        current_words.append(word)
        current_length += len(word) + 1
        if current_length >= chunk_size:
            chunks.append(" ".join(current_words))
            current_words = []
            current_length = 0
    if current_words:
        chunks.append(" ".join(current_words))
    if not chunks:
        return [text]
    return chunks



