from __future__ import annotations

import json
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ...api.deps import get_db_session
from ...repositories.sessions import SessionRepository
from ...schemas import (
    AdminSessionSummary,
    MessageSchema,
    RedisCacheEntry,
    RedisCacheResponse,
    QdrantCollectionSchema,
    QdrantPointSchema,
)
from ...redis_client import get_redis
from ...qdrant_client import get_qdrant_client

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/sessions", response_model=list[AdminSessionSummary])
async def list_admin_sessions(
    limit: int = Query(default=100, ge=1, le=1000),
    user_id: str | None = None,
    db: AsyncSession = Depends(get_db_session),
):
    repo = SessionRepository(db)
    sessions = await repo.list_sessions_with_counts(limit=limit, user_id=user_id)
    summaries: list[AdminSessionSummary] = []
    for session, count in sessions:
        summaries.append(
            AdminSessionSummary(
                id=session.id,
                user_id=session.user_id,
                department=session.department,
                title=session.title,
                created_at=session.created_at,
                updated_at=session.updated_at,
                message_count=count,
            )
        )
    return summaries


@router.get("/sessions/{session_id}/messages", response_model=list[MessageSchema])
async def get_admin_session_messages(
    session_id: UUID,
    db: AsyncSession = Depends(get_db_session),
):
    repo = SessionRepository(db)
    messages = await repo.get_session_messages(session_id)
    result: list[MessageSchema] = []
    for message in messages:
        result.append(
            MessageSchema(
                id=message.id,
                session_id=message.session_id,
                role=message.role,
                content=message.content,
                metadata=message.meta or {},
                created_at=message.created_at,
                chunks=[],
            )
        )
    return result


@router.get("/redis/cache", response_model=RedisCacheResponse)
async def list_redis_cache(session_id: UUID | None = None):
    redis = get_redis()
    pattern = "chat:session:*" if session_id is None else f"chat:session:{session_id}"

    entries: list[RedisCacheEntry] = []
    async for key_bytes in redis.scan_iter(match=pattern):
        key = key_bytes.decode() if isinstance(key_bytes, (bytes, bytearray)) else str(key_bytes)
        raw = await redis.get(key)
        ttl = await redis.ttl(key)
        message_count = 0
        size = len(raw) if raw else 0
        try:
            payload = json.loads(raw) if raw else []
            if isinstance(payload, list):
                message_count = len(payload)
        except json.JSONDecodeError:
            message_count = 0
        session_key = key.split(":")[-1]
        entries.append(
            RedisCacheEntry(
                key=key,
                session_id=session_key,
                ttl_seconds=ttl if ttl and ttl >= 0 else None,
                message_count=message_count,
                size_bytes=size,
            )
        )

    entries.sort(key=lambda item: item.session_id)
    return RedisCacheResponse(entries=entries)


@router.delete("/redis/cache/{session_id}")
async def delete_redis_cache_entry(session_id: UUID):
    redis = get_redis()
    key = f"chat:session:{session_id}"
    deleted = await redis.delete(key)
    return {"deleted": bool(deleted)}


@router.get("/qdrant/collections", response_model=list[QdrantCollectionSchema])
async def list_qdrant_collections():
    client = get_qdrant_client()
    data = client.get_collections()
    collections: list[QdrantCollectionSchema] = []
    for collection in data.collections:
        vectors_count = getattr(collection, "vectors_count", None)
        status = getattr(collection, "status", None)
        collections.append(
            QdrantCollectionSchema(
                name=collection.name,
                vectors_count=vectors_count or 0,
                status=status or "unknown",
            )
        )
    return collections


@router.get(
    "/qdrant/collections/{collection_name}/points",
    response_model=list[QdrantPointSchema],
)
async def list_qdrant_points(
    collection_name: str,
    limit: int = Query(default=10, ge=1, le=100),
):
    client = get_qdrant_client()
    points, _ = client.scroll(
        collection_name=collection_name,
        limit=limit,
        with_payload=True,
    )
    results: list[QdrantPointSchema] = []
    for point in points:
        point_id = str(point.id)
        payload = point.payload if isinstance(point.payload, dict) else {}
        results.append(QdrantPointSchema(id=point_id, payload=payload))
    return results
