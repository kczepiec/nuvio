/* shared/media: Czy odtwarzacz jest aktywny. */
/* aktywny = coś gra / jest wstrzymane albo urządzenie włączone z treścią (np. dekoder Enigma2 ma stan „on” z kanałem) */
const hgMpActive = (s) => !!s && (['playing', 'paused', 'buffering'].includes(s.state) || (s.state === 'on' && !!(s.attributes.media_title || s.attributes.media_channel)));
/* ===== „Teraz gra”: jeden wygląd odtwarzacza dla Multimediów i pokoju =====
   okładka jako tło (z przyciemnieniem), linia kontekstu (pokój · źródło · stan), duży tytuł, wykonawca, postęp z czasami,
   losowo / poprzedni / odtwarzaj / następny / powtarzanie, głośność z − i +, chipy: źródło, dźwięk, pokoje (grupowanie). */
/* głośność w toku (− / +, także przytrzymanie) wg encji: { v, t }. Pokazywana od razu, zanim HA potwierdzi (głośniki raportują z opóźnieniem
   i skokami); wygasa 2,5 s po ostatnim kroku albo gdy stan HA ją osiągnie */
const HG_NP_VOL = new Map();
const hgNpPend = (e, cur) => { const p = HG_NP_VOL.get(e); if (!p) return null; if (Date.now() - p.t > 2500 || (cur != null && Math.abs(cur - p.v) < 0.005 && Date.now() - p.t > 300)) { HG_NP_VOL.delete(e); return null; } return p.v; };
const HG_NP_COL = new Map(), HG_NP_COL_MAX = 200;
/* pamięć podręczna z limitem (LRU): przez dzień przewijają się setki okładek, bez limitu mapa rosłaby przez całą sesję */
const hgNpColSet = (u, v) => { HG_NP_COL.delete(u); HG_NP_COL.set(u, v); while (HG_NP_COL.size > HG_NP_COL_MAX) HG_NP_COL.delete(HG_NP_COL.keys().next().value); };   // kolor okładki (średni) wg adresu obrazu: wpisywany w style przy renderze, więc łatanie DOM go nie gubi
const HG_NP_W = '#' + 'fff', HG_NP_K = '#' + '16181B';   /* stałe kolory (tło z okładki jest zawsze ciemne): poza zamianą kolorów motywu ciemnego */
const HG_NP_CSS = `
ha-card.np{ position:relative; overflow:hidden; display:flex; flex-direction:column; gap:12px; padding:16px 18px 16px; min-height:300px; container-type:inline-size; color:${HG_NP_W};
  background:linear-gradient(160deg, color-mix(in srgb, var(--mt, #3B4A7A) 85%, #000), color-mix(in srgb, var(--mt, #3B4A7A) 35%, #0E0F12)); --np-fg:${HG_NP_W}; --np-mt:rgba(255,255,255,.72); }
.npbg{ position:absolute; inset:0; pointer-events:none; background:center/cover no-repeat; transform:scale(1.04); transition:opacity .6s; }
.npbg::after{ content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.28) 35%, rgba(0,0,0,.62) 70%, rgba(0,0,0,.78)); }
ha-card.np > *:not(.npbg){ position:relative; }
.nph{ display:flex; align-items:center; gap:8px; min-height:36px; }
.npc{ display:inline-flex; align-items:center; gap:6px; height:34px; padding:0 14px; border-radius:999px; font-size:13px; font-weight:600; color:${HG_NP_W}; background:rgba(255,255,255,.16); -webkit-backdrop-filter:var(--hg-bfo, blur(12px)); backdrop-filter:var(--hg-bfo, blur(12px)); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; min-width:0; transition:background .2s, transform .1s; }
.npc ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; flex:none; display:flex; } .npc:active{ transform:scale(.96); }
.npc.on{ background:${HG_NP_W}; color:${HG_NP_K}; }
@media (hover:hover){ .npc:not(.on):hover{ background:rgba(255,255,255,.26); } }
.nph .sp{ flex:1; }
.npic{ width:36px; height:36px; padding:0; justify-content:center; flex:none; }
.npm{ margin-top:auto; display:flex; flex-direction:column; gap:4px; min-width:0; }
.npk{ font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--np-mt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.npt{ font-size:clamp(17px, 7.5cqi, 40px); overflow-wrap:break-word; font-weight:700; line-height:1.08; letter-spacing:-.01em; color:${HG_NP_W}; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-align:left; }
.npa{ font-size:clamp(14px, 3.6cqi, 18px); color:rgba(255,255,255,.88); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.npg{ display:flex; flex-direction:column; gap:6px; }
.npr{ position:relative; height:4px; border-radius:2px; background:rgba(255,255,255,.28); }
.npr i{ position:absolute; left:0; top:0; bottom:0; border-radius:2px; background:${HG_NP_W}; width:calc(var(--p) * 100%); transition:width 1s linear; }
.npr i::after{ content:''; position:absolute; right:-7px; top:50%; width:14px; height:14px; margin-top:-7px; border-radius:50%; background:${HG_NP_W}; box-shadow:0 2px 6px rgba(0,0,0,.3); }
.npn{ display:flex; justify-content:space-between; font-size:11px; color:var(--np-mt); font-variant-numeric:tabular-nums; }
.npk2{ display:flex; align-items:center; justify-content:center; gap:clamp(6px, 3cqi, 18px); }
.npb{ width:40px; height:40px; border-radius:50%; display:grid; place-items:center; color:${HG_NP_W}; flex:none; transition:transform .12s, background .2s, color .2s; }
.npb ha-icon{ --mdc-icon-size:24px; width:24px; height:24px; display:flex; } .npb:active{ transform:scale(.9); }
.npb.sm{ background:rgba(255,255,255,.16); } .npb.sm ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; } .npb.sm.on{ background:${HG_NP_W}; color:${HG_NP_K}; }
.npb.big{ width:60px; height:60px; background:${HG_NP_W}; color:${HG_NP_K}; box-shadow:0 8px 24px rgba(0,0,0,.3); } .npb.big ha-icon{ --mdc-icon-size:32px; width:32px; height:32px; }
@media (hover:hover){ .npb:not(.big):not(.on):hover{ background:rgba(255,255,255,.22); } }
.npf{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.npv{ flex:1 1 240px; display:flex; align-items:center; gap:8px; min-width:0; }
.npv .npb{ width:36px; height:36px; background:rgba(255,255,255,.16); } .npv .npb ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; }
.npv input[type=range]{ flex:1; min-width:60px; height:28px !important; --f:${HG_NP_W}; }
ha-card.np .npv input[type=range]::-webkit-slider-runnable-track{ height:6px !important; box-shadow:none !important; background:linear-gradient(90deg, ${HG_NP_W} 0 var(--v, 50%), rgba(255,255,255,.28) var(--v, 50%) 100%) !important; }
ha-card.np .npv input[type=range]::-moz-range-track{ background:rgba(255,255,255,.28); } ha-card.np .npv input[type=range]::-moz-range-progress{ background:${HG_NP_W}; }
.npo{ display:flex; flex-direction:column; align-items:center; line-height:1.05; min-width:3.4em; } .npo output{ font-size:15px; font-weight:700; font-variant-numeric:tabular-nums; }
.npmb{ display:inline-flex; align-items:center; gap:5px; flex:none; height:36px; padding:0 12px; border:0; border-radius:999px; background:rgba(255,255,255,.16); color:${HG_NP_W}; font:inherit; font-size:14px; font-weight:700; font-variant-numeric:tabular-nums; cursor:pointer; -webkit-tap-highlight-color:transparent; touch-action:manipulation; }
/* stała szerokość „100 %”: zmiana poziomu nie przesuwa suwaka; wyciszone = sama ikona na środku, podświetlona (zwykła ikona i tekst ukryte, ale zajmują miejsce) */
.npml{ display:grid; justify-items:center; } .npml > *{ grid-area:1 / 1; visibility:hidden; } .npml > output{ visibility:visible; }
.npmb{ position:relative; } .npmb.on > ha-icon, .npmb.on .npml > output{ visibility:hidden; } .npmc{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.npmb ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; flex:none; display:flex; } .npmb.on{ background:${HG_NP_W}; color:${HG_NP_K}; } .npmb:active{ transform:scale(.96); }
@media (hover:hover){ .npmb:not(.on):hover{ background:rgba(255,255,255,.26); } }
.npv .npb{ -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; touch-action:manipulation; }
.npo small{ font-size:10px; font-weight:500; color:var(--np-mt); }
.npx{ display:flex; gap:8px; flex-wrap:wrap; }
ha-card.np.off .npbg{ filter:grayscale(1); opacity:.5; }
ha-card.np.idle{ min-height:0; }
@container (max-width: 240px){ .npv{ gap:4px; } .npv .npb{ width:30px; height:30px; } .npv input[type=range]{ min-width:36px; } .npv > :not(.npb):not(input):not(.npmb){ display:none; } .npmb{ width:30px; height:30px; padding:0; justify-content:center; } .npmb .npml{ display:none; } }
@container (max-width: 420px){ .npb.sm.opt{ display:none; } .npx .npc span{ display:none; } .npx .npc{ width:36px; padding:0; justify-content:center; } .npv{ flex-basis:100%; } }
@media (prefers-reduced-motion: reduce){ .npr i, .npbg{ transition:none; } }
`;
const hgNP = {
  F: { PAUSE: 1, VOL_SET: 4, MUTE: 8, PREV: 16, NEXT: 32, ON: 128, OFF: 256, VOL_STEP: 1024, SOURCE: 2048, STOP: 4096, PLAY: 16384, SHUFFLE: 32768, SOUND: 65536, REPEAT: 262144, GROUP: 524288 },
  /* głośność od razu na karcie: suwak i poziom w pigułce / obok, bez przebudowy (bez skoku układu) */
  paintVol(card, e, v) { const R = card && card.$; if (!R) return; const p = Math.round(v * 100);
    for (const i of R.querySelectorAll('input[data-act="vol"]')) { if (i.dataset.e !== e) continue; i.value = p; i.style.setProperty('--v', p + '%'); const w = i.closest('.npv'), o = w && w.querySelector('.npml > output, .npo output'); if (o) o.textContent = H.pct(p); }
    clearTimeout(card._npExp); card._npExp = setTimeout(() => card._update && card._update(true), 2600); },   // po wygaśnięciu: wartość, którą HA naprawdę zgłasza
  tm(x) { x = Math.max(0, Math.round(x)); const hh = Math.floor(x / 3600), m = Math.floor(x / 60) % 60, ss = String(x % 60).padStart(2, '0'); return hh ? `${hh}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`; },
  /* html karty: o = { name, room } */
  html(h, e, o = {}) {
    const s = h.states[e], at = s.attributes, f = Number(at.supported_features) || 0, F = hgNP.F, E = H.esc(e), nm = o.name || H.name(h, e);
    const pl = s.state === 'playing', act = ['playing', 'paused', 'buffering'].includes(s.state) || (s.state === 'on' && !!(at.media_title || at.media_channel)), off = ['off', 'standby'].includes(s.state);
    const tv = at.device_class === 'tv' || /tv|telewiz/i.test(nm + e), st = hgMpSt(s.state) || H.stateLabel(s.state);
    const app = at.app_name && !/^[a-z]+\.[a-z0-9.]+$/i.test(at.app_name) ? at.app_name : '', src = at.source || app;
    const title = at.media_title || at.media_channel || app || nm;
    const sub = at.media_title ? [at.media_artist || at.media_series_title, at.media_album_name].filter(Boolean).join(' · ') : (app && app !== title ? app : st);
    const ctx = [o.room, nm !== title ? nm : '', src, st].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(' · ');
    const pic = at.entity_picture, col = pic && HG_NP_COL.get(pic);
    const dur = Number(at.media_duration) || 0, has = act && dur > 0 && at.media_position != null;
    const pos = has ? Math.min(dur, Number(at.media_position) + (pl && at.media_position_updated_at ? (Date.now() - Date.parse(at.media_position_updated_at)) / 1000 : 0)) : 0;
    const B = (a, ic, l, cls = '', x = '') => `<button class="npb ${cls}" data-act="${a}" data-e="${E}" aria-label="${H.esc(l)}" title="${H.esc(l)}"${x}>${H.icon(ic)}</button>`;
    const shuf = !!at.shuffle, rep = at.repeat || 'off';
    const ctl = act || ['idle', 'on'].includes(s.state) ? [
      f & F.SHUFFLE ? B('npsh', 'mdi:shuffle-variant', hgT('shared.media.shuffle'), `sm opt ${shuf ? 'on' : ''}`, ` aria-pressed="${shuf}"`) : '',
      f & F.PREV ? B('npprev', 'mdi:skip-previous', hgT('common.previous_track')) : '',
      (pl ? f & (F.PAUSE | F.STOP) : f & F.PLAY) ? B('npp', pl ? (f & F.PAUSE ? 'mdi:pause' : 'mdi:stop') : 'mdi:play', pl ? hgT('common.pause') : hgT('shared.media.play'), 'big') : '',
      f & F.NEXT ? B('npnext', 'mdi:skip-next', hgT('common.next_track')) : '',
      f & F.REPEAT ? B('nprep', rep === 'one' ? 'mdi:repeat-once' : rep === 'all' ? 'mdi:repeat' : 'mdi:repeat-off', hgT('shared.media.repeat'), `sm opt ${rep !== 'off' ? 'on' : ''}`) : '',
    ].join('') : '';
    const pv = hgNpPend(e, at.volume_level), vp = pv != null ? Math.round(pv * 100) : at.volume_level != null ? Math.round(at.volume_level * 100) : null, mu = !!at.is_volume_muted;
    /* − · suwak · + · pigułka „🔊 30 %”: przyciski kroku symetrycznie po obu stronach suwaka, dotknięcie pigułki wycisza (bez wyciszenia: sam poziom) */
    const vol = off ? '' : (f & F.VOL_SET) && vp != null ? `<div class="npv">${B('npvd', 'mdi:volume-minus', hgT('shared.media.volume_down'))}
        <input type="range" min="0" max="100" step="1" value="${vp}" style="--v:${vp}%" data-act="vol" data-e="${E}" aria-label="${H.esc(hgT('shared.media.volume_aria', { name: nm }))}">${B('npvu', 'mdi:volume-plus', hgT('shared.media.volume_up'))}
        ${f & F.MUTE ? `<button class="npmb ${mu ? 'on' : ''}" data-act="npmu" data-e="${E}" aria-pressed="${mu}" aria-label="${mu ? hgT('shared.media.unmute') : hgT('shared.media.mute')}" title="${mu ? hgT('shared.media.unmute') : hgT('shared.media.mute')}">${H.icon(vp === 0 ? 'mdi:volume-off' : 'mdi:volume-high')}${mu ? `<span class="npmc">${H.icon('mdi:volume-off')}</span>` : ''}<span class="npml"><span aria-hidden="true">${H.pct(100)}</span><output>${H.pct(vp)}</output></span></button>`
          : `<span class="npo"><output>${H.pct(vp)}</output><small>${hgT('shared.media.volume_label')}</small></span>`}</div>`
      : (f & F.VOL_STEP) ? `<div class="npv">${B('npvd', 'mdi:volume-minus', hgT('shared.media.volume_down'))}${B('npvu', 'mdi:volume-plus', hgT('shared.media.volume_up'))}</div>` : '';
    const C = (a, ic, l, on) => `<button class="npc ${on ? 'on' : ''}" data-act="${a}" data-e="${E}" aria-label="${H.esc(l)}" title="${H.esc(l)}">${H.icon(ic)}<span>${H.esc(l)}</span></button>`;
    const grp = (at.group_members || []).length > 1;
    const chips = off ? '' : [
      (f & F.SOURCE) && (at.source_list || []).length ? C('npsrc', tv ? 'mdi:import' : 'mdi:music-box-multiple-outline', at.source || hgT('shared.media.source')) : '',
      (f & F.GROUP) ? C('npgrp', 'mdi:speaker-multiple', grp ? hgT('shared.media.rooms_count', { count: at.group_members.length }) : hgT('common.rooms'), grp) : '',
      (f & F.SOUND) && (at.sound_mode_list || []).length ? C('npsnd', 'mdi:tune-vertical', at.sound_mode || hgT('shared.media.sound')) : '',
    ].join('');
    const pw = f & (off ? F.ON : F.OFF) ? `<button class="npc npic" data-act="npw" data-e="${E}" aria-label="${off ? hgT('common.turn_on') : hgT('common.turn_off')}" title="${off ? hgT('common.turn_on') : hgT('common.turn_off')}">${H.icon('mdi:power')}</button>` : '';
    return `<ha-card class="glass np ${pl ? 'pl' : ''} ${off ? 'off' : ''} ${act ? '' : 'idle'}" style="${col ? `--mt:${col}` : ''}">
      <div class="npbg"${pic ? ` style="background-image:url('${H.cssUrl(pic)}')" data-pic="${H.esc(pic)}"` : ''}></div>
      <div class="nph"><button class="npc" data-act="more" data-e="${E}">${H.icon(tv ? 'mdi:television' : 'mdi:speaker')}<span>${H.esc(nm)}</span></button><span class="sp"></span>${pw}<button class="npc npic" data-act="more" data-e="${E}" aria-label="${hgT('common.details')}" title="${hgT('common.details')}">${H.icon('mdi:dots-horizontal')}</button></div>
      <div class="npm"><span class="npk">${H.esc(ctx)}</span><span class="npt">${H.esc(title)}</span>${sub ? `<span class="npa">${H.esc(sub)}</span>` : ''}</div>
      ${has ? `<div class="npg" data-dur="${dur}" data-pos="${pos.toFixed(1)}" data-t="${Date.now()}" data-pl="${pl ? 1 : 0}"><div class="npr"><i style="--p:${(pos / dur).toFixed(4)}"></i></div><div class="npn"><span>${hgNP.tm(pos)}</span><span>-${hgNP.tm(dur - pos)}</span></div></div>` : ''}
      ${ctl ? `<div class="npk2">${ctl}</div>` : ''}${vol || chips ? `<div class="npf">${vol}${chips ? `<div class="npx">${chips}</div>` : ''}</div>` : ''}</ha-card>`;
  },
  /* po renderze: tykanie postępu i kolor z okładki (raz na obraz) */
  after(card) {
    clearInterval(card._npT); card._npT = 0; const R = card.$;
    /* przytrzymanie − / + (mysz i dotyk): po 450 ms krok co 250 ms, do puszczenia; przewinięcie (pointercancel) przerywa */
    if (R && !R._npHold) { R._npHold = true;
      R.addEventListener('input', (ev) => { const t = ev.composedPath()[0]; if (t && t.dataset && t.dataset.act === 'vol') { HG_NP_VOL.delete(t.dataset.e); clearTimeout(card._npExp); } }, true);   // suwak przejmuje: bez powrotu do wartości z − / +
      R.addEventListener('contextmenu', (ev) => { if (ev.composedPath().some((n) => n.dataset && /^npv[du]$/.test(n.dataset.act || ''))) ev.preventDefault(); });
      R.addEventListener('pointerdown', (ev) => { const b = ev.composedPath().find((n) => n.dataset && /^npv[du]$/.test(n.dataset.act || '')); if (!b || ev.button > 0) return;
        let iv = 0; const go = () => { b._npRep = true; hgNP.act(card, b.dataset.act, b); b._npRep = false; };
        const t = setTimeout(() => { go(); iv = setInterval(go, 250); }, 450);
        const stop = (e2) => { clearTimeout(t); clearInterval(iv); for (const k of ['pointerup', 'pointercancel']) window.removeEventListener(k, stop, true); if (iv && e2.type === 'pointerup') card._npHeld = Date.now(); };
        for (const k of ['pointerup', 'pointercancel']) window.addEventListener(k, stop, true); }); }
    if (R.querySelector('.npg[data-pl="1"]')) card._npT = setInterval(() => { if (document.hidden || card._off) return; for (const g of R.querySelectorAll('.npg[data-pl="1"]')) { const d = +g.dataset.dur, p = Math.min(d, +g.dataset.pos + (Date.now() - +g.dataset.t) / 1000);
      g.querySelector('i').style.setProperty('--p', (p / d).toFixed(4)); const n = g.querySelectorAll('.npn span'); n[0].textContent = hgNP.tm(p); n[1].textContent = '-' + hgNP.tm(d - p); } }, 1000);
    for (const bg of R.querySelectorAll('.npbg[data-pic]')) { const u = bg.dataset.pic; if (HG_NP_COL.has(u)) continue; hgNpColSet(u, '');
      const im = new Image(); if (/^\/(?!\/)/.test(u)) im.crossOrigin = 'anonymous';
      im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 8, 8); const d = x.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
        const n = d.length / 4, v = `rgb(${Math.round(r / n)} ${Math.round(g / n)} ${Math.round(b / n)})`; hgNpColSet(u, v); for (const k of R.querySelectorAll('.npbg[data-pic]')) if (k.dataset.pic === u) k.parentNode.style.setProperty('--mt', v); } catch (_) { /* obraz z innej domeny */ } };
      im.src = u; }
  },
  /* akcje; zwraca true, gdy obsłużone */
  act(card, a, el) {
    if (!a.startsWith('np')) return false;
    const h = card._hass, e = el.dataset.e, s = h.states[e]; if (!s) return true; const at = s.attributes, f = Number(at.supported_features) || 0, F = hgNP.F, m = (sv, d = {}) => H.call(h, 'media_player', sv, { entity_id: e, ...d });
    H.haptic('light');
    if (a === 'npp') return m(s.state === 'playing' ? (f & F.PAUSE ? 'media_pause' : 'media_stop') : 'media_play'), true;
    if (a === 'npprev') return m('media_previous_track'), true;
    if (a === 'npnext') return m('media_next_track'), true;
    if (a === 'npsh') return m('shuffle_set', { shuffle: !at.shuffle }), true;
    if (a === 'nprep') return m('repeat_set', { repeat: { off: 'all', all: 'one', one: 'off' }[at.repeat || 'off'] || 'off' }), true;
    if (a === 'npmu') return m('volume_mute', { is_volume_muted: !at.is_volume_muted }), true;
    if (a === 'npvd' || a === 'npvu') { if (!el._npRep && Date.now() - (card._npHeld || 0) < 400) return true;   // klik kończący przytrzymanie: kroki już wysłane
      const d = a === 'npvu' ? 1 : -1, pv = hgNpPend(e, null), base = pv != null ? pv : at.volume_level;   // kolejne kroki od wartości w toku, nie od opóźnionego stanu
      if (!((f & F.VOL_SET) && base != null)) { m(d > 0 ? 'volume_up' : 'volume_down'); return true; }
      const v = Math.max(0, Math.min(1, Math.round((base + d * 0.05) * 100) / 100)); HG_NP_VOL.set(e, { v, t: Date.now() }); hgNP.paintVol(card, e, v);
      /* wysyłka najwyżej co 350 ms (ostatnia wartość zawsze dochodzi): przytrzymanie nie zasypuje głośnika poleceniami */
      const Q = card._npQ = card._npQ || {}, q = Q[e] = Q[e] || { t: 0, k: 0 }, go = () => { q.t = Date.now(); q.k = 0; const x = HG_NP_VOL.get(e); m('volume_set', { volume_level: x ? x.v : v }); };
      if (Date.now() - q.t >= 350) go(); else if (!q.k) q.k = setTimeout(go, 350 - (Date.now() - q.t)); return true; }
    if (a === 'npw') return m(['off', 'standby'].includes(s.state) ? 'turn_on' : 'turn_off'), true;
    if (a === 'npsrc') { hgOverlay.menu(el, (at.source_list || []).map((x) => ({ label: x, value: x, checked: x === at.source }))).then((v) => { if (v != null) m('select_source', { source: v }); }); return true; }
    if (a === 'npsnd') { hgOverlay.menu(el, (at.sound_mode_list || []).map((x) => ({ label: x, value: x, checked: x === at.sound_mode }))).then((v) => { if (v != null) m('select_sound_mode', { sound_mode: v }); }); return true; }
    if (a === 'npgrp') { const gm = at.group_members || [e], others = Object.keys(h.states).filter((x) => x !== e && x.startsWith('media_player.') && H.ok(h.states[x]) && ((Number(h.states[x].attributes.supported_features) || 0) & F.GROUP));
      hgOverlay.menu(el, others.map((x) => ({ label: H.name(h, x), icon: 'mdi:speaker', value: x, checked: gm.includes(x) }))).then((v) => { if (v == null) return; if (gm.includes(v)) H.call(h, 'media_player', 'unjoin', { entity_id: v }); else m('join', { group_members: [v] }); }); return true; }
    return true;
  },
};
