from __future__ import annotations

import asyncio
import json
from typing import Any, Iterable
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..embeddings import embed_text, get_client
from ..qdrant_client import search_vectors, upsert_vectors
from ..redis_client import get_redis
from ..repositories.messages import MessageRepository
from ..repositories.sessions import SessionRepository
from ..schemas import MessageCreate, SearchQuery


import httpx
from fastapi import BackgroundTasks


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
        background_tasks: BackgroundTasks,
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

        # Offload heavy lifting to background
        background_tasks.add_task(
            self._process_message_background,
            session_id=session_id,
            message_id=db_message.id,
            content=message.content,
            role=message.role,
            user_id=user_id,
            department=department,
        )

        return db_message

    async def _process_message_background(
        self,
        session_id: UUID,
        message_id: UUID,
        content: str,
        role: str,
        user_id: str | None,
        department: str | None,
    ):
        from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

        # Define retry policy: Wait 1s, 2s, 4s... up to 10s. Stop after 3 attempts.
        retry_policy = dict(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type(Exception),
            reraise=True
        )

        # 1. Short-term storage (Short Chunks for RAG)
        @retry(**retry_policy)
        async def safe_chunk_and_store():
            await self._chunk_and_store(
                session_id,
                message_id,
                content,
                user_id,
                department,
            )

        try:
            await safe_chunk_and_store()
        except Exception as e:
            print(f"Error in background chunking after retries: {e}")

        # 2. Long-term storage (Mem0)
        # Optimization: Only process messages with significant content (> 10 chars)
        if user_id and len(content.strip()) > 10:
            @retry(**retry_policy)
            async def safe_mem0_store():
                client = get_client()
                await client.post(
                    f"{self.settings.mem0_url.rstrip('/')}/memories",
                    json={
                        "user_id": user_id,
                        "messages": [{"role": role, "content": content}],
                        "metadata": {"session_id": str(session_id), "department": department}
                    }
                )

            try:
                await safe_mem0_store()
            except Exception as e:
                print(f"Warning: Failed to persist message to Mem0 after retries: {e}")

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
                print(f"Warning: Mem0 search failed: {e}")
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
        combined.sort(key=lambda item: item["score"], reverse=True)
        return combined[: query.limit]

    async def _chunk_and_store(
        self,
        session_id: UUID,
        message_id: UUID,
        content: str,
        user_id: str | None,
        department: str | None,
    ) -> None:
        chunks = chunk_text(content, self.settings.chat_chunk_size)
        # Process embeddings concurrently
        vectors = await asyncio.gather(*[embed_text(chunk) for chunk in chunks])
        
        payloads = []
        vector_ids = []
        for index, (chunk, vector) in enumerate(zip(chunks, vectors)):
            vector_id = str(uuid4())
            payloads.append(
                {
                    "session_id": str(session_id),
                    "message_id": str(message_id),
                    "chunk_index": index,
                    "text": chunk,
                    "user_id": user_id,
                    "department": department,
                    "type": "message_chunk",
                }
            )
            vector_ids.append(vector_id)

        if payloads:
            upsert_vectors("chat_chunks", payloads, vectors, ids=vector_ids)

        metadata_chunks = [
            (index, chunk, vector_id, {"vector_id": vector_id, "session_id": str(session_id)})
            for index, (chunk, vector_id) in enumerate(zip(chunks, vector_ids))
        ]
        await self.message_repo.add_chunks(message_id, metadata_chunks)

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



