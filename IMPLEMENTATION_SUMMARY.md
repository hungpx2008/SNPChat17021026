# ChatSNP Implementation Summary
**Comprehensive Analysis Report**  
**Date:** April 13, 2026

---

## 📌 EXECUTIVE SUMMARY

ChatSNP is a Vietnamese language RAG (Retrieval-Augmented Generation) system for port operations intelligence. It uses **Docling** for deep document processing, **Qdrant** for vector similarity search, **LlamaIndex** for retrieval orchestration, and **OpenAI/OpenRouter LLM** for answer synthesis.

**Key Architecture:**
- **Document Ingestion:** Docling (tables + OCR) → HybridChunker → Mem0 embeddings → Qdrant
- **RAG Pipeline:** LlamaIndex retriever + LLM synthesis + Mem0 long-term memory
- **Real-time:** Redis Pub/Sub + Server-Sent Events (SSE)
- **User Control:** Three explicit modes (Chat/SQL/RAG)

---

## 🗂️ CRITICAL FILES & LINE NUMBERS

### DOCUMENT INGESTION PIPELINE

| File | Lines | Component | Purpose |
|------|-------|-----------|---------|
| `backend/src/worker/media_tasks.py` | 26-138 | `process_document()` task | Celery entry point for document upload |
| `backend/src/worker/media_tasks.py` | 152-272 | `_do_full_processing()` | Embed + upsert orchestration |
| `backend/src/services/docling_service.py` | 607-805 | `DoclingProcessor.process()` | Core Docling pipeline |
| `backend/src/services/docling_service.py` | 336-578 | `_build_docling_chunks()` | HybridChunker + AdaptiveTableSerializer |
| `backend/src/services/docling_service.py` | 374-469 | `AdaptiveTableSerializer.serialize()` | Table triplet format generation |
| `backend/src/services/docling_service.py` | 181-228 | `_apply_group_lock()` | Row-key based chunk merging |
| `backend/src/services/docling_service.py` | 243-281 | `_should_call_vlm()` | Smart filter for image processing |
| `backend/src/services/docling_service.py` | 643-742 | VLM Integration | OpenAI Vision API calls |

### RAG SEARCH PIPELINE

| File | Lines | Component | Purpose |
|------|-------|-----------|---------|
| `backend/src/worker/chat_tasks.py` | 623-751 | `rag_document_search()` task | Main RAG orchestration |
| `backend/src/worker/chat_tasks.py` | 636-660 | Retrieval setup | LlamaIndex + QdrantVectorStore |
| `backend/src/worker/chat_tasks.py` | 171-206 | `_build_qdrant_filter()` | Access control + quality gating |
| `backend/src/worker/chat_tasks.py` | 283-341 | `_build_context_and_citations()` | Citation deduplication |
| `backend/src/worker/chat_tasks.py` | 344-408 | `_gather_unified_context()` | Mem0 + DB context assembly |
| `backend/src/worker/chat_tasks.py` | 428-486 | `_synthesize_with_llm()` | LLM synthesis with OpenAI |

### MODE SELECTION & DISPATCH

| File | Lines | Component | Purpose |
|------|-------|-----------|---------|
| `frontend/src/components/chat/chat-composer.tsx` | 13-96 | Chat UI | Mode selector (Trợ lý/Số liệu/Tài liệu) |
| `backend/src/services/chat_service.py` | 64-139 | `add_message()` | Mode-based task dispatch |
| `backend/src/api/chat.py` | 78-98 | `add_message()` endpoint | Mode signal to frontend |

### INFRASTRUCTURE

