# ChatSNP Architecture Analysis: Memory, Chat, RAG & Context Management

## 📊 Executive Overview

ChatSNP is a sophisticated Vietnamese port authority chatbot system using:
- **Mem0**: Long-term user memory and facts (semantic search)
- **Qdrant**: Short-term session context (vector store)
- **Celery**: Async task processing (3 priority queues)
- **LLM**: OpenRouter (gpt-4o-mini, gpt-5-nano reasoning)
- **RAG**: Document search + LLM synthesis + citation generation

---

## 🧠 MEMORY SYSTEM

### 1. **Dual-Memory Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                  UNIFIED MEMORY MODEL                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  LONG-TERM (Mem0 - Per User)     SHORT-TERM (Qdrant)    │
│  ├─ Semantic facts                ├─ Chat chunks         │
│  ├─ User preferences              ├─ Session context     │
│  ├─ Historical interests          ├─ Document snippets   │
│  ├─ Business context              ├─ RAG retrieval       │
│  └─ Importance scores             └─ TTL: until deleted  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 2. **Mem0 Integration Points**

**File**: `src/core/mem0_config.py`

```python
async def embed_text(text: str) -> list[float]:
    """Delegate embedding to Mem0 REST API"""
    POST {MEM0_URL}/embed → {"vector": [...1024 dims...]}
```

**Memory Storage**: `src/worker/chat_tasks.py` → `store_memory()`

```python
@celery_app.task
def store_memory(user_id, content, role, session_id, department):
    """Save message to long-term memory"""
    POST {MEM0_URL}/memories
    {
        "messages": [{"role": role, "content": content}],
        "user_id": user_id,
        "metadata": {
            "session_id": session_id,
            "department": department
        }
    }
```

**Memory Retrieval**: Dual sources in `semantic_search()`

```python
async def semantic_search(query: SearchQuery):
    # 1. Short-term: Qdrant (chat_chunks collection)
    qdrant_results = search_vectors(
        collection="chat_chunks",
        vector=await embed_text(query.query)  # via Mem0
    )
    
    # 2. Long-term: Mem0 API
    mem0_results = POST {MEM0_URL}/search {
        "query": query.query,
        "user_id": query.user_id,
        "limit": 5
    }
    
    # Combine + deduplicate + score threshold
    combined = convert_qdrant(qdrant_results) + convert_mem0(mem0_results)
    SCORE_THRESHOLD = 0.35
    return sorted(combined, by score)[:limit]
```

### 3. **Memory Storage Pipeline**

**Trigger Condition** (in `add_message()`):
```python
if user_id and len(content.strip()) > 10:
    store_memory.delay(...)  # Async → chat_priority queue
```

**Mem0 API Contract**:
- Endpoint: `POST /memories`
- Input: Messages + metadata
- Output: Stored with automatic embedding + semantic indexing
- Timeout: 300s (long operation for fact extraction)

### 4. **Memory Consolidation (Nightly Gardener)**

**File**: `src/worker/gardener_tasks.py` → `consolidate_memories()`

Runs **daily at 2:00 AM** (Celery Beat scheduled):

```python
@celery_app.task
def consolidate_memories():
    """Dedup facts, assign importance_score, optimize retrieval"""
    
    # 1. For each user_id:
    for uid in all_user_ids:
        memories = GET {MEM0_URL}/memories?user_id={uid}
        
        # 2. Call LLM to analyze
        analysis = LLM({
            "system": "Identify duplicates, assign importance (1-10)",
            "user": [list of memories],
            "response_format": JSON
        })
        
        # 3. Apply scores + merges
        FOR each score in analysis:
            PUT {MEM0_URL}/memories/{mid} 
                {"metadata": {"importance_score": int}}
        
        FOR each merge:
            PUT {MEM0_URL}/memories/{keep_id}
                {"data": merged_text}
            DELETE {MEM0_URL}/memories/{remove_id}
```

**Importance Score Mapping**:
- Port operations (pricing, rules, data): **8-10**
- Personal info (preferences, mentions): **3-5**
- Social chit-chat (greetings): **1-2**

---

## 💬 CHAT PROCESSING PIPELINE

### 1. **Message Flow Diagram**

