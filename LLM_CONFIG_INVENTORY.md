# ChatSNP LLM Configuration Inventory

**Project Path:** `/Volumes/orical/ChatSNP/chatSNP170226/`

## 1. DOCKER COMPOSE FILES

### 1.1 `docker-compose.yml` (Development)
**Path:** `chatSNP170226/docker-compose.yml`

**Lines with LLM config (x-common-env anchor — Lines 4-36):**
- Line 17: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 18: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 19: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 20: `OPENROUTER_API_BASE: ${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 22: `LLM_MODEL: ${LLM_MODEL:-openai/gpt-4o-mini}` (default: gpt-4o-mini)

**Used in services:**
- `backend` (Line 103): Uses `<<: *common-env`
- `worker_chat` (Line 148): Uses `<<: *common-env`
- `worker_data` (Line 167): Uses `<<: *common-env`
- `worker_media` (Line 189): Uses `<<: *common-env`

**Frontend-specific (Lines 114-133):**
- Line 126: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 127: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 128: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 129: `LOCAL_LLM_MODEL: ${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}` (default: gpt-4o-mini)

---

### 1.2 `docker-compose.full.yml` (Full Dev with Mem0 Service)
**Path:** `chatSNP170226/docker-compose.full.yml`

**Backend service (Lines 65-85):**
- No direct LLM config in environment section. Relies on `.env` file (Line 72)

**Frontend service (Lines 87-100):**
- No LLM-specific environment variables defined in this file

---

### 1.3 `docker-compose.prod.yml` (Production with Mem0 Service)
**Path:** `chatSNP170226/docker-compose.prod.yml`

**Mem0 service (Lines 40-71):**
- Line 58: `LLM_PROVIDER: ${LLM_PROVIDER:-openai}` (default: openai)
- Line 59: `LLM_MODEL: ${LLM_MODEL:-openai/gpt-4o-mini}` (default: gpt-4o-mini)
- Line 60: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 61: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 62: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 63: `OPENROUTER_API_BASE: ${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` (default: OpenRouter)

**Backend service (Lines 76-105):**
- Line 95: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 96: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 97: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 98: `OPENROUTER_API_BASE: ${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` (default: OpenRouter)

**Frontend service (Lines 107-132):**
- Line 117: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 118: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 119: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 120: `LOCAL_LLM_MODEL: ${LOCAL_LLM_MODEL:-openai/gpt-5-nano}` (default: gpt-5-nano)

**Worker services (Lines 136-217):**
- `worker_chat` (Lines 154-156): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`
- `worker_data` (Lines 176-179): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_API_BASE`
- `worker_media` (Lines 210-212): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`

---

### 1.4 `docker-compose.pro.yml` (Production Lite - No Mem0 Service)
**Path:** `chatSNP170226/docker-compose.pro.yml`

**Backend service (Lines 40-68):**
- Line 59: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 60: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 61: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 62: `OPENROUTER_API_BASE: ${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` (default: OpenRouter)

**Frontend service (Lines 70-88):**
- Line 81: `OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:-}` (empty default)
- Line 82: `OPENAI_API_KEY: ${OPENAI_API_KEY:-}` (empty default)
- Line 83: `OPENAI_BASE_URL: ${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` (default: OpenRouter)
- Line 84: `LOCAL_LLM_MODEL: ${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}` (default: gpt-4o-mini)

**Worker services (Lines 93-176):**
- `worker_chat` (Lines 112-114): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`
- `worker_data` (Lines 133-136): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_API_BASE`
- `worker_media` (Lines 170-172): `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENROUTER_API_KEY`

---

## 2. ENV FILES

### 2.1 Root `.env` (Current Development)
**Path:** `chatSNP170226/.env`

**LLM Configuration (Lines 12-17):**
- Line 12: `OPENROUTER_API_KEY=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`
- Line 13: `OPENROUTER_API_BASE=https://openrouter.ai/api/v1`
- Line 14: `OPENAI_API_KEY=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`
- Line 15: `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- Line 16: `LLM_MODEL=openai/gpt-4o-mini`
- Line 17: `LOCAL_LLM_MODEL=openai/gpt-4o-mini`

---

### 2.2 `.env.example` (Template for All Environments)
**Path:** `chatSNP170226/.env.example`

**LLM Configuration (Lines 49-87):**
- Line 50: `OPENAI_API_KEY=sk-or-v1-your-key` (placeholder)
- Line 51: `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- Line 52: `OPENROUTER_API_KEY=sk-or-v1-your-key` (placeholder)
- Line 53: `OPENROUTER_API_BASE=https://openrouter.ai/api/v1`
- Line 54: `GOOGLE_API_KEY=` (empty)
- Line 57: `LLM_PROVIDER=openai`
- Line 58: `LLM_MODEL=openai/gpt-5-nano`
- Line 87: `NEXT_PUBLIC_LOCAL_LLM_MODEL=openai/gpt-5-nano`

---

### 2.3 `.env.production` (Production Env - Root)
**Path:** `chatSNP170226/.env.production`

**Content (Lines 1-10):**
- Line 1: `BACKEND_INTERNAL_URL=http://backend:8000`
- Line 2: `NEXT_PUBLIC_BACKEND_URL=https://api-chatsnp.cntt-snp.online`
- Lines 3-9: Firebase configuration only
- Line 10: `NEXT_PUBLIC_LOCAL_LLM_MODEL=openai/gpt-5-nano`

**Note:** Does NOT contain LLM API keys (loaded from separate secrets or CI/CD)

---

### 2.4 `backend/.env.example`
**Path:** `chatSNP170226/backend/.env.example`

**LLM Configuration:**
- No LLM variables in this file (only DB and CORS config)

---

### 2.5 `frontend/.env.local`
**Path:** `chatSNP170226/frontend/.env.local`

**LLM Configuration (Lines 16-21):**
- Line 17: `OPENROUTER_API_KEY=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`
- Line 18: `OPENROUTER_API_BASE=https://openrouter.ai/api/v1`
- Line 19: `OPENAI_API_KEY=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`
- Line 20: `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- Line 21: `LOCAL_LLM_MODEL=openai/gpt-4o-mini`

---

### 2.6 `frontend/.env.local.example`
**Path:** `chatSNP170226/frontend/.env.local.example`

**LLM Configuration (Lines 11-16):**
- Line 11: `OPENAI_API_KEY=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`
- Line 12: `OPENAI_BASE_URL=http://127.0.0.1:1234/v1` (local Ollama)
- Line 13: `OPENROUTER_API_KEY=not-needed`
- Line 14: `OPENROUTER_API_BASE=http://127.0.0.1:1234/v1` (local Ollama)
- Line 15: `LOCAL_LLM_MODEL=qwen3-vl-4b-instruct-mlx`
- Line 16: `NEXT_PUBLIC_LOCAL_LLM_MODEL=qwen3-vl-4b-instruct-mlx`

---

### 2.7 `frontend/.env.development`
**Path:** `chatSNP170226/frontend/.env.development`

**Content (Lines 1-3):**
- Backend URLs only, no LLM config

---

### 2.8 `frontend/.env.production`
**Path:** `chatSNP170226/frontend/.env.production`

**Content (Lines 1-3):**
- Backend URLs only, no LLM config

---

### 2.9 `mem0-service/.env.example`
**Path:** `chatSNP170226/mem0-service/.env.example`

**LLM Configuration (Lines 1-17):**
- Line 1: `OPENAI_API_KEY=your_openrouter_api_key` (placeholder)
- Line 3: `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- Line 4: `OPENROUTER_API_KEY=your_openrouter_api_key` (placeholder)
- Line 5: `OPENROUTER_API_BASE=https://openrouter.ai/api/v1`
- Line 6: `GOOGLE_API_KEY=` (empty)
- Line 7: `LLM_PROVIDER=openai`
- Line 8: `LLM_MODEL=openai/gpt-5-nano`
- Line 9: `EMBEDDER_PROVIDER=huggingface`
- Line 10: `EMBEDDER_MODEL=thanhtantran/Vietnamese_Embedding_v2`
- Line 11: `EMBEDDING_DIM=1024`

---

## 3. BACKEND SOURCE CODE

### 3.1 `backend/src/core/config.py`
**Path:** `chatSNP170226/backend/src/core/config.py`

**Settings class (Lines 8-34):**
- Line 21: `openai_api_key: str | None = Field(None, alias="OPENAI_API_KEY")` — **Default: None**
- Line 22: `openai_base_url: str = Field("https://openrouter.ai/api/v1", alias="OPENAI_BASE_URL")` — **Default: OpenRouter**
- Line 23: `openrouter_api_key: str | None = Field(None, alias="OPENROUTER_API_KEY")` — **Default: None**
- Line 24: `llm_model: str = Field("openai/gpt-5-nano", alias="LLM_MODEL")` — **Default: gpt-5-nano**

---

### 3.2 `backend/src/core/mem0_local.py`
**Path:** `chatSNP170226/backend/src/core/mem0_local.py`

**Function `_build_config()` (Lines 24-86):**
- Line 31: `llm_provider = os.environ.get("LLM_PROVIDER", "openai")` — **Default: openai**
- Line 32: `llm_model = os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")` — **Default: gpt-4o-mini**
- Line 38: `openai_api_key = os.environ.get("OPENAI_API_KEY")` — **Default: None**
- Line 39: `openai_base_url = os.environ.get("OPENAI_BASE_URL")` — **Default: None**
- Line 40: `openrouter_api_key = os.environ.get("OPENROUTER_API_KEY")` — **Default: None**
- Line 41: `openrouter_api_base = os.environ.get("OPENROUTER_API_BASE")` — **Default: None**

**Config built (Lines 59-66):**
- Line 60-65: LLM config passed to Mem0 Memory instance with `api_key` (line 62) and `openai_base_url` (line 63)

---

### 3.3 `backend/src/worker/data_tasks.py`
**Path:** `chatSNP170226/backend/src/worker/data_tasks.py`

**Module-level initialization (Lines 21-28):**
- Line 22: `openai_key = os.getenv("OPENAI_API_KEY", "")` — **Default: empty string**
- Line 23: `openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")` — **Default: OpenRouter**
- Line 24: `llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")` — **Default: gpt-5-nano**

**Usage:**
- Line 26-28: Creates `OpenAIModel` with these values for SQL agent

---

### 3.4 `backend/src/worker/chat_tasks.py`
**Path:** `chatSNP170226/backend/src/worker/chat_tasks.py`

**Module documentation (Lines 1-9):**
- Mentions reading from `LLM_MODEL` env var (no hardcoded values visible in first 50 lines)

---

## 4. FRONTEND SOURCE CODE

### 4.1 `frontend/src/ai/localClient.ts`
**Path:** `chatSNP170226/frontend/src/ai/localClient.ts`

**LLM Configuration (Lines 3-19):**
- Line 3-6: `LOCAL_LLM_BASE_URL` (fallback chain):
  1. `process.env.OPENAI_BASE_URL`
  2. `process.env.OPENROUTER_API_BASE`
  3. Default: `'https://openrouter.ai/api/v1'`

- Line 8-11: `LOCAL_LLM_MODEL` (fallback chain):
  1. `process.env.LOCAL_LLM_MODEL`
  2. `process.env.NEXT_PUBLIC_LOCAL_LLM_MODEL`
  3. Default: `'gpt-oss-120b'`

- Line 13-19: `localOpenAI` OpenAI client configuration:
  - API Key (fallback chain, Line 14-17):
    1. `process.env.OPENROUTER_API_KEY`
    2. `process.env.OPENAI_API_KEY`
    3. Default: `'not-needed'`
  - Base URL: `LOCAL_LLM_BASE_URL`

---

### 4.2 `mem0-service/main.py`
**Path:** `chatSNP170226/mem0-service/main.py`

**Environment variable initialization (Lines 18-37):**
- Line 24: `LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "openai")` — **Default: openai**
- Line 25: `LLM_MODEL = os.environ.get("LLM_MODEL", "openai/gpt-5-nano")` — **Default: gpt-5-nano**
- Line 31: `OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")` — **Default: None**
- Line 32: `OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL")` — **Default: None**
- Line 33: `OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")` — **Default: None**
- Line 34: `OPENROUTER_API_BASE = os.environ.get("OPENROUTER_API_BASE")` — **Default: None**

**DEFAULT_CONFIG built (Lines 43-91):**
- Line 55-68: LLM config with fallback logic for API key and base URL

---

## SUMMARY TABLE: All LLM Configuration Locations

| File Path | Variable | Type | Current Value / Default |
|-----------|----------|------|------------------------|
| `.env` | `OPENAI_API_KEY` | Secret | `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` |
| `.env` | `OPENAI_BASE_URL` | URL | `https://openrouter.ai/api/v1` |
| `.env` | `OPENROUTER_API_KEY` | Secret | `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` |
| `.env` | `OPENROUTER_API_BASE` | URL | (derived from `.env.example`: `https://openrouter.ai/api/v1`) |
| `.env` | `LLM_MODEL` | String | `openai/gpt-4o-mini` |
| `.env` | `LOCAL_LLM_MODEL` | String | `openai/gpt-4o-mini` |
| `.env.example` | `OPENAI_API_KEY` | Placeholder | `sk-or-v1-your-key` |
| `.env.example` | `OPENAI_BASE_URL` | URL | `https://openrouter.ai/api/v1` |
| `.env.example` | `OPENROUTER_API_KEY` | Placeholder | `sk-or-v1-your-key` |
| `.env.example` | `OPENROUTER_API_BASE` | URL | `https://openrouter.ai/api/v1` |
| `.env.example` | `LLM_PROVIDER` | String | `openai` |
| `.env.example` | `LLM_MODEL` | String | `openai/gpt-5-nano` |
| `.env.example` | `NEXT_PUBLIC_LOCAL_LLM_MODEL` | String | `openai/gpt-5-nano` |
| `.env.production` | `NEXT_PUBLIC_LOCAL_LLM_MODEL` | String | `openai/gpt-5-nano` |
| `frontend/.env.local` | `OPENAI_API_KEY` | Secret | `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` |
| `frontend/.env.local` | `OPENAI_BASE_URL` | URL | `https://openrouter.ai/api/v1` |
| `frontend/.env.local` | `OPENROUTER_API_KEY` | Secret | `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` |
| `frontend/.env.local` | `OPENROUTER_API_BASE` | URL | `https://openrouter.ai/api/v1` |
| `frontend/.env.local` | `LOCAL_LLM_MODEL` | String | `openai/gpt-4o-mini` |
| `frontend/.env.local.example` | `OPENAI_API_KEY` | Secret (example) | `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` |
| `frontend/.env.local.example` | `OPENAI_BASE_URL` | URL (local) | `http://127.0.0.1:1234/v1` |
| `frontend/.env.local.example` | `OPENROUTER_API_KEY` | String | `not-needed` |
| `frontend/.env.local.example` | `OPENROUTER_API_BASE` | URL (local) | `http://127.0.0.1:1234/v1` |
| `frontend/.env.local.example` | `LOCAL_LLM_MODEL` | String | `qwen3-vl-4b-instruct-mlx` |
| `frontend/.env.local.example` | `NEXT_PUBLIC_LOCAL_LLM_MODEL` | String | `qwen3-vl-4b-instruct-mlx` |
| `docker-compose.yml` | `OPENAI_API_KEY` | Env Var | `${OPENAI_API_KEY:-}` (empty default) |
| `docker-compose.yml` | `OPENAI_BASE_URL` | Env Var | `${OPENAI_BASE_URL:-https://openrouter.ai/api/v1}` |
| `docker-compose.yml` | `OPENROUTER_API_KEY` | Env Var | `${OPENROUTER_API_KEY:-}` (empty default) |
| `docker-compose.yml` | `OPENROUTER_API_BASE` | Env Var | `${OPENROUTER_API_BASE:-https://openrouter.ai/api/v1}` |
| `docker-compose.yml` | `LLM_MODEL` | Env Var | `${LLM_MODEL:-openai/gpt-4o-mini}` |
| `docker-compose.yml` | `LOCAL_LLM_MODEL` | Env Var | `${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}` |
| `docker-compose.prod.yml` | `LLM_PROVIDER` | Env Var | `${LLM_PROVIDER:-openai}` |
| `docker-compose.prod.yml` | `LLM_MODEL` (mem0) | Env Var | `${LLM_MODEL:-openai/gpt-4o-mini}` |
| `docker-compose.prod.yml` | `LLM_MODEL` (frontend) | Env Var | `${LOCAL_LLM_MODEL:-openai/gpt-5-nano}` |
| `docker-compose.pro.yml` | `LLM_MODEL` (frontend) | Env Var | `${LOCAL_LLM_MODEL:-openai/gpt-4o-mini}` |
| `mem0-service/.env.example` | `OPENAI_API_KEY` | Placeholder | `your_openrouter_api_key` |
| `mem0-service/.env.example` | `OPENAI_BASE_URL` | URL | `https://openrouter.ai/api/v1` |
| `mem0-service/.env.example` | `OPENROUTER_API_KEY` | Placeholder | `your_openrouter_api_key` |
| `mem0-service/.env.example` | `OPENROUTER_API_BASE` | URL | `https://openrouter.ai/api/v1` |
| `mem0-service/.env.example` | `LLM_PROVIDER` | String | `openai` |
| `mem0-service/.env.example` | `LLM_MODEL` | String | `openai/gpt-5-nano` |
| `backend/src/core/config.py` | `openai_api_key` | Pydantic Field | Default: `None` |
| `backend/src/core/config.py` | `openai_base_url` | Pydantic Field | Default: `https://openrouter.ai/api/v1` |
| `backend/src/core/config.py` | `openrouter_api_key` | Pydantic Field | Default: `None` |
| `backend/src/core/config.py` | `llm_model` | Pydantic Field | Default: `openai/gpt-5-nano` |
| `backend/src/core/mem0_local.py` | `LLM_PROVIDER` | os.environ.get | Default: `openai` |
| `backend/src/core/mem0_local.py` | `LLM_MODEL` | os.environ.get | Default: `openai/gpt-4o-mini` |
| `backend/src/core/mem0_local.py` | `OPENAI_API_KEY` | os.environ.get | Default: `None` |
| `backend/src/core/mem0_local.py` | `OPENAI_BASE_URL` | os.environ.get | Default: `None` |
| `backend/src/core/mem0_local.py` | `OPENROUTER_API_KEY` | os.environ.get | Default: `None` |
| `backend/src/core/mem0_local.py` | `OPENROUTER_API_BASE` | os.environ.get | Default: `None` |
| `backend/src/worker/data_tasks.py` | `openai_key` | os.getenv | Default: empty string `""` |
| `backend/src/worker/data_tasks.py` | `openai_base` | os.getenv | Default: `https://openrouter.ai/api/v1` |
| `backend/src/worker/data_tasks.py` | `llm_model` | os.getenv | Default: `openai/gpt-5-nano` |
| `frontend/src/ai/localClient.ts` | `LOCAL_LLM_BASE_URL` | const (fallback chain) | Default: `https://openrouter.ai/api/v1` |
| `frontend/src/ai/localClient.ts` | `LOCAL_LLM_MODEL` | const (fallback chain) | Default: `gpt-oss-120b` |
| `mem0-service/main.py` | `LLM_PROVIDER` | os.environ.get | Default: `openai` |
| `mem0-service/main.py` | `LLM_MODEL` | os.environ.get | Default: `openai/gpt-5-nano` |
| `mem0-service/main.py` | `OPENAI_API_KEY` | os.environ.get | Default: `None` |
| `mem0-service/main.py` | `OPENAI_BASE_URL` | os.environ.get | Default: `None` |
| `mem0-service/main.py` | `OPENROUTER_API_KEY` | os.environ.get | Default: `None` |
| `mem0-service/main.py` | `OPENROUTER_API_BASE` | os.environ.get | Default: `None` |

---

## KEY OBSERVATIONS

### 1. **Inconsistent Defaults Across Components**

| Component | LLM_MODEL Default |
|-----------|-------------------|
| `.env` | `gpt-4o-mini` |
| `.env.example` | `gpt-5-nano` |
| `docker-compose.yml` | `gpt-4o-mini` |
| `docker-compose.prod.yml` | `gpt-4o-mini` (frontend: `gpt-5-nano`) |
| `docker-compose.pro.yml` | `gpt-4o-mini` (frontend) |
| `backend/src/core/config.py` | `gpt-5-nano` |
| `backend/src/core/mem0_local.py` | `gpt-4o-mini` |
| `backend/src/worker/data_tasks.py` | `gpt-5-nano` |
| `mem0-service/main.py` | `gpt-5-nano` |
| `frontend/src/ai/localClient.ts` | `gpt-oss-120b` (fallback) |

**Impact:** Different components may use different models if env var is not explicitly set.

### 2. **Base URL Unification**
All components default to **`https://openrouter.ai/api/v1`** when not specified — good for consistency.

### 3. **API Key Strategy**
- Production env (`.env.production`) does NOT contain API keys — loaded from secrets/CI
- Development env (`.env`, `frontend/.env.local`) contain actual OpenRouter keys
- Examples show placeholder keys that must be replaced

### 4. **Frontend vs Backend Model Names**
- Backend: `LLM_MODEL` (e.g., `openai/gpt-5-nano`)
- Frontend: `LOCAL_LLM_MODEL` / `NEXT_PUBLIC_LOCAL_LLM_MODEL` (same format)
- Frontend `.env.local.example` shows local Ollama setup option

### 5. **Mem0 Service Integration**
- Standalone `mem0-service/` has its own `.env.example`
- `docker-compose.prod.yml` includes mem0 service with LLM config
- `docker-compose.pro.yml` omits mem0 (mem0 local via `backend/src/core/mem0_local.py`)

---

## EDIT PLANNING NOTES

**To change LLM configuration across the entire project, you need to update:**

1. **Root `.env` file** — Primary source for all Docker services
2. **`docker-compose.yml`, `docker-compose.prod.yml`, `docker-compose.pro.yml`** — If you want to change env var defaults in compose files themselves
3. **`backend/src/core/config.py`** — If you want to change Pydantic field defaults
4. **`backend/src/core/mem0_local.py`** — If you want to change local mem0 defaults
5. **`backend/src/worker/data_tasks.py`** — If you want to change SQL agent defaults
6. **`mem0-service/main.py`** — If you want to change standalone mem0 defaults
7. **`frontend/.env.local`** — For local frontend dev
8. **`.env.example`, `mem0-service/.env.example`, `frontend/.env.local.example`** — Documentation/templates

**Recommendation:** Edit `.env` first (single source of truth for Docker), then adjust source code defaults if needed.

