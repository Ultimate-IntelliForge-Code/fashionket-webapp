import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type { IVendorDashboardStats, IVendorChartsStats } from '@/types';

export const vendorDashboardStatsQuery = (vendorId?: string) => ({
  queryKey: queryKeys.stats.vendorOverview(vendorId),
  queryFn: async (): Promise<IVendorDashboardStats> => {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await apiClient.get<IVendorDashboardStats>(`/stats/vendor/overview${params}`);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});

export const vendorChartsStatsQuery = (vendorId?: string) => ({
  queryKey: queryKeys.stats.vendorCharts(vendorId),
  queryFn: async (): Promise<IVendorChartsStats> => {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    const response = await apiClient.get<IVendorChartsStats>(`/stats/vendor/charts${params}`);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});
