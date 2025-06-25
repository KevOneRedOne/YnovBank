import { Request, Response } from 'express';
import Joi from 'joi';
import TransactionService from '../services/transactionService';
import { IAuthenticatedRequest, IDepositRequest, IWithdrawalRequest, ITransferRequest } from '../types';

// Validation schemas
const depositSchema = Joi.object({
  accountId: Joi.number().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
});

const withdrawalSchema = Joi.object({
  accountId: Joi.number().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
});

const transferSchema = Joi.object({
  fromAccountId: Joi.number().required(),
  toAccountNumber: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
});

class TransactionController {
  
  /**
   * Effectuer un dépôt
   */
  static async deposit(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const { error, value } = depositSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { accountId, amount, description }: IDepositRequest = value;
      const transaction = await TransactionService.deposit(req.user.id, accountId, amount, description);
      
      res.status(201).json({
        success: true,
        message: 'Dépôt effectué avec succès',
        transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du dépôt'
      });
    }
  }

  /**
   * Effectuer un retrait
   */
  static async withdrawal(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const { error, value } = withdrawalSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { accountId, amount, description }: IWithdrawalRequest = value;
      const transaction = await TransactionService.withdrawal(req.user.id, accountId, amount, description);
      
      res.status(201).json({
        success: true,
        message: 'Retrait effectué avec succès',
        transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du retrait'
      });
    }
  }

  /**
   * Effectuer un virement
   */
  static async transfer(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const { error, value } = transferSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const { fromAccountId, toAccountNumber, amount, description }: ITransferRequest = value;
      const transaction = await TransactionService.transfer(req.user.id, fromAccountId, toAccountNumber, amount, description);
      
      res.status(201).json({
        success: true,
        message: 'Virement effectué avec succès',
        transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du virement'
      });
    }
  }

  /**
   * Obtenir l'historique des transactions
   */
  static async getUserTransactions(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await TransactionService.getUserTransactions(req.user.id, page, limit);
      
      res.json({
        success: true,
        transactions: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des transactions'
      });
    }
  }

  /**
   * Obtenir les transactions d'un compte
   */
  static async getAccountTransactions(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const accountId = parseInt(req.params.accountId);
      if (isNaN(accountId)) {
        res.status(400).json({
          success: false,
          message: 'ID de compte invalide'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await TransactionService.getAccountTransactions(req.user.id, accountId, page, limit);
      
      res.json({
        success: true,
        transactions: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la récupération des transactions'
      });
    }
  }

  /**
   * Obtenir une transaction par ID
   */
  static async getTransactionById(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const transactionId = parseInt(req.params.id);
      if (isNaN(transactionId)) {
        res.status(400).json({
          success: false,
          message: 'ID de transaction invalide'
        });
        return;
      }

      const transaction = await TransactionService.getTransactionById(transactionId, req.user.id);
      
      res.json({
        success: true,
        transaction
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Transaction non trouvée'
      });
    }
  }

  /**
   * Annuler une transaction
   */
  static async cancelTransaction(req: IAuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }

      const transactionId = parseInt(req.params.id);
      if (isNaN(transactionId)) {
        res.status(400).json({
          success: false,
          message: 'ID de transaction invalide'
        });
        return;
      }

      const transaction = await TransactionService.cancelTransaction(transactionId, req.user.id);
      
      res.json({
        success: true,
        message: 'Transaction annulée avec succès',
        transaction
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de l\'annulation'
      });
    }
  }
}

export default TransactionController;
