import type { CardAction, EntityState, HassPort } from '../ha/types';

export function domain(id: string): string {
  return String(id || '').split('.')[0] || '';
}

export function textAttr(state: EntityState | undefined, key: string): string {
  const value = state?.attributes[key];
  return typeof value === 'string' ? value : '';
}

export function numAttr(state: EntityState | undefined, key: string): number | null {
  const value = state?.attributes[key];
  const n = typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function friendly(state: EntityState | undefined, id: string): string {
  return textAttr(state, 'friendly_name') || id;
}

export function numeric(state: EntityState | undefined): number | null {
  if (!state) return null;
  const value = parseFloat(state.state);
  return Number.isFinite(value) ? value : null;
}

export function esc(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] || ch);
}

const PRESS = new Set(['script', 'scene', 'button', 'input_button', 'automation']);

export function isPress(id: string): boolean {
  return PRESS.has(domain(id));
}

/** To samo mapowanie co hgPress: akcja kafelka albo usługa domeny. */
export function press(port: HassPort, id: string, action?: CardAction | null) {
  if (action && (action.navigate || action.url || action.more_info || action.service || action.back)) {
    port.runAction(action);
    return;
  }
  const d = domain(id);
  if (d === 'script' || d === 'scene') void port.callService(d, 'turn_on', { entity_id: id });
  else if (d === 'button' || d === 'input_button') void port.callService(d, 'press', { entity_id: id });
  else if (d === 'automation') void port.callService('automation', 'trigger', { entity_id: id });
  else if (d === 'lock') {
    const locked = port.state(id)?.state === 'locked';
    void port.callService('lock', locked ? 'unlock' : 'lock', { entity_id: id });
  } else if (id) void port.callService('homeassistant', 'toggle', { entity_id: id });
}

export interface SliderModel {
  domain: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  value: number;
  on: boolean;
  ok: boolean;
  label: string;
  set: ((value: number) => void) | null;
}

const OFF = new Set(['off', 'unavailable', 'unknown', 'closed', 'idle', 'standby']);

export function sliderModel(port: HassPort | null, id: string): SliderModel {
  const state = id ? port?.state(id) : undefined;
  const d = domain(id);
  const model: SliderModel = {
    domain: d, min: 0, max: 100, step: 1, unit: '%', value: 0,
    on: !!state && !OFF.has(state.state), ok: !!state && state.state !== 'unavailable' && state.state !== 'unknown',
    label: 'Level', set: null,
  };
  if (!port || !state) return model;
  const set = (domainName: string, service: string, data: Record<string, unknown>) => {
    void port.callService(domainName, service, data);
  };
  if (d === 'light') {
    const modes = state.attributes.supported_color_modes;
    model.value = state.state === 'on' ? (numAttr(state, 'brightness') == null ? 100 : Math.round((numAttr(state, 'brightness') || 0) / 2.55)) : 0;
    model.label = 'Brightness';
    model.ok = model.ok && Array.isArray(modes) && modes.some((mode) => mode !== 'onoff');
    model.set = (value) => (value <= 0 ? set('light', 'turn_off', { entity_id: id }) : set('light', 'turn_on', { entity_id: id, brightness_pct: value }));
  } else if (d === 'media_player') {
    model.value = Math.round((numAttr(state, 'volume_level') || 0) * 100);
    model.label = 'Volume';
    model.ok = model.ok && numAttr(state, 'volume_level') != null;
    model.set = (value) => set('media_player', 'volume_set', { entity_id: id, volume_level: value / 100 });
  } else if (d === 'fan') {
    model.value = state.state === 'on' ? (numAttr(state, 'percentage') == null ? 100 : numAttr(state, 'percentage') || 0) : 0;
    model.step = numAttr(state, 'percentage_step') || 1;
    model.label = 'Speed';
    model.set = (value) => (value <= 0 ? set('fan', 'turn_off', { entity_id: id }) : set('fan', 'set_percentage', { entity_id: id, percentage: Math.round(value) }));
  } else if (d === 'cover' || d === 'valve') {
    const pos = numAttr(state, d === 'cover' ? 'current_position' : 'current_valve_position');
    model.value = pos ?? (state.state === 'open' ? 100 : 0);
    model.label = 'Position';
    model.ok = model.ok && pos != null;
    model.set = (value) => set(d, d === 'cover' ? 'set_cover_position' : 'set_valve_position', { entity_id: id, position: Math.round(value) });
  } else if (d === 'input_number' || d === 'number') {
    model.min = numAttr(state, 'min') || 0;
    model.max = numAttr(state, 'max') ?? 100;
    model.step = numAttr(state, 'step') || 1;
    model.unit = textAttr(state, 'unit_of_measurement');
    model.value = numeric(state) ?? model.min;
    model.on = true;
    model.label = 'Value';
    model.set = (value) => set(d, 'set_value', { entity_id: id, value });
  } else if (d === 'humidifier') {
    model.min = numAttr(state, 'min_humidity') || 0;
    model.max = numAttr(state, 'max_humidity') || 100;
    model.value = numAttr(state, 'humidity') ?? model.min;
    model.label = 'Target humidity';
    model.set = (value) => set('humidifier', 'set_humidity', { entity_id: id, humidity: Math.round(value) });
  } else model.ok = false;
  return model;
}

