"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const accountService_1 = __importDefault(require("./accountService"));
class TransactionService {
    /**
     * Effectuer un dépôt
     */
    static async deposit(userId, accountId, amount, description = '') {
        // Vérifier que l'utilisateur possède le compte
        const userOwnsAccount = await accountService_1.default.userOwnsAccount(userId, accountId);
        if (!userOwnsAccount) {
            throw new Error('Compte non autorisé');
        }
        // Obtenir le compte
        const account = await accountService_1.default.getAccountById(accountId);
        // Créer la transaction dans une transaction de base de données
        const result = await database_1.default.$transaction(async (tx) => {
            // Créer la transaction
            const transaction = await tx.transaction.create({
                data: {
                    amount: new library_1.Decimal(amount),
                    type: 'DEPOSIT',
                    status: 'COMPLETED',
                    description: description || `Dépôt sur le compte ${account.accountNumber}`,
                    toAccountId: accountId,
                    userId: userId
                }
            });
            // Mettre à jour le solde
            const newBalance = account.balance.add(new library_1.Decimal(amount));
            await tx.account.update({
                where: { id: accountId },
                data: { balance: newBalance }
            });
            return transaction;
        });
        return result;
    }
    /**
     * Effectuer un retrait
     */
    static async withdrawal(userId, accountId, amount, description = '') {
        // Vérifier que l'utilisateur possède le compte
        const userOwnsAccount = await accountService_1.default.userOwnsAccount(userId, accountId);
        if (!userOwnsAccount) {
            throw new Error('Compte non autorisé');
        }
        // Obtenir le compte
        const account = await accountService_1.default.getAccountById(accountId);
        // Vérifier le solde suffisant
        if (account.balance.lt(new library_1.Decimal(amount))) {
            throw new Error('Solde insuffisant');
        }
        // Créer la transaction dans une transaction de base de données
        const result = await database_1.default.$transaction(async (tx) => {
            // Créer la transaction
            const transaction = await tx.transaction.create({
                data: {
                    amount: new library_1.Decimal(amount),
                    type: 'WITHDRAWAL',
                    status: 'COMPLETED',
                    description: description || `Retrait du compte ${account.accountNumber}`,
                    fromAccountId: accountId,
                    userId: userId
                }
            });
            // Mettre à jour le solde
            const newBalance = account.balance.sub(new library_1.Decimal(amount));
            await tx.account.update({
                where: { id: accountId },
                data: { balance: newBalance }
            });
            return transaction;
        });
        return result;
    }
    /**
     * Effectuer un virement entre comptes
     */
    static async transfer(userId, fromAccountId, toAccountNumber, amount, description = '') {
        // Vérifier que l'utilisateur possède le compte source
        const userOwnsAccount = await accountService_1.default.userOwnsAccount(userId, fromAccountId);
        if (!userOwnsAccount) {
            throw new Error('Compte source non autorisé');
        }
        // Obtenir les comptes
        const fromAccount = await accountService_1.default.getAccountById(fromAccountId);
        const toAccount = await accountService_1.default.getAccountByNumber(toAccountNumber);
        // Vérifier le solde suffisant
        if (fromAccount.balance.lt(new library_1.Decimal(amount))) {
            throw new Error('Solde insuffisant');
        }
        // Vérifier que les comptes sont différents
        if (fromAccount.id === toAccount.id) {
            throw new Error('Impossible de transférer vers le même compte');
        }
        // Créer la transaction dans une transaction de base de données
        const result = await database_1.default.$transaction(async (tx) => {
            // Créer la transaction
            const transaction = await tx.transaction.create({
                data: {
                    amount: new library_1.Decimal(amount),
                    type: 'TRANSFER',
                    status: 'COMPLETED',
                    description: description || `Virement vers ${toAccount.accountNumber}`,
                    fromAccountId: fromAccountId,
                    toAccountId: toAccount.id,
                    userId: userId
                }
            });
            // Mettre à jour le solde du compte source
            const newFromBalance = fromAccount.balance.sub(new library_1.Decimal(amount));
            await tx.account.update({
                where: { id: fromAccountId },
                data: { balance: newFromBalance }
            });
            // Mettre à jour le solde du compte destination
            const newToBalance = toAccount.balance.add(new library_1.Decimal(amount));
            await tx.account.update({
                where: { id: toAccount.id },
                data: { balance: newToBalance }
            });
            return transaction;
        });
        return result;
    }
    /**
     * Obtenir l'historique des transactions d'un utilisateur
     */
    static async getUserTransactions(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const transactions = await database_1.default.transaction.findMany({
            where: { userId },
            include: {
                fromAccount: {
                    select: {
                        accountNumber: true,
                        accountType: true
                    }
                },
                toAccount: {
                    select: {
                        accountNumber: true,
                        accountType: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        const total = await database_1.default.transaction.count({
            where: { userId }
        });
        return {
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    /**
     * Obtenir les transactions d'un compte spécifique
     */
    static async getAccountTransactions(userId, accountId, page = 1, limit = 10) {
        // Vérifier que l'utilisateur possède le compte
        const userOwnsAccount = await accountService_1.default.userOwnsAccount(userId, accountId);
        if (!userOwnsAccount) {
            throw new Error('Compte non autorisé');
        }
        const skip = (page - 1) * limit;
        const transactions = await database_1.default.transaction.findMany({
            where: {
                OR: [
                    { fromAccountId: accountId },
                    { toAccountId: accountId }
                ]
            },
            include: {
                fromAccount: {
                    select: {
                        accountNumber: true,
                        accountType: true
                    }
                },
                toAccount: {
                    select: {
                        accountNumber: true,
                        accountType: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });
        const total = await database_1.default.transaction.count({
            where: {
                OR: [
                    { fromAccountId: accountId },
                    { toAccountId: accountId }
                ]
            }
        });
        return {
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    /**
     * Obtenir une transaction par ID
     */
    static async getTransactionById(transactionId, userId) {
        const transaction = await database_1.default.transaction.findUnique({
            where: {
                id: transactionId,
                userId: userId
            },
            include: {
                fromAccount: {
                    select: {
                        accountNumber: true,
                        accountType: true
                    }
                },
                toAccount: {
                    select: {
                        accountNumber: true,
                        accountType: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        if (!transaction) {
            throw new Error('Transaction non trouvée');
        }
        return transaction;
    }
    /**
     * Annuler une transaction (si possible)
     */
    static async cancelTransaction(transactionId, userId) {
        const transaction = await this.getTransactionById(transactionId, userId);
        if (transaction.status !== 'PENDING') {
            throw new Error('Seules les transactions en attente peuvent être annulées');
        }
        const cancelledTransaction = await database_1.default.transaction.update({
            where: { id: transactionId },
            data: { status: 'CANCELLED' }
        });
        return cancelledTransaction;
    }
}
exports.default = TransactionService;
//# sourceMappingURL=transactionService.js.map