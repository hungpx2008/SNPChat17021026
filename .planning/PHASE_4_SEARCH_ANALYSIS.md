# Phase 4: Hybrid Search — Current Implementation Analysis

**Date**: April 13, 2026  
**Status**: Complete Codebase Scan  
**Scope**: ChatSNP Backend Search Architecture

---

## Executive Summary

ChatSNP currently implements **pure semantic RAG search** via LlamaIndex + Qdrant. There is **NO hybrid search** (semantic + keyword) implementation yet. Team A (Phase 1) created `token_estimator.py` but it was **NOT found** — this means you'll need to create it for Phase 4.

### Current State
- ✅ Semantic search: LlamaIndex + Qdrant (`port_knowledge` collection)
- ✅ Document chunking: Docling + smart_chunk (512 tokens, 50 overlap)
- ✅ Vector DB: Qdrant with 1024-dim Vietnamese embeddings
- ❌ Hybrid search: NOT implemented
- ❌ Token estimator: NOT found in Phase 1 artifacts
- ❌ Context builder service: NOT found
- ❌ Search service directory: NOT created

---

## 1. Current RAG Implementation in `chat_tasks.py` (Lines 623–754)

### Function: `rag_document_search()`

**Location**: `/chatSNP170226/backend/src/worker/chat_tasks.py:623-750`

```python
@celery_app.task(name="src.worker.tasks.rag_document_search", bind=True, max_retries=2)
def rag_document_search(
    self,
    question: str,
    session_id: str,
    user_id: str | None = None,
    department: str | None = None,
) -> dict[str, Any]:
    """
    RAG Document Search — find and synthesize answers from uploaded documents.
    """
    # 1. Setup embedding (cached singleton) + vector store
    Settings.embed_model = _get_hf_embed_model()
    Settings.llm = None
    qdrant = QdrantClient(url=os.getenv("QDRANT_URL", "http://qdrant:6333"))
    vector_store = QdrantVectorStore(client=qdrant, collection_name="port_knowledge")
    storage_ctx = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store, storage_context=storage_ctx)

    # 2. Retrieve top-k chunks with score threshold filtering
    retriever = index.as_retriever(
        similarity_top_k=5,
        vector_store_kwargs={"filter": _build_qdrant_filter(user_id, department)},
    )
    all_nodes = list(retriever.retrieve(question))
    
    # Filter by RAG_SCORE_THRESHOLD (default: 0.35)
    top_nodes = [
        n for n in all_nodes
        if getattr(n, "score", 0.0) is not None and (getattr(n, "score", 0.0) or 0.0) >= RAG_SCORE_THRESHOLD
    ]

    # 3. Build context + citations with deduplication
    citations, context_blocks = _build_context_and_citations(top_nodes)
    context_text = "\n\n---\n\n".join(context_blocks).strip()

    # 4. Synthesize via LLM with unified context
    unified_ctx = _gather_unified_context(question, session_id, user_id)
    result_text = _synthesize_with_llm(
        question,
        context_text,
        long_term_block=unified_ctx.get("long_term_block", ""),
        summary_block=unified_ctx.get("summary_block", ""),
        recent_block=unified_ctx.get("recent_block", ""),
    )

    # 5. Save via Backend API
    http_client.post(
        f"{BACKEND_INTERNAL_URL}/sessions/{session_id}/messages",
        json={"content": result_text, "role": "assistant"},
    )

    # 6. Store retrieved chunk IDs for feedback tracking
    # ...

    return {"status": "success", "question": question, "citations": len(citations)}
```

**Key Points:**
- **Semantic search only** — no keyword filtering
- **top_k = 5** hardcoded
- **Score threshold = 0.35** (RAG_SCORE_THRESHOLD)
- **Collection**: `port_knowledge` for uploaded documents
- **Embedding**: HuggingFace Vietnamese (`AITeamVN/Vietnamese_Embedding_v2`, 1024-dim)
- **Filter**: User ID + Department access control via `_build_qdrant_filter()`

---

### Helper Functions

#### `_build_qdrant_filter(user_id, department)` (Lines 171–206)

