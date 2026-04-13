# ChatSNP Codebase Conventions

## Overview
ChatSNP is a full-stack chat application with Vietnamese support, featuring real-time messaging, document processing, RAG capabilities, and AI integrations. The codebase is organized into backend (FastAPI/Python), frontend (Next.js/TypeScript), and auxiliary services.

**Project Structure:**
- `chatSNP170226/backend/` - FastAPI backend with async SQLAlchemy
- `chatSNP170226/frontend/` - Next.js 15 with TypeScript and React 18
- `chatSNP170226/docker/` - Docker configurations
- `chatSNP170226/tests/` - Backend test suite

---

## Backend Conventions (Python/FastAPI)

### Code Style & Formatting

**Python Version:** 3.10+ (configured in `pyproject.toml`)

**Linting & Formatting:**
- **Tool:** Ruff (`ruff>=0.5.0`)
- **Configuration:** `pyproject.toml` [tool.ruff] section
- **Line Length:** 100 characters
- **Target Version:** py310
- **Rules Selected:** E (errors), F (PyFlakes), W (warnings), I (import sorting)

**Code in:** `chatSNP170226/backend/pyproject.toml`
```toml
[tool.ruff]
line-length = 100
target-version = "py310"

[tool.ruff.lint]
select = ["E", "F", "W", "I"]
```

### Import Organization

- Future annotations: `from __future__ import annotations` (used throughout)
- Standard library imports first
- Third-party imports (fastapi, sqlalchemy, pydantic, httpx, etc.)
- Local imports last (from `src.*`)
- **Example:** `chatSNP170226/backend/src/api/chat.py`

### Naming Conventions

**Modules & Files:**
- snake_case for all Python files
- Grouped by domain: `api/`, `repositories/`, `services/`, `models/`, `schemas/`, `core/`, `worker/`

**Classes:**
- PascalCase for all classes
- Repository suffix: `SessionRepository`, `MessageRepository`
- Service suffix: `ChatService`, `DoclingService`, `LidaService`, `TTSService`
- Schema suffix: `MessageSchema`, `SessionSchema`, `SearchQuery`, `SearchResult`
- Model suffix: `ChatSession`, `ChatMessage`, `ChatMessageChunk`, `Document`, `MessageFeedback`

**Functions & Methods:**
- snake_case for all functions and methods
- Descriptive names with action verbs: `create_session()`, `list_sessions()`, `get_session_or_404()`
- Private methods prefixed with single underscore: `_cache_key()`
- Async functions prefixed with `async def`

**Variables:**
- snake_case for local variables
- Hungarian-style prefixes for UI state (frontend): e.g., `setMessages`, `messagesLoading`
- Type hints used throughout: `session_id: UUID`, `user_id: str | None`

### Type Hints & Type Checking

**Type Checking Tool:** Pyright (basic mode)
- **Configuration:** `pyrightconfig.json`
- **Python Version:** 3.13
- **Mode:** basic
- **Warnings:** Missing imports and module sources

**Backend Type Hints Pattern:**
```python
from typing import Optional, Any, Literal
from uuid import UUID

class MessageCreate(BaseModel):
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    mode: Literal["chat", "sql", "rag"] = "chat"
```

### Architecture Patterns

#### 1. **Dependency Injection (FastAPI)**
Used throughout API layer with `Depends()` pattern:
```python
# File: chatSNP170226/backend/src/api/deps.py
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session

async def get_session_or_404(
    session_id: UUID, db: AsyncSession = Depends(get_db_session)
):
    # Raises HTTPException(404) if not found
    repo = SessionRepository(db)
    session = await repo.get_session(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session
```

#### 2. **Repository Pattern**
Data access abstraction layer:
```python
# File: chatSNP170226/backend/src/repositories/sessions.py
class SessionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create_session(self, *, user_id: str | None, ...):
        chat_session = ChatSession(...)
        self.session.add(chat_session)
        await self.session.flush()
        return chat_session
```

Methods follow patterns:
- `create_*()` - insert with flush
- `get_*()` - single record or None
- `list_*()` - multiple records
- `count_*()` - count queries
- `update_*()` - update operations
- `delete_*()` - delete operations

#### 3. **Service Layer**
Business logic encapsulation with injected dependencies:
```python
# File: chatSNP170226/backend/src/services/chat_service.py
class ChatService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.settings = get_settings()
        self.session_repo = SessionRepository(session)
        self.message_repo = MessageRepository(session)
        self.redis = get_redis()
    
    async def create_session(self, user_id: str | None, ...):
        return await self.session_repo.create_session(...)
    
    async def add_message(self, session_id: UUID, message: MessageCreate, **kwargs):
        # Business logic: cache management, task dispatch
        db_message = await self.message_repo.create_message(...)
        # Update Redis cache
        cache_key = self._cache_key(session_id)
        # Dispatch async tasks
        mode = getattr(message, 'mode', 'chat')
        if mode == "sql":
            from src.worker.tasks import run_sql_query
            run_sql_query.delay(...)
```

