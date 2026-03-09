import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { IUser, IAdmin, UserRole } from '@/types';
import type { IVendor } from '@/types/vendor.type';

interface AuthState {
  user: IUser | null;
  vendor: IVendor | null;
  admin: IAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  role: UserRole | null;

  setAuth: (user: IUser) => void;
  setAuthVendor: (vendor: IVendor) => void;
  setAuthAdmin: (admin: IAdmin) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      vendor: null,
      admin: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,
      role: null,

      setAuth: (user) =>
        set({
          user,
          vendor: null,
          admin: null,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
          isInitialized: true,
        }),

      setAuthVendor: (vendor) =>
        set({
          vendor,
          user: null,
          admin: null,
          isAuthenticated: true,
          role: vendor.role,
          isLoading: false,
          isInitialized: true,
        }),

      setAuthAdmin: (admin) =>
        set({
          admin,
          user: null,
          vendor: null,
          isAuthenticated: true,
          role: admin.role,
          isLoading: false,
          isInitialized: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          vendor: null,
          admin: null,
          isAuthenticated: false,
          role: null,
          isLoading: false,
          isInitialized: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
    }),
    {
      name: 'fhk-auth-storage',

      // Optional: only persist safe fields
      partialize: (state) => ({
        user: state.user,
        vendor: state.vendor,
        admin: state.admin,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);