# Plan 05-03 Execution Summary: Frontend Branching UI Components

## Status: COMPLETED

## Commits (8 atomic commits in chatSNP170226 repo)

| # | Commit | Description |
|---|--------|-------------|
| 1 | `feat(05-03): add branching API methods to chat-backend` | Updated `BackendMessage` with branching fields, added `BranchInfo`/`TreeNode`/`ConversationTree` interfaces, added 5 API methods (editMessage, regenerateMessage, getBranchInfo, navigateBranch, getConversationTree) |
| 2 | `feat(05-03): add branching fields to Message type` | Added `parentMessageId`, `branchIndex`, `isActiveBranch` to `Message` interface |
| 3 | `feat(05-03): map branching fields in useChatMessages` | Updated `mapBackendMessage` to pass through branching fields in both code paths (attachment and normal) |
| 4 | `feat(05-03): create useConversationTree hook` | New hook managing branch state, navigation, edit, regenerate, with API integration |
| 5 | `feat(05-03): create BranchNavigator component` | Small `< 2/3 >` navigation widget using shadcn Button + lucide ChevronLeft/ChevronRight |
| 6 | `feat(05-03): create MessageActions component` | Edit (Pencil) for user messages, Regenerate (RefreshCw) for bot messages, inline Textarea editing mode |
| 7 | `feat(05-03): integrate branching UI into chat-message-list` | Wired BranchNavigator + MessageActions into message rendering with hover-reveal and group class |
| 8 | `feat(05-03): integrate useConversationTree into chat-ui` | Connected useConversationTree hook, added branch info fetch on session change, SSE integration for edit/regenerate |

## Files Changed

### Modified
- `frontend/src/services/chat-backend.ts` — Added 3 interfaces + 5 API methods + branching fields on BackendMessage
- `frontend/src/components/chat/types.ts` — 3 new optional fields on Message interface
- `frontend/src/hooks/use-chat-messages.ts` — Map branching fields in both return branches of mapBackendMessage
- `frontend/src/components/chat/chat-message-list.tsx` — Expanded props, integrated BranchNavigator + MessageActions
- `frontend/src/components/chat-ui.tsx` — Wired useConversationTree, added handlers, passed props to ChatMessageList

### Created
- `frontend/src/hooks/use-conversation-tree.ts` — React hook for branch state management
- `frontend/src/components/chat/branch-navigator.tsx` — Branch navigation UI component
- `frontend/src/components/chat/message-actions.tsx` — Edit/Regenerate action buttons

## API Endpoints Connected
- `POST /sessions/{id}/messages/{id}/edit` — Edit a user message (creates new branch)
- `POST /sessions/{id}/messages/{id}/regenerate` — Regenerate an assistant response
- `GET /sessions/{id}/messages/{id}/branches` — Get branch info for a message
- `POST /sessions/{id}/messages/{id}/navigate` — Navigate between sibling branches
- `GET /sessions/{id}/tree` — Get full conversation tree

## Design Decisions
- BranchNavigator only renders when `total_branches > 1` (no UI clutter for linear conversations)
- MessageActions uses hover-reveal (`opacity-0 group-hover:opacity-100`) for clean UX
- Edit/Regenerate trigger SSE flow (`setStreamSessionId` + `setWaitingForTask`) for async response handling
- Vietnamese labels used throughout: "Gui", "Huy", "Nhanh truoc", "Nhanh sau", "Chinh sua tin nhan", "Tao lai phan hoi"
- `fetchAllBranchInfo` only stores entries where `total_branches > 1` to minimize state

## Dependencies
- Requires backend branching endpoints from Plan 05-02
- Uses existing shadcn/ui Button, Textarea components
- Uses existing lucide-react icons
