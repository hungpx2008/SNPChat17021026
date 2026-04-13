# PROJECT_CONTEXT.md — ChatSNP
> **Last updated:** 2026-04-13  
> **Purpose:** Giúp AI (hoặc developer mới) hiểu toàn bộ dự án trong 1 file duy nhất. CẬP NHẬT FILE NÀY khi có thay đổi kiến trúc/tính năng.

---

## 1. TỔNG QUAN

**ChatSNP** = Chatbot thông minh cho **Tân Cảng Sài Gòn (SNP)**, hỗ trợ tra cứu biểu giá, tài liệu cảng biển, truy vấn database bằng ngôn ngữ tự nhiên, có bộ nhớ dài hạn (nhớ sở thích/thông tin user qua nhiều phiên).

**Kiến trúc:** Microservices-lite (Docker Compose), 3 service chính + infra.

---

## 2. TECH STACK

| Layer | Tech | Version | Ghi chú |
|-------|------|---------|---------|
| Frontend | Next.js (App Router) | 15.3.x | TypeScript, TailwindCSS, shadcn/ui (Radix) |
| Backend | FastAPI | 0.1.0 | Python 3.10+, async, Pydantic v2 |
| Task Queue | Celery + Redis | 5.3+ | 3 queue: chat_priority, data_batch, media_process |
| DB | PostgreSQL 16 | - | SQLAlchemy 2.0 async (asyncpg) |
| Cache | Redis 7 | - | Chat session cache (TTL 1h) + Celery broker |
| Vector DB | Qdrant | latest | 2 collection: `chat_chunks` (short-term), `port_knowledge` (RAG docs) |
| Memory | Mem0 Service | custom | Long-term memory, embedding API |
| Embedding | Vietnamese_Embedding_v2 | 1024-dim | HuggingFace, chạy trong Mem0 container |
| LLM | OpenRouter | - | Default: gpt-4o-mini (RAG), gpt-5-nano (summary) |
| Monitoring | Flower | - | Celery task dashboard, port 5555 |
| Tunnel | Cloudflare | - | Production exposure |

---

## 3. CẤU TRÚC THƯ MỤC

