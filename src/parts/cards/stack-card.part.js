/* ===================== STOS: kilka kart w jednym szkle, pionowo albo poziomo (karty Nuvio i zwykłe karty HA) ===================== */
/* tworzenie karty potomnej: custom:<tag> od razu, gdy element jest już zarejestrowany; karty HA przez loadCardHelpers */
const hgMakeCard = (cfg, done) => { cfg = hgCardClean(hgFromHA(cfg)); const t = String((cfg && cfg.type) || '');
  const mk = (tag) => { const el = document.createElement(tag); try { el.setConfig(cfg); } catch (e) { el.textContent = String(e.message || e); } return el; };
  if (t.startsWith('custom:')) { const tag = t.slice(7); if (customElements.get(tag)) return done(mk(tag)); customElements.whenDefined(tag).then(() => done(mk(tag))); return; }
  if (window.loadCardHelpers) window.loadCardHelpers().then((hl) => done(hl.createCardElement(cfg))).catch(() => {});
  else customElements.whenDefined('hui-' + t + '-card').then(() => done(mk('hui-' + t + '-card'))); };
/* kontenery z HA (grid, vertical-stack, horizontal-stack) -> kontenery Nuvio z tymi samymi dziećmi; keep_ha: true zostawia kartę HA */
const HG_CONT = ['custom:hg-stack-card', 'custom:hg-grid-card', 'custom:hg-tabs-card', 'custom:hg-conditional-card'];
const hgIsCont = (c) => !!c && (HG_CONT.includes(c.type) || ['grid', 'vertical-stack', 'horizontal-stack', 'conditional'].includes(c.type));
const hgFromHA = (c) => { if (!c || typeof c !== 'object' || c.keep_ha) return c;
  const kids = Array.isArray(c.cards) ? c.cards.map(hgFromHA) : c.cards, base = Object.assign({}, c.title ? { title: c.title } : {}, { cards: kids });
  if (c.type === 'grid') return Object.assign({ type: 'custom:hg-grid-card', columns: c.columns || 3 }, c.square ? { square: true } : {}, base);
  if (c.type === 'vertical-stack') return Object.assign({ type: 'custom:hg-stack-card', direction: 'vertical' }, base);
  if (c.type === 'conditional' && c.card) return Object.assign({ type: 'custom:hg-conditional-card', conditions: c.conditions || [], cards: [hgFromHA(c.card)] });
  if (c.type === 'horizontal-stack') return Object.assign({ type: 'custom:hg-stack-card', direction: 'horizontal' }, base);
  return kids !== c.cards ? Object.assign({}, c, { cards: kids }) : c; };
/* pola edytora (nv_*), rozpiętość w siatce (span) i keep_ha nie trafiają do samej karty */
const hgCardClean = (c) => { if (!c || typeof c !== 'object') return c; const o = {}; for (const k in c) if (!/^nv_/.test(k) && k !== 'span' && k !== 'keep_ha') o[k] = c[k];
  /* starsze kafelki z komponentu (np. „Czujnik z wykresem”) nie miały zapisanego stylu: styl bierzemy z komponentu */
  if (c.single && !c.single.t && c.nv_comp && typeof HG_COMP !== 'undefined') { const C = HG_COMP.find((x) => x.id === c.nv_comp); if (C && C.tile) o.single = Object.assign({}, c.single, { t: C.tile }); }
  return o; };
