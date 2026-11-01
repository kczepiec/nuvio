/* --- licznik / krokowy: counter, input_number, number --- */
class HGStepperCard extends HGBase {
  defaults() { return { entity: null, name: null, icon: null }; }
  ents() { return [this._config.entity]; }
  _extraSig() { return [this._pend]; }
  css() { return HG_GEN_CSS + U(`
ha-card.glass{ display:flex; flex-direction:column; justify-content:space-between; gap:12px; padding:16px; container-type:inline-size; }
.gst{ display:flex; align-items:center; justify-content:space-between; gap:8px; } .gst .gb.r{ width:40px; height:40px; } .gbn{ min-width:0; white-space:nowrap; font-size:clamp(22px, 9cqi, 32px); font-weight:600; letter-spacing:-.02em; font-variant-numeric:tabular-nums; text-align:center; flex:1; } .gbn small{ font-size:14px; font-weight:500; opacity:.66; margin-left:4px; }
.gst .gb.r.ok{ box-shadow:none; }
`); }
  _m() { const h = this._hass, e = this._config.entity, s = H.st(h, e), d = hgDom(e), a = (s && s.attributes) || {};
    if (d === 'counter') return { d, s, min: a.minimum ?? -Infinity, max: a.maximum ?? Infinity, step: a.step || 1, unit: '', v: parseFloat(s && s.state) || 0 };
    const m = hgSlider(h, e); return Object.assign(m, { d }); }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity), nm = c.name || H.name(h, c.entity);
    if (!s) return `<ha-card class="glass"><div class="ph"><b>${hgT('common.choose_entity')}</b>${hgT('cards.stepper.counter_input_number_or')}</div></ha-card>`;
    const m = this._m(), ok = H.ok(s), v = this._pend ?? m.v, ic = c.icon || s.attributes.icon || (m.d === 'counter' ? 'mdi:counter' : 'mdi:numeric');
    return `<ha-card class="glass ${ok ? '' : 'un'}"><div class="gh"><span class="gic on">${H.icon(ic)}</span><span class="gn"><b>${H.esc(nm)}</b><small>${m.d === 'counter' ? hgT('cards.stepper.counter') : hgT('cards.stepper.step_value', { value: H.fmt(m.step, 3) })}</small></span>${m.d === 'counter' ? `<button class="gb" data-act="reset" aria-label="${hgT('cards.stepper.reset')}" ${ok ? '' : 'disabled'}>${H.icon('mdi:restore')}</button>` : ''}</div>
      <div class="gst"><button class="gb r" data-act="dec" aria-label="${hgT('cards.stepper.decrease')}" ${ok && v > m.min ? '' : 'disabled'}>${H.icon('mdi:minus')}</button><span class="gbn" aria-live="polite">${ok ? hgFmtV(v, m) : hgT('common.state_unavailable')}</span><button class="gb r ok" data-act="inc" aria-label="${hgT('cards.stepper.increase')}" ${ok && v < m.max ? '' : 'disabled'}>${H.icon('mdi:plus')}</button></div></ha-card>`; }
  onAct(a) { const e = this._config.entity, h = this._hass, m = this._m(); if (!H.ok(m.s)) return;
    if (m.d === 'counter') { const sv = { inc: 'increment', dec: 'decrement', reset: 'reset' }[a]; if (!sv) return; this._pend = a === 'reset' ? (m.s.attributes.initial ?? 0) : m.v + (a === 'inc' ? m.step : -m.step); H.call(h, 'counter', sv, { entity_id: e }); }
    else { const nv = hgStepRound((this._pend ?? m.v) + (a === 'inc' ? m.step : -m.step), m); this._pend = nv; m.set && m.set(nv); }
    clearTimeout(this._pt); this._pt = setTimeout(() => { this._pend = null; this.rerender(); }, 3000); this.rerender(); }
  set hass(h) { const o = this._hass; this._hass = h; if (this._pend != null && o && this._config) { const a = H.st(h, this._config.entity), b = H.st(o, this._config.entity); if (a && b && a.state !== b.state) this._pend = null; } this._update(); }
  get hass() { return this._hass; }
  getGridOptions() { return { columns: 3, rows: 2 }; }
}
hgReg('hg-stepper-card', HGStepperCard, hgTLazy('cards.stepper.picker_name'), hgTLazy('cards.stepper.picker_description'));
