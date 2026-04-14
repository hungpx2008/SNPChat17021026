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
