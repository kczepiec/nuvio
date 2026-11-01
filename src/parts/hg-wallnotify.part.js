/* ===== Powiadomienia na wygaszaczu (2.3): wywołania notify skierowane do tego urządzenia (np. notify.mobile_app_telefon albo notify.send_message
   z encją notify.*) pokazują się na wygaszaczu jako stos kart jak na ekranie blokady iPhone'a; dotknięcie rozwija stos, ponowne dotknięcie karty
   pokazuje całą treść. Wybór usług jest zapisywany tylko na tym urządzeniu (localStorage), bo każdy tablet/telefon ma swoją usługę notify.
   Nasłuch: zdarzenia call_service (wymaga konta administratora); lista trzymana lokalnie do 24 h, czyszczona po wybudzeniu. */
const HG_NT_SS = `
.nb-nt{ --nt-bg:${K(250,251,253,.80)}; --nt-tx:${K(22,24,28,1)}; --nt-tx2:${K(22,24,28,.55)}; --nt-edge:inset 0 1px 0 ${K(255,255,255,.7)}, inset 0 0 0 1px ${K(255,255,255,.3)}; --nt-btn:${K(250,251,253,.72)};
  position:relative; z-index:3; box-sizing:border-box; width:min(400px, 100%); color:var(--nt-tx); -webkit-tap-highlight-color:transparent; touch-action:pan-y; }
.nwb.dk .nb-nt, .nw:not(.bd) .nb-nt{ --nt-bg:${K(30,32,38,.62)}; --nt-tx:${K(255,255,255,1)}; --nt-tx2:${K(255,255,255,.6)}; --nt-edge:inset 0 1px 0 ${K(255,255,255,.14)}, inset 0 0 0 1px ${K(255,255,255,.07)}; --nt-btn:${K(30,32,38,.55)}; }
.nw > .nb-nt{ position:absolute; left:50%; bottom:calc(clamp(60px, 9vmin, 96px) + env(safe-area-inset-bottom, 0px)); width:min(420px, calc(100vw - 32px)); transform:translateX(-50%); }
.nt-st{ position:relative; display:flex; flex-direction:column; gap:8px; padding-bottom:var(--nt-pb, 0px); transition:padding .35s ease; }
.nt-c{ position:relative; box-sizing:border-box; padding:12px 14px 13px; border-radius:22px; background:var(--nt-bg); -webkit-backdrop-filter:var(--hg-bfo, blur(30px) saturate(180%)); backdrop-filter:var(--hg-bfo, blur(30px) saturate(180%));
  box-shadow:var(--nt-edge), 0 10px 30px ${K(0,0,0,.18)}; cursor:pointer; transform-origin:50% 0; transition:transform .45s cubic-bezier(.2,.8,.2,1), opacity .35s ease; }
.nt-c header{ display:flex; align-items:center; gap:8px; font-size:12px; color:var(--nt-tx2); }
.nt-c header i{ flex:none; width:20px; height:20px; border-radius:6px; display:flex; align-items:center; justify-content:center; background:var(--hg-accent, ${K(99,215,30,1)}); color:var(--hg-on-accent, ${K(11,15,10,1)}); }
.nt-c header ha-icon{ --mdc-icon-size:14px; width:14px; height:14px; }
.nt-c header span{ flex:1; min-width:0; font-weight:600; letter-spacing:.02em; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; } .nt-c header time{ flex:none; font-variant-numeric:tabular-nums; }
.nt-c b{ display:block; margin-top:6px; font-size:15px; font-weight:600; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.nt-c p{ margin:2px 0 0; font-size:14px; line-height:1.3; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; overflow-wrap:anywhere; }
.nt-c.full p{ -webkit-line-clamp:unset; } .nt-c.full b{ white-space:normal; }
/* złożony stos: pierwsza karta w całości, dwie kolejne jako krawędzie pod spodem */
.nb-nt:not(.open) .nt-c:not(:first-child){ position:absolute; left:0; right:0; top:0; bottom:var(--nt-pb, 0px); pointer-events:none; transform-origin:50% 100%; box-shadow:var(--nt-edge), 0 6px 16px ${K(0,0,0,.14)}; }
.nb-nt:not(.open) .nt-c:not(:first-child) > *{ opacity:0; }
.nb-nt:not(.open) .nt-c:nth-child(1){ z-index:3; }
.nb-nt:not(.open) .nt-c:nth-child(2){ z-index:2; transform:translateY(10px) scale(.94); opacity:.8; }
.nb-nt:not(.open) .nt-c:nth-child(3){ z-index:1; transform:translateY(20px) scale(.88); opacity:.55; }
.nb-nt:not(.open) .nt-c:nth-child(n+4){ opacity:0; transform:translateY(20px) scale(.88); }
.nb-nt.st2 .nt-st{ --nt-pb:10px; } .nb-nt.st3 .nt-st{ --nt-pb:20px; }
/* rozwinięty: lista kart rozsuwa się spod pierwszej */
.nt-bar{ display:none; align-items:center; justify-content:space-between; gap:8px; margin:0 2px 8px; }
.nb-nt.open .nt-bar{ display:flex; animation:ntfade .3s ease both; }
.nt-bar b{ font-size:clamp(18px, 2.4vmin, 22px); font-weight:700; letter-spacing:-.01em; color:${K(255,255,255,1)}; text-shadow:0 1px 12px ${K(0,0,0,.35)}; }
.nt-bar span{ display:flex; gap:6px; }
.nt-bar button{ height:30px; padding:0 12px; border:0; border-radius:999px; font:inherit; font-size:13px; font-weight:600; color:var(--nt-tx); background:var(--nt-btn); -webkit-backdrop-filter:var(--hg-bfo, blur(20px)); backdrop-filter:var(--hg-bfo, blur(20px)); box-shadow:var(--nt-edge); cursor:pointer; }
.nt-bar button.x{ width:30px; padding:0; display:flex; align-items:center; justify-content:center; } .nt-bar button ha-icon{ --mdc-icon-size:16px; width:16px; height:16px; }
.nb-nt.open .nt-st{ max-height:min(62vh, 560px); overflow-y:auto; overscroll-behavior:contain; scrollbar-width:none; margin:-4px; padding:4px; }
.nb-nt.open .nt-c{ animation:ntopen .5s cubic-bezier(.2,.8,.2,1) both; animation-delay:calc(var(--i, 0) * 35ms); }
.nt-c.new{ animation:ntnew .6s cubic-bezier(.2,.9,.25,1.15) both; }
.nt-more{ display:block; margin-top:8px; text-align:center; font-size:12px; font-weight:600; color:${K(255,255,255,.85)}; text-shadow:0 1px 8px ${K(0,0,0,.4)}; }
.nb-nt.open .nt-more{ display:none; }
@keyframes ntopen{ from{ opacity:0; transform:translateY(calc(var(--i, 0) * -60px)) scale(.92); } to{ opacity:1; transform:none; } }
@keyframes ntnew{ from{ opacity:0; transform:translateY(-16px) scale(.9); } to{ opacity:1; transform:none; } }
@keyframes ntfade{ from{ opacity:0; } to{ opacity:1; } }
@media (prefers-reduced-motion:reduce){ .nt-c, .nt-st{ transition:none; } .nb-nt.open .nt-c, .nt-c.new, .nb-nt.open .nt-bar{ animation:none; } }
`;
(() => {
  const LS = 'nuvio-wall-ntf', LL = 'nuvio-wall-ntl', W = HGWall, rd = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bez pamięci lokalnej: tylko w tej sesji */ } };
  const _bh = W.bdHtml, _po = W.pkOp, _wk = W.wake, _tk = W.tick, _sh = W.show;
  Object.assign(W, {
    ntSel() { return rd(LS).filter((x) => typeof x === 'string' && /^[a-z0-9_.]+$/.test(x)); },
    ntList() { const t = Date.now() - 864e5; return rd(LL).filter((n) => n && n.ts > t).slice(0, 20); },
    /* nasłuch zdarzeń call_service tylko gdy na tym urządzeniu wybrano jakąś usługę */
    ntSub(h) { const on = !!(h && h.connection && h.user && h.user.is_admin && this.ntSel().length);
      if (!on) { if (this._ntU) { try { this._ntU(); } catch (e) { /* już odpięte */ } this._ntU = null; this._ntP = null; } return; }
      if (this._ntP) return;
      this._ntP = h.connection.subscribeEvents((ev) => this.ntOn(ev), 'call_service').then((u) => { this._ntU = u; }, () => { this._ntP = null; }); },
    ntOn(ev) { const d = (ev && ev.data) || {}; if (d.domain !== 'notify') return; const S = this.ntSel(), sd = d.service_data || {};
      const ids = [].concat(sd.entity_id || (sd.target && sd.target.entity_id) || []);
      const hit = S.includes('notify.' + d.service) || (d.service === 'send_message' && ids.some((e) => S.includes(e))); if (!hit) return;
      const msg = String(sd.message == null ? '' : sd.message); if (!msg || /^(clear_notification|request_location_update|command_)/.test(msg)) return;
      const L = this.ntList(); L.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: Date.now(), t: String(sd.title || ''), m: msg.slice(0, 600) });
      wr(LL, L.slice(0, 20)); this._ntNew = L[0].id; this.ntRender(); },
    ntAgo(ts) { const m = Math.round((Date.now() - ts) / 60000); if (m < 1) return hgT('common.now'); if (m < 60) return hgT('common.ago_minutes', { m });
      return new Intl.DateTimeFormat(HG_LOC(), { hour: '2-digit', minute: '2-digit' }).format(new Date(ts)); },
    ntRender() { const box = this.el && this.el.querySelector('.nb-nt'); if (!box) return; const L = this.ntList();
      if (!L.length) { box.hidden = true; box.classList.remove('open'); box.innerHTML = ''; return; }
      box.hidden = false; const open = box.classList.contains('open'), n = L.length;
      box.classList.toggle('st2', !open && n === 2); box.classList.toggle('st3', !open && n > 2);
      box.innerHTML = `<div class="nt-bar"><b>${H.esc(hgT('common.notifications'))}</b><span><button type="button" data-nt="less">${H.esc(hgT('wallnotify.show_less'))}</button><button type="button" class="x" data-nt="clr" aria-label="${H.esc(hgT('wallnotify.clear'))}">${H.icon('mdi:close')}</button></span></div>
        <div class="nt-st">${L.map((x, i) => `<article class="nt-c${x.id === this._ntNew ? ' new' : ''}${this._ntFull === x.id ? ' full' : ''}" data-id="${H.esc(x.id)}" style="--i:${i}"><header><i>${H.icon('mdi:home-assistant')}</i><span>Home Assistant</span><time>${H.esc(this.ntAgo(x.ts))}</time></header>${x.t ? `<b>${H.esc(x.t)}</b>` : ''}<p>${H.esc(x.m)}</p></article>`).join('')}</div>
        ${n > 1 ? `<small class="nt-more">${H.esc(hgT('wallnotify.more_count', { count: n }))}</small>` : ''}`;
      this._ntNew = null; },
    ntWire(el) { const box = el.querySelector('.nb-nt'); if (!box) return;
      /* dotknięcie stosu nie wybudza ekranu */
      box.addEventListener('pointerdown', (e) => { e.stopPropagation(); }); box.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
      box.addEventListener('click', (e) => { e.stopPropagation(); const b = e.target.closest('[data-nt]'), c = e.target.closest('.nt-c');
        if (b && b.dataset.nt === 'clr') { wr(LL, []); return this.ntRender(); }
        if (b && b.dataset.nt === 'less') { box.classList.remove('open'); this._ntFull = null; return this.ntRender(); }
        if (!box.classList.contains('open') && this.ntList().length > 1) { box.classList.add('open'); return this.ntRender(); }
        if (c) { this._ntFull = this._ntFull === c.dataset.id ? null : c.dataset.id; c.classList.toggle('full', this._ntFull === c.dataset.id); } }); },
    ntHtml(h) { const sv = Object.keys((h.services && h.services.notify) || {}).filter((s) => !['send_message', 'persistent_notification', 'notify'].includes(s)).map((s) => 'notify.' + s);
      const en = Object.keys(h.states).filter((e) => e.startsWith('notify.')), S = this.ntSel(), all = [...new Set([...sv, ...en])];
      const lab = (k) => (h.states[k] ? H.name(h, k, k) : k.replace(/^notify\.(mobile_app_)?/, '').replace(/_/g, ' '));
      const body = all.length ? this.pk('ntf', S.map((k) => ({ k, l: lab(k), s: k })), all.filter((k) => !S.includes(k)).map((k) => ({ k, l: lab(k), s: k })), { ic: 'mdi:message-badge-outline', add: hgT('wallnotify.add_service') })
        : `<small>${H.esc(hgT('wallnotify.no_notify_services_in'))}</small>`;
      return `<div class="wl-f" role="group" aria-labelledby="wl-nt"><span id="wl-nt">${hgT('wallnotify.notifications_on_this_device')}</span>${body}
        <small>${H.esc(hgT('wallnotify.messages_sent_through_the'))}</small></div>`; },
    bdHtml(c, h) { const r = _bh.call(this, c, h); r.top += this.ntHtml(h); return r; },
    pkOp(id, op, k) { if (id !== 'ntf') return _po.call(this, id, op, k); const S = this.ntSel(); wr(LS, op === 'add' ? [...new Set([...S, k])] : S.filter((x) => x !== k)); this.ntSub(this.hass); return true; },
    tick(h, page) { _tk.call(this, h, page); this.ntSub(h); },
    show(test) { _sh.call(this, test); if (!this.el) return; if (!this.el.querySelector('.nb-nt')) { const d = document.createElement('div'); d.className = 'nb-nt'; d.hidden = true; d.setAttribute('aria-live', 'polite'); const bot = this.el.querySelector('.nwb .nb-bot'); if (bot) bot.prepend(d); else this.el.appendChild(d); }
      const st = document.createElement('style'); st.textContent = HG_NT_SS; this.el.prepend(st);
      this.ntWire(this.el); this.ntRender(); clearInterval(this._ntT); this._ntT = setInterval(() => this.ntTimes(), 30000); },
    ntTimes() { if (!this.el) return clearInterval(this._ntT); const L = this.ntList(); for (const t of this.el.querySelectorAll('.nt-c')) { const x = L.find((n) => n.id === t.dataset.id), tm = t.querySelector('time'); if (x && tm) tm.textContent = this.ntAgo(x.ts); } },
    /* po świadomym wybudzeniu powiadomienia uznajemy za przeczytane */
    wake(why) { const was = this.active && this.el && this.el.querySelector('.nb-nt:not([hidden])'); _wk.call(this, why); if (was && !this.active && /^(touch|key|pin)$/.test(why)) wr(LL, []); },
  });
})();
