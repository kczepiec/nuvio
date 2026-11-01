/* --- DZIENNIK: ostatnie zmiany wybranych encji (logbook HA) z czasem względnym --- */
const hgAgoRel = (ms) => { const s = Math.round((ms - Date.now()) / 1000), f = new Intl.RelativeTimeFormat(HG_LOC(), { numeric: 'auto' });
  const a = Math.abs(s); return a < 60 ? f.format(0, 'second').replace(/^./, (x) => x.toUpperCase()) : a < 3600 ? f.format(Math.round(s / 60), 'minute') : a < 86400 ? f.format(Math.round(s / 3600), 'hour') : f.format(Math.round(s / 86400), 'day'); };
class HGLogbookCard extends HGBase {
  static getStubConfig(h) { return { entities: Object.keys((h && h.states) || {}).filter((e) => ['light', 'lock', 'binary_sensor', 'cover'].includes(hgDom(e))).slice(0, 4) }; }
  defaults() { return { entities: [], title: null, hours: 24, max: 6 }; }
  ents() { return (this._config.entities || []).map((x) => (typeof x === 'string' ? x : x && x.entity)).filter(Boolean); }
  _extraSig() { return [this._ek, Math.floor(Date.now() / 60e3)]; }
  css() { return HG_NV_CSS + U(`
.nv-mid{ justify-content:flex-start; overflow:auto; scrollbar-width:none; } .nv-mid::-webkit-scrollbar{ display:none; }
.lb{ display:flex; flex-direction:column; gap:2u; margin:0; padding:0; list-style:none; }
.lb li{ display:flex; align-items:center; gap:var(--s1); padding:4u 0; animation: nvLb var(--hg-t-slow) var(--hg-ease-out) both; animation-delay: calc(var(--i, 0) * var(--hg-t-stagger, 30ms)); }
.lb li + li{ border-top:1px solid color-mix(in srgb, currentColor 8%, transparent); }
.lb time{ font-size:var(--fs-xs); opacity:.55; white-space:nowrap; flex:none; }
@keyframes nvLb{ from{ opacity:0; transform:translateY(4px); } } @media (prefers-reduced-motion: reduce){ .lb li{ animation:none; } }
`); }
  render() { const c = this._config, h = this._hass, E = this.ents();
    if (!E.length) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.logbook.choose_entities_for_the')}</span></ha-card>`;
    this._load(E); const L = (this._ev || []).slice(0, Math.max(1, +c.max || 6));
    const row = (x, i) => { const s = H.st(h, x.entity_id), st = s && x.state != null ? H.T(h, Object.assign({}, s, { state: x.state })) : x.message || x.state || '';
      const ic = (s && s.attributes.icon) || HG_DOM_ICON2[hgDom(x.entity_id || '')] || 'mdi:history', on = HG_ON_ST.includes(x.state);
      return `<li style="--i:${i}" data-key="${H.esc(x.entity_id + x.when)}"><span class="nv-ic ${on ? 'on' : ''}">${H.icon(ic)}</span><span class="nv-name"><b>${H.esc(x.name || H.name(h, x.entity_id))}</b><small>${H.esc(st)}</small></span><time>${H.esc(hgAgoRel(x.when * 1000))}</time></li>`; };
    return `<ha-card class="glass">${hgUI.header(c.title || hgT('cards.logbook.recent_activity'), { icon: 'mdi:history' })}<div class="nv-mid">${this._ev == null ? `<span class="nv-empty">${hgT('common.loading')}</span>` : L.length ? `<ul class="lb">${L.map(row).join('')}</ul>` : `<span class="nv-empty">${hgT('cards.logbook.no_activity_in_this')}</span>`}</div></ha-card>`; }
  /* nowe pytanie do HA tylko po zmianie którejś z encji (last_changed) */
  _load(E) { const h = this._hass, k = E.map((e) => { const s = h.states[e]; return e + (s ? s.last_changed : ''); }).join('|'); if (k === this._lk || !h.callWS) return; this._lk = k; const hr = +this._config.hours || 24;
    h.callWS({ type: 'logbook/get_events', start_time: new Date(Date.now() - hr * 3600e3).toISOString(), end_time: new Date().toISOString(), entity_ids: E })
      .then((r) => { if (this._lk !== k) return; this._ev = (r || []).filter((x) => x.entity_id).sort((a, b) => b.when - a.when); this._ek = k; this.rerender(); }).catch(() => { this._ev = []; this._ek = k + '!'; this.rerender(); }); }
  getGridOptions() { return { columns: 6, rows: 4 }; }
}
hgReg('hg-logbook-card', HGLogbookCard, hgTLazy('cards.logbook.picker_name'), hgTLazy('cards.logbook.picker_description'));
