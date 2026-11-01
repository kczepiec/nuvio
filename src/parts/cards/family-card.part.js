/* ===================== DOMOWNICY: awatary osób, kto jest w domu, przycisk dodania ===================== */
class HGFamilyCard extends HGBase {
  static getStubConfig() { return {}; }
  defaults() { return { title: hgT('cards.family.family'), persons: null, add: true }; }
  list() { const c = this._config, h = this._hass; return c.persons && c.persons.length ? c.persons : Object.keys((h && h.states) || {}).filter((e) => e.startsWith('person.')).sort(); }
  ents() { return this.list(); }
  _changed() { this._entsC = null; return super._changed(); }
  css() { return HG_NV_CSS + U(`
.ls{ display:flex; flex-direction:column; gap:var(--s1); }
.ls .nv-row{ font-size:max(14px, var(--fs-md)); align-items:baseline; }
.ls .nv-row > span:not(.dot){ font-weight:500; }
.ls .nv-row small{ font-size:max(12px, var(--fs-sm)); opacity:.72; margin-left:auto; }
.nv-hd .nv-tt{ font-size:max(15px, var(--fs-md)); font-weight:600; }
.hr0 .nv-name small{ font-size:max(13px, var(--fs-sm)); opacity:.75; }
ha-card.glass{ container-type:inline-size; } .hr0{ flex-wrap:wrap; row-gap:6u; } .hr0 .nv-avs{ min-width:0; }
.ls .nv-row > span:not(.dot){ min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .ls .nv-row small{ min-width:0; max-width:55%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right; }
/* wąska karta (S): licznik nad awatarami, awatary ciaśniej, strefa pod imieniem */
@container (max-width: 300px){ .hr0 .nv-name{ flex:1 1 100%; } .hr0 .nv-avs .nv-av{ margin-left:-9u; } .hr0 .nv-avs .nv-ib{ margin-right:10u; }
  .ls .nv-row{ flex-wrap:wrap; column-gap:var(--s1); row-gap:0; } .ls .nv-row small{ flex:1 1 100%; max-width:none; margin-left:calc(8px + var(--s1)); text-align:left; font-size:var(--fs-xs); } }
.dot{ width:8px; height:8px; border-radius:50%; background:currentColor; opacity:.3; flex:none; } .dot.home{ background:var(--hg-accent); opacity:1; box-shadow:0 0 8px var(--hg-accent-glow); }
`); }
  render() { const c = this._config, h = this._hass, L = this.list().map((e) => ({ e, s: H.st(h, e) })).filter((x) => x.s);
    const home = L.filter((x) => x.s.state === 'home');
    const sub = L.length ? hgT('cards.family.home_of_total', { home: home.length, total: L.length }) : hgT('cards.family.no_people_in_home');
    const ppl = L.map((x) => ({ name: x.s.attributes.friendly_name || x.e, pic: x.s.attributes.entity_picture, home: x.s.state === 'home' }));
    return `<ha-card class="glass">${hgUI.header(c.title, { sub: '', right: '' })}<div class="nv-row hr0"><div class="nv-name"><small>${H.esc(sub)}</small></div>${hgUI.avatars(ppl, { add: c.add ? 'add' : null })}</div>
      <div class="ls show-l">${L.map((x) => `<div class="nv-row" data-key="p-${H.esc(x.e)}"><span class="dot ${x.s.state === 'home' ? 'home' : ''}"></span><span>${H.esc(x.s.attributes.friendly_name || x.e)}</span><small>${H.esc(H.T(h, x.s))}</small></div>`).join('')}</div></ha-card>`; }
  onAct(a) { if (a === 'add') H.navigate('/config/person'); }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-family-card', HGFamilyCard, hgTLazy('cards.family.picker_name'), hgTLazy('cards.family.picker_description'));
