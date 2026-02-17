from __future__ import annotations

import json
from typing import Any, Iterable
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..embeddings import mock_embed
from ..qdrant_client import search_vectors, upsert_vectors
from ..redis_client import get_redis
from ..repositories.messages import MessageRepository
from ..repositories.sessions import SessionRepository
from ..schemas import MessageCreate, SearchQuery


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
        if user_id:
            await self._ensure_session_limit(user_id)
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

        await self._chunk_and_store(
          session_id,
          db_message.id,
          message.content,
          user_id,
          department,
        )
        await self.session.flush()

        cache_key = self._cache_key(session_id)
        all_messages = await self.message_repo.list_messages(session_id)
        cache_payload = [self.serialize_message(msg) for msg in all_messages]
        await self.redis.set(cache_key, json.dumps(cache_payload), ex=3600)

        return db_message

    async def semantic_search(self, query: SearchQuery):
        query_vector = mock_embed(query.query)
        filters: dict[str, Any] = {}
        if query.user_id:
            filters["user_id"] = query.user_id
        if query.department:
            filters["department"] = query.department

        chunk_results = search_vectors(
            collection="chat_chunks",
            vector=query_vector,
            limit=query.limit,
            filters=filters or None,
        )
        summary_results = search_vectors(
            collection="long_term_memory",
            vector=query_vector,
            limit=query.limit,
            filters=filters or None,
        )

        def convert(points):
            return [
                {
                    "text": point.payload.get("text", ""),
                    "score": point.score or 0.0,
                    "metadata": point.payload,
                }
                for point in points
            ]

        combined = convert(chunk_results) + convert(summary_results)
        combined.sort(key=lambda item: item["score"], reverse=True)
        return combined[: query.limit]

    async def _ensure_session_limit(self, user_id: str) -> None:
        count = await self.session_repo.count_sessions_for_user(user_id)
        if count < self.settings.chat_max_sessions:
            return
        overflow_sessions = await self.session_repo.get_sessions_exceeding_limit(
            user_id, self.settings.chat_max_sessions - 1
        )
        for session in overflow_sessions:
            messages = await self.session_repo.get_session_messages(session.id)
            summary = summarize_messages([msg.content for msg in messages])
            vector = mock_embed(summary)
            payload = {
                "user_id": user_id,
                "session_id": str(session.id),
                "text": summary,
                "type": "summary",
            }
            upsert_vectors("long_term_memory", [payload], [vector])
            await self.session_repo.delete_sessions([session.id])
            await self.redis.delete(self._cache_key(session.id))

    async def _chunk_and_store(
        self,
        session_id: UUID,
        message_id: UUID,
        content: str,
        user_id: str | None,
        department: str | None,
    ) -> None:
        chunks = chunk_text(content, self.settings.chat_chunk_size)
        vectors = [mock_embed(chunk) for chunk in chunks]
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


def summarize_messages(messages: Iterable[str]) -> str:
    combined = " ".join(messages)
    sentences = combined.split(".")
    summary = ". ".join(sentence.strip() for sentence in sentences[:3] if sentence.strip())
    summary = summary[:400]
    return summary or combined[:400]
