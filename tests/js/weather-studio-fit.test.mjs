import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/parts/cards/weather-card.part.js', import.meta.url), 'utf8');

test('weather studio: stopnie wysokości chowają drugorzędne elementy', () => {
  assert.match(src, /@container \(max-height: 190px\)\{ \.sw \.swh\{ display:none/);
  assert.match(src, /@container \(max-height: 130px\)\{ ha-card\.sw\{ padding:/);
  assert.match(src, /@container \(max-height: 90px\)\{ \.sw \.swc\{ display:none/);
});

test('weather studio: ha-card.sw bez mlecznej poświaty szkła', () => {
  const m = src.match(/ha-card\.sw\{ --hg-glass-sheen:none;[^}]*\}/);
  assert.ok(m);
  for (const t of ['--hg-glass-lite:transparent', '--hg-edge:0 0 0 transparent', 'background:transparent', 'backdrop-filter:none']) assert.ok(m[0].includes(t), t);
});
