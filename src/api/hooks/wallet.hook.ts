import { useQuery } from '@tanstack/react-query';
import { walletStatsQuery, withdrawalsQuery, type WithdrawalQueryFilters } from '../queries/wallet.query';
import { useRequestWithdrawalMutation } from '../mutations/wallet.mutation';
import type { IWalletStats, IWithdrawalListResponse } from '@/types';

export const useWalletStatsQuery = (vendorId?: string) =>
  useQuery<IWalletStats>(walletStatsQuery(vendorId));

export const useWithdrawalsQuery = (filters?: WithdrawalQueryFilters) =>
  useQuery<IWithdrawalListResponse>(withdrawalsQuery(filters));

export { useRequestWithdrawalMutation };
