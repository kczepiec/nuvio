[English](../configuration.md) · [Polski](../pl/configuration.md) · [Français](../fr/configuration.md) · **Nederlands**

# Configuratie

Optionele instellingen voor Nuvio. Terug naar de [README](../../README.nl.md).

Optionele strategieopties:

```yaml
strategy:
  type: custom:nuvio
  language: en        # any available language code (en, pl, fr …): dashboard default (a personal choice in Settings still wins)
```

## Indeling van de instellingen

Open **Instellingen** vanuit de bewerkmodus of het gebruikersmenu. Het instellingenvenster heeft een zijbalk met gegroepeerde pagina's:

- **Algemeen**: Algemeen (taal, prestaties)
- **Uiterlijk**: Thema (dashboardstijl, paneelachtergrond, accent), Achtergrond (achtergrond, dimmen, galerij), Koptekst (koptekst en navigatie)
- **Dashboard**: Weergaven en navigatie (weergaven, weergave-instellingen), Kamers en klimaat
- **Wandtablet**: Schermbeveiliging, pincode en vergrendelingen (pincodevergrendeling van de schermbeveiliging en van weergaven)
- **Systeem**: Assist, Gebruikers, Integraties, Back-up en import, Over Nuvio

Typ in het zoekvak bovenaan de zijbalk om alle overeenkomende instellingen van alle pagina's te tonen; elke pagina toont hoeveel treffers ze heeft. Druk op Escape om de zoekopdracht te wissen. Gebruik in de zijbalk de pijltoetsen, Home en End om tussen pagina's te wisselen. Op een telefoon is de zijbalk een lijst: tik op een pagina om ze te openen en gebruik de terugpijl om terug te keren. De activiteitsdetectie van elk klimaatapparaat in **Kamers en klimaat** is ingeklapt in een geavanceerd blok dat vanzelf opent zodra een eigen bron is ingesteld. Wijzigingen in de bewerkmodus zijn een concept: er wordt niets opgeslagen en het dashboard wordt niet herladen tot je op **Klaar** tikt, wat één keer opslaat en hooguit één keer herlaadt. **Annuleren** verwerpt het concept. Alle instellingen behouden hun opgeslagen sleutels, dus bestaande configuraties werken ongewijzigd.

## Taal

Nuvio is beschikbaar in meerdere talen: vandaag Engels, Pools en Frans, plus elke taal die als catalogus wordt toegevoegd (zie hieronder). Iedereen kiest zijn eigen taal in **Instellingen → Uiterlijk → Taal** (*Automatisch*, daarna één knop per beschikbare taal) of met het taalitem in het gebruikersmenu, dat iedereen kan gebruiken, ook mensen zonder toegang tot de instellingen. Het hele dashboard schakelt in één keer over zonder de pagina te herladen: navigatie, kaarten, instellingen, bewerkmodus, meldingen, getallen en datums. De keuze wordt op dit apparaat en in je Home Assistant-account bewaard, zodat ze je naar andere apparaten volgt.

Welke taal wordt gebruikt, de eerste overeenkomst wint:

1. Je eigen keuze in de instellingen of het gebruikersmenu.
2. De strategieoptie `language:` (dashboardstandaard, ingesteld in YAML). Ze accepteert elke taalcode die Nuvio kent (`en`, `pl`, `fr` …); een regionale code zoals `fr-CA` valt terug op `fr`.
3. De taal die je in de wizard bij de eerste start hebt gekozen. Alleen een taal waarop je echt hebt getikt telt: een taal die oudere versies automatisch hebben opgeslagen (vaak Engels als de browser noch Pools noch Engels was) wordt genegeerd, zodat de browser beslist.
4. De talen van je browser, in volgorde van voorkeur: eerst de volledige code (`pt-br`), dan de taal alleen (`pt`). Is geen ervan beschikbaar, dan Engels.

Teksten die in de gekozen taal niet zijn vertaald, worden in het Engels getoond.

### Een taal toevoegen

Een taal is één JSON-bestand. Er is geen codewijziging nodig.

1. Maak `src/locales/<code>.json`, waarbij `<code>` de taalcode in kleine letters is (`de`, `pt-br` …); de controle en de build weigeren elke andere bestandsnaam. Het makkelijkst begin je met een kopie van `src/locales/en.json`, de referentiecatalogus.
2. Vul het `_meta`-blok in:

   ```json
   "_meta": {
     "name": "Deutsch",
     "locale": "de-DE",
     "flag": "🇩🇪",
     "intro": "Oberfläche auf Deutsch"
   }
   ```

   `name` (de naam van de taal in die taal, getoond in de taalkiezers) en `locale` (gebruikt voor datums, getallen en meervoudsregels) zijn verplicht. `flag` en `intro` zijn optioneel: de wizard bij de eerste start toont ze in de taalstap (anders een wereldbol en de naam).
