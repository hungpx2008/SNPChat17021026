"""Hybrid / semantic search helpers for RAG pipeline.

These functions build Qdrant filters, run fallback semantic search,
and assemble context blocks + citations from search results.
"""
from __future__ import annotations

import logging
from typing import Any

from src.core.constants import RAG_SCORE_THRESHOLD, RAG_SEARCH_LIMIT

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Qdrant filter builder
# ---------------------------------------------------------------------------


def _run_hybrid_search(
    question: str,
    user_id: str | None,
    department: str | None,
    *,
    embed_fn,
) -> list:
    """Run query enhancement → semantic cache → hybrid search → fallback.

    Returns a list of SearchResult objects ready for context building.
    """
    from src.services.search.query_enhancer import QueryEnhancer, QueryStrategy
    from src.services.search.hybrid_search import HybridSearchService

    enhancer = QueryEnhancer()
    enhanced = enhancer.enhance(question)
    logger.info(
        f"[RAG] Query strategy: {enhanced.strategy.value}, "
        f"sub-queries: {len(enhanced.queries)}"
    )
    if enhanced.hyde_output:
        logger.info(f"[RAG] HyDE output: {enhanced.hyde_output[:100]}...")

    # ── Semantic Cache: check for cached search results ──
    hybrid_results = _check_semantic_cache(question, user_id)

    # ── Hybrid Search: only if cache missed ──
    if hybrid_results is None:
        hybrid = HybridSearchService()
        hybrid_results = hybrid.search(
            query=enhanced.queries if len(enhanced.queries) > 1 else enhanced.queries[0],
            user_id=user_id,
            department=department,
            limit=5,
            score_threshold=RAG_SCORE_THRESHOLD,
        )
        if hybrid_results:
            _store_semantic_cache(question, hybrid_results, user_id)

    # ── Fallback: if hybrid returns nothing, try pure semantic ──
    if not hybrid_results:
        logger.info("[RAG] Hybrid returned 0 results, falling back to pure semantic")
        hybrid_results = _fallback_semantic_search(
            question, user_id, department, embed_fn=embed_fn,
        )

    # Resolve parent chunks and return with enhancement metadata
    hybrid_results = _resolve_parent_content(hybrid_results)
    return hybrid_results, enhanced


def _check_semantic_cache(question: str, user_id: str | None):
    """Check semantic cache for previously cached search results.

    Returns list of SearchResult on hit, None on miss/error.
    """
    try:
        import asyncio
        from src.services.search.semantic_cache import SemanticCache
        from src.services.search.hybrid_search import SearchResult

        _cache = SemanticCache()
        _loop = asyncio.new_event_loop()
        cached = _loop.run_until_complete(_cache.get(question, user_id))
        _loop.close()
        if cached is not None:
            results = [SearchResult(**item) for item in cached]
            logger.info(f"[RAG] Semantic cache HIT: {len(results)} results")
            return results
    except Exception as e:
        logger.warning(f"[RAG] Semantic cache lookup failed: {e}")
    return None


def _store_semantic_cache(question: str, hybrid_results: list, user_id: str | None) -> None:
    """Store hybrid search results in semantic cache for future queries."""
    try:
        import asyncio
        from src.services.search.semantic_cache import SemanticCache

        _cache = SemanticCache()
        serialized = [
            {
                "doc_id": r.doc_id, "title": r.title,
                "content": r.content, "tags": r.tags,
                "score": r.score, "semantic_score": r.semantic_score,
                "lexical_score": r.lexical_score,
                "rrf_score": r.rrf_score, "boost_score": r.boost_score,
                "source": r.source, "metadata": r.metadata,
                "parent_id": r.parent_id,
            }
            for r in hybrid_results
        ]
        _loop = asyncio.new_event_loop()
        _loop.run_until_complete(_cache.put(question, serialized, user_id))
        _loop.close()
        logger.info(f"[RAG] Cached {len(serialized)} results for future queries")
    except Exception as e:
        logger.warning(f"[RAG] Semantic cache store failed: {e}")


