# flag-service

> Reference version for presenters. Attendees' answers will differ — that's fine.
> This is one reasonable way to fill in the TODOs from Exercise 2.

## Running tests
`npm test` runs the full suite via `node --test`. No build step, no install
required — tests import `lib/` directly. Four tests covering the rollout
bucketing logic in `lib/evaluate.js`.

## Flag structure
Flags live in `lib/flags.js` as a static array. Each flag has:
- `key` — the identifier (same key can exist in multiple envs)
- `env` — one of `dev`, `staging`, `prod`
- `enabled` — master kill-switch; when false, `rolloutPercent` is ignored
- `rolloutPercent` — 0–100, what fraction of users see this flag
- `description` — human-readable, shows up in the admin UI
- `owner` — team slug

Evaluation lives in `lib/evaluate.js`. Given a flag + a userId, it hashes
the userId into a 0–99 bucket and compares against `rolloutPercent`.
Deterministic — same user always gets the same answer.

## Never
- Never bump a prod flag's `rolloutPercent` without running `npm test` first.
- Never raise a prod flag above its staging percentage — prove it in staging first.
- Never edit `lib/flags.js` directly in a demo; use the `/api/rollout` endpoint
  or the `/rollout` skill so the change is visible.
