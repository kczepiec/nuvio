/* Room settings: "All room settings" from the room header must enter edit mode (click handlers live there), and a header sensor pick must not leave a stale room draft. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const pg = readFileSync(new URL('../../src/parts/hg-page.part.js', import.meta.url), 'utf8');
const a = pg.indexOf('  async _roomSens(t)'), b = pg.indexOf('\n  }\n', a) + 4;
const mk = (menuValue, rx) => {
  const area = { id: 'kitchen', ents: [] }, HGL = { data: { wiz: { areas: { sensors: { kitchen: { temperature: 'sensor.a' } } } } }, save: async () => 'ha' };
  const ctx = { HGRoomsX: rx, window: { HGRoomsX: rx }, HGL, hgT: (k) => k, H: { stateLabel: null, fmt: (v) => v, pct: (v) => v, name: (h, e) => e }, HG_NO_AREAS: {}, hgOverlay: { menu: async () => menuValue, toast() {} },
    HGAreas: { model: () => ({ byId: { kitchen: area } }), areaFromUrl: () => 'kitchen', cands: () => [], name: (h, e) => e } };
  vm.createContext(ctx); vm.runInContext('this.o = {' + pg.slice(a, b) + '}', ctx);
  const page = Object.assign(ctx.o, { _hass: { states: {} }, _config: {}, _paintHead() {}, _cards: [], _presCands: () => [] });
  return { page, HGL, ctx };
};
test('"All room settings" enters edit mode before opening the sheet', async () => {
  const rx = {}, { page } = mk('@set', rx); let entered = 0, looked = 0;
  page._editing = false; page._canEdit = () => true;
  page._editEnter = () => { entered++; page._editing = true; }; page._eLook = () => { looked++; };
  await page._roomSens({ dataset: { k: 'temperature' } });
  assert.equal(entered, 1, 'edit mode (and click wiring) must be on'); assert.equal(looked, 1); assert.equal(rx.open, 'kitchen');
});
test('a header sensor pick keeps an unsaved room draft in sync, so Save does not overwrite it', async () => {
  const rx = { dirty: true, draft: { names: { kitchen: 'Kuchnia' }, sensors: { kitchen: { temperature: 'sensor.a' } } } }, { page, HGL } = mk('sensor.b', rx);
  await page._roomSens({ dataset: { k: 'temperature' } });
  assert.equal(HGL.data.wiz.areas.sensors.kitchen.temperature, 'sensor.b');
  assert.equal(rx.draft.sensors.kitchen.temperature, 'sensor.b'); assert.equal(rx.draft.names.kitchen, 'Kuchnia');
});
