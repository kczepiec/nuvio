import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/parts/cards/hero-card.part.js', import.meta.url), 'utf8');

test('hero studio: rozmiary skalują się z szerokością i wysokością kafla', () => {
  assert.match(src, /\.t\.sg\{ font-size:clamp\(16px, min\(\d+cqi, \d+cqh\), 64px\)/);
  assert.match(src, /\.t\.sg ~ \.s\{ font-size:clamp\([^)]*min\(\d+cqi, \d+cqh\)/);
  assert.match(src, /\.t\.sg ~ \.stl\{ font-size:clamp\([^)]*min\(\d+cqi, \d+cqh\)/);
});

test('hero studio: brak stałych 64px/56px nadpisujących clamp z cqh', () => {
  assert.doesNotMatch(src, /\.t\.sg\{ font-size:64px/);
  assert.doesNotMatch(src, /\.t\{ font-size:56px/);
});
