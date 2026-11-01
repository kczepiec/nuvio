/* --- hg-net-card: widok „Sieć” (UniFi Network + Speedtest). Jedna klasa, sekcje: wan | gw | dev | wlan | cl.
   Konfiguracja jawna w build.py (CFG['net']); brakujące/niedostępne encje są pomijane. --- */
const hgPlK = (n) => hgT('cards.net.clients_label', { count: n });
const hgUp = (s) => { if (!s || !H.ok(s)) return null; const d = new Date(s.state); if (isNaN(d)) return null;
  const m = Math.max(0, (Date.now() - d) / 60000); if (m < 60) return `${Math.round(m)} min`; const hh = m / 60; if (hh < 48) return hgT('cards.net.hours_count', { count: Math.round(hh) }); return hgT('cards.net.days_count', { count: Math.round(hh / 24) }); };

class HGNetCard extends HGBase {
  defaults() { return { section: 'wan', net: {} }; }
  _n() { return this._config.net || {}; }
  _clientEnts() {
    const h = this._hass, n = this._n(), cl = n.clients || {}, ex = new Set(cl.exclude || []);
    const key = h.entities;      // rejestr encji: nowy obiekt przy każdej zmianie
    if (this._clK === key && this._clL) return this._clL;
    const L = Object.values(h.entities || {}).filter((e) => e.platform === (cl.platform || 'unifi') && e.entity_id.startsWith('device_tracker.') && !ex.has(e.entity_id) && !e.hidden).map((e) => e.entity_id);
    this._clK = key; this._clL = L; return L;
  }
  ents() {
    const n = this._n(), s = this._config.section, g = n.gateway || {}, w = n.wan || {};
    if (s === 'wan') return [g.state, g.tracker, g.uptime, ...(w.latency || []).map((x) => x.entity), w.down, w.up, w.ping].filter(Boolean);
    const pe = (L) => (L || []).map((p) => (typeof p === 'string' ? p : p.entity));
    if (s === 'gw') return [g.state, g.cpu, g.mem, g.temp, g.uptime, g.update, g.restart, g.clients, ...pe(g.ports)].filter(Boolean);
    if (s === 'dev') return (n.devices || []).flatMap((d) => [d.state, d.cpu, d.mem, d.uptime, d.clients, d.update, d.restart, ...pe(d.ports)]).filter(Boolean);
    if (s === 'wlan') return (n.wlans || []).flatMap((x) => [x.switch, x.clients, x.qr]).filter(Boolean);
    if (s === 'cl') return [...this._clientEnts(), ...(n.wlans || []).map((x) => x.clients).filter(Boolean)];
    return [];
  }
  _extraSig() { return [this._config.section === 'wan' ? (this._hist || []).length : 0, this._flt, this._srt, Math.floor(Date.now() / 60000)]; }
  set hass(h) { const first = !this._hass; this._hass = h; window.__hgHass = h; if (first && this._config.section === 'wan') this._ldHist(); this._update(); }
  get hass() { return this._hass; }
  connectedCallback() { super.connectedCallback(); if (this._hass && this._config && this._config.section === 'wan' && !this._hT) this._ldHist(); }
  disconnectedCallback() { clearTimeout(this._hT); this._hT = 0; }
  async _ldHist() {
    const h = this._hass, w = this._n().wan || {}, e = (w.latency || [])[0]; if (!h || !e || this._hl) return; this._hl = true; clearTimeout(this._hT); this._hT = 0;
    try {
      this._hist = (await hgHistory(h, e.entity, 24)).map((x) => x.v); this.rerender();
    } catch (err) { this._hist = []; }
    this._hl = false; if (this.isConnected) this._hT = setTimeout(() => { this._hT = 0; if (this.isConnected) this._ldHist(); }, 10 * 60000);
  }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s2); padding:var(--s2) var(--s3) var(--s3); height:auto; min-height:100%; }
