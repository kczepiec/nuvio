/* Asystent głosowy: czysta logika (wybór ścieżki, PCM, ramki binarne, wiadomości potoku, reduktor zdarzeń assist_pipeline/run). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadParts } from './harness.mjs';

const { HGVoice: V } = loadParts(['hg-voice.part.js'], {}, ['HGVoice']);

/* przebieg zdarzeń przez reduktor, od stanu początkowego */
const run = (evs, s = V.init()) => evs.reduce((a, e) => V.reduce(a, e), s);
const ev = (type, data = {}) => ({ type, data });
const intent = (speech, extra = {}) => ev('intent-end', { intent_output: Object.assign({ response: { speech: { plain: { speech } } }, conversation_id: 'c1' }, extra) });

test('build.py: hg-voice jest w PAGE tuż przed hg-assist, który go używa', () => {
  const page = readFileSync(new URL('../../tools/build.py', import.meta.url), 'utf8').split('\n').find((l) => l.startsWith('PAGE = '));
  assert.ok(page.includes("'hg-voice.part.js', 'hg-assist.part.js'"));
});

test('path: strumień tylko w bezpiecznym kontekście z mikrofonem, workletem i silnikiem STT', () => {
  const all = { mic: true, secure: true, media: true, worklet: true, stt: true, sr: true };
  assert.equal(V.path(all), 'stream');
  for (const k of ['secure', 'media', 'worklet', 'stt']) assert.equal(V.path(Object.assign({}, all, { [k]: false })), 'speech', k);
  assert.equal(V.path(Object.assign({}, all, { secure: false, sr: false })), 'text');
  assert.equal(V.path(Object.assign({}, all, { mic: false })), 'text');
  assert.equal(V.path({}), 'text');
});

test('downsample: 48 kHz -> 16 kHz uśrednia trójki, ta sama częstotliwość kopiuje', () => {
  const x = Float32Array.from([0, 0.3, 0.6, 1, 1, 1, -1, -0.5, 0]);
  assert.deepEqual([...V.downsample(x, 48000, 16000)].map((v) => +v.toFixed(4)), [0.3, 1, -0.5]);
  const same = V.downsample(x, 16000, 16000);
  assert.deepEqual([...same], [...x]); assert.notEqual(same, x);
  assert.equal(V.downsample(new Float32Array(44100), 44100, 16000).length, 16000);
  assert.equal(V.downsample(new Float32Array(0), 48000, 16000).length, 0);
});

test('downsample: niższa częstotliwość wejścia jest interpolowana liniowo', () => {
  const y = V.downsample(Float32Array.from([0, 1]), 8000, 16000);
  assert.equal(y.length, 4); assert.deepEqual([...y.slice(0, 3)], [0, 0.5, 1]);
});

test('toPcm16: przycina do [-1, 1] i skaluje do Int16', () => {
  assert.deepEqual([...V.toPcm16(Float32Array.from([0, 1, -1, 2, -2, 0.5]))], [0, 32767, -32768, 32767, -32768, 16384]);
});

test('frame: pierwszy bajt to handler, potem Int16 little-endian; endFrame to sam handler', () => {
  assert.deepEqual([...V.frame(7, Int16Array.from([1, -2, 256]))], [7, 1, 0, 0xfe, 0xff, 0, 1]);
  assert.deepEqual([...V.endFrame(7)], [7]);
});

test('level: RMS w zakresie 0..1', () => {
  assert.equal(V.level(new Float32Array(4)), 0);
  assert.equal(V.level(Float32Array.from([1, -1, 1, -1])), 1);
  assert.equal(+V.level(Float32Array.from([0.5, -0.5])).toFixed(4), 0.5);
  assert.equal(V.level(new Float32Array(0)), 0);
});

test('runMsg: głos od stt do tts (albo intent), potok i rozmowa tylko gdy są', () => {
  assert.deepEqual(V.runMsg({ tts: true }), { type: 'assist_pipeline/run', start_stage: 'stt', end_stage: 'tts', input: { sample_rate: 16000 }, conversation_id: null });
  assert.deepEqual(V.runMsg({ tts: false, pipeline: 'p1', cid: 'c9' }), { type: 'assist_pipeline/run', start_stage: 'stt', end_stage: 'intent', input: { sample_rate: 16000 }, conversation_id: 'c9', pipeline: 'p1' });
  assert.deepEqual(V.runMsg({ text: 'Która godzina?', tts: true, pipeline: '' }), { type: 'assist_pipeline/run', start_stage: 'intent', end_stage: 'tts', input: { text: 'Która godzina?' }, conversation_id: null });
});

