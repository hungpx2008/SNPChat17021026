# ChatSNP Backend Codebase Exploration Report

**Date:** 2026-04-13  
**Project Path:** `/Volumes/orical/ChatSNP/chatSNP170226/backend/`

---

## 1. Directory Structure

### Top-level Backend Structure
```
backend/
├── src/                    # Main application source
│   ├── __init__.py
│   ├── main.py
│   ├── api/               # FastAPI route handlers
│   ├── core/              # Configuration & infrastructure setup
│   ├── models/            # SQLAlchemy ORM models
│   ├── repositories/      # Database access layer
│   ├── schemas/           # Pydantic validation schemas
│   ├── services/          # Business logic services
│   └── worker/            # Celery task definitions
├── tests/                 # Unit & integration tests
└── .venv/                 # Python virtual environment
```

### Core Components

#### `src/api/` — FastAPI Route Handlers
```
api/
├── __init__.py
├── admin.py               # Admin endpoints
├── chat.py                # Chat session & message endpoints
├── deps.py                # Dependency injection (DB sessions, auth)
├── feedback.py            # User feedback processing
├── tts.py                 # Text-to-speech endpoints
└── upload.py              # Document upload endpoints
```

#### `src/core/` — Infrastructure & Configuration
```
core/
├── __init__.py
├── celery_config.py       # Celery queue & broker config
├── config.py              # Settings & environment variables
├── database_pool.py       # PostgreSQL connection pooling (sync)
├── db.py                  # SQLAlchemy async engine & session factory
├── http_client.py         # Reusable HTTP client (httpx)
├── mem0_config.py         # Mem0 long-term memory API client
├── qdrant_setup.py        # Vector DB (Qdrant) initialization
├── redis_client.py        # Redis cache & pub/sub client
└── vanna_setup.py         # Vanna SQL-AI integration
```

#### `src/models/` — SQLAlchemy ORM Models
```
models/
├── __init__.py
└── models.py              # All database tables
```

#### `src/repositories/` — Data Access Layer
```
repositories/
├── __init__.py
├── messages.py            # ChatMessage CRUD operations
└── sessions.py            # ChatSession CRUD operations
```

#### `src/schemas/` — Pydantic Request/Response Validation
```
schemas/
├── __init__.py
└── schemas.py             # All request/response schemas
```

#### `src/services/` — Business Logic
```
services/
├── __init__.py
├── chat_service.py        # Main chat logic & dispatcher
├── docling_service.py     # Document parsing (Docling extractor)
├── kreuzberg_service.py   # (Small utility service)
├── lida_service.py        # Data visualization (LIDA library)
└── tts_service.py         # Text-to-speech synthesis
```

#### `src/worker/` — Celery Async Tasks (3 Queues)
```
worker/
├── __init__.py
├── celery_app.py          # Celery app instance & config
├── tasks.py               # Re-exports all tasks (for backward compatibility)
├── chat_tasks.py          # 🔴 Queue: chat_priority
├── data_tasks.py          # 🟡 Queue: data_batch
├── media_tasks.py         # 🟢 Queue: media_process
├── gardener_tasks.py      # Background memory consolidation
└── helpers.py             # Shared utility functions (chunking, embeddings, etc.)
```

---

## 2. Database Models (ORM) — `models.py`

### ChatSession
```python
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id: UUID (primary key)
    external_id: str | None (unique)
    user_id: str | None (indexed)
    department: str | None
    title: str | None
    meta: dict  # {"summary": "...", "message_count_at_summary": N}
    created_at: datetime
    updated_at: datetime
    
    messages: Relationship[ChatMessage]  # cascade delete
```

### ChatMessage
```python
class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id: UUID (primary key)
    session_id: UUID (FK → ChatSession, cascade delete)
    role: str  # "user" | "assistant"
    content: str
    meta: dict  # {"rag_chunk_ids": [...], ...}
    created_at: datetime
    
    session: Relationship[ChatSession]
    chunks: Relationship[ChatMessageChunk]  # cascade delete
```

### ChatMessageChunk
```python
class ChatMessageChunk(Base):
    __tablename__ = "chat_message_chunks"
    
    id: UUID (primary key)
    message_id: UUID (FK → ChatMessage, cascade delete)
    chunk_index: int
    content: str
    vector_id: str | None  # Reference to Qdrant point ID
    meta: dict
    created_at: datetime
    
    message: Relationship[ChatMessage]
```

