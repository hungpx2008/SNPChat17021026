# ChatSNP LLM Model Defaults Audit Report

## Summary
Found **15 unique locations** where LLM model names are used as defaults/fallbacks across Python backend and TypeScript frontend code.

---

## PYTHON BACKEND (8 primary + 4 secondary locations)

### PRIMARY DEFAULTS (os.getenv with fallback)

#### 1. **backend/src/core/config.py** (Pydantic Settings)
- **Line 22-24:**
```python
openai_base_url: str = Field("https://openrouter.ai/api/v1", alias="OPENAI_BASE_URL")
openrouter_api_key: str | None = Field(None, alias="OPENROUTER_API_KEY")
llm_model: str = Field("openai/gpt-5-nano", alias="LLM_MODEL")
```
- **Models used:** `openai/gpt-5-nano` (line 24), `https://openrouter.ai/api/v1` (line 22)
- **Type:** Pydantic default
- **Impact:** Global settings object used throughout backend

#### 2. **backend/src/services/lida_service.py**
- **Lines 35-36:**
```python
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")
```
- **Models used:** `openai/gpt-5-nano`, `https://openrouter.ai/api/v1`
- **Type:** LIDA visualization service

#### 3. **backend/src/services/search/query_enhancer.py**
- **Lines 125-127:**
```python
self._model = model or os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
self._api_key = os.getenv("OPENAI_API_KEY", "")
self._api_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
```
- **Models used:** `openai/gpt-4o-mini`, `https://openrouter.ai/api/v1`
- **Type:** Query enhancement service

#### 4. **backend/src/services/docling_service.py**
- **Lines 649-650:**
```python
base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
model = os.getenv("LLM_MODEL", "gpt-4o-mini")
```
- **Models used:** `gpt-4o-mini`, `https://api.openai.com/v1` ⚠️ **DIFFERENT BASE URL**
- **Type:** Document processing service

#### 5. **backend/src/worker/data_tasks.py** (Celery task)
- **Lines 22-24:**
```python
openai_key = os.getenv("OPENAI_API_KEY", "")
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")
```
- **Models used:** `openai/gpt-5-nano`, `https://openrouter.ai/api/v1`
- **Type:** Global module-level initialization for data extraction tasks

#### 6. **backend/src/worker/chat_tasks.py** (Multiple locations)

**Location A - Line 289:**
```python
llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
```
- **Model used:** `openai/gpt-4o-mini`
- **Context:** Dynamic context building for RAG

**Location B - Lines 394-396:**
```python
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
# gpt-5-nano là reasoning model — trả content="" → dùng gpt-4o-mini làm default
llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
```
- **Models used:** `openai/gpt-4o-mini`, `https://openrouter.ai/api/v1`
- **Context:** Main chat message synthesis, with fallback from reasoning model

**Location C - Line 1085:**
```python
llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")
```
- **Model used:** `openai/gpt-5-nano`
- **Context:** Summary generation task

#### 7. **backend/src/worker/gardener_tasks.py** (Celery task)
- **Lines 38-40:**
```python
openai_key = os.getenv("OPENAI_API_KEY", "")
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")
```
- **Models used:** `openai/gpt-5-nano`, `https://openrouter.ai/api/v1`
- **Type:** User session gardening task

#### 8. **backend/src/worker/helpers.py** (VLM extraction utilities)

**Location A - Lines 23-25:**
```python
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
model = os.getenv("LLM_MODEL", "gpt-4o-mini")
```
- **Models used:** `gpt-4o-mini`, `https://api.openai.com/v1`
- **Function:** `_extract_text_from_image()`

**Location B - Lines 79-81:**
```python
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
model = os.getenv("LLM_MODEL", "gpt-4o-mini")
```
- **Models used:** `gpt-4o-mini`, `https://api.openai.com/v1`
- **Function:** `_improve_markdown_table()`

---

### SECONDARY DEFAULTS (indirect/metadata)

#### 9. **backend/src/core/mem0_local.py**
- **Line 32:**
```python
llm_model = os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")
```
- **Model used:** `openai/gpt-4o-mini`
- **Type:** Mem0 local client initialization

#### 10. **backend/src/worker/media_tasks.py**
- **Line 71:**
```python
deep_meta = {"extractor": "vlm", "vlm_model": os.getenv("LLM_MODEL", "gpt-4o-mini")}
```
- **Model used:** `gpt-4o-mini` (metadata only)
- **Type:** Media extraction metadata

#### 11. **backend/src/services/chat_service.py**
- **Line 186:**
```python
llm_model = getattr(self.settings, "llm_model", "openai/gpt-4o-mini")
```
- **Model used:** `openai/gpt-4o-mini`
- **Type:** Chat service fallback

---

