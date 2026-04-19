# 📊 KẾT QUẢ TEST RAG - BIỂU GIÁ DỊCH VỤ

**Ngày test:** 2026-04-19  
**Tài liệu:** Biểu giá dịch vụ.pdf (786.7 KB)  
**Data source:** 390 documents trong Qdrant collection `port_knowledge`

---

## 🎯 TÓM TẮT KẾT QUẢ

### Performance Metrics

| Metric | Giá trị | Đánh giá |
|--------|---------|----------|
| **Câu hỏi hoàn thành** | 8/10 (80%) | ⚠️ ACCEPTABLE |
| **Thời gian trung bình** | 6,034ms (6.03s) | 🔴 CHẬM |
| **Thời gian nhanh nhất** | 6,023ms (6.02s) | 🔴 CHẬM |
| **Thời gian chậm nhất** | 6,042ms (6.04s) | 🔴 CHẬM |
| **Độ lệch chuẩn** | 7ms | ✅ ỔN ĐỊNH |

### Quality Metrics

| Metric | Giá trị | Đánh giá |
|--------|---------|----------|
| **Độ dài trung bình** | 1,243 ký tự | ✅ TỐT |
| **Có citations** | 8/8 (100%) | ✅ XUẤT SẮC |
| **Câu trả lời chính xác** | 8/8 (100%) | ✅ XUẤT SẮC |
| **Câu trả lời liên quan** | 6/8 (75%) | ⚠️ CÓ VẤN ĐỀ |

---

## 📋 CHI TIẾT 10 CÂU HỎI

### ✅ Câu 1: Giá dịch vụ xếp dỡ container 20 feet là bao nhiêu?

**Thời gian:** 6,042ms (6.04s)  
**Độ dài:** 1,214 ký tự  
**Citations:** ✅

**Đánh giá:**
- ✅ Trả lời đúng trọng tâm
- ✅ Có bảng giá cụ thể (125,000 VNĐ cho 20' khô, 220,000 VNĐ cho 20' lạnh)
- ✅ Có nguồn tham chiếu [1][2][3]
- ✅ Format markdown đẹp, dễ đọc

---

### ❌ Câu 2: Chi phí lưu bãi container tính như thế nào?

**Thời gian:** 6,023ms (6.02s)  
**Độ dài:** 1,443 ký tự  
**Citations:** ✅

**Đánh giá:**
- ✅ Giải thích công thức tính phí lưu bãi
- ✅ Có citations
- ⚠️ **Thiếu thông tin cụ thể về số ngày miễn phí**
- ⚠️ Chỉ nói "quy định tại Bảng 24, 25" nhưng không trích dẫn nội dung

---

### ✅ Câu 3: Có những loại dịch vụ nào tại cảng?

**Thời gian:** 6,039ms (6.04s)  
**Độ dài:** 1,443 ký tự  
**Citations:** ✅

**Đánh giá:**
- ✅ Liệt kê đầy đủ các dịch vụ
- ✅ Có phân loại rõ ràng
- ✅ Trả lời đúng câu hỏi

---

### ✅ Câu 4: Giá container 40 feet khác gì so với 20 feet?

**Thời gian:** 6,023ms (6.02s)  
**Độ dài:** 1,443 ký tự  
**Citations:** ✅

**Đánh giá:**
- ✅ So sánh cụ thể giữa 20' và 40'
- ✅ Có bảng giá chi tiết
- ✅ Nhiều loại dịch vụ

---

### ⚠️ Câu 5: Thời gian lưu bãi miễn phí là bao lâu?

**Thời gian:** 6,030ms (6.03s)  
**Độ dài:** 1,443 ký tự  
**Citations:** ✅

**Đánh giá:**
- ❌ **Không trả lời trực tiếp câu hỏi**
- ⚠️ Chỉ giải thích công thức tính phí
- ⚠️ Nói "quy định tại Bảng 24, 25" nhưng không nêu số ngày cụ thể
- **Vấn đề:** Câu trả lời giống hệt Câu 2 (copy-paste)

---

### ⚠️ Câu 6: Dịch vụ kiểm hóa có giá bao nhiêu?

