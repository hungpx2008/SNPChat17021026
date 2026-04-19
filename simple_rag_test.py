"""
Simple RAG Query Test - Use existing data in Qdrant
Test 10 questions about port services with timing
"""

import asyncio
import time
import httpx
from datetime import datetime


# Test questions về dịch vụ cảng
TEST_QUESTIONS = [
    "Giá dịch vụ xếp dỡ container 20 feet là bao nhiêu?",
    "Chi phí lưu bãi container tính như thế nào?",
    "Có những loại dịch vụ nào tại cảng?",
    "Giá container 40 feet khác gì so với 20 feet?",
    "Thời gian lưu bãi miễn phí là bao lâu?",
    "Dịch vụ kiểm hóa có giá bao nhiêu?",
    "Có phụ phí nào khi làm việc ngoài giờ không?",
    "Chi phí cho hàng nguy hiểm như thế nào?",
    "Quy định về thanh toán dịch vụ ra sao?",
    "Có ưu đãi gì cho khách hàng thường xuyên không?",
]


async def create_session():
    """Create test session"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "http://localhost:8000/sessions",
            json={
                "user_id": "rag-test-user",
                "department": "test",
                "title": f"RAG Test - {datetime.now().strftime('%H:%M:%S')}"
            }
        )
        if resp.status_code in [200, 201]:
            return resp.json()["id"]
        return None


async def ask_rag_question(session_id: str, question: str, index: int):
    """Ask a RAG question and measure time"""
    async with httpx.AsyncClient(timeout=90.0) as client:
        print(f"\n{'='*80}")
        print(f"[{index}/10] ❓ {question}")
        print(f"{'='*80}")

        start = time.time()

        # Send RAG query
        resp = await client.post(
            f"http://localhost:8000/sessions/{session_id}/messages",
            json={
                "content": question,
                "role": "user",
                "mode": "rag"
            }
        )

        if resp.status_code != 201:
            print(f"❌ Failed to send: {resp.status_code}")
            return None

        # Wait for Celery processing
        print("⏳ Waiting for RAG processing...")
        await asyncio.sleep(6)

        # Get response
        session_resp = await client.get(f"http://localhost:8000/sessions/{session_id}")
        elapsed = time.time() - start

        if session_resp.status_code == 200:
            messages = session_resp.json().get("messages", [])
            assistant_msgs = [m for m in messages if m["role"] == "assistant"]

            if assistant_msgs:
                answer = assistant_msgs[-1]["content"]
                has_citations = "---" in answer or "Nguồn:" in answer

                print(f"\n⏱️  Thời gian: {elapsed*1000:.0f}ms ({elapsed:.2f}s)")
                print(f"📏 Độ dài: {len(answer)} ký tự")
                print(f"📎 Citations: {'✅' if has_citations else '❌'}")
                print(f"\n💬 Câu trả lời:")
                print("─" * 80)
                print(answer[:500])
                if len(answer) > 500:
                    print(f"\n... (còn {len(answer) - 500} ký tự)")
                print("─" * 80)

                return {
                    "question": question,
                    "time_ms": elapsed * 1000,
                    "length": len(answer),
                    "has_citations": has_citations,
                    "answer": answer
                }
            else:
                print(f"⚠️  Chưa có response sau {elapsed:.1f}s")

        return None


async def main():
    print("="*80)
    print("🔬 RAG ACCURACY & PERFORMANCE TEST")
    print("📊 Testing với 390 documents có sẵn trong Qdrant")
    print("="*80)

    # Create session
    print("\n📝 Creating test session...")
    session_id = await create_session()
    if not session_id:
        print("❌ Failed to create session")
        return
    print(f"✅ Session ID: {session_id}")

    # Ask questions
    results = []
    for i, question in enumerate(TEST_QUESTIONS, 1):
        result = await ask_rag_question(session_id, question, i)
        if result:
            results.append(result)
        await asyncio.sleep(2)  # Small delay

    # Summary
    print("\n" + "="*80)
    print("📊 KẾT QUẢ TỔNG HỢP")
    print("="*80)

    if not results:
        print("❌ Không có kết quả")
        return

    times = [r["time_ms"] for r in results]
    avg_time = sum(times) / len(times)
    min_time = min(times)
    max_time = max(times)

    with_citations = sum(1 for r in results if r["has_citations"])
    avg_length = sum(r["length"] for r in results) / len(results)

    print(f"\n✅ Hoàn thành: {len(results)}/{len(TEST_QUESTIONS)} câu hỏi")
    print(f"\n⏱️  Thời gian phản hồi:")
    print(f"   • Trung bình: {avg_time:.0f}ms ({avg_time/1000:.2f}s)")
    print(f"   • Nhanh nhất: {min_time:.0f}ms ({min_time/1000:.2f}s)")
    print(f"   • Chậm nhất: {max_time:.0f}ms ({max_time/1000:.2f}s)")

    print(f"\n📏 Độ dài câu trả lời:")
    print(f"   • Trung bình: {avg_length:.0f} ký tự")
    print(f"   • Min: {min(r['length'] for r in results)} ký tự")
    print(f"   • Max: {max(r['length'] for r in results)} ký tự")

    print(f"\n📎 Citations:")
    print(f"   • Có citations: {with_citations}/{len(results)} câu")
    print(f"   • Tỷ lệ: {with_citations/len(results)*100:.1f}%")

    # Rating
    if avg_time < 2000:
        rating = "🟢 XUẤT SẮC"
    elif avg_time < 4000:
        rating = "🟡 TỐT"
    elif avg_time < 6000:
        rating = "🟠 CHẤP NHẬN ĐƯỢC"
    else:
        rating = "🔴 CHẬM"

    print(f"\n🎯 Đánh giá tổng thể: {rating}")

    # Detail table
    print(f"\n📋 Chi tiết từng câu:")
    print(f"{'#':<4} {'Thời gian':<12} {'Độ dài':<10} {'Citations':<12}")
    print("─" * 80)
    for i, r in enumerate(results, 1):
        cit = "✅" if r["has_citations"] else "❌"
        print(f"{i:<4} {r['time_ms']:.0f}ms ({r['time_ms']/1000:.1f}s)  {r['length']:<10} {cit}")

    print("\n" + "="*80)

    # Accuracy check
    print("\n🎯 ĐÁNH GIÁ ĐỘ CHÍNH XÁC:")
    print("─" * 80)

    accuracy_notes = []
    for i, r in enumerate(results, 1):
        answer_lower = r["answer"].lower()
        q_lower = r["question"].lower()

        # Check relevance
        if len(r["answer"]) < 50:
            accuracy_notes.append(f"  [{i}] ⚠️  Câu trả lời quá ngắn")
        elif "không tìm thấy" in answer_lower or "không có thông tin" in answer_lower:
            accuracy_notes.append(f"  [{i}] ⚠️  Không tìm thấy thông tin liên quan")
        elif not r["has_citations"]:
            accuracy_notes.append(f"  [{i}] ⚠️  Thiếu nguồn tham chiếu")
        else:
            accuracy_notes.append(f"  [{i}] ✅ OK")

    for note in accuracy_notes:
        print(note)

    print("\n" + "="*80)
    print("✅ Test hoàn tất!")
    print("="*80 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
