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
  _extraSig() { const d = typeof HGRoomsX !== 'undefined' && HGRoomsX.draft; return [HGL.data.s.rooms || null, (HGL.data.wiz || {}).areas || null, d && HGRoomsX.dirty ? d.pictures : null]; }
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
.grid{ display:grid; grid-template-columns:minmax(0, 1fr); gap:26px; padding:2px 2px 6px; }
/* kolumny po szerokosci karty obszarow: >=900 px 3, 580-900 px 2, ponizej 1 (Studio ~1080 px content); config columns ogranicza maksimum (1-3) */
@container (min-width: 580px){ .grid{ grid-template-columns:repeat(2, minmax(0, 1fr)); } }
@container (min-width: 900px){ .grid{ grid-template-columns:repeat(3, minmax(0, 1fr)); } .grid.cols2{ grid-template-columns:repeat(2, minmax(0, 1fr)); } }
.grid.cols1{ grid-template-columns:minmax(0, 1fr) !important; }
.tile{ position:relative; display:flex; flex-direction:column; justify-content:space-between; min-width:0; box-sizing:border-box; aspect-ratio:465 / 285; min-height:230px; padding:18px 20px 16px; border-radius:28px; overflow:hidden; cursor:pointer;
  background:#0a0c10; border:0; color:#fff; text-align:left; text-shadow:0 1px 8px rgba(0,0,0,.5); transition: box-shadow var(--hg-t-base, .2s) var(--hg-ease-out, ease-out); -webkit-tap-highlight-color:transparent; touch-action:manipulation; outline:none;
  -webkit-backdrop-filter:none; backdrop-filter:none; box-shadow:0 14px 36px rgba(0,0,0,.34); }
