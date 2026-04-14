# ChatSNP Service & Endpoint Matrix

## Docker Services Deployment

| # | Service | Image | Container Name | Port(s) | Concurrency | Purpose | Status |
|----|---------|-------|----------------|---------|-------------|---------|--------|
| 1 | postgres | postgres:16 | chatsnp-postgres | 5432 (internal) | N/A | Primary database | Core |
| 2 | redis | redis:7-alpine | chatsnp-redis | 6379 | N/A | Cache + Celery broker | Core |
| 3 | qdrant | qdrant/qdrant:latest | chatsnp-qdrant | 6333, 6334 | N/A | Vector database | Core |
| 4 | mem0 | ./mem0-service | chatsnp-mem0 | 8888→8000 | N/A | Memory service | Support |
| 5 | backend | ./backend | chatsnp-backend | 8000 | N/A | FastAPI main app | Primary |
| 6 | frontend | ./frontend | chatsnp-frontend | 3000 | N/A | Next.js web UI | Primary |
| 7 | worker_chat | ./backend | chatsnp-worker-chat | N/A | 2 | Chat queue processing | Worker |
| 8 | worker_data | ./backend | chatsnp-worker-data | N/A | 2 | Data indexing | Worker |
| 9 | worker_media | ./backend | chatsnp-worker-media | N/A | 1 | Media/OCR processing | Worker |
| 10 | flower | ./backend | chatsnp-flower | 5555 | N/A | Celery monitoring | Support |
| 11 | cloudflared | cloudflare/cloudflared | chatsnp_cloudflared | N/A | N/A | Tunnel service | Support |

---

## Backend API Endpoints (29 Total)

### Chat Router (`/api/chat`)

| # | Method | Endpoint | Description | Queue | Response |
|----|--------|----------|-------------|-------|----------|
| 1 | POST | `/` | Create new chat session | - | SessionSchema |
| 2 | GET | `/` | List all sessions | - | List[SessionSchema] |
| 3 | GET | `/{session_id}` | Get session with messages | - | SessionWithMessages |
| 4 | POST | `/{session_id}/messages` | Send message (streaming) | chat_priority | StreamingResponse |
| 5 | POST | `/search` | Search documents (cross-session) | - | List[SearchResult] |
| 6 | POST | `/{session_id}/messages/{message_id}/edit` | Edit existing message | chat_priority | MessageSchema |
| 7 | POST | `/{session_id}/messages/{message_id}/regenerate` | Regenerate AI response | chat_priority | MessageSchema |
| 8 | GET | `/{session_id}/messages/{message_id}/branches` | Get message branches | - | List[BranchInfo] |
| 9 | POST | `/{session_id}/messages/{message_id}/navigate` | Switch to branch | - | SessionWithMessages |
| 10 | GET | `/{session_id}/tree` | Get conversation tree | - | ConversationTree |
| 11 | PATCH | `/messages/{message_id}/content` | Patch message content | - | MessageSchema |
| 12 | PATCH | `/messages/{message_id}/metadata` | Update message metadata | - | MessageSchema |
| 13 | GET | `/{session_id}/stream` | SSE stream for real-time updates | - | EventStream |

### Upload Router (`/api/upload`)

| # | Method | Endpoint | Description | Queue | Response |
|----|--------|----------|-------------|-------|----------|
| 14 | POST | `/` | Upload document | media_process | DocumentUploadResponse |
| 15 | GET | `/{document_id}/status` | Check upload status | - | DocumentSchema |
| 16 | DELETE | `/{document_id}/cancel` | Cancel upload | - | StatusResponse |
| 17 | GET | `/{document_id}/download` | Download document | - | FileResponse |
| 18 | GET | `/find-by-name` | Search documents by name | - | List[DocumentSchema] |
| 19 | GET | `/` | List all documents | - | List[DocumentSchema] |

### Feedback Router (`/api/feedback`)

| # | Method | Endpoint | Description | Queue | Response |
|----|--------|----------|-------------|-------|----------|
| 20 | POST | `/` | Submit feedback on response | - | FeedbackResponse |

### TTS Router (`/api/tts`)

| # | Method | Endpoint | Description | Queue | Response |
|----|--------|----------|-------------|-------|----------|
| 21 | POST | `/tts` | Convert text to speech | media_process | AudioResponse |

### Admin Router (`/api/admin`)

