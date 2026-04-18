# ChatSNP Project - Complete Directory Structure & Organization Analysis

**Project Location:** `/Volumes/orical/ChatSNP/chatSNP170226/`  
**Tech Stack:** Next.js 15 + FastAPI + Celery + PostgreSQL + Redis + Qdrant + Mem0  
**Generated:** April 15, 2026

---

## 1. OVERALL DIRECTORY STRUCTURE

```
chatSNP170226/
├── .claude/                          # Claude Code workspace data
├── .git/                             # Git repository
├── .planning/                        # GSD planning directory
├── backend/                          # 🐍 FastAPI Backend (Python 3.10+)
├── frontend/                         # 🔷 Next.js Frontend (TypeScript)
├── docker/                           # Docker build context
├── .env                              # Environment variables (git-ignored)
├── .env.example                      # Template for environment variables
├── .env.production                   # Production environment config
├── .env.databases                    # Database-specific config (git-ignored)
├── docker-compose.yml                # Development orchestration
├── docker-compose.pro.yml            # Production orchestration (new)
├── docker-compose.prod.yml           # Legacy production (deprecated)
├── docker-compose.full.yml           # Full stack with all services
├── Dockerfile                        # [DEPRECATED - see backend/Dockerfile]
├── pyproject.toml                    # [DEPRECATED - see backend/pyproject.toml]
├── [Documentation files]             # Analysis reports, READMEs, etc.
└── ChatSNP                           # Shell script (purpose: unclear)
```

---

## 2. BACKEND STRUCTURE (chatSNP170226/backend/)

**Language:** Python 3.10+  
**Framework:** FastAPI  
**Package Manager:** pip (pyproject.toml)  
**Task Queue:** Celery  

### 2.1 Root Files

```
backend/
├── Dockerfile                        # Multi-stage build, runs uvicorn on port 8000
├── .env.example                      # Backend-specific env template
├── pyproject.toml                    # Project metadata, dependencies, tool config
├── pyrightconfig.json                # Type checking configuration
├── .dockerignore                     # Docker build exclusions
├── README.md                         # Backend-specific documentation
└── .ruff_cache/                      # Linting cache (ruff — line-length=100)
```

### 2.2 Source Code (src/)

