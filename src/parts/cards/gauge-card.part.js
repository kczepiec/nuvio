/* ===================== WSKAŹNIK: łuk 240° dla czujnika liczbowego ===================== */
class HGGaugeCard extends HGBase {
  defaults() { return { entity: null, name: null, icon: null, min: null, max: null }; }
  ents() { return [this._config.entity]; }
  css() { return HG_GEN_CSS + U(`
ha-card.glass{ display:flex; flex-direction:column; align-items:stretch; gap:8px; padding:16px; }
.gg{ position:relative; flex:1; display:grid; place-items:center; min-height:120px; } .gg svg{ width:100%; max-width:220px; height:auto; overflow:visible; }
.gg .bg{ stroke:color-mix(in srgb, currentColor 12%, transparent); } .gg .fg{ stroke:var(--hg-accent); transition:stroke-dashoffset 400ms cubic-bezier(.2,0,0,1); }
.gg .num{ position:absolute; left:0; right:0; top:50%; transform:translateY(-35%); text-align:center; font-size:30px; font-weight:600; letter-spacing:-.02em; font-variant-numeric:tabular-nums; } .gg .num small{ font-size:14px; font-weight:500; opacity:.66; margin-left:2px; }
.gg .mm{ position:absolute; left:14%; right:14%; bottom:2%; display:flex; justify-content:space-between; font-size:11px; opacity:.6; font-variant-numeric:tabular-nums; }
@media (prefers-reduced-motion:reduce){ .gg .fg{ transition:none; } }
`); }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity), nm = c.name || H.name(h, c.entity);
    if (!s) return `<ha-card class="glass"><div class="ph"><b>${hgT('cards.gauge.choose_a_sensor')}</b>${hgT('cards.gauge.any_numeric_sensor')}</div></ha-card>`;
    const u = s.attributes.unit_of_measurement || '', v = parseFloat(s.state), ok = isFinite(v), mn = c.min ?? (u === '°C' ? -20 : 0), mx = c.max ?? (u === '%' ? 100 : u === '°C' ? 40 : u === 'W' ? 5000 : u === 'ppm' ? 2000 : 100);
    const f = ok ? Math.max(0, Math.min(1, (v - mn) / (mx - mn))) : 0, R = 80, L = (2 * Math.PI * R) * (240 / 360), ic = c.icon || s.attributes.icon || 'mdi:gauge';
    const arc = 'M 30.72 140 A 80 80 0 1 1 169.28 140';
    return `<ha-card class="glass ${ok ? '' : 'un'}"><div class="gh"><span class="gic on">${H.icon(ic)}</span><span class="gn"><b>${H.esc(nm)}</b><small>${H.esc(ok ? (hgTD('cards.gauge.device_classes.' + s.attributes.device_class, null) || hgT('common.sensor')) : hgT('common.state_unavailable'))}</small></span></div>
      <div class="gg" role="meter" aria-label="${H.esc(nm)}" aria-valuemin="${mn}" aria-valuemax="${mx}" aria-valuenow="${ok ? v : ''}"><svg viewBox="0 0 200 170" aria-hidden="true"><path class="bg" d="${arc}" fill="none" stroke-width="14" stroke-linecap="round"/><path class="fg" d="${arc}" fill="none" stroke-width="14" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - f)}"/></svg>
      <span class="num">${ok ? `${H.fmt(v, 1)}<small>${H.esc(u)}</small>` : '–'}</span><span class="mm"><span>${H.fmt(mn)}</span><span>${H.fmt(mx)}</span></span></div></ha-card>`; }
  onAct() {}
  getGridOptions() { return { columns: 3, rows: 3 }; }
}
hgReg('hg-gauge-card', HGGaugeCard, hgTLazy('cards.gauge.picker_name'), hgTLazy('cards.gauge.picker_description'));
