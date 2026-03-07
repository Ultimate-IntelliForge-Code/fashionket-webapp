import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../cache-keys";
import { apiClient } from "../client";
import { ITokenValidationResponse } from "@/types";

// Queries
export const useValidateToken = (enabled: boolean) => {
  return useQuery({
    queryKey: queryKeys.auth.validate(),
    queryFn: () =>
      apiClient.getData<ITokenValidationResponse>('/auth/validate'),
    retry: false,
    staleTime: 2 * 60 * 1000,
    enabled, // 👈 CRITICAL
  });
};