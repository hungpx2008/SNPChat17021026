# LLM Defaults - Complete Reference with Code

## File-by-File Breakdown

---

### 1. backend/src/core/config.py

**Current Code (Lines 20-24):**
```python
    # LLM Keys
    openai_api_key: str | None = Field(None, alias="OPENAI_API_KEY")
    openai_base_url: str = Field("https://openrouter.ai/api/v1", alias="OPENAI_BASE_URL")
    openrouter_api_key: str | None = Field(None, alias="OPENROUTER_API_KEY")
    llm_model: str = Field("openai/gpt-5-nano", alias="LLM_MODEL")
```

**Defaults to Update:**
- Line 22: `"https://openrouter.ai/api/v1"` (openai_base_url)
- Line 24: `"openai/gpt-5-nano"` (llm_model)

**Impact:** Pydantic Settings - global configuration used throughout backend

---

### 2. backend/src/services/lida_service.py

**Current Code (Lines 33-40):**
```python
                openai_key = os.getenv("OPENAI_API_KEY", "")
                openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
                model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

                text_gen = llm(
                    provider="openai",
                    openai_api_key=openai_key,
                    openai_api_base=openai_base,
```

**Defaults to Update:**
- Line 35: `"https://openrouter.ai/api/v1"` (openai_base)
- Line 36: `"openai/gpt-5-nano"` (model)

**Impact:** LIDA visualization service for chart generation

---

### 3. backend/src/services/search/query_enhancer.py

**Current Code (Lines 122-128):**
```python
        Args:
            model: LLM model name for OpenRouter. Defaults to LLM_MODEL env var.
        """
        self._model = model or os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
        self._api_key = os.getenv("OPENAI_API_KEY", "")
        self._api_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
```

**Defaults to Update:**
- Line 125: `"openai/gpt-4o-mini"` (model)
- Line 127: `"https://openrouter.ai/api/v1"` (api_base)

**Impact:** Query enhancement service for search optimization

---

### 4. backend/src/services/docling_service.py

**Current Code (Lines 647-653):**
```python
            api_key = os.getenv("OPENAI_API_KEY")
            base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
            model = os.getenv("LLM_MODEL", "gpt-4o-mini")
            vlm_enabled = self._env_bool("DOCLING_VLM_ENABLED", True)
            vlm_min_size = self._env_int("DOCLING_VLM_MIN_SIZE", 300)
            vlm_max_images = self._env_int("DOCLING_VLM_MAX_IMAGES", 10)
```

**Defaults to Update:**
- Line 649: `"https://api.openai.com/v1"` (base_url) ⚠️ **Different from OpenRouter**
- Line 650: `"gpt-4o-mini"` (model)

**Impact:** Document processing service (uses direct OpenAI, not OpenRouter)

---

### 5. backend/src/worker/data_tasks.py

**Current Code (Lines 19-31):**
```python
# Initialize the model (OpenRouter) — reads from LLM_MODEL env var
openai_key = os.getenv("OPENAI_API_KEY", "")
openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

model = OpenAIModel(
    llm_model,
    api_key=openai_key,
    base_url=openai_base,
)

# Create a task manager
task_manager = TaskManager(model, _CHUNK_SIZE, _HNSW_EF)
```

**Defaults to Update:**
- Line 23: `"https://openrouter.ai/api/v1"` (openai_base)
- Line 24: `"openai/gpt-5-nano"` (llm_model)

**Impact:** Global module-level model initialization for Celery data extraction tasks

---

### 6. backend/src/worker/chat_tasks.py

**Location A - Context Building (Lines 286-291):**
```python
    """Use ContextBuilder + SystemPromptBuilder for dynamic budget allocation."""
    from src.services.context_builder import ContextBuilder, SystemPromptBuilder

    llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
    prompt_builder = SystemPromptBuilder()
    system_prompt = prompt_builder.build(
```

**Default to Update:**
- Line 289: `"openai/gpt-4o-mini"` (llm_model)