```
User Message
    ↓
POST /sessions/{id}/messages
    ↓
ChatService.add_message()
    ├─ Create DB record
    ├─ Update Redis cache
    ├─ Dispatch Celery task (by mode)
    └─ Check triggers:
        ├─ Store memory (if >10 chars)
        ├─ Summarize session (every 10 messages)
        └─ Return intent_type for frontend

    ↓ [Dispatch by mode]
    ├─ "chat" → process_chat_response
    ├─ "rag"  → rag_document_search
    └─ "sql"  → run_sql_query
```

### 2. **Chat Message Processing**

**File**: `src/worker/chat_tasks.py` → `process_chat_response()`

**Queue**: `chat_priority` (real-time)
**Max Retries**: 3

```python
def process_chat_response(session_id, message_id, content, role, user_id, department):
    """
    1. Chunk message (smart splitting)
    2. Embed each chunk (via Mem0)
    3. Store in Qdrant (short-term memory)
    """
    
    # 1. Smart chunking
    chunks = _smart_chunk(content, chunk_size=512, overlap=50)
    
    # 2. Parallel embedding via Mem0
    with ThreadPoolExecutor(max_workers=8):
        vectors = [embed_chunk(text) for text, _ in chunks]
    
    # 3. Upsert to Qdrant
    points = []
    for (chunk_text, page_num), vector in zip(chunks, vectors):
        point = PointStruct(
            id=str(uuid4()),
            vector=vector,
            payload={
                "content": chunk_text,
                "session_id": session_id,
                "message_id": message_id,
                "user_id": user_id,
                "role": role,
                "department": department,
                "chunk_index": i
            }
        )
        points.append(point)
    
    qdrant.upsert(collection="chat_chunks", points=points)
    return {"status": "ok", "chunks": len(points)}
```

**Chunking Strategy** (`_smart_chunk()`):

```python
def _smart_chunk(text, chunk_size=512, overlap=50):
    """Recursive splitting with semantic awareness"""
    
    separators = [
        "\n\n\n",    # Section breaks (highest priority)
        "\n\n",      # Paragraph breaks
        "\n",        # Line breaks
        ". ",        # Sentence breaks
        ", ",        # Clause breaks
        " ",         # Word breaks
        ""           # Character fallback
    ]
    
    # Pre-process: Enrich tables with LLM before chunking
    text = _process_tables_in_text(text)
    
    # Recursive split on separators in order
    _recursive_split(text, separators, chunk_size, overlap, chunks)
    
    # Map chunks back to original positions for page estimation
    FOR chunk IN chunks:
        page_num = estimate_page_from_position(chunk, original_text)
        result.append((chunk, page_num))
```

### 3. **Session Caching Strategy**

**File**: `src/services/chat_service.py`

```python
cache_key = f"chat:session:{session_id}"

# GET: Full cache or partial from DB
cached = await redis.get(cache_key)
if cached:
    return json.loads(cached)  # No DB hit

# SET: After adding message
existing = json.loads(redis.get(cache_key) or "[]")
existing.append(new_message)
redis.set(cache_key, json.dumps(existing), ex=3600)  # 1hr TTL
```

### 4. **Server-Sent Events (SSE) for Real-Time Updates**

**File**: `src/api/chat.py` → `stream_session()`

```python
async def stream_session(session_id: UUID) -> StreamingResponse:
    """Subscribe to Redis Pub/Sub, forward events as SSE"""
    
    pubsub = redis.pubsub()
    await pubsub.subscribe(f"session:{session_id}")
    
    async for message in pubsub:
        if message['type'] == 'message':
            yield f"data: {message['data']}\n\n"  # Send to frontend
            return  # Close after 1 event, client reconnects
        else:
            # Heartbeat every 20s (stay under Cloudflare 100s timeout)
            yield ": heartbeat\n\n"
```

**Task Completion Signal**:

When a Celery task finishes, it publishes:

```python
def publish_task_complete(session_id: str):
    redis.publish(
        f"session:{session_id}",
        json.dumps({"event": "message_ready", "session_id": session_id})
    )
```

---

## 🔍 RAG PIPELINE (Document Search & Synthesis)

### 1. **RAG Query Flow**

**File**: `src/worker/chat_tasks.py` → `rag_document_search()`

**Queue**: `chat_priority`
**Max Retries**: 2

```python
def rag_document_search(question, session_id, user_id, department):
    """
    1. Setup embedding + Qdrant index
    2. Retrieve top-k chunks with semantic filter
    3. Build unified context (long-term + summary + recent)
    4. Synthesize answer via LLM
    5. Format citations + save result
    """
```

