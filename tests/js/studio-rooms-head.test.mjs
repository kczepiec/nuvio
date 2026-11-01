/* Widok Pokoje (Studio): nagłówek z tytułem/podtytułem, przełącznik siatka/lista, layout:'list' w configu kafla, seed 3 kolumny. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { loadParts } from './harness.mjs';

const page = readFileSync(new URL('../../src/parts/hg-page.part.js', import.meta.url), 'utf8');
function method(src, name) {
  const m = new RegExp('\\n  ' + name + '\\([^)]*\\) \\{').exec(src); assert.ok(m, name);
  let i = m.index + m[0].length - 1, d = 0;
  for (; i < src.length; i++) { if (src[i] === '{') d++; else if (src[i] === '}' && --d === 0) break; }
  return src.slice(m.index + 1, i + 1);
}
const store = {};
const ls = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
const seedSrc = readFileSync(new URL('../../src/parts/studio/seed.part.js', import.meta.url), 'utf8');
const lay = /const hgRoomsLayout = .*\n/.exec(seedSrc)[0];

function head() {
  const ctx = { console, localStorage: ls, H: { esc: String, icon: (i) => `<ha-icon icon="${i}"></ha-icon>` }, hgT: (k) => k };
  vm.createContext(ctx);
  vm.runInContext(lay.replace('const hgRoomsLayout', 'globalThis.hgRoomsLayout') + '\nclass P { constructor(){ this.n = 0; this._cards = []; }\n' + method(page, '_roomsHead') + '\n' + method(page, '_roomsViewSet') + '\n_paintHead(){ this.n++; }\n}\nglobalThis.P = P;', ctx);
  return ctx;
}

test('nagłówek Pokoje: tytuł, podtytuł, ikona domu, przełącznik z aria-pressed', () => {
  delete store['home-glass:rooms-layout'];
  const { P } = head(), h = new P()._roomsHead();
  assert.match(h, /mdi:home-outline/); assert.match(h, /<h1>nav\.rooms<\/h1>/); assert.match(h, /<p>nav\.rooms_head_sub<\/p>/);
  assert.match(h, /data-m="grid"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-m="grid"/);
  assert.match(h, /mdi:view-grid-outline/); assert.match(h, /mdi:format-list-bulleted/);
});

test('przełącznik: zapamiętuje listę i przerysowuje kafle', () => {
  delete store['home-glass:rooms-layout'];
  const ctx = head(), p = new ctx.P(); let lays = 0; p._cards = [{ _lay() { lays++; } }];
  p._roomsViewSet('list');
  assert.equal(ctx.hgRoomsLayout(), 'list'); assert.equal(p.n, 1); assert.equal(lays, 1);
  assert.match(p._roomsHead(), /data-m="list"[^>]*aria-pressed="true"/);
  p._roomsViewSet('grid'); assert.equal(ctx.hgRoomsLayout(), 'grid');
});

test('kafel rooms dostaje layout:list; seed rooms = 3 kolumny', () => {
  delete store['home-glass:rooms-layout'];
  const g = { window: {}, HGBase: class { _update() {} }, HGL: {}, hgReg: () => {}, hgT: (k) => k, hgTLazy: (k) => k, H: {}, hgMakeCard() {}, hgPass() {}, hgMorph() {}, hgOverlay: {}, localStorage: ls, customElements: { get: () => null } };
  const P = loadParts(['shared/grid-engine.part.js', 'studio/registry.part.js', 'studio/seed.part.js', 'cards/studio-card.part.js'], g, ['HGStudioGrid', 'hgStudioSeed', 'hgRoomsLayout']);
  const c = new P.HGStudioGrid(); c._viewId = () => 'rooms';
  const it = P.hgStudioSeed({}, { states: {} }, 'rooms').items[0];
  assert.equal(c._cfg(it).layout, 'grid'); assert.equal(c._cfg(it).columns, 3);
  P.hgRoomsLayout('list');
  assert.equal(c._cfg(it).layout, 'list'); assert.equal(c._cfg(it).columns, 1);
  delete store['home-glass:rooms-layout'];
});
