/* --- roboty: hg-robots-card (vacuum.* + lawn_mower.*, wykrywane automatycznie) ---
   Encje powiązane (bateria, mapa camera.*, select ssania/trybu, czujniki eksploatacji) z tego samego urządzenia (hass.entities.device_id).
   Mapa: camera_proxy z wstępnym wczytaniem, odświeżana tylko gdy kafel jest widoczny i karta przeglądarki aktywna (5 s przy pracy, 30 s w spoczynku). */
const HG_VF = { PAUSE: 4, STOP: 8, HOME: 16, FAN: 32, LOCATE: 512, START: 8192 };
const HG_MF = { START: 1, PAUSE: 2, DOCK: 4 };
/* opcje select (ssanie, tryb, woda): hgTD('cards.robots.options.' + opcja, spacje -> _) */
const HG_OPT_KEYS = ['quiet', 'silent', 'standard', 'basic', 'strong', 'turbo', 'full speed', 'max', 'mopping', 'sweeping', 'sweeping_and_mopping', 'mopping_after_sweeping', 'low', 'medium', 'high'];
/* [wzorzec, etykieta (hgTLazy)] */
const HG_SEL_LBL = [[/suction_level$|_mode_p_\d+_\d+$|fan_speed$/, hgTLazy('cards.robots.settings.suction')], [/cleaning_mode$/, hgTLazy('cards.robots.settings.mode')], [/water_volume$/, hgTLazy('cards.robots.settings.water')]];
/* [wzorzec, id, etykieta (hgTLazy), pełna nazwa (hgTLazy) albo null] */
const HG_CONS = [[/main_brush_left$/, 'main_brush', hgTLazy('cards.robots.consumables.main_brush'), hgTLazy('cards.robots.consumables.main_brush_full')], [/side_brush_left$/, 'side_brush', hgTLazy('cards.robots.consumables.side_brush')],
  [/filter_left$/, 'filter', hgTLazy('cards.robots.consumables.filter')], [/mop(_pad)?_left$/, 'mop', hgTLazy('cards.robots.consumables.mop')], [/sensor_dirty_left$/, 'sensors', hgTLazy('cards.robots.consumables.sensors')]];
