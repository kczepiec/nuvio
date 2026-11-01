import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { installHaStubs } from '../ha/stubs';
import { mockPort } from '../ha/mock';
import './hero-card';

beforeAll(() => installHaStubs());
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

function card(config: Record<string, unknown>, states: Record<string, { state: string; attributes: Record<string, unknown> }> = {}) {
  const el = document.createElement('nuvio-hero-card') as HTMLElement & {
    port: ReturnType<typeof mockPort>;
    setConfig(next: Record<string, unknown>): void;
    updateComplete: Promise<unknown>;
    requestUpdate(): void;
  };
  el.port = mockPort(states, new EventTarget(), 'Kris');
  el.setConfig(config);
  document.body.append(el);
  return el;
}

describe('hero card', () => {
  it('keeps the tagline until studio or status is on', async () => {
    const el = card({});
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('p')?.textContent).toContain('Your whole home in one place');
    expect(el.shadowRoot?.querySelector('.stl')).toBeNull();
  });

  it('greets by the hour in studio and drops the tagline', async () => {
    vi.useFakeTimers();
    const words: Array<[number, string]> = [[2, 'Good night'], [8, 'Good morning'], [14, 'Good afternoon'], [20, 'Good evening']];
    for (const [hour, word] of words) {
      vi.setSystemTime(new Date(2026, 10, 1, hour, 0, 0));
      const el = card({ studio: true });
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('h1')?.textContent).toContain(word);
      expect(el.shadowRoot?.querySelector('h1')?.textContent).toContain('Kris');
      expect(el.shadowRoot?.querySelector('p')).toBeNull();
      expect(el.shadowRoot?.querySelector('.stl')?.textContent).toContain('Your home is all set.');
      el.remove();
    }
  });

  it('counts attention, keeps an explicit title, and ignores a missing status entity', async () => {
    const states = {
      'lock.a': { state: 'unlocked', attributes: {} },
      'binary_sensor.d': { state: 'on', attributes: { device_class: 'door' } },
      'binary_sensor.m': { state: 'on', attributes: { device_class: 'motion' } },
    };
    const status = card({ status: true }, states);
    await status.updateComplete;
    expect(status.shadowRoot?.querySelector('i')?.className).toContain('warn');
    expect(status.shadowRoot?.textContent).toContain('2 things need attention');
    expect(status.shadowRoot?.querySelector('p')).toBeTruthy();

    const titled = card({ studio: true, title: 'Yo {name}' }, states);
    await titled.updateComplete;
    expect(titled.shadowRoot?.querySelector('h1')?.textContent).toContain('Yo Kris');

    const quiet = card({ status: true, status_entities: ['lock.zzz'] }, states);
    await quiet.updateComplete;
    expect(quiet.shadowRoot?.textContent).toContain('Your home is all set.');
  });
});