```
chatSNP170226/
├── backend/                    # FastAPI service
│   ├── src/
│   │   ├── main.py            # App factory, CORS, routers, lifespan
│   │   ├── api/
│   │   │   ├── chat.py        # /sessions/* — CRUD sessions + messages + SSE stream
│   │   │   ├── upload.py      # /upload/* — File upload, Docling processing
│   │   │   ├── admin.py       # /admin/* — Vanna train, session inspect, Redis/Qdrant viewer
│   │   │   ├── feedback.py    # /feedback — Like/dislike on bot messages
│   │   │   ├── tts.py         # /tts — Text-to-speech endpoint
│   │   │   └── deps.py        # Dependency injection (get_db_session, get_session_or_404)
│   │   ├── core/
│   │   │   ├── config.py      # Settings (Pydantic) — all env vars
│   │   │   ├── db.py          # SQLAlchemy async engine + SessionLocal
│   │   │   ├── database_pool.py # Sync DB pool for Celery workers
│   │   │   ├── redis_client.py  # Redis async client singleton
│   │   │   ├── qdrant_setup.py  # Qdrant client + search/upsert helpers
│   │   │   ├── mem0_config.py   # httpx client to Mem0 + embed_text()
│   │   │   ├── http_client.py   # Shared httpx sync client (for workers)
│   │   │   ├── vanna_setup.py   # Vanna AI (Text-to-SQL)
│   │   │   └── celery_config.py # Celery broker/result config
│   │   ├── models/models.py   # ORM: ChatSession, ChatMessage, ChatMessageChunk, Document, MessageFeedback
│   │   ├── schemas/schemas.py # Pydantic I/O schemas
│   │   ├── repositories/      # DB access layer (sessions.py, messages.py)
│   │   ├── services/
│   │   │   ├── chat_service.py    # Core chat logic: create/list sessions, add message, semantic search
│   │   │   ├── docling_service.py # Docling document processing
│   │   │   ├── lida_service.py    # Lida chart generation
│   │   │   ├── tts_service.py     # Edge-TTS voice synthesis
│   │   │   └── kreuzberg_service.py # (legacy, may be unused)
│   │   └── worker/
│   │       ├── celery_app.py      # Celery app init
│   │       ├── tasks.py           # Re-exports all tasks
│   │       ├── chat_tasks.py      # process_chat_response, store_memory, rag_document_search, process_feedback, summarize_session_history
│   │       ├── data_tasks.py      # run_sql_query (Vanna + PydanticAI Agent), sync_data
│   │       ├── media_tasks.py     # process_document (Docling), transcribe_audio (Whisper), generate_chart, text_to_speech
│   │       ├── gardener_tasks.py  # consolidate_memories (nightly 2AM dedup)
│   │       └── helpers.py         # _smart_chunk, publish_task_complete, _update_document_status
│   ├── tests/
│   ├── pyproject.toml         # Dependencies: FastAPI, SQLAlchemy, Celery, Vanna, Docling, LlamaIndex, PydanticAI, edge-tts, faster-whisper...
│   └── Dockerfile
│
├── frontend/                  # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Home → redirect /login
│   │   │   ├── login/         # Login page
│   │   │   ├── signup/        # Signup page
│   │   │   ├── forgot-password/
│   │   │   ├── chat/page.tsx  # Main chat UI (requires ?department=)
│   │   │   ├── admin/page.tsx # Admin dashboard
│   │   │   ├── actions.ts     # Server Actions: getHelp(), getSuggestions()
│   │   │   ├── layout.tsx     # Root layout (AuthProvider, LanguageProvider)
│   │   │   └── api/auth/      # API routes: login, signup, reset
│   │   ├── components/
│   │   │   ├── chat-ui.tsx    # Main chat orchestrator (state, hooks, layout)
│   │   │   ├── chat/          # Chat sub-components:
│   │   │   │   ├── chat-sidebar.tsx       # Session list sidebar
│   │   │   │   ├── chat-composer.tsx      # Input area + mode selector (chat/sql/rag)
│   │   │   │   ├── chat-message-list.tsx  # Message rendering
│   │   │   │   ├── chat-header.tsx        # Top bar
│   │   │   │   ├── document-sidebar.tsx   # Uploaded docs panel
│   │   │   │   ├── feedback-buttons.tsx   # Like/dislike
│   │   │   │   ├── tts-button.tsx         # Text-to-speech
│   │   │   │   ├── llm-response-renderer.tsx # Markdown + table rendering
│   │   │   │   ├── processing-status.tsx  # "Thinking..." indicator
│   │   │   │   ├── attachment-preview.tsx # File preview
│   │   │   │   └── types.ts              # Message type definitions
│   │   │   ├── auth-provider.tsx   # Auth context (localStorage-based)
│   │   │   ├── language-provider.tsx # i18n (VI/EN)
│   │   │   ├── department-selector.tsx # Department picker on login
│   │   │   ├── file-preview-modal.tsx # PDF/DOCX/XLSX viewer
│   │   │   └── ui/             # shadcn/ui components (30+ files)
│   │   ├── hooks/
│   │   │   ├── use-chat-sessions.ts   # Session CRUD
│   │   │   ├── use-chat-messages.ts   # Message list + loading
│   │   │   ├── use-file-attachment.ts # File upload handling
│   │   │   ├── use-chat-search.ts     # Search in chat
│   │   │   └── use-session-stream.ts  # SSE event listener
│   │   ├── services/
│   │   │   ├── chat-backend.ts    # HTTP client to Backend API
│   │   │   ├── admin-backend.ts   # Admin API client
│   │   │   ├── auth-service.ts    # Auth API calls
│   │   │   └── file-parser.ts     # Client-side file parsing
│   │   ├── ai/
│   │   │   ├── localClient.ts         # OpenAI SDK config (OpenRouter)
│   │   │   └── flows/
│   │   │       ├── contextual-help.ts  # LLM call with context blocks
│   │   │       └── multimodal-help.ts  # LLM call with image
│   │   └── lib/
│   │       ├── chatsnp-system-prompt.ts # System prompt template
│   │       ├── llm-response-formatter.ts # Format LLM output
│   │       ├── memory.ts              # Mem0 client wrapper
│   │       ├── translations.ts        # VI/EN strings
│   │       └── utils.ts               # cn() utility
│   ├── package.json           # Next.js 15, React 18, OpenAI SDK, react-markdown, recharts, pdfjs...
│   └── Dockerfile
│
├── mem0-service/              # Mem0 memory server
│   ├── main.py                # FastAPI: /embed, /memories CRUD, /search, /configure, /reset
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker/initdb/             # Postgres init scripts
├── docs/blueprint.md          # Original design doc
├── docker-compose.yml         # DEV: all services + code bind mounts
└── docker-compose.pro.yml     # PROD: clean builds, no bind mounts
```

---

## 4. LUỒNG DỮ LIỆU CHÍNH

### 4A. Chat Mode (default)
```
User → Frontend (getHelp server action)
  → Backend /sessions/{id}/messages POST (save to Postgres, return 201)
  → Celery chat_priority:
      1. process_chat_response: chunk text → Mem0 /embed → Qdrant chat_chunks
      2. store_memory: Mem0 /memories (long-term, LLM extracts facts)
      3. summarize_session_history: every 10 msgs, LLM summarizes → session.metadata.summary
  → Frontend getHelp():
      - Parallel: semantic_search (Qdrant + Mem0) + Mem0 direct search + fetch session (3 recent + summary)
      - Build context blocks → LLM (OpenRouter) → response
```