def _save_rag_result(
    result_text: str,
    session_id: str,
    target_message_id: str | None,
    hybrid_results: list,
    enhanced,
) -> None:
    """Save RAG answer via Backend API and store chunk metadata."""
    import os
    from src.core.http_client import get_http_client

    backend_url = os.getenv("BACKEND_INTERNAL_URL", "http://backend:8000")
    http_client = get_http_client(timeout=10.0)

    if target_message_id:
        resp = http_client.patch(
            f"{backend_url}/messages/{target_message_id}/content",
            json={"content": result_text},
        )
    else:
        resp = http_client.post(
            f"{backend_url}/sessions/{session_id}/messages",
            json={"content": result_text, "role": "assistant"},
        )
    resp.raise_for_status()

    # Store retrieved chunk IDs in message metadata for accurate feedback
    try:
        from src.services.search.query_enhancer import QueryStrategy

        msg_id = target_message_id or resp.json().get("id")
        if msg_id and hybrid_results:
            chunk_ids = [r.doc_id for r in hybrid_results if r.doc_id]
            if chunk_ids:
                metadata_patch = {"rag_chunk_ids": chunk_ids}
                metadata_patch["query_strategy"] = enhanced.strategy.value
                if enhanced.strategy == QueryStrategy.DECOMPOSED:
                    metadata_patch["sub_queries"] = enhanced.queries
                http_client.patch(
                    f"{backend_url}/messages/{msg_id}/metadata",
                    json=metadata_patch,
                )
    except Exception as e:
        logger.warning(f"[RAG] Could not store chunk_ids in message metadata: {e}")


def _save_rag_error(session_id: str, target_message_id: str | None) -> None:
    """Save error message when RAG pipeline fails."""
    import os
    from src.core.http_client import get_http_client

    backend_url = os.getenv("BACKEND_INTERNAL_URL", "http://backend:8000")
    error_content = (
        "Xin lỗi, hệ thống gặp sự cố khi tìm kiếm tài liệu. "
        "Vui lòng thử lại sau ạ."
    )
    try:
        if target_message_id:
            get_http_client(timeout=10.0).patch(
                f"{backend_url}/messages/{target_message_id}/content",
                json={"content": error_content},
            )
        else:
            get_http_client(timeout=10.0).post(
                f"{backend_url}/sessions/{session_id}/messages",
                json={"content": error_content, "role": "assistant"},
            )
    except Exception:
        pass


def _build_qdrant_filter(user_id: str | None, department: str | None):
    """Build Qdrant security + quality filter for RAG search.

    Access control (OR):
      - chunks owned by this user_id, OR
      - public chunks belonging to this department

    Quality gate (must NOT):
      - exclude any chunk marked quality=low via negative feedback
    """
    from qdrant_client.models import (
        FieldCondition,
        Filter,
        MatchValue,
    )

    # Access control: user's own chunks OR department-public chunks
    should_conditions = []
    if user_id:
        should_conditions.append(
            FieldCondition(key="user_id", match=MatchValue(value=user_id))
        )
    if department:
        should_conditions.append(Filter(must=[
            FieldCondition(key="department", match=MatchValue(value=department)),
            FieldCondition(key="is_public", match=MatchValue(value=True)),
        ]))

    # Quality gate: exclude chunks explicitly marked as low quality via feedback
    must_not_conditions = [
        FieldCondition(key="quality", match=MatchValue(value="low")),
    ]

    if should_conditions:
        return Filter(
            should=should_conditions,
            must_not=must_not_conditions,
        )
    # No access constraints — only apply quality filter
    return Filter(must_not=must_not_conditions)


# ---------------------------------------------------------------------------
# Fallback semantic search
# ---------------------------------------------------------------------------


def _fallback_semantic_search(
    question: str,
    user_id: str | None,
    department: str | None,
    *,
    embed_fn,
) -> list:
    """Pure semantic fallback when hybrid search returns no results.

    Uses direct Qdrant client instead of LlamaIndex wrapper.
    Returns a list of SearchResult objects for compatibility.

    Parameters
    ----------
    embed_fn : Callable[[str], list[float]]
        The embedding function (``embed_query`` from chat_tasks).
    """
    from src.core.qdrant_setup import get_qdrant_client
    from src.services.search.hybrid_search import SearchResult

    query_vector = embed_fn(question)
    qdrant = get_qdrant_client()
    qdrant_filter = _build_qdrant_filter(user_id, department)

    points = qdrant.query_points(
        collection_name="port_knowledge",
        query=query_vector,
        query_filter=qdrant_filter,
        limit=RAG_SEARCH_LIMIT,
    ).points

    results = []
    for point in points:
        score = getattr(point, "score", 0.0) or 0.0
        if score < RAG_SCORE_THRESHOLD:
            continue
        payload = point.payload or {}
        content = payload.get("content", "")
        results.append(SearchResult(
            doc_id=str(point.id) if point.id else "",
            title=payload.get("source_file", ""),
            content=content,
            tags=",".join(payload.get("headings", [])),
            score=score,
            semantic_score=score,
            source="semantic",
            metadata=payload,
        ))
    return results


