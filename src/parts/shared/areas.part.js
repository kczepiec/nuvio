/* shared/areas: Model pokoi (obszary, urządzenia i encje HA) używany przez karty pokoi, stronę i edytor. */
const hgGlob = (pat) => new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
/* ===================== POKOJE (obszary HA) ===================== */
/* Model pokoi: rejestr obszarów + rejestr encji/urządzeń z hass (hass.areas / hass.entities / hass.devices, bez dodatkowych zapytań).
   Encja należy do obszaru: CFG assign (tylko wyświetlanie, rejestr HA bez zmian) > area_id encji > area_id urządzenia; merge łączy duplikaty obszarów.
   Pomijane: ukryte, diagnostyczne/konfiguracyjne (entity_category), wyłączone (nie ma ich w hass.entities), platformy z exclude_platforms. */
const HG_AREA_ICONS = [[/salon|living|wypoczyn/, 'mdi:sofa-outline'], [/kuchni|kitchen/, 'mdi:countertop-outline'], [/lazienk|bath|toalet|\bwc\b/, 'mdi:shower-head'],
  [/sypialni|bedroom/, 'mdi:bed-king-outline'], [/biur|office|gabinet/, 'mdi:desk'], [/garaz|garage/, 'mdi:garage-variant'], [/ogrod|garden/, 'mdi:flower-outline'],
  [/taras|balkon|balcony/, 'mdi:balcony'], [/ganek|weranda|porch/, 'mdi:home-import-outline'], [/wejsc|entrance|przedpok|hall/, 'mdi:door-open'],
  [/piwnic|basement/, 'mdi:stairs-down'], [/pralni|laundry/, 'mdi:washing-machine'], [/korytarz|schod|stairs/, 'mdi:stairs'], [/parter|ground/, 'mdi:home-floor-0'],
  [/pietro|poddasz|floor/, 'mdi:home-floor-1'], [/eliann|dziec|kids/, 'mdi:teddy-bear'], [/siec|network/, 'mdi:lan'], [/jadal|dining/, 'mdi:silverware-fork-knife']];
const hgNorm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
const HG_SKIP_DOM = new Set(['event', 'notify', 'update', 'device_tracker', 'tts', 'stt', 'conversation', 'ai_task', 'assist_satellite', 'infrared', 'zone', 'person',
  'automation', 'script', 'sun', 'weather', 'calendar', 'image', 'todo', 'wake_word', 'tag', 'input_text', 'input_datetime', 'input_number', 'input_select', 'counter',
  'timer', 'schedule', 'remote', 'group', 'persistent_notification', 'alarm_control_panel', 'date', 'time', 'datetime']);
const HG_CTRL_DOM = new Set(['light', 'switch', 'climate', 'cover', 'fan', 'lock', 'humidifier', 'media_player', 'vacuum', 'water_heater', 'valve', 'lawn_mower', 'siren', 'camera']);
const HG_LIGHTISH = /(swiatl|swiatel|oswietl|lamp|\bled\b|light|wlacznik|zarowk|kinkiet|zyrandol)/;
const HG_TEMP_BAD = /(water|woda|wody|kettle|czajnik|boiler|bojler|heater|cpu|chip|procesor|battery|bateri|inverter|falownik|motor|silnik|pralk|washer|dryer|suszark|lodowk|fridge|zamrazark|freezer|piekarnik|oven|soc\b|core)/;
/* sekcje pokoju: [id, klucz zapisany w układzie (polska nazwa, identyfikator – nie tekst do wyświetlenia), ikona, nazwa w katalogu] */
const HG_SEC = [['light', 'Światła', 'mdi:lightbulb-group-outline', hgTLazy('shared.areas.sections.light')], ['clim', 'Klimatyzacja', 'mdi:thermostat', hgTLazy('shared.areas.sections.clim')], ['media', 'Media', 'mdi:speaker', hgTLazy('shared.areas.sections.media')], ['cover', 'Rolety', 'mdi:window-shutter', hgTLazy('shared.areas.sections.cover')], ['sw', 'Przełączniki', 'mdi:toggle-switch-outline', hgTLazy('shared.areas.sections.sw')], ['sens', 'Czujniki', 'mdi:gauge', hgTLazy('shared.areas.sections.sens')], ['mot', 'Ruch i obecność', 'mdi:motion-sensor', hgTLazy('shared.areas.sections.mot')], ['door', 'Drzwi i okna', 'mdi:door', hgTLazy('shared.areas.sections.door')], ['cam', 'Kamery', 'mdi:cctv', hgTLazy('shared.areas.sections.cam')], ['rob', 'Roboty', 'mdi:robot-vacuum', hgTLazy('shared.areas.sections.rob')], ['misc', 'Inne', 'mdi:tune-variant', hgTLazy('shared.areas.sections.misc')]];
/* domeny, które można dodać do sekcji pokoju (Ustawienia sekcji → Dodaj encję) */
const HG_SEC_DOMS = { light: ['light', 'switch'], sw: ['switch', 'fan', 'humidifier', 'input_boolean', 'lock', 'valve', 'siren'], clim: ['climate', 'water_heater'], media: ['media_player'], cover: ['cover'], sens: ['sensor', 'binary_sensor'], mot: ['binary_sensor'], door: ['binary_sensor'], cam: ['camera'], rob: ['vacuum', 'lawn_mower'] };

