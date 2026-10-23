/* Settings → Users: person photos when a Home Assistant user links to a person. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../../src/parts/shared/avatar.part.js', import.meta.url), 'utf8');
const users = readFileSync(new URL('../../src/parts/hg-users.part.js', import.meta.url), 'utf8');
const oss = readFileSync(new URL('../../src/parts/hg-oss.part.js', import.meta.url), 'utf8');

const load = () => {
  const ctx = {
    H: {
      st: (h, e) => (h && h.states ? h.states[e] : undefined),
      esc: (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
      cssUrl: (u) => String(u ?? '').replace(/['"()\\\s]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')),
    },
  };
  vm.createContext(ctx);
  vm.runInContext(src + '\nthis.person = hgUserPerson; this.av = hgUserAv;', ctx);
  return ctx;
};

const person = (id, name, extra = {}) => ({
  [`person.${id}`]: { attributes: { friendly_name: name, user_id: extra.user_id, entity_picture: extra.pic } },
});
const states = (...rows) => Object.assign({}, ...rows);

test('user id links to that person even when the names differ', () => {
  const { person: find } = load();
  const S = states(person('ada', 'Ada Lovelace', { user_id: 'u1', pic: '/api/image/serve/ada/512x512' }), person('alan', 'Alan', { user_id: 'u2' }));
  assert.equal(find(S, { id: 'u1', name: 'Someone else' }), 'person.ada');
  assert.equal(find(S, { id: 'u2', name: 'Ada Lovelace' }, [{ id: 'u2', name: 'Ada Lovelace' }]), 'person.alan');
});

test('a unique name matches when the person has no user id', () => {
  const { person: find } = load();
  const S = states(person('tami', 'Tami', { pic: '/local/tami.jpg' }), person('bot', 'Frigate Admin'));
  const users = [{ id: 'u9', name: 'Tami' }, { id: 'b1', name: 'Frigate Admin' }];
  assert.equal(find(S, users[0], users), 'person.tami');
  assert.equal(find(S, users[1], users), 'person.bot');
});

test('shared or colliding names stay unmatched', () => {
  const { person: find } = load();
  const twoPeople = states(person('a', 'Admin'), person('b', 'Admin'));
  assert.equal(find(twoPeople, { id: 'u1', name: 'Admin' }, [{ id: 'u1', name: 'Admin' }]), null);
  const onePerson = states(person('a', 'Admin', { pic: '/p.jpg' }));
  const twoUsers = [{ id: 'u1', name: 'Admin' }, { id: 'u2', name: 'Admin' }];
  assert.equal(find(onePerson, twoUsers[0], twoUsers), null);
  const taken = states(person('a', 'Admin', { user_id: 'owner' }));
  assert.equal(find(taken, { id: 'other', name: 'Admin' }, [{ id: 'other', name: 'Admin' }]), null);
  assert.equal(find(states(), { id: 'svc', name: 'mqtt-frigate' }, [{ id: 'svc', name: 'mqtt-frigate' }]), null);
});

test('rows use the picture when the person has one and a letter otherwise', () => {
  const { av } = load();
  const S = states(
    person('ada', 'Ada', { user_id: 'u1', pic: '/api/image/serve/ada/512x512' }),
    person('empty', 'Empty', { user_id: 'u2', pic: '  ' }),
  );
  const hass = { states: S };
  const users = [{ id: 'u1', name: 'Ada' }, { id: 'u2', name: 'Empty' }, { id: 'u3', name: 'mqtt-z2n', username: 'mqtt' }];
  const photo = av(hass, users[0], users);
  assert.match(photo, /class="us-av pic"/);
  assert.match(photo, /background-image:url\('\/api\/image\/serve\/ada\/512x512'\)/);
  assert.doesNotMatch(photo, />A</);
  const blank = av(hass, users[1], users);
  assert.match(blank, /class="us-av"/);
  assert.doesNotMatch(blank, /pic/);
  assert.match(blank, />E</);
  const service = av(hass, users[2], users);
  assert.match(service, />M</);
  assert.doesNotMatch(service, /background-image/);
  const quoted = av({ states: states(person('q', 'Q', { user_id: 'uq', pic: "/local/a b.jpg" })) }, { id: 'uq', name: 'Q' });
  assert.match(quoted, /url\('\/local\/a%20b\.jpg'\)/);
});

test('Users and who-sees rows call the shared avatar helper', () => {
  assert.match(users, /hgUserAv\(p\._hass, u, this\.list\)/);
  assert.match(users, /\.us-av\.pic\{ background:center \/ cover no-repeat/);
  assert.doesNotMatch(users, /Array\.from\(String\(u\.name/);
  const vu = oss.slice(oss.indexOf('vuHtml('), oss.indexOf('async prep('));
  assert.match(vu, /hgUserAv\(page\._hass, u, L\)/);
  assert.doesNotMatch(vu, /class="us-av"/);
});
