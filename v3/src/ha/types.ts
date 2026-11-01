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
  states: Record<string, { state: string; attributes: Record<string, unknown>; last_updated?: string; entity_id?: string }>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  user?: { name?: string; id?: string };
  locale?: { language?: string };
  language?: string;
  formatEntityState?(entity: { state: string; attributes: Record<string, unknown> }): string;
  callWS?(message: Record<string, unknown>): Promise<unknown>;
}

/** Akcja kafelka w kształcie, którego używa układ 2.x. */
export interface CardAction {
  navigate?: string;
  url?: string;
  more_info?: string;
  service?: string;
  data?: Record<string, unknown>;
  back?: boolean;
  fallback?: string;
}

export interface HassPort {
  state(entityId: string): EntityState | undefined;
  subscribe(entityIds: string[], cb: () => void): () => void;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
  moreInfo(entityId: string): void;
  formatPercent(value: number): string;
  formatNumber(value: number, digits: number): string;
  formatState(entityId: string): string;
  entityIds(domain: string): string[];
  firstName(): string;
  userId(): string;
  locale(): string;
  runAction(action: CardAction | null | undefined): void;
  callWS(message: Record<string, unknown>): Promise<unknown>;
  history(entityId: string, hours: number): Promise<{ t: number; v: number }[]>;
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
