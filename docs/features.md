**English** · [Polski](pl/features.md) · [Français](fr/features.md)

# Features guide

How the shared dashboard, wall tablet mode, layout backup and the voice assistant work. Back to the [README](../README.md).

## Shared dashboard

Everyone sees the same Nuvio dashboard by default: the layout, appearance, views, rooms and wall tablet settings an administrator sets up.

- **Who edits**: administrators edit the shared dashboard (edit mode). Other people see it without the edit button.
- **Own layout**: in **Settings → Users** (edit mode, admins only) every Home Assistant user has a switch. Turn a person off and they get their own layout: it starts as a copy of the shared one, the edit button appears for them, and their changes affect only them. Turn them back on to return them to the shared dashboard. Your own account stays on the shared dashboard.
- **Who sees a view**: in **Settings → Views** each view (except Home) has a people button. Every view is visible to everyone by default; turn a person off to hide the view from them, including from their own layout. Their screen reloads on its own to drop the view.
- **Live**: changes to the shared dashboard and to the list reach open screens without a reload.
- **Storage**: the shared layout lives in a hidden storage dashboard `nuvio-shared` (*Nuvio (shared layout)*, named in the language of the admin who created it, admins only, not in the sidebar). Only admins can write it; do not edit it by hand. Own layouts stay in Home Assistant user data (`frontend/set_user_data`, key `nuvio_layout`), with a local copy per user. Assist settings are always personal.
- **Upgrading from 1.3.x**: the first time an admin opens Nuvio 1.4.0, their current layout becomes the shared dashboard. Until then everyone keeps their own layout as before.

## Wall tablet mode

A screensaver for a tablet on the wall. It is **off by default**; admins turn it on in **Appearance → Wall tablet mode** (edit mode) and press **Done** to save.