| File | Lines | Component | Purpose |
|------|-------|-----------|---------|
| `backend/src/core/qdrant_setup.py` | 13-31 | `get_qdrant_client()` | Qdrant singleton |
| `backend/src/core/qdrant_setup.py` | 47-68 | `ensure_collections()` | Collection + index setup |
| `backend/src/core/qdrant_setup.py` | 71-85 | `upsert_vectors()` | Batch insert to Qdrant |
| `backend/src/core/redis_client.py` | 10-15 | `get_redis()` | Redis async client |
| `backend/src/worker/helpers.py` | 118-133 | `publish_task_complete()` | Redis Pub/Sub event |
| `backend/src/api/chat.py` | 138-214 | `stream_session()` + `_sse_event_generator()` | SSE real-time stream |

---

## 🔄 DATAFLOW DIAGRAMS

### 1. DOCUMENT UPLOAD & INGESTION

```
┌─────────────────────────────────────────────────────────────────┐
│                     DOCUMENT UPLOAD                              │
└─────────────────────────────────────────────────────────────────┘

USER UPLOADS FILE
       ↓
   POST /api/upload
   multipart/form-data
       ↓
   Create documents row (status='processing')
       ↓
   Celery: process_document.delay()
   Queue: media_process
       ↓
   ┌─────────────────────────────────────┐
   │  BRANCH: Image (.jpg/.png)          │
   ├─────────────────────────────────────┤
   │  _extract_text_from_image()         │
   │  ↓                                  │
   │  OpenAI Vision API                  │
   │  ↓                                  │
   │  extracted_text (VLM description)   │
   └─────────────────────────────────────┘
              OR
   ┌─────────────────────────────────────┐
   │  BRANCH: Document (.pdf/.docx)      │
   ├─────────────────────────────────────┤
   │  process_document_deep()            │
   │  ↓                                  │
   │  DoclingProcessor.process()         │
   │  ├─ DocumentConverter.convert()     │
   │  ├─ Extract tables                  │
   │  ├─ _build_docling_chunks()         │
   │  │  ├─ HybridChunker                │
   │  │  ├─ AdaptiveTableSerializer      │
   │  │  └─ _apply_group_lock()          │
   │  ├─ Smart VLM filtering             │
   │  └─ Return ProcessingResult         │
   │  ↓                                  │
   │  extracted_text + chunks            │
   └─────────────────────────────────────┘
              ↓
   ┌─────────────────────────────────────┐
   │  _do_full_processing()              │
   ├─────────────────────────────────────┤
   │  1. Prepare chunks                  │
   │     Docling chunks OR _smart_chunk()│
   │                                     │
   │  2. Embed chunks (parallel)         │
   │     ThreadPoolExecutor (8 workers)  │
   │     POST {MEM0_URL}/embed           │
   │     ↓ 1024-dim vectors              │
   │                                     │
   │  3. Build payloads                  │
   │     text, source_file, page_number  │
   │     user_id, document_id, headings  │
   │     row_keys, extractor, type       │
   │                                     │
   │  4. Upsert to Qdrant                │
   │     Collection: port_knowledge      │
   │     Points: Batch(ids, vectors,     │
   │             payloads)               │
   │                                     │
   │  5. Update document status          │
   │     PostgreSQL: status='ready'      │
   │     chunk_count, metadata, etc.     │
   └─────────────────────────────────────┘
```

### 2. RAG SEARCH & ANSWER GENERATION

