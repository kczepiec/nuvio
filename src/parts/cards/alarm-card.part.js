/* Bezpieczeństwo: alarm i czujniki */
/* [kolor, ikona]; etykieta stanu: hgTD('cards.alarm.states.' + stan) */
const HG_ALARM_ST = {
  disarmed: ['var(--hg-accent)', 'mdi:shield-off-outline'], armed_home: ['var(--hg-accent)', 'mdi:shield-home'],
  armed_away: ['var(--hg-accent)', 'mdi:shield-lock'], armed_night: ['var(--hg-accent)', 'mdi:shield-moon'],
  armed_vacation: ['var(--hg-accent)', 'mdi:shield-airplane'], armed_custom_bypass: ['var(--hg-accent)', 'mdi:shield-edit'],
  arming: ['var(--hg-accent)', 'mdi:shield-sync'], pending: ['var(--hg-accent)', 'mdi:shield-alert-outline'],
  disarming: ['var(--hg-accent)', 'mdi:shield-sync'], triggered: ['#E53935', 'mdi:bell-ring'],
  unavailable: ['#9AA0A6', 'mdi:shield-remove-outline'], unknown: ['#9AA0A6', 'mdi:shield-remove-outline'],
};
/* supported_features (AlarmControlPanelEntityFeature): 1 ARM_HOME, 2 ARM_AWAY, 4 ARM_NIGHT, 8 TRIGGER (bez przycisku), 16 ARM_CUSTOM_BYPASS, 32 ARM_VACATION */
/* [bit, tryb, etykieta (hgTLazy), ikona, stan]; etykieta w bieżącym języku: hgAlarmLbl(a) */
const HG_ALARM_ACT = [[1, 'arm_home', hgTLazy('cards.alarm.arm_modes.home'), 'mdi:home-lock', 'armed_home'], [2, 'arm_away', hgTLazy('cards.alarm.arm_modes.away'), 'mdi:lock', 'armed_away'],
  [4, 'arm_night', hgTLazy('cards.alarm.arm_modes.night'), 'mdi:weather-night', 'armed_night'], [32, 'arm_vacation', hgTLazy('cards.alarm.arm_modes.vacation'), 'mdi:airplane', 'armed_vacation'],
  [16, 'arm_custom_bypass', hgTLazy('cards.alarm.arm_modes.custom_bypass'), 'mdi:shield-edit-outline', 'armed_custom_bypass']];
