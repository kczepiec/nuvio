/* Jakość powietrza: CO2, PM, LZO, wilgotność i AQI, kolor wg progów */
/* [device_class, nazwa (tekst albo hgTLazy), ikona, progi (dobra / umiarkowana / słaba), skala paska, odwrotnie: wilgotność ma dobry zakres w środku] */
const HG_AIRQ = [
  ['carbon_dioxide', 'CO₂', 'mdi:molecule-co2', [800, 1200, 1600], 2000],
  ['pm25', 'PM2.5', 'mdi:blur', [12, 35, 55], 75],
  ['pm10', 'PM10', 'mdi:blur-linear', [54, 154, 254], 300],
  ['volatile_organic_compounds', hgTLazy('cards.airq.metrics.voc'), 'mdi:flask-outline', [300, 1000, 3000], 3500],
  ['volatile_organic_compounds_parts', hgTLazy('cards.airq.metrics.voc'), 'mdi:flask-outline', [220, 660, 2200], 2600],
  ['nitrogen_dioxide', 'NO₂', 'mdi:smoke', [40, 100, 200], 250],
  ['aqi', 'AQI', 'mdi:air-filter', [50, 100, 150], 300],
  ['humidity', hgTLazy('cards.airq.metrics.humidity'), 'mdi:water-percent', null, 100],
];
/* poziomy 0..3: [nazwa (hgTLazy), kolor] */
const HG_AIRQ_LV = [[hgTLazy('cards.airq.levels.good'), '#2FB36B'], [hgTLazy('cards.airq.levels.moderate'), '#F5B83D'], [hgTLazy('cards.airq.levels.poor'), '#FF8A3D'], [hgTLazy('cards.airq.levels.bad'), '#FF4D4F']];
/* poziom 0..3; wilgotność: 40–60% dobrze, 30–70% umiarkowanie, 20–80% słabo */
const hgAirqLv = (m, v) => { if (!m[3]) { const d = Math.max(0, Math.abs(v - 50) - 10); return d === 0 ? 0 : d <= 10 ? 1 : d <= 20 ? 2 : 3; } return m[3].findIndex((t) => v < t) === -1 ? 3 : m[3].findIndex((t) => v < t); };
class HGAirqCard extends HGBase {
  static getStubConfig() { return { entities: [] }; }
  defaults() { return { title: null, entities: [] }; }
  /* puste = po jednym czujniku z każdej klasy (najpierw ten sam obszar co pierwszy CO2 / PM2.5) */
  _list() { const c = this._config, h = this._hass, S = h.states, R = h.entities || {};
    if (c.entities && c.entities.length) return c.entities.filter((e) => S[e]);
    const all = hgEnts(h, ['sensor']), anchor = all.find((e) => ['carbon_dioxide', 'pm25'].includes(S[e].attributes.device_class)), ar = anchor && R[anchor] && R[anchor].area_id;
    return HG_AIRQ.map((m) => { const L = all.filter((e) => S[e].attributes.device_class === m[0] && isFinite(parseFloat(S[e].state))); return (ar && L.find((e) => R[e] && R[e].area_id === ar)) || L[0]; })
      .filter((e, i, a) => e && !(i === HG_AIRQ.length - 1 && a.filter(Boolean).length < 2)); }
  ents() { return this._hass ? this._list() : (this._config.entities || []); }
  _extraSig() { return this._hass ? this._list().join() : ''; }
  css() { return HG_G14_CSS + U(`
.aq{ display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 128px), 1fr)); gap:8px; }
.mt{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; gap:6px; min-width:0; padding:10px 12px; border-radius:14px; background:color-mix(in srgb, currentColor 6%, transparent); transition:background-color var(--hg-t-base, 200ms); }
@media (hover:hover) and (pointer:fine){ .mt:hover{ background:color-mix(in srgb, currentColor 10%, transparent); } } .mt:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.mt .lb{ display:flex; align-items:center; gap:6px; font-size:12px; opacity:.72; min-width:0; } .mt .lb ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; flex:none; } .mt .lb span{ min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mt b{ font-size:22px; font-weight:600; letter-spacing:-.02em; font-variant-numeric:tabular-nums; white-space:nowrap; } .mt b small{ font-size:12px; font-weight:500; opacity:.66; margin-left:3px; letter-spacing:0; }
.mt .tk{ position:relative; height:6px; border-radius:3px; background:color-mix(in srgb, currentColor 12%, transparent); overflow:hidden; } .mt .tk i{ position:absolute; inset:0 auto 0 0; border-radius:3px; background:var(--c); transition:width .6s cubic-bezier(.2,.8,.2,1); }
.mt .st{ font-size:11.5px; font-weight:600; color:var(--c); }
.lvc{ flex:none; margin-left:auto; font-size:12px; font-weight:600; padding:3px 10px; border-radius:999px; color:#111214; background:var(--c); white-space:nowrap; }
@container (max-width: 400px){ .lvc{ display:none; } }
@container (max-width: 240px){ .aq{ gap:6px; } .mt{ flex-direction:row; flex-wrap:wrap; align-items:center; column-gap:8px; padding:8px 10px; } .mt .lb{ flex:1 1 0; } .mt b{ font-size:16px; } .mt .tk{ flex:1 0 100%; } .mt .st{ display:none; } .lvc{ display:none; } }
@media (prefers-reduced-motion:reduce){ .mt .tk i{ transition:none; } }
`); }
  render() { const c = this._config, h = this._hass, xs = this._list();
    if (!xs.length) return `<ha-card class="glass"><div class="ph"><b>${hgT('cards.airq.no_air_quality_sensors')}</b>${hgT('cards.airq.pick_co2_pm2_5')}</div></ha-card>`;
    let worst = -1;
    const tiles = xs.map((e) => { const s = h.states[e], a = s.attributes, m = HG_AIRQ.find((x) => x[0] === a.device_class) || [a.device_class, null, a.icon || 'mdi:gauge', null, 0], v = parseFloat(s.state), ok = isFinite(v);
      const lv = ok && (m[3] || m[0] === 'humidity') ? hgAirqLv(m, v) : -1; if (lv > worst) worst = lv;
      const col = lv < 0 ? 'currentColor' : HG_AIRQ_LV[lv][1], pct = ok && m[4] ? Math.max(3, Math.min(100, (v / m[4]) * 100)) : 0, nm = m[1] ? String(m[1]) : H.name(h, e);
      return `<button class="mt" style="--c:${col}" data-act="more" data-e="${H.esc(e)}" aria-label="${H.lv(H.esc(nm), `${ok ? H.fmt(v, v < 10 ? 1 : 0) : H.esc(H.t(h, s))} ${H.esc(a.unit_of_measurement || '')}${lv >= 0 ? ', ' + H.esc(HG_AIRQ_LV[lv][0]) : ''}`)}">
        <span class="lb">${H.icon(m[2])}<span>${H.esc(nm)}</span></span><b>${ok ? H.fmt(v, v < 10 ? 1 : 0) : '–'}${a.unit_of_measurement ? `<small>${H.esc(a.unit_of_measurement)}</small>` : ''}</b>
        ${m[4] ? `<span class="tk" aria-hidden="true"><i style="width:${pct.toFixed(1)}%"></i></span>` : ''}${lv >= 0 ? `<span class="st">${H.esc(HG_AIRQ_LV[lv][0])}</span>` : ''}</button>`; }).join('');
    const W = worst >= 0 ? HG_AIRQ_LV[worst] : null;
    return `<ha-card class="glass">${hgHead(worst >= 2 ? 'mdi:weather-windy-variant' : 'mdi:air-filter', c.title || hgT('common.air_quality'), W ? hgT('cards.airq.overall_level', { level: String(W[0]).toLowerCase() }) : '', worst >= 0 && worst < 2, W ? `<span class="lvc" style="--c:${W[1]}">${H.esc(W[0])}</span>` : '')}<div class="aq">${tiles}</div></ha-card>`; }
  onAct(a, t) { if (a === 'more') hgMore(this, t.dataset.e); }
  getGridOptions() { return { columns: 6, rows: 'auto' }; }
}
hgReg('hg-airq-card', HGAirqCard, hgTLazy('cards.airq.picker_name'), hgTLazy('cards.airq.picker_description'));
