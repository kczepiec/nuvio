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
.tile{ position:relative; display:grid; grid-template-columns:minmax(0, 1fr) auto; grid-template-rows:auto auto auto 1fr; column-gap:var(--s1); min-width:0; height:auto; min-height:max(calc(var(--k) * 116), 150px); padding:var(--s2); border-radius:var(--r-md); cursor:pointer;
  background: var(--hg-glass-sheen, none), var(--hg-glass-lite, var(--hg-glass-bg)); border:0; box-shadow: var(--hg-edge, 0 0 0 transparent), var(--hg-card-sh, var(--hg-shadow-lg, 0 6px 20px var(--hg-glass-sh)));
  color:#1E2023; text-align:left; transition: transform .25s cubic-bezier(.2,0,0,1), box-shadow .25s, background .4s; -webkit-tap-highlight-color:transparent; touch-action:manipulation; outline:none; }
.tile:active{ transform: scale(.98); }
.tile.hgm-compact{ height:auto; min-height:104px; grid-template-rows:auto auto auto; } .tile.hgm-compact .mt{ display:none; } .tile.hgm-compact .env .t{ font-size:24px; }
.tile.hgm-minimal{ height:auto; min-height:72px; grid-template-rows:auto auto; align-items:center; } .tile.hgm-minimal .env, .tile.hgm-minimal .mt{ display:none; } .tile.hgm-minimal .nm{ margin-top:6px; }
.tile.hgsz-m{ grid-column:span 2; } .tile.hgsz-l{ grid-column:1 / -1; }
.tile:focus-visible{ box-shadow: 0 0 0 2px var(--hg-accent); }
.tile *{ pointer-events:none; } .tile button, .tile button *{ pointer-events:auto; } .tile button ha-icon{ pointer-events:none; }
.ic{ grid-column:1; grid-row:1; position:relative; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--hg-tile-bg); color:#2A2D31; transition: background .2s, color .2s; }
.ic ha-icon{ width:20px; height:20px; }
.tile.lit .ic{ background:var(--hg-accent-soft); color:var(--hg-accent-tx); }
.tr{ grid-column:2; grid-row:1; display:flex; align-items:center; gap:6px; }
.pr{ width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.04); color:#7A7E84; transition: background .2s, color .2s; }
.pr ha-icon{ width:18px; height:18px; } .pr.on{ background:var(--hg-accent); color:var(--hg-on-accent); }
.lb{ position:relative; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.05); color:#3A3D42; transition: background .2s, color .2s; }
.lb ha-icon{ width:20px; height:20px; } .lb.on{ background:var(--hg-accent); color:var(--hg-on-accent); }
.lb:active{ transform:scale(.92); }
.nm{ grid-column:1 / -1; grid-row:2; margin-top:var(--s1); font-size:var(--fs-md); font-weight:500; letter-spacing:-.005em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.25; }
.env{ grid-column:1 / -1; grid-row:3; display:flex; align-items:baseline; gap:10px; min-width:0; margin-top:2px; white-space:nowrap; font-variant-numeric:tabular-nums; }
.env .t{ display:inline-flex; align-items:center; gap:2px; font-size:clamp(28px, calc(var(--k) * 24), 36px); font-weight:200; color:#1E2023; letter-spacing:-.02em; line-height:1.15; }
.env .u{ display:inline-flex; align-items:center; gap:2px; font-size:var(--fs-sm); font-weight:400; color:#4A4E54; line-height:1.15; }
.env ha-icon{ align-self:center; } .env .t ha-icon{ display:none; } .env .u ha-icon{ width:14px; height:14px; color:inherit; }
.mt{ grid-column:1 / -1; grid-row:4; align-self:end; display:flex; align-items:center; gap:5u; min-width:0; height:max(14u, 17px); font-size:var(--fs-sm); color:#4A4E54; font-variant-numeric:tabular-nums; white-space:nowrap; overflow:hidden; }
.mt > span{ overflow:hidden; text-overflow:ellipsis; min-width:0; }
.mt .lt{ color:var(--hg-accent-tx); } .mt .xp{ margin-left:auto; flex:none; width:16px; height:16px; opacity:.8; transition:transform .25s cubic-bezier(.2,0,0,1), opacity .25s; } @media (hover:hover) and (pointer:fine){ .tile:hover .xp{ opacity:1; transform:translate(2px,-2px); } }
.dot{ width:7px; height:7px; border-radius:50%; flex:none; background:var(--c); }
.cl{ display:inline-flex; align-items:center; gap:4u; flex:none; color:#3A3D42; }
/* kropka w kolorze trybu (tokeny --hg-ac-*): pracuje = pełna, szacunek = przygaszona, nie pracuje = blada, sam tryb = obwódka */
.cl.ce .dot{ opacity:.55; } .cl.ci .dot{ opacity:.32; } .cl.cm .dot{ background:transparent; box-shadow:inset 0 0 0 1.5px var(--c); }
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
      const pr = prs.length ? `<span class="pr ${prOn ? 'on' : ''}" role="img" aria-label="${H.esc(prOn ? (occ ? hgT('cards.areas.someone_is_in_the') : hgT('cards.areas.motion_detected')) : (occ ? hgT('cards.areas.no_presence') : hgT('cards.areas.no_motion')))}" title="${prOn ? (occ ? hgT('cards.areas.presence') : hgT('common.motion')) : (occ ? hgT('cards.areas.no_presence') : hgT('cards.areas.no_motion'))}">${H.icon(occ ? (prOn ? 'mdi:account' : 'mdi:account-outline') : 'mdi:motion-sensor')}</span>` : '';
      const envH = env.t != null || env.u != null ? `<div class="env">${env.t != null ? `<span class="t">${H.icon('mdi:thermometer')}${H.fmt(env.t, 1)}°</span>` : ''}${env.u != null ? `<span class="u">${H.icon('mdi:water-percent')}${H.pct(H.fmt(env.u, 0))}</span>` : ''}</div>` : '';
      const mt = [on ? `<span class="lt">${hgT('cards.areas.lights_count', { count: on })}</span>` : '',
        ci ? `<span class="cl ${ci.conf === 'mode' ? 'cm' : ci.act === 'idle' ? 'ci' : ci.conf === 'estimated' ? 'ce' : ''}"><i class="dot" style="--c:${dc}"></i>${H.esc(cll)}</span>` : ''].filter(Boolean).join('<span aria-hidden="true">·</span>');
      const lb = okL.length ? `<button class="lb ${on ? 'on' : ''}" data-act="lights" data-a="${H.esc(a.id)}" aria-pressed="${!!on}" aria-label="${H.esc(on ? hgT('cards.areas.lights_turn_off_aria', { name: a.name }) : hgT('cards.areas.lights_turn_on_aria', { name: a.name }))}" title="${on ? hgT('cards.areas.turn_off_lights') : hgT('cards.areas.turn_on_lights')}">${H.icon(on ? 'mdi:lightbulb-on' : 'mdi:lightbulb-outline')}</button>` : '';
      const al = [a.name, ...env.txt, on ? hgT('cards.areas.lights_on_count', { count: on }) : '', prs.length ? (prOn ? (occ ? hgT('cards.areas.state_presence') : hgT('common.state_motion')) : '') : '', ci ? cla : ''].filter(Boolean).join(', ');
      tiles.push(`<div class="tile lift ${on ? 'lit' : ''} ${HGL.szc(LZ[a.id])} ${a.mode ? 'hgm-' + a.mode : ''}" data-hgk="${H.esc(a.id)}" role="button" tabindex="0" data-act="open" data-a="${H.esc(a.id)}" aria-label="${H.esc(al)}">
        <span class="ic">${H.icon(a.icon)}</span><span class="tr">${pr}${lb}</span><b class="nm">${H.esc(a.name)}</b>${envH}<div class="mt">${mt}<span class="xp">${H.icon('mdi:arrow-top-right')}</span></div></div>`);
    }
    // „Pozostałe”: kompaktowe przełączniki encji spoza 6 pokoi (każda raz)
    const oth = m.others.length ? `<div class="oth" role="group" aria-label="${hgT('cards.areas.other')}"><b>${hgT('cards.areas.other')}</b>${m.others.map((e) => {
      const s = h.states[e], ok = H.ok(s), on = s.state === 'on', G0 = HGAreas.glob(c.areas) || {}, own = !(G0.entity_names && G0.entity_names[e]) && m.list.find((r) => r.virtual && r.id !== '_none' && r.ents.includes(e)), nm = own ? own.name : HGAreas.name(h, e, null, G0);
      const ic = /schod|stair/.test(e) ? 'mdi:stairs-down' : /taras|balkon|balcony|terrace/.test(e) ? 'mdi:balcony' : 'mdi:lightbulb-outline';
      return `<button class="pl ${on ? 'on' : ''}" data-act="tog" data-e="${H.esc(e)}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${H.esc(`${nm} – ${ok ? (on ? hgT('cards.areas.turn_off') : hgT('cards.areas.turn_on')) : hgT('common.state_unavailable')}`)}">${H.icon(ic)}<span>${H.esc(nm)}</span></button>`;
    }).join('')}</div>` : '';
    return `<div class="grid" role="list" aria-label="${hgT('common.rooms')}" data-hgl="rooms" data-hgsz="1">${tiles.join('')}</div>${oth}`;
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
