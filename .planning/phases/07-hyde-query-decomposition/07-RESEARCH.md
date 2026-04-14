# Phase 7: HyDE + Query Decomposition — RESEARCH

**Researched:** 2026-04-14
**Status:** PHASE ALREADY FULLY IMPLEMENTED
**Conclusion:** No new code needed. Phase 7 is complete — QueryEnhancer, integration, multi-query search, and tests all exist.

---

## Executive Summary

Phase 7 (HyDE + Query Decomposition) was **already implemented** in the codebase. Every component specified in the design spec exists and is wired together in the RAG pipeline.

---

## Component-by-Component Verification

### 1. QueryEnhancer Service
**Status:** DONE
**File:** `backend/src/services/search/query_enhancer.py` (370 lines)

Fully implemented:
- `QueryStrategy` enum: DIRECT, HYDE, DECOMPOSED
- `EnhancedQuery` dataclass: original, queries, strategy, hyde_output
- `QueryEnhancer` class with `enhance()` entry point
- `_classify_strategy()` — fast heuristic (no LLM): tokens < 30 → DIRECT, Vietnamese signals → DECOMPOSED, else → HYDE
- `_apply_hyde()` — LLM generates hypothetical Vietnamese answer, falls back to DIRECT on failure
- `_apply_decomposition()` — LLM splits into sub-queries (JSON), falls back to HYDE → DIRECT on failure
- `_parse_decomposition_output()` — handles JSON, markdown fences, arrays
- `_call_llm()` — httpx sync client via OpenRouter (same pattern as chat_tasks.py)

Constants match spec exactly:
- `HYDE_MIN_TOKENS = 30`
- `HYDE_MAX_OUTPUT_TOKENS = 300`
- `DECOMPOSE_MAX_SUB_QUERIES = 4`
- `DECOMPOSE_SIGNALS_VI = ["so sánh", "khác nhau", "giữa", "tương tự", "cả hai", "từng cái", "lần lượt"]`

Vietnamese prompts for HyDE and Decomposition are present and domain-specific (Tân Cảng Sài Gòn).

### 2. RAG Pipeline Integration
**Status:** DONE
**File:** `backend/src/worker/chat_tasks.py` (lines 888-904, 980-983)

```python
# Line 888-904: Query enhancement before search
from src.services.search.query_enhancer import QueryEnhancer, QueryStrategy
enhancer = QueryEnhancer()
enhanced = enhancer.enhance(question)
# Feed enhanced queries to hybrid search
query=enhanced.queries if len(enhanced.queries) > 1 else enhanced.queries[0],

# Line 980-983: Store query metadata for analytics
metadata_patch["query_strategy"] = enhanced.strategy.value
if enhanced.strategy == QueryStrategy.DECOMPOSED:
    metadata_patch["sub_queries"] = enhanced.queries
```

### 3. HybridSearch Multi-Query Support
**Status:** DONE
**File:** `backend/src/services/search/hybrid_search.py`

`search()` already accepts `str | list[str]`:
- Single query → `_single_search()`
- List of queries → `_multi_query_search()` with ThreadPoolExecutor, merge by doc_id (keep highest score)

### 4. Tests
**Status:** DONE
**File:** `backend/tests/test_query_enhancer.py`

### 5. Fallback Chain
**Status:** DONE
- Decomposition → HyDE → DIRECT (graceful degradation)
- All LLM failures caught and logged, never break the search pipeline

---

## What's NOT Implemented

Nothing. Phase 7 is 100% complete.

---

## Conclusion

**Phase 7 is fully complete.** All components — QueryEnhancer service, RAG pipeline integration, multi-query hybrid search, Vietnamese LLM prompts, fallback chains, and tests — are implemented and wired together.

**Recommendation:** Mark Phase 7 as COMPLETE. Move directly to Phase 8 (Auto-routing + Semantic Cache).
