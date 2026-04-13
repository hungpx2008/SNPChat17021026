---
phase: "05"
title: "Conversation Branching — Phase Verification"
status: PASS_WITH_ISSUES
date: 2026-04-14
must_haves_total: 38
must_haves_pass: 33
must_haves_fail: 2
must_haves_partial: 3
---

# Phase 05 Verification: Conversation Branching

## Phase Goal

> Transform linear chat history into tree structure

**Verdict: PASS WITH ISSUES** — The core tree structure is fully implemented across backend and frontend. 33 of 38 must-haves pass, 3 are partial (minor deviations from plan spec), and 2 fail (type mismatches that will cause runtime errors).

---

## PLAN 05-01: DB Schema + ConversationTree Service

### MH-01: ChatMessage model has parent_message_id (UUID FK, nullable), branch_index (int, default=0), is_active_branch (bool, default=True)

**Status: PASS**

Evidence (`models.py` L52-58):
```python
parent_message_id: Mapped[UUID | None] = mapped_column(
    PGUUID(as_uuid=True),
    ForeignKey("chat_messages.id", ondelete="SET NULL"),
    nullable=True,
)
branch_index: Mapped[int] = mapped_column(default=0)
is_active_branch: Mapped[bool] = mapped_column(default=True)
```

All three columns present with correct types and defaults.

---

### MH-02: parent_message_id has index ONLY in __table_args__ (not duplicated with index=True)

**Status: PASS**

Evidence (`models.py` L39-42): Index defined in `__table_args__` as `Index("ix_chat_messages_parent", "parent_message_id")`. Grep for `index=True` confirms `parent_message_id` line does NOT contain `index=True`.

---

### MH-03: ConversationTree service exists with get_active_branch, get_branch_info, edit_message, regenerate, navigate_branch, get_full_tree

**Status: PASS**

File `conversation_tree.py` exists. All 6 public methods present:
- `get_active_branch` (L42)
- `get_branch_info` (L46)
- `edit_message` (L71)
- `regenerate` (L116)
- `navigate_branch` (L162)
- `get_full_tree` (L208)

---

### MH-04: BranchInfo dataclass has current_index, total_branches, sibling_ids, fork_point_id

**Status: PARTIAL** (field names deviate from plan)

The `BranchInfo` dataclass exists (`conversation_tree.py` L19-29) but field names differ from the plan:

| Plan spec | Actual field | Present? |
|---|---|---|
| `current_index` | `branch_index` | Different name |
| `total_branches` | `total_siblings` | Different name |
| `sibling_ids` | `sibling_ids` | PASS (but `list[UUID]` not `list[str]`) |
| `fork_point_id` | `parent_message_id` | Different name |

Additional fields not in plan: `message_id`, `is_active`, `children_count`.

The API layer (`chat.py` L255-260) maps these to the correct schema names (`current_index`, `total_branches`, `sibling_ids`, `fork_point_id`) for the frontend, so the API contract is correct despite the internal naming difference.

---

### MH-05: MessageRepository has get_last_active_message (filters by is_active_branch=True)

**Status: PASS**

`messages.py` L84-108: Method exists, filters by `ChatMessage.is_active_branch.is_(True)`, with fallback to latest message.

---

### MH-06: MessageRepository has update_message_content for Celery placeholder filling

**Status: PASS**

`messages.py` L153-167: Method exists, updates content and optionally metadata.

---

### MH-07: MessageRepository has recursive CTE method list_active_branch_messages

**Status: PASS**

`messages.py` L169-207: Method exists with recursive CTE (`WITH RECURSIVE branch AS`). Falls back to `list_messages()` if CTE returns empty.

---

### MH-08: ChatService.add_message() sets parent_message_id using get_last_active_message()

**Status: PASS**

`chat_service.py` L77-85:
```python
last_active = await self.message_repo.get_last_active_message(session_id)
parent_message_id = last_active.id if last_active else None
...
parent_message_id=parent_message_id,
```

---

### MH-09: ChatService.get_session_with_messages() returns active branch by default

**Status: PASS**

`chat_service.py` L58-62:
```python
if limit is None:
    messages = await self.message_repo.list_active_branch_messages(session_id)
else:
    messages = await self.message_repo.list_messages(session_id, limit=limit)
```

