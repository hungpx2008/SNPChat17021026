# Docker Compose Configuration Analysis

## 📋 File Comparison Matrix

### docker-compose.yml (Development)
- **Purpose**: Local development with full debugging
- **Healthchecks**: ✅ ENABLED (all services)
- **Logging**: VERBOSE
- **Optimization**: None (speed not priority)
- **External Services**: Cloudflared included
- **Best For**: Testing, debugging, local development

### docker-compose.pro.yml (Production)
- **Purpose**: Production deployment with optimization
- **Healthchecks**: ❌ REMOVED (performance gain)
- **Logging**: Standard
- **Optimization**: ✅ ENABLED
- **External Services**: Cloudflared removed
- **Best For**: High-traffic production environments

### docker-compose.prod.yml
- Alternative production config (exact purpose varies)
- Generally similar to docker-compose.prod.yml
- May have different database credentials

### docker-compose.full.yml
- Minimal, simplified configuration
- Might be for demo or lightweight testing

---

## 🔧 Detailed Service Configuration

### POSTGRES (Database)

**Development**:
```yaml
image: postgres:16
container_name: chatsnp-postgres
restart: unless-stopped
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U chatsnp"]
  interval: 10s
  timeout: 5s
  retries: 5
volumes:
  - postgres-data:/var/lib/postgresql/data
  - ./docker/initdb:/docker-entrypoint-initdb.d
```

**Key Points**:
- ✅ Healthcheck ensures DB is ready before dependent services start
- Auto-initialization from `/docker/initdb` SQL scripts
- Persistent volume (`postgres-data`)
- Restart policy: only restart if crashed (not always)

**Production Difference**:
- Same configuration in both files
- Healthcheck might be removed in some prod configs

---

### REDIS (Cache & Message Broker)

**Development**:
```yaml
image: redis:7-alpine
container_name: chatsnp-redis
restart: unless-stopped
command: ["redis-server", "--save", "60", "1"]  # Persist every 60s or 1 change
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 5s
  retries: 5
ports:
  - "${REDIS_PORT:-6379}:6379"
volumes:
  - redis-data:/data
```

**Configuration Explained**:
- `--save 60 1`: Save to disk every 60 seconds OR if 1 key changed
- ✅ Healthcheck via `redis-cli ping`
- Port exposed for external tools
- Persistent volume for crash recovery

**Use Cases**:
- Celery task broker (queue messages)
- Session caching
- Real-time pub/sub for SSE streams

---

### QDRANT (Vector Database)

**Development**:
```yaml
image: qdrant/qdrant:latest
container_name: chatsnp-qdrant
restart: unless-stopped
healthcheck:
  test: ["CMD-SHELL", "bash -c '</dev/tcp/localhost/6333' 2>/dev/null && echo ok || exit 1"]
  interval: 10s
  timeout: 5s
  retries: 5
ports:
  - "${QDRANT_PORT_HTTP:-6333}:6333"      # HTTP API
  - "${QDRANT_PORT_GRPC:-6334}:6334"      # gRPC API (faster)
volumes:
  - qdrant-data:/qdrant/storage
```

**Key Points**:
- Dual port access: HTTP REST + gRPC
- ✅ TCP healthcheck (port 6333)
- gRPC (6334) is preferred for Python clients (faster)
- Persistent storage for embeddings

**Collections**:
- `mem0_memories` — Stores user memory vectors
- Custom collections for document embeddings

---

### BACKEND (FastAPI API Server)

**Development**:
```yaml
build:
  context: ./backend
  dockerfile: Dockerfile
container_name: chatsnp-backend
restart: unless-stopped
volumes:
  - ./backend:/app                    # Live code reload
  - media-data:/app/media             # Shared with workers
  - whoosh-index:/data/whoosh_index  # BM25 index
environment:
  <<: *common-env                     # Inherits all common vars
ports:
  - "8000:8000"
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy
  qdrant:
    condition: service_healthy
```

**What's Different in Production**:
- `restart: always` (sometimes)
- No live code reload (volume mounted as read-only)
- Resource limits might be set (CPU, memory)
- Startup order verified (no parallelization)

**Volumes**:
- `/app` — Live code changes (dev only)
- `/app/media` — Uploads, charts, audio (shared with worker_media)
- `/data/whoosh_index` — BM25 search index (shared with workers)

---

### FRONTEND (Next.js Server)

**Development**:
```yaml
build:
  context: ./frontend
  dockerfile: Dockerfile
  args:
    NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL:-http://localhost:8000}
container_name: chatsnp-frontend
restart: unless-stopped
environment:
  NEXT_PUBLIC_BACKEND_URL: http://localhost:8000
  BACKEND_INTERNAL_URL: http://backend:8000  # Docker-only, for SSR
  OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}
  OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}
  LOCAL_LLM_MODEL: ${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}
ports:
  - "3000:3000"
depends_on:
  - backend
```

