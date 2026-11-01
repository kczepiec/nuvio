/* ===================== PRZEPŁYW ENERGII: sieć, panele, bateria i dom na jednym schemacie, kropki płyną po liniach ===================== */
/* Moc w W (kW i MW przeliczane). Sieć: + pobór, − oddawanie (albo osobny czujnik oddawania). Bateria: + rozładowanie, − ładowanie.
   Dom: czujnik zużycia albo bilans (panele + sieć + baterie). Odwrócony znak: invert_grid / invert_battery.
   grid, grid_export, solar i home przyjmują jedną encję albo listę (sumowane: fazy, kilka falowników). Baterie są osobne:
   battery / battery_soc jako listy (ta sama kolejność) albo batteries: [{ power, soc, name }]; dwie i więcej łączy szyna pod schematem. */
const hgArr = (x) => (Array.isArray(x) ? x : x ? [x] : []).map((e) => (typeof e === 'string' ? e : e && (e.entity || e.power))).filter(Boolean);
const HG_FLOW_RX = { grid: /grid|sie[cć]|net\b|meter|licznik|import|pob[oó]r|bilans/i, solar: /\bpv\b|pv_|solar|fotowolt|panel|inverter|falownik|produk/i, battery: /batter|akumul|magazyn|storage/i, home: /home|house|dom\b|zu[zż]yc|consum|load/i };
/* zgadywanie encji (gdy panel Energia HA ich nie podaje, patrz hgFlowDef): czujniki mocy po nazwie. Baterie wg urządzenia: tyle, ile urządzenie
   ma czujników poziomu, i tylko urządzenia z poziomem (gniazdko „bateria” nie jest baterią). Moc i poziomy z urządzeń z device_tracker
   (telefon, tablet, zegarek, samochód) są pomijane. Wynik w kształcie formularza galerii (battery / battery_soc). */
const hgFlowGuess = (h) => { const st = (h && h.states) || {}, R = h.entities || {}, D = h.devices || {}, dev = (e) => (R[e] && R[e].device_id) || null;
  const moving = new Set(Object.keys(st).filter((e) => e.startsWith('device_tracker.')).map(dev).filter(Boolean));   /* telefon, tablet, zegarek, samochód */
  const pw = Object.keys(st).filter((e) => e.startsWith('sensor.') && st[e].attributes.device_class === 'power' && isFinite(parseFloat(st[e].state)) && !(R[e] && (R[e].hidden || R[e].entity_category)) && !moving.has(dev(e)));
  const nm = (e) => e + ' ' + (st[e].attributes.friendly_name || ''), pick = (k, not) => pw.find((e) => HG_FLOW_RX[k].test(nm(e)) && !(not || []).some((r) => HG_FLOW_RX[r].test(nm(e))));
  const solar = pick('solar', ['battery']), bpw = pw.filter((e) => e !== solar && HG_FLOW_RX.battery.test(nm(e))), grid = pw.find((e) => e !== solar && !bpw.includes(e) && HG_FLOW_RX.grid.test(nm(e)) && !HG_FLOW_RX.battery.test(nm(e)));
  const socs = Object.keys(st).filter((e) => e.startsWith('sensor.') && st[e].attributes.device_class === 'battery' && !moving.has(dev(e)));
  const G = new Map(); for (const e of bpw) { const k = dev(e) || e; if (!G.has(k)) G.set(k, []); G.get(k).push(e); }
  const withSoc = [...G].filter(([k]) => socs.some((x) => dev(x) === k)), groups = withSoc.length ? withSoc : [...G];
  const lbl = (e) => { const n = String(st[e].attributes.friendly_name || e), d = D[dev(e)], dn = d && (d.name_by_user || d.name); return dn && n.toLowerCase().startsWith(dn.toLowerCase()) ? n.slice(dn.length).trim() : n; };
  /* tyle baterii na urządzenie, ile ma ono czujników poziomu (falownik z „Battery 1 / Battery 2”); moc do poziomu: najdłuższy wspólny początek etykiet,
     przy remisie najkrótsza etykieta; bez poziomu na urządzeniu: jedna bateria, najkrótsza etykieta */
  const cp = (a, b) => { a = a.toLowerCase(); b = b.toLowerCase(); let n = 0; while (n < a.length && a[n] === b[n]) n++; return n; }, short = (a, b) => lbl(a).length - lbl(b).length, pairs = [];
  for (const [k, es] of groups) { const dS = socs.filter((x) => dev(x) && dev(x) === k), free = es.slice();
    if (dS.length <= 1) { pairs.push([free.sort(short)[0], dS[0] || null]); continue; }
    for (const x of dS) { if (!free.length) break; const m = free.slice().sort((a, b) => cp(lbl(b), lbl(x)) - cp(lbl(a), lbl(x)) || short(a, b))[0]; free.splice(free.indexOf(m), 1); pairs.push([m, x]); } }
  /* poziom z innego urządzenia (moc na falowniku, poziom na BMS): tylko z urządzenia, które też mierzy moc (nie bateria czujnika Zigbee) */
  const P4 = pairs.slice(0, 4), used = new Set(P4.map((q) => q[1]).filter(Boolean)), pwDev = new Set(pw.map(dev).filter(Boolean)), other = socs.filter((x) => pwDev.has(dev(x)));
  const SL = P4.map((q) => { if (q[1]) return q[1]; const m = other.find((x) => !used.has(x)); if (m) used.add(m); return m || null; });
  const battery = P4.map((q) => q[0]), battery_soc = SL.filter(Boolean), socOf = Object.fromEntries(P4.map((q, i) => [q[0], SL[i]]).filter(([, x]) => x));
  return { grid: grid || null, solar: solar || null, battery, battery_soc, socOf }; };
