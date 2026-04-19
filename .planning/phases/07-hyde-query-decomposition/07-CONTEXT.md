# Phase 7: HyDE + Query Decomposition — Context

**Gathered:** 2026-04-14
**Status:** Ready for planning
**Source:** PRD Express Path (docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md)

<domain>
## Phase Boundary

Enhance RAG search quality with two query enhancement strategies:
- **HyDE (Hypothetical Document Embedding):** For long Vietnamese queries, LLM generates a hypothetical answer, embed that instead of the raw query
- **Query Decomposition:** For complex multi-part questions, split into sub-queries searched in parallel

This phase changes:
1. **New service** — `QueryEnhancer` class with classify → enhance pipeline
2. **RAG pipeline** — `chat_tasks.py` calls enhancer before hybrid search
3. **Hybrid search** — Accept `list[str]` for multi-query parallel search

Does NOT change: Qdrant collection, embedding model, frontend, ingestion pipeline, parent-child chunking.

</domain>

<decisions>
## Implementation Decisions

### Query Enhancement Strategies
- DIRECT: queries < 30 tokens → search as-is (no LLM overhead)
- HYDE: long queries → LLM generates ~100-word hypothetical answer in Vietnamese → embed that
- DECOMPOSED: complex multi-part queries → split into ≤4 sub-queries → search each in parallel

### Classification Heuristic
- Fast, no LLM call needed for classification
- Token count via `estimate_tokens()` from Phase 1
- Vietnamese comparison signals: "so sánh", "khác nhau", "giữa", "tương tự", etc.

### LLM Integration
- Same model as existing: gpt-4o-mini via OpenRouter
- HyDE: temperature=0.3, max_tokens=300
- Decomposition: temperature=0.1, max_tokens=300, JSON output
- Fallback chain: Decomposition → HyDE → DIRECT if LLM fails

### Constants
- HYDE_MIN_TOKENS = 30
- HYDE_MAX_OUTPUT_TOKENS = 300
- DECOMPOSE_MAX_SUB_QUERIES = 4
- DECOMPOSE_SIGNALS_VI = ["so sánh", "khác nhau", "giữa", "tương tự", "cả hai", "từng cái", "lần lượt"]

### HybridSearch Multi-Query
- `search()` accepts `str | list[str]`
- Multiple sub-queries searched in parallel (ThreadPoolExecutor)
- Merge results by doc_id, keep highest score

</decisions>

<canonical_refs>
## Canonical References

### Spec
- `docs/superpowers/specs/2026-04-13-eon-gap-techniques-design.md` — Full Phase 7 design spec

### Current RAG Pipeline
- `chatSNP170226/backend/src/worker/chat_tasks.py` — rag_document_search task
- `chatSNP170226/backend/src/services/search/hybrid_search.py` — HybridSearchService
- `chatSNP170226/backend/src/services/search/query_enhancer.py` — QueryEnhancer (if exists)

### Token Estimation
- `chatSNP170226/backend/src/utils/token_estimator.py` — estimate_tokens()

</canonical_refs>

<specifics>
## Specific Ideas
- QueryEnhancer class in `backend/src/services/search/query_enhancer.py`
- EnhancedQuery dataclass with original, queries, strategy, hyde_output fields
- Vietnamese-specific prompts for HyDE and Decomposition
- Integration point: between question extraction and hybrid_search.search() call

</specifics>

<deferred>
## Deferred Ideas
- A/B testing framework for query strategies
- User feedback on which strategy produced better results
- Custom domain-specific decomposition rules

</deferred>

---

*Phase: 07-hyde-query-decomposition*
*Context gathered: 2026-04-14 via PRD Express Path*