### 2. **Vector Search & Filtering**

```python
# Setup
Settings.embed_model = _get_hf_embed_model()  # Cached singleton
qdrant = QdrantClient(url=QDRANT_URL)
vector_store = QdrantVectorStore(client=qdrant, collection="port_knowledge")
index = VectorStoreIndex.from_vector_store(vector_store)

# Retrieve with access control + quality gate
retriever = index.as_retriever(
    similarity_top_k=5,
    vector_store_kwargs={
        "filter": _build_qdrant_filter(user_id, department)
    }
)
all_nodes = list(retriever.retrieve(question))

# Threshold filtering
RAG_SCORE_THRESHOLD = 0.35
top_nodes = [n for n in all_nodes if (n.score or 0.0) >= RAG_SCORE_THRESHOLD]
```

**Access Control Filter** (`_build_qdrant_filter()`):

```python
def _build_qdrant_filter(user_id, department):
    """
    OR condition:
      - User's own chunks, OR
      - Public chunks from same department
    
    AND must NOT:
      - Chunks marked quality=low (user feedback)
    """
    should_conditions = []
    if user_id:
        should_conditions.append(
            FieldCondition(key="user_id", match=MatchValue(value=user_id))
        )
    if department:
        should_conditions.append(Filter(must=[
            FieldCondition(key="department", match=MatchValue(value=department)),
            FieldCondition(key="is_public", match=MatchValue(value=True))
        ]))
    
    return Filter(
        should=should_conditions,
        must_not=[FieldCondition(key="quality", match=MatchValue(value="low"))]
    )
```

### 3. **Context Building & Citations**

**Function**: `_build_context_and_citations(top_nodes)`

```python
def _build_context_and_citations(top_nodes):
    """
    Deduplication strategy:
    - cite_key = (filename, page, headings): deduplicate same-source
    - content_hash: drop near-duplicates (first 200 chars)
    
    Returns:
    - citations: [{index, file, page, headings, score}, ...]
    - context_blocks: ["[1] snippet1", "[2] snippet2", ...]
    """
    
    citations = []
    context_blocks = []
    seen_citations = set()
    seen_content = set()
    
    for node in top_nodes:
        meta = _extract_node_metadata(node)
        snippet = _extract_snippet(node)
        
        if not snippet:
            continue
        
        # Deduplicate by content hash
        content_hash = hash(snippet[:200])
        if content_hash in seen_content:
            continue
        seen_content.add(content_hash)
        
        # Citation: file + page + heading (same location = same citation)
        cite_key = f"{meta['file']}|{meta['page']}|{meta['headings']}"
        if cite_key not in seen_citations:
            seen_citations.add(cite_key)
            citations.append({
                "index": len(citations) + 1,
                "file": meta["file"],
                "page": meta["page"],
                "headings": meta["headings"],
                "score": round(node.score, 3)
            })
        
        # Find matching citation index and append context
        cite_idx = next(c["index"] for c in citations if c["file"] == meta["file"])
        context_blocks.append(f"[{cite_idx}] {snippet}")
    
    return citations, context_blocks
```

### 4. **Unified Context Assembly**

**Function**: `_gather_unified_context(question, session_id, user_id)`

```python
def _gather_unified_context(question, session_id, user_id):
    """Gather 3 context layers for LLM prompt"""
    
    # 1. Long-term memories from Mem0
    long_term_block = ""
    if user_id:
        resp = POST {MEM0_URL}/search {
            "query": question,
            "user_id": user_id,
            "limit": 5
        }
        long_term_block = "\n".join(
            f"- {item.get('text')}" for item in resp.json()["results"]
        )
    
    # 2. Session summary + recent messages (single query)
    summary_block = ""
    recent_block = ""
    rows = db.execute("""
        SELECT s.metadata, m.role, m.content
        FROM chat_sessions s
        LEFT JOIN (
            SELECT session_id, role, content
            FROM chat_messages
            WHERE session_id = :sid
            ORDER BY created_at DESC
            LIMIT 6
        ) m ON m.session_id = s.id
        WHERE s.id = :sid
    """)
    
    if rows:
        summary_block = rows[0][0].get("summary", "")
        msg_rows = [(r[1], r[2]) for r in rows if r[1]]
        recent_block = "\n".join(f"{r[0].upper()}: {r[1]}" for r in reversed(msg_rows))
    
    return {
        "long_term_block": long_term_block,
        "summary_block": summary_block,
        "recent_block": recent_block
    }
```

