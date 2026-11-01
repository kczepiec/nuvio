import { mockPort } from '../ha/mock';
import './light-card';

function card(state: string, attributes: Record<string, unknown> = {}) {
  const el = document.createElement('nuvio-light-card') as HTMLElement & {
    setConfig(config: Record<string, unknown>): void;
    port: ReturnType<typeof mockPort>;
  };
  el.style.width = '320px';
  el.setConfig({ entity: 'light.kitchen', title: 'Lighting' });
  el.port = mockPort({
    'light.kitchen': { state, attributes: { friendly_name: 'Kitchen', ...attributes } },
  });
  return el;
}

export default {
  title: 'Cards/Light',
  component: 'nuvio-light-card',
};

export const On = { render: () => card('on', { brightness: 128 }) };
export const Off = { render: () => card('off') };
export const Unavailable = { render: () => card('unavailable') };
