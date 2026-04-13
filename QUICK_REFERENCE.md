# ChatSNP Quick Reference Guide

## 🚀 Key Entry Points

### Document Ingestion
```
endpoint: UPLOAD → celery task
  ↓
process_document() 
  @ backend/src/worker/media_tasks.py:26
  ↓
DoclingProcessor.process()
  @ backend/src/services/docling_service.py:607
  ↓
upsert_vectors("port_knowledge", payloads, vectors)
  @ backend/src/core/qdrant_setup.py:71
```

### RAG Search
```
POST /sessions/{id}/messages (mode=rag)
  ↓
ChatService.add_message()
  @ backend/src/services/chat_service.py:64
  ↓
rag_document_search.delay()
  @ backend/src/worker/chat_tasks.py:623
  ↓
VectorStoreIndex.retrieve()
  (LlamaIndex + Qdrant)
  ↓
LLM synthesis + Redis pub/sub event
```

## 📊 File Locations

| Component | Path | Key Functions |
|---|---|---|
| **Docling** | `backend/src/services/docling_service.py` | `process()`, `_build_docling_chunks()` |
| **Media Tasks** | `backend/src/worker/media_tasks.py` | `process_document()`, `_do_full_processing()` |
| **Chat Tasks** | `backend/src/worker/chat_tasks.py` | `rag_document_search()`, `_gather_unified_context()` |
| **Chat Service** | `backend/src/services/chat_service.py` | `add_message()` |
| **Qdrant Setup** | `backend/src/core/qdrant_setup.py` | `upsert_vectors()`, `ensure_collections()` |
| **Chat API** | `backend/src/api/chat.py` | `add_message()`, `stream_session()` |
| **Composer UI** | `frontend/src/components/chat/chat-composer.tsx` | Mode selection UI |
| **Config** | `backend/src/core/config.py` | Settings class |
| **Helpers** | `backend/src/worker/helpers.py` | `_smart_chunk()`, `publish_task_complete()` |

## 🔗 Data Structures

### ChunkData (Docling native)
```python
text: str                    # Chunk text
page_number: int             # Page #
headings: list[str]          # Heading hierarchy
metadata: dict               # {row_keys, doc_items, has_cell_provenance}
```

### Qdrant Payload (port_knowledge)
```python
text, source_file, page_number, chunk_index, user_id, document_id,
type="document_chunk", extractor="docling"/"vlm",
headings, row_keys, quality, department, is_public, dislike_reason
```

### LlamaIndex Node
```python
node.text                    # Content
node.metadata                # Payload dict
node.score                   # Cosine similarity
node.node_id                 # UUID for feedback
```

## ⚙️ Critical Configuration

```bash
# Embedding
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2
EMBEDDING_DIMENSION=1024

# Qdrant
QDRANT_URL=http://qdrant:6333

# Redis (cache + pub/sub)
REDIS_URL=redis://redis:6379/0

# Mem0 (long-term memory)
MEM0_URL=http://mem0:8000

# LLM
OPENAI_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=openai/gpt-4o-mini
OPENAI_API_KEY=...

# Docling VLM
DOCLING_VLM_ENABLED=true
DOCLING_VLM_MIN_SIZE=300        # Skip images < 300px
DOCLING_VLM_MAX_IMAGES=10       # Max images per doc
DOCLING_CHUNK_MAX_TOKENS=512    # Embedding budget

# RAG
RAG_SCORE_THRESHOLD=0.35        # Min similarity filter
```

## 📈 Queue & Task Names

| Queue | Task Name | Purpose |
|---|---|---|
| `media_process` | `src.worker.tasks.process_document` | Upload → Docling → Embed |
| `chat_priority` | `src.worker.tasks.rag_document_search` | RAG search |
| `chat_priority` | `src.worker.tasks.process_chat_response` | Chat message → Qdrant |
| `chat_priority` | `src.worker.tasks.store_memory` | Mem0 memory storage |
| `chat_priority` | `src.worker.tasks.process_feedback` | Negative feedback → quality=low |
| `chat_priority` | `src.worker.tasks.summarize_session_history` | Session summary (every 10 msgs) |

## 🔍 Collections in Qdrant

| Name | Size | Distance | Indexed Fields |
|---|---|---|---|
| `chat_chunks` | 1024 | COSINE | user_id, session_id, department |
| `port_knowledge` | 1024 | COSINE | user_id, department, quality, document_id, source_file |
| `vanna_schemas_openai` | 1024 | COSINE | (none) |

