# ChatSNP Implementation Details Report
**Date:** April 13, 2026  
**Project Location:** `/Volumes/orical/ChatSNP/chatSNP170226/`

---

## 📋 TABLE OF CONTENTS
1. [Document Ingestion Pipeline (Docling)](#1-document-ingestion-pipeline-docling)
2. [RAG Search Flow](#2-rag-search-flow)
3. [Mode Selection & Dispatch](#3-mode-selection--dispatch)
4. [Redis Usage & Caching](#4-redis-usage--caching)
5. [Qdrant Setup & Collections](#5-qdrant-setup--collections)
6. [End-to-End Data Flow](#6-end-to-end-data-flow)

---

## 1. DOCUMENT INGESTION PIPELINE (DOCLING)

### 1.1 Entry Point: `process_document` Task

**File:** `backend/src/worker/media_tasks.py`  
**Function:** `process_document()` (Line 26)  
**Type:** Celery Task (Queue: `media_process`)  

```python
@celery_app.task(name="src.worker.tasks.process_document", bind=True, max_retries=2)
def process_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
) -> dict[str, Any]:
```

**Function Signature Details:**
- `file_path` (str): Absolute path to uploaded file
- `user_id` (str|None): Document owner
- `original_filename` (str|None): Original filename for tracking
- `document_id` (str|None): Database document record ID
- **Returns:** Status dict with metadata

### 1.2 Supported File Types & Branch Logic

| File Type | Branch | Handler | Output |
|-----------|--------|---------|--------|
| `.jpg/.jpeg/.png` | A (VLM) | `_extract_text_from_image()` | Plain text description |
| `.pdf/.docx/.xlsx/.pptx/.md/.txt` | B (Docling) | `process_document_deep()` | Markdown + chunks |

**Lines 64-73 (Image Branch):**
```python
if ext in (".jpg", ".jpeg", ".png"):
    from src.worker.helpers import _extract_text_from_image
    extracted_text = _extract_text_from_image(file_path)
    page_count = 1
    table_count = 0
    deep_meta = {"extractor": "vlm", "vlm_model": os.getenv("LLM_MODEL", "gpt-4o-mini")}
```

**Lines 74-121 (Docling Branch):**
```python
else:
    # PPTX → PDF conversion (parallel)
    if ext in (".pptx", ".ppt"):
        # LibreOffice conversion...
    from src.services.docling_service import process_document_deep
    deep_result = process_document_deep(file_path)
```

### 1.3 Docling Deep Processing Service

**File:** `backend/src/services/docling_service.py`  
**Main Class:** `DoclingProcessor`  
**Entry Function:** `process_document_deep()` (Line 819)

#### Key Method: `DoclingProcessor.process()` (Line 607)

```python
def process(self, file_path: str) -> ProcessingResult:
    """
    Process a document through Docling's deep pipeline.
    Returns structured Markdown + extracted tables with page info.
    """
```

**Returns:** `ProcessingResult` dataclass (Line 38-45)
```python
@dataclass
class ProcessingResult:
    markdown: str = ""                    # Full document markdown with page markers
    tables: list[TableData] = [...]       # Extracted table metadata
    chunks: list[ChunkData] = [...]       # Pre-chunked semantic chunks
    metadata: dict = {}                   # Processing metadata
    page_count: int = 0                   # Total pages
    source_file: str = ""                 # Original filename
```

#### 1.3.1 Hybrid Chunking with Adaptive Table Serializer

**Lines 336-578:** `_build_docling_chunks()` method

**Process:**
1. **Imports (Line 342-356):**
   - `docling.chunking.HybridChunker`
   - `docling_core.transforms.chunker.hierarchical_chunker.ChunkingDocSerializer`
   - `transformers.AutoTokenizer` (for Vietnamese support)

2. **Configuration (Lines 361-368):**
   ```python
   markdown_max_cols = self._env_int("DOCLING_TABLE_MARKDOWN_MAX_COLS", 4)
   markdown_max_cells = self._env_int("DOCLING_TABLE_MARKDOWN_MAX_CELLS", 36)
   group_key_hints = self._normalize_group_hints(os.getenv("DOCLING_TABLE_GROUP_KEY_HINTS"))
   keep_heading_prefix = self._env_bool("DOCLING_PREFIX_HEADING_ROWKEY", True)
   enable_group_lock = self._env_bool("DOCLING_GROUP_LOCK_ENABLED", True)
   group_lock_max_chars = self._env_int("DOCLING_GROUP_LOCK_MAX_CHARS", 1800, minimum=256)
   normalize_table_values = self._env_bool("DOCLING_TABLE_NORMALIZE_VALUES", True)
   ```

3. **Tokenizer Selection (Lines 500-516):**
   - Prefers: `DOCLING_TOKENIZER_MODEL` env var
   - Falls back to: `EMBEDDING_MODEL` env var
   - Default: `"sentence-transformers/all-MiniLM-L6-v2"`
   - **Token Budget:** `DOCLING_CHUNK_MAX_TOKENS` (default: 512)
   - **Merge Strategy:** `DOCLING_CHUNK_MERGE_PEERS` (default: true)

4. **Table Serialization (Line 374-469):**
   - Custom `AdaptiveTableSerializer` class
   - **Small tables (≤4 cols, ≤36 cells):** Full markdown export
   - **Large tables:** Triplet format with cell-level provenance
   - **Cell Format:**
     ```
     [tbl_cell page=1 row=2 col=3 row_key=service_name col_key=price] value text
     ```
   - **Value Normalization:**
     - Currency: VND, USD, EUR, etc. → Standardized token
     - Units: container, teu, day, month, hour, item, trip
     - Example: "1.230.000 VNĐ/container" → "1230000 VND/container"

5. **Chunk Output Structure (Lines 563-570):**
   ```python
   ChunkData(
       text=text,                    # Full chunk text (context-prefixed)
       page_number=page_number,      # Extracted from provenance
       headings=heading_list,        # Hierarchical headings
       metadata=dl_meta,             # Includes row_keys, doc_items, page_no, etc.
   )
   ```

#### 1.3.2 Group Lock (Row-Key Merging)

**Lines 181-228:** `_apply_group_lock()` method

**Purpose:** Merge adjacent chunks sharing table row keys to prevent split-row retrieval.

**Algorithm:**
```python
def _apply_group_lock(self, chunks: list[ChunkData], *, max_chars: int) -> list[ChunkData]:
    # Conservative token estimate: chars / 3 (for Vietnamese)
    max_tokens = int(os.getenv("DOCLING_CHUNK_MAX_TOKENS", "512"))
    token_safe_max_chars = max_tokens * 3
    
    # Merge chunks if:
    # 1. Share table row_keys
    # 2. Same page number
    # 3. Combined text ≤ effective_max_chars
```

#### 1.3.3 Image Processing with VLM (Vision Language Model)

**Lines 643-742:** Smart VLM filtering + OpenAI Vision API

**Smart Filter (Lines 243-281):** `_should_call_vlm()` method

**Skip conditions (short-circuit):**
1. Image cannot be loaded
2. Image dimensions < `DOCLING_VLM_MIN_SIZE` × `DOCLING_VLM_MIN_SIZE` (default: 300px)
3. Docling already has caption/OCR text for this image

**Configuration:**
```python
vlm_enabled = self._env_bool("DOCLING_VLM_ENABLED", True)
vlm_min_size = self._env_int("DOCLING_VLM_MIN_SIZE", 300)
vlm_max_images = self._env_int("DOCLING_VLM_MAX_IMAGES", 10)
vlm_prompt = os.getenv(
    "DOCLING_VLM_PROMPT",
    "Mô tả chi tiết nội dung hình ảnh này (biểu đồ, sơ đồ, bảng scan). "
    "Nếu là biểu đồ: đọc trục, giá trị, xu hướng. "
    "Nếu là sơ đồ quy trình: liệt kê các bước và kết nối. "
    "Bỏ qua nếu chỉ là logo hoặc ảnh trang trí. "
    "Trả lời bằng tiếng Việt."
)
```

**VLM Call (Lines 689-709):**
- Model: `LLM_MODEL` (default: "gpt-4o-mini")
- API: OpenAI Chat Completions
- Max tokens: 1000
- Output: Appended as `ChunkData` with `kind: "image_description"`

### 1.4 Chunk Creation & Storage

**File:** `backend/src/worker/media_tasks.py`  
**Function:** `_do_full_processing()` (Line 152)

#### Step 1: Prepare Chunks (Lines 172-196)

**Input:** Either pre-chunked Docling chunks or fallback `_smart_chunk()`

```python
if prechunked_chunks:
    # Use Docling-native semantic chunks
    chunks_with_pages: list[tuple[str, int]] = []
    for item in prechunked_chunks:
        text = (item.get("text") or "").strip()
        page_num = max(1, int(item.get("page") or 1))
        chunks_with_pages.append((text, page_num))
        chunk_payload_meta.append({
            "headings": item.get("headings") or [],
            "row_keys": item.get("row_keys") or [],
        })
else:
    # Fallback: smart_chunk
    chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
    chunk_payload_meta = [{} for _ in chunks_with_pages]
```

#### Step 2: Embed Chunks (Lines 201-214)

**Embedding Service:** Mem0 HTTP API  
**Endpoint:** `{MEM0_URL}/embed`  
**Parallelization:** ThreadPoolExecutor with 8 workers

```python
def _embed_chunk(chunk_text: str) -> list[float]:
    resp = http_client.post(embed_url, json={"text": chunk_text})
    resp.raise_for_status()
    return resp.json()["vector"]

vectors = list(pool.map(_embed_chunk, chunk_texts))
```

**Embedding Model:** `EMBEDDING_MODEL` env var (default: "thanhtantran/Vietnamese_Embedding_v2")  
**Vector Dimension:** 1024 (configured via `EMBEDDING_DIMENSION`)

#### Step 3: Build Payload & Upsert to Qdrant (Lines 216-244)

**Payload Structure** (Lines 223-239):
```python
payload: dict[str, Any] = {
    "text": chunk_text,                    # Full chunk text
    "source_file": filename,               # Original document filename
    "page_number": page_num,               # Document page number
    "chunk_index": i,                      # Index within document
    "user_id": user_id,                    # Document owner
    "document_id": document_id,            # Database document record ID
    "type": "document_chunk",              # Chunk type
    "extractor": extractor_used,           # "docling" or "vlm"
    "headings": [...],                     # Optional: heading hierarchy
    "row_keys": [...],                     # Optional: table row identifiers
}
```

**Upsert Function** (Line 243):
```python
from src.core.qdrant_setup import upsert_vectors
upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
```

---

## 2. RAG SEARCH FLOW

### 2.1 RAG Task Entry Point

**File:** `backend/src/worker/chat_tasks.py`  
**Function:** `rag_document_search()` (Line 623)  
**Queue:** `chat_priority`

```python
@celery_app.task(name="src.worker.tasks.rag_document_search", bind=True, max_retries=2)
def rag_document_search(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
    department: str | None = None,
) -> dict[str, Any]:
```

### 2.2 Retrieval Pipeline

**Lines 636-660:** Vector Store Setup & Retrieval

#### Step 1: Initialize Embedding Model (Line 641)

```python
from llama_index.core import Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

Settings.embed_model = _get_hf_embed_model()
```

**Embedding Model Caching (Lines 36-46):**
```python
_hf_embed_model = None
_hf_embed_model_name: str | None = None

def _get_hf_embed_model():
    """Return a cached HuggingFaceEmbedding instance (loaded once per Celery worker)."""
    global _hf_embed_model, _hf_embed_model_name
    model_name = os.getenv("EMBEDDING_MODEL", "thanhtantran/Vietnamese_Embedding_v2")
    if _hf_embed_model is None or _hf_embed_model_name != model_name:
        _hf_embed_model = HuggingFaceEmbedding(model_name=model_name)
        _hf_embed_model_name = model_name
    return _hf_embed_model
```

#### Step 2: Setup LlamaIndex Vector Store (Lines 643-646)

```python
from llama_index.vector_stores.qdrant import QdrantVectorStore
qdrant = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
vector_store = QdrantVectorStore(client=qdrant, collection_name="port_knowledge")
storage_ctx = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_vector_store(
    vector_store=vector_store,
    storage_context=storage_ctx
)
```

#### Step 3: Retrieve Top-K Chunks (Lines 650-654)

```python
retriever = index.as_retriever(
    similarity_top_k=5,
    vector_store_kwargs={"filter": _build_qdrant_filter(user_id, department)},
)
all_nodes = list(retriever.retrieve(question))
```

**Top-K Value:** 5 (hardcoded for context focus)  
**Similarity Metric:** Cosine distance (from Qdrant collection config)

#### Step 4: Score Threshold Filter (Lines 657-662)

```python
RAG_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", "0.35"))

top_nodes = [
    n for n in all_nodes
    if getattr(n, "score", 0.0) is not None and (getattr(n, "score", 0.0) or 0.0) >= RAG_SCORE_THRESHOLD
]
```

### 2.3 Access Control & Quality Filter

**File:** `backend/src/worker/chat_tasks.py`  
**Function:** `_build_qdrant_filter()` (Line 171)

**Filter Logic (Lines 171-206):**

```python
def _build_qdrant_filter(user_id: str | None, department: str | None):
    """Build Qdrant security + quality filter for RAG search."""
    from qdrant_client.models import Filter, FieldCondition, MatchValue
    
    # Access control: user's own chunks OR department-public chunks
    should_conditions = []
    if user_id:
        should_conditions.append(
            FieldCondition(key="user_id", match=MatchValue(value=user_id))
        )
    if department:
        should_conditions.append(Filter(must=[
            FieldCondition(key="department", match=MatchValue(value=department)),
            FieldCondition(key="is_public", match=MatchValue(value=True)),
        ]))
    
    # Quality gate: exclude chunks marked as low quality via negative feedback
    must_not_conditions = [
        FieldCondition(key="quality", match=MatchValue(value="low")),
    ]
    
    return Filter(
        should=should_conditions,
        must_not=must_not_conditions,
    )
```

### 2.4 Context Assembly

#### Step 1: Build Context Blocks (Lines 665-666)

```python
citations, context_blocks = _build_context_and_citations(top_nodes)
context_text = "\n\n---\n\n".join(context_blocks).strip()
```

**Function:** `_build_context_and_citations()` (Line 283)

**Deduplication Strategy:**
- `cite_key = (filename, page, heading_key)` 
- `content_hash = hash(snippet[:200])` → Drop exact-duplicate content

**Output Format:**
```
[1] [snippet text from first source]

---

[2] [snippet text from second source]
```

#### Step 2: Gather Unified Context (Line 674)

```python
unified_ctx = _gather_unified_context(question, session_id, user_id)
```

**Function:** `_gather_unified_context()` (Line 344)

**Returns:** Dict with three context blocks:

```python
return {
    "long_term_block": long_term_block,   # Mem0 long-term memories (5 results)
    "summary_block": summary_block,        # Session summary from DB metadata
    "recent_block": recent_block,          # Last 6 messages from this session
}
```

**Mem0 Fetch (Lines 351-367):**
```python
resp = client.post(
    f"{mem0_url.rstrip('/')}/search",
    json={"query": question, "user_id": user_id, "limit": 5},
)
results = resp.json().get("results") or []
long_term_block = "\n".join(
    f"- {item.get('text') or item.get('memory') or ''}" for item in results
).strip()
```

**Session Summary & Recent Messages (Lines 369-400):**
```sql
SELECT s.metadata AS session_meta, m.role, m.content
FROM chat_sessions s
LEFT JOIN (
    SELECT session_id, role, content, created_at
    FROM chat_messages
    WHERE session_id = :sid
    ORDER BY created_at DESC
    LIMIT 6
) m ON m.session_id = s.id
WHERE s.id = :sid
```

### 2.5 LLM Synthesis

**Function:** `_synthesize_with_llm()` (Line 428)

**System Prompt (Lines 411-425):**
```
Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).
Nhiệm vụ của bạn là dựa vào tài liệu được cung cấp để giải đáp chính xác, rõ ràng cho khách hàng.
...
- Khi context chứa dữ liệu dạng bảng (tbl_cell, row_key, col_key), BẮT BUỘC phải trình bày lại thành bảng Markdown chuẩn.
- Giữ nguyên đơn vị tiền tệ gốc (VNĐ, USD). Không làm tròn, không đổi đơn vị.
- Trích dẫn nguồn bằng cách thêm [1], [2]... vào cuối câu hoặc cuối đoạn lấy thông tin.
- Tuyệt đối không bịa số liệu.
```

**User Prompt Structure:**
```
Câu hỏi người dùng: {question}

Context:

### Long-term Memory
...

### Tóm tắt hội thoại
...

### Hội thoại gần đây
...

### Đoạn trích tài liệu (đã đánh số)
[1] [snippet 1]
...
```

**API Call (Lines 462-473):**
```python
openai_key = os.getenv("OPENAI_API_KEY", "")
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

resp = http_client.post(
    f"{openai_base.rstrip('/')}/chat/completions",
    headers={"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"},
    json={
        "model": llm_model,
        "messages": [
            {"role": "system", "content": _RAG_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.3,
        "max_tokens": 1500,
    },
)
```

### 2.6 Post-Processing & Storage

**Lines 697-708:** Sanitization + Citation Footer + Save to DB

```python
result_text = _sanitize_generated_answer(result_text)
result_text += _format_citations_footer(citations)

# Save via Backend API
http_client.post(
    f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
    json={"content": result_text, "role": "assistant"},
)
```

**Citation Footer Format:**
```
---
📚 **Nguồn tham khảo:**
- **[1]** filename.pdf (Trang 5) | mục: Giá cẩu container — độ liên quan: 0.892
- **[2]** price_list.xlsx (Trang ?) | mục: Container — độ liên quan: 0.756
```

---

## 3. MODE SELECTION & DISPATCH

### 3.1 Frontend: Chat Composer Component

**File:** `frontend/src/components/chat/chat-composer.tsx`

**Mode Options (Lines 13-17):**
```typescript
const MODE_OPTIONS: { value: AgentMode; label: string; icon: typeof Bot; description: string }[] = [
  { value: "chat", label: "Trợ lý", icon: Bot, description: "Hỏi đáp tổng quát" },
  { value: "sql", label: "Số liệu", icon: BarChart3, description: "Truy vấn dữ liệu Cảng" },
  { value: "rag", label: "Tài liệu", icon: FileText, description: "Hỏi nội dung PDF/file" },
];
```

**Mode Selection UI (Lines 75-96):**
- Displays 3 buttons (Trợ lý, Số liệu, Tài liệu)
- Active mode highlighted in primary color
- User explicitly selects mode before sending message
- `onModeChange(mode: AgentMode)` callback passed to parent component

### 3.2 Backend: Mode Dispatch

**File:** `backend/src/services/chat_service.py`  
**Function:** `add_message()` (Line 64)

**Mode Extraction & Task Dispatch (Lines 93-119):**

```python
async def add_message(
    self,
    session_id: UUID,
    message: MessageCreate,
    *,
    user_id: str | None,
    department: str | None,
):
    db_message = await self.message_repo.create_message(
        session_id=session_id,
        role=message.role,
        content=message.content,
        metadata=message.metadata or {},
    )
    
    # ── Dispatch task based on explicit mode (user must choose) ──
    mode = getattr(message, 'mode', 'chat')
    
    if mode == "sql":
        from src.worker.tasks import run_sql_query
        run_sql_query.delay(
            question=message.content,
            session_id=str(session_id),
            user_id=user_id,
        )
    elif mode == "rag":
        from src.worker.tasks import rag_document_search
        rag_document_search.delay(
            question=message.content,
            session_id=str(session_id),
            user_id=user_id,
            department=department,
        )
    else:  # mode == "chat" (default fallback)
        process_chat_response.delay(
            session_id=str(session_id),
            message_id=str(db_message.id),
            content=message.content,
            role=message.role,
            user_id=user_id,
            department=department,
        )
    
    # Store mode in message object for API response
    db_message._intent_type = mode
    return db_message
```

### 3.3 API Response

**File:** `backend/src/api/chat.py`  
**Endpoint:** `POST /sessions/{session_id}/messages` (Line 78)

**Response (Lines 93-98):**
```python
result = service.serialize_message(message)
# Signal frontend about dispatched Celery tasks
intent_type = getattr(message, '_intent_type', 'chat')
result['task_dispatched'] = intent_type in ('sql', 'rag')
result['intent_type'] = intent_type
return result
```

**Response JSON:**
```json
{
  "id": "msg-uuid",
  "session_id": "session-uuid",
  "role": "user",
  "content": "Giá container 40 foot?",
  "metadata": {},
  "created_at": "2026-04-13T10:30:00Z",
  "task_dispatched": true,
  "intent_type": "rag"
}
```

---

## 4. REDIS USAGE & CACHING

### 4.1 Redis Client Setup

**File:** `backend/src/core/redis_client.py`

```python
from redis import asyncio as aioredis
from src.core.config import get_settings

_redis: aioredis.Redis | None = None

def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        settings = get_settings()
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis
```

**Configuration:**
- **URL:** `REDIS_URL` env var (default: `"redis://localhost:6379/0"`)
- **Connection:** Async Redis client (asyncio)
- **Decode:** `decode_responses=True` (strings instead of bytes)

### 4.2 Session Message Cache

**File:** `backend/src/services/chat_service.py`  
**Function:** `get_session_with_messages()` (Line 51)

**Cache Key Format:** `"chat:session:{session_id}"`

**Usage:**
```python
async def get_session_with_messages(self, session_id: UUID, limit: int | None = None):
    cache_key = self._cache_key(session_id)  # "chat:session:uuid"
    if limit is None:
        cached = await self.redis.get(cache_key)
        if cached:
            return json.loads(cached)
    
    # Fetch from DB if not cached or limit specified
    messages = await self.message_repo.list_messages(session_id, limit=limit)
    payload = [self.serialize_message(message) for message in messages]
    if limit is None:
        await self.redis.set(cache_key, json.dumps(payload), ex=3600)  # 1-hour TTL
    return payload
```

**TTL:** 3600 seconds (1 hour)

### 4.3 Message Cache Update on New Message

**Lines 81-91 (add_message):**
```python
cache_key = self._cache_key(session_id)
cached_raw = await self.redis.get(cache_key)
if cached_raw:
    existing = json.loads(cached_raw)
    existing.append(self.serialize_message(db_message))
    await self.redis.set(cache_key, json.dumps(existing), ex=3600)
    all_messages = existing
else:
    all_messages = await self.message_repo.list_messages(session_id)
    cache_payload = [self.serialize_message(msg) for msg in all_messages]
    await self.redis.set(cache_key, json.dumps(cache_payload), ex=3600)
```

**Strategy:** Append-only cache update (avoid full DB reload)

### 4.4 Redis Pub/Sub for Real-Time Updates

**File:** `backend/src/api/chat.py`  
**Endpoint:** `GET /sessions/{session_id}/stream` (Line 138)

**Channel Name:** `"session:{session_id}"`

**Generator Function (Lines 182-214):**
```python
async def _sse_event_generator(session_id: UUID):
    """Subscribe to Redis Pub/Sub and yield SSE events."""
    redis = get_redis()
    pubsub = redis.pubsub()
    channel = f"session:{session_id}"
    await pubsub.subscribe(channel)
    heartbeat_counter = 0
    try:
        while True:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=1.0
            )
            if message and message["type"] == "message":
                data = message["data"]
                if isinstance(data, bytes):
                    data = data.decode("utf-8")
                yield f"data: {data}\n\n"
                # Close stream after delivering the event
                return
            else:
                heartbeat_counter += 1
                if heartbeat_counter >= 20:   # every ~20s
                    yield ": heartbeat\n\n"
                    heartbeat_counter = 0
            await asyncio.sleep(1.0)
    finally:
        await pubsub.unsubscribe(channel)
        await pubsub.aclose()
```

**Heartbeat:** Every 20 seconds (Cloudflare timeout: 100s)

### 4.5 Publishing Task Completion Events

**File:** `backend/src/worker/helpers.py`  
**Function:** `publish_task_complete()` (Line 118)

```python
def publish_task_complete(session_id: str, event: str = "message_ready") -> None:
    """
    Publish a Redis Pub/Sub event when a Celery task finishes.
    The SSE endpoint subscribes to `session:{session_id}` and forwards
    these events to the frontend in real-time.
    """
    try:
        redis_url = os.getenv("REDIS_URL", os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"))
        r = sync_redis.from_url(redis_url)
        r.publish(
            f"session:{session_id}",
            json.dumps({"event": event, "session_id": session_id}),
        )
        logger.info(f"[pubsub] Published '{event}' for session {session_id}")
    except Exception as exc:
        logger.warning(f"[pubsub] Failed to publish event: {exc}")
```

**Called in (Line 732 in chat_tasks.py):**
```python
from .helpers import publish_task_complete
publish_task_complete(session_id)
```

---

## 5. QDRANT SETUP & COLLECTIONS

### 5.1 Qdrant Client & Configuration

**File:** `backend/src/core/qdrant_setup.py`

```python
from qdrant_client import QdrantClient
from src.core.config import get_settings

_client: QdrantClient | None = None

def get_qdrant_client() -> QdrantClient:
    global _client
    if _client is None:
        settings = get_settings()
        grpc_port = None
        if settings.qdrant_grpc_url:
            try:
                grpc_port = int(settings.qdrant_grpc_url)
            except ValueError:
                from urllib.parse import urlparse
                parsed = urlparse(settings.qdrant_grpc_url)
                grpc_port = parsed.port
        _client = QdrantClient(
            url=settings.qdrant_http_url,
            grpc_port=grpc_port,
        )
        ensure_collections(_client, settings.embedding_dimension)
    return _client
```

**Configuration (from `config.py`):**
- `QDRANT_URL` (default: `"http://localhost:6333"`)
- `QDRANT_GRPC_URL` (optional)
- `EMBEDDING_DIMENSION` (default: `1024`)

### 5.2 Collections & Schemas

**Function:** `ensure_collections()` (Line 47)

**Three Collections Created:**

| Collection | Purpose | Vector Size | Distance Metric | Indexed Fields |
|------------|---------|-------------|-----------------|----------------|
| `chat_chunks` | Short-term chat embeddings | 1024 | COSINE | `user_id`, `session_id`, `department` |
| `port_knowledge` | Uploaded document chunks (RAG) | 1024 | COSINE | `user_id`, `department`, `quality`, `document_id`, `source_file` |
| `vanna_schemas_openai` | SQL schema embeddings | 1024 | COSINE | (none specified) |

**Creation Code (Lines 59-68):**
```python
for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai"):
    if name not in existing:
        client.create_collection(
            collection_name=name,
            vectors_config=qmodels.VectorParams(
                size=vector_size,  # 1024
                distance=qmodels.Distance.COSINE
            ),
        )

# Payload indexes for fast filtered search
_ensure_payload_indexes(client, "chat_chunks", ["user_id", "session_id", "department"])
_ensure_payload_indexes(client, "port_knowledge", ["user_id", "department", "quality", "document_id", "source_file"])
```

### 5.3 Upsert & Search Functions

**Function:** `upsert_vectors()` (Line 71)

```python
def upsert_vectors(
    collection: str,
    payloads: Iterable[dict[str, Any]],
    vectors: Iterable[list[float]],
    ids: Iterable[str] | None = None,
) -> None:
    client = get_qdrant_client()
    client.upsert(
        collection_name=collection,
        points=qmodels.Batch(
            ids=list(ids) if ids is not None else None,
            vectors=list(vectors),
            payloads=list(payloads),
        ),
    )
```

**Function:** `search_vectors()` (Line 88)

```python
def search_vectors(
    collection: str,
    vector: list[float],
    limit: int = 5,
    filters: dict[str, Any] | None = None,
) -> list[qmodels.ScoredPoint]:
    client = get_qdrant_client()
    return client.query_points(
        collection_name=collection,
        query=vector,
        limit=limit,
        query_filter=qmodels.Filter(
            must=[
                qmodels.FieldCondition(
                    key=key,
                    match=qmodels.MatchValue(value=value)
                )
                for key, value in (filters or {}).items()
            ]
        ) if filters else None,
    ).points
```

### 5.4 Payload Structure for port_knowledge Collection

**Full Payload Schema:**
```python
{
    "text": str,                    # Chunk text content
    "source_file": str,             # Filename (e.g., "pricing.pdf")
    "page_number": int,             # Page number in document
    "chunk_index": int,             # Index within document chunks
    "user_id": str,                 # Document owner (for access control)
    "document_id": str,             # Database document record ID
    "type": str,                    # "document_chunk", "audio_transcript", etc.
    "extractor": str,               # "docling" or "vlm"
    "headings": list[str],          # Heading hierarchy (if applicable)
    "row_keys": list[str],          # Table row identifiers (if table data)
    "quality": str,                 # Default: null. Set to "low" via feedback mechanism
    "department": str,              # Optional: for department-level sharing
    "is_public": bool,              # Optional: public sharing flag
    "dislike_reason": str,          # Optional: reason for low quality marking
}
```

---

## 6. END-TO-END DATA FLOW

### 6.1 Document Upload → RAG Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DOCUMENT UPLOAD FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. USER UPLOADS DOCUMENT
   ├─ Frontend sends multipart/form-data to /api/upload
   ├─ Backend creates Document record in PostgreSQL
   └─ Queues Celery task: process_document

2. CELERY TASK: process_document (media_tasks.py:26)
   ├─ Dispatched to "media_process" queue
   ├─ Receives: file_path, user_id, document_id, filename
   │
   ├─ BRANCH A: Image files (.jpg, .png)
   │  ├─ Call _extract_text_from_image()
   │  ├─ OpenAI Vision API → VLM description
   │  └─ extractor_used = "vlm"
   │
   └─ BRANCH B: Document files (.pdf, .docx, etc.)
      ├─ If PPTX: convert to PDF (LibreOffice)
      ├─ Call process_document_deep() (docling_service.py:819)
      │
      └─ DoclingProcessor.process() (docling_service.py:607)
         ├─ DocumentConverter.convert(file_path)
         │  ├─ Enable PDF image extraction & OCR
         │  └─ Return Docling Document object
         │
         ├─ Build markdown with page markers
         │
         ├─ Extract tables:
         │  ├─ Count rows/cols
         │  └─ Export to markdown
         │
         ├─ Build Docling chunks:
         │  ├─ HybridChunker with AdaptiveTableSerializer
         │  ├─ Small tables: full markdown
         │  └─ Large tables: triplet cell format [tbl_cell row_key=... col_key=...]
         │
         ├─ Apply Group Lock (merge adjacent chunks with shared row_keys)
         │
         ├─ Smart VLM filtering:
         │  ├─ Skip if image < 300px
         │  ├─ Skip if Docling already has OCR caption
         │  ├─ Otherwise: call OpenAI Vision API with custom prompt
         │  └─ Max 10 images per document
         │
         └─ Return ProcessingResult with:
            ├─ markdown: full document text
            ├─ tables: list of extracted tables
            ├─ chunks: list[ChunkData] with headings & row_keys
            ├─ metadata: processing info
            └─ page_count: document pages

3. CHUNKING & EMBEDDING (media_tasks.py:152-244)
   ├─ Input: chunks from Docling (or fallback _smart_chunk if VLM)
   │
   ├─ Build payloads with metadata:
   │  ├─ text, source_file, page_number, chunk_index
   │  ├─ user_id, document_id, type="document_chunk"
   │  ├─ extractor, headings, row_keys
   │  └─ Generate UUID for each chunk
   │
   ├─ Embed chunks (parallel):
   │  ├─ ThreadPoolExecutor with 8 workers
   │  ├─ POST {MEM0_URL}/embed for each chunk
   │  └─ Receive: 1024-dim vector
   │
   └─ Upsert to Qdrant:
      ├─ Collection: "port_knowledge"
      ├─ Points: Batch(ids, vectors, payloads)
      └─ upsert_vectors() function

4. UPDATE DOCUMENT STATUS
   └─ db_pool.execute_query() → PostgreSQL
      ├─ SET status='ready'
      ├─ SET chunk_count = len(chunks)
      ├─ SET extractor_used = 'docling' or 'vlm'
      └─ SET metadata = {page_count, table_count, char_count, ...}

═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    RAG SEARCH COMPLETE FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. USER SUBMITS QUESTION WITH MODE=RAG
   ├─ Frontend chat composer selects "Tài liệu" mode
   ├─ Sends POST /sessions/{id}/messages with mode="rag"
   └─ Backend: service.add_message() (chat_service.py:64)

2. CHAT SERVICE: add_message() (chat_service.py:64)
   ├─ Create ChatMessage record in PostgreSQL
   ├─ Update session message cache in Redis
   ├─ Detect mode="rag" from message metadata
   └─ Dispatch Celery task: rag_document_search.delay()

3. CELERY TASK: rag_document_search (chat_tasks.py:623)
   ├─ Dispatched to "chat_priority" queue
   ├─ Parameters: question, session_id, user_id, department
   │
   ├─ STEP A: Initialize LlamaIndex
   │  ├─ Load HuggingFace embedding model (cached)
   │  ├─ Model: EMBEDDING_MODEL env var
   │  ├─ Dimension: 1024
   │  └─ Settings.embed_model = HuggingFaceEmbedding
   │
   ├─ STEP B: Setup Vector Store
   │  ├─ Create QdrantClient(url={QDRANT_URL})
   │  ├─ QdrantVectorStore(collection_name="port_knowledge")
   │  ├─ Create VectorStoreIndex
   │  └─ Settings.llm = None (using external OpenAI API)
   │
   ├─ STEP C: Retrieve Top-K Chunks
   │  ├─ index.as_retriever(similarity_top_k=5)
   │  ├─ Apply filter: _build_qdrant_filter(user_id, department)
   │  │  ├─ Access control: user_id matches OR department-public chunks
   │  │  └─ Quality gate: exclude quality="low" chunks
   │  ├─ retriever.retrieve(question)
   │  │  └─ Embed question with same HF model
   │  │  └─ Search in Qdrant with cosine similarity
   │  ├─ Filter by score threshold (RAG_SCORE_THRESHOLD=0.35)
   │  └─ Result: top_nodes list
   │
   ├─ STEP D: Build Context
   │  ├─ _build_context_and_citations(top_nodes)
   │  │  ├─ Deduplicate by (file, page, heading) tuple
   │  │  ├─ Hash first 200 chars to drop exact duplicates
   │  │  ├─ Extract snippet, metadata, page, doc_id
   │  │  └─ Format citations with score & headings
   │  └─ Result: citations[], context_blocks[]
   │
   ├─ STEP E: Gather Unified Context
   │  ├─ _gather_unified_context(question, session_id, user_id)
   │  │
   │  ├─ Long-term memories:
   │  │  ├─ POST {MEM0_URL}/search with query, user_id, limit=5
   │  │  └─ Format: "- {memory text}"
   │  │
   │  ├─ Session summary:
   │  │  ├─ SQL JOIN: SELECT s.metadata, m.role, m.content
   │  │  ├─ WHERE s.id={session_id}
   │  │  ├─ Extract summary from s.metadata["summary"]
   │  │  └─ Last 6 messages: LIMIT 6 ORDER BY created_at DESC
   │  │
   │  └─ Result: {long_term_block, summary_block, recent_block}
   │
   ├─ STEP F: Synthesize with LLM
   │  ├─ _synthesize_with_llm(
   │  │    question,
   │  │    context_text,
   │  │    long_term_block,
   │  │    summary_block,
   │  │    recent_block
   │  │  )
   │  │
   │  ├─ Build unified context:
   │  │  ├─ ### Long-term Memory
   │  │  ├─ ### Tóm tắt hội thoại
   │  │  ├─ ### Hội thoại gần đây
   │  │  └─ ### Đoạn trích tài liệu (đã đánh số)
   │  │     [1] [snippet 1]
   │  │     [2] [snippet 2]
   │  │     ...
   │  │
   │  ├─ Build user prompt:
   │  │  ├─ "Câu hỏi người dùng: {question}"
   │  │  ├─ "Context:\n\n{unified_context}"
   │  │  └─ "Yêu cầu: Hãy phân tích kỹ Context để trả lời đầy đủ..."
   │  │
   │  ├─ OpenAI API call:
   │  │  ├─ BASE_URL: {OPENAI_BASE_URL} (default: openrouter.ai)
   │  │  ├─ Model: {LLM_MODEL} (default: openai/gpt-4o-mini)
   │  │  ├─ System prompt: RAG_SYSTEM_PROMPT (lines 411-425)
   │  │  ├─ Temperature: 0.3
   │  │  └─ Max tokens: 1500
   │  │
   │  ├─ Post-processing:
   │  │  ├─ _sanitize_generated_answer()
   │  │  │  ├─ Remove model-generated citation footer
   │  │  │  ├─ Fix malformed citations [1 VNĐ] → [1]
   │  │  │  ├─ Normalize whitespace
   │  │  │  └─ Trim dangling endings
   │  │  │
   │  │  └─ _format_citations_footer(citations)
   │  │     ├─ "---"
   │  │     ├─ "📚 **Nguồn tham khảo:**"
   │  │     ├─ "- **[1]** filename.pdf (Trang 5) | mục: ... — độ liên quan: 0.892"
   │  │     └─ ...
   │  │
   │  └─ Result: final_answer_with_citations
   │
   ├─ STEP G: Save Answer to Database
   │  ├─ POST {BACKEND_INTERNAL_URL}/sessions/{session_id}/messages
   │  ├─ JSON: {"content": result_text, "role": "assistant"}
   │  └─ Response: {"id": message_id}
   │
   ├─ STEP H: Store Chunk IDs in Message Metadata
   │  ├─ Extract node_id from each top_node
   │  ├─ PATCH {BACKEND_INTERNAL_URL}/messages/{message_id}/metadata
   │  ├─ JSON: {"rag_chunk_ids": [chunk_id_1, chunk_id_2, ...]}
   │  └─ Used later for negative feedback → mark exact chunks as quality="low"
   │
   └─ STEP I: Publish Completion Event
      ├─ publish_task_complete(session_id)
      ├─ sync_redis.publish(f"session:{session_id}", {"event": "message_ready", ...})
      └─ Frontend SSE handler receives event → display answer

4. FRONTEND: Real-Time Answer Display
   ├─ SSE listener on GET /sessions/{id}/stream
   ├─ Receives Redis pub/sub event {"event": "message_ready"}
   ├─ Fetches updated messages from GET /sessions/{id}
   ├─ Displays assistant answer with citations
   └─ User can like/dislike answer

═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                  FEEDBACK & QUALITY CONTROL FLOW                 │
└─────────────────────────────────────────────────────────────────┘

1. USER DISLIKES AN ANSWER
   ├─ Clicks dislike button on chat message
   └─ Frontend: PATCH /messages/{id}/feedback with is_liked=false

2. CELERY TASK: process_feedback (chat_tasks.py:753)
   ├─ Receive: message_id, is_liked=false, reason (optional)
   │
   ├─ If positive feedback: return (skip further processing)
   │
   ├─ If negative feedback:
   │  │
   │  ├─ STRATEGY A: Use stored chunk IDs (most accurate)
   │  │  ├─ Look up message.metadata.rag_chunk_ids
   │  │  ├─ If found: qdrant.set_payload(
   │  │  │              collection_name="port_knowledge",
   │  │  │              payload={"quality": "low", "dislike_reason": reason},
   │  │  │              points=chunk_ids
   │  │  │            )
   │  │  └─ These chunks will be excluded from future RAG searches
   │  │
   │  └─ STRATEGY B: Fallback → embed message & search by similarity
   │     ├─ If no stored chunk IDs
   │     ├─ Embed msg_content[:500] via Mem0
   │     ├─ Query Qdrant with similarity search
   │     ├─ Mark top matches (score > 0.7) as quality="low"
   │     └─ This is a best-effort approach for older messages
   │
   └─ Result: downgraded = count of marked vectors

═══════════════════════════════════════════════════════════════════
```

---

## 6.2 Configuration Summary

**File:** `backend/src/core/config.py`

| Env Variable | Default | Type | Used For |
|---|---|---|---|
| `DATABASE_URL` | **required** | str | PostgreSQL async connection |
| `REDIS_URL` | `redis://localhost:6379/0` | str | Session cache + Pub/Sub |
| `QDRANT_URL` | `http://localhost:6333` | str | Vector DB HTTP endpoint |
| `QDRANT_GRPC_URL` | None | str | Vector DB gRPC endpoint (optional) |
| `MEM0_URL` | `http://mem0:8000` | str | Long-term memory API |
| `EMBEDDING_DIMENSION` | 1024 | int | Vector size for all collections |
| `EMBEDDING_MODEL` | `thanhtantran/Vietnamese_Embedding_v2` | str | HuggingFace model ID |
| `EMBEDDING_DEVICE` | `cpu` | str | Device for embedding inference |
| `OPENAI_API_KEY` | None | str | OpenAI/OpenRouter API key |
| `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` | str | LLM API endpoint |
| `LLM_MODEL` | `openai/gpt-4o-mini` | str | LLM model identifier |
| `RAG_SCORE_THRESHOLD` | 0.35 | float | Min similarity score for RAG chunks |
| `DOCLING_VLM_ENABLED` | true | bool | Enable Vision API for images |
| `DOCLING_VLM_MIN_SIZE` | 300 | int | Min image size (px) for VLM |
| `DOCLING_VLM_MAX_IMAGES` | 10 | int | Max images to process per document |
| `DOCLING_TABLE_MARKDOWN_MAX_COLS` | 4 | int | Max cols for small table markdown |
| `DOCLING_TABLE_MARKDOWN_MAX_CELLS` | 36 | int | Max cells for small table markdown |
| `DOCLING_CHUNK_MAX_TOKENS` | 512 | int | Max tokens per chunk (for embedding) |
| `DOCLING_CHUNK_MERGE_PEERS` | true | bool | Enable HybridChunker merge_peers |
| `DOCLING_GROUP_LOCK_ENABLED` | true | bool | Enable row-key merging |
| `DOCLING_GROUP_LOCK_MAX_CHARS` | 1800 | int | Max chars for merged chunks |

---

## 6.3 Database Schema (Key Tables)

```sql
-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    filename VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'processing',  -- 'processing', 'ready', 'error'
    chunk_count INT,
    page_count INT,
    table_count INT,
    char_count INT,
    extractor_used VARCHAR,  -- 'docling', 'vlm'
    error_message VARCHAR,
    metadata JSONB,  -- {page_count, table_count, docling_chunk_count, ...}
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Chat Sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    department VARCHAR,
    title VARCHAR,
    external_id VARCHAR,
    metadata JSONB,  -- {summary: "...", message_count_at_summary: N}
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id),
    role VARCHAR,  -- 'user', 'assistant'
    content TEXT,
    metadata JSONB,  -- {rag_chunk_ids: [...], ...}
    created_at TIMESTAMP
);
```

---

## Summary Table: Data Structures & Metadata

### Docling Chunk Metadata (payload fields)

```python
{
    "row_keys": ["service_name", "container_type"],  # Extracted from [tbl_cell row_key=...]
    "has_cell_provenance": true,                      # Set when row_keys present
    "headings": ["Section", "Subsection"],            # Heading hierarchy
    "doc_items": [                                    # Provenance from Docling
        {
            "prov": [
                {"page_no": 5, "bbox": [...], ...}
            ]
        }
    ]
}
```

### Qdrant Payload (port_knowledge collection)

```python
{
    # Core content
    "text": "Dịch vụ cẩu container...",
    "type": "document_chunk",
    "extractor": "docling",
    
    # Source tracking
    "source_file": "pricing.pdf",
    "document_id": "doc-uuid",
    "page_number": 5,
    "chunk_index": 12,
    
    # Access control
    "user_id": "user-123",
    "department": "port_operations",
    "is_public": false,
    
    # Content metadata
    "headings": ["Biểu phí", "Container"],
    "row_keys": ["container_20ft", "container_40ft"],
    
    # Quality tracking
    "quality": "low",  # Set by negative feedback
    "dislike_reason": "Không chính xác"
}
```

---

## Key Insights & Design Patterns

1. **Docling HybridChunking:** Uses semantic boundaries (headings, paragraphs) + token-aware merging to preserve table structure
2. **Adaptive Table Serialization:** Small tables → full markdown; large tables → triplet cell format with row_key provenance
3. **Group Lock:** Prevents chunk split on table row boundaries by merging adjacent chunks with shared row_keys
4. **VLM Smart Filtering:** Only calls Vision API for images >300px without existing OCR captions (cost & noise reduction)
5. **RAG Score Threshold:** 0.35 is intentionally low to avoid missing relevant context; filtered again after retrieval
6. **Unified Context:** Combines long-term memories (Mem0) + session summary + recent messages for richer synthesis
7. **Citation Accuracy:** Stores exact rag_chunk_ids at generation time for precise feedback/downgrading
8. **Redis Pub/Sub + SSE:** Real-time answer delivery without polling; heartbeat every 20s for Cloudflare compatibility

