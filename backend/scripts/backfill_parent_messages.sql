-- ============================================================
-- Backfill: conversation branching columns for chat_messages
-- Idempotent — safe to run multiple times.
-- ============================================================

BEGIN;

-- 1. Add columns (IF NOT EXISTS keeps this idempotent)
ALTER TABLE chat_messages
    ADD COLUMN IF NOT EXISTS parent_message_id UUID
        REFERENCES chat_messages(id) ON DELETE SET NULL;

ALTER TABLE chat_messages
    ADD COLUMN IF NOT EXISTS branch_index INTEGER NOT NULL DEFAULT 0;

ALTER TABLE chat_messages
    ADD COLUMN IF NOT EXISTS is_active_branch BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Create index for parent lookups
CREATE INDEX IF NOT EXISTS ix_chat_messages_parent
    ON chat_messages (parent_message_id);

-- 3. Backfill parent_message_id using LAG window function
--    Links each message to the previous message in the same session
--    Only updates rows where parent_message_id is still NULL
UPDATE chat_messages AS cm
SET parent_message_id = sub.prev_id
FROM (
    SELECT id,
           LAG(id) OVER (PARTITION BY session_id ORDER BY created_at) AS prev_id
    FROM chat_messages
) AS sub
WHERE cm.id = sub.id
  AND cm.parent_message_id IS NULL
  AND sub.prev_id IS NOT NULL;

-- 4. Ensure defaults are set for any rows that might have NULLs
UPDATE chat_messages SET branch_index = 0 WHERE branch_index IS NULL;
UPDATE chat_messages SET is_active_branch = TRUE WHERE is_active_branch IS NULL;

COMMIT;
