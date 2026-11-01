/* Łuk: wartość na łuku z kreskami, przeciągana palcem */
class HGArcCard extends HGBase {
  static getStubConfig(h) { return { entity: hgStub(h, ['light'], (s) => (s.attributes.supported_color_modes || []).some((m) => m !== 'onoff')) || hgStub(h, ['fan', 'input_number', 'number']) || null }; }
  defaults() { return { entity: null, name: null, icon: null }; }
  css() { return HG_NV_CSS + U(`
.aw{ position:relative; max-width:260u; width:100%; margin:0 auto; touch-action:none; cursor:pointer; border-radius:var(--r-md); }
.aw:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:4px; }
.aw .nv-big{ position:absolute; left:0; right:0; bottom:0; }
.un .aw{ cursor:default; }
`); }
  model() { return hgSlider(this._hass, this._config.entity); }
  _extraSig() { return [this._drag, this._pend]; }
  val(M) { return this._drag ?? this._pend ?? M.v; }
  extra() { return ''; }
  /* miejsca po przecinku: procenty całe, inne jednostki wg kroku (najwyżej 2) */
  dp(M) { return M.unit === '%' ? 0 : Math.min(2, (String(M.step).split('.')[1] || '').length); }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity);
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.arc.choose_a_light_fan')}</span></ha-card>`;
    const M = this.model(), v = this.val(M), p = ((v - M.min) / (M.max - M.min || 1)) * 100, nm = c.name || H.name(h, c.entity), tog = HG_TOGGLE_DOM.includes(M.d) && M.d !== 'cover';
    return `<ha-card class="glass ${M.ok ? '' : 'un'}">${hgUI.header(nm, { icon: c.icon || s.attributes.icon, right: tog ? hgUI.switch(M.on, 'tog', nm, !H.ok(s)) : '' })}
      <div class="nv-mid"><div class="aw" role="slider" tabindex="${M.ok ? 0 : -1}" aria-label="${H.esc(M.label)} ${H.esc(nm)}" aria-valuemin="${M.min}" aria-valuemax="${M.max}" aria-valuenow="${v}"${M.ok ? '' : ' aria-disabled="true"'}>
        ${hgUI.arc(p, { label: M.label })}${hgUI.big(v, { d: this.dp(M), unit: M.unit, col: true, caption: M.label })}</div>${this.extra(s, M)}</div></ha-card>`; }
  afterRender() { const el = this.$.querySelector('.aw'); if (!el) return;
    const M = () => this.model(), set = (f) => { const m = M(); return hgStepRound(m.min + f * (m.max - m.min), m); };
    hgDragVal(this, el, { arc: true, off: () => !M().ok, move: (f) => { this._drag = set(f); this._paint(); },
      end: (f) => { const v = f == null ? null : set(f); this._drag = null; if (v != null) this._send(v); else this.rerender(); },
      key: (d) => { const m = M(); this._send(hgStepRound(this.val(m) + d * (m.unit === '%' && m.step < 5 ? 5 : m.step), m)); } }); }
  /* w trakcie przeciągania karta jest wstrzymana (_busy): przemalowanie łuku i liczby bez aktualizacji stanu */
  _paint() { const m = this.model(), p = ((this._drag - m.min) / (m.max - m.min || 1)) * 100, a = this.$.querySelector('.aw'); if (!a) return;
    const t = document.createElement('template'); t.innerHTML = hgUI.arc(p, { label: m.label }); const svg = a.querySelector('svg'); if (svg) svg.replaceWith(t.content.firstChild);
    const n = a.querySelector('.nv-num'); if (n) { cancelAnimationFrame(n.__nvT || 0); n.textContent = (+this._drag).toFixed(this.dp(m)).replace('.', hgUI.dec()); } a.setAttribute('aria-valuenow', this._drag); }
  _send(v) { const m = this.model(); if (!m.set) return; this._pend = v; clearTimeout(this._pt); this._pt = setTimeout(() => { this._pend = null; this.rerender(); }, 4000); H.haptic(); m.set(v); this.rerender(); }
  set hass(h) { const o = this._hass; this._hass = h; if (this._pend != null && o && this._config) { const a = H.st(h, this._config.entity), b = H.st(o, this._config.entity); if (a && b && a.last_updated !== b.last_updated) this._pend = null; } this._update(); }
  get hass() { return this._hass; }
  onAct(a) { const e = this._config.entity; if (a === 'tog') { H.haptic(); H.call(this._hass, 'homeassistant', 'toggle', { entity_id: e }); } if (a === 'more') H.fire(this, 'hass-more-info', { entityId: e }); }
  getGridOptions() { return { columns: 6, rows: 3 }; }
}
hgReg('hg-arc-card', HGArcCard, hgTLazy('cards.arc.picker_name'), hgTLazy('cards.arc.picker_description'));
