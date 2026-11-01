import { defineConfig } from 'vite';

/** Jeden plik bez importów: tools/build.py dokleja go na początek nuvio-core. */
export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: false,
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/ha-entry.ts',
      name: 'NuvioV3',
      formats: ['iife'],
      fileName: 'nuvio-v3',
    },
    rollupOptions: {
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
