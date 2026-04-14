from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Iterable
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import get_settings
from src.core.db import SessionLocal, init_engine
from src.core.qdrant_setup import search_vectors, upsert_vectors
from src.core.redis_client import get_redis
from src.repositories.messages import MessageRepository
from src.repositories.sessions import SessionRepository
from src.schemas.schemas import MessageCreate, SearchQuery


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

        if limit is None:
            # Use active-branch walk for full conversation view
            messages = await self.message_repo.list_active_branch_messages(session_id)
        else:
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
        # Determine parent for branching support
        last_active = await self.message_repo.get_last_active_message(session_id)
        parent_message_id = last_active.id if last_active else None

        db_message = await self.message_repo.create_message(
            session_id=session_id,
            role=message.role,
            content=message.content,
            metadata=message.metadata or {},
            parent_message_id=parent_message_id,
        )
        await self.session.flush()

        # Update cache: append new message instead of full DB reload
        cache_key = self._cache_key(session_id)
        cached_raw = await self.redis.get(cache_key)
        if cached_raw:
            existing = json.loads(cached_raw)
            existing.append(self.serialize_message(db_message))
            await self.redis.set(cache_key, json.dumps(existing), ex=3600)
            all_messages = existing  # reuse for msg_count below
        else:
            all_messages = await self.message_repo.list_messages(session_id)
            cache_payload = [self.serialize_message(msg) for msg in all_messages]
            await self.redis.set(cache_key, json.dumps(cache_payload), ex=3600)

        # ── Resolve mode: auto-route or explicit ──
        mode = getattr(message, 'mode', 'auto')

        if mode == "auto":
            from src.services.intent_router import IntentRouter
            router = IntentRouter()
            intent_result = router.classify(message.content)
            mode = intent_result.intent.value
            logger.info(
                f"[AutoRoute] '{message.content[:50]}...' → {mode} "
                f"(confidence={intent_result.confidence:.2f}, "
                f"signals={intent_result.signals})"
            )

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
        else:  # mode == "chat" (default fallback)
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

        # Trigger smart summarization based on token usage (replaces hardcoded % 10)
        self._maybe_trigger_summarization(session_id, all_messages)

        # Return message + mode so API can signal frontend
        db_message._intent_type = mode
        return db_message

    # NOTE: _process_message_background and _chunk_and_store have been
    # migrated to Celery worker tasks (process_chat_response in tasks.py).
    # They are no longer needed here.

    @staticmethod
    def _to_msg_dicts(all_messages: Iterable) -> list[dict]:
        """Normalize mixed message types (dict or ORM objects) to dicts."""
        result = []
        for m in all_messages:
            if isinstance(m, dict):
                result.append({
                    "role": m.get("role", "user"),
                    "content": m.get("content", ""),
                })
            else:
                result.append({
                    "role": getattr(m, "role", "user"),
                    "content": getattr(m, "content", ""),
                })
        return result

    def _maybe_trigger_summarization(self, session_id: UUID, all_messages: Iterable) -> None:
        """Check token usage and trigger smart summarization if threshold exceeded."""
        try:
            from src.utils.token_estimator import estimate_conversation_tokens
            from src.utils.summarization import get_summarization_params

            msg_dicts = self._to_msg_dicts(all_messages)
            estimated_tokens = estimate_conversation_tokens(msg_dicts)
            llm_model = getattr(self.settings, "llm_model", "openai/gpt-4o-mini")
            params = get_summarization_params(llm_model, estimated_tokens)
            if params:
                from src.worker.tasks import summarize_session_history
                summarize_session_history.delay(
                    session_id=str(session_id),
                    keep_count=params["keep_count"],
                    trim_tokens=params["trim_tokens"],
                )
        except Exception as e:
            logger.warning(f"Smart summarization check failed, using fallback: {e}")
            msg_count = sum(1 for _ in all_messages)
            if msg_count > 0 and msg_count % 10 == 0:
                from src.worker.tasks import summarize_session_history
                summarize_session_history.delay(session_id=str(session_id))

    async def semantic_search(self, query: SearchQuery):
        from src.worker.chat_tasks import embed_query
        query_vector = embed_query(query.query)
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
                from src.core.mem0_local import search_memories
                data = search_memories(
                    query=query.query,
                    user_id=query.user_id,
                    limit=query.limit,
                )
                if isinstance(data, dict):
                    return data.get("results", [])
                return data if isinstance(data, list) else []
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
        SCORE_THRESHOLD = 0.35
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
            "parent_message_id": (
                str(getattr(message, "parent_message_id", None))
                if getattr(message, "parent_message_id", None)
                else None
            ),
            "branch_index": getattr(message, "branch_index", 0),
            "is_active_branch": getattr(message, "is_active_branch", True),
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