```
src/
├── main.py                           # FastAPI app factory, lifespan, routers
├── __init__.py
│
├── api/                              # 📡 ROUTERS & HTTP Endpoints
│   ├── __init__.py
│   ├── chat.py                       # POST /chat/stream (SSE), /sessions/* endpoints
│   ├── admin.py                      # Admin operations, uploads, queue management
│   ├── upload.py                     # File upload + docling processing
│   ├── feedback.py                   # User feedback on responses
│   ├── tts.py                        # Text-to-speech streaming
│   ├── memories.py                   # Mem0 memory CRUD endpoints
│   └── deps.py                       # Dependency injection (get_db, etc.)
│
├── core/                             # ⚙️ INFRASTRUCTURE & CONFIGURATION
│   ├── __init__.py
│   ├── config.py                     # Pydantic Settings, env vars
│   ├── db.py                         # SQLAlchemy engine, async session, Base
│   ├── database_pool.py              # Connection pooling configuration
│   ├── celery_config.py              # Celery broker/backend setup
│   ├── redis_client.py               # Redis connection singleton
│   ├── http_client.py                # HTTPX client for external APIs
│   ├── qdrant_setup.py               # Qdrant vector DB initialization
│   ├── vanna_setup.py                # Vanna (SQL agent) initialization
│   └── mem0_local.py                 # Mem0 local library wrapper
│
├── models/                           # 🗂️ ORM MODELS (SQLAlchemy)
│   ├── __init__.py
│   └── models.py                     # Session, Message, Document, Feedback, Memory ORM models
│
├── schemas/                          # 📋 PYDANTIC SCHEMAS (Request/Response)
│   ├── __init__.py
│   └── schemas.py                    # ChatRequest, ChatResponse, SessionSchema, etc.
│
├── repositories/                     # 🏦 DATA ACCESS LAYER (CRUD)
│   ├── __init__.py
│   ├── sessions.py                   # Session repo: create, list, delete
│   └── messages.py                   # Message repo: save, retrieve, update
│
├── services/                         # 🎯 BUSINESS LOGIC LAYER
│   ├── __init__.py
│   ├── chat_service.py               # Main chat orchestration, agent routing
│   ├── context_builder.py            # Builds context for LLM (search + retrieval)
│   ├── conversation_tree.py          # Maintains branching conversation structure
│   ├── intent_router.py              # Routes query to chat/sql/rag modes
│   ├── chunk_splitter.py             # Document chunking utility
│   ├── parent_chunk_store.py         # Parent-child chunk management
│   ├── docling_service.py            # Document parsing (PDF, PPTX, DOCX, etc.)
│   ├── ocr_service.py                # OCR for scanned documents (PaddleOCR)
│   ├── lida_service.py               # Visualization generation (LIDA library)
│   ├── kreuzberg_service.py          # [Minimal] Placeholder service
│   ├── tts_service.py                # Text-to-speech (edge-tts)
│   │
│   └── search/                       # 🔍 HYBRID SEARCH SUBSYSTEM
│       ├── __init__.py
│       ├── hybrid_search.py          # BM25 + semantic search combination
│       ├── lexical_search.py         # BM25 full-text search (Whoosh)
│       ├── query_enhancer.py         # Query expansion, Vietnamese NLP
│       ├── search_ranking.py         # Ranking/reranking logic
│       └── semantic_cache.py         # Caching semantic search results
│
├── worker/                           # 👷 CELERY TASKS (Async Jobs)
│   ├── __init__.py
│   ├── celery_app.py                 # Celery app initialization
│   ├── tasks.py                      # Task registration
│   ├── chat_tasks.py                 # Long-running chat tasks (chat, context building)
│   ├── data_tasks.py                 # Data indexing tasks
│   ├── media_tasks.py                # Media processing (charts, audio)
│   ├── gardener_tasks.py             # Maintenance tasks (cleanup, optimization)
│   └── helpers.py                    # Task helper functions
│
└── utils/                            # 🛠️ UTILITIES
    ├── __init__.py
    ├── token_estimator.py            # Token counting for context window
    └── summarization.py              # Summarization utilities
```

### 2.3 Tests & Configuration

```
backend/
├── tests/                            # Pytest test suite
│   ├── __pycache__/
│   └── [test files]                  # Unit & integration tests
├── scripts/                          # Utility scripts
├── media/                            # Generated output storage
│   ├── charts/                       # LIDA-generated visualizations
│   ├── tts/                          # Text-to-speech audio files
│   └── uploads/                      # User-uploaded documents
├── .pytest_cache/                    # Pytest cache
└── .venv/                            # Python virtual environment
```

### 2.4 Key Dependencies (pyproject.toml)

**Web & Async:**
- `fastapi[all]` — Web framework
- `uvicorn[standard]` — ASGI server
- `httpx>=0.27.0` — HTTP client

**Database & ORM:**
- `SQLAlchemy[asyncio]>=2.0.0` — ORM
- `asyncpg>=0.29.0` — PostgreSQL async driver
- `alembic>=1.13.0` — DB migrations

**Cache & Message Broker:**
- `redis>=5.0.0` — Cache & Pub/Sub
- `celery[redis]>=5.3.0` — Distributed task queue

**Vector Database & Embeddings:**
- `qdrant-client>=1.9.0` — Vector DB client
- `sentence-transformers>=2.2.0` — Vietnamese embeddings

**AI/ML Services:**
- `vanna[postgres,qdrant,openai]` — SQL agent
- `openai>=1.0.0` — OpenAI SDK
- `docling` — Document parsing
- `lida` — Visualization generation
- `mem0ai` — Memory management
- `langgraph` — LLM orchestration
- `pydantic-ai[openai]` — Agentic framework

**OCR & Media:**
- `paddleocr>=2.7`, `paddlepaddle>=2.6` — OCR
- `edge-tts` — Text-to-speech
- `faster-whisper>=1.0.0` — Speech-to-text

