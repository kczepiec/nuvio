**English** · [Polski](pl/components.md) · [Français](fr/components.md)

# Components

Nuvio ships its cards as custom elements. This page lists every card, its entities and its options. Back to the [README](../README.md).

Every card can be used on its own as `custom:nuvio-<name>-card` (for example in a regular dashboard after *Take control*). Screenshots: dark theme, default background, demo data.

<details open>
<summary><b>Climate and air</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/climate.webp" alt="Air conditioning" width="100%"><br><b>Air conditioning</b> <code>tile</code><br>Temperature, modes and fan.</td>
<td width="50%" valign="top"><img src="components/ac.webp" alt="Air conditioning (card)" width="100%"><br><b>Air conditioning (card)</b> <code>custom:nuvio-ac-card</code><br>Large card: temperature, modes, fan, schedule.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/acremote.webp" alt="AC remote" width="100%"><br><b>AC remote</b> <code>custom:nuvio-acremote-card</code><br>Live airflow, setpoint, mode, fan and sleep.</td>
<td width="50%" valign="top"><img src="components/thermo.webp" alt="Thermostat" width="100%"><br><b>Thermostat</b> <code>custom:nuvio-thermo-card</code><br>Target temperature up and down and modes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/humid.webp" alt="Humidifier" width="100%"><br><b>Humidifier</b> <code>custom:nuvio-humidifier-card</code><br>Target humidity on an arc and modes.</td>
<td width="50%" valign="top"><img src="components/purifier.webp" alt="Air purifier" width="100%"><br><b>Air purifier</b> <code>custom:nuvio-purifier-card</code><br>PM2.5 with air waves, power and modes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/airq.webp" alt="Air quality" width="100%"><br><b>Air quality</b> <code>custom:nuvio-airq-card</code><br>CO₂, particulates, VOC and humidity with coloured thresholds.</td>
<td width="50%" valign="top"><img src="components/fan.webp" alt="Fan" width="100%"><br><b>Fan</b> <code>custom:nuvio-fan-card</code><br>Speed on an arc and modes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/plant.webp" alt="Plant" width="100%"><br><b>Plant</b> <code>custom:nuvio-plant-card</code><br>Soil moisture, light and fertility with ranges.</td>
<td width="50%" valign="top"><img src="components/weather.webp" alt="Weather" width="100%"><br><b>Weather</b> <code>custom:nuvio-weather-card</code><br>Now, hourly forecast, sun.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/sun.webp" alt="Sun" width="100%"><br><b>Sun</b> <code>custom:nuvio-sun-card</code><br>Sunrise, sunset and sun position.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Lights and devices</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/switch.webp" alt="Light / switch" width="100%"><br><b>Light / switch</b> <code>tile</code><br>Turn on and off with one tap.</td>
<td width="50%" valign="top"><img src="components/light.webp" alt="Light with brightness" width="100%"><br><b>Light with brightness</b> <code>custom:nuvio-lamp-card</code><br>Switch, brightness slider, quick levels and colour temperature.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/toggle.webp" alt="Toggle tile" width="100%"><br><b>Toggle tile</b> <code>custom:nuvio-toggle-card</code><br>Name, state and switch in a row.</td>
<td width="50%" valign="top"><img src="components/slider.webp" alt="Slider" width="100%"><br><b>Slider</b> <code>custom:nuvio-slider-card</code><br>Brightness, volume, fan, cover, number.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/arc.webp" alt="Arc" width="100%"><br><b>Arc</b> <code>custom:nuvio-arc-card</code><br>Brightness or level on a draggable arc.</td>
<td width="50%" valign="top"><img src="components/cover.webp" alt="Cover / gate" width="100%"><br><b>Cover / gate</b> <code>tile</code><br>Open, stop, close.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/cover2.webp" alt="Cover with position" width="100%"><br><b>Cover with position</b> <code>custom:nuvio-cover-card</code><br>Draggable bar and buttons.</td>
<td width="50%" valign="top"><img src="components/lock.webp" alt="Lock" width="100%"><br><b>Lock</b> <code>custom:nuvio-lock-card</code><br>Unlock with confirmation.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/smartlock.webp" alt="Smart lock" width="100%"><br><b>Smart lock</b> <code>custom:nuvio-smartlock-card</code><br>Animated padlock, hold to unlock, battery and door.</td>
<td width="50%" valign="top"><img src="components/vacuum.webp" alt="Vacuum" width="100%"><br><b>Vacuum</b> <code>custom:nuvio-vacuum-card</code><br>One robot: state, battery, start and dock.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/robots.webp" alt="Robots" width="100%"><br><b>Robots</b> <code>custom:nuvio-robots-card</code><br>Vacuums and mowers: status and control.</td>
<td width="50%" valign="top"><img src="components/appliance.webp" alt="Appliance" width="100%"><br><b>Appliance</b> <code>custom:nuvio-appliance-card</code><br>Washer, dryer, dishwasher: state, program, time left, progress.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/cwu.webp" alt="Hot water" width="100%"><br><b>Hot water</b> <code>custom:nuvio-cwu-card</code><br>Temperature, heating, power, time and heater switches.</td>
<td width="50%" valign="top"><img src="components/stairs.webp" alt="Stairs" width="100%"><br><b>Stairs</b> <code>custom:nuvio-stairs-card</code><br>Bottom and top light sequence with motion sensors.</td>
</tr>
</table>
</details>

