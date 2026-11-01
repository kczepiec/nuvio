import { describe, expect, it, vi } from 'vitest';
import { fromHass } from './live';
import type { HassLike } from './types';

function hass(): HassLike {
  return {
    states: {
      'light.kitchen': { state: 'on', attributes: { brightness: 255 }, last_updated: '1' },
      'switch.hall': { state: 'off', attributes: {} },
    },
    callService: vi.fn(async () => undefined),
  };
}

describe('fromHass', () => {
  it('reads one entity and lists a domain', () => {
    const port = fromHass(hass(), new EventTarget());
    expect(port.state('light.kitchen')).toMatchObject({ state: 'on', lastUpdated: '1' });
    expect(port.state('light.missing')).toBeUndefined();
    expect(port.entityIds('light')).toEqual(['light.kitchen']);
    expect(port.formatPercent(50.4)).toBe('50%');
  });

  it('forwards services and more-info', async () => {
    const raw = hass();
    const host = new EventTarget();
    const seen: unknown[] = [];
    host.addEventListener('hass-more-info', (ev) => seen.push((ev as CustomEvent).detail));
    const port = fromHass(raw, host);
    await port.callService('light', 'toggle', { entity_id: 'light.kitchen' });
    expect(raw.callService).toHaveBeenCalledWith('light', 'toggle', { entity_id: 'light.kitchen' });
    port.moreInfo('light.kitchen');
    expect(seen).toEqual([{ entityId: 'light.kitchen' }]);
  });
});
