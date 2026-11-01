<p align="center"><b>English</b> · <a href="CHANGELOG.pl.md">Polski</a> · <a href="CHANGELOG.fr.md">Français</a> · <a href="CHANGELOG.nl.md">Nederlands</a></p>

# Changelog

All notable changes to Nuvio are listed here, newest first. Versions follow [semantic versioning](https://semver.org). The Polish changelog is in [CHANGELOG.pl.md](CHANGELOG.pl.md).

### Unreleased
- Added: opt-in **Studio view** (beta), off by default and switched on in **Settings > Views**. It has a mockup-style frame (full-height rail with a light/dark toggle, pill tabs, optional Wi-Fi, Bluetooth and battery icons from a wall tablet, date and time) and a free 2D widget grid of 12 columns (8 on tablets, 4 on phones). In edit mode widgets can be dragged, resized, hidden and added with the "Add widget" tile; other widgets move aside and compact, and every widget has its own minimum and maximum size. The first layout is seeded from your entities, each screen width keeps its own layout, and a saved layout is never regenerated. It is included in the layout backup.
- Added: new **climate**, **energy** and **home** widgets (also in the card picker) that switch between compact, medium and expanded layouts based on their own size.
- Added: Studio modes for the greeting, weather, media, cameras and scenes cards (`studio` option; existing configs render unchanged).
- Added: beta builds such as `2.32.0-beta.1` load their assets from the CDN. `tools/cut-release.sh --pre` and `tools/tag-release.sh --pre` publish a beta pre-release from the current branch.
- Fixed: Studio widgets sit closer to the mockup. Cards on the photo use darker glass and white text, the climate arc stays inside the card, energy bars show from the medium size, media uses a larger cover, lights-on is indigo, and scenes sit in one row.
- Fixed: Studio chrome. The logo shows again, the rail is a rounded bar without the back arrow, and the top-right icons have more space. Wi-Fi and Bluetooth reflect the tablet state and open the entity; the battery icon is gone.
- Fixed: on phones, Studio widgets stack in a single full-width column.
- Fixed: the month calendar and agenda use larger, readable type (including in Studio, without tile scale shrinking the text).
- Changed: fresh Studio layouts for Map, Cameras, Family, Energy and the Robots, Security and Network views (Nuvio widgets and cards only). Updating to seedV 2 replaces each view’s saved layout once.
- Fixed: the seedV Studio migration also runs when a view layout was already saved (previously seed never replaced an existing `studios.*` entry).
- Fixed: Studio hides the top tab row on wide and tablet (rail-only navigation); duplicate grid tiles with the same id are merged on read/save.
- Fixed: seedV migration no longer replaces `custom:1` layouts or auto-saves to the server on every view visit; stale colliding `bps` overrides are dropped so tiles stop stacking.
- Fixed: the Studio grid sits against the rail instead of leaving a gutter, and edit mode adds the same components as the other views.
- Fixed: Studio no longer keeps an empty grid column on the left, and widgets scale with the height of their cell.
- Fixed: Studio edit mode no longer wobbles the whole grid or squeezes widgets to fit the add tile.
- Fixed: Studio edit mode measured the growing card, so each row swelled to thousands of pixels. Row height now comes from the panel.
- Fixed: Studio glass uses stronger blur and separate light and dark tokens (widgets and chrome), so light mode no longer keeps dark frosted cards.
- Fixed: Studio moves edit, Assist, messages, and notifications into the user menu; the rail active indicator uses a softer corner radius.
- Changed: on desktop every view uses the Studio-style layout (full-width panel, rail and tabs aligned with the rail, rounded rail). The narrow/wide panel picker is removed from edit mode and custom views; older `pw` preferences are ignored.
- Changed: Studio widget glass is more transparent with a stronger blur and no inset borders, closer to the mockup weather card.
- Changed: Studio widget grid uses 24px gutters so cards breathe like the mockup.
- Changed: on desktop all views use the same frosted-glass tokens and transparent panel as Studio, not only the Studio view.
- Changed: one layout everywhere (phone, tablet, desktop): legacy narrow panel, `wide-panel`, shared panel glass and **Panel background** in Appearance are removed; cards always carry their own glass with 24px gaps.
- Fixed: layout edit mode on desktop again shows drag handles, **Add component** and the Studio widget grid (panel scrolls inside the page grid instead of being clipped).

### 2.31.0
- Added: the header title and subtitle can show a live entity state with `{state:sensor.your_entity}`, for example a washer's status. The line disappears when the state is empty, `off`, `unavailable` or `unknown`, and the header updates when the entity changes.

### 2.30.2
- Fixed: the **reload pill** no longer shows after an update when the running build is already the newest one.

### 2.30.1
- Fixed: the **Look** settings dialog opened empty or not at all after the night schedule was added. It works again.

### 2.30.0
- Added: **night schedule** for the wall tablet screensaver. Turn it on under Wall tablet mode and the screensaver switches to its own style and dimming during the night, either from sunset to sunrise (sun entity) or between two set hours, which can cross midnight. Off by default; daytime settings stay as they were.
- Added: the screensaver can **wake from a list of sensors** instead of one. Pick several motion, occupancy or presence binary sensors; any of them turning on wakes the screensaver. Existing single-sensor setups migrate automatically.
- Added: **voice assistant** instead of the Assist chat dialog. A glass bar slides in at the top of the screen, listens right away, shows what it heard in quotes with the reply below, reads the reply aloud and hides by itself. Speech goes to the speech-to-text engine of the Home Assistant assistant (needs HTTPS), with browser speech recognition and a text field as fallbacks. It listens again when the assistant asks a follow-up question. New settings in **Settings > System > Assist**: **Style** (voice bar or the earlier chat window), **Listen on open** and **Keep the conversation going**. See [Voice assistant](docs/features.md#voice-assistant).
- Fixed: **room settings** opened from the room header (sensor menu, "All room settings") now enter edit mode first, so the Save buttons and whole-room editing work. A sensor picked in the header is no longer overwritten by a later Save.
- Fixed: the **"Wykrywanie pracy"** (climate detection) header in room settings no longer shows an oversized icon.

### 2.29.2
- Added: every dropdown (select) has a **search box**, and long lists load 10 options at a time with infinite scroll. Searching ignores case and Polish letters, so "lazienka" finds "Łazienka". Sensor pickers with thousands of entries open fast.
- Added: the **presence** pill in the room header can be tapped (admins) to pick the presence or motion sensor for that room, like the temperature and humidity. Choose "Automatic", "Do not show" or add a sensor when the room has none.
- Added: **title size** for the view header per device (phone, tablet, wide): Small, Medium (default, the current look), Large and XL. XL is clock-sized, so `{time}` can be read across a room. Set in the header editor, with a live preview.
- Added: **Show weather in the header** switch on the Look page. Turn it off when a Weather card already shows the forecast (default on).
- Added: **Glass opacity** slider in Appearance, next to Glass blur. It makes large glass cards more see-through and leaves the blur as it is. Default 100 is the current look, and text stays readable when blur is off.
- Added: three wall tablet screensavers: **Stars** (twinkling night sky with the clock), **Word clock** (the time lit up letter by letter, English words for now) and **Sunrise** (a sky that follows the real time of day, with a sun or moon arc).

### 2.27.0
- Added: **clock appearance** for the wall tablet screensaver (issue #41). Appearance → Wall tablet mode has a live preview and controls for font (system, serif, mono, rounded or your own font from a `/local/…` or `https://…` address), size, weight, colour (white, accent or your own), shadow and opacity. The settings apply to the clock on photo, Night, Aurora, Flip and Minimal (glass) styles. The default values keep the current look, and **Reset to style defaults** restores them.

### 2.26.1
- Fixed: **room** presence/motion and door/window chips are separate sections, so they can be removed or hidden in the room editor like the other room sections.
- Fixed: **TV content** no longer keeps a separate edit-mode component tile when the same entities are covered by a device profile (one purifier/lock tile instead of duplicates).

### 2.26.0-beta.6
- Fixed: **TV content** no longer keeps a separate edit-mode component tile when the same entities are covered by a device profile (one purifier/lock tile instead of duplicates).

### 2.26.0-beta.5
- Improved: **TV content** room rows store ordered `items` (entities, binary sensors, device profiles, edit-mode components) so Nuvio TV can mirror dashboard room contents, not only a flat entity whitelist.

### 2.26.0-beta.4
- Fixed: **TV content** room tiles use the dashboard entity whitelist even when those entities are not assigned to the matching Home Assistant area (virtual rooms and reassigned devices). Room rows in `nuvio_tv_layout` also store the dashboard display name.

### 2.26.0-beta.3
- Fixed: **TV content** room list and order now match the Nuvio rooms grid (Wygląd → Pokoje + layout hidden/order/added), not every Home Assistant area. Sync from dashboard and layout save rewrite the full room set; “Other” on TV only when the dashboard shows *No room*.

### 2.26.0-beta.2
- Improved: **TV content** starts from the Nuvio dashboard room (same entities as the room card, including hidden sections and added tiles). **Sync from dashboard** refreshes the lists; saving the dashboard layout also updates `nuvio_tv_layout` room entity lists when a TV layout already exists.

### 2.26.0-beta.1
- Added: **TV content** under Settings → System → TV: choose which cameras (with order), rooms (optionally a subset of entities), scenes/scripts and alarm panels appear on paired Nuvio TV apps. The selection is stored in Home Assistant user data as `nuvio_tv_layout`. With nothing saved, the TV shows everything from Home Assistant; an empty section stays hidden. Reload or reconnect the TV after saving ([#83](https://github.com/kczepiec/nuvio/pull/83)).

### 2.25.1
- Fixed: **TV pairing** creates a shorter-lived access token (365 days instead of 10 years), asks for confirmation before sending the token to the TV over cleartext `http://`, and builds the TV address only from a validated `host:port` (schemes and paths are rejected) ([#81](https://github.com/kczepiec/nuvio/pull/81)).
- Fixed: a component added on a **room** page (stack, grid, HA card, …) opens its own form in edit mode again, instead of the section settings ([#80](https://github.com/kczepiec/nuvio/pull/80)).

### 2.25.0
- Improved: **TV pairing** is faster. On a Home Assistant opened over `http://` the data goes straight to the TV with a background request, so no new tab opens, and the page tells you when the TV rejects the code or too many wrong codes were tried. On `https://` the tab closes by itself once the TV has connected. The page now checks every second instead of every 3 seconds, and waits 120 seconds only when the Home Assistant address is `http://` outside your home network (otherwise 60 seconds). Needs the latest Nuvio TV app for the instant answer; an older app still pairs and is confirmed by the same check.
- Added: **TV pairing** (Settings, System, TV, marked Beta): pairs the Nuvio TV app without typing a token. Type the address and the 6 digit code shown on the TV, or paste the link from its QR code. Nuvio creates a long-lived access token named *Nuvio TV date time* and posts it with the Home Assistant address to the TV over your home network (only addresses on your home network are accepted). The TV confirms the connection itself: the page says *TV connected*, or after 60 seconds (120 seconds for an http Home Assistant address, where the TV first asks you to confirm an unencrypted connection) without an answer it removes the unused token. If your browser blocks the new tab, a second button sends the data and a token that is not sent within 2 minutes is removed. The same page lists your paired TVs with the time they last connected and removes them. The token is never stored or logged. Needs the Nuvio TV app with pairing. The page is part of the settings panel, so administrators and users with their own layout see it.
- Added: **Screensaver quick buttons** ([#49](https://github.com/kczepiec/nuvio/issues/49)): up to 3 glass buttons on every screensaver style (photo, board and glass) that run an action on a script, scene, button, switch, light, fan, input_boolean, cover or alarm panel without waking the dashboard. Set them under **Wall tablet mode → Quick buttons** (administrators): entity, action, name, icon and *Hold to confirm*, which is on by default for covers and alarm panels. The buttons are hidden while the screensaver is PIN-locked. Alarm panels ask for the code each time on an on-screen keypad (arming only when the alarm requires it, disarming whenever the panel has a code); the code is sent to Home Assistant and never stored.
- Fixed: the blur of the cards (glass) was missing or showed up late after a view change, most visibly when you switch views with **Panel background** off. The card entry animation faded the opacity of each card wrapper, which cut the cards off from the photo behind them and, because the animation kept its end state, kept the blur off afterwards. Cards now slide in without any opacity change, so the blur is there from the first frame.
- Improved: performance. The check for a newer bundle no longer downloads the whole ~1.4 MB file on every page load: it sends a conditional request and the server answers 304 when nothing changed. The Clock card updates only its time text instead of redrawing the card, the header repaint compares plain values instead of serialising the user object on every state update, and the cover colour cache of the media cards is bounded.
- Improved: the camera snapshot refresh, the Timer card and the Room card countdown pause while the tab is hidden or the card is off-screen, and catch up on the next tick.
- Improved: the seven largest built-in backgrounds are recompressed (about 3.1 MB to 2.4 MB in total, same size and file names). Details are a little softer in a few photos.
- Removed: the unused editor split chunks (`hg-editor.part.js`, `hg-editor-tail.part.js`) that were not part of the build.
- Added: **Wall tablet mode → View shown on wake**: Last view used (default), Home or any enabled view. When the screensaver starts, the dashboard goes back to that view behind it, so it is the one you see when you wake the screen. Skipped in edit mode, in the preview and when the view is already open. A view locked with a PIN still asks for it on wake.

### 2.23.1
- Restored: the code base of 2.23.0 as released, with the Energy flow work of 2.22.5 / #57. The editor split and the review fixes that followed are withdrawn: a dashboard built from them failed to render (`this._applyLayout is not a function`) and left every view empty.
- New: the **Energy flow** card fills itself from the **Energy dashboard** settings of Home Assistant when they list power sensors (recent HA: grid, solar and battery power, battery level and name). Inverted meters and separate import / export sensors are handled as in HA. Anything missing there is detected as before, and your own choices in the card settings always win.
- Fixed: the **Energy flow** card placed by default on the **Energy** view could show several batteries for a single one (for example every battery-named power sensor of a SolarFlow, plus a smart plug called "battery"), with levels matched by order. Batteries are now detected per device: one per charge level the device reports (an inverter with Battery 1 and Battery 2 gives two), each with the power sensor whose name matches that level, or the device's main battery power sensor when it has a single level; devices without any level (such as a plug) are ignored when another device reports one. A new card from the gallery uses the same detection.
- Improved: **Settings** of the Energy flow card on the Energy view now open the same form as the gallery (grid, solar, batteries, levels, export, home, sign options), prefilled with what the card shows; your choices are saved on top of the generated card.
### 2.23.0
- Added: a wall tablet obeys commands from Home Assistant without browser_mod ([#47](https://github.com/kczepiec/nuvio/issues/47)). **Appearance → Wall tablet mode → Commands from Home Assistant** gives this tablet a name, kept in its own browser, and accepts two senders: an event `nuvio_command` with `device`, `action` and `view` (administrator accounts), and an `input_text` helper with the same values in its `device`, `action` and `view` attributes (any account, including one without administrator rights). Actions are `wake`, `screensaver`, `lock` (shows the screensaver and asks for the PIN when the PIN lock is on) and `navigate` with a view path or title, so a doorbell or motion at the gate can wake the tablet and open **Cameras**. A helper holds the last command, so Nuvio runs it once per change and once after a reload, never twice for the same command.
- Added: while Kiosk Mode is on, the screen stays awake on the Nuvio dashboard, the same way it stays on while a video plays. This covers a hidden header, a hidden sidebar, kiosk for people who are not admins, and the address parameters `kiosk`, `hide_header` and `hide_sidebar`. Turn kiosk mode off and the screen can sleep again. If the screen turns off or you leave the app, Nuvio asks to keep it on again when you come back.
### 2.22.4
- Added: the header weather and a Weather card have a text size, Small, Medium or Large. The header hero also follows the dashboard zoom, so on a landscape tablet the hourly forecast can grow past the old cap.
- Fixed: the rain amount on the header weather, such as 17 mm, is white on the photo, so it stays readable.
- Added: a view can count several things at once (lights, switches, fans, media, climate, people, motion, and selected entities). The tab shows the sum. The current view also shows an icon and a count under the title, and hides a chip at 0. Lights on skips a light group when its lamps exist. Selected entities uses the searchable entity picker.

### 2.22.3
- Fixed: the Glass Minimal screensaver still showed the avatar circle in the top-right corner when **Top bar → Avatar** was off, in the live screensaver and in the preview ([#52](https://github.com/kczepiec/nuvio/issues/52)).
- Fixed: the **Discord** row in the user menu shows the Discord mark next to the label, the same way Profile and Settings show an icon. Home Assistant no longer includes that brand icon, so the menu draws it itself.
- Fixed: **Settings → Users** shows a person's photo when that Home Assistant user is linked to a person who has one. Rows without a photo keep the letter.

### 2.22.2
- Fixed: a **Cover / gate** tile (open, stop, close) on a phone was cut off on the right when it sat on the panel by itself. On a narrow tile the buttons were stretched to a full row, but that row never wrapped, so they drew past the card. They now move under the name and stay inside the tile. The media tile uses the same layout. On a wider screen the buttons stay on the right ([#53](https://github.com/kczepiec/nuvio/issues/53)).
- Added: Discord in the user menu, after Profile and Settings, and on the About Nuvio page. The English, Polish and French READMEs have a Community section and a Discord badge.

### 2.22.1
- Fixed: on phones and narrow tablets the **Views and navigation** settings were cut off on the left and squeezed into half the width, and the page could scroll sideways. A wide picker (phone tab bar) and the two-column views cards were wider than the screen, and the page was placed in the wrong grid row after the sidebar was hidden. Settings now use one full-width column, the views table is stacked cards with every field visible, nothing scrolls sideways, and the **Restore defaults** / **Done** bar sits above the bottom navigation and the home indicator. New `tools/mobile_check.py` checks every settings page on iPhone (WebKit), Android (360 px) and a 768 px tablet before each release.

### 2.22.0
- Changed: settings changes in edit mode are a draft. Views, kiosk mode, header, rooms, screensaver, PIN and Assist settings no longer save or reload the dashboard on every change; cheap previews (accent, header text) show at once. **Done** saves everything once and reloads at most once, **Cancel** discards the draft, and leaving the page with unsaved changes asks first.
- Changed: **Settings** have a new layout. A sidebar groups 13 pages (General, Appearance, Dashboard, Wall tablet, System) with a search box that finds settings on every page, keyboard navigation and a drill-down list on phones. PIN settings have their own **PIN and locks** page, there is a new **About Nuvio** page, and per-climate activity detection is folded under an advanced block. Every option and stored setting is unchanged.

### 2.21.6
- Fixed: the screensaver keeps the screen on again after the screen was turned off and on, or after switching apps or tabs. Browsers release the screen wake lock when the page is hidden; Nuvio now asks for it again when the page is visible and the screensaver is on ([#38](https://github.com/kczepiec/nuvio/issues/38)).
- Fixed: the **Cover / gate** card showed 0 % or 100 % and a position bar for covers without a position (a gate or garage door that only knows open, close and stop). It now shows the state in words (Open, Closed, Opening, Closing) with a gentle pulse while moving, and no bar. The icon follows the device class (gate, garage, door, window, blind, curtain, shade, awning) instead of always a shutter ([#36](https://github.com/kczepiec/nuvio/issues/36)).
- Fixed: views unlocked with the PIN stayed open for 5 minutes even after the screensaver started or **Lock screen** was used, so the next person at a wall tablet could open them without the PIN. The screensaver and **Lock screen** now close every unlocked view, and the view on screen asks for the PIN again after waking. The screensaver preview in settings does not relock ([#35](https://github.com/kczepiec/nuvio/issues/35)).
- Changed: the PIN pad of a locked view and the view lock settings no longer show the note that the lock is a convenience, not security; the limitation is described in the documentation.
- Fixed: in the **Clock on photo** screensaver the time of the next event (and of the next LiveKid activity) is shown at full brightness again instead of dimmed like the other rows. A stray `};` in the screensaver styles made the browser drop that rule ([#34](https://github.com/kczepiec/nuvio/issues/34)).

### 2.21.5
- Fixed: **Hide the sidebar** (formerly **Hide the sidebar when it is empty**) did nothing while any view still had **Sidebar** on. It now hides the Nuvio sidebar and its Settings button on computers and tablets whatever the per-view switches say, and views that are not in the top tabs move to the profile menu.

### 2.21.4
- Added: **{time}** and **{date}** in the view title or subtitle show the current time and date in the interface language, with the 12 or 24 hour format from your Home Assistant profile, updated every minute. **Add a clock** in the view header editor adds **{time}** to the subtitle.
- Added: a **Badge** column in **Settings > Views** counts lights, switches, fans, climate devices or people that are on (or media that is playing, or the entities you pick) and shows the number on the view tab when it is above 0.
- Added: **Hide the sidebar when it is empty** in **Settings > Views**. When no view is shown in the sidebar, the sidebar and its Settings button disappear. Settings stay in the profile menu, behind the pencil and at any Nuvio address with **?nuvio_settings** (for people who may edit, and not on a view locked with a PIN).
- Fixed: the **Production forecast** card used one colour for every day after its thresholds were changed. Thresholds above 12 kWh per kW, or thresholds set without a reference power, are now read as kWh per day; thresholds entered the wrong way round are swapped; a decimal comma (3,5) is accepted in number fields of the card editor.
- Fixed: a built-in background chosen on one device showed as a plain colour on devices that open Home Assistant under another address (local IP, domain, Nabu Casa). The picture was saved with the full address of the first device; built-in backgrounds are now saved as a path next to the Nuvio files (for example `/hacsfiles/nuvio/nuvio-bg-nad-mgla-wide.webp`), and backgrounds saved earlier with an address are corrected when the layout loads, for the dashboard and the screensaver. Uploaded pictures and your own addresses are not changed.

### 2.21.3
- Changed: the climate dot on the **Rooms** tile has the colour of the mode (heating, cooling, drying, fan, auto), the same colours as in the **Mode** menu of the AC remote card, instead of grey: solid when the device is running, dimmed when it is not running or the state is an estimate, outlined when only the mode is known. The **~** before estimated states is gone from the Rooms tile and the thermostat card; screen readers still say **estimate**.

### 2.21.2
- Changed: the detailed weather window is compact and fits a phone screen without scrolling: the four details sit in one row, rows and paddings are tighter, the sun arc is smaller and on narrow screens the days use short names (Mon, Tue) instead of cut names.
- Changed: Nuvio no longer guesses whether a thermostat or air conditioner is running. Each climate device in a room has **Activity detection** in **Appearance > Rooms**: **Automatic** (default), **From an entity**, **From room temperature** or **Show mode only**. Automatic uses, in this order: the **Actual state** entity (on/off, or a value such as power above the **Running threshold**, 5 W by default), what the device reports itself (`hvac_action`), and the room temperature against the setpoint when you pick a separate room sensor (an estimate with a 0.5° hysteresis by default, marked **~** with a dimmed dot). Otherwise the tile shows only the mode, for example **Heating** with an empty dot. In 2.21.1 the setpoint was compared with the device's own temperature, so IR remote air conditioners showed **Idle** while heating. With several devices in a room, the Rooms tile shows a device that is surely running first, then an estimate, then a mode. Existing **Actual state** choices keep working.

### 2.21.1
- Thanks to [@cbailly42](https://github.com/cbailly42) for the climate fix ([#22](https://github.com/kczepiec/nuvio/pull/22)).
- After updating, turn on **Screensaver on this device** once on every device that should show the screensaver.
- New: **Actual state** for each thermostat of a room, in **Appearance > Rooms** (edit mode): pick an entity that tells whether that device really runs (an on/off entity such as a stove's combustion sensor, or a numeric one such as its burner power). With several devices in a room (for example a heat pump and a stove), the Rooms tile looks at all of them and shows **Heating**, **Cooling** or **Idle** from the one actually working; the thermostat card uses the same setting.
- Fixed: thermostats that do not report what they are doing (no `hvac_action`, for example some towel radiators) now count as idle once the room has reached the setpoint, on the Rooms tile and the thermostat card.
- Fixed: the thermostat card shows **· idle** after the mode (for example **Heating to 7° · idle**) when the device is not actually heating.
- Fixed: the **Rooms** tiles showed **Heating** whenever a thermostat was in heat mode, even when it was not heating (for example a frost-protection setpoint of 7 °C in a 21 °C room). The tile now follows what the device is actually doing and shows **Idle** with a grey dot in that case.
- Fixed: the **PIN lock for views** switches in Wall tablet mode did nothing when clicked. Their action was not passed to the wall tablet settings, so nothing was toggled or saved. They now switch at once and are saved with the layout; without a PIN, a message and a PIN field appear right there. Refs [#17](https://github.com/kczepiec/nuvio/issues/17)
- Fixed: normal tiles were always grouped in one block below stacks, grids, YAML cards and other components. Without grid areas every added tile is now its own card on the panel, so tiles and components can be mixed in any order by dragging; the existing tile order is kept. Refs [#17](https://github.com/kczepiec/nuvio/issues/17)
- Fixed: opening a view by its number (for example `/dashboard-nuvio/0`) left the cards invisible, because the page thought it was not shown and paused the entrance animation.
- Fixed: a toggle inside a stack or grid added in the editor did not change its look after you turned the light on or off ([#16](https://github.com/kczepiec/nuvio/issues/16)). The panel passed new Home Assistant data to a container only when one of its own entities changed, and the list of those entities did not include the cards inside the container. Containers and other added components now get every update.
- New: **Screensaver on this device** in **Wall tablet mode** ([#16](https://github.com/kczepiec/nuvio/issues/16)). The screensaver settings stay shared, but each device decides whether it runs, saved in that browser. Enabling the screensaver enables it on the device you use; other devices stay off unless you turn it on there (a tablet locked with the PIN before the update keeps it). After updating, check the switch on your wall tablet.
- New: **Panel background** in **Appearance** turns off the shared glass panel behind the cards, for all views or only the current one ([#15](https://github.com/kczepiec/nuvio/issues/15)). The styles for `panel_backdrop: false` are no longer a test.
- New: the **Weather** component has a **Hero style** switch (`variant: hero`), and a standalone weather card with `variant: hero` now gets the hero styles ([#15](https://github.com/kczepiec/nuvio/issues/15)).
- New: **PIN lock for views** (BETA) in **Wall tablet mode**: chosen views ask for the PIN before showing anything, with the same PIN pad as the screensaver ([#17](https://github.com/kczepiec/nuvio/issues/17)). It is a convenience lock, not security.
- Fixed: stacks, grids and YAML cards added in the editor keep the order you set instead of jumping above earlier cards ([#17](https://github.com/kczepiec/nuvio/issues/17)).

### 2.20.0
- Thanks to [@cbailly42](https://github.com/cbailly42) for the new card and the shared bar chart ([#14](https://github.com/kczepiec/nuvio/pull/14)).
- New: **Production forecast** card (`custom:nuvio-yield-card`). Pick one sensor per day (the first one is today) and the card shows the coming days as bars with the total, rating each day good, average or poor. Give your installed power in kW (a number or an entity) and the rating uses the energy per kW, with thresholds you can change; without it a day is compared with the best day of the period. Sensors in Wh or MWh are converted, a capacity written as `3,4` works, and day names follow the Home Assistant time zone. See [docs/components.md](docs/components.md#production-forecast).
- Fixed: the bars of **Energy statistics** now grow in when the card appears, like those of **Energy · week**.
- For contributors: the day bar chart and its tooltip, which were copied into **Energy · week**, **Energy statistics** and the new forecast card, now live in one place, `src/parts/shared/day-bars.part.js` (`HG_DAYBARS_CSS`, `HG_TIP_CSS`). See [DESIGN.md](DESIGN.md).

### 2.19.0
- New: Nuvio speaks French. Pick **Français** in the language switch, or leave the language on automatic and Nuvio follows the browser. Thanks to [@cbailly42](https://github.com/cbailly42) for the translation and the work below ([#10](https://github.com/kczepiec/nuvio/pull/10)).
- Changed: all interface texts now live in keyed language catalogs (`src/locales/en.json`, `pl.json`, `fr.json`). Only the language you use is downloaded, next to the main file, so adding a language no longer makes the dashboard bigger for everyone. The automatic language no longer sticks to a language the setup wizard showed but you never picked.
- For contributors: `tools/i18n_check.py` checks keys, plural forms and coverage of every catalog, `tools/i18n_compile.py` builds the language files, and `npm test` runs the new JavaScript and Python tests. See [docs/development.md](docs/development.md).

### 2.18.0
- Fixed: a toggle in the **Entities** list (and other cards) could stay on after the device was turned off elsewhere, for example from the Home Assistant more-info window, until the page was reloaded. When one card on a view failed while updating, the error stopped Home Assistant data from reaching every card after it on that view, so they stopped following state changes. Each card now gets its update separately, a card that fails shows a short error instead of breaking the others, and updates can no longer get stuck after an interrupted panel animation, a closed edit mode, a lost touch release or a paused browser frame.
- New: **Power now** can draw a forecast instead of history. Turn on **Chart from a forecast (attribute) instead of history** (YAML `source: forecast`) and pick the forecast entities, how many **Days ahead** (or **Hours ahead**), the attribute (default `detailedForecast`, also `detailedHourly`) and the value field (default `pv_estimate`, for example `pv_estimate90`). This works with the Solcast PV Forecast integration out of the box: add the daily sensors for today, tomorrow and days 3 to 7 and you get a 7 day chart with day names under it. Weather entities are read with `weather.get_forecasts` (`forecast_type: hourly` or `daily`, value `temperature` by default). See [docs/components.md](docs/components.md#forecast-chart).

### 2.17.0
- Fixed: room tiles in **Rooms** (and room tiles elsewhere on the dashboard) did not always show a light that was turned on or off until you opened another view and came back. Inside the room view the state was right. A card that the browser wrongly reported as hidden (this happens in Safari and in the Home Assistant app after a view was hidden and shown again) now redraws as soon as it is on screen, cards of a view that comes back catch up right away, and the list of watched entities is rebuilt when the Home Assistant registry changes.
- Fixed: the **Power now** card (value, bar and chart) treated every sensor as power. An energy or forecast sensor such as a Solcast forecast for tomorrow (20.2 kWh) showed as 20 W, 0% Low. The card now shows the value and unit exactly as the sensor reports them, scales the bar to the highest value on the chart or to your own **Bar scale end**, and shows the Low, Medium, High level only for power or when you turn it on. Sensors without long term statistics (for example forecasts) draw their chart from the state history.
- New: the caption under the chart can be changed per card. **Power now** has a **Chart caption** field (for example Forecast instead of -6 h) and a switch to hide the labels under the chart. A tile in **With chart** mode has a **Chart caption** field instead of the fixed Last 24 h, and a switch to hide it.

### 2.16.0
- New: four more screensavers in **Settings > Screensaver**, each with a live preview tile in the gallery. **Analog clock** is a frosted glass clock face over your photo, with a second hand in the accent colour, the date and the weather. **Flip clock** shows the hours and minutes on two dark cards that flip over every minute. **Aurora** is a thin large clock over slowly flowing light in the accent colour, violet and teal, with the date and weather. **Night** is a dim warm clock on pure black for bedrooms and OLED screens, and it moves further every minute to protect the panel. All of them work with dimming, the motion sensor, the PIN lock and screen notifications; looping motion stops with Power saving and reduced motion.
- New: **Dashboard style** at the top of **Settings > Appearance**: eight ready-made looks with a thumbnail of the dashboard each (Nuvio, Frost, Midnight, Sunset, Forest, Ocean, Pastel and Graphite). A style sets the accent, the background, the dimming and the glass (tint of cards, tiles and panel, blur strength; Pastel has rounder and Graphite sharper corners). You can still change the accent and background below. With **Glass blur** set to Off the dense fill for readability stays as before. **Reset to default** goes back to Nuvio.

### 2.15.1
- Improved: the temperature and humidity in the room header show a small pen when you can change their sensor. Hovering no longer puts a box behind the number; the pen lights up in the accent colour instead.
- Fixed: stacks and grids could not be edited when they came from the dashboard configuration (for example a `vertical-stack`, `horizontal-stack` or `grid` from HA). In edit mode, tapping a stack or grid now opens its settings with the list of its cards, where you can add, remove, reorder and duplicate cards and change the stack options (for example **Each card in its own glass**). Tapping a card inside a stack or grid opens that card's settings right away, like in HA; **Back** returns to the container, and **Save** on the container keeps the changes.
- Fixed: the **Live preview** in the settings of a room section stayed empty when the section showed a card such as air conditioning. The preview now shows that card.
- Removed: the **Display mode** choice (Default, Compact, Minimal) for rooms, room sections and cards with only one style. It made almost no visible difference. Tiles and cards that can switch to a tile or list style keep their style choice.
- Improved: the **Alarm** component has a new premium look. The state shield glows in the state colour, the PIN keypad has round keys with dots that light up as you type, and the mode buttons show the icon and label side by side. The keypad appears only when a PIN code is set up on the alarm panel (Home Assistant reports a code format). Enter the code, then tap Home, Away, Night or Disarm; if you tap an action that needs the code before entering it, the card asks for the code first. Panels with a text code get a password field instead.

### 2.15.0
- Fixed: the room header temperature could break onto two lines ("23," and "2°") and slide under the side rail on narrow screens. The temperature and humidity now always stay on one line, and the side rail moves below a header that grows taller.
- New: choose the temperature and humidity sensor of a room right from its header. As an admin, tap the temperature or humidity in the room view (or the **+** next to it when nothing is shown) and pick Automatic, any sensor (sensors of that room first, with their current values), or Do not show. The choice is saved with the layout and is the same setting as in **Settings > Rooms**, which the menu also opens.
- New components in **+ Add**: **Air quality** (`custom:nuvio-airq-card`) shows CO₂, PM2.5, PM10, VOC, NO₂, AQI and humidity as tiles with coloured levels and an overall rating; leave the sensors empty and it finds them, preferring one room. **Plant** (`custom:nuvio-plant-card`) shows soil moisture, light, temperature and fertility with the good range as a band and the reading as a marker, says what the plant needs (water me, too dark…) and finds the other sensors and the battery of the same device (for example Mi Flora); it also reads a `plant.*` entity. **Electricity price** (`custom:nuvio-eprice-card`) shows the current price with a cheap, average or expensive label, hourly or 15 minute bars for today and tomorrow, and the cheapest window of 1 to 24 hours; it reads the price lists of Nord Pool, ENTSO-e, Energi Data Service and similar sensors.
- Improved: cards adapt better to small (S) tiles. The rooms grid goes to one column, cover and media tiles put their buttons under the name, and the washer, water heater, energy statistics, vacuum, media player, entity list, counter, updates, fuel prices, phases and value tiles no longer squeeze or cut their names. The energy statistics card no longer fails when it gets a single sensor.
- Fixed: the previews in the **Add component** gallery overlapped the Preview label and some were cut off; tall previews now scale down to fit. Smart lock and air purifier have their own previews.
- Docs: every component in [Components](docs/components.md) now has a screenshot of the same size, grouped by category, and the README shows a few of them. The logo in the README is now visible in dark mode and in HACS.

### 2.14.1
- Fixed: a tile or card dragged in edit mode jumped back to its old place. The panel grid packed narrow cards into gaps before wide ones, so the new order was saved but not shown. Once you reorder a view, its cards and tiles now stay exactly in your order (a gap can stay next to a wide card; resize a card to fill it). On views with the Masonry or Columns layout the cards also move while you drag instead of only after saving.
- Fixed: the S, M and L size buttons did nothing visible on built-in cards of the home panel until you saved, S could not make a card narrower than its default width, and a card with **Width** set in its settings ignored them. The size now changes at once, S really means one column, and choosing a size replaces the Width setting. On touch screens the size and drag buttons are larger.
- Fixed: the **Calendar** component's picker showed no calendars, so a calendar that was not picked automatically (for example a second Google calendar) could not be added. The component and the Calendar view now use all your calendars, not the first four or six.

### 2.14.0
- Fixed: after an update the dashboard could keep running the previous version. A release that only changed the version number kept the same bundle file name, so the browser and the Home Assistant app served the old cached file. The version is now part of the file name hash. 2.13.0 shipped without the performance changes below.
- New: **Settings > Appearance > Performance**, saved per device. **Glass blur** can be Auto, Full, Light or Off; with Off no surface uses `backdrop-filter`, and glass gets a denser fill so text stays readable (dialogs and sheets become opaque). **Power saving** (Auto, On, Off) stops looping animations (screensaver photo zoom, spinning fans, pulsing rings, the washing machine drum and similar) and refreshes camera snapshots at most every 30 s. On Auto it turns on for iPads and iPhones on iOS or iPadOS older than 18 and for very weak hardware, and then blur is off too. The old `home-glass:lite` override still works.
- Fixed: battery drain on older tablets. Animations in cards scrolled off screen pause until the card comes back, the media progress timer skips seconds while the page or card is hidden, and the theme check that runs for every card on every Home Assistant state change no longer reads storage each time.
- Docs: README redesigned; changelog, configuration and development docs moved to separate files.

### 2.12.0
- New: a room section's settings can now add and remove entities. In edit mode open a section in a room (for example **Lights**): the **Entities** list ends with an **Add entity** row whose picker shows only entities that fit the section (lights and switches for Lights, thermostats for Climate, cameras for Cameras and so on). The entity is assigned to the room and lands in that section right away.
- New: every entity in a room section has a remove button. An entity you added yourself is removed from the room (**Remove from room**). An entity that comes from the Home Assistant area is hidden only in this room (**Hide in this room**), without touching the area in Home Assistant; adding it again shows it again. The settings are saved in the layout with the other room assignments.
- Includes the LiveKid child card and screensaver panel from the 2.11.1 to 2.11.3 test releases.

### 2.11.3
- New: redesigned child panel (LiveKid) on the screensaver. Board: a card above the media player with large check-in and check-out times, the next activity with a countdown and two later ones. Glass: a block next to the weather in the same style as the temperature. Photo: clearer status and name.
- New: neutral child status, **At facility** and **Away**, on every screensaver style, on the Child card and in its gallery preview.
- New: the screensaver panel shows when the child is at the facility, has not arrived yet or is done for the day.

### 2.11.2
- New: the Child card (LiveKid) is a normal card now, listed in the Nuvio card gallery and in the HA card picker with a preview. It shows presence at nursery or kindergarten, check-in and check-out, meals, unread news and the bill.
- New: child panel on the screensaver. On weekdays it shows today's activity plan plus check-in and check-out times, on all screensaver styles.
- New: **Settings > Wall tablet mode** has a LiveKid switch. It shows whether the integration's entities were detected; when they are, it is on by default, otherwise it is disabled with a **Not detected** note.

### 2.11.1
- New: Child card for the LiveKid integration (YAML only in this version). The child's entities are found automatically by the integration, never by entity ids; with several children choose one with `child` (name) or `entity`.
- New: a compact child panel on the photo screensaver (test only, behind a flag in this version).

### 2.11.0
- New: fuel prices in the header can be turned off without deleting them. **Settings > Header and navigation** has a switch for the whole fuel section and one on every fuel row. A hidden fuel keeps its row with dimmed fields, and with the section off the list collapses to a short note. The header updates right away, and the setting is saved in the layout and included in export and import.
- New: a glass colour picker replaces the browser colour picker in every colour field (screensaver gradient and orb colours, accent, background colours and card settings). It has a saturation and brightness area, a hue slider, a HEX field and quick colours including Nuvio lime.
- Fixed: the screensaver gallery and the live preview in Settings now show real renders with your background and data. Before, they stayed black or empty when you opened the Screensaver tab after another tab, and the live preview had no width on phones.
- Fixed: choosing the screensaver motion sensor no longer freezes the page with thousands of entities. The list opens at once, shows motion, occupancy and presence sensors and filters as you type. The Settings sheet also opens much faster because long sensor lists are filled only when you open them.
- Fixed: Cancel in edit mode no longer undoes changes already saved in Settings.

### 2.10.1
- Fixed: in **Settings > Header and navigation** the title and subtitle of the household strip (the people avatars) are saved again. Before, the changes were lost when you closed the sheet with **Done**; now Done saves them, the strip updates right away without a page reload and the section shows a live preview. A new row links to the header editor of the current view.
- Fixed: the **Energy · week** chart is much taller and easier to read. Its height grows with the card size (S, M, L), the bars are wider, production uses its own amber colour and small values stay visible, and the day and value labels are larger.

### 2.10.0
- New: the header of every view can be edited in edit mode. Tap the lime pencil next to the title to set the title, subtitle and an optional icon, show or hide the whole header or only the subtitle, and add shorter versions for phone and tablet. This works in all views, including Rooms and the single room view: there `{room}` inserts the room name, an empty subtitle keeps the live temperature and room status, and the icon defaults to the room icon. A hidden header stays visible, faded and marked "Header hidden", while editing. Headers are saved in the layout and included in export and import.
- Fixed: the last untranslated texts now follow the selected language (the shared layout dashboard, the default Media card title and the card error message). A new check in the build fails when any text has no Polish or English version.

### 2.9.0
- New: language picker in **Settings → Appearance → Language** (Automatic / Polski / English) and in the user menu for everyone. Switching is instant, without a page reload, and the choice is saved per person (this device and the HA account). The default is now the browser language (Polish or English, otherwise English) instead of the HA profile language.

### 2.8.4
- Fixed: the robots card now shows each maintenance sensor with its own unit. Before, every value was shown as a percentage, so a main brush with 255 h left read 255%. Sensors in `%` keep the wear bar; sensors in hours, days or other units show the value and unit without a bar. The last cleaning values (time, area, total) also take their unit from the entity.

### 2.8.3
- Fixed: the `language:` strategy option now always wins. Before, it was ignored once the wizard (or saving views or rooms) had stored a language, so the dashboard could stay in Polish even with `language: en`.

### 2.8.2
- Fixed: while the PIN pad is open on the Glass Minimal screensaver the screen is no longer darkened. The background, content and assistant orb are blurred instead, and the pad stays easy to read.

### 2.8.1
- Fixed: the PIN pad on the Glass Minimal screensaver now opens on its own layer above a blurred screensaver, like on Clock on photo, instead of on top of the clock and cards. Tapping the orb while locked asks for the PIN first and then opens Assist.

### 2.8.0
- New: screensaver style **Glass Minimal** (Settings > Screensaver): a big clock with the date, weather with a 3D icon, now playing with the album art, a background sphere, the assistant orb and the family row. All screensavers are picked from a gallery of live previews, each showing the whole screen scaled down. Tapping the orb opens Assist straight from the screensaver (can be turned off).
- Configurable: gradient colours, orb (on or off, colours, intensity), background sphere, own image from the gallery or an upload, dimmer at night, date format, avatar, clock format, size and position, date, weather and now playing on or off, family (who, grey when away), hint text and reduced motion. Settings are saved per Home Assistant user and included in export and import. Earlier Carousel and Bento choices open as Minimal.
- All cards now share one glass background; the separate warm tint on the solar, energy, power and phases cards is gone.
- The 3D images ship in dist as `nuvio-3d-*.webp` (Fluent Emoji 3D by Microsoft, MIT licence).

### 2.7.0
- New: smart lock card (`custom:nuvio-smartlock-card`, **+ Add → Smart lock**). An animated padlock in a round button: hold it to unlock while a ring fills, tap to lock. A spinning arc shows the lock moving, a pulse confirms the new state and the padlock shakes when the lock is jammed. Battery and door sensor are found on the same device, and an Open door button appears when the lock supports it. Locks with a code ask for it first.

### 2.6.1
- Air purifier card: the PM2.5 sensor is taken from the same device as the purifier (also sensors named pm2_5 without a device class, and the older xiaomi_miio aqi attribute), so the card no longer shows another sensor in the house. The reading also follows a sensor that appears after Home Assistant starts.

### 2.6.0
- New: air purifier card (`custom:nuvio-purifier-card`, **+ Add → Air purifier**). Large PM2.5 reading that counts step by step to a new value, label and color from air quality (clean, good, moderate, poor, very poor), air waves spreading from the number at a speed that follows the mode, power switch and preset modes with a sliding highlight. The PM2.5 sensor is found automatically or chosen in the form.

### 2.5.1
- Now playing card on the board matches the widgets: light blurred background with no border, white text and icons. A title too long for the card scrolls (marquee).

### 2.5.0
- Board widgets look like iPhone lock-screen widgets: light blurred background with no border, white text and white icons (weather uses white symbols, room gauges are white).
- Wall tablet settings: widgets under the clock are one list with up, down and remove; hidden widgets come back with "Add widget". Weather, calendars, rooms, the motion sensor and notify services are lists with an "Add" button that opens a searchable dropdown.
- Icon field: clicking anywhere on the field opens the icon list, and typing filters it.
- Vertical stack no longer collapses on iPhone (Safari).
- "Sensor with chart" inside a stack shows the chart again, and tile names no longer break mid-word.

### 2.4.0
- **Board redesigned like the iPhone lock screen**: date and a large thin clock centered at the top, under it a row of small glass widgets on the photo (weather with high/low and rain chance, next sunrise or sunset, countdown, the current and next event with "in 18 min", and room temperatures as round gauges with humidity), and at the bottom the notification stack and a compact Now Playing player. Everything is compact, so nothing gets cut off on short screens; on a phone the widgets go two per row. The heading defaults to the time; the photo card is gone because the photo is the background (photo source is now available for the board too).

### 2.3.0
- **Notifications on the screensaver**: messages sent with notify to this device (a legacy `notify.mobile_app_…` service or `notify.send_message` with a `notify.*` entity) appear on the screensaver as an iPhone-style stack: the newest card on top with the next ones peeking out below, a tap expands the stack into a list (Show less / clear), and a tap on a card shows its full text. Tapping notifications doesn't wake the screen; a normal wake marks them as read. Pick the services under Wall tablet mode → Notifications on this device (stored per device). Requires an admin account, because it listens to `call_service` events.

### 2.2.0
- **Board redesigned as widgets**: big bold date over the dashboard photo, sunrise and sunset as plain icon lines, and one row of equal glass widgets at the bottom (weather, coming up, now playing, rooms), StandBy style. No more boxes inside boxes: events have a thin color bar, rooms are a clean list with a colored icon and a large light temperature, widget titles are small uppercase labels. Weather moved into the widget row with a compact forecast. On a phone the widgets stack under the header.

### 2.1.1
- **Board polish**: cards no longer stretch with empty space; the widgets dock at the bottom and the photo stays visible in the middle. Weather is a compact card in the top right. Now Playing is a compact widget with a cover thumbnail. Light glass is cleaner white and dark glass is smoky instead of grey haze. The photo card only shows when there is more than one photo (otherwise it repeated the background). Rooms on a phone are tiles with the full name. Stronger shade under the header for contrast on bright photos.

### 2.1.0
- **Board screensaver in premium glass**: the board now sits on the dashboard photo (same slideshow, Ken Burns and dimming as the photo screensaver), with frosted glass cards, light edges and soft shadows like the rest of Nuvio; white date header over the photo, glass chips, accent badge for the next event. "Auto" theme now follows the dashboard.
- **Phone layout**: on a portrait phone the board is a single column (photo card hidden, since the photo is the background), rooms show as a two-column grid with humidity under the name, and list rows that don't fit are hidden whole instead of being cut in half. Cards with no room left are skipped, so nothing is ever clipped.

### 2.0.0
- **Screensaver "Board" (new)**: a second screensaver style next to the clock on a photo. It shows a large weekday or clock with the date, sunrise and sunset, a countdown to the next all-day event (for example "Halloween in 17 days"), weather with an hourly forecast (daily when the service has no hourly data), upcoming events for the next two weeks, now playing, a photo (dashboard background, slideshow or your own address) and a list of room temperatures with humidity. Everything is configurable in Settings → Screensaver: board theme (auto by the sun, light, dark), heading (weekday or time), which elements are shown, the order of the cards, the weather entity, which calendars and which rooms are used. Works in landscape and portrait, with the PIN lock and with motion wake-up.
- **Vertical stack (fix)**: cards in a vertical stack take their natural height; before, a card could be squeezed to a narrow strip.

### 1.9.1
- **AC remote**: changing the mode (for example cooling to heating) fades the card, airflow, slider thumb and tiles smoothly into the new colour, and the unit glows briefly in the new colour.

### 1.9.0
- **Media player (redesign)**: players in Multimedia and in rooms use a large Now Playing layout: artwork as the background (its colour tints the card), source and state line, big title and artist, progress with times, shuffle / previous / large play / next / repeat, and a volume row with − and + plus Rooms (join speakers into a group), Source and Sound chips when the player supports them. On narrow cards shuffle and repeat hide and chips show only icons.
- **AC remote**: on screens 700 px and wider the Mode, Fan, Sleep and Airflow tiles open a dropdown menu next to the tile (arrow keys work, a second tap closes it); phones keep the bottom panel.

### 1.8.1
- **Room editing (fix)**: rooms lay out cards in the same grid as the other views, so edit mode and the saved layout look the same, in the wide view and in the side panel. Before, the wide room view used a separate column layout and cards jumped around after saving.
- **Room gallery (fix)**: + Add in a room shows every component, containers included, and the component settings offer the size.

### 1.8.0
- **AC remote (new component)**: a separate card in + Add styled like an AC remote app. The unit shows animated airflow (blue when cooling, orange when heating, faster at higher fan speed, sweeping when the louvers swing), a large setpoint, a cold to warm slider with − and +, power and Eco. Mode, Fan, Sleep and Airflow tiles open a bottom panel with the options; the card only shows what the unit supports. Works in sizes S, M and L and in light and dark themes.

### 1.7.3
- **Add component gallery (fix)**: thumbnails always use the sample previews; scaled-down live cards were cramped, empty (air conditioning) or showed a random device (robots, sensor chart, scene). Reworked the solar, rooms, power, appliance, stairs, updates, weather and mini player previews so nothing is cut off.

### 1.7.2
- **Cards next to each other (fix)**: components added in edit mode are now separate cards in the view grid, so they can be dragged between and next to the default cards (also resized and removed in place). Simple entity tiles stay together in their block.
- **Weather card (fix)**: in size S the icon and temperature sit in the top row with the description below, sunrise and sunset no longer overlap, the temperature line lines up with the hours, few hours spread over the full width, the strip fades at the edges, and the sun dot stays round in L.
- **Household and Energy · week in S (fix)**: the counter sits above the avatars and zones go under names; the two totals sit side by side and only today's bar shows its value.
- **Add component gallery (fix)**: previews for light, thermostat, value, history, openings, batteries, vacuum, mini player, clock, sun, note, image and updates, plus a refreshed weather preview.

### 1.7.1
- **Faster pages (fix)**: the scroll-hint button on wide screens no longer bobs forever (its glass blur was re-rendered every frame); only its icon bobs three times. Without the energy flow card a page now idles at 60 fps instead of about 25 on a 6x slower CPU.
- **Lighter energy flow card (fix)**: no blur inside the card, no glow on the moving dots, no spinning sun, animations stop while the card is off-screen, and the diagram is re-fitted only when its layout changes.

### 1.7.0
- Added: the **Energy flow** card takes several sensors per source. Grid, solar, export and home sensors are summed (for example three phases or two inverters), and each battery gets its own circle with its level, name and flow, joined by a bus under the diagram (up to 4). Tapping a circle with several sensors lets you pick which one to open.

### 1.6.0
- Added: **Energy flow** card (`custom:nuvio-flow-card`): grid, solar, battery and home on one glass diagram with dots that flow along the lines, faster at higher power. The grid shows import or export, the battery its level and whether it charges, and the home ring and the legend show how much power comes from solar, grid and battery. It is in **+ Add** with a live preview, and the Energy view puts it on top when it finds grid and solar or battery power sensors.

### 1.5.1
- Fixed: closing the Assist window with X left its messages, suggestions and input on the screen without the glass behind them. The closed window is now removed completely, and the conversation is kept for the next opening.

### 1.5.0
- Added: per-person view visibility in **Settings → Views**. Every view is visible to everyone by default; an admin can hide a view from chosen people, and the row shows who does not see it. It also applies to people with their own layout, and their open screen reloads to drop the view.

### 1.4.0
- Added: shared dashboard. By default everyone sees the same dashboard, set up by an administrator; non-admins no longer get an empty default layout. The first admin to open 1.4.0 turns their layout into the shared one.
- Added: **Settings → Users** for admins, with a switch per Home Assistant user. A person turned off gets their own layout, starting as a copy of the shared one, and can edit it themselves.
- Added: changes to the shared dashboard reach open screens live.
- Fixed: Assist settings are now saved to Home Assistant instead of being lost on the next layout save.

### 1.3.1
- Added: unlock animation for the PIN lock. The padlock opens, the PIN dots glow green, the keys drift outwards from the centre, a soft wave of light spreads and the blurred screensaver lifts away to reveal the dashboard. Reduced motion gets a short fade.

### 1.3.0
- Added: PIN lock for the screensaver (BETA) in **Appearance → Wall tablet mode**: PIN, lock delay and on/off. A locked screensaver shows a round glass PIN pad over the blurred photo, with the PIN dots above it and a **Lock** button below it.
- Added: *Lock screen* in the user menu when the PIN lock is on. A locked screen stays locked after a page reload.

### 1.2.1
- Fixed: tablets in landscape (from 900 px wide and a 1.2 aspect ratio, like an iPad held sideways) use the desktop layout again instead of mixing the phone tab bar with the side rail and stretching the panels. The tablet layout stays for portrait and squarer windows, and its scale is now also limited by the window height.

### 1.2.0
- Added: seven cards: conditional (`custom:nuvio-conditional-card`), glance, statistics, humidifier, timer, logbook and web page, each in **+ Add** with a live preview. HA `conditional` cards become the Nuvio conditional card.
- Added: *Turn kiosk mode off* in the user menu when Kiosk Mode is installed (admins only). It reloads with `?disable_km` and keeps it while you move between views in this tab; the same item turns it back on.
- Added: a form library (`hgForm`, `nuvio-check` switch) used by the component forms and the backup editor; browser datalists are replaced by the glass suggestion list.
- Changed: cards, tiles and inner panels in light mode are less transparent.
- Changed: the slider card also controls a humidifier's target humidity.

### 1.1.0
- Added: layout containers like in Home Assistant: grid (`custom:nuvio-grid-card`), vertical stack and horizontal stack, in a new *Layout* group of **+ Add** with live previews.
- Added: a container's form lists its cards. Add any component, tile or HA card, edit each card in its own form, drag to reorder, duplicate, remove and set the column span in a grid. Containers nest up to three levels.
- Added: move a card from the panel into a container from its form, and move a card from a container back out to the panel.
- Added: *Card from HA (YAML)* pastes a card from the Home Assistant code editor. HA `grid`, `vertical-stack` and `horizontal-stack` become Nuvio containers there and in the page config (`keep_ha: true` keeps the HA card).
- Changed: the stack card has a gap, width ratio for side by side cards, a width below which it turns vertical, and dividers that can be turned off.

### 1.0.1
- Changed: the Assist window uses the same glass, accent colour and motion as the other Nuvio windows, in the light and the dark scheme. Your messages, the typing dots, the microphone and the focused field all follow the accent colour.
- Changed: the assistant (model) picker sits inside the message field on the right, with the name shortened when it is too long. The chosen assistant is remembered and also becomes the default in the settings.
- Fixed: in the light scheme the settings and editor windows were too transparent over a busy background.
- Changed: weather details open in the shared Nuvio window, with the same blur and opening and closing animation as other dialogs.

### 1.0.0
The new design is complete: every card is built from the shared glass blocks, updates live and adapts to small, medium and large sizes. This release finishes the work with speed improvements.
- Changed: the bundle is minified, 1253 KB down to 1033 KB (307 KB instead of 366 KB when the server compresses it). Saved layouts and settings are not affected.
- Changed: cards outside the visible part of the page no longer redraw on every state change. They catch up once, just before they scroll into view. On a phone with the sample dashboard a full round of sensor changes now costs about 3.3 ms instead of 4.2 ms.
- Changed: the history, network and editor charts use the shared history store, so the same sensor is fetched from Home Assistant once for all of them.
- Changed (development): `tools/build.py` minifies with esbuild when it is installed (`npm install`); without it the build still works and writes an unminified bundle.

### 0.16.0
- Added: twelve generic cards built from the shared glass blocks: greeting, toggle tile, progress bar, arc, chart, compact room, quick actions, family, cover, lock, fan and to-do list. Each works with any entity of the right domain and adapts to small, medium and large widths. See *Generic cards and containers* above.
- Added: two containers for building dashboards: a stack (several cards in one glass, vertical or horizontal) and tabs (pills that switch between sets of cards). Both accept Nuvio cards and regular Home Assistant cards.
- Added: a sample dashboard made only from the new cards, `docs/examples/inspiration-dashboard.yaml`, modelled on the reference design.
- Added: the new cards in the *Add component* gallery of the editor, with previews.
- Changed: Nuvio cards placed in a regular Home Assistant view blur and tint the background themselves, so they look like glass instead of a faint film. Inside the Nuvio page nothing changes (the panel still blurs once for all cards).
- Added: dialogs can return what was typed into their fields (`hgOverlay.dialog({ collect: true })`), and Enter in a field presses the main button. The lock card uses it for lock codes.
- Added (development): one shared history store (`src/parts/ui/history.part.js`), so several cards with the same sensor and period ask Home Assistant once.

### 0.15.0
- Changed: every card now updates live, including the light, lamp, slider, air conditioning, alarm, assistant, robot and room cards. A state change no longer rebuilds these cards, so an open media player or camera inside a room card keeps playing, and the code field in the alarm card keeps what you typed.
- Changed: buttons, switches and icon circles in all general cards use the same glass, glow and spring motion as the new building blocks. Icon circles are round, active buttons glow softly in the accent colour, and switches stretch slightly while pressed.
- Changed: inner corners follow the design tokens: cards 24 px, tiles and tracks inside cards 16 px, small chips 12 px, the same at every card size.

### 0.14.0
- Changed: one look and one motion for every window above the dashboard. Confirmations (for example "Turn everything off?") are now glass windows that grow in softly over a blurred background, keep keyboard focus inside, return it to the button you came from, and close with Escape. They also appear above the first-run wizard, where they used to be hidden behind it.
- Added: glass tooltips. Icon buttons and elements with a hint show a small white label after a short hover or keyboard focus, instead of the browser's grey tooltip. Hints that only repeat the visible text are skipped.
- Changed: notifications at the bottom of the screen use the shared motion tokens and now stay above open windows.
- Added (development): `hgOverlay` in `src/parts/ui/overlay.part.js` with `dialog`, `alert`, `sheet` (from the bottom on phones, from the side on wide screens, drag down to close), `popover`, `menu` (arrow keys, checked items), `toast` and `tip`. `HGConfirm.ask` keeps its signature and now uses `hgOverlay.alert`. The notification stack moved to `src/parts/ui/toast.part.js`. The gallery page shows every overlay.

### 0.13.0
- Changed: cards now update live. When a device changes state, only the parts of the card that changed are updated instead of redrawing the whole card, so bars and switches glide to the new value, focus and scroll position stay, and fast sensors no longer make cards flicker. Cards with their own drag controls (light, AC, slider, lamp, room) keep the previous behaviour for now.
- Changed: switches move with a soft spring and stretch slightly while pressed.
- Added (development): shared building blocks in `src/parts/ui/` (icon button, pill, tabs, switch, header, big value, progress bar, arc, area chart, avatars) and a gallery page `tests/ui-gallery.html`.

### 0.12.0
- Changed: new glass look for cards, panels and floating controls, closer to the reference design. Glass now has a soft light reflection from the top left corner, a thin bright rim that is stronger at the top, and a deeper soft shadow. In the dark scheme the panel behind the cards is darker, so cards stand out more.
- Added (development): design tokens for shape, glass, motion and type in `src/theme_head.js`, described in DESIGN.md.

### 0.11.2
- Changed (development): every card now lives in its own source file in `src/parts/cards/` (57 files instead of 14), and helpers shared by several cards are in `src/parts/shared/`. The dashboard works exactly as before: the built bundle contains the same code. This is the first step of the new component library and design.

### 0.11.1
- Fixed: on tablets (iPad and other touch screens from 768 to 1180 px, both orientations) the dashboard uses the tablet layout, where the page scrolls instead of the glass panel. Room views no longer clip cards at the top, overlap columns or show a misplaced blurred block; they use a grid of up to two columns.
- Fixed: the assistant picker list in the Assist dialog opens right under its button instead of somewhere else on the screen, and the dialog is centred with more room for the picker label.

### 0.11.0
- Changed: Assist is now a glass dialog instead of a card. Open it with the microphone button in the header or the A key; on a phone it slides up as a bottom sheet. The conversation, assistant picker, microphone, suggestions and spoken replies stay, and the conversation continues for the whole session. Close with X, Escape or a tap outside.
- Added: Assist settings in Ustawienia, tab Nagłówek i nawigacja: header button, A shortcut, default assistant, spoken replies, microphone and your own suggestions.
- Changed: Assist is no longer offered in + Dodaj. Existing Assist cards show a small button that opens the dialog.
- Fixed: swiping the settings tabs, a slider, a picker or a horizontally scrolling row no longer switches the dashboard view, and view swipe is off while a dialog is open.

### 0.10.2
- Fixed: the Assist card has its own blurred glass surface, so content behind it no longer shows through. Bubbles, suggestion chips and the input field have stronger contrast.

### 0.10.1
- Fixed: the Assist card title stays visible next to the assistant picker.

### 0.10.0
- Added: Assist card. Talk to Home Assistant Assist from a glass card: text field, microphone (browser speech recognition), assistant picker, replies in chat bubbles, conversation continues across questions, optional spoken replies, suggestion chips. Full form configuration, JSON field and export and import.
- Added: DESIGN.md with the UI rules every new feature must meet.

### 0.9.1
- Changed: the screensaver shows plain white text and icons with a soft shadow, without panels behind them. The wake hint is centered at the bottom with a gentle pulse that respects reduced motion.
- Changed: all sliders use one custom style: slim track, accent fill, white thumb that grows on hover and drag, clear keyboard focus.

### 0.9.0
- Added: 13 new components in + Add: light with brightness, thermostat, big value, history graph, doors and windows, batteries, vacuum, mini player, clock, sun, note, image or page, updates.
- Added: settings panel with tabs (Appearance, Views, Rooms, Header and navigation, Backgrounds, Screensaver, Backup), labelled view settings table.
- Changed: tile sizes S, M and L are real grid spans with dense packing, so smaller tiles sit next to each other.
- Changed: card content scales with the tile size through container queries.
- Changed: fuel price rows in the header settings are stacked cards with shorter sensor names grouped by integration.
- Fixed: the title edit button stays next to the title in full width views.

### 0.8.1
- Fixed: widgets added in edit mode now follow the view column count, so Energy and Network use the full width with 3 columns.

### 0.8.0
- Added: column count for every view on desktop and tablet, including the built in views such as Energy.
- Added: per view icon, short phone bar label and sidebar visibility and order. Long phone bar labels shrink instead of being cut off.
- Added: weather entity choice for the header, automatic choice prefers an entity with a forecast, and an optional forecast sensor (any entity with a `forecast` attribute, for example from MQTT) for the hourly strip.
- Added: household strip position, left or next to the panel.
- Added: background focal point, saved in the layout.
- Fixed: a full width panel (and other per view or appearance settings) could be lost when the dashboard was open in another browser tab, because layout sections were saved as a whole. They are now merged key by key.
- Fixed: in Rooms, an entity under Other that belongs to a custom room shows that room name.

### 0.7.1
- Fixed: room views now use hot water, stairs, entity names and camera settings from Appearance, Rooms (before, only names, icons, order and sensors were applied).
- Fixed: the room view header shows the room name, temperature, humidity and a back button instead of the generic title.
- Fixed: saving Appearance, Header and navigation no longer drops the household people list.

### 0.7.0
- Added: components for everything Home Glass shows, each in + Add with a preview and a full settings form: Rooms, Room, Appliance (washer, dryer, dishwasher with state, program, time left and progress), Hot water, Stairs, Fuel prices, Air conditioning card, Energy week, Phases, Solar, Network, Home sensors, Shortcut and Person.
- Added: every card component has an Advanced configuration (JSON) field, so any card option (labels, colours, thresholds, actions) can be edited in the form.
- Added: Appearance, Rooms: room names, icons, order and visibility, temperature and humidity sensor per room tile (automatic, picked or none), custom rooms with any entities independent of Home Assistant areas, and manual entity assignment.
- Added: Appearance, Header and navigation: household title or no household strip, fuel prices in the dashboard header, and the four views on the phone bar.
- Added: Appearance, Background gallery: your own images saved in the layout, also used by the wall tablet slideshow.
- Changed: Layout backup export and import carry all of the above, and the missing entity check includes room and fuel sensors.

### 0.6.5
- Fixed: wall tablet (screensaver) settings were not saved when another Home Glass based dashboard was installed as a Lovelace resource on the same Home Assistant. Both bundles shared one in-memory layout store, so Nuvio wrote to the other dashboard's key, which has no screensaver section. Nuvio now keeps its own globals, and every build gets a new content-hashed file name.

### 0.6.4
- Changed: the **Climate** card is back to the look from 0.5.0 (large temperature with arrows, the tick slider and the mode buttons); the round dial from 0.6.0 is gone. The touch handling stays: swipe the slider sideways to set the temperature (swiping up or down scrolls the page, a tap jumps to that spot), hold the temperature to open the entity details, tap it to turn a switched-off unit on, hold the arrows to repeat, a light vibration on every step (Home Assistant app or supporting phones), and Page Up/Down, Home/End on the keyboard.

### 0.6.1
- Wall tablet mode: the clock no longer sits on a glass panel. The date is now fixed at the bottom left and, when Home Assistant has a weather entity, the current weather (icon, temperature, condition) appears at the top right.

### 0.6.0
- New look for the **Climate** card: a glass thermostat dial (270° arc) with a cold-to-warm temperature gradient, a draggable knob, a dot for the indoor temperature and a soft glow in the mode colour (orange heating, blue cooling, teal drying) that breathes while the unit is actually working. Mode buttons use the same colours.
- Touch on the Climate card: drag along the arc to set the temperature (the page still scrolls when you swipe through the middle of the dial), hold the centre to open the entity details, tap the centre to turn a switched-off unit on, hold −/+ to repeat. Every step gives a light vibration (Home Assistant app or phones that support it). Keyboard: arrows, Page Up/Down, Home/End.
- Compact climate (room pages): the tick strip is now a glass slider with the temperature gradient. Swipe sideways to set it, tap to jump, swipe up or down to scroll the page.
- Consistency pass across components: inner tiles in Media, Robots, Sensors, Alarm and Cameras use one shared glass surface (same fill and a light top edge) in light and dark mode instead of four slightly different white fills with borders.
- Fixed: on the Rooms view the room name was cut off by the temperature at some widths (e.g. 1440 px); room tiles now grow to fit. Room status dots now use the climate mode colours.

### 0.5.0
- New: **Wall tablet mode** (off by default). After inactivity a glass screensaver with a large clock, the date and a photo fades in and dims the screen; touch, a key press or a motion sensor (any `binary_sensor`, chosen in settings) wakes it. In **Appearance → Wall tablet mode** you set the idle time, dimming level, photo source (dashboard background, slideshow or your own URL) and the sensor, and you can preview it. The clock drifts slightly to protect OLED panels, the screen is kept awake while it shows, reduced motion is respected, and it appears above Home Assistant dialogs. The settings are part of Layout backup.

### 0.4.1
- New look for the first-run wizard: modern glass panel over your background, a step rail on the left with your choices so far (tap a finished step to go back), a live dashboard preview on the welcome screen, smooth step transitions and staggered tiles (reduced motion respected). Rooms get Select all / Clear all, the summary rows open their step, Enter moves to the next step, and colour names follow the chosen language. On phones the steps collapse into a progress bar.
- Fixed: on the welcome screen at wide sizes (e.g. 1440 px) the text under "Welcome to Nuvio" was covered by the photo gradient. The text now sits on the glass, next to the preview.

### 0.4.0
- New: layout backup in Appearance. Export the whole layout to a versioned JSON file or the clipboard, choosing what to include, and import it from a file, drag and drop or pasted text. Import validates the file, shows a summary with views, widgets and entities missing on this instance, offers Replace or Merge, keeps the current layout as a backup with one click Restore previous, converts older data and rejects bad files with a clear message. Admin only.

### 0.3.24
- Fixed: a changed icon now shows in the live preview while editing, not only after saving. Group layouts (List, Grid, Carousel, Compact list) had no icon in the preview header at all, and section previews could change the wrong icon instead of the section header's icon.

### 0.3.23
- Fixed: the icon picker (Icon field) now follows the light and dark theme. In dark mode the list was light with white, barely visible icons; now it is frosted glass in the theme's own colours with clear icons and labels in both modes. It opens and closes with a short animation, the arrow turns while it is open, the list header shows how many icons match the search, a placeholder grid shows while icons load, and the list fades out at the bottom edge. Reduced motion is respected.

### 0.3.22
- Fixed: live previews in the component and card settings sheets are no longer oversized or stretched. A new component is previewed at its natural height and panel width; an existing card at the exact size it has on the page; both are scaled down to fit and centred, without empty space. Tile and group previews keep the panel width instead of spanning the whole sheet.

### 0.3.21
- Changed: removed CI/CD (the GitHub Actions release workflow, including the HACS validation job). Releases and tags are built only locally with `tools/release.sh`.

### 0.3.20
- Added: hover and keyboard focus on the tiles in the More views pop-up (brighter glass, soft shadow, slight lift; press feedback; no lift on touch screens or with reduced motion).

### 0.3.19
- Fixed: the More views pop-up next to the rail now sits clearly above the zoom toolbar and the household panel: denser glass with a stronger blur, a light dim behind it, and the clip used for the opening animation is dropped once it finishes (it switched off the glass blur in some browsers, so content showed through). Clicking outside or pressing Escape closes it.

### 0.3.18
- Fixed: the weather in the header uses the animated icon again (0.3.17 switched it to the still icon by mistake; it was not the cause of the glow band).
- Includes the 0.3.17 changes, which were never tagged: no glow band on half-width panel views, and the tab and rail indicators no longer keep a permanent GPU layer.

### 0.3.17
- Changed: the tab and rail indicators no longer keep a permanent GPU layer (they are promoted only while they animate).

### 0.3.16
- Fixed: Done, Save and other primary buttons commit and close without asking. The Discard changes confirm appears only when closing a form with unsaved changes (card settings, component form) with X, Escape, the backdrop or a swipe; sheets that apply changes live (Appearance, title, Restore hidden, the gallery) never ask.
- Fixed: cancelling edit mode restores the layout correctly again (the unsaved changes check from 0.3.13 overwrote the edit mode snapshot).
- Fixed: the Discard button uses the Home Assistant error colour instead of a fixed red, and the Add tile in edit mode keeps the size of a small tile.

### 0.3.15
- Fixed: the hide panel button switches its icon (eye) and label and reports its state with aria-pressed.
- Fixed: long entity names on tiles no longer get cut at the top and bottom; they wrap to 2 lines with an ellipsis, and unknown values show No data instead of a dash.
- Improved: the size picker is a glass segmented control with size glyphs, equal widths and the labels Small, Medium and Full width, with the selected one in the accent colour.
- Fixed: in edit mode the Add tile flows as the next grid cell, the same size as a small tile, without empty rows; the drag, remove and size handles sit neatly on the tile edges.
- Fixed: all footer buttons in dialogs have the same height and padding, aligned right, and stack full width on phones.
- New: the Icon field has a searchable icon picker with the full MDI list from Home Assistant, recent icons, keyboard navigation and a live preview; typing mdi:name by hand still works.

### 0.3.14
- Fixed: a view or panel with no visible items shows the Empty view state with an Add widget button, live after deleting, hiding, undo or redo, in edit mode and normal mode, on every view type. Undo restores the items and hides it again.
- Fixed: the Undo button in notifications uses the text color that matches the theme accent.

### 0.3.13
- Fixed: the component form opened from card settings goes back to where it was opened from (Back closes it) instead of the gallery. Every edit sheet now uses one navigation stack.
- Improved: typed text, search and selections survive going back and forth, scroll position is kept per step, focus moves to the step title and returns to the control that opened the step. Escape steps back. Closing with unsaved changes asks for confirmation (Discard or Stay), only when something changed. On a phone, swipe down closes only the top level and a swipe from the left edge goes one step back. Slides follow reduced motion settings.
- New: the user menu shows the Nuvio version and an update pill (from the HACS update entity, or GitHub releases checked at most every 6 hours) with a dot on the avatar, plus a reload hint when a newer file is already on the server.

### 0.3.12
- Fixed: navigation in the edit sheets works as a stack. In a nested step (choosing an entity, the component form, the widget style, changing an entity from card settings) the X, Escape and a new back arrow return to the previous step with its state kept; only the X on the top level (the + Add gallery or settings) closes the sheet. Steps slide in and out without the sheet closing and reopening.

### 0.3.11
- Changed: designed previews in the + Add gallery. Every component shows a small mock with sample data, marked as a preview (slider with fill, button, entity rows with toggles, select, stepper, gauge arc, light, sensor value, sparkline, climate, cover, scenes, media player, cameras, power, energy, weather, people, alarm, robots, agenda, map) in the same glass and accent style. A live preview with a real entity is used only when every entity it needs has a known state.
- Changed: components without a matching entity stay selectable, are only slightly dimmed and show one short line (No matching entity) with the required domains in smaller text and a tooltip. Cards have equal heights, previews have one height and long texts are clamped on phone, tablet and desktop.

### 0.3.10
- New: panel width per view. Every view (built in and custom) offers **Narrow panel** (a right column like the main Panel, leaving the left side for the title and background) or **Full width panel** (like Rooms), with small previews. The choice is in the view title sheet (edit mode, title) and in the custom view form, applies live without reopening the dialog and is saved per view. A narrow panel holds at most two columns; on phones the panel is always full width.
- Changed: the empty view hint stays visible until a custom view has three items and sits below the tiles, so a view with a single row no longer looks empty.

### 0.3.9
- Fixed: custom view layouts now really differ. **Grid** keeps equal rows with cards stretched to the row height, **Columns** stacks cards top down in each column in order without aligning rows, **Masonry** places each card in the shortest column, and **Panel** shows the weather on top with two columns. Saved per view and applied after reload.
- Fixed: the view settings dialog updates in place. Choosing a layout, icon or other option no longer closes and reopens the dialog; scroll position, typed text and focus are kept.

### 0.3.8
- New: one glass select for all of Nuvio. Every dropdown (view columns per device, max width, media player source) now uses a glass trigger that matches the inputs and an animated glass list with the blur visible from the first frame, a check mark in the theme accent on the selected option, full keyboard support (arrows, Home, End, Enter, Esc, type to search), ARIA listbox semantics, closing on outside click, flipping up near the bottom edge and larger touch targets on phones. The list renders above sheets and other glass, so it is never clipped. The native select stays underneath as the source of the value.

### 0.3.7
- New: remote fallback for images and fonts. Nuvio loads backgrounds, gallery thumbnails and fonts from the local install first and, if a file fails to load, from jsDelivr pinned to the running version (`cdn.jsdelivr.net/gh/kczepiec/nuvio@v<version>/dist/`). Offline installs keep working with local files.
- Fixed: glass seams on photo backgrounds. Background dimming is now a single overlay instead of a CSS filter on the full screen photo, and the background layers are plain fixed layers again, so blurred elements sample one uniform backdrop.
- Fixed: the rail "More" popover is frosted from the first frame (reveal animation instead of fading opacity, which disabled the blur) and its tiles keep equal height and alignment.
- Fixed: views with the same title or similar paths. The active rail item matches whole path segments (`/nuvio/test` no longer lights up for `/nuvio/test2`), and `rail_overflow` accepts a view path and never maps two entries to one item.

### 0.3.6
- New: section width. The settings of a dashboard section offer **Automatic**, **Full width** or **Half** with a small visual preview; on phones every section is full width. Saved per section.
- New: in edit mode Nuvio checks the server for a newer `nuvio.js` and asks for a reload without cache (Ctrl+Shift+R) when the browser runs an older cached build. The + Add gallery header shows the loaded version.
- Changed: empty-state hint cards use a 16 px radius and a smaller icon tile.
- Fixed: background thumbnails that fail to load show "Image not loaded" instead of a silent gradient, and log the URL in the console.
- Fixed: the selected background thumbnail had a double focus outline; keyboard focus is now one rounded ring in the accent colour, none on mouse click.
- Fixed: background and shade are single full screen GPU layers, so glass elements sample one backdrop (aimed at a vertical seam seen in Chrome on macOS).

### 0.3.5
- Fixed: a background chosen in an older version (stored with the old `assets/backgrounds/` or `assets/bg/` path) is migrated to the new flat `nuvio-bg-*` file, so it shows again after updating.

### 0.3.4
- Fixed: fonts, backgrounds and weather icons were missing after a HACS install. HACS only downloads files that sit directly in `dist/`, so all assets now live there with unique names (`nuvio-font-*`, `nuvio-bg-*`, `nuvio-meteo-*`); background credits are in `dist/CREDITS.md`.
- Fixed: the asset base is taken from the module URL, so a manual install under `/local/nuvio/` loads its own fonts and backgrounds instead of `/hacsfiles/nuvio/`.

### 0.3.3
- Fixed: in edit mode the drag handle and X of the first block in a room column were drawn on the previous column's block; every block now has exactly one handle (top left), one X (top right) and S/M/L inside it.
- Changed: releases no longer attach `nuvio.zip` or `nuvio.js`. HACS then installs the full `dist/` folder including `assets/` (fonts, backgrounds); with attached files it skipped `dist/` and kept an old build. Manual install uses `dist/` from the release source archive.

### 0.3.2
- The + Add gallery header shows the loaded Nuvio version, so an outdated or cached bundle (no Basic group) is easy to spot. After updating in HACS, reload the browser (Ctrl+Shift+R) or clear the app cache.

### 0.3.1
- Fixed: the generic components (Slider, Button, Entity list, Select, Stepper, Gauge) were missing from the + Add gallery in rooms (the room gallery only listed tile components); they now appear in a **Basic** group with live thumbnails, and rooms render added components.
- Changed: the component form no longer shows a display mode picker; genuine variants are labelled **Component options**.
- Fixed: unchecked checkboxes in the room import dialog were invisible on dark backgrounds.

### 0.3.0
- New: empty room view with two actions. **Import from area** shows the area's entities (and entities whose name matches the room) with checkboxes, a **Pick entities** search for manual choice, and an option to also assign them to the area in Home Assistant; selected entities become tiles arranged by type (climate and cameras large, media medium). **Create custom layout** opens edit mode with an empty room and the + Add gallery.

### 0.2.1
- Fixed: HACS registered `nuvio.zip` instead of `nuvio.js` as the dashboard resource, so the dashboard strategy never loaded ("Timeout waiting for strategy element").

### 0.2.0
- Fixed: scene buttons now call `scene.turn_on` (they did nothing before).
- Fixed: kW / MW power sensors are converted to watts in the power, energy, phases and PV cards.
- Fixed: cameras in the room view no longer break after ~10 minutes (rotating image token).
- Fixed: layout saves merge with the latest server copy (no overwrite between devices); the local cache is per Home Assistant user.
- Fixed: AC chevrons no longer keep repeating after release outside the card; `heat_cool` range thermostats are read-only; 0.5 °C default step.
- Fixed: TV in standby turns on; play/pause, cover and valve buttons respect what the device supports.
- Fixed: month calendar refreshes; alarm code field keeps focus; weather uses the precipitation unit and text wind bearings.
- Fixed: page no longer crashes with an empty rail; leaving edit mode by navigation saves instead of discarding.
- Added: English UI for all cards, the page and edit mode.
- Added: keyboard reordering in edit mode; undo after removing a tile restores only that tile.
- HACS: fonts, backgrounds and weather icons are installed with the plugin (whole `dist/` folder).
- Multi-step onboarding wizard; custom views (Appearance → Views); Map and Calendar components and views.
- General components: slider, button, entities, select, stepper, gauge.
- Empty-state hint cards, display modes for group cards, editable view title and subtitle, stacked toaster.

### 0.1.1
- Component-first "+ Add" gallery with live preview; kiosk drawer fix; component catalog in the README.
