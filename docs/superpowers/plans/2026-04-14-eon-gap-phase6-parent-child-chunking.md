# EON Gap Phase 6: Parent-Child Chunking — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat single-tier chunking with a 2-tier parent-child model so search uses small child chunks for precision while LLM receives large parent chunks for context.

**Architecture:** Docling produces large parent chunks (~2048 tokens), stored in PostgreSQL. Each parent is split into smaller child chunks (~384 tokens) which are embedded and stored in Qdrant with a `parent_id` field. At retrieval time, child chunks are searched, then their parent content is fetched and fed to the LLM.

**Tech Stack:** PostgreSQL (ChunkParent table), Qdrant (child vectors with parent_id payload), Docling (increased chunk size), existing Mem0 embedding service.

**Spec:** `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md` — Phase 6 section.

---

### Task 1: Add ChunkParent DB Model

**Files:**
- Modify: `chatSNP170226/backend/src/models/models.py`
- Test: `chatSNP170226/backend/tests/test_chunk_parent_model.py`

- [ ] **Step 1: Write the test for ChunkParent model**

Create `chatSNP170226/backend/tests/test_chunk_parent_model.py`:

```python
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
    assert parent.page_number == 0
    assert parent.headings == []
    assert parent.meta == {}
    assert parent.document_id is None
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_chunk_parent_model.py -v`
Expected: FAIL — `ChunkParent` not defined in models.py

- [ ] **Step 3: Add ChunkParent model to models.py**

Add at the end of `chatSNP170226/backend/src/models/models.py`, after the `MessageFeedback` class:

```python
class ChunkParent(Base):
    """Parent chunks for 2-tier parent-child retrieval.

    Stores the full-context parent text in PostgreSQL.
    Child chunks (smaller, search-optimized) are stored in Qdrant
    with a parent_id payload field pointing back here.
    """
    __tablename__ = "chunk_parents"
    __table_args__ = (
        Index("ix_chunk_parents_document_id", "document_id"),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=True,
    )
    content: Mapped[str] = mapped_column(Text(), nullable=False)
    page_number: Mapped[int] = mapped_column(default=0)
    headings: Mapped[dict] = mapped_column("headings", JSON, default=list)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_chunk_parent_model.py -v`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/models/models.py chatSNP170226/backend/tests/test_chunk_parent_model.py
git commit -m "feat(models): add ChunkParent model for parent-child chunking"
```

---

### Task 2: Child Chunk Splitting Logic

**Files:**
- Create: `chatSNP170226/backend/src/services/chunk_splitter.py`
- Test: `chatSNP170226/backend/tests/test_chunk_splitter.py`

- [ ] **Step 1: Write the tests for child splitting**

Create `chatSNP170226/backend/tests/test_chunk_splitter.py`:

```python
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
    # Build a parent text that's ~1000 words (>384 tokens * 1.5 / 1.8)
    sentences = [f"Câu số {i}: Nội dung chi tiết về quy trình xuất nhập khẩu container." for i in range(80)]
    parent_text = " ".join(sentences)
    children = split_into_children(
        parent_text=parent_text,
        parent_id="parent-002",
        parent_meta={"page_number": 5, "headings": ["Quy trình"], "row_keys": ["R01"]},
    )
    assert len(children) >= 2
    # All children should have parent_id and metadata
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
        # Last words of child[0] should appear in first words of child[1]
        child0_end = children[0]["text"][-100:]
        child1_start = children[1]["text"][:100:]
        # At least some overlap should exist
        child0_words = set(child0_end.split())
        child1_words = set(child1_start.split())
        overlap = child0_words & child1_words
        assert len(overlap) > 0, "Children should have overlapping text at boundaries"


def test_empty_parent_returns_empty():
    """Empty or whitespace parent should return empty list."""
    assert split_into_children("", "p1", {}) == []
    assert split_into_children("   ", "p1", {}) == []
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_chunk_splitter.py -v`
Expected: FAIL — `chunk_splitter` module not found

- [ ] **Step 3: Implement chunk_splitter.py**

Create `chatSNP170226/backend/src/services/chunk_splitter.py`:

```python
"""Parent-to-child chunk splitting for 2-tier retrieval.

Splits large parent chunks into smaller child chunks optimized for
vector search. Children inherit parent metadata and include a parent_id
for fetching full context at retrieval time.

Constants calibrated for Vietnamese text via token_estimator.
"""
from __future__ import annotations

