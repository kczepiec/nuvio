/* Studio cards (hg-studio-climate-card, hg-studio-energy-card, hg-studio-home-card): tiers, structure, actions -> services, empty states.
   Texts come from the (tiny) test catalog, so only structure (classes, data-act, aria) is asserted. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts, fixture } from './harness.mjs';

const EN = fixture('en');
const stub = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.iterator ? function* () {} : k === 'length' ? 0 : k === Symbol.toPrimitive ? () => '' : k === 'then' ? undefined : stub()), apply: () => stub(), construct: () => stub() });
function mk(alert = true) {
  const store = {}, window = new EventTarget(), menus = [];
  class El { constructor() { this.isConnected = false; } attachShadow() { return (this.shadowRoot = { addEventListener() {}, appendChild() {}, querySelectorAll: () => [] }); } dispatchEvent(e) { (this.ev = this.ev || []).push(e); } }
  const g = { window, document: stub(), navigator: { languages: ['en'], language: 'en' }, location: { pathname: '/nuvio/x', search: '' },
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    HTMLElement: El, customElements: { get() {}, define() {} }, matchMedia: stub(), requestAnimationFrame: () => 0, setInterval: () => 0, MutationObserver: class { observe() {} },
    CustomEvent, Event, fetch: () => Promise.reject(new Error('offline')), getComputedStyle: stub(),
    hgDom: (e) => String(e || '').split('.')[0],
    hgOverlay: { alert: async () => alert, menu: async (el, items) => { menus.push(items); return menus.pick; } } };
  const files = ['hg-i18n.part.js', 'hg-select.part.js', 'hg-oss.part.js', 'hg-core.part.js', 'hg-styles.part.js', 'ui/ui.part.js', 'ui/card-header.part.js', 'ui/icon-button.part.js', 'ui/pill.part.js', 'ui/big-value.part.js',
    'shared/nv-card.part.js', 'shared/day-bars.part.js', 'shared/stats.part.js', 'shared/climate-modes.part.js', 'cards/ac-card.part.js',
    'cards/studio-climate-card.part.js', 'cards/studio-energy-card.part.js', 'cards/studio-home-card.part.js'];
  const R = loadParts(files, g, ['HGStudioCard', 'HGStudioClimateCard', 'HGStudioEnergyCard', 'HGStudioHomeCard'], { EN, MANIFEST: [{ code: 'en', name: 'English', locale: 'en-GB', file: null }], text: [['import.meta.url', 'undefined']] });
  return { ...R, window, menus };
}
const calls = () => { const c = []; return { c, callService: (d, s, data) => { c.push([d, s, data]); return Promise.resolve(); } }; };
const mkCard = (Cls, cfg, hass, menus) => { const c = new Cls(); c._config = Object.assign(c.defaults(), cfg); c._hass = hass; c.ev = []; return c; };
const btn = (a, extra = '') => ({ dataset: { act: a, ...extra }, hasAttribute: () => false });

const climate = (state = 'heat', attributes = {}) => ({ entity_id: 'climate.ac', state, attributes: { friendly_name: 'AC', temperature: 22, current_temperature: 20.5, min_temp: 16, max_temp: 30, target_temp_step: 0.5, hvac_modes: ['off', 'heat', 'cool', 'heat_cool'], hvac_action: 'heating', supported_features: 0, ...attributes } });

test('tier thresholds: compact below 260 wide or 180 high, expanded from 420x260, rest medium', () => {
  const { HGStudioCard: C } = mk(), t = C.tierOf;
  assert.equal(t(250, 400), 'compact'); assert.equal(t(400, 170), 'compact'); assert.equal(t(300, 200), 'medium');
  assert.equal(t(420, 259), 'medium'); assert.equal(t(420, 260), 'expanded'); assert.equal(t(500, 0), 'expanded'); assert.equal(t(300, 0), 'medium');
});

test('climate: three tiers differ structurally, power is in every tier', () => {
  const { HGStudioClimateCard: C } = mk(), h = { states: { 'climate.ac': climate('heat', { fan_mode: 'auto', fan_modes: ['auto', 'low'], swing_mode: 'off', swing_modes: ['off', 'on'], preset_mode: 'eco', preset_modes: ['eco', 'comfort'], current_humidity: 45 }) } };
  const out = {}; for (const t of ['compact', 'medium', 'expanded']) out[t] = mkCard(C, { entity: 'climate.ac', tier: t }, h).render();
  for (const t in out) { assert.match(out[t], new RegExp(`class="glass ${t} heat on"`), t); assert.match(out[t], /data-act="power"/, t); assert.match(out[t], /class="tv"/, t); }
  assert.doesNotMatch(out.compact, /data-act="mode"|class="dl"|class="wv"/);
  assert.match(out.medium, /data-act="mode"/); assert.match(out.medium, /class="dl"/); assert.match(out.medium, /data-act="step"/); assert.match(out.medium, /class="wv"/); assert.doesNotMatch(out.medium, /class="chs"/);
  assert.match(out.expanded, /class="chs"/); for (const a of ['fan', 'swing', 'preset']) assert.match(out.expanded, new RegExp(`data-act="${a}"`)); assert.match(out.expanded, /class="cur"/);
  assert.match(out.expanded, /role="slider"/); assert.match(out.expanded, /aria-valuenow="22"/);
  assert.match(out.expanded, /<b class="nv-num"[^>]*>22<\/b><sup>°C<\/sup>/);
});

test('climate: no fan/swing/preset chips when attributes are missing; cooling is not warm; off is dimmed', () => {
  const { HGStudioClimateCard: C } = mk();
  const ex = (s) => mkCard(C, { entity: 'climate.ac', tier: 'expanded' }, { states: { 'climate.ac': s } }).render();
  const cool = ex(climate('cool', { hvac_action: 'cooling' })); assert.doesNotMatch(cool, /data-act="fan"|data-act="swing"|data-act="preset"/); assert.doesNotMatch(cool, /glass expanded heat/);
  const off = ex(climate('off', { hvac_action: 'off' })); assert.match(off, /class="glass expanded  off"/); assert.match(off, /aria-disabled="true"/); assert.match(off, /data-act="step"[^>]*disabled/);
});

test('climate: empty and unavailable states', () => {
  const { HGStudioClimateCard: C } = mk();
  assert.match(mkCard(C, { entity: 'climate.none' }, { states: {} }).render(), /nv-empty/);
  const un = mkCard(C, { entity: 'climate.ac', tier: 'expanded' }, { states: { 'climate.ac': climate('unavailable') } }).render();
  assert.match(un, /class="glass un expanded"/); assert.doesNotMatch(un, /data-act="power"|class="dl"/);
});

test('climate: power turns off / on via services (turn_off/turn_on by feature, else set_hvac_mode)', () => {
  const { HGStudioClimateCard: C } = mk(), k = calls();
  let c = mkCard(C, { entity: 'climate.ac' }, { states: { 'climate.ac': climate('heat', { supported_features: 128 | 256 }) }, callService: k.callService });
  c.onAct('power', btn('power')); assert.deepEqual(k.c.pop(), ['climate', 'turn_off', { entity_id: 'climate.ac' }]);
  c = mkCard(C, { entity: 'climate.ac' }, { states: { 'climate.ac': climate('off', { supported_features: 128 | 256 }) }, callService: k.callService });
  c.onAct('power', btn('power')); assert.deepEqual(k.c.pop(), ['climate', 'turn_on', { entity_id: 'climate.ac' }]);
  c = mkCard(C, { entity: 'climate.ac' }, { states: { 'climate.ac': climate('heat') }, callService: k.callService });
  c.onAct('power', btn('power')); assert.deepEqual(k.c.pop(), ['climate', 'set_hvac_mode', { entity_id: 'climate.ac', hvac_mode: 'off' }]);
  c = mkCard(C, { entity: 'climate.ac' }, { states: { 'climate.ac': climate('off') }, callService: k.callService });
  c.onAct('power', btn('power')); assert.deepEqual(k.c.pop(), ['climate', 'set_hvac_mode', { entity_id: 'climate.ac', hvac_mode: 'heat' }]);
});

test('climate: mode / fan / swing / preset menus call the matching services', async () => {
  const { HGStudioClimateCard: C, menus } = mk(), k = calls();
  const c = mkCard(C, { entity: 'climate.ac' }, { states: { 'climate.ac': climate('heat', { fan_mode: 'auto', fan_modes: ['auto', 'low'], swing_mode: 'off', swing_modes: ['off', 'on'], preset_mode: 'eco', preset_modes: ['eco', 'comfort'] }) }, callService: k.callService });
  const run = async (a, pick, want) => { menus.pick = pick; await c.onAct(a, btn(a)); await new Promise((r) => setTimeout(r, 0)); assert.deepEqual(k.c.pop(), want, a); };
  await run('mode', 'cool', ['climate', 'set_hvac_mode', { entity_id: 'climate.ac', hvac_mode: 'cool' }]);
  assert.deepEqual(menus.at(-1).map((x) => x.value), ['off', 'heat', 'cool', 'heat_cool']); assert.equal(menus.at(-1).find((x) => x.checked).value, 'heat');
  await run('fan', 'low', ['climate', 'set_fan_mode', { entity_id: 'climate.ac', fan_mode: 'low' }]);
  await run('swing', 'on', ['climate', 'set_swing_mode', { entity_id: 'climate.ac', swing_mode: 'on' }]);
  await run('preset', 'comfort', ['climate', 'set_preset_mode', { entity_id: 'climate.ac', preset_mode: 'comfort' }]);
  menus.pick = 'heat'; await c.onAct('mode', btn('mode')); await new Promise((r) => setTimeout(r, 0)); assert.equal(k.c.length, 0, 'same mode: no call');
});

test('climate: +/- steps the target by target_temp_step, clamped, committed after a delay', async () => {
  const { HGStudioClimateCard: C } = mk(), k = calls();
  const c = mkCard(C, { entity: 'climate.ac' }, { states: { 'climate.ac': climate('heat', { temperature: 29.5, max_temp: 30 }) }, callService: k.callService });
  c._paint = () => {}; c.rerender = () => {}; c.$ = { querySelector: () => null, querySelectorAll: () => [] };
  c.onAct('step', btn('step', { d: '1' })); c.onAct('step', btn('step', { d: '1' }));
  assert.equal(c._pend, 30);
  c._commit(); assert.deepEqual(k.c.pop(), ['climate', 'set_temperature', { entity_id: 'climate.ac', temperature: 30 }]); clearTimeout(c._pt); clearTimeout(c._ct);
});

test('climate: dial renders the knob on the 270 degree arc (min = lower left, max = lower right)', () => {
  const { HGStudioClimateCard: C } = mk();
  const knob = (t) => { const m = mkCard(C, { entity: 'climate.ac', tier: 'medium' }, { states: { 'climate.ac': climate('heat', { temperature: t }) } }).render().match(/class="kn" cx="([-\d.]+)" cy="([-\d.]+)"/); return [+m[1], +m[2]]; };
  const [x0, y0] = knob(16), [x1, y1] = knob(30), [xm, ym] = knob(23);
  assert.ok(x0 < 100 && y0 > 100, 'min lower left'); assert.ok(x1 > 100 && y1 > 100, 'max lower right'); assert.ok(Math.abs(xm - 100) < 1 && ym < 30, 'middle at the top');
});

test('climate: stub config picks a climate entity, grid options have limits', () => {
  const { HGStudioClimateCard: C } = mk();
  assert.deepEqual(C.getStubConfig({ states: { 'light.a': { state: 'on', attributes: {} }, 'climate.z': climate() } }), { entity: 'climate.z' });
  const o = new C().getGridOptions(); assert.ok(o.min_columns <= o.columns && o.columns <= o.max_columns && o.min_rows <= o.rows && o.rows <= o.max_rows);
});

const en = (state = '1.24') => ({ entity_id: 'sensor.e', state, attributes: { friendly_name: 'Energy', unit_of_measurement: 'kWh', device_class: 'energy' } });
const hr = (h, n) => ({ start: h, change: n });

test('energy: tiers (compact value + delta, medium and expanded add tabs and bars)', () => {
  const { HGStudioEnergyCard: C } = mk(), h = { states: { 'sensor.e': en() } };
  const R = (t) => { const c = mkCard(C, { entity: 'sensor.e', tier: t }, h); c._d = { day: { t: 1, vals: [0.1, 0.3, 0.2, null], tot: 0.6, prev: 0.8, has: true } }; return c.render(); };
  const co = R('compact'), me = R('medium'), ex = R('expanded');
  for (const x of [co, me, ex]) { assert.match(x, /class="nv-big/); assert.match(x, /class="dt dn"/); assert.match(x, /mdi:arrow-down/); assert.match(x, /<span class="p">/); }
  assert.doesNotMatch(co, /nv-tabs|class="bars/); assert.match(me, /role="tablist"/); assert.match(me, /class="bars/);
  assert.match(ex, /role="tablist"/); assert.match(ex, /class="bars/); assert.equal((ex.match(/class="d /g) || []).length, 4);
  assert.match(ex, /data-act="tab" data-id="day"/); assert.match(ex, /data-act="tab" data-id="month"/);
});

test('energy: higher usage is red (up), equal has no arrow, no compare config hides delta, missing stats show the empty state', () => {
  const { HGStudioEnergyCard: C } = mk(), h = { states: { 'sensor.e': en() } };
  const R = (d, cfg = {}) => { const c = mkCard(C, { entity: 'sensor.e', tier: 'medium', ...cfg }, h); c._d = { day: d }; return c.render(); };
  assert.match(R({ t: 1, vals: [1], tot: 2, prev: 1, has: true }), /class="dt up"[^>]*>.*mdi:arrow-up/s);
  assert.doesNotMatch(R({ t: 1, vals: [1], tot: 1, prev: 1, has: true }), /mdi:arrow-/);
  assert.doesNotMatch(R({ t: 1, vals: [1], tot: 2, prev: 1, has: true }, { compare: false }), /class="dt/);
  assert.match(R({ t: 1, vals: [], tot: 0, prev: 0, has: false }), /nv-empty/);
  assert.match(mkCard(C, { entity: 'sensor.e', tier: 'medium' }, h).render(), /role="status"/, 'loading');
  assert.match(mkCard(C, { entity: 'sensor.none' }, { states: {} }).render(), /nv-empty/);
  assert.match(mkCard(C, { entity: 'sensor.e', tier: 'expanded' }, { states: { 'sensor.e': en('unavailable') } }).render(), /class="glass un expanded"/);
});

test('energy: day mode sums today hours and yesterday up to the same hour; tab switch loads the chosen period', async () => {
  const { HGStudioEnergyCard: C } = mk();
  const k = []; const now = Date.now(), t0 = (() => { const d = new Date(now); d.setHours(0, 0, 0, 0); return d.getTime(); })();
  const h = { config: { time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone }, states: { 'sensor.e': en() }, callWS: async (m) => { k.push(m); return { 'sensor.e': [{ start: t0 - 86400e3, change: 1 }, { start: t0 - 86400e3 + 23 * 3600e3, change: 50 }, { start: t0, change: 0.5 }] }; } };
  const c = mkCard(C, { entity: 'sensor.e', tier: 'expanded' }, h); c.rerender = () => {};
  await c._load(true);
  const d = c._d.day; assert.equal(k[0].period, 'hour'); assert.equal(k[0].statistic_ids[0], 'sensor.e'); assert.equal(d.vals.length, 24);
  assert.equal(d.tot, 0.5); assert.equal(d.has, true); assert.ok(d.prev >= 1, 'yesterday early hours counted');
  if (new Date(now).getHours() < 23) assert.ok(d.prev < 50, 'yesterday after the current hour excluded');
  c.onAct('tab', btn('tab', { id: 'week' })); assert.equal(c._mode(), 'week'); await c._ld.week; assert.ok(k.some((m) => m.period === 'day')); assert.ok(c._d.week.vals.length === 7);
  c.onAct('tab', btn('tab', { id: 'nope' })); assert.equal(c._mode(), 'week');
});

test('energy: stub config picks an energy sensor, grid limits', () => {
  const { HGStudioEnergyCard: C } = mk();
  assert.deepEqual(C.getStubConfig({ states: { 'sensor.t': { state: '1', attributes: { device_class: 'temperature' } }, 'sensor.k': en() } }), { entity: 'sensor.k' });
  const o = new C().getGridOptions(); assert.ok(o.min_columns <= o.columns && o.columns <= o.max_columns && o.min_rows <= o.rows && o.rows <= o.max_rows);
});

const light = (s) => ({ state: s, attributes: {} });
const home = (extra = {}) => ({ states: { 'light.a': light('on'), 'light.b': light('off'), 'light.u': light('unavailable'), 'lock.door': { state: 'locked', attributes: { friendly_name: 'Door' } }, 'camera.c1': { state: 'idle', attributes: {} }, 'camera.c2': { state: 'unavailable', attributes: {} },
  'sensor.t': { state: '21.5', attributes: { unit_of_measurement: '°C', device_class: 'temperature' } }, ...extra } });
const cfg = { lock: 'lock.door', temperature: 'sensor.t' };

test('home: compact shows 2 icon-only tiles, medium 4 tiles with header, expanded adds summary', () => {
  const { HGStudioHomeCard: C } = mk(), h = home();
  const co = mkCard(C, { ...cfg, tier: 'compact' }, h).render(), me = mkCard(C, { ...cfg, tier: 'medium' }, h).render(), ex = mkCard(C, { ...cfg, tier: 'expanded' }, h).render();
  assert.equal((co.match(/class="tl /g) || []).length, 2); assert.doesNotMatch(co, /<b>|<small>|class="sthd"/); assert.match(co, /--n:2/);
  assert.equal((me.match(/class="tl /g) || []).length, 4); for (const a of ['lights', 'lock', 'cams', 'temp']) assert.match(me, new RegExp(`data-act="${a}"`)); assert.match(me, /class="sthd"/); assert.match(me, /<small>/); assert.doesNotMatch(me, /class="sum"/);
  assert.match(ex, /class="sum"/); assert.match(ex, /<small>21\.5°C<\/small>/);
});

test('home: lights tile is accent-filled when any light is on, counts only available lights, ignores explicit lists correctly', () => {
  const { HGStudioHomeCard: C } = mk();
  assert.match(mkCard(C, { ...cfg, tier: 'medium' }, home()).render(), /class="tl on" type="button" data-act="lights"/);
  const off = mkCard(C, { ...cfg, tier: 'medium' }, home({ 'light.a': light('off') })).render(); assert.match(off, /class="tl " type="button" data-act="lights"/);
  const c = mkCard(C, { ...cfg, tier: 'expanded', lights: ['light.b'] }, home()); assert.deepEqual(c._lights(), ['light.b']); assert.deepEqual(c._auto('light'), ['light.a', 'light.b', 'light.u']);
  assert.match(c.render(), /class="tl " type="button" data-act="lights"/);
});

test('home: missing entities drop their tile; nothing configured and no lights/cameras gives the empty state', () => {
  const { HGStudioHomeCard: C } = mk();
  const me = mkCard(C, { tier: 'medium' }, { states: { 'light.a': light('on') } }).render(); assert.equal((me.match(/class="tl /g) || []).length, 1);
  assert.match(mkCard(C, {}, { states: {} }).render(), /nv-empty/);
  const un = mkCard(C, { lock: 'lock.door', tier: 'medium' }, { states: { 'lock.door': { state: 'unavailable', attributes: {} } } }).render(); assert.match(un, /data-act="lock"[^>]*disabled/);
});

test('home: lights tile toggles all available lights (off when any is on, on when all off)', async () => {
  const { HGStudioHomeCard: C } = mk(), k = calls();
  let c = mkCard(C, cfg, { ...home(), callService: k.callService }); await c.onAct('lights', btn('lights'));
  assert.deepEqual(k.c.pop(), ['light', 'turn_off', { entity_id: ['light.a', 'light.b'] }]);
  c = mkCard(C, cfg, { ...home({ 'light.a': light('off') }), callService: k.callService }); await c.onAct('lights', btn('lights'));
  assert.deepEqual(k.c.pop(), ['light', 'turn_on', { entity_id: ['light.a', 'light.b'] }]);
  c = mkCard(C, { ...cfg, lights: ['light.b'] }, { ...home(), callService: k.callService }); await c.onAct('lights', btn('lights'));
  assert.deepEqual(k.c.pop(), ['light', 'turn_on', { entity_id: ['light.b'] }]);
});

test('home: unlocking asks for confirmation, locking does not; code locks open more-info', async () => {
  const k = calls();
  let { HGStudioHomeCard: C } = mk(false), c = mkCard(C, cfg, { ...home(), callService: k.callService }); await c.onAct('lock', btn('lock')); assert.equal(k.c.length, 0, 'declined');
  ({ HGStudioHomeCard: C } = mk(true)); c = mkCard(C, cfg, { ...home(), callService: k.callService }); await c.onAct('lock', btn('lock')); assert.deepEqual(k.c.pop(), ['lock', 'unlock', { entity_id: 'lock.door' }]);
  ({ HGStudioHomeCard: C } = mk(false)); c = mkCard(C, cfg, { ...home({ 'lock.door': { state: 'unlocked', attributes: {} } }), callService: k.callService }); await c.onAct('lock', btn('lock')); assert.deepEqual(k.c.pop(), ['lock', 'lock', { entity_id: 'lock.door' }]);
  c = mkCard(C, cfg, { ...home({ 'lock.door': { state: 'locked', attributes: { code_format: '^\\d+$' } } }), callService: k.callService }); await c.onAct('lock', btn('lock'));
  assert.equal(k.c.length, 0); assert.equal(c.ev.at(-1).type, 'hass-more-info'); assert.equal(c.ev.at(-1).detail.entityId, 'lock.door');
});

test('home: cameras tile counts online cameras and opens details; temp tile opens details', async () => {
  const { HGStudioHomeCard: C } = mk();
  const c = mkCard(C, { ...cfg, tier: 'medium' }, home()); const html = c.render(); assert.match(html, /data-act="cams"/);
  await c.onAct('cams', btn('cams')); assert.equal(c.ev.at(-1).detail.entityId, 'camera.c1');
  await c.onAct('temp', btn('temp')); assert.equal(c.ev.at(-1).detail.entityId, 'sensor.t');
  const none = mkCard(C, { ...cfg, tier: 'medium', cameras: ['camera.c2'] }, home()).render(); assert.match(none, /data-act="cams"[^>]*disabled/);
});

test('home: stub config picks lock and temperature sensor when present; grid limits', () => {
  const { HGStudioHomeCard: C } = mk();
  assert.deepEqual(C.getStubConfig(home()), { lock: 'lock.door', temperature: 'sensor.t' }); assert.deepEqual(C.getStubConfig({ states: {} }), {});
  const o = new C().getGridOptions(); assert.ok(o.min_columns <= o.columns && o.columns <= o.max_columns && o.min_rows <= o.rows && o.rows <= o.max_rows);
});

test('change detection: auto light list changes the signature when a light toggles', () => {
  const { HGStudioHomeCard: C } = mk();
  const c = mkCard(C, cfg, home()); const a = JSON.stringify(c._extraSig()); c._hass = home({ 'light.b': light('on') }); assert.notEqual(JSON.stringify(c._extraSig()), a);
});

test('registration: all three cards appear in the picker', () => {
  const { window } = mk(); const t = (window.customCards || []).map((x) => x.type);
  for (const n of ['hg-studio-climate-card', 'hg-studio-energy-card', 'hg-studio-home-card']) assert.ok(t.includes(n), n);
});
