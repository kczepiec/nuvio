/* studio-card.test.mjs
   hg-studio-card: seed once, positions from HGL.data.studios.dashboard, breakpoint layouts, edit operations (move / resize / hide / add / remove),
   drag simulation through the card's own handlers, per-breakpoint writes (lg -> items, md -> bps.md) and no edit chrome outside edit mode.
   Runs the real grid engine and widget registry; HGBase, HGL and the DOM helpers are small stubs. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

function mk(HGL, opt = {}) {
  class HGBase { constructor() { this._hass = null; } _update() {} _once() { return true; } }
  const made = [];
  const g = {
    window: {}, HGBase, HGL, hgReg: () => {}, hgT: (k, p) => k + (p ? JSON.stringify(p) : ''), hgTLazy: (k) => ({ toString: () => k }),
    H: { esc: (s) => String(s ?? '').replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';'), icon: (i) => `<ha-icon icon="${i}"></ha-icon>` },
    hgMakeCard: (cfg, done) => { made.push(cfg); done({ cfg }); }, hgPass: () => {}, hgMorph: () => {}, hgOverlay: { menu: async () => opt.menu },
    hgStudioSettingsFromEdit: () => ({}),
    HGModel: { load: async () => opt.M || {} }, customElements: { get: () => null }, ResizeObserver: undefined, MutationObserver: undefined,
  };
  const r = loadParts(['shared/grid-engine.part.js', 'shared/studio-widgets.part.js', 'cards/studio-card.part.js'], g, ['HGStudioGrid', 'HGGrid', 'HG_STUDIO_W', 'hgStudioGet', 'hgStudioSet']);
  return { ...r, made };
}
const lay = (HGL, P) => (P && P.hgStudioGet ? P.hgStudioGet(HGL.data, 'dashboard') : HGL.data.studios?.dashboard || HGL.data.studio);
const hgl = (data = {}) => ({ loaded: true, failed: false, editing: false, subs: new Set(), data: { v: 1, s: {}, ...data } });
const st = (state = 'on', attributes = {}) => ({ state, attributes });
const hass = { states: { 'sun.sun': st('above_horizon'), 'weather.home': st('sunny'), 'climate.salon': st('heat'), 'person.ola': st('home'), 'media_player.tv': st('idle'),
  'camera.front': st('idle'), 'sensor.pv': st('1200'), 'scene.evening': st('unknown'), 'light.salon': st('on') } };
const M = { sun: 'sun.sun', weather: 'weather.home', climate: ['climate.salon'], persons: ['person.ola'], media: ['media_player.tv'], cams: ['camera.front'], power: ['sensor.pv'], scenes: ['scene.evening'], all: Object.keys(hass.states) };
const tick = () => new Promise((r) => setTimeout(r, 0));
const area = (html, id) => (new RegExp(`data-id="${id}" style="grid-area:([^"]+)"`).exec(html) || [])[1];
async function seeded(width = 1440, opt = {}) {
  const HGL = hgl(), P = mk(HGL, { M, ...opt }), c = new P.HGStudioGrid();
  c._width(width); c.hass = hass; await tick(); await tick();
  return { HGL, P, c };
}

test('seed on first hass; seeded layout rendered at its grid positions', async () => {
  const { HGL, P, c } = await seeded();
  const L = lay(HGL, P);
  assert.equal(L.custom, 0); assert.equal(L.items.length, 8);
  const h = c._gridHtml();
  assert.equal(area(h, 'w_greeting'), '1 / 1 / span 4 / span 5');
  assert.equal(area(h, 'w_weather'), '1 / 6 / span 4 / span 3');
  assert.equal(area(h, 'w_climate'), '1 / 9 / span 4 / span 4');
  assert.equal(area(h, 'w_home'), '5 / 1 / span 3 / span 5');
  assert.equal(area(h, 'w_scenes'), '8 / 6 / span 3 / span 4');
  assert.match(h, /--st-cols:12;--st-rows:10/);
  assert.equal(c.getGridOptions().columns, 'full');
});

test('existing studio key is never reseeded', async () => {
  const own = { v: 1, items: [{ id: 'w_media', type: 'media', x: 2, y: 1, w: 3, h: 3, settings: {} }], bps: {}, custom: 1 };
  const HGL = hgl({ studios: { dashboard: own } }), P = mk(HGL, { M }), c = new P.HGStudioGrid();
  c._width(1440); c.hass = hass; await tick(); await tick();
  assert.equal(lay(HGL, P), own);
  assert.equal(area(c._gridHtml(), 'w_media'), '2 / 3 / span 3 / span 3');
});

test('not loaded or failed layout: no seed', async () => {
  const HGL = hgl(); HGL.failed = true; const P = mk(HGL, { M }), c = new P.HGStudioGrid();
  c.hass = hass; await tick();
  assert.equal(lay(HGL, P), null);
  assert.match(c._gridHtml(), /studio\.empty_title/);
});

test('breakpoint switch uses the derived layout', async () => {
  const { HGL, P, c } = await seeded();
  c._width(800);
  assert.equal(c._bp.id, 'md');
  assert.deepEqual(c._cur(), P.HGGrid.derive(lay(HGL, P).items, 12, 8));
  const h = c._gridHtml(); assert.match(h, /--st-cols:8;/);
  const g = c._cur().find((i) => i.id === 'w_greeting');
  assert.equal(area(h, 'w_greeting'), `${g.y + 1} / ${g.x + 1} / span ${g.h} / span ${g.w}`);
  c._width(390); assert.equal(c._bp.id, 'sm'); assert.ok(c._cur().every((i) => i.x + i.w <= 4));
});

test('lg move / resize write items and set custom:1; bps untouched', async () => {
  const { HGL, P, c } = await seeded();
  const before = lay(HGL, P).items;
  c._opMove('w_weather', 0, 0);
  assert.deepEqual(lay(HGL, P).items, P.HGGrid.move(before, 'w_weather', 0, 0, 12));
  assert.equal(lay(HGL, P).custom, 1); assert.deepEqual(lay(HGL, P).bps, {});
  c._opResize('w_climate', 99, 1);
  const cl = lay(HGL, P).items.find((i) => i.id === 'w_climate');
  assert.deepEqual([cl.w, cl.h], [8, 2], 'clamped to maxW 8 and minH 2');
});

test('drag simulation through the card handlers: snap + move, resize from the corner', async () => {
  const { HGL, P, c } = await seeded();
  const m = { cw: 100, ch: 64, gap: 16 };
  c._dragBegin('w_weather', 'drag', m);
  c._dragMove(-5 * 116 + 20, 4 * 80 + 10);   // 5 columns left, 4 rows down (snapped)
  assert.equal(lay(HGL, P).items.find((i) => i.id === 'w_weather').x, 5, 'nothing written before release');
  c._dragEnd(true);
  const w = lay(HGL, P).items.find((i) => i.id === 'w_weather');
  assert.equal(w.x, 0); assert.equal(lay(HGL, P).custom, 1);
  c._dragBegin('w_greeting', 'size', m); c._dragMove(116, 80); c._dragEnd(true);
  const gr = lay(HGL, P).items.find((i) => i.id === 'w_greeting');
  assert.deepEqual([gr.w, gr.h], [6, 5]);
  const snap = JSON.stringify(lay(HGL, P));
  c._dragBegin('w_home', 'drag', m); c._dragMove(300, 0); c._dragEnd(false);
  assert.equal(JSON.stringify(lay(HGL, P)), snap, 'cancelled drag writes nothing');
});

test('md edit writes bps.md, not items; lg keeps its layout', async () => {
  const { HGL, P, c } = await seeded(800);
  const items = JSON.stringify(lay(HGL, P).items);
  c._opResize('w_greeting', 8, 4);
  assert.equal(JSON.stringify(lay(HGL, P).items), items);
  const md = lay(HGL, P).bps.md; assert.ok(Array.isArray(md));
  assert.equal(md.find((i) => i.id === 'w_greeting').w, 8);
  assert.ok(md.every((i) => !('settings' in i)), 'settings live only in items');
  assert.equal(lay(HGL, P).custom, 1);
  c._width(1440); assert.equal(c._cur().find((i) => i.id === 'w_greeting').w, 5);
  c._width(800); assert.equal(c._cur().find((i) => i.id === 'w_greeting').w, 8, 'md override used');
});

test('hide, show, add (also into overrides) and remove', async () => {
  const { HGL, P, c } = await seeded(800);
  c._opHide('w_media');
  assert.equal(lay(HGL, P).bps.md.find((i) => i.id === 'w_media').hidden, true);
  assert.ok(!/data-id="w_media"/.test(c._gridHtml()));
  c._opShow('w_media'); assert.equal(lay(HGL, P).bps.md.find((i) => i.id === 'w_media').hidden, false);
  c._width(1440); c._M = M;
  const id = c._opAdd('weather');
  assert.equal(id, 'w_weather_2');
  assert.equal(lay(HGL, P).items.find((i) => i.id === id).settings.entity, 'weather.home');
  assert.ok(lay(HGL, P).bps.md.some((i) => i.id === id), 'added to the md override too');
  c._opRemove('w_weather');
  assert.ok(!lay(HGL, P).items.some((i) => i.id === 'w_weather'));
  assert.ok(!lay(HGL, P).bps.md.some((i) => i.id === 'w_weather'));
});

test('a gallery card lands on the studio grid and drops editor metadata', async () => {
  const { HGL, P, c } = await seeded();
  const id = c._opAddCard({ name: 'Lista', icon: 'mdi:format-list-checks', z: 'm', card: { type: 'custom:hg-entities-card', entities: ['light.a'], nv_comp: 'entities' } });
  const it = lay(HGL, P).items.find((i) => i.id === id);
  assert.equal(it.type, 'card');
  assert.deepEqual([it.w, it.h], [4, 3]);
  assert.equal(c._cfg(it).nv_comp, undefined);
  assert.deepEqual(c._cfg(it).entities, ['light.a']);
  HGL.editing = true;
  assert.match(c._gridHtml(), new RegExp('data-id="' + id + '"'));
  assert.match(c._gridHtml(), /Lista/);
});

test('size presets and keyboard move', async () => {
  const { HGL, P, c } = await seeded();
  c._opSize('w_weather', 's'); let w = lay(HGL, P).items.find((i) => i.id === 'w_weather'); assert.deepEqual([w.w, w.h], [2, 2]);
  c._opSize('w_weather', 'l'); w = lay(HGL, P).items.find((i) => i.id === 'w_weather'); assert.deepEqual([w.w, w.h], [5, 5]);
  HGL.editing = true; c._lay();
  let prevented = 0; const el = { classList: { contains: (k) => k === 'st-w' }, dataset: { id: 'w_home' }, querySelector: () => null };
  c._key({ key: 'ArrowRight', shiftKey: true, composedPath: () => [el], preventDefault: () => prevented++, stopPropagation() {} });
  assert.equal(prevented, 1);
  assert.equal(lay(HGL, P).items.find((i) => i.id === 'w_home').w, 6);
});

test('edit chrome only in edit mode; unknown widget types are skipped', async () => {
  const { HGL, P, c } = await seeded();
  const root = lay(HGL, P);
  P.hgStudioSet(HGL.data, 'dashboard', { ...root, items: [...root.items, { id: 'w_x', type: 'nope', x: 0, y: 20, w: 2, h: 2 }] });
  let h = c._gridHtml();
  for (const k of ['data-st="drag"', 'data-st="size"', 'data-st="menu"', 'st-add', 'st-bg', 'tabindex']) assert.ok(!h.includes(k), k);
  assert.ok(!h.includes('w_x'));
  HGL.editing = true; h = c._gridHtml();
  for (const k of ['data-st="drag"', 'data-st="edit"', 'data-st="size"', 'data-st="menu"', 'st-add', 'st-bg', 'tabindex="0"', 'data-no-swipe', 'studio.add_widget', 'studio.add_hint']) assert.ok(h.includes(k), k);
  assert.ok(!h.includes('w_x'));
  assert.match(h, /data-st="add" data-no-swipe aria-haspopup="menu" style="grid-area:8 \/ 10 \/ span 3 \/ span 3"/, 'add tile in the first free slot, as in the mockup');
});

test('edit mode grid rows follow visible layout, not lg minimum', () => {
  const HGL = hgl({ studios: { dashboard: { v: 1, items: [
    { id: 'w_greeting', type: 'greeting', x: 0, y: 0, w: 5, h: 4, settings: {} },
    { id: 'w_weather', type: 'weather', x: 5, y: 0, w: 3, h: 4, settings: { entity: 'weather.home' } },
  ], bps: {}, custom: 1 } } });
  const P = mk(HGL, { M }), c = new P.HGStudioGrid();
  c._width(390);
  HGL.editing = false;
  const h = c._gridHtml();
  assert.match(h, /--st-rows:10/, 'preview keeps lg floor');
  HGL.editing = true;
  const h2 = c._gridHtml();
  const m = /--st-rows:(\d+)/.exec(h2);
  assert.ok(m, 'rows var');
  assert.ok(+m[1] < 10, 'edit drops empty lg tail rows');
});

test('row height uses design unit (_stCh), same in edit and preview', () => {
  const HGL = hgl({ studios: { dashboard: { v: 1, items: [
    { id: 'w_media', type: 'media', x: 0, y: 0, w: 4, h: 4, settings: {} },
  ], bps: {}, custom: 1 } } });
  const P = mk(HGL, { M }), c = new P.HGStudioGrid();
  c._width(1440);
  const set = {};
  const g = {
    classList: { contains: (x) => x === 'ed' },
    style: { setProperty: (k, v) => { set[k] = v; }, removeProperty: (k) => { delete set[k]; }, getPropertyValue: () => '' },
    querySelectorAll: (sel) => (sel === '.st-w' ? [{ dataset: { id: 'w_media' }, setAttribute: () => {}, querySelector: () => null, style: { removeProperty: () => {}, setProperty: () => {} } }] : []),
  };
  const root = { querySelector: (s) => (s === '.st-g' ? g : null), querySelectorAll: (sel) => g.querySelectorAll(sel) };
  c.$ = { querySelector: (s) => (s === '.st-root' ? root : null) };
  c._cur = () => [{ id: 'w_media', x: 0, y: 0, w: 4, h: 4 }];
  c._gridRows = () => 10;
  c._u0px = () => 1;
  c._panelEl = () => null;
  c._scale();
  assert.equal(set['--st-ch'], '64.00px', 'design row from HG_ST_ROW × u0 when panel unknown');
});

test('widgets mount through hgMakeCard with the registry config', async () => {
  const { P, c } = await seeded();
  const root = { querySelector: () => null, querySelectorAll: () => ['greeting', 'climate'].map((t) => ({ parentElement: { dataset: { id: 'w_' + t } } })) };
  c._mount(root);
  assert.deepEqual(P.made.map((x) => x.type), ['custom:hg-hero-card', 'custom:hg-studio-climate-card']);
  assert.equal(P.made[1].entity, 'climate.salon');
  c._mount(root); assert.equal(P.made.length, 2, 'children reused across renders');
});
