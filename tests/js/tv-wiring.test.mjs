/* Telewizor: podpięcie strony do edytora i budowania (hooki, prefiks akcji, kolejność w PAGE, katalogi, brak długich myślników). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const rd = (p) => readFileSync(new URL(p, root), 'utf8');
const cat = (c) => JSON.parse(rd('src/locales/' + c + '.json'));
const edit = rd('src/parts/hg-edit.part.js');
const tv = rd('src/parts/hg-tv.part.js');
const logic = rd('src/parts/hg-tvlogic.part.js');

test('hg-edit: lista stron, render, akcje tv- i wire są podpięte', () => {
  assert.match(edit, /\['users', 'mdi:account-multiple-outline', hgT\('settings\.pg\.users'\), 'sys'\], \['tv', 'mdi:television', hgT\('settings\.pg\.tv'\), 'sys'\], \['integrations'/);
  assert.match(edit, /\$\{window\.HGUsers \? HGUsers\.html\(this\) : ''\}\n\s+\$\{window\.HGTv \? HGTv\.html\(this\) : ''\}/);
  assert.match(edit, /if \(a\.startsWith\('tv-'\) && window\.HGTv\) return HGTv\.act\(this, b, a\);/);
  assert.match(edit, /if \(window\.HGTv\) HGTv\.wire\(this, S\);/);
});

test('hg-tv: każda akcja data-hge ma prefiks tv- i jest obsłużona w act()', () => {
  const hges = [...new Set([...tv.matchAll(/data-hge="([a-z-]+)"/g)].map((m) => m[1]))].sort();
  assert.deepEqual(hges, [
    'tv-cdn',
    'tv-cup',
    'tv-del',
    'tv-lreload',
    'tv-lsave',
    'tv-lsync',
    'tv-pair',
    'tv-reload',
    'tv-rent',
    'tv-room',
    'tv-rop',
    'tv-send',
  ]);
  for (const a of hges) assert.match(tv, new RegExp("case '" + a + "':"));
  assert.match(tv, /window\.HGTv = HGTv;/);
});

test('build.py: części logiki i strony są w PAGE po hg-users, przed hg-assist', () => {
  const page = rd('tools/build.py').split('\n').find((l) => l.startsWith('PAGE = '));
  assert.ok(page.includes("'hg-users.part.js', 'hg-tvlogic.part.js', 'hg-tv.part.js', 'hg-voice.part.js', 'hg-assist.part.js'"));
});

test('katalogi: strona tv i przestrzeń tv.* mają te same klucze w en, pl i fr', () => {
  const base = (keys) =>
    [...new Set(keys.map((k) => k.replace(/_(zero|one|two|few|many|other)$/, '')))].sort();
  const en = cat('en');
  assert.ok(Object.keys(en.tv).length >= 44);
  for (const k of ['accepted', 'err_wrong', 'err_limit', 'err_rejected', 'plain_title', 'plain_text', 'plain_ok']) for (const c of ['en', 'pl', 'fr']) assert.equal(typeof cat(c).tv[k], 'string', c + '.' + k);
  for (const c of ['pl', 'fr']) {
    const d = cat(c);
    assert.deepEqual(base(Object.keys(d.tv)), base(Object.keys(en.tv)), c);
    assert.equal(typeof d.settings.pg.tv, 'string', c);
    assert.deepEqual(d.tv.created.match(/\{[a-z]+\}/g), ['{when}'], c);
  }
  assert.equal(cat('pl').tv.connected, 'Telewizor połączony');
  assert.deepEqual(['en', 'pl', 'fr'].map((c) => cat(c).tv.beta), ['Beta', 'Beta', 'Bêta']);
});

test('token nie jest zapisywany ani logowany przez stronę', () => {
  for (const src of [tv, logic]) assert.doesNotMatch(src, /localStorage|sessionStorage|console\.|HGL\.save|setItem/);
});

test('brak długich myślników w nowych plikach i w tekstach tv (DESIGN.md)', () => {
  const dash = /[\u2013\u2014]/;
  assert.doesNotMatch(tv, dash); assert.doesNotMatch(logic, dash);
  for (const c of ['en', 'pl', 'fr']) { const d = cat(c); assert.doesNotMatch(JSON.stringify([d.tv, d.settings.pg.tv]), dash, c); }
});

test('znaczek Beta przy tytule strony: tylko tokeny projektu, bez stałych px dla promienia i czcionki', () => {
  const css = tv.slice(tv.indexOf('const HG_TV_CSS'));
  const rule = css.split('\n').find((l) => l.startsWith('.tv-beta')) || '';
  assert.match(rule, /border-radius:var\(--hg-radius-pill\)/);
  assert.match(rule, /font-size:var\(--hg-fs-1\)/);
  assert.match(rule, /color-mix\(in srgb, var\(--hg-accent\) 18%, transparent\)/);
  assert.match(rule, /color:var\(--hg-accent-tx, var\(--hg-accent\)\)/);
  assert.doesNotMatch(rule, /#[0-9a-f]{3,6}\b|rgba?\(/i);
});