### Document
```python
class Document(Base):
    __tablename__ = "documents"
    
    id: UUID (primary key)
    user_id: str | None (indexed)
    filename: str
    file_path: str
    status: str  # "processing" | "ready" | "error"
    chunk_count: int
    extractor_used: str | None  # "docling" | "vlm" | "whisper_local"
    error_message: str | None
    meta: dict
    created_at: datetime
    updated_at: datetime
```

### MessageFeedback
```python
class MessageFeedback(Base):
    __tablename__ = "message_feedbacks"
    
    id: UUID (primary key)
    message_id: UUID (FK → ChatMessage, cascade delete)
    is_liked: bool
    reason: str | None
    created_at: datetime
```

---

## 3. Chat Tasks Worker — `chat_tasks.py`

### 🔴 Queue: `chat_priority` (Real-time Chat Tasks)

#### **Task 1: `process_chat_response` (Lines 53–123)**
- **Purpose:** Process user message → chunk → embed → store in Qdrant
- **Input:** `session_id, message_id, content, role, user_id, department`
- **Flow:**
  1. Smart chunk text (512 chars, 50 overlap)
  2. Embed chunks via Mem0 API (parallel, 8 workers)
  3. Store vectors in Qdrant `chat_chunks` collection
- **Returns:** `{"status": "ok|warning", "message_id": "...", "chunks": N}`
- **Retry:** Max 3 retries, exponential backoff

#### **Task 2: `store_memory` (Lines 125–164)**
- **Purpose:** Save long-term memory to Mem0
- **Input:** `user_id, content, role, session_id, department`
- **Flow:**
  1. Call `POST /memories` to Mem0
  2. Include metadata: `{session_id, department}`
- **Returns:** `{"status": "ok|warning", "user_id": "..."}`
- **Retry:** Max 3 retries

#### **Task 3: `rag_document_search` (Lines 623–750)**
- **Purpose:** RAG search across uploaded documents, synthesize answers
- **Input:** `question, session_id, user_id, department`
- **Flow:**
  1. **Embed question** via HuggingFace (cached singleton)
  2. **Query Qdrant** `port_knowledge` collection (top-k=5)
  3. **Filter by score threshold** (RAG_SCORE_THRESHOLD = 0.35)
  4. **Build context + citations** (deduplication by file+page+heading)
  5. **Gather unified context:**
     - Long-term memories (Mem0)
     - Session summary (from metadata)
     - Recent messages (last 6)
  6. **Synthesize via LLM** (OpenRouter, gpt-4o-mini default)
  7. **Fallback** if LLM fails
  8. **Save answer** to database
  9. **Store chunk IDs** in message metadata (for feedback accuracy)
  10. **Publish** Redis event `session:{session_id}` with `"message_ready"`
- **Returns:** `{"status": "success|error", "question": "...", "citations": N}`
- **Retry:** Max 2 retries

#### **Task 4: `process_feedback` (Lines 753–839)**
- **Purpose:** Self-correction via user feedback
- **Input:** `message_id, is_liked, reason`
- **Positive feedback:** No action
- **Negative feedback:**
  - **Strategy A (Preferred):** Use exact `rag_chunk_ids` stored in message metadata
  - **Strategy B (Fallback):** Embed message, find similar chunks, mark as `quality="low"`
- **Returns:** `{"status": "ok|error", "action": "positive_feedback|vectors_downgraded", ...}`
- **Retry:** Max 2 retries

#### **Task 5: `summarize_session_history` (Lines 846–931)**
- **Purpose:** Async session summary (triggered every 10 messages)
- **Input:** `session_id`
- **Flow:**
  1. Fetch **all messages** from DB (ordered by created_at ASC)
  2. Truncate each message (max 200 chars, cap input at 6000)
  3. Call **LLM** with system prompt: "Summarize into 500-char Vietnamese paragraph"
  4. **Store summary** in `chat_sessions.metadata.summary` (JSON)
  5. Also store `message_count_at_summary` for tracking
- **Returns:** `{"status": "ok|skip|error", "session_id": "...", ...}`
- **Retry:** Max 2 retries

---

## 4. Key Helper Functions & Context Builders

### **`_gather_unified_context()` (Lines 344–408)**
Collects three context blocks for RAG synthesis:

