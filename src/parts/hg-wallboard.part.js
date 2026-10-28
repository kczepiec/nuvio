/* ===== Wygaszacz „Tablica” (2.0): data i godzina, wschód/zachód słońca, odliczanie do wydarzenia, pogoda z prognozą godzinową, najbliższe wydarzenia,
   teraz gra, zdjęcie i temperatury w pokojach. Ustawienia w HGL.data.wall: style 'photo' | 'board', bt (motyw auto/light/dark), hd (nagłówek: dzień / godzina),
   bk { sun, cnt, wx, cal, np, tmp, hum } (włączone elementy), ord (kolejność kart), wxE (encja pogody), calX / roomX (wykluczone kalendarze i pokoje).
   Kolory przez K() (interpolacja): tokenizer motywu ich nie zmienia, motyw tablicy wybiera się w ustawieniach. */
/* widżety w rzędzie pod zegarem, w kolejności z ord (✕ w ustawieniach chowa widżet: bk[k] = false) */
const HG_WB_CARDS = [['wx', hgTLazy('wallboard.widgets.wx'), 'mdi:weather-partly-cloudy'], ['sun', hgTLazy('wallboard.widgets.sun'), 'mdi:weather-sunset'],
  ['cnt', hgTLazy('wallboard.widgets.cnt'), 'mdi:calendar-star'], ['cal', hgTLazy('wallboard.widgets.cal'), 'mdi:calendar-blank-outline'],
  ['tmp', hgTLazy('wallboard.widgets.tmp'), 'mdi:thermometer']];
/* ikony pogody jak na iPhonie: białe symbole zamiast kolorowych obrazków */
const HG_WB_WXI = { 'clear-night': 'weather-night', cloudy: 'weather-cloudy', exceptional: 'alert-circle-outline', fog: 'weather-fog', hail: 'weather-hail', lightning: 'weather-lightning',
  'lightning-rainy': 'weather-lightning-rainy', partlycloudy: 'weather-partly-cloudy', pouring: 'weather-pouring', rainy: 'weather-rainy', snowy: 'weather-snowy', 'snowy-rainy': 'weather-snowy-rainy',
  sunny: 'weather-sunny', windy: 'weather-windy', 'windy-variant': 'weather-windy-variant' };
