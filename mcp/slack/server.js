#!/usr/bin/env node
// Mock Slack MCP server — post_message returns a canned permalink.
// Zero npm deps; speaks stdio JSON-RPC via ../_stdio.js.

import { serve } from '../_stdio.js';

serve({
  name: 'fs-slack',
  tools: [
    {
      name: 'post_message',
      description: 'Post a message to a Slack channel',
      inputSchema: {
        type: 'object',
        properties: {
          channel: { type: 'string', description: 'e.g. #flag-ops' },
          text:    { type: 'string' },
        },
        required: ['channel', 'text'],
      },
      handler: ({ channel, text }) => {
        const ts = '1747728060.001';
        const rule = '─'.repeat(54);
        return (
          `✓ Posted to ${channel}\n${rule}\n${text}\n${rule}\n` +
          JSON.stringify(
            { ok: true, ts, channel,
              permalink: 'https://example.slack.com/archives/C-FLAGOPS/p1747728060' },
            null, 2,
          )
        );
      },
    },
  ],
});