/* formularz (galeria i karta widoku Energia) -> konfiguracja karty: baterie jako osobne obiekty, poziom z tego samego urządzenia co moc, inaczej wg kolejności */
const hgFlowCfg = (v, h) => { const L = (x) => hgArr(x), o = Object.fromEntries(['grid', 'solar', 'grid_export', 'home'].filter((k) => L(v[k]).length).map((k) => { const a = L(v[k]); return [k, a.length > 1 ? a : a[0]]; }));
  const P = L(v.battery), S = L(v.battery_soc), R = (h && h.entities) || {}, used = new Set();
  const NM = v.names || {};   /* nazwy baterii z konfiguracji karty (YAML), wg czujnika mocy, inaczej poziomu */
  const SO = v.socOf || {};   /* dokładne pary moc -> poziom (panel Energia HA, zgadywanie), przed dopasowaniem wg urządzenia i kolejności */
  const bs = P.map((p) => { const x = SO[p], d = R[p] && R[p].device_id, m = (x && S.includes(x) && !used.has(x) && x) || (d && S.find((e) => !used.has(e) && R[e] && R[e].device_id === d)); if (m) used.add(m); return { power: p, soc: m || null }; });
  for (const b of bs) if (!b.soc) { const m = S.find((e) => !used.has(e)); if (m) { used.add(m); b.soc = m; } }
  for (const e of S) if (!used.has(e)) bs.push({ power: null, soc: e });
  for (const b of bs) b.name = NM[b.power] || NM[b.soc] || null;
  if (bs.length) o.batteries = bs.slice(0, 4).map((b) => Object.fromEntries(Object.entries(b).filter(([, x]) => x)));
  for (const k of ['invert_grid', 'invert_battery']) if (v.o && v.o[k]) o[k] = true;   /* znak z panelu Energia HA (w galerii opcje nadpisuje formularz) */
  return o; };
/* konfiguracja karty -> wartości formularza (edycja karty z widoku: ten sam formularz co w galerii, wypełniony tym, co karta pokazuje) */
const hgFlowFrom = (c) => { const B = Array.isArray(c.batteries) && c.batteries.length ? c.batteries.map((b) => (typeof b === 'string' ? { power: b } : { power: b.power || b.entity, soc: b.soc, name: b.name })) : null;
  const names = Object.fromEntries((B || []).filter((b) => b.name && (b.power || b.soc)).map((b) => [b.power || b.soc, b.name]));
  const socOf = Object.fromEntries((B || []).filter((b) => b.power && b.soc).map((b) => [b.power, b.soc]));
  const o = {}; for (const k of ['invert_grid', 'invert_battery']) if (c[k]) o[k] = true;
  return { grid: hgArr(c.grid), solar: hgArr(c.solar), grid_export: hgArr(c.grid_export), home: hgArr(c.home),
    battery: B ? B.map((b) => b.power).filter(Boolean) : hgArr(c.battery), battery_soc: B ? B.map((b) => b.soc).filter(Boolean) : hgArr(c.battery_soc), names, socOf, o }; };
