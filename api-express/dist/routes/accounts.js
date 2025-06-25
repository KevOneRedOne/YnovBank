"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = __importDefault(require("../controllers/accountController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/accounts:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Créer un nouveau compte bancaire
 *     description: Crée un nouveau compte bancaire pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountType:
 *                 type: string
 *                 enum: [CHECKING, SAVINGS, BUSINESS]
 *                 default: CHECKING
 *                 description: Type de compte
 *               initialBalance:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 description: Solde initial
 *           example:
 *             accountType: "CHECKING"
 *             initialBalance: 1000
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth_1.default, accountController_1.default.createAccount);
/**
 * @swagger
 * /api/accounts:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Obtenir tous les comptes de l'utilisateur
 *     description: Récupère tous les comptes bancaires de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des comptes récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
router.get('/', auth_1.default, accountController_1.default.getUserAccounts);
/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Obtenir un compte par ID
 *     description: Récupère un compte bancaire spécifique par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Compte récupéré avec succès
 *       404:
 *         description: Compte non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', auth_1.default, accountController_1.default.getAccountById);
/**
 * @swagger
 * /api/accounts/{id}/balance:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Obtenir le solde d'un compte
 *     description: Récupère le solde actuel d'un compte bancaire
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Solde récupéré avec succès
 *       404:
 *         description: Compte non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id/balance', auth_1.default, accountController_1.default.getAccountBalance);
/**
 * @swagger
 * /api/accounts/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Accounts
 *     summary: Désactiver un compte
 *     description: Désactive un compte bancaire
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Compte désactivé avec succès
 *       404:
 *         description: Compte non trouvé
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id/deactivate', auth_1.default, accountController_1.default.deactivateAccount);
exports.default = router;
//# sourceMappingURL=accounts.js.map