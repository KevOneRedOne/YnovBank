import { Router } from 'express';
import AccountController from '../controllers/accountController';
import authMiddleware from '../middleware/auth';
import { validateAccount } from '../middleware/validation';

const router = Router();

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
router.post('/', authMiddleware, AccountController.createAccount);

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
router.get('/', authMiddleware, AccountController.getUserAccounts);

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
router.get('/:id', authMiddleware, AccountController.getAccountById);

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
router.get('/:id/balance', authMiddleware, AccountController.getAccountBalance);

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
router.patch('/:id/deactivate', authMiddleware, AccountController.deactivateAccount);

export default router;
