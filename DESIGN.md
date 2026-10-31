# Nuvio design rules

Every new feature, card, dialog and setting must meet all of the rules below before it is released. Treat this file as a checklist for pull requests.

## Language and copy

- Every visible string is a key in the catalogs `src/locales/<code>.json`, read with `hgT('ns.key', params)` (see the Translations section of docs/development.md). English is the source and the fallback; Polish and French are complete, and `python3 tools/i18n_check.py` (run by `tools/guard.py`) fails on a missing key or a hard coded text.
- Short, plain labels. No jargon where a simple word works ("Zapisz", "Gotowe", "Wstecz").
- No em dashes or en dashes in the README files, the changelogs, docs or release notes. Use commas, colons or full stops.
- Every change gets a changelog entry in all four changelogs: CHANGELOG.md, CHANGELOG.pl.md, CHANGELOG.fr.md and CHANGELOG.nl.md. Features, fixes, settings, docs and internal changes alike; no change is merged without its entry.

## Visual style

- Modern glassmorphism: translucent glass surfaces, soft blur (one blur layer, no nested backdrop filters), subtle inner highlight and soft drop shadow.
- Accent colour: lime `#63D71E` by default, always used through the accent variables (`--hg-accent`, `--hg-accent-tx`, `--hg-on-accent`, `--hg-accent-soft`). Never hard code the accent in a component.
- Text on a lime surface is black (`--hg-on-accent`), never white.
- Light and dark schemes both work; colours come from the theme tokens.
- Rounded shapes: cards and sheets use the shared radius tokens, pills are fully rounded.
- Icons are MDI (`ha-icon`) at consistent sizes (18 to 24 px in controls).

## Design tokens

All shape, glass, motion and type values live as CSS variables in `src/theme_head.js` (light set on `:root`, dark differences under `:root[data-hg-scheme=dark]`). New code uses these tokens instead of literal values:

- Shape: `--hg-radius` (24 px), `--hg-radius-in` (16 px), `--hg-radius-pill`, `--hg-btn` (40 px) and `--hg-btn-touch` (44 px).
- Glass: `--hg-glass-sheen` (light reflection from the top left corner, layered over the glass fill), `--hg-edge` (thin bright rim, stronger at the top), `--hg-shadow-lg` and `--hg-shadow-float`.
- Motion: `--hg-t-fast` (120 ms), `--hg-t-base` (200 ms), `--hg-t-slow` (320 ms), `--hg-t-stagger` (30 ms), `--hg-ease-out`, `--hg-ease-in` and `--hg-spring`.
- Type: `--hg-fs-1` to `--hg-fs-7` (11 to 64 px) and `--hg-fw-num` (300) for large numbers.

## Building blocks and live updates

- Cards are built from the shared blocks in `src/parts/ui/` (one file per block, see the `UI` list in `tools/build.py`): `hgUI.iconBtn`, `hgUI.pill`, `hgUI.tabs`, `hgUI.switch`, `hgUI.header`, `hgUI.big`, `hgUI.progress`, `hgUI.arc`, `hgUI.spark`, `hgUI.avatars` and `hgUI.num`. Their CSS is added to every card, so a change to a block changes every card. New cards use these blocks instead of their own markup.
- Blocks in `ui/` use only design tokens (they are not run through the colour tokenizer).
- Every card is patched in place on a state change. `afterRender` therefore runs on nodes that may already be wired: attach listeners with `if (this._once(el)) el.addEventListener(...)` and keep everything else idempotent. Slots that code fills with whole cards (`.acslot`, `.camslot`, `.cmslot`, or any element with `data-own`) keep their children; `data-hgk`, `data-ac`, `data-cam` and `data-cm` work as keys like `data-key`.
- New generic cards start from `HG_NV_CSS` (`src/parts/shared/nv-card.part.js`): `.nv-row`, `.nv-name`, `.nv-ic`, `.nv-mid`, `.hide-s` (hidden up to 220 px) and `.show-l` (shown from 420 px). Draggable values use `hgDragVal(card, el, { move, end, key, arc })`, history uses `hgHistory(hass, entity, hours)` and `hgBuckets`, and every card has a `getStubConfig` that picks a matching entity.
- Day bar charts (one column per day, bars from the bottom, a tooltip on tap) use `HG_DAYBARS_CSS` from `src/parts/shared/day-bars.part.js` (columns, bars, values, tooltip, note, entrance animation `hgbar`); a card sets only its chart height, container queries and colours. Cards with another bar layout use just the tooltip and animation part, `HG_TIP_CSS`.
- Outside the Nuvio page a card blurs (`--hg-card-bf`) and tints (`--hg-card-under`) the background itself; the Nuvio page sets both to none because its panel already does it once.
- Cards outside the visible part of the page (plus 300 px) skip redraws and catch up when they come into view (`HG_VIS` in `hg-core`). The first render and config changes always run at once. Tests can turn this off with `window.__nuvioNoPause = true`.
- Inside cards use `var(--r-lg)` (24 px), `var(--r-md)` (16 px) and `var(--r-sm)` (12 px) for corners, never a pixel value.
- A card updates live: on a state change the new HTML is patched onto the existing nodes (`ui/morph`), so focus, scroll position and running transitions survive and bars, arcs and switches glide to the new value. Numbers rendered with `hgUI.num` count smoothly to the new value. Give list items a `data-key` (or `id`, `data-e`) so reordering moves nodes instead of redrawing them.
- Handle clicks through `data-act` (`onAct`), not listeners attached in `afterRender`. Cards that still define `afterRender` get a full redraw on every change until they move to `data-act`.
- `tests/ui-gallery.html` shows every block in every state at S, M and L sizes (`?scheme=light` or `dark`).

