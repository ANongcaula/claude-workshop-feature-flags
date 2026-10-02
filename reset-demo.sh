#!/usr/bin/env bash
# Reset to pre-workshop state. Safe to run between sessions.

set -euo pipefail
cd "$(dirname "$0")"

echo "→ Restoring buggy evaluate.js (re-plants the % 101 bug)"
cp .reset-snapshots/evaluate.js lib/evaluate.js

echo "→ Restoring sparse CLAUDE.md (TODOs only)"
cp .reset-snapshots/CLAUDE.md CLAUDE.md

echo "→ Clearing attendee-created skills"
rm -rf .claude/skills
mkdir -p .claude/skills
touch .claude/skills/.gitkeep

echo "→ Removing plugin packaging (Exercise 4)"
rm -rf flag-toolkit/

echo "→ Removing MCP registration (if any)"
claude mcp remove flag-store 2>/dev/null || true

echo "✓ Reset complete. Run: npm test  (expect: 1 failing — '100% rollout includes all users')"
