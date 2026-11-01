/* ===== WSPÓLNE STYLE kart Home Glass (szkło, nagłówek karty, przełącznik, animacje ikon) ===== */
const HG_RANGE_CSS = `
/* własny suwak (wszędzie): cienki tor, wypełnienie akcentem do --v, gładki uchwyt z animacją przy najechaniu i przeciąganiu; natywny input = klawiatura i czytniki ekranu działają */
input[type=range]{ -webkit-appearance:none !important; appearance:none !important; background:transparent !important; height:32px !important; margin:0; padding:0; cursor:pointer; touch-action:pan-y; --f:var(--hg-accent, #63D71E); accent-color:var(--f); }
input[type=range]::-webkit-slider-runnable-track{ height:6px !important; border-radius:999px !important; border:0 !important; box-shadow:inset 0 0 0 1px ${'rgb' + 'a(255,255,255,.10)'} !important; background:linear-gradient(90deg, var(--f) 0 var(--v, 50%), color-mix(in srgb, currentColor 16%, transparent) var(--v, 50%) 100%) !important; }
input[type=range]::-moz-range-track{ height:6px; border-radius:999px; border:0; background:color-mix(in srgb, currentColor 16%, transparent); }
input[type=range]::-moz-range-progress{ height:6px; border-radius:999px; background:var(--f); }
input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none !important; appearance:none !important; width:20px !important; height:20px !important; margin-top:-7px !important; border:0 !important; border-radius:50% !important; background:${'#' + 'fff'} !important; box-shadow:0 0 0 4px color-mix(in srgb, var(--f) 0%, transparent), 0 2px 8px rgba(0,0,0,.35) !important; transition:transform .18s cubic-bezier(.2,.8,.2,1.3), box-shadow .18s ease !important; }
input[type=range]::-moz-range-thumb{ width:20px; height:20px; border:0; border-radius:50%; background:${'#' + 'fff'}; box-shadow:0 2px 8px rgba(0,0,0,.35); transition:transform .18s cubic-bezier(.2,.8,.2,1.3), box-shadow .18s ease; }
input[type=range]:hover::-webkit-slider-thumb{ transform:scale(1.12); box-shadow:0 0 0 6px color-mix(in srgb, var(--f) 22%, transparent), 0 2px 10px rgba(0,0,0,.35) !important; }
input[type=range]:active::-webkit-slider-thumb{ transform:scale(1.28); box-shadow:0 0 0 9px color-mix(in srgb, var(--f) 28%, transparent), 0 3px 12px rgba(0,0,0,.4) !important; }
input[type=range]:hover::-moz-range-thumb{ transform:scale(1.12); box-shadow:0 0 0 6px color-mix(in srgb, var(--f) 22%, transparent), 0 2px 10px rgba(0,0,0,.35); }
input[type=range]:active::-moz-range-thumb{ transform:scale(1.28); box-shadow:0 0 0 9px color-mix(in srgb, var(--f) 28%, transparent), 0 3px 12px rgba(0,0,0,.4); }
input[type=range]:focus{ outline:none; } input[type=range]:focus-visible::-webkit-slider-thumb{ box-shadow:0 0 0 3px ${'#' + 'fff'}, 0 0 0 6px var(--f) !important; } input[type=range]:focus-visible::-moz-range-thumb{ box-shadow:0 0 0 3px ${'#' + 'fff'}, 0 0 0 6px var(--f); }
input[type=range]:disabled{ opacity:.45; cursor:default; }
@media (prefers-reduced-motion: reduce){ input[type=range]::-webkit-slider-thumb{ transition:none !important; } input[type=range]::-moz-range-thumb{ transition:none; } }
`;
/* biblioteka pól formularza (ui/form): wiersz z przełącznikiem, pole wielowierszowe, sekcja rozwijana, kolor, liczby bez strzałek przeglądarki.
   Klasy nf-* działają w każdym cieniu, który ładuje HG_BASE (karty, strona, arkusze edytora). */
