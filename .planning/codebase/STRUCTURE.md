# ChatSNP Directory Structure & Layout

## Project Root Layout

```
/Volumes/orical/ChatSNP/
├── chatSNP170226/                    # Main monorepo directory
│   ├── backend/                      # FastAPI backend service
│   ├── frontend/                     # Next.js frontend application
│   ├── mem0-service/                 # Mem0 memory service wrapper
│   ├── docker/                       # Database initialization scripts
│   ├── docs/                         # Documentation files
│   ├── node_modules/                 # Root-level npm modules (if any)
│   ├── docker-compose.yml            # Development compose file
│   ├── docker-compose.pro.yml        # Production compose file
│   ├── README.md                     # Main project documentation
│   ├── architecture_overview.md      # Architecture overview (Vietnamese)
│   ├── PROJECT_CONTEXT.md            # Project context notes
│   ├── PERFORMANCE_FIX_PLAN.md       # Performance optimization plan
│   ├── .env                          # Environment variables (git ignored)
│   ├── .env.example                  # Environment template
│   ├── .env.databases                # Database credentials (git ignored)
│   ├── .env.databases.example        # Database template
│   ├── .gitignore                    # Git ignore rules
│   └── ChatSNP                       # Executable script/entry point
│
├── .planning/                        # Planning & analysis directory
│   └── codebase/
│       ├── ARCHITECTURE.md           # This architecture document
│       └── STRUCTURE.md              # This structure document
│
├── .claude/                          # Claude Code configuration
│   ├── settings.json                 # Main harness settings
│   ├── settings.local.json           # Local overrides
│   ├── package.json                  # Claude plugins/dependencies
│   └── gsd-file-manifest.json        # File manifest for GSD
│
├── .git/                             # Git repository metadata
├── package-lock.json                 # Root npm lock file (if any)
└── CLAUDE.md                         # Claude Code workspace notes
```

---

## Backend Directory Structure

