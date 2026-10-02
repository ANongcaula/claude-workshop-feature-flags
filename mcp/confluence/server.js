#!/usr/bin/env node
// Mock Confluence MCP server — search returns the Rollout Error Spike Runbook.
// Zero npm deps; speaks stdio JSON-RPC via ../_stdio.js.

import { serve } from '../_stdio.js';

const RUNBOOK = {
  page_id: 'FLAGS-RB-02',
  title: 'Rollout Error Spike Runbook',
  body:
    '1. Confirm via flag-store metrics\n' +
    '2. Do NOT edit lib/flags.js percentages directly\n' +
    '3. Open ROLLOUT Jira to revert to last-safe %\n' +
    '4. Notify #flag-ops',
};

serve({
  name: 'fs-confluence',
  tools: [
    {
      name: 'search',
      description: 'Search Confluence for a runbook or policy page',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string', description: 'e.g. "rollout error spike runbook"' } },
        required: ['query'],
      },
      handler: ({ query }) => ({ query, ...RUNBOOK }),
    },
  ],
});
