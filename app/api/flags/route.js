import { FLAGS } from '../../../lib/flags.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const env = searchParams.get('env');

  const flags = env ? FLAGS.filter((f) => f.env === env) : FLAGS;

  return Response.json({ flags, count: flags.length });
}
