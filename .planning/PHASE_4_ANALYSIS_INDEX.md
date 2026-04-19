# Phase 4: Hybrid Search — Complete Analysis Index

**Generated**: April 13, 2026  
**Status**: ✅ Comprehensive Codebase Review Complete  
**Deliverables**: 3 detailed analysis documents + 1 index

---

## 📋 Documents Included

### 1. **PHASE_4_SEARCH_ANALYSIS.md** (31 KB, 1019 lines)
   - **Purpose**: Deep dive into existing implementation
   - **Contents**:
     - Executive summary with current state vs. Phase 4 requirements
     - Full function code with explanations:
       - `rag_document_search()` (623-750 lines)
       - Helper functions for RAG (_build_context_and_citations, _gather_unified_context, _synthesize_with_llm)
       - `process_document()` (26-150 lines) with document indexing pipeline
       - `_do_full_processing()` (152-272 lines) with embedding and upsert logic
     - Docker Compose volumes configuration
     - Dependencies (pyproject.toml)
     - Service directory structure
     - Qdrant setup and collections
     - Token estimator & context builder status (NOT FOUND)
     - File structure summary
     - Configuration & environment variables
     - RAG constants
     - Recommendations for Phase 4
   - **Use This For**: Understanding the complete architecture and implementation details

### 2. **PHASE_4_KEY_FINDINGS.md** (5 KB, 144 lines)
   - **Purpose**: Executive summary of critical discoveries
   - **Contents**:
     - Current search architecture (semantic only)
     - Document indexing pipeline
     - Missing components table
     - Qdrant schema (port_knowledge)
     - Context assembly overview
     - Key functions reference table
     - Infrastructure details (volumes, Celery queues)
     - Dependencies status
     - RAG system prompt
     - Current limitations
     - Implementation readiness checklist
   - **Use This For**: Quick reference and decision-making

### 3. **PHASE_4_CODE_REFERENCE.md** (15 KB, 481 lines)
   - **Purpose**: Copy-paste ready code snippets
   - **Contents**:
     - Qdrant collection schema with additions for Phase 4
     - Current RAG search flow (step-by-step)
     - Document indexing flow (step-by-step)
     - Qdrant setup code (full implementation)
     - Access control filter code
     - Context assembly code (full)
     - LLM synthesis code (full)
     - Docker Compose volumes configuration
     - Constants and configuration values
     - Celery task definition pattern
     - Where to put Phase 4 code (directory structure)
   - **Use This For**: Implementation reference and code templates

### 4. **PHASE_4_ANALYSIS_INDEX.md** (This File)
   - **Purpose**: Navigation and summary
   - **Contents**: Document overview, quick facts, checklist

---

## 🎯 Quick Facts

| Aspect | Details |
|--------|---------|
| **Current Search Type** | Semantic only (LlamaIndex + Qdrant) |
| **Vector Dimension** | 1024 (Vietnamese_Embedding_v2) |
| **Similarity Metric** | Cosine distance |
| **Score Threshold** | 0.35 (hardcoded) |
| **Top-K Results** | 5 (hardcoded) |
| **Chunk Size** | 512 tokens, 50 overlap |
| **Main Celery Task** | `rag_document_search` (chat_priority queue) |
| **Document Indexing Task** | `process_document` (media_process queue) |
| **Vector DB Collection** | `port_knowledge` |
| **Access Control** | user_id + department + quality=low filter |
| **Context Sources** | 3 (Long-term memory, Session summary, Recent chat) |
| **LLM Temperature** | 0.3 (consistent) |
| **LLM Max Tokens** | 1500 |

---

## ❌ What's MISSING

### NOT FOUND
- ❌ `token_estimator.py` — Token counting utility
- ❌ `context_builder.py` — Context assembly service
- ❌ `services/search/` directory — Search service modules
- ❌ Keyword indexing — BM25/TF-IDF support
- ❌ Hybrid search engine — Combined semantic + keyword

