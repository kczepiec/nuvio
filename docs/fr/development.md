[English](../development.md) · [Polski](../pl/development.md) · **Français**

# Développement

Comment compiler, organiser et publier Nuvio. Pour la façon de contribuer, voir [CONTRIBUTING.md](../../CONTRIBUTING.md). Retour au [README](../../README.fr.md).

Les règles d’interface que toute nouvelle fonctionnalité doit respecter sont dans [DESIGN.md](../../DESIGN.md).


```bash
npm install              # une fois : esbuild, pour minifier le bundle
python3 tools/build.py   # -> dist/nuvio.js
python3 tools/guard.py   # échoue si un identifiant propre à une maison s’est glissé dans dist ; lance le contrôle i18n
```

## Vérification mobile

Avant chaque version, lancez la vérification mobile en direct sur un Home Assistant avec Nuvio. Elle ouvre chaque page des paramètres sur iPhone (WebKit, iPhone 13), Android (Chromium, 360 x 780) et une tablette de 768 px, déplie les blocs repliés, fait défiler chaque page jusqu’en bas et échoue si un élément sort de l’écran, si la page défile sur le côté ou si la barre d’actions est masquée. Elle n’écrit rien dans Home Assistant.

```bash
pip install playwright && playwright install webkit chromium
NUVIO_URL=https://votre-ha NUVIO_TOKEN_FILE=~/.ha_token python3 tools/mobile_check.py --dist dist/ --shots /tmp/mobile
```

## Organisation des sources

Les sources sont des fichiers JavaScript ordinaires que `tools/build.py` assemble, dans un ordre fixe, en un seul bundle (une seule portée partagée, sans imports) :

| Dossier | Contenu |
|---|---|
| `src/parts/hg-core`, `hg-styles`, `hg-select`, `hg-oss` | classe de base `HGBase`, jetons du thème, liste déroulante en verre, fonctions partagées |
| `src/parts/shared/` | fonctions utilisées par plusieurs cartes (météo, calendrier, modèle des pièces, contrôles génériques…) |
| `src/parts/cards/` | une carte legacy par fichier, par exemple `cards/room-card.part.js`. Les cartes déjà en Lit sont dans `v3/src/cards/` |
| `src/parts/hg-page`, `hg-edit`, `hg-wall`, `hg-users`… | page du tableau de bord, mode édition, mode tablette murale, utilisateurs du tableau de bord partagé, sauvegarde, Assist |

Une nouvelle carte va dans `src/parts/cards/<nom>-card.part.js` et s’ajoute à la liste `CARDS` de `tools/build.py`. L’ordre de chargement compte : le code exécuté au chargement du bundle (par exemple `class X extends Y`) ne peut utiliser que ce qu’un fichier précédent définit.

## Traductions

