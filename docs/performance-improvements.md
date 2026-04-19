# Performance Improvements Implementation Guide

## Tổng quan

Document này hướng dẫn implement các performance improvements cho ChatSNP upload pipeline.

## 🎯 Priority Improvements

### 1. ⚡ Enable GPU cho Embedding Model (HIGH IMPACT)

**Impact:** Giảm 70% embedding time (từ 10s → 3s cho 500 chunks)

**Implementation:**

```bash
# 1. Cài đặt PyTorch với CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# 2. Verify GPU
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"

# 3. Replace embedding helper
cp backend/src/worker/embedding_optimized.py backend/src/worker/embedding_helper.py

# 4. Update imports trong chat_tasks.py
# From: from .helpers import embed_texts
# To:   from .embedding_helper import embed_texts
```

**Verification:**
```python
from src.worker.embedding_helper import get_device_info
print(get_device_info())
# Expected: {'device': 'cuda', 'device_name': 'NVIDIA ...', ...}
```

---

### 2. 🛡️ File Size Validation (HIGH IMPACT)

**Impact:** Tránh worker crash với file quá lớn

**Implementation:**

```python
# Edit backend/src/api/upload.py, thêm sau line 154:

# File size validation
file.file.seek(0, 2)  # Seek to end
file_size = file.file.tell()
file.file.seek(0)  # Reset

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
if file_size > MAX_FILE_SIZE:
    raise HTTPException(
        status_code=413,
        detail=f"File quá lớn ({file_size/1024/1024:.1f}MB). Tối đa 50MB."
    )
```

**Alternative:** Sử dụng file đã tạo sẵn:
```bash
cp backend/src/api/upload_optimized.py backend/src/api/upload.py
```

---

### 3. 📂 Async File I/O (MEDIUM IMPACT)

**Impact:** Tăng concurrent upload throughput 2-3x

**Dependencies:**
```bash
pip install aiofiles
```

**Implementation:**

```python
# Replace blocking I/O trong upload.py (line 170-172):

# OLD:
# with open(file_path, "wb") as buffer:
#     shutil.copyfileobj(file.file, buffer)

# NEW:
import aiofiles
async with aiofiles.open(file_path, "wb") as buffer:
    content = await file.read()
    await buffer.write(content)
```

---

### 4. 📦 Batched Qdrant Upsert (MEDIUM IMPACT)

**Impact:** Giảm network overhead, tăng reliability

**Implementation:**

```python
# 1. Copy optimized version
cp backend/src/core/qdrant_optimized.py backend/src/core/qdrant_batched.py

# 2. Update qdrant_setup.py:
from src.core.qdrant_batched import upsert_vectors_batched

def upsert_vectors(collection_name, payloads, vectors, ids=None):
    client = get_qdrant_client()
    return upsert_vectors_batched(
        client, collection_name, payloads, vectors, ids,
        batch_size=100  # Configurable
    )
```

**Verify:**
```bash
# Check logs for batching messages:
docker logs chatsnp-worker-1 | grep "Upserting.*batches"
# Expected: "Upserting 500 vectors in 5 batches"
```

---

### 5. 📊 Frontend Upload Progress (LOW EFFORT)

**Impact:** Better UX

**Implementation:**

```typescript
// frontend/src/lib/upload.ts

export async function uploadWithProgress(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const pct = (e.loaded / e.total) * 100;
        onProgress(pct);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        const result = JSON.parse(xhr.responseText);
        resolve(result.document_id);
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => reject(new Error('Network error')));
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', getUserId());
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}
```

---

## 🔧 Advanced Optimizations

### 6. Separate Worker Queues by Task Type

**Problem:** Worker phải load tất cả models (Docling + Embedding + Whisper) → 4GB+ RAM

**Solution:** Tách worker theo task type

```yaml
# docker-compose.yml

services:
  # Worker 1: Document parsing only (Docling)
  worker-docling:
    build: ./backend
    command: celery -A src.worker.celery_app worker -Q media_process -c 1
    environment:
      - LOAD_DOCLING=true
      - LOAD_EMBEDDING=false
      - LOAD_WHISPER=false
    deploy:
      resources:
        limits:
          memory: 3G

  # Worker 2: Embedding only
  worker-embedding:
    build: ./backend
    command: celery -A src.worker.celery_app worker -Q embedding_queue -c 2
    environment:
      - LOAD_DOCLING=false
      - LOAD_EMBEDDING=true
      - LOAD_WHISPER=false
    deploy:
      resources:
        limits:
          memory: 2G

  # Worker 3: Audio transcription only (Whisper)
  worker-audio:
    build: ./backend
    command: celery -A src.worker.celery_app worker -Q audio_queue -c 1
    environment:
      - LOAD_DOCLING=false
      - LOAD_EMBEDDING=false
      - LOAD_WHISPER=true
```

**Update task routing:**
```python
# src/worker/media_tasks.py

# After Docling processing, dispatch embedding to separate queue:
from src.worker.tasks import embed_document_chunks
embed_document_chunks.apply_async(
    args=[chunks, document_id],
    queue='embedding_queue'
)
```

---

### 7. PDF Processing Optimization

**Problem:** Docling quá chậm với large PDFs (30-120s)

**Solution:** 2-tier processing

