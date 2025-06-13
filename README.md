# YnovBank

## Description du projet
YnovBank est une plateforme bancaire simple permettant aux utilisateurs de se connecter et d'effectuer des virements. Ce projet est développé avec une pipeline CI/CD automatisée sur GitLab, en utilisant Gitflow pour la gestion des branches et semantic-release pour le versionnement.

## Spécifications techniques

### Stack technique
- **Backend** : Node.js/Express (API REST)
- **Frontend** : HTML/CSS/JavaScript statique
- **Base de données** : SQLite
- **Tests** : Jest pour tests unitaires et d'intégration

### DevOps
- **Workflow Git** : GitFlow avec protection des branches main et develop
  - Pull requests obligatoires pour les modifications
  - Branches protégées nécessitant des approbations
- **CI/CD** : GitHub Actions avec les workflows suivants :
  - **Build and Push** :
    - Installation des dépendances (Node.js et Go)
    - Tests unitaires pour l'API et l'application
    - Build de l'application
  - **Semantic Release** :
    - Versionnement automatique pour l'API et l'application
    - Génération des changelogs
    - Création des tags de version
  - **Create Release** :
    - Création automatique des releases GitHub
    - Génération des notes de release avec les changements récents
  - **Increment Versions** :
    - Incrémentation automatique des versions pour l'API et l'application
- **Versionnement** : semantic-release avec Conventional Commits
- **Déploiement** :
  - Staging (develop branch) : Render ou fly.io
  - Production (master branch) : Render ou fly.io
- **Notifications** : Emails envoyés à notif-cicd@joelkoussawo.me

## Livrables
- Lien vers le repo Git avec README complet présentant le projet
- Démo (26 Juin)
- Rapport (26 Juin) à envoyer à formation@joelkoussawo.me

## Contenu du rapport
- Contexte
- CI/CD
- Contenu du fichier .gitlab-ci.yaml
- Lien vers repo Git public
- Documentation du projet (Code, Dockerfile, Explications)

# API

## Prérequis
- Go 1.21 ou supérieur
- Docker (optionnel)

## Installation et Démarrage

### Développement Local
```bash
# Cloner le repository
git clone https://github.com/kevoneredone/YnovBank.git
cd YnovBank/api

# Installer les dépendances
go mod tidy

# Lancer l'API en mode développement
go run main.go
```

### Production

#### Build et Exécution Native
```bash
# Build pour Windows
go build -o gin-api.exe

# Build pour Linux/MacOS
go build -o gin-api

# Exécution
# Windows
./gin-api.exe
# Linux/MacOS
./gin-api
```

#### Utilisation avec Docker
```bash
# Build de l'image Docker
docker build -t gin-api .

# Exécution du conteneur
docker run -p 8080:8080 gin-api
```

## Documentation
La documentation de l'API est disponible dans le dossier `docs/`. Elle inclut :
- Les endpoints disponibles
- Les modèles de données
- Les exemples de requêtes

## Tests
```bash
# Exécuter tous les tests
go test ./...

# Exécuter les tests avec couverture
go test ./... -cover
```

