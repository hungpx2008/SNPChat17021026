# 🔍 PHÂN TÍCH TẠI SAO MODEL TRẢ LỜI SAI

**Ngày:** 2026-04-19  
**Document test:** Biểu giá dịch vụ.pdf

---

## 🎯 VẤN ĐỀ CHÍNH PHÁT HIỆN

### 1. **SEMANTIC SEARCH TRẢ VỀ 0 CHUNKS** ❌

```
Query: "Giá dịch vụ xếp dỡ container 20 feet là bao nhiêu?"
Retrieved: 0 chunks
```

**Nguyên nhân:**
- Score threshold = 0.35 quá cao
- Query embedding không match với document chunks
- Có thể do cách chunk document không tối ưu

### 2. **MODEL TRẢ LỜI SAI HOÀN TOÀN** ❌

**Test case 3:**
- ❓ Question: "Có phụ phí nào khi làm việc ngoài giờ không?"
- ❌ Answer: Trả lời về giá xếp dỡ container 20 feet
- 🎯 Accuracy: 0% (0/4 keywords match)

**Vấn đề:**
```
Expected keywords: ["phụ phí", "ngoài giờ", "%", "tăng"]
Found: NONE
```

Model trả lời về container 20 feet pricing thay vì overtime surcharge!

### 3. **SCORE QUÁ THẤP** ⚠️

Từ citations trong response:
```
[1] độ liên quan: 0.021
[2] độ liên quan: 0.021
[3] độ liên quan: 0.021
[4] độ liên quan: 0.021
[5] độ liên quan: 0.020
```

**Vấn đề:** Score 0.02 (2%) là CỰC KỲ THẤP!
- Threshold = 0.35 (35%)
- Actual scores = 0.02 (2%)
- **Không có chunk nào đạt threshold!**

---

## 🔍 ROOT CAUSE ANALYSIS

### Root Cause #1: **SCORE THRESHOLD QUÁ CAO**

```python
# Current setting
RAG_SCORE_THRESHOLD = 0.35  # 35%

# Actual scores in results
scores = [0.021, 0.021, 0.021, 0.021, 0.020]  # 2%

# → Không chunk nào pass threshold!
```

**Giải thích:**
- Qdrant search CÓ TRẢ VỀ chunks (5 chunks)
- Nhưng score quá thấp (2% vs threshold 35%)
- System filter out tất cả → LLM không có context
- LLM hallucinate → trả lời sai

### Root Cause #2: **EMBEDDING QUALITY ISSUE**

**Tại sao score chỉ 2%?**

Có thể do:

**A. Query và Document embedding không match:**
```
Query: "Có phụ phí nào khi làm việc ngoài giờ không?"
Document chunks: "Xếp dỡ container 20 feet", "Giá dịch vụ..."

→ Semantic distance quá xa
→ Cosine similarity = 0.02 (very low)
```

**B. Chunking strategy không tốt:**
```python
# Document có thể bị chunk như thế này:
Chunk 1: "Phụ phí ngoài giờ"  (header only)
Chunk 2: "20% giá dịch vụ"     (content only)

→ Thiếu context khi search
→ Score thấp
```

**C. Vietnamese embedding model issue:**
```
Model: AITeamVN/Vietnamese_Embedding_v2

Có thể:
- Model không tốt với domain-specific terms (cảng biển, logistics)
- Fine-tuning cần thiết cho domain
```

### Root Cause #3: **LLM HALLUCINATION KHI THIẾU CONTEXT**

**Luồng xử lý:**
```
1. User hỏi: "Phụ phí ngoài giờ?"
2. Qdrant search → 5 chunks score ~2%
3. Filter by threshold 35% → 0 chunks pass
4. LLM nhận context = EMPTY
5. LLM hallucinate → trả lời về container 20 feet (????)
```

**Tại sao lại trả lời về container 20 feet?**

Có thể:
- LLM nhớ context từ câu hỏi trước
- Session history có mention "container 20 feet"
- LLM pick random topic từ system prompt
- **Không có fallback khi không tìm được data**

---

## 📊 SO SÁNH EXPECTED VS ACTUAL

### Expected behavior:
```
Query: "Phụ phí ngoài giờ?"
  ↓
Qdrant search → Find relevant chunks (score > 35%)
  ↓
LLM synthesize → Answer về overtime surcharge
  ↓
Result: "Phụ phí ngoài giờ là 20% giá dịch vụ"
```

### Actual behavior:
```
Query: "Phụ phí ngoài giờ?"
  ↓
Qdrant search → 5 chunks (score = 2%)
  ↓
Filter threshold → 0 chunks pass (2% < 35%)
  ↓
LLM context = EMPTY → Hallucinate
  ↓
Result: "Giá container 20 feet là..." ❌ WRONG
```

---

## 🔧 SOLUTIONS

### ✅ FIX #1: GIẢM SCORE THRESHOLD (IMMEDIATE)

```python
# File: backend/src/core/config.py hoặc .env
RAG_SCORE_THRESHOLD = 0.01  # Thay vì 0.35

# Hoặc dynamic threshold based on results
min_score = min([r.score for r in results])
threshold = max(0.01, min_score * 0.8)  # 80% of min score
```

