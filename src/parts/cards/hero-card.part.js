/* --- POWITANIE (hero): „Hej, Krzysztof!” + hasło, opcjonalnie zdjęcie i stan encji --- */
class HGHeroCard extends HGBase {
  static getStubConfig() { return {}; }
  defaults() { return { title: null, subtitle: null, image: null, entity: null, glass: false, studio: false, auto_greeting: false, status: false, status_entities: null }; }
  css() { return HG_NV_CSS + U(`
ha-card.hero{ background:none; box-shadow:none; -webkit-backdrop-filter:none; backdrop-filter:none; justify-content:flex-end; gap:4u; padding:var(--s3) var(--s2); color:white; text-shadow:0 1px 10px color-mix(in srgb, black 35%, transparent); }
/* napis leży na zdjęciu tła, więc zawsze biały z cieniem (jak powitanie na stronie Nuvio), także w schemacie jasnym */
ha-card.hero.img{ background: linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.55)) , var(--img) center / cover no-repeat; color:#fff; text-shadow:0 1px 8px rgba(0,0,0,.35); box-shadow:var(--hg-edge), var(--hg-shadow-lg); }
.t{ font-size:var(--hg-fs-6, 40px); font-weight:600; letter-spacing:-.03em; line-height:1.05; margin:0; }
.s{ font-size:var(--hg-fs-5, 24px); font-weight:var(--hg-fw-num, 300); letter-spacing:-.02em; line-height:1.15; margin:0; opacity:.92; }
.st{ margin-top:6u; } .st .nv-pill{ background:color-mix(in srgb, black 28%, transparent); color:white; box-shadow:none; -webkit-backdrop-filter:var(--hg-bfo, blur(12px)); backdrop-filter:var(--hg-bfo, blur(12px)); }
@container (max-width: 300px){ .t{ font-size:var(--hg-fs-5, 24px); } .s{ font-size:var(--hg-fs-3, 15px); } }
@container (min-width: 560px){ .t{ font-size:56px; } .s{ font-size:32px; } }
/* studio: powitanie wg pory dnia + linia statusu z kropką; compact = mniejszy krój, expanded = duży nagłówek w dwóch wierszach */
.stl{ display:flex; align-items:center; gap:8u; margin-top:10u; font-size:var(--hg-fs-3, 15px); font-weight:400; opacity:.95; min-width:0; }
.stl span{ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dot{ flex:none; width:9u; height:9u; min-width:8px; min-height:8px; border-radius:50%; background:var(--hg-ok, #34C759); box-shadow:0 0 8px color-mix(in srgb, var(--hg-ok, #34C759) 70%, transparent); } .dot.warn{ background:var(--hg-warn, #FF9F0A); box-shadow:0 0 8px color-mix(in srgb, var(--hg-warn, #FF9F0A) 70%, transparent); }
.l2{ white-space:nowrap; }
@container (min-width: 460px){ .l2{ display:block; } .stl{ font-size:var(--hg-fs-4, 18px); } }
@container (min-width: 340px){ .t.sg{ font-size:clamp(40px, 12cqi, 64px); } }
@container (min-width: 560px){ .t.sg{ font-size:64px; } }
`); }
  _hour() { return new Date().getHours(); }
  /* ile rzeczy wymaga uwagi: odblokowane zamki, otwarte drzwi/okna/bramy, alarmy dymu/gazu/zalania, alarm wyzwolony */
  _attn() {
    const h = this._hass, c = this._config, L = (c.status_entities && c.status_entities.length ? c.status_entities : Object.keys((h && h.states) || {})); let n = 0;
    for (const e of L) { const s = h.states[e]; if (!s) continue; const d = e.split('.')[0], dc = s.attributes && s.attributes.device_class;
      if ((d === 'lock' && s.state === 'unlocked') || (d === 'alarm_control_panel' && s.state === 'triggered') || (d === 'binary_sensor' && s.state === 'on' && ['door', 'window', 'garage_door', 'opening', 'smoke', 'gas', 'moisture'].includes(dc))) n++; }
    return n;
  }
  render() { const c = this._config, h = this._hass, nm = hgFirstName(h), s = c.entity ? H.st(h, c.entity) : null, sg = !!(c.studio || c.auto_greeting || c.status);
    const hr = this._hour(), ag = c.studio || c.auto_greeting;
    const T = c.title ?? (ag ? (hr < 5 ? hgT('cards.hero.greeting_night', { name: nm }) : hr < 12 ? hgT('cards.hero.greeting_morning', { name: nm }) : hr < 18 ? hgT('cards.hero.greeting_afternoon', { name: nm }) : hgT('cards.hero.greeting_evening', { name: nm })) : hgT('cards.hero.greeting_title', { name: nm })), Sb = c.subtitle ?? (c.studio ? '' : hgT('cards.hero.your_whole_home_in'));
    /* pusty {name}: usuwa przecinek i zwykłe spacje przed «!», a spacja niełamliwa (typografia francuska) zostaje */
    const bang = (m) => (m.includes('\u00a0') ? '\u00a0!' : '!');
    const fill = (x) => String(x || '').replace(/\{name\}/g, nm).replace(/,\s*!/, bang).replace(/\s+!/, bang);
    const st = s ? `<div class="st">${hgUI.pill(H.lv(H.name(h, c.entity), H.t(h, s)), { icon: s.attributes.icon || 'mdi:information-outline', act: 'more' })}</div>` : '';
    const ft = fill(T), k = sg ? ft.indexOf(', ') : -1, hd = k > 0 ? `<span class="l1">${H.esc(ft.slice(0, k + 1))}</span> <span class="l2">${H.esc(ft.slice(k + 2))}</span>` : H.esc(ft);
    let sl = '';
    if (c.studio || c.status) { const n = this._attn(); sl = `<div class="stl"><i class="dot${n ? ' warn' : ''}" aria-hidden="true"></i><span>${H.esc(n ? hgT('cards.hero.attention', { count: n }) : hgT('cards.hero.all_set'))}</span></div>`; }
    return `<ha-card class="${c.glass ? 'glass' : 'glass hero'}${c.image ? ' img' : ''}"${c.image ? ` style="--img:url('${H.cssUrl(c.image)}')"` : ''}><h1 class="t${sg ? ' sg' : ''}">${hd}</h1>${Sb ? `<p class="s">${H.esc(fill(Sb))}</p>` : ''}${sl}${st}</ha-card>`; }
  onAct(a) { if (a === 'more' && this._config.entity) H.fire(this, 'hass-more-info', { entityId: this._config.entity }); }
  getGridOptions() { return { columns: 12, rows: 2 }; }
}
hgReg('hg-hero-card', HGHeroCard, hgTLazy('cards.hero.picker_name'), hgTLazy('cards.hero.picker_description'));
