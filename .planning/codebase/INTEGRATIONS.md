# ChatSNP - External Integrations

## Overview
ChatSNP integrates with multiple external APIs, services, and data sources to enable AI-driven chat, RAG, SQL generation, document processing, and media synthesis capabilities.

---

## LLM & AI Model Providers

### OpenAI / OpenRouter
**Purpose**: Primary LLM for chat responses, SQL generation, and agentic tasks

**Configuration**:
- **Backend location**: `src/core/config.py` (lines 22-25)
- **API Keys**: 
  - `OPENAI_API_KEY` - OpenAI direct API key (fallback)
  - `OPENROUTER_API_KEY` - OpenRouter alternative provider
- **Base URLs**:
  - Default: `https://openrouter.ai/api/v1`
  - Fallback: OpenAI direct (`https://api.openai.com/v1`)
- **Default Model**: `openai/gpt-4o-mini`
- **Environment Variables**:
  - `.env`: `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`
  - Backend config: `openai_base_url`, `llm_model`

**Usage Points**:
1. **Vanna SQL Generation** (`src/core/vanna_setup.py`, lines 73-84)
   - LLM used for natural language → SQL conversion
   - Schema: Postgres database
   
2. **Pydantic AI Agent** (`src/worker/data_tasks.py`, lines 26-53)
   - SQL validation and refinement
   - Tool calling for database schema inspection
   - Model: `OpenAIModel` with `OpenAIProvider`
   
3. **Chat Response Processing** (via Celery)
   - Backend processes LLM calls for response generation
   
4. **Document Descriptions** (VLM for images, `src/worker/media_tasks.py`)
   - Used when processing image files

5. **Mem0 Service** (memory long-term storage)
   - Configured in `/mem0-service/` with same LLM keys
   - Embedding model: HuggingFace
   - LLM provider: OpenRouter/OpenAI

6. **Frontend AI Integration** (Next.js)
   - **Genkit AI** (`@genkit-ai/googleai`)
   - OpenAI client library for client-side operations

---

## HuggingFace

### Embedding Model Repository
**Purpose**: Source for Vietnamese language embeddings

**Model Used**: `AITeamVN/Vietnamese_Embedding_v2`
- **Dimension**: 1024
- **Base Model**: BAAI/bge-m3 (tuned for Vietnamese)
- **Sequence Length**: 2048 tokens max

**Integration Points**:
1. **Mem0 Service** (`mem0-service/.env.example`)
   - Environment variable: `HF_TOKEN` (for authentication)
   - `EMBEDDER_PROVIDER: huggingface`
   - `EMBEDDER_MODEL: AITeamVN/Vietnamese_Embedding_v2`

2. **Backend Chat Tasks** (`src/worker/chat_tasks.py`, lines 30-50)
   - LlamaIndex HuggingFace embedding provider
   - Cached per Celery worker process
   - Parallel embedding via ThreadPoolExecutor

3. **Backend Media Tasks** (`src/worker/media_tasks.py`)
   - Document chunk embedding via ThreadPoolExecutor
   - Parallel requests to Mem0 `/embed` endpoint

4. **Qdrant Collections** (unified 1024-dim embedding strategy)
   - `port_knowledge`: Document chunks
   - `chat_chunks`: Session history
   - `mem0_memories`: Long-term memory
   - `vanna_schemas_openai`: SQL schema embeddings

**Cache Location**: `/root/.cache/huggingface` (mounted as `huggingface-cache` volume)

---

## Databases & Data Stores

### PostgreSQL
**Purpose**: Primary relational database for chat sessions, messages, documents, and metadata

**Configuration**:
- **Docker Image**: `postgres:16`
- **Container**: `chatsnp-postgres`
- **Port**: 5432 (internal)
- **Connection String**: `postgresql+asyncpg://{user}:{password}@postgres:5432/{database}`
- **Async Driver**: asyncpg (>=0.29.0)

**Tables** (via SQLAlchemy ORM in `src/models/models.py`):
- `chat_session` - Chat sessions per user/department
- `message` - Messages in sessions (user/assistant/system roles)
- `document` - Uploaded documents with processing status
- Additional metadata tables

**Volumes**: `postgres-data` (persistent storage)

**Health Check**: `pg_isready` command

**Access Paths**:
- `src/core/db.py` - Database engine, async session factory
- `src/core/database_pool.py` - Connection pooling
- `src/repositories/` - Data access layer
- `src/models/models.py` - ORM models

### Redis
**Purpose**: Session cache, Celery message broker, real-time data

