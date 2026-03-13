import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type { IWalletStats, IWithdrawalListResponse, WithdrawalStatus } from '@/types';

export const walletStatsQuery = (vendorId?: string) => ({
  queryKey: queryKeys.wallet.stats(vendorId),
  queryFn: async (): Promise<IWalletStats> => {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await apiClient.get<IWalletStats>(`/stats/vendor/wallet${params}`);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});

export interface WithdrawalQueryFilters {
  page?: number;
  limit?: number;
  status?: WithdrawalStatus;
  vendorId?: string;
}

export const withdrawalsQuery = (filters?: WithdrawalQueryFilters) => ({
  queryKey: queryKeys.wallet.withdrawals(filters?.vendorId, filters),
  queryFn: async (): Promise<IWithdrawalListResponse> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vendorId) params.append('vendorId', filters.vendorId);

    const queryString = params.toString();
    const url = `/wallet/withdrawals${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<IWithdrawalListResponse>(url);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});
