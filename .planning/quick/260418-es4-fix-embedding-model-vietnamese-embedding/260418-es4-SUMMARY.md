# Summary — ES4: Fix Embedding Model → Vietnamese_Embedding_v2 + Qdrant Field Mismatch

**Date:** 2026-04-18
**Status:** ✅ Done
**Commit:** `9d33dc7d`

---

## Changes Made

### T1 — `.env`
- Added `EMBEDDING_MODEL=AITeamVN/Vietnamese_Embedding_v2` and `EMBEDDING_DIMENSION=1024` (gitignored, updated manually)

### T2 — `docker-compose.yml`
- `EMBEDDING_MODEL` default: `paraphrase-multilingual-MiniLM-L12-v2` → `AITeamVN/Vietnamese_Embedding_v2`
- `EMBEDDING_DIMENSION` default: `384` → `1024`
- `DOCLING_CHUNK_MAX_TOKENS` default: `2048` → `768` (aligned with `.env`)

### T3 — `backend/src/core/config.py`
- `embedding_dimension` default: `384` → `1024`
- `embedding_model` default: `paraphrase-multilingual-MiniLM-L12-v2` → `AITeamVN/Vietnamese_Embedding_v2`

### T4 — `backend/src/worker/chat_tasks.py`
- `os.getenv("EMBEDDING_MODEL", ...)` default updated to `AITeamVN/Vietnamese_Embedding_v2`

### T5 — Qdrant payload field fix
- `hybrid_search.py` line 286: `payload.get("content")` → `payload.get("text")`
- `search_helpers.py` line 361: `payload.get("content")` → `payload.get("text")`
- Confirmed `media_tasks.py` Qdrant upserts already use `"text"` key — no change needed

### T6 — `backend/scripts/recreate_qdrant_collections.py`
- Created one-shot migration script to drop & recreate collections with `vector_size=1024`
- Run: `docker compose --env-file .env exec backend python -m scripts.recreate_qdrant_collections`

### T7 — Verify (manual, post-deploy)
- Rebuild containers and confirm `EMBEDDING_MODEL=AITeamVN/Vietnamese_Embedding_v2` in logs
- Run recreate script → check `curl http://localhost:6333/collections/port_knowledge` → `"size": 1024`
- Re-upload PDF and query RAG → confirm non-empty results

---

## Notes
- `.env` is gitignored — changes applied to file directly but not committed
- Qdrant collections must be recreated after deploy (data loss acceptable; re-upload PDFs required)
- First container start will download ~1.3GB model — expect 2-3 min delay
