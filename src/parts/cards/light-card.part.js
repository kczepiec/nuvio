/* --- OŚWIETLENIE --- */
class HGLightCard extends HGBase {
  defaults() { return { title: hgT('cards.light.lighting'), icon: 'mdi:lightbulb-outline', name: null }; }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; justify-content:space-between; padding:var(--s2) var(--s3) var(--s3); }
.hd .tt{ font-weight:400; }
.hd .ic.on{ color:var(--hg-accent-tx); }
.trk{ position:relative; height:max(calc(var(--k) * 28), var(--hg-tgt, 0px)); border-radius:var(--r-md); background: rgba(255,255,255,.6);
  box-shadow: inset 0 1px 2px rgba(0,0,0,.06); touch-action:none; cursor:pointer; overflow:hidden; }
.fl{ position:absolute; left:0; top:0; bottom:0; border-radius:var(--r-md); min-width:28u; background:var(--hg-accent-faint); transition: width .25s ease; }
.drag .fl{ transition:none; }
.fl .sun{ position:absolute; left:9u; top:50%; transform:translateY(-50%); width:10u; height:10u; color:#fff; }
.fl i{ position:absolute; right:10u; top:32%; bottom:32%; width:2u; border-radius:2u; background:rgba(255,255,255,.95); }
.pc{ position:absolute; right:12u; top:50%; transform:translateY(-50%); font-size:var(--fs-sm); color:#2B2E33; pointer-events:none; }
.off .fl{ background:#E2DCEB; }
.un .trk{ cursor:not-allowed; } .un .pc{ color:#9A9EA4; } .un .fl i{ display:none; }
`);
  }
  pct() {
    if (this._drag != null) return this._drag;
    if (this._pending != null) return this._pending;
    const s = H.st(this._hass, this._config.entity);
    if (!s || s.state !== 'on') return 0;
    const b = s.attributes.brightness; return b == null ? 100 : Math.round((b / 255) * 100);
  }
  _extraSig() { return [this._drag, this._pending]; }
  render() {
    const c = this._config, s = H.st(this._hass, c.entity);
    const on = s && s.state === 'on', un = !s || s.state === 'unavailable', p = this.pct();
    const nm = c.name || (s && s.attributes.friendly_name) || c.entity;
    const hd = `<div class="hd"><button class="ib" data-act="toggle" aria-label="${hgT('cards.light.toggle')} ${H.esc(nm)}" title="${H.esc(nm)}" style="margin-left:calc(var(--k) * -4)">${H.icon(c.icon, 'ic' + (on ? ' on' : ''))}</button>
      <span class="tt">${H.esc(c.title)}</span><span class="sp"></span>
      <button class="ib" data-act="more" aria-label="${hgT('common.expand')}" title="${H.esc(nm)}">${H.icon('mdi:arrow-expand')}</button></div>`;
    return `<ha-card class="glass ${p ? '' : 'off'} ${un ? 'un' : ''}" title="${H.esc(nm)}${un ? hgT('cards.light.unavailable') : ''}">${hd}
      <div class="trk" role="slider" aria-label="${hgT('common.brightness')} ${H.esc(nm)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" tabindex="${un ? -1 : 0}" ${un ? 'aria-disabled="true"' : ''}>
        <div class="fl" style="width:${p}%">${H.icon('mdi:white-balance-sunny', 'sun')}<i></i></div><span class="pc">${un ? '—' : H.pct(p)}</span></div></ha-card>`;
  }
  afterRender() {
    const t = this.$.querySelector('.trk'); if (!t || !this._once(t)) return;
    const calc = (ev) => { const r = t.getBoundingClientRect(); return Math.round(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * 100); };
    const send = (v) => {
      const id = { entity_id: this._config.entity }; this._pending = v;
      clearTimeout(this._pt); this._pt = setTimeout(() => { this._pending = null; this.rerender(); }, 4000);
      if (v <= 0) H.call(this._hass, 'light', 'turn_off', id); else H.call(this._hass, 'light', 'turn_on', { ...id, brightness_pct: v });
      this.rerender();
    };
    t.addEventListener('pointerdown', (ev) => { if (t.getAttribute('aria-disabled')) return; t.setPointerCapture(ev.pointerId); this._drag = calc(ev); t.classList.add('drag'); this._paint(t); this._busy = true; });
    t.addEventListener('pointermove', (ev) => { if (this._drag == null) return; this._drag = calc(ev); this._paint(t); });
    const end = () => { if (this._drag == null) return; const v = this._drag; this._drag = null; this._busy = false; t.classList.remove('drag'); send(v); };
    t.addEventListener('pointerup', end); t.addEventListener('pointercancel', end);
    t.addEventListener('keydown', (ev) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(ev.key) || t.getAttribute('aria-disabled')) return;
      ev.preventDefault(); send(Math.max(0, Math.min(100, this.pct() + (ev.key === 'ArrowRight' ? 10 : -10))));
    });
  }
  _paint(t) { const p = this._drag; t.querySelector('.fl').style.width = p + '%'; t.querySelector('.pc').textContent = H.pct(p); t.setAttribute('aria-valuenow', p); }
  set hass(h) {
    const old = this._hass; this._hass = h;
    if (this._pending != null && old && this._config) { const s = H.st(h, this._config.entity), o = H.st(old, this._config.entity); if (s && o && s.last_updated !== o.last_updated) this._pending = null; }
    this._update();
  }
  get hass() { return this._hass; }
  onAct(a) {
    const e = this._config.entity;
    if (a === 'more') return H.fire(this, 'hass-more-info', { entityId: e });
    if (a === 'toggle') { const s = H.st(this._hass, e); if (!s || s.state === 'unavailable') return; return H.call(this._hass, 'light', 'toggle', { entity_id: e }); }
  }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-light-card', HGLightCard, hgTLazy('cards.light.picker_name'), hgTLazy('cards.light.picker_description'));
