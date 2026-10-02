// Minimal stdio MCP server — zero npm deps. Newline-delimited JSON-RPC 2.0.
// Enough of the protocol for initialize / tools/list / tools/call. Used by
// the five mock servers in this dir so the demo zip works on a fresh unzip
// without `npm install @modelcontextprotocol/sdk`.

import readline from 'node:readline';

export function serve({ name, version = '0.1.0', tools }) {
  const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
  const ok   = (id, result) => send({ jsonrpc: '2.0', id, result });
  const err  = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

  const toolList = tools.map(({ name, description, inputSchema }) =>
    ({ name, description, inputSchema }));

  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (line) => {
    if (!line.trim()) return;
    let req; try { req = JSON.parse(line); } catch { return; }
    const { id, method, params } = req;

    if (method === 'initialize') {
      return ok(id, {
        protocolVersion: params?.protocolVersion ?? '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name, version },
      });
    }
    if (method === 'tools/list')  return ok(id, { tools: toolList });
    if (method === 'tools/call') {
      const t = tools.find((t) => t.name === params?.name);
      if (!t) return err(id, -32601, `Unknown tool: ${params?.name}`);
      try {
        const out = t.handler(params?.arguments ?? {});
        const text = typeof out === 'string' ? out : JSON.stringify(out, null, 2);
        return ok(id, { content: [{ type: 'text', text }] });
      } catch (e) {
        return ok(id, { content: [{ type: 'text', text: String(e?.message ?? e) }], isError: true });
      }
    }
    if (id === undefined) return;            // notification (e.g. initialized) — no reply
    return err(id, -32601, `Method not found: ${method}`);
  });

  process.stderr.write(`[${name}] mock MCP server on stdio\n`);
}
