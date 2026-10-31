/* ===== Kopia układu (admin): eksport do pliku / schowka i import z pliku, przeciągnięcia lub wklejenia.
   Format: { format: 'nuvio-layout', schema, nuvio, exported, include, data: { wiz, s, app, pw, wall } } (dane jak w HGL.data).
   Przed importem bieżący układ trafia do localStorage (nuvio:layout-backup), „Przywróć poprzedni” cofa import jednym kliknięciem. */
const HGBackup = window.__hgBackup || (window.__hgBackup = {
  SCHEMA: 2, BK: 'nuvio:layout-backup', inc: null, st: null,
  CATS: [['views', 'wiz', 'mdi:view-dashboard-outline', hgTLazy('backup.cats.views')],
    ['layout', 's', 'mdi:view-grid-outline', hgTLazy('backup.cats.layout')],
    ['look', 'app', 'mdi:palette-outline', hgTLazy('backup.cats.look')],
    ['panel', 'pw', 'mdi:arrow-expand-horizontal', hgTLazy('backup.cats.panel')],
    ['wall', 'wall', 'mdi:tablet-dashboard', hgTLazy('backup.cats.wall')],
    ['studio', 'studio', 'mdi:view-dashboard-variant-outline', hgTLazy('backup.cats.studio')]],
  admin(p) { const h = p && p._hass; return !!(h && h.user && h.user.is_admin); },
  sel() { return this.inc || (this.inc = new Set(this.CATS.map((c) => c[0]))); },
  cl(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); },
  prev() { try { const v = JSON.parse(localStorage.getItem(this.BK) || 'null'); return v && v.data && v.data.s ? v : null; } catch (e) { return null; } },
  when(ts) { try { return new Date(ts).toLocaleString(HG_LOC(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } },
  /* ---- eksport ---- */
  build(sel) { const D = HGL.data || {}, data = {};
    for (const [id, k] of this.CATS) if (sel.has(id) && (k !== 'studio' || D[k])) data[k] = this.cl(D[k] || {});   /* pusta część też trafia do pliku: Zastąp ją wyczyści; studio tylko gdy istnieje, pusty {} zablokowałby pierwsze wygenerowanie */
    return { format: 'nuvio-layout', schema: this.SCHEMA, nuvio: String(HG_BUILD).split('+')[0], exported: new Date().toISOString(), include: this.CATS.filter((c) => sel.has(c[0]) && c[1] in data).map((c) => c[0]), data }; },
  text(sel) { return JSON.stringify(this.build(sel), null, 2); },
  download(p) { const t = this.text(this.sel()), d = new Date(), z = (n) => String(n).padStart(2, '0');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'application/json' }));
    a.download = `nuvio-uklad-${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    p._eToast(hgT('backup.layout_exported_to_a')); },
  async copy(p) { try { await navigator.clipboard.writeText(this.text(this.sel())); p._eToast(hgT('backup.layout_copied_to_the')); }
    catch (e) { p._eToast(hgT('backup.could_not_copy_the')); } },
  /* ---- odczyt, walidacja, migracja ---- */
  fail(msg) { const e = new Error(msg); e.hg = 1; throw e; },
  migrate(o) {
    /* schemat 1: surowy zapis HGL.data ({ v: 1, ts, s, app, wiz, pw }) z wersji bez eksportu */
    if (o.format == null && o.s && typeof o.s === 'object') return { format: 'nuvio-layout', schema: this.SCHEMA, nuvio: null, exported: o.ts ? new Date(o.ts).toISOString() : null, migrated: 1, data: { s: o.s, app: o.app, wiz: o.wiz, pw: o.pw, wall: o.wall } };
    if (o.format !== 'nuvio-layout' || !Number.isInteger(o.schema)) this.fail(hgT('backup.errors.not_a_backup'));
    if (o.schema > this.SCHEMA) this.fail(hgT('backup.errors.newer_schema', { schema: o.schema }));
    if (o.schema === 1) return Object.assign({}, o, { schema: this.SCHEMA, migrated: 1, data: o.data || o.layout });
    return o; },
  parse(t) { const ob = (x) => !!x && typeof x === 'object' && !Array.isArray(x), ar = (x) => x == null || Array.isArray(x);
    if (typeof t !== 'string' || !t.trim()) this.fail(hgT('backup.errors.empty'));
    if (t.length > 4e6) this.fail(hgT('backup.errors.too_large'));
    let o; try { o = JSON.parse(t.replace(/^\uFEFF/, '')); } catch (e) { this.fail(hgT('backup.errors.invalid_json')); }
    if (!ob(o)) this.fail(hgT('backup.errors.unknown_format'));
    o = this.migrate(o); const d = o.data;
    if (!ob(d)) this.fail(hgT('backup.errors.no_layout_data'));
    for (const k of ['s', 'wiz', 'app', 'pw', 'wall', 'studio']) if (d[k] != null && !ob(d[k])) this.fail(hgT('backup.errors.damaged_part', { part: k }));
    for (const [k, v] of Object.entries(d.s || {})) if (!ob(v) || !ar(v.order) || !ar(v.hidden) || !ar(v.added) || (v.size != null && !ob(v.size)) || (v.conf != null && !ob(v.conf))) this.fail(hgT('backup.errors.damaged_scope', { scope: k }));
    if (d.studio && (!Array.isArray(d.studio.items) || d.studio.items.some((x) => !ob(x) || typeof x.id !== 'string'))) this.fail(hgT('backup.errors.damaged_part', { part: 'studio' }));
    if (d.wiz && (!ar(d.wiz.views) || !ar(d.wiz.custom) || (d.wiz.custom || []).some((c) => !ob(c) || typeof c.p !== 'string'))) this.fail(hgT('backup.errors.damaged_views'));
    if (!['s', 'wiz', 'app', 'pw', 'wall', 'studio'].some((k) => d[k] != null)) this.fail(hgT('backup.errors.nothing_to_import'));
    return o; },
  ents(d, h) { const out = new Set(), re = /^[a-z_]+\.[a-z0-9_]+$/;
    const dom = new Set([...Object.keys(h.states).map((e) => e.split('.')[0]), 'light', 'switch', 'sensor', 'binary_sensor', 'climate', 'media_player', 'camera', 'cover', 'fan', 'lock', 'person', 'weather', 'scene', 'script', 'automation', 'input_boolean', 'input_number', 'input_select', 'button', 'number', 'select', 'vacuum', 'water_heater', 'humidifier', 'valve', 'alarm_control_panel', 'calendar', 'device_tracker', 'update', 'siren', 'event', 'todo', 'lawn_mower']);
    const walk = (x) => { if (typeof x === 'string') { for (const q of x.split('|')) if (re.test(q) && dom.has(q.split('.')[0])) out.add(q); } else if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) { walk(k); walk(v); } };
    walk(d.s || {}); walk(((d.wiz || {}).custom) || []); walk(((d.wiz || {}).areas) || {}); walk(((d.wiz || {}).fuel) || []); return [...out].sort(); },
  sum(o, h) { const d = o.data, w = d.wiz || {}, S = d.s || {}, E = this.ents(d, h);
    return { views: (w.views || []).length, custom: (w.custom || []).length, widgets: Object.values(S).reduce((n, x) => n + ((x.added || []).length), 0), scopes: Object.keys(S).length,
      hidden: Object.values(S).reduce((n, x) => n + ((x.hidden || []).length), 0), ents: E.length, miss: E.filter((e) => !h.states[e]), accent: d.app && /^#[0-9a-f]{6}$/i.test(d.app.accent || '') ? d.app.accent : null }; },
  /* ---- zastosowanie ---- */
  apply(p, o, mode, sel) { const D = HGL.data, d = o.data, prev = this.cl(D);
    try { localStorage.setItem(this.BK, JSON.stringify({ ts: Date.now(), data: prev })); } catch (e) { /* pełny localStorage: kopia tylko w pamięci */ } this._mem = { ts: Date.now(), data: prev };
    for (const [id, k] of this.CATS) { if (!sel.has(id) || d[k] == null) continue; const v = this.cl(d[k]);
      if (mode === 'replace') D[k] = v;
      else if (k === 'wiz') { const a = D.wiz || {}, w = Object.assign({}, a, v), cu = new Map([...(a.custom || []), ...(v.custom || [])].map((c) => [c.p, c]));
        w.custom = [...cu.values()]; w.views = [...new Set([...(a.views || []), ...(v.views || [])])]; w.hints = Object.assign({}, a.hints, v.hints); D.wiz = w; }
      else D[k] = Object.assign({}, D[k] || {}, v); }
    return this.commit(p, JSON.stringify(prev.wiz || null) !== JSON.stringify(D.wiz || null), true); },
  restore(p) { const b = this._mem || this.prev(); if (!b) return p._eToast(hgT('backup.no_previous_layout_to'));
    const cur = HGL.data, nd = this.cl(b.data); nd.uid = cur.uid; HGL.data = nd; try { localStorage.removeItem(this.BK); } catch (e) { /* bez znaczenia */ } this._mem = null;
    return this.commit(p, JSON.stringify(cur.wiz || null) !== JSON.stringify(nd.wiz || null), false); },
  async commit(p, reload, offer) { HGL._ls(); HGApp.apply(); let w = 'local'; try { w = await HGL.save(p._hass); } catch (e) { /* zapis lokalny */ }
    if (p._editing) p._eSnap = JSON.stringify(HGL.data);   /* Anuluj w trybie edycji nie cofa importu */
    HGL.notify();
    const msg = offer ? hgT('backup.layout_imported') : hgT('backup.previous_layout_restored');
    if (reload && !window.__hgDryRun) { try { sessionStorage.setItem('nuvio:bk-msg', JSON.stringify({ msg, offer })); } catch (e) { /* bez komunikatu po odświeżeniu */ } p._eToast(hgT('backup.reloading_message', { message: msg })); setTimeout(() => location.reload(), 700); return w; }
    if (p._eRefresh) p._eRefresh(true);
    if (offer) p._eToast(msg, () => this.restore(p), hgT('backup.restore_previous')); else p._eToast(msg);
    return w; },
  /* po odświeżeniu (zmiana widoków): komunikat z przyciskiem cofnięcia */
  offer(p) { let m = null; try { m = JSON.parse(sessionStorage.getItem('nuvio:bk-msg') || 'null'); sessionStorage.removeItem('nuvio:bk-msg'); } catch (e) { return; } if (!m) return;
    if (m.offer && this.prev()) p._eToast(m.msg, () => this.restore(p), hgT('backup.restore_previous')); else p._eToast(m.msg); },
  /* ---- UI: sekcja w arkuszu Wygląd ---- */
  chk(on) { return `<i class="bk-cb" aria-hidden="true">${on ? H.icon('mdi:check') : ''}</i>`; },
  html(p) { if (!this.admin(p)) return ''; const s = this.sel(), pv = this.prev(), none = !s.size;
    return `<section class="lk-g bk" data-tab="bk" data-pg="backup" aria-labelledby="bk-h"><style>${HG_BK_CSS}</style><h4 id="bk-h">${H.icon('mdi:backup-restore')}${hgT('backup.layout_backup')}</h4><small class="lk-hn">${hgT('backup.save_the_layout_to')}</small>
      <div class="bk-inc" role="group" aria-label="${hgT('backup.what_the_backup_contains')}">${this.CATS.map(([id, , ic, t]) => `<button type="button" role="checkbox" aria-checked="${s.has(id)}" data-hge="bk-inc" data-k="${id}">${this.chk(s.has(id))}${H.icon(ic)}<span>${t}</span></button>`).join('')}</div>
      <div class="bk-row"><button type="button" class="bk-p" data-hge="bk-exp" ${none ? 'disabled' : ''}>${H.icon('mdi:download')}<span>${hgT('backup.export')}</span></button><button type="button" class="bk-s" data-hge="bk-copy" ${none ? 'disabled' : ''}>${H.icon('mdi:content-copy')}<span>${hgT('backup.copy_to_clipboard')}</span></button><button type="button" class="bk-s" data-hge="bk-imp">${H.icon('mdi:upload')}<span>${hgT('backup.import')}</span></button></div>
      ${pv ? `<button type="button" class="bk-u" data-hge="bk-undo">${H.icon('mdi:history')}<span>${hgT('backup.restore_previous_layout')}<small>${hgT('backup.from_before_the_import')}, ${H.esc(this.when(pv.ts))}</small></span></button>` : ''}</section>`; },
  /* krok importu: źródło (plik / przeciągnij / wklej), potem podsumowanie i wybór trybu */
  imp(p) { const h = p._hass, st = this.st, o = st.o, sm = o && this.sum(o, h), d = o && o.data;
    const src = `<div class="bk-drop" tabindex="0" role="button" data-hge="bk-file" aria-describedby="bk-dh">${H.icon('mdi:file-upload-outline')}<b>${hgT('backup.choose_a_file_or')}</b><small id="bk-dh">${hgT('backup.a_json_file_exported')}</small></div><input type="file" class="bk-f" accept=".json,application/json" hidden>
      <label class="hs-fl"><span>${hgT('backup.or_paste_json')}</span><textarea class="bk-ta nf-area code" rows="4" spellcheck="false" placeholder='{ "format": "nuvio-layout", … }'></textarea></label><div class="bk-row r"><button type="button" class="bk-s" data-hge="bk-paste">${H.icon('mdi:clipboard-text-outline')}<span>${hgT('backup.load_pasted_text')}</span></button></div>`;
    const prv = o ? `<div class="bk-file">${H.icon('mdi:file-check-outline')}<span><b>${H.esc(st.name || hgT('backup.pasted_text'))}</b><small>${o.nuvio ? 'Nuvio v' + H.esc(o.nuvio) : hgT('backup.older_format')}${o.exported ? ' · ' + H.esc(this.when(o.exported)) : ''}${o.migrated ? ' · ' + hgT('backup.converted_from_older_schema') : ''}</small></span><button type="button" class="bk-s sm" data-hge="bk-again">${hgT('backup.other_file')}</button></div>
      <div class="bk-st" role="list">${[[sm.views, hgT('backup.views'), 'mdi:view-dashboard-outline'], [sm.custom, hgT('backup.custom_views'), 'mdi:view-grid-plus-outline'], [sm.widgets, hgT('backup.added_widgets'), 'mdi:widgets-outline'], [sm.scopes, hgT('backup.sections_with_settings'), 'mdi:view-grid-outline'], [sm.ents, hgT('backup.entities'), 'mdi:devices']].map(([n, l, ic]) => `<span role="listitem">${H.icon(ic)}<b>${n}</b><small>${l}</small></span>`).join('')}</div>
      ${sm.miss.length ? `<div class="bk-miss" role="note"><b>${H.icon('mdi:alert-outline')}${hgT('backup.missing_entities', { count: sm.miss.length, total: sm.ents })}</b><small>${hgT('backup.widgets_with_these_entities')}</small><div class="bk-ch">${sm.miss.slice(0, 40).map((e) => `<code>${H.esc(e)}</code>`).join('')}${sm.miss.length > 40 ? `<em>+${sm.miss.length - 40}</em>` : ''}</div></div>` : sm.ents ? `<div class="bk-ok">${H.icon('mdi:check-circle-outline')}${hgT('backup.all_entities_from_the')}</div>` : ''}
      <div class="hs-fl"><span>${hgT('backup.what_to_import')}</span><div class="bk-inc" role="group" aria-label="${hgT('backup.what_to_import')}">${this.CATS.filter(([, k]) => d[k] != null).map(([id, , ic, t]) => `<button type="button" role="checkbox" aria-checked="${st.sel.has(id)}" data-hge="bk-isel" data-k="${id}">${this.chk(st.sel.has(id))}${H.icon(ic)}<span>${t}</span>${id === 'look' && sm.accent ? `<i class="bk-sw" style="background:${sm.accent}" aria-hidden="true"></i>` : ''}</button>`).join('')}</div></div>
      <div class="hs-fl"><span id="bk-mh">${hgT('backup.mode')}</span><div class="bk-md" role="radiogroup" aria-labelledby="bk-mh">${[['replace', hgT('backup.replace'), hgT('backup.the_chosen_parts_replace'), 'mdi:swap-horizontal'], ['merge', hgT('backup.merge'), hgT('backup.adds_sections_and_views'), 'mdi:call-merge']].map(([m, l, t, ic]) => `<button type="button" role="radio" aria-checked="${st.mode === m}" tabindex="${st.mode === m ? 0 : -1}" data-hge="bk-mode" data-k="${m}">${H.icon(ic)}<b>${l}</b><small>${t}</small></button>`).join('')}</div></div>
      <small class="bk-nt">${H.icon('mdi:shield-check-outline')}${hgT('backup.the_current_layout_is')}</small>` : '';
    const html = `<div class="hge-scrim" data-hge="sheetclose"></div><div class="hge-sheet wide bk-sh" role="dialog" aria-modal="true" aria-label="${hgT('backup.import_layout')}"><style>${HG_BK_CSS}</style><div class="hs-h"><b>${hgT('backup.import_layout')}</b><button class="hs-x" data-hge="sheetclose" aria-label="${hgT('common.close')}">${H.icon('mdi:close')}</button></div><div class="hs-sc">
      ${st.err ? `<div class="bk-err" role="alert">${H.icon('mdi:alert-circle-outline')}<span><b>${hgT('backup.cannot_import')}</b><small>${H.esc(st.err)}</small></span></div>` : ''}${o ? prv : src}</div>
      <div class="hs-ac"><button class="hs-b2" data-hge="cback">${hgT('common.back')}</button><button class="hs-b" data-hge="bk-apply" ${o && st.sel.size ? '' : 'disabled'}>${H.icon('mdi:upload')}<span>${st.mode === 'replace' ? hgT('backup.replace_layout') : hgT('backup.merge_layout')}</span></button></div></div>`;
    p._eSheet('cfg'); const S = p._eSheetEl; S.innerHTML = html; this.wire(p, S); },
  load(p, t, name) { const st = this.st; try { st.o = this.parse(t); st.err = null; st.name = name || null; st.sel = new Set(this.CATS.filter(([, k]) => st.o.data[k] != null).map((c) => c[0])); }
    catch (e) { st.o = null; st.err = e && e.hg ? e.message : hgT('backup.could_not_read_the'); }
    this.imp(p); requestAnimationFrame(() => { const f = p._eSheetEl && p._eSheetEl.querySelector(st.err ? '.bk-err' : '.bk-file'); if (f) { f.tabIndex = -1; f.focus({ preventScroll: true }); } }); },
  readFile(p, f) { if (!f) return; if (f.size > 4e6) { this.st.err = hgT('backup.errors.too_large'); this.st.o = null; return this.imp(p); }
    f.text().then((t) => this.load(p, t, f.name), () => this.load(p, '', f.name)); },
  wire(p, S) { const fi = S.querySelector('.bk-f'), dz = S.querySelector('.bk-drop'), ta = S.querySelector('.bk-ta');
    if (fi) fi.addEventListener('change', () => this.readFile(p, fi.files && fi.files[0]));
    if (dz) { dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fi.click(); } });
      ['dragenter', 'dragover'].forEach((t) => dz.addEventListener(t, (e) => { e.preventDefault(); dz.classList.add('on'); }));
      ['dragleave', 'drop'].forEach((t) => dz.addEventListener(t, () => dz.classList.remove('on')));
      dz.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) this.readFile(p, f); else { const t = e.dataTransfer && e.dataTransfer.getData('text'); if (t) this.load(p, t); } }); }
    const sh = S.querySelector('.bk-sh'); if (sh && !this.st.o) sh.addEventListener('paste', (e) => { if (e.target === ta) return; const t = e.clipboardData && e.clipboardData.getData('text'); if (t) { e.preventDefault(); this.load(p, t); } });
    const md = S.querySelector('.bk-md'); if (md) md.addEventListener('keydown', (e) => { const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return; e.preventDefault(); const bs = [...md.children], i = bs.indexOf(document.activeElement === md ? null : e.target.closest('button')), n = bs[(i + k + bs.length) % bs.length]; n.click(); requestAnimationFrame(() => { const x = p._eSheetEl.querySelector(`.bk-md [data-k="${n.dataset.k}"]`); if (x) x.focus(); }); }); },
  act(p, b, a) { if (!this.admin(p)) return;
    if (a === 'bk-inc') { const s = this.sel(), k = b.dataset.k; s.has(k) ? s.delete(k) : s.add(k); return p._eLook(); }
    if (a === 'bk-exp') return this.download(p);
    if (a === 'bk-copy') return this.copy(p);
    if (a === 'bk-undo') return this.restore(p).then(() => { if (p._eSheetEl && p._eSheetEl.querySelector('.lk')) p._eLook(); });
    if (a === 'bk-imp') { this.st = { o: null, err: null, mode: 'merge', sel: new Set() }; return p._eGo(() => p._eLook(), () => this.imp(p)); }
    const st = this.st; if (!st) return;
    if (a === 'bk-file') return p._eSheetEl.querySelector('.bk-f').click();
    if (a === 'bk-paste') { const t = p._eSheetEl.querySelector('.bk-ta').value; return this.load(p, t); }
    if (a === 'bk-again') { st.o = null; st.err = null; return this.imp(p); }
    if (a === 'bk-isel') { const k = b.dataset.k; st.sel.has(k) ? st.sel.delete(k) : st.sel.add(k); return this.imp(p); }
    if (a === 'bk-mode') { st.mode = b.dataset.k; return this.imp(p); }
    if (a === 'bk-apply' && st.o && st.sel.size) { const o = st.o, m = st.mode, s = new Set(st.sel); this.st = null; p._eSheet(false); return this.apply(p, o, m, s); } },
});
const HG_BK_CSS = `
.bk ha-icon, .bk-sh ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; flex:none; }
.bk-inc{ display:flex; flex-direction:column; gap:6px; }
.bk-inc button{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:10px; min-height:44px; padding:8px 12px; border-radius:14px; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, none); font-size:13.5px; line-height:1.3; transition:background .2s; }
.bk-inc button:hover{ background:var(--hg-hover-fill, color-mix(in srgb, currentColor 8%, transparent)); } .bk-inc button:focus-visible, .bk-md button:focus-visible, .bk-row button:focus-visible, .bk-drop:focus-visible, .bk-u:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.bk-inc button > ha-icon{ --mdc-icon-size:20px; width:20px; height:20px; opacity:.75; flex:none; } .bk-inc span{ flex:1; min-width:0; }
.bk-cb{ flex:none; width:20px; height:20px; border-radius:6px; display:grid; place-items:center; box-shadow:inset 0 0 0 1.5px color-mix(in srgb, currentColor 45%, transparent); }
.bk-cb ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; } [aria-checked=true] > .bk-cb{ background:var(--hg-accent); color:var(--hg-on-accent); box-shadow:none; }
.bk-sw{ flex:none; width:18px; height:18px; border-radius:50%; box-shadow:inset 0 0 0 1px rgba(255,255,255,.3); }
.bk-row{ display:flex; flex-wrap:wrap; gap:8px; } .bk-row.r{ justify-content:flex-end; }
.bk-row > button, .bk-s{ all:unset; box-sizing:border-box; cursor:pointer; height:40px; padding:0 16px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; gap:8px; font-size:14px; font-weight:600; }
.bk-row ha-icon, .bk-s ha-icon, .bk-u > ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; }
.bk-row > .bk-p{ background:var(--hg-accent); color:var(--hg-on-accent); } .bk-row > .bk-s, .bk-file > .bk-s{ background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, inset 0 0 0 1px color-mix(in srgb, currentColor 18%, transparent)); } .bk-s.sm{ height:32px; padding:0 12px; font-size:13px; flex:none; }
.bk-row > button:disabled{ opacity:.4; cursor:default; }
.bk-u{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:14px; box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--hg-accent) 45%, transparent); color:var(--hg-accent-tx, inherit); font-size:13.5px; font-weight:600; }
.bk-u span{ display:flex; flex-direction:column; } .bk-u small{ font-weight:400; opacity:.7; font-size:12px; color:var(--primary-text-color, inherit); }
.bk-drop{ cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; text-align:center; min-height:150px; padding:20px; border-radius:20px; border:1.5px dashed color-mix(in srgb, var(--hg-accent) 70%, transparent); background:var(--hg-accent-faint, transparent); transition:background .2s, transform .2s; }
.bk-drop.on{ background:var(--hg-accent-soft, var(--hg-accent-faint)); transform:scale(1.01); } .bk-drop > ha-icon, .bk-sh .bk-drop > ha-icon{ --mdc-icon-size:36px; width:36px; height:36px; color:var(--hg-accent-tx, var(--hg-accent)); } .bk-drop b{ font-size:15px; } .bk-drop small{ opacity:.65; font-size:12.5px; max-width:340px; }
.bk-err{ display:flex; gap:10px; align-items:flex-start; padding:12px 14px; border-radius:16px; background:color-mix(in srgb, var(--error-color, #DB4437) 16%, transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--error-color, #DB4437) 45%, transparent); }
.bk-err > ha-icon{ color:var(--error-color, #DB4437); flex:none; } .bk-err span, .bk-file span{ display:flex; flex-direction:column; gap:2px; min-width:0; } .bk-err small{ font-size:13px; opacity:.85; }
.bk-file{ display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:16px; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, none); } .bk-file span{ flex:1; } .bk-file b{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .bk-file small{ opacity:.65; font-size:12px; } .bk-file > ha-icon{ color:var(--hg-accent-tx, var(--hg-accent)); flex:none; }
.bk-st{ display:grid; grid-template-columns:repeat(auto-fill, minmax(118px, 1fr)); gap:8px; }
.bk-st span{ display:flex; flex-direction:column; gap:2px; padding:12px; border-radius:16px; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, none); } .bk-st ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; opacity:.7; } .bk-st b{ font-size:22px; font-weight:600; font-variant-numeric:tabular-nums; } .bk-st small{ opacity:.65; font-size:12px; }
.bk-miss{ display:flex; flex-direction:column; gap:6px; padding:12px 14px; border-radius:16px; background:color-mix(in srgb, var(--warning-color, #FFA600) 14%, transparent); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--warning-color, #FFA600) 45%, transparent); }
.bk-miss b{ display:flex; align-items:center; gap:8px; font-size:14px; } .bk-miss b ha-icon{ color:var(--warning-color, #FFA600); } .bk-miss small{ opacity:.8; font-size:12.5px; }
.bk-ch{ display:flex; flex-wrap:wrap; gap:6px; } .bk-ch code{ font:12px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; padding:4px 8px; border-radius:8px; background:color-mix(in srgb, var(--warning-color, #FFA600) 18%, transparent); } .bk-ch em{ font-style:normal; font-size:12px; opacity:.7; align-self:center; }
.bk-ok{ display:flex; align-items:center; gap:8px; font-size:13px; color:var(--hg-accent-tx, inherit); }
.bk-md{ display:grid; grid-template-columns:1fr 1fr; gap:8px; } .bk-md button{ all:unset; box-sizing:border-box; cursor:pointer; display:grid; grid-template-columns:auto 1fr; column-gap:10px; row-gap:2px; align-items:center; padding:12px; border-radius:16px; background:var(--ui-sec, var(--hg-tile-bg)); box-shadow:var(--ui-rim, none); transition:background .2s; }
.bk-md button ha-icon, .bk-sh .bk-md button ha-icon{ grid-row:span 2; --mdc-icon-size:22px; width:22px; height:22px; } .bk-md b{ font-size:14px; } .bk-md small{ font-size:12px; opacity:.7; }
.bk-md button[aria-checked=true]{ background:var(--hg-accent); color:var(--hg-on-accent); } .bk-md button[aria-checked=true] small{ opacity:.85; }
.bk-nt{ display:flex; align-items:center; gap:8px; opacity:.7; font-size:12.5px; } .bk-nt ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; flex:none; }
.bk-sh .hs-sc{ display:flex; flex-direction:column; gap:14px; }
@media (max-width:600px){ .bk-md{ grid-template-columns:1fr; } .bk-row > button{ flex:1 1 100%; } }
@media (prefers-reduced-motion:reduce){ .bk-drop, .bk-inc button, .bk-md button{ transition:none; } }
`;
window.HGBackup = HGBackup;
