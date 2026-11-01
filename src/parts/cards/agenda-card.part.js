/* Agenda: najbliższe wydarzenia pogrupowane po dniach */
class HGAgendaCard extends HGBase {
  defaults() { return { title: hgT('cards.agenda.upcoming'), icon: 'mdi:format-list-bulleted', calendars: [], days: 60 }; }
  ents() { return this._config.calendars.map((c) => (typeof c === 'string' ? c : c.entity)); }
  _extraSig() { return [this._n || 0, hgDayKey(new Date())]; }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s1); overflow:auto; container-type:inline-size; }
.day{ margin-top:10u; } .day h4{ margin:0 0 6u; font-size:var(--fs-md); font-weight:500; color:#4D5157; text-transform:none; line-height:1.35; }
.day h4 em{ font-style:normal; color:#1E2023; margin-right:5u; font-weight:600; }
.ev{ gap:var(--s2); align-items:flex-start; }
.ev i{ width:4u; align-self:stretch; border-radius:2u; flex:none; min-height:1.2em; }
.ev .tm{ font-size:var(--fs-md); color:#5A5E64; min-width:64u; flex:none; line-height:1.35; }
.ev .tx{ min-width:0; flex:1; } .ev b{ display:block; font-size:var(--fs-md); font-weight:500; line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ev small{ display:block; font-size:var(--fs-sm); color:#8A8E94; margin-top:2u; line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.none{ margin-top:10u; font-size:var(--fs-md); color:#6A6E74; }
@container (min-width: 420px){ .ev .tm, .ev b{ font-size:calc(var(--fs-md) * 1.05); } .ev small{ font-size:var(--fs-md); } }
`);
  }
  async _load() {
    const k = hgDayKey(new Date()); if (this._k === k) return; this._k = k;
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); const t1 = new Date(t0); t1.setDate(t1.getDate() + this._config.days);
    this._res = await HGCal.fetch(this._hass, HGCal.cals(this._hass, this._config.calendars), t0, t1); this._n = (this._n || 0) + 1; this.rerender();
    clearTimeout(this._rt); this._rt = setTimeout(() => { this._k = null; this.rerender(); }, 300000);
  }
  render() {
    const c = this._config;
    if (!c.calendars.length) return `<ha-card class="glass"><div class="ph"><b>${hgT('cards.agenda.no_calendars')}</b>${hgT('cards.agenda.no_calendar_entities_found')}</div></ha-card>`;
    this._load();
    const hd = `<div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span><small class="note" style="margin-left:4u">${hgT('cards.agenda.days_count', { count: c.days })}</small></div>`;
    if (!this._res) return `<ha-card class="glass">${hd}<div class="none">${hgT('common.loading')}</div></ha-card>`;
    const now = new Date(), t0 = new Date(now); t0.setHours(0, 0, 0, 0);
    const ev = this._res.flatMap((r) => r.ev).filter((e) => (e.allDay ? e.end > t0 : e.end >= now)).sort((a, b) => a.start - b.start);
    const groups = {};
    for (const e of ev) { const d = e.start < t0 ? t0 : e.start; (groups[hgDayKey(d)] = groups[hgDayKey(d)] || []).push(e); }
    const tom = new Date(t0); tom.setDate(tom.getDate() + 1);
    const lbl = (k) => { const d = new Date(k + 'T00:00:00'); const pre = k === hgDayKey(t0) ? hgT('common.today') : k === hgDayKey(tom) ? hgT('cards.agenda.tomorrow') : '';
      return `${pre ? `<em>${pre}</em>` : ''}${H.esc(d.toLocaleDateString(HG_LOC(), { weekday: 'long', day: 'numeric', month: 'long' }))}`; };
    const body = Object.keys(groups).map((k) => `<div class="day"><h4>${lbl(k)}</h4>${groups[k].map((e) => `<div class="ev lr" title="${H.esc(e.cal.name)}"><i style="background:${e.cal.color}"></i>
      <span class="tm">${e.allDay ? hgT('cards.agenda.all_day') : `${hgTime(e.start)}–${hgTime(e.end)}`}</span><div class="tx"><b>${H.esc(HGCal.title(e))}</b><small>${H.esc(e.cal.name)}${e.loc ? ' · ' + H.esc(e.loc) : ''}</small></div></div>`).join('')}</div>`).join('');
    const errs = this._res.filter((r) => r.err).map((r) => r.cal.name);
    return `<ha-card class="glass">${hd}${body || `<div class="none">${hgT('cards.agenda.no_events_days', { count: c.days })}</div>`}
      ${errs.length ? `<div class="note" style="margin-top:8u">${H.lv(hgT('common.unavailable'), `${H.esc(errs.join(', '))}`)}</div>` : ''}</ha-card>`;
  }
}
hgReg('hg-agenda-card', HGAgendaCard, hgTLazy('cards.agenda.picker_name'), hgTLazy('cards.agenda.picker_description'));