**Location B - Chat Synthesis (Lines 392-410):**
```python
    """
    openai_key = os.getenv("OPENAI_API_KEY", "")
    openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    # gpt-5-nano là reasoning model — trả content="" → dùng gpt-4o-mini làm default
    llm_model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

    # Use dynamic prompt if provided, otherwise fall back to static
    effective_prompt = system_prompt or _RAG_SYSTEM_PROMPT
```

**Defaults to Update:**
- Line 394: `"https://openrouter.ai/api/v1"` (openai_base)
- Line 396: `"openai/gpt-4o-mini"` (llm_model)

**Note:** Comment explains fallback from reasoning model (gpt-5-nano) to gpt-4o-mini

**Location C - Summary Generation (Lines 1082-1090):**
```python
        # 4. Call LLM with improved S2B-ported prompt
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")

        from src.utils.summarization import SUMMARY_PROMPT_VI
        from src.core.http_client import get_http_client
```

**Defaults to Update:**
- Line 1084: `"https://openrouter.ai/api/v1"` (openai_base)
- Line 1085: `"openai/gpt-5-nano"` (llm_model)

**Impact:** Main chat task with three different default model contexts

---

### 7. backend/src/worker/gardener_tasks.py

**Current Code (Lines 35-50):**
```python
    async with semaphore:
        openai_key = os.getenv("OPENAI_API_KEY", "")
        openai_base = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
        llm_model = os.getenv("LLM_MODEL", "openai/gpt-5-nano")
        client = get_http_client(timeout=120.0)

        # Get all user IDs from sessions (quick DB scan)
```

**Defaults to Update:**
- Line 39: `"https://openrouter.ai/api/v1"` (openai_base)
- Line 40: `"openai/gpt-5-nano"` (llm_model)

**Impact:** Celery task for user session gardening

---

### 8. backend/src/worker/helpers.py

**Function A: _extract_text_from_image (Lines 19-30):**
```python
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    if not api_key:
        logger.warning("[vlm] OPENAI_API_KEY is missing. Cannot process image.")
        return ""
```

**Defaults to Update:**
- Line 24: `"https://api.openai.com/v1"` (base_url) ⚠️ **Direct OpenAI**
- Line 25: `"gpt-4o-mini"` (model)

**Function B: _improve_markdown_table (Lines 74-90):**
```python
    """
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    if not api_key or len(markdown_table) < 50:
        return markdown_table
```

**Defaults to Update:**
- Line 80: `"https://api.openai.com/v1"` (base_url) ⚠️ **Direct OpenAI**
- Line 81: `"gpt-4o-mini"` (model)

**Impact:** VLM helper functions for image text extraction and markdown table improvement

---

### 9. backend/src/core/mem0_local.py

**Current Code (Lines 28-40):**
```python
    llm_model = os.environ.get("LLM_MODEL", "openai/gpt-4o-mini")
    ...
    LocalAgent = MemoryAgent(
        agent_id="chatsnp-local-agent",
        llm_model=llm_model,
        llm_provider="openrouter",
        llm_config={"temperature": 0.5},
```

**Default to Update:**
- Line 32: `"openai/gpt-4o-mini"` (llm_model)

**Impact:** Mem0 local memory agent initialization

---

### 10. backend/src/worker/media_tasks.py

**Current Code (Lines 66-75):**
```python
            vlm_text = _extract_text_from_image(file_path)
            page_count = 1
            table_count = 0
            deep_meta = {"extractor": "vlm", "vlm_model": os.getenv("LLM_MODEL", "gpt-4o-mini")}

            # Phase 9: Try OCR on image for text-heavy content (receipts, forms, etc.)
```

**Default to Update:**
- Line 71: `"gpt-4o-mini"` (in deep_meta dict)

**Impact:** Media extraction metadata recording

---

### 11. backend/src/services/chat_service.py

**Current Code (Lines 184-195):**
```python
            llm_model = getattr(self.settings, "llm_model", "openai/gpt-4o-mini")
            ...
            text_gen = llm(
                provider="openai",
                openai_api_key=openai_key,
                openai_api_base=openai_base,
```

