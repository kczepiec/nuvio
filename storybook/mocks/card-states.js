/** Stany podglądu: [id eksportu, etykieta, stan encji, atrybuty]. */
const onOff = (entity) => ({
  entity,
  variants: [
    ['Wlaczony', 'Włączony', 'on'],
    ['Wylaczony', 'Wyłączony', 'off'],
    ['Niedostepny', 'Niedostępny', 'unavailable'],
  ],
});

const climate = (entity) => ({
  entity,
  variants: [
    ['Off', 'Wyłączony', 'off', { hvac_action: 'off' }],
    ['Cool', 'Chłodzenie', 'cool', { hvac_action: 'cooling', temperature: 21 }],
    ['Heat', 'Grzanie', 'heat', { hvac_action: 'heating', temperature: 23 }],
    ['Dry', 'Osuszanie', 'dry', { hvac_action: 'drying' }],
    ['Niedostepny', 'Niedostępny', 'unavailable'],
  ],
});

export const CARD_VARIANTS = {
  'hg-light-card': onOff('light.salon'),
  'hg-switch-card': onOff('switch.kuchnia'),
  'hg-toggle-card': onOff('light.salon'),
  'hg-stack-card': { config: { title: 'Stos', cards: [{ type: 'custom:nuvio-toggle-card', entity: 'light.salon' }, { type: 'custom:nuvio-toggle-card', entity: 'switch.kuchnia' }] } },
  'hg-grid-card': { config: { columns: 2, cards: [{ type: 'custom:nuvio-toggle-card', entity: 'light.salon' }, { type: 'custom:nuvio-toggle-card', entity: 'switch.kuchnia' }] } },
  'hg-tabs-card': { config: { tabs: [{ label: 'Światła', cards: [{ type: 'custom:nuvio-toggle-card', entity: 'light.salon' }] }, { label: 'Inne', cards: [{ type: 'custom:nuvio-toggle-card', entity: 'switch.kuchnia' }] }] } },
  'hg-conditional-card': { config: { conditions: [{ entity: 'light.salon', state: 'on' }], cards: [{ type: 'custom:nuvio-toggle-card', entity: 'light.salon' }] } },
  'hg-fan-card': onOff('fan.sypialnia'),
  'hg-lamp-card': onOff('light.salon'),
  'hg-humidifier-card': onOff('humidifier.sypialnia'),
  'hg-purifier-card': onOff('fan.sypialnia'),
  'hg-input-boolean': onOff('input_boolean.gosc'),
  'hg-lock-card': {
    entity: 'lock.drzwi',
    variants: [
      ['Locked', 'Zamknięty', 'locked'],
      ['Unlocked', 'Otwarty', 'unlocked'],
      ['Jammed', 'Zablokowany', 'jammed'],
      ['Niedostepny', 'Niedostępny', 'unavailable'],
    ],
  },
  'hg-smartlock-card': {
    entity: 'lock.drzwi',
    variants: [
      ['Locked', 'Zamknięty', 'locked'],
      ['Unlocked', 'Otwarty', 'unlocked'],
      ['Jammed', 'Zablokowany', 'jammed'],
    ],
  },
  'hg-cover-card': {
    entity: 'cover.roleta',
    variants: [
      ['Open', 'Otwarta', 'open', { current_position: 100 }],
      ['Closed', 'Zamknięta', 'closed', { current_position: 0 }],
      ['Opening', 'Otwiera się', 'opening', { current_position: 40 }],
      ['Closing', 'Zamyka się', 'closing', { current_position: 60 }],
    ],
  },
  'hg-ac-card': climate('climate.salon'),
  'hg-studio-climate-card': climate('climate.salon'),
  'hg-thermo-card': climate('climate.salon'),
  'hg-acremote-card': climate('climate.salon'),
  'hg-cwu-card': {
    entity: 'water_heater.bojler',
    config: {
      cwu: {
        heater: 'water_heater.bojler',
        heating: 'binary_sensor.grzanie',
        power: 'sensor.power',
        tank: 'sensor.temp',
        switches: [],
      },
    },
    variants: [
      ['Heat', 'Grzanie', 'heat'],
      ['Off', 'Wyłączony', 'off'],
      ['Niedostepny', 'Niedostępny', 'unavailable'],
    ],
  },
  'hg-alarm-card': {
    entity: 'alarm_control_panel.dom',
    variants: [
      ['Disarmed', 'Rozbrojony', 'disarmed'],
      ['Home', 'Dom', 'armed_home'],
      ['Away', 'Poza domem', 'armed_away'],
      ['Night', 'Noc', 'armed_night'],
      ['Triggered', 'Alarm', 'triggered'],
      ['Pending', 'Uzbrajanie', 'pending'],
    ],
  },
  'hg-vacuum-card': {
    entity: 'vacuum.robot',
    variants: [
      ['Docked', 'W bazie', 'docked'],
      ['Cleaning', 'Sprząta', 'cleaning'],
      ['Returning', 'Wraca', 'returning'],
      ['Paused', 'Pauza', 'paused'],
      ['Error', 'Błąd', 'error', { battery_level: 8 }],
    ],
  },
  'hg-media-card': {
    entity: 'media_player.salon',
    variants: [
      ['Playing', 'Odtwarzanie', 'playing'],
      ['Paused', 'Pauza', 'paused'],
      ['Idle', 'Bezczynny', 'idle'],
      ['Off', 'Wyłączony', 'off'],
    ],
  },
  'hg-media-mini-card': {
    entity: 'media_player.salon',
    variants: [
      ['Playing', 'Odtwarzanie', 'playing'],
      ['Paused', 'Pauza', 'paused'],
      ['Off', 'Wyłączony', 'off'],
    ],
  },
  'hg-players-card': {
    entity: 'media_player.salon',
    variants: [
      ['Playing', 'Odtwarzanie', 'playing'],
      ['Off', 'Wyłączony', 'off'],
    ],
  },
  'hg-person-card': {
    entity: 'person.anna',
    variants: [
      ['Home', 'W domu', 'home'],
      ['Away', 'Poza domem', 'not_home'],
      ['Niedostepny', 'Niedostępny', 'unavailable'],
    ],
  },
  'hg-people-card': {
    entity: 'person.anna',
    variants: [
      ['Home', 'W domu', 'home'],
      ['Away', 'Poza domem', 'not_home'],
    ],
  },
  'hg-timer-card': {
    entity: 'timer.piekarnik',
    variants: [
      ['Active', 'Odlicza', 'active'],
      ['Paused', 'Pauza', 'paused'],
      ['Idle', 'Bezczynny', 'idle'],
    ],
  },
  'hg-weather-card': {
    entity: 'weather.home',
    config: { entity: 'weather.home', sun: 'sun.sun' },
    variants: [
      ['Slonce', 'Słońce', 'sunny'],
      ['Chmury', 'Chmury', 'cloudy'],
      ['Deszcz', 'Deszcz', 'rainy'],
      ['Snieg', 'Śnieg', 'snowy'],
      ['Burza', 'Burza', 'lightning'],
    ],
  },
  'hg-sun-card': {
    entity: 'sun.sun',
    variants: [
      ['Dzien', 'Dzień', 'above_horizon'],
      ['Noc', 'Noc', 'below_horizon'],
    ],
  },
  'hg-camera-card': {
    entity: 'camera.wejscie',
    variants: [
      ['Idle', 'Czuwanie', 'idle'],
      ['Recording', 'Nagrywa', 'recording'],
      ['Niedostepna', 'Niedostępna', 'unavailable'],
    ],
  },
  'hg-cameras-card': {
    entity: 'camera.wejscie',
    config: { entities: ['camera.wejscie', 'camera.ogrod'] },
    variants: [
      ['Idle', 'Czuwanie', 'idle'],
      ['Niedostepna', 'Niedostępna', 'unavailable'],
    ],
  },
  'hg-update-card': {
    entity: 'update.nuvio',
    variants: [
      ['Dostepna', 'Dostępna', 'on'],
      ['Aktualna', 'Aktualna', 'off'],
    ],
  },
  'hg-updates-card': {
    entity: 'update.nuvio',
    variants: [
      ['Dostepna', 'Dostępna', 'on'],
      ['Aktualna', 'Aktualna', 'off'],
    ],
  },
  'hg-binary-sensor': onOff('binary_sensor.okno'),
  'hg-openings-card': {
    entity: 'binary_sensor.okno',
    config: { entities: ['binary_sensor.okno', 'binary_sensor.drzwi'] },
    variants: [
      ['Otwarte', 'Otwarte', 'on'],
      ['Zamkniete', 'Zamknięte', 'off'],
    ],
  },
  'hg-arc-card': {
    entity: 'light.salon',
    variants: [
      ['Jasno', 'Jasno', 'on', { brightness: 250 }],
      ['Ciemno', 'Ciemno', 'on', { brightness: 40 }],
      ['Off', 'Wyłączony', 'off'],
    ],
  },
  'hg-progress-card': {
    entity: 'sensor.energia',
    variants: [
      ['Srodek', 'Środek', '62'],
      ['Wysoko', 'Wysoko', '92'],
      ['Nisko', 'Nisko', '8'],
    ],
  },
  'hg-gauge-card': {
    entity: 'sensor.bateria',
    variants: [
      ['Ok', 'W normie', '76'],
      ['Nisko', 'Nisko', '12'],
    ],
  },
  'hg-battery-card': {
    entity: 'sensor.bateria',
    variants: [
      ['Ok', 'W normie', '76'],
      ['Nisko', 'Nisko', '9'],
    ],
  },
  'hg-value-card': {
    entity: 'sensor.temp',
    variants: [
      ['Normalna', 'Normalna', '22.5'],
      ['Wysoka', 'Wysoka', '28.4'],
    ],
  },
  'hg-stat-card': {
    entity: 'sensor.solar',
    variants: [
      ['Dzien', 'Dzień', '12.4'],
      ['Noc', 'Noc', '0'],
    ],
  },
  'hg-slider-card': {
    entity: 'input_number.jasnosc',
    variants: [
      ['Nisko', 'Nisko', '15'],
      ['Wysoko', 'Wysoko', '90'],
    ],
  },
  'hg-stepper-card': {
    entity: 'number.term',
    variants: [
      ['Nisko', 'Nisko', '18'],
      ['Wysoko', 'Wysoko', '24'],
    ],
  },
  'hg-select-card': {
    entity: 'select.tryb',
    variants: [
      ['Auto', 'Auto', 'auto'],
      ['Eco', 'Eco', 'eco'],
      ['Boost', 'Boost', 'boost'],
    ],
  },
  'hg-todo-card': {
    entity: 'todo.zakupy',
    variants: [
      ['Otwarte', 'Otwarte', '2'],
      ['Puste', 'Puste', '0'],
    ],
  },
  'hg-areas-card': {
    variants: [
      ['Aktywne', 'Aktywne', null],
      ['Cisza', 'Cisza', null, {}, (h) => {
        const states = { ...h.states };
        for (const id of Object.keys(states)) {
          if (id.startsWith('light.') || id.startsWith('climate.')) states[id] = { ...states[id], state: 'off' };
        }
        return { ...h, states };
      }],
    ],
  },
  'hg-hero-card': {
    config: { studio: true, status: true },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-scenes-card': {
    config: {
      scripts: [
        { entity: 'scene.wieczor', name: 'Wieczór', icon: 'mdi:weather-night' },
        { entity: 'scene.film', name: 'Film', icon: 'mdi:movie-open' },
        { entity: 'script.dobranoc', name: 'Dobranoc', icon: 'mdi:sleep' },
      ],
    },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-actions-card': {
    variants: [['Dane', 'Dane', null]],
  },
  'hg-room-compact-card': {
    config: { name: 'Salon', temperature: 'sensor.temp', humidity: 'sensor.wilg', entity: 'light.salon' },
    entity: 'light.salon',
    variants: [
      ['Wlaczony', 'Włączony', 'on'],
      ['Wylaczony', 'Wyłączony', 'off'],
    ],
  },
  'hg-studio-home-card': {
    config: { lock: 'lock.drzwi', temperature: 'sensor.temp', tier: 'expanded' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-studio-energy-card': {
    entity: 'sensor.daily',
    config: { entity: 'sensor.daily', tier: 'expanded' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-chart-card': {
    entity: 'sensor.solar',
    config: { entity: 'sensor.solar', tone: 'solar' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-family-card': { variants: [['Dane', 'Dane', null]] },
  'hg-airq-card': {
    config: { entities: ['sensor.pm25', 'sensor.co2', 'sensor.wilg'] },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-button-card': {
    entity: 'script.film',
    config: { mode: 'tile' },
    variants: [
      ['Skrypt', 'Skrypt', 'off', {}, null, 'script.film'],
      ['Scena', 'Scena', 'scening', {}, null, 'scene.wieczor'],
      ['Przycisk', 'Przycisk', 'unknown', {}, null, 'button.dzwonek'],
      ['Swiatlo', 'Światło włączone', 'on', { brightness: 200 }, null, 'light.salon'],
      ['Niedostepny', 'Niedostępny', 'unavailable', {}, null, 'light.salon'],
    ],
  },
  'hg-script-card': {
    entity: 'script.dobranoc',
    variants: [
      ['Gotowy', 'Gotowy', 'off'],
      ['Dziala', 'Działa', 'on'],
      ['Niedostepny', 'Niedostępny', 'unavailable'],
    ],
  },
  'hg-link-card': {
    config: { title: 'Home Assistant', subtitle: 'Dokumentacja', icon: 'mdi:home-assistant', action: { action: 'url', url_path: 'https://www.home-assistant.io' } },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-note-card': {
    config: { title: 'Notatka', icon: 'mdi:note-text-outline', text: '**Zakupy**\n- mleko\n- chleb\n\nKod do bramy: `4821`' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-image-card': {
    config: { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', title: 'Salon', fit: 'cover' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-agenda-card': {
    config: { calendars: ['calendar.dom'], days: 14 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-month-card': {
    config: { calendars: ['calendar.dom'] },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-entities-card': {
    config: { entities: ['light.salon', 'switch.kuchnia', 'sensor.temp', 'lock.drzwi'] },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-history-card': {
    config: { entities: ['sensor.temp', 'sensor.solar'], title: 'Historia' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-eprice-card': {
    entity: 'sensor.cena',
    config: { entity: 'sensor.cena', window: 3 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-flow-card': {
    config: { grid: 'sensor.grid', solar: 'sensor.pv', home: 'sensor.dom', battery: 'sensor.batt', battery_soc: 'sensor.bateria' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-energy-card': {
    config: { entities: ['sensor.l1', 'sensor.l2', 'sensor.l3'], max_power: 5000 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-power-card': {
    config: { entities: ['sensor.l1', 'sensor.l2', 'sensor.l3'], max_power: 5000, hours: 6 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-phases-card': {
    config: {
      phases: [
        { name: 'L1', power: 'sensor.l1', voltage: 'sensor.u1', current: 'sensor.i1' },
        { name: 'L2', power: 'sensor.l2', voltage: 'sensor.u2', current: 'sensor.i2' },
        { name: 'L3', power: 'sensor.l3', voltage: 'sensor.u3', current: 'sensor.i3' },
      ],
      max_power: 5000,
      phase_max: 2000,
    },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-yield-card': {
    config: { entities: ['sensor.yield0', 'sensor.yield1', 'sensor.yield2'], capacity: 6, title: 'Prognoza PV' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-fuel-card': {
    config: { title: 'Paliwo', fuel: [{ label: 'PB95', entity: 'sensor.paliwo' }, { label: 'ON', entity: 'sensor.on' }] },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-stairs-card': {
    config: {
      stairs: {
        group: 'light.a',
        automation: 'automation.schody',
        bottom: { light: 'light.a', motion: 'binary_sensor.ruch' },
        top: { light: 'light.k', motion: 'binary_sensor.drzwi' },
      },
    },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-appliance-card': {
    entity: 'switch.pralka',
    config: { entity: 'switch.pralka' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-room-card': {
    config: { room: 'salon' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-net-card': {
    config: {
      section: 'wan',
      net: {
        gateway: { state: 'sensor.wan', tracker: 'device_tracker.telefon', uptime: 'sensor.uptime' },
        wan: {
          latency: [{ name: '1.1.1.1', entity: 'sensor.ping' }],
          down: 'sensor.down',
          up: 'sensor.up',
          ping: 'sensor.ping',
        },
      },
    },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-week-card': {
    config: { consumption: ['sensor.daily'], production: ['sensor.solar'], days: 7 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-solar-card': {
    config: { statistic: 'sensor.solar', today_entity: 'sensor.solar', days: 7 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-pv-card': {
    config: { power: 'sensor.pv', today: 'sensor.solar', state: 'sensor.inverter', temperature: 'sensor.temp' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-bars-card': {
    config: { statistics: ['sensor.daily'], labels: ['Sieć'], days: 7 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-energy-stats-card': {
    config: { consumption: 'sensor.daily', production: 'sensor.solar', price: 0.85 },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-people-card': {
    config: { persons: ['person.anna', 'person.marek', 'person.zosia'] },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-plant-card': {
    entity: 'plant.monstera',
    config: { entity: 'plant.monstera', moisture: 'sensor.ziemia', battery: 'sensor.bateria' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-logbook-card': {
    config: { entities: ['light.salon', 'lock.drzwi', 'binary_sensor.okno', 'cover.roleta'] },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-map-card': {
    config: { entities: ['person.anna', 'person.marek', 'person.zosia'], theme_mode: 'auto' },
    variants: [['Dane', 'Dane', null]],
  },
  'hg-hint-card': {
    config: { icon: 'mdi:sofa-outline', t: 'Pokoje', s: 'Przykładowa podpowiedź', d: 'Dodaj pokoje, żeby pulpit pokazał zdjęcia i temperaturę.' },
    variants: [['Dane', 'Dane', null]],
  },
};
