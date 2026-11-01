/* ===================== STUDIO: swobodna siatka widżetów (HGGrid + HG_STUDIO_W), układ w HGL.data.studio ===================== */
/* Siatka: 12 / 8 / 4 kolumny wg szerokości karty (HGGrid.bp). Wiersze dzielą wysokość panelu (min. 32 px), a --hg-u na kafelku jest wysokością komórki względem projektu (64 px + odstęp). lg zapisuje items, md / sm własne nadpisanie bps[bp].
   Treść rysowana poza render() (morph do .st-root), bo w trybie edycji HG_FREEZE wstrzymuje zwykłe przerysowanie kart.
   Wiersz --st-ch: 64×u0, dopasowany do wysokości panelu; treść kafelka --hg-u (stosy bez tego skalowania). */
const HG_ST_ROW = 64, HG_ST_GAP = 24;
/* stała wysokość siatki w wierszach (jak seed); zmniejszenie widżetu nie ściska całego panelu */
const HG_STUDIO_GRID_ROWS = 10;
const hgStArea = (i) => `grid-area:${i.y + 1} / ${i.x + 1} / span ${i.h} / span ${i.w}`;
class HGStudioGrid extends HGBase {
  static getStubConfig() { return {}; }
  ents() { return []; }
  css() { return `
.st-root{ position:relative; height:100%; min-height:0; }
.st-g{ position:relative; display:grid; box-sizing:border-box; height:auto; min-height:100%; align-content:start; grid-template-columns:repeat(var(--st-cols, 12), minmax(0, 1fr)); grid-template-rows:repeat(var(--st-rows, 1), var(--st-ch, 83.2px));
  grid-auto-rows:var(--st-ch, 83.2px); gap:${HG_ST_GAP}px; }
/* edycja: wiersz zostaje taki jak w podglądzie. Kafelek „Dodaj” dokładany jest niżej i panel się przewija, zamiast ściskać resztę. */
.st-root:has(.ed){ height:100%; min-height:0; }
.st-g.ed{ height:auto; min-height:0; align-content:start; box-sizing:border-box; padding-bottom:12px; }
.st-g.ed .st-bg{ height:auto; align-self:start; grid-template-rows:repeat(var(--st-rows, 1), var(--st-ch, 83.2px)); grid-auto-rows:var(--st-ch, 83.2px); }
.st-w{ position:relative; min-width:0; min-height:0; max-height:100%; z-index:1; border-radius:var(--r-lg); outline:none; align-self:stretch; justify-self:stretch; overflow:hidden; }
.st-k{ position:absolute; inset:0; container-type:size; overflow:hidden; }
.st-k > *{ display:block; width:100%; height:100%; min-height:0; max-height:100%; box-sizing:border-box; }
.st-k > hg-stack-card, .st-k > hg-grid-card{ height:auto; max-height:100%; align-self:start; overflow:auto; }
.st-bg{ display:grid; height:100%; grid-template-columns:repeat(var(--st-cols, 12), minmax(0, 1fr)); grid-template-rows:repeat(var(--st-rows, 1), var(--st-ch, 83.2px)); grid-auto-rows:var(--st-ch, 83.2px); gap:${HG_ST_GAP}px; z-index:0; pointer-events:none; opacity:.18; }
.st-bg i{ border:1.5px dashed currentColor; border-radius:var(--r-md); }
.ed .st-k{ pointer-events:none; }
.ed .st-w::after{ content:''; position:absolute; inset:0; border-radius:inherit; box-shadow:0 0 0 1.5px var(--hg-accent-soft); pointer-events:none; transition:box-shadow var(--hg-t-fast) var(--hg-ease-out); }
.ed .st-w:focus-visible::after, .ed .st-w.st-drag::after{ box-shadow:0 0 0 2px var(--hg-accent); }
.st-bar{ position:absolute; top:var(--s1); left:var(--s1); right:var(--s1); z-index:3; display:flex; align-items:center; gap:6px; pointer-events:none; }
.st-bar > *, .st-rs{ pointer-events:auto; }
.st-h, .st-e, .st-m, .st-rs{ display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:var(--hg-radius-pill, 999px); flex:none;
  background:var(--hg-panel-flat, var(--hg-glass-bg)); box-shadow:var(--hg-edge, 0 0 0 transparent), var(--hg-shadow-lg, none); color:inherit; }
.st-h ha-icon, .st-e ha-icon, .st-m ha-icon, .st-rs ha-icon{ width:18px; height:18px; }
.st-h{ cursor:grab; touch-action:none; }
.st-n{ flex:1; min-width:0; font-size:var(--fs-sm); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:.8; }
.st-rs{ position:absolute; right:var(--s1); bottom:var(--s1); z-index:3; cursor:nwse-resize; touch-action:none; }
.st-h:focus-visible, .st-e:focus-visible, .st-m:focus-visible, .st-rs:focus-visible, .st-add:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
@media (pointer: coarse){ .st-h, .st-e, .st-m, .st-rs{ width:var(--hg-btn-touch, 44px); height:var(--hg-btn-touch, 44px); } }
.st-drag{ z-index:5; cursor:grabbing; box-shadow:var(--hg-shadow-float, none); transition:none; }
.st-gh{ z-index:0; border-radius:var(--r-lg); background:var(--hg-accent-faint); box-shadow:inset 0 0 0 2px var(--hg-accent-soft); pointer-events:none; }
.st-add{ position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; min-width:0; min-height:0; border-radius:var(--r-lg);
  padding:var(--s2); text-align:center; color:inherit; cursor:pointer; background:none; transition:background var(--hg-t-fast) var(--hg-ease-out); }
.st-add::before{ content:''; position:absolute; inset:0; border-radius:inherit; border:1.5px dashed currentColor; opacity:.35; pointer-events:none; }
.st-add:hover{ background:var(--hg-accent-faint); }
.st-pl{ display:inline-flex; align-items:center; justify-content:center; width:var(--hg-btn, 40px); height:var(--hg-btn, 40px); border-radius:var(--hg-radius-pill, 999px);
  background:var(--hg-panel-flat, var(--hg-glass-bg)); box-shadow:var(--hg-edge, 0 0 0 transparent); }
.st-pl ha-icon{ width:22px; height:22px; }
.st-add b{ font-size:var(--fs-md); font-weight:600; } .st-add small{ font-size:var(--fs-sm); opacity:.65; }
.st-empty{ padding:var(--s4); text-align:center; } .st-empty b{ display:block; font-weight:600; margin-bottom:4px; } .st-empty span{ font-size:var(--fs-sm); opacity:.65; }
.st-sr{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
@media (prefers-reduced-motion: reduce){ .st-root *, .st-root *::after{ transition:none !important; animation:none !important; } }
`; }
  render() { return `<div class="st-root" data-own data-key="st"></div><div class="st-sr" role="status" aria-live="polite" data-st-live></div><span class="st-sr" id="st-kh">${hgT('studio.kb_hint')}</span>`; }
  afterRender() {
    if (this._once(this.$, 'st')) {
      this.$.addEventListener('pointerdown', (e) => this._down(e));
      this.$.addEventListener('keydown', (e) => this._key(e));
      this.$.addEventListener('click', (e) => {
        if (!this._ed) return;
        const b = e.composedPath().find((n) => n.dataset && n.dataset.st);
        if (b) {
          e.stopPropagation();
          if (b.dataset.st === 'menu') { const c = b.closest('.st-w'); if (c) this._menu(c.dataset.id, b); }
          else if (b.dataset.st === 'edit') { const c = b.closest('.st-w'); if (c) this._editWidget(c.dataset.id); }
          else if (b.dataset.st === 'add') this._addMenu(b);
          return;
        }
        const w = e.composedPath().find((n) => n.classList && n.classList.contains('st-w'));
        if (w && !e.composedPath().some((n) => n.dataset && (n.dataset.st === 'drag' || n.dataset.st === 'size'))) {
          e.preventDefault(); e.stopPropagation(); this._editWidget(w.dataset.id);
        }
      });
    }
    this._lay();
  }
  set hass(h) { this._hass = h; window.__hgHass = h; if (typeof HGTheme !== 'undefined') HGTheme.pick(h); this._update(); this._seed(h); this._lay(); }
  get hass() { return this._hass; }
  connectedCallback() { super.connectedCallback(); this._lsub = this._lsub || (() => this._lay()); HGL.subs.add(this._lsub);
    if (!this._ro && typeof ResizeObserver !== 'undefined') this._ro = new ResizeObserver((es) => { this._width(es[0].contentRect.width); this._scale(); }); if (this._ro) this._ro.observe(this);
    this._watchEd(); }
  disconnectedCallback() { HGL.subs.delete(this._lsub); if (this._scF && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this._scF); this._scF = 0; if (this._ro) this._ro.disconnect(); if (this._pro) { this._pro.disconnect(); this._pro = null; this._proEl = null; } if (this._mo) { this._mo.disconnect(); this._mo = null; } }
  /* pierwszy układ: raz, po wczytaniu HGL, z modelu domu; istniejący klucz studio nigdy nie jest nadpisywany (hgStudioEnsure) */
  _model(h) { return this._Mp || (this._Mp = Promise.resolve(typeof HGModel !== 'undefined' && h ? HGModel.load(h) : {}).then((M) => (this._M = M || {}), () => (this._M = {}))); }
  _viewId() { const p = this._pageHost(); return (p && p._config && p._config.view) || 'dashboard'; }
  _layoutRoot() { return typeof hgStudioGet === 'function' ? hgStudioGet(HGL.data, this._viewId()) : null; }
  _saveLayout(L) { if (typeof hgStudioSet === 'function') hgStudioSet(HGL.data, this._viewId(), L); else HGL.data.studio = L; }
  _seed(h) {
    if (!h || this._layoutRoot() || this._seeding || typeof hgStudioEnsure !== 'function') return;
    if (!HGL.loaded) { if (!this._lw && HGL.load) { this._lw = 1; Promise.resolve(HGL.load(h)).then(() => { this._lw = 0; this._seed(this._hass); }, () => { this._lw = 0; }); } return; }
    if (HGL.failed) return;
    this._seeding = 1; this._model(h).then((M) => { this._seeding = 0; if (hgStudioEnsure(HGL, M, this._hass, this._viewId())) this._lay(); }, () => { this._seeding = 0; });
  }
  /* tryb edycji strony: HGL.editing; zmianę zgłasza atrybut editing na stronie (wejście) i HGL.notify (wyjście, Anuluj przywraca dane) */
  _edNow() { return !!HGL.editing; }
  _pageHost() { let n = this; for (let k = 0; k < 8 && n; k++) { const r = n.getRootNode && n.getRootNode(); n = r && r.host; if (n && typeof n._editEnter === 'function') return n; } return null; }
  /* main.panel ma stałą wysokość; .cw w edycji rośnie z siatką i nie nadaje się do liczenia wiersza */
  _panelEl() { for (let n = this.parentElement; n; n = n.parentElement) { if (n.classList && n.classList.contains('panel')) return n; } return null; }
  _panelRoSync(ed) {
    const p = ed ? this._panelEl() : null;
    if (this._proEl === p) return;
    if (this._pro) { this._pro.disconnect(); this._pro = null; }
    this._proEl = p;
    if (p && typeof ResizeObserver !== 'undefined') { this._pro = new ResizeObserver(() => this._scaleSoon()); this._pro.observe(p); }
  }
  _watchEd() { if (this._mo || typeof MutationObserver === 'undefined') return; const p = this._pageHost(); if (!p) return;
    this._mo = new MutationObserver(() => this._lay()); this._mo.observe(p, { attributes: true, attributeFilter: ['editing'] }); }
  _width(w) { if (!(w > 0)) return; const b = HGGrid.bp(w); if (!this._bp || b.id !== this._bp.id) { this._bp = b; if (this._drag) this._dragEnd(false); this._lay(); } }
  _bpNow() { if (!this._bp) { let w = 0; try { w = this.getBoundingClientRect().width; } catch (e) { /* bez DOM */ } this._bp = HGGrid.bp(w || 1440); } return this._bp; }
  _cols() { return this._bpNow().cols; }
  /* układ bieżącego progu: nadpisanie bps[bp] (uzupełnione o nowe widżety, bez usuniętych) albo układ wyprowadzony z 12 kolumn */
  _cur() {
    const L = this._layoutRoot(); if (!L || !Array.isArray(L.items)) return [];
    const id = this._bpNow().id, cols = this._cols(), ids = new Set(L.items.map((i) => i.id));
    let a = HGGrid.layoutFor(L, id);
    if (L.bps && L.bps[id]) {
      a = a.filter((i) => ids.has(i.id));
      const miss = L.items.filter((i) => !a.some((x) => x.id === i.id));
      if (miss.length) { const d = HGGrid.derive(L.items, 12, cols); for (const m of miss) { const { x, y, ...r } = d.find((o) => o.id === m.id); a = HGGrid.place(a, r, cols); } }
    }
    return a;
  }
  _byId() { const L = this._layoutRoot(); return new Map(((L && L.items) || []).map((i) => [i.id, i])); }
  /* liczba wierszy siatki: minimum jak makieta; rośnie tylko gdy treść schodzi niżej */
  _gridRows(cur, add) {
    const L = this._layoutRoot(), ext = (a) => (a.length ? Math.max(...a.map((i) => i.y + i.h)) : 0);
    const need = Math.max(ext(cur), add ? add.y + add.h : 0, 1);
    const lg = (L && L.items) || [];
    return Math.max(HG_STUDIO_GRID_ROWS, ext(lg), need);
  }
  _u0px() {
    try {
      const host = this._pageHost() || this, v = parseFloat(getComputedStyle(host).getPropertyValue('--hg-u0'));
      if (v > 0) return v;
    } catch (e) { /* brak DOM */ }
    return 1.3;
  }
  /* wiersz siatki: projekt 64×u0, ewentualnie lekko zmniejszony żeby wszystkie wiersze zmieściły się w panelu (bez ucinania) */
  _stCh(rows) {
    const r = Math.max(1, rows || 1);
    let ch = HG_ST_ROW * this._u0px();
    const panel = this._panelEl();
    if (panel && panel.clientHeight > 0) {
      const avail = panel.clientHeight;
      const need = r * ch + HG_ST_GAP * (r - 1);
      if (need > avail) ch = Math.max(32, (avail - HG_ST_GAP * (r - 1)) / r);
    }
    return ch.toFixed(2) + 'px';
  }
  _tileU(el, it) {
    if (!el.querySelector) return;
    const inner = el.querySelector('.st-k > *');
    if (inner && (inner.localName === 'hg-stack-card' || inner.localName === 'hg-grid-card')) {
      el.style.removeProperty('--hg-u'); return;
    }
    const dh = it.h * HG_ST_ROW + Math.max(0, it.h - 1) * HG_ST_GAP;
    if (!el.clientHeight || !dh || el.clientHeight > 8000) { el.style.removeProperty('--hg-u'); return; }
    const u = Math.min(2, Math.max(0.65, el.clientHeight / dh));
    el.style.setProperty('--hg-u', u.toFixed(4) + 'px');
  }
  _addPlace(vis) {
    if (!this._edNow()) return null;
    const cols = this._cols(); let add = null;
    for (const w of [4, 3, 2]) { const p = HGGrid.place(vis, { id: '_add', w: Math.min(w, cols), h: 3 }, cols), a = p[p.length - 1]; if (!add || a.y < add.y) add = a; }
    return add;
  }
  _visItems() {
    const by = this._byId();
    return this._cur().filter((i) => { const t = by.get(i.id); return !i.hidden && t && (t.type === 'card' ? t.settings && t.settings.card : HG_STUDIO_W[t.type]); });
  }
  _syncAreas(root) {
    const cur = this._cur(), vis = this._visItems();
    for (const el of root.querySelectorAll('.st-w')) {
      const it = cur.find((i) => i.id === el.dataset.id); if (!it) continue;
      el.setAttribute('style', hgStArea(it));
      el.style.removeProperty('transform');
    }
    const g = root.querySelector('.st-g'); if (!g) return;
    const rows = this._gridRows(vis, this._addPlace(vis));
    g.style.setProperty('--st-rows', String(rows));
    g.style.setProperty('--st-ch', this._stCh(rows));
  }
  _name(t, it) { if (it && it.type === 'card') return (it.settings && it.settings.name) || t; const d = HG_STUDIO_W[t]; return d ? String(d.n) : t; }
  _gridHtml() {
    const L = this._layoutRoot(), ed = this._ed = this._edNow(), cols = this._cols(), by = this._byId();
    const vis = this._visItems();
    if ((!L && HGL.failed) || (L && !vis.length && !ed)) return `<div class="st-empty nv-empty"><b>${hgT('studio.empty_title')}</b><span>${hgT('studio.empty_text')}</span></div>`;
    if (!L) return '';
    const add = this._addPlace(vis);
    const rows = this._gridRows(vis, add), esc = H.esc;
    const cell = (i) => { const t = by.get(i.id), nm = esc(this._name(t.type, t)), id = esc(i.id);
      return `<div class="st-w" data-key="w-${id}" data-id="${id}" style="${hgStArea(i)}"${ed ? ` tabindex="0" role="group" aria-label="${nm}" aria-describedby="st-kh"` : ''}><div class="st-k" data-own data-key="k-${id}"></div>`
        + (ed ? `<div class="st-bar"><button class="st-h" type="button" data-st="drag" data-no-swipe aria-label="${hgT('studio.move', { name: nm })}" title="${hgT('studio.move', { name: nm })}">${H.icon('mdi:drag')}</button><span class="st-n">${nm}</span>`
          + `<button class="st-e" type="button" data-st="edit" aria-label="${hgT('studio.configure', { name: nm })}" title="${hgT('studio.configure', { name: nm })}">${H.icon('mdi:pencil-outline')}</button>`
          + `<button class="st-m" type="button" data-st="menu" aria-haspopup="menu" aria-label="${hgT('studio.menu', { name: nm })}" title="${hgT('studio.menu', { name: nm })}">${H.icon('mdi:dots-horizontal')}</button></div>`
          + `<button class="st-rs" type="button" data-st="size" data-no-swipe aria-label="${hgT('studio.resize', { name: nm })}" title="${hgT('studio.resize', { name: nm })}">${H.icon('mdi:resize-bottom-right')}</button>` : '') + '</div>'; };
    return `<div class="st-g${ed ? ' ed' : ''}" data-key="g" style="--st-cols:${cols};--st-rows:${rows}">`
      + (ed ? `<div class="st-bg" data-key="bg" aria-hidden="true" style="grid-area:1 / 1 / span ${rows} / span ${cols}">${'<i></i>'.repeat(cols * rows)}</div>` : '')
      + vis.map(cell).join('')
      + (add ? `<button class="st-add" type="button" data-key="add" data-st="add" data-no-swipe aria-haspopup="menu" style="${hgStArea(add)}"><span class="st-pl">${H.icon('mdi:plus')}</span><b>${hgT('studio.add_widget')}</b><small>${hgT('studio.add_hint')}</small></button>` : '')
      + (ed ? '<div class="st-gh" data-key="gh" hidden></div>' : '') + '</div>';
  }
  /* łatanie siatki (morph zostawia gniazda data-own z kartami) + montaż widżetów; w trakcie przeciągania bez zmian w DOM */
  _lay() {
    const ed = this._ed = this._edNow(); this._watchEd();
    if (this._drag) return;
    const root = this.$ && this.$.querySelector && this.$.querySelector('.st-root'), html = this._gridHtml();
    if (!root) return;
    const modeFlip = this._lastEd !== undefined && this._lastEd !== ed;
    this._lastEd = ed;
    if (html !== this._lh || modeFlip) {
      this._lh = html;
      if (modeFlip || !root.firstChild) root.innerHTML = html;
      else hgMorph(root, html);
    }
    this._syncAreas(root); this._mount(root); this._scaleSoon();
  }
  _scaleSoon() { if (this._scF) return; const run = () => { this._scF = 0; this._scale(); }; if (typeof requestAnimationFrame === 'function') this._scF = requestAnimationFrame(run); else run(); }
  _scale() {
    const root = this.$ && this.$.querySelector && this.$.querySelector('.st-root');
    const g = root && root.querySelector('.st-g'); if (!g) return;
    this._panelRoSync(true);
    const cur = this._cur(), vis = this._visItems();
    const rows = this._gridRows(vis, this._addPlace(vis));
    g.style.setProperty('--st-ch', this._stCh(rows));
    g.style.setProperty('--st-rows', String(rows));
    for (const el of g.querySelectorAll('.st-w')) {
      const it = cur.find((i) => i.id === el.dataset.id); if (it) this._tileU(el, it);
    }
  }
  _cfg(it) {
    if (it.type === 'card') {
      const c = it.settings && it.settings.card; if (!c || !c.type) return null;
      const o = typeof hgFromHA === 'function' && typeof hgCardClean === 'function' ? hgCardClean(hgFromHA(Object.assign({}, c))) : Object.assign({}, c);
      for (const k of Object.keys(o)) if (k.indexOf('nv_') === 0) delete o[k]; return o;
    }
    const d = HG_STUDIO_W[it.type]; if (!d) return null; const s = it.settings || {}; try { return Object.assign({ type: 'custom:' + d.card }, d.cfg(s.entity || null, s, this._hass)); } catch (e) { return null; }
  }
  _mount(root) {
    const by = this._byId(), seen = new Set(), K = this._kids || (this._kids = new Map());
    const put = (x, id) => { const sl = root.querySelector(`.st-w[data-id="${id}"] > .st-k`); if (!sl) return; if (x.parentElement !== sl) { sl.textContent = ''; sl.appendChild(x); } if (this._hass) hgPass(x, this._hass); };
    for (const sl of root.querySelectorAll('.st-k[data-own]')) {
      const id = sl.parentElement.dataset.id, it = by.get(id), cfg = it && this._cfg(it); if (!cfg) continue;
      const sig = JSON.stringify(cfg), k = K.get(id); seen.add(id);
      if (k && k.sig === sig) { if (k.el) put(k.el, id); continue; }
      const rec = { sig, el: null }; K.set(id, rec);
      hgMakeCard(cfg, (x) => { if (K.get(id) !== rec) return; rec.el = x; put(x, id); });
    }
    for (const id of [...K.keys()]) if (!seen.has(id)) K.delete(id);
  }
  /* ---- zapis: lg -> items, md / sm -> bps[bp]; custom:1; brudny stan wykrywa tryb edycji (porównanie HGL.data z _eSnap) ---- */
  _put(next) {
    const L = this._layoutRoot(); if (!L) return; const b = this._bpNow().id, n = Object.assign({}, L, { custom: 1 });
    if (b === 'lg') n.items = next; else n.bps = Object.assign({}, L.bps || {}, { [b]: next.map(({ settings, ...r }) => r) });
    this._saveLayout(n); this._lh = null; this._lay();
  }
  _opMove(id, x, y) { this._put(HGGrid.move(this._cur(), id, x, y, this._cols())); }
  _opResize(id, w, h) { this._put(HGGrid.resize(this._cur(), id, w, h, this._cols())); }
  _opHide(id) { this._put(HGGrid.compact(this._cur().map((i) => (i.id === id ? { ...i, hidden: true } : i)), this._cols())); }
  _opShow(id) { const c = this._cur(), it = c.find((i) => i.id === id); if (!it) return; const { x, y, ...r } = it;
    this._put(HGGrid.place(c.filter((i) => i.id !== id), { ...r, hidden: false }, this._cols())); }
  _opRemove(id) { const L = this._layoutRoot(); if (!L) return; const bps = {};
    for (const [k, v] of Object.entries(L.bps || {})) bps[k] = HGGrid.compact(v.filter((i) => i.id !== id), (HGGrid.BP.find((b) => b.id === k) || HGGrid.BP[0]).cols);
    this._saveLayout(Object.assign({}, L, { items: HGGrid.compact(L.items.filter((i) => i.id !== id), 12), bps, custom: 1 })); this._kids && this._kids.delete(id); this._lh = null; this._lay(); }
  /* karta z galerii komponentów (ta sama co na innych widokach): konfiguracja w settings.card */
  _opAddCard(p) {
    const L = this._layoutRoot(); if (!L || !p || !p.card || !p.card.type) return null;
    const z = p.z === 'l' ? { w: 6, h: 4 } : p.z === 's' ? { w: 3, h: 2 } : { w: 4, h: 3 };
    const ids = new Set(L.items.map((i) => i.id)); let id = 'w_card', n = 2; while (ids.has(id)) id = 'w_card_' + n++;
    const it = { id, type: 'card', w: z.w, h: z.h, minW: 2, minH: 2, maxW: 12, maxH: 8, hidden: false, settings: { card: p.card, name: p.name || '', icon: p.icon || '' } }, bps = {};
    for (const [k, v] of Object.entries(L.bps || {})) { const c = (HGGrid.BP.find((b) => b.id === k) || HGGrid.BP[0]).cols, { settings, ...r } = it;
      bps[k] = HGGrid.place(v, { ...r, w: Math.max(2, Math.round(it.w * c / 12)) }, c); }
    this._saveLayout(Object.assign({}, L, { items: HGGrid.place(L.items, it, 12), bps, custom: 1 })); this._lh = null; this._lay(); return id;
  }
  _opAdd(type) {
    const L = this._layoutRoot(), d = HG_STUDIO_W[type]; if (!L || !d) return null;
    let e = null; try { e = d.pick(this._M || {}, this._hass); } catch (x) { e = null; }
    const ids = new Set(L.items.map((i) => i.id)); let id = 'w_' + type, n = 2; while (ids.has(id)) id = 'w_' + type + '_' + n++;
    const it = { id, type, w: d.def.w, h: d.def.h, minW: d.min.w, minH: d.min.h, maxW: d.max.w, maxH: d.max.h, hidden: false, settings: e ? { entity: e } : {} }, bps = {};
    for (const [k, v] of Object.entries(L.bps || {})) { const c = (HGGrid.BP.find((b) => b.id === k) || HGGrid.BP[0]).cols, { settings, ...r } = it;
      bps[k] = HGGrid.place(v, { ...r, w: Math.max(1, Math.round(it.w * c / 12)) }, c); }
    this._saveLayout(Object.assign({}, L, { items: HGGrid.place(L.items, it, 12), bps, custom: 1 })); this._lh = null; this._lay(); return id;
  }
  /* rozmiary S / M / L z rejestru (min / domyślny / większy), przeliczone na kolumny progu */
  _preset(type, k) { if (type === 'card') { const p = k === 's' ? { w: 3, h: 2 } : k === 'l' ? { w: 6, h: 4 } : { w: 4, h: 3 }, f = this._cols() / 12; return { w: Math.max(2, Math.round(p.w * f)), h: p.h }; }
    const d = HG_STUDIO_W[type], f = this._cols() / 12; if (!d) return null;
    const p = k === 's' ? d.min : k === 'l' ? { w: Math.min(d.max.w, Math.round(d.def.w * 1.5)), h: Math.min(d.max.h, d.def.h + 1) } : d.def;
    return { w: Math.max(1, Math.round(p.w * f)), h: p.h }; }
  _opSize(id, k) { const t = this._byId().get(id), p = t && this._preset(t.type, k); if (p) this._opResize(id, p.w, p.h); }
  _say(id) { const it = this._cur().find((i) => i.id === id), t = this._byId().get(id), el = this.$ && this.$.querySelector && this.$.querySelector('[data-st-live]');
    if (it && t && el) el.textContent = hgT('studio.pos', { name: this._name(t.type, t), x: it.x + 1, y: it.y + 1, w: it.w, h: it.h }); }
  _focus(id) { const c = this.$ && this.$.querySelector && this.$.querySelector(`.st-w[data-id="${id}"]`); if (c && c.focus) c.focus(); }
  _editWidget(id) {
    const page = this._pageHost(); if (!page || typeof page._eStudioWidgetEdit !== 'function' || !this._ed) return;
    page._eStudioWidgetEdit(id, this);
  }
  _opEditSave(p) {
    const L = this._layoutRoot(); if (!L || !p || !p.id) return;
    const meta = this._byId().get(p.id), it0 = L.items.find((i) => i.id === p.id); if (!meta || !it0) return;
    let settings;
    if (meta.type === 'card') {
      settings = Object.assign({}, it0.settings, { card: p.card, name: p.name != null ? p.name : (it0.settings && it0.settings.name) || '', icon: p.icon != null ? p.icon : (it0.settings && it0.settings.icon) || '' });
    } else {
      settings = Object.assign({}, it0.settings, hgStudioSettingsFromEdit(meta.type, p.card, p.v));
      if (p.name != null) settings.name = p.name;
      if (p.icon != null) settings.icon = p.icon;
    }
    const items = L.items.map((i) => (i.id === p.id ? Object.assign({}, i, { settings }) : i));
    this._saveLayout(Object.assign({}, L, { items, custom: 1 }));
    if (p.z) this._opSize(p.id, p.z);
    this._kids && this._kids.delete(p.id);
    this._lh = null; this._lay(); this._focus(p.id); this._say(p.id);
  }
  async _menu(id, anchor) {
    const it = this._cur().find((i) => i.id === id), t = this._byId().get(id); if (!it || !t) return;
    const sz = (k) => { const p = this._preset(t.type, k); return !!p && p.w === it.w && p.h === it.h; };
    const v = await hgOverlay.menu(anchor, [{ label: hgT('studio.configure', { name: this._name(t.type, t) }), icon: 'mdi:pencil-outline', value: 'edit' }, '-',
      { label: hgT('studio.size_s'), icon: 'mdi:size-s', value: 's', checked: sz('s') }, { label: hgT('studio.size_m'), icon: 'mdi:size-m', value: 'm', checked: sz('m') },
      { label: hgT('studio.size_l'), icon: 'mdi:size-l', value: 'l', checked: sz('l') }, '-',
      { label: hgT('studio.hide'), icon: 'mdi:eye-off-outline', value: 'hide' }, { label: hgT('studio.remove'), icon: 'mdi:delete-outline', value: 'remove', danger: true }]);
    if (!v || !this._ed) return;
    if (v === 'edit') return this._editWidget(id);
    if (v === 'hide') return this._opHide(id);
    if (v === 'remove') return this._opRemove(id);
    this._opSize(id, v); this._focus(id); this._say(id);
  }
  /* ta sama galeria co na innych widokach; widżety Studio i ukryte zostają na górze arkusza */
  _addMenu() {
    const page = this._pageHost(); if (!page || typeof page._eGallery !== 'function' || !this._ed) return;
    const by = this._byId();
    page._stHid = this._cur().filter((i) => i.hidden && by.get(i.id)).map((i) => { const t = by.get(i.id); return { id: i.id, name: this._name(t.type, t), icon: (HG_STUDIO_W[t.type] && HG_STUDIO_W[t.type].i) || (t.settings && t.settings.icon) || 'mdi:eye-outline' }; });
    page._stEdit = null;
    page._stAdd = (p) => { if (!this._ed || !p) return; const id = p.studio ? this._opAdd(p.studio) : p.show ? (this._opShow(p.show), p.show) : this._opAddCard(p); if (id) { this._focus(id); this._say(id); } };
    page._eGallery();
  }
  /* ---- przeciąganie: uchwyt (mysz i dotyk, setPointerCapture), podgląd na żywo (HGGrid.snap + move / resize), zapis po puszczeniu ---- */
  _dragBegin(id, mode, m, dom) { const cur = this._cur(), it = cur.find((i) => i.id === id); if (!it) return null; return (this._drag = Object.assign({ id, mode, it, cur, m, next: null }, dom || {})); }
  _dragCalc(D, dx, dy) { const { cw, ch, gap } = D.m, it = D.it, cols = this._cols();
    if (D.mode === 'drag') { const p = HGGrid.snap(it.x * (cw + gap) + dx, it.y * (ch + gap) + dy, D.m); return HGGrid.move(D.cur, it.id, p.x, p.y, cols); }
    const w = Math.max(1, Math.round((it.w * (cw + gap) + dx) / (cw + gap))), h = Math.max(1, Math.round((it.h * (ch + gap) + dy) / (ch + gap)));
    return HGGrid.resize(D.cur, it.id, w, h, cols); }
  _dragMove(dx, dy) {
    const D = this._drag; if (!D) return; const nx = D.next = this._dragCalc(D, dx, dy); if (!D.g) return;
    for (const c of D.g.querySelectorAll('.st-w')) { const p = nx.find((i) => i.id === c.dataset.id); if (!p) continue;
      if (c === D.cell && D.mode === 'drag') { c.style.transform = `translate(${dx}px, ${dy}px)`; continue; } c.setAttribute('style', hgStArea(p)); }
    const me = nx.find((i) => i.id === D.id), gh = D.g.querySelector('.st-gh'); if (gh && me) { gh.hidden = false; gh.style.gridArea = hgStArea(me).slice(10); }
    const add = D.g.querySelector('.st-add'); if (add) add.style.visibility = 'hidden';
    D.g.style.setProperty('--st-rows', String(this._gridRows(nx.filter((i) => !i.hidden), null)));
  }
  _dragEnd(ok) {
    const D = this._drag; this._drag = null; if (!D) return;
    if (D.cell) { D.cell.classList.remove('st-drag'); D.cell.style.transform = ''; }
    const pos = (a) => JSON.stringify(a.map((i) => [i.id, i.x, i.y, i.w, i.h]));
    this._lh = null;
    if (ok && D.next && pos(D.next) !== pos(D.cur)) { this._put(D.next); this._say(D.id); } else this._lay();
  }
  _down(e) {
    if (!this._ed || e.button > 0 || e.isPrimary === false || this._drag) return;
    const b = e.composedPath().find((n) => n.dataset && (n.dataset.st === 'drag' || n.dataset.st === 'size')); if (!b) return;
    const cell = b.closest('.st-w'), g = cell && cell.parentElement; if (!g) return;
    e.preventDefault(); e.stopPropagation();
    const cols = this._cols(); let ch = HG_ST_ROW, gap = HG_ST_GAP, colGap = HG_ST_GAP;
    try { const cs = getComputedStyle(g); const rg = parseFloat(cs.rowGap), cg = parseFloat(cs.columnGap), rh = parseFloat(String(cs.gridTemplateRows).split(' ')[0]); if (rg >= 0) gap = rg; if (cg >= 0) colGap = cg; if (rh > 0) ch = rh; } catch (x) { /* brak layoutu */ }
    const cw = (g.clientWidth - colGap * (cols - 1)) / cols;
    const D = this._dragBegin(cell.dataset.id, b.dataset.st, { cw, ch, gap }, { cell, g }); if (!D) return;
    cell.classList.add('st-drag'); try { b.setPointerCapture(e.pointerId); } catch (x) { /* bez przechwycenia: zdarzenia i tak dochodzą do uchwytu */ }
    const x0 = e.clientX, y0 = e.clientY, mv = (ev) => { if (this._drag === D) this._dragMove(ev.clientX - x0, ev.clientY - y0); };
    const end = (ev) => { for (const [t, f] of L) b.removeEventListener(t, f); if (this._drag === D) this._dragEnd(ev.type === 'pointerup'); };
    const L = [['pointermove', mv], ['pointerup', end], ['pointercancel', end], ['lostpointercapture', end]];
    for (const [t, f] of L) b.addEventListener(t, f);
  }
  /* klawiatura: strzałki przesuwają, Shift + strzałki zmieniają rozmiar, Enter / Spacja / klawisz menu otwiera menu widżetu */
  _key(e) {
    if (!this._ed) return; const c = e.composedPath()[0]; if (!c || !c.classList || !c.classList.contains('st-w')) return;
    const id = c.dataset.id, it = this._cur().find((i) => i.id === id); if (!it) return;
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (d) { e.preventDefault(); e.stopPropagation(); if (e.shiftKey) this._opResize(id, it.w + d[0], it.h + d[1]); else this._opMove(id, it.x + d[0], it.y + d[1]); this._focus(id); this._say(id); return; }
    if (e.key === 'e' || e.key === 'E') { e.preventDefault(); e.stopPropagation(); this._editWidget(id); return; }
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) { e.preventDefault(); e.stopPropagation(); this._menu(id, c.querySelector('[data-st=menu]') || c); }
  }
  getCardSize() { const c = this._cur().filter((i) => !i.hidden); return Math.max(1, Math.ceil(Math.max(1, ...c.map((i) => i.y + i.h)) * (HG_ST_ROW + HG_ST_GAP) / 50)); }
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }
}
hgReg('hg-studio-card', HGStudioGrid, hgTLazy('studio.picker_name'), hgTLazy('studio.picker_description'));
