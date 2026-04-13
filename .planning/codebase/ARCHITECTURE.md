# ChatSNP Architecture Document

## 1. System Overview

ChatSNP is a **microservices-lite full-stack application** with long-term memory capabilities, built on a modern distributed architecture. The system separates concerns into specialized services, each handling distinct responsibilities:

- **Frontend**: Next.js 15 SPA with TypeScript and TailwindCSS
- **Backend**: FastAPI REST API for chat persistence and business logic
- **AI Memory Service**: Mem0-based service for long-term user memory and embeddings
- **Infrastructure**: PostgreSQL, Redis, Qdrant vector database, Celery for background tasks

### Key Features
- Real-time chat with asynchronous processing
- Long-term user memory through Mem0 (semantic extraction)
- Short-term message recall via Qdrant vector search
- Document upload with intelligent table extraction (Docling)
- Vietnamese language support with specialized embeddings
- RAG (Retrieval-Augmented Generation) capabilities

---

## 2. Architectural Patterns & Layers

### 2.1 High-Level Data Flow

```
User Request → Frontend (Next.js)
    ↓
REST API Call (HTTP POST)
    ↓
Backend (FastAPI)
    ├─→ Immediate Response (201 Created)
    └─→ Background Task Dispatch (Celery)
        ├─→ Embedding Service (Mem0)
        │   └─→ Qdrant Vector Store (chat_chunks)
        ├─→ Memory Service (Mem0)
        │   └─→ Qdrant Vector Store (mem0_memories)
        └─→ PostgreSQL (Persistence)

User Query → Frontend
    ↓
Backend RAG Pipeline
    ├─→ Query Qdrant (short-term - exact message recall)
    ├─→ Query Mem0 (long-term - context & user profile)
    └─→ Synthesize Results → LLM (OpenRouter/OpenAI)
        ↓
    Response → Frontend → User
```

### 2.2 Layered Architecture

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (Frontend)        │
│  Next.js App Router, React Components       │
│  Server Actions, API Routes                 │
└─────────────────────────────────────────────┘
                     ↑↓
┌─────────────────────────────────────────────┐
│       API Gateway Layer (Backend)            │
│  FastAPI Routers (Chat, Upload, Admin)      │
│  Request/Response Validation (Pydantic)     │
│  CORS Middleware, Exception Handling        │
└─────────────────────────────────────────────┘
                     ↑↓
┌─────────────────────────────────────────────┐
│       Business Logic Layer (Services)        │
│  ChatService, DoclingService, TTSService    │
│  RAG Pipeline, Memory Operations            │
│  LLM Integration, Vector Search             │
└─────────────────────────────────────────────┘
                     ↑↓
┌─────────────────────────────────────────────┐
│      Data Access Layer (Repositories)        │
│  Session/Message/Document CRUD              │
│  Vector Store Operations (Qdrant)           │
│  Memory Store Operations (Mem0)             │
│  Caching Layer (Redis)                      │
└─────────────────────────────────────────────┘
                     ↑↓
