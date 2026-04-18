# Phase 11: Performance Optimization — Research

**Created:** 2026-04-17
**Trigger:** UAT Phase 10 Test 5 failed (upload 805KB PDF stuck >7 min)
**Source docs:**
- `.planning/debug/phase10-upload-perf.md` — root cause analysis
- `chatSNP170226/PERFORMANCE_FIX_PLAN.md` — existing plan (DB pool / HTTP / indexes / chat-history)

## Goal

End-to-end document upload (≤2MB, ≤50 pages) completes in **≤ 90 seconds** p95, with visible progress to the user, and without blocking subsequent uploads.

## Problem surface area

The existing `PERFORMANCE_FIX_PLAN.md` covers 4 well-known issues (DB pool, HTTP client, indexes, chat history). UAT exposed a **5th and 6th class** of issues not covered:

| # | Issue (existing plan) | Impact | Status |
|---|---|---|---|
| 1 | DB connection leaks (5 call sites) | +40% speed | Not started |
| 2 | HTTP client thrashing (18 sites) | -150ms avg | Not started |
| 3 | Missing DB indexes | -300ms per upload | Not started |
| 4 | Chat history O(n) re-serialize | No UI lag | Not started |
| **5** | **Docling VLM sequential blocking** | **-5 to -10 min per upload** | **NEW** |
| **6** | **Celery worker concurrency + time_limit** | **Unblock media queue** | **NEW** |
| **7** | **Progress visibility (stage timing)** | **UX + debuggability** | **NEW** |
| **8** | **Mem0 health check + circuit breaker** | **Fail-fast** | **NEW** |

## New findings (to address in Phase 11)

### Finding 5 — Docling VLM loop is sequential + slow

`backend/src/services/docling/orchestrator.py:117-215`:
- For each picture in PDF, HTTP POST OpenRouter (`timeout=60.0`)
- Serial loop, up to `DOCLING_VLM_MAX_IMAGES=10`
- Worst case: 10 × 60s = 10 min on VLM alone

**Fix options:**
- A. Disable VLM by default (`DOCLING_VLM_ENABLED=false`) — lose image descriptions but fast
- B. Parallelize VLM calls with `asyncio.gather` / thread pool (4-6 concurrent)
- C. Batch VLM request (multiple images in one prompt)
- D. Use a smaller/faster vision model (gpt-4o-mini vision vs gemini-flash)

**Recommended:** B + D (parallel with 4 workers, switch to fastest-vision model). Keep A as env-flag fallback.

### Finding 6 — Celery `media_process` bottleneck

`docker-compose.yml:183`:
```
celery -A src.worker.celery_app worker -Q media_process -c 1 ...
```
- Single concurrency for docs + audio + charts + TTS
- No `--soft-time-limit` / `--time-limit`
- No `--max-tasks-per-child` (memory leaks accumulate)

**Fix:** Split into two queues OR bump concurrency to 2-3 AND add time limits:
```
-Q media_process -c 2 --soft-time-limit=300 --time-limit=600 --max-tasks-per-child=50
```

### Finding 7 — No progress visibility

`documents` table has only `status` (processing/ready/error). Missing:
- Stage indicator (`parsing`, `chunking`, `embedding`, `upserting`)
- Per-stage elapsed time
- Chunks produced so far

**Fix:** Add `documents.meta.progress` JSON with stages + timings. Publish to Redis Pub/Sub so frontend can subscribe via existing SSE `/sessions/{id}/stream` pattern (or new `/upload/{id}/stream`).

### Finding 8 — Mem0 health unverified before upload

`curl http://localhost:8888` returns connection refused. Whether reachable from Docker network unknown. Without pre-flight check, embed calls may silently hang behind httpx connect timeout.

**Fix:**
- Add `/health` check to mem0-service
- Backend `process_document` pings Mem0 before starting → fail fast if down
- Circuit breaker with 3 retries, 5s timeout each

### Finding 9 — Docling converter cold-start

Every task reimports `process_document_deep` → may re-init DocumentConverter weights (~10-30s first time).

**Fix:** Module-level singleton cached in worker process (persists across tasks within the worker).

## Requirements for Phase 11