```python
def _gather_unified_context(question: str, session_id: str, user_id: str | None) -> dict[str, str]:
    # Returns:
    # {
    #     "long_term_block": "- Memory 1\n- Memory 2\n...",
    #     "summary_block": "Session summary text...",
    #     "recent_block": "USER: Question\nASSISTANT: Answer\n..."
    # }
```

**Process:**
1. **Long-term memories** (Mem0)
   - POST `/search` to Mem0 with `{query, user_id, limit=5}`
   - Collect text from results
   - Best effort (catches exceptions)

2. **Session summary**
   - Join query: `chat_sessions LEFT JOIN chat_messages`
   - Extract metadata `summary` field
   - Falls back to empty string

3. **Recent messages**
   - Fetch 6 most recent messages
   - Reverse order (oldest first)
   - Format: `"ROLE: Content"` per line

### **`_RAG_SYSTEM_PROMPT` (Lines 411–425)**
Vietnamese system prompt for RAG synthesis:
- Professional, concise Vietnamese responses
- Markdown tables for tabular data
- Currency preservation (VNĐ, USD)
- Citation numbering: `[1]`, `[2]`
- No data fabrication — fallback to "chưa có thông tin"

### **`_build_context_and_citations()` (Lines 283–341)**
Parse retrieval nodes into deduplicated citations + context blocks:

**Deduplication strategy:**
- `cite_key = (filename, page, heading)`
- Same page from same doc = 1 citation
- Content hash check (first 200 chars) prevents near-duplicates

**Output:**
```python
(citations, context_blocks)
# citations = [{"index": 1, "file": "doc.pdf", "page": 5, "headings": [...], "score": 0.87}, ...]
# context_blocks = ["[1] Snippet text...", "[2] Another snippet...", ...]
```

### **`_synthesize_with_llm()` (Lines 428–486)**
Call LLM (OpenRouter) to synthesize clean answers:

**Unified context assembly:**
```
### Long-term Memory
- Memory 1
- Memory 2

### Tóm tắt hội thoại
Session summary...

### Hội thoại gần đây
USER: ...
ASSISTANT: ...

### Đoạn trích tài liệu (đã đánh số)
[1] Snippet 1...
[2] Snippet 2...
```

**Request:**
- Model: `LLM_MODEL` env (default: `openai/gpt-4o-mini`)
- Temperature: 0.3 (low randomness)
- Max tokens: 1500
- Error handling: Catches empty content (reasoning models issue)

### **`_clean_snippet_text()` (Lines 237–269)**
Sanitize raw snippet before LLM:
- Remove HTML tags
- Normalize Windows line endings
- Convert tabs to spaces
- Collapse multiple spaces
- Remove blank lines > 2
- Join stray whitespace

### **`_extract_snippet()` (Lines 272–280)**
Extract clean text from LlamaIndex node

### **`_extract_node_metadata()` (Lines 209–234)**
Extract metadata from node:
- `source_file` → display filename
- `page_number` / `page` / `pageIndex` → page
- `document_id` → doc_id
- `headings` → breadcrumb list

### **`_sanitize_generated_answer()` (Lines 551–575)**
Post-process LLM output:
- Remove citation footer (re-added later)
- Remove malformed citations
- Fix inline citations: `[ 1 VNĐ ]` → `[1]`
- Trim trailing incomplete words

### **`_format_citations_footer()` (Lines 587–616)**
Format clean markdown footer:
```markdown
---
📚 **Nguồn tham khảo:**
- **[1]** document.pdf (Trang 5) | mục: "Shipping Rates" — độ liên quan: 0.847
- **[2]** pricing.pdf (Trang 1) — độ liên quan: 0.756
```

### **Helper Functions in `helpers.py`**

#### **`_smart_chunk()`  (Lines 157–222)**
Intelligent text chunking:
- Splits on: section breaks → paragraphs → sentences → words
- Table preprocessing: Enrich tables via LLM BEFORE chunking
- Preserves prices/tables intact
- Estimates page numbers from:
  1. `<!-- Page X -->` tags
  2. Form feeds (`\f`)
  3. Character count estimate (2500 chars/page)
- Returns: `list[(chunk_text, page_num)]`

#### **`_extract_text_from_image()`  (Lines 18–71)**
OpenAI Vision API for image OCR/description:
- Base64 encode image
- Call Vision API with "high" detail
- Returns Vietnamese description of image content