```
┌─────────────────────────────────────────────────────────────────┐
│                  RAG SEARCH REQUEST                              │
└─────────────────────────────────────────────────────────────────┘

USER TYPES QUESTION + MODE=RAG
       ↓
   POST /sessions/{id}/messages
   {"content": "Giá container?", "mode": "rag"}
       ↓
   ChatService.add_message()
   ├─ Create ChatMessage row
   ├─ Update Redis cache
   └─ Detect mode="rag"
       ↓
   Celery: rag_document_search.delay()
   Queue: chat_priority
       ↓
   ┌─────────────────────────────────────┐
   │  STEP A: Setup & Retrieve           │
   ├─────────────────────────────────────┤
   │  1. Load HuggingFace embedding      │
   │     (cached per worker)             │
   │  2. Create QdrantVectorStore        │
   │  3. Create LlamaIndex retriever     │
   │     similarity_top_k=5              │
   │  4. Apply filter:                   │
   │     _build_qdrant_filter()          │
   │     - user_id matches OR            │
   │     - department-public chunks      │
   │     - quality != "low"              │
   │  5. retriever.retrieve(question)    │
   │     - Embed question (HF model)     │
   │     - Search Qdrant (cosine)        │
   │     - Filter by score >= 0.35       │
   │     ↓ top_nodes[1..5]               │
   └─────────────────────────────────────┘
              ↓
   ┌─────────────────────────────────────┐
   │  STEP B: Build Context              │
   ├─────────────────────────────────────┤
   │  1. _build_context_and_citations()  │
   │     - Deduplicate by file+page      │
   │     - Hash content (drop duplicates)│
   │     - Format [1] [2] ... [N]        │
   │                                     │
   │  2. _gather_unified_context()       │
   │     a. Mem0 long-term memories      │
   │        POST /search (user_id)       │
   │        ↓ 5 results                  │
   │     b. Session summary              │
   │        SQL: s.metadata.summary      │
   │     c. Recent 6 messages            │
   │        SQL: ORDER BY created DESC   │
   │                                     │
   │  Result:                            │
   │  {long_term_block,                  │
   │   summary_block,                    │
   │   recent_block}                     │
   └─────────────────────────────────────┘
              ↓
   ┌─────────────────────────────────────┐
   │  STEP C: LLM Synthesis              │
   ├─────────────────────────────────────┤
   │  Build unified context:             │
   │  "### Long-term Memory"             │
   │  "### Tóm tắt hội thoại"            │
   │  "### Hội thoại gần đây"            │
   │  "### Đoạn trích tài liệu"          │
   │  [1] [snippet 1]                    │
   │  [2] [snippet 2]                    │
   │  ...                                │
   │                                     │
   │  OpenAI call:                       │
   │  POST {OPENAI_BASE_URL}/chat/comp.  │
   │  - model: LLM_MODEL                 │
   │  - system: RAG_SYSTEM_PROMPT        │
   │  - user: prompt + context           │
   │  - temp: 0.3                        │
   │  - max_tokens: 1500                 │
   │  ↓ response.content                 │
   │                                     │
   │  Post-process:                      │
   │  - _sanitize_generated_answer()     │
   │  - _format_citations_footer()       │
   │  ↓ final_answer                     │
   └─────────────────────────────────────┘
              ↓
   ┌─────────────────────────────────────┐
   │  STEP D: Persist & Publish          │
   ├─────────────────────────────────────┤
   │  1. Save answer to PostgreSQL       │
   │     POST /sessions/{id}/messages    │
   │     {"role": "assistant",           │
   │      "content": result_text}        │
   │                                     │
   │  2. Store rag_chunk_ids in metadata │
   │     PATCH /messages/{id}/metadata   │
   │     {"rag_chunk_ids": [...]}        │
   │                                     │
   │  3. Publish Redis event             │
   │     publish_task_complete()         │
   │     redis.publish(                  │
   │       f"session:{session_id}",      │
   │       {"event": "message_ready"}    │
   │     )                               │
   └─────────────────────────────────────┘
              ↓
   ┌─────────────────────────────────────┐
   │  FRONTEND: Display Answer           │
   ├─────────────────────────────────────┤
   │  SSE listener receives event        │
   │  ↓                                  │
   │  GET /sessions/{id}                 │
   │  ↓                                  │
   │  Display answer + citations         │
   │  ↓                                  │
   │  User can like/dislike              │
   └─────────────────────────────────────┘
```

---

## 📊 DATA STRUCTURES

### ChunkData (Docling Output)
```python
@dataclass
class ChunkData:
    text: str                               # Full chunk text with context prefix
    page_number: int                        # Document page number (0 if unknown)
    headings: list[str]                     # [Section > Subsection > ...]
    metadata: dict[str, Any]                # {
                                            #   row_keys: [key1, key2],
                                            #   has_cell_provenance: bool,
                                            #   doc_items: [...],
                                            #   page_no: int,
                                            #   ...
                                            # }
```

