/* studio/seed: układ startowy Studio (per widok), budowa z rekordów i migracja zapisanych układów. Ładowany po studio/registry. */
/* układ startowy (12 kol., jak makieta): [typ, x, y] lub [typ, x, y, { w, h }] */
const HG_STUDIO_SEED = [['greeting', 0, 0], ['weather', 5, 0], ['climate', 8, 0], ['home', 0, 4], ['media', 5, 4], ['cameras', 8, 4], ['energy', 0, 7], ['scenes', 5, 7]];
const hgStudioWidgetItem = (type, x, y, M, hass, size) => {
  const d = HG_STUDIO_W[type], e = d.pick(M, hass);
  const settings = e ? { entity: e, ...(type === 'cameras' ? { entities: (M.cams || []).slice(0, 4) } : {}), ...(type === 'scenes' ? { entities: (M.scenes || []).slice(0, 6) } : {}), ...(type === 'weather' && M.sun ? { sun: M.sun } : {}) } : {};
  return { id: 'w_' + type, type, x, y, w: (size && size.w) || d.def.w, h: (size && size.h) || d.def.h, minW: d.min.w, minH: d.min.h, maxW: d.max.w, maxH: d.max.h, hidden: !e, settings };
};
const hgStudioCardItem = (id, card, x, y, w, h, name) => ({ id, type: 'card', x, y, w, h, minW: 2, minH: 2, maxW: 12, maxH: 10, hidden: false, settings: { card, name: name != null ? String(name) : '' } });
const hgStudioFromRecipe = (recipe, M, hass) => {
  const items = recipe.map((row) => {
    if (row[0] === 'card') { const [, id, card, x, y, w, h, name] = row; return hgStudioCardItem(id, card, x, y, w, h, name); }
    const [type, x, y, size] = row; return hgStudioWidgetItem(type, x, y, M, hass, size);
  });
  return { v: 1, items: typeof HGGrid !== 'undefined' && HGGrid.norm ? HGGrid.norm(items, 12) : items, bps: {}, custom: 0 };
};
const hgStudioSeedForView = (view, M, hass) => {
  const v = view || 'dashboard', P = typeof HG_P === 'function' ? HG_P : (x) => '/' + x;
  if (v === 'family') {
    const ps = (M && M.persons) || [];
    if (!ps.length) return hgStudioFromRecipe([['greeting', 0, 0]], M, hass);
    const items = ps.slice(0, 9).map((e, i) => hgStudioCardItem('w_person_' + i, { type: 'custom:hg-person-card', entity: e }, (i % 3) * 4, Math.floor(i / 3) * 3, 4, 3, (hass.states[e] && hass.states[e].attributes.friendly_name) || e));
    return { v: 1, items: typeof HGGrid !== 'undefined' && HGGrid.norm ? HGGrid.norm(items, 12) : items, bps: {}, custom: 0 };
  }
  if (v === 'rooms') return hgStudioFromRecipe([['card', 'w_rooms', { type: 'custom:hg-areas-card', area: 'grid', min_h: 200, room_path: P('pokoj') }, 0, 0, 12, 10, hgTLazy('nav.rooms')]], M, hass);
  if (v === 'pokoj') return hgStudioFromRecipe([['card', 'w_room', { type: 'custom:hg-room-card', area: 'room', min_h: 200 }, 0, 0, 12, 10, hgTLazy('nav.room')]], M, hass);
  if (v === 'multimedia') return hgStudioFromRecipe([[ 'media', 0, 0, { w: 6, h: 5 } ], ['scenes', 6, 0, { w: 6, h: 4 }]], M, hass);
  if (v === 'kamery') return hgStudioFromRecipe([[ 'cameras', 0, 0, { w: 12, h: 6 } ]], M, hass);
  if (v === 'energia') return hgStudioFromRecipe([[ 'energy', 0, 0, { w: 6, h: 4 } ], ['scenes', 6, 0, { w: 6, h: 3 }]], M, hass);
  if (v === 'mapa') {
    const ents = [...((M && M.persons) || []), ...((M && M.trackers) || []).slice(0, 12), ...(((M && M.zones) || []).includes('zone.home') ? ['zone.home'] : [])];
    if (!ents.length) return hgStudioFromRecipe([['greeting', 0, 0]], M, hass);
    return hgStudioFromRecipe([['card', 'w_map', { type: 'custom:hg-map-card', area: 'm', min_h: 560, title: hgTLazy('nav.map'), entities: ents, theme_mode: 'auto', hours_to_show: 0 }, 0, 0, 12, 10, hgTLazy('nav.map')]], M, hass);
  }
  if (v === 'kalendarz') {
    const cals = (M && M.calendars) || [];
    if (!cals.length) return hgStudioFromRecipe([['greeting', 0, 0]], M, hass);
    return hgStudioFromRecipe([
      ['card', 'w_month', { type: 'custom:hg-month-card', calendars: cals, min_h: 380 }, 0, 0, 7, 6, hgTLazy('nav.calendar')],
      ['card', 'w_agenda', { type: 'custom:hg-agenda-card', calendars: cals, days: 14, min_h: 380 }, 7, 0, 5, 6, hgTLazy('nav.calendar')],
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
  const v = view || 'dashboard';
  return (data.studios && data.studios[v]) || null;
};
const hgStudioSet = (data, view, layout) => {
  if (!data.studios) data.studios = {};
  data.studios[view || 'dashboard'] = layout;
};
/* seed tylko raz na widok: po wczytaniu układu, bez błędu i bez zapisu; istniejącego nigdy nie nadpisuje. Zwraca, czy zasiał. */
const hgStudioEnsure = (L, M, hass, view = 'dashboard') => {
  if (!L || !L.loaded || L.failed || !L.data) return false;
  if (hgStudioGet(L.data, view)) return false;
  hgStudioSet(L.data, view, hgStudioSeed(M, hass, view));
  return true;
};
