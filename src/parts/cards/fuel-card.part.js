/* ===================== CENY PALIW: widżet, to samo źródło co pasek w nagłówku (wiz.fuel albo własna lista) ===================== */
class HGFuelCard extends HGBase {
  defaults() { return { title: '', fuel: null }; }
  _list() { const c = this._config; return (Array.isArray(c.fuel) && c.fuel.length ? c.fuel : ((HGL.data.wiz || {}).fuel || [])).filter((f) => f && f.entity); }
  ents() { return this._list().flatMap((f) => [f.entity, f.change].filter(Boolean)); }
  _extraSig() { return (HGL.data.wiz || {}).fuel || null; }
  connectedCallback() { super.connectedCallback(); this._lsub = this._lsub || (() => { this._entsC = null; this.rerender(); }); HGL.subs.add(this._lsub); }
  disconnectedCallback() { if (this._lsub) HGL.subs.delete(this._lsub); }
  css() { return `.fu{ display:flex; flex-direction:column; gap:8px; padding:14px; height:100%; box-sizing:border-box; } .fh{ display:flex; align-items:center; gap:8px; font-weight:600; font-size:14px; } .fh ha-icon{ --mdc-icon-size:20px; opacity:.8; }
.fr{ all:unset; cursor:pointer; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:10px; min-height:44px; padding:0 10px; border-radius:12px; background:color-mix(in srgb, currentColor 6%, transparent); }
.fl{ font-weight:700; font-size:12px; letter-spacing:.04em; padding:3px 8px; border-radius:8px; background:color-mix(in srgb, var(--hg-accent, #63D71E) 22%, transparent); } .fr b{ font-size:16px; font-variant-numeric:tabular-nums; }
.tr{ font-size:12px; opacity:.75; display:flex; align-items:center; gap:2px; } .tr.up{ color:#ff7a6b; opacity:1; } .tr.dn{ color:#58d68d; opacity:1; } .tr ha-icon{ --mdc-icon-size:14px; } .em{ opacity:.6; font-size:13px; } .fu{ container-type:inline-size; } .fr b{ white-space:nowrap; }
@container (max-width: 230px){ .fr{ grid-template-columns:minmax(0,1fr) auto; column-gap:6px; padding:6px 10px; } .fl{ justify-self:start; font-size:11px; overflow-wrap:anywhere; } .fr b{ font-size:14px; } .tr{ grid-column:1 / -1; } .tr:empty{ display:none; } }`; }
  render() { const h = this._hass, c = this._config, L = this._list();
    const rows = L.map((f) => { const s = H.st(h, f.entity), v = s ? parseFloat(s.state) : NaN; if (!H.ok(s) || !isFinite(v)) return '';
      const ch = H.st(h, f.change), ca = (H.ok(ch) && ch.attributes) || {}, gr = Number(ca.roznica_gr), known = H.ok(ch) && isFinite(gr) && ca.cena_jutro != null, dir = !known || gr === 0 ? 'eq' : gr > 0 ? 'up' : 'dn';
      const price = `${v.toLocaleString(HG_LOC(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${f.unit || 'zł'}`;
      const tom = !f.change ? '' : !known ? hgT('cards.fuel.tomorrow_no_data') : gr === 0 ? hgT('cards.fuel.no_change_tomorrow') : `${gr > 0 ? '+' : '−'}${Math.abs(gr)} gr`;
      return `<button class="fr" data-act="more" data-e="${H.esc(f.entity)}"><span class="fl">${H.esc(String(f.label || H.name(h, f.entity)).toUpperCase())}</span><b>${price}</b><span class="tr ${dir}">${f.change ? H.icon(dir === 'up' ? 'mdi:arrow-up' : dir === 'dn' ? 'mdi:arrow-down' : 'mdi:equal') : ''}${H.esc(tom)}</span></button>`; }).join('');
    return `<ha-card class="glass"><div class="fu"><div class="fh">${H.icon(c.icon || 'mdi:gas-station-outline')}<span>${H.esc(c.title || c.name || hgT('common.fuel_prices'))}</span></div>${rows || `<div class="em">${hgT('cards.fuel.add_fuel_price_sensors')}</div>`}</div></ha-card>`; }
  onAct(a, t) { if (a === 'more') H.fire(this, 'hass-more-info', { entityId: t.dataset.e }); }
}
hgReg('hg-fuel-card', HGFuelCard, hgTLazy('cards.fuel.picker_name'), hgTLazy('cards.fuel.picker_description'));