test('reduce: pełny przebieg głosowy z odczytem odpowiedzi', () => {
  let s = V.reduce(V.init(), ev('run-start', { runner_data: { stt_binary_handler_id: 3 } }));
  assert.equal(s.phase, 'listening'); assert.equal(s.handler, 3); assert.equal(s.mic, true);
  s = V.reduce(s, ev('stt-vad-start')); assert.equal(s.voice, true); assert.equal(s.phase, 'listening');
  s = V.reduce(s, ev('stt-vad-end')); assert.equal(s.phase, 'processing'); assert.equal(s.mic, false);
  s = V.reduce(s, ev('stt-end', { stt_output: { text: 'Zapal światło' } })); assert.equal(s.heard, 'Zapal światło');
  s = V.reduce(s, intent('Zapalone')); assert.equal(s.reply, 'Zapalone'); assert.equal(s.cid, 'c1'); assert.equal(s.cont, false);
  s = V.reduce(s, ev('tts-end', { tts_output: { url: '/api/tts_proxy/x.mp3' } })); assert.equal(s.tts, '/api/tts_proxy/x.mp3'); assert.equal(s.phase, 'speaking');
  s = V.reduce(s, ev('run-end')); assert.equal(s.done, true); assert.equal(s.phase, 'speaking');
  s = V.reduce(s, { type: 'hg-spoken' }); assert.equal(s.phase, 'idle');
});

test('reduce: hg-start czyści poprzedni przebieg, zostawia rozmowę i od razu słucha', () => {
  const prev = run([intent('Stara odpowiedź'), ev('error', { code: 'x' })], V.init({ cid: 'c0' }));
  const s = V.reduce(prev, { type: 'hg-start' });
  assert.equal(s.phase, 'listening'); assert.equal(s.mic, true); assert.equal(s.reply, ''); assert.equal(s.err, null); assert.equal(s.done, false); assert.equal(s.cid, 'c1');
  const r = V.reduce(s, ev('run-start', { runner_data: { stt_binary_handler_id: 4 } })); assert.equal(r.handler, 4); assert.equal(r.cid, 'c1');
});

test('WORKLET: rejestruje procesor TAP i wysyła paczki po 2048 próbek', () => {
  let reg = null; const posted = [];
  class AudioWorkletProcessor { constructor() { this.port = { postMessage: (m) => posted.push(m) }; } }
  new Function('AudioWorkletProcessor', 'registerProcessor', V.WORKLET)(AudioWorkletProcessor, (n, c) => { reg = [n, c]; });
  assert.equal(reg[0], V.TAP);
  const p = new reg[1](), blk = new Float32Array(128).fill(0.25);
  for (let i = 0; i < 16; i++) assert.equal(p.process([[blk]]), true);
  assert.equal(posted.length, 1); assert.equal(posted[0].length, 2048); assert.equal(posted[0][2047], 0.25);
  assert.equal(p.process([[]]), true); assert.equal(p.process([]), true);
});

test('reduce: przebieg tekstowy bez tts kończy się w idle, rozmowa przechodzi dalej', () => {
  const s = run([ev('run-start', { runner_data: {} }), ev('intent-start'), intent('Jest 12:00'), ev('run-end')], V.init({ cid: 'old' }));
  assert.equal(s.phase, 'idle'); assert.equal(s.handler, null); assert.equal(s.mic, false); assert.equal(s.reply, 'Jest 12:00'); assert.equal(s.cid, 'c1'); assert.equal(s.done, true);
  assert.equal(V.init({ cid: 'old' }).cid, 'old');
});

test('reduce: brak conversation_id w odpowiedzi zostawia poprzedni', () => {
  const s = run([ev('intent-end', { intent_output: { response: { speech: { plain: { speech: 'ok' } } } } })], V.init({ cid: 'keep' }));
  assert.equal(s.cid, 'keep');
});

test('reduce: błąd zatrzymuje mikrofon i kończy przebieg', () => {
  const s = run([ev('run-start', { runner_data: { stt_binary_handler_id: 1 } }), ev('error', { code: 'stt-no-text-recognized', message: 'No text recognized' })]);
  assert.equal(s.phase, 'error'); assert.equal(s.mic, false); assert.equal(s.done, true);
  assert.deepEqual(s.err, { code: 'stt-no-text-recognized', message: 'No text recognized' });
  const t = V.reduce(V.init(), { type: 'hg-timeout' }); assert.equal(t.phase, 'error'); assert.equal(t.err.code, 'timeout');
});

