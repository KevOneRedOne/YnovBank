"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
// Gestion de la déconnexion propre
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
exports.default = prisma;
//# sourceMappingURL=database.js.map