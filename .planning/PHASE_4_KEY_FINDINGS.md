# Phase 4: Hybrid Search — Key Findings Summary

## 🎯 Critical Discoveries

### 1. Current Search Architecture ✅
- **Semantic Search Only**: LlamaIndex + Qdrant (NO keyword/BM25)
- **Vector Size**: 1024-dimensional (Vietnamese_Embedding_v2)
- **Similarity Metric**: Cosine distance
- **Score Threshold**: 0.35 (hardcoded in RAG_SCORE_THRESHOLD)
- **Top-K Retrieval**: 5 results (hardcoded)
- **Collection**: `port_knowledge` for documents

### 2. Document Indexing Pipeline ✅
```
File → Docling (parse) → Smart Chunk (512 tokens) → Mem0 Embed → Qdrant Upsert
```
- Supports: PDF, DOCX, XLSX, PPTX, MD, TXT, JPG/PNG (via VLM)
- Stores: text, page_number, headings, row_keys, user_id, document_id
- Parallel embedding: ThreadPoolExecutor (max 8 workers)

### 3. Missing Components ❌
| Component | Status | Should Be At |
|-----------|--------|--------------|
| Token Estimator | NOT FOUND | `backend/src/utils/token_estimator.py` |
| Context Builder Service | NOT FOUND | `backend/src/services/context_builder.py` |
| Search Service Dir | NOT CREATED | `backend/src/services/search/` |
| Hybrid Search Engine | NOT IMPLEMENTED | `backend/src/services/search/hybrid_search.py` |
| Keyword Indexing | NOT IMPLEMENTED | — |

### 4. Qdrant Schema (port_knowledge) ✅
```python
{
    "text": str,
    "source_file": str,
    "page_number": int,
    "chunk_index": int,
    "user_id": str | null,
    "document_id": str | null,
    "type": "document_chunk" | "audio_transcript",
    "extractor": "docling" | "vlm" | "whisper_local",
    "headings": [str],
    "row_keys": [str],
    "quality": "low" | (implicit normal),
    "is_public": bool,
    "department": str | null,
}
```

### 5. Current Context Assembly ✅
Three sources merged:
1. **Long-term Memory**: Mem0 API search (user_id) — top 5
2. **Session Summary**: From DB metadata
3. **Recent Chat**: Last 6 messages from same session

All passed to LLM at 0.3 temperature, max 1500 tokens.

### 6. Key Functions to Understand

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `rag_document_search()` | chat_tasks.py | 623-750 | Main RAG task (Celery) |
| `_build_context_and_citations()` | chat_tasks.py | 283-341 | Dedup + format results |
| `_gather_unified_context()` | chat_tasks.py | 344-408 | Collect 3 context types |
| `_synthesize_with_llm()` | chat_tasks.py | 428-486 | LLM synthesis call |
| `process_document()` | media_tasks.py | 26-150 | Document indexing task |
| `_do_full_processing()` | media_tasks.py | 152-272 | Embed + upsert to Qdrant |

### 7. Infrastructure Details ✅

**Volumes** (Docker):
- `./backend:/app` — source code
- `media-data:/app/media` — shared between backend + worker_media
- `qdrant-data:/qdrant/storage` — vector DB persistence
- `postgres-data:` — document metadata
- `redis-data:` — message broker

**Celery Queues**:
- `chat_priority` — RAG search, memory storage (worker_chat)
- `media_process` — document indexing (worker_media)
- `data_batch` — data tasks (worker_data)

### 8. Dependencies for Phase 4 ✅
```
qdrant-client>=1.9.0          ✅ Vector DB client
llama-index>=0.11.0           ✅ Semantic search
llama-index-vector-stores-qdrant  ✅ Integration
llama-index-embeddings-huggingface ✅ HF embeddings
httpx>=0.27.0                 ✅ HTTP client
redis>=5.0.0                  ✅ Cache/broker
celery[redis]>=5.3.0          ✅ Task queue

# For Phase 4 (need to add):
# bm25s or rank-bm25 for keyword search
# tiktoken or transformers for token counting
```

### 9. RAG System Prompt ✅
- Vietnamese language, professional consultant tone
- Requires markdown table formatting for structured data
- No hallucination — cite sources as [1], [2], etc.
- Contact info fallback: "1800 1188"

### 10. Current Limitations for Hybrid Phase

**What's Missing**:
- ❌ Keyword/BM25 search (only semantic)
- ❌ Field-specific search (headings, tables only)
- ❌ Token counting (no budget management)
- ❌ Keyword extraction during indexing
- ❌ Ranking fusion (combined score)
- ❌ Fallback strategy when semantic fails

**What Needs Creation**:
1. Token estimator (TikToken + LLM token calculation)
2. Keyword extraction (during `process_document`)
3. BM25 indexing (PostgreSQL or Redis)
4. Hybrid search engine (parallel semantic + keyword)
5. Ranking fusion (combined scoring)
6. Context builder service (token-aware assembly)

---

## Implementation Ready? ✅

You have **all the code** you need:
- ✅ Qdrant setup and operations
- ✅ Docling document extraction
- ✅ Embedding pipeline (Mem0)
- ✅ LLM synthesis pattern
- ✅ Docker infrastructure
- ✅ Celery worker pattern

You need to **create**:
- 📝 `token_estimator.py` (token counting)
- 📝 `context_builder.py` (token-aware context assembly)
- 📝 `services/search/` directory with hybrid search
- 📝 Keyword extraction in document indexing
- 📝 New `hybrid_rag_document_search` Celery task

---

## Next Action
→ Begin Phase 4 planning with this foundation

