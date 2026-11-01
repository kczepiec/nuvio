/* --- NAWILŻACZ: docelowa wilgotność na łuku, bieżąca wilgotność i tryby jako pigułki --- */
class HGHumidifierCard extends HGArcCard {
  static getStubConfig(h) { return { entity: hgStub(h, ['humidifier']) || null }; }
  defaults() { return { entity: null, name: null, icon: 'mdi:air-humidifier' }; }
  css() { return super.css() + U(`.pm{ display:flex; gap:4u; flex-wrap:wrap; justify-content:center; } .cur{ text-align:center; font-size:var(--fs-sm); opacity:.7; }`); }
  extra(s) { const a = s.attributes, m = a.available_modes || [];
    return `${a.current_humidity != null ? `<div class="cur">${hgT('common.now_cap')} ${H.pct(H.fmt(a.current_humidity, 0))}${a.action ? ' · ' + H.esc(H.t(this._hass, s, 'action') || a.action) : ''}</div>` : ''}${m.length ? `<div class="pm hide-s">${m.map((x) => hgUI.pill(String(x).replace(/_/g, ' '), { act: 'mode', on: a.mode === x, data: { m: x } })).join('')}</div>` : ''}`; }
  onAct(a, t) { if (a === 'mode') return H.call(this._hass, 'humidifier', 'set_mode', { entity_id: this._config.entity, mode: t.dataset.m }); return super.onAct(a, t); }
}
hgReg('hg-humidifier-card', HGHumidifierCard, hgTLazy('cards.humidifier.picker_name'), hgTLazy('cards.humidifier.picker_description'));