```
/backend/
├── src/
│   ├── main.py                       # ⭐ FastAPI app factory & entry point
│   │   └─ create_app()               # Initializes FastAPI with middleware, routers
│   │   └─ lifespan()                 # Startup/shutdown lifecycle
│   │
│   ├── api/                          # 🔌 API Layer (Route Handlers)
│   │   ├── __init__.py
│   │   ├── chat.py                   # POST/GET sessions, messages, search
│   │   │   └─ Endpoints:
│   │   │      • POST /sessions (create)
│   │   │      • GET /sessions (list)
│   │   │      • GET /sessions/{id} (retrieve)
│   │   │      • POST /sessions/{id}/messages (create message)
│   │   │      • GET /sessions/{id}/messages (list)
│   │   │      • GET /sessions/{id}/search (semantic search)
│   │   │      • DELETE /sessions/{id} (delete session)
│   │   │
│   │   ├── upload.py                 # File upload & processing
│   │   │   └─ Endpoints:
│   │   │      • POST /upload (file upload)
│   │   │      • GET /documents (list user documents)
│   │   │      • GET /documents/{id} (retrieve document)
│   │   │      • DELETE /documents/{id} (delete document)
│   │   │
│   │   ├── admin.py                  # Admin operations
│   │   │   └─ Endpoints:
│   │   │      • GET /admin/health (system health)
│   │   │      • POST /admin/seed-data (populate test data)
│   │   │
│   │   ├── feedback.py               # User feedback collection
│   │   │   └─ Endpoints:
│   │   │      • POST /feedback (submit feedback)
│   │   │
│   │   ├── tts.py                    # Text-to-speech endpoints
│   │   │   └─ Endpoints:
│   │   │      • POST /tts/generate (generate speech)
│   │   │
│   │   └── deps.py                   # Dependency injection
│   │       └─ get_db_session()       # Async DB session
│   │       └─ get_session_or_404()   # Load session with 404 handling
│   │
│   ├── services/                     # 🧠 Business Logic Layer
│   │   ├── __init__.py
│   │   │
│   │   ├── chat_service.py           # Core chat operations
│   │   │   ├─ ChatService class:
│   │   │   │  • create_session(user_id, dept, title)
│   │   │   │  • list_sessions(user_id)
│   │   │   │  • add_message(session_id, role, content)
│   │   │   │  • semantic_search(query, user_id)
│   │   │   │  • delete_session(session_id)
│   │   │   │
│   │   │   └─ Handles:
│   │   │      • Message creation & storage
│   │   │      • Vector embedding delegation
│   │   │      • Parallel RAG search (Qdrant + Mem0)
│   │   │      • LLM API integration
│   │   │
│   │   ├── docling_service.py        # Document parsing & chunking
│   │   │   ├─ DoclingService class:
│   │   │   │  • process_document(file, user_id)
│   │   │   │  • extract_text(document_path)
│   │   │   │  • chunk_with_metadata()
│   │   │   │  • apply_table_serialization()
│   │   │   │
│   │   │   └─ Features:
│   │   │      • Adaptive table chunking (Markdown vs Triplet)
│   │   │      • Group-lock for row integrity
│   │   │      • Heading context prefixing
│   │   │      • Docling library integration
│   │   │
│   │   ├── lida_service.py           # Data visualization
│   │   │   └─ Generates charts via LIDA AI
│   │   │
│   │   ├── tts_service.py            # Text-to-speech synthesis
│   │   │   └─ Generates audio via OpenAI TTS API
│   │   │
│   │   └── kreuzberg_service.py       # Placeholder service
│   │
│   ├── models/                       # 🗄️ ORM Models (SQLAlchemy)
│   │   ├── __init__.py
│   │   │
│   │   └── models.py                 # All database models
│   │       ├─ ChatSession             # Conversation sessions
│   │       │  • id (UUID PK)
│   │       │  • user_id, department, title
│   │       │  • created_at, updated_at
│   │       │  • meta (JSON - summary, message_count)
│   │       │
│   │       ├─ ChatMessage             # Individual messages
│   │       │  • id (UUID PK)
│   │       │  • session_id (FK → ChatSession)
│   │       │  • role (user|assistant|system)
│   │       │  • content (Text)
│   │       │  • meta (JSON - LLM metadata, token_count)
│   │       │
│   │       ├─ ChatMessageChunk        # Embedded message segments
│   │       │  • id (UUID PK)
│   │       │  • message_id (FK)
│   │       │  • chunk_index
│   │       │  • content (Text)
│   │       │  • vector_id (Qdrant ID)
│   │       │  • meta (JSON - embedding_model, dimension)
│   │       │
│   │       ├─ Document                # Uploaded documents
│   │       │  • id (UUID PK)
│   │       │  • user_id, filename, mime_type
│   │       │  • content (file path on disk)
│   │       │  • processing_status (pending|completed|failed)
│   │       │  • meta (JSON - page_count, table_count)
│   │       │
│   │       ├─ DocumentChunk           # Extracted document segments
│   │       │  • id (UUID PK)
│   │       │  • document_id (FK)
│   │       │  • chunk_index
│   │       │  • content
│   │       │  • vector_id (Qdrant ID)
│   │       │
│   │       └─ Feedback                # User feedback
│   │          • id, user_id
│   │          • message_id (optional, for message rating)
│   │          • rating (1-5), comment
│   │
│   ├── repositories/                 # 💾 Data Access Layer (Repository Pattern)
│   │   ├── __init__.py
│   │   │
│   │   ├── sessions.py               # Session CRUD
│   │   │   ├─ SessionRepository:
│   │   │   │  • create(user_id, dept, title)
│   │   │   │  • get_by_id(session_id)
│   │   │   │  • list_by_user(user_id)
│   │   │   │  • delete(session_id)
│   │   │   │  • update_metadata(session_id, meta)
│   │   │
│   │   └── messages.py               # Message CRUD
│   │       ├─ MessageRepository:
│   │       │  • create(session_id, role, content)
│   │       │  • list_by_session(session_id)
│   │       │  • get_by_id(message_id)
│   │       │  • search_by_vector_id(vector_id)
│   │
│   ├── schemas/                      # 📝 Pydantic Models (Validation)
│   │   ├── __init__.py
│   │   │
│   │   └── schemas.py                # All request/response models
│   │       ├─ SessionCreate          # POST /sessions request
│   │       ├─ SessionSchema          # Session response
│   │       ├─ SessionWithMessages    # Expanded session with messages
│   │       ├─ MessageCreate          # POST /messages request
│   │       ├─ MessageSchema          # Message response
│   │       ├─ SearchQuery            # Search request
│   │       ├─ SearchResult           # Search result item
│   │       └─ ... (other schemas)
│   │
│   ├── core/                         # ⚙️ Infrastructure & Configuration
│   │   ├── __init__.py
│   │   │
│   │   ├── config.py                 # Settings management
│   │   │   └─ Settings (Pydantic BaseSettings):
│   │   │      • database_url
│   │   │      • redis_url
│   │   │      • qdrant_url
│   │   │      • mem0_url
│   │   │      • llm_model
│   │   │      • openrouter_api_key
│   │   │      • allowed_origins (CORS)
│   │   │      • docling_chunk_max_tokens
│   │   │      • ... (50+ settings)
│   │   │
│   │   ├── db.py                     # Database initialization
│   │   │   ├─ Base (SQLAlchemy declarative)
│   │   │   ├─ get_engine()           # Async engine factory
│   │   │   ├─ get_session()          # Session factory
│   │   │   ├─ create_tables()        # Init schema
│   │   │   └─ lifespan context
│   │   │
│   │   ├── redis_client.py           # Redis connection
│   │   │   └─ get_redis()            # Redis client factory
│   │   │
│   │   ├── qdrant_setup.py           # Qdrant configuration
│   │   │   ├─ get_qdrant_client()    # Qdrant client
│   │   │   ├─ ensure_collections()   # Create collections if missing
│   │   │   └─ Collections:
│   │   │      • chat_chunks (short-term message recall)
│   │   │      • mem0_memories (long-term memory)
│   │   │
│   │   ├── mem0_config.py            # Mem0 service wrapper
│   │   │   └─ get_mem0_client()      # HTTP client to Mem0 service
│   │   │
│   │   ├── celery_config.py          # Celery configuration
│   │   │   ├─ CeleryConfig class
│   │   │   └─ Task routing rules
│   │   │
│   │   ├── http_client.py            # HTTP client utilities
│   │   │   └─ httpx AsyncClient wrapper
│   │   │
│   │   ├── database_pool.py          # Connection pooling
│   │   │   └─ SQLAlchemy QueuePool config
│   │   │
│   │   └── vanna_setup.py            # Vanna SQL agent
│   │       └─ SQL-to-natural-language interface
│   │
│   ├── worker/                       # 🔄 Celery Task Definitions (Async Processing)
│   │   ├── __init__.py
│   │   │
│   │   ├── celery_app.py             # ⭐ Celery app instance
│   │   │   ├─ Broker: Redis
│   │   │   ├─ Result backend: Redis
│   │   │   └─ Task discovery: auto
│   │   │
│   │   ├── chat_tasks.py             # Chat background tasks
│   │   │   ├─ @task embed_and_store_message()
│   │   │   │  └─ Calls Mem0 embedding, saves to Qdrant & PG
│   │   │   ├─ @task extract_user_memory()
│   │   │   │  └─ Calls Mem0 memory extraction (LLM)
│   │   │   └─ @task generate_session_summary()
│   │   │      └─ Summarizes chat for context
│   │   │
│   │   ├── data_tasks.py             # Data processing tasks
│   │   │   ├─ @task process_document()
│   │   │   │  └─ Docling extraction, chunking, embedding
│   │   │   └─ @task re_index_documents()
│   │   │      └─ Batch re-processing after config changes
│   │   │
│   │   ├── media_tasks.py            # Media generation tasks
│   │   │   ├─ @task generate_chart()
│   │   │   │  └─ LIDA visualization
│   │   │   └─ @task generate_tts_audio()
│   │   │      └─ OpenAI TTS synthesis
│   │   │
│   │   ├── gardener_tasks.py         # Maintenance tasks
│   │   │   ├─ @task cleanup_old_sessions()
│   │   │   │  └─ Delete sessions > 90 days old
│   │   │   └─ @task compact_qdrant_vectors()
│   │   │      └─ Qdrant maintenance
│   │   │
│   │   └── helpers.py                # Shared task utilities
│   │       ├─ retry_with_backoff()
│   │       ├─ log_task_progress()
│   │       └─ error_handler()
│   │
│   └── __init__.py
│
├── tests/                            # 🧪 Unit & Integration Tests
│   ├── test_main.py
│   ├── test_chat.py
│   ├── test_services.py
│   └── conftest.py                   # Pytest fixtures
│
├── media/                            # 📁 Generated media (mounted volume)
│   ├── charts/                       # Generated chart images
│   ├── tts/                          # Generated audio files
│   └── uploads/                      # User-uploaded files
│
├── Dockerfile                        # ✨ Container image
│   └─ Base: python:3.11-slim
│   └─ CMD: uvicorn src.main:app
│
├── requirements.txt                  # Python dependencies (300+ packages)
│   ├─ fastapi, uvicorn
│   ├─ sqlalchemy, asyncpg
│   ├─ redis, celery
│   ├─ pydantic, tenacity
│   ├─ openai, qdrant-client
│   ├─ mem0, docling, lida
│   └─ ... (and 280+ more)
│
├── pyproject.toml                    # Project metadata
├── .env.example                      # Environment template
├── README.md                         # Backend setup guide
└── .gitignore
```