const HG_CONT_MAX = 3;   // najwyżej 3 poziomy kontenerów (kontener w kontenerze w kontenerze)
class HGStackCard extends HGBase {
  static getStubConfig(h) { return { cards: [{ type: 'custom:nuvio-toggle-card', ...HGToggleCard.getStubConfig(h) }, { type: 'custom:nuvio-progress-card', ...HGProgressCard.getStubConfig(h) }] }; }
  defaults() { return { cards: [], direction: 'vertical', glass: true, title: null, gap: null, align: 'stretch', ratio: null, wrap_below: 420, divider: true }; }
  css() { return HG_NV_CSS + U(`
ha-card.glass{ gap:0; padding:var(--s1) 0; }
ha-card.flat{ background:none; box-shadow:none; padding:0; gap:var(--s2); -webkit-backdrop-filter:none; backdrop-filter:none; }
.nv-hd{ padding:var(--s1) var(--s3) 0; }
.bd{ display:flex; flex-direction:column; flex:1; min-height:0; gap:var(--nv-gap, 0px); } .h:not(.nw) .bd{ flex-direction:row; align-items:var(--nv-al, stretch); }
ha-card{ container-type:inline-size; }   /* siatka i zawijanie liczą się od szerokości kontenera */
.sl{ min-width:0; flex:var(--nv-fl, 1) 1 0; position:relative; container-type:inline-size; }   /* dziecko dopasowuje S/M/L do własnego gniazda */
ha-card:not(.h) .sl, ha-card.nw .sl{ flex:0 0 auto; container-type:normal; }   /* pion: wysokość gniazda z treści dziecka; bez zawierania rozmiaru, bo Safari liczył wtedy wysokość treści jako 0 */
ha-card:not(.h) .bd, ha-card.nw .bd{ flex:1 0 auto; }   /* Safari: podstawa 0% przy min-height:0 zwijała cały stos do samych odstępów */
.glass:not(.flat) .sl{ --hg-glass-sheen:none; --hg-glass-lite:transparent; --hg-glass-bg:transparent; --hg-edge:0 0 0 transparent; --hg-card-sh:none; --hg-card-bf:none; --hg-card-under:none;
  --ha-card-background:transparent; --ha-card-box-shadow:none; --ha-card-border-width:0; }
.glass.dv:not(.flat) .sl + .sl::before{ content:''; position:absolute; left:var(--s3); right:var(--s3); top:0; height:1px; background:currentColor; opacity:.08; }
.h.dv.glass:not(.nw):not(.flat) .sl + .sl::before{ left:0; right:auto; top:var(--s2); bottom:var(--s2); width:1px; height:auto; }
.flat .bd{ gap:var(--nv-gap, var(--s2)); }
.bd.nv-in > .sl{ animation: nvStk var(--hg-t-slow) var(--hg-ease-out) both; animation-delay: calc(var(--i, 0) * var(--hg-t-stagger, 30ms)); }
@keyframes nvStk{ from{ opacity:0; transform: translateY(6px); } } @media (prefers-reduced-motion: reduce){ .bd.nv-in > .sl{ animation:none; } }
.deep{ padding:var(--s2); font-size:12px; opacity:.7; }
`); }
  cards() { return this._config.cards || []; }
  key() { return 's'; }
  head() { return this._config.title ? hgUI.header(this._config.title) : ''; }
  /* poziom zagnieżdżenia: ile kontenerów Nuvio jest nad tą kartą (+1) */
  depth() { let d = 1, n = this; for (let k = 0; k < 12 && n; k++) { const r = n.getRootNode && n.getRootNode(), host = r && r.host; if (!host) break; if (host instanceof HGStackCard) d++; n = host; } return d; }
  /* stos poziomy przechodzi w pion poniżej wrap_below (px); szerokość z ResizeObserver, bo container query nie przyjmuje zmiennej */
  /* w kaflu Studio stos poziomy zostaje poziomy (dzieci dzielą szerokość), bez zamiany na pion i przewijania */
  _inStudioTile() { const p = this.parentElement; return !!(p && p.classList && p.classList.contains('st-k')); }
  _narrowSet(w) { const c = this._config; if (!c) return; const nw = c.direction === 'horizontal' && w > 0 && w < (+c.wrap_below || 0) && !this._inStudioTile(); if (nw !== !!this._nw) { this._nw = nw; this._animNext = true; this.rerender(); } }
  connectedCallback() { super.connectedCallback(); if (!this._ro && typeof ResizeObserver !== 'undefined') this._ro = new ResizeObserver((es) => this._narrowSet(es[0].contentRect.width)); if (this._ro) this._ro.observe(this); }
  disconnectedCallback() { if (this._ro) this._ro.disconnect(); }
  _extraSig() { return [this._nw]; }
  styleVars() { const c = this._config, V = []; if (c.gap != null && c.gap !== '' && isFinite(+c.gap)) V.push(`--nv-gap:${+c.gap}px`);
    if (c.align && c.align !== 'stretch') V.push(`--nv-al:${{ start: 'flex-start', end: 'flex-end', center: 'center' }[c.align] || 'stretch'}`); return V.join(';'); }
  slot(x, i) { const r = Array.isArray(this._config.ratio) ? +this._config.ratio[i] : 0; return `<div class="sl" data-own data-key="${this.key()}-${i}" style="--i:${i}${r > 0 ? `;--nv-fl:${r}` : ''}"></div>`; }
  bodyCls() { return ''; }
  render() { const c = this._config, L = this.cards(), anim = this._anim || this._animNext; this._animNext = false;
    const cls = [c.glass === false ? 'flat' : '', c.direction === 'horizontal' ? 'h' : '', this._nw ? 'nw' : '', c.divider !== false ? 'dv' : ''].filter(Boolean).join(' ');
    return `<ha-card class="glass ${cls}">${this.head()}<div class="bd ${this.bodyCls()} ${anim ? 'nv-in' : ''}" data-key="bd-${this.key()}" style="${this.styleVars()}">${L.map((x, i) => this.slot(x, i)).join('')}${L.length ? '' : `<span class="nv-empty" style="padding:var(--s3)">${hgT('cards.stack.add_cards_to_the')}</span>`}</div></ha-card>`; }
  /* karty potomne żyją między aktualizacjami (morph zostawia gniazda data-own), tworzone raz na konfigurację */
  afterRender() { this._kids = this._kids || new Map(); const L = this.cards(), h = this._hass, deep = this.depth() >= HG_CONT_MAX;
    this.$.querySelectorAll('.sl[data-own]').forEach((slot, i) => { const cfg = L[i]; if (!cfg) return; const sig = this.key() + i + JSON.stringify(cfg); const el = this._kids.get(sig);
      const put = (x) => { if (this._hgPv) x._hgPv = true;   /* podgląd w edytorze: dzieci też omijają wstrzymanie odświeżania */
        if (x.parentElement !== slot) { slot.textContent = ''; slot.appendChild(x); } if (x.localName.includes('-')) hgPass(x, this._hass); };
      if (el) { if (el.className === 'deep') el.textContent = hgT('cards.stack.too_many_container_levels'); return put(el); }   /* komunikat w bieżącym języku */
      if (deep && hgIsCont(cfg)) { const d = document.createElement('div'); d.className = 'deep'; d.textContent = hgT('cards.stack.too_many_container_levels'); this._kids.set(sig, d); return put(d); }
      this._kids.set(sig, null); hgMakeCard(cfg, (x) => { this._kids.set(sig, x); if (this.$.contains(slot)) put(x); }); });
    for (const el of this._kids.values()) if (el && el.parentElement && el.localName.includes('-')) hgPass(el, h); }
  set hass(h) { this._hass = h; window.__hgHass = h; if (typeof HGTheme !== 'undefined') HGTheme.pick(h); this._update(); if (this._kids) for (const el of this._kids.values()) if (el && el.parentElement && el.localName.includes('-')) hgPass(el, h); }
  get hass() { return this._hass; }
  getCardSize() { return this.cards().length * 2 || 1; }
  getGridOptions() { return { columns: 6, rows: 'auto' }; }
}
hgReg('hg-stack-card', HGStackCard, hgTLazy('cards.stack.picker_name'), hgTLazy('cards.stack.picker_description'));
