import { Request } from 'express';
import { Decimal } from '@prisma/client/runtime/library';

export interface IUser {
  id: number;
  email: string;
  password: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: Date | null;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccount {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: Decimal;
  isActive: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  id: number;
  amount: Decimal;
  type: string;
  status: string;
  description?: string | null;
  reference: string;
  fromAccountId?: number | null;
  toAccountId?: number | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ICreateAccountRequest {
  accountType?: string;
  initialBalance?: number;
}

export interface IDepositRequest {
  accountId: number;
  amount: number;
  description?: string;
}

export interface IWithdrawalRequest {
  accountId: number;
  amount: number;
  description?: string;
}

export interface ITransferRequest {
  fromAccountId: number;
  toAccountNumber: string;
  amount: number;
  description?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Partial<IUser>;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}

export interface IPaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IAuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
