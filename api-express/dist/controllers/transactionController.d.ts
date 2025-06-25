import { Response } from 'express';
import { IAuthenticatedRequest } from '../types';
declare class TransactionController {
    /**
     * Effectuer un dépôt
     */
    static deposit(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Effectuer un retrait
     */
    static withdrawal(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Effectuer un virement
     */
    static transfer(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Obtenir l'historique des transactions
     */
    static getUserTransactions(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Obtenir les transactions d'un compte
     */
    static getAccountTransactions(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Obtenir une transaction par ID
     */
    static getTransactionById(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Annuler une transaction
     */
    static cancelTransaction(req: IAuthenticatedRequest, res: Response): Promise<void>;
}
export default TransactionController;
//# sourceMappingURL=transactionController.d.ts.map