import { Request, Response, NextFunction } from 'express';
import { validateRegistration, validateLogin, validateAccount, validateTransaction } from '../../src/middleware/validation';

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('validateRegistration', () => {
    it('devrait passer avec des données valides', () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      // Act
      validateRegistration(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un email invalide', () => {
      // Arrange
      req.body = {
        email: 'invalid-email',
        password: 'password123'
      };

      // Act
      validateRegistration(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['Format d\'email invalide'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un mot de passe trop court', () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: '123'
      };

      // Act
      validateRegistration(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['Le mot de passe doit contenir au moins 6 caractères'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour des champs requis manquants', () => {
      // Arrange
      req.body = {};

      // Act
      validateRegistration(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining([
          'L\'email est requis',
          'Le mot de passe est requis'
        ])
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateLogin', () => {
    it('devrait passer avec des données valides', () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      validateLogin(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un email manquant', () => {
      // Arrange
      req.body = {
        password: 'password123'
      };

      // Act
      validateLogin(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['L\'email est requis'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un mot de passe manquant', () => {
      // Arrange
      req.body = {
        email: 'test@example.com'
      };

      // Act
      validateLogin(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['Le mot de passe est requis'])
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateAccount', () => {
    it('devrait passer avec des données valides', () => {
      // Arrange
      req.body = {
        accountType: 'CHECKING',
        initialBalance: 1000
      };

      // Act
      validateAccount(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait passer avec des valeurs par défaut', () => {
      // Arrange
      req.body = {};

      // Act
      validateAccount(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un type de compte invalide', () => {
      // Arrange
      req.body = {
        accountType: 'INVALID_TYPE'
      };

      // Act
      validateAccount(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un solde initial négatif', () => {
      // Arrange
      req.body = {
        initialBalance: -100
      };

      // Act
      validateAccount(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateTransaction', () => {
    it('devrait passer avec une transaction de dépôt valide', () => {
      // Arrange
      req.body = {
        type: 'DEPOSIT',
        toAccountId: 1,
        amount: 500,
        description: 'Dépôt test'
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait passer avec une transaction de retrait valide', () => {
      // Arrange
      req.body = {
        type: 'WITHDRAWAL',
        fromAccountId: 1,
        amount: 300
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait passer avec une transaction de virement valide', () => {
      // Arrange
      req.body = {
        type: 'TRANSFER',
        fromAccountId: 1,
        toAccountId: 2,
        amount: 200
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un montant négatif', () => {
      // Arrange
      req.body = {
        type: 'DEPOSIT',
        toAccountId: 1,
        amount: -100
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['Le montant doit être positif'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur pour un type de transaction invalide', () => {
      // Arrange
      req.body = {
        type: 'INVALID_TYPE',
        amount: 100
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['Le type de transaction doit être DEPOSIT, WITHDRAWAL ou TRANSFER'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur si fromAccountId manque pour un retrait', () => {
      // Arrange
      req.body = {
        type: 'WITHDRAWAL',
        amount: 100
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['fromAccountId est requis pour un retrait'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur si toAccountId manque pour un dépôt', () => {
      // Arrange
      req.body = {
        type: 'DEPOSIT',
        amount: 100
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['toAccountId est requis pour un dépôt'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait retourner une erreur si fromAccountId ou toAccountId manque pour un virement', () => {
      // Arrange
      req.body = {
        type: 'TRANSFER',
        fromAccountId: 1,
        amount: 100
      };

      // Act
      validateTransaction(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Données invalides',
        errors: expect.arrayContaining(['fromAccountId et toAccountId sont requis pour un transfer'])
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
