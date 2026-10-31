#!/usr/bin/env bash
# Krok 2 wydania: tag vX.Y.Z i GitHub release na main, po zmergowaniu release PR z ./tools/cut-release.sh.
# Użycie: ./tools/tag-release.sh 2.31.0
# Pre-release (beta) z bieżącego brancha: ./tools/tag-release.sh --pre X.Y.Z-beta.N
set -euo pipefail
PRE=""; [ "${1:-}" = "--pre" ] && { PRE="--prerelease"; shift; }
V="${1:?usage: tools/tag-release.sh [--pre] X.Y.Z[-beta.N]}"
cd "$(dirname "$0")/.."
[ -z "$(git status --porcelain)" ] || { echo "Working tree not clean"; exit 1; }
if [ -n "$PRE" ]; then
[[ "$V" =~ ^[0-9]+\.[0-9]+\.[0-9]+-beta\.[0-9]+$ ]] || { echo "Wersja musi mieć postać X.Y.Z-beta.N"; exit 1; }
B=$(git branch --show-current)
{ [ -n "$B" ] && [ "$B" != main ]; } || { echo "Pre-release z brancha innego niż main"; exit 1; }
else
git fetch -q origin && git checkout -q main && git merge -q --ff-only origin/main
fi
python3 -c "import json,sys; sys.exit(0 if json.load(open('package.json'))['version'] == sys.argv[1] else 1)" "$V" \
  || { echo "package.json nie ma wersji $V: release PR nie jest zmergowany"; exit 1; }
grep -q "HG_BUILD = '$V+" dist/nuvio.js || { echo "dist/nuvio.js nie ma wersji $V"; exit 1; }
git rev-parse -q --verify "refs/tags/v$V" >/dev/null && { echo "Tag v$V już istnieje"; exit 1; }
git tag -a "v$V" -m "Nuvio $V"
git push -q origin "v$V"
if ! gh release view "v$V" >/dev/null 2>&1; then gh release create "v$V" $PRE --title "Nuvio $V" --generate-notes --verify-tag; fi
# weryfikacja: dist/nuvio.js w tagu ma nową wersję, wydanie nie ma załączników
T=$(mktemp -d); sleep 3
git show "v$V:dist/nuvio.js" > "$T/t.js"
grep -q "HG_BUILD = '$V+" "$T/t.js" || { echo "BŁĄD: dist/nuvio.js w v$V nie ma wersji $V"; exit 1; }
# rdzeń i skompilowane katalogi językowe wymienione w nuvio-version.json muszą być w tagu
for f in nuvio-version.json $(git show "v$V:dist/nuvio-version.json" | python3 -c "import json,sys;j=json.load(sys.stdin);print(' '.join([j['core'], *j.get('locales', {}).values()]))") nuvio-font-dmsans-latin.woff2 nuvio-bg-default-wide.webp nuvio-meteo-static-sunrise.svg CREDITS.md; do git cat-file -e "v$V:dist/$f" 2>/dev/null || { echo "BŁĄD: brak dist/$f w v$V"; exit 1; }; done
git ls-tree -d --name-only "v$V" dist/ | grep -q . && { echo "BŁĄD: podfolder w dist/ w v$V (HACS go pominie)"; exit 1; }
N=$(gh release view "v$V" --json assets -q '.assets | length'); [ "$N" = "0" ] || { echo "BŁĄD: wydanie v$V ma $N załączników (HACS pominie dist/)"; exit 1; }
echo "OK: v$V: dist/nuvio.js ma HG_BUILD $V, płaskie zasoby są, brak załączników"
