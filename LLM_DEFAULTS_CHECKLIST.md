# LLM Defaults Update Checklist

## Quick Summary
**15 locations** to update (13 backend Python + 1 frontend TypeScript constant)

---

## BACKEND FILES TO UPDATE

### ✅ backend/src/core/config.py
- [ ] **Line 22:** Change `"https://openrouter.ai/api/v1"` → `"[NEW_BASE_URL]"`
- [ ] **Line 24:** Change `"openai/gpt-5-nano"` → `"[NEW_MODEL]"`

### ✅ backend/src/services/lida_service.py
- [ ] **Line 35:** Change `"https://openrouter.ai/api/v1"` → `"[NEW_BASE_URL]"`
- [ ] **Line 36:** Change `"openai/gpt-5-nano"` → `"[NEW_MODEL]"`

### ✅ backend/src/services/search/query_enhancer.py
- [ ] **Line 125:** Change `"openai/gpt-4o-mini"` → `"[NEW_MODEL]"`
- [ ] **Line 127:** Change `"https://openrouter.ai/api/v1"` → `"[NEW_BASE_URL]"`

### ✅ backend/src/services/docling_service.py
- [ ] **Line 649:** Change `"https://api.openai.com/v1"` → `"[NEW_BASE_URL]"` ⚠️
- [ ] **Line 650:** Change `"gpt-4o-mini"` → `"[NEW_MODEL]"`

### ✅ backend/src/worker/data_tasks.py
- [ ] **Line 23:** Change `"https://openrouter.ai/api/v1"` → `"[NEW_BASE_URL]"`
- [ ] **Line 24:** Change `"openai/gpt-5-nano"` → `"[NEW_MODEL]"`

### ✅ backend/src/worker/chat_tasks.py
- [ ] **Line 289:** Change `"openai/gpt-4o-mini"` → `"[NEW_MODEL]"`
- [ ] **Line 394:** Change `"https://openrouter.ai/api/v1"` → `"[NEW_BASE_URL]"`
- [ ] **Line 396:** Change `"openai/gpt-4o-mini"` → `"[NEW_MODEL]"`
- [ ] **Line 1085:** Change `"openai/gpt-5-nano"` → `"[NEW_MODEL]"`

### ✅ backend/src/worker/gardener_tasks.py
- [ ] **Line 39:** Change `"https://openrouter.ai/api/v1"` → `"[NEW_BASE_URL]"`
- [ ] **Line 40:** Change `"openai/gpt-5-nano"` → `"[NEW_MODEL]"`

### ✅ backend/src/worker/helpers.py
- [ ] **Line 24:** Change `"https://api.openai.com/v1"` → `"[NEW_BASE_URL]"` (function: `_extract_text_from_image`)
- [ ] **Line 25:** Change `"gpt-4o-mini"` → `"[NEW_MODEL]"`
- [ ] **Line 80:** Change `"https://api.openai.com/v1"` → `"[NEW_BASE_URL]"` (function: `_improve_markdown_table`)
- [ ] **Line 81:** Change `"gpt-4o-mini"` → `"[NEW_MODEL]"`

### ✅ backend/src/core/mem0_local.py
- [ ] **Line 32:** Change `"openai/gpt-4o-mini"` → `"[NEW_MODEL]"`

### ✅ backend/src/worker/media_tasks.py
- [ ] **Line 71:** Change `"gpt-4o-mini"` → `"[NEW_MODEL]"` (in metadata dict)

### ✅ backend/src/services/chat_service.py
- [ ] **Line 186:** Change `"openai/gpt-4o-mini"` → `"[NEW_MODEL]"` (fallback in getattr)

---

## FRONTEND FILES TO UPDATE

### ✅ frontend/src/ai/localClient.ts
- [ ] **Line 6:** Change `'https://openrouter.ai/api/v1'` → `'[NEW_BASE_URL]'` (OPENROUTER_BASE_URL)
- [ ] **Line 11:** Change `'gpt-oss-120b'` → `'[NEW_MODEL]'` (LOCAL_LLM_MODEL)

> **Note:** This file also supports environment variable overrides:
> - `process.env.OPENROUTER_BASE_URL`
> - `process.env.LOCAL_LLM_MODEL`
> - `process.env.NEXT_PUBLIC_LOCAL_LLM_MODEL`

---

## MODELS CURRENTLY IN USE

| Model | Locations | Notes |
|---|---|---|
| `openai/gpt-5-nano` | 5 | Reasoning model (config, lida, data_tasks, chat_tasks L1085, gardener) |
| `openai/gpt-4o-mini` | 5 | Chat fallback (search, chat_tasks L289/L396, mem0, chat_service) |
| `gpt-4o-mini` | 4 | Direct OpenAI (docling, helpers x2, media_tasks) |
| `gpt-oss-120b` | 1 | Frontend-specific |

| Base URL | Locations | Provider |
|---|---|---|
| `openrouter.ai/api/v1` | 9 | OpenRouter (preferred) |
| `api.openai.com/v1` | 4 | Direct OpenAI (docling, helpers x2) |

---

## ENVIRONMENT VARIABLES TO KNOW

These can override the hardcoded defaults:

**Backend:**
- `LLM_MODEL` - Override any `openai/gpt-*` or `gpt-*` model
- `OPENAI_BASE_URL` - Override base URL (for OpenRouter or OpenAI)
- `OPENAI_API_KEY` - API key for chosen provider

**Frontend:**
- `LOCAL_LLM_MODEL` - Override frontend model
- `NEXT_PUBLIC_LOCAL_LLM_MODEL` - Override frontend model (public)
- `OPENROUTER_BASE_URL` - Override frontend base URL

---

## VERIFICATION STEPS

After updating defaults:

1. **Grep to verify no old values remain:**
   ```bash
   grep -r "openai/gpt-5-nano\|openai/gpt-4o-mini\|gpt-oss-120b" --include="*.py" --include="*.ts" --include="*.tsx" backend/src/ frontend/src/
   ```

2. **Check that env vars are still respected:**
   - Confirm `os.getenv()` and `process.env` still work as fallbacks
   - Test with `LLM_MODEL=custom-model` to verify override behavior

3. **Run tests:**
   ```bash
   cd backend && pytest
   ```

4. **Test deployment with .env file:**
   - Verify no `.env` file defaults override production values
   - Check docker-compose for hardcoded values

---

## NOTES

⚠️ **Dual Provider Setup Detected:**
- Most services use OpenRouter (`openrouter.ai/api/v1`)
- VLM services (docling, helpers) use direct OpenAI (`api.openai.com/v1`)
- This may be intentional for cost/performance reasons

⚠️ **Frontend Model Different from Backend:**
- Backend mainly uses `gpt-5-nano` (reasoning) → `gpt-4o-mini` (fallback)
- Frontend uses `gpt-oss-120b` (open-source alternative)
- Ensure this is intentional or consider unification

