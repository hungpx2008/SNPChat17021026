# RAG Embedding Performance Tradeoffs — ChatSNP

**Date:** 2026-04-18  
**Scope:** Điều tra embedding model selection cho RAG pipeline  
**Status:** Analysis complete, recommendation ready

---

## 1. Spec Máy Chủ & Resource Constraints

### Docker Compose Resource Limits
**Kết quả:** KHÔNG có `mem_limit`, `cpus`, hay `deploy.resources` nào được set trong cả `docker-compose.yml` lẫn `docker-compose.pro.yml`.

- Tất cả containers chạy với **unlimited** memory/CPU theo Docker defaults
- Worker services: `worker_chat` (-c 2 concurrency), `worker_data` (-c 2 concurrency)
- Không có resource guardrails → model nặng có thể OOM bất cứ lúc nào

### Embedding Config Hiện Tại
```
# config.py defaults (fallback nếu .env không set)
embedding_model  = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
embedding_dimension = 384
embedding_device = "cpu"

# .env (KHÔNG có EMBEDDING_MODEL hay EMBEDDING_DIMENSION được set!)
# → System đang dùng MiniLM-L12 (384-dim) theo default
# Nhưng comment trong .env nói "Vietnamese_Embedding_v2 (max_seq=2048)"
# → Đây là DISCREPANCY: comment và code không khớp nhau
```

**⚠️ Phát hiện quan trọng:** `.env` KHÔNG set `EMBEDDING_MODEL` hay `EMBEDDING_DIMENSION`. Code fallback về MiniLM-L12 (384 dim). Comment trong `.env` chỉ là ghi chú kế hoạch, chưa implement.

### Chunk Config
```
DOCLING_CHUNK_MAX_TOKENS=768   # Đang truncate 83% với MiniLM (max_seq=128)
DOCLING_GROUP_LOCK_MAX_CHARS=2800  # ≈ 768 tokens Vietnamese
```

---

## 2. Vietnamese_Embedding_v2 Resource Profile

**Model:** `AITeamVN/Vietnamese_Embedding_v2`  
**Base:** `BAAI/bge-m3` (multilingual, top-tier retrieval)

| Metric | Value | Source |
|--------|-------|--------|
| Model size (disk) | ~570 MB | bge-m3 base weights |
| RAM khi loaded | ~1.5–2.0 GB | Typical bge-m3 on CPU (fp32) |
| Dimension | 1024 | `qdrant_setup.py` comment, STACK.md |
| max_seq_length | **2048 tokens** | `.env` comment: "max_seq=2048 tokens" |
| Inference time (CPU, batch=1) | ~80–150ms | bge-m3 CPU estimate |
| Inference time (CPU, batch=32) | ~1.5–3s | Amortized |

**Comment trong `chat_tasks.py`:**
```python
# Loading ~1.3 GB model once per worker process instead of once per request.
```
→ Note này có thể đã viết khi plan dùng Vietnamese_Embedding_v2, vì MiniLM thực tế chỉ ~120 MB.

**Vấn đề với Vietnamese_Embedding_v2 trên máy yếu:**
- 2 worker processes × ~2 GB RAM = **~4 GB RAM chỉ riêng embedding**
- CPU inference chậm hơn MiniLM ~5–8× do model lớn hơn
- Cold start (lần đầu load) mất 10–30s

---

## 3. Model Thay Thế Phù Hợp

### Models được mention trong codebase
- `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` — default trong `config.py` và `mem0_local.py`
- `AITeamVN/Vietnamese_Embedding_v2` — planned model, comment trong `.env`, `vanna_setup.py`, `qdrant_setup.py`

### So sánh đầy đủ

