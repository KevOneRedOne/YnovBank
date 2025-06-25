import TransactionService from '../../src/services/transactionService';
import AccountService from '../../src/services/accountService';
import { prisma } from '../setup';
import { Decimal } from '@prisma/client/runtime/library';

// Mock des services
jest.mock('../../src/services/accountService');

const mockedAccountService = AccountService as jest.Mocked<typeof AccountService>;

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('deposit', () => {
    it('devrait effectuer un dépôt avec succès', async () => {
      // Arrange
      const userId = 1;
      const accountId = 1;
      const amount = 500;
      const description = 'Dépôt test';

      const mockAccount = {
        id: accountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: new Decimal(1000),
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockTransaction = {
        id: 1,
        amount: new Decimal(amount),
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: description,
        reference: 'REF123',
        fromAccountId: null,
        toAccountId: accountId,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.userOwnsAccount.mockResolvedValue(true);
      mockedAccountService.getAccountById.mockResolvedValue(mockAccount as any);
      
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          transaction: {
            create: jest.fn().mockResolvedValue(mockTransaction)
          },
          account: {
            update: jest.fn().mockResolvedValue(mockAccount)
          }
        };
        return await callback(mockTx);
      });

      // Act
      const result = await TransactionService.deposit(userId, accountId, amount, description);

      // Assert
      expect(mockedAccountService.userOwnsAccount).toHaveBeenCalledWith(userId, accountId);
      expect(mockedAccountService.getAccountById).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(mockTransaction);
    });

    it('devrait lever une erreur si l\'utilisateur ne possède pas le compte', async () => {
      // Arrange
      const userId = 1;
      const accountId = 1;
      const amount = 500;

      mockedAccountService.userOwnsAccount.mockResolvedValue(false);

      // Act & Assert
      await expect(TransactionService.deposit(userId, accountId, amount)).rejects.toThrow(
        'Compte non autorisé'
      );
    });
  });

  describe('withdrawal', () => {
    it('devrait effectuer un retrait avec succès', async () => {
      // Arrange
      const userId = 1;
      const accountId = 1;
      const amount = 300;

      const mockAccount = {
        id: accountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: new Decimal(1000),
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockTransaction = {
        id: 1,
        amount: new Decimal(amount),
        type: 'WITHDRAWAL',
        status: 'COMPLETED',
        description: `Retrait du compte ${mockAccount.accountNumber}`,
        reference: 'REF123',
        fromAccountId: accountId,
        toAccountId: null,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.userOwnsAccount.mockResolvedValue(true);
      mockedAccountService.getAccountById.mockResolvedValue(mockAccount as any);
      
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          transaction: {
            create: jest.fn().mockResolvedValue(mockTransaction)
          },
          account: {
            update: jest.fn().mockResolvedValue(mockAccount)
          }
        };
        return await callback(mockTx);
      });

      // Act
      const result = await TransactionService.withdrawal(userId, accountId, amount);

      // Assert
      expect(mockedAccountService.userOwnsAccount).toHaveBeenCalledWith(userId, accountId);
      expect(mockedAccountService.getAccountById).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(mockTransaction);
    });

    it('devrait lever une erreur si le solde est insuffisant', async () => {
      // Arrange
      const userId = 1;
      const accountId = 1;
      const amount = 1500; // Plus que le solde disponible

      const mockAccount = {
        id: accountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: new Decimal(1000),
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.userOwnsAccount.mockResolvedValue(true);
      mockedAccountService.getAccountById.mockResolvedValue(mockAccount as any);

      // Act & Assert
      await expect(TransactionService.withdrawal(userId, accountId, amount)).rejects.toThrow(
        'Solde insuffisant'
      );
    });
  });

  describe('transfer', () => {
    it('devrait effectuer un virement avec succès', async () => {
      // Arrange
      const userId = 1;
      const fromAccountId = 1;
      const toAccountNumber = 'ACC123456785678';
      const amount = 200;

      const mockFromAccount = {
        id: fromAccountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: new Decimal(1000),
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockToAccount = {
        id: 2,
        accountNumber: toAccountNumber,
        accountType: 'SAVINGS',
        balance: new Decimal(500),
        isActive: true,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockTransaction = {
        id: 1,
        amount: new Decimal(amount),
        type: 'TRANSFER',
        status: 'COMPLETED',
        description: `Virement vers ${toAccountNumber}`,
        reference: 'REF123',
        fromAccountId: fromAccountId,
        toAccountId: 2,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.userOwnsAccount.mockResolvedValue(true);
      mockedAccountService.getAccountById.mockResolvedValue(mockFromAccount as any);
      mockedAccountService.getAccountByNumber.mockResolvedValue(mockToAccount as any);
      
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
        const mockTx = {
          transaction: {
            create: jest.fn().mockResolvedValue(mockTransaction)
          },
          account: {
            update: jest.fn().mockResolvedValue({})
          }
        };
        return await callback(mockTx);
      });

      // Act
      const result = await TransactionService.transfer(userId, fromAccountId, toAccountNumber, amount);

      // Assert
      expect(mockedAccountService.userOwnsAccount).toHaveBeenCalledWith(userId, fromAccountId);
      expect(mockedAccountService.getAccountById).toHaveBeenCalledWith(fromAccountId);
      expect(mockedAccountService.getAccountByNumber).toHaveBeenCalledWith(toAccountNumber);
      expect(result).toEqual(mockTransaction);
    });

    it('devrait lever une erreur si on essaie de transférer vers le même compte', async () => {
      // Arrange
      const userId = 1;
      const fromAccountId = 1;
      const toAccountNumber = 'ACC123456781234'; // Même numéro de compte
      const amount = 200;

      const mockAccount = {
        id: fromAccountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: new Decimal(1000),
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedAccountService.userOwnsAccount.mockResolvedValue(true);
      mockedAccountService.getAccountById.mockResolvedValue(mockAccount as any);
      mockedAccountService.getAccountByNumber.mockResolvedValue(mockAccount as any);

      // Act & Assert
      await expect(TransactionService.transfer(userId, fromAccountId, toAccountNumber, amount)).rejects.toThrow(
        'Impossible de transférer vers le même compte'
      );
    });
  });

  describe('getUserTransactions', () => {
    it('devrait retourner les transactions paginées d\'un utilisateur', async () => {
      // Arrange
      const userId = 1;
      const page = 1;
      const limit = 10;

      const mockTransactions = [
        {
          id: 1,
          amount: new Decimal(500),
          type: 'DEPOSIT',
          status: 'COMPLETED',
          description: 'Dépôt test',
          reference: 'REF123',
          fromAccountId: null,
          toAccountId: 1,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          fromAccount: null,
          toAccount: {
            accountNumber: 'ACC123456781234',
            accountType: 'CHECKING',
            user: {
              name: 'Test User',
              email: 'test@example.com'
            }
          }
        }
      ];

      jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue(mockTransactions as any);
      jest.spyOn(prisma.transaction, 'count').mockResolvedValue(1);

      // Act
      const result = await TransactionService.getUserTransactions(userId, page, limit);

      // Assert
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
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
        skip: 0,
        take: limit
      });
      expect(result).toEqual({
        data: mockTransactions,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1
        }
      });
    });
  });

  describe('getTransactionById', () => {
    it('devrait retourner une transaction par son ID', async () => {
      // Arrange
      const transactionId = 1;
      const userId = 1;

      const mockTransaction = {
        id: transactionId,
        amount: new Decimal(500),
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: 'Dépôt test',
        reference: 'REF123',
        fromAccountId: null,
        toAccountId: 1,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        fromAccount: null,
        toAccount: {
          accountNumber: 'ACC123456781234',
          accountType: 'CHECKING',
          user: {
            name: 'Test User',
            email: 'test@example.com'
          }
        }
      };

      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(mockTransaction as any);

      // Act
      const result = await TransactionService.getTransactionById(transactionId, userId);

      // Assert
      expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockTransaction);
    });

    it('devrait lever une erreur si la transaction n\'existe pas', async () => {
      // Arrange
      const transactionId = 999;
      const userId = 1;
      jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(TransactionService.getTransactionById(transactionId, userId)).rejects.toThrow(
        'Transaction non trouvée'
      );
    });
  });

  describe('cancelTransaction', () => {
    it('devrait annuler une transaction en attente', async () => {
      // Arrange
      const transactionId = 1;
      const userId = 1;

      const mockTransaction = {
        id: transactionId,
        amount: new Decimal(500),
        type: 'TRANSFER',
        status: 'PENDING',
        description: 'Virement en attente',
        reference: 'REF123',
        fromAccountId: 1,
        toAccountId: 2,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const cancelledTransaction = {
        ...mockTransaction,
        status: 'CANCELLED'
      };

      jest.spyOn(TransactionService, 'getTransactionById').mockResolvedValue(mockTransaction as any);
      jest.spyOn(prisma.transaction, 'update').mockResolvedValue(cancelledTransaction as any);

      // Act
      const result = await TransactionService.cancelTransaction(transactionId, userId);

      // Assert
      expect(TransactionService.getTransactionById).toHaveBeenCalledWith(transactionId, userId);
      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: transactionId },
        data: { status: 'CANCELLED' }
      });
      expect(result).toEqual(cancelledTransaction);
    });

    it('devrait lever une erreur si la transaction n\'est pas en attente', async () => {
      // Arrange
      const transactionId = 1;
      const userId = 1;

      const mockTransaction = {
        id: transactionId,
        amount: new Decimal(500),
        type: 'TRANSFER',
        status: 'COMPLETED',
        description: 'Virement terminé',
        reference: 'REF123',
        fromAccountId: 1,
        toAccountId: 2,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(TransactionService, 'getTransactionById').mockResolvedValue(mockTransaction as any);

      // Act & Assert
      await expect(TransactionService.cancelTransaction(transactionId, userId)).rejects.toThrow(
        'Seules les transactions en attente peuvent être annulées'
      );
    });
  });
});