**Configuration**:
- **Docker Image**: `redis:7-alpine`
- **Container**: `chatsnp-redis`
- **Port**: 6379 (default)
- **Connection String**: `redis://redis:6379/0`
- **Persistence**: RDB snapshots (AOF: save 60 1)

**Usage**:
1. Celery broker URL: `redis://redis:6379/0`
2. Celery result backend: `redis://redis:6379/1`
3. Session/query caching
4. Real-time chat state

**Environment Variables**:
- `REDIS_URL` (primary connection)
- `CELERY_BROKER_URL` (Celery broker)

**Volumes**: `redis-data` (persistent)

**Health Check**: `redis-cli ping`

**Access Path**: `src/core/redis_client.py`

### Qdrant Vector Database
**Purpose**: Vector storage for embeddings (RAG retrieval, memory, SQL schema)

**Configuration**:
- **Docker Image**: `qdrant/qdrant:latest`
- **Container**: `chatsnp-qdrant`
- **HTTP Port**: 6333 (API, port 6333 in Docker)
- **gRPC Port**: 6334 (optional)
- **Base URL**: `http://qdrant:6333`

**Collections**:
1. **`port_knowledge`** (1024-dim, Vietnamese embeddings)
   - Document chunks from Docling
   - Payloads: text, source_file, page_number, user_id, document_id, headings, row_keys
   - Filterable by: user_id, department, quality (via feedback)

2. **`chat_chunks`** (1024-dim)
   - Session message chunks for conversation history retrieval
   - Payloads: content, session_id, message_id, user_id, role, department

3. **`mem0_memories`** (1024-dim, managed by Mem0 service)
   - Long-term memory points for users
   - Managed via Mem0 SDK

4. **`vanna_schemas_openai`** (1024-dim)
   - SQL schema embeddings for semantic SQL generation
   - Managed by Vanna

**Volumes**: `qdrant-data` (persistent)

**Health Check**: TCP connection to port 6333

**Access Paths**:
- `src/core/qdrant_setup.py` - Qdrant client initialization
- Query/upsert operations in Celery tasks
- `src/api/upload.py` - Document chunk management

---

## Document Processing & AI Services

### Docling (by IBM/Luxonis)
**Purpose**: Advanced document understanding and chunking

**File Support**:
- PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT
- Markdown, plain text, CSV
- Images: JPG, PNG (with VLM fallback)

**Features**:
- Table detection and adaptive serialization
- Semantic chunking via HybridChunker
- Page structure and heading recognition
- VLM (Vision Language Model) for image analysis

**Integration**:
- **Service Location**: `src/services/docling_service.py`
- **Task**: `process_document` (Celery, media_process queue)
- **Input**: File path
- **Output**: Extracted markdown, chunks, tables, metadata

**Configuration Environment Variables** (`.env`):
- `DOCLING_CHUNK_MAX_TOKENS` (default: 768) - chunk size limit
- `DOCLING_CHUNK_MERGE_PEERS` (default: true) - merge adjacent chunks
- `DOCLING_TABLE_MARKDOWN_MAX_COLS` (default: 4) - max columns for Markdown tables
- `DOCLING_TABLE_MARKDOWN_MAX_CELLS` (default: 36) - max cells for Markdown tables
- `DOCLING_TABLE_GROUP_KEY_HINTS` - column name hints for grouping (Vietnamese: `type,category,item,service,description,name,code,id,loai,muc,dich vu`)
- `DOCLING_TABLE_NORMALIZE_VALUES` (default: true) - normalize currency/units
- `DOCLING_PREFIX_HEADING_ROWKEY` (default: true) - add heading prefix to chunks
- `DOCLING_GROUP_LOCK_ENABLED` (default: true) - prevent splitting grouped rows
- `DOCLING_GROUP_LOCK_MAX_CHARS` (default: 2800) - max characters in grouped chunks

**PPTX Conversion**:
- Uses LibreOffice subprocess call: `libreoffice --headless --convert-to pdf`
- Generates preview PDF for presentation files

**Access Path**: `/src/worker/media_tasks.py` (lines 18-114)

### Vanna (by Vanna)
**Purpose**: Natural language to SQL generation and database querying

**Configuration**:
- **LLM Backend**: OpenAI/OpenRouter
- **Vector Store**: Qdrant
- **Database**: PostgreSQL (via asyncpg)
- **Embedding Model**: HuggingFace Vietnamese_Embedding_v2 (via Mem0 `/embed`)

**Custom Implementation**: `CustomVanna` class (`src/core/vanna_setup.py`, lines 28-57)
- Extends Qdrant_VectorStore and OpenAI_Chat
- Uses Mem0 service for unified embedding generation
- Lazy initialization (only when first called)

