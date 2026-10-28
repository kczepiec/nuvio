/* --- Assist: rozmowa z Home Assistant Assist w szklanej karcie, odpowiedź w dymkach na miejscu ---
   tekst -> assist_pipeline/run (intent, opcjonalnie tts) albo conversation/process; conversation_id ciągnie rozmowę;
   w oknie (embedded) domyślnie widok głosowy (mode: 'voice'): kula, stan, co usłyszał, odpowiedź; dźwięk strumieniem do potoku HA od etapu stt
   (logika w hg-voice.part.js), w zapasie rozpoznawanie przeglądarki (Web Speech API), na końcu pisanie. mode: 'text' to dawny czat z dymkami.
   window.__hgDryRun: odpowiedź próbna, bez wysyłania i bez mikrofonu. */
/* ostatnio wybrany model (potok Assist) na tym urządzeniu; w oknie Assist zapisuje się też w ustawieniach (HGAssistUI.set) */
const hgAssistPipe = (v) => { try { if (v === undefined) return localStorage.getItem('home-glass:assist-pipe') || ''; localStorage.setItem('home-glass:assist-pipe', v || ''); } catch (e) { return ''; } };
class HGAssistCard extends HGBase {
  defaults() { return { title: null, pipeline: null, tts: false, mic: true, show_pipeline: true, suggestions: null, placeholder: null, min_h: 320, mode: 'text', continue: true }; }
  ents() { return []; }
  css() { if (!this._config.embedded) return HG_G14_CSS + U(`ha-card.glass{ padding:10px; min-height:0; justify-content:center; }
.lg{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:10px; width:100%; padding:8px 10px; border-radius:var(--r-md); transition:background .15s; } .lg:hover{ background:color-mix(in srgb, currentColor 7%, transparent); }
.lg:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; } .lg .gn{ flex:1; min-width:0; } .lg .gic{ flex:none; }`);
    return HG_G14_CSS + U(`:host{ display:block; height:100%; }
ha-card.glass{ height:100%; min-height:0 !important; padding:16px; gap:12px; background:transparent !important; box-shadow:none !important; -webkit-backdrop-filter:none !important; backdrop-filter:none !important; border-radius:0; color:inherit; }
.hd2{ display:flex; align-items:center; gap:10px; min-width:0; } .hd2 .gn{ flex:1 1 auto; min-width:0; } .hd2 .gn small{ opacity:.7; transition:opacity var(--hg-t-base) var(--hg-ease-out); }
.hd2 .gic.on{ box-shadow:0 0 16px var(--hg-accent-glow); } .hd2 .gb.r{ width:40px; height:40px; } .hd2 .gb.r ha-icon{ width:20px; height:20px; --mdc-icon-size:20px; }
.cv{ flex:1; min-height:120px; overflow:auto; display:flex; flex-direction:column; gap:8px; padding:2px 2px 6px; scroll-behavior:smooth; overscroll-behavior:contain; }
.b{ max-width:84%; padding:10px 14px; border-radius:var(--r-lg); font-size:var(--hg-fs-3, 14px); line-height:1.45; overflow-wrap:anywhere; animation:bin var(--hg-t-slow) var(--hg-spring) both; }
.b.u{ align-self:flex-end; background:var(--hg-accent); color:var(--hg-on-accent); box-shadow:0 0 14px var(--hg-accent-glow); border-bottom-right-radius:8px; font-weight:500; transform-origin:100% 100%; }
.b.a{ align-self:flex-start; background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); border-bottom-left-radius:8px; transform-origin:0 100%; }
.b.e{ color:var(--hg-warn); background:color-mix(in srgb, var(--hg-warn) 12%, var(--hg-inner-bg)); }
:is(.b, .rp) .pl{ all:unset; cursor:pointer; margin-left:6px; vertical-align:-3px; color:var(--hg-accent-tx, var(--hg-accent)); transition:transform var(--hg-t-fast) var(--hg-ease-out); } :is(.b, .rp) .pl:active{ transform:scale(.9); }
:is(.b, .rp) .pl ha-icon{ width:16px; height:16px; } :is(.b, .rp) .pl:focus-visible{ outline:2px solid var(--hg-accent); border-radius:6px; }
.ty{ display:inline-flex; gap:4px; padding:3px 0; } .ty i{ width:7px; height:7px; border-radius:50%; background:var(--hg-accent); animation:var(--hg-loop, dot 1s var(--hg-ease-out) infinite); } .ty i:nth-child(2){ animation-delay:.15s; } .ty i:nth-child(3){ animation-delay:.3s; }
@keyframes dot{ 0%, 100%{ transform:translateY(0); opacity:.35; } 50%{ transform:translateY(-3px); opacity:1; } }
@keyframes bin{ from{ opacity:0; transform:translateY(8px) scale(.94); } }
@keyframes rise{ from{ opacity:0; transform:translateY(6px); } }
.em{ margin:auto; text-align:center; font-size:var(--hg-fs-2, 13px); display:flex; flex-direction:column; align-items:center; gap:6px; padding:8px; animation:rise var(--hg-t-slow) var(--hg-ease-out) both; }
.em span{ opacity:.7; } .em b{ font-size:var(--hg-fs-4, 17px); font-weight:600; }
.em .gic{ width:56px; height:56px; margin-bottom:4px; box-shadow:0 0 22px var(--hg-accent-glow); } .em .gic ha-icon{ width:28px; height:28px; --mdc-icon-size:28px; }
.sg{ display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; padding:2px; margin:0 -2px; } .sg::-webkit-scrollbar{ display:none; }
.sg button{ all:unset; cursor:pointer; flex:none; font-size:var(--hg-fs-2, 13px); padding:8px 14px; border-radius:999px; background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); white-space:nowrap;
  transition:background var(--hg-t-base) var(--hg-ease-out), color var(--hg-t-base) var(--hg-ease-out), transform var(--hg-t-fast) var(--hg-ease-out); animation:rise var(--hg-t-slow) var(--hg-ease-out) both; animation-delay:calc(var(--i, 0) * var(--hg-t-stagger, 30ms)); }
@media (hover:hover) and (pointer:fine){ .sg button:hover{ background:var(--hg-accent-soft); color:var(--hg-accent-tx, inherit); } }
.sg button:active{ transform:scale(.96); } .sg button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.inp{ display:flex; align-items:center; gap:4px; padding:4px; border-radius:999px; background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); transition:box-shadow var(--hg-t-base) var(--hg-ease-out); }
.inp:focus-within{ box-shadow:var(--hg-inner-hi), 0 0 0 2px var(--hg-accent), 0 0 18px var(--hg-accent-glow); }
.inp input{ all:unset; flex:1 1 auto; min-width:60px; font-size:var(--hg-fs-3, 14px); padding:0 12px; height:40px; } .inp input::placeholder{ color:inherit; opacity:.6; }
:is(.inp, .vb) .ps{ flex:0 1 auto; min-width:0; max-width:min(38%, 170px); }
:is(.inp, .vb) .ps .hgs-t{ min-height:32px; height:32px; padding:0 8px 0 12px; gap:4px; border:0; border-radius:999px; font-size:var(--hg-fs-1, 12px); font-weight:500; background:transparent; box-shadow:none; opacity:.8; }
:is(.inp, .vb) .ps .hgs-t:hover{ background:var(--hg-inner-bg-h); opacity:1; } :is(.inp, .vb) .ps .hgs-t[aria-expanded=true], :is(.inp, .vb) .ps .hgs-t:focus-visible{ opacity:1; background:var(--hg-accent-soft); box-shadow:none; }
:is(.inp, .vb) .ps .hgs-v{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } :is(.inp, .vb) .ps .hgs-c{ width:16px; height:16px; }
:is(.inp, .vb) .ps select{ max-width:100%; }
.inp .gb.r{ width:40px; height:40px; } .inp .gb.r ha-icon{ width:20px; height:20px; --mdc-icon-size:20px; }
.inp .gb.r.ok{ background:var(--hg-accent); color:var(--hg-on-accent); box-shadow:0 0 12px var(--hg-accent-glow); transition:transform var(--hg-t-fast) var(--hg-ease-out), opacity var(--hg-t-base); }
.inp .gb.r.ok:disabled{ opacity:.45; box-shadow:none; }
.mic{ transition:background var(--hg-t-base) var(--hg-ease-out), color var(--hg-t-base) var(--hg-ease-out); }
.mic.on{ background:var(--hg-accent) !important; color:var(--hg-on-accent) !important; animation:var(--hg-loop, pul 1.2s var(--hg-ease-out) infinite); }
@keyframes pul{ 0%, 100%{ box-shadow:0 0 0 0 var(--hg-accent-glow); } 50%{ box-shadow:0 0 0 8px transparent; } }
.gb.r.on{ background:var(--hg-accent-soft); color:var(--hg-accent-tx, inherit); }
/* widok głosowy: pasek jak powiadomienie, fale w kolorze akcentu i to, co usłyszał, w cudzysłowie, pod spodem odpowiedź; --lv (0..1) to głośność mikrofonu */
ha-card.glass.vo{ height:auto; padding:16px 16px 16px 24px; gap:12px; }
.vr{ display:flex; align-items:center; gap:20px; min-height:64px; }
.wv{ all:unset; box-sizing:border-box; cursor:pointer; flex:none; display:flex; align-items:center; justify-content:center; gap:5px; width:64px; height:56px; border-radius:16px; color:var(--hg-accent); }
.wv:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:4px; }
.wv i{ width:6px; height:6px; border-radius:3px; background:currentColor; box-shadow:0 0 10px var(--hg-accent-glow); transition:height 420ms var(--hg-spring, cubic-bezier(.2,1.2,.3,1)), color var(--hg-t-base) var(--hg-ease-out); }
.vo[data-ph=listening] .wv i{ transition-duration:110ms; transition-timing-function:linear; }   /* za głosem, bez opóźnienia */
.vo[data-ph=listening] .wv i{ height:calc(12px + var(--lv, 0) * var(--k) * 36px); animation:var(--hg-loop, wvs 1.2s ease-in-out infinite alternate); animation-delay:calc(var(--j) * 110ms); }
.vo[data-ph=processing] .wv{ cursor:default; } .vo[data-ph=processing] .wv i{ height:24px; animation:var(--hg-loop, wvp 1s var(--hg-ease-out) infinite); animation-delay:calc(var(--j) * 120ms); }
.vo[data-ph=speaking] .wv i{ height:calc(var(--k) * 36px); animation:var(--hg-loop, wvs .9s ease-in-out infinite alternate); animation-delay:calc(var(--j) * 90ms); }
.vo[data-ph=error] .wv{ color:var(--hg-warn); } .vo[data-ph=error] .wv i{ box-shadow:none; }
@keyframes wvp{ 0%, 100%{ transform:scaleY(.3); opacity:.5; } 50%{ transform:scaleY(1); opacity:1; } }
@keyframes wvs{ from{ transform:scaleY(.55); } to{ transform:scaleY(1); } }
.vt{ flex:1; min-width:0; display:flex; flex-direction:column; gap:4px; } .vt p{ margin:0; overflow-wrap:anywhere; }
.vt .hr, .vt .ps{ font-size:clamp(18px, 2.2vw, 26px); font-weight:500; line-height:1.25; } .vt .ps{ opacity:.6; animation:tin var(--hg-t-slow) var(--hg-ease-out) both; }
/* słowa wchodzą po kolei (klucz = numer słowa, więc przy dyktowaniu animuje się tylko nowe), odpowiedź rozsuwa pasek */
.vt .w{ display:inline-block; white-space:pre; animation:tin 420ms var(--hg-ease-out) both; animation-delay:calc(min(var(--d, 0), 24) * 32ms); }
.vt .rp{ animation:grow 420ms var(--hg-ease-out) both; overflow:hidden; }
@keyframes tin{ from{ opacity:0; transform:translateY(6px); filter:blur(4px); } }
@keyframes grow{ from{ max-height:0; opacity:0; } to{ max-height:240px; } }
.vt .rp{ font-size:var(--hg-fs-3, 15px); line-height:1.45; opacity:.8; } .vt .rp.e, .vt .nt{ color:var(--hg-warn); opacity:1; }
.vt .nt{ font-size:var(--hg-fs-2, 13px); }
@media (max-width: 600px){ ha-card.glass.vo{ padding:12px 16px 12px 12px; } .vr{ gap:10px; min-height:52px; } .wv{ width:44px; gap:4px; } .wv i{ width:5px; } }
@media (prefers-reduced-motion: reduce){ .b, .ty i, .mic.on, .sg button, .em, .wv i, .vt .rp, .vt .ps, .vt .w{ animation:none !important; } .wv i{ transition:none; } .cv{ scroll-behavior:auto; } }
@container (max-width: 360px){ :is(.inp, .vb) .ps{ max-width:96px; } .b{ max-width:92%; font-size:13px; } }`); }
  setConfig(c) { super.setConfig(c); this._msgs = this._msgs || []; }
  _sugg() { const s = this._config.suggestions; return Array.isArray(s) && s.length ? s : typeof s === 'string' && s.trim() ? s.split(',').map((x) => x.trim()).filter(Boolean)
    : [hgT('cards.assist.what_is_the_temperature'), hgT('cards.assist.which_lights_are_on'), hgT('cards.assist.what_will_the_weather'), hgT('cards.assist.what_time_is_it')]; }
  /* lista potoków raz na kartę; obietnica, bo widok głosowy czeka na nią przed wyborem ścieżki mowy (silnik STT potoku) */
  _pipes() { const h = this._hass; if (this._pl || !h || !h.callWS) return Promise.resolve();
    return this._plP || (this._plP = h.callWS({ type: 'assist_pipeline/pipeline/list' }).then((r) => { this._pl = (r && r.pipelines) || []; this._pref = r && r.preferred_pipeline; }).catch(() => { this._pl = []; })
      .then(() => { this._plP = null; this.rerender(); })); }
  render() { const c = this._config, h = this._hass, M = this._msgs || [];
    if (!c.embedded) return `<ha-card class="glass"><button class="lg" data-act="open" aria-haspopup="dialog" aria-label="${hgT('common.open_assist')}"><span class="gic on">${H.icon('mdi:microphone-message')}</span><span class="gn"><b id="as-t">${H.esc(c.title || c.name || hgT('cards.assist.default_title'))}</b><small>${hgT('cards.assist.ask_or_give_a')}</small></span>${H.icon('mdi:chevron-right')}</button></ha-card>`;
    if (!this._pl) setTimeout(() => this._pipes(), 0);
    if (this._pipe == null && this._pl) { const m = hgAssistPipe(); this._pipe = m && this._pl.some((p) => p.id === m) ? m : ''; }   // zapamiętany model (to urządzenie)
    const cur = this._pipe || c.pipeline || this._pref || '', SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const sel = c.show_pipeline !== false && this._pl && this._pl.length > 1 ? `<span class="ps" title="${H.esc((this._pl.find((p) => p.id === cur) || {}).name || '')}"><select data-k="pipe" aria-label="${hgT('cards.assist.assistant_model')}">${this._pl.map((p) => `<option value="${H.esc(p.id)}"${p.id === cur ? ' selected' : ''}>${H.esc(p.name)}</option>`).join('')}</select></span>` : '';
    if (c.mode !== 'text') return this._rv(sel);
    const bub = this._bub(M);
    return `<ha-card class="glass"><div class="hd2"><span class="gic on">${H.icon('mdi:microphone-message')}</span><span class="gn"><b>${H.esc(c.title || c.name || hgT('cards.assist.default_title'))}</b><small>${this._busy2 ? hgT('cards.assist.thinking') : hgT('cards.assist.ask_or_give_a')}</small></span>${M.length ? `<button class="gb r" data-act="clr" aria-label="${hgT('cards.assist.new_conversation')}" title="${hgT('cards.assist.new_conversation')}">${H.icon('mdi:restore')}</button>` : ''}<button class="gb r x" data-act="close" aria-label="${hgT('common.close')}" title="${hgT('common.close')}">${H.icon('mdi:close')}</button></div>
      <div class="cv" role="log" aria-label="${hgT('cards.assist.conversation_with_the_assistant')}">${bub || `<div class="em"><span class="gic on">${H.icon('mdi:chat-processing-outline')}</span><b>${hgT('cards.assist.talk_to_your_home')}</b><span>${hgT('cards.assist.type_a_question_or')}</span></div>`}</div>
      <div class="sg" role="list">${this._sugg().map((s, i) => `<button role="listitem" data-act="sug" data-t="${H.esc(s)}" style="--i:${i}">${H.esc(s)}</button>`).join('')}</div>
      <form class="inp" data-k="f"><input data-k="q" type="text" enterkeyhint="send" autocomplete="off" placeholder="${H.esc(c.placeholder || hgT('cards.assist.message_the_assistant'))}" aria-label="${hgT('cards.assist.message')}" value="${H.esc(this._draft || '')}">${sel}
        ${c.mic !== false && SR ? `<button type="button" class="gb r mic${this._rec ? ' on' : ''}" data-act="mic" aria-pressed="${!!this._rec}" aria-label="${hgT('cards.assist.speak')}">${H.icon('mdi:microphone')}</button>` : ''}
        <button type="submit" class="gb r ok" data-act="send" aria-label="${hgT('cards.assist.send')}"${this._busy2 ? ' disabled' : ''}>${H.icon('mdi:send')}</button></form></ha-card>`; }
  _pl1(i) { return `<button class="pl" data-act="play" data-i="${i}" aria-label="${hgT('cards.assist.play_reply')}">${H.icon('mdi:volume-high')}</button>`; }
  _bub(L, off = 0) { const n = (this._msgs || []).length;
    return L.map((m, j) => { const i = off + j; return `<div class="b ${m.r}${m.err ? ' e' : ''}"${m.r === 'a' && i === n - 1 ? ' aria-live="polite"' : ''}>${m.wait ? `<span class="ty" aria-label="${hgT('cards.assist.assistant_is_typing')}"><i></i><i></i><i></i></span>` : H.esc(m.t)}${m.tts ? this._pl1(i) : ''}</div>`; }).join(''); }
  /* ---- widok głosowy ---- */
  _phase() { if (this._busy2) return 'processing'; if (this._spk) return 'speaking'; if (this._rec) return 'listening'; return (this._vs && this._vs.phase) || 'idle'; }
  _phT(ph) { switch (ph) { case 'listening': return hgT('cards.assist.voice_listening'); case 'processing': return hgT('cards.assist.thinking'); case 'speaking': return hgT('cards.assist.voice_speaking'); default: return hgT('cards.assist.voice_idle'); } }
  _orbL(ph) { return ph === 'listening' ? hgT('cards.assist.voice_stop') : ph === 'speaking' ? hgT('cards.assist.voice_interrupt') : hgT('cards.assist.voice_start'); }
  /* tekst na słowa z kluczem w{i}: morph zostawia istniejące, animuje tylko nowe */
  _words(t, k) { return (String(t).match(/\S+\s*/g) || []).map((w, i) => `<span class="w" data-key="${k}${i}" style="--d:${i}">${H.esc(w)}</span>`).join(''); }
  _rv(sel) { const c = this._config, M = this._msgs || [], ph = this._phase();
    /* tylko bieżąca wymiana (od _turn): przy błędzie nowego przebiegu nie wraca stara odpowiedź */
    let u = -1; for (let i = M.length - 1; i >= Math.min(this._turn || 0, M.length); i--) if (M[i].r === 'u') { u = i; break; }
    const heard = this._interim || (u >= 0 && (ph !== 'listening' || this._interim) ? M[u].t : ''), rp = u >= 0 && ph !== 'listening' ? M[u + 1] : null;
    const bars = [0.35, 0.7, 1, 0.7, 0.35].map((k, j) => `<i style="--k:${k};--j:${j}"></i>`).join('');
    const line = rp && rp.r === 'a' && !rp.wait ? `<p class="rp${rp.err ? ' e' : ''}" data-key="rp${u}">${this._words(rp.t, 'r')}${rp.tts ? this._pl1(u + 1) : ''}</p>` : heard && ph === 'processing' ? `<p class="rp" data-key="th${u}">${this._phT(ph)}</p>` : '';
    const [qa, qb] = hgT('cards.assist.voice_quote', { text: '\u0000' }).split('\u0000');
    return `<ha-card class="glass vo" data-ph="${ph}"><div class="vr"><button type="button" class="wv" data-act="talk" data-k="orb" aria-label="${this._orbL(ph)}"${ph === 'processing' ? ' aria-disabled="true"' : ''}>${bars}</button>
      <div class="vt" aria-live="polite">${heard ? `<p class="hr" data-key="hr${u}">${H.esc(qa)}${this._words(heard, 'h')}${H.esc(qb || '')}</p>` : `<p class="ps" data-key="ps-${ph}">${this._phT(ph)}</p>`}${line}${this._note ? `<p class="nt" role="status">${H.esc(this._note)}</p>` : ''}</div></div>
      ${this._typing ? `<form class="inp" data-k="f"><input data-k="q" type="text" enterkeyhint="send" autocomplete="off" placeholder="${H.esc(c.placeholder || hgT('cards.assist.message_the_assistant'))}" aria-label="${hgT('cards.assist.message')}" value="${H.esc(this._draft || '')}">${sel}
        <button type="submit" class="gb r ok" data-act="send" aria-label="${hgT('cards.assist.send')}"${this._busy2 ? ' disabled' : ''}>${H.icon('mdi:send')}</button></form>` : ''}</ha-card>`; }
  afterRender() { const q = this.$.querySelector('[data-k=q]'), f = this.$.querySelector('[data-k=f]'), s = this.$.querySelector('[data-k=pipe]'), cv = this.$.querySelector('.cv');
    if (q && this._once(q)) q.addEventListener('input', () => { this._draft = q.value; });
    if (this._focusQ) { const t = q || this.$.querySelector('[data-k=orb]'); if (t) { this._focusQ = false; t.focus({ preventScroll: true }); } }
    if (f && this._once(f)) f.addEventListener('submit', (e) => { e.preventDefault(); const qq = this.$.querySelector('[data-k=q]'); this._send(qq ? qq.value : ''); });
    if (s && this._once(s)) s.addEventListener('change', () => { this._pipe = s.value; this._cid = null; hgAssistPipe(s.value);
      if (this._config.embedded && window.HGAssistUI && HGAssistUI.card === this) HGAssistUI.set({ pipeline: s.value }); });
    if (cv) cv.scrollTop = cv.scrollHeight; }
  onAct(a, t, e) { clearTimeout(this._at); if (a === 'open' || a === 'close') { if (window.HGAssistUI) HGAssistUI[a === 'open' ? 'open' : 'close'](null, t); return; }
    if (a === 'send') { e.preventDefault(); const q = this.$.querySelector('[data-k=q]'); return this._send(q && q.value); }
    if (a === 'sug') return this._send(t.dataset.t);
    if (a === 'clr') { this._vstop(false); this._msgs = []; this._turn = 0; this._cid = null; this._note = ''; this._vs = HGVoice.init(); return this.rerender(); }
    if (a === 'talk') return this._talk();
    if (a === 'play') { const m = this._msgs[+t.dataset.i]; if (m && m.tts) this._play(m.tts); }
    if (a === 'mic') return this._mic(); }
  /* po: wywołane raz, gdy odtwarzanie się skończy albo nie ruszy (blokada autoodtwarzania); przerwanie (_stopAudio) go nie woła */
  _play(u, po) { let a = null, k = false; const end = () => { if (k || this._au !== a) return; k = true; this._au = null; this._spk = false; this.rerender(); if (po) po(); };
    try { if (this._au) this._au.pause(); a = this._au = new Audio(u); this._spk = true; a.onended = end; a.onerror = end; a.play().catch(end); } catch (e) { this._spk = false; if (po) po(); } }
  _stopAudio() { if (this._au) { try { this._au.pause(); } catch (e) {} this._au = null; } this._spk = false; if (this._vs) this._vs = HGVoice.reduce(this._vs, { type: 'hg-spoken' }); }
  _live() { return window.HGAssistUI ? HGAssistUI.isOpen && HGAssistUI.card === this : this.isConnected; }
  /* słuchać dalej po odpowiedzi: tylko w widoku głosowym, z otwartym oknem i włączonym continue */
  _more(ok) { if (ok && this._config.mode !== 'text' && this._config.continue !== false && this._live() && !this._run && !this._rec) this._listen(); }
  _talk() { const ph = this._phase(); if (ph === 'processing') return;
    if (ph === 'listening') { if (this._rec) { try { this._rec.stop(); } catch (e) {} } else if (this._run) this._vev(this._run, { type: 'stt-vad-end' }); return; }
    if (ph === 'speaking') this._stopAudio();
    this._listen(); }
  /* wołane w geście użytkownika (kliknięcie, klawisz A): AudioContext i dźwięk na iOS ruszają tylko wtedy */
  async _listen() { const c = this._config, SR = window.SpeechRecognition || window.webkitSpeechRecognition, md = navigator.mediaDevices;
    clearTimeout(this._at); if (this._run || this._rec || this._busy2) return; this._note = ''; this._interim = ''; this._turn = (this._msgs || []).length;
    if (window.__hgDryRun && !window.__hgAssistLive) return this._dry();
    const can = c.mic !== false && window.isSecureContext && !!(md && md.getUserMedia) && typeof AudioWorkletNode !== 'undefined';
    if (can) this._actx();
    if (!this._pl) await this._pipes();
    if (this._run || this._rec || this._busy2) return;
    const x = (this._pl || []).find((p) => p.id === (this._pipe || c.pipeline || this._pref));
    const p = HGVoice.path({ mic: c.mic !== false, secure: window.isSecureContext, media: !!(md && md.getUserMedia), worklet: typeof AudioWorkletNode !== 'undefined', stt: !!(x && x.stt_engine && this._hass && this._hass.connection && this._hass.connection.socket), sr: !!SR });   // ramki idą gniazdem HA
    if (p === 'stream') return this._stream();
    if (p === 'speech') return this._mic();
    this._typing = true; this._focusQ = true; if (c.mic !== false && !window.isSecureContext) this._note = hgT('cards.assist.voice_need_https'); this.rerender(); }
  _actx() { const A = window.AudioContext; if (!A) return null;
    if (!this._ctx || this._ctx.state === 'closed') { try { this._ctx = new A(); this._tap = null; } catch (e) { this._ctx = null; } }
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume().catch(() => {}); return this._ctx; }
  /* przebieg głosowy: mikrofon -> worklet -> PCM 16 kHz -> ramki z stt_binary_handler_id; zdarzenia potoku przez HGVoice.reduce */
  async _stream() { const h = this._hass, c = this._config, V = HGVoice; if (this._run || !h || !h.connection) return;
    this._stopAudio(); const R = this._run = { q: [], end: false };
    this._vs = V.reduce(this._vs || V.init({ cid: this._cid }), { type: 'hg-start' }); this.rerender();
    try { const ctx = this._actx(); if (!ctx || !ctx.audioWorklet) throw new Error('audio');
      if (!this._tap) { const u = URL.createObjectURL(new Blob([V.WORKLET], { type: 'text/javascript' })); this._tap = ctx.audioWorklet.addModule(u).finally(() => URL.revokeObjectURL(u)); }
      await this._tap;
      R.ms = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (this._run !== R) return this._micOff(R);
      R.src = ctx.createMediaStreamSource(R.ms); R.node = new AudioWorkletNode(ctx, V.TAP); R.src.connect(R.node);
      R.node.port.onmessage = (e) => this._chunk(R, e.data, ctx.sampleRate);
    } catch (e) { this._tap = null; this._micOff(R); if (this._run !== R) return; this._run = null; const k = V.micKind(e && e.name);
      /* silnik dźwięku nie ruszył (worklet, AudioContext), mikrofon nie jest winny: rozpoznawanie przeglądarki, jeśli jest */
      if (k === 'audio' && (window.SpeechRecognition || window.webkitSpeechRecognition)) { this._vs = V.init({ cid: this._cid }); return this._mic(); }
      this._vs = V.reduce(this._vs, { type: 'error', data: { code: 'mic', message: String((e && e.name) || e) } }); this._note = this._micNote(k); this._typing = true; this._focusQ = true; return this.rerender(); }
    R.to = setTimeout(() => this._vev(R, { type: 'hg-timeout' }), 40000);
    try { R.un = await h.connection.subscribeMessage((ev) => this._vev(R, ev), V.runMsg({ tts: c.tts, pipeline: this._pipe || c.pipeline || undefined, cid: this._cid }));
      if (this._run !== R) try { R.un(); } catch (e) {} }
    catch (e) { this._vev(R, { type: 'error', data: { code: 'connect', message: String((e && (e.message || e.code)) || e) } }); } }
  _micNote(k) { switch (k) { case 'denied': return hgT('cards.assist.voice_no_mic'); case 'missing': return hgT('cards.assist.voice_no_device'); case 'busy': return hgT('cards.assist.voice_mic_busy'); default: return hgT('cards.assist.voice_speech_failed'); } }
  _errNote(e) { switch (HGVoice.errKind(e)) { case 'nothing': return hgT('cards.assist.voice_nothing'); case 'connect': return hgT('cards.assist.connect_error', { error: e.message || e.code }); default: return hgT('cards.assist.voice_failed', { error: e.message || e.code }); } }
  _chunk(R, x, rate) { if (this._run !== R || R.end) return; const V = HGVoice;
    const o = this.$.querySelector('[data-k=orb]'); if (o) o.style.setProperty('--lv', Math.min(1, V.level(x) * 4).toFixed(3));
    const pcm = V.toPcm16(V.downsample(x, rate));
    if (this._vs.handler == null) { if (R.q.length < 200) R.q.push(pcm); return; }   // do ~8 s, zanim potok poda handler
    this._tx(V.frame(this._vs.handler, pcm)); }
  _tx(b) { const s = this._hass && this._hass.connection && this._hass.connection.socket; if (s && s.readyState === 1) s.send(b); }
  _vev(R, ev) { if (this._run !== R) return; const V = HGVoice, t = ev.type, prev = this._vs; let s = this._vs = V.reduce(prev, ev);
    if (t === 'run-start' && s.handler != null) { for (const p of R.q) this._tx(V.frame(s.handler, p)); R.q = [];
      if (R.end) { this._tx(V.endFrame(s.handler)); s = this._vs = Object.assign({}, s, { phase: 'processing', mic: false }); } }   // zatrzymane, zanim potok ruszył
    else if (prev.mic && !s.mic) this._micEnd(R, !s.err);
    if (t === 'stt-end' && s.heard) this._msgs = [...this._msgs, { r: 'u', t: s.heard }, { r: 'a', wait: true }];
    if (t === 'intent-end') { this._cid = s.cid; this._put(s.reply || hgT('cards.assist.no_reply')); }
    if (t === 'tts-end' && s.tts) { const u = V.ttsUrl(s.tts, this._hass); this._put(null, { tts: u }); this._play(u, () => this._after()); }
    if (s.err && (t === 'error' || t === 'hg-timeout')) { this._note = this._errNote(s.err);
      const L = this._msgs[this._msgs.length - 1]; if (L && L.wait) this._put(this._note, { err: true }); }
    if (s.done) { clearTimeout(R.to); if (R.un) try { R.un(); } catch (e) {} this._micEnd(R, false); this._run = null; if (!s.tts && !s.err) this._after(); else if (s.err) this._auto(); }
    this.rerender(); }
  _after() { this._vs = HGVoice.reduce(this._vs, { type: 'hg-spoken' }); this.rerender(); this._more(HGVoice.again(this._vs, { continue: true })); this._auto(); }
  /* pasek znika sam po odpowiedzi albo błędzie, jak powiadomienie (po odczytaniu 2 s, bez głosu czas na przeczytanie); nie, gdy słucha dalej albo pisze. Każda akcja i nowy przebieg kasują odliczanie */
  _auto() { clearTimeout(this._at); if (this._config.mode === 'text' || this._typing || this._run || this._rec || !this._live()) return;
    const M = this._msgs || [], L = M[M.length - 1], t = (L && L.r === 'a' && L.t) || this._note || '';
    const ms = L && L.tts && !this._note ? 2000 : Math.min(8000, 2500 + t.length * 50);
    this._at = setTimeout(() => { const p = this._phase(); if ((p === 'idle' || p === 'error') && !this._typing && this._live()) HGAssistUI.close(); }, ms); }
  /* zamienia ostatni dymek asystenta (oczekiwanie) na tekst albo dopisuje do niego pola */
  _put(t, o = {}) { const M = this._msgs, i = M.length - 1;
    if (i >= 0 && M[i].r === 'a') this._msgs = [...M.slice(0, i), Object.assign({}, M[i], t != null ? { t, wait: false } : {}, o)];
    else if (t != null) this._msgs = [...M, Object.assign({ r: 'a', t }, o)]; }
  _micEnd(R, send) { if (R.end) return; R.end = true; if (send && this._vs.handler != null) this._tx(HGVoice.endFrame(this._vs.handler)); this._micOff(R); }
  _micOff(R) { try { if (R.src) R.src.disconnect(); if (R.node) { R.node.port.onmessage = null; R.node.disconnect(); } } catch (e) {}
    if (R.ms) R.ms.getTracks().forEach((t) => t.stop()); R.ms = R.src = R.node = null; const o = this.$ && this.$.querySelector('[data-k=orb]'); if (o) o.style.removeProperty('--lv'); }
  /* zamknięcie okna (full) albo nowa rozmowa: koniec przebiegu bez wysyłania tego, co już nagrane */
  _vstop(full) { clearTimeout(this._at); const R = this._run; if (R) { this._run = null; clearTimeout(R.to); if (R.un) try { R.un(); } catch (e) {} R.end = true; this._micOff(R); }
    if (this._rec) { this._recX = true; try { this._rec.abort(); } catch (e) {} }
    this._stopAudio(); this._interim = ''; this._vs = HGVoice.init({ cid: this._cid }); if (full) { this._typing = false; this._note = ''; }   // pole tekstowe było zapasem tylko na ten raz
    if (full && this._ctx) { this._ctx.close().catch(() => {}); this._ctx = null; this._tap = null; } }
  /* podgląd (__hgDryRun): sekwencja zdarzeń potoku bez mikrofonu i bez wysyłania */
  _dry() { const R = this._run = { q: [], end: false }, e = (type, data) => ({ type, data });
    this._vs = HGVoice.reduce(this._vs || HGVoice.init(), { type: 'hg-start' }); this.rerender();
    [[600, e('run-start', { runner_data: { stt_binary_handler_id: 1 } })], [1600, e('stt-vad-end')], [1700, e('stt-end', { stt_output: { text: hgT('cards.assist.what_time_is_it') } })],
      [2600, e('intent-end', { intent_output: { response: { speech: { plain: { speech: hgT('cards.assist.preview_home_assistant_assist') } } } } })], [2650, e('run-end')]]
      .forEach(([ms, x]) => setTimeout(() => this._vev(R, x), ms)); }
  _mic() { const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
    if (this._rec) { try { this._rec.stop(); } catch (e) {} return; }
    const r = new SR(); r.lang = (this._hass && this._hass.language) || HG_LOC(); r.interimResults = true; r.maxAlternatives = 1; this._rec = r; this.rerender();
    const vo = this._config.mode !== 'text'; this._recX = false; this._note = '';
    let fin = ''; r.onresult = (ev) => { let t = ''; for (const x of ev.results) { t += x[0].transcript; if (x.isFinal) fin = t; }
      if (vo) { this._interim = t; return this.rerender(); } const q = this.$.querySelector('[data-k=q]'); if (q) q.value = t; this._draft = t; };
    /* nic nie usłyszał: komunikat i pasek sam zniknie; odmowa, brak mikrofonu, sieć (Chrome rozpoznaje na serwerach Google): pole tekstowe */
    r.onerror = (e) => { const k = HGVoice.speechKind(e && e.error); if (!vo || !k) return;
      if (k === 'nothing') this._note = hgT('cards.assist.voice_nothing'); else { this._note = this._micNote(k === 'failed' ? 'audio' : k); this._typing = true; this._focusQ = true; } };
    r.onend = () => { this._rec = null; this._interim = ''; this.rerender(); if (this._recX) { this._recX = false; return; } if (fin.trim()) this._send(fin, vo); else if (vo) this._auto(); }; try { r.start(); } catch (e) { this._rec = null; this.rerender(); } }
  async _send(txt, voice) { txt = String(txt || '').trim(); const h = this._hass, c = this._config; if (!txt || this._busy2 || !h) return;
    this._draft = ''; this._busy2 = true; this._turn = this._msgs.length; this._msgs = [...this._msgs, { r: 'u', t: txt }, { r: 'a', wait: true }]; this._focusQ = true; this.rerender();
    const done = (t, o = {}) => { this._msgs = [...this._msgs.slice(0, -1), Object.assign({ r: 'a', t }, o)]; this._busy2 = false; this.rerender(); };
    if (window.__hgDryRun && !window.__hgAssistLive) { setTimeout(() => done(hgT('cards.assist.preview_home_assistant_assist')), 500); return; }
    const pipe = this._pipe || c.pipeline || undefined, lang = h.language;
    try {
      if (h.connection && h.connection.subscribeMessage) {
        let reply = null, url = null, err = null, unsub = null, cont = false; const tts = !!c.tts;
        await new Promise((res) => { const to = setTimeout(res, 30000);
          h.connection.subscribeMessage((ev) => { const d = ev.data || {};
            if (ev.type === 'intent-end') { const o = d.intent_output || {}; reply = (((o.response || {}).speech || {}).plain || {}).speech || ''; if (o.conversation_id) this._cid = o.conversation_id; cont = o.continue_conversation === true; if (!tts) { clearTimeout(to); res(); } }
            if (ev.type === 'tts-end') { url = (d.tts_output || {}).url || null; }
            if (ev.type === 'error') { err = d.message || d.code || 'error'; clearTimeout(to); res(); }
            if (ev.type === 'run-end') { clearTimeout(to); res(); } },
            Object.assign({ type: 'assist_pipeline/run', start_stage: 'intent', end_stage: tts ? 'tts' : 'intent', input: { text: txt }, conversation_id: this._cid || null }, pipe ? { pipeline: pipe } : {})).then((u) => { unsub = u; }).catch((e) => { err = e && (e.message || e.code) || 'error'; clearTimeout(to); res(); }); });
        if (unsub) try { unsub(); } catch (e) {}
        if (err && reply == null) throw new Error(err);
        if (url && !/^https?:/.test(url)) url = h.hassUrl ? h.hassUrl(url) : url;
        done(reply || hgT('cards.assist.no_reply'), url ? { tts: url } : {}); const fin = () => { this._more(voice && cont); this._auto(); }; if (url) this._play(url, fin); else fin(); return; }
      const r = await h.callWS(Object.assign({ type: 'conversation/process', text: txt, conversation_id: this._cid || null, language: lang }, c.agent_id ? { agent_id: c.agent_id } : {}));
      if (r.conversation_id) this._cid = r.conversation_id; done(((((r.response || {}).speech || {}).plain || {}).speech) || hgT('cards.assist.no_reply'));
    } catch (e) { done(hgT('cards.assist.connect_error', { error: String(e && e.message ? e.message : e) }), { err: true }); } }
  getGridOptions() { return this._config && this._config.embedded ? { columns: 12, rows: 5 } : { columns: 6, rows: 1 }; }
}
hgReg('hg-assist-card', HGAssistCard, hgTLazy('cards.assist.picker_name'), hgTLazy('cards.assist.picker_description'));
