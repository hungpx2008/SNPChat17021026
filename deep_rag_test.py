"""
Deep RAG Document Performance Test
Focus on document upload, chunking, embedding, and retrieval
"""

import asyncio
import time
import statistics
import httpx
from qdrant_client import QdrantClient
import tempfile
import os


class Metrics:
    def __init__(self):
        self.data = []

    def record(self, name: str, duration: float, meta: dict = None):
        self.data.append({
            "name": name,
            "duration_ms": duration * 1000,
            "meta": meta or {}
        })

    def summary(self):
        if not self.data:
            return

        grouped = {}
        for item in self.data:
            name = item["name"]
            if name not in grouped:
                grouped[name] = []
            grouped[name].append(item["duration_ms"])

        print("\n" + "="*80)
        print("📈 DEEP RAG PERFORMANCE ANALYSIS")
        print("="*80)

        for name, times in sorted(grouped.items()):
            avg = statistics.mean(times)
            if len(times) > 1:
                p50 = statistics.median(times)
                p95 = statistics.quantiles(times, n=20)[18] if len(times) >= 20 else max(times)
            else:
                p50 = p95 = avg

            # Performance rating
            if "rag_query" in name or "search" in name:
                threshold = [500, 1500, 3000]  # RAG queries
            elif "upload" in name or "process" in name:
                threshold = [2000, 10000, 30000]  # Document processing
            else:
                threshold = [100, 500, 1000]  # Other operations

            if avg < threshold[0]:
                rating = "🟢 EXCELLENT"
            elif avg < threshold[1]:
                rating = "🟡 GOOD"
            elif avg < threshold[2]:
                rating = "🟠 ACCEPTABLE"
            else:
                rating = "🔴 SLOW"

            print(f"\n{name}:")
            print(f"  Samples:  {len(times)}")
            print(f"  Average:  {avg:.1f} ms")
            print(f"  Median:   {p50:.1f} ms")
            if len(times) > 1:
                print(f"  P95:      {p95:.1f} ms")
            print(f"  Rating:   {rating}")

            # Show metadata from first sample
            meta = next((item["meta"] for item in self.data if item["name"] == name), {})
            if meta:
                print(f"  Metadata: {meta}")

        print("\n" + "="*80)
        print(f"Total operations: {len(self.data)}")
        print("="*80 + "\n")


metrics = Metrics()


async def test_qdrant_vector_stats():
    """Analyze Qdrant vector storage"""
    print("\n[1/5] Qdrant Vector Storage Analysis...")

    client = QdrantClient(url="http://qdrant:6333")

    collections = ["chat_chunks", "port_knowledge", "mem0_memories"]

    for coll_name in collections:
        try:
            start = time.time()
            info = client.get_collection(coll_name)
            duration = time.time() - start

            points_count = info.points_count
            config = info.config

            metrics.record(f"qdrant_info_{coll_name}", duration, {
                "points": points_count,
                "vector_size": config.params.vectors.size if hasattr(config.params, 'vectors') else 'N/A'
            })

            print(f"  ✓ {coll_name}: {points_count:,} points ({duration*1000:.1f}ms)")

            # Sample search performance
            if points_count > 0:
                dummy_vector = [0.1] * 1024  # Vietnamese_Embedding_v2 = 1024-dim

                start = time.time()
                results = client.search(
                    collection_name=coll_name,
                    query_vector=dummy_vector,
                    limit=10
                )
                duration = time.time() - start

                metrics.record(f"qdrant_search_{coll_name}", duration, {
                    "limit": 10,
                    "results": len(results)
                })
                print(f"    → Search (k=10): {duration*1000:.1f}ms, {len(results)} results")

        except Exception as e:
            print(f"  ⚠ {coll_name}: {e}")


async def test_document_upload_flow():
    """Test full document upload + processing pipeline"""
    print("\n[2/5] Document Upload & Processing Pipeline...")

    # Create test documents of varying sizes
    test_docs = [
        ("small.txt", "Biểu giá dịch vụ xếp dỡ container\n" * 10),
        ("medium.txt", "Quy trình xuất nhập khẩu hàng hóa tại cảng Sài Gòn.\n" * 50),
        ("large.txt", "Thông tin chi tiết về các dịch vụ cảng biển.\n" * 200),
    ]

    async with httpx.AsyncClient(timeout=120.0) as client:
        for filename, content in test_docs:
            # Create temp file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as f:
                f.write(content)
                temp_path = f.name

            try:
                # Upload
                start = time.time()

                with open(temp_path, 'rb') as f:
                    files = {"file": (filename, f, "text/plain")}
                    data = {
                        "user_id": "perf-test-user",
                        "department": "test-dept",
                        "is_public": "false"
                    }

                    resp = await client.post("http://backend:8000/upload", files=files, data=data)

                upload_duration = time.time() - start

                if resp.status_code == 200:
                    doc_data = resp.json()
                    doc_id = doc_data["id"]

                    metrics.record(f"upload_{filename}", upload_duration, {
                        "size": len(content),
                        "doc_id": doc_id
                    })
                    print(f"  ✓ Upload {filename}: {upload_duration*1000:.1f}ms ({len(content)} bytes)")

                    # Poll for processing completion
                    max_wait = 60
                    poll_interval = 2
                    elapsed = 0
                    process_start = time.time()

                    while elapsed < max_wait:
                        await asyncio.sleep(poll_interval)
                        elapsed += poll_interval

                        status_resp = await client.get(f"http://backend:8000/upload/{doc_id}/status")
                        if status_resp.status_code == 200:
                            status_data = status_resp.json()
                            status = status_data.get("status")

                            if status == "ready":
                                process_duration = time.time() - process_start
                                chunk_count = status_data.get("chunk_count", 0)

                                metrics.record(f"process_{filename}", process_duration, {
                                    "chunks": chunk_count,
                                    "extractor": status_data.get("extractor_used")
                                })
                                print(f"    → Processing: {process_duration*1000:.1f}ms → {chunk_count} chunks")
                                break
                            elif status == "error":
                                print(f"    ✗ Processing error: {status_data.get('error_message')}")
                                break
                    else:
                        print(f"    ⚠ Processing timeout ({max_wait}s)")

                else:
                    print(f"  ✗ Upload {filename} failed: {resp.status_code}")

            finally:
                os.unlink(temp_path)


