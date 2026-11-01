import { css, html, type TemplateResult } from 'lit';
import type { HassLike } from '../ha/types';
import { conditionsMet, type Condition } from './domain';
import { face } from './face';
import { NuvioCard, registerCard } from './nuvio-card';

function records(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object') : [];
}

function tagFrom(type: string): string {
  const raw = type.startsWith('custom:') ? type.slice(7) : '';
  return raw.replace(/^hg-/, 'nuvio-');
}

function isContainer(cfg: Record<string, unknown>): boolean {
  const type = String(cfg.type || '');
  const tag = tagFrom(type);
  return ['nuvio-stack-card', 'nuvio-grid-card', 'nuvio-tabs-card', 'nuvio-conditional-card'].includes(tag)
    || ['grid', 'vertical-stack', 'horizontal-stack', 'conditional'].includes(type);
}

function normalize(cfg: Record<string, unknown>): Record<string, unknown> {
  if (cfg.keep_ha) return cfg;
  const cards = Array.isArray(cfg.cards) ? cfg.cards.map((kid) => (kid && typeof kid === 'object' ? normalize(kid as Record<string, unknown>) : kid)) : cfg.cards;
  const next = cards === cfg.cards ? cfg : { ...cfg, cards };
  const type = String(cfg.type || '');
  if (type === 'grid') return { ...next, type: 'custom:nuvio-grid-card', columns: cfg.columns || 3 };
  if (type === 'vertical-stack') return { ...next, type: 'custom:nuvio-stack-card', direction: 'vertical' };
  if (type === 'horizontal-stack') return { ...next, type: 'custom:nuvio-stack-card', direction: 'horizontal' };
  if (type === 'conditional' && cfg.card && typeof cfg.card === 'object') {
    return { type: 'custom:nuvio-conditional-card', conditions: cfg.conditions || [], cards: [normalize(cfg.card as Record<string, unknown>)] };
  }
  return next;
}

function clean(cfg: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(cfg)) {
    if (key === 'span' || key === 'keep_ha' || key.startsWith('nv_')) continue;
    out[key] = cfg[key];
  }
  return out;
}

function pass(el: HTMLElement, hass: HassLike | null) {
  if (!hass) return;
  try { (el as HTMLElement & { hass?: HassLike }).hass = hass; } catch { /* karta odrzuciła stan */ }
}

function mount(cfg: Record<string, unknown>, holder: HTMLElement, hass: HassLike | null) {
  const tag = tagFrom(String(cfg.type || ''));
  const place = (el: HTMLElement) => {
    if (el.parentElement !== holder) holder.replaceChildren(el);
    pass(el, hass);
  };
  if (tag) {
    const make = () => {
      const el = document.createElement(tag) as HTMLElement & { setConfig?: (config: Record<string, unknown>) => void };
      try { el.setConfig?.(clean(cfg)); } catch (error) { el.textContent = error instanceof Error ? error.message : String(error); }
      place(el);
    };
    if (customElements.get(tag)) make();
    else void customElements.whenDefined(tag).then(make);
    return;
  }
  const helpers = (window as Window & { loadCardHelpers?: () => Promise<{ createCardElement: (config: unknown) => HTMLElement }> }).loadCardHelpers;
  if (helpers) void helpers().then((api) => place(api.createCardElement(clean(cfg)))).catch(() => {});
}

export class NuvioStackCard extends NuvioCard {
  protected layout: 'stack' | 'grid' = 'stack';
  private kids: HTMLElement[] = [];
  private made = new Map<string, HTMLElement>();
  private narrow = false;
  private studio = false;
  private observer: ResizeObserver | null = null;

  override defaults(): Record<string, unknown> {
    return { cards: [], direction: 'vertical', glass: true, title: null, gap: null, divider: true, columns: 3, square: false, min_width: 160, wrap_below: 420 };
  }

