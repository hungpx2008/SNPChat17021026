# ChatSNP Project Exploration Report

## 📋 Executive Summary

**ChatSNP** is an AI-powered chatbot system for Tân Cảng Sài Gòn (Port Authority) built with:
- **Frontend**: Next.js 15 + TypeScript + shadcn/ui + TailwindCSS
- **Backend**: FastAPI + Celery + PostgreSQL + Redis + Qdrant
- **Infrastructure**: Docker Compose with 10+ services
- **AI Stack**: OpenRouter (gpt-4o-mini), Sentence Transformers (Vietnamese), Vanna (SQL generation)

---

## 1️⃣ Docker Compose Configuration

### Files Available
```
docker-compose.yml         # 🔴 Development (main, recommended)
docker-compose.pro.yml     # 🟡 Production (optimized)
docker-compose.prod.yml    # 🟡 Alternative production config
docker-compose.full.yml    # 🟢 Minimal config
```

### Services in `docker-compose.yml` (Development)

#### 📦 DATA LAYER (3 services)

| Service  | Image            | Port  | Purpose                    | Healthcheck |
|----------|------------------|-------|----------------------------|-------------|
| postgres | postgres:16      | 5432  | Relational database        | ✅ pg_isready |
| redis    | redis:7-alpine   | 6379  | Cache & Celery broker      | ✅ redis-cli ping |
| qdrant   | qdrant:latest    | 6333  | Vector database            | ✅ TCP check |

#### 🚀 APPLICATION LAYER (2 services)

| Service  | Framework | Port | Purpose                              |
|----------|-----------|------|--------------------------------------|
| backend  | FastAPI   | 8000 | REST API + WebSocket streams        |
| frontend | Next.js   | 3000 | Web UI + Server-Side Rendering      |

#### ⚙️ CELERY WORKERS (4 services)

| Service      | Queue          | Concurrency | Purpose                      |
|--------------|----------------|-------------|------------------------------|
| worker_chat  | chat_priority  | 2           | Chat inference & RAG        |
| worker_data  | data_batch     | 2           | Data processing             |
| worker_media | media_process  | 1           | Document/image/audio processing |
| flower       | Monitoring UI  | Port 5555   | Celery task monitoring      |

#### 🔗 CONNECTIVITY

| Service      | Image                   | Port | Purpose                  |
|--------------|-------------------------|------|--------------------------|
| cloudflared  | cloudflare/cloudflared  | N/A  | Tunneling to Cloudflare |

### Shared Environment Variables (YAML Anchors)

```yaml
x-common-env:
  DATABASE_URL: postgresql+asyncpg://chatsnp:12345678@postgres:5432/chatsnp
  REDIS_URL: redis://redis:6379/0
  CELERY_BROKER_URL: redis://redis:6379/0
  QDRANT_URL: http://qdrant:6333
  QDRANT_COLLECTION: mem0_memories
  BACKEND_INTERNAL_URL: http://backend:8000
  PYTHONUNBUFFERED: "1"
  WHOOSH_INDEX_DIR: /data/whoosh_index
  
  # AI Configuration
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}
  OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}
  LLM_MODEL: openai/gpt-4o-mini
  
  # Docling (Document processing)
  DOCLING_CHUNK_MAX_TOKENS: 2048
  DOCLING_TABLE_MARKDOWN_MAX_COLS: 4
  DOCLING_TABLE_MARKDOWN_MAX_CELLS: 36
  DOCLING_GROUP_LOCK_MAX_CHARS: 2800
```

### Volume Mounts

```
postgres-data    → /var/lib/postgresql/data
redis-data       → /data
qdrant-data      → /qdrant/storage
media-data       → /app/media (shared: backend + worker_media)
whoosh-index     → /data/whoosh_index (BM25 indexing)
paddle-models    → /root/.paddleocr (OCR caching)
```

### Key Differences: Dev vs Pro

| Aspect | Dev (docker-compose.yml) | Pro (docker-compose.pro.yml) |
|--------|--------------------------|------------------------------|
| Frontend Backend URL | http://localhost:8000 | https://backendchatsnp.cntt-snp.online |
| Healthchecks | ✅ Enabled on all services | ❌ Removed (performance) |
| Cloudflared | ✅ Included | ❌ Removed |
| Worker Media OCR | false | true |

---

## 2️⃣ Environment Variables

### Current .env File

