<p align="center">
  <img src="assets/brand/final/png/nuvio-horizontal-badge.png" alt="Nuvio" width="300">
</p>

<p align="center"><strong>Je huis, rustig op orde.</strong></p>

<p align="center">
  <a href="https://hacs.xyz"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5?style=flat-square" alt="HACS Custom"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.8.0%2B-18BCF2?style=flat-square&logo=homeassistant&logoColor=white" alt="Home Assistant 2024.8.0+">
  <img src="https://img.shields.io/badge/version-v2.26.1-a3e635?style=flat-square" alt="v2.26.1">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT"></a>
  <a href="https://discord.gg/rFG9y2hFMJ"><img src="https://img.shields.io/discord/1563057427367075850?style=flat-square&logo=discord&label=Discord&color=a3e635" alt="Discord"></a>
</p>

<p align="center"><a href="README.md">English</a> · <a href="README.pl.md">Polski</a> · <a href="README.fr.md">Français</a> · <b>Nederlands</b></p>

<p align="center">
  <img src="docs/screenshots/demo_dashboard_dark_1440.png" alt="Nuvio-weergave Thuis in het donkere thema" width="49%">
  <img src="docs/screenshots/demo_rooms_light_1440.png" alt="Nuvio-weergave Kamers in het lichte thema" width="49%">
</p>

## Wat Nuvio is

Nuvio is een dashboard in glasstijl voor Home Assistant: pagina's, navigatie, kaarten en een editor ter plekke, geleverd als één frontend-plugin. Het bevat geen vastgecodeerde entiteiten. Bij de eerste start leest Nuvio je gebieden, apparaten en entiteiten uit Home Assistant en bouwt het de weergaven voor je op. Daarna kan alles in de bewerkmodus worden aangepast.

## Belangrijkste functies

- **Een dashboard dat zichzelf opbouwt.** Thuis, Kamers, Media, Camera's, Gezin en Energie verschijnen zodra je bijpassende entiteiten hebt. Ontbrekende integraties worden gewoon verborgen.
- **Een begeleide eerste start.** Een stapsgewijze wizard stelt taal, weergaven, kamers, accentkleur en achtergrond in, met een live voorbeeld.
- **Ter plekke bewerken.** Slepen en neerzetten, tegels verkleinen of vergroten, componenten toevoegen uit een galerij, accentkleur en achtergrond wijzigen.
- **Veel kaarten, één stijl.** Meer dan 70 kaarten voor verlichting, klimaat, energie, media, camera's, personen en meer, elk ook los te gebruiken in een gewoon dashboard. Zie [Componenten](docs/nl/components.md).
- **Standaard gedeeld.** Een beheerder richt één dashboard in voor iedereen, en elke persoon kan een eigen indeling krijgen. Zie [Functiegids](docs/nl/features.md#shared-dashboard).
- **Wandtabletmodus.** Tien schermbeveiligingen (klok op foto, bord, minimaal, analoog, flip, aurora, nacht, sterren, woordklok en zonsopgang) met voorbeelden en een optionele pinvergrendeling. Zie [Wandtabletmodus](docs/nl/features.md#wall-tablet-mode).
- **Back-up van de indeling.** Exporteer en importeer de hele indeling als JSON met versiebeheer. Zie [Back-up van de indeling](docs/nl/features.md#layout-backup).
- **Pools, Engels en Frans.** Wissel op elk moment van taal, zonder opnieuw te laden; meer talen kunnen worden toegevoegd als één JSON-bestand. Zie [Taal](docs/nl/configuration.md#language).
- **Lichte en donkere modus**, geschikt voor aanraking, bruikbaar met het toetsenbord in de bewerkmodus, en rekening houdend met verminderde beweging.

## Componenten

Enkele van de componenten, allemaal in dezelfde grootte weergegeven. De volledige lijst met opties staat bij [Componenten](docs/nl/components.md).

<p align="center">
  <img src="docs/components/weather.webp" alt="Weer" width="24%">
  <img src="docs/components/ac.webp" alt="Airco" width="24%">
  <img src="docs/components/airq.webp" alt="Luchtkwaliteit" width="24%">
  <img src="docs/components/eprice.webp" alt="Elektriciteitsprijs" width="24%">
</p>
<p align="center">
  <img src="docs/components/players.webp" alt="Media" width="24%">
  <img src="docs/components/rooms.webp" alt="Kamers" width="24%">
  <img src="docs/components/flow.webp" alt="Energiestroom" width="24%">
  <img src="docs/components/smartlock.webp" alt="Slim slot" width="24%">
</p>

## Snelle installatie

1. Open in HACS het menu, kies *Aangepaste repositories*, voeg `https://github.com/kczepiec/nuvio` toe met de categorie **Dashboard** en installeer daarna **Nuvio**.
2. Ga in Home Assistant naar Instellingen → Dashboards → *Dashboard toevoegen* → *Nieuw dashboard vanaf nul*, open het, kies daarna ⋮ → *Bewerken* → ⋮ → *Onbewerkte configuratie-editor* en plak:

   ```yaml
   strategy:
     type: custom:nuvio
   ```

3. Open het dashboard. De wizard start bij je eerste bezoek.

Handmatige installatie en de aanbevolen aanvullende pakketten staan in [docs/nl/installation.md](docs/nl/installation.md).

## Minimale configuratie

Nuvio werkt zonder opties. Eén optionele instelling bepaalt de standaardtaal van het dashboard; een persoonlijke keuze in Instellingen blijft voorrang houden.

```yaml
strategy:
  type: custom:nuvio
  language: nl        # pl | en | fr …
```

Meer in [docs/nl/configuration.md](docs/nl/configuration.md).

## Documentatie

| Pagina | Wat erin staat |
|---|---|
| [Installatie](docs/nl/installation.md) | HACS, handmatige installatie en aanvullende pakketten |
| [Configuratie](docs/nl/configuration.md) | Opties van de strategie, taal, voorinstellingen |
| [Functiegids](docs/nl/features.md) | Gedeeld dashboard, wandtabletmodus, back-up van de indeling |
| [Componenten](docs/nl/components.md) | Elke kaart, de bijbehorende entiteiten en opties |
| [Roadmap](docs/nl/roadmap.md) | Wat gepland is en wat klaar is |
| [Wijzigingslog](CHANGELOG.nl.md) | Releasenotities van elke versie |
| [Ontwikkeling](docs/nl/development.md) | Build, broncode-indeling en releases |
| [Bijdragen](CONTRIBUTING.md) | Bugs melden en wijzigingen insturen |
| [Ontwerpregels](DESIGN.md) | De UI-regels die elke functie volgt |
| [Gids voor merkgebruik](assets/brand/guide/usage-guide.md) | Hoe je het Nuvio-logo plaatst |

## Community

- Discord: [meedoen](https://discord.gg/rFG9y2hFMJ) (hulp, ideeën, releasewijzigingen)
- Issues: [github.com/kczepiec/nuvio/issues](https://github.com/kczepiec/nuvio/issues)

## Licentie en vermeldingen

Nuvio wordt uitgebracht onder de [MIT-licentie](LICENSE).

Meegeleverde bronnen van derden:
- [DM Sans](dist/nuvio-font-OFL.txt): SIL Open Font License 1.1
- [Meteocons](dist/nuvio-meteo-LICENSE.txt) van Bas Milius, MIT
- [Standaard achtergrondfoto](dist/CREDITS.md): "House in forest" van Flo Pappert, CC0 1.0 (via Wikimedia Commons)
