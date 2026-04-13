# ChatSNP Quick Reference Guide

## 🎯 Core Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER → FRONTEND                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ↓
        ┌─────────────────────────────┐
        │   FastAPI Backend            │
        │  /sessions/{id}/messages     │
        └──────────┬──────────────────┘
                   │
        ┌──────────┴──────────────────────────┐
        │                                      │
        ↓                                      ↓
   ┌──────────────┐               ┌──────────────────┐
   │ Redis Cache  │               │ PostgreSQL DB    │
   │ (1hr TTL)    │               │ (Chat history)   │
   └──────────────┘               └──────────────────┘
        │                               │
        └───────────────┬───────────────┘
                        │
        ┌───────────────┴─────────────────────────────┐
        │         Celery Task Router                   │
        └───────┬───────────┬──────────┬──────────────┘
                │           │          │
     ┌──────────↓─┐  ┌──────↓──┐  ┌───↓───────┐
     │ chat_      │  │ data_   │  │  media_   │
     │ priority   │  │ batch   │  │  process  │
     └────┬───────┘  └────┬────┘  └────┬──────┘
          │               │            │
     ┌────┴──────────────┐│           │
     │                   ││           │
  ┌──↓───────────┬──────↓─┴─┐  ┌────↓──────┐
  │ process_chat │  rag_doc │  │process_   │
  │ _response    │ _search  │  │document   │
  │ store_memory │ run_sql  │  │transcribe │
  │ summarize    │ feedback │  │generate_  │
  └──┬────┬──────┴──────┬───┘  │chart      │
     │    │             │      └───┬───────┘
     ↓    ↓             ↓          │
   ┌──────────┐  ┌──────────┐  ┌──┴──────────┐
   │  Qdrant  │  │   Mem0   │  │  Docling   │
   │  (Short- │  │  (Long-  │  │  Whisper   │
   │  term)   │  │  term)   │  │  Lida TTS  │
   └──────────┘  └──────────┘  └───────────┘
```

---

## 📋 Message Processing Flow

```
User sends message
        │
        ↓
POST /sessions/{id}/messages
        │
        ├─ ChatService.add_message()
        │   ├─ Create DB record
        │   ├─ Update Redis cache (+1h TTL)
        │   └─ Return message with intent_type
        │
        ├─ Dispatch Celery task (mode-based)
        │   ├─ "chat"  → process_chat_response ──────────┐
        │   ├─ "rag"   → rag_document_search ────────────┐
        │   └─ "sql"   → run_sql_query ─────────────────┐│
        │                                                 ││
        ├─ Trigger: memory storage (if >10 chars)        ││
        │   └─ store_memory ────────────────────────────┐││
        │                                                 │││
        ├─ Trigger: summarization (every 10 msgs)       ││││
        │   └─ summarize_session_history ────────────┐  ││││
        │                                              │  ││││
        └─ Frontend polling/SSE for updates          │  ││││
                                                      │  ││││
Frontend listens to SSE: GET /sessions/{id}/stream   │  ││││
        │                                              │  ││││
        ├─ Subscribe to: session:{id} Redis channel  │  ││││
        │                                              │  ││││
        └─ Wait for: publish_task_complete() signal  │  ││││
                     (from any task below)            │  ││││
                                                      │  ││││
                                                      ↓  ↓↓↓↓
                                        [Celery tasks run in parallel]
                                        [Each publishes signal on complete]
