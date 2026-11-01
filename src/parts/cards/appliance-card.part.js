/* Urządzenie AGD jako osobny widżet, ten sam widok co w pokoju */
class HGApplianceCard extends HGRoomCard {
  defaults() { return { entity: '', device: '', areas: {} }; }
  _dev() { const h = this._hass, c = this._config, r = (h.entities || {})[c.entity]; return c.device || (r && r.device_id) || ''; }
  _devEnts() { const h = this._hass, d = this._dev(), reg = h.entities || {}; if (!d) return this._config.entity && h.states[this._config.entity] ? [this._config.entity] : [];
    return Object.keys(h.states).filter((e) => reg[e] && reg[e].device_id === d && !reg[e].hidden && !reg[e].entity_category); }
  ents() { return this._hass ? this._devEnts() : []; }
  _area() { return null; }
  _extraSig() { return [this._dev(), [...(this._devOpen || [])].join(',')]; }
  _changed() { return HGBase.prototype._changed.call(this); }
  render() { const h = this._hass, d = this._dev(), ents = this._devEnts(); this._a = { id: '_app', name: '', strip: [], ents };
    const out = ents.length ? this._devCard({ d: d || ents[0], ents }, this._a) : null;
    return out || `<ha-card class="glass"><div class="empty"><b>${hgT('cards.appliance.no_device')}</b>${hgT('cards.appliance.pick_an_entity_of')}</div></ha-card>`; }
}
hgReg('hg-appliance-card', HGApplianceCard, hgTLazy('cards.appliance.picker_name'), hgTLazy('cards.appliance.picker_description'));
