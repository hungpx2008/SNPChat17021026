"""Tests for parent-to-child chunk splitting."""
from src.services.chunk_splitter import split_into_children, CHILD_CHUNK_MAX_TOKENS


def test_small_parent_returns_single_child():
    """Parent smaller than 1.5x child max should not be split."""
    parent_text = "Biểu giá container 20ft tại cảng Cát Lái."
    children = split_into_children(
        parent_text=parent_text,
        parent_id="parent-001",
        parent_meta={"page_number": 1, "headings": ["Biểu giá"], "row_keys": []},
    )
    assert len(children) == 1
    assert children[0]["text"] == parent_text
    assert children[0]["parent_id"] == "parent-001"
    assert children[0]["page"] == 1
    assert children[0]["headings"] == ["Biểu giá"]
    assert children[0]["chunk_index"] == 0


def test_large_parent_splits_into_multiple_children():
    """Parent larger than 1.5x child max should be split."""
    sentences = [f"Câu số {i}: Nội dung chi tiết về quy trình xuất nhập khẩu container." for i in range(80)]
    parent_text = " ".join(sentences)
    children = split_into_children(
        parent_text=parent_text,
        parent_id="parent-002",
        parent_meta={"page_number": 5, "headings": ["Quy trình"], "row_keys": ["R01"]},
    )
    assert len(children) >= 2
    for i, child in enumerate(children):
        assert child["parent_id"] == "parent-002"
        assert child["page"] == 5
        assert child["headings"] == ["Quy trình"]
        assert child["chunk_index"] == i


def test_children_have_overlap():
    """Consecutive children should share overlapping text at boundaries."""
    sentences = [f"Câu thứ {i} mô tả chi tiết nội dung quan trọng về logistics cảng biển." for i in range(80)]
    parent_text = " ".join(sentences)
    children = split_into_children(
        parent_text=parent_text,
        parent_id="parent-003",
        parent_meta={"page_number": 1, "headings": [], "row_keys": []},
    )
    if len(children) >= 2:
        child0_end = children[0]["text"][-100:]
        child1_start = children[1]["text"][:100:]
        child0_words = set(child0_end.split())
        child1_words = set(child1_start.split())
        overlap = child0_words & child1_words
        assert len(overlap) > 0, "Children should have overlapping text at boundaries"


def test_empty_parent_returns_empty():
    """Empty or whitespace parent should return empty list."""
    assert split_into_children("", "p1", {}) == []
    assert split_into_children("   ", "p1", {}) == []