const hgRobotState = (s) => {
  const a = s.attributes, st = s.state;
  if (st === 'cleaning' || st === 'mowing') return [st === 'mowing' ? hgT('cards.robots.mowing') : hgT('common.cleaning'), 'work'];
  if (st === 'returning') return [hgT('cards.robots.returning_to_dock'), 'ret'];
  if (st === 'paused') return [hgT('cards.robots.paused'), 'pause'];
  if (st === 'error') return [hgT('cards.robots.error'), 'err'];
  if (st === 'docked') return a.charging ? [hgT('cards.robots.charging'), 'chg'] : [hgT('cards.robots.docked'), 'dock'];
  if (st === 'idle') return [hgT('cards.robots.idle'), 'idle'];
  return [H.T(window.__hgHass, s), 'idle'];
};
const hgUnit = (h, e) => String((h.states[e] && h.states[e].attributes.unit_of_measurement) || '').trim();
const hgUV = (v, u) => H.fmt(v, Math.abs(v) >= 10 ? 0 : 1) + (u ? (u.startsWith('°') ? '' : ' ') + u : '');
const hgAgo = (iso) => {
  const t = Date.parse(iso); if (!isFinite(t)) return '';
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return hgT('common.just_now'); if (m < 60) return hgT('common.ago_minutes', { m });
  const h = Math.round(m / 60); if (h < 24) return hgT('cards.robots.h_ago', { h });
  const d = Math.round(h / 24); return d === 1 ? hgT('cards.robots.yesterday') : hgT('cards.robots.days_ago', { count: d });
};
class HGRobotsCard extends HGBase {
  defaults() { return { title: hgT('cards.robots.robots'), icon: 'mdi:robot-vacuum', entities: [], exclude: [], names: {}, refresh_idle: 30, refresh_work: 5 }; }
  _disc() {
    const h = this._hass, c = this._config, reg = h.entities || {};
    if (this._d && this._d.st === h.states && this._d.ent === h.entities) return this._d;   // te same obiekty -> bez liczenia
    const key = hgNKeys(h.states) + ':' + hgNKeys(reg);
    if (this._d && this._d.key === key && this._d.ent === h.entities) { this._d.st = h.states; return this._d; }
    const ids = (c.entities.length ? c.entities : Object.keys(h.states).filter((e) => /^(vacuum|lawn_mower)\./.test(e)).sort())
      .filter((e) => !c.exclude.includes(e) && h.states[e] && !(reg[e] && reg[e].hidden));
    const byDev = {};
    for (const [e, r] of Object.entries(reg)) if (r.device_id) (byDev[r.device_id] = byDev[r.device_id] || []).push(e);
    const robots = ids.map((e) => {
      const dev = reg[e] && reg[e].device_id, rel = (dev && byDev[dev] || []).filter((x) => x !== e && h.states[x]);
      const cat = (x) => reg[x] && reg[x].entity_category;
      const cams = rel.filter((x) => x.startsWith('camera.')).sort((a, b) => a.length - b.length);
      const sels = rel.filter((x) => x.startsWith('select.') && !/room_\d+_|map/.test(x) && !cat(x) && HG_SEL_LBL.some(([re]) => re.test(x)))
        .sort((a, b) => HG_SEL_LBL.findIndex(([re]) => re.test(a)) - HG_SEL_LBL.findIndex(([re]) => re.test(b)));
      const sens = (re) => rel.find((x) => x.startsWith('sensor.') && re.test(x));
      const bat = rel.find((x) => x.startsWith('sensor.') && (h.states[x].attributes.device_class === 'battery'));
      const cons = HG_CONS.map(([re, id, nm, full]) => { const x = sens(re); return x ? { e: x, id, nm, full: full || null, t: sens(new RegExp(re.source.replace('_left$', '_time_left$'))) } : null; }).filter(Boolean);
      return { e, cam: c.map && c.map[e] || cams[0], sels, bat, cons, hist: sens(/cleaning_history$/), time: sens(/_cleaning_time$/), area: sens(/_cleaned_area$/),
        count: sens(/cleaning_count$/), total: sens(/total_cleaned_area$/), room: sens(/current_room$/) };
    });
    this._entsC = null;
    return (this._d = { key, st: h.states, ent: h.entities, robots });
  }
  ents() { const d = this._disc(); return d.robots.flatMap((r) => [r.e, r.cam, r.bat, r.hist, r.time, r.area, r.count, r.room, ...r.sels, ...r.cons.map((x) => x.e)]).filter(Boolean); }
  _extraSig() { return [this._d && this._d.key, Math.floor(Date.now() / 60000), [...(this._sel || new Map())].map(([k, v]) => k + [...v].join(','))]; }
  css() {
    return U(`
ha-card.glass{ height:auto; display:flex; flex-direction:column; gap:var(--s2); }
.list{ display:flex; flex-direction:column; gap:var(--s2); }
.rb{ container-type:inline-size; border-radius:var(--r-md); background:var(--hg-inner-bg); border:0; box-shadow:var(--hg-inner-hi); padding:var(--s2); }
.g{ display:grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); gap:var(--s2); align-items:start; }
.g.nomap{ grid-template-columns: minmax(0,1fr); }
/* ilustracja stanu dla robota bez mapy (widoczna tylko w układzie dwóch kolumn, wyrównuje wysokość z kartą z mapą) */
.ill{ display:none; position:relative; border-radius:var(--r-sm); overflow:hidden; flex-direction:column; align-items:center; justify-content:center; gap:4u;
  background: rgba(236,237,239,.9); color:#2A2D31; }
.ill .ring{ position:relative; width:96u; height:96u; border-radius:50%; display:flex; align-items:center; justify-content:center;
  background: conic-gradient(var(--hg-accent) calc(var(--p, 0) * 1%), rgba(0,0,0,.08) 0); }
.ill .ring .in{ position:absolute; inset:5u; border-radius:50%; background:#fff; box-shadow: inset 0 1u 4u rgba(0,0,0,.06); display:flex; align-items:center; justify-content:center; }
.ill .ring ha-icon{ position:relative; width:46u; height:46u; color:#2A2D31; }
.work .ill .ring ha-icon{ animation: var(--hg-loop, hgrb 2.4s ease-in-out infinite); } .ret .ill .ring ha-icon{ animation: var(--hg-loop, hgrb-ret 1.6s ease-in-out infinite); }
.ill b{ font-size:var(--fs-md); font-weight:600; margin-top:6u; } .ill small{ font-size:var(--fs-xs); color:#5A5E64; }
.ill .dock{ position:absolute; right:10u; bottom:8u; width:16u; height:16u; color:#6A6E74; }
/* desktop / tablet poziomo: roboty obok siebie (2 równe kolumny), w każdej mapa u góry i sterowanie pod spodem */
@media (min-width: 1000px) and (orientation: landscape){
  .list.two{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); align-items:stretch; }
  .list.two .rb{ display:flex; flex-direction:column; }
  .list.two .g{ grid-template-columns: minmax(0,1fr); gap:var(--s1); }
  .list.two .media{ height: clamp(140px, 27vh, 330px); flex:none; }
  .list.two .map{ aspect-ratio:auto; height:100%; max-height:none; }
  .list.two .ill{ display:flex; }
  .list.two .side{ gap:var(--s1); }
  .list.two .cb{ flex-direction:row; gap:5u; height:40px; font-size:var(--fs-xs); }
  .list.two .seg button, .list.two .rc{ height:34px; }
  .list.two .sec{ margin-bottom:3u; }
  .list.two .cs, .list.two .kv div{ padding:5u var(--s1); }
}
@container (max-width: 560px){ .g{ grid-template-columns: minmax(0,1fr); } }
.top{ display:flex; flex-wrap:wrap; align-items:center; gap:var(--s1); min-width:0; }
.top .nm{ flex:1 1 120px; }   /* wąsko: bateria i stan schodzą pod nazwę zamiast ją ściskać */
.av{ width:34u; height:34u; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; background:#fff; color:#2A2D31; box-shadow:var(--hg-sh-sm); }
.av ha-icon{ width:19u; height:19u; }
.work .av{ background:var(--hg-accent); } .work .av ha-icon{ animation: var(--hg-loop, hgrb 2.4s ease-in-out infinite); }
.ret .av ha-icon{ animation: var(--hg-loop, hgrb-ret 1.6s ease-in-out infinite); }
.err .av{ background:#FF6B5B; color:#fff; }
@keyframes hgrb{ 0%{ transform:translateX(-2px) rotate(-12deg); } 50%{ transform:translateX(2px) rotate(12deg); } 100%{ transform:translateX(-2px) rotate(-12deg); } }
@keyframes hgrb-ret{ 0%,100%{ transform:translateX(0); } 50%{ transform:translateX(-3px); } }
.nm{ min-width:0; flex:1; } .nm b{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; font-size:var(--fs-md); font-weight:600; line-height:1.15; overflow:hidden; overflow-wrap:anywhere; }
.nm span{ display:block; font-size:var(--fs-xs); color:#5A5E64; margin-top:1u; }
.pill{ display:inline-flex; align-items:center; gap:4u; height:20u; padding:0 var(--s1); border-radius:var(--r-sm); font-size:var(--fs-xs); font-weight:400; background:rgba(0,0,0,.06); color:#2A2D31; flex:none; white-space:nowrap; }
.pill i{ width:6u; height:6u; border-radius:50%; background:#9AA0A6; }
.work .pill i{ background:var(--hg-accent); animation:var(--hg-loop, hgpulse 1.6s infinite); } .chg .pill i{ background:var(--hg-accent); } .err .pill{ background:#FFE3DF; color:#B3261E; } .err .pill i{ background:#FF3B30; }
.bat{ display:inline-flex; align-items:center; gap:3u; font-size:var(--fs-sm); font-weight:600; flex:none; } .bat ha-icon{ width:13u; height:13u; color:var(--hg-accent-tx); } .bat.low ha-icon{ color:#FF3B30; }
.map{ position:relative; border-radius:var(--r-sm); overflow:hidden; background:#2B3038; aspect-ratio: var(--a, 1.25); max-height:46vh; margin:0 auto; width:100%; }
.map img{ position:absolute; inset:0; width:100%; height:100%; object-fit:contain; opacity:0; transition:opacity .3s; }
.map img.ok{ opacity:1; }
.map .ph{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.6); font-size:var(--fs-sm); }
.map .rm{ position:absolute; left:8u; bottom:8u; padding:3u var(--s1); border-radius:var(--r-sm); background:rgba(0,0,0,.45); color:#fff; font-size:var(--fs-xs); }
.side{ display:flex; flex-direction:column; gap:var(--s1); min-width:0; }
.ctl{ display:flex; gap:var(--s1); flex-wrap:wrap; }
.cb{ position:relative; flex:1 1 0; min-width:max(calc(var(--k) * 54), 56px); height:max(calc(var(--k) * 40), 48px); border-radius:var(--r-sm); background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2u;
  font-size:var(--fs-xs); color:#2A2D31; box-shadow:var(--hg-sh-sm); transition: transform .15s, background .2s; }
.cb ha-icon{ width:20px; height:20px; } .cb:active{ transform:scale(.96); }
.cb.pri{ background:#1F2125; color:#fff; } .cb[disabled]{ opacity:.35; }
.sec{ font-size:var(--fs-xs); color:#6A6E74; margin-bottom:4u; text-transform:none; }
.seg{ display:flex; gap:2u; padding:2u; border-radius:var(--r-sm); background:rgba(118,118,128,.12); }
.seg button{ flex:1 1 0; min-width:0; height:max(calc(var(--k) * 26), 40px); border-radius:calc(var(--r-sm) - 2u); font-size:var(--fs-xs); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding:0 4u; color:#3A3D42; }
.seg button.on{ background:#fff; color:#16181B; font-weight:600; box-shadow:var(--hg-sh-sm); }
.rooms{ display:flex; flex-wrap:wrap; gap:5u; }
.rc{ display:inline-flex; align-items:center; gap:4u; height:max(calc(var(--k) * 26), 40px); padding:0 var(--s2); border-radius:var(--r-sm); background:#fff; font-size:var(--fs-xs); color:#2A2D31; border:1px solid rgba(0,0,0,.06); }
.rc ha-icon{ width:12u; height:12u; } .rc.on{ background:var(--hg-accent); border-color:var(--hg-accent); font-weight:600; }
.rc.go{ background:#1F2125; color:#fff; border-color:#1F2125; } .rc.go[disabled]{ opacity:.35; }
.cons, .list.two .cons{ display:grid; grid-template-columns: repeat(auto-fit, minmax(min(132px, 100%), 1fr)); gap:var(--s1); }
.cs{ display:flex; flex-direction:column; gap:3px; padding:var(--s1) 10px; border-radius:var(--r-sm); background:rgba(255,255,255,.7); min-width:0; font-variant-numeric:tabular-nums; }
.cs .cl{ font-size:var(--fs-xs); color:#4A4E54; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cs .cv{ display:flex; align-items:baseline; justify-content:space-between; gap:6px; min-width:0; } .cs .cv b{ color:#16181B; font-size:var(--fs-md); font-weight:600; white-space:nowrap; }
.cs .cv em{ font-style:normal; font-size:var(--fs-xs); color:#4A4E54; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cs .hint{ font-size:var(--fs-xs); font-weight:600; color:var(--hg-warn, #B3261E); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cs .tr{ height:4u; border-radius:2u; background:rgba(0,0,0,.08); margin-top:4u; overflow:hidden; } .cs .tr i{ display:block; height:100%; border-radius:2u; background:var(--hg-accent); }
.cs.warn .tr i{ background:var(--hg-accent); } .cs.bad .tr i{ background:#FF3B30; }
.kv, .list.two .kv{ display:grid; grid-template-columns: repeat(auto-fit, minmax(min(132px, 100%), 1fr)); gap:var(--s1); }
.kv div{ padding:var(--s1) 10px; border-radius:var(--r-sm); background:rgba(255,255,255,.7); min-width:0; overflow:hidden; font-variant-numeric:tabular-nums; }
.kv small{ display:block; font-size:var(--fs-xs); color:#5A5E64; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.kv p{ margin:0; display:flex; align-items:baseline; min-width:0; white-space:nowrap; overflow:hidden; }
.kv b{ font-size:var(--fs-md); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; } .kv em{ flex:none; font-style:normal; font-size:var(--fs-xs); color:#5A5E64; margin-left:2u; }
.empty{ padding:var(--s4); text-align:center; color:#5A5E64; font-size:var(--fs-sm); }
@media (prefers-reduced-motion: reduce){ .av ha-icon{ animation:none !important; } }`);
  }
  _opt(v) { const k = String(v).toLowerCase(); return HG_OPT_KEYS.includes(k) ? hgTD('cards.robots.options.' + k.replace(/ /g, '_'), v) : v; }
  render() {
    const h = this._hass, c = this._config, d = this._disc();
    const hd = `<div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span><span class="sp"></span><span class="note">${d.robots.length} ${hgT('cards.robots.robots_label', { count: d.robots.length })}</span></div>`;
    if (!d.robots.length) return `<ha-card class="glass">${hd}<div class="empty">${hgT('cards.robots.no_vacuum_or_lawn')}</div></ha-card>`;
    this._sel = this._sel || new Map();
    return `<ha-card class="glass">${hd}<div class="list ${d.robots.length > 1 ? 'two' : ''}">${d.robots.map((r) => this._robot(r)).join('')}</div></ha-card>`;
  }
  _robot(r) {
    const h = this._hass, c = this._config, s = h.states[r.e], a = s.attributes, mower = r.e.startsWith('lawn_mower.'), ic = mower ? 'mdi:robot-mower' : 'mdi:robot-vacuum';
    const nm = c.names[r.e] || (a.friendly_name || r.e).replace(/^(.+?)\s+\1$/, '$1').replace(/\s{2,}/g, ' ');
    if (!H.ok(s)) return `<div class="rb idle"><div class="top"><span class="av">${H.icon(ic)}</span><span class="nm"><b>${H.esc(nm)}</b><span>${hgT('common.unavailable_masc')}</span></span></div></div>`;
    const [lbl, cls] = hgRobotState(s), f = a.supported_features || 0, working = cls === 'work';
    const batV = a.battery ?? a.battery_level ?? H.num(h, r.bat);
    const bat = batV != null ? `<span class="bat ${batV < 20 ? 'low' : ''}">${H.icon(a.charging ? 'mdi:battery-charging' : batV > 90 ? 'mdi:battery' : `mdi:battery-${Math.max(10, Math.round(batV / 10) * 10)}`)}${H.pct(Math.round(batV))}</span>` : '';
    const err = cls === 'err' && a.error && a.error !== 'No error' ? ` · ${a.error}` : '';
    const room = r.room && H.ok(h.states[r.room]) && working ? h.states[r.room].state : '';
    const sub = room ? H.lv(hgT('common.room'), room) : (r.hist && H.ok(h.states[r.hist]) ? `${hgT('cards.robots.last')} ${hgAgo(h.states[r.hist].state)}` : (mower ? hgT('cards.robots.mower') : hgT('cards.robots.vacuum')));
    const top = `<div class="top"><span class="av">${H.icon(ic)}</span><span class="nm"><b>${H.esc(nm)}</b><span>${H.esc(sub)}</span></span>
      ${bat}<span class="pill" title="${H.esc(lbl + err)}"><i></i>${H.esc(lbl)}</span><button class="ib" data-act="more" data-e="${r.e}" aria-label="${hgT('common.more')}" title="${hgT('common.more')}">${H.icon('mdi:dots-vertical')}</button></div>`;
    // przyciski: tylko obsługiwane funkcje
    const B = (act, icon, label, on, pri) => `<button class="cb ${pri ? 'pri' : ''}" data-act="${act}" data-e="${r.e}" aria-label="${label}">${H.icon(icon)}<span>${label}</span></button>`;
    let ctl = '';
    if (mower) {
      if (working && (f & HG_MF.PAUSE)) ctl += B('pause', 'mdi:pause', hgT('common.pause'), 0, 1); else if (f & HG_MF.START) ctl += B('start', 'mdi:play', hgT('cards.robots.start'), 0, 1);
      if (f & HG_MF.DOCK) ctl += B('home', 'mdi:home-import-outline', hgT('cards.robots.dock'));
    } else {
      if (working && (f & HG_VF.PAUSE)) ctl += B('pause', 'mdi:pause', hgT('common.pause'), 0, 1);
      else if (f & HG_VF.START) ctl += B('start', 'mdi:play', cls === 'pause' ? hgT('common.resume') : hgT('cards.robots.start'), 0, 1);
      if ((f & HG_VF.STOP) && (working || cls === 'pause' || cls === 'ret')) ctl += B('stop', 'mdi:stop', hgT('cards.robots.stop'));
      if (f & HG_VF.HOME) ctl += B('home', 'mdi:home-import-outline', hgT('cards.robots.dock'));
      if (f & HG_VF.LOCATE) ctl += B('locate', 'mdi:map-marker-radius-outline', hgT('cards.robots.locate'));
    }
    // moc ssania / tryb: select z urządzenia, a bez niego fan_speed_list
    let opts = '';
    const seg = (title, cur, list, act, e) => `<div><div class="sec">${title}</div><div class="seg" role="radiogroup" aria-label="${title}">${list.map((o) =>
      `<button class="${o === cur ? 'on' : ''}" role="radio" aria-checked="${o === cur}" data-act="${act}" data-e="${e}" data-o="${H.esc(o)}" title="${H.esc(this._opt(o))}">${H.esc(this._opt(o))}</button>`).join('')}</div></div>`;
    const sels = r.sels.filter((x) => H.ok(h.states[x]) && (h.states[x].attributes.options || []).length);
    for (const x of sels) { const ss = h.states[x], sl = HG_SEL_LBL.find(([re]) => re.test(x)) || [0, hgTLazy('cards.robots.settings.setting')]; opts += seg(String(sl[1]), ss.state, ss.attributes.options, 'sel', x); }
    if (!sels.some((x) => /suction|_mode_p_|fan/.test(x)) && (f & HG_VF.FAN) && (a.fan_speed_list || []).length) opts = seg(hgT('cards.robots.settings.suction'), a.fan_speed, a.fan_speed_list, 'fan', r.e) + opts;
    // pokoje (Dreame: rooms[selected_map] + dreame_vacuum.vacuum_clean_segment)
    let rooms = '';
    const rl = a.rooms && (a.rooms[a.selected_map] || Object.values(a.rooms)[0]);
    if (Array.isArray(rl) && rl.length && h.services && h.services.dreame_vacuum && h.services.dreame_vacuum.vacuum_clean_segment) {
      const sel = this._sel.get(r.e) || new Set();
      rooms = `<div><div class="sec">${hgT('cards.robots.room_cleaning')}</div><div class="rooms">${rl.map((x) => `<button class="rc ${sel.has(x.id) ? 'on' : ''}" data-act="room" data-e="${r.e}" data-id="${x.id}" aria-pressed="${sel.has(x.id)}">${H.icon(x.icon || 'mdi:floor-plan')}${H.esc(x.name)}</button>`).join('')}
        <button class="rc go" data-act="seg" data-e="${r.e}" ${sel.size && !working ? '' : 'disabled'} aria-label="${hgT('cards.robots.clean_selected_rooms')}">${H.icon('mdi:play')}${hgT('cards.robots.clean')}${sel.size ? ` (${sel.size})` : ''}</button></div></div>`;
    }
    // eksploatacja
    const cons = r.cons.filter((x) => H.ok(h.states[x.e]) && H.num(h, x.e) != null).map((x) => {   // wartość nieliczbowa -> pomiń
      // jednostka z encji: % -> pasek zużycia; h/min/d itp. -> sama wartość z jej jednostką (bez zgadywania procentów)
      const v = H.num(h, x.e), t = x.t && H.ok(h.states[x.t]) ? H.num(h, x.t) : null, u = hgUnit(h, x.e), pc = u === '%';
      const lb = String(x.nm), full = x.full ? String(x.full) : lb, dirty = x.id === 'sensors' && v <= 0;
      const main = pc ? H.pct(Math.round(v)) : hgUV(v, u), tt = t != null ? hgUV(t, hgUnit(h, x.t) || 'h') : '';
      const lvl = pc ? (v < 10 ? 'bad' : v <= 30 ? 'warn' : '') : (v <= 0 ? 'bad' : '');
      return `<div class="cs ${lvl}" title="${H.esc(H.lv(full, `${main}${tt ? ', ' + hgT('cards.robots.time_left', { time: tt }) : ''}`))}"><span class="cl">${H.esc(lb)}</span>
        <div class="cv"><b>${H.esc(main)}</b>${tt ? `<em>${H.esc(tt)}</em>` : ''}</div>${pc ? `<div class="tr"><i style="width:${Math.max(2, Math.min(100, v))}%"></i></div>` : ''}${dirty ? `<span class="hint">${hgT('cards.robots.needs_cleaning')}</span>` : ''}</div>`;
    }).join('');
    // ostatnie sprzątanie
    const kv = [];
    // wartość z encji (z jej jednostką) albo z atrybutu odkurzacza (domyślna jednostka)
    const val = (e, attr, du) => (e && H.ok(h.states[e]) && H.num(h, e) != null ? [H.num(h, e), hgUnit(h, e) || du] : (a[attr] != null && isFinite(a[attr]) ? [Number(a[attr]), du] : null));
    const tm = val(r.time, 'cleaning_time', 'min'), ar = val(r.area, 'cleaned_area', 'm²'), cnt = val(r.count, 'cleaning_count', ''), tot = val(r.total, 'total_cleaned_area', 'm²');
    if (tm) kv.push([hgT('cards.robots.time'), H.fmt(tm[0], Math.abs(tm[0]) >= 10 ? 0 : 1), tm[1]]); if (ar) kv.push([hgT('cards.robots.area'), H.fmt(ar[0], Math.abs(ar[0]) >= 10 ? 0 : 1), ar[1]]);
    if (r.hist && H.ok(h.states[r.hist])) { const dt = new Date(h.states[r.hist].state); if (isFinite(dt)) {
      const d0 = new Date(); d0.setHours(0, 0, 0, 0); const dd = new Date(dt); dd.setHours(0, 0, 0, 0); const n = Math.round((d0 - dd) / 86400000);
      const hm = dt.toLocaleTimeString(HG_LOC(), { hour: '2-digit', minute: '2-digit' });
      kv.push([hgT('cards.robots.when'), n === 0 ? hgT('cards.robots.today_at', { time: hm }) : n === 1 ? hgT('cards.robots.yesterday_at', { time: hm }) : `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}, ${hm}`, '']); } }
    if (cnt) kv.push([hgT('cards.robots.cleanings'), H.fmt(cnt[0], 0), '']); if (tot) kv.push([hgT('cards.robots.total'), H.fmt(tot[0], Math.abs(tot[0]) >= 10 ? 0 : 1), tot[1]]);
    const last = kv.length ? `<div><div class="sec">${hgT('cards.robots.last_cleaning')}</div><div class="kv">${kv.map(([k, v, u]) => `<div title="${H.esc(H.lv(k, `${v}${u ? ' ' + u : ''}`))}"><small>${k}</small><p><b>${H.esc(v)}</b>${u ? `<em>${H.esc(u)}</em>` : ''}</p></div>`).join('')}</div></div>` : '';
    const cam = r.cam && h.states[r.cam];
    const map = cam ? `<div class="map" data-cam="${r.cam}" style="--a:${this._asp && this._asp[r.cam] || 1.25}"><div class="ph">${H.ok(cam) ? hgT('cards.robots.loading_map') : hgT('cards.robots.map_unavailable')}</div><img alt="${hgT('common.map')} ${H.esc(nm)}" ${this._src && this._src[r.cam] ? `src="${this._src[r.cam]}" class="ok"` : ''}>${room ? `<span class="rm">${H.esc(room)}</span>` : ''}</div>` : '';
    const ill = map ? '' : `<div class="media ill" aria-hidden="true"><span class="ring" style="--p:${batV != null ? Math.round(batV) : 0}"><span class="in">${H.icon(ic)}</span></span><b>${H.esc(lbl)}</b><small>${batV != null ? `${hgT('common.battery')} ${H.pct(Math.round(batV))}` : H.esc(sub)}</small>${cls === 'chg' || cls === 'dock' ? H.icon('mdi:home-lightning-bolt-outline', 'dock') : ''}</div>`;
    return `<div class="rb ${cls}">${top}<div class="g ${map ? '' : 'nomap'}" style="margin-top:10px">${map ? `<div class="media">${map}</div>` : ill}<div class="side">
      ${ctl ? `<div class="ctl">${ctl}</div>` : ''}${opts}${rooms}${cons ? `<div><div class="sec">${hgT('cards.robots.maintenance')}</div><div class="cons">${cons}</div></div>` : ''}${last}</div></div></div>`;
  }
  afterRender() {
    if (this._io) this._io.disconnect();   // jeden obserwator na kartę: tylko przepięcie na nowe elementy mapy
    else this._io = new IntersectionObserver((en) => { for (const e of en) e.target.__vis = e.isIntersecting; this._snap(); });
    this._maps = [...this.$.querySelectorAll('.map[data-cam]')];
    this._maps.forEach((m) => this._io.observe(m));
    this._sched();
  }
  _sched() {
    clearTimeout(this._mt);
    if (!this.isConnected) return;
    this._mt = setTimeout(() => { this._snap(); this._sched(); }, this._ms());
  }
  _ms() { const work = this._d && this._d.robots.some((r) => ['cleaning', 'mowing', 'returning'].includes((this._hass.states[r.e] || {}).state)); return (work ? this._config.refresh_work : this._config.refresh_idle) * 1000; }
  _snap() {
    if (document.hidden || !this.isConnected) return;
    this._src = this._src || {}; this._asp = this._asp || {}; this._ld = this._ld || {}; this._lt = this._lt || {};
    const ms = this._ms();
    for (const m of this._maps || []) {
      const e = m.dataset.cam, s = this._hass.states[e];
      if (m.__vis === false || !H.ok(s) || !s.attributes.entity_picture || this._ld[e]) continue;
      if (this._src[e] && Date.now() - (this._lt[e] || 0) < ms - 300) continue;   // przerysowanie karty nie pobiera mapy częściej niż co refresh_*
      this._lt[e] = Date.now();
      const u = s.attributes.entity_picture, src = u + (u.includes('?') ? '&' : '?') + '_t=' + Date.now(), pre = new Image();
      this._ld[e] = true;
      pre.onload = () => {
        this._ld[e] = false; this._src[e] = src;
        if (pre.naturalWidth) this._asp[e] = +(pre.naturalWidth / pre.naturalHeight).toFixed(3);
        for (const mm of this.$.querySelectorAll(`.map[data-cam="${e}"]`)) { const img = mm.querySelector('img'); img.src = src; img.classList.add('ok'); mm.style.setProperty('--a', this._asp[e]); const ph = mm.querySelector('.ph'); if (ph) ph.remove(); }
      };
      pre.onerror = () => { this._ld[e] = false; };
      pre.src = src;
    }
  }
  connectedCallback() { super.connectedCallback(); if (this._maps) { this._maps.forEach((m) => this._io && this._io.observe(m)); this._snap(); this._sched(); } }
  disconnectedCallback() { clearTimeout(this._mt); this._io && this._io.disconnect(); }
  onAct(act, el) {
    const h = this._hass, e = el.dataset.e, mower = e && e.startsWith('lawn_mower.');
    if (act === 'more') return H.fire(this, 'hass-more-info', { entityId: e });
    if (act === 'start') return mower ? H.call(h, 'lawn_mower', 'start_mowing', { entity_id: e }) : H.call(h, 'vacuum', 'start', { entity_id: e });
    if (act === 'pause') return H.call(h, mower ? 'lawn_mower' : 'vacuum', 'pause', { entity_id: e });
    if (act === 'stop') return H.call(h, 'vacuum', 'stop', { entity_id: e });
    if (act === 'home') return mower ? H.call(h, 'lawn_mower', 'dock', { entity_id: e }) : H.call(h, 'vacuum', 'return_to_base', { entity_id: e });
    if (act === 'locate') return H.call(h, 'vacuum', 'locate', { entity_id: e });
    if (act === 'fan') return H.call(h, 'vacuum', 'set_fan_speed', { entity_id: e, fan_speed: el.dataset.o });
    if (act === 'sel') return H.call(h, 'select', 'select_option', { entity_id: e, option: el.dataset.o });
    if (act === 'room') {
      const s = this._sel.get(e) || new Set(), id = Number(el.dataset.id);
      s.has(id) ? s.delete(id) : s.add(id); this._sel.set(e, s); return this._update(true);
    }
    if (act === 'seg') {
      const s = this._sel.get(e); if (!s || !s.size) return;
      const p = H.call(h, 'dreame_vacuum', 'vacuum_clean_segment', { entity_id: e, segments: [...s] });
      this._sel.set(e, new Set()); this._update(true); return p;
    }
  }
  getCardSize() { return 8; }
}
hgReg('hg-robots-card', HGRobotsCard, hgTLazy('cards.robots.picker_name'), hgTLazy('cards.robots.picker_description'));
