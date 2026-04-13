"""Parent chunk storage and retrieval for Celery workers (sync).

Saves parent chunk content to PostgreSQL and fetches it by ID.
Used by the ingestion pipeline (save) and RAG retrieval (fetch).
"""
from __future__ import annotations

import json
import logging
from typing import Any
from uuid import uuid4

from src.core.database_pool import db_pool

logger = logging.getLogger(__name__)


def save_parent_chunks(
    document_id: str,
    parents: list[dict[str, Any]],
) -> list[str]:
    """Save parent chunks to PostgreSQL and return their UUIDs.

    Args:
        document_id: UUID of the Document that owns these chunks.
        parents: List of dicts with keys: content, page_number, headings, metadata.

    Returns:
        List of UUID strings for the created ChunkParent rows.
    """
    if not parents:
        return []

    ids: list[str] = []
    for parent in parents:
        parent_id = str(uuid4())
        ids.append(parent_id)

        headings = parent.get("headings", [])
        metadata = parent.get("metadata", {})

        db_pool.execute_query(
            """
            INSERT INTO chunk_parents (id, document_id, content, page_number, headings, metadata, created_at)
            VALUES (:id, :document_id, :content, :page_number, :headings, :metadata, NOW())
            """,
            {
                "id": parent_id,
                "document_id": document_id,
                "content": parent["content"],
                "page_number": parent.get("page_number", 0),
                "headings": json.dumps(headings),
                "metadata": json.dumps(metadata),
            },
        )

    logger.info(f"[parent_store] Saved {len(ids)} parent chunks for document {document_id}")
    return ids


def fetch_parent_content(parent_ids: list[str]) -> dict[str, str]:
    """Fetch parent chunk content from PostgreSQL by ID.

    Args:
        parent_ids: List of ChunkParent UUID strings.

    Returns:
        Dict mapping parent_id -> content text.
        Missing parents return empty string for backward compatibility.
    """
    if not parent_ids:
        return {}

    # Build parameterized query for batch fetch
    placeholders = ", ".join(f":id_{i}" for i in range(len(parent_ids)))
    params = {f"id_{i}": pid for i, pid in enumerate(parent_ids)}

    rows = db_pool.fetch_all(
        f"SELECT id, content FROM chunk_parents WHERE id IN ({placeholders})",
        params,
    )

    result = {pid: "" for pid in parent_ids}  # Default empty for missing
    for row in rows:
        row_id = str(row["id"]) if not isinstance(row["id"], str) else row["id"]
        result[row_id] = row["content"]

    return result
