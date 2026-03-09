from __future__ import annotations

import asyncio
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
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
from src.core.config import get_settings


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


@router.options("/{session_id}/stream")
async def stream_session_preflight(session_id: UUID, request: Request):
    """Handle CORS preflight for the SSE stream endpoint."""
    from fastapi.responses import Response
    settings = get_settings()
    origin = request.headers.get("origin", "")
    if "*" in settings.allowed_origins:
        allow_origin = "*"
    elif origin in settings.allowed_origins:
        allow_origin = origin
    elif settings.allowed_origins:
        allow_origin = settings.allowed_origins[0]
    else:
        allow_origin = "*"
    return Response(
        status_code=204,
        headers={
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400",
            "Vary": "Origin",
        },
    )


@router.get("/{session_id}/stream")
async def stream_session(session_id: UUID, request: Request) -> StreamingResponse:
    """
    SSE endpoint: stream real-time events for a chat session.

    Celery workers publish to Redis channel `session:{session_id}` when tasks
    complete. This endpoint subscribes and forwards those events to the
    frontend via Server-Sent Events, replacing the old polling loop.

    CORS headers are injected manually because FastAPI middleware does not
    apply them to StreamingResponse (long-lived connections bypass middleware).
    Heartbeat every 20s keeps Cloudflare from closing the connection (100s timeout).
    """
    settings = get_settings()
    origin = request.headers.get("origin", "")
    # Resolve the correct Allow-Origin value for this request
    if "*" in settings.allowed_origins:
        allow_origin = "*"
    elif origin in settings.allowed_origins:
        allow_origin = origin
    elif settings.allowed_origins:
        allow_origin = settings.allowed_origins[0]
    else:
        allow_origin = "*"

    return StreamingResponse(
        _sse_event_generator(session_id),
        media_type="text/event-stream",
        headers={
            # SSE transport headers
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",          # disable nginx/Cloudflare buffering
            "Transfer-Encoding": "chunked",
            # CORS — must be set explicitly on StreamingResponse
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Vary": "Origin",
        },
    )


async def _sse_event_generator(session_id: UUID):
    """Subscribe to Redis Pub/Sub and yield SSE events.

    Heartbeat every 20s (was 15s) to stay well under Cloudflare's 100s idle timeout.
    After receiving message_ready the generator sends the event and exits cleanly
    so the client can re-open a fresh connection if needed.
    """
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
                # Close stream after delivering the event — client will reconnect if needed
                return
            else:
                heartbeat_counter += 1
                if heartbeat_counter >= 20:   # every ~20s (was 15s)
                    yield ": heartbeat\n\n"
                    heartbeat_counter = 0
            await asyncio.sleep(1.0)
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.aclose()
