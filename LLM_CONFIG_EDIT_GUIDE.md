# LLM Configuration Edit Guide for ChatSNP

## Overview

This guide provides **exact file paths, line numbers, and current values** for all places where LLM configuration is set in the ChatSNP project. Use this for surgical, traceable edits.

---

## 1. DOCKER COMPOSE FILES

### File: `docker-compose.yml`
**Purpose:** Development environment configuration (all backend services)

| Line | Variable | Current Value | Change To |
|------|----------|---------------|-----------|
| 17 | `OPENAI_API_KEY` | `${OPENAI_API_KEY:-}` | (empty default) |
| 18 | `OPENAI_BASE_URL` | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 19 | `OPENROUTER_API_KEY` | `${OPENROUTER_API_KEY:-}` | (empty default) |
| 20 | `OPENROUTER_API_BASE` | `${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 22 | `LLM_MODEL` | `${LLM_MODEL:-openai/gpt-4o-mini}` | ← **CHANGE HERE** |
| 126 (frontend) | `OPENROUTER_API_KEY` | `${OPENROUTER_API_KEY:-}` | (empty) |
| 127 (frontend) | `OPENAI_API_KEY` | `${OPENAI_API_KEY:-}` | (empty) |
| 128 (frontend) | `OPENAI_BASE_URL` | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 129 (frontend) | `LOCAL_LLM_MODEL` | `${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}` | ← **CHANGE HERE** |

**Note:** This file reads variables from `.env` at runtime. To override, modify the `.env` file (primary source).

---

### File: `docker-compose.prod.yml`
**Purpose:** Production environment with Mem0 service

| Line | Service | Variable | Current Value | Change To |
|------|---------|----------|---------------|-----------|
| 58 | mem0 | `LLM_PROVIDER` | `${LLM_PROVIDER:-openai}` | (openai default) |
| 59 | mem0 | `LLM_MODEL` | `${LLM_MODEL:-openai/gpt-4o-mini}` | ← **CHANGE HERE** |
| 60 | mem0 | `OPENAI_API_KEY` | `${OPENAI_API_KEY:-}` | (empty) |
| 61 | mem0 | `OPENAI_BASE_URL` | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 62 | mem0 | `OPENROUTER_API_KEY` | `${OPENROUTER_API_KEY:-}` | (empty) |
| 63 | mem0 | `OPENROUTER_API_BASE` | `${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 95 | backend | `OPENAI_API_KEY` | `${OPENAI_API_KEY:-}` | (empty) |
| 96 | backend | `OPENAI_BASE_URL` | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 97 | backend | `OPENROUTER_API_KEY` | `${OPENROUTER_API_KEY:-}` | (empty) |
| 98 | backend | `OPENROUTER_API_BASE` | `${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 120 | frontend | `LOCAL_LLM_MODEL` | `${LOCAL_LLM_MODEL:-openai/gpt-5-nano}` | ← **MISMATCH** (should be gpt-4o-mini) |

---

### File: `docker-compose.pro.yml`
**Purpose:** Production environment without Mem0 service (local mem0 integration)

| Line | Service | Variable | Current Value | Change To |
|------|---------|----------|---------------|-----------|
| 59 | backend | `OPENAI_API_KEY` | `${OPENAI_API_KEY:-}` | (empty) |
| 60 | backend | `OPENAI_BASE_URL` | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 61 | backend | `OPENROUTER_API_KEY` | `${OPENROUTER_API_KEY:-}` | (empty) |
| 62 | backend | `OPENROUTER_API_BASE` | `${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 81 | frontend | `OPENROUTER_API_KEY` | `${OPENROUTER_API_KEY:-}` | (empty) |
| 82 | frontend | `OPENAI_API_KEY` | `${OPENAI_API_KEY:-}` | (empty) |
| 83 | frontend | `OPENAI_BASE_URL` | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` | (OpenRouter) |
| 84 | frontend | `LOCAL_LLM_MODEL` | `${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}` | ✅ Good |

---

### File: `docker-compose.full.yml`
**Purpose:** Full development environment with Mem0 service (older setup)

**Status:** Does NOT have explicit LLM config in environment. Relies on `.env` file via `env_file` (Line 72).

---

## 2. ENV FILES

### File: `.env` (PRODUCTION/ACTIVE CONFIGURATION)
**Purpose:** Primary environment variables for all services

| Line | Variable | Current Value | Notes |
|------|----------|---------------|-------|
| 6 | `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | Frontend API endpoint |
| 12 | `OPENROUTER_API_KEY` | `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` | **⚠️  REAL SECRET** (dev only) |
| 13 | `OPENROUTER_API_BASE` | `https://openrouter.ai/api/v1` | OpenRouter endpoint |
| 14 | `OPENAI_API_KEY` | `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` | **⚠️  REAL SECRET** (dev only) |
| 15 | `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` | Backend LLM endpoint |
| 16 | `LLM_MODEL` | `openai/gpt-4o-mini` | ← **PRIMARY CHANGE HERE** (affects backend + workers) |
| 17 | `LOCAL_LLM_MODEL` | `openai/gpt-4o-mini` | Frontend model name |

**⚠️  WARNING:** This file contains API keys. Must be in `.gitignore`.

---

### File: `.env.example` (TEMPLATE)
**Purpose:** Template for new developers / CI/CD

| Line | Variable | Current Value | Issue |
|------|----------|---------------|-------|
| 50 | `OPENAI_API_KEY` | `sk-or-v1-your-key` | Placeholder (good) |
| 51 | `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` | ✅ Correct |
| 52 | `OPENROUTER_API_KEY` | `sk-or-v1-your-key` | Placeholder (good) |
| 53 | `OPENROUTER_API_BASE` | `https://openrouter.ai/api/v1` | ✅ Correct |
| 57 | `LLM_PROVIDER` | `openai` | ✅ Correct |
| 58 | `LLM_MODEL` | `openai/gpt-5-nano` | **❌ MISMATCH** (should be gpt-4o-mini) |
| 87 | `NEXT_PUBLIC_LOCAL_LLM_MODEL` | `openai/gpt-5-nano` | **❌ MISMATCH** (should be gpt-4o-mini) |

**Fix:** Update lines 58 and 87 to `openai/gpt-4o-mini`

---

### File: `.env.production` (PRODUCTION REFERENCE)
**Purpose:** Production environment (secrets NOT stored here - use CI/CD)

| Line | Variable | Current Value | Notes |
|------|----------|---------------|-------|
| 1 | `BACKEND_INTERNAL_URL` | `http://backend:8000` | Docker internal URL |
| 2 | `NEXT_PUBLIC_BACKEND_URL` | `https://api-chatsnp.cntt-snp.online` | Production API endpoint |
| 10 | `NEXT_PUBLIC_LOCAL_LLM_MODEL` | `openai/gpt-5-nano` | **❌ MISMATCH** (should match .env) |

**Status:** ✅ No API keys exposed (good security)

---

### File: `frontend/.env.local` (FRONTEND DEV - NOT in repo)
**Purpose:** Local frontend development (git-ignored)

| Line | Variable | Current Value | Notes |
|------|----------|---------------|-------|
| 10 | `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | Local backend |
| 17 | `OPENROUTER_API_KEY` | `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` | ✅ Matches root .env |
| 18 | `OPENROUTER_API_BASE` | `https://openrouter.ai/api/v1` | ✅ OpenRouter |
| 19 | `OPENAI_API_KEY` | `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` | ✅ Matches root .env |
| 20 | `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` | ✅ OpenRouter |
| 21 | `LOCAL_LLM_MODEL` | `openai/gpt-4o-mini` | ✅ Matches root .env |

**Note:** Keep in sync with root `.env` manually.

---

### File: `frontend/.env.local.example` (LOCAL OLLAMA TEMPLATE)
**Purpose:** Template for local LLM development (Ollama on localhost:1234)

| Line | Variable | Current Value | Notes |
|------|----------|---------------|-------|
| 11 | `OPENAI_API_KEY` | `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` | Example key (not functional) |
| 12 | `OPENAI_BASE_URL` | `http://127.0.0.1:1234/v1` | **Local Ollama** (not OpenRouter) |
| 13 | `OPENROUTER_API_KEY` | `not-needed` | ✅ Correct for local setup |
| 14 | `OPENROUTER_API_BASE` | `http://127.0.0.1:1234/v1` | Local Ollama endpoint |
| 15 | `LOCAL_LLM_MODEL` | `qwen3-vl-4b-instruct-mlx` | Local model name |
| 16 | `NEXT_PUBLIC_LOCAL_LLM_MODEL` | `qwen3-vl-4b-instruct-mlx` | ✅ Matches LOCAL_LLM_MODEL |

**Usage:** Copy to `.env.local` to use local Ollama instead of OpenRouter.

---

### File: `frontend/.env.development`
**Purpose:** Next.js development environment

| Line | Variable | Current Value |
|------|----------|---------------|
| 1 | `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |
| 2 | `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` |

**Note:** No LLM config here (uses `.env.local`).

---

### File: `frontend/.env.production`
**Purpose:** Next.js production build

| Line | Variable | Current Value |
|------|----------|---------------|
| 1 | `NEXT_PUBLIC_API_URL` | `https://backendchatsnp.cntt-snp.online` |
| 2 | `NEXT_PUBLIC_BACKEND_URL` | `https://backendchatsnp.cntt-snp.online` |

**Note:** No LLM config here (uses production secrets via CI/CD).

---

### File: `mem0-service/.env.example`
**Purpose:** Template for standalone mem0 service

| Line | Variable | Current Value | Issue |
|------|----------|---------------|-------|
| 1 | `OPENAI_API_KEY` | `your_openrouter_api_key` | Placeholder (good) |
| 3 | `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` | ✅ Correct |
| 4 | `OPENROUTER_API_KEY` | `your_openrouter_api_key` | Placeholder (good) |
| 5 | `OPENROUTER_API_BASE` | `https://openrouter.ai/api/v1` | ✅ Correct |
| 7 | `LLM_PROVIDER` | `openai` | ✅ Correct |
| 8 | `LLM_MODEL` | `openai/gpt-5-nano` | **❌ MISMATCH** (should be gpt-4o-mini) |

**Fix:** Update line 8 to `openai/gpt-4o-mini`

---

## 3. BACKEND SOURCE CODE

### File: `backend/src/core/config.py`
**Purpose:** Pydantic settings class (reads from `.env` at runtime)

| Line | Variable | Type | Current Default | Issue |
|------|----------|------|-----------------|-------|
| 21 | `openai_api_key` | Field | `None` | ✅ Good (falls back to env var) |
| 22 | `openai_base_url` | Field | `https://openrouter.ai/api/v1` | ✅ Good |
| 23 | `openrouter_api_key` | Field | `None` | ✅ Good (falls back to env var) |
| 24 | `llm_model` | Field | `openai/gpt-5-nano` | **❌ MISMATCH** (should be gpt-4o-mini) |

**To Fix:**
```python
# Line 24: Change from
llm_model: str = Field("openai/gpt-5-nano", alias="LLM_MODEL")

# To:
llm_model: str = Field("openai/gpt-4o-mini", alias="LLM_MODEL")
```

---

### File: `backend/src/core/mem0_local.py`
**Purpose:** Local Mem0 integration (reads from environment variables)

| Line | Variable | Current Default | Notes |
|------|----------|-----------------|-------|
| 31 | `LLM_PROVIDER` | `openai` | ✅ Good |
| 32 | `LLM_MODEL` | `openai/gpt-4o-mini` | ✅ Good (matches docker-compose.prod.yml) |
| 38 | `OPENAI_API_KEY` | `None` | ✅ Good (falls back to env var) |
| 39 | `OPENAI_BASE_URL` | `None` | ✅ Good (falls back to env var) |
| 40 | `OPENROUTER_API_KEY` | `None` | ✅ Good (falls back to env var) |
| 41 | `OPENROUTER_API_BASE` | `None` | ✅ Good (falls back to env var) |

**Status:** ✅ No changes needed.

---

### File: `backend/src/worker/data_tasks.py`
**Purpose:** SQL agent initialization (reads from environment variables)

| Line | Variable | Current Default | Issue |
|------|----------|-----------------|-------|
| 22 | `openai_key` | `""` (empty) | ✅ Good (env fallback) |
| 23 | `openai_base` | `https://openrouter.ai/api/v1` | ✅ Good |
| 24 | `llm_model` | `openai/gpt-5-nano` | **❌ MISMATCH** (should be gpt-4o-mini) |

**To Fix:**
```python
# Line 24: Change from
llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

# To:
llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
```

---

### File: `backend/src/worker/chat_tasks.py`
**Purpose:** Chat processing tasks

**Status:** No hardcoded LLM defaults in first 50 lines. Uses environment variables via `os.getenv()`.

---

## 4. FRONTEND SOURCE CODE

### File: `frontend/src/ai/localClient.ts`
**Purpose:** OpenAI client initialization with fallback logic

| Line | Variable | Current Code | Issue |
|------|----------|--------------|-------|
| 3-6 | `LOCAL_LLM_BASE_URL` | Fallback chain | ✅ Good (eventual default: OpenRouter) |
| 8-11 | `LOCAL_LLM_MODEL` | Fallback chain ending in `'gpt-oss-120b'` | **❌ NOT a valid OpenRouter model** |
| 14-17 | API Key | Fallback chain (OPENROUTER → OPENAI → 'not-needed') | ✅ Good |

**To Fix:**
```typescript
// Line 11: Change from
'gpt-oss-120b';

// To:
'openai/gpt-4o-mini';
```

---

## 5. STANDALONE MEM0 SERVICE

### File: `mem0-service/main.py`
**Purpose:** Standalone Mem0 service (reads from environment variables)

| Line | Variable | Current Default | Issue |
|------|----------|-----------------|-------|
| 24 | `LLM_PROVIDER` | `openai` | ✅ Good |
| 25 | `LLM_MODEL` | `openai/gpt-5-nano` | **❌ MISMATCH** (should be gpt-4o-mini) |
| 31-35 | API Keys | `None` (env fallback) | ✅ Good |

**To Fix:**
```python
# Line 25: Change from
LLM_MODEL = os.environ.get("LLM_MODEL", "openai/gpt-5-nano")

# To:
LLM_MODEL = os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")
```

---

## EDIT WORKFLOW

### Step 1: Choose Your Strategy
**Option A (Recommended):** Standardize everything to `openai/gpt-4o-mini`
- Faster, cheaper, proven in production
- Requires updating 5 files

**Option B:** Standardize to `openai/gpt-5-nano`
- Placeholder model name (less stable)
- Requires updating 5 files

### Step 2: Execute Changes
**Files to modify (in order):**

1. **`.env`** (line 16)
   - This is the PRIMARY source for all Docker services
   - Change: `LLM_MODEL=openai/gpt-4o-mini`

2. **`.env.example`** (lines 58, 87)
   - Documentation template
   - Change: `LLM_MODEL=openai/gpt-4o-mini` and `NEXT_PUBLIC_LOCAL_LLM_MODEL=openai/gpt-4o-mini`

3. **`backend/src/core/config.py`** (line 24)
   - Pydantic field default
   - Change: `Field("openai/gpt-4o-mini", ...)`

4. **`backend/src/worker/data_tasks.py`** (line 24)
   - SQL agent default
   - Change: `os.getenv("LLM_MODEL", "openai/gpt-4o-mini")`

5. **`mem0-service/main.py`** (line 25)
   - Standalone mem0 default
   - Change: `os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")`

6. **`frontend/src/ai/localClient.ts`** (line 11)
   - Frontend fallback
   - Change: `'openai/gpt-4o-mini'`

7. **`mem0-service/.env.example`** (line 8)
   - Template documentation
   - Change: `LLM_MODEL=openai/gpt-4o-mini`

### Step 3: Verify
```bash
cd chatSNP170226

# Check all occurrences
grep -r "gpt-5-nano" .env* backend/ frontend/ mem0-service/ 2>/dev/null | grep -v ".venv" | grep -v "node_modules"

# Should return only documentation files if done correctly
```

### Step 4: Test
```bash
# Rebuild containers
docker compose down
docker compose -f docker-compose.yml up --build -d

# Check logs
docker logs chatsnp-backend | grep -i "llm\|model"
docker logs chatsnp-frontend | grep -i "local_llm_model"
```

---

## VERIFICATION CHECKLIST

After making changes, verify:

- [ ] `.env` has correct `LLM_MODEL` value
- [ ] All source code files have matching defaults
- [ ] `.env.example` is updated for next developer
- [ ] `.env.production` is NOT exposed in git
- [ ] `frontend/.env.local` is NOT in git repo
- [ ] Docker containers start without errors
- [ ] Backend API responds to `/health` (if exists)
- [ ] Chat/RAG queries work with new model

---

## NOTES

1. **Environment Variable Precedence:**
   - `.env` (or `.env.production`) > Code defaults > Hard-coded fallbacks

2. **Docker Compose Behavior:**
   - Reads `.env` at startup, interpolates `${VAR:-default}` syntax
   - If `.env` is missing, uses docker-compose.yml defaults

3. **Frontend Build-time vs Runtime:**
   - `NEXT_PUBLIC_*` variables are baked into the Next.js bundle at build time
   - Server-side env vars (used by Server Actions) are read at runtime
   - `process.env.LOCAL_LLM_MODEL` is available at runtime only

4. **API Key Security:**
   - Development `.env` contains real keys for testing
   - Production uses GitHub Secrets / CI/CD only
   - Never commit `.env` to git (add to `.gitignore`)

---

**Generated:** 2026-04-15
**For questions:** See `LLM_CONFIG_INVENTORY.md` for complete details