**Collections**: `vanna_schemas_openai` (1024-dim Qdrant)

**Access Path**: `src/core/vanna_setup.py` (get_vanna() singleton)

**Usage**:
- SQL Agent in `src/worker/data_tasks.py`
- Pydantic AI tools for schema inspection and SQL execution

### Lida (by Microsoft Research)
**Purpose**: Automatic chart generation from query results

**Integration**:
- **Service Location**: `src/services/lida_service.py`
- **Input**: User question + DataFrame
- **Output**: Chart SVG/PNG (stored in `/app/media/charts/`)
- **LLM**: Uses backend LLM configuration (OpenRouter/OpenAI)

**Keywords Trigger**: User question contains chart-related terms (Vietnamese: `biểu đồ, vẽ, chart, graph, đồ thị, trực quan`)

**Conditional Execution**: Only generates if SQL query succeeded (domino protection)

**Access Path**: `/src/worker/data_tasks.py` (lines 148-162)

### Faster Whisper (by OpenAI)
**Purpose**: Speech-to-text transcription for audio uploads

**File Support**: MP3, WAV, M4A, AAC

**Integration**:
- **Task**: `transcribe_audio` (Celery, media_process queue)
- **Input**: Audio file path
- **Output**: Transcribed text → embedded and stored in Qdrant

**Access Path**: `/src/worker/media_tasks.py` (media tasks section)

### Edge-TTS (Microsoft)
**Purpose**: Text-to-speech synthesis with Vietnamese voice

**Configuration**:
- **Default Voice**: `vi-VN-HoaiMyNeural` (Vietnamese)
- **Output Format**: MP3
- **Response**: Streaming audio/mpeg

**Conditional Execution**: Only synthesizes if SQL query succeeded (domino protection)

**Keywords Trigger**: User question contains audio-related terms (Vietnamese: `đọc, nghe, giọng, voice, audio, phát`)

**Integration**:
- **Endpoint**: `/tts` (POST)
- **Location**: `src/api/tts.py`
- **Library**: `edge_tts` module

**Access Path**: `/src/api/tts.py` (lines 20-54)

---

## Memory & State Management

### Mem0
**Purpose**: Long-term memory service for user context retention

**Service Container**: `mem0` (custom Docker image from `./mem0-service/`)

**Port**: 8888 (internal), exposes as `http://mem0:8000` for internal service communication

**REST API Endpoints**:
1. **POST `/embed`** - Generate embeddings
   - Input: `{"text": string}`
   - Output: `{"vector": [float...]}`
   - Used by all embedding tasks

2. **POST `/memories`** - Store long-term memory
   - Input: `{"messages": [], "user_id": string, "metadata": {}}`
   - Output: Memory stored with Qdrant collection `mem0_memories`

**Configuration** (`.env` in mem0-service):
- `QDRANT_HOST`, `QDRANT_PORT`, `QDRANT_COLLECTION`
- `EMBEDDER_PROVIDER: huggingface`
- `EMBEDDER_MODEL: AITeamVN/Vietnamese_Embedding_v2`
- `EMBEDDING_DIM: 1024`
- `LLM_PROVIDER: openai` or `openrouter`
- `LLM_MODEL: openai/gpt-4o-mini`
- `OPENAI_API_KEY`, `OPENAI_BASE_URL` (or OpenRouter equivalents)
- `HF_TOKEN` - HuggingFace token for model downloads
- `HISTORY_DB_PATH: /app/history/history.db` - SQLite history
- `HF_HOME: /root/.cache/huggingface` - Model cache directory

**Integration Points**:
1. **Chat Tasks** (`src/worker/chat_tasks.py`)
   - `process_chat_response` task embeds chat chunks
   - `store_memory` task saves memories to Mem0 `/memories` endpoint

2. **Document Processing** (`src/worker/media_tasks.py`)
   - All document chunks embedded via Mem0 `/embed`

3. **Vanna Setup** (`src/core/vanna_setup.py`)
   - Custom embedding generation via Mem0

**Access Path**: 
- `src/core/mem0_config.py` - Async HTTP client
- `src/core/http_client.py` - Shared HTTP client (30s timeout)

**Dependencies**: `mem0ai` Python package

---

## Search & Web Integration

### Tavily Search API
**Purpose**: Web search integration for RAG enhancement

**Library**: `tavily-python` (>=0.3.5)

**Potential Usage**: Referenced in backend dependencies for search enhancement in agentic workflows

**Note**: May be used in future versions for live search integration in chat responses

---

## Authentication & Frontend Services

