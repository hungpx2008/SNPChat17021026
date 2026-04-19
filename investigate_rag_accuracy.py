"""
Deep Investigation - Why RAG Accuracy is Low (37.5%)
Analyze each step in RAG pipeline to find root cause
"""

import asyncio
import httpx
from qdrant_client import QdrantClient
import json


async def investigate_rag_pipeline():
    """Investigate each step of RAG pipeline"""

    print("="*80)
    print("🔬 ĐIỀU TRA NGUYÊN NHÂN RAG ACCURACY THẤP")
    print("="*80)

    # Test questions that failed
    failed_questions = [
        "Dịch vụ kiểm hóa có giá bao nhiêu?",
        "Có phụ phí nào khi làm việc ngoài giờ không?",
        "Chi phí cho hàng nguy hiểm như thế nào?",
        "Quy định về thanh toán dịch vụ ra sao?",
        "Thời gian lưu bãi miễn phí là bao lâu?"
    ]

    qdrant = QdrantClient(url="http://localhost:6333")

    # Step 1: Check Qdrant data quality
    print("\n" + "─"*80)
    print("BƯỚC 1: KIỂM TRA DỮ LIỆU TRONG QDRANT")
    print("─"*80)

    collection_info = qdrant.get_collection("port_knowledge")
    print(f"\n✓ Collection: port_knowledge")
    print(f"  Total points: {collection_info.points_count}")

    # Sample some points
    print(f"\n📋 Sample 10 documents:")
    scroll_result = qdrant.scroll(
        collection_name="port_knowledge",
        limit=10,
        with_payload=True,
        with_vectors=False
    )

    for i, point in enumerate(scroll_result[0], 1):
        payload = point.payload
        content = payload.get("content") or payload.get("text", "")
        source = payload.get("source_file", "N/A")

        print(f"\n  [{i}] Source: {source}")
        print(f"      Content: {content[:150]}...")

    # Step 2: Test embedding quality
    print(f"\n" + "─"*80)
    print("BƯỚC 2: KIỂM TRA EMBEDDING QUALITY")
    print("─"*80)

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Get embeddings for failed questions
        for question in failed_questions[:2]:  # Test 2 questions
            print(f"\n🔍 Question: {question}")

            # Search in Qdrant with different thresholds
            # We need to get embedding first via backend API
            search_resp = await client.post(
                "http://localhost:8000/sessions/search",
                json={
                    "user_id": "test",
                    "department": "test",
                    "query": question,
                    "limit": 10
                }
            )

            if search_resp.status_code == 200:
                results = search_resp.json()
                print(f"\n  Results found: {len(results)}")

                if results:
                    print(f"\n  Top 3 results:")
                    for i, res in enumerate(results[:3], 1):
                        content = res.get("content", "")[:100]
                        score = res.get("score", 0)
                        print(f"\n  [{i}] Score: {score:.3f}")
                        print(f"      Content: {content}...")
                else:
                    print(f"  ⚠️  NO RESULTS FOUND!")

    # Step 3: Check RAG task logs
    print(f"\n" + "─"*80)
    print("BƯỚC 3: PHÂN TÍCH RAG TASK")
    print("─"*80)

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Create test session
        session_resp = await client.post(
            "http://localhost:8000/sessions",
            json={
                "user_id": "investigation-test",
                "department": "test",
                "title": "Investigation Test"
            }
        )
        session_id = session_resp.json()["id"]

        # Send one failed question
        test_question = "Dịch vụ kiểm hóa có giá bao nhiêu?"
        print(f"\n🧪 Testing: {test_question}")

        msg_resp = await client.post(
            f"http://localhost:8000/sessions/{session_id}/messages",
            json={
                "content": test_question,
                "role": "user",
                "mode": "rag"
            }
        )

        print(f"  Message sent: {msg_resp.status_code}")

        # Wait for processing
        await asyncio.sleep(7)

        # Get response
        session_resp = await client.get(f"http://localhost:8000/sessions/{session_id}")
        messages = session_resp.json().get("messages", [])

        assistant_msgs = [m for m in messages if m["role"] == "assistant"]
        if assistant_msgs:
            answer = assistant_msgs[-1]["content"]
            metadata = assistant_msgs[-1].get("metadata", {})

            print(f"\n  ✓ Got response:")
            print(f"    Length: {len(answer)} chars")
            print(f"    Metadata: {json.dumps(metadata, indent=2, ensure_ascii=False)}")
            print(f"\n  Answer preview:")
            print(f"    {answer[:300]}...")

            # Check if answer is relevant
            keywords = ["kiểm hóa", "kiểm hoá", "giá", "chi phí"]
            found_keywords = [kw for kw in keywords if kw in answer.lower()]

            print(f"\n  Relevance check:")
            print(f"    Keywords found: {found_keywords}")
            print(f"    Relevant: {'YES' if len(found_keywords) >= 2 else 'NO'}")

    # Step 4: Direct Qdrant search with different params
    print(f"\n" + "─"*80)
    print("BƯỚC 4: QDRANT SEARCH VỚI NHIỀU THAM SỐ")
    print("─"*80)

    test_query = "kiểm hóa giá"
    print(f"\nQuery: '{test_query}'")

    # We need embedding - let's search using backend semantic search
    async with httpx.AsyncClient(timeout=30.0) as client:
        for threshold in [0.1, 0.2, 0.25, 0.3, 0.35, 0.4]:
            # Note: Backend search doesn't expose threshold param
            # We'll check later in code
            pass

    print(f"\n⚠️  Backend search API không cho phép tune threshold từ client")
    print(f"   → Cần check code backend để xem threshold hiện tại")