#### 4. **SQLAlchemy ORM with Async**
- All sessions are `AsyncSession`
- Models use mapped columns and relationships
- Auto-timestamped fields with `datetime.now(timezone.utc)`
- JSON fields for flexible metadata storage

```python
# File: chatSNP170226/backend/src/models/models.py
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    __table_args__ = (Index("ix_chat_sessions_user_updated", "user_id", "updated_at"),)
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[Optional[str]] = mapped_column(String(255), index=True, nullable=True)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
```

#### 5. **Pydantic for Request/Response Validation**
All schemas inherit from `BaseModel` with `ConfigDict(from_attributes=True)`:
```python
# File: chatSNP170226/backend/src/schemas/schemas.py
class MessageSchema(BaseModel):
    id: UUID
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
```

#### 6. **Configuration Management**
Environment-based with Pydantic Settings:
```python
# File: chatSNP170226/backend/src/core/config.py
class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")
    llm_model: str = Field("openai/gpt-5-nano", alias="LLM_MODEL")
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="allow")
    
    @field_validator("database_url")
    @classmethod
    def ensure_asyncpg(cls, value: str) -> str:
        # Transform postgresql:// to postgresql+asyncpg://
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

#### 7. **HTTP Client Management**
Shared connection pooling patterns:
```python
# File: chatSNP170226/backend/src/core/http_client.py
_sync_client: httpx.Client | None = None
_async_client: httpx.AsyncClient | None = None
_DEFAULT_TIMEOUT: float = 60.0

def get_async_http_client(timeout: float = _DEFAULT_TIMEOUT) -> httpx.AsyncClient:
    global _async_client
    if _async_client is None:
        _async_client = httpx.AsyncClient(
            timeout=timeout,
            limits=httpx.Limits(
                max_keepalive_connections=20,
                max_connections=100,
                keepalive_expiry=30.0,
            ),
        )
    return _async_client
```

### Error Handling

**HTTP Exceptions:**
- Use FastAPI `HTTPException` with status codes
- Return JSON-structured responses
- Standard status codes: 201 (created), 400 (bad request), 404 (not found), 500 (server error)

```python
# Example from chatSNP170226/backend/src/api/chat.py
if not user_id:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id required")

if not session:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
```

**Async Task Error Handling:**
- Celery tasks with retry logic (uses `tenacity>=8.2.0`)
- Graceful degradation for LLM timeouts

**Logging:**
- Standard library `logging` module
- Logger per module: `logger = logging.getLogger(__name__)`
- Log levels used appropriately

---

## Frontend Conventions (TypeScript/React/Next.js)

### Code Style & Formatting

**Environment:**
- **Framework:** Next.js 15.3.3
- **React:** 18.3.1
- **TypeScript:** 5.x
- **Node Target:** ES2017

**Linting:**
- **Tool:** ESLint 9.39.3
- **Config:** `.eslintrc.json`
- **Extends:** `next/core-web-vitals`, `next/typescript`
- **Custom Rules:**
  - `@typescript-eslint/no-explicit-any`: warn
  - `@typescript-eslint/no-unused-vars`: warn with `argsIgnorePattern: "^_"`

**Configuration File:** `chatSNP170226/frontend/.eslintrc.json`
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  }
}
```

**TypeScript Configuration:** `chatSNP170226/frontend/tsconfig.json`
- Target: ES2017
- Strict mode: true
- Module resolution: bundler
- Path aliases: `@/*` → `./src/*`

### Naming Conventions

**Components:**
- PascalCase: `ChatUI.tsx`, `LoginForm.tsx`, `ChatMessage.tsx`, `ErrorBoundary.tsx`
- Descriptive names reflecting domain/purpose
- UI component library components: `Button`, `Card`, `Dialog`, `Sheet`, etc.

**Files & Folders:**
- Component folders use PascalCase: `src/components/chat/`, `src/components/ui/`
- Utility files use kebab-case or snake_case: `use-chat-messages.ts`, `chat-backend.ts`
- API routes follow Next.js conventions: `src/app/api/auth/login/route.ts`

**Hooks & Utilities:**
- Hooks prefixed with `use`: `useChatMessages()`, `useChatSessions()`, `useSessionStream()`, `useFileAttachment()`
- Services suffixed with `-service` or `-backend`: `chat-backend.ts`, `auth-service.ts`
- Utilities descriptive: `file-parser.ts`, `admin-backend.ts`

**Variables & Constants:**
- camelCase for local variables
- UPPER_SNAKE_CASE for constants (used sparingly)
- boolean prefixes: `isLoading`, `hasError`, `canSubmit`
- State hooks: `const [messages, setMessages] = useState()`
- Refs: `const messagesEndRef = useRef<HTMLDivElement>(null)`

### Architecture Patterns

#### 1. **"use client" Server Components**
Client-side interactivity marked explicitly:
```typescript
// File: chatSNP170226/frontend/src/components/chat-ui.tsx
"use client";

import { useCallback, useState, useRef } from "react";

export function ChatUI({ department }: { department: string }) {
  // Component with hooks and interactivity
}
```

