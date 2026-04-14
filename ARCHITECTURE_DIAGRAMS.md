# ChatSNP Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/Vue)                    │
│  (Browser, SSE Stream Listener, POST /messages, GET /sessions)  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTP/WebSocket
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (Async)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /sessions/{session_id}/messages                    │   │
│  │ GET /sessions/{session_id}                              │   │
│  │ GET /sessions/{session_id}/stream (SSE)                 │   │
│  │ POST /messages/{message_id}/feedback                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│           ↓                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           ChatService (Async Dispatcher)                │   │
│  │  • add_message() → Dispatch to Celery                   │   │
│  │  • Triggers summarization every 10 messages             │   │
│  │  • Updates Redis cache (1h TTL)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│           ↓                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │    PostgreSQL (SQLAlchemy Async ORM)                    │   │
│  │  • chat_sessions (summary in metadata)                  │   │
│  │  • chat_messages (rag_chunk_ids in metadata)            │   │
│  │  • documents, message_feedbacks                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬──────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
         ┌─────────┐      ┌─────────┐    ┌──────────┐
         │ Celery  │      │ Redis   │    │ Qdrant   │
         │ Broker  │      │ Cache   │    │ Vector   │
         │(Redis)  │      │ & PubSub│    │ Store    │
         └────┬────┘      └────┬────┘    └──────────┘
              │                │
              ↓                ↓
    ┌──────────────────────────────────────┐
    │      CELERY WORKER POOL (3 Queues)   │
    │                                      │
    │  🔴 chat_priority (HIGH)             │
    │     • process_chat_response()        │
    │     • rag_document_search()          │
    │     • store_memory()                 │
    │     • process_feedback()             │
    │     • summarize_session_history()    │
    │                                      │
    │  🟡 data_batch (MEDIUM)              │
    │     • run_sql_query()                │
    │     • sync_data()                    │
    │                                      │
    │  🟢 media_process (LOW)              │
    │     • process_document()             │
    │     • transcribe_audio()             │
    │     • generate_chart()               │
    │     • text_to_speech()               │
    └──────────────────────────────────────┘
              │
    ┌─────────┼─────────┬──────────────┐
    ↓         ↓         ↓              ↓
  ┌────────────────┐ ┌──────────┐ ┌──────────┐
  │ Mem0 (Embedder │ │ Qdrant   │ │ OpenAI  │
  │  + Long-term)  │ │ Vector   │ │ LLM/    │
  │                │ │ Database │ │ Vision  │
  └────────────────┘ └──────────┘ └──────────┘
```

---

## RAG Document Search Flow (Detailed)

```
User Input: "What is the shipping rate for 20ft container?"
    │
    ↓