## Overlays

- Every window above the dashboard goes through `hgOverlay` (`src/parts/ui/overlay.part.js`): `dialog({ title, text, html, actions })`, `alert(title, text, ok, danger, info)` (returns true or false), `sheet({ title, html, side })`, `popover(anchor, html)`, `menu(anchor, items)`, `toast(text, { action, onAction })` and `tip(anchor, text)`. Do not build a new fixed-position layer in a card. Content with its own header and styles (for example weather details) uses `dialog({ bare: true, width, mount(el, close) })` and appends its element there.
- One shadow root on `document.body` (`#hg-overlay`, z-index 10010, above the first-run wizard); notifications (`ui/toast`) sit at 10020.
- Modal overlays put one blur on the scrim; the panel itself is `--hg-panel-flat` with the glass sheen and rim. No blur on top of blur.
- Motion: dialogs scale from 0.94 with `--hg-ease-out` over `--hg-t-slow`, sheets slide with `--hg-spring`, popovers and menus scale from the anchor over `--hg-t-base`, exits use `--hg-ease-in` and are shorter. With reduced motion everything only fades.
- Focus: modal overlays trap Tab, focus the safe button first (Cancel in an alert), close with Escape (alerts only with their buttons) and give focus back to the element that opened them.
- Tooltips: `hgUI.iconBtn` sets `data-nv-tip` from its label; a `title` attribute inside a Nuvio element is turned into the same tooltip. They show after 400 ms of hover or on keyboard focus, never on touch, and are skipped when they repeat the visible text.
## Controls

- No native controls are visible anywhere. Use the shared Nuvio controls:
  - Selects: the glass select (`hg-select`, applied automatically by `hgSelWatch` on every shadow root).
  - Sliders: the custom slider style (`HG_RANGE_CSS`: slim track, accent fill through `--v`, white thumb that grows on hover and drag).
  - Icons: the searchable icon picker with the full MDI list, recent icons and keyboard navigation.
  - Switches: the glass switch (`role="switch"`, `aria-checked`); in forms the `nuvio-check` element (form-associated, keyboard, `checked`, `change` event) instead of `<input type=checkbox>`.
  - Forms: build fields with `hgForm` (`src/parts/ui/form.part.js`): `field`, `text`, `num`, `area` (with a code style for YAML and JSON), `toggle`, `select`, `color` and `more` (a disclosure with a rotating chevron instead of a native `<details>` marker). Styles are the `nf-*` classes in `HG_FORM_CSS`; number spinners are hidden.
  - Suggestions: an `<input list>` is upgraded by `hgSelWatch` to the glass suggestion list, so the browser datalist never shows.
- Touch targets are at least 44 px high on touch devices.
- Pickers and lists inside a blurred dialog open next to their button.

## Dialogs and sheets

- **Gotowe** saves and closes without asking anything.
- A discard prompt appears only when the user closes with **X** or by tapping outside while there are unsaved changes.
- In nested steps, **X** goes back one step instead of closing everything.
- Changing a field never remounts the sheet: update in place, keep scroll position and focus.
- The blur behind a sheet is present from the very first frame (no flash of a sharp background).
- Touch gestures that start inside a dialog, sheet, slider, picker or horizontally scrolling row never switch the dashboard view. Any other element can opt out with `data-no-swipe`. While a dialog is open, view swipe is off.
- Assist is a dialog opened from the header (or the A key), not a card in views.
- Settings live in the tabbed settings panel (Wygląd, Widoki, Pokoje, Nagłówek i nawigacja, Tła, Wygaszacz, Kopia zapasowa). New settings go into the matching tab, with proper column labels.

