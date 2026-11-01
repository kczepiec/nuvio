# Nuvio v3

Platforma bety 3.0.0 (Lit, TypeScript strict, Vite). `python3 tools/build.py` dokleja `v3/dist/nuvio-v3.js` na początek `nuvio-core`, więc `nuvio-light-card` jest kartą Lit, a reszta kart zostaje w legacy. Układ się nie zmienia.

```bash
pnpm install
pnpm test
pnpm check
pnpm storybook
```

Storybook wstaje na porcie 6007, żeby nie zająć katalogu 2.x na 6006.