/* moc z panelu Energia HA (energy/get_prefs, nowsze HA): stat_rate = encja mocy ze znakiem jak w karcie (sieć + pobór, bateria + rozładowanie),
   tworzona przez HA także dla power_config; gdy jej nie ma: power_config (odwrócony znak -> invert_*, sieć z dwóch czujników -> grid + grid_export).
   Bateria z dwóch osobnych czujników bez stat_rate: pomijana (karta ma jeden czujnik ze znakiem). null = brak danych o mocy. */
const hgFlowPrefs = (h, src) => { if (!Array.isArray(src)) return null; const st = (h && h.states) || {}, ok = (e) => !!(e && st[e]);
  const rate = (s) => { const pc = s.power_config || {}; if (ok(s.stat_rate)) return { e: s.stat_rate }; if (ok(pc.stat_rate)) return { e: pc.stat_rate }; if (ok(pc.stat_rate_inverted)) return { e: pc.stat_rate_inverted, inv: true };
    if (ok(pc.stat_rate_from)) return { e: pc.stat_rate_from, to: ok(pc.stat_rate_to) ? pc.stat_rate_to : null }; return null; };
  const v = { grid: [], grid_export: [], solar: [], battery: [], battery_soc: [], names: {}, o: {} }, G = [], B = [];
  for (const s of src) { const r = rate(s); if (!r) continue;
    if (s.type === 'grid') G.push(r);
    else if (s.type === 'solar' && !r.inv && r.to === undefined) v.solar.push(r.e);
    else if (s.type === 'battery' && r.to === undefined) B.push(Object.assign({ soc: ok(s.stat_soc) ? s.stat_soc : null, name: s.name || null }, r)); }
  /* jeden przełącznik znaku na typ: przy mieszance zostają źródła bez odwrócenia */
  const one = (L) => (L.every((r) => r.inv) ? L : L.filter((r) => !r.inv));
  const g = one(G), b = one(B); if (g.length && g.every((r) => r.inv)) v.o.invert_grid = true; if (b.length && b.every((r) => r.inv)) v.o.invert_battery = true;
  for (const r of g) { v.grid.push(r.e); if (r.to) v.grid_export.push(r.to); }
  v.socOf = {}; for (const r of b.slice(0, 4)) { v.battery.push(r.e); if (r.soc) { v.battery_soc.push(r.soc); v.socOf[r.e] = r.soc; } if (r.name) v.names[r.e] = r.name; }
  return v.grid.length || v.solar.length || v.battery.length ? v : null; };
/* wartości startowe formularza (galeria i widok Energia: to samo zachowanie bazowe): najpierw panel Energia HA, brakujące pola ze zgadywania */
const hgFlowDef = (h, src) => { const g = hgFlowGuess(h), p = hgFlowPrefs(h, src) || {}, has = (x) => Array.isArray(x) && x.length;
  return { grid: has(p.grid) ? p.grid : g.grid ? [g.grid] : null, solar: has(p.solar) ? p.solar : g.solar ? [g.solar] : null, grid_export: has(p.grid_export) ? p.grid_export : null,
    battery: has(p.battery) ? p.battery : g.battery, battery_soc: has(p.battery) ? p.battery_soc : g.battery_soc, socOf: has(p.battery) ? p.socOf : g.socOf, names: p.names || null, o: p.o && Object.keys(p.o).length ? p.o : null }; };