ChatService.add_message(mode="rag")
    │
    ├─ Save message to PostgreSQL
    ├─ Update Redis cache
    └─ Dispatch: rag_document_search.delay(question, session_id, user_id, department)
       │
       ↓ (Celery Worker)
       ┌────────────────────────────────────────────────────────┐
       │ RAG Document Search Task                                │
       ├────────────────────────────────────────────────────────┤
       │                                                         │
       │ 1. EMBEDDING (HuggingFace, cached per-worker)         │
       │    question_vector = embed("What is the shipping...")  │
       │                                                         │
       │ 2. RETRIEVAL (Qdrant)                                 │
       │    top_nodes = query(vector, collection="port_knowledge",  │
       │                      top_k=5,                          │
       │                      filter=user_id/department)        │
       │                                                         │
       │    FILTER: only chunks where score >= 0.35            │
       │    (avoid hallucination from irrelevant chunks)        │
       │                                                         │
       │ 3. CONTEXT GATHERING                                  │
       │    ┌─ Long-term memories (Mem0)                       │
       │    │  POST /search {query, user_id, limit=5}         │
       │    │  Example: "- Stored: Prefer Hapag-Lloyd"         │
       │    │                                                   │
       │    ├─ Session summary (PostgreSQL metadata)            │
       │    │  Example: "Asked about container rates"          │
       │    │                                                   │
       │    └─ Recent messages (last 6, oldest first)           │
       │       Example:                                         │
       │       USER: Previous question                          │
       │       ASSISTANT: Previous answer                       │
       │                                                         │
       │ 4. DEDUPLICATION + CITATION BUILD                     │
       │    For each retrieved chunk:                           │
       │    • Extract: file, page, headings, content            │
       │    • Dedup by: (file, page, heading)                   │
       │    • Skip: content_hash duplicates                     │
       │                                                         │
       │    Output:                                             │
       │    citations = [                                       │
       │      {                                                 │
       │        "index": 1,                                     │
       │        "file": "shipping_rates.pdf",                   │
       │        "page": 5,                                      │
       │        "headings": ["Container", "20ft"],              │
       │        "score": 0.847                                  │
       │      },                                                │
       │      ...                                               │
       │    ]                                                   │
       │                                                         │
       │    context_blocks = [                                  │
       │      "[1] 20ft standard container: 1,230,000 VNĐ",     │
       │      "[2] High cube 20ft: 1,350,000 VNĐ"              │
       │    ]                                                   │
       │                                                         │
       │ 5. LLM SYNTHESIS (OpenRouter)                         │
       │    ┌────────────────────────────────────────────┐     │
       │    │ System Prompt (Vietnamese):                │     │
       │    │  • Professional ChatSNP consultant          │     │
       │    │  • Format answers with citations [1], [2]  │     │
       │    │  • Use Markdown tables for tabular data     │     │
       │    │  • Never fabricate data                     │     │
       │    │ Temperature: 0.3 (low randomness)          │     │
       │    │ Max tokens: 1500                            │     │
       │    └────────────────────────────────────────────┘     │
       │    │
       │    ├─ Input:                                          │
       │    │  Question: "What is the shipping rate...?"        │
       │    │  Long-term: "- Stored: Prefer Hapag-Lloyd"       │
       │    │  Summary: "Asked about container rates"          │
       │    │  Recent: "USER: ...\nASSISTANT: ..."             │
       │    │  Documents:                                      │
       │    │    [1] 20ft standard: 1,230,000 VNĐ             │
       │    │    [2] High cube: 1,350,000 VNĐ                 │
       │    │                                                   │
       │    └─ Output:                                         │
       │       "Based on our document, the shipping rate for   │
       │        a standard 20ft container is 1,230,000 VNĐ,   │
       │        while a high-cube variant costs 1,350,000 VNĐ. │
       │        [1] [2]"                                       │
       │                                                         │
       │ 6. SAVE ANSWER TO DATABASE                            │
       │    POST /sessions/{session_id}/messages               │
       │    {                                                   │
       │      "role": "assistant",                             │
       │      "content": "(LLM synthesis + citation footer)",  │
       │      "metadata": {"rag_chunk_ids": [ID1, ID2, ...]}   │
       │    }                                                   │
       │                                                         │
       │ 7. PUBLISH REAL-TIME EVENT                            │
       │    redis.publish("session:{session_id}",              │
       │                 {"event": "message_ready"})            │
       │                                                         │
       └────────────────────────────────────────────────────────┘
           │
           ↓
Frontend (via SSE):
"message_ready" → Reload messages → Display answer with citations
```

---

## Session Summarization Flow (Every 10 Messages)

```
Message Count = 10
    │
    ↓
