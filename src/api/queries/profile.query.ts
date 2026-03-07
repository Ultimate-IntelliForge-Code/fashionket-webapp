import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type {
  IUser,
  IVendor,
  IAdmin,
} from '@/types';

/**
 * Get current user profile
 */
export const userProfile = () => ({
  queryKey: queryKeys.profile.user(),
  queryFn: async (): Promise<IUser> => {
    const response = await apiClient.get<IUser>('/profile/user');

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  }
})

/**
 * Get current vendor profile
 */
export const vendorProfile =  () => ({
  queryKey: queryKeys.profile.user(),
  queryFn: async (): Promise<IVendor> => {
    const response = await apiClient.get<IVendor>('/profile/vendor');

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  }
})


/**
 * Get current admin profile
 */
export const adminProfile = () => ({
  queryKey: queryKeys.profile.user(),
  queryFn: async (): Promise<IAdmin> => {
    const response = await apiClient.get<IAdmin>('/profile/admin');

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return response.data;
  }
})
