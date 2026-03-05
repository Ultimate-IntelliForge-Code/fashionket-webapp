import { useQuery } from '@tanstack/react-query';
import { addressesQuery, addressQuery, shippingFeeQuery } from '../queries';

/**
 * Hook for fetching cart
 */
export const useAddressesQuery = () => {
  return useQuery(addressesQuery());
};

export const useAddressQuery = (addressId: string) => {
  return useQuery(addressQuery(addressId));
};

export const useShippingFeeQuery = (addressId: string) => {
  // console.log('Using shipping fee query for address ID:', addressId);
  return useQuery(shippingFeeQuery(addressId));
};