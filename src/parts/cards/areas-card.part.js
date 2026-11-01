/* Siatka pokoi */
class HGAreasCard extends HGBase {
  defaults() { return { room_path: HG_P('pokoj'), areas: {} }; }
  constructor() {
    super();
    this.shadowRoot.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.act === 'open') { e.preventDefault(); this.onAct('open', e.target); }
    });
  }
  _m() { return HGAreas.model(this._hass, this._config.areas); }
  connectedCallback() { super.connectedCallback(); this._lsub = this._lsub || (() => { this._entsC = null; this.rerender(); }); HGL.subs.add(this._lsub); }
  disconnectedCallback() { if (this._lsub) HGL.subs.delete(this._lsub); }
  _extraSig() { return [HGL.data.s.rooms || null, (HGL.data.wiz || {}).areas || null]; }
  /* pokoje po nadpisaniach układu: kolejność, ukryte, dodane obszary HA */
  _rooms(m) { const L = HGL.get('rooms'), hid = new Set(L.hidden);
    const add = L.added.map((x) => m.byId[x.e]).filter((a) => a && !m.rooms.includes(a));
    return HGL.sort([...m.rooms, ...add].filter((a) => !hid.has(a.id)), (a) => a.id, L.order).map((a) => { const cf = L.conf[a.id]; if (!cf) return a;
      const o = Object.assign({}, a, cf.temp ? { temp: { e: cf.temp } } : {}, cf.hum ? { hum: { e: cf.hum } } : {}, cf.n ? { name: cf.n } : {}, cf.i ? { icon: cf.i } : {}, { mode: cf.t || '' });
      o.watch = [...new Set([...(a.watch || []), cf.temp, cf.hum].filter(Boolean))]; return o; }); }
  ents() { if (!this._hass) return []; const m = this._m(); return [...this._rooms(m).flatMap((a) => a.watch || []), ...m.others]; }
  _changed() { const m = this._mm; this._mm = this._m(); if (m !== this._mm) { this._entsC = null; this._prevStates = null; } return super._changed(); }
  css() {
    return U(`
:host{ height:auto; container-type:inline-size; }
.grid{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:var(--s2); }
/* wąski komponent (S, M w siatce): jedna kolumna, bo ikona i przyciski świateł nie mieszczą się w połowie szerokości */
@container (max-width: 380px){ .grid{ grid-template-columns:minmax(0, 1fr); } .tile.hgsz-m, .tile.hgsz-l{ grid-column:auto; } }
@container (min-width: 700px){ .grid{ grid-template-columns:repeat(3, minmax(0, 1fr)); } }
@container (min-width: 1000px){ .grid{ grid-template-columns:repeat(4, minmax(0, 1fr)); } }
.tile{ position:relative; display:flex; flex-direction:column; justify-content:space-between; min-width:0; box-sizing:border-box; aspect-ratio:465 / 285; min-height:190px; container-type:size; padding:5cqh 4.5cqi; border-radius:var(--r-md); overflow:hidden; cursor:pointer;
  background:var(--hg-glass-lite, var(--hg-glass-bg)); border:0; box-shadow: var(--hg-edge, 0 0 0 transparent), var(--hg-card-sh, var(--hg-shadow-lg, 0 6px 20px var(--hg-glass-sh)));
  color:#fff; text-align:left; transition: transform .25s cubic-bezier(.2,0,0,1), box-shadow .25s; -webkit-tap-highlight-color:transparent; touch-action:manipulation; outline:none; }
.tile .ph{ position:absolute; inset:0; background-size:cover; background-position:center; }
.tile .sh{ position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.08) 40%, rgba(0,0,0,.62) 100%); }
.tile.nop .ph{ background:linear-gradient(160deg, #3a4048, #1c1f24); }
.tile:active{ transform: scale(.98); }
.tile:focus-visible{ box-shadow: 0 0 0 2px var(--hg-accent), 0 0 24px var(--hg-accent-soft, var(--hg-accent)); }
@media (hover:hover) and (pointer:fine){ .tile:hover{ box-shadow: 0 0 0 2px var(--hg-accent), 0 0 24px var(--hg-accent-soft, var(--hg-accent)); } }
.tile *{ pointer-events:none; } .tile button, .tile button *{ pointer-events:auto; } .tile button ha-icon{ pointer-events:none; }
.hd{ position:relative; display:flex; align-items:center; gap:3cqi; min-width:0; }
.ic{ flex:none; display:flex; color:#fff; } .ic ha-icon{ --mdc-icon-size:clamp(20px, 10cqh, 32px); width:clamp(20px, 10cqh, 32px); height:clamp(20px, 10cqh, 32px); }
.tx{ flex:1; min-width:0; }
.nm{ display:block; font-size:clamp(14px, 7cqh, 22px); font-weight:600; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.stt{ display:flex; align-items:center; gap:6px; font-size:clamp(12px, 4.4cqh, 14px); color:rgba(255,255,255,.85); line-height:1.3; }
.sd{ width:7px; height:7px; border-radius:50%; flex:none; background:#9AA0A6; } .stt.on .sd{ background:#34C759; }
.cv{ flex:none; display:flex; color:rgba(255,255,255,.85); } .cv ha-icon{ width:clamp(18px, 8cqh, 26px); height:clamp(18px, 8cqh, 26px); --mdc-icon-size:clamp(18px, 8cqh, 26px); }
.mx{ position:relative; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:2cqi; }
.mc{ display:flex; flex-direction:column; align-items:flex-start; min-width:0; padding:0; margin:0; border:0; background:none; color:#fff; font:inherit; text-align:left; cursor:pointer; }
.mc.na{ opacity:.4; }
.mv{ display:flex; align-items:center; gap:6px; font-size:clamp(14px, 7cqh, 22px); font-weight:300; line-height:1.2; white-space:nowrap; font-variant-numeric:tabular-nums; }
.mv ha-icon{ --mdc-icon-size:clamp(16px, 6cqh, 22px); width:clamp(16px, 6cqh, 22px); height:clamp(16px, 6cqh, 22px); flex:none; }
.mv.lt ha-icon{ color:var(--hg-accent); }
.mk{ font-size:clamp(12px, 4.2cqh, 13px); color:rgba(255,255,255,.75); line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
/* wariant listy: niski wiersz z miniaturą */
.grid.list{ grid-template-columns:minmax(0, 1fr) !important; gap:var(--s1); }
.grid.list .tile{ aspect-ratio:auto; min-height:0; height:72px; container-type:normal; flex-direction:row; align-items:center; gap:14px; padding:0 14px 0 0; }
.grid.list .tile .ph{ position:relative; inset:auto; flex:none; width:72px; height:72px; align-self:stretch; }
.grid.list .tile .sh{ display:none; } .grid.list .tile.nop .ph{ background:linear-gradient(160deg, #3a4048, #1c1f24); }
.grid.list .tile{ color:#1E2023; } .grid.list .stt, .grid.list .mk, .grid.list .cv{ color:#4A4E54; } .grid.list .mc{ color:#1E2023; }
.grid.list .hd{ display:contents; } .grid.list .tx{ flex:1; } .grid.list .ic{ display:none; } .grid.list .nm{ font-size:16px; }
.grid.list .mx{ display:flex; gap:18px; flex:none; } .grid.list .mk{ display:none; } .grid.list .mv{ font-size:16px; } .grid.list .mv ha-icon{ width:18px; height:18px; --mdc-icon-size:18px; }
.grid.list .cv{ order:3; }
.oth{ display:flex; flex-wrap:wrap; align-items:center; gap:var(--s1); margin-top:var(--s2); font-size:var(--fs-sm); color:#4A4E54; }
.oth b{ font-weight:600; color:#2A2D31; margin-right:2u; display:inline-flex; align-items:center; height:32px; padding:0 var(--s2); border-radius:var(--r-md); background:var(--hg-glass-lite, var(--hg-glass-bg)); }
.oth button{ display:inline-flex; align-items:center; gap:6px; height:40px; padding:0 var(--s2) 0 10px; border-radius:var(--r-md); background:var(--hg-glass-lite, var(--hg-glass-bg)); border:1px solid var(--hg-glass-bd); color:#2A2D31; font-size:var(--fs-sm); font-weight:600; cursor:pointer; -webkit-tap-highlight-color:transparent; touch-action:manipulation; transition: background .2s, color .2s; }
.oth button ha-icon{ width:20px; height:20px; pointer-events:none; } .oth button span{ pointer-events:none; }
.oth button.on{ background:var(--hg-accent); border-color:transparent; color:var(--hg-on-accent); }
.oth button:disabled{ opacity:.5; cursor:default; }
.oth button:active{ transform:scale(.97); }
`);
  }
  render() {
    const h = this._hass, c = this._config, m = this._m();
    const lbl = (st) => hgTD('cards.areas.climate_states.' + st, null);   // etykieta trybu klimatyzacji w pokoju, null gdy brak
    const tiles = [], rest = [];
    const LZ = HGL.get('rooms').size;
    for (const a of this._rooms(m)) {
      const env = HGAreas.env(h, a);
      const okL = a.lights.filter((e) => H.ok(h.states[e]));
      const on = a.lights.filter((e) => h.states[e].state === 'on').length;
      // wszystkie włączone urządzenia klimatu pokoju (np. klimatyzacja + piec): potwierdzona praca > szacowana > sam tryb > bezczynność (hgClimRank)
      const CL = a.sec.clim.map((e) => h.states[e]).filter((s) => s.entity_id.startsWith('climate.') && H.ok(s) && s.state !== 'off').map((s) => ({ s, i: hgClimInfo(h, s, s.state, c.areas, a.id) })).filter((x) => x.i);
      const top = CL.sort((x, y) => hgClimRank(y.i) - hgClimRank(x.i))[0], cl = top && top.s, ci = top && top.i;
      // kolor trybu z tej samej mapy co menu „Tryb pracy” pilota (hgClimCol); w auto kierunek pracy, gdy wiadomo, że grzeje / chłodzi
      const ca = cl && cl.attributes, dc = ci && hgClimCol(['heat', 'cool', 'dry', 'fan_only'].includes(ci.act) ? ci.act : ci.mode, parseFloat(ca.temperature ?? ((+ca.target_temp_low + +ca.target_temp_high) / 2)), ca.min_temp ?? 16, ca.max_temp ?? 30);
      // etykieta: potwierdzone bez znaku, szacunek tylko w aria-label, sam tryb jako nazwa trybu (np. „Grzanie”) z pustą kropką (nie twierdzi, że pracuje)
      const cll = ci && (ci.conf === 'mode' ? (HG_AC_MODE[ci.mode] || {}).l || H.stateLabel(ci.mode) : (lbl(ci.act) || H.stateLabel(ci.act)));
      const cla = ci && (ci.conf === 'estimated' ? cll + ' (' + hgT('cards.areas.estimated') + ')' : cll);
      // pokój bez niczego, co da się pokazać lub obsłużyć -> zwinięty do wiersza "Pozostałe"
      // obecność / ruch: tylko prawdziwe, dostępne czujniki pokoju (occupancy/presence ma pierwszeństwo przed motion)
      const prs = a.sec.mot.filter((e) => H.ok(h.states[e]));
      const occ = prs.some((e) => ['occupancy', 'presence'].includes(h.states[e].attributes.device_class));
      const prOn = prs.some((e) => h.states[e].state === 'on');
      const tg = (() => { const x = (a.sec.clim || []).map((e) => h.states[e]).filter((q) => q && q.entity_id.startsWith('climate.') && H.ok(q)).map((q) => parseFloat(q.attributes.temperature)).filter(isFinite); return x.length ? x[0] : null; })();
      const dead = !a.ents.length || a.ents.every((e) => !H.ok(h.states[e]));
      const mcol = (ico, v, cap, extra = '', tag = 'div', attr = '') => `<${tag} class="mc ${v == null ? 'na' : ''} ${extra}" ${attr}><span class="mv ${extra}">${H.icon(ico)}${v == null ? '—' : v}</span><span class="mk">${cap}</span></${tag}>`;
      const lcol = okL.length ? mcol(on ? 'mdi:lightbulb-on' : 'mdi:lightbulb-outline', on, hgT('cards.areas.lights_label'), 'lt', 'button', `type="button" data-act="lights" data-a="${H.esc(a.id)}" aria-pressed="${!!on}" aria-label="${H.esc(on ? hgT('cards.areas.lights_turn_off_aria', { name: a.name }) : hgT('cards.areas.lights_turn_on_aria', { name: a.name }))}"`) : mcol('mdi:lightbulb-outline', null, hgT('cards.areas.lights_label'));
      const mx = `<div class="mx">${mcol('mdi:thermometer', env.t != null ? H.fmt(env.t, 1) + '°C' : null, tg != null ? hgT('cards.areas.target', { value: H.fmt(tg, 1) }) : '&nbsp;')}${mcol('mdi:water-outline', env.u != null ? H.pct(H.fmt(env.u, 0)) : null, hgT('cards.areas.humidity_label'))}${lcol}</div>`;
      const pic = a.picture ? `style="background-image:url('${H.esc(a.picture)}')"` : '';
      const al = [a.name, ...env.txt, on ? hgT('cards.areas.lights_on_count', { count: on }) : '', prs.length ? (prOn ? (occ ? hgT('cards.areas.state_presence') : hgT('common.state_motion')) : '') : '', ci ? cla : ''].filter(Boolean).join(', ');
      tiles.push(`<div class="tile lift ${on ? 'lit' : ''} ${a.picture ? '' : 'nop'}" data-hgk="${H.esc(a.id)}" role="button" tabindex="0" data-act="open" data-a="${H.esc(a.id)}" aria-label="${H.esc(al)}">
        <span class="ph" ${pic}></span><span class="sh"></span><div class="hd"><span class="ic">${H.icon(a.icon)}</span><div class="tx"><b class="nm">${H.esc(a.name)}</b><span class="stt ${dead ? '' : 'on'}"><i class="sd"></i>${dead ? hgT('cards.areas.status_offline') : hgT('cards.areas.status_active')}</span></div><span class="cv">${H.icon('mdi:chevron-right')}</span></div>${mx}</div>`);
    }
    // „Pozostałe”: kompaktowe przełączniki encji spoza 6 pokoi (każda raz)
    const oth = m.others.length ? `<div class="oth" role="group" aria-label="${hgT('cards.areas.other')}"><b>${hgT('cards.areas.other')}</b>${m.others.map((e) => {
      const s = h.states[e], ok = H.ok(s), on = s.state === 'on', G0 = HGAreas.glob(c.areas) || {}, own = !(G0.entity_names && G0.entity_names[e]) && m.list.find((r) => r.virtual && r.id !== '_none' && r.ents.includes(e)), nm = own ? own.name : HGAreas.name(h, e, null, G0);
      const ic = /schod|stair/.test(e) ? 'mdi:stairs-down' : /taras|balkon|balcony|terrace/.test(e) ? 'mdi:balcony' : 'mdi:lightbulb-outline';
      return `<button class="pl ${on ? 'on' : ''}" data-act="tog" data-e="${H.esc(e)}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${H.esc(`${nm} – ${ok ? (on ? hgT('cards.areas.turn_off') : hgT('cards.areas.turn_on')) : hgT('common.state_unavailable')}`)}">${H.icon(ic)}<span>${H.esc(nm)}</span></button>`;
    }).join('')}</div>` : '';
    return `<div class="grid ${c.layout === 'list' ? 'list' : ''}" role="list" aria-label="${hgT('common.rooms')}" data-hgl="rooms" data-hgsz="1">${tiles.join('')}</div>${oth}`;
  }
  onAct(act, t) {
    const h = this._hass, c = this._config;
    if (act === 'tog') { const e = t.dataset.e, s = h.states[e]; if (!H.ok(s)) return; return H.call(h, 'homeassistant', s.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: e }); }
    const a = this._m().byId[t.dataset.a]; if (!a) return;
    if (act === 'open') return H.navigate(`${c.room_path}?area=${encodeURIComponent(a.id)}`);
    if (act === 'lights') {
      const on = a.lights.filter((e) => h.states[e].state === 'on'), av = a.lights.filter((e) => H.ok(h.states[e]));
      if (on.length) return H.call(h, 'homeassistant', 'turn_off', { entity_id: on });
      if (av.length) return H.call(h, 'homeassistant', 'turn_on', { entity_id: av });
    }
  }
  getCardSize() { return 8; }
}
hgReg('hg-areas-card', HGAreasCard, hgTLazy('cards.areas.picker_name'), hgTLazy('cards.areas.picker_description'));
