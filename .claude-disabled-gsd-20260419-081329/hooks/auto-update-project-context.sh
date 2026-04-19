#!/bin/bash
# auto-update-project-context.sh — PreToolUse hook for Bash
# Detects "git push" commands and reminds Claude to update PROJECT_CONTEXT.md first.
# Does NOT block the push — just injects a reminder so Claude runs the update agent.

INPUT=$(cat)

# Extract command from JSON
CMD=$(echo "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{process.stdout.write(JSON.parse(d).tool_input?.command||'')}catch{}})" 2>/dev/null)

# Only trigger on git push commands
if [[ "$CMD" =~ git[[:space:]]+push ]]; then
  # Check if PROJECT_CONTEXT.md was already updated in this session
  # by looking at its modification time vs last commit time
  CONTEXT_FILE="chatSNP170226/PROJECT_CONTEXT.md"

  if [ -f "$CONTEXT_FILE" ]; then
    # Get list of changed files (staged + unstaged) since last commit
    CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null; git diff --name-only --cached 2>/dev/null)

    # Check if any source files changed but PROJECT_CONTEXT.md was not updated
    HAS_SRC_CHANGES=$(echo "$CHANGED_FILES" | grep -E '\.(py|tsx?|json|ya?ml)$' | grep -v PROJECT_CONTEXT | head -1)
    CONTEXT_UPDATED=$(echo "$CHANGED_FILES" | grep PROJECT_CONTEXT.md | head -1)

    if [ -n "$HAS_SRC_CHANGES" ] && [ -z "$CONTEXT_UPDATED" ]; then
      echo "IMPORTANT: Source files have changed but PROJECT_CONTEXT.md has NOT been updated. Before pushing, you MUST dispatch an agent to review all recent changes (git diff, new files, modified APIs, new features) and update chatSNP170226/PROJECT_CONTEXT.md accordingly. After the update, stage and amend the commit, then push."
    fi
  fi
fi

exit 0
