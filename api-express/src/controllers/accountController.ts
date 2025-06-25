import { Request, Response } from 'express';
import Joi from 'joi';
import AccountService from '../services/accountService';
import { IAuthenticatedRequest, ICreateAccountRequest } from '../types';

const createAccountSchema = Joi.object({
  accountType: Joi.string().valid('CHECKING', 'SAVINGS', 'BUSINESS').default('CHECKING'),
  initialBalance: Joi.number().min(0).default(0)
});

class AccountController {
  
  /**
   * Créer un nouveau compte bancaire
   */
  static async createAccount(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const { error, value } = createAccountSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const accountData: ICreateAccountRequest = value;
      const account = await AccountService.createAccount(req.user.id, accountData);
      
      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        account
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la création du compte'
      });
    }
  }

  /**
   * Obtenir tous les comptes de l'utilisateur
   */
  static async getUserAccounts(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const accounts = await AccountService.getUserAccounts(req.user.id);
      
      res.json({
        success: true,
        accounts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des comptes'
      });
    }
  }

  /**
   * Obtenir un compte par ID
   */
  static async getAccountById(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const accountId = parseInt(req.params.id);
      if (isNaN(accountId)) {
        res.status(400).json({
          success: false,
          message: 'ID de compte invalide'
        });
        return;
      }

      const account = await AccountService.getAccountById(accountId, req.user.id);
      
      res.json({
        success: true,
        account
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Compte non trouvé'
      });
    }
  }

  /**
   * Obtenir le solde d'un compte
   */
  static async getAccountBalance(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const accountId = parseInt(req.params.id);
      if (isNaN(accountId)) {
        res.status(400).json({
          success: false,
          message: 'ID de compte invalide'
        });
        return;
      }

      const accountBalance = await AccountService.getAccountBalance(accountId, req.user.id);
      
      res.json({
        success: true,
        ...accountBalance
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Compte non trouvé'
      });
    }
  }

  /**
   * Désactiver un compte
   */
  static async deactivateAccount(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const accountId = parseInt(req.params.id);
      if (isNaN(accountId)) {
        res.status(400).json({
          success: false,
          message: 'ID de compte invalide'
        });
        return;
      }

      const account = await AccountService.deactivateAccount(accountId, req.user.id);
      
      res.json({
        success: true,
        message: 'Compte désactivé avec succès',
        account
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Compte non trouvé'
      });
    }
  }
}

export default AccountController;