### Qdrant Payload (port_knowledge)
```python
payload = {
    # Core content
    "text": str,                            # Chunk text (required)
    "type": "document_chunk",               # Type classification
    "extractor": "docling" | "vlm",         # Source extractor

    # Source tracking
    "source_file": str,                     # Original filename
    "document_id": str,                     # DB document UUID
    "page_number": int,                     # Page number
    "chunk_index": int,                     # Position within document

    # Access control
    "user_id": str,                         # Document owner
    "department": str,                      # Department (optional)
    "is_public": bool,                      # Public sharing flag (optional)

    # Content metadata
    "headings": list[str],                  # Heading hierarchy
    "row_keys": list[str],                  # Table row identifiers (optional)

    # Quality tracking
    "quality": "low" | None,                # Set by negative feedback
    "dislike_reason": str,                  # Reason for low quality (optional)
}
```

### LlamaIndex Node
```python
node.text                                   # Chunk content
node.metadata                               # Dict (from payload)
node.node_id                                # UUID (for feedback)
node.score                                  # Cosine similarity [0, 1]
```

### Citation
```python
citation = {
    "index": 1,                             # Citation number [1], [2], ...
    "file": "pricing.pdf",                  # Source filename
    "page": 5,                              # Page number
    "headings": ["Biểu phí", "Container"],  # Heading path
    "score": 0.892,                         # Similarity score
}
```

---

## ⚙️ ENVIRONMENT CONFIGURATION

### Embedding & Vector Store
```bash
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2
EMBEDDING_DEVICE=cpu
EMBEDDING_DIMENSION=1024                    # 1024-dim vectors

QDRANT_URL=http://qdrant:6333               # HTTP endpoint
QDRANT_GRPC_URL=http://qdrant:6334          # gRPC endpoint (optional)
```

### Caching & Real-time
```bash
REDIS_URL=redis://redis:6379/0              # Session cache + Pub/Sub
```

### LLM & Synthesis
```bash
OPENAI_API_KEY=...                          # OpenAI/OpenRouter key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=openai/gpt-4o-mini                # Model identifier
RAG_SCORE_THRESHOLD=0.35                    # Min similarity filter
```

### Docling Document Processing
```bash
DOCLING_VLM_ENABLED=true                    # Enable Vision API
DOCLING_VLM_MIN_SIZE=300                    # Skip images < 300px
DOCLING_VLM_MAX_IMAGES=10                   # Max images per document
DOCLING_VLM_PROMPT="Mô tả chi tiết..."      # Custom VLM prompt
DOCLING_CHUNK_MAX_TOKENS=512                # Embedding budget
DOCLING_CHUNK_MERGE_PEERS=true              # HybridChunker merge
DOCLING_GROUP_LOCK_ENABLED=true             # Row-key merging
DOCLING_GROUP_LOCK_MAX_CHARS=1800           # Max merged chunk size
DOCLING_TABLE_MARKDOWN_MAX_COLS=4           # Small table threshold
DOCLING_TABLE_MARKDOWN_MAX_CELLS=36         # Small table threshold
DOCLING_TABLE_GROUP_KEY_HINTS=type,category # Column name hints
DOCLING_TABLE_NORMALIZE_VALUES=true         # Normalize currency/units
DOCLING_PREFIX_HEADING_ROWKEY=true          # Add prefix to chunks
```

### Memory Service
```bash
MEM0_URL=http://mem0:8000                   # Long-term memory API
```

---

## 🔀 MODE DISPATCH LOGIC

### Frontend: Mode Selection
```typescript
const MODE_OPTIONS = [
  { value: "chat", label: "Trợ lý", description: "Hỏi đáp tổng quát" },
  { value: "sql", label: "Số liệu", description: "Truy vấn dữ liệu Cảng" },
  { value: "rag", label: "Tài liệu", description: "Hỏi nội dung PDF/file" },
];
```