| ID | Requirement |
|---|---|
| PERF-DB-POOL | Centralized SQLAlchemy QueuePool for Celery workers (replaces 5 create_engine calls) |
| PERF-HTTP-POOL | Already done in Phase 10-01 (REQUEST-TIMEOUT + http_client singleton) — **verify** |
| PERF-DB-INDEXES | Add indexes on documents(user_id, filename), documents(user_id, created_at desc), chat_sessions(user_id, updated_at desc) |
| PERF-CHAT-PAGINATION | Frontend loads last 50 messages, paginated scroll for older |
| PERF-VLM-PARALLEL | Parallelize Docling VLM loop (4 concurrent HTTP calls) |
| PERF-VLM-TOGGLE | Honor `DOCLING_VLM_ENABLED=false` cleanly (no cost when disabled) |
| PERF-WORKER-CONCURRENCY | Bump worker_media to -c 2, add --soft-time-limit=300, --time-limit=600, --max-tasks-per-child=50 |
| PERF-CELERY-TIME-LIMITS | Explicit soft_time_limit on process_document (300s), transcribe_audio (180s), run_sql_query (60s) |
| PERF-PROGRESS | documents.meta.progress JSON with stage + elapsed_ms + chunks_so_far; publish to Redis `document:{id}` channel |
| PERF-MEM0-HEALTH | GET /health endpoint on mem0-service; pre-flight check in process_document; circuit breaker |
| PERF-CONVERTER-SINGLETON | Module-level cache of Docling DocumentConverter per worker process |
| PERF-SSE-UPLOAD | GET /upload/{id}/stream SSE endpoint subscribing to Redis `document:{id}` |
| PERF-METRICS | Log per-stage timings via structured logs (json), aggregate via docker logs or Prometheus-ready endpoint |

## Suggested plan breakdown (5 plans, ~22 tasks)

### Plan 11-01: Docling VLM parallelization + toggle (highest ROI, lowest risk)
- 11.1 Parallelize VLM HTTP loop with asyncio.gather (max 4 concurrent)
- 11.2 Respect DOCLING_VLM_ENABLED=false fully (skip loop entirely)
- 11.3 Default VLM_ENABLED to `false` in .env.example
- 11.4 Singleton Docling converter per worker process
- 11.5 Per-stage timing logs (parse/vlm/chunk/embed/upsert)

### Plan 11-02: Celery worker hardening
- 11.6 Bump worker_media concurrency 1→2
- 11.7 Add --soft-time-limit, --time-limit, --max-tasks-per-child
- 11.8 Add soft_time_limit kwarg on process_document, transcribe_audio, run_sql_query tasks
- 11.9 Mem0 /health endpoint + pre-flight check in process_document
- 11.10 Circuit breaker around Mem0 embed calls (3 retries, 5s timeout)

### Plan 11-03: Progress visibility + SSE
- 11.11 Add ChatDocument.progress JSON migration
- 11.12 Emit stage updates from orchestrator to documents.meta
- 11.13 Publish progress events to Redis `document:{id}` channel
- 11.14 Backend GET /upload/{id}/stream SSE endpoint
- 11.15 Frontend subscribe to upload stream, show stage + % progress

### Plan 11-04: DB pool + indexes (existing PERFORMANCE_FIX_PLAN items 1+3)
- 11.16 Centralize DatabaseConnectionPool utility (verify existing `core/database_pool.py` is used)
- 11.17 Replace 5 create_engine call sites (chat_tasks.py x3, helpers.py, gardener_tasks.py)
- 11.18 Add migrations for performance indexes (documents, chat_sessions)
- 11.19 Smoke test with pgbench or similar after index creation

### Plan 11-05: Chat history pagination + HTTP pool verification
- 11.20 Paginate chat history (last 50 messages + "load more")
- 11.21 Verify Phase 10 http_client singleton is used in all Celery tasks
- 11.22 Performance regression tests (pytest + locust) — upload time, chat response time

## Dependencies / sequencing

- 11-01, 11-02 can run in parallel (different files)
- 11-03 depends on 11-01 (stage timing must exist before progress SSE can publish them)
- 11-04 independent
- 11-05 depends on nothing structural

## Risk matrix

| Risk | Mitigation |
|---|---|
| Parallel VLM hits OpenRouter rate limit | Cap at 4 concurrent, add exponential backoff |
| Worker concurrency 2 doubles RAM | Add `--max-tasks-per-child=50`, monitor |
| DOCLING_VLM_ENABLED=false loses image info | Keep as env toggle, default false, users can enable for image-heavy docs |
| Singleton converter holds weights in memory | Acceptable (already done for embedding model) |
| DB index CREATE blocks table | Use `CREATE INDEX CONCURRENTLY` |

## Success criteria (for verification)

- [ ] Upload `Biểu giá dịch vụ.pdf` (805 KB) completes in ≤ 90 seconds (currently >418s)
- [ ] Qdrant `port_knowledge` count increases within 60s
- [ ] Frontend shows stage-by-stage progress during upload
- [ ] Two concurrent uploads do not block each other (concurrency=2)
- [ ] Celery task hanging >300s is automatically killed (soft_time_limit)
- [ ] Mem0 down → upload fails with clear error within 15s (not hang indefinitely)
- [ ] No regression in chat/rag/sql response times
