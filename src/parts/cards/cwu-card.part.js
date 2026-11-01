/* ===================== CWU: ciepła woda użytkowa ===================== */
class HGCwuCard extends HGRoomCard {
  defaults() { return { cwu: null, areas: {} }; }
  ents() { const C = this._config.cwu; if (!C) return []; return [C.heater, C.heating, C.keep, C.power, C.remaining, C.consumption, ...(C.switches || []).map((x) => x[0]), ...(C.up ? [C.up.tank, C.up.switch, C.up.power, ...((C.up.co || []).map((x) => x[0]))] : [])].filter(Boolean); }
  _area() { return null; } _extraSig() { return 0; } _changed() { return HGBase.prototype._changed.call(this); }
  render() { this._a = { id: '_cw', name: '', strip: [] }; const C = this._config.cwu; if (!C || !C.heater) return `<ha-card class="glass"><div class="empty"><b>${hgT('cards.cwu.hot_water')}</b>${hgT('cards.cwu.choose_a_water_heater')}</div></ha-card>`;
    const C2 = Object.assign({ switches: [] }, C, C.up ? { up: Object.assign({ co: [] }, C.up) } : {}); return this._cwu(C2) + (C2.up ? this._cwuUp(C2.up) : ''); }
}
hgReg('hg-cwu-card', HGCwuCard, hgTLazy('cards.cwu.picker_name'), hgTLazy('cards.cwu.picker_description'));
