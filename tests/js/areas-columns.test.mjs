/* Kafel obszarów: columns:3 w siatce daje 3 kolumny (container query), 2 i 1 poniżej progów, proporcje kart ~1.63 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/parts/cards/areas-card.part.js', import.meta.url), 'utf8');
test('siatka pokoi: 3 kolumny od 900 px, 2 od 580 px, domyślnie 1', () => {
  assert.match(src, /\.grid\{[^}]*grid-template-columns:minmax\(0, 1fr\)/);
  assert.match(src, /@container \(min-width: 580px\)\{ \.grid\{ grid-template-columns:repeat\(2,/);
  assert.match(src, /@container \(min-width: 900px\)\{ \.grid\{ grid-template-columns:repeat\(3,/);
  assert.doesNotMatch(src, /repeat\(4, minmax/);
});
test('config columns trafia do klasy siatki, karty mają aspect-ratio 465/285', () => {
  assert.match(src, /cols\$\{Math\.min\(3, Math\.max\(1, parseInt\(c\.columns, 10\) \|\| 3\)\)\}/);
  assert.match(src, /\.grid\.cols1\{/);
  assert.match(src, /aspect-ratio:465 \/ 285/);
});
