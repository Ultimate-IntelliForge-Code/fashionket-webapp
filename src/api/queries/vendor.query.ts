import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type {
  IVendor,
  IPaginatedResponse,
  FrontendSafe,
  IProductQueryFilters,
  IProductListItem,
} from '@/types';

export interface IVendorQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  verified?: boolean;
  isActive?: boolean;
}

export interface IVendorWithProducts extends IVendor {
  products?: any[];
}

/**
 * Query options factory for vendors list
 */
export const vendorsQuery = (filters?: IVendorQueryFilters) => ({
  queryKey: queryKeys.vendor.all(filters),
  queryFn: async (): Promise<IPaginatedResponse<FrontendSafe<IVendor>[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<IPaginatedResponse<FrontendSafe<IVendor>[]>>(
      `/vendors?${params.toString()}`
    );

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});

/**
 * Query options factory for single vendor by slug
 */
export const vendorBySlugQuery = (slug: string) => ({
  queryKey: queryKeys.vendor.detail(slug),
  queryFn: async (): Promise<FrontendSafe<IVendor>> => {
    const response = await apiClient.get<FrontendSafe<IVendor>>(`/vendors/${slug}`);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});

/**
 * Query options factory for vendor's products by slug
 */
export const vendorProductsBySlugQuery = (
  slug: string,
  filters?: IProductQueryFilters
) => ({
  queryKey: queryKeys.vendor.all(filters),
  queryFn: async ():Promise<IPaginatedResponse<FrontendSafe<IProductListItem[]>>> => {
     const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<any>(
      `/vendors/${slug}/products?${params.toString()}`
    );

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
});