---

## Frontend Directory Structure

```
/frontend/
├── src/
│   ├── app/                          # 📄 Next.js App Router (Pages & Layouts)
│   │   ├── layout.tsx                # ⭐ Root layout
│   │   │   └─ AuthProvider, LanguageProvider wrappers
│   │   │
│   │   ├── page.tsx                  # Landing page
│   │   │   └─ GET / (unauthenticated root)
│   │   │
│   │   ├── chat/
│   │   │   └── page.tsx              # Main chat interface
│   │   │       └─ GET /chat (authenticated)
│   │   │       └─ Displays session, messages, input form
│   │   │
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin dashboard
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx              # Login form
│   │   │       └─ POST to /api/auth/login (server route)
│   │   │
│   │   ├── signup/
│   │   │   └── page.tsx              # Registration form
│   │   │       └─ POST to /api/auth/signup (server route)
│   │   │
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # Password recovery
│   │   │
│   │   ├── api/                      # 🔌 Server-Side Route Handlers (Route Groups)
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       │   └── route.ts      # POST /api/auth/login
│   │   │       │       └─ Validates credentials → calls backend
│   │   │       ├── signup/
│   │   │       │   └── route.ts      # POST /api/auth/signup
│   │   │       ├── reset/
│   │   │       │   └── route.ts      # POST /api/auth/reset
│   │   │       └── logout/
│   │   │           └── route.ts      # POST /api/auth/logout
│   │   │
│   │   ├── actions.ts                # 🔒 Server Actions (for secure backend calls)
│   │   │   ├─ createSession()        # Create chat session
│   │   │   ├─ getSessionMessages()   # Fetch messages
│   │   │   ├─ sendMessage()          # Send user message
│   │   │   ├─ uploadDocument()       # Upload file
│   │   │   └─ deleteSession()        # Delete session
│   │   │       └─ All wrap backend API calls
│   │   │
│   │   ├── globals.css               # Global TailwindCSS styles
│   │   ├── favicon.ico               # Site icon
│   │   └── .next/                    # (git ignored) Build output
│   │
│   ├── components/                   # 🧩 Reusable React Components
│   │   ├── auth-layout.tsx           # Authentication UI wrapper
│   │   ├── auth-provider.tsx         # Context provider for auth state
│   │   ├── language-provider.tsx     # Internationalization provider
│   │   ├── chat-input.tsx            # Message input form
│   │   ├── chat-message.tsx          # Message display component
│   │   ├── chat-sidebar.tsx          # Session list sidebar
│   │   ├── sidebar.tsx               # Navigation sidebar
│   │   ├── button.tsx                # Base button component
│   │   ├── card.tsx                  # Reusable card wrapper
│   │   ├── dialog.tsx                # Modal dialog component
│   │   ├── input.tsx                 # Form input field
│   │   ├── select.tsx                # Select dropdown
│   │   ├── tabs.tsx                  # Tab navigation
│   │   ├── toast.tsx                 # Toast notifications
│   │   ├── loading-spinner.tsx       # Loading indicator
│   │   ├── empty-state.tsx           # Empty state UI
│   │   ├── error-boundary.tsx        # Error handling wrapper
│   │   ├── admin-panel.tsx           # Admin dashboard layout
│   │   ├── document-viewer.tsx       # Document preview
│   │   ├── chart-renderer.tsx        # Chart display
│   │   └── ... (30+ more components)
│   │
│   ├── hooks/                        # 🎣 Custom React Hooks
│   │   ├── useAuth.ts                # Authentication context hook
│   │   ├── useChat.ts                # Chat state management
│   │   ├── useSessions.ts            # Session list management
│   │   ├── useLocalStorage.ts        # Local storage wrapper
│   │   ├── useMediaQuery.ts          # Responsive breakpoints
│   │   ├── useToast.ts               # Toast notification trigger
│   │   ├── useForm.ts                # Form state wrapper (react-hook-form)
│   │   └── useDebounce.ts            # Debounce utility
│   │
│   ├── services/                     # 🛠️ API Client & Business Logic
│   │   ├── chat-backend.ts           # Chat API client
│   │   │   ├─ export class ChatAPI {
│   │   │   │    • createSession(payload)    → POST /sessions
│   │   │   │    • listSessions(userId)      → GET /sessions?user_id=...
│   │   │   │    • getSession(id)            → GET /sessions/{id}
│   │   │   │    • sendMessage(id, msg)      → POST /sessions/{id}/messages
│   │   │   │    • getMessages(id)           → GET /sessions/{id}/messages
│   │   │   │    • searchMessages(query)     → GET /sessions/{id}/search?q=...
│   │   │   │    • deleteSession(id)         → DELETE /sessions/{id}
│   │   │   │  }
│   │   │
│   │   ├── auth-service.ts           # Authentication logic
│   │   │   ├─ login(email, password)
│   │   │   ├─ signup(email, password, name)
│   │   │   ├─ logout()
│   │   │   ├─ resetPassword(email)
│   │   │   └─ getAuthToken()         → retrieves JWT from localStorage
│   │   │
│   │   ├── admin-backend.ts          # Admin API client
│   │   │   ├─ getSystemHealth()      → GET /admin/health
│   │   │   ├─ seedData()             → POST /admin/seed-data
│   │   │   └─ getAnalytics()         → GET /admin/analytics
│   │   │
│   │   ├── file-parser.ts            # Client-side file processing
│   │   │   ├─ parseExcel(file)       → xlsx library
│   │   │   ├─ parsePDF(file)         → pdf-parse library
│   │   │   ├─ parseDOCX(file)        → mammoth library
│   │   │   └─ detectMimeType(file)   → file-type library
│   │   │
│   │   └── ... (other service modules)
│   │
│   ├── lib/                          # 🔧 Utility Functions
│   │   ├── utils.ts                  # Helper functions (clsx, format, etc.)
│   │   ├── constants.ts              # Global constants (API URLs, limits)
│   │   ├── format.ts                 # Data formatting utilities
│   │   ├── validation.ts             # Form validation schemas (Zod)
│   │   └── api.ts                    # API client base configuration
│   │
│   ├── types/                        # 📋 TypeScript Type Definitions
│   │   ├── index.ts                  # Main types export
│   │   ├── api.ts                    # API response types
│   │   ├── chat.ts                   # Chat-related types
│   │   ├── user.ts                   # User types
│   │   ├── document.ts               # Document types
│   │   └── ... (other type files)
│   │
│   ├── server/                       # 🖥️ Server-Side Code (server imports only)
│   │   └── backend-client.ts         # Backend API client (server-only calls)
│   │
│   ├── styles/                       # 🎨 Global Styles
│   │   ├── globals.css               # Global CSS
│   │   ├── tailwind.css              # TailwindCSS imports
│   │   └── variables.css             # CSS variables (colors, spacing)
│   │
│   ├── ai/                           # 🤖 AI/Genkit Integration
│   │   └── dev.ts                    # Genkit AI development server
│   │
│   └── (other root-level config files)
│
├── public/                           # 📦 Static assets (images, fonts, etc.)
│   ├── logo.png
│   ├── favicon.ico
│   ├── images/
│   ├── fonts/
│   └── ... (static files)
│
├── .next/                            # (git ignored) Next.js build cache
├── node_modules/                     # (git ignored) npm packages (600+ packages)
├── .swc/                             # (git ignored) SWC compiler cache
│
├── Dockerfile                        # ✨ Container image
│   └─ Base: node:20-alpine
│   └─ CMD: npm run start
│
├── Dockerfile.dev                    # Development Dockerfile
│   └─ For development with hot reload
│
├── next.config.js                    # Next.js configuration
│   ├─ Turbopack enabled (--turbopack)
│   ├─ Custom webpack config
│   └─ API route configuration
│
├── tailwind.config.ts                # TailwindCSS configuration
│   ├─ Custom theme (colors, spacing)
│   ├─ Content paths
│   └─ Plugins (typography, forms)
│
├── tsconfig.json                     # TypeScript configuration
│   ├─ target: ES2020
│   ├─ lib: ES2020, DOM, DOM.Iterable
│   ├─ paths: alias resolution (@/*, @components/*, etc.)
│   └─ strict: true
│
├── postcss.config.js                 # PostCSS configuration
│   ├─ tailwindcss plugin
│   └─ autoprefixer plugin
│
├── jest.config.js                    # Jest test configuration
│   └─ testEnvironment: jsdom
│
├── .eslintrc.json                    # ESLint configuration
│   ├─ extends: next/core-web-vitals
│   └─ rules: ...
│
├── package.json                      # npm dependencies & scripts
│   ├─ "dev": "next dev --turbopack -p 9002"
│   ├─ "build": "next build"
│   ├─ "start": "next start"
│   ├─ "lint": "next lint"
│   ├─ "test": "jest"
│   └─ 60+ dependencies (React, Radix UI, TailwindCSS, etc.)
│
├── .env.local.example                # Environment template (dev)
├── .gitignore                        # Git ignore rules
├── README.md                         # Frontend setup guide
└── package-lock.json                 # npm lock file
```