ChatService.add_message() checks: msg_count % 10 == 0?
    │
    ├─ YES → Dispatch: summarize_session_history.delay(session_id)
    │
    ↓ (Celery Worker - Background, non-blocking)
    ┌─────────────────────────────────────────────────┐
    │ Summarization Task                              │
    ├─────────────────────────────────────────────────┤
    │                                                  │
    │ 1. FETCH ALL MESSAGES                           │
    │    SELECT role, content FROM chat_messages      │
    │    WHERE session_id = ? ORDER BY created_at ASC │
    │                                                  │
    │    Messages:                                     │
    │    1. USER: "How to ship to Saigon?"            │
    │    2. ASST: "We serve HCMC with rates..."       │
    │    3. USER: "What about insurance?"             │
    │    4. ASST: "Insurance costs..."                │
    │    ... (up to 20+ messages)                      │
    │                                                  │
    │ 2. TRUNCATE FOR LLM                             │
    │    • Max 200 chars per message                  │
    │    • Cap total input at 6000 chars              │
    │                                                  │
    │    Input to LLM:                                │
    │    USER: How to ship to Saigon? ...             │
    │    ASST: We serve HCMC with rates: ... ...      │
    │    USER: What about insurance? ...              │
    │    ASST: Insurance costs... ...                 │
    │                                                  │
    │ 3. CALL LLM (OpenRouter gpt-4o-mini)           │
    │    System: "You are a conversation summarizer.  │
    │              Summarize in 500 Vietnamese chars. │
    │              Focus on: main topics, key facts." │
    │    Temperature: 0.1 (deterministic)             │
    │    Max tokens: 300                              │
    │                                                  │
    │ 4. STORE IN PostgreSQL                          │
    │    UPDATE chat_sessions                         │
    │    SET metadata = {                             │
    │      "summary": "Khách hỏi về...",              │
    │      "message_count_at_summary": 10             │
    │    }                                             │
    │    WHERE id = session_id                        │
    │                                                  │
    └─────────────────────────────────────────────────┘
            │
            ↓
FUTURE RAG searches use summary_block:
"### Tóm tắt hội thoại\nKhách hỏi về...\n"
(Improves context relevance)
```

---

## User Feedback Self-Correction Flow

```
User dislikes RAG answer
    │
    ↓
Frontend: POST /messages/{message_id}/feedback {is_liked: false, reason: "..."}
    │
    ↓
process_feedback Celery task
    │
    ├─ STRATEGY A: Use stored chunk IDs (PREFERRED)
    │
    │  1. Fetch message from DB:
    │     SELECT metadata FROM chat_messages WHERE id = message_id
    │
    │  2. Extract: metadata.rag_chunk_ids
    │     [chunk_id_1, chunk_id_2, chunk_id_3]
    │
    │  3. Mark in Qdrant:
    │     for chunk_id in chunk_ids:
    │       qdrant.set_payload(
    │         collection="port_knowledge",
    │         payload={"quality": "low", "dislike_reason": "..."},
    │         points=[chunk_id]
    │       )
    │
    │  ✅ RESULT: 3 vectors downgraded, stored chunk IDs used
    │
    └─ STRATEGY B: Fallback similarity (if no stored chunk IDs)
    
       1. Embed message text:
          query_vector = mem0.embed(message.content[:500])
       
       2. Similarity search in Qdrant:
          matches = qdrant.query_points(
            collection="port_knowledge",
            query=query_vector,
            limit=3,
            threshold=0.7  # Only high-confidence matches
          )
       
       3. Mark similar chunks:
          for match in matches:
            qdrant.set_payload(
              collection="port_knowledge",
              payload={"quality": "low", "dislike_reason": "..."},
              points=[match.id]
            )
       
       ✅ RESULT: Similar chunks downgraded, similarity-based
    
    ↓
Next RAG Search:
    • Qdrant filter includes: must_not quality="low"
    • These chunks excluded from retrieval
    • System learns not to use them for similar questions
```

---

## Embedding Model Caching (Per-Worker)

```
Worker Process 1 starts
    │
    ├─ _hf_embed_model = None
    │
    ├─ Task 1: process_chat_response()
    │  └─ Call _get_hf_embed_model()
    │     └─ Load HuggingFace (1.3 GB) ← EXPENSIVE
    │     └─ Cache in _hf_embed_model (module-level)
    │
    ├─ Task 2: process_chat_response()
    │  └─ Call _get_hf_embed_model()
    │     └─ Return cached _hf_embed_model ← FAST
    │
    └─ Task N: (any task)
       └─ Reuse cached model (no reload)

