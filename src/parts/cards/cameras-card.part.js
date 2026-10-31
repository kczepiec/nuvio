class HGCamerasCard extends HGBase {
  defaults() { return { entities: [], names: {}, fs: {}, fb: {}, refresh_map: {}, nolive: [], pin: [], refresh: 10, studio: false, thumbs: false, max: 3, view_all: false, view_all_path: null }; }
  css() {
    return U(`
ha-card.wrap{ background:none; border:0; box-shadow:none; padding:0; height:auto; display:flex; flex-direction:column; gap:var(--s2); }
/* liczba kolumn wg szerokości kontenera (panel), nie okna: ~1280 -> 2, 1440–1640 -> 3, 1920+ -> 4, bardzo szerokie -> 5 */
ha-card.wrap{ container-type:inline-size; }
.grid{ display:grid; gap:var(--s2); align-items:start; grid-template-columns:repeat(var(--cols, 1), minmax(0, 1fr)); }
@container (min-width: 560px){ .grid{ --cols:2; } }
@container (min-width: 1200px){ .grid{ --cols:3; } }
@container (min-width: 1600px){ .grid{ --cols:4; } }
@container (min-width: 2400px){ .grid{ --cols:5; } }
.grid.n1{ grid-template-columns:minmax(0, min(100%, 720px)); justify-content:center; }
.empty{ display:flex; align-items:center; gap:var(--s2); padding:var(--s3); border-radius:var(--r-md); background:rgba(255,255,255,.55); color:#5A5E64; font-size:var(--fs-sm); }
.empty ha-icon{ width:20u; height:20u; }
.chips{ display:flex; flex-wrap:wrap; align-items:center; gap:var(--s1); padding:0 2u; }
.chips:empty{ display:none; }
.lbl{ display:inline-flex; align-items:center; height:max(calc(var(--k) * 24), var(--hg-tgt, 0px)); padding:0 var(--s1); border-radius:var(--r-sm); background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); font-size:var(--fs-sm); color:#3A3E44; font-weight:400; margin-right:2u; }
.chip{ position:relative; display:inline-flex; align-items:center; gap:5u; height:max(calc(var(--k) * 24), var(--hg-tgt, 0px)); padding:0 var(--s2); border-radius:var(--r-sm); font-size:var(--fs-sm); color:#4A4E54;
  background:var(--hg-inner-bg); border:0; box-shadow:var(--hg-inner-hi); transition:background .2s; }
.chip:hover{ background:var(--hg-inner-bg-h); }
.chip ha-icon{ width:12u; height:12u; color:#8A8E94; }
/* studio: nagłówek „Wszystkie”, do N żywych miniatur z nazwą i kropką stanu; stopnie: compact 1, medium 2, expanded 3+ */
ha-card.st{ container-type:inline-size; display:flex; flex-direction:column; gap:var(--s2); padding:var(--s2); height:auto; }
.st .sh{ display:flex; align-items:center; gap:var(--s1); min-width:0; font-weight:600; font-size:var(--fs-md); } .st .sh ha-icon{ width:20u; height:20u; color:inherit; }
.st .sh .tt{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st .va{ display:inline-flex; align-items:center; gap:4u; background:none; border:0; padding:0 2u; color:inherit; font:inherit; font-size:var(--fs-sm); font-weight:400; opacity:.8; cursor:pointer; } .st .va ha-icon{ width:16u; height:16u; }
.st .ths{ display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0, 1fr); gap:var(--s1); }
.st .th{ position:relative; display:block; min-width:0; aspect-ratio:16 / 10; padding:0; border:0; border-radius:var(--r-md); overflow:hidden; background:var(--hg-inner-bg); color:#fff; cursor:pointer; box-shadow:var(--hg-inner-hi); }
.st .th img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.st .th .no{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:.6; } .st .th .no ha-icon{ width:28px; height:28px; }
.st .th .nm{ position:absolute; left:8u; right:6u; bottom:6u; max-width:none; display:flex; align-items:center; gap:5u; padding:0; border-radius:0; font-size:var(--fs-sm); font-weight:500; background:none; text-shadow:0 1px 3px rgba(0,0,0,.85); }
.st .th .nm span{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st .dot{ flex:none; width:7px; height:7px; border-radius:50%; background:var(--hg-ok, #34C759); } .st .th.off .dot{ background:#8A8E94; }
.st .th:nth-child(n+2){ display:none; }
@container (min-width: 260px){ .st .th:nth-child(2){ display:block; } }
@container (min-width: 480px){ .st .th:nth-child(n+3){ display:block; } }
`);
  }
  disconnectedCallback() { clearInterval(this._stT); this._stT = null; if (super.disconnectedCallback) super.disconnectedCallback(); }
  _stu() { const c = this._config; return !!(c.studio || c.thumbs); }
  /* tryb studio: szkielet budowany przy zmianie listy/nazw/języka, potem tylko podmiana src miniatur (bez mrugania innych elementów) */
  _stuUpdate() {
    const c = this._config, h = this._hass, L = c.entities.slice(0, Math.max(1, Number(c.max) || 3));
    const sig = HGI18n.code + '|' + L.map((e) => e + '|' + (c.names[e] || H.name(h, e))).join(',') + '|' + (c.view_all || c.studio ? 1 : 0);
    if (sig !== this._ssig) {
      this._ssig = sig;
      const va = c.view_all || c.studio ? `<button class="va" data-act="all">${hgT('cards.cameras.view_all')}${H.icon('mdi:arrow-right')}</button>` : '';
      this.$.innerHTML = `<ha-card class="glass st"><div class="sh">${H.icon('mdi:cctv')}<span class="tt">${H.esc(hgT('cards.cameras.title'))}</span>${va}</div><div class="ths">${L.map((e) => `<button class="th" data-act="more" data-e="${H.esc(e)}" aria-label="${H.esc(c.names[e] || H.name(h, e))}"><img alt="" decoding="async" loading="lazy" hidden><span class="no">${H.icon('mdi:cctv-off')}</span><span class="nm"><i class="dot"></i><span>${H.esc(c.names[e] || H.name(h, e))}</span></span></button>`).join('')}</div></ha-card>`;
      this._ssrc = {};
    }
    const t = Math.floor(Date.now() / (Math.max(2, Number(c.refresh) || 10) * 1000));
    this.$.querySelectorAll('.th').forEach((b) => {
      const e = b.dataset.e, s = H.st(h, e), off = hgCamUn(s), pic = !off && s.attributes.entity_picture, img = b.querySelector('img'), no = b.querySelector('.no');
      b.classList.toggle('off', off);
      const src = pic ? pic + (pic.includes('?') ? '&' : '?') + '_t=' + t : '';
      if (src && this._ssrc[e] !== src) { this._ssrc[e] = src; img.src = src; }
      img.hidden = !src; no.hidden = !!src;
    });
    if (!this._stT && this.isConnected) this._stT = setInterval(() => this._stuUpdate(), Math.max(2, Number(c.refresh) || 10) * 1000);
  }
  _update() {
    if (!this._config || !this._hass) return;
    const c = this._config, h = this._hass;
    if (this._stu()) return this._stuUpdate();
    const dn = (e) => !(c.pin || []).includes(e) && hgCamUn(H.st(h, e)) && ![].concat((c.fb || {})[e] || []).some((f) => !hgCamUn(H.st(h, f)));   // przypięte: zawsze kafel   // niedostępna, gdy też brak zapasowej
    const av = c.entities.filter((e) => !dn(e)), un = c.entities.filter(dn);
    const sig = HGI18n.code + '|' + av.join(',') + '|' + un.map((e) => e + H.name(h, e)).join(',');   // kod języka: komunikat „brak kamer” po zmianie języka
    if (sig !== this._lsig) { this._lsig = sig; this._layoutCams(av, un); }
    for (const t of this._tiles.values()) hgPass(t, h);
  }
  _layoutCams(av, un) {
    const c = this._config, h = this._hass;
    if (!this._tiles) this._tiles = new Map();
    if (!this._grid) {
      this.$.innerHTML = `<ha-card class="wrap"><div class="grid"></div><div class="chips"></div></ha-card>`;
      this._grid = this.$.querySelector('.grid'); this._chips = this.$.querySelector('.chips');
    }
    for (const [e, t] of this._tiles) if (!av.includes(e)) { t.remove(); this._tiles.delete(e); }
    for (const e of av) {
      let t = this._tiles.get(e);
      if (!t) { t = document.createElement('hg-camera-card'); t.setConfig({ type: 'custom:hg-camera-card', entity: e, name: c.names[e] || null, refresh: (c.refresh_map && c.refresh_map[e]) || c.refresh, embedded: true, cover: true, no_live: (c.nolive || []).includes(e), live_needs_fs: (c.needfs || []).includes(e), ...(c.fb && c.fb[e] ? { fallback: c.fb[e] } : {}), ...(c.fs && c.fs[e] ? { fs_entity: c.fs[e] } : {}) }); t.hass = h; this._tiles.set(e, t); }
      this._grid.appendChild(t);     // appendChild przenosi istniejący kafel (zachowuje stan i obraz)
    }
    const empty = this._grid.querySelector('.empty'); if (empty) empty.remove();
    if (!av.length) this._grid.insertAdjacentHTML('beforeend', `<div class="empty">${H.icon('mdi:cctv-off')}<span>${hgT('cards.cameras.no_cameras_are_available')}</span></div>`);
    const n = av.length, rows = n <= 2 ? 1 : Math.ceil(n / 2);
    this._grid.className = `grid n${Math.min(n, 4)} ${n > 1 ? 'multi' : ''}`;
    this._grid.style.setProperty('--rows', rows);
    this._grid.style.setProperty('--chips-h', '0px');   // bez plakietek pod kamerami (decyzja użytkownika)
    this._chips.innerHTML = ''; this._chips.hidden = true;
  }
  onAct(a, t) {
    if (a === 'more') H.fire(this, 'hass-more-info', { entityId: t.dataset.e });
    if (a === 'all') { const c = this._config; if (c.view_all_path) H.navigate(c.view_all_path); else if (c.entities[0]) H.fire(this, 'hass-more-info', { entityId: c.entities[0] }); }
  }
  getCardSize() { return 6; }
  getGridOptions() { return this._config && this._stu() ? { columns: 12, rows: 3, min_columns: 3, min_rows: 2 } : { columns: 12, rows: 6 }; }
}
hgReg('hg-cameras-card', HGCamerasCard, hgTLazy('cards.cameras.picker_name'), hgTLazy('cards.cameras.picker_description'));
