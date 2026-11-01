import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../v3/src/cards/hero-card.ts', import.meta.url), 'utf8');

test('hero studio: rozmiary skalują się z szerokością i wysokością kafla', () => {
  assert.match(src, /h1 \{[^}]*font-size: clamp\(16px, min\(\d+cqi, \d+cqh\), 64px\)/);
  assert.match(src, /p \{[^}]*font-size: clamp\([^)]*min\(\d+cqi, \d+cqh\)/);
  assert.match(src, /\.stl \{[^}]*font-size: clamp\([^)]*min\(\d+cqi, \d+cqh\)/);
});