**Backend URL Strategy**:

| Context | URL | Reason |
|---------|-----|--------|
| Build-time | `NEXT_PUBLIC_BACKEND_URL` (arg) | Client-side JS |
| Runtime | `BACKEND_INTERNAL_URL` | Server-Side Rendering (Next.js server) |
| Browser | `NEXT_PUBLIC_BACKEND_URL` | Client-side API calls |

**Production Difference** (docker-compose.pro.yml):
```yaml
NEXT_PUBLIC_BACKEND_URL: https://backendchatsnp.cntt-snp.online
# Production domain instead of localhost
```

---

### WORKER SERVICES (Celery Task Workers)

#### worker_chat (Priority Queue - 2 concurrency)
```yaml
build:
  context: ./backend
  dockerfile: Dockerfile
container_name: chatsnp-worker-chat
restart: unless-stopped
command: celery -A src.worker.celery_app worker -Q chat_priority -c 2 --loglevel=info -n chat@%h
volumes:
  - ./backend:/app
  - whoosh-index:/data/whoosh_index
environment:
  <<: *common-env
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy
  qdrant:
    condition: service_healthy
```

**Purpose**: Chat messages & RAG queries
- Concurrency: 2 (handle 2 tasks in parallel)
- Queue: `chat_priority` (high-priority messages)
- Access: Whoosh index (search)

#### worker_data (Batch Queue - 2 concurrency)
```yaml
command: celery -A src.worker.celery_app worker -Q data_batch -c 2 --loglevel=info -n data@%h
```

**Purpose**: Data processing, imports, analytics
- No volume mounts (no file I/O)

#### worker_media (Media Processing - 1 concurrency)
```yaml
command: celery -A src.worker.celery_app worker -Q media_process -c 1 --loglevel=info -n media@%h
volumes:
  - ./backend:/app
  - media-data:/app/media              # Read/write uploads
  - whoosh-index:/data/whoosh_index
  - paddle-models:/root/.paddleocr     # OCR model cache
```

**Purpose**: Document parsing, OCR, audio processing
- Concurrency: 1 (process one heavy task at a time)
- Queue: `media_process`
- Access: Media files, OCR models, search index

**Production Difference** (docker-compose.pro.yml):
```yaml
ENABLE_PADDLE_OCR: "true"  # Enable advanced OCR in production
```

---

### FLOWER (Celery Monitoring)

```yaml
build:
  context: ./backend
  dockerfile: Dockerfile
container_name: chatsnp-flower
restart: unless-stopped
command: celery -A src.worker.celery_app flower --port=5555 --broker_api=redis://redis:6379/0
ports:
  - "5555:5555"
volumes:
  - ./backend:/app
environment:
  CELERY_BROKER_URL: redis://redis:6379/0
  REDIS_URL: redis://redis:6379/0
depends_on:
  redis:
    condition: service_healthy
```

**Purpose**: Web UI for monitoring Celery tasks
- Access: http://localhost:5555
- Shows: Task queue, worker status, execution history
- Perfect for debugging task failures

---

### CLOUDFLARED (Tunneling)

**Development Only** (removed in production):
```yaml
image: cloudflare/cloudflared:latest
container_name: chatsnp_cloudflared
restart: unless-stopped
command: tunnel --no-autoupdate run --token eyJhIjoiNjRiZTNhY2RiNWEyNGQ3ZTU3NDYyZWU3MmE0M2YxYzEiLCJ0IjoiODRhYWZhZTktMDFlMC00MWE0LThiODYtZDg3NDY4NWRmOTVmIiwicyI6IlpHWTRZMlV5TkRndFptVXlPQzAwT1dGbExXRTVPR0V0T1RjeU5qUTRNamcwTldaayJ9
networks:
  - default
```

**Purpose**:
- Expose local services to internet via Cloudflare
- Use case: Share dev environment with remote testers
- Token: Embedded (specific to project account)

**Why Removed in Production**:
- Production uses direct domain (backendchatsnp.cntt-snp.online)
- Cloudflare tunnel adds latency
- Not needed when running on VPS

---

## 🔄 Dependency Flow

```
┌─ postgres ─────┐
│                │
├─ redis ────────┤
│                │
├─ qdrant ────── backend ────┐
│                │           │
│                frontend    │ 
│                            │
│    worker_chat ◄───────────┘
│    worker_data ◄───────────┐
│    worker_media ◄──────────┤
│                            │
└─ flower ◄──────────────────┘
   (only needs redis)
```

