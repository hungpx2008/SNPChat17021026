# ChatSNP — COMPREHENSIVE ARCHITECTURE & FEATURES ANALYSIS

**Generated:** 2026-04-13  
**Project Path:** `/Volumes/orical/ChatSNP/chatSNP170226/`  
**Scope:** Complete backend, frontend, infrastructure, and AI integration analysis

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Features](#frontend-features)
4. [Infrastructure & Deployment](#infrastructure--deployment)
5. [Authentication & Authorization](#authentication--authorization)
6. [AI & LLM Integration](#ai--llm-integration)
7. [Memory System (Mem0)](#memory-system-mem0)
8. [Database Schema](#database-schema)
9. [API Endpoints Reference](#api-endpoints-reference)
10. [Celery Task Queue System](#celery-task-queue-system)
11. [Data Flow Diagrams](#data-flow-diagrams)
12. [Current Limitations & Known Issues](#current-limitations--known-issues)

---

## EXECUTIVE SUMMARY

**ChatSNP** is a sophisticated Vietnamese port authority (Tân Cảng Sài Gòn) chatbot with:

- **3 Agent Modes:** Chat (direct LLM), SQL (Vanna text-to-SQL), RAG (document-aware Q&A)
- **Dual-Memory System:** Long-term (Mem0 semantic facts) + Short-term (Qdrant session chunks)
- **Async-First Architecture:** Celery workers on 3 priority queues for real-time responsiveness
- **Vietnamese-Optimized:** Custom embedding model, Vietnamese NLP, localized prompts
- **Document Processing:** Multi-format support via Docling (tables, images, PDFs, XLSX, etc.)
- **Production Ready:** Docker Compose, Cloudflare tunnel, monitoring via Flower

**Tech Stack:**
- Backend: FastAPI (Python 3.10+), SQLAlchemy 2.0 async
- Frontend: Next.js 15 (App Router), React 18, TailwindCSS, shadcn/ui
- Data: PostgreSQL 16, Redis 7, Qdrant vector DB
- AI: OpenRouter API (gpt-4o-mini), Mem0, LlamaIndex, Vanna, Docling
- Queueing: Celery + Redis Broker, 3 specialized worker pools
- Monitoring: Flower (Celery task dashboard)

---

# BACKEND ARCHITECTURE

## 1. FastAPI Application Structure

### Main Entry Point: `src/main.py`

```
FastAPI App (port 8000)
├── Lifespan Context Manager
│   ├── Startup: Init DB, Qdrant, Mem0 client
│   └── Shutdown: Close Redis/HTTP clients
├── CORS Middleware (configurable allowed origins)
├── Global Exception Handler (no internal detail leaks)
├── 5 Routers:
│   ├── /sessions/* (chat CRUD)
│   ├── /upload/* (file management)
│   ├── /admin/* (diagnostics)
│   ├── /feedback (user ratings)
│   └── /tts (text-to-speech)
└── /media/* static files (charts, TTS, uploads)
```

### Key Files:
- `src/main.py` — App factory, middleware, router registration, lifespan
- `src/core/config.py` — Pydantic Settings (all env vars + validation)
- `src/core/db.py` — SQLAlchemy async engine + SessionLocal
- `src/core/redis_client.py` — Redis async client singleton
- `src/core/qdrant_setup.py` — Qdrant client + collection helpers
- `src/core/mem0_config.py` — Mem0 HTTP proxy + embedding delegation

---

## 2. API ROUTES — COMPREHENSIVE LIST

### **Chat Management** (`/sessions`)

| Method | Path | Params | Response | Purpose |
|--------|------|--------|----------|---------|
| POST | `/sessions` | SessionCreate (user_id, department, title, external_id) | SessionSchema | Create new chat session |
| GET | `/sessions?user_id=` | user_id (required) | SessionSchema[] | List all sessions for user |
| GET | `/sessions/{session_id}?limit=` | session_id, limit (1-1000) | SessionWithMessages | Get session + messages |
| POST | `/sessions/{session_id}/messages` | MessageCreate (role, content, mode, metadata) | MessageSchema + task_dispatched flag | Add user/assistant message |
| GET | `/sessions/{session_id}/stream` | session_id | SSE stream | Server-Sent Events for real-time task completion |
| POST | `/sessions/search` | SearchQuery (query, user_id, limit) | SearchResult[] | Semantic search (Qdrant + Mem0) |

**Mode Values for Message Creation:**
- `"chat"` (default) — Direct LLM response (frontend Server Action)
- `"rag"` — Document-aware search + synthesis (Celery async)
- `"sql"` — Natural language SQL query generation (Celery async)

---

### **Document Management** (`/upload`)

| Method | Path | Params | Response | Purpose |
|--------|------|--------|----------|---------|
| POST | `/upload` | file (UploadFile), user_id, department, overwrite (bool) | DocumentUploadResponse | Upload file, trigger async processing |
| GET | `/upload/{doc_id}/status` | doc_id | {"status": "processing\|ready\|error", "chunk_count": int, "error": str} | Check processing progress |
| DELETE | `/upload/{doc_id}/cancel` | doc_id | {"message": "deleted"} | Cancel processing + delete all Qdrant chunks |
| GET | `/upload/{doc_id}/download` | doc_id | FileResponse | Download/preview original file |
| GET | `/upload?user_id=` | user_id | DocumentSchema[] | List user's uploaded documents |
| GET | `/upload/find-by-name?filename=` | filename | Document or 404 | Find document by exact filename |

**Supported File Types:**
- Documents: `.pdf`, `.docx`, `.doc`, `.xlsx`, `.xls`, `.pptx`, `.ppt`, `.md`, `.txt`, `.csv`
- Images: `.jpg`, `.jpeg`, `.png`
- Audio: `.mp3`, `.wav`, `.m4a`, `.aac`

**Processing Pipeline:**
- Images → VLM description (gpt-4o-mini)
- Audio → Whisper transcription
- All others → Docling deep extraction

---

### **Feedback & Self-Correction** (`/feedback`)

| Method | Path | Body | Response | Purpose |
|--------|------|------|----------|---------|
| POST | `/feedback` | FeedbackCreate (message_id, is_liked, reason) | FeedbackResponse | Submit 👍/👎, trigger self-correction |

**When User Dislikes (is_liked=false):**
1. Save feedback record to DB
2. Dispatch `process_feedback` Celery task
3. Mark source chunks in Qdrant as `quality: "low"`
4. Future RAG searches exclude low-quality chunks

**Feedback Reasons:**
- `"sai số liệu"` — Incorrect data
- `"thiếu trích dẫn"` — Missing citations
- `"không liên quan"` — Off-topic
- `"khác"` — Other

---

### **Text-to-Speech** (`/tts`)

| Method | Path | Body | Response | Purpose |
|--------|------|------|----------|---------|
| POST | `/tts` | TTSRequest (text: str, voice: str) | audio/mpeg stream | Convert text to MP3 speech |

**Voice Options:**
- Default: `"vi-VN-HoaiMyNeural"` (Vietnamese female)
- Other: Any Edge-TTS supported voice code

**Behavior:**
- Synchronous, non-blocking (no Celery)
- Returns audio stream directly
- Cache-friendly (3600s max-age header)

---

### **Admin Dashboard** (`/admin`)

| Method | Path | Query | Response | Purpose |
|--------|------|-------|----------|---------|
| POST | `/admin/train/ddl` | TrainDDLRequest (ddl, documentation) | {"status": "success"\|"error"} | Train Vanna with database schema |
| GET | `/admin/sessions?limit=&user_id=` | limit (1-1000), user_id (optional) | AdminSessionSummary[] | List all sessions with message counts |
| GET | `/admin/sessions/{session_id}/messages` | session_id | MessageSchema[] | Inspect all messages in a session |
| GET | `/admin/redis/cache?session_id=` | session_id (optional) | RedisCacheResponse (entries, key_count) | View cached session data |
| GET | `/admin/qdrant/collections` | — | QdrantCollectionSchema[] | List all Qdrant collections + stats |
| GET | `/admin/qdrant/search` | collection, query_text, limit | QdrantPointSchema[] | Search a collection directly |

---

## 3. Service Layer (Business Logic)

### **ChatService** (`src/services/chat_service.py`)

**Responsibilities:**
- Session CRUD operations
- Message creation + Celery task dispatch
- Redis cache management (session messages)
- Semantic search (Qdrant + Mem0 combined)

**Key Methods:**

```python
async def create_session(user_id, department, title, external_id)
async def list_sessions(user_id) -> list[SessionSchema]
async def get_session_with_messages(session_id, limit=None) -> list[MessageSchema]
async def add_message(session_id, message, user_id, department) -> ChatMessage
  # Dispatches based on message.mode:
  # - "chat" → direct LLM in Server Action
  # - "rag" → rag_document_search Celery task
  # - "sql" → run_sql_query Celery task
  # - Triggers store_memory + summarize_session (async)

async def semantic_search(query: SearchQuery) -> list[SearchResult]
  # 1. Embed query via Mem0
  # 2. Search Qdrant chat_chunks collection
  # 3. Search Mem0 long-term memories
  # 4. Merge + score threshold (0.35)
  # 5. Return top-k results
```

**Cache Strategy:**
- Key: `chat:session:{session_id}`
- TTL: 1 hour
- Strategy: Append-only (new messages added to cached list, not full reload)

---

### **Other Services**

| Service | File | Responsibilities |
|---------|------|-------------------|
| DocumentingService | `src/services/docling_service.py` | Docling document extraction, table serialization, chunking |
| LidaService | `src/services/lida_service.py` | Chart generation from DataFrames |
| TTSService | `src/services/tts_service.py` | Edge-TTS integration |
| KreuzbergService | `src/services/kreuzberg_service.py` | (Legacy, may be unused) |

---

## 4. Repository Pattern (Data Access)

**Files:** `src/repositories/`

| Repository | Methods |
|------------|---------|
| **SessionRepository** | `create_session()`, `list_sessions_for_user()`, `get_session_by_id()`, `list_sessions_with_counts()` |
| **MessageRepository** | `create_message()`, `list_messages()`, `get_message_by_id()` |

**Pattern:** Thin wrapper over SQLAlchemy queries, all async

---

## 5. Core Infrastructure

### **Database** (`src/core/db.py`)
- Engine: `SQLAlchemy AsyncEngine` with `asyncpg` driver
- URL: `postgresql+asyncpg://user:pwd@host:5432/chatsnp`
- Create tables on startup (Alembic integration ready)
- SessionLocal factory for request-scoped DB sessions

### **Redis** (`src/core/redis_client.py`)
- Singleton async Redis client
- URL: `redis://redis:6379/0`
- Uses:
  - Celery broker (task queue)
  - Session message cache
  - Pub/Sub for task completion signals

### **Qdrant Vector Store** (`src/core/qdrant_setup.py`)
- Client: `QdrantClient(url="http://qdrant:6333")`
- Collections:
  - `chat_chunks` — Short-term session messages
  - `port_knowledge` — RAG document chunks
  - `mem0_memories` — Managed by Mem0 service

### **Vanna (Text-to-SQL)** (`src/core/vanna_setup.py`)
- LLM: OpenRouter (via OpenAI-compatible API)
- Database: PostgreSQL connection pool
- Trained DDL via `/admin/train/ddl`

### **Mem0 Client** (`src/core/mem0_config.py`)
- HTTP proxy to Mem0 service (port 8888)
- Methods:
  - POST `/embed` — Delegate text embedding
  - POST `/memories` — Store long-term facts
  - GET `/memories?user_id=` — Retrieve facts
  - POST `/search` — Semantic memory search

---

# FRONTEND FEATURES

## 1. Pages & Authentication

### **Login Page** (`frontend/src/app/login/page.tsx`)
- Email + password form
- "Forgot password?" link
- Department selector dropdown
- Language toggle (VI/EN)
- Links to signup/signup

### **Signup Page** (`frontend/src/app/signup/page.tsx`)
- User registration (email, password, name)
- Department selection
- Form validation

### **Forgot Password** (`frontend/src/app/forgot-password/page.tsx`)
- Email-based password reset

### **Main Chat Page** (`frontend/src/app/chat/page.tsx`)
- Requires `?department=` query param
- Protected by AuthProvider context
- Renders `<ChatUI />` orchestrator component

### **Admin Dashboard** (`frontend/src/app/admin/page.tsx`)
- Session inspection
- Redis cache viewer
- Qdrant collection browser

---

## 2. UI Components Architecture

### **Chat Orchestrator** (`src/components/chat-ui.tsx`)
- Central state manager for entire chat experience
- Hooks integration (sessions, messages, file attachment)
- Layout: sidebar + main chat area + document panel
- Manages mode switching (chat/sql/rag)
- Polling for SSE stream updates

### **Sidebar Components** (`src/components/chat/`)

| Component | File | Features |
|-----------|------|----------|
| **ChatSidebar** | `chat-sidebar.tsx` | Session list, session creation, session deletion, sorting by date |
| **DocumentSidebar** | `document-sidebar.tsx` | Uploaded file list, processing status, delete file, preview toggle |
| **ChatHeader** | `chat-header.tsx` | Page title, department display, language toggle, settings icon |

### **Main Chat Area**

| Component | File | Features |
|-----------|------|----------|
| **ChatComposer** | `chat-composer.tsx` | Text input, file attachment button, mode selector (chat/sql/rag), send button, typing indicator |
| **ChatMessageList** | `chat-message-list.tsx` | Message rendering (user + assistant), markdown support, code highlighting, loading states |
| **MessageRenderer** | `llm-response-renderer.tsx` | Markdown to JSX, syntax highlighting, table rendering, link handling |
| **ProcessingStatus** | `processing-status.tsx` | "Thinking..." indicator, spinning loader, task name display |
| **FeedbackButtons** | `feedback-buttons.tsx` | 👍/👎 voting, feedback reason selector, API call to `/feedback` |

### **Document Panel**

| Component | File | Features |
|-----------|------|----------|
| **AttachmentPreview** | `attachment-preview.tsx` | File icon, filename, delete button, open in modal |
| **FilePreviewModal** | `file-preview-modal.tsx` | PDF viewer (PDF.js), DOCX viewer (mammoth), XLSX viewer (xlsx lib), text preview |

### **UI Library** (`src/components/ui/`)

**30+ shadcn/ui components:**
- Button, Input, Textarea, Select, Checkbox, Radio
- Dialog, Popover, Dropdown Menu, Tooltip
- Tabs, Accordion, Collapsible
- Alert, Badge, Progress, Skeleton
- ScrollArea, Separator, Slot
- Toast (notifications via `use-toast` hook)

---

## 3. Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| **useChatSessions** | `use-chat-sessions.ts` | Create, list, delete sessions; sync with backend |
| **useChatMessages** | `use-chat-messages.ts` | Load messages, detect loading, send message |
| **useFileAttachment** | `use-file-attachment.ts` | File selection, upload to backend, track progress |
| **useChatSearch** | `use-chat-search.ts` | Semantic search in current session |
| **useSessionStream** | `use-session-stream.ts` | SSE listener for task completion (Celery signals) |
| **useToast** | `use-toast.ts` | Toast notifications (success, error, info) |
| **useMobile** | `use-mobile.tsx` | Responsive breakpoint detection |

---

## 4. Services (HTTP Clients)

### **ChatBackend** (`src/services/chat-backend.ts`)
- Axios-like request wrapper for `/sessions/*` endpoints
- Methods:
  - `createSession(user_id, department)`
  - `listSessions(user_id)`
  - `getSession(session_id, limit)`
  - `sendMessage(session_id, role, content, mode, metadata)`
  - `semanticSearch(query, user_id, limit)`
  - `uploadFile(file, user_id, department, overwrite)`
  - `getDocumentStatus(doc_id)`
  - `deleteDocument(doc_id)`
  - `downloadDocument(doc_id)`
  - `listDocuments(user_id)`

### **AdminBackend** (`src/services/admin-backend.ts`)
- Admin endpoints: Redis cache, Qdrant collections, session inspection

### **AuthService** (`src/services/auth-service.ts`)
- Login/signup/reset API calls
- LocalStorage auth token management

### **FileParser** (`src/services/file-parser.ts`)
- Client-side file type detection
- Preview generation (PDF, DOCX, XLSX)

---

## 5. Authentication & State Management

### **AuthProvider** (`src/components/auth-provider.tsx`)
- React Context for auth state
- LocalStorage key: `chatsnp-auth-user`
- Stores: `{ user_id, email, name, department, token }`
- Guest mode: Auto-generated UUID if no auth

### **LanguageProvider** (`src/components/language-provider.tsx`)
- i18n Context (VI/EN)
- LocalStorage key: `chatsnp-language`

### **AI Integration** (`src/ai/`)

| File | Purpose |
|------|---------|
| `localClient.ts` | OpenAI SDK config (OpenRouter base URL, API key) |
| `flows/contextual-help.ts` | LLM call with context blocks (for Server Action) |
| `flows/multimodal-help.ts` | LLM call with image (multimodal support) |

### **System Prompts** (`src/lib/`)

| File | Purpose |
|------|---------|
| `chatsnp-system-prompt.ts` | Main system prompt template with context placeholders |
| `llm-response-formatter.ts` | Post-process LLM output (markdown, tables, citations) |

---

## 6. Server Actions

**File:** `src/app/actions.ts`

```typescript
async function getHelp(
  sessionId: string,
  userMessage: string,
  mode: "chat" | "sql" | "rag",
  contextBlocks: string[]
): Promise<string>
  // Called in Chat mode only (direct LLM, not Celery)
  // 1. Semantic search for context
  // 2. Build prompt with context
  // 3. Call OpenRouter LLM
  // 4. Format + return response

async function getSuggestions(userMessage: string): Promise<string[]>
  // Return suggested follow-up questions
```

---

# INFRASTRUCTURE & DEPLOYMENT

## 1. Docker Compose Services

### **docker-compose.yml** (Development with hot reload)

```
Services:
├── postgres:16
│   └── Port 5432 (internal only)
│   └── Volume: postgres-data:/var/lib/postgresql/data
│
├── redis:7-alpine
│   └── Port 6379
│   └── Volume: redis-data:/data
│
├── qdrant:latest
│   ├── Port 6333 (HTTP API)
│   ├── Port 6334 (gRPC)
│   └── Volume: qdrant-data:/qdrant/storage
│
├── mem0:8000 (Mem0 service, port 8888 exposed)
│   ├── Build from ./mem0-service/Dockerfile
│   ├── Env: HuggingFace token, LLM config
│   ├── Volume: huggingface-cache:/root/.cache/huggingface
│   └── Depends: qdrant (healthy)
│
├── backend:8000 (FastAPI)
│   ├── Build from ./backend/Dockerfile
│   ├── Volumes: ./backend:/app (hot reload), media-data:/app/media
│   ├── Port 8000 exposed
│   └── Depends: postgres (healthy), redis (healthy), qdrant (healthy)
│
├── frontend:3000 (Next.js)
│   ├── Build from ./frontend/Dockerfile
│   ├── Port 3000 exposed
│   └── Depends: backend
│
├── worker_chat (Celery, queue: chat_priority)
│   ├── Concurrency: 2
│   ├── Command: celery -A src.worker.celery_app worker -Q chat_priority
│
├── worker_data (Celery, queue: data_batch)
│   ├── Concurrency: 2
│   └── Command: celery -A src.worker.celery_app worker -Q data_batch
│
├── worker_media (Celery, queue: media_process)
│   ├── Concurrency: 1
│   └── Command: celery -A src.worker.celery_app worker -Q media_process
│
├── flower:5555 (Celery monitoring)
│   └── Dashboard at http://localhost:5555
│
└── cloudflared (Cloudflare Tunnel)
    └── Exposes services to internet
```

### **docker-compose.pro.yml** (Production clean builds, no bind mounts)

---

## 2. Ports Summary

| Service | Port | URL | Access |
|---------|------|-----|--------|
| Frontend (Next.js) | 3000 | http://localhost:3000 | Public via Cloudflare tunnel |
| Backend (FastAPI) | 8000 | http://localhost:8000 | Internal + public tunnel |
| Mem0 Service | 8888 | http://mem0:8888 | Internal only (Docker network) |
| Flower Dashboard | 5555 | http://localhost:5555 | Admin only |
| Qdrant HTTP API | 6333 | http://qdrant:6333 | Internal only |
| Qdrant gRPC | 6334 | — | Internal only |
| Redis | 6379 | — | Internal only |
| PostgreSQL | 5432 | — | Internal only |

---

## 3. Environment Variables

**Backend & Workers:**

```bash
# Database
DATABASE_URL=postgresql+asyncpg://chatsnp:12345678@postgres:5432/chatsnp
POSTGRES_USER=chatsnp
POSTGRES_PASSWORD=12345678
POSTGRES_DB=chatsnp

# Redis & Celery
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
REDIS_PORT=6379

# Qdrant
QDRANT_URL=http://qdrant:6333
QDRANT_HOST=qdrant
QDRANT_PORT=6333

# Mem0
MEM0_URL=http://mem0:8000

# LLM Configuration
OPENAI_API_KEY=<api_key>
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_API_KEY=<api_key>
LLM_MODEL=openai/gpt-4o-mini

# Embedding
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2
HF_TOKEN=<huggingface_token>

# Docling Tuning
DOCLING_CHUNK_MAX_TOKENS=768
DOCLING_CHUNK_MERGE_PEERS=true
DOCLING_TABLE_MARKDOWN_MAX_COLS=4
DOCLING_TABLE_MARKDOWN_MAX_CELLS=36
DOCLING_TABLE_GROUP_KEY_HINTS=type,category,item,service,description,name,code,id,loai,muc,dich vu
DOCLING_TABLE_NORMALIZE_VALUES=true
DOCLING_PREFIX_HEADING_ROWKEY=true
DOCLING_GROUP_LOCK_ENABLED=true
DOCLING_GROUP_LOCK_MAX_CHARS=2800

# RAG
RAG_SCORE_THRESHOLD=0.35

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
BACKEND_INTERNAL_URL=http://backend:8000

# CORS
CORS_ALLOW_ORIGINS=["http://localhost:3000", "http://localhost:9002", "*"]

# Misc
PYTHON_UNBUFFERED=1
```

**Frontend Only:**

```bash
NEXT_PUBLIC_BACKEND_URL=<backend_url>
BACKEND_INTERNAL_URL=<backend_url_internal>
LOCAL_LLM_MODEL=openai/gpt-4o-mini
```

---

# AUTHENTICATION & AUTHORIZATION

## 1. Current Auth Model

**Status:** Frontend-only, localStorage-based (NO JWT on backend API)

### **Frontend Auth** (`src/components/auth-provider.tsx`)

```typescript
interface AuthUser {
  user_id: string;        // UUID, auto-generated if guest
  email?: string;
  name?: string;
  department?: string;
  token?: string;         // Optional JWT from server
}

// Stored in localStorage key: "chatsnp-auth-user"
```

### **Server Routes** (`frontend/src/app/api/auth/`)

- POST `/api/auth/login` — Mock login (validates email/password)
- POST `/api/auth/signup` — Mock signup (creates user record in memory)
- POST `/api/auth/reset` — Mock password reset

**Implementation:** Currently mock/in-memory (no persistent backend auth store)

---

## 2. Guest Mode

If user not logged in:
1. Auto-generate UUID
2. Store in localStorage under `chatsnp-auth-user`
3. Use UUID as `user_id` in all API calls
4. Session continues until localStorage cleared

---

## 3. Backend Authorization

**Current State:** NO token validation

**Risk:** user_id passed as query/body parameter — client-side spoofing possible

**Mitigation (Recommended):**
- Add JWT validation to `/sessions` endpoints
- Verify `user_id` in token matches request
- Add role-based access control (RBAC) for admin endpoints

---

## 4. Department-Based Access Control

**RAG Document Access:**
```python
# User sees:
# 1. Documents they uploaded (user_id match)
# 2. Public documents from their department
# Does NOT see:
# - Other users' private documents
# - Public documents from other departments
```

**Implementation:** Filter in `_build_qdrant_filter()` during RAG search

---

# AI & LLM INTEGRATION

## 1. LLM Provider: OpenRouter

**Configuration:**

```
Base URL: https://openrouter.ai/api/v1
Model (default): openai/gpt-4o-mini
API Key: Environment variable OPENROUTER_API_KEY
```

**Used in:**
- Backend chat synthesis (RAG mode)
- Frontend Server Actions (chat mode)
- Memory consolidation (Mem0)
- SQL generation + verification (PydanticAI)
- Image description (VLM fallback)

---

## 2. Agent Modes

### **Mode 1: Chat (Default)**

**Flow:**
```
1. Frontend sends user message
2. Backend stores in Postgres + Redis cache
3. Frontend Server Action (NOT Celery):
   a. Semantic search (Qdrant + Mem0)
   b. Build context (recent msgs + summary + long-term)
   c. Call OpenRouter LLM
   d. Format response (markdown, citations)
   e. Display directly (no SSE needed)
```

**Advantages:**
- Instant feedback to user
- No task queue latency
- Lower infrastructure load

**Limitations:**
- Context size bounded by model limits
- Response time 2-5 seconds typical

---

### **Mode 2: SQL (Vanna + PydanticAI Agent)**

**Flow:**
```
1. Frontend sends question + mode=sql
2. Backend stores message (returns 201 quickly)
3. Celery worker_data task: run_sql_query
   a. Vanna.generate_sql() — Text-to-SQL with training data
   b. PydanticAI Agent loop:
      - Tool: execute_sql()
      - Tool: get_db_schema()
      - LLM verification: "Is this SQL safe/correct?"
   c. Safety check (no DROP/DELETE/ALTER)
   d. Execute query → DataFrame → Markdown table
   e. Optional: Lida chart generation if "biểu đồ" detected
   f. Optional: TTS voice if "đọc/nghe" detected
4. Save result via internal API
5. Publish to Redis Pub/Sub → SSE → frontend refresh
```

**Key Features:**
- Agentic loop with LLM verification
- Database schema context from Vanna training
- SQL safety filtering

---

### **Mode 3: RAG (Document-Aware Search + Synthesis)**

**Flow:**
```
1. Frontend sends question + mode=rag
2. Backend stores message (returns 201 quickly)
3. Celery worker_chat task: rag_document_search
   a. LLamaIndex VectorStoreIndex setup:
      - Embedding model: Vietnamese_Embedding_v2 (cached singleton)
      - Vector store: Qdrant "port_knowledge"
   b. Retrieve top-5 chunks with filters:
      - User owns chunk OR (public AND same department)
      - quality != "low" (exclude disliked chunks)
   c. Score threshold: 0.35 (discard low relevance)
   d. Build citations + context (dedup by file+page+heading)
   e. Gather unified context:
      - Long-term (Mem0): Top-5 semantic facts
      - Session summary: Auto-generated every 10 msgs
      - Recent history: Last 6 messages raw
   f. LLM synthesis with system prompt:
      - Format: Markdown tables for pricing
      - Currency: Preserve VNĐ/USD (no conversion)
      - Citations: [1], [2], ... enforced
      - Uncertainty: "chưa có thông tin, gọi 1800 1188"
   g. Sanitize output (remove model-generated junk)
   h. Append citation footer with file+page+score
   i. Save to Postgres + publish SSE
```

**Advantages:**
- Document-backed answers
- Citation tracking
- Self-correction via feedback

---

## 3. Embedding Model

**Model:** `thanhtantran/Vietnamese_Embedding_v2`

- **Dimensions:** 1024
- **Base:** BAAI/bge-m3 fine-tuned for Vietnamese
- **Loader:** HuggingFace Hub
- **Loading:** Singleton per Celery worker (loaded once, ~1.3 GB)
- **Caching:** HuggingFace cache directory mounted in Docker
- **Used For:**
  - Chunk embedding in chat + RAG
  - Query embedding for search
  - Delegated via Mem0 `/embed` endpoint

---

## 4. System Prompts

### **RAG System Prompt** (Vietnamese port authority context)

```
Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP 
(Tân Cảng Sài Gòn). Nhiệm vụ của bạn là dựa vào tài liệu được 
cung cấp để giải đáp chính xác, rõ ràng.

YÊU CẦU ĐỊNH DẠNG:
- Trả lời tự nhiên, lịch sự, đầy đủ ý nhưng không lan man
- ĐƯỢC PHÉP dùng bullet points, xuống dòng nếu thông tin dài
- Khi context chứa bảng: TRÌNH BÀY LẠI THÀNH BẢNG MARKDOWN
- Giữ nguyên đơn vị tiền tệ gốc (VNĐ, USD). Không làm tròn, không đổi
- Trích dẫn nguồn bằng [1], [2]... vào cuối câu/đoạn
- TUYỆT ĐỐI KHÔNG BỊA SỐ LIỆU. Nếu không đề cập → "chưa có 
  thông tin, liên hệ 1800 1188"
```

### **SQL Agent System Prompt**

```
You are a SQL Expert for ChatSNP Vietnamese Port System.
Your goal is to provide a valid, safe, and efficient SQL query.

Rules:
1. Only SELECT queries allowed
2. No DROP, DELETE, INSERT, UPDATE, ALTER
3. Use Vietnamese for explanations
4. If a query fails, use tools to inspect schema and fix it
```

### **Memory Consolidation Prompt** (Nightly Gardener)

```
Bạn là hệ thống quản lý bộ nhớ. Phân tích danh sách facts:
1. Tìm facts TRÙNG LẶP hoặc MÂU THUẪN
2. Gán importance_score (1-10):
   - Port operations: 8-10
   - Personal info: 3-5
   - Social: 1-2
3. Trả lời dạng JSON
```

---

## 5. Temperature & Token Settings

| Model | Temperature | Max Tokens | Use Case |
|-------|-------------|-----------|----------|
| RAG synthesis | 0.3 | 1500 | Deterministic, faithful retrieval |
| SQL agent | 0.1 | 500 | Strict SQL generation |
| Session summary | 0.1 | 300 | Consistency |
| Memory consolidation | 0.0 | 500 | Absolute accuracy |
| Image description | 0.5 | 1500 | VLM understanding |

---

# MEMORY SYSTEM (MEM0)

## 1. Mem0 Service

**Location:** `mem0-service/main.py`  
**Port:** 8888 (exposed in docker-compose)  
**Architecture:** FastAPI wrapper around Mem0 library

### **Configuration:**

```python
Memory.from_config({
    "version": "v1.1",
    "vector_store": {
        "provider": "qdrant",
        "config": {
            "host": "qdrant",
            "port": 6333,
            "collection_name": "mem0_memories",  # Long-term facts
            "embedding_model_dims": 1024
        }
    },
    "llm": {
        "provider": "openai",  # or openrouter
        "config": {
            "model": "openai/gpt-4o-mini",
            "api_key": OPENROUTER_API_KEY,
            "base_url": "https://openrouter.ai/api/v1"
        }
    },
    "embedder": {
        "provider": "huggingface",
        "config": {
            "model": "AITeamVN/Vietnamese_Embedding_v2",  # 1024 dims
            "embedding_dims": 1024
        }
    },
    "history_db_path": "/app/history/history.db"
})
```

---

## 2. Mem0 REST API Endpoints

### **Embedding**

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/embed` | `{"text": str}` | `{"vector": [float; 1024]}` |

---

### **Memory CRUD**

| Method | Path | Body/Params | Response |
|--------|------|-------------|----------|
| POST | `/memories` | MemoryCreate (messages, user_id, metadata) | `{"status": "ok", "memory_id": str}` |
| GET | `/memories?user_id=` | user_id | `{"memories": [Memory]}` |
| POST | `/search` | SearchQuery (query, user_id, limit) | `{"results": [SearchResult]}` |
| PUT | `/memories/{id}` | Updated memory data | `{"status": "ok"}` |
| DELETE | `/memories/{id}` | — | `{"status": "ok"}` |
| POST | `/reset` | — | `{"status": "ok"}` (resets entire Mem0) |

---

## 3. Dual-Memory Architecture

```
LONG-TERM (Mem0)
├─ Qdrant collection: mem0_memories
├─ 1024-dim vectors via Vietnamese_Embedding_v2
├─ Stored: LLM-extracted semantic facts
├─ Examples:
│  - "User works in cargo department"
│  - "Prefers English over Vietnamese"
│  - "Previously asked about container pricing"
├─ Retrieved: Semantic search + Mem0 LLM understanding
└─ Refresh: Nightly consolidation (dedup, importance scoring)

SHORT-TERM (Qdrant chat_chunks)
├─ Qdrant collection: chat_chunks
├─ 1024-dim vectors
├─ Stored: Verbatim message text from session
├─ Examples:
│  - User: "What is 20ft container price?"
│  - Assistant: "20ft container is 1.230.000 VNĐ"
├─ Retrieved: Vector similarity + content match
└─ Retention: Until session deleted or 1-hour cache expires
```

---

## 4. Memory Storage Pipeline

**Trigger:** When user sends message > 10 characters

**Task:** `store_memory()` (Celery, chat_priority queue)

```
POST {MEM0_URL}/memories {
    "messages": [{"role": "user|assistant", "content": text}],
    "user_id": user_id,
    "metadata": {
        "session_id": session_id,
        "department": department
    }
}
```

**Mem0 Processing:**
1. LLM reads message
2. Extracts semantic facts
3. Embeds facts via Vietnamese_Embedding_v2
4. Stores in Qdrant (mem0_memories collection)
5. Indexes with importance weights

---

## 5. Memory Consolidation (Nightly Gardener)

**Scheduled:** Daily at 2:00 AM (Celery Beat)  
**Task:** `consolidate_memories()` (gardener_tasks.py)

**Process:**
```
For each user_id:
  1. Fetch all memories: GET {MEM0_URL}/memories?user_id={uid}
  2. Call LLM to analyze:
     - Identify duplicates
     - Assign importance_score (1-10)
     - Flag contradictions
  3. Apply consolidations:
     - Merge duplicates (keep best, delete duplicates)
     - Update importance_score on Mem0 records
     - Prioritize high-value facts in future retrieval
```

**Importance Mapping:**
- Port operations (pricing, rules, specs): 8-10
- Personal preferences (language, style): 3-5
- Social chit-chat (greetings, banter): 1-2

---

## 6. Semantic Search (Combined)

**Endpoint:** POST `/sessions/search`

**Implementation:**

```python
async def semantic_search(query: SearchQuery):
    # 1. Embed query via Mem0
    query_vector = await embed_text(query.query)
    
    # 2. Search Qdrant chat_chunks (short-term)
    qdrant_results = qdrant_client.search(
        collection_name="chat_chunks",
        query_vector=query_vector,
        limit=5,
        score_threshold=0.35,
        query_filter=build_user_filter(query.user_id)
    )
    
    # 3. Search Mem0 (long-term)
    mem0_results = POST {MEM0_URL}/search {
        "query": query.query,
        "user_id": query.user_id,
        "limit": 5
    }
    
    # 4. Merge + deduplicate + re-score
    combined = convert_qdrant(qdrant_results) + convert_mem0(mem0_results)
    sorted_results = sorted(combined, key=lambda x: x.score, reverse=True)[:limit]
    
    # 5. Return top-k with highest confidence
    return sorted_results
```

---

# DATABASE SCHEMA

## Tables (PostgreSQL 16)

### **1. chat_sessions**

```sql
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE,
    user_id VARCHAR(255) INDEX,
    department VARCHAR(255),
    title VARCHAR(255),
    metadata JSON DEFAULT '{}',
        -- Contains: {"summary": "...", "message_count_at_summary": 10}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    INDEX (user_id, updated_at) -- For user session list queries
);
```

---

### **2. chat_messages**

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(32),  -- "user" | "assistant" | "system"
    content TEXT,
    metadata JSON DEFAULT '{}',
        -- Contains: {
        --   "attachments": [{"type": "chart", "url": "...", "filename": "..."}],
        --   "rag_chunk_ids": ["id1", "id2", ...],  -- For feedback tracking
        --   "mode": "chat|sql|rag"
        -- }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    INDEX (session_id, created_at)  -- For chronological message retrieval
);
```

---

### **3. chat_message_chunks**

```sql
CREATE TABLE chat_message_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    chunk_index INTEGER,  -- 0-based order within message
    content TEXT,  -- Chunk text
    vector_id VARCHAR(255),  -- Reference to Qdrant point_id
    metadata JSON DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    INDEX (message_id)
);
```

---

### **4. documents**

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) INDEX,
    filename VARCHAR(512),
    file_path VARCHAR(1024),
    status VARCHAR(32) DEFAULT 'processing',  -- "processing" | "ready" | "error"
    chunk_count INTEGER DEFAULT 0,  -- Number of chunks stored in Qdrant
    extractor_used VARCHAR(32),  -- "docling" | "vlm" | "whisper_local"
    error_message TEXT,
    metadata JSON DEFAULT '{}',
        -- Contains: {
        --   "preview_pdf_path": "...",
        --   "page_count": int,
        --   "table_count": int,
        --   "deep_meta": {...}
        -- }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    INDEX (user_id, filename)  -- For duplicate detection
);
```

---

### **5. message_feedbacks**

```sql
CREATE TABLE message_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    is_liked BOOLEAN,  -- true = 👍, false = 👎
    reason VARCHAR(255),  
        -- "sai số liệu" | "thiếu trích dẫn" | "không liên quan" | "khác"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    INDEX (message_id)
);
```

---

## Qdrant Collections

### **1. chat_chunks** (Short-term session memory)

```json
{
  "collection_name": "chat_chunks",
  "vector_size": 1024,
  "distance": "Cosine",
  "payload_schema": {
    "content": "text",           // Chunk text
    "session_id": "text",        // UUID
    "message_id": "text",        // UUID
    "user_id": "text",           // user_id from chat_sessions
    "role": "text",              // "user" | "assistant"
    "department": "text",        // user's department
    "chunk_index": "integer"     // 0-based in message
  }
}
```

---

### **2. port_knowledge** (RAG document chunks)

```json
{
  "collection_name": "port_knowledge",
  "vector_size": 1024,
  "distance": "Cosine",
  "payload_schema": {
    "content": "text",           // Chunk text from document
    "source_file": "text",       // Original filename
    "document_id": "text",       // UUID from documents table
    "page_number": "integer",    // Page (estimated or from Docling)
    "user_id": "text",           // Document owner
    "department": "text",        // Department (for access control)
    "is_public": "boolean",      // Shareable across department?
    "quality": "text",           // "normal" | "low" (from feedback)
    "headings": "array",         // Document section hierarchy
    "chunk_index": "integer",    // Order in document
    "created_at": "integer"      // Unix timestamp
  }
}
```

---

### **3. mem0_memories** (Managed by Mem0 service)

```json
{
  "collection_name": "mem0_memories",
  "vector_size": 1024,
  "distance": "Cosine",
  "payload_schema": {
    "fact": "text",              // Extracted semantic fact
    "user_id": "text",           // User identifier
    "importance_score": "float", // 1-10 from consolidation
    "created_at": "integer",
    "updated_at": "integer",
    "metadata": "object"         // Custom fields from Mem0
  }
}
```

---

# API ENDPOINTS REFERENCE

## Complete Endpoint Map

### **Sessions** (`/sessions`)

```
POST   /sessions
       Create new session
       Payload: {user_id, department, title, external_id}
       Response: SessionSchema

GET    /sessions?user_id=<uid>
       List user's sessions (sorted by updated_at DESC, limit 50)
       Response: SessionSchema[]

GET    /sessions/{session_id}?limit=
       Get session with messages
       Params: limit (1-1000, default all)
       Response: SessionWithMessages {id, user_id, department, title, created_at, updated_at, messages: MessageSchema[]}

POST   /sessions/{session_id}/messages
       Add message (triggers Celery task)
       Payload: {role, content, mode?, metadata?}
       Response: MessageSchema + task_dispatched flag

GET    /sessions/{session_id}/stream
       SSE stream for real-time updates
       Response: text/event-stream

POST   /sessions/search
       Semantic search (Qdrant + Mem0)
       Payload: {query, user_id, limit}
       Response: SearchResult[]
```

### **Documents** (`/upload`)

```
POST   /upload
       Upload file
       Payload: FormData {file, user_id, department, overwrite?}
       Response: DocumentUploadResponse {id, status, filename, chunk_count}

GET    /upload?user_id=<uid>
       List user's documents
       Response: DocumentSchema[]

GET    /upload/{doc_id}/status
       Check processing progress
       Response: {status, chunk_count, error?, page_count?}

GET    /upload/{doc_id}/download
       Download/preview file
       Response: FileResponse (file bytes)

DELETE /upload/{doc_id}/cancel
       Cancel + delete document + Qdrant chunks
       Response: {message}

GET    /upload/find-by-name?filename=<name>
       Find document by exact filename
       Response: DocumentSchema or 404
```

### **Feedback** (`/feedback`)

```
POST   /feedback
       Submit like/dislike on message
       Payload: {message_id, is_liked, reason?}
       Response: FeedbackResponse {id, message_id, is_liked, reason, message}
```

### **Text-to-Speech** (`/tts`)

```
POST   /tts
       Convert text to speech
       Payload: {text (1-2000 chars), voice?}
       Response: audio/mpeg stream
```

### **Admin** (`/admin`)

```
POST   /admin/train/ddl
       Train Vanna with SQL DDL
       Payload: {ddl, documentation?}
       Response: {status, message}

GET    /admin/sessions?limit=&user_id=
       List all sessions (admin view)
       Params: limit (1-1000), user_id (optional filter)
       Response: AdminSessionSummary[]

GET    /admin/sessions/{session_id}/messages
       Get all messages in session (admin view)
       Response: MessageSchema[]

GET    /admin/redis/cache?session_id=
       View Redis cache contents
       Response: RedisCacheResponse {entries, key_count}

GET    /admin/qdrant/collections
       List Qdrant collections + stats
       Response: QdrantCollectionSchema[]

GET    /admin/qdrant/search?collection=&query=&limit=
       Search a Qdrant collection directly
       Response: QdrantPointSchema[]
```

---

# CELERY TASK QUEUE SYSTEM

## Overview

**Broker:** Redis (redis://redis:6379/0)  
**Result Backend:** Redis  
**Workers:** 3 specialized containers with different queues  
**Task Routing:** Based on message.mode or task type

---

## Queue Configuration

### **Queue 1: chat_priority** (High Priority)

**Workers:** `worker_chat` (concurrency=2)

**Tasks:**
1. `process_chat_response` — Chunk + embed + store session messages
2. `store_memory` — Save long-term facts to Mem0
3. `rag_document_search` — RAG search + LLM synthesis
4. `process_feedback` — Self-correction (mark chunks as low-quality)
5. `summarize_session_history` — Auto-summary every 10 messages

**Dispatch Trigger:**
- User sends message in "rag" mode → rag_document_search
- User sends message in any mode → process_chat_response (async)
- User sends message + length > 10 → store_memory (async)
- Every 10 messages → summarize_session_history
- User dislikes message → process_feedback

---

### **Queue 2: data_batch** (Medium Priority)

**Workers:** `worker_data` (concurrency=2)

**Tasks:**
1. `run_sql_query` — Vanna text-to-SQL + PydanticAI verification + chart generation
2. `sync_data` — Data synchronization (placeholder, not implemented)

**Dispatch Trigger:**
- User sends message in "sql" mode → run_sql_query

---

### **Queue 3: media_process** (Low Priority)

**Workers:** `worker_media` (concurrency=1)

**Tasks:**
1. `process_document` — Docling deep extraction + embedding + Qdrant storage
2. `transcribe_audio` — Faster-Whisper speech-to-text
3. `generate_chart` — Lida chart generation from DataFrame
4. `text_to_speech` — Edge-TTS voice synthesis

**Dispatch Trigger:**
- File uploaded → process_document
- Audio file uploaded → transcribe_audio
- SQL query result + "biểu đồ" keyword → generate_chart
- SQL result + "đọc/nghe" keyword → text_to_speech

---

## Task Signatures & Implementations

### **process_chat_response**

```python
@celery_app.task(bind=True, max_retries=3)
def process_chat_response(
    self,
    session_id: str,
    message_id: str,
    content: str,
    role: str,
    user_id: str | None = None,
    department: str | None = None
) -> dict[str, Any]:
    """
    Chunk message → Embed chunks → Upsert to Qdrant chat_chunks
    Returns: {"status": "ok", "message_id": message_id, "chunks": count}
    """
```

**Steps:**
1. Smart chunk (512 tokens, 50 overlap)
2. Embed via Mem0 API (parallel with ThreadPoolExecutor, 8 workers)
3. Store in Qdrant with payload (session_id, message_id, user_id, role)
4. Return chunk count

---

### **store_memory**

```python
@celery_app.task(bind=True, max_retries=3)
def store_memory(
    self,
    user_id: str,
    content: str,
    role: str,
    session_id: str,
    department: str | None = None
) -> dict[str, Any]:
    """
    Save long-term fact to Mem0
    Returns: {"status": "ok"}
    Timeout: 300s (Mem0 LLM processing can be slow)
    """
```

**Steps:**
1. POST to Mem0 `/memories` endpoint
2. Mem0 LLM extracts semantic facts
3. Stores in mem0_memories Qdrant collection

---

### **rag_document_search**

```python
@celery_app.task(bind=True, max_retries=2)
def rag_document_search(
    self,
    question: str,
    session_id: str,
    user_id: str,
    department: str | None = None
) -> dict[str, Any]:
    """
    RAG pipeline: Search documents + synthesize answer
    Returns: {"status": "ok", "session_id": session_id}
    Sends result via SSE (Redis Pub/Sub) to frontend
    """
```

**Steps:**
1. Setup LlamaIndex + Qdrant vector store
2. Search with filters (user owns chunk OR public+same department)
3. Score threshold 0.35
4. Build context (Mem0 long-term + session summary + recent)
5. LLM synthesis with RAG system prompt
6. Sanitize output
7. Append citations
8. Save to DB via internal API
9. Publish to Redis: `session:{session_id}` → frontend SSE

---

### **run_sql_query**

```python
@celery_app.task(bind=True, max_retries=2)
def run_sql_query(
    self,
    question: str,
    session_id: str,
    user_id: str,
    department: str | None = None
) -> dict[str, Any]:
    """
    SQL generation + verification loop
    Returns: {"status": "ok", "session_id": session_id}
    Sends result via SSE to frontend
    """
```

**Steps:**
1. Vanna.generate_sql(question) — Text-to-SQL with training data
2. PydanticAI agent loop:
   - Tool execute_sql() — Try query
   - Tool get_db_schema() — Inspect schema if error
   - LLM: "Is this SQL safe/correct?" (tools available)
3. Safety filter: No DROP/DELETE/ALTER/TRUNCATE
4. Execute query → DataFrame
5. Convert to Markdown table
6. Optional: Lida chart if "biểu đồ" in question
7. Optional: TTS if "đọc/nghe" in question
8. Save + publish SSE

---

### **process_document**

```python
@celery_app.task(bind=True, max_retries=2)
def process_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None
) -> dict[str, Any]:
    """
    Docling deep processing: Extract → Chunk → Embed → Store Qdrant
    Returns: {"status": "ok", "document_id": id, "chunk_count": count}
    """
```

**Steps (by file type):**
- **Images (.jpg/.png):**
  1. VLM (gpt-4o-mini): Describe image
  2. Smart chunk description
  3. Embed + store to Qdrant port_knowledge
  
- **Other documents:**
  1. Docling DocumentConverter
  2. Extract tables, text, structure
  3. AdaptiveTableSerializer (Markdown or triplet format)
  4. HybridChunker (768 tokens, heading prefix)
  5. Group-lock same-row chunks
  6. Smart chunk each chunk
  7. Embed via Mem0 (parallel, 8 workers)
  8. Upsert to Qdrant port_knowledge
  
- **Audio (.mp3/.wav/.m4a/.aac):**
  1. Faster-Whisper transcription
  2. Smart chunk transcription text
  3. Embed + store to Qdrant

4. Update document status to "ready"
5. Return chunk count

---

### **process_feedback**

```python
@celery_app.task(bind=True)
def process_feedback(
    self,
    message_id: str,
    is_liked: bool,
    reason: str | None = None
) -> dict[str, Any]:
    """
    Mark RAG chunks as low-quality for self-correction
    Returns: {"status": "ok", "chunks_marked": count}
    """
```

**Steps:**
1. If is_liked=True: No action (reserved for ranking)
2. If is_liked=False:
   - Get message metadata (may contain rag_chunk_ids)
   - For each chunk ID: Set Qdrant payload quality="low"
   - Fallback: Embed message, find similar chunks, mark if score > 0.7
3. Return count of marked chunks

---

### **summarize_session_history**

```python
@celery_app.task(bind=True)
def summarize_session_history(
    self,
    session_id: str
) -> dict[str, Any]:
    """
    Auto-summarize session every 10 messages
    Returns: {"status": "ok", "summary": text}
    Stores in: ChatSession.metadata["summary"]
    """
```

**Steps:**
1. Get all messages in session
2. Call LLM with summary prompt (temp=0.1)
3. Save summary to session.metadata
4. Update message_count_at_summary

---

### **consolidate_memories** (Scheduled, Celery Beat)

```python
@celery_app.task(bind=True)
def consolidate_memories(self) -> dict[str, Any]:
    """
    Nightly gardener: Dedup facts, assign importance scores
    Scheduled: 2:00 AM daily
    Returns: {"status": "ok", "users_processed": count}
    """
```

**Steps:**
1. Get all user IDs
2. For each user:
   - Fetch all memories from Mem0
   - Call LLM: Identify duplicates, assign importance_score
   - Merge duplicates (update keep, delete duplicates)
   - Prioritize high scores for future retrieval
3. Log results

---

## Task Completion & SSE Notification

**Flow (for Celery tasks):**

```
Celery Task (rag_document_search, run_sql_query, etc.)
  ↓
1. Save result to database
2. Call: publish_task_complete(session_id)
  ↓
3. publish_task_complete() publishes to Redis:
   redis.publish(f"session:{session_id}", json.dumps({
       "event": "message_ready",
       "session_id": session_id
   }))
  ↓
4. Frontend SSE listener (/sessions/{id}/stream) receives message
5. Frontend refreshes message list (GET /sessions/{id})
6. New message appears in chat
```

---

# DATA FLOW DIAGRAMS

## 1. Chat Mode (Direct LLM)

```
┌─────────────────────────────────────────────────────────────┐
│ User Types Question in Chat                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─→ Frontend sends: POST /sessions/{id}/messages
                 │                   {"role": "user", "content": "...", "mode": "chat"}
                 │
                 ├─→ Backend:
                 │    ├─ Create DB record
                 │    ├─ Update Redis cache
                 │    ├─ Dispatch process_chat_response (Celery async)
                 │    ├─ Dispatch store_memory (Celery async)
                 │    └─ Return 201 + message_id
                 │
                 ├─→ Frontend Server Action getHelp():
                 │    ├─ Semantic search (Qdrant + Mem0)
                 │    ├─ Build context blocks
                 │    ├─ Call OpenRouter LLM
                 │    ├─ Format response (markdown)
                 │    └─ Display directly (no polling)
                 │
                 └─→ [MEANWHILE] Celery workers:
                      ├─ process_chat_response: Chunk + embed + store to Qdrant
                      └─ store_memory: Save to Mem0 long-term
```

**Latency:** 2-5 seconds (LLM call time)

---

## 2. RAG Mode (Document Search)

```
┌──────────────────────────────────────────────────────────────┐
│ User Types Question + Selects "Tài liệu" (RAG) Mode          │
└────────────┬───────────────────────────────────────────────┘
             │
             ├─→ POST /sessions/{id}/messages
             │   {"role": "user", "content": "...", "mode": "rag"}
             │
             ├─→ Backend:
             │    ├─ Create DB record
             │    ├─ Dispatch rag_document_search (Celery chat_priority)
             │    └─ Return 201 + task_dispatched=true
             │
             ├─→ Frontend:
             │    ├─ Display user message immediately
             │    ├─ Show "Thinking..." indicator
             │    └─ Open SSE stream: GET /sessions/{id}/stream
             │
             ├─→ [WORKER] rag_document_search task:
             │    ├─ Setup LlamaIndex + Qdrant
             │    ├─ Search "port_knowledge" with filters:
             │    │   - User owns OR (public + same department)
             │    │   - quality != "low"
             │    │   - Score >= 0.35
             │    ├─ Top-5 chunks → dedup citations
             │    ├─ Gather unified context:
             │    │   - Mem0: Long-term facts
             │    │   - Session summary
             │    │   - Recent 6 messages
             │    ├─ LLM synthesis (temp=0.3, max=1500)
             │    ├─ Sanitize output
             │    ├─ Append citation footer
             │    ├─ Save assistant message to DB
             │    └─ publish_task_complete(session_id)
             │
             └─→ Frontend SSE listener:
                  ├─ Receive: {"event": "message_ready", "session_id": "..."}
                  ├─ Close SSE stream
                  ├─ GET /sessions/{id} to fetch updated messages
                  └─ Display assistant message + citations
```

**Latency:** 5-15 seconds (search + LLM synthesis)

---

## 3. SQL Mode (Text-to-SQL)

```
┌──────────────────────────────────────────────────────────────┐
│ User Types SQL Question + Selects "Dữ liệu" (SQL) Mode       │
└────────────┬───────────────────────────────────────────────┘
             │
             ├─→ POST /sessions/{id}/messages
             │   {"role": "user", "content": "...", "mode": "sql"}
             │
             ├─→ Backend:
             │    ├─ Create DB record
             │    ├─ Dispatch run_sql_query (Celery data_batch)
             │    └─ Return 201 + task_dispatched=true
             │
             ├─→ Frontend:
             │    ├─ Display user message
             │    ├─ Show "Thinking..." + "Generating query..."
             │    └─ Open SSE stream
             │
             ├─→ [WORKER] run_sql_query task:
             │    ├─ Vanna.generate_sql(question)
             │    ├─ PydanticAI agent loop:
             │    │   ├─ Tool execute_sql(sql)
             │    │   ├─ If error: Tool get_db_schema()
             │    │   ├─ LLM: "Fix this SQL"
             │    │   └─ Retry
             │    ├─ Safety filter (no DROP/DELETE/ALTER)
             │    ├─ Execute → DataFrame
             │    ├─ Convert to Markdown table
             │    ├─ If "biểu đồ": generate_chart (Lida)
             │    ├─ If "đọc/nghe": generate_tts
             │    ├─ Save result message to DB
             │    └─ publish_task_complete(session_id)
             │
             └─→ Frontend SSE listener:
                  ├─ Receive "message_ready"
                  ├─ Fetch updated messages
                  └─ Display Markdown table (+ chart + audio if applicable)
```

**Latency:** 5-20 seconds (SQL generation + execution)

---

## 4. Document Upload & Processing

```
┌────────────────────────────────────────────────────────────┐
│ User Selects File + Clicks Upload                          │
└────────────┬──────────────────────────────────────────────┘
             │
             ├─→ Frontend:
             │    ├─ POST /upload (FormData: file, user_id, dept)
             │    └─ Backend creates Document record (status=processing)
             │
             ├─→ Backend:
             │    ├─ Save file to /app/media/uploads/
             │    ├─ Dispatch process_document (Celery media_process)
             │    └─ Return 201 + document_id
             │
             ├─→ Frontend (polling):
             │    └─ GET /upload/{doc_id}/status every 2s
             │
             ├─→ [WORKER] process_document task:
             │    ├─ Branch by file type:
             │    │   ├─ Image (.jpg/.png):
             │    │   │   ├─ VLM description
             │    │   │   ├─ Chunk description
             │    │   │   └─ Embed + store Qdrant
             │    │   │
             │    │   ├─ Audio (.mp3/.wav):
             │    │   │   ├─ Faster-Whisper transcription
             │    │   │   ├─ Chunk text
             │    │   │   └─ Embed + store Qdrant
             │    │   │
             │    │   └─ Other (PDF/DOCX/XLSX):
             │    │       ├─ Docling extraction
             │    │       ├─ Table serialization (Markdown or triplet)
             │    │       ├─ HybridChunker (768 tokens, heading prefix)
             │    │       ├─ Smart chunk
             │    │       ├─ Parallel embed (Mem0, 8 workers)
             │    │       └─ Upsert to port_knowledge
             │    │
             │    ├─ Update document status → "ready"
             │    └─ Return chunk_count
             │
             └─→ Frontend polling:
                  ├─ Detects status=ready
                  ├─ Stop polling
                  └─ Show file in document sidebar
```

**Latency:** 10-60 seconds (depends on file size + Docling processing)

---

## 5. Feedback Loop (Self-Correction)

```
┌────────────────────────────────────────────────────────┐
│ User Clicks 👎 (Dislike) on Assistant Message          │
└────────────┬─────────────────────────────────────────┘
             │
             ├─→ Frontend:
             │    ├─ Show feedback reason selector
             │    ├─ User picks reason: "sai số liệu", etc.
             │    ├─ POST /feedback {message_id, is_liked=false, reason}
             │    └─ Backend saves MessageFeedback record
             │
             ├─→ Backend:
             │    ├─ Create feedback record
             │    ├─ Dispatch process_feedback (Celery chat_priority)
             │    └─ Return 201
             │
             ├─→ [WORKER] process_feedback task:
             │    ├─ Get message metadata
             │    ├─ Find rag_chunk_ids stored at generation time
             │    ├─ For each chunk:
             │    │   └─ qdrant.set_payload(collection="port_knowledge",
             │    │          payload={"quality": "low", "dislike_reason": reason})
             │    │
             │    ├─ [FALLBACK] If no stored IDs:
             │    │   ├─ Embed message text
             │    │   ├─ Similarity search port_knowledge
             │    │   ├─ If score > 0.7: mark as quality=low
             │    │
             │    └─ Return chunks_marked count
             │
             └─→ Future RAG searches:
                  └─ Filter excludes chunks with quality="low"
```

---

# CURRENT LIMITATIONS & KNOWN ISSUES

## 🚩 Security Issues

1. **No Backend Auth** — user_id passed as parameter, not validated with JWT
   - **Risk:** Client-side spoofing possible
   - **Recommended Fix:** Add JWT validation to all `/sessions` endpoints

2. **CORS Allow-All** — Exception handler allows `*` origins in dev
   - **Risk:** Bypass of CORS in production
   - **Recommended Fix:** Restrict to specific domain in production

3. **No Rate Limiting** — APIs can be flooded
   - **Recommended Fix:** Add Slowapi or similar

---

## ⚠️ Feature Gaps

1. **sync_data Task** — Placeholder, not implemented
   - **Current:** Returns `{"status": "ok"}` without doing anything
   - **Impact:** Data synchronization feature unavailable

2. **Kreuzberg Service** — Possibly legacy, may be unused
   - **Current:** Imported in dependencies but no active usage found
   - **Recommended:** Investigate & remove if obsolete

3. **Password Reset** — Mock implementation in frontend only
   - **Current:** No real backend password reset flow
   - **Recommended Fix:** Integrate email-based reset (e.g., Brevo, SendGrid)

---

## 📊 Performance Considerations

1. **Embedding Model Loading** — ~1.3 GB per worker
   - **Mitigation:** Singleton per process (loads once)
   - **Risk:** First task in worker is slow (model warmup)

2. **Parallel Embedding** — Uses ThreadPoolExecutor with 8 workers
   - **Risk:** High CPU usage for large files
   - **Mitigation:** Consider reducing to 4 on resource-constrained environments

3. **Redis Caching** — 1-hour TTL, append-only updates
   - **Risk:** Cache misses on idle sessions
   - **Optimization:** Consider session pre-loading based on user activity

4. **Mem0 API Calls** — Timeout 300 seconds for store_memory
   - **Risk:** Blocking if Mem0 service is slow
   - **Monitoring:** Watch Mem0 latency in production

---

## 🔄 Celery Issues

1. **Task Retry Logic** — Max 3 retries with exponential backoff (2^N)
   - **Risk:** Failed tasks stuck in dead-letter queue
   - **Monitoring:** Monitor flower for failed tasks

2. **No Dead Letter Queue** — Failed tasks after retries are discarded
   - **Recommended:** Implement DLQ with manual retry mechanism

3. **Task Timeout Not Set** — Potential for long-running tasks
   - **Risk:** Memory leaks if tasks don't complete
   - **Recommended:** Add task_time_limit to Celery config

---

## 🗄️ Database Issues

1. **No Alembic Migrations** — Schema changes manual
   - **Recommended:** Implement Alembic for version control

2. **No Connection Pooling Tuning** — May not scale well
   - **Recommended:** Tune pool_size, max_overflow based on load

3. **Cascade Deletes** — May cause cascading deletes if not careful
   - **Risk:** Accidental data loss
   - **Mitigation:** Soft deletes for documents recommended

---

## 🧠 Mem0 Issues

1. **Graph Store Disabled** — `enable_graph = False` to avoid JSON parsing issues
   - **Risk:** Knowledge graph features unavailable
   - **Monitoring:** Watch for Mem0 update that fixes this

2. **Single Vector Store** — All memories in one Qdrant collection
   - **Scalability:** May degrade with 100K+ facts per user
   - **Recommended:** Partition by department or user cohorts

---

## 📝 Logging & Monitoring

1. **No Structured Logging** — Using standard Python logging
   - **Recommended:** Switch to JSON logging (e.g., python-json-logger)

2. **No Distributed Tracing** — Hard to track requests across services
   - **Recommended:** Integrate OpenTelemetry

3. **Flower Dashboard** — Only basic task monitoring
   - **Recommended:** Add Prometheus metrics + Grafana dashboards

---

## 🌐 Frontend Issues

1. **Authentication Bypass** — LocalStorage-based auth can be disabled
   - **Recommended:** Implement secure session cookies (httpOnly)

2. **No CSRF Protection** — Server Actions don't validate CSRF tokens
   - **Recommended:** Add CSRF middleware (Next.js built-in: experimental.serverActions.allowedOrigins)

3. **File Upload Size Limit** — No client-side validation
   - **Recommended:** Add max file size check before upload

4. **SSE Connection Restart** — Manual refresh needed if connection drops
   - **Recommended:** Implement auto-reconnect with exponential backoff

---

## 🎯 Model Configuration

1. **Single LLM Model** — Hardcoded gpt-4o-mini
   - **Consideration:** May want cheaper model for non-critical tasks
   - **Recommended:** Implement model fallback chain

2. **Embedding Model Fixed** — Vietnamese_Embedding_v2 always used
   - **Consideration:** Difficult to A/B test other models
   - **Recommended:** Make embedding model pluggable

---

## 📦 Dependencies

1. **Many Unused Dependencies** — Check if kreuzberg, lida always needed
   - **Recommended:** Audit imports, remove unused packages

2. **No Version Pinning** — package.json/pyproject.toml use `^` ranges
   - **Risk:** Breaking changes in minor/patch versions
   - **Recommended:** Pin exact versions for production

---

## 🔍 Testing

1. **No Tests** — No test files found in `backend/tests/` or `frontend/__tests__/`
   - **Recommended:** Implement pytest for backend, Jest for frontend

2. **No Integration Tests** — End-to-end flows untested
   - **Recommended:** Add Docker Compose-based integration tests

---

## 🚀 Deployment

1. **Cloudflare Tunnel Token Hardcoded** — In docker-compose.yml
   - **Risk:** Token exposed if repo public
   - **Recommended:** Move to secrets manager (GitHub Actions Secrets, Vault)

2. **No Health Checks** — Only basic container startup checks
   - **Recommended:** Implement `/health` endpoint with dependency checks

3. **No Graceful Shutdown** — Services may lose in-flight messages
   - **Recommended:** Add shutdown hooks, drain queues before exit

---

## 📱 Frontend UX

1. **No Offline Support** — No service worker or offline caching
   - **Recommended:** Implement offline mode with sync on reconnect

2. **No Message Search** — Only semantic search across sessions
   - **Recommended:** Add full-text search within current session

3. **No Message Editing** — Once sent, can't modify
   - **Recommended:** Add "Edit message" feature with version history

---

# SUMMARY

**ChatSNP** is a feature-rich Vietnamese port authority chatbot with sophisticated memory, RAG, and SQL agent capabilities. The architecture is production-ready with Docker containerization, async task queues, and monitoring. However, security (auth), testing, and observability need strengthening before production deployment.

**Recommended Priority Fixes:**
1. ✅ Implement JWT auth + token validation
2. ✅ Add rate limiting
3. ✅ Implement proper password reset flow
4. ✅ Add comprehensive test suite
5. ✅ Structured logging + distributed tracing
6. ✅ Secure credential management (remove hardcoded tokens)
7. ✅ Health check endpoints with dependency monitoring

---

**Last Updated:** 2026-04-13  
**Scope:** Complete analysis of all services, endpoints, and data flows  
**Confidence:** High (verified against actual codebase)

