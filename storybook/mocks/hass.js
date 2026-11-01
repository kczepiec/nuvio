/** Przykładowe encje i hass dla Storybook (bez Home Assistant). */
const now = () => Date.now();

export function entity(id, state, attributes = {}) {
  const t = new Date(now()).toISOString();
  return {
    entity_id: id,
    state: String(state),
    attributes: attributes || {},
    last_changed: t,
    last_updated: t,
  };
}

/** Zestaw ogólny — toggle, progress, family, itd. (jak tests/ui-gallery.html). */
export function studioHass() {
  const base = demoHass('pl', true);
  const st = (id, state, attributes = {}) => entity(id, state, attributes);
  base.states['climate.salon'] = st('climate.salon', 'cool', {
    friendly_name: 'Klimatyzacja salon',
    temperature: 22,
    current_temperature: 23.5,
    hvac_modes: ['off', 'cool', 'heat', 'dry', 'fan_only', 'heat_cool'],
    hvac_action: 'cooling',
    fan_modes: ['auto', 'low', 'medium', 'high'],
    fan_mode: 'medium',
    swing_modes: ['off', 'vertical', 'horizontal', 'both'],
    swing_mode: 'vertical',
    preset_modes: ['none', 'eco', 'sleep'],
    preset_mode: 'none',
    min_temp: 16,
    max_temp: 30,
    target_temp_step: 0.5,
  });
  base.states['weather.home'] = st('weather.home', 'partlycloudy', {
    friendly_name: 'Na zewnątrz',
    temperature: 18,
    temperature_unit: '°C',
    humidity: 62,
    pressure: 1012,
    wind_speed: 12,
    wind_speed_unit: 'km/h',
    forecast: [
      { datetime: new Date(now() + 3600e3).toISOString(), condition: 'sunny', temperature: 19 },
      { datetime: new Date(now() + 7200e3).toISOString(), condition: 'cloudy', temperature: 17 },
      { datetime: new Date(now() + 10800e3).toISOString(), condition: 'rainy', temperature: 15 },
      { datetime: new Date(now() + 14400e3).toISOString(), condition: 'partlycloudy', temperature: 16 },
    ],
  });
  base.states['sun.sun'] = st('sun.sun', 'above_horizon', { friendly_name: 'Słońce', elevation: 32, next_rising: new Date(now() + 12 * 3600e3).toISOString(), next_setting: new Date(now() + 6 * 3600e3).toISOString() });
  base.states['media_player.salon'] = st('media_player.salon', 'playing', {
    friendly_name: 'Salon',
    media_title: 'Midnight City',
    media_artist: 'M83',
    media_content_type: 'music',
    entity_picture: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80',
    supported_features: 12319,
  });
  base.states['camera.wejscie'] = st('camera.wejscie', 'idle', { friendly_name: 'Wejście', entity_picture: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80' });
  base.states['camera.ogrod'] = st('camera.ogrod', 'idle', { friendly_name: 'Ogród', entity_picture: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' });
  base.states['scene.wieczor'] = st('scene.wieczor', 'scening', { friendly_name: 'Wieczór', icon: 'mdi:weather-night' });
  base.states['scene.film'] = st('scene.film', 'scening', { friendly_name: 'Film', icon: 'mdi:movie-open' });
  base.states['script.dobranoc'] = st('script.dobranoc', 'off', { friendly_name: 'Dobranoc', icon: 'mdi:sleep' });
  base.states['sensor.power'] = st('sensor.power', '1.24', { friendly_name: 'Moc', unit_of_measurement: 'kW', device_class: 'power' });
  base.states['sensor.daily'] = st('sensor.daily', '18.6', {
    friendly_name: 'Dziś',
    unit_of_measurement: 'kWh',
    device_class: 'energy',
    state_class: 'total_increasing',
  });
  const origWs = base.callWS;
  base.callWS = async (m) => {
    if (m.type === 'recorder/statistics_during_period') return mockStatistics(m);
    if (m.type === 'logbook/get_events') return mockLogbook(m);
    return origWs(m);
  };
  base.config = { unit_system: { temperature: '°C', length: 'km' }, time_zone: 'Europe/Warsaw' };
  return base;
}

function mockStatistics(m) {
  const ids = m.statistic_ids || [];
  const start = Date.parse(m.start_time) || Date.now() - 7 * 86400000;
  const step = m.period === 'hour' ? 3600e3 : m.period === '5minute' ? 300e3 : 86400000;
  const out = {};
  for (const id of ids) {
    const rows = [];
    for (let t = start; t < Date.now(); t += step) {
      const hour = new Date(t).getHours();
      const change = m.period === 'day' ? 6 + (new Date(t).getDay() % 5) * 2.4 : m.period === 'hour' ? 0.2 + (hour % 8) * 0.18 : 280 + (hour % 6) * 90;
      rows.push({ start: t, change, mean: change, state: change });
    }
    out[id] = rows;
  }
  return out;
}

function mockLogbook(m) {
  const ids = m.entity_ids || [];
  const t = Math.floor(Date.now() / 1000);
  return ids.slice(0, 8).map((id, i) => ({
    entity_id: id,
    state: i % 2 ? 'on' : 'off',
    name: id.split('.')[1],
    when: t - (i + 1) * 900,
  }));
}

export function demoHass(lang = 'pl', dark = true) {
  const st = (e, s, a) => entity(e, s, a);
  const states = Object.fromEntries([
    ['light.salon', st('light.salon', 'on', { friendly_name: 'Salon', brightness: 219, supported_color_modes: ['brightness'] })],
    ['switch.kuchnia', st('switch.kuchnia', 'off', { friendly_name: 'Kuchnia' })],
    ['fan.sypialnia', st('fan.sypialnia', 'on', { friendly_name: 'Wentylator', percentage: 66, percentage_step: 1, preset_modes: ['auto', 'sleep', 'turbo'], preset_mode: 'auto' })],
    ['sensor.energia', st('sensor.energia', '62', { friendly_name: 'Zużycie energii', unit_of_measurement: '%' })],
    ['sensor.solar', st('sensor.solar', '12.4', { friendly_name: 'Energia słoneczna', unit_of_measurement: 'kWh' })],
    ['sensor.temp', st('sensor.temp', '22.5', { friendly_name: 'Temperatura', unit_of_measurement: '°C', device_class: 'temperature' })],
    ['sensor.wilg', st('sensor.wilg', '48', { unit_of_measurement: '%', device_class: 'humidity' })],
    ['cover.roleta', st('cover.roleta', 'open', { friendly_name: 'Roleta salon', current_position: 40, supported_features: 15 })],
    ['lock.drzwi', st('lock.drzwi', 'locked', { friendly_name: 'Drzwi wejściowe' })],
    ['todo.zakupy', st('todo.zakupy', '2', { friendly_name: 'Zakupy' })],
    ['scene.wieczor', st('scene.wieczor', 'scening', { friendly_name: 'Wieczór', icon: 'mdi:weather-night' })],
    ['script.film', st('script.film', 'off', { friendly_name: 'Film', icon: 'mdi:movie-open' })],
    ['person.anna', st('person.anna', 'home', { friendly_name: 'Anna' })],
    ['person.marek', st('person.marek', 'not_home', { friendly_name: 'Marek' })],
    ['person.zosia', st('person.zosia', 'home', { friendly_name: 'Zosia' })],
  ].map(([k, v]) => [k, v]));

  return {
    states,
    user: { name: 'Demo Użytkownik' },
    language: lang,
    locale: { language: lang },
    themes: { darkMode: dark },
    callService: async () => {},
    callWS: async (m) => {
      if (m.type === 'todo/item/list') {
        return {
          items: [
            { uid: '1', summary: 'Kupić mleko', status: 'needs_action' },
            { uid: '2', summary: 'Podlać kwiaty', status: 'needs_action' },
            { uid: '3', summary: 'Wynieść śmieci', status: 'completed' },
          ],
        };
      }
      if (m.type === 'history/history_during_period') {
        const e = m.entity_ids[0];
        return {
          [e]: Array.from({ length: 60 }, (_, i) => ({
            s: String(6 + Math.sin(i / 6) * 3 + i / 10),
            lu: (now() - (60 - i) * 24 * 60e3) / 1000,
          })),
        };
      }
      return {};
    },
  };
}

/** Pełny dom pod katalog Storybook: encje ze wszystkich domen, których szukają karty. */
export function catalogHass() {
  const h = studioHass();
  const a = areasHass();
  h.areas = a.areas;
  h.entities = Object.assign({}, a.entities);
  h.devices = {};
  h.states = Object.assign({}, a.states, h.states);
  const add = (id, state, attributes) => { h.states[id] = entity(id, state, attributes); };
  const soon = (ms) => new Date(Date.now() + ms).toISOString();
  add('alarm_control_panel.dom', 'armed_home', { friendly_name: 'Alarm', code_format: 'number', supported_features: 63 });
  add('vacuum.robot', 'docked', { friendly_name: 'Robot', battery_level: 80, fan_speed_list: ['quiet', 'max'] });
  add('humidifier.sypialnia', 'on', { friendly_name: 'Nawilżacz', humidity: 45, current_humidity: 40, min_humidity: 30, max_humidity: 70 });
  add('binary_sensor.okno', 'on', { friendly_name: 'Okno salon', device_class: 'window' });
  add('binary_sensor.ruch', 'off', { friendly_name: 'Ruch hol', device_class: 'motion' });
  add('binary_sensor.drzwi', 'off', { friendly_name: 'Drzwi', device_class: 'door' });
  add('input_boolean.gosc', 'on', { friendly_name: 'Tryb gość' });
  add('input_number.jasnosc', '40', { friendly_name: 'Jasność', min: 0, max: 100, step: 1, unit_of_measurement: '%' });
  add('number.term', '21', { friendly_name: 'Nastawa', min: 10, max: 30, step: 0.5, unit_of_measurement: '°C', mode: 'slider' });
  add('timer.piekarnik', 'active', { friendly_name: 'Piekarnik', duration: '0:30:00', remaining: '0:12:00', finishes_at: soon(12 * 60e3) });
  add('plant.monstera', 'ok', { friendly_name: 'Monstera', moisture: 42 });
  add('sensor.ziemia', '42', { friendly_name: 'Wilgotność ziemi', device_class: 'moisture', unit_of_measurement: '%' });
  add('update.nuvio', 'on', { friendly_name: 'Nuvio', title: 'Nuvio', installed_version: '2.32.0', latest_version: '2.33.0' });
  add('update.rdzen', 'off', { friendly_name: 'Home Assistant', installed_version: '2026.10.0', latest_version: '2026.10.0' });
  add('remote.tv', 'on', { friendly_name: 'Pilot TV', current_activity: 'HDMI 1' });
  add('button.dzwonek', 'unknown', { friendly_name: 'Dzwonek' });
  add('water_heater.bojler', 'heat', { friendly_name: 'CWU', current_temperature: 48, temperature: 50, min_temp: 30, max_temp: 70 });
  add('device_tracker.telefon', 'home', { friendly_name: 'Telefon' });
  add('calendar.dom', 'on', { friendly_name: 'Dom', message: 'Spotkanie', start_time: soon(3600e3), end_time: soon(7200e3) });
  add('sensor.pm25', '12', { friendly_name: 'PM2.5', device_class: 'pm25', unit_of_measurement: 'µg/m³' });
  add('sensor.co2', '640', { friendly_name: 'CO₂', device_class: 'carbon_dioxide', unit_of_measurement: 'ppm' });
  add('sensor.bateria', '76', { friendly_name: 'Bateria', device_class: 'battery', unit_of_measurement: '%' });
  add('select.tryb', 'auto', { friendly_name: 'Tryb', options: ['auto', 'eco', 'boost'] });
  add('input_select.scena', 'Wieczór', { friendly_name: 'Scena dnia', options: ['Rano', 'Wieczór', 'Noc'] });
  add('sensor.paliwo', '6.49', { friendly_name: 'PB95', unit_of_measurement: 'zł/l', device_class: 'monetary' });
  add('sensor.on', '6.89', { friendly_name: 'ON', unit_of_measurement: 'zł/l', device_class: 'monetary' });
  add('lawn_mower.ogrod', 'docked', { friendly_name: 'Kosiarka', battery_level: 90 });
  add('sensor.grid', '820', { friendly_name: 'Sieć', unit_of_measurement: 'W', device_class: 'power', state_class: 'measurement' });
  add('sensor.pv', '1460', { friendly_name: 'PV', unit_of_measurement: 'W', device_class: 'power', state_class: 'measurement' });
  add('sensor.dom', '2100', { friendly_name: 'Dom', unit_of_measurement: 'W', device_class: 'power', state_class: 'measurement' });
  add('sensor.batt', '-240', { friendly_name: 'Bateria moc', unit_of_measurement: 'W', device_class: 'power', state_class: 'measurement' });
  add('sensor.l1', '640', { friendly_name: 'L1', unit_of_measurement: 'W', device_class: 'power' });
  add('sensor.l2', '510', { friendly_name: 'L2', unit_of_measurement: 'W', device_class: 'power' });
  add('sensor.l3', '430', { friendly_name: 'L3', unit_of_measurement: 'W', device_class: 'power' });
  add('sensor.u1', '231', { friendly_name: 'L1 V', unit_of_measurement: 'V', device_class: 'voltage' });
  add('sensor.u2', '229', { friendly_name: 'L2 V', unit_of_measurement: 'V', device_class: 'voltage' });
  add('sensor.u3', '232', { friendly_name: 'L3 V', unit_of_measurement: 'V', device_class: 'voltage' });
  add('sensor.i1', '2.8', { friendly_name: 'L1 A', unit_of_measurement: 'A', device_class: 'current' });
  add('sensor.i2', '2.2', { friendly_name: 'L2 A', unit_of_measurement: 'A', device_class: 'current' });
  add('sensor.i3', '1.9', { friendly_name: 'L3 A', unit_of_measurement: 'A', device_class: 'current' });
  add('sensor.yield0', '14.2', { friendly_name: 'Dziś PV', unit_of_measurement: 'kWh', device_class: 'energy' });
  add('sensor.yield1', '9.4', { friendly_name: 'Jutro PV', unit_of_measurement: 'kWh', device_class: 'energy' });
  add('sensor.yield2', '11.8', { friendly_name: 'Pojutrze PV', unit_of_measurement: 'kWh', device_class: 'energy' });
  add('sensor.inverter', 'on', { friendly_name: 'Falownik' });
  add('sensor.ping', '18', { friendly_name: '1.1.1.1', unit_of_measurement: 'ms' });
  add('sensor.down', '640', { friendly_name: 'Pobieranie', unit_of_measurement: 'Mb/s' });
  add('sensor.up', '42', { friendly_name: 'Wysyłanie', unit_of_measurement: 'Mb/s' });
  add('sensor.wan', 'connected', { friendly_name: 'WAN' });
  add('sensor.uptime', new Date(Date.now() - 36 * 3600e3).toISOString(), { friendly_name: 'Uptime bramy', device_class: 'timestamp' });
  add('binary_sensor.grzanie', 'on', { friendly_name: 'Grzałka CWU', device_class: 'heat' });
  add('switch.pralka', 'on', { friendly_name: 'Pralka', device_class: 'outlet' });
  add('automation.schody', 'on', { friendly_name: 'Schody' });
  const hour = new Date().getHours();
  const prices = Array.from({ length: 24 }, (_, i) => +(0.35 + Math.sin(i / 3) * 0.2 + (i >= 17 && i <= 21 ? 0.45 : 0)).toFixed(3));
  add('sensor.cena', String(prices[hour]), { friendly_name: 'Cena prądu', unit_of_measurement: 'zł/kWh', raw_today: prices, raw_tomorrow: prices.map((v) => +(v * 0.92).toFixed(3)) });
  add('binary_sensor.zosia', 'on', { friendly_name: 'Zosia obecność', planned_absence: false, not_scheduled_reason: null, scheduled_today: true, check_in: '08:12', check_out: '' });
  add('sensor.zosia_posilki', '2', { friendly_name: 'Zosia posiłki', meal_plan: ['śniadanie', 'obiad'], scheduled: true });
  add('sensor.zosia_plan', '1', { friendly_name: 'Zosia plan', date: new Date().toISOString().slice(0, 10), activities: [{ title: 'Rytmika', start: '10:00', end: '10:30', all_day: false }] });
  add('sensor.zosia_nieprzeczytane', '3', { friendly_name: 'Zosia wiadomości', checked_items: 1, items: ['a', 'b', 'c'] });
  add('sensor.zosia_rachunek', '120', { friendly_name: 'Zosia rachunek', unit_of_measurement: 'PLN', to_pay_by_category: { czesne: 120 }, overdue: false });
  h.entities['switch.pralka'] = { device_id: 'pralka', area_id: 'lazienka' };
  h.entities['sensor.temp_pralka'] = { device_id: 'pralka' };
  add('sensor.temp_pralka', '40', { friendly_name: 'Temperatura bębna', device_class: 'temperature', unit_of_measurement: '°C' });
  if (h.states['device_tracker.telefon']) h.states['device_tracker.telefon'].attributes = { ...h.states['device_tracker.telefon'].attributes, ip: '192.168.1.40' };
  h.user = { ...(h.user || {}), name: 'Demo', is_admin: true };
  h.callApi = async (_method, path) => {
    if (String(path).startsWith('calendars/')) {
      const start = new Date();
      start.setMinutes(0, 0, 0);
      start.setHours(start.getHours() + 1);
      const end = new Date(start.getTime() + 3600e3);
      const tom = new Date();
      tom.setDate(tom.getDate() + 1);
      tom.setHours(9, 0, 0, 0);
      return [
        { summary: 'Spotkanie', start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() }, location: 'Salon' },
        { summary: 'Zakupy', start: { dateTime: tom.toISOString() }, end: { dateTime: new Date(tom.getTime() + 3600e3).toISOString() } },
      ];
    }
    return [];
  };
  return h;
}

/** Kopia hass z podmienionym stanem jednej encji. */
export function withEntityState(hass, id, state, attributes = {}) {
  const cur = hass.states[id];
  if (!cur) return hass;
  return {
    ...hass,
    states: {
      ...hass.states,
      [id]: { ...cur, state: String(state), attributes: { ...cur.attributes, ...attributes } },
    },
  };
}

/** Pokoje — areas-card (salon aktywny, sypialnia offline). */
export function areasHass(over = {}) {
  const st = (id, state, attributes = {}) => entity(id, state, attributes);
  return {
    areas: {
      salon: { area_id: 'salon', name: 'Salon', icon: 'mdi:sofa-outline', picture: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
      sypialnia: { area_id: 'sypialnia', name: 'Sypialnia', icon: 'mdi:bed-king-outline', picture: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80' },
      kuchnia: { area_id: 'kuchnia', name: 'Kuchnia', icon: 'mdi:countertop-outline', picture: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80' },
    },
    entities: {
      'light.a': { area_id: 'salon' },
      'light.b': { area_id: 'salon' },
      'sensor.t': { area_id: 'salon' },
      'sensor.h': { area_id: 'salon' },
      'climate.ac': { area_id: 'salon' },
      'light.c': { area_id: 'sypialnia' },
      'sensor.ts': { area_id: 'sypialnia' },
      'sensor.hs': { area_id: 'sypialnia' },
      'light.k': { area_id: 'kuchnia' },
      'sensor.tk': { area_id: 'kuchnia' },
      'sensor.hk': { area_id: 'kuchnia' },
    },
    devices: {},
    states: {
      'light.a': st('light.a', 'on'),
      'light.b': st('light.b', 'on'),
      'light.c': st('light.c', 'on', { friendly_name: 'Sypialnia', brightness: 80 }),
      'light.k': st('light.k', 'on', { friendly_name: 'Kuchnia', brightness: 180 }),
      'sensor.t': st('sensor.t', '22.8', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'Salon temp' }),
      'sensor.h': st('sensor.h', '48', { device_class: 'humidity', unit_of_measurement: '%', friendly_name: 'Salon wilgotność' }),
      'sensor.ts': st('sensor.ts', '20.4', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'Sypialnia temp' }),
      'sensor.hs': st('sensor.hs', '41', { device_class: 'humidity', unit_of_measurement: '%', friendly_name: 'Sypialnia wilgotność' }),
      'sensor.tk': st('sensor.tk', '21.2', { device_class: 'temperature', unit_of_measurement: '°C', friendly_name: 'Kuchnia temp' }),
      'sensor.hk': st('sensor.hk', '55', { device_class: 'humidity', unit_of_measurement: '%', friendly_name: 'Kuchnia wilgotność' }),
      'climate.ac': st('climate.ac', 'cool', { temperature: 21, hvac_modes: ['off', 'cool', 'heat'] }),
    },
    user: { name: 'Demo' },
    language: 'pl',
    locale: { language: 'pl' },
    themes: { darkMode: true },
    callService: async () => {},
    ...over,
  };
}
