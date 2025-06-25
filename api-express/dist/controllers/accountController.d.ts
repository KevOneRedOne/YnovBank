import { Response } from 'express';
import { IAuthenticatedRequest } from '../types';
declare class AccountController {
    /**
     * Créer un nouveau compte bancaire
     */
    static createAccount(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Obtenir tous les comptes de l'utilisateur
     */
    static getUserAccounts(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Obtenir un compte par ID
     */
    static getAccountById(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Obtenir le solde d'un compte
     */
    static getAccountBalance(req: IAuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Désactiver un compte
     */
    static deactivateAccount(req: IAuthenticatedRequest, res: Response): Promise<void>;
}
export default AccountController;
//# sourceMappingURL=accountController.d.ts.map