✅ BENEFIT: Model loaded ONCE per worker, reused for all tasks
❌ TRADEOFF: Worker memory increased by ~1.3 GB per process
📈 PERF: ~1000x faster embedding than reload per-task
```

---

## Message Routing by Mode

```
POST /messages with mode="rag":
    │
    ├─ Save to DB
    ├─ Dispatch to chat_priority queue
    └─ rag_document_search.delay(question, session_id, user_id, department)
       │
       └─ Returns: Answer with citations from port_knowledge collection

POST /messages with mode="sql":
    │
    ├─ Save to DB
    ├─ Dispatch to data_batch queue
    └─ run_sql_query.delay(question, session_id, user_id)
       │
       └─ Returns: Query result (via Vanna SQL-AI)

POST /messages with mode="chat" (default):
    │
    ├─ Save to DB
    ├─ Dispatch to chat_priority queue
    └─ process_chat_response.delay(message_id, content, role, ...)
       │
       ├─ Chunk message
       ├─ Embed chunks (Mem0)
       └─ Store in Qdrant chat_chunks collection
           (Used for semantic_search, not RAG synthesis)

PLUS (all modes):
    ├─ store_memory.delay() if user_id exists
    └─ summarize_session_history.delay() every 10 messages
```

---

## Database Schema Relationships

```
chat_sessions (1)
├─ id (UUID, PK)
├─ user_id (indexed)
├─ metadata (JSON)
│  └─ "summary": "...",
│  └─ "message_count_at_summary": N
├─ created_at, updated_at
│
└─── (1:N) ──→ chat_messages (N)
                ├─ id (UUID, PK)
                ├─ session_id (FK, indexed)
                ├─ role ("user", "assistant")
                ├─ content (text)
                ├─ metadata (JSON)
                │  └─ "rag_chunk_ids": [ID1, ID2, ...]
                ├─ created_at
                │
                ├─── (1:N) ──→ chat_message_chunks (N)
                │              ├─ id (UUID, PK)
                │              ├─ message_id (FK, cascade)
                │              ├─ chunk_index (int)
                │              ├─ content (text)
                │              ├─ vector_id (references Qdrant)
                │              └─ metadata (JSON)
                │
                └─── (1:N) ──→ message_feedbacks (N)
                               ├─ id (UUID, PK)
                               ├─ message_id (FK, cascade)
                               ├─ is_liked (bool)
                               ├─ reason (string)
                               └─ created_at

documents (N)
├─ id (UUID, PK)
├─ user_id (indexed)
├─ filename, file_path
├─ status ("processing"|"ready"|"error")
├─ chunk_count, extractor_used
├─ error_message, metadata (JSON)
└─ created_at, updated_at
```

---

## Qdrant Collections

### `port_knowledge` (RAG Documents)
- **Purpose:** Uploaded business documents (PDFs, images)
- **Vectors:** HuggingFace Vietnamese embeddings (384-dim)
- **Payload fields:**
  - `content` (str): Chunk text
  - `source_file` (str): Original filename
  - `page_number` (int): Page in document
  - `document_id` (uuid): Link to documents table
  - `headings` (list): Section hierarchy
  - `quality` (str, enum): "normal" or "low" (via feedback)
  - `is_public` (bool): Sharing flag
  - `user_id` (str): Owner (if private)
- **Filter:** `(user_id matches OR department matches AND is_public) AND NOT quality=low`

### `chat_chunks` (Session Messages)
- **Purpose:** User messages chunked & embedded for semantic search
- **Vectors:** Mem0 embeddings
- **Payload fields:**
  - `content` (str): Chunk text
  - `session_id` (uuid): Which session
  - `message_id` (uuid): Which message
  - `user_id` (str): Owner
  - `role` (str): "user" or "assistant"
  - `department` (str): Org context
  - `chunk_index` (int): Order within message
- **Filter:** `user_id matches OR department matches`

