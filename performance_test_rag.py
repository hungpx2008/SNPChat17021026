"""
Performance Test Suite for ChatSNP RAG System
Focus: Document RAG performance, vector search, embedding speed
"""

import asyncio
import time
import statistics
from typing import List, Dict, Any
import httpx
import json
from datetime import datetime
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
import os
try:
    import asyncpg
except ImportError:
    asyncpg = None

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000")
MEM0_URL = os.getenv("MEM0_SERVICE_URL", "http://mem0-service:8888")
QDRANT_URL = os.getenv("QDRANT_URL", "http://qdrant:6333")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://chatsnp:12345678@postgres:5432/chatsnp")

# Test parameters
TEST_USER_ID = "perf-test-user"
TEST_DEPARTMENT = "test-dept"


class PerformanceMetrics:
    def __init__(self):
        self.metrics = []

    def record(self, operation: str, duration: float, metadata: Dict = None):
        self.metrics.append({
            "operation": operation,
            "duration_ms": duration * 1000,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata or {}
        })

    def report(self):
        if not self.metrics:
            print("No metrics recorded")
            return

        ops = {}
        for m in self.metrics:
            op = m["operation"]
            if op not in ops:
                ops[op] = []
            ops[op].append(m["duration_ms"])

        print("\n" + "="*80)
        print("PERFORMANCE TEST RESULTS - RAG SYSTEM")
        print("="*80 + "\n")

        for op, durations in ops.items():
            avg = statistics.mean(durations)
            median = statistics.median(durations)
            min_d = min(durations)
            max_d = max(durations)
            p95 = statistics.quantiles(durations, n=20)[18] if len(durations) > 1 else avg

            print(f"\n{op}:")
            print(f"  Count:     {len(durations)}")
            print(f"  Average:   {avg:.2f} ms")
            print(f"  Median:    {median:.2f} ms")
            print(f"  Min:       {min_d:.2f} ms")
            print(f"  Max:       {max_d:.2f} ms")
            print(f"  P95:       {p95:.2f} ms")

            # Quality assessment
            if avg < 100:
                status = "✓ EXCELLENT"
            elif avg < 500:
                status = "✓ GOOD"
            elif avg < 1000:
                status = "⚠ ACCEPTABLE"
            else:
                status = "✗ NEEDS OPTIMIZATION"
            print(f"  Status:    {status}")

        print("\n" + "="*80 + "\n")


metrics = PerformanceMetrics()


async def test_embedding_performance():
    """Test Mem0 embedding service performance"""
    print("\n[1/10] Testing Embedding Performance...")

    test_texts = [
        "Biểu giá dịch vụ xếp dỡ container tại cảng Sài Gòn",
        "Quy trình xuất nhập khẩu hàng hóa",
        "Thủ tục hải quan và kiểm dịch",
        "Lịch tàu cập cảng trong tuần",
        "Chi phí lưu bãi container 20 feet",
    ]

    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, text in enumerate(test_texts, 1):
            start = time.time()
            response = await client.post(
                f"{MEM0_URL}/embed",
                json={"text": text}
            )
            duration = time.time() - start

            if response.status_code == 200:
                data = response.json()
                vector_dim = len(data.get("embedding", []))
                metrics.record("embedding_generation", duration, {
                    "text_length": len(text),
                    "vector_dim": vector_dim
                })
                print(f"  ✓ Test {i}/5: {duration*1000:.2f}ms (dim={vector_dim})")
            else:
                print(f"  ✗ Test {i}/5 failed: {response.status_code}")


async def test_qdrant_search_performance():
    """Test Qdrant vector search performance"""
    print("\n[2/10] Testing Qdrant Vector Search...")

    qdrant = QdrantClient(url=QDRANT_URL)

    # Get a sample vector first
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{MEM0_URL}/embed",
            json={"text": "biểu giá cảng"}
        )
        sample_vector = response.json()["embedding"]

    # Test search with different limits
    for limit in [5, 10, 20]:
        start = time.time()
        try:
            results = qdrant.search(
                collection_name="port_knowledge",
                query_vector=sample_vector,
                limit=limit,
                score_threshold=0.35
            )
            duration = time.time() - start

            metrics.record("qdrant_search", duration, {
                "limit": limit,
                "results_count": len(results)
            })
            print(f"  ✓ Search limit={limit}: {duration*1000:.2f}ms ({len(results)} results)")
        except Exception as e:
            print(f"  ✗ Search limit={limit} failed: {e}")