**Location**: `/Volumes/orical/ChatSNP/chatSNP170226/.env` (PRODUCTION SECRETS)

Key secrets in use:
```
OPENROUTER_API_KEY: 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
OPENAI_API_KEY: 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
POSTGRES_PASSWORD: 12345678 (default)
```

### .env.example (Template)

Covers 6 main sections:

#### 1. **PostgreSQL (Database)**
```
POSTGRES_USER=chatsnp
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=chatsnp
POSTGRES_PORT=5432
```

#### 2. **Redis (Cache)**
```
REDIS_PORT=6379
```

#### 3. **Qdrant (Vector DB)**
```
QDRANT_PORT_HTTP=6333
QDRANT_PORT_GRPC=6334
QDRANT_API_KEY=secondary_security_key_here
```

#### 4. **Backend (FastAPI)**
```
DATABASE_URL: postgresql+asyncpg://...
REDIS_URL: redis://redis:6379/0
QDRANT_URL: http://qdrant:6333

# Settings
CHAT_MAX_SESSIONS: 100
CHAT_CACHE_WINDOW: 20
CHAT_CHUNK_SIZE: 512

# Docling (Document Processing)
DOCLING_CHUNK_MAX_TOKENS: 2048
DOCLING_CHUNK_MERGE_PEERS: true
DOCLING_TABLE_MARKDOWN_MAX_COLS: 4
DOCLING_TABLE_MARKDOWN_MAX_CELLS: 36
DOCLING_TABLE_GROUP_KEY_HINTS: type,category,item,service,description...
DOCLING_TABLE_NORMALIZE_VALUES: true
DOCLING_PREFIX_HEADING_ROWKEY: true
DOCLING_GROUP_LOCK_ENABLED: true
DOCLING_GROUP_LOCK_MAX_CHARS: 1800
DOCLING_VLM_ENABLED: true
DOCLING_VLM_MIN_SIZE: 300
DOCLING_VLM_MAX_IMAGES: 10
```

#### 5. **AI/LLM Services**
```
OPENAI_API_KEY: sk-or-v1-your-key
OPENAI_BASE_URL: https://openrouter.ai/api/v1
OPENROUTER_API_KEY: sk-or-v1-your-key
OPENROUTER_API_BASE: https://openrouter.ai/api/v1

# Mem0 (Local memory library)
LLM_PROVIDER: openai
LLM_MODEL: openai/gpt-4o-mini
EMBEDDER_PROVIDER: huggingface
EMBEDDER_MODEL: AITeamVN/Vietnamese_Embedding_v2 (768-dim)
QDRANT_COLLECTION: mem0_memories
HF_TOKEN: hf_your_huggingface_token
```

#### 6. **Frontend (Next.js)**
```
NEXT_PUBLIC_BACKEND_URL: http://localhost:8000
BACKEND_INTERNAL_URL: http://backend:8000 (Docker-only)

NEXT_PUBLIC_FIREBASE_API_KEY: AIzaSyCzOsRXi0-Bei87yry9WtJ1sTo4ZkOlxfY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: departmental-chat.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID: departmental-chat
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: departmental-chat.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 270173256612
NEXT_PUBLIC_FIREBASE_APP_ID: 1:270173256612:web:d4c369d06c9ac79b2b1f31
```

---

## 3️⃣ Frontend Package.json