#### **`_llm_enrich_table()`  (Lines 74–116)**
Transform Markdown tables into semantic text:
- For small tables (<4 lines): keep as-is
- For larger tables: Call LLM to convert to prose
- Preserve exact numbers, names, units
- Returns: enriched text + original table for reference

#### **`_process_tables_in_text()`  (Lines 136–154)**
Find & enrich all Markdown tables in document

#### **`publish_task_complete()`  (Lines 118–133)**
Publish Redis Pub/Sub event when task finishes:
- Channel: `session:{session_id}`
- Payload: `{"event": "message_ready", "session_id": "..."}`
- Used by SSE endpoint to push updates to frontend

---

## 5. Chat Service Business Logic — `chat_service.py`

### **`ChatService` Class**

#### **`add_message()` (Lines 64–139)**
Main dispatcher for user messages:

**Flow:**
1. Create message in DB (with optional metadata)
2. Update Redis cache (append instead of full reload)
3. **Dispatch task based on mode:**
   - `mode="rag"` → `rag_document_search.delay()`
   - `mode="sql"` → `run_sql_query.delay()` (data_batch queue)
   - `mode="chat"` (default) → `process_chat_response.delay()`
4. **Trigger memory storage** if: `user_id exists AND content.length > 10`
   - Via `store_memory.delay()`
5. **Trigger async summary** every 10 messages
   - If `msg_count % 10 == 0` → `summarize_session_history.delay()`
   - Runs in background, user doesn't wait

**Return:**
```python
{
    "id": UUID,
    "session_id": UUID,
    "role": str,
    "content": str,
    "metadata": dict,
    "created_at": str,
    "task_dispatched": bool,  # True if RAG/SQL task queued
    "intent_type": "chat" | "rag" | "sql"
}
```

#### **`get_session_with_messages()` (Lines 51–62)**
Fetch session + messages with Redis caching:
- Cache key: `chat:session:{session_id}`
- TTL: 1 hour
- Returns paginated messages (optional limit)

#### **`semantic_search()` (Lines 145–212)**
Unified semantic search across two sources:
- **Qdrant** (short-term chat chunks)
- **Mem0** (long-term user memories)
- **Parallel** execution via `asyncio.gather()`
- **Score threshold:** 0.35 (unified across sources)
- **Returns:** Combined, ranked results

---

## 6. Environment Configuration

### Key ENV Variables
```bash
# LLM & Embedding
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=openai/gpt-4o-mini
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2

# Vector DB
QDRANT_URL=http://qdrant:6333
RAG_SCORE_THRESHOLD=0.35

# Long-term Memory
MEM0_URL=http://mem0:8000

# Message Broker & Cache
CELERY_BROKER_URL=redis://redis:6379/0
REDIS_URL=redis://redis:6379/0

# Database
DATABASE_URL=postgresql+asyncpg://user:pwd@db:5432/chatsnp

# Ports & URLs
BACKEND_INTERNAL_URL=http://backend:8000
```

---

## 7. Celery Task Queues & Routing

### Queue Configuration (`celery_config.py`)

| Queue Name | Task | Priority | Use Case |
|---|---|---|---|
| **chat_priority** | process_chat_response, store_memory, rag_document_search, process_feedback, summarize_session_history | 🔴 HIGH | Real-time chat, RAG synthesis, user feedback |
| **data_batch** | run_sql_query, sync_data | 🟡 MEDIUM | Database queries, data sync (30s SLA) |
| **media_process** | process_document, transcribe_audio, generate_chart, text_to_speech | 🟢 LOW | Background: doc parsing, audio/visualization |

### Task Dispatch Logic (from `chat_service.add_message()`)
```python
mode = getattr(message, 'mode', 'chat')

if mode == "sql":
    run_sql_query.delay(...)
elif mode == "rag":
    rag_document_search.delay(...)
else:  # "chat" (default)
    process_chat_response.delay(...)
```

---

## 8. Data Flow Diagrams

