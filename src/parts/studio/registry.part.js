/* studio/registry: rejestr widżetów widoku Studio (typ, ikona, nazwa, rozmiary, dobór encji, konfiguracja karty). */
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