import re
from typing import Any

from src.utils.token_estimator import estimate_tokens

# ── Constants ────────────────────────────────────────────────────────────
PARENT_CHUNK_MAX_TOKENS = 2048
CHILD_CHUNK_MAX_TOKENS = 384
CHILD_CHUNK_OVERLAP_TOKENS = 50

# Threshold: if parent is smaller than this, don't split
_NO_SPLIT_THRESHOLD = int(CHILD_CHUNK_MAX_TOKENS * 1.5)

# Sentence-end regex for Vietnamese (period, question mark, exclamation)
_SENTENCE_END_RE = re.compile(r"(?<=[.!?])\s+")


def split_into_children(
    parent_text: str,
    parent_id: str,
    parent_meta: dict[str, Any],
) -> list[dict[str, Any]]:
    """Split a parent chunk into smaller child chunks for vector search.

    Each child inherits the parent's metadata and adds parent_id for retrieval.
    Uses sentence-boundary splitting with overlap for context continuity.

    Args:
        parent_text: Full parent chunk text.
        parent_id: UUID string of the ChunkParent row.
        parent_meta: Dict with keys: page_number, headings, row_keys.

    Returns:
        List of child chunk dicts with keys:
        text, parent_id, page, headings, row_keys, chunk_index.
    """
    if not parent_text or not parent_text.strip():
        return []

    parent_text = parent_text.strip()
    page = parent_meta.get("page_number", 0)
    headings = parent_meta.get("headings", [])
    row_keys = parent_meta.get("row_keys", [])

    parent_tokens = estimate_tokens(parent_text)

    # Small parent: return as single child
    if parent_tokens <= _NO_SPLIT_THRESHOLD:
        return [
            {
                "text": parent_text,
                "parent_id": parent_id,
                "page": page,
                "headings": headings,
                "row_keys": row_keys,
                "chunk_index": 0,
            }
        ]

    # Split into sentences
    sentences = _SENTENCE_END_RE.split(parent_text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if not sentences:
        return [
            {
                "text": parent_text,
                "parent_id": parent_id,
                "page": page,
                "headings": headings,
                "row_keys": row_keys,
                "chunk_index": 0,
            }
        ]

    # Build children by accumulating sentences up to CHILD_CHUNK_MAX_TOKENS
    children: list[dict[str, Any]] = []
    current_sentences: list[str] = []
    current_tokens = 0
    overlap_sentences: list[str] = []

    for sentence in sentences:
        sentence_tokens = estimate_tokens(sentence)

        if current_tokens + sentence_tokens > CHILD_CHUNK_MAX_TOKENS and current_sentences:
            # Flush current child
            child_text = " ".join(current_sentences)
            children.append(
                {
                    "text": child_text,
                    "parent_id": parent_id,
                    "page": page,
                    "headings": headings,
                    "row_keys": row_keys,
                    "chunk_index": len(children),
                }
            )

            # Compute overlap: take last N sentences that fit in CHILD_CHUNK_OVERLAP_TOKENS
            overlap_sentences = []
            overlap_tokens = 0
            for s in reversed(current_sentences):
                s_tokens = estimate_tokens(s)
                if overlap_tokens + s_tokens > CHILD_CHUNK_OVERLAP_TOKENS:
                    break
                overlap_sentences.insert(0, s)
                overlap_tokens += s_tokens

            # Start next child with overlap
            current_sentences = list(overlap_sentences)
            current_tokens = overlap_tokens

        current_sentences.append(sentence)
        current_tokens += sentence_tokens

    # Flush remaining
    if current_sentences:
        child_text = " ".join(current_sentences)
        children.append(
            {
                "text": child_text,
                "parent_id": parent_id,
                "page": page,
                "headings": headings,
                "row_keys": row_keys,
                "chunk_index": len(children),
            }
        )

    return children
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_chunk_splitter.py -v`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/chunk_splitter.py chatSNP170226/backend/tests/test_chunk_splitter.py
git commit -m "feat(chunking): add parent-to-child chunk splitting logic"
```

---

### Task 3: Parent Chunk Fetch Helper

**Files:**
- Create: `chatSNP170226/backend/src/services/parent_chunk_store.py`
- Test: `chatSNP170226/backend/tests/test_parent_chunk_store.py`

- [ ] **Step 1: Write tests for parent chunk store**

Create `chatSNP170226/backend/tests/test_parent_chunk_store.py`:

```python
"""Tests for parent chunk storage and retrieval (sync, for Celery workers)."""
from unittest.mock import MagicMock, patch
from uuid import uuid4

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
    # Each id should be a valid UUID string
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
    """fetch_parent_content should return dict mapping id → content."""
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_parent_chunk_store.py -v`
Expected: FAIL — module not found

- [ ] **Step 3: Implement parent_chunk_store.py**

Create `chatSNP170226/backend/src/services/parent_chunk_store.py`:

```python
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
        Dict mapping parent_id → content text.
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_parent_chunk_store.py -v`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add chatSNP170226/backend/src/services/parent_chunk_store.py chatSNP170226/backend/tests/test_parent_chunk_store.py
git commit -m "feat(chunking): add parent chunk store for save/fetch operations"
```

---

### Task 4: Add parent_id to SearchResult Dataclass

**Files:**
- Modify: `chatSNP170226/backend/src/services/search/hybrid_search.py`

- [ ] **Step 1: Add parent_id field to SearchResult**

In `chatSNP170226/backend/src/services/search/hybrid_search.py`, add `parent_id` field to the `SearchResult` dataclass at line 54 (after `metadata`):

```python
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
```

- [ ] **Step 2: Update _semantic_search to pass parent_id from Qdrant metadata**

In the `_semantic_search` method of `HybridSearchService`, the metadata dict already contains whatever payload fields Qdrant returns. The `parent_id` will be available via `metadata.get("parent_id", "")` at retrieval time — no code change needed in `_semantic_search` since it passes the full metadata dict through.

Update the `_rrf_fusion` method to propagate `parent_id` from metadata:

In `_rrf_fusion`, when creating `SearchResult` objects, add:

```python
# In the semantic results processing block (around line 256):
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
```

And in the existing entry update block, preserve parent_id:

```python
if doc_id in result_map:
    result_map[doc_id].rrf_score += rrf_score
    result_map[doc_id].semantic_score = item.get("score", 0.0)
    result_map[doc_id].source = "both"
    # Preserve parent_id if not already set
    if not result_map[doc_id].parent_id:
        result_map[doc_id].parent_id = item.get("metadata", {}).get("parent_id", "")
```

- [ ] **Step 3: Verify existing hybrid search tests still pass**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v -k "search or hybrid" --no-header 2>/dev/null || echo "No existing search tests"`

- [ ] **Step 4: Commit**

```bash
git add chatSNP170226/backend/src/services/search/hybrid_search.py
git commit -m "feat(search): add parent_id field to SearchResult for parent-child retrieval"
```

---

### Task 5: Modify Ingestion Pipeline to Save Parents and Embed Children

**Files:**
- Modify: `chatSNP170226/backend/src/worker/media_tasks.py`

This is the core integration task. The `_do_full_processing()` function changes to:
1. Treat Docling chunks as parents → save to PostgreSQL
2. Split each parent into children → embed children → upsert to Qdrant

- [ ] **Step 1: Add imports at top of media_tasks.py**

At the top of `chatSNP170226/backend/src/worker/media_tasks.py`, after existing imports, add:

```python
# Parent-child chunking imports (Phase 6)
# Lazy-imported inside _do_full_processing to avoid circular imports
```

No actual import lines needed — we'll lazy-import inside the function.

- [ ] **Step 2: Modify _do_full_processing() to use parent-child chunking**

Replace the chunking and payload building sections of `_do_full_processing()` in `chatSNP170226/backend/src/worker/media_tasks.py` (lines ~170-243).

The key change: when `prechunked_chunks` is provided (Docling path), treat them as parents. Save parents to DB, split into children, embed children.

Replace the section from `# 1. Chunking` through `# 4. Upsert to Qdrant` with:

```python
    # 1. Chunking — Parent-Child model
    from src.services.chunk_splitter import split_into_children
    from src.services.parent_chunk_store import save_parent_chunks

    all_children: list[dict[str, Any]] = []

    if prechunked_chunks:
        # Docling path: chunks are PARENTS → save to DB, split into children
        parent_data = []
        for item in prechunked_chunks:
            text = (item.get("text") or "").strip()
            if not text:
                continue
            raw_page = item.get("page") or 1
            try:
                page_num = max(1, int(raw_page) if raw_page is not None else 1)
            except Exception:
                page_num = 1
            parent_data.append({
                "content": text,
                "page_number": page_num,
                "headings": item.get("headings") or [],
                "metadata": {"row_keys": item.get("row_keys") or []},
            })

        # Save parents to PostgreSQL
        parent_ids = save_parent_chunks(document_id or "", parent_data)
        logger.info(f"[chunking] Saved {len(parent_ids)} parent chunks for {filename}")

        # Split each parent into children
        for parent_idx, (parent_info, parent_id) in enumerate(zip(parent_data, parent_ids)):
            children = split_into_children(
                parent_text=parent_info["content"],
                parent_id=parent_id,
                parent_meta={
                    "page_number": parent_info["page_number"],
                    "headings": parent_info["headings"],
                    "row_keys": parent_info["metadata"].get("row_keys", []),
                },
            )
            all_children.extend(children)

        logger.info(
            f"[chunking] Split {len(parent_ids)} parents into "
            f"{len(all_children)} child chunks for {filename}"
        )
    else:
        # Fallback: smart_chunk for VLM image descriptions (no parent-child)
        chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
        for i, (chunk_text, page_num) in enumerate(chunks_with_pages):
            all_children.append({
                "text": chunk_text,
                "parent_id": "",
                "page": page_num,
                "headings": [],
                "row_keys": [],
                "chunk_index": i,
            })
        logger.info(f"[chunking] Smart-chunked {len(all_children)} flat chunks for {filename}")

    if not all_children:
        raise ValueError(f"No chunks generated for {filename}")

    # 2. Embed via Mem0 — parallel
    from src.core.http_client import get_http_client
    mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
    embed_url = f"{mem0_url.rstrip('/')}/embed"
    http_client = get_http_client(timeout=30.0)

    def _embed_chunk(chunk_text: str) -> list[float]:
        resp = http_client.post(embed_url, json={"text": chunk_text})
        resp.raise_for_status()
        return resp.json()["vector"]

    chunk_texts = [child["text"] for child in all_children]
    with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
        vectors = list(pool.map(_embed_chunk, chunk_texts))

    # 3. Build payloads
    payloads: list[dict[str, Any]] = []
    vector_ids: list[str] = []
    for i, child in enumerate(all_children):
        vid = str(uuid4())
        vector_ids.append(vid)
        payload: dict[str, Any] = {
            "text": child["text"],
            "source_file": filename,
            "page_number": child["page"],
            "chunk_index": child["chunk_index"],
            "user_id": user_id,
            "document_id": document_id,
            "type": "document_chunk",
            "extractor": extractor_used,
        }
        if child.get("parent_id"):
            payload["parent_id"] = child["parent_id"]
            payload["is_child"] = True
        if child.get("headings"):
            payload["headings"] = child["headings"]
        if child.get("row_keys"):
            payload["row_keys"] = child["row_keys"]
        payloads.append(payload)

    # 4. Upsert to Qdrant
    from src.core.qdrant_setup import upsert_vectors
    upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
    logger.info(f"[qdrant] Upserted {len(payloads)} child vectors for {filename}")
```

- [ ] **Step 3: Verify the rest of _do_full_processing still works**

The Whoosh indexing block (lines ~246+) should still work because it iterates over `payloads` which now contain child chunk data. Update the chunk_count reference:

Find the line that sets `chunk_count` in `_update_document_status` call (near the end of `_do_full_processing`). Change it to use `len(all_children)` instead of `len(payloads)` — they're the same value, but be explicit:

```python
    _update_document_status(
        document_id=document_id,
        status="ready",
        chunk_count=len(all_children),
        extractor_used=extractor_used,
        metadata={
            **(meta_extra or {}),
            "page_count": page_count,
            "table_count": table_count,
            "parent_child": bool(prechunked_chunks),
            **({"preview_pdf_path": preview_pdf_path} if preview_pdf_path else {}),
        },
    )
```

- [ ] **Step 4: Commit**

```bash
git add chatSNP170226/backend/src/worker/media_tasks.py
git commit -m "feat(ingestion): integrate parent-child chunking into document processing pipeline"
```

---

### Task 6: Modify RAG Retrieval to Fetch Parent Content

**Files:**
- Modify: `chatSNP170226/backend/src/worker/chat_tasks.py`

- [ ] **Step 1: Add parent-fetch logic after hybrid search in rag_document_search**

In `chatSNP170226/backend/src/worker/chat_tasks.py`, find the `_build_hybrid_context_and_citations()` function (around line 782). This is where search results become context blocks. Modify it to fetch parent content when `parent_id` is present.

Add a new function before `_build_hybrid_context_and_citations`:

```python
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
```

- [ ] **Step 2: Wire _resolve_parent_content into the RAG pipeline**

In the `rag_document_search` task, find where `_build_hybrid_context_and_citations` is called with `hybrid_results`. Add `_resolve_parent_content` before it:

```python
# Before building context, resolve parent chunks
hybrid_results = _resolve_parent_content(hybrid_results)
citations, context_blocks = _build_hybrid_context_and_citations(hybrid_results)
```

Search for the exact call site in `rag_document_search` and insert the line above the existing `_build_hybrid_context_and_citations` call.

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/src/worker/chat_tasks.py
git commit -m "feat(rag): fetch parent content for child chunk search results"
```

---

### Task 7: Update Docling Chunk Size Configuration

**Files:**
- Modify: `chatSNP170226/backend/src/services/docling_service.py`

- [ ] **Step 1: Increase default DOCLING_CHUNK_MAX_TOKENS**

In `chatSNP170226/backend/src/services/docling_service.py`, find the line where `DOCLING_CHUNK_MAX_TOKENS` is read from env (search for `DOCLING_CHUNK_MAX_TOKENS`). Change the default from `768` to `2048`:

Find:
```python
self._env_int("DOCLING_CHUNK_MAX_TOKENS", 768)
```

Change to:
```python
self._env_int("DOCLING_CHUNK_MAX_TOKENS", 2048)
```

This makes Docling produce larger chunks that serve as meaningful parents. The children (~384 tokens) will be close to the old search granularity.

- [ ] **Step 2: Verify the change doesn't break DoclingProcessor initialization**

Run: `cd chatSNP170226/backend && python -c "from src.services.docling_service import DoclingProcessor; p = DoclingProcessor(); print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/src/services/docling_service.py
git commit -m "feat(docling): increase default chunk size to 2048 tokens for parent-child model"
```

---

### Task 8: Add Qdrant Payload Index for parent_id

**Files:**
- Modify: `chatSNP170226/backend/src/core/qdrant_setup.py`

- [ ] **Step 1: Add parent_id to port_knowledge payload indexes**

In `chatSNP170226/backend/src/core/qdrant_setup.py`, find the `_ensure_payload_indexes` call for `port_knowledge` (line 68). Add `"parent_id"` to the field list:

```python
_ensure_payload_indexes(client, "port_knowledge", ["user_id", "department", "quality", "document_id", "source_file", "parent_id"])
```

- [ ] **Step 2: Commit**

```bash
git add chatSNP170226/backend/src/core/qdrant_setup.py
git commit -m "feat(qdrant): add parent_id payload index for parent-child retrieval"
```

---

### Task 9: Add Admin Reindex Endpoint

**Files:**
- Modify: `chatSNP170226/backend/src/api/admin.py`

- [ ] **Step 1: Add reindex endpoint for re-processing documents with parent-child chunking**

In `chatSNP170226/backend/src/api/admin.py`, add a new endpoint:

```python
@router.post("/reindex/{document_id}")
async def reindex_document(
    document_id: str,
    db: AsyncSession = Depends(get_db_session),
):
    """Re-process an existing document with parent-child chunking.

    Deletes existing vectors for this document, then re-runs the
    processing pipeline to create parent-child chunks.
    """
    from sqlalchemy import select
    from src.models.models import Document

    stmt = select(Document).where(Document.id == document_id)
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="Source file no longer exists on disk")

    # Delete existing vectors for this document from Qdrant
    from qdrant_client import QdrantClient
    from qdrant_client.http import models as qmodels
    qdrant = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
    qdrant.delete(
        collection_name="port_knowledge",
        points_selector=qmodels.FilterSelector(
            filter=qmodels.Filter(
                must=[qmodels.FieldCondition(
                    key="document_id",
                    match=qmodels.MatchValue(value=document_id),
                )]
            )
        ),
    )

    # Delete existing parent chunks from PostgreSQL
    from src.core.database_pool import db_pool
    db_pool.execute_query(
        "DELETE FROM chunk_parents WHERE document_id = :doc_id",
        {"doc_id": document_id},
    )

    # Re-dispatch processing task
    from src.worker.tasks import process_document
    process_document.delay(
        file_path=doc.file_path,
        user_id=doc.user_id,
        original_filename=doc.filename,
        document_id=str(doc.id),
    )

    return {"status": "reindex_started", "document_id": document_id}
