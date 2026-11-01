import type { EntityState } from '../ha/types';

export interface LightView {
  on: boolean;
  unavailable: boolean;
  percent: number;
  name: string;
}

export type LightCommand =
  | { kind: 'service'; domain: 'light'; service: 'toggle' | 'turn_on' | 'turn_off'; data: Record<string, unknown> }
  | { kind: 'more-info' }
  | { kind: 'noop' };

export function brightnessPercent(state: EntityState | undefined, drag: number | null, pending: number | null): number {
  if (drag != null) return drag;
  if (pending != null) return pending;
  if (!state || state.state !== 'on') return 0;
  const raw = state.attributes.brightness;
  if (typeof raw !== 'number') return 100;
  return Math.round((raw / 255) * 100);
}

export function nextPending(pending: number | null, prevUpdated: string | undefined, nextUpdated: string | undefined): number | null {
  if (pending == null) return null;
  if (prevUpdated && nextUpdated && prevUpdated !== nextUpdated) return null;
  return pending;
}

export function lightView(
  state: EntityState | undefined,
  entity: string,
  name: string | null | undefined,
  drag: number | null,
  pending: number | null,
): LightView {
  const friendly = state?.attributes.friendly_name;
  return {
    on: !!state && state.state === 'on',
    unavailable: !state || state.state === 'unavailable',
    percent: brightnessPercent(state, drag, pending),
    name: name || (typeof friendly === 'string' ? friendly : entity),
  };
}

export function commandFor(
  action: 'toggle' | 'more' | 'brightness',
  entity: string,
  state: EntityState | undefined,
  percent?: number,
): LightCommand {
  if (!entity) return { kind: 'noop' };
  if (action === 'more') return { kind: 'more-info' };
  if (!state || state.state === 'unavailable') return { kind: 'noop' };
  if (action === 'toggle') return { kind: 'service', domain: 'light', service: 'toggle', data: { entity_id: entity } };
  const value = Math.max(0, Math.min(100, Math.round(percent ?? 0)));
  if (value <= 0) return { kind: 'service', domain: 'light', service: 'turn_off', data: { entity_id: entity } };
  return { kind: 'service', domain: 'light', service: 'turn_on', data: { entity_id: entity, brightness_pct: value } };
}
