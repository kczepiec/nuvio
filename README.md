<p align="center">
  <img src="assets/brand/final/png/nuvio-horizontal-badge.png" alt="Nuvio" width="300">
</p>

<p align="center"><strong>Your home, quietly in order.</strong></p>

<p align="center">
  <a href="https://hacs.xyz"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5?style=flat-square" alt="HACS Custom"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.8.0%2B-18BCF2?style=flat-square&logo=homeassistant&logoColor=white" alt="Home Assistant 2024.8.0+">
  <img src="https://img.shields.io/badge/version-v2.22.1-a3e635?style=flat-square" alt="v2.22.1">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT"></a>
  <a href="https://discord.gg/rFG9y2hFMJ"><img src="https://img.shields.io/discord/1563057427367075850?style=flat-square&logo=discord&label=Discord&color=a3e635" alt="Discord"></a>
</p>

<p align="center"><b>English</b> · <a href="README.pl.md">Polski</a> · <a href="README.fr.md">Français</a></p>

<p align="center">
  <img src="docs/screenshots/demo_dashboard_dark_1440.png" alt="Nuvio home view in the dark theme" width="49%">
  <img src="docs/screenshots/demo_rooms_light_1440.png" alt="Nuvio rooms view in the light theme" width="49%">
</p>

## What Nuvio is

Nuvio is a glass-style dashboard for Home Assistant: pages, navigation, cards and an in-place editor, shipped as a single frontend plugin. It contains no hard-coded entities. On first start it reads your areas, devices and entities from Home Assistant and builds the views for you. After that, everything can be changed in edit mode.

## Key features

- **A dashboard that builds itself.** Home, Rooms, Media, Cameras, Family and Energy appear when you have matching entities. Missing integrations are simply hidden.
- **A guided first run.** A step-by-step wizard sets language, views, rooms, accent colour and background, with a live preview.
- **Edit in place.** Drag and drop, resize tiles, add components from a gallery, change accent colour and background.
- **Many cards, one look.** Over 70 cards for lights, climate, energy, media, cameras, people and more, each also usable on its own in a regular dashboard. See [Components](docs/components.md).
- **Shared by default.** An administrator sets up one dashboard for everyone, and any person can be given their own layout. See [Features guide](docs/features.md#shared-dashboard).
- **Wall tablet mode.** Seven screensavers (clock on photo, board, minimal, analog, flip, aurora and night) with previews and an optional PIN lock. See [Wall tablet mode](docs/features.md#wall-tablet-mode).
- **Layout backup.** Export and import the whole layout as versioned JSON. See [Layout backup](docs/features.md#layout-backup).
- **Polish, English and French.** Switch language at any time, without reloading; more languages can be added as a single JSON file. See [Language](docs/configuration.md#language).
- **Light and dark mode**, touch friendly, keyboard friendly in edit mode, and aware of reduced motion.

## Components

A few of the components, all shown at the same size. The full list with options is in [Components](docs/components.md).

<p align="center">
  <img src="docs/components/weather.webp" alt="Weather" width="24%">
  <img src="docs/components/ac.webp" alt="Air conditioning" width="24%">
  <img src="docs/components/airq.webp" alt="Air quality" width="24%">
  <img src="docs/components/eprice.webp" alt="Electricity price" width="24%">
</p>
<p align="center">
  <img src="docs/components/players.webp" alt="Media" width="24%">
  <img src="docs/components/rooms.webp" alt="Rooms" width="24%">
  <img src="docs/components/flow.webp" alt="Energy flow" width="24%">
  <img src="docs/components/smartlock.webp" alt="Smart lock" width="24%">
</p>

## Quick install

1. In HACS open the menu, choose *Custom repositories*, add `https://github.com/kczepiec/nuvio` with the category **Dashboard**, then install **Nuvio**.
2. In Home Assistant go to Settings → Dashboards → *Add dashboard* → *New dashboard from scratch*, open it, then ⋮ → *Edit* → ⋮ → *Raw configuration editor* and paste:

   ```yaml
   strategy:
     type: custom:nuvio
   ```

3. Open the dashboard. The wizard starts on your first visit.

Manual installation and the recommended companion packages are in [docs/installation.md](docs/installation.md).

## Minimal configuration

Nuvio works without options. One optional setting sets the dashboard default language; a personal choice in Settings still wins.

```yaml
strategy:
  type: custom:nuvio
  language: en        # pl | en | fr …
```

More in [docs/configuration.md](docs/configuration.md).

## Documentation

| Page | What is in it |
|---|---|
| [Installation](docs/installation.md) | HACS, manual install and companion packages |
| [Configuration](docs/configuration.md) | Strategy options, language, presets |
| [Features guide](docs/features.md) | Shared dashboard, wall tablet mode, layout backup |
| [Components](docs/components.md) | Every card, its entities and options |
| [Roadmap](docs/roadmap.md) | What is planned and what is done |
| [Changelog](CHANGELOG.md) | Release notes for every version |
| [Development](docs/development.md) | Build, source layout and releases |
| [Contributing](CONTRIBUTING.md) | Reporting bugs and sending changes |
| [Design rules](DESIGN.md) | The UI rules every feature follows |
| [Brand usage guide](assets/brand/guide/usage-guide.md) | How to place the Nuvio logo |

## Community

- Discord: [join](https://discord.gg/rFG9y2hFMJ) (support, ideas, release changelog)
- Issues: [github.com/kczepiec/nuvio/issues](https://github.com/kczepiec/nuvio/issues)

## License and credits

Nuvio is released under the [MIT License](LICENSE).

Bundled third-party assets:
- [DM Sans](dist/nuvio-font-OFL.txt): SIL Open Font License 1.1
- [Meteocons](dist/nuvio-meteo-LICENSE.txt) by Bas Milius, MIT
- [Default background photo](dist/CREDITS.md): "House in forest" by Flo Pappert, CC0 1.0 (via Wikimedia Commons)
