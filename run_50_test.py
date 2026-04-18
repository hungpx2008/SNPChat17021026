#!/usr/bin/env python3
"""Batch 50-question test runner — runs inside docker via exec."""
import json
import sys
import time
import subprocess
import os

os.environ["PATH"] = os.path.expanduser("~/.docker/bin") + ":" + os.environ.get("PATH", "")

SESSION_ID = "76cc08ad-c796-4b8d-8375-31c38c7d7ab3"
QUESTIONS_FILE = "/Volumes/orical/ChatSNP/test_50_questions.json"
RESULTS_FILE = "/Volumes/orical/ChatSNP/test_50_results.json"

with open(QUESTIONS_FILE) as f:
    questions = json.load(f)

start = int(sys.argv[1]) if len(sys.argv) > 1 else 1  # start from Q2 since Q1 done
end = int(sys.argv[2]) if len(sys.argv) > 2 else 50

results = []

# Load existing results if any
try:
    with open(RESULTS_FILE) as f:
        results = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    pass

for q in questions:
    q_id = q["id"]
    if q_id < start or q_id > end:
        continue

    # Skip if already answered
    if any(r["id"] == q_id and r.get("answer") for r in results):
        print(f"[Q{q_id}] Already answered, skipping")
        continue

    question = q["q"]
    print(f"\n[Q{q_id}] {question}")

    # Send via docker exec
    payload = json.dumps({
        "content": question,
        "role": "user",
        "user_id": "test-user-e2e",
        "department": "operations",
        "mode": "rag"
    })

    try:
        r = subprocess.run(
            ["docker", "exec", "chatsnp-backend", "curl", "-s", "-X", "POST",
             f"http://localhost:8000/sessions/{SESSION_ID}/messages",
             "-H", "Content-Type: application/json",
             "-d", payload],
            capture_output=True, text=True, timeout=30
        )
        msg = json.loads(r.stdout)
        msg_id = msg.get("id", "")
        print(f"  Sent: {msg_id}")
    except Exception as e:
        print(f"  ❌ Send error: {e}")
        results.append({"id": q_id, "question": question, "answer": "", "error": str(e)})
        continue

    # Wait for RAG response
    time.sleep(20)

    # Poll for answer (check session messages)
    answer = ""
    for attempt in range(6):
        try:
            r = subprocess.run(
                ["docker", "exec", "chatsnp-backend", "curl", "-s",
                 f"http://localhost:8000/sessions/{SESSION_ID}"],
                capture_output=True, text=True, timeout=15
            )
            data = json.loads(r.stdout)
            msgs = data.get("messages", [])
            # Find last assistant message after our user message
            found_user = False
            for m in msgs:
                if m["id"] == msg_id:
                    found_user = True
                elif found_user and m["role"] == "assistant":
                    content = m.get("content", "")
                    if content and "đang xử lý" not in content.lower():
                        answer = content
            if answer:
                break
        except Exception:
            pass
        time.sleep(10)

    if answer:
        short = answer[:200].replace("\n", " ")
        print(f"  ✅ {short}...")
    else:
        print(f"  ⏳ No answer yet")

    results.append({
        "id": q_id,
        "question": question,
        "answer": answer,
    })

    # Save incrementally
    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    time.sleep(2)

# Summary
print(f"\n{'='*60}")
answered = sum(1 for r in results if r.get("answer"))
print(f"Total: {len(results)}, Answered: {answered}")
print(f"Results: {RESULTS_FILE}")
