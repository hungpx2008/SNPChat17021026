# Debug: rag-pdf-table-price-not-found

**Date:** 2026-04-18  
**Status:** Root cause identified — multiple contributing factors  
**Severity:** HIGH — core RAG use case broken for table-heavy PDFs

---

## TL;DR

Bot không tìm thấy thông tin giá từ PDF bảng giá do **3 root cause chính**, trong đó **#1 là nghiêm trọng nhất** và có thể block toàn bộ flow Docling ngay từ bước ingestion:

1. **🔴 PDF Fast-Track Bypass** — `pdftotext` extract text thuần (không có bảng) rồi **skip Docling hoàn toàn**, bỏ qua toàn bộ table serializer
2. **🟠 Table Serializer Threshold quá nhỏ** — Bảng giá nhiều cột bị convert sang triplet text khó embed, không khớp semantic với query dạng "giá ... bao nhiêu"
3. **🟡 Child Chunk Splitter cắt ngang bảng** — `[tbl_cell]` markers bị split theo sentence boundary, phá vỡ ngữ cảnh bảng

---

## Chi tiết điều tra

### 1. PDF Fast-Track — `pdftotext` bypass Docling (ROOT CAUSE #1)

**File:** `backend/src/worker/media_tasks.py`, line 139–153

```python
if ext == ".pdf" and os.getenv("PDF_FAST_TEXT_ENABLED", "true").lower() == "true":
    fast_text, fast_pages = _extract_text_from_pdf_fast(file_path)
    if len(fast_text) >= 500:
        extracted_text = fast_text      # ← dùng pdftotext
        # ... skip Docling
        prechunked_chunks = None        # ← KHÔNG có Docling chunks!
```

`_extract_text_from_pdf_fast()` dùng `pdftotext -layout` (poppler). Với PDF text thuần có bảng:
- `pdftotext` extract được text ≥ 500 chars → condition pass
- **Docling KHÔNG được gọi** → `AdaptiveTableSerializer` không chạy
- `prechunked_chunks = None` → fallback về `_smart_chunk()` với chunk_size=512

**Hậu quả:** Bảng giá bị extract thành text dạng column bị misalign:
```
Dịch vụ    20'     40'     45'
Nâng hạ  1.230  1.835  1.835
```
→ Không có `[tbl_cell row_key=... col_key=...]` markers → không có semantic context về "giá" theo loại container

**`pdftotext -layout` với bảng nhiều cột thường ra text như:**
```
Tên dịch vụ                   Đơn vị        20'           40'          45'
Phí nâng hạ container          cont     1.230.000     1.835.000    1.835.000
```
Text này khi chunked thành 512-char chunks sẽ có thể tách dòng tiêu đề ra khỏi data rows.

---

### 2. AdaptiveTableSerializer — Threshold cho Markdown quá nhỏ

**File:** `backend/src/services/docling/table_detector.py`, line 164–166

```python
is_small_table = (
    ncols <= markdown_max_cols       # default: 4
    and data_cells <= markdown_max_cells  # default: 36
)
```

Bảng giá điển hình (SNP): thường có 5–7 cột (Loại hàng, 20', 40', 40'HC, 45', Ghi chú...) và nhiều hàng dịch vụ. Với `markdown_max_cols=4`:

- **Bảng ≥ 5 cột → mode `triplet`** (không phải Markdown)
- Text được serialize thành:
  ```
  [tbl_meta page=1 rows=10 cols=6 mode=triplet]
  [tbl_cell page=1 row=1 col=1 row_key=phi_nang_ha col_key=20_foot] Phí nâng hạ, 20 foot = 1.230.000 VND (norm: 1230000 VND/container). [tbl_cell ...
  ```

**Vấn đề semantic matching:**
- User hỏi: *"giá nâng hạ container 40' là bao nhiêu?"*
- Embedding của query này cần match với text chứa *"Phí nâng hạ, 40_foot = 1.835.000"*
- Triplet text thiếu ngữ cảnh tự nhiên → cosine similarity thấp hơn Markdown format
- Nếu dùng Vietnamese_Embedding_v2, model này tốt với natural sentence, không tốt với encoded key=value syntax

---

### 3. Child Chunk Splitter cắt ngang triplet text

**File:** `backend/src/services/chunk_splitter.py`, line 71

```python
sentences = _SENTENCE_END_RE.split(parent_text)
# _SENTENCE_END_RE = re.compile(r"(?<=[.!?])\s+")
```

Triplet text dùng `. ` (period + space) để nối các cell:
```
[tbl_cell ... row_key=phi_nang_ha col_key=20_foot] Phí nâng hạ, 20 foot = 1.230.000 VND (norm: 1230000 VND/container). [tbl_cell ... row_key=phi_nang_ha col_key=40_foot] Phí nâng hạ, 40 foot = 1.835.000 VND...
```

`_SENTENCE_END_RE` split tại `. ` → **mỗi cell thành 1 "sentence"**. Nếu parent có nhiều cells:
- `CHILD_CHUNK_MAX_TOKENS = 384` → khoảng 5–8 cells/child chunk
- Child chunk chỉ có 5 cells của cùng 1 dịch vụ, thiếu context tiêu đề bảng

**Kết quả:** Child chunk chứa *"Phí nâng hạ, 40 foot = 1.835.000"* nhưng **không có context "bảng giá dịch vụ cảng"** → embedding không đủ mạnh để match query về "giá".

---

### 4. Similarity Threshold & Score

**File:** `backend/src/core/constants.py`
```python
RAG_SCORE_THRESHOLD: float = 0.35
```

Với các vấn đề trên, child chunk từ triplet text thường chỉ đạt cosine ~0.25–0.35 với query về giá → bị filter bởi threshold.

