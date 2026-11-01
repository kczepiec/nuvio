/* --- pasek postępu: dowolna wartość 0–100 albo min–max, z progami ostrzeżenia --- */
class HGProgressCard extends HGBase {
  static getStubConfig(h) { return { entity: hgStub(h, ['sensor'], (s) => s.attributes.unit_of_measurement === '%') || hgStub(h, ['sensor'], hgNum) || null }; }
  defaults() { return { entity: null, name: null, icon: null, min: 0, max: null, warn: null, bad: null, unit: null, decimals: 0 }; }
  css() { return HG_NV_CSS; }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity);
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.progress.choose_a_sensor')}</span></ha-card>`;
    const a = s.attributes, v = parseFloat(s.state), mn = +c.min || 0, mx = c.max != null ? +c.max : (a.unit_of_measurement === '%' || a.max == null ? 100 : +a.max), u = c.unit ?? a.unit_of_measurement ?? '';
    const p = isFinite(v) ? ((v - mn) / (mx - mn || 1)) * 100 : 0, tone = c.bad != null && v >= c.bad ? 'bad' : c.warn != null && v >= c.warn ? 'warn' : '';
    const lvl = p < 34 ? hgT('cards.progress.low') : p < 67 ? hgT('common.medium') : hgT('cards.progress.high');
    return `<ha-card class="glass ${H.ok(s) ? '' : 'un'}">${hgUI.header(c.name || H.name(h, c.entity), { icon: c.icon || a.icon, right: hgUI.iconBtn('mdi:arrow-expand', 'more', hgT('common.details'), { bare: true, size: 'sm' }) })}
      <div class="nv-mid">${hgUI.big(isFinite(v) ? v : '–', { d: +c.decimals || 0, unit: u === '%' ? '%' : u, caption: H.ok(s) ? lvl : H.t(h, s) })}${hgUI.progress(p, { tone, min: H.fmt(mn, 0), max: H.fmt(mx, 0) + (u ? ' ' + u : ''), label: c.name || H.name(h, c.entity) })}</div></ha-card>`; }
  onAct(a) { if (a === 'more') H.fire(this, 'hass-more-info', { entityId: this._config.entity }); }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-progress-card', HGProgressCard, hgTLazy('cards.progress.picker_name'), hgTLazy('cards.progress.picker_description'));
