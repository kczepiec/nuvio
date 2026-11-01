## Learned User Preferences

- Communicates in Polish; expect Polish UI copy and responses in Polish when discussing the product.
- Treats mockup screenshots versus live captures from https://home.czepiec.pl as the acceptance bar for Studio visual work.
- Wants the Studio layout and visual design as the only layout on every view and breakpoint (including rooms such as energy); old narrow/wide panel layouts and the room-editor panel option are removed.
- Studio chrome applies on every view: hidden view header, Wi‑Fi/time status, theme switch on the rail, and the 2D widget grid.
- Expects card editing to keep working: open and configure tiles already placed on a panel, including stacks.
- Prefers glass widgets that are more transparent, with stronger blur (around 38px), minimal or no inset borders, larger gaps between cards, and mockup-style weather presentation.
- Expects Studio climate mode tiles without heavy borders; overall polish should match the reference mockup, not generic card chrome.
- Requests beta pre-releases by explicit version (e.g. beta 2–6) using the project release scripts, not one-off manual deploys.
- After HACS updates, verify with a hard refresh before concluding a fix did not land.
- Run `npm test` before cutting prereleases when changing Studio or layout code.
- Gives direct, visual UI feedback (annotated screenshots) and expects iterative fixes until Studio matches the design.

## Learned Workspace Facts

- Nuvio is a Home Assistant custom frontend distributed via HACS; GitHub repo is `kczepiec/nuvio`.
- Active Studio Lovelace dashboard work happens on branch `feat/studio-view`.
- Prereleases use `./tools/cut-release.sh --pre <version>` and `./tools/tag-release.sh --pre <version>`; beta builds load frontend assets from the CDN; enable beta versions in HACS to install them.
- User validates changes on the live Home Assistant instance at https://home.czepiec.pl.
- Studio chrome defaults live in `src/parts/hg-page.part.js`; every view is an `hg-studio-card` grid generated in `src/parts/hg-oss.part.js`, with per-view layouts in `HGL.data.studios` (`src/parts/studio/seed.part.js`). Studio cards live under `src/parts/cards/studio-*`; tests in `tests/js/studio-*.test.mjs`.
