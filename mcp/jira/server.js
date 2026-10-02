#!/usr/bin/env node
// Mock Jira MCP server — create_issue + get_issue for ROLLOUT-412.
// Zero npm deps; speaks stdio JSON-RPC via ../_stdio.js.

import { serve } from '../_stdio.js';

let seq = 412;
const ISSUES = {
  'ROLLOUT-412': {
    key: 'ROLLOUT-412',
    url: 'https://jira.example.com/browse/ROLLOUT-412',
    status: 'Open',
    summary: 'checkout-v2 error-rate spike — revert to last-safe %',
    description: 'Error rate 4.1% vs 0.8% baseline at 50% rollout. Owner: Web Platform (r.chen@example.com). Ref INC-5501.',
  },
};

serve({
  name: 'fs-jira',
  tools: [
    {
      name: 'create_issue',
      description: 'Create a Jira issue. Returns the new issue key + URL.',
      inputSchema: {
        type: 'object',
        properties: {
          project:     { type: 'string', description: 'e.g. ROLLOUT' },
          summary:     { type: 'string' },
          description: { type: 'string' },
        },
        required: ['project', 'summary'],
      },
      handler: ({ project, summary, description }) => {
        const key = `${project || 'ROLLOUT'}-${seq++}`;
        const issue = {
          key,
          url: `https://jira.example.com/browse/${key}`,
          status: 'Open',
          summary,
          description: description ?? '',
        };
        ISSUES[key] = issue;
        return issue;
      },
    },
    {
      name: 'get_issue',
      description: 'Fetch a Jira issue by key (e.g. ROLLOUT-412)',
      inputSchema: {
        type: 'object',
        properties: { key: { type: 'string' } },
        required: ['key'],
      },
      handler: ({ key }) =>
        ISSUES[key] ?? { error: `Issue ${key} not found`, available: Object.keys(ISSUES) },
    },
  ],
});
