"""Conversation branching service — edit, regenerate & navigate branches."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.redis_client import get_redis
from src.models.models import ChatMessage
from src.repositories.messages import MessageRepository


logger = logging.getLogger(__name__)


@dataclass
class BranchInfo:
    """Describes the branching state at a specific message."""

    message_id: UUID
    parent_message_id: UUID | None
    branch_index: int
    total_siblings: int
    is_active: bool
    children_count: int = 0
    sibling_ids: list[UUID] = field(default_factory=list)


class ConversationTree:
    """High-level operations on the conversation tree (edit / regenerate / navigate)."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.message_repo = MessageRepository(session)
        self.redis = get_redis()

    # ── Public API ─────────────────────────────────────────────

    async def get_active_branch(self, session_id: UUID) -> list[ChatMessage]:
        """Return the currently active branch of a conversation."""
        return await self.message_repo.list_active_branch_messages(session_id)

    async def get_branch_info(self, message_id: UUID) -> BranchInfo | None:
        """Return branching metadata for a single message."""
        msg = await self.message_repo.get_message_by_id(message_id)
        if msg is None:
            return None

        siblings: list[ChatMessage] = []
        if msg.parent_message_id is not None:
            siblings = await self.message_repo.get_siblings(msg.parent_message_id)
        else:
            siblings = await self.message_repo.get_root_messages(msg.session_id)

        # Count direct children
        children = await self.message_repo.get_siblings(message_id)

        return BranchInfo(
            message_id=msg.id,
            parent_message_id=msg.parent_message_id,
            branch_index=msg.branch_index,
            total_siblings=len(siblings),
            is_active=msg.is_active_branch,
            children_count=len(children),
            sibling_ids=[s.id for s in siblings],
        )

    async def edit_message(
        self,
        message_id: UUID,
        new_content: str,
    ) -> ChatMessage:
        """Create a new branch from a user message edit.

        - Deactivates the old subtree below the edited message's parent.
        - Creates a new message as a sibling with incremented branch_index.
        """
        original = await self.message_repo.get_message_by_id(message_id)
        if original is None:
            raise ValueError("Tin nhắn không tồn tại")

        # Determine sibling count for branch_index
        siblings: list[ChatMessage] = []
        if original.parent_message_id is not None:
            siblings = await self.message_repo.get_siblings(
                original.parent_message_id
            )
        else:
            siblings = await self.message_repo.get_root_messages(
                original.session_id
            )
        next_index = max((s.branch_index for s in siblings), default=-1) + 1

        # Deactivate old subtree starting from the original message
        old_ids = await self._collect_subtree_ids(message_id)
        old_ids.append(message_id)
        await self.message_repo.update_active_branch(old_ids, is_active=False)

        # Create new message on the active branch
        new_msg = await self.message_repo.create_message(
            session_id=original.session_id,
            role=original.role,
            content=new_content,
            metadata=original.meta,
            parent_message_id=original.parent_message_id,
            branch_index=next_index,
            is_active_branch=True,
        )

        await self._invalidate_cache(original.session_id)
        return new_msg

    async def regenerate(
        self,
        message_id: UUID,
    ) -> ChatMessage:
        """Regenerate an assistant response — creates a new sibling branch.

        Returns the *placeholder* message; the caller is responsible for
        dispatching the actual LLM task (e.g. via Celery).
        """
        original = await self.message_repo.get_message_by_id(message_id)
        if original is None:
            raise ValueError("Tin nhắn không tồn tại")
        if original.role != "assistant":
            raise ValueError("Chỉ có thể tạo lại phản hồi của trợ lý")

        # Sibling count
        siblings: list[ChatMessage] = []
        if original.parent_message_id is not None:
            siblings = await self.message_repo.get_siblings(
                original.parent_message_id
            )
        else:
            siblings = await self.message_repo.get_root_messages(
                original.session_id
            )
        next_index = max((s.branch_index for s in siblings), default=-1) + 1

        # Deactivate old subtree
        old_ids = await self._collect_subtree_ids(message_id)
        old_ids.append(message_id)
        await self.message_repo.update_active_branch(old_ids, is_active=False)

        # Placeholder for the regenerated response
        new_msg = await self.message_repo.create_message(
            session_id=original.session_id,
            role="assistant",
            content="",
            metadata={"regenerated_from": str(original.id)},
            parent_message_id=original.parent_message_id,
            branch_index=next_index,
            is_active_branch=True,
        )

        await self._invalidate_cache(original.session_id)
        return new_msg

    async def navigate_branch(
        self,
        message_id: UUID,
        direction: int,
    ) -> ChatMessage:
        """Switch to an adjacent sibling branch.

        direction: -1 = previous, +1 = next.
        """
        current = await self.message_repo.get_message_by_id(message_id)
        if current is None:
            raise ValueError("Tin nhắn không tồn tại")

        siblings: list[ChatMessage] = []
        if current.parent_message_id is not None:
            siblings = await self.message_repo.get_siblings(
                current.parent_message_id
            )
        else:
            siblings = await self.message_repo.get_root_messages(
                current.session_id
            )

        # Find target sibling
        current_idx = next(
            (i for i, s in enumerate(siblings) if s.id == current.id), None
        )
        if current_idx is None:
            raise ValueError("Không tìm thấy tin nhắn trong danh sách anh em")

        target_idx = current_idx + direction
        if target_idx < 0 or target_idx >= len(siblings):
            raise ValueError("Không có nhánh nào ở hướng này")

        target = siblings[target_idx]

        # Deactivate current subtree, activate target subtree
        old_ids = await self._collect_subtree_ids(current.id)
        old_ids.append(current.id)
        await self.message_repo.update_active_branch(old_ids, is_active=False)

        await self._activate_subtree(target.id)

        await self._invalidate_cache(current.session_id)
        return target

    async def get_full_tree(
        self, session_id: UUID
    ) -> list[dict]:
        """Return a flat list of all messages with branching metadata.

        Useful for the frontend to reconstruct the full tree.
        """
        all_messages = await self.message_repo.list_messages(session_id)
        result: list[dict] = []
        for msg in all_messages:
            result.append({
                "id": str(msg.id),
                "parent_message_id": (
                    str(msg.parent_message_id) if msg.parent_message_id else None
                ),
                "role": msg.role,
                "content": msg.content,
                "branch_index": msg.branch_index,
                "is_active_branch": msg.is_active_branch,
                "created_at": msg.created_at.isoformat(),
                "metadata": msg.meta or {},
            })
        return result

    # ── Private helpers ────────────────────────────────────────

    async def _collect_subtree_ids(self, message_id: UUID) -> list[UUID]:
        """Recursively collect all descendant message IDs."""
        collected: list[UUID] = []
        stack = [message_id]
        while stack:
            parent_id = stack.pop()
            children = await self.message_repo.get_siblings(parent_id)
            for child in children:
                collected.append(child.id)
                stack.append(child.id)
        return collected

    async def _activate_subtree(self, message_id: UUID) -> None:
        """Activate a message and its first-child descendants (active path)."""
        await self.message_repo.update_active_branch([message_id], is_active=True)

        children = await self.message_repo.get_siblings(message_id)
        if not children:
            return

        # Activate the child that was previously active, or the first one
        active_child = next(
            (c for c in children if c.is_active_branch), children[0]
        )
        await self._activate_subtree(active_child.id)

    async def _deactivate_subtree(self, message_id: UUID) -> None:
        """Deactivate a message and all its descendants."""
        ids = await self._collect_subtree_ids(message_id)
        ids.append(message_id)
        await self.message_repo.update_active_branch(ids, is_active=False)

    async def _invalidate_cache(self, session_id: UUID) -> None:
        """Delete the Redis cache for a conversation session."""
        cache_key = f"chat:session:{session_id}"
        try:
            await self.redis.delete(cache_key)
        except Exception as e:
            logger.warning("Không thể xóa cache session %s: %s", session_id, e)