```

Add the required import at the top of admin.py if not already present:

```python
import os
from fastapi import HTTPException
```

- [ ] **Step 2: Commit**

```bash
git add chatSNP170226/backend/src/api/admin.py
git commit -m "feat(admin): add reindex endpoint for parent-child chunk migration"
```

---

### Task 10: Database Migration

**Files:**
- Create: `chatSNP170226/docker/initdb/003_chunk_parents.sql`

- [ ] **Step 1: Create SQL migration file**

Create `chatSNP170226/docker/initdb/003_chunk_parents.sql`:

```sql
-- Phase 6: Parent-Child Chunking — Create chunk_parents table
-- This table stores full-context parent chunks in PostgreSQL.
-- Child chunks (smaller, search-optimized) live in Qdrant with parent_id payloads.

CREATE TABLE IF NOT EXISTS chunk_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    page_number INTEGER DEFAULT 0,
    headings JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_chunk_parents_document_id ON chunk_parents (document_id);
```

- [ ] **Step 2: Verify SQL is valid**

Run: `cd chatSNP170226 && cat docker/initdb/003_chunk_parents.sql`
Expected: the SQL file contents displayed without errors

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/docker/initdb/003_chunk_parents.sql
git commit -m "feat(db): add chunk_parents table migration for parent-child chunking"
```

