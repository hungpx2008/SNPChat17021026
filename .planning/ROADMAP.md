# Smart2Brain Integration — Roadmap

## Milestone 1: Smart2Brain Techniques

### Phase 1: Token-Aware Context Building
- **Goal:** Replace hardcoded context assembly (6 recent msgs + summary + memory) with dynamic budget-based building
- **Status:** Not Started
- **New files:** `backend/src/utils/token_estimator.py`, `backend/src/services/context_builder.py`
- **Modified:** `backend/src/worker/chat_tasks.py`
- **Depends on:** None (foundation)

### Phase 2: Smart Summarization
- **Goal:** Replace "every 10 messages" trigger with token-aware summarization
- **Status:** Not Started
- **New files:** `backend/src/utils/summarization.py`
- **Modified:** `backend/src/services/chat_service.py`, `backend/src/worker/chat_tasks.py`
- **Depends on:** Phase 1 (uses token estimation)

### Phase 3: Dynamic System Prompt
- **Goal:** Replace static `_RAG_SYSTEM_PROMPT` with context-aware dynamic prompt builder
- **Status:** Not Started
- **New files:** (added to `backend/src/services/context_builder.py`)
- **Modified:** `backend/src/worker/chat_tasks.py`
- **Depends on:** Phase 1 (uses context builder)

### Phase 4: Hybrid Search (Semantic + BM25 + RRF)
- **Goal:** Add lexical BM25 search alongside existing Qdrant semantic search
- **Status:** Not Started — Team B
- **Depends on:** Independent

### Phase 5: Conversation Branching
- **Goal:** Transform linear chat history into tree structure
- **Status:** Not Started — Team B
- **Depends on:** Phase 4

## Milestone 2: EON Gap Techniques

### Phase 6: Parent-Child Chunking
- **Goal:** Replace flat single-tier chunking with 2-tier parent-child model. Child chunks (small, ~384 tokens) for vector search precision. Parent chunks (large, ~2048 tokens) fed to LLM for complete context.
- **Status:** Complete (discovered already implemented — config defaults aligned 2026-04-14)
- **Implemented files:** `backend/src/services/chunk_splitter.py`, `backend/src/services/parent_chunk_store.py`, `backend/src/models/models.py` (ChunkParent), `backend/src/worker/media_tasks.py`, `backend/src/worker/chat_tasks.py` (_resolve_parent_content), `backend/src/services/search/hybrid_search.py` (SearchResult.parent_id)
- **Tests:** `backend/tests/test_chunk_splitter.py`, `backend/tests/test_parent_chunk_store.py`, `backend/tests/test_parent_child_integration.py`
- **Depends on:** Phase 4 (Hybrid Search)
- **Spec:** `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md`

### Phase 7: HyDE + Query Decomposition
- **Goal:** Enhance RAG queries with Hypothetical Document Embedding and complex query splitting
- **Status:** Complete (discovered already implemented — verified 2026-04-14)
- **Implemented files:** `backend/src/services/search/query_enhancer.py` (QueryEnhancer, EnhancedQuery, QueryStrategy), `backend/src/worker/chat_tasks.py` (integration), `backend/src/services/search/hybrid_search.py` (multi-query search)
- **Tests:** `backend/tests/test_query_enhancer.py`
- **Depends on:** Phase 6 (Parent-Child Chunking)

### Phase 8: Auto-routing + Semantic Cache
- **Goal:** Auto-detect query intent (chat/sql/rag) and cache frequent Q&A pairs semantically
- **Status:** Complete (discovered already implemented — verified 2026-04-14)
- **Implemented files:** `backend/src/services/intent_router.py` (IntentRouter), `backend/src/services/search/semantic_cache.py` (SemanticCache), `backend/src/services/chat_service.py` (integration), `backend/src/worker/chat_tasks.py` (cache integration)
- **Depends on:** Phase 7

