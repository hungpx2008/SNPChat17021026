"""Tests for HybridSearchService multi-query (decomposition) support."""
from unittest.mock import patch, MagicMock
from dataclasses import field

import pytest

from src.services.search.hybrid_search import HybridSearchService, SearchResult


def _make_result(doc_id: str, score: float, content: str = "test") -> SearchResult:
    """Helper to create a SearchResult for testing."""
    return SearchResult(
        doc_id=doc_id,
        title=f"doc_{doc_id}",
        content=content,
        score=score,
        rrf_score=score,
        source="semantic",
    )


def _make_service() -> HybridSearchService:
    """Create HybridSearchService with a mock lexical backend (no whoosh needed)."""
    mock_lexical = MagicMock()
    return HybridSearchService(lexical=mock_lexical)


class TestMultiQuerySearch:
    """Tests for search() with list[str] queries."""

    @patch.object(HybridSearchService, "_single_search")
    def test_single_string_query_unchanged(self, mock_single):
        """A single string query should work the same as before."""
        mock_single.return_value = [_make_result("doc1", 0.9)]

        service = _make_service()
        results = service.search(query="biểu giá container", limit=5)

        mock_single.assert_called_once()
        assert len(results) == 1
        assert results[0].doc_id == "doc1"

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_list_merges_results(self, mock_single):
        """Multiple queries should each be searched, results merged."""
        # Query 1 finds doc1 and doc2
        # Query 2 finds doc2 and doc3
        mock_single.side_effect = [
            [_make_result("doc1", 0.9), _make_result("doc2", 0.7)],
            [_make_result("doc2", 0.8), _make_result("doc3", 0.6)],
        ]

        service = _make_service()
        results = service.search(
            query=["giá container 20ft", "giá container 40ft"],
            limit=5,
        )

        assert mock_single.call_count == 2
        # doc2 appears in both → should keep max score (0.8 from query 2)
        doc_ids = [r.doc_id for r in results]
        assert "doc1" in doc_ids
        assert "doc2" in doc_ids
        assert "doc3" in doc_ids

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_dedup_keeps_max_score(self, mock_single):
        """When same doc appears in multiple sub-query results, keep highest score."""
        mock_single.side_effect = [
            [_make_result("shared_doc", 0.5)],
            [_make_result("shared_doc", 0.9)],
        ]

        service = _make_service()
        results = service.search(
            query=["query1 dài đủ để test", "query2 dài đủ để test"],
            limit=5,
        )

        assert len(results) == 1
        assert results[0].doc_id == "shared_doc"
        assert results[0].score == 0.9  # max of 0.5 and 0.9

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_respects_limit(self, mock_single):
        """Multi-query should still respect the limit parameter."""
        mock_single.side_effect = [
            [_make_result(f"doc_{i}", 0.9 - i * 0.1) for i in range(5)],
            [_make_result(f"doc_{i + 5}", 0.8 - i * 0.1) for i in range(5)],
        ]

        service = _make_service()
        results = service.search(
            query=["query1 dài", "query2 dài"],
            limit=3,
        )

        assert len(results) <= 3

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_empty_list_returns_empty(self, mock_single):
        """Empty query list should return empty results."""
        service = _make_service()
        results = service.search(query=[], limit=5)

        assert results == []
        mock_single.assert_not_called()

    @patch.object(HybridSearchService, "_single_search")
    def test_multi_query_single_item_list(self, mock_single):
        """Single-item list should behave like a single string query."""
        mock_single.return_value = [_make_result("doc1", 0.9)]

        service = _make_service()
        results = service.search(query=["biểu giá container"], limit=5)

        mock_single.assert_called_once()
        assert len(results) == 1
