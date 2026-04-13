# ChatSNP Testing Patterns & Framework

## Overview
ChatSNP employs a multi-framework testing approach:
- **Backend:** pytest + pytest-asyncio for async unit and integration tests
- **Frontend:** Jest + React Testing Library for component and unit tests
- **Async Support:** All tests use async/await patterns with auto-mode

---

## Backend Testing (Python)

### Testing Framework

**Primary Tool:** pytest
**Configuration:** `chatSNP170226/backend/pyproject.toml`

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

**Dependencies:**
```
pytest>=8.2.0
pytest-asyncio>=0.23.0
anyio>=4.3.0
```

**Key Features:**
- `asyncio_mode = "auto"` - Automatically applies `@pytest.mark.asyncio` to async test functions
- `testpaths = ["tests"]` - Test discovery limited to tests directory
- Async test execution with proper event loop management

### Test Structure

**Test Directory:** `chatSNP170226/backend/tests/`
**Files:**
- `conftest.py` - Fixtures and configuration
- `test_chat_flow.py` - Integration tests for chat functionality
- `test_main.py` - Main application tests

### Fixtures & Setup (conftest.py)

**File:** `chatSNP170226/backend/tests/conftest.py`

#### 1. Event Loop Fixture
```python
@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
```
- Session-scoped: single loop for entire test session
- Explicit loop management for async test execution

#### 2. Application Fixture
```python
@pytest.fixture(scope="session")
async def app() -> FastAPI:
    with patch("app.embeddings.get_embedding_model") as mock_get_model:
        mock_model = MagicMock()
        mock_model.encode.return_value = [0.1] * 1024  # EMBEDDING_DIMENSION
        mock_get_model.return_value = mock_model
        
        application = create_app()
        return application
```
- Session-scoped FastAPI instance
- Mocks embedding model to prevent downloading during tests
- Returns properly configured application instance

#### 3. Database Setup Fixture
```python
@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_databases() -> None:
    settings = get_settings()
    engine: AsyncEngine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)  # Create tables
    
    redis = get_redis()
    await redis.flushdb()  # Clear cache
    
    qdrant = get_qdrant_client()
    ensure_collections(qdrant, settings.embedding_dimension)
    for collection in ("chat_chunks", "long_term_memory"):
        try:
            qdrant.delete_collection(collection)
        except Exception:
            pass
    ensure_collections(qdrant, settings.embedding_dimension)
    yield
```
- `autouse=True` - Runs automatically before any test
- Session-scoped: runs once per test session
- Sets up:
  - PostgreSQL tables via SQLAlchemy
  - Redis cache (flushes to clean state)
  - Qdrant vector collections (ensures fresh state)
- Creates and configures all external services

#### 4. Async HTTP Client Fixture
```python
@pytest_asyncio.fixture()
async def client(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://testserver") as async_client:
        yield async_client
```
- Function-scoped: new client per test
- `httpx.AsyncClient` for async HTTP requests
- Base URL points to test server (no network calls)

#### 5. Cleanup Between Tests Fixture
```python
@pytest_asyncio.fixture(autouse=True)
async def cleanup_between_tests():
    yield
    engine: AsyncEngine = get_engine()
    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())  # Clear all rows
    redis = get_redis()
    await redis.flushdb()  # Clear cache
    qdrant = get_qdrant_client()
    for collection in ("chat_chunks", "long_term_memory"):
        try:
            qdrant.delete_collection(collection)
        except Exception:
            pass
    ensure_collections(qdrant, get_settings().embedding_dimension)
```
- Function-scoped, auto-use
- Runs after each test (yields before, cleanup after)
- Deletes all database rows in reverse table order (respects FK constraints)
- Clears Redis and Qdrant between tests
- Ensures test isolation

### Test Examples

**File:** `chatSNP170226/backend/tests/test_chat_flow.py`

