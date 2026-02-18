from __future__ import annotations

from typing import Any
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...models import ChatSession
from ...schemas import (
    MessageCreate,
    MessageSchema,
    SearchQuery,
    SearchResult,
    SessionCreate,
    SessionSchema,
    SessionWithMessages,
)
from ...services.chat_service import ChatService
from ..deps import get_db_session, get_session_or_404


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


@router.post("/{session_id}/messages", response_model=MessageSchema, status_code=201)
async def add_message(
    session_id: UUID,
    payload: MessageCreate,
    background_tasks: BackgroundTasks,
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    message = await service.add_message(
        session_id=session_id,
        message=payload,
        background_tasks=background_tasks,
        user_id=db_session.user_id,
        department=db_session.department,
    )
    await db.commit()
    return service.serialize_message(message)


@router.post("/search", response_model=list[SearchResult])
async def search_memory(
    payload: SearchQuery,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    results = await service.semantic_search(payload)
    return results
