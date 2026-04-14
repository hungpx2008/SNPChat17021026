# Phase 8: Auto-Routing + Semantic Cache - Backend Exploration Report

**Date**: April 14, 2026  
**Depth**: Very Thorough  
**Focus**: Current state assessment for implementing auto-routing and semantic cache

---

## 1. INTENT ROUTING ANALYSIS

### Current State: Explicit Mode Selection
The system currently uses **explicit user mode selection** (not auto-routing).

**Key File**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/schemas/schemas.py` (lines 8-12)
```python
class MessageCreate(BaseModel):
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    mode: Literal["chat", "sql", "rag"] = "chat"  # ← User explicitly selects
```

### Chat Pipeline Architecture

**Entry Point**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/chat_service.py` (lines 68-145)

**Function**: `ChatService.add_message()`
- Takes explicit `mode` from `MessageCreate` schema
- Routes to appropriate Celery task based on mode:
  - `"chat"` → `process_chat_response.delay()` (line 121)
  - `"sql"` → `run_sql_query.delay()` (line 106-111)
  - `"rag"` → `rag_document_search.delay()` (line 112-119)

### Current Agent Modes

**Frontend Definition**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/src/components/chat/chat-composer.tsx` (lines 13-17)

```typescript
const MODE_OPTIONS: { value: AgentMode; label: string; icon: typeof Bot; description: string }[] = [
  { value: "chat", label: "Trợ lý", icon: Bot, description: "Hỏi đáp tổng quát" },
  { value: "sql", label: "Số liệu", icon: BarChart3, description: "Truy vấn dữ liệu Cảng" },
  { value: "rag", label: "Tài liệu", icon: FileText, description: "Hỏi nội dung PDF/file" },
];
```

### Main Chat Handler Function

**Primary Handler**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/worker/chat_tasks.py` (lines 874-1015)

**Function**: `rag_document_search()`
```python
@celery_app.task(name="src.worker.tasks.rag_document_search", bind=True, max_retries=2)
def rag_document_search(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
    department: str | None = None,
    target_message_id: str | None = None,
) -> dict[str, Any]:
```

**Workflow Steps**:
1. Query Enhancement (lines 888-897)
   - Uses `QueryEnhancer` to classify and enhance queries
   - Strategies: DIRECT, HYDE, DECOMPOSED
2. Hybrid Search (lines 902-914)
   - Runs semantic + lexical search in parallel via `HybridSearchService`
3. Fallback Semantic Search (lines 912-914)
   - If hybrid returns 0 results, falls back to pure semantic
4. Parent Chunk Resolution (lines 916-917)
   - Resolves child chunks to parent chunks for richer context
5. Context Building (lines 919-920)
   - Builds citations and context blocks from hybrid results
6. LLM Synthesis (lines 924-937)
   - Calls OpenRouter LLM with unified context (long-term, summary, recent)
   - Uses dynamic system prompt from `SystemPromptBuilder`
7. Answer Storage (lines 957-971)
   - Posts final answer to backend API or updates placeholder message

**Other Task Handlers**:
- `process_chat_response()` (lines 53-122): Chat mode - chunks, embeds, stores in Qdrant
- `store_memory()` (lines 125-164): Async memory storage to Mem0
- `process_feedback()` (lines 1018-1104): User feedback handling - marks vectors as low quality
- `summarize_session_history()` (lines 1111-1217): Token-aware session summarization

---

## 2. SEMANTIC CACHE - CURRENT STATE

### Existing Cache Infrastructure

**Cache Backend**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/core/redis_client.py`
```python
def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        settings = get_settings()
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis
```

### Current Cache Usage

**Location**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/chat_service.py` (lines 51-65)

**Function**: `get_session_with_messages()`
```python
async def get_session_with_messages(self, session_id: UUID, limit: int | None = None):
    cache_key = self._cache_key(session_id)  # Returns f"session:{session_id}:messages"
    if limit is None:
        cached = await self.redis.get(cache_key)
        if cached:
            return json.loads(cached)
    
    # ... fetch from DB if not cached ...
    
    if limit is None:
        await self.redis.set(cache_key, json.dumps(payload), ex=3600)  # 1-hour TTL
    return payload
```