**Startup Order**:
1. Data layer (postgres, redis, qdrant) — must be healthy first
2. Backend — depends on data layer
3. Frontend — depends on backend
4. Workers — parallel start, all depend on data layer
5. Flower — only depends on redis

---

## 🌍 Environment Inheritance

### Common Environment (YAML Anchor)
```yaml
x-common-env: &common-env
  DATABASE_URL: postgresql+asyncpg://...
  REDIS_URL: redis://redis:6379/0
  CELERY_BROKER_URL: redis://redis:6379/0
  QDRANT_URL: http://qdrant:6333
  QDRANT_COLLECTION: mem0_memories
  BACKEND_INTERNAL_URL: http://backend:8000
  PYTHONUNBUFFERED: "1"
  WHOOSH_INDEX_DIR: /data/whoosh_index
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}
  LLM_MODEL: ${LLM_MODEL:-openai/gpt-4o-mini}
  # ... 20+ Docling config variables
```

**Used By**:
- `backend` — Full environment
- `worker_chat` — Full environment (same as backend)
- `worker_data` — Full environment
- `worker_media` — Full environment

**NOT Used By**:
- `frontend` — Minimal, only needs backend URLs + LLM keys
- `flower` — Only Celery broker URLs
- `postgres/redis/qdrant` — Service-specific config

---

## 📊 Volume Summary

| Volume | Purpose | Shared By | Persistence |
|--------|---------|-----------|-------------|
| `postgres-data` | PostgreSQL files | postgres only | ✅ Persistent |
| `redis-data` | Redis snapshots | redis only | ✅ Persistent |
| `qdrant-data` | Vector embeddings | qdrant only | ✅ Persistent |
| `media-data` | User uploads, charts, audio | backend + worker_media | ✅ Persistent |
| `whoosh-index` | BM25 search index | backend + worker_chat + worker_media | ✅ Persistent |
| `paddle-models` | OCR model cache | worker_media only | ✅ Persistent |

**Note**: All volumes are Docker-managed (stored in `/var/lib/docker/volumes/`)

---

## ⚡ Performance Optimization Checklist

### Development (use default docker-compose.yml)
- ✅ Healthchecks enabled (safer startup)
- ✅ Live code reload (faster iteration)
- ✅ Verbose logging (better debugging)
- ⚠️ Slight overhead from health checks

### Production (use docker-compose.pro.yml)
- ✅ Health checks removed (faster startup, ~3-5s saved)
- ✅ Direct domain URLs (no localhost confusion)
- ✅ OCR enabled (better document handling)
- ✅ Cloudflared removed (less latency)
- ❌ No live code reload (rebuild needed for changes)

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend can't reach PostgreSQL
```
error: postgres service not healthy
```
**Solution**:
- Check PostgreSQL logs: `docker compose logs postgres`
- Ensure `pg_isready` is available
- Wait longer (increase `interval` in healthcheck)

### Issue 2: Frontend shows blank page
```
Can't connect to http://localhost:8000
```
**Solution**:
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- For Docker: use `BACKEND_INTERNAL_URL` for SSR
- Rebuild frontend: `docker compose build frontend`

### Issue 3: Celery workers stuck
```
worker: Ready to accept tasks
but no tasks processed
```
**Solution**:
- Check Redis: `docker compose exec redis redis-cli ping`
- Check broker URL: `CELERY_BROKER_URL`
- Monitor: http://localhost:5555 (Flower)

### Issue 4: Out of disk space
```
docker: no space left on device
```
**Solution**:
```bash
# Clean up unused volumes
docker volume prune

# Or specific volume
docker volume rm chatsnp170226_media-data
```

---

## 🔐 Environment Variable Flow

```
.env file
  ↓
docker-compose reads via ${VAR_NAME} syntax
  ↓
Passed to containers via 'environment:' section
  ↓
Application reads via os.getenv() or pydantic-settings
```

**Example**:
```yaml
# .env file
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# docker-compose.yml
environment:
  OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-default}

# Inside container (Python)
import os
api_key = os.getenv('OPENROUTER_API_KEY')
```

---

## 📝 Deployment Checklist

Before running in production:

- [ ] Update `.env` with production secrets
- [ ] Change PostgreSQL password (not `12345678`)
- [ ] Set `NEXT_PUBLIC_BACKEND_URL` to production domain
- [ ] Enable CORS for production origins
- [ ] Set resource limits (CPU, memory)
- [ ] Configure backup strategy for volumes
- [ ] Setup monitoring/alerting
- [ ] Test failover procedures
- [ ] Document upgrade process
- [ ] Plan rollback strategy

---

**Generated**: 2026-04-15
**For**: ChatSNP Project v0.1.0