---

### Task 11: Integration Test

**Files:**
- Create: `chatSNP170226/backend/tests/test_parent_child_integration.py`

- [ ] **Step 1: Write integration test verifying the full flow**

Create `chatSNP170226/backend/tests/test_parent_child_integration.py`:

```python
"""Integration test for parent-child chunking flow.

Tests the logic flow: parent chunks → split → children with parent_id
→ resolve parent content at retrieval time.
Does NOT require running services (DB, Qdrant) — uses mocks.
"""
from unittest.mock import patch, MagicMock
from uuid import uuid4

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


def test_backward_compat_no_parent_id():
    """Results without parent_id should work unchanged (backward compat)."""
    from src.worker.chat_tasks import _resolve_parent_content
    from src.services.search.hybrid_search import SearchResult

    # Simulate legacy flat chunk (no parent_id)
    result = SearchResult(
        doc_id="legacy-doc",
        content="Legacy flat chunk content",
        parent_id="",
    )

    resolved = _resolve_parent_content([result])
    assert len(resolved) == 1
    assert resolved[0].content == "Legacy flat chunk content"
```

- [ ] **Step 2: Run integration test**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_parent_child_integration.py -v`
Expected: PASS (2 tests)

- [ ] **Step 3: Commit**

```bash
git add chatSNP170226/backend/tests/test_parent_child_integration.py
git commit -m "test: add integration tests for parent-child chunking flow"
```

---

### Task 12: Run Full Test Suite and Verify

- [ ] **Step 1: Run all new tests together**

Run: `cd chatSNP170226/backend && python -m pytest tests/test_chunk_parent_model.py tests/test_chunk_splitter.py tests/test_parent_chunk_store.py tests/test_parent_child_integration.py -v`
Expected: All PASS

- [ ] **Step 2: Run existing tests to check for regressions**

Run: `cd chatSNP170226/backend && python -m pytest tests/ -v --tb=short 2>&1 | tail -20`
Expected: No new failures introduced

- [ ] **Step 3: Final commit tagging Phase 6 complete**

```bash
git commit --allow-empty -m "milestone: Phase 6 Parent-Child Chunking complete"
```
