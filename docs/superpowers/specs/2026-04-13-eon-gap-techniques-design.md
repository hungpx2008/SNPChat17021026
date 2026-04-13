# EON Gap Techniques Integration — Design Spec

**Date:** 2026-04-13
**Source:** [TCSGxEONSR] Phương án triển khai AI Agent (EON proposal)
**Target:** ChatSNP Backend (FastAPI + Celery + PostgreSQL + Qdrant)
**Prerequisite:** Smart2Brain Phases 1-4 already implemented (token_estimator, summarization, context_builder, hybrid_search)

## Overview

Port 4 techniques from the EON proposal into ChatSNP to improve data ingestion, search quality, query intelligence, and UX. These fill gaps that the Smart2Brain integration did not cover: parent-child chunking, HyDE query enhancement, auto-routing, semantic caching, and OCR for scanned documents.

**Approach:** Build on existing ChatSNP infrastructure. Reuse gpt-4o-mini via OpenRouter (no new API dependencies). Integrate with existing Hybrid Search (Whoosh BM25 + Qdrant semantic + RRF) from S2B Phase 4.

**Milestone:** 1 milestone, 4 phases, ordered by dependency.

---

## Phase Order & Dependencies

```
Phase 6: Parent-Child Chunking (foundation — changes how chunks are stored)
    ↓
Phase 7: HyDE + Query Decomposition (searches child chunks, retrieves parents)
    ↓
Phase 8: Auto-routing + Semantic Cache (wraps entire pipeline)

Phase 9: PaddleOCR (independent, nice-to-have — can be done anytime)
```

**Dependency rationale:**
1. Phase 6 changes Qdrant payload schema and adds a DB table — all subsequent phases work on this new schema
2. Phase 7 searches child chunks and retrieves parent content — requires Phase 6
3. Phase 8 wraps the full pipeline with routing and caching — requires Phase 7 for optimal behavior
4. Phase 9 is independent — only affects the ingestion pipeline, no downstream dependencies

---

## Phase 6: Parent-Child Chunking

**Goal:** Replace flat single-tier chunking with a 2-tier parent-child model. Child chunks (small) are used for vector search. Parent chunks (large) are fed to the LLM for complete context.

**Problem:** Current flat chunks (~768 tokens) are a compromise. Smaller chunks improve search precision but lose surrounding context. Larger chunks provide context but hurt search specificity.

**Solution:** Two-tier chunking resolves this tradeoff:
- **Child chunks** (~384 tokens): small, precise for vector search
- **Parent chunks** (~2048 tokens): large, complete context for LLM

### Constants

```python
# backend/src/services/docling_service.py (add to existing constants section)

PARENT_CHUNK_MAX_TOKENS = 2048    # Docling chunks become parents
CHILD_CHUNK_MAX_TOKENS = 384     # Children split from parents
CHILD_CHUNK_OVERLAP_TOKENS = 50  # Overlap between children to preserve boundary context
```

### New DB Table

**File:** `backend/src/models/models.py`

```python
class ChunkParent(Base):
    __tablename__ = "chunk_parents"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    document_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=True, index=True,
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    page_number: Mapped[int] = mapped_column(default=0)
    headings: Mapped[dict] = mapped_column(JSONB, default=list)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
```

No migration needed for Qdrant — reuse `port_knowledge` collection. Child chunks add a `parent_id` field to the existing payload.

### Changes to Docling Service

**File:** `backend/src/services/docling_service.py`

Add method `_split_into_children()`:

```python
def _split_into_children(
    self,
    parent_text: str,
    parent_id: str,
    parent_meta: dict,
) -> list[dict]:
    """Split a parent chunk into smaller child chunks for vector search.

    Each child inherits the parent's metadata and adds parent_id for retrieval.
    Uses word-boundary splitting with overlap for context continuity.

    Args:
        parent_text: Full parent chunk text.
        parent_id: UUID of the ChunkParent row.
        parent_meta: Metadata (page_number, headings, row_keys) from parent.

    Returns:
        List of child chunk dicts: {text, parent_id, page, headings, row_keys, chunk_index}.
    """
```

