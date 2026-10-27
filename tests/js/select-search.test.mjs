import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

const { hgsFilter, hgsNextPage, HGS_PAGE } = loadParts(['hg-select.part.js'], { window: {} }, ['hgsFilter', 'hgsNextPage', 'HGS_PAGE']);

const sensors = [
  'Dom Wilgotność (67.75 %)',
  'ble humidity Łazienka Parter (65 %)',
  'ble humidity Łazienka piętro (70 %)',
  'ble humidity Ganek (43 %)',
  'Wemos DHT11 Wilgotność (unavailable %)',
];

test('empty query keeps every option in original order', () => {
  assert.deepEqual(hgsFilter(sensors, ''), [0, 1, 2, 3, 4]);
  assert.deepEqual(hgsFilter(sensors, '   '), [0, 1, 2, 3, 4]);
});

test('search matches text case-insensitively and ignores Polish diacritics', () => {
  assert.deepEqual(hgsFilter(sensors, 'LAZIENKA'), [1, 2]);
  assert.deepEqual(hgsFilter(sensors, 'łazienka'), [1, 2]);
  assert.deepEqual(hgsFilter(sensors, 'wilgotnosc'), [0, 4]);
});

test('search returns indices into the full option list, so picks map back to the native select', () => {
  assert.deepEqual(hgsFilter(sensors, 'ganek'), [3]);
});

test('no match returns an empty list (the empty-state row is shown)', () => {
  assert.deepEqual(hgsFilter(sensors, 'zzz'), []);
});

test('paging adds HGS_PAGE options at a time and never past the total', () => {
  assert.equal(HGS_PAGE, 10);
  assert.equal(hgsNextPage(0, 25), 10);
  assert.equal(hgsNextPage(10, 25), 20);
  assert.equal(hgsNextPage(20, 25), 25);
  assert.equal(hgsNextPage(25, 25), 25);
  assert.equal(hgsNextPage(0, 0), 0);
});

test('a large list (thousands of sensors) is shown 10 at a time', () => {
  const big = Array.from({ length: 5000 }, (_, i) => 'sensor ' + i);
  let shown = 0, steps = 0;
  while (shown < big.length) { shown = hgsNextPage(shown, big.length); steps++; }
  assert.equal(steps, 500);
  assert.equal(hgsFilter(big, 'sensor 4999').length, 1);
});
