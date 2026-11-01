/* studio/chrome: chrome Studio (status, tryb UI, menu akcji), mieszany do HGPage.prototype. */
const HG_STUDIO_CHROME = {
  /* Studio: encje tabletu ściennego (wifi / bluetooth / bateria), wyszukiwane raz na budowę; brak encji = brak ikony */
  _stDev() {
    if (this._stIds) return this._stIds; const S = (this._hass && this._hass.states) || {}, o = {};
    for (const id of Object.keys(S)) {
      if (!/^(sensor|binary_sensor|device_tracker)\./.test(id) || !/tablet|wall|ipad|kiosk/i.test(id)) continue;
      if (!o.bat && S[id].attributes.device_class === 'battery') o.bat = id;
      else if (!o.bt && /bluetooth/i.test(id)) o.bt = id;
      else if (!o.wifi && /wi_?fi|ssid|rssi/i.test(id)) o.wifi = id;
    }
    return (this._stIds = o);
  },
  /* siła Wi-Fi: dBm (ujemne) albo procent; stan on/connected = pełny znak, off = przekreślony */
  _stLink(id, kind) {
    const s = id && this._hass.states[id]; if (!s || /^(unavailable|unknown)$/.test(s.state)) return '';
    const st = String(s.state), n = parseFloat(st), on = /^(on|home|connected)$/i.test(st);
    let icon;
    if (kind === 'bt') icon = on || (!/^(off|disconnected)$/i.test(st) && isNaN(n)) ? 'mdi:bluetooth' : 'mdi:bluetooth-off';
    else if (!isNaN(n)) { const lvl = n < 0 ? (n >= -55 ? 4 : n >= -67 ? 3 : n >= -75 ? 2 : n > -100 ? 1 : 0) : (n >= 80 ? 4 : n >= 55 ? 3 : n >= 30 ? 2 : n > 0 ? 1 : 0); icon = lvl ? 'mdi:wifi-strength-' + lvl : 'mdi:wifi-off'; }
    else icon = on || !/^(off|disconnected)$/i.test(st) ? 'mdi:wifi' : 'mdi:wifi-off';
    const l = kind === 'bt' ? hgT('page.studio_bluetooth') : hgT('page.studio_wifi');
    return `<button type="button" class="si" data-act="stent" data-e="${H.esc(id)}" aria-label="${H.esc(l)}" title="${H.esc(l)}">${H.icon(icon)}</button>`;
  },
  /* domyślny chrome jak Studio (ukryty nagłówek, status, motyw na szynie); wyłączony tylko na widoku pokoju (room_head) */
  _studioUI(c) { c = c || this._config; if (!c || c.room_head || c.studio === false) return false; return true; },
  _hasStudioCard() { return (this._cards || []).some((el) => el.tagName === 'HG-STUDIO-CARD'); },
  _studioGrid() { return this._studioUI() && this._hasStudioCard(); },
  _stChrome() {
    const o = this._stDev(), lang = typeof HG_LOC === 'function' ? HG_LOC() : undefined, tf = this._hass.locale && this._hass.locale.time_format, d = new Date();
    return `<div class="sst">${this._stLink(o.wifi, 'wf')}${this._stLink(o.bt, 'bt')}`
      + `<time class="sdt">${H.esc(d.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' }))}&nbsp; ${H.esc(d.toLocaleTimeString(lang, Object.assign({ hour: '2-digit', minute: '2-digit' }, tf === '12' ? { hour12: true } : tf === '24' ? { hour12: false } : {})))}</time></div>`;
  },
  /* edycja, Assist, poczta i powiadomienia w menu użytkownika, nie obok avatara */
  _stMenuActs(nCount) {
    if (!this._studioUI()) return '';
    const bits = [];
    if (this._canEdit()) bits.push(`<button role="menuitem" data-act="edit" aria-pressed="${!!this._editing}">${H.icon(this._editing ? 'mdi:check' : 'mdi:pencil')}<span>${H.esc(this._editing ? hgT('page.finish_editing_layout') : hgT('page.edit_layout'))}</span></button>`);
    if (window.HGAssistUI && HGAssistUI.get().button) bits.push(`<button role="menuitem" data-act="assist">${H.icon('mdi:microphone-message')}<span>${H.esc(hgT('page.assist_a'))}</span></button>`);
    bits.push(`<button role="menuitem" data-act="mail">${H.icon('mdi:email')}<span>${H.esc(hgT('page.messages'))}</span></button>`);
    const nb = nCount > 9 ? '9+' : nCount;
    bits.push(`<button role="menuitem" data-act="bell">${H.icon('mdi:bell')}<span>${H.esc(nCount ? H.lv(hgT('common.notifications'), nb) : hgT('common.notifications'))}</span></button>`);
    return bits.length ? bits.join('') + '<div class="msep" role="separator"></div>' : '';
  },
};
Object.assign(HGPage.prototype, HG_STUDIO_CHROME);
