import { beforeAll, describe, expect, it } from 'vitest';
import { installHaStubs } from '../ha/stubs';
import { mockPort } from '../ha/mock';
import { V3_TAGS } from './tags';
import '../ha-entry';

beforeAll(() => installHaStubs());

describe('lit catalog', () => {
  it('registers every listed card before a test can use it', () => {
    for (const tag of V3_TAGS) expect(customElements.get(tag), tag).toBeTruthy();
  });

  it('toggles an entity through the port', async () => {
    const port = mockPort({ 'switch.lamp': { state: 'off', attributes: { friendly_name: 'Lamp' } } });
    const el = document.createElement('nuvio-toggle-card') as HTMLElement & { port: typeof port; setConfig(config: Record<string, unknown>): void; updateComplete: Promise<unknown> };
    el.port = port;
    el.setConfig({ entity: 'switch.lamp' });
    document.body.append(el);
    await el.updateComplete;
    el.shadowRoot?.querySelector<HTMLButtonElement>('[role="switch"]')?.click();
    expect(port.calls).toEqual([{ domain: 'homeassistant', service: 'toggle', data: { entity_id: 'switch.lamp' } }]);
    el.remove();
  });

  it('shows a cover as words when position is unknown', async () => {
    const port = mockPort({ 'cover.gate': { state: 'closed', attributes: { device_class: 'garage', supported_features: 11, friendly_name: 'Gate' } } });
    const el = document.createElement('nuvio-cover-card') as HTMLElement & { port: typeof port; setConfig(config: Record<string, unknown>): void; updateComplete: Promise<unknown> };
    el.port = port;
    el.setConfig({ entity: 'cover.gate' });
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('[role="slider"]')).toBeNull();
    expect(el.shadowRoot?.textContent).toContain('closed');
    expect(el.shadowRoot?.querySelector('ha-icon')?.getAttribute('icon')).toBe('mdi:garage');
    el.remove();
  });

  it('shows a cover slider when position is known', async () => {
    const port = mockPort({ 'cover.blind': { state: 'open', attributes: { current_position: 40, supported_features: 15, friendly_name: 'Blind' } } });
    const el = document.createElement('nuvio-cover-card') as HTMLElement & { port: typeof port; setConfig(config: Record<string, unknown>): void; updateComplete: Promise<unknown> };
    el.port = port;
    el.setConfig({ entity: 'cover.blind' });
    document.body.append(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')).toBe('40');
    expect(el.shadowRoot?.querySelector('[role="status"]')).toBeNull();
    el.remove();
  });

  it('mounts a child card inside the stack', async () => {
    const port = mockPort({ 'switch.lamp': { state: 'on', attributes: { friendly_name: 'Lamp' } } });
    const el = document.createElement('nuvio-stack-card') as HTMLElement & { port: typeof port; setConfig(config: Record<string, unknown>): void; updateComplete: Promise<unknown> };
    el.port = port;
    el.setConfig({ cards: [{ type: 'custom:nuvio-toggle-card', entity: 'switch.lamp' }] });
    document.body.append(el);
    await el.updateComplete;
    await el.updateComplete;
    const child = el.shadowRoot?.querySelector('nuvio-toggle-card');
    expect(child).toBeTruthy();
    el.remove();
  });
});