async def check_backend_config():
    """Check backend RAG configuration"""
    print(f"\n" + "─"*80)
    print("BƯỚC 5: KIỂM TRA BACKEND CONFIG")
    print("─"*80)

    print(f"\n📝 Cần check các files sau:")
    print(f"   • backend/src/core/config.py - RAG_SCORE_THRESHOLD")
    print(f"   • backend/src/worker/chat_tasks.py - retriever config")
    print(f"   • backend/src/services/chat_service.py - semantic_search")


async def analyze_document_chunks():
    """Analyze how documents were chunked"""
    print(f"\n" + "─"*80)
    print("BƯỚC 6: PHÂN TÍCH DOCUMENT CHUNKS")
    print("─"*80)

    qdrant = QdrantClient(url="http://localhost:6333")

    # Search for chunks containing specific keywords
    keywords = ["kiểm hóa", "ngoài giờ", "nguy hiểm", "thanh toán", "miễn phí"]

    for keyword in keywords:
        print(f"\n🔎 Searching for: '{keyword}'")

        # We can't do text search in Qdrant directly
        # Need to scroll and filter
        scroll_result = qdrant.scroll(
            collection_name="port_knowledge",
            limit=1000,
            with_payload=True,
            with_vectors=False
        )

        matching_chunks = []
        for point in scroll_result[0]:
            content = point.payload.get("content") or point.payload.get("text", "")
            if keyword in content.lower():
                matching_chunks.append({
                    "id": point.id,
                    "content": content[:200],
                    "source": point.payload.get("source_file", "N/A")
                })

        print(f"   Found {len(matching_chunks)} chunks containing '{keyword}'")

        if matching_chunks:
            print(f"   Sample:")
            for i, chunk in enumerate(matching_chunks[:2], 1):
                print(f"\n   [{i}] {chunk['content']}...")
                print(f"       Source: {chunk['source']}")
        else:
            print(f"   ⚠️  NO CHUNKS FOUND! → Data problem")


async def main():
    print("\n🔬 Starting deep investigation...\n")

    try:
        await investigate_rag_pipeline()
        await check_backend_config()
        await analyze_document_chunks()

        print(f"\n" + "="*80)
        print("📊 TÓM TẮT ĐIỀU TRA")
        print("="*80)

        print(f"""
NGUYÊN NHÂN KHẢ NĂNG GÂY RA ACCURACY THẤP:

1. ❓ DATA QUALITY
   → Cần check: Có đủ chunks chứa keywords không?

2. ❓ EMBEDDING QUALITY
   → Cần check: Embedding có phân biệt được semantic không?

3. ❓ SEARCH THRESHOLD
   → Cần check: Threshold = 0.35 có quá cao không?

4. ❓ RETRIEVAL TOP-K
   → Cần check: Top-5 có đủ không?

5. ❓ LLM PROMPT
   → Cần check: System prompt có đủ rõ ràng không?

KẾ HOẠCH TIẾP THEO:
→ Check source code để tìm exact configuration
→ Test với threshold thấp hơn
→ Xem Celery logs chi tiết
""")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