const HG_FORM_CSS = `
.nf-row{ position:relative; display:flex; align-items:center; gap:12px; min-height:52px; padding:6px 8px 6px 18px; border-radius:999px; box-sizing:border-box; cursor:pointer; isolation:isolate;
  background:var(--hg-glass-lite, var(--hg-glass-bg)); box-shadow:inset 0 0 0 1px rgba(255,255,255,.14), 0 4px 16px rgba(0,0,0,.10); transition:box-shadow .2s, background .2s; -webkit-tap-highlight-color:transparent; }
.nf-row > span{ flex:1; min-width:0; font-size:15px; line-height:1.25; } .nf-row > span small{ display:block; font-size:12px; opacity:.65; margin-top:2px; }
.nf-row:focus-within{ box-shadow:inset 0 0 0 1px transparent, 0 0 0 2px var(--hg-accent), 0 4px 16px rgba(0,0,0,.10); }
.nf-row > ha-icon{ flex:none; width:20px; height:20px; opacity:.8; }
.nf-area{ display:block; width:100%; box-sizing:border-box; min-height:104px; padding:12px 18px; border:0; outline:0; border-radius:22px; resize:vertical; color:inherit; font:inherit; font-size:15px; line-height:1.45;
  background:var(--hg-glass-lite, var(--hg-glass-bg)); box-shadow:inset 0 0 0 1px rgba(255,255,255,.14), 0 4px 16px rgba(0,0,0,.10); transition:box-shadow .2s; }
.nf-area::placeholder{ color:inherit; opacity:.6; } .nf-area:focus{ box-shadow:inset 0 0 0 1px transparent, 0 0 0 2px var(--hg-accent), 0 4px 16px rgba(0,0,0,.10); }
.nf-area.code{ font:13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; tab-size:2; white-space:pre; overflow:auto; }
.nf-area.bad{ box-shadow:inset 0 0 0 1px transparent, 0 0 0 2px var(--hg-warn, #E5484D); }
.nf-err{ font-size:12px; color:var(--hg-warn, #ff7a6b); padding-left:18px; } .nf-err[hidden]{ display:none; }
.nf-hint{ display:block; font-size:12px; opacity:.65; padding:0 18px; line-height:1.4; }
.nf-more{ display:flex; flex-direction:column; gap:10px; border-radius:22px; }
.nf-more > summary{ list-style:none; display:flex; align-items:center; gap:10px; min-height:48px; padding:0 18px 0 12px; border-radius:999px; cursor:pointer; user-select:none; font-size:15px; font-weight:500;
  background:var(--hg-tile-bg); transition:background .2s; -webkit-tap-highlight-color:transparent; }
.nf-more > summary::-webkit-details-marker{ display:none; } .nf-more > summary::marker{ content:''; }
.nf-more > summary:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.nf-more > summary > ha-icon{ flex:none; width:22px; height:22px; transition:transform var(--hg-t-base, 200ms) var(--hg-ease-out, ease-out); }
.nf-more[open] > summary > ha-icon{ transform:rotate(90deg); }
.nf-more > summary small{ margin-left:auto; font-size:12px; font-weight:400; opacity:.6; }
.nf-more[open] > .nf-mb{ animation:nfIn var(--hg-t-base, 200ms) var(--hg-ease-out, ease-out) both; } .nf-mb{ display:flex; flex-direction:column; gap:10px; }
@keyframes nfIn{ from{ opacity:0; transform:translateY(-4px); } }
.nf-color{ -webkit-appearance:none; appearance:none; flex:none; width:36px; height:36px; padding:0; border:0; border-radius:50%; background:none; cursor:pointer; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); }
.nf-color::-webkit-color-swatch-wrapper{ padding:0; } .nf-color::-webkit-color-swatch{ border:0; border-radius:50%; } .nf-color::-moz-color-swatch{ border:0; border-radius:50%; }
input[type=number]{ -moz-appearance:textfield; appearance:textfield; } input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button{ -webkit-appearance:none; margin:0; }
@media (prefers-reduced-motion: reduce){ .nf-more[open] > .nf-mb{ animation:none; } }
`;
window.HG_RANGE_CSS = HG_RANGE_CSS;
/* --v (wypełnienie) dla każdego suwaka, także w shadow DOM */
if (!window.__hgRangeW) { window.__hgRangeW = 1; const upd = (e) => { const t = e.composedPath && e.composedPath()[0]; if (!t || t.type !== 'range') return; const mn = +t.min || 0, mx = t.max === '' ? 100 : +t.max, v = ((+t.value - mn) / ((mx - mn) || 1)) * 100; t.style.setProperty('--v', v + '%'); }; window.addEventListener('input', upd, true); }
const HG_BASE = U(`
:host{ --k: var(--hg-u, 1.3px); --r-lg:var(--hg-radius, 24px); --r-md:var(--hg-radius-in, 16px); --r-sm:12px; --s1:8u; --s2:12u; --s3:16u; --s4:24u; --fs-xs:var(--hg-fs-xs, 8.5u); --fs-sm:var(--hg-fs-sm, 10u); --fs-md:var(--hg-fs-md, 12u); display:block; font-family:'HG DM Sans','DM Sans',-apple-system,system-ui,'Segoe UI',Roboto,sans-serif;
  -webkit-font-smoothing:antialiased; color:var(--hg-card-fg, #1E2023); height:100%; font-weight:400; }
*{ box-sizing:border-box; }
/* rozmiar kafelka S/M/L: treść skaluje się do szerokości kontenera (kafelek, slot panelu) */
@container (max-width: 300px){ :host{ --k: calc(var(--hg-u, 1.3px) * .9); } .hd .tt small, .note{ display:none; } }
@container (max-width: 220px){ :host{ --k: calc(var(--hg-u, 1.3px) * .8); } }
@container (max-width: 160px){ :host{ --k: calc(var(--hg-u, 1.3px) * .7); } }
button{ font:inherit; color:inherit; background:none; border:0; padding:0; margin:0; cursor:pointer; -webkit-tap-highlight-color:transparent; touch-action:manipulation; }
button *, [data-act] ha-icon{ pointer-events:none; }
ha-icon{ display:inline-flex; --mdc-icon-size: 100%; }
/* szkło: jeden wspólny token dla wszystkich kart; stan tylko na ikonach i pigułkach */
ha-card.glass{ position:relative; height:100%; min-height:var(--hg-min-h, 0px); overflow:hidden; border-radius:var(--hg-card-r, var(--hg-radius, 18u));
  /* szkło: przezroczyste wypełnienie + delikatny refleks (135°, biel -> przezroczystość 40%), bez kolorowych gradientów */
  background: var(--hg-glass-sheen, none), var(--hg-card-under, linear-gradient(transparent, transparent)), var(--hg-glass-lite, var(--hg-glass-bg));
  border:0;
  -webkit-backdrop-filter: var(--hg-bfo, var(--hg-card-bf, none)); backdrop-filter: var(--hg-bfo, var(--hg-card-bf, none));
  /* cienka jasna krawędź (mocniejsza u góry) + miękki cień, jak w projekcie */
  box-shadow: var(--hg-edge, 0 0 0 transparent), var(--hg-card-sh, var(--hg-shadow-lg, 0 6px 20px var(--hg-glass-sh)));
  color:var(--hg-card-fg, #1E2023); padding:var(--s2); contain: layout paint style; }
/* .warm: jedno wspólne szkło dla wszystkich kart (bez osobnego odcienia) */
.hd{ display:flex; align-items:center; gap:var(--s1); min-height:20u; position:relative; z-index:2; }
.hd .ic{ width:12u; height:12u; color:currentColor; flex:none; }
.hd .tt{ font-size:var(--fs-md); font-weight:600; letter-spacing:-.005em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hd .tt small{ font-size:var(--fs-xs); font-weight:400; color:var(--hg-t2, #5A5E64); margin-left:4u; }
.hd .sp{ flex:1; }
/* wspólny wiersz listy: min. 44px, odstęp tokenowy, separator 1px między wierszami */
.lr{ display:flex; align-items:center; gap:var(--s2); min-height:max(calc(var(--k) * 34), 44px); padding:var(--s1) 0; }
.lr + .lr{ border-top:1px solid rgba(0,0,0,.06); }
.note{ font-size:var(--fs-xs); color:#8A8E94; white-space:nowrap; }
.ib{ width:30u; height:30u; margin:-5u; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; color:inherit; position:relative; flex:none; transition: background var(--hg-t-base, 200ms) var(--hg-ease-out, ease-out), transform var(--hg-t-fast, 120ms) var(--hg-ease-out, ease-out); }
.ib:active{ transform:scale(.92); }
.ib ha-icon{ width:15u; height:15u; }
/* wspólny hover kafli szklanych: lekkie uniesienie, minimalnie jaśniejsze szkło, mocniejszy miękki cień; tylko mysz (bez „przyklejonego” hovera na dotyku) */
.lift{ transition: transform var(--hg-t-base, 200ms) var(--hg-ease-out, ease), box-shadow var(--hg-t-base, 200ms) var(--hg-ease-out, ease); }
.lift::after{ content:''; position:absolute; inset:0; border-radius:inherit; background:var(--hg-hover-fill); opacity:0; transition:opacity .16s ease; pointer-events:none; }
@media (hover:hover) and (pointer:fine){ .lift:hover{ transform:translateY(-2px); box-shadow: var(--hg-sh-hover); } .lift:hover::after{ opacity:1; } }
.ib:hover{ background:rgba(0,0,0,.05); }
.kebab{ width:24u; } .kebab ha-icon{ width:15u; height:15u; }
/* przełącznik jak w projekcie: pomarańczowy włączony, biało-szary wyłączony */
.tg{ position:relative; width:34u; height:20u; border-radius:999px; flex:none; transition: background .25s ease;
  background:rgba(120,120,128,.24); box-shadow:none; }
.tg i{ position:absolute; top:2u; left:2u; width:16u; height:16u; border-radius:50%; background:#fff;
  box-shadow: 0 1px 3px rgba(0,0,0,.2), 0 0 0 .5px rgba(0,0,0,.04); transition: transform .25s cubic-bezier(.3,.7,.3,1); }
.tg.on{ background:var(--hg-accent); box-shadow:0 0 10px var(--hg-accent-glow); }
.tg.on i{ transform: translateX(14u); }
.tg[disabled]{ opacity:.5; cursor:not-allowed; }
@media (pointer:coarse){ .tg::before{ content:''; position:absolute; inset:-13px -6px; } .ib::before{ content:''; position:absolute; inset:-4px; } }
.ph{ display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:3u; height:calc(100% - 24u); color:#6A6E74; font-size:var(--fs-sm); }
.ph b{ font-size:var(--fs-sm); color:#1E2023; font-weight:400; }
@keyframes hgspin{ to{ transform: rotate(360deg); } }
@keyframes hgpulse{ 0%,100%{ transform:scale(1); opacity:1 } 50%{ transform:scale(1.15); opacity:.75 } }
@keyframes hgflick{ 0%,100%{ transform: scale(1) rotate(0) } 25%{ transform: scale(1.1,.94) rotate(-4deg) } 50%{ transform: scale(.95,1.08) rotate(3deg) } 75%{ transform: scale(1.05,.97) rotate(-2deg) } }
@keyframes hgwave{ 0%,100%{ transform: translateX(0) } 50%{ transform: translateX(2u) } }
@keyframes hgglow{ 0%,100%{ filter: drop-shadow(0 0 0 var(--hg-accent-faint)) } 50%{ filter: drop-shadow(0 0 3u var(--hg-accent)) } }
*, *::before, *::after{ animation-play-state: var(--hg-play, running) !important; }
/* karta poza ekranem (hg-off z IntersectionObserver w hg-core, zapas 300 px): animacje stoją, nie liczą klatek w tle */
:host([hg-off]) *, :host([hg-off]) *::before, :host([hg-off]) *::after{ animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce){ *{ animation:none !important; transition:none !important; } }
`) + HG_RANGE_CSS + HG_FORM_CSS;
