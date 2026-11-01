**English** · [Polski](pl/development.md) · [Français](fr/development.md)

# Development

How to build, structure and release Nuvio. For the contribution workflow see [CONTRIBUTING.md](../CONTRIBUTING.md). Back to the [README](../README.md).

See [DESIGN.md](../DESIGN.md) for the UI rules every new feature must meet.


```bash
npm install              # once: esbuild, used to minify the bundle
(cd v3 && pnpm install)  # once: Lit runtime prepended to the core
python3 tools/build.py   # -> dist/nuvio.js
python3 tools/guard.py   # fails if any house-specific id slipped into dist, runs the i18n check
```

## Mobile check

Before every release run the live mobile check against a Home Assistant with Nuvio. It opens every Settings page on iPhone (WebKit, iPhone 13), Android (Chromium, 360 x 780) and a 768 px tablet, opens collapsible blocks, scrolls each page to the bottom and fails on any element outside the screen, sideways scrolling or a covered action bar. It writes nothing to Home Assistant.

```bash
pip install playwright && playwright install webkit chromium
NUVIO_URL=https://your-ha NUVIO_TOKEN_FILE=~/.ha_token python3 tools/mobile_check.py --dist dist/ --shots /tmp/mobile
```

## Source layout

The source is plain JavaScript files that `tools/build.py` joins, in a fixed order, into one bundle (one shared scope, no imports):

| Folder | Content |
|---|---|
| `src/parts/hg-core`, `hg-styles`, `hg-select`, `hg-oss` | base class `HGBase`, theme tokens, glass select, shared helpers |
| `src/parts/shared/` | helpers used by more than one card (weather, calendar, rooms model, generic controls…) |
| `src/parts/cards/` | one card per file, for example `cards/light-card.part.js` |
| `src/parts/hg-page`, `hg-edit`, `hg-wall`, `hg-users`… | dashboard page, edit mode, wall tablet mode, shared dashboard users, backup, Assist |

A new card goes into `src/parts/cards/<name>-card.part.js` and is added to the `CARDS` list in `tools/build.py`. Load order matters: code that runs when the bundle loads (for example `class X extends Y`) may only use what an earlier file defines.

## Translations

