import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store';
import { UserRole } from '@/types';
import { apiClient } from '@/api/client';
import type { ITokenValidationResponse } from '@/types';

// access_token lives 15 min — refresh 60s before expiry
const REFRESH_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export const useTokenRefresh = () => {
  const store = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doRefresh = async () => {
    if (!store.isAuthenticated) return;

    try {
      const data = await apiClient.getData<ITokenValidationResponse>('/auth/refresh');

      if (!data?.valid) {
        store.clearAuth();
        window.location.href = '/';
        return;
      }

      // Backend rotated the cookie — update in-memory user data
      // in case any fields changed (e.g. role promotion).
      const { user } = data;
      switch (user.role) {
        case UserRole.USER:        store.setAuth(user);       break;
        case UserRole.VENDOR:      store.setAuthVendor(user); break;
        case UserRole.ADMIN:
        case UserRole.SUPER_ADMIN: store.setAuthAdmin(user);  break;
        default:
          store.clearAuth();
      }
    } catch {
      // Network blip — don't log out, try again next cycle.
      // The backend will 401 on the next real request if the token
      // truly expired, and the apiClient error handler catches that.
    }
  };

  useEffect(() => {
    // Don't start the timer until auth is confirmed
    if (!store.isAuthenticated || !store.isInitialized) return;

    timerRef.current = setInterval(doRefresh, REFRESH_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [store.isAuthenticated, store.isInitialized]);
};