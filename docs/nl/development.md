[English](../development.md) · [Polski](../pl/development.md) · [Français](../fr/development.md) · **Nederlands**

# Ontwikkeling

Hoe je Nuvio bouwt, structureert en uitbrengt. Voor de werkwijze bij bijdragen zie [CONTRIBUTING.md](../../CONTRIBUTING.md). Terug naar de [README](../../README.nl.md).

Zie [DESIGN.md](../../DESIGN.md) voor de UI-regels waaraan elke nieuwe functie moet voldoen.


```bash
npm install              # once: esbuild, used to minify the bundle
python3 tools/build.py   # -> dist/nuvio.js
python3 tools/guard.py   # fails if any house-specific id slipped into dist, runs the i18n check
```

## Mobiele controle

Voer voor elke release de live mobiele controle uit tegen een Home Assistant met Nuvio. Ze opent elke instellingenpagina op iPhone (WebKit, iPhone 13), Android (Chromium, 360 x 780) en een tablet van 768 px, opent inklapbare blokken, scrolt elke pagina naar beneden en faalt bij elk element buiten het scherm, zijwaarts scrollen of een afgedekte actiebalk. Ze schrijft niets naar Home Assistant.

```bash
pip install playwright && playwright install webkit chromium
NUVIO_URL=https://your-ha NUVIO_TOKEN_FILE=~/.ha_token python3 tools/mobile_check.py --dist dist/ --shots /tmp/mobile
```

## Bronindeling

De bron bestaat uit gewone JavaScript-bestanden die `tools/build.py` in een vaste volgorde samenvoegt tot één bundel (één gedeelde scope, geen imports):

| Map | Inhoud |
|---|---|
| `src/parts/hg-core`, `hg-styles`, `hg-select`, `hg-oss` | basisklasse `HGBase`, themawaarden, glazen keuzelijst, gedeelde hulpfuncties |
| `src/parts/shared/` | hulpfuncties die door meer dan één kaart worden gebruikt (weer, agenda, kamermodel, generieke bediening…) |
| `src/parts/cards/` | één kaart per bestand, bijvoorbeeld `cards/light-card.part.js` |
| `src/parts/hg-page`, `hg-edit`, `hg-wall`, `hg-users`… | dashboardpagina, bewerkmodus, wandtabletmodus, gedeelde dashboardgebruikers, back-up, Assist |

Een nieuwe kaart komt in `src/parts/cards/<name>-card.part.js` en wordt toegevoegd aan de lijst `CARDS` in `tools/build.py`. De laadvolgorde telt: code die draait wanneer de bundel laadt (bijvoorbeeld `class X extends Y`) mag alleen gebruiken wat een eerder bestand definieert.

## Vertalingen