### Cache Key Generation

**Method**: `ChatService._cache_key()` (likely)
- Format: `session:{session_id}:messages`
- TTL: 3600 seconds (1 hour)

### Existing Cache Invalidation

**On New Message**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/chat_service.py` (lines 89-100)
```python
# Update cache: append new message instead of full DB reload
cache_key = self._cache_key(session_id)
cached_raw = await self.redis.get(cache_key)
if cached_raw:
    existing = json.loads(cached_raw)
    existing.append(self.serialize_message(db_message))
    await self.redis.set(cache_key, json.dumps(existing), ex=3600)
```

### NO Semantic Search Cache

**Finding**: There is **NO existing semantic/vector cache** for search results or LLM responses.

The system performs full search pipeline on every query:
1. HybridSearchService runs fresh semantic + lexical search every time
2. No caching layer between query enhancement and vector search
3. LLM synthesis calls OpenRouter without response caching

---

## 3. SEARCH PIPELINE

### Search Directory Structure

```
/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/search/
├── __init__.py
├── hybrid_search.py      (main orchestrator)
├── lexical_search.py     (BM25 via Whoosh)
├── query_enhancer.py     (HyDE + decomposition)
└── search_ranking.py     (RRF + boost calculations)
```

### HybridSearchService

**File**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/search/hybrid_search.py` (lines 58-143)

**Main Method**: `search()`
```python
def search(
    self,
    query: str | list[str],
    user_id: str | None = None,
    department: str | None = None,
    limit: int = 5,
    score_threshold: float = 0.0,
) -> list[SearchResult]:
```

**Algorithm**:
1. Handles single query or list of sub-queries
2. For lists: runs `_single_search` in parallel via ThreadPoolExecutor
3. Merges results across sub-queries by doc_id (keeps max score)
4. Applies RRF (Reciprocal Rank Fusion) with K=60
5. Applies title + tag boost post-fusion
6. Returns top N results sorted by combined score

**SearchResult Dataclass** (lines 40-55):
```python
@dataclass
class SearchResult:
    doc_id: str
    title: str = ""
    content: str = ""
    tags: str = ""
    score: float = 0.0
    semantic_score: float = 0.0
    lexical_score: float = 0.0
    rrf_score: float = 0.0
    boost_score: float = 0.0
    source: str = ""  # "semantic", "lexical", "both"
    metadata: dict[str, Any] = field(default_factory=dict)
    parent_id: str = ""  # ChunkParent UUID
```

### QueryEnhancer

**File**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/search/query_enhancer.py` (lines 104-150)

**Main Method**: `enhance(query: str) -> EnhancedQuery`

**Decision Heuristic** (lines 129-150):
1. Classify strategy without LLM (fast):
   - tokens < 30 → **DIRECT** (search as-is, no LLM)
   - contains Vietnamese comparison signals → **DECOMPOSED** (split into ≤4 sub-queries)
   - else → **HYDE** (generate hypothetical Vietnamese answer)
2. Apply strategy:
   - DIRECT: return [query]
   - HYDE: LLM generates hypothetical answer (~100 words), search that
   - DECOMPOSED: LLM splits into sub-queries, search each

**EnhancedQuery Result**:
```python
@dataclass
class EnhancedQuery:
    original: str
    queries: list[str]  # 1 item for DIRECT/HYDE, N for DECOMPOSED
    strategy: QueryStrategy  # DIRECT | HYDE | DECOMPOSED
    hyde_output: str | None = None
```

### Calling from chat_tasks

**Location**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/worker/chat_tasks.py` (lines 888-920)