| # | Method | Endpoint | Description | Queue | Response |
|----|--------|----------|-------------|-------|----------|
| 22 | POST | `/train/ddl` | Train on SQL schema (Vanna) | data_batch | TrainingResponse |
| 23 | GET | `/sessions` | View all sessions (admin) | - | List[AdminSessionSummary] |
| 24 | GET | `/sessions/{session_id}/messages` | Get session messages (admin) | - | List[MessageSchema] |
| 25 | GET | `/redis/cache` | Get Redis cache stats | - | RedisCacheResponse |
| 26 | DELETE | `/redis/cache/{session_id}` | Clear cache for session | - | StatusResponse |
| 27 | GET | `/qdrant/collections` | List Qdrant collections | - | List[QdrantCollectionSchema] |
| 28 | GET | `/qdrant/{collection_name}/stats` | Get collection stats | - | CollectionStatsResponse |
| 29 | POST | `/reindex/{document_id}` | Reindex document | data_batch | StatusResponse |

---

## Celery Task Queues

### Queue: `chat_priority` (Worker: worker_chat, Concurrency: 2)

| Task | Source Endpoint | Purpose | Timeout | Retry |
|------|-----------------|---------|---------|-------|
| `process_chat_message` | POST /messages | Generate AI response | 120s | 3x |
| `add_to_memory` | POST /messages | Store in mem0 | 30s | 2x |
| `semantic_search` | POST /search | Vector similarity search | 60s | 2x |
| `edit_message` | POST /edit | Regenerate for edit | 120s | 3x |
| `regenerate_response` | POST /regenerate | Regenerate AI response | 120s | 3x |

### Queue: `data_batch` (Worker: worker_data, Concurrency: 2)

| Task | Source Endpoint | Purpose | Timeout | Retry |
|------|-----------------|---------|---------|-------|
| `index_document` | POST /upload | Index into Qdrant | 300s | 3x |
| `chunk_document` | POST /upload | Split into chunks | 180s | 2x |
| `train_on_schema` | POST /train/ddl | Train Vanna | 300s | 2x |
| `reindex_document` | POST /reindex | Reindex existing | 300s | 2x |

### Queue: `media_process` (Worker: worker_media, Concurrency: 1)

| Task | Source Endpoint | Purpose | Timeout | Retry |
|------|-----------------|---------|---------|-------|
| `process_document_file` | POST /upload | OCR/Parse document | 600s | 2x |
| `extract_images` | POST /upload | Image extraction | 180s | 2x |
| `generate_tts` | POST /tts | Text to speech | 120s | 2x |
| `process_chart` | POST /upload | Chart generation | 300s | 2x |

---

## Mem0 Service Endpoints (13 Total)

| # | Method | Path | Purpose | Response |
|----|--------|------|---------|----------|
| 1 | POST | `/configure` | Configure memory backend | {message: string} |
| 2 | POST | `/embed` | Generate text embeddings | {vector: float[]} |
| 3 | POST | `/memories` | Add new memories | MemoryResponse |
| 4 | GET | `/memories` | Retrieve all memories (filtered) | List[Memory] |
| 5 | GET | `/memories/{memory_id}` | Get single memory | Memory |
| 6 | POST | `/search` | Search memories semantically | List[Memory] |
| 7 | PUT | `/memories/{memory_id}` | Update memory content | Memory |
| 8 | GET | `/memories/{memory_id}/history` | Get memory version history | List[MemoryVersion] |
| 9 | DELETE | `/memories/{memory_id}` | Delete single memory | {message: string} |
| 10 | DELETE | `/memories` | Batch delete memories | {message: string} |
| 11 | POST | `/reset` | Reset all memories | {message: string} |
| 12 | GET | `/` | Redirect to OpenAPI docs | RedirectResponse |

---

## Data Models Summary

### Core Entities

| Model | Location | Fields | Purpose |
|-------|----------|--------|---------|
| Session | models.py | id, user_id, title, created_at, updated_at | Chat conversation |
| Message | models.py | id, session_id, role, content, metadata, created_at | Chat message |
| Document | models.py | id, filename, status, vector_ids, created_at | Uploaded document |
| Feedback | models.py | id, message_id, rating, comment | User feedback |
| Memory | mem0/main.py | id, user_id, data, embeddings, created_at | AI memory |

---

## Infrastructure & Volumes

### Named Volumes (8)

| Volume | Size Limit | Used By | Persistence |
|--------|-----------|---------|-------------|
| postgres-data | Unlimited | postgres | RDB + WAL |
| redis-data | 4GB (approx) | redis | RDB snapshot |
| qdrant-data | Unlimited | qdrant | Vector data |
| huggingface-cache | 10GB+ | mem0 | Model cache |
| media-data | 50GB (approx) | backend, worker_media | Uploads, charts |
| whoosh-index | 10GB (approx) | backend, worker_chat, worker_media | BM25 index |
| paddle-models | 2GB (approx) | worker_media | OCR models |

### Shared Volumes (3)