| Model | RAM Load | Disk | Dim | max_seq | Vi Quality | Inference (CPU/1) | Notes |
|-------|----------|------|-----|---------|------------|-------------------|-------|
| **MiniLM-L12** (hiện tại) | ~300 MB | ~120 MB | 384 | **128** | ★★☆ | ~5ms | Truncate 83% ở 768-token chunks |
| **Vietnamese_Embedding_v2** | ~1.5-2 GB | ~570 MB | 1024 | **2048** | ★★★ | ~120ms | BGE-M3 base, top quality |
| **paraphrase-multilingual-mpnet-base-v2** | ~420 MB | ~280 MB | 768 | **514** | ★★☆ | ~20ms | Tốt hơn MiniLM, không Vi-specific |
| **intfloat/multilingual-e5-small** | ~120 MB | ~120 MB | 384 | **512** | ★★☆ | ~8ms | **Best bang/buck** — nhẹ, max_seq=512 |
| **intfloat/multilingual-e5-base** | ~280 MB | ~278 MB | 768 | **512** | ★★★ | ~25ms | Cân bằng tốt, Vi reasonably good |
| **BAAI/bge-small-en-v1.5** | ~120 MB | ~133 MB | 384 | 512 | ★☆☆ | ~8ms | English only, không dùng |
| **sentence-transformers/LaBSE** | ~1.8 GB | ~471 MB | 768 | 512 | ★★★ | ~45ms | 109 ngôn ngữ, Vi excellent |
| **keepitreal/vietnamese-sbert** | ~480 MB | ~420 MB | 768 | **256** | ★★★ | ~20ms | Vi-native nhưng max_seq thấp |

---

## 4. Chunk Size — Tính Toán Tối Ưu

### Vấn đề hiện tại: MiniLM + chunk 768 tokens
```
MiniLM max_seq_length = 128 tokens (WordPiece/BPE)
DOCLING_CHUNK_MAX_TOKENS = 768 "Docling tokens" (≈ words/subwords)

Docling tokens ≠ BPE tokens của sentence-transformers
Tỷ lệ: Vietnamese text, ~1 Docling token ≈ 1.0–1.5 BPE tokens
→ 768 Docling tokens ≈ 768–1150 BPE tokens
→ MiniLM truncate ở 128 → chỉ giữ ~11–17% content!
→ Phần đầu chunk được embed, phần cuối bị bỏ hoàn toàn
```

### Chunk size tối ưu theo model

| Model | max_seq (BPE) | Docling tokens tương đương | Recommended CHUNK_MAX_TOKENS |
|-------|--------------|---------------------------|------------------------------|
| MiniLM-L12 | 128 | ~85–100 | **80–100** (đang set 768 = sai!) |
| multilingual-e5-small/base | 512 | ~340–400 | **300–400** |
| Vietnamese_Embedding_v2 | 2048 | ~1300–1500 | **768–1200** (phù hợp setting hiện tại) |
| LaBSE | 512 | ~340–400 | **300–400** |

**Kết luận:** Với MiniLM, cần giảm `DOCLING_CHUNK_MAX_TOKENS` xuống **≤100** để không truncate. Hoặc đổi model.

---

## 5. Quantization & Optimization Options

### Hiện tại
```python
# chat_tasks.py
_hf_embed_model = SentenceTransformer(model_name)
# Không có:
# - device="cuda" (đúng vì CPU server)
# - model_kwargs={"torch_dtype": torch.float16}  ← KHÔNG dùng
# - batch_size tuning
# - quantization
```

**`embedding_device = "cpu"`** được set trong config — đúng.

### Các option có thể add

```python
# Option 1: Half-precision (giảm RAM 50%, inference nhanh hơn ~30% trên CPU AVX)
SentenceTransformer(model_name, model_kwargs={"torch_dtype": "float16"})

# Option 2: INT8 quantization (giảm RAM ~75%, inference nhanh 2–4×, quality giảm nhẹ)
from optimum.onnxruntime import ORTModelForFeatureExtraction
# Cần convert model trước

# Option 3: Batch tuning khi index documents
model.encode(texts, batch_size=16, show_progress_bar=False)  # Tăng throughput

# Option 4: ONNX export (CPU inference 2–3× nhanh hơn PyTorch)
# sentence-transformers hỗ trợ ONNX backend
```

**Hiện tại `embed_texts()` KHÔNG set `batch_size`** → dùng default (32), có thể điều chỉnh theo RAM.

---

## 6. Git Log — Lý Do Chọn Model

```
ea6e6a8 Merge branch 'feature/unified-embedding-ux-overhaul'
9a577a3 feat(docling): increase default chunk size to 2048 tokens for parent-child model
```

`feature/unified-embedding-ux-overhaul` → tên branch gợi ý đã có lần migration embedding trước.  
`increase default chunk size to 2048` → chunk tăng lên để match với Vietnamese_Embedding_v2 (max_seq=2048) nhưng chưa thực sự switch model.