```python
# src/worker/media_tasks.py (line 195+)

# Already implemented: Fast path with pdftotext
if ext == ".pdf" and os.getenv("PDF_FAST_TEXT_ENABLED", "true") == "true":
    fast_text, fast_pages = _extract_text_from_pdf_fast(file_path)
    if len(fast_text) >= 500:
        # Use fast extraction ✅
        extracted_text = fast_text
        # Skip Docling for text-only PDFs
    else:
        # Fall back to Docling for complex PDFs (tables, images)
        pass

# NEW: Add page limit for large PDFs
MAX_PAGES_DOCLING = 100
if page_count > MAX_PAGES_DOCLING:
    logger.warning(
        f"PDF has {page_count} pages, limiting Docling to first {MAX_PAGES_DOCLING}"
    )
    # Implement page slicing in docling_service
```

---

### 8. Redis Caching for Parsed Documents

**Problem:** Re-uploading same document → re-parse lại

**Solution:** Cache parsed results

```python
# src/worker/media_tasks.py

import hashlib
from src.core.redis_client import get_redis

def get_file_hash(file_path: str) -> str:
    """Compute SHA256 hash of file."""
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()

@celery_app.task(...)
def process_document(file_path, ...):
    # Check cache
    file_hash = get_file_hash(file_path)
    redis = get_redis()
    cached = redis.get(f"parsed:{file_hash}")
    
    if cached:
        logger.info(f"[cache] HIT for {filename} (hash={file_hash[:8]})")
        result = json.loads(cached)
        # Use cached parsed text
        extracted_text = result['text']
        prechunked_chunks = result['chunks']
    else:
        # Parse with Docling
        # ...
        # Cache result
        redis.setex(
            f"parsed:{file_hash}",
            86400 * 7,  # 7 days
            json.dumps({'text': extracted_text, 'chunks': prechunked_chunks})
        )
```

---

## 📈 Performance Testing

### Run Performance Tests

```bash
# 1. Start services
cd chatSNP170226
docker compose up -d

# 2. Run tests
cd backend
chmod +x tests/performance/run_perf_tests.sh
./tests/performance/run_perf_tests.sh
```

### Expected Results (after optimizations)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Upload endpoint | 200-500ms | 50-100ms | 3-5x faster |
| Embedding (500 chunks, CPU) | 10-15s | 10-15s | No change |
| Embedding (500 chunks, GPU) | N/A | 2-3s | **5-7x faster** |
| PDF processing (10 pages) | 8-12s | 3-5s | 2-3x faster |
| PDF processing (50 pages) | 40-80s | 15-25s | 2-3x faster |
| Concurrent uploads (5 files) | 1-2 successes | 4-5 successes | Better reliability |

---

## 🐛 Troubleshooting

### GPU not detected

```bash
# Check CUDA installation
nvidia-smi

# Check PyTorch CUDA
python -c "import torch; print(torch.cuda.is_available())"

# If false, reinstall PyTorch with CUDA:
pip uninstall torch torchvision torchaudio
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Worker OOM (Out of Memory)

```bash
# Check worker memory usage
docker stats chatsnp-worker-1

# Solutions:
# 1. Increase worker memory limit in docker-compose.yml
# 2. Reduce Celery concurrency: -c 1 instead of -c 2
# 3. Implement separate worker queues (see #6)
# 4. Enable model offloading after each task
```

### Qdrant connection timeout

```bash
# Check Qdrant health
curl http://localhost:6333/health

# Increase timeout in qdrant_setup.py:
client = QdrantClient(
    host="qdrant",
    port=6333,
    timeout=30  # Increase from default 5s
)
```

---

## 📊 Monitoring

### Key Metrics to Track

```python
# Add to performance logging

import time
from src.core.redis_client import get_redis

def track_metric(metric_name: str, value: float, tags: dict = None):
    """Track performance metric in Redis (time-series)."""
    redis = get_redis()
    timestamp = int(time.time())
    key = f"metrics:{metric_name}:{timestamp}"
    redis.setex(key, 3600, json.dumps({
        'value': value,
        'tags': tags or {},
        'timestamp': timestamp
    }))

# Usage:
track_metric('upload.duration_ms', duration * 1000, {'file_size_kb': file_size/1024})
track_metric('embedding.duration_ms', duration * 1000, {'chunk_count': len(chunks)})
track_metric('docling.duration_ms', duration * 1000, {'page_count': page_count})
```

---

## ✅ Checklist

- [ ] GPU enabled cho embedding (if hardware supports)
- [ ] File size validation implemented
- [ ] Async file I/O implemented
- [ ] Qdrant batched upsert implemented
- [ ] Frontend upload progress tracking
- [ ] Performance tests passed
- [ ] Worker memory usage < 4GB
- [ ] Upload endpoint < 200ms avg
- [ ] Document processing < 30s for typical files
- [ ] Monitoring/logging in place

---

## 📚 References

- Performance analysis: `backend/tests/performance/analyze_performance.py`
- Performance tests: `backend/tests/performance/test_upload_performance.py`
- Optimized files:
  - `backend/src/api/upload_optimized.py`
  - `backend/src/worker/embedding_optimized.py`
  - `backend/src/core/qdrant_optimized.py`
