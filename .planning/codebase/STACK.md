# ChatSNP - Technology Stack

## Overview
ChatSNP is a monorepo with a full-stack chat application featuring long-term memory, RAG (Retrieval-Augmented Generation), and SQL query capabilities. Architecture spans frontend, backend, AI services, and infrastructure components.

---

## Languages & Runtimes

### Backend (Python)
- **Runtime**: Python 3.10+
- **Primary Location**: `/chatSNP170226/backend/`
- **Configuration**: `pyproject.toml` with setuptools

### Frontend (JavaScript/TypeScript)
- **Runtime**: Node.js 20+
- **Framework**: Next.js 15.3.3
- **TypeScript**: 5.x
- **Primary Location**: `/chatSNP170226/frontend/`
- **Configuration**: `package.json`

### Infrastructure
- **Container Runtime**: Docker & Docker Compose
- **Dockerfiles**: 
  - `/chatSNP170226/backend/Dockerfile` (Python FastAPI)
  - `/chatSNP170226/frontend/Dockerfile` (Next.js)
  - `/chatSNP170226/mem0-service/Dockerfile` (Python Mem0)

---

## Backend Framework & Core Dependencies

### Web Framework
- **FastAPI** (async HTTP server)
- **Uvicorn[standard]** (ASGI server)
- **CORS Middleware** (enabled via `CORSMiddleware`)

### Database & ORM
- **SQLAlchemy[asyncio]** (>=2.0.0) - async ORM
- **asyncpg** (>=0.29.0) - PostgreSQL async driver
- **Alembic** (>=1.13.0) - Database migrations
- **PostgreSQL 16** (Docker image: `postgres:16`)
- **pydantic-settings** (>=2.0.3) - Configuration management

### Caching & Message Broker
- **Redis** (>=5.0.0) - Cache & Celery broker
- **Redis 7-alpine** (Docker image)
- **Redis CLI** healthchecks enabled

### Task Queue
- **Celery[redis]** (>=5.3.0) - Async task processing
- **Flower** (>=2.0.0) - Celery monitoring UI (port 5555)
- **3 Worker Queues**:
  - `chat_priority`: Real-time chat processing (2 concurrency)
  - `data_batch`: SQL queries and data sync (2 concurrency)
  - `media_process`: Document & audio processing (1 concurrency)

### Vector Database
- **Qdrant** (latest Docker image: `qdrant/qdrant`)
  - Collection: `port_knowledge` (document chunks)
  - Collection: `chat_chunks` (session history)
  - Collection: `mem0_memories` (long-term memory, managed by Mem0)
  - Collection: `vanna_schemas_openai` (SQL schema embeddings)
  - Embedding dimension: 1024 (Vietnamese_Embedding_v2)

### HTTP Client
- **httpx** (>=0.27.0) - Async HTTP client for external APIs
- **tenacity** (>=8.2.0) - Retry logic

### AI & ML Services

#### Text-to-SQL
- **Vanna[postgres,qdrant,openai]** - Natural language to SQL
  - LLM: OpenAI/OpenRouter (`openai/gpt-4o-mini` default)
  - Vector store: Qdrant
  - Database: PostgreSQL

#### Data Visualization
- **Lida** - Automatic chart generation from dataframes
  - LLM-based chart suggestions
  - Output stored in `/app/media/charts/`

#### Document Processing
- **Docling** - Deep document understanding
  - Supports: PDF, DOCX, XLSX, PPTX, MD, TXT, images (JPG/PNG)
  - Features:
    - Table detection and adaptive serialization
    - Semantic chunking via HybridChunker
    - VLM integration for images
    - Page structure awareness
  - Configuration env vars: `DOCLING_*` (chunk size, table serialization, etc.)
  - PPTX to PDF conversion via LibreOffice (subprocess call)

#### Speech Processing
- **faster-whisper** (>=1.0.0) - Speech-to-text transcription
  - Used for audio file uploads (`.mp3`, `.wav`, `.m4a`, `.aac`)
- **edge-tts** - Microsoft Edge text-to-speech
  - Vietnamese voice: `vi-VN-HoaiMyNeural`
  - Output format: MP3
  - Streaming response for synchronous requests

#### LLM Integration
- **OpenAI SDK** (>=1.0.0) - OpenAI API client
- **pydantic-ai[openai]** (>=0.0.14) - Agentic framework
  - SQL Agent for query refinement and safety checks
  - Tool calling for database schema inspection
- **OpenRouter API** (alternative LLM provider)
  - Base URL: `https://openrouter.ai/api/v1`
  - Model: `openai/gpt-4o-mini` (default)

#### Memory Management
- **mem0ai** - Long-term memory service
  - REST API at `http://mem0:8000`
  - Endpoints: `/embed`, `/memories`
  - Embedding model: HuggingFace `AITeamVN/Vietnamese_Embedding_v2` (1024 dim)
  - LLM provider: OpenAI/OpenRouter (configured in mem0 service)

