/* #48: picker built from real hg-wall.part.js (sensors()) and real hg-wallboard.part.js (pk()); only unrelated sub-renderers are stubbed. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

const H = { esc: (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'), pct: (v) => v + '%', icon: () => '', name: (h, e, d) => (h.states[e] && h.states[e].attributes && h.states[e].attributes.friendly_name) || d };
const hass = { states: {
  'binary_sensor.hall': { state: 'off', attributes: { friendly_name: 'Hall PIR', device_class: 'motion' } },
  'binary_sensor.desk': { state: 'off', attributes: { friendly_name: 'Desk presence', device_class: 'occupancy' } },
  'binary_sensor.door': { state: 'off', attributes: { friendly_name: 'Door', device_class: 'door' } } }, user: { is_admin: true } };
const load = (wall) => {
  const L = { data: { wall }, editing: false, _ls() {}, save: async () => {} };
  const globals = {
    window: { __hgL: L, innerWidth: 800, innerHeight: 600, matchMedia: () => ({ matches: false }) },
    H, hgT: (k) => k, hgTLazy: (k) => k, HGApp: { get: () => ({}) }, HG_LOC: () => 'en', HGL: L,
    document: { hidden: false, addEventListener() {} }, navigator: {}, Date, setTimeout, clearTimeout, setInterval, clearInterval,
  };
  const W = loadParts(['hg-wall.part.js', 'hg-wallboard.part.js'], globals, ['HGWall']).HGWall;
  Object.assign(W, { homeHtml: () => '', kidHtml: () => '', xs: () => '', glass: () => false, xsPic: () => true, ckHtml: null, bdHtml: () => ({ top: '', board: '' }) });
  return W;
};

test('real sensors(): motion/occupancy listed first, others only if none exist', () => {
  const W = load({ on: true });
  assert.deepEqual(W.sensors(hass).map(([e]) => e), ['binary_sensor.desk', 'binary_sensor.hall']);
});
test('real picker: selected sensor rows, options exclude them, touch-only row when empty', () => {
  const W = load({ on: true, sensors: ['binary_sensor.hall'] });
  const out = W.html({ _hass: hass });
  assert.match(out, /data-v="sens\|binary_sensor\.hall"/, 'selected sensor has a remove control');
  assert.match(out, /wl-pk-rm/);
  assert.match(out, /data-hge="wl-pk-open"/);
  assert.doesNotMatch(out, /Desk presence/, 'closed picker does not render the option list');
  const W2 = load({ on: true, sensors: ['binary_sensor.hall'] }); W2._dd = 'sens';
  const open = W2.html({ _hass: hass });
  assert.match(open, /Desk presence/, 'open picker offers the unselected motion sensor');
  const list = open.slice(open.indexOf('role="listbox"'));
  assert.ok(list.includes('Desk presence'), 'option list is present');
  assert.doesNotMatch(list, /Hall PIR/, 'selected sensor is not in the option list');
  const empty = load({ on: true, sensors: [] }).html({ _hass: hass });
  assert.match(empty, /wall\.none_touch_only/);
  assert.doesNotMatch(empty, /wl-pk-rm/, 'nothing to remove when empty');
});
