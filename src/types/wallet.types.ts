import type { IBaseDocument, IPaginatedResponse, ITimestamps } from './base.types';

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export interface IWithdrawal extends IBaseDocument, ITimestamps {
  vendorId: string;
  amount: number; // kobo
  fee?: number;
  status: WithdrawalStatus;
  method: string;
  reference: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  processedAt?: Date | string | null;
}

export interface IWalletStats {
  netProfit: number;
  balance: number;
  totalWithdrawals: number;
  platformCharges: number;
  pendingWithdrawals: number;
}

export interface IWithdrawalListResponse {
  items: IWithdrawal[];
  pagination: IPaginatedResponse<IWithdrawal[]>['pagination'];
}

export interface ICreateWithdrawalRequest {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  amount: number; // naira
  method?: string;
}
