---
plan: 10-02
status: complete
committed: 0f310218
tasks_completed: 6
tasks_total: 6
---

# Plan 10-02 Summary: Backend Structural Splits

## Result: PASS (6/6 tasks completed)

## Changes Made

### docling_service.py → docling/ package (Tasks 02.1, 02.2, 02.3)
- **`docling/models.py`** (43 LOC) — 3 dataclasses: `TableData`, `ChunkData`, `ProcessingResult`
- **`docling/parser.py`** (321 LOC) — `DocumentParser` + utility functions (`env_bool`, `env_int`, `should_call_vlm`, etc.)
- **`docling/chunker.py`** (310 LOC) — `DocumentChunker` class with `build_chunks`, `build_embedding_prefix`, `apply_group_lock`
- **`docling/table_detector.py`** (236 LOC) — `AdaptiveTableSerializer`, `TripletSerializerProvider`, `build_serializer_provider`
- **`docling/orchestrator.py`** (338 LOC) — Slimmed `DoclingProcessor`, `get_processor()`, `process_document_deep()`
- **`docling/__init__.py`** (11 LOC) — Public API re-exports
- **`docling_service.py`** (24 LOC) — Backward-compatible re-export shim

### chat_tasks.py → rag/ subpackage (Tasks 02.4, 02.5)
- **`worker/rag/context.py`** (163 LOC) — `_gather_unified_context`, `_fetch_mem0_memories`, `_fetch_session_history`, context builders
- **`worker/rag/search_helpers.py`** (418 LOC) — `_run_hybrid_search`, `_build_qdrant_filter`, `_fallback_semantic_search`, `_build_hybrid_context_and_citations`, `_save_rag_result`, `_save_rag_error`, semantic cache helpers
- **`worker/rag/synthesis.py`** (275 LOC) — `_synthesize_with_llm`, `_sanitize_generated_answer`, `_build_fallback_answer`, `_format_citations_footer`, Vietnamese sentence splitter
- **`chat_tasks.py`** reduced from 1127 LOC → 435 LOC (-61%)

### Task Dispatcher (Task 02.6)
- **`services/task_dispatcher.py`** (116 LOC) — 5 typed dispatch functions replacing scattered `.delay()` calls
- Updated `chat_service.py` and `api/chat.py` to use dispatchers

### Additional
- `RAG_SYSTEM_PROMPT` moved to `constants.py`
- `hybrid_search.py` import path updated for `_build_qdrant_filter`

## Acceptance Criteria Verification
- docling/ package: 6 modules exist, `__init__.py` re-exports public API ✅
- docling_service.py shim: 24 LOC, backward-compatible imports work ✅
- rag/ subpackage: 3 modules exist (context, search_helpers, synthesis) ✅
- chat_tasks.py: 435 LOC, each task function < 80 LOC (rag_document_search: 61 LOC) ✅
- Celery task names: all 5 `name="src.worker.tasks.*"` strings preserved ✅
- task_dispatcher.py: 5 typed dispatch functions exist ✅
- tasks.py re-export shim: unchanged, continues to work ✅
- embed_query() stays in chat_tasks.py ✅