```

---

## 🧠 Dual Memory Model

### Triggering Conditions

```
┌─────────────────────────────────────┐
│  When Message Added                 │
├─────────────────────────────────────┤
│                                     │
│  Content length > 10 chars?         │
│  └─ YES → store_memory.delay()      │
│     └─ Async POST to Mem0 API       │
│        └─ Stores with metadata      │
│           (session_id, department)  │
│                                     │
│  Message count % 10 == 0?           │
│  └─ YES → summarize_session         │
│           _history.delay()          │
│     └─ Calls LLM to create          │
│        500-char summary             │
│     └─ Saves to session.metadata    │
│                                     │
└─────────────────────────────────────┘
```

### Retrieval

```
Semantic Search Request
        │
        ├─ Embed query via Mem0
        │
        ├─ Get short-term (Qdrant)
        │  ├─ search_vectors(
        │  │   collection="chat_chunks",
        │  │   filters={user_id, department}
        │  │ )
        │  └─ Returns: [msg_chunks]
        │
        ├─ Get long-term (Mem0)
        │  └─ POST {MEM0_URL}/search
        │     ├─ query
        │     ├─ user_id
        │     └─ limit=5
        │
        └─ Merge & score
           ├─ Convert formats
           ├─ Filter: score >= 0.35
           ├─ Sort by score DESC
           └─ Return top-k
```

---

## 🔄 Chat to Qdrant Pipeline

```
Message: "Giá container 20 feet bao nhiêu?"
        │
        ├─ process_chat_response()
        │  │
        │  ├─ 1. Smart chunk (512 chars, 50 overlap)
        │  │   └─ [chunk1, chunk2, ...]
        │  │
        │  ├─ 2. Embed chunks (Parallel, max 8)
        │  │   └─ ThreadPoolExecutor
        │  │      └─ For each chunk:
        │  │         POST {MEM0_URL}/embed
        │  │         └─ {"vector": [1024 dims]}
        │  │
        │  └─ 3. Upsert to Qdrant
        │     └─ collection="chat_chunks"
        │        point_struct = {
        │          id: UUID,
        │          vector: [1024 floats],
        │          payload: {
        │            "content": chunk_text,
        │            "session_id": uuid,
        │            "message_id": uuid,
        │            "user_id": str,
        │            "role": "user",
        │            "department": str,
        │            "chunk_index": int
        │          }
        │        }
        │
        └─ Complete ✓ (stored in short-term memory)
```

---

## 🔍 RAG Pipeline (Document Search)

```
User: "Quy định về container hàng khô là gì?"
        │
        ├─ rag_document_search()
        │
        ├─ 1. Setup LLM Embed (cached singleton)
        │   └─ HuggingFaceEmbedding(
        │       "thanhtantran/Vietnamese_Embedding_v2"
        │     )
        │
        ├─ 2. Retrieve from Qdrant
        │   │  collection="port_knowledge"
        │   │  similarity_top_k=5
        │   │  filter = _build_qdrant_filter(user_id, dept)
        │   │
        │   └─ Access control logic:
        │      IF (user_id = USER OR (is_public AND dept = USER_DEPT))
        │         AND quality != "low"
        │      THEN include chunk
        │
        ├─ 3. Filter by score threshold
        │   └─ top_nodes = [n for n in all_nodes
        │                    if n.score >= 0.35]
        │
        ├─ 4. Build unified context
        │   │
        │   ├─ Long-term: GET {MEM0_URL}/search
        │   │  └─ Collect relevant user memories
        │   │
        │   ├─ Session summary: DB query
        │   │  └─ Read session.metadata.summary
        │   │
        │   ├─ Recent messages: DB query (last 6)
        │   │  └─ ORDER BY created_at DESC
        │   │
        │   └─ Combine in order:
        │      "### Long-term Memory\n..."
        │      "### Tóm tắt hội thoại\n..."
        │      "### Hội thoại gần đây\n..."
        │      "### Đoạn trích tài liệu\n[1]...[2]..."
        │
        ├─ 5. Extract citations
        │   │
        │   ├─ For each chunk:
        │   │   ├─ Extract metadata (file, page, headings)
        │   │   └─ Extract text content
        │   │
        │   ├─ Dedup by:
        │   │   ├─ cite_key = (file, page, headings)
        │   │   └─ content_hash (first 200 chars)
        │   │
        │   └─ Result: [{index, file, page, score}, ...]
        │
        ├─ 6. LLM synthesis
        │   │
        │   ├─ System prompt:
        │   │  └─ "Bạn là chuyên viên tư vấn ChatSNP..."
        │   │     [formatting rules, citation rules]
        │   │
        │   ├─ User prompt:
        │   │  └─ "Câu hỏi: {question}\nContext:\n..."
        │   │
        │   ├─ Call OpenRouter:
        │   │  └─ model="openai/gpt-4o-mini"
        │   │     temperature=0.3, max_tokens=1500
        │   │
        │   └─ Get response_text
        │
        ├─ 7. Sanitize answer
        │   ├─ Remove model citation footer
        │   ├─ Fix malformed citations
        │   ├─ Remove dangling words
        │   └─ result_text
        │
        ├─ 8. Append citations footer
        │   └─ result_text += "---\n📚 **Nguồn...**\n..."
        │
        ├─ 9. Store chunk IDs in message metadata
        │   └─ For feedback tracking
        │
        ├─ 10. Save response to DB
        │   └─ POST /sessions/{id}/messages
        │      └─ {"content": result_text, "role": "assistant"}
        │
        └─ 11. Publish SSE event
            └─ publish_task_complete(session_id)
               └─ Redis publish
                  └─ Frontend receives "message_ready"
