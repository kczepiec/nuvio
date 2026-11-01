import { describe, expect, it } from 'vitest';
import { brightnessPercent, commandFor, lightView, nextPending } from './light';

const on = { state: 'on', attributes: { brightness: 128, friendly_name: 'Kitchen' }, lastUpdated: 'a' };
const off = { state: 'off', attributes: { friendly_name: 'Kitchen' }, lastUpdated: 'b' };

describe('brightnessPercent', () => {
  it('maps 0-255 onto 0-100', () => {
    expect(brightnessPercent(on, null, null)).toBe(50);
    expect(brightnessPercent({ state: 'on', attributes: { brightness: 255 } }, null, null)).toBe(100);
  });

  it('treats a missing brightness as full when the light is on', () => {
    expect(brightnessPercent({ state: 'on', attributes: {} }, null, null)).toBe(100);
  });

  it('is zero when the light is off or missing', () => {
    expect(brightnessPercent(off, null, null)).toBe(0);
    expect(brightnessPercent(undefined, null, null)).toBe(0);
  });

  it('prefers the drag, then the pending value', () => {
    expect(brightnessPercent(on, 12, 40)).toBe(12);
    expect(brightnessPercent(on, null, 40)).toBe(40);
  });
});

describe('commandFor', () => {
  it('toggles an available light', () => {
    expect(commandFor('toggle', 'light.kitchen', on)).toEqual({
      kind: 'service', domain: 'light', service: 'toggle', data: { entity_id: 'light.kitchen' },
    });
  });

  it('does nothing when the light is unavailable', () => {
    expect(commandFor('toggle', 'light.kitchen', { state: 'unavailable', attributes: {} })).toEqual({ kind: 'noop' });
    expect(commandFor('brightness', 'light.kitchen', undefined, 20)).toEqual({ kind: 'noop' });
  });

  it('turns the light off at zero and on with a percent', () => {
    expect(commandFor('brightness', 'light.kitchen', off, 0)).toMatchObject({ service: 'turn_off' });
    expect(commandFor('brightness', 'light.kitchen', off, 40)).toMatchObject({
      service: 'turn_on',
      data: { entity_id: 'light.kitchen', brightness_pct: 40 },
    });
  });

  it('opens more-info even when the entity is missing', () => {
    expect(commandFor('more', 'light.kitchen', undefined)).toEqual({ kind: 'more-info' });
  });
});

describe('lightView', () => {
  it('uses the friendly name and marks unavailable', () => {
    expect(lightView(on, 'light.kitchen', null, null, null)).toMatchObject({ on: true, unavailable: false, name: 'Kitchen', percent: 50 });
    expect(lightView(undefined, 'light.kitchen', null, null, null).unavailable).toBe(true);
    expect(lightView(on, 'light.kitchen', 'Lamp', null, null).name).toBe('Lamp');
  });
});

describe('nextPending', () => {
  it('clears the optimistic value when Home Assistant reports a new update', () => {
    expect(nextPending(40, 'a', 'b')).toBeNull();
    expect(nextPending(40, 'a', 'a')).toBe(40);
    expect(nextPending(null, 'a', 'b')).toBeNull();
  });
});
