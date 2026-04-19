"""
Test RAG với tài liệu "Biểu giá dịch vụ.pdf"
Upload document → Hỏi 10 câu → Đánh giá độ chính xác & thời gian
"""

import asyncio
import time
import httpx
from pathlib import Path
import json


class RAGTester:
    def __init__(self):
        self.backend_url = "http://localhost:8000"
        self.test_user_id = "rag-test-user"
        self.test_department = "test-dept"
        self.session_id = None
        self.document_id = None
        self.results = []

    async def upload_document(self, file_path: str):
        """Upload PDF document"""
        print("\n" + "="*80)
        print("📤 UPLOADING DOCUMENT")
        print("="*80)

        async with httpx.AsyncClient(timeout=120.0) as client:
            # First, check for existing documents
            list_resp = await client.get(
                f"{self.backend_url}/upload",
                params={"user_id": self.test_user_id}
            )

            if list_resp.status_code == 200:
                docs = list_resp.json()
                filename = Path(file_path).name

                # Find matching document
                for doc in docs:
                    if doc["filename"] == filename:
                        doc_id = doc["id"]
                        status = doc["status"]

                        print(f"Found existing document: {filename}")
                        print(f"  Status: {status}")

                        # Delete if processing/error
                        if status in ["processing", "error"]:
                            print(f"  Deleting stuck document...")
                            del_resp = await client.delete(
                                f"{self.backend_url}/upload/{doc_id}/cancel"
                            )
                            print(f"  Deleted: {del_resp.status_code}")
                        elif status == "ready":
                            # Use existing ready document
                            self.document_id = doc_id
                            chunk_count = doc.get("chunk_count", 0)
                            print(f"  ✓ Using ready document")
                            print(f"  Document ID: {self.document_id}")
                            print(f"  Chunks: {chunk_count}")
                            return True

            # Upload new document
            start = time.time()

            with open(file_path, 'rb') as f:
                files = {"file": (Path(file_path).name, f, "application/pdf")}
                data = {
                    "user_id": self.test_user_id,
                    "department": self.test_department,
                    "is_public": "true"
                }

                print(f"\nUploading: {Path(file_path).name}")
                print(f"Size: {Path(file_path).stat().st_size / 1024:.1f} KB")

                response = await client.post(
                    f"{self.backend_url}/upload",
                    files=files,
                    data=data
                )

            upload_time = time.time() - start

            if response.status_code in [200, 201]:
                doc_data = response.json()
                self.document_id = doc_data.get("id") or doc_data.get("document_id")
                print(f"✓ Upload successful: {upload_time:.2f}s")
                print(f"  Document ID: {self.document_id}")
            elif response.status_code == 409:
                # Document exists, get ID from error detail
                error_detail = response.json().get("detail", {})
                if isinstance(error_detail, dict):
                    self.document_id = error_detail.get("existing_document_id")
                    if self.document_id:
                        print(f"⚠ Document exists, using ID: {self.document_id}")
                    else:
                        print(f"✗ Could not get document ID from response")
                        return False
                else:
                    print(f"✗ Upload conflict: {response.status_code}")
                    return False

                # Wait for processing
                print("\n⏳ Waiting for document processing...")
                max_wait = 120
                poll_interval = 3
                elapsed = 0

                while elapsed < max_wait:
                    await asyncio.sleep(poll_interval)
                    elapsed += poll_interval

                    status_resp = await client.get(
                        f"{self.backend_url}/upload/{self.document_id}/status"
                    )

                    if status_resp.status_code == 200:
                        status_data = status_resp.json()
                        status = status_data.get("status")

                        if status == "ready":
                            process_time = time.time() - start
                            chunk_count = status_data.get("chunk_count", 0)
                            extractor = status_data.get("extractor_used", "N/A")

                            print(f"\n✓ Processing complete!")
                            print(f"  Total time: {process_time:.2f}s")
                            print(f"  Chunks created: {chunk_count}")
                            print(f"  Extractor: {extractor}")

                            return True
                        elif status == "error":
                            error_msg = status_data.get("error_message", "Unknown error")
                            print(f"\n✗ Processing failed: {error_msg}")
                            return False
                        else:
                            print(f"  [{elapsed}s] Status: {status}...")

                print(f"\n⚠ Timeout after {max_wait}s")
                return False
            else:
                print(f"✗ Upload failed: {response.status_code}")
                return False

    async def create_session(self):
        """Create chat session"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.backend_url}/sessions",
                json={
                    "user_id": self.test_user_id,
                    "department": self.test_department,
                    "title": "RAG Test - Biểu giá dịch vụ"
                }
            )

            if response.status_code in [200, 201]:
                self.session_id = response.json()["id"]
                print(f"\n✓ Session created: {self.session_id}")
                return True
            return False

    async def ask_question(self, question: str, expected_keywords: list = None):
        """Ask a RAG question and measure performance"""
        async with httpx.AsyncClient(timeout=90.0) as client:
            print(f"\n{'─'*80}")
            print(f"❓ Question: {question}")

            start = time.time()

            # Send message with RAG mode
            response = await client.post(
                f"{self.backend_url}/sessions/{self.session_id}/messages",
                json={
                    "content": question,
                    "role": "user",
                    "mode": "rag"
                }
            )

            if response.status_code != 201:
                print(f"✗ Failed to send message: {response.status_code}")
                return None

            # Wait for Celery processing
            await asyncio.sleep(5)

            # Fetch session with messages
            session_resp = await client.get(f"{self.backend_url}/sessions/{self.session_id}")

            elapsed = time.time() - start

            if session_resp.status_code == 200:
                messages = session_resp.json().get("messages", [])
                assistant_msgs = [m for m in messages if m["role"] == "assistant"]

                if assistant_msgs:
                    last_response = assistant_msgs[-1]
                    content = last_response.get("content", "")
                    has_citations = "---" in content or "Nguồn:" in content

                    # Check if answer contains expected keywords
                    accuracy = "N/A"
                    if expected_keywords:
                        found_keywords = sum(1 for kw in expected_keywords if kw.lower() in content.lower())
                        accuracy = f"{found_keywords}/{len(expected_keywords)} keywords"

                    result = {
                        "question": question,
                        "time_ms": elapsed * 1000,
                        "response_length": len(content),
                        "has_citations": has_citations,
                        "accuracy": accuracy,
                        "response": content[:200] + "..." if len(content) > 200 else content
                    }

                    self.results.append(result)

                    print(f"⏱  Time: {elapsed*1000:.0f}ms")
                    print(f"📝 Response length: {len(content)} chars")
                    print(f"🔗 Has citations: {'✓' if has_citations else '✗'}")
                    if expected_keywords:
                        print(f"✓ Accuracy: {accuracy}")
                    print(f"\n💬 Answer preview:")
                    print(f"   {content[:300]}...")

                    return result
                else:
                    print(f"⚠ No response yet after {elapsed:.1f}s")

            return None

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("📊 TEST SUMMARY")
        print("="*80)

        if not self.results:
            print("No results to display")
            return

        times = [r["time_ms"] for r in self.results]
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)

        with_citations = sum(1 for r in self.results if r["has_citations"])

        print(f"\nTotal questions: {len(self.results)}")
        print(f"\n⏱  Response Times:")
        print(f"   Average: {avg_time:.0f}ms")
        print(f"   Min: {min_time:.0f}ms")
        print(f"   Max: {max_time:.0f}ms")
        print(f"\n🔗 Citations: {with_citations}/{len(self.results)} responses")

        print(f"\n📋 Detailed Results:")
        print(f"\n{'#':<3} {'Time (ms)':<10} {'Length':<8} {'Citations':<10} {'Accuracy':<15}")
        print("─" * 80)

        for i, r in enumerate(self.results, 1):
            citations_mark = "✓" if r["has_citations"] else "✗"
            print(f"{i:<3} {r['time_ms']:<10.0f} {r['response_length']:<8} {citations_mark:<10} {r['accuracy']:<15}")

        # Rating
        if avg_time < 1500:
            rating = "🟢 EXCELLENT"
        elif avg_time < 3000:
            rating = "🟡 GOOD"
        elif avg_time < 5000:
            rating = "🟠 ACCEPTABLE"
        else:
            rating = "🔴 SLOW"

        print(f"\n🎯 Overall Rating: {rating}")
        print("="*80 + "\n")


async def main():
    # Test questions about biểu giá dịch vụ
    test_questions = [
        {
            "q": "Giá dịch vụ xếp dỡ container 20 feet là bao nhiêu?",
            "keywords": ["container", "20", "feet", "xếp", "dỡ"]
        },
        {
            "q": "Chi phí lưu bãi container tính như thế nào?",
            "keywords": ["lưu", "bãi", "container", "ngày"]
        },
        {
            "q": "Có những loại dịch vụ nào tại cảng?",
            "keywords": ["dịch vụ", "cảng"]
        },
        {
            "q": "Giá container 40 feet khác gì so với 20 feet?",
            "keywords": ["container", "40", "20", "feet"]
        },
        {
            "q": "Thời gian lưu bãi miễn phí là bao lâu?",
            "keywords": ["lưu", "bãi", "miễn phí", "ngày"]
        },
        {
            "q": "Dịch vụ kiểm hóa có giá bao nhiêu?",
            "keywords": ["kiểm", "hóa", "giá"]
        },
        {
            "q": "Có phụ phí nào khi làm việc ngoài giờ không?",
            "keywords": ["phụ phí", "ngoài giờ"]
        },
        {
            "q": "Chi phí cho hàng nguy hiểm như thế nào?",
            "keywords": ["hàng", "nguy hiểm", "chi phí"]
        },
        {
            "q": "Quy định về thanh toán dịch vụ ra sao?",
            "keywords": ["thanh toán", "quy định"]
        },
        {
            "q": "Có ưu đãi gì cho khách hàng thường xuyên không?",
            "keywords": ["ưu đãi", "khách hàng"]
        }
    ]

    tester = RAGTester()

    # 1. Upload document
    pdf_path = "/Volumes/orical/ChatSNP/Biểu giá dịch vụ.pdf"

    if not await tester.upload_document(pdf_path):
        print("Failed to upload document. Exiting.")
        return

    # 2. Create session
    if not await tester.create_session():
        print("Failed to create session. Exiting.")
        return

    # 3. Ask questions
    print("\n" + "="*80)
    print("🤖 TESTING RAG QUERIES")
    print("="*80)

    for i, item in enumerate(test_questions, 1):
        print(f"\n[{i}/10]")
        await tester.ask_question(item["q"], item.get("keywords"))
        await asyncio.sleep(1)  # Small delay between questions

    # 4. Print summary
    tester.print_summary()


if __name__ == "__main__":
    print("="*80)
    print("🔬 RAG ACCURACY & PERFORMANCE TEST")
    print("📄 Document: Biểu giá dịch vụ.pdf")
    print("="*80)

    asyncio.run(main())