#### Example: Session Lifecycle Test
```python
@pytest.mark.asyncio
async def test_session_lifecycle(client):
    # 1. Create session
    response = await client.post(
        "/sessions",
        json={"user_id": "user-1", "department": "IT", "title": "First session"},
    )
    assert response.status_code == 201
    session_data = response.json()
    session_id = session_data["id"]
    
    # 2. List sessions
    response = await client.get("/sessions", params={"user_id": "user-1"})
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) == 1
    assert sessions[0]["id"] == session_id
    
    # 3. Add messages
    message_payloads = [
        {"role": "user", "content": "Xin chao, toi can thong tin ve GPU."},
        {"role": "assistant", "content": "Day la thong tin GPU ban can."},
    ]
    for payload in message_payloads:
        response = await client.post(f"/sessions/{session_id}/messages", json=payload)
        assert response.status_code == 201
        message = response.json()
        UUID(message["id"])  # Validate UUID format
    
    # 4. Retrieve session with messages
    response = await client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert len(data["messages"]) == 2
    
    # 5. Semantic search
    response = await client.post(
        "/sessions/search",
        json={"user_id": "user-1", "query": "GPU thong tin", "limit": 3},
    )
    assert response.status_code == 200
    results = response.json()
    assert results, "Expected semantic search to return results"
    assert any("GPU" in result["text"] for result in results)
```

**Test Pattern Breakdown:**
1. `@pytest.mark.asyncio` - Marks as async test (redundant with auto mode, but explicit)
2. Fixture injection: `client` parameter automatically provides `AsyncClient`
3. HTTP requests use `await client.post()`, `await client.get()`
4. Response validation: status code, JSON parsing, data assertions
5. UUID validation: `UUID(message["id"])` confirms format
6. Semantic assertions: Business logic verification (search returns GPU-related results)

### Test Isolation & Cleanup

**Strategy:**
1. `setup_databases` fixture: Once per session, create all infrastructure
2. `cleanup_between_tests` fixture: Before each test, reset databases
3. No cross-test dependencies
4. Fresh state for every test execution

**Database Reset Pattern:**
```python
for table in reversed(Base.metadata.sorted_tables):
    await conn.execute(table.delete())
```
- Reverses table order to respect foreign key constraints
- Deletes all rows (not drop tables)

**Cache & Vector DB Reset:**
```python
await redis.flushdb()
qdrant.delete_collection(collection)
ensure_collections(qdrant, settings.embedding_dimension)
```
- Complete flush for Redis
- Recreate Qdrant collections

### Mocking Patterns

**Embedding Model Mock (in app fixture):**
```python
with patch("app.embeddings.get_embedding_model") as mock_get_model:
    mock_model = MagicMock()
    mock_model.encode.return_value = [0.1] * 1024
    mock_get_model.return_value = mock_model
```
- Prevents downloading large embedding models
- Returns fixed-size vectors (1024-dim)
- Significantly speeds up test execution

**Async Mock Pattern (potential, not shown but common):**
```python
from unittest.mock import AsyncMock
mock_redis = AsyncMock()
mock_redis.get.return_value = None
```

### Running Tests

**Command:**
```bash
pytest tests/
```

**With Coverage (if installed):**
```bash
pytest tests/ --cov=src --cov-report=html
```

**Watch Mode (with pytest-watch):**
```bash
ptw tests/
```

**Specific Test:**
```bash
pytest tests/test_chat_flow.py::test_session_lifecycle
```

**Verbose Output:**
```bash
pytest tests/ -vv
```

### Test Coverage Areas

**Integration Tests:**
- Session CRUD operations (create, list, get)
- Message operations (add, retrieve)
- Semantic search functionality
- Cache behavior
- Task dispatching (SQL, RAG modes)

**Not Explicitly Shown (but implied):**
- Unit tests for service methods
- Repository layer tests
- Schema validation tests
- Error handling (404s, 400s)

---

