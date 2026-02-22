from __future__ import annotations

from typing import Any, Iterable

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

from src.core.config import get_settings

_client: QdrantClient | None = None


def get_qdrant_client() -> QdrantClient:
    global _client  # noqa: PLW0603
    if _client is None:
        settings = get_settings()
        grpc_port = None
        if settings.qdrant_grpc_url:
            try:
                grpc_port = int(settings.qdrant_grpc_url)
            except ValueError:
                # If it's a URL like "http://qdrant:6334", extract the port
                from urllib.parse import urlparse
                parsed = urlparse(settings.qdrant_grpc_url)
                grpc_port = parsed.port
        _client = QdrantClient(
            url=settings.qdrant_http_url,
            grpc_port=grpc_port,
        )
        ensure_collections(_client, settings.embedding_dimension)
    return _client


def _ensure_payload_indexes(client: QdrantClient, collection_name: str, fields: list[str]) -> None:
    """Create payload indexes for fast filtered search. Safe to call on existing collections."""
    for field in fields:
        try:
            client.create_payload_index(
                collection_name=collection_name,
                field_name=field,
                field_schema=qmodels.PayloadSchemaType.KEYWORD,
            )
        except Exception:
            pass  # index already exists → ignore


def ensure_collections(client: QdrantClient, vector_size: int) -> None:
    """Ensure all required Qdrant collections exist with correct vector dimensions.

    Collections (all use Vietnamese_Embedding_v2, 1024 dim):
      - chat_chunks: short-term chat message embeddings
      - port_knowledge: uploaded document chunks (RAG)
      - vanna_schemas_openai: Vanna SQL schema embeddings
      - mem0_memories: managed by Mem0 SDK (created automatically)
    """
    collections = client.get_collections().collections
    existing = {collection.name for collection in collections}

    for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai"):
        if name not in existing:
            client.create_collection(
                collection_name=name,
                vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
            )

    # Payload indexes for fast filtered search on user_id, session_id, department
    _ensure_payload_indexes(client, "chat_chunks", ["user_id", "session_id", "department"])
    _ensure_payload_indexes(client, "port_knowledge", ["user_id", "department"])


def upsert_vectors(
    collection: str,
    payloads: Iterable[dict[str, Any]],
    vectors: Iterable[list[float]],
    ids: Iterable[str] | None = None,
) -> None:
    client = get_qdrant_client()
    client.upsert(
        collection_name=collection,
        points=qmodels.Batch(
            ids=list(ids) if ids is not None else None,
            vectors=list(vectors),
            payloads=list(payloads),
        ),
    )


def search_vectors(
    collection: str,
    vector: list[float],
    limit: int = 5,
    filters: dict[str, Any] | None = None,
) -> list[qmodels.ScoredPoint]:
    client = get_qdrant_client()
    return client.query_points(
        collection_name=collection,
        query=vector,
        limit=limit,
        query_filter=qmodels.Filter(
            must=[qmodels.FieldCondition(key=key, match=qmodels.MatchValue(value=value)) for key, value in (filters or {}).items()]
        )
        if filters
        else None,
    ).points
