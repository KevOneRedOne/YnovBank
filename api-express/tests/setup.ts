import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db'
    }
  }
});

beforeAll(async () => {
  try {
    // Vérifier et nettoyer les tables dans l'ordre inverse des dépendances
    await prisma.transaction.deleteMany().catch(() => {});
    await prisma.account.deleteMany().catch(() => {});
    await prisma.user.deleteMany().catch(() => {});
  } catch (error) {
    // Les tables n'existent peut-être pas encore, on ignore l'erreur
    console.log('Initialisation de la base de données de test...');
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
