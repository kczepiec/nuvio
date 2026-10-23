/* ===== Użytkownicy (admin): wspólny dashboard dla wszystkich albo własny układ dla wybranych osób.
   Lista osób z config/auth/list (tylko admin), wybór zapisany w pulpicie nuvio-shared (HGShared, pole own).
   Odznaczona osoba dostaje własny układ: zaczyna od kopii wspólnego i sama go edytuje. */
const HGUsers = window.__hgUsers || (window.__hgUsers = {
  list: null, doc: null, busy: false, saving: false,
  admin(p) { const h = p && p._hass; return !!(h && h.user && h.user.is_admin); },
  async prep(p) { if (this.busy) return; this.busy = true; const h = p._hass;
    try { this.list = ((await h.callWS({ type: 'config/auth/list' })) || []).filter((u) => !u.system_generated && u.is_active !== false); } catch (e) { this.list = []; }
    this.doc = await HGShared.doc(h); this.busy = false; if (p._eSheetEl && p._eSheetEl.querySelector('.lk')) p._eLook(); },
  head() { return `<h4 id="us-h">${H.icon('mdi:account-multiple-outline')}${hgT('users.shared_dashboard')}</h4>
      <small class="lk-hn">${hgT('users.intro')}</small>`; },
  html(p) { if (!this.admin(p)) return '';
    const sec = (body) => `<section class="lk-g us" data-tab="users" data-pg="users" aria-labelledby="us-h"><style>${typeof HG_WALL_CSS === 'string' ? HG_WALL_CSS : ''}${HG_US_CSS}</style>${this.head()}${body}</section>`;
    if (!this.list) { this.prep(p); return sec(`<small class="lk-hn">${hgT('common.loading')}</small>`); }
    if (!this.doc) return sec(`<small class="us-warn">${H.icon('mdi:alert-circle-outline')}${hgT('users.shared_missing')}</small>`);
    const own = new Set(this.doc.own || []), me = p._hass.user.id, n = this.list.filter((u) => !own.has(u.id)).length;
    const L = [...this.list].sort((a, b) => (a.id === me ? -1 : b.id === me ? 1 : 0) || String(a.name || '').localeCompare(String(b.name || ''), HG_LOC()));
    const rows = L.map((u) => { const on = !own.has(u.id), self = u.id === me, adm = (u.group_ids || []).includes('system-admin');
      const tags = [self ? hgT('users.you') : '', adm ? hgT('users.administrator') : ''].filter(Boolean).join(' · ');
      const st = self ? hgT('users.you_set_up_the') : on ? hgT('users.sees_the_shared_dashboard') : hgT('users.own_layout_edits_it');
      const nm = H.esc(u.name || u.username || '?');
      return `<button type="button" class="wl-sw us-r" role="switch" data-hge="us-t" data-u="${H.esc(u.id)}" aria-checked="${on}" ${self || this.saving ? 'disabled' : ''}>
        ${hgUserAv(p._hass, u, this.list)}
        <span>${nm}${tags ? `<em class="us-tg">${H.esc(tags)}</em>` : ''}<small>${st}</small></span><i aria-hidden="true"></i></button>`; }).join('');
    return sec(`<div class="us-sum">${H.icon('mdi:monitor-dashboard')}<span>${hgT('users.shared_count', { count: n, total: this.list.length })}</span></div><div class="us-l">${rows}</div>`); },
  async act(p, b, a) { if (!this.admin(p) || a !== 'us-t' || this.saving) return;
    const h = p._hass, id = b.dataset.u; if (!id || id === h.user.id) return;
    this.saving = true; let msg;
    try { const doc = await HGShared.doc(h); if (!doc) throw new Error('no shared');
      const own = new Set(doc.own || []), was = own.has(id); was ? own.delete(id) : own.add(id);
      const nd = Object.assign({}, doc, { own: [...own] }); HGL._mine = Date.now(); if (!window.__hgDryRun) await HGShared.put(h, nd); this.doc = nd;
      const u = (this.list || []).find((x) => x.id === id), nm = (u && (u.name || u.username)) || '';
      msg = was ? hgT('users.name_sees_shared', { name: nm }) : hgT('users.name_has_own_layout', { name: nm }); }
    catch (e) { msg = hgT('users.save_failed', { error: (e && e.message) || e }); }
    this.saving = false; p._eToast(msg); return p._eLook(); },
});
const HG_US_CSS = `
.us-l{ display:flex; flex-direction:column; gap:6px; }
.us-r{ padding-left:8px; } .us-r[disabled]{ cursor:default; } .us-r[disabled] i{ opacity:.55; }
.wl-sw.us-r > .us-av{ flex:none; width:34px; height:34px; border-radius:50%; display:grid; place-items:center; font-weight:700; font-size:14px; color:var(--hg-on-accent, #fff); background:linear-gradient(140deg, var(--hg-accent), color-mix(in srgb, var(--hg-accent) 55%, #000)); box-shadow:inset 0 0 0 1px rgba(255,255,255,.18); }
.wl-sw.us-r > .us-av.pic{ background:center / cover no-repeat color-mix(in srgb, var(--hg-accent) 18%, transparent); }
.us-tg{ font-style:normal; font-weight:500; font-size:11.5px; opacity:.6; margin-left:6px; }
.us-sum{ display:flex; align-items:center; gap:8px; font-size:13px; opacity:.8; margin:2px 0 4px; } .us-sum ha-icon, .us-warn ha-icon{ --mdc-icon-size:18px; width:18px; height:18px; flex:none; }
.us-warn{ display:flex; gap:8px; align-items:flex-start; font-size:13px; line-height:1.4; padding:10px 12px; border-radius:14px; background:color-mix(in srgb, var(--hg-accent) 12%, transparent); }
`;
window.HGUsers = HGUsers;
