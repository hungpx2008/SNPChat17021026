# Smart2Brain Techniques Integration — Design Spec

**Date:** 2026-04-13
**Source:** [obsidian-Smart2Brain](https://github.com/your-papa/obsidian-Smart2Brain)
**Target:** ChatSNP Backend (FastAPI + Celery + PostgreSQL + Qdrant)

## Overview

Port 5 proven techniques from Smart2Brain into ChatSNP to improve context management, search quality, summarization intelligence, and conversation flexibility.

**Approach:** Direct port — translate TypeScript logic/constants to Python, adapt for server-side architecture. Keep original thresholds and algorithms (battle-tested in Smart2Brain production).

**Milestone:** 1 milestone, 5 phases, ordered by dependency.

---

## Phase Order & Dependencies

```
Phase 1: Token-Aware Context Building (foundation)
    ↓
Phase 2: Smart Summarization (uses token estimation)
    ↓
Phase 3: Dynamic System Prompt (uses context builder)
    ↓
Phase 4: Hybrid Search (independent, integrates into context)
    ↓
Phase 5: Conversation Branching (DB schema change, last)
```

---

## Phase 1: Token-Aware Context Building

**Goal:** Replace hardcoded context assembly (6 recent msgs + summary + memory) with dynamic budget-based building.

**Source files:**
- Smart2Brain: `src/utils/tokenEstimator.ts`
- ChatSNP target: `_gather_unified_context()` in `chat_tasks.py:344`

### New Files

#### `backend/src/utils/token_estimator.py`

Port from `tokenEstimator.ts` with Vietnamese adaptation.

**Constants:**
- `TOKENS_PER_WORD_VI = 1.8` (S2B uses 1.3 for English; Vietnamese needs more due to diacritics and subword tokenization)
- `PER_MESSAGE_OVERHEAD = 80` (from S2B)
- `SYSTEM_PROMPT_OVERHEAD = 120` (from S2B)
- `TOOL_CALL_OVERHEAD = 60` (from S2B)

**Model context windows:**
```python
MODEL_CONTEXT_WINDOWS = {
    "openai/gpt-4o-mini": 128_000,
    "openai/gpt-5-nano": 128_000,
}
```

**Functions:**
- `estimate_tokens(text: str) -> int` — word-split + multiply by TOKENS_PER_WORD_VI
- `estimate_message_tokens(messages: list[dict]) -> dict` — port from `estimateBaseMessagePayloadTokens()`
- `estimate_conversation_tokens(messages: list[dict]) -> int` — total conversation token count

#### `backend/src/services/context_builder.py`

**Class: `ContextBuilder`**

```
__init__(model: str, context_window: int | None = None)
build_context(system_prompt, memories, summary, messages, rag_context) -> dict
```

**Budget allocation logic:**
1. `budget = context_window * 0.85` (reserve 15% for response)
2. Deduct system prompt tokens (mandatory)
3. Deduct long-term memories (mandatory, usually small)
4. Fit recent messages into 50% of remaining budget (newest first)
5. Fit summary into remaining budget (skip if no room)
6. Fit RAG context into remaining budget (truncate if needed)

**Helper functions:**
- `fit_messages_to_budget(messages, budget) -> (list, tokens_used)`
- `truncate_to_budget(text, budget) -> str`

### Integration Changes

**File:** `backend/src/worker/chat_tasks.py`

**Change:** Replace `_gather_unified_context()` (line 344) hardcoded `LIMIT 6` with `ContextBuilder`:

```python
# Before: SELECT ... LIMIT 6 (hardcoded)
# After:
builder = ContextBuilder(model=llm_model)
ctx = builder.build_context(
    system_prompt=system_prompt,
    memories=mem0_results,
    summary=session_summary,
    messages=all_messages,  # All messages, builder decides how many to include
    rag_context=context_text,
)
```

---

## Phase 2: Smart Summarization

**Goal:** Replace "every 10 messages" trigger with token-aware summarization.

**Source files:**
- Smart2Brain: `src/agent/summarization.ts`
- ChatSNP target: `chat_service.py:131-135` (trigger) + `chat_tasks.py:846-931` (task)

### New File

#### `backend/src/utils/summarization.py`

Port constants directly from `summarization.ts`:

```python
SUMMARY_TRIGGER_RATIO = 0.8        # line 1
SUMMARY_KEEP_MESSAGE_COUNT = 12    # line 2
SUMMARY_MIN_TRIGGER_TOKENS = 12_000  # line 3
SUMMARY_MIN_TRIM_TOKENS = 6_000    # line 4
SUMMARY_MAX_TRIM_TOKENS = 24_000   # line 5
```

**Functions (direct ports):**
- `get_summarization_trigger_tokens(context_window) -> int | None` — port from `getSummarizationTriggerTokens()`
- `get_trim_tokens(trigger_tokens) -> int` — port from `getTrimTokensToSummarize()`
- `should_summarize(estimated_tokens, context_window) -> bool` — port from `shouldSummarizeForEstimatedTokens()`

### Improved Summarization Prompt

Port from S2B `SUMMARY_PROMPT` (line 7-17), adapted for Vietnamese:

```
Tóm tắt cuộc hội thoại trước đó để trợ lý có thể tiếp tục chính xác.

BẢO TOÀN:
- Mục tiêu, sở thích, ràng buộc của người dùng
- Các sự kiện, quyết định quan trọng, câu hỏi chưa giải quyết
- Kết quả tra cứu, tài liệu tham khảo còn liên quan
- Các chỉ dẫn cụ thể cần tiếp tục áp dụng

Viết súc tích nhưng cụ thể. KHÔNG bịa thông tin.
```

### Integration Changes

**File:** `backend/src/services/chat_service.py` (line 131-135)

```python
# Before:
# if msg_count > 0 and msg_count % 10 == 0:
#     summarize_session_history.delay(session_id=str(session_id))

# After:
estimated_tokens = estimate_conversation_tokens(all_messages)
context_window = MODEL_CONTEXT_WINDOWS.get(settings.llm_model, 128_000)
if should_summarize(estimated_tokens, context_window):
    summarize_session_history.delay(
        session_id=str(session_id),
        keep_count=SUMMARY_KEEP_MESSAGE_COUNT,
        trim_tokens=get_trim_tokens(get_summarization_trigger_tokens(context_window)),
    )
```

**File:** `backend/src/worker/chat_tasks.py` (line 846-931)

Changes to `summarize_session_history` task:
1. Accept `keep_count` and `trim_tokens` parameters
2. Keep last `keep_count` messages unsummarized (S2B: 12)
3. Only summarize messages beyond the keep window
4. Use improved summarization prompt
5. Keep original messages in DB (summary is supplementary, not destructive)

---

## Phase 3: Dynamic System Prompt

**Goal:** Replace static `_RAG_SYSTEM_PROMPT` with context-aware dynamic prompt builder.

**Source files:**
- Smart2Brain: `src/agent/prompts.ts` — `BASE_SYSTEM_PROMPT`
- ChatSNP target: `chat_tasks.py:411-425` (`_RAG_SYSTEM_PROMPT`)

### Addition to `backend/src/services/context_builder.py`

**Class: `SystemPromptBuilder`**

Structure mirrors Smart2Brain's prompt sections:
1. **Role** — ChatSNP port consultant (Vietnamese)
2. **User Context** — Dynamic: memories, summary, recent entities, department
3. **Available Tools** — Dynamic based on mode (chat/rag/sql)
4. **Response Rules** — Formatting, citation, currency handling

```python
BASE_PROMPT = """# Vai trò
Bạn là chuyên viên tư vấn nhiệt tình, chuyên nghiệp của ChatSNP (Tân Cảng Sài Gòn).

# Ngữ cảnh Người dùng
{user_context}

# Công cụ Khả dụng
{available_tools}

# Quy tắc Trả lời
{response_rules}
"""
```

**Method: `build(mode, memories, session_summary, recent_entities, department) -> str`**

**S2B mapping:**
| Smart2Brain Section | ChatSNP Equivalent |
|---|---|
| Wiki Links in Messages | N/A (no wiki links) |
| Currently Visible Notes | Mem0 long-term memories |
| Selected Text | Session summary / recent entities |
| Graph-Selected Notes | N/A |
| Tool Guidance | Mode-specific tools (rag/sql/chat) |
| Formatting | Vietnamese formatting rules |

### Integration Changes

**File:** `backend/src/worker/chat_tasks.py`

Replace static `_RAG_SYSTEM_PROMPT` (line 411) with:
```python
prompt_builder = SystemPromptBuilder()
system_prompt = prompt_builder.build(
    mode="rag",
    memories=[...],
    session_summary=summary_block,
    department=department,
)
```

Same pattern applied to `process_chat_response` for chat mode and `run_sql_query` for sql mode.

---

## Phase 4: Hybrid Search (Semantic + BM25 + RRF)

**Goal:** Add lexical BM25 search alongside existing Qdrant semantic search, merge with RRF fusion.

**Source files:**
- Smart2Brain: `src/agent/tools/searchNotes.ts` (`hybridSearch()`)
- Smart2Brain: `src/search/searchRanking.ts` (title/tag/alias boost)
- ChatSNP target: `rag_document_search` task in `chat_tasks.py:623`

### New Files

#### `backend/src/services/search/lexical_search.py`

Whoosh BM25 search service (Python equivalent of S2B's MiniSearchService).

**Whoosh Schema:**
```python
Schema(
    doc_id=ID(stored=True, unique=True),
    title=TEXT(stored=True, field_boost=2.0),     # S2B: title 2x
    content=TEXT(stored=True),
    tags=KEYWORD(stored=True, commas=True, field_boost=1.5),  # S2B: tags 1.5x
    department=ID(stored=True),
    user_id=ID(stored=True),
)
```

**Methods:**
- `search(query, limit=100, filters=None) -> list[dict]`
- `index_document(doc_id, title, content, tags, department, user_id)`
- `remove_document(doc_id)`
- `rebuild_index()` — full reindex from PostgreSQL

**Index location:** `/data/whoosh_index` (Docker volume)

#### `backend/src/services/search/hybrid_search.py`

Port from `hybridSearch()` in searchNotes.ts (lines 91-149).

**Constants (from S2B):**
- `RRF_K = 60` — Standard RRF constant
- `TITLE_BOOST_MAX = 0.03` — Max title boost (line 93)
- `ALIAS_BOOST_MAX = 0.028` — Max alias boost (line 94)
- `TAG_BOOST_MAX = 0.02` — Tag boost

**Algorithm:**
1. Run semantic (Qdrant) + lexical (Whoosh) in parallel — `ThreadPoolExecutor` (Celery tasks are sync) or `asyncio.gather()` (if called from async context)
2. Build RRF score map: `score = 1/(k + rank + 1)` for each result from each source
3. Merge: if same doc appears in both, add scores
4. Apply title boost + tag boost post-fusion
5. Sort by combined score, return top N

#### `backend/src/services/search/search_ranking.py`

Port from `searchRanking.ts`.

**Functions:**
- `calculate_title_boost(query, title, max_boost) -> float` — Tiered: exact=max, startsWith=0.8x, contains=0.8x, allTerms=0.6x, partial=ratio*0.6x
- `calculate_tag_boost(query, tags, max_boost) -> float` — exact=max, startsWith=0.4x, contains=0.25x
- `normalize_text(text) -> str` — lowercase, split, filter
- `tokenize(text) -> list[str]` — significant terms only

### Integration Changes

**File:** `backend/src/worker/chat_tasks.py`

Replace pure-semantic retrieval in `rag_document_search` (line 650-654):
```python
# Before: LlamaIndex retriever only
# After: HybridSearchService
hybrid = HybridSearchService(lexical=LexicalSearchService())
results = await hybrid.search(query=question, user_id=user_id, department=department, limit=5)
```

**File:** `backend/src/worker/media_tasks.py`

In `process_document` task: also index into Whoosh:
```python
lexical_service.index_document(
    doc_id=str(doc.id), title=doc.filename,
    content=extracted_text, tags=..., department=...,
)
```

### Docker Changes

Add Whoosh index volume in `docker-compose.yml`:
```yaml
backend:
  volumes:
    - whoosh_index:/data/whoosh_index
```

---

## Phase 5: Conversation Branching

**Goal:** Transform linear chat history into a tree structure supporting edit/regenerate/branch navigation.

**Source files:**
- Smart2Brain: `src/stores/chatStore.svelte.ts` (CheckpointNode, BranchInfo, editMessage, regenerate)
- Smart2Brain: `src/components/chat/BranchNavigator.svelte`
- ChatSNP target: `models.py`, `chat_service.py`, `chat_routes.py`, frontend components

### DB Schema Changes

**File:** `backend/src/models/models.py`

Add to `ChatMessage`:
```python
parent_message_id: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("chat_messages.id", ondelete="SET NULL"),
    nullable=True, index=True,
)
branch_index: Mapped[int] = mapped_column(default=0)
is_active_branch: Mapped[bool] = mapped_column(default=True)
```

**Migration:** Alembic migration to:
1. Add columns
2. Backfill existing messages with linear parent links (`LAG(id) OVER (PARTITION BY session_id ORDER BY created_at)`)

### New Backend Files

#### `backend/src/services/conversation_tree.py`

Port from `chatStore.svelte.ts` checkpoint graph model.

**Dataclass: `BranchInfo`** (port from S2B BranchInfo interface, line 127-138)
- `current_index: int` (1-based)
- `total_branches: int`
- `sibling_ids: list[str]`
- `fork_point_id: str`

**Class: `ConversationTree`**

Methods:
- `get_active_branch(session_id) -> list[ChatMessage]` — Walk tree following is_active_branch
- `get_branch_info(message_id) -> BranchInfo | None` — Get sibling count + navigation info
- `edit_message(message_id, new_content) -> ChatMessage` — Fork: new sibling at same parent
- `regenerate(user_message_id) -> None` — Fork: new AI response branch
- `navigate_branch(message_id, direction) -> list[ChatMessage]` — Switch active branch
- `get_full_tree(session_id) -> dict` — Full tree structure for visualization

### New API Endpoints

**File:** `backend/src/api/chat_routes.py`

```
POST   /sessions/{id}/messages/{msg_id}/edit         — Fork: edit user message
POST   /sessions/{id}/messages/{msg_id}/regenerate    — Fork: regenerate AI response
GET    /sessions/{id}/messages/{msg_id}/branches      — Get branch navigation info
POST   /sessions/{id}/messages/{msg_id}/navigate      — Switch branch (direction: -1/+1)
GET    /sessions/{id}/tree                            — Full conversation tree
```

### Frontend Changes

**New components:**
- `BranchNavigator.tsx` — Port from S2B `BranchNavigator.svelte`. Shows `← 2/3 →` controls.
- `ConversationTree.tsx` — Full tree visualization (SVG-based)
  - Timeline vertical (main)
  - Branch points marked with indicator
  - Collapsed branches show count
  - Click to switch branch
- `MessageActions.tsx` — Edit pencil icon + Regenerate refresh icon

**New hook:**
- `useConversationTree.ts` — Tree state management, branch navigation API calls

**Modified components:**
- `MessageBubble.tsx` — Add BranchNavigator + MessageActions
- `ChatWindow.tsx` — Use tree-based message loading instead of flat list

### Existing Endpoint Changes

**File:** `backend/src/services/chat_service.py`

- `get_session_with_messages()` — Change to return active branch (tree-walk) instead of flat list
- `add_message()` — Set `parent_message_id` to previous message in conversation

---

## Files Changed Summary

| Phase | New Files | Modified Files |
|---|---|---|
| 1 | `utils/token_estimator.py`, `services/context_builder.py` | `worker/chat_tasks.py` |
| 2 | `utils/summarization.py` | `services/chat_service.py`, `worker/chat_tasks.py` |
| 3 | (added to `context_builder.py`) | `worker/chat_tasks.py` |
| 4 | `services/search/lexical_search.py`, `services/search/hybrid_search.py`, `services/search/search_ranking.py` | `worker/chat_tasks.py`, `worker/media_tasks.py`, `docker-compose.yml` |
| 5 | `services/conversation_tree.py`, frontend components | `models/models.py`, `services/chat_service.py`, `api/chat_routes.py`, frontend components |

## Testing Strategy

Each phase includes:
1. **Unit tests** for new utility functions (token estimation, summarization triggers, search ranking)
2. **Integration tests** for service classes (ContextBuilder, HybridSearch, ConversationTree)
3. **Regression tests** to ensure existing behavior is preserved

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Vietnamese token estimation inaccuracy | Context overflow or underuse | Calibrate TOKENS_PER_WORD_VI with real data; add telemetry |
| Whoosh index corruption | Search unavailable | Rebuild-from-DB capability; semantic search as fallback |
| DB migration breaks existing sessions | Data loss | Backfill script tested on staging; reversible migration |
| Tree query performance | Slow API for branched conversations | Recursive CTE with index; limit tree depth |
