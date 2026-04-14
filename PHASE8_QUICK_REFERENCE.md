# Phase 8 Quick Reference - Critical Files & Functions

## 🎯 Intent Routing - Current Pipeline

### Frontend (Mode Selection)
- **File**: `frontend/src/components/chat/chat-composer.tsx` (lines 13-96)
- **Component**: `ChatComposer` - displays 3 mode buttons: "Trợ lý" (chat), "Số liệu" (sql), "Tài liệu" (rag)
- **State**: `agentMode` in `ChatUI` component
- **Send**: Includes `mode` in MessageCreate payload

### Backend API (Receive Mode)
- **File**: `backend/src/api/chat.py` (lines 86-106)
- **Endpoint**: `POST /sessions/{session_id}/messages`
- **Schema**: `MessageCreate` with `mode: Literal["chat", "sql", "rag"]`

### Backend Service (Route Mode)
- **File**: `backend/src/services/chat_service.py` (lines 68-145)
- **Function**: `ChatService.add_message()`
- **Logic**:
  ```python
  mode = getattr(message, 'mode', 'chat')
  if mode == "sql":
      run_sql_query.delay(...)
  elif mode == "rag":
      rag_document_search.delay(...)
  else:  # chat
      process_chat_response.delay(...)
  ```

### Celery Tasks
- **File**: `backend/src/worker/chat_tasks.py`
- **RAG Task**: `rag_document_search()` (lines 874-1015) - **THE MAIN ONE**
- **Chat Task**: `process_chat_response()` (lines 53-122)
- **Memory Task**: `store_memory()` (lines 125-164)
- **Feedback Task**: `process_feedback()` (lines 1018-1104)

---

## 🔍 Search Pipeline - How RAG Works

### Step 1: Query Enhancement
- **File**: `backend/src/services/search/query_enhancer.py`
- **Function**: `QueryEnhancer.enhance(question)` (lines 129-150)
- **Returns**: `EnhancedQuery` with `queries: list[str]` and `strategy: QueryStrategy`
- **Strategies**: DIRECT (<30 tokens), HYDE (long queries), DECOMPOSED (multi-part)

### Step 2: Hybrid Search
- **File**: `backend/src/services/search/hybrid_search.py`
- **Function**: `HybridSearchService.search()` (lines 81-143)
- **Does**: Runs semantic (Qdrant) + lexical (Whoosh) in parallel
- **Returns**: `list[SearchResult]` with scores

### Step 3: Context Building
- **File**: `backend/src/worker/chat_tasks.py`
- **Function**: `_build_hybrid_context_and_citations()` (lines 819-867)
- **Does**: Deduplicates, formats snippets, builds citations

### Step 4: LLM Synthesis
- **File**: `backend/src/worker/chat_tasks.py`
- **Function**: `_synthesize_with_llm()` (lines 493-562)
- **Does**: Calls OpenRouter LLM with unified context
- **Input**: question + search results + long-term memory + session summary + recent messages

---

## 💾 Cache Status

### Current Cache (Session Messages Only)
- **File**: `backend/src/services/chat_service.py` (lines 51-65)
- **Function**: `get_session_with_messages()`
- **Cache Key**: `session:{session_id}:messages`
- **TTL**: 3600 seconds
- **Stores**: JSON of all messages in a session

### ❌ Missing: Search Result Cache
- No caching of `HybridSearchService.search()` results
- No caching of `QueryEnhancer.enhance()` enhanced queries
- **Opportunity**: Cache at `hybrid.search()` level

### ❌ Missing: LLM Response Cache
- No caching of `_synthesize_with_llm()` responses
- **Opportunity**: Cache full RAG answer (question + context hash → response)

---

## 🛠️ Key Integration Points for Phase 8

### 1. Auto-Intent Classification
**Extend `QueryEnhancer.enhance()` to also return intent:**
- Current: Returns `EnhancedQuery` with query variants
- New: Also return `IntentClassification` with `intent: "chat"|"sql"|"rag"` + confidence

**In**: `backend/src/services/search/query_enhancer.py`
- Add intent keywords for Vietnamese
- SQL signals: "thống kê", "so sánh", "dữ liệu", "biểu đồ", "phân tích"
- RAG signals: "tài liệu", "PDF", "trong file", "từ trang", "trang mấy"
- Chat: default fallback

### 2. Auto-Mode Routing
**Modify `ChatService.add_message()` to use auto-detected intent:**
- Current: Takes explicit `mode` from request
- New: If mode is "auto" or not provided, call intent classifier
- Store detected intent in message metadata

**In**: `backend/src/services/chat_service.py`
- Before line 106 (mode = getattr...)
- Call intent classifier
- Use detected mode if high confidence

