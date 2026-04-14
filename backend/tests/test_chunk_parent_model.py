"""Tests for ChunkParent model definition."""
from uuid import uuid4

from src.models.models import ChunkParent


def test_chunk_parent_has_required_fields():
    """ChunkParent should have all required columns."""
    parent = ChunkParent(
        id=uuid4(),
        document_id=uuid4(),
        content="Test parent chunk content with enough text to be meaningful.",
        page_number=3,
        headings=["Biểu giá", "Container 20ft"],
        meta={"row_keys": ["R001", "R002"]},
    )
    assert parent.content == "Test parent chunk content with enough text to be meaningful."
    assert parent.page_number == 3
    assert parent.headings == ["Biểu giá", "Container 20ft"]
    assert parent.meta["row_keys"] == ["R001", "R002"]


def test_chunk_parent_defaults():
    """ChunkParent defaults should work when only content is provided."""
    parent = ChunkParent(content="Minimal parent.")
    assert parent.content == "Minimal parent."
    assert parent.document_id is None
    # Verify column-level defaults are configured (insert_default)
    table = ChunkParent.__table__
    assert table.c.page_number.default is not None
    assert table.c.headings.default is not None
    assert table.c.metadata.default is not None


def test_chunk_parent_tablename():
    """ChunkParent should use chunk_parents table."""
    assert ChunkParent.__tablename__ == "chunk_parents"


def test_chunk_parent_has_document_fk():
    """ChunkParent should have a document_id foreign key."""
    col = ChunkParent.__table__.c.document_id
    fks = [fk.target_fullname for fk in col.foreign_keys]
    assert "documents.id" in fks
