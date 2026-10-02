import { test } from 'node:test';
import assert from 'node:assert';
import { isUserInRollout, evaluate } from '../lib/evaluate.js';

test('0% rollout excludes all users', () => {
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(isUserInRollout(`user-${i}`, 0), false);
  }
});

test('100% rollout includes all users', () => {
  // 100% means everyone. No exceptions. If a single user is excluded at 100%,
  // that's a correctness bug — a "fully shipped" feature would have gaps.
  for (let i = 0; i < 100; i++) {
    assert.strictEqual(
      isUserInRollout(`user-${i}`, 100),
      true,
      `user-${i} was excluded at 100% rollout`
    );
  }
});

test('same user gets same result (deterministic)', () => {
  const a = isUserInRollout('alice@example.com', 50);
  const b = isUserInRollout('alice@example.com', 50);
  assert.strictEqual(a, b);
});

test('disabled flag always returns false', () => {
  const flag = { enabled: false, rolloutPercent: 100 };
  assert.strictEqual(evaluate(flag, 'anyone'), false);
});
