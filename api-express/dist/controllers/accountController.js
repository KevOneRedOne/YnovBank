"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const accountService_1 = __importDefault(require("../services/accountService"));
const createAccountSchema = joi_1.default.object({
    accountType: joi_1.default.string().valid('CHECKING', 'SAVINGS', 'BUSINESS').default('CHECKING'),
    initialBalance: joi_1.default.number().min(0).default(0)
});
class AccountController {
    /**
     * Créer un nouveau compte bancaire
     */
    static async createAccount(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const { error, value } = createAccountSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: error.details.map(detail => detail.message)
                });
                return;
            }
            const accountData = value;
            const account = await accountService_1.default.createAccount(req.user.id, accountData);
            res.status(201).json({
                success: true,
                message: 'Compte créé avec succès',
                account
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors de la création du compte'
            });
        }
    }
    /**
     * Obtenir tous les comptes de l'utilisateur
     */
    static async getUserAccounts(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const accounts = await accountService_1.default.getUserAccounts(req.user.id);
            res.json({
                success: true,
                accounts
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors de la récupération des comptes'
            });
        }
    }
    /**
     * Obtenir un compte par ID
     */
    static async getAccountById(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const accountId = parseInt(req.params.id);
            if (isNaN(accountId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de compte invalide'
                });
                return;
            }
            const account = await accountService_1.default.getAccountById(accountId, req.user.id);
            res.json({
                success: true,
                account
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Compte non trouvé'
            });
        }
    }
    /**
     * Obtenir le solde d'un compte
     */
    static async getAccountBalance(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const accountId = parseInt(req.params.id);
            if (isNaN(accountId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de compte invalide'
                });
                return;
            }
            const accountBalance = await accountService_1.default.getAccountBalance(accountId, req.user.id);
            res.json({
                success: true,
                ...accountBalance
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Compte non trouvé'
            });
        }
    }
    /**
     * Désactiver un compte
     */
    static async deactivateAccount(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const accountId = parseInt(req.params.id);
            if (isNaN(accountId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de compte invalide'
                });
                return;
            }
            const account = await accountService_1.default.deactivateAccount(accountId, req.user.id);
            res.json({
                success: true,
                message: 'Compte désactivé avec succès',
                account
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Compte non trouvé'
            });
        }
    }
}
exports.default = AccountController;
//# sourceMappingURL=accountController.js.map