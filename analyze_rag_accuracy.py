"""
Deep analysis - Why RAG answers are wrong
"""

import asyncio
import httpx
import json


async def analyze_rag_accuracy():
    backend = "http://localhost:8000"
    user_id = "accuracy-test"
    dept = "test"

    # Test with detailed analysis
    test_cases = [
        {
            "q": "Giá dịch vụ xếp dỡ container 20 feet là bao nhiêu?",
            "expected_keywords": ["20", "feet", "xếp", "dỡ", "VND", "đồng"],
            "expected_info": "Phải có giá cụ thể cho container 20 feet"
        },
        {
            "q": "Chi phí lưu bãi container tính như thế nào?",
            "expected_keywords": ["lưu", "bãi", "ngày", "phí", "tính"],
            "expected_info": "Phải giải thích cách tính phí theo ngày"
        },
        {
            "q": "Có phụ phí nào khi làm việc ngoài giờ không?",
            "expected_keywords": ["phụ phí", "ngoài giờ", "%", "tăng"],
            "expected_info": "Phải nói về phụ phí ngoài giờ, không phải lưu bãi"
        }
    ]

    print("="*80)
    print("🔍 PHÂN TÍCH TẠI SAO MODEL TRẢ LỜI SAI")
    print("="*80)

    async with httpx.AsyncClient(timeout=90.0) as client:
        # Create session
        resp = await client.post(f"{backend}/sessions", json={
            "user_id": user_id,
            "department": dept,
            "title": "Accuracy Analysis"
        })
        session_id = resp.json()["id"]

        for i, case in enumerate(test_cases, 1):
            print(f"\n{'='*80}")
            print(f"TEST CASE {i}")
            print(f"{'='*80}")
            print(f"\n❓ Question: {case['q']}")
            print(f"📋 Expected: {case['expected_info']}")

            # Send query
            await client.post(
                f"{backend}/sessions/{session_id}/messages",
                json={"content": case['q'], "role": "user", "mode": "rag"}
            )

            await asyncio.sleep(6)

            # Get response
            sess = await client.get(f"{backend}/sessions/{session_id}")
            msgs = sess.json().get("messages", [])
            assistant = [m for m in msgs if m["role"] == "assistant"]

            if assistant:
                answer = assistant[-1]["content"]
                metadata = assistant[-1].get("metadata", {})

                print(f"\n💬 Answer ({len(answer)} chars):")
                print(f"{answer}")

                # Check keywords
                print(f"\n🔍 Keyword Analysis:")
                found = []
                missing = []
                for kw in case['expected_keywords']:
                    if kw.lower() in answer.lower():
                        found.append(kw)
                    else:
                        missing.append(kw)

                print(f"  ✓ Found: {', '.join(found) if found else 'None'}")
                print(f"  ✗ Missing: {', '.join(missing) if missing else 'None'}")

                # Check metadata
                print(f"\n📊 Metadata:")
                if metadata:
                    print(f"  {json.dumps(metadata, indent=2, ensure_ascii=False)}")
                else:
                    print(f"  No metadata available")

                # Accuracy verdict
                accuracy = len(found) / len(case['expected_keywords']) * 100
                print(f"\n📈 Accuracy: {accuracy:.0f}% ({len(found)}/{len(case['expected_keywords'])} keywords)")

                if accuracy >= 80:
                    verdict = "✅ CORRECT"
                elif accuracy >= 50:
                    verdict = "⚠️ PARTIAL"
                else:
                    verdict = "✗ WRONG"

                print(f"🎯 Verdict: {verdict}")

            else:
                print(f"\n✗ NO RESPONSE")

        # Now check what's in Qdrant
        print(f"\n\n{'='*80}")
        print("🔍 QDRANT SEARCH ANALYSIS")
        print("="*80)

        # Manual search to see what chunks are retrieved
        for case in test_cases[:1]:  # Just test first one
            print(f"\nQuery: {case['q']}")

            search_resp = await client.post(
                f"{backend}/sessions/search",
                json={
                    "user_id": user_id,
                    "department": dept,
                    "query": case['q'],
                    "limit": 5
                }
            )

            if search_resp.status_code == 200:
                results = search_resp.json()
                print(f"\n📦 Retrieved {len(results)} chunks:")

                for idx, result in enumerate(results, 1):
                    content = result.get("content", "")
                    score = result.get("score", 0)
                    print(f"\n  [{idx}] Score: {score:.3f}")
                    print(f"      Content: {content[:200]}...")


asyncio.run(analyze_rag_accuracy())
