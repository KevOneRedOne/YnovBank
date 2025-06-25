import { Request, Response } from 'express';
import AuthService from '../services/authService';
import { IRegisterRequest, ILoginRequest, IAuthenticatedRequest } from '../types';

class AuthController {
  
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: IRegisterRequest = req.body;
      
      const user = await AuthService.createUser(userData);
      const { token } = await AuthService.authenticateUser({
        email: userData.email,
        password: userData.password
      });
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        token,
        user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
      });
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: ILoginRequest = req.body;
      
      const { user, token } = await AuthService.authenticateUser(credentials);
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        token,
        user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur de connexion'
      });
    }
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  static async getProfile(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const user = await AuthService.getUserById(req.user.id);
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Utilisateur non trouvé'
      });
    }
  }
}

export default AuthController;