### Chat Message Flow
```
Frontend
  ↓
POST /sessions/{session_id}/messages
  ↓
ChatService.add_message()
  ├─ Create ChatMessage in DB
  ├─ Update Redis cache
  ├─ Dispatch Celery task (RAG/SQL/Chat)
  ├─ Trigger store_memory() if conditions met
  └─ Trigger summarize_session_history() every 10 messages
  ↓
Celery Worker (chat_priority queue)
  ├─ rag_document_search (if mode="rag")
  │   ├─ Embed question (HuggingFace)
  │   ├─ Query Qdrant (port_knowledge)
  │   ├─ Gather unified context (Mem0 + session summary + recent)
  │   ├─ Synthesize via LLM
  │   └─ Save answer + publish Redis event
  │
  ├─ process_chat_response (if mode="chat")
  │   ├─ Chunk message
  │   ├─ Embed chunks (Mem0)
  │   └─ Store in Qdrant (chat_chunks)
  │
  └─ store_memory (if conditions met)
      └─ POST to Mem0 /memories
  ↓
Frontend (via SSE)
  └─ Receive message_ready event → reload messages
```

### Feedback Self-Correction Flow
```
Frontend (User dislikes answer)
  ↓
POST /messages/{message_id}/feedback
  ↓
process_feedback Celery task
  ├─ Strategy A: Use stored rag_chunk_ids (accurate)
  │   └─ Call qdrant.set_payload(quality="low")
  └─ Strategy B: Fallback similarity search
      └─ Embed message, find similar chunks, mark low_quality
  ↓
On next RAG search:
  └─ Qdrant filter: must_not quality="low"
```

### Summarization Flow
```
ChatService.add_message() every 10 messages
  ↓
summarize_session_history.delay(session_id)
  ↓
Celery Worker (chat_priority)
  ├─ Fetch all messages (ordered ASC)
  ├─ Truncate to manageable size (6000 chars)
  ├─ Call LLM: "Summarize to 500 chars in Vietnamese"
  └─ Store summary in chat_sessions.metadata
  ↓
Future RAG searches:
  └─ Include summary_block in unified context
```

---

## 9. Key Statistics & Thresholds

| Setting | Value | Purpose |
|---------|-------|---------|
| `RAG_SCORE_THRESHOLD` | 0.35 | Min cosine similarity to include chunk |
| `RAG_TOP_K` | 5 | Top-k chunks for retrieval |
| `chunk_size` | 512 chars | Smart chunk size |
| `chunk_overlap` | 50 chars | Overlap between chunks |
| `embed_workers` | 8 (min len, 8) | Thread pool for parallel embedding |
| `LLM_temperature` | 0.3 | Low randomness for consistent answers |
| `LLM_max_tokens` | 1500 | Max output length |
| `Summary_max_chars` | 500 | Max summary length |
| `Summary_interval` | Every 10 messages | When to trigger async summary |
| `Mem0_search_limit` | 5 | Long-term memories per search |
| `Recent_messages_limit` | 6 | Recent messages for context |
| `Message_truncate` | 200 chars | Per message in summary prompt |
| `REDIS_TTL` | 3600 sec | Message cache lifetime |

---

## 10. Code Entry Points & Key Imports

### Main API Entry Point
```python
# src/main.py
from src.api.chat import router
app.include_router(router)

# Starts FastAPI server with chat endpoints
```

### Main Celery Entry Point
```python
# src/worker/celery_app.py
from celery import Celery
celery_app = Celery(broker=CELERY_BROKER_URL, ...)

# Re-export all tasks via src/worker/tasks.py
from src.worker.chat_tasks import rag_document_search, summarize_session_history, etc.
```

### Service Initialization
```python
# src/services/chat_service.py
service = ChatService(db_session)
message = await service.add_message(...)  # Orchestrates everything
```

---

## Summary

The ChatSNP backend is a **multi-queue async architecture** with three main components:

1. **FastAPI synchronous API** — Session & message management
2. **ChatService business logic** — Orchestration & task dispatch
3. **Celery async workers** — RAG, embeddings, memory, summarization

**Key flows:**
- **RAG Search:** Question → Embed → Qdrant search → Unified context (Mem0 + summary + recent) → LLM synthesis → Citations
- **Feedback:** Negative feedback → Mark vectors as low_quality → Filter in future searches
- **Summarization:** Every 10 messages → LLM summary → Stored in metadata → Reused in future RAG contexts

**Performance optimizations:**
- Cached HuggingFace embedding model (1.3 GB, per-worker)
- Redis message caching (1-hour TTL)
- Parallel chunk embedding (8 workers)
- Smart chunking with table enrichment (LLM pre-processing)
- Qdrant filtering for security + quality gates
- Async summarization (doesn't block user)