┌─────────────────────────────────────────────┐
│      Persistence Layer (Databases)           │
│  PostgreSQL (Relational Data)               │
│  Qdrant (Vector Data)                       │
│  Redis (Cache)                              │
└─────────────────────────────────────────────┘
```

### 2.3 Component Breakdown

#### **Frontend (`/frontend`)**
- **Entry Point**: `src/app/layout.tsx` → Root layout with Auth & Language providers
- **Pages**: 
  - `src/app/page.tsx` → Landing page
  - `src/app/chat/page.tsx` → Main chat interface
  - `src/app/admin/page.tsx` → Admin dashboard
  - `src/app/login/page.tsx`, `src/app/signup/page.tsx` → Auth pages
- **Server Actions**: `src/app/actions.ts` → Secure backend communication
- **Components**: `src/components/` → Reusable UI components (auth, chat, sidebar, etc.)
- **Services**: 
  - `src/services/chat-backend.ts` → Chat API client
  - `src/services/auth-service.ts` → Authentication logic
  - `src/services/admin-backend.ts` → Admin API client
  - `src/services/file-parser.ts` → File processing utilities
- **Hooks**: `src/hooks/` → Custom React hooks for state management
- **AI Integration**: `src/ai/dev.ts` → Genkit AI development server

#### **Backend (`/backend/src`)**

**Core Components**:
- **`main.py`**: FastAPI application factory with lifecycle management
- **`api/`**: Route handlers
  - `chat.py` → Chat session/message endpoints
  - `upload.py` → Document upload & processing
  - `admin.py` → Admin operations
  - `feedback.py` → User feedback collection
  - `tts.py` → Text-to-speech endpoints
  - `deps.py` → Dependency injection

- **`services/`**: Business logic
  - `chat_service.py` → Core chat operations, session management
  - `docling_service.py` → Document parsing with intelligent chunking
  - `lida_service.py` → Data visualization via LIDA
  - `tts_service.py` → Text-to-speech synthesis
  - `kreuzberg_service.py` → Specialized service stub

- **`models/`**: ORM models
  - `models.py` → SQLAlchemy models (ChatSession, ChatMessage, ChatMessageChunk, Document, etc.)

- **`repositories/`**: Data access layer
  - `sessions.py` → Session CRUD operations
  - `messages.py` → Message CRUD operations

- **`core/`**: Infrastructure & configuration
  - `config.py` → Settings management (Pydantic BaseSettings)
  - `db.py` → SQLAlchemy async engine & session factory
  - `redis_client.py` → Redis connection manager
  - `qdrant_setup.py` → Qdrant client initialization
  - `mem0_config.py` → Mem0 client configuration
  - `celery_config.py` → Celery worker configuration
  - `http_client.py` → HTTP client for external APIs
  - `database_pool.py` → Connection pool management
  - `vanna_setup.py` → Vanna SQL agent setup

- **`worker/`**: Asynchronous task processing (Celery)
  - `celery_app.py` → Celery application instance
  - `chat_tasks.py` → Chat-related background tasks (embedding, memory extraction)
  - `data_tasks.py` → Data processing tasks
  - `media_tasks.py` → Media generation tasks (charts, audio)
  - `gardener_tasks.py` → Maintenance tasks
  - `helpers.py` → Task utility functions

- **`schemas/`**: Pydantic request/response models
  - `schemas.py` → All API schemas (SessionCreate, MessageCreate, SearchResult, etc.)

#### **Mem0 Service (`/mem0-service`)**
- **`main.py`**: FastAPI wrapper around Mem0 library
- **Endpoints**:
  - `POST /embed` → Convert text to embeddings
  - `POST /add` → Add to long-term memory
  - `POST /search` → Search memory store
  - `GET /memory/{user_id}` → Retrieve user memories

**Configuration**:
- Embedding Model: `AITeamVN/Vietnamese_Embedding_v2` (1024 dimensions)
- Vector Store: Qdrant (collection: `mem0_memories`)
- LLM: OpenRouter or OpenAI for memory extraction
- History: SQLite at `/app/history/history.db`
- Cache: HuggingFace model cache at `/root/.cache/huggingface`

---

## 3. Data Flow & Processing Patterns

### 3.1 Message Creation Flow (Sync + Async)

```
POST /sessions/{session_id}/messages
├─ (Sync) Store message in PostgreSQL immediately
├─ (Sync) Return 201 Created to frontend (<100ms)
└─ (Async) Background task chain:
   ├─ Task 1: Extract & embed message text
   │  ├─ Call Mem0 POST /embed
   │  └─ Store embeddings in PostgreSQL (ChatMessageChunk)
   ├─ Task 2: Store short-term recall vectors
   │  └─ Insert into Qdrant `chat_chunks` collection
   └─ Task 3: Extract long-term memory (if content > 10 chars)
      ├─ Call Mem0 POST /add with message context
      ├─ Mem0 uses LLM to extract insights
      └─ Qdrant stores in `mem0_memories` collection
```

**Async Architecture**:
- Uses Celery with Redis broker
- **Queues**:
  - `chat_priority` → High-priority chat tasks
  - `data_batch` → Data processing (documents, etc.)
  - `media_process` → Media generation (charts, audio)
- **Retry Strategy**: Exponential backoff (tenacity library)

### 3.2 Search & RAG Pipeline

```
GET /sessions/{session_id}/search?query=...
├─ Parallel search:
│  ├─ Qdrant search `chat_chunks` (exact message recall)
│  │  └─ Semantic similarity on recent conversation
│  └─ Mem0 search `mem0_memories` (user profile & context)
│     └─ Long-term facts about user
├─ Merge & rank results
├─ Concatenate as context
└─ POST to LLM (OpenRouter) with system prompt + context
   └─ Return generated response
```

### 3.3 Document Processing Pipeline

```
POST /upload
├─ Store metadata in PostgreSQL (Document table)
├─ Detect MIME type (file-type library)
├─ Route to appropriate processor:
│  ├─ PDF → Docling
│  ├─ DOCX → Docling (via mammoth.js in frontend)
│  ├─ XLS/CSV → Docling + pivot logic
│  └─ Other → Store as-is
├─ (Async) Docling extraction:
│  ├─ Parse document structure
│  ├─ Extract tables with adaptive chunking
│  ├─ Apply group-lock for related chunks
│  ├─ Add heading context prefixes
│  └─ Generate embeddings via Mem0
└─ (Async) Store chunks in:
   ├─ PostgreSQL (ChatMessageChunk with document metadata)
   └─ Qdrant (vector search collection)