```python
def _build_qdrant_filter(user_id: str | None, department: str | None):
    """Build Qdrant security + quality filter for RAG search.
    
    Access control (OR):
      - chunks owned by this user_id, OR
      - public chunks belonging to this department
    
    Quality gate (must NOT):
      - exclude any chunk marked quality=low via negative feedback
    """
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
    
    # Quality gate
    must_not_conditions = [
        FieldCondition(key="quality", match=MatchValue(value="low")),
    ]
    
    if should_conditions:
        return Filter(should=should_conditions, must_not=must_not_conditions)
    return Filter(must_not=must_not_conditions)
```

---

#### `_build_context_and_citations(top_nodes)` (Lines 283–341)

Deduplicates citations and context blocks:

```python
def _build_context_and_citations(top_nodes: list) -> tuple[list[dict[str, Any]], list[str]]:
    """Parse retrieval nodes into deduplicated citations and context blocks.
    
    Deduplication strategy:
    - cite_key = (filename, page): same page from same doc counts as ONE citation
    - content_hash: near-duplicate snippets (first 200 chars) are dropped entirely
    """
    citations: list[dict[str, Any]] = []
    context_blocks: list[str] = []
    seen_citations: set[str] = set()
    seen_content: set[int] = set()
    
    for node in top_nodes:
        meta = _extract_node_metadata(node)
        snippet = _extract_snippet(node)
        
        # Drop duplicates by content hash
        content_hash = hash(snippet.strip()[:200])
        if content_hash in seen_content:
            continue
        seen_content.add(content_hash)
        
        # Create deduplicated citation
        cite_key = f"{fname}|{page_display}|{heading_key}"
        if cite_key not in seen_citations:
            seen_citations.add(cite_key)
            citations.append({
                "index": len(citations) + 1,
                "file": fname,
                "page": page_display,
                "headings": headings,
                "score": round(score, 3) if score else None,
            })
        
        # Add to context blocks
        cite_idx = next(c["index"] for c in citations if c matches...)
        context_blocks.append(f"[{cite_idx}] {snippet}")
    
    return citations, context_blocks
```

---

#### `_gather_unified_context(question, session_id, user_id)` (Lines 344–408)

Collects 3 types of context for LLM synthesis:

```python
def _gather_unified_context(question: str, session_id: str, user_id: str | None) -> dict[str, str]:
    """Collect long-term memory, session summary, and recent chat for unified prompting."""
    
    # 1. Long-term memories via Mem0 API
    if user_id:
        resp = http_client.post(
            f"{mem0_url}/search",
            json={"query": question, "user_id": user_id, "limit": 5},
        )
        # Extract results into long_term_block
    
    # 2. Session summary + recent messages from DB (single JOIN)
    rows = db_pool.execute_query_fetchall(
        """
        SELECT s.metadata, m.role, m.content
        FROM chat_sessions s
        LEFT JOIN chat_messages m ON m.session_id = s.id
        WHERE s.id = :sid
        """,
        {"sid": session_id}
    )
    # Extract summary_block + recent_block
    
    return {
        "long_term_block": long_term_block,
        "summary_block": summary_block,
        "recent_block": recent_block,
    }
```

---

#### `_synthesize_with_llm(question, context_text, ...)` (Lines 428–486)

```python
def _synthesize_with_llm(
    question: str,
    context_text: str,
    *,
    long_term_block: str = "",
    summary_block: str = "",
    recent_block: str = "",
) -> str:
    """Call LLM via OpenRouter to synthesize a clean answer."""
    
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
        f"Context:\n\n{unified_context}"
    )
    
    # Call LLM
    resp = http_client.post(
        f"{openai_base}/chat/completions",
        json={
            "model": llm_model,  # openai/gpt-4o-mini
            "messages": [
                {"role": "system", "content": _RAG_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 1500,
        },
    )
    
    content = resp.json()["choices"][0]["message"]["content"]
    return content.strip()
```

---

## 2. Document Indexing in `media_tasks.py` (Lines 26–272)

### Function: `process_document()`

**Location**: `/chatSNP170226/backend/src/worker/media_tasks.py:26-150`

