/* ===================== ZEGAR ===================== */
class HGClockCard extends HGBase {
  defaults() { return { title: null, seconds: false, date: true, hour12: false }; }
  ents() { return []; }
  css() { return HG_G14_CSS + U(`ha-card.glass{ justify-content:center; align-items:flex-start; } .tm{ font-size:clamp(34px, 22cqi, 96px); font-weight:300; letter-spacing:-.04em; line-height:1; font-variant-numeric:tabular-nums; } .tm small{ font-size:.38em; opacity:.6; margin-left:4px; letter-spacing:0; } .dt{ font-size:14px; opacity:.75; text-transform:capitalize; } .tt{ font-size:12px; opacity:.6; font-weight:600; letter-spacing:.04em; text-transform:uppercase; }`); }
  connectedCallback() { super.connectedCallback(); clearInterval(this._ti); this._ti = setInterval(() => this.tick(), this._config && this._config.seconds ? 1000 : 15000); }
  /* sam tekst czasu, bez renderu karty: pełny render co 15 s (albo co sekundę z sekundnikami) przepisywał cały DOM karty, choć zmieniała się jedna liczba.
     Gdy w DOM nie ma jeszcze naszych węzłów (karta nigdy nie rysowana), robimy pełne przerysowanie. */
  tick() { if (!this.isConnected) return;
    const el = this.$.querySelector('.tm'), dt = this.$.querySelector('.dt');
    if (!el) return this.rerender();
    const c = this._config, d = new Date(), loc = HG_LOC();
    const t = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: !!c.hour12 }), s = String(d.getSeconds()).padStart(2, '0');
    const txt = H.esc(t), sub = c.seconds ? `<small>${s}</small>` : '';
    if (el.innerHTML !== txt + sub) el.innerHTML = txt + sub;
    if (dt) { const day = H.esc(d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' })); if (dt.textContent !== day) dt.textContent = day; } }
  disconnectedCallback() { clearInterval(this._ti); }
  render() { const c = this._config, d = new Date(), loc = HG_LOC();
    const t = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: !!c.hour12 }), s = String(d.getSeconds()).padStart(2, '0');
    return `<ha-card class="glass">${c.title ? `<span class="tt">${H.esc(c.title)}</span>` : ''}<span class="tm" role="timer" aria-live="off">${H.esc(t)}${c.seconds ? `<small>${s}</small>` : ''}</span>${c.date !== false ? `<span class="dt">${H.esc(d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' }))}</span>` : ''}</ha-card>`; }
  getGridOptions() { return { columns: 6, rows: 2 }; }
}
hgReg('hg-clock-card', HGClockCard, hgTLazy('cards.clock.picker_name'), hgTLazy('cards.clock.picker_description'));