```python
# Query Enhancement
from src.services.search.query_enhancer import QueryEnhancer, QueryStrategy
enhancer = QueryEnhancer()
enhanced = enhancer.enhance(question)
logger.info(f"[RAG] Query strategy: {enhanced.strategy.value}, sub-queries: {len(enhanced.queries)}")

# Hybrid Search
from src.services.search.hybrid_search import HybridSearchService
hybrid = HybridSearchService()
hybrid_results = hybrid.search(
    query=enhanced.queries if len(enhanced.queries) > 1 else enhanced.queries[0],
    user_id=user_id,
    department=department,
    limit=5,
    score_threshold=RAG_SCORE_THRESHOLD,  # 0.35
)

# Fallback if no results
if not hybrid_results:
    hybrid_results = _fallback_semantic_search(question, user_id, department)
```

### Parent Chunk Resolution

**Function**: `_resolve_parent_content()` (lines 782-816)

**Purpose**: Replace child chunk content with parent content when parent_id is present

```python
def _resolve_parent_content(hybrid_results: list) -> list:
    """Replace child chunk content with parent content when parent_id is present."""
    from src.services.parent_chunk_store import fetch_parent_content
    
    parent_ids = list({r.parent_id for r in hybrid_results if hasattr(r, "parent_id") and r.parent_id})
    if not parent_ids:
        return hybrid_results
    
    parent_map = fetch_parent_content(parent_ids)  # Fetches from PostgreSQL
    
    # ... replace content and dedupe by parent_id ...
    return resolved
```

**Parent Chunk Store**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/services/parent_chunk_store.py`
- Fetches parent content from PostgreSQL
- Deduplicates multiple children pointing to same parent

---

## 4. FRONTEND AUTO-MODE IMPLEMENTATION

### Current Mode Selector

**Component**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/src/components/chat/chat-composer.tsx` (lines 74-96)

```typescript
{MODE_OPTIONS.map(opt => {
  const Icon = opt.icon;
  const isActive = selectedMode === opt.value;
  return (
    <button
      key={opt.value}
      type="button"
      title={opt.description}
      onClick={() => onModeChange(opt.value)}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon size={14} />
      {opt.label}
    </button>
  );
})}
```

### State Management

**In ChatUI Component**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/src/components/chat-ui.tsx` (lines 58, 200+)

```typescript
const [agentMode, setAgentMode] = useState<AgentMode>("chat");

// Passed to ChatComposer
<ChatComposer
  selectedMode={agentMode}
  onModeChange={setAgentMode}
  ...
/>
```

### Message Submission with Mode

**Handler**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/src/components/chat-ui.tsx` (lines 200+)

The mode is included in the message sent to backend:
```typescript
// In chat-ui form submission
const formData = new FormData(formElement);
// Mode is passed as: selectedMode (agentMode state)
```