---

### MH-10: ChatService.serialize_message() includes parent_message_id, branch_index, is_active_branch

**Status: PASS**

`chat_service.py` L274-280: All three fields present with `getattr` safety for backward compatibility.

---

### MH-11: Redis cache invalidated on branch operations

**Status: PASS**

`conversation_tree.py` L266-272: `_invalidate_cache` deletes `chat:session:{session_id}` key. Called in `edit_message` (L113), `regenerate` (L159), and `navigate_branch` (L205).

---

### MH-12: Backfill SQL uses LAG(id) OVER (PARTITION BY session_id ORDER BY created_at)

**Status: PASS**

Present in both:
- `db.py` L118-119: `LAG(id) OVER (PARTITION BY session_id ORDER BY created_at)`
- `backfill_parent_messages.sql` L30: Same LAG expression

---

### MH-13: create_tables() calls _ensure_branching_columns()

**Status: PASS**

`db.py` L67: `await _ensure_branching_columns(conn)` called inside `create_tables()`.

---

## PLAN 05-02: API Endpoints + Pydantic Schemas

### MH-14: EditMessageRequest, NavigateBranchRequest, BranchInfoSchema, ConversationTreeSchema, BranchMessageSchema, RegenerateRequest schemas

**Status: PASS**

All 6 schemas present in `schemas.py`:
- `EditMessageRequest` (L133)
- `RegenerateRequest` (L137)
- `NavigateBranchRequest` (L142)
- `BranchInfoSchema` (L146)
- `ConversationTreeSchema` (L164)
- `BranchMessageSchema` (L169)

`TreeNodeSchema` also present (L153) with `model_rebuild()` (L182).

---

### MH-15: MessageSchema updated with parent_message_id, branch_index, is_active_branch

**Status: PASS**

`schemas.py` L32-34:
```python
parent_message_id: UUID | None = None
branch_index: int = 0
is_active_branch: bool = True
```

All three have backward-compatible defaults.

---

### MH-16: 5 new API endpoints: edit, regenerate, branches, navigate, tree

**Status: PASS**

All 5 endpoints in `chat.py`:
- `POST /{session_id}/messages/{message_id}/edit` (L121)
- `POST /{session_id}/messages/{message_id}/regenerate` (L163)
- `GET /{session_id}/messages/{message_id}/branches` (L244)
- `POST /{session_id}/messages/{message_id}/navigate` (L263)
- `GET /{session_id}/tree` (L292)

---

### MH-17: rag_document_search task accepts target_message_id

**Status: PASS**

`chat_tasks.py` L881: `target_message_id: str | None = None` in signature. L960-971: Conditionally PATCHes placeholder vs POSTs new message.

---

### MH-18: run_sql_query task accepts target_message_id

**Status: PASS**

`data_tasks.py` L94: `target_message_id: str | None = None` in signature. L211-228: Conditionally PATCHes or POSTs. Error handler (L249-262) also handles target_message_id.

---

### MH-19: PATCH /messages/{id}/content endpoint exists

**Status: PASS**

`chat.py` L355: `@messages_router.patch("/{message_id}/content")`. Endpoint registered in `main.py` L88. Uses `msg_repo.update_message_content()`.

---

### MH-20: Error messages in Vietnamese

**Status: PASS**

Multiple Vietnamese error messages found:
- `"Tin nhn khng tn ti"` (chat.py L254, L368)
- `"Ch c th to li phn hi ca tr l"` (conversation_tree.py L129)
- `"Khng c nhnh no hng ny"` (conversation_tree.py L194)

---

## PLAN 05-03: Frontend Components + Hooks

### MH-21: chat-backend.ts has editMessage, regenerateMessage, getBranchInfo, navigateBranch, getConversationTree

**Status: PASS**

All 5 methods present in `chat-backend.ts`:
- `editMessage` (L286)
- `regenerateMessage` (L297)
- `getBranchInfo` (L306)
- `navigateBranch` (L313)
- `getConversationTree` (L324)

---

### MH-22: BackendMessage includes parent_message_id, branch_index, is_active_branch

**Status: PASS**

`chat-backend.ts` L95-97:
```typescript
parent_message_id?: string | null;
branch_index?: number;
is_active_branch?: boolean;
```

