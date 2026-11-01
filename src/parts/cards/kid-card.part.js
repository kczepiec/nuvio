/* --- dziecko w żłobku / przedszkolu (integracja LiveKid): obecność, przyjście i wyjście, posiłki, aktualności, rachunek.
   Encje wykrywane same; przy kilku dzieciach opcja child (imię) albo entity (binary_sensor obecności dziecka). --- */
class HGKidCard extends HGBase {
  defaults() { return { title: '', child: '', entity: '' }; }
  _kid() { const h = this._hass, c = this._config, L = HGLiveKid.kids(h);
    return L.find((k) => (c.entity && k.ids.present === c.entity) || (c.child && k.name.toLowerCase().includes(String(c.child).toLowerCase()))) || L[0] || null; }
  ents() { const k = this._hass && this._kid(); return k ? Object.values(k.ids) : []; }
  _extraSig() { return this._hass ? HGLiveKid.groups(this._hass).map((g) => Object.values(g.ids).join()).join('|') : ''; }
  css() { return HG_G14_CSS + `.li .vl small{ display:block; font-size:11px; font-weight:500; opacity:.7; text-align:right; } .li.od .vl, .li.od > ha-icon{ color:#FF6B57; }
.li.mu .vl{ font-weight:500; opacity:.7; } .em{ opacity:.6; font-size:13px; } .li{ all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:10px; min-height:40px; padding:4px 2px; min-width:0; }
.li + .li{ border-top:1px solid color-mix(in srgb, currentColor 8%, transparent); }`; }
  render() { const h = this._hass, c = this._config, k = this._kid();
    if (!k) return `<ha-card class="glass">${hgHead('mdi:human-child', c.title || hgT('cards.kid.child'), '', false)}<div class="em">${hgT('cards.kid.no_child_data')}</div></ha-card>`;
    const st = k.present ? hgT('common.at_facility') : hgT('cards.kid.away'), inT = k.inToday || k.lastIn, outT = k.outToday || k.lastOut;
    const row = (ic, nm, vl, e, cls = '', sub = '') => `<button class="li ${cls}" data-act="more" data-e="${H.esc(e || '')}">${H.icon(ic)}<span class="nm">${H.esc(nm)}</span><span class="vl">${H.esc(vl)}${sub ? `<small>${H.esc(sub)}</small>` : ''}</span></button>`;
    const none = hgT('cards.kid.none'), rows = [
      row('mdi:login', hgT('common.check_in'), inT || '--:--', k.ids.last_check_in || k.ids.present, inT ? '' : 'mu'),
      row('mdi:logout', hgT('common.check_out'), outT || '--:--', k.ids.last_check_out || k.ids.present, outT ? '' : 'mu'),
      k.ids.meals_today ? row('mdi:silverware-fork-knife', hgT('cards.kid.meals_today'), k.mealsOn ? k.meals : none, k.ids.meals_today, k.mealsOn ? '' : 'mu') : '',
      k.unread != null ? row('mdi:bell-badge-outline', hgT('cards.kid.unread'), String(k.unread), k.ids.unread_feed, k.unread ? 'al' : 'mu') : '',
      k.bill ? row('mdi:cash', hgT('cards.kid.bill'), k.billNum > 0 ? k.bill : hgT('cards.kid.paid'), k.ids.bill_to_pay, k.billNum > 0 ? (k.overdue ? 'od' : '') : 'mu',
        k.billNum > 0 && k.due ? (k.overdue ? hgT('cards.kid.overdue_since', { date: k.due }) : hgT('cards.kid.due_date', { date: k.due })) : '') : ''].join('');
    return `<ha-card class="glass">${hgHead(k.present ? 'mdi:human-child' : 'mdi:home-outline', c.title || k.name || hgT('cards.kid.child'), '', k.present, `<span class="cnt${k.present ? ' al' : ''}">${H.esc(st)}</span>`)}<div class="ls">${rows}</div></ha-card>`; }
  onAct(a, t) { if (a === 'more') hgMore(this, t.dataset.e); }
  getCardSize() { return 4; }
  getGridOptions() { return { columns: 6, rows: 4 }; }
}
hgReg('hg-kid-card', HGKidCard, hgTLazy('cards.kid.picker_name'), hgTLazy('cards.kid.picker_description'));
