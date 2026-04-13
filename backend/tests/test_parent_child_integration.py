"""Integration test for parent-child chunking flow.

Tests the logic flow: parent chunks → split → children with parent_id
→ resolve parent content at retrieval time.
Does NOT require running services (DB, Qdrant) — uses mocks.
"""
import os
import sys
from unittest.mock import patch, MagicMock
from uuid import uuid4

# Set DATABASE_URL before importing modules that need it at import time
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/test")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

# Mock database_pool before it gets imported
mock_db_pool = MagicMock()
sys.modules.setdefault("src.core.database_pool", MagicMock(db_pool=mock_db_pool))

from src.services.chunk_splitter import split_into_children
from src.services.parent_chunk_store import fetch_parent_content


def test_full_parent_child_flow():
    """End-to-end: large text → parents → children → resolve parents."""
    # Simulate a large document chunk (parent)
    sentences = [
        f"Điều {i}: Quy định về thủ tục nhập khẩu container qua cảng Cát Lái."
        for i in range(60)
    ]
    parent_text = " ".join(sentences)
    parent_id = str(uuid4())

    # Split into children
    children = split_into_children(
        parent_text=parent_text,
        parent_id=parent_id,
        parent_meta={"page_number": 3, "headings": ["Quy định"], "row_keys": []},
    )

    assert len(children) >= 2, f"Expected multiple children, got {len(children)}"

    # Verify all children reference the parent
    for child in children:
        assert child["parent_id"] == parent_id
        assert child["page"] == 3

    # Simulate retrieval: fetch parent content
    with patch("src.services.parent_chunk_store.db_pool") as mock_pool:
        mock_pool.fetch_all.return_value = [
            {"id": parent_id, "content": parent_text}
        ]

        parent_map = fetch_parent_content([parent_id])
        assert parent_map[parent_id] == parent_text


def test_chunk_splitter_preserves_metadata():
    """Children should inherit all parent metadata."""
    parent_text = " ".join(
        [f"Câu {i}: Thông tin chi tiết về container logistics cảng biển Việt Nam." for i in range(60)]
    )
    parent_id = str(uuid4())
    meta = {"page_number": 7, "headings": ["Logistics", "Cảng biển"], "row_keys": ["R01"]}

    children = split_into_children(parent_text, parent_id, meta)

    for child in children:
        assert child["parent_id"] == parent_id
        assert child["page"] == 7
        assert child["headings"] == ["Logistics", "Cảng biển"]
        assert child["row_keys"] == ["R01"]
        assert isinstance(child["chunk_index"], int)


def test_small_text_single_child():
    """Small text should not be split — returns single child."""
    text = "Biểu giá container 20ft."
    children = split_into_children(text, "p1", {"page_number": 1, "headings": [], "row_keys": []})
    assert len(children) == 1
    assert children[0]["text"] == text
    assert children[0]["parent_id"] == "p1"
