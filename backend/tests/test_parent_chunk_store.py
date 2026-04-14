"""Tests for parent chunk storage and retrieval (sync, for Celery workers)."""
import sys
from unittest.mock import MagicMock, patch
from uuid import uuid4

# Mock the database_pool module entirely before importing parent_chunk_store.
# This prevents the singleton from trying to connect to a real database.
_mock_db_pool_instance = MagicMock()
_mock_db_pool_module = MagicMock()
_mock_db_pool_module.db_pool = _mock_db_pool_instance
sys.modules.setdefault("src.core.database_pool", _mock_db_pool_module)

from src.services.parent_chunk_store import save_parent_chunks, fetch_parent_content


def _make_parent(content: str, page: int = 1, headings: list | None = None):
    return {
        "content": content,
        "page_number": page,
        "headings": headings or [],
        "metadata": {},
    }


@patch("src.services.parent_chunk_store.db_pool")
def test_save_parent_chunks_returns_ids(mock_pool):
    """save_parent_chunks should return list of UUID strings."""
    mock_pool.execute_query.return_value = None
    doc_id = str(uuid4())
    parents = [
        _make_parent("Parent 1 content"),
        _make_parent("Parent 2 content", page=2),
    ]
    ids = save_parent_chunks(doc_id, parents)
    assert len(ids) == 2
    for pid in ids:
        assert isinstance(pid, str)
        assert len(pid) == 36  # UUID format


@patch("src.services.parent_chunk_store.db_pool")
def test_save_empty_parents_returns_empty(mock_pool):
    """Empty parent list should return empty id list."""
    ids = save_parent_chunks(str(uuid4()), [])
    assert ids == []
    mock_pool.execute_query.assert_not_called()


@patch("src.services.parent_chunk_store.db_pool")
def test_fetch_parent_content_returns_dict(mock_pool):
    """fetch_parent_content should return dict mapping id -> content."""
    pid1 = str(uuid4())
    pid2 = str(uuid4())
    mock_pool.fetch_all.return_value = [
        {"id": pid1, "content": "Content of parent 1"},
        {"id": pid2, "content": "Content of parent 2"},
    ]
    result = fetch_parent_content([pid1, pid2])
    assert result[pid1] == "Content of parent 1"
    assert result[pid2] == "Content of parent 2"


@patch("src.services.parent_chunk_store.db_pool")
def test_fetch_missing_parents_returns_empty_strings(mock_pool):
    """Missing parent_ids should map to empty strings for backward compat."""
    mock_pool.fetch_all.return_value = []
    result = fetch_parent_content(["nonexistent-id"])
    assert result["nonexistent-id"] == ""


def test_fetch_empty_ids_returns_empty():
    """Empty id list should return empty dict without DB call."""
    result = fetch_parent_content([])
    assert result == {}
