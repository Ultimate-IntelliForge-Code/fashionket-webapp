import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type { ICreateWithdrawalRequest, IWithdrawal } from '@/types';

export const requestWithdrawalMutation = async (
  payload: ICreateWithdrawalRequest,
): Promise<IWithdrawal> => {
  const response = await apiClient.post<IWithdrawal>('/wallet/withdrawals', payload);

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const useRequestWithdrawalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestWithdrawalMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.withdrawals() });
    },
  });
};