**Default to Update:**
- Line 186: `"openai/gpt-4o-mini"` (fallback in getattr)

**Impact:** Chat service fallback when settings object doesn't have llm_model

---

### 12. frontend/src/ai/localClient.ts

**Current Code (Lines 1-15):**
```typescript
import { OpenAI } from '@openai/sdk';

export const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL ||
  'https://openrouter.ai/api/v1';

export const LOCAL_LLM_MODEL =
  process.env.LOCAL_LLM_MODEL ||
  process.env.NEXT_PUBLIC_LOCAL_LLM_MODEL ||
  'gpt-oss-120b';

export const localOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-local',
  baseURL: OPENROUTER_BASE_URL,
  dangerouslyAllowBrowser: true,
});
```

**Defaults to Update:**
- Line 6: `'https://openrouter.ai/api/v1'` (OPENROUTER_BASE_URL)
- Line 11: `'gpt-oss-120b'` (LOCAL_LLM_MODEL)

**Environment Variables Supported:**
- `OPENROUTER_BASE_URL` - Override line 6
- `LOCAL_LLM_MODEL` - Override line 11
- `NEXT_PUBLIC_LOCAL_LLM_MODEL` - Also override line 11

**Impact:** Frontend LLM client configuration and export constants used throughout frontend

---

## Summary Table

| File | Line | Current Value | Type | Service |
|---|---|---|---|---|
| config.py | 22 | `https://openrouter.ai/api/v1` | Pydantic Field | Settings |
| config.py | 24 | `openai/gpt-5-nano` | Pydantic Field | Settings |
| lida_service.py | 35 | `https://openrouter.ai/api/v1` | os.getenv | Visualization |
| lida_service.py | 36 | `openai/gpt-5-nano` | os.getenv | Visualization |
| query_enhancer.py | 125 | `openai/gpt-4o-mini` | os.getenv | Search |
| query_enhancer.py | 127 | `https://openrouter.ai/api/v1` | os.getenv | Search |
| docling_service.py | 649 | `https://api.openai.com/v1` | os.getenv | Documents ⚠️ |
| docling_service.py | 650 | `gpt-4o-mini` | os.getenv | Documents |
| data_tasks.py | 23 | `https://openrouter.ai/api/v1` | os.getenv | Data extraction |
| data_tasks.py | 24 | `openai/gpt-5-nano` | os.getenv | Data extraction |
| chat_tasks.py | 289 | `openai/gpt-4o-mini` | os.getenv | Context building |
| chat_tasks.py | 394 | `https://openrouter.ai/api/v1` | os.getenv | Chat synthesis |
| chat_tasks.py | 396 | `openai/gpt-4o-mini` | os.getenv | Chat synthesis |
| chat_tasks.py | 1085 | `openai/gpt-5-nano` | os.getenv | Summarization |
| gardener_tasks.py | 39 | `https://openrouter.ai/api/v1` | os.getenv | Gardening |
| gardener_tasks.py | 40 | `openai/gpt-5-nano` | os.getenv | Gardening |
| helpers.py | 24 | `https://api.openai.com/v1` | os.getenv | VLM image ⚠️ |
| helpers.py | 25 | `gpt-4o-mini` | os.getenv | VLM image |
| helpers.py | 80 | `https://api.openai.com/v1` | os.getenv | VLM markdown ⚠️ |
| helpers.py | 81 | `gpt-4o-mini` | os.getenv | VLM markdown |
| mem0_local.py | 32 | `openai/gpt-4o-mini` | os.environ.get | Memory |
| media_tasks.py | 71 | `gpt-4o-mini` | os.getenv | Media metadata |
| chat_service.py | 186 | `openai/gpt-4o-mini` | getattr fallback | Chat service |
| localClient.ts | 6 | `https://openrouter.ai/api/v1` | process.env | Frontend client |
| localClient.ts | 11 | `gpt-oss-120b` | process.env | Frontend client |

⚠️ = Uses different base URL from main pattern

