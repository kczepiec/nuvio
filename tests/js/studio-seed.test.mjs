/* Studio view: opt-in view in hgGenerate, first-layout seed from the home model, seed-once rule. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts, fixture } from './harness.mjs';

const EN = fixture('en');
const stub = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.iterator ? function* () {} : k === 'length' ? 0 : k === Symbol.toPrimitive ? () => '' : k === 'then' ? undefined : stub()), apply: () => stub(), construct: () => stub() });
function mk() {
  const store = {}, window = new EventTarget();
  class El { constructor() { this.isConnected = false; } attachShadow() { return (this.shadowRoot = { addEventListener() {}, appendChild() {}, querySelectorAll: () => [] }); } dispatchEvent() {} }
  const g = { window, document: stub(), navigator: { languages: ['en'], language: 'en' }, location: { pathname: '/nuvio/x', search: '' },
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    HTMLElement: El, customElements: { get() {}, define() {} }, matchMedia: stub(), requestAnimationFrame: () => 0, setInterval: () => 0, MutationObserver: class { observe() {} },
    CustomEvent, Event, fetch: () => Promise.reject(new Error('offline')), getComputedStyle: stub(), hgFlowDef: () => ({}), hgFlowCfg: () => ({}) };
  return loadParts(['hg-i18n.part.js', 'hg-select.part.js', 'hg-oss.part.js', 'hg-core.part.js', 'shared/studio-widgets.part.js'], g, ['hgGenerate', 'hgViewHas', 'hgCdn', 'HG_STUDIO_W', 'hgStudioSeed', 'hgStudioEnsure'],
    { EN, MANIFEST: [{ code: 'en', name: 'English', locale: 'en-GB', file: null }], text: [['import.meta.url', 'undefined']] });
}
const st = (state = 'on', attributes = {}) => ({ state, attributes });
const hass = (extra = {}) => ({ config: { location_name: 'Dom' }, user: { id: 'u1' }, areas: { a: { area_id: 'a', name: 'A' } }, devices: {}, entities: {}, callWS: async () => ({}),
  states: { 'sun.sun': st('above_horizon'), 'weather.home': st('sunny', { supported_features: 3 }), 'climate.salon': st('heat'), 'person.ola': st('home'), 'light.salon': st('on'), 'media_player.tv': st('idle'),
    'camera.front': st('idle'), 'camera.back': st('idle'), 'sensor.pv': st('1200', { device_class: 'power', unit_of_measurement: 'W' }), 'scene.evening': st('unknown', { friendly_name: 'Evening' }), ...extra } });
const model = (h) => ({ sun: 'sun.sun', weather: 'weather.home', climate: ['climate.salon'], persons: ['person.ola'], media: ['media_player.tv'], cams: ['camera.front', 'camera.back'], power: ['sensor.pv'], scenes: ['scene.evening'], all: Object.keys(h.states) });

test('hgGenerate: no studio view unless wiz.views lists it', async () => {
  const { hgGenerate } = mk(), h = hass();
  const a = await hgGenerate(h, { _wiz: { views: ['dashboard', 'rooms'] } });
  assert.ok(!a.views.some((v) => v.path === 'studio'));
  const d = await hgGenerate(h, { _wiz: {} });
  assert.ok(!d.views.some((v) => v.path === 'studio'), 'off by default');
  const b = await hgGenerate(h, { _wiz: { views: ['dashboard', 'studio'] } });
  const v = b.views.find((x) => x.path === 'studio');
  assert.ok(v);
  assert.equal(v.cards[0].view, 'studio');
  assert.equal(v.cards[0].studio, true);
  assert.deepEqual(v.cards[0].cards, [{ type: 'custom:hg-studio-card' }]);
  assert.ok(b.views.find((x) => x.path === 'dashboard').cards[0].tabs.some((t) => /studio/.test(t.path)));
});

test('hgViewHas lists studio as available; hgCdn accepts beta versions', () => {
  const { hgViewHas } = mk();
  assert.equal(hgViewHas({ media: [], cams: [], persons: [], power: [] }).studio, true);
});

test('seed: sizes, positions and entities from the model; missing entity gives hidden widget', () => {
  const { hgStudioSeed, HG_STUDIO_W } = mk(), h = hass(), L = hgStudioSeed(model(h), h);
  assert.equal(L.v, 1); assert.equal(L.custom, 0);
  const by = Object.fromEntries(L.items.map((i) => [i.type, i]));
  assert.deepEqual(Object.keys(by).sort(), Object.keys(HG_STUDIO_W).sort());
  assert.deepEqual([by.greeting.x, by.greeting.w, by.greeting.h, by.greeting.minW, by.greeting.maxH], [0, 5, 4, 3, 6]);
  assert.deepEqual([by.weather.x, by.weather.w, by.climate.x, by.climate.w], [5, 3, 8, 4]);
  assert.deepEqual([by.home.y, by.energy.y, by.scenes.x, by.scenes.w], [4, 7, 5, 4]);
  assert.equal(by.climate.settings.entity, 'climate.salon');
  assert.equal(by.energy.settings.entity, 'sensor.pv');
  assert.deepEqual([...by.cameras.settings.entities], ['camera.front', 'camera.back']);
  assert.ok(L.items.every((i) => i.hidden === false));
  const M2 = { ...model(h), cams: [], media: [], climate: [], power: [], weather: null, scenes: [] };
  const L2 = hgStudioSeed(M2, h), by2 = Object.fromEntries(L2.items.map((i) => [i.type, i]));
  for (const t of ['weather', 'climate', 'media', 'cameras', 'energy', 'scenes']) assert.equal(by2[t].hidden, true, t);
  assert.equal(by2.greeting.hidden, false);
  assert.equal(by2.cameras.y, 4, 'hidden widgets keep position');
});

test('widget cfg builds card config', () => {
  const { HG_STUDIO_W } = mk(), h = hass();
  assert.deepEqual({ ...HG_STUDIO_W.climate.cfg('climate.salon') }, { entity: 'climate.salon' });
  assert.deepEqual(HG_STUDIO_W.scenes.cfg('scene.evening', { entities: ['scene.evening'] }, h).scripts.map((s) => s.name), ['Evening']);
  assert.deepEqual([...HG_STUDIO_W.cameras.cfg('camera.front', {}).entities], ['camera.front']);
});

test('hgStudioEnsure seeds once, never replaces, skips when not loaded or failed', () => {
  const { hgStudioEnsure } = mk(), h = hass(), M = model(h);
  const L = { loaded: true, failed: false, data: { s: {} } };
  assert.equal(hgStudioEnsure(L, M, h), true);
  assert.ok(L.data.studio && L.data.studio.items.length === 8);
  const keep = L.data.studio; keep.custom = 1;
  assert.equal(hgStudioEnsure(L, M, h), false);
  assert.equal(L.data.studio, keep);
  const nl = { loaded: false, failed: false, data: { s: {} } }, fl = { loaded: true, failed: true, data: { s: {} } };
  assert.equal(hgStudioEnsure(nl, M, h), false); assert.equal(nl.data.studio, undefined);
  assert.equal(hgStudioEnsure(fl, M, h), false); assert.equal(fl.data.studio, undefined);
});

test('hgCdn version regex accepts X.Y.Z and X.Y.Z-beta.N only', async () => {
  const fs = await import('node:fs'), src = fs.readFileSync(new URL('../../src/parts/hg-oss.part.js', import.meta.url), 'utf8');
  const m = src.match(/const hgCdn = .*?!(\/\^.*?\$\/)\.test\(v\)/); assert.ok(m);
  const re = eval(m[1]);
  for (const v of ['2.31.0', '2.32.0-beta.1', '2.32.0-beta.12']) assert.ok(re.test(v), v);
  for (const v of ['2.32.0-rc.1', '2.32.0-beta', '2.32', '2.32.0-beta.1x']) assert.ok(!re.test(v), v);
});