### 5. **LLM Synthesis**

**Function**: `_synthesize_with_llm(question, context_text, long_term_block, ...)`

**System Prompt** (`_RAG_SYSTEM_PROMPT`):

```
Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).
Nhiệm vụ của bạn là dựa vào tài liệu được cung cấp để giải đáp chính xác, rõ ràng.

YÊU CẦU ĐỊNH DẠNG:
- Trả lời tự nhiên, lịch sự, đầy đủ ý nhưng không lan man.
- ĐƯỢC PHÉP dùng bullet points, xuống dòng nếu thông tin dài.
- Khi context chứa bảng (tbl_cell, row_key, col_key): TRÌNH BÀY LẠI THÀNH BẢNG MARKDOWN.
  Ví dụ:
  | Loại container | 20' | 40' | 45' |
  |---|---|---|---|
  | Hàng khô | 1.230.000 | 1.835.000 | 1.835.000 |

- Giữ nguyên đơn vị tiền tệ gốc (VNĐ, USD). Không làm tròn, không đổi.
- Trích dẫn nguồn bằng [1], [2]... vào cuối câu/đoạn.
- TUYỆT ĐỐI KHÔNG BỊA SỐ LIỆU. Nếu không đề cập → "chưa có thông tin, liên hệ 1800 1188".
```

**User Prompt**:

```
Câu hỏi người dùng: {question}

Context:

### Long-term Memory
{long_term_block}

### Tóm tắt hội thoại
{summary_block}

### Hội thoại gần đây
{recent_block}

### Đoạn trích tài liệu (đã đánh số)
{context_text}

Yêu cầu: Hãy phân tích kỹ Context để trả lời đầy đủ, chi tiết.
```

**LLM Call**:

```python
resp = POST {OPENAI_BASE}/chat/completions {
    "model": LLM_MODEL,  # openai/gpt-4o-mini (fallback from gpt-5-nano)
    "messages": [
        {"role": "system", "content": _RAG_SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt}
    ],
    "temperature": 0.3,
    "max_tokens": 1500
}
```

### 6. **Output Sanitization**

**Function**: `_sanitize_generated_answer(text)`

```python
def _sanitize_generated_answer(text):
    # Remove model-generated citation footer
    clean = re.sub(r"(?ms)^---\s*\n📚\s*\*\*Nguồn tham khảo:\*\*[\s\S]*$", "", text)
    
    # Remove malformed citation lines
    clean = re.sub(r"(?m)^\s*-\s*\*\*\[[^\]]+\]\*\*.*$", "", clean)
    
    # Fix malformed citations: [ 1 VNĐ ] → [1]
    clean = re.sub(r"\[\s*(\d+)\s*(?:VNĐ|VND)\s*\]", r"[\1]", clean)
    
    # Normalize excess whitespace
    clean = re.sub(r"\n{4,}", "\n\n", clean)
    
    # Remove dangling endings (truncated generation)
    clean = re.sub(r"(?:\s+(?:và|hoặc|cho|tại|với|là|:))\s*$", "", clean)
    
    return clean.strip()
```

### 7. **Citation Footer Formatting**

**Function**: `_format_citations_footer(citations)`

```python
def _format_citations_footer(citations):
    """Append clean citations to response"""
    cite_lines = ["---", "📚 **Nguồn tham khảo:**"]
    
    for c in citations:
        page_str = str(int(c["page"])) if c["page"] else "?"
        score_str = f" — độ liên quan: {c['score']:.3f}" if 0 < c['score'] <= 1 else ""
        headings_str = f" | mục: {c['headings'][-1]}" if c['headings'] else ""
        
        cite_lines.append(
            f"- **[{c['index']}]** {c['file']} (Trang {page_str}){headings_str}{score_str}"
        )
    
    return "\n" + "\n".join(cite_lines)
```

### 8. **Text Cleaning Utilities**

**Function**: `_clean_snippet_text(text)`

