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
- **Workflow Git** : GitFlow avec règle de MR (minimum 2 personnes pour approuver une merge request)
- **Conteneurisation** : Dockerfile
- **Artifact** : Docker Hub ou GitLab Registry
- **CI/CD** : GitLab CI avec stages build, test, artefact, release, deploy
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
## lancer l'api en dev 
go run main.go
## Faire un build (sur windows) : 
go build -o gin-api.exe
## Lancer l'api en prod (sur windows) :
./gin-api.exe
## Faire un build (sur linux) : 
go build -o gin-api
## Lancer l'api en prod (sur linux)
./gin-api
## Lancer avec Docker 
docker build -t gin-api .
docker run -p 8080:8080 gin-api

