/* hgClimInfo: what a climate entity really does, integration agnostic.
   Auto: actual state entity (confirmed) > hvac_action (confirmed) > independent room temperature vs setpoint with hysteresis (estimated) > mode only. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const src = readFileSync(new URL('../../src/parts/shared/climate-modes.part.js', import.meta.url), 'utf8');
const load = (C) => {
  const ctx = { hgT: (k) => k, HGAreas: { climCfg: () => C || {} } };
  vm.createContext(ctx); vm.runInContext(src + '\nthis.info = hgClimInfo; this.act = hgClimAct; this.on = hgOnState; this.rank = hgClimRank;', ctx); return ctx;
};
const cl = (state, attributes = {}) => ({ entity_id: 'climate.x', state, attributes });
const pick = (i) => i && [i.act, i.conf, i.src];
const H = (states = {}) => ({ states });
const num = (v, u) => ({ state: String(v), attributes: u ? { unit_of_measurement: u } : {} });

test('off, unavailable and unknown give null', () => {
  const { info } = load();
  for (const s of ['off', 'unavailable', 'unknown']) assert.equal(info(H(), cl(s)), null);
});
test('no hvac_action and no configuration: mode only, never idle', () => {
  const { info } = load();
  // device own current_temperature above the setpoint (e.g. sensor next to an IR remote) is never used
  assert.deepEqual(pick(info(H(), cl('heat', { current_temperature: 27.5, temperature: 25 }))), [null, 'mode', 'mode']);
  assert.deepEqual(pick(info(H(), cl('cool', { current_temperature: 20, temperature: 24 }))), [null, 'mode', 'mode']);
  assert.deepEqual(pick(info(H(), cl('heat_cool', {}))), [null, 'mode', 'mode']);
  assert.equal(info(H(), cl('heat')).mode, 'heat');
});
test('hvac_action is confirmed, every value mapped', () => {
  const { info } = load();
  const M = { heating: 'heat', preheating: 'heat', defrosting: 'heat', cooling: 'cool', drying: 'dry', fan: 'fan_only', idle: 'idle', off: 'idle' };
  for (const [k, v] of Object.entries(M)) assert.deepEqual(pick(info(H(), cl('heat', { hvac_action: k }))), [v, 'confirmed', 'hvac_action'], k);
  assert.deepEqual(pick(info(H(), cl('heat', { hvac_action: 'weird' }))), [null, 'mode', 'mode']);
});
test('on/off entity is confirmed and wins over hvac_action', () => {
  assert.deepEqual(pick(load({ ent: 'b.s' }).info(H({ 'b.s': { state: 'off' } }), cl('heat', { hvac_action: 'heating' }))), ['idle', 'confirmed', 'entity']);
  assert.deepEqual(pick(load({ ent: 'b.s' }).info(H({ 'b.s': { state: 'on' } }), cl('heat', { hvac_action: 'idle' }))), ['heat', 'confirmed', 'entity']);
  // heat_cool running: direction from hvac_action when present, else the mode
  assert.deepEqual(pick(load({ ent: 'b.s' }).info(H({ 'b.s': { state: 'on' } }), cl('heat_cool', { hvac_action: 'cooling' }))), ['cool', 'confirmed', 'entity']);
  assert.deepEqual(pick(load({ ent: 'b.s' }).info(H({ 'b.s': { state: 'on' } }), cl('heat_cool'))), ['heat_cool', 'confirmed', 'entity']);
});
test('numeric entity uses the threshold: 5 W default for power, 0 for other units, configurable', () => {
  const { on } = load();
  assert.equal(on(num(3, 'W')), false); assert.equal(on(num(6, 'W')), true);
  assert.equal(on(num(0.004, 'kW')), false); assert.equal(on(num(0.01, 'kW')), true);
  assert.equal(on(num(1, '%')), true); assert.equal(on(num(0, '%')), false);
  assert.equal(on(num(40, 'W'), 50), false); assert.equal(on(num(60, 'W'), '50'), true);
  assert.equal(on(num(3, 'W'), ''), false);
  assert.equal(on({ state: 'unavailable' }), null); assert.equal(on({ state: 'burning' }), null); assert.equal(on({ state: '' }), null); assert.equal(on(null), null);
  assert.deepEqual(pick(load({ ent: 's.p', thr: 100 }).info(H({ 's.p': num(80, 'W') }), cl('heat'))), ['idle', 'confirmed', 'entity']);
});
test('unavailable or text entity falls through to hvac_action, then mode', () => {
  assert.deepEqual(pick(load({ ent: 's.p' }).info(H({ 's.p': { state: 'unavailable' } }), cl('heat', { hvac_action: 'heating' }))), ['heat', 'confirmed', 'hvac_action']);
  assert.deepEqual(pick(load({ ent: 's.p' }).info(H({ 's.p': { state: 'burning' } }), cl('heat'))), [null, 'mode', 'mode']);
  assert.deepEqual(pick(load({ ent: 's.missing' }).info(H(), cl('heat'))), [null, 'mode', 'mode']);
});
test('room temperature is estimated, with hysteresis and mode awareness', () => {
  const R = (t, C = {}) => load(Object.assign({ temp: 's.t' }, C)).info(H({ 's.t': { state: String(t) } }), cl(C.st || 'heat', C.a || { temperature: 21, current_temperature: 30 }));
  assert.deepEqual(pick(R(20.4)), ['heat', 'estimated', 'room']);
  assert.deepEqual(pick(R(20.6)), ['idle', 'estimated', 'room']);
  assert.deepEqual(pick(R(20.6, { hys: 0 })), ['heat', 'estimated', 'room']);
  assert.deepEqual(pick(R(22, { hys: '2' })), ['idle', 'estimated', 'room']);
  assert.deepEqual(pick(R(24.6, { st: 'cool', a: { temperature: 24 } })), ['cool', 'estimated', 'room']);
  assert.deepEqual(pick(R(24.4, { st: 'cool', a: { temperature: 24 } })), ['idle', 'estimated', 'room']);
  const hc = { target_temp_low: 20, target_temp_high: 24 };
  assert.deepEqual(pick(R(19, { st: 'heat_cool', a: hc })), ['heat', 'estimated', 'room']);
  assert.deepEqual(pick(R(25, { st: 'heat_cool', a: hc })), ['cool', 'estimated', 'room']);
  assert.deepEqual(pick(R(22, { st: 'heat_cool', a: hc })), ['idle', 'estimated', 'room']);
  assert.deepEqual(pick(R(22, { st: 'heat_cool', a: { temperature: 21 } })), [null, 'mode', 'mode']);
  assert.deepEqual(pick(R(22, { st: 'dry' })), [null, 'mode', 'mode']);
  assert.deepEqual(pick(R('unavailable')), [null, 'mode', 'mode']);
  // hvac_action is preferred over the room temperature in auto
  assert.deepEqual(pick(load({ temp: 's.t' }).info(H({ 's.t': { state: '18' } }), cl('heat', { temperature: 21, hvac_action: 'idle' }))), ['idle', 'confirmed', 'hvac_action']);
});
test('forced sources', () => {
  const st = H({ 'b.s': { state: 'on' }, 's.t': { state: '25' } }), a = { temperature: 21, hvac_action: 'idle' };
  assert.deepEqual(pick(load({ src: 'mode', ent: 'b.s', temp: 's.t' }).info(st, cl('heat', a))), [null, 'mode', 'mode']);
  assert.deepEqual(pick(load({ src: 'entity', ent: 'b.s' }).info(st, cl('heat', a))), ['heat', 'confirmed', 'entity']);
  assert.deepEqual(pick(load({ src: 'entity' }).info(st, cl('heat', a))), [null, 'mode', 'mode']);
  assert.deepEqual(pick(load({ src: 'room', ent: 'b.s', temp: 's.t' }).info(st, cl('heat', a))), ['idle', 'estimated', 'room']);
  assert.deepEqual(pick(load({ src: 'room' }).info(st, cl('heat', a))), [null, 'mode', 'mode']);
  assert.deepEqual(pick(load({ src: 'bogus' }).info(st, cl('heat', a))), ['idle', 'confirmed', 'hvac_action']);
});
test('optimistic mode change is mode only', () => {
  assert.deepEqual(pick(load().info(H(), cl('heat', { hvac_action: 'idle' }), 'cool')), [null, 'mode', 'mode']);
});
test('legacy hgClimAct and the room ranking', () => {
  const { act, rank } = load();
  assert.equal(act(H(), cl('heat', { hvac_action: 'idle' })), 'idle');
  assert.equal(act(H(), cl('heat')), 'heat');
  assert.equal(act(H(), cl('off')), null);
  const R = (act, conf) => rank({ act, conf });
  assert.ok(R('heat', 'confirmed') > R('heat', 'estimated'));
  assert.ok(R('heat', 'estimated') > R(null, 'mode'));
  assert.ok(R(null, 'mode') > R('idle', 'confirmed'));
  assert.ok(R('idle', 'confirmed') > R('idle', 'estimated'));
  assert.equal(rank(null), 0);
});

/* config: legacy sensors[room]['state:climate.x'] keeps working; new keys sit next to it; room temperature never from the device itself */
const asrc = readFileSync(new URL('../../src/parts/shared/areas.part.js', import.meta.url), 'utf8');
const areas = () => { const ctx = { H: {}, hgT: (k) => k, hgTLazy: (k) => k, window: {} }; vm.createContext(ctx); vm.runInContext(asrc + '\nthis.A = HGAreas;', ctx); return ctx.A; };
test('climCfg: legacy key, new keys, room sensor fallback, own device excluded', () => {
  const A = areas();
  const h = { states: { 'climate.x': {}, 'b.s': {}, 'sensor.t': {}, 'sensor.own': {} }, entities: { 'climate.x': { device_id: 'D' }, 'sensor.own': { device_id: 'D' } } };
  let c = A.climCfg(h, 'climate.x', { sensors: { r1: { 'state:climate.x': 'b.s' } } });
  assert.equal(c.ent, 'b.s'); assert.equal(c.src, 'auto'); assert.equal(c.temp, null);
  c = A.climCfg(h, 'climate.x', { sensors: { r1: { 'src:climate.x': 'room', 'temp:climate.x': 'sensor.t', 'hys:climate.x': '1', 'thr:climate.x': '20' } } });
  assert.equal(c.src, 'room'); assert.equal(c.temp, 'sensor.t'); assert.equal(c.hys, '1'); assert.equal(c.thr, '20');
  assert.equal(A.climCfg(h, 'climate.x', { sensors: { r1: { temperature: 'sensor.t' } } }, 'r1').temp, 'sensor.t');
  assert.equal(A.climCfg(h, 'climate.x', { sensors: { r1: { temperature: 'sensor.own' } } }, 'r1').temp, null);
  assert.equal(A.climCfg(h, 'climate.x', { sensors: { r1: { 'temp:climate.x': 'sensor.own' } } }).temp, null);
  assert.equal(A.climCfg(h, 'climate.x', { sensors: { r1: { temperature: '-' } } }, 'r1').temp, null);
  assert.equal(A.stateOf(h, 'climate.x', { sensors: { r1: { 'state:climate.x': 'b.s' } } }), 'b.s');
});