```python
@celery_app.task(name="src.worker.tasks.process_document", bind=True, max_retries=2)
def process_document(
    self,
    file_path: str,
    user_id: str | None = None,
    original_filename: str | None = None,
    document_id: str | None = None,
) -> dict[str, Any]:
    """
    Process a document through Docling deep pipeline.
    
    Supports: PDF, DOCX, XLSX, PPTX, MD, TXT, images (.jpg/.png via VLM).
    All documents go through Docling — no quality gating, no user choice needed.
    
    Pipeline:
      1. Images (.jpg/.png) → VLM description text
      2. All others → Docling DocumentConverter
         - Understands tables, headings, page structure
         - AdaptiveTableSerializer → triplet cell text
         - HybridChunker → semantic chunks with context prefix
      3. Chunks → Embed (Mem0) → Qdrant port_knowledge
    """
    filename = original_filename or os.path.basename(file_path)
    
    # Branch A: Images → VLM
    if ext in (".jpg", ".jpeg", ".png"):
        extracted_text = _extract_text_from_image(file_path)
        page_count = 1
        table_count = 0
    
    # Branch B: All others → Docling
    else:
        from src.services.docling_service import process_document_deep
        deep_result = process_document_deep(file_path)
        
        extracted_text = deep_result.markdown
        page_count = deep_result.page_count
        table_count = len(deep_result.tables)
        
        prechunked_chunks = [
            {
                "text": chunk.text,
                "page": chunk.page_number,
                "headings": chunk.headings,
                "row_keys": chunk.metadata.get("row_keys", []),
            }
            for chunk in deep_result.chunks
        ]
    
    # Common processing
    return _do_full_processing(
        file_path=file_path,
        filename=filename,
        document_id=document_id,
        user_id=user_id,
        extracted_text=extracted_text,
        page_count=page_count,
        table_count=table_count,
        extractor_used="docling" if ext not in (".jpg", ".jpeg", ".png") else "vlm",
        preview_pdf_path=preview_pdf_path,
        prechunked_chunks=prechunked_chunks,
        meta_extra=deep_meta,
    )
```

---

### Function: `_do_full_processing()` (Lines 152–272)

```python
def _do_full_processing(
    *,
    file_path: str,
    filename: str,
    document_id: str | None,
    user_id: str | None,
    extracted_text: str,
    page_count: int,
    table_count: int,
    extractor_used: str,
    preview_pdf_path: str | None = None,
    prechunked_chunks: list[dict[str, Any]] | None = None,
    meta_extra: dict | None = None,
) -> dict[str, Any]:
    """
    Shared embedding + upsert pipeline.
    Called by process_document after text/chunks are ready.
    """
    
    # 1. Chunking
    if prechunked_chunks:
        # Use Docling-native semantic chunks
        chunks_with_pages: list[tuple[str, int]] = [
            (text, page_num) for item in prechunked_chunks
        ]
        chunk_payload_meta = [{"headings": item.get("headings"), "row_keys": item.get("row_keys")} ...]
    else:
        # Fallback: smart_chunk (512 tokens, 50 overlap)
        chunks_with_pages = _smart_chunk(extracted_text, chunk_size=512, overlap=50)
        chunk_payload_meta = [{} for _ in chunks_with_pages]
    
    # 2. Embed via Mem0 — parallel
    mem0_url = os.getenv("MEM0_URL", "http://mem0:8000")
    embed_url = f"{mem0_url.rstrip('/')}/embed"
    
    def _embed_chunk(chunk_text: str) -> list[float]:
        resp = http_client.post(embed_url, json={"text": chunk_text})
        return resp.json()["vector"]
    
    chunk_texts = [ct for ct, _ in chunks_with_pages]
    with ThreadPoolExecutor(max_workers=min(len(chunk_texts), 8)) as pool:
        vectors = list(pool.map(_embed_chunk, chunk_texts))
    
    # 3. Build payloads
    payloads: list[dict[str, Any]] = []
    vector_ids: list[str] = []
    for i, (chunk_text, page_num) in enumerate(chunks_with_pages):
        vid = str(uuid4())
        vector_ids.append(vid)
        payload: dict[str, Any] = {
            "text": chunk_text,
            "source_file": filename,
            "page_number": page_num,
            "chunk_index": i,
            "user_id": user_id,
            "document_id": document_id,
            "type": "document_chunk",
            "extractor": extractor_used,
        }
        if headings:
            payload["headings"] = headings
        if row_keys:
            payload["row_keys"] = row_keys
        payloads.append(payload)
    
    # 4. Upsert to Qdrant
    from src.core.qdrant_setup import upsert_vectors
    upsert_vectors("port_knowledge", payloads, vectors, ids=vector_ids)
    
    # 5. Update document status in DB
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
                "preview_pdf_path": preview_pdf_path,
            },
        )
    
    return {
        "status": "success",
        "filename": filename,
        "extractor": extractor_used,
        "chunks": len(chunks_with_pages),
        "pages": page_count,
        "tables": table_count,
    }
```