### Firebase
**Purpose**: Frontend authentication (potential/configured)

**Configuration** (`.env` frontend):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: departmental-chat.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID: departmental-chat`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

**Status**: Configured but may not be actively used in current backend (no backend Firebase integration found)

**Note**: Frontend-only configuration; backend uses basic user_id for session management

---

## Networking & Public Access

### Cloudflare Tunnel
**Purpose**: Public internet access without port forwarding

**Configuration**:
- **Docker Service**: `cloudflared` (latest Docker image)
- **Container**: `chatsnp_cloudflared`
- **Token**: Stored in docker-compose.yml (tunnel token)

**Command**: 
```bash
cloudflared tunnel --no-autoupdate run --token {token}
```

**Usage**:
1. Quick Tunnel (development): `cloudflared tunnel --url http://localhost:3000`
2. Named Tunnel (production): Custom domain via Cloudflare Dashboard

**Frontend URL Forwarding**: Typically routes port 3000 (frontend)

**Backend URL Forwarding** (optional): Can add separate tunnel for port 8000 (backend API)

---

## Data & Analytics

### Monitoring & Observability

**Flower** (Celery Monitoring UI)
- Port: 5555
- Container: `chatsnp-flower`
- Displays: Celery task statistics, worker status, queue depth
- Access: `http://localhost:5555`

**Logging**:
- Each service outputs logs to stdout (Docker)
- Aggregated via `docker compose logs`
- Python logging module configured per service

---

## API Connections & Webhooks

### Backend-Frontend Communication
**Protocol**: HTTP/REST over CORS

**Endpoints** (backend, port 8000):
- `/sessions` - Chat session management
- `/sessions/{id}/messages` - Message operations
- `/upload` - Document upload and management
- `/tts` - Text-to-speech synthesis
- `/feedback` - User feedback and correction
- `/admin` - Administration endpoints

**Frontend Rewrite Rule** (Next.js):
```typescript
source: '/api/backend/:path*'
destination: `${BACKEND_INTERNAL_URL}/:path*`
```
- Development: `http://localhost:8000`
- Docker: `http://backend:8000`

**Media Access**:
- `/media/charts/` - Generated charts
- `/media/tts/` - Generated audio
- `/media/uploads/` - User documents

### Celery Task Queues
**Broker**: Redis at `redis://redis:6379/0`

**Queues**:
1. `chat_priority` - Real-time chat tasks
2. `data_batch` - SQL and data sync
3. `media_process` - Document and media processing

**Workers**: Docker Compose containers `worker_chat`, `worker_data`, `worker_media`

**Communication**: Redis message passing

---

## External Service Dependencies Summary

| Service | Type | Purpose | Status |
|---------|------|---------|--------|
| OpenAI / OpenRouter | LLM API | Chat & SQL generation | **Required** |
| HuggingFace | Model Hub | Vietnamese embeddings | **Required** |
| PostgreSQL | Database | Data persistence | **Required** |
| Redis | Cache/Broker | Session cache, Celery | **Required** |
| Qdrant | Vector DB | Embeddings storage | **Required** |
| Mem0 | Service | Long-term memory | **Required** |
| Docling | Library | Document processing | **Required** |
| Vanna | Library | SQL generation | **Required** |
| Lida | Library | Chart generation | **Optional** (chat) |
| Faster Whisper | Library | Speech-to-text | **Optional** (audio upload) |
| Edge-TTS | Library | Text-to-speech | **Optional** (audio output) |
| Tavily | API | Web search | **Optional** (future) |
| Firebase | Service | Frontend auth | **Configured** |
| Cloudflare | Tunnel | Public access | **Configured** |

---

## Configuration Environment Overview

**Global Configuration Files**:
- `/chatSNP170226/.env` - Shared environment variables
- `/chatSNP170226/backend/.env` - Backend-specific overrides
- `/chatSNP170226/frontend/.env.local` - Frontend dev environment
- `/chatSNP170226/mem0-service/.env` - Mem0 service configuration

**Key Variables Across Services**:
```
Database:
  DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

Cache/Broker:
  REDIS_URL, CELERY_BROKER_URL

Vector Store:
  QDRANT_URL, QDRANT_HOST, QDRANT_PORT, QDRANT_COLLECTION

Memory:
  MEM0_URL, EMBEDDER_MODEL, EMBEDDING_DIMENSION

LLM:
  OPENAI_API_KEY, OPENAI_BASE_URL, OPENROUTER_API_KEY, LLM_MODEL

Embeddings:
  HF_TOKEN, EMBEDDING_MODEL, EMBEDDING_DEVICE

Document Processing:
  DOCLING_* (chunk settings, table serialization)

Frontend:
  NEXT_PUBLIC_BACKEND_URL, BACKEND_INTERNAL_URL, Firebase credentials
```