Chaque texte visible se trouve dans un catalogue JSON, jamais dans le code. `src/locales/en.json` est le catalogue de référence et la langue source ; `pl.json`, `fr.json` et toute langue ajoutée reprennent les mêmes clés. L’ajout d’une langue est décrit dans [Configuration](configuration.md#ajouter-une-langue).

**Clés.** JSON imbriqué, chaque segment en `snake_case`. Une clé décrit le rôle du texte, pas ses mots (`cards.smartlock.default_title`, et non `cards.smartlock.lock`). Un espace de noms par domaine :

| Espace de noms | Contenu |
|---|---|
| `common.*` | textes partagés par au moins trois modules (`common.save`, `common.cancel`) |
| `nav.*` | navigation et titres des vues |
| `wizard.*` | assistant de première configuration |
| `edit.*`, `wall.*`, `backup.*`, `users.*`, `assist.*` … | un espace par module `hg-*.part.js` |
| `ui.*`, `shared.*` | les blocs `ui/` et `shared/` |
| `cards.<carte>.*` | une carte (`cards.smartlock.hours_ago_one`) |
| `states.*` | états bruts de Home Assistant |
| `weather.*` | conditions météo |
| `accents.*`, `backgrounds.*` | noms des couleurs d’accent et des fonds d’écran fournis |

**Messages.** Les variables sont nommées : `"Bienvenue, {name} !"`. Une traduction garde exactement les variables du texte anglais. Les pluriels utilisent des suffixes de clé (`entities_one`, `entities_few`, `entities_many`, `entities_other`, ainsi que `_zero` et `_two`) : la forme est choisie par `Intl.PluralRules(locale)` à partir du paramètre `count`, si bien que chaque langue fournit les formes exigées par ses règles (anglais `_one` / `_other`, polonais `_one` / `_few` / `_many` / `_other`, français `_one` / `_many` / `_other`). En anglais, un texte qui utilise `{count}` doit être découpé en formes de pluriel.

**API** (`src/parts/hg-i18n.part.js`, entièrement synchrone) :

| Appel | Usage |
|---|---|
| `hgT('ns.key', params?)` | le texte dans la langue courante |
| `hgTLazy('ns.key', params?)` | un objet résolu au moment de sa conversion en texte, pour les textes définis avant que la langue soit connue |
| `hgTO(obj, { prop: 'ns.key' })` | ajoute à `obj` des accesseurs qui appellent `hgT` |
| `hgTD('states.' + state, fallback)` | clé dynamique, construite à l’exécution ; `fallback` si la clé n’existe pas |

Les clés passées à `hgT`, `hgTLazy` et `hgTO` sont des chaînes littérales. Seul `hgTD` construit des clés, et uniquement sous les préfixes déclarés dans `DYN_PREFIXES` de `tools/i18n_compile.py` (`states.`, `weather.` et quelques tables d’options de cartes) ; une nouvelle table dynamique impose d’y ajouter son préfixe. Un texte manquant se replie sur l’anglais. Une clé statique absente de `en.json` arrête `tools/i18n_check.py` et la compilation, si bien qu’aucune clé n’arrive dans le bundle comme texte ; si un numéro compilé n’avait pas de texte anglais, `#<numéro>` s’afficherait (volontairement visible). `hgTD` renvoie alors son `fallback`.

**Compilation.** Les clés n’existent que dans les sources. `tools/build.py` attribue à chaque clé statique un numéro (clés de `en.json` triées), réécrit `hgT('ns.key')` en `hgT(842)` dans le bundle (les formes de pluriel partagent un numéro), compile chaque catalogue en tableau indexé (`dist/nuvio-locale-<code>.<hash8>.json`, hash de son contenu) et intègre dans le core l’anglais et le manifeste des langues (`code`, `name`, `locale`, `file`, et facultativement `flag` et `intro`). Les autres langues se chargent à la demande. Un catalogue compilé ne vaut que pour le core de la même compilation. Les textes des sources peuvent dire *Home Glass* ; la compilation le remplace par *Nuvio* dans le bundle et les catalogues.

**Contrôles.** `python3 tools/i18n_check.py` échoue (code de sortie 1) quand une clé n’est pas littérale, qu’une clé utilisée manque dans `en.json`, qu’une clé de `en.json` est inutilisée, qu’un texte visible est écrit dans le code, qu’un catalogue contient du JSON invalide, une clé en double, un `_meta` incomplet, des variables différentes ou des formes de pluriel manquantes, ou qu’une langue obligatoire (`en`, `pl`, `fr`) est incomplète. Le texte des catalogues est inséré dans la page en HTML : il refuse donc aussi le balisage dans un texte (`<b>`, `</…`, `<!--` ; un repère en minuscules comme `<id>`, qui n’est pas un nom d’élément HTML, reste permis), un gestionnaire d’événement `on…=`, un guillemet droit `"` hors de l’anglais et un nom de fichier de catalogue qui n’est pas un code de langue en minuscules (`fr`, `pt-br`). Les autres langues peuvent être partielles et ne reçoivent qu’un avertissement avec leur couverture. Options : `--lang <code>` liste les clés manquantes et obsolètes d’une langue, `--list` affiche toutes les erreurs, `--json` renvoie le résultat en JSON. `tools/guard.py` le lance avec ses autres contrôles.

Il n’y a pas de CI/CD : les versions sont publiées localement par le mainteneur. Les pull requests de fonctionnalités n’augmentent pas la version : elles ajoutent leur entrée sous `### Unreleased`. Une publication se fait en deux étapes :

1. `./tools/cut-release.sh X.Y.Z` crée la branche `release/X.Y.Z`, remplace `### Unreleased` par `### X.Y.Z` dans les quatre journaux des modifications, augmente la version (`package.json`, badges des README), recompile `dist/`, lance `node --check`, la protection contre les valeurs codées en dur et `npm test`, crée le commit `chore: release X.Y.Z` et ouvre une pull request vers `main`.
2. Une fois la pull request fusionnée, `./tools/tag-release.sh X.Y.Z` pose l’étiquette `vX.Y.Z` sur `main`, pousse l’étiquette, crée la publication GitHub sans fichiers joints (HACS installe alors le `dist/` à plat) et vérifie l’étiquette.

```bash
./tools/cut-release.sh 2.31.0   # arbre propre, gh CLI connecté, depuis main
./tools/tag-release.sh 2.31.0   # après la fusion de la pull request de publication
```

**Préversion.** Pour tester une branche de fonctionnalité via HACS avant une vraie publication, lancez les scripts avec `--pre X.Y.Z-beta.N`. `cut-release.sh --pre` travaille sur la branche courante (pas `main`, arbre propre) : il augmente uniquement `package.json` (les badges des README et `### Unreleased` restent inchangés), recompile `dist/`, lance les mêmes contrôles, crée le commit `chore: pre-release X.Y.Z-beta.N` et pousse la branche, sans branche de publication ni pull request. `tag-release.sh --pre` pose l’étiquette `vX.Y.Z-beta.N` sur `HEAD`, pousse l’étiquette et crée une préversion GitHub sans fichiers joints. HACS ne l’affiche que si « Afficher les versions bêta » est activé pour le dépôt.

```bash
./tools/cut-release.sh --pre 2.32.0-beta.1   # arbre propre, branche autre que main
./tools/tag-release.sh --pre 2.32.0-beta.1   # après le push, depuis la même branche
```

Chaque modification ajoute son entrée dans `CHANGELOG.md`, `CHANGELOG.pl.md`, `CHANGELOG.fr.md` et `CHANGELOG.nl.md` sous `### Unreleased` (voir [CONTRIBUTING.md](../../CONTRIBUTING.md)).

Étiquette seule, à la main : `git fetch origin && git tag -a v2.12.0 origin/main -m "Nuvio 2.12.0" && git push origin v2.12.0`.
