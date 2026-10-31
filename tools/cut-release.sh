#!/usr/bin/env bash
# Krok 1 wydania: branch release/X.Y.Z z wersją, changelogiem i dist, potem PR do main.
# Krok 2 (po zmergowaniu PR): ./tools/tag-release.sh X.Y.Z
# Użycie: ./tools/cut-release.sh 2.31.0
set -euo pipefail
V="${1:?usage: tools/cut-release.sh X.Y.Z}"
cd "$(dirname "$0")/.."
[ -z "$(git status --porcelain)" ] || { echo "Working tree not clean"; exit 1; }
[ "$(git branch --show-current)" = main ] || { echo "Uruchom z main"; exit 1; }
git fetch -q origin && git merge -q --ff-only origin/main
git rev-parse -q --verify "refs/heads/release/$V" >/dev/null && { echo "Branch release/$V już istnieje"; exit 1; }
git checkout -q -b "release/$V"
OLD=$(python3 -c "import json;print(json.load(open('package.json'))['version'])")
python3 - "$V" <<'PY'
import json,sys; p=json.load(open('package.json')); p['version']=sys.argv[1]; json.dump(p,open('package.json','w'))
PY
# nagłówek ### Unreleased staje się ### X.Y.Z we wszystkich czterech changelogach
python3 - "$V" CHANGELOG.md CHANGELOG.pl.md CHANGELOG.fr.md CHANGELOG.nl.md <<'PY'
import sys
v, files = sys.argv[1], sys.argv[2:]
for f in files:
    t = open(f, encoding='utf-8').read()
    if t.count('### Unreleased\n') != 1: sys.exit(f + ': wymagany dokładnie jeden nagłówek ### Unreleased')
    open(f, 'w', encoding='utf-8').write(t.replace('### Unreleased\n', '### ' + v + '\n'))
PY
python3 - "$OLD" "$V" README.md README.pl.md README.fr.md README.nl.md <<'PY'
import sys; o, n = sys.argv[1], sys.argv[2]
for f in sys.argv[3:]: t = open(f).read(); open(f, 'w').write(t.replace('v' + o, 'v' + n))
PY
python3 tools/build.py </dev/null
T0=$(mktemp -d) && cp dist/nuvio.js "$T0/nuvio.mjs" && node --check "$T0/nuvio.mjs" && cp dist/nuvio-core.*.js "$T0/core.mjs" && node --check "$T0/core.mjs"
python3 tools/guard.py
npm test --silent
git add -A && git commit -qm "chore: release $V"
git push -q -u origin "release/$V"
gh pr create --base main --head "release/$V" --title "chore: release $V" --body "Release $V: changelog Unreleased -> $V, version bump, dist rebuilt, tests and guard pass.

Po zmergowaniu: \`./tools/tag-release.sh $V\`"
echo "Gotowe. Zmerguj PR (gh pr merge <n> --squash --admin), potem ./tools/tag-release.sh $V"
