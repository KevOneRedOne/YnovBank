import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import AccountService from './accountService';
import { ITransaction, IPaginationResult } from '../types';

class TransactionService {
  
  /**
   * Effectuer un dépôt
   */
  static async deposit(userId: number, accountId: number, amount: number, description: string = ''): Promise<ITransaction> {
    // Vérifier que l'utilisateur possède le compte
    const userOwnsAccount = await AccountService.userOwnsAccount(userId, accountId);
    if (!userOwnsAccount) {
      throw new Error('Compte non autorisé');
    }

    // Obtenir le compte
    const account = await AccountService.getAccountById(accountId);
    
    // Créer la transaction dans une transaction de base de données
    const result = await prisma.$transaction(async (tx) => {
      // Créer la transaction
      const transaction = await tx.transaction.create({
        data: {
          amount: new Decimal(amount),
          type: 'DEPOSIT',
          status: 'COMPLETED',
          description: description || `Dépôt sur le compte ${account.accountNumber}`,
          toAccountId: accountId,
          userId: userId
        }
      });

      // Mettre à jour le solde
      const newBalance = account.balance.add(new Decimal(amount));
      await tx.account.update({
        where: { id: accountId },
        data: { balance: newBalance }
      });

      return transaction;
    });

    return result as ITransaction;
  }

  /**
   * Effectuer un retrait
   */
  static async withdrawal(userId: number, accountId: number, amount: number, description: string = ''): Promise<ITransaction> {
    // Vérifier que l'utilisateur possède le compte
    const userOwnsAccount = await AccountService.userOwnsAccount(userId, accountId);
    if (!userOwnsAccount) {
      throw new Error('Compte non autorisé');
    }

    // Obtenir le compte
    const account = await AccountService.getAccountById(accountId);
    
    // Vérifier le solde suffisant
    if (account.balance.lt(new Decimal(amount))) {
      throw new Error('Solde insuffisant');
    }

    // Créer la transaction dans une transaction de base de données
    const result = await prisma.$transaction(async (tx) => {
      // Créer la transaction
      const transaction = await tx.transaction.create({
        data: {
          amount: new Decimal(amount),
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          description: description || `Retrait du compte ${account.accountNumber}`,
          fromAccountId: accountId,
          userId: userId
        }
      });

      // Mettre à jour le solde
      const newBalance = account.balance.sub(new Decimal(amount));
      await tx.account.update({
        where: { id: accountId },
        data: { balance: newBalance }
      });

      return transaction;
    });

    return result as ITransaction;
  }

  /**
   * Effectuer un virement entre comptes
   */
  static async transfer(userId: number, fromAccountId: number, toAccountNumber: string, amount: number, description: string = ''): Promise<ITransaction> {
    // Vérifier que l'utilisateur possède le compte source
    const userOwnsAccount = await AccountService.userOwnsAccount(userId, fromAccountId);
    if (!userOwnsAccount) {
      throw new Error('Compte source non autorisé');
    }

    // Obtenir les comptes
    const fromAccount = await AccountService.getAccountById(fromAccountId);
    const toAccount = await AccountService.getAccountByNumber(toAccountNumber);

    // Vérifier le solde suffisant
    if (fromAccount.balance.lt(new Decimal(amount))) {
      throw new Error('Solde insuffisant');
    }

    // Vérifier que les comptes sont différents
    if (fromAccount.id === toAccount.id) {
      throw new Error('Impossible de transférer vers le même compte');
    }

    // Créer la transaction dans une transaction de base de données
    const result = await prisma.$transaction(async (tx) => {
      // Créer la transaction
      const transaction = await tx.transaction.create({
        data: {
          amount: new Decimal(amount),
          type: 'TRANSFER',
          status: 'COMPLETED',
          description: description || `Virement vers ${toAccount.accountNumber}`,
          fromAccountId: fromAccountId,
          toAccountId: toAccount.id,
          userId: userId
        }
      });

      // Mettre à jour le solde du compte source
      const newFromBalance = fromAccount.balance.sub(new Decimal(amount));
      await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: newFromBalance }
      });

      // Mettre à jour le solde du compte destination
      const newToBalance = toAccount.balance.add(new Decimal(amount));
      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: newToBalance }
      });

      return transaction;
    });

    return result as ITransaction;
  }

  /**
   * Obtenir l'historique des transactions d'un utilisateur
   */
  static async getUserTransactions(userId: number, page: number = 1, limit: number = 10): Promise<IPaginationResult<ITransaction>> {
    const skip = (page - 1) * limit;
    
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true
          }
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.transaction.count({
      where: { userId }
    });

    return {
      data: transactions as ITransaction[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtenir les transactions d'un compte spécifique
   */
  static async getAccountTransactions(userId: number, accountId: number, page: number = 1, limit: number = 10): Promise<IPaginationResult<ITransaction>> {
    // Vérifier que l'utilisateur possède le compte
    const userOwnsAccount = await AccountService.userOwnsAccount(userId, accountId);
    if (!userOwnsAccount) {
      throw new Error('Compte non autorisé');
    }

    const skip = (page - 1) * limit;
    
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId }
        ]
      },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true
          }
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.transaction.count({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId }
        ]
      }
    });

    return {
      data: transactions as ITransaction[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtenir une transaction par ID
   */
  static async getTransactionById(transactionId: number, userId: number): Promise<ITransaction> {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
        userId: userId
      },
      include: {
        fromAccount: {
          select: {
            accountNumber: true,
            accountType: true
          }
        },
        toAccount: {
          select: {
            accountNumber: true,
            accountType: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transaction non trouvée');
    }

    return transaction as ITransaction;
  }

  /**
   * Annuler une transaction (si possible)
   */
  static async cancelTransaction(transactionId: number, userId: number): Promise<ITransaction> {
    const transaction = await this.getTransactionById(transactionId, userId);
    
    if (transaction.status !== 'PENDING') {
      throw new Error('Seules les transactions en attente peuvent être annulées');
    }

    const cancelledTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'CANCELLED' }
    });

    return cancelledTransaction as ITransaction;
  }
}

export default TransactionService;