3. Vertaal de waarden. Laat de sleutels, de `{variables}` en de meervoudsachtervoegsels ongewijzigd en geef elke meervoudsvorm die jouw taal nodig heeft (zie [Ontwikkeling](development.md#vertalingen)). Een sleutel die je weglaat, wordt in het Engels getoond. Schrijf gewone tekst: geen HTML-tags en, buiten het Engels, geen rechte dubbele aanhalingsteken `"` (gebruik de typografische aanhalingstekens van je taal); de controle weigert ze, omdat catalogustekst als HTML in de pagina wordt ingevoegd.
4. Controleer de catalogus: `python3 tools/i18n_check.py --lang <code>` toont de ontbrekende en verouderde sleutels, en `python3 tools/i18n_check.py` controleert variabelen, meervoudsvormen en `_meta`.
5. Bouw met `python3 tools/build.py`. De catalogus wordt gecompileerd naar `dist/nuvio-locale-<code>.<hash>.json` en de taal wordt toegevoegd aan het manifest dat in de bundel is ingebed: ze verschijnt in de instellingen, in het gebruikersmenu en in de wizard, en `language: <code>` en browserdetectie accepteren haar.

Engels, Pools en Frans moeten volledig blijven (`REQUIRED` in `tools/i18n_check.py`); een andere taal mag gedeeltelijk zijn, en de controle waarschuwt dan alleen met de dekking.

> [!TIP]
> Om een gegenereerd dashboard over te nemen als gewone YAML, gebruik je *Take control* in de dashboardeditor. Alle `custom:nuvio-*`-kaarten blijven werken.

## Presets

De configuratie (indeling + uiterlijk) kan als JSON worden geëxporteerd en geïmporteerd. Persoonlijke presets staan buiten de repository.


## Klok, tabbadges en verborgen zijbalk

- **Klok in de koptekst.** Zet `{time}` of `{date}` in de titel of ondertitel van een weergave (koptekst-editor van de weergave, of **Een klok toevoegen**). De tijd volgt de 12- of 24-uursinstelling van je Home Assistant-profiel en wordt elke minuut vernieuwd.
- **Tabbadges.** In **Instellingen > Weergaven** is de cel **Badge** een set schakelaars, en meerdere kunnen aan staan: lampen, schakelaars, ventilatoren, media, klimaat, personen, beweging en **Geselecteerde entiteiten**. Beweging telt binaire sensoren met apparaatklasse motion, occupancy of presence, en alleen terwijl ze aan staan. **Lampen aan** slaat een lampgroep over wanneer minstens één van haar leden in Home Assistant bestaat, zodat de lampen worden geteld en de groep niet. Een groep waarvan de leden geen entiteiten zijn, telt wel mee, en een handmatig gekozen lijst blijft zoals gekozen. Het bovenste tabblad toont de som en verbergt ze bij 0. De huidige weergave toont ook een pictogram en een aantal onder de ondertitel; een chip ontbreekt bij 0 en de rij ontbreekt wanneer alle aantallen 0 zijn. Kamerpagina's houden hun eigen chips. **Geselecteerde entiteiten** opent de doorzoekbare entiteitenlijst (naam en kamer); elke keuze wordt op id opgeslagen. Opgeslagen als `wiz.vx.<view>.badges`, een lijst van `{ m: on | active, d: <domain> }`, `{ m: on, d: binary_sensor, dc: [motion, occupancy, presence] }` of `{ m: on, e: [<entity ids>] }`. Een oudere enkele `badge` wordt nog steeds gelezen.
- **De zijbalk verbergen.** Zet **De zijbalk verbergen** aan in **Instellingen > Weergaven**: de zijbalk en haar knop Instellingen verdwijnen op computers en tablets, wat de **Zijbalk**-schakelaars per weergave ook zeggen (de telefoonbalk blijft). Weergaven die niet in de bovenste tabbladen staan, verhuizen naar het profielmenu. Om terug te keren naar de instellingen gebruik je het profielmenu, het potlood, of open je een Nuvio-weergave met `?nuvio_settings` achteraan het adres. Dit opent de instellingen alleen voor mensen die mogen bewerken en nooit op een weergave die met een pincode is vergrendeld. Dit is de Nuvio-zijbalk; de Home Assistant-zijbalk verberg je met Kiosk Mode (**Integraties**).