async def test_rag_query_performance():
    """Test RAG document search queries"""
    print("\n[3/5] RAG Query Performance...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Create test session
        resp = await client.post(
            "http://backend:8000/sessions",
            json={
                "user_id": "perf-test-user",
                "department": "test-dept",
                "title": "RAG Performance Test"
            }
        )
        session_id = resp.json()["id"]

        # Test queries with varying complexity
        test_queries = [
            ("simple", "biểu giá"),
            ("medium", "biểu giá dịch vụ cảng"),
            ("complex", "chi phí lưu bãi container 20 feet tại cảng Sài Gòn"),
            ("long", "tôi cần biết thông tin chi tiết về quy trình xuất nhập khẩu hàng hóa tại cảng và các chi phí liên quan"),
        ]

        for query_type, query in test_queries:
            start = time.time()

            resp = await client.post(
                f"http://backend:8000/sessions/{session_id}/messages",
                json={
                    "content": query,
                    "role": "user",
                    "mode": "rag"
                }
            )

            if resp.status_code == 201:
                # Wait for Celery task
                await asyncio.sleep(3)

                # Fetch result
                session_resp = await client.get(f"http://backend:8000/sessions/{session_id}")
                duration = time.time() - start

                if session_resp.status_code == 200:
                    messages = session_resp.json().get("messages", [])
                    assistant_msgs = [m for m in messages if m["role"] == "assistant"]

                    if assistant_msgs:
                        last_msg = assistant_msgs[-1]
                        response_len = len(last_msg.get("content", ""))
                        has_citations = "---" in last_msg.get("content", "")

                        metrics.record(f"rag_query_{query_type}", duration, {
                            "query_len": len(query),
                            "response_len": response_len,
                            "citations": has_citations
                        })
                        print(f"  ✓ {query_type}: {duration*1000:.1f}ms (response: {response_len} chars)")
                    else:
                        print(f"  ⚠ {query_type}: No response yet")
                else:
                    print(f"  ✗ {query_type}: Failed to fetch result")
            else:
                print(f"  ✗ {query_type}: Failed to send message")


async def test_semantic_search_scaling():
    """Test semantic search with different result limits"""
    print("\n[4/5] Semantic Search Scaling...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        query = "biểu giá dịch vụ cảng biển"

        for limit in [5, 10, 20, 50]:
            start = time.time()

            resp = await client.post(
                "http://backend:8000/sessions/search",
                json={
                    "user_id": "perf-test-user",
                    "department": "test-dept",
                    "query": query,
                    "limit": limit
                }
            )

            duration = time.time() - start

            if resp.status_code == 200:
                results = resp.json()
                metrics.record(f"search_limit_{limit}", duration, {
                    "requested": limit,
                    "returned": len(results)
                })
                print(f"  ✓ Limit {limit:2d}: {duration*1000:.1f}ms → {len(results)} results")
            else:
                print(f"  ✗ Limit {limit} failed")


async def test_concurrent_rag_queries():
    """Test concurrent RAG queries under load"""
    print("\n[5/5] Concurrent RAG Load Test...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Create session
        resp = await client.post(
            "http://backend:8000/sessions",
            json={
                "user_id": "perf-test-user",
                "department": "test-dept",
                "title": "Concurrent Test"
            }
        )
        session_id = resp.json()["id"]

        queries = [
            "Biểu giá dịch vụ?",
            "Chi phí container?",
            "Quy trình xuất khẩu?",
            "Thủ tục hải quan?",
            "Lịch tàu cập cảng?",
        ]

        async def send_query(query: str, idx: int):
            start = time.time()
            try:
                resp = await client.post(
                    f"http://backend:8000/sessions/{session_id}/messages",
                    json={"content": query, "role": "user", "mode": "rag"}
                )
                duration = time.time() - start
                return (idx, duration, resp.status_code == 201)
            except Exception:
                return (idx, -1, False)

        # Test with different concurrency levels
        for concurrency in [2, 5]:
            start = time.time()
            batch = queries[:concurrency]
            results = await asyncio.gather(*[send_query(q, i) for i, q in enumerate(batch)])
            total_duration = time.time() - start

            successful = sum(1 for r in results if r[2])
            metrics.record(f"concurrent_{concurrency}_queries", total_duration, {
                "total": len(batch),
                "successful": successful
            })
            print(f"  ✓ {concurrency} concurrent: {total_duration*1000:.1f}ms ({successful}/{len(batch)} OK)")


async def main():
    print("="*80)
    print("🔬 DEEP RAG PERFORMANCE ANALYSIS")
    print("="*80)
    print("Focus: Document processing, Vector search, RAG queries")
    print("="*80)

    try:
        await test_qdrant_vector_stats()
        await test_document_upload_flow()
        await test_semantic_search_scaling()
        await test_rag_query_performance()
        await test_concurrent_rag_queries()

    except KeyboardInterrupt:
        print("\n\n⚠ Test interrupted")
    except Exception as e:
        print(f"\n\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        metrics.summary()


if __name__ == "__main__":
    asyncio.run(main())
