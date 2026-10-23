/* Discord community link: user menu, About page, catalogs, READMEs. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const rd = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const INVITE = 'https://discord.gg/rFG9y2hFMJ';
const GUILD = '1563057427367075850';

test('user menu keeps Profile and Settings and adds Discord after them', () => {
  const s = rd('../../src/parts/hg-oss.part.js');
  const i = s.indexOf('menu: [');
  assert.ok(i >= 0);
  const line = s.slice(i, s.indexOf('\n', i));
  const profile = line.indexOf("hgT('nav.profile')");
  const settings = line.indexOf("hgT('nav.settings')");
  const discord = line.indexOf("hgT('nav.discord')");
  assert.ok(profile >= 0 && settings > profile && discord > settings);
  assert.ok(line.includes("icon: 'mdi:account-circle-outline'"));
  assert.ok(line.includes("action: { navigate: '/profile' }"));
  assert.ok(line.includes("icon: 'mdi:cog-outline'"));
  assert.ok(line.includes("action: { navigate: '/config/dashboard' }"));
  assert.ok(line.includes("icon: 'mdi:discord'"));
  assert.ok(line.includes("svg: 'discord'"));
  assert.ok(line.includes(`action: { url: '${INVITE}' }`));
  assert.match(line, /menu: \[\.\.\.\(railOff \? V\.slice\(5\)/);
});

test('user menu draws a Discord mark instead of an empty ha-icon', () => {
  const page = rd('../../src/parts/hg-page.part.js');
  const start = page.indexOf('const HG_SVG');
  const end = page.indexOf('let hgBmUsers');
  assert.ok(start >= 0 && end > start);
  const ctx = { H: { icon: (i) => `ICON:${i}` } };
  vm.createContext(ctx);
  vm.runInContext(page.slice(start, end) + '\nthis.icon = hgMenuIcon; this.svg = HG_SVG;', ctx);
  const mark = ctx.icon({ label: 'Discord', icon: 'mdi:discord', svg: 'discord' });
  assert.match(mark, /^<svg/);
  assert.match(mark, /fill="currentColor"/);
  assert.match(mark, /viewBox="0 0 24 24"/);
  assert.equal(ctx.icon({ icon: 'mdi:discord' }), mark);
  assert.equal(ctx.icon({ icon: 'mdi:account-circle-outline' }), 'ICON:mdi:account-circle-outline');
  assert.equal(ctx.icon({ icon: 'mdi:cog-outline' }), 'ICON:mdi:cog-outline');
  assert.equal(ctx.icon({}), 'ICON:mdi:circle-small');
  assert.equal(ctx.svg.discord, mark);
  const paint = page.slice(page.indexOf('_paintMenu() {'), page.indexOf('_openSheet(open)'));
  assert.match(paint, /hgMenuIcon\(m\)/);
  assert.doesNotMatch(paint, /H\.icon\(m\.icon/);
  assert.match(page, /\.menu ha-icon, \.menu button > svg\{ width:18px; height:18px; flex:none; \}/);
});

test('About page links to the same Discord invite', () => {
  const s = rd('../../src/parts/hg-edit.part.js');
  const a = s.indexOf('_eAboutHtml()');
  const body = s.slice(a, s.indexOf('_eLook()', a));
  assert.ok(body.includes(`href="${INVITE}"`));
  assert.ok(body.includes('target="_blank"'));
  assert.ok(body.includes("hgT('nav.discord')"));
  assert.ok(body.includes("hgT('settings.docs')"));
  assert.ok(body.includes("hgT('settings.report')"));
});

test('Discord label is Discord in English, Polish and French', () => {
  for (const code of ['en', 'pl', 'fr']) {
    const cat = JSON.parse(rd(`../../src/locales/${code}.json`));
    assert.equal(cat.nav.discord, 'Discord');
  }
});

test('READMEs link to Discord without an em dash or en dash', () => {
  for (const f of ['README.md', 'README.pl.md', 'README.fr.md']) {
    const t = rd('../../' + f);
    assert.ok(t.includes(INVITE), f);
    assert.ok(t.includes(GUILD), f);
    assert.ok(t.includes('color=a3e635'), f);
    assert.equal(t.includes('\u2014'), false, f + ' em dash');
    assert.equal(t.includes('\u2013'), false, f + ' en dash');
  }
});
