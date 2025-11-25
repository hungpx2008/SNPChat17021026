"""
Lightweight wrapper around the Qdrant client for managing vector operations.
"""

from __future__ import annotations

import os
from typing import Iterable, Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

QDRANT_URL = os.getenv("QDRANT_URL")
if not QDRANT_URL:
    raise RuntimeError("QDRANT_URL environment variable is required")

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

_client: Optional[QdrantClient] = None


def get_qdrant_client() -> QdrantClient:
    """
    Create or return the shared Qdrant client.
    """
    global _client  # noqa: PLW0603
    if _client is None:
        _client = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY,
        )
    return _client


def upsert_vectors(
    collection_name: str,
    vectors: Iterable[list[float]],
    payloads: Iterable[dict],
    ids: Optional[Iterable[str]] = None,
) -> None:
    """
    Persist embeddings to Qdrant.

    Args:
        collection_name: Target collection.
        vectors: Sequence of embedding vectors.
        payloads: Metadata dictionaries aligned to vectors.
        ids: Optional deterministic IDs for the points.
    """
    client = get_qdrant_client()
    client.upsert(
        collection_name=collection_name,
        points=qmodels.Batch(
            ids=list(ids) if ids is not None else None,
            vectors=list(vectors),
            payloads=list(payloads),
        ),
    )


def delete_vectors(collection_name: str, point_ids: Iterable[str]) -> None:
    """
    Remove points from a collection.
    """
    client = get_qdrant_client()
    client.delete(
        collection_name=collection_name,
        points_selector=qmodels.PointIdsList(points=list(point_ids)),
    )


def check_qdrant_connection() -> bool:
    """
    Health probe that requests the collection list.
    """
    try:
        client = get_qdrant_client()
        client.get_collections()
        return True
    except Exception:
        return False
