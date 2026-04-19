# Phase 6: Parent-Child Chunking - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning
**Source:** PRD Express Path (docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md)

<domain>
## Phase Boundary

Replace flat single-tier chunking (~768 tokens) with a 2-tier parent-child model:
- **Child chunks** (~384 tokens): small, optimized for vector search precision
- **Parent chunks** (~2048 tokens): large, complete context fed to LLM

This phase changes:
1. **Ingestion pipeline** — Docling creates larger parent chunks, splits into children, stores both
2. **Storage** — New PostgreSQL table `chunk_parents`, Qdrant payload gets `parent_id` field
3. **Retrieval** — Search returns child chunks, fetch parent content for LLM context
4. **Whoosh index** — Indexes child chunks instead of flat chunks

Does NOT change: Qdrant collection schema, embedding model, frontend, API endpoints (except optional admin reindex).

</domain>

<decisions>
## Implementation Decisions

### Chunk Sizes
- Parent chunks: ~2048 tokens (increase Docling DOCLING_CHUNK_MAX_TOKENS from 768 → 2048)
- Child chunks: ~384 tokens (split from parents)
- Child overlap: 50 tokens between consecutive children
- If parent < 384 * 1.5 = 576 tokens → keep as single child (no split)

### Storage Model
- Parent content stored in PostgreSQL `chunk_parents` table (NOT embedded in Qdrant)
- Child chunks stored in Qdrant `port_knowledge` collection (same as current)
- Each child payload adds `parent_id` (UUID string) and `is_child: true`
- No new Qdrant collection needed

### Database Table: ChunkParent
- Fields: id (UUID PK), document_id (FK → documents.id CASCADE), content (Text), page_number (int), headings (JSONB), metadata (JSONB), created_at (timestamp)
- Alembic migration required

### Splitting Algorithm
- Use `token_estimator.estimate_tokens()` from S2B Phase 1
- Split at sentence boundaries (Vietnamese sentence detection)
- Overlap 50 tokens between consecutive children
- Each child inherits parent's page_number, headings, row_keys metadata

### Retrieval Flow Change
- Search child chunks (Hybrid Search: BM25 + Semantic + RRF) — unchanged
- Collect unique parent_ids from search results
- Fetch parent content from PostgreSQL
- Dedup parents (multiple children → same parent)
- Feed parent content to LLM (not child content)
- Keep child-level source_file + page_number for citations

### Backward Compatibility
- Legacy chunks (no parent_id) → use content directly (current behavior)
- Optional admin endpoint: POST /admin/reindex/{document_id}
- No data loss — parent table is additive

### Claude's Discretion
- Vietnamese sentence boundary detection approach (regex vs underthesea)
- Internal function naming and file organization within chunking module
- Alembic migration version naming
- Logging verbosity for chunking operations
- Error handling strategy for partial parent saves

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Spec
- `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md` — Full Phase 6 design spec with code examples

### Current Ingestion Pipeline
- `chatSNP170226/backend/src/services/docling_service.py` — Docling chunking logic, _smart_chunk(), current constants
- `chatSNP170226/backend/src/worker/media_tasks.py` — process_document task, _do_full_processing()
- `chatSNP170226/backend/src/worker/helpers.py` — _smart_chunk() helper

### Current Retrieval Pipeline
- `chatSNP170226/backend/src/worker/chat_tasks.py` — rag_document_search task, _gather_unified_context()
- `chatSNP170226/backend/src/services/search/hybrid_search.py` — HybridSearchService, SearchResult dataclass
- `chatSNP170226/backend/src/services/search/lexical_search.py` — Whoosh BM25 index

### Models & DB
- `chatSNP170226/backend/src/models/models.py` — SQLAlchemy models (Document, Session, Message, etc.)
- `chatSNP170226/backend/src/core/database.py` — DB session management

### Token Estimation (S2B Phase 1)
- `chatSNP170226/backend/src/utils/token_estimator.py` — estimate_tokens() function

### Context Builder (S2B Phase 1)
- `chatSNP170226/backend/src/services/context_builder.py` — Budget-based context assembly

</canonical_refs>

<specifics>
## Specific Ideas

- Use Option A for Docling chunk size: increase DOCLING_CHUNK_MAX_TOKENS env var from 768 → 2048
- ChunkParent table with CASCADE delete on document_id FK
- SearchResult dataclass gets parent_id: str = "" field
- _fetch_parent_chunks() helper in chat_tasks.py
- _split_into_children() method in docling_service.py

</specifics>

<deferred>
## Deferred Ideas

- Bulk reindex CLI command for all existing documents (manual trigger via admin endpoint for now)
- Parent chunk compression/summarization (future optimization)
- Parent-child relationship visualization in admin dashboard

</deferred>

---

*Phase: 06-parent-child-chunking*
*Context gathered: 2026-04-14 via PRD Express Path*
