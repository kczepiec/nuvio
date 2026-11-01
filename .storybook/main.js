/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-themes', '@storybook/addon-docs'],
  framework: '@storybook/html-vite',
  staticDirs: [{ from: '../dist', to: '/dist' }],
  viteFinal: async (cfg) => {
    cfg.server = cfg.server || {};
    cfg.server.fs = cfg.server.fs || {};
    cfg.server.fs.allow = [...(cfg.server.fs.allow || []), '..'];
    return cfg;
  },
};

export default config;