Trong fallback semantic search (`search_helpers.py`, line 357):
```python
if score < RAG_SCORE_THRESHOLD:
    continue
```
→ Chunk bị loại ngay.

---

### 5. Qdrant Filter — Điều kiện `should` không có fallback

**File:** `backend/src/worker/rag/search_helpers.py`, line 283–305

```python
should_conditions = []
if user_id:
    should_conditions.append(FieldCondition(key="user_id", ...))
if department:
    should_conditions.append(...)

if should_conditions:
    return Filter(should=should_conditions, must_not=must_not_conditions)
return Filter(must_not=must_not_conditions)  # ← chỉ quality filter
```

Nếu `user_id` trong payload của chunk (lúc index) khác với `user_id` khi query (format khác, case khác, etc.) → should_conditions không match → **chunk bị filter out hoàn toàn**.

---

## Flow tóm tắt (PDF text thuần có bảng)

```
Upload PDF
  ↓
process_document() task
  ↓
PDF_FAST_TEXT_ENABLED=true (default)
  ↓
pdftotext -layout → ≥500 chars? → YES (text PDF)
  ↓
[SKIP DOCLING] prechunked_chunks = None
  ↓
_smart_chunk(text, 512, 50)  ← flat chunks, no table structure
  ↓
embed_texts() → Qdrant
  ↓
Chat query: "giá X là bao nhiêu?"
  ↓
embed query → semantic search
  ↓
chunk text = "Phí nâng hạ 1.230.000 1.835.000 1.835.000" (flat, no context)
cosine similarity thấp (~0.25-0.30)
  ↓
score < 0.35 → bị filter
  ↓
Hybrid returns 0 → fallback semantic → cũng 0
  ↓
Bot: "không tìm thấy thông tin"
```

---

## Root Causes Summary

| # | Vị trí | Vấn đề | Impact |
|---|--------|---------|--------|
| 🔴 1 | `media_tasks.py:139` | `PDF_FAST_TEXT_ENABLED=true` bypass Docling table parsing | Critical — blocks cả pipeline |
| 🟠 2 | `table_detector.py:164` | `markdown_max_cols=4` quá nhỏ → bảng giá SNP thường 5-7 cols → triplet mode | High |
| 🟠 3 | `chunk_splitter.py:71` | Sentence splitter dùng `. ` cắt ngang triplet cell text | High |
| 🟡 4 | `constants.py:9` | `RAG_SCORE_THRESHOLD=0.35` filter out chunk score thấp do representation kém | Medium |
| 🟡 5 | `search_helpers.py:283` | Qdrant filter `should` với user_id — mismatch có thể block toàn bộ | Medium |

---

## Suggested Fixes (chưa implement)

### Fix #1 — Disable fast-track cho PDF có bảng (hoặc force Docling)
```python
# Option A: Disable fast-track
os.environ["PDF_FAST_TEXT_ENABLED"] = "false"

# Option B: Detect nếu pdftotext text có "bảng-like" pattern thì vẫn dùng Docling
# (nhiều whitespace alignment → likely table layout)
```

### Fix #2 — Tăng markdown_max_cols
```env
DOCLING_TABLE_MARKDOWN_MAX_COLS=8    # từ 4 lên 8
DOCLING_TABLE_MARKDOWN_MAX_CELLS=80  # từ 36 lên 80
```
→ Bảng giá SNP thường ≤ 7 cột sẽ được render as Markdown (đọc được hơn), embedding tốt hơn.

### Fix #3 — Đừng split triplet text bằng sentence boundary
Trong `chunk_splitter.py`: detect nếu text chứa `[tbl_cell` → không split, giữ nguyên parent.

### Fix #4 — Hạ threshold hoặc dùng dynamic threshold
```python
RAG_SCORE_THRESHOLD: float = 0.25   # từ 0.35 xuống 0.25
```

### Fix #5 — Thêm content-based field vào Qdrant payload
Thêm `"content"` field vào payload khi upsert (hiện tại chỉ có `"text"`) để `_fallback_semantic_search` có thể read đúng.

> **Lưu ý:** `_fallback_semantic_search` đọc `payload.get("content", "")` nhưng `_do_full_processing` write `"text"` field — content sẽ luôn empty string trong fallback!

---

## Bonus Bug: `content` vs `text` field mismatch

**File:** `media_tasks.py`, line 418: payload dùng key `"text"`
**File:** `search_helpers.py`, line 368: fallback đọc `payload.get("content", "")` → luôn trả về empty!

Tức là nếu chỉ fallback semantic search được dùng (không qua hybrid), `result.content = ""` → bot không có context dù vector match đúng. Đây là **bug riêng biệt** nhưng có thể cũng contribute vào vấn đề.

Check hybrid path: `hybrid_search.py`, line 286: đọc `payload.get("content", "")` → cũng empty! Semantic results luôn có `content = ""`.

**Actual content được lấy từ đâu?** → Từ Whoosh lexical index (`lexical_search.py`) hoặc từ parent chunk PostgreSQL lookup. Nếu lexical search miss và không có parent_id → content rỗng.

---

## Files cần xem xét để fix

1. `backend/src/worker/media_tasks.py` — PDF fast-track logic
2. `backend/src/services/docling/table_detector.py` — markdown_max_cols threshold
3. `backend/src/services/chunk_splitter.py` — sentence splitter for triplet text
4. `backend/src/services/search/hybrid_search.py` — content field vs text field
5. `backend/src/worker/rag/search_helpers.py` — fallback content field
6. `backend/src/core/constants.py` — RAG_SCORE_THRESHOLD
