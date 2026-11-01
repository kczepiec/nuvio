import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/parts/cards/weather-card.part.js', import.meta.url), 'utf8');

test('pogoda hero: brak gradientu ::before (mleczny prostokąt pod pogodą)', () => {
  assert.match(src, /\.hero::before\{ content:none; display:none; \}/);
  assert.doesNotMatch(src, /\.hero::before\{[^}]*radial-gradient/);
});
