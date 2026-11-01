/* --- oczyszczacz powietrza: duży odczyt PM2.5 z odliczaniem, fale wokół liczby (tempo zależne od trybu), włącznik i tryby z przesuwanym podświetleniem --- */
/* PM2.5 (µg/m³): progi jak w US EPA AQI; kolor fal i etykiety z jakości powietrza */
/* [próg, etykieta (hgTLazy), kolor] */
const HG_AQ_LV = [[12, hgTLazy('cards.purifier.aq_levels.clean'), '#0A84FF'], [35, hgTLazy('cards.purifier.aq_levels.good'), '#2FB36B'], [55, hgTLazy('cards.purifier.aq_levels.moderate'), '#F5A524'], [150, hgTLazy('cards.purifier.aq_levels.poor'), '#FF7A3D'], [Infinity, hgTLazy('cards.purifier.aq_levels.very_poor'), '#FF4D4F']];
const HG_AQ_IC = [[/auto|smart/, 'mdi:weather-windy'], [/sleep|night|silent|quiet/, 'mdi:weather-night'], [/turbo|boost|max|strong|high/, 'mdi:lightning-bolt'], [/fav|heart|custom|manual/, 'mdi:heart-outline'],
  [/low/, 'mdi:fan-speed-1'], [/mid|medium/, 'mdi:fan-speed-2'], [/pet/, 'mdi:paw'], [/allerg|pollen/, 'mdi:flower-pollen-outline']];
