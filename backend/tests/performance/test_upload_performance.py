"""
Performance test cho document upload pipeline.

Test các khía cạnh:
1. Upload file speed
2. Document processing time
3. Embedding generation
4. Qdrant upsert performance
5. Concurrent upload handling
"""
import asyncio
import time
import statistics
from pathlib import Path
from typing import Any

import pytest
import httpx
from io import BytesIO


BASE_URL = "http://localhost:8000"
TEST_FILES_DIR = Path(__file__).parent / "test_files"


class PerformanceMetrics:
    """Thu thập và báo cáo performance metrics."""

    def __init__(self):
        self.timings: list[float] = []
        self.errors: list[str] = []

    def add_timing(self, duration: float):
        self.timings.append(duration)

    def add_error(self, error: str):
        self.errors.append(error)

    def report(self) -> dict[str, Any]:
        if not self.timings:
            return {"error": "No successful requests", "error_count": len(self.errors)}

        return {
            "count": len(self.timings),
            "min_ms": round(min(self.timings) * 1000, 2),
            "max_ms": round(max(self.timings) * 1000, 2),
            "avg_ms": round(statistics.mean(self.timings) * 1000, 2),
            "median_ms": round(statistics.median(self.timings) * 1000, 2),
            "p95_ms": round(statistics.quantiles(self.timings, n=20)[18] * 1000, 2)
            if len(self.timings) >= 20
            else None,
            "error_count": len(self.errors),
            "error_rate": len(self.errors) / (len(self.timings) + len(self.errors)),
        }