Algorithm:
1. Estimate token count of parent (using `token_estimator.estimate_tokens`)
2. If parent < `CHILD_CHUNK_MAX_TOKENS * 1.5` → return as single child (no split needed)
3. Otherwise, split at sentence boundaries to create children of ~`CHILD_CHUNK_MAX_TOKENS` tokens
4. Add `CHILD_CHUNK_OVERLAP_TOKENS` overlap between consecutive children
5. Each child inherits parent's `page_number`, `headings`, `row_keys`
6. Each child gets `parent_id` pointing to the `ChunkParent` row

### Changes to Ingestion Pipeline

**File:** `backend/src/worker/media_tasks.py`

Modify `_do_full_processing()`:

```python
# Current flow:
# Docling chunks → embed → Qdrant (flat)

# New flow:
# 1. Docling chunks (~768 tokens) → increase to ~2048 tokens → these are PARENTS
# 2. Save parents to PostgreSQL (ChunkParent table)
# 3. Split each parent → children (~384 tokens)
# 4. Embed children → Qdrant with parent_id in payload
```

Qdrant payload for child chunks (extends existing payload):
```python
{
    "content": child_text,            # Existing
    "source_file": filename,          # Existing
    "page_number": page,              # Existing
    "document_id": doc_id,            # Existing
    "user_id": user_id,               # Existing
    "department": department,          # Existing
    "quality": "default",             # Existing
    "headings": headings,             # Existing
    "chunk_index": child_index,       # Existing
    "parent_id": str(parent.id),      # NEW — links to ChunkParent row
    "is_child": True,                 # NEW — flag for backward compat
}
```

### Changes to Retrieval

**File:** `backend/src/worker/chat_tasks.py`

Modify `rag_document_search` task (after hybrid search returns results):

```python
# Current: use search result content directly as LLM context
# New:
# 1. Search returns child chunks (small, precise)
# 2. Collect unique parent_ids from results
# 3. Fetch parent content from PostgreSQL (ChunkParent table)
# 4. Dedup parents (multiple children may point to same parent)
# 5. Feed parent content to LLM (larger, complete context)
# 6. Keep child-level citations for source attribution
```

New helper function:
```python
def _fetch_parent_chunks(parent_ids: list[str]) -> dict[str, str]:
    """Fetch parent chunk content from PostgreSQL.

    Args:
        parent_ids: List of ChunkParent UUIDs from child search results.

    Returns:
        Dict mapping parent_id → parent content text.
        Missing parents (backward compat) return empty string.
    """
```

**File:** `backend/src/services/search/hybrid_search.py`

Update `SearchResult` dataclass:
```python
@dataclass
class SearchResult:
    # ... existing fields ...
    parent_id: str = ""  # NEW — ChunkParent UUID, empty for legacy chunks
```

### Changes to Whoosh Index

**File:** `backend/src/services/search/lexical_search.py`

Index child chunks instead of flat chunks. Schema unchanged — Whoosh indexes text content regardless of chunk tier.

### Backward Compatibility

- Documents indexed before this change have no `parent_id` in Qdrant payload → retrieval falls back to using child content directly (same as current behavior)
- Optional admin endpoint `POST /admin/reindex/{document_id}` to re-process existing documents with parent-child chunking
- No data loss — parent table is additive

### Docling Chunk Size Change

Current `DOCLING_CHUNK_MAX_TOKENS = 768`. Two options:

**Option A (recommended):** Increase Docling chunk size to ~2048 tokens for parent, then split into children.
- Change `DOCLING_CHUNK_MAX_TOKENS` env var from 768 → 2048
- Children become ~384 tokens (close to current search granularity)

**Option B:** Keep Docling at 768, group adjacent Docling chunks into parents.
- More complex, harder to maintain context boundaries

→ **Go with Option A.** Simpler, leverages Docling's semantic chunking at a larger granularity.

### Testing

- Unit test: `_split_into_children()` with various parent sizes (small/medium/large, with/without tables)
- Unit test: `_fetch_parent_chunks()` with existing parents, missing parents, empty list
- Integration test: upload document → verify ChunkParent rows created → verify child chunks in Qdrant have parent_id → search returns parent content
- Regression test: documents without parent_id still return results (backward compat)

