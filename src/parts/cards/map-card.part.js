/* --- mapa: natywna karta HA w szklanym kontenerze --- */
class HGMapCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  setConfig(c) {
    this._cfgTitle = !!c && Object.prototype.hasOwnProperty.call(c, 'title');   /* domyślny tytuł liczony przy rysowaniu (zmiana języka) */
    this._config = Object.assign({ title: null, icon: 'mdi:map-outline', entities: [], theme_mode: 'dark', hours_to_show: 0 }, c);
    const sr = this.shadowRoot;
    sr.innerHTML = `<style>${HG_BASE}${U(`
ha-card.glass{ display:flex; flex-direction:column; padding:var(--s2) var(--s2) var(--s2); gap:var(--s2); container-type:inline-size; }
.hd{ padding:0 2u; min-height:max(20u, 28px); }
.hd .tt{ font-size:max(16px, calc(var(--fs-md) * 1.05)); font-weight:600; }
.hd .note{ font-size:max(13px, var(--fs-sm)); opacity:.78; color:inherit; }
@container (min-width: 420px){ .hd .tt{ font-size:max(17px, calc(var(--fs-md) * 1.12)); } .hd .note{ font-size:max(14px, var(--fs-sm)); } }
.mw{ position:relative; flex:1; min-height:220u; border-radius:var(--r-sm); overflow:hidden; background:#e9e5df;
  --ha-card-border-radius: 0; --ha-card-box-shadow: none; --ha-card-border-width: 0; }
.mw > *{ position:absolute; inset:0; display:block; height:100%; }
`)}</style><ha-card class="glass"><div class="hd">${this._hd()}</div><div class="mw"></div></ha-card>`;
    this._mw = sr.querySelector('.mw');
    this._make();
  }
  _hd() { return `${H.icon(this._config.icon, 'ic')}<span class="tt">${H.esc(this._cfgTitle ? this._config.title : hgT('common.map'))}</span><span class="sp"></span><span class="note">${hgT('cards.map.people_count', { count: this._config.entities.filter((e) => String(e).startsWith('person.')).length })} · ${hgT('cards.map.zones_count', { count: this._config.entities.filter((e) => String(e).startsWith('zone.')).length })}</span>`; }
  _errHtml() { return `<div class="ph"><b>${hgT('cards.map.map_unavailable')}</b>${H.esc(this._err.message)}</div>`; }
  async _make() {
    const c = this._config;
    // theme_mode: auto -> jasna/ciemna mapa razem ze schematem dashboardu (HGTheme), przełączana na żywo
    const tm = c.theme_mode === 'auto' ? (typeof HGTheme !== 'undefined' && HGTheme.dark ? 'dark' : 'light') : c.theme_mode;
    this._tm = tm;
    if (this._map) { this._map.remove(); this._map = null; }
    const conf = { type: 'map', entities: c.entities.map((e) => (typeof e === 'string' ? { entity: e } : e)), theme_mode: tm, hours_to_show: c.hours_to_show, fit_zones: true };
    const mk = this._mk = (this._mk || 0) + 1;
    const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
    if (mk !== this._mk) return;
    let el;
    this._err = null;
    try { el = helpers.createCardElement(conf); } catch (e) { this._err = e || {}; this._mw.innerHTML = this._errHtml(); return; }
    el.layout = 'grid'; el.setAttribute('layout', 'grid');
    this._map = el; if (this._hass) el.hass = this._hass;
    this._mw.appendChild(el);
    // wewnętrzna karta mapy ma własny współczynnik proporcji – wymuszamy wypełnienie kontenera
    const fix = () => {
      const r = el.shadowRoot; if (!r) return false;
      if (!r.getElementById('hg-fill')) { const s = document.createElement('style'); s.id = 'hg-fill';
        s.textContent = 'ha-card{height:100%!important;border-radius:0!important;border:0!important;box-shadow:none!important} #root{height:100%!important;padding-bottom:0!important} ha-map{position:absolute;inset:0;height:100%!important} .leaflet-tooltip,.leaflet-tooltip-pane,.marker-text,button.name{font-size:13px!important;font-weight:600;line-height:1.25}';
        r.appendChild(s); }
      return true;
    };
    let n = 0; const t = setInterval(() => { if (fix() || ++n > 40) clearInterval(t); }, 150);
  }
  set hass(h) { this._hass = h; if (this._map) this._map.hass = h; }
  get hass() { return this._hass; }
  connectedCallback() {
    /* karta spoza HGBase: nagłówek (tytuł domyślny, os. / strefy) i komunikat błędu przepisywane po nadejściu katalogu */
    this._onLang = this._onLang || (() => { const d = this._config && this.shadowRoot.querySelector('.hd'); if (d) d.innerHTML = this._hd(); if (this._err && this._mw) this._mw.innerHTML = this._errHtml(); });
    window.addEventListener('hg-lang', this._onLang);
    this._onScheme = this._onScheme || (() => { if (this._config && this._config.theme_mode === 'auto' && this._tm !== (HGTheme.dark ? 'dark' : 'light')) this._make(); });
    window.addEventListener('hg-scheme', this._onScheme); this._onScheme();
  }
  disconnectedCallback() { window.removeEventListener('hg-scheme', this._onScheme); window.removeEventListener('hg-lang', this._onLang); }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 12, rows: 6 }; }
}
hgReg('hg-map-card', HGMapCard, hgTLazy('cards.map.picker_name'), hgTLazy('cards.map.picker_description'));