```python
def _clean_snippet_text(text):
    # Remove HTML tags from Docling table export
    text = re.sub(r"<[^>]+>", "", text)
    
    # Normalize Windows line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    
    # Convert tabs to spaces
    text = text.replace("\t", " ")
    
    # Collapse multiple spaces per line
    lines = [re.sub(r"  +", " ", l).strip() for l in text.splitlines()]
    text = "\n".join(lines)
    
    # Collapse 3+ blank lines → single blank
    text = re.sub(r"\n{3,}", "\n\n", text)
    
    # Remove whitespace-only lines
    text = "\n".join(ln for ln in text.splitlines() if ln.strip())
    
    return text.strip()
```

**Vietnamese Sentence Splitting** (`_split_sentences_vi(text)`):

```python
def _split_sentences_vi(text):
    """Smart split avoiding decimal numbers, abbreviations, ellipsis"""
    
    # Protect patterns
    text = text.replace("...", "⟨ellipsis⟩")  # Ellipsis
    text = re.sub(r"(\d)\.(\d)", r"\1⟨dot⟩\2", text)  # Decimals: 1.200.000
    text = re.sub(r"\b([A-ZĐÀÁ...]{1,3})\.", r"\1⟨abbr⟩", text)  # Abbrev: Dr., TP.
    
    # Split only on [.!?] + space + uppercase
    sentences = re.split(
        r'(?<=[.!?])\s+(?=[A-ZĐÀÁ...])',
        text
    )
    
    # Restore placeholders
    return [
        s.replace("⟨ellipsis⟩", "...")
         .replace("⟨dot⟩", ".")
         .replace("⟨abbr⟩", ".")
        for s in sentences
    ]
```

---

## 🎯 SYSTEM PROMPTS & TEMPLATES

### 1. **RAG System Prompt** (Vietnamese Port Authority)

Located in: `src/worker/chat_tasks.py` (line ~411-425)

**Key Behaviors**:
- Formal, professional tone (port authority context)
- Markdown table formatting for pricing/specifications
- Citation enforcement ([1], [2], ...)
- Currency preservation (VNĐ, USD — no conversion)
- Honest uncertainty ("chưa có thông tin" + hotline 1800 1188)
- Bullet points + line breaks for clarity

### 2. **Session Summary Prompt** (every 10 messages)

Task: `summarize_session_history()`

```python
system_prompt = (
    "Bạn là chuyên gia tóm tắt hội thoại. "
    "Tóm tắt cuộc hội thoại sau thành MỘT đoạn văn ngắn (tối đa 500 ký tự). "
    "Tập trung vào: chủ đề chính, thông tin quan trọng, và kết luận. "
    "Viết bằng tiếng Việt, súc tích."
)
temp = 0.1  # Low temperature for consistency
max_tokens = 300
```

Stores in: `chat_sessions.metadata.summary`

### 3. **Memory Consolidation Prompt** (Nightly Gardener)

Task: `consolidate_memories()`

```python
system_prompt = (
    "Bạn là hệ thống quản lý bộ nhớ. Phân tích danh sách facts sau:\n"
    "1. Tìm facts TRÙNG LẶP hoặc MÂU THUẪN → ghi 'MERGE: [id1] + [id2] → merged_text'\n"
    "2. Gán importance_score (1-10) cho MỖI fact:\n"
    "   - Nghiệp vụ Cảng (số liệu, quy định, biểu giá): 8-10\n"
    "   - Thông tin cá nhân (sở thích, hỏi thăm): 3-5\n"
    "   - Xã giao (chào hỏi, khen): 1-2\n"
    "Trả lời dạng JSON..."
)
response_format = {"type": "json_object"}
```

### 4. **SQL Agent System Prompt**

File: `src/worker/data_tasks.py`

```python
system_prompt = (
    "You are a SQL Expert for ChatSNP Vietnamese Port System. "
    "Your goal is to provide a valid, safe, and efficient SQL query. "
    "If a query fails, use your tools to inspect the schema and fix it. "
    "Return the SQL and a brief Vietnamese explanation. "
    "Rules:\n"
    "1. Only SELECT queries allowed.\n"
    "2. No DROP, DELETE, INSERT, UPDATE, or ALTER.\n"
    "3. Use Vietnamese for explanations."
)
```

### 5. **Table Enrichment Prompt**

Helper: `_llm_enrich_table()` in `src/worker/helpers.py`

