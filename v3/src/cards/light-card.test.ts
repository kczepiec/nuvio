import { beforeAll, describe, expect, it } from 'vitest';
import { installHaStubs } from '../ha/stubs';
import { mockPort } from '../ha/mock';
import { NuvioLightCard } from './light-card';

beforeAll(() => installHaStubs());

async function mount(state: string, attributes: Record<string, unknown> = {}) {
  const port = mockPort({
    'light.kitchen': { state, attributes, lastUpdated: '1' },
  });
  const el = document.createElement('nuvio-light-card') as unknown as NuvioLightCard;
  el.port = port;
  el.setConfig({ entity: 'light.kitchen', title: 'Lighting' });
  document.body.append(el);
  await el.updateComplete;
  return { el, port };
}

describe('nuvio-light-card', () => {
  it('toggles through the port', async () => {
    const { el, port } = await mount('on', { brightness: 255, friendly_name: 'Kitchen' });
    el.shadowRoot?.querySelector<HTMLButtonElement>('[data-act="toggle"]')?.click();
    await el.updateComplete;
    expect(port.calls).toEqual([{ domain: 'light', service: 'toggle', data: { entity_id: 'light.kitchen' } }]);
    el.remove();
  });

  it('does not toggle an unavailable light and still opens more-info', async () => {
    const { el, port } = await mount('unavailable');
    el.shadowRoot?.querySelector<HTMLButtonElement>('[data-act="toggle"]')?.click();
    el.shadowRoot?.querySelector<HTMLButtonElement>('[data-act="more"]')?.click();
    await el.updateComplete;
    expect(port.calls).toEqual([]);
    expect(port.infos).toEqual(['light.kitchen']);
    expect(el.shadowRoot?.querySelector('.pc')?.textContent).toBe('—');
    el.remove();
  });

  it('registers once for the Lovelace picker', () => {
    expect(customElements.get('nuvio-light-card')).toBe(NuvioLightCard);
    expect(window.customCards?.some((card) => card.type === 'nuvio-light-card')).toBe(true);
  });
});
