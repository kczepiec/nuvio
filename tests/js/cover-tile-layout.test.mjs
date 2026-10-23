/* #53: a container query does not style the container. flex-basis:100% on the cover buttons
   without flex-wrap on .hgtl itself draws the open / stop / close row past the tile on a phone. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/parts/hg-edit.part.js', import.meta.url), 'utf8');
const css = src.slice(src.indexOf('const HG_TILE_CSS'), src.indexOf('const hgTileAct'));
const narrow = css.split('@container (max-width: 330px)')[1].split('@container (max-width: 210px)')[0];

test('cover and media tiles wrap even though .hgtl is the container (#53)', () => {
  assert.match(css, /\.hgtl\.k-cover, \.hgtl\.k-media\{ flex-wrap:wrap; row-gap:8px; \}/);
  assert.doesNotMatch(narrow, /flex-wrap/);
  assert.match(narrow, /\.hgtl\.k-cover \.hgtb, \.hgtl\.k-media \.hgtb\{ flex:1 0 100%; \}/);
  assert.match(narrow, /\.hgtl\.k-cover \.cv\{ flex:1 0 100%; justify-content:space-between; \}/);
  assert.match(narrow, /\.hgtl\.k-media \.mc\{ flex:1 0 100%; justify-content:flex-end; \}/);
});
