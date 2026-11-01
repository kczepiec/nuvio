/* --- hg-phases-card: moc teraz na fazach (zużycie), napięcia, prądy; kolor wg obciążenia --- */
const hgLoadCol = (p) => (p < 70 ? 'var(--hg-accent)' : '#E5484D');
class HGPhasesCard extends HGBase {
  defaults() { return { title: hgT('common.power_now'), icon: 'mdi:flash-outline', phases: [], max_power: 17250, phase_max: 5750 }; }
  ents() { return this._config.phases.flatMap((p) => [p.power, p.voltage, p.current]).filter(Boolean); }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s2); padding:var(--s2) var(--s3) var(--s3); }
.hd .ic{ color:var(--hg-accent-tx); }
.tot{ display:flex; align-items:baseline; gap:var(--s1); flex-wrap:wrap; } .tot span{ white-space:nowrap; } .tot b{ font-size:calc(28u * var(--hg-fsv, 1)); font-weight:600; letter-spacing:-.02em; color:#16181B; } .tot span{ font-size:var(--fs-sm); color:#5A5E64; }
.lv{ font-style:normal; font-size:var(--fs-xs); font-weight:600; padding:2u var(--s1); border-radius:var(--r-sm); color:#111214; background:var(--c); white-space:nowrap; }
.ph{ display:grid; grid-template-columns:auto 1fr auto; align-items:center; column-gap:10u; row-gap:2u; padding:var(--s1) var(--s2); border-radius:var(--r-sm); background:rgba(255,255,255,.55); }
.ph .n{ font-size:var(--fs-sm); font-weight:600; color:#2A2D31; } .ph .w{ font-size:var(--fs-md); font-weight:600; font-variant-numeric:tabular-nums; text-align:right; }
.ph .b{ height:5u; border-radius:3u; background:rgba(0,0,0,.08); overflow:hidden; } .ph .b i{ display:block; height:100%; border-radius:3u; background:var(--c); transition:width .6s cubic-bezier(.2,.8,.2,1); }
.ph .va{ grid-column:1 / -1; display:flex; gap:var(--s2); font-size:var(--fs-xs); color:#5A5E64; font-variant-numeric:tabular-nums; }
.ph.na{ opacity:.55; }
.lst{ display:flex; flex-direction:column; gap:var(--s1); }
ha-card.glass{ container-type:inline-size; } .ph .va{ flex-wrap:wrap; row-gap:0; }
@container (max-width: 240px){ .hd .lv{ display:none; } .ph .va span:last-child{ display:none; } }
`);
  }
  render() {
    const c = this._config, h = this._hass;
    let tot = 0, n = 0;
    const rows = c.phases.map((p) => {
      const w = hgW(h, p.power), v = H.num(h, p.voltage), a = H.num(h, p.current);
      if (w == null) return `<div class="ph na"><span class="n">${H.esc(p.name)}</span><span class="b"></span><span class="w">–</span><div class="va">${hgT('cards.phases.unavailable')}</div></div>`;
      const ww = Math.abs(w); tot += ww; n++;
      const pct = Math.min(100, (ww / c.phase_max) * 100);
      return `<div class="ph" style="--c:${hgLoadCol(pct)}" title="${H.lv(H.esc(p.name), `${H.fmt(ww, 0)} W · ${H.pct(Math.round(pct))} ${hgT('common.of')} ${H.fmt(c.phase_max, 0)} W`)}"><span class="n">${H.esc(p.name)}</span>
        <span class="b" role="meter" aria-label="${hgT('cards.phases.load')} ${H.esc(p.name)}" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.max(1.5, pct).toFixed(1)}%"></i></span><span class="w">${H.fmt(ww, 0)} W</span>
        <div class="va"><span>${v != null ? H.fmt(v, 1) + ' V' : '– V'}</span><span>${a != null ? H.fmt(a, 2) + ' A' : '– A'}</span><span>${H.pct(Math.round(pct))} ${hgT('cards.phases.load_suffix')}</span></div></div>`;
    }).join('');
    const pct = Math.min(100, (tot / c.max_power) * 100), lvl = pct < 30 ? hgT('cards.phases.low') : pct < 70 ? hgT('cards.phases.medium') : hgT('cards.phases.high');
    const kw = tot >= 1000 ? [H.fmt(tot / 1000, 2), 'kW'] : [H.fmt(tot, 0), 'W'];
    return `<ha-card class="glass warm"><div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span><span class="sp"></span>${n ? `<em class="lv" style="--c:${hgLoadCol(pct)}">${hgT('cards.phases.level_load', { level: lvl })}</em>` : ''}</div>
      ${n ? `<div class="tot"><b>${kw[0]}</b><span>${kw[1]} · ${H.pct(Math.round(pct))} ${hgT('common.of')} ${H.fmt(c.max_power / 1000, 2)} kW</span></div>` : `<div class="ph"><b>${hgT('common.no_data_source')}</b></div>`}
      <div class="lst">${rows}</div></ha-card>`;
  }
  getCardSize() { return 4; }
}
hgReg('hg-phases-card', HGPhasesCard, hgTLazy('cards.phases.picker_name'), hgTLazy('cards.phases.picker_description'));
