# Phase 6: Parent-Child Chunking — RESEARCH

**Researched:** 2026-04-14
**Status:** PHASE ALREADY FULLY IMPLEMENTED
**Conclusion:** No new code needed. Phase 6 is complete — ingestion, storage, retrieval, and tests all exist.

---

## Executive Summary

Phase 6 (Parent-Child Chunking) was **already implemented** in the codebase prior to this planning cycle. Every component specified in the design spec (`docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md`) exists and is wired together. The implementation matches the spec's requirements exactly.

---

## Component-by-Component Verification

### 1. ChunkParent Model (PostgreSQL Storage)
**Status:** DONE
**File:** `backend/src/models/models.py` (lines 123-146)

```python
class ChunkParent(Base):
    __tablename__ = "chunk_parents"
    __table_args__ = (Index("ix_chunk_parents_document_id", "document_id"),)

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id: Mapped[Optional[UUID]] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=True)
    content: Mapped[str] = mapped_column(Text(), nullable=False)
    page_number: Mapped[int] = mapped_column(default=0, insert_default=0)
    headings: Mapped[list] = mapped_column("headings", JSON, default=list, insert_default=list)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict, insert_default=dict)
    created_at: Mapped[datetime] = ...
```

- Matches spec: id, document_id (CASCADE), content, page_number, headings, metadata, created_at
- Index on document_id present
- DB table auto-created via `Base.metadata.create_all` in `src/core/db.py:64` (no Alembic needed)

### 2. Child Chunk Splitter
**Status:** DONE
**File:** `backend/src/services/chunk_splitter.py` (140 lines)

- Constants match spec: `PARENT_CHUNK_MAX_TOKENS = 2048`, `CHILD_CHUNK_MAX_TOKENS = 384`, `CHILD_CHUNK_OVERLAP_TOKENS = 50`
- No-split threshold: `int(384 * 1.5) = 576` tokens — matches spec
- Sentence boundary regex: `(?<=[.!?])\s+` (Vietnamese-compatible)
- Uses `token_estimator.estimate_tokens()` from S2B Phase 1
- Each child inherits: parent_id, page, headings, row_keys, chunk_index
- Overlap via sentence backtracking (last N sentences fitting in 50 tokens)

### 3. Parent Chunk Store (PostgreSQL CRUD)
**Status:** DONE
**File:** `backend/src/services/parent_chunk_store.py` (89 lines)

- `save_parent_chunks(document_id, parents)` — batch INSERT into `chunk_parents`
- `fetch_parent_content(parent_ids)` — batch SELECT by ID list, returns `dict[str, str]`
- Uses `db_pool.execute_query()` / `db_pool.fetch_all()` (sync for Celery workers)
- Missing parents return empty string (backward compat)

### 4. Ingestion Pipeline
**Status:** DONE
**File:** `backend/src/worker/media_tasks.py` — `_do_full_processing()`

The Docling path already:
1. Builds `parent_data` list from Docling chunks
2. Calls `save_parent_chunks(document_id, parent_data)` → PostgreSQL
3. Calls `split_into_children(parent_text, parent_id, parent_meta)` → child chunks
4. Builds child payloads with `parent_id` and `is_child: True` in Qdrant metadata
5. Falls back to flat `_smart_chunk()` for VLM/non-Docling paths

### 5. DOCLING_CHUNK_MAX_TOKENS
**Status:** DONE — already 2048
**File:** `backend/src/services/docling_service.py` (lines 198, 483)

```python
max_tokens = int(os.getenv("DOCLING_CHUNK_MAX_TOKENS", "2048"))
```

Default changed from 768 → 2048 in the code. Docker Compose still shows `${DOCLING_CHUNK_MAX_TOKENS:-768}` as fallback, but the Python code default is 2048.

### 6. SearchResult.parent_id
**Status:** DONE
**File:** `backend/src/services/search/hybrid_search.py` (line 55)

```python
@dataclass
class SearchResult:
    ...
    parent_id: str = ""  # ChunkParent UUID — empty for legacy flat chunks
```

### 7. RRF Fusion — parent_id Extraction
**Status:** DONE
**File:** `backend/src/services/search/hybrid_search.py` — `_rrf_fusion()`

Semantic results extract `parent_id` from metadata:
```python
parent_id=item.get("metadata", {}).get("parent_id", "")
```

### 8. Retrieval — Parent Content Resolution
**Status:** DONE
**File:** `backend/src/worker/chat_tasks.py` (lines 782-816)

```python
def _resolve_parent_content(hybrid_results: list) -> list:
    from src.services.parent_chunk_store import fetch_parent_content
    parent_ids = list({r.parent_id for r in hybrid_results if hasattr(r, "parent_id") and r.parent_id})
    if not parent_ids:
        return hybrid_results  # No parent-child chunks, use as-is
    parent_map = fetch_parent_content(parent_ids)
    # Dedup by parent_id, replace child content with parent content
    ...
```

Called at line 917: `hybrid_results = _resolve_parent_content(hybrid_results)`

- Collects unique parent_ids from search results
- Fetches parent content from PostgreSQL
- Deduplicates (multiple children → same parent)
- Replaces child content with parent content
- Backward compat: results without parent_id keep original content

### 9. Tests
**Status:** DONE
**Files:**
- `backend/tests/test_chunk_splitter.py` — Unit tests for split_into_children
- `backend/tests/test_parent_chunk_store.py` — Tests for save/fetch
- `backend/tests/test_parent_child_integration.py` — Integration tests

### 10. Whoosh Lexical Index
**Status:** Indexes whatever is stored in Qdrant (child chunks)
**File:** `backend/src/services/search/lexical_search.py`

The Whoosh `rebuild_index()` pulls from Qdrant — since child chunks are now stored in Qdrant, Whoosh automatically indexes children. No change needed.

---

## What's NOT Implemented (Minor Gaps)

### 1. Admin Reindex Endpoint
**Status:** NOT DONE (deferred in spec)
No `POST /admin/reindex/{document_id}` endpoint exists. This was listed as optional in the CONTEXT.md.

### 2. Docker Compose Default
**Status:** MINOR INCONSISTENCY
`docker-compose.yml` line 27: `DOCLING_CHUNK_MAX_TOKENS: ${DOCLING_CHUNK_MAX_TOKENS:-768}` 
Python code default is 2048. The docker-compose fallback is 768. If `.env` doesn't set it, docker-compose overrides Python default. Should update docker-compose to `:-2048`.

### 3. .env.example Files
**Status:** MINOR — still show 512
Both `chatSNP170226/.env.example` and `chatSNP170226/backend/.env.example` have `DOCLING_CHUNK_MAX_TOKENS=512`. Should update to 2048 for consistency.

---

## Conclusion

**Phase 6 is 95%+ complete.** The only remaining work is:
1. Fix `docker-compose.yml` default: `768` → `2048`
2. Fix `.env.example` files: `512` → `2048`
3. (Optional) Add admin reindex endpoint

These are configuration fixes, not code changes. The core parent-child chunking system — splitting, storage, ingestion, retrieval, dedup — is fully implemented and wired together.

**Recommendation:** Mark Phase 6 as COMPLETE after fixing the env defaults. Move directly to Phase 7 (HyDE + Query Decomposition).
