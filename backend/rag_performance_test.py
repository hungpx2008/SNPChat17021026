"""
RAG Performance Test - Simplified Version
Test components that are actually running
"""

import asyncio
import time
import statistics
from typing import List, Dict
import httpx
from qdrant_client import QdrantClient
import asyncpg
import os


class Metrics:
    def __init__(self):
        self.data = []

    def record(self, name: str, duration: float, meta: Dict = None):
        self.data.append({
            "name": name,
            "duration_ms": duration * 1000,
            "meta": meta or {}
        })

    def report(self):
        if not self.data:
            print("\n⚠ No metrics collected")
            return

        grouped = {}
        for item in self.data:
            name = item["name"]
            if name not in grouped:
                grouped[name] = []
            grouped[name].append(item["duration_ms"])

        print("\n" + "="*80)
        print("📊 RAG PERFORMANCE TEST RESULTS")
        print("="*80)

        total_tests = 0
        for name, times in grouped.items():
            total_tests += len(times)
            avg = statistics.mean(times)
            med = statistics.median(times)
            min_t = min(times)
            max_t = max(times)

            if avg < 100:
                status = "✓ EXCELLENT"
            elif avg < 500:
                status = "✓ GOOD"
            elif avg < 1000:
                status = "⚠ ACCEPTABLE"
            else:
                status = "✗ SLOW"

            print(f"\n{name}:")
            print(f"  Runs:    {len(times)}")
            print(f"  Avg:     {avg:.1f} ms")
            print(f"  Median:  {med:.1f} ms")
            print(f"  Range:   {min_t:.1f} - {max_t:.1f} ms")
            print(f"  Status:  {status}")

        print(f"\n{'='*80}")
        print(f"Total tests: {total_tests}")
        print(f"{'='*80}\n")


metrics = Metrics()


async def test_backend_health():
    """Test backend API response time"""
    print("\n[1/8] Backend Health Check...")

    async with httpx.AsyncClient(timeout=10.0) as client:
        for i in range(3):
            start = time.time()
            try:
                resp = await client.get("http://backend:8000/docs")
                duration = time.time() - start
                metrics.record("backend_health", duration, {"status": resp.status_code})
                print(f"  ✓ Test {i+1}: {duration*1000:.1f}ms")
            except Exception as e:
                print(f"  ✗ Test {i+1} failed: {e}")


async def test_qdrant_operations():
    """Test Qdrant vector DB operations"""
    print("\n[2/8] Qdrant Operations...")

    client = QdrantClient(url="http://qdrant:6333")

    # List collections
    start = time.time()
    try:
        collections = client.get_collections()
        duration = time.time() - start
        metrics.record("qdrant_list_collections", duration, {"count": len(collections.collections)})
        print(f"  ✓ List collections: {duration*1000:.1f}ms ({len(collections.collections)} found)")
    except Exception as e:
        print(f"  ✗ List collections failed: {e}")

    # Get collection info
    for coll_name in ["chat_chunks", "port_knowledge"]:
        start = time.time()
        try:
            info = client.get_collection(coll_name)
            duration = time.time() - start
            metrics.record(f"qdrant_get_collection_{coll_name}", duration, {
                "points": info.points_count,
                "vectors": info.vectors_count
            })
            print(f"  ✓ {coll_name}: {info.points_count} points ({duration*1000:.1f}ms)")
        except Exception as e:
            print(f"  ⚠ {coll_name}: {e}")


async def test_database_queries():
    """Test PostgreSQL query performance"""
    print("\n[3/8] Database Queries...")

    conn = await asyncpg.connect("postgresql://chatsnp:12345678@postgres:5432/chatsnp")

    try:
        # Count sessions
        start = time.time()
        count = await conn.fetchval("SELECT COUNT(*) FROM chat_sessions")
        duration = time.time() - start
        metrics.record("db_count_sessions", duration, {"count": count})
        print(f"  ✓ Count sessions: {count} rows ({duration*1000:.1f}ms)")

        # Fetch recent sessions
        start = time.time()
        rows = await conn.fetch("""
            SELECT id, user_id, title, created_at
            FROM chat_sessions
            ORDER BY updated_at DESC
            LIMIT 20
        """)
        duration = time.time() - start
        metrics.record("db_fetch_sessions", duration, {"rows": len(rows)})
        print(f"  ✓ Fetch sessions: {len(rows)} rows ({duration*1000:.1f}ms)")

        # Count messages
        start = time.time()
        count = await conn.fetchval("SELECT COUNT(*) FROM chat_messages")
        duration = time.time() - start
        metrics.record("db_count_messages", duration, {"count": count})
        print(f"  ✓ Count messages: {count} rows ({duration*1000:.1f}ms)")

        # Fetch messages for first session
        if rows:
            session_id = rows[0]['id']
            start = time.time()
            msgs = await conn.fetch("""
                SELECT id, role, content, created_at
                FROM chat_messages
                WHERE session_id = $1
                ORDER BY created_at DESC
                LIMIT 50
            """, session_id)
            duration = time.time() - start
            metrics.record("db_fetch_messages", duration, {"rows": len(msgs)})
            print(f"  ✓ Fetch messages: {len(msgs)} rows ({duration*1000:.1f}ms)")

        # Count documents
        start = time.time()
        count = await conn.fetchval("SELECT COUNT(*) FROM documents")
        duration = time.time() - start
        metrics.record("db_count_documents", duration, {"count": count})
        print(f"  ✓ Count documents: {count} rows ({duration*1000:.1f}ms)")

    finally:
        await conn.close()


