"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class AccountService {
    /**
     * Créer un nouveau compte bancaire
     */
    static async createAccount(userId, accountData) {
        // Générer un numéro de compte unique
        const accountNumber = this.generateAccountNumber();
        const account = await database_1.default.account.create({
            data: {
                accountNumber,
                accountType: accountData.accountType || 'CHECKING',
                balance: accountData.initialBalance || 0,
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
        return account;
    }
    /**
     * Obtenir tous les comptes d'un utilisateur
     */
    static async getUserAccounts(userId) {
        const accounts = await database_1.default.account.findMany({
            where: {
                userId: userId,
                isActive: true
            },
            include: {
                _count: {
                    select: {
                        transactionsFrom: true,
                        transactionsTo: true
                    }
                }
            }
        });
        return accounts;
    }
    /**
     * Obtenir un compte par son ID
     */
    static async getAccountById(accountId, userId) {
        const where = { id: accountId };
        if (userId) {
            where.userId = userId;
        }
        const account = await database_1.default.account.findUnique({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
        if (!account) {
            throw new Error('Compte non trouvé');
        }
        return account;
    }
    /**
     * Obtenir un compte par son numéro
     */
    static async getAccountByNumber(accountNumber) {
        const account = await database_1.default.account.findUnique({
            where: { accountNumber },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
        if (!account) {
            throw new Error('Compte non trouvé');
        }
        return account;
    }
    /**
     * Mettre à jour le solde d'un compte
     */
    static async updateBalance(accountId, newBalance) {
        const account = await database_1.default.account.update({
            where: { id: accountId },
            data: { balance: newBalance }
        });
        return account;
    }
    /**
     * Désactiver un compte
     */
    static async deactivateAccount(accountId, userId) {
        const account = await database_1.default.account.update({
            where: {
                id: accountId,
                userId: userId
            },
            data: { isActive: false }
        });
        return account;
    }
    /**
     * Obtenir le solde d'un compte
     */
    static async getAccountBalance(accountId, userId) {
        const account = await database_1.default.account.findUnique({
            where: {
                id: accountId,
                userId: userId
            },
            select: {
                balance: true,
                accountNumber: true,
                accountType: true
            }
        });
        if (!account) {
            throw new Error('Compte non trouvé');
        }
        return {
            balance: Number(account.balance),
            accountNumber: account.accountNumber,
            accountType: account.accountType
        };
    }
    /**
     * Générer un numéro de compte unique
     */
    static generateAccountNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ACC${timestamp.slice(-8)}${random}`;
    }
    /**
     * Vérifier si un utilisateur possède un compte
     */
    static async userOwnsAccount(userId, accountId) {
        const account = await database_1.default.account.findFirst({
            where: {
                id: accountId,
                userId: userId
            }
        });
        return !!account;
    }
}
exports.default = AccountService;
//# sourceMappingURL=accountService.js.map