import { LitElement } from 'lit';
import { fromHass } from '../ha/live';
import type { CustomCardMeta, HassLike, HassPort } from '../ha/types';

/** Baza karty Lovelace. Render czyta `port`, setter `hass` tylko owija obiekt HA. */
export abstract class NuvioCard extends LitElement {
  port: HassPort | null = null;
  protected config: Record<string, unknown> | null = null;
  private raw: HassLike | null = null;

  defaults(): Record<string, unknown> {
    return {};
  }

  setConfig(config: Record<string, unknown>) {
    if (!config) throw new Error('Missing configuration');
    this.config = { ...this.defaults(), ...config };
    this.requestUpdate();
  }

  set hass(hass: HassLike) {
    this.raw = hass;
    this.port = fromHass(hass, this);
    this.requestUpdate();
  }

  get hass(): HassLike | null {
    return this.raw;
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions(): { columns: number; rows: number } {
    return { columns: 6, rows: 2 };
  }

  protected entityId(): string {
    const id = this.config?.entity;
    return typeof id === 'string' ? id : '';
  }
}

export function registerCard(tag: string, ctor: CustomElementConstructor, meta: Pick<CustomCardMeta, 'name' | 'description'>) {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
  const cards = (window.customCards ??= []);
  if (!cards.some((card) => card.type === tag)) {
    cards.push({ type: tag, name: meta.name, description: meta.description, preview: false });
  }
}
