import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/cache-keys';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store';
import type { IAdmin, ITokenValidationResponse, IUser, IVendor } from '@/types';
import { UserRole } from '@/types';

let authInitPromise: Promise<void> | null = null;

const applyUserToStore = (user: IUser | IVendor | IAdmin) => {
  const store = useAuthStore.getState();

  const role = (user as { role?: UserRole }).role;

  switch (role) {
    case UserRole.USER:
      store.setAuth(user as IUser);
      break;
    case UserRole.VENDOR:
      store.setAuthVendor(user as IVendor);
      break;
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      store.setAuthAdmin(user as IAdmin);
      break;
    default:
      console.warn('Unknown role:', role);
      store.clearAuth();
  }
};

export const initializeAuth = async (queryClient?: QueryClient) => {
  const store = useAuthStore.getState();


  // If already initialized, return immediately
  if (store.isInitialized) {
    return;
  }

  // If promise already in progress, return existing promise
  if (authInitPromise) {
    return authInitPromise;
  }

  // Create new promise and store it
  authInitPromise = executeAuthInit(queryClient);

  return authInitPromise;
};

async function executeAuthInit(queryClient?: QueryClient): Promise<void> {
  const store = useAuthStore.getState();
  store.setLoading(true);
  
  try {
    const data = queryClient
      ? await queryClient.fetchQuery({
          queryKey: queryKeys.auth.validate(),
          queryFn: () => apiClient.getData<ITokenValidationResponse>('/auth/validate'),
          staleTime: Infinity,
          gcTime: 0,
        })
      : await apiClient.getData<ITokenValidationResponse>('/auth/validate');

      if (!data?.valid) {
      store.clearAuth();
      return;
    }

    applyUserToStore(data.user);
  } catch (error) {
    store.clearAuth();
  } finally {
    store.setLoading(false);
    store.setInitialized(true);
    authInitPromise = null;
  }
}

export const ensureAuthInitialized = async (queryClient?: QueryClient) => {
  const state = useAuthStore.getState();
  
  if (state.isInitialized) {
    return;
  }
  
  await initializeAuth(queryClient);
};

export const getLoginPathFromLocation = (pathname: string) => {
  if (pathname.startsWith('/admin')) return '/admin/login';
  if (pathname.startsWith('/vendor')) return '/vendor/login';
  return '/login';
};
