"""
Hybrid search — Semantic + BM25 + RRF fusion.

Ported from Smart2Brain ``hybridSearch()`` in ``searchNotes.ts`` (lines 91-149).

Algorithm:
  1. Run semantic (Qdrant) + lexical (Whoosh) in parallel
  2. Build RRF score map: score = 1/(k + rank + 1) per source
  3. Merge: if same doc appears in both, add scores
  4. Apply title + tag boost post-fusion
  5. Sort by combined score, return top N

Constants (from S2B):
  - RRF_K = 60 (standard RRF constant)
  - TITLE_BOOST_MAX = 0.03
  - TAG_BOOST_MAX = 0.02
"""

from __future__ import annotations

import logging
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from typing import Any

from .lexical_search import LexicalSearchService
from .search_ranking import (
    TAG_BOOST_MAX,
    TITLE_BOOST_MAX,
    calculate_combined_boost,
)

logger = logging.getLogger(__name__)

# ── Constants from Smart2Brain ───────────────────────────────────────────
RRF_K = 60  # Standard Reciprocal Rank Fusion constant


@dataclass
class SearchResult:
    """Unified search result from hybrid pipeline."""

    doc_id: str
    title: str = ""
    content: str = ""
    tags: str = ""
    score: float = 0.0
    semantic_score: float = 0.0
    lexical_score: float = 0.0
    rrf_score: float = 0.0
    boost_score: float = 0.0
    source: str = ""  # "semantic", "lexical", "both"
    metadata: dict[str, Any] = field(default_factory=dict)
    parent_id: str = ""  # ChunkParent UUID — empty for legacy flat chunks


