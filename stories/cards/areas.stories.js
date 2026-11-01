import { requireNuvio } from '../../storybook/bootstrap.js';
import { mountCard } from '../../storybook/mount.js';
import { areasHass } from '../../storybook/mocks/hass.js';

export default {
  title: 'Karty / Pokoje (areas)',
  parameters: {
    docs: {
      description: {
        component: 'Kafel `hg-areas-card` z mockowanymi obszarami HA i encjami (temperatura, światła, zdjęcia).',
      },
    },
  },
};

function renderAreas(args, nuvio) {
  const HGL = nuvio.HGL;
  HGL.data.wiz = Object.assign({}, HGL.data.wiz || {}, {
    areas: {
      pictures: args.salonPhoto ? { salon: args.salonPhoto } : {},
    },
  });
  return mountCard(
    'hg-areas-card',
    { areas: {}, layout: args.layout, columns: args.columns },
    areasHass(),
    nuvio,
    { width: args.width, minHeight: args.layout === 'list' ? 520 : 340 },
  );
}

export const Siatka = {
  args: {
    layout: 'grid',
    columns: 3,
    width: 1080,
    salonPhoto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  },
  argTypes: {
    layout: { control: 'select', options: ['grid', 'list'] },
    columns: { control: { type: 'number', min: 1, max: 3 } },
    width: { control: { type: 'number', min: 320, max: 1200 } },
    salonPhoto: { control: 'text', description: 'URL zdjęcia salonu (wiz.areas.pictures)' },
  },
  render: (args, ctx) => renderAreas(args, requireNuvio(ctx)),
};

export const Lista = {
  args: { layout: 'list', columns: 1, width: 520, salonPhoto: '' },
  render: (args, ctx) => renderAreas(args, requireNuvio(ctx)),
};