```

---

## 📊 System Prompts Summary

| Prompt | Context | Used In | Key Features |
|--------|---------|---------|--------------|
| **RAG System** | Port authority consultant | rag_document_search | Tables → Markdown, citations, currency preservation, honest uncertainty |
| **Summary** | Conversation expert | summarize_session_history | 500 chars max, temp=0.1 (consistent) |
| **Gardener** | Memory manager | consolidate_memories | Importance scoring (1-10), dedup detection, JSON output |
| **SQL Agent** | Database expert | run_sql_query | Safety rules (SELECT only), schema inspection tools |
| **Table Enrichment** | Data processor | _llm_enrich_table | List→sentences, Summary→trends, temp=0.0 (accurate) |
| **Image Analysis** | Vision expert | _extract_text_from_image | Extract all text, diagrams, don't miss info |

---

## 🎛️ Configuration & Environment

### Key Environment Variables

```bash
# Mem0 Integration
MEM0_URL=http://mem0:8000
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2
EMBEDDING_DIMENSION=1024

# Qdrant Vector Store
QDRANT_URL=http://qdrant:6333
QDRANT_GRPC_URL=qdrant:6334  # optional

# LLM Provider
OPENAI_API_KEY=...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=openai/gpt-4o-mini  # fallback from gpt-5-nano

# Database
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://redis:6379/0

# RAG Threshold
RAG_SCORE_THRESHOLD=0.35

# Chat Settings
CHAT_MAX_SESSIONS=100
CHAT_CACHE_WINDOW=20
CHAT_CHUNK_SIZE=512
```

---

## 🔧 Key Helper Functions

### Smart Chunking (`_smart_chunk`)

```python
# Separators (priority order):
["\n\n\n", "\n\n", "\n", ". ", ", ", " ", ""]

# Process:
1. Enrich tables with LLM (semantic text)
2. Recursive split on separators
3. Map back to original positions
4. Estimate page numbers
5. Return [(chunk_text, page_num), ...]
```

### Text Cleaning (`_clean_snippet_text`)

```python
# Steps:
1. Strip HTML tags
2. Normalize line endings (\r\n → \n)
3. Collapse tabs → spaces
4. Collapse multiple spaces
5. Collapse blank lines (3+ → 2)
6. Remove whitespace-only lines
```

### Citation Deduplication (`_build_context_and_citations`)

```python
# Dedup strategy:
cite_key = (filename, page, headings)
content_hash = hash(snippet[:200])

