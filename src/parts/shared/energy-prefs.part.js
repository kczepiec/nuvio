/* --- wspólne: preferencje panelu Energia HA (energy/get_prefs) --- */
const HGEnergyPrefs = {
  async get(hass) {
    if (this._v && Date.now() - this._t < 10 * 60 * 1000) return this._v;
    if (this._p) return this._p;
    this._p = hass.callWS({ type: 'energy/get_prefs' }).then((p) => {
      const src = p.energy_sources || [];
      const grid = src.filter((s) => s.type === 'grid'), solar = src.filter((s) => s.type === 'solar');
      // HA 2025+: grid ma flow_from[]; starsze wersje: stat_energy_from bezpośrednio
      const cons = grid.flatMap((g) => (g.flow_from ? g.flow_from.map((f) => f.stat_energy_from) : [g.stat_energy_from])).filter(Boolean);
      const prices = grid.flatMap((g) => (g.flow_from ? g.flow_from : [g])).map((f) => f.number_energy_price).filter((x) => x != null);
      const v = { src, consumption: cons, production: solar.map((s) => s.stat_energy_from).filter(Boolean),   // src: źródła w całości (moc stat_rate / power_config, poziom baterii stat_soc) dla karty przepływu
        price: prices.length && prices.every((x) => x === prices[0]) ? prices[0] : null };
      this._v = v; this._t = Date.now(); return v;
    }).finally(() => { this._p = null; });
    return this._p;
  },
};
