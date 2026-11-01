/* --- MEDIA --- */
class HGMediaCard extends HGBase {
  defaults() { return { name: null, icon: 'mdi:speaker', studio: false, now_playing: false }; }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s1); }
.row{ display:flex; align-items:center; gap:var(--s2); min-width:0; }
.art{ width:44u; height:44u; border-radius:var(--r-sm); flex:none; background:rgba(255,255,255,.75) center/cover; display:flex; align-items:center; justify-content:center; box-shadow:var(--hg-sh); }
.art ha-icon{ width:20u; height:20u; color:#4D5157; }
.tx{ min-width:0; flex:1; } .tx b{ display:block; font-size:var(--fs-md); font-weight:400; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tx span{ display:block; font-size:var(--fs-sm); color:#4D5157; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ctl{ display:flex; align-items:center; justify-content:center; gap:var(--s2); margin-top:auto; }
.cb{ width:max(30u, 40px); height:max(30u, 40px); border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.75); position:relative; }
.cb ha-icon{ width:20px; height:20px; } .cb.pp{ width:max(34u, 44px); height:max(34u, 44px); background:var(--hg-accent); } .cb.pp ha-icon{ width:24px; height:24px; }
@media (pointer:coarse){ .cb::before{ content:''; position:absolute; inset:-7px; } }
.playing .art{ animation: var(--hg-loop, hgpulse 3s ease-in-out infinite); }
/* now playing (studio): okładka, wykonawca, tytuł, pasek postępu, prev/play/next, plakietka źródła; stopnie wg szerokości kontenera */
ha-card.np{ container-type:inline-size; height:100%; justify-content:flex-start; gap:var(--s2); }
.np .npr{ display:flex; align-items:center; gap:var(--s2); min-width:0; flex:none; }
.np .art{ width:clamp(72px, 36cqi, 120px); height:auto; aspect-ratio:1; border-radius:var(--r-md); flex:none; background-color:color-mix(in srgb, currentColor 10%, transparent); color:inherit; }
.np .art ha-icon{ color:inherit; opacity:.75; width:32px; height:32px; }
.np .tx{ align-self:center; } .np .tx b{ font-size:var(--fs-lg, 17px); font-weight:600; } .np .tx span{ color:var(--hg-t2, #4D5157); }
.np .src{ flex:none; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--hg-inner-bg); color:var(--hg-accent-tx); box-shadow:var(--hg-inner-hi); } .np .src ha-icon{ width:18px; height:18px; }
.np .src.sp{ color:#1DB954; }
.np .pb{ height:4px; border-radius:2px; background:color-mix(in srgb, currentColor 18%, transparent); overflow:hidden; margin-top:auto; } .np .pb i{ display:block; height:100%; border-radius:2px; background:currentColor; opacity:.75; }
.np .ctl{ margin-top:var(--s1); gap:var(--s4); } .np .cb{ background:transparent; } .np .cb.pp{ background:transparent; color:inherit; } .np .cb.pp ha-icon{ width:32px; height:32px; }
@container (max-width: 219px){ .np .pb, .np .src, .np .ctl .cb:not(.pp), .np .kebab{ display:none; } .np .tx span{ display:none; } }
@container (min-width: 220px) and (max-width: 299px){ .np .src{ display:none; } }
@container (min-width: 420px){ .np .tx b{ font-size:20px; } }
/* kafel Studio ma stałą wysokość (container-type:size na .st-k): okładka maleje z cqh, potem znika pasek, okładka i podtytuł; tytuł i play zawsze w kaflu */
@container (max-height: 279px){ .np .art{ width:clamp(40px, min(36cqi, 120px, 40cqh), 120px); } }
@container (max-height: 219px){ .np .pb{ display:none; } .np .ctl{ margin-top:auto; } .np .cb.pp{ width:40px; height:40px; } }
@container (max-height: 149px){ .np .art, .np .src{ display:none; } .np .tx span{ display:none; } ha-card.np{ justify-content:space-between; } }
`);
  }
  render() {
    const c = this._config, s = H.st(this._hass, c.entity);
    const nm = c.name || H.name(this._hass, c.entity);
    if (!s) return `<ha-card class="glass"><div class="ph"><b>${H.esc(nm)}</b>${hgT('cards.media.entity_not_found')}</div></ha-card>`;
    const a = s.attributes, sf = a.supported_features || 0, st = s.state;
    const pic = a.entity_picture ? `style="background-image:url('${H.cssUrl(a.entity_picture)}')"` : '';
    const sub = [a.media_title, a.media_artist].filter(Boolean).join(' · ') || H.stateLabel(st);
    const AL = { prev: hgT('common.previous_track'), next: hgT('common.next_track'), on: hgT('common.turn_on'), off: hgT('common.turn_off') };
    const b = (f, act, ic, cls = '') => (sf & f ? `<button class="cb ${cls}" data-act="${act}" aria-label="${AL[act]}" title="${AL[act]}">${H.icon(ic)}</button>` : '');
    const unav = st === 'unavailable';
    if (c.studio || c.now_playing) return this._np(c, s, nm, AL, b);
    return `<ha-card class="glass ${st === 'playing' ? 'playing' : ''}"><div class="row"><div class="art" ${pic}>${pic ? '' : H.icon(c.icon)}</div>
      <div class="tx"><b>${H.esc(nm)}</b><span>${H.esc(sub)}</span></div>
      <button class="ib kebab" data-act="more" aria-label="${hgT('common.more')}" title="${hgT('common.more')}">${H.icon('mdi:dots-vertical')}</button></div>
      ${unav ? '' : `<div class="ctl">${b(16, 'prev', 'mdi:skip-previous')}${(sf & 1) || (sf & 16384) ? `<button class="cb pp" data-act="pp" aria-label="${hgT('cards.media.play_pause')}">${H.icon(st === 'playing' ? 'mdi:pause' : 'mdi:play')}</button>` : ''}${b(32, 'next', 'mdi:skip-next')}
        ${st === 'off' ? b(128, 'on', 'mdi:power') : b(256, 'off', 'mdi:power')}</div>`}</ha-card>`;
  }
  _np(c, s, nm, AL, b) {
    const a = s.attributes, sf = a.supported_features || 0, st = s.state, unav = st === 'unavailable';
    const pic = a.entity_picture ? `style="background-image:url('${H.cssUrl(a.entity_picture)}')"` : '';
    const dur = Number(a.media_duration), pos0 = Number(a.media_position), t0 = Date.parse(a.media_position_updated_at);
    const pos = isFinite(pos0) ? pos0 + (st === 'playing' && isFinite(t0) ? Math.max(0, (Date.now() - t0) / 1000) : 0) : NaN;
    const pc = dur > 0 && isFinite(pos) ? Math.max(0, Math.min(100, pos / dur * 100)) : 0;
    const app = String(a.app_name || a.source || ''), K = [[/spotify/i, 'mdi:spotify', 'sp'], [/youtube/i, 'mdi:youtube', ''], [/plex/i, 'mdi:plex', ''], [/apple|itunes/i, 'mdi:apple', ''], [/netflix/i, 'mdi:netflix', ''], [/cast|chromecast/i, 'mdi:cast', '']].find((k) => k[0].test(app));
    const badge = app ? `<span class="src ${K ? K[2] : ''}" title="${H.esc(app)}">${H.icon(K ? K[1] : 'mdi:music-note')}</span>` : '';
    const top = a.media_artist || a.media_title ? [a.media_artist || nm, a.media_title || ''] : [nm, H.stateLabel(st)];
    return `<ha-card class="glass np ${st === 'playing' ? 'playing' : ''}"><div class="npr"><div class="art" ${pic}>${pic ? '' : H.icon(c.icon)}</div>
      <div class="tx" data-act="more"><b>${H.esc(top[0])}</b><span>${H.esc(top[1])}</span></div>${badge}</div>
      ${unav ? '' : `<div class="pb" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pc)}"><i style="width:${pc.toFixed(1)}%"></i></div>
      <div class="ctl">${b(16, 'prev', 'mdi:skip-previous')}${(sf & 1) || (sf & 16384) ? `<button class="cb pp" data-act="pp" aria-label="${hgT('cards.media.play_pause')}">${H.icon(st === 'playing' ? 'mdi:pause' : 'mdi:play')}</button>` : ''}${b(32, 'next', 'mdi:skip-next')}</div>`}</ha-card>`;
  }
  getGridOptions() { return { columns: 6, rows: 3 }; }
  onAct(a) {
    const e = this._config.entity, id = { entity_id: e };
    const m = { prev: 'media_previous_track', next: 'media_next_track', pp: 'media_play_pause', on: 'turn_on', off: 'turn_off' };
    if (a === 'more') return H.fire(this, 'hass-more-info', { entityId: e });
    if (m[a]) return H.call(this._hass, 'media_player', m[a], id);
  }
}
hgReg('hg-media-card', HGMediaCard, hgTLazy('cards.media.picker_name'), hgTLazy('cards.media.picker_description'));
