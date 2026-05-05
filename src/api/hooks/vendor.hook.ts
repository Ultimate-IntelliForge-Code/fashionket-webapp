import { useQuery } from '@tanstack/react-query';
import type { IVendorQueryFilters } from '@/api/queries/vendor.query';
import {
  vendorsQuery,
  vendorBySlugQuery,
  vendorProductsBySlugQuery,
} from '../queries';
import { IProductQueryFilters } from '@/types';

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
 * Hook for fetching vendor's by slug products
 */
export const useVendorbySlugProducts = (
  slug: string,
  filters?: IProductQueryFilters,
  enabled = true
) => {
  return useQuery({
    ...vendorProductsBySlugQuery(slug, filters),
    enabled: !!slug && enabled,
  });
};