- **Start after inactivity**: 30 s, 1, 2, 5, 10 or 30 min without touch, mouse or keyboard input (default 2 min).
- **Dimming**: 0 to 90 %, how dark the screen gets under the clock (default 50 %).
- **View shown on wake**: *Last view used* (default), *Home* or any enabled view. When the screensaver starts, the dashboard switches to that view behind it, so it is the one you see when you wake the screen. Not in edit mode or in the preview; a view locked with a PIN asks for it on wake.
- **Photo**: your dashboard background, a slideshow of the bundled backgrounds (crossfade every 45 s) or your own image URL (`https://…` or `/local/…`).
- **Motion sensor**: pick any `binary_sensor`; motion, occupancy and presence sensors are listed first. When it turns `on` while the screensaver is showing, the screen wakes. Without a sensor, only touch wakes it.
- **Wake**: touch, key press or scroll. The first touch only wakes the screen and does not press the tile underneath.
- **Screensaver style**: *Clock on photo* (described below) or *Board*: a light or dark board with a large weekday or clock and the date, sunrise and sunset, a countdown to the next all-day event, weather with forecast, upcoming events, now playing, a photo and room temperatures. In Board mode you choose the theme (auto by the sun, light, dark), the heading, which elements are shown, the order of the cards, the weather entity and which calendars and rooms are used.
- More styles (2.16.0), each with a preview tile in the gallery: *Analog clock* (frosted glass face over the photo, accent second hand, date, weather), *Flip clock* (two flip cards for hours and minutes), *Aurora* (thin clock over slowly flowing light in the accent colour) and *Night* (dim warm clock on black for bedrooms and OLED screens, moves further every minute). The weather comes from the weather entity chosen for Board, or the first one available.
- **Clock appearance**: font (system, serif, mono, rounded or your own `/local/…` or `https://…` font), size, weight, colour (white, accent or own), shadow and opacity, with a live preview. Applies to the clock on photo, Night, Aurora, Flip and Minimal styles; **Reset to style defaults** restores the look of each style.
- **Preview screensaver** shows it immediately; touch to close.
- Layout: a large clock in the centre (no panel behind it), the date fixed at the bottom left and, if Home Assistant has a `weather` entity, the current weather (icon, temperature, condition) at the top right. The clock follows your HA time format (12 / 24 h) and language, moves slightly every minute to protect OLED panels, asks the browser to keep the screen on while showing (Screen Wake Lock) and respects reduced motion.
- It only starts on the Nuvio dashboard (not in edit mode, not in a background tab) and is drawn above Home Assistant dialogs.
- **PIN lock (BETA)**: turn on *PIN lock*, set a PIN of 4 to 8 digits and choose when the screensaver locks (at once, after 1, 5, 15 or 30 min). A locked screensaver does not wake on touch or motion: touching it blurs the photo and shows a round glass PIN pad with the PIN dots above it and a **Lock** button below it, which returns to the screensaver. After 5 wrong PINs the pad waits 30 s (longer after more attempts), and it closes by itself after 20 s without a touch. **Lock screen** in the user menu locks right away, and a reload of the page stays locked. Only a hash of the PIN is stored. The lock keeps the tablet from casual use and does not replace the Home Assistant password.
- Settings are part of the layout: on the shared dashboard they apply to everyone, and a person with their own layout has their own. See [Shared dashboard](#shared-dashboard).
- **Screensaver on this device** (2.21.0): the settings are shared, but whether the screensaver runs is chosen per device and saved in that browser only. Turning the screensaver on turns it on for the device you are using; on a phone or a computer, turn **Screensaver on this device** off and the wall tablet keeps it. A device that never chose stays off, except a tablet that was locked with the PIN before the update.
- **PIN lock for views (BETA, 2.21.0)**: pick views (for example Cameras) that ask for the PIN before they show anything. It uses the PIN of *PIN lock*, so set that first. After the right PIN the view stays open for 5 minutes in that browser tab, until the screensaver starts or someone uses **Lock screen**: then every unlocked view closes and the view on screen asks for the PIN again after waking; **Back** returns to the previous view. This is a convenience lock against casual use, not security: anyone with a Home Assistant account can see the same data in another dashboard.

- **Commands from Home Assistant (BETA, 2.23.0)**: a tablet can obey automations without browser_mod. In **Appearance → Wall tablet mode** give this tablet a name, saved in its browser only (for example `salon`), and optionally pick a helper. Then send either an event `nuvio_command` with `device`, `action` and `view`, or write the same values into the `device`, `action` and `view` attributes of an `input_text` helper. The event needs an administrator account; the helper works on every account, so it is the way for a restricted user. `wake` lifts the screensaver, `screensaver` shows it, `lock` shows it and asks for the PIN when the PIN lock is on, and `navigate` opens a view given by path or title (`kamery`, `Kamery`, `/nuvio-…/kamery`). A locked screensaver does not navigate anywhere. The helper remembers only the last command: Nuvio runs it once when it changes and once after a page reload, so a stale command never repeats. Example: a doorbell or a motion sensor at the gate wakes the tablet and opens the camera view.
- **Quick buttons (BETA, 2.24.0)**: up to 3 glass buttons on every screensaver style (photo, board, glass). In **Appearance → Wall tablet mode → Quick buttons** add an entity from the list, choose the action, and optionally a name, an `mdi:` icon and *Hold to confirm*. Scripts, scenes, buttons and `input_button` run; switches, lights, fans and `input_boolean` toggle, turn on or turn off; covers open, close or toggle; alarm panels arm away, arm home, arm night or disarm. A tap runs the action **without waking** the screensaver. *Hold to confirm* (on by default for covers and alarm panels) needs a hold of about 0.6 s with a ring that fills up. The buttons are hidden while the screensaver is locked with a PIN. The screensaver preview runs the real actions: tapping a quick button while previewing really operates the device. An alarm panel with a code asks for it on an on-screen keypad (a password field for a text code) each time: arming asks only if the alarm requires a code, disarming asks whenever the panel has one. The code is sent to Home Assistant as `code` and is never stored. The buttons are part of the screensaver settings, saved in the layout (`wall.qa`) and shared like the other screensaver settings; only administrators can change them.

## Dashboard style

**Settings > Appearance > Dashboard style** (2.16.0) has eight ready-made looks, each shown as a small thumbnail of the dashboard: Nuvio (default), Frost, Midnight, Sunset, Forest, Ocean, Pastel and Graphite. A style sets the accent, the background, the dimming and the glass (tint of cards, tiles and panel, blur strength and, for Pastel and Graphite, the corner radius). The accent and background can be changed afterwards. With *Glass blur* off, the dense readable fill is kept. The choice is saved with the layout (`app.look`), so it is part of the backup.

**Settings > Appearance > Panel background** (2.21.0) turns off the shared glass panel behind the cards. Off, the cards sit right on the wallpaper, each with its own glass, without the common frame (the same as `panel_backdrop: false` in the page config). **This view** overrides the choice for the view you are on: *As everywhere*, on or off.

## Performance

Older tablets drain their battery fast when every glass surface is blurred and decorative animations keep running. **Settings > Appearance > Performance** has two options, saved on this device only, so a wall tablet and a desktop can differ:

- **Glass blur**: *Full* (desktop default), *Light* (touch default: weaker blur, no heavy shadows), *Off* (no blur at all; glass gets a denser fill and dialogs are opaque). *Auto* picks one of these and shows which.
- **Power saving**: stops looping animations (screensaver photo zoom, spinning fans, pulsing rings, the washing machine drum and similar) and refreshes camera snapshots at most every 30 s. *Auto* turns it on for iPads and iPhones on iOS or iPadOS older than 18 and for very weak hardware; blur on *Auto* is then off as well.

Independent of these options, animations in cards scrolled off screen pause, and *Reduce transparency* in the system settings turns blur off on *Auto*.

## Layout backup

Admins can export and import the whole Nuvio layout from **Appearance → Layout backup** (edit mode).

- **Export** downloads `nuvio-uklad-YYYY-MM-DD.json`; **Copy to clipboard** copies the same JSON. Choose what to include: views and custom views; layout, widgets with their entities, titles, section widths and hidden items; appearance (accent, background, dimming); view panel widths; wall tablet mode settings.
- **Import** accepts a file (picker or drag and drop) or pasted JSON. The file is validated and a summary shows the number of views, widgets, sections and entities, with entities missing on this instance highlighted. Pick the parts to import and **Replace** or **Merge**.
- Before importing, the current layout is kept as a backup; **Restore previous** in the notification (or in the Layout backup section) undoes the import with one click.
- The file is versioned (`format`, `schema`, `nuvio`, `exported`). Older raw layout data is converted automatically; files from a newer schema or damaged files are rejected with a clear message.

## Studio view (beta)

An optional view with a free widget grid, off by default.

- **Enable**: **Settings → Views**, switch on **Studio**. Home and your saved layouts stay untouched. The first Studio layout is built once from your own entities and never regenerated.
- **Edit mode**: drag a widget by its handle, resize it from the corner, open its menu to pick a size or hide or remove it, and use the dashed **Add widget** tile to add one or show a hidden one again. Other widgets move aside and compact. Arrow keys move a focused widget, Shift and arrows resize it.
- **Per-device layouts**: the grid has 12 columns on wide screens, 8 on tablets and 1 on phones (widgets stack in a single column). Changes made at a given width are stored as a separate layout for that width. **Save** keeps them, **Cancel** restores the previous layout.
- The layout is part of the [layout backup](#layout-backup).

## Voice assistant

Talk to the Home Assistant assistant (Assist) without leaving the dashboard. Open it with the microphone button in the header or the **A** key when you are not typing in a field.

<p align="center">
  <img src="screenshots/demo_assist_bar_dark_1440.png" alt="Voice bar on a desktop: what it heard in quotes and the reply below" width="74%">
  <img src="screenshots/demo_assist_bar_dark_390.png" alt="Voice bar on a phone" width="18%">
</p>

- **Voice bar** (default): a glass bar slides in at the top of the screen and listens right away. Green bars follow your voice, then the bar shows what it heard in quotes and the reply below. With **Read replies aloud** the reply is spoken.
- **Hides by itself**: 2 seconds after a spoken reply, otherwise after enough time to read it (2.5 to 8 seconds), also after an error. Escape or a click next to the bar closes it sooner. Tap the bars to stop listening, to interrupt a spoken reply or to speak again.
- **Speech recognition**: the sound goes to the speech-to-text engine of the assistant (for example Whisper or Home Assistant Cloud), the same as in the Home Assistant app. This needs Home Assistant opened over HTTPS (or `localhost`) and an assistant with a speech-to-text engine. Otherwise Nuvio uses speech recognition in the browser (Chrome, Edge, Safari), and if there is none, a text field opens.
- **Follow-up questions**: when the assistant asks back (for example "Which room?"), the bar listens again in the same conversation.
- **When something goes wrong**: no access to the microphone, no microphone, a microphone in use by another app or nothing heard each show a short message, and a text field opens where it helps. When the page goes to the background (another tab, a locked phone), the bar closes and the microphone turns off.
- **Settings**: **Settings > System > Assist**, saved for the Home Assistant user: header button, keyboard shortcut A, default assistant, **Style** (*Voice bar* or *Chat window*, the earlier dialog with bubbles), **Listen on open**, **Keep the conversation going**, **Read replies aloud** (on by default in the voice bar), microphone and suggestions (chat window).
- Settings from earlier versions keep working: with no style saved you get the voice bar, and a saved **Read replies aloud** stays as it was.

## Nuvio TV

**Settings > System > TV** pairs the Nuvio TV app without typing a token. The page is marked Beta. The page is part of the settings panel, so administrators and users with their own layout see it.

- Type the TV address (`10.0.8.117:8798`) and the 6 digit code shown on the TV, or paste the link from its QR code into the address field. The Home Assistant address is filled with the current one and can be changed.
- **Pair** creates a long-lived access token named *Nuvio TV date time* and sends it with the address to the TV over your home network. When Home Assistant is opened over `http://` (typical on a home network) Nuvio sends the data straight to the TV with a background request, with no new tab: the TV answers *accepted*, *wrong code* (check the code on the TV), *too many attempts* (wait and use the new code on the TV) or *rejected*, and in the last three cases the token just created is removed. If the TV app is older and does not allow this request, or the TV cannot be reached in 8 seconds, the result is unknown, so Nuvio keeps waiting for the TV like before. When Home Assistant is opened over `https://`, the data goes in a form that opens in a tab Nuvio opens at the moment of the click (this keeps browsers from blocking it, and the tab closes by itself once the TV has connected; on a timeout it stays open so you can read the TV's own message). If your browser blocks the tab anyway, the token is created and a second button **Open the TV page and send** appears: press it within 2 minutes, after that the unsent token is removed. Only addresses on your home network are accepted: 10.x, 172.16 to 31.x, 192.168.x, 169.254.x and `.local`. The data crosses the network without encryption.
- The TV confirms by writing a marker (`nuvio_tv_seen`) to your Home Assistant user data. Nuvio checks it every second for up to 60 seconds (120 seconds only when the Home Assistant address sent starts with `http://` and its host is not on your home network, because then the TV first asks you to confirm an unencrypted connection with the remote), then shows *TV connected* or removes the unused token. The TV app skips that question for an `http://` Home Assistant on your home network and writes the marker right after it signs in.
- The list shows your Nuvio TV tokens with the date added and the time the TV last connected. **Remove** deletes the token, and the TV returns to its pairing screen.