### 4B. RAG Mode (user chọn "Tài liệu")
```
User → Frontend sends mode="rag"
  → Backend save message → Celery chat_priority: rag_document_search
      1. LlamaIndex VectorStoreIndex (Qdrant port_knowledge)
      2. Retrieve top-5, filter by score ≥ 0.35
      3. Build citations + context
      4. _gather_unified_context (Mem0 long-term + session summary + recent 6 msgs)
      5. LLM synthesis → sanitize → add citation footer
      6. Save assistant message via internal API
      7. publish_task_complete → Redis Pub/Sub → SSE → Frontend refresh
```

### 4C. SQL Mode (user chọn "Dữ liệu")
```
User → Frontend sends mode="sql"
  → Backend save message → Celery data_batch: run_sql_query
      1. Vanna generate_sql (Text-to-SQL)
      2. PydanticAI Agent verify/fix SQL (tools: execute_sql, get_db_schema)
      3. Safety check (no DROP/DELETE/ALTER)
      4. Execute → DataFrame → Markdown table
      5. Optional: Lida chart (if "biểu đồ" in question) → /media/charts/
      6. Optional: TTS voice (if "đọc/nghe" in question) → /media/tts/
      7. Save + SSE notify
```

### 4D. Document Upload
```
User → Frontend upload → Backend /upload POST
  → Save file → Celery media_process:
      - Images: VLM description → chunk → embed → Qdrant port_knowledge
      - Audio: faster-whisper transcribe → chunk → embed → Qdrant port_knowledge
      - Others: Docling pipeline:
          - Table serializer (adaptive: Markdown or Triplet)
          - HybridChunker with heading+row_key prefix
          - Group-lock adjacent same-row chunks
          - Embed via Mem0 → Qdrant port_knowledge
```

### 4E. Nightly Gardener (2AM)
```
Celery Beat → consolidate_memories
  → For each user: fetch Mem0 memories → LLM dedup + importance scoring → update/merge
```

---

## 5. DATABASE MODELS (Postgres)

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `chat_sessions` | id (UUID), user_id, department, title, metadata (JSON: summary), created_at, updated_at | Index: (user_id, updated_at) |
| `chat_messages` | id (UUID), session_id (FK), role, content, metadata (JSON: attachments, rag_chunk_ids), created_at | Index: (session_id, created_at) |
| `chat_message_chunks` | id (UUID), message_id (FK), chunk_index, content, vector_id | Tracks which vectors in Qdrant |
| `documents` | id (UUID), user_id, filename, file_path, status (processing/ready/error), chunk_count, extractor_used, error_message, metadata (JSON: preview_pdf_path) | Index: (user_id, filename) |
| `message_feedbacks` | id (UUID), message_id (FK), is_liked, reason | Self-correction trigger |

---

## 6. QDRANT COLLECTIONS

| Collection | Purpose | Payload Fields |
|-----------|---------|----------------|
| `chat_chunks` | Short-term conversation recall | content, session_id, message_id, user_id, role, department, chunk_index |
| `port_knowledge` | RAG document chunks | content/text, source_file, page_number, document_id, user_id, department, is_public, quality, headings, chunk_index |
| `mem0_memories` | Mem0 internal (long-term facts) | Managed by Mem0 library |

---

## 7. API ENDPOINTS

### Backend (port 8000)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/sessions` | Create chat session |
| GET | `/sessions?user_id=` | List user sessions |
| GET | `/sessions/{id}` | Get session + messages |
| POST | `/sessions/{id}/messages` | Add message (triggers Celery) |
| GET | `/sessions/{id}/stream` | SSE stream (Redis Pub/Sub) |
| POST | `/sessions/search` | Semantic search (Qdrant + Mem0) |
| POST | `/upload` | Upload document |
| GET | `/upload/{id}/status` | Check processing status |
| DELETE | `/upload/{id}/cancel` | Delete document + vectors |
| GET | `/upload/{id}/download` | Download/preview file |
| GET | `/upload?user_id=` | List user documents |
| GET | `/upload/find-by-name?filename=` | Find document by name |
| POST | `/feedback` | Submit like/dislike |
| POST | `/tts` | Text-to-speech |
| POST | `/admin/train/ddl` | Train Vanna with DDL |
| GET | `/admin/sessions` | Admin: list all sessions |
| GET | `/admin/redis/cache` | Admin: inspect Redis cache |
| GET | `/admin/qdrant/collections` | Admin: list Qdrant collections |

### Mem0 Service (port 8888)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/embed` | Generate embedding vector |
| POST | `/memories` | Store memory (LLM extracts facts) |
| GET | `/memories?user_id=` | Get all memories |
| POST | `/search` | Search memories |
| PUT | `/memories/{id}` | Update memory |
| DELETE | `/memories/{id}` | Delete memory |
| POST | `/reset` | Reset all memories |

