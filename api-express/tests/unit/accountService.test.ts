import AccountService from '../../src/services/accountService';
import { prisma } from '../setup';

describe('AccountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('createAccount', () => {
    it('devrait créer un nouveau compte avec succès', async () => {
      // Arrange
      const userId = 1;
      const accountData = {
        accountType: 'CHECKING',
        initialBalance: 1000
      };

      const mockAccount = {
        id: 1,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 1000,
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      jest.spyOn(prisma.account, 'create').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.createAccount(userId, accountData);

      // Assert
      expect(prisma.account.create).toHaveBeenCalledWith({
        data: {
          accountNumber: expect.any(String),
          accountType: 'CHECKING',
          balance: 1000,
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
      expect(result).toEqual(mockAccount);
    });

    it('devrait créer un compte avec des valeurs par défaut', async () => {
      // Arrange
      const userId = 1;
      const accountData = {};

      const mockAccount = {
        id: 1,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 0,
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      jest.spyOn(prisma.account, 'create').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.createAccount(userId, accountData);

      // Assert
      expect(prisma.account.create).toHaveBeenCalledWith({
        data: {
          accountNumber: expect.any(String),
          accountType: 'CHECKING',
          balance: 0,
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
    });
  });

  describe('getUserAccounts', () => {
    it('devrait retourner tous les comptes actifs d\'un utilisateur', async () => {
      // Arrange
      const userId = 1;
      const mockAccounts = [
        {
          id: 1,
          accountNumber: 'ACC123456781234',
          accountType: 'CHECKING',
          balance: 1000,
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            transactionsFrom: 5,
            transactionsTo: 3
          }
        },
        {
          id: 2,
          accountNumber: 'ACC123456785678',
          accountType: 'SAVINGS',
          balance: 5000,
          isActive: true,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            transactionsFrom: 2,
            transactionsTo: 1
          }
        }
      ];

      jest.spyOn(prisma.account, 'findMany').mockResolvedValue(mockAccounts as any);

      // Act
      const result = await AccountService.getUserAccounts(userId);

      // Assert
      expect(prisma.account.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockAccounts);
    });

    it('devrait retourner un tableau vide si l\'utilisateur n\'a pas de comptes', async () => {
      // Arrange
      const userId = 1;
      jest.spyOn(prisma.account, 'findMany').mockResolvedValue([]);

      // Act
      const result = await AccountService.getUserAccounts(userId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getAccountById', () => {
    it('devrait retourner un compte par son ID', async () => {
      // Arrange
      const accountId = 1;
      const userId = 1;
      const mockAccount = {
        id: accountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 1000,
        isActive: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.getAccountById(accountId, userId);

      // Assert
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: {
          id: accountId,
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
      expect(result).toEqual(mockAccount);
    });

    it('devrait lever une erreur si le compte n\'existe pas', async () => {
      // Arrange
      const accountId = 999;
      const userId = 1;
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(AccountService.getAccountById(accountId, userId)).rejects.toThrow(
        'Compte non trouvé'
      );
    });
  });

  describe('getAccountByNumber', () => {
    it('devrait retourner un compte par son numéro', async () => {
      // Arrange
      const accountNumber = 'ACC123456781234';
      const mockAccount = {
        id: 1,
        accountNumber: accountNumber,
        accountType: 'CHECKING',
        balance: 1000,
        isActive: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.getAccountByNumber(accountNumber);

      // Assert
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockAccount);
    });

    it('devrait lever une erreur si le compte n\'existe pas', async () => {
      // Arrange
      const accountNumber = 'INVALID123';
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(AccountService.getAccountByNumber(accountNumber)).rejects.toThrow(
        'Compte non trouvé'
      );
    });
  });

  describe('updateBalance', () => {
    it('devrait mettre à jour le solde d\'un compte', async () => {
      // Arrange
      const accountId = 1;
      const newBalance = 2000;
      const mockAccount = {
        id: accountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: newBalance,
        isActive: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prisma.account, 'update').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.updateBalance(accountId, newBalance);

      // Assert
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: accountId },
        data: { balance: newBalance }
      });
      expect(result).toEqual(mockAccount);
    });
  });

  describe('deactivateAccount', () => {
    it('devrait désactiver un compte', async () => {
      // Arrange
      const accountId = 1;
      const userId = 1;
      const mockAccount = {
        id: accountId,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING',
        balance: 1000,
        isActive: false,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prisma.account, 'update').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.deactivateAccount(accountId, userId);

      // Assert
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: {
          id: accountId,
          userId: userId
        },
        data: { isActive: false }
      });
      expect(result).toEqual(mockAccount);
    });
  });

  describe('getAccountBalance', () => {
    it('devrait retourner le solde d\'un compte', async () => {
      // Arrange
      const accountId = 1;
      const userId = 1;
      const mockAccount = {
        balance: 1500.50,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING'
      };

      jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.getAccountBalance(accountId, userId);

      // Assert
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
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
      expect(result).toEqual({
        balance: 1500.50,
        accountNumber: 'ACC123456781234',
        accountType: 'CHECKING'
      });
    });

    it('devrait lever une erreur si le compte n\'existe pas', async () => {
      // Arrange
      const accountId = 999;
      const userId = 1;
      jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(null);

      // Act & Assert
      await expect(AccountService.getAccountBalance(accountId, userId)).rejects.toThrow(
        'Compte non trouvé'
      );
    });
  });

  describe('userOwnsAccount', () => {
    it('devrait retourner true si l\'utilisateur possède le compte', async () => {
      // Arrange
      const userId = 1;
      const accountId = 1;
      const mockAccount = {
        id: accountId,
        userId: userId
      };

      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(mockAccount as any);

      // Act
      const result = await AccountService.userOwnsAccount(userId, accountId);

      // Assert
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: accountId,
          userId: userId
        }
      });
      expect(result).toBe(true);
    });

    it('devrait retourner false si l\'utilisateur ne possède pas le compte', async () => {
      // Arrange
      const userId = 1;
      const accountId = 999;
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(null);

      // Act
      const result = await AccountService.userOwnsAccount(userId, accountId);

      // Assert
      expect(result).toBe(false);
    });
  });
});