## 💾 Redis Keys

```
chat:session:{session_id}           # Session message cache (1 hour)
session:{session_id}                # Pub/Sub channel for SSE events
```

## 🔄 Mode Dispatch Flow

```
User selects mode (chat/sql/rag) in UI
    ↓
MessageCreate.mode = selected_mode
    ↓
ChatService.add_message() reads mode
    ↓
if mode == "rag":
    rag_document_search.delay(...)
elif mode == "sql":
    run_sql_query.delay(...)
else:  # default "chat"
    process_chat_response.delay(...)
```

## 🎯 Critical Functions & Line Numbers

| Function | File | Lines | Purpose |
|---|---|---|---|
| `process_document` | media_tasks.py | 26 | Celery entry point |
| `_do_full_processing` | media_tasks.py | 152 | Embed + upsert |
| `DoclingProcessor.process` | docling_service.py | 607 | Full Docling pipeline |
| `_build_docling_chunks` | docling_service.py | 336 | HybridChunker + AdaptiveTableSerializer |
| `_should_call_vlm` | docling_service.py | 243 | VLM smart filter |
| `rag_document_search` | chat_tasks.py | 623 | RAG Celery task |
| `_gather_unified_context` | chat_tasks.py | 344 | Mem0 + DB context |
| `_synthesize_with_llm` | chat_tasks.py | 428 | LLM synthesis |
| `_build_context_and_citations` | chat_tasks.py | 283 | Citation building |
| `_build_qdrant_filter` | chat_tasks.py | 171 | Access control |
| `add_message` | chat_service.py | 64 | Mode dispatch |
| `ChatComposer` | chat-composer.tsx | 38 | Mode selector UI |
| `_smart_chunk` | helpers.py | 157 | Table-aware chunking |
| `publish_task_complete` | helpers.py | 118 | Redis event publish |
| `upsert_vectors` | qdrant_setup.py | 71 | Qdrant insert |
| `ensure_collections` | qdrant_setup.py | 47 | Collection setup |

## 🛠️ Debugging Checklist

1. **Document not appearing in RAG?**
   - Check document status in PostgreSQL: `SELECT status FROM documents WHERE id='...'`
   - Verify chunks in Qdrant: `qdrant> scroll port_knowledge` (check user_id match)
   - Check embedding dim: `EMBEDDING_DIMENSION` must equal 1024

2. **RAG returning no results?**
   - Check `RAG_SCORE_THRESHOLD` (default 0.35) — may be too high
   - Verify access control filter: user_id or department match
   - Check quality="low" markings: `SELECT count(*) FROM port_knowledge WHERE quality='low'`

3. **Chunk quality issues?**
   - Adjust `DOCLING_CHUNK_MAX_TOKENS` (default 512)
   - Check row_keys extraction in Docling chunks
   - Review table serialization (markdown vs triplet format)

4. **Image processing slow?**
   - Reduce `DOCLING_VLM_MAX_IMAGES` (default 10)
   - Increase `DOCLING_VLM_MIN_SIZE` (default 300px)
   - Check OpenAI API quotas/throttling

5. **Real-time delivery slow?**
   - Check Redis Pub/Sub (is it publishing?)
   - SSE heartbeat timeout: 20s (configurable in chat.py:208)
   - Verify Celery workers are processing tasks

## 📝 Example Payloads

### Create Message Request
```json
{
  "role": "user",
  "content": "Giá container 40 foot?",
  "metadata": {},
  "mode": "rag"
}
```

### Upsert Vectors
```json
{
  "collection": "port_knowledge",
  "payloads": [{
    "text": "Container 40 foot: ...",
    "source_file": "pricing.pdf",
    "page_number": 5,
    "chunk_index": 12,
    "user_id": "user-123",
    "document_id": "doc-uuid",
    "type": "document_chunk",
    "extractor": "docling",
    "headings": ["Biểu phí"],
    "row_keys": ["container_40ft"]
  }],
  "vectors": [[0.123, 0.456, ...]],
  "ids": ["chunk-uuid"]
}
```

### Citation JSON
```json
{
  "index": 1,
  "file": "pricing.pdf",
  "page": 5,
  "headings": ["Biểu phí", "Container"],
  "score": 0.892
}
```