**Key Points:**
- **Chunking**: Uses Docling semantic chunks OR `smart_chunk()` fallback (512 tokens, 50 overlap)
- **Embedding**: Parallel via Mem0 HTTP API (batch max 8)
- **Upsert**: Direct to `port_knowledge` collection
- **Payload**: Includes text, source_file, page_number, user_id, document_id, headings, row_keys
- **Vector IDs**: UUID per chunk for feedback tracking

---

## 3. Docker Compose Volumes & Services

### `docker-compose.yml` (Volumes Section)

**Backend Volumes** (Line 118-119):
```yaml
backend:
  volumes:
    - ./backend:/app
    - media-data:/app/media
```

**Worker Media Volumes** (Line 204-205):
```yaml
worker_media:
  volumes:
    - ./backend:/app
    - media-data:/app/media
```

**Shared Named Volumes** (Line 242-247):
```yaml
volumes:
  postgres-data:
  redis-data:
  qdrant-data:
  huggingface-cache:
  media-data:  # Shared between backend + worker_media
```

### `docker-compose.pro.yml` (Production)

**Backend Volumes** (Line 82-84):
```yaml
backend:
  volumes:
    - media-data:/app/media # Shared with workers
```

**Worker Media Volumes** (Line 189-190):
```yaml
worker_media:
  volumes:
    - media-data:/app/media # Shared with backend
```

**Named Volumes** (Line 232-237):
```yaml
volumes:
  postgres-data:
  redis-data:
  qdrant-data:
  huggingface-cache:
  media-data: # Shared between backend + worker_media
```

---

## 4. Dependencies (Backend)

### `pyproject.toml` (chatSNP170226/backend/)

```toml
[project]
name = "chatsnp-backend"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    # Web framework
    "fastapi[all]",
    "uvicorn[standard]",
    
    # Database
    "SQLAlchemy[asyncio]>=2.0.0",
    "asyncpg>=0.29.0",
    "alembic>=1.13.0",
    "pydantic-settings>=2.0.3",
    
    # Cache & Message Broker
    "redis>=5.0.0",
    
    # Vector DB
    "qdrant-client>=1.9.0",
    
    # HTTP client
    "httpx>=0.27.0",
    "python-dotenv>=1.0.0",
    "tenacity>=8.2.0",
    
    # Celery — Task Queue
    "celery[redis]>=5.3.0",
    "flower>=2.0.0",
    
    # AI / ML Services
    "vanna[postgres,qdrant,openai]",
    "openai>=1.0.0",
    "lida",
    "docling",
    "kreuzberg",
    "mem0ai",
    "edge-tts",
    "langgraph",
    "faster-whisper>=1.0.0",
    
    # Agentic Frameworks
    "pydantic-ai[openai]>=0.0.14",
    "llama-index>=0.11.0",
    "llama-index-vector-stores-qdrant",
    "llama-index-embeddings-huggingface",
    "tavily-python>=0.3.5",
    
    # Dev/Test
    "pytest>=8.2.0",
    "pytest-asyncio>=0.23.0",
    "anyio>=4.3.0",
    "ruff>=0.5.0",
]
```

**Most relevant for Phase 4:**
- ✅ `qdrant-client>=1.9.0` — vector DB
- ✅ `llama-index>=0.11.0` — semantic search
- ✅ `llama-index-vector-stores-qdrant` — integration
- ✅ `llama-index-embeddings-huggingface` — embeddings
- ❌ **No keyword search library** (e.g., elasticsearch, whoosh, bm25)

### `pyproject.toml` (root `/backend/`)

