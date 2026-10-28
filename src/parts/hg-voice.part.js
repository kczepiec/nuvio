/* ===== Asystent głosowy: czysta logika (bez DOM i bez Home Assistant). Wybór ścieżki, PCM 16 kHz, ramki binarne i reduktor zdarzeń
   assist_pipeline/run. Używa jej okno Assist (hg-assist.part.js), testy w tests/js/voice-core.test.mjs. ===== */
const HGVoice = {
  RATE: 16000,
  /* AudioWorklet (ładowany z Blob URL, bo paczka to jeden plik): zbiera próbki pierwszego kanału w paczki po 2048 (~43 ms przy 48 kHz) */
  TAP: 'hg-voice-tap',
  WORKLET: `class T extends AudioWorkletProcessor{constructor(){super();this.b=new Float32Array(2048);this.n=0}
process(i){const c=i[0]&&i[0][0];if(c)for(let k=0;k<c.length;k++){this.b[this.n++]=c[k];if(this.n===this.b.length){this.port.postMessage(this.b.slice(0));this.n=0}}return true}}
registerProcessor('hg-voice-tap',T);`,
  /* ścieżka mowy: strumień do potoku HA (wymaga HTTPS albo localhost, getUserMedia, AudioWorklet i silnika STT w potoku),
     potem rozpoznawanie przeglądarki (Web Speech API), na końcu samo pisanie */
  path: (o = {}) => (!o.mic ? 'text' : o.secure && o.media && o.worklet && o.stt ? 'stream' : o.sr ? 'speech' : 'text'),
  /* zmiana częstotliwości: w dół średnia z okna (prosty filtr przeciw aliasingowi), w górę interpolacja liniowa */
  downsample(x, from, to = HGVoice.RATE) {
    if (from === to) return Float32Array.from(x);
    const r = from / to, n = Math.round(x.length / r), y = new Float32Array(n);
    if (r < 1) { for (let i = 0; i < n; i++) { const p = i * r, a = Math.floor(p), b = Math.min(a + 1, x.length - 1); y[i] = x[a] + (x[b] - x[a]) * (p - a); } return y; }
    for (let i = 0; i < n; i++) { const a = Math.floor(i * r), b = Math.max(a + 1, Math.min(x.length, Math.floor((i + 1) * r))); let s = 0; for (let j = a; j < b; j++) s += x[j]; y[i] = s / (b - a); }
    return y;
  },
  toPcm16(x) { const y = new Int16Array(x.length); for (let i = 0; i < x.length; i++) { const v = Math.max(-1, Math.min(1, x[i])); y[i] = Math.round(v < 0 ? v * 32768 : v * 32767); } return y; },
  /* ramka dla stt_binary_handler_id: pierwszy bajt to handler, potem próbki Int16 little-endian (format potoku HA); pusta ramka kończy dźwięk */
  frame(id, pcm) { const b = new Uint8Array(1 + pcm.length * 2), v = new DataView(b.buffer); b[0] = id; for (let i = 0; i < pcm.length; i++) v.setInt16(1 + i * 2, pcm[i], true); return b; },
  endFrame: (id) => Uint8Array.of(id),
  /* głośność do animacji kuli (RMS, 0..1) */
  level(x) { if (!x.length) return 0; let s = 0; for (let i = 0; i < x.length; i++) s += x[i] * x[i]; return Math.min(1, Math.sqrt(s / x.length)); },
  /* wiadomość assist_pipeline/run: z text od etapu intent, bez text od stt (dźwięk ramkami) */
  runMsg({ text, tts, pipeline, cid } = {}) {
    return Object.assign({ type: 'assist_pipeline/run', start_stage: text != null ? 'intent' : 'stt', end_stage: tts ? 'tts' : 'intent',
      input: text != null ? { text } : { sample_rate: HGVoice.RATE }, conversation_id: cid || null }, pipeline ? { pipeline } : {});
  },
  /* stan jednego przebiegu; conversation_id przechodzi między przebiegami */
  init: ({ cid = null } = {}) => ({ phase: 'idle', handler: null, mic: false, voice: false, heard: '', reply: '', cid, tts: null, cont: false, err: null, done: false }),
  /* zdarzenia potoku HA plus własne: hg-start (mikrofon włączony, zanim potok odpowie), hg-spoken (koniec odtwarzania), hg-timeout;
     nieznane zwracają ten sam obiekt */
  reduce(s, e) {
    const d = (e && e.data) || {}, x = (p) => Object.assign({}, s, p);
    switch (e && e.type) {
      case 'hg-start': return Object.assign(HGVoice.init({ cid: s.cid }), { phase: 'listening', mic: true });
      case 'run-start': { const h = (d.runner_data || {}).stt_binary_handler_id, v = h != null;
        return Object.assign(HGVoice.init({ cid: s.cid }), { phase: v ? 'listening' : 'processing', handler: v ? h : null, mic: v }); }
      case 'stt-vad-start': return x({ voice: true });
      case 'stt-vad-end': return x({ phase: 'processing', mic: false });
      case 'stt-end': return x({ phase: 'processing', mic: false, heard: ((d.stt_output || {}).text || '').trim() });
      case 'intent-start': return x({ phase: 'processing', mic: false });
      case 'intent-end': { const o = d.intent_output || {};
        return x({ reply: ((((o.response || {}).speech || {}).plain || {}).speech) || '', cid: o.conversation_id || s.cid, cont: o.continue_conversation === true }); }
      case 'tts-end': { const u = (d.tts_output || {}).url || null; return x({ tts: u, phase: u ? 'speaking' : s.phase }); }
      case 'run-end': return x({ done: true, phase: s.phase === 'error' ? 'error' : s.tts ? 'speaking' : 'idle' });
      /* błąd odczytu (tts-*) po gotowej odpowiedzi: odpowiedź jest, tylko bez dźwięku */
      case 'error': if (s.reply && /^tts-/.test(d.code || '')) return x({ phase: 'idle', mic: false, done: true });
        return x({ phase: 'error', mic: false, done: true, err: { code: d.code || 'error', message: d.message || '' } });
      case 'hg-timeout': return x({ phase: 'error', mic: false, done: true, err: { code: 'timeout', message: 'timeout' } });
      case 'hg-spoken': return s.phase === 'speaking' ? x({ phase: 'idle' }) : s;
      default: return s;
    }
  },
  /* słuchać dalej po odpowiedzi: asystent dopytuje (continue_conversation), przebieg udany, ustawienie włączone */
  again: (s, o = {}) => !!(o.continue && s.done && !s.err && s.cont),
  /* rodzaj błędu przebiegu do komunikatu: nic nie słychać, połączenie z HA, mikrofon, reszta (błąd potoku) */
  errKind: (e) => { const c = (e && e.code) || ''; return c === 'stt-no-text-recognized' ? 'nothing' : c === 'connect' || c === 'timeout' ? 'connect' : c === 'mic' ? 'mic' : 'other'; },
  /* błąd getUserMedia po nazwie: odmowa, brak urządzenia, zajęty przez inną aplikację; reszta to awaria dźwięku (zapas: rozpoznawanie przeglądarki) */
  micKind: (n) => (/^(NotAllowed|Security|PermissionDenied)Error$/.test(n || '') ? 'denied' : /^(NotFound|Overconstrained|DevicesNotFound)Error$/.test(n || '') ? 'missing'
    : /^(NotReadable|TrackStart|Abort)Error$/.test(n || '') ? 'busy' : 'audio'),
  /* błąd Web Speech API (SpeechRecognitionErrorEvent.error); aborted to nasze przerwanie, bez komunikatu */
  speechKind: (e) => (e === 'aborted' ? null : e === 'no-speech' ? 'nothing' : /not-allowed$/.test(e || '') ? 'denied' : e === 'audio-capture' ? 'missing' : 'failed'),
  ttsUrl: (u, h) => (!u ? null : /^https?:/.test(u) || !h || !h.hassUrl ? u : h.hassUrl(u)),
};