**Search & Text Processing:**
- `whoosh>=2.7.4` — BM25 full-text search
- `tavily-python>=0.3.5` — Web search

---

## 3. FRONTEND STRUCTURE (chatSNP170226/frontend/)

**Language:** TypeScript  
**Framework:** Next.js 15 (App Router)  
**UI Library:** shadcn/ui + Radix UI + TailwindCSS  
**Package Manager:** npm  

### 3.1 Root Files

```
frontend/
├── package.json                      # Dependencies, scripts (npm run dev on port 9002)
├── package-lock.json                 # Dependency lock file
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── jest.config.js                    # Jest testing setup
├── jest.setup.js                     # Jest initialization
├── next-env.d.ts                     # Auto-generated Next.js types
├── tsconfig.tsbuildinfo              # TypeScript build info
├── .next/                            # Build output (cache)
├── .swc/                             # SWC compiler cache
├── node_modules/                     # Dependencies
└── public/                           # Static assets (favicon, etc.)
```

### 3.2 Source Code (src/)

```
src/
├── app/                              # 📄 NEXT.JS 15 APP ROUTER (Pages & Layouts)
│   ├── layout.tsx                    # Root layout (AuthProvider, LanguageProvider)
│   ├── page.tsx                      # Home page (/)
│   ├── globals.css                   # Global TailwindCSS styles
│   │
│   ├── api/                          # Server-side API routes
│   │   └── auth/                     # Authentication endpoints
│   │       ├── signup/route.ts       # POST /api/auth/signup
│   │       ├── login/route.ts        # POST /api/auth/login
│   │       └── reset/route.ts        # POST /api/auth/reset
│   │
│   ├── chat/                         # Chat feature pages
│   │   └── page.tsx                  # Chat interface (/chat)
│   │
│   ├── admin/                        # Admin dashboard
│   │   └── page.tsx                  # Admin panel (/admin)
│   │
│   ├── login/                        # Login page
│   │   └── page.tsx                  # (/login)
│   │
│   ├── signup/                       # Registration page
│   │   └── page.tsx                  # (/signup)
│   │
│   └── forgot-password/              # Password reset page
│       └── page.tsx                  # (/forgot-password)
│
├── components/                       # 🎨 REUSABLE COMPONENTS
│   ├── ui/                           # Shadcn UI Components (38+ files)
│   │   ├── button.tsx, input.tsx, card.tsx
│   │   ├── dialog.tsx, alert-dialog.tsx, sidebar.tsx
│   │   ├── form.tsx, select.tsx, tabs.tsx
│   │   ├── chart.tsx, table.tsx, auto-table.tsx
│   │   ├── carousel.tsx, scroll-area.tsx
│   │   ├── accordion.tsx, alert.tsx, badge.tsx
│   │   ├── checkbox.tsx, radio-group.tsx, switch.tsx
│   │   ├── dropdown-menu.tsx, menubar.tsx
│   │   ├── toast.tsx, toaster.tsx, tooltip.tsx
│   │   ├── calendar.tsx, progress.tsx, skeleton.tsx
│   │   └── [14+ more UI primitives]
│   │
│   ├── chat/                         # Chat-specific components
│   │   ├── chat-ui.tsx               # Main chat interface wrapper
│   │   ├── chat-message-list.tsx     # Message display with streaming
│   │   ├── chat-sidebar.tsx          # Session list sidebar
│   │   ├── chat-composer.tsx         # Message input & attachment
│   │   ├── chat-header.tsx           # Chat header with metadata
│   │   ├── document-sidebar.tsx      # Uploaded documents panel
│   │   ├── llm-response-renderer.tsx # Markdown + code rendering
│   │   ├── feedback-buttons.tsx      # Like/dislike on responses
│   │   ├── branch-navigator.tsx      # Conversation tree navigation
│   │   ├── attachment-preview.tsx    # File preview in composer
│   │   ├── tts-button.tsx            # Text-to-speech button
│   │   ├── message-actions.tsx       # Copy, delete, etc.
│   │   ├── processing-status.tsx     # Loading/processing indicators
│   │   └── types.ts                  # Type definitions
│   │
│   ├── auth-provider.tsx             # Authentication context wrapper
│   ├── auth-layout.tsx               # Auth pages layout wrapper
│   ├── auth-header.tsx               # Header for auth pages
│   ├── login-form.tsx                # Login form component
│   ├── signup-form.tsx               # Registration form component
│   ├── forgot-password-form.tsx      # Password reset form
│   ├── department-selector.tsx       # Department/role selector
│   ├── language-provider.tsx         # i18n context provider
│   ├── language-switcher.tsx         # Language toggle UI
│   ├── error-boundary.tsx            # Error boundary wrapper
│   ├── file-preview-modal.tsx        # Document preview modal
│   ├── typewriter.tsx                # Typewriter animation
│   ├── logo.tsx, snp-logo.tsx        # Logo components
│   ├── vietnam-flag.tsx, uk-flag.tsx # Flag icons
│   └── [other layout components]
│
├── hooks/                            # 🪝 CUSTOM REACT HOOKS
│   ├── use-chat-messages.ts          # Fetch & manage chat messages
│   ├── use-chat-sessions.ts          # Fetch & manage chat sessions
│   ├── use-conversation-tree.ts      # Manage branching conversations
│   ├── use-file-attachment.ts        # Handle file uploads
│   ├── use-chat-search.ts            # Search chat history
│   ├── use-session-stream.ts         # Server-Sent Events streaming
│   ├── use-toast.ts                  # Toast notification hook
│   └── use-mobile.tsx                # Mobile detection hook
│
├── services/                         # 📡 HTTP SERVICES & API CLIENTS
│   ├── chat-backend.ts               # Chat API calls (messages, sessions, stream)
│   ├── admin-backend.ts              # Admin API (queue, status, purge)
│   ├── auth-service.ts               # Authentication service (login, signup, reset)
│   └── file-parser.ts                # Client-side file parsing & extraction
│
├── lib/                              # 🛠️ UTILITIES & FORMATTERS
│   ├── utils.ts                      # General utilities
│   ├── translations.ts               # i18n translations (Vietnamese/English)
│   ├── memory.ts                     # Client-side memory management
│   ├── llm-response-formatter.ts     # Format LLM responses (markdown → HTML)
│   ├── chatsnp-system-prompt.ts      # System prompt templates for LLM
│   └── [other utilities]
│
├── server/                           # 🖥️ SERVER-SIDE UTILITIES
│   └── mock-auth-store.ts            # [DEV] Mock authentication (not JWT)
│
├── ai/                               # 🤖 AI/LLM CLIENT & FLOWS
│   ├── localClient.ts                # Local LLM client (Vercel AI SDK?)
│   └── flows/                        # AI workflow definitions
│       ├── contextual-help.ts        # Context-aware help flow
│       └── multimodal-help.ts        # Multimodal assistance flow
│
├── types/                            # 📝 SHARED TYPE DEFINITIONS
│   └── mem0.d.ts                     # Mem0 type definitions
│
└── styles/                           # 🎨 GLOBAL STYLES
    └── [CSS/SCSS files]
```

