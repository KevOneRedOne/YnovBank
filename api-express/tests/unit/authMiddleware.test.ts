import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../src/middleware/auth';

// Mock JWT
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Définir JWT_SECRET pour les tests
    process.env.JWT_SECRET = 'test-secret';
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('devrait appeler next() avec un token valide', () => {
    // Arrange
    const mockPayload = {
      id: 1,
      email: 'test@example.com',
      role: 'CLIENT'
    };

    req.headers.authorization = 'Bearer valid-token';
    mockedJwt.verify.mockReturnValue(mockPayload as any);

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('devrait retourner 401 si aucun header Authorization n\'est fourni', () => {
    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token d\'authentification requis'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner 401 si le header Authorization ne commence pas par "Bearer "', () => {
    // Arrange
    req.headers.authorization = 'Invalid token-format';

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token d\'authentification requis'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner 401 si le token est invalide', () => {
    // Arrange
    req.headers.authorization = 'Bearer invalid-token';
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Token invalide');
    });

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token invalide'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait retourner 401 si JWT_SECRET n\'est pas défini', () => {
    // Arrange
    delete process.env.JWT_SECRET;
    req.headers.authorization = 'Bearer valid-token';

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token invalide'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait extraire correctement le token du header Authorization', () => {
    // Arrange
    const mockPayload = {
      id: 1,
      email: 'test@example.com',
      role: 'CLIENT'
    };

    req.headers.authorization = 'Bearer my-secret-token-123';
    mockedJwt.verify.mockReturnValue(mockPayload as any);

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('my-secret-token-123', 'test-secret');
    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
  });
});
