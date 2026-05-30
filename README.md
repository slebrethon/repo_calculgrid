# Jeu de Calcul - Documentation Technique

## Description du Projet

Ce projet est un jeu de calcul mental appelé "calculGRID". Le joueur dispose de 2 minutes pour atteindre une somme demandée en utilisant une grille de chiffres. Le jeu est développé en HTML, CSS et JavaScript, avec une interface responsive utilisant Bootstrap.

**url CACULGRID** - https://slebrethon.github.io/repo_calculgrid/

## Technologies Utilisées

- **Frontend** :
  - HTML5
  - CSS3 (avec Bootstrap 5 pour la mise en page)
  - JavaScript (ES6+)
  - FontAwesome pour les icônes

- **Stockage** :
  - LocalStorage pour les scores locaux
  - JSON pour les données statiques
  - PHP pour la sauvegarde des scores côté serveur (optionnel)

- **Internationalisation** :
  - Support multilingue (Français, Anglais, Espagnol, Italien, Portugais)

- **Audio** :
  - Sons d'effets et musique de fond

## Structure des Fichiers

```
/
├── game_grid.html          # Page principale du jeu
├── game_index.html         # Page d'accueil
├── game_params.html        # Page des paramètres
├── game_score.html         # Page des scores/classement
├── game_tuto.html          # Page du tutoriel
├── style.css               # Styles CSS globaux
├── assets/                 # Ressources statiques
│   ├── font/               # Polices personnalisées
│   └── sound/              # Fichiers audio
├── css/                    # Styles spécifiques par page
│   ├── css_font-google.css
│   ├── css_game-grid.css
│   ├── css_game-index.css
│   ├── css_game-params.css
│   └── css_game-tuto.css
├── dist_bootstrap/         # Framework Bootstrap
├── scripts/                # Scripts JavaScript
│   ├── js_grid.js          # Logique du jeu principal
│   ├── js_include.js       # Chargement dynamique des scripts
│   ├── js_langchoice.js    # Gestion des langues
│   ├── js_params.js        # Paramètres du jeu
│   ├── js_routes.js        # Navigation entre pages
│   ├── js_scores.js        # Gestion des scores
│   ├── js_tuto.js          # Tutoriel
│   ├── json_scores.json    # Données de scores exemple
│   ├── php_getscores.php   # Récupération des scores (serveur)
│   ├── php_savescores.php  # Sauvegarde des scores (serveur)
│   └── i18n/               # Fichiers de traduction
│       ├── fr.js
│       ├── uk.js
│       ├── es.js
│       ├── it.js
│       └── pt.js
└── js_fontawesome/         # Bibliothèque FontAwesome
```

## Fonctionnalités Principales

### Jeu Principal (game_grid.html)

- Grille de chiffres générée aléatoirement
- Timer de 2 minutes
- Calcul de sommes à atteindre
- Système de niveaux
- Validation des sélections
- Réduction du temps selon les performances

### Gestion des Scores

- Stockage local des scores avec date et niveau
- Affichage du classement
- Possibilité de vider les scores
- Sauvegarde côté serveur via PHP (optionnel)

### Paramètres (game_params.html)

- Choix de la langue
- Activation/désactivation des sons
- Musique de fond

### Tutoriel (game_tuto.html)

- Explication des règles du jeu
- Guide pas à pas

### Internationalisation

- 5 langues supportées
- Traductions complètes de l'interface

## Système de Progression et Difficultés

### Chiffres Disponibles par Niveau

Le système de difficulté s'ajuste par l'ajout progressif de chiffres à la grille selon le niveau du joueur :

| Niveau | Chiffres Disponibles         |
| ------ | ---------------------------- |
| 1      | 0, 1, 2                      |
| 2      | 0, 1, 2, 3                   |
| 3      | 0, 1, 2, 3, 4                |
| 4      | 0, 1, 2, 3, 4, 5             |
| 5      | 0, 1, 2, 3, 4, 5, 6          |
| 6      | 0, 1, 2, 3, 4, 5, 6, 7       |
| 7      | 0, 1, 2, 3, 4, 5, 6, 7, 8    |
| 8      | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| 9+     | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 |