### 3.3 Key Dependencies (package.json)

**Core:**
- `next@15.3.3` — React framework (App Router)
- `react@18.3.1`, `react-dom@18.3.1` — React

**UI & Styling:**
- `@radix-ui/*` — 15+ Radix UI components
- `tailwindcss@3.4.1` — Utility CSS framework
- `class-variance-authority@0.7.1` — Component variant system
- `lucide-react@0.475.0` — Icon library
- `clsx@2.1.1`, `tailwind-merge@3.0.1` — Class merging

**Forms & Validation:**
- `react-hook-form@7.54.2` — Form state management
- `@hookform/resolvers@4.1.3` — RHF validation adapters
- `zod@3.24.2` — Schema validation

**Data & Date:**
- `date-fns@3.6.0` — Date utilities
- `recharts@2.15.1` — Charting library
- `xlsx@0.18.5` — Excel file handling

**Document Processing:**
- `pdfjs-dist@5.4.149` — PDF.js viewer
- `pdf-parse@1.1.1` — PDF parsing
- `react-markdown@9.0.1` — Markdown rendering
- `mammoth@1.10.0` — DOCX to HTML
- `docx-preview@0.3.7` — DOCX preview
- `@cyntler/react-doc-viewer@1.17.1` — Multi-format document viewer