```toml
[project]
name = "chatsnp-backend"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    # Web framework
    "fastapi[all]",
    "uvicorn[standard]",
    
    # Database
    "SQLAlchemy[asyncio]>=2.0.0",
    "asyncpg>=0.29.0",
    "alembic>=1.13.0",
    "pydantic-settings>=2.0.3",
    
    # Cache & Message Broker
    "redis>=5.0.0",
    
    # Vector DB
    "qdrant-client>=1.9.0",
    
    # HTTP client
    "httpx>=0.27.0",
    "python-dotenv>=1.0.0",
    "tenacity>=8.2.0",
    
    # Celery — Task Queue
    "celery[redis]>=5.3.0",
    "flower>=2.0.0",
    
    # AI / ML Services
    "vanna[postgres,qdrant,openai]",
    "openai>=1.0.0",
    "lida",
    "docling",
    "kreuzberg",
    "mem0ai",
    "edge-tts",
    "langgraph",
    
    # Agentic Frameworks
    "pydantic-ai[openai]>=0.0.14",
    "llama-index>=0.11.0",
    "llama-index-vector-stores-qdrant",
    "llama-index-embeddings-huggingface",
    "tavily-python>=0.3.5",
    
    # Dev/Test
    "pytest>=8.2.0",
    "pytest-asyncio>=0.23.0",
    "anyio>=4.3.0",
    "ruff>=0.5.0",
]
```

---

## 5. Service Directory Structure

### Current Services Exist (`/chatSNP170226/backend/src/services/`)
```
services/
├── __init__.py
├── chat_service.py          (Chat business logic)
├── docling_service.py       (Document extraction via Docling)
├── kreuzberg_service.py     (Data validation)
├── lida_service.py          (Chart generation)
└── tts_service.py           (Text-to-speech)
```

### **Search Service Directory Does NOT Exist**
```
services/search/           ❌ DOES NOT EXIST
├── hybrid_search.py       (Planned for Phase 4)
├── semantic_engine.py     (Planned for Phase 4)
├── keyword_engine.py      (Planned for Phase 4)
└── ranking.py             (Planned for Phase 4)
```

### Current Core Services (`/chatSNP170226/backend/src/core/`)
```
core/
├── __init__.py
├── config.py              (Settings loading)
├── db.py                  (SQLAlchemy setup)
├── database_pool.py       (Connection pool)
├── celery_config.py       (Celery configuration)
├── http_client.py         (HTTPX singleton)
├── mem0_config.py         (Mem0 integration)
├── redis_client.py        (Redis client)
├── qdrant_setup.py        (Qdrant collections + upsert)
└── vanna_setup.py         (Vanna SQL agent)
```

---

## 6. Qdrant Setup & Search Operations

### `qdrant_setup.py` (Full Implementation)

```python
# File: /backend/src/core/qdrant_setup.py

from __future__ import annotations
from typing import Any, Iterable
from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels
from src.core.config import get_settings

_client: QdrantClient | None = None

def get_qdrant_client() -> QdrantClient:
    """Get or initialize Qdrant client singleton."""
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

def ensure_collections(client: QdrantClient, vector_size: int) -> None:
    """Ensure all required Qdrant collections exist with correct vector dimensions.
    
    Collections (all use Vietnamese_Embedding_v2, 1024 dim):
      - chat_chunks: short-term chat message embeddings
      - port_knowledge: uploaded document chunks (RAG)
      - vanna_schemas_openai: Vanna SQL schema embeddings
      - mem0_memories: managed by Mem0 SDK (created automatically)
    """
    collections = client.get_collections().collections
    existing = {collection.name for collection in collections}
    
    for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai"):
        if name not in existing:
            client.create_collection(
                collection_name=name,
                vectors_config=qmodels.VectorParams(size=vector_size, distance=qmodels.Distance.COSINE),
            )
    
    # Payload indexes for fast filtered search
    _ensure_payload_indexes(client, "chat_chunks", ["user_id", "session_id", "department"])
    _ensure_payload_indexes(client, "port_knowledge", ["user_id", "department"])

def upsert_vectors(
    collection: str,
    payloads: Iterable[dict[str, Any]],
    vectors: Iterable[list[float]],
    ids: Iterable[str] | None = None,
) -> None:
    """Upsert vectors to Qdrant collection."""
    client = get_qdrant_client()
    client.upsert(
        collection_name=collection,
        points=qmodels.Batch(
            ids=list(ids) if ids is not None else None,
            vectors=list(vectors),
            payloads=list(payloads),
        ),
    )

def search_vectors(
    collection: str,
    vector: list[float],
    limit: int = 5,
    filters: dict[str, Any] | None = None,
) -> list[qmodels.ScoredPoint]:
    """Search vectors in Qdrant collection with optional filtering."""
    client = get_qdrant_client()
    return client.query_points(
        collection_name=collection,
        query=vector,
        limit=limit,
        query_filter=qmodels.Filter(
            must=[qmodels.FieldCondition(key=key, match=qmodels.MatchValue(value=value)) 
                  for key, value in (filters or {}).items()]
        )
        if filters
        else None,
    ).points
```

