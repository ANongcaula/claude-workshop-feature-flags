#!/usr/bin/env node
// Mock PagerDuty MCP server — seeded INC-5501 checkout-v2 rollout error spike.
// Zero npm deps; speaks stdio JSON-RPC via ../_stdio.js.

import { serve } from '../_stdio.js';

const INCIDENTS = {
  'INC-5501': {
    id: 'INC-5501',
    title: 'Error rate spike on checkout-v2 rollout',
    severity: 'sev2',
    status: 'triggered',
    created_at: '2026-05-20T08:41:00Z',
    service: 'flag-service',
    details: 'checkout-v2 at 50% rollout — error rate 4.1% vs 0.8% baseline',
  },
};

serve({
  name: 'fs-pagerduty',
  tools: [
    {
      name: 'get_incident',
      description: 'Fetch a PagerDuty incident by ID (e.g. INC-5501)',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
      handler: ({ id }) => {
        const inc = INCIDENTS[id] ?? INCIDENTS['INC-5501'];
        const rule = '─'.repeat(54);
        return (
          `[PagerDuty ${inc.id}] ${inc.title}\n${rule}\n` +
          `Severity:  ${inc.severity}    Status: ${inc.status}\n` +
          `Service:   ${inc.service}\n` +
          `Created:   ${inc.created_at}\n${rule}\n${inc.details}\n\n` +
          JSON.stringify(inc, null, 2)
        );
      },
    },
  ],
});