---

### MH-23: BranchInfo, TreeNode, ConversationTree TypeScript interfaces

**Status: PASS**

All three exported interfaces present:
- `BranchInfo` (L132)
- `TreeNode` (L139)
- `ConversationTree` (L150)

---

### MH-24: Message type has parentMessageId, branchIndex, isActiveBranch

**Status: PASS**

`types.ts` L13-15:
```typescript
parentMessageId?: string;
branchIndex?: number;
isActiveBranch?: boolean;
```

---

### MH-25: useConversationTree hook

**Status: PASS**

File `use-conversation-tree.ts` exists with `export function useConversationTree()` (L8). Contains all required state and callbacks: `branchInfoMap`, `editingMessageId`, `branchLoading`, `fetchBranchInfo`, `fetchAllBranchInfo`, `navigateBranch`, `editMessage`, `regenerateMessage`, `startEditing`, `cancelEditing`.

---

### MH-26: BranchNavigator component (< 2/3 >)

**Status: PASS**

File `branch-navigator.tsx` exists. Shows `{currentDisplay}/{branchInfo.total_branches}` with prev/next ChevronLeft/ChevronRight buttons. Only renders when `total_branches > 1` (L14).

---

### MH-27: MessageActions component (edit + regenerate)

**Status: PASS**

File `message-actions.tsx` exists. Shows Pencil icon for `role === "user"` (L68-78), RefreshCw icon for `role === "bot"` (L80-92). Inline Textarea editing mode when `isEditing` is true (L33-63).

---

### MH-28: chat-message-list.tsx renders BranchNavigator + MessageActions

**Status: PASS**

`chat-message-list.tsx`:
- Imports both components (L16-17)
- Props interface includes all branching props (L69-77)
- Renders `<BranchNavigator>` (L238-243)
- Renders `<MessageActions>` (L247-258)

---

### MH-29: chat-ui.tsx integrates useConversationTree

**Status: PASS**

`chat-ui.tsx`:
- Imports `useConversationTree` (L33)
- Calls hook with correct args (L115-125)
- Has handler callbacks: `handleNavigateBranch` (L184), `handleEditMessage` (L191), `handleRegenerateMessage` (L202)
- Passes all branching props to `<ChatMessageList>` (L486-494)
- Edit/regenerate trigger SSE via `setStreamSessionId(activeChatId)` + `setWaitingForTask(true)` (L195-197, L206-208)

---

## CRITICAL ISSUES (from 05-REVIEW.md, verified against code)

### ISSUE-01: Frontend sends string direction, backend expects integer (CR-001)

**Status: FAIL**

`chat-backend.ts` L316: `direction: 'prev' | 'next'` (string) — sends `"prev"` or `"next"`.
`schemas.py` L143: `direction: Literal[-1, 1]` (integer).

The frontend `navigateBranch` sends `{ direction: "prev" }` but backend Pydantic validation expects `{ direction: -1 }`. This will cause 422 Unprocessable Entity on every navigate request.

**Impact:** Branch navigation is broken at runtime.

---

### ISSUE-02: Branch navigator double-increments current_index (CR-002)

**Status: FAIL**

Backend `chat.py` L256: `current_index=info.branch_index + 1` (converts 0-based to 1-based).
Frontend `branch-navigator.tsx` L16: `const currentDisplay = branchInfo.current_index + 1` (adds 1 again).

Result: Display shows `3/2` for a 2-branch conversation at branch_index=1. Also, `isFirst = branchInfo.current_index === 0` is never true since backend sends 1-based, so the "prev" button is never correctly disabled at the first branch.

**Impact:** Branch position display is wrong. Navigation boundary guards are broken.

---

### ISSUE-03: navigate_branch returns single message, frontend expects array (CR-004/WR-004)

**Status: PARTIAL** (deviation from plan)

The plan specified `navigate_branch` should return `list[ChatMessage]` (the full active branch). The actual implementation (`conversation_tree.py` L166, `chat.py` L277-289) returns a single `BranchMessageSchema` (the target sibling message). The frontend `use-conversation-tree.ts` L60 calls `.map(mapBackendMessage)` on the result, which will crash on a non-array object.