#### Embeddings
- **HuggingFace** (via LlamaIndex)
  - Model: `AITeamVN/Vietnamese_Embedding_v2` (Vietnamese tuned, 1024 dim)
  - llama-index-embeddings-huggingface - HuggingFace provider for LlamaIndex
  - Cached via ThreadPoolExecutor for parallel embedding

#### RAG Framework
- **llama-index** (>=0.11.0) - RAG orchestration
- **llama-index-vector-stores-qdrant** - Qdrant integration
- **llama-index-embeddings-huggingface** - Embedding provider

#### Agentic & Search
- **LangGraph** - Graph-based agent orchestration
- **Tavily** (>=0.3.5) - Web search API integration
- **kreuzberg** - Document processing (fallback, not primary)

#### Miscellaneous
- **python-dotenv** (>=1.0.0) - Environment variable loading

### Development & Testing
- **pytest** (>=8.2.0) - Testing framework
- **pytest-asyncio** (>=0.23.0) - Async test support
- **anyio** (>=4.3.0) - Async compatibility
- **ruff** (>=0.5.0) - Fast Python linter
- **Pyright** (type checking, `pyrightconfig.json`)

---

## Frontend Framework & Dependencies

### Core Framework
- **Next.js** 15.3.3 - React framework with SSR/SSG
  - Output: `standalone` (Docker-optimized)
  - Port: 3000 (default), 9002 (dev)
  - Turbopack enabled for dev builds

### React & UI
- **React** 18.3.1 - UI library
- **react-dom** 18.3.1 - DOM rendering

### UI Component Library
- **Radix UI** (16 packages, latest versions)
  - Accordion, Alert Dialog, Avatar, Checkbox, Collapsible, Dialog, Dropdown Menu
  - Label, Menubar, Popover, Progress, Radio Group, Scroll Area, Select, Separator
  - Slider, Slot, Switch, Tabs, Toast, Tooltip
- **class-variance-authority** (0.7.1) - Component variant system
- **lucide-react** (0.475.0) - Icon library

### Forms & Validation
- **react-hook-form** (7.54.2) - Form state management
- **@hookform/resolvers** (4.1.3) - Form validation resolvers
- **zod** (3.24.2) - TypeScript-first schema validation

### Styling
- **Tailwind CSS** (3.4.1) - Utility-first CSS framework
- **tailwindcss-animate** (1.0.7) - Animation utilities
- **tailwind-merge** (3.0.1) - Merge class utilities
- **@tailwindcss/typography** (0.5.14) - Prose styling

### AI & LLM Integration (Frontend)
- **@genkit-ai/googleai** (1.19.2) - Google Generative AI integration
- **openai** (5.20.2) - OpenAI client library

### Document & File Handling
- **pdf-parse** (1.1.1) - PDF extraction
- **pdfjs-dist** (5.4.149) - PDF.js library
- **@cyntler/react-doc-viewer** (1.17.1) - Document viewer
- **docx-preview** (0.3.7) - DOCX preview
- **mammoth** (1.10.0) - DOCX to HTML converter
- **xlsx** (0.18.5) - Excel file parsing
- **file-type** (19.6.0) - File type detection

### Charts & Visualization
- **recharts** (2.15.1) - React charting library
- **embla-carousel-react** (8.6.0) - Carousel component

### Markdown & Rich Text
- **react-markdown** (9.0.1) - Markdown rendering
- **remark-gfm** (4.0.1) - GitHub-flavored Markdown

### Utilities
- **date-fns** (3.6.0) - Date manipulation
- **react-day-picker** (8.10.1) - Date picker
- **clsx** (2.1.1) - Classname utility
- **dotenv** (16.5.0) - Environment variable loading
- **patch-package** (8.0.0) - Patch npm packages

### DevTools & Linting
- **ESLint** 9.39.3 - JavaScript linter
- **eslint-config-next** 15.3.3 - Next.js ESLint config
- **PostCSS** 8 - CSS processing
- **TypeScript** 5 - Type checking

### Testing
- **Jest** (29.7.0) - Test runner
- **jest-environment-jsdom** (29.7.0) - DOM environment for tests
- **@testing-library/react** (16.0.0) - React testing utilities
- **@testing-library/jest-dom** (6.4.8) - DOM matchers

---

## Infrastructure & Deployment

### Docker Compose Configuration
**Primary file**: `/chatSNP170226/docker-compose.yml`

