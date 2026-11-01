/* studio-chrome.test.mjs
   Studio view chrome (cfg studio:true): status icons + date/time in the top bar, theme toggle on the rail.
   Runs the real _stDev/_stChrome cut from hg-page.part.js against a fake hass; other views must stay untouched. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../../src/parts/hg-page.part.js', import.meta.url), 'utf8');

function method(name) {
  const m = new RegExp('\\n  ' + name + '\\([^)]*\\) \\{').exec(src);
  assert.ok(m, name + ' must exist');
  let i = m.index + m[0].length - 1, d = 0;
  for (; i < src.length; i++) { if (src[i] === '{') d++; else if (src[i] === '}' && --d === 0) break; }
  return src.slice(m.index + 1, i + 1);
}
function page(states) {
  const ctx = { console, H: { esc: (x) => String(x), icon: (i) => `<ha-icon icon="${i}"></ha-icon>` }, hgT: (k, p) => k + (p ? JSON.stringify(p) : ''), HG_LOC: () => 'en-GB' };
  vm.createContext(ctx);
  vm.runInContext('class P { constructor(){ this._hass = { states: ' + JSON.stringify(states) + ', locale: { time_format: "24" } }; }\n' + method('_stDev') + '\n' + method('_stLink') + '\n' + method('_stChrome') + '\n}\nglobalThis.P = P;', ctx);
  return new ctx.P();
}

test('studio chrome: status icons only for existing tablet entities, date + time always', () => {
  const p = page({
    'sensor.wall_tablet_battery_level': { state: '87', attributes: { device_class: 'battery' } },
    'binary_sensor.wall_tablet_wifi': { state: 'on', attributes: {} },
  });
  const h = p._stChrome();
  assert.match(h, /class="sst"/);
  assert.match(h, /data-act="stent"/); assert.match(h, /mdi:wifi"/); assert.doesNotMatch(h, /mdi:battery/); assert.doesNotMatch(h, /mdi:bluetooth"/);
  assert.match(h, /<time class="sdt">/);
  const weak = page({ 'sensor.wall_tablet_wifi_signal': { state: '-80', attributes: {} } })._stChrome();
  assert.match(weak, /mdi:wifi-strength-1/);
  const off = page({ 'binary_sensor.wall_tablet_wifi': { state: 'off', attributes: {} } })._stChrome();
  assert.match(off, /mdi:wifi-off/);
});

test('studio chrome: no tablet entities -> no status icons, clock stays', () => {
  const h = page({ 'sensor.kitchen_temp': { state: '21', attributes: {} } })._stChrome();
  assert.doesNotMatch(h, /class="si /); assert.match(h, /<time class="sdt">/);
});

test('studio chrome is gated on cfg.studio; normal views render no chrome', () => {
  assert.match(src, /\$\{c\.studio \? this\._stChrome\(\) : ''\}/, 'status block only when studio');
  assert.match(src, /toggleAttribute\('studio', !!c\.studio\)/, 'host attribute follows cfg');
  assert.match(src, /const st = c\.studio && this\.getAttribute\('mode'\) !== 'phone' \? 1 : 0/, 'theme toggle only studio, not phone');
  const css = src.split('\n').filter((l) => /^:host\(\[studio\]/.test(l));
  assert.ok(css.length >= 5 && css.every((l) => l.startsWith(':host([studio]')), 'studio CSS is scoped to [studio]');
  assert.ok(/:host\(\[studio\]\[mode=phone\]\) \.sst/.test(src), 'rail theme/status hidden on phone');
  assert.match(src, /:host\(\[mode=wide\]\[wide-panel\]\) \.page\{[^}]*grid-template-columns:minmax\(0,1fr\)/, 'desktop uses single-column page grid');
  assert.match(src, /calc\(56u \+ 24px\)/, 'content starts at the rail edge plus the widget gap');
  assert.match(src, /const wd = mode === 'wide'/, 'wide mode always enables wide-panel layout');
  assert.doesNotMatch(src, /:host\(\[studio\]\[mode=wide\]:not\(\[wide-panel\]\)\)/, 'narrow studio panel layout removed');
  assert.match(src, /:host\(\[studio\]\[editing\]\) \.cw\{[^}]*height:auto/, 'edit lets the studio card grow and scroll');
  const edit = readFileSync(new URL('../../src/parts/hg-edit.part.js', import.meta.url), 'utf8');
  assert.match(edit, /_config\.studio\) \{ this\._eBar\(\); return; \}/, 'page edit chrome stays off the studio grid');
  assert.doesNotMatch(edit, /edit\.panel_width/, 'panel width picker removed from edit header');
  assert.match(src, /_syncScheme\(\)/, 'scheme mirrored on page host for studio glass tokens');
  assert.match(src, /:host\(\[studio\]\[data-hg-scheme=light\]\)/, 'studio light glass tokens');
  assert.match(src, /:host\(\[studio\]\[data-hg-scheme=dark\]\)/, 'studio dark glass tokens');
  assert.match(src, /_stMenuActs\(/, 'studio quick actions live in the user menu');
  assert.match(src, /_topQuickActs\(nCount, c\.studio\)/, 'studio hides top quick-action buttons');
  assert.match(src, /:host\(\[mode=wide\]\) \.rind\{ border-radius:10u/, 'desktop rail active pill is rounded square');
});
