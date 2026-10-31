[English](../development.md) · **Polski** · [Français](../fr/development.md)

# Rozwój

Jak budować, organizować i wydawać Nuvio. Zasady współpracy opisuje [CONTRIBUTING.md](../../CONTRIBUTING.md). Wróć do [README](../../README.pl.md).

Zasady interfejsu, które musi spełniać każda nowa funkcja, opisuje [DESIGN.md](../../DESIGN.md).


```bash
npm install              # raz: esbuild do minifikacji paczki
python3 tools/build.py   # -> dist/nuvio.js
python3 tools/guard.py   # błąd, jeśli do dist trafił identyfikator konkretnego domu; uruchamia kontrolę i18n
```

## Test na telefonach

Przed każdym wydaniem uruchom test na żywo z Home Assistantem z Nuvio. Otwiera każdą stronę ustawień na iPhonie (WebKit, iPhone 13), Androidzie (Chromium, 360 x 780) i tablecie 768 px, rozwija zwinięte bloki, przewija każdą stronę do końca i zgłasza błąd, gdy cokolwiek wychodzi poza ekran, strona przewija się w bok albo pasek akcji jest zasłonięty. Nic nie zapisuje w Home Assistancie.

```bash
pip install playwright && playwright install webkit chromium
NUVIO_URL=https://twoj-ha NUVIO_TOKEN_FILE=~/.ha_token python3 tools/mobile_check.py --dist dist/ --shots /tmp/mobile
```

## Układ źródeł

Źródła to zwykłe pliki JavaScript, które `tools/build.py` skleja w stałej kolejności w jeden bundle (jeden wspólny zakres, bez importów):

| Folder | Zawartość |
|---|---|
| `src/parts/hg-core`, `hg-styles`, `hg-select`, `hg-oss` | klasa bazowa `HGBase`, tokeny motywu, szklany select, wspólne funkcje |
| `src/parts/shared/` | funkcje używane przez więcej niż jedną kartę (pogoda, kalendarz, model pokoi, kontrolki ogólne…) |
| `src/parts/cards/` | jedna karta w jednym pliku, na przykład `cards/light-card.part.js` |
| `src/parts/hg-page`, `hg-edit`, `hg-wall`, `hg-users`… | strona pulpitu, tryb edycji, tryb tabletu ściennego, użytkownicy wspólnego dashboardu, kopia zapasowa, Assist |

Nową kartę dodajesz jako `src/parts/cards/<nazwa>-card.part.js` i dopisujesz do listy `CARDS` w `tools/build.py`. Kolejność ma znaczenie: kod wykonywany przy ładowaniu bundla (na przykład `class X extends Y`) może używać tylko tego, co definiuje wcześniejszy plik.

## Tłumaczenia

