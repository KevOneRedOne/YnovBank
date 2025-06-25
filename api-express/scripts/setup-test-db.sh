#!/bin/bash

# Script d'initialisation des bases de données de test

echo "🔧 Initialisation des bases de données de test..."

# Supprimer les anciennes bases de données de test
rm -f test.db test-integration.db

# Créer les bases de données de test avec les migrations
echo "📦 Création de la base de données de test unitaire..."
DATABASE_URL="file:./test.db" npx prisma migrate deploy

echo "📦 Création de la base de données de test d'intégration..."
DATABASE_URL="file:./test-integration.db" npx prisma migrate deploy

echo "✅ Bases de données de test créées avec succès!"
echo "🧪 Vous pouvez maintenant exécuter les tests avec: npm test"
