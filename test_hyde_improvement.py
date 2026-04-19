#!/usr/bin/env python3
"""
Test script để kiểm tra cải thiện HyDE + Context-aware chunking.

Test case:
1. Upload PDF "Phương án triển khai AI Agent.pdf"
2. Query: "Tech stack đề xuất Mô hình / AI"
3. Query: "TIMELINE TRIỂN KHAI ĐỀ XUẤT"

Expected results:
- TRƯỚC: similarity score 0.033, 0.024 → KHÔNG TÌM THẤY
- SAU: similarity score 0.5+ → TÌM THẤY với context đầy đủ
"""

import requests
import time
import json

BACKEND_URL = "http://localhost:8000"
PDF_PATH = "/Volumes/orical/ChatSNP/[TCSGxEONSR] Phương án triển khai AI Agent.pdf"

def upload_document(file_path: str) -> dict:
    """Upload PDF và đợi xử lý xong."""
    print(f"\n📤 Uploading: {file_path}")

    with open(file_path, "rb") as f:
        files = {"file": f}
        resp = requests.post(f"{BACKEND_URL}/documents/upload", files=files)
        resp.raise_for_status()
        result = resp.json()

    doc_id = result["document_id"]
    print(f"✅ Document ID: {doc_id}")
    print(f"⏳ Status: {result['status']}")

    # Poll status until ready
    max_wait = 300  # 5 minutes
    start = time.time()

    while time.time() - start < max_wait:
        resp = requests.get(f"{BACKEND_URL}/documents/{doc_id}")
        resp.raise_for_status()
        doc = resp.json()

        status = doc.get("status")
        print(f"   Status: {status} ({doc.get('chunk_count', 0)} chunks)")

        if status == "ready":
            print(f"✅ Processing complete!")
            print(f"   Extractor: {doc.get('extractor_used')}")
            print(f"   Chunks: {doc.get('chunk_count')}")
            print(f"   Metadata: {json.dumps(doc.get('metadata', {}), indent=2)}")
            return doc
        elif status == "error":
            print(f"❌ Error: {doc.get('error_message')}")
            return doc

        time.sleep(3)

    print(f"⚠️ Timeout after {max_wait}s")
    return {}

def test_rag_search(query: str) -> dict:
    """Test RAG search với query."""
    print(f"\n🔍 Testing RAG search: '{query}'")

    # Create session
    resp = requests.post(f"{BACKEND_URL}/sessions", json={"agent_mode": "rag"})
    resp.raise_for_status()
    session = resp.json()
    session_id = session["id"]
    print(f"   Session ID: {session_id}")

    # Send message
    resp = requests.post(
        f"{BACKEND_URL}/sessions/{session_id}/messages",
        json={"content": query, "role": "user"}
    )
    resp.raise_for_status()
    message = resp.json()
    print(f"   Message sent, waiting for response...")

    # Wait for assistant response
    max_wait = 60
    start = time.time()

    while time.time() - start < max_wait:
        resp = requests.get(f"{BACKEND_URL}/sessions/{session_id}?limit=10")
        resp.raise_for_status()
        session_data = resp.json()

        messages = session_data.get("messages", [])
        assistant_msgs = [m for m in messages if m["role"] == "assistant"]

        if assistant_msgs:
            last_msg = assistant_msgs[-1]
            content = last_msg.get("content", "")
            metadata = last_msg.get("metadata", {})

            print(f"\n📝 Response:")
            print(f"   Length: {len(content)} chars")
            print(f"   Metadata: {json.dumps(metadata, indent=2, ensure_ascii=False)}")
            print(f"\n   Content preview:")
            print(f"   {content[:500]}...")

            return {
                "session_id": session_id,
                "content": content,
                "metadata": metadata,
            }

        time.sleep(2)

    print(f"⚠️ No response after {max_wait}s")
    return {}

def main():
    print("="*80)
    print("🧪 Testing HyDE + Context-Aware Chunking Improvements")
    print("="*80)

    # Step 1: Upload PDF (comment out if already uploaded)
    print("\n" + "="*80)
    print("STEP 1: Upload PDF")
    print("="*80)
    doc = upload_document(PDF_PATH)

    if doc.get("status") != "ready":
        print("❌ Document processing failed, cannot proceed with tests")
        return

    # Wait a bit for indexing to complete
    print("\n⏳ Waiting 5s for indexing to complete...")
    time.sleep(5)

    # Step 2: Test queries
    print("\n" + "="*80)
    print("STEP 2: Test RAG Queries")
    print("="*80)

    test_queries = [
        "Tech stack đề xuất Mô hình / AI",
        "TIMELINE TRIỂN KHAI ĐỀ XUẤT",
        "Phương án HyDE là gì",
    ]

    results = []
    for query in test_queries:
        result = test_rag_search(query)
        results.append({"query": query, **result})
        time.sleep(2)

    # Summary
    print("\n" + "="*80)
    print("📊 SUMMARY")
    print("="*80)

    for r in results:
        query = r["query"]
        content = r.get("content", "")
        has_content = "✅" if len(content) > 100 else "❌"
        print(f"{has_content} Query: '{query}'")
        print(f"    Response: {len(content)} chars")
        if content and "không tìm thấy" not in content.lower():
            print(f"    Status: FOUND ✅")
        else:
            print(f"    Status: NOT FOUND ❌")
        print()

if __name__ == "__main__":
    main()
