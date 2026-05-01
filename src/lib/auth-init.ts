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

  console.log('[AUTH-INIT] initializeAuth called, isInitialized:', store.isInitialized, 'authInitPromise:', !!authInitPromise);

  // If already initialized, return immediately
  if (store.isInitialized) {
    console.log('[AUTH-INIT] Already initialized, returning early');
    return;
  }

  // If promise already in progress, return existing promise
  if (authInitPromise) {
    console.log('[AUTH-INIT] Auth promise already in progress, returning existing promise');
    return authInitPromise;
  }

  // Create new promise and store it
  console.log('[AUTH-INIT] Creating new auth initialization promise');
  authInitPromise = executeAuthInit(queryClient);

  return authInitPromise;
};

async function executeAuthInit(queryClient?: QueryClient): Promise<void> {
  const store = useAuthStore.getState();
  store.setLoading(true);
  
  try {
    console.log('[AUTH-INIT] Starting /auth/validate request...');
    const data = queryClient
      ? await queryClient.fetchQuery({
          queryKey: queryKeys.auth.validate(),
          queryFn: () => apiClient.getData<ITokenValidationResponse>('/auth/validate'),
          staleTime: Infinity,
          gcTime: 0,
        })
      : await apiClient.getData<ITokenValidationResponse>('/auth/validate');

    console.log('[AUTH-INIT] Response received:', { 
      valid: data?.valid, 
      hasUser: !!data?.user,
      userRole: (data?.user as any)?.role 
    });

    if (!data?.valid) {
      console.log('[AUTH-INIT] Token not valid or missing, clearing auth');
      store.clearAuth();
      return;
    }

    console.log('[AUTH-INIT] Token valid, setting user in store');
    applyUserToStore(data.user);
    console.log('[AUTH-INIT] User set successfully:', {
      isAuthenticated: store.isAuthenticated,
      role: store.role
    });
  } catch (error) {
    console.error('[AUTH-INIT] Error during auth validation:', error);
    console.log('[AUTH-INIT] Treating error as unauthenticated (likely 401 Unauthorized)');
    store.clearAuth();
  } finally {
    store.setLoading(false);
    store.setInitialized(true);
    authInitPromise = null;
    console.log('[AUTH-INIT] Initialization complete, isInitialized:', store.isInitialized, 'isAuthenticated:', store.isAuthenticated);
  }
}

export const ensureAuthInitialized = async (queryClient?: QueryClient) => {
  const state = useAuthStore.getState();
  console.log('[ENSURE-AUTH] Called, isInitialized:', state.isInitialized);
  
  if (state.isInitialized) {
    console.log('[ENSURE-AUTH] Already initialized, returning');
    return;
  }
  
  console.log('[ENSURE-AUTH] Not initialized, calling initializeAuth');
  await initializeAuth(queryClient);
  console.log('[ENSURE-AUTH] initializeAuth promise resolved');
};

export const getLoginPathFromLocation = (pathname: string) => {
  if (pathname.startsWith('/admin')) return '/admin/login';
  if (pathname.startsWith('/vendor')) return '/vendor/login';
  return '/login';
};
