/* Panel (dashboard): hg-studio-card in hgGenerate, per-view layout seed (studios.dashboard), seed-once rule. */
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
  return loadParts(['hg-i18n.part.js', 'hg-select.part.js', 'hg-oss.part.js', 'hg-core.part.js', 'studio/registry.part.js', 'studio/seed.part.js', 'shared/grid-engine.part.js'], g, ['hgGenerate', 'hgViewHas', 'hgCdn', 'HG_STUDIO_W', 'hgStudioSeed', 'hgStudioEnsure', 'hgStudioGet'],
    { EN, MANIFEST: [{ code: 'en', name: 'English', locale: 'en-GB', file: null }], text: [['import.meta.url', 'undefined']] });
}
const st = (state = 'on', attributes = {}) => ({ state, attributes });
const hass = (extra = {}) => ({ config: { location_name: 'Dom' }, user: { id: 'u1' }, areas: { a: { area_id: 'a', name: 'A' } }, devices: {}, entities: {}, callWS: async () => ({}),
  states: { 'sun.sun': st('above_horizon'), 'weather.home': st('sunny', { supported_features: 3 }), 'climate.salon': st('heat'), 'person.ola': st('home'), 'light.salon': st('on'), 'media_player.tv': st('idle'),
    'camera.front': st('idle'), 'camera.back': st('idle'), 'sensor.pv': st('1200', { device_class: 'power', unit_of_measurement: 'W' }), 'scene.evening': st('unknown', { friendly_name: 'Evening' }), ...extra } });
const model = (h) => ({ sun: 'sun.sun', weather: 'weather.home', climate: ['climate.salon'], persons: ['person.ola'], media: ['media_player.tv'], cams: ['camera.front', 'camera.back'], power: ['sensor.pv'], scenes: ['scene.evening'], all: Object.keys(h.states) });

const stPage = (pg) => pg && pg.cards && pg.cards[0] && pg.cards[0].type === 'custom:hg-studio-card';

test('hgGenerate: every view uses hg-studio-card; no separate studio tab', async () => {
  const { hgGenerate } = mk(), h = hass();
  const a = await hgGenerate(h, { _wiz: { views: ['dashboard', 'rooms', 'energia', 'multimedia'] } });
  assert.ok(!a.views.some((v) => v.path === 'studio'));
  for (const path of ['dashboard', 'rooms', 'energia', 'multimedia']) {
    const pg = a.views.find((x) => x.path === path).cards[0];
    assert.ok(stPage(pg), path);
    assert.equal(pg.view, path);
  }
  const pokoj = a.views.find((x) => x.path === 'pokoj').cards[0];
  assert.ok(stPage(pokoj));
  assert.equal(pokoj.room_head, true);
  assert.ok(!pokoj.cards.some((c) => c.type === 'custom:hg-power-card'), 'no legacy energia cards in lovelace');
  const d = await hgGenerate(h, { _wiz: {} });
  assert.ok(!d.views.some((v) => v.path === 'studio'));
});

test('hgStudioSeed: per-view first layouts', () => {
  const { hgStudioSeed } = mk(), h = hass(), M = model(h);
  const en = hgStudioSeed(M, h, 'energia');
  assert.equal(en.seedV, 2);
  const byEn = Object.fromEntries(en.items.map((i) => [i.id, i]));
  assert.equal(byEn.w_energy.type, 'energy');
  assert.equal(byEn.w_energy.w, 8);
  assert.equal(byEn.w_home.type, 'home');
  assert.equal(byEn.w_scenes.type, 'scenes');
  const rooms = hgStudioSeed(M, h, 'rooms').items[0];
  assert.equal(rooms.type, 'card');
  assert.equal(rooms.settings.card.type, 'custom:hg-areas-card');
  const fam = hgStudioSeed(M, h, 'family').items;
  assert.ok(fam.some((i) => i.settings && i.settings.card && i.settings.card.type === 'custom:hg-people-card'));
  const kam = hgStudioSeed(M, h, 'kamery').items.find((i) => i.id === 'w_cameras');
  assert.deepEqual(kam.settings.entities, ['camera.front', 'camera.back']);
  assert.equal(hgStudioSeed(M, h, 'siec').items.filter((i) => i.type === 'card').length, 4);
});

test('hgViewHas no longer lists studio as a separate view', () => {
  const { hgViewHas } = mk();
  assert.equal(hgViewHas({ media: [], cams: [], persons: [], power: [] }).studio, undefined);
  assert.equal(hgViewHas({ media: [], cams: [], persons: [], power: [] }).dashboard, true);
});

test('seed: sizes, positions and entities from the model; missing entity gives hidden widget', () => {
  const { hgStudioSeed, HG_STUDIO_W } = mk(), h = hass(), L = hgStudioSeed(model(h), h);
  assert.equal(L.v, 1); assert.equal(L.custom, 0); assert.equal(L.seedV, 2);
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

test('hgStudioEnsure seeds per view; seedV bump replaces stale layout, skips when current', () => {
  const { hgStudioEnsure, hgStudioGet } = mk(), h = hass(), M = model(h);
  const L = { loaded: true, failed: false, data: { s: {} } };
  assert.equal(hgStudioEnsure(L, M, h, 'dashboard'), true);
  const root = hgStudioGet(L.data, 'dashboard');
  assert.ok(root && root.items.length === 8);
  assert.equal(root.seedV, 2);
  assert.equal(hgStudioEnsure(L, M, h, 'dashboard'), false);
  root.seedV = 1;
  root.custom = 1;
  assert.equal(hgStudioEnsure(L, M, h, 'dashboard'), true);
  assert.equal(hgStudioGet(L.data, 'dashboard').seedV, 2);
  assert.equal(hgStudioGet(L.data, 'dashboard').custom, 0);
  const nl = { loaded: false, failed: false, data: { s: {} } }, fl = { loaded: true, failed: true, data: { s: {} } };
  assert.equal(hgStudioEnsure(nl, M, h, 'dashboard'), false); assert.equal(hgStudioGet(nl.data, 'dashboard'), null);
  assert.equal(hgStudioEnsure(fl, M, h, 'dashboard'), false); assert.equal(hgStudioGet(fl.data, 'dashboard'), null);
});

test('hgCdn version regex accepts X.Y.Z and X.Y.Z-beta.N only', async () => {
  const fs = await import('node:fs'), src = fs.readFileSync(new URL('../../src/parts/hg-oss.part.js', import.meta.url), 'utf8');
  const m = src.match(/const hgCdn = .*?!(\/\^.*?\$\/)\.test\(v\)/); assert.ok(m);
  const re = eval(m[1]);
  for (const v of ['2.31.0', '2.32.0-beta.1', '2.32.0-beta.12']) assert.ok(re.test(v), v);
  for (const v of ['2.32.0-rc.1', '2.32.0-beta', '2.32', '2.32.0-beta.1x']) assert.ok(!re.test(v), v);
});
