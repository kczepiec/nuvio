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
  vm.runInContext('class P { constructor(){ this._hass = { states: ' + JSON.stringify(states) + ', locale: { time_format: "24" } }; }\n' + method('_stDev') + '\n' + method('_stChrome') + '\n}\nglobalThis.P = P;', ctx);
  return new ctx.P();
}

test('studio chrome: status icons only for existing tablet entities, date + time always', () => {
  const p = page({
    'sensor.wall_tablet_battery_level': { state: '87', attributes: { device_class: 'battery' } },
    'binary_sensor.wall_tablet_wifi': { state: 'on', attributes: {} },
  });
  const h = p._stChrome();
  assert.match(h, /class="sst"/);
  assert.match(h, /class="si wf"/); assert.match(h, /mdi:battery-90/); assert.doesNotMatch(h, /class="si bt"/);
  assert.match(h, /<time class="sdt">/);
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
});