test('reduce: nieznane zdarzenie nie zmienia stanu, stan wejściowy nie jest mutowany', () => {
  const s0 = V.init(); assert.equal(V.reduce(s0, ev('intent-progress', { chat_log_delta: {} })), s0);
  const s1 = V.reduce(s0, ev('run-start', { runner_data: { stt_binary_handler_id: 2 } }));
  assert.equal(s0.phase, 'idle'); assert.equal(s0.handler, null); assert.notEqual(s1, s0);
});

test('again: słucha dalej tylko po udanym przebiegu, gdy asystent pyta i ustawienie pozwala', () => {
  const asks = run([intent('Który pokój?', { continue_conversation: true }), ev('run-end')]);
  assert.equal(asks.cont, true);
  assert.equal(V.again(asks, { continue: true }), true);
  assert.equal(V.again(asks, { continue: false }), false);
  assert.equal(V.again(run([intent('OK'), ev('run-end')]), { continue: true }), false);
  assert.equal(V.again(Object.assign({}, asks, { done: false }), { continue: true }), false);
  assert.equal(V.again(Object.assign({}, asks, { err: { code: 'x' } }), { continue: true }), false);
});

test('ttsUrl: względny adres przez hassUrl, pełny bez zmian', () => {
  const h = { hassUrl: (p) => 'https://ha.local' + p };
  assert.equal(V.ttsUrl('/api/tts_proxy/a.mp3', h), 'https://ha.local/api/tts_proxy/a.mp3');
  assert.equal(V.ttsUrl('https://cdn.x/a.mp3', h), 'https://cdn.x/a.mp3');
  assert.equal(V.ttsUrl('/api/a.mp3', {}), '/api/a.mp3');
  assert.equal(V.ttsUrl(null, h), null);
});

test('reduce: błąd tts po odpowiedzi to sukces bez dźwięku, błąd tts bez odpowiedzi zostaje błędem', () => {
  const ok = run([ev('run-start', { runner_data: {} }), intent('Zapalone'), ev('error', { code: 'tts-failed', message: 'x' })]);
  assert.equal(ok.err, null); assert.equal(ok.done, true); assert.equal(ok.phase, 'idle'); assert.equal(ok.reply, 'Zapalone');
  assert.equal(V.again(Object.assign({}, ok, { cont: true }), { continue: true }), true);
  const bad = run([ev('run-start', { runner_data: {} }), ev('error', { code: 'tts-failed', message: 'x' })]);
  assert.equal(bad.phase, 'error'); assert.equal(bad.err.code, 'tts-failed');
  const other = run([intent('Zapalone'), ev('error', { code: 'intent-failed' })]);
  assert.equal(other.phase, 'error');
});

test('errKind: nic nie słychać, połączenie, mikrofon, reszta', () => {
  assert.equal(V.errKind({ code: 'stt-no-text-recognized' }), 'nothing');
  for (const c of ['connect', 'timeout']) assert.equal(V.errKind({ code: c }), 'connect', c);
  assert.equal(V.errKind({ code: 'mic' }), 'mic');
  for (const c of ['intent-failed', 'stt-stream-failed', 'error']) assert.equal(V.errKind({ code: c }), 'other', c);
  assert.equal(V.errKind(null), 'other');
});

test('micKind: odmowa, brak urządzenia, zajęty, reszta to awaria dźwięku', () => {
  for (const n of ['NotAllowedError', 'SecurityError', 'PermissionDeniedError']) assert.equal(V.micKind(n), 'denied', n);
  for (const n of ['NotFoundError', 'OverconstrainedError', 'DevicesNotFoundError']) assert.equal(V.micKind(n), 'missing', n);
  for (const n of ['NotReadableError', 'TrackStartError', 'AbortError']) assert.equal(V.micKind(n), 'busy', n);
  for (const n of ['Error', 'TypeError', '', undefined]) assert.equal(V.micKind(n), 'audio', String(n));
});

test('speechKind: błędy rozpoznawania przeglądarki', () => {
  assert.equal(V.speechKind('no-speech'), 'nothing');
  for (const e of ['not-allowed', 'service-not-allowed']) assert.equal(V.speechKind(e), 'denied', e);
  assert.equal(V.speechKind('audio-capture'), 'missing');
  assert.equal(V.speechKind('aborted'), null);
  for (const e of ['network', 'language-not-supported', 'bad-grammar']) assert.equal(V.speechKind(e), 'failed', e);
});
