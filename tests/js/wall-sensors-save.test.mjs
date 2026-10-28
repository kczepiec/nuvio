/* #48: after the list is saved, a stale legacy `sensor` key left in stored data must not bring the old sensor back. Uses the real hg-wall.part.js. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

const H = { esc: (s) => String(s), pct: (v) => v + '%', icon: () => '', name: (h, e, d) => d };
const load = (wall) => {
  const L = { data: { wall }, editing: false, _ls() {}, save: async () => {} };
  const globals = {
    window: { __hgL: L, innerWidth: 800, innerHeight: 600, matchMedia: () => ({ matches: false }) },
    H, hgT: (k) => k, hgTLazy: (k) => k, HGApp: { get: () => ({}) }, HG_LOC: () => 'en', HGL: L,
    document: { hidden: false, addEventListener() {} }, navigator: {}, Date, setTimeout, clearTimeout, setInterval, clearInterval,
  };
  const W = loadParts(['hg-wall.part.js'], globals, ['HGWall']).HGWall;
  W.sync = () => {}; W.hass = null;
  return { W, L };
};

test('save: emptying the list stays empty even with a legacy sensor key in stored data', () => {
  const { W, L } = load({ on: true, sensor: 'binary_sensor.old', sensors: ['binary_sensor.a'] });
  W.set({ sensors: [] });
  assert.equal(L.data.wall.sensor, 'binary_sensor.old', 'legacy key is still in storage');
  assert.deepEqual(W.get().sensors, [], 'but it is not read back');
});
test('save: adding a sensor to a legacy-only config keeps the migrated sensor', () => {
  const { W, L } = load({ on: true, sensor: 'binary_sensor.old' });
  W.set({ sensors: [...W.get().sensors, 'binary_sensor.b'] });
  assert.deepEqual(W.get().sensors, ['binary_sensor.old', 'binary_sensor.b']);
});
test('motion(): real part wakes once when any listed sensor rises', () => {
  const { W } = load({ on: true, sensors: ['binary_sensor.a', 'binary_sensor.b'] });
  let woke = []; W.active = true; W.locked = false; W.wake = (why) => woke.push(why);
  const h = (a, b) => ({ states: { 'binary_sensor.a': { state: a }, 'binary_sensor.b': { state: b } } });
  W.run = function () { return this.get(); };
  W.motion(h('off', 'off')); W.motion(h('off', 'on')); W.motion(h('off', 'on'));
  assert.deepEqual(woke, ['motion']);
});
