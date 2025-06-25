import request from 'supertest';
import express from 'express';
import TransactionController from '../../src/controllers/transactionController';
import TransactionService from '../../src/services/transactionService';
import { Decimal } from '@prisma/client/runtime/library';

// Mock des services
jest.mock('../../src/services/transactionService');

const mockedTransactionService = TransactionService as jest.Mocked<typeof TransactionService>;

// Configuration de l'app de test
const app = express();
app.use(express.json());

// Middleware pour simuler l'authentification
const mockAuthMiddleware = (req: any, res: any, next: any) => {
  req.user = { id: 1, email: 'test@example.com' };
  next();
};

// Routes de test
app.post('/transactions/deposit', mockAuthMiddleware, TransactionController.deposit);
app.post('/transactions/withdrawal', mockAuthMiddleware, TransactionController.withdrawal);
app.post('/transactions/transfer', mockAuthMiddleware, TransactionController.transfer);
app.get('/transactions', mockAuthMiddleware, TransactionController.getUserTransactions);
app.get('/transactions/account/:accountId', mockAuthMiddleware, TransactionController.getAccountTransactions);
app.get('/transactions/:id', mockAuthMiddleware, TransactionController.getTransactionById);
app.put('/transactions/:id/cancel', mockAuthMiddleware, TransactionController.cancelTransaction);

