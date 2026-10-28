/* ===== Tryb tabletu ściennego: po bezczynności wygaszacz z zegarem i zdjęciem, przyciemnienie, wybudzanie dotykiem albo czujnikiem ruchu.
   Ustawienia: HGL.data.wall = { on, style ('photo' | 'board': tablica w hg-wallboard.part.js | 'glass': karty w hg-wallglass.part.js), idle (s), dim (0–0.9), src: 'bg' | 'slides' | 'url', url, sensor (binary_sensor), lock, pinH (skrót PIN-u, nie sam PIN), pinN (długość), lockAfter (s), nt (harmonogram nocny: { on, mode 'sun' | 'hours', from, to ('HH:MM'), style, dim }; w nocy inny styl i przyciemnienie, patrz ntGet / styleNow) } – dane użytkownika HA jak „app”,
   zapisywane razem z układem. Domyślnie wyłączone. Sekcja w arkuszu Wygląd (HGWall.html), wygaszacz to nakładka na <body> (Popover API → nad dialogami HA). */
const HG_WALL_CSS = `
.wl ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; flex:none; }
.wl-sw{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:12px; min-height:48px; padding:6px 4px 6px 12px; border-radius:16px; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, none); font-size:14px; font-weight:600; }
.wl-sw > span{ flex:1; min-width:0; } .wl-sw small{ display:block; font-weight:400; opacity:.65; font-size:12px; }
.wl-sw i{ position:relative; flex:none; width:46px; height:28px; border-radius:999px; background:color-mix(in srgb, currentColor 22%, transparent); transition:background .25s ease; margin-right:6px; }
.wl-sw i::after{ content:''; position:absolute; top:3px; left:3px; width:22px; height:22px; border-radius:50%; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,.3); transition:transform .25s cubic-bezier(.2,.8,.2,1); }
.wl-sw[aria-checked=true] i{ background:var(--hg-accent); box-shadow:0 0 10px var(--hg-accent-glow, transparent); } .wl-sw[aria-checked=true] i::after{ transform:translateX(18px); }
.wl-sw:focus-visible, .wl-seg button:focus-visible, .wl-tb:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.wl-f{ display:flex; flex-direction:column; gap:8px; } .wl-f > span{ font-size:12.5px; font-weight:600; opacity:.75; display:flex; align-items:center; }
.wl-f > span em{ margin-left:auto; font-style:normal; font-variant-numeric:tabular-nums; padding:2px 10px; border-radius:999px; background:var(--hg-accent); color:var(--hg-on-accent); font-size:12px; }
.wl-seg{ display:grid; grid-template-columns:repeat(var(--n, 3), 1fr); gap:3px; padding:3px; border-radius:16px; background:var(--hg-tile-bg); }
.wl-seg button{ all:unset; box-sizing:border-box; cursor:pointer; min-height:40px; padding:4px 6px; border-radius:13px; text-align:center; font-size:13px; font-weight:600; display:flex; align-items:center; justify-content:center; line-height:1.15; transition:background .2s ease, color .2s ease; }
.wl-seg button:hover{ background:var(--hg-hover-fill, color-mix(in srgb, currentColor 8%, transparent)); }
.wl-seg [aria-pressed=true]{ background:var(--hg-accent); color:var(--hg-on-accent); }
.wl-tb{ all:unset; box-sizing:border-box; cursor:pointer; align-self:flex-start; height:40px; padding:0 18px; border-radius:999px; display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:600; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, inset 0 0 0 1px color-mix(in srgb, currentColor 18%, transparent)); }
.wl-tb:hover{ background:var(--hg-hover-fill, color-mix(in srgb, currentColor 8%, transparent)); }
.wl-beta{ flex:none; margin-left:8px; padding:2px 8px; border-radius:999px; font-size:10.5px; font-weight:700; letter-spacing:.08em; background:color-mix(in srgb, var(--hg-accent) 22%, transparent); color:var(--hg-accent-tx, var(--hg-accent)); vertical-align:middle; }
.wl-sw .wl-beta{ display:inline-block; }
.wl-pin{ display:flex; gap:8px; align-items:center; } .wl-pin .hs-s{ flex:1; min-width:0; } .wl-pin input{ letter-spacing:.3em; font-variant-numeric:tabular-nums; }
.wl-ok{ font-size:12px; font-weight:600; color:var(--hg-accent-tx, var(--hg-accent)); display:inline-flex; align-items:center; gap:4px; } .wl-ok ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; }
.wl-f > span em.wl-ok{ background:none; padding:0; color:var(--hg-accent-tx, var(--hg-accent)); }
.wl-warn{ font-size:12.5px; opacity:.8; }
.wl-qr{ display:flex; flex-direction:column; gap:6px; } .wl-qh{ display:flex; align-items:center; gap:8px; min-width:0; } .wl-qh b{ font-size:14px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .wl-qh small{ flex:1; min-width:0; opacity:.65; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.wl-qh .wl-tb{ flex:none; align-self:center; width:32px; height:32px; padding:0; justify-content:center; }
@media (max-width:520px){ .wl-seg.six{ grid-template-columns:repeat(3, 1fr); } }
.wl-sw:disabled{ cursor:default; opacity:.55; } .wl-sw:disabled i{ opacity:.6; }
@media (prefers-reduced-motion:reduce){ .wl-sw i, .wl-sw i::after, .wl-seg button{ transition:none; } }
`;
const K = (r, g, b, a) => 'rgb' + `a(${r},${g},${b},${a})`;   /* kolory wygaszacza przez interpolację: tokenizer motywu ich nie rusza (nakładka jest zawsze ciemna) */
const HG_WALL_SS = `
.nw{ position:fixed; inset:0; margin:0; padding:0; border:0; max-width:none; max-height:none; width:100%; height:100%; overflow:hidden; background:${K(5,7,11,1)}; color:${K(255,255,255,1)}; z-index:2147483000;
  font-family:'DM Sans','HG DM Sans',system-ui,sans-serif; -webkit-font-smoothing:antialiased; cursor:none; opacity:0; transition:opacity 1.4s ease; outline:none; user-select:none; -webkit-user-select:none; touch-action:none; }
.nw.in{ opacity:1; } .nw.out{ opacity:0; transition-duration:.4s; }
.nw-bg{ position:absolute; inset:-3%; background-size:cover; background-position:center; opacity:0; transition:opacity 2.4s ease; animation:var(--hg-loop, nwkb 48s ease-in-out infinite alternate); animation-play-state:var(--hg-play, running); will-change:transform, opacity; }
.nw-bg.on{ opacity:1; }
@keyframes nwkb{ from{ transform:scale(1) translate3d(0,0,0); } to{ transform:scale(1.07) translate3d(-1.2%, -.8%, 0); } }
.nw-sh{ position:absolute; inset:0; background:radial-gradient(120% 95% at 50% 45%, transparent 55%, ${K(0,0,0,.38)} 100%), ${K(4,6,10,'var(--nw-dim, .5)')}; }
.nw-c{ position:absolute; left:calc(clamp(24px, 5vmin, 64px) + env(safe-area-inset-left, 0px)); bottom:calc(clamp(64px, 9vmin, 104px) + env(safe-area-inset-bottom, 0px)); max-width:min(62vw, 900px); }
.nw-g{ display:flex; flex-direction:column; align-items:flex-start; text-align:left; transition:transform 5s cubic-bezier(.4,0,.2,1); transform:translate(var(--nw-x, 0), var(--nw-y, 0)); }
.nw-t{ font-size:clamp(84px, 22vmin, 240px); font-weight:300; line-height:.9; letter-spacing:-.035em; font-variant-numeric:tabular-nums; text-shadow:0 4px 40px ${K(0,0,0,.45)}; margin-left:-.04em; }
.nw-d{ margin-top:clamp(6px, 1.4vmin, 14px); font-size:clamp(17px, 3.4vmin, 34px); font-weight:500; opacity:.92; letter-spacing:.01em; text-shadow:0 2px 14px ${K(0,0,0,.5)}; } .nw-d::first-letter{ text-transform:uppercase; }
.nw-r{ position:absolute; right:calc(clamp(20px, 4vmin, 48px) + env(safe-area-inset-right, 0px)); top:calc(clamp(18px, 4vmin, 44px) + env(safe-area-inset-top, 0px)); width:clamp(260px, 25vw, 340px); max-width:calc(100vw - 40px); display:flex; flex-direction:column; gap:clamp(10px, 1.4vmin, 14px); }
@media (orientation:portrait){ .nw-r{ width:clamp(260px, 44vw, 360px); } }
.nw-p{ box-sizing:border-box; padding:clamp(6px, 1vmin, 10px) 0; background:none; -webkit-backdrop-filter:none; backdrop-filter:none;
  box-shadow:none; color:#fff; text-shadow:0 1px 3px ${K(0,0,0,.55)}, 0 2px 18px ${K(0,0,0,.45)}; animation:nwin .9s cubic-bezier(.2,.8,.2,1) both; }
.nw-p + .nw-p{ animation-delay:.12s; } .nw-p[hidden]{ display:none; }
@keyframes nwin{ from{ opacity:0; transform:translateY(10px); } to{ opacity:1; transform:none; } }
.nw-w .nw-wm{ display:flex; align-items:center; gap:clamp(8px, 1.4vmin, 14px); }
.nw-w .nw-wm img{ flex:none; width:clamp(58px, 8.5vmin, 84px); height:clamp(58px, 8.5vmin, 84px); margin:-8px -4px -8px -10px; filter:drop-shadow(0 6px 18px ${K(0,0,0,.35)}); }
.nw-w .nw-wm b{ display:block; font-size:clamp(38px, 6.6vmin, 64px); font-weight:200; line-height:.9; letter-spacing:-.04em; font-variant-numeric:tabular-nums; }
.nw-wx{ min-width:0; flex:1; display:flex; flex-direction:column; align-items:flex-end; text-align:right; gap:3px; font-size:clamp(12px, 1.6vmin, 15px); font-weight:500; }
.nw-wx span{ max-width:100%; line-height:1.2; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; text-wrap:balance; } .nw-wx small{ font-size:.85em; opacity:.72; font-variant-numeric:tabular-nums; }
.nw-fc{ display:grid; grid-template-columns:repeat(var(--n, 4), 1fr); gap:4px; margin-top:clamp(8px, 1.3vmin, 12px); padding-top:clamp(8px, 1.3vmin, 12px); border-top:1px solid ${K(255,255,255,.14)}; }
.nw-fc div{ display:flex; flex-direction:column; align-items:center; gap:0; font-size:clamp(11px, 1.4vmin, 13px); font-variant-numeric:tabular-nums; }
.nw-fc i{ font-style:normal; opacity:.65; font-size:.88em; font-weight:500; } .nw-fc img{ width:clamp(38px, 5.2vmin, 50px); height:clamp(38px, 5.2vmin, 50px); margin:-6px 0; } .nw-fc b{ font-weight:500; }
.nw-e h5, .nw-k h5{ margin:0 0 clamp(8px, 1.2vmin, 11px); font-size:clamp(10px, 1.3vmin, 12px); font-weight:600; letter-spacing:.12em; text-transform:uppercase; opacity:.62; }
.nw-e ul, .nw-k ul{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:clamp(8px, 1.2vmin, 11px); }
.nw-e li, .nw-k li{ position:relative; min-width:0; padding:1px 0 1px 12px; }
.nw-e li::before, .nw-k li::before{ content:''; position:absolute; left:0; top:2px; bottom:2px; width:3px; border-radius:1.5px; background:var(--c); box-shadow:0 0 12px var(--c); }
.nw-e .nw-et, .nw-k .nw-et{ display:flex; align-items:center; gap:6px; font-size:clamp(11px, 1.4vmin, 13px); font-weight:500; opacity:.75; font-variant-numeric:tabular-nums; }
.nw-e .nw-et em, .nw-k .nw-et em{ font-style:normal; font-weight:700; font-size:.82em; letter-spacing:.04em; padding:0; background:none; color:#fff; text-shadow:0 1px 3px ${K(0,0,0,.6)}; text-transform:uppercase; }
.nw-e li.nx .nw-et, .nw-k li.nx .nw-et{ opacity:1; }
.nw-e .nw-en, .nw-k .nw-en{ display:block; margin-top:2px; font-size:clamp(14px, 1.9vmin, 17px); font-weight:500; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
/* dziecko (LiveKid, funkcja ukryta): przyjście / wyjście jak kolumny prognozy, plan zajęć jak lista wydarzeń */
.nw-k h5{ display:flex; align-items:center; justify-content:space-between; gap:8px; opacity:1; } .nw-k h5 > b{ font-weight:700; opacity:.9; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.nw-kst{ flex:none; display:inline-flex; align-items:center; gap:6px; padding:3px 9px 3px 7px; border-radius:999px; font-size:clamp(10px, 1.3vmin, 12px); font-weight:600; letter-spacing:.02em; text-transform:none; background:${K(255,255,255,.14)}; }
.nw-kst i{ width:7px; height:7px; border-radius:50%; background:${K(255,255,255,.55)}; } .nw-kst.on{ background:${K(126,224,168,.22)}; } .nw-kst.on i{ background:${K(126,224,168,1)}; }
.nw-kt{ display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-bottom:clamp(8px, 1.3vmin, 12px); padding-bottom:clamp(8px, 1.3vmin, 12px); border-bottom:1px solid ${K(255,255,255,.14)}; }
.nw-kt div{ display:flex; flex-direction:column; gap:1px; } .nw-kt i{ font-style:normal; font-size:clamp(10px, 1.3vmin, 12px); font-weight:600; letter-spacing:.08em; text-transform:uppercase; opacity:.62; }
.nw-kt b{ font-size:clamp(20px, 3vmin, 28px); font-weight:300; letter-spacing:-.02em; font-variant-numeric:tabular-nums; } .nw-kt b.mu{ opacity:.45; }
.nw-k .nw-kn{ font-size:clamp(12px, 1.5vmin, 14px); opacity:.7; } .nw-ks{ height:clamp(10px, 1.6vmin, 16px); }
@media (prefers-reduced-motion:reduce){ .nw-p{ animation:none; } }
.nw-h{ position:absolute; margin:0; left:0; right:0; bottom:calc(clamp(18px, 3.5vmin, 36px) + env(safe-area-inset-bottom, 0px)); padding:0 16px; text-align:center; font-size:clamp(13px, 2vmin, 16px); font-weight:500; letter-spacing:.03em; color:#fff; background:none; text-shadow:0 1px 3px ${K(0,0,0,.6)}, 0 2px 16px ${K(0,0,0,.5)}; animation:var(--hg-loop, nwhp 3.2s ease-in-out infinite); }
@keyframes nwhp{ 0%, 100%{ opacity:.7; } 50%{ opacity:1; } }
@keyframes nwh{ 0%, 100%{ opacity:.25; } 50%{ opacity:.6; } }
.nw-bg, .nw-sh, .nw-c, .nw-r, .nw-h{ transition-property:opacity, filter, transform; }
.nw.pin .nw-bg{ filter:blur(28px) saturate(1.2); transition:filter .5s ease, opacity 2.4s ease; }
.nw.pin .nw-sh{ background:${K(4,6,10,.5)}; }
.nw.pin .nw-h{ visibility:hidden; animation:none; }
.nw.pin .nw-c, .nw.pin .nw-r, .nw.pin .nw-h{ opacity:0; transition:opacity .3s ease; pointer-events:none; }
.nw.lk .nw-h::before{ content:''; display:inline-block; width:14px; height:14px; margin:0 8px -2px 0; background:currentColor; -webkit-mask:var(--nw-lki) center/contain no-repeat; mask:var(--nw-lki) center/contain no-repeat; }
.nw-pp{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:clamp(14px, 2.6vmin, 26px); padding:calc(16px + env(safe-area-inset-top, 0px)) 16px calc(16px + env(safe-area-inset-bottom, 0px)); cursor:default;
  opacity:0; transform:scale(1.04); transition:opacity .35s ease, transform .45s cubic-bezier(.2,.8,.2,1); pointer-events:none; }
.nw.pin .nw-pp{ opacity:1; transform:none; pointer-events:auto; }
.nw-pt{ display:flex; flex-direction:column; align-items:center; gap:6px; font-size:clamp(15px, 2.2vmin, 18px); font-weight:500; letter-spacing:.01em; text-shadow:0 1px 8px ${K(0,0,0,.35)}; }
.nw-pt svg{ width:22px; height:22px; opacity:.9; } .nw-pt small{ min-height:1.3em; font-size:.82em; font-weight:500; opacity:.75; }
.nw-pt small.err{ color:${K(255,170,160,1)}; opacity:1; }
.nw-dots{ display:flex; gap:clamp(12px, 1.8vmin, 16px); height:16px; align-items:center; }
.nw-dots i{ width:13px; height:13px; border-radius:50%; box-shadow:inset 0 0 0 1.5px ${K(255,255,255,.75)}; transition:background .15s ease, transform .2s cubic-bezier(.2,.8,.2,1); }
.nw-dots i.on{ background:${K(255,255,255,1)}; transform:scale(1.08); }
.nw-dots.bad{ animation:nwsh .42s cubic-bezier(.36,.07,.19,.97); } .nw-dots.bad i{ box-shadow:inset 0 0 0 1.5px ${K(255,170,160,1)}; }
.nw-dots.ok i{ background:${K(190,255,170,1)}; box-shadow:none; }
@keyframes nwsh{ 10%, 90%{ transform:translateX(-2px); } 20%, 80%{ transform:translateX(4px); } 30%, 50%, 70%{ transform:translateX(-8px); } 40%, 60%{ transform:translateX(8px); } }
.nw-kp{ display:grid; grid-template-columns:repeat(3, var(--k)); gap:clamp(14px, 2.4vmin, 22px) clamp(20px, 3.4vmin, 30px); --k:clamp(64px, 11vmin, 84px); }
.nw-kp button{ all:unset; box-sizing:border-box; cursor:pointer; width:var(--k); height:var(--k); border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;
  background:${K(255,255,255,.13)}; -webkit-backdrop-filter:var(--hg-bfo, blur(18px) saturate(1.3)); backdrop-filter:var(--hg-bfo, blur(18px) saturate(1.3)); box-shadow:inset 0 0 0 1px ${K(255,255,255,.16)}, inset 0 1px 0 ${K(255,255,255,.18)};
  font-size:calc(var(--k) * .42); font-weight:300; line-height:1; font-variant-numeric:tabular-nums; transition:background .25s ease, transform .18s cubic-bezier(.2,.8,.2,1); -webkit-tap-highlight-color:transparent; touch-action:manipulation; }
.nw-kp button small{ font-size:9.5px; font-weight:600; letter-spacing:.18em; opacity:.6; margin-top:2px; height:11px; }
.nw-kp button:active, .nw-kp button.hit{ background:${K(255,255,255,.34)}; transform:scale(.94); transition-duration:0s, .08s; }
.nw-kp button:focus-visible, .nw-lb:focus-visible{ outline:2px solid ${K(255,255,255,.9)}; outline-offset:3px; }
.nw-kp button.fn{ background:none; box-shadow:none; -webkit-backdrop-filter:none; backdrop-filter:none; } .nw-kp button.fn svg{ width:30%; height:30%; }
.nw-kp button.fn:active{ background:${K(255,255,255,.14)}; } .nw-kp button[disabled]{ opacity:.35; pointer-events:none; } .nw-kp .gap{ visibility:hidden; pointer-events:none; }
.nw-lb{ all:unset; box-sizing:border-box; cursor:pointer; display:inline-flex; align-items:center; gap:8px; height:46px; padding:0 22px; border-radius:999px; font-size:15px; font-weight:600; color:#fff;
  background:${K(255,255,255,.13)}; -webkit-backdrop-filter:var(--hg-bfo, blur(18px)); backdrop-filter:var(--hg-bfo, blur(18px)); box-shadow:inset 0 0 0 1px ${K(255,255,255,.16)}; transition:background .2s ease, transform .15s ease; }
.nw-lb svg{ width:18px; height:18px; } .nw-lb:active{ transform:scale(.96); background:${K(255,255,255,.26)}; }
@media (max-height:560px){ .nw-kp{ --k:clamp(52px, 12vmin, 64px); gap:10px 22px; } .nw-pt .nw-li{ display:none; } }
/* odblokowanie: kłódka się otwiera, kropki pulsują na zielono, cyfry rozchodzą się od środka, fala światła i rozmycie znikają, nakładka odsłania panel */
.nw-pt .nw-li{ position:relative; width:22px; height:22px; } .nw-pt .nw-li svg{ position:absolute; inset:0; transition:opacity .2s ease, transform .45s cubic-bezier(.34,1.56,.64,1); }
.nw-pt .nw-li .op{ opacity:0; transform:translateY(2px) scale(.8); }
.nw.unl .nw-li .cl{ opacity:0; transform:scale(.8); } .nw.unl .nw-li .op{ opacity:1; transform:translateY(-2px) scale(1.18); }
.nw.unl .nw-li{ animation:nwlk .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes nwlk{ 0%{ transform:none; } 35%{ transform:rotate(-10deg) scale(1.15); } 70%{ transform:rotate(6deg) scale(1.1); } 100%{ transform:scale(1.12); } }
.nw.unl .nw-dots i{ background:${K(190,255,170,1)}; box-shadow:0 0 14px ${K(160,255,140,.8)}; animation:nwdt .5s cubic-bezier(.2,.8,.2,1) both; animation-delay:calc(var(--i) * 45ms); }
@keyframes nwdt{ 0%{ transform:scale(1); } 45%{ transform:scale(1.55); } 100%{ transform:scale(.2); opacity:0; } }
.nw.unl .nw-pt span, .nw.unl .nw-pt small{ transition:opacity .35s ease .2s; opacity:0; }
.nw.unl .nw-kp > *{ animation:nwko .55s cubic-bezier(.4,0,.2,1) both; animation-delay:calc(120ms + var(--d, 0) * 70ms); }
@keyframes nwko{ to{ opacity:0; transform:translate(calc(var(--x, 0) * 26px), calc(var(--y, 0) * 26px)) scale(.55); filter:blur(6px); } }
.nw.unl .nw-lb{ transition:opacity .3s ease .1s, transform .4s ease .1s; opacity:0; transform:translateY(14px) scale(.9); }
.nw-rip{ position:absolute; left:var(--rx, 50%); top:var(--ry, 30%); width:10px; height:10px; margin:-5px 0 0 -5px; border-radius:50%; pointer-events:none; opacity:0;
  background:radial-gradient(circle, ${K(255,255,255,.28)} 0%, ${K(255,255,255,.1)} 45%, transparent 70%); }
.nw.unl .nw-rip{ animation:nwrp .9s cubic-bezier(.2,.8,.2,1) .15s both; }
@keyframes nwrp{ 0%{ opacity:0; transform:scale(1); } 25%{ opacity:1; } 100%{ opacity:0; transform:scale(260); } }
.nw.unl .nw-sh{ background:${K(4,6,10,.3)}; transition:background .6s ease .2s; }
/* rozmyta warstwa odpływa: lekko rośnie i znika, a panel pod nią wyostrza się (bez podwójnego, ostrego zdjęcia) */
.nw.unl.out{ opacity:0; transform:scale(1.06); transition:opacity .55s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.2,.8,.2,1); }
@media (prefers-reduced-motion:reduce){ .nw-pp, .nw.pin .nw-bg{ transition:none; } .nw-dots.bad{ animation:none; }
  .nw.unl .nw-li, .nw.unl .nw-dots i, .nw.unl .nw-kp > *, .nw.unl .nw-rip{ animation:none; } .nw.unl .nw-kp, .nw.unl .nw-lb{ opacity:0; transition:opacity .2s; } }
@media (prefers-reduced-motion:reduce){ .nw, .nw.out{ transition-duration:.2s; } .nw-bg{ animation:none; transition-duration:.2s; } .nw-g{ transition:none; } .nw-h{ animation:none; opacity:.95; } }
`;
const HGWall = window.__hgWall || (window.__hgWall = {
  IDLES: [30, 60, 120, 300, 600, 1800],
  SRCS: [['bg', hgTLazy('wall.photo_sources.bg')], ['slides', hgTLazy('wall.photo_sources.slides')], ['url', hgTLazy('wall.photo_sources.url')]],
  last: Date.now(), active: false, page: null, hass: null, el: null, _t: null, _ck: null, _sl: null, _dr: null, _wl: null, _wired: false, _ms: undefined, _foc: null, _sv: null, _ev: null, _evt: 0, _evk: '', _fc: null, _fcb: false,
  /* ---- ustawienia ---- */
  get(raw) { const w = (window.__hgL && window.__hgL.data && window.__hgL.data.wall) || {}, n = (v, a, b, d) => { v = Number(v); return isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
    const nt = this.ntGet(), dim = n(w.dim, 0, 0.9, 0.5);   /* raw = ustawienia dzienne (UI i zapis); domyślnie efektywne (noc: przyciemnienie nocne) */
    return { on: w.on === true, idle: n(w.idle, 15, 7200, 120), dim: !raw && this.ntNight() ? nt.dim : dim, nt, src: this.SRCS.some((s) => s[0] === w.src) ? w.src : 'bg',
      url: typeof w.url === 'string' && /^(\/|https?:\/\/)/.test(w.url) && !/[\s"'()<>\\]/.test(w.url) ? w.url : '',
      sensors: [...new Set((Array.isArray(w.sensors) ? w.sensors : (typeof w.sensor === 'string' ? [w.sensor] : [])).filter((e) => typeof e === 'string' && /^binary_sensor\.[a-z0-9_]+$/.test(e)))].slice(0, 20),
      lock: w.lock === true, pinH: typeof w.pinH === 'string' && /^[0-9a-z]{6,40}$/.test(w.pinH) ? w.pinH : '', pinN: n(w.pinN, 4, 8, 4), lockAfter: this.LOCKS.includes(Number(w.lockAfter)) ? Number(w.lockAfter) : 0, lk: w.lk !== false,
      home: typeof w.home === 'string' && /^[a-z0-9_-]{1,40}$/.test(w.home) ? w.home : '',
      qa: typeof HGWallQA !== 'undefined' ? HGWallQA.norm(w.qa) : [] }; },
  /* ---- harmonogram nocny (#46): w nocy inny styl i przyciemnienie; domyślnie wyłączony ---- */
  ntGet() { const w = (window.__hgL && window.__hgL.data && window.__hgL.data.wall) || {}, t = (w.nt && typeof w.nt === 'object' ? w.nt : {}), hm = (v, d) => (typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : d), dm = Number(t.dim);
    return { on: t.on === true, mode: t.mode === 'hours' ? 'hours' : 'sun', from: hm(t.from, '22:00'), to: hm(t.to, '06:00'),
      style: (this.XS || []).some((x) => x[0] === t.style) ? t.style : 'night', dim: t.dim != null && t.dim !== '' && isFinite(dm) ? Math.max(0, Math.min(0.9, dm)) : 0.8 }; },
  /* czy teraz noc wg harmonogramu: 'sun' = sun.sun below_horizon (bez encji: godziny od-do), 'hours' = przedział od-do, także przez północ; od = do nigdy */
  ntNight(h, d) { const t = this.ntGet(); if (!t.on) return false; h = h || this.hass || window.__hgHass;
    const s = t.mode === 'sun' && h && h.states ? h.states['sun.sun'] : null; if (s && s.state) return s.state === 'below_horizon';
    d = d || new Date(); const m = d.getHours() * 60 + d.getMinutes(), f = Number(t.from.slice(0, 2)) * 60 + Number(t.from.slice(3)), e = Number(t.to.slice(0, 2)) * 60 + Number(t.to.slice(3));
    return f === e ? false : f < e ? m >= f && m < e : m >= f || m < e; },
  /* efektywny styl: nocny w nocy, inaczej wybrany; raw = styl dzienny (UI) */
  styleNow(raw) { const w = (window.__hgL && window.__hgL.data && window.__hgL.data.wall) || {}; return !raw && this.ntNight() ? this.ntGet().style : w.style; },
  /* zmiana dzień/noc w trakcie wyświetlania: inny styl = ponowne wybudzenie i pokaz, sam dim = zmienna CSS; zwraca true, gdy przełączono */
  ntSwitch() { if (!this.active || !this.el || this._tst) return false; const s = this.styleNow();
    if (this._sty !== undefined && s !== this._sty && !this.locked) { this.wake('night'); this.show(); return true; }
    if (this.el) this.el.style.setProperty('--nw-dim', this.get().dim); return false; },
  /* ---- widok po starcie wygaszacza: przejście pod zasłoną, po wybudzeniu dashboard jest już na wybranym widoku ---- */
  goHome() { const v = this.get().home;
    if (!v || !this.active || !this.canShow() || this.page._config.view === v || !window.HGVLock || !HGVLock.views(true).some(([k]) => k === v)) return;
    H.navigate(HG_P(v)); },
  /* ---- blokada PIN-em (BETA): wygaszacz zablokowany po lockAfter s; dotknięcie pokazuje pinpad. Wygoda w kiosku, nie zabezpieczenie konta HA: zapisany jest tylko skrót PIN-u. ---- */
  LOCKS: [0, 60, 300, 900, 1800],
  /* ---- wygaszacz na tym urządzeniu (#16): ustawienia są wspólne, ale włączenie zapisuje się w tej przeglądarce (localStorage).
     Bez zapisu: włączony tylko tam, gdzie ekran był zablokowany PIN-em (tablet ścienny sprzed tej zmiany), na telefonie i komputerze wyłączony. ---- */
  here(v) { const k = 'home-glass:wall-here'; try { if (v === undefined) { const x = localStorage.getItem(k); return x === null ? this.flag() : x === '1'; } localStorage.setItem(k, v ? '1' : '0'); } catch (e) { /* pamięć zablokowana */ } return false; },
  /* ustawienia dla silnika: on tylko gdy wygaszacz jest włączony i włączony na tym urządzeniu; get() zostaje wspólny (set() go zapisuje) */
  run() { const c = this.get(); return c.on && !this.here() ? Object.assign({}, c, { on: false }) : c; },
  lockOn() { const c = this.run(); return !!(c.on && c.lock && c.pinH); },
  hash(pin) { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; const str = 'nuvio-wall:' + pin; for (let r = 0; r < 512; r++) for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i) + r;
      h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); }
    return ((h2 >>> 0).toString(36) + (h1 >>> 0).toString(36)); },
  flag(v) { const k = 'home-glass:wall-locked'; try { if (v === undefined) return localStorage.getItem(k) === '1'; if (v) localStorage.setItem(k, '1'); else localStorage.removeItem(k); } catch (e) { /* pamięć zablokowana */ } return false; },
  lockNow() { if (typeof HGWallQA !== 'undefined') HGWallQA.close(this); if (!this.lockOn()) return; if (!this.active) { if (!this.page) return; this.show(); }
    this.locked = true; this.flag(true); clearTimeout(this._lk); if (window.HGVLock) HGVLock.mark(); if (this.el) { this.el.classList.add('lk'); this.el.querySelector('.nw-h').textContent = hgT('wall.touch_to_unlock'); } },
  /* pinpad (przyciski, kropki, kłódka): ten sam dla wygaszacza i blokady widoku (hg-vlock) */
  padEl(lbl, lockLbl) {
      const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`, LK = 'M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z';
      const BK = 'M22,3H7C6.31,3 5.77,3.35 5.41,3.88L0,12L5.41,20.11C5.77,20.64 6.31,21 7,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12';
      const L = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'], pos = (r, q) => { const x = q - 1, y = r - 1.5; return `--x:${x};--y:${y.toFixed(1)};--d:${Math.hypot(x, y * .9).toFixed(2)}`; }, key = (d) => `<button type="button" data-k="${d}" aria-label="${d}" style="${d ? pos(Math.floor((d - 1) / 3), (d - 1) % 3) : pos(3, 1)}">${d}<small>${d ? L[d - 1] || '' : ''}</small></button>`;
      const pp = document.createElement('div'); pp.className = 'nw-pp'; pp.setAttribute('role', 'group'); pp.setAttribute('aria-label', lbl);
      const LO = 'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z';
      pp.innerHTML = `<i class="nw-rip" aria-hidden="true"></i><div class="nw-pt"><span class="nw-li">${ic(LK).replace('<svg ', '<svg class="cl" ')}${ic(LO).replace('<svg ', '<svg class="op" ')}</span><span>${H.esc(hgT('wall.enter_pin'))}</span><div class="nw-dots" aria-live="polite"></div><small></small></div>
        <div class="nw-kp">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(key).join('')}<span class="gap"></span>${key(0)}<button type="button" class="fn" data-k="del" style="${pos(3, 2)}" aria-label="${H.esc(hgT('wall.delete'))}">${ic(BK)}</button></div>
        <button type="button" class="nw-lb" data-k="lock">${ic(LK)}<span>${H.esc(lockLbl)}</span></button>`;
      return pp; },
  pad() { const el = this.el; if (!el || el.classList.contains('pin')) return; const c = this.get();
    let pp = el.querySelector('.nw-pp'); if (!pp) {
      pp = this.padEl(hgT('wall.unlock_the_dashboard'), hgT('wall.lock'));
      pp.addEventListener('pointerdown', (e) => { e.stopPropagation(); const b = e.target.closest('button'); if (!b) return; e.preventDefault(); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 120); this.key(b.dataset.k); });
      el.appendChild(pp); }
    this._pin = ''; this.dots(c.pinN); el.classList.add('pin'); this.idlePad(); },
  dots(n, st) { const el = this.el, d = el && el.querySelector('.nw-dots'); if (!d) return; const N = Math.max(n || 4, this._pin.length);
    d.className = 'nw-dots' + (st ? ' ' + st : ''); d.innerHTML = Array.from({ length: N }, (_, i) => `<i class="${i < this._pin.length ? 'on' : ''}" style="--i:${i}"></i>`).join(''); d.setAttribute('aria-label', hgT('wall.pin_entered', { count: this._pin.length, total: N })); },
  msg(t, err) { const s = this.el && this.el.querySelector('.nw-pt small'); if (s) { s.textContent = t || ''; s.classList.toggle('err', !!err); } },
  unlock() { const el = this.el; if (!el || el.classList.contains('unl')) return; const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const li = el.querySelector('.nw-li'), r = li && li.getBoundingClientRect(); if (r) { el.style.setProperty('--rx', r.left + r.width / 2 + 'px'); el.style.setProperty('--ry', r.top + r.height / 2 + 'px'); }
    el.classList.add('unl'); try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) { /* bez wibracji */ }
    setTimeout(() => { this.locked = false; this.flag(false); const pg = this.page, as = this._apin; this._apin = 0; this.wake('pin');
      if (as && window.HGAssistUI) setTimeout(() => HGAssistUI.open(pg && pg.shadowRoot ? pg : null, 'saver'), 80); }, rm ? 150 : 620); },
  /* pinpad wraca do zablokowanego wygaszacza po 20 s bez dotyku */
  idlePad() { clearTimeout(this._pt); this._pt = setTimeout(() => this.unpad(), 20000); },
  unpad() { clearTimeout(this._pt); this._pin = ''; this._apin = 0; const el = this.el; if (!el) return; el.classList.remove('pin'); this.msg(''); el.focus({ preventScroll: true }); },
  key(k) { const el = this.el; if (!el || el.classList.contains('unl')) return; const c = this.get(); this.idlePad();
    if (k === 'lock') return this.unpad();
    const wait = (this._ban || 0) - Date.now(); if (wait > 0) return this.msg(hgT('wall.try_again_in', { seconds: Math.ceil(wait / 1000) }), true);
    if (k === 'del') { this._pin = this._pin.slice(0, -1); this.msg(''); return this.dots(c.pinN); }
    if (!/^[0-9]$/.test(k) || this._pin.length >= 8) return;
    this._pin += k; this.msg(''); this.dots(c.pinN);
    if (this._pin.length < c.pinN) return;
    if (this.hash(this._pin) === c.pinH) { this._bad = 0; clearTimeout(this._pt); this.dots(c.pinN, 'ok'); this.unlock(); return; }
    this._bad = (this._bad || 0) + 1; this._pin = ''; const d = el.querySelector('.nw-dots'); this.dots(c.pinN); d.classList.remove('bad'); void d.offsetWidth; d.classList.add('bad');
    if (this._bad >= 5) { const s = 30 * Math.pow(2, Math.min(4, Math.floor(this._bad / 5) - 1)); this._ban = Date.now() + s * 1000; this.msg(hgT('wall.too_many_attempts', { seconds: s }), true); }
    else this.msg(hgT('wall.wrong_pin'), true); },
  /* zapis do HA (frontend/set_user_data) z opóźnieniem – suwak przyciemnienia strzela wieloma zdarzeniami; bez tego load() po przeładowaniu nadpisywał lokalną zmianę danymi z serwera */
  set(p) { HGL.data.wall = Object.assign({}, (HGL.data && HGL.data.wall) || {}, this.get(true), p); HGL._ls(); this.sync();
    /* w trybie edycji: tylko szkic, zapis przy Gotowe */
    if (HGL.editing) return; clearTimeout(this._sv); this._sv = setTimeout(() => { this._sv = null; HGL.save(this.hass || window.__hgHass).catch(() => {}); }, 400); },
  /* ---- silnik bezczynności ---- */
  tick(h, page) { this.hass = h; this.page = page; this.sync(); this.motion(h);
    /* po przeładowaniu strony zablokowany ekran wraca od razu (przeładowanie nie omija blokady) */
    if (!this._rs) { const t0 = this._rs0 || (this._rs0 = Date.now());   /* ustawienia z HA mogą dojść chwilę później: czekamy na nie do 20 s */
      if (!this.flag()) this._rs = true; else if (this.lockOn()) { if (page && page.isConnected) { this._rs = true; if (!this.active) this.lockNow(); } else if (!this._rsT) this._rsT = setTimeout(() => { this._rsT = null; if (this.page && this.hass) this.tick(this.hass, this.page); }, 500); } else if (Date.now() - t0 > 20000) { this._rs = true; this.flag(false); } } },
  sync() { const c = this.run();
    if (!this._wired) { this._wired = true; const bump = () => { this.last = Date.now(); };
      for (const t of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart']) window.addEventListener(t, bump, { capture: true, passive: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) { this.last = Date.now(); this.arm(); if (this.active) this.wakeLock(); } }); }
    if (!c.on) { clearTimeout(this._t); this._t = null; if (this.active) this.hide(); return; }
    if (!this._t && !this.active) this.arm();
    else if (this.active && this.el && this.ntSwitch()) return;
    else if (this.active && this.el) { this.el.style.setProperty('--nw-dim', c.dim); if (this.el.classList.contains('gl')) this.gl(); else if (this.el.classList.contains('bd')) this.bd(); else if (this.el.classList.contains('xs')) this.xsDraw(); else { this.wx(); this.kid(); } if (typeof HGWallQA !== 'undefined') HGWallQA.paint(this); } },
  arm(ms) { clearTimeout(this._t); const c = this.run(); if (!c.on) { this._t = null; return; }
    this._t = setTimeout(() => this.check(), Math.max(1000, ms != null ? ms : c.idle * 1000 - (Date.now() - this.last))); },
  /* nakładka tylko na widocznym dashboardzie Nuvio, nie w trybie edycji i nie w tle przeglądarki */
  canShow() { const p = this.page; return !!(p && p.isConnected && !p._hgHidden && !p._editing && !(window.__hgL && window.__hgL.editing) && !document.hidden); },
  check() { this._t = null; const c = this.run(); if (!c.on || this.active) return;
    const left = c.idle * 1000 - (Date.now() - this.last);
    if (left > 500) return this.arm(left);
    if (!this.canShow()) { this.last = Date.now(); return this.arm(); }
    this.show(); },
  motion(h) { const c = this.run(); if (!c.on || !c.sensors.length) { this._ms = undefined; return; }
    const p = this._ms || (this._ms = {}), nx = {}; let up = false;
    for (const e of c.sensors) { const s = h && h.states ? h.states[e] : null, st = s ? s.state : null; if (e in p && st === 'on' && p[e] !== 'on') up = true; nx[e] = st; }
    this._ms = nx; if (up && this.active && !this.locked) this.wake('motion'); },
  /* ---- zdjęcia ---- */
  imgs() { const c = this.get(), A = HGApp.get(), port = window.innerHeight > window.innerWidth, one = (b) => { if (!b) return null; const u = port && b.v2p ? HGApp.bgImg({ kind: 'image', v: b.v2p }) : HGApp.bgImg(b); return u; };
    if (c.src === 'url' && c.url) return [HGApp.bgImg({ kind: 'image', v: c.url })];
    if (c.src === 'slides') { const l = (typeof hgBgList !== 'undefined' ? hgBgList() : []).map(([u, , pu]) => one(u ? { kind: 'image', v: u, v2p: pu || '' } : window.HG_DEFAULT_BG)).filter(Boolean);
      if (A.bg && A.bg.kind === 'image') { const x = one(A.bg); if (x && !l.includes(x)) l.unshift(x); }
      if (l.length) return [...new Set(l)]; }
    const B = A.bg || window.HG_DEFAULT_BG, x = one(B); return [x || `linear-gradient(160deg, ${(window.HG_DEFAULT_BG_FB || {}).v || '#16202B'}, ${(window.HG_DEFAULT_BG_FB || {}).v2 || '#05070A'})`]; },
  /* ---- nakładka ---- */
  qaTap(e) { return typeof HGWallQA !== 'undefined' && HGWallQA.tap(this, e); },
  show(test) { if (this.active) return; const c = this.get(), h = this.hass, rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* #35: wygaszacz zamyka widoki odblokowane PIN-em (poza podglądem z ustawień); po wybudzeniu bieżący widok znów pyta o PIN */
    if (!test && window.HGVLock) HGVLock.mark();
    this._sty = this.styleNow(); this._tst = !!test;
    this.active = true; clearTimeout(this._t); this._t = null; this._foc = document.activeElement;
    const el = this.el = document.createElement('div'); el.className = 'nw'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', hgT('wall.screensaver')); el.tabIndex = -1;
    el.style.setProperty('--nw-dim', c.dim);
    if (this.ckApply) this.ckApply(el);
    const gl = !!(this.glass && this.glass()), bd = !gl && !!(this.board && this.board()), xs = !gl && !bd && this.xs ? this.xs() : '';
    el.innerHTML = gl ? this.glShell() : bd ? this.bdShell() : xs ? this.xsShell(xs) : `<style>${HG_WALL_SS}</style><div class="nw-bg" aria-hidden="true"></div><div class="nw-bg" aria-hidden="true"></div><div class="nw-sh" aria-hidden="true"></div>
      <div class="nw-c"><div class="nw-g"><time class="nw-t"></time><div class="nw-d"></div></div></div><div class="nw-r"><div class="nw-p nw-w" hidden></div><div class="nw-p nw-k" hidden></div><div class="nw-p nw-e" hidden></div></div><p class="nw-h">${H.esc(hgT('common.touch_to_wake'))}</p>`;
    if (this.ckCss) el.insertAdjacentHTML('beforeend', this.ckCss(c));   /* na końcu: nadpisuje reguły stylów (np. Nocny, Zorza) o tej samej specyficzności */
    if (this.locked) { el.classList.add('lk'); this.flag(true); el.querySelector('.nw-h').textContent = hgT('wall.touch_to_unlock'); }
    this.locked = false; clearTimeout(this._lk); el.style.setProperty('--nw-lki', `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'><path d=\'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z\'/></svg>')}")`);
    if (this.lockOn()) { if (!c.lockAfter) this.locked = true; else this._lk = setTimeout(() => this.lockNow(), c.lockAfter * 1000); }
    const wk = (e) => { e.preventDefault(); e.stopPropagation(); if (this.locked) { if (e.target && e.target.closest && e.target.closest('.ng-orb.ia')) this._apin = 1; return this.pad(); } if (e.type === 'pointerdown' && ((this.glTap && this.glTap(e)) || this.qaTap(e))) { this.last = Date.now(); return; }
      if (typeof HGWallQA !== 'undefined' && HGWallQA.open()) { this.last = Date.now(); HGWallQA.close(this); return; } this.wake('touch'); };
    el.addEventListener('pointerdown', wk);
    el.addEventListener('keydown', (e) => { e.preventDefault(); e.stopPropagation(); if (!this.locked) return this.wake('key');
      if (!el.classList.contains('pin')) return this.pad(); if (/^[0-9]$/.test(e.key)) this.key(e.key); else if (e.key === 'Backspace') this.key('del'); else if (e.key === 'Escape') this.unpad(); }); el.addEventListener('wheel', wk, { passive: false }); el.addEventListener('contextmenu', (e) => e.preventDefault());
    if (typeof HGWallQA !== 'undefined') HGWallQA.mount(this, el);
    document.body.appendChild(el);
    try { el.popover = 'manual'; el.showPopover(); } catch (e) { /* bez Popover API: wystarczy z-index */ }
    if (gl) { this.glStart(rm); this.clock(); } else if (bd) { this.bdStart(rm); this.clock(); } else if (xs) { this.xsStart(xs, rm); this.clock(); } else { this.clock(); this.photos(rm); this.drift(rm); }
    requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('in'); el.focus({ preventScroll: true }); }));
    if (!test && c.home) this._hv = setTimeout(() => this.goHome(), 1500);   /* po wejściu zasłony (1,4 s) */
    this.wakeLock(); },
  /* blokada wygaszania ekranu na czas wygaszacza; przeglądarka zwalnia ją, gdy strona przestaje być widoczna, więc po powrocie prosimy ponownie (#38) */
  wakeLock() { if (!this.active || document.hidden || (this._wl && !this._wl.released) || this._wlq) return;
    try { if (!navigator.wakeLock || !navigator.wakeLock.request) return; this._wlq = true;
      navigator.wakeLock.request('screen').then((l) => { this._wlq = false; if (!this.active) { l.release(); return; } this._wl = l; try { l.addEventListener('release', () => { if (this._wl === l) this._wl = null; }); } catch (e) { /* bez zdarzenia: sprawdzamy released */ } }, () => { this._wlq = false; });
    } catch (e) { this._wlq = false; /* ekran może zgasnąć wg systemu */ } },
  clock() { clearTimeout(this._ck); const el = this.el; if (!el) return; if (this.ntSwitch()) return;
    if (el.classList.contains('gl')) { this.gl(true); this._ck = setTimeout(() => this.clock(), 60000 - (Date.now() % 60000) + 50); return; }
    if (el.classList.contains('xs')) { this.xsDraw(); this._ck = setTimeout(() => this.clock(), 60000 - (Date.now() % 60000) + 50); return; }
    if (el.classList.contains('bd')) { this.bd(true); this._ck = setTimeout(() => this.clock(), 60000 - (Date.now() % 60000) + 50); return; }
    const l = this.hass && this.hass.locale ? this.hass.locale.time_format : null, o = l === '12' ? { hour12: true } : l === '24' ? { hour12: false } : {}, d = new Date();
    el.querySelector('.nw-t').textContent = new Intl.DateTimeFormat(HG_LOC(), Object.assign({ hour: '2-digit', minute: '2-digit' }, o)).format(d);
    el.querySelector('.nw-d').textContent = new Intl.DateTimeFormat(HG_LOC(), { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    this.wx(); this.kid(); this.cal();
    this._ck = setTimeout(() => this.clock(), 60000 - (Date.now() % 60000) + 50); },
  /* pogoda w prawym górnym rogu (szklana karta), tylko gdy w HA jest encja weather */
  wx() { const el = this.el, h = this.hass, box = el && el.querySelector('.nw-w'); if (el && el.classList.contains('gl')) return this.gl(true); if (!box) return;
    const id = Object.keys((h && h.states) || {}).find((e) => e.startsWith('weather.') && h.states[e].state !== 'unavailable' && h.states[e].state !== 'unknown'), w = id ? h.states[id] : null;
    if (!w || typeof HGWx === 'undefined') { box.hidden = true; return; }
    const A = w.attributes, t = parseFloat(A.temperature), u = A.temperature_unit || (h.config && h.config.unit_system && h.config.unit_system.temperature) || '°C', sun = h.states['sun.sun'], night = !!sun && sun.state === 'below_horizon';
    const deg = (v) => H.esc(H.fmt(v, 0)) + (u.startsWith('°') ? '°' : ' ' + H.esc(u)), ic = (c, n) => H.esc(HGWx.icon({ icon_base: HG_ASSET + 'nuvio-meteo-', icon_v: '1' }, c, n, true));
    this.fc(h, id); const F = this._fc && this._fc.id === id ? this._fc : null, D = F && F.daily && F.daily[0], hi = D ? parseFloat(D.temperature) : NaN, lo = D ? parseFloat(D.templow) : NaN;
    let row = '';
    if (F && F.hourly && F.hourly.length > 1) { const L = F.hourly.filter((x) => new Date(x.datetime) > Date.now()).slice(0, 4), tf = new Intl.DateTimeFormat(HG_LOC(), { hour: '2-digit', minute: '2-digit' });
      if (L.length) row = L.map((x) => `<div><i>${H.esc(tf.format(new Date(x.datetime)))}</i><img alt="" src="${ic(x.condition, false)}"><b>${deg(parseFloat(x.temperature))}</b></div>`).join(''); }
    else if (F && F.daily && F.daily.length > 1) { const df = new Intl.DateTimeFormat(HG_LOC(), { weekday: 'short' });
      row = F.daily.slice(1, 4).map((x) => `<div><i>${H.esc(df.format(new Date(x.datetime)))}</i><img alt="" src="${ic(x.condition, false)}"><b>${deg(parseFloat(x.temperature))}</b></div>`).join(''); }
    const n = (row.match(/<div>/g) || []).length;
    const html = `<div class="nw-wm"><img alt="" src="${ic(w.state, night)}">${isFinite(t) ? `<b>${deg(t)}</b>` : ''}<div class="nw-wx"><span>${H.esc(HGWx.cn(w.state))}</span>${isFinite(hi) ? `<small>${H.esc(hgT('wall.temp_high'))} ${deg(hi)}${isFinite(lo) ? ` · ${H.esc(hgT('wall.temp_low'))} ${deg(lo)}` : ''}</small>` : ''}</div></div>${row ? `<div class="nw-fc" style="--n:${n}">${row}</div>` : ''}`;
    if (box.dataset.k !== html) { box.dataset.k = html; box.innerHTML = html; } box.hidden = false; },
  /* prognoza (usługa get_forecasts, godzinowa i dzienna), co 30 min; brak usługi lub danych = karta bez prognozy */
  fc(h, id) { if (!h.callWS || (this._fc && this._fc.id === id && Date.now() - this._fc.t < 1800000) || this._fcb) return;
    this._fcb = true; const one = (type) => h.callWS({ type: 'call_service', domain: 'weather', service: 'get_forecasts', service_data: { entity_id: id, type }, return_response: true })
      .then((r) => { const f = r && r.response && r.response[id] && r.response[id].forecast; return Array.isArray(f) ? f : null; }, () => null);
    Promise.all([one('hourly'), one('daily')]).then(([hr, dy]) => { this._fcb = false; this._fc = { id, t: Date.now(), hourly: hr, daily: dy }; if (this.el) this.wx(); }); },
  /* dzisiejsze wydarzenia ze wszystkich encji calendar.* (API kalendarza HA), odświeżane co 5 min; blok ukryty bez kalendarzy lub bez wydarzeń */
  cal() { const el = this.el, h = this.hass, box = el && el.querySelector('.nw-e'); if (!box) return;
    const kx = this._kidCal || [], ids = Object.keys((h && h.states) || {}).filter((e) => e.startsWith('calendar.') && !kx.includes(e)); if (!ids.length || !h.callApi) { box.hidden = true; return; }
    const d0 = new Date(); d0.setHours(0, 0, 0, 0); const d1 = new Date(d0); d1.setDate(d1.getDate() + 1); const key = d0.toDateString() + ids.join();
    if (this._ev && this._evk === key && Date.now() - this._evt < 300000) return this.evDraw(box);
    this._evk = key; this._evt = Date.now();
    const q = `?start=${encodeURIComponent(d0.toISOString())}&end=${encodeURIComponent(d1.toISOString())}`;
    Promise.all(ids.map((id) => h.callApi('GET', `calendars/${id}${q}`).catch(() => []))).then((rs) => {
      const L = []; for (const [ci, r] of rs.entries()) for (const e of (Array.isArray(r) ? r : [])) { const ad = !!(e.start && e.start.date && !e.start.dateTime), s = ad ? new Date(e.start.date + 'T00:00:00') : new Date(e.start && e.start.dateTime), en = ad ? new Date((e.end && e.end.date || e.start.date) + 'T00:00:00') : new Date(e.end && e.end.dateTime || s);
        if (isNaN(s)) continue; L.push({ ad, s, en, c: ci, t: e.summary ? String(e.summary) : null }); }
      this._ev = L.sort((a, b) => (b.ad - a.ad) || (a.s - b.s)); if (this.el) this.evDraw(this.el.querySelector('.nw-e')); }); },
  evDraw(box) { if (!box) return; const now = new Date(), l = this.hass && this.hass.locale ? this.hass.locale.time_format : null, o = l === '12' ? { hour12: true } : l === '24' ? { hour12: false } : {};
    const f = new Intl.DateTimeFormat(HG_LOC(), Object.assign({ hour: '2-digit', minute: '2-digit' }, o)), E = (this._ev || []).filter((e) => e.ad || e.en > now).slice(0, 4);
    if (!E.length) { box.hidden = true; return; }
    const C = ['#7AB8FF', '#FF9F6E', '#7EE0A8', '#D59BFF', '#FFD36E', '#FF7FA8'], nx = E.find((e) => !e.ad), rel = (e) => { const m = Math.round((e.s - now) / 60000);
      return e.s <= now ? hgT('common.now_cap') : m < 60 ? hgT('wall.in_min', { minutes: m }) : m < 180 ? hgT('wall.in_hours', { hours: Math.round(m / 60) }) : ''; };
    const html = `<h5>${H.esc(hgT('wall.today'))}</h5><ul>${E.map((e) => { const b = e === nx ? rel(e) : '';
      return `<li${e === nx ? ' class="nx"' : ''} style="--c:${C[e.c % C.length]}"><span class="nw-et">${H.esc(e.ad ? hgT('wall.all_day') : f.format(e.s) + ' – ' + f.format(e.en))}${b ? `<em>${H.esc(b)}</em>` : ''}</span><span class="nw-en" title="${H.esc(e.t || hgT('wall.event'))}">${H.esc(e.t || hgT('wall.event'))}</span></li>`; }).join('')}</ul>`;
    if (box.dataset.k !== html) { box.dataset.k = html; box.innerHTML = html; } box.hidden = false; },
  /* dziecko w żłobku / przedszkolu (integracja LiveKid): w dni robocze, gdy encje są wykryte i opcja LiveKid w ustawieniach jest włączona
     (domyślnie tak). Przyjście, wyjście i dzisiejszy plan zajęć; kalendarz integracji nie dubluje się wtedy w wydarzeniach. Wszystkie style wygaszacza. */
  kidOn(h) { return this.get().lk && typeof HGLiveKid !== 'undefined' && HGLiveKid.has(h); },
  kidList(h) { const wd = new Date().getDay(), K = h && wd > 0 && wd < 6 && this.kidOn(h) ? HGLiveKid.kids(h).filter((k) => k.ok && (k.scheduled || k.inToday)).slice(0, 2) : [];
    const kx = K.map((k) => k.ids.calendar).filter(Boolean); if (kx.join() !== (this._kidCal || []).join()) this._kidCal = kx; return K; },
  /* wspólny model dla wszystkich stylów: stan, godziny, najbliższe zajęcia ze „za X min” i kolejne (bez zakończonych) */
  kidView(h, k) { const now = new Date(), at = (v) => { if (!v || !/^\d{1,2}:\d{2}$/.test(v)) return null; const [a, b] = v.split(':').map(Number), d = new Date(); d.setHours(a, b, 0, 0); return d; };
    const P = k.plan.filter((a) => !a.all_day && a.start).map((a) => ({ title: a.title || hgT('wall.activity'), s: at(a.start), e: at(a.end), t: HGLiveKid.hhmm(h, a.start), te: a.end ? HGLiveKid.hhmm(h, a.end) : '' })).filter((x) => x.s && (x.e || x.s) > now);
    const done = !!k.outToday || (k.plan.length > 0 && !P.length), nx = done ? null : P[0] || null;
    const rel = (x) => { if (x.s <= now) return x.te ? hgT('wall.now_until', { time: x.te }) : hgT('common.now'); const m = Math.round((x.s - now) / 60000);
      return m < 60 ? hgT('wall.in_min', { minutes: m }) : m < 600 ? (m % 60 ? hgT('wall.in_hours_minutes', { hours: Math.floor(m / 60), minutes: m % 60 }) : hgT('wall.in_hours', { hours: m / 60 })) : ''; };
    return { name: k.name || hgT('wall.child'), present: k.present, pill: k.present ? hgT('common.at_facility') : hgT('wall.away'),
      inT: k.inToday || '', outT: k.outToday || '', next: nx ? { t: nx.t, title: nx.title, rel: rel(nx) } : null, rest: done ? [] : P.slice(1, 3).map((x) => ({ t: x.t, title: x.title })),
      done, note: done ? hgT('wall.all_done_for_today') : !P.length ? hgT('wall.no_activities_planned') : '' }; },
  kidPill(v, cls) { return `<span class="${cls}${v.present ? ' on' : ''}"><i aria-hidden="true"></i>${H.esc(v.pill)}</span>`; },
  kidHtml(c, h) { const K = typeof HGLiveKid !== 'undefined' && h ? HGLiveKid.kids(h) : [], det = K.length > 0, nm = K.map((k) => k.name).filter(Boolean).join(', '), dt = nm ? hgT('wall.detected_names', { names: nm }) : hgT('wall.detected');
    const sub = !det ? hgT('wall.not_detected') : c.lk ? hgT('wall.kid_on_hint', { detected: dt }) : hgT('wall.kid_off_hint', { detected: dt });
    return `<button type="button" class="wl-sw wl-lk" role="switch" data-hge="wl-lk" aria-checked="${det && c.lk}" ${det ? '' : 'disabled aria-disabled="true"'}><span>${hgT('wall.livekid_child')}<small>${H.esc(sub)}</small></span><i aria-hidden="true"></i></button>`; },
  kid() { const el = this.el, h = this.hass, box = el && el.querySelector('.nw-k'); if (!box) return;
    const K = this.kidList(h);
    if (!K.length) { box.hidden = true; return; }
    const C = ['#7EE0A8', '#7AB8FF', '#FFD36E', '#D59BFF', '#FF9F6E'];
    const one = (k) => { const v = this.kidView(h, k), L = v.next ? [Object.assign({ nx: 1 }, v.next), ...v.rest] : [];
      const li = L.map((x, i) => `<li${x.nx ? ' class="nx"' : ''} style="--c:${C[i % C.length]}"><span class="nw-et">${H.esc(x.t)}${x.nx && x.rel ? `<em>${H.esc(x.rel)}</em>` : ''}</span><span class="nw-en" title="${H.esc(x.title)}">${H.esc(x.title)}</span></li>`).join('');
      return `<h5><b>${H.esc(v.name)}</b>${this.kidPill(v, 'nw-kst')}</h5>
        <div class="nw-kt"><div><i>${H.esc(hgT('common.check_in'))}</i><b class="${v.inT ? '' : 'mu'}">${H.esc(v.inT || '--:--')}</b></div><div><i>${H.esc(hgT('common.check_out'))}</i><b class="${v.outT ? '' : 'mu'}">${H.esc(v.outT || '--:--')}</b></div></div>
        ${li ? `<ul>${li}</ul>` : `<span class="nw-kn">${H.esc(v.note)}</span>`}`; };
    const html = K.map(one).join('<div class="nw-ks"></div>');
    if (box.dataset.k !== html) { box.dataset.k = html; box.innerHTML = html; } box.hidden = false; },
  /* dwie warstwy zdjęcia: płynne przenikanie (pokaz slajdów co 45 s) */
  photos(rm) { const L = [...this.el.querySelectorAll('.nw-bg')], im = this.imgs(); let i = Math.floor(Math.random() * im.length), f = 0;
    const put = () => { const t = L[f]; t.style.backgroundImage = im[i % im.length]; t.classList.add('on'); L[1 - f].classList.remove('on'); f = 1 - f; i++; };
    put();
    if (im.length > 1 && !rm) this._sl = setInterval(put, 45000); },
  /* ochrona przed wypaleniem: zegar co minutę lekko zmienia położenie */
  drift(rm) { const g = this.el.querySelector('.nw-g'), mv = () => { const v = Math.min(innerWidth, innerHeight) * 0.025; g.style.setProperty('--nw-x', ((Math.random() * 2 - 1) * v).toFixed(0) + 'px'); g.style.setProperty('--nw-y', ((Math.random() * 2 - 1) * v).toFixed(0) + 'px'); };
    mv(); this._dr = setInterval(mv, 60000); },
  wake(why) { if (!this.active || !this.el) return; if (this.locked && why !== 'pin' && why !== 'off') return; const el = this.el; this.locked = false; clearTimeout(this._lk); clearTimeout(this._pt); clearTimeout(this._hv); if (typeof HGWallQA !== 'undefined') HGWallQA.close(this); this.active = false; this.el = null; this.last = Date.now(); this._ms = undefined;
    clearTimeout(this._ck); clearTimeout(this._bdq); clearTimeout(this._glq); this._glq = null; clearTimeout(this._ghT); this._gsh = null; this._ghold = false; clearInterval(this._sl); clearInterval(this._dr); if (this._ro) { this._ro.disconnect(); this._ro = null; } try { if (this._wl) this._wl.release(); } catch (e) { /* bez znaczenia */ } this._wl = null;
    el.classList.remove('in'); el.classList.add('out'); el.style.pointerEvents = 'auto';   /* nakładka zostaje na czas wygaszenia: dotknięcie nie „przebija” się do kafla pod spodem */
    setTimeout(() => { try { el.hidePopover(); } catch (e) { /* bez Popover API */ } el.remove(); }, why === 'pin' ? 700 : 450);
    const f = this._foc; this._foc = null; try { if (f && f.isConnected && f.focus) f.focus({ preventScroll: true }); } catch (e) { /* bez znaczenia */ }
    const pg = this.page; if (window.HGVLock && pg && pg.isConnected) HGVLock.guard(pg);
    this.arm(); },
  hide() { if (this.active) { this.flag(false); this.wake('off'); } },
  /* ---- UI: sekcja w arkuszu Wygląd (tylko admin, jak edycja układu) ---- */
  admin(p) { const h = p && p._hass; return !!(h && h.user && h.user.is_admin); },
  fmt(s) { return s < 60 ? s + ' s' : Math.round(s / 60) + ' min'; },
  sensors(h) { const R = Object.keys((h && h.states) || {}).filter((e) => e.startsWith('binary_sensor.')), pri = (e) => (['motion', 'occupancy', 'presence'].includes((h.states[e].attributes || {}).device_class) ? 0 : 1), nm = (e) => (h.states[e].attributes || {}).friendly_name || e;
    /* tylko czujniki ruchu, zajętości i obecności (przy tysiącach binary_sensor lista była ogromna); gdy takich nie ma, wszystkie binary_sensor */
    const M = R.filter((e) => !pri(e)), L = M.length ? M : R;
    return L.sort((a, b) => nm(a).localeCompare(nm(b), HG_LOC())).map((e) => [e, nm(e)]); },
  html(p) { if (!this.admin(p)) return ''; const c = this.get(true), h = p._hass, dv = Math.round(c.dim * 100), idles = this.IDLES.includes(c.idle) ? this.IDLES : [...this.IDLES, c.idle].sort((a, b) => a - b);
    const sens = this.sensors(h);
    const BD = this.bdHtml ? this.bdHtml(c, h) : { top: '', board: '' }, xk = this.xs ? this.xs(true) : '', pic = !(this.glass && this.glass(true)) && (!xk || this.xsPic(xk));   /* zdjęcie jest tłem zegara na zdjęciu, tablicy i zegara analogowego */
    const body = !c.on ? '' : `
      ${BD.top}${BD.board}
      <div class="wl-f" role="group" aria-labelledby="wl-i"><span id="wl-i">${hgT('wall.start_after_inactivity')}</span><div class="wl-seg six" style="--n:${idles.length}">${idles.map((s) => `<button type="button" data-hge="wl-idle" data-v="${s}" aria-pressed="${c.idle === s}">${this.fmt(s)}</button>`).join('')}</div></div>
      <div class="wl-f"><span>${hgT('wall.dimming')}<em class="wl-dv">${H.pct(dv)}</em></span><input class="lk-rg" type="range" min="0" max="90" step="5" name="wl-dim" value="${Math.round(dv / 5) * 5}" style="--v:${dv / 0.9}%" aria-label="${hgT('wall.screensaver_dimming')}"></div>
      ${this.nightHtml(c)}
      ${this.homeHtml(c)}
      ${pic ? `<div class="wl-f" role="group" aria-labelledby="wl-s"><span id="wl-s">${hgT('wall.photo')}</span><div class="wl-seg" style="--n:3">${this.SRCS.map(([k, t]) => `<button type="button" data-hge="wl-src" data-v="${k}" aria-pressed="${c.src === k}">${t}</button>`).join('')}</div>
        ${c.src === 'url' ? `<span class="hs-s lk-url">${H.icon('mdi:link-variant')}<input class="hs-in" name="wl-url" placeholder="${hgT('wall.image_url_hint')}" value="${H.esc(c.url)}" autocomplete="off" aria-label="${hgT('wall.screensaver_image_url')}"></span>` : ''}</div>` : ''}
      <div class="wl-f" role="group" aria-labelledby="wl-ms"><span id="wl-ms">${hgT('wall.motion_sensor_wake')}</span>${this.pk('sens', c.sensors.length ? c.sensors.map((e) => ({ k: e, l: (h.states[e] && H.name(h, e, e)) || e, s: e })) : [{ k: '', l: hgT('wall.none_touch_only'), ic: 'mdi:gesture-tap', fix: true }],
        sens.filter(([e]) => !c.sensors.includes(e)).map(([e, n]) => ({ k: e, l: n, s: e })), { add: c.sensors.length ? hgT('common.add') : hgT('wall.choose_sensor'), ic: 'mdi:motion-sensor' })}</div>
      ${this.ckHtml ? this.ckHtml(c) : ''}
      ${this.kidHtml(c, h)}
      ${typeof HGWallQA !== 'undefined' ? HGWallQA.html(p) : ''}
      <button type="button" class="wl-tb" data-hge="wl-test">${H.icon('mdi:play-circle-outline')}<span>${hgT('wall.preview_screensaver')}</span></button>${typeof HGDeviceCmd !== 'undefined' ? HGDeviceCmd.html(p) : ''}`;
    return `<section class="lk-g wl" data-tab="wall" data-pg="wall" aria-labelledby="wl-h"><style>${HG_WALL_CSS}${typeof HG_WB_CSS !== 'undefined' ? HG_WB_CSS : ''}</style><h4 id="wl-h">${H.icon('mdi:tablet-dashboard')}${hgT('wall.wall_tablet_mode')}</h4>
      <small class="lk-hn">${hgT('wall.intro')} ${HGL.mode === 'shared' ? hgT('wall.applies_shared') : hgT('wall.applies_user')}</small>
      <button type="button" class="wl-sw" role="switch" data-hge="wl-on" aria-checked="${c.on}"><span>${hgT('wall.screensaver_switch')}<small>${c.on ? hgT('common.on_masc') : hgT('common.off_masc')}</small></span><i aria-hidden="true"></i></button>${c.on ? this.hereHtml() : ''}${body}</section>
      <section class="lk-g wl" data-tab="wall" data-pg="security" aria-labelledby="wls-h"><h4 id="wls-h">${H.icon('mdi:shield-lock-outline')}${hgT('settings.pin_and_locks')}</h4><small class="lk-hn">${hgT('settings.pin_and_locks_hint')}</small>
      ${c.on ? this.lockHtml(c) : `<small class="wl-warn">${hgT('settings.pin_needs_screensaver')}</small>`}${window.HGVLock ? HGVLock.html(HGVLock.views()) : ''}</section>`; },
  /* blok „Nocą”: przełącznik, tryb (zachód/wschód lub godziny), styl nocny i przyciemnienie nocne */
  nightHtml(c) { const t = c.nt, dv = Math.round(t.dim * 100), seg = (a, list, cur) => `<div class="wl-seg" style="--n:${list.length}">${list.map(([k, n]) => `<button type="button" data-hge="${a}" data-v="${k}" aria-pressed="${cur === k}">${n}</button>`).join('')}</div>`;
    const body = !t.on ? '' : `
      <div class="wl-f" role="group" aria-labelledby="wl-ntm"><span id="wl-ntm">${hgT('wall.night_schedule')}</span>${seg('wl-nt-mode', [['sun', hgT('wall.night_sun')], ['hours', hgT('wall.night_hours')]], t.mode)}</div>
      ${t.mode === 'hours' ? `<div class="wl-f"><span>${hgT('wall.night_from')} / ${hgT('wall.night_to')}</span><div class="wl-pin"><span class="hs-s"><input class="hs-in" type="time" name="wl-nt-from" value="${H.esc(t.from)}" aria-label="${hgT('wall.night_from')}"></span><span class="hs-s"><input class="hs-in" type="time" name="wl-nt-to" value="${H.esc(t.to)}" aria-label="${hgT('wall.night_to')}"></span></div></div>` : ''}
      <div class="wl-f" role="group" aria-labelledby="wl-nts"><span id="wl-nts">${hgT('wall.night_style')}</span><div class="wl-seg" style="--n:${this.XS.length}">${this.XS.map(([k, n]) => `<button type="button" data-hge="wl-nt-style" data-v="${k}" aria-pressed="${t.style === k}">${n}</button>`).join('')}</div></div>
      <div class="wl-f"><span>${hgT('wall.night_dimming')}<em class="wl-ntv">${H.pct(dv)}</em></span><input class="lk-rg" type="range" min="0" max="90" step="5" name="wl-nt-dim" value="${Math.round(dv / 5) * 5}" style="--v:${dv / 0.9}%" aria-label="${hgT('wall.night_dimming')}"></div>`;
    return `<button type="button" class="wl-sw" role="switch" data-hge="wl-nt-on" aria-checked="${t.on}"><span>${hgT('wall.night_schedule')}<small>${t.on && t.mode === 'sun' ? hgT('wall.night_sun') : ''}</small></span><i aria-hidden="true"></i></button>${body}`; },
  homeHtml(c) { const L = window.HGVLock ? HGVLock.views(true) : [];
    return `<label class="wl-f"><span>${hgT('wall.wake_view')}</span><select name="wl-home"><option value="">${hgT('wall.wake_view_last')}</option>${L.map(([k, n]) => `<option value="${H.esc(k)}"${k === c.home ? ' selected' : ''}>${H.esc(n)}</option>`).join('')}</select><small class="lk-hn">${hgT('wall.wake_view_hint')}</small></label>`; },
  hereHtml() { const v = this.here();
    return `<button type="button" class="wl-sw" role="switch" data-hge="wl-here" aria-checked="${v}"><span>${hgT('wall.on_this_device')}<small>${v ? hgT('wall.on_this_device_on') : hgT('wall.on_this_device_off')}</small></span><i aria-hidden="true"></i></button>`; },
  lockHtml(c) { const L = (s) => (s ? this.fmt(s) : hgT('wall.at_once'));
    const sw = `<button type="button" class="wl-sw" role="switch" data-hge="wl-lock" aria-checked="${c.lock}"><span>${hgT('wall.pin_lock')}<b class="wl-beta">${hgT('wall.beta')}</b><small>${c.lock ? (c.pinH ? hgT('wall.pin_lock_on_hint') : hgT('wall.pin_lock_needs_pin')) : hgT('common.off_fem')}</small></span><i aria-hidden="true"></i></button>`;
    if (!c.lock) return sw;
    return `${sw}
      <div class="wl-f"><span>${c.pinH ? hgT('wall.change_pin_digits') : hgT('wall.pin_digits')}${c.pinH ? `<em class="wl-ok">${H.icon('mdi:check-circle')}${hgT('wall.pin_set')}</em>` : ''}</span>
        <div class="wl-pin"><span class="hs-s">${H.icon('mdi:dialpad')}<input class="hs-in" name="wl-pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="new-password" placeholder="••••" aria-label="${hgT('wall.new_pin')}"></span><button type="button" class="wl-tb" data-hge="wl-pin">${H.icon('mdi:content-save-outline')}<span>${hgT('common.save')}</span></button></div></div>
      <div class="wl-f" role="group" aria-labelledby="wl-la"><span id="wl-la">${hgT('wall.lock_after_screensaver')}</span><div class="wl-seg" style="--n:${this.LOCKS.length}">${this.LOCKS.map((s) => `<button type="button" data-hge="wl-lockafter" data-v="${s}" aria-pressed="${c.lockAfter === s}">${L(s)}</button>`).join('')}</div></div>
      <small class="wl-warn">${hgT('wall.pin_lock_note')}</small>`; },
  savePin(p, S) { const i = S.querySelector('[name=wl-pin]'), v = i ? i.value.trim() : '';
    if (!/^[0-9]{4,8}$/.test(v)) return p._eToast(hgT('wall.pin_invalid'));
    this.set({ pinH: this.hash(v), pinN: v.length }); p._eToast(hgT('wall.pin_saved')); return p._eLook(); },
  wire(p, S) { if (!this.admin(p)) return;
    for (const pi of S.querySelectorAll('[name=wl-pin]')) { pi.addEventListener('input', () => { pi.value = pi.value.replace(/[^0-9]/g, '').slice(0, 8); }); pi.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.savePin(p, pi.closest('.wl-pin') || S); } }); }
    const rg = S.querySelector('[name=wl-dim]'); if (rg) rg.addEventListener('input', () => { rg.style.setProperty('--v', rg.value / 0.9 + '%'); S.querySelector('.wl-dv').textContent = H.pct(rg.value); this.set({ dim: rg.value / 100 }); });
    const nr = S.querySelector('[name=wl-nt-dim]'); if (nr) nr.addEventListener('input', () => { nr.style.setProperty('--v', nr.value / 0.9 + '%'); const e = S.querySelector('.wl-ntv'); if (e) e.textContent = H.pct(nr.value); this.set({ nt: Object.assign({}, this.ntGet(), { dim: nr.value / 100 }) }); });
    for (const k of ['from', 'to']) { const ti = S.querySelector('[name=wl-nt-' + k + ']'); if (ti) ti.addEventListener('change', () => { if (/^([01]\d|2[0-3]):[0-5]\d$/.test(ti.value)) this.set({ nt: Object.assign({}, this.ntGet(), { [k]: ti.value }) }); }); }
    if (this.pkWire) this.pkWire(p, S);
    if (this.glWire) this.glWire(p, S);
    if (typeof HGDeviceCmd !== 'undefined') HGDeviceCmd.wire(p, S);
    if (typeof HGWallQA !== 'undefined') HGWallQA.wire(p, S);
    if (this.ckWire) this.ckWire(p, S);
    const hv = S.querySelector('[name=wl-home]'); if (hv) hv.addEventListener('change', () => this.set({ home: hv.value }));
    const u = S.querySelector('[name=wl-url]'); if (u) u.addEventListener('change', () => { const v = u.value.trim();
      if (v && !/^(\/|https?:\/\/)/.test(v)) return p._eToast(hgT('wall.image_url_invalid'));
      this.set({ url: v }); }); },
  act(p, b, a) { if (!this.admin(p)) return;
    if (typeof HGWallQA !== 'undefined' && HGWallQA.act(p, b, a)) return;
    if (this.glAct && this.glAct(p, b, a)) return;
    if (a.startsWith('wl-ck-') && this.ckAct && this.ckAct(p, b, a)) return;
    if (this.bdAct && this.bdAct(p, b, a)) return;
    if (a === 'wl-on') { this.last = Date.now(); const on = !this.get().on; if (on) this.here(true); this.set({ on }); return p._eLook(); }   /* włączenie tutaj = włączony też na tym urządzeniu */
    /* blokada widoku: akcja musi zaczynać się od wl-, bo tylko takie trafiają tutaj z arkusza (beta.1: vl-t nie docierało nigdzie) */
    if (a === 'wl-vlock') { if (!window.HGVLock) return; if (!HGVLock.pinH()) { p._eToast(hgT('vlock.needs_pin')); const i = (b.closest('section') || p._eSheetEl).querySelector('.vl-pin [name=wl-pin]'); if (i) i.focus(); return; }
      HGVLock.toggle(b.dataset.v); return p._eLook(); }
    if (a === 'wl-nt-on') { this.set({ nt: Object.assign({}, this.ntGet(), { on: !this.ntGet().on }) }); return p._eLook(); }
    if (a === 'wl-nt-mode') { this.set({ nt: Object.assign({}, this.ntGet(), { mode: b.dataset.v === 'hours' ? 'hours' : 'sun' }) }); return p._eLook(); }
    if (a === 'wl-nt-style') { this.set({ nt: Object.assign({}, this.ntGet(), { style: b.dataset.v }) }); return p._eLook(); }
    if (a === 'wl-here') { this.last = Date.now(); const v = !this.here(); this.here(v); if (!v) this.flag(false); this.sync(); return p._eLook(); }
    if (a === 'wl-idle') { this.last = Date.now(); this.set({ idle: Number(b.dataset.v) }); return p._eLook(); }
    if (a === 'wl-lk') { if (b.disabled) return; this.set({ lk: !this.get().lk }); return p._eLook(); }
    if (a === 'wl-src') { this.set({ src: b.dataset.v }); return p._eLook(); }
    if (a === 'wl-lock') { this.set({ lock: !this.get().lock }); if (!this.get().lock) this.flag(false); return p._eLook(); }
    if (a === 'wl-lockafter') { this.set({ lockAfter: Number(b.dataset.v) }); return p._eLook(); }
    if (a === 'wl-pin') return this.savePin(p, b.closest('.wl-pin') || b.closest('section') || p._eSheetEl);
    if (a === 'wl-test') { this.hass = this.hass || p._hass; this.page = this.page || p; this.show(true); return; }
    if (a === 'wl-cmdnav' && typeof HGDeviceCmd !== 'undefined') return HGDeviceCmd.act(p, b, a); },
});
window.HGWall = HGWall;