Każdy widoczny tekst jest w katalogu JSON, nigdy w kodzie. `src/locales/en.json` to katalog wzorcowy i język źródłowy; `pl.json`, `fr.json` i każdy dodany język mają te same klucze. Dodawanie języka opisuje [Konfiguracja](configuration.md#nowy-język).

**Klucze.** Zagnieżdżony JSON, każdy segment w `snake_case`. Klucz opisuje rolę tekstu, a nie jego słowa (`cards.smartlock.default_title`, a nie `cards.smartlock.lock`). Jedna przestrzeń nazw na obszar:

| Przestrzeń | Zawartość |
|---|---|
| `common.*` | teksty wspólne dla co najmniej trzech modułów (`common.save`, `common.cancel`) |
| `nav.*` | nawigacja i tytuły widoków |
| `wizard.*` | kreator pierwszego uruchomienia |
| `edit.*`, `wall.*`, `backup.*`, `users.*`, `assist.*` … | jedna przestrzeń na moduł `hg-*.part.js` |
| `ui.*`, `shared.*` | bloki `ui/` i `shared/` |
| `cards.<karta>.*` | jedna karta (`cards.smartlock.hours_ago_one`) |
| `states.*` | surowe stany Home Assistant |
| `weather.*` | warunki pogodowe |
| `accents.*`, `backgrounds.*` | nazwy kolorów akcentu i dołączonych teł |

**Komunikaty.** Zmienne mają nazwy: `"Witaj, {name}!"`. Tłumaczenie zachowuje dokładnie zmienne tekstu angielskiego. Liczba mnoga to przyrostki klucza (`entities_one`, `entities_few`, `entities_many`, `entities_other`, także `_zero` i `_two`): formę wybiera `Intl.PluralRules(locale)` na podstawie parametru `count`, więc każdy język podaje formy, których wymagają jego reguły (angielski `_one` / `_other`, polski `_one` / `_few` / `_many` / `_other`, francuski `_one` / `_many` / `_other`). Po angielsku tekst z `{count}` musi być rozbity na formy liczby mnogiej.

**API** (`src/parts/hg-i18n.part.js`, wszystko synchroniczne):

| Wywołanie | Zastosowanie |
|---|---|
| `hgT('ns.key', params?)` | tekst w bieżącym języku |
| `hgTLazy('ns.key', params?)` | obiekt rozwiązywany przy zamianie na tekst, dla tekstów definiowanych, zanim język jest znany |
| `hgTO(obj, { prop: 'ns.key' })` | dodaje do `obj` gettery wywołujące `hgT` |
| `hgTD('states.' + state, fallback)` | klucz dynamiczny, składany w czasie działania; `fallback`, gdy klucza nie ma |

Klucze w `hgT`, `hgTLazy` i `hgTO` to literały tekstowe. Tylko `hgTD` składa klucze, i to wyłącznie pod prefiksami zadeklarowanymi w `DYN_PREFIXES` w `tools/i18n_compile.py` (`states.`, `weather.` i kilka tabel opcji kart); nowa tabela dynamiczna wymaga dopisania tam prefiksu. Brakujący tekst zastępuje angielski. Klucz statyczny, którego nie ma w `en.json`, zatrzymuje `tools/i18n_check.py` i budowanie, więc żaden klucz nie trafia do pakietu jako tekst; gdyby skompilowany numer nie miał tekstu angielskiego, widać `#<numer>` (celowo). `hgTD` zwraca wtedy `fallback`.

**Budowanie.** Klucze istnieją tylko w źródłach. `tools/build.py` nadaje każdemu kluczowi statycznemu numer (posortowane klucze `en.json`), zamienia w bundlu `hgT('ns.key')` na `hgT(842)` (formy liczby mnogiej mają wspólny numer), kompiluje każdy katalog do tablicy indeksowanej (`dist/nuvio-locale-<kod>.<hash8>.json`, hash zawartości) i wbudowuje w core angielski oraz manifest języków (`code`, `name`, `locale`, `file`, opcjonalnie `flag` i `intro`). Pozostałe języki ładują się na żądanie. Skompilowany katalog pasuje tylko do core z tego samego budowania. Teksty w źródłach mogą mówić *Home Glass*; budowanie zamienia to na *Nuvio* w bundlu i w katalogach.

**Kontrola.** `python3 tools/i18n_check.py` kończy się błędem (kod wyjścia 1), gdy klucz nie jest literałem, użytego klucza brak w `en.json`, klucz z `en.json` nie jest używany, widoczny tekst jest wpisany w kodzie, katalog ma niepoprawny JSON, zdublowany klucz, niepełne `_meta`, inne zmienne albo brakujące formy liczby mnogiej, albo gdy wymagany język (`en`, `pl`, `fr`) jest niekompletny. Tekst katalogu trafia na stronę jako HTML, więc odrzuca też znaczniki w tekście (`<b>`, `</…`, `<!--`; dozwolony jest symbol zastępczy małymi literami, np. `<id>`, który nie jest nazwą elementu HTML), atrybut zdarzenia `on…=`, prosty cudzysłów `"` poza angielskim i nazwę pliku katalogu, która nie jest kodem języka małymi literami (`fr`, `pt-br`). Inne języki mogą być niepełne i dostają tylko ostrzeżenie z pokryciem. Opcje: `--lang <kod>` wypisuje brakujące i przestarzałe klucze jednego języka, `--list` pokazuje wszystkie błędy, `--json` zwraca wynik jako JSON. `tools/guard.py` uruchamia ją w ramach swoich kontroli.

Nie ma CI/CD, więc wydania robi lokalnie tylko współtwórca-właściciel. Pull requesty z funkcjami nie podbijają wersji: dopisują wpis do `### Unreleased`. Wydanie to dwa kroki:

1. `./tools/cut-release.sh X.Y.Z` tworzy branch `release/X.Y.Z`, zmienia `### Unreleased` na `### X.Y.Z` we wszystkich czterech changelogach, podbija wersję (`package.json`, plakietki w README), przebudowuje `dist/`, uruchamia `node --check`, guard i `npm test`, robi commit `chore: release X.Y.Z` i otwiera pull request do `main`.
2. Po zmergowaniu pull requestu `./tools/tag-release.sh X.Y.Z` taguje `main` jako `vX.Y.Z`, wypycha tag, tworzy wydanie GitHub bez załączników (HACS instaluje wtedy płaski `dist/`) i sprawdza tag.

```bash
./tools/cut-release.sh 2.31.0   # czyste drzewo, zalogowane gh, z main
./tools/tag-release.sh 2.31.0   # po zmergowaniu pull requestu wydania
```

**Pre-release.** Aby przetestować branch z funkcją przez HACS przed prawdziwym wydaniem, uruchom skrypty z `--pre X.Y.Z-beta.N`. `cut-release.sh --pre` działa na bieżącym branchu (nie `main`, czyste drzewo): podbija tylko `package.json` (plakietki w README i `### Unreleased` zostają bez zmian), przebudowuje `dist/`, uruchamia te same kontrole, robi commit `chore: pre-release X.Y.Z-beta.N` i wypycha branch, bez brancha wydania i pull requesta. `tag-release.sh --pre` taguje `HEAD` jako `vX.Y.Z-beta.N`, wypycha tag i tworzy pre-release w GitHub bez załączników. HACS pokazuje go tylko po włączeniu opcji „Pokaż wersje beta” dla repozytorium.

```bash
./tools/cut-release.sh --pre 2.32.0-beta.1   # czyste drzewo, branch inny niż main
./tools/tag-release.sh --pre 2.32.0-beta.1   # po wypchnięciu, z tego samego brancha
```

Każda zmiana dopisuje wpis do `CHANGELOG.md`, `CHANGELOG.pl.md`, `CHANGELOG.fr.md` i `CHANGELOG.nl.md` w sekcji `### Unreleased` (zobacz [CONTRIBUTING.md](../../CONTRIBUTING.md)).

Sam tag ręcznie: `git fetch origin && git tag -a v2.12.0 origin/main -m "Nuvio 2.12.0" && git push origin v2.12.0`.