/* tryby z nazwą w katalogu: hgTD('cards.purifier.modes.' + tryb) */
const HG_AQ_MODES = ['auto', 'smart', 'sleep', 'night', 'silent', 'quiet', 'turbo', 'boost', 'max', 'favorite', 'manual', 'low', 'medium', 'high', 'on', 'pet', 'allergy'];
class HGPurifierCard extends HGBase {
  static getStubConfig(h) { return { entity: hgStub(h, ['fan'], (s) => (s.attributes.preset_modes || []).length > 0) || hgStub(h, ['fan']) || null, pm: HGPurifierCard.pmFor(h, null) }; }
  /* czujnik PM2.5: z tego samego urządzenia co oczyszczacz (rejestr HA), potem ten sam początek nazwy, na końcu pierwszy w domu.
     Czujnik bez device_class też się liczy, gdy w nazwie ma pm2_5 / pm25 */
  static pmFor(h, fan) { const S = (h && h.states) || {}, R = (h && h.entities) || {}, pm = (e) => /pm_?2_?5/.test(e);
    const L = Object.keys(S).filter((e) => (e.startsWith('sensor.') && (S[e].attributes.device_class === 'pm25' || pm(e))) || e.startsWith('air_quality.'));
    const dev = fan && R[fan] && R[fan].device_id, same = dev ? L.filter((e) => R[e] && R[e].device_id === dev) : [];
    if (same.length) return same.find((e) => S[e].attributes.device_class === 'pm25') || same[0];
    const base = fan ? fan.split('.')[1].replace(/_(fan|purifier|air_purifier)$/, '') : ''; return (base && L.find((e) => e.split('.')[1].startsWith(base))) || L.find((e) => e.startsWith('sensor.') && S[e].attributes.device_class === 'pm25') || L[0] || null; }
  defaults() { return { entity: null, pm: null, name: null, title: hgT('common.air_quality'), modes: null }; }
  /* bez stałej pamięci listy encji: czujnik dobrany automatycznie może się pojawić dopiero po starcie HA */
  ents() { const c = this._config; return [c.entity, c.pm || HGPurifierCard.pmFor(this._hass, c.entity)].filter(Boolean); }
  _changed() { this._entsC = null; return super._changed(); }
  _extraSig() { return this._opt ? JSON.stringify(this._opt) : ''; }
  css() { return HG_NV_CSS + U(`
ha-card.glass{ position:relative; overflow:hidden; display:flex; flex-direction:column; gap:0; padding:18u 18u 12u; min-height:300u; container-type:inline-size; isolation:isolate; }
.hd{ display:flex; align-items:flex-start; justify-content:space-between; gap:10u; position:relative; z-index:2; }
.hd > div{ min-width:0; } .hd small{ display:block; font-size:13px; opacity:.62; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .hd b{ display:block; margin-top:2u; font-size:19px; font-weight:600; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pw{ all:unset; box-sizing:border-box; cursor:pointer; flex:none; display:inline-flex; align-items:center; gap:6u; min-height:36u; padding:0 10u; margin:-4u -8u 0 0; border-radius:999px; font-size:15px; font-weight:600; color:#13A89E; transition:color .3s ease, background .2s ease; }
.pw:hover{ background:color-mix(in srgb, currentColor 10%, transparent); } .pw:focus-visible{ outline:2px solid currentColor; outline-offset:2px; } .pw ha-icon{ --mdc-icon-size:22u; width:22u; height:22u; } .off .pw{ color:inherit; opacity:.5; }
/* środek: liczba, jednostka, etykieta; fale rozchodzą się od środka i znikają przy krawędzi karty */
.mid{ position:relative; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4u; padding:12u 0 16u; z-index:1; }
.rg{ position:absolute; left:50%; top:50%; width:150u; height:150u; margin:-75u 0 0 -75u; pointer-events:none; z-index:-1; }
.rg::before{ content:''; position:absolute; inset:0; border-radius:50%; border:2px solid color-mix(in srgb, var(--aq) 16%, transparent); }
.rg i{ position:absolute; inset:0; border-radius:50%; border:3px solid color-mix(in srgb, var(--aq) 34%, transparent); opacity:0; transform:scale(.7); animation:var(--hg-loop, aqRip var(--sp, 4.5s) cubic-bezier(.25,.6,.4,1) infinite); animation-delay:calc(var(--sp, 4.5s) * var(--k) / -3); }
.rg i:nth-child(1){ --k:0; } .rg i:nth-child(2){ --k:1; } .rg i:nth-child(3){ --k:2; }
.fast .rg i{ border-width:5px; border-color:color-mix(in srgb, var(--aq) 26%, transparent); }
@keyframes aqRip{ 0%{ transform:scale(.7); opacity:0; } 15%{ opacity:1; } 100%{ transform:scale(2.3); opacity:0; } }
.off .rg i{ animation:none; opacity:0; } .off .rg::before{ opacity:.6; }
.nm{ position:relative; display:grid; height:68u; min-width:60u; font-size:68u; line-height:1; font-weight:700; letter-spacing:-.04em; font-variant-numeric:tabular-nums; }
.nm > span{ grid-area:1/1; justify-self:center; transition:color .9s ease; } .nm > span.hi{ color:var(--aq); transition:none; }
.nm > span.in{ animation:aqIn .42s cubic-bezier(.2,.8,.2,1) both; } .nm > span.out{ animation:aqOut .42s cubic-bezier(.4,0,.6,1) both; }
@keyframes aqIn{ from{ opacity:0; transform:translateY(22%); filter:blur(3px); } } @keyframes aqOut{ to{ opacity:0; transform:translateY(-26%); filter:blur(3px); } }
.u2{ font-size:12px; opacity:.6; } .aqb{ margin-top:6u; padding:5u 12u; border-radius:999px; font-size:12px; font-weight:600; color:var(--aq); background:color-mix(in srgb, var(--aq) 12%, transparent); transition:color .6s ease, background .6s ease; }
/* tryby: podświetlenie przesuwa się pod wybrany */
.md{ position:relative; display:grid; grid-template-columns:repeat(var(--n), 1fr); gap:0; z-index:2; }
.md .hl{ position:absolute; left:0; top:0; bottom:0; width:calc(100% / var(--n)); border-radius:16u; background:color-mix(in srgb, #0A84FF 11%, transparent); transform:translateX(calc(var(--i) * 100%)); transition:transform .5s cubic-bezier(.34,1.3,.5,1), opacity .3s ease; }
.md .hl.no{ opacity:0; }
.md button{ all:unset; box-sizing:border-box; position:relative; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5u; min-height:62u; padding:6u 2u; border-radius:16u; font-size:13px; font-weight:500; color:inherit; opacity:.6; transition:color .35s ease, opacity .35s ease; }
.md button ha-icon{ --mdc-icon-size:22u; width:22u; height:22u; transition:transform .35s cubic-bezier(.34,1.5,.5,1); } .md button[aria-pressed=true]{ color:#0A84FF; opacity:1; } .md button[aria-pressed=true] ha-icon{ transform:scale(1.12); }
.md button span{ max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .md button:focus-visible{ outline:2px solid #0A84FF; outline-offset:-2px; }
.off .md button[aria-pressed=true]{ color:inherit; opacity:.6; } .off .md .hl{ opacity:0; }
@container (max-width:240px){ .pw span{ display:none; } .nm{ font-size:54u; height:56u; } .md button span{ display:none; } .md button{ min-height:48u; } }
@media (prefers-reduced-motion:reduce){ .rg i{ animation:none; opacity:0; } .nm > span.in, .nm > span.out{ animation:none; } .nm > span.out{ display:none; } .md .hl{ transition:none; } }
`); }
  _pm() { const c = this._config, h = this._hass, id = c.pm || HGPurifierCard.pmFor(h, c.entity), s = id && h.states[id];
    if (!s) { const f = h.states[c.entity], a = f && f.attributes, x = a && (a.pm25 != null ? a.pm25 : a.pm2_5 != null ? a.pm2_5 : a.aqi); return x != null && isFinite(Number(x)) ? Number(x) : null; }   /* starszy xiaomi_miio: PM2.5 jako atrybut aqi encji fan */
    const v = Number(id.startsWith('air_quality.') && s.attributes.particulate_matter_2_5 != null ? s.attributes.particulate_matter_2_5 : s.state); return isFinite(v) && s.state !== '' ? v : null; }
  _modes(s) { const c = this._config, a = s.attributes, P = Array.isArray(c.modes) && c.modes.length ? c.modes : (a.preset_modes || []);
    if (P.length) return P.slice(0, 4).map((m) => { const k = String(m).toLowerCase(), ic = (HG_AQ_IC.find(([r]) => r.test(k)) || [0, 'mdi:fan'])[1];
      return { k: m, l: HG_AQ_MODES.includes(k) ? hgTD('cards.purifier.modes.' + k, k) : String(m).replace(/_/g, ' '), ic, pct: null }; });
    return [[33, 'low', 'mdi:fan-speed-1'], [66, 'medium', 'mdi:fan-speed-2'], [100, 'turbo', 'mdi:lightning-bolt']].map(([p, mk, ic]) => ({ k: 'p' + p, l: hgTD('cards.purifier.modes.' + mk, mk), ic, pct: p })); }
  _cur(s, M) { const o = this._opt && Date.now() - this._opt.ts < 6000 ? this._opt.k : null; if (o != null) return o; const a = s.attributes;
    if (a.preset_mode != null && M.some((m) => m.k === a.preset_mode)) return a.preset_mode; const p = Number(a.percentage);
    if (M[0] && M[0].pct != null && isFinite(p) && p > 0) return M.reduce((b, m) => (Math.abs(m.pct - p) < Math.abs(b.pct - p) ? m : b)).k; return null; }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity);
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.purifier.choose_an_air_purifier')}</span></ha-card>`;
    const on = s.state === 'on', ok = H.ok(s), M = this._modes(s), cur = this._cur(s, M), i = M.findIndex((m) => m.k === cur), v = this._pm(), lv = HG_AQ_LV.find((x) => v == null || v <= x[0]);
    const k = String(cur || '').toLowerCase(), pct = Number(s.attributes.percentage), fast = /turbo|boost|max|strong|high/.test(k) || (!k && pct >= 80) || (M[i] && M[i].pct >= 100), slow = /sleep|night|silent|quiet/.test(k);
    const sp = fast ? 1.9 : slow ? 7 : 4.2; this._val = v;
    return `<ha-card class="glass ${on ? '' : 'off'} ${ok ? '' : 'un'} ${fast ? 'fast' : ''}" style="--aq:${v == null ? '#0A84FF' : lv[2]};--sp:${sp}s">
      <div class="hd"><div><small>${H.esc(c.name || H.name(h, c.entity))}</small><b>${H.esc(c.title)}</b></div>
        <button class="pw" data-act="pw" role="switch" aria-checked="${on}" ${ok ? '' : 'disabled'} aria-label="${H.esc(hgT('common.power'))}">${H.icon('mdi:power')}<span>${on ? hgT('common.on_short') : hgT('common.off_short')}</span></button></div>
      <div class="mid"><div class="rg" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="nm" data-own role="img" aria-label="${H.esc(v == null ? hgT('cards.purifier.no_pm2_5_reading') : `PM2.5 ${H.fmt(v, 0)} µg/m³`)}"></div>
        <span class="u2">PM2.5 µg/m³</span>${v == null ? '' : `<span class="aqb">${H.esc(String(lv[1]))}</span>`}</div>
      <div class="md" style="--n:${M.length};--i:${Math.max(0, i)}" role="group" aria-label="${H.esc(hgT('common.mode'))}"><span class="hl ${i < 0 ? 'no' : ''}" aria-hidden="true"></span>${M.map((m) => `<button type="button" data-act="mode" data-m="${H.esc(m.k)}" aria-pressed="${on && m.k === cur}" ${ok ? '' : 'disabled'}>${H.icon(m.ic)}<span>${H.esc(m.l)}</span></button>`).join('')}</div></ha-card>`; }
  /* liczba: zmiana o kilka jednostek odlicza po kolei (stara wyjeżdża w górę, nowa wjeżdża od dołu), po dojściu krótko świeci kolorem jakości */
  afterRender() { const el = this.$.querySelector('.nm'); if (!el) return; const v = this._val == null ? null : Math.round(this._val);
    if (this._tgt === v && el.childElementCount) return; this._tgt = v; clearTimeout(this._nt);
    const put = (x, anim, hi) => { const old = [...el.children]; for (const o of old) { if (anim) { o.className = 'out'; setTimeout(() => o.remove(), 450); } else o.remove(); }
      const n = document.createElement('span'); n.textContent = x == null ? '–' : String(x); if (anim) n.className = 'in' + (hi ? ' hi' : ''); el.appendChild(n); return n; };
    const shown = this._shown; if (shown == null || v == null || !el.childElementCount || !this.isConnected || matchMedia('(prefers-reduced-motion: reduce)').matches) { this._shown = v; put(v, shown != null && v != null && shown !== v, false); return; }
    if (shown === v) return; const dir = v > shown ? 1 : -1, steps = Math.min(Math.abs(v - shown), 12), st = Math.abs(v - shown) > 12 ? (v - shown) / 12 : dir;
    let n = 0; const tick = () => { n++; const x = n >= steps ? v : Math.round(shown + st * n); this._shown = x; const s = put(x, true, n >= steps && v < shown);
      if (n < steps) this._nt = setTimeout(tick, 380); else this._nt = setTimeout(() => s.classList.remove('hi'), 1300); };
    tick(); }
  disconnectedCallback() { super.disconnectedCallback(); clearTimeout(this._nt); }
  onAct(a, t) { const c = this._config, h = this._hass, s = H.st(h, c.entity); if (!s) return;
    if (a === 'pw') { H.haptic('light'); return H.call(h, 'fan', s.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: c.entity }); }
    if (a === 'mode') { const M = this._modes(s), m = M.find((x) => String(x.k) === t.dataset.m); if (!m) return; H.haptic('selection'); this._opt = { k: m.k, ts: Date.now() }; this.rerender();
      if (m.pct != null) return H.call(h, 'fan', 'set_percentage', { entity_id: c.entity, percentage: m.pct });
      return H.call(h, 'fan', s.state === 'on' ? 'set_preset_mode' : 'turn_on', { entity_id: c.entity, preset_mode: m.k }); } }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 6, rows: 5 }; }
}
hgReg('hg-purifier-card', HGPurifierCard, hgTLazy('cards.purifier.picker_name'), hgTLazy('cards.purifier.picker_description'));