---

## Mem0 Service Directory Structure

```
/mem0-service/
├── main.py                           # ⭐ FastAPI app wrapper around Mem0 library
│   ├─ FastAPI app with endpoints:
│   │  • GET / (redirect to /docs)
│   │  • POST /embed (convert text → embeddings)
│   │  • POST /add (add to memory with LLM extraction)
│   │  • POST /search (query memory store)
│   │  • GET /memory/{user_id} (retrieve all memories)
│   │
│   ├─ Mem0 initialization:
│   │  • Config from environment variables
│   │  • Vector store: Qdrant
│   │  • Embedder: HuggingFace Vietnamese_Embedding_v2
│   │  • LLM: OpenRouter/OpenAI for memory extraction
│   │
│   └─ Pydantic models:
│      • EmbedRequest, EmbedResponse
│      • AddMemoryRequest, AddMemoryResponse
│      • SearchRequest, SearchResult
│
├── packages/                         # (Optional) Additional Mem0 packages
│   └─ Custom Mem0 extensions
│
├── history/                          # 📊 SQLite history database (persistent)
│   └─ history.db                     # Stores memory operation logs
│
├── Dockerfile                        # ✨ Container image
│   └─ Base: python:3.11-slim
│   └─ Pre-downloads HuggingFace model to cache
│   └─ CMD: uvicorn main:app
│
├── requirements.txt                  # Python dependencies
│   ├─ mem0-ai
│   ├─ fastapi, uvicorn
│   ├─ qdrant-client
│   ├─ transformers (for HF models)
│   ├─ openai
│   └─ (other 30+ packages)
│
├── .env.example                      # Environment template
├── .gitignore
└── README.md
```