**AI & API:**
- `openai@5.20.2` — OpenAI SDK (client-side)

**Other:**
- `embla-carousel-react@8.6.0` — Carousel component
- `file-type@19.6.0` — File type detection
- `dotenv@16.5.0` — Environment variables
- `patch-package@8.0.0` — Patch npm packages

---

## 4. DOCKER ORCHESTRATION

### 4.1 Services Structure

**docker-compose.yml** (Development) — 10 services:

```yaml
Services:
  1. postgres:16                  # PostgreSQL database (Port 5432)
     - Health check: pg_isready
     - Data volume: postgres-data
  
  2. redis:7-alpine               # Cache & message broker (Port 6379)
     - Health check: redis-cli ping
     - Data volume: redis-data
  
  3. qdrant:latest                # Vector database (Port 6333, 6334 gRPC)
     - Health check: TCP on 6333
     - Data volume: qdrant-data
  
  4. mem0:latest                  # Mem0 AI memory service (Port 8888)
     - Depends on: postgres, redis, qdrant
     - Env: AI keys, embedding model, history
  
  5. backend:                     # FastAPI backend (Port 8000)
     - Dockerfile: backend/Dockerfile
     - Depends on: postgres, redis, qdrant, mem0
     - Env: Database URLs, AI keys, chunking params
     - Volume: media/ (charts, TTS, uploads)
  
  6. celery-worker                # Celery task worker
     - Depends on: redis, postgres, backend
     - Env: Broker/backend same as backend
     - Runs: chat_tasks, data_tasks, media_tasks
  
  7. celery-beat                  # Celery scheduler
     - Depends on: redis, postgres
     - Runs: Periodic cleanup & maintenance tasks
  
  8. flower:                      # Celery monitoring UI (Port 5555)
     - Depends on: redis, celery-worker
     - Dashboard: http://localhost:5555
  
  9. frontend:                    # Next.js frontend (Port 9002)
     - Dockerfile: frontend/Dockerfile
     - Depends on: backend
     - Build args: NEXT_PUBLIC_BACKEND_URL, etc.
  
  10. [nginx/reverse-proxy]       # (Optional in some configs)
```

### 4.2 Docker Files

```
docker/
└── initdb/                       # PostgreSQL initialization scripts
    └── [SQL scripts for schema setup]
```

### 4.3 Environment Variables

**Root .env** defines:
- Database credentials (PostgreSQL, Redis, Qdrant)
- AI API keys (OpenAI, OpenRouter, HuggingFace)
- Backend URLs (internal & public)
- Document processing params (Docling)
- Model selections (LLM, embeddings)

---

## 5. CONFIGURATION FILES

### 5.1 Backend Configuration

```
backend/
├── pyproject.toml                # Python dependencies, tool configs
├── pyrightconfig.json            # Pyright type checker
├── .env.example                  # Backend env template
├── Dockerfile                    # Multi-stage Python build
└── .dockerignore
```

### 5.2 Frontend Configuration

```
frontend/
├── package.json                  # npm dependencies, scripts
├── tsconfig.json                 # TypeScript compiler options
├── next.config.ts                # Next.js configuration
├── jest.config.js                # Jest test configuration
└── jest.setup.js
```

### 5.3 Project Root Configuration

```
chatSNP170226/
├── .env                          # Active environment (git-ignored)
├── .env.example                  # Template
├── .env.production               # Production config
├── .env.databases                # Database config (git-ignored)
├── .gitignore                    # Git exclusions
├── docker-compose.yml            # Dev orchestration
├── docker-compose.pro.yml        # Production (updated)
├── docker-compose.prod.yml       # Legacy production
└── docker-compose.full.yml       # Full stack
```

---

## 6. CODE ORGANIZATION PATTERNS

### 6.1 Backend Architecture Pattern