### NOT IMPLEMENTED
- ❌ Keyword extraction during document indexing
- ❌ Token budget management
- ❌ Ranking fusion (semantic + keyword scores)
- ❌ Fallback search when semantic fails
- ❌ Field-specific search (headings, tables only)

---

## ✅ What's READY FOR Phase 4

### Infrastructure ✅
- Qdrant setup + collections
- Docling document extraction
- Embedding pipeline (Mem0)
- LLM synthesis (OpenRouter/OpenAI)
- Celery task infrastructure
- Docker infrastructure

### Code Patterns ✅
- RAG task pattern (bind=True, max_retries=2)
- Parallel embedding with ThreadPoolExecutor
- Access control filters
- Context assembly with multiple sources
- LLM synthesis with system prompts

### Dependencies ✅
- qdrant-client>=1.9.0
- llama-index>=0.11.0
- httpx>=0.27.0
- celery[redis]>=5.3.0
- (Need to add: tiktoken, rank-bm25 or bm25s)

---

## 🔧 Implementation Checklist

### Phase 4 Must Create

- [ ] **token_estimator.py** — Token counting utility
  - Estimate tokens using tiktoken (OpenAI) or transformers tokenizer
  - Support for different LLM models
  - Context window calculation
  
- [ ] **context_builder.py** — Context assembly service
  - Manage context with token budgets
  - Deduplication at context level
  - Priority-based inclusion (long-term > summary > recent)

