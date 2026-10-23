/* ===== home-glass (wersja dystrybucyjna): baza zasobów, ścieżki, i18n, strategia pulpitu, kreator pierwszego uruchomienia ===== */
const HG_ASSET = (() => { try { const u = import.meta.url; if (u) return u.replace(/[^/]*([?#].*)?$/, ''); } catch (e) { /* brak */ }
  try { const s = document.currentScript && document.currentScript.src; if (s) return s.replace(/[^/]*(\?.*)?$/, ''); } catch (e) { /* brak */ }
  const r = [...document.querySelectorAll('script[src*="home-glass"]')].map((x) => x.src)[0]; return r ? r.replace(/[^/]*(\?.*)?$/, '') : '/hacsfiles/home-glass/'; })();
/* baza zasobów bez adresu serwera (np. /hacsfiles/nuvio/ albo /local/nuvio/): tak zapisywane są wbudowane tła, żeby działały
   na każdym urządzeniu niezależnie od adresu, pod którym otwiera ono HA (IP, domena, Nabu Casa). Inny serwer (CDN): pełny adres */
const HG_ASSET_P = window.HG_ASSET_P = (() => { try { const u = new URL(HG_ASSET, location.href); return u.origin === location.origin ? u.pathname : HG_ASSET; } catch (e) { return HG_ASSET; } })();
/* wbudowane tło (nuvio-bg-*.webp, też stare assets/bg/ i assets/backgrounds/) zapisane z dowolnym adresem albo ścieżką -> bieżąca baza paczki.
   Inne adresy (wgrane /api/image/serve, /local/…, https://…) bez zmian */
const hgBgFix = window.hgBgFix = (u) => (typeof u === 'string' ? u.replace(/^(?:[a-z][a-z0-9+.-]*:\/\/[^/]+)?(?:\/[^?#\s]*)?\/(?:assets\/(?:backgrounds|bg)\/|nuvio-bg-)([a-z0-9-]+\.webp)(?:[?#].*)?$/i, (m, f) => HG_ASSET_P + 'nuvio-bg-' + f) : u);
/* zapas z CDN (jsDelivr, przypięty do tagu działającej wersji): gdy plik obok paczki się nie wczyta; lokalny pierwszy (offline) */
const hgCdn = window.hgCdn = (u) => { try { const v = String(HG_BUILD).split('+')[0]; if (!/^\d+\.\d+\.\d+$/.test(v) || typeof u !== 'string') return ''; const base = u.startsWith(HG_ASSET) ? HG_ASSET : u.startsWith(HG_ASSET_P) ? HG_ASSET_P : null; if (!base) return '';
  return 'https://cdn.jsdelivr.net/gh/kczepiec/nuvio@v' + v + '/dist/' + u.slice(base.length).replace(/[?#].*$/, ''); } catch (e) { return ''; } };
window.__hgNoVer = true;   /* wersję pilnuje HACS (hacstag) – bez własnego komunikatu o nowej wersji */
const HG_DASH = () => (location.pathname.split('/')[1] || 'home-glass');
const HG_P = (v) => `/${HG_DASH()}/${v}`;
/* ===== Wspólny dashboard: jeden układ dla wszystkich użytkowników HA, ustawiany przez admina.
   Zapis: konfiguracja ukrytego pulpitu „nuvio-shared” (lovelace/config: odczyt każdy, zapis tylko admin) { nuvio_shared, own: [user_id], data: jak HGL.data }.
   Osobny pulpit, bo zapis konfiguracji pulpitu Nuvio pokazywałby innym komunikat „konfiguracja się zmieniła” i przebudowywał widoki.
   own = użytkownicy z własnym układem (frontend/user_data, sami edytują; zaczynają od kopii wspólnego). Bez pulpitu wspólnego: każdy ma własny (jak przed 1.4.0).
   PERS = sekcje zawsze osobiste (ustawienia Assist). */
const HGShared = window.__hgShared || (window.__hgShared = {
  URL: 'nuvio-shared', KEY: 'home_glass_layout', PERS: ['assist'],
  cl(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); },
  async doc(h) { try { const c = await h.callWS({ type: 'lovelace/config', url_path: this.URL }); return c && c.nuvio_shared ? c : null; } catch (e) { return null; } },
  async user(h) { try { const r = await h.callWS({ type: 'frontend/get_user_data', key: this.KEY }); const v = r && r.value; return v && v.s ? v : null; } catch (e) { return null; } },
  isOwn(h, doc) { const id = h && h.user && h.user.id; return !doc || (Array.isArray(doc.own) && doc.own.includes(id)); },
  /* układ, który widzi zalogowana osoba: { mode: 'shared' | 'own', doc, user, data, seeded } */
  async eff(h) { const [doc, user] = await Promise.all([this.doc(h), this.user(h)]);
    if (!this.isOwn(h, doc)) { const data = this.cl(doc.data && doc.data.s ? doc.data : { v: 1, ts: 0, s: {} });
      for (const k of this.PERS) { if (user && user[k] !== undefined) data[k] = user[k]; else delete data[k]; }
      return { mode: 'shared', doc, user, data, seeded: false }; }
    if (user) return { mode: 'own', doc, user, data: user, seeded: false };
    const seed = doc && doc.data && doc.data.s ? this.cl(doc.data) : null; if (seed) for (const k of this.PERS) delete seed[k];
    return { mode: 'own', doc, user, data: seed, seeded: !!seed }; },
  async put(h, doc) { await h.callWS({ type: 'lovelace/config/save', url_path: this.URL, config: doc }); },
  /* pierwsze uruchomienie (admin): ukryty pulpit z układem admina jako wspólnym */
  async create(h, data) { const d = this.cl(data || { v: 1, ts: 0, s: {} }); for (const k of this.PERS) delete d[k]; delete d.uid;
    try { await h.callWS({ type: 'lovelace/dashboards/create', url_path: this.URL, title: String(hgTLazy('oss.shared.dashboard_title')), icon: 'mdi:account-group-outline', show_in_sidebar: false, require_admin: true, mode: 'storage' }); } catch (e) { /* już istnieje */ }
    if (await this.doc(h)) return null;
    const doc = { nuvio_shared: 1, own: [], data: d, views: [{ title: 'Nuvio', cards: [{ type: 'markdown', content: String(hgTLazy('oss.shared.dashboard_note')) }] }] };
    await this.put(h, doc); return doc; },
});
/* domyślne tło: zdjęcie CC0 dostarczane z pakietem (dist/nuvio-bg-default-*.webp, CREDITS.md); gdy się nie wczyta – gradient */
const HG_DEFAULT_BG_FB = window.HG_DEFAULT_BG_FB = { kind: 'gradient', v: '#' + '2E4257', v2: '#' + '0C1117' };
/* 10 teł do wyboru (CC0, dist/CREDITS.md); pierwsze = domyślne. Miniatury ~5 KB, pełne zdjęcia wczytywane dopiero po wyborze */
/* [id pliku, nazwa: hgTLazy (rozwiązywana przy użyciu, String(l) / szablon)] */
const HG_BG_SET = window.HG_BG_SET = window.HG_BG_SET || [['dom-w-lesie', hgTLazy('backgrounds.dom_w_lesie')], ['domek-nad-woda', hgTLazy('backgrounds.domek_nad_woda')], ['gwiazdzista-noc', hgTLazy('backgrounds.gwiazdzista_noc')], ['zachod-slonca', hgTLazy('backgrounds.zachod_slonca')], ['las-o-zmierzchu', hgTLazy('backgrounds.las_o_zmierzchu')],
  ['jasny-salon', hgTLazy('backgrounds.jasny_salon')], ['drewniane-wnetrze', hgTLazy('backgrounds.drewniane_wnetrze')], ['kuchnia', hgTLazy('backgrounds.kuchnia')], ['mglisty-las', hgTLazy('backgrounds.mglisty_las')], ['nad-mgla', hgTLazy('backgrounds.nad_mgla')]]
  .map(([id, l], i) => { const b = HG_ASSET_P + 'nuvio-bg-' + id; return i ? [b + '-wide.webp', l, b + '-portrait.webp', b + '-thumb.webp'] : ['', l, '', b + '-thumb.webp']; });
const HG_DEFAULT_BG = window.HG_DEFAULT_BG = window.HG_DEFAULT_BG || { kind: 'image', v: HG_ASSET_P + 'nuvio-bg-default-wide.webp', v2p: HG_ASSET_P + 'nuvio-bg-default-portrait.webp' };

/* język: pref (wybór) albo języki przeglądarki (każdy język z manifestu: pełny kod, sam język); nieobsługiwany -> angielski. h zostaje w podpisie dla zgodności wywołań */
const hgLang = (h, pref) => { const nav = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  return hgLangDetect(pref, pref ? [pref, ...nav] : nav); };   /* pref jak dotąd także w postaci pl-PL / PL_pl (sam język) */
/* osobisty wybór języka (Ustawienia → Język, menu użytkownika): '' = automatycznie. Kolejność: ten wybór, opcja language strategii, kreator, przeglądarka.
   Zapis w localStorage (od razu przy starcie) i w danych użytkownika HA (inne urządzenia). Lista języków = manifest katalogów (src/locales). */
const HGLang = window.__hgLangSel || (window.__hgLangSel = {
  KEY: 'home-glass:lang',
  get LIST() { return HGI18n.list(); },
  ok(v) { return this.LIST.some((x) => x[0] === v); },
  /* czytane przy każdym wyborze języka (hgCurLang): kopia w pamięci, localStorage tylko raz */
  get() { if (this._v === undefined) { let v = ''; try { v = localStorage.getItem(this.KEY); } catch (e) { v = ''; } this._v = this.ok(v) ? v : ''; } return this._v; },
  _w(v) { this._v = v; try { if (v) localStorage.setItem(this.KEY, v); else localStorage.removeItem(this.KEY); } catch (e) { /* tryb prywatny */ } },
  /* raz na sesję: wybór z innego urządzenia (dane użytkownika HA) wygrywa z kopią lokalną */
  sync(h, el) { if (this._s || !h || !h.callWS) return; this._s = 1;
    h.callWS({ type: 'frontend/get_user_data', key: this.KEY }).then((r) => { if (!r || !('value' in r) || r.value === undefined) return; const v = this.ok(r.value) ? r.value : ''; if (v !== this.get()) { this._w(v); this._apply(el); } }, () => {}); },
  set(h, v, el) { v = this.ok(v) ? v : ''; this._w(v); if (h && h.callWS) h.callWS({ type: 'frontend/set_user_data', key: this.KEY, value: v || null }).catch(() => {}); return this._apply(el); },
  /* najpierw katalog języka (bez mieszanego wyświetlania), potem odświeżenie; błąd katalogu -> angielski */
  _apply(el) { const c = hgCurLang(); return HGI18n.load(c).then((ok) => { HGI18n.code = ok ? c : 'en'; this.refresh(el); }); },
  /* bez przeładowania strony: HA generuje dashboard od nowa (etykiety nawigacji i widoków ze strategii), karty rysują się w nowym języku */
  refresh(el) { window.dispatchEvent(new CustomEvent('hg-lang')); if (!el || !el.isConnected) return; if (el._config && el._config._hgAuto) this.stale(el); else this._cr(el); },
  /* strona strategii z konfiguracją wygenerowaną w innym języku niż aktywny (_hgCode: katalog spóźniony > 3 s, zmiana języka): HA generuje ją od nowa.
     Jedno config-refresh na kod języka (kilka stron i refresh(el) w tej samej zmianie) */
  stale(el) { const c = el && el.isConnected && el._config; if (c && c._hgAuto && c._hgCode !== HGI18n.code && this._crc !== HGI18n.code) { this._crc = HGI18n.code; this._cr(el); } },
  _cr(el) { el.dispatchEvent(new Event('config-refresh', { bubbles: true, composed: true })); },
});

/* --- model domu z rejestrów HA (bez żadnych encji „na sztywno”) --- */
const HGModel = {
  async load(hass) {
    let areas = hass.areas, devices = hass.devices, ents = hass.entities;
    try { if (!areas || !Object.keys(areas).length) { const a = await hass.callWS({ type: 'config/area_registry/list' }); areas = Object.fromEntries(a.map((x) => [x.area_id, x])); } } catch (e) { areas = areas || {}; }
    try { if (!ents || !Object.keys(ents).length) { const a = await hass.callWS({ type: 'config/entity_registry/list_for_display' }); ents = Object.fromEntries((a.entities || []).map((x) => [x.ei, { entity_id: x.ei, area_id: x.ai, device_id: x.di, hidden: !!x.hb, entity_category: x.ec != null ? x.ec : null }])); } } catch (e) { ents = ents || {}; }
    devices = devices || {};
    const ok = (e) => { const s = hass.states[e]; const r = ents[e]; return s && s.state !== 'unavailable' && !(r && (r.hidden || r.entity_category)); };
    const all = Object.keys(hass.states).filter(ok), dom = (d) => all.filter((e) => e.startsWith(d + '.'));
    const num = (e) => isFinite(Number(hass.states[e].state));
    const power = dom('sensor').filter((e) => { const a = hass.states[e].attributes; return a.device_class === 'power' && num(e) && /^(k?W)$/.test(a.unit_of_measurement || ''); })
      .sort((a, b) => Math.abs(Number(hass.states[b].state)) - Math.abs(Number(hass.states[a].state)));
    const areaOf = (e) => { const r = ents[e]; return r && (r.area_id || (r.device_id && devices[r.device_id] && devices[r.device_id].area_id)) || null; };
    const roomCount = {}; for (const e of all) { const a = areaOf(e); if (a) roomCount[a] = (roomCount[a] || 0) + 1; }
    return { areas, devices, ents, all, roomCount, weather: dom('weather').slice().sort((a, b) => ((+(hass.states[b].attributes.supported_features) & 3) ? 1 : 0) - ((+(hass.states[a].attributes.supported_features) & 3) ? 1 : 0))[0] || null, climate: dom('climate'), media: dom('media_player'), cams: dom('camera'), persons: dom('person'), trackers: dom('device_tracker'), zones: dom('zone'), calendars: dom('calendar'),
      scenes: [...dom('scene'), ...dom('script')].slice(0, 6), power, vacuums: dom('vacuum'), alarm: dom('alarm_control_panel')[0] || null, sun: hass.states['sun.sun'] ? 'sun.sun' : null };
  },
};

/* układ własnego widoku: siatka / kolumny / masonry / panel (hero jak strona główna) + kolumny na telefon / tablet / komputer i maks. szerokość */
const HG_LAYS = [['grid', hgTLazy('oss.layouts.grid'), 'mdi:view-grid-outline', hgTLazy('oss.layouts.grid_desc')], ['cols', hgTLazy('oss.layouts.cols'), 'mdi:view-column-outline', hgTLazy('oss.layouts.cols_desc')],
  ['masonry', 'Masonry', 'mdi:view-dashboard-variant-outline', hgTLazy('oss.layouts.masonry_desc')], ['panel', 'Panel', 'mdi:view-agenda-outline', hgTLazy('oss.layouts.panel_desc')]];
const HG_HINT_MIN = 3;
const hgViewLay = (c, one) => { const n = (k, d) => Math.max(1, Math.min(6, +c[k] || d)), r = (k) => `repeat(${k}, minmax(0, 1fr))`, cm = n('cm', 1), ct = n('ct', 2), cd = n('cd', c.lay === 'panel' ? 2 : 3);
  return { scroll: true, columns: r(cd), auto_rows: 'auto', phone_columns: r(cm), tablet: { columns: r(ct) }, ...(c.lay === 'cols' ? { flow: 'cols' } : {}), ...(c.lay === 'masonry' ? { masonry: true } : {}), ...(!c.lay || c.lay === 'grid' ? { flow: 'grid' } : {}), ...(+c.mw ? { max_w: +c.mw } : {}) }; };
/* widok ukryty dla zalogowanej osoby: wiz.vu = { ścieżka: [user_id] } ze wspólnego dashboardu */
const hgViewOff = (hass, w) => { const id = hass && hass.user && hass.user.id, VU = (w && w.vu) || {}; return (p) => p !== 'dashboard' && !!id && Array.isArray(VU[p]) && VU[p].includes(id); };
/* --- generator konfiguracji (strategia pulpitu) --- */
async function hgGenerate(hass, opt) {
  opt = opt || {}; let wiz = opt._wiz || null;   /* _wiz: tylko testy */
  let E = null; if (!wiz) try { E = await HGShared.eff(hass); wiz = E.data && E.data.wiz; } catch (e) { /* brak */ }
  /* widoczność widoków per osoba (Wygląd → Widoki, wspólny dashboard): wiz.vu[ścieżka] = [user_id ukrytych]; Panel zawsze widoczny */
  const vOff = hgViewOff(hass, (E && E.doc && E.doc.data && E.doc.data.wiz) || wiz);
  /* nawigacja i tytuły widoków dopiero z katalogiem języka (maks. 3 s, potem angielski i hg-lang, gdy dotrze); model wczytywany równolegle */
  const lang = hgLang(hass, HGLang.get() || opt.language || hgWizLang(wiz)), [M0] = await Promise.all([HGModel.load(hass), HGI18n.ready(lang)]);
  /* _empty: tylko testy – symulacja instancji bez danych */
  const M = opt._empty ? Object.assign({}, M0, { weather: null, sun: null, climate: [], scenes: [], power: [], persons: [], media: [], cams: [], trackers: [], calendars: [] }) : M0;
  const want = (v) => (!wiz || !wiz.views || wiz.views.includes(v)) && !vOff(v);
  const V = [['dashboard', hgT('nav.panel'), 'mdi:view-dashboard-outline', true], ['rooms', hgT('nav.rooms'), 'mdi:sofa-outline', Object.keys(M.areas).length > 0 || !!(wiz && wiz.areas && (wiz.areas.virtual || []).length)],
    ['multimedia', hgT('nav.media'), 'mdi:play-box-multiple-outline', M.media.length > 0], ['kamery', hgT('nav.cams'), 'mdi:cctv', M.cams.length > 0],
    ['family', hgT('nav.family'), 'mdi:account-group-outline', M.persons.length > 0], ['energia', hgT('nav.energy'), 'mdi:lightning-bolt-outline', M.power.length > 0],
    ['mapa', hgT('nav.map'), 'mdi:map-outline', M.persons.length + M.trackers.length > 0], ['kalendarz', hgT('nav.calendar'), 'mdi:calendar-month-outline', M.calendars.length > 0],
    ...((wiz && wiz.custom) || []).map((c) => [c.p, c.n, c.i || 'mdi:view-grid-outline', true])]
    /* jawna lista z kreatora / Wyglądu: kolejność wg listy, widok włączony nawet bez encji; bez listy – tylko dostępne */
    .filter((x) => (wiz && wiz.views ? x[0] === 'dashboard' || wiz.views.includes(x[0]) : x[3]) && !vOff(x[0])).sort((a, b) => (wiz && wiz.views ? (a[0] === 'dashboard' ? -1 : b[0] === 'dashboard' ? 1 : wiz.views.indexOf(a[0]) - wiz.views.indexOf(b[0])) : 0));
  /* wiz.vx[path] = { i: ikona, sl: krótka etykieta (pasek telefonu), cd/ct: kolumny komputer/tablet, rail: false = bez paska bocznego, ro: kolejność w pasku } */
  const VX = (wiz && wiz.vx) || {}; for (const v of V) { const o = VX[v[0]]; if (o && /^mdi:[a-z0-9-]+$/.test(o.i || '')) v[2] = o.i; } window.hgViewNames = Object.fromEntries(V.map((v) => [v[0], v[1]]));
  const nav = (v) => ({ icon: v[2], label: v[1], ...(VX[v[0]] && VX[v[0]].sl ? { short: VX[v[0]].sl } : {}), action: { navigate: HG_P(v[0]) }, match: v[0] === 'rooms' ? [HG_P('rooms'), HG_P('pokoj')] : HG_P(v[0]) });
  /* licznik na zakładce: wiz.vx[widok].badge = { m: 'on' | 'active', d: domena } albo { m, e: [encje] } -> badge.count_on / count_active (tylko > 0) */
  const tabBadge = (p) => { const b = VX[p] && VX[p].badge; if (!b || !/^(on|active)$/.test(b.m)) return null;
    const e = Array.isArray(b.e) && b.e.length ? b.e.filter((x) => hass.states[x]) : /^[a-z_]+$/.test(b.d || '') ? Object.keys(hass.states).filter((x) => x.startsWith(b.d + '.')) : [];
    return e.length ? { [b.m === 'active' ? 'count_active' : 'count_on']: e } : null; };
  const tabs = V.slice(0, 5).map((v) => { const bd = tabBadge(v[0]); return { label: v[1], icon: v[2], path: HG_P(v[0]), ...(v[0] === 'rooms' ? { match: [HG_P('rooms'), HG_P('pokoj')] } : {}), ...(bd ? { badge: bd } : {}) }; });
  const set = { icon: 'mdi:cog-outline', label: hgT('nav.settings'), action: { navigate: '/config' }, match: '/config' };
  /* pasek telefonu: wiz.phone = do 4 ścieżek wybranych w Wygląd → Widoki; reszta trafia do „Więcej” */
  const PH = wiz && Array.isArray(wiz.phone) && wiz.phone.length ? wiz.phone.map((p) => V.find((v) => v[0] === p)).filter(Boolean).slice(0, 4) : V.slice(0, 4);
  const RV = V.filter((v) => !VX[v[0]] || VX[v[0]].rail !== false).map((v, i) => [v, VX[v[0]] && isFinite(+VX[v[0]].ro) && VX[v[0]].ro !== '' && VX[v[0]].ro != null ? +VX[v[0]].ro : 100 + i]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  /* wiz.railHide: pasek boczny znika razem z Ustawieniami niezależnie od przełączników widoków; widoki spoza zakładek u góry trafiają do menu profilu
     (droga powrotna do ustawień: menu profilu, ołówek, ?nuvio_settings) */
  const railOff = !!(wiz && wiz.railHide);
  const rail = railOff ? [] : [...RV.map(nav), set], phone = { main: PH.map(nav), more: [...V.filter((v) => !PH.includes(v)).map(nav), set] };
  /* pokoje: wiz.areas (Wygląd → Pokoje) = nazwy, ikony, kolejność, czujniki temp./wilg., pokoje własne z listą encji, CWU, schody */
  /* karty pokoi czytają wiz.areas na żywo (HGAreas.glob), więc zmiana w Wyglądzie działa bez przebudowy widoków */
  const areasCfg = { hide: (wiz && wiz.hiddenRooms) || [] };
  const HUB = wiz && wiz.hub;
  const WZ = (wiz && wiz.weather) || {}, wxE = (WZ.entity && hass.states[WZ.entity]) ? WZ.entity : M.weather;
  const weather = wxE ? { entity: wxE, ...(WZ.forecast_sensor ? { forecast_sensor: WZ.forecast_sensor } : {}),  sun: M.sun, hours: 24, variant: 'hero', title: hgT('nav.outside') } : null;
  const brand = (hass.config && hass.config.location_name) || hgT('nav.home');
  const base = (view, title, sub, cards, panel, extra) => ({ type: 'custom:hg-page', view, brand, title, subtitle: sub, user: {}, tabs, rail, phone_nav: phone, rail_overflow: V.slice(5).map((v) => v[1]),
    menu: [...(railOff ? V.slice(5).map((v) => ({ label: v[1], icon: v[2], action: { navigate: HG_P(v[0]) } })) : []), { label: hgT('nav.profile'), icon: 'mdi:account-circle-outline', action: { navigate: '/profile' } }, { label: hgT('nav.settings'), icon: 'mdi:cog-outline', action: { navigate: '/config/dashboard' } }, { label: hgT('nav.discord'), icon: 'mdi:discord', svg: 'discord', action: { url: 'https://discord.gg/rFG9y2hFMJ' } }],
    hub: HUB === false ? null : HUB && typeof HUB === 'object' && (HUB.persons || M.persons).length ? { title: HUB.title || hgT('nav.hub'), subtitle: HUB.subtitle ?? hgT('nav.hub_sub'), persons: HUB.persons || M.persons.slice(0, 6), ...(want('family') ? { plus: { navigate: HG_P('family') } } : {}) } : M.persons.length ? { title: hgT('nav.hub'), subtitle: hgT('nav.hub_sub'), persons: M.persons.slice(0, 6), ...(want('family') ? { plus: { navigate: HG_P('family') } } : {}) } : null,
    back: { back: true, fallback: HG_P('dashboard') }, panel, cards, panel_backdrop: true, background: {}, _hgAuto: true, _hgLang: lang, _hgCode: HGI18n.code, _hgLangOpt: opt.language || '', ...(extra || {}) });
  const scroll = { scroll: true, columns: '1fr 1fr', auto_rows: 'auto', phone_columns: '1fr', tablet: { columns: '1fr 1fr' } };
  const one = (a) => ({ wide: true, scroll: true, columns: '1fr', auto_rows: 'auto', areas: `"${a}"`, phone_areas: `"${a}"`, phone_columns: '1fr', tablet: { columns: '1fr' } });
  const dash = [];
const hint = (k) => ({ type: 'custom:hg-hint-card', hint: k });
    if (!M.weather) dash.push(hint('weather'));
  if (M.climate[0]) dash.push({ type: 'custom:hg-ac-card', entity: M.climate[0], title: hgT('nav.climate'), min_h: 253 });
  if (M.scenes.length) dash.push({ type: 'custom:hg-scenes-card', _hgid: 'scenes', title: hgT('nav.scenes'), min_h: 0, scripts: M.scenes.map((e) => ({ entity: e, name: (hass.states[e].attributes.friendly_name || e), icon: hass.states[e].attributes.icon || (e.startsWith('scene.') ? 'mdi:palette' : 'mdi:play') })) });
  if (M.power.length) dash.push({ type: 'custom:hg-power-card', _hgid: 'power', title: hgT('nav.power'), min_h: 130, entities: [M.power[0]], max_power: 10000, hours: 6, ...(want('energia') ? { expand: { navigate: HG_P('energia') } } : {}) });
  if (!M.scenes.length) dash.push(hint('scenes'));
  if (!M.power.length) dash.push(hint('power'));
  if (!M.persons.length) dash.push(hint('people'));
  const views = [];
  const view = (path, title, card, sub) => ({ title, path, type: 'panel', ...(sub ? { subview: true } : {}), cards: [card] });
  views.push(view('dashboard', hgT('nav.panel'), base('dashboard', hgT('nav.hello', { name: '{name}' }), hgT('nav.hello_sub'), dash, scroll, { ...(weather ? { weather } : {}), ...(wiz && Array.isArray(wiz.fuel) && wiz.fuel.length ? { fuel: wiz.fuel.filter((f) => f && f.entity) } : {}) })));
  if (V.some((v) => v[0] === 'rooms')) {
    views.push(view('rooms', hgT('nav.rooms'), base('rooms', hgT('nav.rooms'), hgT('nav.rooms_sub'), [{ type: 'custom:hg-areas-card', area: 'grid', min_h: 200, room_path: HG_P('pokoj'), areas: areasCfg }], one('grid'))));
    views.push(view('pokoj', hgT('nav.room'), base('pokoj', hgT('nav.room'), '', [{ type: 'custom:hg-room-card', area: 'room', min_h: 200, areas: areasCfg }], one('room'), { room_back: HG_P('rooms'), room_head: true }), true));
  }
  if (V.some((v) => v[0] === 'multimedia')) views.push(view('multimedia', hgT('nav.media'), base('multimedia', hgT('nav.media'), hgT('nav.media_sub'), [M.media.length ? { type: 'custom:hg-players-card', area: 'm', entities: M.media } : { ...hint('media'), area: 'm' }], one('m'))));
  if (V.some((v) => v[0] === 'kamery')) views.push(view('kamery', hgT('nav.cams'), base('kamery', hgT('nav.cams'), hgT('nav.cams_sub'), [M.cams.length ? { type: 'custom:hg-cameras-card', area: 'c', entities: M.cams } : { ...hint('cams'), area: 'c' }], one('c'))));
  if (V.some((v) => v[0] === 'family')) views.push(view('family', hgT('nav.family'), base('family', hgT('nav.family'), hgT('nav.family_sub'), (M.persons.length ? M.persons.map((p) => ({ type: 'custom:hg-person-card', entity: p })) : [hint('people')]), scroll)));
  /* przepływ energii na górze widoku Energia, gdy widać sieć i panele albo baterię (zgadywanie po nazwach) */
  const hgFlowAuto = (h) => { const g = hgFlowGuess(h); return g.grid && (g.solar || g.batteries.length) ? [{ type: 'custom:hg-flow-card', span: 'full', min_h: 300, ...Object.fromEntries(Object.entries(g).filter(([, v]) => v && (!Array.isArray(v) || v.length))) }] : []; };
  if (V.some((v) => v[0] === 'energia')) views.push(view('energia', hgT('nav.energy'), base('energia', hgT('nav.energy'), hgT('nav.energy_sub'), (M.power.length ? [...hgFlowAuto(hass), ...M.power.slice(0, 4).map((e) => ({ type: 'custom:hg-power-card', title: hass.states[e].attributes.friendly_name || e, entities: [e], max_power: 10000, hours: 24 }))] : [hint('power')]), scroll)));
  if (V.some((v) => v[0] === 'mapa')) { const ents = [...M.persons, ...M.trackers.slice(0, 12), ...(M.zones.includes('zone.home') ? ['zone.home'] : [])];
    views.push(view('mapa', hgT('nav.map'), base('mapa', hgT('nav.map'), hgT('nav.map_sub'), [ents.length ? { type: 'custom:hg-map-card', area: 'm', min_h: 560, title: hgT('nav.map'), entities: ents, theme_mode: 'auto', hours_to_show: 0 } : { ...hint('map'), area: 'm' }], one('m')))); }
  if (V.some((v) => v[0] === 'kalendarz')) views.push(view('kalendarz', hgT('nav.calendar'), base('kalendarz', hgT('nav.calendar'), hgT('nav.cal_sub'), (M.calendars.length
    ? [{ type: 'custom:hg-month-card', calendars: M.calendars, min_h: 380 }, { type: 'custom:hg-agenda-card', calendars: M.calendars, days: 14, min_h: 380 }] : [hint('calendar')]), scroll)));
  for (const c of (wiz && wiz.custom) || []) if (V.some((v) => v[0] === c.p)) views.push(view(c.p, c.n, base(c.p, c.n, c.s || '', [{ ...hint('custom'), hint_sc: c.p + ':tiles', min_h: 150, span: 'full' }], hgViewLay(c, one), c.lay === 'panel' && weather ? { weather } : {})));
  views.sort((a, b) => (a.subview ? 1 : 0) - (b.subview ? 1 : 0) || V.findIndex((v) => v[0] === a.path) - V.findIndex((v) => v[0] === b.path));
  /* kolumny widoku z Wyglądu (wiz.vx[path].cd / ct) – także dla widoków wbudowanych; widoki z jednym obszarem (areas) zostają bez zmian */
  const rp = (n) => `repeat(${Math.max(1, Math.min(6, n))}, minmax(0, 1fr))`;
  for (const v of views) { const o = VX[v.path], pg = v.cards && v.cards[0], P = pg && pg.panel; if (!o || !P || P.areas) continue;
    if (+o.cd) P.columns = rp(+o.cd); if (+o.ct) P.tablet = Object.assign({}, P.tablet, { columns: rp(+o.ct) }); }
  if (wiz && (wiz.hubPos === 'right' || wiz.hubPos === 'left')) for (const v of views) { const pg = v.cards && v.cards[0]; if (pg && pg.hub) pg.hub = Object.assign({}, pg.hub, { pos: wiz.hubPos }); }
  return { title: brand, views, _hgWizard: !wiz, ...(opt.kiosk_mode ? { kiosk_mode: opt.kiosk_mode } : {}) };
}

/* --- puste stany: zamiast pustego szkła podpowiedź, co dodać (integracja, krótki opis, przyciski) --- */
const HG_HINTS = {
  weather: { icon: 'mdi:weather-partly-cloudy', t: hgTLazy('common.weather'), d: hgTLazy('oss.hints.weather_desc'), domain: 'met', comp: 'weather' },
  power: { icon: 'mdi:lightning-bolt-outline', t: hgTLazy('oss.hints.power_title'), d: hgTLazy('oss.hints.power_desc'), href: '/config/energy', hl: hgTLazy('oss.hints.power_link'), comp: 'power' },
  scenes: { icon: 'mdi:palette-outline', t: hgTLazy('oss.hints.scenes_title'), d: hgTLazy('oss.hints.scenes_desc'), href: '/config/scene/dashboard', hl: hgTLazy('oss.hints.scenes_link'), comp: 'scenes' },
  climate: { icon: 'mdi:thermostat', t: hgTLazy('oss.hints.climate_title'), d: hgTLazy('oss.hints.climate_desc'), comp: 'climate' },
  media: { icon: 'mdi:play-box-multiple-outline', t: hgTLazy('common.media'), d: hgTLazy('oss.hints.media_desc'), domain: 'cast', comp: 'players' },
  cams: { icon: 'mdi:cctv', t: hgTLazy('oss.hints.cams_title'), d: hgTLazy('oss.hints.cams_desc'), domain: 'onvif', comp: 'cameras' },
  people: { icon: 'mdi:account-group-outline', t: hgTLazy('common.household'), d: hgTLazy('oss.hints.people_desc'), href: '/config/person', hl: hgTLazy('oss.hints.add_person'), comp: 'people' },
  map: { icon: 'mdi:map-outline', t: hgTLazy('common.map'), d: hgTLazy('oss.hints.map_desc'), href: '/config/person', hl: hgTLazy('oss.hints.add_person'), comp: 'map' },
  calendar: { icon: 'mdi:calendar-month-outline', t: hgTLazy('common.calendar'), d: hgTLazy('oss.hints.calendar_desc'), domain: 'local_calendar', comp: 'agenda' },
  custom: { icon: 'mdi:view-grid-plus-outline', t: hgTLazy('oss.hints.custom_title'), s: hgTLazy('oss.hints.custom_sub'), d: hgTLazy('oss.hints.custom_desc'), add: 1 },
  fuel: { icon: 'mdi:gas-station-outline', t: hgTLazy('common.fuel_prices'), d: hgTLazy('oss.hints.fuel_desc'), href: '/config/integrations/dashboard', hl: hgTLazy('oss.hints.fuel_link') },
};
const HG_HINT_CSS = `:host{ display:block; } .hn{ box-sizing:border-box; height:100%; min-height:150px; display:flex; flex-direction:column; gap:12px; padding:16px; border-radius:16px; color:var(--primary-text-color, inherit);
  background:var(--hg-glass-lite, var(--hg-glass-bg, rgba(255,255,255,.12))); -webkit-backdrop-filter:var(--hg-bfo, blur(calc(var(--hg-glass-blur, 14px) * var(--hg-bf, 1))) saturate(var(--hg-glass-sat, 180%))); backdrop-filter:var(--hg-bfo, blur(calc(var(--hg-glass-blur, 14px) * var(--hg-bf, 1))) saturate(var(--hg-glass-sat, 180%))); box-shadow:var(--hg-card-sh, 0 10px 30px rgba(0,0,0,.18)); font-family:'DM Sans', system-ui, sans-serif; }
.hd{ display:flex; gap:12px; align-items:center; } .ic{ flex:none; width:36px; height:36px; border-radius:10px; display:grid; place-items:center; background:color-mix(in srgb, var(--hg-accent, #63D71E) 18%, transparent); color:var(--hg-accent-tx, var(--hg-accent, #63D71E)); } .ic ha-icon{ width:24px; height:24px; --mdc-icon-size:24px; }
b{ font-size:15px; font-weight:600; } small{ display:block; font-size:12px; opacity:.66; margin-top:2px; } p{ margin:0; font-size:13px; line-height:1.5; opacity:.8; flex:1; text-wrap:pretty; }
.bt{ display:flex; flex-wrap:wrap; gap:8px; } button, a{ all:unset; cursor:pointer; box-sizing:border-box; height:36px; padding:0 16px; border-radius:999px; display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:500; background:color-mix(in srgb, currentColor 8%, transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent); transition:background-color 150ms, transform 150ms; } button:active, a:active{ transform:scale(.96); }
.ok{ background:var(--hg-accent, #63D71E); color:var(--hg-on-accent, #0B0F0A); font-weight:600; box-shadow:none; } .gh{ background:none; box-shadow:none; opacity:.7; margin-left:auto; } button:focus-visible, a:focus-visible{ outline:2px solid var(--hg-accent, #63D71E); outline-offset:2px; } ha-icon{ width:18px; height:18px; --mdc-icon-size:18px; }`;
class HGHintCard extends HTMLElement {
  setConfig(c) { this._c = c || {}; this._r = 0; if (!this.shadowRoot) this.attachShadow({ mode: 'open' }); }
  getCardSize() { return 3; }
  /* podpowiedź zostaje, dopóki widok ma mniej niż HG_HINT_MIN elementów (pusty panel z jednym wierszem wyglądał na zepsuty) */
  _hk() { return this._c.hint_sc && typeof HGL !== 'undefined' && HGL.data ? ((HGL.get(this._c.hint_sc).added || []).length >= HG_HINT_MIN ? 1 : 0) : 0; }
  set hass(h) { this._h = h; const k = this._hk(); if (!this._r || k !== this._k) { this._k = k; this._r = 0; this._draw(); } }
  connectedCallback() { if (this._h) { this._r = 0; this._k = this._hk(); requestAnimationFrame(() => this._draw()); } }
  _hidden() { const w = (typeof HGL !== 'undefined' && HGL.data && HGL.data.wiz) || {}; return !!(w.hints && w.hints[this._c.hint] === 0); }
  _wrap(v) { const w = this.parentElement; if (this._c.hint_sc && w && w.classList.contains('cw')) w.style.display = v; }
  _draw() { const c = this._c, D = Object.assign({}, HG_HINTS[c.hint] || {}, c), h = this._h; if (!h) return; this._r = 1;
    if (this._hidden() || (c.hint_sc && typeof HGL !== 'undefined' && HGL.data && (HGL.get(c.hint_sc).added || []).length >= HG_HINT_MIN)) { this.style.display = 'none'; this.shadowRoot.innerHTML = ''; this._wrap('none'); return; } this.style.display = ''; this._wrap('');
    const C = D.comp && typeof HG_COMP !== 'undefined' && HG_COMP.find((x) => x.id === D.comp), sl = C && C.slots.find((x) => x.req), pick = sl && typeof hgSlotCands === 'function' && hgSlotCands(h, sl).length;
    const admin = typeof HGL !== 'undefined' ? HGL.canEdit(h) : !!(h.user && h.user.is_admin);
    this.shadowRoot.innerHTML = `<style>${HG_HINT_CSS}</style><div class="hn" role="note"><div class="hd"><span class="ic">${H.icon(D.icon || 'mdi:information-outline')}</span><span><b>${H.esc(D.t || '')}</b><small>${H.esc(D.s || hgT('oss.hints.no_data'))}</small></span></div><p>${H.esc(D.d || '')}</p>
      ${admin ? `<div class="bt">${D.add ? `<button class="ok" data-a="add">${H.icon('mdi:plus')}${hgT('common.add_widget')}</button>` : ''}${pick ? `<button class="ok" data-a="pick">${H.icon('mdi:swap-horizontal')}${hgT('oss.hints.choose_entity')}</button>` : ''}${D.domain ? `<a class="${pick ? '' : 'ok'}" href="https://my.home-assistant.io/redirect/config_flow_start/?domain=${encodeURIComponent(D.domain)}" target="_blank" rel="noopener">${H.icon('mdi:plus')}${hgT('oss.hints.add_integration')}</a>` : ''}${D.href ? `<button class="${pick || D.domain ? '' : 'ok'}" data-a="go">${H.icon('mdi:cog-outline')}${H.esc(D.hl || hgT('oss.hints.configure'))}</button>` : ''}${D.hacs ? `<button data-a="hacs">${H.icon('mdi:download')}${hgT('oss.install_in_hacs')}</button>` : ''}${D.add ? '' : `<button class="gh" data-a="hide">${hgT('common.hide')}</button>`}</div>` : ''}</div>`;
    if (!this._wired) { this._wired = 1; this.shadowRoot.addEventListener('click', (e) => this._click(e)); } }
  async _click(e) { const D = Object.assign({}, HG_HINTS[this._c.hint] || {}, this._c), h = this._h; { const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
      if (a === 'go') { history.pushState(null, '', D.href); window.dispatchEvent(new CustomEvent('location-changed')); }
      if (a === 'hacs') hgHacsOpen(h, D.hacs.rid, D.hacs.repo);
      if (a === 'hide' && !D.add) { const w = HGL.data.wiz = Object.assign({}, HGL.data.wiz || {}); w.hints = Object.assign({}, w.hints, { [D.hint]: 0 }); this._r = 0; this._draw(); try { await HGL.save(h); } catch (er) { /* offline */ } }
      if (a === 'add') { let n = this; while (n && n.tagName !== 'HG-PAGE' && n.tagName !== 'NUVIO-PAGE') n = n.parentNode || n.host; if (!n || !n._editEnter) return; n._editEnter(); n._eGallery(null, this._c.hint_sc || (n._pageScope() + ':tiles')); return; }
      if (a === 'pick') { let n = this; while (n && n.tagName !== 'HG-PAGE' && n.tagName !== 'NUVIO-PAGE') n = n.parentNode || n.host; if (!n || !n._editEnter) return; n._editEnter(); n._eGalSc = n._pageScope() + ':tiles'; n._eGalCt = null; n._eComp(D.comp); } } }
}
queueMicrotask(() => hgReg('hg-hint-card', HGHintCard, hgTLazy('oss.hint_card.name'), hgTLazy('oss.hint_card.desc')));
class HGStrategy extends HTMLElement { static async generate(config, hass) { return hgGenerate(hass, config || {}); } }
if (!customElements.get('ll-strategy-dashboard-home-glass')) customElements.define('ll-strategy-dashboard-home-glass', HGStrategy);
window.hgGenerate = hgGenerate;

/* --- kreator pierwszego uruchomienia (widoczny, gdy pulpit z strategii i brak zapisanych wyborów) --- */
const HG_WZ_AREA_IC = [[/salon|living|dzienn/i, 'mdi:sofa'], [/kuch|kitchen/i, 'mdi:stove'], [/sypial|bed/i, 'mdi:bed'], [/łaz|lazien|bath/i, 'mdi:shower'], [/biur|office|gabinet/i, 'mdi:desk'], [/gara/i, 'mdi:garage'], [/ogr|garden|taras/i, 'mdi:flower'], [/dzieci|kid|pok[oó]j/i, 'mdi:teddy-bear'], [/korytarz|hall|przedpok|schod/i, 'mdi:door'], [/kot[lł]own|piwn|basement/i, 'mdi:water-boiler']];
/* style kreatora: szkło jak w reszcie pulpitu (tło użytkownika + rozmycie), tokeny --fg/--gl/--ln przełączane klasą .lt (motyw jasny) */
const HG_WZ_CSS = `<style>
#hg-wiz{ --a:#63D71E; --fg:#EEF2F5; --mut:rgba(238,242,245,.66); --gl:linear-gradient(150deg, rgba(36,44,54,.66), rgba(16,21,28,.74)); --rl:rgba(0,0,0,.16); --tl:rgba(255,255,255,.055); --tlh:rgba(255,255,255,.09); --ln:rgba(255,255,255,.1); --hi:rgba(255,255,255,.2); --sh:0 40px 100px rgba(0,0,0,.5);
  position:fixed; inset:0; z-index:9999; display:grid; place-items:center; font-family:'DM Sans',system-ui,sans-serif; color:var(--fg); -webkit-font-smoothing:antialiased; }
#hg-wiz.lt{ --fg:#141A21; --mut:rgba(20,26,33,.62); --gl:linear-gradient(150deg, rgba(255,255,255,.72), rgba(240,244,248,.6)); --rl:rgba(255,255,255,.38); --tl:rgba(255,255,255,.5); --tlh:rgba(255,255,255,.75); --ln:rgba(20,26,33,.09); --hi:rgba(255,255,255,.9); --sh:0 40px 100px rgba(16,24,40,.28); }
#hg-wiz *{ box-sizing:border-box; } #hg-wiz.lt .sl, #hg-wiz.lt .eb{ color:color-mix(in srgb, var(--a) 62%, #000); }
#hg-wiz .bgx{ position:absolute; inset:-30px; background-size:cover; background-position:center; filter:blur(18px) saturate(1.15); transform:scale(1.04); transition:background-image .6s; }
#hg-wiz .bgx::after{ content:''; position:absolute; inset:0; background:radial-gradient(120% 90% at 50% 40%, rgba(6,9,12,.28), rgba(6,9,12,.72)); } #hg-wiz.lt .bgx::after{ background:radial-gradient(120% 90% at 50% 40%, rgba(244,247,250,.2), rgba(232,238,244,.62)); }
#hg-wiz .orb{ position:absolute; width:46vmax; height:46vmax; border-radius:50%; background:radial-gradient(closest-side, color-mix(in srgb, var(--a) 34%, transparent), transparent); filter:blur(30px); opacity:.55; pointer-events:none; animation:wzorb 18s ease-in-out infinite alternate; }
#hg-wiz .orb.o1{ left:-14vmax; top:-18vmax; } #hg-wiz .orb.o2{ right:-16vmax; bottom:-20vmax; opacity:.35; animation-duration:24s; animation-direction:alternate-reverse; } #hg-wiz.lt .orb{ opacity:.4; }
@keyframes wzorb{ to{ transform:translate(6vmax, 4vmax) scale(1.08); } }
#hg-wiz .w{ position:relative; width:min(1040px, calc(100vw - 48px)); height:min(660px, calc(100dvh - 48px)); border-radius:32px; background:var(--gl); backdrop-filter:var(--hg-bfo, blur(32px) saturate(170%)); -webkit-backdrop-filter:var(--hg-bfo, blur(32px) saturate(170%));
  box-shadow:inset 0 1px 0 var(--hi), inset 0 0 0 1px var(--ln), var(--sh); display:grid; grid-template-columns:268px minmax(0,1fr); overflow:hidden; animation:wzpop .6s cubic-bezier(.16,1,.3,1) both; }
#hg-wiz .w.hr{ grid-template-columns:minmax(0,1fr); }
@keyframes wzpop{ from{ opacity:0; transform:translateY(18px) scale(.97); } }
#hg-wiz button{ all:unset; cursor:pointer; box-sizing:border-box; font:inherit; -webkit-tap-highlight-color:transparent; } #hg-wiz button:focus-visible{ outline:2px solid var(--a); outline-offset:3px; }
#hg-wiz ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; flex:none; }
/* przyciski */
#hg-wiz .b{ height:48px; padding:0 22px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:15px; font-weight:500; color:var(--fg); background:var(--tl); box-shadow:inset 0 0 0 1px var(--ln); transition:transform .2s cubic-bezier(.16,1,.3,1), background .2s, box-shadow .2s; }
#hg-wiz .b:hover{ background:var(--tlh); } #hg-wiz .b:active{ transform:scale(.97); } #hg-wiz .b.gh{ background:transparent; box-shadow:none; color:var(--mut); padding:0 14px; } #hg-wiz .b.gh:hover{ color:var(--fg); background:var(--tl); }
#hg-wiz .b.ok{ position:relative; overflow:hidden; background:var(--a); color:var(--on,#0B0F0A); font-weight:600; padding:0 26px; box-shadow:0 10px 30px color-mix(in srgb, var(--a) 42%, transparent), inset 0 1px 0 rgba(255,255,255,.35); }
#hg-wiz .b.ok:hover{ transform:translateY(-1px); box-shadow:0 14px 36px color-mix(in srgb, var(--a) 52%, transparent), inset 0 1px 0 rgba(255,255,255,.35); } #hg-wiz .b.ok:active{ transform:scale(.97); }
#hg-wiz .b.ok::after{ content:''; position:absolute; inset:0; background:linear-gradient(105deg, transparent 35%, rgba(255,255,255,.35) 50%, transparent 65%); transform:translateX(-120%); animation:wzsheen 3.6s ease-in-out 1.2s infinite; }
@keyframes wzsheen{ 0%,70%{ transform:translateX(-120%); } 100%{ transform:translateX(120%); } }
#hg-wiz .b.ok ha-icon{ transition:transform .25s cubic-bezier(.16,1,.3,1); } #hg-wiz .b.ok:hover ha-icon{ transform:translateX(3px); }
/* ekran powitalny: tekst na szkle, podgląd obok (bez zdjęcia pod tekstem) */
#hg-wiz .hero{ display:grid; grid-template-columns:minmax(0,1.05fr) minmax(0,1fr); gap:40px; align-items:center; padding:56px 56px 56px 60px; height:100%; overflow:auto; }
#hg-wiz .lg{ width:56px; height:56px; border-radius:18px; display:grid; place-items:center; background:var(--a); color:var(--on,#0B0F0A); box-shadow:0 12px 32px color-mix(in srgb, var(--a) 45%, transparent), inset 0 1px 0 rgba(255,255,255,.4); } #hg-wiz .lg ha-icon{ --mdc-icon-size:30px; width:30px; height:30px; }
#hg-wiz .eb{ display:inline-block; margin:26px 0 12px; font-size:12px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--a); }
#hg-wiz h1{ margin:0 0 14px; font-size:clamp(34px, 4.4vw, 50px); line-height:1.04; font-weight:700; letter-spacing:-.025em; }
#hg-wiz h1 em{ font-style:normal; background:linear-gradient(100deg, var(--a), color-mix(in srgb, var(--a) 55%, #fff)); -webkit-background-clip:text; background-clip:text; color:transparent; } #hg-wiz.lt h1 em{ background:linear-gradient(100deg, color-mix(in srgb, var(--a) 80%, #000), var(--a)); -webkit-background-clip:text; background-clip:text; }
#hg-wiz .hx p{ margin:0 0 22px; font-size:16.5px; line-height:1.55; color:var(--mut); max-width:440px; }
#hg-wiz .chips{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:34px; } #hg-wiz .chips span{ font-size:13px; padding:7px 13px; border-radius:999px; background:var(--tl); box-shadow:inset 0 0 0 1px var(--ln); display:inline-flex; gap:7px; align-items:center; } #hg-wiz .chips ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; color:var(--a); }
#hg-wiz .cta{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
#hg-wiz .hv{ perspective:1200px; } #hg-wiz .hv .pv{ transform:rotateY(-9deg) rotateX(4deg); box-shadow:0 30px 70px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.22); animation:wzfloat 7s ease-in-out infinite; }
@keyframes wzfloat{ 0%,100%{ transform:rotateY(-9deg) rotateX(4deg) translateY(0); } 50%{ transform:rotateY(-6deg) rotateX(2deg) translateY(-10px); } }
#hg-wiz .hx > *{ animation:wzup .7s cubic-bezier(.16,1,.3,1) both; animation-delay:calc(var(--i, 0) * 70ms + 120ms); } #hg-wiz .hv{ animation:wzup .9s cubic-bezier(.16,1,.3,1) .3s both; }
/* pasek kroków (szyna po lewej) */
#hg-wiz .rl{ display:flex; flex-direction:column; padding:30px 22px 26px; background:var(--rl); box-shadow:inset -1px 0 0 var(--ln); }
#hg-wiz .br{ display:flex; align-items:center; gap:12px; font-size:18px; font-weight:700; letter-spacing:-.01em; margin:0 6px 34px; } #hg-wiz .br .lg{ width:38px; height:38px; border-radius:12px; } #hg-wiz .br .lg ha-icon{ --mdc-icon-size:22px; width:22px; height:22px; }
#hg-wiz .rl ol{ list-style:none; margin:0; padding:0; display:grid; gap:4px; position:relative; }
#hg-wiz .rl li > *{ display:flex; gap:12px; align-items:center; width:100%; padding:10px; border-radius:16px; transition:background .2s; } #hg-wiz .rl li button:hover{ background:var(--tl); } #hg-wiz .rl li.cu > *{ background:var(--tl); box-shadow:inset 0 0 0 1px var(--ln); }
#hg-wiz .rl .n{ width:30px; height:30px; border-radius:50%; flex:none; display:grid; place-items:center; font-size:13px; font-weight:600; box-shadow:inset 0 0 0 1.5px var(--ln); color:var(--mut); transition:background .3s, color .3s, box-shadow .3s; }
#hg-wiz .rl li.cu .n{ box-shadow:inset 0 0 0 2px var(--a); color:var(--fg); } #hg-wiz .rl li.dn .n{ background:var(--a); color:var(--on,#0B0F0A); box-shadow:none; } #hg-wiz .rl .n ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; }
#hg-wiz .rl b{ display:block; font-size:14.5px; font-weight:600; } #hg-wiz .rl li:not(.cu):not(.dn) b{ color:var(--mut); font-weight:500; } #hg-wiz .rl small{ display:block; font-size:12px; color:var(--mut); margin-top:1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
#hg-wiz .rl .nt{ margin-top:auto; padding:0 8px; font-size:12.5px; line-height:1.45; color:var(--mut); white-space:normal; max-width:none; }
/* treść kroku */
#hg-wiz .mn{ display:flex; flex-direction:column; min-height:0; min-width:0; }
#hg-wiz .pm{ display:none; }
#hg-wiz .bd{ flex:1; min-height:0; overflow:auto; padding:40px 44px 12px; scrollbar-width:thin; }
#hg-wiz .ft{ display:flex; gap:10px; align-items:center; padding:16px 44px 26px; box-shadow:inset 0 1px 0 var(--ln); } #hg-wiz .ft .sp{ flex:1; }
#hg-wiz .sl{ font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--a); display:block; margin-bottom:8px; }
#hg-wiz h2{ margin:0 0 8px; font-size:30px; line-height:1.15; font-weight:700; letter-spacing:-.02em; } #hg-wiz .hd p{ margin:0; font-size:15px; line-height:1.5; color:var(--mut); }
#hg-wiz .hd{ display:flex; gap:16px; align-items:flex-end; margin-bottom:24px; } #hg-wiz .hd > div{ flex:1; min-width:0; } #hg-wiz .hd .b{ height:38px; font-size:13.5px; padding:0 14px; flex:none; }
#hg-wiz .in .hd{ animation:wzin .5s cubic-bezier(.16,1,.3,1) both; } #hg-wiz .in.bk .hd{ animation-name:wzbk; }
#hg-wiz .in .st > *{ animation:wzup .55s cubic-bezier(.16,1,.3,1) both; animation-delay:calc(var(--i, 0) * 40ms + 60ms); }
@keyframes wzin{ from{ opacity:0; transform:translateX(26px); filter:blur(4px); } } @keyframes wzbk{ from{ opacity:0; transform:translateX(-26px); filter:blur(4px); } } @keyframes wzup{ from{ opacity:0; transform:translateY(14px) scale(.98); } }
/* kafelki wyboru */
#hg-wiz .g{ display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:12px; } #hg-wiz .g.two{ grid-template-columns:repeat(2, minmax(0,1fr)); }
#hg-wiz .c{ position:relative; display:flex; flex-direction:column; gap:6px; padding:12px; border-radius:22px; background:var(--tl); box-shadow:inset 0 0 0 1px var(--ln); transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s, background .25s; }
#hg-wiz .c:hover:not([aria-disabled=true]){ transform:translateY(-3px); background:var(--tlh); } #hg-wiz .c:active:not([aria-disabled=true]){ transform:scale(.97); }
#hg-wiz .c[aria-pressed=true]{ background:color-mix(in srgb, var(--a) 13%, var(--tl)); box-shadow:inset 0 0 0 2px var(--a), 0 12px 30px color-mix(in srgb, var(--a) 20%, transparent); } #hg-wiz .c[aria-disabled=true]{ opacity:.4; cursor:default; }
#hg-wiz .c b{ font-size:15px; font-weight:600; display:flex; gap:8px; align-items:center; padding:0 2px; } #hg-wiz .c small{ font-size:12.5px; color:var(--mut); padding:0 2px; } #hg-wiz .c b ha-icon{ color:var(--a); }
#hg-wiz .ck{ position:absolute; right:12px; top:12px; width:24px; height:24px; border-radius:50%; display:grid; place-items:center; box-shadow:inset 0 0 0 1.5px var(--ln); background:var(--tl); z-index:1; transition:background .2s, box-shadow .2s; }
#hg-wiz .c[aria-pressed=true] .ck{ background:var(--a); color:var(--on,#0B0F0A); box-shadow:none; } #hg-wiz .c.pop[aria-pressed=true] .ck{ animation:wzck .35s cubic-bezier(.34,1.56,.64,1); } #hg-wiz .ck ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; } #hg-wiz .c:not([aria-pressed=true]) .ck ha-icon{ opacity:0; }
@keyframes wzck{ from{ transform:scale(.4); } }
#hg-wiz .mv{ height:66px; border-radius:14px; background:rgba(0,0,0,.2); display:grid; gap:4px; padding:8px; margin-bottom:4px; } #hg-wiz .mv i{ border-radius:6px; background:rgba(255,255,255,.14); } #hg-wiz.lt .mv{ background:rgba(20,26,33,.06); } #hg-wiz.lt .mv i{ background:rgba(20,26,33,.09); }
#hg-wiz .mv i.a{ background:color-mix(in srgb, var(--a) 70%, transparent); } #hg-wiz .mv b.a{ background:var(--a); } #hg-wiz .c[aria-pressed=true] .mv i.a{ box-shadow:0 0 14px color-mix(in srgb, var(--a) 45%, transparent); }
#hg-wiz .ai{ width:48px; height:48px; border-radius:16px; display:grid; place-items:center; background:color-mix(in srgb, var(--a) 16%, transparent); color:var(--a); margin-bottom:6px; } #hg-wiz .ai ha-icon{ --mdc-icon-size:26px; width:26px; height:26px; }
#hg-wiz .c[aria-pressed=false] .ai{ background:var(--tl); color:var(--mut); }
#hg-wiz .lg2 .c{ flex-direction:row; align-items:center; gap:16px; padding:22px 20px; border-radius:24px; } #hg-wiz .fl{ font-size:38px; line-height:1; } #hg-wiz .lg2 .c b{ font-size:17px; } #hg-wiz .lg2 .c small{ display:block; margin-top:2px; }
/* wygląd */
#hg-wiz .lk{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr); gap:28px; align-items:start; }
#hg-wiz .lbl{ display:block; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--mut); margin-bottom:10px; }
#hg-wiz .sw{ display:flex; flex-wrap:wrap; gap:12px; margin:0 0 24px; } #hg-wiz .sw button{ width:40px; height:40px; border-radius:50%; background:var(--c); display:grid; place-items:center; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25), 0 6px 16px color-mix(in srgb, var(--c) 35%, transparent); transition:transform .25s cubic-bezier(.34,1.56,.64,1); }
#hg-wiz .sw button:hover{ transform:scale(1.1); } #hg-wiz .sw button[aria-pressed=true]{ box-shadow:0 0 0 3px var(--ln), 0 0 0 5px var(--c); transform:scale(1.08); } #hg-wiz .sw ha-icon{ color:#0B0F0A; }
#hg-wiz .bgs{ display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:10px; } #hg-wiz .bgs button{ aspect-ratio:1.2; border-radius:14px; background-size:cover; background-position:center; box-shadow:inset 0 0 0 1px rgba(255,255,255,.2); transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .2s; }
#hg-wiz .bgs button:hover{ transform:scale(1.05); } #hg-wiz .bgs button[aria-pressed=true]{ box-shadow:0 0 0 2px var(--a), 0 8px 20px color-mix(in srgb, var(--a) 30%, transparent); }
/* podgląd pulpitu (ekran powitalny, wygląd, podsumowanie) */
#hg-wiz .pv{ border-radius:24px; overflow:hidden; aspect-ratio:16/11; background-size:cover; background-position:center; position:relative; padding:14px; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto 1fr 1fr; gap:9px; box-shadow:0 18px 44px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.2); transition:background-image .5s; }
#hg-wiz .pv .tp{ grid-column:1 / -1; display:flex; gap:10px; align-items:center; } #hg-wiz .pv .tp i{ height:18px; border-radius:9px; background:rgba(255,255,255,.3); width:46px; backdrop-filter:var(--hg-bfo, blur(6px)); } #hg-wiz .pv .tp i.a{ background:var(--a); width:30px; } #hg-wiz .pv .tp b{ color:#fff; font-size:13px; font-weight:600; text-shadow:0 1px 6px rgba(0,0,0,.5); flex:1; }
#hg-wiz .pv .t{ border-radius:14px; background:rgba(28,34,42,.5); backdrop-filter:var(--hg-bfo, blur(10px) saturate(160%)); -webkit-backdrop-filter:var(--hg-bfo, blur(10px) saturate(160%)); box-shadow:inset 0 1px 0 rgba(255,255,255,.14); padding:11px; color:#fff; display:flex; flex-direction:column; justify-content:space-between; font-size:12px; }
#hg-wiz .pv .t ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; } #hg-wiz .pv .t.on ha-icon{ color:var(--a); } #hg-wiz .pv .t .bar{ height:5px; border-radius:3px; background:rgba(255,255,255,.2); } #hg-wiz .pv .t .bar i{ display:block; height:100%; width:62%; border-radius:3px; background:var(--a); }
#hg-wiz .pv .t .tg{ align-self:flex-end; width:30px; height:18px; border-radius:9px; background:var(--a); position:relative; } #hg-wiz .pv .t .tg::after{ content:''; position:absolute; right:2px; top:2px; width:14px; height:14px; border-radius:50%; background:white; }
/* podsumowanie */
#hg-wiz .sx{ display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:24px; align-items:start; } #hg-wiz .sx > *{ min-width:0; }
#hg-wiz .sm{ display:grid; grid-template-columns:minmax(0,1fr); gap:10px; } #hg-wiz .sm > button{ width:100%; display:flex; gap:14px; align-items:center; padding:12px 14px; border-radius:18px; background:var(--tl); box-shadow:inset 0 0 0 1px var(--ln); transition:background .2s, transform .25s cubic-bezier(.16,1,.3,1); } #hg-wiz .sm > button:hover{ background:var(--tlh); transform:translateX(3px); }
#hg-wiz .sm .ai{ margin:0; flex:none; width:42px; height:42px; border-radius:14px; } #hg-wiz .sm .ai ha-icon{ --mdc-icon-size:22px; width:22px; height:22px; } #hg-wiz .sm > button > span:nth-child(2){ flex:1; min-width:0; }
#hg-wiz .sm b{ display:block; font-size:15px; } #hg-wiz .sm small{ display:block; color:var(--mut); font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } #hg-wiz .sm .e{ color:var(--mut); } #hg-wiz .sm .dot{ display:inline-block; width:12px; height:12px; border-radius:50%; background:var(--a); vertical-align:-1px; margin-right:6px; }
/* telefon i niskie okna: jedna kolumna, kroki jako pasek u góry */
@media (max-width:820px){
  #hg-wiz .w{ grid-template-columns:minmax(0,1fr); width:calc(100vw - 24px); height:calc(100dvh - 24px); border-radius:28px; } #hg-wiz .rl{ display:none; }
  #hg-wiz .pm{ display:flex; gap:6px; align-items:center; padding:20px 22px 0; } #hg-wiz .pm i{ flex:1; height:4px; border-radius:4px; background:var(--ln); position:relative; overflow:hidden; } #hg-wiz .pm i.on::after{ content:''; position:absolute; inset:0; background:var(--a); transform-origin:left; } #hg-wiz .pm i.nw::after{ animation:wzbar .5s cubic-bezier(.16,1,.3,1) both; } #hg-wiz .pm small{ font-size:12px; color:var(--mut); margin-left:8px; white-space:nowrap; }
  #hg-wiz .bd{ padding:22px 20px 10px; } #hg-wiz .ft{ padding:14px 20px 20px; } #hg-wiz h2{ font-size:24px; } #hg-wiz .hd{ margin-bottom:18px; flex-direction:column; align-items:flex-start; gap:12px; } #hg-wiz .hd > div{ width:100%; }
  #hg-wiz .g{ grid-template-columns:repeat(2, minmax(0,1fr)); gap:10px; } #hg-wiz .g.two{ grid-template-columns:minmax(0,1fr); } #hg-wiz .lk, #hg-wiz .sx{ grid-template-columns:minmax(0,1fr); }
  #hg-wiz .hero{ display:flex; flex-direction:column; gap:0; padding:22px 22px 24px; } #hg-wiz .hx{ flex:1; display:flex; flex-direction:column; } #hg-wiz .cta{ margin-top:auto; } #hg-wiz .hv{ width:100%; } #hg-wiz .hv{ order:-1; margin:4px 0 6px; } #hg-wiz .hv .pv{ aspect-ratio:16/10; }
  #hg-wiz .eb{ margin:22px 0 8px; } #hg-wiz .hx p{ font-size:15px; } #hg-wiz .chips{ margin-bottom:24px; } #hg-wiz .cta{ flex-direction:column-reverse; align-items:stretch; } #hg-wiz .cta .b{ width:100%; } #hg-wiz .hero .lg{ display:none; }
  #hg-wiz .ft .b{ padding:0 18px; } #hg-wiz .bgs{ grid-template-columns:repeat(5, minmax(0,1fr)); gap:8px; } #hg-wiz .lg2 .c{ padding:18px 16px; }
}
@keyframes wzbar{ from{ transform:scaleX(0); } }
@media (prefers-reduced-motion:reduce){ #hg-wiz *, #hg-wiz *::before, #hg-wiz *::after{ animation:none !important; transition:none !important; } }
</style>`;
/* języki kreatora: manifest katalogów (nazwa oraz flaga i przedstawienie się języka z _meta), angielski na końcu */
const hgWzLangs = () => HGI18n.list().map(([c, n]) => { const e = HGI18n.ent(c) || {}; return [c, n, e.flag || '🌐', e.intro || n]; }).sort((a, b) => (a[0] === 'en') - (b[0] === 'en'));
const hgLangName = (c) => (HGI18n.ent(c) || {}).name || c;
const HGWizard = {
  async open(page) {
    const h = page._hass; if (!h || document.getElementById('hg-wiz')) return; const M = await HGModel.load(h);
    const steps = () => [hgT('wizard.steps.lang'), hgT('wizard.steps.views'), hgT('wizard.steps.rooms'), hgT('wizard.steps.look'), hgT('wizard.steps.summary')];
    let lang = hgCurLang(), picked = false, step = 0, dir = 1, shown = -1, hit = ''; const app = Object.assign({}, (HGL.data && HGL.data.app) || {});
    const all = [['dashboard', hgTLazy('nav.panel'), 'mdi:view-dashboard-outline'], ['rooms', hgTLazy('nav.rooms'), 'mdi:sofa-outline'], ['multimedia', hgTLazy('nav.media'), 'mdi:play-box-multiple-outline'], ['kamery', hgTLazy('nav.cams'), 'mdi:cctv'], ['family', hgTLazy('nav.family'), 'mdi:account-group-outline'], ['energia', hgTLazy('nav.energy'), 'mdi:lightning-bolt-outline'], ['mapa', hgTLazy('nav.map'), 'mdi:map-outline'], ['kalendarz', hgTLazy('nav.calendar'), 'mdi:calendar-month-outline']];
    const cnt = { mapa: M.persons.length + M.trackers.length, kalendarz: M.calendars.length, dashboard: (M.climate.length ? 1 : 0) + M.scenes.length + (M.power.length ? 1 : 0), rooms: Object.keys(M.areas).length, multimedia: M.media.length, kamery: M.cams.length, family: M.persons.length, energia: M.power.length };
    const has = Object.fromEntries(all.map(([v]) => [v, v === 'dashboard' || cnt[v] > 0]));
    const sel = new Set(all.map((x) => x[0]).filter((v) => has[v])), hid = new Set();
    const areas = Object.values(M.areas).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const aIc = (a) => a.icon || (HG_WZ_AREA_IC.find(([re]) => re.test(a.name || '')) || [0, 'mdi:home-outline'])[1];
    const ACC = typeof HG_ACCENTS !== 'undefined' ? HG_ACCENTS : [['#' + '63D71E', hgTLazy('accents.lime')]], BGS = HG_BG_SET;
    const accOf = () => (app.accent || ACC[0][0]), bgOf = () => (app.bg && app.bg.v) || '', bgUrl = () => bgOf() || HG_DEFAULT_BG.v;
    const accName = (c) => { const x = ACC.find(([v]) => v.toUpperCase() === c.toUpperCase()); return x ? String(x[1]) : c; };
    const d = document.createElement('div'); d.id = 'hg-wiz'; document.body.appendChild(d);
    const MV = { dashboard: '<div class="mv" style="grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr"><i style="grid-row:span 2"></i><i class="a"></i><i></i><i></i><i></i></div>', rooms: '<div class="mv" style="grid-template-columns:repeat(3,1fr)"><i></i><i class="a"></i><i></i><i></i><i></i><i></i></div>', multimedia: '<div class="mv" style="grid-template-columns:1.4fr 1fr"><i class="a"></i><i></i></div>', kamery: '<div class="mv" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr"><i></i><i class="a"></i><i></i><i></i></div>', family: '<div class="mv" style="grid-template-columns:repeat(3,1fr)"><i style="border-radius:50%;aspect-ratio:1;align-self:center" class="a"></i><i style="border-radius:50%;aspect-ratio:1;align-self:center"></i><i style="border-radius:50%;aspect-ratio:1;align-self:center"></i></div>', energia: '<div class="mv" style="grid-template-rows:1fr 2fr"><i class="a" style="width:60%"></i><i></i></div>', mapa: '<div class="mv" style="grid-template-columns:1fr"><i style="position:relative"><b class="a" style="position:absolute;left:38%;top:30%;width:14px;height:14px;border-radius:50%"></b><b class="a" style="position:absolute;left:62%;top:55%;width:10px;height:10px;border-radius:50%;opacity:.7"></b></i></div>', kalendarz: '<div class="mv" style="grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(3,1fr)">' + Array.from({ length: 21 }, (_, i) => `<i${i === 9 ? ' class="a"' : ''}></i>`).join('') + '</div>' };
    const draw = () => { if (lang === 'en' || HGI18n.cache[lang]) HGI18n.code = lang;   /* kreator mówi wybranym językiem (katalog już wczytany) */
      const S = steps(), N = S.length, a = accOf(), on = (typeof HGApp !== 'undefined' && HGApp.tokens(a)) ? HGApp.tokens(a).dark['--hg-on-accent'] : '#' + '0B0F0A';
      const dk = !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches); d.className = dk ? '' : 'lt'; d.style.setProperty('--a', a); d.style.setProperty('--on', on);
      const ic = (x) => H.icon(x), ck = `<span class="ck">${ic('mdi:check')}</span>`, bgCss = `background-image:url('${bgUrl()}')`, fresh = shown !== step, I = (i) => `style="--i:${i}"`;
      const fk = document.activeElement && d.contains(document.activeElement) ? [...document.activeElement.attributes].filter((x) => x.name.startsWith('data-')).map((x) => `[${x.name}="${CSS.escape(x.value)}"]`).join('') : '';
      const vs = all.filter(([v]) => sel.has(v)), bi = Math.max(0, BGS.findIndex(([u]) => (u || '') === bgOf())), vis = areas.filter((x) => !hid.has(x.area_id));
      const pv = (st = '') => `<div class="pv" style="${bgCss};${st}"><div class="tp"><i class="a"></i><b>${H.esc((h.config && h.config.location_name) || hgT('nav.home'))}</b><i></i></div><div class="t on">${ic('mdi:lightbulb-on-outline')}<span>${hgT('wizard.preview_room')}</span><span class="tg"></span></div><div class="t">${ic('mdi:thermometer')}<span>21,5°</span><div class="bar"><i></i></div></div><div class="t">${ic('mdi:lightning-bolt-outline')}<span>1,8 kW</span><div class="bar"><i style="width:35%"></i></div></div><div class="t on">${ic('mdi:play-circle-outline')}<span>${hgT('wizard.preview_music')}</span><span class="tg"></span></div></div>`;
      let w = '';
      if (step === 0) {
        w = `<div class="w hr" role="dialog" aria-modal="true" aria-label="${hgT('wizard.hero')}"><div class="hero"><div class="hx"><span class="lg" ${I(0)}>${ic('mdi:home-variant-outline')}</span><span class="eb" ${I(1)}>${hgT('wizard.eyebrow')}</span><h1 ${I(2)}>${hgT('wizard.hero').replace(/(Nuvio)$/, '<em>$1</em>')}</h1><p ${I(3)}>${hgT('wizard.hero_sub')}</p>
          <div class="chips" ${I(4)}><span>${ic('mdi:sofa-outline')}${hgT('wizard.rooms_count', { count: areas.length })}</span><span>${ic('mdi:devices')}${hgT('wizard.entities_count', { count: Object.keys(h.states).length })}</span><span>${ic('mdi:clock-fast')}${hgT('wizard.duration')}</span></div>
          <div class="cta" ${I(5)}><button class="b ok" data-x="next">${hgT('wizard.start')}${ic('mdi:arrow-right')}</button><button class="b gh" data-x="skip">${hgT('wizard.skip')}</button></div></div><div class="hv" aria-hidden="true">${pv()}</div></div></div>`;
      } else { const k = step - 1; let inner = '', tool = '';
        if (k === 0) inner = `<div class="g two lg2 st">${hgWzLangs().map(([l, n, f, s2], i) => `<button class="c" data-l="${H.esc(l)}" aria-pressed="${lang === l}" ${I(i)}>${ck}<span class="fl">${H.esc(f)}</span><span><b>${H.esc(n)}</b><small>${H.esc(s2)}</small></span></button>`).join('')}</div>`;
        if (k === 1) inner = `<div class="g st">${all.map(([v, kk, ico], i) => `<button class="c" data-v="${v}" aria-pressed="${sel.has(v)}" ${has[v] && v !== 'dashboard' ? '' : 'aria-disabled="true"'} ${I(i)}>${ck}${MV[v]}<b>${ic(ico)}${kk}</b><small>${v === 'dashboard' ? hgT('wizard.always') : cnt[v] ? (v === 'rooms' ? hgT('wizard.rooms_count', { count: cnt[v] }) : hgT('wizard.entities_count', { count: cnt[v] })) : hgT('wizard.no_entities')}</small></button>`).join('')}</div>`;
        if (k === 2) { inner = areas.length ? `<div class="g st">${areas.map((x, i) => `<button class="c" data-a="${H.esc(x.area_id)}" aria-pressed="${!hid.has(x.area_id)}" ${I(Math.min(i, 12))}>${ck}<span class="ai">${ic(aIc(x))}</span><b>${H.esc(x.name)}</b><small>${hgT('wizard.entities_count', { count: M.roomCount[x.area_id] || 0 })}</small></button>`).join('')}</div>` : `<p>${hgT('wizard.no_areas')}</p>`;
          if (areas.length > 1) tool = `<button class="b" data-x="${hid.size ? 'all' : 'none'}">${ic(hid.size ? 'mdi:checkbox-multiple-marked-outline' : 'mdi:checkbox-multiple-blank-outline')}${hid.size ? hgT('wizard.select_all') : hgT('wizard.select_none')}</button>`; }
        if (k === 3) inner = `<div class="lk st"><div ${I(0)}><span class="lbl">${hgT('wizard.accent')}</span><div class="sw">${ACC.map((x) => `<button data-c="${x[0]}" style="--c:${x[0]}" aria-pressed="${a.toUpperCase() === x[0].toUpperCase()}" aria-label="${H.esc(String(x[1]))}" title="${H.esc(String(x[1]))}">${a.toUpperCase() === x[0].toUpperCase() ? ic('mdi:check') : ''}</button>`).join('')}</div><span class="lbl">${hgT('wizard.background')}</span><div class="bgs">${BGS.map(([u, l, p, th], i) => `<button data-b="${i}" title="${H.esc(l)}" aria-label="${H.esc(l)}" aria-pressed="${(u || '') === bgOf()}" style="background-image:url('${th}')"></button>`).join('')}</div></div>
          <div ${I(1)}><span class="lbl">${hgT('wizard.preview')}</span>${pv()}</div></div>`;
        if (k === 4) inner = `<div class="sx st"><div class="sm" ${I(0)}>${[
          [1, 'mdi:translate', S[0], H.esc(hgLangName(lang))],
          [2, 'mdi:view-grid-outline', `${hgT('wizard.views')} · ${vs.length}`, vs.map(([, kk]) => String(kk)).join(' · ')],
          [3, 'mdi:sofa-outline', `${S[2]} · ${vis.length}/${areas.length}`, vis.map((x) => H.esc(x.name)).join(' · ') || '–'],
          [4, 'mdi:palette-outline', hgT('wizard.look'), `<span class="dot"></span>${H.esc(accName(a))} · ${H.esc(BGS[bi][1])}`]].map(([j, ico, b, s2]) => `<button data-j="${j}"><span class="ai">${ic(ico)}</span><span><b>${b}</b><small>${s2}</small></span><span class="e">${ic('mdi:pencil-outline')}</span></button>`).join('')}</div>
          <div ${I(1)}>${pv()}</div></div>`;
        const sub = [hgLangName(lang), `${vs.length} · ${vs.map(([, kk]) => String(kk)).join(', ')}`, `${vis.length}/${areas.length}`, accName(a), ''];
        const rail = `<aside class="rl"><div class="br"><span class="lg">${ic('mdi:home-variant-outline')}</span>Nuvio</div><ol>${S.map((s, i) => { const c = i < k ? 'dn' : i === k ? 'cu' : ''; const inn = `<span class="n">${i < k ? ic('mdi:check') : i + 1}</span><span><b>${s}</b>${i < k && sub[i] ? `<small>${H.esc(sub[i])}</small>` : ''}</span>`;
          return `<li class="${c}">${i < k ? `<button data-j="${i + 1}">${inn}</button>` : `<div ${i === k ? 'aria-current="step"' : ''}>${inn}</div>`}</li>`; }).join('')}</ol><small class="nt">${hgT('wizard.later')}</small></aside>`;
        const pm = `<div class="pm" aria-hidden="true">${S.map((_, i) => `<i class="${i < step ? 'on' : ''} ${fresh && dir > 0 && i === step - 1 ? 'nw' : ''}"></i>`).join('')}<small>${step} / ${N}</small></div>`;
        w = `<div class="w" role="dialog" aria-modal="true" aria-label="${hgT('wizard.hero')}">${rail}<section class="mn">${pm}<div class="bd"><div class="pg ${fresh ? 'in' : ''} ${dir < 0 ? 'bk' : ''}" aria-label="${hgT('wizard.step')} ${step} ${hgT('wizard.of')} ${N}"><div class="hd"><div><span class="sl">${hgT('wizard.step')} ${step} ${hgT('wizard.of')} ${N}</span><h2>${S[k]}</h2><p>${[hgT('wizard.lang_sub'), hgT('wizard.views_sub'), hgT('wizard.rooms_sub'), hgT('wizard.look_sub'), hgT('wizard.summary_sub')][k]}</p></div>${tool}</div>${inner}</div></div>
          <div class="ft"><button class="b gh" data-x="back">${ic('mdi:arrow-left')}${hgT('wizard.back')}</button><span class="sp"></span>${step < N ? `<button class="b ok" data-x="next">${hgT('wizard.next')}${ic('mdi:arrow-right')}</button>` : `<button class="b ok" data-x="go">${ic('mdi:check')}${hgT('wizard.go')}</button>`}</div></section></div>`; }
      if (!d.firstChild) d.innerHTML = `${HG_WZ_CSS}<div class="bgx"></div><span class="orb o1"></span><span class="orb o2"></span><div class="ly"></div>`;
      const ly = d.querySelector('.ly'), sc = !fresh && d.querySelector('.bd') ? d.querySelector('.bd').scrollTop : 0; d.querySelector('.bgx').setAttribute('style', bgCss);
      ly.innerHTML = w; if (shown >= 0) ly.querySelector('.w').style.animation = 'none'; if (sc) d.querySelector('.bd').scrollTop = sc;
      if (hit) { const x = ly.querySelector(hit); if (x) x.classList.add('pop'); hit = ''; }
      shown = step; const f = fk && ly.querySelector(fk); if (f) f.focus({ preventScroll: true }); };
    draw(); this._dbg = { go: (n) => { dir = n >= step ? 1 : -1; step = n; draw(); } };
    const go = (n) => { dir = n >= step ? 1 : -1; step = Math.max(0, Math.min(steps().length, n)); draw(); };
    const onKey = (e) => { if (!d.isConnected) return document.removeEventListener('keydown', onKey); if (e.key !== 'Enter' || e.repeat || (e.target.closest && e.target.closest('button, input, textarea'))) return; const x = d.querySelector('[data-x=next],[data-x=go]'); if (x) { e.preventDefault(); x.click(); } };
    document.addEventListener('keydown', onKey);
    d.addEventListener('click', async (e) => { const b = e.target.closest('button'); if (!b || b.getAttribute('aria-disabled') === 'true') return;
      hit = (b.dataset.v && `[data-v="${b.dataset.v}"]`) || (b.dataset.a && `[data-a="${CSS.escape(b.dataset.a)}"]`) || (b.dataset.l && `[data-l="${b.dataset.l}"]`) || '';
      if (b.dataset.l) { const l = b.dataset.l, ok = await HGI18n.load(l); lang = l; picked = true; HGI18n.code = ok ? l : 'en'; return draw(); }   /* katalog wybranego języka, potem rysunek */
      if (b.dataset.v) { sel.has(b.dataset.v) ? sel.delete(b.dataset.v) : sel.add(b.dataset.v); return draw(); }
      if (b.dataset.a) { hid.has(b.dataset.a) ? hid.delete(b.dataset.a) : hid.add(b.dataset.a); return draw(); }
      if (b.dataset.c) { app.accent = b.dataset.c; return draw(); }
      if (b.dataset.b != null) { const x = BGS[+b.dataset.b]; app.bg = x[0] ? { kind: 'image', v: x[0], v2p: x[2] || '' } : null; if (!app.bg) delete app.bg; return draw(); }
      if (b.dataset.j) return go(+b.dataset.j);
      if (b.dataset.x === 'all') { hid.clear(); return draw(); } if (b.dataset.x === 'none') { areas.forEach((x) => hid.add(x.area_id)); return draw(); }
      if (b.dataset.x === 'next') return go(step + 1); if (b.dataset.x === 'back') return go(step - 1);
      if (b.dataset.x === 'go' || b.dataset.x === 'skip') { const pk = picked ? { lang, lp: 1 } : {}; HGL.data.wiz = b.dataset.x === 'go' ? { ...pk, views: [...sel], hiddenRooms: [...hid], ts: Date.now() } : { ...pk, ts: Date.now() };
        if (HGLang.get() && HGLang.get() !== lang && (picked || b.dataset.x === 'go')) await HGLang.set(page._hass, lang);   /* osobisty wybór idzie za decyzją w kreatorze (z katalogiem) */
        if (b.dataset.x === 'go') { HGL.data.app = app; if (typeof HGApp !== 'undefined') HGApp.apply(); }
        await HGL.save(page._hass); document.removeEventListener('keydown', onKey); d.remove(); if (!window.__hgDryRun) location.reload(); } });
  },
};
window.HGWizard = HGWizard;

/* --- Wygląd → „Widoki” (włącz / wyłącz / kolejność, także widoki bez pasujących encji) i „Integracje” (opcjonalne pakiety HACS) --- */
/* [ścieżka, nazwa (hgTLazy), ikona, wymaganie gdy brak encji (hgTLazy, wstawiane w nav.na_req)] */
const HG_VIEW_DEF = [['dashboard', hgTLazy('nav.panel'), 'mdi:view-dashboard-outline', ''], ['rooms', hgTLazy('nav.rooms'), 'mdi:sofa-outline', hgTLazy('nav.req_rooms')],
  ['multimedia', hgTLazy('nav.media'), 'mdi:play-box-multiple-outline', hgTLazy('nav.req_media')], ['kamery', hgTLazy('nav.cams'), 'mdi:cctv', hgTLazy('nav.req_cams')],
  ['family', hgTLazy('nav.family'), 'mdi:account-group-outline', hgTLazy('nav.req_family')], ['energia', hgTLazy('nav.energy'), 'mdi:lightning-bolt-outline', hgTLazy('nav.req_energy')],
  ['mapa', hgTLazy('nav.map'), 'mdi:map-outline', hgTLazy('nav.req_map')], ['kalendarz', hgTLazy('nav.calendar'), 'mdi:calendar-month-outline', hgTLazy('nav.req_cal')]];
const hgViewHas = (M) => ({ dashboard: true, rooms: Object.keys(M.areas || {}).length > 0, multimedia: M.media.length > 0, kamery: M.cams.length > 0, family: M.persons.length > 0, energia: M.power.length > 0, mapa: M.persons.length + (M.trackers || []).length > 0, kalendarz: (M.calendars || []).length > 0 });
/* pakiety: wykrycie po zarejestrowanym zasobie ORAZ faktycznie wczytanym kodzie (globalna / element) */
/* HACS: strona repozytorium w aplikacji (/hacs/repository/<id GitHub>); bez HACS -> GitHub w nowej karcie */
const hgHasHacs = (h) => !!(h && h.panels && h.panels.hacs);
const hgHacsOpen = (h, rid, repo) => { if (hgHasHacs(h) && rid) { history.pushState(null, '', '/hacs/repository/' + rid); window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } })); return true; }
  window.open('https://github.com/' + repo, '_blank', 'noopener'); return false; };
window.hgHacsOpen = hgHacsOpen;
const HG_PKGS = [
  { id: 'kiosk', name: 'Kiosk Mode', repo: 'NemesisRE/kiosk-mode', rid: 497319128, re: /kiosk-mode/i, live: () => !!window.KioskMode, icon: 'mdi:monitor-shimmer', hint: hgTLazy('oss.pkgs.kiosk_hint') },
  { id: 'sidebar', name: 'Custom Sidebar', repo: 'elchininet/custom-sidebar', rid: 737780218, re: /custom-sidebar/i, live: () => !!window.CustomSidebar, icon: 'mdi:dock-left', hint: hgTLazy('oss.pkgs.sidebar_hint') },
  { id: 'cardmod', name: 'card-mod', repo: 'thomasloven/lovelace-card-mod', rid: 190927524, re: /card-mod/i, live: () => !!customElements.get('card-mod'), icon: 'mdi:brush-variant', hint: hgTLazy('oss.pkgs.cardmod_hint') },
];
const HGLookX = {
  M: null, res: null, pend: null, kio: null, busy: false, vuOpen: null,
  vuHtml(page, v, off) { const L = HGUsers.list; if (!L) return `<div class="lx-vu"><small>${hgT('oss.views.loading_people')}</small></div>`;
    const me = page._hass.user.id, n = L.filter((u) => !off.includes(u.id)).length;
    const rows = [...L].sort((a, b) => (a.id === me ? -1 : b.id === me ? 1 : 0) || String(a.name || '').localeCompare(String(b.name || ''), HG_LOC())).map((u) => { const vis = !off.includes(u.id), self = u.id === me, nm = String(u.name || u.username || '?');
      return `<button type="button" class="wl-sw us-r" role="switch" data-hge="lx-vut" data-v="${H.esc(v)}" data-u="${H.esc(u.id)}" aria-checked="${vis}" ${self ? 'disabled' : ''}>${hgUserAv(page._hass, u, L)}<span>${H.esc(nm)}${self ? `<em class="us-tg">${hgT('oss.views.you')}</em>` : ''}<small>${vis ? hgT('oss.views.user_sees') : hgT('oss.views.user_hidden')}</small></span><i aria-hidden="true"></i></button>`; }).join('');
    return `<div class="lx-vu" role="group" aria-label="${hgT('oss.views.who_sees')}"><style>${typeof HG_WALL_CSS === 'string' ? HG_WALL_CSS : ''}${typeof HG_US_CSS === 'string' ? HG_US_CSS : ''}</style><small>${hgT('oss.views.who_sees_count', { count: n, total: L.length })}</small>${rows}</div>`; },
  async prep(page) { if (this.busy) return; this.busy = true; const h = page._hass;
    try { this.M = await HGModel.load(h); } catch (e) { this.M = null; }
    try { this.res = (await h.callWS({ type: 'lovelace/resources' })).map((r) => r.url || ''); } catch (e) { this.res = []; }
    try { const c = await h.callWS({ type: 'lovelace/config', url_path: HG_DASH() }); this.dash = c; this.kio = (c && c.strategy && c.strategy.kiosk_mode) || {}; } catch (e) { this.dash = null; this.kio = {}; }
    this.busy = false; if (page._eSheetEl && page._eSheetEl.querySelector('.lk')) page._eLook(); },
  views() { const w = (HGL.data && HGL.data.wiz) || {}, has = this.M ? hgViewHas(this.M) : {};
    if (this.pend) return this.pend;
    const all = [...HG_VIEW_DEF.map((v) => v[0]), ...(w.custom || []).map((c) => c.p)];
    const on = w.views ? w.views.filter((v) => all.includes(v)) : all.filter((v) => has[v] || (w.custom || []).some((c) => c.p === v));
    const ord = [...on, ...all.filter((v) => !on.includes(v))].filter((v) => v !== 'dashboard');
    return { order: ['dashboard', ...ord], on: new Set(['dashboard', ...on]) }; },
  cvForm() { const c = this.cv, ed = !!c.old, L = HG_LAYS, num = (k, l, d) => `<label class="lcv-n"><span>${l}</span><select data-cv="${k}">${[1, 2, 3, 4, 5, 6].map((i) => `<option ${(+c[k] || d) === i ? 'selected' : ''}>${i}</option>`).join('')}</select></label>`;
    const IC = ['mdi:view-grid-outline', 'mdi:star-outline', 'mdi:home-outline', 'mdi:sofa-outline', 'mdi:garage', 'mdi:flower-outline', 'mdi:thermometer', 'mdi:lightbulb-outline', 'mdi:shield-home-outline', 'mdi:television', 'mdi:baby-face-outline', 'mdi:briefcase-outline'];
    return `<div class="lcv" role="group" aria-label="${ed ? hgT('oss.cv.edit') : hgT('oss.cv.new')}"><b class="lcv-h">${H.icon(ed ? 'mdi:pencil-outline' : 'mdi:plus')}${ed ? hgT('oss.cv.edit') : hgT('oss.cv.new')}</b>
      <label class="lcv-f"><span>${hgT('common.name')} <em>${(c.n || '').length}/24</em></span><input data-cv="n" maxlength="24" value="${H.esc(c.n || '')}" placeholder="${hgT('oss.cv.name_placeholder')}" autocomplete="off"></label>
      <label class="lcv-f"><span>${hgT('oss.cv.subtitle')}</span><input data-cv="s" maxlength="48" value="${H.esc(c.s || '')}" placeholder="${hgT('oss.cv.subtitle_placeholder')}" autocomplete="off"></label>
      <div class="lcv-f"><span>${hgT('oss.cv.icon')}</span><div class="lcv-ic">${IC.map((i) => `<button data-hge="lx-ci" data-i="${i}" aria-pressed="${c.i === i}" aria-label="${i}">${H.icon(i)}</button>`).join('')}<input data-cv="i" value="${H.esc(c.i || '')}" placeholder="mdi:…" autocomplete="off" aria-label="${hgT('oss.cv.custom_icon')}"></div></div>
      <label class="lcv-f"><span>${hgT('oss.cv.path')}</span><span class="lcv-p">/${H.esc(HG_DASH())}/<input data-cv="p" maxlength="32" value="${H.esc(c.p || '')}" placeholder="${hgT('oss.cv.path_placeholder')}" autocomplete="off" ${ed ? 'disabled' : ''}></span></label>
      <div class="lcv-f"><span>${hgT('oss.cv.layout')}</span><div class="lcv-l">${L.map(([k, l, i, d]) => `<button data-hge="lx-cl" data-l="${k}" aria-pressed="${(c.lay || 'grid') === k}">${H.icon(i)}<b>${l}</b><small>${d}</small></button>`).join('')}</div></div>
      <div class="lcv-f"><span>${hgT('oss.cv.panel_width')}</span>${hgPwPick(c.pw || 'narrow', 'lx-cw')}<style>${HG_PW_CSS}</style></div>
      <div class="lcv-f"><span>${hgT('oss.cv.columns')}</span><div class="lcv-r">${num('cm', hgT('oss.cv.phone'), 1)}${num('ct', 'Tablet', 2)}${num('cd', hgT('oss.cv.desktop'), c.lay === 'panel' ? 2 : 3)}<label class="lcv-n"><span>${hgT('oss.cv.max_width')}</span><select data-cv="mw">${[['0', hgT('oss.cv.full_width')], ['960', '960 px'], ['1200', '1200 px'], ['1440', '1440 px']].map(([v, l]) => `<option value="${v}" ${String(c.mw || 0) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div></div>
      ${c.err ? `<p class="lcv-e" role="alert">${H.esc(c.err)}</p>` : ''}
      <div class="lcv-a">${ed ? `<button class="lx-hbtn lcv-del" data-hge="lx-cd">${H.icon('mdi:trash-can-outline')}${c.del ? hgT('oss.cv.delete_confirm') : hgT('oss.cv.delete')}</button>` : ''}<button class="lx-hbtn" data-hge="lx-cx">${hgT('common.cancel')}</button><button class="lx-hbtn ok" data-hge="lx-cs2">${H.icon('mdi:check')}${ed ? hgT('common.save') : hgT('oss.cv.create')}</button></div></div>
      <style>.lx-new{ align-self:flex-start; margin-top:8px; } .lcv{ display:flex; flex-direction:column; gap:12px; margin-top:10px; padding:14px; border-radius:20px; background:color-mix(in srgb, var(--hg-tile-bg) 80%, transparent); box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--hg-accent) 45%, transparent); }
      .lcv-h{ display:flex; gap:8px; align-items:center; font-size:15px; } .lcv-h ha-icon{ width:20px; height:20px; } .lcv-f{ display:flex; flex-direction:column; gap:6px; } .lcv-f > span{ font-size:12px; opacity:.72; display:flex; justify-content:space-between; } .lcv-f em{ font-style:normal; }
      .lcv input, .lcv select{ font:inherit; color:inherit; box-sizing:border-box; height:40px; padding:0 12px; border-radius:12px; border:0; background:var(--hg-tile-bg); outline:none; min-width:0; } .lcv input:focus-visible, .lcv select:focus-visible{ box-shadow:0 0 0 2px var(--hg-accent); } .lcv select option{ color:#111; }
      .lcv-p{ display:flex; align-items:center; gap:2px; font-size:13px; opacity:.85; } .lcv-p input{ flex:1; } .lcv-ic{ display:flex; flex-wrap:wrap; gap:6px; align-items:center; } .lcv-ic button{ all:unset; cursor:pointer; width:38px; height:38px; border-radius:12px; display:grid; place-items:center; background:var(--hg-tile-bg); }
      .lcv-ic button[aria-pressed=true]{ box-shadow:inset 0 0 0 1.5px var(--hg-accent); color:var(--hg-accent-tx, var(--hg-accent)); } .lcv-ic ha-icon{ width:20px; height:20px; } .lcv-ic input{ flex:1; min-width:120px; }
      .lcv-l{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:8px; } .lcv-l button{ all:unset; cursor:pointer; box-sizing:border-box; padding:10px; border-radius:14px; background:var(--hg-tile-bg); display:grid; grid-template-columns:auto 1fr; column-gap:8px; align-items:center; }
      .lcv-l button small{ grid-column:1 / -1; font-size:11.5px; opacity:.66; margin-top:4px; line-height:1.3; } .lcv-l button[aria-pressed=true]{ box-shadow:inset 0 0 0 1.5px var(--hg-accent); } .lcv-l ha-icon{ width:20px; height:20px; }
      .lcv-r{ display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:8px; } @media (max-width:520px){ .lcv-r{ grid-template-columns:repeat(2, minmax(0, 1fr)); } .lcv-l{ grid-template-columns:1fr; } } .lcv-n{ display:flex; flex-direction:column; gap:4px; font-size:11.5px; } .lcv-n span{ opacity:.66; }
      .lcv-e{ margin:0; font-size:13px; color:var(--error-color, #E5484D); } .lcv-a{ display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; } .lcv-del{ margin-right:auto; color:var(--error-color, #E5484D); } .lcv button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }</style>`; },
  cvSync(page) { const S = page._eSheetEl, c = this.cv; if (!S || !c) return; for (const n of S.querySelectorAll('[data-cv]')) if (!n.disabled) c[n.dataset.cv] = n.value.trim(); },
  pkg(p) { const reg = (this.res || []).some((u) => p.re.test(u)); let live = false; try { live = p.live(); } catch (e) { live = false; } return { reg, live, ok: reg && live }; },
  html(page) {
    if (!this.M || !this.res) { this.prep(page); return `<section class="lk-g" data-tab="views" data-pg="views"><h4>${H.icon('mdi:view-carousel-outline')}${hgT('oss.views.title')}</h4><small class="lk-hn">${hgT('common.loading')}</small></section>`; }
    const has = hgViewHas(this.M), V = this.views(), CU = (HGL.data.wiz || {}).custom || [], D = Object.fromEntries([...HG_VIEW_DEF.map((v) => [v[0], v]), ...CU.map((c) => [c.p, [c.p, '', c.i || 'mdi:view-grid-outline', '', c]])]);
    for (const c of CU) has[c.p] = true; const tl = (d) => (d[4] ? H.esc(d[4].n) : String(d[1]));
    const auto = !!(page._config && page._config._hgAuto);
    /* kto widzi widok: tylko admin na wspólnym dashboardzie (lista osób z HGUsers) */
    const vuOk = page._isAdmin() && typeof HGL !== 'undefined' && HGL.mode === 'shared' && window.HGUsers, VU = ((HGL.data && HGL.data.wiz) || {}).vu || {};
    if (vuOk && !HGUsers.list) HGUsers.prep(page);
    const rows = V.order.map((v, i) => { const d = D[v], on = V.on.has(v), fx = v === 'dashboard';
      return `<div class="lx-r${on ? ' on' : ''}${has[v] ? '' : ' na'}"><span class="lx-i">${H.icon(d[2])}</span><span class="lx-t"><b>${tl(d)}</b><small>${d[4] ? `${hgT('oss.views.custom')} · ${H.esc((HG_LAYS.find((x) => x[0] === d[4].lay) || HG_LAYS[0])[1])} · /${H.esc(d[4].p)}${on ? '' : hgT('common.hidden_suffix')}` : has[v] ? (fx ? hgT('oss.views.always_visible') : on ? hgT('oss.views.visible') : hgT('oss.views.hidden')) : hgT('nav.na_req', { x: String(d[3]) })}${!fx && vuOk && (VU[v] || []).length ? H.esc(hgT('oss.views.hidden_from', { names: VU[v].map((id) => { const u = (HGUsers.list || []).find((x) => x.id === id); return u ? u.name || u.username : '?'; }).join(', ') })) : ''}</small></span>${d[4] ? `<button class="lx-a" data-hge="lx-ce" data-v="${v}" aria-label="${hgT('oss.cv.edit')}">${H.icon('mdi:pencil-outline')}</button>` : ''}
        ${fx || !vuOk ? '' : `<button class="lx-a${(VU[v] || []).length ? ' lx-vuh' : ''}" data-hge="lx-vu" data-v="${v}" aria-expanded="${this.vuOpen === v}" aria-label="${hgT('oss.views.who_sees')}" title="${hgT('oss.views.who_sees')}">${H.icon((VU[v] || []).length ? 'mdi:account-lock-outline' : 'mdi:account-multiple-outline')}</button>`}
        ${fx ? '' : `<button class="lx-a" data-hge="lx-up" data-v="${v}" aria-label="${hgT('oss.views.move_up')}" ${i <= 1 ? 'disabled' : ''}>${H.icon('mdi:chevron-up')}</button><button class="lx-a" data-hge="lx-dn" data-v="${v}" aria-label="${hgT('oss.views.move_down')}" ${i === V.order.length - 1 ? 'disabled' : ''}>${H.icon('mdi:chevron-down')}</button>`}
        <button class="lx-sw" role="switch" data-hge="lx-v" data-v="${v}" aria-checked="${on}" aria-label="${tl(d)}" ${fx ? 'disabled' : ''}><i></i></button></div>${!fx && vuOk && this.vuOpen === v ? this.vuHtml(page, v, VU[v] || []) : ''}`; }).join('');
    const h = page._hass, kio = this.kio || {}, P = Object.fromEntries(HG_PKGS.map((p) => [p.id, this.pkg(p)]));
    const tg = (k, l, sub, val) => `<div class="lx-r on"><span class="lx-t"><b>${l}</b><small>${sub}</small></span><button class="lx-sw" role="switch" data-hge="lx-k" data-k="${k}" aria-checked="${!!val}" aria-label="${l}"><i></i></button></div>`;
    const pk = HG_PKGS.map((p) => { const st = P[p.id];
      const head = `<div class="lx-r${st.ok ? ' on' : ' na'}"><span class="lx-i">${H.icon(p.icon)}</span><span class="lx-t"><b>${p.name}</b><small>${st.ok ? hgT('oss.pkgs.installed') : st.reg ? hgT('oss.pkgs.not_loaded') : p.hint}</small></span>${st.ok ? `<span class="lx-ok">${H.icon('mdi:check')}</span>` : ''}</div>${st.ok ? '' : `<div class="lx-hb">${this.hacsGo && this.hacsGo[p.id] ? `<button class="lx-hbtn" data-hge="lx-rf">${H.icon('mdi:refresh')}${hgT('oss.pkgs.reload_to_detect')}</button>` : ''}<button class="lx-hbtn ok" data-hge="lx-hacs" data-p="${p.id}">${H.icon(hgHasHacs(h) ? 'mdi:download' : 'mdi:github')}${hgHasHacs(h) ? hgT('oss.install_in_hacs') : hgT('oss.pkgs.open_github')}</button>${hgHasHacs(h) ? '' : `<a class="lx-hl" href="https://hacs.xyz/docs/use/" target="_blank" rel="noopener">${hgT('oss.pkgs.how_to_install_hacs')}</a>`}</div>`}`;
      if (!st.ok) return head;
      if (p.id === 'kiosk') return head + `<div class="lx-sub">${tg('hide_header', hgT('oss.pkgs.hide_header'), hgT('oss.pkgs.hide_header_desc'), kio.hide_header)}${tg('hide_sidebar', hgT('oss.pkgs.hide_sidebar'), hgT('oss.pkgs.hide_sidebar_desc'), kio.hide_sidebar)}${tg('kiosk_users', hgT('oss.pkgs.kiosk_users'), hgT('oss.pkgs.kiosk_users_desc'), kio.non_admin_settings && kio.non_admin_settings.kiosk)}</div>`;
      if (p.id === 'sidebar') return head + `<div class="lx-sub"><div class="lx-r on"><span class="lx-t"><b>${hgT('oss.pkgs.sidebar_top')}</b><small>${hgT('oss.pkgs.sidebar_top_desc')}</small></span><button class="lk-mini" data-hge="lx-cs">${hgT('oss.pkgs.copy')}</button></div></div>`;
      return head; }).join('');
    return `<section class="lk-g lx" data-tab="views" data-pg="views"><h4>${H.icon('mdi:view-carousel-outline')}${hgT('oss.views.title')}</h4><small class="lk-hn">${auto ? hgT('oss.views.intro') : hgT('oss.views.own_config')}</small>
      ${auto ? `<div class="lx-l">${rows}</div>${this.cv ? this.cvForm() : `<button class="lx-hbtn lx-new" data-hge="lx-cn">${H.icon('mdi:plus')}${hgT('oss.cv.new')}</button>`}${this.pend ? `<button class="lk-mini lx-ap" data-hge="lx-apply">${hgT('oss.views.apply')}</button>` : ''}` : ''}</section>
      ${page._isAdmin() ? `<section class="lk-g lx" data-tab="look" data-pg="integrations"><h4>${H.icon('mdi:puzzle-outline')}${hgT('oss.pkgs.title')}</h4><small class="lk-hn">${hgT('oss.pkgs.intro')}</small><div class="lx-l">${pk}</div>${this.kpend ? `<button class="lk-mini lx-ap" data-hge="lx-kapply">${hgT('oss.pkgs.save_kiosk')}</button>` : ''}</section>` : ''}
      <style>.lx-l{ display:flex; flex-direction:column; gap:6px; } .lx-r{ display:flex; align-items:center; gap:10px; min-height:52px; padding:6px 8px 6px 6px; border-radius:16px; background:color-mix(in srgb, var(--hg-tile-bg) 80%, transparent); }
      .lx-r.na{ opacity:.62; } .lx-r.na .lx-t small{ font-style:italic; } .lx-sub{ display:flex; flex-direction:column; gap:6px; margin:-2px 0 4px 18px; } .lx-sub .lx-r{ min-height:46px; padding-left:12px; }
      .lx-i{ flex:none; width:38px; height:38px; border-radius:50%; display:grid; place-items:center; background:var(--hg-tile-bg); } .lx-r.on:not(.na) > .lx-i{ background:color-mix(in srgb, var(--hg-accent) 22%, transparent); color:var(--hg-accent-tx, var(--hg-accent)); }
      .lx-i ha-icon{ width:20px; height:20px; } .lx-t{ flex:1; min-width:0; display:flex; flex-direction:column; } .lx-t b{ font-weight:600; font-size:14px; } .lx-t small{ opacity:.66; font-size:12px; line-height:1.3; }
      .lx-a{ all:unset; cursor:pointer; flex:none; width:32px; height:32px; border-radius:50%; display:grid; place-items:center; } .lx-a:disabled{ opacity:.25; cursor:default; } .lx-a:not(:disabled):hover{ background:var(--hg-tile-bg); } .lx-a ha-icon{ width:20px; height:20px; } .lx-a[aria-expanded=true]{ background:var(--hg-tile-bg); } .lx-a.lx-vuh{ color:var(--hg-accent-tx, var(--hg-accent)); }
      .lx-vu{ display:flex; flex-direction:column; gap:6px; margin:-2px 0 6px 18px; padding-left:12px; border-left:2px solid color-mix(in srgb, var(--hg-accent) 45%, transparent); } .lx-vu > small{ font-size:12px; opacity:.7; padding:2px 4px; }
      .lx-vu .wl-sw{ min-height:44px; } .lx-vu .wl-sw.us-r > .us-av{ width:28px; height:28px; font-size:12.5px; }
      .lx-sw{ all:unset; cursor:pointer; flex:none; width:46px; height:28px; border-radius:999px; background:rgba(128,134,142,.38); box-shadow:inset 0 0 0 1px rgba(255,255,255,.22); backdrop-filter:var(--hg-bfo, blur(6px)); position:relative; transition:background .18s; } .lx-sw i{ position:absolute; top:3px; left:3px; width:22px; height:22px; border-radius:50%; background:white; box-shadow:0 1px 4px rgba(0,0,0,.3); transition:transform .18s; }
      .lx-sw[aria-checked=true]{ background:var(--hg-accent); box-shadow:none; } .lx-sw[aria-checked=true] i{ transform:translateX(18px); } .lx-sw:disabled{ opacity:.45; cursor:default; } .lx-sw:focus-visible, .lx-a:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
      .lx-hb{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:flex-end; margin:-2px 0 6px 50px; } .lx-hbtn{ all:unset; cursor:pointer; box-sizing:border-box; border-radius:999px; background:var(--hg-tile-bg); height:36px; padding:0 14px; display:inline-flex; gap:6px; align-items:center; font-size:13px; } .lx-hbtn ha-icon{ width:18px; height:18px; } .lx-hbtn.ok{ background:var(--hg-accent); color:var(--hg-on-accent); font-weight:600; } .lx-hbtn:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; } .lx-hl{ font-size:12px; opacity:.7; color:inherit; }
      .lx-ok{ flex:none; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; background:var(--hg-accent); color:var(--hg-on-accent); margin-right:8px; } .lx-ok ha-icon{ width:16px; height:16px; } .lx-ap{ align-self:flex-end; height:38px; padding:0 16px; margin:0; }</style>`; },
  async act(page, b, a) { const h = page._hass;
    if (a.startsWith('lx-c') && a !== 'lx-cs') { const slug = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);
      if (a === 'lx-cn') { this.cv = { n: '', s: '', i: 'mdi:view-grid-outline', p: '', lay: 'grid', cm: 1, ct: 2, cd: 3, mw: 0 }; return page._eLook(); }
      if (a === 'lx-ce') { const c = ((HGL.data.wiz || {}).custom || []).find((x) => x.p === b.dataset.v); if (c) this.cv = Object.assign({}, c, { old: c.p, pw: (HGL.data.pw || {})[c.p] || 'narrow' }); return page._eLook(); }
      this.cvSync(page); const c = this.cv; if (!c) return;
      if (a === 'lx-cx') { this.cv = null; return page._eLook(); }
      if (a === 'lx-ci') { c.i = b.dataset.i; return page._eLook(); }
      if (a === 'lx-cl') { c.lay = b.dataset.l; return page._eLook(); }
      if (a === 'lx-cw') { c.pw = b.dataset.w; hgPwMark(b); if (c.old && page._config.view === c.old) { HGL.data.pw = Object.assign({}, HGL.data.pw, { [c.old]: c.pw }); page._panelGrid(page.getAttribute('mode')); } return; }
      const w = HGL.data.wiz = Object.assign({ ts: Date.now() }, HGL.data.wiz || {}), CU = (w.custom || []).slice(), cur = this.views();
      if (a === 'lx-cd') { if (!c.del) { c.del = 1; return page._eLook(); }
        w.custom = CU.filter((x) => x.p !== c.old); w.views = cur.order.filter((v) => cur.on.has(v) && v !== c.old && v !== 'dashboard'); w.ts = Date.now(); this.cv = null; this.pend = null; HGDraft.defer(page, { reload: true }); page._eToast(hgT('settings.applies_on_save')); return page._eLook(); }
      if (a === 'lx-cs2') { c.n = (c.n || '').slice(0, 24); c.p = c.old || slug(c.p || c.n); const taken = [...HG_VIEW_DEF.map((v) => v[0]), 'pokoj', ...CU.map((x) => x.p).filter((x) => x !== c.old)];
        c.err = !c.n ? hgT('oss.cv.err_name') : !c.p ? hgT('oss.cv.err_path') : taken.includes(c.p) ? hgT('oss.cv.err_path_taken', { path: c.p }) : !/^mdi:[a-z0-9-]+$/.test(c.i || 'mdi:x') ? hgT('oss.cv.err_icon') : '';
        if (c.err) return page._eLook();
        const rec = { p: c.p, n: c.n, ...(c.s ? { s: c.s.slice(0, 48) } : {}), i: c.i || 'mdi:view-grid-outline', lay: c.lay || 'grid', cm: +c.cm || 1, ct: +c.ct || 2, cd: +c.cd || 3, ...(+c.mw ? { mw: +c.mw } : {}) };
        const j = CU.findIndex((x) => x.p === c.old); if (j >= 0) CU[j] = rec; else CU.push(rec); w.custom = CU; HGL.data.pw = Object.assign({}, HGL.data.pw, { [rec.p]: c.pw || 'narrow' });
        const on = cur.order.filter((v) => cur.on.has(v) && v !== 'dashboard'); if (!c.old) on.push(rec.p); w.views = on; w.ts = Date.now(); this.cv = null; this.pend = null; HGDraft.defer(page, { reload: true }); page._eToast(hgT('settings.applies_on_save')); return page._eLook(); } }
    if (a === 'lx-hacs') { const p = HG_PKGS.find((x) => x.id === b.dataset.p); if (!p) return; this.hacsGo = Object.assign({}, this.hacsGo, { [p.id]: 1 }); if (!window.__hgDryRun) { if (hgHacsOpen(h, p.rid, p.repo)) page._editExit && page._editExit(false); } else page._eLook(); return; }
    if (a === 'lx-rf') { if (!window.__hgDryRun) location.reload(); return; }
    if (a === 'lx-vu') { this.vuOpen = this.vuOpen === b.dataset.v ? null : b.dataset.v; return page._eLook(); }
    if (a === 'lx-vut') { if (!page._isAdmin() || HGL.mode !== 'shared') return; const v = b.dataset.v, u = b.dataset.u; if (!v || !u || u === h.user.id) return;
      const w = HGL.data.wiz = Object.assign({}, HGL.data.wiz || { ts: Date.now() }), vu = w.vu = Object.assign({}, w.vu || {}), s = new Set(vu[v] || []);
      s.has(u) ? s.delete(u) : s.add(u); if (s.size) vu[v] = [...s]; else delete vu[v]; if (!Object.keys(vu).length) delete w.vu;
      HGDraft.defer(page); page._eToast(hgT('settings.applies_on_save')); return page._eLook(); }
    if (a === 'lx-v' || a === 'lx-up' || a === 'lx-dn') { const V = this.views(), v = b.dataset.v, o = V.order.slice(), on = new Set(V.on), i = o.indexOf(v);
      if (a === 'lx-v') on.has(v) ? on.delete(v) : on.add(v);
      if (a === 'lx-up' && i > 1) [o[i - 1], o[i]] = [o[i], o[i - 1]];
      if (a === 'lx-dn' && i < o.length - 1) [o[i + 1], o[i]] = [o[i], o[i + 1]];
      this.pend = { order: o, on }; return page._eLook(); }
    if (a === 'lx-apply' && this.pend) { const w = HGL.data.wiz || { ts: Date.now() };
      HGL.data.wiz = Object.assign({}, w, { views: this.pend.order.filter((v) => this.pend.on.has(v)), ts: Date.now() }); this.pend = null; HGDraft.defer(page, { reload: true }); page._eToast(hgT('settings.applies_on_save')); return page._eLook(); }
    if (a === 'lx-k') { const k = this.kio = Object.assign({}, this.kio || {}), key = b.dataset.k;
      if (key === 'kiosk_users') { const n = Object.assign({}, k.non_admin_settings || {}); n.kiosk = !n.kiosk; if (!n.kiosk) delete n.kiosk; if (Object.keys(n).length) k.non_admin_settings = n; else delete k.non_admin_settings; }
      else { k[key] = !k[key]; if (!k[key]) delete k[key]; }
      this.kpend = true; return page._eLook(); }
    if (a === 'lx-kapply') { this.kpend = false; const c = this.dash;
      if (!c || !c.strategy) { page._eToast(hgT('oss.toast.no_strategy')); return page._eLook(); }
      const nc = { ...c, strategy: { ...c.strategy } }; if (Object.keys(this.kio || {}).length) nc.strategy.kiosk_mode = this.kio; else delete nc.strategy.kiosk_mode;
      /* szkic: konfiguracja pulpitu zapisana dopiero przy Zapisz w trybie edycji */
      HGDraft.defer(page, { reload: true, dash: nc }); this.dash = nc; page._eToast(hgT('settings.applies_on_save')); return page._eLook(); }
    if (a === 'lx-cs') {
      const y = `# /config/www/custom-sidebar-config.yaml (Custom Sidebar)\norder:\n  - item: ${JSON.stringify('/' + HG_DASH())}\n    match: href\n    order: 1\n`;
      try { await navigator.clipboard.writeText(y); page._eToast(hgT('oss.toast.copied')); } catch (e) { page._eToast(hgT('oss.toast.copy_manually', { text: y.replace(/\n/g, ' ') })); } return; }
  },
};
window.HGLookX = HGLookX;

/* kiosk: drawer fix */
/* Kiosk Mode chowa <ha-sidebar>, ale nowy ha-drawer HA dalej rezerwuje --mdc-drawer-width (256px) -> ciemny pas. Zerujemy szerokość, gdy panel jest ukryty. */
(() => { if (window.__hgKfix) return; window.__hgKfix = 1;
  const tick = () => { if (document.hidden) return; try { const m = document.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main'); if (!m) return; const sb = m.shadowRoot?.querySelector('ha-sidebar');
    const hid = !!sb && getComputedStyle(sb).display === 'none'; const on = m.dataset.hgKfix === '1';
    if (hid && !on) { m.style.setProperty('--mdc-drawer-width', '0px'); m.dataset.hgKfix = '1'; } else if (!hid && on) { m.style.removeProperty('--mdc-drawer-width'); delete m.dataset.hgKfix; } } catch (e) { /* brak HA */ } };
  setInterval(tick, 1200); tick(); })();
queueMicrotask(() => { if (typeof HGL !== 'undefined') window.__hgL = HGL; });