const HG_WB_BK = ['wx', 'sun', 'cnt', 'cal', 'np', 'tmp', 'hum'];
const HG_WB_SS = `
/* tablica jak ekran blokady iPhone'a: cienki duży zegar na środku u góry, pod nim rząd małych widżetów na zdjęciu, u dołu odtwarzacz i powiadomienia */
.nwb{ --nb-glass:${K(250,251,253,.78)}; --nb-tx:${K(22,24,28,1)}; --nb-tx2:${K(22,24,28,.58)}; --nb-edge:inset 0 1px 0 ${K(255,255,255,.7)}, inset 0 0 0 1px ${K(255,255,255,.3)};
  --nb-wg:${K(255,255,255,.2)}; --wh:clamp(56px, 7.6vmin, 72px); --gp:clamp(8px, 1.2vmin, 12px);
  position:absolute; inset:0; box-sizing:border-box; display:flex; flex-direction:column; align-items:center; gap:clamp(12px, 2vmin, 20px);
  padding:calc(clamp(18px, 4vmin, 48px) + env(safe-area-inset-top, 0px)) calc(clamp(16px, 4vmin, 48px) + env(safe-area-inset-right, 0px)) calc(clamp(44px, 6.4vmin, 68px) + env(safe-area-inset-bottom, 0px)) calc(clamp(16px, 4vmin, 48px) + env(safe-area-inset-left, 0px));
  color:${K(255,255,255,1)}; transition:transform 5s cubic-bezier(.4,0,.2,1), opacity .4s ease; transform:translate(var(--nw-x, 0), var(--nw-y, 0)); }
.nwb.dk{ --nb-glass:${K(26,28,34,.58)}; --nb-tx:${K(255,255,255,1)}; --nb-tx2:${K(255,255,255,.6)}; --nb-edge:inset 0 1px 0 ${K(255,255,255,.14)}, inset 0 0 0 1px ${K(255,255,255,.07)}; --nb-wg:${K(255,255,255,.14)}; }
.nw.bd .nw-sh{ background:linear-gradient(180deg, ${K(0,0,0,.42)}, ${K(0,0,0,.08)} 38%, transparent 55%, ${K(0,0,0,.30)}), ${K(4,6,10,'calc(var(--nw-dim, .5) * .45)')}; }
.nw.bd.dk .nw-sh{ background:linear-gradient(180deg, ${K(0,0,0,.42)}, ${K(0,0,0,.08)} 38%, transparent 55%, ${K(0,0,0,.36)}), ${K(4,6,10,'calc(.2 + var(--nw-dim, .5) * .45)')}; }
.nw.bd.dk .nw-bg{ filter:brightness(.82) saturate(.92); }
/* nagłówek */
.nb-top{ display:flex; flex-direction:column; align-items:center; text-align:center; width:100%; min-width:0; text-shadow:0 2px 28px ${K(0,0,0,.28)}; }
.nb-h2{ font-size:clamp(16px, 2.5vmin, 26px); font-weight:600; letter-spacing:-.005em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
.nb-h2::first-letter{ text-transform:uppercase; }
.nb-h1{ margin:0; font-size:clamp(72px, 20vmin, 240px); font-weight:300; line-height:1; letter-spacing:-.04em; font-variant-numeric:tabular-nums; white-space:nowrap; }
.nb-h1.wd{ font-size:clamp(56px, 13vmin, 160px); letter-spacing:-.035em; padding:.04em 0 .02em; } .nb-h1::first-letter{ text-transform:uppercase; }
/* widżety na zdjęciu jak na ekranie blokady iPhone'a: jasny rozmyty prostokąt bez obramowania, biały tekst i białe ikony (najwyżej dwa rzędy) */
.nb-row{ margin-top:clamp(6px, 1.4vmin, 16px); width:100%; display:flex; flex-wrap:wrap; justify-content:center; align-content:flex-start; gap:var(--gp); max-height:calc(var(--wh) * 2 + var(--gp)); overflow:hidden; text-shadow:none; }
.nb-row:empty{ display:none; }
.nb-w{ flex:none; height:var(--wh); max-width:min(340px, 100%); box-sizing:border-box; display:flex; align-items:center; gap:10px; padding:0 18px 0 12px; border-radius:calc(var(--wh) * .32); text-align:left;
  color:${K(255,255,255,1)}; background:var(--nb-wg); -webkit-backdrop-filter:var(--hg-bfo, blur(26px) saturate(150%)); backdrop-filter:var(--hg-bfo, blur(26px) saturate(150%)); box-shadow:none; animation:nwin .8s cubic-bezier(.2,.8,.2,1) both; }
.nb-w > i{ flex:none; width:calc(var(--wh) * .44); height:calc(var(--wh) * .44); display:flex; align-items:center; justify-content:center; color:${K(255,255,255,1)}; }
.nb-w > i ha-icon{ --mdc-icon-size:calc(var(--wh) * .4); width:calc(var(--wh) * .4); height:calc(var(--wh) * .4); }
.nb-w > div{ min-width:0; display:flex; flex-direction:column; gap:1px; }
.nb-w b{ font-size:clamp(15px, 2.1vmin, 20px); font-weight:600; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-variant-numeric:tabular-nums; }
.nb-w small{ font-size:clamp(12px, 1.6vmin, 14px); opacity:.82; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-variant-numeric:tabular-nums; }
.nb-w small em{ font-style:normal; font-weight:700; color:inherit; }
/* pokoje: okrągłe wskaźniki jak widżety ekranu blokady */
.nb-wr{ gap:clamp(10px, 1.6vmin, 16px); padding:0 16px; }
.nb-g{ display:flex; flex-direction:column; align-items:center; gap:3px; width:calc(var(--wh) * 1.05); min-width:0; }
.nb-g span{ position:relative; width:calc(var(--wh) * .6); height:calc(var(--wh) * .6); display:flex; align-items:center; justify-content:center; font-size:calc(var(--wh) * .2); font-weight:600; font-variant-numeric:tabular-nums; letter-spacing:-.02em; }
.nb-g span::before{ content:''; position:absolute; inset:0; border-radius:50%; background:conic-gradient(${K(255,255,255,1)} calc(var(--p) * 1%), ${K(255,255,255,.28)} 0);
  -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3.5px)); mask:radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3.5px)); }
.nb-g small{ max-width:100%; font-size:calc(var(--wh) * .17); opacity:.8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nb-g span{ flex-direction:column; line-height:1; } .nb-g span u{ text-decoration:none; font-size:calc(var(--wh) * .12); font-weight:500; opacity:.75; margin-top:1px; }
/* dół: powiadomienia i odtwarzacz */
.nb-bot{ margin-top:auto; width:min(440px, 100%); display:flex; flex-direction:column; gap:10px; }
.nb-np{ display:flex; align-items:center; gap:12px; padding:12px; border-radius:24px; color:${K(255,255,255,1)}; background:var(--nb-wg); -webkit-backdrop-filter:var(--hg-bfo, blur(26px) saturate(150%)); backdrop-filter:var(--hg-bfo, blur(26px) saturate(150%)); box-shadow:none; animation:nwin .8s cubic-bezier(.2,.8,.2,1) both; }
.nb-np > i, .nb-np .ph{ flex:none; width:56px; height:56px; border-radius:12px; background:center/cover no-repeat ${K(255,255,255,.16)}; }
.nb-np .ph{ display:flex; align-items:center; justify-content:center; color:${K(255,255,255,1)}; } .nb-np .ph ha-icon{ --mdc-icon-size:26px; width:26px; height:26px; }
.nb-np > div{ flex:1; min-width:0; }
.nb-np small{ display:flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; opacity:.75; } .nb-np small ha-icon{ display:none; }
.nb-np b{ display:block; margin-top:2px; font-size:15px; font-weight:600; white-space:nowrap; overflow:hidden; }
.nb-np span.s{ display:block; font-size:13px; opacity:.75; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nb-np .eq{ display:inline-flex; align-items:flex-end; gap:2px; height:10px; } .nb-np .eq u{ width:3px; height:100%; background:currentColor; border-radius:1px; animation:var(--hg-loop, nbeq 1s ease-in-out infinite alternate); transform-origin:bottom; }
.nb-np .eq u:nth-child(2){ animation-delay:-.4s; } .nb-np .eq u:nth-child(3){ animation-delay:-.7s; }
/* tytuł za długi na kartę przewija się w kółko (marquee), krótki stoi */
.nb-np .mq > span{ display:inline-flex; } .nb-np .mq i{ font-style:normal; white-space:nowrap; }
.nb-np .mq.run{ -webkit-mask:linear-gradient(90deg, transparent, #000 12px, #000 calc(100% - 16px), transparent); mask:linear-gradient(90deg, transparent, #000 12px, #000 calc(100% - 16px), transparent); }
.nb-np .mq.run i{ padding:0 48px 0 12px; } .nb-np .mq.run > span{ margin-left:-12px; animation:var(--hg-loop, nbmq var(--d, 12s) linear 1.5s infinite); }
@keyframes nbmq{ to{ transform:translateX(-50%); } }
@keyframes nbeq{ from{ transform:scaleY(.3); } to{ transform:scaleY(1); } }
.nwb .nb-bot > .nb-nt{ width:100%; }
/* dziecko: ta sama karta co odtwarzacz (szkło, promień 24), duże cienkie godziny jak zegar, lista zajęć oddzielona linią */
.nb-kid{ display:flex; flex-direction:column; gap:10px; }
.nb-k{ padding:14px 18px 16px 14px; border-radius:24px; color:${K(255,255,255,1)}; background:var(--nb-wg); -webkit-backdrop-filter:var(--hg-bfo, blur(26px) saturate(150%)); backdrop-filter:var(--hg-bfo, blur(26px) saturate(150%)); animation:nwin .8s cubic-bezier(.2,.8,.2,1) both; }
.nb-kh{ display:flex; align-items:center; gap:12px; min-width:0; }
.nb-kh > i{ flex:none; width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:${K(255,255,255,.16)}; } .nb-kh > i ha-icon{ --mdc-icon-size:24px; width:24px; height:24px; }
.nb-kh > b{ flex:1; min-width:0; font-size:17px; font-weight:600; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nb-kp{ flex:none; display:inline-flex; align-items:center; gap:7px; padding:5px 11px 5px 9px; border-radius:999px; font-size:13px; font-weight:600; background:${K(255,255,255,.16)}; }
.nb-kp i{ width:8px; height:8px; border-radius:50%; background:${K(255,255,255,.6)}; } .nb-kp.on{ background:${K(126,224,168,.26)}; } .nb-kp.on i{ background:${K(126,224,168,1)}; }
.nb-kt{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:14px 0 0 4px; }
.nb-kt div{ display:flex; flex-direction:column; gap:2px; min-width:0; } .nb-kt b{ font-size:clamp(30px, 4.4vmin, 40px); font-weight:300; line-height:1.05; letter-spacing:-.02em; font-variant-numeric:tabular-nums; } .nb-kt b.mu{ opacity:.45; }
.nb-kt small{ font-size:13px; opacity:.72; }
.nb-kl{ list-style:none; margin:14px 0 0 4px; padding:12px 0 0; box-shadow:inset 0 1px 0 ${K(255,255,255,.16)}; display:flex; flex-direction:column; gap:7px; }
.nb-kl li{ display:grid; grid-template-columns:3.2em minmax(0, 1fr) auto; gap:10px; align-items:baseline; font-size:14px; opacity:.75; }
.nb-kl li > span:first-child{ font-variant-numeric:tabular-nums; } .nb-kl li > span:nth-child(2){ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nb-kl li.nx{ font-size:16px; font-weight:600; opacity:1; } .nb-kl li em{ font-style:normal; font-size:13px; font-weight:700; white-space:nowrap; }
.nb-kn{ margin:12px 0 0 4px; font-size:14px; opacity:.72; }
.nw.bd .nw-h{ color:${K(255,255,255,.8)}; bottom:calc(clamp(14px, 2.4vmin, 24px) + env(safe-area-inset-bottom, 0px)); font-size:clamp(12px, 1.5vmin, 14px); }
.nw.bd.pin .nwb{ opacity:0; }
.nwb [hidden]{ display:none !important; }
@media (max-width:640px) and (orientation:portrait){ .nwb{ --wh:60px; } .nb-row{ max-height:calc(var(--wh) * 4 + var(--gp) * 3); } .nb-w{ flex:1 1 calc(50% - var(--gp)); max-width:100%; padding-right:12px; } .nb-w:first-child, .nb-wr{ flex-basis:100%; justify-content:center; } }
@media (prefers-reduced-motion:reduce){ .nwb{ transition:none; } .nb-np .eq u, .nb-np .mq.run > span{ animation:none; } .nb-w, .nb-np, .nb-k{ animation:none; } }
`;
const HG_WB_CSS = `
.wl-chips{ display:flex; flex-wrap:wrap; gap:6px; }
.wl-chips button{ all:unset; box-sizing:border-box; cursor:pointer; display:inline-flex; align-items:center; gap:6px; min-height:36px; padding:0 14px 0 10px; border-radius:999px; font-size:13px; font-weight:600; background:var(--hg-tile-bg); transition:background .2s ease, color .2s ease; }
.wl-chips button ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; opacity:.35; }
.wl-chips button[aria-pressed=true]{ background:var(--hg-accent); color:var(--hg-on-accent); } .wl-chips button[aria-pressed=true] ha-icon{ opacity:1; }
.wl-chips button:focus-visible, .wl-pk button:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
/* lista wybranych pozycji + „Dodaj” z rozwijaną wyszukiwarką (kalendarze, pogoda, pokoje, czujnik, powiadomienia, widżety) */
.wl-pk{ display:flex; flex-direction:column; gap:4px; }
.wl-it{ display:flex; align-items:center; gap:10px; min-height:48px; padding:0 4px 0 12px; border-radius:14px; background:var(--hg-tile-bg); }
.wl-it > ha-icon{ flex:none; --mdc-icon-size:20px; width:20px; height:20px; opacity:.7; }
.wl-it > span, .wl-ol button > span{ flex:1; min-width:0; display:flex; flex-direction:column; }
.wl-it b, .wl-ol b{ font-size:14px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.wl-it small, .wl-ol small{ font-size:12px; opacity:.6; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.wl-it button{ all:unset; box-sizing:border-box; flex:none; cursor:pointer; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.wl-it button:hover{ background:var(--hg-hover-fill, color-mix(in srgb, currentColor 8%, transparent)); } .wl-it button[disabled]{ opacity:.25; pointer-events:none; }
.wl-it button ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; } .wl-it button.x ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; opacity:.7; }
.wl-add{ all:unset; box-sizing:border-box; cursor:pointer; align-self:flex-start; display:inline-flex; align-items:center; gap:6px; min-height:40px; margin-top:4px; padding:0 16px 0 12px; border-radius:999px; font-size:13px; font-weight:600;
  color:var(--hg-accent-tx, var(--hg-accent)); background:color-mix(in srgb, var(--hg-accent) 14%, transparent); }
.wl-add ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; } .wl-add[aria-expanded=true]{ background:var(--hg-accent); color:var(--hg-on-accent); }
.wl-dd{ display:flex; flex-direction:column; gap:6px; margin-top:4px; padding:8px; border-radius:18px; background:var(--hg-tile-bg); box-shadow:inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent); animation:wlpk .18s ease both; }
@keyframes wlpk{ from{ opacity:0; transform:translateY(-4px); } } @media (prefers-reduced-motion:reduce){ .wl-dd{ animation:none; } }
.wl-dd .hs-s{ height:42px; }
.wl-ol{ max-height:264px; overflow:auto; overscroll-behavior:contain; display:flex; flex-direction:column; gap:2px; }
.wl-ol button{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:10px; min-height:44px; padding:4px 10px; border-radius:12px; }
.wl-ol button:hover, .wl-ol button:focus-visible{ background:var(--hg-hover-fill, color-mix(in srgb, currentColor 8%, transparent)); outline:none; }
.wl-ol button > ha-icon{ flex:none; --mdc-icon-size:20px; width:20px; height:20px; opacity:.7; } .wl-ol button[hidden], .wl-ol .no[hidden]{ display:none; }
.wl-ol .no{ padding:10px; font-size:13px; opacity:.6; }
`;
Object.assign(HGWall, {
  /* ---- ustawienia tablicy ---- */
  bget(raw) { const w = (window.__hgL && window.__hgL.data && window.__hgL.data.wall) || {}, bk0 = w.bk && typeof w.bk === 'object' ? w.bk : {}, ids = HG_WB_CARDS.map((x) => x[0]);
    const bk = {}; for (const k of HG_WB_BK) bk[k] = bk0[k] !== false;
    const ord = [...new Set(Array.isArray(w.ord) ? w.ord.filter((k) => ids.includes(k)) : [])]; ord.unshift(...ids.filter((k) => !ord.includes(k)));   /* starsza kolejność (cal, np, tmp): brakujące widżety na początek */
    const L = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && /^[a-z0-9_.]+$/.test(x)) : []);
    const st = this.styleNow(raw);
    return { style: st === 'board' || st === 'glass' || (this.XS && this.XS.some((x) => x[0] === st)) ? st : 'photo', bt: ['auto', 'light', 'dark'].includes(w.bt) ? w.bt : 'auto', hd: w.hd === 'day' ? 'day' : 'time', bk, ord: [...new Set(ord)],
      wxE: typeof w.wxE === 'string' && /^weather\.[a-z0-9_]+$/.test(w.wxE) ? w.wxE : '', calX: L(w.calX), roomX: L(w.roomX) }; },
  board(raw) { return this.bget(raw).style === 'board'; },
  /* ---- nakładka ---- */
  bdShell() { return `<style>${HG_WALL_SS}${HG_WB_SS}</style><div class="nw-bg" aria-hidden="true"></div><div class="nw-bg" aria-hidden="true"></div><div class="nw-sh" aria-hidden="true"></div>
      <div class="nwb"><header class="nb-top"><div class="nb-h2"></div><h1 class="nb-h1"></h1><div class="nb-row"></div></header><div class="nb-bot"><section class="nb-kid" hidden></section><section class="nb-np" hidden></section></div></div>
      <p class="nw-h">${H.esc(hgT('common.touch_to_wake'))}</p>`; },
  bdStart(rm) { const el = this.el; el.classList.add('bd'); this._bdk = {};
    const b = el.querySelector('.nwb'), mv = () => { const v = Math.min(innerWidth, innerHeight) * 0.008; b.style.setProperty('--nw-x', ((Math.random() * 2 - 1) * v).toFixed(0) + 'px'); b.style.setProperty('--nw-y', ((Math.random() * 2 - 1) * v).toFixed(0) + 'px'); };
    this.photos(rm);   /* tło: zdjęcie dashboardu / pokaz slajdów jak w klasycznym wygaszaczu (interwał w _sl) */
    if (!rm) { mv(); this._dr = setInterval(mv, 60000); }
    this.bd(true); },
  _put(sel, html, hide) { const n = this.el && this.el.querySelector(sel); if (!n) return null; if (hide) { n.hidden = true; return n; } n.hidden = false; if (this._bdk[sel] !== html) { this._bdk[sel] = html; n.innerHTML = html; } return n; },
  tf() { const l = this.hass && this.hass.locale ? this.hass.locale.time_format : null; return new Intl.DateTimeFormat(HG_LOC(), Object.assign({ hour: '2-digit', minute: '2-digit' }, l === '12' ? { hour12: true } : l === '24' ? { hour12: false } : {})); },
  dark(B) { return B.bt === 'auto' ? document.documentElement.getAttribute('data-hg-scheme') === 'dark' : B.bt === 'dark'; },
  /* odświeżenie całej tablicy (zegar co minutę, stany HA najwyżej co 2 s); każdy blok przerysowany tylko po zmianie treści */
  bd(force) { const el = this.el, h = this.hass; if (!el || !h || !el.classList.contains('bd')) return;
    const now = Date.now(); if (!force && now - (this._bdt || 0) < 2000) { clearTimeout(this._bdq); this._bdq = setTimeout(() => this.bd(true), 2000 - (now - this._bdt)); return; } this._bdt = now;
    const B = this.bget(), c = this.get(), d = new Date(), tf = this.tf(), b = el.querySelector('.nwb');
    const dk = this.dark(B); b.classList.toggle('dk', dk); el.classList.toggle('dk', dk); el.style.setProperty('--nw-dim', c.dim);
    const wd = new Intl.DateTimeFormat(HG_LOC(), { weekday: 'long' }).format(d), dt = new Intl.DateTimeFormat(HG_LOC(), { day: 'numeric', month: 'long' }).format(d), tm = tf.format(d);
    const h1 = this._put('.nb-h1', H.esc(B.hd === 'time' ? tm : wd)); if (h1) h1.classList.toggle('wd', B.hd !== 'time');
    this._put('.nb-h2', H.esc(B.hd === 'time' ? `${wd}, ${dt}` : `${dt} · ${tm}`));
    const KD = this.kidList ? this.kidList(h) : []; this.bdCal(h, B);
    const KH = KD.map((k) => this.bdKid(h, k)).join(''); this._put('.nb-kid', KH, !KH);
    const W = []; for (const k of B.ord) if (B.bk[k]) { if (k === 'wx') W.push(this.bdWx(h, B)); else if (k === 'sun') W.push(this.bdSun(h, tf)); else if (k === 'cnt') W.push(this.bdCnt());
      else if (k === 'cal') W.push(...this.bdEv(h, B, tf)); else if (k === 'tmp') W.push(this.bdTmp(h, B)); }
    this._put('.nb-row', W.filter(Boolean).join(''));
    const np = B.bk.np ? this.bdNp(h) : '', pn = this._put('.nb-np', np, !np); if (np && pn) this.bdMq(pn); },
  /* marquee: druga kopia tytułu tylko wtedy, gdy się nie mieści; tempo ok. 40 px/s */
  bdMq(pn) { const b = pn.querySelector('.mq'), sp = b && b.firstElementChild; if (!sp || b.classList.contains('run')) return;
    requestAnimationFrame(() => { if (!b.isConnected || sp.scrollWidth <= b.clientWidth + 1) return; const i = sp.firstElementChild, c = i.cloneNode(true); c.setAttribute('aria-hidden', 'true'); sp.appendChild(c);
      b.classList.add('run'); b.style.setProperty('--d', Math.max(6, Math.round(i.offsetWidth / 40)) + 's'); }); },
  /* dziecko (LiveKid): karta nad odtwarzaczem w tym samym szkle; stan, duże godziny, najbliższe zajęcia ze „za X min” i dwa kolejne */
  bdKid(h, k) { const v = this.kidView(h, k), L = v.next ? [Object.assign({ nx: 1 }, v.next), ...v.rest] : [];
    const tm = (l, x) => `<div><b class="${x ? '' : 'mu'}">${H.esc(x || '--:--')}</b><small>${H.esc(l)}</small></div>`;
    return `<article class="nb-k"><header class="nb-kh"><i>${H.icon('mdi:human-child')}</i><b>${H.esc(v.name)}</b>${this.kidPill(v, 'nb-kp')}</header>
      <div class="nb-kt">${tm(hgT('common.check_in'), v.inT)}${tm(hgT('common.check_out'), v.outT)}</div>
      ${L.length ? `<ul class="nb-kl">${L.map((x) => `<li${x.nx ? ' class="nx"' : ''}><span>${H.esc(x.t)}</span><span>${H.esc(x.title)}</span>${x.nx && x.rel ? `<em>${H.esc(x.rel)}</em>` : '<span></span>'}</li>`).join('')}</ul>` : `<p class="nb-kn">${H.esc(v.note)}</p>`}</article>`; },
  /* mały widżet: biała ikona + dwie linie */
  bdW(ic, t, sub, cls) { return `<div class="nb-w${cls ? ' ' + cls : ''}"><i>${H.icon(ic)}</i><div><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}</div></div>`; },
  bdSun(h, tf) { const sun = h.states['sun.sun']; if (!sun) return ''; const r = new Date(sun.attributes.next_rising), s = new Date(sun.attributes.next_setting);
    if (!isNaN(r) && (isNaN(s) || r < s)) return this.bdW('mdi:weather-sunset-up', H.esc(tf.format(r)), H.esc(hgT('wallboard.sunrise')));
    return isNaN(s) ? '' : this.bdW('mdi:weather-sunset-down', H.esc(tf.format(s)), H.esc(hgT('wallboard.sunset'))); },
  bdCnt() { if (!this._bev) return ''; const d0 = new Date(); d0.setHours(0, 0, 0, 0); const ev = this._bev.find((e) => e.ad && e.s > d0); if (!ev) return '';
    const n = Math.round((ev.s - d0) / 864e5); return this.bdW('mdi:calendar-star', H.esc(ev.t || hgT('wallboard.event')), H.esc(n === 1 ? hgT('wallboard.tomorrow') : hgT('wallboard.in_days', { count: n }))); },
  wxId(h, B) { if (B.wxE && H.ok(h.states[B.wxE])) return B.wxE; return Object.keys(h.states).find((e) => e.startsWith('weather.') && H.ok(h.states[e])) || ''; },
  bdWx(h, B) { const id = this.wxId(h, B); if (!id || typeof HGWx === 'undefined') return ''; const w = h.states[id], A = w.attributes;
    const u = A.temperature_unit || '°C', deg = (v) => (isFinite(v) ? H.esc(H.fmt(v, 0)) + (u.startsWith('°') ? '°' : ' ' + H.esc(u)) : '–'), sun = h.states['sun.sun'], night = !!sun && sun.state === 'below_horizon';
    const ic = 'mdi:' + (night && w.state === 'sunny' ? 'weather-night' : night && w.state === 'partlycloudy' ? 'weather-night-partly-cloudy' : HG_WB_WXI[w.state] || 'weather-partly-cloudy');
    this.fc(h, id); const F = this._fc && this._fc.id === id ? this._fc : null, D = F && F.daily && F.daily[0], hi = D ? parseFloat(D.temperature) : NaN, lo = D ? parseFloat(D.templow) : NaN;
    const hr = F && F.hourly ? F.hourly.filter((x) => new Date(x.datetime) > Date.now() - 3600000) : [], pp = hr.length && hr[0].precipitation_probability != null ? Number(hr[0].precipitation_probability) : D && D.precipitation_probability != null ? Number(D.precipitation_probability) : null;
    const sub = [isFinite(hi) ? `↑${deg(hi)}${isFinite(lo) ? ` ↓${deg(lo)}` : ''}` : '', pp ? hgT('wallboard.rain', { percent: pp }) : ''].filter(Boolean).join(' · ');
    return this.bdW(ic, `${deg(parseFloat(A.temperature))} ${H.esc(HGWx.cn(w.state))}`, sub); },
  /* wydarzenia na 60 dni (lista: 14 dni, odliczanie: najbliższe całodniowe), co 10 min */
  bdCal(h, B) { const kx = this._kidCal || [], ids = Object.keys(h.states).filter((e) => e.startsWith('calendar.') && !B.calX.includes(e) && !kx.includes(e)); if (!ids.length || !h.callApi) { this._bev = null; return; }
    const d0 = new Date(); d0.setHours(0, 0, 0, 0); const d1 = new Date(d0); d1.setDate(d1.getDate() + 60); const key = d0.toDateString() + ids.join();
    if (this._bevk === key && Date.now() - this._bevt < 600000) return; this._bevk = key; this._bevt = Date.now();
    const q = `?start=${encodeURIComponent(d0.toISOString())}&end=${encodeURIComponent(d1.toISOString())}`;
    Promise.all(ids.map((id) => h.callApi('GET', `calendars/${id}${q}`).catch(() => []))).then((rs) => {
      const L = []; for (const [ci, r] of rs.entries()) for (const e of (Array.isArray(r) ? r : [])) { const ad = !!(e.start && e.start.date && !e.start.dateTime), s = ad ? new Date(e.start.date + 'T00:00:00') : new Date(e.start && e.start.dateTime), en = ad ? new Date((e.end && e.end.date || e.start.date) + 'T00:00:00') : new Date(e.end && e.end.dateTime || s);
        if (isNaN(s)) continue; L.push({ ad, s, en, c: ci, t: e.summary ? String(e.summary) : null, loc: String(e.location || '').split(',')[0] }); }
      this._bev = L.sort((a, b) => (a.s - b.s) || (b.ad - a.ad)); if (this.el) this.bd(true); }); },
  /* najbliższe wydarzenia: trwające albo kolejne (najwyżej dwa widżety) */
  bdEv(h, B, tf) { if (!this._bev) return [];
    const now = new Date(), d0 = new Date(now); d0.setHours(0, 0, 0, 0); const lim = new Date(d0); lim.setDate(lim.getDate() + 14);
    const E = this._bev.filter((e) => !e.ad && e.en > now && e.s < lim).slice(0, 2);
    const day = (s) => { const n = Math.round((new Date(s).setHours(0, 0, 0, 0) - d0) / 864e5); return n <= 0 ? hgT('common.today') : n === 1 ? hgT('wallboard.tomorrow_cap') : new Intl.DateTimeFormat(HG_LOC(), { weekday: 'short', day: 'numeric', month: 'short' }).format(s); };
    const rel = (e) => { const m = Math.round((e.s - now) / 60000); return m < 60 ? hgT('wallboard.in_min', { minutes: m }) : m < 600 ? hgT('wallboard.in_hours_minutes', { hours: Math.floor(m / 60), minutes: m % 60 }) : ''; };
    return E.map((e) => { const live = e.s <= now, r = live ? '' : rel(e);
      const sub = live ? `<em>${H.esc(hgT('common.now_cap'))}</em> · ${H.esc(hgT('wallboard.until_time', { time: tf.format(e.en) }))}` : `${H.esc(day(e.s) + ' ' + tf.format(e.s))}${r ? ` · <em>${H.esc(r)}</em>` : ''}`;
      return this.bdW('mdi:calendar-blank', H.esc(e.t || hgT('wallboard.event')), sub); }); },
  bdNp(h) { const L = Object.keys(h.states).filter((e) => e.startsWith('media_player.') && hgMpActive(h.states[e]) && (h.states[e].attributes.media_title || h.states[e].attributes.media_channel));
    const id = L.find((e) => h.states[e].state === 'playing') || L[0]; if (!id) return ''; const s = h.states[id], A = s.attributes, pl = s.state === 'playing';
    const sub = [A.media_artist || A.media_series_title || A.app_name, H.name(h, id, id)].filter(Boolean).join(' · '), pic = A.entity_picture ? String(A.entity_picture).replace(/["\\()]/g, '') : '';
    return `${pic ? `<i style="background-image:url(&quot;${H.esc(pic)}&quot;)"></i>` : `<span class="ph">${H.icon('mdi:music-note')}</span>`}<div><small>${H.esc(pl ? hgT('wallboard.now_playing') : hgT('wallboard.paused'))}${pl ? '<span class="eq"><u></u><u></u><u></u></span>' : ''}</small><b class="mq"><span><i>${H.esc(A.media_title || A.media_channel)}</i></span></b>${sub ? `<span class="s">${H.esc(sub)}</span>` : ''}</div>`; },
  /* temperatury w pokojach jako okrągłe wskaźniki (10–30 °C na pełnym okręgu) */
  bdTmp(h, B) { if (typeof HGAreas === 'undefined') return ''; let R = []; try { R = HGAreas.model(h).rooms.filter((a) => a.temp && !B.roomX.includes(a.id)); } catch (e) { return ''; }
    const L = R.map((a) => ({ a, v: HGAreas.env(h, a) })).filter((x) => x.v.t != null).slice(0, innerWidth < 640 ? 4 : 5); if (!L.length) return '';
    return `<div class="nb-w nb-wr">${L.map(({ a, v }) => { const p = Math.max(4, Math.min(100, Math.round((v.t - 10) * 5)));
      return `<div class="nb-g" style="--p:${p}" title="${H.esc(a.name)}"><span>${H.esc(H.fmt(v.t, 0))}°${B.bk.hum && v.u != null ? `<u>${H.esc(H.pct(H.fmt(v.u, 0)))}</u>` : ''}</span><small>${H.esc(a.name)}</small></div>`; }).join('')}</div>`; },
  /* ---- UI ustawień ---- */
  /* lista wybranych + „Dodaj”: sel/opt = [{ k, l, s, ic, x }]; x = dodatkowe przyciski w wierszu; o.one = jedna wartość (przycisk „Zmień”), o.fix = wiersz bez ✕ */
  pk(id, sel, opt, o) { o = o || {}; const open = this._dd === id && opt.length, v = (k) => H.esc(id + '|' + k);
    (this._pko || (this._pko = {}))[id] = { opt, o };   /* dane listy do otwarcia w miejscu (bez przerysowania arkusza) */
    const row = (x) => `<div class="wl-it">${H.icon(x.ic || o.ic || 'mdi:circle-small')}<span><b>${H.esc(x.l)}</b>${x.s ? `<small>${H.esc(x.s)}</small>` : ''}</span>${x.x || ''}${x.fix ? '' : `<button type="button" class="x" data-hge="wl-pk-rm" data-v="${v(x.k)}" aria-label="${H.esc(hgT('wallboard.remove_name', { name: x.l }))}">${H.icon('mdi:close')}</button>`}</div>`;
    return `<div class="wl-pk" data-pk="${H.esc(id)}">${sel.map(row).join('')}${opt.length ? `<button type="button" class="wl-add" data-hge="wl-pk-open" data-v="${H.esc(id)}" aria-expanded="${!!open}">${H.icon(o.one ? 'mdi:swap-horizontal' : 'mdi:plus')}${H.esc(o.add || (o.one ? hgT('common.change') : hgT('common.add')))}</button>` : ''}${open ? this.pkDd(id) : ''}</div>`; },
  /* rozwinięta lista: rysowane najwyżej PK_MAX pasujących pozycji (przy tysiącach encji lista otwiera się od razu), reszta przez wyszukiwanie */
  PK_MAX: 60,
  pkRows(id, t) { const st = (this._pko || {})[id]; if (!st) return ''; const { opt, o } = st, w = (t || '').trim().toLowerCase().split(/\s+/).filter(Boolean), v = (k) => H.esc(id + '|' + k);
    const hit = []; for (const x of opt) { const q = x._q || (x._q = (x.l + ' ' + (x.s || '') + ' ' + x.k).toLowerCase()); if (!w.length || w.every((y) => q.includes(y))) { hit.push(x); if (hit.length > this.PK_MAX) break; } }
    const more = hit.length > this.PK_MAX; if (more) hit.length = this.PK_MAX;
    return hit.map((x) => `<button type="button" role="option" data-hge="wl-pk-add" data-v="${v(x.k)}">${H.icon(x.ic || o.ic || 'mdi:plus')}<span><b>${H.esc(x.l)}</b>${x.s ? `<small>${H.esc(x.s)}</small>` : ''}</span></button>`).join('')
      + (hit.length ? '' : `<div class="no">${hgT('wallboard.no_matches')}</div>`) + (more ? `<div class="no">${hgT('wallboard.type_more_to_narrow')}</div>` : ''); },
  pkDd(id) { const st = (this._pko || {})[id], n = st ? st.opt.length : 0;
    return `<div class="wl-dd">${n > 1 ? `<label class="hs-s">${H.icon('mdi:magnify')}<input type="search" data-pk-q="${H.esc(id)}" placeholder="${hgT('wallboard.search')}" aria-label="${hgT('common.search')}" autocomplete="off"></label>` : ''}<div class="wl-ol" role="listbox">${this.pkRows(id, '')}</div></div>`; },
  /* otwarcie i zamknięcie listy w miejscu: bez p._eLook(), więc podglądy wygaszacza i reszta arkusza się nie przerysowują */
  pkToggle(p, id) { const S = p._eSheetEl, el = S && [...S.querySelectorAll('.wl-pk')].find((x) => x.dataset.pk === id); if (!el || !(this._pko || {})[id]) return false;
    const was = this._dd === id; for (const d of S.querySelectorAll('.wl-pk > .wl-dd')) d.remove(); for (const b of S.querySelectorAll('[data-hge="wl-pk-open"]')) b.setAttribute('aria-expanded', 'false');
    this._dd = was ? '' : id; if (was) return true;
    el.insertAdjacentHTML('beforeend', this.pkDd(id)); const b = el.querySelector('[data-hge="wl-pk-open"]'); if (b) b.setAttribute('aria-expanded', 'true'); this.pkWire(p, el); return true; },
  /* wyszukiwarka w rozwiniętej liście (po renderze arkusza albo po otwarciu w miejscu); filtr na danych z opóźnieniem 120 ms */
  pkWire(p, S) { const q = S.querySelector('[data-pk-q]'), dd = S.querySelector('.wl-dd');
    if (dd) setTimeout(() => { try { dd.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* stare przeglądarki */ } if (q && q.isConnected) q.focus({ preventScroll: true }); }, 60);
    if (!q) return; const id = q.dataset.pkQ, ol = dd.querySelector('.wl-ol'); let tm = 0;
    q.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { if (ol.isConnected) ol.innerHTML = this.pkRows(id, q.value); }, 120); });
    q.addEventListener('keydown', (e) => { const f = () => ol.querySelector('[role=option]');
      if (e.key === 'Enter') { e.preventDefault(); clearTimeout(tm); ol.innerHTML = this.pkRows(id, q.value); const x = f(); if (x) x.click(); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.pkToggle(p, id); } else if (e.key === 'ArrowDown') { e.preventDefault(); const x = f(); if (x) x.focus(); } }); },
  /* zmiana z listy: true = obsłużone */
  pkOp(id, op, k) { const B = this.bget(), add = op === 'add', tog = (L) => (add ? L.filter((x) => x !== k) : [...new Set([...L, k])]);
    if (id === 'wid') { const bk = Object.assign({}, B.bk, { [k]: add }); this.set(add ? { bk, ord: [...B.ord.filter((x) => x !== k), k] } : { bk }); }
    else if (id === 'cal') this.set({ calX: tog(B.calX) });
    else if (id === 'room') this.set({ roomX: tog(B.roomX) });
    else if (id === 'wx') { this._fc = null; this.set({ wxE: add ? k : '' }); }
    else if (id === 'sens') { this._ms = undefined; const cur = this.get().sensors; this.set({ sensors: add ? [...new Set([...cur, k])] : cur.filter((x) => x !== k) }); }
    else return false; return true; },
  bdHtml(c, h) { const B = this.bget(true), seg = (a, list, cur) => `<div class="wl-seg" style="--n:${list.length}">${list.map(([k, t]) => `<button type="button" data-hge="${a}" data-v="${k}" aria-pressed="${cur === k}">${t}</button>`).join('')}</div>`;
    const style = `<div class="wl-f" role="group" aria-labelledby="wl-st"><span id="wl-st">${hgT('wallboard.screensavers')}</span>${this.galHtml ? this.galHtml(B.style) : seg('wl-style', [['photo', hgT('wallboard.style_photo')], ['board', hgT('wallboard.style_board')], ['glass', hgT('wallboard.style_glass')]], B.style)}</div>`;
    if (B.style === 'glass' && this.glHtml) return { top: style, board: this.glHtml(c, h) };
    if (B.style !== 'board') return { top: style, board: '' };
    const W = Object.keys(h.states).filter((e) => e.startsWith('weather.')), Cs = Object.keys(h.states).filter((e) => e.startsWith('calendar.')), nm = (e) => H.name(h, e, e);
    let R = []; try { R = HGAreas.model(h).rooms.filter((a) => a.temp); } catch (e) { /* bez pokoi */ }
    const grp = (id, t, body, hint) => `<div class="wl-f" role="group" aria-labelledby="wl-${id}"><span id="wl-${id}">${t}</span>${body}${hint ? `<small>${H.esc(hint)}</small>` : ''}</div>`;
    const chips = (a, list) => `<div class="wl-chips">${list.map(([k, l, on]) => `<button type="button" data-hge="${a}" data-v="${H.esc(k)}" aria-pressed="${on}">${H.icon('mdi:check')}${H.esc(l)}</button>`).join('')}</div>`;
    const cn = Object.fromEntries(HG_WB_CARDS.map(([k, t, ic]) => [k, { l: String(t), ic }])), vis = B.ord.filter((k) => B.bk[k]);
    const mv = (k, i) => `<button type="button" data-hge="wl-up" data-v="${k}" ${i === 0 ? 'disabled' : ''} aria-label="${hgT('wallboard.move_up')}">${H.icon('mdi:chevron-up')}</button><button type="button" data-hge="wl-dn" data-v="${k}" ${i === vis.length - 1 ? 'disabled' : ''} aria-label="${hgT('wallboard.move_down')}">${H.icon('mdi:chevron-down')}</button>`;
    const wid = this.pk('wid', vis.map((k, i) => ({ k, l: cn[k].l, ic: cn[k].ic, x: mv(k, i) })), B.ord.filter((k) => !B.bk[k]).map((k) => ({ k, l: cn[k].l, ic: cn[k].ic })), { add: hgT('common.add_widget') });
    const on = (k) => vis.includes(k), auto = this.wxId(h, Object.assign({}, B, { wxE: '' }));
    const wx = on('wx') && W.length > 1 ? grp('wx', hgT('common.weather'), this.pk('wx', [B.wxE && h.states[B.wxE] ? { k: B.wxE, l: nm(B.wxE), s: B.wxE } : { k: '', l: hgT('common.automatic'), s: auto ? nm(auto) : '', fix: true }],
      W.filter((e) => e !== B.wxE).map((e) => ({ k: e, l: nm(e), s: e })), { one: true, ic: 'mdi:weather-partly-cloudy' })) : '';
    const cal = (on('cal') || on('cnt')) && Cs.length ? grp('cl', hgT('wallboard.calendars'), this.pk('cal', Cs.filter((e) => !B.calX.includes(e)).map((e) => ({ k: e, l: nm(e), s: e })),
      Cs.filter((e) => B.calX.includes(e)).map((e) => ({ k: e, l: nm(e), s: e })), { ic: 'mdi:calendar', add: hgT('wallboard.add_calendar') })) : '';
    const rm = on('tmp') && R.length ? grp('rm', hgT('wallboard.rooms_in_the_temperature'), this.pk('room', R.filter((a) => !B.roomX.includes(a.id)).map((a) => ({ k: a.id, l: a.name, ic: a.icon })),
      R.filter((a) => B.roomX.includes(a.id)).map((a) => ({ k: a.id, l: a.name, ic: a.icon })), { ic: 'mdi:sofa-outline', add: hgT('wallboard.add_room') })) : '';
    const board = `
      <div class="wl-f" role="group" aria-labelledby="wl-bt"><span id="wl-bt">${hgT('wallboard.board_theme')}</span>${seg('wl-bt', [['auto', hgT('wallboard.theme_like_dashboard')], ['light', hgT('wallboard.theme_light')], ['dark', hgT('wallboard.theme_dark')]], B.bt)}</div>
      <div class="wl-f" role="group" aria-labelledby="wl-hd"><span id="wl-hd">${hgT('wallboard.heading')}</span>${seg('wl-hd', [['time', hgT('wallboard.heading_time')], ['day', hgT('wallboard.heading_weekday')]], B.hd)}</div>
      ${grp('wd', hgT('wallboard.widgets_under_the_clock'), wid)}
      ${grp('bk', hgT('wallboard.extras'), chips('wl-bk', [['np', hgT('wallboard.now_playing'), B.bk.np], ['hum', hgT('wallboard.room_humidity'), B.bk.hum]]))}
      ${wx}${cal}${rm}`;
    return { top: style, board }; },
  bdAct(p, b, a) { const B = this.bget(), v = b.dataset.v || '';
    if (a === 'wl-pk-open') { if (!this.pkToggle(p, v)) { this._dd = this._dd === v ? '' : v; p._eLook(); } return true; }
    if (a === 'wl-pk-add' || a === 'wl-pk-rm') { const i = v.indexOf('|'); if (i < 0 || !this.pkOp(v.slice(0, i), a === 'wl-pk-add' ? 'add' : 'rm', v.slice(i + 1))) return false; this._dd = ''; }
    else if (a === 'wl-style') this.set({ style: v });
    else if (a === 'wl-bt') this.set({ bt: v });
    else if (a === 'wl-hd') this.set({ hd: v });
    else if (a === 'wl-bk') this.set({ bk: Object.assign({}, B.bk, { [v]: !B.bk[v] }) });
    else if (a === 'wl-up' || a === 'wl-dn') { const vis = B.ord.filter((k) => B.bk[k]), i = vis.indexOf(v), j = i + (a === 'wl-up' ? -1 : 1); if (i < 0 || j < 0 || j >= vis.length) return true;
      const o = B.ord.slice(), x = o.indexOf(vis[i]), y = o.indexOf(vis[j]); [o[x], o[y]] = [o[y], o[x]]; this.set({ ord: o }); }
    else return false;
    this._bevk = ''; if (this.active && this.el && this.el.classList.contains('bd')) this.bd(true);
    p._eLook(); return true; },
});
