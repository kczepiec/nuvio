export interface EntityState {
  state: string;
  attributes: Record<string, unknown>;
  lastUpdated?: string;
}

export interface ServiceCall {
  domain: string;
  service: string;
  data?: Record<string, unknown>;
}

/** Obiekt hass, który Lovelace podaje karcie. Karty v3 go nie czytają. */
export interface HassLike {
  states: Record<string, { state: string; attributes: Record<string, unknown>; last_updated?: string }>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
}

export interface HassPort {
  state(entityId: string): EntityState | undefined;
  subscribe(entityIds: string[], cb: () => void): () => void;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
  moreInfo(entityId: string): void;
  formatPercent(value: number): string;
  entityIds(domain: string): string[];
}

export interface CustomCardMeta {
  type: string;
  name: string;
  description: string;
  preview: boolean;
}

declare global {
  interface Window {
    customCards?: CustomCardMeta[];
  }
}
