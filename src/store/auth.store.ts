import { create } from 'zustand';
import type { IUser, IAdmin, UserRole } from '@/types';
import type { IVendor } from '@/types/vendor.type';

interface AuthState {
  user: IUser | null;
  vendor: IVendor | null;
  admin: IAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Track if initial validation is complete
  role: UserRole | null;
  setAuth: (user: IUser) => void;
  setAuthVendor: (vendor: IVendor) => void;
  setAuthAdmin: (admin: IAdmin) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

/**
 * Auth Store - Single source of truth for authentication state
 * 
 * IMPORTANT: This store does NOT persist to localStorage
 * Authentication state is derived from HTTP-only cookies
 * Role information comes from the backend validation endpoint
 * 
 * Why no persistence?
 * - Prevents stale data
 * - Security: tokens in HTTP-only cookies only
 * - Single source of truth: backend validates on every load
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  vendor: null,
  admin: null,
  isAuthenticated: false,
  isLoading: true, // Start as true for initial validation
  isInitialized: false, // Track initialization completion
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
      isInitialized: true, // Initialization complete even when cleared
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));