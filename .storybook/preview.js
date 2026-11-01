import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { bootNuvio } from '../storybook/bootstrap.js';
import { applyStorybookScheme } from '../storybook/theme.js';
import '../storybook/preview.css';

export const parameters = {
  layout: 'padded',
  docs: { disable: true },
  backgrounds: {
    options: {
      "nuvio-dark": { name: 'nuvio-dark', value: '#0d1218' },
      "nuvio-light": { name: 'nuvio-light', value: '#e8ecf1' }
    }
  },
};

/** Jedno ładowanie bundla dla wszystkich stories. */
export const loaders = [async () => ({ nuvio: await bootNuvio({ lang: 'pl' }) })];

export const decorators = [
  withThemeByDataAttribute({
    themes: { dark: 'dark', light: 'light' },
    defaultTheme: 'dark',
    attributeName: 'data-hg-scheme',
  }),
  (storyFn, ctx) => {
    const dark = ctx.globals?.theme === 'dark' || document.documentElement.getAttribute('data-hg-scheme') === 'dark';
    applyStorybookScheme(dark);
    const root = document.createElement('div');
    root.className = 'nuvio-sb-story';
    const inner = storyFn(ctx.args, ctx);
    if (typeof inner === 'string') root.innerHTML = inner;
    else if (inner instanceof Node) root.appendChild(inner);
    else if (inner != null) root.textContent = String(inner);
    return root;
  },
];

export const initialGlobals = {
  backgrounds: {
    value: 'nuvio-dark'
  }
};
