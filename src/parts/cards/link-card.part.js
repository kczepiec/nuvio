/* --- LINK --- */
class HGLinkCard extends HGBase {
  defaults() { return { title: hgT('common.open'), subtitle: '', icon: 'mdi:open-in-new', action: null, entity: null }; }
  css() {
    return U(`
ha-card.glass{ display:flex; align-items:center; gap:var(--s2); cursor:pointer; }
.bub{ width:34u; height:34u; border-radius:var(--r-sm); background:rgba(255,255,255,.85); display:flex; align-items:center; justify-content:center; flex:none; }
.bub ha-icon{ width:18u; height:18u; }
b{ display:block; font-size:var(--fs-md); font-weight:400; } span{ display:block; font-size:var(--fs-xs); color:#6A6E74; margin-top:2u; }
.chev{ margin-left:auto; width:16u; height:16u; color:#4D5157; }
`);
  }
  render() {
    const c = this._config; const s = c.entity && H.st(this._hass, c.entity);
    const sub = c.subtitle || (s ? H.T(this._hass, s) : '');
    return `<ha-card class="glass" data-act="go" role="link" tabindex="0"><span class="bub">${H.icon(c.icon)}</span><div><b>${H.esc(c.title)}</b><span>${H.esc(sub)}</span></div>${H.icon('mdi:chevron-right', 'chev')}</ha-card>`;
  }
  onAct() { H.action(this, this._hass, this._config.action); }
}
hgReg('hg-link-card', HGLinkCard, hgTLazy('cards.link.picker_name'), hgTLazy('cards.link.picker_description'));
