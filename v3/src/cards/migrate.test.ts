import { describe, expect, it } from 'vitest';
import { actionStep } from './action';
import { energyLoad, fillName, greetingPart, needsAttention, switchCall, watts } from './migrate';

describe('migration helpers', () => {
  it('converts power units to watts and sums the load', () => {
    expect(watts({ state: '1.5', attributes: { unit_of_measurement: 'kW' } })).toBe(1500);
    expect(watts({ state: 'nope', attributes: {} })).toBeNull();
    expect(energyLoad([1000, 500], 10000, 30, 70)).toMatchObject({ tot: 1500, level: 'low' });
    expect(energyLoad([], 10000, 30, 70)).toBeNull();
  });

  it('picks the greeting and cleans an empty name', () => {
    expect(greetingPart(3)).toBe('night');
    expect(greetingPart(9)).toBe('morning');
    expect(greetingPart(15)).toBe('afternoon');
    expect(greetingPart(20)).toBe('evening');
    expect(fillName('Hey, {name}!', '')).toBe('Hey!');
    expect(fillName('Bonjour, {name}\u00a0!', '')).toBe('Bonjour\u00a0!');
  });

  it('counts locks, alarms and openings', () => {
    expect(needsAttention('lock.front', { state: 'unlocked', attributes: {} })).toBe(true);
    expect(needsAttention('binary_sensor.hall', { state: 'on', attributes: { device_class: 'door' } })).toBe(true);
    expect(needsAttention('binary_sensor.hall', { state: 'on', attributes: { device_class: 'motion' } })).toBe(false);
  });

  it('toggles a group off when any switch is on', () => {
    expect(switchCall([{ id: 'switch.a', state: 'on' }, { id: 'switch.b', state: 'off' }])).toEqual({
      service: 'turn_off', entity_id: ['switch.a', 'switch.b'],
    });
    expect(switchCall([{ id: 'switch.a', state: 'unavailable' }])).toBeNull();
  });

  it('maps tile actions', () => {
    expect(actionStep({ navigate: '/lovelace/home' })).toEqual({ kind: 'navigate', path: '/lovelace/home' });
    expect(actionStep({ url: '/energy' })).toEqual({ kind: 'navigate', path: '/energy' });
    expect(actionStep({ service: 'script.bed', data: { x: 1 } })).toMatchObject({ kind: 'service', domain: 'script', service: 'bed' });
    expect(actionStep(null)).toEqual({ kind: 'noop' });
  });
});
