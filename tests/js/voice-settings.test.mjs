/* Assist: ustawienia trybu głosowego (HGL.data.assist) – migracja starych danych, zapis bez wartości wyliczonych, przełączniki w panelu Ustawienia. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts } from './harness.mjs';

/* świeże HGAssistUI na każde wywołanie (instancja siedzi w window.__hgAssistUI) */
const mk = (assist, doc = {}) => {
  const win = { __hgL: { data: assist === undefined ? {} : { assist } }, addEventListener() {} };
  const HGL = { data: win.__hgL.data, editing: true, _ls() {}, save: async () => {} };
  const H = { icon: (i) => `[${i}]`, esc: (s) => String(s) };
  const { HGAssistUI } = loadParts(['hg-assist.part.js'], { window: win, document: doc, HGL, H, hgT: (k) => k }, ['HGAssistUI']);
  return { U: HGAssistUI, HGL };
};
/* panel Ustawienia bez Home Assistant: lista potoków się nie ładuje */
const page = () => { const p = { looks: 0, _eLook() { p.looks++; } }; return p; };
const sel = (k) => new RegExp(`data-k="${k}"`);

test('get: brak zapisu to pasek głosowy z odczytem, słuchaniem po otwarciu i dalszą rozmową', () => {
  for (const a of [undefined, {}, { mode: 'cokolwiek' }]) {
    const c = mk(a).U.get();
    assert.equal(c.mode, 'voice'); assert.equal(c.tts, true); assert.equal(c.listen, true); assert.equal(c.continue, true); assert.equal(c.mic, true);
  }
});

test('get: stare zapisy zostają uszanowane', () => {
  assert.equal(mk({ tts: false }).U.get().tts, false);
  assert.equal(mk({ mode: 'text' }).U.get().tts, false);
  assert.equal(mk({ mode: 'text', tts: true }).U.get().tts, true);
  const c = mk({ listen: false, continue: false, mic: false }).U.get();
  assert.equal(c.listen, false); assert.equal(c.continue, false); assert.equal(c.mic, false);
});

test('set: zapisuje tylko zmienione pola, nie wartości wyliczone', () => {
  const { U, HGL } = mk({ pipeline: 'p1' });
  U.set({ listen: false });
  assert.deepEqual(HGL.data.assist, { pipeline: 'p1', listen: false });
  U.set({ mode: 'text' });
  assert.equal(U.get().tts, false, 'odczyt nie został zapisany jako true w trybie głosowym');
});

test('cfg: karta w oknie dostaje tryb, odczyt i dalszą rozmowę', () => {
  const c = mk({ continue: false }).U.cfg();
  assert.equal(c.mode, 'voice'); assert.equal(c.tts, true); assert.equal(c.continue, false); assert.equal(c.embedded, true);
  assert.equal(mk({ mode: 'text' }).U.cfg().mode, 'text');
});

test('html: tryb głosowy pokazuje wybór wyglądu i przełączniki słuchania', () => {
  const h = mk({}).U.html(page());
  assert.match(h, /name="as-mode"/); assert.match(h, /<option value="voice" selected>/);
  assert.match(h, sel('listen')); assert.match(h, sel('continue')); assert.match(h, /assist\.mic_voice/);
  assert.match(h, /data-k="listen" aria-checked="true"/);
});

test('html: tryb czatu chowa przełączniki słuchania, mikrofon to dyktowanie', () => {
  const h = mk({ mode: 'text' }).U.html(page());
  assert.match(h, /<option value="text" selected>/);
  assert.doesNotMatch(h, sel('listen')); assert.doesNotMatch(h, sel('continue'));
  assert.match(h, /assist\.dictation_in_the_browser/); assert.doesNotMatch(h, /assist\.mic_voice/);
});

test('act: przełącznik continue zapisuje odwrotną wartość i odświeża panel', () => {
  const { U, HGL } = mk({}), p = page();
  U.act(p, { dataset: { k: 'continue' } }, 'as-tg');
  assert.equal(U.get().continue, false); assert.equal(HGL.data.assist.continue, false); assert.equal(p.looks, 1);
});

test('wire: zmiana wyglądu zapisuje tryb i przerysowuje panel', () => {
  const { U } = mk({}), p = page(), on = {};
  const el = (n) => ({ value: '', addEventListener: (t, f) => { on[n] = f; } });
  const els = { '[name=as-pipe]': el('pipe'), '[name=as-sug]': el('sug'), '[name=as-mode]': el('mode') };
  U.wire(p, { querySelector: (q) => els[q] || null });
  els['[name=as-mode]'].value = 'text'; on.mode();
  assert.equal(U.get().mode, 'text'); assert.equal(p.looks, 1);
});

test('bind: ukrycie karty zamyka pasek (mikrofon), okno czatu zostaje', () => {
  for (const [mode, want] of [['voice', 1], ['text', 0]]) {
    const doc = { hidden: false, on: {}, addEventListener(t, f) { this.on[t] = f; } }, { U } = mk({ mode }, doc);
    let closed = 0; U.close = () => { closed++; };
    U.bind({}, {}); U.bind({}, {});
    U.isOpen = true; doc.on.visibilitychange(); assert.equal(closed, 0, 'widoczna karta');
    doc.hidden = true; doc.on.visibilitychange(); assert.equal(closed, want, mode);
    U.isOpen = false; doc.on.visibilitychange(); assert.equal(closed, want, 'zamknięty');
  }
});
