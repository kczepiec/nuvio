/* ===================== STUDIO: karty widoku Studio (klimatyzacja, energia, dom) =====================
   HGStudioCard: wspólna baza. Poziom (compact / medium / expanded) liczy ResizeObserver z rozmiaru hosta i trafia do render() jako this._tier():
   compact < ~260 px szerokości albo < ~180 px wysokości, expanded >= ~420 x ~260, reszta medium. Każdy poziom ma inną strukturę (nie samo rozciąganie).
   Wysokość liczy się tylko gdy host ma ją narzuconą (siatka): gdy poziom wraca w < 800 ms (wysokość zależy od treści), dalej decyduje sama szerokość.
   Konfiguracja `tier` wymusza poziom (podgląd, testy). */
class HGStudioCard extends HGBase {
  static tierOf(w, h) { const hh = h > 0 ? h : null; if (w < 260 || (hh != null && hh < 180)) return 'compact'; return w >= 420 && (hh == null || hh >= 260) ? 'expanded' : 'medium'; }
  _tier() { const t = this._config && this._config.tier; return t === 'compact' || t === 'medium' || t === 'expanded' ? t : (this._tr || 'medium'); }
  _extraSig() { return [this._tr, this._xsig ? this._xsig() : '']; }
  connectedCallback() { super.connectedCallback(); if (!this._ro && window.ResizeObserver) { this._ro = new ResizeObserver(() => this._measure()); this._ro.observe(this); } }
  disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } clearTimeout(this._cmT); }
  _measure() {
    const r = this.getBoundingClientRect(); if (!r.width) return;
    let t = HGStudioCard.tierOf(r.width, this._wOnly ? 0 : r.height);
    if (t === this._tr) return;
    if (t === this._tp && Date.now() - (this._ta || 0) < 800) { this._wOnly = true; t = HGStudioCard.tierOf(r.width, 0); if (t === this._tr) return; }
    this._tp = this._tr; this._ta = Date.now(); this._tr = t; this.rerender();
  }
  getCardSize() { return 3; }
}
/* CSS wspólny: nagłówek, kafle, stan pusty. Kolory z tokenów (jasny / ciemny, szkło / płaski), ruch wyłączany przez prefers-reduced-motion */
const HG_STUDIO_CSS = HG_NV_CSS + U(`
ha-card.glass{ container-type:inline-size; gap:var(--s1); padding:var(--s2) var(--s3); }
.sthd{ display:flex; align-items:center; gap:var(--s1); min-height:32u; min-width:0; }
.sthd > ha-icon{ width:20u; height:20u; flex:none; } .sthd .nm{ flex:1; min-width:0; font-size:var(--fs-md); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.un{ opacity:.55; }
@media (prefers-reduced-motion:reduce){ ha-card.glass *{ transition:none !important; animation:none !important; } }
`);

/* ===================== STUDIO: KLIMATYZACJA =====================
   Duża nastawa i bieżąca temperatura, wybór trybu (menu), zasilanie, łuk z przeciąganą gałką, falka u dołu.
   Config: { entity: climate.*, name?, schedule?: schedule.*, tier? } */
const HG_ST_DIAL = (() => { const R = 78, P = (a) => [100 + R * Math.cos((a * Math.PI) / 180), 100 + R * Math.sin((a * Math.PI) / 180)], a = P(135), b = P(45);
  return { R, a0: 135, sw: 270, at: (f) => P(135 + f * 270).map((x) => +x.toFixed(2)), d: `M${a[0].toFixed(2)} ${a[1].toFixed(2)}A${R} ${R} 0 1 1 ${b[0].toFixed(2)} ${b[1].toFixed(2)}` }; })();