---

## Phase 7: HyDE + Query Decomposition

**Goal:** Improve search quality for long Vietnamese queries and complex multi-part questions by enhancing the query before searching.

**Problem 1 — Long queries:** Vietnamese users describe questions in full context ("Tôi muốn biết quy trình xuất khẩu hàng đông lạnh qua cảng Cát Lái gồm những bước nào, cần giấy tờ gì") rather than short keywords. Embedding the full question often misses relevant documents because query language differs from document language.

**Problem 2 — Complex queries:** Multi-part questions ("so sánh biểu giá container 20ft và 40ft tại Cát Lái và Hiệp Phước") contain multiple sub-topics that a single search cannot fully cover.

**Source:** EON proposal recommends HyDE as default strategy for Vietnamese, Query Decomposition for multi-clause questions.

### New File

#### `backend/src/services/search/query_enhancer.py`

```python
"""Query enhancement for RAG search — HyDE and Query Decomposition.

Improves retrieval quality by transforming user queries before vector search.
Uses gpt-4o-mini via OpenRouter (same as existing LLM calls).

Strategies:
  - direct: Short/simple queries → embed as-is (no LLM call)
  - hyde: Long queries → LLM generates hypothetical answer → embed that instead
  - decomposed: Complex multi-part queries → split into sub-queries → search in parallel
"""

from dataclasses import dataclass


@dataclass
class EnhancedQuery:
    """Result of query enhancement."""
    original: str                # Original user query
    queries: list[str]           # 1 query (direct/hyde) or N sub-queries (decomposed)
    strategy: str                # "direct" | "hyde" | "decomposed"
    hyde_output: str | None      # Hypothetical answer (if strategy == "hyde")


class QueryEnhancer:
    """Enhance user queries before search.

    Decision logic:
      1. If query < HYDE_MIN_TOKENS → direct (no enhancement)
      2. If query contains comparison/multi-part signals → decompose
      3. Otherwise → HyDE
    """

    def enhance(self, query: str, model: str | None = None) -> EnhancedQuery:
        """Analyze query and apply appropriate enhancement strategy.

        Args:
            query: Raw user query text.
            model: LLM model override. Defaults to HYDE_MODEL env var.

        Returns:
            EnhancedQuery with enhanced queries and strategy used.
        """
```

### Constants

```python
# query_enhancer.py top-level constants

HYDE_MIN_TOKENS = 30              # Queries shorter than this → direct (no HyDE)
HYDE_MAX_OUTPUT_TOKENS = 300      # Max tokens for hypothetical answer
DECOMPOSE_MAX_SUB_QUERIES = 4    # Max sub-queries from decomposition
HYDE_MODEL = None                 # Defaults to LLM_MODEL env var (gpt-4o-mini)

# Signals that trigger decomposition instead of HyDE
DECOMPOSE_SIGNALS_VI = [
    "so sánh", "và", "giữa", "khác nhau", "tương tự",
    "cả hai", "từng cái", "lần lượt",
]
```

### LLM Prompts

**HyDE prompt:**
```
Dựa trên câu hỏi sau, hãy viết một đoạn trả lời giả định ngắn gọn (~100 từ) như thể bạn đang trích từ một tài liệu chính thức của cảng biển Tân Cảng Sài Gòn.
Sử dụng thuật ngữ chuyên ngành cảng biển, logistics. Viết bằng tiếng Việt.
KHÔNG bịa số liệu cụ thể. Tập trung vào cấu trúc và thuật ngữ đúng.

Câu hỏi: {query}
```

**Decomposition prompt:**
```
Tách câu hỏi phức tạp sau thành các câu hỏi con đơn giản, mỗi câu có thể tra cứu độc lập.
Tối đa {max_sub_queries} câu hỏi con.
Trả về JSON array of strings, không giải thích thêm.

Câu hỏi: {query}
```

