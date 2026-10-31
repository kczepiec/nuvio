/* ===================== STUDIO: ENERGIA =====================
   Zużycie w kWh za dzień / tydzień / miesiąc, zmiana względem poprzedniego okresu i słupki (HG_DAYBARS_CSS).
   Config: { entity: sensor energii (total_increasing, ze statystykami), compare?: false wyłącza zmianę, title?, period?: 'day'|'week'|'month', tier? }
   Dzień: godziny dzisiaj kontra wczoraj do tej samej godziny. Tydzień / miesiąc: ostatnie 7 / 30 dni kontra poprzednie tyle samo. */
const HG_ST_EN = { day: () => hgT('cards.studio_energy.vs_yesterday'), week: () => hgT('cards.studio_energy.vs_last_week'), month: () => hgT('cards.studio_energy.vs_last_month') };
class HGStudioEnergyCard extends HGStudioCard {
  static getStubConfig(h) { return { entity: hgStub(h, ['sensor'], (s) => s.attributes.device_class === 'energy') || null }; }
  defaults() { return { entity: null, title: null, compare: true, period: 'day' }; }
  ents() { return [this._config.entity].filter(Boolean); }
  _mode() { return this._m || (HG_ST_EN[this._config.period] ? this._config.period : 'day'); }
  _xsig() { const d = this._d && this._d[this._mode()]; return [this._mode(), d ? d.t : 0]; }
  css() {
    return HG_STUDIO_CSS + HG_DAYBARS_CSS + U(`
ha-card.glass{ gap:var(--s1); }
.sthd .tgl{ flex:none; } .sthd .tgl .nv-tabs{ padding:2u; } .sthd .tgl .nv-pill{ height:22u; padding:0 8u; font-size:var(--fs-xs); }
.bd{ flex:1; min-height:0; display:flex; align-items:flex-end; justify-content:space-between; gap:var(--s3); }
.lf{ display:flex; flex-direction:column; justify-content:flex-end; gap:6u; min-width:0; flex:none; }
.lf .nv-big{ --nv-big:clamp(28px, 12cqi, 52px); align-items:baseline; flex-wrap:nowrap; } .lf .nv-big small{ font-size:.38em !important; margin-left:5u !important; opacity:.8; font-weight:400; }
.dt{ display:flex; align-items:center; gap:4u; font-size:var(--fs-sm); white-space:nowrap; } .dt ha-icon{ width:13u; height:13u; flex:none; } .dt .p{ font-weight:600; } .dt .v{ opacity:.65; }
.dt.dn .p, .dt.dn ha-icon{ color:var(--hg-accent-tx); } .dt.up .p, .dt.up ha-icon{ color:var(--hg-trend-up); }
.bars{ flex:1; min-width:0; height:100%; max-height:120px; min-height:48px; display:flex; }
.bars .ch{ flex:1; align-self:stretch; gap:clamp(1px, .5cqi, 4px); } .bars .ch::after{ display:none; } .bars .bw{ top:0; } .bars .d{ padding-top:0; } .bars .pr i{ min-height:4px; }
.bars .d small{ display:none; } .bars.lb .d small{ display:block; } .bars .d.today small{ color:inherit; }
.bars .bs{ min-height:0; } .bars .d:not(.today) .pr i:not(.z):not(.nd){ opacity:.9; }
.ld{ font-size:var(--fs-sm); opacity:.6; }
.compact .lf .nv-big{ --nv-big:clamp(26px, 20cqi, 44px); } ha-card.glass.compact{ padding:var(--s2); justify-content:center; }
`);
  }
  connectedCallback() { super.connectedCallback(); this._load(); clearInterval(this._iv); this._iv = setInterval(() => this._load(true), 5 * 60 * 1000); }
  disconnectedCallback() { super.disconnectedCallback(); clearInterval(this._iv); }
  set hass(h) { const first = !this._hass; this._hass = h; window.__hgHass = h; if (first) this._load(); this._update(); }
  get hass() { return this._hass; }
  setConfig(c) { super.setConfig(c); this._d = null; this._m = null; if (this._hass) this._load(); }
  _load(force) { const m = this._mode(), h = this._hass, c = this._config; if (!h || !c || !c.entity) return Promise.resolve();
    const d = this._d && this._d[m]; if (!force && d && Date.now() - d.t < 5 * 60e3) return Promise.resolve();
    this._ld = this._ld || {}; if (this._ld[m]) return this._ld[m];
    return (this._ld[m] = this._fetch(m).then((r) => { (this._d = this._d || {})[m] = r; }).catch(() => { (this._d = this._d || {})[m] = { t: Date.now(), vals: [], tot: 0, prev: 0, has: false }; }).finally(() => { delete this._ld[m]; this.rerender(); })); }
  async _fetch(m) {
    const h = this._hass, e = this._config.entity, tz = HGStats.tz(h), now = Date.now();
    if (m === 'day') {
      const t0 = HGStats.midnight(now, tz), y0 = HGStats.midnight(t0 - 43200000, tz), nowH = Math.min(23, Math.floor((now - t0) / 3600e3));
      const r = await h.callWS({ type: 'recorder/statistics_during_period', start_time: new Date(y0).toISOString(), statistic_ids: [e], period: 'hour', types: ['change'], units: { energy: 'kWh' } });
      const vals = new Array(24).fill(null).map((x, i) => (i <= nowH ? 0 : null)); let prev = 0; const rows = r[e] || [];
      for (const row of rows) { const st = typeof row.start === 'number' ? row.start : Date.parse(row.start), v = row.change || 0;
        if (st >= t0) { const k = Math.min(23, Math.floor((st - t0) / 3600e3)); if (vals[k] != null) vals[k] += v; } else if (Math.floor((st - y0) / 3600e3) <= nowH) prev += v; }
      return { t: now, vals, tot: vals.reduce((a, b) => a + (b || 0), 0), prev, has: rows.length > 0, lbl: null };
    }
    const n = m === 'week' ? 7 : 30, dd = await HGStats.daily(h, [e], n * 2), by = dd.byId[e] || {}, all = dd.keys.map((k) => by[k] || 0), vals = all.slice(n), sum = (a) => a.reduce((x, y) => x + y, 0);
    return { t: now, vals, tot: sum(vals), prev: sum(all.slice(0, n)), has: !!dd.has, lbl: m === 'week' ? dd.days.slice(n).map((d) => new Intl.DateTimeFormat(HG_LOC(), { weekday: 'narrow' }).format(d)) : null };
  }
  _bars(d) {
    const v = d.vals, mx = Math.max(0, ...v.filter((x) => x != null)) || 1, last = v.reduce((a, x, i) => (x != null ? i : a), -1);
    return `<div class="bars ${d.lbl ? 'lb' : ''}"><div class="ch" style="--n:${v.length};--bwf:.6;--bwmin:3px;--bwmax:14px" role="img" aria-label="${H.esc(hgT('cards.studio_energy.chart_aria'))}">${v.map((x, i) =>
      `<div class="d ${i === last ? 'today' : ''}"><span class="bs"><span class="bw"><span class="pr" style="height:${x == null ? 0 : Math.max(3, (x / mx) * 100).toFixed(1)}%"><i class="${x == null ? 'nd' : x > 0 ? '' : 'z'}" style="--c:${x != null && (i === last || x === mx) ? 'var(--hg-accent)' : 'color-mix(in srgb, currentColor 30%, transparent)'}"></i></span></span></span>${d.lbl ? `<small>${H.esc(d.lbl[i])}</small>` : ''}</div>`).join('')}</div></div>`;
  }
  render() {
    const c = this._config, h = this._hass, s = H.st(h, c.entity), tier = this._tier(), m = this._mode();
    const ttl = c.title || hgT('cards.energy.energy'), ic = `<ha-icon icon="mdi:lightning-bolt"></ha-icon>`;
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.studio_energy.choose_an_energy_sensor')}</span></ha-card>`;
    if (!H.ok(s)) return `<ha-card class="glass un ${tier}"><div class="sthd">${ic}<span class="nm">${H.esc(ttl)}</span></div><div class="nv-empty">${hgT('common.state_unavailable_masc')}</div></ha-card>`;
    const d = this._d && this._d[m], tabs = hgUI.tabs([{ id: 'day', label: hgT('cards.studio_energy.day') }, { id: 'week', label: hgT('cards.studio_energy.week') }, { id: 'month', label: hgT('cards.studio_energy.month') }], m, 'tab', hgT('cards.studio_energy.period_aria'));
    const hd = `<div class="sthd">${ic}<span class="nm">${H.esc(ttl)}</span>${tier !== 'compact' ? `<span class="tgl">${tabs}</span>` : ''}</div>`;
    if (!d) return `<ha-card class="glass ${tier}">${tier === 'compact' ? '' : hd}<div class="ld" role="status">${hgT('cards.energy_stats.loading_statistics')}</div></ha-card>`;
    if (!d.has) return `<ha-card class="glass ${tier}">${tier === 'compact' ? '' : hd}<div class="nv-empty">${hgT('cards.studio_energy.no_statistics')}</div></ha-card>`;
    const val = hgUI.big(d.tot, { d: d.tot < 10 ? 2 : d.tot < 100 ? 1 : 0, unit: 'kWh' });
    let dl = '';
    if (c.compare !== false && d.prev > 0) { const p = ((d.tot - d.prev) / d.prev) * 100, lo = p < 0, r = Math.round(Math.abs(p));
      dl = `<div class="dt ${r === 0 ? '' : lo ? 'dn' : 'up'}">${r === 0 ? '' : H.icon(lo ? 'mdi:arrow-down' : 'mdi:arrow-up')}<span class="p">${H.esc(H.pct(r))}</span><span class="v">${HG_ST_EN[m]()}</span></div>`; }
    const lf = `<div class="lf">${val}${dl}</div>`;
    return `<ha-card class="glass ${tier}">${tier === 'compact' ? '' : hd}<div class="bd">${lf}${tier === 'compact' ? '' : this._bars(d)}</div></ha-card>`;
  }
  onAct(a, el) { if (a !== 'tab') return; const m = el.dataset.id; if (!HG_ST_EN[m] || m === this._mode()) return; H.haptic('selection'); this._m = m; this._load(); this.rerender(); }
  getGridOptions() { return { columns: 6, rows: 3, min_columns: 3, max_columns: 12, min_rows: 2, max_rows: 6 }; }
  getCardSize() { return 3; }
}
hgReg('hg-studio-energy-card', HGStudioEnergyCard, hgTLazy('cards.studio_energy.picker_name'), hgTLazy('cards.studio_energy.picker_description'));