.hd .ic{ color:var(--hg-accent-tx); }
.big{ display:flex; align-items:center; gap:var(--s2); min-width:0; }
.big .bd{ width:44px; height:44px; flex:none; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.05); color:#5A5E64; }
.big .bd.ok{ background:var(--hg-accent); color:var(--hg-on-accent); } .big .bd.bad{ background:#C62828; color:#fff; } .big .bd ha-icon{ width:22px; height:22px; }
.big b{ display:block; font-size:var(--fs-md); font-weight:600; } .big span{ display:block; font-size:var(--fs-xs); color:#5A5E64; margin-top:2px; font-variant-numeric:tabular-nums; }
.kv{ display:grid; grid-template-columns:repeat(auto-fit, minmax(min(124px, 100%), 1fr)); gap:var(--s1); }
.kv > div{ padding:var(--s1) var(--s2); border-radius:var(--r-sm); background:rgba(255,255,255,.55); min-width:0; }
.kv small{ display:flex; align-items:center; gap:4px; font-size:var(--fs-xs); color:#4A4E54; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .kv small ha-icon{ width:14px; height:14px; flex:none; }
.kv b{ display:block; font-size:var(--fs-md); font-weight:600; font-variant-numeric:tabular-nums; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .kv b em{ font-style:normal; font-size:var(--fs-xs); font-weight:400; color:#4A4E54; margin-left:2px; }
.bar{ height:6px; border-radius:3px; background:rgba(0,0,0,.10); margin-top:6px; overflow:hidden; padding:0 !important; } .bar i{ display:block; height:100%; border-radius:3px; background:var(--c, var(--hg-accent)); }
.spk{ display:flex; flex-direction:column; gap:4px; } .spk svg{ width:100%; height:44px; display:block; overflow:visible; } .spk small{ display:flex; justify-content:space-between; font-size:var(--fs-xs); color:#5A5E64; }
.spk polyline{ fill:none; stroke:var(--hg-accent); stroke-width:1.6; stroke-linejoin:round; stroke-linecap:round; vector-effect:non-scaling-stroke; }
.upd{ display:flex; align-items:center; gap:6px; font-size:var(--fs-xs); color:#4A4E54; } .upd ha-icon{ width:16px; height:16px; } .upd.av{ color:var(--hg-accent-tx); font-weight:600; }
.act{ display:flex; gap:var(--s1); flex-wrap:wrap; }
.pts{ display:flex; gap:6px; flex-wrap:wrap; }
.pt{ position:relative; display:inline-flex; align-items:center; gap:5px; height:32px; min-height:var(--hg-tgt, 0px); padding:0 10px 0 8px; border-radius:var(--r-md); background:rgba(0,0,0,.05); color:#4A4E54; font-size:var(--fs-xs); max-width:100%; }
.pt b{ font-weight:600; color:#1E2023; font-variant-numeric:tabular-nums; } .pt small{ font-size:var(--fs-xs); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:9em; }
.pt i{ width:8px; height:8px; border-radius:50%; background:#9AA0A6; flex:none; } .pt.on i{ background:var(--hg-accent); }
.pt ha-icon{ width:14px; height:14px; --mdc-icon-size:14px; color:var(--hg-accent-tx); flex:none; } .pt.lk{ cursor:not-allowed; background:rgba(0,0,0,.035); }
.pt:not(.on):not(.lk){ background:rgba(229,57,53,.10); } .pt:not(.on) b{ color:#B3261E; }
.btn{ display:inline-flex; align-items:center; gap:6px; height:40px; padding:0 14px 0 12px; border-radius:var(--r-md); background:rgba(0,0,0,.05); color:#1E2023; font-size:var(--fs-sm); font-weight:600; }
.btn ha-icon{ width:18px; height:18px; } .btn:hover{ background:rgba(0,0,0,.08); }
.devs{ display:grid; gap:var(--s2); grid-template-columns:repeat(auto-fill, minmax(min(240px, 100%), 1fr)); }
.dv{ display:flex; flex-direction:column; gap:var(--s1); padding:var(--s2); border-radius:var(--r-md); background:rgba(255,255,255,.5); min-width:0; }
.dv .t{ display:flex; align-items:center; gap:var(--s1); min-width:0; } .dv .t > ha-icon{ width:20px; height:20px; color:#5A5E64; flex:none; }
.dv .t .sp{ flex:1; } .nm{ min-width:0; } .nm b{ display:block; font-size:var(--fs-md); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .nm small{ display:block; font-size:var(--fs-xs); color:#4A4E54; margin-top:1px; }
.chip{ display:inline-flex; align-items:center; gap:4px; height:24px; padding:0 8px; border-radius:12px; background:rgba(0,0,0,.05); font-size:var(--fs-xs); color:#4A4E54; white-space:nowrap; }
.chip::before{ content:''; width:6px; height:6px; border-radius:50%; background:#9AA0A6; } .chip.ok::before{ background:var(--hg-accent); } .chip.bad::before{ background:#E53935; }
.ib2{ width:40px; height:40px; flex:none; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.05); color:#3A3D42; }
.ib2 ha-icon{ width:20px; height:20px; } .ib2:hover{ background:rgba(0,0,0,.09); }
.m{ display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:var(--s1); font-size:var(--fs-xs); color:#4A4E54; }
.m b{ display:block; font-size:var(--fs-sm); font-weight:600; color:#1E2023; font-variant-numeric:tabular-nums; }
.lr{ display:flex; align-items:center; gap:var(--s2); min-height:52px; } .lr + .lr{ border-top:1px solid rgba(0,0,0,.06); }
.lr > ha-icon{ width:20px; height:20px; color:#5A5E64; flex:none; } .lr .tx{ flex:1; min-width:0; } .lr .tx b{ display:block; font-size:var(--fs-sm); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lr .tx span{ display:block; font-size:var(--fs-xs); color:#4A4E54; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-variant-numeric:tabular-nums; }
.tot{ display:flex; align-items:baseline; gap:6px; } .tot b{ font-size:28px; font-weight:600; font-variant-numeric:tabular-nums; } .tot span{ font-size:var(--fs-sm); color:#4A4E54; }
.flt{ display:flex; gap:var(--s1); flex-wrap:wrap; align-items:center; }
.flt button{ height:32px; padding:0 12px; border-radius:var(--r-md); background:rgba(0,0,0,.05); font-size:var(--fs-xs); font-weight:600; color:#3A3D42; }
.flt button.on{ background:#1E2023; color:#fff; } .flt .sp{ flex:1; }
.cls{ display:flex; flex-direction:column; }
.cr{ display:grid; grid-template-columns:10px minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, .9fr) auto; align-items:center; gap:var(--s2); min-height:44px; font-size:var(--fs-xs); color:#4A4E54; }
.cr + .cr{ border-top:1px solid rgba(0,0,0,.06); }
.cr i{ width:8px; height:8px; border-radius:50%; background:#9AA0A6; } .cr.on i{ background:var(--hg-accent); }
.cr b{ font-size:var(--fs-sm); font-weight:600; color:#1E2023; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .cr span{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-variant-numeric:tabular-nums; }
.cr.mem b{ color:var(--hg-accent-tx); } .cr.mem b::after{ content:' · ' attr(data-mem); font-weight:400; color:#4A4E54; font-size:var(--fs-xs); }
.pin{ display:grid; grid-template-columns:repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap:var(--s1); }
.pm{ display:flex; align-items:center; gap:var(--s2); padding:var(--s1) var(--s2); border-radius:var(--r-sm); background:rgba(255,255,255,.55); min-width:0; text-align:left; min-height:52px; }
.pm .av{ position:relative; width:36px; height:36px; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.06); }
.pm .av ha-icon{ width:20px; height:20px; --mdc-icon-size:20px; color:#4A4E54; } .pm .av i{ position:absolute; right:-1px; bottom:-1px; width:11px; height:11px; border-radius:50%; background:#9AA0A6; box-shadow:0 0 0 2px rgba(255,255,255,.9); }
.pm.on .av i{ background:var(--hg-accent); } .pm .tx{ min-width:0; display:flex; flex-direction:column; }
.pm b{ font-size:var(--fs-sm); font-weight:600; color:#1E2023; } .pm span{ font-size:var(--fs-xs); color:#4A4E54; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cr .ls{ text-align:right; }
.empty{ font-size:var(--fs-xs); color:#4A4E54; padding:var(--s1) 0; }
@container (max-width: 520px){ .cr{ grid-template-columns:10px minmax(0, 1fr) auto; } .cr .ap, .cr .ip{ display:none; } }
ha-card.glass{ container-type:inline-size; }
`);
  }
  _st(e) { return e ? H.st(this._hass, e) : null; }
  _num(e) { const s = this._st(e); return s && H.ok(s) && isFinite(parseFloat(s.state)) ? parseFloat(s.state) : null; }
  _kv(icon, label, v, u, bar) {
    if (v == null || v === '') return '';
    return `<div><small>${H.icon(icon)}${H.esc(label)}</small><b>${H.esc(typeof v === 'number' ? H.fmt(v, v < 10 ? 1 : 0) : v)}${u ? `<em>${H.esc(u)}</em>` : ''}</b>${bar != null ? `<div class="bar" style="--c:${bar > 90 ? '#E53935' : 'var(--hg-accent)'}"><i style="width:${Math.min(100, Math.max(2, bar))}%"></i></div>` : ''}</div>`;
  }
  _upd(e) {
    const s = this._st(e); if (!s || !H.ok(s)) return '';
    const a = s.attributes, av = s.state === 'on';
    return `<button class="upd ${av ? 'av' : ''}" data-act="more" data-e="${H.esc(e)}">${H.icon(av ? 'mdi:package-up' : 'mdi:check-circle-outline')}<span>${av ? `${hgT('cards.net.update_available')} ${H.esc(a.latest_version || '')}` : `${hgT('cards.net.firmware_up_to_date')}${a.installed_version ? ' · ' + H.esc(a.installed_version) : ''}`}</span></button>`;
  }
  /* porty: rząd numerowanych pigułek (stan, zablokowane = chronione: uplink/WAN) */
  _ports(L, dn) {
    const P = (L || []).map((p) => (typeof p === 'string' ? { entity: p } : p)).map((p) => [p, this._st(p.entity)]).filter(([, st]) => st && H.ok(st));
    if (!P.length) return '';
    return `<div class="pts" role="group" aria-label="${hgT('cards.net.ports')} · ${H.esc(dn)}">${P.map(([p, st], i) => { const on = st.state === 'on', n = p.n || (String(p.entity).match(/_(\d+)$/) || [])[1] || i + 1;
      const t = H.lv(`${hgT('cards.net.port_number', { port: n })}${p.label ? ' · ' + p.label : ''}`, `${on ? hgT('cards.net.state_on') : hgT('cards.net.off')}${p.lock ? ' · ' + hgT('cards.net.port_locked_note') : ''}`);
      return `<button class="pt ${on ? 'on' : ''} ${p.lock ? 'lk' : ''}" data-act="port" data-e="${H.esc(p.entity)}" data-n="${H.esc(n)}" data-l="${H.esc(p.label || '')}" data-d="${H.esc(dn)}" ${p.lock ? 'data-lock="1" aria-disabled="true"' : ''} aria-pressed="${on}" aria-label="${H.esc(t)}" title="${H.esc(t)}">${p.lock ? H.icon('mdi:lock') : `<i></i>`}<b>${H.esc(n)}</b>${p.label ? `<small>${H.esc(p.label)}</small>` : ''}</button>`; }).join('')}</div>`;
  }
  _hd(icon, title, note) { return `<div class="hd">${H.icon(icon, 'ic')}<span class="tt">${H.esc(title)}</span><span class="sp"></span>${note ? `<span class="note">${note}</span>` : ''}</div>`; }
  render() { const s = this._config.section; return `<ha-card class="glass">${(this['_' + s] ? this['_' + s]() : '')}</ha-card>`; }
  _wan() {
    const n = this._n(), g = n.gateway || {}, w = n.wan || {}, gs = this._st(g.state), tr = this._st(g.tracker);
    const ok = gs && H.ok(gs) ? gs.state === 'connected' : tr && H.ok(tr) ? tr.state === 'home' : null;
    const ip = tr && H.ok(tr) ? tr.attributes.ip : null, up = hgUp(this._st(g.uptime));
    const lat = (w.latency || []).map((x) => [x, this._num(x.entity)]).filter(([, v]) => v != null);
    const sp = [[w.down, 'mdi:download', hgT('cards.net.download'), 'Mb/s'], [w.up, 'mdi:upload', hgT('cards.net.upload'), 'Mb/s'], [w.ping, 'mdi:timer-outline', 'Ping', 'ms']].map(([e, i, l, u]) => this._kv(i, l, this._num(e), u)).join('');
    const hs = this._hist || [], mx = Math.max(...hs, 1), mn = Math.min(...hs, mx);
    const pts = hs.length > 2 ? hs.map((v, i) => `${(i / (hs.length - 1) * 100).toFixed(2)},${(40 - ((v - mn) / Math.max(1, mx - mn)) * 36).toFixed(1)}`).join(' ') : '';
    return `${this._hd('mdi:web', hgT('cards.net.internet_title'))}
      <div class="big"><span class="bd ${ok === true ? 'ok' : ok === false ? 'bad' : ''}">${H.icon(ok === false ? 'mdi:web-off' : 'mdi:web')}</span><div><b>${ok === true ? hgT('cards.net.connected') : ok === false ? hgT('cards.net.disconnected') : hgT('cards.net.unknown_state')}</b><span>${[ip ? 'IP ' + H.esc(ip) : '', up ? hgT('cards.net.gateway_up_for', { time: up }) : ''].filter(Boolean).join(' · ')}</span></div></div>
      ${lat.length || sp ? `<div class="kv">${lat.map(([x, v]) => this._kv('mdi:timer-outline', x.name, v, 'ms')).join('')}${sp}</div>` : ''}
      ${pts ? `<div class="spk" aria-label="${hgT('cards.net.wan_latency_last_24')}"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points="${pts}"/></svg><small><span>−24 h</span><span>${hgT('cards.net.latency')} ${H.esc((w.latency || [])[0].name)} · ${H.fmt(mn, 0)}–${H.fmt(mx, 0)} ms</span><span>${hgT('common.now')}</span></small></div>` : ''}`;
  }
  _gw() {
    const g = this._n().gateway || {}; if (!g.state && !g.cpu) return '';
    const gs = this._st(g.state), cpu = this._num(g.cpu), mem = this._num(g.mem), tmp = this._num(g.temp), up = hgUp(this._st(g.uptime)), rs = this._st(g.restart);
    return `${this._hd('mdi:router-network', g.name || hgT('cards.net.gateway'), gs && H.ok(gs) ? `<span class="chip ${gs.state === 'connected' ? 'ok' : 'bad'}">${H.esc(H.t(this._hass, gs))}</span>` : '')}
      <div class="kv">${this._kv('mdi:cpu-64-bit', hgT('cards.net.cpu'), cpu, '%', cpu)}${this._kv('mdi:memory', hgT('cards.net.memory'), mem, '%', mem)}${this._kv('mdi:thermometer', hgT('cards.net.cpu_temp'), tmp, '°C')}${this._kv('mdi:timer-sand', hgT('cards.net.uptime'), up, '')}</div>
      ${this._ports(g.ports, g.name || hgT('cards.net.gateway'))}
      ${this._upd(g.update)}
      ${rs ? `<div class="act"><button class="btn" data-act="restart" data-e="${H.esc(g.restart)}" data-n="${H.esc(g.name || hgT('cards.net.gateway'))}">${H.icon('mdi:restart')}${hgT('cards.net.restart')}</button></div>` : ''}`;
  }
  _dev() {
    const L = (this._n().devices || []).filter((d) => this._st(d.state) || this._st(d.cpu));
    const tiles = L.map((d) => {
      const s = this._st(d.state), ok = s && H.ok(s) && s.state === 'connected', cpu = this._num(d.cpu), mem = this._num(d.mem), cl = this._num(d.clients), up = hgUp(this._st(d.uptime));
      const u = this._st(d.update), ua = u && u.state === 'on';
      const ports = this._ports(d.ports, d.name);
      const ent = this._hass.entities && this._hass.entities[d.state], dev = ent && this._hass.devices ? this._hass.devices[ent.device_id] : null;
      const nm = d.name || (dev && (dev.name_by_user || dev.name)) || (s ? String(s.attributes.friendly_name || '').replace(/\s*(State|Stan)$/i, '') : '') || '—', model = d.model || (dev && dev.model) || '';
      return `<div class="dv"><div class="t">${H.icon(d.kind === 'switch' ? 'mdi:switch' : 'mdi:access-point')}<span class="sp"></span>${s && H.ok(s) ? `<span class="chip ${ok ? 'ok' : 'bad'}">${H.esc(H.t(this._hass, s))}</span>` : ''}
          ${this._st(d.restart) ? `<button class="ib2" data-act="restart" data-e="${H.esc(d.restart)}" data-n="${H.esc(nm)}" aria-label="${hgT('cards.net.restart')} ${H.esc(nm)}" title="${hgT('cards.net.restart')}">${H.icon('mdi:restart')}</button>` : ''}</div>
        <div class="nm"><b title="${H.esc(nm)}">${H.esc(nm)}</b>${model ? `<small>${H.esc(model)}</small>` : ''}</div>
        <div class="m">${cl != null ? `<span><b>${H.fmt(cl, 0)}</b>${hgPlK(cl)}</span>` : ''}${cpu != null ? `<span><b>${H.pct(H.fmt(cpu, 0))}</b>CPU</span>` : ''}${mem != null ? `<span><b>${H.pct(H.fmt(mem, 0))}</b>${hgT('cards.net.memory_label')}</span>` : ''}</div>
        ${up ? `<span class="upd">${H.icon('mdi:timer-sand')}${hgT('cards.net.up_for')} ${up}</span>` : ''}${ua ? this._upd(d.update) : ''}${ports}</div>`;
    }).join('');
    return `${this._hd('mdi:access-point-network', hgT('cards.net.access_points_and_switches'), hgT('cards.net.devices_count', { count: L.length }))}<div class="devs">${tiles}</div>`;
  }
  _wlan() {
    const W = (this._n().wlans || []).filter((x) => this._st(x.switch) || this._st(x.clients));
    const rows = W.map((x) => {
      const sw = this._st(x.switch), on = sw && sw.state === 'on', cl = this._num(x.clients), qr = this._st(x.qr);
      return `<div class="lr">${H.icon(on ? 'mdi:wifi' : 'mdi:wifi-off')}<div class="tx"><b>${H.esc(x.name)}</b><span>${[x.note, cl != null ? `${H.fmt(cl, 0)} ${hgPlK(cl)}` : ''].filter(Boolean).map(H.esc).join(' · ')}</span></div>
        ${qr && H.ok(qr) ? `<button class="ib2" data-act="qr" data-e="${H.esc(x.qr)}" data-n="${H.esc(x.name)}" aria-label="${hgT('cards.net.qr_code_for_network')} ${H.esc(x.name)}" title="${hgT('cards.net.qr_code')}">${H.icon('mdi:qrcode')}</button>` : ''}
        ${sw && H.ok(sw) ? this.toggleHtml(on, 'wlan" data-e="' + H.esc(x.switch) + '" data-n="' + H.esc(x.name), false, `${hgT('cards.net.network')} ${x.name}`) : ''}</div>`;
    }).join('');
    return `${this._hd('mdi:wifi', hgT('cards.net.wi_fi_networks'))}<div>${rows || `<div class="empty">${hgT('cards.net.no_wi_fi_networks')}</div>`}</div>`;
  }
  _cname(s) {
    const a = s.attributes; let n = a.friendly_name || '';
    const half = n.split(' '); if (half.length % 2 === 0 && half.slice(0, half.length / 2).join(' ') === half.slice(half.length / 2).join(' ')) n = half.slice(0, half.length / 2).join(' ');
    if (!n || /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(n) || /^unifi_default/.test(n)) n = a.host_name || (a.oui ? `${a.oui.split(/[ ,.，]/)[0]} ·${(a.mac || '').slice(-5)}` : a.mac || s.entity_id);
    return n;
  }
  _cl() {
    const n = this._n(), h = this._hass, cfg = n.clients || {}, mem = cfg.members || {};
    const pTr = {}; for (const p of Object.keys(h.states).filter((e) => e.startsWith('person.'))) for (const t of (h.states[p].attributes.device_trackers || [])) pTr[t] = p;
    const apN = {}; for (const d of (n.devices || [])) { const t = this._st(d.tracker); if (t && t.attributes.mac) apN[t.attributes.mac] = d.name; }
    const wl = (n.wlans || []).map((x) => this._num(x.clients)).filter((v) => v != null), tot = wl.reduce((a, b) => a + b, 0);
    let L = this._clientEnts().map((e) => h.states[e]).filter((s) => s && H.ok(s));
    const onN = L.filter((s) => s.state === 'home').length;
    if (this._flt === 'on') L = L.filter((s) => s.state === 'home'); else if (this._flt === 'off') L = L.filter((s) => s.state !== 'home');
    const isMem = (s) => mem[s.entity_id] || pTr[s.entity_id];
    const ipn = (ip) => (ip || '999.999.999.999').split('.').reduce((a, b) => a * 256 + (+b || 0), 0);
    L.sort((a, b) => (isMem(b) ? 1 : 0) - (isMem(a) ? 1 : 0) || (this._srt === 'ip' ? ipn(a.attributes.ip) - ipn(b.attributes.ip) : (b.state === 'home') - (a.state === 'home') || this._cname(a).localeCompare(this._cname(b), HG_LOC())));
    // domownicy przypięci na górze: jeden (najświeższy) tracker UniFi na osobę
    const byP = {}; for (const e of this._clientEnts()) { const st = h.states[e], p = st && H.ok(st) && (mem[e] || pTr[e]); if (!p) continue;
      const b = byP[p]; if (!b || (st.state === 'home') > (b.state === 'home') || ((st.state === 'home') === (b.state === 'home') && st.last_changed > b.last_changed)) byP[p] = st; }
    const pins = Object.entries(byP).sort((x, y) => (h.states[x[0]] ? H.name(h, x[0]) : x[0]).localeCompare(h.states[y[0]] ? H.name(h, y[0]) : y[0], HG_LOC())).map(([p, st]) => { const on = st.state === 'home', a = st.attributes;
      return `<button class="pm ${on ? 'on' : ''}" data-act="more" data-e="${H.esc(st.entity_id)}"><span class="av">${H.icon('mdi:cellphone')}<i></i></span><span class="tx"><b>${H.esc(h.states[p] ? H.name(h, p) : p)}</b>
        <span>${H.esc([this._cname(st), on ? [hgT('cards.net.online'), apN[a.ap_mac], a.essid].filter(Boolean).join(' · ') : hgT('cards.net.offline_since', { time: hgRel(new Date(st.last_changed)) })].join(' · '))}</span></span></button>`; }).join('');
    const pinSet = new Set(Object.values(byP).map((st) => st.entity_id));
    const rows = L.filter((s) => !pinSet.has(s.entity_id)).map((s) => { const a = s.attributes, on = s.state === 'home', m = isMem(s);
      return `<button class="cr ${on ? 'on' : ''} ${m ? 'mem' : ''}" data-act="more" data-e="${H.esc(s.entity_id)}" title="${H.esc(a.mac || '')}"><i></i><b${m ? ` data-mem="${H.esc(hgT('cards.net.member'))}"` : ''}>${H.esc(this._cname(s))}</b>
        <span class="ap">${H.esc([apN[a.ap_mac], a.essid].filter(Boolean).join(' · ') || (a.is_wired ? hgT('cards.net.wired') : ''))}</span><span class="ip">${H.esc(a.ip || '')}</span>
        <span class="ls">${on ? hgT('cards.net.state_connected') : hgT('cards.net.disconnected_since', { time: H.esc(hgRel(new Date(s.last_changed))) })}</span></button>`; }).join('');
    const f = (k, l) => `<button class="${(this._flt || 'all') === k ? 'on' : ''}" data-act="flt" data-k="${k}">${l}</button>`;
    return `${this._hd('mdi:devices', hgT('cards.net.clients'))}
      ${pins ? `<div class="pin" aria-label="${hgT('cards.net.household_phones')}">${pins}</div>` : ''}
      <div class="tot">${wl.length ? `<b>${H.fmt(tot, 0)}</b><span>${hgT('cards.net.devices_on_wi_fi')}</span>` : `<b>${onN}</b><span>${hgT('cards.net.tracked_online')}</span>`}</div>
      <div class="flt">${f('all', `${hgT('cards.net.all')} · ${this._clientEnts().filter((e) => H.ok(h.states[e])).length}`)}${f('on', `${hgT('cards.net.filter_connected')} · ${onN}`)}${f('off', hgT('cards.net.filter_disconnected'))}<span class="sp"></span>
        <button class="${this._srt === 'ip' ? '' : 'on'}" data-act="srt" data-k="name">${hgT('common.name')}</button><button class="${this._srt === 'ip' ? 'on' : ''}" data-act="srt" data-k="ip">IP</button></div>
      <div class="cls">${rows || `<div class="empty">${hgT('cards.net.no_tracked_clients')}</div>`}</div>
      ${cfg.note ? `<div class="empty">${H.esc(cfg.note)}</div>` : ''}`;
  }
  _qr(e, ssid) {
    const st = this._hass.states[e]; if (!st || !st.attributes.entity_picture) return;
    const x = document.createElement('div'); x.className = 'hg-qr'; const sr = x.attachShadow({ mode: 'open' });
    sr.innerHTML = `<style>${HG_BASE}${U(`
:host{ position:fixed; inset:0; z-index:9100; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(14,16,20,.42); animation:f .16s ease; }
@keyframes f{ from{ opacity:0; } } @media (prefers-reduced-motion: reduce){ :host{ animation:none; } }
.d{ position:relative; width:min(360px, 100%); box-sizing:border-box; padding:24px; border-radius:var(--r-lg); background:var(--hg-panel-flat, rgba(236,238,242,.94)); -webkit-backdrop-filter:var(--hg-bfo, blur(24px)); backdrop-filter:var(--hg-bfo, blur(24px));
  border:1px solid var(--hg-glass-bd); box-shadow:var(--hg-sh); color:#1E2023; display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; }
.hd{ display:flex; align-items:center; gap:8px; align-self:stretch; } .hd ha-icon{ width:22px; height:22px; color:var(--hg-accent-tx); } .hd b{ flex:1; text-align:left; font-size:18px; font-weight:600; }
.x{ width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.06); } .x ha-icon{ color:#1E2023; width:20px; height:20px; }
.q{ width:100%; aspect-ratio:1; max-width:300px; background:#fff; border-radius:var(--r-md); padding:16px; box-sizing:border-box; display:flex; } .q img{ width:100%; height:100%; object-fit:contain; image-rendering:pixelated; }
p{ margin:0; font-size:var(--fs-sm); color:#4A4E54; } p b{ color:#1E2023; }
`)}</style><div class="d" role="dialog" aria-modal="true" aria-label="${hgT('cards.net.qr_code_for_network')} ${H.esc(ssid)}"><div class="hd">${H.icon('mdi:wifi')}<b>${H.esc(ssid)}</b><button class="x" data-v="x" aria-label="${hgT('common.close')}">${H.icon('mdi:close')}</button></div>
      <div class="q"><img alt="${hgT('cards.net.qr_code_for_network')} ${H.esc(ssid)}" src="${H.esc(st.attributes.entity_picture)}"></div><p>${hgT('cards.net.scan_with_your_phone')} <b>${H.esc(ssid)}</b>.</p></div>`;
    const done = () => { document.removeEventListener('keydown', key); x.remove(); };
    const key = (ev) => { if (ev.key === 'Escape') done(); };
    x.addEventListener('click', (ev) => { const p = ev.composedPath(); if (p[0] === x || p.find((n) => n.dataset && n.dataset.v === 'x')) done(); });
    document.addEventListener('keydown', key); document.body.appendChild(x);
    setTimeout(() => { const b = sr.querySelector('.x'); b && b.focus(); }, 30);
  }
  async onAct(a, t) {
    const h = this._hass, e = t && t.dataset.e;
    if (a === 'more') return H.fire(this, 'hass-more-info', { entityId: e });
    if (a === 'flt') { this._flt = t.dataset.k; return this.rerender(); }
    if (a === 'srt') { this._srt = t.dataset.k; return this.rerender(); }
    if (a === 'restart') { if (await HGConfirm.ask(hgT('cards.net.restart_confirm', { name: t.dataset.n }), hgT('cards.net.the_device_will_be'), hgT('cards.net.restart'))) H.call(h, 'button', 'press', { entity_id: e }); return; }
    if (a === 'port') { if (t.dataset.lock) { await HGConfirm.ask(hgT('cards.net.port_protected', { port: t.dataset.n }), `${t.dataset.l ? t.dataset.l + ' – ' : ''}${hgT('cards.net.this_is_the_internet')}`, hgT('cards.net.got_it'), false, true); return; }
      const on = h.states[e] && h.states[e].state === 'on', nm = `port ${t.dataset.n}${t.dataset.l ? ' (' + t.dataset.l + ')' : ''} · ${t.dataset.d}`;
      if (await HGConfirm.ask(on ? hgT('cards.net.turn_off', { nm }) : hgT('cards.net.turn_on', { nm }), on ? hgT('cards.net.the_device_connected_to') : hgT('cards.net.the_port_will_be'), on ? hgT('common.turn_off') : hgT('common.turn_on'), on)) H.call(h, 'switch', on ? 'turn_off' : 'turn_on', { entity_id: e }); return; }
    if (a === 'qr') return this._qr(e, t.dataset.n);
    if (a === 'wlan') { const on = h.states[e] && h.states[e].state === 'on';
      if (on && !(await HGConfirm.ask(hgT('cards.net.turn_off_network_confirm', { name: t.dataset.n }), hgT('cards.net.devices_connected_to_this'), hgT('common.turn_off')))) return;
      H.call(h, 'switch', on ? 'turn_off' : 'turn_on', { entity_id: e }); }
  }
  getCardSize() { return 4; }
}
hgReg('hg-net-card', HGNetCard, hgTLazy('cards.net.picker_name'), hgTLazy('cards.net.picker_description'));
