[English](../installation.md) · [Polski](../pl/installation.md) · [Français](../fr/installation.md) · **Nederlands**

# Installatie

Nuvio vereist Home Assistant 2024.8.0 of nieuwer. Terug naar de [README](../../README.nl.md).

## HACS (aangepaste repository)

1. HACS → ⋮ → *Aangepaste repositories* → `https://github.com/kczepiec/nuvio`, categorie **Dashboard**.
2. Installeer **Nuvio**. HACS voegt de resource `/hacsfiles/nuvio/nuvio.js` toe.
3. Instellingen → Dashboards → *Dashboard toevoegen* → *Nieuw dashboard from scratch*, open het, ⋮ → *Bewerken* → ⋮ → *Onbewerkte configuratie-editor* en plak:

   ```yaml
   strategy:
     type: custom:nuvio
   ```

4. Open het dashboard. De wizard start bij het eerste bezoek.

## Handmatig

1. Download het bronarchief van de nieuwste release (GitHub, Releases, Source code) en kopieer de inhoud van de map `dist/` (`nuvio.js` en de bestanden `nuvio-font-*`, `nuvio-bg-*`, `nuvio-meteo-*`, `nuvio-locale-*`, allemaal plat) naar `/config/www/nuvio/`. Releases hebben geen bijgevoegde bestanden.
2. Voeg de resource `/local/nuvio/nuvio.js` toe (type: **JavaScript-module**).
3. Gebruik dezelfde `strategy`-configuratie als hierboven.

## Aanbevolen aanvullende pakketten

Nuvio werkt zelfstandig, maar voor de schermvullende look uit de schermafbeeldingen zijn deze HACS-pakketten handig:

| Pakket | Waarom |
|---|---|
| [kiosk-mode](https://github.com/NemesisRE/kiosk-mode) | Verbergt de Home Assistant-koptekst en/of zijbalk, zodat alleen het Nuvio-dashboard zichtbaar is (wandtablets, telefoons). De navigatie van Nuvio houdt rekening met kiosk-mode. |
| [custom-sidebar](https://github.com/elchininet/custom-sidebar) | Verbergt of herschikt items in de Home Assistant-zijbalk per gebruiker of apparaat, als je de zijbalk liever houdt maar opschoont. |
| [browser_mod](https://github.com/thomasloven/hass-browser_mod) *(optioneel)* | Maakt van een browser een bestuurbaar apparaat (pop-ups, bediening per apparaat). Nuvio verwerkt de interactie-overlay ervan en slaat de eigen mediaspelers en sensoren van browser_mod over. |