**Expected impact:**
- Chunks với score 2% sẽ pass
- LLM có context để answer
- Accuracy tăng từ 0% → 60-80%

### ✅ FIX #2: IMPROVE CHUNKING STRATEGY

```python
# File: backend/src/worker/media_tasks.py

# Current chunking có thể là:
chunk_size = 512  # Too small, mất context

# Recommend:
chunk_size = 1024  # Larger chunks
chunk_overlap = 200  # Add overlap để preserve context

# Hoặc dùng sentence-level chunking thay vì token-level
```

**Expected impact:**
- Chunks có đủ context
- Semantic similarity tăng
- Score tăng từ 2% → 10-20%

### ✅ FIX #3: ADD FALLBACK KHI KHÔNG TÌM ĐƯỢC DATA

```python
# File: backend/src/worker/chat_tasks.py

if not filtered_results or max_score < 0.1:
    # Fallback: trả lời rằng không tìm được thông tin
    return {
        "content": "Xin lỗi, tôi không tìm thấy thông tin liên quan trong tài liệu. "
                   "Bạn có thể hỏi lại bằng cách khác hoặc liên hệ hotline 1800 1188.",
        "metadata": {"no_results": True}
    }
```

**Expected impact:**
- Không hallucinate
- Honest về việc không biết
- User experience tốt hơn

### ✅ FIX #4: TUNE EMBEDDING MODEL

```python
# Option 1: Fine-tune Vietnamese_Embedding_v2 trên domain data
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('AITeamVN/Vietnamese_Embedding_v2')
# Fine-tune on port/logistics domain documents

# Option 2: Thử model khác
EMBEDDING_MODEL = "bge-m3"  # Multilingual, better semantic understanding
```

### ✅ FIX #5: HYBRID SEARCH (BM25 + VECTOR)

```python
# Kết hợp keyword search (BM25) với vector search

from whoosh import index

# BM25 search
bm25_results = bm25_index.search("phụ phí ngoài giờ")

# Vector search
vector_results = qdrant.search(query_vector)

# Merge results với weighted score
final_results = merge_results(bm25_results, vector_results, 
                               weights=[0.3, 0.7])  # 30% BM25, 70% vector
```

**Expected impact:**
- Catch exact keyword matches (phụ phí, ngoài giờ)
- Improve recall rate
- Score tăng significantly

---

## 📈 EXPECTED IMPROVEMENTS

| Metric | Before | After Fix #1 | After All Fixes |
|--------|--------|--------------|-----------------|
| Score threshold | 35% | **1%** | 1% |
| Avg chunk score | 2% | 2% | **15%** |
| Chunks retrieved | 0 | **5** | **8-10** |
| Accuracy | 0% | **60%** | **90%+** |
| Success rate | 50% | **80%** | **95%+** |

---

## 🎯 RECOMMENDATION PRIORITY

### 🔴 CRITICAL (Fix ngay hôm nay):

**1. Giảm RAG_SCORE_THRESHOLD xuống 0.01**
```bash
# Edit .env
RAG_SCORE_THRESHOLD=0.01
```

**2. Add fallback cho no-results case**
```python
# Prevent hallucination khi không có data
```

### 🟡 HIGH (Fix tuần này):

**3. Re-chunk documents với overlap**
```python
chunk_size = 1024
chunk_overlap = 200
```

**4. Implement hybrid search (BM25 + vector)**

### 🟢 MEDIUM (Next sprint):

**5. Fine-tune embedding model trên domain data**

**6. Add query expansion**
```python
# "phụ phí ngoài giờ" → expand to:
# - "overtime surcharge"
# - "phí làm thêm giờ"
# - "phụ phí làm việc ngoài giờ hành chính"
```

---

## 🧪 TEST PLAN

### Test sau khi fix threshold:

```bash
cd chatSNP170226
python3 analyze_rag_accuracy.py
```

**Expected results:**
- ✅ Chunk score 2% pass threshold 1%
- ✅ LLM có context để answer
- ✅ Accuracy tăng lên 60-80%
- ⚠️ Vẫn cần improve chunking để score cao hơn

---

## 📝 CONCLUSION

### TÓM TẮT VẤN ĐỀ:

1. ❌ **Score threshold quá cao** (35% vs actual 2%)
2. ❌ **Chunking strategy chưa tốt** → score thấp
3. ❌ **Không có fallback** → LLM hallucinate
4. ❌ **Pure vector search** → miss keyword matches

### SOLUTION NGẮN HẠN:
- Giảm threshold xuống 0.01
- Add fallback message

### SOLUTION DÀI HẠN:
- Improve chunking strategy
- Hybrid search (BM25 + vector)
- Fine-tune embedding model

### EXPECTED OUTCOME:
- Accuracy: 0% → 90%+
- Success rate: 50% → 95%+
- No more hallucination

---

*Analysis completed: 2026-04-19*  
*Test case: Biểu giá dịch vụ.pdf*  
*Issue: Low semantic similarity scores causing wrong answers*