# ---------------------------------------------------------------------------
# Metadata extraction & image hints
# ---------------------------------------------------------------------------


def _extract_hybrid_meta(result) -> dict[str, Any]:
    """Extract normalized metadata from a hybrid SearchResult."""
    meta = result.metadata or {}
    fname = result.title or meta.get("source_file", "Không rõ")

    raw_page = meta.get("page_number") or meta.get("page", "?")
    try:
        page_display = str(int(raw_page))
    except (ValueError, TypeError):
        page_display = "?"

    headings = meta.get("headings", [])
    if isinstance(result.tags, str) and result.tags and not headings:
        headings = [t.strip() for t in result.tags.split(",") if t.strip()]

    return {
        "fname": fname,
        "page_display": page_display,
        "headings": headings,
        "doc_id": meta.get("document_id", ""),
    }


def _maybe_add_image_hint(snippet: str, fname: str, doc_id: str) -> str:
    """Append image download hint if the source is an image file."""
    ext = fname.lower().rsplit(".", 1)[-1] if "." in fname else ""
    if ext in ("jpg", "jpeg", "png") and doc_id:
        snippet += f"\n[LƯU Ý QUAN TRỌNG: Link Tải ảnh gốc là `/api/upload/{doc_id}/download`]"
    return snippet


# ---------------------------------------------------------------------------
# Parent-chunk resolution
# ---------------------------------------------------------------------------


def _resolve_parent_content(hybrid_results: list) -> list:
    """Replace child chunk content with parent content when parent_id is present.

    For backward compatibility, results without parent_id keep their original content.
    Multiple children pointing to the same parent are deduped — only the first is kept.
    """
    from src.services.parent_chunk_store import fetch_parent_content

    # Collect unique parent_ids
    parent_ids = list({
        r.parent_id for r in hybrid_results
        if hasattr(r, "parent_id") and r.parent_id
    })

    if not parent_ids:
        return hybrid_results  # No parent-child chunks, use as-is

    # Fetch parent content from PostgreSQL
    parent_map = fetch_parent_content(parent_ids)

    # Replace child content with parent content, dedup by parent_id
    seen_parents: set[str] = set()
    resolved: list = []

    for result in hybrid_results:
        pid = getattr(result, "parent_id", "") or ""
        if pid and pid in parent_map and parent_map[pid]:
            if pid in seen_parents:
                continue  # Skip duplicate parent
            seen_parents.add(pid)
            # Replace content with parent's full text
            result.content = parent_map[pid]
        resolved.append(result)

    return resolved


# ---------------------------------------------------------------------------
# Context block + citation assembly
# ---------------------------------------------------------------------------


def _build_hybrid_context_and_citations(
    hybrid_results: list,
) -> tuple[list[dict[str, Any]], list[str]]:
    """Build context blocks and citations from hybrid search results."""
    citations: list[dict[str, Any]] = []
    context_blocks: list[str] = []
    seen_citations: set[str] = set()
    seen_content: set[int] = set()

    for result in hybrid_results:
        snippet = (result.content or "").strip()
        if not snippet:
            continue

        content_hash = hash(snippet[:200])
        if content_hash in seen_content:
            continue
        seen_content.add(content_hash)

        m = _extract_hybrid_meta(result)
        snippet = _maybe_add_image_hint(snippet, m["fname"], m["doc_id"])

        heading_key = "|".join(str(h) for h in m["headings"][:2]) if m["headings"] else ""
        cite_key = f"{m['fname']}|{m['page_display']}|{heading_key}"

        if cite_key not in seen_citations:
            seen_citations.add(cite_key)
            citations.append({
                "index": len(citations) + 1,
                "file": m["fname"],
                "page": m["page_display"],
                "headings": m["headings"],
                "score": result.score,
                "doc_id": m["doc_id"],
                "source": result.source,
            })

        cite_idx = next(
            (c["index"] for c in citations
             if c.get("file") == m["fname"] and c.get("page") == m["page_display"]),
            len(citations),
        )
        context_blocks.append(f"[{cite_idx}] {snippet}")

    return citations, context_blocks