const HGAreas = {
  _memo: new WeakMap(), _e: {}, _sc: { s: null, n: 0, t: 0 },
  /* liczba encji w stanach: liczona najwyżej co 5 s (nowy obiekt hass.states przy każdej zmianie stanu – bez Object.keys przy każdej aktualizacji) */
  _cnt(h) { const c = this._sc; if (c.s !== h.states && Date.now() - c.t > 5000) { c.s = h.states; c.n = Object.keys(h.states).length; c.t = Date.now(); } return c.n; },
  /* model liczony tylko gdy zmieni się rejestr (obiekty hass.entities / devices / areas), konfiguracja albo liczba encji */
  /* pokoje z układu (Wygląd → Pokoje, HGL.data.wiz.areas); karta z własnym „areas” ma pierwszeństwo, pola z układu uzupełniają */
  glob(cfg) { const w = (typeof HGL !== 'undefined' && HGL.data && HGL.data.wiz && HGL.data.wiz.areas) || null; if (!w || (cfg && cfg._own) || (cfg && this._gs && this._gs.has(cfg))) return cfg;
    const k = JSON.stringify(w) + '|' + JSON.stringify(cfg || {}), G = this._gm || (this._gm = new Map()); let v = G.get(k);
    if (!v) { if (G.size > 40) G.clear(); v = Object.assign({}, w, cfg || {}, { hide: [...new Set([...(w.hide || []), ...((cfg && cfg.hide) || [])])] }); G.set(k, v); (this._gs || (this._gs = new WeakSet())).add(v); } return v; },
  model(h, cfg) {
    cfg = this.glob(cfg) || this._e;
    const key = [h.entities, h.devices, h.areas, this._cnt(h), HGI18n.code, HGI18n.cache[HGI18n.code]];   /* język i katalog w kluczu: nazwa pokoju „Bez pokoju” jest tłumaczona */
    const m0 = this._memo.get(cfg);
    if (m0 && m0.key.every((x, i) => x === key[i])) return m0;
    const reg = h.entities || {}, dev = h.devices || {}, areasReg = h.areas || {};
    const merge = cfg.merge || {}, assign = Object.assign({}, cfg.assign || {}), names = cfg.names || {}, icons = cfg.icons || {};
    const exP = new Set(cfg.exclude_platforms || ['browser_mod']);
    const exc = (cfg.exclude || []).map(hgGlob), unEx = (cfg.unassigned_exclude || []).map(hgGlob);
    const list = [], byId = {};
    const add = (id, name, icon, virtual) => {
      if (byId[id] || (cfg.hide || []).includes(id)) return;
      const a = { id, name, icon: icon || (HG_AREA_ICONS.find(([re]) => re.test(hgNorm(name) + ' ' + id)) || [0, 'mdi:home-outline'])[1], virtual: !!virtual, ents: [], strip: [name] };
      byId[id] = a; list.push(a);
    };
    for (const a of Object.values(areasReg)) if (!merge[a.area_id]) { add(a.area_id, names[a.area_id] || a.name, icons[a.area_id] || a.icon); if (a.picture && byId[a.area_id]) byId[a.area_id].picture = a.picture; }
    for (const [from, to] of Object.entries(merge)) { const a = areasReg[from]; if (a && byId[to]) byId[to].strip.push(a.name); }
    for (const v of cfg.virtual || []) add(v.id, v.name, v.icon, true);
    for (const v of cfg.virtual || []) for (const e of v.entities || []) if (!assign[e]) assign[e] = v.id;
    const un = [], rHide = cfg.room_hide || {};
    for (const e of Object.keys(h.states)) {
      const dom = e.slice(0, e.indexOf('.')), r = reg[e];
      const forced = assign[e];
      if (!forced) {
        if (!r || r.hidden || r.entity_category || exP.has(r.platform) || HG_SKIP_DOM.has(dom) || exc.some((x) => x.test(e))) continue;
      }
      let aid = forced || (r && (r.area_id || (r.device_id && dev[r.device_id] && dev[r.device_id].area_id))) || null;
      if (aid && merge[aid]) aid = merge[aid];
      if (aid && byId[aid]) { if (!(rHide[aid] && rHide[aid].includes(e))) byId[aid].ents.push(e); }   /* ukryte w tym pokoju (Ustawienia sekcji → Ukryj w tym pokoju) */
      else if (!aid && HG_CTRL_DOM.has(dom) && !unEx.some((x) => x.test(e))) un.push(e);
    }
    if (cfg.unassigned !== false && un.length) { add('_none', hgT('shared.areas.no_room'), 'mdi:help-box-multiple-outline', true); byId._none.ents = un; }
    for (const a of list) this._classify(h, a, cfg);
    const coll = new Intl.Collator(HG_LOC());
    const ord = cfg.order || [];
    list.sort((a, b) => {
      const oa = ord.indexOf(a.id), ob = ord.indexOf(b.id);
      if (oa >= 0 || ob >= 0) return (oa < 0 ? 999 : oa) - (ob < 0 ? 999 : ob);
      const ta = a.id === '_none' ? 3 : a.id === 'siec' ? 2 : a.ents.length ? 0 : 1, tb = b.id === '_none' ? 3 : b.id === 'siec' ? 2 : b.ents.length ? 0 : 1;
      return ta - tb || coll.compare(a.name, b.name);
    });
    // stała lista pokoi z CFG (kolejność jak w CFG); bez niej – wszystkie obszary
    const rooms = Array.isArray(cfg.rooms) ? cfg.rooms.map((id) => byId[id]).filter(Boolean) : list;
    const inRoom = new Set(rooms.flatMap((a) => a.ents));
    const others = (cfg.others || []).filter((e, i, arr) => h.states[e] && arr.indexOf(e) === i && !inRoom.has(e));
    const m = { key, list, byId, rooms, others };
    this._memo.set(cfg, m);
    return m;
  },
  /* pokój encji tylko z rejestru HA (obszar encji albo urządzenia, z merge) – bez ręcznych przypisań */
  areaOf(h, cfg, e) { cfg = this.glob(cfg) || this._e; const r = (h.entities || {})[e], dev = h.devices || {}, merge = cfg.merge || {};
    let aid = (r && (r.area_id || (r.device_id && dev[r.device_id] && dev[r.device_id].area_id))) || null; if (aid && merge[aid]) aid = merge[aid]; return aid; },
  _classify(h, a, cfg) {
    const reg = h.entities || {}, sec = {};
    for (const [k] of HG_SEC) sec[k] = [];
    const robDev = new Set(a.ents.filter((e) => /^(vacuum|lawn_mower)\./.test(e)).map((e) => reg[e] && reg[e].device_id).filter(Boolean));
    const misc = new Map(), inA = new Set(a.ents);
    // ta sama fizyczna lampa raz: grupa (light z atrybutem entity_id) pomijana, gdy jej członek jest w tym pokoju
    a.ents = a.ents.filter((e) => { const m = e.startsWith('light.') && h.states[e].attributes.entity_id; return !(Array.isArray(m) && m.some((x) => x !== e && inA.has(x))); });
    for (const e of a.ents) {
      const s = h.states[e], dom = e.slice(0, e.indexOf('.')), r = reg[e] || {}, at = s.attributes, dc = at.device_class;
      const nmN = hgNorm((at.friendly_name || '') + ' ' + e);
      if (r.device_id && robDev.has(r.device_id) && dom !== 'vacuum' && dom !== 'lawn_mower') continue;     // robot: jedna pozycja zamiast kilkudziesięciu encji
      if (cfg.room_robots === false && (dom === 'vacuum' || dom === 'lawn_mower')) continue;               // roboty tylko w widoku Roboty
      let k = 'misc';
      if (dom === 'light') k = 'light';
      else if (dom === 'switch') k = HG_LIGHTISH.test(nmN) ? 'light' : 'sw';
      else if (['fan', 'humidifier', 'input_boolean', 'lock', 'valve', 'siren'].includes(dom)) k = 'sw';
      else if (dom === 'climate' || dom === 'water_heater') k = 'clim';
      else if (dom === 'media_player') k = 'media';
      else if (dom === 'cover') k = 'cover';
      else if (dom === 'camera') k = 'cam';
      else if (dom === 'vacuum' || dom === 'lawn_mower') k = 'rob';
      else if (dom === 'binary_sensor') k = ['motion', 'occupancy', 'presence'].includes(dc) ? 'mot' : ['door', 'window', 'opening', 'garage_door'].includes(dc) ? 'door' : 'sens';
      else if (dom === 'sensor') k = dc || at.unit_of_measurement || isFinite(parseFloat(s.state)) ? 'sens' : 'misc';
      const fk = cfg.sec_of && cfg.sec_of[e]; if (fk && fk !== 'misc' && sec[fk] && cfg.assign && cfg.assign[e] === a.id) k = fk;   /* encja dodana do konkretnej sekcji */
      if (k === 'misc') {
        const g = r.device_id || e;
        if (!misc.has(g)) misc.set(g, { dev: r.device_id || null, ents: [] });
        misc.get(g).ents.push(e);
      } else sec[k].push(e);
    }
    sec.misc = [...misc.values()];
    // to samo urządzenie pod kilkoma encjami o tej samej (pełnej) nazwie (np. TV w dwóch integracjach) -> jedna pozycja, dostępna ma pierwszeństwo
    for (const k of ['light', 'sw', 'media']) {
      const best = new Map();
      const fn = (e) => hgNorm((cfg.entity_names && cfg.entity_names[e]) || H.name(h, e, e));   // pełna nazwa: różne urządzenia o tej samej nazwie po obcięciu pokoju zostają
      for (const e of sec[k]) { const n = fn(e), b = best.get(n); if (!b || (!H.ok(h.states[b]) && H.ok(h.states[e]))) best.set(n, e); }
      sec[k] = sec[k].filter((e) => best.get(fn(e)) === e);
    }
    a.sec = sec;
    // temperatura / wilgotność pokoju: nadpisanie z CFG > czujnik otoczenia > bieżąca temperatura klimatyzacji/grzejnika
    const ov = (cfg.sensors || {})[a.id] || {};
    const pick = (dcx) => sec.sens.filter((e) => e.startsWith('sensor.') && h.states[e].attributes.device_class === dcx && !HG_TEMP_BAD.test(hgNorm(h.states[e].attributes.friendly_name + ' ' + e)));
    const ts = pick('temperature'), hs = pick('humidity');
    const cl = sec.clim.filter((e) => e.startsWith('climate.'));
    a.temp = ov.temperature === '-' ? null : ov.temperature ? { e: ov.temperature } : ts.length ? { e: ts[0] } : cl.length ? { e: cl[0], attr: 'current_temperature' } : null;
    a.hum = ov.humidity === '-' ? null : ov.humidity ? { e: ov.humidity } : hs.length ? { e: hs[0] } : cl.length ? { e: cl[0], attr: 'current_humidity' } : null;
    if (a.id === '_none') { a.temp = null; a.hum = null; }
    const devs = new Set(a.ents.map((e) => (reg[e] && reg[e].device_id) || e)); a.devN = devs.size;
    a.lights = sec.light;
    const se = Object.keys(ov).filter((k) => /^(state|temp):/.test(k)).map((k) => ov[k]).filter((e) => typeof e === 'string' && h.states[e]);   // encje stanu i temperatury urządzeń klimatu
    a.watch = [...new Set([...sec.light, ...sec.mot, ...cl, ...se, a.temp && a.temp.e, a.hum && a.hum.e].filter(Boolean))];
  },
  /* czujniki temperatury / wilgotności do wyboru dla pokoju: najpierw z pokoju, potem pozostałe (bez ukrytych) */
  /* dc 'heating': encje włącz/wyłącz i liczbowe urządzenia klimatu (ce) i pokoju, najpierw te z urządzenia */
  cands(h, a, dc, ce) { const reg = h.entities || {}, inR = new Set(a.ents || []);
    if (dc === 'heating') {
      const dev = ce && reg[ce] && reg[ce].device_id, ok = (e) => /^(binary_sensor|switch|input_boolean)\./.test(e) || (e.startsWith('sensor.') && h.states[e].state !== '' && isFinite(Number(h.states[e].state)));
      const all = Object.keys(h.states).filter((e) => e !== ce && ok(e) && !(reg[e] && reg[e].hidden)), onDev = (e) => !!dev && reg[e] && reg[e].device_id === dev;
      return [...all.filter(onDev), ...all.filter((e) => !onDev(e) && inR.has(e))]; }
    const xd = ce && reg[ce] && reg[ce].device_id, all = Object.keys(h.states).filter((e) => e.startsWith('sensor.') && h.states[e].attributes.device_class === dc && !(reg[e] && reg[e].hidden) && !(xd && reg[e] && reg[e].device_id === xd));   // ce: bez czujników samego urządzenia klimatu
    return [...all.filter((e) => inR.has(e)), ...all.filter((e) => !inR.has(e))]; },
  /* encja „stan rzeczywisty” przypisana urządzeniu klimatu w Wygląd → Pokoje (sensors[pokój]['state:climate.x']), null gdy brak */
  /* ustawienia źródła stanu urządzenia klimatu (patrz climate-modes): pokój z kluczami tego urządzenia, inaczej pokój urządzenia (rid) */
  climCfg(h, e, cfg, rid) {
    const G = this.glob(cfg || null) || {}, S = G.sensors || {}, reg = h.entities || {}, dev = reg[e] && reg[e].device_id, P = ['src:', 'state:', 'thr:', 'temp:', 'hys:'];
    let r = Object.keys(S).find((k) => S[k] && P.some((p) => S[k][p + e] != null));
    if (!r) r = rid || (G.assign && G.assign[e]) || this.areaOf(h, G, e);
    const o = (r && S[r]) || {}, ok = (x) => (x && x !== '-' && h.states[x] && !(dev && reg[x] && reg[x].device_id === dev) ? x : null);
    return { src: o['src:' + e] || 'auto', ent: o['state:' + e] && h.states[o['state:' + e]] ? o['state:' + e] : null, thr: o['thr:' + e], hys: o['hys:' + e], temp: ok(o['temp:' + e]) || ok(o.temperature) };
  },
  stateOf(h, e, cfg) { const S = (this.glob(cfg || null) || {}).sensors || {}; for (const r in S) { const v = S[r] && S[r]['state:' + e]; if (v && h.states[v]) return v; } return null; },
  val(h, ref) {
    if (!ref) return null;
    const s = h.states[ref.e]; if (!H.ok(s)) return null;
    const v = parseFloat(ref.attr ? s.attributes[ref.attr] : s.state);
    return isFinite(v) ? v : null;
  },
  env(h, a) {
    const t = this.val(h, a.temp), u = this.val(h, a.hum);
    return { t, u, txt: [t != null ? `${H.fmt(t, 1)}°` : '', u != null ? H.pct(H.fmt(u, 0)) : ''].filter(Boolean) };
  },
  /* nazwa bez prefiksu pokoju („Biuro Lampa” -> „Lampa”); pusta -> etykieta zastępcza */
  name(h, e, a, cfg, fb) {
    const n0 = (cfg && cfg.entity_names && cfg.entity_names[e]) || H.name(h, e, e);
    let n = n0;
    // prefiks nazwy urządzenia („Mi Air Purifier 3/3H Temperatura” -> „Temperatura”), jeśli coś zostaje
    const r = !(cfg && cfg.entity_names && cfg.entity_names[e]) && h.entities && h.entities[e], d = r && r.device_id && h.devices && h.devices[r.device_id];
    const dn = d && (d.name_by_user || d.name);
    if (dn && n.toLowerCase().startsWith(dn.toLowerCase() + ' ')) { const rest = n.slice(dn.length).replace(/^[\s\-–·:*]+/, ''); if (rest) n = rest; }
    n = n.replace(/^\*\s*/, '').replace(/\s\*\s/g, ' ');
    const strips = (a && a.strip) || [], esc = (p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const p of strips) {
      const re = new RegExp('^\\s*' + esc(p) + '[\\s\\-–·:_]*', 'i');
      n = n.replace(re, '');
    }
    for (const p of strips) n = n.replace(new RegExp('\\s+[-–·:]?\\s*' + esc(p) + '(?=\\s|$)', 'ig'), ' ');
    n = n.replace(/\s+(zajętość|occupancy|contact|kontakt)$/i, '').replace(/\b(\p{L}+)\s+\1$/iu, '$1').replace(/^[\s\-–·:]+|[\s\-–·:]+$/g, '');
    n = n.replace(/\s{2,}/g, ' ').trim();
    if (!n) n = fb || n0;
    return n.charAt(0).toUpperCase() + n.slice(1);
  },
  areaFromUrl() { try { return new URLSearchParams(location.search).get('area'); } catch (e) { return null; } },
};
window.__hgAreas = HGAreas;