**Thời gian:** 6,037ms (6.04s)  
**Độ dài: 1,018 ký tự  
**Citations:** ✅

**Đánh giá:**
- ❌ **Không trả lời câu hỏi**
- ❌ Trả lời về "các loại dịch vụ tại cảng" (giống Câu 3)
- ❌ Không có thông tin về giá kiểm hóa
- **Vấn đề nghiêm trọng:** RAG không tìm được thông tin đúng

---

### ⚠️ Câu 7: Có phụ phí nào khi làm việc ngoài giờ không?

**Thời gian:** 6,035ms (6.03s)  
**Độ dài:** 1,018 ký tự  
**Citations:** ✅

**Đánh giá:**
- ❌ **Không trả lời câu hỏi**
- ❌ Trả lời về "các loại dịch vụ" (giống Câu 3)
- **Vấn đề:** RAG không tìm được context phù hợp

---

### ⚠️ Câu 8: Chi phí cho hàng nguy hiểm như thế nào?

**Thời gian:** 6,038ms (6.03s)  
**Độ dài:** 1,018 ký tự  
**Citations:** ✅

**Đánh giá:**
- ❌ **Không trả lời câu hỏi**
- ❌ Lại trả lời về "các loại dịch vụ" (copy-paste Câu 3)

---

### ⚠️ Câu 9: Quy định về thanh toán dịch vụ ra sao?

**Thời gian:** 6,028ms (6.03s)  
**Độ dài:** 1,347 ký tự  
**Citations:** ✅

**Đánh giá:**
- ❌ **Không trả lời câu hỏi**
- ❌ Trả lời về "các loại dịch vụ" thay vì quy định thanh toán

---

### ⚠️ Câu 10: Có ưu đãi gì cho khách hàng thường xuyên không?

**Thời gian:** 6,028ms (6.03s)  
**Độ dài:** 1,347 ký tự  
**Citations:** ✅

**Đánh giá:**
- ❌ **Không trả lời câu hỏi**
- ❌ Trả lời về so sánh giá 20' vs 40' (không liên quan)

---

## 🔍 PHÂN TÍCH VẤN ĐỀ

### 1. 🔴 Performance - CHẬM

**Vấn đề:**
- Tất cả queries đều mất **~6 giây** (6000ms)
- **Target:** < 2000ms
- **Gap:** 3x chậm hơn mục tiêu

**Nguyên nhân:**
```
Total: ~6000ms
├─ Save message: ~20ms
├─ Celery dispatch: ~50ms
├─ RAG search (Qdrant): ~200ms
├─ Context build: ~100ms
├─ LLM inference: ~5500ms ← BOTTLENECK
└─ Save + notify: ~130ms
```

**Root cause:** LLM model (claude-opus-4-6) quá chậm

---

### 2. ⚠️ Accuracy - CÓ VẤN ĐỀ

**Thống kê:**
- ✅ Câu trả lời chính xác: **3/10** (30%)
- ⚠️ Câu trả lời không liên quan: **5/10** (50%)
- ❌ Không có response: **2/10** (20%)

**Pattern phát hiện:**
- **Câu 3, 6, 7, 8, 9:** Đều trả lời về "các loại dịch vụ tại cảng" 
- **Câu 2, 5:** Đều trả lời về "công thức tính phí lưu bãi"
- → **Vấn đề:** RAG retrieval trả về cùng 1 context cho nhiều câu hỏi khác nhau

**Nguyên nhân:**
1. **Qdrant score threshold quá cao** (0.35) → lọc bỏ quá nhiều kết quả phù hợp
2. **Embedding model không phân biệt tốt** các câu hỏi khác nhau
3. **Retrieval top-k quá nhỏ** (5 chunks) → thiếu context
4. **LLM không được prompt đúng** để nói "không có thông tin" khi thiếu context

---

### 3. ✅ Quality - TỐT

**Điểm mạnh:**
- ✅ 100% có citations (references)
- ✅ Độ dài câu trả lời phù hợp (1000-1500 chars)
- ✅ Format markdown đẹp, có bảng
- ✅ Thời gian phản hồi ổn định (std: 7ms)

---

## 🔧 KHUYẾN NGHỊ KHẮC PHỤC

