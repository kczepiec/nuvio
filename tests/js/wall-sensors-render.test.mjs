/* #48: real hg-wall.part.js loaded through the harness. Checks legacy migration end to end and the picker markup for the wake sensors. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

const H = { esc: (s) => String(s), pct: (v) => v + '%', icon: () => '', name: (h, e, d) => (h.states[e] && h.states[e].attributes && h.states[e].attributes.friendly_name) || d };
const load = (wall) => {
  const globals = {
    window: { __hgL: { data: { wall } }, innerWidth: 800, innerHeight: 600, matchMedia: () => ({ matches: false }) },
    H, hgT: (k) => k, hgTLazy: (k) => k, HGApp: { get: () => ({}) }, HG_LOC: () => 'en',
    HGL: { data: { wall }, _ls() {}, save: async () => {} },
    document: { hidden: false, addEventListener() {} }, navigator: {}, Date, setTimeout, clearTimeout, setInterval, clearInterval,
  };
  return loadParts(['hg-wall.part.js'], globals, ['HGWall']).HGWall;
};

test('get(): legacy single sensor is read as a one-item list', () => {
  const W = load({ on: true, sensor: 'binary_sensor.hall' });
  assert.deepEqual(W.get().sensors, ['binary_sensor.hall']);
});
test('get(): no sensor configured gives an empty list', () => {
  assert.deepEqual(load({ on: true }).get().sensors, []);
});
test('get(): list wins over legacy key and is cleaned up', () => {
  const W = load({ on: true, sensor: 'binary_sensor.old', sensors: ['binary_sensor.a', 'light.x', 'binary_sensor.a', 'binary_sensor.b'] });
  assert.deepEqual(W.get().sensors, ['binary_sensor.a', 'binary_sensor.b']);
});

const hass = { states: { 'binary_sensor.hall': { state: 'off', attributes: { friendly_name: 'Hall PIR' } }, 'binary_sensor.desk': { state: 'off', attributes: {} } }, user: { is_admin: true } };
const renderMotion = (wall) => {
  const W = load(wall);
  Object.assign(W, { admin: () => true, sensors: () => [['binary_sensor.hall', 'Hall PIR'], ['binary_sensor.desk', 'binary_sensor.desk']], homeHtml: () => '', kidHtml: () => '', xs: () => '', glass: () => false, bdHtml: () => ({ top: '', board: '' }), xsPic: () => true, ckHtml: null, pk: (id, sel, opt, o) => JSON.stringify({ id, sel, opt, add: o.add }) });
  return W.html({ _hass: hass });
};
test('picker: sensors list is passed to the picker with the add action', () => {
  const out = renderMotion({ on: true, sensors: ['binary_sensor.hall'] });
  assert.match(out, /"id":"sens"/);
  assert.match(out, /"sel":\[\{"k":"binary_sensor\.hall","l":"Hall PIR"/);
  assert.match(out, /"opt":\[\{"k":"binary_sensor\.desk"/);
  assert.doesNotMatch(out, /"opt":\[\{"k":"binary_sensor\.hall"/, 'selected sensor is not offered again');
  assert.match(out, /"add":"common\.add"/);
});
test('picker: no sensors shows the touch-only row and choose label', () => {
  const out = renderMotion({ on: true, sensors: [] });
  assert.match(out, /"k":"","l":"wall\.none_touch_only"/);
  assert.match(out, /"add":"wall\.choose_sensor"/);
});
