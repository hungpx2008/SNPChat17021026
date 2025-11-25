from __future__ import annotations

from datetime import datetime
from typing import Iterable, Optional
from uuid import UUID

from sqlalchemy import Select, Selectable, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import ChatMessage, ChatSession


class SessionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_session(
        self,
        *,
        user_id: str | None,
        department: str | None,
        title: str | None,
        external_id: str | None,
    ) -> ChatSession:
        chat_session = ChatSession(
            user_id=user_id,
            department=department,
            title=title,
            external_id=external_id,
        )
        self.session.add(chat_session)
        await self.session.flush()
        return chat_session

    async def get_session(self, session_id: UUID) -> Optional[ChatSession]:
        result = await self.session.execute(select(ChatSession).where(ChatSession.id == session_id))
        return result.scalar_one_or_none()

    async def list_sessions_for_user(
        self, user_id: str, limit: int = 100
    ) -> list[ChatSession]:
        result = await self.session.execute(
            select(ChatSession)
            .where(ChatSession.user_id == user_id)
            .order_by(ChatSession.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars())

    async def count_sessions_for_user(self, user_id: str) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(ChatSession).where(ChatSession.user_id == user_id)
        )
        return int(result.scalar() or 0)

    async def get_sessions_exceeding_limit(
        self, user_id: str, limit: int
    ) -> list[ChatSession]:
        subquery: Selectable = (
            select(ChatSession.id)
            .where(ChatSession.user_id == user_id)
            .order_by(ChatSession.created_at.desc())
            .offset(limit)
        )
        result = await self.session.execute(
            select(ChatSession).where(ChatSession.id.in_(subquery))
        )
        return list(result.scalars())

    async def delete_sessions(self, session_ids: Iterable[UUID]) -> None:
        if not session_ids:
            return
        await self.session.execute(
            ChatSession.__table__.delete().where(ChatSession.id.in_(list(session_ids)))
        )
        await self.session.flush()

    async def get_session_messages(self, session_id: UUID) -> list[ChatMessage]:
        result = await self.session.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
        )
        return list(result.scalars())

    async def list_sessions_with_counts(
        self,
        limit: int = 100,
        user_id: str | None = None,
    ) -> list[tuple[ChatSession, int]]:
        stmt = (
            select(ChatSession, func.count(ChatMessage.id).label("message_count"))
            .outerjoin(ChatMessage, ChatMessage.session_id == ChatSession.id)
            .group_by(ChatSession.id)
            .order_by(ChatSession.created_at.desc())
            .limit(limit)
        )
        if user_id:
            stmt = stmt.where(ChatSession.user_id == user_id)

        result = await self.session.execute(stmt)
        return [(row[0], int(row[1] or 0)) for row in result.all()]

    async def update_session_title(self, session_id: UUID, title: str) -> None:
        await self.session.execute(
            ChatSession.__table__
            .update()
            .where(ChatSession.id == session_id)
            .values(title=title, updated_at=datetime.utcnow())
        )
