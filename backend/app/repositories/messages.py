from __future__ import annotations

from typing import Iterable
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import ChatMessage, ChatMessageChunk


class MessageRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_message(
        self,
        *,
        session_id: UUID,
        role: str,
        content: str,
        metadata: dict | None,
    ) -> ChatMessage:
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            meta=metadata or {},
        )
        self.session.add(message)
        await self.session.flush()
        return message

    async def add_chunks(
        self,
        message_id: UUID,
        chunks: Iterable[tuple[int, str, str | None, dict | None]],
    ) -> list[ChatMessageChunk]:
        created_chunks: list[ChatMessageChunk] = []
        for index, content, vector_id, metadata in chunks:
            chunk = ChatMessageChunk(
                id=uuid4(),
                message_id=message_id,
                chunk_index=index,
                content=content,
                vector_id=vector_id,
                meta=metadata or {},
            )
            self.session.add(chunk)
            created_chunks.append(chunk)
        await self.session.flush()
        return created_chunks

    async def list_messages(self, session_id: UUID) -> list[ChatMessage]:
        result = await self.session.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
        )
        return list(result.scalars())