**Backend Receives**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/api/chat.py` (lines 86-106)

```python
@router.post("/{session_id}/messages", status_code=201)
async def add_message(
    session_id: UUID,
    payload: MessageCreate,  # Contains mode field
    db_session: ChatSession = Depends(get_session_or_404),
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    service = ChatService(db)
    message = await service.add_message(
        session_id=session_id,
        message=payload,
        user_id=db_session.user_id,
        department=db_session.department,
    )
    await db.commit()
    result = service.serialize_message(message)
    # Signal frontend about dispatched Celery tasks
    intent_type = getattr(message, '_intent_type', 'chat')
    result['task_dispatched'] = intent_type in ('sql', 'rag')
    result['intent_type'] = intent_type
    return result
```

### Placeholder Messages During Processing

**Processing Status Component**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/src/components/chat/processing-status.tsx`

Shows loading state while Celery task runs. SSE stream listens for task completion.

**SSE Stream Hook**: `/Volumes/orical/ChatSNP/chatSNP170226/frontend/src/hooks/use-session-stream.ts`

Waits for `task_complete` event from backend, then reloads messages.

---

## 5. API SCHEMAS & CONTRACTS

### Message Schema

**File**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/schemas/schemas.py` (lines 8-36)

```python
class MessageCreate(BaseModel):
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    mode: Literal["chat", "sql", "rag"] = "chat"  # ← Key field

class MessageSchema(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    metadata: dict[str, Any] | None = None
    created_at: datetime
    chunks: list[MessageChunkSchema] = Field(default_factory=list)
    parent_message_id: UUID | None = None
    branch_index: int = 0
    is_active_branch: bool = True
```

### Session Schema

```python
class SessionCreate(BaseModel):
    user_id: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    external_id: Optional[str] = None

class SessionSchema(BaseModel):
    id: UUID
    user_id: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime
```

### Search & Result Schemas

```python
class SearchQuery(BaseModel):
    user_id: Optional[str] = None
    department: Optional[str] = None
    query: str
    limit: int = 5

class SearchResult(BaseModel):
    text: str
    score: float
    source: str
    metadata: dict[str, Any]
```

### Response Structure

**Backend returns**:
```python
{
    "id": "...",
    "task_dispatched": true/false,
    "intent_type": "chat" | "sql" | "rag",
    ...message fields...
}
```

---

## 6. CONFIGURATION & SETTINGS

**File**: `/Volumes/orical/ChatSNP/chatSNP170226/backend/src/core/config.py`

```python
class Settings(BaseSettings):
    # Database
    database_url: str = Field(..., alias="DATABASE_URL")
    
    # Cache
    redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")
    chat_cache_window: int = Field(20, alias="CHAT_CACHE_WINDOW")
    
    # Vector Search
    qdrant_http_url: str = Field("http://localhost:6333", alias="QDRANT_URL")
    qdrant_grpc_url: str | None = Field(None, alias="QDRANT_GRPC_URL")
    
    # Memory
    mem0_url: str = Field("http://mem0:8000", alias="MEM0_URL")
    
    # Embeddings
    embedding_dimension: int = Field(1024, alias="EMBEDDING_DIMENSION")
    embedding_model: str = Field("thanhtantran/Vietnamese_Embedding_v2", alias="EMBEDDING_MODEL")
    embedding_device: str = Field("cpu", alias="EMBEDDING_DEVICE")
    
    # LLM
    openai_api_key: str | None = Field(None, alias="OPENAI_API_KEY")
    openai_base_url: str = Field("https://openrouter.ai/api/v1", alias="OPENAI_BASE_URL")
    llm_model: str = Field("openai/gpt-5-nano", alias="LLM_MODEL")  # ← Note: reasoning model default
    
    # Chat
    chat_max_sessions: int = Field(100, alias="CHAT_MAX_SESSIONS")
    chat_chunk_size: int = Field(512, alias="CHAT_CHUNK_SIZE")
```

**Environment Variables for Phase 8**:
- `REDIS_URL`: Redis connection (already configured for session caching)
- `LLM_MODEL`: Currently `openai/gpt-5-nano` (reasoning model) - should be `openai/gpt-4o-mini` for chat
- `RAG_SCORE_THRESHOLD`: Loaded in chat_tasks.py (default 0.35)

---

## 7. KEY FUNCTIONS & FILE PATHS SUMMARY

### Backend Entry Points

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `add_message` | `/api/chat.py` | 86-106 | Routes message to correct Celery task |
| `rag_document_search` | `/worker/chat_tasks.py` | 874-1015 | Main RAG pipeline |
| `process_chat_response` | `/worker/chat_tasks.py` | 53-122 | Chat mode: chunk, embed, store |
| `run_sql_query` | `/worker/tasks.py` | ❓ | SQL mode (not shown in exploration) |
| `store_memory` | `/worker/chat_tasks.py` | 125-164 | Save to Mem0 |
| `process_feedback` | `/worker/chat_tasks.py` | 1018-1104 | Handle thumbs up/down |
| `summarize_session_history` | `/worker/chat_tasks.py` | 1111-1217 | Token-aware summarization |

### Search Pipeline

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `HybridSearchService.search()` | `/services/search/hybrid_search.py` | 81-143 | Orchestrate semantic + lexical |
| `QueryEnhancer.enhance()` | `/services/search/query_enhancer.py` | 129-150 | DIRECT/HYDE/DECOMPOSED strategy |
| `_resolve_parent_content()` | `/worker/chat_tasks.py` | 782-816 | Replace child with parent chunks |
| `_fallback_semantic_search()` | `/worker/chat_tasks.py` | 700-748 | Pure semantic if hybrid empty |

### Context & Synthesis

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `_gather_unified_context()` | `/worker/chat_tasks.py` | 446-473 | Collect long-term, summary, recent |
| `_build_context_with_builder()` | `/worker/chat_tasks.py` | 399-427 | Dynamic budget-aware context |
| `_synthesize_with_llm()` | `/worker/chat_tasks.py` | 493-562 | Call LLM via OpenRouter |
| `_build_hybrid_context_and_citations()` | `/worker/chat_tasks.py` | 819-867 | Convert search results to context |

### Cache & Data

| Function | File | Lines | Purpose |
|----------|------|-------|---------|
| `get_session_with_messages()` | `/services/chat_service.py` | 51-65 | Get messages with Redis cache |
| `add_message()` | `/services/chat_service.py` | 68-145 | Add message + invalidate cache |
| `get_redis()` | `/core/redis_client.py` | 10-15 | Get Redis singleton |

---

## 8. CURRENT BEHAVIOR SUMMARY

### How It Works Today

1. **User selects mode** (chat/sql/rag) via mode selector UI
2. **Frontend submits message** with `mode` field to `/sessions/{id}/messages` POST
3. **Backend API** receives `MessageCreate` with explicit mode
4. **ChatService.add_message()** dispatches Celery task:
   - `rag_document_search.delay()` if mode="rag"
   - `run_sql_query.delay()` if mode="sql"
   - `process_chat_response.delay()` if mode="chat"
5. **Celery worker** processes task async:
   - **RAG**: Query enhance → Hybrid search → LLM synthesis → Store answer
   - **Chat**: Chunk → Embed → Store in Qdrant
6. **Frontend waits** via SSE stream for `task_complete` event
7. **Answer appears** in chat when Celery task finishes

### Missing for Phase 8

1. **Auto-routing**: System should infer intent from query content, not user UI selection
2. **Semantic search cache**: No caching of vector search results or LLM responses
3. **Query classification**: No ML/heuristic to auto-detect if user is asking about:
   - General chat (Trợ lý)
   - Data analytics (Số liệu - SQL)
   - Document search (Tài liệu - RAG)

---

## 9. RECOMMENDATIONS FOR PHASE 8

### For Intent Routing (Auto-Mode)

**Extend QueryEnhancer** with classification logic:
- Add intent classification alongside query enhancement
- Use fast heuristics first (keyword matching):
  - SQL signals: "thống kê", "so sánh", "dữ liệu", "biểu đồ", etc.
  - RAG signals: "tài liệu", "PDF", "trong file", "từ trang", etc.
  - Chat: default fallback
- Return `IntentResult` with confidence + strategy

### For Semantic Cache

**Add SearchResultCache service**:
- Cache key: `hash(query + user_id + department + strategy)`
- Value: `[SearchResult, timestamp]`
- TTL: 24 hours (configurable)
- Store in Redis as JSON

**Add LLMResponseCache service**:
- Cache key: `hash(context_text + question + mode)`
- Value: `[llm_response, citations, timestamp]`
- TTL: 7 days (long-lived for FAQ-like responses)
- Check before calling LLM synthesis

### Integration Points

1. **In QueryEnhancer.enhance()**: Add intent classification
2. **In ChatService.add_message()**: Auto-select mode from intent result
3. **In HybridSearchService.search()**: Check cache before searching
4. **In _synthesize_with_llm()**: Check cache before LLM call
5. **Update MessageSchema**: Include `detected_intent` and `intent_confidence` in metadata

