# ChatSNP Quick Reference Card

## 🏗️ ARCHITECTURE AT A GLANCE

```
┌────────────────────────────────────────────────────────────────┐
│                  DOCKER COMPOSE SERVICES                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📦 DATA LAYER          🚀 APP LAYER        ⚙️ WORKERS        │
│  ├─ PostgreSQL 5432     ├─ Backend 8000     ├─ worker_chat    │
│  ├─ Redis 6379          └─ Frontend 3000    ├─ worker_data    │
│  └─ Qdrant 6333                             ├─ worker_media   │
│                                             └─ flower (5555)  │
│                                                                │
│  🔗 Connectivity: Cloudflare Tunnel (optional)               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 🎯 KEY CONFIGURATIONS

### Docker Compose Files
| File | Purpose | Backend URL |
|------|---------|-------------|
| `docker-compose.yml` | 🟢 Development | http://localhost:8000 |
| `docker-compose.pro.yml` | 🔴 Production | https://backendchatsnp.cntt-snp.online |
| `docker-compose.prod.yml` | 🟡 Fallback | — |

### Environment Variables (Critical)
```
POSTGRES_PASSWORD=12345678 ⚠️
POSTGRES_DB=chatsnp
REDIS_PORT=6379
QDRANT_PORT_HTTP=6333

OPENROUTER_API_KEY=sk-or-v1-xxxx ⚠️
OPENAI_API_KEY=sk-or-v1-xxxx ⚠️

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 (dev)
NEXT_PUBLIC_BACKEND_URL=https://backendchatsnp.cntt-snp.online (prod)

# Document Processing
DOCLING_CHUNK_MAX_TOKENS=2048
DOCLING_VLM_ENABLED=true
```

## 📦 DEPENDENCIES SNAPSHOT

### Frontend (Next.js 15)
```
Scripts:
  npm run dev         → Dev server on port 9002 (Turbopack)
  npm run build       → Production build
  npm run typecheck   → TypeScript validation
  npm run test        → Jest tests

Key Libraries:
  • Next.js 15 (App Router)
  • React 18 + shadcn/ui + TailwindCSS
  • PDF.js, Docx-Preview (document viewing)
  • Recharts (visualization)
  • OpenAI SDK (LLM integration)
  • Firebase (auth/config)
```

### Backend (FastAPI + Celery)
```
Python: >=3.10

Core Stack:
  • FastAPI + Uvicorn (async REST API)
  • SQLAlchemy 2.0 + asyncpg (PostgreSQL)
  • Celery + Redis (task queue)
  • Qdrant (vector database)

AI/ML:
  • OpenAI SDK (LLM via OpenRouter)
  • Vanna (SQL generation + RAG)
  • Sentence Transformers (Vietnamese embeddings)
  • Docling (document parsing)
  • PaddleOCR (scanned doc OCR)
  • Faster Whisper (audio-to-text)
  • Edge-TTS (text-to-speech)
  • LangGraph (agentic AI)
  • Mem0ai (memory management)

Search:
  • Whoosh (BM25 full-text search - hybrid with vector)
  • Qdrant (vector similarity search)

Monitoring:
  • Flower (Celery UI) - port 5555
  • Ruff linter (line-length=100)
```

## 🚀 QUICK COMMANDS

### Start Services
```bash
cd /Volumes/orical/ChatSNP/chatSNP170226

# Development
docker compose --env-file .env up -d --build

# Production  
docker compose -f docker-compose.pro.yml --env-file .env up -d --build

# View logs
docker compose logs -f backend
docker compose logs -f worker_chat
docker compose logs -f frontend

# Check status
docker compose ps

# Stop all
docker compose down
```

### Development (Local)
```bash
# Backend
cd backend
pip install -e .
python -m uvicorn src.main:app --reload

# Frontend
cd frontend
npm install
npm run dev  # runs on port 9002
```

### Testing
```bash
cd backend
pytest                    # Run all tests
pytest tests/test_chat.py # Specific test file
pytest -v --tb=short     # Verbose output
```

## 🔌 API ENDPOINTS

### Main Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/chat` | Send chat message |
| POST | `/documents/upload` | Upload document |
| GET | `/sessions/{id}/stream` | Server-Sent Events (SSE) stream |
| POST | `/sessions/{id}` | Create/manage session |
| GET | `/documents` | List documents |

