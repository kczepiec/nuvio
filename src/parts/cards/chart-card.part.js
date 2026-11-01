/* Wykres: linia, obszar lub słupki z historii czujnika */
class HGChartCard extends HGBase {
  static getStubConfig(h) { return { entity: hgStub(h, ['sensor'], hgNum) || null }; }
  defaults() { return { entity: null, name: null, icon: null, hours: 24, style: 'area', tone: null, points: 48, decimals: 1 }; }
  css() { return HG_NV_CSS + U(`
.nv-spark.line path.a{ display:none; }
.bars{ display:flex; align-items:flex-end; gap:2u; height:var(--nv-sh, 70u); }
.bars i{ flex:1; min-width:2px; border-radius:3u 3u 1u 1u; height:var(--h); background:color-mix(in srgb, currentColor 22%, transparent); transition: height var(--hg-t-slow) var(--hg-ease-out); }
.bars i:last-child{ background:linear-gradient(180deg, var(--hg-accent-hi), var(--hg-accent)); box-shadow:0 0 10u var(--hg-accent-glow); }
.ax{ display:flex; justify-content:space-between; font-size:var(--fs-xs); opacity:.6; }
@container (max-width: 220px){ .nv-spark, .bars{ --nv-sh: 46u; } }
@container (min-width: 420px){ .nv-spark, .bars{ --nv-sh: 110u; } }
`); }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity);
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.chart.choose_a_numeric_sensor')}</span></ha-card>`;
    this._load(); const u = s.attributes.unit_of_measurement || '', v = parseFloat(s.state), d = +c.decimals;
    const pts = (this._pts || []).slice(); if (pts.length && isFinite(v)) pts[pts.length - 1] = v;
    const tip = isFinite(v) ? `${H.fmt(v, d)}${u ? ' ' + u : ''}` : H.t(h, s), ax = [`-${c.hours} h`, hgT('common.now')];
    let g = ''; if (pts.filter(isFinite).length >= 2) {
      if (c.style === 'bars') { const ok = pts.filter(isFinite), mn = Math.min(0, ...ok), mx = Math.max(...ok) || 1; g = `<div class="bars" aria-hidden="true">${pts.map((x) => `<i style="--h:${isFinite(x) ? Math.max(2, ((x - mn) / (mx - mn || 1)) * 100).toFixed(1) : 0}%"></i>`).join('')}</div><div class="ax"><span>${ax[0]}</span><span>${ax[1]}</span></div>`; }
      else g = hgUI.spark(pts, { tip, axis: ax, tone: c.tone || '' }).replace('class="nv-spark', `class="nv-spark ${c.style === 'line' ? 'line' : ''}`);
    } else g = `<div class="nv-empty">${this._pts ? hgT('cards.chart.not_enough_history_yet') : hgT('common.loading')}</div>`;
    return `<ha-card class="glass ${H.ok(s) ? '' : 'un'}">${hgUI.header(c.name || H.name(h, c.entity), { icon: c.icon || s.attributes.icon, right: hgUI.iconBtn('mdi:arrow-expand', 'more', hgT('common.details'), { bare: true, size: 'sm' }) })}
      ${hgUI.big(isFinite(v) ? v : null, { d, unit: u, caption: H.ok(s) ? '' : H.t(h, s) })}<div class="nv-mid">${g}</div></ha-card>`; }
  /* historia ze wspólnej pamięci (ui/history), odświeżana co 5 minut */
  _load() { const c = this._config; if (this._ld && Date.now() - this._ld < 5 * 60e3 && this._le === c.entity) return; this._ld = Date.now(); this._le = c.entity;
    hgHistory(this._hass, c.entity, +c.hours || 24).then((r) => { this._pts = hgBuckets(r, +c.hours || 24, Math.max(8, +c.points || 48)); this.rerender(); }); }
  onAct(a) { if (a === 'more') H.fire(this, 'hass-more-info', { entityId: this._config.entity }); }
  getGridOptions() { return { columns: 6, rows: 3 }; }
}
hgReg('hg-chart-card', HGChartCard, hgTLazy('cards.chart.picker_name'), hgTLazy('cards.chart.picker_description'));
