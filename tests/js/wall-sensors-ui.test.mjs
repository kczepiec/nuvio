/* #48: the settings picker for the wake sensors adds and removes entries in the sensors list (no duplicates, others untouched). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../../src/parts/hg-wallboard.part.js', import.meta.url), 'utf8');
const i = src.indexOf('  pkOp(id, op, k) {'), j = src.indexOf('\n  bdHtml(', i);
const pkOp = new Function('return function ' + src.slice(i, j).trim().replace(/,$/, '').replace(/^pkOp/, '') + ';')();
const make = (sensors, ms) => {
  const W = { saved: [], _ms: ms, _sens: sensors,
    bget: () => ({ bk: {}, ord: [], calX: [], roomX: [], wxE: '' }),
    get: () => ({ sensors: W._sens }),
    set(p) { W.saved.push(p); if (p.sensors) W._sens = p.sensors; } };
  return W;
};

test('add appends a sensor and clears the motion state', () => {
  const W = make(['binary_sensor.a'], 'on');
  assert.equal(pkOp.call(W, 'sens', 'add', 'binary_sensor.b'), true);
  assert.deepEqual(W.saved.at(-1), { sensors: ['binary_sensor.a', 'binary_sensor.b'] });
  assert.equal(W._ms, undefined);
});
test('adding an existing sensor does not duplicate it', () => {
  const W = make(['binary_sensor.a'], undefined);
  pkOp.call(W, 'sens', 'add', 'binary_sensor.a');
  assert.deepEqual(W.saved.at(-1), { sensors: ['binary_sensor.a'] });
});
test('remove drops only the chosen sensor', () => {
  const W = make(['binary_sensor.a', 'binary_sensor.b'], undefined);
  pkOp.call(W, 'sens', 'rm', 'binary_sensor.a');
  assert.deepEqual(W.saved.at(-1), { sensors: ['binary_sensor.b'] });
});
test('removing the last sensor leaves an empty list (touch-only)', () => {
  const W = make(['binary_sensor.a'], undefined);
  pkOp.call(W, 'sens', 'rm', 'binary_sensor.a');
  assert.deepEqual(W.saved.at(-1), { sensors: [] });
});