## TYPESCRIPT FRONTEND

#### 12. **frontend/src/ai/localClient.ts** (Frontend LLM client)
- **Lines 6-11:**
```typescript
export const OPENROUTER_BASE_URL = 
  process.env.OPENROUTER_BASE_URL || 
  'https://openrouter.ai/api/v1';

export const LOCAL_LLM_MODEL =
  process.env.LOCAL_LLM_MODEL ||
  process.env.NEXT_PUBLIC_LOCAL_LLM_MODEL ||
  'gpt-oss-120b';
```
- **Models used:** `gpt-oss-120b`, `https://openrouter.ai/api/v1`
- **Type:** Frontend environment defaults (exported constant)
- **Environment variables supported:** 
  - `LOCAL_LLM_MODEL`
  - `NEXT_PUBLIC_LOCAL_LLM_MODEL`
  - `OPENROUTER_BASE_URL`

#### 13-15. **frontend/src/app/actions.ts, flows/multimodal-help.ts, flows/contextual-help.ts**
- **Usage locations:** Lines in multiple files
- **Models used:** All reference `LOCAL_LLM_MODEL` (which defaults to `gpt-oss-120b`)
- **Type:** Consumer of frontend LLM model constant

---

## CONFIGURATION MATRIX

| Location | LLM_MODEL | OPENAI_BASE_URL | Variable Type | Service |
|---|---|---|---|---|
| config.py | `openai/gpt-5-nano` | `openrouter.ai/api/v1` | Pydantic default | Settings |
| lida_service.py | `openai/gpt-5-nano` | `openrouter.ai/api/v1` | os.getenv() | Visualization |
| query_enhancer.py | `openai/gpt-4o-mini` | `openrouter.ai/api/v1` | os.getenv() | Search |
| docling_service.py | `gpt-4o-mini` | `api.openai.com/v1` | os.getenv() | Document parsing |
| data_tasks.py | `openai/gpt-5-nano` | `openrouter.ai/api/v1` | os.getenv() | Data extraction |
| chat_tasks.py (L289) | `openai/gpt-4o-mini` | N/A | os.getenv() | Context building |
| chat_tasks.py (L396) | `openai/gpt-4o-mini` | `openrouter.ai/api/v1` | os.getenv() | Chat synthesis |
| chat_tasks.py (L1085) | `openai/gpt-5-nano` | `openrouter.ai/api/v1` | os.getenv() | Summarization |
| gardener_tasks.py | `openai/gpt-5-nano` | `openrouter.ai/api/v1` | os.getenv() | Gardening |
| helpers.py (both) | `gpt-4o-mini` | `api.openai.com/v1` | os.getenv() | VLM extraction |
| mem0_local.py | `openai/gpt-4o-mini` | N/A | os.environ.get() | Memory |
| media_tasks.py | `gpt-4o-mini` | N/A | os.getenv() | Media metadata |
| chat_service.py | `openai/gpt-4o-mini` | N/A | getattr() | Chat service |
| localClient.ts | `gpt-oss-120b` | `openrouter.ai/api/v1` | process.env | Frontend client |

---

## KEY FINDINGS

### ⚠️ INCONSISTENCIES DETECTED

1. **Model Name Variations:**
   - With prefix: `openai/gpt-5-nano`, `openai/gpt-4o-mini`
   - Without prefix: `gpt-4o-mini`, `gpt-5-nano`
   - Frontend-specific: `gpt-oss-120b`

2. **Base URL Variations:**
   - Most use: `https://openrouter.ai/api/v1`
   - Document/VLM services use: `https://api.openai.com/v1` ⚠️
   - This suggests dual-provider setup

3. **Reasoning Model Issue:**
   - `gpt-5-nano` is noted as "reasoning model" that sometimes returns empty content
   - Fallback to `gpt-4o-mini` is implemented in chat_tasks.py line 440 comment

### 📊 DISTRIBUTION

- **Backend Python:** 13 locations
- **Frontend TypeScript:** 1 constant + 3 consumption points
- **Models used:**
  - `openai/gpt-5-nano`: 5 locations (main reasoning model for OpenRouter)
  - `openai/gpt-4o-mini`: 5 locations (main fallback for chat)
  - `gpt-4o-mini`: 4 locations (direct OpenAI API)
  - `gpt-oss-120b`: 1 location (frontend only)
- **Base URLs:**
  - `openrouter.ai/api/v1`: 9 locations (preferred provider)
  - `api.openai.com/v1`: 4 locations (direct OpenAI)

---

## ACTIONS REQUIRED

To update all LLM defaults, you need to modify:

1. **Python backend:** 8 files, 13+ lines
2. **TypeScript frontend:** 1 file, 1 export constant

All files have been identified and documented above with exact line numbers.

