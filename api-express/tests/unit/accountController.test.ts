import request from 'supertest';
import express from 'express';
import AccountController from '../../src/controllers/accountController';
import AccountService from '../../src/services/accountService';

// Mock des services
jest.mock('../../src/services/accountService');

const mockedAccountService = AccountService as jest.Mocked<typeof AccountService>;

// Configuration de l'app de test
const app = express();
app.use(express.json());

// Middleware pour simuler l'authentification
const mockAuthMiddleware = (req: any, res: any, next: any) => {
  req.user = { id: 1, email: 'test@example.com' };
  next();
};

// Routes de test
app.post('/accounts', mockAuthMiddleware, AccountController.createAccount);
app.get('/accounts', mockAuthMiddleware, AccountController.getUserAccounts);
app.get('/accounts/:id', mockAuthMiddleware, AccountController.getAccountById);
app.get('/accounts/:id/balance', mockAuthMiddleware, AccountController.getAccountBalance);
app.delete('/accounts/:id', mockAuthMiddleware, AccountController.deactivateAccount);

describe('AccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /accounts', () => {
    it('devrait créer un nouveau compte avec succès', async () => {
      // Arrange
      const accountData = {
        accountType: 'CHECKING',
        initialBalance: 1000
      };

      const mockAccount = {
        id: 1,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 1000,
        isActive: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.createAccount.mockResolvedValue(mockAccount as any);

      // Act
      const response = await request(app)
        .post('/accounts')
        .send(accountData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Compte créé avec succès',
        account: {
          ...mockAccount,
          createdAt: mockAccount.createdAt.toISOString(),
          updatedAt: mockAccount.updatedAt.toISOString()
        }
      });
      expect(mockedAccountService.createAccount).toHaveBeenCalledWith(1, accountData);
    });

    it('devrait créer un compte avec des valeurs par défaut', async () => {
      // Arrange
      const accountData = {};

      const mockAccount = {
        id: 1,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 0,
        isActive: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.createAccount.mockResolvedValue(mockAccount as any);

      // Act
      const response = await request(app)
        .post('/accounts')
        .send(accountData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.account.accountType).toBe('CHECKING');
      expect(response.body.account.balance).toBe(0);
    });

    it('devrait retourner une erreur 400 pour des données invalides', async () => {
      // Arrange
      const invalidData = {
        accountType: 'INVALID_TYPE',
        initialBalance: -100
      };

      // Act
      const response = await request(app)
        .post('/accounts')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Données invalides');
    });

    it('devrait retourner une erreur 500 si la création échoue', async () => {
      // Arrange
      const accountData = {
        accountType: 'CHECKING',
        initialBalance: 1000
      };

      mockedAccountService.createAccount.mockRejectedValue(new Error('Erreur de base de données'));

      // Act
      const response = await request(app)
        .post('/accounts')
        .send(accountData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Erreur de base de données'
      });
    });
  });

  describe('GET /accounts', () => {
    it('devrait retourner tous les comptes de l\'utilisateur', async () => {
      // Arrange
      const mockAccounts = [
        {
          id: 1,
          accountNumber: 'ACC123456781234',
          accountType: 'CHECKING',
          balance: 1000,
          isActive: true,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          accountNumber: 'ACC123456785678',
          accountType: 'SAVINGS',
          balance: 5000,
          isActive: true,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockedAccountService.getUserAccounts.mockResolvedValue(mockAccounts as any);

      // Act
      const response = await request(app)
        .get('/accounts');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        accounts: mockAccounts.map(account => ({
          ...account,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString()
        }))
      });
      expect(mockedAccountService.getUserAccounts).toHaveBeenCalledWith(1);
    });

    it('devrait retourner une erreur 500 si la récupération échoue', async () => {
      // Arrange
      mockedAccountService.getUserAccounts.mockRejectedValue(new Error('Erreur de base de données'));

      // Act
      const response = await request(app)
        .get('/accounts');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: 'Erreur de base de données'
      });
    });
  });

  describe('GET /accounts/:id', () => {
    it('devrait retourner un compte par son ID', async () => {
      // Arrange
      const mockAccount = {
        id: 1,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 1000,
        isActive: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.getAccountById.mockResolvedValue(mockAccount as any);

      // Act
      const response = await request(app)
        .get('/accounts/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        account: mockAccount
      });
      expect(mockedAccountService.getAccountById).toHaveBeenCalledWith(1, 1);
    });

    it('devrait retourner une erreur 400 pour un ID invalide', async () => {
      // Act
      const response = await request(app)
        .get('/accounts/invalid');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'ID de compte invalide'
      });
    });

    it('devrait retourner une erreur 404 si le compte n\'existe pas', async () => {
      // Arrange
      mockedAccountService.getAccountById.mockRejectedValue(new Error('Compte non trouvé'));

      // Act
      const response = await request(app)
        .get('/accounts/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Compte non trouvé'
      });
    });
  });

  describe('GET /accounts/:id/balance', () => {
    it('devrait retourner le solde d\'un compte', async () => {
      // Arrange
      const mockBalance = {
        balance: 1500.50,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING'
      };

      mockedAccountService.getAccountBalance.mockResolvedValue(mockBalance);

      // Act
      const response = await request(app)
        .get('/accounts/1/balance');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        balance: 1500.50,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING'
      });
      expect(mockedAccountService.getAccountBalance).toHaveBeenCalledWith(1, 1);
    });

    it('devrait retourner une erreur 400 pour un ID invalide', async () => {
      // Act
      const response = await request(app)
        .get('/accounts/invalid/balance');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'ID de compte invalide'
      });
    });

    it('devrait retourner une erreur 404 si le compte n\'existe pas', async () => {
      // Arrange
      mockedAccountService.getAccountBalance.mockRejectedValue(new Error('Compte non trouvé'));

      // Act
      const response = await request(app)
        .get('/accounts/999/balance');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Compte non trouvé'
      });
    });
  });

  describe('DELETE /accounts/:id', () => {
    it('devrait désactiver un compte avec succès', async () => {
      // Arrange
      const mockAccount = {
        id: 1,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 1000,
        isActive: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.deactivateAccount.mockResolvedValue(mockAccount as any);

      // Act
      const response = await request(app)
        .delete('/accounts/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Compte désactivé avec succès',
        account: mockAccount
      });
      expect(mockedAccountService.deactivateAccount).toHaveBeenCalledWith(1, 1);
    });

    it('devrait retourner une erreur 400 pour un ID invalide', async () => {
      // Act
      const response = await request(app)
        .delete('/accounts/invalid');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'ID de compte invalide'
      });
    });

    it('devrait retourner une erreur 404 si le compte n\'existe pas', async () => {
      // Arrange
      mockedAccountService.deactivateAccount.mockRejectedValue(new Error('Compte non trouvé'));

      // Act
      const response = await request(app)
        .delete('/accounts/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Compte non trouvé'
      });
    });
  });
});
