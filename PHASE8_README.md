# Phase 8: Auto-Routing + Semantic Cache - Exploration Reports

## 📚 Documentation Index

This directory contains comprehensive exploration reports for Phase 8 implementation. All reports were generated with **very thorough** depth of analysis.

### Report Files

#### 1. **PHASE8_EXPLORATION.md** (Main Reference)
- **Purpose**: Complete technical deep-dive with all code references
- **Content**:
  - Intent routing analysis (current explicit mode system)
  - Semantic cache status (what exists vs what's missing)
  - Search pipeline architecture (3 key services)
  - Frontend auto-mode implementation
  - API schemas & contracts
  - Configuration & settings
  - Key functions & file paths (with line numbers)
  - Current behavior summary
  - Recommendations for Phase 8
- **Best For**: Implementation planning, code review, architectural decisions
- **Reading Time**: 20-30 minutes

#### 2. **PHASE8_QUICK_REFERENCE.md** (Developer Guide)
- **Purpose**: Fast lookup guide for engineers
- **Content**:
  - Critical file locations with line ranges
  - Current pipeline components
  - Cache status (existing + missing)
  - Key integration points for Phase 8
  - Configuration settings
  - Testing checklist
  - API contract changes
  - Priority implementation order
- **Best For**: Quick lookups, writing code, testing
- **Reading Time**: 5-10 minutes

#### 3. **PHASE8_ARCHITECTURE.txt** (Visual Reference)
- **Purpose**: System architecture diagrams and flow visualization
- **Content**:
  - Current explicit mode flow diagram
  - Proposed Phase 8 additions (5 components)
  - Cache invalidation strategy
  - Performance gains breakdown
  - Key files & line ranges
- **Best For**: Understanding system flow, presentations, discussions
- **Reading Time**: 10-15 minutes

---

## 🎯 Executive Summary

### Current State (Before Phase 8)
- **Intent Routing**: Explicit user selection via 3 mode buttons
- **Pipeline**: Linear - Query → Search → Synthesize → Store
- **Cache**: Only session messages cached (1-hour TTL)
- **Performance**: 5-8 seconds per query

### Phase 8 Additions
1. **Intent Classifier** - Auto-detect query intent using Vietnamese keywords
2. **Auto-Routing** - Route queries without user selecting mode
3. **Search Result Cache** - Cache hybrid search results (24h TTL)
4. **LLM Response Cache** - Cache synthesized answers (7d TTL)
5. **Frontend Updates** - Display detected intent and cache status

### Expected Improvements
- **Latency**: 5-8s → 100ms for cached queries (50-80x faster)
- **Cost**: 30-40% reduction in LLM API calls
- **Coverage**: 80% of queries are FAQ-like (cache hits)
- **Scalability**: 5-10x more concurrent users

---

## 📊 Quick Facts

| Aspect | Finding |
|--------|---------|
| **Intent Routing** | Currently explicit (user selects) |
| **Main RAG Function** | `rag_document_search()` in `chat_tasks.py:874-1015` |
| **Search Service** | `HybridSearchService` (semantic + lexical) |
| **Query Enhancer** | `QueryEnhancer` (DIRECT/HYDE/DECOMPOSED strategies) |
| **Current Cache** | Redis session messages (1h TTL) |
| **Missing Cache** | Search results & LLM responses |
| **Infrastructure** | Redis ✓, Qdrant ✓, PostgreSQL ✓, OpenRouter ✓ |
| **Frontend Mode Selector** | `chat-composer.tsx:74-96` |
| **Backend Router** | `ChatService.add_message()` in `chat_service.py:68-145` |

---

## 🚀 Implementation Checklist

### Phase 1: Intent Classification (2-3 hours)
- [ ] Create `IntentClassifier` class with keyword matching
- [ ] Add SQL keywords: "thống kê", "so sánh", "dữ liệu", "biểu đồ", "phân tích"
- [ ] Add RAG keywords: "tài liệu", "PDF", "trong file", "từ trang"
- [ ] Create `IntentResult` dataclass with confidence scores
- [ ] Extend `QueryEnhancer.enhance()` to return intent
- [ ] Write tests for intent classification

### Phase 2: Auto-Routing (1-2 hours)
- [ ] Modify `ChatService.add_message()` to call intent classifier
- [ ] Support "auto" mode in `MessageCreate` schema
- [ ] Fallback to explicit mode for backward compatibility
- [ ] Store detected intent in message metadata
- [ ] Update API response to include `detected_intent` and `intent_confidence`
- [ ] Write tests for mode routing

### Phase 3: Search Result Cache (2-3 hours)
- [ ] Create `SearchResultCache` service
- [ ] Implement cache key: `hash(query + user_id + dept + strategy)`
- [ ] Set TTL to 24 hours (configurable)
- [ ] Integrate with `HybridSearchService.search()`
- [ ] Add cache hit/miss logging
- [ ] Write cache invalidation logic
- [ ] Write tests for cache hit/miss

### Phase 4: LLM Response Cache (2-3 hours)
- [ ] Create `LLMResponseCache` service
- [ ] Implement cache key: `hash(context_text + question + mode)`
- [ ] Set TTL to 7 days (configurable)
- [ ] Integrate with `_synthesize_with_llm()`
- [ ] Cache both response and citations
- [ ] Add cache hit/miss logging
- [ ] Write tests for cache hit/miss

### Phase 5: Frontend Updates (1-2 hours)
- [ ] Add "auto" option to mode selector (optional UI change)
- [ ] Display `detected_intent` in message metadata
- [ ] Show `cache_hit` indicator (optional)
- [ ] Update message rendering to show cache status
- [ ] Add tests for UI updates

### Phase 6: Configuration & Testing (1-2 hours)
- [ ] Add settings to `config.py`:
  - `AUTO_INTENT_ROUTING_ENABLED`
  - `SEARCH_CACHE_ENABLED`
  - `LLM_RESPONSE_CACHE_ENABLED`
  - `SEARCH_CACHE_TTL_SECONDS` (86400)
  - `LLM_CACHE_TTL_SECONDS` (604800)
- [ ] End-to-end testing with real queries
- [ ] Performance benchmarking
- [ ] Cache invalidation verification
- [ ] Load testing

---

## 🔑 Critical Integration Points

### 1. Intent Classifier
**File**: `backend/src/services/search/query_enhancer.py`

Extend `QueryEnhancer.enhance()` to also classify intent:
```python
def enhance(self, query: str) -> EnhancedQuery:
    # ... existing code ...
    intent = self._classify_intent(query)
    return EnhancedQuery(..., intent=intent)
```

### 2. Auto-Routing
**File**: `backend/src/services/chat_service.py:68-145`

Modify `add_message()` to auto-detect mode:
```python
if message.mode == "auto" or not message.mode:
    intent_result = IntentClassifier().classify(message.content)
    detected_mode = intent_result.intent
else:
    detected_mode = message.mode
```

### 3. Search Cache
**File**: `backend/src/services/search/hybrid_search.py:81-143`

Add cache check before searching:
```python
def search(self, query, user_id, ...):
    cache_key = self._make_cache_key(query, user_id, ...)
    cached = search_cache.get(cache_key)
    if cached:
        return cached
    # ... existing search logic ...
    search_cache.set(cache_key, results)
    return results
```

### 4. LLM Response Cache
**File**: `backend/src/worker/chat_tasks.py:493-562`

Add cache check before LLM call:
```python
def _synthesize_with_llm(question, context_text, ...):
    context_hash = hash(context_text)
    cached = llm_cache.get(context_hash, question, mode)
    if cached:
        return cached
    # ... existing LLM call ...
    llm_cache.set(context_hash, question, mode, response)
    return response
```

### 5. Schema Updates
**File**: `backend/src/schemas/schemas.py`

Add fields to `MessageSchema`:
```python
class MessageSchema(BaseModel):
    # ... existing fields ...
    detected_intent: Optional[str] = None  # "chat", "sql", "rag"
    intent_confidence: Optional[float] = None  # 0.0-1.0
    cache_hit: Optional[bool] = None  # True if response from cache
```

---

## 📋 Testing Strategy

### Unit Tests
```bash
tests/test_intent_classifier.py
- Test keyword matching for SQL queries
- Test keyword matching for RAG queries
- Test confidence scoring
- Test edge cases (mixed keywords, short queries)

tests/test_search_cache.py
- Test cache key generation
- Test cache hit scenarios
- Test cache miss scenarios
- Test cache invalidation

tests/test_llm_response_cache.py
- Test cache key generation
- Test cache hit scenarios
- Test cache invalidation
```

### Integration Tests
```bash
tests/integration/test_auto_routing.py
- Test full pipeline with auto-mode
- Test fallback to explicit mode
- Test metadata storage

tests/integration/test_cache_pipeline.py
- Test search cache + LLM cache together
- Test cache hit rates
- Test invalidation on document upload
```

### Performance Tests
```bash
tests/performance/test_latency.py
- Benchmark cached vs uncached queries
- Measure 50-80x improvement for FAQs
- Track cache hit rate percentage
```

---

## 🔍 Validation Checklist

- [ ] All 3 reports reviewed and understood
- [ ] Code locations verified in actual codebase
- [ ] Line numbers match (some drift expected after changes)
- [ ] QueryEnhancer location confirmed
- [ ] ChatService.add_message() location confirmed
- [ ] HybridSearchService.search() location confirmed
- [ ] _synthesize_with_llm() location confirmed
- [ ] Redis infrastructure confirmed working
- [ ] MessageSchema location confirmed

---

## 📞 Questions to Ask During Implementation

1. **Auto-Routing Confidence Threshold**: What confidence level should trigger auto-routing vs requiring user selection?
   - Recommendation: ≥ 0.8 auto-route, < 0.8 show selector

2. **Cache Invalidation Timing**: When should search cache be cleared after document upload?
   - Recommendation: Immediately, before returning upload success response

3. **Cache Size Limits**: Should we set Redis memory limits for cache?
   - Recommendation: Monitor and set to 500MB-1GB initially

4. **Frontend Auto-Mode Display**: Should mode selector be hidden, grayed out, or replaced with "auto"?
   - Recommendation: Keep selector, add "auto" option as default

5. **Cache Metrics**: What metrics should be tracked (hit rate, latency, cost)?
   - Recommendation: All of the above in a new `cache_metrics` table

---

## 📞 Support Resources

- **Codebase**: `/Volumes/orical/ChatSNP/chatSNP170226/`
- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- **Main RAG Function**: `backend/src/worker/chat_tasks.py:874-1015`
- **Router Function**: `backend/src/services/chat_service.py:68-145`
- **Search Service**: `backend/src/services/search/hybrid_search.py`
- **Query Enhancer**: `backend/src/services/search/query_enhancer.py`

---

## 📈 Success Metrics

- [ ] Intent classification accuracy > 95%
- [ ] Cache hit rate > 70% for FAQ-like queries
- [ ] Latency reduction from 5-8s to < 200ms for cached queries
- [ ] LLM API cost reduction ≥ 30%
- [ ] All tests passing
- [ ] No regressions in existing functionality
- [ ] Smooth fallback when cache misses

---

**Generated**: April 14, 2026  
**Exploration Depth**: Very Thorough  
**Status**: Ready for Implementation 🚀
