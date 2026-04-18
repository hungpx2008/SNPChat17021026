# Debug: rag-embedding-model-chunk-quality

**Date:** 2026-04-18  
**Status:** Root causes identified — 3 critical issues  
**Severity:** CRITICAL — embedding model mismatch có thể gây dimension error hoặc silent wrong-space retrieval  
**Related:** `/Volumes/orical/ChatSNP/.planning/debug/rag-pdf-table-price-not-found.md` (Root Cause #4/#5)

---

## TL;DR

Có **3 root cause** nghiêm trọng liên quan đến embedding model:

1. **🔴 Dimension Mismatch giữa `docker-compose.yml` default và `config.py` default** — Docker inject `MiniLM-L12-v2 (384-dim)` nếu `.env` không set `EMBEDDING_MODEL`, trong khi codebase comment & intent là dùng `Vietnamese_Embedding_v2 (1024-dim)`. Collections được tạo với dimension sai.
2. **🔴 `.env` không set `EMBEDDING_MODEL` / `EMBEDDING_DIMENSION`** — Tức là `docker-compose.yml` fallback về 384-dim MiniLM, không phải 1024-dim Vietnamese_Embedding_v2.
3. **🟠 Chunk size (2048 tokens) >> max_seq_length của bất kỳ model nào** — Cả MiniLM (128 tokens!) và Vietnamese_Embedding_v2 (2048 tokens) đều có nguy cơ bị truncate với DOCLING_CHUNK_MAX_TOKENS=768, nhưng MiniLM bị truncate nghiêm trọng hơn nhiều.

---

## Chi tiết điều tra

### 1. Dimension Mismatch — Docker Default vs Code Default

#### `docker-compose.yml` (line 12–13):
```yaml
x-common-env: &common-env
  EMBEDDING_MODEL: ${EMBEDDING_MODEL:-sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2}
  EMBEDDING_DIMENSION: ${EMBEDDING_DIMENSION:-384}
```

#### `config.py` (line 13–14):
```python
embedding_dimension: int = Field(384, alias="EMBEDDING_DIMENSION")
embedding_model: str = Field("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", alias="EMBEDDING_MODEL")
```

#### Nhưng toàn bộ comment trong code nói về 1024-dim:
- `qdrant_setup.py` line 50: `"Collections (all use Vietnamese_Embedding_v2, 1024 dim)"`
- `docker-compose.yml` line 55 (comment): `"# Model: AITeamVN/Vietnamese_Embedding_v2 (BAAI/bge-m3 base, max_seq=2048)"`

#### `.env` hiện tại — KHÔNG có `EMBEDDING_MODEL` hay `EMBEDDING_DIMENSION` được set
```bash
# .env — không có dòng EMBEDDING_MODEL hay EMBEDDING_DIMENSION
# → docker-compose.yml fallback về MiniLM-L12-v2 / 384
```

**Kết quả khi chạy với Docker:**
- `EMBEDDING_MODEL = sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
- `EMBEDDING_DIMENSION = 384`
- Qdrant collections được tạo với `size=384`
- Chunks được embed bằng MiniLM → **không phải Vietnamese_Embedding_v2**

---

### 2. Model được dùng thực tế: MiniLM-L12-v2 (384-dim)

**File:** `backend/src/worker/chat_tasks.py` (line 60–72):
```python
def _get_hf_embed_model():
    model_name = os.getenv("EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    ...
    _hf_embed_model = SentenceTransformer(model_name)
```

- Default trong code: `MiniLM-L12-v2`
- Default trong Docker: `MiniLM-L12-v2` (vì `.env` không override)
- Cả hai trùng nhau → **MiniLM đang được dùng thực tế**, không phải Vietnamese_Embedding_v2

**Hàm này được dùng cho:**
- `embed_query()` → embed query lúc search
- `embed_texts()` → embed chunks lúc ingest PDF
- Chat messages embedding (chat_tasks)

---

### 3. max_seq_length của MiniLM = 128 tokens — Chunk bị truncate NẶNG

| Model | max_seq_length | Dimension |
|-------|---------------|-----------|
| `paraphrase-multilingual-MiniLM-L12-v2` | **128 tokens** | 384 |
| `thanhtantran/Vietnamese_Embedding_v2` | **2048 tokens** | 1024 |
| `AITeamVN/Vietnamese_Embedding_v2` (bge-m3) | **8192 tokens** | 1024 |

**Chunk sizes trong hệ thống:**
- `DOCLING_CHUNK_MAX_TOKENS = 768` (từ `.env`)
- `CHILD_CHUNK_MAX_TOKENS = 384` (hardcoded trong `chunk_splitter.py:18`)
- `CHAT_CHUNK_SIZE = 512` (từ config)

**Với MiniLM (max_seq=128):**
- Parent chunk 768 tokens → **truncate tại token 128** → ~83% nội dung bị mất!
- Child chunk 384 tokens → **truncate tại token 128** → ~67% nội dung bị mất!
- Bảng giá có header + nhiều dòng → chỉ embed được header + 2–3 dòng đầu

**Hậu quả cho bảng giá:**
```
Chunk text (768 tokens):
[tbl_meta ...] Tên dịch vụ | 20' | 40' | 45' | Ghi chú
Phí nâng hạ container | 1.230.000 | 1.835.000 | 1.835.000 | VND
Phí xếp dỡ hàng lẻ | 850.000 | 1.200.000 | 1.200.000 | VND
... (nhiều dòng hơn)

Thực tế MiniLM chỉ encode được ~128 đầu → chỉ header và 1-2 dòng đầu
→ Embedding không represent được toàn bộ giá trị trong bảng
→ Cosine similarity với query "giá nâng hạ 40 foot" thấp hơn ngưỡng 0.35
```

---

### 4. Similarity Score thấp với MiniLM cho tiếng Việt

MiniLM-L12-v2 (`paraphrase-multilingual`) được train chủ yếu trên:
- 50 ngôn ngữ, tiếng Việt có nhưng ít
- Paraphrase task (không phải semantic retrieval)
- Đặc biệt kém với: structured table text, technical/domain-specific Vietnamese terms

**Vietnamese_Embedding_v2** (thanhtantran) được fine-tune từ BGE-M3:
- Train trên corpus tiếng Việt lớn
- Tối ưu cho retrieval task
- Better với domain-specific terms (logistics, port, container)

**Score range thực tế (estimate):**
| Query | Chunk | MiniLM Score | Viet_Embed Score |
|-------|-------|--------------|-----------------|
| "giá nâng hạ 40 foot" | "Phí nâng hạ, 40_foot = 1.835.000 VND" | ~0.20–0.28 | ~0.38–0.55 |
| "bảng giá dịch vụ cảng" | "[tbl_meta ...] Tên dịch vụ ..." | ~0.22–0.30 | ~0.40–0.60 |

→ Với `RAG_SCORE_THRESHOLD=0.35`: MiniLM **bị filter out**, Vietnamese_Embedding_v2 **pass**.

---

### 5. Qdrant Collection — Không Recreate Khi Đổi Model

**File:** `qdrant_setup.py` / `helpers.py` (line 56–64):
```python
def ensure_collections(client: QdrantClient, vector_size: int) -> None:
    collections = client.get_collections().collections
    existing = {collection.name for collection in collections}

    for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai"):
        if name not in existing:   # ← CHỈ tạo nếu chưa có
            client.create_collection(
                collection_name=name,
                vectors_config=qmodels.VectorParams(size=vector_size, ...),
            )
```

**Vấn đề:**
- Collection được tạo lần đầu với dimension 384 (MiniLM)
- Nếu sau đó đổi `EMBEDDING_DIMENSION=1024` trong `.env` → `ensure_collections` không recreate collection!
- Collection vẫn là 384-dim → upsert vector 1024-dim → **Qdrant crash / silent error**

Và ngược lại: nếu collection đang là 1024-dim (từ lần deploy với Vietnamese_Embedding_v2) nhưng code đang dùng MiniLM 384-dim → upsert/search cũng sẽ fail với dimension mismatch error.

**Không có migration logic** — không có code nào check dimension của collection hiện tại vs dimension của model hiện tại.

---

### 6. Re-embedding Khi Đổi Model — Không Có

Không tìm thấy bất kỳ code nào thực hiện:
- Re-embed existing chunks khi model thay đổi
- Version check cho embedding model trong chunk payload
- Bulk re-index trigger

Tức là: **PDF đã upload với model cũ (MiniLM 384-dim) sẽ không được re-embed khi đổi sang Vietnamese_Embedding_v2 (1024-dim)**. Collection cũ vẫn chứa vectors từ không gian embedding khác → search sẽ return nonsense hoặc crash.

---

## Mapping Root Causes → Triệu Chứng

```
Docker default: MiniLM-L12-v2 (384-dim)
.env không set EMBEDDING_MODEL/DIMENSION
       ↓
chat_tasks._get_hf_embed_model() → load MiniLM
DOCLING_CHUNK_MAX_TOKENS=768 tokens của bảng giá
       ↓
MiniLM.encode(chunk, max_seq=128) → truncate 83% nội dung
embed = vector 384-dim chỉ represent 128 tokens đầu
       ↓
Search query "giá nâng hạ 40 foot" → embed_query() → MiniLM
cosine_similarity(query_vec, chunk_vec) ≈ 0.20–0.28
       ↓
RAG_SCORE_THRESHOLD = 0.35 → FILTERED OUT
       ↓
RAG returns 0 chunks → bot: "không tìm thấy thông tin"
```

---

## Root Causes Summary

| # | File | Vấn đề | Impact |
|---|------|---------|--------|
| 🔴 1 | `docker-compose.yml:12–13` | Default EMBEDDING_MODEL=MiniLM, không phải Vietnamese_Embedding_v2 | Critical — wrong model |
| 🔴 2 | `.env` | Không có `EMBEDDING_MODEL` / `EMBEDDING_DIMENSION` → docker fallback về 384/MiniLM | Critical — wrong dimension |
| 🔴 3 | `chat_tasks.py:63` | `_get_hf_embed_model()` default cũng là MiniLM | Critical — wrong model |
| 🟠 4 | `qdrant_setup.py:56` | `ensure_collections` không check/migrate dimension mismatch | High — silent wrong-dim |
| 🟠 5 | MiniLM `max_seq=128` | Chunks 768 tokens → 83% nội dung bị truncate khi embed | High — bad embeddings |
| 🟠 6 | No re-embed logic | Đổi model → cũ vectors vẫn trong Qdrant, wrong space | High — stale vectors |
| 🟡 7 | Score range | MiniLM cosine ~0.20–0.28 cho bảng giá VN < threshold 0.35 | Medium — filtered out |

---

## Fixes cần thực hiện

### Fix #1 — Set đúng model trong `.env` (NGAY BÂY GIỜ)
```env
# Thêm vào .env:
EMBEDDING_MODEL=thanhtantran/Vietnamese_Embedding_v2
EMBEDDING_DIMENSION=1024
EMBEDDER_PROVIDER=huggingface
EMBEDDER_MODEL=thanhtantran/Vietnamese_Embedding_v2
```

### Fix #2 — Update docker-compose.yml default
```yaml
x-common-env: &common-env
  EMBEDDING_MODEL: ${EMBEDDING_MODEL:-thanhtantran/Vietnamese_Embedding_v2}
  EMBEDDING_DIMENSION: ${EMBEDDING_DIMENSION:-1024}
```

### Fix #3 — Update config.py default
```python
embedding_dimension: int = Field(1024, alias="EMBEDDING_DIMENSION")
embedding_model: str = Field("thanhtantran/Vietnamese_Embedding_v2", alias="EMBEDDING_MODEL")
```

### Fix #4 — Recreate Qdrant collections với dimension mới
```bash
# Xóa collections cũ (dimension 384) và tạo lại với 1024
docker exec chatsnp-qdrant curl -X DELETE http://localhost:6333/collections/port_knowledge
docker exec chatsnp-qdrant curl -X DELETE http://localhost:6333/collections/chat_chunks
docker exec chatsnp-qdrant curl -X DELETE http://localhost:6333/collections/mem0_memories
# Sau đó restart backend → ensure_collections tạo lại với dimension=1024
```

### Fix #5 — Re-upload/re-index tất cả PDFs đã upload
Sau khi fix dimension, mọi chunk cũ (384-dim) trong Qdrant đã bị xóa → cần re-upload tất cả tài liệu để re-embed với Vietnamese_Embedding_v2.

### Fix #6 — Thêm dimension validation trong ensure_collections
```python
def ensure_collections(client: QdrantClient, vector_size: int) -> None:
    for name in ("chat_chunks", "port_knowledge", "vanna_schemas_openai"):
        if name in existing:
            # Check existing dimension
            info = client.get_collection(name)
            existing_dim = info.config.params.vectors.size
            if existing_dim != vector_size:
                logger.warning(f"[Qdrant] Collection '{name}' dimension mismatch: {existing_dim} vs {vector_size} — recreating!")
                client.delete_collection(name)
                # Fall through to create new
        if name not in existing or existing_dim_mismatch:
            client.create_collection(...)
```

---

## Kết luận

Model hiện tại đang dùng (thực tế khi chạy Docker) là **MiniLM-L12-v2 (384-dim)** — không phải Vietnamese_Embedding_v2 như thiết kế. Đây là nguyên nhân trực tiếp làm:
1. Bảng giá tiếng Việt bị embed kém (truncate + wrong model)
2. Cosine similarity thấp → bị filter bởi threshold 0.35
3. Kết hợp với các root causes từ `rag-pdf-table-price-not-found.md` → RAG hoàn toàn không hoạt động với PDF bảng giá
