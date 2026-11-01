/* ===================== LISTA ENCJI: wiersze z przełącznikiem, przyciskiem lub wartością ===================== */
class HGEntitiesCard extends HGBase {
  defaults() { return { title: hgT('cards.entities.entities'), icon: 'mdi:format-list-bulleted', entities: [] }; }
  ents() { return this._config.entities.map((x) => (typeof x === 'string' ? x : x.entity)); }
  css() { return HG_GEN_CSS + U(`
ha-card.glass{ display:flex; flex-direction:column; gap:4px; padding:16px; overflow:auto; }
.ghd{ display:flex; align-items:center; gap:8px; margin-bottom:4px; font-size:15px; font-weight:600; } .ghd ha-icon{ width:20px; height:20px; opacity:.8; }
.gr{ display:flex; align-items:center; gap:12px; min-height:56px; padding:4px 0; } .gr + .gr{ box-shadow:0 -1px 0 color-mix(in srgb, currentColor 8%, transparent); }
.gr .gn{ cursor:pointer; } .gr .gn:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; border-radius:8px; }
`); }
  render() { const c = this._config, h = this._hass;
    if (!c.entities.length) return `<ha-card class="glass"><div class="ph"><b>${hgT('cards.entities.add_entities')}</b>${hgT('cards.entities.a_list_with_toggles')}</div></ha-card>`;
    const rows = c.entities.map((x) => { const o = typeof x === 'string' ? { entity: x } : x, e = o.entity, s = H.st(h, e), d = hgDom(e), ok = H.ok(s), nm = o.name || H.name(h, e), pr = HG_PRESS_DOM.includes(d);
      const on = s && ['on', 'open', 'unlocked', 'playing', 'home'].includes(s.state), ic = o.icon || (s && s.attributes.icon) || HG_DOM_ICON2[d] || 'mdi:circle-outline';
      const num = s && isFinite(parseFloat(s.state)) && s.attributes.unit_of_measurement, val = num ? `${H.fmt(parseFloat(s.state), 1)}<small>${H.esc(s.attributes.unit_of_measurement)}</small>` : H.esc(H.t(h, s));
      const ctl = pr ? `<button class="gb" data-act="press" data-e="${H.esc(e)}" ${s && s.state !== 'unavailable' ? '' : 'disabled'}>${H.icon('mdi:play')}${hgT('cards.entities.run')}</button>`
        : ['light', 'switch', 'fan', 'input_boolean', 'siren', 'humidifier'].includes(d) ? `<button class="gsw" role="switch" data-act="tog" data-e="${H.esc(e)}" aria-checked="${!!on}" aria-label="${H.esc(nm)}" ${ok ? '' : 'disabled'}><span class="gkn"></span></button>`
        : `<span class="gv">${val}</span>`;
      return `<div class="gr ${ok || (pr && s && s.state !== 'unavailable') ? '' : 'un'}"><span class="gic ${on ? 'on' : ''}">${H.icon(ic)}</span><span class="gn" role="button" tabindex="0" data-act="more" data-e="${H.esc(e)}"><b>${H.esc(nm)}</b>${pr || /gsw/.test(ctl) ? `<small>${H.esc(H.t(h, s))}</small>` : ''}</span>${ctl}</div>`; }).join('');
    return `<ha-card class="glass"><div class="ghd">${H.icon(c.icon)}<span>${H.esc(c.title)}</span></div>${rows}</ha-card>`; }
  onAct(a, t) { const e = t.dataset.e, h = this._hass; if (!e) return;
    if (a === 'more') return H.fire(this, 'hass-more-info', { entityId: e });
    if (a === 'tog') return H.call(h, hgDom(e), 'toggle', { entity_id: e });
    if (a === 'press') return hgPress(this, h, e); }
  getGridOptions() { return { columns: 6, rows: 'auto' }; }
}
hgReg('hg-entities-card', HGEntitiesCard, hgTLazy('cards.entities.picker_name'), hgTLazy('cards.entities.picker_description'));
