"""
Lexical search service — Whoosh BM25.

Ported from Smart2Brain's MiniSearchService. Provides keyword-based BM25
retrieval to complement Qdrant semantic search.

Index schema:
  - doc_id:     unique document/chunk ID
  - title:      source filename (2x boost)
  - content:    chunk text
  - tags:       comma-separated keywords (1.5x boost)
  - department: access control
  - user_id:    access control

Index location: /data/whoosh_index (Docker volume)
"""

from __future__ import annotations

import logging
import os
import threading
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# ── Index location ───────────────────────────────────────────────────────
WHOOSH_INDEX_DIR = os.getenv("WHOOSH_INDEX_DIR", "/data/whoosh_index")

# Singleton lock for thread-safe index access
_index_lock = threading.Lock()
_cached_index = None


def _get_schema():
    """Build the Whoosh schema with field boosts matching S2B config."""
    from whoosh.fields import ID, KEYWORD, TEXT, SchemaClass

    class SearchSchema(SchemaClass):
        doc_id = ID(stored=True, unique=True)
        title = TEXT(stored=True, field_boost=2.0)       # S2B: title 2x
        content = TEXT(stored=True)
        tags = KEYWORD(stored=True, commas=True, scorable=True, field_boost=1.5)  # S2B: tags 1.5x
        department = ID(stored=True)
        user_id = ID(stored=True)

    return SearchSchema


def _get_or_create_index():
    """Get or create the Whoosh index (thread-safe singleton)."""
    global _cached_index  # noqa: PLW0603
    if _cached_index is not None:
        return _cached_index

    with _index_lock:
        # Double-check after acquiring lock
        if _cached_index is not None:
            return _cached_index

        from whoosh.index import create_in, exists_in, open_dir

        index_path = Path(WHOOSH_INDEX_DIR)
        index_path.mkdir(parents=True, exist_ok=True)

        if exists_in(str(index_path)):
            logger.info(f"[LexicalSearch] Opening existing index at {index_path}")
            _cached_index = open_dir(str(index_path))
        else:
            logger.info(f"[LexicalSearch] Creating new index at {index_path}")
            schema = _get_schema()
            _cached_index = create_in(str(index_path), schema)

        return _cached_index


