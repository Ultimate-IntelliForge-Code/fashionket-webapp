import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useLogout } from '@/api/mutations';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/types';
import { useValidateToken } from '@/api/queries';

/**
 * useAuth Hook - Centralized authentication logic
 * 
 * Key improvements:
 * 1. Validates token only once on mount (not on every navigation)
 * 2. Uses isInitialized flag to prevent re-validation loops
 * 3. Role comes from backend cookie validation, not localStorage
 * 4. Clears stale data when validation fails
 */
export const useAuth = () => {
  const {
    user,
    vendor,
    admin,
    isAuthenticated,
    isLoading,
    isInitialized,
    role,
    setAuth,
    setAuthAdmin,
    setAuthVendor,
    clearAuth,
    setLoading,
    setInitialized,
  } = useAuthStore();

  // Only validate if not already initialized
  // This prevents infinite validation loops on navigation
  const shouldValidate = !isInitialized;

  const validation =
    useValidateToken(shouldValidate);

  const { mutateAsync: logoutMutate } = useLogout();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      await logoutMutate();
    } finally {
      clearAuth();
      queryClient.clear();
      // Redirect to login page
      window.location.href = '/login';
    }
  }, [logoutMutate, clearAuth, queryClient]);

  // Sync auth state with token validation (only runs once on mount)
  useEffect(() => {
    // Skip if already initialized or still validating
    if (isInitialized || validation.isPending) {
      return;
    }

    // Validation failed or no data
    if (!validation.data?.valid) {
      clearAuth();
      setLoading(false);
      setInitialized(true);
      return;
    }

    const user = validation.data.user;

    console.log('Auth initialized:');

    // Set auth based on role from backend validation
    switch (user.role) {
      case UserRole.USER:
        setAuth(user); // Sets user, role, isAuthenticated, isInitialized
        break;

      case UserRole.VENDOR:
        setAuthVendor(user); // Sets vendor, role, isAuthenticated, isInitialized
        break;

      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        setAuthAdmin(user); // Sets admin, role, isAuthenticated, isInitialized
        break;

      default:
        console.warn('Unknown role:', (user as any).role);
        clearAuth();
    }

    setLoading(false);
    setInitialized(true);
  }, [
    validation,
    validation.isPending,
    isInitialized,
    setAuth,
    setAuthAdmin,
    setAuthVendor,
    clearAuth,
    setLoading,
    setInitialized,
  ]);

  // Computed role checks
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
  const isVendor = role === UserRole.VENDOR;
  const isUser = role === UserRole.USER;
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;

  return {
    user,
    vendor,
    admin,
    isAuthenticated,
    isLoading: isLoading || validation.isPending,
    isInitialized,
    role,
    isAdmin,
    isVendor,
    isUser,
    isSuperAdmin,
    setAuth,
    setAuthVendor,
    setAuthAdmin,
    clearAuth,
    logout,
  };
};