class HybridSearchService:
    """Hybrid search combining Qdrant semantic + Whoosh BM25 with RRF fusion.

    Parameters
    ----------
    lexical : LexicalSearchService | None
        Lexical search instance. Created automatically if None.
    semantic_top_k : int
        Number of results from semantic search (default 20 for RRF).
    lexical_limit : int
        Number of results from lexical search (default 100, Whoosh pre-filters).
    """

    def __init__(
        self,
        lexical: LexicalSearchService | None = None,
        semantic_top_k: int = 20,
        lexical_limit: int = 100,
    ):
        self._lexical = lexical or LexicalSearchService()
        self._semantic_top_k = semantic_top_k
        self._lexical_limit = lexical_limit

    def search(
        self,
        query: str | list[str],
        user_id: str | None = None,
        department: str | None = None,
        limit: int = 5,
        score_threshold: float = 0.0,
    ) -> list[SearchResult]:
        """Run hybrid search with single query or multiple sub-queries.

        When query is a list (from QueryEnhancer decomposition):
          1. Run _single_search for each sub-query in parallel
          2. Merge results across sub-queries by doc_id (keep max score)
          3. Sort by score descending, return top-limit

        Parameters
        ----------
        query : str | list[str]
            Single search query or list of sub-queries.
        user_id, department : str | None
            Access control filters.
        limit : int
            Final number of results to return.
        score_threshold : float
            Minimum semantic score for semantic results (pre-RRF filter).

        Returns
        -------
        list[SearchResult]
            Top results sorted by fused RRF + boost score.
        """
        # Handle list of sub-queries (from QueryEnhancer decomposition)
        if isinstance(query, list):
            if not query:
                return []

            # Single-item list: treat as plain string
            if len(query) == 1:
                return self._single_search(
                    query=query[0],
                    user_id=user_id,
                    department=department,
                    limit=limit,
                    score_threshold=score_threshold,
                )

            # Multiple sub-queries: search in parallel, merge results
            return self._multi_query_search(
                queries=query,
                user_id=user_id,
                department=department,
                limit=limit,
                score_threshold=score_threshold,
            )

        # Plain string query
        return self._single_search(
            query=query,
            user_id=user_id,
            department=department,
            limit=limit,
            score_threshold=score_threshold,
        )

    def _multi_query_search(
        self,
        queries: list[str],
        user_id: str | None,
        department: str | None,
        limit: int,
        score_threshold: float,
    ) -> list[SearchResult]:
        """Search multiple sub-queries in parallel and merge results.

        Dedup by doc_id: when the same document appears in results from
        multiple sub-queries, keep the one with the highest score.
        """
        logger.info(
            f"[HybridSearch] Multi-query search: {len(queries)} sub-queries"
        )

        # Search each sub-query in parallel
        with ThreadPoolExecutor(max_workers=min(len(queries), 4)) as executor:
            futures = [
                executor.submit(
                    self._single_search,
                    query=q,
                    user_id=user_id,
                    department=department,
                    limit=limit,  # Get full limit per sub-query before merge
                    score_threshold=score_threshold,
                )
                for q in queries
            ]
            all_results: list[list[SearchResult]] = [f.result() for f in futures]

        # Merge by doc_id: keep max score
        merged: dict[str, SearchResult] = {}
        for results in all_results:
            for result in results:
                doc_id = result.doc_id
                if doc_id not in merged or result.score > merged[doc_id].score:
                    merged[doc_id] = result

        # Sort by score descending, return top-limit
        sorted_results = sorted(merged.values(), key=lambda r: r.score, reverse=True)

        logger.info(
            f"[HybridSearch] Multi-query merged: "
            f"{sum(len(r) for r in all_results)} total → "
            f"{len(sorted_results)} unique docs"
        )

        return sorted_results[:limit]

    def _single_search(
        self,
        query: str,
        user_id: str | None = None,
        department: str | None = None,
        limit: int = 5,
        score_threshold: float = 0.0,
    ) -> list[SearchResult]:
        """Run hybrid search for a single query: semantic + lexical + RRF fusion.

        This is the original search() implementation, refactored into a private
        method so search() can dispatch to either single or multi-query mode.
        """
        if not query or not query.strip():
            return []

        logger.info(f"[HybridSearch] Query: {query[:80]}...")

        # Run semantic + lexical in parallel using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=2) as executor:
            semantic_future = executor.submit(
                self._semantic_search, query, user_id, department, score_threshold
            )
            lexical_future = executor.submit(
                self._lexical_search, query, user_id, department
            )

            semantic_results = semantic_future.result()
            lexical_results = lexical_future.result()

        logger.info(
            f"[HybridSearch] Semantic: {len(semantic_results)} results, "
            f"Lexical: {len(lexical_results)} results"
        )

        # Fuse with RRF
        fused = self._rrf_fusion(semantic_results, lexical_results)

        # Apply title + tag boost post-fusion
        for result in fused:
            boost = calculate_combined_boost(query, result.title, result.tags)
            result.boost_score = boost
            result.score = result.rrf_score + boost

        # Sort by final score descending
        fused.sort(key=lambda r: r.score, reverse=True)

        # Return top N
        top_results = fused[:limit]

        if top_results:
            logger.info(
                f"[HybridSearch] Top result: {top_results[0].title[:40]} "
                f"score={top_results[0].score:.4f} "
                f"(rrf={top_results[0].rrf_score:.4f} + boost={top_results[0].boost_score:.4f}) "
                f"source={top_results[0].source}"
            )

        return top_results

    def _semantic_search(
        self,
        query: str,
        user_id: str | None,
        department: str | None,
        score_threshold: float,
    ) -> list[dict[str, Any]]:
        """Run Qdrant semantic search using direct client (no LlamaIndex)."""
        try:
            from src.core.qdrant_setup import get_qdrant_client
            from src.worker.chat_tasks import embed_query
            from src.worker.rag.search_helpers import _build_qdrant_filter

            query_vector = embed_query(query)
            qdrant = get_qdrant_client()
            qdrant_filter = _build_qdrant_filter(user_id, department)

            points = qdrant.query_points(
                collection_name="port_knowledge",
                query=query_vector,
                query_filter=qdrant_filter,
                limit=self._semantic_top_k,
            ).points

            results = []
            for rank, point in enumerate(points):
                score = getattr(point, "score", 0.0) or 0.0
                if score < score_threshold:
                    continue

                payload = point.payload or {}
                content = payload.get("content", "")

                results.append({
                    "doc_id": str(point.id) if point.id else "",
                    "title": payload.get("source_file", ""),
                    "content": content,
                    "tags": ",".join(payload.get("headings", [])),
                    "score": score,
                    "rank": rank,
                    "metadata": payload,
                })

            return results

        except Exception:
            logger.exception("[HybridSearch] Semantic search error")
            return []

    def _lexical_search(
        self,
        query: str,
        user_id: str | None,
        department: str | None,
    ) -> list[dict[str, Any]]:
        """Run Whoosh BM25 lexical search."""
        try:
            return self._lexical.search(
                query=query,
                limit=self._lexical_limit,
                user_id=user_id,
                department=department,
            )
        except Exception:
            logger.exception("[HybridSearch] Lexical search error")
            return []

    def _rrf_fusion(
        self,
        semantic_results: list[dict[str, Any]],
        lexical_results: list[dict[str, Any]],
    ) -> list[SearchResult]:
        """Merge results using Reciprocal Rank Fusion (RRF).

        RRF score = sum( 1 / (k + rank + 1) ) across all sources.
        """
        # Build a map: doc_id → SearchResult
        result_map: dict[str, SearchResult] = {}

        # Process semantic results
        for item in semantic_results:
            doc_id = item["doc_id"]
            rank = item.get("rank", 0)
            rrf_score = 1.0 / (RRF_K + rank + 1)

            if doc_id in result_map:
                result_map[doc_id].rrf_score += rrf_score
                result_map[doc_id].semantic_score = item.get("score", 0.0)
                result_map[doc_id].source = "both"
                # Preserve parent_id if not already set
                if not result_map[doc_id].parent_id:
                    result_map[doc_id].parent_id = item.get("metadata", {}).get("parent_id", "")
            else:
                result_map[doc_id] = SearchResult(
                    doc_id=doc_id,
                    title=item.get("title", ""),
                    content=item.get("content", ""),
                    tags=item.get("tags", ""),
                    rrf_score=rrf_score,
                    semantic_score=item.get("score", 0.0),
                    source="semantic",
                    metadata=item.get("metadata", {}),
                    parent_id=item.get("metadata", {}).get("parent_id", ""),
                )

        # Process lexical results
        for item in lexical_results:
            doc_id = item["doc_id"]
            rank = item.get("rank", 0)
            rrf_score = 1.0 / (RRF_K + rank + 1)

            if doc_id in result_map:
                result_map[doc_id].rrf_score += rrf_score
                result_map[doc_id].lexical_score = item.get("score", 0.0)
                if result_map[doc_id].source == "semantic":
                    result_map[doc_id].source = "both"
                # If lexical has better content/title, prefer it
                if not result_map[doc_id].content and item.get("content"):
                    result_map[doc_id].content = item["content"]
                if not result_map[doc_id].title and item.get("title"):
                    result_map[doc_id].title = item["title"]
            else:
                result_map[doc_id] = SearchResult(
                    doc_id=doc_id,
                    title=item.get("title", ""),
                    content=item.get("content", ""),
                    tags=item.get("tags", ""),
                    rrf_score=rrf_score,
                    lexical_score=item.get("score", 0.0),
                    source="lexical",
                )

        return list(result_map.values())

    @property
    def lexical_service(self) -> LexicalSearchService:
        """Access the underlying lexical search service for indexing operations."""
        return self._lexical
