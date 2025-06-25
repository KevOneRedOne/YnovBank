import { ITransaction, IPaginationResult } from '../types';
declare class TransactionService {
    /**
     * Effectuer un dépôt
     */
    static deposit(userId: number, accountId: number, amount: number, description?: string): Promise<ITransaction>;
    /**
     * Effectuer un retrait
     */
    static withdrawal(userId: number, accountId: number, amount: number, description?: string): Promise<ITransaction>;
    /**
     * Effectuer un virement entre comptes
     */
    static transfer(userId: number, fromAccountId: number, toAccountNumber: string, amount: number, description?: string): Promise<ITransaction>;
    /**
     * Obtenir l'historique des transactions d'un utilisateur
     */
    static getUserTransactions(userId: number, page?: number, limit?: number): Promise<IPaginationResult<ITransaction>>;
    /**
     * Obtenir les transactions d'un compte spécifique
     */
    static getAccountTransactions(userId: number, accountId: number, page?: number, limit?: number): Promise<IPaginationResult<ITransaction>>;
    /**
     * Obtenir une transaction par ID
     */
    static getTransactionById(transactionId: number, userId: number): Promise<ITransaction>;
    /**
     * Annuler une transaction (si possible)
     */
    static cancelTransaction(transactionId: number, userId: number): Promise<ITransaction>;
}
export default TransactionService;
//# sourceMappingURL=transactionService.d.ts.map