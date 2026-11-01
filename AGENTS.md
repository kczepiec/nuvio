## Learned User Preferences

- Communicates in Polish; expect Polish UI copy and responses in Polish when discussing the product.
- Treats mockup screenshots versus live captures from https://home.czepiec.pl as the acceptance bar for Studio visual work.
- Wants the Studio layout and visual design as the only layout on every view and breakpoint (including rooms such as energy); old narrow/wide panel layouts and the room-editor panel option are removed.
- Studio chrome applies on every view: hidden view header, Wi‑Fi/time status, theme switch on the rail, 2D widget grid, and rail-only navigation on wide/tablet (no duplicate top tab row beside the rail).
- On mobile, expects Studio tiles in a single full-width column stack without overlapping.
- When rebuilding Studio layouts for views (map, cameras, family, energy, robots, security, network), use only Nuvio Studio widgets and Nuvio cards from the picker.
- Expects card editing to keep working: open and configure tiles already placed on a panel, including stacks.
- Prefers glass widgets that are more transparent, with stronger blur (around 38px), minimal or no inset borders, larger gaps between cards, and mockup-style weather presentation.
- Expects Studio climate mode tiles without heavy borders; overall polish should match the reference mockup, not generic card chrome.
- Requests beta pre-releases by explicit version using the project release scripts, not one-off manual deploys.
- After HACS updates, verify with a hard refresh before concluding a fix did not land.
- Run `npm test` before cutting prereleases when changing Studio or layout code.

## Learned Workspace Facts

- Nuvio is a Home Assistant custom frontend distributed via HACS; GitHub repo is `kczepiec/nuvio`.
- Active Studio Lovelace dashboard work happens on branch `feat/studio-view`.
- Prereleases use `./tools/cut-release.sh --pre <version>` and `./tools/tag-release.sh --pre <version>`; beta builds load frontend assets from the CDN; enable beta versions in HACS to install them.
- User validates changes on the live Home Assistant instance at https://home.czepiec.pl.
- Studio chrome defaults live in `src/parts/hg-page.part.js`; every view is an `hg-studio-card` grid from `src/parts/hg-oss.part.js`, with per-view layouts in `HGL.data.studios`.
- Studio seed and migration (`hgStudioEnsure`, `seedV`, dedupe/sanitize `bps`) live in `src/parts/studio/seed.part.js`; layouts with `custom:1` keep user edits on seed bumps (recipe replace only when `custom:0`).
- Initial seed runs in `src/parts/cards/studio-card.part.js` (`_seed`); persist migrations with `HGL._ls` only—do not auto `HGL.save` on every view visit.
- Responsive grid breakpoints and mobile stacking live in `src/parts/shared/grid-engine.part.js`; Studio cards under `src/parts/cards/studio-*`; tests in `tests/js/studio-*.test.mjs`.
