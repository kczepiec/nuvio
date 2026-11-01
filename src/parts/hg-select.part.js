/* ===== hg-select: jeden szklany select dla całego Nuvio =====
   Progresywne ulepszenie: natywny <select> zostaje w DOM jako źródło prawdy (value, 'change', formularze),
   a obok niego rysujemy szklany przycisk i listę (ARIA listbox). Wystarczy hgSelWatch(shadowRoot). */
const HGS_CSS = `
.hgs-n{ position:absolute !important; width:1px !important; height:1px !important; opacity:0 !important; pointer-events:none !important; overflow:hidden !important; clip-path:inset(50%) !important; }
.hgs-t{ all:unset; box-sizing:border-box; display:flex; align-items:center; gap:8px; width:100%; min-height:40px; padding:0 10px 0 12px; border-radius:12px; cursor:pointer;
  font:inherit; font-size:14px; color:inherit; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
  transition:border-color .15s ease, background .15s ease, box-shadow .15s ease; -webkit-tap-highlight-color:transparent; }
.hgs-t:hover{ background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.26); }
.hgs-t:focus-visible, .hgs-t[aria-expanded=true]{ border-color:var(--hg-accent, #a3e635); box-shadow:0 0 0 3px color-mix(in srgb, var(--hg-accent, #a3e635) 28%, transparent); }
.hgs-t[disabled]{ opacity:.5; cursor:default; }
.hgs-v{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left; }
.hgs-c{ flex:none; width:18px; height:18px; opacity:.7; transition:transform .22s cubic-bezier(.2,.8,.2,1); }
.hgs-t[aria-expanded=true] .hgs-c{ transform:rotate(180deg); }
.hgs-l{ position:fixed; z-index:2147483000; box-sizing:border-box; margin:0; padding:6px; list-style:none; overflow:auto; overscroll-behavior:contain; border-radius:16px; color:#fff;
  background:rgba(28,32,38,.62); -webkit-backdrop-filter:var(--hg-bfo, blur(22px) saturate(160%)); backdrop-filter:var(--hg-bfo, blur(22px) saturate(160%));
  border:1px solid rgba(255,255,255,.16); box-shadow:0 18px 48px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.10);
  font-size:14px; clip-path:inset(0 0 100% 0 round 16px); transform:translateY(-6px) scale(.98); transform-origin:top center;
  transition:clip-path .24s cubic-bezier(.2,.8,.2,1), transform .24s cubic-bezier(.2,.8,.2,1); }
.hgs-l.up{ clip-path:inset(100% 0 0 0 round 16px); transform:translateY(6px) scale(.98); transform-origin:bottom center; }
.hgs-l.in{ clip-path:inset(0 0 0 0 round 16px); transform:none; }
.hgs-o{ display:flex; align-items:center; gap:10px; min-height:40px; padding:0 10px 0 12px; border-radius:10px; cursor:pointer; user-select:none; opacity:0; transform:translateY(-3px);
  transition:background .12s ease, opacity .2s ease, transform .2s ease; }
.hgs-l.in .hgs-o{ opacity:1; transform:none; }
.hgs-o > span{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hgs-o.on{ background:rgba(255,255,255,.12); }
.hgs-o[aria-selected=true]{ color:var(--hg-accent, #a3e635); font-weight:600; }
.hgs-o svg{ flex:none; width:18px; height:18px; opacity:0; transform:scale(.6); transition:opacity .15s ease, transform .2s cubic-bezier(.2,.8,.2,1); }
.hgs-o[aria-selected=true] svg{ opacity:1; transform:none; }
.hgs-o[aria-disabled=true]{ opacity:.4 !important; cursor:default; }
.hgs-q{ position:sticky; top:-6px; z-index:1; list-style:none; margin:-6px -6px 4px; padding:6px; background:rgba(28,32,38,.92); }
.hgs-si{ all:unset; box-sizing:border-box; width:100%; height:36px; padding:0 12px; border-radius:10px; font:inherit; font-size:14px; color:inherit; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.16); }
.hgs-si:focus-visible{ border-color:var(--hg-accent, #a3e635); box-shadow:0 0 0 3px color-mix(in srgb, var(--hg-accent, #a3e635) 28%, transparent); }
.hgs-em{ list-style:none; padding:10px 12px; opacity:.6; }
@media (pointer:coarse){ .hgs-t{ min-height:44px; font-size:16px; } .hgs-o{ min-height:46px; font-size:16px; } .hgs-si{ height:42px; font-size:16px; } }
@media (prefers-reduced-motion:reduce){ .hgs-l, .hgs-o, .hgs-c, .hgs-o svg{ transition:none !important; } }
@media (prefers-color-scheme:light){ :host(:not([dark])) .hgs-l.lt{ background:rgba(255,255,255,.72); color:#1F2125; border-color:rgba(0,0,0,.08); } }
`;
const HGS_CHEV = '<svg class="hgs-c" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/></svg>';
const HGS_TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
const HGS_PAGE = 10;   /* ile opcji dopisujemy naraz (infinite scroll) */
/* czysta logika wyszukiwarki i stronicowania (bez DOM, testowana w tests/js) */
const hgsNorm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
const hgsFilter = (texts, q) => { const k = hgsNorm(q).trim(); return texts.map((t, i) => i).filter((i) => !k || hgsNorm(texts[i]).includes(k)); };
const hgsNextPage = (shown, total, size = HGS_PAGE) => Math.min(total, shown + size);
let hgsN = 0; const hgsOpen = new Set();   /* inne handlery Escape (arkusz, menu) ustępują, dopóki lista jest otwarta */   /* otwarte listy: zamykane, gdy ich przycisk zniknie z DOM (przerysowanie arkusza) */
const hgsEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function hgSelUp(sel) {
  if (sel.dataset.hgs || sel.multiple || sel.size > 1) return;
  const root = sel.getRootNode(); if (!root || !root.appendChild) return;
  if (!root.querySelector('style[data-hgs]')) { const st = document.createElement('style'); st.dataset.hgs = '1'; st.textContent = HGS_CSS; (root.head || root).appendChild(st); }
  const id = 'hgs' + (++hgsN); sel.dataset.hgs = id; sel.classList.add('hgs-n'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
  const t = document.createElement('button'); t.type = 'button'; t.className = 'hgs-t'; t.setAttribute('aria-haspopup', 'listbox'); t.setAttribute('aria-expanded', 'false');
  const lab = sel.getAttribute('aria-label') || (sel.closest('label') && (sel.closest('label').querySelector('span') || {}).textContent) || '';
  if (lab) t.setAttribute('aria-label', lab.trim());
  sel.after(t);
  let L = null, act = -1, q = '', fl = [], shown = 0, Q = null;   /* act: pozycja w przefiltrowanej liście fl (indeksy opcji); shown: ile opcji dopisano do listy */
  const opts = () => [...sel.options];
  const filt = () => { fl = hgsFilter(opts().map((o) => o.text), q); return fl; };
  const paint = () => { const o = sel.options[sel.selectedIndex]; t.innerHTML = `<span class="hgs-v">${hgsEsc(o ? o.text : '')}</span>${HGS_CHEV}`; t.disabled = sel.disabled; };
  const row = (i) => { const o = sel.options[i]; return `<li class="hgs-o" role="option" id="${id}o${i}" data-i="${i}" aria-selected="${i === sel.selectedIndex}"${o.disabled ? ' aria-disabled="true"' : ''}>${HGS_TICK}<span>${hgsEsc(o.text)}</span></li>`; };
  const more = () => { if (!L || shown >= fl.length) return; const f = shown; shown = hgsNextPage(shown, fl.length); L.insertAdjacentHTML('beforeend', fl.slice(f, shown).map(row).join('')); };   /* dopisz kolejną porcję (HGS_PAGE) */
  const check = () => { while (L && shown < fl.length && L.scrollTop + L.clientHeight >= L.scrollHeight - 48) more(); };   /* infinite scroll: dopisz, gdy użytkownik dojdzie do dołu */
  const mark = (p) => { act = p; if (!L) return; while (p >= shown && shown < fl.length) more(); const rs = L.querySelectorAll('.hgs-o'); rs.forEach((n, k) => n.classList.toggle('on', k === p)); const n = rs[p]; if (n) { L.setAttribute('aria-activedescendant', n.id); n.scrollIntoView({ block: 'nearest' }); } };
  const renderRows = () => { if (!L) return; L.querySelectorAll('.hgs-o, .hgs-em').forEach((n) => n.remove()); filt(); shown = 0; more();
    if (!fl.length) L.insertAdjacentHTML('beforeend', `<li class="hgs-em" role="presentation">${hgsEsc(hgT('roomx.no_results'))}</li>`); else mark(0);
    check(); place(); };
  const pick = (i) => { const o = sel.options[i]; if (!o || o.disabled) return; if (sel.selectedIndex !== i) { sel.selectedIndex = i; sel.dispatchEvent(new Event('input', { bubbles: true, composed: true })); sel.dispatchEvent(new Event('change', { bubbles: true, composed: true })); } paint(); close(true); };
  const place = () => { if (!L) return; const r = t.getBoundingClientRect(), vh = innerHeight, vw = innerWidth, gap = 6;
    const want = Math.min(L.scrollHeight, 320), below = vh - r.bottom - gap - 8, above = r.top - gap - 8, up = below < Math.min(want, 200) && above > below;
    const w = Math.max(r.width, Math.min(220, vw - 16)); L.style.width = w + 'px'; L.style.left = Math.max(8, Math.min(r.left, vw - w - 8)) + 'px';
    L.style.maxHeight = Math.max(120, Math.min(320, up ? above : below)) + 'px';
    if (up) { L.style.top = ''; L.style.bottom = (vh - r.top + gap) + 'px'; } else { L.style.bottom = ''; L.style.top = (r.bottom + gap) + 'px'; }
    L.classList.toggle('up', up);
    /* przodek z backdrop-filter/transform (np. okno Assist) staje się blokiem zawierającym dla position:fixed: przesuń listę o różnicę, żeby stała przy przycisku */
    const lx = parseFloat(L.style.left), b = L.getBoundingClientRect(), dx = b.left - lx;
    if (Math.abs(dx) > 0.5) L.style.left = (lx - dx) + 'px';
    if (up) { const dy = b.bottom - (r.top - gap); if (Math.abs(dy) > 0.5) L.style.bottom = (parseFloat(L.style.bottom) + dy) + 'px'; }
    else { const dy = b.top - (r.bottom + gap); if (Math.abs(dy) > 0.5) L.style.top = (parseFloat(L.style.top) - dy) + 'px'; } };
  const out = (e) => { if (!L) return; const p = e.composedPath(); if (!p.includes(L) && !p.includes(t)) close(false); };
  const rep = () => place();
  const gone = () => { if (!t.isConnected) close(false); };
  function open() { if (L || sel.disabled) return; if (typeof sel._hgsFill === 'function') { sel._hgsFill(); paint(); }   /* pełna lista opcji dopiero przy otwarciu (np. tysiące czujników) */
    L = document.createElement('ul'); L.className = 'hgs-l'; L.id = id + 'l'; L.setAttribute('role', 'listbox'); L.tabIndex = -1;
    if (lab) L.setAttribute('aria-label', lab.trim());
    const ph = hgsEsc(hgT('common.search'));
    L.innerHTML = `<li class="hgs-q" role="presentation"><input type="search" class="hgs-si" autocomplete="off" placeholder="${ph}" aria-label="${ph}"></li>`;
    Q = L.querySelector('input'); q = ''; filt(); shown = 0;
    root.appendChild(L); hgsOpen.add(gone); if (t.getRootNode().activeElement !== t) t.focus({ preventScroll: true }); t.setAttribute('aria-expanded', 'true'); t.setAttribute('aria-controls', L.id);
    more(); const si = fl.indexOf(sel.selectedIndex); mark(si >= 0 ? si : 0); place(); check();
    L.addEventListener('scroll', check);
    Q.addEventListener('input', () => { q = Q.value; renderRows(); }); Q.addEventListener('keydown', key);
    L.addEventListener('pointerdown', (e) => { if (!e.target.closest('input')) e.preventDefault(); });   // fokus zostaje na przycisku, chyba że klikasz w wyszukiwarkę
    L.addEventListener('click', (e) => { const li = e.target.closest('.hgs-o'); if (li) pick(+li.dataset.i); });
    L.addEventListener('pointermove', (e) => { const li = e.target.closest('.hgs-o'); if (li) { const p = [...L.querySelectorAll('.hgs-o')].indexOf(li); if (p !== act) mark(p); } });
    requestAnimationFrame(() => L && L.classList.add('in'));
    document.addEventListener('pointerdown', out, true); addEventListener('resize', rep); addEventListener('scroll', rep, true); }
  function close(focus) { if (!L) return; const l = L; L = null; hgsOpen.delete(gone); t.setAttribute('aria-expanded', 'false'); t.removeAttribute('aria-controls');
    l.classList.remove('in'); l.style.pointerEvents = 'none'; setTimeout(() => l.remove(), 240);
    document.removeEventListener('pointerdown', out, true); removeEventListener('resize', rep); removeEventListener('scroll', rep, true); if (focus && t.isConnected) t.focus(); }
  const step = (d) => { const n = fl.length; if (!n) return; let p = act < 0 ? (d > 0 ? -1 : 0) : act; for (let k = 0; k < n; k++) { p = (p + d + n) % n; if (!sel.options[fl[p]].disabled) break; } mark(p); };
  /* klawisze działają na przycisku i w wyszukiwarce; litera otwartej listy trafia do wyszukiwarki */
  const key = (e) => { const k = e.key, typing = !!Q && e.target === Q;
    if (!L) { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(k)) { e.preventDefault(); open(); } return; }
    if (k === 'ArrowDown') { e.preventDefault(); step(1); } else if (k === 'ArrowUp') { e.preventDefault(); step(-1); }
    else if (k === 'Home' && !typing) { e.preventDefault(); mark(0); } else if (k === 'End' && !typing) { e.preventDefault(); mark(fl.length - 1); }
    else if (k === 'Enter' || (k === ' ' && !typing)) { e.preventDefault(); if (act >= 0 && fl[act] != null) pick(fl[act]); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    else if (k === 'Tab') close(false);
    else if (!typing && k.length === 1) { e.preventDefault(); Q.value += k; q = Q.value; Q.focus(); renderRows(); } };
  t.addEventListener('click', () => (L ? close(true) : open()));
  t.addEventListener('keydown', key);
  sel.addEventListener('change', paint);
  new MutationObserver(paint).observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
  paint();
}
/* podpowiedzi zamiast natywnej <datalist>: input[list] dostaje szklaną listę (filtrowanie po wartości i etykiecie, strzałki, Enter, Escape) */
function hgSugUp(inp) {
  const lid = inp.getAttribute('list'), root = inp.getRootNode(); if (!lid || !root || !root.appendChild || inp.dataset.hgs) return;
  if (!root.querySelector('style[data-hgs]')) { const st = document.createElement('style'); st.dataset.hgs = '1'; st.textContent = HGS_CSS; (root.head || root).appendChild(st); }
  const id = 'hgs' + (++hgsN); inp.dataset.hgs = id; inp.removeAttribute('list'); inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false');
  const items = () => { const dl = root.getElementById ? root.getElementById(lid) : root.querySelector('#' + CSS.escape(lid)); return dl ? [...dl.options].map((o) => [o.value, o.textContent || o.label || '']) : []; };
  let L = null, act = -1, cur = [];
  const close = () => { if (!L) return; const l = L; L = null; hgsOpen.delete(gone); inp.setAttribute('aria-expanded', 'false'); l.classList.remove('in'); l.style.pointerEvents = 'none'; setTimeout(() => l.remove(), 240); removeEventListener('scroll', place, true); removeEventListener('resize', place); };
  const gone = () => { if (!inp.isConnected) close(); };
  function place() { if (!L) return; const r = inp.getBoundingClientRect(), w = Math.max(r.width, 240); L.style.width = w + 'px'; L.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px'; L.style.top = (r.bottom + 6) + 'px'; L.style.maxHeight = Math.max(120, Math.min(300, innerHeight - r.bottom - 14)) + 'px';
    const b = L.getBoundingClientRect(), dx = b.left - parseFloat(L.style.left), dy = b.top - (r.bottom + 6); if (Math.abs(dx) > .5) L.style.left = (parseFloat(L.style.left) - dx) + 'px'; if (Math.abs(dy) > .5) L.style.top = (parseFloat(L.style.top) - dy) + 'px'; }
  const mark = (i) => { act = i; if (!L) return; L.querySelectorAll('.hgs-o').forEach((n, k) => n.classList.toggle('on', k === i)); const n = L.children[i]; if (n) { inp.setAttribute('aria-activedescendant', n.id); n.scrollIntoView({ block: 'nearest' }); } };
  const pick = (i) => { const x = cur[i]; if (!x) return; inp.value = x[0]; close(); inp.dispatchEvent(new Event('input', { bubbles: true, composed: true })); inp.dispatchEvent(new Event('change', { bubbles: true, composed: true })); };
  const show = () => { const q = inp.value.trim().toLowerCase(); cur = items().filter(([v, l]) => !q || v.toLowerCase().includes(q) || l.toLowerCase().includes(q)).slice(0, 60);
    if (!cur.length || (cur.length === 1 && cur[0][0] === inp.value)) return close();
    if (!L) { L = document.createElement('ul'); L.className = 'hgs-l'; L.id = id + 'l'; L.setAttribute('role', 'listbox'); inp.setAttribute('aria-controls', L.id); root.appendChild(L); hgsOpen.add(gone); inp.setAttribute('aria-expanded', 'true');
      L.addEventListener('pointerdown', (e) => e.preventDefault()); L.addEventListener('click', (e) => { const li = e.target.closest('.hgs-o'); if (li) pick([...L.children].indexOf(li)); });
      addEventListener('scroll', place, true); addEventListener('resize', place); requestAnimationFrame(() => L && L.classList.add('in')); }
    L.innerHTML = cur.map(([v, l], i) => `<li class="hgs-o" role="option" id="${id}o${i}" style="opacity:1;transform:none"><span>${hgsEsc(l || v)}${l && l !== v ? `<small style="display:block;opacity:.6;font-size:12px">${hgsEsc(v)}</small>` : ''}</span></li>`).join(''); act = -1; place(); };
  inp.addEventListener('input', (e) => { if (e.isTrusted) show(); }); inp.addEventListener('focus', show); inp.addEventListener('blur', () => setTimeout(close, 120));
  inp.addEventListener('keydown', (e) => { if (!L) { if (e.key === 'ArrowDown') { e.preventDefault(); show(); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(cur.length - 1, act + 1)); } else if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(0, act - 1)); }
    else if (e.key === 'Enter' && act >= 0) { e.preventDefault(); pick(act); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } });
}
function hgSelWatch(root) {
  if (!root || root.__hgs) return; root.__hgs = 1;
  const scan = () => { root.querySelectorAll('select:not([data-hgs])').forEach(hgSelUp); root.querySelectorAll('input[list]:not([data-hgs])').forEach(hgSugUp); if (typeof hgColorUp === 'function') root.querySelectorAll('input[type=color]:not([data-hgc])').forEach(hgColorUp); };
  new MutationObserver((m) => { hgsOpen.forEach((f) => f()); if (m.some((r) => r.addedNodes.length)) scan(); }).observe(root, { childList: true, subtree: true }); scan();
}
window.hgSelWatch = hgSelWatch;
