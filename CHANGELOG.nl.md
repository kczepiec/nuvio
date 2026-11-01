<p align="center"><a href="CHANGELOG.md">English</a> · <a href="CHANGELOG.pl.md">Polski</a> · <a href="CHANGELOG.fr.md">Français</a> · <b>Nederlands</b></p>

# Wijzigingslogboek

Alle belangrijke wijzigingen in Nuvio staan hier, de nieuwste eerst. Versies volgen [semantic versioning](https://semver.org). De volledige Engelse lijst staat in [CHANGELOG.md](CHANGELOG.md); het Poolse en Franse wijzigingslogboek staan in [CHANGELOG.pl.md](CHANGELOG.pl.md) en [CHANGELOG.fr.md](CHANGELOG.fr.md).

### Unreleased
- Toegevoegd: **kamersfoto** — cameraknop per kamer in Instellingen → Kamers, miniatuur in de rij, snelkoppeling « Foto » op de Kamers-weergave in bewerkingsmodus; tegelvoorbeeld direct na het kiezen van een bestand (vóór « Kamers opslaan »).
- Opgelost: **Kamers**-tegels in donker thema en lijstweergave volgen themakleuren; metrieklabels lopen niet uit elkaar; hoverring gebruikt de accentkleur uit Instellingen.
- Opgelost: het **Kamers**-raster in Studio sluit aan bij het ontwerp (drie kolommen op typische desktopbreedte, blauwe tegelmarkering, Offline zonder kamergegevens, geen rij « Overig » in rasterweergave). De titel van de Kamers-weergave blijft in Studio verborgen.
- Toegevoegd: optionele **Studio-weergave** (bèta), standaard uit en in te schakelen via **Instellingen > Weergaven**. Ze heeft een kader in de stijl van het ontwerp (rail over de volle hoogte met licht/donker-schakelaar, tabs als pillen, optionele wifi-, Bluetooth- en batterijpictogrammen van een wandtablet, datum en tijd) en een vrij 2D-widgetraster van 12 kolommen (8 op tablets, 4 op telefoons). In bewerkmodus kun je widgets slepen, vergroten of verkleinen, verbergen en toevoegen met de tegel "Widget toevoegen"; andere widgets schuiven opzij en sluiten aan, en elke widget heeft een eigen minimale en maximale grootte. De eerste indeling komt uit je entiteiten, elke schermbreedte houdt een eigen indeling en een opgeslagen indeling wordt nooit opnieuw gegenereerd. Studio zit in de back-up van de indeling.
- Toegevoegd: nieuwe widgets **klimaat**, **energie** en **thuis** (ook in de kaartkiezer) die wisselen tussen compacte, middelgrote en uitgebreide weergave op basis van hun eigen grootte.
- Toegevoegd: Studio-modi voor de kaarten begroeting, weer, media, camera's en scènes (optie `studio`; bestaande configuraties zien er hetzelfde uit).
- Toegevoegd: bètaversies zoals `2.32.0-beta.1` laden hun bestanden van het CDN. `tools/cut-release.sh --pre` en `tools/tag-release.sh --pre` publiceren een pre-release vanaf de huidige branch.
- Opgelost: Studio-widgets liggen dichter bij het ontwerp. Kaarten op de foto hebben donkerder glas en witte tekst, de klimaatboog blijft in de kaart, energiebalken verschijnen al op middelgroot formaat, media heeft een grotere hoes, ingeschakelde lampen zijn indigo en scènes staan op één rij.
- Opgelost: Studio-kader. Het logo is weer zichtbaar, de rail is een afgeronde balk zonder terugpijl, en de pictogrammen rechtsboven hebben meer ruimte. Wifi en Bluetooth tonen de tabletstatus en openen de entiteit; het batterijpictogram is weg.
- Opgelost: op telefoons stapelen Studio-widgets in één kolom over de volle breedte.
- Opgelost: maandkalender en agenda gebruiken grotere, leesbare typografie (ook in Studio, zonder te klein schalen via de tegel).
- Gewijzigd: nieuwe Studio-indelingen voor Kaart, Camera’s, Gezin, Energie en de weergaven Robots, Beveiliging en Netwerk (alleen Nuvio-widgets en -kaarten). Bij update naar seedV 2 wordt de opgeslagen indeling per weergave één keer vervangen.
- Opgelost: het Studio-raster sluit aan op de rail, zonder lege strook, en in bewerkmodus kun je dezelfde componenten toevoegen als op de andere weergaven.
- Opgelost: Studio heeft geen lege rasterkolom meer links, en widgets schalen mee met de hoogte van hun cel.
- Opgelost: Studio-bewerken laat het raster niet meer wiebelen en knijpt widgets niet samen om de toevoegtegel te passen.
- Opgelost: Studio-bewerken mat de groeiende kaart, waardoor elke rij tot duizenden pixels opzwol. De rijhoogte komt nu van het paneel.
- Opgelost: Studio-glas heeft sterkerere blur en aparte tokens voor licht en donker (widgets en chrome), lichte modus houdt geen donkere kaarten meer vast.
- Opgelost: Studio verplaatst bewerken, Assist, berichten en meldingen naar het gebruikersmenu; de actieve rail-indicator heeft een zachtere hoekradius.
- Gewijzigd: één layout overal — smal paneel, `wide-panel`, gedeeld paneelglas en **Paneelachtergrond** in Uiterlijk verwijderd; kaarten hebben altijd eigen glas met 24px tussenruimte.
- Opgelost: layoutbewerking op desktop toont weer handgrepen, **Component toevoegen** en het Studio-raster (paneel scrollt in het paginaraster i.p.v. afgesneden te worden).

### 2.31.0
- Toegevoegd: de titel en ondertitel van de kop kunnen de actuele status van een entiteit tonen met `{state:sensor.jouw_entiteit}`, bijvoorbeeld de status van een wasmachine. De regel verdwijnt als de status leeg is, `off`, `unavailable` of `unknown`, en de kop werkt bij wanneer de entiteit verandert.

### 2.30.2
- Opgelost: de **herlaadpil** verschijnt na een update niet meer als de draaiende build al de nieuwste is.

### 2.30.1
- Opgelost: het instellingenvenster **Look** ging leeg of helemaal niet open nadat het nachtschema was toegevoegd. Het werkt weer.

### 2.30.0
- Toegevoegd: **nachtschema** voor de schermbeveiliging van de wandtablet. Zet het aan onder Wandtabletmodus en de schermbeveiliging schakelt 's nachts over op een eigen stijl en dimniveau, ofwel van zonsondergang tot zonsopgang (zon-entiteit) ofwel tussen twee ingestelde uren, die over middernacht heen mogen lopen. Standaard uit; de instellingen voor overdag blijven zoals ze waren.
- Toegevoegd: de schermbeveiliging kan **ontwaken via een lijst met sensoren** in plaats van één. Kies meerdere binaire sensoren voor beweging, aanwezigheid of bezetting; zodra één ervan aangaat, ontwaakt de schermbeveiliging. Bestaande opstellingen met één sensor worden automatisch gemigreerd.
- Toegevoegd: **spraakassistent** in plaats van het Assist-chatvenster. Een glazen balk schuift bovenaan het scherm in, luistert meteen, toont tussen aanhalingstekens wat hij hoorde met het antwoord eronder, leest het antwoord voor en verdwijnt vanzelf. De spraak gaat naar de spraak-naar-tekst-engine van de Home Assistant-assistent (vereist HTTPS), met spraakherkenning van de browser en een tekstveld als terugvaloptie. Hij luistert opnieuw als de assistent een vervolgvraag stelt. Nieuwe instellingen in **Instellingen > Systeem > Assist**: **Stijl** (spraakbalk of het eerdere chatvenster), **Luisteren bij openen** en **Doorlopend gesprek**. Zie [Voice assistant](docs/features.md#voice-assistant).
- Opgelost: **kamerinstellingen** die vanuit de kamerkop worden geopend (sensormenu, "All room settings") gaan nu eerst naar de bewerkmodus, zodat de knoppen Opslaan en het bewerken van de hele kamer werken. Een in de kop gekozen sensor wordt niet meer overschreven door een latere opslag.
- Opgelost: de kop **"Wykrywanie pracy"** (klimaatdetectie) in de kamerinstellingen toont geen te groot pictogram meer.

### 2.29.2
- Toegevoegd: elke keuzelijst (select) heeft een **zoekvak**, en lange lijsten laden 10 opties tegelijk met oneindig scrollen. Zoeken negeert hoofdletters en Poolse letters, dus "lazienka" vindt "Łazienka". Sensorkiezers met duizenden items openen snel.
- Toegevoegd: de **aanwezigheids**pil in de kamerkop kan worden aangetikt (beheerders) om de aanwezigheids- of bewegingssensor van die kamer te kiezen, net als bij temperatuur en luchtvochtigheid. Kies "Automatisch", "Niet weergeven" of voeg een sensor toe als de kamer er geen heeft.
- Toegevoegd: **titelgrootte** voor de weergavekop per apparaat (telefoon, tablet, breed): Klein, Gemiddeld (standaard, het huidige uiterlijk), Groot en XL. XL heeft klokgrootte, zodat `{time}` door de kamer heen leesbaar is. Instelbaar in de koptekst-editor, met een live voorbeeld.
- Toegevoegd: schakelaar **Weer weergeven in de header** op de pagina Look. Zet hem uit als een Weerkaart de voorspelling al toont (standaard aan).
- Toegevoegd: schuifregelaar **Glasdoorzichtigheid** onder Uiterlijk, naast Glasvervaging. Hij maakt grote glazen kaarten doorzichtiger en laat de vervaging zoals ze is. Standaard 100 is het huidige uiterlijk, en tekst blijft leesbaar als de vervaging uit staat.
- Toegevoegd: drie schermbeveiligingen voor de wandtablet: **Stars** (fonkelende nachthemel met de klok), **Word clock** (de tijd letter voor letter verlicht, voorlopig Engelse woorden) en **Sunrise** (een lucht die de echte tijd van de dag volgt, met een zon- of maanboog).

### 2.27.0
- Toegevoegd: **klokweergave** voor de schermbeveiliging van de wandtablet (issue #41). Uiterlijk → Wandtabletmodus heeft een live voorbeeld en bediening voor lettertype (systeem, serif, mono, afgerond of je eigen lettertype vanaf een `/local/…`- of `https://…`-adres), grootte, gewicht, kleur (wit, accent of je eigen kleur), schaduw en dekking. De instellingen gelden voor de klok in de stijlen foto, Night, Aurora, Flip en Minimal (glas). De standaardwaarden behouden het huidige uiterlijk, en **Reset to style defaults** herstelt ze.

### 2.26.1
- Opgelost: de chips voor aanwezigheid/beweging en deur/raam van een **kamer** zijn aparte secties, zodat ze in de kamereditor kunnen worden verwijderd of verborgen zoals de andere kamersecties.
- Opgelost: **TV content** houdt geen aparte component-tegel voor de bewerkmodus meer aan als dezelfde entiteiten door een apparaatprofiel worden gedekt (één luchtreiniger-/slottegel in plaats van dubbele).

### 2.26.0-beta.6
- Opgelost: **TV content** houdt geen aparte component-tegel voor de bewerkmodus meer aan als dezelfde entiteiten door een apparaatprofiel worden gedekt (één luchtreiniger-/slottegel in plaats van dubbele).

### 2.26.0-beta.5
- Gewijzigd: kamerrijen van **TV content** slaan geordende `items` op (entiteiten, binaire sensoren, apparaatprofielen, componenten uit de bewerkmodus), zodat Nuvio TV de kamerinhoud van het dashboard kan spiegelen, niet alleen een vlakke entiteitenwhitelist.

### 2.26.0-beta.4
- Opgelost: kamertegels van **TV content** gebruiken de entiteitenwhitelist van het dashboard, ook als die entiteiten niet aan het bijbehorende Home Assistant-gebied zijn toegewezen (virtuele kamers en verplaatste apparaten). Kamerrijen in `nuvio_tv_layout` slaan ook de weergavenaam van het dashboard op.

### 2.26.0-beta.3
- Opgelost: de kamerlijst en -volgorde van **TV content** komen nu overeen met het kamerraster van Nuvio (Wygląd → Pokoje + indeling verborgen/volgorde/toegevoegd), niet met elk Home Assistant-gebied. Synchroniseren vanuit het dashboard en het opslaan van de indeling herschrijven de volledige kamerset; "Overig" op de tv alleen als het dashboard *Geen kamer* toont.

### 2.26.0-beta.2
- Gewijzigd: **TV content** begint bij de Nuvio-dashboardkamer (dezelfde entiteiten als de kamerkaart, inclusief verborgen secties en toegevoegde tegels). **Sync from dashboard** vernieuwt de lijsten; het opslaan van de dashboardindeling werkt ook de kamerentiteitenlijsten in `nuvio_tv_layout` bij als er al een tv-indeling bestaat.

### 2.26.0-beta.1
- Toegevoegd: **TV content** onder Instellingen → Systeem → Tv: kies welke camera's (met volgorde), kamers (eventueel een deel van de entiteiten), scènes/scripts en alarmpanelen op gekoppelde Nuvio TV-apps verschijnen. De selectie wordt opgeslagen in de gebruikersgegevens van Home Assistant als `nuvio_tv_layout`. Zonder opgeslagen keuze toont de tv alles uit Home Assistant; een lege sectie blijft verborgen. Laad de tv opnieuw of verbind opnieuw na het opslaan ([#83](https://github.com/kczepiec/nuvio/pull/83)).

### 2.25.1
- Opgelost: **tv-koppeling** maakt een toegangstoken met een kortere levensduur (365 dagen in plaats van 10 jaar), vraagt om bevestiging voordat het token via onversleuteld `http://` naar de tv wordt gestuurd en bouwt het tv-adres alleen op uit een gevalideerd `host:port` (schema's en paden worden geweigerd) ([#81](https://github.com/kczepiec/nuvio/pull/81)).
- Opgelost: een component die op een **kamer**pagina is toegevoegd (stack, grid, HA-kaart, …) opent in de bewerkmodus weer zijn eigen formulier in plaats van de sectie-instellingen ([#80](https://github.com/kczepiec/nuvio/pull/80)).

### 2.25.0
- Gewijzigd: **tv-koppeling** is sneller. Bij een Home Assistant die via `http://` is geopend gaan de gegevens met een achtergrondverzoek rechtstreeks naar de tv, zodat er geen nieuw tabblad opent, en de pagina meldt het als de tv de code afwijst of er te veel foute codes zijn geprobeerd. Bij `https://` sluit het tabblad vanzelf zodra de tv is verbonden. De pagina controleert nu elke seconde in plaats van elke 3 seconden en wacht alleen 120 seconden als het Home Assistant-adres `http://` buiten je thuisnetwerk is (anders 60 seconden). Voor het directe antwoord is de nieuwste Nuvio TV-app nodig; een oudere app koppelt nog steeds en wordt door dezelfde controle bevestigd.
- Toegevoegd: **tv-koppeling** (Instellingen, Systeem, Tv, gemarkeerd als Beta): koppelt de Nuvio TV-app zonder een token in te typen. Typ het adres en de 6-cijferige code die op de tv staat, of plak de link van de QR-code. Nuvio maakt een langlevend toegangstoken met de naam *Nuvio TV datum tijd* en stuurt het samen met het Home Assistant-adres via je thuisnetwerk naar de tv (alleen adressen in je thuisnetwerk worden geaccepteerd). De tv bevestigt de verbinding zelf: de pagina meldt *Tv verbonden*, of verwijdert na 60 seconden (120 seconden voor een http-Home Assistant-adres, waarbij de tv eerst om bevestiging van een onversleutelde verbinding vraagt) zonder antwoord het ongebruikte token. Als je browser het nieuwe tabblad blokkeert, verstuurt een tweede knop de gegevens, en een token dat niet binnen 2 minuten is verzonden, wordt verwijderd. Dezelfde pagina toont je gekoppelde tv's met het tijdstip van hun laatste verbinding en verwijdert ze. Het token wordt nooit opgeslagen of gelogd. Vereist de Nuvio TV-app met koppeling. De pagina maakt deel uit van het instellingenpaneel, dus beheerders en gebruikers met een eigen indeling zien haar.
- Toegevoegd: **snelknoppen voor de schermbeveiliging** ([#49](https://github.com/kczepiec/nuvio/issues/49)): maximaal 3 glazen knoppen op elke schermbeveiligingsstijl (foto, board en glas) die een actie uitvoeren op een script, scène, knop, schakelaar, licht, ventilator, input_boolean, afdekking of alarmpaneel zonder het dashboard te wekken. Stel ze in onder **Wandtabletmodus → Snelknoppen** (beheerders): entiteit, actie, naam, pictogram en *Ingedrukt houden om te bevestigen*, dat standaard aan staat voor afdekkingen en alarmpanelen. De knoppen zijn verborgen zolang de schermbeveiliging met een pincode is vergrendeld. Alarmpanelen vragen telkens om de code op een toetsenbord op het scherm (alleen bij het inschakelen als het alarm dat vereist, bij het uitschakelen altijd als het paneel een code heeft); de code wordt naar Home Assistant gestuurd en nooit opgeslagen.
- Opgelost: de vervaging van de kaarten (glas) ontbrak of verscheen laat na een weergavewissel, het meest zichtbaar als je van weergave wisselt met **Paneelachtergrond** uit. De intreanimatie van de kaarten liet de dekking van elke kaartwrapper vervagen, waardoor de kaarten werden losgekoppeld van de foto erachter en, omdat de animatie haar eindtoestand behield, de vervaging daarna uit bleef. Kaarten schuiven nu in zonder dekkingswijziging, zodat de vervaging er vanaf het eerste beeld is.
- Gewijzigd: prestaties. De controle op een nieuwere bundel downloadt niet meer bij elke paginalading het hele bestand van ~1,4 MB: ze stuurt een voorwaardelijk verzoek en de server antwoordt 304 als er niets is veranderd. De Klokkaart werkt alleen de tijdtekst bij in plaats van de kaart opnieuw te tekenen, het hertekenen van de koptekst vergelijkt gewone waarden in plaats van bij elke statusupdate het gebruikersobject te serialiseren, en de cache voor omslagkleuren van de mediakaarten is begrensd.
- Gewijzigd: het vernieuwen van camerasnapshots, de Timerkaart en het aftellen van de Kamerkaart pauzeren zolang het tabblad verborgen is of de kaart buiten beeld staat, en halen het bij de volgende tik in.
- Gewijzigd: de zeven grootste ingebouwde achtergronden zijn opnieuw gecomprimeerd (ongeveer 3,1 MB naar 2,4 MB in totaal, zelfde afmetingen en bestandsnamen). Details zijn in enkele foto's iets zachter.
- Verwijderd: de ongebruikte gesplitste editor-chunks (`hg-editor.part.js`, `hg-editor-tail.part.js`) die geen deel van de build uitmaakten.
- Toegevoegd: **Wandtabletmodus → Weergave bij ontwaken**: Laatst gebruikte weergave (standaard), Home of elke ingeschakelde weergave. Wanneer de schermbeveiliging start, keert het dashboard erachter terug naar die weergave, zodat je die ziet als je het scherm wekt. Overgeslagen in de bewerkmodus, in het voorbeeld en als de weergave al open is. Een weergave die met een pincode is vergrendeld, vraagt bij het ontwaken nog steeds om de pincode.

### 2.23.1
- Hersteld: de codebasis van 2.23.0 zoals uitgebracht, met het Energy flow-werk van 2.22.5 / #57. De editorsplitsing en de reviewfixes die daarna volgden, zijn ingetrokken: een dashboard dat daarmee was gebouwd werd niet weergegeven (`this._applyLayout is not a function`) en liet elke weergave leeg.
- Nieuw: de kaart **Energy flow** vult zichzelf vanuit de instellingen van het **Energiedashboard** van Home Assistant wanneer die vermogenssensoren vermelden (recente HA: net-, zonne- en batterijvermogen, batterijniveau en naam). Omgekeerde meters en aparte import-/exportsensoren worden behandeld zoals in HA. Wat daar ontbreekt, wordt zoals voorheen gedetecteerd, en je eigen keuzes in de kaartinstellingen winnen altijd.
- Opgelost: de kaart **Energy flow** die standaard op de weergave **Energie** wordt geplaatst kon meerdere batterijen tonen voor één enkele (bijvoorbeeld elke vermogenssensor met batterij in de naam van een SolarFlow, plus een slimme stekker met de naam "battery"), met niveaus die op volgorde werden gekoppeld. Batterijen worden nu per apparaat gedetecteerd: één per ladingsniveau dat het apparaat meldt (een omvormer met Battery 1 en Battery 2 geeft er twee), elk met de vermogenssensor waarvan de naam bij dat niveau past, of de hoofdbatterijvermogenssensor van het apparaat als het één niveau heeft; apparaten zonder niveau (zoals een stekker) worden genegeerd als een ander apparaat er wel een meldt. Een nieuwe kaart uit de galerij gebruikt dezelfde detectie.
- Gewijzigd: de **Instellingen** van de Energy flow-kaart op de weergave Energie openen nu hetzelfde formulier als de galerij (net, zon, batterijen, niveaus, export, thuis, tekenopties), vooraf ingevuld met wat de kaart toont; je keuzes worden bovenop de gegenereerde kaart opgeslagen.

### 2.23.0
- Toegevoegd: een wandtablet gehoorzaamt opdrachten van Home Assistant zonder browser_mod ([#47](https://github.com/kczepiec/nuvio/issues/47)). **Uiterlijk → Wandtabletmodus → Commands from Home Assistant** geeft deze tablet een naam, bewaard in zijn eigen browser, en accepteert twee afzenders: een gebeurtenis `nuvio_command` met `device`, `action` en `view` (beheerdersaccounts), en een `input_text`-helper met dezelfde waarden in zijn attributen `device`, `action` en `view` (elk account, ook een zonder beheerdersrechten). Acties zijn `wake`, `screensaver`, `lock` (toont de schermbeveiliging en vraagt om de pincode als de pincodevergrendeling aan staat) en `navigate` met een weergavepad of titel, zodat een deurbel of beweging bij de poort de tablet kan wekken en **Camera's** kan openen. Een helper bewaart de laatste opdracht, zodat Nuvio die één keer per wijziging en één keer na een herlaadbeurt uitvoert, nooit twee keer voor dezelfde opdracht.
- Toegevoegd: zolang Kiosk Mode aan staat, blijft het scherm aan op het Nuvio-dashboard, op dezelfde manier als terwijl een video speelt. Dit geldt voor een verborgen header, een verborgen zijbalk, kiosk voor mensen die geen beheerder zijn, en de adresparameters `kiosk`, `hide_header` en `hide_sidebar`. Zet de kioskmodus uit en het scherm mag weer slapen. Als het scherm uitgaat of je de app verlaat, vraagt Nuvio om het weer aan te houden wanneer je terugkomt.

### 2.22.4
- Toegevoegd: het weer in de header en een Weerkaart hebben een tekstgrootte: Klein, Gemiddeld of Groot. De header-hero volgt ook de dashboardzoom, zodat op een tablet in landschap de uurlijkse voorspelling groter kan worden dan de oude limiet.
- Opgelost: de hoeveelheid regen in het weer in de header, zoals 17 mm, is wit op de foto, zodat ze leesbaar blijft.
- Toegevoegd: een weergave kan meerdere dingen tegelijk tellen (lichten, schakelaars, ventilatoren, media, klimaat, personen, beweging en geselecteerde entiteiten). Het tabblad toont de som. De huidige weergave toont ook een pictogram en een aantal onder de titel, en verbergt een chip bij 0. Lichten aan slaat een lichtgroep over als de lampen ervan bestaan. Geselecteerde entiteiten gebruikt de doorzoekbare entiteitenkiezer.

### 2.22.3
- Opgelost: de schermbeveiliging Glass Minimal toonde nog steeds de avatarcirkel rechtsboven als **Bovenbalk → Avatar** uit stond, in de live schermbeveiliging en in het voorbeeld ([#52](https://github.com/kczepiec/nuvio/issues/52)).
- Opgelost: de rij **Discord** in het gebruikersmenu toont het Discord-logo naast het label, zoals Profiel en Instellingen een pictogram tonen. Home Assistant bevat dat merkpictogram niet meer, dus het menu tekent het zelf.
- Opgelost: **Instellingen → Gebruikers** toont de foto van een persoon als die Home Assistant-gebruiker aan een persoon met een foto is gekoppeld. Rijen zonder foto houden de letter.

### 2.22.2
- Opgelost: een tegel **Cover / gate** (open, stop, dicht) werd op een telefoon rechts afgesneden als hij alleen op het paneel stond. Op een smalle tegel werden de knoppen uitgerekt tot een volledige rij, maar die rij liep nooit door naar een nieuwe regel, zodat ze buiten de kaart werden getekend. Ze verplaatsen zich nu onder de naam en blijven binnen de tegel. De mediategel gebruikt dezelfde indeling. Op een breder scherm blijven de knoppen rechts ([#53](https://github.com/kczepiec/nuvio/issues/53)).
- Toegevoegd: Discord in het gebruikersmenu, na Profiel en Instellingen, en op de pagina Over Nuvio. De Engelse, Poolse en Franse README's hebben een sectie Community en een Discord-badge.

### 2.22.1
- Opgelost: op telefoons en smalle tablets werden de instellingen **Weergaven en navigatie** links afgesneden en samengeperst tot de halve breedte, en de pagina kon zijwaarts scrollen. Een brede kiezer (tabbalk op telefoon) en de tweekoloms weergavekaarten waren breder dan het scherm, en de pagina werd in de verkeerde rasterrij geplaatst nadat de zijbalk was verborgen. Instellingen gebruiken nu één kolom over de volle breedte, de weergavetabel bestaat uit gestapelde kaarten met elk veld zichtbaar, niets scrolt zijwaarts, en de balk **Standaardwaarden herstellen** / **Klaar** staat boven de onderste navigatie en de home-indicator. Nieuwe `tools/mobile_check.py` controleert vóór elke release elke instellingenpagina op iPhone (WebKit), Android (360 px) en een tablet van 768 px.

### 2.22.0
- Gewijzigd: instellingswijzigingen in de bewerkmodus zijn een concept. Instellingen voor weergaven, kioskmodus, header, kamers, schermbeveiliging, pincode en Assist slaan het dashboard niet meer op of laden het niet meer opnieuw bij elke wijziging; goedkope voorbeelden (accent, headertekst) verschijnen meteen. **Klaar** slaat alles één keer op en laadt hooguit één keer opnieuw, **Annuleren** verwerpt het concept, en de pagina verlaten met niet-opgeslagen wijzigingen vraagt eerst om bevestiging.
- Gewijzigd: **Instellingen** hebben een nieuwe indeling. Een zijbalk groepeert 13 pagina's (Algemeen, Uiterlijk, Dashboard, Wandtablet, Systeem) met een zoekvak dat instellingen op elke pagina vindt, toetsenbordnavigatie en een doorklaplijst op telefoons. Pincode-instellingen hebben hun eigen pagina **Pincode en vergrendelingen**, er is een nieuwe pagina **Over Nuvio**, en de activiteitsdetectie per klimaatapparaat is ondergebracht in een geavanceerd blok. Elke optie en opgeslagen instelling blijft ongewijzigd.

### 2.21.6
- Opgelost: de schermbeveiliging houdt het scherm weer aan nadat het scherm uit en aan is gezet, of na het wisselen van app of tabblad. Browsers geven de schermwakelock vrij wanneer de pagina verborgen is; Nuvio vraagt hem nu opnieuw aan wanneer de pagina zichtbaar is en de schermbeveiliging aan staat ([#38](https://github.com/kczepiec/nuvio/issues/38)).
- Opgelost: de kaart **Cover / gate** toonde 0 % of 100 % en een positiebalk voor afdekkingen zonder positie (een poort of garagedeur die alleen open, dicht en stop kent). Ze toont nu de status in woorden (Open, Gesloten, Opent, Sluit) met een zachte puls tijdens de beweging, en geen balk. Het pictogram volgt de apparaatklasse (poort, garage, deur, raam, jaloezie, gordijn, zonwering, luifel) in plaats van altijd een rolluik ([#36](https://github.com/kczepiec/nuvio/issues/36)).
- Opgelost: weergaven die met de pincode waren ontgrendeld bleven 5 minuten open, ook nadat de schermbeveiliging was gestart of **Scherm vergrendelen** was gebruikt, zodat de volgende persoon bij een wandtablet ze zonder pincode kon openen. De schermbeveiliging en **Scherm vergrendelen** sluiten nu elke ontgrendelde weergave, en de weergave op het scherm vraagt na het ontwaken opnieuw om de pincode. Het voorbeeld van de schermbeveiliging in de instellingen vergrendelt niet opnieuw ([#35](https://github.com/kczepiec/nuvio/issues/35)).
- Gewijzigd: het pincodetoetsenbord van een vergrendelde weergave en de instellingen voor weergavevergrendeling tonen de opmerking niet meer dat de vergrendeling een gemak is en geen beveiliging; de beperking wordt in de documentatie beschreven.
- Opgelost: in de schermbeveiliging **Clock on photo** wordt de tijd van de volgende gebeurtenis (en van de volgende LiveKid-activiteit) weer op volle helderheid getoond in plaats van gedimd zoals de andere rijen. Een verdwaalde `};` in de stijlen van de schermbeveiliging zorgde ervoor dat de browser die regel negeerde ([#34](https://github.com/kczepiec/nuvio/issues/34)).

### 2.21.5
- Opgelost: **Zijbalk verbergen** (voorheen **Hide the sidebar when it is empty**) deed niets zolang een weergave nog **Zijbalk** aan had. Het verbergt nu de Nuvio-zijbalk en zijn knop Instellingen op computers en tablets, wat de schakelaars per weergave ook zeggen, en weergaven die niet in de bovenste tabbladen staan, verhuizen naar het profielmenu.

### 2.21.4
- Toegevoegd: **{time}** en **{date}** in de titel of ondertitel van een weergave tonen de huidige tijd en datum in de taal van de interface, met de 12- of 24-uursnotatie uit je Home Assistant-profiel, elke minuut bijgewerkt. **Add a clock** in de koptekst-editor van de weergave voegt **{time}** toe aan de ondertitel.
- Toegevoegd: een kolom **Badge** in **Instellingen > Weergaven** telt lichten, schakelaars, ventilatoren, klimaatapparaten of personen die aan staan (of media die spelen, of de entiteiten die je kiest) en toont het aantal op het tabblad van de weergave als het groter is dan 0.
- Toegevoegd: **Hide the sidebar when it is empty** in **Instellingen > Weergaven**. Als geen enkele weergave in de zijbalk wordt getoond, verdwijnen de zijbalk en zijn knop Instellingen. Instellingen blijven bereikbaar in het profielmenu, achter het potlood en op elk Nuvio-adres met **?nuvio_settings** (voor mensen die mogen bewerken, en niet op een weergave die met een pincode is vergrendeld).
- Opgelost: de kaart **Production forecast** gebruikte één kleur voor elke dag nadat de drempels waren gewijzigd. Drempels boven 12 kWh per kW, of drempels zonder referentievermogen, worden nu gelezen als kWh per dag; verkeerd om ingevoerde drempels worden omgewisseld; een decimale komma (3,5) wordt geaccepteerd in de getalvelden van de kaarteditor.
- Opgelost: een ingebouwde achtergrond die op één apparaat was gekozen werd als effen kleur getoond op apparaten die Home Assistant onder een ander adres openen (lokaal IP, domein, Nabu Casa). De afbeelding werd met het volledige adres van het eerste apparaat opgeslagen; ingebouwde achtergronden worden nu opgeslagen als een pad naast de Nuvio-bestanden (bijvoorbeeld `/hacsfiles/nuvio/nuvio-bg-nad-mgla-wide.webp`), en eerder met een adres opgeslagen achtergronden worden gecorrigeerd wanneer de indeling laadt, voor het dashboard en de schermbeveiliging. Geüploade afbeeldingen en je eigen adressen worden niet gewijzigd.

### 2.21.3
- Gewijzigd: de klimaatstip op de tegel **Kamers** heeft de kleur van de modus (verwarmen, koelen, drogen, ventilator, auto), dezelfde kleuren als in het menu **Modus** van de AC-afstandsbedieningskaart, in plaats van grijs: massief als het apparaat draait, gedimd als het niet draait of de status een schatting is, omlijnd als alleen de modus bekend is. De **~** voor geschatte statussen is verdwenen van de tegel Kamers en de thermostaatkaart; schermlezers zeggen nog steeds **schatting**.

### 2.21.2
- Gewijzigd: het gedetailleerde weervenster is compact en past zonder scrollen op een telefoonscherm: de vier details staan in één rij, rijen en marges zijn krapper, de zonneboog is kleiner en op smalle schermen gebruiken de dagen korte namen (ma, di) in plaats van afgekapte namen.
- Gewijzigd: Nuvio raadt niet meer of een thermostaat of airconditioner draait. Elk klimaatapparaat in een kamer heeft **Activity detection** in **Uiterlijk > Kamers**: **Automatisch** (standaard), **Vanuit een entiteit**, **Vanuit kamertemperatuur** of **Alleen modus tonen**. Automatisch gebruikt, in deze volgorde: de entiteit **Actual state** (aan/uit, of een waarde zoals vermogen boven de **Running threshold**, standaard 5 W), wat het apparaat zelf meldt (`hvac_action`), en de kamertemperatuur ten opzichte van de streeftemperatuur als je een aparte kamersensor kiest (een schatting met standaard 0,5° hysterese, gemarkeerd met **~** en een gedimde stip). Anders toont de tegel alleen de modus, bijvoorbeeld **Verwarmen** met een lege stip. In 2.21.1 werd de streeftemperatuur vergeleken met de eigen temperatuur van het apparaat, waardoor airconditioners met IR-afstandsbediening **Inactief** toonden terwijl ze verwarmden. Bij meerdere apparaten in een kamer toont de tegel Kamers eerst een apparaat dat zeker draait, dan een schatting, dan een modus. Bestaande keuzes voor **Actual state** blijven werken.

### 2.21.1
- Dank aan [@cbailly42](https://github.com/cbailly42) voor de klimaatfix ([#22](https://github.com/kczepiec/nuvio/pull/22)).
- Zet na het updaten **Schermbeveiliging op dit apparaat** één keer aan op elk apparaat dat de schermbeveiliging moet tonen.
- Nieuw: **Actual state** voor elke thermostaat van een kamer, in **Uiterlijk > Kamers** (bewerkmodus): kies een entiteit die aangeeft of dat apparaat echt draait (een aan/uit-entiteit zoals de verbrandingssensor van een kachel, of een numerieke zoals het brandervermogen). Bij meerdere apparaten in een kamer (bijvoorbeeld een warmtepomp en een kachel) kijkt de tegel Kamers naar alle apparaten en toont **Verwarmen**, **Koelen** of **Inactief** op basis van het apparaat dat echt werkt; de thermostaatkaart gebruikt dezelfde instelling.
- Opgelost: thermostaten die niet melden wat ze doen (geen `hvac_action`, bijvoorbeeld sommige handdoekradiatoren) tellen nu als inactief zodra de kamer de streeftemperatuur heeft bereikt, op de tegel Kamers en de thermostaatkaart.
- Opgelost: de thermostaatkaart toont **· inactief** na de modus (bijvoorbeeld **Verwarmen naar 7° · inactief**) als het apparaat niet echt verwarmt.
- Opgelost: de tegels **Kamers** toonden **Verwarmen** zodra een thermostaat in verwarmingsmodus stond, ook als hij niet verwarmde (bijvoorbeeld een vorstbeveiligingsstreeftemperatuur van 7 °C in een kamer van 21 °C). De tegel volgt nu wat het apparaat echt doet en toont in dat geval **Inactief** met een grijze stip.
- Opgelost: de schakelaars **Pincodevergrendeling voor weergaven** in de Wandtabletmodus deden niets bij een klik. Hun actie werd niet doorgegeven aan de instellingen van de wandtablet, dus er werd niets omgeschakeld of opgeslagen. Ze schakelen nu meteen om en worden met de indeling opgeslagen; zonder pincode verschijnen daar meteen een melding en een pincodeveld. Verwijst naar [#17](https://github.com/kczepiec/nuvio/issues/17)
- Opgelost: gewone tegels werden altijd in één blok onder stacks, grids, YAML-kaarten en andere componenten gegroepeerd. Zonder rastergebieden is elke toegevoegde tegel nu een eigen kaart op het paneel, zodat tegels en componenten door te slepen in elke volgorde kunnen worden gemengd; de bestaande tegelvolgorde blijft behouden. Verwijst naar [#17](https://github.com/kczepiec/nuvio/issues/17)
- Opgelost: het openen van een weergave via zijn nummer (bijvoorbeeld `/dashboard-nuvio/0`) liet de kaarten onzichtbaar, omdat de pagina dacht dat hij niet getoond werd en de intreanimatie pauzeerde.
- Opgelost: een schakelaar in een stack of grid die in de editor was toegevoegd, veranderde niet van uiterlijk nadat je het licht aan- of uitzette ([#16](https://github.com/kczepiec/nuvio/issues/16)). Het paneel gaf nieuwe Home Assistant-gegevens alleen aan een container door als een van zijn eigen entiteiten veranderde, en de lijst van die entiteiten bevatte de kaarten in de container niet. Containers en andere toegevoegde componenten krijgen nu elke update.
- Nieuw: **Schermbeveiliging op dit apparaat** in de **Wandtabletmodus** ([#16](https://github.com/kczepiec/nuvio/issues/16)). De instellingen van de schermbeveiliging blijven gedeeld, maar elk apparaat beslist of ze draait, opgeslagen in die browser. Het inschakelen van de schermbeveiliging schakelt haar in op het apparaat dat je gebruikt; andere apparaten blijven uit tenzij je haar daar aanzet (een tablet die vóór de update met de pincode was vergrendeld, behoudt haar). Controleer na het updaten de schakelaar op je wandtablet.
- Nieuw: **Paneelachtergrond** in **Uiterlijk** schakelt het gedeelde glazen paneel achter de kaarten uit, voor alle weergaven of alleen de huidige ([#15](https://github.com/kczepiec/nuvio/issues/15)). De stijlen voor `panel_backdrop: false` zijn geen test meer.
- Nieuw: de component **Weer** heeft een schakelaar **Hero-stijl** (`variant: hero`), en een losstaande weerkaart met `variant: hero` krijgt nu de hero-stijlen ([#15](https://github.com/kczepiec/nuvio/issues/15)).
- Nieuw: **Pincodevergrendeling voor weergaven** (BETA) in de **Wandtabletmodus**: gekozen weergaven vragen om de pincode voordat er iets wordt getoond, met hetzelfde pincodetoetsenbord als de schermbeveiliging ([#17](https://github.com/kczepiec/nuvio/issues/17)). Het is een gemaksvergrendeling, geen beveiliging.
- Opgelost: stacks, grids en YAML-kaarten die in de editor zijn toegevoegd, behouden de volgorde die je hebt ingesteld in plaats van boven eerdere kaarten te springen ([#17](https://github.com/kczepiec/nuvio/issues/17)).

### 2.20.0
- Dank aan [@cbailly42](https://github.com/cbailly42) voor de nieuwe kaart en het gedeelde staafdiagram ([#14](https://github.com/kczepiec/nuvio/pull/14)).
- Nieuw: kaart **Production forecast** (`custom:nuvio-yield-card`). Kies één sensor per dag (de eerste is vandaag) en de kaart toont de komende dagen als staven met het totaal, waarbij elke dag als goed, gemiddeld of slecht wordt beoordeeld. Geef je geïnstalleerde vermogen in kW (een getal of een entiteit) en de beoordeling gebruikt de energie per kW, met drempels die je kunt wijzigen; zonder dat wordt een dag vergeleken met de beste dag van de periode. Sensoren in Wh of MWh worden omgerekend, een capaciteit geschreven als `3,4` werkt, en dagnamen volgen de tijdzone van Home Assistant. Zie [docs/components.md](docs/components.md#production-forecast).
- Opgelost: de staven van **Energy statistics** groeien nu in wanneer de kaart verschijnt, zoals die van **Energy · week**.
- Voor bijdragers: het dagstaafdiagram en zijn tooltip, die waren gekopieerd naar **Energy · week**, **Energy statistics** en de nieuwe voorspellingskaart, staan nu op één plek, `src/parts/shared/day-bars.part.js` (`HG_DAYBARS_CSS`, `HG_TIP_CSS`). Zie [DESIGN.md](DESIGN.md).

### 2.19.0
- Nieuw: Nuvio spreekt Frans. Kies **Français** in de taalschakelaar, of laat de taal op automatisch staan en Nuvio volgt de browser. Dank aan [@cbailly42](https://github.com/cbailly42) voor de vertaling en het onderstaande werk ([#10](https://github.com/kczepiec/nuvio/pull/10)).
- Gewijzigd: alle interfaceteksten staan nu in taalcatalogi met sleutels (`src/locales/en.json`, `pl.json`, `fr.json`). Alleen de taal die je gebruikt wordt gedownload, naast het hoofdbestand, zodat het toevoegen van een taal het dashboard niet meer voor iedereen groter maakt. De automatische taal blijft niet meer plakken aan een taal die de installatiewizard liet zien maar die je nooit hebt gekozen.
- Voor bijdragers: `tools/i18n_check.py` controleert sleutels, meervoudsvormen en dekking van elke catalogus, `tools/i18n_compile.py` bouwt de taalbestanden, en `npm test` draait de nieuwe JavaScript- en Python-tests. Zie [docs/development.md](docs/development.md).

### 2.18.0
- Opgelost: een schakelaar in de lijst **Entiteiten** (en andere kaarten) kon aan blijven staan nadat het apparaat elders was uitgezet, bijvoorbeeld vanuit het more-info-venster van Home Assistant, tot de pagina opnieuw werd geladen. Als één kaart in een weergave tijdens het bijwerken faalde, stopte de fout de Home Assistant-gegevens naar elke kaart erna in die weergave, zodat ze statuswijzigingen niet meer volgden. Elke kaart krijgt nu zijn update afzonderlijk, een kaart die faalt toont een korte foutmelding in plaats van de andere kapot te maken, en updates kunnen niet meer vastlopen na een onderbroken paneelanimatie, een gesloten bewerkmodus, een verloren aanraaklosser of een gepauzeerd browserframe.
- Nieuw: **Power now** kan een voorspelling tekenen in plaats van geschiedenis. Zet **Chart from a forecast (attribute) instead of history** aan (YAML `source: forecast`) en kies de voorspellingsentiteiten, hoeveel **Days ahead** (of **Hours ahead**), het attribuut (standaard `detailedForecast`, ook `detailedHourly`) en het waardeveld (standaard `pv_estimate`, bijvoorbeeld `pv_estimate90`). Dit werkt direct met de Solcast PV Forecast-integratie: voeg de dagelijkse sensoren voor vandaag, morgen en dag 3 tot 7 toe en je krijgt een grafiek van 7 dagen met dagnamen eronder. Weerentiteiten worden gelezen met `weather.get_forecasts` (`forecast_type: hourly` of `daily`, standaard waarde `temperature`). Zie [docs/components.md](docs/components.md#forecast-chart).

### 2.17.0
- Opgelost: kamertegels in **Kamers** (en kamertegels elders op het dashboard) toonden een licht dat aan- of uitgezet was niet altijd tot je een andere weergave opende en terugkwam. Binnen de kamerweergave klopte de status. Een kaart die de browser ten onrechte als verborgen meldde (dit gebeurt in Safari en in de Home Assistant-app nadat een weergave was verborgen en weer getoond) wordt nu opnieuw getekend zodra hij in beeld is, kaarten van een weergave die terugkomt halen meteen bij, en de lijst van bewaakte entiteiten wordt opnieuw opgebouwd wanneer het register van Home Assistant verandert.
- Opgelost: de kaart **Power now** (waarde, balk en grafiek) behandelde elke sensor als vermogen. Een energie- of voorspellingssensor zoals een Solcast-voorspelling voor morgen (20,2 kWh) werd getoond als 20 W, 0% Laag. De kaart toont nu de waarde en eenheid precies zoals de sensor ze meldt, schaalt de balk naar de hoogste waarde in de grafiek of naar je eigen **Bar scale end**, en toont het niveau Laag, Gemiddeld, Hoog alleen voor vermogen of als je het aanzet. Sensoren zonder langetermijnstatistieken (bijvoorbeeld voorspellingen) tekenen hun grafiek uit de statusgeschiedenis.
- Nieuw: het bijschrift onder de grafiek kan per kaart worden gewijzigd. **Power now** heeft een veld **Chart caption** (bijvoorbeeld Voorspelling in plaats van -6 u) en een schakelaar om de labels onder de grafiek te verbergen. Een tegel in de modus **Met grafiek** heeft een veld **Chart caption** in plaats van het vaste Laatste 24 u, en een schakelaar om het te verbergen.

### 2.16.0
- Nieuw: vier extra schermbeveiligingen in **Instellingen > Schermbeveiliging**, elk met een live voorbeeldtegel in de galerij. **Analog clock** is een wijzerplaat van matglas over je foto, met een secondewijzer in de accentkleur, de datum en het weer. **Flip clock** toont de uren en minuten op twee donkere kaarten die elke minuut omklappen. **Aurora** is een dunne grote klok boven langzaam stromend licht in de accentkleur, violet en blauwgroen, met de datum en het weer. **Night** is een gedimde warme klok op zuiver zwart voor slaapkamers en OLED-schermen, en hij verschuift elke minuut verder om het paneel te beschermen. Ze werken allemaal met dimmen, de bewegingssensor, de pincodevergrendeling en schermmeldingen; zich herhalende beweging stopt bij Energiebesparing en verminderde beweging.
- Nieuw: **Dashboardstijl** bovenaan **Instellingen > Uiterlijk**: acht kant-en-klare looks met van elk een miniatuur van het dashboard (Nuvio, Frost, Midnight, Sunset, Forest, Ocean, Pastel en Graphite). Een stijl stelt het accent, de achtergrond, het dimmen en het glas in (tint van kaarten, tegels en paneel, vervagingssterkte; Pastel heeft rondere en Graphite scherpere hoeken). Je kunt het accent en de achtergrond hieronder nog steeds wijzigen. Met **Glasvervaging** op Uit blijft de dichte vulling voor leesbaarheid zoals voorheen. **Standaard herstellen** gaat terug naar Nuvio.

### 2.15.1
- Gewijzigd: de temperatuur en luchtvochtigheid in de kamerkop tonen een klein pennetje als je hun sensor kunt wijzigen. Zweven zet geen vak meer achter het getal; het pennetje licht in plaats daarvan op in de accentkleur.
- Opgelost: stacks en grids konden niet worden bewerkt als ze uit de dashboardconfiguratie kwamen (bijvoorbeeld een `vertical-stack`, `horizontal-stack` of `grid` uit HA). In de bewerkmodus opent het aantikken van een stack of grid nu zijn instellingen met de lijst van zijn kaarten, waar je kaarten kunt toevoegen, verwijderen, herordenen en dupliceren en de stackopties kunt wijzigen (bijvoorbeeld **Each card in its own glass**). Het aantikken van een kaart in een stack of grid opent meteen de instellingen van die kaart, zoals in HA; **Terug** keert terug naar de container, en **Opslaan** op de container bewaart de wijzigingen.
- Opgelost: het **Live voorbeeld** in de instellingen van een kamersectie bleef leeg als de sectie een kaart zoals airconditioning toonde. Het voorbeeld toont die kaart nu.
- Verwijderd: de keuze **Weergavemodus** (Standaard, Compact, Minimaal) voor kamers, kamersecties en kaarten met slechts één stijl. Ze maakte bijna geen zichtbaar verschil. Tegels en kaarten die kunnen overschakelen op een tegel- of lijststijl behouden hun stijlkeuze.
- Gewijzigd: de component **Alarm** heeft een nieuw premium uiterlijk. Het statusschild gloeit in de statuskleur, het pincodetoetsenbord heeft ronde toetsen met stippen die oplichten terwijl je typt, en de modusknoppen tonen pictogram en label naast elkaar. Het toetsenbord verschijnt alleen als er een pincode op het alarmpaneel is ingesteld (Home Assistant meldt een codeformaat). Voer de code in en tik dan op Thuis, Weg, Nacht of Uitschakelen; als je op een actie tikt die de code nodig heeft voordat je hem hebt ingevoerd, vraagt de kaart eerst om de code. Panelen met een tekstcode krijgen in plaats daarvan een wachtwoordveld.

### 2.15.0
- Opgelost: de temperatuur in de kamerkop kon op twee regels breken ("23," en "2°") en op smalle schermen onder de zijrail schuiven. De temperatuur en luchtvochtigheid blijven nu altijd op één regel, en de zijrail verschuift onder een kop die hoger wordt.
- Nieuw: kies de temperatuur- en luchtvochtigheidssensor van een kamer rechtstreeks vanuit de kop. Tik als beheerder in de kamerweergave op de temperatuur of luchtvochtigheid (of op de **+** ernaast als er niets wordt getoond) en kies Automatisch, een willekeurige sensor (sensoren van die kamer eerst, met hun huidige waarden) of Niet weergeven. De keuze wordt met de indeling opgeslagen en is dezelfde instelling als in **Instellingen > Kamers**, dat het menu ook opent.
- Nieuwe componenten in **+ Add**: **Air quality** (`custom:nuvio-airq-card`) toont CO₂, PM2.5, PM10, VOC, NO₂, AQI en luchtvochtigheid als tegels met gekleurde niveaus en een totaalbeoordeling; laat de sensoren leeg en hij vindt ze zelf, met voorkeur voor één kamer. **Plant** (`custom:nuvio-plant-card`) toont bodemvocht, licht, temperatuur en vruchtbaarheid met het goede bereik als band en de meting als markering, zegt wat de plant nodig heeft (geef me water, te donker…) en vindt de andere sensoren en de batterij van hetzelfde apparaat (bijvoorbeeld Mi Flora); hij leest ook een `plant.*`-entiteit. **Electricity price** (`custom:nuvio-eprice-card`) toont de huidige prijs met een label goedkoop, gemiddeld of duur, uur- of kwartierstaven voor vandaag en morgen, en het goedkoopste venster van 1 tot 24 uur; hij leest de prijslijsten van Nord Pool, ENTSO-e, Energi Data Service en vergelijkbare sensoren.
- Gewijzigd: kaarten passen zich beter aan kleine (S) tegels aan. Het kamerraster gaat naar één kolom, afdekkings- en mediategels zetten hun knoppen onder de naam, en de tegels voor wasmachine, boiler, energiestatistieken, stofzuiger, mediaspeler, entiteitenlijst, teller, updates, brandstofprijzen, fasen en waarden persen of kappen hun namen niet meer af. De kaart voor energiestatistieken faalt niet meer als hij één enkele sensor krijgt.
- Opgelost: de voorbeelden in de galerij **Component toevoegen** overlapten het label Voorbeeld en sommige werden afgesneden; hoge voorbeelden schalen nu omlaag om te passen. Slim slot en luchtreiniger hebben hun eigen voorbeelden.
- Documentatie: elke component in [Components](docs/components.md) heeft nu een schermafbeelding van dezelfde grootte, gegroepeerd per categorie, en de README toont er enkele. Het logo in de README is nu zichtbaar in de donkere modus en in HACS.

### 2.14.1
- Opgelost: een tegel of kaart die in de bewerkmodus werd versleept sprong terug naar zijn oude plaats. Het paneelraster pakte smalle kaarten in gaten vóór brede, zodat de nieuwe volgorde werd opgeslagen maar niet getoond. Zodra je een weergave herordent, blijven zijn kaarten en tegels nu precies in jouw volgorde (een gat kan naast een brede kaart blijven; verander de grootte van een kaart om het te vullen). In weergaven met de indeling Masonry of Kolommen verplaatsen de kaarten ook tijdens het slepen in plaats van pas na het opslaan.
- Opgelost: de groottetoetsen S, M en L deden niets zichtbaars bij ingebouwde kaarten van het thuispaneel tot je opsloeg, S kon een kaart niet smaller maken dan zijn standaardbreedte, en een kaart met **Breedte** ingesteld in zijn instellingen negeerde ze. De grootte verandert nu meteen, S betekent echt één kolom, en het kiezen van een grootte vervangt de instelling Breedte. Op aanraakschermen zijn de grootte- en sleepknoppen groter.
- Opgelost: de kiezer van de component **Agenda** toonde geen agenda's, zodat een agenda die niet automatisch werd gekozen (bijvoorbeeld een tweede Google-agenda) niet kon worden toegevoegd. De component en de weergave Agenda gebruiken nu al je agenda's, niet de eerste vier of zes.

### 2.14.0
- Opgelost: na een update kon het dashboard de vorige versie blijven draaien. Een release die alleen het versienummer wijzigde, behield dezelfde bundelbestandsnaam, zodat de browser en de Home Assistant-app het oude gecachete bestand serveerden. De versie maakt nu deel uit van de hash in de bestandsnaam. 2.13.0 werd uitgebracht zonder de onderstaande prestatiewijzigingen.
- Nieuw: **Instellingen > Uiterlijk > Prestaties**, per apparaat opgeslagen. **Glasvervaging** kan Auto, Volledig, Licht of Uit zijn; bij Uit gebruikt geen enkel oppervlak `backdrop-filter`, en glas krijgt een dichtere vulling zodat tekst leesbaar blijft (dialogen en sheets worden ondoorzichtig). **Energiebesparing** (Auto, Aan, Uit) stopt zich herhalende animaties (fotozoom van de schermbeveiliging, draaiende ventilatoren, pulserende ringen, de trommel van de wasmachine en dergelijke) en vernieuwt camerasnapshots hooguit elke 30 s. Bij Auto gaat het aan voor iPads en iPhones met iOS of iPadOS ouder dan 18 en voor erg zwakke hardware, en dan staat de vervaging ook uit. De oude override `home-glass:lite` werkt nog.
- Opgelost: batterijverbruik op oudere tablets. Animaties in kaarten die buiten beeld zijn gescrold pauzeren tot de kaart terugkomt, de mediavoortgangstimer slaat seconden over terwijl de pagina of kaart verborgen is, en de themacontrole die voor elke kaart bij elke statuswijziging van Home Assistant draait, leest niet meer elke keer de opslag.
- Documentatie: README opnieuw ontworpen; wijzigingslogboek, configuratie- en ontwikkeldocumentatie verplaatst naar aparte bestanden.

### 2.12.0
- Nieuw: de instellingen van een kamersectie kunnen nu entiteiten toevoegen en verwijderen. Open in de bewerkmodus een sectie in een kamer (bijvoorbeeld **Lichten**): de lijst **Entiteiten** eindigt met een rij **Entiteit toevoegen** waarvan de kiezer alleen entiteiten toont die bij de sectie passen (lichten en schakelaars voor Lichten, thermostaten voor Klimaat, camera's voor Camera's enzovoort). De entiteit wordt aan de kamer toegewezen en komt meteen in die sectie terecht.
- Nieuw: elke entiteit in een kamersectie heeft een verwijderknop. Een entiteit die je zelf hebt toegevoegd, wordt uit de kamer verwijderd (**Verwijderen uit kamer**). Een entiteit die uit het Home Assistant-gebied komt, wordt alleen in deze kamer verborgen (**Verbergen in deze kamer**), zonder het gebied in Home Assistant aan te raken; opnieuw toevoegen toont haar weer. De instellingen worden met de andere kamertoewijzingen in de indeling opgeslagen.
- Bevat de LiveKid-kinderkaart en het schermbeveiligingspaneel uit de testreleases 2.11.1 tot 2.11.3.

### 2.11.3
- Nieuw: opnieuw ontworpen kinderpaneel (LiveKid) op de schermbeveiliging. Board: een kaart boven de mediaspeler met grote inchecktijd en uitchecktijd, de volgende activiteit met een aftelling en twee latere. Glass: een blok naast het weer in dezelfde stijl als de temperatuur. Photo: duidelijkere status en naam.
- Nieuw: neutrale kinderstatus, **Op locatie** en **Weg**, op elke schermbeveiligingsstijl, op de Kinderkaart en in zijn galerijvoorbeeld.
- Nieuw: het schermbeveiligingspaneel toont wanneer het kind op de locatie is, nog niet is aangekomen of klaar is voor de dag.

### 2.11.2
- Nieuw: de Kinderkaart (LiveKid) is nu een gewone kaart, vermeld in de Nuvio-kaartgalerij en in de HA-kaartkiezer met een voorbeeld. Ze toont aanwezigheid op de crèche of kleuterschool, inchecken en uitchecken, maaltijden, ongelezen nieuws en de rekening.
- Nieuw: kinderpaneel op de schermbeveiliging. Op weekdagen toont het het activiteitenplan van vandaag plus de in- en uitchecktijden, op alle schermbeveiligingsstijlen.
- Nieuw: **Instellingen > Wandtabletmodus** heeft een LiveKid-schakelaar. Hij toont of de entiteiten van de integratie zijn gedetecteerd; als dat zo is, staat hij standaard aan, anders is hij uitgeschakeld met de opmerking **Niet gedetecteerd**.

### 2.11.1
- Nieuw: Kinderkaart voor de LiveKid-integratie (in deze versie alleen YAML). De entiteiten van het kind worden automatisch door de integratie gevonden, nooit via entiteits-id's; bij meerdere kinderen kies je er één met `child` (naam) of `entity`.
- Nieuw: een compact kinderpaneel op de fotoschermbeveiliging (alleen test, in deze versie achter een vlag).

### 2.11.0
- Nieuw: brandstofprijzen in de header kunnen worden uitgezet zonder ze te verwijderen. **Instellingen > Koptekst en navigatie** heeft een schakelaar voor de hele brandstofsectie en één op elke brandstofrij. Een verborgen brandstof behoudt zijn rij met gedimde velden, en met de sectie uit klapt de lijst in tot een korte opmerking. De header wordt meteen bijgewerkt, en de instelling wordt in de indeling opgeslagen en meegenomen in export en import.
- Nieuw: een glazen kleurkiezer vervangt de kleurkiezer van de browser in elk kleurveld (kleurverloop en orbkleuren van de schermbeveiliging, accent, achtergrondkleuren en kaartinstellingen). Hij heeft een verzadigings- en helderheidsvlak, een tintschuif, een HEX-veld en snelle kleuren, waaronder Nuvio-limoen.
- Opgelost: de galerij van de schermbeveiliging en het live voorbeeld in Instellingen tonen nu echte weergaven met je achtergrond en gegevens. Eerder bleven ze zwart of leeg als je het tabblad Schermbeveiliging opende na een ander tabblad, en het live voorbeeld had geen breedte op telefoons.
- Opgelost: het kiezen van de bewegingssensor van de schermbeveiliging laat de pagina niet meer vastlopen bij duizenden entiteiten. De lijst opent meteen, toont beweging-, bezettings- en aanwezigheidssensoren en filtert terwijl je typt. Het Instellingen-venster opent ook veel sneller omdat lange sensorlijsten pas worden gevuld als je ze opent.
- Opgelost: Annuleren in de bewerkmodus maakt wijzigingen die al in Instellingen zijn opgeslagen niet meer ongedaan.

### 2.10.1
- Opgelost: in **Instellingen > Koptekst en navigatie** worden de titel en ondertitel van de huishoudstrook (de avatars van de personen) weer opgeslagen. Eerder gingen de wijzigingen verloren als je het venster met **Klaar** sloot; nu slaat Klaar ze op, de strook wordt meteen bijgewerkt zonder pagina herladen en de sectie toont een live voorbeeld. Een nieuwe rij verwijst naar de koptekst-editor van de huidige weergave.
- Opgelost: de grafiek **Energy · week** is veel hoger en makkelijker te lezen. De hoogte groeit mee met de kaartgrootte (S, M, L), de staven zijn breder, productie gebruikt een eigen amberkleur en kleine waarden blijven zichtbaar, en de dag- en waardelabels zijn groter.

### 2.10.0
- Nieuw: de koptekst van elke weergave kan in de bewerkmodus worden bewerkt. Tik op het limoenkleurige potlood naast de titel om de titel, ondertitel en een optioneel pictogram in te stellen, de hele koptekst of alleen de ondertitel te tonen of te verbergen, en kortere versies voor telefoon en tablet toe te voegen. Dit werkt in alle weergaven, inclusief Kamers en de enkele kamerweergave: daar voegt `{room}` de kamernaam in, houdt een lege ondertitel de live temperatuur en kamerstatus, en is het pictogram standaard het kamerpictogram. Een verborgen koptekst blijft tijdens het bewerken zichtbaar, vervaagd en gemarkeerd als "Header hidden". Kopteksten worden in de indeling opgeslagen en meegenomen in export en import.
- Opgelost: de laatste onvertaalde teksten volgen nu de gekozen taal (het gedeelde indelingsdashboard, de standaardtitel van de Mediakaart en de foutmelding van de kaart). Een nieuwe controle in de build faalt als een tekst geen Poolse of Engelse versie heeft.

### 2.9.0
- Nieuw: taalkiezer in **Instellingen → Uiterlijk → Taal** (Automatisch / Polski / English) en in het gebruikersmenu voor iedereen. Wisselen gaat direct, zonder pagina herladen, en de keuze wordt per persoon opgeslagen (dit apparaat en het HA-account). De standaard is nu de browsertaal (Pools of Engels, anders Engels) in plaats van de profieltaal van HA.

### 2.8.4
- Opgelost: de robotkaart toont nu elke onderhoudssensor met zijn eigen eenheid. Eerder werd elke waarde als percentage getoond, zodat een hoofdborstel met nog 255 u er als 255% uitzag. Sensoren in `%` behouden de slijtagebalk; sensoren in uren, dagen of andere eenheden tonen de waarde en eenheid zonder balk. De waarden van de laatste schoonmaakbeurt (tijd, oppervlak, totaal) nemen hun eenheid ook van de entiteit.

### 2.8.3
- Opgelost: de strategieoptie `language:` wint nu altijd. Eerder werd ze genegeerd zodra de wizard (of het opslaan van weergaven of kamers) een taal had opgeslagen, zodat het dashboard in het Pools kon blijven, zelfs met `language: en`.

### 2.8.2
- Opgelost: terwijl het pincodetoetsenbord open is op de schermbeveiliging Glass Minimal, wordt het scherm niet meer verduisterd. De achtergrond, inhoud en assistent-orb worden in plaats daarvan vervaagd, en het toetsenbord blijft goed leesbaar.

### 2.8.1
- Opgelost: het pincodetoetsenbord op de schermbeveiliging Glass Minimal opent nu op een eigen laag boven een vervaagde schermbeveiliging, zoals bij Clock on photo, in plaats van bovenop de klok en kaarten. Het aantikken van de orb terwijl het scherm vergrendeld is, vraagt eerst om de pincode en opent daarna Assist.

### 2.8.0
- Nieuw: schermbeveiligingsstijl **Glass Minimal** (Instellingen > Schermbeveiliging): een grote klok met de datum, weer met een 3D-pictogram, nu aan het spelen met de albumhoes, een achtergrondbol, de assistent-orb en de familierij. Alle schermbeveiligingen worden gekozen uit een galerij van live voorbeelden, die elk het hele scherm verkleind tonen. Het aantikken van de orb opent Assist rechtstreeks vanaf de schermbeveiliging (kan worden uitgezet).
- Configureerbaar: kleurverloop, orb (aan of uit, kleuren, intensiteit), achtergrondbol, eigen afbeelding uit de galerij of een upload, dimmer 's nachts, datumnotatie, avatar, klokformaat, grootte en positie, datum, weer en nu aan het spelen aan of uit, familie (wie, grijs als afwezig), hinttekst en verminderde beweging. Instellingen worden per Home Assistant-gebruiker opgeslagen en meegenomen in export en import. Eerdere keuzes voor Carousel en Bento openen als Minimal.
- Alle kaarten delen nu één glazen achtergrond; de aparte warme tint op de kaarten voor zon, energie, vermogen en fasen is verdwenen.
- De 3D-afbeeldingen worden meegeleverd in dist als `nuvio-3d-*.webp` (Fluent Emoji 3D van Microsoft, MIT-licentie).

### 2.7.0
- Nieuw: slimme-slotkaart (`custom:nuvio-smartlock-card`, **+ Add → Smart lock**). Een geanimeerd hangslot in een ronde knop: houd het ingedrukt om te ontgrendelen terwijl een ring zich vult, tik om te vergrendelen. Een draaiende boog toont dat het slot beweegt, een puls bevestigt de nieuwe status en het hangslot schudt als het slot vastzit. Batterij en deursensor worden op hetzelfde apparaat gevonden, en er verschijnt een knop Deur openen als het slot dat ondersteunt. Sloten met een code vragen er eerst om.

### 2.6.1
- Luchtreinigerkaart: de PM2.5-sensor wordt van hetzelfde apparaat als de luchtreiniger genomen (ook sensoren met de naam pm2_5 zonder apparaatklasse, en het oudere xiaomi_miio-aqi-attribuut), zodat de kaart geen andere sensor in huis meer toont. De meting volgt ook een sensor die verschijnt nadat Home Assistant is gestart.

### 2.6.0
- Nieuw: luchtreinigerkaart (`custom:nuvio-purifier-card`, **+ Add → Air purifier**). Grote PM2.5-meting die stap voor stap naar een nieuwe waarde telt, label en kleur op basis van de luchtkwaliteit (schoon, goed, matig, slecht, zeer slecht), luchtgolven die zich vanaf het getal verspreiden met een snelheid die de modus volgt, aan/uit-schakelaar en voorkeuzemodi met een schuivende markering. De PM2.5-sensor wordt automatisch gevonden of in het formulier gekozen.

### 2.5.1
- De Nu-aan-het-spelen-kaart op het board komt overeen met de widgets: lichte vervaagde achtergrond zonder rand, witte tekst en pictogrammen. Een titel die te lang is voor de kaart scrolt (marquee).

### 2.5.0
- Board-widgets zien eruit als widgets op het vergrendelscherm van de iPhone: lichte vervaagde achtergrond zonder rand, witte tekst en witte pictogrammen (het weer gebruikt witte symbolen, kamermeters zijn wit).
- Instellingen van de wandtablet: widgets onder de klok vormen één lijst met omhoog, omlaag en verwijderen; verborgen widgets komen terug met "Add widget". Weer, agenda's, kamers, de bewegingssensor en notify-services zijn lijsten met een knop "Add" die een doorzoekbare keuzelijst opent.
- Pictogramveld: een klik ergens op het veld opent de pictogramlijst, en typen filtert hem.
- Verticale stack klapt niet meer in op iPhone (Safari).
- "Sensor met grafiek" in een stack toont de grafiek weer, en tegelnamen breken niet meer midden in een woord.

### 2.4.0
- **Board opnieuw ontworpen zoals het vergrendelscherm van de iPhone**: datum en een grote dunne klok gecentreerd bovenaan, daaronder een rij kleine glazen widgets op de foto (weer met hoog/laag en regenkans, volgende zonsopgang of zonsondergang, aftelling, de huidige en volgende gebeurtenis met "over 18 min", en kamertemperaturen als ronde meters met luchtvochtigheid), en onderaan de meldingsstapel en een compacte Now Playing-speler. Alles is compact, zodat niets wordt afgesneden op korte schermen; op een telefoon staan de widgets twee per rij. De kop toont standaard de tijd; de fotokaart is verdwenen omdat de foto de achtergrond is (fotobron is nu ook voor het board beschikbaar).

### 2.3.0
- **Meldingen op de schermbeveiliging**: berichten die met notify naar dit apparaat worden gestuurd (een legacy-service `notify.mobile_app_…` of `notify.send_message` met een `notify.*`-entiteit) verschijnen op de schermbeveiliging als een stapel in iPhone-stijl: de nieuwste kaart bovenaan met de volgende eronder uitstekend, een tik vouwt de stapel uit tot een lijst (Show less / wissen), en een tik op een kaart toont zijn volledige tekst. Het aantikken van meldingen wekt het scherm niet; een normaal ontwaken markeert ze als gelezen. Kies de services onder Wandtabletmodus → Meldingen op dit apparaat (per apparaat opgeslagen). Vereist een beheerdersaccount, omdat het naar `call_service`-gebeurtenissen luistert.

### 2.2.0
- **Board opnieuw ontworpen als widgets**: grote vette datum over de dashboardfoto, zonsopgang en zonsondergang als gewone pictogramregels, en onderaan één rij gelijke glazen widgets (weer, binnenkort, nu aan het spelen, kamers), in StandBy-stijl. Geen vakken meer in vakken: gebeurtenissen hebben een dunne kleurbalk, kamers zijn een nette lijst met een gekleurd pictogram en een grote lichte temperatuur, widgettitels zijn kleine labels in hoofdletters. Het weer is naar de widgetrij verplaatst met een compacte voorspelling. Op een telefoon stapelen de widgets zich onder de kop.

### 2.1.1
- **Board-afwerking**: kaarten rekken niet meer uit met lege ruimte; de widgets dokken onderaan en de foto blijft in het midden zichtbaar. Het weer is een compacte kaart rechtsboven. Now Playing is een compacte widget met een hoesminiatuur. Licht glas is zuiverder wit en donker glas is rokerig in plaats van grijze nevel. De fotokaart verschijnt alleen als er meer dan één foto is (anders herhaalde hij de achtergrond). Kamers op een telefoon zijn tegels met de volledige naam. Sterkere schaduw onder de kop voor contrast op heldere foto's.

### 2.1.0
- **Board-schermbeveiliging in premium glas**: het board staat nu op de dashboardfoto (dezelfde diavoorstelling, Ken Burns en dimmen als de fotoschermbeveiliging), met matglazen kaarten, lichte randen en zachte schaduwen zoals de rest van Nuvio; witte datumkop over de foto, glazen chips, accentbadge voor de volgende gebeurtenis. Het thema "Auto" volgt nu het dashboard.
- **Telefoonindeling**: op een staande telefoon is het board één kolom (fotokaart verborgen, aangezien de foto de achtergrond is), kamers worden getoond als raster van twee kolommen met luchtvochtigheid onder de naam, en lijstrijen die niet passen worden helemaal verborgen in plaats van doormidden gesneden. Kaarten waarvoor geen ruimte meer is, worden overgeslagen, zodat nooit iets wordt afgesneden.

### 2.0.0
- **Schermbeveiliging "Board" (nieuw)**: een tweede schermbeveiligingsstijl naast de klok op een foto. Ze toont een grote weekdag of klok met de datum, zonsopgang en zonsondergang, een aftelling naar de volgende hele-dag-gebeurtenis (bijvoorbeeld "Halloween over 17 dagen"), weer met een uurlijkse voorspelling (dagelijks als de service geen uurgegevens heeft), komende gebeurtenissen voor de volgende twee weken, nu aan het spelen, een foto (dashboardachtergrond, diavoorstelling of je eigen adres) en een lijst met kamertemperaturen met luchtvochtigheid. Alles is configureerbaar in Instellingen → Schermbeveiliging: boardthema (auto op basis van de zon, licht, donker), kop (weekdag of tijd), welke elementen worden getoond, de volgorde van de kaarten, de weerentiteit, welke agenda's en welke kamers worden gebruikt. Werkt in landschap en portret, met de pincodevergrendeling en met ontwaken door beweging.
- **Verticale stack (fix)**: kaarten in een verticale stack nemen hun natuurlijke hoogte aan; eerder kon een kaart tot een smalle strook worden samengeperst.

### 1.9.1
- **AC-afstandsbediening**: het wijzigen van de modus (bijvoorbeeld koelen naar verwarmen) laat de kaart, luchtstroom, schuifknop en tegels soepel overvloeien in de nieuwe kleur, en het apparaat gloeit kort in de nieuwe kleur.

### 1.9.0
- **Mediaspeler (herontwerp)**: spelers in Multimedia en in kamers gebruiken een grote Now Playing-indeling: albumhoes als achtergrond (de kleur ervan kleurt de kaart), bron- en statusregel, grote titel en artiest, voortgang met tijden, shuffle / vorige / grote play / volgende / herhalen, en een volumerij met − en + plus de chips Rooms (luidsprekers samenvoegen tot een groep), Source en Sound als de speler ze ondersteunt. Op smalle kaarten verbergen shuffle en herhalen zich en tonen chips alleen pictogrammen.
- **AC-afstandsbediening**: op schermen van 700 px en breder openen de tegels Mode, Fan, Sleep en Airflow een uitklapmenu naast de tegel (pijltjestoetsen werken, een tweede tik sluit het); telefoons behouden het onderste paneel.

### 1.8.1
- **Kamers bewerken (fix)**: kamers leggen kaarten uit in hetzelfde raster als de andere weergaven, zodat de bewerkmodus en de opgeslagen indeling er hetzelfde uitzien, in de brede weergave en in het zijpaneel. Eerder gebruikte de brede kamerweergave een aparte kolomindeling en sprongen kaarten rond na het opslaan.
- **Kamergalerij (fix)**: + Add in een kamer toont elke component, containers inbegrepen, en de componentinstellingen bieden de grootte aan.

### 1.8.0
- **AC-afstandsbediening (nieuwe component)**: een aparte kaart in + Add in de stijl van een AC-afstandsbedieningsapp. Het apparaat toont geanimeerde luchtstroom (blauw bij koelen, oranje bij verwarmen, sneller bij hogere ventilatorsnelheid, zwaaiend als de lamellen zwaaien), een grote streeftemperatuur, een koud-naar-warm-schuifregelaar met − en +, aan/uit en Eco. De tegels Mode, Fan, Sleep en Airflow openen een onderste paneel met de opties; de kaart toont alleen wat het apparaat ondersteunt. Werkt in de groottes S, M en L en in lichte en donkere thema's.

### 1.7.3
- **Galerij Component toevoegen (fix)**: miniaturen gebruiken altijd de voorbeeldweergaven; verkleinde live kaarten waren krap, leeg (airconditioning) of toonden een willekeurig apparaat (robots, sensorgrafiek, scène). De voorbeelden voor zon, kamers, vermogen, huishoudapparaat, trap, updates, weer en minispeler zijn herwerkt zodat niets wordt afgesneden.

### 1.7.2
- **Kaarten naast elkaar (fix)**: componenten die in de bewerkmodus worden toegevoegd zijn nu aparte kaarten in het weergaveraster, zodat ze tussen en naast de standaardkaarten kunnen worden gesleept (ook ter plaatse van grootte veranderd en verwijderd). Eenvoudige entiteitstegels blijven samen in hun blok.
- **Weerkaart (fix)**: in grootte S staan het pictogram en de temperatuur in de bovenste rij met de beschrijving eronder, overlappen zonsopgang en zonsondergang niet meer, sluit de temperatuurlijn aan op de uren, verspreiden enkele uren zich over de volle breedte, vervaagt de strook aan de randen, en blijft de zonnestip rond in L.
- **Huishouden en Energy · week in S (fix)**: de teller staat boven de avatars en zones staan onder de namen; de twee totalen staan naast elkaar en alleen de balk van vandaag toont zijn waarde.
- **Galerij Component toevoegen (fix)**: voorbeelden voor licht, thermostaat, waarde, geschiedenis, openingen, batterijen, stofzuiger, minispeler, klok, zon, notitie, afbeelding en updates, plus een vernieuwd weervoorbeeld.

### 1.7.1
- **Snellere pagina's (fix)**: de scrollhintknop op brede schermen wipt niet meer eindeloos (zijn glasvervaging werd elk frame opnieuw gerenderd); alleen zijn pictogram wipt drie keer. Zonder de energy-flow-kaart draait een pagina nu in rust op 60 fps in plaats van ongeveer 25 op een 6x tragere CPU.
- **Lichtere energy-flow-kaart (fix)**: geen vervaging in de kaart, geen gloed op de bewegende stippen, geen draaiende zon, animaties stoppen terwijl de kaart buiten beeld is, en het diagram wordt alleen opnieuw ingepast als zijn indeling verandert.

### 1.7.0
- Toegevoegd: de kaart **Energy flow** neemt meerdere sensoren per bron. Net-, zonne-, export- en thuissensoren worden opgeteld (bijvoorbeeld drie fasen of twee omvormers), en elke batterij krijgt zijn eigen cirkel met zijn niveau, naam en stroom, verbonden door een bus onder het diagram (tot 4). Het aantikken van een cirkel met meerdere sensoren laat je kiezen welke je opent.

### 1.6.0
- Toegevoegd: kaart **Energy flow** (`custom:nuvio-flow-card`): net, zon, batterij en huis op één glazen diagram met stippen die langs de lijnen stromen, sneller bij hoger vermogen. Het net toont import of export, de batterij zijn niveau en of hij laadt, en de huisring en de legenda tonen hoeveel vermogen van zon, net en batterij komt. Ze staat in **+ Add** met een live voorbeeld, en de weergave Energie zet haar bovenaan als ze net- en zonne- of batterijvermogenssensoren vindt.

### 1.5.1
- Opgelost: het sluiten van het Assist-venster met X liet zijn berichten, suggesties en invoer op het scherm achter zonder het glas erachter. Het gesloten venster wordt nu volledig verwijderd, en het gesprek wordt bewaard voor de volgende keer openen.

### 1.5.0
- Toegevoegd: zichtbaarheid van weergaven per persoon in **Instellingen → Weergaven**. Elke weergave is standaard voor iedereen zichtbaar; een beheerder kan een weergave voor gekozen personen verbergen, en de rij toont wie hem niet ziet. Het geldt ook voor mensen met hun eigen indeling, en hun open scherm wordt opnieuw geladen om de weergave te laten vallen.

### 1.4.0
- Toegevoegd: gedeeld dashboard. Standaard ziet iedereen hetzelfde dashboard, ingesteld door een beheerder; niet-beheerders krijgen geen lege standaardindeling meer. De eerste beheerder die 1.4.0 opent, maakt van zijn indeling de gedeelde.
- Toegevoegd: **Instellingen → Gebruikers** voor beheerders, met een schakelaar per Home Assistant-gebruiker. Een persoon die wordt uitgezet krijgt een eigen indeling, die begint als een kopie van de gedeelde, en kan die zelf bewerken.
- Toegevoegd: wijzigingen aan het gedeelde dashboard bereiken open schermen live.
- Opgelost: Assist-instellingen worden nu in Home Assistant opgeslagen in plaats van bij het volgende opslaan van de indeling verloren te gaan.

### 1.3.1
- Toegevoegd: ontgrendelanimatie voor de pincodevergrendeling. Het hangslot opent, de pincodestippen gloeien groen, de toetsen drijven vanuit het midden naar buiten, een zachte lichtgolf verspreidt zich en de vervaagde schermbeveiliging tilt weg om het dashboard te onthullen. Verminderde beweging krijgt een korte fade.

### 1.3.0
- Toegevoegd: pincodevergrendeling voor de schermbeveiliging (BETA) in **Uiterlijk → Wandtabletmodus**: pincode, vergrendelvertraging en aan/uit. Een vergrendelde schermbeveiliging toont een rond glazen pincodetoetsenbord over de vervaagde foto, met de pincodestippen erboven en een knop **Vergrendelen** eronder.
- Toegevoegd: *Scherm vergrendelen* in het gebruikersmenu als de pincodevergrendeling aan staat. Een vergrendeld scherm blijft vergrendeld na een pagina herladen.

### 1.2.1
- Opgelost: tablets in landschap (vanaf 900 px breed en een beeldverhouding van 1,2, zoals een iPad die op zijn zij wordt gehouden) gebruiken weer de desktopindeling in plaats van de tabbalk van de telefoon met de zijrail te mengen en de panelen uit te rekken. De tabletindeling blijft voor portret en vierkantere vensters, en zijn schaal wordt nu ook beperkt door de vensterhoogte.

### 1.2.0
- Toegevoegd: zeven kaarten: conditional (`custom:nuvio-conditional-card`), glance, statistics, humidifier, timer, logbook en web page, elk in **+ Add** met een live voorbeeld. HA-`conditional`-kaarten worden de Nuvio-conditional-kaart.
- Toegevoegd: *Turn kiosk mode off* in het gebruikersmenu als Kiosk Mode is geïnstalleerd (alleen beheerders). Het laadt opnieuw met `?disable_km` en houdt dat vast terwijl je in dit tabblad tussen weergaven wisselt; hetzelfde item zet het weer aan.
- Toegevoegd: een formulierbibliotheek (`hgForm`, `nuvio-check`-schakelaar) die door de componentformulieren en de back-upeditor wordt gebruikt; datalists van de browser worden vervangen door de glazen suggestielijst.
- Gewijzigd: kaarten, tegels en binnenpanelen in de lichte modus zijn minder transparant.
- Gewijzigd: de schuifregelaarkaart bestuurt ook de doelluchtvochtigheid van een luchtbevochtiger.

### 1.1.0
- Toegevoegd: indelingscontainers zoals in Home Assistant: grid (`custom:nuvio-grid-card`), verticale stack en horizontale stack, in een nieuwe groep *Layout* van **+ Add** met live voorbeelden.
- Toegevoegd: het formulier van een container toont zijn kaarten. Voeg elke component, tegel of HA-kaart toe, bewerk elke kaart in zijn eigen formulier, sleep om te herordenen, dupliceer, verwijder en stel de kolomspan in een grid in. Containers nesten tot drie niveaus.
- Toegevoegd: verplaats een kaart vanuit het paneel naar een container via zijn formulier, en verplaats een kaart uit een container terug naar het paneel.
- Toegevoegd: *Card from HA (YAML)* plakt een kaart uit de code-editor van Home Assistant. HA-`grid`, -`vertical-stack` en -`horizontal-stack` worden daar en in de paginaconfiguratie Nuvio-containers (`keep_ha: true` behoudt de HA-kaart).
- Gewijzigd: de stackkaart heeft een tussenruimte, breedteverhouding voor naast elkaar staande kaarten, een breedte waaronder hij verticaal wordt, en scheidingslijnen die kunnen worden uitgezet.

### 1.0.1
- Gewijzigd: het Assist-venster gebruikt hetzelfde glas, dezelfde accentkleur en beweging als de andere Nuvio-vensters, in het lichte en het donkere schema. Je berichten, de typstippen, de microfoon en het gefocuste veld volgen allemaal de accentkleur.
- Gewijzigd: de assistent- (model)kiezer zit rechts in het berichtveld, met de naam ingekort als hij te lang is. De gekozen assistent wordt onthouden en wordt ook de standaard in de instellingen.
- Opgelost: in het lichte schema waren de instellingen- en editorvensters te transparant boven een drukke achtergrond.
- Gewijzigd: weerdetails openen in het gedeelde Nuvio-venster, met dezelfde vervaging en open- en sluitanimatie als andere dialogen.

### 1.0.0
Het nieuwe ontwerp is compleet: elke kaart is opgebouwd uit de gedeelde glasblokken, wordt live bijgewerkt en past zich aan kleine, middelgrote en grote formaten aan. Deze release rondt het werk af met snelheidsverbeteringen.
- Gewijzigd: de bundel is geminificeerd, van 1253 KB naar 1033 KB (307 KB in plaats van 366 KB als de server comprimeert). Opgeslagen indelingen en instellingen worden niet beïnvloed.
- Gewijzigd: kaarten buiten het zichtbare deel van de pagina worden niet meer bij elke statuswijziging opnieuw getekend. Ze halen één keer bij, vlak voordat ze in beeld scrollen. Op een telefoon met het voorbeelddashboard kost een volledige ronde sensorwijzigingen nu ongeveer 3,3 ms in plaats van 4,2 ms.
- Gewijzigd: de geschiedenis-, netwerk- en editorgrafieken gebruiken de gedeelde geschiedenisopslag, zodat dezelfde sensor één keer voor allemaal uit Home Assistant wordt opgehaald.
- Gewijzigd (ontwikkeling): `tools/build.py` minificeert met esbuild als dat is geïnstalleerd (`npm install`); zonder werkt de build nog steeds en schrijft een niet-geminificeerde bundel.

### 0.16.0
- Toegevoegd: twaalf generieke kaarten opgebouwd uit de gedeelde glasblokken: begroeting, schakeltegel, voortgangsbalk, boog, grafiek, compacte kamer, snelle acties, familie, afdekking, slot, ventilator en takenlijst. Elk werkt met elke entiteit van het juiste domein en past zich aan kleine, middelgrote en grote breedtes aan. Zie *Generic cards and containers* hierboven.
- Toegevoegd: twee containers voor het bouwen van dashboards: een stack (meerdere kaarten in één glas, verticaal of horizontaal) en tabs (pillen die wisselen tussen sets kaarten). Beide accepteren Nuvio-kaarten en gewone Home Assistant-kaarten.
- Toegevoegd: een voorbeelddashboard dat alleen uit de nieuwe kaarten is gemaakt, `docs/examples/inspiration-dashboard.yaml`, gemodelleerd naar het referentieontwerp.
- Toegevoegd: de nieuwe kaarten in de galerij *Component toevoegen* van de editor, met voorbeelden.
- Gewijzigd: Nuvio-kaarten die in een gewone Home Assistant-weergave zijn geplaatst, vervagen en kleuren de achtergrond zelf, zodat ze op glas lijken in plaats van op een flauw vlies. Binnen de Nuvio-pagina verandert er niets (het paneel vervaagt nog steeds één keer voor alle kaarten).
- Toegevoegd: dialogen kunnen teruggeven wat in hun velden is getypt (`hgOverlay.dialog({ collect: true })`), en Enter in een veld drukt op de hoofdknop. De slotkaart gebruikt het voor slotcodes.
- Toegevoegd (ontwikkeling): één gedeelde geschiedenisopslag (`src/parts/ui/history.part.js`), zodat meerdere kaarten met dezelfde sensor en periode Home Assistant één keer vragen.

### 0.15.0
- Gewijzigd: elke kaart wordt nu live bijgewerkt, inclusief de kaarten voor licht, lamp, schuifregelaar, airconditioning, alarm, assistent, robot en kamer. Een statuswijziging bouwt deze kaarten niet meer opnieuw op, zodat een open mediaspeler of camera in een kamerkaart blijft spelen, en het codeveld in de alarmkaart behoudt wat je typte.
- Gewijzigd: knoppen, schakelaars en pictogramcirkels in alle algemene kaarten gebruiken hetzelfde glas, dezelfde gloed en veerbeweging als de nieuwe bouwblokken. Pictogramcirkels zijn rond, actieve knoppen gloeien zacht in de accentkleur, en schakelaars rekken licht uit terwijl ze worden ingedrukt.
- Gewijzigd: binnenhoeken volgen de designtokens: kaarten 24 px, tegels en banen in kaarten 16 px, kleine chips 12 px, hetzelfde bij elke kaartgrootte.

### 0.14.0
- Gewijzigd: één uiterlijk en één beweging voor elk venster boven het dashboard. Bevestigingen (bijvoorbeeld "Alles uitzetten?") zijn nu glazen vensters die zacht groeien over een vervaagde achtergrond, de toetsenbordfocus binnen houden, hem teruggeven aan de knop waarvan je kwam, en sluiten met Escape. Ze verschijnen ook boven de eerste-keer-wizard, waar ze eerder erachter waren verborgen.
- Toegevoegd: glazen tooltips. Pictogramknoppen en elementen met een hint tonen na kort zweven of toetsenbordfocus een klein wit label, in plaats van de grijze tooltip van de browser. Hints die alleen de zichtbare tekst herhalen, worden overgeslagen.
- Gewijzigd: meldingen onderaan het scherm gebruiken de gedeelde bewegingstokens en blijven nu boven open vensters.
- Toegevoegd (ontwikkeling): `hgOverlay` in `src/parts/ui/overlay.part.js` met `dialog`, `alert`, `sheet` (van onderaf op telefoons, van opzij op brede schermen, omlaag slepen om te sluiten), `popover`, `menu` (pijltjestoetsen, aangevinkte items), `toast` en `tip`. `HGConfirm.ask` behoudt zijn signatuur en gebruikt nu `hgOverlay.alert`. De meldingsstapel is verplaatst naar `src/parts/ui/toast.part.js`. De galeriepagina toont elke overlay.

### 0.13.0
- Gewijzigd: kaarten worden nu live bijgewerkt. Wanneer een apparaat van status verandert, worden alleen de delen van de kaart die veranderden bijgewerkt in plaats van de hele kaart opnieuw te tekenen, zodat balken en schakelaars naar de nieuwe waarde glijden, focus en scrollpositie blijven, en snelle sensoren kaarten niet meer laten flikkeren. Kaarten met eigen sleepbedieningen (licht, AC, schuifregelaar, lamp, kamer) behouden voorlopig het vorige gedrag.
- Gewijzigd: schakelaars bewegen met een zachte veer en rekken licht uit terwijl ze worden ingedrukt.
- Toegevoegd (ontwikkeling): gedeelde bouwblokken in `src/parts/ui/` (pictogramknop, pil, tabs, schakelaar, header, grote waarde, voortgangsbalk, boog, vlakgrafiek, avatars) en een galeriepagina `tests/ui-gallery.html`.

### 0.12.0
- Gewijzigd: nieuw glasuiterlijk voor kaarten, panelen en zwevende bedieningen, dichter bij het referentieontwerp. Glas heeft nu een zachte lichtreflectie vanuit de linkerbovenhoek, een dunne heldere rand die bovenaan sterker is, en een diepere zachte schaduw. In het donkere schema is het paneel achter de kaarten donkerder, zodat kaarten meer opvallen.
- Toegevoegd (ontwikkeling): designtokens voor vorm, glas, beweging en lettertype in `src/theme_head.js`, beschreven in DESIGN.md.

### 0.11.2
- Gewijzigd (ontwikkeling): elke kaart staat nu in zijn eigen bronbestand in `src/parts/cards/` (57 bestanden in plaats van 14), en hulpfuncties die door meerdere kaarten worden gedeeld staan in `src/parts/shared/`. Het dashboard werkt precies als voorheen: de gebouwde bundel bevat dezelfde code. Dit is de eerste stap van de nieuwe componentbibliotheek en het nieuwe ontwerp.

### 0.11.1
- Opgelost: op tablets (iPad en andere aanraakschermen van 768 tot 1180 px, beide oriëntaties) gebruikt het dashboard de tabletindeling, waarbij de pagina scrolt in plaats van het glazen paneel. Kamerweergaven knippen kaarten bovenaan niet meer af, overlappen geen kolommen en tonen geen misplaatst vervaagd blok; ze gebruiken een raster van maximaal twee kolommen.
- Opgelost: de lijst van de assistentkiezer in het Assist-dialoogvenster opent direct onder zijn knop in plaats van ergens anders op het scherm, en het dialoogvenster is gecentreerd met meer ruimte voor het label van de kiezer.

### 0.11.0
- Gewijzigd: Assist is nu een glazen dialoogvenster in plaats van een kaart. Open het met de microfoonknop in de header of de toets A; op een telefoon schuift het omhoog als een onderste sheet. Het gesprek, de assistentkiezer, microfoon, suggesties en gesproken antwoorden blijven, en het gesprek gaat door voor de hele sessie. Sluit met X, Escape of een tik erbuiten.
- Toegevoegd: Assist-instellingen in Ustawienia, tabblad Nagłówek i nawigacja: headerknop, sneltoets A, standaardassistent, gesproken antwoorden, microfoon en je eigen suggesties.
- Gewijzigd: Assist wordt niet meer aangeboden in + Dodaj. Bestaande Assist-kaarten tonen een kleine knop die het dialoogvenster opent.
- Opgelost: het vegen over de instellingentabbladen, een schuifregelaar, een kiezer of een horizontaal scrollende rij wisselt de dashboardweergave niet meer, en weergavevegen staat uit terwijl een dialoogvenster open is.

### 0.10.2
- Opgelost: de Assist-kaart heeft zijn eigen vervaagde glasoppervlak, zodat inhoud erachter er niet meer doorheen schijnt. Bubbels, suggestiechips en het invoerveld hebben sterker contrast.

### 0.10.1
- Opgelost: de titel van de Assist-kaart blijft zichtbaar naast de assistentkiezer.

### 0.10.0
- Toegevoegd: Assist-kaart. Praat met Home Assistant Assist vanuit een glazen kaart: tekstveld, microfoon (spraakherkenning van de browser), assistentkiezer, antwoorden in chatbubbels, gesprek gaat door over vragen heen, optionele gesproken antwoorden, suggestiechips. Volledige formulierconfiguratie, JSON-veld en export en import.
- Toegevoegd: DESIGN.md met de UI-regels waaraan elke nieuwe functie moet voldoen.

### 0.9.1
- Gewijzigd: de schermbeveiliging toont gewone witte tekst en pictogrammen met een zachte schaduw, zonder panelen erachter. De wekhint staat gecentreerd onderaan met een zachte puls die verminderde beweging respecteert.
- Gewijzigd: alle schuifregelaars gebruiken één eigen stijl: smalle baan, accentvulling, witte knop die groeit bij zweven en slepen, duidelijke toetsenbordfocus.

### 0.9.0
- Toegevoegd: 13 nieuwe componenten in + Add: licht met helderheid, thermostaat, grote waarde, geschiedenisgrafiek, deuren en ramen, batterijen, stofzuiger, minispeler, klok, zon, notitie, afbeelding of pagina, updates.
- Toegevoegd: instellingenpaneel met tabbladen (Uiterlijk, Weergaven, Kamers, Koptekst en navigatie, Achtergronden, Schermbeveiliging, Back-up), tabel met weergave-instellingen met labels.
- Gewijzigd: tegelgroottes S, M en L zijn echte rasterspans met dichte pakking, zodat kleinere tegels naast elkaar staan.
- Gewijzigd: kaartinhoud schaalt mee met de tegelgrootte via container queries.
- Gewijzigd: brandstofprijsrijen in de headerinstellingen zijn gestapelde kaarten met kortere sensornamen gegroepeerd per integratie.
- Opgelost: de knop voor het bewerken van de titel blijft naast de titel in weergaven over de volle breedte.

### 0.8.1
- Opgelost: widgets die in de bewerkmodus zijn toegevoegd volgen nu het aantal kolommen van de weergave, zodat Energie en Netwerk met 3 kolommen de volle breedte gebruiken.

### 0.8.0
- Toegevoegd: aantal kolommen voor elke weergave op desktop en tablet, inclusief de ingebouwde weergaven zoals Energie.
- Toegevoegd: pictogram per weergave, kort label voor de telefoonbalk en zichtbaarheid en volgorde in de zijbalk. Lange labels op de telefoonbalk krimpen in plaats van afgekapt te worden.
- Toegevoegd: keuze van de weerentiteit voor de header, automatische keuze geeft de voorkeur aan een entiteit met een voorspelling, en een optionele voorspellingssensor (elke entiteit met een `forecast`-attribuut, bijvoorbeeld van MQTT) voor de uurstrook.
- Toegevoegd: positie van de huishoudstrook, links of naast het paneel.
- Toegevoegd: focuspunt van de achtergrond, opgeslagen in de indeling.
- Opgelost: een paneel over de volle breedte (en andere instellingen per weergave of uiterlijk) kon verloren gaan als het dashboard in een ander browsertabblad open was, omdat indelingssecties als geheel werden opgeslagen. Ze worden nu sleutel voor sleutel samengevoegd.
- Opgelost: in Kamers toont een entiteit onder Overig die bij een eigen kamer hoort, de naam van die kamer.

### 0.7.1
- Opgelost: kamerweergaven gebruiken nu warm water, trap, entiteitsnamen en camera-instellingen uit Uiterlijk, Kamers (eerder werden alleen namen, pictogrammen, volgorde en sensoren toegepast).
- Opgelost: de kop van de kamerweergave toont de kamernaam, temperatuur, luchtvochtigheid en een terugknop in plaats van de generieke titel.
- Opgelost: het opslaan van Uiterlijk, Koptekst en navigatie laat de lijst met huishoudpersonen niet meer vallen.

### 0.7.0
- Toegevoegd: componenten voor alles wat Home Glass toont, elk in + Add met een voorbeeld en een volledig instellingenformulier: Rooms, Room, Appliance (wasmachine, droger, vaatwasser met status, programma, resterende tijd en voortgang), Hot water, Stairs, Fuel prices, Air conditioning card, Energy week, Phases, Solar, Network, Home sensors, Shortcut en Person.
- Toegevoegd: elke kaartcomponent heeft een veld Geavanceerde configuratie (JSON), zodat elke kaartoptie (labels, kleuren, drempels, acties) in het formulier kan worden bewerkt.
- Toegevoegd: Uiterlijk, Kamers: kamernamen, pictogrammen, volgorde en zichtbaarheid, temperatuur- en luchtvochtigheidssensor per kamertegel (automatisch, gekozen of geen), eigen kamers met willekeurige entiteiten onafhankelijk van Home Assistant-gebieden, en handmatige entiteitstoewijzing.
- Toegevoegd: Uiterlijk, Koptekst en navigatie: huishoudtitel of geen huishoudstrook, brandstofprijzen in de dashboardheader, en de vier weergaven op de telefoonbalk.
- Toegevoegd: Uiterlijk, Achtergrondgalerij: je eigen afbeeldingen opgeslagen in de indeling, ook gebruikt door de diavoorstelling van de wandtablet.
- Gewijzigd: export en import van de indelingsback-up bevatten alles hierboven, en de controle op ontbrekende entiteiten omvat kamer- en brandstofsensoren.

### 0.6.5
- Opgelost: instellingen van de wandtablet (schermbeveiliging) werden niet opgeslagen als een ander op Home Glass gebaseerd dashboard als Lovelace-resource op dezelfde Home Assistant was geïnstalleerd. Beide bundels deelden één indelingsopslag in het geheugen, zodat Nuvio naar de sleutel van het andere dashboard schreef, dat geen schermbeveiligingssectie heeft. Nuvio houdt nu zijn eigen globals bij, en elke build krijgt een nieuwe bestandsnaam met inhoudshash.

### 0.6.4
- Gewijzigd: de kaart **Klimaat** is terug naar het uiterlijk van 0.5.0 (grote temperatuur met pijlen, de streepjesschuifregelaar en de modusknoppen); de ronde draaiknop uit 0.6.0 is weg. De aanraakafhandeling blijft: veeg de schuifregelaar zijwaarts om de temperatuur in te stellen (omhoog of omlaag vegen scrolt de pagina, een tik springt naar die plek), houd de temperatuur ingedrukt om de entiteitsdetails te openen, tik erop om een uitgeschakeld apparaat aan te zetten, houd de pijlen ingedrukt om te herhalen, een lichte trilling bij elke stap (Home Assistant-app of ondersteunende telefoons), en Page Up/Down, Home/End op het toetsenbord.

### 0.6.1
- Wandtabletmodus: de klok staat niet meer op een glazen paneel. De datum staat nu vast linksonder en, als Home Assistant een weerentiteit heeft, verschijnt het huidige weer (pictogram, temperatuur, toestand) rechtsboven.

### 0.6.0
- Nieuw uiterlijk voor de kaart **Klimaat**: een glazen thermostaatwijzerplaat (boog van 270°) met een koud-naar-warm-temperatuurverloop, een versleepbare knop, een stip voor de binnentemperatuur en een zachte gloed in de modus-kleur (oranje verwarmen, blauw koelen, blauwgroen drogen) die ademt terwijl het apparaat echt werkt. Modusknoppen gebruiken dezelfde kleuren.
- Aanraking op de Klimaatkaart: sleep langs de boog om de temperatuur in te stellen (de pagina scrolt nog steeds als je door het midden van de wijzerplaat veegt), houd het midden ingedrukt om de entiteitsdetails te openen, tik op het midden om een uitgeschakeld apparaat aan te zetten, houd −/+ ingedrukt om te herhalen. Elke stap geeft een lichte trilling (Home Assistant-app of telefoons die dat ondersteunen). Toetsenbord: pijlen, Page Up/Down, Home/End.
- Compact klimaat (kamerpagina's): de streepjesstrook is nu een glazen schuifregelaar met het temperatuurverloop. Veeg zijwaarts om in te stellen, tik om te springen, veeg omhoog of omlaag om de pagina te scrollen.
- Consistentieronde over componenten: binnentegels in Media, Robots, Sensors, Alarm en Cameras gebruiken één gedeeld glasoppervlak (dezelfde vulling en een lichte bovenrand) in lichte en donkere modus in plaats van vier licht verschillende witte vullingen met randen.
- Opgelost: in de weergave Kamers werd de kamernaam bij sommige breedtes (bijv. 1440 px) afgesneden door de temperatuur; kamertegels groeien nu om te passen. Kamerstatusstippen gebruiken nu de klimaatmodus-kleuren.

### 0.5.0
- Nieuw: **Wandtabletmodus** (standaard uit). Na inactiviteit verschijnt een glazen schermbeveiliging met een grote klok, de datum en een foto, die het scherm dimt; aanraking, een toetsaanslag of een bewegingssensor (elke `binary_sensor`, gekozen in de instellingen) wekt hem. In **Uiterlijk → Wandtabletmodus** stel je de inactiviteitstijd, het dimniveau, de fotobron (dashboardachtergrond, diavoorstelling of je eigen URL) en de sensor in, en kun je een voorbeeld bekijken. De klok drijft licht om OLED-panelen te beschermen, het scherm blijft aan terwijl hij wordt getoond, verminderde beweging wordt gerespecteerd, en hij verschijnt boven Home Assistant-dialogen. De instellingen maken deel uit van de indelingsback-up.

### 0.4.1
- Nieuw uiterlijk voor de eerste-keer-wizard: modern glazen paneel over je achtergrond, een stappenrail links met je keuzes tot nu toe (tik op een voltooide stap om terug te gaan), een live dashboardvoorbeeld op het welkomstscherm, soepele stapovergangen en gespreide tegels (verminderde beweging gerespecteerd). Kamers krijgen Alles selecteren / Alles wissen, de samenvattingsrijen openen hun stap, Enter gaat naar de volgende stap, en kleurnamen volgen de gekozen taal. Op telefoons klappen de stappen in tot een voortgangsbalk.
- Opgelost: op het welkomstscherm bij brede formaten (bijv. 1440 px) werd de tekst onder "Welcome to Nuvio" bedekt door het fotoverloop. De tekst staat nu op het glas, naast het voorbeeld.

### 0.4.0
- Nieuw: indelingsback-up in Uiterlijk. Exporteer de hele indeling naar een JSON-bestand met versie of het klembord, waarbij je kiest wat je opneemt, en importeer haar uit een bestand, via slepen en neerzetten of geplakte tekst. Import valideert het bestand, toont een samenvatting met weergaven, widgets en entiteiten die op deze instantie ontbreken, biedt Vervangen of Samenvoegen, bewaart de huidige indeling als back-up met Vorige herstellen met één klik, zet oudere gegevens om en weigert foute bestanden met een duidelijke melding. Alleen voor beheerders.

### 0.3.24
- Opgelost: een gewijzigd pictogram verschijnt nu in het live voorbeeld tijdens het bewerken, niet alleen na het opslaan. Groepsindelingen (Lijst, Raster, Carrousel, Compacte lijst) hadden helemaal geen pictogram in de voorbeeldkop, en sectievoorbeelden konden het verkeerde pictogram wijzigen in plaats van het pictogram van de sectiekop.

### 0.3.23
- Opgelost: de pictogramkiezer (veld Pictogram) volgt nu het lichte en donkere thema. In de donkere modus was de lijst licht met witte, nauwelijks zichtbare pictogrammen; nu is hij matglas in de eigen kleuren van het thema met duidelijke pictogrammen en labels in beide modi. Hij opent en sluit met een korte animatie, de pijl draait terwijl hij open is, de lijstkop toont hoeveel pictogrammen bij de zoekopdracht passen, een plaatshouderraster toont terwijl pictogrammen laden, en de lijst vervaagt aan de onderrand. Verminderde beweging wordt gerespecteerd.

### 0.3.22
- Opgelost: live voorbeelden in de instellingenvensters voor componenten en kaarten zijn niet langer te groot of uitgerekt. Een nieuwe component wordt getoond op zijn natuurlijke hoogte en paneelbreedte; een bestaande kaart op de exacte grootte die hij op de pagina heeft; beide worden verkleind om te passen en gecentreerd, zonder lege ruimte. Tegel- en groepsvoorbeelden behouden de paneelbreedte in plaats van het hele venster te beslaan.

### 0.3.21
- Gewijzigd: CI/CD verwijderd (de GitHub Actions-releaseworkflow, inclusief de HACS-validatietaak). Releases en tags worden alleen lokaal gebouwd met `tools/release.sh`.

### 0.3.20
- Toegevoegd: zweven en toetsenbordfocus op de tegels in de pop-up Meer weergaven (helderder glas, zachte schaduw, lichte lift; drukfeedback; geen lift op aanraakschermen of met verminderde beweging).

### 0.3.19
- Opgelost: de pop-up Meer weergaven naast de rail staat nu duidelijk boven de zoomwerkbalk en het huishoudpaneel: dichter glas met een sterkere vervaging, een lichte verduistering erachter, en de clip die voor de openingsanimatie wordt gebruikt vervalt zodra die klaar is (hij schakelde de glasvervaging in sommige browsers uit, zodat inhoud er doorheen scheen). Buiten klikken of op Escape drukken sluit hem.

### 0.3.18
- Opgelost: het weer in de header gebruikt weer het geanimeerde pictogram (0.3.17 schakelde het per ongeluk over op het stilstaande pictogram; het was niet de oorzaak van de gloedband).
- Bevat de wijzigingen van 0.3.17, die nooit zijn getagd: geen gloedband op weergaven met een paneel van halve breedte, en de tab- en railindicatoren houden geen permanente GPU-laag meer aan.

### 0.3.17
- Gewijzigd: de tab- en railindicatoren houden geen permanente GPU-laag meer aan (ze worden alleen gepromoveerd terwijl ze animeren).

### 0.3.16
- Opgelost: Klaar, Opslaan en andere primaire knoppen leggen vast en sluiten zonder te vragen. De bevestiging Wijzigingen verwerpen verschijnt alleen bij het sluiten van een formulier met niet-opgeslagen wijzigingen (kaartinstellingen, componentformulier) met X, Escape, de achtergrond of een veeg; sheets die wijzigingen live toepassen (Uiterlijk, titel, Verborgen herstellen, de galerij) vragen nooit.
- Opgelost: het annuleren van de bewerkmodus herstelt de indeling weer correct (de controle op niet-opgeslagen wijzigingen uit 0.3.13 overschreef de momentopname van de bewerkmodus).
- Opgelost: de knop Verwerpen gebruikt de Home Assistant-foutkleur in plaats van een vast rood, en de tegel Toevoegen in de bewerkmodus behoudt de grootte van een kleine tegel.

### 0.3.15
- Opgelost: de knop voor het verbergen van het paneel wisselt zijn pictogram (oog) en label en meldt zijn status met aria-pressed.
- Opgelost: lange entiteitsnamen op tegels worden boven en onder niet meer afgesneden; ze lopen door tot 2 regels met een weglatingsteken, en onbekende waarden tonen Geen gegevens in plaats van een streepje.
- Gewijzigd: de groottekiezer is een glazen gesegmenteerde bediening met grootteglyphen, gelijke breedtes en de labels Klein, Gemiddeld en Volledige breedte, met de geselecteerde in de accentkleur.
- Opgelost: in de bewerkmodus loopt de tegel Toevoegen als volgende rastercel, even groot als een kleine tegel, zonder lege rijen; de sleep-, verwijder- en grootteknoppen zitten netjes op de tegelranden.
- Opgelost: alle voetknoppen in dialogen hebben dezelfde hoogte en marge, rechts uitgelijnd, en stapelen zich op telefoons over de volle breedte.
- Nieuw: het veld Pictogram heeft een doorzoekbare pictogramkiezer met de volledige MDI-lijst van Home Assistant, recente pictogrammen, toetsenbordnavigatie en een live voorbeeld; mdi:naam met de hand typen werkt nog steeds.

### 0.3.14
- Opgelost: een weergave of paneel zonder zichtbare items toont de status Lege weergave met een knop Widget toevoegen, live na verwijderen, verbergen, ongedaan maken of opnieuw doen, in de bewerkmodus en de normale modus, op elk weergavetype. Ongedaan maken herstelt de items en verbergt hem weer.
- Opgelost: de knop Ongedaan maken in meldingen gebruikt de tekstkleur die bij het themaaccent past.

### 0.3.13
- Opgelost: het componentformulier dat vanuit de kaartinstellingen is geopend, gaat terug naar waar het vandaan werd geopend (Terug sluit het) in plaats van naar de galerij. Elke bewerkingssheet gebruikt nu één navigatiestapel.
- Gewijzigd: getypte tekst, zoekopdrachten en selecties blijven behouden bij heen en weer gaan, de scrollpositie wordt per stap bewaard, de focus gaat naar de staptitel en keert terug naar de bediening die de stap opende. Escape stapt terug. Sluiten met niet-opgeslagen wijzigingen vraagt om bevestiging (Verwerpen of Blijven), alleen als er iets is gewijzigd. Op een telefoon sluit omlaag vegen alleen het hoogste niveau en een veeg vanaf de linkerrand gaat één stap terug. Slides volgen de instellingen voor verminderde beweging.
- Nieuw: het gebruikersmenu toont de Nuvio-versie en een updatepil (van de HACS-update-entiteit, of GitHub-releases die hooguit elke 6 uur worden gecontroleerd) met een stip op de avatar, plus een herlaadhint als er al een nieuwer bestand op de server staat.

### 0.3.12
- Opgelost: navigatie in de bewerkingssheets werkt als een stapel. In een geneste stap (een entiteit kiezen, het componentformulier, de widgetstijl, een entiteit wijzigen vanuit de kaartinstellingen) brengen de X, Escape en een nieuwe terugpijl je terug naar de vorige stap met behoud van de status; alleen de X op het hoogste niveau (de galerij + Add of de instellingen) sluit de sheet. Stappen schuiven in en uit zonder dat de sheet sluit en opnieuw opent.

### 0.3.11
- Gewijzigd: ontworpen voorbeelden in de galerij + Add. Elke component toont een kleine mock met voorbeeldgegevens, gemarkeerd als voorbeeld (schuifregelaar met vulling, knop, entiteitsrijen met schakelaars, select, stepper, metersboog, licht, sensorwaarde, sparkline, klimaat, afdekking, scènes, mediaspeler, camera's, vermogen, energie, weer, personen, alarm, robots, agenda, kaart) in dezelfde glas- en accentstijl. Een live voorbeeld met een echte entiteit wordt alleen gebruikt als elke entiteit die nodig is een bekende status heeft.
- Gewijzigd: componenten zonder passende entiteit blijven selecteerbaar, zijn slechts licht gedimd en tonen één korte regel (Geen passende entiteit) met de vereiste domeinen in kleinere tekst en een tooltip. Kaarten hebben gelijke hoogtes, voorbeelden hebben één hoogte en lange teksten worden afgekapt op telefoon, tablet en desktop.

### 0.3.10
- Nieuw: paneelbreedte per weergave. Elke weergave (ingebouwd en eigen) biedt **Smal paneel** (een rechterkolom zoals het hoofdpaneel, waarbij de linkerkant vrij blijft voor de titel en achtergrond) of **Paneel over volle breedte** (zoals Kamers), met kleine voorbeelden. De keuze staat in de titelsheet van de weergave (bewerkmodus, titel) en in het formulier voor eigen weergaven, wordt live toegepast zonder het dialoogvenster opnieuw te openen en wordt per weergave opgeslagen. Een smal paneel bevat hooguit twee kolommen; op telefoons is het paneel altijd over de volle breedte.
- Gewijzigd: de hint voor een lege weergave blijft zichtbaar tot een eigen weergave drie items heeft en staat onder de tegels, zodat een weergave met één enkele rij er niet meer leeg uitziet.

### 0.3.9
- Opgelost: eigen weergave-indelingen verschillen nu echt. **Raster** behoudt gelijke rijen met kaarten uitgerekt tot de rijhoogte, **Kolommen** stapelt kaarten van boven naar beneden in elke kolom op volgorde zonder rijen uit te lijnen, **Masonry** plaatst elke kaart in de kortste kolom, en **Paneel** toont het weer bovenaan met twee kolommen. Opgeslagen per weergave en toegepast na herladen.
- Opgelost: het instellingendialoogvenster van de weergave wordt ter plaatse bijgewerkt. Het kiezen van een indeling, pictogram of andere optie sluit en opent het dialoogvenster niet meer; scrollpositie, getypte tekst en focus blijven behouden.

### 0.3.8
- Nieuw: één glazen select voor heel Nuvio. Elke keuzelijst (weergavekolommen per apparaat, maximale breedte, bron van de mediaspeler) gebruikt nu een glazen trigger die bij de invoervelden past en een geanimeerde glazen lijst met de vervaging zichtbaar vanaf het eerste beeld, een vinkje in het themaaccent bij de geselecteerde optie, volledige toetsenbordondersteuning (pijlen, Home, End, Enter, Esc, typen om te zoeken), ARIA-listboxsemantiek, sluiten bij een klik erbuiten, omklappen naar boven bij de onderrand en grotere aanraakdoelen op telefoons. De lijst wordt boven sheets en ander glas gerenderd, zodat hij nooit wordt afgesneden. De native select blijft eronder als bron van de waarde.

### 0.3.7
- Nieuw: externe terugval voor afbeeldingen en lettertypen. Nuvio laadt achtergronden, galeriemininaturen en lettertypen eerst uit de lokale installatie en, als een bestand niet laadt, van jsDelivr vastgepind op de draaiende versie (`cdn.jsdelivr.net/gh/kczepiec/nuvio@v<version>/dist/`). Offline-installaties blijven werken met lokale bestanden.
- Opgelost: glasnaden op fotoachtergronden. Het dimmen van de achtergrond is nu één enkele overlay in plaats van een CSS-filter op de schermvullende foto, en de achtergrondlagen zijn weer gewone vaste lagen, zodat vervaagde elementen één uniforme achtergrond bemonsteren.
- Opgelost: de popover "Meer" van de rail is vanaf het eerste beeld matglas (onthullingsanimatie in plaats van dekking vervagen, wat de vervaging uitschakelde) en zijn tegels behouden gelijke hoogte en uitlijning.
- Opgelost: weergaven met dezelfde titel of vergelijkbare paden. Het actieve railitem komt overeen met hele padsegmenten (`/nuvio/test` licht niet meer op voor `/nuvio/test2`), en `rail_overflow` accepteert een weergavepad en wijst nooit twee items aan één element toe.

### 0.3.6
- Nieuw: sectiebreedte. De instellingen van een dashboardsectie bieden **Automatisch**, **Volledige breedte** of **Half** met een klein visueel voorbeeld; op telefoons is elke sectie over de volle breedte. Opgeslagen per sectie.
- Nieuw: in de bewerkmodus controleert Nuvio de server op een nieuwere `nuvio.js` en vraagt om een herlaadbeurt zonder cache (Ctrl+Shift+R) als de browser een oudere gecachete build draait. De kop van de galerij + Add toont de geladen versie.
- Gewijzigd: hintkaarten voor een lege status gebruiken een straal van 16 px en een kleinere pictogramtegel.
- Opgelost: achtergrondminiaturen die niet laden tonen "Afbeelding niet geladen" in plaats van een stil kleurverloop, en loggen de URL in de console.
- Opgelost: de geselecteerde achtergrondminiatuur had een dubbele focusomtrek; toetsenbordfocus is nu één afgeronde ring in de accentkleur, geen bij een muisklik.
- Opgelost: achtergrond en schaduw zijn enkele schermvullende GPU-lagen, zodat glaselementen één achtergrond bemonsteren (gericht op een verticale naad die in Chrome op macOS werd gezien).

### 0.3.5
- Opgelost: een achtergrond die in een oudere versie is gekozen (opgeslagen met het oude pad `assets/backgrounds/` of `assets/bg/`) wordt gemigreerd naar het nieuwe platte `nuvio-bg-*`-bestand, zodat hij na het updaten weer verschijnt.

### 0.3.4
- Opgelost: lettertypen, achtergronden en weericonen ontbraken na een HACS-installatie. HACS downloadt alleen bestanden die rechtstreeks in `dist/` staan, dus alle assets staan nu daar met unieke namen (`nuvio-font-*`, `nuvio-bg-*`, `nuvio-meteo-*`); achtergrondvermeldingen staan in `dist/CREDITS.md`.
- Opgelost: de assetbasis wordt uit de module-URL genomen, zodat een handmatige installatie onder `/local/nuvio/` zijn eigen lettertypen en achtergronden laadt in plaats van die van `/hacsfiles/nuvio/`.

### 0.3.3
- Opgelost: in de bewerkmodus werden de sleephandgreep en X van het eerste blok in een kamerkolom op het blok van de vorige kolom getekend; elk blok heeft nu precies één handgreep (linksboven), één X (rechtsboven) en S/M/L erin.
- Gewijzigd: releases voegen `nuvio.zip` of `nuvio.js` niet meer toe. HACS installeert dan de volledige map `dist/` inclusief `assets/` (lettertypen, achtergronden); met bijgevoegde bestanden sloeg het `dist/` over en hield een oude build. Handmatige installatie gebruikt `dist/` uit het bronarchief van de release.

### 0.3.2
- De kop van de galerij + Add toont de geladen Nuvio-versie, zodat een verouderde of gecachete bundel (geen groep Basic) makkelijk te herkennen is. Laad na het updaten in HACS de browser opnieuw (Ctrl+Shift+R) of wis de appcache.

### 0.3.1
- Opgelost: de generieke componenten (Slider, Button, Entity list, Select, Stepper, Gauge) ontbraken in de galerij + Add in kamers (de kamergalerij vermeldde alleen tegelcomponenten); ze verschijnen nu in een groep **Basic** met live miniaturen, en kamers renderen toegevoegde componenten.
- Gewijzigd: het componentformulier toont geen kiezer voor de weergavemodus meer; echte varianten zijn gelabeld als **Componentopties**.
- Opgelost: niet-aangevinkte selectievakjes in het kamerimportdialoogvenster waren onzichtbaar op donkere achtergronden.

### 0.3.0
- Nieuw: lege kamerweergave met twee acties. **Importeren uit gebied** toont de entiteiten van het gebied (en entiteiten waarvan de naam bij de kamer past) met selectievakjes, een zoekopdracht **Entiteiten kiezen** voor handmatige keuze, en een optie om ze ook aan het gebied in Home Assistant toe te wijzen; geselecteerde entiteiten worden tegels gerangschikt op type (klimaat en camera's groot, media middelgroot). **Eigen indeling maken** opent de bewerkmodus met een lege kamer en de galerij + Add.

### 0.2.1
- Opgelost: HACS registreerde `nuvio.zip` in plaats van `nuvio.js` als dashboardresource, zodat de dashboardstrategie nooit laadde ("Timeout waiting for strategy element").

### 0.2.0
- Opgelost: scèneknoppen roepen nu `scene.turn_on` aan (ze deden eerder niets).
- Opgelost: kW / MW-vermogenssensoren worden omgerekend naar watt in de kaarten voor vermogen, energie, fasen en PV.
- Opgelost: camera's in de kamerweergave gaan na ~10 minuten niet meer stuk (roterend afbeeldingstoken).
- Opgelost: het opslaan van de indeling voegt samen met de nieuwste serverkopie (geen overschrijving tussen apparaten); de lokale cache is per Home Assistant-gebruiker.
- Opgelost: AC-chevrons blijven niet meer herhalen na loslaten buiten de kaart; `heat_cool`-bereikthermostaten zijn alleen-lezen; standaardstap van 0,5 °C.
- Opgelost: tv in stand-by gaat aan; play/pauze-, afdekkings- en klepknoppen respecteren wat het apparaat ondersteunt.
- Opgelost: maandagenda wordt vernieuwd; het alarmcodeveld behoudt de focus; weer gebruikt de neerslageenheid en tekstuele windrichtingen.
- Opgelost: de pagina crasht niet meer met een lege rail; het verlaten van de bewerkmodus via navigatie slaat op in plaats van te verwerpen.
- Toegevoegd: Engelse UI voor alle kaarten, de pagina en de bewerkmodus.
- Toegevoegd: herordenen met het toetsenbord in de bewerkmodus; ongedaan maken na het verwijderen van een tegel herstelt alleen die tegel.
- HACS: lettertypen, achtergronden en weericonen worden met de plugin geïnstalleerd (hele map `dist/`).
- Onboardingwizard in meerdere stappen; eigen weergaven (Uiterlijk → Weergaven); componenten en weergaven voor Kaart en Agenda.
- Algemene componenten: schuifregelaar, knop, entiteiten, select, stepper, meter.
- Hintkaarten voor lege status, weergavemodi voor groepskaarten, bewerkbare weergavetitel en -ondertitel, gestapelde toaster.

### 0.1.1
- Component-first galerij "+ Add" met live voorbeeld; fix voor de kioskla; componentencatalogus in de README.