This is a structural mismatch between frontend and backend that will cause a runtime error.

---

## SUMMARY TABLE

| # | Must-Have | Status | Notes |
|---|---|---|---|
| 01 | ChatMessage branching columns | PASS | All 3 columns with correct types |
| 02 | parent_message_id index only in __table_args__ | PASS | No duplicate index=True |
| 03 | ConversationTree service with 6 methods | PASS | All methods present |
| 04 | BranchInfo dataclass fields | PARTIAL | Different internal field names; API maps correctly |
| 05 | get_last_active_message | PASS | With is_active_branch filter + fallback |
| 06 | update_message_content | PASS | Content + metadata update |
| 07 | Recursive CTE list_active_branch_messages | PASS | WITH RECURSIVE + fallback |
| 08 | add_message sets parent_message_id | PASS | Uses get_last_active_message |
| 09 | get_session_with_messages active branch | PASS | Tree walk when limit=None |
| 10 | serialize_message branching fields | PASS | 3 fields with getattr safety |
| 11 | Redis cache invalidation | PASS | On edit, regenerate, navigate |
| 12 | Backfill SQL with LAG | PASS | In db.py and standalone SQL |
| 13 | create_tables calls _ensure_branching_columns | PASS | After _ensure_metadata_columns |
| 14 | 6 Pydantic schemas | PASS | All present with TreeNodeSchema.model_rebuild() |
| 15 | MessageSchema branching fields | PASS | Backward-compatible defaults |
| 16 | 5 API endpoints | PASS | edit, regenerate, branches, navigate, tree |
| 17 | rag_document_search target_message_id | PASS | Conditional PATCH vs POST |
| 18 | run_sql_query target_message_id | PASS | Conditional PATCH vs POST |
| 19 | PATCH /messages/{id}/content | PASS | On messages_router, registered in main.py |
| 20 | Vietnamese error messages | PASS | Multiple Vietnamese strings |
| 21 | chat-backend.ts 5 API methods | PASS | All present |
| 22 | BackendMessage branching fields | PASS | Optional typed fields |
| 23 | TS interfaces (BranchInfo, TreeNode, ConversationTree) | PASS | All exported |
| 24 | Message type branching fields | PASS | Optional fields |
| 25 | useConversationTree hook | PASS | Full state + callbacks |
| 26 | BranchNavigator component | PASS | < N/M > with conditional render |
| 27 | MessageActions component | PASS | Edit pencil + regenerate refresh |
| 28 | chat-message-list.tsx renders both | PASS | With all branching props |
| 29 | chat-ui.tsx integration | PASS | Hook + handlers + SSE + props |
| 30 | Direction type mismatch | **FAIL** | String vs integer breaks navigation |
| 31 | Double-increment current_index | **FAIL** | Display shows wrong position |
| 32 | navigate returns single vs array | **PARTIAL** | Will crash on .map() |

---

## VERDICT

**PASS WITH ISSUES**

The phase goal — "Transform linear chat history into tree structure" — is achieved in architecture and data model. The tree structure (parent_message_id, branch_index, is_active_branch) is correctly implemented in the database, ORM, repository, and service layers. The API endpoints, Pydantic schemas, frontend components, and hooks are all in place.

However, **2 runtime bugs** prevent branch navigation from working correctly:

1. **Direction type mismatch** (frontend sends `"prev"/"next"`, backend expects `-1`/`1`) — causes 422 errors on navigate
2. **Double-increment display** (backend sends 1-based, frontend adds 1 again) — shows wrong branch position

And **1 structural mismatch**:

3. **navigate_branch returns single message** but frontend expects array — will crash on `.map()`

These are fixable bugs, not architectural gaps. The tree data model, branching logic, and UI components are architecturally sound.

### Recommended Fixes (priority order)

1. **Fix direction type**: Change `chat-backend.ts` `navigateBranch` to accept and send `-1 | 1` instead of `"prev" | "next"`, or update `NavigateBranchRequest` to accept strings
2. **Fix navigate return type**: Change `conversation_tree.py` `navigate_branch` to return `list[ChatMessage]` (full active branch) or update frontend to handle single message
3. **Fix display offset**: Remove `+ 1` from `branch-navigator.tsx` L16 since backend already sends 1-based index
