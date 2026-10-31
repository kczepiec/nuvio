/* shared/studio-widgets: rejestr widżetów widoku Studio i pierwszy układ (seed). HGGrid (shared/grid-engine) tylko w czasie wywołania. */
/* card: element karty; i: ikona; n: nazwa (hgTLazy); def/min/max: rozmiar w kolumnach/wierszach siatki 12 kol.;
   pick(M, hass): encja startowa albo null (wtedy widżet startuje ukryty); cfg(entity, settings, hass): konfiguracja karty */
const HG_STUDIO_W = {
  greeting: { card: 'hg-hero-card', i: 'mdi:hand-wave-outline', n: hgTLazy('studio.w.greeting'), def: { w: 5, h: 4 }, min: { w: 3, h: 2 }, max: { w: 12, h: 6 },
    pick: (M) => (M && M.sun) || 'sun.sun', cfg: () => ({ studio: true, status: true }) },
  weather: { card: 'hg-weather-card', i: 'mdi:weather-partly-cloudy', n: hgTLazy('studio.w.weather'), def: { w: 3, h: 4 }, min: { w: 2, h: 2 }, max: { w: 6, h: 6 },
    pick: (M) => (M && M.weather) || null, cfg: (e, s) => ({ entity: e, ...((s && s.sun) ? { sun: s.sun } : {}), hours: 24, studio: true, hourly: 4 }) },
  climate: { card: 'hg-studio-climate-card', i: 'mdi:thermostat', n: hgTLazy('studio.w.climate'), def: { w: 4, h: 4 }, min: { w: 2, h: 2 }, max: { w: 8, h: 6 },
    pick: (M) => (M && M.climate && M.climate[0]) || null, cfg: (e) => ({ entity: e }) },
  home: { card: 'hg-studio-home-card', i: 'mdi:home-outline', n: hgTLazy('studio.w.home'), def: { w: 5, h: 3 }, min: { w: 2, h: 2 }, max: { w: 12, h: 4 },
    pick: (M, h) => Object.keys((h && h.states) || {}).find((e) => /^(light|lock)\./.test(e)) || ((M && M.all) || []).find((e) => /^(light|lock)\./.test(e)) || null,
    cfg: (e, s, h) => { const C = customElements.get('hg-studio-home-card'); return { ...(C && h ? C.getStubConfig(h) : {}), ...((s && s.lock) ? { lock: s.lock } : {}), ...((s && s.temperature) ? { temperature: s.temperature } : {}) }; } },
  media: { card: 'hg-media-card', i: 'mdi:play-box-outline', n: hgTLazy('studio.w.media'), def: { w: 3, h: 3 }, min: { w: 2, h: 2 }, max: { w: 6, h: 5 },
    pick: (M) => (M && M.media && M.media[0]) || null, cfg: (e) => ({ entity: e, studio: true }) },
  cameras: { card: 'hg-cameras-card', i: 'mdi:cctv', n: hgTLazy('studio.w.cameras'), def: { w: 4, h: 3 }, min: { w: 2, h: 2 }, max: { w: 12, h: 5 },
    pick: (M) => (M && M.cams && M.cams[0]) || null, cfg: (e, s) => ({ entities: (s && s.entities && s.entities.length ? s.entities : [e]), studio: true, max: 3, view_all: true, view_all_path: HG_P('kamery') }) },
  energy: { card: 'hg-studio-energy-card', i: 'mdi:lightning-bolt-outline', n: hgTLazy('studio.w.energy'), def: { w: 5, h: 3 }, min: { w: 2, h: 2 }, max: { w: 8, h: 5 },
    pick: (M) => (M && M.power && M.power[0]) || null, cfg: (e) => ({ entity: e }) },
  scenes: { card: 'hg-scenes-card', i: 'mdi:palette-outline', n: hgTLazy('studio.w.scenes'), def: { w: 4, h: 3 }, min: { w: 2, h: 2 }, max: { w: 12, h: 4 },
    pick: (M) => (M && M.scenes && M.scenes[0]) || null,
    cfg: (e, s, h) => ({ studio: true, scripts: ((s && s.entities && s.entities.length ? s.entities : [e])).map((x) => { const a = (h && h.states && h.states[x] && h.states[x].attributes) || {};
      return { entity: x, name: a.friendly_name || x, icon: a.icon || (x.startsWith('scene.') ? 'mdi:palette' : 'mdi:play') }; }) }) },
};
/* układ startowy (12 kol., jak makieta): [typ, x, y] */
const HG_STUDIO_SEED = [['greeting', 0, 0], ['weather', 5, 0], ['climate', 8, 0], ['home', 0, 4], ['media', 5, 4], ['cameras', 8, 4], ['energy', 0, 7], ['scenes', 5, 7]];
const hgStudioSeed = (M, hass) => {
  const items = HG_STUDIO_SEED.map(([type, x, y]) => { const d = HG_STUDIO_W[type], e = d.pick(M, hass);
    const settings = e ? { entity: e, ...(type === 'cameras' ? { entities: (M.cams || []).slice(0, 4) } : {}), ...(type === 'scenes' ? { entities: (M.scenes || []).slice(0, 6) } : {}), ...(type === 'weather' && M.sun ? { sun: M.sun } : {}) } : {};
    return { id: 'w_' + type, type, x, y, w: d.def.w, h: d.def.h, minW: d.min.w, minH: d.min.h, maxW: d.max.w, maxH: d.max.h, hidden: !e, settings }; });
  return { v: 1, items: typeof HGGrid !== 'undefined' && HGGrid.norm ? HGGrid.norm(items, 12) : items, bps: {}, custom: 0 };
};
/* seed tylko raz: po wczytaniu układu, bez błędu i bez klucza studio; istniejącego nigdy nie nadpisuje. Zwraca, czy zasiał. */
const hgStudioEnsure = (L, M, hass) => { if (!L || !L.loaded || L.failed || !L.data || L.data.studio) return false; L.data.studio = hgStudioSeed(M, hass); return true; };
