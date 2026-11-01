/* --- pokój kompakt: temperatura, przełącznik i suwak-linijka jasności --- */
class HGRoomCompactCard extends HGBase {
  static getStubConfig(h) { return { name: hgT('cards.room_compact.living_room'), temperature: hgStub(h, ['sensor'], (s) => s.attributes.device_class === 'temperature'), entity: hgStub(h, ['light']) }; }
  defaults() { return { name: null, icon: 'mdi:sofa-outline', temperature: null, humidity: null, entity: null }; }
  ents() { const c = this._config; return [c.temperature, c.humidity, c.entity].filter(Boolean); }
  css() { return HG_NV_CSS + U(`
.rul{ position:relative; height:28u; touch-action:none; cursor:pointer; border-radius:var(--r-sm); }
.rul:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:3px; }
.rul .tk{ position:absolute; inset:6u 0; display:flex; justify-content:space-between; align-items:center; }
.rul .tk i{ width:1.5px; height:60%; border-radius:1px; background:currentColor; opacity:.28; transition: background var(--hg-t-base), opacity var(--hg-t-base), height var(--hg-t-base); }
.rul .tk i:nth-child(5n+1){ height:100%; } .rul .tk i.on{ background:var(--hg-accent); opacity:1; box-shadow:0 0 6px var(--hg-accent-glow); }
.rul .kn{ position:absolute; top:50%; left:var(--p); width:6u; height:28u; border-radius:3u; background:var(--hg-thumb, #fff); box-shadow:var(--hg-thumb-sh, 0 2px 8px rgba(0,0,0,.3)); transform:translate(-50%, -50%); transition:left var(--hg-t-slow) var(--hg-ease-out); }
.drag .kn{ transition:none; }
.un .rul{ cursor:default; }
.meta{ display:flex; gap:var(--s1); font-size:var(--fs-xs); opacity:.65; }
`); }
  _extraSig() { return [this._drag, this._pend]; }
  render() { const c = this._config, h = this._hass, t = H.num(h, c.temperature), hu = H.num(h, c.humidity), s = c.entity ? H.st(h, c.entity) : null;
    const M = s ? hgSlider(h, c.entity) : null, v = M ? (this._drag ?? this._pend ?? M.v) : 0, p = M ? ((v - M.min) / (M.max - M.min || 1)) * 100 : 0, n = 31, on = Math.round((p / 100) * (n - 1));
    const nm = c.name || (s ? H.name(h, c.entity) : hgT('common.room'));
    const ticks = Array.from({ length: n }, (_, i) => `<i class="${p > 0 && i <= on ? 'on' : ''}"></i>`).join('');
    return `<ha-card class="glass">${hgUI.header(nm, { icon: c.icon, right: s ? hgUI.switch(M.on, 'tog', nm, !H.ok(s)) : '' })}
      <div class="nv-mid">${t != null ? hgUI.big(t, { d: 1, unit: '°', sup: true, caption: hu != null ? `${H.pct(H.fmt(hu, 0))} ${hgT('cards.room_compact.hum')}` : '' }) : ''}
      ${M && M.ok ? `<div class="rul ${this._drag != null ? 'drag' : ''}" role="slider" tabindex="0" aria-label="${H.esc(M.label)} ${H.esc(nm)}" aria-valuemin="${M.min}" aria-valuemax="${M.max}" aria-valuenow="${v}" style="--p:${p.toFixed(1)}%"><div class="tk">${ticks}</div><span class="kn"></span></div>
        <div class="meta"><span>${H.esc(M.label)}</span><span class="nv-sp"></span><span>${M.unit === '%' ? H.pct(H.fmt(v, 0)) : H.fmt(v, 0) + H.esc(M.unit)}</span></div>` : ''}</div></ha-card>`; }
  afterRender() { const el = this.$.querySelector('.rul'); if (!el) return; const M = () => hgSlider(this._hass, this._config.entity), set = (f) => { const m = M(); return hgStepRound(m.min + f * (m.max - m.min), m); };
    hgDragVal(this, el, { off: () => !M().ok, move: (f) => { this._drag = set(f); this._paint(el); }, end: (f) => { const v = f == null ? null : set(f); this._drag = null; el.classList.remove('drag'); if (v != null) this._send(v); else this.rerender(); },
      key: (d) => { const m = M(); this._send(hgStepRound((this._pend ?? m.v) + d * (m.unit === '%' ? 5 : m.step), m)); } }); }
  _paint(el) { const m = hgSlider(this._hass, this._config.entity), p = ((this._drag - m.min) / (m.max - m.min || 1)) * 100, ts = el.querySelectorAll('.tk i'), on = Math.round((p / 100) * (ts.length - 1));
    el.classList.add('drag'); el.style.setProperty('--p', p + '%'); ts.forEach((t, i) => t.classList.toggle('on', p > 0 && i <= on)); el.setAttribute('aria-valuenow', this._drag);
    const mv = this.$.querySelector('.meta span:last-child'); if (mv) mv.textContent = H.fmt(this._drag, 0) + m.unit; }
  _send(v) { const m = hgSlider(this._hass, this._config.entity); if (!m.set) return; this._pend = v; clearTimeout(this._pt); this._pt = setTimeout(() => { this._pend = null; this.rerender(); }, 4000); H.haptic(); m.set(v); this.rerender(); }
  set hass(h) { const o = this._hass; this._hass = h; if (this._pend != null && o && this._config && this._config.entity) { const a = H.st(h, this._config.entity), b = H.st(o, this._config.entity); if (a && b && a.last_updated !== b.last_updated) this._pend = null; } this._update(); }
  get hass() { return this._hass; }
  onAct(a) { if (a === 'tog') { H.haptic(); H.call(this._hass, 'homeassistant', 'toggle', { entity_id: this._config.entity }); } }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-room-compact-card', HGRoomCompactCard, hgTLazy('cards.room_compact.picker_name'), hgTLazy('cards.room_compact.picker_description'));
