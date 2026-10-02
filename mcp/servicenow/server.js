#!/usr/bin/env node
// Mock ServiceNow MCP server — incident record + CI owner for the spiking flag.
// Zero npm deps; speaks stdio JSON-RPC via ../_stdio.js.

import { serve } from '../_stdio.js';

const RECORDS = {
  'INC-5501': {
    record: 'INC-5501',
    sev: 'sev2',
    assigned: 'platform-eng',
    ci: 'checkout-v2',
    owner: 'Web Platform',
    contact: 'r.chen@example.com',
  },
  'checkout-v2': {
    record: 'INC-5501',
    sev: 'sev2',
    assigned: 'platform-eng',
    ci: 'checkout-v2',
    owner: 'Web Platform',
    contact: 'r.chen@example.com',
  },
};

serve({
  name: 'fs-servicenow',
  tools: [
    {
      name: 'get_record',
      description: 'Fetch a ServiceNow record (incident or CI) by name/ID. Returns sev, assignment group, CI, and owner contact.',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Incident ID (INC-5501) or CI name (checkout-v2)' } },
        required: ['name'],
      },
      handler: ({ name }) =>
        RECORDS[name] ?? RECORDS['INC-5501'],
    },
  ],
});