**Decomposition detection prompt:**
```
Câu hỏi sau có phải là câu hỏi phức tạp chứa nhiều phần cần tra cứu riêng không?
Trả về JSON: {"complex": true/false}

Câu hỏi: {query}
```

### Decision Logic Detail

```python
def _classify_query(self, query: str) -> str:
    """Classify query into strategy without LLM call.

    Fast heuristic:
      1. Short query → "direct"
      2. Contains decomposition signals → "decomposed"
      3. Long query → "hyde"
    """
    tokens = estimate_tokens(query)

    if tokens < HYDE_MIN_TOKENS:
        return "direct"

    query_lower = query.lower()
    if any(signal in query_lower for signal in DECOMPOSE_SIGNALS_VI):
        return "decomposed"

    return "hyde"
```

For decomposition, an additional LLM call confirms complexity. If the LLM says `{"complex": false}`, fall back to HyDE.

### Integration into RAG Pipeline

**File:** `backend/src/worker/chat_tasks.py`

Modify `rag_document_search` task:

```python
# Before (current):
# question → hybrid_search.search(question) → results → LLM

# After:
# question → QueryEnhancer.enhance(question) → EnhancedQuery
#   → if direct/hyde: hybrid_search.search(enhanced_query) → child results
#   → if decomposed: for each sub_query: hybrid_search.search(sub_query) → merge
# → fetch parent chunks from DB
# → dedup parents
# → LLM synthesis with parent context
```

**File:** `backend/src/services/search/hybrid_search.py`

Update `HybridSearchService.search()` to accept `queries: list[str]`:

```python
def search(
    self,
    query: str | list[str],   # Single query or list of sub-queries
    user_id: str | None = None,
    department: str | None = None,
    limit: int = 5,
) -> list[SearchResult]:
    """Search with single query or merge results from multiple sub-queries.

    When queries is a list:
      1. Run each sub-query in parallel (ThreadPoolExecutor)
      2. Merge results across sub-queries
      3. Dedup by doc_id (keep highest score)
      4. Return top-limit results
    """
```

### Performance Budget

- HyDE LLM call: ~300-500ms (gpt-4o-mini, ~200 tokens in + ~300 tokens out)
- Decomposition LLM call: ~200-400ms (gpt-4o-mini, ~100 tokens in + ~50 tokens out)
- Total added latency: 300-900ms depending on strategy
- Acceptable: RAG queries currently take 5-15s, so <1s additional is negligible

### Testing

- Unit test: `_classify_query()` with short/long/complex Vietnamese queries
- Unit test: HyDE prompt produces reasonable hypothetical answers for port domain queries
- Unit test: Decomposition produces valid sub-queries for multi-part questions
- Integration test: enhanced query returns better results than direct query for known test cases
- Regression test: short queries still use direct strategy (no unnecessary LLM calls)

---

## Phase 8: Auto-routing + Semantic Cache

**Goal:** (1) Automatically detect user intent to choose the right mode (chat/sql/rag) without manual selection. (2) Cache answers for frequently repeated questions.

### Part A: Auto-routing (Intent Classification)

**Problem:** Users must manually select mode (Trợ lý / Số liệu / Tài liệu) in ChatComposer. Common mistakes: asking data questions in chat mode, asking process questions in SQL mode.

**Solution:** LLM-based intent classification. One lightweight gpt-4o-mini call (~100 tokens) determines the correct mode.

#### New File

##### `backend/src/services/intent_router.py`

```python
"""Intent-based auto-routing for chat queries.

Classifies user queries into one of three modes:
  - "chat": General conversation, greetings, follow-ups
  - "sql":  Data queries, pricing, statistics, database lookups
  - "rag":  Process questions, policies, document search

Uses gpt-4o-mini via OpenRouter. Falls back to user-selected mode
if classification confidence is below threshold.
"""

from dataclasses import dataclass


@dataclass
class RoutingResult:
    """Result of intent classification."""
    intent: str            # "chat" | "sql" | "rag"
    confidence: float      # 0.0 - 1.0
    reasoning: str         # Short explanation (for logging/debug)
    fallback_used: bool    # True if fell back to user-selected mode


class IntentRouter:
    """Classify user intent to route to correct processing mode.

    Parameters:
        confidence_threshold: Minimum confidence to accept classification.
            Below this, fall back to user-selected mode. Default: 0.7.
        model: LLM model for classification. Default: LLM_MODEL env var.
    """

    CONFIDENCE_THRESHOLD = 0.7

    def classify(self, query: str, fallback_mode: str = "chat") -> RoutingResult:
        """Classify query intent.

        Args:
            query: User's message text.
            fallback_mode: Mode to use if confidence < threshold.

        Returns:
            RoutingResult with classified intent and confidence.
        """
```

