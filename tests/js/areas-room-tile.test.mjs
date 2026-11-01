/* Room tile in hg-areas-card: status, lights count, target, list layout, picture. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadParts, fixture } from './harness.mjs';

const EN = fixture('en');
const stub = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.iterator ? function* () {} : k === 'length' ? 0 : k === Symbol.toPrimitive ? () => '' : k === 'then' ? undefined : stub()), apply: () => stub(), construct: () => stub() });
function mk() {
  const store = {}, window = new EventTarget();
  class El { constructor() { this.isConnected = false; } attachShadow() { return (this.shadowRoot = { addEventListener() {}, appendChild() {}, querySelectorAll: () => [] }); } dispatchEvent() {} }
  const g = { window, document: stub(), navigator: { languages: ['en'], language: 'en' }, location: { pathname: '/nuvio/x', search: '' },
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    HTMLElement: El, customElements: { get() {}, define() {} }, matchMedia: stub(), requestAnimationFrame: () => 0, setInterval: () => 0, MutationObserver: class { observe() {} },
    CustomEvent, Event, fetch: () => Promise.reject(new Error('offline')), getComputedStyle: stub(), hgDom: (e) => String(e || '').split('.')[0],
    HGL: { subs: new Set(), data: { s: {}, wiz: {} }, get: () => ({ hidden: [], added: [], order: [], conf: {}, size: {} }), sort: (l) => l, szc: () => '' } };
  return loadParts(['hg-i18n.part.js', 'hg-select.part.js', 'hg-oss.part.js', 'hg-core.part.js', 'hg-styles.part.js', 'shared/areas.part.js', 'shared/climate-modes.part.js', 'cards/areas-card.part.js'], g, ['HGAreasCard'], { EN, MANIFEST: [{ code: 'en', name: 'English', locale: 'en-GB', file: null }], text: [['import.meta.url', 'undefined']] });
}
const st = (id, state, attributes = {}) => ({ entity_id: id, state, attributes });
const hass = (over = {}) => ({
  areas: { salon: { area_id: 'salon', name: 'Salon', picture: '/api/img/salon.jpg' }, sypialnia: { area_id: 'sypialnia', name: 'Sypialnia' } },
  entities: { 'light.a': { area_id: 'salon' }, 'light.b': { area_id: 'salon' }, 'sensor.t': { area_id: 'salon' }, 'sensor.h': { area_id: 'salon' }, 'climate.ac': { area_id: 'salon' }, 'light.c': { area_id: 'sypialnia' } },
  devices: {},
  states: { 'light.a': st('light.a', 'on'), 'light.b': st('light.b', 'on'), 'light.c': st('light.c', 'unavailable'),
    'sensor.t': st('sensor.t', '22.8', { device_class: 'temperature', unit_of_measurement: '°C' }), 'sensor.h': st('sensor.h', '48', { device_class: 'humidity', unit_of_measurement: '%' }),
    'climate.ac': st('climate.ac', 'cool', { temperature: 21 }) }, ...over });
const card = (cfg = {}) => { const { HGAreasCard: C } = mk(), c = new C(); c._config = Object.assign(c.defaults(), cfg); c._hass = hass(); return c; };

test('room tile: Active status, lights count, target, picture', () => {
  const out = card().render(), salon = out.split('data-a="salon"')[0] ? out.slice(out.indexOf('data-hgk="salon"'), out.indexOf('data-hgk="sypialnia"')) : '';
  assert.match(salon, /salon\.jpg/);
  assert.match(salon, /class="stt on"/);
  assert.match(salon, /22\.8°C/); assert.match(salon, /mdi:water-outline/);
  assert.match(salon, /class="mv lt">[^]*?2<\/span>/);
  assert.match(salon, /cards\.areas\.target/);
  assert.match(salon, /data-act="lights"/);
});
test('room tile: Offline when every entity is unavailable, no picture falls back', () => {
  const out = card().render(), syp = out.slice(out.indexOf('data-hgk="sypialnia"'));
  assert.match(syp, /class="stt "/); assert.match(out, /class="tile lift\s+ nop" data-hgk="sypialnia"/);
  assert.match(syp, /—/);
});
test('layout list adds the list class', () => {
  assert.match(card({ layout: 'list' }).render(), /class="grid list cols/);
  assert.doesNotMatch(card().render(), /class="grid list cols/);
});