# If same cite_key or content_hash → skip
# Otherwise → add to citations list
# Map all snippets to citation index
```

---

## 💬 Message Flow Triggers

```
┌─ Message added (all users)
├─ Create DB record ✓
├─ Update Redis cache ✓
│
├─ [ALWAYS] Dispatch task by mode:
│  ├─ mode="chat"  → process_chat_response
│  ├─ mode="rag"   → rag_document_search
│  └─ mode="sql"   → run_sql_query
│
├─ [IF user_id AND len(content) > 10] Store memory
│  └─ store_memory.delay()
│
└─ [IF message_count % 10 == 0] Summarize
   └─ summarize_session_history.delay()
```

---

## 🔐 Security Checklist

- [ ] RAG: Access control filter (user_id OR public+dept)
- [ ] RAG: Quality gate (exclude quality=low chunks)
- [ ] SQL: Forbid DROP, DELETE, ALTER, TRUNCATE, INSERT, UPDATE
- [ ] Error: Never expose SQL/tracebacks to user
- [ ] Error: Always return Vietnamese messages
- [ ] Memory: Timeout on Mem0 API calls (300s)
- [ ] Feedback: Track chunk IDs for accurate self-correction

---

## 🚀 Performance Wins

| Optimization | Technique | Benefit |
|--------------|-----------|---------|
| **Embedding** | Parallel ThreadPoolExecutor (8 workers) | 8x faster |
| **Model Loading** | Singleton per Celery worker | No reload per request |
| **Cache** | Redis append-only updates | No full DB reload |
| **Queries** | Single JOIN instead of 2 | 50% fewer DB hits |
| **Indexes** | Qdrant payload indexes | Fast filtered search |
| **Chunking** | Semantic separators (section→word) | Better context |
| **Table Enrichment** | LLM before chunking | More searchable |

---

## 🔄 Feedback Loop (Self-Correction)

```
User dislikes answer
        │
        ├─ process_feedback(message_id, is_liked=False)
        │
        ├─ Strategy A: Use stored chunk IDs (accurate)
        │  └─ message.metadata.rag_chunk_ids = [id1, id2, ...]
        │     └─ Set payload: quality="low"
        │
        └─ Strategy B: Fallback similarity search
           └─ Embed message content
              └─ Find similar chunks (score > 0.7)
                 └─ Mark as quality="low"

Next RAG search:
        └─ Filter excludes quality="low" chunks
           └─ User gets better answer next time
```

---

## 📈 Nightly Gardener (2:00 AM)

```
consolidate_memories():

FOR each user_id:
  1. GET {MEM0_URL}/memories?user_id={uid}
  2. Send to LLM with analysis prompt
  3. Parse JSON response:
     - scores: [{id, score (1-10)}]
     - merges: [{keep_id, remove_id, merged_text}]
  4. PUT importance_score to kept memories
  5. DELETE duplicate memories
  6. Log stats

Result:
  - Facts deduplicated
  - Importance scored
  - Ready for efficient retrieval
```

---

## 📍 Quick Navigation

| Want to understand... | Read this file | Function/Class |
|----------------------|----------------|---|
| Memory system | `src/core/mem0_config.py` | `embed_text()` |
| Chat processing | `src/worker/chat_tasks.py` | `process_chat_response()` |
| RAG pipeline | `src/worker/chat_tasks.py` | `rag_document_search()` |
| Context assembly | `src/worker/chat_tasks.py` | `_gather_unified_context()` |
| Chunking | `src/worker/helpers.py` | `_smart_chunk()` |
| Citations | `src/worker/chat_tasks.py` | `_build_context_and_citations()` |
| Feedback loop | `src/worker/chat_tasks.py` | `process_feedback()` |
| Memory consolidation | `src/worker/gardener_tasks.py` | `consolidate_memories()` |
| SQL queries | `src/worker/data_tasks.py` | `run_sql_query()` |
| Caching | `src/services/chat_service.py` | `add_message()`, `get_session...()` |

