/* Szybkie akcje: okrągłe przyciski (sceny, skrypty, usługi) w szklanej pigułce */
class HGActionsCard extends HGBase {
  static getStubConfig(h) { const L = Object.keys((h && h.states) || {}).filter((e) => ['scene', 'script', 'light'].includes(hgDom(e))).slice(0, 4); return { actions: L.map((e) => ({ entity: e })) }; }
  defaults() { return { title: null, actions: [] }; }
  ents() { return (this._config.actions || []).map((a) => a.entity).filter(Boolean); }
  css() { return HG_NV_CSS + U(`
ha-card.glass{ flex-direction:row; align-items:center; justify-content:center; gap:var(--s1); padding:var(--s1) var(--s2); border-radius:var(--hg-radius-pill, 999px); flex-wrap:wrap; }
ha-card.glass.tt{ border-radius:var(--r-lg); flex-direction:column; align-items:stretch; padding:var(--s3); }
.row{ display:flex; gap:var(--s1); justify-content:center; flex-wrap:wrap; }
.it{ display:flex; flex-direction:column; align-items:center; gap:3u; } .it small{ font-size:var(--fs-xs); opacity:.7; max-width:60u; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
@container (max-width: 220px){ .it small{ display:none; } .nv-ib.lg{ --nv-ib: 26u; } }
`); }
  render() { const c = this._config, h = this._hass, A = c.actions || [];
    if (!A.length) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.actions.add_actions_in_the')}</span></ha-card>`;
    const lab = A.some((a) => a.name);
    const btns = A.map((a, i) => { const s = a.entity ? H.st(h, a.entity) : null, on = s && ['on', 'playing', 'open', 'home'].includes(s.state), nm = a.name || (a.entity ? H.name(h, a.entity) : a.service || '');
      const ic = a.icon || (s && s.attributes.icon) || ({ scene: 'mdi:palette-outline', script: 'mdi:play', light: 'mdi:lightbulb', switch: 'mdi:power' }[hgDom(a.entity)] || 'mdi:gesture-tap');
      const b = hgUI.iconBtn(ic, 'go', nm, { size: 'lg', on: !!on, data: { i } }); return lab ? `<div class="it">${b}<small>${H.esc(nm)}</small></div>` : b; }).join('');
    return c.title ? `<ha-card class="glass tt">${hgUI.header(c.title)}<div class="row">${btns}</div></ha-card>` : `<ha-card class="glass">${btns}</ha-card>`; }
  onAct(a, t) { if (a !== 'go') return; const x = (this._config.actions || [])[+t.dataset.i]; if (!x) return; H.haptic();
    if (x.service || x.navigate || x.url || x.more_info) return H.action(this, this._hass, x);
    if (x.entity) return hgPress(this, this._hass, x.entity, x.tap_action); }
  getGridOptions() { return { columns: 6, rows: 1 }; }
}
hgReg('hg-actions-card', HGActionsCard, hgTLazy('cards.actions.picker_name'), hgTLazy('cards.actions.picker_description'));