---

## Integration Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Radix UI + Tailwind CSS                                  │  │
│  │ ├─ Chat Interface                                        │  │
│  │ ├─ Document Upload (Docling)                             │  │
│  │ ├─ TTS/Transcription (Edge-TTS, Whisper)                │  │
│  │ └─ Chart Visualization (Recharts)                        │  │
│  │ Firebase Auth (configured)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │ HTTPS / REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Routers                                              │  │
│  │ ├─ /sessions (chat persistence)                          │  │
│  │ ├─ /upload (document management)                         │  │
│  │ ├─ /tts (text-to-speech)                                │  │
│  │ └─ /feedback (user corrections)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────┬──────────────┬───────────────┬─────────────────────────┬──┘
     │              │               │                         │
     ▼              ▼               ▼                         ▼
┌────────────┐ ┌─────────┐ ┌──────────────┐         ┌─────────────┐
│PostgreSQL  │ │  Redis  │ │   Qdrant     │         │  Mem0       │
│(sessions,  │ │(cache,  │ │(embeddings)  │         │ (long-term  │
│ messages,  │ │ broker) │ │              │         │  memory)    │
│ documents) │ │         │ │ Collections: │         │             │
│            │ │         │ │ • port_knw   │         │ ┌─────────┐ │
│            │ │         │ │ • chat_chnks │         │ │Mem0 API:│ │
│            │ │         │ │ • mem0_mem   │         │ │/embed   │ │
│            │ │         │ │ • vanna_sql  │         │ │/memories│ │
│            │ │         │ │              │         │ └─────────┘ │
└────────────┘ └─────────┘ └──────────────┘         │             │
                                                    │ HF Model:   │
                                                    │ Vietnamese_ │
                                                    │ Embedding_v2│
                                                    │ (1024-dim)  │
                                                    └─────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Celery Workers                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Queue: chat_priority                                     │  │
│  │ ├─ process_chat_response (embedding)                    │  │
│  │ ├─ store_memory (Mem0)                                  │  │
│  │ ├─ rag_document_search (Qdrant)                         │  │
│  │ └─ process_feedback (quality tuning)                    │  │
│  │                                                          │  │
│  │ Queue: data_batch                                        │  │
│  │ ├─ run_sql_query (Vanna + LangGraph)                    │  │
│  │ │  ├─ Vanna (PostgreSQL + Qdrant)                       │  │
│  │ │  ├─ Pydantic AI Agent (OpenRouter/OpenAI)             │  │
│  │ │  ├─ Lida (chart generation)                           │  │
│  │ │  └─ Edge-TTS (voice synthesis)                        │  │
│  │ └─ sync_data (data sync)                                │  │
│  │                                                          │  │
│  │ Queue: media_process                                     │  │
│  │ ├─ process_document (Docling → embedding)              │  │
│  │ ├─ transcribe_audio (Whisper)                          │  │
│  │ ├─ generate_chart (Lida)                               │  │
│  │ └─ text_to_speech (Edge-TTS)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│              External AI Services (Optional / Alt.)              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ LLM Providers                                            │  │
│  │ • OpenAI (https://api.openai.com/v1)                     │  │
│  │ • OpenRouter (https://openrouter.ai/api/v1)             │  │
│  │                                                          │  │
│  │ Embedding Provider                                       │  │
│  │ • HuggingFace Hub (Vietnamese_Embedding_v2)             │  │
│  │                                                          │  │
│  │ Optional Services                                        │  │
│  │ • Tavily Search API (web search integration)             │  │
│  │ • Firebase (frontend auth)                              │  │
│  │ • Cloudflare Tunnel (public access)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Notes

1. **Unified Embedding Strategy**: All services (Docling, chat, memory, SQL) use the same 1024-dim Vietnamese embedding model via Mem0 `/embed` endpoint for consistency.

2. **Conditional Processing**: Lida chart and Edge-TTS tasks only execute if SQL query succeeds ("domino protection") to avoid generating outputs for error messages.

3. **Database-First Architecture**: PostgreSQL is the source of truth for chat sessions and documents; Qdrant provides vector similarity, Redis enables real-time operations.

4. **Async Throughout**: Backend uses async/await with httpx for external HTTP calls, enabling high concurrency in Celery workers.

5. **Multi-Provider LLM**: Supports both OpenAI and OpenRouter APIs with fallback; configured via environment variables at runtime.
