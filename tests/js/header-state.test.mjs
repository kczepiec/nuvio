/* header-state.test.mjs
   Runs the real HGPage._headState and _headEnts code (cut from hg-page.part.js) against a fake hass,
   so the {state:entity} header placeholder is tested, not only the source text. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../../src/parts/hg-page.part.js', import.meta.url), 'utf8');

function method(name) {
  const re = new RegExp('\\n  ' + name + '\\([^)]*\\) \\{');
  const m = re.exec(src);
  assert.ok(m, name + ' must exist in hg-page.part.js');
  let i = m.index + m[0].length - 1, depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  return src.slice(m.index + 1, i + 1);
}

function harness({ states = {}, head = {} } = {}) {
  const body = 'class P { constructor(){ this._hass = { states: ' + JSON.stringify(states) + ' }; }\n' +
    '  _headConf(){ return ' + JSON.stringify(head) + '; }\n' +
    method('_headState') + '\n' + method('_headEnts') + '\n}\nglobalThis.P = P;';
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(body, ctx);
  return new ctx.P();
}

test('_headState: running washer shows its state', () => {
  const p = harness({ states: { 'sensor.pralka': { state: 'running' } } });
  assert.equal(p._headState('sensor.pralka'), 'running');
  assert.equal(p._headStateEmpty, undefined);
});

test('_headState: off, unavailable, unknown and missing entity give empty and flag the line', () => {
  for (const st of ['off', 'unavailable', 'unknown', '']) {
    const p = harness({ states: { 'sensor.pralka': { state: st } } });
    assert.equal(p._headState('sensor.pralka'), '', 'state ' + st);
    assert.equal(p._headStateEmpty, true, 'flag for ' + st);
  }
  const p = harness({ states: {} });
  assert.equal(p._headState('sensor.brak'), '');
  assert.equal(p._headStateEmpty, true);
});

test('_headEnts: collects every {state:...} entity from the header config, once', () => {
  const p = harness({ head: { t: 'Hi {name}', s: '{state:sensor.pralka} · {state:sensor.pralka}', sm: '{state:sensor.suszarka}', i: 'mdi:x', sz: { wide: 'l' } } });
  assert.deepEqual([...p._headEnts()].sort(), ['sensor.pralka', 'sensor.suszarka']);
});

test('_headEnts: no placeholder means no entities to watch', () => {
  const p = harness({ head: { t: '{name}', s: '{time}' } });
  assert.equal(p._headEnts().length, 0);
});