  override getCardSize() {
    return this.childConfigs().length * 2 || 1;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('data-nv-host', '');
    if (this.parentElement?.classList.contains('st-k')) {
      this.studio = true;
      this.style.height = '100%';
      this.style.overflow = 'hidden';
    }
    if (typeof ResizeObserver !== 'undefined' && !this.observer) {
      this.observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width || 0;
        const wrap = Number(this.config?.wrap_below) || 0;
        const next = this.config?.direction === 'horizontal' && wrap > 0 && width > 0 && width < wrap;
        if (next !== this.narrow) { this.narrow = next; this.requestUpdate(); }
      });
      this.observer.observe(this);
    }
  }

  override disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = null;
    super.disconnectedCallback();
  }

  protected childConfigs(): Record<string, unknown>[] {
    return records(this.config?.cards).map(normalize);
  }

  protected shown(): boolean {
    return true;
  }

  private depth(): number {
    let count = 1;
    let node: Node | null = this;
    for (let i = 0; i < 12 && node; i++) {
      const root: Node = node.getRootNode();
      const host: EventTarget | null = root instanceof ShadowRoot ? root.host : null;
      if (!(host instanceof HTMLElement)) break;
      if (host.hasAttribute('data-nv-host')) count += 1;
      node = host;
    }
    return count;
  }

  override willUpdate() {
    const on = this.shown();
    this.toggleAttribute('hidden', !on);
    if (!on) {
      this.kids = [];
      return;
    }
    const deep = this.depth() >= 3;
    this.kids = this.childConfigs().map((cfg, index) => {
      const sig = `${this.layout}:${index}:${JSON.stringify(cfg)}`;
      const existing = this.made.get(sig);
      if (existing) return existing;
      const holder = document.createElement('div');
      holder.className = 'sl';
      const span = Number(cfg.span) || 1;
      if (span > 1) holder.style.setProperty('--sp', String(span));
      if (deep && isContainer(cfg)) holder.textContent = 'Too many container levels';
      else mount(cfg, holder, this.hass);
      this.made.set(sig, holder);
      return holder;
    });
    for (const holder of this.kids) {
      const card = holder.firstElementChild;
      if (card instanceof HTMLElement) pass(card, this.hass);
    }
  }

  override render(): TemplateResult {
    if (!this.shown()) return html``;
    const title = typeof this.config?.title === 'string' ? this.config.title : '';
    const horizontal = this.layout === 'stack' && this.config?.direction === 'horizontal' && !this.narrow;
    const flat = this.config?.glass === false;
    const columns = Math.max(1, Math.min(6, Math.round(Number(this.config?.columns) || 3)));
    const gap = this.config?.gap != null && this.config.gap !== '' && Number.isFinite(Number(this.config.gap)) ? `${Number(this.config.gap)}px` : '';
    const cls = `${this.layout}${horizontal ? ' h' : ''}${flat ? ' flat' : ''}${this.config?.square ? ' sq' : ''}${this.studio ? ' stt' : ''}`;
    return html`
      <ha-card class=${cls} style=${`${gap ? `--nv-gap:${gap};` : ''}${this.layout === 'grid' ? `--cols:${columns}` : ''}`}>
        ${title ? html`<b class="hd">${title}</b>` : ''}
        <div class="bd">${this.kids}${this.kids.length ? '' : html`<span class="ph">Add cards to the stack</span>`}</div>
      </ha-card>
    `;
  }

  static override styles = [face, css`
    ha-card.flat { background: none; box-shadow: none; }
    .hd { display: block; padding: 4px 4px 8px; }
    .bd { display: flex; flex-direction: column; gap: var(--nv-gap, 8px); min-width: 0; flex: 1; }
    ha-card.h .bd { flex-direction: row; }
    .sl { min-width: 0; flex: 1 1 0; }
    ha-card.grid .bd { display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); }
    ha-card.grid .sl { grid-column: span var(--sp, 1); }
    ha-card.sq .sl { aspect-ratio: 1; }
    ha-card.stt .bd { flex: 1 1 auto; min-height: 0; overflow: auto; }
    ha-card.stt .sl { flex: 1 0 auto; }
    :host([hidden]) { display: none; }
    .tabs { display: flex; gap: 6px; flex-wrap: wrap; padding-bottom: 8px; }
    .tabs button[aria-selected='true'] { background: var(--nv-accent, #63d71e); color: var(--nv-on-accent, #0b0f0a); border-radius: 999px; padding: 6px 12px; }
  `];
}

export class NuvioGridCard extends NuvioStackCard {
  protected override layout: 'stack' | 'grid' = 'grid';

  override defaults(): Record<string, unknown> {
    return { ...super.defaults(), columns: 3, square: false, glass: false, min_width: 160 };
  }

  override getGridOptions() {
    return { columns: 12, rows: 2 };
  }
}

export class NuvioTabsCard extends NuvioStackCard {
  private tab = 0;

  override defaults(): Record<string, unknown> {
    return { tabs: [], glass: true, title: null };
  }

  protected override childConfigs() {
    const tabs = records(this.config?.tabs);
    const current = tabs[this.tab] || tabs[0];
    return records(current?.cards).map(normalize);
  }

  private pick = (index: number) => {
    if (index === this.tab) return;
    this.tab = index;
    this.requestUpdate();
  };

  override render() {
    const tabs = records(this.config?.tabs);
    const bar = html`<div class="tabs" role="tablist">${tabs.map((tab, index) => html`
      <button type="button" role="tab" aria-selected=${index === this.tab ? 'true' : 'false'} @click=${() => this.pick(index)}>${typeof tab.label === 'string' ? tab.label : `Tab ${index + 1}`}</button>
    `)}</div>`;
    const body = super.render();
    return html`${bar}${body}`;
  }
}

export class NuvioConditionalCard extends NuvioStackCard {
  private queries: Array<() => void> = [];

  override defaults(): Record<string, unknown> {
    return { ...super.defaults(), conditions: [], glass: false, divider: false };
  }

  protected override shown() {
    if ((this as { _hgPv?: boolean })._hgPv) return true;
    const list = this.config?.conditions;
    return conditionsMet(Array.isArray(list) ? list as Condition[] : [], (id) => this.port?.state(id)?.state, this.port?.userId() || '');
  }

  override connectedCallback() {
    super.connectedCallback();
    const list = Array.isArray(this.config?.conditions) ? this.config.conditions as Condition[] : [];
    for (const item of list) {
      if (item?.condition === 'screen' && item.media_query) {
        const query = matchMedia(item.media_query);
        const onChange = () => this.requestUpdate();
        query.addEventListener('change', onChange);
        this.queries.push(() => query.removeEventListener('change', onChange));
      }
    }
  }

  override disconnectedCallback() {
    for (const stop of this.queries) stop();
    this.queries = [];
    super.disconnectedCallback();
  }
}

registerCard('nuvio-stack-card', NuvioStackCard, { name: 'Nuvio – Stack', description: 'Cards in one column or row' });
registerCard('nuvio-grid-card', NuvioGridCard, { name: 'Nuvio – Grid', description: 'Cards in columns' });
registerCard('nuvio-tabs-card', NuvioTabsCard, { name: 'Nuvio – Tabs', description: 'Pills that switch a set of cards' });
registerCard('nuvio-conditional-card', NuvioConditionalCard, { name: 'Nuvio – Conditional', description: 'Cards shown when conditions match' });
