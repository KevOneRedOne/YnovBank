import { Router } from 'express';
import TransactionController from '../controllers/transactionController';
import authMiddleware from '../middleware/auth';
import { validateTransaction } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Effectuer un dépôt
 *     description: Effectue un dépôt sur un compte bancaire
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountId, amount]
 *             properties:
 *               accountId:
 *                 type: integer
 *                 description: ID du compte
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Montant du dépôt
 *               description:
 *                 type: string
 *                 description: Description du dépôt
 *           example:
 *             accountId: 1
 *             amount: 500.00
 *             description: "Dépôt de salaire"
 *     responses:
 *       201:
 *         description: Dépôt effectué avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/deposit', authMiddleware, TransactionController.deposit);

/**
 * @swagger
 * /api/transactions/withdrawal:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Effectuer un retrait
 *     description: Effectue un retrait d'un compte bancaire
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountId, amount]
 *             properties:
 *               accountId:
 *                 type: integer
 *                 description: ID du compte
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Montant du retrait
 *               description:
 *                 type: string
 *                 description: Description du retrait
 *           example:
 *             accountId: 1
 *             amount: 100.00
 *             description: "Retrait DAB"
 *     responses:
 *       201:
 *         description: Retrait effectué avec succès
 *       400:
 *         description: Données invalides ou solde insuffisant
 *       401:
 *         description: Non autorisé
 */
router.post('/withdrawal', authMiddleware, TransactionController.withdrawal);

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Effectuer un virement
 *     description: Effectue un virement entre deux comptes bancaires
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromAccountId, toAccountNumber, amount]
 *             properties:
 *               fromAccountId:
 *                 type: integer
 *                 description: ID du compte source
 *               toAccountNumber:
 *                 type: string
 *                 description: Numéro du compte destination
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Montant du virement
 *               description:
 *                 type: string
 *                 description: Description du virement
 *           example:
 *             fromAccountId: 1
 *             toAccountNumber: "ACC1234567890"
 *             amount: 250.00
 *             description: "Virement familial"
 *     responses:
 *       201:
 *         description: Virement effectué avec succès
 *       400:
 *         description: Données invalides ou solde insuffisant
 *       401:
 *         description: Non autorisé
 */
router.post('/transfer', authMiddleware, TransactionController.transfer);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Obtenir l'historique des transactions
 *     description: Récupère l'historique des transactions de l'utilisateur avec pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès
 *       401:
 *         description: Non autorisé
 */
router.get('/', authMiddleware, TransactionController.getUserTransactions);

/**
 * @swagger
 * /api/transactions/account/{accountId}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Obtenir les transactions d'un compte
 *     description: Récupère les transactions d'un compte spécifique avec pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Transactions du compte récupérées avec succès
 *       404:
 *         description: Compte non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/account/:accountId', authMiddleware, TransactionController.getAccountTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Obtenir une transaction par ID
 *     description: Récupère une transaction spécifique par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: Transaction récupérée avec succès
 *       404:
 *         description: Transaction non trouvée
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', authMiddleware, TransactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/{id}/cancel:
 *   patch:
 *     tags:
 *       - Transactions
 *     summary: Annuler une transaction
 *     description: Annule une transaction en attente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: Transaction annulée avec succès
 *       400:
 *         description: Transaction ne peut pas être annulée
 *       404:
 *         description: Transaction non trouvée
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id/cancel', authMiddleware, TransactionController.cancelTransaction);

export default router;
