# ChatSNP Code Quality Audit — Quick Fix Guide

## 🔴 CRITICAL FIXES (Do First — High Impact)

### 1. Remove Duplicate CORS Logic (chat.py)
**Impact:** Reduces lines by ~15, improves maintainability
**Locations:** Lines 62-66, 401-408, 438-445

```python
# NEW: chat/deps.py
def resolve_cors_origin(origin: str, allowed_origins: list[str]) -> str:
    """Resolve the correct CORS Allow-Origin header value."""
    if "*" in allowed_origins:
        return "*"
    if origin in allowed_origins:
        return origin
    return allowed_origins[0] if allowed_origins else "*"

# USAGE in chat.py (3 places):
allow_origin = resolve_cors_origin(origin, settings.allowed_origins)
```

### 2. Extract Task Dispatch Helper (chat.py)
**Impact:** Reduces cognitive complexity, enables unit testing
**Location:** Lines 138-146, 201-227 (repeated 3x)

```python
# NEW: in chat_service.py or separate file
async def dispatch_task_for_mode(
    mode: str,
    question: str,
    session_id: UUID,
    user_id: str | None,
    department: str | None,
    target_message_id: UUID | None = None,
) -> None:
    """Dispatch appropriate Celery task based on mode."""
    if mode == "rag":
        from src.worker.tasks import rag_document_search
        rag_document_search.delay(
            question=question,
            session_id=str(session_id),
            user_id=user_id,
            department=department,
            target_message_id=str(target_message_id) if target_message_id else None,
        )
    elif mode == "sql":
        from src.worker.tasks import run_sql_query
        run_sql_query.delay(
            question=question,
            session_id=str(session_id),
            user_id=user_id,
            target_message_id=str(target_message_id) if target_message_id else None,
        )
    else:  # chat
        from src.worker.tasks import process_chat_response
        process_chat_response.delay(
            session_id=str(session_id),
            message_id=str(target_message_id) if target_message_id else "",
            content=question,
            role="user",
            user_id=user_id,
            department=department,
        )
```

### 3. Split docling_service.py into 5 Files (Highest Priority)
**Impact:** Reduces largest file from 821 → ~150-200 lines each
**Files to create:**
- `services/docling_processor.py` — Main orchestrator
- `services/text_normalizer.py` — `_normalize_money_and_unit`, `_slugify_key`, etc.
- `services/table_serializer.py` — `AdaptiveTableSerializer` + related
- `services/vlm_processor.py` — VLM integration
- `services/chunk_post_processor.py` — `_apply_group_lock`, `_extract_row_keys`

**Refactoring steps:**
1. Create `text_normalizer.py` with `TextNormalizer` class
2. Create `table_serializer.py` with `TableSerializer` class
3. Create `vlm_processor.py` with `VLMProcessor` class
4. Create `chunk_post_processor.py` with `ChunkPostProcessor` class
5. Simplify `docling_service.py` to coordinate the above

---

## ⚠️ MEDIUM PRIORITY (Next Sprint)

### 4. Improve Cache Update Error Handling (chat_service.py:89-99)
```python
async def _update_cache_after_add(self, session_id: UUID, new_msg: ChatMessage):
    """Safely update Redis cache, rebuild from DB if cache is corrupted."""
    cache_key = self._cache_key(session_id)
    try:
        cached_raw = await self.redis.get(cache_key)
        if cached_raw:
            existing = json.loads(cached_raw)
            existing.append(self.serialize_message(new_msg))
            await self.redis.set(cache_key, json.dumps(existing), ex=3600)
            return existing
    except (json.JSONDecodeError, redis.ResponseError) as e:
        logger.warning(f"Cache update failed for {session_id}: {e}, rebuilding from DB")
    
    # Fallback: rebuild from DB
    all_messages = await self.message_repo.list_messages(session_id)
    cache_payload = [self.serialize_message(msg) for msg in all_messages]
    try:
        await self.redis.set(cache_key, json.dumps(cache_payload), ex=3600)
    except redis.ResponseError as e:
        logger.error(f"Redis write failed: {e}")
    return all_messages
```

