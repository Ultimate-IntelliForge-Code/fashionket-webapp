import { useQuery } from '@tanstack/react-query';
import type { IOrderQueryFilters } from '@/types';
import {
  ordersQuery,
  orderQuery,
  orderByNumberQuery,
  orderStatsQuery,
} from '../queries';
import { useAuthStore } from '@/store';

/**
 * Hook for fetching orders list
 */
export const useOrdersQuery = (filters?: IOrderQueryFilters) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  return useQuery({
    ...ordersQuery(filters),
    enabled: isInitialized && isAuthenticated,
  });
};

/**
 * Hook for fetching a single order by ID
 */
export const useOrderQuery = (id: string, enabled = true) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  return useQuery({
    ...orderQuery(id),
    enabled: !!id && enabled && isInitialized && isAuthenticated,
  });
};

/**
 * Hook for fetching a single order by order number
 */
export const useOrderByNumberQuery = (orderNumber: string, enabled = true) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  return useQuery({
    ...orderByNumberQuery(orderNumber),
    enabled: !!orderNumber && enabled && isInitialized && isAuthenticated,
  });
};

/**
 * Hook for fetching order statistics
 */
export const useOrderStatsQuery = (userId?: string) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  return useQuery({
    ...orderStatsQuery(userId),
    enabled: isInitialized && isAuthenticated,
  });
};