## Frontend Testing (TypeScript/React)

### Testing Framework

**Primary Tool:** Jest 29.7.0
**React Testing Library:** @testing-library/react 16.0.0
**Configuration:** `chatSNP170226/frontend/jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
}

module.exports = createJestConfig(customJestConfig)
```

**Dependencies:**
```json
"jest": "^29.7.0",
"jest-environment-jsdom": "^29.7.0",
"@testing-library/react": "^16.0.0",
"@testing-library/jest-dom": "^6.4.8"
```

**Key Features:**
- `setupFilesAfterEnv`: Configures test environment before running tests
- `testEnvironment: 'jest-environment-jsdom'`: Simulates browser environment
- `modulePathIgnorePatterns`: Excludes Next.js build artifacts

### Test Configuration

**File:** `chatSNP170226/frontend/jest.setup.js` (referenced but not shown in detail)
- Likely imports `@testing-library/jest-dom` for extended matchers
- Configures global test setup (mocks, polyfills)

### Test Examples

**File:** `chatSNP170226/frontend/Home.test.tsx`

```typescript
import { describe, expect, it } from '@jest/globals'
import Home from '@/app/page'

describe('Home Page', () => {
  it('redirects users to the login page', () => {
    expect(() => Home()).toThrow('NEXT_REDIRECT')
  })
})
```

**Test Pattern Breakdown:**
1. `describe()` - Test suite grouping
2. `it()` - Individual test case
3. Component as function call: `Home()` returns JSX or throws
4. Assertion: `expect(...).toThrow('NEXT_REDIRECT')`
5. Next.js specific: `redirect()` throws `NEXT_REDIRECT` error in tests

**Pattern Analysis:**
- Server component testing focuses on side effects (redirects)
- Client components would test rendering, user interactions, state changes
- No async/await needed for sync tests

### Testing Patterns (Expected, Not All Shown)

**Component Rendering Test:**
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

**User Interaction Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/login-form'

describe('LoginForm', () => {
  it('submits form with user input', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })
})
```

**Async Component Test:**
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { ChatUI } from '@/components/chat-ui'

describe('ChatUI', () => {
  it('loads messages from backend', async () => {
    render(<ChatUI department="IT" />)
    
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })
  })
})
```

**Hook Testing:**
```typescript
import { renderHook, act } from '@testing-library/react'
import { useChatMessages } from '@/hooks/use-chat-messages'

describe('useChatMessages', () => {
  it('initializes with welcome message', () => {
    const mockTranslate = (key: string) => `mock-${key}`
    const { result } = renderHook(() => useChatMessages(mockTranslate, 'IT'))
    
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('bot')
  })
  
  it('loads session messages', async () => {
    const mockTranslate = (key: string) => `mock-${key}`
    const { result } = renderHook(() => useChatMessages(mockTranslate, 'IT'))
    
    await act(async () => {
      await result.current.loadSessionMessages('session-123')
    })
    
    expect(result.current.messagesLoading).toBe(false)
    expect(result.current.messages.length).toBeGreaterThan(1)
  })
})
```

### Mocking Patterns

**Next.js Navigation Mock:**
```typescript
import { useRouter } from 'next/navigation'
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('MyComponent', () => {
  it('navigates on action', () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    
    render(<MyComponent />)
    fireEvent.click(screen.getByRole('button'))
    
    expect(mockPush).toHaveBeenCalledWith('/chat')
  })
})
```

**API Service Mock:**
```typescript
import { chatBackend } from '@/services/chat-backend'
jest.mock('@/services/chat-backend', () => ({
  chatBackend: {
    fetchSession: jest.fn(),
    createSession: jest.fn(),
  },
}))

describe('ChatUI', () => {
  it('fetches session on mount', async () => {
    ;(chatBackend.fetchSession as jest.Mock).mockResolvedValue({
      id: 'test-123',
      messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
    })
    
    render(<ChatUI department="IT" />)
    
    await waitFor(() => {
      expect(chatBackend.fetchSession).toHaveBeenCalledWith('test-123')
    })
  })
})
```