### Backend: Task Dispatch
```python
mode = getattr(message, 'mode', 'chat')  # Default: 'chat'

if mode == "sql":
    run_sql_query.delay(
        question=message.content,
        session_id=str(session_id),
        user_id=user_id,
    )
elif mode == "rag":
    rag_document_search.delay(
        question=message.content,
        session_id=str(session_id),
        user_id=user_id,
        department=department,
    )
else:  # mode == "chat"
    process_chat_response.delay(
        session_id=str(session_id),
        message_id=str(db_message.id),
        content=message.content,
        role=message.role,
        user_id=user_id,
        department=department,
    )
```

---

## 🎯 COLLECTIONS IN QDRANT

| Name | Vector Dim | Distance | Indexed Fields | Purpose |
|------|---|---|---|---|
| `chat_chunks` | 1024 | COSINE | user_id, session_id, department | Short-term chat embeddings |
| `port_knowledge` | 1024 | COSINE | user_id, department, quality, document_id, source_file | RAG document chunks |
| `vanna_schemas_openai` | 1024 | COSINE | (none) | SQL schema embeddings |

---

## 🔑 KEY DESIGN PATTERNS

1. **Hybrid Chunking + Adaptive Table Serialization**
   - Preserves table structure with row_key provenance
   - Small tables: markdown; Large tables: triplet cell format
   - Group lock merges chunks on shared row_keys

2. **Unified Context Assembly**
   - Combines: Long-term memories (Mem0) + Session summary + Recent messages
   - Single-pass LLM synthesis with multi-source context

3. **Smart VLM Filtering**
   - Skips images < 300px (logos, decorations)
   - Skips images with existing OCR captions
   - Max 10 images per document (cost control)

4. **Citation Accuracy via Stored Chunk IDs**
   - Stores exact rag_chunk_ids at generation time
   - Negative feedback marks precise chunks as quality="low"
   - Fallback: similarity-based chunk finding

5. **Real-time Answer Delivery**
   - Redis Pub/Sub channels per session
   - Server-Sent Events (SSE) with 20s heartbeat
   - Client reconnects after message delivery

---

## 📍 COMPLETE FILE PATHS

**Configuration:**
- `/backend/src/core/config.py` — Settings class
- `/backend/src/core/redis_client.py` — Redis singleton
- `/backend/src/core/qdrant_setup.py` — Qdrant client & collections

**Document Ingestion:**
- `/backend/src/services/docling_service.py` — Docling processor
- `/backend/src/worker/media_tasks.py` — Celery tasks (upload)
- `/backend/src/worker/helpers.py` — Helper functions

**RAG & Chat:**
- `/backend/src/worker/chat_tasks.py` — Celery tasks (RAG, feedback)
- `/backend/src/services/chat_service.py` — Chat business logic
- `/backend/src/api/chat.py` — REST endpoints + SSE

**Frontend:**
- `/frontend/src/components/chat/chat-composer.tsx` — Mode selector UI

---

## 🚀 QUICK START DEBUGGING

**Document not in RAG?**
```sql
SELECT id, status FROM documents WHERE id='doc-uuid';
-- Verify status='ready' and chunk_count > 0
```

**No RAG results?**
```bash
# Check Qdrant collection
curl http://qdrant:6333/collections/port_knowledge

# Check score threshold
env | grep RAG_SCORE_THRESHOLD
# Adjust down if too restrictive (default: 0.35)
```

**Slow answer delivery?**
```bash
# Check Redis Pub/Sub
redis-cli
> PUBSUB CHANNELS
> PUBSUB NUMSUB session:*

# Check Celery workers
celery -A src.worker.celery_app inspect active
```

---

**Report Generated:** April 13, 2026  
**For:** ChatSNP Development Team  
**Files:** IMPLEMENTATION_REPORT.md (detailed), QUICK_REFERENCE.md (tables)