---

## Docker Configuration

```
/docker/
└── initdb/                           # 📊 Database initialization scripts
    └── *.sql                         # SQL init scripts for PostgreSQL
        ├─ Schema creation
        ├─ Seed data (optional)
        └─ Index creation

/docker-compose.yml                  # Development Compose (with code binding)
├─ Services:
│  ├─ postgres:16 (port 5432)
│  ├─ redis:7-alpine (port 6379)
│  ├─ qdrant:latest (ports 6333, 6334)
│  ├─ mem0 (port 8888)
│  ├─ backend (port 8000)
│  ├─ frontend (port 3000)
│  ├─ worker_chat (background)
│  ├─ worker_data (background)
│  ├─ worker_media (background)
│  ├─ flower (port 5555 - monitoring)
│  └─ nginx (port 80, optional)
│
├─ Volumes:
│  ├─ postgres-data
│  ├─ redis-data
│  ├─ qdrant-data
│  ├─ huggingface-cache (HF models persist)
│  └─ media-data (generated files)
│
└─ Environment anchors:
   └─ x-common-env (shared env vars for all services)

/docker-compose.pro.yml             # Production Compose (no code binding)
├─ Differences from dev:
│  ├─ Build from published images
│  ├─ No volume binding to source code
│  ├─ Optimized resource limits
│  ├─ Health checks configured
│  └─ Production-grade logging
```

