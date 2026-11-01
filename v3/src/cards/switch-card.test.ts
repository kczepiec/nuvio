import { beforeAll, describe, expect, it } from 'vitest';
import { installHaStubs } from '../ha/stubs';
import { mockPort } from '../ha/mock';
import type { NuvioLinkCard } from './link-card';
import type { NuvioSwitchCard } from './switch-card';
import './link-card';
import './switch-card';

beforeAll(() => installHaStubs());

describe('ported cards', () => {
  it('turns a switch group off through the port', async () => {
    const port = mockPort({
      'switch.a': { state: 'on', attributes: { friendly_name: 'Lamp' } },
      'switch.b': { state: 'off', attributes: {} },
    });
    const el = document.createElement('nuvio-switch-card') as unknown as NuvioSwitchCard;
    el.port = port;
    el.setConfig({ entities: ['switch.a', 'switch.b'], title: 'Lights' });
    document.body.append(el);
    await el.updateComplete;
    el.shadowRoot?.querySelector<HTMLButtonElement>('[role="switch"]')?.click();
    await el.updateComplete;
    expect(port.calls).toEqual([{ domain: 'homeassistant', service: 'turn_off', data: { entity_id: ['switch.a', 'switch.b'] } }]);
    el.remove();
  });

  it('runs a link navigation without calling a service', async () => {
    const port = mockPort({});
    const el = document.createElement('nuvio-link-card') as unknown as NuvioLinkCard;
    el.port = port;
    el.setConfig({ title: 'Energy', action: { navigate: '/energy' } });
    document.body.append(el);
    await el.updateComplete;
    el.shadowRoot?.querySelector('ha-card')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(port.navigations).toEqual(['/energy']);
    expect(port.calls).toEqual([]);
    el.remove();
  });
});