### Celery Queues
| Queue | Worker | Concurrency | Purpose |
|-------|--------|-------------|---------|
| `chat_priority` | worker_chat | 2 | Chat & RAG inference |
| `data_batch` | worker_data | 2 | Batch data processing |
| `media_process` | worker_media | 1 | Document/media processing |

## 📊 PORT ALLOCATION

| Port | Service | Access |
|------|---------|--------|
| 3000 | Frontend (Next.js) | http://localhost:3000 |
| 8000 | Backend (FastAPI) | http://localhost:8000 |
| 6379 | Redis | redis://localhost:6379 |
| 6333 | Qdrant HTTP | http://localhost:6333 |
| 6334 | Qdrant gRPC | grpc://localhost:6334 |
| 5555 | Flower (Celery monitoring) | http://localhost:5555 |
| 5432 | PostgreSQL | (internal only) |

## 🔐 SECURITY CHECKLIST

- ⚠️ Default DB password `12345678` in `.env` → **CHANGE for production**
- ⚠️ API keys in plaintext → **Use secrets manager**
- ⚠️ No JWT auth yet → **Implement before production**
- ⚠️ CORS needs configuration → **Update CORS_ALLOW_ORIGINS**
- ✅ Firebase keys are public (OK for client-side)
- ✅ Qdrant supports API keys (optional but recommended)

## 📁 CRITICAL FILES

```
.env                  🔐 Secrets (DO NOT COMMIT)
.env.example          📋 Template (safe to share)
docker-compose.yml    ✅ Dev orchestration
docker-compose.pro.yml 🔴 Production orchestration
backend/pyproject.toml 📦 Python deps
frontend/package.json  📦 Node deps
backend/Dockerfile     🐳 Python container
frontend/Dockerfile    🐳 Node container
```

## 🎓 AGENT MODES (3 Ways to Query)

### 1️⃣ Chat Mode
```
User Query → OpenRouter API (gpt-4o-mini) → Mem0 Context → Response
Queue: chat_priority
```

### 2️⃣ SQL Mode (Vanna)
```
User Query → SQL Generation → PostgreSQL Execution → Visualization
```

### 3️⃣ RAG Mode
```
User Query → Vietnamese Embedding 
  ↓
  Vector Search (Qdrant) + Keyword Search (Whoosh - BM25)
  ↓
  Hybrid Results → Context Window → LLM Synthesis
Queue: chat_priority
```

## 📚 DOCUMENT PROCESSING PIPELINE

```
1. Upload → 2. Parse (Docling)
   ↓
3. Chunk (2048 tokens max) → 4. Embed (Vietnamese_Embedding_v2)
   ↓
5. Store (Qdrant) + Index (Whoosh) → 6. Ready for RAG
```

## 🛠️ CONFIGURATION PROFILES

### Development Profile
- Healthchecks: ✅ ENABLED
- Cloudflared: ✅ INCLUDED
- OCR: ❌ DISABLED
- Backend URL: localhost:8000
- Turbopack: ✅ ENABLED (fast rebuilds)

### Production Profile (docker-compose.pro.yml)
- Healthchecks: ❌ REMOVED (performance)
- Cloudflared: ❌ REMOVED
- OCR: ✅ ENABLED (PaddleOCR)
- Backend URL: https://backendchatsnp.cntt-snp.online
- Build args: optimized

## 📞 SUPPORT REFERENCES

- **CLAUDE.md** → Project rules & GSD commands
- **PROJECT_CONTEXT.md** → Full project map
- **ARCHITECTURE_ANALYSIS.md** → Detailed architecture
- **.planning/codebase/** → Deep tech docs
  - STACK.md — Tech stack details
  - CONVENTIONS.md — Code style rules
  - INTEGRATIONS.md — API integrations

---

**Last Updated**: 2026-04-15
**Project**: ChatSNP v0.1.0
**Status**: 🟢 Ready for development

