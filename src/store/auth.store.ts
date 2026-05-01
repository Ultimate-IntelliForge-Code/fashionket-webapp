import { create } from 'zustand';
import type { IUser, IAdmin, UserRole } from '@/types';
import type { IVendor } from '@/types/vendor.type';

export interface AuthState {
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

const initialState = {
  user: null,
  vendor: null,
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  // Stays false until /auth/validate resolves — no persist means
  // every cold boot starts fresh and hits the backend once.
  isInitialized: false,
  role: null,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,

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
      ...initialState,
      isLoading: false,
      // Keep isInitialized true so we don't re-validate after logout.
      // The store is in-memory: next page load starts fresh anyway.
      isInitialized: true,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));