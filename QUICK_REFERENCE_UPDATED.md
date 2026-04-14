# ChatSNP — QUICK REFERENCE GUIDE

**Generated:** 2026-04-13  
**Full Analysis:** See `COMPREHENSIVE_ANALYSIS.md`

---

## 🚀 Quick Start

```bash
# Development
cd /Volumes/orical/ChatSNP/chatSNP170226
docker compose up -d --build

# Access
Frontend:   http://localhost:3000
Backend:    http://localhost:8000
Flower:     http://localhost:5555
Qdrant:     http://localhost:6333
```

---

## 📊 Architecture at a Glance

```
┌─ Frontend (Next.js 15) ────────────────┐
│ - Chat UI with 3 modes                 │
│ - File upload + preview                │
│ - Admin dashboard                      │
└──────┬──────────────────────────────────┘
       │ HTTP
       ▼
┌─ Backend (FastAPI) ────────────────────┐
│ - Session/message management           │
│ - Document upload handler              │
│ - SSE streaming (task completion)      │
└──────┬──────────────────────────────────┘
       │ (1) Dispatch tasks
       ▼
┌─ Celery (3 queues) ────────────────────┐
│ chat_priority:   process, store_memory │
│ data_batch:      run_sql_query         │
│ media_process:   docling, transcribe   │
└──────────────────────────────────────────┘
       │
       ├─→ PostgreSQL (session + message store)
       ├─→ Redis (cache, broker, Pub/Sub)
       ├─→ Qdrant (chat_chunks, port_knowledge)
       └─→ Mem0 (long-term semantic facts)
```

---

## 🔑 Key Services

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 3000 | React UI (Next.js) |
| **Backend** | 8000 | FastAPI REST API |
| **Mem0** | 8888 | Long-term memory service |
| **PostgreSQL** | 5432 | Session + message DB |
| **Redis** | 6379 | Cache + Celery broker |
| **Qdrant** | 6333 | Vector embeddings DB |
| **Flower** | 5555 | Task queue dashboard |

---

## 💬 3 Agent Modes

### **Mode 1: Chat** (Direct LLM)
```
User question → Server Action → Semantic search → LLM → Direct response (2-5s)
```
**Flow:** Frontend calls getHelp() → LLM synthesis → no Celery delay

### **Mode 2: RAG** (Document Search)
```
User question → Backend stores → rag_document_search (Celery) → 
  LlamaIndex retrieval → Unified context → LLM synthesis → SSE notify (5-15s)
```
**Flow:** Backend dispatches task → frontend polls via SSE → result displays

### **Mode 3: SQL** (Vanna + Agent)
```
User question → Backend stores → run_sql_query (Celery) → 
  Vanna text-to-SQL → PydanticAI verify loop → Execute → Markdown table (5-20s)
```
**Flow:** Agentic loop with LLM verification + tool access

---

## 📁 Project Structure Summary

```
chatSNP170226/
├── backend/                          # FastAPI app + Celery workers
│   ├── src/
│   │   ├── api/                     # 5 routers: chat, upload, feedback, tts, admin
│   │   ├── core/                    # DB, Redis, Qdrant, Mem0, Vanna setup
│   │   ├── services/                # Business logic: ChatService, Docling, etc.
│   │   ├── worker/                  # Celery tasks (5 files)
│   │   ├── models/                  # SQLAlchemy ORM (5 tables)
│   │   ├── repositories/            # Data access layer
│   │   └── main.py                  # FastAPI app factory
│   └── pyproject.toml               # 40+ dependencies
│
├── frontend/                         # Next.js 15 App Router
│   ├── src/
│   │   ├── app/                     # Pages: login, signup, chat, admin
│   │   ├── components/              # chat-ui, sidebar, composer, document-sidebar
│   │   ├── hooks/                   # useChat*, useFileAttachment, useSessionStream
│   │   ├── services/                # HTTP clients (chat, admin, auth)
│   │   └── lib/                     # System prompts, utils, translations
│   └── package.json                 # 30+ dependencies
│
├── mem0-service/                    # FastAPI wrapper around Mem0 library
│   └── main.py                      # /embed, /memories CRUD, /search
│
├── docker-compose.yml               # Dev: all services + hot reload
├── docker-compose.pro.yml           # Prod: clean builds
├── docker/initdb/                   # Postgres init scripts
│
├── PROJECT_CONTEXT.md               # Original overview (18 KB)
├── QUICK_REFERENCE.md               # Previous quick ref
├── ARCHITECTURE_ANALYSIS.md         # Previous deep dive (29 KB)
└── COMPREHENSIVE_ANALYSIS.md        # **NEW: Complete analysis (65 KB)**
```

---

## 🔌 API Endpoints (Quick List)

### **Sessions** (`/sessions`)
- POST `/sessions` — Create session
- GET `/sessions?user_id=` — List user sessions
- GET `/sessions/{id}` — Get session with messages
- POST `/sessions/{id}/messages` — Add message (triggers Celery)
- GET `/sessions/{id}/stream` — SSE: real-time updates
- POST `/sessions/search` — Semantic search

