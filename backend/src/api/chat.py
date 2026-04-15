from __future__ import annotations

import asyncio
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.models import ChatSession
from src.schemas.schemas import (
    BranchInfoSchema,
    BranchMessageSchema,
    ConversationTreeSchema,
    EditMessageRequest,
    MessageCreate,
    MessageSchema,
    NavigateBranchRequest,
    SearchQuery,
    SearchResult,
    SessionCreate,
    SessionSchema,
    SessionWithMessages,
)
from src.services.chat_service import ChatService
from src.services.conversation_tree import ConversationTree
from src.api.deps import get_db_session, get_session_or_404
from src.core.redis_client import get_redis
from src.core.cors import build_cors_headers


router = APIRouter(prefix="/sessions", tags=["sessions"])
messages_router = APIRouter(prefix="/messages", tags=["messages"])


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


# ── Conversation Branching Endpoints ──────────────────────────────────────

@router.post("/{session_id}/messages/{message_id}/edit", status_code=201)
async def edit_message(
    session_id: UUID,
    message_id: UUID,
    payload: EditMessageRequest,
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Create a new branch from a user message edit."""
    tree = ConversationTree(db)
    try:
        new_msg = await tree.edit_message(message_id, payload.content)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    await db.commit()

    # Dispatch chunk+embed for the new user message
    from src.worker.tasks import process_chat_response
    process_chat_response.delay(
        session_id=str(session_id),
        message_id=str(new_msg.id),
        content=new_msg.content,
        role=new_msg.role,
        user_id=db_session.user_id,
        department=db_session.department,
    )

    return {
        "id": str(new_msg.id),
        "session_id": str(new_msg.session_id),
        "role": new_msg.role,
        "content": new_msg.content,
        "parent_message_id": (
            str(new_msg.parent_message_id) if new_msg.parent_message_id else None
        ),
        "branch_index": new_msg.branch_index,
        "is_active_branch": new_msg.is_active_branch,
        "created_at": new_msg.created_at.isoformat(),
        "needs_ai_response": True,
    }


@router.post("/{session_id}/messages/{message_id}/regenerate", status_code=201)
async def regenerate_message(
    session_id: UUID,
    message_id: UUID,
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Regenerate an assistant response — creates a new sibling branch."""
    tree = ConversationTree(db)
    try:
        placeholder = await tree.regenerate(message_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    await db.commit()

    # Detect mode from original message metadata
    original_meta = placeholder.meta or {}
    regenerated_from = original_meta.get("regenerated_from")
    mode = "chat"
    if regenerated_from:
        from src.repositories.messages import MessageRepository
        repo = MessageRepository(db)
        orig = await repo.get_message_by_id(UUID(regenerated_from))
        if orig and orig.meta:
            mode = orig.meta.get("mode", "chat")
            if "rag_chunk_ids" in orig.meta:
                mode = "rag"

    # Find the user question (parent of the original assistant message)
    user_question = ""
    if placeholder.parent_message_id:
        from src.repositories.messages import MessageRepository
        repo = MessageRepository(db)
        parent_msg = await repo.get_message_by_id(placeholder.parent_message_id)
        if parent_msg and parent_msg.role == "user":
            user_question = parent_msg.content

    # Dispatch appropriate Celery task
    if mode == "rag":
        from src.worker.tasks import rag_document_search
        rag_document_search.delay(
            question=user_question,
            session_id=str(session_id),
            user_id=db_session.user_id,
            department=db_session.department,
            target_message_id=str(placeholder.id),
        )
    elif mode == "sql":
        from src.worker.tasks import run_sql_query
        run_sql_query.delay(
            question=user_question,
            session_id=str(session_id),
            user_id=db_session.user_id,
            target_message_id=str(placeholder.id),
        )
    else:
        from src.worker.tasks import process_chat_response
        process_chat_response.delay(
            session_id=str(session_id),
            message_id=str(placeholder.id),
            content=user_question,
            role="user",
            user_id=db_session.user_id,
            department=db_session.department,
        )

    return {
        "id": str(placeholder.id),
        "session_id": str(placeholder.session_id),
        "role": placeholder.role,
        "content": placeholder.content,
        "parent_message_id": (
            str(placeholder.parent_message_id) if placeholder.parent_message_id else None
        ),
        "branch_index": placeholder.branch_index,
        "is_active_branch": placeholder.is_active_branch,
        "created_at": placeholder.created_at.isoformat(),
        "regenerating": True,
    }


@router.get("/{session_id}/messages/{message_id}/branches")
async def get_branch_info(
    session_id: UUID,
    message_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Return branching metadata for a single message."""
    tree = ConversationTree(db)
    info = await tree.get_branch_info(message_id)
    if info is None:
        raise HTTPException(status_code=404, detail="Tin nhắn không tồn tại")
    return BranchInfoSchema(
        current_index=info.branch_index + 1,  # 1-based for frontend
        total_branches=info.total_siblings,
        sibling_ids=[str(sid) for sid in info.sibling_ids],
        fork_point_id=str(info.parent_message_id) if info.parent_message_id else None,
    )


@router.post("/{session_id}/messages/{message_id}/navigate")
async def navigate_branch(
    session_id: UUID,
    message_id: UUID,
    payload: NavigateBranchRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Switch to an adjacent sibling branch."""
    tree = ConversationTree(db)
    try:
        target = await tree.navigate_branch(message_id, payload.direction)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    await db.commit()
    return BranchMessageSchema(
        id=str(target.id),
        session_id=str(target.session_id),
        role=target.role,
        content=target.content,
        metadata=target.meta or {},
        created_at=target.created_at.isoformat(),
        parent_message_id=(
            str(target.parent_message_id) if target.parent_message_id else None
        ),
        branch_index=target.branch_index,
        is_active_branch=target.is_active_branch,
    )


@router.get("/{session_id}/tree")
async def get_conversation_tree(
    session_id: UUID,
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Return the full conversation tree for visualization."""
    tree = ConversationTree(db)
    flat_nodes = await tree.get_full_tree(session_id)
    return ConversationTreeSchema(
        session_id=str(session_id),
        roots=_build_tree_nodes(flat_nodes),
    )


def _build_tree_nodes(flat_nodes: list[dict]) -> list:
    """Convert flat node list to nested TreeNodeSchema structure."""
    from src.schemas.schemas import TreeNodeSchema

    node_map: dict[str, dict] = {}
    for node in flat_nodes:
        node_map[node["id"]] = {
            **node,
            "content": node["content"][:100],
            "children": [],
        }

    roots = []
    for node in flat_nodes:
        entry = node_map[node["id"]]
        tree_node = TreeNodeSchema(
            id=entry["id"],
            role=entry["role"],
            content=entry["content"],
            parent_id=entry.get("parent_message_id"),
            branch_index=entry.get("branch_index", 0),
            is_active=entry.get("is_active_branch", True),
            created_at=entry["created_at"],
        )
        if entry.get("parent_message_id") and entry["parent_message_id"] in node_map:
            parent = node_map[entry["parent_message_id"]]
            parent["children"].append(tree_node)
        else:
            roots.append(tree_node)

    # Attach children recursively
    def _attach_children(tree_node: TreeNodeSchema) -> TreeNodeSchema:
        node_data = node_map.get(tree_node.id, {})
        for child in node_data.get("children", []):
            child_with_kids = _attach_children(child)
            tree_node.children.append(child_with_kids)
        return tree_node

    return [_attach_children(r) for r in roots]


# ── PATCH endpoint for Celery to update placeholder messages ─────────────

class _UpdateContentRequest(BaseModel):
    content: str
    metadata: dict[str, Any] | None = None


@messages_router.patch("/{message_id}/content")
async def update_message_content(
    message_id: UUID,
    payload: _UpdateContentRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Update a placeholder message's content (used by Celery workers)."""
    from src.repositories.messages import MessageRepository
    repo = MessageRepository(db)
    msg = await repo.update_message_content(
        message_id, payload.content, payload.metadata
    )
    if msg is None:
        raise HTTPException(status_code=404, detail="Tin nhắn không tồn tại")
    await db.commit()
    return {"id": str(msg.id), "content": msg.content, "status": "updated"}


@messages_router.patch("/{message_id}/metadata")
async def update_message_metadata(
    message_id: UUID,
    payload: dict[str, Any],
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Merge metadata into an existing message (used by Celery workers)."""
    from src.repositories.messages import MessageRepository
    repo = MessageRepository(db)
    msg = await repo.get_message_by_id(message_id)
    if msg is None:
        raise HTTPException(status_code=404, detail="Tin nhắn không tồn tại")
    existing_meta = msg.meta or {}
    existing_meta.update(payload)
    msg.meta = existing_meta
    await db.flush()
    await db.commit()
    return {"id": str(msg.id), "status": "metadata_updated"}


# ── SSE Streaming Endpoints ──────────────────────────────────────────────

@router.options("/{session_id}/stream")
async def stream_session_preflight(session_id: UUID, request: Request):
    """Handle CORS preflight for the SSE stream endpoint."""
    from fastapi.responses import Response
    return Response(
        status_code=204,
        headers=build_cors_headers(request, is_preflight=True, is_sse=True),
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
    cors = build_cors_headers(request, is_sse=True)

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
            **cors,
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