**Kết luận:** Có kế hoạch dùng Vietnamese_Embedding_v2 (viết comment, đặt chunk 768) nhưng chưa set EMBEDDING_MODEL trong `.env` → **system vẫn đang chạy MiniLM với chunk 768, truncate ~88%**.

---

## 7. Recommendation

### Tình huống A: Máy chủ RAM ≤ 4 GB

**→ Dùng `intfloat/multilingual-e5-base`**

```env
EMBEDDING_MODEL=intfloat/multilingual-e5-base
EMBEDDING_DIMENSION=768
DOCLING_CHUNK_MAX_TOKENS=350
DOCLING_GROUP_LOCK_MAX_CHARS=1400
```

Lý do:
- RAM: ~280 MB/worker (2 workers = 560 MB total) ✅
- max_seq: 512 → chunk 350 Docling tokens vừa khít, không truncate ✅
- Vietnamese quality: tốt (multilingual-e5 train trên 100+ ngôn ngữ, Vi included) ✅
- Dimension 768 (nhỏ hơn 1024, tiết kiệm Qdrant storage ~25%) ✅
- **Lưu ý:** Phải re-index toàn bộ Qdrant khi đổi model (dimension thay đổi từ 384 → 768)

### Tình huống B: Máy chủ RAM 8 GB+

**→ Upgrade lên `AITeamVN/Vietnamese_Embedding_v2`** (như đã plan)

```env
EMBEDDING_MODEL=AITeamVN/Vietnamese_Embedding_v2
EMBEDDING_DIMENSION=1024
DOCLING_CHUNK_MAX_TOKENS=768   # Giữ nguyên, phù hợp với max_seq=2048
DOCLING_GROUP_LOCK_MAX_CHARS=2800  # Giữ nguyên
```

Lý do:
- Vietnamese-specific tuning → accuracy tốt nhất cho tiếng Việt ✅
- max_seq 2048 → chunk 768 Docling tokens không bị truncate ✅
- RAM: ~2 GB/worker × 2 workers = 4 GB → cần còn ~4 GB cho các services khác

### Tình huống C: Fix ngay không đổi model (quick win)

**→ Giữ MiniLM, giảm chunk xuống 100 tokens**

```env
DOCLING_CHUNK_MAX_TOKENS=100
DOCLING_GROUP_LOCK_MAX_CHARS=400
```

Lý do: Loại bỏ truncation ngay với zero infrastructure change. Tuy nhiên chunk nhỏ → nhiều chunk hơn → index chậm hơn.

---

## 8. Bảng So Sánh Cuối Cùng

| Model | RAM (2 workers) | Vi Quality | max_seq | Dim | Chunk khuyến nghị | Recommendation |
|-------|----------------|------------|---------|-----|-------------------|----------------|
| MiniLM-L12 *(hiện tại)* | ~600 MB | ★★☆ | 128 | 384 | ≤100 tokens | ❌ Truncate nghiêm trọng nếu chunk 768 |
| **multilingual-e5-small** | ~240 MB | ★★☆ | 512 | 384 | 300–350 | ✅ Máy yếu nhất, nhẹ + đủ dùng |
| **multilingual-e5-base** | ~560 MB | ★★★ | 512 | 768 | 300–350 | ✅✅ **BEST cho máy ≤4 GB RAM** |
| **LaBSE** | ~3.6 GB | ★★★ | 512 | 768 | 300–350 | ⚠️ RAM nặng, Vi tốt |
| **Vietnamese_Embedding_v2** | ~3–4 GB | ★★★ | 2048 | 1024 | 600–768 | ✅✅ **BEST quality, cần ≥8 GB RAM** |

---

## 9. Action Items

- [ ] **Ngay lập tức:** Xác định RAM thực tế máy chủ (`free -h` hoặc `docker stats`)
- [ ] Chọn model theo tình huống A hoặc B ở trên
- [ ] Set `EMBEDDING_MODEL` và `EMBEDDING_DIMENSION` trong `.env`
- [ ] Điều chỉnh `DOCLING_CHUNK_MAX_TOKENS` tương ứng
- [ ] Re-index toàn bộ documents trong Qdrant (bắt buộc khi đổi dimension)
- [ ] (Optional) Add `batch_size=16` vào `embed_texts()` để tăng throughput khi indexing
- [ ] (Optional) Thêm resource limits vào `docker-compose.yml` để tránh OOM không kiểm soát

---

*Generated: 2026-04-18 | ChatSNP RAG Embedding Analysis*
