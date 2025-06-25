import { IAccount, ICreateAccountRequest } from '../types';
declare class AccountService {
    /**
     * Créer un nouveau compte bancaire
     */
    static createAccount(userId: number, accountData: ICreateAccountRequest): Promise<IAccount>;
    /**
     * Obtenir tous les comptes d'un utilisateur
     */
    static getUserAccounts(userId: number): Promise<IAccount[]>;
    /**
     * Obtenir un compte par son ID
     */
    static getAccountById(accountId: number, userId?: number): Promise<IAccount>;
    /**
     * Obtenir un compte par son numéro
     */
    static getAccountByNumber(accountNumber: string): Promise<IAccount>;
    /**
     * Mettre à jour le solde d'un compte
     */
    static updateBalance(accountId: number, newBalance: number): Promise<IAccount>;
    /**
     * Désactiver un compte
     */
    static deactivateAccount(accountId: number, userId: number): Promise<IAccount>;
    /**
     * Obtenir le solde d'un compte
     */
    static getAccountBalance(accountId: number, userId: number): Promise<{
        balance: number;
        accountNumber: string;
        accountType: string;
    }>;
    /**
     * Générer un numéro de compte unique
     */
    private static generateAccountNumber;
    /**
     * Vérifier si un utilisateur possède un compte
     */
    static userOwnsAccount(userId: number, accountId: number): Promise<boolean>;
}
export default AccountService;
//# sourceMappingURL=accountService.d.ts.map