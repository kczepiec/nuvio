/* ===================== PAGE (tło, pasek górny, nagłówek, szyna, panel, hub) ===================== */
/* {time} i {date} w tytule / podtytule widoku: język interfejsu, format 12/24 h z profilu HA (time_format), odświeżane co minutę */
const hgClockFill = window.hgClockFill = (s, h, now = new Date()) => {
  s = String(s == null ? '' : s); if (!/\{(time|date)\}/.test(s)) return s;
  const loc = typeof HG_LOC === 'function' ? HG_LOC() : undefined, tf = h && h.locale ? h.locale.time_format : null;
  const t = new Intl.DateTimeFormat(loc, Object.assign({ hour: '2-digit', minute: '2-digit' }, tf === '12' ? { hour12: true } : tf === '24' ? { hour12: false } : {})).format(now);
  const d = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  return s.replace(/\{time\}/g, t).replace(/\{date\}/g, d);
};
const HG_SVG = {
  figma: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 2.8h3.5v6.1H8.5a3.05 3.05 0 0 1 0-6.1Z"/><path d="M12 2.8h3.5a3.05 3.05 0 0 1 0 6.1H12Z"/><path d="M8.5 8.9H12V15H8.5a3.05 3.05 0 0 1 0-6.1Z"/><circle cx="15.5" cy="11.95" r="3.05"/><path d="M8.5 15H12v3.05a3.05 3.05 0 1 1-3.5-3.05Z"/></svg>`,
  /* MDI v7 usunęło znaki marek: ha-icon z mdi:discord jest pusty. Ścieżka: Simple Icons (CC0). */
  discord: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`,
};
/* menu użytkownika: svg (Discord) albo ha-icon. mdi:discord zawsze rysuje znak, także w zapisanej konfiguracji bez pola svg. */
const hgMenuIcon = (m) => {
  const svg = m && ((m.svg && HG_SVG[m.svg]) || (m.icon === 'mdi:discord' && HG_SVG.discord));
  return svg || H.icon((m && m.icon) || 'mdi:circle-small');
};
/* browser_mod (zarejestrowana przeglądarka) kładzie na cały ekran niewidoczną warstwę .browser-mod-require-interaction (z-index 99999),
   która połyka dotknięcia, dopóki nie odblokuje odtwarzania wideo. Na tym dashboardzie przepuszczamy dotyk do przycisków,
   a gest (pointerup/click = moment aktywacji użytkownika) przekazujemy warstwie, żeby browser_mod i tak się odblokował. */
let hgBmUsers = 0, hgBmObs = null;
const hgBmFix = () => {
  const ov = document.querySelector('body > .browser-mod-require-interaction');
  if (ov && ov.style.pointerEvents !== 'none') ov.style.pointerEvents = 'none';
};
const hgBmFwd = (e) => {
  const ov = document.querySelector('body > .browser-mod-require-interaction');
  if (!ov || ov.__hgFwd) return;
  ov.__hgFwd = true;
  try { ov.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true, pointerType: e.pointerType || 'touch', clientX: e.clientX, clientY: e.clientY })); } catch (err) { /* stary WebView */ }
};
function hgBmPassThrough(on) {
  hgBmUsers = Math.max(0, hgBmUsers + (on ? 1 : -1));
  if (hgBmUsers === 1 && on) {
    hgBmFix();
    hgBmObs = new MutationObserver(hgBmFix); hgBmObs.observe(document.body, { childList: true });
    window.addEventListener('pointerup', hgBmFwd, true); window.addEventListener('click', hgBmFwd, true);
  } else if (hgBmUsers === 0 && !on) {
    if (hgBmObs) hgBmObs.disconnect(); hgBmObs = null;
    window.removeEventListener('pointerup', hgBmFwd, true); window.removeEventListener('click', hgBmFwd, true);
    const ov = document.querySelector('body > .browser-mod-require-interaction'); if (ov) ov.style.pointerEvents = '';
  }
}
/* ===== przejścia między widokami (uproszczone) =====
   HA trzyma widoki w pamięci (hui-root _viewCache): każdy widok ma własny hg-page, który przy przełączeniu jest odłączany/podłączany.
   Stary hg-page zapisuje w HGNav położenie wskaźników (zakładka, szyna) i panelu tuż przed zmianą adresu; nowy w connectedCallback /
   po pierwszym zbudowaniu przesuwa wskaźniki z poprzedniej pozycji (transform).
   Bez View Transitions API i bez kaskady kart: tylko przesunięcie wskaźników i 150 ms przenikanie treści (na dotyku bez animacji treści). */
const HG_NO_AREAS = {};   /* stały pusty obiekt: HGAreas.model zapamiętuje model po referencji konfiguracji */
const HG_EASE = 'cubic-bezier(.2,.8,.2,1)';
const hgReduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
/* bez View Transitions API (na iPadzie/telefonie zacinało): zwykła nawigacja; wejście widoku = 150 ms przenikania samej treści (bez dotyku) */
const hgTouch = () => !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
// etykieta paliwa w stylu naklejki na dystrybutorze: PB95 zielona, PB98 ciemnozielona, ON czarna
const hgFuelBadge = (l) => { const m = /^PB?\s*(\d+)/i.exec(l || ''); const on = /^ON/i.test(l || '');
  const cls = m ? (m[1] === '98' ? 'b98' : 'b95') : on ? 'bon' : 'bx';
  return `<span class="fb ${cls}" aria-hidden="true">${m ? `<small>Pb</small>${H.esc(m[1])}` : H.esc((l || '').slice(0, 3))}</span>`; };
const HG_BG_OK = new Set();   // zdekodowane zdjęcia tła (kolejne widoki ustawiają je od razu)
/* dopasowanie po całych segmentach ścieżki: /nuvio/test nie zapala się dla /nuvio/test2 (widoki o podobnych lub tych samych nazwach) */
const hgMatch = (m, path) => [].concat(m).some((x) => x && (path === x || path.startsWith(x.endsWith('/') ? x : x + '/')));
const HGNav = {
  prev: null,
  ready() {},
  go(path, nav) { if (HGShell.go(path)) return; return nav(); },
};
/* tryb lekki = rozmycie inne niż pełne (Ustawienia → Wygląd → Wydajność, HGPerf w hg-core) */
const hgLite = () => HGPerf.blur() !== 'full';
let HG_HELPERS = null;   // loadCardHelpers w pamięci -> budowa nowego widoku synchronicznie, bez pustej klatki
const HG_LOGO = `<span class="logo" aria-hidden="true"><ha-icon icon="mdi:home-assistant"></ha-icon></span>`;


/* ===== przełączanie widoków bez przebudowy przez HA =====
   Pomiar (ślad Chromium, CPU x4): każde przełączenie widoku przez HA to długie zadanie hui-root (przerysowanie paska zakładek
   wszystkich widoków, podmiana hui-view) + ponowne podpięcie strony – 60–320 ms. Tu: hg-page utworzony przez HA (root) zostaje,
   inne widoki dashboardu tworzymy sami (dopiero przy pierwszej wizycie = leniwie: mapa, kamery, roboty itd.) jako rodzeństwo roota
   i tylko podmieniamy. Adres: pushState bez location-changed (HA nie przebudowuje). Wstecz/Dalej i głęboki link: obsługuje HA
   (router HA i tak ustawia widok z adresu przy przejściu w historii), nowy root przejmuje stan. Gdy HA mimo to zmieni widok (inne źródło nawigacji), nowy root przejmuje stan. */
const HGShell = window.__hgShell || {
  // wyłączone: w pomiarze A/B (CPU x4) nie poprawiło p95 (tło stanu HA dominuje), a Wstecz i okna szczegółów i tak przebudowują widok w HA
  enabled: false,
  root: null, cur: null, pages: new Map(),
  _views() {
    let n = this.root;
    while (n && n.tagName !== 'HUI-ROOT') n = n.parentNode || n.host || null;
    const v = n && n.lovelace && n.lovelace.config && n.lovelace.config.views;
    return Array.isArray(v) ? v : null;
  },
  /* ścieżka -> [widok, konfiguracja hg-page] albo null (inny dashboard / nie nasz widok / przekierowanie) */
  _resolve(path) {
    if (!path || /[?#]/.test(path)) return null;
    const seg = path.split('/'), cur = location.pathname.split('/');
    if (seg[1] !== cur[1] || seg.length > 3) return null;
    const vs = this._views(); if (!vs) return null;
    const v = seg[2] ? vs.find((x) => x.path === seg[2]) : vs[0];
    const cc = v && v.cards && v.cards.length === 1 && v.cards[0];
    if (!cc || cc.type !== 'custom:hg-page' || cc.redirect || !(v.path || cc.view)) return null;
    return [cc.view || v.path, cc];
  },
  adopt(page) {
    if (this.root === page) return;
    // HA pokazał (nowy lub zapamiętany) widok: porzuć nasze strony przy starym roocie
    for (const [k, p] of this.pages) if (p !== this.root && p !== page) p.remove();
    if (this.root && this.root !== page) { this.root.style.display = ''; this.root._hgPend = null; }
    this.root = page; this.pages = new Map([[page._config.view, page]]); this.cur = page._config.view;
    page.style.display = ''; page._hgHidden = false;
    const h = page._hgPend; page._hgPend = null;
    if (h) queueMicrotask(() => { if (page._hass !== h && !page._hgHidden) page.hass = h; });
  },
  _ok() { return !!(this.enabled && this.root && this.root.isConnected && this.root.parentNode && this.root._hass && this.root._built); },
  go(path) {
    if (!this._ok() || window.__hgNoShell) return false;
    const r = this._resolve(path); if (!r || r[0] === this.cur) return false;
    history.pushState(null, '', hgKmPath(path));
    this._show(r[0], r[1]);
    return true;
  },
  /* pokazujemy widok inny niż root HA, a adres wskazuje dokładnie ten widok */
  held() {
    if (!this._ok() || window.__hgNoShell || this.cur === this.root._config.view) return false;
    const r = this._resolve(location.pathname); return !!(r && r[0] === this.cur);
  },
  _show(view, cfg) {
    const root = this.root, h = root._hgPend || root._hass;
    const old = this.pages.get(this.cur);
    if (old && old.isConnected) old._saveNav();
    if (old === root) { root._hgHide(); } else if (old) old.remove();
    this.cur = view;
    if (view === root._config.view) { root._hgShow(); return; }
    let pg = this.pages.get(view);
    if (!pg) { pg = document.createElement('hg-page'); pg._hgChild = true; pg.setConfig(Object.assign({}, cfg)); this.pages.set(view, pg); }
    pg.hass = h;
    root.parentNode.insertBefore(pg, root.nextSibling);
  },
  /* stan HA dociera tylko do roota: przekaż widocznej stronie */
  fwd(h) { const p = this.pages.get(this.cur); if (p && p !== this.root && p.isConnected) hgPass(p, h); },
};
if (!window.__hgShell) {
  window.__hgShell = HGShell;
  // inne skrypty (np. kiosk-mode) po popstate wysyłają location-changed; adres = widok pokazany przez nas -> HA nie przebudowuje
  window.addEventListener('location-changed', (e) => { if (HGShell.held()) e.stopImmediatePropagation(); }, true);
}

class HGPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    hgSelWatch(this.shadowRoot);
    this._notif = {};
    this._cards = [];
    this.shadowRoot.addEventListener('click', (e) => this._click(e));
    /* gest zmiany widoku (np. swipe-navigation na ha-app-layout) nie może startować z okien, arkuszy, suwaków, list przewijanych w poziomie ani wyborów:
       zatrzymujemy cały gest dotyku na granicy strony; przy otwartym oknie lub arkuszu blokujemy każdy gest */
    const sw = (e) => { if (e.type === 'touchstart') this._noSwipe = e.touches.length > 1 || this._swBlock(e); if (this._noSwipe) e.stopPropagation(); if (e.type === 'touchend' && !e.touches.length) setTimeout(() => { this._noSwipe = false; }, 0); };
    for (const ty of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) this.shadowRoot.addEventListener(ty, sw, { passive: true });
    const up = () => { clearTimeout(this._tt); this._tt = setTimeout(() => { this._touching = false; if (this._pendingPaint) { this._pendingPaint = false; this._sigTop = this._sigHub = null; this._paintTop(); this._paintHub(); if (this._bdgEl) this._paintBadges(); } }, 60); };
    this.shadowRoot.addEventListener('pointerdown', (e) => { if (e.composedPath().some((n) => n.classList && (n.classList.contains('top') || n.classList.contains('hub')))) { this._touching = true; clearTimeout(this._tt); this._tt = setTimeout(up, 1500); } }, { passive: true });
    this.shadowRoot.addEventListener('pointerup', up, { passive: true });
    this.shadowRoot.addEventListener('pointercancel', up, { passive: true });
    this._onResize = () => { this._layout(); if (this._built && this._hass) { this._paintRail(); this._paintTop(); this._tabsFit(); } };
    // zmiana adresu: jeśli prowadzi do innego widoku, ten hg-page zaraz zostanie odłączony -> zapisz wskaźniki do animacji, bez przerysowania
    this._onLoc = () => {
      this._syncPlay();
      if (!this._built) return;
      if (this._ownPath()) { if (this._config.room_head) this._paintHead(); return this._onResize(); }
      this._saveNav();
    };
    this._onDoc = (e) => { const cp = e.composedPath(); if (this._menuOpen && !cp.includes(this._menuEl) && !cp.includes(this._menuL)) { this._menuOpen = false; this._paintTop(true); } };
  }
  static getStubConfig() { return { view: 'dashboard', cards: [] }; }
  setConfig(c) {
    this._config = Object.assign({
      view: 'dashboard',   /* brand / title / subtitle: domyślne zależne od języka w miejscu użycia (_paintTop, _paintHead) */
      user: {}, tabs: [], rail: [], hub: null, toolbar: true, back: { back: true, fallback: '/' },
      panel: { columns: '1fr 1fr', rows: '150fr 92fr 48fr 152fr', areas: null, width: 438 }, cards: [], persons: [],
      notifications_action: { notifications: true }, mail_action: { notifications: true },
      menu: [], storage_key: 'home-glass', zoom: { min: 0.8, max: 1.3, step: 0.1 },
    }, c);
    if (this._config._hgLang) { window.__hgLang = this._config._hgLang; window.__hgLangOpt = this._config._hgLangOpt || ''; }   /* język wybrany w strategii; opcja language ma pierwszeństwo przed kreatorem */
    if (this._config.phone_nav) this._config.phone_nav = Object.assign({ main: [], more: [] }, this._config.phone_nav);
    this._built = false; this._w = null;
    this._pbgSync();
    if (this._hass) this._build();
  }
  /* tło panelu (#15): Wygląd > Tło panelu (app.pbg: false = bez tła wszędzie), wyjątek dla widoku (app.pbgv[widok] = 'on' | 'off'), panel_backdrop: false w YAML */
  _pbgSync() { const c = this._config; if (!c) return; const A = (window.__hgL && window.__hgL.data && window.__hgL.data.app) || {}, v = c.view && A.pbgv && A.pbgv[c.view];
    this.toggleAttribute('no-pbg', v === 'off' ? true : v === 'on' ? false : c.panel_backdrop === false || A.pbg === false); }
  set hass(h) {
    window.__hgHass = h; window.__hgPage = this;   /* język kart (hgCurLang) znany zanim karty dostaną hass; bieżąca strona dla poleceń z HA (#47) */
    if (window.HGWall) { try { HGWall.tick(h, this); } catch (e) { /* */ } }
    if (window.HGDeviceCmd) { try { HGDeviceCmd.tick(h); } catch (e) { /* */ } }   /* polecenia z automatyzacji: zdarzenie nuvio_command i encja input_text */
    if (window.HGAssistUI) { try { HGAssistUI.bind(h, this); } catch (e) { /* */ } }   /* okno Assist: hass dla rozmowy i skrót klawiszowy */   /* tryb tabletu ściennego: bezczynność i czujnik ruchu */
    if (typeof HGTheme !== 'undefined') HGTheme.pick(h);
    // root ukryty (widoczny inny widok dashboardu): tylko zapamiętaj i przekaż dalej
    if (HGShell.root === this && this._hgHidden) { this._hgPend = h; HGShell.fwd(h); return; }
    const first = !this._hass, old = this._hass;
    this._hass = h;
    if (this._editing && this._eSheetEl && old && old.states !== h.states) { try { this._ePvTick(h); } catch (e) { /* */ } }
    if (!this._config) return;
    if (this._config.redirect) { this._redirect(); return; }
    if (!this._built) this._build();
    if (this._built) this._pbgSync();   /* zmiana w Wyglądzie na innym widoku */
    for (const el of this._cards) hgPass(el, h);
    if (this._wxEl) hgPass(this._wxEl, h);
    if (first) { this._subscribe(); HGVer.check(h, true); HGLang.sync(h, this); }
    // górny pasek / hub zależą tylko od kilku encji -> przerysuj tylko gdy zmienił się ich obiekt stanu
    const w = this._watch();
    if (!old || old.user !== h.user || w.some((e) => old.states[e] !== h.states[e])) { this._paintTop(); this._paintHub(); if (this._bdgEl) this._paintBadges(); }
    if (this._fuelEl && (!old || this._fuelEnts().some((e) => old.states[e] !== h.states[e]))) this._paintFuel();
    if (this._config.room_head && this._built) this._paintHead();
    else if (this._built && (!old || this._headEnts().some((e) => old.states[e] !== h.states[e]))) this._paintHead();
  }
  _watch() {
    if (this._w) return this._w;
    const c = this._config, ui = this._userInfo();
    const set = new Set([ui.person].filter(Boolean));
    const addB = (b) => { if (!b) return; for (const e of [...(b.count_on || []), ...(b.count_active || [])]) set.add(e); for (const c of b.chips || []) addB(c); };
    for (const t of c.tabs || []) addB(t.badge);
    for (const b of c.badges || []) addB(b);
    for (const p of (c.hub && c.hub.persons) || []) set.add(p);
    return (this._w = [...set]);
  }
  _setHTML(el, html) {
    if (el._hgHtml === html) return false;
    if (this._touching) { this._pendingPaint = true; return false; }
    el._hgHtml = html; el.innerHTML = html; return true;
  }
  get hass() { return this._hass; }
  _hgHide() {
    this._hgHidden = true; this.style.display = 'none';
    if (this._sheetOpen) this._openSheet(false);
    if (this._menuOpen) { this._menuOpen = false; this._paintTop(true); }
    this._syncPlay();
  }
  _hgShow() {
    this._hgHidden = false; this.style.display = '';
    const h = this._hgPend; this._hgPend = null;
    if (h) this.hass = h;
    this._syncPlay(); this._layout(); this._enter(); if (window.HGVLock) HGVLock.guard(this);
    requestAnimationFrame(() => requestAnimationFrame(hgOffFlush));   // karty z ukrytego widoku: nadrób zaległe zmiany stanu
  }
  /* adres widoku: ścieżka albo numer widoku (/dashboard-nuvio/0); przy numerze HA pokazuje tylko podłączony widok, więc podłączona strona jest swoja */
  _ownPath() { const seg = location.pathname.split('/'); return seg[2] === this._config.view || (!seg[2] && this._config.view === 'dashboard') || (/^\d+$/.test(seg[2] || '') && this.isConnected); }
  _saveNav() {
    if (!this.isConnected || !this._panelEl) return;
    const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return b.width ? { x: b.left, y: b.top, w: b.width, h: b.height } : null; };
    const ti = this._topEl.querySelector('.tab.act'), ri = this._railEl.querySelector('.ri.act');
    HGNav.prev = { t: performance.now(), view: this._config.view, tab: R(ti), tabI: ti ? [...ti.parentNode.children].indexOf(ti) : -1,
      rail: R(ri), panel: R(this._panelEl), mode: this.getAttribute('mode') };
  }
  /* stary adres widoku (np. /devices -> /multimedia): podmiana w historii bez dodatkowego wpisu */
  _redirect() {
    if (!this.isConnected || !this._ownPath() || this._redirTo === location.pathname) return;
    this._redirTo = location.pathname;
    history.replaceState(null, '', this._config.redirect + location.search);
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: true } }));
  }
  connectedCallback() {
    if (this._config && this._config.redirect) { this._redirTo = null; return this._redirect(); }
    hgKmScreen.page(1);
    if (!this._hgChild && this._config) HGShell.adopt(this);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('location-changed', this._onLoc);
    window.addEventListener('popstate', this._onLoc);
    document.addEventListener('click', this._onDoc, true);
    this._onVis = this._onVis || (() => { this._syncPlay(); if (!document.hidden) { HGVer.check(this._hass); this._glassRefresh(); } });
    document.addEventListener('visibilitychange', this._onVis);
    this._syncPlay();
    this._hglSub = this._hglSub || (() => { if (!this._editing && this._built && this._hass) this._paintTop(); if (this._built && !this._building && !this._editing && this._layoutSig() !== this._lsig) this._build(); });
    HGL.subs.add(this._hglSub);
    if (this._built && window.HGVLock) HGVLock.guard(this);
    this._onLang = this._onLang || (() => this._langChanged());
    window.addEventListener('hg-lang', this._onLang);
    hgBmPassThrough(true);
    this.toggleAttribute('lite', hgLite());
    this._onPerf = this._onPerf || (() => { const l = hgLite(); if (l !== this.hasAttribute('lite')) { this.toggleAttribute('lite', l); if (this._built && !this._editing) this._build(); } });
    window.addEventListener('hg-perf', this._onPerf);
    this._ro = new ResizeObserver(() => this._layout()); this._ro.observe(this);
    if (this._hass && !this._unsub) this._subscribe();
    this._layout();
    if (this._built) this._enter();     // widok z pamięci HA: podłączony ponownie
  }
  /* zmiana języka bez przeładowania: strona przerysowana od razu (karty, pasek); konfiguracja strategii w innym języku (etykiety nawigacji,
     tytuły widoków: katalog spóźniony) -> HA generuje dashboard od nowa (config-refresh, HGLang.stale) */
  _langChanged() { if (this._editing || !this._hass || !this._config || this._config.redirect) return; this._menuOpen = false; HGLang.stale(this); this._build(); }
  disconnectedCallback() {
    clearTimeout(this._headT); this._headT = null;
    if (window.HGVLock && HGVLock.page === this && HGVLock.el) HGVLock.close();
    HGL.subs.delete(this._hglSub); window.removeEventListener('hg-lang', this._onLang); window.removeEventListener('hg-perf', this._onPerf);
    if (this._editing) this._editExit(this._eDirty());   /* przejście do innego widoku / wstecz w trakcie edycji: zmiany zapisane, nie odrzucone */
    document.removeEventListener('keydown', this._sheetKey, true); document.removeEventListener('keydown', this._menuKey, true); this._menuOpen = false;
    if (this._config && this._config.redirect) return;
    hgKmScreen.page(-1);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('location-changed', this._onLoc);
    window.removeEventListener('popstate', this._onLoc);
    document.removeEventListener('click', this._onDoc, true);
    document.removeEventListener('visibilitychange', this._onVis);
    this.toggleAttribute('paused', true);
    if (this._sheetOpen) { this._sheetOpen = false; clearTimeout(this._sheetT); if (this._sheetL) { this._sheetL.classList.remove('in'); this._sheetL.removeAttribute('open'); this._sheetL.innerHTML = ''; } }
    hgBmPassThrough(false);
    this._ro && this._ro.disconnect(); this._pro && this._pro.disconnect();
    if (this._unsub) { this._unsub.then((u) => u && u()).catch(() => {}); this._unsub = null; }
  }
  _subscribe() {
    if (!this._hass || this._unsub || !this.isConnected) return;
    try {
      this._unsub = this._hass.connection.subscribeMessage((m) => {
        if (m.type === 'current') this._notif = { ...m.notifications };
        else if (m.type === 'added' || m.type === 'updated') this._notif = { ...this._notif, ...m.notifications };
        else if (m.type === 'removed') { const n = { ...this._notif }; for (const k of Object.keys(m.notifications)) delete n[k]; this._notif = n; }
        this._paintTop(true);
      }, { type: 'persistent_notification/subscribe' });
      this._unsub.catch(() => { this._unsub = null; });
    } catch (e) { /* brak subskrypcji – brak kropki */ }
  }
  _ls(k, v) { const key = this._config.storage_key + ':' + k; if (v === undefined) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } } try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* pamięć zablokowana / pełna */ } }

  /* ---------- tryb i skala ---------- */
  _layout() {
    if (!this._config) return;
    const W = this.getBoundingClientRect().width || window.innerWidth, Hh = window.innerHeight;
    let mode, u;
    if (W < 600) { mode = 'phone'; u = Math.max(0.92, Math.min(1.15, W / 375)); }
    /* poziomo (od 900 px i proporcji 1,2) zawsze układ szeroki, także na tablecie dotykowym; pionowo układ tabletu */
    else if (W >= 900 && W / Hh >= 1.2) { mode = 'wide'; u = Math.min(W / 912, Hh / 597); }
    /* skala tabletu ograniczona też wysokością, żeby niskie okno nie rozciągało paneli */
    else { mode = 'tablet'; u = Math.max(1, Math.min(1.45, W / 620, Hh / 640)); }
    const z = this._zoom();
    if (this.getAttribute('mode') !== mode) { this.setAttribute('mode', mode); this._placeWx(); if (this._headEl && this._config && !this._config.room_head && this._hass) this._headVis(this._headConf()); }
    this.style.setProperty('--hg-u0', u.toFixed(4) + 'px');
    this.style.setProperty('--hg-zoom', z);
    if (this._panel) this._panelGrid(mode);
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.toggleAttribute('touch', touch);
    if (mode === 'phone' || (mode === 'tablet' && touch)) this.style.setProperty('--hg-tgt', '44px'); else this.style.removeProperty('--hg-tgt');
    if (this._built) { this._placeInd(); this._railClear(); }
    if (this._panelEl && this._config.panel.fit) {
      // panel dopasowany do treści (Kamery): dostępna wysokość dla kafli w trybie wide, żeby zmieścić się bez przewijania
      if (mode === 'wide') {
        const top = this._panelEl.getBoundingClientRect().top, cs = getComputedStyle(this._panelEl);
        const pb = parseFloat(getComputedStyle(this.shadowRoot.querySelector('.page')).paddingBottom) || 19 * u;
        const av = Hh - top - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - pb;
        this._panelEl.style.setProperty('--hg-avail-h', Math.max(160, Math.floor(av)) + 'px');
      } else this._panelEl.style.removeProperty('--hg-avail-h');
    }
    if (this._panelEl) {
      for (const el of this._cards) { if ('ontouchstart' in window || navigator.maxTouchPoints > 0) el.setAttribute('touch', ''); }
    }
  }
  _hasTiles2() { return !!(this._hasTiles || this._autoScroll); }
  /* stały układ (wide, bez przewijania): gdy treść karty nie mieści się w swoim polu -> panel przechodzi w przewijanie */
  _fitCheck() {
    if (this.hasAttribute('scroll') && this.getAttribute('mode') !== 'phone' && this._cardWraps) for (const w of this._cardWraps) { const c = w.firstElementChild; if (!c || w.hidden) continue;
      const need = c.scrollHeight; if (need > w.clientHeight + 4 && need > (w._hgMinFit || 0)) { w._hgMinFit = need; w.style.minHeight = need + 'px'; } }
    if (this._autoScroll || this._config.panel.scroll || this.getAttribute('mode') === 'phone' || !this._cardWraps) return;
    const over = this._cardWraps.some((w) => { const c = w.firstElementChild; if (!c || w.hidden) return false; const r = c.shadowRoot && c.shadowRoot.querySelector('ha-card, .root > *'); const el = r || c; return el.scrollHeight > el.clientHeight + 4 || c.scrollHeight > w.clientHeight + 4; });
    if (over) { this._autoScroll = true; this._layout(); }
  }
  _zoom() { const z = Number(this._ls('zoom')); return z && isFinite(z) ? z : 1; }
  _moreUpd() {
    if (this._moreRaf) return;
    this._moreRaf = requestAnimationFrame(() => {
      this._moreRaf = 0; const el = this._panelEl, b = this._moreEl; if (!el || !b) return;
      const can = this.hasAttribute('scroll') && this.getAttribute('mode') === 'wide' && el.scrollHeight - el.clientHeight - el.scrollTop > 12;
      b.hidden = !can; this._fitCheck();
    });
  }
  _mas() { const el = this._panelEl; if (!el || !this._cardWraps) return;
    if (!this._masRO) this._masRO = new ResizeObserver(() => { cancelAnimationFrame(this._masF); this._masF = requestAnimationFrame(() => this._masOn && this._masLay()); });
    for (const w of this._cardWraps) { const c = w.firstElementChild; if (c && !c._masObs) { c._masObs = 1; this._masRO.observe(c); } } this._masLay(); }
  /* własne widoki: jawne rozmieszczenie w rzędach 4 px. masonry: karta do najkrótszej kolumny; cols: kolumny po kolei (bez wyrównania rzędów) */
  _masLay() { const el = this._panelEl, cs = getComputedStyle(el), gap = parseFloat(cs.rowGap) || 0, n = Math.max(1, cs.gridTemplateColumns.split(' ').filter(Boolean).length), cols = this._masMode === 'cols';
    const aw = el.querySelector(':scope > .hge-addw'), cw = new Set(this._cardWraps), W = [...el.children].filter((w) => cw.has(w) && !w.hidden && w.style.display !== 'none' && w.firstElementChild).concat(aw ? [aw] : []);   /* kolejność DOM (po przeciągnięciu w edycji), nie kolejność budowania */
    for (const w of W) { if (w.dataset.masGc == null) w.dataset.masGc = w.style.gridColumn || ''; w.style.minHeight = '0px'; w.style.gridRow = ''; w.style.gridRowEnd = 'span 1'; }
    const spanOf = (w) => { const g = w.dataset.masGc; if (/1\s*\/\s*-1/.test(g)) return n; const m = /span\s+(\d+)/.exec(g); return Math.min(n, m ? +m[1] : 1); };
    const hs = W.map((w) => { const c = w.firstElementChild, r = c.shadowRoot && c.shadowRoot.querySelector('ha-card, .hn, .root'); return Math.max(c.scrollHeight, r ? r.scrollHeight : 0, 40); });
    const H = new Array(n).fill(0); let cur = 0;
    W.forEach((w, i) => { const s = spanOf(w), k = Math.max(1, Math.ceil((hs[i] + gap) / (4 + gap))); let col = 0;
      if (s >= n) col = 0;
      else if (cols) { if (cur + s > n) cur = 0; col = cur; cur = (cur + s) % n; }
      else { let best = Infinity; for (let c = 0; c + s <= n; c++) { const t = Math.max(...H.slice(c, c + s)); if (t < best) { best = t; col = c; } } }
      const top = Math.max(...H.slice(col, col + s)); for (let c = col; c < col + s; c++) H[c] = top + k;
      w.style.gridColumn = `${col + 1} / span ${s}`; w.style.gridRow = `${top + 1} / span ${k}`; }); }
  _pwSet() { const L = window.__hgL, m = (L && L.data && L.data.pw) || {}; return m[this._config.view] || null; }
  _pwCur() { return this._pwSet() || (this._config.panel && this._config.panel.wide ? 'wide' : 'narrow'); }
  _panelGrid(mode) {
    const p = this._config.panel, el = this._panelEl;
    if (mode === 'phone') {
      el.style.gridTemplateColumns = p.phone_columns || '1fr'; el.style.gridTemplateRows = ''; el.style.gridTemplateAreas = p.phone_areas || '';
    } else {
      const tablet = mode === 'tablet' && p.tablet;
      // widok o stałym układzie z dodanymi kaflami: wiersze z treści (jak tablet) + przewijanie
      const q = tablet || (this._hasTiles2() && !p.scroll && p.tablet) ? Object.assign({}, p, p.tablet, this._hasTiles2() && !p.scroll ? { auto_rows: 'auto', rows: String((p.tablet && p.tablet.rows) || p.rows || '').replace(/minmax\(([^,()]+|[^,()]*\([^()]*\)[^,()]*),\s*\d+(\.\d+)?fr\)/g, 'minmax($1, max-content)').replace(/(^|\s)\d+(\.\d+)?fr(?=\s|$)/g, '$1max-content') } : {}) : p;
      el.style.gridTemplateColumns = q.columns || '1fr 1fr';
      el.style.gridTemplateRows = q.rows || '';
      el.style.gridTemplateAreas = q.areas || '';
      // przewijany panel o stałej wysokości: wiersze „auto” ściskałyby karty do min-height -> max-content (wysokość z treści)
      el.style.gridAutoRows = q.auto_rows === 'auto' && (p.scroll || this._hasTiles2()) ? 'max-content' : (q.auto_rows || 'minmax(calc(var(--k) * 56), auto)');
    }
    if (!this._cardWraps) return;
    this._cardWraps.forEach((w, i) => {
      const cc = (this._lc || this._config.cards)[i] || {};
      w.style.gridArea = mode === 'phone' && !this._config.panel.phone_areas ? '' : (cc.area || '');
      const fixed = mode === 'wide' && !this._config.panel.scroll && !this._hasTiles2();
      w.style.setProperty('--hg-min-h', fixed ? '0px' : `calc(var(--k) * ${cc.min_h ?? 60})`);
      w.style.minHeight = fixed ? '0px' : `calc(var(--k) * ${cc.min_h ?? 60})`;
      /* szerokość sekcji z ustawień (Pełna szerokość / Połowa); na telefonie zawsze pełna */
      const wv = (() => { try { const c = HGL.get(this._pageScope()).conf[w.dataset.hgk]; return c && c.w; } catch (e) { return ''; } })();
      const span = wv === 'full' ? 'full' : wv === 'half' ? 1 : cc.span;
      if (span === 'full') w.style.gridColumn = '1 / -1';
      else if (wv === 'half' && mode !== 'phone') w.style.gridColumn = 'span 1';
      else if (mode !== 'phone' && span && !cc.area) w.style.gridColumn = `span ${span}`;
      else if (!cc.area || mode === 'phone') w.style.removeProperty('grid-column');
    });
    /* szerokość panelu wybrana dla widoku (wąski / cała szerokość); wąski panel mieści najwyżej 2 kolumny */
    const pw = this._pwSet(), wd = pw ? pw === 'wide' : !!p.wide;
    if (pw === 'narrow' && mode === 'wide' && !p.areas) { const cs = el.style.gridTemplateColumns || '', m = /repeat\((\d+)/.exec(cs), n = m ? +m[1] : cs.split(/\s+/).filter(Boolean).length; if (n > 2) el.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))'; }
    { const cs = el.style.gridTemplateColumns || '', m = /^repeat\((\d+), minmax\(0(px)?, 1fr\)\)$/.exec(cs); if (m && mode !== 'phone' && !p.areas) el.style.setProperty('--hg-vcols-tpl', 'repeat(' + m[1] + ', minmax(0, 1fr))'); else el.style.removeProperty('--hg-vcols-tpl'); } /* „dense” dosuwa wąskie karty w dziury, ale tylko w układzie domyślnym: po zmianie kolejności karty stoją dokładnie w kolejności użytkownika (inaczej przeniesiona karta wracała na stare miejsce) */
    /* dodane komponenty (stos, siatka, karta YAML, #17): bez „dense”, bo szerokie kontenery przeskakiwały przed wcześniejsze karty; stoją w kolejności dodania i przeciągania */
    const ord = (() => { try { const sc = this._pageScope(); return !!sc && (HGL.get(sc).order.length > 0 || HGL.get(sc + ':tiles').added.length > 0); } catch (e) { return false; } })();
    el.style.gridAutoFlow = (mode !== 'phone' && !p.areas) ? (ord ? 'row' : 'row dense') : '';
    /* własne widoki: maks. szerokość treści, kolumny bez wyrównania rzędów, masonry (rzędy 4 px, span z wysokości treści) */
    el.style.maxWidth = p.max_w ? p.max_w + 'px' : ''; el.style.marginInline = p.max_w ? 'auto' : ''; el.style.width = p.max_w ? '100%' : '';
    el.style.alignItems = p.align === 'start' || p.masonry || p.flow === 'cols' ? 'start' : p.flow === 'grid' ? 'stretch' : '';
    const mm = p.masonry ? 'masonry' : p.flow === 'cols' ? 'cols' : '';
    if (mm && mode !== 'phone') { el.style.gridAutoRows = '4px'; this._masMode = mm; this._masOn = true; this._mas(); } else if (this._masOn) { this._masOn = false; this._masMode = ''; for (const w of this._cardWraps) { w.style.gridRowEnd = ''; w.style.gridRow = ''; if (w.dataset.masGc != null) { w.style.gridColumn = w.dataset.masGc; delete w.dataset.masGc; } } }
    this.toggleAttribute('scroll', !!(p.scroll || this._hasTiles2()));
    this.toggleAttribute('wide-panel', wd);
    this.toggleAttribute('fit-panel', !!p.fit);
    if (this._pro) { this._pro.disconnect(); this._pro.observe(el); for (const k of el.children) this._pro.observe(k); }
    this._moreUpd();
  }

  /* ---------- budowa ---------- */
  /* podpis zapisanego układu tego widoku: późno wczytane dane użytkownika (HGL.load > 900 ms) -> przebudowa */
  _layoutSig() { const sc = this._pageScope && this._pageScope(); return sc ? JSON.stringify([HGL.data.s[sc] || null, HGL.data.s[sc + ':tiles'] || null]) : ''; }
  async _build() {
    if (this._building) { this._rebuild = true; return; } this._building = true; this._rebuild = false;
    const c = this._config;
    const sr = this.shadowRoot;
    sr.innerHTML = `<style>${HG_BASE}${this._css()}</style>
      <div class="bg" aria-hidden="true"></div><div class="shade" aria-hidden="true"></div>
      <div class="page">
        <header class="top"></header>
        <section class="head"></section>
        <nav class="rail" aria-label="${hgT('page.sections')}"></nav>
        <main class="panel" aria-label="${H.esc(c.view)}"></main>
        <div class="tools" role="toolbar"></div>
        <aside class="hub"></aside>
        <button class="more" data-act="pmore" hidden aria-label="${hgT('page.scroll_down')}" title="${hgT('page.more_below')}">${H.icon('mdi:chevron-down')}</button>
        ${c.back ? `<button class="back" data-act="back" aria-label="${hgT('common.back')}" title="${hgT('common.back')}">${H.icon('mdi:chevron-left')}</button>` : ''}
      </div>
      <div class="layer menu-l"></div><div class="layer sheet-l"></div>`;
    this._menuL = sr.querySelector('.menu-l'); this._sheetL = sr.querySelector('.sheet-l');
    this._topEl = sr.querySelector('.top'); this._headEl = sr.querySelector('.head'); this._railEl = sr.querySelector('.rail');
    this._moreEl = sr.querySelector('.more');
    this._panelEl = sr.querySelector('.panel'); this._toolsEl = sr.querySelector('.tools'); this._hubEl = sr.querySelector('.hub');
    this._panel = true;
    // przewijany panel: wskaźnik „więcej poniżej” (bez gradientu/maski – maska tworzyłaby nowy backdrop root dla szkła)
    this._panelEl.addEventListener('scroll', () => this._moreUpd(), { passive: true });
    /* pusty stan widoku na żywo: po usunięciu, ukryciu, cofnięciu, w edycji i bez niej */
    new MutationObserver(() => this._vEmpty()).observe(this._panelEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'hidden'] }); this._vEmpty();
    this._pro = this._pro || new ResizeObserver(() => this._moreUpd());
    const bgc = c.background || {};
    // zdjęcie tła ustawiane dopiero po zdekodowaniu, potem jednorazowe odświeżenie szkła: Chrome (GPU, Retina) potrafi zostawić
    // nieaktualny kafel backdrop-filter sprzed dorysowania zdjęcia (pas z twardą krawędzią do czasu zmiany rozmiaru okna)
    this._bgDef = [['--hg-bg-wide', bgc.wide], ['--hg-bg-portrait', bgc.portrait]];
    const setBg = (k, u) => { if (!u || (HGL.data.app && HGL.data.app.bg)) return; const v = `url('${u}')`;
      if (HG_BG_OK.has(u)) { this.style.setProperty(k, v); return; }
      const im = new Image(); im.decoding = 'async'; im.src = u;
      const done = () => { HG_BG_OK.add(u); this.style.setProperty(k, v); this._glassRefresh(); };
      (im.decode ? im.decode() : Promise.reject()).then(done, () => { im.onload = done; im.onerror = done; if (im.complete) done(); }); };
    setBg('--hg-bg-wide', bgc.wide); setBg('--hg-bg-portrait', bgc.portrait);
    if (bgc.position) this.style.setProperty('--hg-bg-pos', bgc.position);
    this.toggleAttribute('panel-hidden', !!this._ls('hidden:' + c.view));
    // karty panelu
    const helpers = HG_HELPERS || (window.loadCardHelpers ? (HG_HELPERS = await window.loadCardHelpers()) : null);
    this._cards = []; this._cardWraps = [];
    if (!HGL.loaded && this._hass) await Promise.race([HGL.load(this._hass), new Promise((r) => setTimeout(r, 900))]);
    if (this._config._hgAuto && HGL.loaded && !HGL.failed && !HGL.data.wiz && this._hass && this._hass.user && this._hass.user.is_admin && typeof HGWizard !== 'undefined') setTimeout(() => HGWizard.open(this), 400);
    this._pbgSync();   /* układ z HA mógł dojść dopiero teraz (Wygląd: tło panelu) */
    const LC = this._lc = this._applyLayout(c.cards); this._hasTiles = LC.some((x) => x._tiles); this._autoScroll = false;
    if (this._pageScope()) this._panelEl.dataset.hgl = this._pageScope();
    for (const cc of LC) {
      const w = document.createElement('div'); w.className = 'cw'; w.dataset.hgk = cc._k;
      if (cc._hid) { w.hidden = true; w.style.display = 'none'; }
      let el;
      let conf = Object.assign({}, cc); delete conf.area; delete conf.min_h; delete conf.span; delete conf._k; delete conf._hid; delete conf._tiles; delete conf._hgid;
      conf = hgFromHA(conf);   // grid / vertical-stack / horizontal-stack z HA -> kontenery Nuvio (keep_ha: true zostawia kartę HA)
      try {
        if (helpers) el = helpers.createCardElement(conf);
        else { el = document.createElement(conf.type.replace('custom:', '')); el.setConfig(conf); }
      } catch (e) { el = document.createElement('div'); el.textContent = hgT('page.card_error', { error: e.message }); }
      try { if (this._hass) el.hass = this._hass; } catch (e) { console.error('home-glass card', conf.type, e); }
      w.appendChild(el); this._panelEl.appendChild(w);
      this._cards.push(el); this._cardWraps.push(w);
    }
    this.toggleAttribute('norail', !(c.rail || []).length); this.toggleAttribute('studio', !!c.studio); this._stIds = null; this._navParam();
    this._built = true; this._building = false; this._lsig = this._layoutSig();
    if (window.HGVLock) HGVLock.guard(this);   /* blokada widoku PIN-em (#17) */
    if (this._rebuild || this._config !== c) { this._rebuild = false; return this._build(); }   /* setConfig w trakcie pierwszej (asynchronicznej) budowy */
    this._sigTop = this._sigRail = this._sigHub = null;
    this._paintHead(); this._paintTools();
    this._paintTop(true); this._paintRail(true); this._paintHub(true);
    this._layout();
    if (this.isConnected) this._enter();
  }
  /* wejście widoku: odśwież wskaźniki (bez zbędnego przerysowania), animacja z położenia poprzedniego widoku */
  /* jednorazowe przemalowanie warstw szkła (backdrop-filter none -> przywrócenie w kolejnej klatce) */
  /* ukrycie/pokazanie panelu jako jednej całości: animacja tylko opacity + transform samego panelu (tło z rozmyciem, karty i cień
     są jego zawartością, więc znikają razem); po zakończeniu visibility:hidden. Reduced-motion: bez ruchu, lite: krótki fade. */
  _panelVis(hide) {
    const p = this._panelEl; if (!p) return;
    if (this._pBusy === hide) return;                                  // ten sam kierunek już trwa (podwójne zdarzenie)
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches, lite = this.hasAttribute('lite');
    const tok = this._pTok = (this._pTok || 0) + 1;
    if (this._pAn) { try { this._pAn.cancel(); } catch (e) {} this._pAn = null; }
    if (!p.animate) { this.toggleAttribute('panel-hidden', hide); return; }
    this._pBusy = hide;
    HG_FREEZE.on = true;                                               // karty nie przerysowują DOM w trakcie animacji
    this.setAttribute('panel-anim', '');                               // potomkowie bez rozmycia i animacji; tylko panel animowany (opacity + transform)
    if (!hide) this.removeAttribute('panel-hidden');
    const moved = rm || lite ? 'none' : 'translateX(24px) scale(.98)';
    const an = this._pAn = p.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: moved }],
      { duration: rm ? 120 : lite ? 160 : 220, easing: hide ? 'cubic-bezier(.4,0,1,1)' : 'cubic-bezier(0,0,.2,1)', direction: hide ? 'normal' : 'reverse', fill: 'both' });
    an.finished.then(() => {
      if (tok !== this._pTok) return;                                 // nowsze wywołanie przejęło panel
      if (hide) this.setAttribute('panel-hidden', '');
      an.cancel(); this._pAn = null; this._pBusy = undefined;
      requestAnimationFrame(() => { if (tok === this._pTok) this.removeAttribute('panel-anim'); HG_FREEZE.release(); });
    }, () => { if (tok === this._pTok) { this._pBusy = undefined; this.removeAttribute('panel-anim'); HG_FREEZE.release(); } });
  }
  _glassRefresh() {
    const sr = this.shadowRoot; if (!sr || this._grRaf) return;
    this._grRaf = requestAnimationFrame(() => requestAnimationFrame(() => {
      this._grRaf = 0;
      if (this.hasAttribute('panel-anim')) return;
      const els = sr.querySelectorAll('.tabs, .rail, .more, .rback');   // panel celowo pominięty (mrugnięcie szkła)
      els.forEach((e) => { e.style.setProperty('backdrop-filter', 'none'); e.style.setProperty('-webkit-backdrop-filter', 'none'); });
      requestAnimationFrame(() => els.forEach((e) => { e.style.removeProperty('backdrop-filter'); e.style.removeProperty('-webkit-backdrop-filter'); }));
    }));
  }
  _enter() {
    if (!this._hass) return;
    this._paintTop(); this._paintRail();
    const p = HGNav.prev; HGNav.prev = null;
    const fresh = p && p.view !== this._config.view && performance.now() - p.t < 2500 && p.mode === this.getAttribute('mode');
    if (fresh && !hgReduced() && this._panelEl.animate) this._animIn(p);
    HGNav.ready();
    clearTimeout(this._grT); this._grT = setTimeout(() => this._glassRefresh(), 260);   // po przejściu widoku
  }
  _animIn(p) {
    // wskaźnik zakładek i szyny przesuwa się z poprzedniej pozycji: tylko transform, mały element bez rozmycia
    const flip = (el, from) => {
      if (!el || !from) return;
      const b = el.getBoundingClientRect(); if (!b.width) return;
      const dx = from.x - b.left, dy = from.y - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      const base = el.style.transform || 'none';
      el.animate([{ transform: `translate(${dx}px, ${dy}px) ${base === 'none' ? '' : base}` }, { transform: base }], { duration: 200, easing: HG_EASE });
    };
    flip(this._topEl.querySelector('.ind'), p.tab);
    flip(this._railEl.querySelector('.rind'), p.rail);
    // treść: nagłówek przenika, karty tylko lekko wjeżdżają (bez panelu, bez rozmycia, bez kolejkowania); na dotyku bez przejścia.
    // Karty bez opacity: animowane opacity na .cw robi z niego backdrop root i blur kart (backdrop-filter) znika na czas przejścia.
    if (hgTouch()) return;
    const o = { duration: 150, easing: 'ease-out' };
    this._headEl.animate([{ opacity: 0 }, { opacity: 1 }], o);
    this._cardWraps.forEach((w) => w.animate([{ transform: 'translateY(6px)' }, { transform: 'none' }], o));
  }
  /* animacje ciągłe tylko w widocznym widoku i karcie przeglądarki (--hg-play dziedziczone do kart) */
  _syncPlay() {
    const on = this.isConnected && !document.hidden && this._config && this._ownPath();
    this.toggleAttribute('paused', !on);
  }
  _userInfo() {
    const c = this._config, u = (this._hass && this._hass.user) || {};
    if (!this._pe || this._pe[0] !== u.id) {
      const pe = Object.keys(this._hass.states).find((k) => k.startsWith('person.') && this._hass.states[k].attributes.user_id === u.id);
      this._pe = [u.id, pe || null];
    }
    const pe = this._pe[1] ? { entity_id: this._pe[1] } : null;
    const full = c.user.full_name || u.name || hgT('page.user');
    const first = c.user.name || full.split(/\s+/)[0];
    const handle = c.user.handle || '@' + first.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9_]/g, '_');
    return { full, first, handle, person: c.user.person || (pe && pe.entity_id) };
  }
  /* nagłówek widoku pokoju: przycisk „Pokoje”, ikona i nazwa pokoju, temperatura / wilgotność (adres ?area=<id>) */
  _roomHead(hd = {}) {
    const c = this._config, h = this._hass, m = HGAreas.model(h, c.areas || HG_NO_AREAS), a = m.byId[HGAreas.areaFromUrl()];
    const back = `<button class="rback" data-act="roomback" aria-label="${hgT('page.back_to_rooms')}">${H.icon('mdi:chevron-left')}<span>${hgT('common.rooms')}</span></button>`;
    if (!a) return `${back}<h1>${hgT('common.room')}</h1><p>${hgT('page.room_not_found')}</p>`;
    const env = HGAreas.env(h, a), S = a.sec || {}, okS = (e) => H.ok(h.states[e]);
    // hero: duża temperatura + wilgotność; obok stan pokoju (obecność, włączone światła, otwarte drzwi/okna) – tylko z prawdziwych encji
    /* administrator: dotknięcie temperatury / wilgotności wybiera czujnik tego pokoju (Wygląd → Pokoje bez szukania); brak wartości -> mały przycisk „+ czujnik” */
    const adm = !!(h.user && h.user.is_admin), ov = ((((HGL.data || {}).wiz || {}).areas || {}).sensors || {})[a.id] || {};
    const sb = (k, cls, inner, lbl) => (adm ? `<button type="button" class="${cls} rsens" data-act="roomsens" data-k="${k}" aria-haspopup="menu" aria-label="${H.esc(lbl)}" title="${hgT('page.change_sensor')}">${inner}<span class="pen" aria-hidden="true">${H.icon('mdi:pencil')}</span></button>` : `<span class="${cls}">${inner}</span>`);
    const big = env.t != null ? sb('temperature', 'rt', `${H.icon('mdi:thermometer')}${H.fmt(env.t, 1)}<sup>°</sup>`, `${hgT('page.temperature')} ${H.fmt(env.t, 1)}°`) : '';
    const hum = env.u != null ? sb('humidity', 'ru', `${H.icon('mdi:water-percent')}${H.pct(H.fmt(env.u, 0))}`, `${hgT('common.humidity')} ${H.pct(H.fmt(env.u, 0))}`) : '';
    const add = (k, ic, l) => (adm && ov[k] !== '-' && HGAreas.cands(h, a, k).length ? `<button type="button" class="rp rsadd" data-act="roomsens" data-k="${k}" aria-haspopup="menu">${H.icon(ic)}${l}</button>` : '');
    const adds = (env.t == null ? add('temperature', 'mdi:thermometer-plus', hgT('page.temperature')) : '') + (env.u == null ? add('humidity', 'mdi:water-plus', hgT('common.humidity')) : '');
    /* obecność: wybór z nagłówka trafia do wiz.areas.sensors[pokój].presence (encja, '-' = nie pokazuj). Bez wyboru używane są czujniki ruchu i obecności z pokoju. */
    const pOv = ov.presence, occ = pOv === '-' ? [] : pOv && h.states[pOv] ? [pOv] : (S.mot || []).filter(okS), occOn = occ.some((e) => h.states[e].state === 'on');
    const occTxt = `<i></i>${occOn ? hgT('page.occupied') : hgT('page.clear')}`;
    const lOn = (S.light || []).filter((e) => okS(e) && h.states[e].state === 'on').length;
    const opn = (S.door || []).filter((e) => okS(e) && h.states[e].state === 'on').length;
    const occLbl = H.lv(hgT('cards.room.title_presence'), occOn ? hgT('page.occupied') : hgT('page.clear'));
    const occPill = occ.length ? (adm ? sb('presence', `rp ${occOn ? 'on' : ''}`, occTxt, occLbl) : `<span class="rp ${occOn ? 'on' : ''}">${occTxt}</span>`) : '';
    const occAdd = !occ.length && adm && pOv !== '-' && this._presCands(h, a).length ? `<button type="button" class="rp rsadd" data-act="roomsens" data-k="presence" aria-haspopup="menu">${H.icon('mdi:account-plus-outline')}${hgT('cards.room.title_presence')}</button>` : '';
    const pills = [occPill,
      lOn ? `<span class="rp lt">${H.icon('mdi:lightbulb-on')}${hgT('page.lights_on_count', { count: lOn })}</span>` : '',
      opn ? `<span class="rp op">${H.icon('mdi:door-open')}${hgT('page.open_count', { count: opn })}</span>` : '', occAdd, adds].join('');
    const sub = big || hum || pills ? `${big}${hum}${pills ? `<span class="rps">${pills}</span>` : ''}` : `<span>${a.devN ? hgT('page.devices_count', { count: a.devN }) : hgT('page.no_devices')}</span>`;
    const ttl = this._headPick(hd, 't', a.name, a.name), ic = /^mdi:[a-z0-9-]+$/.test(hd.i || '') ? hd.i : a.icon, st = this._headPick(hd, 's', '', a.name);
    return `${back}<h1 class="rh" title="${H.esc(ttl)}">${H.icon(ic, 'rhi')}<span>${H.esc(ttl)}</span></h1>${hd.nos ? '' : `<p class="renv">${st ? `<span>${H.esc(st)}</span>` : sub}</p>`}`;
  }
  /* czujniki obecności / ruchu do wyboru dla pokoju: najpierw z pokoju, potem pozostałe (bez ukrytych i niedostępnych) */
  _presCands(h, a) { const reg = h.entities || {}, inR = new Set(a.ents || []);
    const all = Object.keys(h.states).filter((e) => e.startsWith('binary_sensor.') && ['occupancy', 'presence', 'motion'].includes(h.states[e].attributes.device_class) && h.states[e].state !== 'unavailable' && !(reg[e] && reg[e].hidden));
    return [...all.filter((e) => inR.has(e)), ...all.filter((e) => !inR.has(e))]; }
  /* wybór czujnika temperatury / wilgotności / obecności pokoju z nagłówka; zapis w wiz.areas.sensors (to samo co Wygląd → Pokoje, więc eksport i import działają bez zmian) */
  async _roomSens(t) {
    const h = this._hass, k = t.dataset.k, a = HGAreas.model(h, this._config.areas || HG_NO_AREAS).byId[HGAreas.areaFromUrl()]; if (!a || !h) return;
    const cur = (((((HGL.data || {}).wiz || {}).areas || {}).sensors || {})[a.id] || {})[k] || '', inR = new Set(a.ents || []), T = k === 'temperature';
    const P = k === 'presence';
    const fmt = (e) => { if (P) return H.stateLabel ? H.stateLabel(h.states[e].state) : h.states[e].state; const v = parseFloat(h.states[e].state); return isFinite(v) ? (T ? `${H.fmt(v, 1)}°` : H.pct(H.fmt(v, 0))) : hgT('common.state_unavailable_masc'); };
    const cs = P ? this._presCands(h, a) : HGAreas.cands(h, a, k), shown = cs.filter((e) => inR.has(e) || e === cur).concat(cs.filter((e) => !inR.has(e) && e !== cur).slice(0, 8));
    const ic = P ? 'mdi:account-outline' : T ? 'mdi:thermometer' : 'mdi:water-percent';
    const items = [{ label: hgT('common.automatic'), icon: 'mdi:auto-fix', value: '', checked: !cur }, '-',
      ...shown.map((e) => ({ label: `${inR.has(e) ? HGAreas.name(h, e, a) : H.name(h, e)} · ${fmt(e)}`, icon: ic, value: e, checked: e === cur })), '-',
      { label: hgT('page.do_not_show'), icon: 'mdi:eye-off-outline', value: '-', checked: cur === '-' },
      { label: hgT('page.all_room_settings'), icon: 'mdi:cog-outline', value: '@set' }];
    const v = await hgOverlay.menu(t, items); if (v == null || v === cur) return;
    if (v === '@set') { if (window.HGRoomsX) { HGRoomsX.open = a.id; } this._lkTab = 'rooms'; this._lkDD = 'page'; if (!this._editing && this._editEnter) this._editEnter(); /* bez trybu edycji klik nie jest podpięty (_eWire), więc Zapisz i edycja pokoju nie działają */ return this._editing && this._eLook ? this._eLook() : undefined; }
    const W = HGL.data.wiz = Object.assign({}, HGL.data.wiz || {}), A = W.areas = JSON.parse(JSON.stringify(W.areas || {})), S = A.sensors = A.sensors || {}, o = Object.assign({}, S[a.id]);
    if (v) o[k] = v; else delete o[k]; if (Object.keys(o).length) S[a.id] = o; else delete S[a.id]; W.ts = Date.now();
    if (window.HGRoomsX) { if (!HGRoomsX.dirty) HGRoomsX.draft = null; else if (HGRoomsX.draft) { const D = HGRoomsX.draft, DS = D.sensors = Object.assign({}, D.sensors); if (S[a.id]) DS[a.id] = Object.assign({}, S[a.id]); else delete DS[a.id]; } }
    this._paintHead(); for (const el of this._cards || []) if (el._update) { el._entsC = null; el._update(true); }
    const r = await HGL.save(h); if (r !== 'ha' && !window.__hgDryRun && hgOverlay.toast) hgOverlay.toast(hgT('page.saved_on_this_device'));
  }
  /* nagłówek widoku (tytuł, podtytuł, ikona, widoczność) z układu: zwykłe widoki pod kluczem widoku, Pokoje i Pokój pod '<widok>:head' (bez układu kart) */
  _headScope() { const v = this._config && this._config.view; return ['rooms', 'pokoj'].includes(v) ? v + ':head' : v; }
  /* przed 2.10.0 nagłówek widoku Pokoje trafiał pod klucz 'null' (widok bez układu kart): odczyt stamtąd, dopóki nie zapisze się nowy */
  _headConf() { try { const S = HGL.data.s, sc = this._headScope(), h = ((S[sc] || {}).conf || {})._head; if (h) return h; return (sc === 'rooms:head' && ((S.null || {}).conf || {})._head) || {}; } catch (e) { return {}; } }
  _headPick(hd, k, def, room) { const md = this.getAttribute('mode'), ui = this._userInfo();
    const raw = String((md === 'phone' && hd[k + 'm']) || (md === 'tablet' && hd[k + 't']) || hd[k] || def || '');
    if (/\{(time|date)\}/.test(raw)) this._headClk = true;
    return hgClockFill(raw.replace(/\{name\}/g, ui.first || '').replace(/\{room\}/g, room || '').replace(/\{state:([a-z0-9_.]+)\}/g, (m, id) => this._headState(id)), this._hass); }
  /* {state:encja} w tytule / podtytule: stan encji; pusty, unavailable, unknown lub off -> '' (podtytuł z pustym stanem znika) */
  _headState(id) { const s = this._hass && this._hass.states[id], v = s ? s.state : ''; if (!v || ['unavailable', 'unknown', 'off'].includes(v)) { this._headStateEmpty = true; return ''; } return v; }
  /* encje ze {state:...} w nagłówku widoku (odświeżanie nagłówka przy zmianie stanu) */
  _headEnts() { const hd = this._headConf(); return [...new Set(Object.values(hd).filter((v) => typeof v === 'string').flatMap((v) => [...v.matchAll(/\{state:([a-z0-9_.]+)\}/g)].map((m) => m[1])))]; }
  /* zegar w nagłówku: przerysowanie na początku każdej minuty, tylko gdy tytuł albo podtytuł ma {time} / {date} */
  /* ?nuvio_settings w adresie: otwiera Wygląd (tylko dla osób z prawem edycji, nie na widoku zablokowanym PIN-em); parametr usuwany z adresu */
  _navParam() { let q; try { q = new URLSearchParams(location.search); } catch (e) { return; } if (!q.has('nuvio_settings')) return;
    try { const u = new URL(location.href); u.searchParams.delete('nuvio_settings'); history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) {}
    setTimeout(() => { if (!this.isConnected || !this._canEdit || !this._canEdit()) return; if (window.HGVLock && HGVLock.page === this && HGVLock.el) return;
      if (!this._editing && this._editEnter) this._editEnter(); if (this._editing && this._eLook) this._eLook(); }, 400); }
  _headTick() { clearTimeout(this._headT); this._headT = null; if (!this._headClk || !this.isConnected) return;
    this._headT = setTimeout(() => { this._headT = null; if (this.isConnected && !document.hidden) this._paintHead(); else this._headTick(); }, 60500 - (Date.now() % 60000)); }
  _headVis(hd) { this._headEl.classList.toggle('hd-off', !!hd.hide); if (hd.hide) this._headEl.dataset.off = hgT('page.header_hidden'); else delete this._headEl.dataset.off;
    const md = this.getAttribute('mode'), sz = (hd.sz || {})[md] || ''; if (sz && sz !== 'm') this._headEl.dataset.sz = sz; else delete this._headEl.dataset.sz; }
  _paintHead() {
    const c = this._config; if (!this._hass) return; this._headClk = false; queueMicrotask(() => this._headTick());
    if (c.room_head) { const hd = this._headConf(); this._headVis(hd); this._bdgEl = null; this._setHTML(this._headEl, this._roomHead(hd)); if (this._editing && this._eHeadBtn) this._eHeadBtn(); this._railClear(); return; }
    const hd = this._headConf();
    const pick = (k, def) => this._headPick(hd, k, def);
    const ttl = pick('t', c.title ?? hgT('common.welcome', { name: '{name}' })), hic = /^mdi:[a-z0-9-]+$/.test(hd.i || '') ? H.icon(hd.i, 'hdi') : '';
    this._headStateEmpty = false; const sub = pick('s', c.subtitle ?? hgT('page.default_subtitle'));
    this._headVis(hd);
    this._headEl.innerHTML = `<h1 title="${H.esc(ttl)}">${hic}${H.esc(ttl)}</h1>${hd.nos || (!sub && this._headStateEmpty) ? '' : `<p>${H.esc(sub)}</p>`}<div class="bdgs" role="list" aria-label="${hgT('lookr.badge')}" hidden></div>${c.fuel || c.weather ? `<div class="hrow">${c.weather ? '<div class="wxs"></div>' : ''}${c.fuel ? `<div class="fuel" role="list" aria-label="${hgT('common.fuel_prices')}"></div>` : ''}</div>` : ''}${c.weather ? '<div class="wxh"></div>' : ''}`;
    this._fuelEl = this._headEl.querySelector('.fuel'); this._paintFuel(true);
    this._bdgEl = this._headEl.querySelector('.bdgs'); this._paintBadges(true);
    this._placeWx();
  }
  /* pogoda na zewnątrz: szeroki układ -> bez tła na zdjęciu pod powitaniem (.wxh); tablet/telefon -> chip obok cen paliw (.wxs) */
  _placeWx() {
    const c = this._config; if (!c || !c.weather || !this._headEl) return;
    const wiz = typeof HGL !== 'undefined' && HGL.data && HGL.data.wiz; if (wiz && wiz.weather && wiz.weather.hide) { if (this._wxEl && this._wxEl.parentNode) this._wxEl.parentNode.removeChild(this._wxEl); return; }
    if (!this._wxEl) { this._wxEl = document.createElement('hg-weather-card'); this._wxEl.setAttribute('variant', 'hero'); }
    const w = c.weather, prev = this._wxEl._config; if (!prev || prev.entity !== w.entity || prev.size !== w.size || prev.forecast_sensor !== w.forecast_sensor) this._wxEl.setConfig(w);
    const wide = this.getAttribute('mode') === 'wide', t = this._headEl.querySelector(wide ? '.wxh' : '.wxs'); if (!t) return;
    if (this._wxEl.hasAttribute('compact') === wide) this._wxEl.toggleAttribute('compact', !wide);
    if (this._wxEl.parentNode !== t) t.appendChild(this._wxEl);
    if (this._hass) this._wxEl.hass = this._hass;
  }
  /* ceny paliw (gov.pl): małe chipy pod powitaniem; strzałka = zmiana jutro; brak danych -> wiersz znika */
  /* ceny paliw z bieżącego układu (wiz.fuel, wiz.fuelOff), więc włącznik w Ustawieniach działa bez przebudowy pulpitu; własna lista z YAML bez układu zostaje */
  _fuelList() { const c = this._config, W = typeof HGL !== 'undefined' && HGL.data && HGL.data.wiz; if (!c.fuel) return [];
    const L = W && Array.isArray(W.fuel) ? W.fuel : W && c._hgAuto ? [] : c.fuel; if (W && W.fuelOff) return [];
    return L.filter((f) => f && f.entity && !f.off); }
  _fuelEnts() { return this._fuelList().flatMap((f) => [f.entity, f.change].filter(Boolean)); }
  _paintFuel(force) {
    const el = this._fuelEl; if (!el || !this._hass) return;
    const chips = [];
    for (const f of this._fuelList()) {
      const s = H.st(this._hass, f.entity), v = s ? parseFloat(s.state) : NaN;
      if (!H.ok(s) || !isFinite(v)) continue;
      const ch = H.st(this._hass, f.change), ca = (H.ok(ch) && ch.attributes) || {};
      const gr = Number(ca.roznica_gr), known = H.ok(ch) && isFinite(gr) && ca.cena_jutro != null;
      const dir = !known || gr === 0 ? 'eq' : gr > 0 ? 'up' : 'dn';
      const price = `${v.toLocaleString(HG_LOC(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
      const tom = !known ? hgT('page.tomorrow_no_data') : gr === 0 ? hgT('page.no_change_tomorrow') : hgT('page.fuel_tomorrow_change', { change: (gr > 0 ? '+' : '−') + Math.abs(gr) });
      chips.push(`<button class="fc" role="listitem" data-act="fuel" data-e="${H.esc(f.entity)}" title="${H.esc(`${f.label} ${price}/l · ${tom}`)}" aria-label="${H.esc(hgT('page.fuel_aria', { label: f.label, price, tomorrow: tom }))}"><span class="fl ${H.esc(String(f.label).replace(/\W/g, '').toLowerCase())}">${H.esc(String(f.label).toUpperCase())}</span><b>${price}</b><i class="tr ${dir}" aria-hidden="true">${H.icon(dir === 'up' ? 'mdi:arrow-up' : dir === 'dn' ? 'mdi:arrow-down' : 'mdi:minus')}</i></button>`);
    }
    el.hidden = !chips.length;
    if (force) el._hgHtml = null;
    this._setHTML(el, chips.join(''));
  }
  /* ile encji z licznika jest „włączonych”; media osobno (playing). Chip w nagłówku znika przy 0 */
  _bdgN(c) { if (!c || !this._hass) return 0; if (c.count_active) return c.count_active.filter((e) => hgMpActive(H.st(this._hass, e))).length;
    return (c.count_on || []).filter((e) => { const s = H.st(this._hass, e); return s && !['off', 'unavailable', 'unknown', 'idle', 'standby', 'paused', 'not_home'].includes(s.state); }).length; }
  _paintBadges(force) { const el = this._bdgEl; if (!el || !this._hass) return; const bits = [];
    for (const c of (this._config && this._config.badges) || []) { const n = this._bdgN(c); if (n <= 0) continue;
      const name = typeof hgBadgeLabel === 'function' ? hgBadgeLabel(c.k) : hgT('lookr.badge'), ic = c.icon || ((window.HG_BADGE_META || {})[c.k] || {}).i || 'mdi:circle-small';
      bits.push(`<span class="bdg" role="listitem" title="${H.esc(name)}" aria-label="${H.esc(name + ' ' + n)}">${H.icon(ic)}<b>${n}</b></span>`); }
    el.hidden = !bits.length; if (force) el._hgHtml = null; this._setHTML(el, bits.join('')); }
  /* Studio: encje tabletu ściennego (wifi / bluetooth / bateria), wyszukiwane raz na budowę; brak encji = brak ikony */
  _stDev() {
    if (this._stIds) return this._stIds; const S = (this._hass && this._hass.states) || {}, o = {};
    for (const id of Object.keys(S)) {
      if (!/^(sensor|binary_sensor|device_tracker)\./.test(id) || !/tablet|wall|ipad|kiosk/i.test(id)) continue;
      if (!o.bat && S[id].attributes.device_class === 'battery') o.bat = id;
      else if (!o.bt && /bluetooth/i.test(id)) o.bt = id;
      else if (!o.wifi && /wi_?fi|ssid|rssi/i.test(id)) o.wifi = id;
    }
    return (this._stIds = o);
  }
  _stChrome() {
    const o = this._stDev(), S = this._hass.states, ok = (id) => id && S[id] && !/^(unavailable|unknown|off)$/.test(S[id].state), lang = typeof HG_LOC === 'function' ? HG_LOC() : undefined, tf = this._hass.locale && this._hass.locale.time_format, d = new Date();
    const bat = ok(o.bat) ? Math.round(parseFloat(S[o.bat].state)) : NaN, b10 = Math.max(0, Math.min(100, Math.round(bat / 10) * 10));
    const ic = (cls, i, l) => `<span class="si ${cls}" role="img" aria-label="${H.esc(l)}" title="${H.esc(l)}">${H.icon(i)}</span>`;
    return `<div class="sst">${ok(o.wifi) ? ic('wf', 'mdi:wifi', hgT('page.studio_wifi')) : ''}${ok(o.bt) ? ic('bt', 'mdi:bluetooth', hgT('page.studio_bluetooth')) : ''}`
      + `${isNaN(bat) ? '' : ic('bat', b10 >= 100 ? 'mdi:battery' : b10 <= 0 ? 'mdi:battery-outline' : 'mdi:battery-' + b10, hgT('page.studio_battery', { value: bat }))}`
      + `<time class="sdt">${H.esc(d.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' }))}&nbsp; ${H.esc(d.toLocaleTimeString(lang, Object.assign({ hour: '2-digit', minute: '2-digit' }, tf === '12' ? { hour12: true } : tf === '24' ? { hour12: false } : {})))}</time></div>`;
  }
  _paintTop(force) {
    if (!this._built || !this._hass) return;
    const c = this._config, ui = this._userInfo(), brand = c.brand ?? hgT('page.home');
    const path = location.pathname;
    const nCount = Object.keys(this._notif).length;
    const badgeOf = (t) => !t.badge ? 0 : t.badge.chips ? t.badge.chips.reduce((n, c) => n + this._bdgN(c), 0) : this._bdgN(t.badge);
    const tabs = c.tabs.map((t) => ({ ...t, act: path === t.path || (t.match && hgMatch(t.match, path)), b: badgeOf(t) }));
    /* cheap signature: primitives compared with === instead of JSON.stringify over the whole user object, which ran on every state update */
    const ps0 = ui.person && H.st(this._hass, ui.person), sig = [!!this._editing, this._canEdit(), nCount, ui.person || '', ui.first || '', this._menuOpen,
      ps0 ? ps0.attributes.entity_picture || '' : '', !!(window.HGAssistUI && HGAssistUI.get().button), tabs.map((t) => (t.act ? 'a' : '_') + t.b).join('|'), ...(c.studio ? [Math.floor(Date.now() / 6e4), ...['wifi', 'bt', 'bat'].map((k) => { const e = this._stDev()[k], s = e && this._hass.states[e]; return s ? s.state : ''; })] : [])];
    /* _sigTop bywa null (reset przy dotyku/edycji/rebuildzie) - bez guardu pierwsze malowanie rzuca TypeError */
    if (!force && this._sigTop && sig.length === this._sigTop.length && sig.every((v, i) => v === this._sigTop[i])) return; this._sigTop = sig;
    const ps = ui.person && H.st(this._hass, ui.person);
    const av = ps && ps.attributes.entity_picture ? hgAvatar(this._hass, ui.person, 'uav') : `<span class="uav ini">${H.esc(ui.first[0] || '?')}</span>`;
    this._setHTML(this._topEl, `
      <button class="brand" data-act="nav" data-i="0" aria-label="${H.esc(brand)}">${HG_LOGO}<span>${H.esc(brand)}</span></button>
      <div class="tabs" role="tablist">${tabs.map((t, i) => `<button role="tab" aria-selected="${!!t.act}" class="tab ${t.act ? 'act' : ''}" data-act="nav" data-i="${i}" title="${H.esc(t.label)}" aria-label="${H.esc(t.label)}">${t.icon ? H.icon(t.icon) : ''}<span class="tl">${H.esc(t.label)}</span>${t.b ? `<sup class="nb" aria-label="${hgT('page.active_count', { count: t.b })}">${t.b > 9 ? '9+' : t.b}</sup>` : ''}</button>`).join('')}<i class="ind" aria-hidden="true"></i></div>
      <div class="right">
        ${this._canEdit() ? `<button class="cir ed ${this._editing ? 'on' : ''}" data-act="edit" aria-pressed="${!!this._editing}" aria-label="${this._editing ? hgT('page.finish_editing_layout') : hgT('page.edit_layout')}" title="${this._editing ? hgT('common.done') : hgT('page.edit_layout')}">${H.icon(this._editing ? 'mdi:check' : 'mdi:pencil')}</button>` : ''}
        ${window.HGAssistUI && HGAssistUI.get().button ? `<button class="cir as" data-act="assist" aria-haspopup="dialog" aria-keyshortcuts="A" aria-label="${hgT('page.assist_voice_assistant_a')}" title="${hgT('page.assist_a')}">${H.icon('mdi:microphone-message')}</button>` : ''}
        <button class="cir" data-act="mail" aria-label="${hgT('page.messages')}" title="${hgT('page.messages_and_notifications')}">${H.icon('mdi:email')}</button>
        <button class="cir" data-act="bell" aria-label="${hgT('common.notifications')} (${nCount})" title="${H.lv(hgT('common.notifications'), nCount)}">${H.icon('mdi:bell')}${nCount ? `<i class="nb">${nCount > 9 ? '9+' : nCount}</i>` : ''}</button>
        ${c.studio ? this._stChrome() : ''}
        <div class="user">
          <button class="uin" data-act="profile" aria-label="${hgT('page.profile')}" title="${hgT('page.profile')}">${av}<span class="un"><b>${H.esc(ui.full)}</b><small>${H.esc(ui.handle)}</small></span></button>
          <button class="chev" data-act="menu" aria-haspopup="menu" aria-expanded="${!!this._menuOpen}" aria-label="${this._updDot() ? hgT('page.menu_update_available') : hgT('page.menu')}" title="${hgT('page.menu')}">${H.icon('mdi:chevron-down')}${this._updDot() ? '<i class="udot" aria-hidden="true"></i>' : ''}</button>
        </div>
      </div>`);
    this._menuEl = this._topEl.querySelector('.user');
    if (c.studio && !this._stT) this._stT = setInterval(() => { if (this.isConnected && this._config.studio && !document.hidden) this._paintTop(); }, 30000);
    if (this._hass && !this._updT) { setTimeout(() => this._updCheck(), 1500); if (window.HGBackup) setTimeout(() => HGBackup.offer(this), 1200); }
    this._paintMenu();
    this._tabsFit();
    this._placeInd();
    // ponowny pomiar po załadowaniu fontów/ikon (pierwszy pomiar bywał zawyżony -> niepotrzebnie same ikony)
    if (!this._tfRe) { this._tfRe = true; const re = () => { if (this.isConnected) this._tabsFit(); };
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(re)); setTimeout(re, 800); setTimeout(re, 2500); }
  }
  /* zakładki u góry (tryb wide): gdy z etykietami nie mieszczą się przed prawą grupą, same ikony (etykieta w title/aria-label) */
  _tabsFit() {
    const t = this._topEl && this._topEl.querySelector('.tabs'), r = this._topEl && this._topEl.querySelector('.right');
    if (!t || !r) return;
    const was = this.hasAttribute('tabs-compact');
    this.removeAttribute('tabs-compact');
    if (this.getAttribute('mode') !== 'wide') { if (was) this._placeInd(); return; }
    const fit = t.getBoundingClientRect().right + 16 <= r.getBoundingClientRect().left;
    this.toggleAttribute('tabs-compact', !fit);
    if (was !== !fit) this._placeInd();
  }
  /* wersja i aktualizacje w stopce menu: encja update.* z HACS, bez niej GitHub (najwyżej raz na 6 h, localStorage), plik na serwerze nowszy niż działająca paczka */
  _updCheck() { if (this._updT && Date.now() - this._updT < 6e5) return; this._updT = Date.now(); const run = String(HG_BUILD).split('+')[0], U = this._upd = this._upd || {};
    const cmp = (a, b) => { const x = String(a).replace(/^v/, '').split('.').map(Number), y = String(b).replace(/^v/, '').split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); } return 0; };
    const done = () => { this._paintTop(true); };
    const st = this._hass && this._hass.states, ue = st && Object.values(st).find((s) => s.entity_id.startsWith('update.') && /nuvio/i.test(s.entity_id + ' ' + (s.attributes.title || '') + ' ' + (s.attributes.friendly_name || '')));
    if (ue) { U.src = 'hacs'; U.v = ue.state === 'on' && ue.attributes.latest_version && cmp(ue.attributes.latest_version, run) > 0 ? String(ue.attributes.latest_version).replace(/^v/, '') : null; }
    else { U.src = 'gh'; let c = null; try { c = JSON.parse(localStorage.getItem('nuvio:upd') || 'null'); } catch (e) { /* uszkodzony wpis */ }
      const use = (tag) => { U.v = tag && cmp(tag, run) > 0 ? String(tag).replace(/^v/, '') : null; done(); };
      if (c && Date.now() - c.ts < 6 * 3600e3) use(c.tag);
      else fetch('https://api.github.com/repos/kczepiec/nuvio/releases/latest', { headers: { Accept: 'application/vnd.github+json' } }).then((r) => (r.ok ? r.json() : null)).then((j) => { const tag = j && j.tag_name; try { localStorage.setItem('nuvio:upd', JSON.stringify({ ts: Date.now(), tag })); } catch (e) { /* tryb prywatny */ } use(tag); }).catch(() => {}); }
    /* the stale-bundle check no longer downloads the whole ~1.4 MB bundle on every page load to read one line: an If-None-Match
       request with the bundle hash reads the first bytes only, and the server answers 304 when the file did not change. */
    if (typeof HG_ASSET === 'string' && !String(HG_BUILD).startsWith('__')) {
      const url = HG_ASSET + 'nuvio.js', key = 'nuvio:jsETag:' + HG_BUILD, rd = () => { try { return localStorage.getItem(key) || ''; } catch (e) { return ''; } };
      fetch(url, { cache: 'no-cache', headers: rd() ? { 'If-None-Match': rd() } : {} }).then((r) => {
        if (r.status === 304) { U.stale = null; return; }   /* done() would paint the header again with nothing changed */
        if (!r.ok) return done();
        const et = r.headers.get('etag');
        return r.text().then((t) => { const m = new RegExp('HG_BUILD = ' + "'" + "([^']+)'").exec((t || '').slice(0, 400));
          try { if (et && m) localStorage.setItem('nuvio:jsETag:' + m[1], et); } catch (e) { /* tryb prywatny */ }
          U.stale = m && cmp(m[1].split('+')[0], run) > 0 ? m[1].split('+')[0] : null; done(); });
      }).catch(() => {}); }
    done(); }
  _vEmpty() { clearTimeout(this._veT); this._veT = setTimeout(() => { const P = this._panelEl; if (!P || !P.isConnected) return;
    const vis = [...P.children].some((c) => c.classList.contains('cw') && c.dataset.hgk && !c.hidden && c.style.display !== 'none' && getComputedStyle(c).display !== 'none');
    let e = P.querySelector(':scope > .vempty'); if (vis) { if (e) e.remove(); return; } if (e) return;
    const admin = !!(this._hass && this._hass.user && this._hass.user.is_admin); e = document.createElement('div'); e.className = 'vempty'; e.setAttribute('role', 'note');
    e.innerHTML = `<span class="vei">${H.icon('mdi:view-grid-plus-outline')}</span><b>${hgT('page.empty_view')}</b><small>${hgT('page.this_view_has_no')}</small>${admin ? `<button type="button">${H.icon('mdi:plus')}<span>${hgT('common.add_widget')}</span></button>` : ''}`;
    const b = e.querySelector('button'); if (b) b.addEventListener('click', () => { if (!this._editing && this._editEnter) this._editEnter(); this._eGallery(null, this._pageScope() + ':tiles'); });
    P.appendChild(e); }, 120); }
  _updDot() { const U = this._upd || {}; return !!(U.v || U.stale); }
  _updFoot() { const U = this._upd || {}, run = String(HG_BUILD).split('+')[0];
    const pill = U.stale ? `<button class="mupd" data-act="updreload">${H.icon('mdi:refresh')}<span>${hgT('page.reload_to_load_version', { version: H.esc(U.stale) })}</span></button>`
      : U.v ? `<button class="mupd" data-act="updopen">${H.icon('mdi:arrow-up-circle')}<span>${hgT('page.update_available_version', { version: H.esc(U.v) })}</span></button>` : '';
    return `<div class="mfoot" role="presentation"><span class="mver">Nuvio v${H.esc(run)}</span>${pill}</div>`; }
  /* Kiosk Mode zainstalowany: administrator wyłącza go do końca sesji tej karty i włącza z powrotem (pełne przeładowanie, bo kiosk czyta adres przy starcie) */
  _lockItem() { return window.HGWall && HGWall.lockOn() ? `<button role="menuitem" data-act="walllock">${H.icon('mdi:lock-outline')}<span>${hgT('page.lock_screen')}</span></button>` : ''; }
  /* język dla każdego (także bez dostępu do ustawień): kolejny z listy, od razu bez przeładowania */
  _langItem() { const cur = hgCurLang(), L = HGLang.LIST, nx = L[(L.findIndex((x) => x[0] === cur) + 1) % L.length];
    return `<button role="menuitem" data-act="lang" data-l="${nx[0]}" lang="${nx[0]}">${H.icon('mdi:translate')}<span>${H.esc(nx[1])}</span></button>`; }
  _kmItem() { if (!window.KioskMode || !this._isAdmin()) return ''; const off = hgKmOff() || /[?&]disable_km\b/.test(location.search);
    return `<button role="menuitem" data-act="kmtoggle">${H.icon(off ? 'mdi:monitor-lock' : 'mdi:monitor-off')}<span>${off ? hgT('page.turn_kiosk_mode_on') : hgT('page.turn_kiosk_mode_off')}</span></button>`; }
  _kmToggle() { const off = hgKmOff() || /[?&]disable_km\b/.test(location.search), q = new URLSearchParams(location.search); hgKmOff(!off); if (off) q.delete('disable_km'); else q.set('disable_km', '');
    const s = q.toString().replace(/disable_km=(&|$)/, 'disable_km$1'); if (window.__hgDryRun) { window.__hgKmNav = location.pathname + (s ? '?' + s : ''); return; } location.href = location.pathname + (s ? '?' + s : '') + location.hash; }
  /* menu użytkownika w osobnej warstwie (poza .page z kontekstami stosu backdrop-filter / contain), position:fixed nad panelem */
  _paintMenu() {
    const L = this._menuL; if (!L) return;
    if (!this._menuOpen || !this._menuEl) { L.innerHTML = ''; L.removeAttribute('open'); document.removeEventListener('keydown', this._menuKey, true); return; }
    const c = this._config, b = this._menuEl.getBoundingClientRect();
    L.setAttribute('open', '');
    L.innerHTML = `<div class="menu" role="menu" style="top:${Math.round(b.bottom + 6)}px;right:${Math.max(8, Math.round(innerWidth - b.right))}px">${c.menu.map((m, i) => `<button role="menuitem" data-act="menuitem" data-i="${i}">${hgMenuIcon(m)}<span>${H.esc(m.label)}</span></button>`).join('')}${this._langItem()}${this._lockItem()}${this._kmItem()}${this._updFoot()}</div>`;
    this._menuKey = this._menuKey || ((e) => { if (e.key === 'Escape' && this._menuOpen && !hgsOpen.size) { e.preventDefault(); this._menuOpen = false; this._paintTop(true); } });
    document.addEventListener('keydown', this._menuKey, true);
  }
  /* telefon: arkusz „Więcej” (warstwa nad stroną): zamykanie tapnięciem w tło, przesunięciem w dół, Escape */
  _openSheet(open) {
    const L = this._sheetL, c = this._config; if (!L) return;
    clearTimeout(this._sheetT);
    if (!open) {
      if (!this._sheetOpen) return;
      this._sheetOpen = false;   // stan logiczny od razu (warstwa znika dopiero po animacji, ale pasek ma już wrócić do aktywnej pozycji)
      L.classList.remove('in', 'done'); document.removeEventListener('keydown', this._sheetKey, true);
      this._sheetT = setTimeout(() => { L.removeAttribute('open'); L.innerHTML = ''; }, hgReduced() ? 0 : 220);
      this._paintRail(true); return;
    }
    const path = location.pathname, pop = open === 'rail', more = pop ? (this._railOv || []) : ((c.phone_nav && c.phone_nav.more) || []);
    this._sheetOpen = true; this._sheetMode = pop ? 'rail' : 'phone'; this._sheetItems = more;
    L.setAttribute('open', ''); L.classList.toggle('popm', pop);
    const mb = pop && this._railEl.querySelector('[data-act=railmore]'), mr = mb ? mb.getBoundingClientRect() : null;
    const pc = Math.min(3, Math.max(1, more.length)), pw = pc * 88 + (pc - 1) * 10 + 20;
    const pst = mr ? `style="--hg-pc:${pc}; left:${Math.round(Math.max(12, Math.min(mr.right + 14, innerWidth - pw - 12)))}px; top:${Math.round(Math.max(12, Math.min(mr.top - 12, innerHeight - 24 - Math.ceil(more.length / 3) * 88)))}px"` : '';
    L.innerHTML = `<div class="scrim" data-act="sheetclose"></div><div class="sheet ${pop ? 'pop' : ''}" ${pst} role="dialog" aria-modal="true" aria-label="${hgT('common.more')}"><i class="grab" aria-hidden="true"></i>
      <div class="sg">${more.map((m, i) => `<button class="st ${m.match && hgMatch(m.match, path) ? 'act' : ''}" data-act="sheetnav" data-i="${i}">${H.icon(m.icon)}<span>${H.esc(m.label)}</span></button>`).join('')}</div></div>`;
    L.classList.remove('done');
    requestAnimationFrame(() => requestAnimationFrame(() => { L.classList.add('in'); this._sheetT = setTimeout(() => this._sheetOpen && L.classList.add('done'), hgReduced() ? 0 : 220); }));
    this._sheetKey = this._sheetKey || ((e) => { if (e.key === 'Escape' && !hgsOpen.size) { e.preventDefault(); this._openSheet(false); } });
    document.addEventListener('keydown', this._sheetKey, true);
    const sh = L.querySelector('.sheet'); let y0 = null;
    sh.addEventListener('pointerdown', (e) => { y0 = e.clientY; }, { passive: true });
    sh.addEventListener('pointermove', (e) => { if (y0 == null) return; const dy = e.clientY - y0; if (dy > 0) sh.style.transform = `translateY(${dy}px)`; }, { passive: true });
    const end = (e) => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; sh.style.transform = ''; if (dy > 70) this._openSheet(false); };
    sh.addEventListener('pointerup', end, { passive: true }); sh.addEventListener('pointercancel', () => { y0 = null; sh.style.transform = ''; }, { passive: true });
    sh.querySelector('.st') && sh.querySelector('.st').focus({ preventScroll: true });
    this._paintRail(true);
  }
  /* wskaźnik = osobny element pod aktywnym przyciskiem (pozycja przez transform, animowany w _animIn) */
  _placeInd() {
    const put = (box, act, ind, sel) => {
      if (!box || !ind) return;
      if (!act) { ind.style.opacity = '0'; return; }
      ind.style.opacity = '';
      ind.style.width = act.offsetWidth + 'px'; ind.style.height = act.offsetHeight + 'px';
      ind.style.transform = `translate(${act.offsetLeft}px, ${act.offsetTop}px)`;
    };
    if (this._topEl) put(this._topEl.querySelector('.tabs'), this._topEl.querySelector('.tab.act'), this._topEl.querySelector('.ind'));
    if (this._railEl) put(this._railEl, this._railEl.querySelector('.ri.act'), this._railEl.querySelector('.rind'));
  }
  _paintRail(force) {
    if (!this._built) return;
    const c = this._config, path = location.pathname;
    const phone = this.getAttribute('mode') === 'phone' && c.phone_nav;
    if (phone) {
      // stan arkusza z flagi (nie z atrybutu warstwy: ten znika dopiero po animacji zamykania)
      const open = !!this._sheetOpen;
      const m = c.phone_nav.main.map((r) => ({ ...r, act: !open && (r.match ? hgMatch(r.match, path) : false) }));
      const moreAct = !m.some((r) => r.act) && c.phone_nav.more.some((r) => r.match && hgMatch(r.match, path));
      const sig = JSON.stringify(['p', m.map((r) => r.act), moreAct, open]);
      if (!force && sig === this._sigRail) return; this._sigRail = sig;
      // przyciski budujemy raz; przy otwarciu/zamknięciu arkusza tylko przełączamy klasy (bez podmiany ha-icon pod palcem
      // ani odtwarzania wskaźnika od zera — na telefonie ikona potrafiła zniknąć do czasu ponownego wczytania)
      const btns = this._railEl.dataset.pn === '1' ? this._railEl.querySelectorAll('.ri.pn') : null;
      if (btns && btns.length === m.length + 1) {
        m.forEach((r, i) => btns[i].classList.toggle('act', !!r.act));
        const mb = btns[m.length]; mb.classList.toggle('act', !!(moreAct || open)); mb.setAttribute('aria-expanded', String(!!open));
        this._placeInd(); return;
      }
      this._railEl.dataset.pn = '1';
      this._railEl.innerHTML = m.map((r, i) => `<button class="ri pn ${r.act ? 'act' : ''}" data-act="pnav" data-i="${i}" aria-label="${H.esc(r.label)}">${H.icon(r.icon)}<span${String(r.short || r.label).length > 9 ? ' class="lg"' : ''}>${H.esc(r.short || r.label)}</span></button>`).join('')
        + `<button class="ri pn ${moreAct || open ? 'act' : ''}" data-act="more" aria-haspopup="dialog" aria-expanded="${!!open}" aria-label="${hgT('common.more')}">${H.icon('mdi:dots-horizontal')}<span>${hgT('common.more')}</span></button><i class="rind" aria-hidden="true"></i>`;
      this._placeInd(); return;
    }
    if (this._sheetOpen && this._sheetMode !== 'rail') this._openSheet(false);
    delete this._railEl.dataset.pn;
    const all = c.rail.map((r, i) => ({ ...r, i, act: r.match ? hgMatch(r.match, path) : false }));
    // szyna nie mieści wszystkiego: nadmiar (najpierw wg rail_overflow, potem od końca, bez ostatniej = Ustawienia) do „Więcej”
    const st = c.studio && this.getAttribute('mode') !== 'phone' ? 1 : 0, fit = st ? this._railFit(all.length + 1) - 1 : this._railFit(all.length), ov = new Set();
    if (fit < all.length) {
      const need = all.length - (fit - 1), order = [...(c.rail_overflow || []).map(function (l) { const u = this; const i = all.findIndex((r, j) => !u.has(j) && ((r.action && r.action.navigate === l) || r.label === l)); if (i >= 0) u.add(i); return i; }, new Set()).filter((i) => i >= 0 && i < all.length - 1),
        ...all.map((r, i) => i).slice(0, -1).reverse()];
      for (const i of order) { if (ov.size >= need) break; ov.add(i); }
    }
    this._railOv = [...ov].sort((x, y) => x - y).map((i) => all[i]);
    const items = all.filter((r, i) => !ov.has(i)), moreAct = this._railOv.some((r) => r.act) || (this._sheetOpen && this._sheetMode === 'rail');
    const dk = st && document.documentElement.getAttribute('data-hg-scheme') === 'dark', sig = JSON.stringify([items.map((r) => r.i + (r.act ? 'a' : '')), [...ov], moreAct, st, dk]);
    if (!force && sig === this._sigRail) return; this._sigRail = sig;
    const btn = (r) => `<button class="ri ${r.act ? 'act' : ''}" data-act="rail" data-i="${r.i}" aria-label="${H.esc(r.label)}" title="${H.esc(r.label)}">${r.svg && HG_SVG[r.svg] ? HG_SVG[r.svg] : H.icon(r.icon)}</button>`;
    const moreB = ov.size ? `<button class="ri ${moreAct ? 'act' : ''}" data-act="railmore" aria-haspopup="dialog" aria-expanded="${!!(this._sheetOpen && this._sheetMode === 'rail')}" aria-label="${hgT('common.more')}" title="${hgT('common.more')}">${H.icon('mdi:dots-grid')}</button>` : '';
    this._railEl.innerHTML = items.slice(0, -1).map(btn).join('') + moreB + (items.length ? btn(items[items.length - 1]) : '') + (st ? `<button class="ri rth" data-act="scheme" aria-label="${hgT('page.studio_theme')}" title="${hgT('page.studio_theme')}">${H.icon(dk ? 'mdi:weather-sunny' : 'mdi:weather-night')}</button>` : '') + '<i class="rind" aria-hidden="true"></i>';
    this._placeInd();
    if (!this._rfChk) { this._rfChk = true; requestAnimationFrame(() => { this._rfChk = false; this._paintRail(); }); }   // ponowny pomiar po malowaniu
    if (!this._rfT) { this._rfT = true; for (const ms of [400, 1200, 3000]) setTimeout(() => { if (this.isConnected) this._paintRail(); }, ms); }
  }
  /* ile przycisków zmieści szyna nad przyciskiem wstecz (min. 12 px odstępu) */
  /* układ szeroki: szyna stoi pod nagłówkiem (top 184u); wyższy nagłówek (długa nazwa pokoju, większa skala) przesuwa ją niżej zamiast na nią nachodzić */
  _railClear() {
    const r = this._railEl, hd = this._headEl; if (!r || !hd) return;
    if (this._hdRO !== hd && typeof ResizeObserver !== 'undefined') { this._hdRO = hd; new ResizeObserver(() => this._railClear()).observe(hd); }   /* czcionki, edycja nagłówka, zmiana stanu */
    if (this.getAttribute('mode') !== 'wide' || !hd.offsetParent) { if (r.style.top) { r.style.top = ''; } return; }
    requestAnimationFrame(() => { r.style.top = ''; const hb = hd.getBoundingClientRect().bottom, rt = r.getBoundingClientRect().top, top0 = r.offsetTop;
      if (hb + 12 > rt) r.style.top = Math.ceil(top0 + hb + 12 - rt) + 'px'; });
  }
  _railFit(n) {
    const r = this._railEl; if (!r || !r.isConnected) return n;
    const mode = this.getAttribute('mode'); if (mode !== 'wide' && mode !== 'tablet') return n;
    const rr = r.getBoundingClientRect(); if (!rr.height) return Math.min(n, this._rfLast || n);   // ukryta strona: ostatni pomiar
    const cs = getComputedStyle(r), gap = parseFloat(cs.rowGap) || 8, pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + 2;
    const one = r.querySelector('.ri'), ih = one ? one.getBoundingClientRect().height : 39;
    const bk = this.shadowRoot.querySelector('.back'), bb = bk && bk.offsetParent ? bk.getBoundingClientRect() : null;
    const limit = bb && bb.top > rr.top ? bb.top - 12 : innerHeight - 16;
    const k = Math.floor((limit - rr.top - pad + gap) / (ih + gap));
    this._rfLast = Math.max(3, k); return Math.max(3, Math.min(n, k));
  }
  _paintTools(hv) {
    const c = this._config, hid = hv != null ? hv : this.hasAttribute('panel-hidden');
    if (!c.toolbar) { this._toolsEl.style.display = 'none'; return; }
    this._toolsEl.innerHTML = `
      <button class="tb" data-act="search" aria-label="${hgT('common.search')}" title="${hgT('page.search_quick_bar')}">${H.icon('mdi:magnify')}</button>
      <button class="tb sm" data-act="zin" aria-label="${hgT('page.zoom_in')}" title="${hgT('page.enlarge_panel')}">${H.icon('mdi:plus-circle-outline')}</button>
      <button class="tb sm" data-act="zout" aria-label="${hgT('page.zoom_out')}" title="${hgT('page.shrink_panel')}">${H.icon('mdi:minus-circle')}</button>
      <button class="tb${hid ? ' pz' : ''}" data-act="close" aria-pressed="${hid}" aria-label="${hid ? hgT('page.show_panel') : hgT('page.hide_panel')}" title="${hid ? hgT('page.show_panel') : hgT('page.hide_panel')}">${H.icon(hid ? 'mdi:eye-outline' : 'mdi:eye-off-outline')}</button>`;
  }
  _paintHub(force) {
    if (!this._built || !this._hass) return;
    let hb = this._config.hub; const WH = typeof HGL !== 'undefined' && HGL.data && HGL.data.wiz && HGL.data.wiz.hub;
    /* tytuł i podtytuł paska z bieżącego układu (jedno źródło: wiz.hub), więc zmiana w Ustawieniach działa bez przebudowy pulpitu */
    if (hb && WH && typeof WH === 'object') hb = Object.assign({}, hb, { title: WH.title || hgT('common.household'), subtitle: WH.subtitle || hgT('page.who_is_home_right') });
    this.toggleAttribute('hub-right', !!(hb && hb.pos === 'right')); if (!hb) { this._hubEl.style.display = 'none'; return; }
    const sig = hb.title + '|' + hb.subtitle + JSON.stringify((hb.persons || []).map((p) => { const s = H.st(this._hass, p); return s ? [s.state, s.attributes.entity_picture, s.attributes.friendly_name] : null; }));
    if (!force && sig === this._sigHub) return; this._sigHub = sig;
    this._setHTML(this._hubEl, `<div class="ht"><b>${H.esc(hb.title)}</b><span>${H.esc(hb.subtitle)}</span></div>
      <button class="plus" data-act="hubplus" aria-label="${H.esc(hb.plus_label || hgT('page.family'))}">${H.icon('mdi:plus')}</button>
      <div class="avs">${(hb.persons || []).map((p) => { const s = H.st(this._hass, p); return `<button class="pa ${s && s.state === 'home' ? 'home' : ''}" data-act="person" data-e="${p}" aria-label="${H.esc(H.name(this._hass, p))}" title="${H.lv(H.esc(H.name(this._hass, p)), H.esc(s ? H.t(this._hass, s) : ''))}">${hgAvatar(this._hass, p, 'hav')}</button>`; }).join('')}</div>`);
  }
  _dlgOpen() { return !!(this._sheetOpen || this._menuOpen || (window.HGAssistUI && HGAssistUI.isOpen) || this._eSheetOpen || (window.HGWall && HGWall.active)); }
  _swBlock(e) { if (this._dlgOpen()) return true;
    for (const n of e.composedPath()) { if (n === this || !(n instanceof Element)) break;
      if (n.matches('.layer, .as-l, .hge-sheet, .hge-scrim, [role=dialog], [role=slider], [role=listbox], [role=tablist], input[type=range], select, [data-hgs], [data-no-swipe], .lk-tabs')) return true;
      if (n.scrollWidth > n.clientWidth + 2) { const ox = getComputedStyle(n).overflowX; if (ox === 'auto' || ox === 'scroll') return true; } }
    return false; }
  _click(e) {
    const t = e.composedPath().find((n) => n.dataset && n.dataset.act && this.shadowRoot.contains(n));
    if (!t) return;
    const c = this._config, a = t.dataset.act, i = Number(t.dataset.i);
    const go = (x) => H.action(this, this._hass, x);
    switch (a) {
      case 'nav': return go({ navigate: c.tabs[i] && c.tabs[i].path });
      case 'rail': return go(c.rail[i].action);
      case 'pnav': this._openSheet(false); return go(c.phone_nav.main[i].action);
      case 'more': return this._openSheet(!this._sheetOpen);
      case 'sheetclose': return this._openSheet(false);
      case 'fuel': return H.fire(this, 'hass-more-info', { entityId: t.dataset.e });
      case 'roomback': return go({ navigate: c.room_back || HG_P('rooms') });
      case 'roomsens': return this._roomSens(t);
      case 'sheetnav': { const m = (this._sheetItems || c.phone_nav.more)[i]; this._openSheet(false); return go(m.action); }
      case 'scheme': try { localStorage.setItem('home-glass:scheme', HGTheme.dark ? 'light' : 'dark'); } catch (e) { /* */ } HGTheme.apply(!HGTheme.dark); return this._paintRail(true);
      case 'railmore': return this._openSheet(this._sheetOpen ? false : 'rail');
      case 'edit': return this._editing ? this._editExit(true) : this._editEnter();
      case 'assist': return window.HGAssistUI && HGAssistUI.open(this, t);
      case 'mail': return go(c.mail_action);
      case 'bell': return go(c.notifications_action);
      case 'pmore': { const el = this._panelEl; return el && el.scrollBy({ top: Math.round(el.clientHeight * 0.8), behavior: 'smooth' }); }
      case 'profile': return go(c.user.action || { navigate: '/profile' });
      case 'menu': this._menuOpen = !this._menuOpen; return this._paintTop(true);
      case 'updreload': { location.reload(); return; }
      case 'updopen': { this._menuOpen = false; this._paintTop(true); const U = this._upd || {}; if (U.src === 'hacs' && window.hgHacsOpen) window.hgHacsOpen(this._hass, 1416967732, 'kczepiec/nuvio'); else window.open('https://github.com/kczepiec/nuvio/releases/latest', '_blank', 'noopener'); return; }
      case 'walllock': this._menuOpen = false; this._paintTop(true); HGWall.page = HGWall.page || this; HGWall.hass = HGWall.hass || this._hass; return HGWall.lockNow();
      /* pasek przerysowany dopiero z katalogiem nowego języka (hg-lang przebudowuje stronę; tu: gdy przebudowa pominięta, np. w edycji) */
      case 'lang': this._menuOpen = false; return Promise.resolve(HGLang.set(this._hass, t.dataset.l, this)).then(() => { if (this._built) this._paintTop(true); });
      case 'kmtoggle': this._menuOpen = false; this._paintTop(true); return this._kmToggle();
      case 'menuitem': { this._menuOpen = false; this._paintTop(true); const m = c.menu[i]; if (m.kiosk_off) { location.href = location.pathname + '?disable_km'; return; } return go(m.action); }
      case 'back': return go(c.back);
      case 'search': return go(c.search_action || { quickbar: 'e' });
      case 'zin': case 'zout': {
        const zz = c.zoom; let z = this._zoom() + (a === 'zin' ? zz.step : -zz.step);
        z = Math.round(Math.max(zz.min, Math.min(zz.max, z)) * 100) / 100; this._ls('zoom', z); return this._layout();
      }
      case 'close': { const h = !this.hasAttribute('panel-hidden'); this._panelVis(h); this._ls('hidden:' + c.view, h); this._paintTools(h); const t = this._toolsEl.querySelector('[data-act=close]'); if (t) t.focus({ preventScroll: true }); return; }
      case 'hubplus': return go(c.hub.plus || { navigate: c.tabs[3] && c.tabs[3].path });
      case 'person': return go({ more_info: t.dataset.e });
    }
  }
  getCardSize() { return 12; }
  _css() {
    return U(`
:host{ display:block; color:#fff; position:relative; --hg-card-bf: none; --hg-card-under: none; --k: var(--hg-u0, 1.3px); --r-lg:24u; --r-md:16u; --r-sm:12u; --s1:8u; --s2:12u; --s3:16u; --s4:24u; --fs-xs:var(--hg-fs-xs, 8.5u); --fs-sm:var(--hg-fs-sm, 10u); --fs-md:var(--hg-fs-md, 12u); }
.bg{ position:fixed; inset:0; pointer-events:none; z-index:0; background:var(--hg-accent-tx) var(--hg-bg-wide) var(--hg-bg-pos, 50% 50%) / cover no-repeat;  }
@media (max-aspect-ratio: 1/1){ .bg{ background-image: var(--hg-bg-portrait, var(--hg-bg-wide)); background-position:50% 40%; } }
@media (pointer:coarse){ :host{ --hg-bf:.6; } }
/* tryb lekki (dotyk / słabe urządzenie, nadpisanie: localStorage home-glass:lite = 1/0): słabsze rozmycie, bez ciężkich cieni */
/* ===== JEDNO SZKŁO dla wszystkich pływających powierzchni = dokładnie przepis kart (ha-card.glass przy panel_backdrop:false):
   wypełnienie, backdrop-filter, ramka, cień. Tokeny liczone na :host, więc lite/dotyk (--hg-bf, --hg-glass-lite, --hg-card-sh) działają tak samo jak w kartach. */
:host{ --primary-color: var(--hg-accent); --accent-color: var(--hg-accent); --state-icon-active-color: var(--hg-accent); --state-active-color: var(--hg-accent); --state-light-active-color: var(--hg-accent); --state-switch-active-color: var(--hg-accent); --switch-checked-color: var(--hg-accent); --switch-checked-button-color: var(--hg-accent); --switch-checked-track-color: var(--hg-accent); --rgb-primary-color: 99,215,30; --rgb-state-light-color: 99,215,30; --rgb-state-switch-color: 99,215,30; --mush-rgb-amber: 99,215,30; --mush-rgb-orange: 99,215,30; --mush-rgb-blue: 99,215,30; --mush-rgb-green: 99,215,30; --mush-rgb-yellow: 99,215,30; --ha-card-background: var(--hg-glass-bg); --ha-card-border-width: 0; --ha-card-box-shadow: none; --ha-card-border-radius: 18px; --mdc-theme-primary: var(--hg-accent); --label-badge-blue: var(--hg-accent); --label-badge-yellow: var(--hg-accent);
  --glass-bg: var(--hg-glass-sheen, none), var(--hg-glass-lite, var(--hg-glass-bg)); --glass-bf: blur(calc(var(--hg-glass-blur, 14px) * var(--hg-bf, 1))) saturate(var(--hg-glass-sat, 180%)) brightness(var(--hg-glass-bri, 1));
  --glass-border: 0 solid transparent; --glass-shadow: var(--hg-edge, 0 0 0 transparent), var(--hg-card-sh, var(--hg-shadow-float, var(--hg-sh))); }
/* rozmycie na izolowanej warstwie ::after (inset:0, radius:inherit, z-index:-1) – element sam nie ma backdrop-filter
   (unika dwutonowego pasa Chrome na małych elementach; ta sama technika wszędzie = identyczny wygląd) */
.tabs, .rail, .tools, .hub, .back, .cir, .user, .fc, .rback, .more, .menu, .sheet-l .sheet{ background: transparent !important; border: var(--glass-border) !important; box-shadow: var(--glass-shadow) !important;
  -webkit-backdrop-filter:none !important; backdrop-filter:none !important; isolation:isolate; }
:where(.tabs, .rail, .tools, .hub, .back, .cir, .user, .fc, .rback, .more){ position:relative; }
.tabs::after, .rail::after, .tools::after, .hub::after, .back::after, .cir::after, .user::after, .fc::after, .rback::after, .more::after, .menu::after, .sheet-l .sheet::after{
  content:''; position:absolute; inset:0; border-radius:inherit; z-index:-1; pointer-events:none; background: var(--glass-bg);
  -webkit-backdrop-filter: var(--hg-bfo, var(--glass-bf)); backdrop-filter: var(--hg-bfo, var(--glass-bf)); }
.tabs::after, .user::after{ -webkit-backdrop-filter: var(--hg-bfo, blur(calc(22px * var(--hg-bf, 1))) saturate(var(--hg-glass-sat, 120%))); backdrop-filter: var(--hg-bfo, blur(calc(22px * var(--hg-bf, 1))) saturate(var(--hg-glass-sat, 120%))); }
/* rail + pigułka narzędzi (zoom): dokładnie przepis szkła kart (--glass-bf), bez osobnego nasycenia */
/* lite (dotyk): rozmycie tylko na zewnętrznym panelu (≤12px); chrom, menu, arkusz i karty bez backdrop-filter, bez dużych cieni */
:host([lite]){ --hg-lens: saturate(100%); --hg-glass-rim: var(--hg-glass-rim-lite); --hg-glass-bri: 1; --hg-glow: none; --hg-glow-l: none; --hg-bf:.35; --hg-card-sh: 0 0 0 transparent; --hg-inner-bf: none; --hg-glass-lite: var(--hg-glass-lite-c); --hg-warm-lite: var(--hg-warm-lite-c); --hg-wm-tumble: none; --hg-wm-slosh: none; --hg-wm-bub: none; --hg-sc-anim: none; }
:host([lite]) .panel{ -webkit-backdrop-filter: var(--hg-bfo, blur(12px)) !important; backdrop-filter: var(--hg-bfo, blur(12px)) !important; box-shadow: none !important; }
:host([lite]) .ind{ box-shadow:none !important; }
:host([lite]) .ri, :host([lite]) .tab{ transition:none; }
/* niewidoczny widok / ukryta karta przeglądarki: animacje ciągłe wstrzymane (zmienna dziedziczy się do kart) */
:host([paused]){ --hg-play: paused; }
*, *::before, *::after{ animation-play-state: var(--hg-play, running) !important; }
.shade{ position:fixed; inset:0; pointer-events:none; z-index:0;
  background: rgba(14,16,20,.26); }
/* noc (schemat ciemny): dodatkowe przyciemnienie zdjęcia */
.shade::after{ content:''; position:absolute; inset:0; background: var(--hg-night, transparent); }
.page{ position:relative; z-index:1; }
.logo{ width:22u; height:22u; border-radius:50%; background:var(--hg-accent); color:var(--hg-on-accent); display:inline-flex; align-items:center; justify-content:center; flex:none; box-shadow:var(--hg-sh-sm); }
.logo ha-icon{ width:15u; height:15u; --mdc-icon-size:100%; }
/* szeroki panel (Mapa, Kamery, Kalendarz): nagłówek i panel w normalnym przepływie (siatka: auto | 1fr) zamiast stałego top,
   więc panel zawsze zaczyna się pod nagłówkiem, niezależnie od rozmiaru fontu i ekranu */
:host([mode=wide][wide-panel]) .page{ display:grid; grid-template-columns: 86u minmax(0,1fr); grid-template-rows: auto minmax(0,1fr);
  padding: 78u var(--s3) var(--s3) 0; box-sizing:border-box; }
:host([mode=wide][wide-panel]) .head{ position:relative; left:auto; top:auto; grid-row:1; grid-column:1 / -1; margin-left:26u; max-width:none; }
:host([mode=wide][wide-panel]) .head{ justify-self:start; width:max-content; max-width:calc(100% - 26u - 56px); }
:host([mode=wide][wide-panel]) .panel{ position:relative; left:auto; right:auto; top:auto; bottom:auto; width:auto; grid-row:2; grid-column:2;
  margin-top:max(24px, calc(var(--hg-u0) * 14)); min-height:0; align-self:stretch; }
:host([wide-panel]) .tools, :host([wide-panel]) .hub{ display:none; }
:host([mode=wide][fit-panel]) .panel{ align-self:start; max-height:100%; overflow:auto; align-content:start; }
:host([fit-panel]) .panel{ align-self:start; }
button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
/* ----- pasek górny ----- */
.top{ display:flex; align-items:center; }
.brand{ display:flex; align-items:center; gap:var(--s1); color:#fff; text-shadow:0 1px 6px rgba(0,0,0,.3); font-size:var(--fs-md); font-weight:400; letter-spacing:-.01em; }
.brand svg{ width:19u; height:19u; flex:none; }
.tabs{ display:flex; align-items:center; gap:2u; padding:4u; border-radius:999px; height:39u;
  background: rgba(255,255,255,.13); border:1px solid rgba(255,255,255,.16);
  -webkit-backdrop-filter: var(--hg-bfo, blur(calc(14px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(14px * var(--hg-bf, 1)))); box-shadow: var(--hg-sh); }
.tab{ position:relative; height:31u; padding:0 var(--s3); border-radius:999px; font-size:var(--fs-sm); color:rgba(255,255,255,.95); text-shadow:0 1px 6px rgba(0,0,0,.28); white-space:nowrap; transition: background .25s, color .25s; }
.tab:hover{ background:rgba(255,255,255,.12); }
.tab{ display:inline-flex; align-items:center; justify-content:center; gap:8px; }
.tab ha-icon{ width:20px; height:20px; flex:none; color:currentColor; --mdc-icon-size:20px; pointer-events:none; }
.tab .tl{ pointer-events:none; }
.tabs{ position:relative; }
.tab{ z-index:1; }
.tab.act{ color:#1F2125; padding:0 var(--s3); text-shadow:none; }
.tab.act:hover{ background:none; }
/* bez stałego will-change: osobna warstwa GPU wskaźnika dzieliła tło szkła; WAAPI i tak promuje element na czas animacji */
.ind, .rind{ position:absolute; left:0; top:0; z-index:0; pointer-events:none; background:#fff; transform-origin:0 50%; }
.ind{ border-radius:999px; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
.rind{ border-radius:50%; box-shadow: var(--hg-sh); }
:host([mode=phone]) .ind{ border-radius:22px; }
/* jeden styl odznak (zakładki, dzwonek): pigułka z akcentem, biała cyfra, pierścień w kolorze tła */
.nb{ position:absolute; top:1u; right:2u; min-width:18px; height:18px; padding:0 5px; box-sizing:border-box; border-radius:9px; display:inline-flex; align-items:center; justify-content:center;
  background:var(--hg-accent); color:var(--hg-on-accent) !important; font:600 11px/1 'HG DM Sans',system-ui,sans-serif; font-style:normal; letter-spacing:0; text-shadow:none !important; vertical-align:baseline;
  box-shadow:0 0 0 2px var(--hg-nb-ring, var(--hg-chrome-solid)); pointer-events:none; z-index:2; }
.tab.act .nb{ --hg-nb-ring:#fff; } .cir .nb{ top:-3px; right:-3px; }

.right{ display:flex; align-items:center; gap:4u; margin-left:auto; }
.cir{ position:relative; width:35u; height:35u; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff;
  background: rgba(150,160,166,.55); border:1px solid rgba(255,255,255,.22); -webkit-backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); }
.cir ha-icon{ width:15u; height:15u; }
.ndot{ position:absolute; top:8u; right:9u; width:6u; height:6u; border-radius:50%; background:var(--hg-accent); box-shadow:0 0 0 1.5px rgba(150,160,166,.9); }
.user{ position:relative; display:flex; align-items:center; height:35u; border-radius:999px; padding:0 var(--s1) 0 4u; margin-left:3u;
  background: rgba(150,160,166,.55); border:1px solid rgba(255,255,255,.22); -webkit-backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); }
.uin{ display:flex; align-items:center; gap:var(--s1); color:#fff; text-shadow:0 1px 4px rgba(0,0,0,.25); height:100%; }
.uav{ width:27u; height:27u; border-radius:50%; background:center/cover #ccc; flex:none; display:flex; align-items:center; justify-content:center; font-size:var(--fs-sm); font-weight:600; color:#fff; }
.un{ display:flex; flex-direction:column; align-items:flex-start; line-height:1.15; min-width:0; }
.un b{ font-size:var(--fs-sm); font-weight:400; white-space:nowrap; } .un small{ font-size:var(--fs-xs); opacity:.92; white-space:nowrap; }
.chev{ width:22u; height:22u; color:#fff; display:flex; align-items:center; justify-content:center; margin-left:4u; }
.chev ha-icon{ width:15u; height:15u; }
.layer{ display:none; } .layer[open]{ display:block; }
.menu-l .menu{ position:fixed; z-index:1000; }
.menu{ position:absolute; right:0; top:calc(100% + 6px); min-width:200px; padding:6px; border-radius:16px; z-index:20; color:#1F2125; }
.menu button{ display:flex; align-items:center; gap:10px; width:100%; min-height:44px; padding:0 12px; border-radius:10px; font-size:14px; text-align:left; }
.menu button:hover{ background:rgba(0,0,0,.06); } .menu ha-icon, .menu button > svg{ width:18px; height:18px; flex:none; }
.mfoot{ display:flex; flex-direction:column; align-items:flex-start; gap:6px; margin:6px -6px -6px; padding:9px 14px 11px; border-top:1px solid rgba(127,127,127,.18); font-size:11.5px; }
.mver{ opacity:.55; font-variant-numeric:tabular-nums; letter-spacing:.01em; }
.menu button.mupd{ width:auto; min-height:28px; height:28px; padding:0 11px 0 8px; gap:6px; border-radius:14px; background:var(--hg-accent); color:var(--hg-on-accent, #111); font-size:12px; font-weight:600; }
.menu button.mupd:hover{ background:var(--hg-accent); filter:brightness(1.06); } .menu button.mupd:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; } .menu .mupd ha-icon{ width:16px; height:16px; --mdc-icon-size:16px; }
.chev{ position:relative; } .udot{ position:absolute; right:3px; top:3px; width:9px; height:9px; border-radius:50%; background:var(--hg-accent); box-shadow:0 0 0 2px rgba(20,24,30,.55); animation:var(--hg-loop, hgUdot 2.4s ease-in-out infinite); }
@keyframes hgUdot{ 50%{ transform:scale(.8); } } @media (prefers-reduced-motion:reduce){ .udot{ animation:none; } }
/* ----- arkusz „Więcej” (telefon) ----- */
.sheet-l{ position:fixed; inset:0; z-index:1000; }
.sheet-l .scrim{ position:absolute; inset:0; background:rgba(8,16,30,.38); opacity:0; transition:opacity .2s ease; }
.sheet-l .sheet{ position:absolute; left:8px; right:8px; bottom:0; padding:8px 14px calc(18px + env(safe-area-inset-bottom)); border-radius:var(--r-lg) var(--r-lg) 0 0; color:#1F2125; transform:translateY(105%); transition:transform .26s cubic-bezier(.2,.8,.2,1); touch-action:none; }
.sheet-l.in .scrim{ opacity:1; } .sheet-l.in .sheet{ transform:none; }
/* „Więcej” z szyny (desktop/tablet): wyskakujące okienko obok szyny */
.sheet-l.popm .scrim{ background:rgba(8,12,18,.22); }   /* lekkie przyciemnienie: okienko „Więcej” wyraźnie nad paskiem narzędzi i panelem domowników */
.sheet-l .sheet.pop::after{ background:rgba(240,243,247,.84); -webkit-backdrop-filter:var(--hg-bfo, blur(calc(26px * var(--hg-bf, 1))) saturate(140%)); backdrop-filter:var(--hg-bfo, blur(calc(26px * var(--hg-bf, 1))) saturate(140%)); }
.sheet-l .sheet.pop{ right:auto; bottom:auto; width:max-content; max-width:calc(100vw - 24px); padding:10px; border-radius:28px; box-sizing:border-box; transform:translateX(-8px); opacity:1; clip-path:inset(0 100% 0 0 round 28px); transition:transform .2s ease, clip-path .2s ease;   /* bez animacji opacity: Chrome pomija backdrop-filter, gdy rodzic ma opacity < 1 (szkło pojawiało się dopiero po animacji) */ touch-action:auto; }
.sheet.pop .sg{ grid-template-columns:repeat(var(--hg-pc,3), 88px); grid-auto-rows:1fr; align-items:stretch; gap:10px; } .sheet.pop .st{ height:100%; box-sizing:border-box; }
.sheet-l.in .sheet.pop{ transform:none; opacity:1; clip-path:inset(0 0 0 0 round 28px); } .sheet-l.in.done .sheet.pop{ clip-path:none; }   /* po animacji bez clip-path: clip-path na rodzicu potrafi wyłączyć rozmycie szkła (WebKit), treść pod spodem przebijała */ .sheet.pop .grab{ display:none; }
.sheet .grab{ display:block; width:40px; height:5px; border-radius:3px; background:rgba(0,0,0,.18); margin:2px auto 12px; }
.sg{ display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:10px; }
.st{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; min-height:78px; padding:8px 4px; border-radius:18px; background:rgba(255,255,255,.75);
  border:1px solid rgba(0,0,0,.05); font-size:13px; font-weight:400; color:#1F2125; text-align:center; }
.st ha-icon{ width:24px; height:24px; } .st span{ max-width:100%; overflow-wrap:anywhere; line-height:1.15; }
.st.act{ background:#1F2125; color:#fff; }
.st{ cursor:pointer; transition:background-color .16s ease, box-shadow .16s ease, transform .16s cubic-bezier(.2,.8,.2,1); }
.st:hover{ background:rgba(255,255,255,.64); box-shadow:0 6px 18px rgba(0,0,0,.14); transform:translateY(-1px); }
.st:active{ transform:scale(.97); transition-duration:.08s; }
.st:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.st.act:hover{ background:#2A2D33; }
@media (hover:none){ .st:hover{ transform:none; box-shadow:none; } }
@media (prefers-reduced-motion: reduce){ .sheet-l .sheet, .sheet-l .scrim, .st{ transition:none; } .st:hover, .st:active{ transform:none; } }
/* ----- nagłówek ----- */
.rback{ position:relative; display:inline-flex; align-items:center; gap:2u; height:max(calc(var(--k) * 30), 40px); padding:0 var(--s2) 0 var(--s1); margin:0 0 10u; border-radius:var(--r-md);
  color: var(--hg-chrome-fg); font-size:var(--fs-sm); font-weight:600; }
.rback ha-icon{ width:18u; height:18u; pointer-events:none; } .rback span{ pointer-events:none; }
.head .rh{ display:flex; align-items:center; gap:var(--s1); } .head .rhi{ width:24u; height:24u; flex:none; }
.head .renv{ display:flex; flex-wrap:wrap; align-items:baseline; gap:6u 16u; font-size:15u; font-weight:400; margin-top:6u; } .head .renv > span{ display:inline-flex; align-items:center; gap:3u; } .head .renv ha-icon{ width:16u; height:16u; }
.head .renv .rt{ display:inline-flex; align-items:center; gap:2u; font-size:24u; font-weight:300; letter-spacing:-.03em; line-height:1; font-variant-numeric:tabular-nums; } .head .renv .rt sup{ font-size:.45em; font-weight:400; vertical-align:.95em; margin-left:1px; }
.head .renv .rt ha-icon{ width:20u; height:20u; opacity:.85; } .head .renv .ru{ font-size:17u; opacity:.92; } .head .renv .ru ha-icon{ width:18u; height:18u; }
.head .rps{ display:inline-flex; flex-wrap:wrap; gap:6u; align-self:center; min-width:0; }
.head .renv{ overflow-wrap:normal; } .head .rsens{ display:inline-flex; align-items:center; font:inherit; color:inherit; letter-spacing:inherit; background:none; border:0; margin:0; padding:0; border-radius:var(--r-sm); cursor:pointer; text-shadow:inherit; -webkit-tap-highlight-color:transparent; }
/* ołówek: widać, że wartość da się zmienić; po najechaniu w kolorze akcentu, bez tła pod liczbą */
.head .renv .rsens .pen{ flex:none; display:inline-grid; place-items:center; width:max(16px, .52em); height:max(16px, .52em); margin-left:.3em; font-size:inherit; border-radius:50%; background:color-mix(in srgb, currentColor 14%, transparent); opacity:.55; transition:opacity var(--hg-t-fast) var(--hg-ease-out), background-color var(--hg-t-fast) var(--hg-ease-out), color var(--hg-t-fast) var(--hg-ease-out), transform var(--hg-t-fast) var(--hg-ease-out); }
.head .renv .rsens .pen ha-icon{ width:62%; height:62%; --mdc-icon-size:100%; opacity:1; } .head .renv .ru.rsens .pen{ width:max(16px, .9em); height:max(16px, .9em); margin-left:.3em; }
@media (hover:hover) and (pointer:fine){ .head .rsens:hover .pen{ opacity:1; background:var(--hg-accent); color:var(--hg-on-accent, #111); transform:scale(1.08); } }
.head .rp.rsens{ height:30px; padding:0 12px; border-radius:15px; font-size:13.5px; font-weight:600; color:#fff; background:rgba(0,0,0,.28); gap:6px; } .head .rp.rsens .pen{ width:16px; height:16px; margin-left:2px; }
.head .rsens:active .pen{ transform:scale(.92); } .head .rsens:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:4px; } .head .rsens:focus-visible .pen{ opacity:1; } .head .rsadd:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce){ .head .renv .rsens .pen{ transition:none; } .head .rsens:hover .pen, .head .rsens:active .pen{ transform:none; } }
.head .rsadd{ font:inherit; font-size:13.5px; font-weight:600; border:0; cursor:pointer; opacity:.85; } .head .rsadd:hover{ opacity:1; } .head .renv .rt, .head .renv .ru{ flex:none; white-space:nowrap; } .head .rp{ white-space:nowrap; }
:host([mode=wide]) .head .rh span{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.head .rp{ display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 12px; border-radius:15px; font-size:13.5px; font-weight:600; color:#fff; background:rgba(0,0,0,.28); }
.head .rp i{ width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.6); } .head .rp.on i{ background:var(--hg-accent); box-shadow:0 0 0 3px var(--hg-accent-soft); }
.head .rp ha-icon{ width:15px; height:15px; } .head .rp.lt ha-icon{ color:var(--hg-accent-tx); } .head .rp.op ha-icon{ color:var(--hg-accent-tx); }
.head .bdgs{ display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; } .head .bdgs[hidden]{ display:none; }
.head .bdg{ display:inline-flex; align-items:center; gap:5px; height:26px; padding:0 10px; border-radius:13px; font-size:13px; font-weight:600; color:#fff; background:rgba(0,0,0,.28); font-variant-numeric:tabular-nums; }
.head .bdg ha-icon{ width:15px; height:15px; } .head .bdg b{ font-weight:600; }
:host([mode=wide]) .head:has(.bdgs:not([hidden])) .wxh{ top:152u; }
.head h1{ margin:0; font-size:24u; font-weight:600; letter-spacing:-.015em; line-height:1.18; text-shadow: 0 1px 12px rgba(0,0,0,.18); }
/* --- title size: s / m (default) / l / xl per device --- */
:host([mode=tablet]) .head[data-sz=s] h1, :host([mode=wide]) .head[data-sz=s] h1{ font-size:18u; }
:host([mode=tablet]) .head[data-sz=l] h1, :host([mode=wide]) .head[data-sz=l] h1{ font-size:36u; }
:host([mode=tablet]) .head[data-sz=xl] h1, :host([mode=wide]) .head[data-sz=xl] h1{ font-size:clamp(72px, calc(var(--hg-u0, 1.3px) * 73), calc(140px * var(--hg-zoom, 1))); font-weight:100; letter-spacing:-.04em; }
.fuel{ display:flex; gap:5u; margin-top:9u; flex-wrap:wrap; } .fuel[hidden]{ display:none; }
.hrow{ display:flex; align-items:stretch; gap:5u; min-width:0; } .hrow .fuel{ margin-top:0; min-width:0; } .hrow{ margin-top:9u; }
.wxs:empty, .wxh:empty{ display:none; } .wxs{ flex:none; display:flex; }
:host([mode=wide]) .wxs{ display:none; }
:host(:not([mode=wide])) .wxh{ display:none; }
/* pogoda na zdjęciu: pod chipami paliw, na prawo od szyny (szyna: left 16u, szer. ~50u, top 184u) */
:host([mode=wide]) .wxh{ position:absolute; left:62u; top:120u; width:max-content; }
.fc{ display:inline-flex; align-items:center; gap:5u; height:max(calc(var(--k) * 24), calc(var(--hg-tgt, 0px) * .75)); padding:0 var(--s1) 0 3u; border-radius:999px;
  font:inherit; font-size:var(--fs-sm); line-height:1; cursor:pointer; font-variant-numeric: tabular-nums; }
.fc{ gap:6u !important; padding:0 4u 0 var(--s1) !important; }
.fc b{ font-weight:300; font-size:calc(var(--fs-md) * 1.1); letter-spacing:-.01em; }
.fc .fl{ display:inline-flex; align-items:center; gap:4u; font-size:var(--fs-xs); font-weight:500; opacity:.72; }
.fc .fd{ width:6u; height:6u; border-radius:50%; background:var(--hg-accent); } .fc .fd.pb98{ background:var(--hg-accent-lo); } .fc .fd.on{ background:rgba(200,205,210,.8); }
.fc .tr{ height:16u !important; padding:0 4u; border-radius:999px; }
.fb{ display:inline-flex; align-items:flex-start; justify-content:center; min-width:20u; height:calc(100% - 6u); padding:0 3u; box-sizing:border-box; border-radius:6u;
  color:#fff; font-weight:600; font-size:var(--fs-sm); line-height:1; letter-spacing:-.02em; font-stretch:condensed; align-items:center; }
.fb small{ font-size:6u; font-weight:600; align-self:flex-start; margin:3u 1px 0 0; letter-spacing:0; }
.fb.b95{ background:var(--hg-accent-tx); } .fb.b98{ background:var(--hg-accent-tx); } .fb.bon{ background:#1C1C1E; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); } .fb.bx{ background:#636366; }
.fc .tr{ display:inline-flex; width:auto; height:auto; background:none !important; align-items:center; justify-content:center; margin-left:-1u; }
.fc .tr ha-icon{ width:14px; height:14px; display:flex; --mdc-icon-size:14px; }
.fc .tr.up{ color:inherit; opacity:.8; background:var(--hg-tile-bg, rgba(255,255,255,.12)) !important; } .fc .tr.dn{ color:var(--hg-accent-tx); background:var(--hg-accent-faint) !important; } .fc .tr.eq{ color:inherit; opacity:.68; }
.head p{ margin:0; font-size:23u; font-weight:400; letter-spacing:-.01em; line-height:1.2; text-shadow: 0 1px 12px rgba(0,0,0,.18); }
/* ----- szyna ----- */
.rail{ display:flex; flex-direction:column; align-items:center; gap:var(--s1); padding:5u; border-radius:999px; width:40u;
  background: rgba(30,36,44,.22); border:1px solid rgba(255,255,255,.42); -webkit-backdrop-filter: var(--hg-bfo, blur(calc(14px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(14px * var(--hg-bf, 1))));
  box-shadow: var(--hg-sh); }
.ri{ width:30u; height:30u; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; transition: background .25s, color .25s; }
.ri ha-icon, .ri svg{ width:15u; height:15u; }
.ri:hover{ background:rgba(255,255,255,.14); }
.rail{ position:relative; }
:host(:not([mode=phone])[norail]) .rail{ visibility:hidden; pointer-events:none; }
.ri{ position:relative; z-index:1; }
.ri.act{ color:#1F2125; }
.ri.act:hover{ background:none; }
.ri.act[data-act=railmore], .ri.act[data-act=more], .ri[aria-expanded=true]{ background:var(--hg-accent) !important; color:var(--hg-on-accent) !important; text-shadow:none !important; }
.ri:focus{ outline:none; } .ri:focus-visible, .tab:focus-visible, .cir:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
/* ----- panel ----- */
.vempty{ grid-column:1 / -1; min-height:min(60vh, 420px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; text-align:center; padding:24px; color:var(--hg-tx, inherit); animation:hgVeIn .3s ease both; }
.vempty .vei{ width:56px; height:56px; border-radius:18px; display:grid; place-items:center; background:var(--hg-accent-faint); color:var(--hg-accent-tx, var(--hg-accent)); margin-bottom:4px; } .vempty .vei ha-icon, .vempty .vei svg{ --mdc-icon-size:28px; width:28px; height:28px; }
.vempty b{ font-size:18px; font-weight:600; } .vempty small{ font-size:13.5px; opacity:.72; max-width:300px; }
.vempty button{ all:unset; cursor:pointer; margin-top:8px; display:inline-flex; align-items:center; gap:6px; height:40px; padding:0 18px; border-radius:999px; background:var(--hg-accent); color:var(--hg-on-accent, #0B0F0A); font-weight:600; font-size:14px; transition:transform .15s; }
.vempty button:active{ transform:scale(.96); } .vempty button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:3px; } .vempty button ha-icon, .vempty button svg{ --mdc-icon-size:18px; width:18px; height:18px; }
@keyframes hgVeIn{ from{ transform:translateY(8px); } } @media (prefers-reduced-motion:reduce){ .vempty{ animation:none; } }
.panel{ display:grid; gap:var(--s2); padding:var(--s3); border-radius:var(--r-lg); --hg-u: calc(var(--hg-u0, 1.3px) * var(--hg-zoom, 1)); --k: var(--hg-u); --r-lg:24u; --r-md:16u; --r-sm:12u; --s1:8u; --s2:12u; --s3:16u; --s4:24u; --fs-xs:var(--hg-fs-xs, 8.5u); --fs-sm:var(--hg-fs-sm, 10u); --fs-md:var(--hg-fs-md, 12u); 
  background: var(--hg-panel-bg);
  border:0; -webkit-backdrop-filter: var(--hg-bfo, blur(calc(16px * var(--hg-bf, 1))) saturate(120%)); backdrop-filter: var(--hg-bfo, blur(calc(16px * var(--hg-bf, 1))) saturate(120%));
  box-shadow: 0 20u 50u rgba(10,20,30,.18); }
.cw{ min-width:0; min-height:0; contain: layout style; container-type:inline-size; animation: hgCwIn .6s cubic-bezier(.2,0,0,1) both; }
.cw:nth-child(2){ animation-delay:.06s } .cw:nth-child(3){ animation-delay:.12s } .cw:nth-child(4){ animation-delay:.18s } .cw:nth-child(5){ animation-delay:.24s } .cw:nth-child(n+6){ animation-delay:.3s }
/* tylko transform: opacity w animacji (a przy fill both także po jej końcu) robi z .cw backdrop root i blur kart w środku nie działa */
@keyframes hgCwIn{ from{ transform:translateY(10px) } }
:host([lite]) .cw{ animation:none; }
@media (prefers-reduced-motion: reduce){ .cw{ animation:none; } }
.cw > *{ height:100%; }
/* ukryty panel: visibility nie wystarcza (ha-card w kartach ma własne visibility:visible i przebijał się po animacji) -> także opacity 0 i bez rozmycia */
:host([vlocked]) .panel, :host([vlocked]) .hub{ visibility:hidden !important; }   /* widok zablokowany PIN-em: treść ukryta pod pinpadem */
:host([panel-hidden]) .panel{ visibility:hidden; opacity:0 !important; pointer-events:none; -webkit-backdrop-filter:none !important; backdrop-filter:none !important; }
/* w trakcie animacji: jedno rozmycie (sam panel), potomkowie bez backdrop-filter / animacji / przejść -> panel znika jako jedna warstwa */
:host([panel-anim]) .panel{ transform-origin: 100% 50%; pointer-events:none; --hg-inner-bf: none; }
/* panel bez tła (panel_backdrop: false albo Wygląd > Tło panelu): panel bez tła/ramki/cienia/rozmycia (ten sam padding i ramka przezroczysta = karty się nie przesuwają); karty mają własne szkło z rozmyciem */
:host([no-pbg]) .panel{ background:none !important; border-color:transparent !important; box-shadow:none !important; -webkit-backdrop-filter:none !important; backdrop-filter:none !important;
  --hg-card-bf: blur(calc(var(--hg-glass-blur, 14px) * var(--hg-bf, 1))) saturate(var(--hg-glass-sat, 180%)) brightness(var(--hg-glass-bri, 1)); }
:host([no-pbg]) .panel{ padding:0 !important; border-width:0 !important; }
/* przewijane panele: mały wewnętrzny margines na cień/uniesienie kart, kompensowany ujemnym marginesem (te same zewnętrzne krawędzie) */
:host([no-pbg][mode=wide][scroll]) .panel, :host([no-pbg][mode=wide][fit-panel]) .panel{ padding:8px !important; margin:-8px; scroll-padding-bottom:8px; }
:host([no-pbg][mode=wide][wide-panel][scroll]) .panel, :host([no-pbg][mode=wide][wide-panel][fit-panel]) .panel{ margin:calc(max(24px, calc(var(--hg-u0) * 14)) - 8px) -8px -8px; }
:host([no-pbg][panel-anim]) .panel{ --hg-card-bf: none; --hg-glass-lite: var(--hg-glass-lite-c); --hg-warm-lite: var(--hg-warm-lite-c); }
:host([panel-anim]) .panel *, :host([panel-anim]) .panel *::before, :host([panel-anim]) .panel *::after{ animation:none !important; transition:none !important; }
/* ----- toolbar ----- */
.tools{ display:flex; align-items:center; justify-content:space-between; gap:var(--s1); padding:5u var(--s1); border-radius:var(--r-lg); height:39u; width:171u;
  background: rgba(30,32,36,.30); border:1px solid rgba(255,255,255,.55); -webkit-backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); }
.tb{ width:28u; height:28u; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; background: rgba(30,30,30,.55); }
.tb ha-icon{ width:17u; height:17u; } .tb.sm ha-icon{ width:14u; height:14u; }
/* ----- hub ----- */
.hub{ display:flex; align-items:center; gap:var(--s1); padding:var(--s1) var(--s1) var(--s1) var(--s2); border-radius:var(--r-sm); width:329u; height:49u;
  background: rgba(40,40,40,.30); border:1px solid rgba(255,255,255,.45); -webkit-backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); }
.ht{ flex:1; min-width:0; line-height:1.15; } .ht b{ display:block; font-size:var(--fs-sm); font-weight:400; }
.ht span{ display:block; font-size:var(--fs-xs); font-weight:400; opacity:.95; max-width:125u; }
.plus{ width:22u; height:22u; border-radius:5u; background:rgba(150,154,158,.6); color:#fff; display:flex; align-items:center; justify-content:center; position:relative; }
.plus ha-icon{ width:16u; height:16u; }
.avs{ display:flex; gap:3u; }
.pa{ position:relative; border-radius:var(--r-sm); }
.hav{ display:flex; width:24u; height:24u; border-radius:var(--r-sm); background:center/cover #ccc; align-items:center; justify-content:center; font-size:var(--fs-xs); font-weight:600; color:#fff; }
.pa::after{ content:''; position:absolute; right:-1u; bottom:-1u; width:6u; height:6u; border-radius:50%; background:#9AA0A6; box-shadow:0 0 0 1.5px rgba(40,40,40,.8); }
.pa.home::after{ background:var(--hg-accent); }
.back{ width:38u; height:38u; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff;
  background: rgba(160,164,168,.55); border:1px solid rgba(255,255,255,.3); -webkit-backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); backdrop-filter: var(--hg-bfo, blur(calc(12px * var(--hg-bf, 1)))); }
.back ha-icon{ width:20u; height:20u; }
/* treść na szkle kontrolek wg schematu: jasny = ciemne ikony/tekst na jasnym szarym szkle, ciemny = białe; aktywny = biała pigułka */
.tab:not(.act), .cir, .uin, .chev, .ri:not(.act), .back, .hub, .fc, .tb{ color: var(--hg-chrome-fg) !important; text-shadow: var(--hg-chrome-ts) !important; }
.tab:not(.act):hover, .ri:not(.act):hover{ background: var(--hg-chrome-hover); }
.tb, .plus{ background: var(--hg-chrome-btn) !important; color: var(--hg-chrome-fg) !important; }

.fc .tr.eq{ color: var(--hg-chrome-fg); }
.ind, .rind, :host([lite]) .ind, :host([lite]) .rind{ box-shadow: var(--hg-chrome-pill-sh) !important; }
@media (pointer:coarse){ .tab::before, .cir::before, .ri::before, .tb::before, .plus::before, .pa::before, .chev::before{ content:''; position:absolute; inset:-6px; } .ri, .tb, .chev{ position:relative; } }

/* ================= WIDE (desktop/landscape) – geometria referencji 912x597 ================= */
:host([mode=wide]) .page{ height:100vh; height:100dvh; overflow:hidden; }
:host([mode=wide]) .top{ position:absolute; left:20u; right:20u; top:20u; height:39u; }
:host([mode=wide]) .tabs{ position:absolute; left:204u; top:0; }
:host([mode=wide]) .head{ position:absolute; left:26u; top:78u; max-width:400u; }
:host([mode=wide]) .rail{ position:absolute; left:16u; top:184u; }
:host([mode=wide]) .panel{ position:absolute; right:18u; top:73u; bottom:19u; width:calc(var(--k) * 438); }
:host([mode=wide][scroll]) .panel{ overflow:auto; align-content:start; overscroll-behavior:contain; scrollbar-width:thin; scrollbar-color: rgba(0,0,0,.28) transparent; scroll-padding-bottom:var(--s3); }
:host([mode=wide][scroll]) .panel::-webkit-scrollbar{ width:6px; } :host([mode=wide][scroll]) .panel::-webkit-scrollbar-track{ background:transparent; margin:var(--s3) 0; }
:host([mode=wide][scroll]) .panel::-webkit-scrollbar-thumb{ background:rgba(0,0,0,.28); border-radius:3px; }
.more{ display:none; }
/* ----- Studio (view cfg studio:true): ta sama góra, szyna i menu co zawsze; szkło daje każdy widżet, nie panel ----- */
.sst{ display:flex; align-items:center; gap:8u; margin-right:6u; font-size:12u; font-weight:500; white-space:nowrap; font-variant-numeric:tabular-nums; } .sst .si{ display:inline-flex; } .sst .si ha-icon, .sst .si svg{ width:16u; height:16u; --mdc-icon-size:16u; }
.rth{ margin-top:auto; }
:host([studio]) .head, :host([studio]) .brand span{ display:none; }
:host([studio]) .panel{ background:none; border:0; box-shadow:none; -webkit-backdrop-filter:none; backdrop-filter:none; padding:0; }
:host([studio]) .un{ display:none; }
:host([studio][mode=wide]) .tabs{ left:56u; }
:host([studio][mode=wide]) .rail{ top:73u; bottom:19u; }
:host([studio][mode=wide]) .panel{ left:70u; width:auto; }
:host([studio][mode=phone]) .sst, :host([studio][mode=phone]) .rth{ display:none; }
:host([mode=wide][scroll]) .more:not([hidden]){ display:flex; position:absolute; z-index:5; width:36px; height:36px; border-radius:50%; align-items:center; justify-content:center;
  color: var(--hg-chrome-fg); }
/* podskakuje tylko ikona i tylko 3 razy: ruch szklanego przycisku przeliczał jego rozmycie w każdej klatce (połowa klatek na słabszym tablecie) */
:host([mode=wide][scroll]) .more ha-icon{ width:20px; height:20px; animation: hgmore 2.4s ease-in-out 3; }
@media (prefers-reduced-motion: reduce){ :host([mode=wide][scroll]) .more ha-icon{ animation:none; } }
:host([mode=wide][scroll]:not([wide-panel])) .more{ right:calc(18u + var(--k) * 219 - 18px); bottom:calc(19u + 10px); }
:host([mode=wide][scroll][wide-panel]) .more{ left:calc(86u + (100% - 86u - var(--s3)) / 2 - 18px); bottom:calc(var(--s3) + 10px); }

@keyframes hgmore{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(3px); } }
:host([mode=wide]) .tools{ position:absolute; left:151u; bottom:80u; }
:host([mode=wide]) .hub{ position:absolute; left:96u; bottom:20u; }
:host([mode=wide][hub-right]) .hub{ left:auto; right:476u; }
:host([mode=wide]) .back{ position:absolute; left:16u; bottom:22u; }

/* ================= TABLET (portret / wąskie okna) ================= */
:host([mode=tablet]) .page, :host([mode=phone]) .page{ min-height:100vh; min-height:100dvh; display:grid; }
:host([mode=tablet]) .page{ grid-template-columns: 44u 1fr auto; column-gap:14u; row-gap:14u; padding:16u 16u calc(16u + env(safe-area-inset-bottom)) 16u;
  grid-template-areas: "top top top" "head head head" "rail panel panel" "back hub tools"; grid-template-rows: auto auto 1fr auto; align-items:start; }
:host([mode=tablet]) .top{ grid-area:top; flex-wrap:wrap; row-gap:12u; }
:host([mode=tablet]) .tabs{ order:3; width:100%; justify-content:space-between; }
:host([mode=tablet]) .tab{ flex:1; }
:host([mode=tablet]) .tabs{ container-type:inline-size; }
:host([tabs-compact]) .tab .tl{ display:none; } :host([tabs-compact]) .tab{ padding:0 var(--s2); }
@container (max-width: 600px){ .tab .tl{ display:none; } .tab{ padding:0 var(--s2); } }
:host([mode=tablet]) .head{ grid-area:head; padding:4u 2u 0; }
:host([mode=tablet]) .rail{ grid-area:rail; position:sticky; top:16u; width:44u; }
:host([mode=tablet]) .ri{ width:34u; height:34u; }
:host([mode=tablet]) .panel{ grid-area:panel; align-self:stretch; }
:host([mode=tablet]) .tools{ grid-area:tools; align-self:center; }
:host([mode=tablet]) .hub{ grid-area:hub; width:100%; align-self:center; }
:host([mode=tablet]) .back{ grid-area:back; align-self:center; }

/* ================= PHONE ================= */
:host([mode=phone]) .page{ grid-template-columns: 1fr; row-gap:14px; padding:12px 12px calc(96px + env(safe-area-inset-bottom)) 12px;
  grid-template-areas: "top" "head" "panel" "hub" "tools"; overflow-x:hidden; }
:host([mode=phone]) .top{ grid-area:top; flex-wrap:wrap; row-gap:10px; min-width:0; }
:host([mode=phone]) .brand{ min-height:44px; }
:host([mode=phone]) .tabs{ order:3; width:100%; height:52px; padding:4px; overflow-x:auto; scrollbar-width:none; justify-content:flex-start; }
:host([mode=phone]) .tabs::-webkit-scrollbar{ display:none; }
:host([mode=phone]) .tab{ height:44px; padding:0 clamp(5px, 2.1vw, 9px); font-size:clamp(12.5px, 3.5vw, 13.5px); flex:1 0 auto; border-radius:22px; }
:host([mode=phone]) .tab.act{ padding:0 clamp(8px, 3vw, 12px); }
:host([mode=phone]) .tab .nb{ top:0; right:0; }
:host([mode=phone]) .cir{ width:44px; height:44px; } :host([mode=phone]) .cir ha-icon{ width:20px; height:20px; }
:host([mode=phone]) .ndot{ top:10px; right:11px; width:8px; height:8px; }
:host([mode=phone]) .user{ height:48px; border-radius:24px; padding:0 4px; }
:host([mode=phone]) .uin{ min-width:44px; justify-content:center; }
:host([mode=phone]) .uav{ width:36px; height:36px; }
:host([mode=phone]) .un{ display:none; }
:host([mode=phone]) .chev{ width:30px; height:44px; }
:host([mode=phone]) .head{ grid-area:head; padding:2px 4px 0; }
:host([mode=phone]) .head h1{ font-size:clamp(20px, 6.6vw, 26px); } :host([mode=phone]) .head p{ font-size:clamp(15px, 4.9vw, 19px); }
:host([mode=phone]) .head[data-sz=s] h1{ font-size:clamp(15px, 4.9vw, 20px); }
:host([mode=phone]) .head[data-sz=l] h1{ font-size:clamp(28px, 9vw, 36px); }
:host([mode=phone]) .head[data-sz=xl] h1{ font-size:clamp(52px, 16vw, 72px); font-weight:100; letter-spacing:-.04em; }
.head h1, .head p{ overflow-wrap:anywhere; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; line-clamp:2; overflow:hidden; text-overflow:ellipsis; } .head p{ -webkit-line-clamp:2; }
.head h1 .hdi{ width:1em; height:1em; --mdc-icon-size:1em; margin-right:.32em; vertical-align:-.12em; color:var(--hg-accent); }
.head.hd-off > h1, .head.hd-off > p{ display:none; } :host([editing]) .head.hd-off > h1, :host([editing]) .head.hd-off > p{ display:-webkit-box; opacity:.38; } :host([editing]) .head.hd-off > h1.rh, :host([editing]) .head.hd-off > p.renv{ display:flex; }
:host([editing]) .head.hd-off::before{ content:attr(data-off); display:block; width:max-content; margin-bottom:6px; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:600; background:var(--hg-accent); color:var(--hg-on-accent, #000); }
.head .hge-hd{ all:unset; cursor:pointer; position:absolute; top:0; right:-40px; z-index:2; width:32px; height:32px; border-radius:50%; display:inline-grid; place-items:center; background:var(--hg-accent); color:var(--hg-on-accent); vertical-align:middle; box-shadow:0 4px 14px rgba(0,0,0,.25); } .head .hge-hd ha-icon{ width:18px; height:18px; --mdc-icon-size:18px; } :host([mode=phone]) .head, :host([mode=tablet]) .head{ position:relative; } :host([mode=phone]) .head .hge-hd, :host([mode=tablet]) .head .hge-hd{ right:4px; }
:host([mode=phone]) .fuel{ flex-wrap:nowrap; gap:6px; margin-top:10px; overflow-x:auto; scrollbar-width:none; } :host([mode=phone]) .hrow{ gap:6px; margin-top:10px; max-width:100%; } :host([mode=phone]) .head, :host([mode=tablet]) .head{ min-width:0; } :host([mode=phone]) .hrow .fuel{ margin-top:0; flex:1; } :host([mode=phone]) .hrow{ --chip-h:40px; --chip-r:12px; --chip-pl:6px; --chip-pr:10px; --chip-ic:28px; align-items:center; scroll-snap-type:x proximity; }
.fc .fl{ opacity:1 !important; height:16u; padding:0 6u; border-radius:999px; font-size:var(--fs-xs); font-weight:700; letter-spacing:.02em; background:var(--hg-accent); color:var(--hg-on-accent); }
.fc .fl.on{ background:var(--hg-on-accent); color:var(--hg-thumb); }
.fc .tr.up{ color:var(--hg-trend-up) !important; opacity:1 !important; background:rgba(255,90,82,.16) !important; }
.fc .tr.dn{ color:var(--hg-accent-tx) !important; background:var(--hg-accent-soft) !important; }
.fc .tr.eq{ opacity:.68; background:var(--hg-tile-bg, rgba(255,255,255,.12)) !important; }
:host([mode=phone]) .fc .fl{ height:20px; padding:0 7px; font-size:11px; }
:host([mode=phone]) .fc{ box-sizing:border-box; height:var(--chip-h); padding:0 var(--chip-pr) 0 var(--chip-pl); border-radius:var(--chip-r); font-size:15px; gap:6px; flex:none; scroll-snap-align:start; } :host([mode=phone]) .fuel{ align-items:center; scroll-snap-type:x proximity; }
:host([mode=phone]) .wxs{ height:var(--chip-h); align-items:center; } :host([mode=phone]) .wxs > *{ height:var(--chip-h); display:flex; }
:host([mode=phone]) .fb{ min-width:30px; height:28px; border-radius:8px; font-size:14px; padding:0 4px; box-sizing:border-box; } :host([mode=phone]) .fb small{ font-size:9px; margin-top:4px; }

/* telefon: większa skala pisma przez tokeny (karty dziedziczą --hg-fs-*), hierarchia zachowana */
:host([mode=phone]) .menu button{ font-size:15px; } :host([mode=phone]) .st{ font-size:14px; }
:host([mode=phone]){ --hg-fs-xs:13px; --hg-fs-sm:15px; --hg-fs-md:17px; --hg-fsv:1.12; --hg-fs-min:12px; }
:host([mode=phone]) .head .renv{ font-size:16px; } :host([mode=phone]) .head .renv .rt{ font-size:28px; }
:host([mode=phone]) .panel{ grid-area:panel; padding:12px; gap:12px; border-radius:24px; }
/* ===== tryb edycji układu ===== */
.cir.ed.on{ background:var(--hg-accent) !important; color:var(--hg-on-accent) !important; }
:host([editing]) .tools, :host([editing]) .hub{ visibility:hidden; }
.hge-bar{ position:fixed; z-index:60; left:50%; bottom:22px; transform:translateX(-50%); display:flex; align-items:center; gap:8px; padding:6px; border-radius:999px; max-width:calc(100vw - 24px); overflow-x:auto; scrollbar-width:none;
  background:var(--hg-chrome-bg, var(--hg-glass-bg)); -webkit-backdrop-filter:var(--hg-bfo, blur(22px) saturate(120%)); backdrop-filter:var(--hg-bfo, blur(22px) saturate(120%)); box-shadow:0 12px 36px rgba(0,0,0,.32); color:var(--hg-chrome-fg, inherit); animation:hgeBar .32s cubic-bezier(.2,0,0,1) both; }
@keyframes hgeBar{ from{ opacity:0; transform:translate(-50%, 14px); } }
:host([scroll]) .panel{ overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color: rgba(255,255,255,.35) transparent; }
:host([scroll]) .panel::-webkit-scrollbar{ width:6px; } :host([scroll]) .panel::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.35); border-radius:3px; } :host([scroll]) .panel::-webkit-scrollbar-track{ background:transparent; }
:host([mode=phone]) .panel{ overflow-y:visible !important; }
/* tablet: przewija się strona, nie panel (Safari źle składa rozmycie i kolumny w przewijanym panelu) */
:host([mode=tablet]) .panel{ overflow:visible !important; max-height:none !important; height:auto !important; }
.hge-bar .hgt{ display:inline-flex; align-items:center; gap:6px; padding:0 10px 0 8px; white-space:nowrap; font-size:14px; } .hge-bar .hgt ha-icon{ width:18px; height:18px; color:var(--hg-accent-tx); }
.hge-bar button{ flex:none; display:inline-flex; align-items:center; gap:6px; height:40px; padding:0 14px; border:0; border-radius:999px; background:var(--hg-tile-bg); color:inherit; font:500 14px/1 inherit; cursor:pointer; white-space:nowrap; transition:transform .15s, background .2s; }
.hge-bar button:active{ transform:scale(.96); } .hge-bar button:disabled{ opacity:.45; cursor:default; }
.hge-bar button ha-icon{ width:18px; height:18px; } .hge-bar button.ok{ background:var(--hg-accent); color:var(--hg-on-accent); font-weight:600; }
.hge-bar button:focus-visible, .hge-sheet button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
:host([mode=phone]) .hge-bar{ bottom:calc(env(safe-area-inset-bottom, 0px) + 92px); } :host([mode=phone]) .hge-bar .hgt, :host([mode=phone]) .hge-bar [data-hge=reset] span, :host([mode=phone]) .hge-bar [data-hge=hidden] span{ display:none; } :host([mode=phone]) .hge-bar{ gap:6px; } :host([mode=phone]) .hge-bar button{ padding:0 12px; }
.hge-sheet-l{ position:fixed; inset:0; z-index:70; }
.hge-scrim{ position:absolute; inset:0; background:rgba(8,12,18,.36); animation:hgeFade .2s ease both; } @keyframes hgeFade{ from{ opacity:0 } }
.hge-sheet{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:min(560px, calc(100vw - 24px)); max-height:min(78vh, 720px); display:flex; flex-direction:column; gap:10px; padding:16px; border-radius:26px;
  background:var(--hg-glass-sheen, none), var(--hg-sheet-bg, var(--hg-panel-bg, var(--hg-glass-bg))); -webkit-backdrop-filter:var(--hg-bfo, blur(26px) saturate(120%)); backdrop-filter:var(--hg-bfo, blur(26px) saturate(120%)); box-shadow:var(--hg-edge, 0 0 0 transparent), 0 24px 60px rgba(0,0,0,.4); color:var(--hg-chrome-fg, inherit); animation:hgeIn .28s cubic-bezier(.2,0,0,1) both; }
@keyframes hgeIn{ from{ opacity:0; transform:translate(-50%,-46%) scale(.98); } }
.hge-sheet-l.opened .hge-scrim, .hge-sheet-l.opened .hge-sheet{ animation:none !important; }   /* arkusz już otwarty: kolejne kroki bez ponownej animacji otwarcia */
.hge-sheet-l.nav-f .hge-sheet > :not(.hs-h):not(style){ animation:hgNavF .26s cubic-bezier(.2,.8,.2,1) both; } .hge-sheet-l.nav-b .hge-sheet > :not(.hs-h):not(style){ animation:hgNavB .26s cubic-bezier(.2,.8,.2,1) both; }
@keyframes hgNavF{ from{ transform:translateX(28px); } } @keyframes hgNavB{ from{ transform:translateX(-28px); } }
.hs-bk + b{ flex:1; min-width:0; }
.hs-h b:focus{ outline:none; } .hs-h b:focus-visible{ outline:none; }
.hs-cf{ position:absolute; inset:0; z-index:5; display:grid; place-items:center; padding:20px; border-radius:inherit; background:rgba(8,12,18,.35); }
.hs-seg{ display:grid; grid-template-columns:repeat(3, 1fr); gap:4px; padding:4px; border-radius:16px; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, none); -webkit-backdrop-filter:var(--hg-bfo, blur(12px)); backdrop-filter:var(--hg-bfo, blur(12px)); }
.hs-seg button{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; min-height:58px; padding:8px 6px; border-radius:12px; font:500 13px/1.2 inherit; text-align:center; transition:background .2s, color .2s; }
.hs-seg button:hover{ background:var(--hg-hover-fill, rgba(127,127,127,.12)); } .hs-seg button[aria-pressed=true]{ background:var(--hg-accent); color:var(--hg-on-accent); font-weight:600; } .hs-seg button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.hs-seg .sg{ display:flex; gap:2px; width:30px; height:12px; } .hs-seg .sg i{ flex:1; border-radius:3px; border:1.5px solid currentColor; opacity:.4; box-sizing:border-box; } .hs-seg .sg-s i:nth-child(1), .hs-seg .sg-m i:nth-child(-n+2), .hs-seg .sg-l i{ background:currentColor; opacity:1; }
/* wybór ikony: szklany panel na tokenach motywu (bez literałów kolorów, więc generator ciemnego motywu go nie odwraca) */
.hs-ipw{ position:relative; } .hs-ipb{ all:unset; cursor:pointer; flex:none; width:34px; height:34px; border-radius:12px; display:grid; place-items:center; transition:background-color var(--ui-t, .15s); } .hs-ipb:hover{ background:var(--ui-sec2, var(--hg-tile-bg)); } .hs-ipb:focus-visible{ outline:2px solid var(--hg-accent); }
.hs-ipb ha-icon{ transition:transform .22s cubic-bezier(.2,0,0,1); } .hs-ipb[aria-expanded=true] ha-icon{ transform:rotate(180deg); } .hs-ipb[aria-expanded=true]{ background:var(--ui-sec, var(--hg-tile-bg)); }
.hs-ipp{ position:absolute; left:0; right:0; top:calc(100% + 8px); z-index:30; box-sizing:border-box; padding:10px; border-radius:24px; color:inherit; isolation:isolate; display:flex; flex-direction:column; gap:6px;
  background:color-mix(in srgb, var(--hg-ov-bg) 74%, transparent); -webkit-backdrop-filter:var(--hg-bfo, blur(28px) saturate(160%)); backdrop-filter:var(--hg-bfo, blur(28px) saturate(160%));
  box-shadow:inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent), inset 0 1px 0 color-mix(in srgb, var(--hg-thumb) 14%, transparent), 0 24px 56px -12px var(--hg-glass-sh-h, var(--hg-glass-sh)), 0 8px 20px -10px var(--hg-glass-sh);
  transform-origin:50% 0; animation:hgIpIn .2s cubic-bezier(.2,.8,.2,1) both; }
.hs-ipp.up{ top:auto; bottom:calc(100% + 8px); transform-origin:50% 100%; } .hs-ipp.out{ animation:hgIpOut .12s ease-in both; pointer-events:none; }
@keyframes hgIpIn{ from{ opacity:0; transform:translateY(-6px) scale(.97); } } @keyframes hgIpOut{ to{ opacity:0; transform:translateY(-4px) scale(.98); } }
.hs-ipp.up{ animation-name:hgIpInUp; } @keyframes hgIpInUp{ from{ opacity:0; transform:translateY(6px) scale(.97); } }
.hs-ipp > .hs-s{ height:42px; background:color-mix(in srgb, currentColor 7%, transparent); box-shadow:none; }
.hs-ipp > .hs-s::after{ display:none; } .hs-ipp > .hs-s:focus-within{ box-shadow:inset 0 0 0 1.5px var(--hg-accent); }
.hs-ipp > small{ display:flex; align-items:center; gap:6px; margin-top:4px; padding:0 8px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; opacity:.62; }
.hs-ipp > small em{ font-style:normal; font-weight:500; letter-spacing:0; text-transform:none; margin-left:auto; padding:2px 8px; border-radius:999px; background:color-mix(in srgb, currentColor 8%, transparent); font-variant-numeric:tabular-nums; }
.hs-ipg{ display:grid; grid-template-columns:repeat(auto-fill, minmax(40px, 1fr)); gap:4px; max-height:228px; overflow-y:auto; overscroll-behavior:contain; padding:2px; margin:0 -2px; scrollbar-width:thin; scrollbar-color:color-mix(in srgb, currentColor 22%, transparent) transparent; }
.hs-ipg.all{ -webkit-mask-image:linear-gradient(to bottom, black calc(100% - 22px), transparent); mask-image:linear-gradient(to bottom, black calc(100% - 22px), transparent); padding-bottom:14px; } .hs-ipg.rc{ max-height:none; }
.hs-ipg::-webkit-scrollbar{ width:6px; } .hs-ipg::-webkit-scrollbar-thumb{ border-radius:3px; background:color-mix(in srgb, currentColor 22%, transparent); }
.hs-ipg button{ all:unset; cursor:pointer; aspect-ratio:1; border-radius:14px; display:grid; place-items:center; color:inherit; transition:background-color .15s, color .15s, box-shadow .15s; }
.hs-ipg button ha-icon{ opacity:.82; transition:transform .18s cubic-bezier(.2,.8,.2,1), opacity .15s; }
.hs-ipg button:hover{ background:color-mix(in srgb, currentColor 10%, transparent); } .hs-ipg button:hover ha-icon{ opacity:1; transform:scale(1.14); }
.hs-ipg button:active ha-icon{ transform:scale(.92); }
.hs-ipg button:focus-visible{ outline:none; box-shadow:inset 0 0 0 2px var(--hg-accent); background:color-mix(in srgb, var(--hg-accent) 12%, transparent); } .hs-ipg button:focus-visible ha-icon{ opacity:1; }
.hs-ipg button[aria-selected=true]{ background:var(--hg-accent); color:var(--hg-on-accent); } .hs-ipg button[aria-selected=true] ha-icon{ opacity:1; }
.hs-ipg ha-icon{ --mdc-icon-size:22px; width:22px; height:22px; } .hs-ipe{ padding:18px 8px; font-size:13px; opacity:.66; text-align:center; grid-column:1 / -1; line-height:1.4; }
.hs-ipg .hs-ipk{ aspect-ratio:1; border-radius:14px; background:color-mix(in srgb, currentColor 7%, transparent); animation:var(--hg-loop, hgIpSk 1.1s ease-in-out infinite alternate); } @keyframes hgIpSk{ to{ opacity:.4; } }
.hs-ipg.fresh button{ animation:hgIpCell .22s cubic-bezier(.2,.8,.2,1) both; } @keyframes hgIpCell{ from{ opacity:0; transform:scale(.9); } }
@media (prefers-reduced-motion:reduce){ .hs-ipp, .hs-ipp.out, .hs-ipg.fresh button, .hs-ipg .hs-ipk{ animation:none !important; } .hs-ipg button ha-icon, .hs-ipb ha-icon{ transition:none !important; } }
.hs-cfb{ width:min(320px, 100%); box-sizing:border-box; padding:18px; border-radius:20px; display:flex; flex-direction:column; gap:6px; color:#fff;
  background:rgba(30,34,40,.66); -webkit-backdrop-filter:var(--hg-bfo, blur(24px) saturate(160%)); backdrop-filter:var(--hg-bfo, blur(24px) saturate(160%)); border:1px solid rgba(255,255,255,.16); box-shadow:0 20px 50px rgba(0,0,0,.4);
  animation:hgCfIn .22s cubic-bezier(.2,.8,.2,1) both; }
.hs-cfb b{ font-size:16px; } .hs-cfb small{ font-size:13px; opacity:.72; line-height:1.35; } .hs-cfb div{ display:flex; gap:8px; justify-content:flex-end; margin-top:10px; }
.hs-bd{ background:var(--error-color, #DB4437) !important; color:var(--text-primary-color, #fff) !important; }
@keyframes hgCfIn{ from{ transform:translateY(8px) scale(.97); } }
.hs-bk{ all:unset; cursor:pointer; flex:none; width:34px; height:34px; margin-right:6px; border-radius:50%; display:grid; place-items:center; background:rgba(255,255,255,.10); transition:background .15s ease, transform .15s ease; }
.hs-bk:hover{ background:rgba(255,255,255,.18); transform:translateX(-2px); } .hs-bk:focus-visible{ box-shadow:0 0 0 2px var(--hg-accent); } .hs-bk ha-icon{ width:20px; height:20px; --mdc-icon-size:20px; }
@media (prefers-reduced-motion:reduce){ .hge-sheet-l.nav-f .hge-sheet > *, .hge-sheet-l.nav-b .hge-sheet > *{ animation:none !important; } }
:host([mode=phone]) .hge-sheet{ top:auto; bottom:0; transform:translateX(-50%); width:100vw; max-height:84vh; border-radius:26px 26px 0 0; padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 16px); animation:hgeUp .3s cubic-bezier(.2,0,0,1) both; }
@keyframes hgeUp{ from{ transform:translate(-50%, 30%); opacity:.4 } }
@media (prefers-reduced-motion: reduce){ .hge-bar, .hge-sheet, .hge-scrim{ animation:none !important; } }
.hs-h{ display:flex; align-items:center; justify-content:space-between; } .hs-h b{ font-size:18px; font-weight:500; padding-left:4px; }
.hs-x{ width:40px; height:40px; border-radius:50%; border:0; background:var(--hg-tile-bg); color:inherit; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.hs-s{ position:relative; display:flex; align-items:center; gap:8px; flex:none; height:44px; padding:0 6px 0 18px; border-radius:999px; isolation:isolate; box-sizing:border-box;
  background:var(--hg-glass-lite, var(--hg-glass-bg)); box-shadow:inset 0 0 0 1px rgba(255,255,255,.14), 0 4px 16px rgba(0,0,0,.12); transition:box-shadow .2s; }
.hs-s::after{ content:''; position:absolute; inset:0; border-radius:inherit; z-index:-1; -webkit-backdrop-filter:var(--hg-bfo, blur(calc(var(--hg-glass-blur, 14px) * var(--hg-bf, 1)))); backdrop-filter:var(--hg-bfo, blur(calc(var(--hg-glass-blur, 14px) * var(--hg-bf, 1)))); }
.hs-s:focus-within{ box-shadow:inset 0 0 0 1px transparent, 0 0 0 2px var(--hg-accent), 0 4px 16px rgba(0,0,0,.12); }
.hs-s > ha-icon{ flex:none; width:20px; height:20px; opacity:.8; margin-right:4px; }
.hs-s:not(:has(> .hs-clr:not([hidden]), > button)){ padding-right:18px; }
.hs-s input, .hs-in{ flex:1; min-width:0; height:100%; border:0; outline:0; background:none; color:inherit; font-family:inherit; font-size:15px; font-weight:400; line-height:1.2; padding:0; text-indent:0; }
.hs-s input::placeholder{ color:inherit; opacity:.72; }
.hs-s input[type=search]::-webkit-search-cancel-button{ -webkit-appearance:none; }
.hs-s .hs-clr{ flex:none; width:32px; height:32px; border-radius:50%; border:0; display:flex; align-items:center; justify-content:center; background:var(--hg-tile-bg); color:inherit; cursor:pointer; } .hs-s .hs-clr[hidden]{ display:none; } .hs-s .hs-clr ha-icon{ width:16px; height:16px; }
.hs-s .hs-b{ height:34px; }
/* przycisk w polu: równy odstęp 5 px od krawędzi (44 = 5 + 34 + 5), promień koncentryczny = promień pola − odstęp */
.hs-s:has(> button:last-child:not([hidden])){ padding-right:5px; } .hs-s > button:last-child{ flex:none; height:34px; min-width:34px; margin:0; border-radius:calc(22px - 5px); box-sizing:border-box; } .hs-s > .hs-clr:last-child{ width:34px; }
.hs-s > input{ padding-right:4px; text-overflow:ellipsis; }
.hs-f{ display:flex; gap:8px; flex:none; overflow-x:auto; scrollbar-width:none; padding:2px 2px 4px; -webkit-mask-image:linear-gradient(90deg, #000 calc(100% - 28px), transparent); mask-image:linear-gradient(90deg, #000 calc(100% - 28px), transparent); }
.hs-f::-webkit-scrollbar{ display:none; }
.hs-f.wrap{ flex-wrap:wrap; overflow:visible; -webkit-mask-image:none; mask-image:none; }
.hs-f input[type=color]{ width:44px; height:36px; border:0; border-radius:12px; padding:2px; background:var(--hg-tile-bg); cursor:pointer; }
.hge-sheet.wide{ width:min(640px, calc(100vw - 24px)); max-height:min(86vh, 820px); }
.hs-sc{ display:flex; flex-direction:column; gap:14px; overflow-y:auto; overscroll-behavior:contain; min-height:0; padding:2px; scrollbar-width:thin; }
.hs-hint{ font-size:12px; opacity:.75; padding-left:4px; }
.hs-pvb{ padding:10px; border-radius:20px; background:rgba(0,0,0,.12); max-height:min(380px, 45vh); overflow:hidden; contain:paint; } .hs-pvb.live{ display:block; } .hs-pvf{ display:block; max-height:calc(min(380px, 45vh) - 20px); overflow:hidden; pointer-events:none; position:relative; } .hs-pvf > *{ display:block; transform-origin:top left; } .hs-pvb.clone > div{ pointer-events:none; }
.hs-sw{ display:flex; flex-wrap:wrap; gap:10px; }
.hs-sw button, .hs-cc{ display:flex; flex-direction:column; align-items:center; gap:4px; border:0; background:none; color:inherit; cursor:pointer; padding:0; font:inherit; }
.hs-sw i{ width:36px; height:36px; border-radius:50%; background:var(--c); box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); }
.hs-sw button[aria-pressed=true] i{ box-shadow:0 0 0 3px var(--hg-glass-bg), 0 0 0 5px var(--c); }
.hs-sw small, .hs-cc small, .hs-bgs small{ font-size:11px; opacity:.8; }
.hs-cc input{ width:36px; height:36px; border:0; border-radius:50%; padding:0; background:none; cursor:pointer; }
.hs-ap{ display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:4px; font-size:13px; }
.hs-ap .b1{ padding:6px 12px; border-radius:999px; background:var(--a); color:var(--o); font-weight:600; } .hs-ap .b3{ opacity:.75; }
.hs-bgs{ display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:10px; }
.hs-bgs button{ display:flex; flex-direction:column; gap:4px; border:0; padding:0; background:none; color:inherit; cursor:pointer; font:inherit; text-align:left; }
.hs-bgs img{ width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,.2); }
.hs-bgs button[aria-pressed=true] img{ box-shadow:0 0 0 3px var(--hg-accent); }
.hs-rg{ width:100%; accent-color:var(--hg-accent); height:28px; }
.hs-f button{ flex:none; height:34px; padding:0 12px; border-radius:999px; border:0; background:var(--hg-tile-bg); color:inherit; font:500 13px/1 inherit; cursor:pointer; }
.hs-f button[aria-pressed=true]{ background:var(--hg-accent); color:var(--hg-on-accent); }
.hs-l{ display:flex; flex-direction:column; gap:6px; overflow-y:auto; min-height:120px; overscroll-behavior:contain; padding:2px; }
.hs-r{ display:flex; align-items:center; gap:10px; width:100%; min-height:56px; padding:8px 10px; border:0; border-radius:16px; background:var(--hg-tile-bg); color:inherit; font:inherit; text-align:left; cursor:pointer; transition:background .2s, transform .15s; }
.hs-r:active{ transform:scale(.985); } @media (hover:hover){ button.hs-r:hover{ background:var(--hg-accent-faint, var(--hg-tile-bg)); } }
.hs-i{ flex:none; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--hg-glass-bg); } .hs-i ha-icon{ width:20px; height:20px; }
.hs-t{ flex:1; display:flex; flex-direction:column; min-width:0; } .hs-t b{ font-weight:500; font-size:15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .hs-t small{ font-size:12px; opacity:.72; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hs-p{ flex:none; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--hg-accent); color:var(--hg-on-accent); } .hs-p ha-icon{ width:18px; height:18px; }
.hs-b{ flex:none; height:36px; padding:0 14px; border:0; border-radius:999px; background:var(--hg-accent); color:var(--hg-on-accent); font:600 13px/1 inherit; cursor:pointer; }
.hs-fl{ display:flex; flex-direction:column; gap:6px; }
.hs-er{ padding:0 6px 0 4px; gap:2px; position:relative; transition:box-shadow .15s; } .hs-er.drag{ z-index:2; box-shadow:0 10px 30px rgba(0,0,0,.35), 0 0 0 2px var(--hg-accent); transition:none; }
.hs-eb{ all:unset; cursor:pointer; flex:1; min-width:0; display:flex; align-items:center; gap:10px; min-height:56px; padding:0 4px; } .hs-eb:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:-2px; border-radius:14px; }
.hs-dg{ flex:none; width:24px; height:40px; display:grid; place-items:center; cursor:grab; touch-action:none; opacity:.55; } .hs-dg:active{ cursor:grabbing; } .hs-dg ha-icon{ width:20px; height:20px; }
.hs-del{ all:unset; cursor:pointer; flex:none; width:32px; height:32px; margin-left:6px; border-radius:50%; display:grid; place-items:center; background:color-mix(in srgb, currentColor 12%, transparent); } .hs-del:hover{ background:color-mix(in srgb, #E5484D 30%, transparent); } .hs-del ha-icon{ width:18px; height:18px; }
.hs-ix{ font-style:normal; display:inline-grid; place-items:center; min-width:18px; height:18px; padding:0 4px; margin-right:6px; border-radius:999px; font-size:11px; font-weight:600; vertical-align:2px; background:color-mix(in srgb, currentColor 14%, transparent); }
.hs-add{ box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--hg-accent) 55%, transparent); background:transparent; } .hs-add .hs-i{ background:var(--hg-accent); color:var(--hg-on-accent); } .hs-fl > span:not(.hs-s){ font-size:12px; opacity:.72; padding-left:18px; }
.hs-ac{ display:flex; justify-content:flex-end; gap:8px; padding-top:4px; } .hs-ac .hs-b{ height:42px; padding:0 20px; font-size:14px; }
.hs-b2{ height:42px; padding:0 18px; border:0; border-radius:999px; background:var(--hg-tile-bg); color:inherit; font:500 14px/1 inherit; cursor:pointer; }
.hs-pv{ display:flex; flex-direction:column; gap:6px; flex:none; } .hs-pv:empty{ display:none; } .hs-pv > small{ font-size:12px; opacity:.72; padding-left:4px; } .hs-pv .tg2{ grid-template-columns:1fr; pointer-events:none; } .hs-pvb.tg2 > *, .hs-pvb > .hgg{ width:100%; max-width:440px; justify-self:center; margin-inline:auto; box-sizing:border-box; }   /* kafel i grupa w podglądzie: szerokość jak w panelu, nie cały arkusz */
.hs-more{ display:block; height:1px; flex:none; } .hs-cnt{ padding:0 6px; opacity:.6; font-size:12px; }
.hs-e{ margin:12px 4px; opacity:.72; font-size:14px; }
/* tło panelu obejmuje treść (bez rozciągania do dołu ekranu) */
:host([mode=wide][wide-panel]:not([scroll])) .panel, :host([mode=tablet]) .panel, :host([mode=phone]) .panel{ align-self:start; height:auto; align-content:start; }
:host([mode=phone]) .rail{ position:fixed; z-index:10; left:12px; right:12px; bottom:calc(10px + env(safe-area-inset-bottom)); width:auto; height:64px;
  flex-direction:row; justify-content:space-around; border-radius:32px; padding:6px 8px; background: rgba(24,30,40,.74); }
:host([mode=phone]) .ri{ width:48px; height:48px; } :host([mode=phone]) .ri ha-icon, :host([mode=phone]) .ri svg{ width:22px; height:22px; }
:host([mode=phone]) .ri.pn{ flex:1 1 0; min-width:0; max-width:84px; height:54px; border-radius:22px; flex-direction:column; gap:2px; }
:host([mode=phone]) .ri.pn ha-icon{ width:21px; height:21px; }
:host([mode=phone]) .ri.pn span{ font-size:11.5px; line-height:1.1; max-width:100%; white-space:nowrap; overflow:visible; }
:host([mode=phone]) .ri.pn span.lg{ font-size:9.5px; letter-spacing:-.2px; }
:host([mode=phone]) .rail:has(.pn){ height:68px; padding:6px; gap:2px; justify-content:space-between; border-radius:34px; }
:host([mode=phone]) .rind{ border-radius:22px; }
:host([mode=phone]) .tabs{ display:none !important; }
:host([mode=phone]) .tools{ grid-area:tools; width:auto; height:56px; justify-self:center; gap:10px; padding:4px 8px; border-radius:28px; }
:host([mode=phone]) .tb{ width:44px; height:44px; } :host([mode=phone]) .tb ha-icon{ width:22px; height:22px; } :host([mode=phone]) .tb.sm{ display:none; }
:host([mode=phone]) .hub{ grid-area:hub; width:100%; height:auto; min-height:64px; padding:8px 10px; gap:10px; border-radius:16px; }
:host([mode=phone]) .ht b{ font-size:15px; } :host([mode=phone]) .ht span{ font-size:13px; max-width:none; }
:host([mode=phone]) .plus{ width:44px; height:44px; border-radius:12px; }
:host([mode=phone]) .hav{ width:34px; height:34px; border-radius:9px; font-size:12px; }
:host([mode=phone]) .avs{ gap:4px; }
:host([mode=phone]) .back{ display:none; }

/* ===== UI polish: wspólne tokeny arkuszy (promienie 8/12/16/24/28, odstępy 4/8, przyciski 36/44, akcent tylko lime) ===== */
:host{ --ui-r2:12px; --ui-r3:16px; --ui-r4:24px; --ui-rs:28px; --ui-t:150ms cubic-bezier(.2,0,0,1);
  --ui-sec:color-mix(in srgb, currentColor 8%, transparent); --ui-sec2:color-mix(in srgb, currentColor 14%, transparent); --ui-rim:inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent); --ui-sel:inset 0 0 0 1.5px var(--hg-accent); }
.hge-sheet{ border-radius:var(--ui-rs); padding:16px; gap:12px; }
:host([mode=phone]) .hge-sheet{ border-radius:var(--ui-rs) var(--ui-rs) 0 0; }
.hs-h{ min-height:40px; } .hs-h b{ font-size:17px; font-weight:600; letter-spacing:-.01em; }
.hs-x{ width:36px; height:36px; background:var(--ui-sec); box-shadow:var(--ui-rim); } .hs-x ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; }
.hs-sc{ gap:16px; }
.hs-fl{ gap:8px; } .hs-fl > span:not(.hs-s), .hge-sheet .lcv-f > span, .hge-sheet .lcv-n > span, .hs-pv > small{ font-size:12px; font-weight:500; opacity:.7; padding-left:18px; letter-spacing:.01em; }
.hs-s{ background:var(--ui-sec); box-shadow:var(--ui-rim); } .hs-s:focus-within{ box-shadow:var(--ui-sel); }
/* przyciski: główny lime z czarnym tekstem, drugorzędny szklany */
.hs-b, .hge-sheet .lk-mini, .hge-sheet .lx-hbtn.ok, .hs-ac > .hs-b{ height:36px; padding:0 16px; border-radius:999px; background:var(--hg-accent); color:var(--hg-on-accent); font:600 14px/1 inherit; box-shadow:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; }
.hs-ac > .hs-b, .hs-ac > .hs-b2, .hge-sheet .lcv-a .lx-hbtn{ height:44px; padding:0 20px; }
.hs-b2, .hge-sheet .lx-hbtn:not(.ok){ height:36px; padding:0 16px; border-radius:999px; background:var(--ui-sec); box-shadow:var(--ui-rim); color:inherit; font:500 14px/1 inherit; display:inline-flex; align-items:center; justify-content:center; gap:8px; -webkit-backdrop-filter:var(--hg-bfo, blur(12px)); backdrop-filter:var(--hg-bfo, blur(12px)); }
.hs-b ha-icon, .hs-b2 ha-icon, .hge-sheet .lx-hbtn ha-icon, .hge-sheet .lk-mini ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; }
.hs-ac{ display:flex; justify-content:flex-end; align-items:center; gap:8px; } .hs-ac > .hs-b, .hs-ac > .hs-b2{ height:44px; min-width:104px; padding:0 20px; box-sizing:border-box; font-size:14px; line-height:1; border-radius:999px; }
@media (max-width:600px){ .hs-ac{ flex-direction:column-reverse; align-items:stretch; } .hs-ac > .hs-b, .hs-ac > .hs-b2{ width:100%; } }
.hs-b:disabled{ opacity:.4; cursor:default; }
.hs-ac{ gap:8px; padding-top:4px; }
/* segmenty / chipy */
.hs-f{ gap:8px; } .hs-f button{ height:36px; padding:0 14px; background:var(--ui-sec); box-shadow:var(--ui-rim); font:500 13px/1 inherit; display:inline-flex; align-items:center; gap:6px; } .hs-f button ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; }
.hs-f button[aria-pressed=true]{ background:var(--hg-accent); color:var(--hg-on-accent); box-shadow:none; font-weight:600; }
/* wiersze encji i list */
.hs-r, .hge-sheet .lx-r{ border-radius:var(--ui-r3); min-height:56px; gap:12px; background:var(--ui-sec); box-shadow:none; }
.hs-i, .hge-sheet .lx-i{ width:36px; height:36px; background:var(--ui-sec); }
.hs-t b, .hge-sheet .lx-t b{ font-size:14px; font-weight:600; } .hs-t small, .hge-sheet .lx-t small{ font-size:12px; opacity:.66; font-style:normal; }
.hs-p{ width:32px; height:32px; background:var(--ui-sec2); color:inherit; } .hs-del{ width:32px; height:32px; background:var(--ui-sec); } .hs-del:hover{ background:var(--ui-sec2); }
.hs-add{ box-shadow:inset 0 0 0 1.5px color-mix(in srgb, currentColor 18%, transparent); background:transparent; border-style:dashed; } .hs-add .hs-i{ background:var(--hg-accent); color:var(--hg-on-accent); }
/* Wygląd: sekcje, widoki, integracje */
.hge-sheet .lk-g{ border-radius:var(--ui-rs); padding:16px; gap:12px; background:color-mix(in srgb, currentColor 5%, transparent); box-shadow:var(--ui-rim); }
.hge-sheet .lk-g h4{ font-size:15px; font-weight:600; } .hge-sheet .lk-hn{ font-size:12px; opacity:.66; }
.hge-sheet .lx-l{ gap:8px; } .hge-sheet .lx-r{ padding:8px 12px 8px 8px; } .hge-sheet .lx-r.na{ opacity:.72; } .hge-sheet .lx-r.na .lx-t small{ font-style:normal; }
.hge-sheet .lx-r.on:not(.na) > .lx-i{ background:color-mix(in srgb, var(--hg-accent) 18%, transparent); }
.hge-sheet .lx-a{ width:36px; height:36px; } .hge-sheet .lx-a:not(:disabled):hover{ background:var(--ui-sec); }
.hge-sheet .lx-sw{ background:var(--ui-sec2); box-shadow:var(--ui-rim); backdrop-filter:none; } .hge-sheet .lx-sw[aria-checked=true]{ background:var(--hg-accent); box-shadow:none; }
.hge-sheet .lx-hb{ margin:0 0 4px 56px; justify-content:flex-start; gap:8px; } .hge-sheet .lx-hb .lx-hbtn.ok{ background:var(--ui-sec); box-shadow:var(--ui-rim); color:inherit; font-weight:500; } .hge-sheet .lx-hb .lx-hbtn.ok ha-icon{ color:var(--hg-accent-tx, var(--hg-accent)); }
.hge-sheet .lx-hb ~ .lx-hb .lx-hl{ display:none; } .hge-sheet .lx-hl{ font-size:12px; opacity:.7; margin-left:4px; }
.hge-sheet .lx-ok{ width:28px; height:28px; } .hge-sheet .lx-new{ margin-top:4px; }
/* formularz własnego widoku */
.hge-sheet .lcv{ border-radius:var(--ui-r4); padding:16px; gap:16px; background:color-mix(in srgb, currentColor 5%, transparent); box-shadow:var(--ui-rim); }
.hge-sheet .lcv-h{ font-size:15px; font-weight:600; } .hge-sheet .lcv-f{ gap:8px; } .hge-sheet .lcv-f > span{ padding-right:18px; }
.hge-sheet .lcv input, .hge-sheet .lcv select{ height:44px; padding:0 18px; border-radius:999px; background:var(--ui-sec); box-shadow:var(--ui-rim); font-size:15px; }
.hge-sheet .lcv input:focus, .hge-sheet .lcv select:focus{ box-shadow:var(--ui-sel); } .hge-sheet .lcv input:disabled{ opacity:.6; }
.hge-sheet .lcv-p{ gap:4px; padding-left:18px; } .hge-sheet .lcv-ic{ gap:8px; } .hge-sheet .lcv-ic button{ width:40px; height:40px; border-radius:var(--ui-r2); background:var(--ui-sec); }
.hge-sheet .lcv-ic button[aria-pressed=true], .hge-sheet .lcv-l button[aria-pressed=true]{ box-shadow:var(--ui-sel); background:color-mix(in srgb, var(--hg-accent) 12%, transparent); color:inherit; }
.hge-sheet .lcv-l button{ border-radius:var(--ui-r3); padding:12px; background:var(--ui-sec); } .hge-sheet .lcv-l button b{ font-size:14px; font-weight:600; } .hge-sheet .lcv-l button ha-icon{ color:var(--hg-accent-tx, var(--hg-accent)); }
.hge-sheet .lcv-r{ gap:8px; } .hge-sheet .lcv-n{ gap:8px; } .hge-sheet .lcv-n > span{ padding-left:18px; }
.hge-sheet .lcv-e{ color:inherit; font-weight:500; padding-left:18px; } .hge-sheet .lcv-del{ color:inherit; } .hge-sheet .lcv-a{ gap:8px; }
/* galeria komponentów */
.hge-sheet .cg{ gap:12px; } .hge-sheet .cg button{ border-radius:20px; padding:8px; gap:8px; background:var(--ui-sec); box-shadow:var(--ui-rim); } .hge-sheet .cg .th{ border-radius:var(--ui-r2); }
.hge-sheet .cg button:hover:not(.na){ box-shadow:var(--ui-sel); transform:none; } .hge-sheet .cg b{ padding:0 4px; } .hge-sheet .cg small{ padding:0 4px 4px; }
/* stany: fokus, ruch, nacisk */
.hge-sheet :is(button, a, input, select, [role=button]):focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.hge-sheet :is(button, .hs-r, .hs-s, .hge-sheet .lx-sw, .hge-sheet .lx-sw i){ transition:background-color var(--ui-t), box-shadow var(--ui-t), transform var(--ui-t), opacity var(--ui-t), color var(--ui-t); }
.hge-sheet button:active:not(:disabled){ transform:scale(.96); } .hge-sheet .lx-sw:active i{ transform:scale(.96); } .hge-sheet .lx-sw[aria-checked=true]:active i{ transform:translateX(18px) scale(.96); }
/* jeden pierścień fokusu: pole w pigułce (.hs-s) i pola formularza widoku rysują go same, wewnętrzny input bez obrysu */
.hge-sheet .hs-s input, .hge-sheet .hs-s input:focus, .hge-sheet .hs-s input:focus-visible, .hge-sheet .hs-in:focus-visible, .hge-sheet .lcv :is(input, select):focus-visible{ outline:none !important; }
.hge-sheet .hs-s:focus-within{ box-shadow:inset 0 0 0 1.5px var(--hg-accent); }
.hge-sheet input[type=color]:focus-visible{ outline:none !important; } .hge-sheet :has(> input[type=color]:focus-visible){ outline:2px solid var(--hg-accent); outline-offset:2px; }
@media (prefers-reduced-motion:reduce){ .hge-sheet *{ transition:none !important; } .hge-sheet button:active{ transform:none !important; } }
`);
  }
}
hgReg('hg-page', HGPage, hgTLazy('page.picker_name'), hgTLazy('page.picker_description'));
console.info(`%c HOME-GLASS %c ${HG_VER} `, 'background:var(--hg-accent);color:#1F2125;font-weight:600', 'background:#1F2125;color:#fff');
