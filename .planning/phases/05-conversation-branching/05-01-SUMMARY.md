# 05-01 Execution Summary: Data Model & Core Branching Logic

## Status: COMPLETED

## Commits (6/6)

| # | Commit | Description |
|---|--------|-------------|
| 1 | `45dd34c4` | feat(05-01): add branching columns to ChatMessage model |
| 2 | `bb7b8f9e` | feat(05-01): add branching column backfill to create_tables |
| 3 | `bd390693` | feat(05-01): create standalone backfill SQL script |
| 4 | `6d3769c9` | feat(05-01): add branching methods to MessageRepository |
| 5 | `7de04758` | feat(05-01): create ConversationTree service |
| 6 | `399f9d57` | feat(05-01): update ChatService for branching support |

## Changes Summary

### Task 1 — ChatMessage Model (`models.py`)
- Added 3 new columns: `parent_message_id` (UUID FK, self-referential), `branch_index` (int, default 0), `is_active_branch` (bool, default True)
- Added self-referential `parent_message` relationship with `remote_side=[id]`
- Updated `__table_args__` with `ix_chat_messages_parent` index
- Imported `Boolean`, `Integer` from SQLAlchemy

### Task 2 — Database Backfill (`db.py`)
- Added `_ensure_branching_columns(conn)` function with:
  - `ALTER TABLE ADD COLUMN IF NOT EXISTS` for all 3 columns
  - `CREATE INDEX IF NOT EXISTS ix_chat_messages_parent`
  - Backfill `UPDATE` using `LAG(id) OVER (PARTITION BY session_id ORDER BY created_at)`
- Called from `create_tables()` after `_ensure_metadata_columns()`

### Task 3 — Standalone SQL Script (`backend/scripts/backfill_parent_messages.sql`)
- Idempotent SQL wrapped in `BEGIN/COMMIT` transaction
- Same logic as Task 2 but runnable via `psql` independently
- Includes default-setting UPDATEs for safety

### Task 4 — MessageRepository (`repositories/messages.py`)
- Updated `create_message()` to accept `parent_message_id`, `branch_index`, `is_active_branch`
- Added 7 new methods:
  - `get_last_active_message()` — with fallback to latest message
  - `get_message_by_id()` — single message lookup
  - `get_siblings()` — messages sharing same parent
  - `get_root_messages()` — messages with no parent
  - `update_active_branch()` — bulk is_active update
  - `update_message_content()` — content + metadata update
  - `list_active_branch_messages()` — recursive CTE walk

### Task 5 — ConversationTree Service (`services/conversation_tree.py`)
- `BranchInfo` dataclass for branching metadata
- `ConversationTree` class with public API:
  - `get_active_branch()`, `get_branch_info()`, `edit_message()`, `regenerate()`, `navigate_branch()`, `get_full_tree()`
- Private helpers: `_collect_subtree_ids()`, `_activate_subtree()`, `_deactivate_subtree()`, `_invalidate_cache()`
- Vietnamese error messages throughout
- Redis cache invalidation on branch changes

### Task 6 — ChatService Updates (`services/chat_service.py`)
- `add_message()`: now calls `get_last_active_message()` to set `parent_message_id`
- `get_session_with_messages()`: uses `list_active_branch_messages()` when `limit is None`
- `serialize_message()`: includes `parent_message_id`, `branch_index`, `is_active_branch` via `getattr`

## Files Changed (6)
- `backend/src/models/models.py`
- `backend/src/core/db.py`
- `backend/scripts/backfill_parent_messages.sql` (new)
- `backend/src/repositories/messages.py`
- `backend/src/services/conversation_tree.py` (new)
- `backend/src/services/chat_service.py`

## Backward Compatibility
- All new columns have defaults — existing data continues to work
- Backfill runs on startup via `create_tables()` and as standalone SQL
- `serialize_message()` uses `getattr` with defaults for safety
- `list_active_branch_messages()` falls back to `list_messages()` if CTE returns empty
