/* #48: screensaver wake accepts a list of binary_sensors (legacy single sensor is migrated). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../../src/parts/hg-wall.part.js', import.meta.url), 'utf8');
const cut = (a, b) => { const i = src.indexOf(a); return src.slice(i, src.indexOf(b, i) + b.length).trim().replace(/,$/, ''); };
const getB = cut('  get(', '}; },');
const motB = cut('  motion(h) {', 'this.wake(\'motion\'); },');
const make = (w, on = true) => new Function('window', `return { active: true, locked: false, _ms: undefined, SRCS: [['bg']], LOCKS: [0], woke: 0, wake() { this.woke++; }, ${getB}, run() { return this.get(); }, ntGet() { return { on: false, dim: 0.8, style: 'night' }; }, ntNight() { return false; }, ${motB} };`)({ __hgL: { data: { wall: Object.assign({ on }, w) } } });
const H = (o) => ({ states: Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { state: v }])) });
test('legacy sensor migrates to sensors, invalid ids dropped, deduped', () => {
  assert.deepEqual(make({ sensor: 'binary_sensor.a' }).get().sensors, ['binary_sensor.a']);
  assert.deepEqual(make({ sensor: 'light.x' }).get().sensors, []);
  assert.deepEqual(make({ sensors: ['binary_sensor.a', 'binary_sensor.a', 'bad', 5, 'binary_sensor.b'], sensor: 'binary_sensor.z' }).get().sensors, ['binary_sensor.a', 'binary_sensor.b']);
});
test('motion wakes on any listed sensor rising, not on first read', () => {
  const W = make({ sensors: ['binary_sensor.a', 'binary_sensor.b'] });
  W.motion(H({ 'binary_sensor.a': 'off', 'binary_sensor.b': 'on' })); assert.equal(W.woke, 0);
  W.motion(H({ 'binary_sensor.a': 'off', 'binary_sensor.b': 'on' })); assert.equal(W.woke, 0);
  W.motion(H({ 'binary_sensor.a': 'off', 'binary_sensor.b': 'off' })); W.motion(H({ 'binary_sensor.a': 'off', 'binary_sensor.b': 'on' })); assert.equal(W.woke, 1);
  W.motion(H({ 'binary_sensor.a': 'on', 'binary_sensor.b': 'on' })); assert.equal(W.woke, 2);
});
test('no wake when disabled', () => {
  const W = make({ sensors: ['binary_sensor.a'] }, false);
  W.motion(H({ 'binary_sensor.a': 'off' })); W.motion(H({ 'binary_sensor.a': 'on' })); assert.equal(W.woke, 0); assert.equal(W._ms, undefined);
});
