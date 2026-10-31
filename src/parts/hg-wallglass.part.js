/* ===== Wygaszacz „Szkło” (2.8): wariant Minimal (duży zegar, data, pogoda z ikoną 3D, teraz gra, sfera, kula Assist, rodzina).
   Ustawienia w HGL.data.wall: style 'glass', gl = { v ('minimal'; dawne 'carousel' i 'bento' też dają Minimal), bg { c1, c2, c3, orb, orbA, o1, o2, oi, sph, img, night, nd }, top { df, av }, min { h12, cs, pos, date, wx, np },
   fam { on, who[], grey }, hint { on, t }, rm ('auto' | 'on') }. Dane użytkownika HA jak reszta „wall”, więc w eksporcie i imporcie układu bez dodatkowego kodu.
   Zegar, data, napis wybudzania i podpis „Rodzina” to zwykły tekst bez tła (DESIGN.md); 
   Obrazy 3D: nuvio-3d-*.webp w dist (Fluent Emoji 3D, Microsoft, licencja MIT, dist/nuvio-3d-LICENSE.txt). Kolory przez K() i '#' + '…': tokenizer motywu ich nie zmienia. */
const HG_GL_HEX = (s) => '#' + s;
const HG_GL_IMG = ['sun', 'partly', 'cloud', 'rain', 'storm', 'snow', 'fog', 'moon', 'wind'];
const HG_GL_WX = { 'clear-night': 'moon', cloudy: 'cloud', exceptional: 'storm', fog: 'fog', hail: 'snow', lightning: 'storm', 'lightning-rainy': 'storm', partlycloudy: 'partly', pouring: 'rain', rainy: 'rain', snowy: 'snow', 'snowy-rainy': 'snow', sunny: 'sun', windy: 'wind', 'windy-variant': 'wind' };
const HG_GL_SS = `
.ng{ position:absolute; inset:0; overflow:hidden; color:${K(255,255,255,1)}; font-family:'DM Sans','HG DM Sans',system-ui,sans-serif; --u:min(calc(100vw / 1280), calc(100vh / 680)); --rad:24; }
@media (orientation:portrait){ .ng{ --u:min(calc(100vw / 560), calc(100vh / 900)); } }
.ng.pv{ --u:var(--pu, .4px); }
.ng-bg{ position:absolute; inset:0; background:radial-gradient(calc(520 * var(--u)) calc(300 * var(--u)) at 96% 48%, color-mix(in srgb, var(--c2) 70%, ${K(120,130,190,.5)}), transparent 70%),
  radial-gradient(calc(700 * var(--u)) calc(360 * var(--u)) at 4% 104%, var(--c3) 0%, color-mix(in srgb, var(--c3) 70%, transparent) 35%, transparent 75%), linear-gradient(180deg, var(--c1) 0%, color-mix(in srgb, var(--c1) 55%, var(--c2)) 55%, var(--c2) 100%);
  filter:brightness(var(--nd, 1)); transition:filter 2s ease; }
.ng-bg.im{ background:center/cover no-repeat var(--im); } .ng-bg.im::after{ content:''; position:absolute; inset:0; background:${K(6,8,20,.35)}; }
.ng-sp{ position:absolute; right:calc(-160 * var(--u)); top:calc(150 * var(--u)); width:calc(420 * var(--u)); height:calc(420 * var(--u)); border-radius:50%; opacity:var(--oi);
  background:radial-gradient(circle at 30% 38%, color-mix(in srgb, var(--o2) 80%, ${K(255,255,255,.4)}), var(--o2) 45%, color-mix(in srgb, var(--o2) 60%, ${K(30,20,70,1)}) 85%); filter:brightness(var(--nd, 1)); }
.ng-orb{ position:absolute; left:calc(38 * var(--u)); bottom:calc(16 * var(--u)); width:calc(70 * var(--u)); height:calc(70 * var(--u)); border-radius:50%; opacity:calc(.35 + var(--oi) * .65); z-index:2;
  background:radial-gradient(circle at 35% 30%, ${K(255,255,255,.95)}, transparent 42%), conic-gradient(from 0deg, var(--o1), var(--o2), ${K(120,230,255,1)}, var(--o1));
  box-shadow:0 0 calc(30 * var(--u) * var(--oi)) color-mix(in srgb, var(--o1) 60%, transparent), inset 0 0 calc(12 * var(--u)) ${K(255,255,255,.4)}; animation:var(--hg-loop, ngorb 9s linear infinite); }
@keyframes ngorb{ to{ transform:rotate(360deg); } }
.ng-top{ position:absolute; left:0; right:0; top:0; height:calc(124 * var(--u)); pointer-events:none; text-shadow:0 1px 3px ${K(0,0,0,.45)}, 0 2px 18px ${K(0,0,0,.35)}; z-index:1; }
.ng-dt{ position:absolute; left:calc(44 * var(--u)); top:calc(46 * var(--u)); font-size:calc(25 * var(--u)); font-weight:400; letter-spacing:.005em; white-space:nowrap; }
.ng-dt::first-letter{ text-transform:uppercase; }
.ng-av{ display:grid; place-items:center; font-style:normal; font-size:calc(17 * var(--u)); font-weight:600; position:absolute; right:calc(48 * var(--u)); top:calc(42 * var(--u)); width:calc(40 * var(--u)); height:calc(40 * var(--u)); border-radius:50%; background:center/cover ${K(255,255,255,.18)}; box-shadow:0 2px 10px ${K(0,0,0,.3)}; } .ng-av[hidden]{ display:none; }
.ng-fam{ position:absolute; right:calc(48 * var(--u)); bottom:calc(32 * var(--u)); display:flex; align-items:center; gap:calc(24 * var(--u)); font-size:calc(20 * var(--u)); font-weight:500; text-shadow:0 1px 3px ${K(0,0,0,.5)}, 0 2px 14px ${K(0,0,0,.4)}; }
.ng-fam > span{ display:flex; gap:calc(15 * var(--u)); }
.ng-fam i{ width:calc(40 * var(--u)); height:calc(40 * var(--u)); border-radius:50%; background:center/cover ${K(255,255,255,.2)}; box-shadow:0 0 0 calc(2 * var(--u)) ${K(255,255,255,.75)}; display:grid; place-items:center; font-style:normal; font-size:calc(15 * var(--u)); font-weight:600; transition:filter .6s ease; }
.ng-fam i.aw{ filter:grayscale(1) brightness(.7); }
.ng .nw-h{ bottom:calc(10 * var(--u) + env(safe-area-inset-bottom, 0px)); font-size:calc(15 * var(--u)); z-index:1; }
.ng.nh .nw-h{ display:none; }
.ng-st{ position:absolute; inset:0; transition:transform .5s cubic-bezier(.2,.8,.2,1), filter .5s ease; transform-origin:50% 40%; }
.ng.so .ng-st{ transform:scale(.97); filter:brightness(.62); }
.ng-mn{ position:absolute; left:calc(72 * var(--u)); top:50%; transform:translateY(-50%); text-shadow:0 2px 6px ${K(0,0,0,.35)}, 0 4px 40px ${K(0,0,0,.4)}; max-width:calc(100% - 140 * var(--u)); }
.ng-mn.c{ left:50%; transform:translate(-50%, -50%); text-align:center; } .ng-mn.c .ng-mw, .ng-mn.c .ng-mp{ justify-content:center; }
.ng-mt{ font-size:calc(190 * var(--u) * var(--cs, 1)); font-weight:200; letter-spacing:-.04em; line-height:1; font-variant-numeric:tabular-nums; white-space:nowrap; } .ng-mt small{ font-size:.25em; font-weight:400; letter-spacing:0; margin-left:.2em; }
.ng-md{ margin-top:calc(14 * var(--u)); font-size:calc(25 * var(--u) * max(1, var(--cs, 1) * .8)); font-weight:400; opacity:.85; } .ng-md::first-letter{ text-transform:uppercase; }
.ng-mw{ display:flex; align-items:center; gap:calc(16 * var(--u)); margin-top:calc(30 * var(--u)); } .ng-mw img{ width:calc(84 * var(--u)); height:calc(84 * var(--u)); object-fit:contain; filter:drop-shadow(0 6px 16px ${K(0,0,0,.35)}); }
.ng-mw b{ display:block; font-size:calc(46 * var(--u)); font-weight:300; } .ng-mw small{ font-size:calc(17 * var(--u)); opacity:.8; }
.ng-mp{ display:flex; align-items:center; gap:calc(14 * var(--u)); margin-top:calc(26 * var(--u)); } .ng-mp i{ flex:none; width:calc(52 * var(--u)); height:calc(52 * var(--u)); border-radius:calc(14 * var(--u)); background:center/cover ${K(255,255,255,.15)}; box-shadow:0 6px 18px ${K(0,0,0,.35)}; }
/* dziecko: bez karty, jak pogoda: imię ze stanem, godziny cienkimi cyframi jak temperatura, najbliższe zajęcia i kolejne słabszym tekstem */
.ng-mr{ display:flex; flex-wrap:wrap; align-items:flex-start; column-gap:calc(72 * var(--u)); } .ng-mr:empty{ display:none; } .ng-mn.c .ng-mr{ justify-content:center; }
.ng-mk{ margin-top:calc(30 * var(--u)); display:flex; flex-direction:column; gap:calc(12 * var(--u)); }
.ng-kh{ display:flex; align-items:center; gap:calc(14 * var(--u)); } .ng-kh b{ font-size:calc(22 * var(--u)); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:calc(360 * var(--u)); }
.ng-kp{ flex:none; display:inline-flex; align-items:center; gap:calc(8 * var(--u)); padding:calc(5 * var(--u)) calc(13 * var(--u)) calc(5 * var(--u)) calc(11 * var(--u)); border-radius:999px; font-size:calc(15 * var(--u)); font-weight:600; text-shadow:none; background:${K(255,255,255,.16)}; }
.ng-kp i{ width:calc(9 * var(--u)); height:calc(9 * var(--u)); border-radius:50%; background:${K(255,255,255,.6)}; } .ng-kp.on{ background:${K(126,224,168,.26)}; } .ng-kp.on i{ background:${K(126,224,168,1)}; }
.ng-kt{ display:flex; gap:calc(44 * var(--u)); } .ng-kt div{ display:flex; flex-direction:column; gap:calc(2 * var(--u)); }
.ng-kt b{ font-size:calc(46 * var(--u)); font-weight:300; line-height:1.05; letter-spacing:-.02em; font-variant-numeric:tabular-nums; } .ng-kt b.mu{ opacity:.45; } .ng-kt small{ font-size:calc(17 * var(--u)); opacity:.8; }
.ng-kn{ display:flex; align-items:baseline; gap:calc(14 * var(--u)); margin-top:calc(6 * var(--u)); } .ng-kn b{ font-size:calc(20 * var(--u)); font-weight:600; white-space:pre; overflow:hidden; text-overflow:ellipsis; max-width:calc(440 * var(--u)); font-variant-numeric:tabular-nums; }
.ng-kn em{ font-style:normal; font-size:calc(17 * var(--u)); font-weight:600; opacity:.85; white-space:nowrap; } .ng-kr{ font-size:calc(15 * var(--u)); opacity:.62; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:calc(560 * var(--u)); }
.ng-mp b{ display:block; font-size:calc(17 * var(--u)); font-weight:600; max-width:calc(520 * var(--u)); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .ng-mp small{ font-size:calc(14 * var(--u)); opacity:.6; }
@media (orientation:portrait){
  .ng-fam{ right:auto; left:50%; transform:translateX(-50%); bottom:calc(70 * var(--u)); } .ng-mn{ left:calc(36 * var(--u)); top:44%; } .ng-mn.c{ left:50%; }
  .ng-mt{ font-size:calc(170 * var(--u) * var(--cs, 1)); } .ng-dt{ left:calc(28 * var(--u)); } .ng-av{ right:calc(28 * var(--u)); } .ng-orb{ bottom:calc(70 * var(--u)); left:calc(26 * var(--u)); }
}
@media (prefers-reduced-motion:reduce){ .ng-orb, .ng-trk{ animation:none; } .ng-st, .ng-sh, .ng-bar i{ transition:opacity .2s ease; } .ng-sh{ transform:none; opacity:0; pointer-events:none; } .ng.so .ng-sh{ opacity:1; pointer-events:auto; } }
.ng.rm .ng-orb, .ng.rm .ng-trk{ animation:none; } .ng.rm .ng-st, .ng.rm .ng-sh{ transition:opacity .2s ease; } .ng.rm .ng-sh{ transform:none; opacity:0; pointer-events:none; } .ng.rm.so .ng-sh{ opacity:1; pointer-events:auto; }
`;
Object.assign(HGWall, {
  /* ---- ustawienia wariantu „Szkło” (wall.gl), zawsze znormalizowane ---- */
  gget() { const w = (window.__hgL && window.__hgL.data && window.__hgL.data.wall) || {}, g = w.gl && typeof w.gl === 'object' ? w.gl : {}, o = (x) => (x && typeof x === 'object' ? x : {});
    const n = (v, a, b, d) => { v = Number(v); return isFinite(v) ? Math.max(a, Math.min(b, v)) : d; }, col = (v, d) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : d);
    const tx = (v, m, d) => (typeof v === 'string' ? v.replace(/[<>]/g, '').slice(0, m) : d), url = (v) => (typeof v === 'string' && /^(\/|https?:\/\/)/.test(v) && !/[\s"'()<>\\]/.test(v) ? v : '');
    const bg = o(g.bg), tp = o(g.top), mn = o(g.min), fm = o(g.fam), hi = o(g.hint);
    return { v: 'minimal',   /* jedyny wariant; zapisane 'carousel' i 'bento' przechodzą na Minimal */
      bg: { c1: col(bg.c1, HG_GL_HEX('101529')), c2: col(bg.c2, HG_GL_HEX('2a1563')), c3: col(bg.c3, HG_GL_HEX('2d355d')), orb: bg.orb !== false, o1: col(bg.o1, HG_GL_HEX('8a6bff')), o2: col(bg.o2, HG_GL_HEX('4f7dff')), oi: n(bg.oi, 0, 1, 0.7),
        sph: bg.sph !== false, orbA: bg.orbA !== false, img: url(bg.img), night: bg.night !== false, nd: n(bg.nd, 0, 0.8, 0.4) },
      top: { date: tp.date !== false, df: ['long', 'short', 'num'].includes(tp.df) ? tp.df : 'long', av: tp.av !== false },
      min: { h12: ['auto', '24', '12'].includes(mn.h12) ? mn.h12 : 'auto', cs: n(mn.cs, 0.6, 1.4, 1), pos: mn.pos === 'center' ? 'center' : 'left', date: mn.date !== false, wx: mn.wx !== false, np: mn.np !== false },
      fam: { on: fm.on !== false, who: Array.isArray(fm.who) ? fm.who.filter((x) => typeof x === 'string' && /^person\.[a-z0-9_]+$/.test(x)) : [], grey: fm.grey !== false },
      hint: { on: hi.on !== false, t: tx(hi.t, 60, '') }, rm: g.rm === 'on' ? 'on' : 'auto' }; },
  gset(p) { const G = this.gget(), w = (HGL.data && HGL.data.wall) || {}, raw = w.gl && typeof w.gl === 'object' ? w.gl : {};
    const nx = Object.assign({}, raw, { v: G.v }); for (const k of Object.keys(p)) nx[k] = p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]) ? Object.assign({}, G[k], p[k]) : p[k];
    this.set({ gl: nx }); if (this.active && this.el && this.el.classList.contains('gl')) this.gl(true); },
  glass(raw) { return this.styleNow(raw) === 'glass'; },
  gimg(k) { return k && k !== '-' ? (HG_GL_IMG.includes(k) ? HG_ASSET + 'nuvio-3d-' + k + '.webp' : k) : ''; },
  gtf(G) { const l = G.min.h12 !== 'auto' ? G.min.h12 : this.hass && this.hass.locale ? this.hass.locale.time_format : null; return new Intl.DateTimeFormat(HG_LOC(), Object.assign({ hour: '2-digit', minute: '2-digit' }, l === '12' ? { hour12: true } : l === '24' ? { hour12: false } : {})); },
  gdate(G, d) { return new Intl.DateTimeFormat(HG_LOC(), G.top.df === 'num' ? { weekday: 'short', day: '2-digit', month: '2-digit' } : G.top.df === 'short' ? { weekday: 'short', day: 'numeric', month: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' }).format(d || new Date()); },
});
const HG_GL_SS2 = `.ng-dm{ position:absolute; inset:0; background:${K(0,0,0,1)}; opacity:calc(var(--nw-dim, 0) * .55); pointer-events:none; z-index:4; transition:opacity 1s ease; }
.ng .ng-orb{ border:0; padding:0; margin:0; font:inherit; color:inherit; -webkit-appearance:none; appearance:none; outline:none; pointer-events:none; transition:scale .15s ease, filter .15s ease; }
.ng .ng-orb.ia{ pointer-events:auto; cursor:pointer; } .ng .ng-orb.ia:active, .ng .ng-orb.pr{ scale:.88; filter:brightness(1.3) saturate(1.2); } .ng .ng-orb.ia:focus-visible{ outline:2px solid ${K(255,255,255,.9)}; outline-offset:4px; }
.ng-orb{ z-index:6; }
/* PIN nad wygaszaczem: ta sama warstwa co w Zegarze na zdjęciu (rozmyte tło, treść schowana, pinpad osobno nad wszystkim) */
.nw.gl .ng-st{ transition:filter .5s ease, transform .5s ease; }
.nw.gl.pin .ng-st{ filter:blur(28px) saturate(1.15); transform:scale(1.04); }
.nw.gl.pin .ng-orb{ filter:blur(18px); pointer-events:none; } .nw.gl.pin .ng-dm, .nw.gl.pin .nw-sh{ opacity:0 !important; background:none !important; }
.nw.gl .ng-orb{ transition:filter .5s ease; }
.nw.gl.pin .ng-mid, .nw.gl.pin .ng-fam, .nw.gl.pin .ng-top, .nw.gl.pin .nw-h{ opacity:0; pointer-events:none; transition:opacity .3s ease; }
.nw.gl .nw-pp{ z-index:20; }
@media (prefers-reduced-motion:reduce){ .nw.gl .ng-st, .nw.gl .ng-orb{ transition:none; } }
`;
Object.assign(HGWall, {
  glShell() { return `<style>${HG_WALL_SS}${HG_GL_SS}${HG_GL_SS2}</style><div class="ng"><div class="ng-st"><div class="ng-bg" aria-hidden="true"></div><div class="ng-sp" aria-hidden="true"></div>
    <div class="ng-top"><time class="ng-dt"></time><i class="ng-av" aria-hidden="true"></i></div><div class="ng-mid"></div><div class="ng-fam"></div>
    <p class="nw-h"></p></div><div class="ng-dm" aria-hidden="true"></div><button type="button" class="ng-orb" aria-label="${H.esc(hgT('common.open_assist'))}"></button></div>`; },
  glStart() { const el = this.el; el.classList.add('gl'); this._gk = {}; this.gl(true); },
  /* odświeżenie z HA co najwyżej co 2 s; force = od razu */
  gl(force) { const el = this.el, h = this.hass; if (!el || !h || !el.classList.contains('gl')) return;
    const now = Date.now(); if (!force && now - (this._glt || 0) < 2000) { if (!this._glq) this._glq = setTimeout(() => { this._glq = null; this.gl(true); }, 2000 - (now - (this._glt || 0))); return; }
    this._glt = now; const G = this.gget(), root = el.querySelector('.ng'); el.style.setProperty('--nw-dim', this.get().dim); this.glRender(root, G, h, {}); },
  glNight(h) { const s = h && h.states['sun.sun']; if (s) return s.state === 'below_horizon'; const hr = new Date().getHours(); return hr >= 22 || hr < 6; },
  glPut(root, sel, html, key) { const n = root.querySelector(sel); if (!n) return null; const k = key || sel; root._gk = root._gk || {}; if (root._gk[k] !== html) { root._gk[k] = html; n.innerHTML = html; } return n; },
  glPeople(h, G) { const S = h.states, L = G.fam.who.length ? G.fam.who : Object.keys(S).filter((e) => e.startsWith('person.')).sort(); return L.filter((e) => S[e]); },
  glRender(root, G, h, o) { const B = G.bg, pv = !!o.pv, rm = G.rm === 'on';
    root.classList.toggle('rm', rm); root.classList.toggle('nh', !G.hint.on || pv); root.classList.toggle('pv', pv);
    root.style.cssText = `--c1:${B.c1};--c2:${B.c2};--c3:${B.c3};--o1:${B.o1};--o2:${B.o2};--oi:${B.oi};--rad:24;--nd:${B.night && this.glNight(h) ? (1 - B.nd).toFixed(2) : 1}${o.pu ? ';--pu:' + o.pu : ''}`;
    const bg = root.querySelector('.ng-bg'); bg.classList.toggle('im', !!B.img); bg.style.setProperty('--im', B.img ? `url("${typeof hgBgFix === 'function' ? hgBgFix(B.img) : B.img}")` : 'none');
    root.querySelector('.ng-sp').hidden = !B.sph || !!B.img; const orb = root.querySelector('.ng-orb'); orb.hidden = !B.orb; orb.classList.toggle('ia', B.orbA && !pv); orb.tabIndex = B.orbA && !pv ? 0 : -1; if (!B.orbA || pv) orb.setAttribute('aria-hidden', 'true'); else orb.removeAttribute('aria-hidden');
    const d = new Date(), dt = root.querySelector('.ng-dt'); dt.hidden = true; dt.textContent = this.gdate(G, d);
    const me = h.user && Object.keys(h.states).find((e) => e.startsWith('person.') && h.states[e].attributes.user_id === h.user.id), pic = me && h.states[me].attributes.entity_picture;
    const av = root.querySelector('.ng-av'); av.hidden = !G.top.av; av.style.backgroundImage = pic ? `url("${pic}")` : ''; av.textContent = pic ? '' : ((h.user && h.user.name) || '?')[0].toUpperCase();
    const P = G.fam.on ? this.glPeople(h, G) : [];
    this.glPut(root, '.ng-fam', P.length ? `${hgT('wallglass.family')}<span>${P.map((e) => { const a = h.states[e].attributes, aw = G.fam.grey && h.states[e].state !== 'home', n = a.friendly_name || e;
      return `<i class="${aw ? 'aw' : ''}" title="${H.esc(n)}"${a.entity_picture ? ` style="background-image:url(&quot;${H.esc(a.entity_picture)}&quot;)"` : ''}>${a.entity_picture ? '' : H.esc((n[0] || '?').toUpperCase())}</i>`; }).join('')}</span>` : '');
    const hi = root.querySelector('.nw-h'); if (!root.closest('.nw.lk')) hi.textContent = G.hint.t || hgT('common.touch_to_wake');
    let mid = '';
    { const tf = this.gtf(G), parts = tf.formatToParts(d), t = parts.filter((x) => x.type !== 'dayPeriod').map((x) => x.value).join('').trim(), ap = (parts.find((x) => x.type === 'dayPeriod') || {}).value;
      const wid = Object.keys(h.states).find((e) => e.startsWith('weather.')), w = wid && h.states[wid];
      const mps = Object.keys(h.states).filter((e) => e.startsWith('media_player.') && h.states[e].state === 'playing' && h.states[e].attributes.media_title), pic = (e) => { const a = h.states[e].attributes; return a.entity_picture_local || a.entity_picture || ''; };
      const mp = mps.find(pic) || mps[0], M = mp && h.states[mp].attributes, art0 = mp ? pic(mp) : '', art = art0 && !/^(https?:|data:|\/)/.test(art0) ? '/' + art0 : art0;   /* okładka: entity_picture (ścieżka HA przez proxy lub pełny adres) */
      mid = `<div class="ng-mn${G.min.pos === 'center' ? ' c' : ''}" style="--cs:${G.min.cs}"><div class="ng-mt">${H.esc(t)}${ap ? `<small>${H.esc(ap)}</small>` : ''}</div>${G.min.date ? `<div class="ng-md">${H.esc(this.gdate(G, d))}</div>` : ''}
        <div class="ng-mr">${G.min.wx && w && H.ok(w) ? `<div class="ng-mw"><img src="${H.esc(this.gimg(HG_GL_WX[w.state] || 'partly'))}" alt=""><div><b>${H.esc(H.fmt(parseFloat(w.attributes.temperature), 0))}°</b><small>${H.esc(typeof HGWx !== 'undefined' && HGWx.cn ? HGWx.cn(w.state) : w.state)}</small></div></div>` : ''}
        ${(this.kidList ? this.kidList(h) : []).map((k) => { const v = this.kidView(h, k), tm = (l, x) => `<div><b class="${x ? '' : 'mu'}">${H.esc(x || '--:--')}</b><small>${H.esc(l)}</small></div>`;
          return `<div class="ng-mk"><div class="ng-kh"><b>${H.esc(v.name)}</b>${this.kidPill(v, 'ng-kp')}</div><div class="ng-kt">${tm(hgT('common.check_in'), v.inT)}${tm(hgT('common.check_out'), v.outT)}</div>
            ${v.next ? `<div class="ng-kn"><b>${H.esc(v.next.t + '  ' + v.next.title)}</b>${v.next.rel ? `<em>${H.esc(v.next.rel)}</em>` : ''}</div>${v.rest.length ? `<small class="ng-kr">${H.esc(hgT('wallglass.then_items', { items: v.rest.map((x) => x.t + ' ' + x.title).join(', ') }))}</small>` : ''}` : `<small class="ng-kr">${H.esc(v.note)}</small>`}</div>`; }).join('')}</div>
        ${G.min.np && M ? `<div class="ng-mp"><i${art ? ` style="background-image:url(&quot;${H.esc(art)}&quot;)"` : ''}>${art ? '' : H.icon('mdi:music-note')}</i><div><b>${H.esc(M.media_title)}</b><small>${H.esc(M.media_artist || H.name(h, mp, ''))}</small></div></div>` : ''}</div>`; }
    this.glPut(root, '.ng-mid', mid); },
  /* dotknięcie w nakładce: true = obsłużone (nie budzi ekranu) */
  glTap(e) { const el = this.el; if (!el || !el.classList.contains('gl')) return false; const t = e.target;
    const ob = t.closest && t.closest('.ng-orb.ia'); if (ob) { ob.classList.add('pr'); const pg = this.page;
      setTimeout(() => { this.wake('touch'); if (window.HGAssistUI) setTimeout(() => HGAssistUI.open(pg && pg.shadowRoot ? pg : null, 'saver'), 80); }, 160); return true; }
    return false; },
});
const HG_GL_CSS = `
.wg-pv{ position:relative; width:100%; aspect-ratio:1280 / 680; border-radius:18px; overflow:hidden; margin:4px 0 2px; box-shadow:0 6px 20px rgba(0,0,0,.18); isolation:isolate; }
@media (orientation:portrait){ .wg-pv{ aspect-ratio:560 / 900; width:min(100%, calc(62vh * 560 / 900)); margin-inline:auto; } }   /* stała szerokość: przy width:auto w kolumnie flex podgląd miał 0 px */
.wg-pv .ng{ pointer-events:none; }
.wg-gal{ display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap:16px; }
@media (max-width:600px){ .wg-gal{ grid-template-columns:minmax(0, 1fr); gap:12px; } }
.wg-gt{ all:unset; cursor:pointer; box-sizing:border-box; display:flex; flex-direction:column; gap:10px; padding:10px; border-radius:20px; background:linear-gradient(160deg, rgba(255,255,255,.1), rgba(255,255,255,.03)); box-shadow:inset 0 0 0 1px rgba(255,255,255,.1), 0 6px 18px rgba(0,0,0,.2); -webkit-backdrop-filter:var(--hg-bfo, blur(10px)); backdrop-filter:var(--hg-bfo, blur(10px)); transition:box-shadow .2s ease, transform .2s ease; min-width:0; }
.wg-gt:hover{ transform:translateY(-1px); } .wg-gt:focus-visible{ outline:2px solid #63d71e; outline-offset:2px; }
.wg-gt[aria-checked=true]{ box-shadow:inset 0 0 0 2px #63d71e, 0 0 0 3px rgba(99,215,30,.18), 0 6px 18px rgba(0,0,0,.2); }
.wg-gp{ position:relative; display:block; width:100%; aspect-ratio:16 / 10; border-radius:12px; overflow:hidden; isolation:isolate; pointer-events:none; background:${K(5,7,11,1)}; }
.wg-gs{ position:absolute; left:0; top:0; transform-origin:0 0; contain:strict; }
.wg-gs .nw{ position:absolute !important; inset:0; z-index:0; opacity:1; } .wg-gs *, .wg-gs *::before, .wg-gs *::after{ animation:none !important; transition:none !important; }   /* stały kadr: wstrzymane animacje wejścia zostawiały elementy niewidoczne (np. kafle tablicy) */
.wg-gl{ display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; padding:0 4px 2px; } .wg-gl ha-icon{ --mdc-icon-size:16px; color:#63d71e; } .wg-pv .ng-orb{ animation:none; }
.wg-vs{ display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; }
.wg-vs button{ all:unset; cursor:pointer; box-sizing:border-box; padding:10px 8px; border-radius:14px; text-align:center; background:var(--hg-surface-2, rgba(127,127,127,.12)); display:flex; flex-direction:column; align-items:center; gap:4px; font-size:13px; font-weight:600; }
.wg-vs button small{ font-weight:400; opacity:.7; font-size:11px; } .wg-vs button[aria-pressed=true]{ box-shadow:inset 0 0 0 2px var(--hg-accent, #6c7cff); }
.wg-h{ margin:14px 0 2px; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; opacity:.6; }
.wg-im{ grid-template-columns:repeat(auto-fill, minmax(52px, 1fr)); }
.wg-im button{ aspect-ratio:1; padding:5px; justify-content:center; font-size:11px; overflow:hidden; } .wg-im img{ width:100%; height:100%; object-fit:contain; } .wg-im button[aria-pressed=true]{ box-shadow:inset 0 0 0 2px var(--hg-accent, #6c7cff); }
.wg-im .bg{ aspect-ratio:16 / 10; padding:0; overflow:hidden; } .wg-im .bg img{ object-fit:cover; }
.wg-cl{ display:flex; flex-wrap:wrap; gap:10px; } .wg-cl label{ display:flex; align-items:center; gap:6px; font-size:13px; }
.wg-row .wl-tb{ margin:0; }
.wg-vs button:focus-visible, .wg-im button:focus-visible{ outline:2px solid var(--hg-accent, #6c7cff); outline-offset:2px; }
.wg-im{ display:grid; grid-template-columns:repeat(auto-fill, minmax(92px, 1fr)); gap:6px; margin-top:6px; }
.wg-im button{ all:unset; cursor:pointer; box-sizing:border-box; border-radius:12px; padding:8px 4px; display:flex; flex-direction:column; align-items:center; gap:4px; font-size:12px; text-align:center; background:var(--hg-surface-2, rgba(127,127,127,.1)); }
.wg-cl input[type=color]{ width:36px; height:30px; padding:0; border:0; border-radius:8px; background:none; cursor:pointer; }
.wg-tl{ display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; } .wg-tl .hs-s, .wg-tl .hs-in{ min-width:0; } .wg-row{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
`;
Object.assign(HGWall, {
  /* ---- arkusz Wygląd > Wygaszacz, wariant „Szkło” ---- */
  glHtml(c, h) { const G = this.gget(), L = (t) => H.esc(t);
    const seg = (path, list, cur) => `<div class="wl-seg" style="--n:${list.length}">${list.map(([k, t]) => `<button type="button" data-hge="wl-g-s" data-v="${H.esc(path + '=' + k)}" aria-pressed="${String(cur) === String(k)}">${L(t)}</button>`).join('')}</div>`;
    const sw = (path, on, t, sub) => `<button type="button" class="wl-sw" role="switch" data-hge="wl-g-b" data-v="${H.esc(path)}" aria-checked="${!!on}"><span>${L(t)}${sub ? `<small>${L(sub)}</small>` : ''}</span><i aria-hidden="true"></i></button>`;
    const rg = (path, v, mi, mx, st, t, fmt) => `<div class="wl-f"><span>${L(t)}<em class="wg-rv">${H.esc(fmt(v))}</em></span><input class="lk-rg" type="range" min="${mi}" max="${mx}" step="${st}" name="wg:${path}" value="${v}" data-fmt="${fmt === this._pc ? 'pc' : fmt === this._px ? 'px' : 'x'}" style="--v:${((v - mi) / (mx - mi)) * 100}%" aria-label="${L(t)}"></div>`;
    let s = `<div class="wl-f"><span>${L(hgT('wallglass.live_preview'))}</span>
      <div class="wg-pv" aria-label="${L(hgT('wallglass.live_preview'))}" role="img">${this.glShell().replace(/^<style>[\s\S]*?<\/style>/, '')}</div></div>`;
    s += `<div class="wg-h">${L(hgT('wallglass.clock'))}</div><div class="wl-f"><span>${L(hgT('wallglass.clock_format'))}</span>${seg('min.h12', [['auto', hgT('wallglass.clock_format_as_in_ha')], ['24', '24 h'], ['12', '12 h']], G.min.h12)}</div>
      ${rg('min.cs', G.min.cs, 0.6, 1.4, 0.1, hgT('wallglass.clock_size'), this._pc)}<div class="wl-f"><span>${L(hgT('wallglass.position'))}</span>${seg('min.pos', [['left', hgT('wallglass.position_left')], ['center', hgT('wallglass.position_centre')]], G.min.pos)}</div>
      ${sw('min.date', G.min.date, hgT('wallglass.show_date'))}${sw('min.wx', G.min.wx, hgT('common.weather'))}${sw('min.np', G.min.np, hgT('wallglass.now_playing'))}`;
    const B = G.bg, gal = (typeof hgBgList === 'function' ? hgBgList() : []).map((x) => [x[0] || HG_ASSET_P + 'nuvio-bg-default-wide.webp', x[1], x[3] || x[0] || HG_ASSET_P + 'nuvio-bg-default-wide.webp']).slice(0, 18);
    s += `<div class="wg-h">${L(hgT('wallglass.background'))}</div><div class="wl-f"><span>${L(hgT('wallglass.background_gradient'))}</span><div class="wg-cl">${[['c1', hgT('wallglass.gradient_top')], ['c2', hgT('wallglass.gradient_bottom')], ['c3', hgT('wallglass.gradient_glow')]].map(([k, t]) => `<label><input type="color" name="wg:bg.${k}" value="${B[k]}">${L(t)}</label>`).join('')}</div></div>
      ${sw('bg.orb', B.orb, hgT('wallglass.assistant_orb'))}${B.orb ? `${sw('bg.orbA', B.orbA, hgT('wallglass.orb_opens_assist'), hgT('wallglass.orb_opens_assist_hint'))}<div class="wl-f"><span>${L(hgT('wallglass.orb_colours'))}</span><div class="wg-cl">${['o1', 'o2'].map((k, i) => `<label><input type="color" name="wg:bg.${k}" value="${B[k]}">${i + 1}</label>`).join('')}</div></div>${rg('bg.oi', B.oi, 0, 1, 0.05, hgT('wallglass.intensity'), this._pc)}` : ''}
      ${sw('bg.sph', B.sph, hgT('wallglass.background_sphere'))}
      <div class="wl-f"><span>${L(hgT('wallglass.own_image'))}</span><div class="wg-im"><button type="button" data-hge="wl-g-s" data-v="bg.img=" aria-pressed="${!B.img}">${L(hgT('wallglass.background_gradient'))}</button>${gal.map(([u, n, th]) => `<button type="button" class="bg" data-hge="wl-g-s" data-v="${H.esc('bg.img=' + u)}" aria-pressed="${B.img === u}" title="${H.esc(n)}"><img src="${H.esc(th)}" alt="${H.esc(n)}" loading="lazy"></button>`).join('')}</div>
        <div class="wg-row" style="margin-top:6px"><button type="button" class="wl-tb" data-hge="wl-g-file" data-v="@bg">${H.icon('mdi:upload')}<span>${L(hgT('wallglass.upload'))}</span></button></div></div>
      ${sw('bg.night', B.night, hgT('wallglass.dimmer_at_night'), hgT('wallglass.after_sunset'))}${B.night ? rg('bg.nd', B.nd, 0, 0.8, 0.05, hgT('wallglass.night_dimming'), this._pc) : ''}`;
    const T = G.top; s += `<div class="wg-h">${L(hgT('wallglass.top_bar'))}</div><div class="wl-f"><span>${L(hgT('wallglass.date_format'))}</span>${seg('top.df', [['long', hgT('wallglass.date_long')], ['short', hgT('wallglass.date_short')], ['num', hgT('wallglass.date_numeric')]], T.df)}</div>
      ${sw('top.av', T.av, hgT('wallglass.avatar'))}`;
    const F = G.fam, P = Object.keys(h.states).filter((e) => e.startsWith('person.')).sort();
    s += `<div class="wg-h">${L(hgT('wallglass.family'))}</div>${sw('fam.on', F.on, hgT('wallglass.show_household'))}${F.on ? `${this.pk('glf', (F.who.length ? F.who : P).map((e) => ({ k: e, l: H.name(h, e, e), s: e, ic: 'mdi:account', fix: !F.who.length })), P.filter((e) => F.who.length && !F.who.includes(e)).map((e) => ({ k: e, l: H.name(h, e, e), s: e, ic: 'mdi:account' })), { add: hgT('wallglass.add_person') })}
      ${F.who.length ? `<button type="button" class="wl-tb" data-hge="wl-g-s" data-v="fam.who=*">${H.icon('mdi:account-multiple')}<span>${L(hgT('wallglass.everyone'))}</span></button>` : `<button type="button" class="wl-tb" data-hge="wl-g-s" data-v="fam.who=+">${H.icon('mdi:account-edit-outline')}<span>${L(hgT('wallglass.choose_people'))}</span></button>`}${sw('fam.grey', F.grey, hgT('wallglass.grey_when_away'))}` : ''}`;
    s += `<div class="wg-h">${L(hgT('wallglass.hint_and_motion'))}</div>${sw('hint.on', G.hint.on, hgT('wallglass.bottom_hint'))}${G.hint.on ? `<span class="hs-s">${H.icon('mdi:format-text')}<input class="hs-in" name="wg:hint.t" value="${H.esc(G.hint.t)}" maxlength="60" placeholder="${L(hgT('common.touch_to_wake'))}" aria-label="${L(hgT('wallglass.hint_text'))}"></span>` : ''}
      <div class="wl-f"><span>${L(hgT('wallglass.motion'))}</span>${seg('rm', [['auto', hgT('wallglass.motion_as_system')], ['on', hgT('wallglass.motion_reduced')]], G.rm)}</div><small class="lk-hn">${L(hgT('wallglass.start_delay_hint'))}</small>
      <input type="file" accept="image/*" name="wg-file" hidden>`;
    return s; },
  /* galeria wygaszaczy (zamiast przełącznika): kafle z żywym podglądem */
  GAL: [['photo', hgTLazy('wallglass.gallery.photo')], ['board', hgTLazy('wallglass.gallery.board')], ['glass:minimal', hgTLazy('wallglass.gallery.minimal')]],
  galHtml(style) { const cur = style === 'glass' ? 'glass:' + this.gget().v : style;
    return `<style>${HG_GL_SS}${HG_GL_SS2}${HG_GL_CSS}</style><div class="wg-gal" role="radiogroup" aria-label="${H.esc(hgT('wallglass.screensavers'))}">${this.GAL.map(([k, t]) => `<button type="button" class="wg-gt" role="radio" data-hge="wl-g-gal" data-v="${k}" aria-checked="${cur === k}">
      <span class="wg-gp" data-gp="${k}"><span class="wg-gs" aria-hidden="true"></span></span><span class="wg-gl">${cur === k ? H.icon('mdi:check-circle') : ''}${H.esc(t)}</span></button>`).join('')}</div>`; },
  /* każdy kafel to prawdziwy wygaszacz w rozmiarze ekranu, pomniejszony transformacją (position:fixed liczy się wtedy względem kafla) */
  galWire(S, h) { const W = innerWidth, Hh = innerHeight, G0 = this.gget(), keep = this.el, d = new Date();
    for (const g of S.querySelectorAll('[data-gp]')) { const k = g.dataset.gp, box = g.querySelector('.wg-gs'), r = g.getBoundingClientRect(); if (!r.width) continue; const sc = Math.min(r.width / W, r.height / Hh);   /* cały ekran w kaflu 16:10, bez przycinania */
      box.style.cssText = `width:${W}px;height:${Hh}px;left:${((r.width - W * sc) / 2).toFixed(1)}px;top:${((r.height - Hh * sc) / 2).toFixed(1)}px;transform:scale(${sc.toFixed(5)})`;
      if (box._k === k && box.firstChild) continue; box._k = k;
      const el = document.createElement('div'); el.className = 'nw in'; el.style.setProperty('--nw-dim', this.get().dim); box.replaceChildren(el);
      try { this.el = el;
        if (k.startsWith('glass')) { el.innerHTML = this.glShell(); el.classList.add('gl'); this.glRender(el.querySelector('.ng'), Object.assign({}, G0, { v: k.slice(6), rm: 'on' }), h, {}); }
        else if (this.XS && this.XS.some((x) => x[0] === k)) { el.innerHTML = this.xsShell(k); el.classList.add('xs'); el.dataset.xs = k; const bg = el.querySelector('.nw-bg'); if (bg) { bg.classList.add('on'); bg.style.backgroundImage = this.imgs()[0]; }
          const q = this.hass; this.hass = h; this.xsDraw(); this.hass = q; }
        else if (k === 'board' && this.bdShell) { el.innerHTML = this.bdShell(); el.classList.add('bd'); this._bdk = {}; const q = this.hass; this.hass = h; this.bd(true); this.hass = q; }
        else { el.innerHTML = `<style>${HG_WALL_SS}</style><div class="nw-bg on" aria-hidden="true"></div><div class="nw-bg" aria-hidden="true"></div><div class="nw-sh" aria-hidden="true"></div><div class="nw-c"><div class="nw-g"><time class="nw-t"></time><div class="nw-d"></div></div></div><div class="nw-r"><div class="nw-p nw-w" hidden></div><div class="nw-p nw-e" hidden></div></div><p class="nw-h">${H.esc(hgT('common.touch_to_wake'))}</p>`;
          el.querySelector('.nw-bg').style.backgroundImage = this.imgs()[0]; const l = h && h.locale ? h.locale.time_format : null;
          el.querySelector('.nw-t').textContent = new Intl.DateTimeFormat(HG_LOC(), Object.assign({ hour: '2-digit', minute: '2-digit' }, l === '12' ? { hour12: true } : l === '24' ? { hour12: false } : {})).format(d);
          el.querySelector('.nw-d').textContent = new Intl.DateTimeFormat(HG_LOC(), { weekday: 'long', day: 'numeric', month: 'long' }).format(d); const q = this.hass; this.hass = h; this.wx(); this.hass = q; } }
      catch (e) { /* podgląd pomocniczy */ } finally { this.el = keep; } } },
  _pc(v) { return H.pct(Math.round(v * 100)); }, _px(v) { return v + ' px'; },
  /* edytor jednej karty */

  gpatch(path, val) { const [a, b, c] = path.split('.'); if (!b) return this.gset({ [a]: val }); const G = this.gget(); if (c != null) { const arr = (G[a][b] || []).slice(); arr[Number(c)] = val; return this.gset({ [a]: { [b]: arr } }); } this.gset({ [a]: { [b]: val } }); },
  glAct(p, b, a) { if (!a.startsWith('wl-g-') && !((a === 'wl-pk-add' || a === 'wl-pk-rm') && /^glf\|/.test(b.dataset.v || ''))) return false;
    const v = b.dataset.v || '', G = this.gget(), h = p._hass; this.hass = this.hass || h;
    if (a === 'wl-pk-add' || a === 'wl-pk-rm') { const id = v.slice(0, 3), k = v.slice(4); this._dd = '';
      { const P = Object.keys(h.states).filter((e) => e.startsWith('person.')).sort(), cur = G.fam.who.length ? G.fam.who : P; this.gpatch('fam.who', a === 'wl-pk-add' ? [...new Set([...cur, k])] : cur.filter((x) => x !== k)); } }
    else if (a === 'wl-g-b') { const [x, y] = v.split('.'); this.gpatch(v, !G[x][y]); }
    else if (a === 'wl-g-s') { const i = v.indexOf('='), path = v.slice(0, i); let val = v.slice(i + 1);
      if (path === 'fam.who') val = val === '+' ? Object.keys(h.states).filter((e) => e.startsWith('person.')).sort() : [];
      this.gpatch(path, val); }
    else if (a === 'wl-g-gal') { const [st, gv] = v.split(':'); this.last = Date.now(); this.set({ style: st }); if (gv) this.gpatch('v', gv); }
    else if (a === 'wl-g-file') { const S = b.closest('section') || p._eSheetEl, f = S && S.querySelector('[name=wg-file]'); if (f) { f.dataset.tg = v; f.click(); } return true; }

    p._eLook(); return true; },
  glUpload(p, f, tg) { const h = p._hass; if (!f || !h || !h.fetchWithAuth) return p._eToast(hgT('wallglass.no_session_cannot_upload'));
    const fd = new FormData(); fd.append('file', f, f.name); p._eToast(hgT('wallglass.uploading'));
    h.fetchWithAuth('/api/image/upload', { method: 'POST', body: fd }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((j) => { const u = `/api/image/serve/${j.id}/original`;
      this.gpatch('bg.img', u); p._eToast(hgT('wallglass.image_saved')); p._eLook(); }, (e) => p._eToast(hgT('wallglass.upload_failed', { error: e }))); },
  /* podglądy rysują się dopiero, gdy mają rozmiar: karta Wygaszacz bywa ukryta (inna zakładka Ustawień) w chwili renderu,
     więc ResizeObserver rysuje je przy pierwszym pokazaniu i przeskalowuje przy zmianie szerokości */
  glWire(p, S) { const h = p._hass; this.hass = this.hass || h; if (S._wgRo) { S._wgRo.disconnect(); S._wgRo = null; }
    const gal = S.querySelector('.wg-gal'), pv = S.querySelector('.wg-pv'); if (!gal && !pv) return;
    let raf = 0; const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (!S.isConnected) { ro.disconnect(); return; } if (gal) this.galWire(S, h); if (pv) draw(); }); }) : null;
    if (ro) { S._wgRo = ro; for (const g of S.querySelectorAll('[data-gp]')) ro.observe(g); if (pv) ro.observe(pv); }
    if (gal) { requestAnimationFrame(() => this.galWire(S, h)); setTimeout(() => this.galWire(S, h), 300); }
    if (!pv) return;
    function draw() { const r = pv.getBoundingClientRect(), port = matchMedia('(orientation: portrait)').matches, root = pv.querySelector('.ng'); if (!root || !r.width) return; root._gk = {};
      HGWall.glRender(root, HGWall.gget(), h, { pv: true, pu: (r.width / (port ? 560 : 1280)).toFixed(4) + 'px' }); }
    draw(); requestAnimationFrame(draw);
    const live = (fn) => { clearTimeout(this._gwt); this._gwt = setTimeout(() => { fn(); draw(); }, 250); };
    for (const i of S.querySelectorAll('input[name^="wg:"]')) { const path = i.name.slice(3);
      if (i.type === 'range') i.addEventListener('input', () => { const mi = +i.min, mx = +i.max, v = +i.value; i.style.setProperty('--v', ((v - mi) / (mx - mi)) * 100 + '%'); const em = i.parentNode.querySelector('.wg-rv'); if (em) em.textContent = i.dataset.fmt === 'pc' ? this._pc(v) : this._px(v); live(() => this.gpatch(path, v)); });
      else if (i.type === 'color') i.addEventListener('input', () => live(() => this.gpatch(path, i.value)));
      else i.addEventListener('change', () => { this.gpatch(path, i.value.trim()); draw(); }); }
    const fi = S.querySelector('[name=wg-file]'); if (fi) fi.addEventListener('change', () => { const f = fi.files && fi.files[0]; fi.value = ''; if (f) this.glUpload(p, f, fi.dataset.tg || '@bg'); }); },
});