export function stepRound(value: number, model: Pick<SliderModel, 'min' | 'max' | 'step'>): number {
  const places = (String(model.step).split('.')[1] || '').length;
  const stepped = Math.round((value - model.min) / (model.step || 1)) * (model.step || 1) + model.min;
  return +Math.max(model.min, Math.min(model.max, stepped)).toFixed(places);
}

export function buckets(points: { t: number; v: number }[], hours: number, count = 48): number[] {
  const end = Date.now();
  const start = end - hours * 3600e3;
  const width = (end - start) / count;
  const out = new Array<number>(count).fill(NaN);
  const sum = new Array<number>(count).fill(0);
  const hits = new Array<number>(count).fill(0);
  let last: number | null = null;
  for (const point of points) {
    if (point.t < start) { last = point.v; continue; }
    const index = Math.min(count - 1, Math.floor((point.t - start) / width));
    sum[index] = (sum[index] || 0) + point.v;
    hits[index] = (hits[index] || 0) + 1;
  }
  for (let i = 0; i < count; i++) {
    if (hits[i]) last = (sum[i] || 0) / (hits[i] || 1);
    out[i] = last == null ? NaN : last;
  }
  return out;
}

const COVER_ICONS: Record<string, [string, string]> = {
  gate: ['mdi:gate', 'mdi:gate-open'],
  garage: ['mdi:garage', 'mdi:garage-open'],
  door: ['mdi:door-closed', 'mdi:door-open'],
  window: ['mdi:window-closed', 'mdi:window-open'],
  blind: ['mdi:blinds', 'mdi:blinds-open'],
  curtain: ['mdi:curtains-closed', 'mdi:curtains'],
  shade: ['mdi:roller-shade-closed', 'mdi:roller-shade'],
  awning: ['mdi:awning-outline', 'mdi:awning'],
  shutter: ['mdi:window-shutter', 'mdi:window-shutter-open'],
};

/** Ikona rolety według device_class. Zamknięta ma pierwszą, otwarta i ruch drugą. */
export function coverIcon(deviceClass: string | undefined, state: string): string {
  const pair = COVER_ICONS[deviceClass || ''] || COVER_ICONS.shutter;
  return state === 'closed' ? pair[0] : pair[1];
}

export function safeUrl(value: string): string {
  const url = String(value || '').trim();
  return /^(https?:\/\/|\/local\/|\/api\/|\/hacsfiles\/|\/media\/|\/)/.test(url) ? url : '';
}

export interface Condition {
  condition?: string;
  entity?: string;
  state?: string | string[];
  state_not?: string | string[];
  above?: number;
  below?: number;
  media_query?: string;
  users?: string[];
  conditions?: Condition[];
}

function hasState(value: string | string[] | undefined, state: string): boolean {
  return value == null || [value].flat().map(String).includes(state);
}

export function conditionsMet(list: Condition[] | undefined, stateOf: (id: string) => string | undefined, userId: string): boolean {
  return (list || []).every((item) => {
    if (!item) return true;
    const kind = item.condition || (item.entity ? (item.above != null || item.below != null ? 'numeric_state' : 'state') : '');
    if (kind === 'and') return conditionsMet(item.conditions, stateOf, userId);
    if (kind === 'or') return (item.conditions || []).some((child) => conditionsMet([child], stateOf, userId));
    if (kind === 'screen') {
      try { return !item.media_query || matchMedia(item.media_query).matches; } catch { return true; }
    }
    if (kind === 'user') return !item.users?.length || item.users.includes(userId);
    const state = item.entity ? stateOf(item.entity) : undefined;
    if (state == null) return false;
    if (kind === 'numeric_state') {
      const value = parseFloat(state);
      return Number.isFinite(value) && (item.above == null || value > +item.above) && (item.below == null || value < +item.below);
    }
    return hasState(item.state, state) && (item.state_not == null || ![item.state_not].flat().map(String).includes(state));
  });
}

export function sparkPath(values: number[]): string {
  const ok = values.filter((value) => Number.isFinite(value));
  if (ok.length < 2) return '';
  const min = Math.min(...ok);
  const max = Math.max(...ok);
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = (index / Math.max(1, values.length - 1)) * 100;
    const y = Number.isFinite(value) ? 100 - ((value - min) / span) * 90 - 5 : 50;
    return `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

export function idsOf(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item : item && typeof item === 'object' && typeof (item as { entity?: unknown }).entity === 'string' ? (item as { entity: string }).entity : '')).filter(Boolean);
}
