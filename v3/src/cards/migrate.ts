import type { EntityState } from '../ha/types';

export function watts(state: EntityState | undefined): number | null {
  if (!state) return null;
  const value = parseFloat(state.state);
  if (!Number.isFinite(value)) return null;
  const unit = String(state.attributes.unit_of_measurement || '').trim();
  if (unit === 'kW') return value * 1000;
  if (unit === 'MW') return value * 1e6;
  return value;
}

export function energyLoad(values: number[], maxPower: number, low: number, high: number) {
  if (!values.length || !maxPower) return null;
  const tot = values.reduce((sum, value) => sum + Math.abs(value), 0);
  const pct = Math.max(0, Math.min(100, (tot / maxPower) * 100));
  const level = pct < low ? 'low' : pct < high ? 'medium' : 'high';
  return { tot, pct, level };
}

export function greetingPart(hour: number): 'night' | 'morning' | 'afternoon' | 'evening' {
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/** Pusty {name} nie zostawia przecinka przed wykrzyknikiem. Twarda spacja przed ! zostaje. */
export function fillName(template: string, name: string): string {
  const bang = (chunk: string) => (chunk.includes('\u00a0') ? '\u00a0!' : '!');
  return String(template || '').replace(/\{name\}/g, name).replace(/,\s*!/g, bang).replace(/\s+!/g, bang);
}

const OPENINGS = new Set(['door', 'window', 'garage_door', 'opening', 'smoke', 'gas', 'moisture']);

export function needsAttention(id: string, state: EntityState | undefined): boolean {
  if (!state) return false;
  const domain = id.split('.')[0];
  const deviceClass = state.attributes.device_class;
  if (domain === 'lock' && state.state === 'unlocked') return true;
  if (domain === 'alarm_control_panel' && state.state === 'triggered') return true;
  return domain === 'binary_sensor' && state.state === 'on' && typeof deviceClass === 'string' && OPENINGS.has(deviceClass);
}

export function switchCall(rows: { id: string; state: string | undefined }[]): { service: 'turn_on' | 'turn_off'; entity_id: string[] } | null {
  const known = rows.filter((row) => row.state != null && row.state !== 'unavailable');
  if (!known.length) return null;
  const on = known.some((row) => row.state === 'on');
  return { service: on ? 'turn_off' : 'turn_on', entity_id: known.map((row) => row.id) };
}