class HGStudioClimateCard extends HGStudioCard {
  static getStubConfig(h) { return { entity: hgStub(h, ['climate']) || null }; }
  defaults() { return { entity: null, name: null, schedule: null }; }
  ents() { return [this._config.entity, this._config.schedule].filter(Boolean); }
  _xsig() { return this._pend; }
  css() {
    return HG_STUDIO_CSS + U(`
ha-card.glass{ --st-c:var(--hg-accent); }
ha-card.heat{ --st-c:var(--hg-heat, #FF9F43); } ha-card.off{ --st-c:color-mix(in srgb, currentColor 35%, transparent); }
.sthd > ha-icon.run{ animation:stspin 5s linear infinite; } @keyframes stspin{ to{ transform:rotate(360deg); } }
.md{ display:inline-flex; align-items:center; gap:6u; height:26u; padding:0 8u; border-radius:var(--hg-radius-pill, 999px); font-size:var(--fs-sm); font-weight:500; flex:none; max-width:45%; }
.md i{ width:8u; height:8u; border-radius:50%; background:var(--st-c); flex:none; box-shadow:0 0 8px var(--st-c); } .md span{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .md ha-icon{ width:12u; height:12u; opacity:.7; flex:none; }
.md:hover{ background:var(--hg-inner-bg); } .md:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.bd{ position:relative; z-index:1; flex:1; min-height:0; display:flex; align-items:center; justify-content:space-between; gap:var(--s2); }
.lf{ display:flex; flex-direction:column; justify-content:center; gap:4u; min-width:0; }
.tv{ display:flex; align-items:flex-start; line-height:1; white-space:nowrap; } .tv b{ font-size:clamp(34px, 17cqi, 76px); font-weight:var(--hg-fw-num, 200); letter-spacing:-.04em; font-variant-numeric:tabular-nums; }
.tv sup{ font-size:clamp(14px, 5.5cqi, 24px); font-weight:400; margin:.35em 0 0 2u; opacity:.8; }
.ss{ display:flex; align-items:center; gap:6u; font-size:var(--fs-md); font-weight:500; color:var(--st-c); } .ss ha-icon{ width:15u; height:15u; flex:none; }
ha-card.off .ss{ color:inherit; opacity:.6; } ha-card.off .tv{ opacity:.55; }
.cur{ font-size:var(--fs-sm); opacity:.6; display:block; } .cur::first-letter{ text-transform:uppercase; }
.sp2{ display:flex; gap:var(--s1); margin-top:4u; }
.dw{ position:relative; height:100%; max-height:190px; min-height:0; aspect-ratio:1; flex:none; }
.dl{ display:block; width:100%; height:100%; overflow:visible; touch-action:none; cursor:pointer; outline:none; -webkit-user-select:none; user-select:none; }
.dl .trk, .dl .val{ fill:none; stroke-width:12; stroke-linecap:round; } .dl .trk{ stroke:color-mix(in srgb, currentColor 14%, transparent); }
.dl .val{ stroke:var(--st-c); transition:stroke-dasharray var(--hg-t-base, 200ms) var(--hg-ease-out, ease-out); filter:drop-shadow(0 0 5px color-mix(in srgb, var(--st-c) 55%, transparent)); }
.dl .kn{ fill:#fff; stroke:var(--st-c); stroke-width:3; filter:drop-shadow(0 2px 5px rgba(0,0,0,.3)); } .dl.drag .val{ transition:none; } .dl.drag .kn{ r:11; }
.dl:focus-visible .kn{ stroke-width:6; } .dl[aria-disabled=true]{ cursor:default; } ha-card.off .dl .kn{ display:none; }
.wv{ position:absolute; left:0; right:0; bottom:0; width:100%; height:34%; pointer-events:none; z-index:0; opacity:.9; } .wv path{ fill:none; stroke:var(--st-c); stroke-width:1.5; opacity:.55; }
.chs{ position:relative; z-index:1; display:flex; flex-wrap:wrap; gap:var(--s1); }
.ck{ display:inline-flex; align-items:center; gap:6u; height:30u; padding:0 var(--s2); border-radius:var(--hg-radius-pill, 999px); background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); font-size:var(--fs-sm); max-width:100%; min-width:0; }
button.ck{ cursor:pointer; } button.ck:hover{ background:var(--hg-inner-bg-h); } button.ck:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.ck ha-icon{ width:14u; height:14u; flex:none; opacity:.75; } .ck b{ font-weight:600; } .ck span{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.compact .cp{ flex:1; display:flex; align-items:center; justify-content:space-between; gap:var(--s1); min-height:0; } .compact .tv b{ font-size:clamp(30px, 24cqi, 56px); }
ha-card.glass.compact{ padding:var(--s2); }
.stp{ width:34u; height:34u; border-radius:50%; display:grid; place-items:center; background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); } .stp ha-icon{ width:16u; height:16u; } .stp[disabled]{ opacity:.35; } .stp:hover:not([disabled]){ background:var(--hg-inner-bg-h); }
`);
  }
  _lim(s) { const a = s.attributes, f = !!(this._hass && this._hass.config && this._hass.config.unit_system && this._hass.config.unit_system.temperature === '°F'); return { step: Number(a.target_temp_step) || (f ? 1 : 0.5), mn: Number(a.min_temp ?? 16), mx: Number(a.max_temp ?? 30) }; }
  _unit() { const u = this._hass && this._hass.config && this._hass.config.unit_system && this._hass.config.unit_system.temperature; return u === '°F' ? '°F' : '°C'; }
  /* co urządzenie robi: ikona, tekst i czy grzeje (ciepły akcent) */
  _status(s) {
    const h = this._hass, st = s.state, i = hgClimInfo(h, s, st), m = HG_AC_MODE[i && i.act ? i.act : st];
    if (st === 'off') return { ic: 'mdi:power-sleep', tx: hgT('common.off_fem'), heat: false, run: false };
    if (i && i.act === 'idle') return { ic: 'mdi:pause-circle-outline', tx: hgT('cards.ac.idle'), heat: false, run: false };
    const act = (i && i.act) || st;
    return { ic: m ? (act === 'heat' ? 'mdi:heat-wave' : m.i) : 'mdi:thermostat', tx: m ? m.l : H.T(h, s), heat: act === 'heat', run: !!i && ['cool', 'fan_only', 'heat', 'dry'].includes(i.act) };
  }
  _dial(f, on, t, mn, mx) {
    const [x, y] = HG_ST_DIAL.at(f);
    return `<div class="dw" data-no-swipe><svg class="dl" viewBox="0 0 200 200" role="slider" tabindex="${on && t != null ? 0 : -1}" aria-label="${H.esc(hgT('cards.ac.target_temperature'))}" aria-valuemin="${mn}" aria-valuemax="${mx}" aria-valuenow="${t ?? ''}" aria-valuetext="${t != null ? H.fmt(t) + this._unit() : ''}" ${on && t != null ? '' : 'aria-disabled="true"'}>
      <path class="trk" d="${HG_ST_DIAL.d}"/><path class="val" d="${HG_ST_DIAL.d}" pathLength="100" stroke-dasharray="${(f * 100).toFixed(2)} 101"/><circle class="kn" cx="${x}" cy="${y}" r="9"/></svg></div>`;
  }
  _wave() { return `<svg class="wv" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C60 40 90 14 160 20 S260 46 320 30 S380 14 400 10"/><path d="M0 52 C70 52 110 30 180 36 S290 56 400 26" opacity=".5"/></svg>`; }
  render() {
    const c = this._config, h = this._hass, s = H.st(h, c.entity), tier = this._tier();
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.studio_climate.choose_a_climate_entity')}</span></ha-card>`;
    const nm = c.name || H.name(h, c.entity), ok = H.ok(s), a = s.attributes, on = ok && s.state !== 'off';
    if (!ok) return `<ha-card class="glass un ${tier}"><div class="sthd"><ha-icon icon="mdi:fan-off"></ha-icon><span class="nm">${H.esc(nm)}</span></div><div class="nv-empty">${hgT('cards.ac.unavailable')}</div></ha-card>`;
    const { mn, mx } = this._lim(s), tt = a.temperature != null ? Number(a.temperature) : null, t = this._pend != null ? this._pend : tt, cur = a.current_temperature != null ? Number(a.current_temperature) : null;
    const f = t != null && mx > mn ? Math.max(0, Math.min(1, (t - mn) / (mx - mn))) : 0, S = this._status(s), u = this._unit(), hv = a.hvac_modes || [];
    const cls = `glass ${tier} ${S.heat ? 'heat' : ''} ${on ? 'on' : 'off'}`;
    const tv = `<div class="tv"><b class="nv-num" role="status" aria-label="${H.esc(nm)}">${t != null ? H.fmt(t) : '–'}</b><sup>${u}</sup></div>`;
    const pw = hgUI.iconBtn('mdi:power', 'power', on ? hgT('common.turn_off') : hgT('common.turn_on'), { on, size: 'sm' });
    if (tier === 'compact') return `<ha-card class="${cls}" title="${H.esc(nm)}"><div class="cp">${tv}${pw}</div></ha-card>`;
    const ml = s.state === 'off' ? hgT('common.off_fem') : (HG_AC_MODE[s.state] ? HG_AC_MODE[s.state].l : H.T(h, s));
    const md = `<button class="md" type="button" data-act="mode" ${hv.length > 1 ? '' : 'disabled'} aria-haspopup="menu" title="${H.esc(ml)}"><i></i><span>${H.esc(ml)}</span>${hv.length > 1 ? H.icon('mdi:chevron-down') : ''}</button>`;
    const hd = `<div class="sthd"><ha-icon icon="mdi:fan" class="${S.run ? 'run' : ''}"></ha-icon><span class="nm">${H.esc(nm)}</span>${md}${pw}</div>`;
    const stp = (d, ic, l) => `<button class="stp" type="button" data-act="step" data-d="${d}" ${!on || t == null || (d < 0 ? t <= mn : t >= mx) ? 'disabled' : ''} aria-label="${H.esc(l)}" title="${H.esc(l)}">${H.icon(ic)}</button>`;
    const ss = `<div class="ss" role="status">${H.icon(S.ic)}<span>${H.esc(S.tx)}</span></div>`;
    const lf = `<div class="lf">${tv}${ss}${tier === 'expanded' && cur != null ? `<span class="cur">${H.esc(hgT('cards.ac.indoor_temp', { temp: H.fmt(cur) }))}</span>` : ''}<div class="sp2">${stp(-1, 'mdi:minus', hgT('cards.ac.lower_temperature'))}${stp(1, 'mdi:plus', hgT('cards.ac.raise_temperature'))}</div></div>`;
    let ex = '';
    if (tier === 'expanded') {
      const chip = (act, ic, lab, v) => `<button class="ck" type="button" data-act="${act}" aria-haspopup="menu" aria-label="${H.esc(H.lv(lab, v))}">${H.icon(ic)}<span>${H.esc(lab)}</span><b>${H.esc(v)}</b></button>`;
      const fm = a.fan_mode, sw = a.swing_mode, pr = a.preset_mode, sc = c.schedule && H.st(h, c.schedule), ne = sc && sc.attributes.next_event ? new Date(sc.attributes.next_event) : null;
      ex = `<div class="chs">${fm && (a.fan_modes || []).length > 1 ? chip('fan', 'mdi:fan', hgT('cards.ac.fan'), hgFanL(fm) || fm) : ''}${sw && (a.swing_modes || []).length > 1 ? chip('swing', 'mdi:arrow-oscillating', hgT('cards.ac.swing'), hgSwingL(sw) || sw) : ''}${pr && (a.preset_modes || []).length > 1 ? chip('preset', 'mdi:tune-variant', hgT('cards.studio_climate.preset'), pr) : ''}${a.current_humidity != null ? `<span class="ck">${H.icon('mdi:water-percent')}<span>${H.esc(H.lv(hgT('common.humidity'), H.pct(Math.round(a.current_humidity))))}</span></span>` : ''}${ne && isFinite(ne) ? `<span class="ck">${H.icon('mdi:calendar-clock')}<span>${H.esc(hgT('cards.studio_climate.next_change', { time: ne.toLocaleTimeString(HG_LOC(), { hour: '2-digit', minute: '2-digit' }) }))}</span></span>` : ''}</div>`;
    }
    return `<ha-card class="${cls}">${hd}<div class="bd">${lf}${this._dial(f, on, t, mn, mx)}</div>${ex}${this._wave()}</ha-card>`;
  }
  /* nastawa w miejscu (bez przerysowania pod palcem) */
  _quant(v) { const s = H.st(this._hass, this._config.entity), { step, mn, mx } = this._lim(s); return +Math.max(mn, Math.min(mx, Math.round((v - mn) / step) * step + mn)).toFixed(1); }
  _paint(v) {
    const s = H.st(this._hass, this._config.entity), { mn, mx } = this._lim(s), f = mx > mn ? (v - mn) / (mx - mn) : 0, R = this.$;
    const val = R.querySelector('.dl .val'), kn = R.querySelector('.dl .kn'), b = R.querySelector('.tv b'), dl = R.querySelector('.dl');
    if (val) val.setAttribute('stroke-dasharray', (f * 100).toFixed(2) + ' 101'); if (kn) { const [x, y] = HG_ST_DIAL.at(f); kn.setAttribute('cx', x); kn.setAttribute('cy', y); }
    if (b) b.textContent = H.fmt(v); if (dl) { dl.setAttribute('aria-valuenow', v); dl.setAttribute('aria-valuetext', H.fmt(v) + this._unit()); }
    R.querySelectorAll('.stp').forEach((x) => x.toggleAttribute('disabled', +x.dataset.d < 0 ? v <= mn : v >= mx));
  }
  _commit() { clearTimeout(this._ct); const v = this._pend, s = H.st(this._hass, this._config.entity); if (v == null || !s) return;
    if (Number(s.attributes.temperature) !== v) H.call(this._hass, 'climate', 'set_temperature', { entity_id: this._config.entity, temperature: v });
    clearTimeout(this._pt); this._pt = setTimeout(() => { this._pend = null; this.rerender(); }, 6000); }
  _nudge(d) { const s = H.st(this._hass, this._config.entity); if (!s) return; const { step } = this._lim(s), cur = this._pend != null ? this._pend : Number(s.attributes.temperature); if (!isFinite(cur)) return;
    const v = this._quant(cur + d * step); if (v === this._pend) return; H.haptic('selection'); this._pend = v; this._paint(v); this.rerender(); clearTimeout(this._ct); this._ct = setTimeout(() => this._commit(), 700); }
  afterRender() {
    const el = this.$.querySelector('.dl'); if (!el || !this._once(el, 'dial')) return;
    const st = () => H.st(this._hass, this._config.entity), off = () => { const s = st(); return !s || !H.ok(s) || s.state === 'off' || s.attributes.temperature == null; };
    const frac = (ev) => { const r = el.getBoundingClientRect(), th = (Math.atan2(ev.clientY - (r.top + r.height / 2), ev.clientX - (r.left + r.width / 2)) * 180) / Math.PI, rel = (((th - HG_ST_DIAL.a0) % 360) + 360) % 360;
      return rel <= HG_ST_DIAL.sw ? rel / HG_ST_DIAL.sw : rel < 315 ? 1 : 0; };
    const val = (f) => { const { mn, mx } = this._lim(st()); return this._quant(mn + f * (mx - mn)); };
    let on = false;
    el.addEventListener('pointerdown', (ev) => { if (off() || (ev.button || 0) > 0) return; on = true; try { el.setPointerCapture(ev.pointerId); } catch (x) { /* */ } this._busy = true; el.classList.add('drag'); this._pend = val(frac(ev)); this._paint(this._pend); ev.preventDefault(); });
    el.addEventListener('pointermove', (ev) => { if (!on) return; const v = val(frac(ev)); if (v !== this._pend) { H.haptic('selection'); this._pend = v; this._paint(v); } });
    const end = (ev) => { if (!on) return; on = false; this._busy = false; el.classList.remove('drag'); if (ev.type === 'pointercancel') { this._pend = null; this.rerender(); } else { this._commit(); this.rerender(); } };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', (ev) => { const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 4, PageDown: -4 }[ev.key]; if (!d || off()) return; ev.preventDefault(); this._nudge(d); });
  }
  set hass(h) { const o = this._hass, c = this._config; this._hass = h; window.__hgHass = h;
    if (this._pend != null && o && c) { const a = H.st(h, c.entity), b = H.st(o, c.entity); if (a && b && a.attributes.temperature !== b.attributes.temperature && Number(a.attributes.temperature) === this._pend) this._pend = null; }
    this._update(); }
  get hass() { return this._hass; }
  disconnectedCallback() { super.disconnectedCallback(); clearTimeout(this._ct); clearTimeout(this._pt); if (this._pend != null) this._commit(); }
  _menu(el, key, svc, items, cur) { const L = items || []; if (!L.length) return; hgOverlay.menu(el, L.map((x) => ({ label: key === 'fan_mode' ? hgFanL(x) || x : key === 'swing_mode' ? hgSwingL(x) || x : x, value: x, checked: x === cur }))).then((v) => { if (v != null && v !== cur) H.call(this._hass, 'climate', svc, { entity_id: this._config.entity, [key]: v }); }); }
  onAct(a, el) {
    const c = this._config, h = this._hass, s = H.st(h, c.entity); if (!s) return; const id = { entity_id: c.entity }, at = s.attributes;
    if (a === 'step') return this._nudge(+el.dataset.d);
    if (a === 'power') { H.haptic('light'); const sf = at.supported_features || 0;
      if (s.state === 'off') { const back = this._last || (at.hvac_modes || []).find((x) => x !== 'off') || 'heat'; return sf & 256 ? H.call(h, 'climate', 'turn_on', id) : H.call(h, 'climate', 'set_hvac_mode', { ...id, hvac_mode: back }); }
      this._last = s.state; return sf & 128 ? H.call(h, 'climate', 'turn_off', id) : H.call(h, 'climate', 'set_hvac_mode', { ...id, hvac_mode: 'off' }); }
    if (a === 'mode') { const L = at.hvac_modes || []; if (L.length < 2) return; return hgOverlay.menu(el, L.map((m) => ({ label: m === 'off' ? hgT('common.off_fem') : (HG_AC_MODE[m] ? HG_AC_MODE[m].l : m), icon: (HG_AC_MODE[m] || {}).i, value: m, checked: m === s.state })))
      .then((v) => { if (v != null && v !== s.state) { H.haptic('light'); H.call(h, 'climate', 'set_hvac_mode', { ...id, hvac_mode: v }); } }); }
    if (a === 'fan') return this._menu(el, 'fan_mode', 'set_fan_mode', at.fan_modes, at.fan_mode);
    if (a === 'swing') return this._menu(el, 'swing_mode', 'set_swing_mode', at.swing_modes, at.swing_mode);
    if (a === 'preset') return this._menu(el, 'preset_mode', 'set_preset_mode', at.preset_modes, at.preset_mode);
  }
  getGridOptions() { return { columns: 6, rows: 4, min_columns: 3, max_columns: 12, min_rows: 2, max_rows: 8 }; }
  getCardSize() { return 4; }
}
hgReg('hg-studio-climate-card', HGStudioClimateCard, hgTLazy('cards.studio_climate.picker_name'), hgTLazy('cards.studio_climate.picker_description'));
