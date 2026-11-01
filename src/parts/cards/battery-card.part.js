/* Baterie: lista czujników poziomu baterii */
class HGBatteryCard extends HGBase {
  defaults() { return { title: null, entities: [], low: 20, limit: 0 }; }
  _list() { const c = this._config, h = this._hass; return (c.entities && c.entities.length ? c.entities : hgEnts(h, ['sensor'], ['battery'])).filter((e) => h.states[e]); }
  ents() { return this._hass ? this._list() : (this._config.entities || []); }
  _extraSig() { return this._hass ? this._list().length : 0; }
  css() { return HG_G14_CSS; }
  render() { const c = this._config, h = this._hass, lo = +c.low || 20;
    const xs = this._list().map((e) => [e, H.num(h, e)]).sort((a, b) => (a[1] ?? 999) - (b[1] ?? 999)), nLo = xs.filter((x) => x[1] != null && x[1] <= lo).length, L = +c.limit > 0 ? xs.slice(0, +c.limit) : xs;
    if (!xs.length) return `<ha-card class="glass"><div class="ph"><b>${hgT('cards.battery.no_battery_sensors')}</b>${hgT('cards.battery.pick_sensors_or_leave')}</div></ha-card>`;
    return `<ha-card class="glass">${hgHead('mdi:battery-heart-variant', c.title || hgT('cards.battery.batteries'), nLo ? hgT('cards.battery.low', { count: nLo }) : hgT('cards.battery.all_good'), !nLo, `<span class="cnt${nLo ? ' al' : ''}">${xs.length}</span>`)}
      <div class="ls">${L.map(([e, v]) => { const p = v == null ? 0 : Math.max(0, Math.min(100, v)), ic = v == null ? 'mdi:battery-unknown' : `mdi:battery${p >= 95 ? '' : p < 10 ? '-outline' : '-' + Math.floor(p / 10) * 10}`;
        return `<button class="li${v != null && v <= lo ? ' al' : ''}" style="all:unset;display:flex;align-items:center;gap:10px;min-height:40px;cursor:pointer" data-act="more" data-e="${H.esc(e)}">${H.icon(ic)}<span class="nm">${H.esc(H.name(h, e).replace(/\s*(bateria|battery)( level)?$/i, ''))}</span><span class="bar${p <= lo ? ' lo' : p <= 40 ? ' md' : ''}"><i style="width:${p}%"></i></span><span class="vl">${v == null ? '–' : H.pct(H.fmt(v, 0))}</span></button>`; }).join('')}</div></ha-card>`; }
  onAct(a, t) { if (a === 'more') hgMore(this, t.dataset.e); }
  getGridOptions() { return { columns: 6, rows: 4 }; }
}
hgReg('hg-battery-card', HGBatteryCard, hgTLazy('cards.battery.picker_name'), hgTLazy('cards.battery.picker_description'));