**Services orchestrated**:
1. **postgres** - PostgreSQL 16 (port 5432, health checks enabled)
2. **redis** - Redis 7-alpine (port 6379, persistence enabled)
3. **qdrant** - Qdrant vector DB (ports 6333 HTTP, 6334 gRPC)
4. **mem0** - Mem0 memory service (port 8888)
5. **backend** - FastAPI application (port 8000)
6. **frontend** - Next.js application (port 3000)
7. **worker_chat** - Celery worker for chat tasks
8. **worker_data** - Celery worker for data/SQL tasks
9. **worker_media** - Celery worker for media processing
10. **flower** - Celery monitoring UI (port 5555)
11. **cloudflared** - Cloudflare tunnel for public access

**Named volumes**:
- `postgres-data` - PostgreSQL persistence
- `redis-data` - Redis persistence
- `qdrant-data` - Qdrant storage
- `huggingface-cache` - HuggingFace model cache
- `media-data` - User uploads, charts, TTS outputs

**Alternative compose file**: `/chatSNP170226/docker-compose.pro.yml` (production optimizations)

### Networking
- Default bridge network
- Internal service URLs: `http://service-name:port`
- CORS configured for development origins

### Health Checks
- PostgreSQL: `pg_isready` probe
- Redis: `redis-cli ping` probe
- Qdrant: TCP connection check

### Environment Variables (Primary)
**Location**: `/chatSNP170226/.env`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `REDIS_URL`, `CELERY_BROKER_URL`
- `QDRANT_URL`, `QDRANT_HOST`, `QDRANT_PORT`
- `MEM0_URL`
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`
- `OPENROUTER_API_KEY`, `OPENROUTER_API_BASE`
- `LLM_MODEL` (default: `openai/gpt-4o-mini`)
- `HF_TOKEN` (HuggingFace model downloads)
- `DOCLING_*` (chunking parameters)
- Firebase credentials (frontend)

**Backend env**: `/chatSNP170226/backend/.env.example`
**Frontend env**: `/chatSNP170226/frontend/.env.local.example`
**Mem0 env**: `/chatSNP170226/mem0-service/.env.example`

### Build Configuration

#### Next.js Build
- **Config file**: `/chatSNP170226/frontend/next.config.ts`
- **Features**:
  - Standalone output (Docker-optimized)
  - Rewrites: `/api/backend/*` → backend internal URL
  - Remote image patterns: placehold.co, picsum.photos, imgur.com
  - Webpack canvas externals (for PDF rendering)

#### Python Build
- **Backend Dockerfile**: Multi-stage build
  - Base: Python 3.13 slim
  - Dependencies installed via pip
  - Entrypoint: uvicorn server or celery worker commands

---

## Project Structure

```
/chatSNP170226/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── api/                 # REST endpoints (chat, upload, tts, feedback, admin)
│   │   ├── services/            # Business logic (docling, lida, vanna, mem0)
│   │   ├── worker/              # Celery tasks (chat, data, media, gardener)
│   │   ├── repositories/        # Database access layer
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   └── core/                # Configuration, DB, Redis, Qdrant setup
│   ├── pyproject.toml           # Dependencies & project config
│   ├── Dockerfile               # Container definition
│   └── tests/                   # Unit tests
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities, API clients
│   │   ├── hooks/               # React hooks
│   │   ├── types/               # TypeScript types
│   │   └── styles/              # CSS/Tailwind
│   ├── package.json             # Dependencies
│   ├── next.config.ts           # Next.js configuration
│   ├── tailwind.config.ts       # Tailwind CSS config
│   ├── Dockerfile               # Container definition
│   └── jest.config.js           # Test configuration
├── mem0-service/
│   ├── src/                     # Mem0 service code
│   ├── Dockerfile               # Container definition
│   └── .env.example             # Configuration template
├── docker/
│   └── initdb/                  # Database bootstrap scripts
├── docker-compose.yml           # Development composition
├── docker-compose.pro.yml       # Production composition
└── docs/                        # Documentation

```

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `pyproject.toml` | Backend Python dependencies & setuptools config |
| `package.json` | Frontend Node.js dependencies & npm scripts |
| `.env` | Environment variables (Docker & development) |
| `docker-compose.yml` | Service orchestration for development |
| `docker-compose.pro.yml` | Production-optimized Docker Compose |
| `next.config.ts` | Next.js build & routing configuration |
| `tailwind.config.ts` | Tailwind CSS customization |
| `pyrightconfig.json` | Python type checking configuration |

---

## Summary
ChatSNP uses a **modern, cloud-ready stack** with:
- **Backend**: FastAPI with async database (PostgreSQL), in-memory cache (Redis), vector store (Qdrant)
- **Frontend**: Next.js with Radix UI components and Tailwind CSS
- **Task Processing**: Celery with 3 specialized workers
- **AI/ML**: OpenAI/OpenRouter LLMs, HuggingFace embeddings, Vanna for SQL, Docling for documents, Mem0 for memory
- **Infrastructure**: Docker Compose with full observability (Flower), health checks, and Cloudflare tunneling
- **Languages**: Python 3.10+ (backend), TypeScript/JavaScript (frontend)
