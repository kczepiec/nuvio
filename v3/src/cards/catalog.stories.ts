import { mockPort } from '../ha/mock';
import '../ha-entry';

type State = { state: string; attributes: Record<string, unknown> };

function mount(tag: string, config: Record<string, unknown>, states: Record<string, State> = {}) {
  const el = document.createElement(tag) as HTMLElement & {
    setConfig(config: Record<string, unknown>): void;
    port: ReturnType<typeof mockPort>;
  };
  el.style.width = '360px';
  el.setConfig(config);
  el.port = mockPort(states, new EventTarget(), 'Krzysztof');
  return el;
}

const named = (name: string, state = 'on', attributes: Record<string, unknown> = {}): State => ({
  state,
  attributes: { friendly_name: name, ...attributes },
});

const lamp = { 'switch.lamp': named('Lamp') };
const sensor = { 'sensor.temp': named('Temperature', '21.4', { unit_of_measurement: '°C', device_class: 'temperature' }) };

export default { title: 'Cards/Lit' };

export const Light = { render: () => mount('nuvio-light-card', { entity: 'light.kitchen', title: 'Lighting' }, { 'light.kitchen': named('Kitchen', 'on', { brightness: 180 }) }) };
export const Clock = { render: () => mount('nuvio-clock-card', {}) };
export const Switch = { render: () => mount('nuvio-switch-card', { entity: 'switch.lamp' }, lamp) };
export const Value = { render: () => mount('nuvio-value-card', { entity: 'sensor.temp' }, sensor) };
export const Link = { render: () => mount('nuvio-link-card', { name: 'Floor plan', url: '/lovelace/home' }) };
export const Energy = { render: () => mount('nuvio-energy-card', { entity: 'sensor.power' }, { 'sensor.power': named('Power', '420', { unit_of_measurement: 'W', device_class: 'power' }) }) };
export const Hero = { render: () => mount('nuvio-hero-card', { title: 'Good afternoon, Krzysztof' }) };
export const Updates = { render: () => mount('nuvio-updates-card', { entity: 'update.core' }, { 'update.core': named('Core', 'off') }) };
export const Image = { render: () => mount('nuvio-image-card', { url: '/local/room.jpg', title: 'Living room' }) };
export const Note = { render: () => mount('nuvio-note-card', { title: 'Note', content: 'Water the plants.' }) };
export const Sun = { render: () => mount('nuvio-sun-card', { entity: 'sun.sun' }, { 'sun.sun': named('Sun', 'above_horizon') }) };
export const Battery = { render: () => mount('nuvio-battery-card', { entity: 'sensor.phone' }, { 'sensor.phone': named('Phone', '80', { device_class: 'battery', unit_of_measurement: '%' }) }) };
export const Openings = { render: () => mount('nuvio-openings-card', { entities: ['binary_sensor.door'] }, { 'binary_sensor.door': named('Front door', 'off', { device_class: 'door' }) }) };
export const Glance = { render: () => mount('nuvio-glance-card', { entities: [{ entity: 'switch.lamp' }] }, lamp) };
export const Person = { render: () => mount('nuvio-person-card', { entity: 'person.krzysztof' }, { 'person.krzysztof': named('Krzysztof', 'home') }) };
export const Webpage = { render: () => mount('nuvio-webpage-card', { url: 'https://home.czepiec.pl' }) };
export const People = { render: () => mount('nuvio-people-card', { entities: ['person.krzysztof'] }, { 'person.krzysztof': named('Krzysztof', 'home') }) };
export const Family = { render: () => mount('nuvio-family-card', { entities: ['person.krzysztof'] }, { 'person.krzysztof': named('Krzysztof', 'home') }) };
export const Phases = { render: () => mount('nuvio-phases-card', { entity: 'sensor.phase' }, { 'sensor.phase': named('Phase', '2') }) };
export const Gauge = { render: () => mount('nuvio-gauge-card', { entity: 'sensor.temp' }, sensor) };
export const Progress = { render: () => mount('nuvio-progress-card', { entity: 'sensor.temp' }, sensor) };
export const Vacuum = { render: () => mount('nuvio-vacuum-card', { entity: 'vacuum.robot' }, { 'vacuum.robot': named('Robot', 'docked') }) };
export const MediaMini = { render: () => mount('nuvio-media-mini-card', { entity: 'media_player.speaker' }, { 'media_player.speaker': named('Speaker', 'playing', { media_title: 'Morning' }) }) };
export const Script = { render: () => mount('nuvio-script-card', { entity: 'script.goodnight' }, { 'script.goodnight': named('Good night', 'off') }) };
export const Button = { render: () => mount('nuvio-button-card', { entity: 'button.doorbell' }, { 'button.doorbell': named('Doorbell', 'unknown') }) };
export const Actions = { render: () => mount('nuvio-actions-card', { entities: ['script.goodnight'] }, { 'script.goodnight': named('Good night', 'off') }) };
export const Toggle = { render: () => mount('nuvio-toggle-card', { entity: 'switch.lamp' }, lamp) };
export const Entities = { render: () => mount('nuvio-entities-card', { entities: ['switch.lamp', 'sensor.temp'] }, { ...lamp, ...sensor }) };
export const Lamp = { render: () => mount('nuvio-lamp-card', { entity: 'light.kitchen' }, { 'light.kitchen': named('Kitchen', 'on', { brightness: 180 }) }) };
export const Thermo = { render: () => mount('nuvio-thermo-card', { entity: 'climate.living' }, { 'climate.living': named('Living room', 'heat', { current_temperature: 21, temperature: 22 }) }) };
export const Select = { render: () => mount('nuvio-select-card', { entity: 'input_select.scene' }, { 'input_select.scene': named('Scene', 'Day', { options: ['Day', 'Night'] }) }) };
export const Lock = { render: () => mount('nuvio-lock-card', { entity: 'lock.front' }, { 'lock.front': named('Front door', 'locked') }) };
export const Cover = { render: () => mount('nuvio-cover-card', { entity: 'cover.blind' }, { 'cover.blind': named('Blind', 'open', { current_position: 40, device_class: 'blind' }) }) };
export const Slider = { render: () => mount('nuvio-slider-card', { entity: 'light.kitchen' }, { 'light.kitchen': named('Kitchen', 'on', { brightness: 180 }) }) };
export const Stepper = { render: () => mount('nuvio-stepper-card', { entity: 'input_number.volume' }, { 'input_number.volume': named('Volume', '30', { min: 0, max: 100, step: 1 }) }) };
export const RoomCompact = { render: () => mount('nuvio-room-compact-card', { name: 'Kitchen', entities: ['switch.lamp'] }, lamp) };
export const Arc = { render: () => mount('nuvio-arc-card', { entity: 'sensor.temp' }, sensor) };
export const Fan = { render: () => mount('nuvio-fan-card', { entity: 'fan.bedroom' }, { 'fan.bedroom': named('Bedroom', 'on', { percentage: 40 }) }) };
export const Humidifier = { render: () => mount('nuvio-humidifier-card', { entity: 'humidifier.bedroom' }, { 'humidifier.bedroom': named('Bedroom', 'on', { humidity: 45 }) }) };
export const Stat = { render: () => mount('nuvio-stat-card', { entity: 'sensor.temp' }, sensor) };
export const Chart = { render: () => mount('nuvio-chart-card', { entity: 'sensor.temp' }, sensor) };
export const History = { render: () => mount('nuvio-history-card', { entities: ['sensor.temp'] }, sensor) };
export const Timer = { render: () => mount('nuvio-timer-card', { entity: 'timer.oven' }, { 'timer.oven': named('Oven', 'idle') }) };
export const Todo = { render: () => mount('nuvio-todo-card', { entity: 'todo.home' }, { 'todo.home': named('Home', '1') }) };
export const Logbook = { render: () => mount('nuvio-logbook-card', { entities: ['switch.lamp'] }, lamp) };
export const Stack = { render: () => mount('nuvio-stack-card', { title: 'Evening', cards: [{ type: 'custom:nuvio-toggle-card', entity: 'switch.lamp' }] }, lamp) };
export const Grid = { render: () => mount('nuvio-grid-card', { columns: 2, cards: [{ type: 'custom:nuvio-toggle-card', entity: 'switch.lamp' }] }, lamp) };
export const Tabs = { render: () => mount('nuvio-tabs-card', { tabs: [{ label: 'Lights', cards: [{ type: 'custom:nuvio-toggle-card', entity: 'switch.lamp' }] }] }, lamp) };
export const Conditional = { render: () => mount('nuvio-conditional-card', { conditions: [{ entity: 'switch.lamp', state: 'on' }], cards: [{ type: 'custom:nuvio-toggle-card', entity: 'switch.lamp' }] }, lamp) };
