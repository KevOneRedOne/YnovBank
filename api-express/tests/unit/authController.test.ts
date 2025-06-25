import request from 'supertest';
import express from 'express';
import AuthController from '../../src/controllers/authController';
import AuthService from '../../src/services/authService';

// Mock des services
jest.mock('../../src/services/authService');

const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

// Configuration de l'app de test
const app = express();
app.use(express.json());

// Routes de test
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);
app.get('/auth/profile', (req: any, res, next) => {
  // Simuler l'ajout de l'utilisateur par le middleware d'auth
  req.user = { id: 1, email: 'test@example.com' };
  next();
}, AuthController.getProfile);

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('devrait inscrire un nouvel utilisateur avec succès', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockUser = {
        id: 1,
        email: userData.email,
        name: userData.name,
        phone: null,
        address: null,
        dateOfBirth: null,
        isActive: true,
        role: 'CLIENT',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockAuthResult = {
        user: mockUser,
        token: 'mock-jwt-token'
      };

      mockedAuthService.createUser.mockResolvedValue(mockUser);
      mockedAuthService.authenticateUser.mockResolvedValue(mockAuthResult);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Utilisateur créé avec succès',
        token: 'mock-jwt-token',
        user: {
          ...mockUser,
          createdAt: mockUser.createdAt.toISOString(),
          updatedAt: mockUser.updatedAt.toISOString()
        }
      });
      expect(mockedAuthService.createUser).toHaveBeenCalledWith(userData);
      expect(mockedAuthService.authenticateUser).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password
      });
    });

    it('devrait retourner une erreur 400 si la création échoue', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      mockedAuthService.createUser.mockRejectedValue(new Error('Un utilisateur avec cette adresse email existe déjà'));

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: 'Un utilisateur avec cette adresse email existe déjà'
      });
    });
  });

  describe('POST /auth/login', () => {
    it('devrait connecter un utilisateur avec succès', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockAuthResult = {
        user: {
          id: 1,
          email: credentials.email,
          name: 'Test User',
          phone: null,
          address: null,
          dateOfBirth: null,
          isActive: true,
          role: 'CLIENT',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'mock-jwt-token'
      };

      mockedAuthService.authenticateUser.mockResolvedValue(mockAuthResult);

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Connexion réussie',
        token: 'mock-jwt-token',
        user: {
          ...mockAuthResult.user,
          createdAt: mockAuthResult.user.createdAt.toISOString(),
          updatedAt: mockAuthResult.user.updatedAt.toISOString()
        }
      });
      expect(mockedAuthService.authenticateUser).toHaveBeenCalledWith(credentials);
    });

    it('devrait retourner une erreur 401 si les identifiants sont incorrects', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      mockedAuthService.authenticateUser.mockRejectedValue(new Error('Email ou mot de passe incorrect'));

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    });
  });

  describe('GET /auth/profile', () => {
    it('devrait retourner le profil de l\'utilisateur connecté', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: null,
        address: null,
        dateOfBirth: null,
        isActive: true,
        role: 'CLIENT',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAuthService.getUserById.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get('/auth/profile');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        user: {
          ...mockUser,
          createdAt: mockUser.createdAt.toISOString(),
          updatedAt: mockUser.updatedAt.toISOString()
        }
      });
      expect(mockedAuthService.getUserById).toHaveBeenCalledWith(1);
    });

    it('devrait retourner une erreur 404 si l\'utilisateur n\'existe pas', async () => {
      // Arrange
      mockedAuthService.getUserById.mockRejectedValue(new Error('Utilisateur non trouvé'));

      // Act
      const response = await request(app)
        .get('/auth/profile');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    });
  });
});
