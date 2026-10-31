[English](../components.md) · [Polski](../pl/components.md) · **Français**

# Composants

Nuvio fournit ses cartes sous forme d’éléments personnalisés. Cette page liste chaque carte, ses entités et ses options. Retour au [README](../../README.fr.md).

Chaque carte s’utilise aussi seule sous la forme `custom:nuvio-<nom>-card` (par exemple dans un tableau de bord classique après *Prendre le contrôle*). Captures : thème sombre, fond d’écran par défaut, données de démonstration.

<details open>
<summary><b>Climat et air</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/climate.webp" alt="Climatisation" width="100%"><br><b>Climatisation</b> <code>tile</code><br>Température, modes et ventilation.</td>
<td width="50%" valign="top"><img src="../components/ac.webp" alt="Climatisation (carte)" width="100%"><br><b>Climatisation (carte)</b> <code>custom:nuvio-ac-card</code><br>Grande carte : température, modes, ventilation, programmation.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/acremote.webp" alt="Télécommande clim." width="100%"><br><b>Télécommande clim.</b> <code>custom:nuvio-acremote-card</code><br>Soufflage en direct, consigne, mode, ventilation et sommeil.</td>
<td width="50%" valign="top"><img src="../components/thermo.webp" alt="Thermostat" width="100%"><br><b>Thermostat</b> <code>custom:nuvio-thermo-card</code><br>Température de consigne plus et moins, et modes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/humid.webp" alt="Humidificateur" width="100%"><br><b>Humidificateur</b> <code>custom:nuvio-humidifier-card</code><br>Humidité cible sur un arc et modes.</td>
<td width="50%" valign="top"><img src="../components/purifier.webp" alt="Purificateur d’air" width="100%"><br><b>Purificateur d’air</b> <code>custom:nuvio-purifier-card</code><br>PM2.5 avec ondes d’air, marche/arrêt et modes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/airq.webp" alt="Qualité de l’air" width="100%"><br><b>Qualité de l’air</b> <code>custom:nuvio-airq-card</code><br>CO₂, particules, COV et humidité avec seuils colorés.</td>
<td width="50%" valign="top"><img src="../components/fan.webp" alt="Ventilateur" width="100%"><br><b>Ventilateur</b> <code>custom:nuvio-fan-card</code><br>Vitesse sur un arc et modes.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/plant.webp" alt="Plante" width="100%"><br><b>Plante</b> <code>custom:nuvio-plant-card</code><br>Humidité du sol, lumière et fertilité avec plages.</td>
<td width="50%" valign="top"><img src="../components/weather.webp" alt="Météo" width="100%"><br><b>Météo</b> <code>custom:nuvio-weather-card</code><br>Maintenant, prévisions horaires, soleil.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/sun.webp" alt="Soleil" width="100%"><br><b>Soleil</b> <code>custom:nuvio-sun-card</code><br>Lever, coucher et position du soleil.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Lumières et appareils</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/switch.webp" alt="Lumière / interrupteur" width="100%"><br><b>Lumière / interrupteur</b> <code>tile</code><br>Allumer et éteindre d’un seul toucher.</td>
<td width="50%" valign="top"><img src="../components/light.webp" alt="Lumière avec luminosité" width="100%"><br><b>Lumière avec luminosité</b> <code>custom:nuvio-lamp-card</code><br>Interrupteur, curseur de luminosité, niveaux rapides et température de couleur.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/toggle.webp" alt="Tuile interrupteur" width="100%"><br><b>Tuile interrupteur</b> <code>custom:nuvio-toggle-card</code><br>Nom, état et interrupteur sur une ligne.</td>
<td width="50%" valign="top"><img src="../components/slider.webp" alt="Curseur" width="100%"><br><b>Curseur</b> <code>custom:nuvio-slider-card</code><br>Luminosité, volume, ventilateur, volet, nombre.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/arc.webp" alt="Arc" width="100%"><br><b>Arc</b> <code>custom:nuvio-arc-card</code><br>Luminosité ou niveau sur un arc à faire glisser.</td>
<td width="50%" valign="top"><img src="../components/cover.webp" alt="Volet / portail" width="100%"><br><b>Volet / portail</b> <code>tile</code><br>Ouvrir, arrêter, fermer.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/cover2.webp" alt="Volet avec position" width="100%"><br><b>Volet avec position</b> <code>custom:nuvio-cover-card</code><br>Barre à faire glisser et boutons.</td>
<td width="50%" valign="top"><img src="../components/lock.webp" alt="Serrure" width="100%"><br><b>Serrure</b> <code>custom:nuvio-lock-card</code><br>Déverrouillage avec confirmation.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/smartlock.webp" alt="Serrure connectée" width="100%"><br><b>Serrure connectée</b> <code>custom:nuvio-smartlock-card</code><br>Cadenas animé, appui long pour déverrouiller, batterie et porte.</td>
<td width="50%" valign="top"><img src="../components/vacuum.webp" alt="Aspirateur" width="100%"><br><b>Aspirateur</b> <code>custom:nuvio-vacuum-card</code><br>Un robot : état, batterie, démarrage et retour à la base.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/robots.webp" alt="Robots" width="100%"><br><b>Robots</b> <code>custom:nuvio-robots-card</code><br>Aspirateurs et tondeuses : état et commandes.</td>
<td width="50%" valign="top"><img src="../components/appliance.webp" alt="Électroménager" width="100%"><br><b>Électroménager</b> <code>custom:nuvio-appliance-card</code><br>Lave-linge, sèche-linge, lave-vaisselle : état, programme, temps restant, progression.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/cwu.webp" alt="Eau chaude" width="100%"><br><b>Eau chaude</b> <code>custom:nuvio-cwu-card</code><br>Température, chauffe, puissance, durée et interrupteurs du chauffe-eau.</td>
<td width="50%" valign="top"><img src="../components/stairs.webp" alt="Escalier" width="100%"><br><b>Escalier</b> <code>custom:nuvio-stairs-card</code><br>Séquence d’éclairage bas et haut avec détecteurs de mouvement.</td>
</tr>
</table>
</details>