---

## 8. CELERY QUEUES & TASKS

| Queue | Worker | Tasks |
|-------|--------|-------|
| `chat_priority` | worker_chat (2 concurrency) | process_chat_response, store_memory, rag_document_search, process_feedback, summarize_session_history |
| `data_batch` | worker_data (2 concurrency) | run_sql_query, sync_data |
| `media_process` | worker_media (1 concurrency) | process_document, transcribe_audio, generate_chart, text_to_speech |

---

## 9. FRONTEND AGENT MODES

User chọn mode trong ChatComposer:
- **chat** (default): Frontend gọi `getHelp()` server action → LLM trực tiếp (không qua Celery)
- **sql**: Backend dispatch `run_sql_query` → Celery → SSE notify khi xong
- **rag**: Backend dispatch `rag_document_search` → Celery → SSE notify khi xong

SSE flow: Frontend `useSessionStream` → GET `/sessions/{id}/stream` → Redis Pub/Sub channel `session:{id}`

---

## 10. AUTH

- Frontend-only auth (localStorage-based, `chatsnp-auth-user` key)
- API routes `/api/auth/login`, `/api/auth/signup`, `/api/auth/reset` (server-side mock store)
- No JWT/token on Backend API — user_id passed as parameter
- Guest mode: auto-generated UUID stored in localStorage

---

## 11. ENV VARS QUAN TRỌNG

| Var | Service | Mục đích |
|-----|---------|----------|
| `DATABASE_URL` | Backend | Postgres connection (asyncpg) |
| `REDIS_URL` | Backend | Redis cache + Celery broker |
| `QDRANT_URL` | Backend | Vector DB |
| `MEM0_URL` | Backend | Mem0 service endpoint |
| `OPENAI_API_KEY` | All | LLM API key (via OpenRouter) |
| `OPENAI_BASE_URL` | All | OpenRouter base URL |
| `LLM_MODEL` | All | Default LLM model |
| `HF_TOKEN` | Mem0 | HuggingFace token for embedding model |
| `EMBEDDING_MODEL` | Backend | Embedding model name |
| `NEXT_PUBLIC_BACKEND_URL` | Frontend | Backend URL (client-side) |
| `BACKEND_INTERNAL_URL` | Frontend/Workers | Backend URL (Docker internal) |
| `DOCLING_CHUNK_MAX_TOKENS` | Backend | Chunk size limit |
| `RAG_SCORE_THRESHOLD` | Backend | Min cosine similarity (default 0.35) |
| `CORS_ALLOW_ORIGINS` | Backend | Allowed origins |

---

## 12. PORTS

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 (Docker) / 9002 (dev) | http://localhost:3000 |
| Backend | 8000 | http://localhost:8000 |
| Mem0 | 8888 | http://localhost:8888 |
| Flower | 5555 | http://localhost:5555 |
| Postgres | 5432 | - |
| Redis | 6379 | - |
| Qdrant HTTP | 6333 | http://localhost:6333 |
| Qdrant gRPC | 6334 | - |

---

## 13. KEY DESIGN DECISIONS

1. **Dual memory system**: Qdrant `chat_chunks` (verbatim recall) + Mem0 `mem0_memories` (LLM-extracted facts) → combined trong semantic search
2. **3-tier context window**: Recent 3 msgs (raw) + semantic old chunks + session summary (auto-generated every 10 msgs) + Mem0 long-term
3. **Adaptive table chunking (Docling)**: Small tables → Markdown, large tables → triplet format; group-lock same-row chunks
4. **SSE for async tasks**: SQL/RAG results qua Redis Pub/Sub → SSE, chat mode trả về trực tiếp
5. **Self-correction via feedback**: Dislike → mark source vectors as `quality=low` → excluded from future RAG
6. **Vietnamese-optimized embedding**: `Vietnamese_Embedding_v2` (1024-dim), loaded once per worker/container
7. **Nightly gardener**: Dedup memories + importance scoring để optimize retrieval quality

---

## 14. DEPLOYMENT

- **Dev**: `docker compose up -d --build` (bind code mounts, hot reload)
- **Prod**: `docker compose -f docker-compose.pro.yml up -d --build` (clean images)
- **Tunnel**: Cloudflare Tunnel built-in (`cloudflared` container) for public HTTPS
- Production domain: `chatsnp2.cntt-snp.online`

---

## 15. KNOWN ISSUES / TODO

- Auth chưa có JWT/token trên Backend (chỉ pass user_id)
- CORS đang allow `*` trong exception handler
- sync_data task chưa implement (placeholder)
- kreuzberg_service.py có thể là legacy/unused
- Cần thêm monitoring (ELK/Prometheus)
