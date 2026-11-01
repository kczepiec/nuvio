import { requireNuvio } from '../../storybook/bootstrap.js';
import { mountCard } from '../../storybook/mount.js';
import { demoHass } from '../../storybook/mocks/hass.js';

export default { title: 'Karty / Toggle' };

export const SalonOn = {
  args: { entity: 'light.salon', width: 360 },
  argTypes: { entity: { control: 'select', options: ['light.salon', 'switch.kuchnia', 'fan.sypialnia'] } },
  render: (args, ctx) => {
    const nuvio = requireNuvio(ctx);
    return mountCard('hg-toggle-card', { entity: args.entity }, demoHass('pl', true), nuvio, { width: args.width, minHeight: 88 });
  },
};

export const Rozmiary = {
  render: (_, ctx) => {
    const nuvio = requireNuvio(ctx);
    const hass = demoHass('pl', true);
    const row = document.createElement('div');
    row.className = 'nuvio-sb-sizes';
    for (const [lab, w] of [
      ['S', 180],
      ['M', 300],
      ['L', 460],
    ]) {
      const col = document.createElement('div');
      col.innerHTML = `<div class="nuvio-sb-size-lab">${lab}</div>`;
      col.appendChild(mountCard('hg-toggle-card', { entity: 'light.salon' }, hass, nuvio, { width: w, minHeight: 72 }));
      row.appendChild(col);
    }
    return row;
  },
};