- [ ] **services/search/** directory
  - [ ] `__init__.py`
  - [ ] `hybrid_search.py` — Main hybrid engine
  - [ ] `semantic_engine.py` — Semantic search wrapper
  - [ ] `keyword_engine.py` — BM25 keyword search
  - [ ] `ranking.py` — Ranking fusion algorithms

- [ ] **Update qdrant_setup.py**
  - Add `keywords` field indexing
  - Create `keyword_search()` function
  - Add `language` field indexing

- [ ] **Update media_tasks.py**
  - Extract keywords during document indexing
  - Store keywords in Qdrant payload

- [ ] **Update chat_tasks.py**
  - Create `hybrid_rag_document_search()` Celery task
  - Parallel semantic + keyword search
  - Ranking fusion
  - Token-aware context assembly

---

## 📂 File Locations

### chatSNP170226 Path
```
/Volumes/orical/ChatSNP/chatSNP170226/backend/src/
├── worker/chat_tasks.py              ← Lines 623-750 (rag_document_search)
├── worker/media_tasks.py             ← Lines 26-272 (process_document)
├── services/
│   ├── docling_service.py            ✅ Document extraction
│   ├── chat_service.py               ✅ Chat logic
│   └── search/                       ❌ To be created
├── core/qdrant_setup.py              ✅ Vector DB operations
└── utils/                            (token_estimator.py to be created)
```

### Root Backend Path
```
/Volumes/orical/ChatSNP/backend/src/
├── services/search/                 ❌ To be created
├── core/qdrant_setup.py             ✅ Same as above
└── worker/                          (Doesn't exist in root; use chatSNP170226)
```

---

## 🔗 Key Functions Reference

### Main RAG Task
- **`rag_document_search()`** — chatSNP170226/backend/src/worker/chat_tasks.py:623-750
  - Entry point for semantic RAG search
  - Retrieves top-5 chunks, filters by score threshold
  - Synthesizes answer via LLM
  - Saves to backend API

### Document Indexing
- **`process_document()`** — chatSNP170226/backend/src/worker/media_tasks.py:26-150
  - Handles PDF, DOCX, XLSX, PPTX, MD, TXT, JPG/PNG
  - Extracts via Docling or VLM
  - Chunks text (512 tokens)

- **`_do_full_processing()`** — chatSNP170226/backend/src/worker/media_tasks.py:152-272
  - Embeds chunks via Mem0 (parallel)
  - Upserts to Qdrant
  - Updates document status

### RAG Helpers
- **`_build_context_and_citations()`** — chat_tasks.py:283-341
  - Deduplicates results
  - Formats citations

- **`_gather_unified_context()`** — chat_tasks.py:344-408
  - Collects 3 context sources
  - Long-term memory, session summary, recent chat

- **`_synthesize_with_llm()`** — chat_tasks.py:428-486
  - Calls LLM (OpenRouter/OpenAI)
  - 0.3 temperature, 1500 max tokens

- **`_build_qdrant_filter()`** — chat_tasks.py:171-206
  - Access control (user_id + department)
  - Quality gate (exclude quality=low)

---

## 🚀 Next Steps

1. **Review Documents**
   - Start with PHASE_4_KEY_FINDINGS.md (quick overview)
   - Then PHASE_4_SEARCH_ANALYSIS.md (detailed understanding)
   - Reference PHASE_4_CODE_REFERENCE.md during implementation

2. **Create Phase 4 Plan**
   - Design token estimator interface
   - Design context builder service
   - Design hybrid search ranking algorithm
   - Define keyword extraction strategy

3. **Implementation Order**
   - Start: `token_estimator.py` (foundation)
   - Then: `context_builder.py` (depends on token_estimator)
   - Then: `services/search/` (main hybrid engine)
   - Then: Update `media_tasks.py` for keyword extraction
   - Finally: Create `hybrid_rag_document_search` Celery task

---

## 📊 Code Statistics

| File | Lines | Status | Key Content |
|------|-------|--------|------------|
| chat_tasks.py | 931 | ✅ Production | RAG search, context, synthesis |
| media_tasks.py | 436 | ✅ Production | Document indexing, embedding |
| qdrant_setup.py | 105 | ✅ Production | Vector DB operations |
| Token estimator | 0 | ❌ Missing | To be created |
| Context builder | 0 | ❌ Missing | To be created |
| Hybrid search | 0 | ❌ Missing | To be created |

---

## 💡 Key Insights

1. **Semantic Search is Complete** — LlamaIndex + Qdrant works well
2. **Indexing Pipeline is Solid** — Docling → Mem0 → Qdrant is reliable
3. **Token Counting Missing** — No budget management for context
4. **No Keyword Search** — Only semantic, no BM25 fallback
5. **Phase 1 Incomplete** — token_estimator.py was supposed to be created but wasn't
6. **Hardcoded Limits** — top_k=5 and threshold=0.35 not configurable
7. **Access Control Ready** — User ID + Department filters already implemented
8. **Mem0 Integration Works** — Long-term memory retrieval working
9. **Vietnamese Focus** — Optimized for Vietnamese embeddings and language

---

## 📝 Notes for Implementation

### Dependencies to Add
```toml
# In pyproject.toml
"tiktoken>=0.5.0",           # For token counting
"rank-bm25>=0.2.2",         # For BM25 keyword search
# Or: "bm25s>=0.3.0"         # Alternative BM25 library
```

### Configuration Variables to Add
```bash
# In .env
HYBRID_SEARCH_ENABLED=true
KEYWORD_SEARCH_WEIGHT=0.3
SEMANTIC_SEARCH_WEIGHT=0.7
TOKEN_LIMIT_FOR_CONTEXT=2000
KEYWORD_EXTRACTION_MODEL=yake  # or spacy, tfidf
```

### Collection Updates
```python
# In Qdrant payload, ADD fields:
payload["keywords"] = ["keyword1", "keyword2", ...]
payload["language"] = "vi"
payload["summary"] = "Short chunk summary..."
```

---

## ✨ Summary

You have a **solid foundation**:
- ✅ Working semantic search (LlamaIndex + Qdrant)
- ✅ Complete document indexing (Docling + Mem0)
- ✅ LLM synthesis (OpenRouter/OpenAI)
- ✅ Access control filters
- ✅ Celery task infrastructure

You need to **create Phase 4**:
- 📝 Token estimator
- 📝 Context builder service
- 📝 Hybrid search engine
- 📝 Keyword extraction
- 📝 Ranking fusion

**All the code you need is provided.** Ready to implement! 🚀

---

**Report Generated**: April 13, 2026  
**Analysis Scope**: ChatSNP Backend (both /backend and /chatSNP170226/backend)  
**Next Phase**: Implementation planning with full code reference

