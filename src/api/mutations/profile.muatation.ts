import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { queryKeys } from '../cache-keys';
import type {
  IUpdateUserPayload,
  IUpdateAdminPayload,
  IUpdateVendorPayload,
  IUser,
  IVendor,
  IAdmin,
} from '@/types';

/**
 * Update user profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateUserPayload) =>
      apiClient.patchData<IUser>('/profile/user', data),
    onSuccess: (response) => {
      // Update the profile cache with new data
      queryClient.setQueryData(
        queryKeys.profile.user(),
        response
      );
      // Invalidate auth validation to refresh token if email changed
      if (response.email) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.auth.validate(),
        });
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.profile.user(),
        });
      }
    },
  });
};

/**
 * Update vendor profile
 */
export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateVendorPayload) =>
      apiClient.patchData<IVendor>('/profile/vendor', data),
    onSuccess: (response) => {
      // Update the profile cache with new data
      queryClient.setQueryData(
        queryKeys.profile.vendor(),
        response
      );
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.vendor.detail('profile') 
      });
      // Refresh token if email or business name changed
      if (response.email || response.businessName) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.auth.validate() 
        });
          queryClient.invalidateQueries({ 
          queryKey: queryKeys.profile.vendor(),
        });
      }
    },
  });
};

/**
 * Update admin profile
 */
export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateAdminPayload) =>
      apiClient.patchData<IAdmin>('/profile/admin', data),
    onSuccess: (response) => {
      // Update the profile cache with new data
      queryClient.setQueryData(
        queryKeys.profile.admin(),
        response
      );
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.admin.detail('profile') 
      });
      // Refresh token if email changed
      if (response.email) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.auth.validate() 
        });
          queryClient.invalidateQueries({ 
          queryKey: queryKeys.profile.admin(),
        });
      }
    },
  });
};