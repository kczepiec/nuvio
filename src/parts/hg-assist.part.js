/* Assist jako okno dialogowe (0.11.0): szklane okno na komputerze, arkusz od dołu na telefonie.
   Jedna instancja na stronę, nigdy nie montowana ponownie: rozmowa (i conversation_id) trwa przez całą sesję.
   Ustawienia w panelu Ustawienia, karta „Nagłówek i nawigacja”; zapis w danych użytkownika (HGL.data.assist).
   Tryb głosowy (mode: 'voice', domyślny): zamiast okna pasek u góry, słucha od razu po otwarciu (listen), dalej przy dopytaniu (continue). */
const HG_ASSIST_CSS = `
.as-l{ position:fixed; inset:0; z-index:1002; visibility:hidden; pointer-events:none; }
.as-l.open{ visibility:visible; pointer-events:auto; }
/* zamknięte okno: samo visibility nie wystarcza (ha-card w karcie ma własne visibility:visible, dymki i podpowiedzi zostawały na ekranie po zamknięciu) -> bez warstwy w ogóle */
.as-l:not(.open){ opacity:0; } .as-l:not(.open) .as-d{ display:none; }
.as-l .as-scrim{ position:absolute; inset:0; background:rgba(8,10,14,.32); opacity:0; transition:opacity var(--hg-t-base, 200ms) var(--hg-ease-in, ease-in); }
.as-l.in .as-scrim{ opacity:1; transition-timing-function:var(--hg-ease-out, ease-out); }
/* ten sam przepis szkła co okna hgOverlay (ui/overlay): połysk + --hg-panel-flat, krawędź, cień; jedno rozmycie na samym oknie, od pierwszej klatki
   (animowany jest tylko transform, nie przezroczystość). Kolor tekstu i akcent z motywu, więc działa w jasnym i ciemnym schemacie. */
.as-l .as-d{ position:absolute; inset:0; margin:auto; width:min(600px, calc(100vw - 32px)); height:min(640px, calc(100vh - 48px), calc(100dvh - 48px)); display:flex; flex-direction:column; overflow:hidden;
  border-radius:var(--hg-radius, 24px); color:var(--hg-chrome-fg, #1C1C1E); isolation:isolate;
  box-shadow:var(--hg-edge, 0 0 0 transparent), var(--hg-shadow-float, 0 24px 70px rgba(0,0,0,.45));
  transform:translateY(12px) scale(.94); transition:transform var(--hg-t-base, 200ms) var(--hg-ease-in, ease-in); }
/* bez transformu po otwarciu: lista wyboru (position:fixed) liczy się wtedy od okna przeglądarki, nie od okna dialogu */
.as-l.in .as-d{ transform:none; transition:transform var(--hg-t-slow, 320ms) var(--hg-ease-out, cubic-bezier(.2,.8,.2,1)); }
/* szkło na warstwie ::before: samo okno bez backdrop-filter, więc lista wyboru modelu (position:fixed) nie jest przycinana przez okno */
.as-l .as-d::before{ content:''; position:absolute; inset:0; z-index:-1; border-radius:inherit; pointer-events:none; background:var(--hg-glass-sheen, none), var(--hg-panel-flat, rgba(236,238,242,.9));
  -webkit-backdrop-filter:var(--hg-bfo, blur(calc(28px * var(--hg-bf, 1))) saturate(150%)); backdrop-filter:var(--hg-bfo, blur(calc(28px * var(--hg-bf, 1))) saturate(150%)); }
.as-l .as-d > *{ flex:1; min-height:0; }
.as-l .grab{ display:none; }
@media (max-width: 600px){
  .as-l .as-d{ inset:auto 0 0 0; margin:0; width:auto; height:min(80vh, 680px); border-radius:var(--hg-radius, 24px) var(--hg-radius, 24px) 0 0; padding-bottom:env(safe-area-inset-bottom); transform:translateY(105%); }
  .as-l.in .as-d{ transform:none; transition:transform var(--hg-t-slow, 320ms) var(--hg-spring, cubic-bezier(.2,.8,.2,1)); }
  .as-l .grab{ display:block; flex:none; width:40px; height:5px; border-radius:3px; margin:8px auto 0; background:currentColor; opacity:.25; }
}
/* tryb głosowy: zamiast okna pasek u góry ekranu, jak powiadomienie (wjeżdża z góry, tylko transform); bez przyciemnienia, kliknięcie obok nadal zamyka */
.as-l.vm .as-scrim{ background:transparent; }
/* wejście: zjazd z góry ze sprężystym dojściem i lekkim powiększeniem; wyjście: krótko i szybko w górę */
.as-l.vm .as-d{ inset:calc(env(safe-area-inset-top, 0px) + 84px) 0 auto 0; margin:0 auto; width:min(1040px, calc(100vw - 32px)); height:auto; max-height:calc(100dvh - 120px);
  border-radius:calc(var(--hg-radius, 24px) + 4px); padding-bottom:0; transform:translateY(calc(-100% - 120px)) scale(.94); transform-origin:50% 0;
  transition:transform 240ms cubic-bezier(.4, 0, 1, 1); }
.as-l.vm.in .as-d{ transform:none; transition:transform 560ms cubic-bezier(.16, 1.24, .3, 1); }
.as-l.vm .grab{ display:none !important; }
@media (max-width: 600px){ .as-l.vm .as-d{ inset:calc(env(safe-area-inset-top, 0px) + 12px) 0 auto 0; width:calc(100vw - 24px); border-radius:var(--hg-radius, 24px); transform:translateY(calc(-100% - 40px)); }
  .as-l.vm.in .as-d{ transform:none; transition:transform 560ms cubic-bezier(.16, 1.24, .3, 1); } }
@media (prefers-reduced-motion: reduce){ .as-l .as-scrim, .as-l .as-d{ transition:none !important; } }
.cir.as.on{ background:var(--hg-accent) !important; color:var(--hg-on-accent) !important; }
`;
const HGAssistUI = window.__hgAssistUI || (window.__hgAssistUI = {
  page: null, hass: null, L: null, card: null, opener: null, isOpen: false, _t: null, _pl: null, _plL: false, _sv: null, _key: null,
  get() { const a = (window.__hgL && window.__hgL.data && window.__hgL.data.assist) || {};
    const sg = Array.isArray(a.suggestions) ? a.suggestions.filter((x) => typeof x === 'string' && x.trim()).slice(0, 12) : null;
    /* mode: 'voice' (domyślnie) albo 'text' (dawny czat); w trybie głosowym odczyt odpowiedzi domyślnie włączony, zapisane tts: false zostaje */
    const mode = a.mode === 'text' ? 'text' : 'voice';
    return { button: a.button !== false, key: a.key !== false, pipeline: typeof a.pipeline === 'string' ? a.pipeline : '', mode, tts: typeof a.tts === 'boolean' ? a.tts : mode === 'voice', mic: a.mic !== false,
      listen: a.listen !== false, continue: a.continue !== false, suggestions: sg && sg.length ? sg : null }; },
  /* zapis surowych pól plus zmiana: wartości wyliczone w get() (np. domyślny odczyt w trybie głosowym) nie trafiają do zapisu */
  set(p) { HGL.data.assist = Object.assign({}, HGL.data.assist || {}, p); HGL._ls(); this.apply();
    if (this.page && this.page._paintTop) { this.page._sigTop = null; this.page._paintTop(); }
    /* w trybie edycji: tylko szkic, zapis przy Gotowe */
    if (HGL.editing) return; clearTimeout(this._sv); this._sv = setTimeout(() => { this._sv = null; HGL.save(this.hass || window.__hgHass).catch(() => {}); }, 400); },
  cfg() { const c = this.get(); return { type: 'custom:hg-assist-card', embedded: true, title: 'Assist', pipeline: c.pipeline || null, mode: c.mode, tts: c.tts, mic: c.mic, continue: c.continue, show_pipeline: true, suggestions: c.suggestions }; },
  apply() { if (this.L) this.L.classList.toggle('vm', this.get().mode === 'voice'); if (this.card) { const m = this.card._msgs, id = this.card._cid; this.card.setConfig(this.cfg()); this.card._msgs = m; this.card._cid = id; } },
  bind(h, page) { this.hass = h; if (this.page !== page) { this.page = page; if (this.L && page.shadowRoot && this.L.getRootNode() !== page.shadowRoot) page.shadowRoot.appendChild(this.L); }
    if (this.card) this.card.hass = h;
    if (!this._key) { this._key = (e) => this.onKey(e); window.addEventListener('keydown', this._key, true); }
    /* karta w tle (inna karta, zablokowany telefon): pasek zamyka się i wyłącza mikrofon; okno czatu zostaje */
    if (!this._vis) { this._vis = () => { if (document.hidden && this.isOpen && this.get().mode === 'voice') this.close(); }; document.addEventListener('visibilitychange', this._vis); } },
  /* klawisz A otwiera (gdy fokus nie jest w polu tekstowym); Escape zamyka */
  onKey(e) { const p = this.page; if (!p || !p.isConnected || !p.getBoundingClientRect().width) return;
    if (this.isOpen) { if (e.key === 'Escape' && !(typeof hgsOpen !== 'undefined' && hgsOpen.size)) { e.preventDefault(); e.stopPropagation(); this.close(); } else if (e.key === 'Tab') this.trap(e); return; }
    if (e.key !== 'a' && e.key !== 'A') return; if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || !this.get().key) return;
    const fe = e.composedPath()[0]; if (fe && (fe.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(fe.tagName))) return;
    if (p._eSheetOpen || p._sheetOpen || p._menuOpen || (window.HGWall && HGWall.active)) return;
    e.preventDefault(); e.stopPropagation(); this.open(p); },
  trap(e) { const r = this.card && this.card.shadowRoot; if (!r) return; const f = [...r.querySelectorAll('button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null || x.getClientRects().length);
    if (!f.length) return; const a = r.activeElement, i = f.indexOf(a);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); } },
  mount() { const p = this.page; if (!p || !p.shadowRoot) return false; if (this.L) { if (this.L.getRootNode() !== p.shadowRoot) p.shadowRoot.appendChild(this.L); return true; }
    const L = document.createElement('div'); L.className = 'as-l';
    L.innerHTML = `<style>${HG_ASSIST_CSS}</style><div class="as-scrim" data-asx="1"></div><div class="as-d" role="dialog" aria-modal="true" aria-label="Assist"><i class="grab" aria-hidden="true"></i></div>`;
    const c = document.createElement('hg-assist-card'); c.setConfig(this.cfg()); if (this.hass) c.hass = this.hass; L.querySelector('.as-d').appendChild(c);
    L.querySelector('.as-scrim').addEventListener('click', () => this.close());
    /* telefon: przeciągnięcie uchwytu w dół zamyka */
    const d = L.querySelector('.as-d'), g = L.querySelector('.grab'); let y0 = null;
    g.addEventListener('pointerdown', (e) => { y0 = e.clientY; g.setPointerCapture(e.pointerId); });
    g.addEventListener('pointermove', (e) => { if (y0 == null) return; const dy = e.clientY - y0; if (dy > 0) d.style.transform = `translateY(${dy}px)`; });
    const end = (e) => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; d.style.transform = ''; if (dy > 80) this.close(); };
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', () => { y0 = null; d.style.transform = ''; });
    L.classList.toggle('vm', this.get().mode === 'voice'); p.shadowRoot.appendChild(L); this.L = L; this.card = c; return true; },
  open(p, from) { if (p) this.page = p; if (!this.mount()) return; if (this.isOpen) return this.focus();
    this.opener = from || (this.page.shadowRoot && this.page.shadowRoot.activeElement) || null; this.isOpen = true; clearTimeout(this._t);
    const L = this.L; L.classList.add('open'); this.btn(true);
    if (typeof hgReduced !== 'undefined' && hgReduced()) L.classList.add('in'); else requestAnimationFrame(() => requestAnimationFrame(() => this.isOpen && L.classList.add('in')));
    /* od razu słucha: synchronicznie, jeszcze w geście (kliknięcie, klawisz A), bo AudioContext i dźwięk na iOS ruszają tylko wtedy */
    const c = this.get(); if (c.mode === 'voice' && c.listen && this.card && this.card._listen) this.card._listen();
    let n = 0; const tf = () => { if (!this.isOpen) return; this.focus(); const r = this.card && this.card.shadowRoot; if (++n < 12 && (!r || !r.activeElement || n < 6)) setTimeout(tf, 80); }; setTimeout(tf, 30); },
  focus() { if (this.card) this.card._focusQ = true; const q = this.card && this.card.shadowRoot && this.card.shadowRoot.querySelector('[data-k=q], [data-k=orb]'); if (q) q.focus({ preventScroll: true }); },
  close() { if (!this.isOpen || !this.L) return; this.isOpen = false; const L = this.L; L.classList.remove('in'); this.btn(false);
    if (this.card && this.card._vstop) this.card._vstop(true);
    this._t = setTimeout(() => { if (!this.isOpen) L.classList.remove('open'); }, typeof hgReduced !== 'undefined' && hgReduced() ? 0 : 280);
    const o = this.opener; this.opener = null; if (o && o.isConnected && o.focus) o.focus({ preventScroll: true }); },
  btn(on) { const b = this.page && this.page.shadowRoot && this.page.shadowRoot.querySelector('.cir.as'); if (b) { b.classList.toggle('on', on); b.setAttribute('aria-expanded', String(on)); } },
  /* ---- ustawienia (karta „Nagłówek i nawigacja”) ---- */
  pipes(p) { const h = p._hass; if (this._pl || this._plL || !h || !h.callWS) return; this._plL = true;
    h.callWS({ type: 'assist_pipeline/pipeline/list' }).then((r) => { this._pl = (r && r.pipelines) || []; this._pref = r && r.preferred_pipeline; }).catch(() => { this._pl = []; })
      .then(() => { this._plL = false; const S = p._eSheetEl; if (S && S.querySelector('.hge-sheet.lk [data-tab=head]')) p._eLook(); }); },
  sw(k, l, d, on) { return `<button type="button" class="wl-sw" role="switch" data-hge="as-tg" data-k="${k}" aria-checked="${on}"><span>${l}<small>${d}</small></span><i aria-hidden="true"></i></button>`; },
  html(p) { const c = this.get(); this.pipes(p); const pl = this._pl || [], pref = pl.find((x) => x.id === this._pref);
    const cur = c.pipeline && !pl.some((x) => x.id === c.pipeline) ? [{ id: c.pipeline, name: c.pipeline }] : [];
    return `<section class="lk-g wl as-s" data-tab="head" data-pg="assist" aria-labelledby="as-h"><style>${typeof HG_WALL_CSS !== 'undefined' ? HG_WALL_CSS : ''}</style><h4 id="as-h">${H.icon('mdi:microphone-message')}${hgT('assist.assist')}</h4>
      <small class="lk-hn">${hgT('assist.talk_to_the_home')}</small>
      ${this.sw('button', hgT('assist.header_button'), hgT('assist.microphone_icon_next_to'), c.button)}
      ${this.sw('key', hgT('assist.keyboard_shortcut_a'), hgT('assist.opens_the_dialog_when'), c.key)}
      <label class="wl-f"><span>${hgT('assist.default_assistant')}</span><select class="hs-in" name="as-pipe"><option value="">${H.esc(pref ? hgT('assist.preferred_named', { name: pref.name }) : hgT('assist.preferred'))}</option>${[...cur, ...pl].map((x) => `<option value="${H.esc(x.id)}"${x.id === c.pipeline ? ' selected' : ''}>${H.esc(x.name)}</option>`).join('')}</select></label>
      <label class="wl-f"><span>${hgT('assist.mode')}</span><select class="hs-in" name="as-mode"><option value="voice"${c.mode === 'voice' ? ' selected' : ''}>${hgT('assist.mode_voice')}</option><option value="text"${c.mode === 'text' ? ' selected' : ''}>${hgT('assist.mode_text')}</option></select></label>
      ${c.mode === 'voice' ? this.sw('listen', hgT('assist.listen_on_open'), hgT('assist.starts_listening_when'), c.listen) + this.sw('continue', hgT('assist.continue_conversation'), hgT('assist.listens_again_when'), c.continue) : ''}
      ${this.sw('tts', hgT('assist.read_replies_aloud'), hgT('assist.the_voice_set_in'), c.tts)}
      ${c.mode === 'voice' ? this.sw('mic', hgT('assist.microphone'), hgT('assist.mic_voice'), c.mic) : this.sw('mic', hgT('assist.microphone'), hgT('assist.dictation_in_the_browser'), c.mic)}
      <label class="wl-f"><span>${hgT('assist.suggestions_comma_separated')}</span><span class="hs-s lk-url">${H.icon('mdi:lightbulb-on-outline')}<input class="hs-in" name="as-sug" placeholder="${hgT('assist.empty_default_suggestions')}" value="${H.esc((c.suggestions || []).join(', '))}" autocomplete="off" aria-label="${hgT('assist.suggestions')}"></span></label>
      <button type="button" class="wl-tb" data-hge="as-open">${H.icon('mdi:microphone-message')}<span>${hgT('common.open_assist')}</span></button></section>`; },
  wire(p, S) { const s = S.querySelector('[name=as-pipe]'); if (s) s.addEventListener('change', () => this.set({ pipeline: s.value }));
    const m = S.querySelector('[name=as-mode]'); if (m) m.addEventListener('change', () => { this.set({ mode: m.value === 'text' ? 'text' : 'voice' }); p._eLook(); });
    const u = S.querySelector('[name=as-sug]'); if (u) u.addEventListener('change', () => this.set({ suggestions: u.value.split(',').map((x) => x.trim()).filter(Boolean) })); },
  act(p, b, a) { if (a === 'as-tg') { const k = b.dataset.k; this.set({ [k]: !this.get()[k] }); return p._eLook(); }
    if (a === 'as-open') { if (p._eSheetClose) p._eSheetClose(); else { const x = p._eSheetEl && p._eSheetEl.querySelector('[data-hge=sheetclose]'); if (x) x.click(); } setTimeout(() => this.open(p), 260); } },
});
window.HGAssistUI = HGAssistUI;