### Phase 9: PaddleOCR Integration
- **Goal:** Extract text from scanned PDFs and images using PaddleOCR
- **Status:** Complete (discovered already implemented — verified 2026-04-14, gated behind ENABLE_PADDLE_OCR=true)
- **Implemented files:** `backend/src/services/ocr_service.py` (OCRService), `backend/src/worker/media_tasks.py` (integration)
- **Depends on:** Independent

### Phase 10: Code Quality 5-Star Refactor

- **Goal:** Refactor the two largest backend files, two largest frontend components, eliminate code duplication, tighten security, add unit tests, and improve type safety across the full stack
- **Status:** Planned (2026-04-15)
- **Depends on:** Phase 9
- **Requirements:** CORS-DRY, CONSTANTS-CENTRAL, BACKEND-ERROR-CLASS, REQUEST-TIMEOUT, DOCLING-SPLIT, CHAT-TASKS-SPLIT, TASK-DISPATCH-EXTRACT, SIDEBAR-SPLIT, MESSAGELIST-SPLIT, SANITIZER-DRY, ICONBUTTON-EXTRACT, DEAD-CODE-REMOVE, PROP-DRILL-CONTEXT, SPECIFIC-EXCEPTIONS, DOCSTRINGS, TYPE-SAFETY, HOOK-ENCAPSULATION, UNIT-TESTS-SANITIZERS, UNIT-TESTS-RAG, FRONTEND-TESTS, SECURITY-CORS
- **Plans:** 5 plans (29 tasks across 5 waves)
- **Research:** `.planning/phases/10-code-quality-5-star-refactor/10-RESEARCH.md`

Plans:
- [ ] 10-01-PLAN (Wave 1, 7 tasks) — Constants, CORS helper, BackendError, request timeout
- [ ] 10-02-PLAN (Wave 2, 6 tasks) — Split docling_service.py (821 LOC) and chat_tasks.py (1129 LOC) into subpackages
- [ ] 10-03-PLAN (Wave 3, 7 tasks) — Split chat-sidebar.tsx (542 LOC) and chat-message-list.tsx (489 LOC), extract sanitizers, delete dead code
- [ ] 10-04-PLAN (Wave 4, 5 tasks) — Specific exceptions, docstrings, type safety, hook encapsulation
- [ ] 10-05-PLAN (Wave 5, 4 tasks) — Unit tests for sanitizers and RAG helpers, CORS security verification

### Phase 11: Performance Optimization

- **Goal:** Document upload ≤2MB completes in ≤90s p95 with visible progress; no concurrent-upload blocking; reliable timeouts; DB/HTTP pooling verified
- **Status:** Planned (2026-04-17) — triggered by Phase 10 UAT Test 5 failure (upload stuck >7 min)
- **Depends on:** Phase 10
- **Requirements:** PERF-VLM-PARALLEL, PERF-VLM-TOGGLE, PERF-WORKER-CONCURRENCY, PERF-CELERY-TIME-LIMITS, PERF-PROGRESS, PERF-MEM0-HEALTH, PERF-CONVERTER-SINGLETON, PERF-SSE-UPLOAD, PERF-DB-POOL, PERF-DB-INDEXES, PERF-CHAT-PAGINATION, PERF-METRICS
- **Research:** `.planning/phases/11-performance-optimization/11-RESEARCH.md`
- **Debug trigger:** `.planning/debug/phase10-upload-perf.md`

Plans (proposed):
- [x] 11-01-PLAN — Docling VLM parallelization + converter singleton + stage timing (5 tasks)
- [x] 11-02-PLAN — Celery worker hardening (concurrency, time limits, Mem0 health, circuit breaker) (5 tasks)
- [x] 11-03-PLAN — Progress SSE (documents.meta.progress, Redis publish, /upload/{id}/stream, frontend UI) (5 tasks)
- [x] 11-04-PLAN — DB pool + performance indexes (4 tasks)
- [x] 11-05-PLAN — Chat history pagination + HTTP pool verification + regression tests (3 tasks)