class HGFlowCard extends HGBase {
  static getStubConfig(h) { return hgFlowCfg(hgFlowDef(h, typeof HGEnergyPrefs !== 'undefined' && HGEnergyPrefs._v && HGEnergyPrefs._v.src), h); }
  defaults() { return { title: null, icon: 'mdi:transmission-tower-export', grid: null, grid_export: null, solar: null, battery: null, battery_soc: null, batteries: null, home: null, invert_grid: false, invert_battery: false }; }
  /* baterie: [{ power, soc, name }] z batteries albo z list battery / battery_soc (najwyżej 4) */
  bats() { const c = this._config; if (Array.isArray(c.batteries) && c.batteries.length) return c.batteries.slice(0, 4).map((b) => (typeof b === 'string' ? { power: b } : { power: b.power || b.entity || null, soc: b.soc || null, name: b.name || null }));
    const P = hgArr(c.battery), S = hgArr(c.battery_soc); return Array.from({ length: Math.min(4, Math.max(P.length, S.length)) }, (_, i) => ({ power: P[i] || null, soc: S[i] || null })); }
  ents() { const c = this._config; return [...hgArr(c.grid), ...hgArr(c.grid_export), ...hgArr(c.solar), ...hgArr(c.home), ...this.bats().flatMap((b) => [b.power, b.soc])].filter(Boolean); }
  css() { return HG_NV_CSS + U(`
ha-card.glass{ --fl-sun:#F5B53D; --fl-grid:#5AA2FF; --fl-bat:#A78BFA; --fl-home:var(--hg-accent); container-type:inline-size; }
.fs{ position:relative; width:100%; max-width:min(440u, var(--fl-max, 100%)); margin:0 auto; aspect-ratio:var(--ar); flex:none; container-type:inline-size; }
.fs svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.tr{ fill:none; stroke:currentColor; stroke-opacity:.13; stroke-width:.7; stroke-linecap:round; transition:stroke var(--hg-t-slow) var(--hg-ease-out), stroke-opacity var(--hg-t-slow) var(--hg-ease-out); }
.tr.on{ stroke:var(--c); stroke-opacity:.32; }
.fl{ fill:none; stroke:var(--c); stroke-width:2.3; stroke-linecap:round; stroke-dasharray:0 6.5; opacity:0;
  transition:opacity var(--hg-t-slow) var(--hg-ease-out); animation:var(--hg-loop, flRun var(--d, 1s) linear infinite); animation-play-state:paused; }
.fl.on{ opacity:1; animation-play-state:running; } .fl.rv{ animation-direction:reverse; }
:host([hg-off]) .fl{ animation-play-state:paused !important; }   /* poza ekranem stoi */
@keyframes flRun{ to{ stroke-dashoffset:-6.5; } }
.nd{ all:unset; box-sizing:border-box; position:absolute; width:20%; aspect-ratio:1; transform:translate(-50%,-50%); border-radius:50%; cursor:pointer;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; text-align:center;
  background:color-mix(in srgb, var(--hg-inner-bg) 70%, var(--hg-panel-flat, rgba(30,34,40,.6))); box-shadow:var(--hg-inner-hi);   /* bez backdrop-filter: rozmycie w rozmyciu przeliczane co klatkę animacji */
  transition:box-shadow var(--hg-t-slow) var(--hg-ease-out), transform var(--hg-t-base) var(--hg-spring); }
.nd::before{ content:''; position:absolute; inset:0; border-radius:50%; pointer-events:none;
  background:conic-gradient(from -90deg, var(--ring, color-mix(in srgb, currentColor 14%, transparent) 0 100%));
  -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px)); mask:radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px)); }
.nd.on{ box-shadow:var(--hg-inner-hi), 0 0 22px color-mix(in srgb, var(--c) 38%, transparent); }
.nd:hover{ transform:translate(-50%,-50%) scale(1.04); } .nd:active{ transform:translate(-50%,-50%) scale(.96); }
.nd:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:3px; }
.nd ha-icon{ width:clamp(16px, 6.4cqw, 30px); height:clamp(16px, 6.4cqw, 30px); --mdc-icon-size:clamp(16px, 6.4cqw, 30px); color:var(--c); transition:color var(--hg-t-slow) var(--hg-ease-out); }
.nd b{ font-size:clamp(11px, 3.8cqw, 19px); font-weight:600; letter-spacing:-.01em; font-variant-numeric:tabular-nums; white-space:nowrap; line-height:1.1; }
.nd b em{ font-style:normal; font-weight:500; font-size:.72em; opacity:.62; margin-left:1px; }
.nd small{ font-size:clamp(9px, 2.5cqw, 12px); opacity:.62; white-space:nowrap; line-height:1.1; max-width:90%; overflow:hidden; text-overflow:ellipsis; }
.cap{ position:absolute; transform:translateX(-50%); max-width:24%; font-size:clamp(9px, 2.4cqw, 12px); font-weight:500; opacity:.7; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; pointer-events:none; text-align:center; }
.hub{ fill:currentColor; fill-opacity:.25; transition:fill var(--hg-t-slow) var(--hg-ease-out); } .hub.on{ fill:var(--fl-bat); fill-opacity:1; }
.nd.un{ opacity:.5; } .nd.off ha-icon{ color:inherit; opacity:.55; }
.lg{ display:flex; flex-wrap:wrap; justify-content:center; gap:var(--s1) var(--s2); font-size:var(--fs-xs); }
.lg span{ display:inline-flex; align-items:center; gap:5px; padding:3u 9u; border-radius:var(--hg-radius-pill, 999px); background:var(--hg-inner-bg); box-shadow:var(--hg-inner-hi); white-space:nowrap; }
.lg i{ width:7px; height:7px; border-radius:50%; background:var(--c); box-shadow:0 0 6px var(--c); } .lg b{ font-weight:600; font-variant-numeric:tabular-nums; }
@container (max-width: 300px){ .nd small, .cap{ display:none; } }
@container (max-width: 240px){ .nd{ width:23%; } .lg{ display:none; } }
@media (prefers-reduced-motion: reduce){ .fl{ animation:none; stroke-dasharray:none; stroke-width:1.1; filter:none; } .fl.on{ opacity:.85; } .nd, .nd:hover, .nd:active{ transition:none; transform:translate(-50%,-50%); } }
`); }
  /* moc encji w W ze znakiem; null = brak encji albo niedostępna */
  _w(e, inv) { if (!e) return null; const v = hgW(this._hass, e); return v == null ? null : inv ? -v : v; }
  /* suma listy encji w W; null, gdy żadna nie podaje wartości */
  _sum(x, inv) { let t = null; for (const e of hgArr(x)) { const v = this._w(e, inv); if (v != null) t = (t || 0) + v; } return t; }
  model() { const c = this._config, ex = this._sum(c.grid_export);
    let G = this._sum(c.grid, c.invert_grid); if (hgArr(c.grid_export).length && G != null) G = Math.max(0, G) - Math.max(0, ex || 0); else if (G == null && ex != null) G = -Math.max(0, ex);
    const S = Math.max(0, this._sum(c.solar) || 0), g = G || 0;
    /* każda bateria osobno: + rozładowanie, − ładowanie; sumy ładowania i rozładowania liczone brutto */
    const BT = this.bats().map((b) => { const w = this._w(b.power, c.invert_battery); return Object.assign({}, b, { w, soc: b.soc ? H.num(this._hass, b.soc) : null }); });
    const chg = BT.reduce((a, b) => a + Math.max(-(b.w || 0), 0), 0), dis = BT.reduce((a, b) => a + Math.max(b.w || 0, 0), 0), B = dis - chg;
    const hs = this._sum(c.home), Hm = hs != null ? Math.abs(hs) : Math.max(0, S + g + B);
    const exp = Math.max(-g, 0), imp = Math.max(g, 0);
    const sg = Math.min(exp, S), sb = Math.min(chg, S - sg), sh = Math.max(S - sg - sb, 0), gb = Math.min(Math.max(chg - sb, 0), imp), gh = Math.max(imp - gb, 0), bg = Math.min(Math.max(exp - sg, 0), dis), bh = Math.max(dis - bg, 0);
    return { G, S, B, BT, chg, dis, Hm, sg, sb, sh, gb, gh, bg, bh }; }
  /* 650 W albo 2,4 kW */
  fw(w) { if (w == null || !isFinite(w)) return ['–', '']; const a = Math.abs(w); return a < 1000 ? [H.fmt(a, 0), 'W'] : [H.fmt(a / 1000, a < 10000 ? 1 : 0), 'kW']; }
  render() { const c = this._config, h = this._hass, M0 = this.bats(), nb = M0.length, has = { g: hgArr(c.grid).length + hgArr(c.grid_export).length > 0, s: hgArr(c.solar).length > 0, b: nb > 0 };
    const T = c.title || hgT('cards.flow.energy_flow');
    if (!has.g && !has.s && !has.b) return `<ha-card class="glass">${hgUI.header(T, { icon: c.icon })}<div class="ph"><b>${hgT('cards.flow.no_power_sensors')}</b>${hgT('cards.flow.pick_grid_solar_or')}</div></ha-card>`;
    /* jedna bateria: węzeł pod środkiem; kilka: szyna (punkt) pod środkiem i baterie w rzędzie niżej, każda z podpisem */
    const M = this.model(), EPS = 5, bus = nb > 1, br = nb > 2 ? 8 : 9, by = 75, top = has.s ? 0 : 27, bot = !has.b ? 56 : bus ? by + br + 6 : 82, vh = bot - top;
    const BX = { 1: [50], 2: [33, 67], 3: [24, 50, 76], 4: [17, 39, 61, 83] }[nb] || [], X = { s: [50, 13], g: [13, 42], h: [87, 42], b0: [50, 71] };
    if (bus) BX.forEach((x, i) => { X['b' + i] = [x, by]; });
    const pos = (k) => `left:${X[k][0]}%;top:${((X[k][1] - top) / vh) * 100}%`;
    /* prędkość kropek: kilka poziomów (pierwiastek z kW), żeby drobne wahania mocy nie szarpały animacji */
    const dur = (w) => { const lv = Math.min(6, Math.round(Math.sqrt(w / 1000) * 3)); return (6.5 / (10 + lv * 9)).toFixed(3) + 's'; };
    const P = bus ? { gh: 'M23 42 L77 42', sb: 'M50 23 L50 58.4', sg: 'M43 20 Q16 15 13 32', sh: 'M57 20 Q84 15 87 32', bg: 'M48.4 60 Q16 66 13 52', bh: 'M51.6 60 Q84 66 87 52' }
      : { gh: 'M23 42 L77 42', sb: 'M50 23 L50 61', sg: 'M43 20 Q16 15 13 32', sh: 'M57 20 Q84 15 87 32', bg: 'M43 64 Q16 69 13 52', bh: 'M57 64 Q84 69 87 52' };
    /* linia: [ścieżka, czy jest, moc, kolor, w przeciwną stronę] */
    const L = [['gh', has.g, M.gh, '--fl-grid'], ['sh', has.s, M.sh, '--fl-sun'], ['bh', has.b, M.bh, '--fl-bat'], ['sg', has.s && has.g, M.sg, '--fl-sun'], ['sb', has.s && has.b, M.sb, '--fl-sun'],
      ['bg', has.b && has.g, M.gb > EPS ? M.gb : M.bg, M.gb > EPS ? '--fl-grid' : '--fl-bat', M.gb > EPS]].filter((l) => l[1]);
    /* odnogi szyny do baterii: ładowanie od szyny do baterii (kolor głównego źródła), rozładowanie w drugą stronę */
    if (bus) M.BT.forEach((b, i) => { const x = BX[i], w = Math.abs(b.w || 0), ch = (b.w || 0) < -EPS; P['k' + i] = x === 50 ? `M50 61.6 L50 ${by - br}` : `M50 61.6 C50 ${by - br - 2} ${x} 64 ${x} ${by - br}`;
      L.push(['k' + i, true, w, ch ? (M.sb >= M.gb ? '--fl-sun' : '--fl-grid') : '--fl-bat', !ch]); });
    const svg = `<svg viewBox="0 ${top} 100 ${vh}" aria-hidden="true">${L.map(([k, , w, col]) => `<path class="tr${w > EPS ? ' on' : ''}" style="--c:var(${col})" d="${P[k]}"/>`).join('')}
      ${L.map(([k, , w, col, rv]) => `<path class="fl${w > EPS ? ' on' : ''}${rv ? ' rv' : ''}" data-l="${k}" style="--c:var(${col});--d:${dur(w)}" d="${P[k]}"/>`).join('')}${bus ? `<circle class="hub${M.chg + M.dis > EPS ? ' on' : ''}" cx="50" cy="60" r="1.6"/>` : ''}</svg>`;
    /* niedostępne: żadna z encji węzła nie podaje wartości */
    const un = (es) => es.length > 0 && es.every((e) => H.num(h, e) == null);
    /* węzeł: klucz, encje, ikona, kolor, wartość W, podpis, pierścień (conic), aktywny, etykieta, szerokość */
    const node = (k, es, ic, col, w, sub, ring, on, lbl, wd) => { const [v, u] = this.fw(w); es = es.filter(Boolean);
      return `<button class="nd ${k === 's' ? 'sun ' : ''}${on ? 'on' : 'off'}${un(es) ? ' un' : ''}" style="${pos(k)};--c:var(${col})${ring ? ';--ring:' + ring : ''}${wd ? ';width:' + wd + '%' : ''}" data-act="more" data-e="${H.esc(es.join(','))}" aria-label="${H.lv(H.esc(lbl), `${v} ${u}${sub ? ', ' + H.esc(sub) : ''}`)}">
        ${H.icon(ic)}<b>${v}<em>${u}</em></b>${sub ? `<small>${H.esc(sub)}</small>` : ''}</button>`; };
    const full = (col) => `var(${col}) 0 100%`, nds = [], ns = hgArr(c.solar).length;
    if (has.s) nds.push(node('s', hgArr(c.solar), M.S > EPS ? 'mdi:white-balance-sunny' : 'mdi:solar-panel', '--fl-sun', M.S, ns > 1 ? hgT('cards.flow.solar_count_sub', { count: ns }) : hgT('cards.flow.solar_sub'), M.S > EPS ? full('--fl-sun') : '', M.S > EPS, hgT('cards.flow.solar_title')));
    if (has.g) { const ex = (M.G || 0) < -EPS, im = (M.G || 0) > EPS, xc = M.bg > M.sg ? '--fl-bat' : '--fl-sun';
      nds.push(node('g', [...hgArr(c.grid), ...hgArr(c.grid_export)], ex ? 'mdi:transmission-tower-import' : im ? 'mdi:transmission-tower-export' : 'mdi:transmission-tower', ex ? xc : '--fl-grid', M.G == null ? null : Math.abs(M.G),
        ex ? hgT('cards.flow.export') : im ? hgT('cards.flow.import') : hgT('cards.flow.grid'), ex ? full(xc) : im ? full('--fl-grid') : '', ex || im, hgT('cards.flow.grid_title'))); }
    M.BT.forEach((b, i) => { const w = b.w || 0, ch = w < -EPS, ds = w > EPS, lv = b.soc == null ? null : Math.max(0, Math.min(100, b.soc));
      const ic = lv == null ? (ch ? 'mdi:battery-charging' : 'mdi:battery') : ch ? `mdi:battery-charging-${Math.max(10, Math.round(lv / 10) * 10)}` : lv >= 95 ? 'mdi:battery' : lv < 10 ? 'mdi:battery-outline' : `mdi:battery-${Math.floor(lv / 10) * 10}`;
      const sub = lv != null ? H.pct(H.fmt(lv, 0)) : ch ? hgT('cards.flow.charging') : ds ? hgT('cards.flow.discharging') : hgT('cards.flow.battery');
      const nm = b.name || (bus ? (b.power || b.soc ? H.name(h, b.power || b.soc).replace(/\s*(moc|power|poziom|level|soc|stan naładowania|state of charge)\b/gi, '').trim() : '') || hgT('cards.flow.battery_n', { n: i + 1 }) : hgT('common.battery'));
      nds.push(node('b' + i, [b.power, b.soc], ic, '--fl-bat', b.power ? Math.abs(w) : null, sub, lv != null ? `var(--fl-bat) 0 ${lv}%, color-mix(in srgb, var(--fl-bat) 16%, transparent) ${lv}% 100%` : ds || ch ? full('--fl-bat') : '', ds || ch,
        nm + (ch ? hgT('cards.flow.charging_suffix') : ds ? hgT('cards.flow.discharging_suffix') : ''), bus ? br * 2 : 0));
      if (bus) nds.push(`<span class="cap" style="left:${X['b' + i][0]}%;top:${((by + br + 1 - top) / vh) * 100}%">${H.esc(nm)}</span>`); });
    /* dom: pierścień dzielony wg źródeł (panele, sieć, bateria) */
    const src = [['--fl-sun', M.sh, hgT('cards.flow.solar_title'), has.s], ['--fl-grid', M.gh, hgT('cards.flow.grid_title'), has.g], ['--fl-bat', M.bh, nb > 1 ? hgT('cards.flow.batteries_title') : hgT('cards.flow.battery_title'), has.b]].filter((x) => x[3]), tot = src.reduce((a, x) => a + x[1], 0);
    let acc = 0; const ring = tot > EPS ? src.filter((x) => x[1] > 0).map(([col, w]) => { const a = acc; acc += (w / tot) * 100; return `var(${col}) ${a.toFixed(1)}% ${acc.toFixed(1)}%`; }).join(', ') : '';
    nds.push(node('h', hgArr(c.home), 'mdi:home-lightning-bolt-outline', '--fl-home', M.Hm, hgT('cards.flow.home'), ring, M.Hm > EPS, hgT('cards.flow.home_title')));
    const own = tot > EPS ? Math.round(((M.sh + M.bh) / tot) * 100) : null;
    const lgs = src.filter((x) => x[1] / tot >= .005), lg = lgs.length > 1 && tot > EPS ? `<div class="lg" role="list" aria-label="${hgT('cards.flow.where_the_home_power')}">${lgs.map(([col, w, n]) => `<span role="listitem" style="--c:var(${col})"><i></i>${H.esc(n)} <b>${H.pct(H.fmt((w / tot) * 100, 0))}</b></span>`).join('')}</div>` : '';
    const fk = [vh, nb, !!lgs.length, has.s, has.g].join(); if (fk !== this._fk) { this._fk = fk; this._fitSoon(); }   /* dopasowanie tylko po zmianie układu (rozmiar śledzi ResizeObserver) */
    const sum = `${hgT('cards.flow.home_title')} ${this.fw(M.Hm).join(' ')}${own != null && (has.s || has.b) ? ', ' + hgT('cards.flow.self_powered_suffix', { own }) : ''}`;
    return `<ha-card class="glass">${hgUI.header(T, { icon: c.icon, sub: own != null && (has.s || has.b) ? hgT('cards.flow.self_powered_percent', { own }) : '' })}
      <div class="nv-mid"><div class="fs" style="--ar:100/${vh}" role="img" aria-label="${H.esc(sum)}">${svg}${nds.join('')}</div>${lg}</div></ha-card>`; }
  /* schemat mieści się w wysokości kafla: przy stałej wysokości (siatka, sekcje HA) zwęża się zamiast wychodzić poza szkło */
  connectedCallback() { if (super.connectedCallback) super.connectedCallback(); if (!this._ro) this._ro = new ResizeObserver(() => this._fit()); this._ro.observe(this); }
  disconnectedCallback() { if (super.disconnectedCallback) super.disconnectedCallback(); if (this._ro) this._ro.disconnect(); }
  _fitSoon() { cancelAnimationFrame(this._fr); this._fr = requestAnimationFrame(() => this._fit()); }
  _fit() { const card = this.$ && this.$.querySelector('ha-card'), fs = card && card.querySelector('.fs'); if (!fs) return;
    const cs = getComputedStyle(card), hd = card.querySelector('.nv-hd'), lg = card.querySelector('.lg'), mid = fs.parentElement, ar = fs.offsetHeight / (fs.offsetWidth || 1);
    const avail = card.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (hd ? hd.offsetHeight + (parseFloat(cs.rowGap) || 0) : 0) - (lg ? lg.offsetHeight + (parseFloat(getComputedStyle(mid).rowGap) || 0) : 0);
    const full = Math.min(mid.clientWidth, parseFloat(getComputedStyle(fs).getPropertyValue('--k') || 1) * 440 || mid.clientWidth), need = full * ar;
    const v = avail >= need - 2 || !isFinite(avail) ? '' : Math.max(120, Math.floor(avail / ar)) + 'px';
    if (this.style.getPropertyValue('--fl-max') !== v) { if (v) this.style.setProperty('--fl-max', v); else this.style.removeProperty('--fl-max'); } }
  /* węzeł z kilkoma encjami (sumowane fazy, falowniki, moc i poziom baterii): menu z wyborem, potem szczegóły encji */
  onAct(a, t) { if (a !== 'more' || !t.dataset.e) return; const es = t.dataset.e.split(','), h = this._hass, more = (e) => H.fire(this, 'hass-more-info', { entityId: e });
    if (es.length === 1) return more(es[0]);
    hgOverlay.menu(t, es.map((e) => { const s = H.st(h, e); return { label: `${H.name(h, e)} · ${s ? H.t(h, s) : '–'}`, icon: (s && s.attributes.icon) || (s && s.attributes.device_class === 'battery' ? 'mdi:battery' : 'mdi:flash-outline'), value: e }; })).then((e) => { if (e) more(e); }); }
  getGridOptions() { return { columns: 12, rows: 5 }; }
}
hgReg('hg-flow-card', HGFlowCard, hgTLazy('cards.flow.picker_name'), hgTLazy('cards.flow.picker_description'));
