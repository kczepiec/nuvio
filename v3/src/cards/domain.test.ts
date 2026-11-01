import { describe, expect, it } from 'vitest';
import { buckets, conditionsMet, coverIcon, press, sliderModel, stepRound } from './domain';
import { mockPort } from '../ha/mock';

describe('card domain', () => {
  it('presses a script and toggles everything else', () => {
    const port = mockPort({ 'script.bed': { state: 'off', attributes: {} }, 'switch.lamp': { state: 'off', attributes: {} } });
    press(port, 'script.bed');
    press(port, 'switch.lamp');
    expect(port.calls.map((call) => call.service)).toEqual(['turn_on', 'toggle']);
  });

  it('models a light slider in percent', () => {
    const port = mockPort({ 'light.lamp': { state: 'on', attributes: { brightness: 127, supported_color_modes: ['brightness'] } } });
    const model = sliderModel(port, 'light.lamp');
    expect(model.value).toBe(50);
    expect(stepRound(33, model)).toBe(33);
    model.set?.(0);
    expect(port.calls[0]).toMatchObject({ service: 'turn_off' });
  });

  it('checks state and numeric conditions', () => {
    const state = (id: string) => ({ lamp: 'on', temp: '21' })[id];
    expect(conditionsMet([{ entity: 'lamp', state: 'on' }], state, '')).toBe(true);
    expect(conditionsMet([{ condition: 'numeric_state', entity: 'temp', above: 20 }], state, '')).toBe(true);
    expect(conditionsMet([{ condition: 'or', conditions: [{ entity: 'lamp', state: 'off' }, { entity: 'missing', state: 'on' }] }], state, '')).toBe(false);
  });

  it('picks a cover icon from the device class', () => {
    expect(coverIcon('gate', 'closed')).toBe('mdi:gate');
    expect(coverIcon('gate', 'opening')).toBe('mdi:gate-open');
    expect(coverIcon('garage', 'closed')).toBe('mdi:garage');
    expect(coverIcon('garage', 'open')).toBe('mdi:garage-open');
    expect(coverIcon('door', 'closed')).toBe('mdi:door-closed');
    expect(coverIcon(undefined, 'closed')).toBe('mdi:window-shutter');
    expect(coverIcon('weird', 'open')).toBe('mdi:window-shutter-open');
  });

  it('buckets history into a fixed length', () => {
    const now = Date.now();
    const points = buckets([{ t: now - 3 * 3600e3, v: 1 }, { t: now - 3600e3, v: 3 }], 4, 4);
    expect(points).toHaveLength(4);
    expect(points.filter((value) => Number.isFinite(value)).length).toBeGreaterThan(0);
  });
});
