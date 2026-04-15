"""Unit tests for RAG search helper functions.

Tests _build_qdrant_filter and _extract_hybrid_meta — pure logic
that can be verified without running Qdrant or any external service.
"""
from __future__ import annotations

import pytest

from src.worker.rag.search_helpers import (
    _build_qdrant_filter,
    _extract_hybrid_meta,
)


# ---------------------------------------------------------------------------
# _build_qdrant_filter
# ---------------------------------------------------------------------------


class TestBuildQdrantFilter:
    """Tests for _build_qdrant_filter."""

    def test_returns_filter_object(self):
        from qdrant_client.models import Filter

        result = _build_qdrant_filter("user-1", "operations")
        assert isinstance(result, Filter)

    def test_always_has_must_not(self):
        """Quality gate (must_not quality=low) is always present."""
        result = _build_qdrant_filter("user-1", "operations")
        assert result.must_not is not None
        assert len(result.must_not) >= 1

    def test_user_only(self):
        result = _build_qdrant_filter("user-1", None)
        assert result.must_not is not None
        # should have at least one should condition for user_id
        assert result.should is not None
        assert len(result.should) >= 1

    def test_department_only(self):
        result = _build_qdrant_filter(None, "operations")
        assert result.must_not is not None
        assert result.should is not None
        assert len(result.should) >= 1

    def test_both_user_and_department(self):
        result = _build_qdrant_filter("user-1", "operations")
        assert result.should is not None
        # At least 2 should conditions: one for user, one for department
        assert len(result.should) >= 2

    def test_no_user_no_department(self):
        """No access constraints — only quality filter applied."""
        result = _build_qdrant_filter(None, None)
        assert result.must_not is not None
        # No should constraints
        assert result.should is None or len(result.should) == 0

    def test_quality_gate_excludes_low(self):
        """must_not should contain a condition matching quality='low'."""
        from qdrant_client.models import FieldCondition, MatchValue

        result = _build_qdrant_filter("user-1", "ops")
        quality_conditions = [
            c for c in result.must_not
            if isinstance(c, FieldCondition)
            and c.key == "quality"
            and isinstance(c.match, MatchValue)
            and c.match.value == "low"
        ]
        assert len(quality_conditions) == 1


# ---------------------------------------------------------------------------
# _extract_hybrid_meta
# ---------------------------------------------------------------------------


class _FakeResult:
    """Minimal mock for SearchResult used by _extract_hybrid_meta."""

    def __init__(
        self,
        title: str | None = None,
        tags: str | None = None,
        metadata: dict | None = None,
    ):
        self.title = title
        self.tags = tags
        self.metadata = metadata or {}


class TestExtractHybridMeta:
    """Tests for _extract_hybrid_meta."""

    def test_basic_extraction(self):
        result = _FakeResult(
            title="report.pdf",
            metadata={"page_number": 3, "headings": ["Chương 1"], "document_id": "doc-123"},
        )
        meta = _extract_hybrid_meta(result)
        assert meta["fname"] == "report.pdf"
        assert meta["page_display"] == "3"
        assert meta["headings"] == ["Chương 1"]
        assert meta["doc_id"] == "doc-123"

    def test_fallback_fname(self):
        """When title is None, use source_file from metadata or default."""
        result = _FakeResult(title=None, metadata={"source_file": "backup.docx"})
        meta = _extract_hybrid_meta(result)
        assert meta["fname"] == "backup.docx"

    def test_default_fname(self):
        result = _FakeResult(title=None, metadata={})
        meta = _extract_hybrid_meta(result)
        assert meta["fname"] == "Không rõ"

    def test_page_from_page_number(self):
        result = _FakeResult(metadata={"page_number": 10})
        meta = _extract_hybrid_meta(result)
        assert meta["page_display"] == "10"

    def test_page_from_page_fallback(self):
        result = _FakeResult(metadata={"page": 7})
        meta = _extract_hybrid_meta(result)
        assert meta["page_display"] == "7"

    def test_page_invalid(self):
        result = _FakeResult(metadata={"page_number": "abc"})
        meta = _extract_hybrid_meta(result)
        assert meta["page_display"] == "?"

    def test_page_none(self):
        result = _FakeResult(metadata={})
        meta = _extract_hybrid_meta(result)
        assert meta["page_display"] == "?"

    def test_headings_from_metadata(self):
        result = _FakeResult(metadata={"headings": ["A", "B"]})
        meta = _extract_hybrid_meta(result)
        assert meta["headings"] == ["A", "B"]

    def test_headings_fallback_from_tags(self):
        """When metadata has no headings, parse from tags string."""
        result = _FakeResult(tags="Phần A, Phần B", metadata={})
        meta = _extract_hybrid_meta(result)
        assert "Phần A" in meta["headings"]
        assert "Phần B" in meta["headings"]

    def test_headings_empty(self):
        result = _FakeResult(metadata={})
        meta = _extract_hybrid_meta(result)
        assert meta["headings"] == []

    def test_doc_id_missing(self):
        result = _FakeResult(metadata={})
        meta = _extract_hybrid_meta(result)
        assert meta["doc_id"] == ""
