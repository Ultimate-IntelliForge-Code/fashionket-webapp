import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useLogout } from '@/api/mutations';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/types';
import { initializeAuth } from '@/lib/auth-init';

export const useAuth = () => {
  const store = useAuthStore();
  const { mutateAsync: logoutMutate } = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (store.isInitialized) return;
    void initializeAuth(queryClient);
  }, [queryClient, store.isInitialized]);

  const logout = useCallback(async () => {
    try {
      await logoutMutate();
    } finally {
      store.clearAuth();
      queryClient.clear();
      window.location.href = '/';
    }
  }, [logoutMutate, queryClient]);

  return {
    user: store.user,
    vendor: store.vendor,
    admin: store.admin,
    isAuthenticated: store.isAuthenticated,
  isLoading: store.isLoading || !store.isInitialized,
    isInitialized: store.isInitialized,
    role: store.role,
    isAdmin: store.role === UserRole.ADMIN || store.role === UserRole.SUPER_ADMIN,
    isVendor: store.role === UserRole.VENDOR,
    isUser: store.role === UserRole.USER,
    isSuperAdmin: store.role === UserRole.SUPER_ADMIN,
    setAuth: store.setAuth,
    setAuthVendor: store.setAuthVendor,
    setAuthAdmin: store.setAuthAdmin,
    clearAuth: store.clearAuth,
    logout,
  };
};