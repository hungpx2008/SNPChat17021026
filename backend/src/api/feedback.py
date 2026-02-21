"""
Feedback API — User feedback on bot answers for self-correction.
"""
from __future__ import annotations

from typing import Any, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import get_db_session
from src.models.models import MessageFeedback, ChatMessage

router = APIRouter(prefix="/feedback", tags=["feedback"])


class FeedbackCreate(BaseModel):
    message_id: UUID
    is_liked: bool
    reason: Optional[str] = None  # "sai số liệu" | "thiếu trích dẫn" | "không liên quan" | "khác"


class FeedbackResponse(BaseModel):
    id: UUID
    message_id: UUID
    is_liked: bool
    reason: Optional[str] = None
    message: str


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    payload: FeedbackCreate,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """
    Submit feedback (👍/👎) on a bot message.
    If disliked → triggers process_feedback Celery task for self-correction.
    """
    # Verify message exists
    result = await db.execute(select(ChatMessage).where(ChatMessage.id == payload.message_id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    # Save feedback record
    feedback = MessageFeedback(
        id=uuid4(),
        message_id=payload.message_id,
        is_liked=payload.is_liked,
        reason=payload.reason,
    )
    db.add(feedback)
    await db.commit()

    # If disliked → trigger self-correction
    if not payload.is_liked:
        from src.worker.tasks import process_feedback
        process_feedback.delay(
            message_id=str(payload.message_id),
            is_liked=payload.is_liked,
            reason=payload.reason,
        )

    action = "positive" if payload.is_liked else "negative — correction queued"
    return FeedbackResponse(
        id=feedback.id,
        message_id=payload.message_id,
        is_liked=payload.is_liked,
        reason=payload.reason,
        message=f"Feedback recorded: {action}",
    )
