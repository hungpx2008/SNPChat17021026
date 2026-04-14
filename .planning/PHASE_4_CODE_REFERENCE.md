# Phase 4: Hybrid Search — Complete Code Reference

## Quick Reference for Implementation

### 1. Qdrant Collection: `port_knowledge`

**Current Payload Schema:**
```python
payload = {
    "text": str,                           # Chunk content
    "source_file": str,                   # Filename
    "page_number": int,                   # Page or position
    "chunk_index": int,                   # Chunk sequence
    "user_id": str | null,                # Owner (for access control)
    "document_id": str | null,            # Document UUID
    "type": "document_chunk" | "audio_transcript",
    "extractor": "docling" | "vlm" | "whisper_local",
    "headings": [str],                    # Section headings
    "row_keys": [str],                    # Table row identifiers
    "quality": "low" | None,              # Quality feedback flag
    "is_public": bool,                    # Department public flag
    "department": str | null,             # Department owner
}
```

**For Phase 4 Hybrid, ADD:**
```python
payload["keywords"] = [str]               # Extracted keywords for BM25
payload["language"] = "vi" | "en"         # Language tag
payload["summary"] = str | None           # Short summary (optional)
```

---

### 2. Current RAG Search Flow (lines 623-750, chat_tasks.py)

```python
# STEP 1: Initialize embedding + vector store
from llama_index.core import VectorStoreIndex, StorageContext, Settings
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

Settings.embed_model = _get_hf_embed_model()  # Cached singleton
qdrant = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
vector_store = QdrantVectorStore(client=qdrant, collection_name="port_knowledge")
storage_ctx = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_vector_store(vector_store=vector_store, storage_context=storage_ctx)

# STEP 2: Retrieve semantic results
retriever = index.as_retriever(
    similarity_top_k=5,  # ⚠️ Hardcoded
    vector_store_kwargs={"filter": _build_qdrant_filter(user_id, department)},
)
all_nodes = list(retriever.retrieve(question))

# STEP 3: Filter by score threshold
RAG_SCORE_THRESHOLD = 0.35  # Cosine similarity
top_nodes = [
    n for n in all_nodes
    if getattr(n, "score", 0.0) is not None and (getattr(n, "score", 0.0) or 0.0) >= RAG_SCORE_THRESHOLD
]

# STEP 4: Build context + citations
citations, context_blocks = _build_context_and_citations(top_nodes)

# STEP 5: Gather unified context (3 sources)
unified_ctx = _gather_unified_context(question, session_id, user_id)

# STEP 6: Synthesize via LLM
result_text = _synthesize_with_llm(
    question,
    context_text="\n\n---\n\n".join(context_blocks),
    long_term_block=unified_ctx.get("long_term_block", ""),
    summary_block=unified_ctx.get("summary_block", ""),
    recent_block=unified_ctx.get("recent_block", ""),
)

# STEP 7: Save to backend API
http_client.post(
    f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
    json={"content": result_text, "role": "assistant"},
)
```

---

### 3. Document Indexing Flow (lines 26-272, media_tasks.py)

```python
# STEP 1: Extract text via Docling or VLM
if ext in (".jpg", ".jpeg", ".png"):
    extracted_text = _extract_text_from_image(file_path)
else:
    from src.services.docling_service import process_document_deep
    deep_result = process_document_deep(file_path)
    extracted_text = deep_result.markdown
    prechunked_chunks = [
        {
            "text": chunk.text,
            "page": chunk.page_number,
            "headings": chunk.headings,
            "row_keys": chunk.metadata.get("row_keys", []),
        }
        for chunk in deep_result.chunks
    ]

# STEP 2: Chunk text (512 tokens, 50 overlap)
if prechunked_chunks:
    chunks_with_pages = [(c["text"], c["page"]) for c in prechunked_chunks]
else:
    from .helpers import _smart_chunk
    chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)

# STEP 3: Embed via Mem0 (parallel)
mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
embed_url = f"{mem0_url.rstrip('/')}/embed"

def _embed_chunk(chunk_text: str) -> list[float]:
    resp = http_client.post(embed_url, json={"text": chunk_text})
    return resp.json()["vector"]

chunk_texts = [ct for ct, _ in chunks_with_pages]
with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
    vectors = list(pool.map(_embed_chunk, chunk_texts))

# STEP 4: Build payloads
payloads: list[dict[str, Any]] = []
vector_ids: list[str] = []
for i, (chunk_text, page_num) in enumerate(chunks_with_pages):
    vid = str(uuid4())
    vector_ids.append(vid)
    payload = {
        "text": chunk_text,
        "source_file": filename,
        "page_number": page_num,
        "chunk_index": i,
        "user_id": user_id,
        "document_id": document_id,
        "type": "document_chunk",
        "extractor": extractor_used,
    }
    # Add optional fields
    if headings:
        payload["headings"] = headings
    if row_keys:
        payload["row_keys"] = row_keys
    payloads.append(payload)

# STEP 5: Upsert to Qdrant
from src.core.qdrant_setup import upsert_vectors
upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)

# STEP 6: Update document status
if document_id:
    _update_document_status(
        document_id=document_id,
        status="ready",
        chunk_count=len(chunks_with_pages),
        extractor_used=extractor_used,
        metadata={
            "page_count": page_count,
            "table_count": table_count,
            "char_count": len(extracted_text),
        },
    )
```

