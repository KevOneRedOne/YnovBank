# Utiliser l'image officielle Node.js LTS (Long Term Support)
FROM node:24-alpine AS base

# Installer des dépendances système nécessaires pour Prisma et SQLite
RUN apk add --no-cache \
    sqlite \
    openssl \
    ca-certificates

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Étape de construction
FROM base AS builder

# Installer toutes les dépendances (dev + prod)
RUN npm ci --only=production=false

# Générer le client Prisma
RUN npx prisma generate

# Compiler le TypeScript
RUN npm run build

# Étape de production
FROM base AS production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Installer seulement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Copier le client Prisma généré depuis l'étape builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copier le code compilé
COPY --from=builder /app/dist ./dist

# Copier les fichiers prisma pour les migrations
COPY --from=builder /app/prisma ./prisma

# Copier les scripts nécessaires
COPY scripts ./scripts

# Rendre le script d'entrée exécutable
RUN chmod +x ./scripts/docker-entrypoint.sh

# Créer le répertoire pour la base de données et définir les permissions
RUN mkdir -p /app/data && \
    chown -R nodeuser:nodejs /app

# Changer vers l'utilisateur non-root
USER nodeuser

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:./data/prod.db"

# Commande de santé pour vérifier que l'API fonctionne
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Script de démarrage
CMD ["./scripts/docker-entrypoint.sh"]