```

**Docling Configuration** (tunable via env vars):
- `DOCLING_CHUNK_MAX_TOKENS: 768` → Sweet spot for Vietnamese text
- `DOCLING_TABLE_MARKDOWN_MAX_COLS: 4` → Keep small tables as Markdown
- `DOCLING_TABLE_MARKDOWN_MAX_CELLS: 36` → Threshold for triplet conversion
- `DOCLING_GROUP_LOCK_ENABLED: true` → Prevent table row fragmentation
- `DOCLING_PREFIX_HEADING_ROWKEY: true` → Add context before chunking

---

## 4. Technology Stack & Dependencies

### Backend
- **Framework**: FastAPI 0.100+
- **ORM**: SQLAlchemy 2.0 (async)
- **Database**: PostgreSQL 16 (asyncpg driver)
- **Cache**: Redis 7
- **Vector DB**: Qdrant
- **Task Queue**: Celery with Redis broker
- **AI Services**:
  - Mem0 (long-term memory)
  - OpenRouter/OpenAI LLM API
  - HuggingFace embeddings (Vietnamese_Embedding_v2)
  - Docling (document parsing)
  - LIDA (data visualization)
  - OpenAI TTS
- **Utilities**:
  - Pydantic (validation)
  - tenacity (retry logic)
  - python-dotenv (config)

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3.4 + Radix UI components
- **State Management**: React hooks + Context API
- **Forms**: React Hook Form + Zod validation
- **API Client**: Native fetch (server actions)
- **Document Viewer**: react-doc-viewer
- **Charts**: Recharts
- **File Processing**: 
  - xlsx (Excel parsing)
  - pdf-parse & pdfjs-dist (PDF parsing)
  - mammoth (DOCX parsing)
  - file-type (MIME detection)
- **UI Components**: Radix UI + shadcn/ui
- **AI**: Genkit SDK for frontend AI features

### Infrastructure
- **Containers**: Docker + Docker Compose
- **Orchestration**: Docker Compose (dev/staging)
- **Logging**: Python logging + Celery Flower (monitoring)
- **Networking**: Custom Docker network, exposed ports

---

## 5. Key Abstractions & Design Patterns

### 5.1 Service Abstraction

**Chat Service** (`src/services/chat_service.py`):
```python
class ChatService:
    async def create_session() → ChatSession
    async def list_sessions() → List[ChatSession]
    async def add_message() → ChatMessage
    async def semantic_search() → List[SearchResult]
```

This abstracts all chat logic, allowing the API layer to remain thin.

### 5.2 Repository Pattern

**Message Repository** (`src/repositories/messages.py`):
```python
class MessageRepository:
    async def create() → ChatMessage
    async def get_by_session() → List[ChatMessage]
    async def search_by_vector_id() → ChatMessage
```

Separates data access from business logic, making tests easier.

### 5.3 Dependency Injection

FastAPI's `Depends()` for database sessions, Redis clients, config:
```python
@router.post("/messages")
async def create_message(
    payload: MessageCreate,
    db: AsyncSession = Depends(get_db_session),
    redis = Depends(get_redis),
):
```

### 5.4 Async-First Design

- All I/O operations are async (database, Redis, HTTP calls)
- Celery tasks for long-running operations (embedding, LLM calls)
- `asyncio.gather()` for parallel searches (Qdrant + Mem0)

### 5.5 Context & Memory Extraction

**Why separate Mem0 service?**
- Mem0 handles expensive operations: LLM calls for memory extraction
- Decoupled from main API, can be scaled independently
- Clean interface: Backend calls `POST /embed` and `POST /add`

---

## 6. Entry Points & Initialization

### Backend Entry Point
**`/backend/src/main.py`**:
1. Creates FastAPI app in `create_app()` factory
2. Sets up lifespan context manager (startup/shutdown)
3. Registers routers (chat, upload, admin, feedback, tts)
4. Configures CORS middleware
5. Global exception handler (never leak internal details)
6. Mounts static media directory

**Run Commands**:
```bash
# Development
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Production
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Entry Point
**`/frontend/src/app/layout.tsx`**:
1. Root layout component
2. Providers: AuthProvider, LanguageProvider
3. Global styles imported
4. Metadata configuration

**Run Commands**:
```bash
# Development
npm run dev  # Next.js dev server on :9002

# Production
npm run build && npm run start
```

