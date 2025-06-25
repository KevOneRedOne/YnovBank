"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const transactionService_1 = __importDefault(require("../services/transactionService"));
// Validation schemas
const depositSchema = joi_1.default.object({
    accountId: joi_1.default.number().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().optional()
});
const withdrawalSchema = joi_1.default.object({
    accountId: joi_1.default.number().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().optional()
});
const transferSchema = joi_1.default.object({
    fromAccountId: joi_1.default.number().required(),
    toAccountNumber: joi_1.default.string().required(),
    amount: joi_1.default.number().positive().required(),
    description: joi_1.default.string().optional()
});
class TransactionController {
    /**
     * Effectuer un dépôt
     */
    static async deposit(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const { error, value } = depositSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: error.details.map(detail => detail.message)
                });
                return;
            }
            const { accountId, amount, description } = value;
            const transaction = await transactionService_1.default.deposit(req.user.id, accountId, amount, description);
            res.status(201).json({
                success: true,
                message: 'Dépôt effectué avec succès',
                transaction
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors du dépôt'
            });
        }
    }
    /**
     * Effectuer un retrait
     */
    static async withdrawal(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const { error, value } = withdrawalSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: error.details.map(detail => detail.message)
                });
                return;
            }
            const { accountId, amount, description } = value;
            const transaction = await transactionService_1.default.withdrawal(req.user.id, accountId, amount, description);
            res.status(201).json({
                success: true,
                message: 'Retrait effectué avec succès',
                transaction
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors du retrait'
            });
        }
    }
    /**
     * Effectuer un virement
     */
    static async transfer(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const { error, value } = transferSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Données invalides',
                    errors: error.details.map(detail => detail.message)
                });
                return;
            }
            const { fromAccountId, toAccountNumber, amount, description } = value;
            const transaction = await transactionService_1.default.transfer(req.user.id, fromAccountId, toAccountNumber, amount, description);
            res.status(201).json({
                success: true,
                message: 'Virement effectué avec succès',
                transaction
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors du virement'
            });
        }
    }
    /**
     * Obtenir l'historique des transactions
     */
    static async getUserTransactions(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await transactionService_1.default.getUserTransactions(req.user.id, page, limit);
            res.json({
                success: true,
                transactions: result.data,
                pagination: result.pagination
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors de la récupération des transactions'
            });
        }
    }
    /**
     * Obtenir les transactions d'un compte
     */
    static async getAccountTransactions(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const accountId = parseInt(req.params.accountId);
            if (isNaN(accountId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de compte invalide'
                });
                return;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await transactionService_1.default.getAccountTransactions(req.user.id, accountId, page, limit);
            res.json({
                success: true,
                transactions: result.data,
                pagination: result.pagination
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors de la récupération des transactions'
            });
        }
    }
    /**
     * Obtenir une transaction par ID
     */
    static async getTransactionById(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const transactionId = parseInt(req.params.id);
            if (isNaN(transactionId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de transaction invalide'
                });
                return;
            }
            const transaction = await transactionService_1.default.getTransactionById(transactionId, req.user.id);
            res.json({
                success: true,
                transaction
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Transaction non trouvée'
            });
        }
    }
    /**
     * Annuler une transaction
     */
    static async cancelTransaction(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
                return;
            }
            const transactionId = parseInt(req.params.id);
            if (isNaN(transactionId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID de transaction invalide'
                });
                return;
            }
            const transaction = await transactionService_1.default.cancelTransaction(transactionId, req.user.id);
            res.json({
                success: true,
                message: 'Transaction annulée avec succès',
                transaction
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Erreur lors de l\'annulation'
            });
        }
    }
}
exports.default = TransactionController;
//# sourceMappingURL=transactionController.js.map