from __future__ import annotations

from typing import Any, Iterable

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

from .config import get_settings

_client: QdrantClient | None = None


def get_qdrant_client() -> QdrantClient:
    global _client  # noqa: PLW0603
    if _client is None:
        settings = get_settings()
        _client = QdrantClient(
            url=settings.qdrant_http_url,
            grpc_port=settings.qdrant_grpc_url,
        )
        ensure_collections(_client, settings.embedding_dimension)
    return _client


def ensure_collections(client: QdrantClient, vector_size: int) -> None:
    collections = client.get_collections().collections
    existing = {collection.name for collection in collections}

    if "chat_chunks" not in existing:
        client.recreate_collection(
            collection_name="chat_chunks",
            vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
        )

    if "long_term_memory" not in existing:
        client.recreate_collection(
            collection_name="long_term_memory",
            vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
        )


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
    return client.search(
        collection_name=collection,
        query_vector=vector,
        limit=limit,
        query_filter=qmodels.Filter(
            must=[qmodels.FieldCondition(key=key, match=qmodels.MatchValue(value=value)) for key, value in (filters or {}).items()]
        )
        if filters
        else None,
    )
