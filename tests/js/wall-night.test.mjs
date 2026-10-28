/* Tests for the night schedule (#46): ntGet, ntNight, styleNow, effective dim */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

const hgT = (k) => k, hgTLazy = (k) => k;
const noop = () => '';
function load(wall, extra = {}) {
  const win = { __hgL: { data: { wall } } };
  const g = { window: win, hgT, hgTLazy, H: { esc: String, pct: String, icon: noop, fmt: String }, HG_ASSET: '/', HG_LOC: () => 'en', HGL: {}, ...extra };
  const { HGWall } = loadParts(['hg-wall.part.js', 'hg-wallboard.part.js', 'hg-wallglass.part.js', 'hg-wallx.part.js'], g, ['HGWall']);
  return { W: HGWall, win };
}
const at = (h, m) => new Date(2026, 0, 5, h, m);
const sun = (state) => ({ states: { 'sun.sun': { state } } });

test('ntGet defaults and validation', () => {
  const { W } = load({});
  assert.deepEqual(W.ntGet(), { on: false, mode: 'sun', from: '22:00', to: '06:00', style: 'night', dim: 0.8 });
  const { W: V } = load({ nt: { on: 'yes', mode: 'x', from: '25:00', to: 'abc', style: 'nope', dim: 5 } });
  assert.deepEqual(V.ntGet(), { on: false, mode: 'sun', from: '22:00', to: '06:00', style: 'night', dim: 0.9 });
  const { W: G } = load({ nt: { on: true, mode: 'hours', from: '23:30', to: '05:15', style: 'flip', dim: -1 } });
  assert.deepEqual(G.ntGet(), { on: true, mode: 'hours', from: '23:30', to: '05:15', style: 'flip', dim: 0 });
});

test('sun mode follows sun.sun', () => {
  const { W } = load({ nt: { on: true, mode: 'sun' } });
  assert.equal(W.ntNight(sun('below_horizon')), true);
  assert.equal(W.ntNight(sun('above_horizon')), false);
});

test('hours mode: plain range and range across midnight, boundaries', () => {
  const { W } = load({ nt: { on: true, mode: 'hours', from: '08:00', to: '10:00' } });
  assert.equal(W.ntNight({}, at(8, 0)), true); assert.equal(W.ntNight({}, at(9, 59)), true);
  assert.equal(W.ntNight({}, at(10, 0)), false); assert.equal(W.ntNight({}, at(7, 59)), false);
  const { W: M } = load({ nt: { on: true, mode: 'hours', from: '22:00', to: '06:00' } });
  assert.equal(M.ntNight({}, at(22, 0)), true); assert.equal(M.ntNight({}, at(23, 59)), true); assert.equal(M.ntNight({}, at(0, 0)), true);
  assert.equal(M.ntNight({}, at(5, 59)), true); assert.equal(M.ntNight({}, at(6, 0)), false); assert.equal(M.ntNight({}, at(12, 0)), false);
  assert.equal(M.ntNight(sun('above_horizon'), at(23, 0)), true, 'hours mode ignores the sun');
});

test('styleNow and effective dim', () => {
  const cfg = { style: 'glass', dim: 0.5, nt: { on: true, mode: 'sun', style: 'night', dim: 0.8 } };
  const { W } = load(cfg, { });
  W.hass = sun('below_horizon');
  assert.equal(W.styleNow(), 'night'); assert.equal(W.styleNow(true), 'glass');
  assert.equal(W.xs(), 'night'); assert.equal(W.glass(), false); assert.equal(W.glass(true), true);
  assert.equal(W.get().dim, 0.8); assert.equal(W.get(true).dim, 0.5);
  W.hass = sun('above_horizon');
  assert.equal(W.styleNow(), 'glass'); assert.equal(W.glass(), true); assert.equal(W.xs(), ''); assert.equal(W.get().dim, 0.5);
});

test('disabled schedule changes nothing', () => {
  const { W } = load({ style: 'analog', dim: 0.3, nt: { on: false, mode: 'hours', from: '00:00', to: '23:59', style: 'night', dim: 0.9 } });
  W.hass = sun('below_horizon');
  assert.equal(W.ntNight(), false); assert.equal(W.styleNow(), 'analog'); assert.equal(W.get().dim, 0.3); assert.equal(W.xs(), 'analog');
});
