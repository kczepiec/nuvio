/* --- hg-pv-card: stan falownika, produkcja teraz i dziś, ostatnia aktywność --- */
class HGPvCard extends HGBase {
  defaults() { return { title: hgT('cards.pv.solar'), icon: 'mdi:solar-power-variant-outline', power: null, today: null, state: null, temperature: null, strings: [], extra: [] }; }
  ents() { const c = this._config; return [c.power, c.today, c.state, c.temperature, ...c.strings.map((s) => s.entity || s.power), ...c.extra].filter(Boolean); }
  _extraSig() { return [Math.floor(Date.now() / 60000), this._last ? this._last.t : 0]; }
  connectedCallback() { super.connectedCallback(); this._ld(); }
  set hass(h) { const first = !this._hass; this._hass = h; if (first) this._ld(); this._update(); }
  get hass() { return this._hass; }
  async _ld() {
    // ostatni dzień z produkcją wg statystyk panelu Energia (gdy falownik offline)
    const h = this._hass; if (!h || this._ldg) return; this._ldg = true;
    try { const pr = await HGEnergyPrefs.get(h); if (pr.production.length) { const v = await HGStats.daily(h, pr.production, 30);
      const days = [...v.days].reverse(), sum = (d) => pr.production.reduce((a, id) => a + Math.max(0, (v.byId[id] || {})[d.__k] || 0), 0);
      this._today = days.length && days[0].toDateString() === new Date().toDateString() ? sum(days[0]) : null;   // dziś wg liczników całkowitych (dzienny czujnik falownika zeruje się po rozłączeniu)
      for (const d of days) { const s = sum(d); if (s > 0.05) { this._last = { t: Date.now(), d, s }; break; } }
      if (!this._last) this._last = { t: Date.now(), d: null, s: 0 }; else this._last.t = Date.now(); } } catch (e) { this._last = { t: Date.now(), d: null, s: 0 }; }
    // dziś wg historii czujnika dziennego: suma odcinków między zerowaniami (falownik zeruje licznik po każdym ponownym uruchomieniu;
    // licznik całkowity po powrocie skacze o produkcję z okresów, których HA nie widział -> zawyża)
    try { const c = this._config; if (c.today) { const m0 = new Date(HGStats.midnight(Date.now(), HGStats.tz(h)));   // północ w strefie HA
      const r = await h.callWS({ type: 'history/history_during_period', start_time: m0.toISOString(), entity_ids: [c.today], minimal_response: true, no_attributes: true });
      const arr = (r && r[c.today]) || []; let tot = 0, seg = 0, any = false;
      for (const x of arr) { const v = parseFloat(x.s != null ? x.s : x.state); if (!isFinite(v)) continue; any = true; if (v + 0.001 < seg) { tot += seg; seg = v; } else seg = v; }
      this._dsum = any ? tot + seg : null; } } catch (e) { this._dsum = null; }
    this._ldg = false; this.rerender();
  }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s2); padding:var(--s2) var(--s3) var(--s3); }
