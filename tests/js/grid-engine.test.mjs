/* Studio: silnik siatki HGGrid (czyste funkcje, bez mutacji wejścia). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

const { HGGrid: G } = loadParts(['shared/grid-engine.part.js'], {}, ['HGGrid']);
const fz = (o) => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); Object.values(o).forEach(fz); } return o; };
const it = (id, x, y, w, h, o = {}) => ({ id, type: 't', x, y, w, h, ...o });
const by = (arr, id) => arr.find((i) => i.id === id);
const pos = (arr) => Object.fromEntries(arr.map((i) => [i.id, [i.x, i.y, i.w, i.h]]));
const overlaps = (arr) => arr.some((a) => arr.some((b) => G.collides(a, b)));

test('bp: progi 1024/600', () => {
  assert.deepEqual(G.bp(1400), { id: 'lg', cols: 12 }); assert.deepEqual(G.bp(1024), { id: 'lg', cols: 12 });
  assert.deepEqual(G.bp(1023), { id: 'md', cols: 8 }); assert.deepEqual(G.bp(600), { id: 'md', cols: 8 });
  assert.deepEqual(G.bp(599), { id: 'sm', cols: 4 }); assert.deepEqual(G.bp(0), { id: 'sm', cols: 4 });
});

test('collides: nakładanie, styk krawędzi, ukryte, ten sam element', () => {
  const a = it('a', 0, 0, 2, 2);
  assert.equal(G.collides(a, it('b', 1, 1, 2, 2)), true);
  assert.equal(G.collides(a, it('b', 2, 0, 2, 2)), false);
  assert.equal(G.collides(a, it('b', 0, 2, 2, 2)), false);
  assert.equal(G.collides(a, it('b', 1, 1, 2, 2, { hidden: true })), false);
  assert.equal(G.collides({ ...a, hidden: true }, it('b', 1, 1, 2, 2)), false);
  assert.equal(G.collides(a, a), false);
});

test('norm: liczby całkowite, min/max/cols', () => {
  const [n] = G.norm([it('a', 1.6, 2.4, 2.5, 1.2, { minW: 3, minH: 2 })], 12);
  assert.deepEqual([n.x, n.y, n.w, n.h], [2, 2, 3, 2]);
  const [m] = G.norm([it('a', 0, 0, 9, 9, { maxW: 4, maxH: 5 })], 12);
  assert.deepEqual([m.w, m.h], [4, 5]);
  const [c] = G.norm([it('a', 10, -3, 6, 1)], 4);
  assert.deepEqual([c.x, c.y, c.w], [0, 0, 4]);
  const [e] = G.norm([it('a', 11, 0, 3, 1)], 12);
  assert.equal(e.x, 9);
  const [z] = G.norm([{ id: 'z' }], 4);
  assert.deepEqual([z.x, z.y, z.w, z.h], [0, 0, 1, 1]);
  const [mm] = G.norm([it('a', 0, 0, 2, 2, { minW: 6 })], 4);
  assert.equal(mm.w, 4);
});

test('place: wolny slot bez x/y, w kolejności czytania', () => {
  const items = fz([it('a', 0, 0, 6, 2), it('b', 6, 0, 6, 2)]);
  const r = G.place(items, fz({ id: 'c', w: 4, h: 2 }), 12);
  assert.equal(r.length, 3); assert.deepEqual(pos(r).c, [0, 2, 4, 2]);
  const gap = G.place(fz([it('a', 0, 0, 4, 2)]), fz({ id: 'c', w: 4, h: 2 }), 12);
  assert.deepEqual(pos(gap).c, [4, 0, 4, 2]);
});

test('place: z x/y wypycha kolidujące w dół', () => {
  const items = fz([it('a', 0, 0, 4, 2), it('b', 0, 2, 4, 2)]);
  const r = G.place(items, fz(it('c', 0, 0, 4, 2)), 12);
  assert.deepEqual(pos(r).a, [0, 2, 4, 2]); assert.deepEqual(pos(r).b, [0, 4, 4, 2]); assert.deepEqual(pos(r).c, [0, 0, 4, 2]);
  assert.equal(overlaps(r), false);
});

test('move: łańcuch pchnięć i brak kolizji', () => {
  const items = fz([it('a', 0, 0, 4, 2), it('b', 0, 2, 4, 2), it('c', 0, 4, 4, 2)]);
  const r = G.move(items, 'c', 0, 0, 12);
  assert.deepEqual(pos(r).c, [0, 0, 4, 2]); assert.deepEqual(pos(r).a, [0, 2, 4, 2]); assert.deepEqual(pos(r).b, [0, 4, 4, 2]);
  assert.equal(overlaps(r), false);
  const clamp = G.move(items, 'a', 99, 0, 12);
  assert.equal(by(clamp, 'a').x, 8);
});

test('resize: clamp min/max/cols, pchnięcie i compact', () => {
  const items = fz([it('a', 0, 0, 4, 2, { minW: 2, maxW: 6, minH: 2, maxH: 3 }), it('b', 0, 2, 4, 2)]);
  const g = G.resize(items, 'a', 99, 99, 12);
  assert.deepEqual([by(g, 'a').w, by(g, 'a').h], [6, 3]); assert.equal(by(g, 'b').y, 3);
  const s = G.resize(items, 'a', 0, 0, 12);
  assert.deepEqual([by(s, 'a').w, by(s, 'a').h], [2, 2]); assert.equal(by(s, 'b').y, 2);
  const edge = G.resize(fz([it('a', 10, 0, 2, 1)]), 'a', 5, 1, 12);
  assert.deepEqual([by(edge, 'a').x, by(edge, 'a').w], [7, 5]);
});

test('compact: stabilny i idempotentny', () => {
  const items = fz([it('a', 0, 3, 4, 2), it('b', 4, 3, 4, 2), it('c', 0, 8, 4, 2)]);
  const r = G.compact(items, 12);
  assert.deepEqual(pos(r), { a: [0, 0, 4, 2], b: [4, 0, 4, 2], c: [0, 2, 4, 2] });
  assert.deepEqual(G.compact(r, 12), r);
  assert.deepEqual(r.map((i) => i.id), ['a', 'b', 'c']);
  const tie = G.compact(fz([it('x', 0, 0, 12, 1), it('y', 0, 0, 12, 1)]), 12);
  assert.deepEqual(pos(tie), { x: [0, 0, 12, 1], y: [0, 1, 12, 1] });
});

test('ukryte: nie kolidują, nie ruszają się i nie pchają', () => {
  const items = fz([it('h', 0, 0, 4, 4, { hidden: true }), it('a', 0, 0, 4, 2)]);
  const r = G.compact(items, 12);
  assert.deepEqual(pos(r).h, [0, 0, 4, 4]); assert.deepEqual(pos(r).a, [0, 0, 4, 2]);
  const m = G.move(items, 'a', 0, 1, 12);
  assert.deepEqual(pos(m).h, [0, 0, 4, 4]); assert.equal(by(m, 'a').y, 0);
  const p = G.place(items, fz({ id: 'n', w: 4, h: 2 }), 12);
  assert.deepEqual(pos(p).n, [4, 0, 4, 2]);
});

test('derive 12 -> 8 -> 4: kolejność czytania, minW, bez kolizji', () => {
  const src = fz([it('g', 0, 0, 6, 2), it('w', 6, 0, 6, 2, { minW: 4 }), it('h', 0, 2, 6, 2), it('m', 6, 2, 6, 2)]);
  const order = (arr) => arr.slice().sort((a, b) => a.y - b.y || a.x - b.x).map((i) => i.id).join('');
  const d8 = G.derive(src, 12, 8), d4 = G.derive(src, 12, 4);
  for (const [d, cols] of [[d8, 8], [d4, 4]]) {
    assert.equal(order(d), 'gwhm'); assert.equal(overlaps(d), false);
    assert.ok(d.every((i) => i.x >= 0 && i.x + i.w <= cols));
  }
  assert.ok(by(d8, 'w').w >= 4 && by(d4, 'w').w >= 4);
  assert.deepEqual(G.derive(d8, 8, 4).map((i) => i.id).sort(), ['g', 'h', 'm', 'w']);
  assert.equal(overlaps(G.derive(d8, 8, 4)), false);
  assert.deepEqual(pos(G.derive(src, 12, 12)), pos(src));
});

test('layoutFor: override bps, inaczej derive', () => {
  const items = [it('a', 0, 0, 6, 2), it('b', 6, 0, 6, 2)], ov = [it('a', 0, 0, 4, 2), it('b', 0, 2, 4, 2)];
  const L = fz({ items, bps: { sm: ov } });
  assert.equal(G.layoutFor(L, 'sm'), ov);
  assert.deepEqual(pos(G.layoutFor(L, 'md')), pos(G.derive(items, 12, 8)));
  assert.deepEqual(pos(G.layoutFor(L, 'lg')), pos(items));
  assert.deepEqual(pos(G.layoutFor({ items }, 'sm')), pos(G.derive(items, 12, 4)));
});

test('snap: piksele na komórki, clamp do 0', () => {
  const g = { cw: 100, ch: 80, gap: 20 };
  assert.deepEqual(G.snap(0, 0, g), { x: 0, y: 0 });
  assert.deepEqual(G.snap(250, 190, g), { x: 2, y: 2 });
  assert.deepEqual(G.snap(59, 49, g), { x: 0, y: 0 });
  assert.deepEqual(G.snap(61, 51, g), { x: 1, y: 1 });
  assert.deepEqual(G.snap(-50, -50, g), { x: 0, y: 0 });
});

test('brak mutacji wejścia (deep-freeze) we wszystkich operacjach', () => {
  const items = fz([it('a', 0, 0, 4, 2), it('b', 0, 2, 4, 2, { minW: 2 }), it('h', 0, 0, 2, 2, { hidden: true })]);
  assert.doesNotThrow(() => {
    G.norm(items, 8); G.compact(items, 12); G.place(items, fz(it('n', 0, 0, 4, 2)), 12); G.place(items, fz({ id: 'f', w: 2, h: 2 }), 12);
    G.move(items, 'b', 0, 0, 12); G.resize(items, 'a', 6, 3, 12); G.derive(items, 12, 4); G.layoutFor(fz({ items }), 'md');
  });
});
