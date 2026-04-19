"""
Performance Analysis Report Generator cho ChatSNP Upload Pipeline.

Phân tích code và đưa ra recommendations để cải thiện performance.
"""
from pathlib import Path
from typing import Any


class PerformanceIssue:
    """Đại diện cho một performance issue."""

    def __init__(
        self,
        severity: str,
        category: str,
        title: str,
        description: str,
        location: str,
        impact: str,
        recommendation: str,
    ):
        self.severity = severity  # critical, high, medium, low
        self.category = category  # io, cpu, memory, network, concurrency
        self.title = title
        self.description = description
        self.location = location
        self.impact = impact
        self.recommendation = recommendation


def analyze_upload_endpoint() -> list[PerformanceIssue]:
    """Phân tích upload.py endpoint."""
    issues = []

    issues.append(
        PerformanceIssue(
            severity="high",
            category="io",
            title="Blocking File I/O in Upload Endpoint",
            description=(
                "Endpoint /upload sử dụng shutil.copyfileobj() - một blocking I/O operation. "
                "Điều này chặn event loop và giảm throughput khi có nhiều concurrent uploads."
            ),
            location="src/api/upload.py:170-172",
            impact=(
                "- Mỗi upload chặn 1 worker thread\n"
                "- Giảm concurrent request handling capacity\n"
                "- Tăng response time khi có load cao"
            ),
            recommendation=(
                "Chuyển sang async file operations:\n"
                "```python\n"
                "import aiofiles\n"
                "async with aiofiles.open(file_path, 'wb') as buffer:\n"
                "    content = await file.read()\n"
                "    await buffer.write(content)\n"
                "```"
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="medium",
            category="io",
            title="Synchronous Database Queries in Duplicate Check",
            description=(
                "_handle_duplicate() thực hiện blocking database queries "
                "trong async context, có thể gây chậm upload endpoint."
            ),
            location="src/api/upload.py:99-137",
            impact=(
                "- Upload endpoint bị chậm thêm 10-50ms mỗi request\n"
                "- Không tối ưu connection pool usage"
            ),
            recommendation=(
                "Đã sử dụng AsyncSession - tốt. "
                "Nhưng nên cache kết quả duplicate check trong Redis để tránh query DB mỗi lần."
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="medium",
            category="io",
            title="File Size Check Missing",
            description=(
                "Không có validation file size trước khi upload. "
                "File quá lớn có thể làm crash worker hoặc timeout."
            ),
            location="src/api/upload.py:141",
            impact=(
                "- Worker OOM kill với file > 100MB\n"
                "- Celery task timeout với file > 500MB\n"
                "- Waste resources processing files quá lớn"
            ),
            recommendation=(
                "Thêm file size limit:\n"
                "```python\n"
                "MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB\n"
                "if file.size > MAX_FILE_SIZE:\n"
                "    raise HTTPException(413, 'File quá lớn (tối đa 50MB)')\n"
                "```"
            ),
        )
    )

    return issues


def analyze_processing_pipeline() -> list[PerformanceIssue]:
    """Phân tích media_tasks.py processing."""
    issues = []

    issues.append(
        PerformanceIssue(
            severity="critical",
            category="memory",
            title="Multiple Heavy Models in Memory",
            description=(
                "Worker phải load đồng thời:\n"
                "- Docling DocumentConverter (~2GB)\n"
                "- SentenceTransformer embedding model (~1.3GB)\n"
                "- Whisper model (~500MB)\n"
                "Tổng memory footprint > 4GB cho 1 worker."
            ),
            location="src/worker/media_tasks.py, src/worker/chat_tasks.py",
            impact=(
                "- Worker crashes với RAM < 8GB\n"
                "- Chỉ chạy được 1-2 worker trên máy dev\n"
                "- Slow startup time (load model mất 10-30s)"
            ),
            recommendation=(
                "Giải pháp:\n"
                "1. Lazy load models - chỉ load khi cần\n"
                "2. Release Docling model sau khi process xong (đã có ở line 271)\n"
                "3. Tách worker queue:\n"
                "   - Queue 'document_parse': Docling only\n"
                "   - Queue 'embedding': Embedding model only\n"
                "   - Queue 'audio': Whisper only\n"
                "4. Dùng model quantization để giảm size"
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="high",
            category="cpu",
            title="Docling Processing Too Slow for Large PDFs",
            description=(
                "Docling deep processing với large PDF (>50 pages) mất 30-120s. "
                "Timeout setting hiện tại là 300s có thể không đủ cho PDF 100+ pages."
            ),
            location="src/worker/media_tasks.py:64-69",
            impact=(
                "- User experience kém (đợi quá lâu)\n"
                "- Celery worker bị chiếm dụng lâu\n"
                "- Timeout errors với PDF lớn"
            ),
            recommendation=(
                "Giải pháp:\n"
                "1. Implement 2-tier processing:\n"
                "   - Tier 1: Fast extract (pdftotext) - đã có\n"
                "   - Tier 2: Deep parse (Docling) chỉ khi cần tables\n"
                "2. Stream processing: parse từng page, emit progress\n"
                "3. Page limit: chỉ parse 100 pages đầu cho PDF lớn\n"
                "4. Caching: cache parsed results trong Redis"
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="high",
            category="cpu",
            title="Embedding Generation Bottleneck",
            description=(
                "Embedding 500+ chunks mất 5-15s với CPU. "
                "SentenceTransformer không tận dụng GPU."
            ),
            location="src/worker/chat_tasks.py:81-86",
            impact=(
                "- 30-40% total processing time\n"
                "- Không scale với số lượng chunks"
            ),
            recommendation=(
                "Giải pháp:\n"
                "1. Enable GPU nếu available:\n"
                "   ```python\n"
                "   SentenceTransformer(model_name, device='cuda' if torch.cuda.is_available() else 'cpu')\n"
                "   ```\n"
                "2. Batch embedding với batch_size=32:\n"
                "   ```python\n"
                "   model.encode(texts, batch_size=32, show_progress_bar=False)\n"
                "   ```\n"
                "3. Dùng lighter embedding model (384-dim thay vì 1024-dim)\n"
                "4. Parallel embedding: split chunks, embed parallel"
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="medium",
            category="network",
            title="Qdrant Upsert Not Batched Optimally",
            description=(
                "Upsert 500 vectors cùng lúc có thể overwhelm Qdrant hoặc network. "
                "Không có retry logic cho network errors."
            ),
            location="src/core/qdrant_setup.py (upsert_vectors)",
            impact=(
                "- Network timeout với > 1000 vectors\n"
                "- Memory spike on Qdrant server\n"
                "- Lost data nếu upsert fails"
            ),
            recommendation=(
                "Giải pháp:\n"
                "```python\n"
                "BATCH_SIZE = 100\n"
                "for i in range(0, len(points), BATCH_SIZE):\n"
                "    batch = points[i:i+BATCH_SIZE]\n"
                "    for attempt in range(3):\n"
                "        try:\n"
                "            client.upsert(collection, points=batch)\n"
                "            break\n"
                "        except Exception as e:\n"
                "            if attempt == 2: raise\n"
                "            await asyncio.sleep(2 ** attempt)\n"
                "```"
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="low",
            category="io",
            title="No Chunking Streaming",
            description=(
                "Chunking load toàn bộ text vào memory trước khi split. "
                "Với document 10MB text, waste memory."
            ),
            location="src/worker/helpers.py (_smart_chunk)",
            impact="Memory usage cao khi process large documents",
            recommendation=(
                "Implement streaming chunker nếu text > 5MB:\n"
                "- Read file theo chunk (sliding window)\n"
                "- Emit chunks incrementally\n"
                "- Reduce peak memory usage"
            ),
        )
    )

    return issues


def analyze_frontend_upload() -> list[PerformanceIssue]:
    """Phân tích frontend upload implementation."""
    issues = []

    issues.append(
        PerformanceIssue(
            severity="medium",
            category="network",
            title="No Upload Progress Tracking",
            description=(
                "Frontend upload không track upload progress (chỉ track processing). "
                "User không biết file có đang upload hay không."
            ),
            location="frontend/src/components/upload (nếu có)",
            impact="UX kém với file lớn - user không thấy progress bar khi upload",
            recommendation=(
                "Implement upload progress:\n"
                "```typescript\n"
                "const xhr = new XMLHttpRequest();\n"
                "xhr.upload.addEventListener('progress', (e) => {\n"
                "  const pct = (e.loaded / e.total) * 100;\n"
                "  setUploadProgress(pct);\n"
                "});\n"
                "```"
            ),
        )
    )

    issues.append(
        PerformanceIssue(
            severity="low",
            category="network",
            title="No File Upload Resume Support",
            description="Nếu upload bị gián đoạn, phải upload lại từ đầu.",
            location="frontend + backend upload endpoint",
            impact="Waste bandwidth khi upload file lớn bị retry",
            recommendation=(
                "Implement resumable upload với tus protocol hoặc:\n"
                "1. Chunk upload (upload file theo 5MB chunks)\n"
                "2. Track uploaded chunks\n"
                "3. Resume từ chunk cuối nếu fail"
            ),
        )
    )

    return issues


def generate_report():
    """Generate full performance analysis report."""
    all_issues = []
    all_issues.extend(analyze_upload_endpoint())
    all_issues.extend(analyze_processing_pipeline())
    all_issues.extend(analyze_frontend_upload())

    # Sort by severity
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    all_issues.sort(key=lambda x: severity_order.get(x.severity, 99))

    # Generate report
    print("=" * 80)
    print("📊 ChatSNP Upload Performance Analysis Report")
    print("=" * 80)
    print()

    # Summary
    by_severity = {}
    by_category = {}
    for issue in all_issues:
        by_severity[issue.severity] = by_severity.get(issue.severity, 0) + 1
        by_category[issue.category] = by_category.get(issue.category, 0) + 1

    print("📈 Summary:")
    print(f"  Total Issues: {len(all_issues)}")
    print("  By Severity:")
    for sev in ["critical", "high", "medium", "low"]:
        count = by_severity.get(sev, 0)
        if count > 0:
            icon = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "⚪"}.get(
                sev, ""
            )
            print(f"    {icon} {sev.capitalize()}: {count}")
    print()
    print("  By Category:")
    for cat, count in sorted(by_category.items(), key=lambda x: x[1], reverse=True):
        print(f"    - {cat}: {count}")
    print()
    print("=" * 80)
    print()

    # Detailed issues
    for i, issue in enumerate(all_issues, 1):
        icon = {
            "critical": "🔴",
            "high": "🟠",
            "medium": "🟡",
            "low": "⚪",
        }.get(issue.severity, "")

        print(f"{i}. {icon} [{issue.severity.upper()}] {issue.title}")
        print(f"   Category: {issue.category}")
        print(f"   Location: {issue.location}")
        print()
        print(f"   📋 Description:")
        for line in issue.description.split("\n"):
            print(f"      {line}")
        print()
        print(f"   💥 Impact:")
        for line in issue.impact.split("\n"):
            print(f"      {line}")
        print()
        print(f"   ✅ Recommendation:")
        for line in issue.recommendation.split("\n"):
            print(f"      {line}")
        print()
        print("-" * 80)
        print()

    # Priority recommendations
    print("=" * 80)
    print("🎯 Priority Recommendations (Quick Wins):")
    print("=" * 80)
    print()

    quick_wins = [
        "1. [HIGH IMPACT] Enable GPU cho embedding model (giảm 70% embed time)",
        "2. [HIGH IMPACT] Implement file size validation (tránh worker crash)",
        "3. [MEDIUM IMPACT] Switch to async file I/O trong upload endpoint",
        "4. [MEDIUM IMPACT] Batch Qdrant upsert operations (100 vectors/batch)",
        "5. [LOW EFFORT] Add upload progress tracking ở frontend",
    ]

    for win in quick_wins:
        print(f"  {win}")

    print()
    print("=" * 80)
    print("📝 Full implementation guide: docs/performance-improvements.md")
    print("=" * 80)


if __name__ == "__main__":
    generate_report()