```
API (FastAPI Routers)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Models (SQLAlchemy ORM)
    ↓
Database (PostgreSQL)
```

**Layer Responsibilities:**
- **API Layer** — HTTP endpoints, request validation, response serialization
- **Services Layer** — Business logic, orchestration, external service calls
- **Repositories Layer** — CRUD operations, database queries
- **Models Layer** — ORM definitions, relationships

### 6.2 Frontend Architecture Pattern

```
Pages (App Router)
    ↓
Components (Reusable UI)
    ↓
Hooks (State Management)
    ↓
Services (API Clients)
    ↓
Types (TypeScript definitions)
```

### 6.3 Key Design Patterns

**Backend:**
- **Repository Pattern** — Abstraction over database
- **Service Pattern** — Business logic isolation
- **Dependency Injection** — FastAPI deps for database, config
- **Async/Await** — Throughout (FastAPI, SQLAlchemy async, Celery)
- **Pydantic Models** — Request/response validation
- **CORS Middleware** — Cross-origin request handling

**Frontend:**
- **Server Actions** — Next.js 15 form submissions
- **Custom Hooks** — Encapsulated state & API logic
- **shadcn/ui** — Composable UI components
- **Context API** — Global state (Auth, Language)
- **SSE (Server-Sent Events)** — Real-time chat streaming

---

## 7. KEY FEATURES & MODULES

### 7.1 Core Chat System
- **Intent Routing** — Routes queries to chat/SQL/RAG modes
- **Context Builder** — Retrieves relevant docs via hybrid search
- **Conversation Tree** — Maintains branching conversation structure
- **LLM Integration** — OpenRouter (gpt-4o-mini), Vanna (SQL)

### 7.2 Document Processing
- **Docling Service** — Parses PDF, PPTX, DOCX → structured chunks
- **OCR Service** — PaddleOCR for scanned documents
- **Parent-Child Chunking** — 2-tier retrieval for large documents
- **BM25 + Semantic Hybrid Search** — Whoosh + Qdrant

### 7.3 AI/Memory Services
- **Mem0 Memory** — Local library for persistent user context
- **Vanna SQL Agent** — SQL query generation from natural language
- **LIDA Visualization** — Data visualization generation
- **TTS Service** — edge-tts for text-to-speech

### 7.4 Admin Features
- **Session Management** — Create, list, delete chat sessions
- **Queue Management** — Monitor/purge Celery tasks
- **Upload Management** — Manual document indexing
- **Feedback System** — Collect user ratings on responses

---

## 8. TECHNOLOGY STACK SUMMARY

### Backend Stack
| Component | Technology | Notes |
|-----------|-----------|-------|
| **Framework** | FastAPI | Async-first |
| **Server** | Uvicorn | ASGI server |
| **Database** | PostgreSQL 16 | Async via asyncpg |
| **Cache** | Redis 7 | Pub/Sub + Celery |
| **Vector DB** | Qdrant | For embeddings |
| **Task Queue** | Celery | Async job processing |
| **Monitoring** | Flower | Celery dashboard |
| **ORM** | SQLAlchemy 2.0+ | Async support |
| **Validation** | Pydantic v2 | Request/response |
| **Search** | Whoosh (BM25) | Full-text search |
| **AI/LLM** | OpenRouter (gpt-4o) | Via openai SDK |
| **Embeddings** | Vietnamese_Embedding_v2 | 1024-dim, from HuggingFace |
| **Memory** | Mem0 (local) | Persistent context |
| **Document Processing** | Docling | PDF, PPTX, DOCX parsing |
| **OCR** | PaddleOCR | Scanned document text |
| **Visualization** | LIDA | Data visualization |
| **TTS** | edge-tts | Text-to-speech |
| **Code Quality** | Ruff | Linter (line-length=100) |

