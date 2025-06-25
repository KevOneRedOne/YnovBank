# Tests de l'API YnovBank

Ce document explique comment exécuter les tests unitaires et d'intégration de l'API YnovBank.

## Structure des tests

```
tests/
├── setup.ts                     # Configuration globale des tests
├── unit/                        # Tests unitaires
│   ├── authService.test.ts      # Tests du service d'authentification
│   ├── accountService.test.ts   # Tests du service des comptes
│   ├── transactionService.test.ts # Tests du service des transactions
│   ├── authController.test.ts   # Tests du contrôleur d'authentification
│   ├── accountController.test.ts # Tests du contrôleur des comptes
│   ├── transactionController.test.ts # Tests du contrôleur des transactions
│   ├── authMiddleware.test.ts   # Tests du middleware d'authentification
│   └── validationMiddleware.test.ts # Tests du middleware de validation
└── integration/                 # Tests d'intégration
    └── api.test.ts             # Tests complets de l'API
```

## Configuration

Les tests utilisent Jest avec ts-jest pour le support TypeScript et Supertest pour les tests d'API.

### Configuration de la base de données

Les tests utilisent des bases de données SQLite séparées :
- Tests unitaires : base de données en mémoire avec mocks
- Tests d'intégration : `test.db` et `test-integration.db`

## Scripts disponibles

### Exécuter tous les tests
```bash
npm run test
```

### Exécuter les tests en mode watch
```bash
npm run test:watch
```

### Exécuter les tests avec rapport de couverture
```bash
npm run test:coverage
```

### Exécuter uniquement les tests unitaires
```bash
npm run test:unit
```

### Exécuter uniquement les tests d'intégration
```bash
npm run test:integration
```

## Types de tests

### Tests unitaires

Les tests unitaires vérifient le comportement de chaque composant individuellement :

- **Services** : Logique métier avec mocks de la base de données
- **Contrôleurs** : Gestion des requêtes HTTP avec mocks des services
- **Middlewares** : Validation, authentification et gestion des erreurs

### Tests d'intégration

Les tests d'intégration vérifient le bon fonctionnement de l'API complète :

- Flux complet d'inscription → connexion → opérations bancaires
- Intégration entre contrôleurs, services et base de données
- Validation des règles métier (soldes, autorisations, etc.)

## Couverture de tests

Les tests couvrent :

✅ **Authentification**
- Inscription d'utilisateurs
- Connexion avec validation des identifiants
- Protection par JWT
- Gestion des erreurs d'authentification

✅ **Gestion des comptes**
- Création de comptes bancaires
- Récupération des comptes utilisateur
- Vérification des soldes
- Désactivation de comptes

✅ **Transactions**
- Dépôts sur comptes
- Retraits avec vérification de solde
- Virements entre comptes
- Historique des transactions
- Annulation de transactions

✅ **Sécurité**
- Validation des données d'entrée
- Protection contre l'accès non autorisé
- Vérification des autorisations sur les comptes

✅ **Cas d'erreur**
- Soldes insuffisants
- Comptes inexistants
- Données invalides
- Utilisateurs non autorisés

## Exemples d'exécution

### Résultat attendu pour les tests unitaires
```bash
npm run test:unit

PASS tests/unit/authService.test.ts
PASS tests/unit/accountService.test.ts
PASS tests/unit/transactionService.test.ts
PASS tests/unit/authController.test.ts
PASS tests/unit/accountController.test.ts
PASS tests/unit/transactionController.test.ts
PASS tests/unit/authMiddleware.test.ts
PASS tests/unit/validationMiddleware.test.ts

Test Suites: 8 passed, 8 total
Tests:       XX passed, XX total
```

### Résultat attendu pour les tests d'intégration
```bash
npm run test:integration

PASS tests/integration/api.test.ts
  API Integration Tests
    Flux complet d'authentification et opérations bancaires
      ✓ devrait permettre l'inscription d'un nouvel utilisateur
      ✓ devrait permettre la connexion avec les identifiants corrects
      ✓ devrait permettre d'accéder au profil avec un token valide
      ✓ devrait permettre de créer un compte bancaire
      ✓ devrait permettre de récupérer tous les comptes de l'utilisateur
      ✓ devrait permettre d'effectuer un dépôt
      ✓ devrait permettre d'effectuer un retrait
      ✓ devrait permettre d'effectuer un virement entre comptes
      ✓ devrait empêcher le retrait si le solde est insuffisant
      ✓ devrait empêcher l'accès aux ressources sans authentification

Test Suites: 1 passed, 1 total
Tests:       XX passed, XX total
```

## Debugging des tests

### Variables d'environnement pour les tests
```bash
# Optionnel : activer les logs détaillés
DEBUG=1 npm run test

# Optionnel : utiliser une base de données spécifique
DATABASE_URL=file:./custom-test.db npm run test
```

### Exécuter un test spécifique
```bash
# Test d'un fichier spécifique
npm test -- authService.test.ts

# Test d'une suite spécifique
npm test -- --testNamePattern="AuthService"

# Test en mode verbose
npm test -- --verbose
```

## Maintenance des tests

### Nettoyer les bases de données de test
```bash
rm -f prisma/test*.db
```

### Mise à jour des tests après modification du schéma
1. Mettre à jour les mocks dans les tests unitaires
2. Vérifier les tests d'intégration
3. Exécuter la suite complète : `npm run test:coverage`

## Métriques de qualité

Objectifs de couverture :
- **Lignes** : > 90%
- **Fonctions** : > 95%
- **Branches** : > 85%
- **Statements** : > 90%

Pour voir le rapport détaillé :
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```