---

### 4. Qdrant Setup (core/qdrant_setup.py)

```python
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

_client: QdrantClient | None = None

def get_qdrant_client() -> QdrantClient:
    """Get or initialize Qdrant client singleton."""
    global _client
    if _client is None:
        settings = get_settings()
        _client = QdrantClient(
            url=settings.qdrant_http_url,
            grpc_port=settings.qdrant_grpc_port,
        )
        ensure_collections(_client, settings.embedding_dimension)
    return _client

def ensure_collections(client: QdrantClient, vector_size: int) -> None:
    """Create required collections (1024-dim, COSINE distance)."""
    for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai"):
        if name not in existing:
            client.create_collection(
                collection_name=name,
                vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
            )
    # Create indexes
    _ensure_payload_indexes(client, "port_knowledge", ["user_id", "department"])

def upsert_vectors(collection: str, payloads: Iterable[dict], vectors: Iterable[list[float]], ids: Iterable[str] | None = None) -> None:
    """Upsert vectors to collection."""
    client = get_qdrant_client()
    client.upsert(
        collection_name=collection,
        points=qmodels.Batch(
            ids=list(ids) if ids is not None else None,
            vectors=list(vectors),
            payloads=list(payloads),
        ),
    )

def search_vectors(collection: str, vector: list[float], limit: int = 5, filters: dict | None = None) -> list[qmodels.ScoredPoint]:
    """Search vectors with optional filtering."""
    client = get_qdrant_client()
    return client.query_points(
        collection_name=collection,
        query=vector,
        limit=limit,
        query_filter=qmodels.Filter(
            must=[qmodels.FieldCondition(key=key, match=qmodels.MatchValue(value=value)) 
                  for key, value in (filters or {}).items()]
        ) if filters else None,
    ).points
```

---

### 5. Access Control Filter (chat_tasks.py:171-206)

```python
def _build_qdrant_filter(user_id: str | None, department: str | None):
    """Build security filter for RAG search.
    
    Returns chunks where:
    - User owns it (user_id matches), OR
    - It's public and in user's department
    
    AND
    - It's not marked as low quality
    """
    from qdrant_client.models import Filter, FieldCondition, MatchValue
    
    # Access control
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
    
    # Quality gate
    must_not_conditions = [
        FieldCondition(key="quality", match=MatchValue(value="low")),
    ]
    
    if should_conditions:
        return Filter(should=should_conditions, must_not=must_not_conditions)
    return Filter(must_not=must_not_conditions)
```

---

### 6. Context Assembly (chat_tasks.py:344-408)

```python
def _gather_unified_context(question: str, session_id: str, user_id: str | None) -> dict[str, str]:
    """Collect 3 types of context for LLM synthesis."""
    long_term_block = ""
    summary_block = ""
    recent_block = ""
    
    # 1. Long-term memories (Mem0)
    if user_id:
        try:
            resp = http_client.post(
                f"{mem0_url}/search",
                json={"query": question, "user_id": user_id, "limit": 5},
            )
            if resp.status_code == 200:
                results = resp.json().get("results") or []
                long_term_block = "\n".join(f"- {item.get('text', '')}" for item in results).strip()
        except Exception as e:
            logger.warning(f"Mem0 fetch failed: {e}")
    
    # 2. Session summary + recent messages (DB)
    try:
        from src.core.database_pool import db_pool
        rows = db_pool.execute_query_fetchall(
            """
            SELECT s.metadata, m.role, m.content
            FROM chat_sessions s
            LEFT JOIN chat_messages m ON m.session_id = s.id
            WHERE s.id = :sid
            LIMIT 1000
            """,
            {"sid": session_id}
        )
        if rows:
            meta = rows[0][0]
            if isinstance(meta, dict) and meta.get("summary"):
                summary_block = str(meta["summary"])
            
            msg_rows = [(r[1], r[2]) for r in rows if r[1] is not None]
            if msg_rows:
                recent_block = "\n".join(f"{r[0].upper()}: {r[1]}" for r in reversed(msg_rows))
    except Exception as e:
        logger.warning(f"Recent history fetch failed: {e}")
    
    return {
        "long_term_block": long_term_block,
        "summary_block": summary_block,
        "recent_block": recent_block,
    }
```