def create_test_pdf(size_kb: int = 100) -> BytesIO:
    """Tạo PDF test với size xác định."""
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    # Thêm nội dung để đạt size mong muốn
    pages_needed = max(1, size_kb // 10)
    for page in range(pages_needed):
        c.drawString(100, 800, f"Test Document - Page {page + 1}")
        c.drawString(100, 750, "Performance testing for ChatSNP upload pipeline")
        # Thêm text để tăng kích thước
        for i in range(30):
            c.drawString(
                100,
                700 - (i * 20),
                f"Line {i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            )
        c.showPage()

    c.save()
    buffer.seek(0)
    return buffer


async def test_single_upload(client: httpx.AsyncClient, file_data: bytes, filename: str):
    """Test upload một file đơn."""
    start = time.perf_counter()

    files = {"file": (filename, file_data, "application/pdf")}
    data = {"user_id": "perf_test_user", "overwrite": "true"}

    response = await client.post(f"{BASE_URL}/upload", files=files, data=data)
    duration = time.perf_counter() - start

    if response.status_code not in (200, 201):
        raise Exception(f"Upload failed: {response.status_code} - {response.text}")

    result = response.json()
    document_id = result.get("document_id")

    return duration, document_id


async def wait_for_processing(
    client: httpx.AsyncClient, document_id: str, timeout: float = 60.0
):
    """Đợi document processing hoàn tất."""
    start = time.perf_counter()

    while time.perf_counter() - start < timeout:
        response = await client.get(f"{BASE_URL}/upload/{document_id}/status")
        if response.status_code != 200:
            raise Exception(f"Status check failed: {response.status_code}")

        status_data = response.json()
        status = status_data.get("status")

        if status == "ready":
            return time.perf_counter() - start
        elif status == "error":
            raise Exception(f"Processing error: {status_data.get('error_message')}")

        await asyncio.sleep(0.5)

    raise Exception(f"Processing timeout after {timeout}s")


@pytest.mark.asyncio
async def test_single_small_pdf_performance():
    """Test performance upload 1 PDF nhỏ (100KB)."""
    print("\n=== Test: Single Small PDF (100KB) ===")

    pdf_data = create_test_pdf(100).read()
    metrics = PerformanceMetrics()

    async with httpx.AsyncClient(timeout=120.0) as client:
        for i in range(5):
            try:
                upload_time, doc_id = await test_single_upload(
                    client, pdf_data, f"test_small_{i}.pdf"
                )
                process_time = await wait_for_processing(client, doc_id)
                total_time = upload_time + process_time

                metrics.add_timing(total_time)
                print(
                    f"  Run {i+1}: Upload={upload_time*1000:.0f}ms, "
                    f"Process={process_time*1000:.0f}ms, Total={total_time*1000:.0f}ms"
                )
            except Exception as e:
                metrics.add_error(str(e))
                print(f"  Run {i+1}: ERROR - {e}")

    report = metrics.report()
    print(f"\n📊 Results: {report}")
    assert report.get("error_rate", 1.0) < 0.2, "Too many errors"


@pytest.mark.asyncio
async def test_single_large_pdf_performance():
    """Test performance upload 1 PDF lớn (1MB)."""
    print("\n=== Test: Single Large PDF (1MB) ===")

    pdf_data = create_test_pdf(1024).read()
    metrics = PerformanceMetrics()

    async with httpx.AsyncClient(timeout=300.0) as client:
        for i in range(3):
            try:
                upload_time, doc_id = await test_single_upload(
                    client, pdf_data, f"test_large_{i}.pdf"
                )
                process_time = await wait_for_processing(client, doc_id, timeout=120.0)
                total_time = upload_time + process_time

                metrics.add_timing(total_time)
                print(
                    f"  Run {i+1}: Upload={upload_time*1000:.0f}ms, "
                    f"Process={process_time*1000:.0f}ms, Total={total_time*1000:.0f}ms"
                )
            except Exception as e:
                metrics.add_error(str(e))
                print(f"  Run {i+1}: ERROR - {e}")

    report = metrics.report()
    print(f"\n📊 Results: {report}")
    assert report.get("avg_ms", 999999) < 60000, "Average processing time > 60s"


@pytest.mark.asyncio
async def test_concurrent_uploads():
    """Test upload đồng thời nhiều file."""
    print("\n=== Test: Concurrent Uploads (5 files) ===")

    pdf_data = create_test_pdf(200).read()
    metrics = PerformanceMetrics()

    async with httpx.AsyncClient(timeout=120.0) as client:

        async def upload_and_wait(index: int):
            try:
                start = time.perf_counter()
                upload_time, doc_id = await test_single_upload(
                    client, pdf_data, f"test_concurrent_{index}.pdf"
                )
                process_time = await wait_for_processing(client, doc_id)
                total_time = time.perf_counter() - start

                metrics.add_timing(total_time)
                print(
                    f"  File {index}: Upload={upload_time*1000:.0f}ms, "
                    f"Process={process_time*1000:.0f}ms, Total={total_time*1000:.0f}ms"
                )
            except Exception as e:
                metrics.add_error(str(e))
                print(f"  File {index}: ERROR - {e}")

        # Upload 5 files đồng thời
        await asyncio.gather(*[upload_and_wait(i) for i in range(5)])

    report = metrics.report()
    print(f"\n📊 Results: {report}")
    assert report.get("error_rate", 1.0) < 0.3, "Too many errors in concurrent upload"


@pytest.mark.asyncio
async def test_upload_endpoint_only():
    """Test chỉ upload endpoint (không đợi processing)."""
    print("\n=== Test: Upload Endpoint Only (no wait) ===")

    pdf_data = create_test_pdf(100).read()
    metrics = PerformanceMetrics()

    async with httpx.AsyncClient(timeout=30.0) as client:
        for i in range(10):
            try:
                duration, _ = await test_single_upload(
                    client, pdf_data, f"test_upload_only_{i}.pdf"
                )
                metrics.add_timing(duration)
                print(f"  Run {i+1}: {duration*1000:.0f}ms")
            except Exception as e:
                metrics.add_error(str(e))
                print(f"  Run {i+1}: ERROR - {e}")

    report = metrics.report()
    print(f"\n📊 Results: {report}")
    assert report.get("avg_ms", 999999) < 1000, "Upload endpoint avg > 1s"


@pytest.mark.asyncio
async def test_processing_bottleneck():
    """Xác định bottleneck trong processing pipeline."""
    print("\n=== Test: Processing Bottleneck Analysis ===")

    pdf_data = create_test_pdf(500).read()

    async with httpx.AsyncClient(timeout=300.0) as client:
        # Upload file
        start_upload = time.perf_counter()
        upload_time, doc_id = await test_single_upload(client, pdf_data, "bottleneck.pdf")
        print(f"  ⏱️  Upload: {upload_time*1000:.0f}ms")

        # Theo dõi processing qua SSE stream
        start_process = time.perf_counter()
        stage_timings = {}
        last_stage = None

        async with client.stream(
            "GET", f"{BASE_URL}/upload/{doc_id}/stream"
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    import json

                    data = json.loads(line[6:])
                    stage = data.get("stage")
                    elapsed = data.get("elapsed_ms", 0)

                    if stage and stage != last_stage:
                        stage_timings[stage] = elapsed
                        last_stage = stage
                        print(f"  ⏱️  Stage '{stage}': {elapsed:.0f}ms")

                    if data.get("type") in ("done", "error"):
                        break

        total_process = time.perf_counter() - start_process
        print(f"  ⏱️  Total Processing: {total_process*1000:.0f}ms")

        # Phân tích bottleneck
        if stage_timings:
            print("\n  📊 Stage Analysis:")
            sorted_stages = sorted(stage_timings.items(), key=lambda x: x[1], reverse=True)
            for stage, elapsed in sorted_stages:
                pct = (elapsed / (total_process * 1000)) * 100 if total_process > 0 else 0
                print(f"    {stage:15s}: {elapsed:6.0f}ms ({pct:5.1f}%)")


if __name__ == "__main__":
    import sys

    # Chạy manual nếu không dùng pytest
    if len(sys.argv) > 1 and sys.argv[1] == "run":
        asyncio.run(test_single_small_pdf_performance())
        asyncio.run(test_single_large_pdf_performance())
        asyncio.run(test_concurrent_uploads())
        asyncio.run(test_upload_endpoint_only())
        asyncio.run(test_processing_bottleneck())
