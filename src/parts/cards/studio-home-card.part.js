/* ===================== STUDIO: DOM (szybkie kafle) =====================
   Światła (wszystkie naraz), zamek (z potwierdzeniem odblokowania), kamery (ile online), temperatura w domu.
   Config: { lights?: [light.*] (domyślnie wszystkie), lock?: lock.*, cameras?: [camera.*] (domyślnie wszystkie), temperature?: sensor, title?, tier? }
   compact: 2 kafelki, same ikony. medium: nagłówek + kafelki z podpisem. expanded: większe kafelki + podsumowanie. */
class HGStudioHomeCard extends HGStudioCard {
  static getStubConfig(h) { const o = { lock: hgStub(h, ['lock']), temperature: hgStub(h, ['sensor'], (s) => s.attributes.device_class === 'temperature') }; for (const k of Object.keys(o)) if (!o[k]) delete o[k]; return o; }
  defaults() { return { lights: null, lock: null, cameras: null, temperature: null, title: null }; }
  ents() { const c = this._config; return [c.lock, c.temperature, ...[].concat(c.lights || []), ...[].concat(c.cameras || [])].filter(Boolean); }
  /* lista „wszystkie” zmienia się z hass: jej podpis wchodzi do wykrywania zmian */
  _auto(dom, cfg) { const L = [].concat(cfg || []).filter(Boolean); return L.length ? L : Object.keys((this._hass && this._hass.states) || {}).filter((e) => hgDom(e) === dom); }
  _lights() { return this._auto('light', this._config.lights).filter((e) => H.ok(H.st(this._hass, e))); }
  _cams() { return this._auto('camera', this._config.cameras); }
  _xsig() { const c = this._config, h = this._hass; return [c.lights && c.lights.length ? '' : this._auto('light').map((e) => e + (H.st(h, e) || {}).state).join(), c.cameras && c.cameras.length ? '' : this._auto('camera').map((e) => e + (H.st(h, e) || {}).state).join()]; }
  css() {
    return HG_STUDIO_CSS + U(`
.tls{ flex:1; min-height:0; display:grid; grid-template-columns:repeat(var(--n, 4), minmax(0, 1fr)); gap:var(--s1); }
.tl{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4u; min-width:0; min-height:56u; padding:var(--s1) 4u; border-radius:var(--r-md); text-align:center; cursor:pointer;
  background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); transition:background var(--hg-t-base, 200ms) var(--hg-ease-out, ease-out), color var(--hg-t-base, 200ms) var(--hg-ease-out, ease-out), transform var(--hg-t-fast, 120ms) var(--hg-ease-out, ease-out); }
.tl:active{ transform:scale(.96); } .tl:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; } .tl[disabled]{ cursor:default; opacity:.5; }
@media (hover:hover) and (pointer:fine){ .tl:not(.on):not([disabled]):hover{ background:var(--hg-inner-bg-h); } }
.tl ha-icon{ width:24u; height:24u; flex:none; } .tl b{ font-size:var(--fs-sm); font-weight:600; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .tl small{ font-size:var(--fs-xs); opacity:.65; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tl.on{ background:var(--hg-accent); color:var(--hg-on-accent); box-shadow:0 0 16px var(--hg-accent-glow); } .tl.on small{ opacity:.75; }
.expanded .tl{ gap:6u; } .expanded .tl ha-icon{ width:30u; height:30u; } .expanded .tl b{ font-size:var(--fs-md); }
.compact .tl{ min-height:0; } .compact .tl ha-icon{ width:28u; height:28u; } ha-card.glass.compact{ padding:var(--s2); }
.sum{ font-size:var(--fs-sm); opacity:.65; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
`);
  }
  _tiles() {
    const c = this._config, h = this._hass, T = [], L = this._lights(), on = L.filter((e) => H.st(h, e).state === 'on').length;
    if (L.length) T.push({ k: 'lights', ic: on ? 'mdi:lightbulb-group' : 'mdi:lightbulb-group-outline', lb: hgT('cards.studio_home.lights'), sb: hgT('cards.studio_home.all'), on: on > 0, aria: hgT('cards.studio_home.lights') });
    const ls = c.lock && H.st(h, c.lock);
    if (ls) { const lk = ls.state === 'locked', ok = H.ok(ls); T.push({ k: 'lock', ic: ls.state === 'jammed' ? 'mdi:lock-alert' : lk ? 'mdi:lock' : 'mdi:lock-open-variant', lb: hgT('cards.studio_home.lock'), sb: H.T(h, ls), on: ok && !lk, un: !ok, aria: H.lv(hgT('cards.studio_home.lock'), H.t(h, ls)) }); }
    const cm = this._cams();
    if (cm.length) { const n = cm.filter((e) => H.ok(H.st(h, e))).length; T.push({ k: 'cams', ic: 'mdi:cctv', lb: hgT('cards.studio_home.cameras'), sb: hgT('cards.studio_home.online', { count: n }), un: !n, aria: H.lv(hgT('cards.studio_home.cameras'), hgT('cards.studio_home.online', { count: n })) }); }
    const ts = c.temperature && H.st(h, c.temperature);
    if (ts) { const v = parseFloat(ts.state), u = ts.attributes.unit_of_measurement || '', sb = isFinite(v) ? H.fmt(v) + u : H.T(h, ts); T.push({ k: 'temp', ic: 'mdi:thermometer', lb: hgT('cards.studio_home.home_temp'), sb, un: !H.ok(ts), aria: H.lv(hgT('cards.studio_home.home_temp'), sb) }); }
    return { T, L, on };
  }
  render() {
    const c = this._config, tier = this._tier(), { T, L, on } = this._tiles(), ttl = c.title || hgT('cards.studio_home.title');
    if (!T.length) return `<ha-card class="glass ${tier}"><span class="nv-empty">${hgT('cards.studio_home.nothing_to_show')}</span></ha-card>`;
    const vis = tier === 'compact' ? T.slice(0, 2) : T, ico = tier === 'compact';
    const tl = vis.map((x) => `<button class="tl ${x.on ? 'on' : ''}" type="button" data-act="${x.k}" data-key="tl-${x.k}" ${x.on != null && x.k !== 'cams' && x.k !== 'temp' ? `aria-pressed="${!!x.on}"` : ''} ${x.un && x.k !== 'lights' ? 'disabled' : ''} aria-label="${H.esc(x.aria)}" title="${H.esc(H.lv(x.lb, x.sb))}">${H.icon(x.ic)}${ico ? '' : `<b>${H.esc(x.lb)}</b><small>${H.esc(x.sb)}</small>`}</button>`).join('');
    const hd = ico ? '' : `<div class="sthd"><ha-icon icon="mdi:home"></ha-icon><span class="nm">${H.esc(ttl)}</span></div>`;
    const sm = tier === 'expanded' && L.length ? `<div class="sum">${hgT('cards.studio_home.lights_on', { count: on, total: L.length })}</div>` : '';
    return `<ha-card class="glass ${tier}">${hd}<div class="tls" style="--n:${vis.length}">${tl}</div>${sm}</ha-card>`;
  }
  async onAct(a, el) {
    const c = this._config, h = this._hass;
    if (a === 'lights') { const L = this._lights(); if (!L.length) return; const any = L.some((e) => H.st(h, e).state === 'on'); H.haptic('medium'); return H.call(h, 'light', any ? 'turn_off' : 'turn_on', { entity_id: L }); }
    if (a === 'lock') { const s = H.st(h, c.lock); if (!s) return;
      if (s.attributes.code_format) return H.fire(this, 'hass-more-info', { entityId: c.lock });   // kod: okno szczegółów encji
      const lk = s.state === 'locked';
      if (lk && !(await hgOverlay.alert(hgT('cards.lock.unlock_confirm_title', { nm: H.name(h, c.lock) }), hgT('cards.lock.the_door_can_be'), hgT('cards.lock.unlock')))) return;
      H.haptic('medium'); return H.call(h, 'lock', lk ? 'unlock' : 'lock', { entity_id: c.lock }); }
    if (a === 'cams') { const e = this._cams().find((x) => H.ok(H.st(h, x))) || this._cams()[0]; if (e) H.fire(this, 'hass-more-info', { entityId: e }); return; }
    if (a === 'temp') H.fire(this, 'hass-more-info', { entityId: c.temperature });
  }
  getGridOptions() { return { columns: 6, rows: 3, min_columns: 3, max_columns: 12, min_rows: 1, max_rows: 5 }; }
  getCardSize() { return 3; }
}
hgReg('hg-studio-home-card', HGStudioHomeCard, hgTLazy('cards.studio_home.picker_name'), hgTLazy('cards.studio_home.picker_description'));