---

### 7. LLM Synthesis (chat_tasks.py:428-486)

```python
_RAG_SYSTEM_PROMPT = (
    "Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).\n"
    "Trả lời tự nhiên, lịch sự, đầy đủ ý nhưng không lan man.\n"
    "- BẮT BUỘC trình bày lại bảng dữ liệu thành bảng Markdown chuẩn.\n"
    "- Trích dẫn nguồn bằng [1], [2]... vào cuối câu.\n"
    "- TUYỆT ĐỐI KHÔNG BỊA SỐ LIỆU. Nếu tài liệu không đề cập, nói rõ là chưa có thông tin.\n"
)

def _synthesize_with_llm(
    question: str,
    context_text: str,
    *,
    long_term_block: str = "",
    summary_block: str = "",
    recent_block: str = "",
) -> str:
    """Call LLM to synthesize answer."""
    openai_key = os.getenv("OPENAI_API_KEY", "")
    openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
    
    # Build unified prompt
    unified_context_parts = []
    if long_term_block:
        unified_context_parts.append("### Long-term Memory\n" + long_term_block)
    if summary_block:
        unified_context_parts.append("### Tóm tắt hội thoại\n" + summary_block)
    if recent_block:
        unified_context_parts.append("### Hội thoại gần đây\n" + recent_block)
    unified_context_parts.append("### Đoạn trích tài liệu\n" + context_text)
    
    user_prompt = (
        f"Câu hỏi người dùng: {question}\n\n"
        f"Context:\n\n"
        f"{chr(10).join(unified_context_parts)}"
    )
    
    # Call LLM
    resp = http_client.post(
        f"{openai_base.rstrip('/')}/chat/completions",
        headers={"Authorization": f"Bearer {openai_key}"},
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
    
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"]
    return content.strip()
```

---

### 8. Docker Compose Volumes

```yaml
services:
  backend:
    volumes:
      - ./backend:/app
      - media-data:/app/media

  worker_media:
    volumes:
      - ./backend:/app
      - media-data:/app/media

volumes:
  postgres-data:
  redis-data:
  qdrant-data:
  huggingface-cache:
  media-data:      # Shared between backend + worker_media
```

---

### 9. Constants & Configuration

```python
# From environment
RAG_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", "0.35"))
EMBEDDING_MODEL = "thanhtantran/Vietnamese_Embedding_v2"  # 1024-dim
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
QDRANT_URL = os.getenv("QDRANT_URL", "http://qdrant:6333")
MEM0_URL = os.getenv("MEM0_URL", "http://mem0:8000")
BACKEND_INTERNAL_URL = os.getenv("BACKEND_INTERNAL_URL", "http://backend:8000")

# Hardcoded in rag_document_search()
similarity_top_k = 5
temperature = 0.3
max_tokens = 1500

# In _smart_chunk()
chunk_size = 512
chunk_overlap = 50
```

---

### 10. Celery Task Definition Pattern

```python
from src.worker.celery_app import celery_app

@celery_app.task(name="src.worker.tasks.task_name", bind=True, max_retries=2)
def task_name(
    self,
    param1: str,
    param2: str | None = None,
) -> dict[str, Any]:
    """Task docstring."""
    logger.info(f"[task] Starting with param1={param1}")
    try:
        # Implementation
        result = ...
        return {"status": "success", "result": result}
    except Exception as exc:
        logger.exception(f"Error in task: {exc}")
        raise self.retry(exc=exc, countdown=10)
```

---

## Where to Put Phase 4 Code

```
backend/src/
├── services/
│   ├── search/                          ← NEW DIRECTORY
│   │   ├── __init__.py
│   │   ├── hybrid_search.py             ← NEW: Main hybrid engine
│   │   ├── semantic_engine.py           ← NEW: Semantic search
│   │   ├── keyword_engine.py            ← NEW: BM25 keyword search
│   │   └── ranking.py                   ← NEW: Fusion ranking
│   ├── context_builder.py               ← NEW: Context assembly service
│   ├── docling_service.py               (existing)
│   └── ...
├── utils/
│   ├── token_estimator.py               ← NEW: Token counting
│   └── ...
├── worker/
│   ├── chat_tasks.py                    (existing) ← Add hybrid_rag_document_search()
│   ├── media_tasks.py                   (existing) ← Update process_document() for keywords
│   └── ...
└── core/
    ├── qdrant_setup.py                  (existing) ← Add keyword search functions
    └── ...
```