async def test_rag_document_search_task():
    """Test full RAG document search task (Celery)"""
    print("\n[3/10] Testing RAG Document Search Task...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Create a test session
        session_resp = await client.post(
            f"{BACKEND_URL}/sessions",
            json={
                "user_id": TEST_USER_ID,
                "department": TEST_DEPARTMENT,
                "title": "Performance Test RAG"
            }
        )
        session_id = session_resp.json()["id"]

        # Test queries
        test_queries = [
            "Biểu giá dịch vụ cảng là gì?",
            "Quy trình xuất nhập khẩu như thế nào?",
            "Chi phí lưu container 20 feet?",
        ]

        for i, query in enumerate(test_queries, 1):
            start = time.time()

            # Send message with RAG mode
            msg_resp = await client.post(
                f"{BACKEND_URL}/sessions/{session_id}/messages",
                json={
                    "content": query,
                    "role": "user",
                    "mode": "rag"
                }
            )

            if msg_resp.status_code == 201:
                # Wait for task completion (check SSE or poll message)
                await asyncio.sleep(5)  # Give time for Celery task

                # Fetch messages
                session_data = await client.get(f"{BACKEND_URL}/sessions/{session_id}")
                messages = session_data.json().get("messages", [])

                duration = time.time() - start

                # Find assistant response
                assistant_msgs = [m for m in messages if m["role"] == "assistant"]
                if assistant_msgs:
                    last_msg = assistant_msgs[-1]
                    response_length = len(last_msg.get("content", ""))

                    metrics.record("rag_end_to_end", duration, {
                        "query_length": len(query),
                        "response_length": response_length,
                        "has_citations": "---" in last_msg.get("content", "")
                    })
                    print(f"  ✓ Query {i}/3: {duration*1000:.2f}ms (response: {response_length} chars)")
                else:
                    print(f"  ⚠ Query {i}/3: No assistant response yet")
            else:
                print(f"  ✗ Query {i}/3 failed: {msg_resp.status_code}")


async def test_document_upload_processing():
    """Test document upload and processing performance"""
    print("\n[4/10] Testing Document Upload Processing...")

    # Create a test text file
    test_file_content = """
    BIỂU GIÁ DỊCH VỤ CẢNG SÀI GÒN

    1. Dịch vụ xếp dỡ container:
    - Container 20 feet: 1,500,000 VNĐ
    - Container 40 feet: 2,500,000 VNĐ

    2. Dịch vụ lưu bãi:
    - Ngày 1-3: Miễn phí
    - Ngày 4-7: 50,000 VNĐ/ngày
    - Từ ngày 8: 100,000 VNĐ/ngày

    3. Dịch vụ kiểm hóa:
    - Kiểm hóa thường: 500,000 VNĐ
    - Kiểm hóa ngoài giờ: 800,000 VNĐ
    """ * 10  # Make it larger

    test_file_path = "/tmp/test_bieu_gia.txt"
    with open(test_file_path, "w", encoding="utf-8") as f:
        f.write(test_file_content)

    async with httpx.AsyncClient(timeout=120.0) as client:
        start = time.time()

        with open(test_file_path, "rb") as f:
            files = {"file": ("test_bieu_gia.txt", f, "text/plain")}
            data = {
                "user_id": TEST_USER_ID,
                "department": TEST_DEPARTMENT,
                "is_public": "false"
            }

            response = await client.post(
                f"{BACKEND_URL}/upload",
                files=files,
                data=data
            )

        if response.status_code == 200:
            doc_data = response.json()
            doc_id = doc_data.get("id")

            # Poll for processing completion
            max_wait = 60
            poll_interval = 2
            elapsed = 0

            while elapsed < max_wait:
                await asyncio.sleep(poll_interval)
                elapsed += poll_interval

                status_resp = await client.get(f"{BACKEND_URL}/upload/{doc_id}/status")
                if status_resp.status_code == 200:
                    status_data = status_resp.json()
                    if status_data.get("status") == "ready":
                        duration = time.time() - start
                        chunk_count = status_data.get("chunk_count", 0)

                        metrics.record("document_processing", duration, {
                            "file_size": len(test_file_content),
                            "chunk_count": chunk_count,
                            "extractor": status_data.get("extractor_used")
                        })
                        print(f"  ✓ Upload & process: {duration*1000:.2f}ms ({chunk_count} chunks)")
                        break
                    elif status_data.get("status") == "error":
                        print(f"  ✗ Processing failed: {status_data.get('error_message')}")
                        break
            else:
                print(f"  ⚠ Processing timeout after {max_wait}s")
        else:
            print(f"  ✗ Upload failed: {response.status_code}")

    # Cleanup
    os.remove(test_file_path)


async def test_semantic_search():
    """Test semantic search endpoint performance"""
    print("\n[5/10] Testing Semantic Search Endpoint...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Create a session with history
        session_resp = await client.post(
            f"{BACKEND_URL}/sessions",
            json={
                "user_id": TEST_USER_ID,
                "department": TEST_DEPARTMENT,
                "title": "Semantic Search Test"
            }
        )
        session_id = session_resp.json()["id"]

        # Add some messages
        for msg in ["Biểu giá là gì?", "Tôi cần biết giá cả", "Chi phí ra sao?"]:
            await client.post(
                f"{BACKEND_URL}/sessions/{session_id}/messages",
                json={"content": msg, "role": "user"}
            )

        # Test semantic search
        start = time.time()
        search_resp = await client.post(
            f"{BACKEND_URL}/sessions/search",
            json={
                "user_id": TEST_USER_ID,
                "department": TEST_DEPARTMENT,
                "query": "biểu giá dịch vụ cảng",
                "limit": 10
            }
        )
        duration = time.time() - start

        if search_resp.status_code == 200:
            results = search_resp.json()
            metrics.record("semantic_search", duration, {
                "results_count": len(results)
            })
            print(f"  ✓ Semantic search: {duration*1000:.2f}ms ({len(results)} results)")
        else:
            print(f"  ✗ Search failed: {search_resp.status_code}")


async def test_database_query_performance():
    """Test PostgreSQL query performance"""
    print("\n[6/10] Testing Database Query Performance...")

    if not asyncpg:
        print("  ⚠ asyncpg not available, skipping database tests")
        return

    conn = await asyncpg.connect(DATABASE_URL)

    try:
        # Test 1: Fetch recent sessions
        start = time.time()
        rows = await conn.fetch("""
            SELECT id, user_id, title, created_at
            FROM chat_sessions
            WHERE user_id = $1
            ORDER BY updated_at DESC
            LIMIT 20
        """, TEST_USER_ID)
        duration = time.time() - start
        metrics.record("db_fetch_sessions", duration)
        print(f"  ✓ Fetch sessions: {duration*1000:.2f}ms")

        # Test 2: Fetch messages for a session
        row = await conn.fetchrow("""
            SELECT id FROM chat_sessions WHERE user_id = $1 LIMIT 1
        """, TEST_USER_ID)

        if row:
            session_id = row['id']

            start = time.time()
            rows = await conn.fetch("""
                SELECT id, role, content, created_at
                FROM chat_messages
                WHERE session_id = $1
                ORDER BY created_at DESC
                LIMIT 50
            """, session_id)
            duration = time.time() - start
            metrics.record("db_fetch_messages", duration)
            print(f"  ✓ Fetch messages: {duration*1000:.2f}ms")

        # Test 3: Fetch documents
        start = time.time()
        rows = await conn.fetch("""
            SELECT id, filename, status, chunk_count, created_at
            FROM documents
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 20
        """, TEST_USER_ID)
        duration = time.time() - start
        metrics.record("db_fetch_documents", duration)
        print(f"  ✓ Fetch documents: {duration*1000:.2f}ms")

    finally:
        await conn.close()


async def test_qdrant_collection_stats():
    """Test Qdrant collection statistics"""
    print("\n[7/10] Testing Qdrant Collection Stats...")

    qdrant = QdrantClient(url=QDRANT_URL)

    collections = ["chat_chunks", "port_knowledge"]

    for collection_name in collections:
        try:
            start = time.time()
            collection_info = qdrant.get_collection(collection_name)
            duration = time.time() - start

            points_count = collection_info.points_count
            vectors_count = collection_info.vectors_count

            metrics.record("qdrant_collection_info", duration, {
                "collection": collection_name,
                "points": points_count
            })
            print(f"  ✓ {collection_name}: {points_count} points ({duration*1000:.2f}ms)")
        except Exception as e:
            print(f"  ✗ {collection_name} error: {e}")


async def test_concurrent_rag_queries():
    """Test concurrent RAG queries"""
    print("\n[8/10] Testing Concurrent RAG Queries...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Create test session
        session_resp = await client.post(
            f"{BACKEND_URL}/sessions",
            json={
                "user_id": TEST_USER_ID,
                "department": TEST_DEPARTMENT,
                "title": "Concurrent Test"
            }
        )
        session_id = session_resp.json()["id"]

        queries = [
            "Biểu giá dịch vụ?",
            "Chi phí container?",
            "Quy trình xuất khẩu?",
            "Lịch tàu cập cảng?",
            "Thủ tục hải quan?",
        ]

        async def send_query(query: str, idx: int):
            start = time.time()
            try:
                response = await client.post(
                    f"{BACKEND_URL}/sessions/{session_id}/messages",
                    json={"content": query, "role": "user", "mode": "rag"}
                )
                duration = time.time() - start
                return (idx, duration, response.status_code)
            except Exception as e:
                return (idx, -1, str(e))

        # Send all queries concurrently
        start = time.time()
        results = await asyncio.gather(*[send_query(q, i) for i, q in enumerate(queries)])
        total_duration = time.time() - start

        successful = [r for r in results if r[2] == 201]
        metrics.record("concurrent_rag_queries", total_duration, {
            "total_queries": len(queries),
            "successful": len(successful),
            "concurrency": len(queries)
        })
        print(f"  ✓ {len(successful)}/{len(queries)} queries in {total_duration*1000:.2f}ms")


async def test_mem0_memory_operations():
    """Test Mem0 memory operations performance"""
    print("\n[9/10] Testing Mem0 Memory Operations...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Test add memory
        start = time.time()
        response = await client.post(
            f"{MEM0_URL}/memories",
            json={
                "messages": [{"role": "user", "content": "Tôi thích container 20 feet"}],
                "user_id": TEST_USER_ID
            }
        )
        duration = time.time() - start
        if response.status_code == 200:
            metrics.record("mem0_add_memory", duration)
            print(f"  ✓ Add memory: {duration*1000:.2f}ms")

        # Test search memory
        start = time.time()
        response = await client.post(
            f"{MEM0_URL}/search",
            json={
                "query": "container",
                "user_id": TEST_USER_ID,
                "limit": 10
            }
        )
        duration = time.time() - start
        if response.status_code == 200:
            results = response.json()
            metrics.record("mem0_search_memory", duration, {
                "results_count": len(results)
            })
            print(f"  ✓ Search memory: {duration*1000:.2f}ms ({len(results)} results)")


async def test_system_health():
    """Test overall system health and response times"""
    print("\n[10/10] Testing System Health...")

    async with httpx.AsyncClient(timeout=10.0) as client:
        # Test backend health
        start = time.time()
        try:
            response = await client.get(f"{BACKEND_URL}/health")
            duration = time.time() - start
            metrics.record("backend_health", duration)
            print(f"  ✓ Backend health: {duration*1000:.2f}ms")
        except:
            print(f"  ✗ Backend health check failed")

        # Test Mem0 health
        start = time.time()
        try:
            response = await client.get(f"{MEM0_URL}/health")
            duration = time.time() - start
            metrics.record("mem0_health", duration)
            print(f"  ✓ Mem0 health: {duration*1000:.2f}ms")
        except:
            print(f"  ⚠ Mem0 has no health endpoint")


async def main():
    print("="*80)
    print("ChatSNP RAG PERFORMANCE TEST SUITE")
    print("="*80)
    print(f"Backend: {BACKEND_URL}")
    print(f"Mem0: {MEM0_URL}")
    print(f"Qdrant: {QDRANT_URL}")
    print(f"Database: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'N/A'}")
    print("="*80)

    try:
        await test_embedding_performance()
        await test_qdrant_search_performance()
        await test_semantic_search()
        await test_database_query_performance()
        await test_qdrant_collection_stats()
        await test_mem0_memory_operations()
        await test_system_health()
        await test_rag_document_search_task()
        await test_concurrent_rag_queries()
        await test_document_upload_processing()

    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n\nTest failed with error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        metrics.report()


if __name__ == "__main__":
    asyncio.run(main())
