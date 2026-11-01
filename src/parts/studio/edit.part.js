/* studio/edit: edycja widżetów Studio (formularz galerii), mieszana do HGPage.prototype po hg-edit. */
/* widżet siatki Studio → formularz galerii (jak kafel z :tiles) */
const HG_STUDIO_COMP = { greeting: 'hero', weather: 'weather', media: 'mediamini', cameras: 'cameras', energy: 'power', scenes: 'scenes' };
const hgStudioCompState = (meta, settings, h, grid) => {
  if (!meta) return null;
  const st = settings || {};
  if (meta.type === 'card') {
    const c = st.card; if (!c || !c.type) return null;
    if (c.nv_comp) return { cid: c.nv_comp, v: JSON.parse(JSON.stringify(c.nv_v || {})), n: c.nv_n || st.name || '', i: c.nv_i || st.icon || '', t: c.nv_t || '' };
    const cc = typeof hgFromHA === 'function' && typeof hgCardClean === 'function' ? hgCardClean(hgFromHA(Object.assign({}, c))) : Object.assign({}, c);
    const ty = String(cc.type || ''), cid = /-grid-card$/.test(ty) ? 'grid' : /-stack-card$/.test(ty) ? (cc.direction === 'horizontal' ? 'hstack' : 'vstack') : null;
    if (cid) {
      const C = HG_COMP.find((x) => x.id === cid); if (!C) return null;
      const o = {};
      for (const q of C.opts || []) { const v = q.k === 'flat' ? cc.glass === false : q.k === 'nodiv' ? cc.divider === false : cc[q.k]; if (v != null && v !== '' && v !== false) o[q.k] = Array.isArray(v) ? v.join(', ') : v; }
      return { cid, v: { cards: JSON.parse(JSON.stringify(cc.cards || [])), o }, n: st.name || cc.title || cc.name || '', i: st.icon || cc.icon || '' };
    }
    const Cf = HG_COMP.find((x) => x.from && x.card && x.card.replace(/^(hg|nuvio)-/, '') === ty.replace(/^custom:/, '').replace(/^(hg|nuvio)-/, ''));
    if (Cf) return { cid: Cf.id, v: Cf.from(cc), n: st.name || cc.title || cc.name || '', i: st.icon || cc.icon || '' };
    const plain = {}; for (const q in c) if (!/^nv_/.test(q)) plain[q] = c[q];
    return { cid: 'hacard', v: { o: { src: JSON.stringify(plain, null, 2) } }, n: st.name || c.title || c.name || '', i: st.icon || c.icon || '' };
  }
  const cid = HG_STUDIO_COMP[meta.type];
  if (cid) {
    const C = HG_COMP.find((x) => x.id === cid); if (!C) return null;
    const v = JSON.parse(JSON.stringify(st.nv_v || {}));
    if (meta.type === 'greeting' || meta.type === 'weather' || meta.type === 'media') v.e = v.e || st.entity;
    if (meta.type === 'weather') { v.entity = v.entity || st.entity; if (st.sun) v.sun = st.sun; }
    if (meta.type === 'cameras') v.entities = v.entities || st.entities || (st.entity ? [st.entity] : []);
    if (meta.type === 'energy') v.entities = v.entities || (st.entity ? [st.entity] : []);
    if (meta.type === 'scenes') v.scripts = v.scripts || (st.entities || []).map((e) => (typeof e === 'string' ? { entity: e } : e));
    if (!Object.keys(v).length && C.slots && C.slots[0]) v[C.slots[0].k] = st.entity;
    return { cid, v, n: st.name || '', i: st.icon || '', t: st.nv_t || '' };
  }
  if (typeof grid._cfg === 'function') {
    const cfg = grid._cfg(meta); if (!cfg) return null;
    return { cid: 'hacard', v: { o: { src: JSON.stringify(cfg, null, 2) } }, n: st.name || '', i: st.icon || '' };
  }
  return null;
};
const hgStudioSettingsFromEdit = (type, card, v) => {
  const s = {};
  if (v && typeof v === 'object') {
    if (v.e) s.entity = v.e;
    if (v.entity) s.entity = v.entity;
    if (v.entities) s.entities = v.entities.slice();
    if (v.sun) s.sun = v.sun;
    if (v.scripts) s.entities = v.scripts.map((x) => (typeof x === 'string' ? x : x.entity)).filter(Boolean);
  }
  if (card && typeof card === 'object') {
    if (card.entity) s.entity = card.entity;
    if (card.entities) s.entities = card.entities.slice();
    if (card.sun) s.sun = card.sun;
    if (card.scripts) s.entities = card.scripts.map((x) => (typeof x === 'string' ? x : x.entity)).filter(Boolean);
    if (card.nv_v) s.nv_v = JSON.parse(JSON.stringify(card.nv_v));
  }
  return s;
};
/* testy i zrzuty (tests/cards-demo.html): lista komponentów i budowanie konfiguracji jak w galerii */
window.__hgCompT = { list: HG_COMP, card: hgCompCard, cfg: hgCompCfg, kid: hgKidCfg, cands: (h, sl) => hgSlotCands(h, sl) };
const HG_STUDIO_EDIT = {
  _eStudioEditSync(on) {
    if (!this._studioGrid || !this._studioGrid()) return;
    for (const c of this._cards || []) { try { if (c._lay) c._lay(); else if (c.rerender) c.rerender(); } catch (e) { /* */ } }
    if (on) requestAnimationFrame(() => { for (const c of this._cards || []) { try { if (c._scaleSoon) c._scaleSoon(); } catch (e) { /* */ } } });
  },
  _eStudioWidgetEdit(id, grid) {
    if (!this._editing || !grid || !id) return;
    const meta = grid._byId && grid._byId().get(id), lay = (grid._cur && grid._cur() || []).find((i) => i.id === id);
    if (!meta || !lay || lay.hidden) return;
    const st0 = hgStudioCompState(meta, meta.settings, this._hass, grid);
    if (!st0) return this._eToast(hgT('studio.edit_unavailable'));
    const sz = (k) => { const p = grid._preset(meta.type, k); return !!p && p.w === lay.w && p.h === lay.h; };
    const z = sz('s') ? 's' : sz('l') ? 'l' : 'm';
    this._stEdit = (p) => grid._opEditSave(p);
    this._stAdd = null;
    this._eGalSc = this._pageScope();
    this._eGalCt = null;
    this._eComp(st0.cid, Object.assign({ sc: this._pageScope(), edit: id, z }, st0));
  },
};
Object.assign(HGPage.prototype, HG_STUDIO_EDIT);
