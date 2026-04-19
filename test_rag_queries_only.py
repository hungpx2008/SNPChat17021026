"""
Test RAG queries only (skip document upload)
"""

import asyncio
import time
import httpx


async def test_rag():
    backend = "http://localhost:8000"
    user_id = "rag-test-user"
    dept = "test-dept"

    # Test questions
    questions = [
        "Giá dịch vụ xếp dỡ container 20 feet là bao nhiêu?",
        "Chi phí lưu bãi container tính như thế nào?",
        "Có những loại dịch vụ nào tại cảng?",
        "Giá container 40 feet khác gì so với 20 feet?",
        "Thời gian lưu bãi miễn phí là bao lâu?",
        "Dịch vụ kiểm hóa có giá bao nhiêu?",
        "Có phụ phí nào khi làm việc ngoài giờ không?",
        "Chi phí cho hàng nguy hiểm như thế nào?",
        "Quy định về thanh toán dịch vụ ra sao?",
        "Có ưu đãi gì cho khách hàng thường xuyên không?"
    ]

    print("="*80)
    print("🔬 RAG QUERY TEST - Biểu giá dịch vụ")
    print("="*80)

    async with httpx.AsyncClient(timeout=90.0) as client:
        # Create session
        resp = await client.post(f"{backend}/sessions", json={
            "user_id": user_id,
            "department": dept,
            "title": "RAG Test"
        })
        session_id = resp.json()["id"]
        print(f"\n✓ Session: {session_id}\n")

        results = []

        for i, q in enumerate(questions, 1):
            print(f"[{i}/10] {q}")

            start = time.time()

            # Send RAG query
            await client.post(
                f"{backend}/sessions/{session_id}/messages",
                json={"content": q, "role": "user", "mode": "rag"}
            )

            # Wait for processing
            await asyncio.sleep(5)

            # Get response
            sess = await client.get(f"{backend}/sessions/{session_id}")
            msgs = sess.json().get("messages", [])
            assistant = [m for m in msgs if m["role"] == "assistant"]

            elapsed = time.time() - start

            if assistant:
                answer = assistant[-1]["content"]
                has_cite = "---" in answer or "Nguồn" in answer

                results.append({
                    "time": elapsed * 1000,
                    "length": len(answer),
                    "citations": has_cite
                })

                print(f"  ⏱  {elapsed*1000:.0f}ms | 📝 {len(answer)} chars | 🔗 {'✓' if has_cite else '✗'}")
                print(f"  💬 {answer[:150]}...\n")
            else:
                print(f"  ✗ No response\n")

        # Summary
        print("="*80)
        print("📊 RESULTS")
        print("="*80)

        if results:
            times = [r["time"] for r in results]
            avg = sum(times) / len(times)

            print(f"\nQueries: {len(results)}/10")
            print(f"Avg time: {avg:.0f}ms")
            print(f"Min: {min(times):.0f}ms")
            print(f"Max: {max(times):.0f}ms")
            print(f"With citations: {sum(1 for r in results if r['citations'])}/{len(results)}")

            if avg < 1500:
                rating = "🟢 EXCELLENT"
            elif avg < 3000:
                rating = "🟡 GOOD"
            else:
                rating = "🔴 SLOW"

            print(f"\nRating: {rating}")

        print("="*80)


asyncio.run(test_rag())