```python
system_prompt = (
    "Bạn là trợ lý xử lý dữ liệu cho hệ thống RAG. "
    "Chuyển đổi bảng Markdown thành văn bản tự nhiên (tiếng Việt) để phục vụ tìm kiếm:\n"
    "1. Bảng Danh Sách (Giá, Thông số, Nhân sự): Viết lại chi tiết từng dòng thành câu.\n"
    "2. Bảng Tổng Hợp (Báo cáo, Thống kê): Tóm tắt xu hướng chính và con số quan trọng.\n"
    "Yêu cầu: Giữ chính xác mọi con số, tên riêng, đơn vị tính. KHÔNG BỊA ĐẶT thông tin."
)
temperature = 0.0  # Absolute accuracy
max_tokens = 500
```

**Usage**: Pre-processes tables BEFORE chunking to improve semantic searchability.

### 6. **Image Analysis Prompt**

Helper: `_extract_text_from_image()` in `src/worker/helpers.py`

```python
content = (
    "Hãy miêu tả chi tiết bức ảnh này bằng tiếng Việt. "
    "Chú ý đọc và trích xuất toàn bộ chữ viết, biểu đồ, sơ đồ có trong ảnh. "
    "Đừng bỏ sót thông tin."
)
model = "gpt-4o-mini" or {LLM_MODEL}
max_tokens = 1500
```

---

## 📊 CONTEXT MANAGEMENT

### 1. **Cache Strategy**

```
Redis Key: chat:session:{session_id}
TTL: 1 hour
Content: JSON array of messages + metadata

When message added:
├─ If cache hit: append to existing + re-set
├─ If miss: load from DB, cache full list
└─ Always: update TTL to 1 hour
```

### 2. **Session Metadata Storage**

```python
class ChatSession(Base):
    metadata: dict = mapped_column(JSON, default=dict)
    # Contains:
    # {
    #   "summary": "Session summary text (max 500 chars)",
    #   "message_count_at_summary": 10,  # Last summary trigger
    #   ...custom fields...
    # }
```

### 3. **Message Metadata Storage**

```python
class ChatMessage(Base):
    metadata: dict = mapped_column(JSON, default=dict)
    # Contains:
    # {
    #   "attachments": [{"type": "chart", "url": "...", "filename": "..."}],
    #   "rag_chunk_ids": ["id1", "id2", ...],  # For feedback tracking
    #   ...custom fields...
    # }
```

### 4. **Feedback Loop (Self-Correction)**

Task: `process_feedback()` in `src/worker/chat_tasks.py`

```python
def process_feedback(message_id, is_liked, reason):
    """Mark chunks as low-quality when user dislikes answer"""
    
    if is_liked:
        return {"status": "ok"}  # Positive → no action (reserved for ranking)
    
    # Negative feedback:
    # 1. Try exact chunk IDs stored at generation time (most accurate)
    message = db.get(message_id)
    stored_chunk_ids = message.metadata.get("rag_chunk_ids", [])
    
    if stored_chunk_ids:
        qdrant.set_payload(
            collection="port_knowledge",
            payload={"quality": "low", "dislike_reason": reason},
            points=stored_chunk_ids
        )
    else:
        # 2. Fallback: embed message + similarity search
        query_vector = embed_text(message.content[:500])
        matches = qdrant.query_points(collection="port_knowledge", query=query_vector, limit=3)
        
        for point in matches:
            if point.score > 0.7:
                qdrant.set_payload(
                    collection="port_knowledge",
                    payload={"quality": "low", "dislike_reason": reason},
                    points=[point.id]
                )
```

**Impact**: Marked chunks are excluded in future RAG searches via filter.

---

## 🔄 TASK QUEUES & PROCESSING

### 1. **Three Priority Queues**

| Queue | Purpose | Tasks | Priority |
|-------|---------|-------|----------|
| **chat_priority** | Real-time chat | process_chat_response, store_memory, rag_document_search, process_feedback | HIGH |
| **data_batch** | SQL + data sync | run_sql_query, sync_data | MEDIUM |
| **media_process** | Document/audio | process_document, transcribe_audio, generate_chart, text_to_speech | LOW |

### 2. **Task Dispatch Logic** (in `ChatService.add_message()`)

