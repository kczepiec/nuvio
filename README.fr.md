<p align="center">
  <img src="assets/brand/final/png/nuvio-horizontal-badge.png" alt="Nuvio" width="300">
</p>

<p align="center"><strong>Votre maison, tranquillement en ordre.</strong></p>

<p align="center">
  <a href="https://hacs.xyz"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5?style=flat-square" alt="HACS Custom"></a>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.8.0%2B-18BCF2?style=flat-square&logo=homeassistant&logoColor=white" alt="Home Assistant 2024.8.0+">
  <img src="https://img.shields.io/badge/version-v2.22.3-a3e635?style=flat-square" alt="v2.22.3">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT"></a>
  <a href="https://discord.gg/rFG9y2hFMJ"><img src="https://img.shields.io/discord/1563057427367075850?style=flat-square&logo=discord&label=Discord&color=a3e635" alt="Discord"></a>
</p>

<p align="center"><a href="README.md">English</a> · <a href="README.pl.md">Polski</a> · <b>Français</b></p>

<p align="center">
  <img src="docs/screenshots/demo_dashboard_dark_1440.png" alt="Vue Accueil de Nuvio avec le thème sombre" width="49%">
  <img src="docs/screenshots/demo_rooms_light_1440.png" alt="Vue Pièces de Nuvio avec le thème clair" width="49%">
</p>

## Ce qu’est Nuvio

Nuvio est un tableau de bord à effet verre pour Home Assistant : pages, navigation, cartes et éditeur sur place, livrés dans un seul module d’interface. Il ne contient aucune entité codée en dur. Au premier démarrage, il lit vos pièces, appareils et entités dans Home Assistant et construit les vues pour vous. Ensuite, tout se modifie en mode édition.

## Fonctionnalités principales

- **Un tableau de bord qui se construit tout seul.** Accueil, Pièces, Multimédia, Caméras, Famille et Énergie apparaissent quand vous avez les entités correspondantes. Les intégrations absentes sont simplement masquées.
- **Une première configuration guidée.** Un assistant pas à pas règle la langue, les vues, les pièces, la couleur d’accent et le fond d’écran, avec un aperçu en direct.
- **Modification sur place.** Glisser-déposer, redimensionnement des tuiles, ajout de composants depuis une galerie, choix de la couleur d’accent et du fond d’écran.
- **De nombreuses cartes, un seul style.** Plus de 70 cartes pour les lumières, le climat, l’énergie, le multimédia, les caméras, les personnes et bien plus ; chacune s’utilise aussi seule dans un tableau de bord classique. Voir [Composants](docs/fr/components.md).
- **Partagé par défaut.** Un administrateur configure un tableau de bord pour tout le monde, et chaque personne peut recevoir sa propre disposition. Voir [Guide des fonctionnalités](docs/fr/features.md#tableau-de-bord-partagé).
- **Mode tablette murale.** Sept écrans de veille (horloge sur photo, tableau, minimal, analogique, à palettes, aurore boréale et nuit) avec aperçus et verrouillage facultatif par code PIN. Voir [Mode tablette murale](docs/fr/features.md#mode-tablette-murale).
- **Sauvegarde de la disposition.** Exportez et importez toute la disposition en JSON versionné. Voir [Sauvegarde de la disposition](docs/fr/features.md#sauvegarde-de-la-disposition).
- **En polonais, en anglais et en français.** Changez de langue à tout moment, sans rechargement ; une nouvelle langue s’ajoute avec un seul fichier JSON. Voir [Langue](docs/fr/configuration.md#langue).
- **Modes clair et sombre**, adapté au tactile, utilisable au clavier en mode édition, et respectueux de la réduction des animations.

## Composants

Quelques composants, tous affichés à la même taille. La liste complète avec les options se trouve dans [Composants](docs/fr/components.md).

<p align="center">
  <img src="docs/components/weather.webp" alt="Météo" width="24%">
  <img src="docs/components/ac.webp" alt="Climatisation" width="24%">
  <img src="docs/components/airq.webp" alt="Qualité de l’air" width="24%">
  <img src="docs/components/eprice.webp" alt="Prix de l’électricité" width="24%">
</p>
<p align="center">
  <img src="docs/components/players.webp" alt="Multimédia" width="24%">
  <img src="docs/components/rooms.webp" alt="Pièces" width="24%">
  <img src="docs/components/flow.webp" alt="Flux d’énergie" width="24%">
  <img src="docs/components/smartlock.webp" alt="Serrure connectée" width="24%">
</p>

## Installation rapide

1. Dans HACS, ouvrez le menu, choisissez *Dépôts personnalisés*, ajoutez `https://github.com/kczepiec/nuvio` avec la catégorie **Dashboard**, puis installez **Nuvio**.
2. Dans Home Assistant, allez dans Paramètres → Tableaux de bord → *Ajouter un tableau de bord* → *Nouveau tableau de bord à partir de zéro*, ouvrez-le, puis ⋮ → *Modifier* → ⋮ → *Éditeur de configuration brute* et collez :

   ```yaml
   strategy:
     type: custom:nuvio
   ```

3. Ouvrez le tableau de bord. L’assistant démarre à votre première visite.

L’installation manuelle et les modules complémentaires recommandés sont décrits dans [docs/fr/installation.md](docs/fr/installation.md).

## Configuration minimale

Nuvio fonctionne sans option. Un réglage facultatif définit la langue par défaut du tableau de bord ; un choix personnel dans les Paramètres reste prioritaire.

```yaml
strategy:
  type: custom:nuvio
  language: fr        # pl | en | fr …
```

Plus de détails dans [docs/fr/configuration.md](docs/fr/configuration.md).

## Documentation

| Page | Contenu |
|---|---|
| [Installation](docs/fr/installation.md) | HACS, installation manuelle et modules complémentaires |
| [Configuration](docs/fr/configuration.md) | Options de la stratégie, langue, préréglages |
| [Guide des fonctionnalités](docs/fr/features.md) | Tableau de bord partagé, mode tablette murale, sauvegarde de la disposition |
| [Composants](docs/fr/components.md) | Chaque carte, ses entités et ses options |
| [Feuille de route](docs/fr/roadmap.md) | Ce qui est prévu et ce qui est fait |
| [Journal des modifications](CHANGELOG.fr.md) | Notes de version de chaque version |
| [Développement](docs/fr/development.md) | Compilation, organisation des sources et publication |
| [Contribuer](CONTRIBUTING.md) | Signaler un bogue et proposer des modifications (en anglais) |
| [Règles de conception](DESIGN.md) | Les règles d’interface que suit chaque fonctionnalité (en anglais) |
| [Guide d’utilisation de la marque](assets/brand/guide/usage-guide.md) | Comment placer le logo Nuvio (en anglais) |

## Communauté

- Discord : [rejoindre](https://discord.gg/rFG9y2hFMJ) (aide, idées, journal des versions)
- Issues : [github.com/kczepiec/nuvio/issues](https://github.com/kczepiec/nuvio/issues)

## Licence et crédits

Nuvio est publié sous [licence MIT](LICENSE).

Ressources tierces incluses :
- [DM Sans](dist/nuvio-font-OFL.txt) : SIL Open Font License 1.1
- [Meteocons](dist/nuvio-meteo-LICENSE.txt) par Bas Milius, MIT
- [Photo de fond par défaut](dist/CREDITS.md) : « House in forest » par Flo Pappert, CC0 1.0 (via Wikimedia Commons)