.tile .ph{ position:absolute; inset:0; width:auto; height:auto; border-radius:inherit; background:#0a0c10 center/cover no-repeat; }
.tile .sh{ position:absolute; inset:0; border-radius:inherit; background:linear-gradient(180deg, rgba(6,10,16,.62) 0%, rgba(6,10,16,.02) 34%, rgba(6,10,16,.16) 58%, rgba(6,10,16,.82) 100%); }
.tile.nop .ph{ background:linear-gradient(165deg, rgba(42,50,62,.98) 0%, rgba(20,26,34,.98) 55%, #0a0c10 100%); }
.tile.nop .sh{ background:linear-gradient(180deg, rgba(0,0,0,.22) 0%, rgba(0,0,0,.52) 100%); }
.tile:active{ transform: scale(.98); }
.tile:focus-visible{ box-shadow: 0 0 0 2px var(--hg-accent), 0 0 24px var(--hg-accent-soft, var(--hg-accent-glow)); }
.tile::after{ content:none; }
@media (hover:hover) and (pointer:fine){ .tile:hover{ transform:none; box-shadow: 0 0 0 2px var(--hg-accent), 0 0 24px var(--hg-accent-soft, var(--hg-accent-glow)); } }
.tile *{ pointer-events:none; } .tile button, .tile button *{ pointer-events:auto; } .tile button ha-icon{ pointer-events:none; }
.hd{ position:relative; z-index:1; display:flex; align-items:flex-start; gap:12px; min-width:0; }
.hd .ic{ flex:none; display:flex; align-items:center; justify-content:center; width:28px; height:28px; min-width:28px; color:#fff; } .hd .ic ha-icon{ --mdc-icon-size:28px; width:28px; height:28px; }
.tx{ flex:1; min-width:0; }
.nm{ display:block; font-size:clamp(16px, 1.55vw, 22px); font-weight:600; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.stt{ display:flex; align-items:center; gap:6px; margin-top:2px; font-size:13px; color:rgba(255,255,255,.85); line-height:1.3; }
.sd{ width:7px; height:7px; border-radius:50%; flex:none; background:#9AA0A6; } .stt.on .sd{ background:#34C759; }
.cv{ flex:none; display:flex; margin-top:2px; color:rgba(255,255,255,.85); } .cv ha-icon{ width:22px; height:22px; --mdc-icon-size:22px; }
.mx{ position:relative; z-index:1; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:10px; align-items:end; }
.mc{ display:flex; flex-direction:column; align-items:flex-start; justify-content:flex-end; gap:2px; min-width:0; padding:0; margin:0; border:0; background:none; color:#fff; font:inherit; text-align:left; cursor:pointer; }
.mc.na{ opacity:.45; }
.mv{ display:flex; align-items:center; gap:6px; max-width:100%; font-size:clamp(15px, 1.35vw, 20px); font-weight:300; line-height:1.15; white-space:nowrap; font-variant-numeric:tabular-nums; }
.mv ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; flex:none; opacity:.95; }
.mv.lt ha-icon{ color:var(--hg-accent); opacity:1; }
.mk{ font-size:12px; color:rgba(255,255,255,.72); line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; min-height:15px; }
.mk:empty{ visibility:hidden; }
/* wariant listy: niski wiersz z miniaturą (kolory z motywu HA / tokenów Nuvio, nie na sztywno jasne) */
.grid.list{ grid-template-columns:minmax(0, 1fr) !important; gap:var(--s1); }
.grid.list .tile{ aspect-ratio:auto; min-height:0; height:72px; flex-direction:row; align-items:center; gap:14px; padding:0 14px 0 0; color:var(--primary-text-color, var(--hg-card-fg, #1E2023)); text-shadow:none;
  background:var(--hg-glass-lite, var(--hg-glass-bg)); box-shadow:var(--hg-edge, 0 0 0 transparent), var(--hg-card-sh, var(--hg-shadow-lg, 0 6px 20px var(--hg-glass-sh)));
  -webkit-backdrop-filter:var(--hg-bfo, blur(calc(var(--hg-glass-blur, 38px) * var(--hg-bf, 1)))); backdrop-filter:var(--hg-bfo, blur(calc(var(--hg-glass-blur, 38px) * var(--hg-bf, 1)))); }
.grid.list .tile:focus-visible, .grid.list .tile:hover{ box-shadow:var(--hg-edge, 0 0 0 transparent), 0 0 0 2px var(--hg-accent), var(--hg-card-sh, var(--hg-shadow-lg)); }
.grid.list .tile .ph{ position:relative; inset:auto; flex:none; width:72px; height:72px; align-self:stretch; }
.grid.list .tile .sh{ display:none; } .grid.list .tile.nop .ph{ background:linear-gradient(160deg, rgba(42,50,62,.95), rgba(20,26,34,.98)); }
.grid.list .stt, .grid.list .mk, .grid.list .cv{ color:var(--secondary-text-color, var(--hg-t2, rgba(0,0,0,.55))); }
.grid.list .mc{ color:inherit; }
.grid.list .hd{ display:contents; } .grid.list .tx{ flex:1; } .grid.list .ic{ display:none; } .grid.list .nm{ font-size:16px; }
.grid.list .mx{ display:flex; gap:18px; flex:none; align-items:center; } .grid.list .mk{ display:none; } .grid.list .mv{ font-size:16px; } .grid.list .mv ha-icon{ width:18px; height:18px; --mdc-icon-size:18px; }
.grid.list .cv{ order:3; }
.oth{ display:flex; flex-wrap:wrap; align-items:center; gap:var(--s1); margin-top:var(--s2); font-size:var(--fs-sm); color:var(--secondary-text-color, var(--hg-t2, #4A4E54)); }
.oth b{ font-weight:600; color:var(--primary-text-color, var(--hg-card-fg, #2A2D31)); margin-right:2u; display:inline-flex; align-items:center; height:32px; padding:0 var(--s2); border-radius:var(--r-md); background:var(--hg-glass-lite, var(--hg-glass-bg)); }
.oth button{ display:inline-flex; align-items:center; gap:6px; height:40px; padding:0 var(--s2) 0 10px; border-radius:var(--r-md); background:var(--hg-glass-lite, var(--hg-glass-bg)); border:1px solid var(--hg-glass-bd, transparent); color:var(--primary-text-color, var(--hg-card-fg, #2A2D31)); font-size:var(--fs-sm); font-weight:600; cursor:pointer; -webkit-tap-highlight-color:transparent; touch-action:manipulation; transition: background .2s, color .2s; }
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
      const offline = dead || (env.t == null && env.u == null && !okL.length && !ci);
      const mcol = (ico, v, cap, extra = '', tag = 'div', attr = '') => `<${tag} class="mc ${v == null ? 'na' : ''} ${extra}" ${attr}><span class="mv ${extra}">${H.icon(ico)}${v == null ? '—' : v}</span><span class="mk">${cap}</span></${tag}>`;
      const lcol = okL.length ? mcol(on ? 'mdi:lightbulb-on' : 'mdi:lightbulb-outline', on, hgT('cards.areas.lights_label'), 'lt', 'button', `type="button" data-act="lights" data-a="${H.esc(a.id)}" aria-pressed="${!!on}" aria-label="${H.esc(on ? hgT('cards.areas.lights_turn_off_aria', { name: a.name }) : hgT('cards.areas.lights_turn_on_aria', { name: a.name }))}"`) : mcol('mdi:lightbulb-outline', null, hgT('cards.areas.lights_label'));
      const tgt = tg != null ? hgT('cards.areas.target', { value: H.fmt(tg, 1) }) : '';
      const mx = `<div class="mx">${mcol('mdi:thermometer', env.t != null ? H.fmt(env.t, 1) + '°C' : null, tgt)}${mcol('mdi:water-outline', env.u != null ? H.pct(H.fmt(env.u, 0)) : null, hgT('cards.areas.humidity_label'))}${lcol}</div>`;
      const pic = a.picture ? `style="background-image:url('${H.cssUrl(a.picture)}')"` : '';
      const al = [a.name, ...env.txt, on ? hgT('cards.areas.lights_on_count', { count: on }) : '', prs.length ? (prOn ? (occ ? hgT('cards.areas.state_presence') : hgT('common.state_motion')) : '') : '', ci ? cla : ''].filter(Boolean).join(', ');
      tiles.push(`<div class="tile lift ${on ? 'lit' : ''} ${a.picture ? '' : 'nop'}" data-hgk="${H.esc(a.id)}" role="button" tabindex="0" data-act="open" data-a="${H.esc(a.id)}" aria-label="${H.esc(al)}">
        <span class="ph" ${pic}></span><span class="sh"></span><div class="hd"><span class="ic">${H.icon(a.icon)}</span><div class="tx"><b class="nm">${H.esc(a.name)}</b><span class="stt ${offline ? '' : 'on'}"><i class="sd"></i>${offline ? hgT('cards.areas.status_offline') : hgT('cards.areas.status_active')}</span></div><span class="cv">${H.icon('mdi:chevron-right')}</span></div>${mx}</div>`);
    }
    // „Pozostałe”: kompaktowe przełączniki encji spoza 6 pokoi (każda raz)
    const oth = m.others.length && c.layout === 'list' ? `<div class="oth" role="group" aria-label="${hgT('cards.areas.other')}"><b>${hgT('cards.areas.other')}</b>${m.others.map((e) => {
      const s = h.states[e], ok = H.ok(s), on = s.state === 'on', G0 = HGAreas.glob(c.areas) || {}, own = !(G0.entity_names && G0.entity_names[e]) && m.list.find((r) => r.virtual && r.id !== '_none' && r.ents.includes(e)), nm = own ? own.name : HGAreas.name(h, e, null, G0);
      const ic = /schod|stair/.test(e) ? 'mdi:stairs-down' : /taras|balkon|balcony|terrace/.test(e) ? 'mdi:balcony' : 'mdi:lightbulb-outline';
      return `<button class="pl ${on ? 'on' : ''}" data-act="tog" data-e="${H.esc(e)}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${H.esc(`${nm} – ${ok ? (on ? hgT('cards.areas.turn_off') : hgT('cards.areas.turn_on')) : hgT('common.state_unavailable')}`)}">${H.icon(ic)}<span>${H.esc(nm)}</span></button>`;
    }).join('')}</div>` : '';
    return `<div class="grid ${c.layout === 'list' ? 'list' : ''} cols${Math.min(3, Math.max(1, parseInt(c.columns, 10) || 3))}" role="list" aria-label="${hgT('common.rooms')}" data-hgl="rooms" data-hgsz="1">${tiles.join('')}</div>${oth}`;
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