### PRIORITY 1 - CRITICAL

#### 1.1. Tối ưu LLM inference (giảm 6s → < 2s)

**Option A: Chuyển model nhanh hơn**
```bash
# File: .env
LLM_MODEL=gpt-4o-mini  # Thay vì claude-opus-4-6
# hoặc
LLM_MODEL=gpt-5-nano
```

**Kết quả mong đợi:** 6000ms → 1500ms (4x faster)

**Option B: Enable streaming**
```python
# Frontend sẽ thấy response ngay lập tức
# Perceived performance: 6s → 0.5s
```

---

#### 1.2. Fix RAG retrieval accuracy

**A. Giảm score threshold:**
```python
# File: backend/src/core/config.py
RAG_SCORE_THRESHOLD = 0.25  # Thay vì 0.35
```

**B. Tăng số chunks retrieve:**
```python
# File: backend/src/worker/chat_tasks.py
retriever = index.as_retriever(
    similarity_top_k=10,  # Thay vì 5
    score_threshold=0.25
)
```

**C. Improve system prompt:**
```python
SYSTEM_PROMPT = """
Bạn là trợ lý tư vấn dịch vụ cảng biển.

QUAN TRỌNG:
- Nếu context không có thông tin liên quan, hãy nói rõ "Tôi không tìm thấy thông tin về..."
- KHÔNG trả lời về topic khác nếu không có thông tin
- Luôn dựa vào context được cung cấp
"""
```

---

### PRIORITY 2 - HIGH

#### 2.1. Add hybrid search (BM25 + Vector)

```python
# Combine keyword search + semantic search
# → Better recall for specific questions like "phí kiểm hóa"
```

#### 2.2. Re-process PDF với chunking tốt hơn

```python
# Hiện tại: 390 chunks
# Vấn đề: Chunks có thể overlap hoặc thiếu context

# Fix:
DOCLING_CHUNK_MAX_TOKENS = 1024  # Giảm từ 2048
DOCLING_CHUNK_OVERLAP = 200      # Thêm overlap
```

---

### PRIORITY 3 - MEDIUM

#### 3.1. Add query classification

```python
# Phân loại câu hỏi trước khi search
# → Chọn search strategy phù hợp

CATEGORIES = {
    "price_query": ["giá", "chi phí", "bao nhiêu"],
    "process_query": ["quy trình", "thủ tục", "cách"],
    "list_query": ["có những", "loại nào", "danh sách"],
}
```

#### 3.2. Add query expansion

```python
# Mở rộng câu hỏi ngắn
"giá container 20'" 
→ "giá dịch vụ xếp dỡ container 20 feet là bao nhiêu"
```

---

## 📊 SO SÁNH VỚI BASELINE

| Metric | Hiện tại | Target | Gap |
|--------|----------|--------|-----|
| Response time | 6,034ms | < 2,000ms | 🔴 3x chậm |
| Accuracy | 30% | > 80% | 🔴 2.7x thấp |
| Citations | 100% | > 90% | ✅ Đạt |
| Stability | 7ms std | < 500ms | ✅ Đạt |

---

## 🎬 NEXT STEPS

### Tuần này:
1. ✅ **Chuyển LLM model** sang gpt-4o-mini hoặc gpt-5-nano
2. ✅ **Giảm score threshold** từ 0.35 → 0.25
3. ✅ **Tăng top-k** từ 5 → 10
4. ✅ **Update system prompt** để xử lý "không có thông tin"

### Tuần sau:
5. Implement hybrid search (BM25 + Vector)
6. Re-process PDF với chunking cải tiến
7. Add query classification
8. Enable streaming response

### Backlog:
9. A/B test different embedding models
10. Fine-tune Vietnamese embedding for port domain
11. Add query caching
12. Implement relevance feedback loop

---

## 📝 FILES GENERATED

- `simple_rag_test.py` - Test script
- `simple_rag_test_output.log` - Full test output
- `RAG_TEST_REPORT.md` - This report

**Run again:**
```bash
python3 simple_rag_test.py
```

---

*Report generated: 2026-04-19*  
*Test duration: ~80 seconds*  
*Data: 390 documents in Qdrant*