```python
mode = getattr(message, 'mode', 'chat')  # Frontend specifies mode

if mode == "sql":
    run_sql_query.delay(question=content, session_id=session_id, user_id=user_id)
elif mode == "rag":
    rag_document_search.delay(question=content, session_id=session_id, user_id=user_id, department=department)
else:  # "chat" (default)
    process_chat_response.delay(session_id=session_id, message_id=message_id, content=content, ...)

# Additional triggers (all sessions/users)
if user_id and len(content) > 10:
    store_memory.delay(...)  # async memory storage

if message_count % 10 == 0:
    summarize_session_history.delay(...)  # async summary
```

### 3. **Embedding Optimization**

**Worker-Level Singleton** (in `chat_tasks.py`):

```python
_hf_embed_model = None  # Loaded once per Celery worker process

def _get_hf_embed_model():
    global _hf_embed_model
    if _hf_embed_model is None:
        from llama_index.embeddings.huggingface import HuggingFaceEmbedding
        model_name = os.getenv("EMBEDDING_MODEL", "thanhtantran/Vietnamese_Embedding_v2")
        _hf_embed_model = HuggingFaceEmbedding(model_name=model_name)
    return _hf_embed_model
```

**Result**: ~1.3 GB model loaded once per worker, not per request.

---

## 🏗️ KEY FILES REFERENCE

| File | Purpose |
|------|---------|
| `src/core/mem0_config.py` | Mem0 HTTP client + embedding proxy |
| `src/core/qdrant_setup.py` | Qdrant collection setup + search helper |
| `src/core/config.py` | Settings (env vars) + validation |
| `src/services/chat_service.py` | Chat business logic + cache management |
| `src/worker/chat_tasks.py` | Chat processing + memory + RAG + feedback |
| `src/worker/data_tasks.py` | SQL agent + Vanna integration |
| `src/worker/gardener_tasks.py` | Nightly memory consolidation |
| `src/worker/helpers.py` | Smart chunking, LLM utilities, table enrichment |
| `src/api/chat.py` | REST API endpoints + SSE streaming |
| `src/models/models.py` | SQLAlchemy ORM models |

---

## 📈 PERFORMANCE PATTERNS

### 1. **Parallel Embedding**

```python
with ThreadPoolExecutor(max_workers=min(len(chunks), 8)):
    vectors = list(pool.map(_embed_chunk, chunk_texts))
```

**Benefit**: 8 chunks embedded in parallel instead of serial.

### 2. **Unified Database Query**

```sql
SELECT s.metadata, m.role, m.content
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

**Benefit**: Single query instead of 2 (session + last 6 messages).

### 3. **Redis Caching**

- Session messages cached for 1 hour
- Append-only updates (no full reload)
- Minimal DB hits after first request

### 4. **Qdrant Payload Indexes**

```python
_ensure_payload_indexes(qdrant, "port_knowledge", [
    "user_id", "department", "quality", "document_id", "source_file"
])
```

**Benefit**: Fast filtered search without full scan.

---

## 🔐 Security & Data Handling

### 1. **Access Control in RAG**

```python
# Only return chunks:
# - Owned by user_id, OR
# - Public AND from user's department

# AND never return chunks marked quality=low (user feedback)
```

### 2. **SQL Safety**

```python
forbidden = ["DROP", "DELETE", "ALTER", "TRUNCATE", "INSERT", "UPDATE"]
if any(word in sql.upper() for word in forbidden):
    reject("Thao tác này không được phép")
```

### 3. **Error Handling**

- Never expose SQL/tracebacks to user
- Always return Vietnamese error messages
- Fallback gracefully (e.g., LLM fails → use chunk snippets)

---

## 💡 KEY DESIGN PATTERNS

1. **Dual-Memory**: Long-term (Mem0) + Short-term (Qdrant) = richer context
2. **Async-First**: All intensive ops as Celery tasks (user doesn't wait)
3. **Smart Chunking**: Semantic splitting + table enrichment before embedding
4. **Unified Context**: Combine memories + summary + recent history before LLM
5. **Citation Tracking**: Store chunk IDs for feedback accuracy
6. **Self-Correction**: User dislikes mark chunks as low-quality (auto-filtered later)
7. **Nightly Consolidation**: Dedup facts, assign importance, optimize retrieval
8. **SSE Streaming**: Real-time task completion signals (no polling)
9. **Singleton Models**: Embedding model loaded once per worker
10. **Graceful Fallback**: LLM fails? Use snippet text + citations

