"""
Memories API — thin REST proxy for local mem0.Memory.

Replaces the standalone mem0-service endpoints that the frontend used to call
directly. Now the backend handles it via mem0_local.py (in-process).
"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/memories", tags=["memories"])


class MemorySearchRequest(BaseModel):
    query: str
    user_id: str | None = None
    limit: int = 5


class MemoryAddRequest(BaseModel):
    messages: list[dict[str, str]]
    user_id: str | None = None
    metadata: dict[str, Any] | None = None


@router.post("/search")
def memory_search(req: MemorySearchRequest) -> dict:
    """Search long-term memories via mem0."""
    from src.core.mem0_local import search_memories

    result = search_memories(
        query=req.query,
        user_id=req.user_id,
        limit=req.limit,
    )
    # Normalize: mem0 SDK may return dict with "results" key or a list
    if isinstance(result, dict):
        return {"results": result.get("results", [])}
    if isinstance(result, list):
        return {"results": result}
    return {"results": []}


@router.post("/add")
def memory_add(req: MemoryAddRequest) -> dict:
    """Store new memories via mem0."""
    from src.core.mem0_local import add_memory

    result = add_memory(
        messages=req.messages,
        user_id=req.user_id,
        metadata=req.metadata,
    )
    return {"status": "ok", "result": result}