Every visible text lives in a JSON catalog, never in the code. `src/locales/en.json` is the reference and source language; `pl.json`, `fr.json` and any added language follow the same keys. Adding a language is described in [Configuration](configuration.md#adding-a-language).

**Keys.** Nested JSON, every segment in `snake_case`. A key describes the role of the text, not its words (`cards.smartlock.default_title`, not `cards.smartlock.lock`). One namespace per area:

| Namespace | Content |
|---|---|
| `common.*` | texts shared by at least three modules (`common.save`, `common.cancel`) |
| `nav.*` | navigation and view titles |
| `wizard.*` | first-run wizard |
| `edit.*`, `wall.*`, `backup.*`, `users.*`, `assist.*` … | one namespace per `hg-*.part.js` module |
| `ui.*`, `shared.*` | the `ui/` and `shared/` blocks |
| `cards.<card>.*` | one card (`cards.smartlock.hours_ago_one`) |
| `states.*` | raw Home Assistant states |
| `weather.*` | weather conditions |
| `accents.*`, `backgrounds.*` | names of the accent colours and of the bundled backgrounds |

**Messages.** Variables are named: `"Welcome, {name}!"`. A translation keeps exactly the variables of the English text. Plurals use suffixes on the key (`entities_one`, `entities_few`, `entities_many`, `entities_other`, also `_zero` and `_two`): the form is chosen by `Intl.PluralRules(locale)` from the `count` parameter, so each language gives the forms its rules need (English `_one` / `_other`, Polish `_one` / `_few` / `_many` / `_other`, French `_one` / `_many` / `_other`). In English, a text that uses `{count}` must be split into plural forms.

**API** (`src/parts/hg-i18n.part.js`, all synchronous):

| Call | Use |
|---|---|
| `hgT('ns.key', params?)` | the text in the current language |
| `hgTLazy('ns.key', params?)` | an object resolved when it is turned into a string, for texts defined before the language is known |
| `hgTO(obj, { prop: 'ns.key' })` | adds getters to `obj` that call `hgT` |
| `hgTD('states.' + state, fallback)` | dynamic key, built at run time; `fallback` when the key does not exist |

Keys passed to `hgT`, `hgTLazy` and `hgTO` are string literals. Only `hgTD` builds keys, and only under the prefixes declared in `DYN_PREFIXES` in `tools/i18n_compile.py` (`states.`, `weather.` and a few per-card option tables); a new dynamic table needs its prefix added there. Missing text falls back to English. A static key absent from `en.json` stops `tools/i18n_check.py` and the build, so no key reaches the bundle as text; should a compiled index have no English text, `#<index>` shows (visible on purpose). `hgTD` falls back to its `fallback`.

**Build.** Keys exist only in the sources. `tools/build.py` gives every static key an integer index (sorted keys of `en.json`), rewrites `hgT('ns.key')` to `hgT(842)` in the bundle (plural forms share one index), compiles each catalog to an indexed array (`dist/nuvio-locale-<code>.<hash8>.json`, hash of its content), and embeds English and the language manifest (`code`, `name`, `locale`, `file`, optional `flag` and `intro`) in the core. Other languages are loaded on demand. A compiled catalog only fits the core of the same build. Texts in the sources may say *Home Glass*; the build turns it into *Nuvio* in the bundle and the catalogs.

**Checks.** `python3 tools/i18n_check.py` fails (exit code 1) when a key is not a literal, a used key is missing from `en.json`, a key of `en.json` is unused, a visible text is written in the code, a catalog has invalid JSON, a duplicate key, incomplete `_meta`, different variables or missing plural forms, or a required language (`en`, `pl`, `fr`) is incomplete. Catalog text is inserted into the page as HTML, so it also refuses markup in a text (`<b>`, `</…`, `<!--`; a lowercase placeholder such as `<id>` that is not an HTML element name is allowed), an `on…=` event handler, a straight double quote `"` outside English, and a catalog file name that is not a lowercase language code (`fr`, `pt-br`). Other languages may be partial and only get a coverage warning. Options: `--lang <code>` lists the missing and obsolete keys of one language, `--list` prints every error, `--json` prints the result as JSON. `tools/guard.py` runs it as part of its checks.

There is no CI/CD, so releases are made locally by the maintainer. Feature pull requests do not bump the version: they add their changelog entry under `### Unreleased`. A release is two steps:

1. `./tools/cut-release.sh X.Y.Z` creates branch `release/X.Y.Z`, renames `### Unreleased` to `### X.Y.Z` in all four changelogs, bumps the version (`package.json`, README badges), rebuilds `dist/`, runs `node --check`, the hardcode guard and `npm test`, commits `chore: release X.Y.Z` and opens a pull request to `main`.
2. After the pull request is merged, `./tools/tag-release.sh X.Y.Z` tags `main` as `vX.Y.Z`, pushes the tag, creates the GitHub release without attached files (HACS then installs the flat `dist/`) and checks the tag.

```bash
./tools/cut-release.sh 2.31.0   # clean tree, gh CLI logged in, run from main
./tools/tag-release.sh 2.31.0   # after the release pull request is merged
```

**Pre-release.** To test a feature branch through HACS before a real release, run the scripts with `--pre X.Y.Z-beta.N`. `cut-release.sh --pre` works on the current branch (not `main`, clean tree): it bumps only `package.json` (README badges and `### Unreleased` stay untouched), rebuilds `dist/`, runs the same checks, commits `chore: pre-release X.Y.Z-beta.N` and pushes the branch, without a release branch or pull request. `tag-release.sh --pre` tags `HEAD` as `vX.Y.Z-beta.N`, pushes the tag and creates a GitHub pre-release without attached files. HACS shows it only when "Show beta versions" is enabled for the repository.

```bash
./tools/cut-release.sh --pre 2.32.0-beta.1   # clean tree, on a branch other than main
./tools/tag-release.sh --pre 2.32.0-beta.1   # after the push, from the same branch
```

Every change adds its entry to `CHANGELOG.md`, `CHANGELOG.pl.md`, `CHANGELOG.fr.md` and `CHANGELOG.nl.md` under `### Unreleased` (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

Only tagging by hand: `git fetch origin && git tag -a v2.12.0 origin/main -m "Nuvio 2.12.0" && git push origin v2.12.0`.
