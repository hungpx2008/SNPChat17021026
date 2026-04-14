from __future__ import annotations

from typing import Iterable
from uuid import UUID, uuid4

from sqlalchemy import select, text, update
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

    # ── Branching methods ──────────────────────────────────────────

    async def get_last_active_message(self, session_id: UUID) -> ChatMessage | None:
        """Get the most recent active-branch message in a session."""
        stmt = (
            select(ChatMessage)
            .where(
                ChatMessage.session_id == session_id,
                ChatMessage.is_active_branch.is_(True),
            )
            .order_by(ChatMessage.created_at.desc())
            .limit(1)
        )
        result = await self.session.execute(stmt)
        msg = result.scalar_one_or_none()
        if msg is not None:
            return msg

        # Fallback: return the latest message regardless of branch status
        stmt_fallback = (
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(1)
        )
        result_fallback = await self.session.execute(stmt_fallback)
        return result_fallback.scalar_one_or_none()

    async def get_message_by_id(self, message_id: UUID) -> ChatMessage | None:
        """Fetch a single message by its primary key."""
        stmt = select(ChatMessage).where(ChatMessage.id == message_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_siblings(self, parent_message_id: UUID) -> list[ChatMessage]:
        """Get all messages sharing the same parent (sibling branches)."""
        stmt = (
            select(ChatMessage)
            .where(ChatMessage.parent_message_id == parent_message_id)
            .order_by(ChatMessage.branch_index.asc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars())

    async def get_root_messages(self, session_id: UUID) -> list[ChatMessage]:
        """Get messages with no parent (conversation roots)."""
        stmt = (
            select(ChatMessage)
            .where(
                ChatMessage.session_id == session_id,
                ChatMessage.parent_message_id.is_(None),
            )
            .order_by(ChatMessage.created_at.asc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars())

    async def update_active_branch(
        self, message_ids: list[UUID], is_active: bool
    ) -> None:
        """Bulk update is_active_branch for a list of message IDs."""
        if not message_ids:
            return
        stmt = (
            update(ChatMessage)
            .where(ChatMessage.id.in_(message_ids))
            .values(is_active_branch=is_active)
        )
        await self.session.execute(stmt)
        await self.session.flush()

    async def update_message_content(
        self,
        message_id: UUID,
        content: str,
        metadata: dict | None = None,
    ) -> ChatMessage | None:
        """Update content (and optionally metadata) of a single message."""
        msg = await self.get_message_by_id(message_id)
        if msg is None:
            return None
        msg.content = content
        if metadata is not None:
            msg.meta = metadata
        await self.session.flush()
        return msg

    async def list_active_branch_messages(
        self, session_id: UUID
    ) -> list[ChatMessage]:
        """Walk the active branch using a recursive CTE.

        Returns messages in chronological order following
        parent_message_id links where is_active_branch = TRUE.
        """
        cte_sql = text("""
            WITH RECURSIVE branch AS (
                -- Anchor: root messages (no parent) on the active branch
                SELECT id, parent_message_id, created_at, 1 AS depth
                FROM chat_messages
                WHERE session_id = :sid
                  AND parent_message_id IS NULL
                  AND is_active_branch = TRUE

                UNION ALL

                -- Recursive: follow active children
                SELECT cm.id, cm.parent_message_id, cm.created_at, b.depth + 1
                FROM chat_messages cm
                JOIN branch b ON cm.parent_message_id = b.id
                WHERE cm.is_active_branch = TRUE
            )
            SELECT id FROM branch ORDER BY depth, created_at
        """)
        result = await self.session.execute(cte_sql, {"sid": str(session_id)})
        ordered_ids = [row[0] for row in result.fetchall()]

        if not ordered_ids:
            # Fallback to simple chronological list
            return await self.list_messages(session_id)

        # Fetch full ORM objects preserving CTE order
        stmt = select(ChatMessage).where(ChatMessage.id.in_(ordered_ids))
        result = await self.session.execute(stmt)
        msg_map = {msg.id: msg for msg in result.scalars()}
        return [msg_map[mid] for mid in ordered_ids if mid in msg_map]
