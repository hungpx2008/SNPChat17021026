# Phase 10: Code Quality 5-Star Refactor — Research

**Date:** 2026-04-15
**Phase:** 10 — Code Quality 5-Star Refactor
**Objective:** Answer "What do I need to know to PLAN this phase well?"

---

## 1. Current Codebase Snapshot

### File sizes (measured today)

| File | LOC | Complexity | Target Tasks |
|------|-----|-----------|--------------|
| `backend/src/services/docling_service.py` | 821 | HIGH | #1: Split into 5 modules |
| `backend/src/worker/chat_tasks.py` | 1129 | VERY HIGH | #2: Split by responsibility |
| `backend/src/api/chat.py` | 498 | MEDIUM | #3: Extract CORS helper, #4: Extract task dispatch |
| `backend/src/main.py` | ~100 | LOW | #3: CORS helper dedup (global handler) |
| `backend/src/core/http_client.py` | 58 | LOW | #8: Already singleton — needs adoption audit |
| `backend/src/core/config.py` | 65 | LOW | #7: Constants extraction |
| `frontend/src/components/chat/chat-sidebar.tsx` | 329 | MEDIUM | #9: Split into 3 components + hook |
| `frontend/src/components/chat/chat-message-list.tsx` | 276 | MEDIUM | #10: Split into 3 components + Context |
| `frontend/src/lib/llm-response-formatter.ts` | 189 | LOW | #16: Dead code removal |
| `frontend/src/components/chat/llm-response-renderer.tsx` | 106 | LOW | Related to #10 |
| `frontend/src/services/chat-backend.ts` | ~200 | LOW | #12, #13: Error class + timeout |
| `frontend/src/hooks/use-chat-messages.ts` | 107 | MEDIUM | #15: Hook encapsulation |
| `frontend/src/hooks/use-chat-sessions.ts` | 90 | LOW | #15: Hook encapsulation |

### Quantified Debt Metrics

| Issue | Count | Files Affected |
|-------|-------|----------------|
| `except Exception` (generic catch) | **88** | 21 backend files |
| `: any` type annotations (frontend) | **16** | 11 frontend files |
| Tooltip wrapper duplication | **15+** | chat-sidebar, sidebar.tsx, chart.tsx |
| CORS origin resolution (copy-paste) | **3** | main.py:62-66, chat.py:397-408, chat.py:435-445 |
| httpx.Client instantiation (now consolidated) | **2** (http_client.py) | Already fixed — adoption unknown |
| Missing request timeout (fetch) | **all** | chat-backend.ts has no AbortController |
| Duplicated sanitization logic | **2** | chat-message-list.tsx:29-62, llm-response-formatter.ts:184-190 |

---

## 2. Deep Dive per Task Group

### BACKEND GROUP A: Large File Splits (#1, #2)

#### Task #1: Split `docling_service.py` (821 LOC) into 5 modules

**Current structure analysis:**
- 3 dataclasses: `TableData`, `ChunkData`, `ProcessingResult` (lines 20-45)
- 1 monolithic class `DoclingProcessor` (lines 48-810) with:
  - **Parser utilities** (env helpers, slugify, normalize): 6 static methods
  - **Chunking logic** (`_build_docling_chunks`, `_apply_group_lock`): 2 methods (~200 LOC)
  - **Table detection/serialization** (nested `AdaptiveTableSerializer`, `TripletSerializerProvider`): ~200 LOC inner classes
  - **Embedding prefix builders** (`_build_embedding_prefix`): 1 method
  - **Orchestrator** (`process` method at line 607): ~200 LOC main flow
  - **VLM decision logic** (`_should_call_vlm`): ~40 LOC
- 2 module-level convenience functions: `get_processor()`, `process_document_deep()`

**Proposed split:**
| New Module | Content | Est. LOC |
|-----------|---------|----------|
| `docling/models.py` | `TableData`, `ChunkData`, `ProcessingResult` dataclasses | ~50 |
| `docling/parser.py` | `DocumentParser` — Docling converter init, raw parsing, VLM logic | ~180 |
| `docling/chunker.py` | `DocumentChunker` — chunking, group-lock, heading prefix | ~200 |
| `docling/table_detector.py` | `AdaptiveTableSerializer`, `TripletSerializerProvider`, table helpers | ~200 |
| `docling/embedder.py` | `EmbeddingPreparer` — prefix building, money/unit normalization | ~100 |
| `docling/orchestrator.py` | `DoclingProcessor.process()` + module-level helpers | ~100 |

