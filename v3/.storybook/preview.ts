import type { Preview } from '@storybook/web-components-vite';
import '../src/tokens/tokens.css';
import { installHaStubs } from '../src/ha/stubs';

installHaStubs();

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'studio',
      values: [
        { name: 'studio', value: '#d7dee6' },
        { name: 'dark', value: '#141416' },
      ],
    },
  },
  globalTypes: {
    scheme: {
      description: 'data-hg-scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Scheme',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (story, ctx) => {
      document.documentElement.setAttribute('data-hg-scheme', ctx.globals.scheme === 'dark' ? 'dark' : 'light');
      return story();
    },
  ],
};

export default preview;