describe('TransactionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /transactions/deposit', () => {
    it('devrait effectuer un dépôt avec succès', async () => {
      // Arrange
      const depositData = {
        accountId: 1,
        amount: 500,
        description: 'Dépôt test'
      };

      const mockTransaction = {
        id: 1,
        amount: new Decimal(500),
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: 'Dépôt test',
        reference: 'REF123',
        fromAccountId: null,
        toAccountId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedTransactionService.deposit.mockResolvedValue(mockTransaction as any);

      // Act
      const response = await request(app)
        .post('/transactions/deposit')
        .send(depositData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Dépôt effectué avec succès',
        transaction: expect.objectContaining({
          id: 1,
          type: 'DEPOSIT',
          status: 'COMPLETED'
        })
      });
      expect(mockedTransactionService.deposit).toHaveBeenCalledWith(1, 1, 500, 'Dépôt test');
    });

    it('devrait retourner une erreur 400 pour des données invalides', async () => {
      // Arrange
      const invalidData = {
        accountId: 'invalid',
        amount: -100
      };

      // Act
      const response = await request(app)
        .post('/transactions/deposit')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Données invalides');
    });

    it('devrait retourner une erreur 400 si le service échoue', async () => {
      // Arrange
      const depositData = {
        accountId: 1,
        amount: 500
      };

      mockedTransactionService.deposit.mockRejectedValue(new Error('Compte non autorisé'));

      // Act
      const response = await request(app)
        .post('/transactions/deposit')
        .send(depositData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Compte non autorisé'
      });
    });
  });

  describe('POST /transactions/withdrawal', () => {
    it('devrait effectuer un retrait avec succès', async () => {
      // Arrange
      const withdrawalData = {
        accountId: 1,
        amount: 300,
        description: 'Retrait ATM'
      };

      const mockTransaction = {
        id: 2,
        amount: new Decimal(300),
        type: 'WITHDRAWAL',
        status: 'COMPLETED',
        description: 'Retrait ATM',
        reference: 'REF124',
        fromAccountId: 1,
        toAccountId: null,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedTransactionService.withdrawal.mockResolvedValue(mockTransaction as any);

      // Act
      const response = await request(app)
        .post('/transactions/withdrawal')
        .send(withdrawalData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Retrait effectué avec succès',
        transaction: expect.objectContaining({
          id: 2,
          type: 'WITHDRAWAL',
          status: 'COMPLETED'
        })
      });
      expect(mockedTransactionService.withdrawal).toHaveBeenCalledWith(1, 1, 300, 'Retrait ATM');
    });

    it('devrait retourner une erreur si le solde est insuffisant', async () => {
      // Arrange
      const withdrawalData = {
        accountId: 1,
        amount: 1500
      };

      mockedTransactionService.withdrawal.mockRejectedValue(new Error('Solde insuffisant'));

      // Act
      const response = await request(app)
        .post('/transactions/withdrawal')
        .send(withdrawalData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Solde insuffisant'
      });
    });
  });

  describe('POST /transactions/transfer', () => {
    it('devrait effectuer un virement avec succès', async () => {
      // Arrange
      const transferData = {
        fromAccountId: 1,
        toAccountNumber: 'ACC123456785678',
        amount: 200,
        description: 'Virement mensuel'
      };

      const mockTransaction = {
        id: 3,
        amount: new Decimal(200),
        type: 'TRANSFER',
        status: 'COMPLETED',
        description: 'Virement mensuel',
        reference: 'REF125',
        fromAccountId: 1,
        toAccountId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedTransactionService.transfer.mockResolvedValue(mockTransaction as any);

      // Act
      const response = await request(app)
        .post('/transactions/transfer')
        .send(transferData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Virement effectué avec succès',
        transaction: expect.objectContaining({
          id: 3,
          type: 'TRANSFER',
          status: 'COMPLETED'
        })
      });
      expect(mockedTransactionService.transfer).toHaveBeenCalledWith(1, 1, 'ACC123456785678', 200, 'Virement mensuel');
    });

    it('devrait retourner une erreur pour un compte de destination invalide', async () => {
      // Arrange
      const transferData = {
        fromAccountId: 1,
        toAccountNumber: 'INVALID123',
        amount: 200
      };

      mockedTransactionService.transfer.mockRejectedValue(new Error('Compte non trouvé'));

      // Act
      const response = await request(app)
        .post('/transactions/transfer')
        .send(transferData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Compte non trouvé'
      });
    });
  });

  describe('GET /transactions', () => {
    it('devrait utiliser des valeurs par défaut pour la pagination', async () => {
      // Arrange
      const mockResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      };

      mockedTransactionService.getUserTransactions.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .get('/transactions');

      // Assert
      expect(response.status).toBe(200);
      expect(mockedTransactionService.getUserTransactions).toHaveBeenCalledWith(1, 1, 10);
    });
  });

  describe('GET /transactions/account/:accountId', () => {
    it('devrait retourner une erreur 400 pour un ID de compte invalide', async () => {
      // Act
      const response = await request(app)
        .get('/transactions/account/invalid');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'ID de compte invalide'
      });
    });

    it('devrait retourner une erreur 404 si le compte n\'est pas autorisé', async () => {
      // Arrange
      mockedTransactionService.getAccountTransactions.mockRejectedValue(new Error('Compte non autorisé'));

      // Act
      const response = await request(app)
        .get('/transactions/account/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Compte non autorisé'
      });
    });
  });

  describe('GET /transactions/:id', () => {
    it('devrait retourner une transaction par son ID', async () => {
      // Arrange
      const mockTransaction = {
        id: 1,
        amount: new Decimal(500),
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: 'Dépôt test',
        reference: 'REF123',
        fromAccountId: null,
        toAccountId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedTransactionService.getTransactionById.mockResolvedValue(mockTransaction as any);

      // Act
      const response = await request(app)
        .get('/transactions/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        transaction: expect.objectContaining({
          id: 1,
          type: 'DEPOSIT',
          status: 'COMPLETED'
        })
      });
      expect(mockedTransactionService.getTransactionById).toHaveBeenCalledWith(1, 1);
    });

    it('devrait retourner une erreur 400 pour un ID invalide', async () => {
      // Act
      const response = await request(app)
        .get('/transactions/invalid');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'ID de transaction invalide'
      });
    });

    it('devrait retourner une erreur 404 si la transaction n\'existe pas', async () => {
      // Arrange
      mockedTransactionService.getTransactionById.mockRejectedValue(new Error('Transaction non trouvée'));

      // Act
      const response = await request(app)
        .get('/transactions/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Transaction non trouvée'
      });
    });
  });

  describe('PUT /transactions/:id/cancel', () => {
    it('devrait annuler une transaction avec succès', async () => {
      // Arrange
      const mockTransaction = {
        id: 1,
        amount: new Decimal(500),
        type: 'TRANSFER',
        status: 'CANCELLED',
        description: 'Virement annulé',
        reference: 'REF123',
        fromAccountId: 1,
        toAccountId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedTransactionService.cancelTransaction.mockResolvedValue(mockTransaction as any);

      // Act
      const response = await request(app)
        .put('/transactions/1/cancel');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Transaction annulée avec succès',
        transaction: expect.objectContaining({
          id: 1,
          status: 'CANCELLED'
        })
      });
      expect(mockedTransactionService.cancelTransaction).toHaveBeenCalledWith(1, 1);
    });

    it('devrait retourner une erreur 400 pour un ID invalide', async () => {
      // Act
      const response = await request(app)
        .put('/transactions/invalid/cancel');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'ID de transaction invalide'
      });
    });

    it('devrait retourner une erreur si la transaction ne peut pas être annulée', async () => {
      // Arrange
      mockedTransactionService.cancelTransaction.mockRejectedValue(
        new Error('Seules les transactions en attente peuvent être annulées')
      );

      // Act
      const response = await request(app)
        .put('/transactions/1/cancel');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Seules les transactions en attente peuvent être annulées'
      });
    });
  });
});