**Location**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/package.json`

### Scripts Available

```json
{
  "dev": "next dev --turbopack -p 9002",      // Dev server (turbopack)
  "build": "next build",                       // Production build
  "start": "next start",                       // Start production server
  "lint": "next lint",                         // ESLint check
  "typecheck": "tsc --noEmit",                 // TypeScript validation
  "test": "jest"                               // Jest unit tests
}
```

### Key Dependencies (v15.3.3)

**UI Framework**:
- `next@15.3.3` (Next.js 15 with App Router)
- `react@18.3.1` + `react-dom@18.3.1`
- `@radix-ui/*` (12+ components: accordion, dialog, dropdown, tabs, etc.)
- `tailwindcss@3.4.1` + `tailwind-merge`

**Forms & Data**:
- `react-hook-form@7.54.2`
- `@hookform/resolvers@4.1.3`
- `zod@3.24.2` (schema validation)

**Document Processing**:
- `pdfjs-dist@5.4.149` (PDF viewer)
- `pdf-parse@1.1.1`
- `docx-preview@0.3.7` (Word doc preview)
- `mammoth@1.10.0` (DOCX parsing)
- `@cyntler/react-doc-viewer@1.17.1`
- `file-type@19.6.0`

**Charts & Visualization**:
- `recharts@2.15.1`

**Markdown & Rendering**:
- `react-markdown@9.0.1`
- `remark-gfm@4.0.1`

**AI/LLM**:
- `openai@5.20.2`

**Utilities**:
- `date-fns@3.6.0`
- `class-variance-authority@0.7.1`
- `clsx@2.1.1`
- `xlsx@0.18.5`
- `embla-carousel-react@8.6.0`
- `lucide-react@0.475.0`
- `patch-package@8.0.0`

---

## 4️⃣ Backend Dependencies

**Location**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/pyproject.toml`

**Python**: >=3.10

### Core Dependencies

#### Web Framework
- `fastapi[all]` — Async REST API
- `uvicorn[standard]` — ASGI server

#### Database
- `SQLAlchemy[asyncio]>=2.0.0`
- `asyncpg>=0.29.0` — PostgreSQL async driver
- `alembic>=1.13.0` — Database migrations

#### Cache & Async
- `redis>=5.0.0`
- `celery[redis]>=5.3.0` — Task queue
- `flower>=2.0.0` — Celery monitoring

#### Vector Database
- `qdrant-client>=1.9.0`

#### AI/ML Stack
- `vanna[postgres,qdrant,openai]` — SQL generation + RAG
- `openai>=1.0.0`
- `lida` — Chart generation
- `docling` — Document parsing
- `kreuzberg` — (unknown, likely internal)
- `mem0ai` — Memory service
- `langgraph` — LangChain agentic framework
- `sentence-transformers>=2.2.0` — Vietnamese embeddings
- `pydantic-ai[openai]>=0.0.14` — Pydantic agents
- `tavily-python>=0.3.5` — Web search

#### Media Processing
- `edge-tts` — Text-to-speech
- `faster-whisper>=1.0.0` — Audio-to-text
- `paddleocr>=2.7` + `paddlepaddle>=2.6` — OCR for scanned docs
- `pdf2image>=1.16`

#### Search
- `whoosh>=2.7.4` — BM25 full-text search

#### Config & Utils
- `pydantic-settings>=2.0.3`
- `python-dotenv>=1.0.0`
- `httpx>=0.27.0`
- `tenacity>=8.2.0` — Retry logic

#### Testing
- `pytest>=8.2.0`
- `pytest-asyncio>=0.23.0`
- `anyio>=4.3.0`

#### Linting
- `ruff>=0.5.0` — Fast Python linter (line-length=100)

---

## 5️⃣ Running Docker Containers

**Current Status**: ❌ Docker daemon running (ready), but **no active containers** visible.

```bash
# Check status
docker ps -a

# Start dev environment
cd /Volumes/orical/ChatSNP/chatSNP170226
docker compose --env-file .env up -d --build

# View logs
docker compose logs -f backend

# Production
docker compose -f docker-compose.pro.yml --env-file .env up -d --build
```

### Container Names
- `chatsnp-postgres`
- `chatsnp-redis`
- `chatsnp-qdrant`
- `chatsnp-backend`
- `chatsnp-frontend`
- `chatsnp-worker-chat`
- `chatsnp-worker-data`
- `chatsnp-worker-media`
- `chatsnp-flower`
- `chatsnp_cloudflared`

---

## 🔍 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│         FRONTEND (Next.js 15 - Port 3000)          │
│  ┌─────────────────────────────────────────────┐   │
│  │ • Pages: Chat, Documents, Analysis         │   │
│  │ • Real-time: SSE via /sessions/{id}/stream │   │
│  │ • UI: shadcn/ui + TailwindCSS             │   │
│  │ • Auth: localStorage only (no JWT yet)     │   │
│  └─────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────┘
             │
        HTTP │ WebSocket (SSE)
             │
┌────────────▼────────────────────────────────────────┐
│         BACKEND (FastAPI - Port 8000)               │
│  ┌─────────────────────────────────────────────┐   │
│  │ • /chat — Main chat endpoint                │   │
│  │ • /documents — Document management          │   │
│  │ • /sessions/{id}/stream — Server-Sent Events│   │
│  │ • CORS enabled for frontend                 │   │
│  └─────────────────────────────────────────────┘   │
│             │                                       │
│    ┌────────┴────────┬─────────────┬─────────┐    │
└────┼─────────────────┼─────────────┼─────────┼────┘
     │                 │             │         │
┌────▼────┐    ┌──────▼───┐  ┌─────▼────┐  ┌─▼──────┐
│PostgreSQL│    │  Redis   │  │  Qdrant  │  │Worker │
│ (SQL)    │    │  (Cache) │  │(Vectors) │  │Tasks  │
│          │    │  (Queue) │  │(RAG Data)│  │(Celery)
└──────────┘    └──────────┘  └──────────┘  └───────┘
```

### Agent Modes (3 modes)

1. **Chat Mode** (`worker_chat` queue)
   - User query → LLM inference via OpenRouter
   - Context from Mem0 (local memory)

2. **SQL Mode** (Vanna)
   - User query → SQL generation → Execute on DB

3. **RAG Mode** (`worker_chat` queue)
   - User query → Embed (Vietnamese_Embedding_v2)
   - Vector search in Qdrant
   - Hybrid search with BM25 (Whoosh)
   - LLM synthesis

### Document Processing Flow

```
Document Upload
    ↓
Docling (Parsing)
    ↓
Chunking (2048 tokens max)
    ↓
Embedding (Vietnamese_Embedding_v2)
    ↓
Store in Qdrant
    ↓
Index in Whoosh (BM25)
    ↓
Ready for RAG
```

---

## ⚡ Quick Start Commands

```bash
# Development (with Turbopack)
cd /Volumes/orical/ChatSNP/chatSNP170226
docker compose --env-file .env up -d --build

# Check services
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f worker_chat

# Stop
docker compose down

# Production
docker compose -f docker-compose.pro.yml --env-file .env up -d --build

# Celery monitoring (access at localhost:5555)
docker compose logs -f flower
```

---

## 📊 Port Mapping

| Service    | Host Port | Container Port | Purpose                |
|-----------|-----------|-----------------|------------------------|
| Frontend  | 3000      | 3000            | Next.js UI            |
| Backend   | 8000      | 8000            | FastAPI REST API      |
| Redis     | 6379      | 6379            | Cache/Queue           |
| Qdrant    | 6333      | 6333            | Vector DB (HTTP)      |
| Qdrant    | 6334      | 6334            | Vector DB (gRPC)      |
| Flower    | 5555      | 5555            | Celery monitoring     |
| PostgreSQL| 5432 (internal)              | Database             |

---

## 🔐 Security Notes

**⚠️ WARNING**: Secrets are in `.env` (not in .env.example)

- Default PostgreSQL password: `12345678` ❌ (Change in production)
- OpenRouter/OpenAI keys in plaintext ❌
- No JWT authentication yet (localStorage only)
- Firebase keys visible in frontend code (public)

**Recommendations**:
1. Use environment variables in production
2. Implement JWT token auth
3. Secure Qdrant API key
4. Use managed secrets (AWS Secrets Manager, Vault)

---

## 📁 File Structure Summary

```
/Volumes/orical/ChatSNP/chatSNP170226/
├── docker-compose.yml              ✅ Main dev config
├── docker-compose.pro.yml          🔧 Production config
├── docker-compose.prod.yml         🔧 Alternative prod
├── docker-compose.full.yml         ⚙️ Minimal
├── .env                            🔐 Secrets (production)
├── .env.example                    📋 Template
├── .env.production                 🔐 Prod secrets
├── backend/
│   ├── pyproject.toml             📦 Python dependencies
│   ├── Dockerfile                 🐳 Image build
│   ├── src/                       💻 Source code
│   └── tests/                     ✅ Test suite
├── frontend/
│   ├── package.json               📦 Node dependencies
│   ├── Dockerfile                 🐳 Image build
│   └── src/                       💻 React/Next.js code
└── docker/
    └── initdb/                    🔧 PostgreSQL init scripts
```

---

## 🎯 Next Steps

1. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Set real API keys (OpenRouter, Firebase, etc.)
   - Update CORS origins for production

2. **Build & Deploy**:
   ```bash
   docker compose --env-file .env up -d --build
   ```

3. **Monitor**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Celery: http://localhost:5555
   - Qdrant: http://localhost:6333

4. **Development**:
   - Backend: `cd backend && python -m uvicorn src.main:app --reload`
   - Frontend: `cd frontend && npm run dev`

