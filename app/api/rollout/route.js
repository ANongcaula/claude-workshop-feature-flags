import { FLAGS } from '../../../lib/flags.js';

// In-memory only. Restarting the server resets everything.
// A real flag service would persist to a DB and emit an audit event.

export async function POST(request) {
  const body = await request.json();
  const { key, percent, env = 'prod' } = body;

  if (typeof percent !== 'number' || percent < 0 || percent > 100) {
    return Response.json({ error: 'percent must be a number between 0 and 100' }, { status: 400 });
  }

  const flag = FLAGS.find((f) => f.key === key && f.env === env);
  if (!flag) {
    return Response.json({ error: `flag '${key}' not found in ${env}` }, { status: 404 });
  }

  const previous = flag.rolloutPercent;
  flag.rolloutPercent = percent;

  return Response.json({
    flag,
    change: { from: previous, to: percent },
  });
}