#### Routing Prompt

```
Phân loại câu hỏi của người dùng vào đúng 1 trong 3 nhóm xử lý:

- "sql": Hỏi về SỐ LIỆU cụ thể — biểu giá, phí dịch vụ, thống kê, sản lượng, doanh thu, thời gian lưu bãi, số container. Đặc điểm: cần truy vấn database để trả lời.
- "rag": Hỏi về QUY TRÌNH, CHÍNH SÁCH, HƯỚNG DẪN — thủ tục hải quan, quy trình nhập xuất, chính sách an toàn, biểu mẫu, quy định. Đặc điểm: cần tra cứu tài liệu để trả lời.
- "chat": Chào hỏi, cảm ơn, hỏi chung về ChatSNP, hoặc không thuộc 2 nhóm trên.

Trả về JSON duy nhất, không giải thích:
{"intent": "sql"|"rag"|"chat", "confidence": 0.0-1.0, "reasoning": "lý do ngắn"}

Câu hỏi: {query}
```

#### Heuristic Pre-filter (No LLM Call)

Before calling the LLM, apply fast heuristics to avoid unnecessary API calls:

```python
SQL_SIGNALS = ["biểu giá", "phí", "giá", "bao nhiêu", "sản lượng", "thống kê",
               "container", "teu", "doanh thu", "chi phí"]
RAG_SIGNALS = ["quy trình", "thủ tục", "hướng dẫn", "chính sách", "biểu mẫu",
               "quy định", "cách", "làm sao", "bước"]
CHAT_SIGNALS = ["xin chào", "cảm ơn", "tạm biệt", "bạn là ai", "giúp gì"]
```

If query matches CHAT_SIGNALS with high confidence → skip LLM call, return "chat" directly.

#### Frontend Changes

**File:** `frontend/src/components/chat/chat-composer.tsx`

Add "Tự động" mode as default:

```typescript
const MODES = [
  { value: "auto", label: "Tự động", icon: SparklesIcon },  // NEW — default
  { value: "chat", label: "Trợ lý", icon: MessageIcon },
  { value: "sql", label: "Số liệu", icon: DatabaseIcon },
  { value: "rag", label: "Tài liệu", icon: FileTextIcon },
];
```

When mode is "auto", the backend decides. The response includes the detected mode, displayed as a badge on the assistant message:

```typescript
// In chat-message-list.tsx, for assistant messages:
{message.metadata?.detected_mode && (
  <Badge variant="outline">
    {modeLabels[message.metadata.detected_mode]}
  </Badge>
)}
```

#### Backend Changes

**File:** `backend/src/api/chat.py`

In the POST `/sessions/{id}/messages` endpoint, when `mode="auto"`:

```python
if mode == "auto":
    routing = IntentRouter().classify(content, fallback_mode="chat")
    mode = routing.intent
    # Store routing result in message metadata for frontend badge
    metadata["detected_mode"] = routing.intent
    metadata["routing_confidence"] = routing.confidence
```

**File:** `backend/src/services/chat_service.py`

`add_message()` passes the resolved mode to task dispatch (no change to dispatch logic itself).

### Part B: Semantic Cache

**Problem:** Frequently asked questions (pricing, common procedures) trigger the full RAG/SQL pipeline every time (5-15s). Many queries are semantically identical.

**Solution:** Cache Q&A pairs keyed by query embedding. Before running the pipeline, check if a semantically similar query was answered recently.

#### New File

##### `backend/src/services/semantic_cache.py`

