# Phase 5: Conversation Branching - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning
**Source:** PRD Express Path (docs/superpowers/specs/2026-04-13-smart2brain-techniques-design.md)

<domain>
## Phase Boundary

Transform ChatSNP's linear chat history into a tree structure supporting:
- **Edit messages** — fork conversation at any user message with new content
- **Regenerate responses** — create alternative AI responses at same branch point
- **Branch navigation** — switch between conversation branches (1/3, 2/3, etc.)
- **Tree visualization** — see full conversation tree structure

Port from Smart2Brain's `chatStore.svelte.ts` checkpoint graph model and `BranchNavigator.svelte`.

**Out of scope:** Collaborative editing, real-time multi-user branching, undo/redo beyond branch navigation.

</domain>

<decisions>
## Implementation Decisions

### DB Schema
- Add `parent_message_id` (UUID FK→chat_messages.id, SET NULL, nullable, indexed) to ChatMessage
- Add `branch_index` (int, default=0) to ChatMessage
- Add `is_active_branch` (bool, default=True) to ChatMessage
- No Alembic migrations — project uses SQLAlchemy `create_all()` pattern (no alembic dir exists)
- Backfill existing messages with linear parent links via SQL: `UPDATE chat_messages SET parent_message_id = LAG(id) OVER (PARTITION BY session_id ORDER BY created_at)`

### Backend Service — ConversationTree
- New file: `backend/src/services/conversation_tree.py`
- Dataclass `BranchInfo`: current_index (1-based), total_branches, sibling_ids (list[str]), fork_point_id (str)
- Class `ConversationTree(session: AsyncSession)`
- Methods: get_active_branch, get_branch_info, edit_message, regenerate, navigate_branch, get_full_tree
- Tree walk uses recursive CTE for active branch retrieval
- Edit creates new sibling message at same parent + new AI response branch
- Regenerate creates new AI response at same parent as current AI response
- Navigate switches is_active_branch flags among siblings

### API Endpoints
- `POST /sessions/{id}/messages/{msg_id}/edit` — body: {content: str} → fork user message
- `POST /sessions/{id}/messages/{msg_id}/regenerate` — fork AI response
- `GET /sessions/{id}/messages/{msg_id}/branches` — get BranchInfo
- `POST /sessions/{id}/messages/{msg_id}/navigate` — body: {direction: -1|+1}
- `GET /sessions/{id}/tree` — full conversation tree

### Frontend Components
- `BranchNavigator.tsx` — shows "< 2/3 >" controls, ported from S2B BranchNavigator.svelte
- `MessageActions.tsx` — edit (pencil icon) + regenerate (refresh icon) per message
- `useConversationTree.ts` — hook for tree state, branch navigation API calls
- Modify `chat-message-list.tsx` — add BranchNavigator + MessageActions to each message bubble
- Modify `chat-ui.tsx` — use tree-based message loading (active branch) instead of flat list

### Claude's Discretion
- Recursive CTE query implementation details
- Redis cache invalidation strategy for branching (must invalidate on branch switch)
- SSE notification format for branch events
- Error handling patterns for concurrent branch operations
- Frontend animation/transition on branch switch

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend Models & Services
- `chatSNP170226/backend/src/models/models.py` — ChatMessage model (lines 37-56), add parent_message_id/branch_index/is_active_branch
- `chatSNP170226/backend/src/services/chat_service.py` — get_session_with_messages() (L51-62), add_message() (L64-139), serialize_message() (L219-227)
- `chatSNP170226/backend/src/repositories/messages.py` — Message repository (CRUD for messages)

### API Routes
- `chatSNP170226/backend/src/api/chat.py` — Existing endpoints, add branching routes
- `chatSNP170226/backend/src/schemas/schemas.py` — Pydantic schemas for request/response

### Frontend
- `chatSNP170226/frontend/src/components/chat/chat-message-list.tsx` — Message rendering (modify for branch UI)
- `chatSNP170226/frontend/src/components/chat/chat-ui.tsx` — Main chat orchestrator
- `chatSNP170226/frontend/src/components/chat/types.ts` — Message type definition
- `chatSNP170226/frontend/src/hooks/use-chat-messages.ts` — Message loading hook
- `chatSNP170226/frontend/src/services/chat-backend.ts` — API client

### Source Reference
- `docs/superpowers/specs/2026-04-13-smart2brain-techniques-design.md` — Full spec (Phase 5 section)

</canonical_refs>

<specifics>
## Specific Ideas

### Smart2Brain Port References
- `CheckpointNode` model from `chatStore.svelte.ts` → `BranchInfo` dataclass
- `editMessage()` → `ConversationTree.edit_message()` — creates new sibling at parent
- `regenerate()` → `ConversationTree.regenerate()` — creates new AI sibling
- `BranchNavigator.svelte` → `BranchNavigator.tsx` — "< 2/3 >" UI pattern

### Key Constraints
- No Alembic — schema changes via SQLAlchemy create_all() + manual backfill SQL script
- Redis cache at `chat:session:{session_id}` must be invalidated on branch operations
- Frontend Message type uses `id: number` (timestamp-based) + `backendId?: string` (UUID)
- SSE via Redis Pub/Sub channel `session:{session_id}` — branch events should use same channel

</specifics>

<deferred>
## Deferred Ideas

- ConversationTree.tsx (full SVG tree visualization) — complex frontend, defer to follow-up
- Branch merge capability (merge two branches)
- Branch naming/labeling
- Branch diff view (compare two branches side by side)

</deferred>

---

*Phase: 05-conversation-branching*
*Context gathered: 2026-04-13 via PRD Express Path*
