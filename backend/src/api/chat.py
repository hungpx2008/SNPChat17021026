from __future__ import annotations

import asyncio
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.models import ChatSession
from src.schemas.schemas import (
    MessageCreate,
    MessageSchema,
    SearchQuery,
    SearchResult,
    SessionCreate,
    SessionSchema,
    SessionWithMessages,
)
from src.services.chat_service import ChatService
from src.api.deps import get_db_session, get_session_or_404
from src.core.redis_client import get_redis


router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionSchema, status_code=status.HTTP_201_CREATED)
async def create_session(
    payload: SessionCreate,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    chat_session = await service.create_session(
        user_id=payload.user_id,
        department=payload.department,
        title=payload.title,
        external_id=payload.external_id,
    )
    await db.commit()
    return chat_session


@router.get("", response_model=list[SessionSchema])
async def list_sessions(
    user_id: str,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id required")
    service = ChatService(db)
    sessions = await service.list_sessions(user_id)
    return sessions


@router.get("/{session_id}", response_model=SessionWithMessages)
async def get_session(
    session_id: UUID,
    limit: int | None = Query(default=None, ge=1, le=1000),
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    messages = await service.get_session_with_messages(session_id, limit=limit)
    return {
        "id": session_id,
        "user_id": db_session.user_id,
        "department": db_session.department,
        "title": db_session.title,
        "created_at": db_session.created_at,
        "updated_at": db_session.updated_at,
        "messages": messages,
    }


@router.post("/{session_id}/messages", status_code=201)
async def add_message(
    session_id: UUID,
    payload: MessageCreate,
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    message = await service.add_message(
        session_id=session_id,
        message=payload,
        user_id=db_session.user_id,
        department=db_session.department,
    )
    await db.commit()
    result = service.serialize_message(message)
    # Signal frontend about dispatched Celery tasks
    intent_type = getattr(message, '_intent_type', 'chat')
    result['task_dispatched'] = intent_type in ('sql', 'rag')
    result['intent_type'] = intent_type
    return result


@router.post("/search", response_model=list[SearchResult])
async def search_memory(
    payload: SearchQuery,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    results = await service.semantic_search(payload)
    return results


@router.get("/{session_id}/stream")
async def stream_session(session_id: UUID) -> StreamingResponse:
    """
    SSE endpoint: stream real-time events for a chat session.

    Celery workers publish to Redis channel `session:{session_id}` when tasks
    complete. This endpoint subscribes and forwards those events to the
    frontend via Server-Sent Events, replacing the old polling loop.
    """
    return StreamingResponse(
        _sse_event_generator(session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


async def _sse_event_generator(session_id: UUID):
    """Subscribe to Redis Pub/Sub and yield SSE events."""
    redis = get_redis()
    pubsub = redis.pubsub()
    channel = f"session:{session_id}"
    await pubsub.subscribe(channel)
    heartbeat_counter = 0
    try:
        while True:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=1.0
            )
            if message and message["type"] == "message":
                data = message["data"]
                if isinstance(data, bytes):
                    data = data.decode("utf-8")
                yield f"data: {data}\n\n"
            else:
                heartbeat_counter += 1
                if heartbeat_counter >= 15:
                    yield ": heartbeat\n\n"
                    heartbeat_counter = 0
            await asyncio.sleep(1.0)
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.aclose()
