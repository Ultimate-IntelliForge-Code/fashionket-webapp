import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../cache-keys';
import { apiClient } from '../client';
import type { ITokenValidationResponse } from '@/types';

export const useValidateToken = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.auth.validate(),
    queryFn: () => apiClient.getData<ITokenValidationResponse>('/auth/validate'),
    enabled,
    retry: false,
    // No staleTime — we validate exactly once per boot, result is irrelevant
    // after that. Refresh is handled by useTokenRefresh, not react-query.
    staleTime: Infinity,
    gcTime: 0,
  });

export const useRefreshToken = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.auth.refresh(),
    queryFn: () => apiClient.getData<ITokenValidationResponse>('/auth/refresh'),
    enabled,
    retry: 1,
    staleTime: Infinity,
    gcTime: 0,
  });