class LexicalSearchService:
    """BM25 lexical search using Whoosh.

    Thread-safe. Uses a process-level singleton for the index.
    Writer operations use locking internally via Whoosh.
    """

    def __init__(self, index_dir: str | None = None):
        if index_dir:
            global WHOOSH_INDEX_DIR  # noqa: PLW0603
            WHOOSH_INDEX_DIR = index_dir
        self._index = _get_or_create_index()

    def search(
        self,
        query: str,
        limit: int = 100,
        user_id: str | None = None,
        department: str | None = None,
    ) -> list[dict[str, Any]]:
        """Search using BM25 scoring.

        Parameters
        ----------
        query : str
            Search query text.
        limit : int
            Maximum results to return.
        user_id, department : str | None
            Access control filters (OR logic: user's own OR department-public).

        Returns
        -------
        list[dict]
            Results with keys: doc_id, title, content, tags, score, rank.
        """
        if not query or not query.strip():
            return []

        try:
            from whoosh.qparser import MultifieldParser, OrGroup

            with self._index.searcher() as searcher:
                # Parse query across title + content + tags
                parser = MultifieldParser(
                    ["title", "content", "tags"],
                    schema=self._index.schema,
                    group=OrGroup,
                )
                parsed = parser.parse(query)
                raw_results = searcher.search(parsed, limit=limit)

                results: list[dict[str, Any]] = []
                for rank, hit in enumerate(raw_results):
                    hit_user = hit.get("user_id", "")
                    hit_dept = hit.get("department", "")

                    # Access control: user's own OR same department
                    if user_id and hit_user == user_id:
                        pass  # User's own doc — always visible
                    elif department and hit_dept == department:
                        pass  # Same department — visible
                    elif not user_id and not department:
                        pass  # No filter — include all
                    else:
                        continue  # Skip: no access

                    results.append({
                        "doc_id": hit.get("doc_id", ""),
                        "title": hit.get("title", ""),
                        "content": hit.get("content", ""),
                        "tags": hit.get("tags", ""),
                        "score": hit.score,
                        "rank": rank,
                    })

                return results

        except Exception:
            logger.exception("[LexicalSearch] Search error")
            return []

    def index_document(
        self,
        doc_id: str,
        title: str,
        content: str,
        tags: str = "",
        department: str = "",
        user_id: str = "",
    ) -> None:
        """Index or update a single document in the Whoosh index.

        Uses ``update_document`` for idempotent upsert by ``doc_id``.
        """
        try:
            writer = self._index.writer()
            writer.update_document(
                doc_id=doc_id,
                title=title,
                content=content,
                tags=tags,
                department=department,
                user_id=user_id,
            )
            writer.commit()
            logger.debug(f"[LexicalSearch] Indexed doc {doc_id}: {title[:50]}")
        except Exception:
            logger.exception(f"[LexicalSearch] Failed to index doc {doc_id}")

    def index_documents_batch(
        self,
        documents: list[dict[str, str]],
    ) -> int:
        """Batch-index multiple documents in a single writer session.

        Parameters
        ----------
        documents : list[dict]
            Each dict must have: doc_id, title, content.
            Optional: tags, department, user_id.

        Returns
        -------
        int
            Number of documents successfully indexed.
        """
        if not documents:
            return 0

        try:
            writer = self._index.writer()
            count = 0
            for doc in documents:
                try:
                    writer.update_document(
                        doc_id=doc["doc_id"],
                        title=doc.get("title", ""),
                        content=doc.get("content", ""),
                        tags=doc.get("tags", ""),
                        department=doc.get("department", ""),
                        user_id=doc.get("user_id", ""),
                    )
                    count += 1
                except Exception:
                    logger.warning(f"[LexicalSearch] Skipped doc {doc.get('doc_id', '?')}")
            writer.commit()
            logger.info(f"[LexicalSearch] Batch indexed {count}/{len(documents)} docs")
            return count
        except Exception:
            logger.exception("[LexicalSearch] Batch index error")
            return 0

    def remove_document(self, doc_id: str) -> None:
        """Remove a document from the index by doc_id."""
        try:
            writer = self._index.writer()
            writer.delete_by_term("doc_id", doc_id)
            writer.commit()
            logger.debug(f"[LexicalSearch] Removed doc {doc_id}")
        except Exception:
            logger.exception(f"[LexicalSearch] Failed to remove doc {doc_id}")

    def rebuild_index(self) -> int:
        """Rebuild the entire Whoosh index from PostgreSQL document data.

        Fetches all documents from the DB and re-indexes them.
        This is a recovery mechanism — use when index is corrupted.

        Returns
        -------
        int
            Number of documents indexed.
        """
        import psycopg2

        db_url = os.getenv("DATABASE_URL", "")
        # Convert async URL to sync for psycopg2
        sync_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

        logger.info("[LexicalSearch] Rebuilding index from PostgreSQL...")

        try:
            conn = psycopg2.connect(sync_url)
            cur = conn.cursor()
            cur.execute(
                "SELECT id, filename, user_id, department FROM documents WHERE status = 'ready'"
            )
            rows = cur.fetchall()
            cur.close()
            conn.close()

            if not rows:
                logger.info("[LexicalSearch] No documents found for rebuilding")
                return 0

            # Clear existing index
            from whoosh.index import create_in
            schema = _get_schema()
            index_path = Path(WHOOSH_INDEX_DIR)
            index_path.mkdir(parents=True, exist_ok=True)
            self._index = create_in(str(index_path), schema)

            # Re-fetch chunk data from Qdrant and index
            from src.core.qdrant_setup import get_qdrant_client
            qdrant = get_qdrant_client()
            total = 0

            for doc_id, filename, uid, dept in rows:
                try:
                    # Scroll Qdrant for this document's chunks
                    points, _ = qdrant.scroll(
                        collection_name="port_knowledge",
                        scroll_filter={
                            "must": [{"key": "document_id", "match": {"value": str(doc_id)}}]
                        },
                        limit=500,
                    )
                    for point in points:
                        payload = point.payload or {}
                        self.index_document(
                            doc_id=str(point.id),
                            title=filename or "",
                            content=payload.get("text", ""),
                            tags=",".join(payload.get("headings", [])),
                            department=dept or "",
                            user_id=uid or "",
                        )
                        total += 1
                except Exception:
                    logger.warning(f"[LexicalSearch] Skip doc {doc_id} during rebuild")

            logger.info(f"[LexicalSearch] Rebuild complete: {total} chunks indexed")
            return total

        except Exception:
            logger.exception("[LexicalSearch] Rebuild failed")
            return 0

    @property
    def doc_count(self) -> int:
        """Return the number of documents in the index."""
        try:
            return self._index.doc_count()
        except Exception:
            return 0