### 5. Fix Exception Handling Specificity
**Files:** config.py, docling_service.py, chat_tasks.py

Replace generic `except Exception` with specific types:

```python
# BEFORE (bad):
try:
    import json
    return json.loads(value)
except Exception:
    pass

# AFTER (good):
try:
    import json
    return json.loads(value)
except json.JSONDecodeError:
    logger.debug(f"Failed to parse JSON: {value}")
except ValueError:
    logger.debug(f"Value error parsing JSON: {value}")
```

### 6. Create constants.py for Magic Numbers
```python
# NEW: src/core/constants.py

# RAG Configuration
RAG_SCORE_THRESHOLD = 0.35
RAG_SEARCH_LIMIT = 10
RAG_MAX_CONTEXT_TOKENS = 4000

# Docling Configuration
DOCLING_VLM_MIN_SIZE = 300  # pixels
DOCLING_VLM_MAX_IMAGES = 10  # per document
DOCLING_CHUNK_MAX_TOKENS = 2048
DOCLING_GROUP_LOCK_MAX_CHARS = 1800

# Chat Configuration
CHAT_MAX_SESSIONS = 100
CHAT_CACHE_WINDOW = 20
CHAT_SUMMARIZATION_TRIGGER_INTERVAL = 10  # every N messages

# HTTP Configuration
BACKEND_INTERNAL_URL = "http://backend:8000"
HTTP_TIMEOUT_SECONDS = 60.0
```

Then replace all hardcoded numbers:
```python
# BEFORE:
RAG_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", "0.35"))
vlm_min_size = self._env_int("DOCLING_VLM_MIN_SIZE", 300)

# AFTER:
from src.core.constants import RAG_SCORE_THRESHOLD, DOCLING_VLM_MIN_SIZE
RAG_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", str(RAG_SCORE_THRESHOLD)))
vlm_min_size = self._env_int("DOCLING_VLM_MIN_SIZE", DOCLING_VLM_MIN_SIZE)
```

### 7. Fix SSE Connection Handling (chat.py:479-489)
```python
async def _sse_event_generator(session_id: UUID):
    """Subscribe to Redis Pub/Sub and yield SSE events.
    
    Keeps connection open for up to 5 minutes (300s),
    sending heartbeat every 20s to prevent Cloudflare timeout.
    """
    redis = get_redis()
    pubsub = redis.pubsub()
    channel = f"session:{session_id}"
    await pubsub.subscribe(channel)
    heartbeat_counter = 0
    max_duration = 300  # 5 minutes
    start_time = asyncio.get_event_loop().time()
    
    try:
        while asyncio.get_event_loop().time() - start_time < max_duration:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=1.0
            )
            if message and message["type"] == "message":
                data = message["data"]
                if isinstance(data, bytes):
                    data = data.decode("utf-8")
                yield f"data: {data}\n\n"
                # Don't close; keep listening for more messages in same session
            else:
                heartbeat_counter += 1
                if heartbeat_counter >= 20:
                    yield ": heartbeat\n\n"
                    heartbeat_counter = 0
            await asyncio.sleep(1.0)
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.aclose()
```

---

## 💡 LOW PRIORITY (Polish, Can Wait)

### 8. Add Missing Docstrings (chat.py)
Lines: 109, 244, 263, 292

```python
@router.post("/search", response_model=list[SearchResult])
async def search_memory(
    payload: SearchQuery,
    db: AsyncSession = Depends(get_db_session),
) -> Any:
    """Semantic search across long-term (Mem0) and short-term (Qdrant) memory.
    
    Combines Mem0 memories with Qdrant chat chunks, scores by relevance,
    and filters by minimum threshold (0.35). Returns combined results sorted
    by relevance score (highest first).
    
    Args:
        payload: Search query with optional user_id/department filters
        db: Database session
    
    Returns:
        List of search results with text, score, metadata, and source
    """
    service = ChatService(db)
    results = await service.semantic_search(payload)
    return results
```

