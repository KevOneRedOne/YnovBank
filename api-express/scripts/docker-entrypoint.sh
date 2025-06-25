#!/bin/sh

# Script d'entrée Docker pour l'API YnovBank
# Ce script gère le démarrage de l'application en production

set -e

echo "🐳 Démarrage de l'API YnovBank..."

# Vérifier que NODE_ENV est défini
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

echo "📍 Environnement: $NODE_ENV"

# Vérifier la présence de la base de données
if [ ! -f "./data/prod.db" ] && [ "$NODE_ENV" = "production" ]; then
    echo "📁 Création du répertoire de base de données..."
    mkdir -p ./data
fi

# Appliquer les migrations Prisma
echo "🔄 Application des migrations Prisma..."
npx prisma migrate deploy

# Générer le client Prisma (au cas où)
echo "⚡ Génération du client Prisma..."
npx prisma generate

# Vérifier la santé de la base de données
echo "🔍 Vérification de la base de données..."
if ! npx prisma db execute --command "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ Erreur: Impossible de se connecter à la base de données"
    exit 1
fi

echo "✅ Base de données prête"

# Démarrer l'application
echo "🚀 Démarrage de l'application..."
exec node dist/server.js