### Frontend Stack
| Component | Technology | Notes |
|-----------|-----------|-------|
| **Framework** | Next.js 15 | App Router, Server Actions |
| **Language** | TypeScript | Type-safe |
| **UI Framework** | Shadcn/ui + Radix | Accessible components |
| **Styling** | TailwindCSS 3.4 | Utility-first CSS |
| **Form Handling** | React Hook Form | Lightweight |
| **Validation** | Zod | Schema validation |
| **API Client** | fetch (native) | HTTP requests |
| **Streaming** | SSE (Server-Sent Events) | Real-time chat |
| **State** | React Context API | Global state |
| **Testing** | Jest | Unit tests |
| **Code Quality** | ESLint | Code linting |
| **Document Parsing** | PDF.js, Mammoth, docx-preview | File viewers |
| **Charts** | Recharts | Data visualization |
| **Icons** | Lucide React | Icon library |
| **i18n** | Custom (translations.ts) | Vietnamese/English |

---

## 9. DEPLOYMENT CONFIGURATIONS

### 9.1 Development (docker-compose.yml)
- All services with health checks
- Port mappings for local testing
- Volumes for data persistence
- YAML anchors for DRY env vars

### 9.2 Production (docker-compose.pro.yml)
- Optimized resource limits
- Health checks
- Restart policies
- Production-grade logging

---

## 10. CODE QUALITY & CONVENTIONS

### Backend
- **Linting:** Ruff (line-length=100)
- **Type Checking:** Pyright
- **Testing:** Pytest with async support
- **Format:** Black (via Ruff)
- **Imports:** Organized with I (import sorting)

### Frontend
- **Linting:** ESLint (Next.js config)
- **Type Checking:** TypeScript (tsc --noEmit)
- **Testing:** Jest + React Testing Library
- **Formatting:** Prettier (via ESLint)
- **Import Ordering:** ESLint plugins

---

## 11. NOTABLE OBSERVATIONS

### Strengths
✅ **Clean Layer Separation** — API → Services → Repositories → Models  
✅ **Async Throughout** — FastAPI, SQLAlchemy, Celery  
✅ **Comprehensive AI Stack** — LLM, embeddings, OCR, TTS, memory  
✅ **Production-Ready Docker** — Health checks, networking, volumes  
✅ **Modern Frontend** — Next.js 15, shadcn/ui, TypeScript  
✅ **Hybrid Search** — BM25 + semantic for robustness  
✅ **Vietnamese-First** — Translations, embeddings, prompts  

### Areas for Review
⚠️ **Dependency Count** — 55+ backend deps (bundled/unused?)  
⚠️ **File Size** — chat_tasks.py (44 KB), docling_service.py (33 KB)  
⚠️ **Monolithic Services** — Large services may benefit from splitting  
⚠️ **Type Hints** — Some repos use minimal typing  
⚠️ **Error Handling** — Inconsistent exception handling patterns  
⚠️ **Authentication** — Currently localStorage only (no JWT)  
⚠️ **Documentation** — Many complex functions lack docstrings  
⚠️ **Test Coverage** — Limited test file count relative to src

---

## 12. ENTRY POINTS

### Backend
- `src/main.py` → `create_app()` factory
- Worker: `src/worker/celery_app.py`
- Docker: `uvicorn src.main:app --host 0.0.0.0 --port 8000`

### Frontend
- `src/app/layout.tsx` → Root layout
- Dev: `npm run dev` (Next.js on :9002)
- Build: `npm run build` (static export)
- Docker: Node-based multi-stage build

---

## 13. ENVIRONMENT VARIABLES REQUIRED

**Database:**
- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT
- DATABASE_URL (connection string)

**Cache & Vector DB:**
- REDIS_URL, REDIS_PORT
- QDRANT_URL, QDRANT_HOST, QDRANT_PORT

**AI Services:**
- OPENAI_API_KEY or OPENROUTER_API_KEY
- LLM_MODEL (e.g., "openai/gpt-4o-mini")
- EMBEDDER_MODEL (e.g., "thanhtantran/Vietnamese_Embedding_v2")

**Docling Processing:**
- DOCLING_CHUNK_MAX_TOKENS (default: 2048)
- DOCLING_VLM_ENABLED (for VLM picture filtering)

**Frontend:**
- NEXT_PUBLIC_BACKEND_URL (client-visible)
- BACKEND_INTERNAL_URL (server-side SSR)

---

**End of Analysis**