### **Documents** (`/upload`)
- POST `/upload` — Upload file (async processing)
- GET `/upload?user_id=` — List documents
- GET `/upload/{id}/status` — Check progress
- DELETE `/upload/{id}/cancel` — Delete document + chunks
- GET `/upload/{id}/download` — Download/preview

### **Feedback & TTS**
- POST `/feedback` — Like/dislike message (triggers self-correction)
- POST `/tts` — Text-to-speech (synchronous)

### **Admin** (`/admin`)
- POST `/admin/train/ddl` — Train Vanna
- GET `/admin/sessions?limit=` — List all sessions
- GET `/admin/redis/cache` — View Redis cache
- GET `/admin/qdrant/collections` — List collections

---

## 💾 Database Tables

| Table | Rows | Purpose |
|-------|------|---------|
| **chat_sessions** | User-scale | Session metadata + summary |
| **chat_messages** | Session-scale | User/assistant messages |
| **chat_message_chunks** | 10K-100K | Tracked vectors for feedback |
| **documents** | 100-1000 | Upload tracking + status |
| **message_feedbacks** | 100-1000 | Like/dislike + correction |

---

## 📦 Key Dependencies

### Backend
- **Web:** FastAPI, uvicorn
- **DB:** SQLAlchemy 2.0 async, asyncpg, alembic
- **Cache:** Redis 5.0+
- **Vector:** Qdrant, LlamaIndex
- **AI:** Vanna, Docling, Mem0, Edge-TTS, Faster-Whisper
- **Agent:** PydanticAI, LangGraph
- **Celery:** celery[redis], flower

### Frontend
- **Framework:** Next.js 15, React 18
- **UI:** shadcn/ui (30+ components), TailwindCSS
- **AI:** OpenAI SDK, Genkit
- **File:** PDF.js, mammoth, xlsx
- **Forms:** react-hook-form, zod

---

## 🧠 Memory System

```
Mem0 (Long-term)
├─ Qdrant collection: mem0_memories
├─ LLM-extracted semantic facts
└─ Nightly dedup + importance scoring

Qdrant (Short-term)
├─ chat_chunks: Session messages (verbatim)
├─ port_knowledge: Document chunks (RAG)
└─ Scope: User + department filtered
```

**Pipeline:**
1. User sends message → ChatService.add_message()
2. Dispatch process_chat_response (embed message chunks)
3. Dispatch store_memory (save to Mem0 if length > 10)
4. Dispatch summarize_session (every 10 messages)

**Search Flow:**
- Query embedding via Mem0
- Search both Qdrant collections
- Merge + score threshold (0.35)
- Return top-k

---

## 🔒 Security Status

| Area | Status | Notes |
|------|--------|-------|
| Auth | ⚠️ **DEV ONLY** | LocalStorage-based, no JWT validation |
| CORS | ⚠️ **WEAK** | Allow-all in exception handler |
| Rate Limit | ❌ **NONE** | No protection against API flooding |
| SQL Injection | ✅ **SAFE** | Parameterized queries (SQLAlchemy) |
| Secrets | ⚠️ **EXPOSED** | Cloudflare token in git (move to secrets) |

**Pre-Production Fixes Required:**
1. ✅ Add JWT auth + token validation
2. ✅ Restrict CORS to specific domain
3. ✅ Implement rate limiting (Slowapi)
4. ✅ Move secrets to environment/vault

---

## ⚡ Performance Tips