<details open>
<summary><b>Scenes and actions</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/run.webp" alt="Scene / script" width="100%"><br><b>Scene / script</b> <code>tile</code><br>One button to run it.</td>
<td width="50%" valign="top"><img src="components/scenes.webp" alt="Scenes and scripts" width="100%"><br><b>Scenes and scripts</b> <code>custom:nuvio-scenes-card</code><br>Several buttons in one card.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/button.webp" alt="Button" width="100%"><br><b>Button</b> <code>custom:nuvio-button-card</code><br>Script, scene, button.press or action.</td>
<td width="50%" valign="top"><img src="components/actions.webp" alt="Quick actions" width="100%"><br><b>Quick actions</b> <code>custom:nuvio-actions-card</code><br>A row of round buttons.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/link.webp" alt="Shortcut" width="100%"><br><b>Shortcut</b> <code>custom:nuvio-link-card</code><br>Tile with a title that opens a view or page.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Energy</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/power.webp" alt="Power now" width="100%"><br><b>Power now</b> <code>custom:nuvio-power-card</code><br>Current value with a bar and a line for recent hours: power, energy or a forecast. Options: chart caption, hide the chart labels, bar scale end, level label, [forecast chart](#forecast-chart) (for example 7 days of Solcast).</td>
<td width="50%" valign="top"><img src="components/energy.webp" alt="Energy – statistics" width="100%"><br><b>Energy – statistics</b> <code>custom:nuvio-energy-stats-card</code><br>Consumption and production: today, week, month.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/week.webp" alt="Energy · week" width="100%"><br><b>Energy · week</b> <code>custom:nuvio-week-card</code><br>Consumption and production bars for recent days.</td>
<td width="50%" valign="top"><img src="components/phases.webp" alt="Phases" width="100%"><br><b>Phases</b> <code>custom:nuvio-phases-card</code><br>Power, voltage and current per phase.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/pv.webp" alt="Solar" width="100%"><br><b>Solar</b> <code>custom:nuvio-pv-card</code><br>Power, today, strings and inverter.</td>
<td width="50%" valign="top"><img src="components/flow.webp" alt="Energy flow" width="100%"><br><b>Energy flow</b> <code>custom:nuvio-flow-card</code><br>Grid, solar, batteries and home with animated flow.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/eprice.webp" alt="Electricity price" width="100%"><br><b>Electricity price</b> <code>custom:nuvio-eprice-card</code><br>Hourly prices today and tomorrow, cheapest window.</td>
<td width="50%" valign="top"><img src="components/fuel.webp" alt="Fuel prices" width="100%"><br><b>Fuel prices</b> <code>custom:nuvio-fuel-card</code><br>Prices from sensors with a trend for tomorrow.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/yield.webp" alt="Production forecast" width="100%"><br><b>Production forecast</b> <code>custom:nuvio-yield-card</code><br>Expected energy for the coming days, good and poor days.</td>
<td width="50%" valign="top"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Media and cameras</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/media1.webp" alt="Media player" width="100%"><br><b>Media player</b> <code>tile</code><br>Artwork, title and controls.</td>
<td width="50%" valign="top"><img src="components/players.webp" alt="Media" width="100%"><br><b>Media</b> <code>custom:nuvio-players-card</code><br>Player list with volume.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/mediamini.webp" alt="Mini player" width="100%"><br><b>Mini player</b> <code>custom:nuvio-media-mini-card</code><br>Artwork, title and buttons in one row.</td>
<td width="50%" valign="top"><img src="components/cam1.webp" alt="Camera" width="100%"><br><b>Camera</b> <code>tile</code><br>Snapshot and live view.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/cameras.webp" alt="Camera grid" width="100%"><br><b>Camera grid</b> <code>custom:nuvio-cameras-card</code><br>All selected cameras at once.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Rooms and people</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/rooms.webp" alt="Rooms" width="100%"><br><b>Rooms</b> <code>custom:nuvio-areas-card</code><br>Room tiles with temperature, humidity and active devices (Look → Rooms).</td>
<td width="50%" valign="top"><img src="components/room.webp" alt="Room" width="100%"><br><b>Room</b> <code>custom:nuvio-room-card</code><br>All devices of one room in sections.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/roomc.webp" alt="Compact room" width="100%"><br><b>Compact room</b> <code>custom:nuvio-room-compact-card</code><br>Temperature, switch and brightness ruler.</td>
<td width="50%" valign="top"><img src="components/people.webp" alt="People" width="100%"><br><b>People</b> <code>custom:nuvio-people-card</code><br>Who is home, zones and time.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/person.webp" alt="Person" width="100%"><br><b>Person</b> <code>custom:nuvio-person-card</code><br>Photo, zone and time since change.</td>
<td width="50%" valign="top"><img src="components/family.webp" alt="Family (avatars)" width="100%"><br><b>Family (avatars)</b> <code>custom:nuvio-family-card</code><br>Avatars and who is home.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/hero.webp" alt="Greeting" width="100%"><br><b>Greeting</b> <code>custom:nuvio-hero-card</code><br>Large greeting with your name.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Sensors and charts</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/sensor.webp" alt="Sensor reading" width="100%"><br><b>Sensor reading</b> <code>tile</code><br>Value or state of any sensor.</td>
<td width="50%" valign="top"><img src="components/chart.webp" alt="Sensor with chart" width="100%"><br><b>Sensor with chart</b> <code>tile</code><br>Value and chart for the last 24 h.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/chart2.webp" alt="Chart" width="100%"><br><b>Chart</b> <code>custom:nuvio-chart-card</code><br>Line, area or bars from history.</td>
<td width="50%" valign="top"><img src="components/history.webp" alt="History graph" width="100%"><br><b>History graph</b> <code>custom:nuvio-history-card</code><br>Several sensors on one chart.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/stat.webp" alt="Statistics" width="100%"><br><b>Statistics</b> <code>custom:nuvio-stat-card</code><br>Minimum, average, maximum and change.</td>
<td width="50%" valign="top"><img src="components/gauge.webp" alt="Gauge" width="100%"><br><b>Gauge</b> <code>custom:nuvio-gauge-card</code><br>Sensor value on an arc.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/progress.webp" alt="Progress bar" width="100%"><br><b>Progress bar</b> <code>custom:nuvio-progress-card</code><br>A value on a thick bar with thresholds.</td>
<td width="50%" valign="top"><img src="components/value.webp" alt="Big value" width="100%"><br><b>Big value</b> <code>custom:nuvio-value-card</code><br>One number with colour thresholds.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/sensors.webp" alt="Home sensors" width="100%"><br><b>Home sensors</b> <code>custom:nuvio-sensors-card</code><br>Motion, doors, windows, smoke, leaks: tabs and history.</td>
<td width="50%" valign="top"><img src="components/openings.webp" alt="Doors and windows" width="100%"><br><b>Doors and windows</b> <code>custom:nuvio-openings-card</code><br>Opening sensors, open ones first.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/battery.webp" alt="Batteries" width="100%"><br><b>Batteries</b> <code>custom:nuvio-battery-card</code><br>Weakest batteries first.</td>
<td width="50%" valign="top"><img src="components/alarm.webp" alt="Alarm" width="100%"><br><b>Alarm</b> <code>custom:nuvio-alarm-card</code><br>Arm and disarm with a code.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/net.webp" alt="Network" width="100%"><br><b>Network</b> <code>custom:nuvio-net-card</code><br>Internet, gateway, Wi-Fi, devices, clients (UniFi and others).</td>
<td width="50%" valign="top"><img src="components/updates.webp" alt="Updates" width="100%"><br><b>Updates</b> <code>custom:nuvio-updates-card</code><br>Available Home Assistant updates.</td>
</tr>
</table>
</details>

<details open>
<summary><b>Lists, time and notes</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="components/entities.webp" alt="Entity list" width="100%"><br><b>Entity list</b> <code>custom:nuvio-entities-card</code><br>Rows with a toggle or value.</td>
<td width="50%" valign="top"><img src="components/glance.webp" alt="Glance" width="100%"><br><b>Glance</b> <code>custom:nuvio-glance-card</code><br>Several entities in a row: icon, name, state.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/select.webp" alt="Select" width="100%"><br><b>Select</b> <code>custom:nuvio-select-card</code><br>input_select and select options.</td>
<td width="50%" valign="top"><img src="components/stepper.webp" alt="Stepper" width="100%"><br><b>Stepper</b> <code>custom:nuvio-stepper-card</code><br>Plus and minus for counters and values.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/agenda.webp" alt="Calendar" width="100%"><br><b>Calendar</b> <code>custom:nuvio-agenda-card</code><br>Agenda or month view.</td>
<td width="50%" valign="top"><img src="components/logbook.webp" alt="Logbook" width="100%"><br><b>Logbook</b> <code>custom:nuvio-logbook-card</code><br>Recent changes of chosen entities.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/todo.webp" alt="To-do list" width="100%"><br><b>To-do list</b> <code>custom:nuvio-todo-card</code><br>Add and tick off.</td>
<td width="50%" valign="top"><img src="components/timer.webp" alt="Timer" width="100%"><br><b>Timer</b> <code>custom:nuvio-timer-card</code><br>Countdown on an arc, start and pause.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="components/clock.webp" alt="Clock" width="100%"><br><b>Clock</b> <code>custom:nuvio-clock-card</code><br>Time and date.</td>
<td width="50%" valign="top"><img src="components/note.webp" alt="Note" width="100%"><br><b>Note</b> <code>custom:nuvio-note-card</code><br>Text with simple formatting.</td>
</tr>
</table>
</details>

**Other cards**

Every screenshot above is the same size (dark theme, default background, demo data). These cards have no screenshot:

- `custom:nuvio-map-card`: the native HA map in a glass frame (map tiles need internet access).
- `custom:nuvio-image-card` and `custom:nuvio-webpage-card`: your own image, camera snapshot or page in a frame.
- `custom:nuvio-kid-card`: child (LiveKid) presence, check-in, meals and balance; it needs the LiveKid integration.
- `custom:nuvio-studio-card`: the Studio view's free widget grid (drag, resize, add and hide widgets; see [Studio view](features.md#studio-view-beta)).
- `custom:nuvio-studio-climate-card`, `custom:nuvio-studio-energy-card` and `custom:nuvio-studio-home-card`: Studio widgets for climate (target dial, mode, fan), energy (day, week and month kWh with change) and home (lights, lock, cameras online, temperature). Each switches between compact, medium and expanded layouts by its own size.
- Studio mode (`studio: true`) of the greeting, weather (`hourly`), media (`now_playing`), cameras (`thumbs`, `max`, `view_all`) and scenes (`tiles`, `add`) cards.
- `custom:nuvio-energy-card`: load percentage of the total phase power against your maximum.
- `custom:nuvio-bars-card`: daily consumption bars from statistics.
- `custom:nuvio-page`: the full-screen layout itself (top bar, rail, header, card panel).

## Air, plants and electricity prices (2.15.0)

| Card | What it does | Options |
|---|---|---|
| `custom:nuvio-airq-card` | CO₂, PM2.5, PM10, VOC, NO₂, AQI and humidity as tiles with good, moderate, poor or bad levels and an overall rating | `entities` (empty = one sensor of each kind, from one room when possible), `title` |
| `custom:nuvio-plant-card` | Soil moisture, light, temperature and fertility with the good range as a band, what the plant needs, and the sensor battery | `entity` (`plant.*`, optional), `moisture`, `illuminance`, `temperature`, `conductivity`, `battery` (empty = same device as the moisture sensor), `name`, `image`, `min_*` / `max_*` per reading |
| `custom:nuvio-eprice-card` | Current electricity price with a cheap, average or expensive label, hourly or 15 minute bars for today and tomorrow, and the cheapest window | `entity` (sensor with `today` / `tomorrow`, `raw_today`, `prices_today` or `prices` lists), `title`, `window` (hours, 3), `decimals` (2), `unit` |

## More cards and the form library (1.2.0)

Seven new cards in **+ Add**, each with a live preview and a form. They follow the Home Assistant cards of the same name, in Nuvio glass.

| Card | What it does | Options |
|---|---|---|
| `custom:nuvio-conditional-card` | Shows its cards only when the conditions are met (in edit mode they are always shown) | `cards`, `conditions` (`state`, `state_not`, `numeric_state` with `above` / `below`, `screen` with `media_query`, `user` with `users`, `and`, `or`) |
| `custom:nuvio-glance-card` | Several entities in a row: icon, name and state; tap opens more info | `entities`, `title`, `columns`, `show_name`, `show_state` |
| `custom:nuvio-stat-card` | Minimum, average, maximum and change of a sensor with a sparkline, for 24 hours, 7 or 30 days | `entity`, `name`, `icon`, `hours`, `decimals` |
| `custom:nuvio-humidifier-card` | Target humidity on an arc, current humidity and mode pills | `entity`, `name` |
| `custom:nuvio-purifier-card` | Air purifier: large PM2.5 reading that counts to the new value, air-quality label, air waves around the number (faster in Turbo, slower in Sleep), power and modes with a sliding highlight | `entity` (fan), `pm` (PM2.5 sensor, auto), `name`, `title`, `modes` |
| `custom:nuvio-smartlock-card` | Smart lock: animated padlock in a round button (the shackle lifts when unlocked), hold to unlock with a filling ring, tap to lock, spinning arc while the lock moves, pulse after a change, shake when jammed, battery and door sensor from the same device, open door button when the lock supports it | `entity`, `door`, `battery` (auto), `name`, `title`, `hold` |
| `custom:nuvio-timer-card` | Remaining time of a `timer` on an arc, with start, pause and cancel | `entity`, `name`, `icon` |
| `custom:nuvio-logbook-card` | Recent changes of chosen entities with relative times | `entities`, `title`, `hours`, `max` |
| `custom:nuvio-webpage-card` | Any `https://`, `http://` or `/local/` address in a frame | `url`, `title`, `aspect_ratio` or `height` |

The component forms now use one form library (`hgForm`): text fields, number fields, text areas (code style for YAML and JSON), glass switches, glass selects and a collapsible *Advanced* section, so no browser checkbox, datalist or disclosure triangle is left.

## Layout containers (1.1.0)

Grid, vertical stack and horizontal stack work like in Home Assistant, but in Nuvio glass. They are the first group in **+ Add**, under *Layout*. The form of a container lists its cards: add any component, tile or card from HA, edit a card in its own form, drag to reorder, duplicate, remove, and in a grid set how many columns a card spans. Containers can be nested up to three levels. A card on the panel can be moved into a container from its form, and a card inside a container can be moved back out to the panel.

**Card from HA (YAML)** takes the YAML (or JSON) that the Home Assistant card editor shows under *Show code editor*. A `grid`, `vertical-stack` or `horizontal-stack` becomes the matching Nuvio container with the same cards, any other card is shown as it is. The same conversion happens for these types in the Nuvio page config; add `keep_ha: true` to keep the original Home Assistant card. An example is in [examples/containers.yaml](examples/containers.yaml).

| Card | What it does | Options |
|---|---|---|
| `custom:nuvio-grid-card` | Cards in columns; fewer columns on narrow screens | `cards`, `columns` (1 to 6, 0 = automatic), `min_width`, `square`, `gap`, `glass`, `title`; per card `span` |
| `custom:nuvio-stack-card` | Cards one below another or side by side in one glass; side by side turns vertical below `wrap_below` px | `cards`, `direction`, `gap`, `ratio` (e.g. `[2, 1]`), `wrap_below`, `divider`, `glass`, `title` |

Order (2.21.1): containers and YAML cards added in the editor stay where you put them. Before, the panel filled gaps with smaller cards, so a wide stack or grid could end up above cards added before it. Drag to reorder as usual. Since 2.21.1 normal tiles are separate cards too (without grid areas), so tiles and containers can be mixed in any order.

**Weather** as a component has a **Hero style** switch (YAML `variant: hero`): large white text right on the wallpaper, without a card, like the header weather. Best with **Panel background** off.

## Generic cards and containers (0.16.0)

Twelve cards built only from the shared glass blocks, so they look like the reference design and work with any entity of the right domain. Each one adapts to its width: small (up to 220 px) hides secondary text, large (from 420 px) shows extra detail. They also work in a regular Home Assistant view, where they blur the background themselves. A ready dashboard built only from them is in [examples/inspiration-dashboard.yaml](examples/inspiration-dashboard.yaml) (works with the HA demo integration).

<img src="components/generic-dashboard.webp" alt="Sample dashboard built from the generic cards" width="100%">

| Card | What it shows | Main options |
|---|---|---|
| `custom:nuvio-hero-card` | Large greeting with the signed-in person's first name and a tagline, optional photo and one state | `title` (`{name}`), `subtitle`, `image`, `entity` |
| `custom:nuvio-toggle-card` | One device in a row: icon, name and state, switch, ⋮ menu | `entity`, `name`, `icon` |
| `custom:nuvio-progress-card` | A value on a thick lime bar, orange or red above thresholds | `entity`, `min`, `max`, `warn`, `bad`, `unit` |
| `custom:nuvio-arc-card` | Brightness, speed, position, volume or a number on a draggable arc | `entity` (light, fan, cover, media player, number) |
| `custom:nuvio-chart-card` | Area, line or bars from any numeric sensor's history, with the latest value | `entity`, `hours`, `style: area / line / bars`, `tone: solar` |
| `custom:nuvio-room-compact-card` | Temperature, humidity, a switch and a brightness ruler | `name`, `temperature`, `humidity`, `entity` |
| `custom:nuvio-actions-card` | A glass pill of round buttons for scenes, scripts, services or links | `actions: [{ entity }, { icon, name, service, data }, { navigate }]` |
| `custom:nuvio-family-card` | Avatars, who is home, a button to add a person | `persons` (empty = everyone) |
| `custom:nuvio-cover-card` | Cover or gate position on a draggable bar, open, stop, close; without a position (gate, garage) the state in words; icon by device class | `entity` |
| `custom:nuvio-lock-card` | Lock state; unlocking asks for confirmation, or for the code when the lock needs one | `entity`, `confirm` |
| `custom:nuvio-fan-card` | Fan speed on the arc and preset modes as pills | `entity` |
| `custom:nuvio-todo-card` | A to-do list: add a task, tick it off | `entity`, `show_done` |
| `custom:nuvio-stack-card` | Several cards in one glass, vertical or horizontal (Nuvio and regular HA cards) | `cards`, `direction`, `glass`, `title` |
| `custom:nuvio-tabs-card` | Pills (Dashboard / Rooms / Devices) that switch between sets of cards | `tabs: [{ label, icon, cards }]` |

All of them are also in the *Add component* gallery of the Nuvio editor.

## Rooms, appliances and Home Glass parity (0.7.0)

All of these are in **+ Add** in edit mode, with a preview, a full settings form and an **Advanced configuration (JSON)** field for any other card option (labels, colours, thresholds, actions). Everything is stored in the layout, so Layout backup export and import carry it.

| Component | Card | Settings in the form |
|---|---|---|
| Rooms | `custom:nuvio-areas-card` | room view path; names, icons, order, temperature and humidity sensors and custom rooms come from Appearance, Rooms |
| Room | `custom:nuvio-room-card` | the room to show (or the room from the address) |
| Appliance | `custom:nuvio-appliance-card` | any entity of the device; washer, dryer and dishwasher show state, program, time left and progress |
| Hot water | `custom:nuvio-cwu-card` | water heater, heating state, power, time to heat, consumption, keep temperature, switches |
| Stairs | `custom:nuvio-stairs-card` | bottom and top light and motion sensor, light group, sequence automation |
| Fuel prices | `custom:nuvio-fuel-card` | price sensors with labels and an optional tomorrow change sensor |
| Air conditioning (card) | `custom:nuvio-ac-card` | climate entity, title |
| AC remote | `custom:nuvio-acremote-card` | climate entity, title |
| Energy week | `custom:nuvio-week-card` | consumption and production sensors, days, tap target |
| Phases | `custom:nuvio-phases-card` | power, voltage and current per phase, maximum total and per phase power |
| Solar | `custom:nuvio-pv-card` | power, today, inverter state and temperature, strings |
| Energy flow | `custom:nuvio-flow-card` | grid power (+ import, − export, several sensors are summed, e.g. phases) or separate export sensors, solar power (several are summed, e.g. inverters), batteries each on their own (`battery` and `battery_soc` lists in the same order, or `batteries: [{ power, soc, name }]`, up to 4), home usage (empty = from the balance), invert grid or battery sign |
| Network | `custom:nuvio-net-card` | section (internet, gateway, Wi-Fi, devices, clients), title |
| Home sensors | `custom:nuvio-sensors-card` | device classes, extra and skipped sensors |
| Shortcut | `custom:nuvio-link-card` | title, subtitle, entity, path or URL to open |
| Person | `custom:nuvio-person-card` | person, home and away labels |
| Child (LiveKid) | `custom:nuvio-kid-card` | title, child (name) or entity when there are several children; entities of the LiveKid integration are found automatically |

**Appearance, Rooms**: rename rooms, set icons and order, hide rooms, choose the temperature and humidity sensor for each room tile (automatic, any sensor, or none), and create custom rooms with any entities, independent of Home Assistant areas. Entities can also be assigned by hand to existing rooms. Each climate device in the room also has **Activity detection**. **Automatic** (default) uses the **Actual state** entity (on/off, or a value such as power above the **Running threshold**, 5 W by default), then what the device reports itself (`hvac_action`), then the room temperature against the setpoint if you pick a separate room sensor (an estimate with a 0.5° hysteresis by default). Otherwise only the mode is shown (for example **Heating**), so a device that reports nothing is never shown as idle. **From an entity**, **From room temperature** and **Show mode only** use just that source. The device's own temperature is never used for this. The dot on the Rooms tile has the colour of the mode (heating, cooling, drying, fan, auto): solid when the device is running, dimmed when it is not running or the state is an estimate, and only outlined when only the mode is known. The settings are stored next to the room sensors (`state:`, `src:`, `thr:`, `temp:` and `hys:` followed by the climate entity id), so export and import carry them and older versions ignore them.

**Appearance, Header and navigation**: household title and subtitle (or no household strip), fuel prices in the dashboard header, and the four views on the phone bar.

**Appearance, Background gallery**: add your own images by `/local/` or `https://` address; they show up in Background and in the wall tablet slideshow.

**Appearance, Header and navigation** (0.8.0) also has: the weather entity for the header and an optional sensor with a `forecast` attribute for the hourly strip, the household strip position (left or next to the panel), and a per view table with the icon, a short label for the phone bar, desktop and tablet column count (built in views too), whether the view is in the sidebar and its order there. **Background gallery** has a focal point for the current background.

**Settings** (0.9.0): Appearance is now a separate settings panel with tabs: Appearance, Views, Rooms, Header and navigation, Backgrounds, Screensaver and Backup. The view settings table has proper column labels and turns into labelled cards on a phone.

**More components in + Add** (0.9.0): light with brightness, thermostat, big value, history graph, doors and windows, batteries, vacuum, mini player, clock, sun, note, image or page, and updates. Each one has a live preview, form fields and is included in export and import.

## Forecast chart

**Power now** (`custom:nuvio-power-card`) can draw values from a forecast attribute instead of the history. The big value and the bar still show the current state of `entities`.

| Option | Default | Meaning |
| --- | --- | --- |
| `source` | `history` | `forecast` draws the chart from a forecast (the editor switch is `forecast: true`) |
| `forecast_entities` | the card `entities` | entities that carry the forecast; values with the same time are added up |
| `forecast_attribute` | `detailedForecast`, else `detailedHourly`, else `forecast` | attribute with the list of forecast points |
| `forecast_value` | `pv_estimate`, `value` or `temperature` | field with the value in each point |
| `forecast_days` / `forecast_hours` | 1 day | how far ahead to draw; hours win over days |
| `forecast_type` | `hourly` | for `weather.*` entities: `hourly`, `daily` or `twice_daily` |

Each point needs a time in `period_start` (Solcast) or `datetime` (weather). With more than 36 hours the axis shows day names at midnight.

**Solcast PV Forecast** ([BJReplay/ha-solcast-solar](https://github.com/BJReplay/ha-solcast-solar#attributes)): every daily sensor (today, tomorrow, day 3 to day 7) has `detailedForecast` (every 30 minutes) and `detailedHourly` (every hour), a list of `period_start`, `pv_estimate`, `pv_estimate10` and `pv_estimate90`, in kW (average power of the period). Days 3 to 7 are disabled by default in Home Assistant, so enable them first. Entity ids depend on your language (for example `..._prognoza_na_dzisiaj` in Polish); check them in Developer tools.

**Weather** ([weather.get_forecasts](https://www.home-assistant.io/integrations/weather/)): the card calls the action with `return_response` every 5 minutes and reads `forecast[].datetime` and `temperature` (or `forecast_value`, for example `precipitation`).

```yaml
type: custom:nuvio-power-card
title: Solar forecast, 7 days
icon: mdi:solar-power
entities:
  - sensor.solcast_pv_forecast_forecast_today
source: forecast
forecast_days: 7
forecast_entities:
  - sensor.solcast_pv_forecast_forecast_today
  - sensor.solcast_pv_forecast_forecast_tomorrow
  - sensor.solcast_pv_forecast_forecast_day_3
  - sensor.solcast_pv_forecast_forecast_day_4
  - sensor.solcast_pv_forecast_forecast_day_5
  - sensor.solcast_pv_forecast_forecast_day_6
  - sensor.solcast_pv_forecast_forecast_day_7
# forecast_attribute: detailedHourly   # hourly instead of every 30 minutes
# forecast_value: pv_estimate90        # optimistic variant (pv_estimate10 = pessimistic)
```

## Production forecast

**Production forecast** (`custom:nuvio-yield-card`) shows the expected energy for the coming days as bars, one sensor per day: the first sensor is today, the second tomorrow, and so on. Each day is rated **good**, **average** or **poor**. Tap a day for its date, value and rating. Day names follow the Home Assistant time zone.

| Option | Default | What it does |
|---|---|---|
| `entities` | | sensors in day order, the state is the energy of that day. Values in Wh, MWh or GWh are converted to kWh for the rating. An unavailable sensor shows as unavailable |
| `capacity` | none | reference power in kW, a number (`3.4` or `"3,4"`) or an entity in W or kW (also Wp, kWp). With it a day is rated by its energy in kWh per kW. When the entity is unavailable or 0, the card says so under the chart and compares days with the best day |
| `good` / `poor` | `3.5` / `1.5` | with `capacity`: kWh per kW from which a day is good, and below which it is poor. Without `capacity` a day is compared with the best day of the period (75% and more is good, under 40% is poor) |
| `title`, `icon` | | header |
| `unit` | unit of the first sensor with a value | label after the values (values are shown in the unit of that sensor) |
| `decimals` | `1` | decimal places |

```yaml
type: custom:nuvio-yield-card
entities:            # one sensor per day, the first one is today
  - sensor.production_forecast_today
  - sensor.production_forecast_day_2
  - sensor.production_forecast_day_3
  - sensor.production_forecast_day_4
  - sensor.production_forecast_day_5
  - sensor.production_forecast_day_6
  - sensor.production_forecast_day_7
capacity: 3.4        # kW, or an entity such as sensor.installed_power
# good: 3.5          # kWh per kW from which a day is good
# poor: 1.5          # kWh per kW below which a day is poor
```
