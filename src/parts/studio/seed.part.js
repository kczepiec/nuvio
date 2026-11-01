/* studio/seed: układ startowy Studio (per widok), budowa z rekordów i migracja zapisanych układów. Ładowany po studio/registry. */
/* układ startowy (12 kol., jak makieta): [typ, x, y] lub [typ, x, y, { w, h }] */
const HG_STUDIO_SEED_V = 2;
const HG_STUDIO_SEED = [['greeting', 0, 0], ['weather', 5, 0], ['climate', 8, 0], ['home', 0, 4], ['media', 5, 4], ['cameras', 8, 4], ['energy', 0, 7], ['scenes', 5, 7]];
const hgStudioViewKey = (view) => {
  const v = view || 'dashboard';
  if (v === 'roboty' || v === 'robots') return 'roboty';
  if (v === 'bezpieczenstwo' || v === 'security') return 'bezpieczenstwo';
  if (v === 'siec' || v === 'network') return 'siec';
  return v;
};
const hgStudioWidgetItem = (type, x, y, M, hass, size) => {
  const d = HG_STUDIO_W[type], e = d.pick(M, hass);
  const settings = e ? { entity: e, ...(type === 'cameras' ? { entities: (M.cams || []).slice(0, 4) } : {}), ...(type === 'scenes' ? { entities: (M.scenes || []).slice(0, 6) } : {}), ...(type === 'weather' && M.sun ? { sun: M.sun } : {}) } : {};
  return { id: 'w_' + type, type, x, y, w: (size && size.w) || d.def.w, h: (size && size.h) || d.def.h, minW: d.min.w, minH: d.min.h, maxW: d.max.w, maxH: d.max.h, hidden: !e, settings };
};
const hgStudioCardItem = (id, card, x, y, w, h, name) => ({ id, type: 'card', x, y, w, h, minW: 2, minH: 2, maxW: 12, maxH: 10, hidden: false, settings: { card, name: name != null ? String(name) : '' } });
const hgStudioFinish = (layout) => Object.assign(layout, { seedV: HG_STUDIO_SEED_V, custom: 0 });
const hgStudioFromRecipe = (recipe, M, hass) => {
  const items = recipe.map((row) => {
    if (row[0] === 'card') { const [, id, card, x, y, w, h, name] = row; return hgStudioCardItem(id, card, x, y, w, h, name); }
    const [type, x, y, size] = row; return hgStudioWidgetItem(type, x, y, M, hass, size);
  });
  return hgStudioFinish({ v: 1, items: typeof HGGrid !== 'undefined' && HGGrid.norm ? HGGrid.norm(items, 12) : items, bps: {} });
};
const hgStudioSeedForView = (view, M, hass) => {
  const v = hgStudioViewKey(view), P = typeof HG_P === 'function' ? HG_P : (x) => '/' + x;
  if (v === 'family') {
    const ps = (M && M.persons) || [];
    if (!ps.length) return hgStudioFromRecipe([['greeting', 0, 0, { w: 12, h: 3 }]], M, hass);
    const zones = ((M && M.zones) || []).filter((z) => z !== 'zone.home');
    const recipe = [['card', 'w_people', { type: 'custom:hg-people-card', persons: ps, zones, min_h: 280 }, 0, 0, 12, 6, hgTLazy('nav.family')]];
    if ((M.cams || []).length) recipe.push(['cameras', 0, 6, { w: 7, h: 4 }]);
    recipe.push(['home', (M.cams || []).length ? 7 : 0, 6, { w: (M.cams || []).length ? 5 : 12, h: 4 }]);
    const lay = hgStudioFromRecipe(recipe, M, hass);
    const cam = lay.items.find((i) => i.id === 'w_cameras');
    if (cam && M.cams) cam.settings.entities = M.cams.slice(0, 4);
    return lay;
  }
  if (v === 'rooms') return hgStudioFromRecipe([['card', 'w_rooms', { type: 'custom:hg-areas-card', area: 'grid', min_h: 200, columns: 3, room_path: P('pokoj') }, 0, 0, 12, 10, hgTLazy('nav.rooms')]], M, hass);
  if (v === 'pokoj') return hgStudioFromRecipe([['card', 'w_room', { type: 'custom:hg-room-card', area: 'room', min_h: 200 }, 0, 0, 12, 10, hgTLazy('nav.room')]], M, hass);
  if (v === 'multimedia') return hgStudioFromRecipe([['media', 0, 0, { w: 7, h: 6 }], ['scenes', 7, 0, { w: 5, h: 4 }], ['greeting', 7, 4, { w: 5, h: 2 }]], M, hass);
  if (v === 'kamery') {
    const lay = hgStudioFromRecipe([['cameras', 0, 0, { w: 12, h: 9 }]], M, hass);
    const cam = lay.items.find((i) => i.id === 'w_cameras');
    if (cam && M.cams && M.cams.length) { cam.settings.entities = M.cams.slice(); cam.hidden = false; }
    return lay;
  }
  if (v === 'energia') return hgStudioFromRecipe([['energy', 0, 0, { w: 8, h: 6 }], ['home', 8, 0, { w: 4, h: 3 }], ['scenes', 8, 3, { w: 4, h: 3 }]], M, hass);
  if (v === 'mapa') {
    const ents = [...((M && M.persons) || []), ...((M && M.trackers) || []).slice(0, 12), ...(((M && M.zones) || []).includes('zone.home') ? ['zone.home'] : [])];
    if (!ents.length) return hgStudioFromRecipe([['greeting', 0, 0, { w: 12, h: 3 }]], M, hass);
    return hgStudioFromRecipe([['card', 'w_map', { type: 'custom:hg-map-card', area: 'm', min_h: 560, title: hgTLazy('nav.map'), entities: ents, theme_mode: 'auto', hours_to_show: 0 }, 0, 0, 12, 10, hgTLazy('nav.map')]], M, hass);
  }
  if (v === 'kalendarz') {
    const cals = (M && M.calendars) || [];
    if (!cals.length) return hgStudioFromRecipe([['greeting', 0, 0, { w: 12, h: 3 }]], M, hass);
    return hgStudioFromRecipe([
      ['card', 'w_month', { type: 'custom:hg-month-card', calendars: cals, min_h: 380 }, 0, 0, 7, 6, hgTLazy('nav.calendar')],
      ['card', 'w_agenda', { type: 'custom:hg-agenda-card', calendars: cals, days: 14, min_h: 380 }, 7, 0, 5, 6, hgTLazy('nav.calendar')],
    ], M, hass);
  }
  if (v === 'roboty') {
    const bots = (M && M.robots) || [];
    if (!bots.length) return hgStudioFromRecipe([['greeting', 0, 0, { w: 12, h: 3 }]], M, hass);
    return hgStudioFromRecipe([['card', 'w_robots', { type: 'custom:hg-robots-card', entities: bots, min_h: 420 }, 0, 0, 12, 10, hgTLazy('edit.robots')]], M, hass);
  }
  if (v === 'bezpieczenstwo') {
    const hasAlarm = !!(M && M.alarm), hasCam = !!(M && M.cams && M.cams.length);
    if (!hasAlarm && !hasCam) return hgStudioFromRecipe([['card', 'w_sensors', { type: 'custom:hg-sensors-card', min_h: 320 }, 0, 0, 12, 8, hgTLazy('cards.sensors.sensors')], ['home', 0, 8, { w: 12, h: 3 }]], M, hass);
    const recipe = [];
    if (hasAlarm) recipe.push(['card', 'w_alarm', { type: 'custom:hg-alarm-card', entity: M.alarm, min_h: 300 }, 0, 0, 12, 5, hgTLazy('edit.alarm')]);
    recipe.push(['card', 'w_sensors', { type: 'custom:hg-sensors-card', min_h: 280 }, 0, hasAlarm ? 5 : 0, 12, hasAlarm ? 5 : 7, hgTLazy('cards.sensors.sensors')]);
    const y = hasAlarm ? 10 : 7;
    recipe.push(['home', 0, y, { w: hasCam ? 6 : 12, h: 3 }]);
    if (hasCam) recipe.push(['cameras', 6, y, { w: 6, h: 3 }]);
    return hgStudioFromRecipe(recipe, M, hass);
  }
  if (v === 'siec') {
    return hgStudioFromRecipe([
      ['card', 'w_net_wan', { type: 'custom:hg-net-card', section: 'wan', net: {}, min_h: 260 }, 0, 0, 6, 4, hgTLazy('edit.modes.internet')],
      ['card', 'w_net_gw', { type: 'custom:hg-net-card', section: 'gw', net: {}, min_h: 260 }, 6, 0, 6, 4, hgTLazy('edit.modes.gateway')],
      ['card', 'w_net_wlan', { type: 'custom:hg-net-card', section: 'wlan', net: {}, min_h: 260 }, 0, 4, 6, 4, hgTLazy('edit.modes.wi_fi')],
      ['card', 'w_net_cl', { type: 'custom:hg-net-card', section: 'cl', net: {}, min_h: 320 }, 6, 4, 6, 6, hgTLazy('edit.modes.clients')],
    ], M, hass);
  }
  const recipe = v === 'dashboard' ? HG_STUDIO_SEED : [['greeting', 0, 0, { w: 4, h: 3 }]];
  return hgStudioFromRecipe(recipe, M, hass);
};
const hgStudioSeed = (M, hass, view) => hgStudioSeedForView(view, M, hass);
const hgStudioMigrate = (data) => {
  if (!data || data.studios || !data.studio) return;
  const s = data.studio;
  data.studios = { dashboard: s, studio: JSON.parse(JSON.stringify(s)) };
};
const hgStudioGet = (data, view) => {
  if (!data) return null;
  hgStudioMigrate(data);
  const v = hgStudioViewKey(view || 'dashboard');
  return (data.studios && data.studios[v]) || null;
};
/* widok Pokoje: siatka (3 kolumny wysokich kart) albo lista (1 kolumna niskich wierszy); wybór per urządzenie w localStorage */
const hgRoomsLayout = (v) => { try { if (v === undefined) return localStorage.getItem('home-glass:rooms-layout') === 'list' ? 'list' : 'grid'; if (v === 'list') localStorage.setItem('home-glass:rooms-layout', 'list'); else localStorage.removeItem('home-glass:rooms-layout'); } catch (e) { /* tryb prywatny */ } return v === 'list' ? 'list' : 'grid'; };
const hgStudioSet = (data, view, layout) => {
  if (!data.studios) data.studios = {};
  data.studios[hgStudioViewKey(view || 'dashboard')] = layout;
};
/* seed raz na widok; seedV < HG_STUDIO_SEED_V podmienia zapisany układ startowy (nowe makiety widoków) */
const hgStudioEnsure = (L, M, hass, view = 'dashboard') => {
  if (!L || !L.loaded || L.failed || !L.data) return false;
  const cur = hgStudioGet(L.data, view);
  if (cur && (cur.seedV || 1) >= HG_STUDIO_SEED_V) return false;
  hgStudioSet(L.data, view, hgStudioSeed(M, hass, view));
  return true;
};