.hd .ic{ color:var(--hg-accent-tx); }
.st{ display:flex; align-items:center; gap:var(--s2); }
.bd{ width:40u; height:40u; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; color:#fff; background:var(--c); }
.off .st b{ color:#4A4E54; }
.on .bd{ color:#1E2023; } .bd ha-icon{ width:20u; height:20u; } .on .bd ha-icon{ animation:var(--hg-loop, hgspin 8s linear infinite); }
.st b{ display:block; font-size:var(--fs-md); font-weight:600; color:color-mix(in srgb, var(--c), var(--hg-ink, #000) calc(var(--hg-ink-p, 40%) * 1.7)); } .st div span{ display:block; font-size:var(--fs-xs); color:#5A5E64; margin-top:2u; }
.kv{ display:grid; grid-template-columns:repeat(auto-fit, minmax(max(calc(var(--k) * 84), 112px), 1fr)); gap:var(--s1); }
@media (max-width:600px){ .kv{ grid-template-columns:repeat(2, minmax(0, 1fr)); } }
.kv[hidden]{ display:none; } .kv div{ padding:var(--s1) var(--s1); border-radius:var(--r-sm); background:rgba(255,255,255,.55); min-width:0; } .kv small{ display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; font-size:var(--fs-xs); color:#5A5E64; overflow:hidden; line-height:1.25; min-height:2.5em; }
.kv b{ font-size:var(--fs-md); font-weight:600; font-variant-numeric:tabular-nums; white-space:nowrap; } .kv b em{ font-style:normal; font-size:var(--fs-xs); font-weight:400; color:#5A5E64; margin-left:2u; }
.pvn{ font-size:var(--fs-xs); color:#4A4E54; line-height:1.45; padding:var(--s1) var(--s2); border-radius:var(--r-sm); background:var(--hg-accent-faint); white-space:normal; }
`);
  }
  render() {
    const c = this._config, h = this._hass, s = H.st(h, c.power), on = H.ok(s);
    const w = hgW(h, c.power), td = H.num(h, c.today), tmp = H.num(h, c.temperature), dst = H.st(h, c.state);
    const col = on ? (w > 0 ? 'var(--hg-accent)' : '#6E747A') : '#6E747A';
    const since = s ? hgRel(new Date(s.last_changed)) : '';
    const lbl = on ? (w > 0 ? hgT('cards.pv.producing') : hgT('cards.pv.no_production_night_clouds')) : hgT('cards.pv.inverter_offline');
    if (this._last && Date.now() - this._last.t > 15 * 60000 && !this._ldg) { this._last.t = Date.now(); setTimeout(() => this._ld(), 0); }
    // „Dziś”: większa z wartości czujnika dziennego i przyrostu liczników całkowitych; 0 przy produkcji = brak danych
    // czujnik dzienny ma rozdzielczość 0,1 kWh: 0 przy produkcji = „< 0,1”; bez czujnika dziennego -> przyrost licznika całkowitego
    const dsum = this._dsum != null ? Math.max(this._dsum, td || 0) : td;
    const tday = dsum != null ? dsum : this._today;
    const dz = tday == null ? ['–', ''] : tday < 0.05 && w > 0 ? [hgT('cards.pv.0_1'), 'kWh'] : [H.fmt(tday, 1), 'kWh'];
    const kv = [[hgT('common.now_cap'), w != null ? [H.fmt(w, 0), 'W'] : ['–', '']], [hgT('common.today'), dz]];
    for (const st of c.strings) { const v = hgW(h, st.entity || st.power); kv.push([st.name, v != null ? [H.fmt(v, 0), 'W'] : ['–', '']]); }
    if (c.temperature) kv.push([hgT('cards.pv.inverter_temperature'), tmp != null ? [H.fmt(tmp, 1), '°C'] : ['–', '']]);
    const L = this._last;
    const last = L && L.d ? `${H.lv(hgT('cards.pv.last_production'), `<b>${H.esc(L.d.toLocaleDateString(HG_LOC(), { weekday: 'long', day: 'numeric', month: 'long' }))}</b> · ${H.fmt(L.s, 2)} kWh.`)}` : L ? hgT('cards.pv.no_production_in_statistics') : '';
    const note = !on ? `<div class="pvn">${last} ${hgT('cards.pv.days_without_inverter_data')}</div>`
      : dst && H.ok(dst) ? `<div class="pvn" style="background:var(--hg-accent-faint)">${H.lv(hgT('cards.pv.inverter_state'), `${H.esc(H.t(h, dst))}`)}</div>` : '';
    return `<ha-card class="glass warm ${on ? 'on' : 'off'}" style="--c:${col}"><div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span><span class="sp"></span>
        <button class="ib kebab" data-act="more" aria-label="${hgT('cards.pv.inverter_details')}" title="${hgT('cards.pv.details_and_history')}">${H.icon('mdi:dots-vertical')}</button></div>
      <div class="st"><span class="bd">${H.icon(on ? 'mdi:white-balance-sunny' : 'mdi:solar-panel')}</span><div><b>${lbl}</b><span>${on ? hgT('cards.pv.updated_ago', { time: H.esc(since) }) : since ? hgT('cards.pv.last_data_since', { time: H.esc(since) }) : hgT('cards.pv.no_entity')}</span></div></div>
      <div class="kv" ${on ? '' : 'hidden'}>${kv.map(([k, [v, u]]) => `<div><small>${H.esc(k)}</small><b>${v}<em>${u}</em></b></div>`).join('')}</div>${note}</ha-card>`;
  }
  onAct(a) { if (a === 'more') H.fire(this, 'hass-more-info', { entityId: this._config.power }); }
  getCardSize() { return 4; }
}
hgReg('hg-pv-card', HGPvCard, hgTLazy('cards.pv.picker_name'), hgTLazy('cards.pv.picker_description'));
