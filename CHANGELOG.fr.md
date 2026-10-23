<p align="center"><a href="CHANGELOG.md">English</a> · <a href="CHANGELOG.pl.md">Polski</a> · <b>Français</b></p>

# Journal des modifications

Toutes les modifications notables de Nuvio sont listées ici, des plus récentes aux plus anciennes. Les versions suivent le [versionnage sémantique](https://semver.org). Le journal des modifications en anglais se trouve dans [CHANGELOG.md](CHANGELOG.md), celui en polonais dans [CHANGELOG.pl.md](CHANGELOG.pl.md).

### 2.22.3
- Corrigé : l’écran de veille Glass Minimal affichait encore le cercle avec l’initiale en haut à droite lorsque **Barre supérieure → Avatar** était désactivé, sur l’écran de veille et dans l’aperçu ([#52](https://github.com/kczepiec/nuvio/issues/52)).
- Corrigé : la ligne **Discord** du menu utilisateur affiche le symbole Discord à côté du libellé, comme Profil et Paramètres affichent une icône. Home Assistant ne fournit plus cette icône de marque, le menu la dessine donc lui-même.
- Corrigé : **Paramètres → Utilisateurs** affiche la photo de la personne lorsque ce compte Home Assistant est lié à une personne qui en a une. Sans photo, la lettre reste.

### 2.22.2
- Corrigé : la tuile **Volet / portail** (ouvrir, arrêter, fermer) était coupée à droite sur un téléphone lorsqu’elle était seule sur le panneau. Sur une tuile étroite les boutons s’étiraient sur toute une rangée, mais cette rangée ne passait pas à la ligne, donc ils dépassaient de la carte. Ils passent maintenant sous le nom et restent dans la tuile. La tuile média utilise la même disposition. Sur un écran plus large, les boutons restent à droite ([#53](https://github.com/kczepiec/nuvio/issues/53)).
- Ajouté : Discord dans le menu utilisateur, après Profil et Paramètres, et sur la page À propos de Nuvio. Les README anglais, polonais et français ont une section communauté et un badge Discord.

### 2.22.1
- Corrigé : sur téléphone et tablette étroite, les paramètres **Vues et navigation** étaient coupés à gauche et réduits à la moitié de la largeur, et la page défilait sur le côté. Un sélecteur large (barre du téléphone) et les cartes de vues sur deux colonnes dépassaient l’écran, et la page se plaçait dans la mauvaise rangée de la grille une fois la barre latérale masquée. Les paramètres utilisent maintenant une seule colonne pleine largeur, le tableau des vues devient des cartes empilées avec tous les champs visibles, rien ne défile sur le côté et la barre **Restaurer les valeurs par défaut** / **Terminé** reste au-dessus de la navigation du bas et de l’indicateur d’accueil. Le nouveau `tools/mobile_check.py` vérifie chaque page des paramètres sur iPhone (WebKit), Android (360 px) et tablette 768 px avant chaque version.

### 2.22.0
- Modifié : en mode édition, les changements de paramètres sont un brouillon. Les vues, le mode kiosque, l’en-tête, les pièces, l’économiseur d’écran, le PIN et Assist ne sont plus enregistrés et ne rechargent plus le tableau de bord à chaque changement ; les aperçus légers (accent, texte de l’en-tête) s’affichent tout de suite. **Terminé** enregistre tout une seule fois et recharge au plus une fois, **Annuler** abandonne le brouillon, et quitter la page avec des changements non enregistrés demande une confirmation.
- Modifié : les **Paramètres** ont une nouvelle organisation. Une barre latérale regroupe 13 pages (Général, Apparence, Tableau de bord, Tablette murale, Système) avec une recherche dans toutes les pages, la navigation au clavier et une liste à ouvrir page par page sur téléphone. Les réglages du PIN ont leur propre page **PIN et verrous**, une nouvelle page **À propos de Nuvio** apparaît et la détection d’activité du climat est repliée dans un bloc avancé. Toutes les options et tous les réglages enregistrés restent identiques.

### 2.21.6
- Corrigé : l’écran de veille garde de nouveau l’écran allumé après l’avoir éteint et rallumé, ou après un changement d’application ou d’onglet. Le navigateur libère le verrou de mise en veille quand la page est masquée ; Nuvio le redemande quand la page redevient visible et que l’écran de veille est affiché ([#38](https://github.com/kczepiec/nuvio/issues/38)).
- Corrigé : la carte **Volet / portail** affichait 0 % ou 100 % et une barre de position pour les volets sans position (portail ou porte de garage qui ne connaissent qu’ouvrir, fermer et stop). Elle affiche maintenant l’état en toutes lettres (Ouvert, Fermé, Ouverture, Fermeture) avec une légère pulsation pendant le mouvement, sans barre. L’icône suit la classe de l’appareil (portail, garage, porte, fenêtre, store, rideau, toile, auvent) au lieu d’être toujours un volet ([#36](https://github.com/kczepiec/nuvio/issues/36)).
- Corrigé : les vues déverrouillées par code PIN restaient ouvertes 5 minutes même après le démarrage de l’écran de veille ou l’utilisation de **Verrouiller l’écran**, si bien que la personne suivante devant une tablette murale pouvait les ouvrir sans code. L’écran de veille et **Verrouiller l’écran** referment maintenant toutes les vues déverrouillées, et la vue affichée redemande le code PIN au réveil. L’aperçu de l’écran de veille dans les paramètres ne reverrouille rien ([#35](https://github.com/kczepiec/nuvio/issues/35)).
- Modifié : le clavier PIN d’une vue verrouillée et les réglages du verrouillage des vues n’affichent plus la remarque indiquant que le verrou est un confort et non une sécurité ; cette limite est décrite dans la documentation.
- Corrigé : dans l’économiseur **Horloge sur photo**, l’heure du prochain événement (et de la prochaine activité LiveKid) est de nouveau en pleine luminosité au lieu d’être atténuée comme les autres lignes. Un `};` en trop dans les styles de l’économiseur faisait ignorer cette règle par le navigateur ([#34](https://github.com/kczepiec/nuvio/issues/34)).

### 2.21.5
- Corrigé : **Masquer la barre latérale** (anciennement **Masquer la barre latérale vide**) restait sans effet tant qu’une vue avait **Barre latérale** activée. L’option masque maintenant la barre latérale de Nuvio et son bouton Paramètres sur ordinateur et tablette quels que soient les interrupteurs des vues, et les vues absentes des onglets du haut passent dans le menu du profil.

### 2.21.4
- Ajouté : **{time}** et **{date}** dans le titre ou le sous-titre d’une vue affichent l’heure et la date dans la langue de l’interface, au format 12 ou 24 h du profil Home Assistant, mises à jour chaque minute. **Ajouter une horloge** dans l’éditeur d’en-tête ajoute **{time}** au sous-titre.
- Ajouté : une colonne **Pastille** dans **Paramètres > Vues** compte les lumières, interrupteurs, ventilateurs, climatiseurs ou personnes allumés ou présents (ou les médias en lecture, ou les entités choisies) et affiche le nombre sur l’onglet de la vue s’il dépasse 0.
- Ajouté : **Masquer la barre latérale vide** dans **Paramètres > Vues**. Quand aucune vue n’est dans la barre latérale, la barre et son bouton Paramètres disparaissent. Les paramètres restent dans le menu du profil, derrière le crayon et à toute adresse Nuvio avec **?nuvio_settings** (pour les personnes autorisées à modifier, pas sur une vue verrouillée par PIN).
- Corrigé : la carte **Prévision de production** colorait tous les jours de la même couleur après un changement de seuils. Les seuils au-dessus de 12 kWh par kW, ou sans puissance de référence, sont lus en kWh par jour ; des seuils inversés sont échangés ; les champs numériques de l’éditeur acceptent la virgule (3,5).
### Non publié
- Corrigé : un fond intégré choisi sur un appareil s’affichait comme une couleur unie sur les appareils qui ouvrent Home Assistant à une autre adresse (IP locale, domaine, Nabu Casa). L’image était enregistrée avec l’adresse complète du premier appareil ; les fonds intégrés sont désormais enregistrés comme un chemin à côté des fichiers Nuvio (par exemple `/hacsfiles/nuvio/nuvio-bg-nad-mgla-wide.webp`), et les fonds enregistrés avant avec une adresse sont corrigés au chargement de la disposition, sur le tableau de bord et dans l’économiseur d’écran. Les images importées et vos propres adresses ne changent pas.

### 2.21.3
- Modifié : la pastille de climat de la tuile **Pièces** a la couleur du mode (chauffage, refroidissement, déshumidification, ventilation, auto), les mêmes couleurs que dans le menu **Mode** de la télécommande clim., au lieu du gris : pleine quand l’appareil fonctionne, atténuée quand il ne fonctionne pas ou que l’état est estimé, seulement entourée quand seul le mode est connu. Le **~** devant les états estimés disparaît de la tuile Pièces et de la carte thermostat ; les lecteurs d’écran disent toujours **estimation**.

### 2.21.2
- Modifié : la fenêtre météo détaillée est compacte et tient sur un écran de téléphone sans défilement : les quatre détails sur une seule ligne, des marges et des lignes plus serrées, un arc solaire plus petit et, sur les écrans étroits, des noms de jours courts (Lun, Mar) au lieu de noms coupés.
- Modifié : Nuvio ne devine plus si un thermostat ou un climatiseur fonctionne. Chaque appareil de climat d’une pièce a une **Détection de l’activité** dans **Apparence > Pièces** : **Automatique** (par défaut), **Depuis une entité**, **Depuis la température de la pièce** ou **Afficher le mode seul**. Automatique utilise dans l’ordre : l’entité **État réel** (marche/arrêt, ou une valeur comme une puissance au-dessus du **Seuil de fonctionnement**, 5 W par défaut), ce qu’indique l’appareil lui-même (`hvac_action`), puis la température de la pièce par rapport à la consigne si vous choisissez un capteur de pièce distinct (estimation avec une hystérésis de 0,5° par défaut, marquée **~** avec une pastille atténuée). Sinon, la tuile n’affiche que le mode, par exemple **Chauffage** avec une pastille vide. En 2.21.1, la consigne était comparée à la température de l’appareil lui-même, si bien que les climatiseurs pilotés par télécommande IR affichaient **Au repos** en chauffant. Avec plusieurs appareils dans une pièce, la tuile Pièces affiche d’abord celui qui fonctionne à coup sûr, puis une estimation, puis un mode. Les réglages **État réel** existants continuent de fonctionner.

### 2.21.1
- Merci à [@cbailly42](https://github.com/cbailly42) pour la correction du climat ([#22](https://github.com/kczepiec/nuvio/pull/22)).
- Après la mise à jour, activez une fois **Écran de veille sur cet appareil** sur chaque appareil qui doit afficher l’écran de veille.
- Nouveau : **État réel** pour chaque thermostat d’une pièce, dans **Apparence > Pièces** (mode édition) : choisissez une entité qui indique si cet appareil fonctionne vraiment (une entité marche/arrêt comme le capteur de combustion d’un poêle, ou numérique comme sa puissance). Avec plusieurs appareils dans une pièce (par exemple une climatisation réversible et un poêle), la tuile Pièces les regarde tous et affiche **Chauffe**, **Refroidit** ou **Au repos** d’après celui qui fonctionne réellement ; la carte thermostat utilise le même réglage.
- Corrigé : les thermostats qui n’indiquent pas ce qu’ils font (pas d’attribut `hvac_action`, par exemple certains sèche-serviettes) sont considérés au repos dès que la pièce a atteint la consigne, sur la tuile Pièces et sur la carte thermostat.
- Corrigé : la carte thermostat affiche **· au repos** après le mode (par exemple **Chauffage à 7° · au repos**) quand l’appareil ne chauffe pas réellement.
- Corrigé : les tuiles **Pièces** affichaient **Chauffe** dès qu’un thermostat était en mode chauffage, même s’il ne chauffait pas (par exemple une consigne hors-gel de 7 °C dans une pièce à 21 °C). La tuile suit désormais ce que fait réellement l’appareil et affiche **Au repos** avec une pastille grise dans ce cas.
- Corrigé : les interrupteurs du **Verrouillage des vues par code PIN** dans Mode tablette murale ne faisaient rien. Leur action n’était pas transmise aux réglages de la tablette, rien n’était basculé ni enregistré. Ils basculent maintenant tout de suite et sont enregistrés avec la disposition ; sans code PIN, un message et un champ pour le définir apparaissent. Refs [#17](https://github.com/kczepiec/nuvio/issues/17)
- Corrigé : les tuiles simples étaient toujours regroupées dans un bloc sous les piles, grilles, cartes YAML et autres composants. Sans zones de grille, chaque tuile ajoutée est maintenant une carte du panneau, tuiles et composants se mélangent dans n’importe quel ordre par glisser déposer ; l’ordre existant des tuiles est conservé. Refs [#17](https://github.com/kczepiec/nuvio/issues/17)
- Corrigé : une vue ouverte par son numéro (par exemple `/dashboard-nuvio/0`) avait des cartes invisibles, car la page se croyait masquée et mettait en pause l’animation d’entrée.
- Corrigé : un interrupteur dans une pile ou une grille ajoutée dans l’éditeur ne changeait pas d’aspect après avoir allumé ou éteint la lumière ([#16](https://github.com/kczepiec/nuvio/issues/16)). Le panneau ne transmettait les nouvelles données de Home Assistant à un conteneur que lorsqu’une de ses propres entités changeait, et cette liste n’incluait pas les cartes du conteneur. Les conteneurs et les autres composants ajoutés reçoivent maintenant chaque mise à jour.
- Nouveau : **Écran de veille sur cet appareil** dans **Mode tablette murale** ([#16](https://github.com/kczepiec/nuvio/issues/16)). Les réglages restent partagés, mais chaque appareil décide si l’écran de veille fonctionne, enregistré dans son navigateur. Activer l’écran de veille l’active sur l’appareil utilisé ; les autres restent désactivés tant que vous ne l’y activez pas (une tablette verrouillée par code PIN avant la mise à jour le garde). Après la mise à jour, vérifiez l’interrupteur sur la tablette murale.
- Nouveau : **Fond du panneau** dans **Apparence** désactive le panneau de verre commun derrière les cartes, pour toutes les vues ou seulement la vue affichée ([#15](https://github.com/kczepiec/nuvio/issues/15)). Les styles de `panel_backdrop: false` ne sont plus expérimentaux.
- Nouveau : le composant **Météo** a un interrupteur **Style hero** (`variant: hero`), et une carte météo autonome avec `variant: hero` reçoit maintenant les styles hero ([#15](https://github.com/kczepiec/nuvio/issues/15)).
- Nouveau : **Verrouillage des vues par code PIN** (BETA) dans **Mode tablette murale** : les vues choisies demandent le code PIN avant d’afficher quoi que ce soit, avec le même pavé que l’écran de veille ([#17](https://github.com/kczepiec/nuvio/issues/17)). C’est un verrou de confort, pas une sécurité.
- Corrigé : les piles, grilles et cartes YAML ajoutées dans l’éditeur gardent l’ordre choisi au lieu de passer au dessus des cartes précédentes ([#17](https://github.com/kczepiec/nuvio/issues/17)).

### 2.20.0
- Merci à [@cbailly42](https://github.com/cbailly42) pour la nouvelle carte et le graphique en barres commun ([#14](https://github.com/kczepiec/nuvio/pull/14)).
- Nouveau : carte **Prévision de production** (`custom:nuvio-yield-card`). Choisissez un capteur par jour (le premier est aujourd’hui) et la carte affiche les prochains jours en barres avec le total, en classant chaque jour bon, moyen ou faible. Indiquez la puissance installée en kW (un nombre ou une entité) et le classement utilise l’énergie par kW, avec des seuils modifiables ; sans elle, un jour est comparé au meilleur jour de la période. Les capteurs en Wh ou MWh sont convertis, une puissance écrite `3,4` fonctionne, et les noms des jours suivent le fuseau horaire de Home Assistant. Voir [docs/fr/components.md](docs/fr/components.md#prévision-de-production).
- Corrigé : les barres de **Énergie statistiques** apparaissent maintenant en montant à l’affichage de la carte, comme celles de **Énergie · semaine**.
- Pour les contributeurs : le graphique en barres par jour et son infobulle, jusqu’ici copiés dans **Énergie · semaine**, **Énergie statistiques** et la nouvelle carte de prévision, sont désormais à un seul endroit, `src/parts/shared/day-bars.part.js` (`HG_DAYBARS_CSS`, `HG_TIP_CSS`). Voir [DESIGN.md](DESIGN.md).

### 2.19.0
- Nouveau : Nuvio parle français. Choisissez **Français** dans le sélecteur de langue, ou laissez la langue en automatique et Nuvio suit le navigateur. Merci à [@cbailly42](https://github.com/cbailly42) pour la traduction et le travail ci-dessous ([#10](https://github.com/kczepiec/nuvio/pull/10)).
- Modifié : tous les textes de l’interface sont désormais dans des catalogues de langue à clés (`src/locales/en.json`, `pl.json`, `fr.json`). Seule la langue utilisée est téléchargée, à côté du fichier principal, donc ajouter une langue n’alourdit plus le tableau de bord pour tout le monde. La langue automatique ne reste plus bloquée sur une langue que l’assistant de configuration a affichée sans que vous l’ayez choisie.
- Pour les contributeurs : `tools/i18n_check.py` vérifie les clés, les formes du pluriel et la couverture de chaque catalogue, `tools/i18n_compile.py` construit les fichiers de langue, et `npm test` lance les nouveaux tests JavaScript et Python. Voir [docs/fr/development.md](docs/fr/development.md).

### 2.18.0
- Corrigé : un interrupteur de la liste **Entités** (et d’autres cartes) pouvait rester allumé après que l’appareil avait été éteint ailleurs, par exemple depuis la fenêtre d’informations de Home Assistant, jusqu’au rechargement de la page. Lorsqu’une carte d’une vue échouait pendant sa mise à jour, l’erreur empêchait les données de Home Assistant d’atteindre toutes les cartes suivantes de cette vue, qui cessaient alors de suivre les changements d’état. Chaque carte reçoit désormais sa mise à jour séparément, une carte en échec affiche un court message d’erreur au lieu de bloquer les autres, et les mises à jour ne peuvent plus rester bloquées après une animation de panneau interrompue, la fermeture du mode édition, un relâchement tactile perdu ou une image du navigateur mise en pause.
- Nouveau : **Puissance actuelle** peut tracer une prévision au lieu de l’historique. Activez **Graphique à partir d’une prévision (attribut) au lieu de l’historique** (YAML `source: forecast`) et choisissez les entités de prévision, le nombre de **Jours à venir** (ou d’**Heures à venir**), l’attribut (par défaut `detailedForecast`, aussi `detailedHourly`) et le champ de valeur (par défaut `pv_estimate`, par exemple `pv_estimate90`). Cela fonctionne directement avec l’intégration Solcast PV Forecast : ajoutez les capteurs quotidiens pour aujourd’hui, demain et les jours 3 à 7, et vous obtenez un graphique sur 7 jours avec le nom des jours en dessous. Les entités météo sont lues avec `weather.get_forecasts` (`forecast_type: hourly` ou `daily`, valeur `temperature` par défaut). Voir [docs/fr/components.md](docs/fr/components.md#graphique-de-prévision).

### 2.17.0
- Corrigé : les tuiles de pièce dans **Pièces** (et les tuiles de pièce ailleurs sur le tableau de bord) n’affichaient pas toujours une lumière allumée ou éteinte tant que vous n’ouvriez pas une autre vue avant de revenir. Dans la vue de la pièce, l’état était correct. Une carte que le navigateur considérait à tort comme masquée (cela arrive dans Safari et dans l’application Home Assistant après qu’une vue a été masquée puis affichée à nouveau) se redessine désormais dès qu’elle est à l’écran, les cartes d’une vue où vous revenez rattrapent aussitôt les changements, et la liste des entités suivies est recalculée lorsque le registre de Home Assistant change.
- Corrigé : la carte **Puissance actuelle** (valeur, barre et graphique) traitait chaque capteur comme une puissance. Un capteur d’énergie ou de prévision, par exemple une prévision Solcast pour demain (20,2 kWh), s’affichait comme 20 W, 0 % Faible. La carte affiche désormais la valeur et l’unité exactement comme le capteur les fournit, met la barre à l’échelle de la valeur la plus élevée du graphique ou de votre propre **Fin de l’échelle de la barre**, et n’affiche le niveau Faible, Moyen, Élevé que pour une puissance ou lorsque vous l’activez. Les capteurs sans statistiques à long terme (par exemple les prévisions) tracent leur graphique à partir de l’historique des états.
- Nouveau : la légende sous le graphique peut être modifiée pour chaque carte. **Puissance actuelle** a un champ **Légende du graphique** (par exemple Prévision au lieu de -6 h) et un interrupteur qui masque les libellés sous le graphique. Une tuile en mode **Avec graphique** a un champ **Légende du graphique** à la place du texte fixe Dernières 24 h, et un interrupteur qui la masque.

### 2.16.0
- Nouveau : quatre écrans de veille supplémentaires dans **Paramètres > Écran de veille**, chacun avec une tuile d’aperçu en direct dans la galerie. **Horloge analogique** est un cadran en verre dépoli sur votre photo, avec une trotteuse dans la couleur d’accent, la date et la météo. **Horloge à palettes** affiche les heures et les minutes sur deux cartes sombres qui basculent chaque minute. **Aurore boréale** est une grande horloge fine sur une lumière qui ondule lentement dans la couleur d’accent, le violet et le turquoise, avec la date et la météo. **Nuit** est une horloge chaude et tamisée sur fond noir pur, pour les chambres et les écrans OLED ; elle se déplace davantage chaque minute pour protéger l’écran. Tous fonctionnent avec l’assombrissement, le détecteur de mouvement, le verrouillage par code PIN et les notifications à l’écran ; les animations en boucle s’arrêtent avec l’économie d’énergie et les animations réduites.
- Nouveau : **Style du tableau de bord** en haut de **Paramètres > Apparence** : huit apparences toutes prêtes, chacune avec une miniature du tableau de bord (Nuvio, Givre, Minuit, Crépuscule, Forêt, Océan, Pastel et Graphite). Un style définit l’accent, le fond d’écran, l’assombrissement et le verre (teinte des cartes, des tuiles et du panneau, intensité du flou ; Pastel a des coins plus arrondis et Graphite des coins plus nets). Vous pouvez toujours modifier l’accent et le fond d’écran plus bas. Avec **Flou du verre** sur Désactivé, le remplissage dense pour la lisibilité reste comme avant. **Réinitialiser** revient à Nuvio.

### 2.15.1
- Amélioré : la température et l’humidité dans l’en-tête de la pièce affichent un petit crayon lorsque vous pouvez changer leur capteur. Le survol n’ajoute plus de cadre derrière la valeur ; le crayon s’allume dans la couleur d’accent à la place.
- Corrigé : les piles et les grilles ne pouvaient pas être modifiées lorsqu’elles provenaient de la configuration du tableau de bord (par exemple une `vertical-stack`, une `horizontal-stack` ou une `grid` de HA). En mode édition, toucher une pile ou une grille ouvre désormais ses paramètres avec la liste de ses cartes, où vous pouvez ajouter, retirer, réordonner et dupliquer des cartes et modifier les options de la pile (par exemple **Chaque carte dans son propre cadre en verre**). Toucher une carte dans une pile ou une grille ouvre directement les paramètres de cette carte, comme dans HA ; **Retour** revient au conteneur, et **Enregistrer** sur le conteneur conserve les modifications.
- Corrigé : l’**Aperçu en direct** dans les paramètres d’une section de pièce restait vide lorsque la section affichait une carte comme la climatisation. L’aperçu affiche désormais cette carte.
- Supprimé : le choix du **Mode d’affichage** (Par défaut, Compact, Minimal) pour les pièces, les sections de pièce et les cartes n’ayant qu’un seul style. Il ne faisait presque aucune différence visible. Les tuiles et les cartes qui peuvent passer en style tuile ou liste conservent leur choix de style.
- Amélioré : le composant **Alarme** a une nouvelle apparence premium. Le bouclier d’état brille dans la couleur de l’état, le pavé numérique a des touches rondes avec des points qui s’allument pendant la saisie, et les boutons de mode affichent l’icône et le libellé côte à côte. Le pavé n’apparaît que lorsqu’un code PIN est configuré sur l’alarme (Home Assistant indique un format de code). Saisissez le code, puis touchez À la maison, Absent, Nuit ou Désarmer ; si vous touchez une action qui nécessite le code avant de l’avoir saisi, la carte demande d’abord le code. Les alarmes avec un code texte ont un champ de mot de passe à la place.

### 2.15.0
- Corrigé : la température dans l’en-tête de la pièce pouvait se couper sur deux lignes (« 23, » et « 2° ») et passer sous le rail latéral sur les écrans étroits. La température et l’humidité restent désormais toujours sur une ligne, et le rail latéral passe sous un en-tête qui s’agrandit.
- Nouveau : choisissez le capteur de température et d’humidité d’une pièce directement depuis son en-tête. En tant qu’administrateur, touchez la température ou l’humidité dans la vue de la pièce (ou le **+** à côté lorsque rien n’est affiché) et choisissez Automatique, n’importe quel capteur (ceux de la pièce en premier, avec leurs valeurs actuelles) ou Ne pas afficher. Le choix est enregistré avec la disposition et correspond au même réglage que dans **Paramètres > Pièces**, que le menu ouvre aussi.
- Nouveaux composants dans **+ Ajouter** : **Qualité de l’air** (`custom:nuvio-airq-card`) affiche le CO₂, les PM2.5, les PM10, les COV, le NO₂, l’IQA et l’humidité sous forme de tuiles avec des niveaux colorés et une note globale ; laissez les capteurs vides et il les trouve, en privilégiant une pièce. **Plante** (`custom:nuvio-plant-card`) affiche l’humidité du sol, la luminosité, la température et la fertilité avec la plage idéale sous forme de bande et la valeur sous forme de repère, indique ce dont la plante a besoin (arrosez-moi, trop sombre…) et trouve les autres capteurs et la batterie du même appareil (par exemple Mi Flora) ; il lit aussi une entité `plant.*`. **Prix de l’électricité** (`custom:nuvio-eprice-card`) affiche le prix actuel avec un libellé bon marché, moyen ou cher, des barres horaires ou par 15 minutes pour aujourd’hui et demain, et le créneau le moins cher de 1 à 24 heures ; il lit les grilles tarifaires de Nord Pool, ENTSO-e, Energi Data Service et de capteurs similaires.
- Amélioré : les cartes s’adaptent mieux aux petites tuiles (S). La grille des pièces passe à une colonne, les tuiles de volet et de média placent leurs boutons sous le nom, et les tuiles lave-linge, chauffe-eau, statistiques d’énergie, aspirateur robot, lecteur multimédia, liste d’entités, compteur, mises à jour, prix des carburants, phases et valeur n’écrasent ni ne coupent plus leurs noms. La carte des statistiques d’énergie ne plante plus lorsqu’elle reçoit un seul capteur.
- Corrigé : les aperçus de la galerie **Ajouter un composant** chevauchaient le libellé Aperçu et certains étaient coupés ; les aperçus hauts sont désormais réduits pour tenir. La serrure connectée et le purificateur d’air ont leurs propres aperçus.
- Documentation : chaque composant de [Composants](docs/fr/components.md) a désormais une capture d’écran de même taille, regroupée par catégorie, et le README en montre quelques-unes. Le logo du README est désormais visible en mode sombre et dans HACS.

### 2.14.1
- Corrigé : une tuile ou une carte déplacée en mode édition revenait à son ancienne place. La grille du panneau plaçait les cartes étroites dans les espaces libres avant les larges, si bien que le nouvel ordre était enregistré mais pas affiché. Une fois une vue réorganisée, ses cartes et tuiles restent désormais exactement dans votre ordre (un espace peut rester à côté d’une carte large ; redimensionnez une carte pour le combler). Sur les vues avec la disposition Maçonnerie ou Colonnes, les cartes bougent aussi pendant le glisser, et pas seulement après l’enregistrement.
- Corrigé : les boutons de taille S, M et L n’avaient aucun effet visible sur les cartes intégrées du panneau d’accueil avant l’enregistrement, S ne pouvait pas rendre une carte plus étroite que sa largeur par défaut, et une carte avec une **Largeur** définie dans ses paramètres les ignorait. La taille change désormais immédiatement, S signifie vraiment une colonne, et le choix d’une taille remplace le réglage Largeur. Sur les écrans tactiles, les boutons de taille et de déplacement sont plus grands.
- Corrigé : le sélecteur du composant **Calendrier** n’affichait aucun calendrier, si bien qu’un calendrier non choisi automatiquement (par exemple un second calendrier Google) ne pouvait pas être ajouté. Le composant et la vue Calendrier utilisent désormais tous vos calendriers, et non les quatre ou six premiers.

### 2.14.0
- Corrigé : après une mise à jour, le tableau de bord pouvait continuer à exécuter la version précédente. Une version qui ne changeait que le numéro de version gardait le même nom de fichier de bundle, si bien que le navigateur et l’application Home Assistant servaient l’ancien fichier en cache. La version fait désormais partie du hash du nom de fichier. La 2.13.0 a été publiée sans les améliorations de performances ci-dessous.
- Nouveau : **Paramètres > Apparence > Performances**, enregistré par appareil. **Flou du verre** peut être Auto, Complet, Léger ou Désactivé ; avec Désactivé, aucune surface n’utilise `backdrop-filter`, et le verre reçoit un remplissage plus dense pour que le texte reste lisible (les boîtes de dialogue et les fenêtres deviennent opaques). **Économie d’énergie** (Auto, Activé, Désactivé) arrête les animations en boucle (zoom de la photo de l’écran de veille, ventilateurs qui tournent, anneaux qui pulsent, tambour du lave-linge, etc.) et actualise les instantanés des caméras au plus toutes les 30 s. Sur Auto, elle s’active sur les iPad et iPhone sous iOS ou iPadOS antérieur à 18 et sur le matériel très faible, et le flou est alors désactivé lui aussi. L’ancien forçage `home-glass:lite` fonctionne toujours.
- Corrigé : la consommation de batterie sur les tablettes anciennes. Les animations des cartes sorties de l’écran par défilement se mettent en pause jusqu’au retour de la carte, le minuteur de progression du média saute des secondes tant que la page ou la carte est masquée, et la vérification du thème, exécutée pour chaque carte à chaque changement d’état de Home Assistant, ne lit plus le stockage à chaque fois.
- Documentation : README repensé ; journal des modifications, documentation de configuration et de développement déplacés dans des fichiers séparés.

### 2.12.0
- Nouveau : les paramètres d’une section de pièce permettent désormais d’ajouter et de retirer des entités. En mode édition, ouvrez une section dans une pièce (par exemple **Lumières**) : la liste **Entités** se termine par une ligne **Ajouter une entité** dont le sélecteur n’affiche que les entités adaptées à la section (lumières et interrupteurs pour Lumières, thermostats pour Climat, caméras pour Caméras, etc.). L’entité est affectée à la pièce et apparaît immédiatement dans cette section.
- Nouveau : chaque entité d’une section de pièce a un bouton de suppression. Une entité que vous avez ajoutée vous-même est retirée de la pièce (**Retirer de la pièce**). Une entité qui provient de la pièce Home Assistant est seulement masquée dans cette pièce (**Masquer dans cette pièce**), sans toucher à la pièce dans Home Assistant ; l’ajouter à nouveau la réaffiche. Les réglages sont enregistrés dans la disposition avec les autres affectations des pièces.
- Inclut la carte enfant LiveKid et le panneau de l’écran de veille des versions de test 2.11.1 à 2.11.3.

### 2.11.3
- Nouveau : panneau enfant (LiveKid) repensé sur l’écran de veille. Tableau : une carte au-dessus du lecteur multimédia avec de grandes heures d’arrivée et de départ, l’activité suivante avec un compte à rebours et les deux suivantes. Verre : un bloc à côté de la météo, dans le même style que la température. Photo : statut et nom plus lisibles.
- Nouveau : statut neutre de l’enfant, **Sur place** et **Absent**, sur tous les styles d’écran de veille, sur la carte Enfant et dans son aperçu de la galerie.
- Nouveau : le panneau de l’écran de veille indique quand l’enfant est sur place, n’est pas encore arrivé ou a terminé sa journée.

### 2.11.2
- Nouveau : la carte Enfant (LiveKid) est désormais une carte normale, listée dans la galerie de cartes de Nuvio et dans le sélecteur de cartes de HA avec un aperçu. Elle affiche la présence à la crèche ou à l’école maternelle, l’arrivée et le départ, les repas, les actualités non lues et la facture.
- Nouveau : panneau enfant sur l’écran de veille. En semaine, il affiche le programme d’activités du jour ainsi que les heures d’arrivée et de départ, sur tous les styles d’écran de veille.
- Nouveau : **Paramètres > Mode tablette murale** comporte un interrupteur LiveKid. Il indique si les entités de l’intégration ont été détectées ; si c’est le cas, il est activé par défaut, sinon il est désactivé avec la mention **Non détecté**.

### 2.11.1
- Nouveau : carte Enfant pour l’intégration LiveKid (YAML uniquement dans cette version). Les entités de l’enfant sont trouvées automatiquement via l’intégration, jamais par identifiant d’entité ; avec plusieurs enfants, choisissez-en un avec `child` (nom) ou `entity`.
- Nouveau : un panneau enfant compact sur l’écran de veille photo (test uniquement, derrière un drapeau dans cette version).

### 2.11.0
- Nouveau : les prix des carburants dans l’en-tête peuvent être désactivés sans être supprimés. **Paramètres > En-tête et navigation** comporte un interrupteur pour toute la section carburants et un sur chaque ligne de carburant. Un carburant masqué garde sa ligne avec des champs grisés et, lorsque la section est désactivée, la liste se réduit à une courte note. L’en-tête se met à jour immédiatement, et le réglage est enregistré dans la disposition et inclus dans l’export et l’import.
- Nouveau : un sélecteur de couleur en verre remplace le sélecteur de couleur du navigateur dans chaque champ de couleur (couleurs du dégradé et de la sphère de l’écran de veille, accent, couleurs du fond d’écran et paramètres des cartes). Il comporte une zone de saturation et de luminosité, un curseur de teinte, un champ HEX et des couleurs rapides, dont le vert citron Nuvio.
- Corrigé : la galerie des écrans de veille et l’aperçu en direct dans les Paramètres affichent désormais de vrais rendus avec votre fond d’écran et vos données. Auparavant, ils restaient noirs ou vides lorsque vous ouvriez l’onglet Écran de veille après un autre onglet, et l’aperçu en direct n’avait pas de largeur sur les téléphones.
- Corrigé : le choix du détecteur de mouvement de l’écran de veille ne fige plus la page avec des milliers d’entités. La liste s’ouvre immédiatement, affiche les capteurs de mouvement, d’occupation et de présence, et se filtre pendant la saisie. La fenêtre Paramètres s’ouvre aussi beaucoup plus vite, car les longues listes de capteurs ne sont remplies qu’à leur ouverture.
- Corrigé : Annuler en mode édition n’annule plus les modifications déjà enregistrées dans les Paramètres.

### 2.10.1
- Corrigé : dans **Paramètres > En-tête et navigation**, le titre et le sous-titre du bandeau du foyer (les avatars des personnes) sont de nouveau enregistrés. Auparavant, les modifications étaient perdues lorsque vous fermiez la fenêtre avec **Terminé** ; désormais Terminé les enregistre, le bandeau se met à jour immédiatement sans recharger la page et la section affiche un aperçu en direct. Une nouvelle ligne renvoie vers l’éditeur d’en-tête de la vue actuelle.
- Corrigé : le graphique **Énergie · semaine** est beaucoup plus haut et plus lisible. Sa hauteur augmente avec la taille de la carte (S, M, L), les barres sont plus larges, la production a sa propre couleur ambre et les petites valeurs restent visibles, et les libellés des jours et des valeurs sont plus grands.

### 2.10.0
- Nouveau : l’en-tête de chaque vue peut être modifié en mode édition. Touchez le crayon vert citron à côté du titre pour définir le titre, le sous-titre et une icône facultative, afficher ou masquer tout l’en-tête ou seulement le sous-titre, et ajouter des versions plus courtes pour le téléphone et la tablette. Cela fonctionne dans toutes les vues, y compris Pièces et la vue d’une pièce : là, `{room}` insère le nom de la pièce, un sous-titre vide conserve la température en direct et l’état de la pièce, et l’icône est par défaut celle de la pièce. Un en-tête masqué reste visible pendant l’édition, estompé et marqué « En-tête masqué ». Les en-têtes sont enregistrés dans la disposition et inclus dans l’export et l’import.
- Corrigé : les derniers textes non traduits suivent désormais la langue choisie (le tableau de bord de disposition partagée, le titre par défaut de la carte Média et le message d’erreur des cartes). Une nouvelle vérification fait échouer le build lorsqu’un texte n’a pas de version polonaise ou anglaise.

### 2.9.0
- Nouveau : sélecteur de langue dans **Paramètres → Apparence → Langue** (Automatique / Polski / English) et dans le menu utilisateur pour tout le monde. Le changement est instantané, sans recharger la page, et le choix est enregistré par personne (cet appareil et le compte HA). La langue par défaut est désormais celle du navigateur (polonais ou anglais, sinon anglais) au lieu de la langue du profil HA.

### 2.8.4
- Corrigé : la carte des robots affiche désormais chaque capteur d’entretien avec sa propre unité. Auparavant, chaque valeur était affichée en pourcentage, si bien qu’une brosse principale avec 255 h restantes indiquait 255 %. Les capteurs en `%` gardent la barre d’usure ; les capteurs en heures, en jours ou dans d’autres unités affichent la valeur et l’unité sans barre. Les valeurs du dernier nettoyage (durée, surface, total) prennent aussi leur unité de l’entité.

### 2.8.3
- Corrigé : l’option de stratégie `language:` l’emporte désormais toujours. Auparavant, elle était ignorée dès que l’assistant (ou l’enregistrement des vues ou des pièces) avait mémorisé une langue, si bien que le tableau de bord pouvait rester en polonais même avec `language: en`.

### 2.8.2
- Corrigé : lorsque le pavé numérique est ouvert sur l’écran de veille Glass Minimal, l’écran n’est plus assombri. Le fond d’écran, le contenu et la sphère de l’assistant sont floutés à la place, et le pavé reste facile à lire.

### 2.8.1
- Corrigé : le pavé numérique de l’écran de veille Glass Minimal s’ouvre désormais sur son propre calque au-dessus d’un écran de veille flouté, comme sur Horloge sur photo, au lieu de s’afficher par-dessus l’horloge et les cartes. Toucher la sphère lorsque l’écran est verrouillé demande d’abord le code PIN, puis ouvre Assist.

### 2.8.0
- Nouveau : style d’écran de veille **Glass Minimal** (Paramètres > Écran de veille) : une grande horloge avec la date, la météo avec une icône 3D, la lecture en cours avec la pochette de l’album, une sphère d’arrière-plan, la sphère de l’assistant et la rangée de la famille. Tous les écrans de veille se choisissent dans une galerie d’aperçus en direct, chacun montrant l’écran entier en réduction. Toucher la sphère ouvre Assist directement depuis l’écran de veille (désactivable).
- Configurable : couleurs du dégradé, sphère (activée ou non, couleurs, intensité), sphère d’arrière-plan, image personnelle depuis la galerie ou par envoi, assombrissement la nuit, format de date, avatar, format, taille et position de l’horloge, date, météo et lecture en cours activées ou non, famille (qui, en gris en cas d’absence), texte d’indication et animations réduites. Les réglages sont enregistrés par utilisateur Home Assistant et inclus dans l’export et l’import. Les anciens choix Carousel et Bento s’ouvrent en Minimal.
- Toutes les cartes partagent désormais un même fond en verre ; la teinte chaude séparée des cartes solaire, énergie, puissance et phases a disparu.
- Les images 3D sont livrées dans dist sous le nom `nuvio-3d-*.webp` (Fluent Emoji 3D de Microsoft, licence MIT).

### 2.7.0
- Nouveau : carte serrure connectée (`custom:nuvio-smartlock-card`, **+ Ajouter → Serrure connectée**). Un cadenas animé dans un bouton rond : maintenez-le pour déverrouiller pendant qu’un anneau se remplit, touchez pour verrouiller. Un arc qui tourne montre le mouvement de la serrure, une pulsation confirme le nouvel état et le cadenas tremble lorsque la serrure est bloquée. La batterie et le capteur de porte sont trouvés sur le même appareil, et un bouton Ouvrir la porte apparaît lorsque la serrure le permet. Les serrures avec code le demandent d’abord.

### 2.6.1
- Carte purificateur d’air : le capteur PM2.5 est pris sur le même appareil que le purificateur (y compris les capteurs nommés pm2_5 sans classe d’appareil et l’ancien attribut aqi de xiaomi_miio), si bien que la carte n’affiche plus un autre capteur de la maison. La valeur suit aussi un capteur qui apparaît après le démarrage de Home Assistant.

### 2.6.0
- Nouveau : carte purificateur d’air (`custom:nuvio-purifier-card`, **+ Ajouter → Purificateur d’air**). Grande valeur PM2.5 qui compte pas à pas jusqu’à la nouvelle valeur, libellé et couleur selon la qualité de l’air (pur, bon, moyen, mauvais, très mauvais), ondes d’air qui se propagent depuis le nombre à une vitesse qui suit le mode, interrupteur et modes préréglés avec une surbrillance glissante. Le capteur PM2.5 est trouvé automatiquement ou choisi dans le formulaire.

### 2.5.1
- La carte de lecture en cours du tableau s’accorde aux widgets : fond clair flouté sans bordure, texte et icônes blancs. Un titre trop long pour la carte défile (marquee).

### 2.5.0
- Les widgets du tableau ressemblent à ceux de l’écran verrouillé de l’iPhone : fond clair flouté sans bordure, texte blanc et icônes blanches (la météo utilise des symboles blancs, les jauges des pièces sont blanches).
- Paramètres de la tablette murale : les widgets sous l’horloge forment une seule liste avec monter, descendre et retirer ; les widgets masqués reviennent avec « Ajouter un widget ». La météo, les calendriers, les pièces, le détecteur de mouvement et les services de notification sont des listes avec un bouton « Ajouter » qui ouvre une liste déroulante avec recherche.
- Champ d’icône : cliquer n’importe où sur le champ ouvre la liste des icônes, et la saisie la filtre.
- La pile verticale ne se replie plus sur iPhone (Safari).
- « Capteur avec graphique » dans une pile affiche de nouveau le graphique, et les noms des tuiles ne se coupent plus au milieu d’un mot.

### 2.4.0
- **Tableau repensé comme l’écran verrouillé de l’iPhone** : la date et une grande horloge fine centrées en haut, en dessous une rangée de petits widgets en verre sur la photo (météo avec maximum/minimum et risque de pluie, prochain lever ou coucher du soleil, compte à rebours, l’événement en cours et le suivant avec « dans 18 min », et les températures des pièces sous forme de jauges rondes avec l’humidité), et en bas la pile de notifications et un lecteur compact En cours de lecture. Tout est compact, si bien que rien n’est coupé sur les écrans peu hauts ; sur un téléphone, les widgets s’affichent deux par rangée. Le titre affiche par défaut l’heure ; la carte photo a disparu, car la photo sert de fond (la source de la photo est désormais aussi disponible pour le tableau).

### 2.3.0
- **Notifications sur l’écran de veille** : les messages envoyés avec notify à cet appareil (un ancien service `notify.mobile_app_…` ou `notify.send_message` avec une entité `notify.*`) apparaissent sur l’écran de veille sous forme de pile à la manière de l’iPhone : la carte la plus récente en haut et les suivantes qui dépassent en dessous, un toucher déplie la pile en liste (Afficher moins / effacer), et un toucher sur une carte affiche son texte complet. Toucher les notifications ne réveille pas l’écran ; un réveil normal les marque comme lues. Choisissez les services sous Mode tablette murale → Notifications sur cet appareil (enregistré par appareil). Nécessite un compte administrateur, car la fonction écoute les événements `call_service`.

### 2.2.0
- **Tableau repensé en widgets** : grande date en gras sur la photo du tableau de bord, lever et coucher du soleil en simples lignes avec icône, et une rangée de widgets en verre identiques en bas (météo, à venir, lecture en cours, pièces), dans le style StandBy. Fini les cadres dans les cadres : les événements ont une fine barre de couleur, les pièces forment une liste épurée avec une icône colorée et une grande température en police fine, les titres des widgets sont de petits libellés en majuscules. La météo a rejoint la rangée de widgets avec des prévisions compactes. Sur un téléphone, les widgets s’empilent sous l’en-tête.

### 2.1.1
- **Finitions du tableau** : les cartes ne s’étirent plus avec de l’espace vide ; les widgets s’ancrent en bas et la photo reste visible au milieu. La météo est une carte compacte en haut à droite. En cours de lecture est un widget compact avec une miniature de la pochette. Le verre clair est d’un blanc plus net et le verre sombre est fumé au lieu d’un voile gris. La carte photo ne s’affiche que s’il y a plus d’une photo (sinon elle répétait le fond). Les pièces sur un téléphone sont des tuiles avec le nom complet. Ombre plus marquée sous l’en-tête pour le contraste sur les photos claires.

### 2.1.0
- **Écran de veille Tableau en verre premium** : le tableau repose désormais sur la photo du tableau de bord (même diaporama, effet Ken Burns et assombrissement que l’écran de veille photo), avec des cartes en verre dépoli, des bords clairs et des ombres douces comme dans le reste de Nuvio ; en-tête de date blanc sur la photo, pastilles en verre, badge d’accent pour le prochain événement. Le thème « Auto » suit désormais le tableau de bord.
- **Disposition téléphone** : sur un téléphone en portrait, le tableau tient sur une seule colonne (carte photo masquée, puisque la photo sert de fond), les pièces s’affichent en grille de deux colonnes avec l’humidité sous le nom, et les lignes de liste qui ne tiennent pas sont masquées entièrement au lieu d’être coupées en deux. Les cartes qui n’ont plus de place sont ignorées, si bien que rien n’est jamais rogné.

### 2.0.0
- **Écran de veille « Tableau » (nouveau)** : un second style d’écran de veille à côté de l’horloge sur photo. Il affiche un grand jour de la semaine ou une grande horloge avec la date, le lever et le coucher du soleil, un compte à rebours jusqu’au prochain événement sur toute la journée (par exemple « Halloween dans 17 jours »), la météo avec des prévisions horaires (quotidiennes si le service n’a pas de données horaires), les événements à venir des deux prochaines semaines, la lecture en cours, une photo (fond du tableau de bord, diaporama ou votre propre adresse) et une liste des températures des pièces avec l’humidité. Tout se configure dans Paramètres → Écran de veille : thème du tableau (auto selon le soleil, clair, sombre), titre (jour de la semaine ou heure), éléments affichés, ordre des cartes, entité météo, calendriers et pièces utilisés. Fonctionne en paysage et en portrait, avec le verrouillage par code PIN et le réveil par mouvement.
- **Pile verticale (correctif)** : les cartes d’une pile verticale prennent leur hauteur naturelle ; auparavant, une carte pouvait être écrasée en une bande étroite.

### 1.9.1
- **Télécommande clim.** : changer de mode (par exemple du froid à la chauffe) fait passer en douceur la carte, le flux d’air, le curseur et les tuiles à la nouvelle couleur, et l’unité brille brièvement dans la nouvelle couleur.

### 1.9.0
- **Lecteur multimédia (nouvelle apparence)** : les lecteurs dans Multimédia et dans les pièces utilisent une grande disposition En cours de lecture : la pochette en fond (sa couleur teinte la carte), une ligne source et état, un grand titre et l’artiste, la progression avec les durées, aléatoire / précédent / grande lecture / suivant / répétition, et une rangée de volume avec − et + ainsi que les pastilles Pièces (regrouper des enceintes), Source et Son lorsque le lecteur les prend en charge. Sur les cartes étroites, aléatoire et répétition sont masqués et les pastilles n’affichent que des icônes.
- **Télécommande clim.** : sur les écrans de 700 px de large et plus, les tuiles Mode, Ventilation, Sommeil et Soufflage ouvrent un menu déroulant à côté de la tuile (les touches fléchées fonctionnent, un second toucher le ferme) ; les téléphones gardent le panneau du bas.

### 1.8.1
- **Modification des pièces (correctif)** : les pièces disposent les cartes dans la même grille que les autres vues, si bien que le mode édition et la disposition enregistrée sont identiques, dans la vue large comme dans le panneau latéral. Auparavant, la vue large d’une pièce utilisait une disposition en colonnes distincte et les cartes sautaient après l’enregistrement.
- **Galerie des pièces (correctif)** : + Ajouter dans une pièce affiche tous les composants, conteneurs compris, et les paramètres du composant proposent la taille.

### 1.8.0
- **Télécommande clim. (nouveau composant)** : une carte distincte dans + Ajouter, au style d’une application de télécommande de climatiseur. L’unité affiche un flux d’air animé (bleu en refroidissement, orange en chauffe, plus rapide à vitesse de ventilation élevée, en balayage lorsque les volets oscillent), une grande consigne, un curseur du froid au chaud avec − et +, l’alimentation et Éco. Les tuiles Mode, Ventilation, Sommeil et Soufflage ouvrent un panneau en bas avec les options ; la carte n’affiche que ce que l’unité prend en charge. Fonctionne dans les tailles S, M et L et dans les thèmes clair et sombre.

### 1.7.3
- **Galerie Ajouter un composant (correctif)** : les miniatures utilisent toujours les aperçus d’exemple ; les cartes en direct réduites étaient à l’étroit, vides (climatisation) ou affichaient un appareil au hasard (robots, graphique de capteur, scène). Les aperçus photovoltaïque, pièces, puissance, électroménager, escaliers, mises à jour, météo et mini-lecteur ont été retravaillés pour que rien ne soit coupé.

### 1.7.2
- **Cartes côte à côte (correctif)** : les composants ajoutés en mode édition sont désormais des cartes distinctes dans la grille de la vue ; ils peuvent donc être glissés entre les cartes par défaut et à côté d’elles (et aussi redimensionnés et retirés sur place). Les tuiles d’entité simples restent ensemble dans leur bloc.
- **Carte météo (correctif)** : en taille S, l’icône et la température se placent sur la rangée du haut avec la description en dessous, le lever et le coucher du soleil ne se chevauchent plus, la ligne de température s’aligne sur les heures, quelques heures s’étalent sur toute la largeur, la bande s’estompe sur les bords, et le point du soleil reste rond en L.
- **Foyer et Énergie · semaine en S (correctif)** : le compteur se place au-dessus des avatars et les zones passent sous les noms ; les deux totaux sont côte à côte et seule la barre du jour affiche sa valeur.
- **Galerie Ajouter un composant (correctif)** : aperçus pour lumière, thermostat, valeur, historique, ouvertures, batteries, aspirateur robot, mini-lecteur, horloge, soleil, note, image et mises à jour, ainsi qu’un aperçu météo rafraîchi.

### 1.7.1
- **Pages plus rapides (correctif)** : le bouton d’indication de défilement sur les écrans larges ne flotte plus indéfiniment (son flou de verre était recalculé à chaque image) ; seule son icône oscille trois fois. Sans la carte de flux d’énergie, une page au repos tourne désormais à 60 i/s au lieu d’environ 25 sur un processeur 6 fois plus lent.
- **Carte de flux d’énergie allégée (correctif)** : pas de flou dans la carte, pas de halo sur les points en mouvement, pas de soleil qui tourne, les animations s’arrêtent tant que la carte est hors de l’écran, et le diagramme n’est réajusté que lorsque sa disposition change.

### 1.7.0
- Ajouté : la carte **Flux d’énergie** accepte plusieurs capteurs par source. Les capteurs réseau, solaire, injection et maison sont additionnés (par exemple trois phases ou deux onduleurs), et chaque batterie a son propre cercle avec son niveau, son nom et son flux, reliés par un bus sous le diagramme (jusqu’à 4). Toucher un cercle comportant plusieurs capteurs permet de choisir celui à ouvrir.

### 1.6.0
- Ajouté : carte **Flux d’énergie** (`custom:nuvio-flow-card`) : réseau, solaire, batterie et maison sur un même diagramme en verre, avec des points qui circulent le long des lignes, plus vite à forte puissance. Le réseau affiche le soutirage ou l’injection, la batterie son niveau et si elle se charge, et l’anneau de la maison et la légende indiquent la part de puissance venant du solaire, du réseau et de la batterie. Elle se trouve dans **+ Ajouter** avec un aperçu en direct, et la vue Énergie la place en haut lorsqu’elle trouve des capteurs de puissance réseau et solaire ou batterie.

### 1.5.1
- Corrigé : fermer la fenêtre Assist avec X laissait ses messages, ses suggestions et son champ de saisie à l’écran sans le verre derrière. La fenêtre fermée est désormais entièrement retirée, et la conversation est conservée pour la prochaine ouverture.

### 1.5.0
- Ajouté : visibilité des vues par personne dans **Paramètres → Vues**. Chaque vue est visible par tout le monde par défaut ; un administrateur peut masquer une vue pour certaines personnes, et la ligne indique qui ne la voit pas. Cela s’applique aussi aux personnes ayant leur propre disposition, et leur écran ouvert se recharge pour retirer la vue.

### 1.4.0
- Ajouté : tableau de bord partagé. Par défaut, tout le monde voit le même tableau de bord, configuré par un administrateur ; les non-administrateurs n’obtiennent plus une disposition par défaut vide. Le premier administrateur qui ouvre la 1.4.0 transforme sa disposition en disposition partagée.
- Ajouté : **Paramètres → Utilisateurs** pour les administrateurs, avec un interrupteur par utilisateur Home Assistant. Une personne désactivée obtient sa propre disposition, qui part d’une copie de la disposition partagée, et peut la modifier elle-même.
- Ajouté : les modifications du tableau de bord partagé arrivent en direct sur les écrans ouverts.
- Corrigé : les paramètres d’Assist sont désormais enregistrés dans Home Assistant au lieu d’être perdus au prochain enregistrement de la disposition.

### 1.3.1
- Ajouté : animation de déverrouillage pour le verrouillage par code PIN. Le cadenas s’ouvre, les points du code PIN s’illuminent en vert, les touches s’écartent du centre vers l’extérieur, une douce vague de lumière se propage et l’écran de veille flouté s’efface pour révéler le tableau de bord. Avec les animations réduites, un court fondu.

### 1.3.0
- Ajouté : verrouillage par code PIN de l’écran de veille (BÊTA) dans **Apparence → Mode tablette murale** : code PIN, délai de verrouillage et activation. Un écran de veille verrouillé affiche un pavé numérique rond en verre sur la photo floutée, avec les points du code PIN au-dessus et un bouton **Verrouiller** en dessous.
- Ajouté : *Verrouiller l’écran* dans le menu utilisateur lorsque le verrouillage par code PIN est activé. Un écran verrouillé reste verrouillé après un rechargement de la page.

### 1.2.1
- Corrigé : les tablettes en paysage (à partir de 900 px de large et d’un rapport d’aspect de 1,2, comme un iPad tenu à l’horizontale) utilisent de nouveau la disposition ordinateur au lieu de mélanger la barre d’onglets du téléphone avec le rail latéral et d’étirer les panneaux. La disposition tablette reste pour le portrait et les fenêtres plus carrées, et son échelle est désormais aussi limitée par la hauteur de la fenêtre.

### 1.2.0
- Ajouté : sept cartes : conditionnelle (`custom:nuvio-conditional-card`), coup d’œil, statistiques, humidificateur, minuteur, journal et page web, chacune dans **+ Ajouter** avec un aperçu en direct. Les cartes HA `conditional` deviennent la carte conditionnelle de Nuvio.
- Ajouté : *Désactiver le mode kiosque* dans le menu utilisateur lorsque Kiosk Mode est installé (administrateurs uniquement). La page se recharge avec `?disable_km` et le conserve lorsque vous passez d’une vue à l’autre dans cet onglet ; le même élément le réactive.
- Ajouté : une bibliothèque de formulaires (`hgForm`, interrupteur `nuvio-check`) utilisée par les formulaires des composants et l’éditeur de sauvegarde ; les datalists du navigateur sont remplacées par la liste de suggestions en verre.
- Modifié : les cartes, les tuiles et les panneaux intérieurs en mode clair sont moins transparents.
- Modifié : la carte curseur contrôle aussi l’humidité cible d’un humidificateur.

### 1.1.0
- Ajouté : des conteneurs de disposition comme dans Home Assistant : grille (`custom:nuvio-grid-card`), pile verticale et pile horizontale, dans un nouveau groupe *Disposition* de **+ Ajouter** avec des aperçus en direct.
- Ajouté : le formulaire d’un conteneur liste ses cartes. Ajoutez n’importe quel composant, tuile ou carte HA, modifiez chaque carte dans son propre formulaire, glissez pour réordonner, dupliquez, retirez et définissez le nombre de colonnes occupées dans une grille. Les conteneurs s’imbriquent jusqu’à trois niveaux.
- Ajouté : déplacez une carte du panneau vers un conteneur depuis son formulaire, et ressortez une carte d’un conteneur vers le panneau.
- Ajouté : *Carte de HA (YAML)* colle une carte depuis l’éditeur de code de Home Assistant. Les `grid`, `vertical-stack` et `horizontal-stack` de HA y deviennent des conteneurs Nuvio, ainsi que dans la configuration de la page (`keep_ha: true` conserve la carte HA).
- Modifié : la carte pile a un espacement, un rapport de largeur pour les cartes côte à côte, une largeur en dessous de laquelle elle passe à la verticale, et des séparateurs désactivables.

### 1.0.1
- Modifié : la fenêtre Assist utilise le même verre, la même couleur d’accent et les mêmes animations que les autres fenêtres Nuvio, en thème clair comme en thème sombre. Vos messages, les points de saisie, le microphone et le champ actif suivent tous la couleur d’accent.
- Modifié : le sélecteur d’assistant (modèle) se trouve dans le champ de message, à droite, avec un nom raccourci lorsqu’il est trop long. L’assistant choisi est mémorisé et devient aussi celui par défaut dans les paramètres.
- Corrigé : en thème clair, les fenêtres des paramètres et de l’éditeur étaient trop transparentes sur un fond chargé.
- Modifié : les détails de la météo s’ouvrent dans la fenêtre partagée de Nuvio, avec le même flou et la même animation d’ouverture et de fermeture que les autres boîtes de dialogue.

### 1.0.0
Le nouveau design est terminé : chaque carte est construite à partir des blocs en verre partagés, se met à jour en direct et s’adapte aux tailles petite, moyenne et grande. Cette version achève le travail avec des améliorations de vitesse.
- Modifié : le bundle est minifié, de 1253 Ko à 1033 Ko (307 Ko au lieu de 366 Ko lorsque le serveur le compresse). Les dispositions et les paramètres enregistrés ne sont pas concernés.
- Modifié : les cartes en dehors de la partie visible de la page ne se redessinent plus à chaque changement d’état. Elles se mettent à jour une fois, juste avant d’apparaître à l’écran. Sur un téléphone avec le tableau de bord d’exemple, une série complète de changements de capteurs coûte désormais environ 3,3 ms au lieu de 4,2 ms.
- Modifié : les graphiques de l’historique, du réseau et de l’éditeur utilisent le stockage d’historique partagé, si bien qu’un même capteur n’est demandé qu’une fois à Home Assistant pour tous.
- Modifié (développement) : `tools/build.py` minifie avec esbuild lorsqu’il est installé (`npm install`) ; sans lui, le build fonctionne toujours et écrit un bundle non minifié.

### 0.16.0
- Ajouté : douze cartes génériques construites à partir des blocs en verre partagés : accueil, tuile interrupteur, barre de progression, arc, graphique, pièce compacte, actions rapides, famille, volet, serrure, ventilateur et liste de tâches. Chacune fonctionne avec n’importe quelle entité du domaine adapté et s’adapte aux largeurs petite, moyenne et grande. Voir *Cartes et conteneurs génériques* plus haut.
- Ajouté : deux conteneurs pour construire des tableaux de bord : une pile (plusieurs cartes dans un même verre, à la verticale ou à l’horizontale) et des onglets (pastilles qui basculent entre des ensembles de cartes). Les deux acceptent les cartes Nuvio et les cartes Home Assistant ordinaires.
- Ajouté : un tableau de bord d’exemple composé uniquement des nouvelles cartes, `docs/examples/inspiration-dashboard.yaml`, inspiré du design de référence.
- Ajouté : les nouvelles cartes dans la galerie *Ajouter un composant* de l’éditeur, avec des aperçus.
- Modifié : les cartes Nuvio placées dans une vue Home Assistant ordinaire floutent et teintent elles-mêmes le fond, si bien qu’elles ressemblent à du verre et non à un léger voile. Dans la page Nuvio, rien ne change (le panneau floute toujours une seule fois pour toutes les cartes).
- Ajouté : les boîtes de dialogue peuvent renvoyer ce qui a été saisi dans leurs champs (`hgOverlay.dialog({ collect: true })`), et Entrée dans un champ appuie sur le bouton principal. La carte serrure s’en sert pour les codes de serrure.
- Ajouté (développement) : un stockage d’historique partagé unique (`src/parts/ui/history.part.js`), si bien que plusieurs cartes avec le même capteur et la même période n’interrogent Home Assistant qu’une fois.

### 0.15.0
- Modifié : chaque carte se met désormais à jour en direct, y compris les cartes lumière, lampe, curseur, climatisation, alarme, assistant, robot et pièce. Un changement d’état ne reconstruit plus ces cartes, si bien qu’un lecteur multimédia ou une caméra ouverts dans une carte de pièce continuent leur lecture, et que le champ de code de la carte alarme conserve ce que vous avez saisi.
- Modifié : les boutons, interrupteurs et cercles d’icône de toutes les cartes générales utilisent le même verre, le même halo et le même mouvement à ressort que les nouveaux blocs. Les cercles d’icône sont ronds, les boutons actifs brillent doucement dans la couleur d’accent, et les interrupteurs s’étirent légèrement lorsqu’on appuie dessus.
- Modifié : les coins intérieurs suivent les jetons de design : cartes 24 px, tuiles et pistes dans les cartes 16 px, petites pastilles 12 px, identiques pour toutes les tailles de carte.

### 0.14.0
- Modifié : une seule apparence et une seule animation pour chaque fenêtre au-dessus du tableau de bord. Les confirmations (par exemple « Tout éteindre ? ») sont désormais des fenêtres en verre qui apparaissent en douceur sur un fond flouté, gardent le focus clavier à l’intérieur, le rendent au bouton d’origine et se ferment avec Échap. Elles apparaissent aussi au-dessus de l’assistant de premier démarrage, derrière lequel elles étaient auparavant cachées.
- Ajouté : infobulles en verre. Les boutons d’icône et les éléments avec une indication affichent un petit libellé blanc après un court survol ou au focus clavier, au lieu de l’infobulle grise du navigateur. Les indications qui ne font que répéter le texte visible sont ignorées.
- Modifié : les notifications en bas de l’écran utilisent les jetons d’animation partagés et restent désormais au-dessus des fenêtres ouvertes.
- Ajouté (développement) : `hgOverlay` dans `src/parts/ui/overlay.part.js` avec `dialog`, `alert`, `sheet` (depuis le bas sur les téléphones, depuis le côté sur les écrans larges, glisser vers le bas pour fermer), `popover`, `menu` (touches fléchées, éléments cochés), `toast` et `tip`. `HGConfirm.ask` garde sa signature et utilise désormais `hgOverlay.alert`. La pile de notifications a été déplacée dans `src/parts/ui/toast.part.js`. La page de galerie montre chaque superposition.

### 0.13.0
- Modifié : les cartes se mettent désormais à jour en direct. Lorsqu’un appareil change d’état, seules les parties de la carte qui ont changé sont mises à jour au lieu de redessiner toute la carte, si bien que les barres et les interrupteurs glissent vers la nouvelle valeur, que le focus et la position de défilement sont conservés, et que les capteurs rapides ne font plus clignoter les cartes. Les cartes avec leurs propres commandes à glisser (lumière, climatisation, curseur, lampe, pièce) gardent l’ancien comportement pour l’instant.
- Modifié : les interrupteurs bougent avec un ressort doux et s’étirent légèrement lorsqu’on appuie dessus.
- Ajouté (développement) : des blocs de construction partagés dans `src/parts/ui/` (bouton d’icône, pastille, onglets, interrupteur, en-tête, grande valeur, barre de progression, arc, graphique en aires, avatars) et une page de galerie `tests/ui-gallery.html`.

### 0.12.0
- Modifié : nouvelle apparence en verre pour les cartes, les panneaux et les commandes flottantes, plus proche du design de référence. Le verre a désormais un doux reflet de lumière depuis le coin supérieur gauche, un fin liseré lumineux plus marqué en haut, et une ombre douce plus profonde. En thème sombre, le panneau derrière les cartes est plus sombre, si bien que les cartes ressortent davantage.
- Ajouté (développement) : des jetons de design pour la forme, le verre, les animations et la typographie dans `src/theme_head.js`, décrits dans DESIGN.md.

### 0.11.2
- Modifié (développement) : chaque carte vit désormais dans son propre fichier source dans `src/parts/cards/` (57 fichiers au lieu de 14), et les utilitaires partagés par plusieurs cartes sont dans `src/parts/shared/`. Le tableau de bord fonctionne exactement comme avant : le bundle construit contient le même code. C’est la première étape de la nouvelle bibliothèque de composants et du nouveau design.

### 0.11.1
- Corrigé : sur les tablettes (iPad et autres écrans tactiles de 768 à 1180 px, dans les deux orientations), le tableau de bord utilise la disposition tablette, où c’est la page qui défile et non le panneau en verre. Les vues des pièces ne rognent plus les cartes en haut, ne superposent plus les colonnes et n’affichent plus de bloc flouté mal placé ; elles utilisent une grille de deux colonnes au maximum.
- Corrigé : la liste du sélecteur d’assistant dans la boîte de dialogue Assist s’ouvre juste sous son bouton au lieu d’ailleurs à l’écran, et la boîte de dialogue est centrée avec plus de place pour le libellé du sélecteur.

### 0.11.0
- Modifié : Assist est désormais une boîte de dialogue en verre au lieu d’une carte. Ouvrez-la avec le bouton microphone de l’en-tête ou la touche A ; sur un téléphone, elle glisse depuis le bas. La conversation, le sélecteur d’assistant, le microphone, les suggestions et les réponses vocales restent, et la conversation se poursuit pendant toute la session. Fermez avec X, Échap ou un toucher à l’extérieur.
- Ajouté : paramètres d’Assist dans Paramètres, onglet En-tête et navigation : bouton dans l’en-tête, raccourci A, assistant par défaut, réponses vocales, microphone et vos propres suggestions.
- Modifié : Assist n’est plus proposé dans + Ajouter. Les cartes Assist existantes affichent un petit bouton qui ouvre la boîte de dialogue.
- Corrigé : balayer les onglets des paramètres, un curseur, un sélecteur ou une rangée à défilement horizontal ne change plus de vue du tableau de bord, et le balayage entre les vues est désactivé tant qu’une boîte de dialogue est ouverte.

### 0.10.2
- Corrigé : la carte Assist a sa propre surface en verre floutée, si bien que le contenu derrière elle ne transparaît plus. Les bulles, les pastilles de suggestion et le champ de saisie sont plus contrastés.

### 0.10.1
- Corrigé : le titre de la carte Assist reste visible à côté du sélecteur d’assistant.

### 0.10.0
- Ajouté : carte Assist. Parlez à Assist de Home Assistant depuis une carte en verre : champ de texte, microphone (reconnaissance vocale du navigateur), sélecteur d’assistant, réponses dans des bulles de discussion, conversation qui se poursuit d’une question à l’autre, réponses vocales facultatives, pastilles de suggestion. Configuration complète par formulaire, champ JSON, export et import.
- Ajouté : DESIGN.md avec les règles d’interface que chaque nouvelle fonctionnalité doit respecter.

### 0.9.1
- Modifié : l’écran de veille affiche du texte et des icônes simplement blancs avec une ombre douce, sans panneaux derrière. L’indication de réveil est centrée en bas avec une légère pulsation qui respecte les animations réduites.
- Modifié : tous les curseurs utilisent un même style personnalisé : piste fine, remplissage dans la couleur d’accent, poignée blanche qui grossit au survol et pendant le glisser, focus clavier bien visible.

### 0.9.0
- Ajouté : 13 nouveaux composants dans + Ajouter : lumière avec luminosité, thermostat, grande valeur, graphique d’historique, portes et fenêtres, batteries, aspirateur robot, mini-lecteur, horloge, soleil, note, image ou page, mises à jour.
- Ajouté : fenêtre de paramètres avec onglets (Apparence, Vues, Pièces, En-tête et navigation, Fonds d’écran, Écran de veille, Sauvegarde), tableau des paramètres des vues avec libellés.
- Modifié : les tailles de tuile S, M et L occupent réellement des cellules de la grille, avec un remplissage dense, si bien que les petites tuiles se placent côte à côte.
- Modifié : le contenu des cartes s’adapte à la taille de la tuile grâce aux container queries.
- Modifié : les lignes de prix des carburants dans les paramètres de l’en-tête sont des cartes empilées, avec des noms de capteurs plus courts regroupés par intégration.
- Corrigé : le bouton de modification du titre reste à côté du titre dans les vues pleine largeur.

### 0.8.1
- Corrigé : les widgets ajoutés en mode édition suivent désormais le nombre de colonnes de la vue, si bien qu’Énergie et Réseau utilisent toute la largeur avec 3 colonnes.

### 0.8.0
- Ajouté : nombre de colonnes pour chaque vue sur ordinateur et tablette, y compris les vues intégrées comme Énergie.
- Ajouté : icône par vue, libellé court dans la barre du téléphone, visibilité et ordre dans la barre latérale. Les libellés trop longs de la barre du téléphone rétrécissent au lieu d’être coupés.
- Ajouté : choix de l’entité météo pour l’en-tête ; le choix automatique privilégie une entité avec des prévisions, et un capteur de prévisions facultatif (n’importe quelle entité avec un attribut `forecast`, par exemple via MQTT) alimente la bande horaire.
- Ajouté : position du bandeau du foyer, à gauche ou à côté du panneau.
- Ajouté : point focal du fond d’écran, enregistré dans la disposition.
- Corrigé : un panneau pleine largeur (et d’autres paramètres par vue ou d’apparence) pouvait être perdu lorsque le tableau de bord était ouvert dans un autre onglet du navigateur, car les sections de la disposition étaient enregistrées en bloc. Elles sont désormais fusionnées clé par clé.
- Corrigé : dans Pièces, une entité sous Autres qui appartient à une pièce personnalisée affiche le nom de cette pièce.

### 0.7.1
- Corrigé : les vues des pièces utilisent désormais les réglages d’eau chaude, d’escalier, de noms d’entités et de caméras définis dans Apparence, Pièces (auparavant, seuls les noms, les icônes, l’ordre et les capteurs étaient appliqués).
- Corrigé : l’en-tête de la vue d’une pièce affiche le nom de la pièce, la température, l’humidité et un bouton retour au lieu du titre générique.
- Corrigé : enregistrer Apparence, En-tête et navigation ne supprime plus la liste des personnes du foyer.

### 0.7.0
- Ajouté : des composants pour tout ce qu’affiche Home Glass, chacun dans + Ajouter avec un aperçu et un formulaire de paramètres complet : Pièces, Pièce, Électroménager (lave-linge, sèche-linge, lave-vaisselle avec état, programme, temps restant et progression), Eau chaude, Escalier, Prix des carburants, carte Climatisation, Énergie · semaine, Phases, Photovoltaïque, Réseau, Capteurs de la maison, Raccourci et Personne.
- Ajouté : chaque composant de carte a un champ Configuration avancée (JSON), si bien que n’importe quelle option de carte (libellés, couleurs, seuils, actions) peut être modifiée dans le formulaire.
- Ajouté : Apparence, Pièces : noms, icônes, ordre et visibilité des pièces, capteur de température et d’humidité par tuile de pièce (automatique, choisi ou aucun), pièces personnalisées avec n’importe quelles entités, indépendantes des pièces de Home Assistant, et affectation manuelle des entités.
- Ajouté : Apparence, En-tête et navigation : titre du foyer ou pas de bandeau du foyer, prix des carburants dans l’en-tête du tableau de bord, et les quatre vues de la barre du téléphone.
- Ajouté : Apparence, Galerie de fonds d’écran : vos propres images enregistrées dans la disposition, utilisées aussi par le diaporama de la tablette murale.
- Modifié : l’export et l’import de la Sauvegarde de la disposition reprennent tout ce qui précède, et la vérification des entités manquantes inclut les capteurs des pièces et des carburants.

### 0.6.5
- Corrigé : les paramètres de la tablette murale (écran de veille) n’étaient pas enregistrés lorsqu’un autre tableau de bord basé sur Home Glass était installé comme ressource Lovelace sur le même Home Assistant. Les deux bundles partageaient un même stockage de disposition en mémoire, si bien que Nuvio écrivait dans la clé de l’autre tableau de bord, qui n’a pas de section écran de veille. Nuvio garde désormais ses propres variables globales, et chaque build reçoit un nouveau nom de fichier haché selon son contenu.

### 0.6.4
- Modifié : la carte **Climat** retrouve l’apparence de la 0.5.0 (grande température avec flèches, curseur à graduations et boutons de mode) ; le cadran rond de la 0.6.0 a disparu. La gestion tactile reste : balayez le curseur latéralement pour régler la température (un balayage vers le haut ou le bas fait défiler la page, un toucher saute à cet endroit), maintenez la température pour ouvrir les détails de l’entité, touchez-la pour allumer une unité éteinte, maintenez les flèches pour répéter, une légère vibration à chaque pas (application Home Assistant ou téléphones compatibles), et Page préc./suiv., Début/Fin au clavier.

### 0.6.1
- Mode tablette murale : l’horloge ne repose plus sur un panneau en verre. La date est désormais fixée en bas à gauche et, lorsque Home Assistant a une entité météo, la météo actuelle (icône, température, condition) apparaît en haut à droite.

### 0.6.0
- Nouvelle apparence pour la carte **Climat** : un cadran de thermostat en verre (arc de 270°) avec un dégradé de température du froid au chaud, un bouton à faire glisser, un point pour la température intérieure et un doux halo dans la couleur du mode (orange en chauffe, bleu en refroidissement, turquoise en déshumidification) qui respire lorsque l’unité fonctionne réellement. Les boutons de mode utilisent les mêmes couleurs.
- Gestion tactile de la carte Climat : faites glisser le long de l’arc pour régler la température (la page défile toujours lorsque vous balayez le milieu du cadran), maintenez le centre pour ouvrir les détails de l’entité, touchez le centre pour allumer une unité éteinte, maintenez −/+ pour répéter. Chaque pas donne une légère vibration (application Home Assistant ou téléphones compatibles). Clavier : flèches, Page préc./suiv., Début/Fin.
- Climatisation compacte (pages des pièces) : la bande à graduations est désormais un curseur en verre avec le dégradé de température. Balayez latéralement pour régler, touchez pour sauter, balayez vers le haut ou le bas pour faire défiler la page.
- Passe de cohérence sur les composants : les tuiles intérieures de Multimédia, Robots, Capteurs, Alarme et Caméras utilisent une même surface en verre partagée (même remplissage et un bord supérieur clair) en mode clair et sombre, au lieu de quatre remplissages blancs légèrement différents avec bordures.
- Corrigé : dans la vue Pièces, le nom de la pièce était coupé par la température à certaines largeurs (ex. 1440 px) ; les tuiles des pièces s’agrandissent désormais pour tout afficher. Les points d’état des pièces utilisent désormais les couleurs des modes de climatisation.

### 0.5.0
- Nouveau : **Mode tablette murale** (désactivé par défaut). Après une période d’inactivité, un écran de veille en verre avec une grande horloge, la date et une photo apparaît en fondu et assombrit l’écran ; un toucher, l’appui sur une touche ou un détecteur de mouvement (n’importe quel `binary_sensor`, choisi dans les paramètres) le réveille. Dans **Apparence → Mode tablette murale**, vous réglez le délai d’inactivité, le niveau d’assombrissement, la source de la photo (fond du tableau de bord, diaporama ou votre propre URL) et le capteur, et vous pouvez l’essayer en aperçu. L’horloge se déplace légèrement pour protéger les écrans OLED, l’écran reste allumé pendant l’affichage, les animations réduites sont respectées, et il apparaît au-dessus des boîtes de dialogue de Home Assistant. Les paramètres font partie de la Sauvegarde de la disposition.

### 0.4.1
- Nouvelle apparence pour l’assistant de premier démarrage : panneau en verre moderne sur votre fond d’écran, un rail d’étapes à gauche avec vos choix jusqu’ici (touchez une étape terminée pour y revenir), un aperçu en direct du tableau de bord sur l’écran d’accueil, des transitions fluides entre les étapes et des tuiles qui apparaissent en décalé (animations réduites respectées). Les pièces ont Tout sélectionner / Tout désélectionner, les lignes du récapitulatif ouvrent leur étape, Entrée passe à l’étape suivante, et les noms des couleurs suivent la langue choisie. Sur les téléphones, les étapes se réduisent à une barre de progression.
- Corrigé : sur l’écran d’accueil en grande taille (ex. 1440 px), le texte sous « Bienvenue dans Nuvio » était recouvert par le dégradé de la photo. Le texte repose désormais sur le verre, à côté de l’aperçu.

### 0.4.0
- Nouveau : sauvegarde de la disposition dans Apparence. Exportez toute la disposition vers un fichier JSON versionné ou le presse-papiers, en choisissant ce qui est inclus, et importez-la depuis un fichier, par glisser-déposer ou par texte collé. L’import valide le fichier, affiche un récapitulatif avec les vues, les widgets et les entités absents de cette instance, propose Remplacer ou Fusionner, conserve la disposition actuelle en sauvegarde avec Restaurer la précédente en un clic, convertit les anciennes données et rejette les fichiers invalides avec un message clair. Administrateurs uniquement.

### 0.3.24
- Corrigé : une icône modifiée s’affiche désormais dans l’aperçu en direct pendant l’édition, et pas seulement après l’enregistrement. Les dispositions de groupe (Liste, Grille, Carrousel, Liste compacte) n’avaient aucune icône dans l’en-tête de l’aperçu, et les aperçus de section pouvaient modifier la mauvaise icône au lieu de celle de l’en-tête de la section.

### 0.3.23
- Corrigé : le sélecteur d’icônes (champ Icône) suit désormais le thème clair et sombre. En mode sombre, la liste était claire avec des icônes blanches à peine visibles ; elle est désormais en verre dépoli dans les couleurs du thème, avec des icônes et des libellés nets dans les deux modes. Elle s’ouvre et se ferme avec une courte animation, la flèche pivote tant qu’elle est ouverte, l’en-tête de la liste indique combien d’icônes correspondent à la recherche, une grille provisoire s’affiche pendant le chargement des icônes, et la liste s’estompe sur le bord inférieur. Les animations réduites sont respectées.

### 0.3.22
- Corrigé : les aperçus en direct dans les fenêtres de paramètres des composants et des cartes ne sont plus surdimensionnés ni étirés. Un nouveau composant est prévisualisé à sa hauteur naturelle et à la largeur du panneau ; une carte existante à la taille exacte qu’elle a sur la page ; les deux sont réduits pour tenir et centrés, sans espace vide. Les aperçus de tuile et de groupe gardent la largeur du panneau au lieu d’occuper toute la fenêtre.

### 0.3.21
- Modifié : suppression de la CI/CD (le workflow de publication GitHub Actions, y compris la tâche de validation HACS). Les versions et les tags sont construits uniquement en local avec `tools/release.sh`.

### 0.3.20
- Ajouté : survol et focus clavier sur les tuiles de la fenêtre contextuelle Plus de vues (verre plus lumineux, ombre douce, léger soulèvement ; retour visuel à l’appui ; pas de soulèvement sur les écrans tactiles ni avec les animations réduites).

### 0.3.19
- Corrigé : la fenêtre contextuelle Plus de vues à côté du rail se place désormais nettement au-dessus de la barre d’outils de zoom et du panneau du foyer : verre plus dense avec un flou plus fort, léger assombrissement derrière, et le masque utilisé pour l’animation d’ouverture est retiré une fois celle-ci terminée (il désactivait le flou du verre dans certains navigateurs, si bien que le contenu transparaissait). Cliquer à l’extérieur ou appuyer sur Échap la ferme.

### 0.3.18
- Corrigé : la météo de l’en-tête utilise de nouveau l’icône animée (la 0.3.17 l’avait remplacée par erreur par l’icône fixe ; elle n’était pas la cause de la bande lumineuse).
- Inclut les modifications de la 0.3.17, qui n’avait jamais été taguée : plus de bande lumineuse sur les vues à panneau demi-largeur, et les indicateurs des onglets et du rail ne gardent plus de calque GPU permanent.

### 0.3.17
- Modifié : les indicateurs des onglets et du rail ne gardent plus de calque GPU permanent (ils ne sont promus que pendant leur animation).

### 0.3.16
- Corrigé : Terminé, Enregistrer et les autres boutons principaux valident et ferment sans rien demander. La confirmation Abandonner les modifications n’apparaît qu’à la fermeture d’un formulaire avec des modifications non enregistrées (paramètres de carte, formulaire de composant) avec X, Échap, l’arrière-plan ou un balayage ; les fenêtres qui appliquent les modifications en direct (Apparence, titre, Restaurer les éléments masqués, la galerie) ne demandent jamais rien.
- Corrigé : annuler le mode édition restaure de nouveau correctement la disposition (la vérification des modifications non enregistrées de la 0.3.13 écrasait l’instantané du mode édition).
- Corrigé : le bouton Abandonner utilise la couleur d’erreur de Home Assistant au lieu d’un rouge fixe, et la tuile Ajouter en mode édition garde la taille d’une petite tuile.

### 0.3.15
- Corrigé : le bouton de masquage du panneau change d’icône (œil) et de libellé et indique son état avec aria-pressed.
- Corrigé : les noms d’entité longs sur les tuiles ne sont plus coupés en haut et en bas ; ils passent sur 2 lignes avec des points de suspension, et les valeurs inconnues affichent Aucune donnée au lieu d’un tiret.
- Amélioré : le sélecteur de taille est un contrôle segmenté en verre avec des pictogrammes de taille, des largeurs égales et les libellés Petite, Moyenne et Pleine largeur, l’option choisie étant dans la couleur d’accent.
- Corrigé : en mode édition, la tuile Ajouter s’insère comme la cellule suivante de la grille, de la taille d’une petite tuile, sans rangées vides ; les poignées de déplacement, de suppression et de taille sont bien placées sur les bords de la tuile.
- Corrigé : tous les boutons de pied des boîtes de dialogue ont la même hauteur et le même espacement, sont alignés à droite et s’empilent en pleine largeur sur les téléphones.
- Nouveau : le champ Icône dispose d’un sélecteur d’icônes avec recherche, avec la liste MDI complète de Home Assistant, les icônes récentes, la navigation au clavier et un aperçu en direct ; saisir mdi:nom à la main fonctionne toujours.

### 0.3.14
- Corrigé : une vue ou un panneau sans élément visible affiche l’état Vue vide avec un bouton Ajouter un widget, en direct après une suppression, un masquage, une annulation ou un rétablissement, en mode édition comme en mode normal, sur tous les types de vue. Annuler restaure les éléments et masque de nouveau cet état.
- Corrigé : le bouton Annuler des notifications utilise la couleur de texte assortie à l’accent du thème.

### 0.3.13
- Corrigé : le formulaire de composant ouvert depuis les paramètres d’une carte revient à son point d’ouverture (Retour le ferme) au lieu de la galerie. Toutes les fenêtres d’édition utilisent désormais une même pile de navigation.
- Amélioré : le texte saisi, la recherche et les sélections sont conservés lors des allers-retours, la position de défilement est gardée à chaque étape, le focus passe au titre de l’étape et revient sur la commande qui a ouvert l’étape. Échap revient d’une étape. Fermer avec des modifications non enregistrées demande une confirmation (Abandonner ou Rester), uniquement si quelque chose a changé. Sur un téléphone, un balayage vers le bas ne ferme que le niveau supérieur et un balayage depuis le bord gauche revient d’une étape. Les glissements suivent le réglage des animations réduites.
- Nouveau : le menu utilisateur affiche la version de Nuvio et une pastille de mise à jour (depuis l’entité de mise à jour HACS, ou les versions GitHub vérifiées au plus toutes les 6 heures) avec un point sur l’avatar, ainsi qu’une indication de rechargement lorsqu’un fichier plus récent est déjà sur le serveur.

### 0.3.12
- Corrigé : la navigation dans les fenêtres d’édition fonctionne comme une pile. Dans une étape imbriquée (choix d’une entité, formulaire de composant, style du widget, changement d’entité depuis les paramètres d’une carte), le X, Échap et une nouvelle flèche de retour reviennent à l’étape précédente avec son état conservé ; seul le X du niveau supérieur (la galerie + Ajouter ou les paramètres) ferme la fenêtre. Les étapes glissent à l’entrée et à la sortie sans que la fenêtre se ferme et se rouvre.

### 0.3.11
- Modifié : aperçus dessinés dans la galerie + Ajouter. Chaque composant affiche une petite maquette avec des données d’exemple, marquée comme aperçu (curseur rempli, bouton, lignes d’entité avec interrupteurs, liste de choix, compteur, arc de jauge, lumière, valeur de capteur, sparkline, climatisation, volet, scènes, lecteur multimédia, caméras, puissance, énergie, météo, personnes, alarme, robots, agenda, carte) dans le même style de verre et d’accent. Un aperçu en direct avec une vraie entité n’est utilisé que lorsque chaque entité nécessaire a un état connu.
- Modifié : les composants sans entité correspondante restent sélectionnables, sont seulement légèrement estompés et affichent une courte ligne (Aucune entité correspondante) avec les domaines requis en plus petit et une infobulle. Les cartes ont la même hauteur, les aperçus ont une hauteur unique et les textes longs sont tronqués sur téléphone, tablette et ordinateur.

### 0.3.10
- Nouveau : largeur du panneau par vue. Chaque vue (intégrée ou personnalisée) propose **Panneau étroit** (une colonne à droite comme sur l’Accueil, laissant la partie gauche au titre et au fond d’écran) ou **Panneau pleine largeur** (comme Pièces), avec de petits aperçus. Le choix se trouve dans la fenêtre du titre de la vue (mode édition, titre) et dans le formulaire de vue personnalisée, s’applique en direct sans rouvrir la boîte de dialogue et est enregistré par vue. Un panneau étroit contient au plus deux colonnes ; sur les téléphones, le panneau est toujours en pleine largeur.
- Modifié : l’indication de vue vide reste visible tant qu’une vue personnalisée n’a pas trois éléments et se place sous les tuiles, si bien qu’une vue avec une seule rangée ne paraît plus vide.

### 0.3.9
- Corrigé : les dispositions des vues personnalisées sont désormais vraiment différentes. **Grille** garde des rangées égales avec des cartes étirées à la hauteur de la rangée, **Colonnes** empile les cartes de haut en bas dans chaque colonne, dans l’ordre, sans aligner les rangées, **Maçonnerie** place chaque carte dans la colonne la plus courte, et **Panneau** affiche la météo en haut avec deux colonnes. Enregistré par vue et appliqué après rechargement.
- Corrigé : la boîte de dialogue des paramètres de vue se met à jour sur place. Choisir une disposition, une icône ou une autre option ne ferme et ne rouvre plus la boîte de dialogue ; la position de défilement, le texte saisi et le focus sont conservés.

### 0.3.8
- Nouveau : une même liste de choix en verre pour tout Nuvio. Chaque liste déroulante (colonnes de la vue par appareil, largeur maximale, source du lecteur multimédia) utilise désormais un déclencheur en verre assorti aux champs de saisie et une liste en verre animée avec le flou visible dès la première image, une coche dans l’accent du thème sur l’option choisie, une prise en charge complète du clavier (flèches, Début, Fin, Entrée, Échap, saisie pour rechercher), la sémantique ARIA listbox, la fermeture au clic à l’extérieur, l’ouverture vers le haut près du bord inférieur et des zones tactiles plus grandes sur les téléphones. La liste s’affiche au-dessus des fenêtres et des autres éléments en verre, si bien qu’elle n’est jamais rognée. Le select natif reste en dessous comme source de la valeur.

### 0.3.7
- Nouveau : repli distant pour les images et les polices. Nuvio charge les fonds d’écran, les miniatures de la galerie et les polices depuis l’installation locale d’abord et, si un fichier ne se charge pas, depuis jsDelivr épinglé sur la version en cours (`cdn.jsdelivr.net/gh/kczepiec/nuvio@v<version>/dist/`). Les installations hors ligne continuent de fonctionner avec les fichiers locaux.
- Corrigé : raccords visibles du verre sur les fonds photo. L’assombrissement du fond d’écran est désormais une simple surcouche au lieu d’un filtre CSS sur la photo plein écran, et les calques du fond d’écran sont de nouveau de simples calques fixes, si bien que les éléments floutés échantillonnent un arrière-plan uniforme.
- Corrigé : la fenêtre contextuelle « Plus » du rail est dépolie dès la première image (animation de révélation au lieu d’un fondu d’opacité, qui désactivait le flou) et ses tuiles gardent une hauteur et un alignement égaux.
- Corrigé : vues portant le même titre ou des chemins similaires. L’élément actif du rail correspond à des segments de chemin entiers (`/nuvio/test` ne s’allume plus pour `/nuvio/test2`), et `rail_overflow` accepte un chemin de vue et n’associe jamais deux entrées au même élément.

### 0.3.6
- Nouveau : largeur des sections. Les paramètres d’une section du tableau de bord proposent **Automatique**, **Pleine largeur** ou **Moitié** avec un petit aperçu visuel ; sur les téléphones, chaque section est en pleine largeur. Enregistré par section.
- Nouveau : en mode édition, Nuvio vérifie si le serveur a un `nuvio.js` plus récent et propose un rechargement sans cache (Ctrl+Maj+R) lorsque le navigateur exécute une ancienne version en cache. L’en-tête de la galerie + Ajouter affiche la version chargée.
- Modifié : les cartes d’indication d’état vide utilisent un rayon de 16 px et une tuile d’icône plus petite.
- Corrigé : les miniatures de fond d’écran qui ne se chargent pas affichent « Image non chargée » au lieu d’un dégradé muet, et enregistrent l’URL dans la console.
- Corrigé : la miniature du fond d’écran choisi avait un double contour de focus ; le focus clavier est désormais un seul anneau arrondi dans la couleur d’accent, et aucun au clic de la souris.
- Corrigé : le fond d’écran et l’ombrage sont chacun un seul calque GPU plein écran, si bien que les éléments en verre échantillonnent un même arrière-plan (pour corriger un raccord vertical observé dans Chrome sur macOS).

### 0.3.5
- Corrigé : un fond d’écran choisi dans une ancienne version (enregistré avec l’ancien chemin `assets/backgrounds/` ou `assets/bg/`) est migré vers le nouveau fichier `nuvio-bg-*` à plat, si bien qu’il s’affiche de nouveau après la mise à jour.

### 0.3.4
- Corrigé : les polices, les fonds d’écran et les icônes météo manquaient après une installation via HACS. HACS ne télécharge que les fichiers placés directement dans `dist/`, si bien que toutes les ressources s’y trouvent désormais avec des noms uniques (`nuvio-font-*`, `nuvio-bg-*`, `nuvio-meteo-*`) ; les crédits des fonds d’écran sont dans `dist/CREDITS.md`.
- Corrigé : la base des ressources est déduite de l’URL du module, si bien qu’une installation manuelle sous `/local/nuvio/` charge ses propres polices et fonds d’écran au lieu de `/hacsfiles/nuvio/`.

### 0.3.3
- Corrigé : en mode édition, la poignée de déplacement et le X du premier bloc d’une colonne de pièce étaient dessinés sur le bloc de la colonne précédente ; chaque bloc a désormais exactement une poignée (en haut à gauche), un X (en haut à droite) et S/M/L à l’intérieur.
- Modifié : les versions ne joignent plus `nuvio.zip` ni `nuvio.js`. HACS installe alors tout le dossier `dist/`, y compris `assets/` (polices, fonds d’écran) ; avec des fichiers joints, il ignorait `dist/` et gardait un ancien build. L’installation manuelle utilise `dist/` depuis l’archive des sources de la version.

### 0.3.2
- L’en-tête de la galerie + Ajouter affiche la version de Nuvio chargée, si bien qu’un bundle obsolète ou en cache (sans groupe De base) se repère facilement. Après une mise à jour dans HACS, rechargez le navigateur (Ctrl+Maj+R) ou videz le cache de l’application.

### 0.3.1
- Corrigé : les composants génériques (Curseur, Bouton, Liste d’entités, Sélection, Compteur, Jauge) manquaient dans la galerie + Ajouter des pièces (la galerie des pièces ne listait que les composants tuile) ; ils apparaissent désormais dans un groupe **De base** avec des miniatures en direct, et les pièces affichent les composants ajoutés.
- Modifié : le formulaire de composant n’affiche plus de sélecteur de mode d’affichage ; les vraies variantes sont libellées **Options du composant**.
- Corrigé : les cases non cochées de la boîte de dialogue d’import des pièces étaient invisibles sur les fonds sombres.

### 0.3.0
- Nouveau : vue de pièce vide avec deux actions. **Importer depuis la pièce** affiche les entités de la pièce HA (et les entités dont le nom correspond à la pièce) avec des cases à cocher, une recherche **Choisir des entités** pour un choix manuel, et une option pour les affecter aussi à la pièce dans Home Assistant ; les entités choisies deviennent des tuiles classées par type (climat et caméras en grand, multimédia en moyen). **Créer une disposition personnalisée** ouvre le mode édition avec une pièce vide et la galerie + Ajouter.

### 0.2.1
- Corrigé : HACS enregistrait `nuvio.zip` au lieu de `nuvio.js` comme ressource du tableau de bord, si bien que la stratégie du tableau de bord ne se chargeait jamais (« Timeout waiting for strategy element »).

### 0.2.0
- Corrigé : les boutons de scène appellent désormais `scene.turn_on` (ils ne faisaient rien auparavant).
- Corrigé : les capteurs de puissance en kW / MW sont convertis en watts dans les cartes puissance, énergie, phases et PV.
- Corrigé : les caméras de la vue d’une pièce ne cessent plus de fonctionner après environ 10 minutes (jeton d’image renouvelé).
- Corrigé : les enregistrements de la disposition fusionnent avec la dernière copie du serveur (pas d’écrasement entre appareils) ; le cache local est propre à chaque utilisateur Home Assistant.
- Corrigé : les chevrons de la climatisation ne continuent plus de répéter après un relâchement hors de la carte ; les thermostats à plage `heat_cool` sont en lecture seule ; pas par défaut de 0,5 °C.
- Corrigé : un téléviseur en veille s’allume ; les boutons lecture/pause, volet et vanne respectent ce que l’appareil prend en charge.
- Corrigé : le calendrier mensuel s’actualise ; le champ de code de l’alarme garde le focus ; la météo utilise l’unité de précipitations et la direction du vent en texte.
- Corrigé : la page ne plante plus avec un rail vide ; quitter le mode édition par la navigation enregistre au lieu d’abandonner.
- Ajouté : interface en anglais pour toutes les cartes, la page et le mode édition.
- Ajouté : réorganisation au clavier en mode édition ; annuler après la suppression d’une tuile ne restaure que cette tuile.
- HACS : les polices, les fonds d’écran et les icônes météo sont installés avec le plugin (tout le dossier `dist/`).
- Assistant de prise en main en plusieurs étapes ; vues personnalisées (Apparence → Vues) ; composants et vues Carte et Calendrier.
- Composants généraux : curseur, bouton, entités, sélection, compteur, jauge.
- Cartes d’indication d’état vide, modes d’affichage des cartes de groupe, titre et sous-titre de vue modifiables, notifications empilées.

### 0.1.1
- Galerie « + Ajouter » centrée sur les composants avec aperçu en direct ; correctif du tiroir en mode kiosque ; catalogue des composants dans le README.
