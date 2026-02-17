"""
Lightweight memory service exposing a Mem0-like API over HTTP.

Endpoints:
- GET /health: check Qdrant connectivity.
- POST /search: semantic search over stored memories.
- POST /add: persist a new memory entry.

Environment variables:
- QDRANT_URL (default: http://localhost:6333)
- MEM0_COLLECTION (default: mem0_memory)
- EMBEDDING_DIMENSION (default: 8)
"""

from __future__ import annotations

import hashlib
import math
import os
from typing import Any, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels


app = FastAPI(title="Mem0 Memory Service", version="0.1.0")


class SearchRequest(BaseModel):
    query: str
    user_id: Optional[str] = Field(default=None, description="Stable user identifier")
    limit: int = Field(default=5, ge=1, le=50)


class SearchResult(BaseModel):
    id: str
    text: str
    metadata: dict[str, Any]
    score: float


class AddRequest(BaseModel):
    text: str
    user_id: Optional[str] = Field(default=None, description="Stable user identifier")
    metadata: dict[str, Any] | None = None


_client: QdrantClient | None = None


def get_embedding_dimension() -> int:
    try:
        return int(os.getenv("EMBEDDING_DIMENSION", "8"))
    except ValueError:
        return 8


def mock_embed(text: str) -> list[float]:
    """
    Deterministic hash-based embedding; matches dimension configured for Qdrant.
    """
    dim = get_embedding_dimension() or 8
    vector = [0.0] * dim
    if not text:
        return vector

    tokens = text.split()
    for index, token in enumerate(tokens):
        digest = hashlib.sha256(token.encode("utf-8")).hexdigest()
        value = int(digest[:8], 16) / float(0xFFFFFFFF)
        bucket = index % dim
        vector[bucket] += value

    norm = math.sqrt(sum(x * x for x in vector)) or 1.0
    return [x / norm for x in vector]


def get_qdrant_client() -> QdrantClient:
    global _client  # noqa: PLW0603
    if _client is None:
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        _client = QdrantClient(url=qdrant_url)
        ensure_collection(_client)
    return _client


def ensure_collection(client: QdrantClient) -> None:
    collection_name = os.getenv("MEM0_COLLECTION", "mem0_memory")
    dim = get_embedding_dimension()
    collections = client.get_collections().collections
    existing = {item.name for item in collections}
    if collection_name not in existing:
        client.recreate_collection(
            collection_name=collection_name,
            vectors_config=qmodels.VectorParams(size=dim, distance=qmodels.Distance.COSINE),
        )


@app.get("/health")
def health_check() -> dict[str, str]:
    client = get_qdrant_client()
    try:
        client.get_collections()
    except Exception as exc:  # pragma: no cover - runtime check
        raise HTTPException(status_code=503, detail=f"Qdrant unreachable: {exc}") from exc
    return {"status": "ok"}


@app.post("/search", response_model=list[SearchResult])
def search_memory(payload: SearchRequest) -> list[SearchResult]:
    client = get_qdrant_client()
    collection_name = os.getenv("MEM0_COLLECTION", "mem0_memory")
    vector = mock_embed(payload.query)

    filters = []
    if payload.user_id:
        filters.append(
            qmodels.FieldCondition(
                key="user_id",
                match=qmodels.MatchValue(value=payload.user_id),
            )
        )

    points = client.search(
        collection_name=collection_name,
        query_vector=vector,
        limit=payload.limit,
        query_filter=qmodels.Filter(must=filters) if filters else None,
        with_payload=True,
    )

    results: list[SearchResult] = []
    for point in points:
        text = ""
        payload_data: dict[str, Any] = {}
        if isinstance(point.payload, dict):
            payload_data = point.payload
            text = payload_data.get("text") or payload_data.get("content") or ""

        results.append(
            SearchResult(
                id=str(point.id),
                text=text,
                metadata=payload_data,
                score=point.score or 0.0,
            )
        )
    return results


@app.post("/add")
def add_memory(payload: AddRequest) -> dict[str, Any]:
    client = get_qdrant_client()
    collection_name = os.getenv("MEM0_COLLECTION", "mem0_memory")
    vector = mock_embed(payload.text)
    point_id = str(uuid4())

    metadata = payload.metadata.copy() if payload.metadata else {}
    metadata.update({"user_id": payload.user_id, "text": payload.text})

    client.upsert(
        collection_name=collection_name,
        points=qmodels.Batch(
            ids=[point_id],
            vectors=[vector],
            payloads=[metadata],
        ),
    )

    return {"id": point_id, "status": "ok"}


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8100")),
        reload=True,
    )
