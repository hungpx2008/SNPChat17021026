# Phase 6: Parent-Child Chunking — PLAN

**Created:** 2026-04-14
**Status:** Mostly complete — config fixes only
**Research:** Phase 6 is 95%+ implemented. See 06-RESEARCH.md.

---

## Goal

Close the remaining configuration gaps so Phase 6 is fully consistent and production-ready.

---

## Tasks

### Task 1: Update docker-compose.yml default
**File:** `chatSNP170226/docker-compose.yml`
**Change:** Line 27 — `DOCLING_CHUNK_MAX_TOKENS: ${DOCLING_CHUNK_MAX_TOKENS:-768}` → `DOCLING_CHUNK_MAX_TOKENS: ${DOCLING_CHUNK_MAX_TOKENS:-2048}`
**Why:** Python code default is already 2048. Docker Compose fallback overrides it to 768 if `.env` doesn't set it.

### Task 2: Update docker-compose.pro.yml default (if exists)
**File:** `chatSNP170226/docker-compose.pro.yml`
**Change:** Same as Task 1 for production compose file.

### Task 3: Update .env.example files
**Files:**
- `chatSNP170226/.env.example` — `DOCLING_CHUNK_MAX_TOKENS=512` → `DOCLING_CHUNK_MAX_TOKENS=2048`
- `chatSNP170226/backend/.env.example` — `DOCLING_CHUNK_MAX_TOKENS=512` → `DOCLING_CHUNK_MAX_TOKENS=2048`

### Task 4: Update ROADMAP.md
**File:** `.planning/ROADMAP.md`
**Change:** Mark Phase 6 status as "Complete"

---

## Out of Scope (Deferred)
- Admin reindex endpoint (`POST /admin/reindex/{document_id}`) — optional, not critical
- Bulk reindex CLI command