```python
"""Semantic cache for RAG and SQL query results.

Stores Q&A pairs in Redis, keyed by query embedding similarity.
Before running the full pipeline, checks if a sufficiently similar
query was recently answered.

Storage format in Redis:
  Key:   semcache:{department}:entries   (Redis Sorted Set)
  Score: timestamp (for TTL cleanup)
  Value: JSON { query_vector: [...], query_text: "...",
                answer: "...", mode: "rag"|"sql",
                metadata: {...}, created_at: ... }
"""

from dataclasses import dataclass


@dataclass
class CacheHit:
    """A cached answer that matched the query."""
    answer: str
    original_query: str
    similarity: float
    mode: str
    metadata: dict
    age_seconds: float


class SemanticCache:
    """Redis-backed semantic cache for Q&A pairs.

    Attributes:
        SIMILARITY_THRESHOLD: Minimum cosine similarity to consider a cache hit.
            Set very high (0.95) to only match near-identical queries.
        TTL_SECONDS: Time-to-live for cache entries. Default 24 hours.
        MAX_ENTRIES_PER_DEPT: Maximum cached entries per department.
            Prevents unbounded memory growth.
    """

    SIMILARITY_THRESHOLD = 0.95
    TTL_SECONDS = 86400           # 24 hours
    MAX_ENTRIES_PER_DEPT = 1000

    def get(
        self, query: str, department: str | None = None
    ) -> CacheHit | None:
        """Check cache for semantically similar query.

        Args:
            query: User query text.
            department: Department filter (queries from different departments
                may have different answers).

        Returns:
            CacheHit if similar query found above threshold, None otherwise.
        """

    def put(
        self,
        query: str,
        answer: str,
        mode: str,
        department: str | None = None,
        metadata: dict | None = None,
    ) -> None:
        """Store a Q&A pair in cache.

        Args:
            query: Original user query.
            answer: Generated answer to cache.
            mode: Processing mode used ("rag" or "sql").
            department: Department scope.
            metadata: Additional metadata (citations, sources, etc.).
        """

    def invalidate(self, department: str | None = None) -> int:
        """Invalidate cache entries.

        Called when new documents are uploaded (RAG answers may change)
        or when admin trains new DDL (SQL answers may change).

        Args:
            department: If provided, only invalidate this department's cache.
                If None, invalidate all caches.

        Returns:
            Number of entries removed.
        """

    def cleanup_expired(self) -> int:
        """Remove entries older than TTL_SECONDS. Called periodically."""
```

#### Embedding for Cache Lookup

Reuse the existing `embed_text()` function from `core/mem0_config.py` (calls Mem0 service POST /embed). The resulting 1024-dim vector is compared against cached vectors using cosine similarity.

For efficiency, cache vectors are stored as JSON arrays in Redis. On lookup:
1. Embed the new query → 1024-dim vector
2. Fetch all entries for the department from Redis
3. Compute cosine similarity against each cached vector
4. Return the highest-similarity match if above threshold

For departments with many cached entries (>100), this linear scan may become slow. Future optimization: use a small in-memory FAISS index per department. For now, 1000 entries × 1024-dim cosine is fast enough (<10ms).

#### Integration

**File:** `backend/src/worker/chat_tasks.py`

In `rag_document_search` task, wrap the pipeline:

```python
# 1. Check cache first (sync — Celery worker context)
cache = SemanticCache()
hit = cache.get(question, department=department)
if hit:
    # Cache hit — save as assistant message directly, skip pipeline
    _save_assistant_message(session_id, hit.answer, metadata={"cache_hit": True, ...})
    publish_task_complete(session_id, ...)
    return

# 2. Run full pipeline (QueryEnhancer → HybridSearch → parent fetch → LLM)
answer = ...

# 3. Cache the result
cache.put(question, answer, mode="rag", department=department, metadata=...)
```

Same pattern in `run_sql_query` task in `data_tasks.py`.

**File:** `backend/src/worker/media_tasks.py`

In `process_document` task, after successful processing:

```python
# Invalidate cache for this user's department — new document may change answers
cache = SemanticCache()
cache.invalidate(department=user_department)
```

**File:** `backend/src/api/admin.py`

Add admin endpoint:
```python
@router.delete("/cache/semantic")
async def clear_semantic_cache(department: str | None = None):
    """Admin: clear semantic cache for a department or all."""
    removed = SemanticCache().invalidate(department)
    return {"removed": removed}
```

### Testing

**Auto-routing:**
- Unit test: heuristic pre-filter correctly classifies obvious queries
- Unit test: LLM routing returns valid JSON with correct schema
- Unit test: fallback triggers when confidence < 0.7
- Integration test: mode="auto" in API dispatches correct task type
- Frontend test: "Tự động" mode is default, badge shows detected mode

**Semantic cache:**
- Unit test: put/get round-trip with exact query returns hit
- Unit test: similar query (cosine > 0.95) returns hit
- Unit test: different query (cosine < 0.95) returns None
- Unit test: invalidate removes entries for department
- Unit test: TTL expiry works
- Integration test: second identical RAG query returns cached result in <500ms

---

## Phase 9: PaddleOCR Integration

**Goal:** Extract text from scanned PDFs and photographed documents that Docling cannot read. Nice-to-have — most SNP documents are native PDFs with embedded text.

**Problem:** When a PDF contains scanned images instead of text, Docling returns empty or near-empty content. The document is stored but its content is not searchable.

**Solution:** Detect scanned PDFs by checking text extraction ratio. If below threshold, render pages to images and run PaddleOCR.

### New File

#### `backend/src/services/ocr_service.py`

```python
"""OCR service for scanned documents using PaddleOCR.

Extracts text from images and scanned PDF pages.
Optimized for Vietnamese text with PaddleOCR's multi-language support.

Usage:
    ocr = OCRService()
    result = ocr.extract_from_image("/path/to/image.png")
    result = ocr.extract_from_pdf("/path/to/scanned.pdf")
"""

from dataclasses import dataclass


@dataclass
class OCRResult:
    """Result of OCR processing."""
    text: str                           # Full extracted text
    pages: list[PageOCRResult]          # Per-page results
    confidence: float                   # Average confidence score
    language: str                       # Detected language


@dataclass
class PageOCRResult:
    """OCR result for a single page."""
    page_number: int
    text: str
    boxes: list[dict]                   # Bounding boxes with text and confidence
    confidence: float
    has_table: bool                     # True if structured table detected


class OCRService:
    """PaddleOCR wrapper for Vietnamese text extraction.

    Attributes:
        LANGUAGE: OCR language. Default "vi" (Vietnamese).
        DPI: Resolution for PDF-to-image conversion. Default 300.
        CONFIDENCE_THRESHOLD: Minimum confidence to include text. Default 0.5.
    """

    LANGUAGE = "vi"
    DPI = 300
    CONFIDENCE_THRESHOLD = 0.5

    def __init__(self):
        """Initialize PaddleOCR. Model is loaded lazily on first use."""

    def extract_from_image(self, image_path: str) -> OCRResult:
        """Extract text from a single image file.

        Args:
            image_path: Path to image file (PNG, JPG).

        Returns:
            OCRResult with extracted text and bounding boxes.
        """

    def extract_from_pdf(self, pdf_path: str) -> OCRResult:
        """Extract text from a scanned PDF.

        Converts each page to image at DPI resolution, then OCRs each page.

        Args:
            pdf_path: Path to PDF file.

        Returns:
            OCRResult with per-page extracted text.
        """

    @staticmethod
    def is_scanned_pdf(
        extracted_text: str,
        page_count: int,
        min_chars_per_page: int = 100,
    ) -> bool:
        """Detect if a PDF is scanned (image-based) rather than native text.

        Heuristic: if average chars per page is below threshold,
        the PDF is likely scanned.

        Args:
            extracted_text: Text extracted by Docling.
            page_count: Number of pages in the PDF.
            min_chars_per_page: Minimum chars/page to consider native.

        Returns:
            True if likely scanned, False if native text.
        """
```

### Constants

