import { css, html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { watts } from './migrate';
import { buckets, coverIcon, domain, esc, friendly, idsOf, isPress, numAttr, numeric, press, safeUrl, sliderModel, sparkPath, stepRound, textAttr } from './domain';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';
import type { CardAction } from '../ha/types';

const ui = css`
  .row, .hd { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .nm { flex: 1; min-width: 0; }
  .nm b, .nm small, .sub { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nm small, .sub { opacity: .65; font-size: 12px; font-weight: 400; }
  .big { font-size: 32px; font-weight: 300; letter-spacing: -.03em; line-height: 1; }
  .big small { font-size: .4em; margin-left: 4px; opacity: .7; }
  button.sw { width: 44px; height: 28px; border-radius: 999px; background: color-mix(in srgb, var(--nv-ink, #1c1c1e) 16%, transparent); position: relative; }
  button.sw[aria-checked='true'] { background: var(--nv-accent, #63d71e); }
  button.sw i { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #fff; }
  button.sw[aria-checked='true'] i { transform: translateX(16px); }
  .trk { position: relative; height: 28px; border-radius: 999px; background: color-mix(in srgb, currentColor 12%, transparent); touch-action: none; cursor: pointer; }
  .trk i { position: absolute; inset: 0 auto 0 0; width: var(--p, 0%); min-width: 8px; background: var(--nv-accent, #63d71e); border-radius: inherit; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button[aria-pressed='true'] { background: var(--nv-accent, #63d71e); color: var(--nv-on-accent, #0b0f0a); border-radius: 999px; padding: 6px 10px; }
  .list { display: flex; flex-direction: column; gap: 4px; }
  .list button { display: flex; align-items: center; gap: 8px; min-height: 40px; text-align: left; }
  ha-card { flex-direction: column; gap: 8px; }
  ha-card.row { flex-direction: row; align-items: center; }
`;

function fraction(ev: PointerEvent, el: HTMLElement, vertical = false): number {
  const box = el.getBoundingClientRect();
  const raw = vertical ? 1 - (ev.clientY - box.top) / Math.max(1, box.height) : (ev.clientX - box.left) / Math.max(1, box.width);
  return Math.max(0, Math.min(1, raw));
}

function markdown(source: string): string {
  const out: string[] = [];
  let list = false;
  for (const raw of String(source || '').split(/\r?\n/)) {
    let line = esc(raw).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/`(.+?)`/g, '<code>$1</code>');
    if (/^\s*[-*] /.test(raw)) {
      if (!list) { out.push('<ul>'); list = true; }
      out.push(`<li>${line.replace(/^\s*[-*] /, '')}</li>`);
      continue;
    }
    if (list) { out.push('</ul>'); list = false; }
    if (/^#{1,3} /.test(raw)) out.push(`<h3>${line.replace(/^#{1,3} /, '')}</h3>`);
    else if (raw.trim()) out.push(`<p>${line}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('');
}

class NuvioUpdatesCard extends NuvioCard {
  override defaults() { return { title: 'Updates' }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  override render() {
    const ids = (this.port?.entityIds('update') || []).filter((id) => this.port?.state(id)?.state === 'on');
    const title = typeof this.config?.title === 'string' ? this.config.title : 'Updates';
    return html`<ha-card><div class="hd"><ha-icon icon=${ids.length ? 'mdi:package-up' : 'mdi:package-variant-closed-check'}></ha-icon><span class="nm"><b>${title}</b><small>${ids.length ? `${ids.length} available` : 'Everything is up to date'}</small></span></div>
      <div class="list">${ids.map((id) => html`<button type="button" @click=${() => this.port?.moreInfo(id)}><span class="nm">${textAttr(this.port?.state(id), 'title') || friendly(this.port?.state(id), id)}</span><small>${textAttr(this.port?.state(id), 'latest_version')}</small></button>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioImageCard extends NuvioCard {
  private timer = 0;
  private bust = 0;
  override defaults() { return { url: '', mode: 'image', title: null, fit: 'cover', ratio: '16/9', refresh: 0 }; }
  override getGridOptions() { return { columns: 6, rows: 4 }; }
  override connectedCallback() { super.connectedCallback(); this.arm(); }
  override setConfig(config: Record<string, unknown>) { super.setConfig(config); this.arm(); }
  override disconnectedCallback() { window.clearInterval(this.timer); super.disconnectedCallback(); }
  private arm() {
    window.clearInterval(this.timer);
    const refresh = Number(this.config?.refresh) || 0;
    if (this.isConnected && refresh >= 5) this.timer = window.setInterval(() => { this.bust = Date.now(); this.requestUpdate(); }, refresh * 1000);
  }
  override render() {
    const url = safeUrl(String(this.config?.url || ''));
    if (!url) return html`<ha-card><div class="ph"><b>Enter an address</b>https or a local path</div></ha-card>`;
    const ratio = /^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(String(this.config?.ratio || '')) ? String(this.config?.ratio) : '16/9';
    const src = this.bust && this.config?.mode !== 'iframe' ? `${url}${url.includes('?') ? '&' : '?'}_t=${this.bust}` : url;
    const title = typeof this.config?.title === 'string' ? this.config.title : '';
    const fit = this.config?.fit === 'contain' ? 'contain' : 'cover';
    return html`<ha-card class="media"><div class="fr" style=${`aspect-ratio:${ratio}`}>${this.config?.mode === 'iframe'
      ? html`<iframe src=${src} title=${title || 'Page'} loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>`
      : html`<img src=${src} alt=${title} style=${`object-fit:${fit}`}>`}${title ? html`<span class="ttl">${title}</span>` : ''}</div></ha-card>`;
  }
  static override styles = [face, css`ha-card.media { padding: 0; overflow: hidden; } .fr { position: relative; min-height: 120px; } img, iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; } .ttl { position: absolute; left: 12px; bottom: 10px; color: #fff; background: rgba(0,0,0,.42); border-radius: 999px; padding: 4px 10px; }`];
}

class NuvioNoteCard extends NuvioCard {
  override defaults() { return { title: null, icon: 'mdi:note-text-outline', text: '' }; }
  override getGridOptions() { return { columns: 6, rows: 2 }; }
  override render() {
    const title = typeof this.config?.title === 'string' ? this.config.title : '';
    const text = typeof this.config?.text === 'string' ? this.config.text : '';
    return html`<ha-card>${title ? html`<div class="hd"><ha-icon icon=${typeof this.config?.icon === 'string' ? this.config.icon : 'mdi:note-text-outline'}></ha-icon><b>${title}</b></div>` : ''}<div class="md">${text ? unsafeHTML(markdown(text)) : html`<div class="ph"><b>Empty note</b>Add text in the card</div>`}</div></ha-card>`;
  }
  static override styles = [face, css`.md { font-size: 14px; line-height: 1.45; overflow: auto; } .md p { margin: 0 0 6px; }`];
}

class NuvioSunCard extends NuvioCard {
  override defaults() { return { entity: 'sun.sun', title: 'Sun' }; }
  override render() {
    const id = typeof this.config?.entity === 'string' && this.config.entity ? this.config.entity : 'sun.sun';
    const state = this.port?.state(id);
    if (!state) return html`<ha-card><div class="ph"><b>No sun entity</b>Enable the sun integration</div></ha-card>`;
    const up = state.state === 'above_horizon';
    const time = (key: string) => { const raw = textAttr(state, key); return raw ? new Date(raw).toLocaleTimeString(this.port?.locale() || undefined, { hour: '2-digit', minute: '2-digit' }) : '–'; };
    return html`<ha-card><div class="hd"><ha-icon icon=${up ? 'mdi:white-balance-sunny' : 'mdi:weather-night'}></ha-icon><span class="nm"><b>${typeof this.config?.title === 'string' ? this.config.title : 'Sun'}</b><small>${up ? 'Above the horizon' : 'Below the horizon'}</small></span></div>
      <div class="row"><span>↑ ${time('next_rising')}</span><span class="nm"></span><span>↓ ${time('next_setting')}</span></div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioBatteryCard extends NuvioCard {
  override defaults() { return { title: 'Batteries', entities: [], low: 20, limit: 0 }; }
  override getGridOptions() { return { columns: 6, rows: 4 }; }
  override render() {
    const chosen = idsOf(this.config?.entities);
    const ids = (chosen.length ? chosen : (this.port?.entityIds('sensor') || []).filter((id) => textAttr(this.port?.state(id), 'device_class') === 'battery')).filter((id) => this.port?.state(id));
    if (!ids.length) return html`<ha-card><div class="ph"><b>No battery sensors</b>Pick sensors or leave the list empty</div></ha-card>`;
    const low = Number(this.config?.low) || 20;
    const rows = ids.map((id) => ({ id, value: numeric(this.port?.state(id)) })).sort((a, b) => (a.value ?? 999) - (b.value ?? 999));
    const limit = Number(this.config?.limit) || 0;
    const shown = limit > 0 ? rows.slice(0, limit) : rows;
    return html`<ha-card><b>${typeof this.config?.title === 'string' ? this.config.title : 'Batteries'}</b><div class="list">${shown.map((row) => html`<button type="button" @click=${() => this.port?.moreInfo(row.id)}><span class="nm">${friendly(this.port?.state(row.id), row.id)}</span><span>${row.value == null ? '–' : `${Math.round(row.value)}%`}</span></button>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioOpeningsCard extends NuvioCard {
  override defaults() { return { title: 'Doors and windows', entities: [], only_open: false }; }
  override getGridOptions() { return { columns: 6, rows: 4 }; }
  override render() {
    const chosen = idsOf(this.config?.entities);
    const openClass = new Set(['door', 'window', 'garage_door', 'opening']);
    const ids = (chosen.length ? chosen : (this.port?.entityIds('binary_sensor') || []).filter((id) => openClass.has(textAttr(this.port?.state(id), 'device_class')))).filter((id) => this.port?.state(id));
    if (!ids.length) return html`<ha-card><div class="ph"><b>No opening sensors</b>Pick door and window sensors</div></ha-card>`;
    const open = ids.filter((id) => this.port?.state(id)?.state === 'on');
    const list = this.config?.only_open === true ? open : [...open, ...ids.filter((id) => !open.includes(id))];
    return html`<ha-card><div class="hd"><span class="nm"><b>${typeof this.config?.title === 'string' ? this.config.title : 'Doors and windows'}</b><small>${open.length ? `${open.length} open` : 'All closed'}</small></span></div>
      <div class="list">${list.map((id) => html`<button type="button" @click=${() => this.port?.moreInfo(id)}><span class="nm">${friendly(this.port?.state(id), id)}</span><small>${this.port?.state(id)?.state === 'on' ? 'Open' : 'Closed'}</small></button>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioGlanceCard extends NuvioCard {
  override defaults() { return { entities: [], title: null, show_name: true, show_state: true, columns: null }; }
  override getGridOptions() { return { columns: 12, rows: 2 }; }
  override render() {
    const rows = Array.isArray(this.config?.entities) ? this.config.entities : [];
    const items = rows.map((item) => typeof item === 'string' ? { entity: item, name: '', icon: '' } : item && typeof item === 'object' ? item as Record<string, unknown> : null).filter((item): item is Record<string, unknown> => !!item && typeof item.entity === 'string');
    if (!items.length) return html`<ha-card><span class="ph">Choose entities</span></ha-card>`;
    const columns = Math.round(Number(this.config?.columns)) || 0;
    return html`<ha-card>${typeof this.config?.title === 'string' ? html`<b>${this.config.title}</b>` : ''}<div class="gl" style=${columns ? `--c:${Math.min(8, columns)}` : ''}>${items.map((item) => {
      const id = String(item.entity);
      const state = this.port?.state(id);
      const name = typeof item.name === 'string' && item.name ? item.name : friendly(state, id);
      return html`<button type="button" @click=${() => this.port?.moreInfo(id)}><ha-icon icon=${typeof item.icon === 'string' && item.icon ? item.icon : textAttr(state, 'icon') || 'mdi:circle-outline'}></ha-icon>${this.config?.show_name === false ? '' : html`<b>${name}</b>`}${this.config?.show_state === false ? '' : html`<small>${state ? this.port?.formatState(id) || state.state : 'Missing'}</small>`}</button>`;
    })}</div></ha-card>`;
  }
  static override styles = [face, css`.gl { display: grid; grid-template-columns: repeat(var(--c, auto-fit), minmax(64px, 1fr)); gap: 8px; } .gl button { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; } .gl b, .gl small { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`];
}

class NuvioPersonCard extends NuvioCard {
  override defaults() { return { home_label: 'Home', away_label: 'Away' }; }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>${id || 'Person'}</b>Entity not found</div></ha-card>`;
    const home = state.state === 'home';
    const zone = home ? String(this.config?.home_label || 'Home') : state.state === 'not_home' ? String(this.config?.away_label || 'Away') : state.state;
    return html`<ha-card class="row" @click=${() => this.port?.moreInfo(id)}><span class="nm"><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><small>${zone}</small></span></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioWebpageCard extends NuvioCard {
  override defaults() { return { url: null, title: null, aspect_ratio: '16:9', height: null }; }
  override getGridOptions() { return { columns: 12, rows: 4 }; }
  override render() {
    const url = safeUrl(String(this.config?.url || ''));
    if (!url) return html`<ha-card><span class="ph">Enter a page address</span></ha-card>`;
    const match = String(this.config?.aspect_ratio || '').match(/^(\d+(?:\.\d+)?)\s*[:x/]\s*(\d+(?:\.\d+)?)$/);
    const style = this.config?.height ? `height:${Math.max(80, Number(this.config.height) || 0)}px` : `aspect-ratio:${match ? `${match[1]} / ${match[2]}` : '16 / 9'}`;
    const title = typeof this.config?.title === 'string' ? this.config.title : '';
    return html`<ha-card>${title ? html`<div class="hd"><b class="nm">${title}</b><button type="button" aria-label="Open" @click=${() => window.open(url, '_blank', 'noopener')}><ha-icon icon="mdi:open-in-new"></ha-icon></button></div>` : ''}<div class="fr" style=${style}><iframe src=${url} title=${title || url} loading="lazy" referrerpolicy="no-referrer" allow="fullscreen"></iframe></div></ha-card>`;
  }
  static override styles = [face, ui, css`.fr { position: relative; min-height: 120px; } iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }`];
}

class NuvioPeopleCard extends NuvioCard {
  override defaults() { return { title: 'Household', persons: [], zones: [] }; }
  override render() {
    const persons = idsOf(this.config?.persons);
    const zones = idsOf(this.config?.zones);
    return html`<ha-card><b>${typeof this.config?.title === 'string' ? this.config.title : 'Household'}</b><div class="list">${persons.map((id) => {
      const state = this.port?.state(id); if (!state) return '';
      const where = state.state === 'home' ? 'Home' : state.state === 'not_home' ? 'Away' : state.state;
      return html`<button type="button" @click=${() => this.port?.moreInfo(id)}><span class="nm"><b>${friendly(state, id)}</b><small>${where}</small></span></button>`;
    })}</div>${zones.length ? html`<div class="chips">${zones.map((id) => html`<button type="button" @click=${() => this.port?.moreInfo(id)}>${friendly(this.port?.state(id), id)} ${this.port?.state(id)?.state || ''}</button>`)}</div>` : ''}</ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioFamilyCard extends NuvioCard {
  override defaults() { return { title: 'Family', persons: null, add: true }; }
  override getGridOptions() { return { columns: 6, rows: 2 }; }
  override render() {
    const chosen = idsOf(this.config?.persons);
    const ids = chosen.length ? chosen : (this.port?.entityIds('person') || []).slice().sort();
    const home = ids.filter((id) => this.port?.state(id)?.state === 'home');
    return html`<ha-card><div class="hd"><span class="nm"><b>${typeof this.config?.title === 'string' ? this.config.title : 'Family'}</b><small>${ids.length ? `${home.length} of ${ids.length} home` : 'No people'}</small></span>${this.config?.add === false ? '' : html`<button type="button" aria-label="Add" @click=${() => this.port?.runAction({ navigate: '/config/person' })}><ha-icon icon="mdi:plus"></ha-icon></button>`}</div>
      <div class="list">${ids.map((id) => html`<div class="row"><span class="nm">${friendly(this.port?.state(id), id)}</span><small>${this.port?.formatState(id) || ''}</small></div>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioPhasesCard extends NuvioCard {
  override defaults() { return { title: 'Power now', phases: [], max_power: 17250, phase_max: 5750 }; }
  override render() {
    const phases = Array.isArray(this.config?.phases) ? this.config.phases as Array<Record<string, unknown>> : [];
    let total = 0;
    const rows = phases.map((phase) => {
      const power = watts(typeof phase.power === 'string' ? this.port?.state(phase.power) : undefined);
      const volts = numeric(typeof phase.voltage === 'string' ? this.port?.state(phase.voltage) : undefined);
      const amps = numeric(typeof phase.current === 'string' ? this.port?.state(phase.current) : undefined);
      if (power == null) return { name: String(phase.name || ''), watts: null, volts, amps, pct: 0 };
      const abs = Math.abs(power); total += abs;
      return { name: String(phase.name || ''), watts: abs, volts, amps, pct: Math.min(100, (abs / (Number(this.config?.phase_max) || 5750)) * 100) };
    });
    const max = Number(this.config?.max_power) || 17250;
    const pct = Math.min(100, (total / max) * 100);
    return html`<ha-card><b>${typeof this.config?.title === 'string' ? this.config.title : 'Power now'}</b><div class="big">${total >= 1000 ? (total / 1000).toFixed(2) : Math.round(total)}<small>${total >= 1000 ? 'kW' : 'W'}</small></div><small>${Math.round(pct)}%</small>
      <div class="list">${rows.map((row) => html`<div class="row"><span class="nm">${row.name}</span><span>${row.watts == null ? '–' : `${Math.round(row.watts)} W`}</span></div>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioGaugeCard extends NuvioCard {
  override defaults() { return { entity: null, name: null, min: null, max: null }; }
  override getGridOptions() { return { columns: 3, rows: 3 }; }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose a sensor</b>Any numeric sensor</div></ha-card>`;
    const value = numeric(state);
    const unit = textAttr(state, 'unit_of_measurement');
    const min = this.config?.min == null ? (unit === '°C' ? -20 : 0) : Number(this.config.min);
    const max = this.config?.max == null ? (unit === '%' ? 100 : unit === '°C' ? 40 : 100) : Number(this.config.max);
    const span = max - min || 1;
    const ratio = value == null ? 0 : Math.max(0, Math.min(1, (value - min) / span));
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><div class="trk" role="meter" aria-valuenow=${value ?? 0} aria-valuemin=${min} aria-valuemax=${max}><i style=${`--p:${ratio * 100}%`}></i></div><div class="big">${value == null ? '–' : this.port?.formatNumber(value, 1)}<small>${unit}</small></div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioProgressCard extends NuvioCard {
  override defaults() { return { entity: null, name: null, min: 0, max: null, warn: null, bad: null, decimals: 0 }; }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a sensor</span></ha-card>`;
    const value = numeric(state);
    const min = Number(this.config?.min) || 0;
    const max = this.config?.max == null ? 100 : Number(this.config.max);
    const pct = value == null ? 0 : ((value - min) / (max - min || 1)) * 100;
    return html`<ha-card><div class="hd"><span class="nm"><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b></span><button type="button" aria-label="Details" @click=${() => this.port?.moreInfo(id)}><ha-icon icon="mdi:arrow-expand"></ha-icon></button></div>
      <div class="big">${value == null ? '–' : this.port?.formatNumber(value, Number(this.config?.decimals) || 0)}</div><div class="trk" role="meter" aria-valuenow=${Math.round(pct)}><i style=${`--p:${Math.max(0, Math.min(100, pct))}%`}></i></div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioVacuumCard extends NuvioCard {
  override defaults() { return { entity: null, name: null }; }
  override getGridOptions() { return { columns: 6, rows: 2 }; }
  private act = (service: string) => {
    const id = this.entityId();
    const d = domain(id) === 'lawn_mower' ? 'lawn_mower' : 'vacuum';
    const mapped = d === 'lawn_mower' ? { start: 'start_mowing', pause: 'pause', return_to_base: 'dock' }[service] || service : service;
    void this.port?.callService(d, mapped, { entity_id: id });
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose a vacuum</b></div></ha-card>`;
    const running = ['cleaning', 'mowing', 'returning'].includes(state.state);
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><small>${state.state}</small><div class="chips"><button type="button" @click=${() => this.act(running ? 'pause' : 'start')}>${running ? 'Pause' : 'Start'}</button><button type="button" @click=${() => this.act('return_to_base')}>Dock</button><button type="button" @click=${() => this.port?.moreInfo(id)}>More</button></div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioMediaMiniCard extends NuvioCard {
  override defaults() { return { entity: null, name: null }; }
  override getGridOptions() { return { columns: 6, rows: 1 }; }
  private cmd = (service: string) => { const id = this.entityId(); if (id) void this.port?.callService('media_player', service, { entity_id: id }); };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose a player</b></div></ha-card>`;
    const playing = state.state === 'playing';
    return html`<ha-card class="row"><span class="nm"><b>${textAttr(state, 'media_title') || friendly(state, id)}</b><small>${textAttr(state, 'media_artist') || state.state}</small></span>
      <button type="button" aria-label="Previous" @click=${() => this.cmd('media_previous_track')}><ha-icon icon="mdi:skip-previous"></ha-icon></button>
      <button type="button" aria-label=${playing ? 'Pause' : 'Play'} @click=${() => this.cmd('media_play_pause')}><ha-icon icon=${playing ? 'mdi:pause' : 'mdi:play'}></ha-icon></button>
      <button type="button" aria-label="Next" @click=${() => this.cmd('media_next_track')}><ha-icon icon="mdi:skip-next"></ha-icon></button></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioScriptCard extends NuvioCard {
  private done = false;
  private timer = 0;
  override defaults() { return { name: null, subtitle: 'Tap to run' }; }
  override getGridOptions() { return { columns: 3, rows: 2 }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  private run = () => {
    const id = this.entityId();
    if (!id || this.port?.state(id)?.state === 'on') return;
    void this.port?.callService('script', 'turn_on', { entity_id: id });
    this.done = true;
    this.requestUpdate();
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.done = false; this.requestUpdate(); }, 2200);
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    const running = state?.state === 'on';
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    return html`<ha-card><button type="button" @click=${this.run} ?disabled=${!state || state.state === 'unavailable' || running}><span class="nm"><b>${name}</b><small>${running ? 'Running' : this.done ? 'Started' : String(this.config?.subtitle || 'Tap to run')}</small></span></button></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioButtonCard extends NuvioCard {
  private done = false;
  private timer = 0;
  override defaults() { return { entity: null, name: null, mode: 'tile', tap_action: null, subtitle: null }; }
  override getGridOptions() { return { columns: 3, rows: 2 }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  private run = () => {
    const id = this.entityId();
    const action = this.config?.tap_action;
    if (!this.port) return;
    press(this.port, id, action && typeof action === 'object' ? action as CardAction : null);
    this.done = true;
    this.requestUpdate();
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.done = false; this.requestUpdate(); }, 1600);
  };
  override render() {
    const id = this.entityId();
    const action = this.config?.tap_action;
    if (!id && !action) return html`<ha-card><div class="ph"><b>Choose an entity</b>Script, scene, button or an action</div></ha-card>`;
    const state = id ? this.port?.state(id) : undefined;
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id || 'Button');
    return html`<ha-card><button type="button" @click=${this.run}><span class="nm"><b>${name}</b><small>${this.done ? 'Done' : typeof this.config?.subtitle === 'string' ? this.config.subtitle : 'Tap to run'}</small></span></button></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioActionsCard extends NuvioCard {
  override defaults() { return { title: null, actions: [] }; }
  override getGridOptions() { return { columns: 6, rows: 1 }; }
  private go = (index: number) => {
    const actions = Array.isArray(this.config?.actions) ? this.config.actions as Record<string, unknown>[] : [];
    const item = actions[index];
    if (!item || !this.port) return;
    if (item.service || item.navigate || item.url || item.more_info) this.port.runAction(item as CardAction);
    else if (typeof item.entity === 'string') press(this.port, item.entity, item.tap_action && typeof item.tap_action === 'object' ? item.tap_action as CardAction : null);
  };
  override render() {
    const actions = Array.isArray(this.config?.actions) ? this.config.actions as Record<string, unknown>[] : [];
    if (!actions.length) return html`<ha-card><span class="ph">Add actions</span></ha-card>`;
    return html`<ha-card>${typeof this.config?.title === 'string' ? html`<b>${this.config.title}</b>` : ''}<div class="chips">${actions.map((item, index) => {
      const id = typeof item.entity === 'string' ? item.entity : '';
      const name = typeof item.name === 'string' ? item.name : friendly(id ? this.port?.state(id) : undefined, id || String(item.service || 'Action'));
      return html`<button type="button" aria-label=${name} @click=${() => this.go(index)}><ha-icon icon=${typeof item.icon === 'string' ? item.icon : 'mdi:gesture-tap'}></ha-icon></button>`;
    })}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioToggleCard extends NuvioCard {
  override defaults() { return { entity: null, name: null, icon: null }; }
  override getGridOptions() { return { columns: 6, rows: 1 }; }
  private toggle = () => { const id = this.entityId(); if (id) void this.port?.callService('homeassistant', 'toggle', { entity_id: id }); };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a device</span></ha-card>`;
    const on = !['off', 'closed', 'locked', 'idle', 'standby', 'unavailable', 'unknown'].includes(state.state);
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    return html`<ha-card class="row"><button type="button" @click=${() => this.port?.moreInfo(id)}><ha-icon icon=${typeof this.config?.icon === 'string' ? this.config.icon : textAttr(state, 'icon') || 'mdi:power'}></ha-icon></button><span class="nm"><b>${name}</b><small>${this.port?.formatState(id) || state.state}</small></span><button class="sw" type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label=${name} @click=${this.toggle}><i></i></button></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioEntitiesCard extends NuvioCard {
  override defaults() { return { title: 'Entities', entities: [] }; }
  override render() {
    const rows = Array.isArray(this.config?.entities) ? this.config.entities : [];
    if (!rows.length) return html`<ha-card><div class="ph"><b>Add entities</b>A list with toggles</div></ha-card>`;
    return html`<ha-card><b>${typeof this.config?.title === 'string' ? this.config.title : 'Entities'}</b><div class="list">${rows.map((item) => {
      const row = typeof item === 'string' ? { entity: item } : item as Record<string, unknown>;
      const id = typeof row.entity === 'string' ? row.entity : '';
      const state = id ? this.port?.state(id) : undefined;
      const name = typeof row.name === 'string' ? row.name : friendly(state, id);
      const on = !!state && ['on', 'open', 'unlocked', 'playing', 'home'].includes(state.state);
      return html`<div class="row"><button type="button" class="nm" @click=${() => id && this.port?.moreInfo(id)}><b>${name}</b><small>${state?.state || ''}</small></button>${isPress(id)
        ? html`<button type="button" @click=${() => this.port && press(this.port, id)}>Run</button>`
        : ['light', 'switch', 'fan', 'input_boolean', 'siren', 'humidifier'].includes(domain(id))
          ? html`<button class="sw" type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label=${name} @click=${() => this.port?.callService(domain(id), 'toggle', { entity_id: id })}><i></i></button>`
          : html`<span>${state ? this.port?.formatState(id) || state.state : ''}</span>`}</div>`;
    })}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioLampCard extends NuvioCard {
  override defaults() { return { entity: null, name: null, icon: null }; }
  override getGridOptions() { return { columns: 6, rows: 2 }; }
  private setBrightness = (value: number) => { const id = this.entityId(); if (id) void this.port?.callService('light', 'turn_on', { entity_id: id, brightness_pct: value }); };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose a light</b></div></ha-card>`;
    const on = state.state === 'on';
    const modes = state.attributes.supported_color_modes;
    const dim = Array.isArray(modes) && modes.some((mode) => mode !== 'onoff');
    const brightness = on ? (numAttr(state, 'brightness') == null ? 100 : Math.round((numAttr(state, 'brightness') || 0) / 2.55)) : 0;
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    return html`<ha-card><div class="hd"><span class="nm"><b>${name}</b><small>${on ? (dim ? `${brightness}%` : 'On') : 'Off'}</small></span><button class="sw" type="button" role="switch" aria-checked=${on ? 'true' : 'false'} aria-label=${name} @click=${() => this.port?.callService('light', 'toggle', { entity_id: id })}><i></i></button></div>
      ${dim ? html`<div class="chips">${[25, 50, 100].map((step) => html`<button type="button" @click=${() => this.setBrightness(step)}>${step}%</button>`)}</div>` : ''}</ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioThermoCard extends NuvioCard {
  override defaults() { return { entity: null, name: null }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  private bump = (direction: number) => {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    const current = state ? numAttr(state, 'temperature') : null;
    if (!state || current == null || !id) return;
    const step = numAttr(state, 'target_temp_step') || (domain(id) === 'water_heater' ? 1 : 0.5);
    const value = Math.round((current + step * direction) * 10) / 10;
    void this.port?.callService(domain(id), 'set_temperature', { entity_id: id, temperature: value });
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose a thermostat</b></div></ha-card>`;
    const target = numAttr(state, 'temperature') ?? numAttr(state, 'target_temp_low');
    const modes = Array.isArray(state.attributes.hvac_modes) ? state.attributes.hvac_modes.filter((mode): mode is string => typeof mode === 'string') : [];
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><div class="row"><button type="button" aria-label="Lower" @click=${() => this.bump(-1)}><ha-icon icon="mdi:minus"></ha-icon></button><span class="big nm">${target == null ? '–' : target}</span><button type="button" aria-label="Higher" @click=${() => this.bump(1)}><ha-icon icon="mdi:plus"></ha-icon></button></div>
      <div class="chips">${modes.slice(0, 5).map((mode) => html`<button type="button" aria-pressed=${state.state === mode ? 'true' : 'false'} @click=${() => this.port?.callService(domain(id), domain(id) === 'water_heater' ? 'set_operation_mode' : 'set_hvac_mode', domain(id) === 'water_heater' ? { entity_id: id, operation_mode: mode } : { entity_id: id, hvac_mode: mode })}>${mode}</button>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioSelectCard extends NuvioCard {
  private pending: string | null = null;
  private timer = 0;
  override defaults() { return { entity: null, name: null, mode: 'chips' }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  private choose = (option: string) => {
    const id = this.entityId();
    this.pending = option;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.pending = null; this.requestUpdate(); }, 3000);
    void this.port?.callService(domain(id), 'select_option', { entity_id: id, option });
    this.requestUpdate();
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose an entity</b>Select or input select</div></ha-card>`;
    const current = this.pending ?? state.state;
    const options = Array.isArray(state.attributes.options) ? state.attributes.options.filter((option): option is string => typeof option === 'string') : [];
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><small>${current}</small><div class="chips" role="radiogroup">${options.map((option) => html`<button type="button" aria-pressed=${option === current ? 'true' : 'false'} @click=${() => this.choose(option)}>${option}</button>`)}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioLockCard extends NuvioCard {
  override defaults(): Record<string, unknown> { return { entity: null, name: null, confirm: true }; }
  override getGridOptions() { return { columns: 6, rows: 2 }; }
  private go = () => {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state || !id) return;
    const locked = state.state === 'locked';
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    const data: Record<string, unknown> = { entity_id: id };
    if (textAttr(state, 'code_format')) {
      const code = window.prompt(`Code for ${name}`);
      if (!code) return;
      data.code = code;
    } else if (locked && this.config?.confirm !== false && !window.confirm(`Unlock ${name}?`)) return;
    void this.port?.callService('lock', locked ? 'unlock' : 'lock', data);
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a lock</span></ha-card>`;
    const locked = state.state === 'locked';
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    return html`<ha-card><div class="hd"><span class="nm"><b>${name}</b><small>${this.port?.formatState(id) || state.state}</small></span><button type="button" aria-label="More" @click=${() => this.port?.moreInfo(id)}><ha-icon icon="mdi:dots-vertical"></ha-icon></button></div>
      <button type="button" @click=${this.go}>${locked ? 'Unlock' : 'Lock'}</button></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioCoverCard extends NuvioCard {
  private drag: number | null = null;
  private pending: number | null = null;
  private timer = 0;
  override defaults() { return { entity: null, name: null }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  private send(value: number) {
    const id = this.entityId();
    this.pending = value;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.pending = null; this.requestUpdate(); }, 6000);
    void this.port?.callService('cover', 'set_cover_position', { entity_id: id, position: value });
  }
  private move = (ev: PointerEvent) => {
    const el = ev.currentTarget as HTMLElement;
    if (ev.type === 'pointerdown') el.setPointerCapture(ev.pointerId);
    this.drag = Math.round(fraction(ev, el) * 100);
    if (ev.type === 'pointerup' || ev.type === 'pointercancel') { const value = this.drag; this.drag = null; if (value != null) this.send(value); }
    this.requestUpdate();
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a cover</span></ha-card>`;
    const features = Number(state.attributes.supported_features) || 0;
    const can = (bit: number) => !features || (features & bit) !== 0;
    const known = numAttr(state, 'current_position') != null;
    const pos = this.drag ?? this.pending ?? numAttr(state, 'current_position') ?? (state.state === 'open' ? 100 : 0);
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    const icon = (typeof this.config?.icon === 'string' && this.config.icon) || textAttr(state, 'icon') || coverIcon(textAttr(state, 'device_class'), state.state);
    const moving = state.state === 'opening' || state.state === 'closing';
    return html`<ha-card><div class="hd"><ha-icon icon=${icon}></ha-icon><b>${name}</b></div>${known ? html`<div class="trk" role="slider" tabindex="0" aria-valuenow=${pos} @pointerdown=${this.move} @pointermove=${(ev: PointerEvent) => { if (this.drag != null) this.move(ev); }} @pointerup=${this.move}><i style=${`--p:${pos}%`}></i></div>` : html`<div class="cv-st ${moving ? 'mv' : ''}" role="status">${this.port?.formatState(id) || state.state}</div>`}
      <div class="chips">${can(1) ? html`<button type="button" @click=${() => this.port?.callService('cover', 'open_cover', { entity_id: id })}>Open</button>` : ''}${can(8) ? html`<button type="button" @click=${() => this.port?.callService('cover', 'stop_cover', { entity_id: id })}>Stop</button>` : ''}${can(2) ? html`<button type="button" @click=${() => this.port?.callService('cover', 'close_cover', { entity_id: id })}>Close</button>` : ''}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioSliderCard extends NuvioCard {
  private drag: number | null = null;
  private pending: number | null = null;
  private timer = 0;
  override defaults() { return { entity: null, name: null, mode: 'h' }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  private send(value: number) {
    const model = sliderModel(this.port, this.entityId());
    if (!model.set) return;
    this.pending = value;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.pending = null; this.requestUpdate(); }, 4000);
    model.set(value);
  }
  override render() {
    const id = this.entityId();
    const model = sliderModel(this.port, id);
    if (!id || !model.set && !this.port?.state(id)) return html`<ha-card><div class="ph"><b>Choose an entity</b>Light, fan, cover, volume or number</div></ha-card>`;
    const value = this.drag ?? this.pending ?? model.value;
    const span = model.max - model.min || 1;
    const pct = ((value - model.min) / span) * 100;
    const vertical = this.config?.mode === 'v';
    const move = (ev: PointerEvent) => {
      if (!model.ok) return;
      const el = ev.currentTarget as HTMLElement;
      if (ev.type === 'pointerdown') el.setPointerCapture(ev.pointerId);
      const next = stepRound(model.min + fraction(ev, el, vertical) * span, model);
      if (ev.type === 'pointerup' || ev.type === 'pointercancel') { this.drag = null; this.send(next); }
      else this.drag = next;
      this.requestUpdate();
    };
    return html`<ha-card><div class="hd"><span class="nm"><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(this.port?.state(id), id)}</b><small>${model.label}</small></span><span>${model.ok ? value : 'unavailable'}</span></div>
      <div class="trk" role="slider" tabindex="0" aria-valuemin=${model.min} aria-valuemax=${model.max} aria-valuenow=${value} @pointerdown=${move} @pointermove=${(ev: PointerEvent) => { if (this.drag != null) move(ev); }} @pointerup=${move}><i style=${`--p:${pct}%`}></i></div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioStepperCard extends NuvioCard {
  private pending: number | null = null;
  private timer = 0;
  override defaults() { return { entity: null, name: null }; }
  override getGridOptions() { return { columns: 3, rows: 2 }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  private step(direction: number) {
    const id = this.entityId();
    const state = this.port?.state(id);
    if (!state || state.state === 'unavailable') return;
    if (domain(id) === 'counter') {
      void this.port?.callService('counter', direction > 0 ? 'increment' : 'decrement', { entity_id: id });
      return;
    }
    const model = sliderModel(this.port, id);
    const value = stepRound((this.pending ?? model.value) + direction * model.step, model);
    this.pending = value;
    model.set?.(value);
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.pending = null; this.requestUpdate(); }, 3000);
    this.requestUpdate();
  }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><div class="ph"><b>Choose an entity</b>Counter or number</div></ha-card>`;
    const model = sliderModel(this.port, id);
    const value = this.pending ?? (domain(id) === 'counter' ? numeric(state) || 0 : model.value);
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><div class="row"><button type="button" aria-label="Decrease" @click=${() => this.step(-1)}><ha-icon icon="mdi:minus"></ha-icon></button><span class="big nm">${value}</span><button type="button" aria-label="Increase" @click=${() => this.step(1)}><ha-icon icon="mdi:plus"></ha-icon></button></div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioRoomCompactCard extends NuvioCard {
  override defaults() { return { name: null, temperature: null, humidity: null, entity: null }; }
  private send = (value: number) => { const id = typeof this.config?.entity === 'string' ? this.config.entity : ''; sliderModel(this.port, id).set?.(value); };
  override render() {
    const tempId = typeof this.config?.temperature === 'string' ? this.config.temperature : '';
    const humidId = typeof this.config?.humidity === 'string' ? this.config.humidity : '';
    const id = typeof this.config?.entity === 'string' ? this.config.entity : '';
    const model = sliderModel(this.port, id);
    const temp = numeric(tempId ? this.port?.state(tempId) : undefined);
    const humid = numeric(humidId ? this.port?.state(humidId) : undefined);
    const name = typeof this.config?.name === 'string' ? this.config.name : 'Room';
    return html`<ha-card><div class="hd"><span class="nm"><b>${name}</b><small>${temp == null ? '' : `${temp.toFixed(1)}°`}${humid == null ? '' : ` · ${Math.round(humid)}%`}</small></span>${id ? html`<button class="sw" type="button" role="switch" aria-checked=${model.on ? 'true' : 'false'} aria-label=${name} @click=${() => this.port?.callService('homeassistant', 'toggle', { entity_id: id })}><i></i></button>` : ''}</div>
      ${model.ok ? html`<div class="trk" role="slider" tabindex="0" @pointerup=${(ev: PointerEvent) => this.send(stepRound(model.min + fraction(ev, ev.currentTarget as HTMLElement) * (model.max - model.min || 1), model))}><i style=${`--p:${((model.value - model.min) / (model.max - model.min || 1)) * 100}%`}></i></div>` : ''}</ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioArcCard extends NuvioCard {
  protected pending: number | null = null;
  private timer = 0;
  override defaults(): Record<string, unknown> { return { entity: null, name: null, icon: null }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  override disconnectedCallback() { window.clearTimeout(this.timer); super.disconnectedCallback(); }
  protected extra(): TemplateResult { return html``; }
  private send(value: number) {
    const model = sliderModel(this.port, this.entityId());
    if (!model.set) return;
    this.pending = value;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => { this.pending = null; this.requestUpdate(); }, 4000);
    model.set(value);
    this.requestUpdate();
  }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a light, fan or number</span></ha-card>`;
    const model = sliderModel(this.port, id);
    const value = this.pending ?? model.value;
    const pct = ((value - model.min) / (model.max - model.min || 1)) * 100;
    const name = typeof this.config?.name === 'string' ? this.config.name : friendly(state, id);
    return html`<ha-card><div class="hd"><span class="nm"><b>${name}</b><small>${model.label} ${value}${model.unit}</small></span>${['light', 'switch', 'fan', 'input_boolean', 'humidifier'].includes(model.domain) ? html`<button class="sw" type="button" role="switch" aria-checked=${model.on ? 'true' : 'false'} aria-label=${name} @click=${() => this.port?.callService('homeassistant', 'toggle', { entity_id: id })}><i></i></button>` : ''}</div>
      <div class="trk" role="slider" tabindex="0" aria-valuenow=${value} @pointerup=${(ev: PointerEvent) => model.ok && this.send(stepRound(model.min + fraction(ev, ev.currentTarget as HTMLElement) * (model.max - model.min || 1), model))}><i style=${`--p:${pct}%`}></i></div>${this.extra()}</ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioFanCard extends NuvioArcCard {
  override defaults(): Record<string, unknown> { return { entity: null, name: null, icon: 'mdi:fan' }; }
  protected override extra() {
    const state = this.port?.state(this.entityId());
    const modes = Array.isArray(state?.attributes.preset_modes) ? state.attributes.preset_modes.filter((mode): mode is string => typeof mode === 'string') : [];
    return html`<div class="chips">${modes.map((mode) => html`<button type="button" aria-pressed=${state?.attributes.preset_mode === mode ? 'true' : 'false'} @click=${() => this.port?.callService('fan', 'set_preset_mode', { entity_id: this.entityId(), preset_mode: mode })}>${mode.replace(/_/g, ' ')}</button>`)}</div>`;
  }
}

class NuvioHumidifierCard extends NuvioArcCard {
  override defaults(): Record<string, unknown> { return { entity: null, name: null, icon: 'mdi:air-humidifier' }; }
  protected override extra() {
    const state = this.port?.state(this.entityId());
    const modes = Array.isArray(state?.attributes.available_modes) ? state.attributes.available_modes.filter((mode): mode is string => typeof mode === 'string') : [];
    const current = numAttr(state, 'current_humidity');
    return html`${current == null ? '' : html`<small>Now ${Math.round(current)}%</small>`}<div class="chips">${modes.map((mode) => html`<button type="button" aria-pressed=${state?.attributes.mode === mode ? 'true' : 'false'} @click=${() => this.port?.callService('humidifier', 'set_mode', { entity_id: this.entityId(), mode })}>${mode.replace(/_/g, ' ')}</button>`)}</div>`;
  }
}

class NuvioStatCard extends NuvioCard {
  private hours = 0;
  private key = '';
  private points: { t: number; v: number }[] | null = null;
  override defaults() { return { entity: null, name: null, hours: 24, decimals: 1 }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  private load(id: string, hours: number) {
    const key = `${id}|${hours}`;
    if (this.key === key || !this.port) return;
    this.key = key;
    void this.port.history(id, hours).then((points) => { if (this.key !== key) return; this.points = points; this.requestUpdate(); });
  }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a numeric sensor</span></ha-card>`;
    const hours = this.hours || Number(this.config?.hours) || 24;
    this.load(id, hours);
    const start = Date.now() - hours * 3600e3;
    const values = (this.points || []).filter((point) => point.t >= start).map((point) => point.v);
    const finite = values.filter((value) => Number.isFinite(value));
    const avg = finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : NaN;
    const digits = Number(this.config?.decimals) || 0;
    const fmt = (value: number) => Number.isFinite(value) ? this.port?.formatNumber(value, digits) : '–';
    const path = sparkPath(buckets(this.points || [], hours, 48));
    return html`<ha-card><div class="hd"><span class="nm"><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b></span><button type="button" aria-label="Details" @click=${() => this.port?.moreInfo(id)}><ha-icon icon="mdi:arrow-expand"></ha-icon></button></div>
      ${this.points ? finite.length ? html`<div class="chips"><span>Min ${fmt(Math.min(...finite))}</span><span>Avg ${fmt(avg)}</span><span>Max ${fmt(Math.max(...finite))}</span></div>${path ? html`<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d=${path} fill="none" stroke="currentColor" stroke-width="2"></path></svg>` : ''}` : html`<span class="ph">No history in this period</span>` : html`<span class="ph">Loading</span>`}
      <div class="chips">${[[24, '24 h'], [168, '7 days'], [720, '30 days']].map(([value, label]) => html`<button type="button" aria-pressed=${value === hours ? 'true' : 'false'} @click=${() => { this.hours = Number(value); this.points = null; this.key = ''; this.requestUpdate(); }}>${label}</button>`)}</div></ha-card>`;
  }
  static override styles = [face, ui, css`svg { width: 100%; height: 70px; }`];
}

class NuvioChartCard extends NuvioCard {
  private key = '';
  private points: number[] | null = null;
  override defaults() { return { entity: null, name: null, hours: 24, style: 'area', points: 48, decimals: 1 }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a numeric sensor</span></ha-card>`;
    const hours = Number(this.config?.hours) || 24;
    const key = `${id}|${hours}|${this.config?.points || 48}`;
    if (this.key !== key && this.port) {
      this.key = key;
      void this.port.history(id, hours).then((rows) => { if (this.key !== key) return; this.points = buckets(rows, hours, Math.max(8, Number(this.config?.points) || 48)); this.requestUpdate(); });
    }
    const path = this.points ? sparkPath(this.points) : '';
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><div class="big">${numeric(state) == null ? '–' : this.port?.formatNumber(numeric(state) || 0, Number(this.config?.decimals) || 0)}<small>${textAttr(state, 'unit_of_measurement')}</small></div>${path ? html`<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d=${path} fill="none" stroke="currentColor" stroke-width="2"></path></svg>` : html`<span class="ph">${this.points ? 'Not enough history yet' : 'Loading'}</span>`}</ha-card>`;
  }
  static override styles = [face, ui, css`svg { width: 100%; height: 80px; }`];
}

class NuvioHistoryCard extends NuvioCard {
  private key = '';
  private series: number[][] = [];
  override defaults() { return { title: 'History', entities: [], hours: 24 }; }
  override getGridOptions() { return { columns: 12, rows: 4 }; }
  override render() {
    const ids = idsOf(this.config?.entities).filter((id) => this.port?.state(id));
    if (!ids.length) return html`<ha-card><div class="ph"><b>Choose sensors</b>One or more numeric sensors</div></ha-card>`;
    const hours = Number(this.config?.hours) || 24;
    const key = `${ids.join()}|${hours}`;
    if (this.key !== key && this.port) {
      this.key = key;
      void Promise.all(ids.map((id) => this.port!.history(id, hours))).then((rows) => {
        if (this.key !== key) return;
        this.series = rows.map((points) => buckets(points, hours, 48));
        this.requestUpdate();
      });
    }
    const colors = ['currentColor', '#4FB3FF', '#F5B83D', '#FF6B57', '#B48CFF', '#3DD6C6'];
    return html`<ha-card><b>${typeof this.config?.title === 'string' ? this.config.title : 'History'}</b><svg viewBox="0 0 100 100" preserveAspectRatio="none">${this.series.map((line, index) => { const d = sparkPath(line); return d ? html`<path d=${d} fill="none" stroke=${colors[index % colors.length]} stroke-width="2"></path>` : ''; })}</svg></ha-card>`;
  }
  static override styles = [face, ui, css`svg { width: 100%; height: 120px; }`];
}

class NuvioTimerCard extends NuvioCard {
  private timer = 0;
  override defaults() { return { entity: null, name: null }; }
  override getGridOptions() { return { columns: 6, rows: 3 }; }
  override disconnectedCallback() { window.clearInterval(this.timer); super.disconnectedCallback(); }
  override updated() {
    const active = this.port?.state(this.entityId())?.state === 'active';
    if (active && !this.timer) this.timer = window.setInterval(() => this.requestUpdate(), 1000);
    if (!active && this.timer) { window.clearInterval(this.timer); this.timer = 0; }
  }
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a timer</span></ha-card>`;
    const finishes = textAttr(state, 'finishes_at');
    const left = state.state === 'active' && finishes ? Math.max(0, (Date.parse(finishes) - Date.now()) / 1000) : 0;
    const clock = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`;
    const call = (service: string) => { void this.port?.callService('timer', service, { entity_id: id }); };
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><div class="big">${clock}</div><div class="chips">${state.state === 'active' ? html`<button type="button" @click=${() => call('pause')}>Pause</button>` : html`<button type="button" @click=${() => call('start')}>${state.state === 'paused' ? 'Resume' : 'Start'}</button>`}${state.state === 'idle' ? '' : html`<button type="button" @click=${() => call('cancel')}>Cancel</button>`}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

class NuvioTodoCard extends NuvioCard {
  private key = '';
  private items: Array<{ uid: string; summary?: string; status?: string }> | null = null;
  override defaults() { return { entity: null, name: null, show_done: 3 }; }
  override getGridOptions() { return { columns: 6, rows: 4 }; }
  private async reload(id: string) {
    const raw = await this.port?.callWS({ type: 'todo/item/list', entity_id: id });
    const items = raw && typeof raw === 'object' && Array.isArray((raw as { items?: unknown }).items) ? (raw as { items: Array<{ uid: string; summary?: string; status?: string }> }).items : [];
    this.items = items;
    this.requestUpdate();
  }
  private add = (event: Event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const input = form.querySelector('input');
    const item = input?.value.trim();
    const id = this.entityId();
    if (!item || !id) return;
    if (input) input.value = '';
    void this.port?.callService('todo', 'add_item', { entity_id: id, item });
  };
  override render() {
    const id = this.entityId();
    const state = id ? this.port?.state(id) : undefined;
    if (!state) return html`<ha-card><span class="ph">Choose a to-do list</span></ha-card>`;
    const key = `${id}|${state.state}|${state.lastUpdated || ''}`;
    if (this.key !== key) { this.key = key; void this.reload(id); }
    const open = (this.items || []).filter((item) => item.status !== 'completed');
    const done = (this.items || []).filter((item) => item.status === 'completed').slice(0, Number(this.config?.show_done) || 0);
    const tick = (item: { uid: string; status?: string }) => {
      const status = item.status === 'completed' ? 'needs_action' : 'completed';
      void this.port?.callService('todo', 'update_item', { entity_id: id, item: item.uid, status });
    };
    return html`<ha-card><b>${typeof this.config?.name === 'string' ? this.config.name : friendly(state, id)}</b><form class="row" @submit=${this.add}><input name="task" aria-label="New task" placeholder="Add a task" autocomplete="off"><button type="submit" aria-label="Add">+</button></form>
      <div class="list">${this.items ? [...open, ...done].map((item) => html`<button type="button" @click=${() => tick(item)}><span class="nm">${item.summary || ''}</span><small>${item.status === 'completed' ? 'Done' : ''}</small></button>`) : html`<span class="ph">Loading</span>`}</div></ha-card>`;
  }
  static override styles = [face, ui, css`input { flex: 1; min-width: 0; border: 0; border-radius: 999px; padding: 8px 12px; background: color-mix(in srgb, currentColor 8%, transparent); color: inherit; font: inherit; }`];
}

class NuvioLogbookCard extends NuvioCard {
  private key = '';
  private events: Array<{ entity_id?: string; name?: string; state?: string; message?: string; when?: number }> | null = null;
  override defaults() { return { entities: [], title: 'Recent activity', hours: 24, max: 6 }; }
  override getGridOptions() { return { columns: 6, rows: 4 }; }
  override render() {
    const ids = idsOf(this.config?.entities);
    if (!ids.length) return html`<ha-card><span class="ph">Choose entities for the log</span></ha-card>`;
    const key = ids.map((id) => `${id}${this.port?.state(id)?.lastUpdated || ''}`).join('|');
    if (this.key !== key && this.port) {
      this.key = key;
      const hours = Number(this.config?.hours) || 24;
      void this.port.callWS({ type: 'logbook/get_events', start_time: new Date(Date.now() - hours * 3600e3).toISOString(), end_time: new Date().toISOString(), entity_ids: ids }).then((raw) => {
        if (this.key !== key) return;
        this.events = Array.isArray(raw) ? raw as NuvioLogbookCard['events'] : [];
        this.requestUpdate();
      });
    }
    const max = Math.max(1, Number(this.config?.max) || 6);
    const rows = (this.events || []).filter((event) => event.entity_id).sort((a, b) => (b.when || 0) - (a.when || 0)).slice(0, max);
    return html`<ha-card><b>${typeof this.config?.title === 'string' ? this.config.title : 'Recent activity'}</b><div class="list">${this.events == null ? html`<span class="ph">Loading</span>` : rows.length ? rows.map((event) => html`<div class="row"><span class="nm"><b>${event.name || event.entity_id}</b><small>${event.state || event.message || ''}</small></span></div>`) : html`<span class="ph">No activity in this period</span>`}</div></ha-card>`;
  }
  static override styles = [face, ui];
}

registerCard('nuvio-updates-card', NuvioUpdatesCard, { name: 'Nuvio – Updates', description: 'Pending updates' });
registerCard('nuvio-image-card', NuvioImageCard, { name: 'Nuvio – Image', description: 'Picture or page' });
registerCard('nuvio-note-card', NuvioNoteCard, { name: 'Nuvio – Note', description: 'A short note' });
registerCard('nuvio-sun-card', NuvioSunCard, { name: 'Nuvio – Sun', description: 'Sunrise and sunset' });
registerCard('nuvio-battery-card', NuvioBatteryCard, { name: 'Nuvio – Batteries', description: 'Battery levels' });
registerCard('nuvio-openings-card', NuvioOpeningsCard, { name: 'Nuvio – Openings', description: 'Doors and windows' });
registerCard('nuvio-glance-card', NuvioGlanceCard, { name: 'Nuvio – Glance', description: 'Several entities in a row' });
registerCard('nuvio-person-card', NuvioPersonCard, { name: 'Nuvio – Person', description: 'One person' });
registerCard('nuvio-webpage-card', NuvioWebpageCard, { name: 'Nuvio – Web page', description: 'A page in a frame' });
registerCard('nuvio-people-card', NuvioPeopleCard, { name: 'Nuvio – People', description: 'People and zones' });
registerCard('nuvio-family-card', NuvioFamilyCard, { name: 'Nuvio – Family', description: 'Who is home' });
registerCard('nuvio-phases-card', NuvioPhasesCard, { name: 'Nuvio – Phases', description: 'Power by phase' });
registerCard('nuvio-gauge-card', NuvioGaugeCard, { name: 'Nuvio – Gauge', description: 'A sensor on a scale' });
registerCard('nuvio-progress-card', NuvioProgressCard, { name: 'Nuvio – Progress', description: 'A value on a bar' });
registerCard('nuvio-vacuum-card', NuvioVacuumCard, { name: 'Nuvio – Vacuum', description: 'Vacuum or mower' });
registerCard('nuvio-media-mini-card', NuvioMediaMiniCard, { name: 'Nuvio – Player', description: 'Compact media controls' });
registerCard('nuvio-script-card', NuvioScriptCard, { name: 'Nuvio – Script', description: 'Run a script' });
registerCard('nuvio-button-card', NuvioButtonCard, { name: 'Nuvio – Button', description: 'Run an entity or an action' });
registerCard('nuvio-actions-card', NuvioActionsCard, { name: 'Nuvio – Actions', description: 'Round action buttons' });
registerCard('nuvio-toggle-card', NuvioToggleCard, { name: 'Nuvio – Toggle', description: 'One entity with a switch' });
registerCard('nuvio-entities-card', NuvioEntitiesCard, { name: 'Nuvio – Entities', description: 'A list of entities' });
registerCard('nuvio-lamp-card', NuvioLampCard, { name: 'Nuvio – Lamp', description: 'Light with brightness steps' });
registerCard('nuvio-thermo-card', NuvioThermoCard, { name: 'Nuvio – Thermostat', description: 'Target temperature and mode' });
registerCard('nuvio-select-card', NuvioSelectCard, { name: 'Nuvio – Select', description: 'Pick an option' });
registerCard('nuvio-lock-card', NuvioLockCard, { name: 'Nuvio – Lock', description: 'Lock and unlock' });
registerCard('nuvio-cover-card', NuvioCoverCard, { name: 'Nuvio – Cover', description: 'Position, open, stop, close' });
registerCard('nuvio-slider-card', NuvioSliderCard, { name: 'Nuvio – Slider', description: 'Brightness, volume, position or number' });
registerCard('nuvio-stepper-card', NuvioStepperCard, { name: 'Nuvio – Stepper', description: 'Step a counter or number' });
registerCard('nuvio-room-compact-card', NuvioRoomCompactCard, { name: 'Nuvio – Room compact', description: 'Temperature and a light' });
registerCard('nuvio-arc-card', NuvioArcCard, { name: 'Nuvio – Arc', description: 'A value you drag' });
registerCard('nuvio-fan-card', NuvioFanCard, { name: 'Nuvio – Fan', description: 'Fan speed and presets' });
registerCard('nuvio-humidifier-card', NuvioHumidifierCard, { name: 'Nuvio – Humidifier', description: 'Target humidity and modes' });
registerCard('nuvio-stat-card', NuvioStatCard, { name: 'Nuvio – Statistic', description: 'Min, average and max' });
registerCard('nuvio-chart-card', NuvioChartCard, { name: 'Nuvio – Chart', description: 'Sensor history' });
registerCard('nuvio-history-card', NuvioHistoryCard, { name: 'Nuvio – History', description: 'Several sensors on one chart' });
registerCard('nuvio-timer-card', NuvioTimerCard, { name: 'Nuvio – Timer', description: 'Start, pause and cancel' });
registerCard('nuvio-todo-card', NuvioTodoCard, { name: 'Nuvio – To-do', description: 'Tasks from a to-do list' });
registerCard('nuvio-logbook-card', NuvioLogbookCard, { name: 'Nuvio – Logbook', description: 'Recent changes' });
