/* ===================== SCENY + MOC + TYDZIEŃ ENERGII (główny widok) ===================== */
/* hg-scenes-card: skrypty jako duże pigułki. Tap -> script.turn_on (w tle), fala (ripple) od miejsca dotyku, potem ✓;
   gdy skrypt działa (stan „on”) – obracający się pierścień, „Działa…”, przycisk zablokowany. */
class HGScenesCard extends HGBase {
  defaults() { return { title: hgT('cards.scenes.scenes'), icon: 'mdi:play-circle-outline', scripts: [], studio: false, tiles: false, add: false, edit: false }; }
  ents() { return this._config.scripts.map((x) => x.entity); }
  _extraSig() { return [this._ok || '']; }
  css() {
    return U(`
.hd{ min-height:16u; }
ha-card.glass{ display:flex; flex-direction:column; gap:var(--s1); padding:var(--s2) var(--s2) var(--s2); height:auto; }
.row{ display:grid; grid-template-columns:1fr 1fr; gap:var(--s1); }
.p{ position:relative; overflow:hidden; display:flex; align-items:center; gap:10px; height:52px; padding:0 12px 0 10px; border-radius:var(--r-md); min-width:0;
  background:var(--hg-tile-bg); border:0; box-shadow:0 4px 14px rgba(0,0,0,.12); text-align:left; cursor:pointer; transition:background .3s, transform .15s cubic-bezier(.2,0,0,1), box-shadow .2s; }
.p:focus-visible{ outline:none; box-shadow:0 0 0 2px var(--hg-accent); }
.p.ok{ background:var(--hg-accent-soft); } .p.ok .ic{ background:var(--hg-accent) !important; color:var(--hg-on-accent) !important; }
.p:active{ transform:scale(.96); } .p[disabled]{ cursor:default; }
.ic{ position:relative; width:32px; height:32px; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; background:var(--hg-accent-faint); color:var(--hg-accent-tx); transition:background .3s; }
.ic ha-icon{ width:18px; height:18px; }
.run .ic::after{ content:''; position:absolute; inset:-3px; border-radius:50%; border:2px solid transparent; border-top-color:var(--c); border-right-color:var(--c); animation:var(--hg-loop, hgspin 1s linear infinite); }
.run{ opacity:.85; }
 .ok .ic ha-icon{ animation:hgpop .45s cubic-bezier(.2,.8,.2,1.4); }
@keyframes hgpop{ 0%{ transform:scale(.3); opacity:0 } 100%{ transform:scale(1); opacity:1 } }
.tx{ min-width:0; font-size:min(var(--fs-md), 15px); font-weight:600; letter-spacing:-.005em; line-height:1.15; white-space:nowrap; }
.row{ container-type:inline-size; }
/* za wąsko na ikonę obok etykiety (każdy przycisk < ~135px): ikona nad etykietą, bez ucinania */
@container (max-width: 280px){ .p{ flex-direction:column; justify-content:center; gap:4px; padding:6px 4px; height:auto; min-height:64px; text-align:center; } .tx{ font-size:min(var(--fs-sm), 13px); } }
.rp{ position:absolute; width:20u; height:20u; margin:-10u 0 0 -10u; border-radius:50%; background:var(--c); opacity:.3; pointer-events:none; transform:scale(0); animation:hgrip .6s cubic-bezier(.2,.8,.2,1) forwards; }
@keyframes hgrip{ to{ transform:scale(16); opacity:0 } }
.un{ opacity:.5; }
/* kafle studio: pionowy kafel (ikona nad etykietą), siatka auto-fit, opcjonalny kafel „+”; stopnie wg szerokości kontenera */
ha-card.glass.tl{ container-type:inline-size; height:100%; min-height:0; }
.row.tl{ container-type:normal; flex:1; min-height:0; display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0, 1fr); grid-template-columns:none; align-items:stretch; }
.row.tl .p{ flex-direction:column; justify-content:center; gap:6px; height:100%; min-height:0; padding:6px 2px; text-align:center; border-radius:var(--r-md); box-shadow:none; background:transparent; }
.row.tl .ic{ background:var(--hg-inner-bg); color:inherit; }
.row.tl .p.ok{ background:transparent; }
.row.tl .tx{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; white-space:normal; font-size:min(var(--fs-sm), 12px); font-weight:500; line-height:1.15; overflow:hidden; }
.row.tl .p.add{ border:1px dashed color-mix(in srgb, currentColor 30%, transparent); background:none; color:inherit; opacity:.75; min-height:72px; } .row.tl .p.add .ic{ background:none; color:inherit; }
@container (max-width: 239px){ .tl .hd .tt{ display:none; } .row.tl .p{ min-height:60px; } .row.tl .p .ic{ width:28px; height:28px; } }
@container (min-width: 480px){ .row.tl .p{ min-height:88px; } .row.tl .p .ic{ width:38px; height:38px; } .row.tl .p .ic ha-icon{ width:22px; height:22px; } }
`);
  }
  render() {
    const c = this._config;
    const items = c.scripts.map((x, i) => {
      const s = H.st(this._hass, x.entity), un = !H.ok(s), run = s && s.state === 'on', ok = this._ok === x.entity && !run;
      const nm = x.name || (s && s.attributes.friendly_name) || x.entity;
      const sub = un ? hgT('common.state_unavailable_masc') : run ? hgT('cards.scenes.running') : ok ? hgT('cards.scenes.started') : hgT('cards.scenes.run');
      return `<button class="p lift ${run ? 'run' : ''} ${ok ? 'ok' : ''} ${un ? 'un' : ''}" style="--c:${x.color || 'var(--hg-accent)'}" data-act="run" data-i="${i}" ${un || run ? 'disabled' : ''} aria-label="${H.lv(H.esc(nm), `${sub}`)}" title="${H.esc(nm)} – ${sub}" aria-busy="${!!run}">
        <span class="ic">${H.icon(ok ? 'mdi:check' : x.icon || (s && s.attributes.icon) || 'mdi:play')}</span><span class="tx">${H.esc(nm)}</span></button>`;
    }).join('');
    const tl = !!(c.studio || c.tiles), ad = (c.add || c.edit || (this.hasAttribute && this.hasAttribute('edit'))) ? `<button class="p add lift" data-act="add" aria-label="${hgT('cards.scenes.add')}" title="${hgT('cards.scenes.add')}"><span class="ic">${H.icon('mdi:plus')}</span><span class="tx">${hgT('cards.scenes.add')}</span></button>` : '';
    return `<ha-card class="glass${tl ? ' tl' : ''}"><div class="hd">${H.icon(c.icon, 'ic')}<span class="tt">${H.esc(c.title)}</span></div><div class="row${tl ? ' tl' : ''}">${items}${ad}</div></ha-card>`;
  }
  onAct(a, t, e) {
    if (a === 'add') return H.fire(this, 'hg-card-add', { kind: 'scene' });
    if (a !== 'run') return;
    const x = this._config.scripts[Number(t.dataset.i)]; if (!x) return;
    const r = t.getBoundingClientRect(), px = (e && e.clientX ? e.clientX : r.left + r.width / 2) - r.left, py = (e && e.clientY ? e.clientY : r.top + r.height / 2) - r.top;
    const rp = document.createElement('i'); rp.className = 'rp'; rp.style.left = px + 'px'; rp.style.top = py + 'px'; t.appendChild(rp);
    H.call(this._hass, String(x.entity).split('.')[0] === 'scene' ? 'scene' : 'script', 'turn_on', { entity_id: x.entity });   // scene.* -> scene.turn_on
    clearTimeout(this._okT); clearTimeout(this._okT2);
    this._okT2 = setTimeout(() => { this._ok = x.entity; this.rerender(); this._okT = setTimeout(() => { this._ok = ''; this.rerender(); }, 2200); }, 420);
  }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-scenes-card', HGScenesCard, hgTLazy('cards.scenes.picker_name'), hgTLazy('cards.scenes.picker_description'));
