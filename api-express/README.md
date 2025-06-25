# YnovBank API - TypeScript

API REST complète pour une application bancaire développée avec Express.js et TypeScript. Cette API gère l'authentification des utilisateurs, la gestion des comptes bancaires et les transactions financières.

## 🚀 Fonctionnalités

### 🔐 Authentification
- ✅ Inscription d'utilisateurs avec validation
- ✅ Connexion avec JWT
- ✅ Middleware de protection des routes

### 🏦 Gestion des comptes bancaires
- ✅ Création de comptes (Courant, Épargne, Professionnel)
- ✅ Consultation des comptes
- ✅ Génération automatique de numéros de compte

### 💸 Transactions
- ✅ **Dépôts** - Ajout de fonds sur un compte
- ✅ **Retraits** - Retrait de fonds d'un compte
- ✅ **Virements** - Transfert entre comptes
- ✅ Historique des transactions avec pagination
- ✅ Génération de références uniques

### 🛠️ Technologies
- **Node.js** avec **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM pour base de données
- **SQLite** - Base de données (développement)
- **JWT** - Authentification
- **Joi** - Validation des données
- **Swagger** - Documentation API
- **bcryptjs** - Hashage des mots de passe

## 📋 Endpoints disponibles

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur

### Comptes bancaires
- `GET /api/accounts` - Liste des comptes
- `POST /api/accounts` - Créer un compte
- `GET /api/accounts/:id` - Détails d'un compte

### Transactions
- `GET /api/transactions` - Historique des transactions
- `POST /api/transactions/deposit` - Effectuer un dépôt
- `POST /api/transactions/withdrawal` - Effectuer un retrait
- `POST /api/transactions/transfer` - Effectuer un virement

### Documentation
- `GET /api-docs` - Documentation Swagger interactive

## 🛠️ Installation et lancement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

### Configuration de la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev
```

### Variables d'environnement
Créez un fichier `.env` :
```env
PORT=3000
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_en_production
JWT_EXPIRES_IN=24h
DATABASE_URL="file:./dev.db"
```

### Démarrage

#### Mode développement
```bash
npm run dev
```

#### Mode production
```bash
# Compilation TypeScript
npm run build

# Démarrage
npm start
```

### Accès à l'API
- API : http://localhost:3000
- Documentation Swagger : http://localhost:3000/api-docs

## 📚 Exemples d'utilisation

### Inscription d'un utilisateur
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "motdepasse123",
    "name": "John Doe"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "motdepasse123"
  }'
```

### Création d'un compte bancaire
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "CHECKING",
    "initialBalance": 1000.00
  }'
```

### Effectuer un dépôt
```bash
curl -X POST http://localhost:3000/api/transactions/deposit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "amount": 500.00,
    "description": "Dépôt initial"
  }'
```

### Effectuer un virement
```bash
curl -X POST http://localhost:3000/api/transactions/transfer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": 1,
    "toAccountNumber": "ACC123456789",
    "amount": 300.00,
    "description": "Transfert vers épargne"
  }'
```

## 🏗️ Structure du projet

```
src/
├── config/
│   └── database.ts          # Configuration Prisma
├── controllers/
│   ├── authController.ts    # Contrôleur authentification
│   ├── accountController.ts # Contrôleur comptes
│   └── transactionController.ts # Contrôleur transactions
├── middleware/
│   ├── auth.ts              # Middleware authentification
│   └── validation.ts        # Validation des données
├── routes/
│   ├── auth.ts              # Routes authentification
│   ├── accounts.ts          # Routes comptes
│   └── transactions.ts      # Routes transactions
├── services/
│   ├── authService.ts       # Service authentification
│   ├── accountService.ts    # Service comptes
│   └── transactionService.ts # Service transactions
├── types/
│   └── index.ts             # Types TypeScript
└── server.ts                # Point d'entrée
```

## 📊 Modèle de données

### Utilisateur (User)
- id, email, password, name, phone, address
- dateOfBirth, isActive, role, createdAt, updatedAt

### Compte (Account)
- id, accountNumber, accountType, balance
- isActive, userId, createdAt, updatedAt

### Transaction
- id, amount, type, status, description, reference
- fromAccountId, toAccountId, userId, createdAt, updatedAt

## 🔒 Sécurité

- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **Helmet** pour la sécurité des en-têtes HTTP
- **Rate limiting** pour prévenir les attaques par déni de service (100 req/15min)
- **CORS** configuré
- **Validation** stricte des données d'entrée avec Joi

## 🛠️ Scripts disponibles

- `npm run dev` - Démarrage en mode développement avec TypeScript
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en mode production
- `npm run prisma:generate` - Génération du client Prisma
- `npm run prisma:migrate` - Application des migrations
- `npm run prisma:studio` - Interface graphique Prisma Studio

## 🏛️ Architecture

L'API suit une architecture en couches pour une meilleure séparation des responsabilités :

1. **Routes** - Définition des endpoints et application des middlewares
2. **Controllers** - Logique de contrôle, validation et formatage des réponses
3. **Services** - Logique métier et règles de gestion
4. **Prisma/Database** - Accès aux données et requêtes ORM

Cette séparation permet une meilleure testabilité, maintenabilité et évolutivité du code.

## 📖 Documentation API

La documentation complète de l'API est disponible via Swagger UI à l'adresse :
http://localhost:3000/api-docs

Cette interface permet de :
- Visualiser tous les endpoints disponibles
- Tester les requêtes directement depuis l'interface
- Voir les schémas de données et exemples
- Comprendre les codes de réponse et formats attendus

## ✅ Tests et validation

Toutes les fonctionnalités ont été testées :
- ✅ Inscription et connexion d'utilisateurs
- ✅ Création de comptes bancaires multiples
- ✅ Dépôts et retraits avec mise à jour des soldes
- ✅ Virements entre comptes
- ✅ Historique des transactions avec pagination
- ✅ Validation des données et gestion d'erreurs
- ✅ Authentification JWT et protection des routes