### 9. Pre-compile Regex Patterns
**Files:** chat_tasks.py, docling_service.py

```python
# chat_tasks.py - at module level
_HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
_MULTI_SPACE_PATTERN = re.compile(r"  +")
_MULTI_NEWLINE_PATTERN = re.compile(r"\n{3,}")

def _clean_snippet_text(text: str) -> str:
    """Sanitize raw snippet text before sending to LLM."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = _HTML_TAG_PATTERN.sub("", text)
    text = text.replace("\t", " ")
    
    lines = text.splitlines()
    cleaned_lines = [_MULTI_SPACE_PATTERN.sub(" ", line).strip() for line in lines]
    text = "\n".join(cleaned_lines)
    
    text = _MULTI_NEWLINE_PATTERN.sub("\n\n", text)
    text = "\n".join(ln for ln in text.splitlines() if ln.strip())
    
    return text.strip()
```

### 10. Extract Global Embedding Model Caching (chat_tasks.py:32-46)
```python
# NEW: src/core/embedding_cache.py
class EmbeddingModelCache:
    """Thread-safe lazy-loading cache for SentenceTransformer."""
    _instance = None
    _model = None
    _model_name: str | None = None
    _lock = asyncio.Lock()
    
    @classmethod
    async def get_model(cls):
        if cls._model is None:
            async with cls._lock:
                if cls._model is None:  # double-check pattern
                    from sentence_transformers import SentenceTransformer
                    model_name = os.getenv(
                        "EMBEDDING_MODEL",
                        "thanhtantran/Vietnamese_Embedding_v2"
                    )
                    logger.info(f"Loading SentenceTransformer: {model_name}")
                    cls._model = SentenceTransformer(model_name)
                    cls._model_name = model_name
                    logger.info("Embedding model loaded and cached.")
        return cls._model

# USAGE:
def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    model = await EmbeddingModelCache.get_model()
    return model.encode(text, normalize_embeddings=True).tolist()
```

---

## 📊 Effort vs. Impact Matrix

```
        HIGH IMPACT
            │
   ┌────────┼────────┐
   │ #1 CORS│ #3 DOCL│  DO NOW (This week)
   │ duplic │ refac  │
 H │ #2 Task│ #4 Cache
 I │ dispat │ handle │
 G │        │        │
 H │┌───────┼────────┤
 E ││ #5 Ex │ #7 SSE │  SOON (Next sprint)
 F ││ except│ connec │
 F ││       │        │
 O │└───────┼────────┤
 R │ #8 Doc │ #9 Reg │  LATER (Polish)
 T │ strings│ compile
 │        │
   └────────┴────────┘
     LOW      HIGH
      EFFORT
```

---

## Estimated Effort

| Task | Time | Priority |
|------|------|----------|
| #1 Extract CORS helper | 30 min | HIGH |
| #2 Extract task dispatch | 45 min | HIGH |
| #3 Split docling_service.py | 4-6 hours | CRITICAL |
| #4 Improve cache handling | 1 hour | MEDIUM |
| #5 Fix exception handling | 2 hours | MEDIUM |
| #6 Create constants.py | 1 hour | MEDIUM |
| #7 Fix SSE connection | 1 hour | HIGH |
| #8 Add docstrings | 30 min | LOW |
| #9 Pre-compile regex | 20 min | LOW |
| #10 Extract embedding cache | 1 hour | MEDIUM |
| **TOTAL** | **12-15 hours** | |

---

## Quick Checklist

- [ ] Fix CORS duplication (30 min)
- [ ] Extract task dispatch helper (45 min)
- [ ] Start docling_service.py refactor (begin this week)
- [ ] Improve cache error handling (1 hour)
- [ ] Add specific exception handling (2 hours)
- [ ] Create constants.py (1 hour)
- [ ] Fix SSE connection (1 hour)
- [ ] Run tests after each change
- [ ] Commit each fix separately

---

## Testing After Fixes

```bash
# Run full test suite
pytest tests/ -v

# Check type hints
mypy src/ --strict

# Check code style
ruff check src/

# Check for unused imports
vulture src/
```