### 3. Search Result Cache
**Add new service**: `backend/src/services/search/search_cache.py`
- Key format: `search:{hash(query+user+dept+strategy)}`
- Value: Serialized `list[SearchResult]`
- TTL: 24 hours
- Check in `HybridSearchService.search()` before running search

### 4. LLM Response Cache
**Add new service**: `backend/src/services/cache/llm_response_cache.py`
- Key format: `llm_resp:{hash(context+question+mode)}`
- Value: JSON with response, citations, timestamp
- TTL: 7 days
- Check in `_synthesize_with_llm()` before calling LLM

### 5. Cache Invalidation
**On new document upload** (when RAG knowledge changes):
- Clear search result cache: `search:*` pattern
- Keep LLM response cache (still valid, just stale knowledge)

**On user provides feedback**:
- Mark vector as low quality in Qdrant
- Could invalidate relevant search caches

---

## 📊 Configuration

**File**: `backend/src/core/config.py`

Relevant settings for Phase 8:
- `redis_url`: Already configured for session cache, can reuse
- `llm_model`: Currently `"openai/gpt-5-nano"` (⚠️ reasoning model, not chat)
- `embedding_model`: `"thanhtantran/Vietnamese_Embedding_v2"`
- `qdrant_http_url`: Vector store location

**New settings to add**:
```python
# Phase 8 - Auto-routing & Caching
enable_auto_intent_routing: bool = Field(True, alias="AUTO_INTENT_ROUTING_ENABLED")
enable_search_result_cache: bool = Field(True, alias="SEARCH_CACHE_ENABLED")
enable_llm_response_cache: bool = Field(True, alias="LLM_RESPONSE_CACHE_ENABLED")
search_cache_ttl: int = Field(86400, alias="SEARCH_CACHE_TTL_SECONDS")  # 24 hours
llm_cache_ttl: int = Field(604800, alias="LLM_CACHE_TTL_SECONDS")  # 7 days
```

---

## 🧪 Testing Points

1. **Test auto-intent classification**
   - Query: "Hỏi về thống kê container tháng 1" → should detect "sql"
   - Query: "Hỏi nội dung tài liệu biểu phí" → should detect "rag"
   - Query: "Xin chào, bạn là ai?" → should detect "chat"

2. **Test search cache hit**
   - Same query twice → second should return cached results
   - Check Redis for cache key

3. **Test LLM response cache hit**
   - Same question + similar docs twice → second should return cached response
   - Compare latency (cached should be <100ms)

4. **Test cache invalidation**
   - Upload new document → clear search cache
   - Verify new documents appear in subsequent searches

---

## 📝 API Contract Changes for Phase 8

### Request (Frontend → Backend)
```python
# Current
{
    "role": "user",
    "content": "...",
    "mode": "rag"  # User explicitly selects
}

# Phase 8 Option 1: Keep optional, auto if missing
{
    "role": "user",
    "content": "...",
    "mode": "rag"  # Optional; auto-detect if missing
}

# Phase 8 Option 2: Separate auto flag
{
    "role": "user",
    "content": "...",
    "mode": "rag",
    "auto_mode": true  # If true, ignore mode field and auto-detect
}
```

### Response (Backend → Frontend)
```python
# Current
{
    "id": "...",
    "content": "...",
    "intent_type": "rag",
    "task_dispatched": true
}

# Phase 8
{
    "id": "...",
    "content": "...",
    "intent_type": "rag",
    "task_dispatched": true,
    "detected_intent": "rag",  # NEW: what classifier detected
    "intent_confidence": 0.95,  # NEW: confidence score
    "cache_hit": false  # NEW: if response was from cache
}
```

---

## 🚀 Priority Order for Implementation

1. **Intent Classifier** (~2-3 hours)
   - Extend `QueryEnhancer` with keyword matching
   - Add Vietnamese SQL/RAG/Chat signals
   - Return `IntentResult` with confidence

2. **Auto-Routing Logic** (~1-2 hours)
   - Modify `ChatService.add_message()` to use classifier
   - Fallback to explicit mode if provided
   - Store intent in message metadata

3. **Search Result Cache** (~2-3 hours)
   - Create `SearchResultCache` service
   - Integrate with `HybridSearchService.search()`
   - Implement cache key hashing

4. **LLM Response Cache** (~2-3 hours)
   - Create `LLMResponseCache` service
   - Integrate with `_synthesize_with_llm()`
   - Handle cache invalidation

5. **Frontend Updates** (~1-2 hours)
   - Add "auto" option to mode selector (or hide selector if auto enabled)
   - Display detected intent in UI
   - Show cache hit indicator (optional nice-to-have)

