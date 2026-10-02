#!/usr/bin/env bash
# stdio MCP servers are spawned per-session by Claude Code itself.
# If a server shows disconnected, run `/mcp` in the session to reconnect.
# This script just validates each server responds to tools/list.
set -e
cd "$(dirname "$0")"
for s in pagerduty servicenow confluence jira slack; do
  printf '{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n' \
    | node "$s/server.js" >/dev/null 2>&1 \
    && echo "ok: fs-$s" || echo "FAIL: fs-$s"
done
