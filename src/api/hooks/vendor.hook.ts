import { useQuery } from '@tanstack/react-query';
import type { IVendorQueryFilters } from '@/api/queries/vendor.query';
import {
  vendorsQuery,
  vendorBySlugQuery,
  vendorProductsBySlugQuery,
} from '../queries';

/**
 * Hook for fetching vendors list with filters
 */
export const useVendors = (filters?: IVendorQueryFilters) => {
  return useQuery(vendorsQuery(filters));
};

/**
 * Hook for fetching a single vendor by slug
 */
export const useVendorBySlug = (slug: string, enabled = true) => {
  return useQuery({
    ...vendorBySlugQuery(slug),
    enabled: !!slug && enabled,
  });
};

/**
 * Hook for fetching vendor's products
 */
export const useVendorProducts = (
  slug: string,
  page?: number,
  limit?: number,
  enabled = true
) => {
  return useQuery({
    ...vendorProductsBySlugQuery(slug, { page, limit }),
    enabled: !!slug && enabled,
  });
};