### Load Testing Ready?
- Redis caching: 1-hour TTL
- Embedding model: Singleton per worker (1.3 GB loaded once)
- Parallel embedding: 8 ThreadPool workers per task
- Celery: 3 specialized queues (don't mix I/O with compute)

### Bottlenecks to Monitor
- Mem0 latency (300s timeout, can be slow)
- Docling processing (large files → 30-60s)
- Qdrant search (payloads with many filters)
- LLM API latency (OpenRouter)

### Recommended Scaling
- Add Redis replica for high read load
- Partition Qdrant by department
- Horizontal scale Celery workers (add more containers)
- Add API gateway (nginx) for rate limiting + caching

---

## 📝 Logging & Monitoring

### Current State
- Basic Python logging (not structured)
- Flower dashboard for Celery tasks
- No distributed tracing
- No metrics (Prometheus)

### Production Recommendations
1. Switch to JSON logging (python-json-logger)
2. Add OpenTelemetry tracing
3. Prometheus + Grafana dashboards
4. Alert on task failure rate, latency SLAs

---

## 🐛 Known Issues

### Security 🚩
1. No JWT auth on backend
2. CORS allows `*`
3. Cloudflare token hardcoded

### Features ⚠️
1. `sync_data` task not implemented
2. Kreuzberg service unused (check if obsolete)
3. Password reset mock only
4. No message editing

### Testing ❌
1. No backend tests
2. No frontend tests
3. No integration tests

### Monitoring 📊
1. No structured logging
2. No distributed tracing
3. No health check endpoints

---

## 🚀 Deployment

### Development
```bash
docker compose up -d --build
```

### Production
```bash
# Use pro Compose file (clean builds, no bind mounts)
docker compose -f docker-compose.pro.yml up -d --build

# Or deploy with Kubernetes (helm chart recommended)
```

### Environment Setup
```bash
# Required
OPENAI_API_KEY=...
OPENROUTER_API_KEY=...
HF_TOKEN=...
POSTGRES_PASSWORD=...

# Optional (has defaults)
LLM_MODEL=openai/gpt-4o-mini
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2
RAG_SCORE_THRESHOLD=0.35
```

---

## 📊 System Prompts

### RAG (Port Authority)
```
Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP...
- Trả lời tự nhiên, lịch sự, đầy đủ
- Trình bày bảng thành Markdown
- Giữ nguyên đơn vị tiền tệ (VNĐ, USD)
- Trích dẫn nguồn [1], [2]...
- Không bịa dữ liệu: "chưa có thông tin, gọi 1800 1188"
```

### SQL Agent
```
You are a SQL Expert for ChatSNP Vietnamese Port System.
- Only SELECT queries
- No DROP/DELETE/ALTER/TRUNCATE
- Use tools to inspect schema and fix errors
- Return SQL + Vietnamese explanation
```

### Memory Consolidation (Nightly)
```
Identify duplicates, assign importance_score (1-10):
- Port operations: 8-10
- Personal info: 3-5
- Social chit-chat: 1-2
```

---

## 🔄 Common Workflows

### **Adding a Feature**
1. Create API endpoint in `src/api/` router
2. Add corresponding Celery task in `src/worker/`
3. Create frontend component/hook in `frontend/src/`
4. Add tests (recommended: pytest + Jest)
5. Update OpenAPI docs (FastAPI auto-generates)

### **Updating Prompts**
1. Edit system prompt in `src/worker/chat_tasks.py` (RAG)
2. Or `src/worker/data_tasks.py` (SQL)
3. Or `src/lib/chatsnp-system-prompt.ts` (frontend)
4. Test with admin endpoints or Flower

### **Debugging a Task**
1. Check Flower dashboard: http://localhost:5555
2. View task logs: `docker logs chatsnp-worker-chat`
3. Inspect Redis: `redis-cli get session:{id}`
4. Check Qdrant: http://localhost:6333/dashboard

### **Accessing Raw Data**
```bash
# PostgreSQL
docker exec -it chatsnp-postgres psql -U chatsnp -d chatsnp

# Redis
docker exec -it chatsnp-redis redis-cli

# Qdrant
curl http://localhost:6333/collections
```

---

## 📚 File Reference

| What | Where |
|------|-------|
| **Chat routes** | `backend/src/api/chat.py` |
| **Upload routes** | `backend/src/api/upload.py` |
| **Chat tasks** | `backend/src/worker/chat_tasks.py` |
| **SQL tasks** | `backend/src/worker/data_tasks.py` |
| **Media tasks** | `backend/src/worker/media_tasks.py` |
| **DB models** | `backend/src/models/models.py` |
| **Config** | `backend/src/core/config.py` |
| **Chat service** | `backend/src/services/chat_service.py` |
| **Docling** | `backend/src/services/docling_service.py` |
| **Chat UI** | `frontend/src/components/chat-ui.tsx` |
| **System prompt** | `frontend/src/lib/chatsnp-system-prompt.ts` |
| **Server actions** | `frontend/src/app/actions.ts` |

---

## ❓ FAQ

**Q: Where do I add a new API endpoint?**  
A: Create a route in `backend/src/api/` and include in `main.py`. Use Depends() for DB/Redis injection.

**Q: How do I trace a Celery task failure?**  
A: Check Flower (http://localhost:5555), then `docker logs chatsnp-worker-chat`.

**Q: Can I change the LLM model?**  
A: Set `LLM_MODEL` env var. Default is `openai/gpt-4o-mini` (OpenRouter API).

**Q: Where are uploaded files stored?**  
A: `/app/media/uploads/` inside backend container (mounted volume).

**Q: How long do chat sessions last?**  
A: Until user deletes or TTL expires. Redis cache: 1 hour. DB: Forever.

**Q: Can users share documents across departments?**  
A: Only if document marked `is_public=true` AND user in same department.

**Q: What happens if Mem0 service is down?**  
A: Chat mode fails, but basic session storage still works. Restart Mem0.

**Q: How do I monitor task performance?**  
A: Flower dashboard shows task count, latency, failures. Add Prometheus for custom metrics.

---

## 🎯 Next Steps

1. **Review** `COMPREHENSIVE_ANALYSIS.md` for deep dives
2. **Deploy** to staging with security fixes
3. **Add tests** (pytest, Jest, integration tests)
4. **Monitor** with structured logging + Prometheus
5. **Scale** horizontally with more workers/replicas

---

**Full Documentation:** See `/Volumes/orical/ChatSNP/chatSNP170226/COMPREHENSIVE_ANALYSIS.md`