#### 2. **Custom Hooks for State Management**
No external state library; hooks manage logic:
```typescript
// File: chatSNP170226/frontend/src/hooks/use-chat-messages.ts
export function useChatMessages(t: TranslateFn, department: string) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const loadSessionMessages = useCallback(async (sessionId: string, limit = 100) => {
    setMessagesLoading(true);
    try {
      const session = await chatBackend.fetchSession(sessionId, { limit });
      setMessages(mapped);
    } finally {
      setMessagesLoading(false);
    }
  }, []);
  
  return { messages, setMessages, messagesLoading, messagesEndRef, loadSessionMessages };
}
```

#### 3. **Service Layer for API Communication**
Centralized backend communication:
```typescript
// File: chatSNP170226/frontend/src/services/chat-backend.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

function buildRequestUrl(path: string, query?: Record<string, string | number | undefined>): string {
  // URL construction with query params
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = buildRequestUrl(path, query);
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    // Error handling with nested structure support
    throw new Error(`Backend request failed: ${response.status} - ${errorText}`);
  }
  return (await response.json()) as T;
}

export const chatBackend = {
  createSession: async (payload: SessionCreate): Promise<BackendSession> => {
    return request('/sessions', { method: 'POST', body: JSON.stringify(payload) });
  },
  fetchSession: async (id: string, query?: { limit?: number }): Promise<BackendSessionWithMessages> => {
    return request(`/sessions/${id}`, {}, query);
  },
};
```

#### 4. **Component Composition with Props**
Functional components with typed props:
```typescript
// File: chatSNP170226/frontend/src/components/ui/button.tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 5. **Styling with Tailwind CSS & CVA**
Utility-first CSS with class variance authority:
```typescript
// File: chatSNP170226/frontend/src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

#### 6. **Error Boundary Component**
Graceful error handling for React subtrees:
```typescript
// File: chatSNP170226/frontend/src/components/error-boundary.tsx
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <DefaultErrorFallback onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
```

#### 7. **Form Handling with React Hook Form & Zod**
Validation and form state:
```typescript
// Pattern from dependencies: react-hook-form, @hookform/resolvers, zod
// Components like LoginForm, SignupForm use this pattern
```

### Type Safety

**Interfaces & Types:**
- Interfaces for component props: `interface ButtonProps`
- Types for data models: `type Message = { id: string; role: 'user' | 'bot'; content: string }`
- Generic types for reusable logic: `function request<T>(...): Promise<T>`

**Files:**
- Declaration files: `chatSNP170226/frontend/src/types/mem0.d.ts`
- Type exports from services and components

### Error Handling

**Try-Catch Patterns:**
```typescript
try {
  const session = await chatBackend.fetchSession(sessionId, { limit });
  setMessages(mapped);
} catch (err) {
  console.error("Failed to load session messages", err);
  throw err;
} finally {
  setMessagesLoading(false);
}
```

**Error Boundary for Render Errors:**
Wraps dynamic content (markdown, LLM output, charts):
```typescript
<ErrorBoundary>
  <LLMResponseRenderer content={llmOutput} />
</ErrorBoundary>
```

**UI Error Display:**
- Toast notifications via `@radix-ui/react-toast`
- Alert dialogs for critical errors
- Inline error messages near form fields

### Performance Patterns

**Memoization:**
- `useCallback()` for event handlers and functions passed as props
- `useMemo()` for expensive computations
- `React.memo()` for component memoization (when needed)

**Code Splitting:**
- Next.js automatic code splitting for routes
- Dynamic imports for large components

**References:**
- `useRef<HTMLDivElement>()` for DOM manipulation (scroll-to-bottom)
- `useRef<string | null>()` for tracking values without re-renders

---

## Shared Conventions

### Async Programming

**Backend:**
- `async def` / `await` throughout
- `AsyncSession`, `AsyncClient` for I/O
- Celery for background tasks with `.delay()` method

**Frontend:**
- `async/await` in event handlers and hooks
- No callback hell; Promise-based

### Environment Configuration

**Backend:** `.env` file with DATABASE_URL, REDIS_URL, LLM_MODEL, API keys
**Frontend:** `.env.local` or environment variables in deployment

### Documentation

**Docstrings (Backend):**
```python
def get_async_http_client(timeout: float = _DEFAULT_TIMEOUT) -> httpx.AsyncClient:
    """Get the shared async HTTP client with connection pooling.
    
    Note: timeout is only applied on first initialization.
    """
```

**Comments (Frontend):**
```typescript
// SSE: Set immediately when dispatch task (don't wait for activeChatId sync)
const [streamSessionId, setStreamSessionId] = useState<string | null>(null);
```

### Security Practices

- Input validation with Pydantic (backend) and form validation (frontend)
- CORS middleware configured with allowed origins
- Environment variables for sensitive data (API keys, database URLs)
- Type safety to prevent common bugs

---

## Summary

**Backend:** FastAPI + SQLAlchemy Async + Pydantic with Repository/Service patterns, Ruff linting, Pyright type checking

**Frontend:** Next.js 15 + React 18 + TypeScript with custom hooks for state, centralized API service, Tailwind + CVA for styling, ESLint with next config

**Both:** Type-safe, async-first, error-aware, with clear separation of concerns
