/* WP-D2: hero / weather / media / cameras / scenes: default config renders the old structure, new opt-in flags the studio structure. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const rd = (n) => readFileSync(new URL('../../src/parts/cards/' + n + '-card.part.js', import.meta.url), 'utf8');
const esc = (x) => String(x ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fired = [], nav = [];
const H = {
  st: (h, e) => (h && e ? h.states[e] : undefined), ok: (s) => !!s && !['unavailable', 'unknown'].includes(s.state), esc, cssUrl: (u) => esc(u),
  icon: (i, c = '') => `<ha-icon class="${c}" icon="${i}"></ha-icon>`, name: (h, e) => (h.states[e] && h.states[e].attributes.friendly_name) || e, fmt: (v, d) => Number(v).toFixed(d),
  lv: (a, b) => a + ', ' + b, stateLabel: (s) => s, t: (h, s) => s.state, fire: (n, t, d) => fired.push([t, d]), navigate: (p) => nav.push(p), call: () => {}, pct: (v) => v + '%',
};
class HGBase { constructor() { this.attrs = {}; this.style = { setProperty() {}, removeProperty() {} }; } setConfig(c) { this._config = Object.assign({}, this.defaults(), c); } hasAttribute(a) { return a in this.attrs; } getAttribute() { return null; } }
const G = {
  HGBase, H, U: (x) => x, HG_NV_CSS: '', HG_ASSET: '', HG_CAM_CSS: '', hgT: (k, p) => (k.startsWith('cards.hero.greeting_') ? k + ', ' + p.name + '!' : k + (p ? JSON.stringify(p) : '')), hgTLazy: (k) => k, hgReg: () => {}, hgFirstName: () => 'Kris', hgUI: { pill: () => '<pill>' },
  HGI18n: { code: 'en' }, hgCamUn: (s) => !s || s.state === 'unavailable', hgPass: () => {}, hgTD: (k, f) => f, hgStN: (s) => s,
  HGWx: { cn: (s) => 'C:' + s, icon: (c, s) => 'ic-' + s + '.svg', sub: () => () => {}, tcol: () => '#fff' },
  document: { createElement: () => ({}) }, window: {}, HG_BASE: '', HG_VIS: null, hgOverlay: {},
};
const load = (n, cls) => new Function(...Object.keys(G), rd(n) + `; return ${cls};`)(...Object.values(G));
const mk = (C, cfg, hass) => { const c = new C(); c.setConfig(cfg); c._hass = hass; return c; };
const cls = (html) => new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));

test('hero: default unchanged, studio adds time-of-day greeting + status', () => {
  const C = load('hero', 'HGHeroCard'), hass = { states: {} };
  const a = mk(C, {}, hass).render();
  assert.match(a, /<ha-card class="glass hero"><h1 class="t">cards\.hero\.greeting_title/); assert.ok(a.includes('<p class="s">')); assert.ok(!a.includes('stl'));
  const c = mk(C, { studio: true }, hass); c._hour = () => 20;
  const b = c.render();
  assert.ok(b.includes('greeting_evening')); assert.ok(b.includes('class="dot"')); assert.ok(b.includes('cards.hero.all_set')); assert.ok(!b.includes('<p class="s">')); assert.ok(b.includes('class="l2"'));
  c._hour = () => 8; assert.ok(c.render().includes('greeting_morning'));
  c._hour = () => 2; assert.ok(c.render().includes('greeting_night'));
  c._hour = () => 14; assert.ok(c.render().includes('greeting_afternoon'));
});
test('hero: status counts attention, explicit title wins, status alone keeps the old greeting', () => {
  const C = load('hero', 'HGHeroCard');
  const hass = { states: { 'lock.a': { state: 'unlocked', attributes: {} }, 'binary_sensor.d': { state: 'on', attributes: { device_class: 'door' } }, 'binary_sensor.m': { state: 'on', attributes: { device_class: 'motion' } } } };
  const c = mk(C, { status: true }, hass), h = c.render();
  assert.ok(h.includes('class="dot warn"')); assert.ok(h.includes('&quot;count&quot;:2')); assert.ok(h.includes('greeting_title')); assert.ok(h.includes('<p class="s">'));
  assert.ok(mk(C, { studio: true, title: 'Yo {name}' }, hass).render().includes('Yo Kris'));
  assert.ok(mk(C, { status: true, status_entities: ['lock.zzz'] }, hass).render().includes('all_set'));
});

const W = { state: 'rainy', attributes: { temperature: 4, templow: 4, forecast: [] } };
const wcard = (cfg) => { const C = load('weather', 'HGWeatherCard'), c = mk(C, { entity: 'weather.x', ...cfg }, { states: { 'weather.x': W } });
  c.attrs = {}; c._hourly = [0, 1, 2, 3, 4, 5].map((i) => ({ datetime: new Date(Date.now() + (i + 1) * 3600000).toISOString(), condition: 'rainy', temperature: 5 - (i % 2) })); c._night = () => false; c._minmax = () => [5, 4]; return c; };
test('weather: default keeps strip structure; hourly/studio gives sw layout with N slots', () => {
  const a = wcard({}).render(), ca = cls(a);
  assert.ok(ca.has('now') && ca.has('strip') && !ca.has('sw'));
  const b = wcard({ hourly: 4 }).render(), cb = cls(b);
  assert.ok(cb.has('sw') && cb.has('swt') && cb.has('swc') && cb.has('swh') && !cb.has('strip'));
  assert.equal((b.match(/<small>/g) || []).length, 4); assert.ok(b.includes('5° / 4°'));
  assert.equal((wcard({ studio: true }).render().match(/<small>/g) || []).length, 4);
  assert.equal((wcard({ hourly: 2 }).render().match(/<small>/g) || []).length, 2);
});
test('weather: getGridOptions', () => {
  assert.deepEqual(wcard({}).getGridOptions(), { columns: 6, rows: 4 }); assert.equal(wcard({ hourly: 4 }).getGridOptions().rows, 3);
});

const MP = (extra = {}) => ({ states: { 'media_player.x': { state: 'playing', attributes: { supported_features: 1 | 16 | 32 | 16384, media_title: 'Blinding Lights', media_artist: 'The Weeknd', app_name: 'Spotify', media_duration: 200, media_position: 50, media_position_updated_at: new Date().toISOString(), ...extra } } } });
test('media: default unchanged, studio shows now-playing layout', () => {
  const C = load('media', 'HGMediaCard');
  const a = mk(C, { entity: 'media_player.x' }, MP()).render(), ca = cls(a);
  assert.ok(ca.has('row') && ca.has('ctl') && ca.has('kebab') && !ca.has('np') && !ca.has('pb'));
  const b = mk(C, { entity: 'media_player.x', studio: true }, MP()).render(), cb = cls(b);
  assert.ok(cb.has('np') && cb.has('npr') && cb.has('pb') && cb.has('src') && cb.has('sp') && cb.has('pp')); assert.ok(b.includes('The Weeknd') && b.includes('mdi:spotify'));
  assert.match(b, /aria-valuenow="2[5-9]"/); assert.ok(b.includes('data-act="prev"') && b.includes('data-act="next"'));
  assert.ok(!cls(mk(C, { entity: 'media_player.x', now_playing: true }, MP({ app_name: '', source: '' })).render()).has('src'));
  assert.deepEqual(mk(C, { entity: 'media_player.x' }, MP()).getGridOptions(), { columns: 6, rows: 3 });
});

const CAMS = { states: { 'camera.a': { state: 'idle', attributes: { friendly_name: 'Podjazd', entity_picture: '/api/camera_proxy/camera.a?token=1' } }, 'camera.b': { state: 'idle', attributes: { friendly_name: 'Brama' } }, 'camera.c': { state: 'unavailable', attributes: {} }, 'camera.d': { state: 'idle', attributes: {} } } };
test('cameras: studio thumbs with name, dot, view all; default does not use studio', () => {
  const C = load('cameras', 'HGCamerasCard');
  const mkc = (cfg) => { const c = mk(C, { entities: ['camera.a', 'camera.b', 'camera.c', 'camera.d'], ...cfg }, CAMS); c.isConnected = false; c.$ = { innerHTML: '', _q: [], querySelectorAll() { return []; } }; return c; };
  assert.deepEqual(mkc({}).getGridOptions(), { columns: 12, rows: 6 }); assert.equal(mkc({})._stu(), false);
  const c = mkc({ studio: true }); c._stuUpdate();
  const h = c.$.innerHTML, cc = cls(h);
  assert.ok(cc.has('st') && cc.has('sh') && cc.has('ths') && cc.has('th') && cc.has('va')); assert.equal((h.match(/class="th"/g) || []).length, 3);
  assert.ok(h.includes('Podjazd') && h.includes('cards.cameras.view_all'));
  assert.equal(mkc({ studio: true, max: 2 }).getGridOptions().rows, 3);
  const c2 = mkc({ thumbs: true, max: 4 }); c2._stuUpdate(); assert.equal((c2.$.innerHTML.match(/class="th"/g) || []).length, 4); assert.ok(!c2.$.innerHTML.includes('class="va"'));
  fired.length = nav.length = 0;
  c.onAct('all', {}); assert.equal(fired[0][1].entityId, 'camera.a');
  mkc({ studio: true, view_all_path: '/x/kamery' }).onAct('all', {}); assert.equal(nav[0], '/x/kamery');
});

const SC = { states: { 'script.a': { state: 'off', attributes: { friendly_name: 'Relaks' } }, 'script.b': { state: 'off', attributes: { friendly_name: 'ECO' } } } };
test('scenes: default unchanged; studio tiles; add tile only with add/edit', () => {
  const C = load('scenes', 'HGScenesCard'), sc = [{ entity: 'script.a' }, { entity: 'script.b' }];
  const a = mk(C, { scripts: sc }, SC).render(), ca = cls(a);
  assert.ok(ca.has('row') && ca.has('p') && !ca.has('tl') && !ca.has('add')); assert.equal(a.includes('data-act="add"'), false);
  const b = mk(C, { scripts: sc, studio: true }, SC).render(); assert.ok(cls(b).has('tl')); assert.ok(!b.includes('data-act="add"'));
  const d = mk(C, { scripts: sc, add: true }, SC).render(); assert.ok(d.includes('data-act="add"') && cls(d).has('add')); assert.ok(!cls(d).has('tl'));
  const e = mk(C, { scripts: sc }, SC); e.attrs.edit = ''; assert.ok(e.render().includes('data-act="add"'));
  fired.length = 0; e.onAct('add'); assert.deepEqual(fired[0], ['hg-card-add', { kind: 'scene' }]);
  assert.deepEqual(e.getGridOptions(), { columns: 6, rows: 2 });
});