---

## Documentation Files

```
/docs/
├── README.md                        # Getting started guide
├── ARCHITECTURE.md                  # Architecture details (Vietnamese)
├── API.md                           # API endpoint documentation
├── DEPLOYMENT.md                    # Deployment guide
└── ... (other docs)

/chatSNP170226/
├── README.md                        # Main monorepo documentation
├── architecture_overview.md         # Architecture in Vietnamese
├── PROJECT_CONTEXT.md               # Project context & notes
├── PERFORMANCE_FIX_PLAN.md          # Performance optimization plan
└── test_fix_verification.md         # Test verification notes
```

---

## Key Naming Conventions

### Python Files (`backend/src/`)
- **Files**: `snake_case.py` (e.g., `chat_service.py`, `qdrant_setup.py`)
- **Classes**: `PascalCase` (e.g., `ChatService`, `ChatSession`)
- **Functions**: `snake_case` (e.g., `create_session`, `get_by_id`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_CHUNK_SIZE`)
- **Modules**: Organized by layer (api, services, models, etc.)

### TypeScript/JavaScript Files (`frontend/src/`)
- **Files**: `kebab-case.ts(x)` (e.g., `chat-service.ts`, `chat-input.tsx`)
- **Classes**: `PascalCase` (e.g., `ChatAPI`, `AuthProvider`)
- **Functions**: `camelCase` (e.g., `createSession`, `getById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_TIMEOUT`)
- **React Components**: `PascalCase` file + component (e.g., `ChatMessage.tsx`)
- **Types**: `PascalCase` + suffix (e.g., `ChatSessionType`, `MessageProps`)

### Database
- **Tables**: `snake_case_plural` (e.g., `chat_sessions`, `chat_messages`)
- **Columns**: `snake_case` (e.g., `user_id`, `created_at`)
- **Indexes**: `ix_{table}_{columns}` (e.g., `ix_chat_sessions_user_id`)
- **Foreign Keys**: `fk_{table}_{ref_table}` (e.g., `fk_chat_messages_chat_sessions`)

### API Endpoints
- **Base**: `/api/v1` (versioned)
- **Resource Routes**: `/resources`, `/resources/{id}`
- **Sub-resources**: `/resources/{id}/sub-resources`
- **Actions**: `/resources/{id}/action` (POST method)

### Environment Variables
- **Format**: `UPPER_SNAKE_CASE`
- **Scope Prefix**: 
  - `POSTGRES_*` → Database
  - `REDIS_*` → Cache
  - `QDRANT_*` → Vector store
  - `OPENAI_*`, `OPENROUTER_*` → LLM APIs
  - `NEXT_PUBLIC_*` → Exposed to frontend
  - `DOCLING_*` → Document processing
  - `LLM_*` → LLM configuration

---

## File Size & Complexity Reference

| File | Size | Complexity | Purpose |
|------|------|-----------|---------|
| `backend/src/main.py` | ~150 lines | Low | App factory, middleware setup |
| `backend/src/services/chat_service.py` | ~250 lines | Medium | Core chat logic |
| `backend/src/services/docling_service.py` | ~1000 lines | High | Document processing |
| `backend/src/worker/chat_tasks.py` | ~300 lines | High | Async task definitions |
| `frontend/src/app/chat/page.tsx` | ~400 lines | Medium | Main chat UI |
| `frontend/src/services/chat-backend.ts` | ~200 lines | Low | API client wrapper |

---

## Import Patterns

### Backend (Python)
```python
# Relative imports within module
from src.services.chat_service import ChatService
from src.models.models import ChatMessage
from src.core.config import get_settings
from src.schemas.schemas import MessageCreate

# Standard library & third-party
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
```

### Frontend (TypeScript)
```typescript
// Absolute imports with path aliases (@/)
import { ChatAPI } from '@/services/chat-backend';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/card';
import type { ChatSession } from '@/types/chat';

// Standard library & third-party
import { useEffect, useState } from 'react';
import { toast } from 'sonner'; // or react-hot-toast
```

---

## Build & Deployment Artifacts

### Backend
- **Image Name**: `chatsnp-backend`
- **Entry Point**: `uvicorn src.main:app`
- **Exposed Port**: 8000 (HTTP)
- **Volumes**:
  - `/app` (source code)
  - `/app/media` (generated files)

### Frontend
- **Image Name**: `chatsnp-frontend`
- **Build Output**: `.next/` directory
- **Entry Point**: `npm run start`
- **Exposed Port**: 3000 (HTTP)
- **Static Assets**: `public/` directory

### Mem0 Service
- **Image Name**: `chatsnp-mem0`
- **Entry Point**: `uvicorn main:app`
- **Exposed Port**: 8000 (HTTP)
- **Volumes**:
  - `/root/.cache/huggingface` (model cache)
  - `/app/history` (SQLite database)

---

## Development Workflow Structure

```
Development Environment:
├── Docker containers (dev compose with code binding)
├─→ Code changes hot-reloaded in containers
├─→ Frontend: Next.js dev server with Turbopack
├─→ Backend: FastAPI with --reload flag
├─→ Mem0: Container-based (restart required for changes)
├─→ Workers: Celery with --loglevel=info
└─→ Monitoring: Flower dashboard on :5555

Production Environment:
├── Docker containers (pro compose, no code binding)
├─→ Pre-built images from registry
├─→ Immutable deployments
├─→ Load balancing layer (Nginx/Caddy)
├─→ Resource limits enforced
└─→ Structured logging & monitoring
```

---

## Conclusion

The ChatSNP project follows a **clean, layered architecture** with:

✅ **Clear separation of concerns** (API → Services → Models → Repositories)  
✅ **Consistent naming conventions** across Python/TypeScript  
✅ **Modular directory structure** supporting independent scaling  
✅ **Docker-based infrastructure** for reproducible deployments  
✅ **Type safety** (Pydantic + TypeScript)  
✅ **Async-first design** for performance  

This structure makes it easy to:
- **Navigate** the codebase
- **Onboard** new developers
- **Test** individual components
- **Scale** specific services
- **Maintain** long-term