## Components and cards

- Every component appears in **+ Dodaj** with a live preview in the gallery. When the home has no matching entity, the gallery shows a mock preview instead of an empty box.
- Full configuration through the form: every option a user may need has a form field (entity pickers, text, numbers, switches, modes).
- Every component also has the **advanced JSON** field; its values override the form.
- Everything a component stores is part of the layout, so it is included in **export and import** (layout backup) without extra code.
- Sizes **S, M and L** are real grid spans with dense packing. Card content adapts with **container queries** (no overflow, no clipping, less detail at S).
- Containers (grid, stacks, tabs) mount their children through `hgMakeCard`, which also turns HA `grid`, `vertical-stack` and `horizontal-stack` into Nuvio containers (`hgFromHA`, unless `keep_ha`). Editor data on a child (`nv_*`) and the grid `span` never reach the child card. Nesting stops at three levels with a short message. In the editor every component can be a child: the container form edits its children with the same component forms.
- Every card has an **empty state**: a short title and one line telling the user what to pick, never a blank or broken card.
- Unavailable entities are shown as such (dimmed, "niedostępne"), never as an error.
- Service calls respect `window.__hgDryRun` so screenshots and tests never change the home.

## Layout and responsiveness

- Verify every feature at **1440 px** (desktop) and **390 px** (phone), plus tablet when the layout changes.
- Phone: sheets become bottom sheets, tabs become a scrollable chip row, tables become labelled cards.
- Full width and narrow panel modes both have to look right; edit buttons stay next to the element they edit.
- Tablets (touch screens from 768 to 1180 px wide, portrait and landscape) use the tablet layout: the page scrolls, never a nested panel, so nothing is clipped and the glass blur stays in place. Room views use a grid with at most two columns there, never CSS multi-column.

## Motion and accessibility

- Animations are short and soft (150 to 400 ms, ease out). Everything respects `prefers-reduced-motion`.
- Visible focus rings (accent coloured) on every interactive element; full keyboard use (Tab, Enter, Space, arrows, Escape).
- ARIA roles and labels on custom controls (listbox, switch, tab, dialog, live regions for changing text).
- Sufficient contrast on any background, including photos.

## Screensaver (wall tablet mode)

- No backgrounds, panels or pills behind any screensaver element (clock, date, weather, calendar, hint). Plain white text and icons with a soft text shadow only.
- Exception, style **Glass** (`hg-wallglass.part.js`): the cards themselves are glass (rounded 24 to 32, soft inner highlight, deep shadow) and the details sheet slides up from the bottom. The clock, date, tabs, hint and the Family label stay plain text with a text shadow, never on a panel.
- Glass layout is drawn on a 1280 x 680 grid (`--u`), portrait on 560 x 900, so every size scales from one design. Colours go through `K()` or `'#' + '...'`, so the theme tokenizer leaves them alone (the overlay is always dark).
- 3D images: only `nuvio-3d-*.webp` in `dist/` (Fluent Emoji 3D, MIT), or the user's own image. No frames cut from reference videos.
- The wake hint is centred at the bottom and pulses gently, with no motion when reduced motion is set.
- PIN lock (BETA): the PIN pad has no panel either. Round keys of light frosted glass on the blurred photo, PIN dots above, a glass **Lock** pill below. Wrong PIN shakes the dots; the pad closes after 20 s idle. Unlock (about 1.2 s): the padlock opens, the dots glow green, the keys drift out from the centre with a blur, a light wave spreads from the padlock and the blurred layer scales up slightly while it fades; reduced motion only fades. Only a hash of the PIN is stored (`pinH`, `pinN` in `HGL.data.wall`).

## Assets and build

- All assets are flat in `dist/` with `nuvio-*` file names (backgrounds, fonts, weather icons). No sub folders.
- The source is unbranded (`hg-*`); `tools/build.py` maps it to `nuvio-*`. `tools/guard.py` must pass (no house specific ids).
- `npm install` once, so the build minifies the bundle with esbuild (the file name hash is taken from the source before minifying).
- Before release: `python3 tools/build.py`, `python3 tools/guard.py` and `node --check` on `.mjs` copies of the loader and the core.
- Semantic versioning: features raise the minor version, fixes the patch version.