### Celery Worker Entry Points
```bash
# Chat priority queue (high-throughput)
celery -A src.worker.celery_app worker -Q chat_priority -c 2

# Data batch processing
celery -A src.worker.celery_app worker -Q data_batch -c 1

# Media processing (charts, TTS)
celery -A src.worker.celery_app worker -Q media_process -c 1

# Flower monitoring dashboard
celery -A src.worker.celery_app flower --port 5555
```

### Mem0 Service Entry Point
**`/mem0-service/main.py`**:
1. Initializes Mem0 library with config
2. Connects to Qdrant for vector storage
3. Exposes REST API endpoints for embedding & memory operations
4. HuggingFace model cached locally at startup

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 7. Configuration & Environment

### Configuration Management
**`/backend/src/core/config.py`**:
- Uses Pydantic `BaseSettings` for type-safe config
- Environment variables override defaults
- Critical vars: DATABASE_URL, REDIS_URL, QDRANT_URL, LLM_MODEL, API_KEYS

### Key Environment Variables
| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection |
| `REDIS_URL` | `redis://redis:6379/0` | Redis broker |
| `QDRANT_URL` | `http://qdrant:6333` | Vector store |
| `MEM0_URL` | `http://mem0:8000` | Memory service |
| `OPENROUTER_API_KEY` | (required) | LLM API key |
| `LLM_MODEL` | `openai/gpt-4o-mini` | Default LLM |
| `EMBEDDER_MODEL` | `AITeamVN/Vietnamese_Embedding_v2` | Embedding model |
| `DOCLING_CHUNK_MAX_TOKENS` | `768` | Document chunk size |

---

## 8. Performance & Scalability Considerations

### Optimization Strategies
1. **Async-First**: All I/O non-blocking
2. **Background Processing**: Long-running tasks via Celery
3. **Parallel Queries**: `asyncio.gather()` for Qdrant + Mem0 searches
4. **Caching**: Redis for chat history, HuggingFace model cache
5. **Connection Pooling**: Async SQLAlchemy connection pool
6. **Message Filtering**: Skip trivial messages (<10 chars) for memory extraction
7. **Retry Logic**: Exponential backoff prevents thundering herd

### Scaling Options
- **Horizontal**: Add more Celery workers for different queues
- **Vertical**: Increase worker concurrency (`-c` flag)
- **Database**: PostgreSQL replicas for read-heavy workloads
- **Cache**: Redis Sentinel for HA
- **Vector Store**: Qdrant cluster mode for distributed search

---

## 9. Error Handling & Observability

### Error Handling Strategy
- **Global Exception Handler**: Catches all unhandled exceptions, logs securely
- **Pydantic Validation**: Automatically returns 422 Unprocessable Entity
- **Retry Mechanism**: tenacity with exponential backoff
- **Graceful Degradation**: If Mem0 fails, fallback to short-term search

### Observability
- **Logging**: Python logging module (structured logs)
- **Monitoring**: Celery Flower for task monitoring (port 5555)
- **Database**: Query logs via SQLAlchemy
- **Metrics**: Custom Prometheus counters (optional)
- **Tracing**: Correlation IDs in request headers (optional)

---

## 10. Security Considerations

### Current Implementation
- **CORS Middleware**: Configurable allowed origins
- **Pydantic Validation**: Strict input validation
- **No Secrets in Logs**: Exception handler redacts sensitive data
- **Database**: Prepared statements (SQLAlchemy ORM)

### Production Recommendations
- **HTTPS/TLS**: Deploy behind reverse proxy (Nginx, Caddy)
- **API Authentication**: JWT tokens or OAuth2
- **Rate Limiting**: Implement token bucket or sliding window
- **SQL Injection**: Already mitigated by SQLAlchemy ORM
- **CORS**: Restrict to specific domains, remove `*`
- **Secrets Management**: Use environment variables or vault
- **Audit Logging**: Track all user actions

---

## 11. Testing & Quality

### Testing Strategy
- **Unit Tests**: Test services & repositories in isolation
- **Integration Tests**: Test API endpoints with test database
- **Load Tests**: Stress-test Celery tasks & API endpoints
- **Code Quality**: Ruff linter, type checking with mypy

### Quality Metrics
- Type coverage: 85%+ with mypy
- Code style: Ruff + Black formatting
- Docstring coverage: 80%+ for public APIs

---

## Conclusion

ChatSNP architecture is designed for **performance, scalability, and maintainability**:

✅ **Performance-First**: Async I/O, background processing, caching  
✅ **Modular**: Clear separation of concerns (services, repositories, APIs)  
✅ **Resilient**: Retry logic, graceful error handling, connection pooling  
✅ **Observable**: Logging, monitoring, structured approach  
✅ **Extensible**: Easy to add new services, processors, or AI models  

The microservices-lite approach allows independent scaling of the memory service while maintaining a cohesive user experience.