<details open>
<summary><b>Scènes et actions</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/run.webp" alt="Scène / script" width="100%"><br><b>Scène / script</b> <code>tile</code><br>Un bouton pour le lancer.</td>
<td width="50%" valign="top"><img src="../components/scenes.webp" alt="Scènes et scripts" width="100%"><br><b>Scènes et scripts</b> <code>custom:nuvio-scenes-card</code><br>Plusieurs boutons dans une carte.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/button.webp" alt="Bouton" width="100%"><br><b>Bouton</b> <code>custom:nuvio-button-card</code><br>Script, scène, button.press ou action.</td>
<td width="50%" valign="top"><img src="../components/actions.webp" alt="Actions rapides" width="100%"><br><b>Actions rapides</b> <code>custom:nuvio-actions-card</code><br>Une rangée de boutons ronds.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/link.webp" alt="Raccourci" width="100%"><br><b>Raccourci</b> <code>custom:nuvio-link-card</code><br>Tuile avec un titre qui ouvre une vue ou une page.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Énergie</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/power.webp" alt="Puissance actuelle" width="100%"><br><b>Puissance actuelle</b> <code>custom:nuvio-power-card</code><br>Valeur actuelle avec une barre et une courbe des dernières heures : puissance, énergie ou prévision. Options : légende du graphique, masquage des libellés du graphique, fin de l’échelle de la barre, libellé du niveau, [graphique de prévision](#graphique-de-prévision) (par exemple 7 jours de Solcast).</td>
<td width="50%" valign="top"><img src="../components/energy.webp" alt="Énergie – statistiques" width="100%"><br><b>Énergie – statistiques</b> <code>custom:nuvio-energy-stats-card</code><br>Consommation et production : aujourd’hui, semaine, mois.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/week.webp" alt="Énergie · semaine" width="100%"><br><b>Énergie · semaine</b> <code>custom:nuvio-week-card</code><br>Barres de consommation et de production des derniers jours.</td>
<td width="50%" valign="top"><img src="../components/phases.webp" alt="Phases" width="100%"><br><b>Phases</b> <code>custom:nuvio-phases-card</code><br>Puissance, tension et courant par phase.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/pv.webp" alt="Photovoltaïque" width="100%"><br><b>Photovoltaïque</b> <code>custom:nuvio-pv-card</code><br>Puissance, production du jour, strings et onduleur.</td>
<td width="50%" valign="top"><img src="../components/flow.webp" alt="Flux d’énergie" width="100%"><br><b>Flux d’énergie</b> <code>custom:nuvio-flow-card</code><br>Réseau, panneaux, batteries et maison avec flux animé.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/eprice.webp" alt="Prix de l’électricité" width="100%"><br><b>Prix de l’électricité</b> <code>custom:nuvio-eprice-card</code><br>Prix horaires d’aujourd’hui et de demain, créneau le moins cher.</td>
<td width="50%" valign="top"><img src="../components/fuel.webp" alt="Prix des carburants" width="100%"><br><b>Prix des carburants</b> <code>custom:nuvio-fuel-card</code><br>Prix depuis des capteurs avec tendance pour demain.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/yield.webp" alt="Prévision de production" width="100%"><br><b>Prévision de production</b> <code>custom:nuvio-yield-card</code><br>Énergie attendue pour les prochains jours, bons et faibles jours.</td>
<td width="50%" valign="top"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Multimédia et caméras</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/media1.webp" alt="Lecteur multimédia" width="100%"><br><b>Lecteur multimédia</b> <code>tile</code><br>Pochette, titre et commandes.</td>
<td width="50%" valign="top"><img src="../components/players.webp" alt="Multimédia" width="100%"><br><b>Multimédia</b> <code>custom:nuvio-players-card</code><br>Liste des lecteurs avec volume.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/mediamini.webp" alt="Mini-lecteur" width="100%"><br><b>Mini-lecteur</b> <code>custom:nuvio-media-mini-card</code><br>Pochette, titre et boutons sur une seule ligne.</td>
<td width="50%" valign="top"><img src="../components/cam1.webp" alt="Caméra" width="100%"><br><b>Caméra</b> <code>tile</code><br>Instantané et vue en direct.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/cameras.webp" alt="Grille de caméras" width="100%"><br><b>Grille de caméras</b> <code>custom:nuvio-cameras-card</code><br>Toutes les caméras choisies à la fois.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Pièces et personnes</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/rooms.webp" alt="Pièces" width="100%"><br><b>Pièces</b> <code>custom:nuvio-areas-card</code><br>Tuiles de pièces avec température, humidité et appareils actifs (Apparence → Pièces).</td>
<td width="50%" valign="top"><img src="../components/room.webp" alt="Pièce" width="100%"><br><b>Pièce</b> <code>custom:nuvio-room-card</code><br>Tous les appareils d’une pièce, en sections.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/roomc.webp" alt="Pièce compacte" width="100%"><br><b>Pièce compacte</b> <code>custom:nuvio-room-compact-card</code><br>Température, interrupteur et réglette de luminosité.</td>
<td width="50%" valign="top"><img src="../components/people.webp" alt="Personnes" width="100%"><br><b>Personnes</b> <code>custom:nuvio-people-card</code><br>Qui est à la maison, zones et heure.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/person.webp" alt="Personne" width="100%"><br><b>Personne</b> <code>custom:nuvio-person-card</code><br>Photo, zone et temps depuis le changement.</td>
<td width="50%" valign="top"><img src="../components/family.webp" alt="Famille (avatars)" width="100%"><br><b>Famille (avatars)</b> <code>custom:nuvio-family-card</code><br>Avatars et qui est à la maison.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/hero.webp" alt="Accueil" width="100%"><br><b>Accueil</b> <code>custom:nuvio-hero-card</code><br>Grand message d’accueil avec votre prénom.</td>
<td width="50%"></td>
</tr>
</table>
</details>

<details open>
<summary><b>Capteurs et graphiques</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/sensor.webp" alt="Valeur du capteur" width="100%"><br><b>Valeur du capteur</b> <code>tile</code><br>Valeur ou état de n’importe quel capteur.</td>
<td width="50%" valign="top"><img src="../components/chart.webp" alt="Capteur avec graphique" width="100%"><br><b>Capteur avec graphique</b> <code>tile</code><br>Valeur et graphique des dernières 24 h.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/chart2.webp" alt="Graphique" width="100%"><br><b>Graphique</b> <code>custom:nuvio-chart-card</code><br>Ligne, aire ou barres à partir de l’historique.</td>
<td width="50%" valign="top"><img src="../components/history.webp" alt="Graphique d’historique" width="100%"><br><b>Graphique d’historique</b> <code>custom:nuvio-history-card</code><br>Plusieurs capteurs sur un même graphique.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/stat.webp" alt="Statistiques" width="100%"><br><b>Statistiques</b> <code>custom:nuvio-stat-card</code><br>Minimum, moyenne, maximum et variation.</td>
<td width="50%" valign="top"><img src="../components/gauge.webp" alt="Jauge" width="100%"><br><b>Jauge</b> <code>custom:nuvio-gauge-card</code><br>Valeur d’un capteur sur un arc.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/progress.webp" alt="Barre de progression" width="100%"><br><b>Barre de progression</b> <code>custom:nuvio-progress-card</code><br>Une valeur sur une barre épaisse avec des seuils.</td>
<td width="50%" valign="top"><img src="../components/value.webp" alt="Grande valeur" width="100%"><br><b>Grande valeur</b> <code>custom:nuvio-value-card</code><br>Un seul nombre avec des seuils de couleur.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/sensors.webp" alt="Capteurs de la maison" width="100%"><br><b>Capteurs de la maison</b> <code>custom:nuvio-sensors-card</code><br>Mouvement, portes, fenêtres, fumée, fuites : onglets et historique.</td>
<td width="50%" valign="top"><img src="../components/openings.webp" alt="Portes et fenêtres" width="100%"><br><b>Portes et fenêtres</b> <code>custom:nuvio-openings-card</code><br>Capteurs d’ouverture, les ouverts en premier.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/battery.webp" alt="Batteries" width="100%"><br><b>Batteries</b> <code>custom:nuvio-battery-card</code><br>Batteries les plus faibles en premier.</td>
<td width="50%" valign="top"><img src="../components/alarm.webp" alt="Alarme" width="100%"><br><b>Alarme</b> <code>custom:nuvio-alarm-card</code><br>Armement et désarmement avec un code.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/net.webp" alt="Réseau" width="100%"><br><b>Réseau</b> <code>custom:nuvio-net-card</code><br>Internet, passerelle, Wi-Fi, appareils, clients (UniFi et autres).</td>
<td width="50%" valign="top"><img src="../components/updates.webp" alt="Mises à jour" width="100%"><br><b>Mises à jour</b> <code>custom:nuvio-updates-card</code><br>Mises à jour disponibles de Home Assistant.</td>
</tr>
</table>
</details>

<details open>
<summary><b>Listes, temps et notes</b></summary>

<table>
<tr>
<td width="50%" valign="top"><img src="../components/entities.webp" alt="Liste d’entités" width="100%"><br><b>Liste d’entités</b> <code>custom:nuvio-entities-card</code><br>Lignes avec interrupteur ou valeur.</td>
<td width="50%" valign="top"><img src="../components/glance.webp" alt="Coup d’œil" width="100%"><br><b>Coup d’œil</b> <code>custom:nuvio-glance-card</code><br>Plusieurs entités sur une ligne : icône, nom, état.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/select.webp" alt="Sélection" width="100%"><br><b>Sélection</b> <code>custom:nuvio-select-card</code><br>Options input_select et select.</td>
<td width="50%" valign="top"><img src="../components/stepper.webp" alt="Compteur" width="100%"><br><b>Compteur</b> <code>custom:nuvio-stepper-card</code><br>Plus et moins pour les compteurs et les valeurs.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/agenda.webp" alt="Calendrier" width="100%"><br><b>Calendrier</b> <code>custom:nuvio-agenda-card</code><br>Agenda ou vue mensuelle.</td>
<td width="50%" valign="top"><img src="../components/logbook.webp" alt="Journal" width="100%"><br><b>Journal</b> <code>custom:nuvio-logbook-card</code><br>Changements récents des entités choisies.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/todo.webp" alt="Liste de tâches" width="100%"><br><b>Liste de tâches</b> <code>custom:nuvio-todo-card</code><br>Ajouter et cocher.</td>
<td width="50%" valign="top"><img src="../components/timer.webp" alt="Minuteur" width="100%"><br><b>Minuteur</b> <code>custom:nuvio-timer-card</code><br>Compte à rebours sur un arc, démarrage et pause.</td>
</tr>
<tr>
<td width="50%" valign="top"><img src="../components/clock.webp" alt="Horloge" width="100%"><br><b>Horloge</b> <code>custom:nuvio-clock-card</code><br>Heure et date.</td>
<td width="50%" valign="top"><img src="../components/note.webp" alt="Note" width="100%"><br><b>Note</b> <code>custom:nuvio-note-card</code><br>Texte avec mise en forme simple.</td>
</tr>
</table>
</details>

**Autres cartes**

Toutes les captures ci-dessus ont la même taille (thème sombre, fond d’écran par défaut, données de démonstration). Ces cartes n’ont pas de capture :

- `custom:nuvio-map-card` : la carte native de HA dans un cadre en verre (les tuiles de la carte nécessitent un accès à Internet).
- `custom:nuvio-image-card` et `custom:nuvio-webpage-card` : votre propre image, un instantané de caméra ou une page dans un cadre.
- `custom:nuvio-kid-card` : présence d’un enfant (LiveKid), arrivée, repas et solde ; nécessite l’intégration LiveKid.
- `custom:nuvio-studio-card` : la grille libre de widgets de la vue Studio (déplacer, redimensionner, ajouter et masquer des widgets ; voir [vue Studio](features.md#vue-studio-bêta)).
- `custom:nuvio-studio-climate-card`, `custom:nuvio-studio-energy-card` et `custom:nuvio-studio-home-card` : widgets Studio pour le climat (cadran de consigne, mode, ventilateur), l’énergie (kWh du jour, de la semaine et du mois avec variation) et la maison (lumières, serrure, caméras en ligne, température). Chacun passe d’une disposition compacte à moyenne puis étendue selon sa propre taille.
- Mode Studio (`studio: true`) des cartes d’accueil, météo (`hourly`), média (`now_playing`), caméras (`thumbs`, `max`, `view_all`) et scènes (`tiles`, `add`).
- `custom:nuvio-energy-card` : pourcentage de charge de la puissance totale des phases par rapport à votre maximum.
- `custom:nuvio-bars-card` : barres de consommation quotidienne à partir des statistiques.
- `custom:nuvio-page` : la disposition plein écran elle-même (barre supérieure, rail, en-tête, panneau des cartes).

## Air, plantes et prix de l’électricité (2.15.0)

| Carte | Rôle | Options |
|---|---|---|
| `custom:nuvio-airq-card` | CO₂, PM2.5, PM10, COV, NO₂, IQA et humidité sous forme de tuiles avec des niveaux bon, moyen, médiocre ou mauvais et une note globale | `entities` (vide = un capteur de chaque type, d’une même pièce si possible), `title` |
| `custom:nuvio-plant-card` | Humidité du sol, lumière, température et fertilité avec la plage idéale sous forme de bande, les besoins de la plante et la batterie du capteur | `entity` (`plant.*`, facultatif), `moisture`, `illuminance`, `temperature`, `conductivity`, `battery` (vide = même appareil que le capteur d’humidité), `name`, `image`, `min_*` / `max_*` par mesure |
| `custom:nuvio-eprice-card` | Prix actuel de l’électricité avec une étiquette bon marché, moyen ou cher, barres horaires ou par quart d’heure pour aujourd’hui et demain, et le créneau le moins cher | `entity` (capteur avec des listes `today` / `tomorrow`, `raw_today`, `prices_today` ou `prices`), `title`, `window` (heures, 3), `decimals` (2), `unit` |

## Nouvelles cartes et bibliothèque de formulaires (1.2.0)

Sept nouvelles cartes dans **+ Ajouter**, chacune avec un aperçu en direct et un formulaire. Elles reprennent les cartes Home Assistant du même nom, dans le verre de Nuvio.

| Carte | Rôle | Options |
|---|---|---|
| `custom:nuvio-conditional-card` | Affiche ses cartes uniquement quand les conditions sont remplies (en mode édition, elles sont toujours affichées) | `cards`, `conditions` (`state`, `state_not`, `numeric_state` avec `above` / `below`, `screen` avec `media_query`, `user` avec `users`, `and`, `or`) |
| `custom:nuvio-glance-card` | Plusieurs entités sur une ligne : icône, nom et état ; un toucher ouvre la fenêtre d’informations | `entities`, `title`, `columns`, `show_name`, `show_state` |
| `custom:nuvio-stat-card` | Minimum, moyenne, maximum et variation d’un capteur avec une mini-courbe, sur 24 heures, 7 ou 30 jours | `entity`, `name`, `icon`, `hours`, `decimals` |
| `custom:nuvio-humidifier-card` | Humidité cible sur un arc, humidité actuelle et pastilles de mode | `entity`, `name` |
| `custom:nuvio-purifier-card` | Purificateur d’air : grande valeur PM2.5 qui défile jusqu’à la nouvelle valeur, étiquette de qualité de l’air, ondes d’air autour du nombre (plus rapides en Turbo, plus lentes en Sommeil), marche/arrêt et modes avec une surbrillance glissante | `entity` (fan), `pm` (capteur PM2.5, auto), `name`, `title`, `modes` |
| `custom:nuvio-smartlock-card` | Serrure connectée : cadenas animé dans un bouton rond (l’anse se soulève au déverrouillage), appui long pour déverrouiller avec un anneau qui se remplit, toucher pour verrouiller, arc qui tourne pendant le mouvement de la serrure, pulsation après un changement, tremblement en cas de blocage, batterie et capteur de porte du même appareil, bouton d’ouverture de la porte quand la serrure le permet | `entity`, `door`, `battery` (auto), `name`, `title`, `hold` |
| `custom:nuvio-timer-card` | Temps restant d’un `timer` sur un arc, avec démarrage, pause et annulation | `entity`, `name`, `icon` |
| `custom:nuvio-logbook-card` | Changements récents des entités choisies avec des temps relatifs | `entities`, `title`, `hours`, `max` |
| `custom:nuvio-webpage-card` | N’importe quelle adresse `https://`, `http://` ou `/local/` dans un cadre | `url`, `title`, `aspect_ratio` ou `height` |

Les formulaires des composants utilisent désormais une seule bibliothèque de formulaires (`hgForm`) : champs de texte, champs numériques, zones de texte (style code pour YAML et JSON), interrupteurs en verre, listes déroulantes en verre et une section *Avancé* repliable ; il ne reste donc plus aucune case à cocher, datalist ni triangle de dépliage du navigateur.

## Conteneurs de disposition (1.1.0)

Grille, pile verticale et pile horizontale fonctionnent comme dans Home Assistant, mais dans le verre de Nuvio. Ils forment le premier groupe de **+ Ajouter**, sous *Disposition*. Le formulaire d’un conteneur liste ses cartes : ajoutez n’importe quel composant, tuile ou carte de HA, modifiez une carte dans son propre formulaire, faites glisser pour réordonner, dupliquez, retirez, et dans une grille, réglez le nombre de colonnes qu’occupe une carte. Les conteneurs s’imbriquent jusqu’à trois niveaux. Une carte du panneau peut être déplacée dans un conteneur depuis son formulaire, et une carte d’un conteneur peut revenir sur le panneau.

**Carte de HA (YAML)** accepte le YAML (ou le JSON) que l’éditeur de cartes de Home Assistant affiche sous *Afficher l’éditeur de code*. Une `grid`, une `vertical-stack` ou une `horizontal-stack` devient le conteneur Nuvio correspondant avec les mêmes cartes ; toute autre carte est affichée telle quelle. La même conversion s’applique à ces types dans la configuration de la page Nuvio ; ajoutez `keep_ha: true` pour garder la carte Home Assistant d’origine. Un exemple se trouve dans [examples/containers.yaml](../examples/containers.yaml).

| Carte | Rôle | Options |
|---|---|---|
| `custom:nuvio-grid-card` | Cartes en colonnes ; moins de colonnes sur les écrans étroits | `cards`, `columns` (1 à 6, 0 = automatique), `min_width`, `square`, `gap`, `glass`, `title` ; par carte `span` |
| `custom:nuvio-stack-card` | Cartes les unes sous les autres ou côte à côte dans un même verre ; côte à côte devient vertical sous `wrap_below` px | `cards`, `direction`, `gap`, `ratio` (ex. `[2, 1]`), `wrap_below`, `divider`, `glass`, `title` |

Ordre (2.21.1) : les conteneurs et les cartes YAML ajoutés dans l’éditeur restent là où vous les placez. Avant, le panneau comblait les trous avec des cartes plus petites, si bien qu’une pile ou une grille large pouvait passer au dessus de cartes ajoutées avant elle. Réorganisez par glisser déposer comme d’habitude. Depuis 2.21.1, les tuiles simples sont aussi des cartes séparées (sans zones de grille), tuiles et conteneurs se mélangent dans n’importe quel ordre.

**Météo** comme composant a un interrupteur **Style hero** (YAML `variant: hero`) : grand texte blanc directement sur le fond d’écran, sans carte, comme la météo de l’en tête. Idéal avec **Fond du panneau** désactivé.

## Cartes et conteneurs génériques (0.16.0)

Douze cartes construites uniquement à partir des blocs en verre partagés : elles ressemblent au design de référence et fonctionnent avec toute entité du bon domaine. Chacune s’adapte à sa largeur : en petit (jusqu’à 220 px), elle masque le texte secondaire ; en grand (à partir de 420 px), elle affiche des détails supplémentaires. Elles fonctionnent aussi dans une vue Home Assistant classique, où elles floutent elles-mêmes le fond. Un tableau de bord prêt à l’emploi construit uniquement avec elles se trouve dans [examples/inspiration-dashboard.yaml](../examples/inspiration-dashboard.yaml) (fonctionne avec l’intégration de démonstration de HA).

<img src="../components/generic-dashboard.webp" alt="Exemple de tableau de bord construit avec les cartes génériques" width="100%">

| Carte | Ce qu’elle affiche | Options principales |
|---|---|---|
| `custom:nuvio-hero-card` | Grand message d’accueil avec le prénom de la personne connectée et un slogan, photo et état facultatifs | `title` (`{name}`), `subtitle`, `image`, `entity` |
| `custom:nuvio-toggle-card` | Un appareil sur une ligne : icône, nom et état, interrupteur, menu ⋮ | `entity`, `name`, `icon` |
| `custom:nuvio-progress-card` | Une valeur sur une barre épaisse vert citron, orange ou rouge au-delà des seuils | `entity`, `min`, `max`, `warn`, `bad`, `unit` |
| `custom:nuvio-arc-card` | Luminosité, vitesse, position, volume ou nombre sur un arc à faire glisser | `entity` (light, fan, cover, media player, number) |
| `custom:nuvio-chart-card` | Aire, ligne ou barres à partir de l’historique de n’importe quel capteur numérique, avec la dernière valeur | `entity`, `hours`, `style: area / line / bars`, `tone: solar` |
| `custom:nuvio-room-compact-card` | Température, humidité, un interrupteur et une réglette de luminosité | `name`, `temperature`, `humidity`, `entity` |
| `custom:nuvio-actions-card` | Une pastille en verre de boutons ronds pour les scènes, scripts, services ou liens | `actions: [{ entity }, { icon, name, service, data }, { navigate }]` |
| `custom:nuvio-family-card` | Avatars, qui est à la maison, un bouton pour ajouter une personne | `persons` (vide = tout le monde) |
| `custom:nuvio-cover-card` | Position d’un volet ou d’un portail sur une barre à faire glisser, ouvrir, arrêter, fermer ; sans position (portail, garage) l’état en toutes lettres ; icône selon la classe de l’appareil | `entity` |
| `custom:nuvio-lock-card` | État de la serrure ; le déverrouillage demande une confirmation, ou le code quand la serrure en exige un | `entity`, `confirm` |
| `custom:nuvio-fan-card` | Vitesse du ventilateur sur l’arc et modes préréglés en pastilles | `entity` |
| `custom:nuvio-todo-card` | Une liste de tâches : ajouter une tâche, la cocher | `entity`, `show_done` |
| `custom:nuvio-stack-card` | Plusieurs cartes dans un même verre, verticalement ou horizontalement (cartes Nuvio et cartes HA classiques) | `cards`, `direction`, `glass`, `title` |
| `custom:nuvio-tabs-card` | Pastilles (Tableau de bord / Pièces / Appareils) qui basculent entre des ensembles de cartes | `tabs: [{ label, icon, cards }]` |

Toutes se trouvent aussi dans la galerie *Ajouter un composant* de l’éditeur Nuvio.

## Pièces, électroménager et parité avec Home Glass (0.7.0)

Tous ces composants sont dans **+ Ajouter** en mode édition, avec un aperçu, un formulaire de réglages complet et un champ **Configuration avancée (JSON)** pour toute autre option de carte (libellés, couleurs, seuils, actions). Tout est stocké dans la disposition, donc l’export et l’import de la sauvegarde de la disposition les emportent.

| Composant | Carte | Réglages du formulaire |
|---|---|---|
| Pièces | `custom:nuvio-areas-card` | chemin de la vue des pièces ; noms, icônes, ordre, capteurs de température et d’humidité et pièces personnalisées viennent d’Apparence, Pièces |
| Pièce | `custom:nuvio-room-card` | la pièce à afficher (ou la pièce indiquée dans l’adresse) |
| Électroménager | `custom:nuvio-appliance-card` | n’importe quelle entité de l’appareil ; lave-linge, sèche-linge et lave-vaisselle affichent l’état, le programme, le temps restant et la progression |
| Eau chaude | `custom:nuvio-cwu-card` | chauffe-eau, état de chauffe, puissance, temps de chauffe, consommation, maintien de la température, interrupteurs |
| Escalier | `custom:nuvio-stairs-card` | lumière et détecteur de mouvement du bas et du haut, groupe de lumières, automatisation de la séquence |
| Prix des carburants | `custom:nuvio-fuel-card` | capteurs de prix avec libellés et capteur facultatif de l’évolution du lendemain |
| Climatisation (carte) | `custom:nuvio-ac-card` | entité climate, titre |
| Télécommande clim. | `custom:nuvio-acremote-card` | entité climate, titre |
| Énergie · semaine | `custom:nuvio-week-card` | capteurs de consommation et de production, jours, cible du toucher |
| Phases | `custom:nuvio-phases-card` | puissance, tension et courant par phase, puissance maximale totale et par phase |
| Photovoltaïque | `custom:nuvio-pv-card` | puissance, production du jour, état et température de l’onduleur, strings |
| Flux d’énergie | `custom:nuvio-flow-card` | puissance réseau (+ soutirage, − injection ; plusieurs capteurs sont additionnés, ex. les phases) ou capteurs d’injection séparés, puissance solaire (plusieurs sont additionnés, ex. les onduleurs), batteries chacune séparément (listes `battery` et `battery_soc` dans le même ordre, ou `batteries: [{ power, soc, name }]`, jusqu’à 4), consommation de la maison (vide = d’après le bilan), inversion du signe du réseau ou de la batterie |
| Réseau | `custom:nuvio-net-card` | section (Internet, passerelle, Wi-Fi, appareils, clients), titre |
| Capteurs de la maison | `custom:nuvio-sensors-card` | classes d’appareils, capteurs ajoutés et ignorés |
| Raccourci | `custom:nuvio-link-card` | titre, sous-titre, entité, chemin ou URL à ouvrir |
| Personne | `custom:nuvio-person-card` | personne, libellés à la maison et absent |
| Enfant (LiveKid) | `custom:nuvio-kid-card` | titre, enfant (prénom) ou entité quand il y a plusieurs enfants ; les entités de l’intégration LiveKid sont trouvées automatiquement |

**Apparence, Pièces** : renommez les pièces, choisissez leurs icônes et leur ordre, masquez des pièces, choisissez le capteur de température et d’humidité de chaque tuile de pièce (automatique, n’importe quel capteur ou aucun) et créez des pièces personnalisées avec n’importe quelles entités, indépendamment des pièces de Home Assistant. Les entités peuvent aussi être attribuées à la main aux pièces existantes. Chaque appareil de climat de la pièce a aussi une **Détection de l’activité**. **Automatique** (par défaut) utilise l’entité **État réel** (marche/arrêt, ou une valeur comme une puissance au-dessus du **Seuil de fonctionnement**, 5 W par défaut), puis ce qu’indique l’appareil lui-même (`hvac_action`), puis la température de la pièce par rapport à la consigne si vous choisissez un capteur de pièce distinct (estimation avec une hystérésis de 0,5° par défaut). Sinon, seul le mode est affiché (par exemple **Chauffage**), si bien qu’un appareil qui n’indique rien n’est jamais affiché au repos. **Depuis une entité**, **Depuis la température de la pièce** et **Afficher le mode seul** n’utilisent que cette source. La température de l’appareil lui-même n’est jamais utilisée pour cela. La pastille de la tuile Pièces a la couleur du mode (chauffage, refroidissement, déshumidification, ventilation, auto) : pleine quand l’appareil fonctionne, atténuée quand il ne fonctionne pas ou que l’état est estimé, et seulement entourée quand seul le mode est connu. Les réglages sont enregistrés à côté des capteurs de la pièce (`state:`, `src:`, `thr:`, `temp:` et `hys:` suivis de l’identifiant de l’entité climat), donc l’export et l’import les transportent et les versions plus anciennes les ignorent.

**Apparence, En-tête et navigation** : titre et sous-titre du foyer (ou pas de bandeau du foyer), prix des carburants dans l’en-tête du tableau de bord et les quatre vues de la barre sur téléphone.

**Apparence, Galerie de fonds d’écran** : ajoutez vos propres images par adresse `/local/` ou `https://` ; elles apparaissent dans Fond d’écran et dans le diaporama de la tablette murale.

**Apparence, En-tête et navigation** (0.8.0) propose aussi : l’entité météo de l’en-tête et un capteur facultatif avec un attribut `forecast` pour le bandeau horaire, la position du bandeau du foyer (à gauche ou à côté du panneau), et un tableau par vue avec l’icône, un libellé court pour la barre sur téléphone, le nombre de colonnes sur ordinateur et sur tablette (vues intégrées comprises), la présence de la vue dans la barre latérale et son ordre. **Galerie de fonds d’écran** propose un point focal pour le fond d’écran actuel.

**Paramètres** (0.9.0) : l’apparence est désormais un panneau de paramètres séparé avec des onglets : Apparence, Vues, Pièces, En-tête et navigation, Fonds d’écran, Écran de veille et Sauvegarde. Le tableau des paramètres des vues a de vrais libellés de colonnes et se transforme en cartes libellées sur téléphone.

**Plus de composants dans + Ajouter** (0.9.0) : lumière avec luminosité, thermostat, grande valeur, graphique d’historique, portes et fenêtres, batteries, aspirateur, mini-lecteur, horloge, soleil, note, image ou page, et mises à jour. Chacun a un aperçu en direct, des champs de formulaire et est inclus dans l’export et l’import.

## Graphique de prévision

**Puissance actuelle** (`custom:nuvio-power-card`) peut tracer les valeurs d’un attribut de prévision au lieu de l’historique. La grande valeur et la barre affichent toujours l’état actuel de `entities`.

| Option | Par défaut | Signification |
| --- | --- | --- |
| `source` | `history` | `forecast` trace le graphique à partir d’une prévision (l’interrupteur de l’éditeur correspond à `forecast: true`) |
| `forecast_entities` | les `entities` de la carte | entités qui portent la prévision ; les valeurs ayant la même heure sont additionnées |
| `forecast_attribute` | `detailedForecast`, sinon `detailedHourly`, sinon `forecast` | attribut contenant la liste des points de prévision |
| `forecast_value` | `pv_estimate`, `value` ou `temperature` | champ contenant la valeur de chaque point |
| `forecast_days` / `forecast_hours` | 1 jour | jusqu’où tracer dans le futur ; les heures l’emportent sur les jours |
| `forecast_type` | `hourly` | pour les entités `weather.*` : `hourly`, `daily` ou `twice_daily` |

Chaque point a besoin d’une heure dans `period_start` (Solcast) ou `datetime` (météo). Au-delà de 36 heures, l’axe affiche le nom des jours à minuit.

**Solcast PV Forecast** ([BJReplay/ha-solcast-solar](https://github.com/BJReplay/ha-solcast-solar#attributes)) : chaque capteur quotidien (aujourd’hui, demain, jour 3 à jour 7) possède `detailedForecast` (toutes les 30 minutes) et `detailedHourly` (toutes les heures), une liste de `period_start`, `pv_estimate`, `pv_estimate10` et `pv_estimate90`, en kW (puissance moyenne sur la période). Les jours 3 à 7 sont désactivés par défaut dans Home Assistant : activez-les d’abord. Les identifiants d’entité dépendent de votre langue (par exemple `..._prognoza_na_dzisiaj` en polonais) ; vérifiez-les dans les Outils de développement.

**Météo** ([weather.get_forecasts](https://www.home-assistant.io/integrations/weather/)) : la carte appelle l’action avec `return_response` toutes les 5 minutes et lit `forecast[].datetime` et `temperature` (ou `forecast_value`, par exemple `precipitation`).

```yaml
type: custom:nuvio-power-card
title: Prévision solaire, 7 jours
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
# forecast_attribute: detailedHourly   # toutes les heures au lieu de toutes les 30 minutes
# forecast_value: pv_estimate90        # variante optimiste (pv_estimate10 = pessimiste)
```

## Prévision de production

**Prévision de production** (`custom:nuvio-yield-card`) affiche l’énergie attendue pour les prochains jours sous forme de barres, un capteur par jour : le premier capteur correspond à aujourd’hui, le deuxième à demain, et ainsi de suite. Chaque jour est classé **bon**, **moyen** ou **faible**. Touchez un jour pour voir sa date, sa valeur et son niveau. Les noms des jours suivent le fuseau horaire de Home Assistant.

| Option | Par défaut | Rôle |
|---|---|---|
| `entities` | | capteurs dans l’ordre des jours, l’état est l’énergie du jour. Les valeurs en Wh, MWh ou GWh sont converties en kWh pour le classement. Un capteur indisponible est affiché comme indisponible |
| `capacity` | aucune | puissance de référence en kW, un nombre (`3.4` ou `"3,4"`) ou une entité en W ou kW (aussi Wp, kWp). Avec elle, un jour est classé selon son énergie en kWh par kW. Si l’entité est indisponible ou vaut 0, la carte l’indique sous le graphique et compare les jours au meilleur jour |
| `good` / `poor` | `3.5` / `1.5` | avec `capacity` : kWh par kW à partir desquels un jour est bon, et en dessous desquels il est faible. Sans `capacity`, un jour est comparé au meilleur jour de la période (75 % et plus : bon, moins de 40 % : faible) |
| `title`, `icon` | | en-tête |
| `unit` | unité du premier capteur ayant une valeur | libellé après les valeurs (les valeurs sont affichées dans l’unité de ce capteur) |
| `decimals` | `1` | nombre de décimales |

```yaml
type: custom:nuvio-yield-card
entities:            # un capteur par jour, le premier est aujourd’hui
  - sensor.production_forecast_today
  - sensor.production_forecast_day_2
  - sensor.production_forecast_day_3
  - sensor.production_forecast_day_4
  - sensor.production_forecast_day_5
  - sensor.production_forecast_day_6
  - sensor.production_forecast_day_7
capacity: 3.4        # kW, ou une entité comme sensor.installed_power
# good: 3.5          # kWh par kW à partir desquels un jour est bon
# poor: 1.5          # kWh par kW en dessous desquels un jour est faible
```