**Risk:** Nested classes (`AdaptiveTableSerializer` inherits from Docling's `BaseTableSerializer`) use closure over `self`. Extracting requires passing processor config explicitly.

**Dependencies to preserve:** `process_document_deep()` is the public API used by `media_tasks.py`.

#### Task #2: Split `chat_tasks.py` (1129 LOC) into smaller modules

**Current structure — 4 Celery tasks + 16 helper functions:**

| Celery Task | Lines | Responsibility |
|------------|-------|---------------|
| `process_chat_response` | 59-118 | Chunk+embed chat messages → Qdrant |
| `store_memory` | 120-150 | Store long-term memory via Mem0 |
| `rag_document_search` | 746-935 | Full RAG pipeline (search → synthesize → save) |
| `process_feedback` | 938-1016 | Self-correction via user feedback |
| `summarize_session_history` | 1023-1129 | Token-aware session summarization |

**Helper function clusters:**

| Cluster | Functions | LOC | Proposed Module |
|---------|-----------|-----|----------------|
| RAG context building | `_gather_unified_context`, `_build_context_with_builder`, `_build_context_fallback`, `_fetch_session_history`, `_fetch_mem0_memories` | ~130 | `rag/context.py` |
| RAG search helpers | `_build_qdrant_filter`, `_fallback_semantic_search`, `_resolve_parent_content`, `_extract_hybrid_meta`, `_maybe_add_image_hint`, `_build_hybrid_context_and_citations` | ~180 | `rag/search_helpers.py` |
| LLM + text processing | `_synthesize_with_llm`, `_clean_snippet_text`, `_strip_markdown_tables`, `_split_sentences_vi`, `_sanitize_generated_answer`, `_build_fallback_answer`, `_format_citations_footer` | ~200 | `rag/synthesis.py` |
| Embedding | `_get_hf_embed_model`, `embed_query` | ~20 | `rag/embedding.py` (or keep in existing) |

**Risk:** `_RAG_SYSTEM_PROMPT` constant (line 359-373) is referenced from `_build_context_fallback` and `_synthesize_with_llm`. Move to `constants.py` (task #7 synergy).

**Risk:** Celery task registration — task `name` strings must stay identical or all running workers must be redeployed simultaneously. The current names (`src.worker.tasks.*`) are aliased — imports from `src.worker.tasks` redirect to `chat_tasks`. Must preserve backward compatibility.

### BACKEND GROUP B: DRY Extractions (#3, #4, #7, #8)

#### Task #3: Extract CORS helper (3 duplicate blocks)

**The duplicated pattern (found in 3 places):**
```python
# Pattern repeats at: main.py:62-66, chat.py:397-408, chat.py:435-445
origin = request.headers.get("origin", "")
if "*" in settings.allowed_origins:
    allow_origin = "*"
elif origin in settings.allowed_origins:
    allow_origin = origin
elif settings.allowed_origins:
    allow_origin = settings.allowed_origins[0]
else:
    allow_origin = "*"
```

**Proposal:** Create `src/core/cors.py` with `resolve_cors_origin(request, settings) -> str` and a `build_cors_headers(origin, is_sse=False) -> dict` helper.

**Note:** The SSE endpoints need manual CORS because FastAPI middleware doesn't apply to `StreamingResponse`. This is a known limitation — the helper must support both preflight (OPTIONS with `Access-Control-Max-Age`) and streaming (GET with `Vary: Origin`) header sets.

#### Task #4: Extract task dispatch helper

**Current pattern in `chat.py`:**
- Line 138-146: `process_chat_response.delay(...)` with repeated session_id/message_id/content/role/user_id/department unpacking
- Similar patterns in `add_message` endpoint

**Proposal:** Create `src/services/task_dispatcher.py` with typed methods:
```python
def dispatch_chat_embed(session_id, message, user_id, department) -> None
def dispatch_rag_search(question, session_id, user_id, department, target_message_id) -> None
def dispatch_summary_check(session_id) -> None
```

#### Task #7: Create `constants.py` for magic numbers

**Magic values found across codebase:**
| Value | Location | Meaning |
|-------|----------|---------|
| `0.35` | chat_tasks.py:27 | `RAG_SCORE_THRESHOLD` (already env-var) |
| `512` | chat_tasks.py:79 | Chunk size for chat messages |
| `50` | chat_tasks.py:79 | Chunk overlap |
| `5` | chat_tasks.py:236, 802 | `limit` for Mem0 search / Hybrid search |
| `500` | chat_tasks.py:994 | Content truncation for embedding |
| `0.7` | chat_tasks.py:1003 | Similarity threshold for feedback |
| `1500` | chat_tasks.py:432 | `max_tokens` for RAG LLM call |
| `12` | chat_tasks.py:1027 | `keep_count` for summarization |
| `6000` | chat_tasks.py:1028 | `trim_tokens` for summarization |
| `86_400_000` | chat-sidebar.tsx:106 | Milliseconds per day |
| Various | docling_service.py | Many env-var defaults |

**Proposal:** Backend `src/core/constants.py`, Frontend `src/lib/constants.ts`. Keep env-var overrides but centralize defaults.

#### Task #8: Fix HTTP client singleton pattern

**Status:** Already partially done!
- `src/core/http_client.py` exists (58 LOC) with `get_http_client()` and `get_async_http_client()`
- `chat_tasks.py` already uses `from src.core.http_client import get_http_client` at lines 417, 878, 919

**Remaining audit needed:** Grep for direct `httpx.Client(` or `httpx.AsyncClient(` usage outside `http_client.py`. Current grep shows **only 2 instances** — both inside `http_client.py` itself. This task may already be COMPLETE.

**Verification:** Run `grep -r "httpx.Client(" backend/src/ | grep -v http_client.py | grep -v __pycache__` to confirm no stragglers.

### BACKEND GROUP C: Error Handling & Docstrings (#5, #6)

#### Task #5: Fix error handling — specific exceptions

**Scale:** 88 `except Exception` blocks across 21 files.

**Prioritization strategy:**
1. **Worker tasks** (chat_tasks: 14, media_tasks: 10, data_tasks: 10, gardener_tasks: 4) — These catch-all blocks mask real errors in production. Replace with specific `httpx.HTTPError`, `qdrant_client.exceptions.*`, `sqlalchemy.exc.OperationalError`, etc.
2. **Services** (docling_service: 14, lexical_search: 8) — Many are protecting against Docling library internals. Keep catch-all but log at WARNING with specific context.
3. **API layer** (upload: 3, admin: 1, tts: 1) — Convert to `HTTPException` with proper status codes.

**Approach:** Don't try to fix all 88 at once. Focus on the high-value files: `chat_tasks.py`, `media_tasks.py`, `data_tasks.py` (34 total = 38% of all). The rest can be follow-up.

#### Task #6: Add docstrings to all functions/classes

**Current coverage:**
- `chat_tasks.py`: ~50% have docstrings (Celery tasks have them, helpers mostly do too)
- `docling_service.py`: ~30% — dataclasses have them, many static methods don't
- `chat_service.py`: ~40%
- All other services: inconsistent

**Standard to follow (from CONVENTIONS.md):**
```python
def my_function(param: str) -> Result:
    """Short summary (one line).

    Longer description if needed.

    Parameters
    ----------
    param : str
        Description.

    Returns
    -------
    Result
        Description.
    """
```

**Scale estimate:** ~150-200 functions across `src/` need docstrings. This is a high-volume, low-risk task ideal for batch processing.

### FRONTEND GROUP A: Component Splits (#9, #10, #17, #19)

#### Task #9: Split `chat-sidebar.tsx` (329 LOC)

**Current component analysis:**
- `ChatSidebar` — 1 component handling:
  - Tab switching (chat/docs)
  - Search input + results display
  - Chat history with date grouping
  - Document sidebar delegation
  - User footer with sign-out

**Proposed split:**
| Component | Content | Est. LOC |
|-----------|---------|----------|
| `ChatHistorySection.tsx` | Grouped chat list, date labels, delete dialog | ~100 |
| `SearchSection.tsx` | Search input, search results, loading state | ~50 |
| `DocumentsSection.tsx` | Tab wrapper + `DocumentSidebar` delegation | ~30 |
| `useChatGrouping.ts` hook | `formatDateLabel`, `groupedChats` logic | ~40 |
| `ChatSidebar.tsx` (slimmed) | Layout shell, tabs, footer, composition | ~120 |

**Current `groupedChats` logic** (lines 96-131) is pure computation — perfect for a custom hook. The date formatting is Vietnamese-specific ("Hom nay", "Hom qua") and should move to i18n (task #18 synergy).

#### Task #10: Split `chat-message-list.tsx` (276 LOC)

**Current structure:**
- `sanitizeBotContent()` — function (lines 29-62) — should move to `content-sanitizers.ts` (task #11)
- `AttachmentRenderer` — inner component (lines 79-142) — already a clean component, just needs extraction
- `BotMessageContent` — memoized component (lines 145-157) — extract alongside sanitizer
- `ChatMessageList` — main component (lines 159-276) — heavy prop drilling

**Prop drilling identified (task #19):**
- `onPreviewAttachment`, `branchInfoMap`, `onNavigateBranch`, `onEditMessage`, `onRegenerateMessage`, `editingMessageId`, `onStartEdit`, `onCancelEdit`, `branchLoading` — **9 props** passed through to children
- Classic candidate for React Context

**Proposed Context:**
```typescript
interface ChatMessageContext {
  onPreviewAttachment?: (att: Attachment) => void;
  branchInfoMap: Record<string, BranchInfo>;
  onNavigateBranch?: (messageId: string, direction: "prev" | "next") => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  editingMessageId: string | null;
  onStartEdit?: (messageId: string) => void;
  onCancelEdit?: () => void;
  branchLoading?: boolean;
}
```

#### Task #17: Extract IconButton component

**Current pattern (repeated in chat-sidebar.tsx):**
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={...}>
        <Icon />
        <span className="sr-only">{label}</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent><p>{label}</p></TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Found in `chat-sidebar.tsx` (2x), potentially in other components.

**Proposed `IconButton` component:**
```tsx
interface IconButtonProps extends ButtonProps {
  icon: LucideIcon;
  tooltip: string;
}
```

### FRONTEND GROUP B: DRY & Error Handling (#11, #12, #13, #16)

#### Task #11: Create `content-sanitizers.ts`

**Duplicated logic found:**
1. `chat-message-list.tsx:29-62` — `sanitizeBotContent()` strips code blocks, tracebacks, system notes, deduplicates citations
2. `llm-response-formatter.ts:184-190` — `cleanSystemNotes()` strips the same system notes

**Both do:** Remove `"Luu y: Day la thong tin tho tu tai lieu..."` and `"Luu y:...ban co the hoi cu the hon..."`.

**Proposal:** Create `src/lib/content-sanitizers.ts` with:
- `sanitizeBotContent(content: string): string` — full pipeline
- `stripCodeBlocks(content: string): string`
- `stripPythonTracebacks(content: string): string`
- `deduplicateCitations(content: string): string`
- `cleanSystemNotes(content: string): string` (moved from llm-response-formatter.ts)

#### Task #12: Create `BackendError` class

**Current error handling in `chat-backend.ts:55-72`:**
```typescript
if (!response.ok) {
  let errorText = await response.text();
  // Try parsing JSON for nested error...
  throw new Error(`Backend request failed: ${response.status} - ${errorText}`);
}
```

**Proposal:**
```typescript
export class BackendError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
    public readonly url: string,
  ) {
    super(`Backend ${status}: ${statusText}`);
    this.name = 'BackendError';
  }

  get isNotFound(): boolean { return this.status === 404; }
  get isUnauthorized(): boolean { return this.status === 401; }
  get isServerError(): boolean { return this.status >= 500; }
}
```

#### Task #13: Add request timeout for all fetch calls

**Current state:** `chat-backend.ts` uses bare `fetch()` with NO timeout/AbortController. A hanging backend would freeze the UI indefinitely.

**Proposal:** Add timeout wrapper in the `request<T>()` function:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
try {
  const response = await fetch(url, { ...options, signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeoutId);
}
```

Default timeout: 30s for API calls, 120s for file uploads.

#### Task #16: Remove dead code in `llm-response-formatter.ts`

**Analysis of llm-response-formatter.ts (189 LOC):**
- `TABLE_FORMATTING_INSTRUCTIONS` (lines 11-50) — An exported const with system prompt text for table formatting. **Used:** Need to grep.
- `detectAndFormatVietnameseTable()` (lines 55-77) — Table detection and formatting. **Usage unknown.**
- `convertToHtmlTable()` (lines 82-131) — Private helper.
- `parseTableRow()` (lines 136-167) — Private helper.
- `escapeHtml()` (lines 172-179) — Private helper.
- `cleanSystemNotes()` (lines 184-190) — Used in sanitization.

**Key question:** Is `detectAndFormatVietnameseTable()` called anywhere? The comment in `chat-message-list.tsx:45` says "Do not auto-convert plain text to tables; this often corrupts citations/numbered text." — suggesting the table auto-formatting was **deliberately disabled**. The `TABLE_FORMATTING_INSTRUCTIONS` and related table conversion functions may be dead code.

### FRONTEND GROUP C: Type Safety & Hook APIs (#14, #15, #18)

#### Task #14: Fix type safety — remove all `any` types

**16 occurrences across 11 files:**

| File | Count | Nature |
|------|-------|--------|
| `actions.ts` | 3 | Server action error handling |
| `chat-backend.ts` | 2 | Response type generics |
| `use-chat-messages.ts` | 1 | Metadata typing |
| `use-file-attachment.ts` | 2 | File parser results |
| `file-parser.ts` | 1 | Excel parsing output |
| `types.ts` | 1 | `ChatSearchResult.metadata` |
| Auth forms (3 files) | 3 | Form error state |
| `document-sidebar.tsx` | 1 | API response |
| `multimodal-help.ts` | 2 | AI flow typing |

**Approach:** Create strict interfaces in `src/types/` for each domain (backend responses, metadata shapes, form state).

#### Task #15: Fix hook APIs (encapsulation)

**Problem:** Hooks expose raw `setState` functions:
- `use-chat-messages.ts:98` returns `{ messages, setMessages, ... }` — `setMessages` is a raw React setter
- `use-chat-sessions.ts:81-82` returns `{ chatHistory, setChatHistory, activeChatId, setActiveChatId, ... }` — 2 raw setters

**Why this matters:** Consumers can arbitrarily modify state, bypassing any validation or side effects the hook should enforce.

**Proposal:** Replace raw setters with semantic actions:
```typescript
// Before
return { messages, setMessages, ... };

// After
return {
  messages,
  addMessage: (msg: Message) => { /* validate + append */ },
  updateMessage: (id: string, content: string) => { /* find + update */ },
  clearMessages: () => setMessages([welcomeMessage()]),
  ...
};
```

#### Task #18: Constants for magic strings + i18n

**Vietnamese hardcoded strings found:**
- `chat-sidebar.tsx:107-108` — "Hom nay", "Hom qua", "Khac"
- `chat-sidebar.tsx:214` — "Chat" tab label
- `chat-sidebar.tsx:224` — "Tai lieu" tab label
- `chat-message-list.tsx:97` — "Bieu do"
- `chat-message-list.tsx:111` — "Giong doc"
- `chat-message-list.tsx:113` — "Trinh duyet khong ho tro audio."
- `chat-message-list.tsx:135` — "Tai file"

**The project already has a `t()` translation function** passed as prop. These hardcoded strings should use `t("key")` instead.

### SHARED: Tests & Security (#20, #21)

#### Task #20: Add unit tests for sanitization & formatting logic

**Current test coverage:**
- Backend: 16 test files, focused on integration (chat flow, services)
- Frontend: Only `Home.test.tsx` exists (1 test checking redirect)
- **Zero** unit tests for sanitization logic on either side

**Test targets:**
| Function | Location | Testable |
|----------|----------|----------|
| `sanitizeBotContent()` | chat-message-list.tsx → content-sanitizers.ts | Pure function, easy to unit test |
| `cleanSystemNotes()` | llm-response-formatter.ts → content-sanitizers.ts | Pure function |
| `_sanitize_generated_answer()` | chat_tasks.py | Pure function |
| `_clean_snippet_text()` | chat_tasks.py | Pure function |
| `_split_sentences_vi()` | chat_tasks.py | Pure function, Vietnamese-specific |
| `_format_citations_footer()` | chat_tasks.py | Pure function |
| `_build_fallback_answer()` | chat_tasks.py | Pure function |
| `_strip_markdown_tables()` | chat_tasks.py | Pure function |
| `escapeHtml()` | llm-response-formatter.ts | Pure function |

**Test framework:**
- Backend: pytest (already configured, `asyncio_mode = "auto"`)
- Frontend: Jest (already configured, `jest-environment-jsdom`)

**Estimated tests:** ~30-40 test cases covering edge cases (empty input, Vietnamese text, malformed markdown, etc.)

#### Task #21: Fix security issues

**CORS config (from CONCERNS.md #8):**
```python
# main.py:52-53 — currently too permissive
allow_methods=["*"],
allow_headers=["*"],
```

**Proposal:**
```python
allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
```

**Secrets in code (from CONCERNS.md #1, #2):**
- Cloudflare tunnel token hardcoded in `docker-compose.yml:259`
- API keys in `.env` tracked in git

**Note:** Full secrets rotation is operational work, not code refactoring. For this phase, we should:
1. Create `constants.py` with env-var lookups for all secrets (no hardcoded defaults for sensitive values)
2. Tighten CORS config
3. Add `.env` to `.gitignore` if not already there

---

## 3. Dependency Map Between Tasks

```
Task #7  (constants.py)  ─────────────────────────────┐
Task #3  (CORS helper)  ──────────────────────────────┤
Task #4  (task dispatch helper)  ─────────────────────┤
Task #8  (HTTP client audit)  ────────────────────────┤─── Foundation (do FIRST)
Task #21 (security: CORS config)  ────────────────────┤
Task #12 (BackendError class)  ───────────────────────┤
Task #13 (request timeout)  ──────────────────────────┘

Task #1  (split docling_service)  ────────────────────┐
Task #2  (split chat_tasks)  ─────────────────────────┤─── Structural Splits
Task #9  (split chat-sidebar)  ───────────────────────┤    (parallel, independent)
Task #10 (split chat-message-list)  ──────────────────┤
Task #11 (content-sanitizers.ts)  ← needs #10 first ──┘

Task #5  (specific exceptions)  ─── after #1, #2 (need stable file structure)
Task #6  (docstrings)  ─── after #1, #2 (need stable file structure)

Task #14 (remove `any` types)  ───────────────────────┐
Task #15 (hook encapsulation)  ───────────────────────┤─── Polish
Task #16 (dead code removal)  ────────────────────────┤    (after splits)
Task #17 (IconButton component)  ─────────────────────┤
Task #18 (i18n constants)  ───────────────────────────┘

Task #19 (Context for prop drilling)  ← needs #10 first
Task #20 (unit tests)  ← needs #11 for sanitizer tests, can test backend independently
```

---

## 4. Risk Assessment

### HIGH Risk
| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Celery task name changes** during split #2 | Workers fail to find tasks → production outage | Keep exact `name=` strings in `@celery_app.task()`. Use re-exports from `tasks.py` for backward compatibility. |
| **Docling inner classes** depend on `self` closures | Extraction breaks table serialization | Pass config dict explicitly to extracted classes. Test with a real PDF after extraction. |
| **Missing tests during refactor** | Regressions in sanitization/RAG | Write tests BEFORE refactoring (tasks #20 first, or test within each split task). |

### MEDIUM Risk
| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Import cycle** after splitting chat_tasks.py | Circular import error at runtime | Use lazy imports (inside functions) for cross-module references. |
| **Frontend component prop changes** during split | Parent components break | Extract to separate files, keep original as thin wrapper that re-exports. |
| **Hook API change** (#15) breaks consumers | Chat UI stops working | Identify all consumers first; update in same commit. |

### LOW Risk
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Constants extraction | Typo in constant name | Linter catches unused imports. |
| Docstring addition | None | Pure documentation change. |
| Dead code removal | Remove something still used | Grep all exports before removing. |

---

## 5. Execution Strategy Recommendation

### Wave 1: Foundation + Safety Net (Tasks #7, #3, #12, #13, #20-partial)
- Create `constants.py` / `constants.ts` — gives stable references for other tasks
- Extract CORS helper — small, safe, immediate DRY win
- Create `BackendError` class + add request timeout — improves reliability
- Write backend unit tests for pure functions in `chat_tasks.py` — safety net before splitting
- **Estimated effort:** 1-2 sessions

### Wave 2: Backend Structural Splits (Tasks #1, #2, #4, #8)
- Split `docling_service.py` into 5 modules
- Split `chat_tasks.py` into smaller modules
- Extract task dispatch helper
- Verify HTTP client adoption (may already be done)
- **Estimated effort:** 2-3 sessions (highest complexity)

### Wave 3: Frontend Structural Splits (Tasks #9, #10, #11, #17, #19)
- Split `chat-sidebar.tsx` with `useChatGrouping` hook
- Split `chat-message-list.tsx` with Context
- Create `content-sanitizers.ts` (DRY)
- Extract `IconButton` component
- Add Context for prop drilling
- **Estimated effort:** 1-2 sessions

### Wave 4: Polish + Type Safety (Tasks #5, #6, #14, #15, #16, #18)
- Replace generic `except Exception` (priority: worker files)
- Add docstrings (batch job)
- Fix `any` types throughout frontend
- Fix hook encapsulation
- Remove dead code
- i18n for hardcoded strings
- **Estimated effort:** 2-3 sessions

### Wave 5: Security + Tests (Tasks #21, #20-remaining)
- Tighten CORS config
- Frontend sanitizer unit tests
- Integration testing to verify nothing broke
- **Estimated effort:** 1 session

**Total estimated effort:** 7-11 sessions

---

## 6. Success Criteria

| Metric | Before | Target |
|--------|--------|--------|
| Largest backend file | 1129 LOC (chat_tasks.py) | < 250 LOC per file |
| Largest frontend component | 329 LOC (chat-sidebar.tsx) | < 150 LOC per file |
| Generic `except Exception` count | 88 across 21 files | < 20 (only in justified locations with comments) |
| `any` type annotations | 16 across 11 files | 0 |
| Sanitization code duplication | 2 copies | 1 canonical location |
| CORS resolution duplication | 3 copies | 1 helper function |
| Unit test count (sanitizers) | 0 | 30+ |
| Frontend fetch timeout | None | All calls have timeout |
| Hardcoded Vietnamese strings | 10+ | 0 (all use `t()`) |
| Files missing docstrings | ~70% | < 10% |

---

## 7. Files That Will Be Created/Modified

### New Files (Backend)
- `backend/src/core/constants.py`
- `backend/src/core/cors.py`
- `backend/src/services/task_dispatcher.py`
- `backend/src/services/docling/` (5 modules)
- `backend/src/worker/rag/` (3-4 modules)
- `backend/tests/test_sanitization.py`
- `backend/tests/test_rag_helpers.py`

### New Files (Frontend)
- `frontend/src/lib/content-sanitizers.ts`
- `frontend/src/lib/constants.ts`
- `frontend/src/services/backend-error.ts`
- `frontend/src/components/chat/ChatHistorySection.tsx`
- `frontend/src/components/chat/SearchSection.tsx`
- `frontend/src/components/chat/BotMessageRenderer.tsx`
- `frontend/src/components/chat/AttachmentRenderer.tsx` (extracted)
- `frontend/src/components/chat/MessageActionsRow.tsx`
- `frontend/src/components/chat/ChatMessageContext.tsx`
- `frontend/src/components/ui/icon-button.tsx`
- `frontend/src/hooks/use-chat-grouping.ts`
- `frontend/src/__tests__/content-sanitizers.test.ts`

### Modified Files
- All 21 files with `except Exception` (backend)
- `backend/src/main.py` (CORS helper)
- `backend/src/api/chat.py` (CORS helper, task dispatch)
- `backend/src/services/docling_service.py` → becomes thin re-export
- `backend/src/worker/chat_tasks.py` → becomes thin re-export
- `frontend/src/components/chat/chat-sidebar.tsx` → slimmed
- `frontend/src/components/chat/chat-message-list.tsx` → slimmed
- `frontend/src/lib/llm-response-formatter.ts` → dead code removed
- `frontend/src/services/chat-backend.ts` → BackendError + timeout
- `frontend/src/hooks/use-chat-messages.ts` → encapsulated API
- `frontend/src/hooks/use-chat-sessions.ts` → encapsulated API

---

## 8. Open Questions for Planning

1. **Celery task backward compatibility:** Should we keep `src/worker/tasks.py` as a re-export shim? Or do a clean rename + coordinated worker restart?
2. **Docstring style:** Google-style vs NumPy-style? Current codebase mixes both. Recommend standardizing on NumPy-style (already used in `_synthesize_with_llm`).
3. **i18n scope:** Should task #18 add keys to the existing translation system, or just create constants? Full i18n might be a separate phase.
4. **Test isolation for backend pure functions:** Can we test `_sanitize_generated_answer` and similar without standing up the full Docker stack? Yes — they're pure functions with no I/O dependencies.
5. **88 `except Exception` blocks — what % are justified?** Some protect against unstable third-party libs (Docling, Mem0). Estimate ~20% are legitimately catch-all; the rest should be narrowed.
