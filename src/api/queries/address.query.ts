import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type { FrontendSafe, IAddress, IShippingResponse } from '@/types';

/**
 * Query options factory for cart
 */
export const addressesQuery = () => ({
  queryKey: queryKeys.addresses.lists(),
  queryFn: async (): Promise<FrontendSafe<IAddress[]>> => {
    const response = await apiClient.get<FrontendSafe<IAddress[]>>('/address');

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
}); 

export const addressQuery = (addressId: string) => ({
  queryKey: queryKeys.addresses.detail(addressId),
  queryFn: async (): Promise<FrontendSafe<IAddress>> => {
    const response = await apiClient.get<FrontendSafe<IAddress>>(`/address/${addressId}`);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
}); 


export const shippingFeeQuery = (addressId: string) => ({
  queryKey: queryKeys.addresses.detail(addressId),
  queryFn: async (): Promise<FrontendSafe<IShippingResponse>> => {
    console.log('Fetching shipping fee for address ID:', addressId);
    const path = `/address/calculate/${addressId}`;
    console.log('API endpoint:', path);
    const response = await apiClient.get<FrontendSafe<IShippingResponse>>(path);

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
}); 