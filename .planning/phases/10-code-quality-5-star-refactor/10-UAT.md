---
status: testing
phase: 10-code-quality-5-star-refactor
source: 10-01-SUMMARY.md, 10-02-SUMMARY.md, 10-03-SUMMARY.md, 10-04-SUMMARY.md, 10-05-SUMMARY.md
started: 2026-04-17T14:20:00Z
updated: 2026-04-17T14:35:00Z
---

## Current Test

number: 6
name: Chat Sidebar — History & Search
expected: |
  Sidebar shows past chats grouped by "Hôm nay / Hôm qua / [date]"
  (useChatGrouping hook). ChatHistorySection renders list with delete
  action. SearchSection returns matching sessions. New-chat and sign-out
  IconButtons work with tooltips.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill running containers. Run `docker compose --env-file .env up -d --build`. All 10 services boot without errors. Backend `/health` returns 200. Frontend loads. No import errors from refactored modules (docling/, rag/, task_dispatcher, cors helper).
result: [pending]

### 2. Chat Mode — Basic Message
expected: Open frontend, start new chat in `chat` mode, send a Vietnamese message. Bot streams a response via SSE. Message renders in chat-message-list without formatting glitches (after BotMessageContent/AttachmentRenderer split).
result: [pending]

### 3. RAG Mode — Document Query
expected: Switch to `rag` mode, ask a question that requires document context. Backend uses refactored `rag/` subpackage (context.py, search_helpers.py, synthesis.py). Answer streams with citations footer. Vietnamese content preserved.
result: [pending]

### 4. SQL Mode — Vanna Query
expected: Switch to `sql` mode, ask a database question. Vanna agent returns SQL + result. Task dispatcher routes to correct Celery task (services/task_dispatcher.py).
result: [pending]

### 5. File Upload — Document Processing
expected: Upload a PDF/docx. Docling pipeline (split into parser/chunker/table_detector/orchestrator) processes it. Upload has AbortController timeout. Frontend shows progress, then chunks appear queryable in RAG mode.
result: issue
reported: "performance không như mong đợi — upload `Biểu giá dịch vụ.pdf` (805KB): POST /upload 201 trong 78ms, nhưng Celery worker chạy Docling xử lý quá 418s (7 phút) vẫn status=processing, chunks=0, không ghi point mới vào Qdrant port_knowledge"
severity: major
tested_file: /Volumes/orical/ChatSNP/Biểu giá dịch vụ.pdf (805 KB)
doc_id: f2ae42c2-6e1b-4914-bf17-a4061408fbe3
elapsed_still_processing_sec: 418
suspected_causes:
  - DOCLING_VLM_ENABLED=true + MAX_IMAGES=10 (VLM call per image via OpenRouter is slow)
  - worker_media concurrency=1 (single process bottleneck)
  - AdaptiveTableSerializer + GROUP_LOCK O(n) on table-heavy PDFs
  - Mem0 /embed on port 8888 not reachable from host (may hang silently)
  - No Celery soft_time_limit → task cannot be killed
  - No progress tracking (only processing/ready/error, no stage/chunk counter)

### 6. Chat Sidebar — History & Search
expected: Sidebar shows past chats grouped by "Hôm nay / Hôm qua / [date]" (useChatGrouping hook). ChatHistorySection renders list with delete action. SearchSection returns matching sessions. New-chat and sign-out IconButtons work with tooltips.
result: [pending]

### 7. CORS & Error Handling
expected: Trigger a backend error (e.g., invalid session ID). Frontend receives error with typed `BackendError` (isNotFound/isUnauthorized/isServerError). Response headers include explicit `Access-Control-Allow-Methods` (not `*`). No CORS errors in browser console.
result: [pending]

### 8. SSE Stream — Session Stream
expected: Send chat message, observe `/sessions/{id}/stream` SSE endpoint. Refactored `build_cors_headers()` in api/chat.py emits explicit headers. Stream delivers tokens progressively without disconnects. Request timeout (AbortController) does not fire prematurely for short messages.
result: [pending]

## Summary

total: 8
passed: 0
issues: 1
pending: 7
skipped: 0
blocked: 0

## Gaps

- truth: "Docling pipeline processes uploaded PDF and writes chunks to Qdrant port_knowledge within reasonable time (< 2 min for ~1MB file)"
  status: failed
  reason: "User reported: performance không như mong đợi — upload Biểu giá dịch vụ.pdf (805KB) đã chạy >418s, status vẫn processing, 0 chunks"
  severity: major
  test: 5
  root_cause: "Multiple factors: (1) DOCLING_VLM_ENABLED=true calls VLM via OpenRouter per image (max 10); (2) worker_media concurrency=1 serializes all media tasks; (3) no Celery soft_time_limit/time_limit — tasks can hang indefinitely; (4) Mem0 service at :8888 unreachable from host (embedding calls may be timing out); (5) no per-stage progress tracking"
  artifacts:
    - path: "chatSNP170226/docker-compose.yml:183"
      issue: "worker_media -c 1 (single concurrency)"
    - path: "chatSNP170226/.env"
      issue: "DOCLING_VLM_ENABLED=true, DOCLING_VLM_MAX_IMAGES=10"
    - path: "chatSNP170226/backend/src/worker/media_tasks.py"
      issue: "No @celery_app.task(soft_time_limit=..., time_limit=...) decorator"
    - path: "chatSNP170226/backend/src/services/docling/orchestrator.py"
      issue: "No per-stage timing logs / progress updates to documents.meta"
  missing:
    - "Disable VLM by default or batch VLM calls (DOCLING_VLM_ENABLED=false)"
    - "Increase worker_media concurrency to 2 or 3"
    - "Add soft_time_limit=300, time_limit=600 to process_document task"
    - "Verify mem0 service health before upload, fail fast on unreachable"
    - "Emit per-stage progress (parse/chunk/embed/upsert) to documents.meta"
    - "Cache Docling converter singleton per worker process"
  debug_session: ".planning/debug/phase10-upload-perf.md"