| Volume | Producers | Consumers | Use Case |
|--------|-----------|-----------|----------|
| media-data | worker_media, backend | frontend | Document uploads, generated charts |
| whoosh-index | worker_chat, worker_data | backend | Full-text search sharing |
| paddle-models | worker_media | worker_media | OCR model cache |

---

## Performance Characteristics

### Throughput Estimates

| Service | Metric | Dev | Prod |
|---------|--------|-----|------|
| Backend (FastAPI) | Req/sec | ~100 | ~500 (with load balancer) |
| Chat Worker | Msg/sec | 2 | ~10 (with scaling) |
| Data Worker | Op/sec | 2 | ~5 (batch dependent) |
| Media Worker | Op/sec | 1 | ~2 (OCR intensive) |
| Qdrant | Search/sec | ~100 | ~1000 |
| Redis | Op/sec | ~1000 | ~5000 |
| Postgres | Conn pool | 10 | 50 |

### Typical Latencies

| Operation | Min | Avg | Max | Notes |
|-----------|-----|-----|-----|-------|
| Send message | 100ms | 5s | 30s | Depends on RAG |
| Search documents | 50ms | 500ms | 5s | Vector + lexical |
| Upload document | 1s | 10s | 120s | OCR intensive |
| TTS generation | 2s | 5s | 30s | Audio encoding |
| Regenerate response | 100ms | 3s | 20s | Streaming |

---

## Network Architecture

```
Client Browser (Port 3000)
    ↓ (HTTP/WS)
Next.js Frontend (3000)
    ↓ (HTTP/SSE)
Backend API (8000)
    ├→ PostgreSQL (5432)
    ├→ Redis (6379)
    ├→ Qdrant (6333/6334)
    └→ Mem0 Service (8888)
        └→ Qdrant (6333)

Celery Task Distribution:
    Backend → Redis (6379) → worker_chat/worker_data/worker_media
    
Monitoring:
    → Flower (5555)
    
Tunneling:
    → Cloudflare Tunnel
```

---

## Environment Variables by Service

### All Services (Common)
```
DATABASE_URL: postgresql+asyncpg://...
REDIS_URL: redis://redis:6379/0
CELERY_BROKER_URL: redis://redis:6379/0
QDRANT_URL: http://qdrant:6333
PYTHONUNBUFFERED: "1"
OPENAI_API_KEY
OPENROUTER_API_KEY
```

### Backend/Workers (RAG)
```
LLM_MODEL: openai/gpt-4o-mini
EMBEDDER_MODEL: AITeamVN/Vietnamese_Embedding_v2
EMBEDDING_DIM: 1024
DOCLING_CHUNK_MAX_TOKENS: 2048
ENABLE_PADDLE_OCR: false/true
```

### Mem0 Service
```
QDRANT_HOST: qdrant
QDRANT_COLLECTION: mem0_memories
EMBEDDER_PROVIDER: huggingface
GRAPH_STORE_PROVIDER: off
HF_TOKEN: [if using private models]
```

### Frontend
```
NEXT_PUBLIC_BACKEND_URL: http://localhost:8000
BACKEND_INTERNAL_URL: http://backend:8000
```

---

## Security & Compliance

### Authentication
- JWT via auth-service (frontend)
- Session cookies (optional)
- Anonymous sessions supported

### Authorization
- Role-based (admin vs user)
- Session ownership validation
- Document access control

### Data Privacy
- Encrypted connections (TLS)
- Secrets via environment variables
- ⚠️ TODO: Cloudflare token to .env

### Compliance Notes
- PII handling in messages
- Feedback data retention policy
- GDPR deletion endpoints needed

---

## Monitoring & Logging

### Available Monitoring

| Component | Tool | Port | Access |
|-----------|------|------|--------|
| Celery | Flower | 5555 | http://localhost:5555 |
| Backend | FastAPI Docs | 8000 | http://localhost:8000/docs |
| Mem0 | OpenAPI Docs | 8888 | http://localhost:8888/docs |
| Frontend | DevTools | 3000 | http://localhost:3000 |

### Logging
- Backend: Python logging (stdout)
- Frontend: Console + error boundaries
- Celery: Task logs via Flower
- Container: Docker logs (docker-compose logs -f SERVICE)

---

## Deployment Checklist

- [ ] Move Cloudflare token to .env
- [ ] Set all API keys in environment
- [ ] Configure database backups
- [ ] Set Redis persistence
- [ ] Configure Qdrant snapshots
- [ ] Set up monitoring/alerting
- [ ] Configure log aggregation
- [ ] Test failover scenarios
- [ ] Document deployment process
- [ ] Set up CI/CD pipeline