const hgAlarmLbl = (a) => String(a[2]);
class HGAlarmCard extends HGBase {
  defaults() { return { title: hgT('cards.alarm.default_title'), icon: 'mdi:shield-home-outline', name: hgT('cards.alarm.alarm_home'), keypad: null }; }
  /* klawiatura na stałe, jak w HA: gdy centrala ma code_format albo keypad: true (keypad: false = tylko po wybraniu akcji) */
  _pad(s) { return !!s && H.ok(s) && this._config.keypad !== false && !!s.attributes.code_format; }
  _extraSig() { return [this._pend || '', (this._code || '').length, !!this._miss, Math.floor(Date.now() / 60000)]; }
  css() {
    return U(`
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s2); padding:var(--s3); overflow:hidden; container-type:inline-size; position:relative; isolation:isolate; }
/* poświata w kolorze stanu za tarczą */
ha-card.glass::before{ content:''; position:absolute; z-index:-1; left:-20%; top:-30%; width:90%; height:70%; pointer-events:none; background:radial-gradient(closest-side, color-mix(in srgb, var(--c) 28%, transparent), transparent); opacity:.9; transition:background .6s; }
.big{ display:flex; align-items:center; gap:var(--s3); padding:2u 0 4u; min-width:0; }
.ring{ position:relative; width:clamp(56px, calc(var(--k) * 46), 68px); aspect-ratio:1; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; color:#fff;
  background:radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--c) 55%, #fff), var(--c) 62%, color-mix(in srgb, var(--c) 80%, #000));
  box-shadow:0 0 0 6px color-mix(in srgb, var(--c) 16%, transparent), 0 12px 28px -6px color-mix(in srgb, var(--c) 60%, transparent), inset 0 1px 0 rgba(255,255,255,.45); }
.ring ha-icon{ width:30px; height:30px; --mdc-icon-size:30px; color:rgb(255 255 255); filter:drop-shadow(0 1px 2px rgba(0,0,0,.3)); }
.ring::before, .ring::after{ content:''; position:absolute; inset:-6u; border-radius:50%; border:2u solid var(--c); opacity:0; pointer-events:none; }
.anim .ring::before{ animation:var(--hg-loop, hgring 1.6s cubic-bezier(.2,.8,.2,1) infinite); }
.anim .ring::after{ animation:var(--hg-loop, hgring 1.6s cubic-bezier(.2,.8,.2,1) .8s infinite); }
.trig .ring{ animation:var(--hg-loop, hgpulse 1s infinite); }
@keyframes hgring{ 0%{ transform:scale(.9); opacity:.7 } 100%{ transform:scale(1.45); opacity:0 } }
.st{ min-width:0; } .st small{ display:block; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--c); margin-bottom:2u; }
.st b{ display:block; font-size:clamp(20px, calc(var(--k) * 17), 26px); font-weight:600; letter-spacing:-.02em; color:#1E2023; line-height:1.15; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.st span{ display:block; font-size:var(--fs-sm); color:#5A5E64; margin-top:4u; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.bd{ display:flex; flex-direction:column; gap:var(--s2); min-width:0; }
@container (min-width: 540px){ .bd.two{ display:grid; grid-template-columns:minmax(0, 1fr) minmax(0, 1.1fr); align-items:start; gap:var(--s3); } }
/* akcje: kafle z ikoną, wybrany tryb w kolorze stanu z poświatą */
.acts{ display:grid; grid-template-columns:repeat(auto-fit, minmax(min(120px, 100%), 1fr)); gap:var(--s1); }
.ab{ position:relative; display:flex; align-items:center; gap:10px; min-width:0; min-height:max(52px, var(--hg-tgt, 0px)); padding:0 14px; border-radius:16px; font-size:var(--fs-sm); font-weight:500;
  background:color-mix(in srgb, currentColor 6%, transparent); border:1px solid color-mix(in srgb, currentColor 9%, transparent); color:inherit; transition:background-color .2s, box-shadow .25s, transform .15s; text-align:left; }
.ab ha-icon{ width:20px; height:20px; --mdc-icon-size:20px; flex:none; opacity:.85; } .ab span{ min-width:0; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-height:1.2; }
@media (hover:hover){ .ab:hover{ background:color-mix(in srgb, currentColor 10%, transparent); } } .ab:active{ transform:scale(.97); }
.ab:focus-visible, .k:focus-visible{ outline:2px solid var(--hg-accent); outline-offset:2px; }
.ab.sel{ background:var(--c); color:#fff; border-color:transparent; box-shadow:0 10px 24px -10px color-mix(in srgb, var(--c) 80%, transparent), inset 0 1px 0 rgba(255,255,255,.3); } .ab.sel ha-icon{ opacity:1; }
.ab.dis{ grid-column:1 / -1; justify-content:center; min-height:max(54px, var(--hg-tgt, 0px)); font-weight:600; background:#1F2125; color:#fff; border-color:transparent; box-shadow:0 10px 24px -12px rgba(0,0,0,.55); }
/* klawiatura PIN: okrągłe klawisze jak na ekranie blokady */
.kp{ display:flex; flex-direction:column; align-items:center; gap:var(--s2); padding:var(--s2) var(--s2) var(--s3); border-radius:22px; background:color-mix(in srgb, currentColor 4%, transparent); border:1px solid color-mix(in srgb, currentColor 8%, transparent); }
.kp .q{ align-self:stretch; display:flex; align-items:center; justify-content:space-between; font-size:var(--fs-sm); color:#4A4E54; }
.pin{ display:flex; flex-direction:column; align-items:center; gap:6px; min-height:14px; }
.dots{ display:flex; gap:12px; justify-content:center; }
.dots i{ width:12px; height:12px; border-radius:50%; border:1.5px solid color-mix(in srgb, currentColor 40%, transparent); transition:background-color .2s, border-color .2s, transform .2s; }
.dots i.on{ background:var(--hg-accent); border-color:var(--hg-accent); box-shadow:0 0 10px color-mix(in srgb, var(--hg-accent) 70%, transparent); transform:scale(1.08); }
.pin em:empty{ display:none; } .pin em{ font-style:normal; font-size:12px; opacity:.7; text-align:center; } .pin.miss em{ color:#FF5A4F; opacity:1; font-weight:600; } .pin.miss .dots i{ border-color:#FF5A4F; }
@media (prefers-reduced-motion:no-preference){ .pin.miss .dots{ animation:hgshake .35s; } } @keyframes hgshake{ 25%{ transform:translateX(-6px) } 75%{ transform:translateX(6px) } }
.keys{ display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:clamp(8px, 3cqi, 12px) clamp(10px, 5cqi, 18px); width:100%; max-width:228px; justify-items:center; }
.k{ position:relative; width:100%; max-width:58px; aspect-ratio:1; border-radius:50%; font-size:clamp(19px, 6cqi, 23px); font-weight:300; font-variant-numeric:tabular-nums; display:flex; align-items:center; justify-content:center; color:inherit;
  background:color-mix(in srgb, currentColor 8%, transparent); border:1px solid color-mix(in srgb, currentColor 10%, transparent); box-shadow:inset 0 1px 0 rgba(255,255,255,.12); transition:background-color .15s, transform .12s; }
@media (hover:hover){ .k:hover{ background:color-mix(in srgb, currentColor 13%, transparent); } }
.k:active{ background:color-mix(in srgb, var(--hg-accent) 35%, transparent); transform:scale(.94); } .k ha-icon{ width:22px; height:22px; --mdc-icon-size:22px; }
.k.fn{ background:transparent; border-color:transparent; box-shadow:none; font-size:15px; font-weight:500; } .k[disabled]{ opacity:.3; }
.k.ok{ background:var(--hg-accent); color:var(--hg-on-accent); border-color:transparent; } .k.ok[disabled]{ opacity:.4; }
.pw{ width:100%; height:max(48px, var(--hg-tgt, 0px)); border-radius:14px; border:1px solid color-mix(in srgb, currentColor 14%, transparent); padding:0 var(--s2); font:inherit; font-size:var(--fs-md); letter-spacing:.2em; text-align:center; background:color-mix(in srgb, currentColor 5%, transparent); color:inherit; box-sizing:border-box; }
.pw:focus{ outline:2px solid var(--hg-accent); outline-offset:1px; }
.x{ font-size:var(--fs-sm); color:#5A5E64; padding:4u var(--s1); border-radius:var(--r-sm); position:relative; min-height:var(--hg-tgt, 0px); }
@media (prefers-reduced-motion:reduce){ .ab, .k, .dots i, ha-card.glass::before{ transition:none; } }
`);
  }
  /* klawiatura tylko, gdy w centrali ustawiono kod (HA podaje wtedy code_format); keypad: false wyłącza stałą klawiaturę */
  _needCode(act) { const a = (H.st(this._hass, this._config.entity) || { attributes: {} }).attributes; return !!a.code_format && (act === 'disarm' || !!a.code_arm_required); }
  _pinHtml(n, hint) { return `<div class="pin${this._miss ? ' miss' : ''}" aria-live="polite"><div class="dots" aria-hidden="true">${Array.from({ length: Math.max(4, n) }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div><em>${n ? '' : hint}</em></div>`; }
  _keys(last) { return `<div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<button class="k" data-act="key" data-k="${d}" aria-label="${d}">${d}</button>`).join('')}${last}</div>`; }
  render() {
    const c = this._config, s = H.st(this._hass, c.entity);
    const stt = s ? s.state : 'unavailable', [col, ic] = HG_ALARM_ST[stt] || ['var(--hg-accent)', 'mdi:shield'], lbl = HG_ALARM_ST[stt] ? hgTD('cards.alarm.states.' + stt, stt) : H.stateLabel(stt);
    const un = !H.ok(s), feat = s ? Number(s.attributes.supported_features) || 0 : 0;
    const anim = ['arming', 'pending', 'disarming', 'triggered'].includes(stt);
    const by = s && s.attributes.changed_by ? ` · ${H.esc(s.attributes.changed_by)}` : '';
    const acts = un ? '' : HG_ALARM_ACT.filter((a) => feat & a[0]).map((a) => `<button class="ab ${stt === a[4] ? 'sel' : ''}" data-act="arm" data-m="${a[1]}" aria-pressed="${stt === a[4]}" aria-label="${H.lv(hgT('cards.alarm.arm'), hgAlarmLbl(a))}" title="${H.lv(hgT('cards.alarm.arm'), hgAlarmLbl(a))}">${H.icon(a[3])}<span>${hgAlarmLbl(a)}</span></button>`).join('')
      + (stt !== 'disarmed' ? `<button class="ab dis" data-act="arm" data-m="disarm" aria-label="${hgT('cards.alarm.disarm')}">${H.icon('mdi:shield-off-outline')}<span>${hgT('cards.alarm.disarm')}</span></button>` : '');
    const txt = s && s.attributes.code_format === 'text', n = (this._code || '').length;
    const pwIn = `<input class="pw" type="password" autocomplete="off" aria-label="${hgT('cards.alarm.alarm_code')}" placeholder="${hgT('common.code')}">`;
    let kp = '';
    if (!un && this._pad(s) && !this._pend) {
      kp = `<div class="kp in">${txt ? pwIn : this._pinHtml(n, this._miss ? hgT('cards.alarm.enter_the_code_first') : hgT('cards.alarm.enter_the_code_then')) + this._keys(`<button class="k fn" data-act="kclr" aria-label="${hgT('cards.alarm.clear_code')}" ${n ? '' : 'disabled'}>${H.icon('mdi:close')}</button><button class="k" data-act="key" data-k="0" aria-label="0">0</button><button class="k fn" data-act="kdel" aria-label="${hgT('cards.alarm.delete_digit')}" ${n ? '' : 'disabled'}>${H.icon('mdi:backspace-outline')}</button>`)}</div>`; }
    else if (this._pend) {
      const nm = this._pend === 'disarm' ? hgT('cards.alarm.disarm') : hgAlarmLbl(HG_ALARM_ACT.find((a) => a[1] === this._pend) || [0, 0, hgT('cards.alarm.arm')]);
      kp = `<div class="kp"><div class="q"><span>${H.lv(hgT('cards.alarm.code_for'), `<b>${H.esc(nm)}</b>`)}</span><button class="x" data-act="kcancel" aria-label="${hgT('common.cancel')}">${hgT('common.cancel')}</button></div>
        ${txt ? pwIn + `<button class="ab dis" data-act="kok" aria-label="${hgT('cards.alarm.confirm')}">${H.icon('mdi:check')}<span>${hgT('cards.alarm.confirm')}</span></button>`
        : this._pinHtml(n, hgT('cards.alarm.enter_code')) + this._keys(`<button class="k fn" data-act="kdel" aria-label="${hgT('cards.alarm.delete_digit')}">${H.icon('mdi:backspace-outline')}</button><button class="k" data-act="key" data-k="0" aria-label="0">0</button><button class="k ok" data-act="kok" aria-label="${hgT('cards.alarm.confirm')}" ${n ? '' : 'disabled'}>${H.icon('mdi:check')}</button>`)}</div>`;
    }
    const body = this._pend ? kp : kp + (acts ? `<div class="acts">${acts}</div>` : '');
    return `<ha-card class="glass ${anim ? 'anim' : ''} ${stt === 'triggered' ? 'trig' : ''}" style="--c:${col}">
      <div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span><span class="sp"></span>
        <button class="ib kebab" data-act="more" aria-label="${hgT('cards.alarm.alarm_details')}" title="${hgT('cards.alarm.details_and_history')}">${H.icon('mdi:dots-vertical')}</button></div>
      <div class="big"><div class="ring">${H.icon(ic)}</div><div class="st"><b>${H.esc(lbl)}</b>
        <span>${s ? [H.esc(c.name || s.attributes.friendly_name || c.entity), hgT('cards.alarm.changed_ago', { time: hgRel(new Date(s.last_changed)) })].filter(Boolean).join(' · ') + by : hgT('cards.alarm.entity_not_found', { entity: H.esc(c.entity) })}</span></div></div>
      ${body ? `<div class="bd${kp && !this._pend && acts ? ' two' : ''}">${body}</div>` : ''}</ha-card>`;
  }
  afterRender() { const i = this.$.querySelector('.pw'); if (i) { i.value = this._code || ''; i.oninput = () => { this._code = i.value; }; i.onkeydown = (e) => { if (e.key === 'Enter') this.onAct('kok'); };
    i.onblur = () => { if (this._pendingUpd) { this._pendingUpd = false; this._update(true); } }; } }
  /* pole kodu z fokusem: nie podmieniaj DOM (utrata fokusu/klawiatury) – przerysuj po blur */
  _doUpdate(force) { const i = this.$ && this.$.querySelector('.pw'); if (i && this.shadowRoot.activeElement === i) { this._pendingUpd = true; return; } return super._doUpdate(force); }
  _send(m, code) {
    const pw = this.$.querySelector('.pw'); if (pw) pw.blur();
    const d = { entity_id: this._config.entity }; if (code) d.code = code;
    this._pend = null; this._code = '';
    H.call(this._hass, 'alarm_control_panel', 'alarm_' + m, d);
    this.rerender();
  }
  onAct(a, t) {
    if (a === 'more') return H.fire(this, 'hass-more-info', { entityId: this._config.entity });
    if (a === 'arm') { const m = t.dataset.m, pw = this.$.querySelector('.kp.in .pw'); if (pw) this._code = pw.value;
      if (this._pad(H.st(this._hass, this._config.entity))) { if (this._needCode(m) && !this._code) { this._miss = true; clearTimeout(this._missT); this._missT = setTimeout(() => { this._miss = false; this.rerender(); }, 2500); return this.rerender(); } return this._send(m, this._code); }
      if (this._needCode(m)) { this._pend = m; this._code = ''; return this.rerender(); } return this._send(m); }
    if (a === 'kclr') { this._code = ''; return this.rerender(); }
    if (a === 'key') { this._miss = false; if ((this._code || '').length < 12) this._code = (this._code || '') + t.dataset.k; return this.rerender(); }
    if (a === 'kdel') { this._code = (this._code || '').slice(0, -1); return this.rerender(); }
    if (a === 'kcancel') { this._pend = null; this._code = ''; return this.rerender(); }
    if (a === 'kok') { if (this._pend && this._code) this._send(this._pend, this._code); }
  }
  getCardSize() { return 5; }
}
hgReg('hg-alarm-card', HGAlarmCard, hgTLazy('cards.alarm.picker_name'), hgTLazy('cards.alarm.picker_description'));