**Collections:**
- `chat_chunks`: Short-term messages (embedding: HuggingFace, 1024-dim, COSINE distance)
- `port_knowledge`: Document chunks for RAG (same)
- `vanna_schemas_openai`: SQL schema metadata (same)

**Indexes**: user_id, session_id, department for fast filtering

---

## 7. Token Estimator & Context Builder — NOT FOUND

### Status

**Token Estimator**
- ✅ **Location**: Should be at `/chatSNP170226/backend/src/utils/token_estimator.py`
- ❌ **Actual**: File does NOT exist
- ❌ **Phase 1 Note**: Team A was supposed to create this but did not

**Context Builder**
- ✅ **Location**: Should be at `/chatSNP170226/backend/src/services/context_builder.py`
- ❌ **Actual**: File does NOT exist
- ❌ **Phase 1 Note**: Not created

### What We Found Instead

In `/chatSNP170226/backend/src/worker/chat_tasks.py`:
- `_gather_unified_context()` (Lines 344–408) — similar to context builder but inline
- No token counting logic found anywhere

### Implication for Phase 4

**You MUST create:**
1. `token_estimator.py` — new utility for token counting
2. `context_builder.py` — service to manage context assembly
3. Search service directory with hybrid search implementation

---

## 8. File Structure Summary

### chatSNP170226 Backend
```
chatSNP170226/backend/
├── pyproject.toml              ✅ Dependencies defined
├── src/
│   ├── core/
│   │   ├── qdrant_setup.py    ✅ Vector DB operations
│   │   ├── http_client.py     ✅ HTTPX singleton
│   │   ├── database_pool.py   ✅ DB connection pool
│   │   └── ... (other core services)
│   ├── services/
│   │   ├── docling_service.py ✅ Document extraction
│   │   ├── chat_service.py    ✅ Chat logic
│   │   └── search/            ❌ DOES NOT EXIST (need to create)
│   ├── worker/
│   │   ├── chat_tasks.py      ✅ RAG search task (lines 623–750)
│   │   ├── media_tasks.py     ✅ Document processing (lines 26–272)
│   │   └── helpers.py         ✅ Utility functions
│   └── models/, schemas/, api/, repositories/
└── tests/
```

### Root Backend
```
backend/
├── pyproject.toml              ✅ Dependencies defined
└── src/                        (Structure same as chatSNP170226/backend/src)
```

---

## 9. Configuration & Environment Variables

### Key Variables for Phase 4

From `docker-compose.yml` and `.env.example`:

```bash
# Qdrant (Vector DB)
QDRANT_URL=http://qdrant:6333
QDRANT_HOST=qdrant
QDRANT_PORT=6333
QDRANT_COLLECTION=mem0_memories  # (for memories, not documents)

# Embedding Model
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2  # 1024-dim
EMBEDDER_PROVIDER=huggingface
EMBEDDER_MODEL=AITeamVN/Vietnamese_Embedding_v2

# LLM for Synthesis
LLM_MODEL=openai/gpt-4o-mini
LLM_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# RAG Settings
RAG_SCORE_THRESHOLD=0.35  # Minimum cosine similarity for retrieved chunks

# Mem0 (Long-term Memory)
MEM0_URL=http://mem0:8000

# Backend Internal URL
BACKEND_INTERNAL_URL=http://backend:8000
```

---

## 10. Current Search Limitations (For Hybrid Phase)

### Pure Semantic Search Problems
1. **No keyword matching**: Acronyms, exact terms not found if embedding similarity < 0.35
2. **No field-specific search**: Can't search just in headings, page numbers
3. **No ranking boost**: All top-k results treated equally after threshold filter
4. **No fallback to keyword**: If semantic returns nothing, no backup strategy
5. **No BM25 support**: No TF-IDF based ranking available

### Document Indexing Gaps
1. **No keyword index**: Full-text search not available
2. **No field extraction**: Page ranges, table metadata not indexed
3. **No quality scoring**: Beyond binary "quality=low" flag