```python
MIN_CHARS_PER_PAGE = 100       # Below this → "scanned" PDF
OCR_LANGUAGE = "vi"
OCR_DPI = 300
OCR_CONFIDENCE_THRESHOLD = 0.5
```

### Integration into Ingestion Pipeline

**File:** `backend/src/worker/media_tasks.py`

Modify `process_document` task:

```python
# Current flow:
# PDF → Docling → chunks → embed

# New flow:
# PDF → Docling → extracted_text
#   → is_scanned_pdf(extracted_text, page_count)?
#     ├── No  → continue with Docling chunks (current flow)
#     └── Yes → OCRService.extract_from_pdf(file_path) → ocr_text
#               → use ocr_text as extracted_text
#               → continue into _do_full_processing (chunking + embedding)
```

For standalone image files (.jpg, .png):

```python
# Current: VLM description only
# New: PaddleOCR extract text FIRST
#   → If OCR finds text → use as primary content
#   → Also call VLM for visual description → append as supplement
#   → Both go into chunks
```

### Dependencies

**File:** `backend/pyproject.toml`

```toml
# Add to dependencies:
"paddleocr>=2.7",
"paddlepaddle>=2.6",    # PaddleOCR backend
"pdf2image>=1.16",      # PDF → images for OCR
```

**File:** `backend/Dockerfile`

```dockerfile
# Add system dependencies for pdf2image:
RUN apt-get update && apt-get install -y poppler-utils && rm -rf /var/lib/apt/lists/*
```

**File:** `docker-compose.yml`

```yaml
backend:
  volumes:
    - paddle_models:/root/.paddleocr   # Cache OCR models (~200MB)

volumes:
  paddle_models:
```

### Performance

- PaddleOCR model loading: ~5s (first use, cached after)
- OCR per page: ~1-3s depending on complexity
- 10-page scanned PDF: ~15-30s total
- Acceptable since document processing is already async (Celery)

### Testing

- Unit test: `is_scanned_pdf()` correctly identifies scan vs native
- Unit test: `extract_from_image()` returns text for a test Vietnamese image
- Unit test: `extract_from_pdf()` returns per-page text for a test scanned PDF
- Integration test: upload scanned PDF → verify OCR runs → chunks created in Qdrant
- Regression test: native PDFs still use Docling path (no OCR)

---

## Files Changed Summary

| Phase | New Files | Modified Files |
|---|---|---|
| 6 | — | `models/models.py`, `services/docling_service.py`, `worker/media_tasks.py`, `worker/chat_tasks.py`, `services/search/hybrid_search.py`, `worker/helpers.py` |
| 7 | `services/search/query_enhancer.py` | `worker/chat_tasks.py`, `services/search/hybrid_search.py` |
| 8 | `services/intent_router.py`, `services/semantic_cache.py` | `api/chat.py`, `services/chat_service.py`, `worker/chat_tasks.py`, `worker/data_tasks.py`, `worker/media_tasks.py`, `api/admin.py`, frontend `chat-composer.tsx`, frontend `chat-message-list.tsx` |
| 9 | `services/ocr_service.py` | `worker/media_tasks.py`, `pyproject.toml`, `Dockerfile`, `docker-compose.yml` |

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Parent-child chunking increases Qdrant storage ~2-3x | Higher memory/disk | Monitor Qdrant collection size; old documents use legacy flat chunks until reindexed |
| HyDE adds ~500ms latency per RAG query | Slower response | Only trigger for queries > HYDE_MIN_TOKENS; direct path for short queries |
| Auto-routing misclassifies intent | Wrong mode, bad answer | Confidence threshold 0.7; user can still manually select mode; log routing decisions for tuning |
| Semantic cache serves stale answers | Incorrect information | Invalidate on document upload; 24h TTL; high similarity threshold 0.95 |
| PaddleOCR increases Docker image ~500MB | Larger deploys | Accept tradeoff — OCR models cached in volume, not rebuilt per deploy |
| Query decomposition increases API cost (multiple LLM calls) | Higher cost | Max 4 sub-queries; only trigger for complex queries detected by heuristic |