Elke zichtbare tekst staat in een JSON-catalogus, nooit in de code. `src/locales/en.json` is de referentie en brontaal; `pl.json`, `fr.json` en elke toegevoegde taal volgen dezelfde sleutels. Een taal toevoegen wordt beschreven in [Configuratie](configuration.md#een-taal-toevoegen).

**Sleutels.** Geneste JSON, elk segment in `snake_case`. Een sleutel beschrijft de rol van de tekst, niet de woorden ervan (`cards.smartlock.default_title`, niet `cards.smartlock.lock`). Eén naamruimte per gebied:

| Naamruimte | Inhoud |
|---|---|
| `common.*` | teksten die door minstens drie modules worden gedeeld (`common.save`, `common.cancel`) |
| `nav.*` | navigatie en titels van weergaven |
| `wizard.*` | wizard bij de eerste start |
| `edit.*`, `wall.*`, `backup.*`, `users.*`, `assist.*` … | één naamruimte per `hg-*.part.js`-module |
| `ui.*`, `shared.*` | de blokken `ui/` en `shared/` |
| `cards.<card>.*` | één kaart (`cards.smartlock.hours_ago_one`) |
| `states.*` | ruwe Home Assistant-statussen |
| `weather.*` | weersomstandigheden |
| `accents.*`, `backgrounds.*` | namen van de accentkleuren en van de meegeleverde achtergronden |

**Berichten.** Variabelen hebben een naam: `"Welcome, {name}!"`. Een vertaling behoudt precies de variabelen van de Engelse tekst. Meervouden gebruiken achtervoegsels op de sleutel (`entities_one`, `entities_few`, `entities_many`, `entities_other`, ook `_zero` en `_two`): de vorm wordt door `Intl.PluralRules(locale)` gekozen uit de parameter `count`, zodat elke taal de vormen geeft die haar regels nodig hebben (Engels `_one` / `_other`, Pools `_one` / `_few` / `_many` / `_other`, Frans `_one` / `_many` / `_other`). In het Engels moet een tekst die `{count}` gebruikt, in meervoudsvormen worden gesplitst.

**API** (`src/parts/hg-i18n.part.js`, alles synchroon):

| Aanroep | Gebruik |
|---|---|
| `hgT('ns.key', params?)` | de tekst in de huidige taal |
| `hgTLazy('ns.key', params?)` | een object dat wordt omgezet wanneer het een string wordt, voor teksten die zijn gedefinieerd voordat de taal bekend is |
| `hgTO(obj, { prop: 'ns.key' })` | voegt getters toe aan `obj` die `hgT` aanroepen |
| `hgTD('states.' + state, fallback)` | dynamische sleutel, tijdens de uitvoering opgebouwd; `fallback` wanneer de sleutel niet bestaat |

Sleutels die aan `hgT`, `hgTLazy` en `hgTO` worden doorgegeven, zijn letterlijke strings. Alleen `hgTD` bouwt sleutels op, en alleen onder de voorvoegsels die in `DYN_PREFIXES` in `tools/i18n_compile.py` zijn gedeclareerd (`states.`, `weather.` en enkele optietabellen per kaart); een nieuwe dynamische tabel vraagt dat haar voorvoegsel daar wordt toegevoegd. Ontbrekende tekst valt terug op het Engels. Een statische sleutel die in `en.json` ontbreekt, stopt `tools/i18n_check.py` en de build, zodat geen enkele sleutel als tekst in de bundel belandt; heeft een gecompileerde index geen Engelse tekst, dan verschijnt `#<index>` (bewust zichtbaar). `hgTD` valt terug op zijn `fallback`.

**Build.** Sleutels bestaan alleen in de bronnen. `tools/build.py` geeft elke statische sleutel een geheel getal als index (gesorteerde sleutels van `en.json`), herschrijft `hgT('ns.key')` naar `hgT(842)` in de bundel (meervoudsvormen delen één index), compileert elke catalogus naar een geïndexeerde array (`dist/nuvio-locale-<code>.<hash8>.json`, hash van de inhoud) en bedt het Engels en het taalmanifest (`code`, `name`, `locale`, `file`, optioneel `flag` en `intro`) in de kern in. Andere talen worden op aanvraag geladen. Een gecompileerde catalogus past alleen bij de kern van dezelfde build. Teksten in de bronnen mogen *Home Glass* zeggen; de build maakt er *Nuvio* van in de bundel en de catalogi.

**Controles.** `python3 tools/i18n_check.py` faalt (exitcode 1) wanneer een sleutel niet letterlijk is, een gebruikte sleutel in `en.json` ontbreekt, een sleutel van `en.json` ongebruikt is, een zichtbare tekst in de code is geschreven, een catalogus ongeldige JSON, een dubbele sleutel, een onvolledige `_meta`, afwijkende variabelen of ontbrekende meervoudsvormen heeft, of een verplichte taal (`en`, `pl`, `fr`) onvolledig is. Catalogustekst wordt als HTML in de pagina ingevoegd, dus ze weigert ook opmaak in een tekst (`<b>`, `</…`, `<!--`; een plaatsaanduiding in kleine letters zoals `<id>` die geen HTML-elementnaam is, is toegestaan), een gebeurtenishandler `on…=`, een rechte dubbele aanhalingsteken `"` buiten het Engels en een bestandsnaam van een catalogus die geen taalcode in kleine letters is (`fr`, `pt-br`). Andere talen mogen gedeeltelijk zijn en krijgen alleen een waarschuwing over de dekking. Opties: `--lang <code>` toont de ontbrekende en verouderde sleutels van één taal, `--list` toont elke fout, `--json` toont het resultaat als JSON. `tools/guard.py` voert haar uit als onderdeel van zijn controles.

Er is geen CI/CD, dus releases worden lokaal door de beheerder gemaakt. Pull requests voor functies verhogen de versie niet: ze voegen hun changelogvermelding toe onder `### Unreleased`. Een release verloopt in twee stappen:

1. `./tools/cut-release.sh X.Y.Z` maakt de branch `release/X.Y.Z`, hernoemt `### Unreleased` naar `### X.Y.Z` in alle vier de changelogs, verhoogt de versie (`package.json`, README-badges), bouwt `dist/` opnieuw, voert `node --check`, de hardcode-guard en `npm test` uit, commit `chore: release X.Y.Z` en opent een pull request naar `main`.
2. Nadat de pull request is samengevoegd, tagt `./tools/tag-release.sh X.Y.Z` `main` als `vX.Y.Z`, pusht de tag, maakt de GitHub-release zonder bijgevoegde bestanden (HACS installeert dan de platte `dist/`) en controleert de tag.

```bash
./tools/cut-release.sh 2.31.0   # clean tree, gh CLI logged in, run from main
./tools/tag-release.sh 2.31.0   # after the release pull request is merged
```

Elke wijziging voegt haar vermelding toe aan `CHANGELOG.md`, `CHANGELOG.pl.md`, `CHANGELOG.fr.md` en `CHANGELOG.nl.md` onder `### Unreleased` (zie [CONTRIBUTING.md](../../CONTRIBUTING.md)).

Alleen met de hand taggen: `git fetch origin && git tag -a v2.12.0 origin/main -m "Nuvio 2.12.0" && git push origin v2.12.0`.
