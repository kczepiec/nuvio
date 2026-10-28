/* ===== Wygaszacze 2.16: Zegar analogowy (szklana tarcza na zdjęciu), Zegar klapkowy, Zorza (płynące światło w kolorze akcentu) i Nocny (przygaszony zegar na czerni).
   Ustawienie: HGL.data.wall.style = 'analog' | 'flip' | 'aurora' | 'night'; reszta (bezczynność, przyciemnienie, czujnik, PIN, pogoda z wxE tablicy) wspólna z innymi stylami.
   Każdy styl to jedna powłoka (xsShell) i jedno rysowanie (xsDraw, co minutę i po zmianie stanów HA), więc ten sam kod rysuje nakładkę i kafel w galerii.
   Kolory przez K(): tokenizer motywu ich nie zmienia (nakładka jest zawsze ciemna). */
const HG_WX_SS = `
.nx{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:5vmin; box-sizing:border-box; text-align:center; transition:filter .5s ease, opacity .3s ease; }
.nx::after{ content:''; position:absolute; inset:0; background:${K(0,0,0,1)}; opacity:calc(var(--nw-dim, 0) * .6); pointer-events:none; z-index:3; transition:opacity 1s ease; }
.nx-a::after{ display:none; }   /* zegar na zdjęciu przyciemnia samo zdjęcie (.nw-sh) */
.nx-in{ position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:clamp(12px, 2.6vmin, 30px); transition:transform 5s cubic-bezier(.4,0,.2,1); transform:translate(var(--nw-x, 0), var(--nw-y, 0)); }
.nx-dt{ margin:0; font-size:clamp(16px, 3vmin, 30px); font-weight:500; letter-spacing:.01em; opacity:.9; } .nx-dt::first-letter{ text-transform:uppercase; }
.nx-wx{ display:inline-flex; align-items:center; gap:clamp(6px, 1.2vmin, 12px); font-size:clamp(14px, 2.2vmin, 21px); font-weight:500; opacity:.9; }
.nx-wx[hidden]{ display:none; } .nx-wx img{ width:clamp(38px, 5.6vmin, 56px); height:clamp(38px, 5.6vmin, 56px); margin:-10px -4px; }
.nx-wx b{ font-size:1.45em; font-weight:300; letter-spacing:-.03em; font-variant-numeric:tabular-nums; }
.nx-t{ font-variant-numeric:tabular-nums; line-height:.9; white-space:nowrap; } .nx-t small{ font-size:.22em; font-weight:500; letter-spacing:.04em; margin-left:.3em; vertical-align:.25em; opacity:.7; }
/* Zegar analogowy: szklana tarcza nad zdjęciem, wskazówka sekund w kolorze akcentu */
.nx-face{ position:relative; width:min(58vmin, 560px); aspect-ratio:1; border-radius:50%;
  background:radial-gradient(circle at 30% 22%, ${K(255,255,255,.24)}, ${K(255,255,255,.07)} 58%, ${K(255,255,255,.04)});
  -webkit-backdrop-filter:var(--hg-bfo, blur(26px) saturate(160%)); backdrop-filter:var(--hg-bfo, blur(26px) saturate(160%));
  box-shadow:inset 0 1px 0 ${K(255,255,255,.55)}, inset 0 0 0 1px ${K(255,255,255,.22)}, 0 30px 80px ${K(0,0,0,.38)}; }
:root[data-hg-blur=off] .nx-face{ background:${K(24,27,33,.82)}; }
.nx-face::before, .nx-face::after{ content:''; position:absolute; inset:6%; border-radius:50%; }
.nx-face::before{ background:repeating-conic-gradient(from -.4deg, ${K(255,255,255,.5)} 0 .8deg, transparent .8deg 6deg);
  -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3.5%), ${K(0,0,0,1)} calc(100% - 3.4%)); mask:radial-gradient(farthest-side, transparent calc(100% - 3.5%), ${K(0,0,0,1)} calc(100% - 3.4%)); }
.nx-face::after{ background:repeating-conic-gradient(from -1.2deg, ${K(255,255,255,.95)} 0 2.4deg, transparent 2.4deg 30deg);
  -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 9%), ${K(0,0,0,1)} calc(100% - 8.9%)); mask:radial-gradient(farthest-side, transparent calc(100% - 9%), ${K(0,0,0,1)} calc(100% - 8.9%)); }
.nx-hd{ position:absolute; left:50%; bottom:50%; z-index:1; transform-origin:50% 100%; border-radius:999px; background:${K(255,255,255,1)}; box-shadow:0 2px 10px ${K(0,0,0,.35)};
  transform:translateX(-50%) rotate(var(--r, 0deg)); transition:transform .8s cubic-bezier(.3,1.35,.5,1); }
.nx-hh{ width:2.2%; height:25%; --r:var(--rh); } .nx-mm{ width:1.4%; height:37%; --r:var(--rm); }
.nx-ss{ width:.6%; height:44%; background:var(--hg-accent); box-shadow:0 0 12px var(--hg-accent-glow, transparent); transition:none;
  transform:translateX(-50%) rotate(calc(var(--sd, 0) * 1deg)); animation:var(--hg-loop, nxsec 60s linear infinite); }
@keyframes nxsec{ from{ transform:translateX(-50%) rotate(calc(var(--sd, 0) * 1deg)); } to{ transform:translateX(-50%) rotate(calc(var(--sd, 0) * 1deg + 360deg)); } }
.nx-cap{ position:absolute; left:50%; top:50%; z-index:2; width:4.2%; aspect-ratio:1; border-radius:50%; transform:translate(-50%, -50%); background:${K(255,255,255,1)}; box-shadow:0 0 0 2px var(--hg-accent), 0 2px 8px ${K(0,0,0,.4)}; }
:root[data-hg-eco] .nx-ss{ display:none; }
.nx-a .nx-dt, .nx-a .nx-wx{ text-shadow:0 1px 3px ${K(0,0,0,.55)}, 0 2px 18px ${K(0,0,0,.45)}; }
@media (orientation:landscape){ .nx-a .nx-in{ flex-direction:row; gap:clamp(28px, 7vmin, 90px); } .nx-a .nx-side{ align-items:flex-start; text-align:left; } }
.nx-side{ display:flex; flex-direction:column; align-items:center; gap:clamp(8px, 1.6vmin, 16px); }
.nx-a .nx-dt{ font-size:clamp(20px, 4vmin, 40px); font-weight:400; }
/* Zegar klapkowy: dwie karty, cyfry przewracają się co minutę */
.nx-f{ background:radial-gradient(120% 90% at 50% 40%, ${K(30,32,38,1)}, ${K(6,7,9,1)} 75%); }
.nx-fr{ display:flex; align-items:center; gap:clamp(12px, 2.6vmin, 30px); perspective:1200px; }
.nx-fc{ position:relative; display:grid; place-items:center; width:clamp(140px, 36vmin, 400px); height:clamp(150px, 40vmin, 440px); border-radius:clamp(16px, 3.4vmin, 36px);
  background:linear-gradient(${K(46,48,55,1)}, ${K(33,35,40,1)} 49.6%, ${K(27,28,33,1)} 50.4%, ${K(21,22,26,1)});
  box-shadow:inset 0 1px 0 ${K(255,255,255,.08)}, inset 0 -1px 0 ${K(0,0,0,.4)}, 0 24px 60px ${K(0,0,0,.55)}; }
.nx-fc::before{ content:''; position:absolute; left:0; right:0; top:50%; height:max(2px, .4vmin); transform:translateY(-50%); background:${K(4,5,7,.85)}; z-index:2; }
.nx-fc b{ display:block; font-size:clamp(104px, 27vmin, 300px); font-weight:600; letter-spacing:-.05em; line-height:1; color:${K(238,240,244,1)}; font-variant-numeric:tabular-nums; backface-visibility:hidden; transform-origin:50% 50%; }
.nx-fc b.go{ animation:nxfl .56s cubic-bezier(.45,.05,.55,.95); }
@keyframes nxfl{ 0%{ transform:rotateX(0); } 50%{ transform:rotateX(-90deg); filter:brightness(.5); } 100%{ transform:rotateX(0); } }
.nx-fc small{ position:absolute; left:8%; bottom:7%; font-size:clamp(11px, 2vmin, 20px); font-weight:600; letter-spacing:.08em; opacity:.6; }
.nx-f .nx-dt{ font-size:clamp(13px, 2.3vmin, 22px); font-weight:600; letter-spacing:.2em; text-transform:uppercase; opacity:.6; }
.nx-f .nx-wx{ opacity:.75; }
/* Zorza: trzy plamy światła (akcent, fiolet, turkus) płyną powoli za cienkim zegarem */
.nx-u{ overflow:hidden; background:${K(4,6,12,1)}; }
.nx-u > i{ position:absolute; width:80vmax; height:80vmax; border-radius:50%; opacity:.62; mix-blend-mode:screen; animation:var(--hg-loop, nxau 34s ease-in-out infinite alternate); }
.nx-u > i:nth-child(1){ left:-28vmax; top:-36vmax; background:radial-gradient(closest-side, var(--hg-accent), transparent); }
.nx-u > i:nth-child(2){ right:-30vmax; top:-6vmax; background:radial-gradient(closest-side, ${K(124,92,255,.95)}, transparent); animation-duration:41s; animation-direction:alternate-reverse; }
.nx-u > i:nth-child(3){ left:4vmax; bottom:-52vmax; background:radial-gradient(closest-side, ${K(26,188,206,.9)}, transparent); animation-duration:47s; }
@keyframes nxau{ from{ transform:translate3d(0,0,0) scale(1); } 50%{ transform:translate3d(6vmax, 4vmax, 0) scale(1.12); } to{ transform:translate3d(-4vmax, 7vmax, 0) scale(.94); } }
.nx-u .nx-t{ font-size:clamp(100px, 27vmin, 310px); font-weight:200; letter-spacing:-.055em; text-shadow:0 6px 60px ${K(0,0,0,.3)}; }
.nx-u .nx-in{ gap:clamp(8px, 1.8vmin, 20px); }
/* Nocny: przygaszony ciepły zegar na czerni (sypialnia, ekrany OLED), większe przesunięcie co minutę */
.nx-n{ background:${K(0,0,0,1)}; color:${K(255,122,72,1)}; }
.nx-n .nx-t{ font-size:clamp(84px, 21vmin, 230px); font-weight:300; letter-spacing:-.04em; opacity:.62; }
.nx-n .nx-dt{ font-size:clamp(12px, 2vmin, 18px); font-weight:500; letter-spacing:.14em; text-transform:uppercase; opacity:.34; }
.nw.xs .nx-n ~ .nw-h{ color:${K(255,122,72,1)}; opacity:.3; text-shadow:none; animation:none; }
/* PIN nad wygaszaczem: treść rozmyta, pinpad nad wszystkim */
.nw.xs.pin .nx{ filter:blur(28px) saturate(1.1); opacity:.6; }
@media (prefers-reduced-motion:reduce){ .nx-ss, .nx-u > i{ animation:none; } .nx-ss{ display:none; } .nx-in, .nx-hd, .nx{ transition:none; } .nx-fc b.go{ animation:none; } }
`;
Object.assign(HGWall, {
  /* [klucz, nazwa, tło ze zdjęcia] */
  XS: [['analog', hgTLazy('wallx.styles.analog'), true], ['flip', hgTLazy('wallx.styles.flip'), false], ['aurora', hgTLazy('wallx.styles.aurora'), false], ['night', hgTLazy('wallx.styles.night'), false]],
  xs(raw) { const s = this.styleNow(raw); return this.XS.some((x) => x[0] === s) ? s : ''; },
  xsPic(k) { const x = this.XS.find((y) => y[0] === k); return !!(x && x[2]); },
  /* rejestr stylów dodanych w osobnych plikach: xsDef(klucz, nazwa, tło ze zdjęcia, { cls, css, body(), draw(root, T, d, rm), start?(el, rm) }) */
  XSDef: {},
  xsDef(k, name, pic, def) { this.XSDef[k] = def; this.XS.push([k, name, pic]); this.GAL.push([k, name]); },
  xsShell(k) { const bg = this.xsPic(k) ? '<div class="nw-bg" aria-hidden="true"></div><div class="nw-bg" aria-hidden="true"></div><div class="nw-sh" aria-hidden="true"></div>' : '';
    const def = this.XSDef[k]; if (def) return `<style>${HG_WALL_SS}${HG_WX_SS}${def.css || ''}</style>${bg}<div class="nx nx-${def.cls}">${def.body()}</div>
      <p class="nw-h">${H.esc(hgT('common.touch_to_wake'))}</p>`;
    const dt = '<p class="nx-dt"></p>', wx = '<div class="nx-wx" hidden></div>';
    const body = k === 'analog' ? `<div class="nx-face" role="img"><i class="nx-hd nx-hh"></i><i class="nx-hd nx-mm"></i><i class="nx-hd nx-ss"></i><i class="nx-cap"></i></div><div class="nx-side">${dt}${wx}</div>`
      : k === 'flip' ? `<div class="nx-fr"><div class="nx-fc"><b data-p="h"></b><small hidden></small></div><div class="nx-fc"><b data-p="m"></b></div></div>${dt}${wx}`
      : k === 'aurora' ? `<time class="nx-t"></time>${dt}${wx}` : `<time class="nx-t"></time>${dt}`;
    return `<style>${HG_WALL_SS}${HG_WX_SS}</style>${bg}<div class="nx nx-${{ analog: 'a', flip: 'f', aurora: 'u', night: 'n' }[k]}">${k === 'aurora' ? '<i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>' : ''}<div class="nx-in">${body}</div></div>
      <p class="nw-h">${H.esc(hgT('common.touch_to_wake'))}</p>`; },
  xsStart(k, rm) { const el = this.el; el.classList.add('xs'); el.dataset.xs = k;
    const s = new Date(); el.querySelector('.nx').style.setProperty('--sd', ((s.getSeconds() + s.getMilliseconds() / 1000) * 6).toFixed(2));
    if (this.xsPic(k)) this.photos(rm);
    const g = el.querySelector('.nx-in'), mv = () => { const v = Math.min(innerWidth, innerHeight) * (k === 'night' ? 0.07 : 0.02); g.style.setProperty('--nw-x', ((Math.random() * 2 - 1) * v).toFixed(0) + 'px'); g.style.setProperty('--nw-y', ((Math.random() * 2 - 1) * v).toFixed(0) + 'px'); };
    mv(); this._dr = setInterval(mv, 60000); if (this.XSDef[k] && this.XSDef[k].start) this.XSDef[k].start(el, rm); },
  /* godzina w częściach (bez pory dnia), pora dnia osobno: zegar klapkowy ma osobne karty na godziny i minuty */
  xsTime(d) { const p = this.tf().formatToParts(d), v = (t) => (p.find((x) => x.type === t) || {}).value || '';
    return { h: v('hour'), m: v('minute'), ap: v('dayPeriod'), t: p.filter((x) => x.type !== 'dayPeriod').map((x) => x.value).join('').trim() }; },
  xsDraw() { const el = this.el, h = this.hass; if (!el || !el.classList.contains('xs')) return; const k = el.dataset.xs, root = el.querySelector('.nx'); if (!root) return;
    const d = new Date(), T = this.xsTime(d), rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dt = root.querySelector('.nx-dt'); if (dt) dt.textContent = new Intl.DateTimeFormat(HG_LOC(), k === 'flip' || k === 'night' ? { weekday: 'long', day: 'numeric', month: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    if (this.XSDef[k]) this.XSDef[k].draw(root, T, d, rm);
    else if (k === 'analog') { const mins = d.getHours() * 60 + d.getMinutes(), f = root.querySelector('.nx-face');   /* kąt rośnie przez cały dzień: wskazówka nie cofa się o pełny obrót co godzinę */
      root.style.setProperty('--rm', mins * 6 + 'deg'); root.style.setProperty('--rh', mins * 0.5 + 'deg'); f.setAttribute('aria-label', T.t); }
    else if (k === 'flip') { const set = (b, v) => { if (b.textContent === v) return; if (!b.textContent || rm) { b.textContent = v; return; }
        b.classList.remove('go'); void b.offsetWidth; b.classList.add('go'); setTimeout(() => { b.textContent = v; }, 280); setTimeout(() => b.classList.remove('go'), 600); };
      set(root.querySelector('[data-p=h]'), T.h); set(root.querySelector('[data-p=m]'), T.m); const ap = root.querySelector('.nx-fc small'); ap.hidden = !T.ap; ap.textContent = T.ap;
      root.querySelector('.nx-fr').setAttribute('aria-label', T.t); root.querySelector('.nx-fr').setAttribute('role', 'img'); }
    else { const t = root.querySelector('.nx-t'), html = `${H.esc(T.t)}${T.ap ? `<small>${H.esc(T.ap)}</small>` : ''}`; if (t.dataset.k !== html) { t.dataset.k = html; t.innerHTML = html; } }
    this.xsWx(root, h); },
  /* pogoda: encja wybrana dla tablicy (wxE) albo pierwsza dostępna; bez encji pogody wiersz znika */
  xsWx(root, h) { const box = root.querySelector('.nx-wx'); if (!box) return; const id = h && this.wxId ? this.wxId(h, this.bget()) : '', w = id ? h.states[id] : null;
    if (!w || typeof HGWx === 'undefined') { box.hidden = true; return; }
    const sun = h.states['sun.sun'], night = !!sun && sun.state === 'below_horizon', t = parseFloat(w.attributes.temperature);
    const html = `<img alt="" src="${H.esc(HGWx.icon({ icon_base: HG_ASSET + 'nuvio-meteo-', icon_v: '1' }, w.state, night, true))}">${isFinite(t) ? `<b>${H.esc(H.fmt(t, 0))}°</b>` : ''}<span>${H.esc(HGWx.cn(w.state))}</span>`;
    if (box.dataset.k !== html) { box.dataset.k = html; box.innerHTML = html; } box.hidden = false; },
});
/* galeria w ustawieniach: nowe style po Minimal */
HGWall.GAL.push(...HGWall.XS.map(([k, t]) => [k, t]));