### Current Collection Schema (`port_knowledge`)
```python
{
    "id": "uuid",
    "vector": [1024 floats],  # Vietnamese embedding
    "payload": {
        "text": str,
        "source_file": str,
        "page_number": int,
        "chunk_index": int,
        "user_id": str | null,
        "document_id": str | null,
        "type": "document_chunk" | "audio_transcript",
        "extractor": "docling" | "vlm" | "whisper_local",
        "headings": [str],
        "row_keys": [str],
        "quality": "low" | (implicit: "normal")
        "is_public": bool,
        "department": str | null,
    }
}
```

---

## 11. RAG Constants & Configuration

From `chat_tasks.py`:

```python
# Minimum cosine similarity score for a retrieved chunk
RAG_SCORE_THRESHOLD = float(os.getenv("RAG_SCORE_THRESHOLD", "0.35"))

# Default embedding model (cached once per worker)
EMBEDDING_MODEL = "thanhtantran/Vietnamese_Embedding_v2"  # 1024-dim

# Retriever configuration
similarity_top_k = 5  # Hardcoded, not configurable

# Synthesis temperature
temperature = 0.3  # Low for consistent RAG answers
max_tokens = 1500
```

---

## 12. Recommendations for Phase 4

### Phase 4 Must Create

1. **`hybrid_search_engine.py`** in `/backend/src/services/search/`
   - Combine semantic (Qdrant) + keyword (BM25/Whoosh) results
   - Implement ranking fusion

2. **`token_estimator.py`** in `/backend/src/utils/`
   - Count tokens using `tiktoken` (OpenAI) or `transformers` tokenizer
   - Estimate context window usage

3. **`context_builder.py`** in `/backend/src/services/`
   - Manage context assembly with token budgets
   - Handle deduplication at context level

4. **Update Qdrant collection schema**
   - Add `keywords` field (extracted keywords)
   - Add `document_type` field (pdf, pptx, etc.)
   - Add `language` field (vi, en, etc.)

5. **Add BM25 keyword indexing**
   - Store in PostgreSQL `document_index` table or Redis
   - Index during `process_document()` task

### Phase 4 Integration Points

1. **New Celery task**: `hybrid_rag_document_search()`
   - Call semantic + keyword engines in parallel
   - Merge and rank results
   - Use token estimator to respect context limits

2. **Update `media_tasks.py`**: `process_document()` task
   - Extract keywords during indexing
   - Store in PostgreSQL for BM25 search

3. **Update Qdrant setup**: `qdrant_setup.py`
   - Add `keywords` field indexing
   - Create `keyword_search()` function

4. **New API endpoints** (optional):
   - `POST /api/search/hybrid` — explicit hybrid search
   - `POST /api/search/config` — search parameters

---

## Summary Table

| Item | Current | Location | Status |
|------|---------|----------|--------|
| **Semantic Search** | ✅ LlamaIndex + Qdrant | `chat_tasks.py:623-750` | Production |
| **Vector DB** | ✅ Qdrant (1024-dim) | `core/qdrant_setup.py` | Production |
| **Document Indexing** | ✅ Docling → Mem0 → Qdrant | `media_tasks.py:26-150` | Production |
| **Context Assembly** | ✅ Inline in `chat_tasks.py` | `chat_tasks.py:344-408` | Production |
| **LLM Synthesis** | ✅ OpenRouter/OpenAI | `chat_tasks.py:428-486` | Production |
| **Hybrid Search** | ❌ Not implemented | — | Phase 4 |
| **Token Estimator** | ❌ Not found | `utils/token_estimator.py` | Phase 4 |
| **Search Service Dir** | ❌ Not created | `services/search/` | Phase 4 |
| **Context Builder Service** | ❌ Not created | `services/context_builder.py` | Phase 4 |
| **Keyword Indexing** | ❌ Not implemented | — | Phase 4 |

---

## Next Steps

1. ✅ You have this comprehensive analysis
2. 📝 Create Phase 4 implementation plan based on this data
3. 🔧 Build `token_estimator.py` first (foundation)
4. 🔧 Build `context_builder.py` (dependency for hybrid search)
5. 🔧 Build `services/search/` with hybrid engine
6. 🔧 Update `media_tasks.py` for keyword extraction
7. 🔧 Create new Celery task for hybrid RAG search
8. ✅ Test and document

---

**Report Generated**: April 13, 2026  
**Analyzed By**: Claude Code  
**Codebase**: ChatSNP Backend (Phase 4 Hybrid Search Foundation)
