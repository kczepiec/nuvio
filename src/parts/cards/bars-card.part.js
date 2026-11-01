/* Raport zużycia: słupki energii ze statystyk */
class HGBarsCard extends HGBase {
  defaults() { return { title: hgT('cards.bars.grid_consumption'), icon: 'mdi:transmission-tower', statistics: [], labels: [], colors: ['var(--hg-accent)', 'var(--hg-accent)', 'var(--hg-accent)', 'var(--hg-accent)'], days: 7, unit: 'kWh', locale: null, expand: null, no_data: hgT('common.no_data_source') }; }
  ents() { return []; }
  _extraSig() { return [this._data ? this._data.t : 0]; }
  connectedCallback() { super.connectedCallback(); this._load(); this._iv = setInterval(() => this._load(), 15 * 60 * 1000); }
  disconnectedCallback() { clearInterval(this._iv); }
  set hass(h) { const first = !this._hass; this._hass = h; if (first) this._load(); this._update(); }
  get hass() { return this._hass; }
  async _load() {
    if (!this._hass || !this._config || this._loading) return; this._loading = true;
    try { this._data = { t: Date.now(), v: await HGStats.daily(this._hass, this._config.statistics, this._config.days) }; this._err = null; }
    catch (e) { this._err = String(e && e.message || e); }
    this._loading = false; this.rerender();
  }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; }
.sum{ display:flex; align-items:baseline; gap:var(--s1); margin-top:8u; } .sum b{ font-size:calc(15u * var(--hg-fsv, 1)); font-weight:400; } .sum span{ font-size:var(--fs-sm); color:#4D5157; }
.lg{ display:flex; gap:var(--s2); flex-wrap:wrap; font-size:var(--fs-xs); color:#4D5157; margin-top:6u; } .lg i{ display:inline-block; width:8u; height:8u; border-radius:3u; margin-right:4u; vertical-align:-1u; }
.bars{ flex:1; display:flex; align-items:flex-end; gap:var(--s1); margin-top:10u; min-height:80u; }
.b{ flex:1; display:flex; flex-direction:column; align-items:center; gap:4u; height:100%; justify-content:flex-end; }
.st{ width:100%; max-width:30u; display:flex; flex-direction:column-reverse; border-radius:var(--r-sm); overflow:hidden; background:rgba(255,255,255,.5); }
.st div{ width:100%; }
.b small{ font-size:var(--fs-xs); color:#3B3F45; } .b em{ font-style:normal; font-size:var(--fs-xs); color:#6A6E75; }
`);
  }
  render() {
    const c = this._config;
    const hd = `<div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span><span class="sp"></span>
      ${c.expand ? `<button class="ib" data-act="expand" aria-label="${hgT('common.expand')}" title="${hgT('common.details')}">${H.icon('mdi:arrow-expand')}</button>` : ''}</div>`;
    if (this._err || (this._data && !this._data.v.has)) return `<ha-card class="glass">${hd}<div class="ph"><b>${H.esc(c.no_data)}</b>${H.esc(this._err || '')}</div></ha-card>`;
    if (!this._data) return `<ha-card class="glass">${hd}</ha-card>`;
    const { days, byId } = this._data.v;
    const rows = days.map((d) => c.statistics.map((id) => Math.max(0, byId[id][d.__k || H.dayKey(d)] || 0)));
    const tot = rows.map((r) => r.reduce((a, b) => a + b, 0)); const mx = Math.max(...tot, 0.001);
    const week = tot.reduce((a, b) => a + b, 0);
    return `<ha-card class="glass">${hd}
      <div class="sum"><b>${H.fmt(week, 1)}</b><span>${H.esc(c.unit)} · ${hgT('cards.bars.days_count', { count: c.days })}</span></div>
      <div class="lg">${c.statistics.map((id, i) => `<span><i style="background:${c.colors[i % c.colors.length]}"></i>${H.esc(c.labels[i] || id)}</span>`).join('')}</div>
      <div class="bars">${rows.map((r, i) => `<div class="b" title="${H.lv(H.esc(days[i].toLocaleDateString(c.locale || HG_LOC())), `${H.fmt(tot[i], 1)} ${c.unit}`)}"><em>${H.fmt(tot[i], 1)}</em>
        <div class="st" style="height:${Math.max(3, (tot[i] / mx) * 100)}%">${r.map((v, j) => `<div style="height:${tot[i] ? (v / tot[i]) * 100 : 0}%;background:${c.colors[j % c.colors.length]}"></div>`).join('')}</div>
        <small>${H.DAYS[days[i].getDay()]}</small></div>`).join('')}</div></ha-card>`;
  }
  onAct(a) { if (a === 'expand') H.action(this, this._hass, this._config.expand); }
}
hgReg('hg-bars-card', HGBarsCard, hgTLazy('cards.bars.picker_name'), hgTLazy('cards.bars.picker_description'));