### Plages de Sommes Cibles par Niveau

La somme à atteindre s'adapte aussi selon le niveau pour maintenir une difficulté cohérente :

| Niveau | Plage de Sommes |
| ------ | --------------- |
| 1 à 2  | 1 à 10          |
| 3 à 5  | 1 à 40          |
| 6 à 8  | 1 à 60          |
| 9+     | 1 à 99          |

Cette progression permet aux joueurs de débuter avec un défi maîtrisable (peu de chiffres disponibles et sommes basses) et d'augmenter graduellement la complexité en gagnant des niveaux.

## Installation et Lancement

1. **Prérequis** :
   - Navigateur web moderne (Chrome, Firefox, Edge, etc.)
   - Serveur web local (Apache, Nginx) si utilisation des scripts PHP

2. **Installation** :
   - Cloner ou télécharger le projet
   - Ouvrir `game_index.html` dans un navigateur

3. **Pour les scores côté serveur** :
   - Configurer un serveur PHP
   - Placer les fichiers dans le répertoire web
   - S'assurer que `php_getscores.php` et `php_savescores.php` sont accessibles

## Architecture Technique

### Chargement des Scripts

- `js_include.js` gère le chargement dynamique des scripts selon la page
- Scripts communs chargés en premier (langues, routes, Bootstrap)
- Scripts spécifiques chargés ensuite

### Gestion des Langues

- Fichiers JSON pour chaque langue
- Fonction de traduction automatique via `data-i18n` attributes
- Changement de langue sans rechargement de page

### Stockage des Données

- **Local** : localStorage pour scores persistants côté client
- **Serveur** : Scripts PHP pour sauvegarde centralisée (si configuré)

### Responsive Design

- Utilisation de Bootstrap Grid
- Breakpoints adaptés pour mobile et desktop
- Interface optimisée pour viewport de 430px minimum

## API et Fonctions Clés

### JavaScript

- `loadScores()` : Charge et affiche les scores
- `clearScores()` : Vide le tableau des scores
- `goToMenu()` : Navigation vers le menu principal
- `changeLanguage(lang)` : Change la langue de l'interface

### PHP (optionnel)

- `php_getscores.php` : Récupère les scores depuis la base de données
- `php_savescores.php` : Sauvegarde un nouveau score

## Dépendances

- **Bootstrap 5.3** : Framework CSS
- **FontAwesome 6** : Icônes
- **Google Fonts** : Polices (si utilisées)

## Navigateurs Supportés

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Développement

### Ajout d'une Nouvelle Langue

1. Créer un fichier `xx.js` dans `scripts/i18n/`
2. Ajouter les traductions pour toutes les clés existantes
3. Mettre à jour `js_include.js` pour charger le nouveau fichier
4. Ajouter l'option dans `game_params.html`

### Modification du Jeu

- `js_grid.js` contient la logique principale
- Variables globales pour la configuration du jeu
- Événements pour les interactions utilisateur

## Maintenance

### Mise à Jour des Dépendances

- Télécharger les dernières versions de Bootstrap et FontAwesome
- Tester la compatibilité avec les navigateurs cibles

### Sauvegarde des Scores

- Les scores locaux sont dans localStorage
- Pour une sauvegarde persistante, utiliser les scripts PHP
- Considérer une base de données pour de gros volumes

## Problèmes Connus

- Les scores sont stockés localement uniquement par défaut
- Nécessite un serveur pour la fonctionnalité PHP
- Pas de validation côté serveur pour les scores (risque de triche)

## Améliorations Futures

- Accentuer le système de niveau
- Mise en place de nouveau système de jeu

---

_Dernière mise à jour : 3 mai 2026_</content>
<parameter name="filePath">d:\fichier_PROJET\proto_CALCUL\fichier_HTML\README.md
