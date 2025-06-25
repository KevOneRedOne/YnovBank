import prisma from '../config/database';
import { IAccount, ICreateAccountRequest } from '../types';

class AccountService {
  
  /**
   * Créer un nouveau compte bancaire
   */
  static async createAccount(userId: number, accountData: ICreateAccountRequest): Promise<IAccount> {
    // Générer un numéro de compte unique
    const accountNumber = this.generateAccountNumber();
    
    const account = await prisma.account.create({
      data: {
        accountNumber,
        accountType: accountData.accountType || 'CHECKING',
        balance: accountData.initialBalance || 0,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    return account as IAccount;
  }

  /**
   * Obtenir tous les comptes d'un utilisateur
   */
  static async getUserAccounts(userId: number): Promise<IAccount[]> {
    const accounts = await prisma.account.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      include: {
        _count: {
          select: {
            transactionsFrom: true,
            transactionsTo: true
          }
        }
      }
    });

    return accounts as IAccount[];
  }

  /**
   * Obtenir un compte par son ID
   */
  static async getAccountById(accountId: number, userId?: number): Promise<IAccount> {
    const where: any = { id: accountId };
    if (userId) {
      where.userId = userId;
    }

    const account = await prisma.account.findUnique({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!account) {
      throw new Error('Compte non trouvé');
    }

    return account as IAccount;
  }

  /**
   * Obtenir un compte par son numéro
   */
  static async getAccountByNumber(accountNumber: string): Promise<IAccount> {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!account) {
      throw new Error('Compte non trouvé');
    }

    return account as IAccount;
  }

  /**
   * Mettre à jour le solde d'un compte
   */
  static async updateBalance(accountId: number, newBalance: number): Promise<IAccount> {
    const account = await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance }
    });

    return account as IAccount;
  }

  /**
   * Désactiver un compte
   */
  static async deactivateAccount(accountId: number, userId: number): Promise<IAccount> {
    const account = await prisma.account.update({
      where: {
        id: accountId,
        userId: userId
      },
      data: { isActive: false }
    });

    return account as IAccount;
  }

  /**
   * Obtenir le solde d'un compte
   */
  static async getAccountBalance(accountId: number, userId: number): Promise<{ balance: number; accountNumber: string; accountType: string }> {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
        userId: userId
      },
      select: {
        balance: true,
        accountNumber: true,
        accountType: true
      }
    });

    if (!account) {
      throw new Error('Compte non trouvé');
    }

    return {
      balance: Number(account.balance),
      accountNumber: account.accountNumber,
      accountType: account.accountType
    };
  }

  /**
   * Générer un numéro de compte unique
   */
  private static generateAccountNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ACC${timestamp.slice(-8)}${random}`;
  }

  /**
   * Vérifier si un utilisateur possède un compte
   */
  static async userOwnsAccount(userId: number, accountId: number): Promise<boolean> {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: userId
      }
    });

    return !!account;
  }
}

export default AccountService;
