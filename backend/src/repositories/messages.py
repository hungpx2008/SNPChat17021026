from __future__ import annotations

from typing import Iterable
from uuid import UUID, uuid4

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.models import ChatMessage, ChatMessageChunk


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
        parent_message_id: UUID | None = None,
        branch_index: int = 0,
        is_active_branch: bool = True,
    ) -> ChatMessage:
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            meta=metadata or {},
            parent_message_id=parent_message_id,
            branch_index=branch_index,
            is_active_branch=is_active_branch,
        )
        self.session.add(message)
        await self.session.flush()
        return message

    async def get_message(self, message_id: UUID) -> ChatMessage | None:
        result = await self.session.execute(
            select(ChatMessage).where(ChatMessage.id == message_id)
        )
        return result.scalar_one_or_none()

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

    async def list_messages(self, session_id: UUID, limit: int | None = None) -> list[ChatMessage]:
        if limit is not None:
            # Get last N messages (desc) then reverse to chronological order
            stmt = (
                select(ChatMessage)
                .where(ChatMessage.session_id == session_id)
                .order_by(ChatMessage.created_at.desc())
                .limit(limit)
            )
            result = await self.session.execute(stmt)
            messages = list(result.scalars())
            messages.reverse()
            return messages

        stmt = (
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars())

    async def list_session_messages(self, session_id: UUID) -> list[ChatMessage]:
        result = await self.session.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc(), ChatMessage.branch_index.asc())
        )
        return list(result.scalars())

    async def get_latest_active_message(self, session_id: UUID) -> ChatMessage | None:
        result = await self.session.execute(
            select(ChatMessage)
            .where(
                ChatMessage.session_id == session_id,
                ChatMessage.is_active_branch.is_(True),
            )
            .order_by(ChatMessage.created_at.desc(), ChatMessage.branch_index.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def list_siblings(self, session_id: UUID, parent_message_id: UUID | None) -> list[ChatMessage]:
        stmt = select(ChatMessage).where(ChatMessage.session_id == session_id)
        if parent_message_id is None:
            stmt = stmt.where(ChatMessage.parent_message_id.is_(None))
        else:
            stmt = stmt.where(ChatMessage.parent_message_id == parent_message_id)
        result = await self.session.execute(
            stmt.order_by(ChatMessage.branch_index.asc(), ChatMessage.created_at.asc())
        )
        return list(result.scalars())

    async def count_siblings(self, session_id: UUID, parent_message_id: UUID | None) -> int:
        stmt = select(func.count()).select_from(ChatMessage).where(ChatMessage.session_id == session_id)
        if parent_message_id is None:
            stmt = stmt.where(ChatMessage.parent_message_id.is_(None))
        else:
            stmt = stmt.where(ChatMessage.parent_message_id == parent_message_id)
        result = await self.session.execute(stmt)
        return int(result.scalar() or 0)
