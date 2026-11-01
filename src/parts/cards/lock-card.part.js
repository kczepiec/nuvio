/* --- ZAMEK: stan i odblokowanie z potwierdzeniem (alert dialog), kod gdy zamek go wymaga --- */
class HGLockCard extends HGBase {
  static getStubConfig(h) { return { entity: hgStub(h, ['lock']) || null }; }
  defaults() { return { entity: null, name: null, confirm: true }; }
  css() { return HG_NV_CSS + U(`.nv-mid.big{ flex-direction:row; align-items:center; justify-content:flex-start; gap:var(--s2); } .big .nv-ic{ width:44u; height:44u; } .big .nv-ic ha-icon{ width:22u; height:22u; }
.big .nv-ic.open{ background:#FF9F43; color:#111; box-shadow:0 0 14px rgba(255,159,67,.45); } .st{ font-size:var(--hg-fs-4, 18px); font-weight:500; }
.jam .nv-ic{ background:#FF5B4F; color:#fff; }`); }
  render() { const c = this._config, h = this._hass, s = H.st(h, c.entity);
    if (!s) return `<ha-card class="glass"><span class="nv-empty">${hgT('cards.lock.choose_a_lock')}</span></ha-card>`;
    const st = s.state, locked = st === 'locked', busy = ['locking', 'unlocking', 'opening'].includes(st), nm = c.name || H.name(h, c.entity), ok = H.ok(s);
    const ic = st === 'jammed' ? 'mdi:lock-alert' : locked ? 'mdi:lock' : busy ? 'mdi:lock-clock' : 'mdi:lock-open-variant';
    return `<ha-card class="glass ${ok ? '' : 'un'} ${st === 'jammed' ? 'jam' : ''}">${hgUI.header(nm, { right: hgUI.iconBtn('mdi:dots-vertical', 'menu', hgT('common.more'), { bare: true, size: 'sm' }) })}
      <div class="nv-mid big"><span class="nv-ic ${locked ? 'on' : 'open'}">${H.icon(ic)}</span><span class="st">${H.esc(H.T(h, s))}</span></div>
      <div>${hgUI.pill(locked ? hgT('cards.lock.unlock') : hgT('cards.lock.lock'), { icon: locked ? 'mdi:lock-open-variant-outline' : 'mdi:lock-outline', act: ok && !busy ? 'go' : null, acc: !locked })}</div></ha-card>`; }
  async onAct(a, t) { const c = this._config, h = this._hass, s = H.st(h, c.entity); if (!s) return;
    if (a === 'menu') return hgMoreMenu(this, t, c.entity);
    if (a !== 'go') return; const locked = s.state === 'locked', nm = c.name || H.name(h, c.entity), data = { entity_id: c.entity };
    if (s.attributes.code_format) {
      const r = await hgOverlay.dialog({ title: nm, text: hgT('cards.lock.enter_the_lock_code'), width: 340, collect: true,
        html: `<input name="code" type="password" inputmode="numeric" autocomplete="one-time-code" aria-label="${hgT('common.code')}" autofocus style="height:44px;border-radius:12px;border:0;padding:0 14px;font:inherit;font-size:16px;background:var(--hg-inner-bg);color:inherit;box-shadow:var(--hg-inner-hi)">`,
        actions: [{ label: hgT('common.cancel'), value: false }, { label: locked ? hgT('cards.lock.unlock') : hgT('cards.lock.lock'), value: true, kind: 'primary' }] });
      if (!r || !r.value) return; data.code = r.data.code; }
    else if (locked && c.confirm !== false && !(await hgOverlay.alert(hgT('cards.lock.unlock_confirm_title', { nm }), hgT('cards.lock.the_door_can_be'), hgT('cards.lock.unlock')))) return;
    H.haptic('medium'); H.call(h, 'lock', locked ? 'unlock' : 'lock', data); }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-lock-card', HGLockCard, hgTLazy('cards.lock.picker_name'), hgTLazy('cards.lock.picker_description'));
