# Debug Session — Phase 10 Upload Performance

**Date:** 2026-04-17
**Trigger:** UAT Test 5 — File Upload 805KB PDF stuck >7 minutes
**Doc ID:** f2ae42c2-6e1b-4914-bf17-a4061408fbe3
**User ID:** uat-perf-1776436019
**File:** `/Volumes/orical/ChatSNP/Biểu giá dịch vụ.pdf` (805 KB)

## Empirical measurements

| Metric | Value |
|---|---|
| `POST /upload` roundtrip | 78 ms (HTTP 201) |
| Time-to-first-chunk in Qdrant | NEVER (>418s, test aborted) |
| Qdrant `port_knowledge` points before | 183 |
| Qdrant `port_knowledge` points after 7 min | 183 (no new writes) |
| DB `documents.status` | `processing` (unchanged) |
| DB `documents.chunk_count` | 0 |
| DB `documents.error_message` | `None` (no error raised) |

**Observation:** Upload endpoint (FastAPI) is fast. The slowness is 100% inside the Celery `process_document` worker. No error, no progress — task is either hung or running a very long sequential operation.

## Hypothesis tree (ranked by likelihood)

### H1 — VLM loop blocking on OpenRouter [PRIMARY SUSPECT]

**Evidence:**
- `.env` → `DOCLING_VLM_ENABLED=true`, `DOCLING_VLM_MAX_IMAGES=10`, `DOCLING_VLM_MIN_SIZE=300`
- `backend/src/services/docling/orchestrator.py:117-215` — sequential loop: for each picture, HTTP POST to OpenRouter with `timeout=60.0` (line 188: `get_http_client(timeout=60.0).post(...)`)
- Biểu giá PDF is table-heavy but likely has 5-10 logos/images/annotations → each VLM call can take 10-40s on gpt-4o-mini via OpenRouter
- **Worst case:** 10 images × 60s timeout = 10 minutes on VLM alone

**Confirmation plan:** Disable `DOCLING_VLM_ENABLED=false`, re-upload same file, measure.

### H2 — worker_media concurrency=1 + previous task still running

**Evidence:**
- `docker-compose.yml:183` → `celery -A src.worker.celery_app worker -Q media_process -c 1`
- Shared queue with audio transcription, chart generation, TTS
- If ANY prior media task is in-flight, new uploads wait

**Confirmation plan:** Check Flower active tasks, or `docker logs chatsnp-worker-media | tail -50`

### H3 — Mem0 service unreachable → embed calls hang

**Evidence:**
- From host: `curl http://localhost:8888` → connection refused
- If Mem0 container is down or port not exposed, backend calls `POST http://mem0:8888/embed` via Docker internal network
- Without an explicit short timeout on embed calls, httpx default is 5s connect but retries + chunking amplifies
- `orchestrator.process` stage 3 (embed → Qdrant upsert) would silently hang

**Confirmation plan:** `docker ps` for mem0 container health; `docker logs chatsnp-mem0 | tail -30`

### H4 — No Celery soft_time_limit → zombie task

**Evidence:**
- `media_tasks.py:28` → `@celery_app.task(name="...", bind=True, max_retries=2)` — NO `soft_time_limit`, NO `time_limit`
- Celery `celery_config.py` may or may not set a global limit (to verify)
- If the task hangs (H1 or H3), concurrency=1 + no limit = **permanently blocked queue** until worker restart

**Confirmation plan:** `grep -r "task_soft_time_limit\|task_time_limit" backend/src/core/celery_config.py`

### H5 — Docling converter re-initialized on every task

**Evidence:**
- `process_document_deep` imported fresh each call (`media_tasks.py:122`)
- Docling's `DocumentConverter` loads parser weights (layout model, table model) on first use — can be 10-30s cold init
- If no process-level caching, every task pays this cost

**Confirmation plan:** Check `docling/orchestrator.py` for module-level `_CONVERTER = None` pattern.

### H6 — Large table PDF with O(n²) heuristics

**Evidence:**
- `.env` → `DOCLING_TABLE_GROUP_KEY_HINTS` with 11 keys, `DOCLING_GROUP_LOCK_ENABLED=true`, `DOCLING_GROUP_LOCK_MAX_CHARS=2800`
- `AdaptiveTableSerializer` applies heuristics row-by-row
- Biểu giá PDF likely has >100 rows across multiple tables
- Less likely a full hang, more likely "slow but progressing"

## Root cause — ranked

1. **Primary:** H1 (VLM sequential 60s-per-call blocking) + H4 (no time_limit amplifies hang)
2. **Amplifier:** H2 (concurrency=1 means any slow task blocks all uploads)
3. **Silent failure mode:** H3 (if Mem0 is down, embed stage hangs without error)
4. **Cold start overhead:** H5 (first task after worker restart is slow, subsequent faster)

## Missing instrumentation (why we can't be certain)

- No per-stage timing logs in `documents.meta`
- No Celery task heartbeat in DB
- No Flower auth configured on this host (API returns empty)
- Docker not accessible from host shell in this debug environment

## Recommended quick fix (minimal, 5 minutes)

```diff
# .env
- DOCLING_VLM_ENABLED=true
+ DOCLING_VLM_ENABLED=false
```

```diff
# docker-compose.yml line 183
- command: celery -A src.worker.celery_app worker -Q media_process -c 1 --loglevel=info -n media@%h
+ command: celery -A src.worker.celery_app worker -Q media_process -c 2 --loglevel=info -n media@%h --soft-time-limit=300 --time-limit=600
```

Then: `docker compose up -d --force-recreate worker_media` and re-test.

## Structural fix — see Phase 11 plan

`PERFORMANCE_FIX_PLAN.md` already exists but focuses on DB pool / HTTP client / indexes / chat-history — it **does NOT address Docling/VLM latency or worker concurrency**. Phase 11 should extend it.