async def test_session_crud():
    """Test session CRUD operations"""
    print("\n[4/8] Session CRUD...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Create session
        start = time.time()
        resp = await client.post(
            "http://backend:8000/sessions",
            json={
                "user_id": "perf-test-user",
                "department": "test-dept",
                "title": "Performance Test Session"
            }
        )
        duration = time.time() - start

        if resp.status_code == 200:
            session_data = resp.json()
            session_id = session_data["id"]
            metrics.record("api_create_session", duration)
            print(f"  ✓ Create session: {duration*1000:.1f}ms")

            # Fetch session
            start = time.time()
            resp = await client.get(f"http://backend:8000/sessions/{session_id}")
            duration = time.time() - start
            metrics.record("api_fetch_session", duration)
            print(f"  ✓ Fetch session: {duration*1000:.1f}ms")

            # List sessions
            start = time.time()
            resp = await client.get("http://backend:8000/sessions?user_id=perf-test-user")
            duration = time.time() - start
            if resp.status_code == 200:
                sessions = resp.json()
                metrics.record("api_list_sessions", duration, {"count": len(sessions)})
                print(f"  ✓ List sessions: {len(sessions)} found ({duration*1000:.1f}ms)")
        else:
            print(f"  ✗ Create session failed: {resp.status_code}")


async def test_message_operations():
    """Test message creation and retrieval"""
    print("\n[5/8] Message Operations...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Create test session
        resp = await client.post(
            "http://backend:8000/sessions",
            json={
                "user_id": "perf-test-user",
                "department": "test-dept",
                "title": "Message Test"
            }
        )
        session_id = resp.json()["id"]

        # Add messages
        test_messages = [
            "Biểu giá dịch vụ cảng là gì?",
            "Chi phí lưu container như thế nào?",
            "Quy trình xuất nhập khẩu thế nào?"
        ]

        for i, msg in enumerate(test_messages):
            start = time.time()
            resp = await client.post(
                f"http://backend:8000/sessions/{session_id}/messages",
                json={"content": msg, "role": "user"}
            )
            duration = time.time() - start

            if resp.status_code == 201:
                metrics.record("api_add_message", duration, {"length": len(msg)})
                print(f"  ✓ Add message {i+1}: {duration*1000:.1f}ms")
            else:
                print(f"  ✗ Add message {i+1} failed: {resp.status_code}")


async def test_document_list():
    """Test document listing"""
    print("\n[6/8] Document Operations...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        start = time.time()
        resp = await client.get("http://backend:8000/upload?user_id=perf-test-user")
        duration = time.time() - start

        if resp.status_code == 200:
            docs = resp.json()
            metrics.record("api_list_documents", duration, {"count": len(docs)})
            print(f"  ✓ List documents: {len(docs)} found ({duration*1000:.1f}ms)")
        else:
            print(f"  ✗ List documents failed: {resp.status_code}")


async def test_search_endpoint():
    """Test semantic search endpoint"""
    print("\n[7/8] Semantic Search...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        queries = [
            "biểu giá dịch vụ",
            "chi phí container",
            "quy trình hải quan"
        ]

        for i, query in enumerate(queries):
            start = time.time()
            resp = await client.post(
                "http://backend:8000/sessions/search",
                json={
                    "user_id": "perf-test-user",
                    "department": "test-dept",
                    "query": query,
                    "limit": 10
                }
            )
            duration = time.time() - start

            if resp.status_code == 200:
                results = resp.json()
                metrics.record("api_semantic_search", duration, {
                    "results": len(results),
                    "query_length": len(query)
                })
                print(f"  ✓ Search '{query[:20]}...': {len(results)} results ({duration*1000:.1f}ms)")
            else:
                print(f"  ✗ Search {i+1} failed: {resp.status_code}")


async def test_concurrent_requests():
    """Test concurrent API requests"""
    print("\n[8/8] Concurrent Requests...")

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Create session first
        resp = await client.post(
            "http://backend:8000/sessions",
            json={
                "user_id": "perf-test-user",
                "department": "test-dept",
                "title": "Concurrent Test"
            }
        )
        session_id = resp.json()["id"]

        async def add_message(msg: str, idx: int):
            start = time.time()
            try:
                resp = await client.post(
                    f"http://backend:8000/sessions/{session_id}/messages",
                    json={"content": msg, "role": "user"}
                )
                duration = time.time() - start
                return (idx, duration, resp.status_code)
            except Exception as e:
                return (idx, -1, str(e))

        messages = [
            "Câu hỏi 1", "Câu hỏi 2", "Câu hỏi 3",
            "Câu hỏi 4", "Câu hỏi 5"
        ]

        start = time.time()
        results = await asyncio.gather(*[add_message(m, i) for i, m in enumerate(messages)])
        total_duration = time.time() - start

        successful = [r for r in results if r[2] == 201]
        metrics.record("concurrent_messages", total_duration, {
            "total": len(messages),
            "successful": len(successful),
            "concurrency": len(messages)
        })
        print(f"  ✓ {len(successful)}/{len(messages)} requests in {total_duration*1000:.1f}ms")


async def main():
    print("="*80)
    print("🚀 ChatSNP RAG PERFORMANCE TEST")
    print("="*80)
    print("Testing: Backend API, Qdrant, PostgreSQL")
    print("="*80)

    try:
        await test_backend_health()
        await test_qdrant_operations()
        await test_database_queries()
        await test_session_crud()
        await test_message_operations()
        await test_document_list()
        await test_search_endpoint()
        await test_concurrent_requests()

    except KeyboardInterrupt:
        print("\n\n⚠ Test interrupted")
    except Exception as e:
        print(f"\n\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        metrics.report()


if __name__ == "__main__":
    asyncio.run(main())