/* mode only: the Rooms tile shows just the mode name (e.g. "Heating"), no "Mode:" prefix, with an empty neutral dot */
test('Rooms tile mode-only label is the plain mode name', () => {
  const ac = readFileSync(new URL('../../src/parts/cards/areas-card.part.js', import.meta.url), 'utf8');
  assert.doesNotMatch(ac, /mode_label/);
  assert.match(ac, /ci\.conf === 'mode' \? \(HG_AC_MODE\[ci\.mode\] \|\| \{\}\)\.l \|\| H\.stateLabel\(ci\.mode\)/);
  // no '~' in visible labels, dot colour from the mode tokens, never HG_AC_MODE.off grey for a running or idle device
  assert.doesNotMatch(ac, /'~'/);
  assert.doesNotMatch(readFileSync(new URL('../../src/parts/cards/ac-card.part.js', import.meta.url), 'utf8'), /'~'/);
  assert.match(ac, /hgClimCol\(/);
  assert.doesNotMatch(ac, /HG_AC_MODE\.off/);
  for (const l of ['en', 'pl', 'fr']) {
    const d = JSON.parse(readFileSync(new URL(`../../src/locales/${l}.json`, import.meta.url), 'utf8'));
    assert.equal(d.cards.areas.mode_label, undefined, l);
  }
});

/* one colour map for the remote 'Mode' picker and the Rooms dot */
test('hgClimCol: shared mode colours, auto from the setpoint, off grey', () => {
  const { col, C } = (() => { const ctx = { hgT: (k) => k }; vm.createContext(ctx); vm.runInContext(src + '\nthis.col = hgClimCol; this.C = HG_CLIM_COL;', ctx); return ctx; })();
  assert.equal(col('heat'), C.heat); assert.equal(col('cool'), C.cool); assert.equal(col('dry'), C.dry); assert.equal(col('fan_only'), C.fan_only); assert.equal(col('off'), C.off);
  assert.equal(col('auto', 28, 16, 30), C.heat); assert.equal(col('heat_cool', 17, 16, 30), C.cool); assert.equal(col('auto', 23, 16, 30), C.mid); assert.equal(col('auto', null, 16, 30), C.mid);
  const rc = readFileSync(new URL('../../src/parts/cards/remote-card.part.js', import.meta.url), 'utf8');
  assert.match(rc, /_col\(st, t, mn, mx\) \{ return hgClimCol\(st, t, mn, mx\); \}/);
  assert.doesNotMatch(rc, /hsl\(214 88% 56%\)|hsl\(24 92% 54%\)/);
});