**Module Mocking (TypeScript):**
```typescript
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}))
```

### Test Isolation & Cleanup

**Jest Cleanup (Automatic):**
- After each test, DOM is cleaned up automatically
- Event listeners are removed
- Timers are cleared (if using jest.useFakeTimers)

**Manual Cleanup (when needed):**
```typescript
afterEach(() => {
  jest.clearAllMocks()
})
```

### Running Tests

**Command:**
```bash
npm test
```
or
```bash
npm run test
```

**Watch Mode:**
```bash
npm test -- --watch
```

**Coverage:**
```bash
npm test -- --coverage
```

**Specific File:**
```bash
npm test -- Home.test.tsx
```

**Specific Test:**
```bash
npm test -- --testNamePattern="redirects users"
```

---

## CI/CD & Coverage

### Backend Coverage

**Current Status:**
- No explicit CI/CD pipeline found in `.github/` directory
- Likely handled by deployment platforms (Docker, Docker Compose)
- Test execution via `pytest tests/` in Docker

**Docker Integration:**
- Tests run in backend container
- Database, Redis, Qdrant spun up via docker-compose
- Test isolation ensures no cross-container state issues

### Frontend Coverage

**Current Status:**
- No explicit CI/CD pipeline in repository root
- Frontend tests run via Jest during build
- Next.js build includes `npm run typecheck` (TypeScript)

**Scripts in package.json:**
```json
"scripts": {
  "dev": "next dev --turbopack -p 9002",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "jest"
}
```

### Test Execution Order

1. **Local Development:**
   - Run `npm test` or `pytest tests/` locally
   - `npm run lint` for code style
   - `npm run typecheck` for type safety

2. **Deployment:**
   - Docker builds backend image (runs tests?)
   - Frontend builds in Docker or CI environment
   - Tests confirm before deployment

---

## Best Practices

### Backend Testing

1. **Async-First:** All tests use `async def`, fixtures use `@pytest_asyncio.fixture`
2. **Isolation:** `cleanup_between_tests` ensures no state leaks
3. **Realistic Setup:** Actual PostgreSQL, Redis, Qdrant (not mocks in integration tests)
4. **Smart Mocking:** Only mock expensive operations (embedding download)
5. **Clear Names:** Test names describe behavior: `test_session_lifecycle`
6. **Fixtures Over Setup:** Leverage pytest fixtures for DRY setup
7. **Assertions:** Multiple assertions per test (arrange, act, assert)

### Frontend Testing

1. **User-Centric:** Test behavior from user perspective, not implementation
2. **Render Testing:** Use RTL for component testing, not snapshot tests
3. **Async Handling:** `waitFor()` and `act()` for state updates
4. **Mock External:** Mock API calls, routing, but test component logic
5. **Hook Testing:** Use `renderHook` for custom hook unit tests
6. **Descriptive:** Test names match user actions: "redirects users to login"
7. **Cleanup:** Jest auto-cleans, but manual cleanup if needed

### Shared Practices

1. **Test Organization:** Grouped by feature or file
2. **Setup & Teardown:** Use fixtures/beforeEach for setup, afterEach for cleanup
3. **Assertions:** Use specific matchers (`toHaveLength`, `toBeInTheDocument`)
4. **Coverage:** Aim for high coverage, but focus on meaningful tests
5. **Naming:** Test names describe "what" and "why," not "how"

---

## Summary

**Backend:** pytest + pytest-asyncio with session/function-scoped fixtures, database isolation, embedding model mocking, integration-focused

**Frontend:** Jest + RTL with component rendering, user event simulation, mock API services, Next.js-aware (redirect handling)

**Both:** Async-first, fixture-driven, isolated test suites, meaningful assertions
