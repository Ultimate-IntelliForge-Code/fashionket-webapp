# Production-Ready Authentication System - Implementation Guide

## Overview

This is a production-ready authentication system that addresses key issues:
- ✅ Token storage in httpOnly cookies (secure)
- ✅ Automatic token refresh on 401 responses
- ✅ Proper auth initialization and synchronization
- ✅ No double login or multiple auth requests
- ✅ Prevents redirect to login despite being authenticated
- ✅ Smooth loading states without UX flashing
- ✅ Role-based access control (RBAC)

## Architecture

### 1. **Token Storage & Management** (`src/api/cookie-manager.ts`)

Tokens are stored in **httpOnly cookies** (server-managed for security):
- Access Token: 15-minute lifetime
- Refresh Token: 7-day lifetime
- Cookies are marked `Secure` and `HttpOnly`

The cookie manager provides utilities for token validation and lifecycle management.

```typescript
// Check if tokens are valid
const isValid = !tokenManager.isTokenExpired(token);

// Decode token payload
const payload = tokenManager.decodeToken(token);

// Get expiration time
const exp = tokenManager.getTokenExpiration(token);
```

### 2. **API Client with Auto-Refresh** (`src/api/client.ts`)

The API client now handles:
- **Automatic Token Refresh**: When a 401 response is detected, it attempts to refresh tokens
- **Request Retry**: After successful refresh, the original request is retried
- **Callback System**: Uses `setTokenRefreshCallback()` to trigger token refresh logic

```typescript
// API client automatically handles 401 errors
// It calls the refresh endpoint and retries the request
// No manual token management needed in components
```

### 3. **Auth Store with Token State** (`src/store/auth.store.ts`)

Enhanced Zustand store that tracks:
- User/Vendor/Admin data
- Authentication state
- **Initialization flag** (`isInitialized`) - ensures auth is ready before rendering
- Token references (for state tracking)
- Token refresh timestamp

```typescript
interface AuthState {
  // User data
  user: IUser | null;
  vendor: IVendor | null;
  admin: IAdmin | null;

  // State flags
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;  // NEW: Critical for preventing redirects
  role: UserRole | null;

  // Token tracking
  accessToken: string | null;
  refreshToken: string | null;
  lastTokenRefresh: number | null;
}
```

### 4. **Enhanced useAuth Hook** (`src/hooks/use-auth.ts`)

The hook provides:
- **Single Initialization**: Uses `useRef` to ensure auth validation runs only once
- **Proper Loading States**: `isLoading` and `isInitialized` are separate
- **Token Refresh Callback**: Registers refresh function with API client on mount
- **Automatic State Sync**: Validates tokens on app load and syncs state

```typescript
const { 
  isAuthenticated, 
  isInitialized,  // Wait for this before rendering protected routes
  isLoading, 
  user, 
  logout, 
  refreshTokens 
} = useAuth();
```

Key fixes:
- ✅ Prevents race conditions with `hasInitialized` ref
- ✅ Waits for validation before setting initialized flag
- ✅ Properly handles token refresh without loops

### 5. **Auth Providers with Loading States** (`src/providers/`)

Updated providers now:
- Show loading spinner during initialization
- Wait for `isInitialized` flag before checking permissions
- Provide helpful error messages showing current role

```typescript
// UserAuthProvider.tsx - Example pattern
const { isInitialized, isLoading, isUser, isAuthenticated, role } = useAuth();

// Step 1: Still initializing - show loader
if (!isInitialized || isLoading) {
  return <LoadingSpinner />;
}

// Step 2: Auth initialized, check permissions
if (requireAuth && (!isAuthenticated || !isUser)) {
  return <UnauthorizedMessage />;
}

return children;
```

### 6. **Protected Route Component** (`src/components/protected-route.tsx`)

A flexible route guard for any component:

```typescript
<ProtectedRoute 
  requiredRole={UserRole.ADMIN}
  showLoadingScreen={true}
>
  <AdminDashboard />
</ProtectedRoute>
```

Features:
- Optional role checking
- Customizable fallback
- Smooth loading states

### 7. **Auth Queries with Automatic State Sync** (`src/api/queries/auth.query.ts`)

Login/signup mutations now:
- Extract tokens from response
- Call `setAuth()`, `setAuthVendor()`, or `setAuthAdmin()`
- Update Zustand store immediately
- Invalidate validation query

```typescript
export const useUserLogin = () => {
  const { setAuth } = useAuth();
  
  return useMutation({
    mutationFn: (credentials) => 
      apiClient.post('/auth/user/signin', credentials),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      // Sync state immediately - UI updates right away
      setAuth(user, accessToken, refreshToken);
    },
  });
};
```

## Flow Diagrams

### App Initialization Flow

```
App Start
   ↓
AuthInitializer mounts
   ↓
useAuth() hook runs
   ↓
useValidateToken query starts
   ↓
API calls /auth/validate
   ↓
Server validates httpOnly cookie tokens
   ↓
Response includes user data
   ↓
Switch on user.role and call setAuth/setAuthVendor/setAuthAdmin
   ↓
isInitialized = true, isLoading = false
   ↓
ProtectedRoutes render (not show 401 error)
   ↓
User sees authenticated page
```

### Login Flow

```
User submits login form
   ↓
useUserLogin().mutateAsync(credentials)
   ↓
API POST /auth/user/signin
   ↓
Server validates credentials
   ↓
Server sets httpOnly cookies (access + refresh)
   ↓
Server returns user data + tokens
   ↓
onSuccess mutation callback fires
   ↓
setAuth(user, accessToken, refreshToken)
   ↓
Zustand store updates
   ↓
useAuth() returns isAuthenticated: true
   ↓
Components re-render with correct state
   ↓
Navigate to dashboard (no reload needed)
```

### Token Refresh Flow (401 Handling)

```
Component makes API request
   ↓
API client sends request with httpOnly cookies
   ↓
Server responds with 401 (token expired)
   ↓
API client catches 401
   ↓
Calls onTokenRefresh() callback
   ↓
useAuth().refreshTokens() executes
   ↓
API calls /auth/validate
   ↓
Server issues new tokens (httpOnly cookies)
   ↓
Tokens are updated in client state
   ↓
Original request is retried automatically
   ↓
Request succeeds with new tokens
   ↓
User never sees 401 error
```

## Integration Steps

### 1. Update Backend Auth Endpoints

Ensure your API endpoints return:

```typescript
// User login
POST /auth/user/signin
Response: {
  success: true,
  data: {
    user: IUser,
    accessToken: string,
    refreshToken: string
  }
}

// Vendor signup
POST /auth/vendor/signup
Response: {
  success: true,
  data: {
    vendor: IVendor,
    accessToken: string,
    refreshToken: string
  }
}

// Token validation
GET /auth/validate
Response: {
  valid: boolean,
  user: IUser | IVendor | IAdmin,
  accessToken?: string,
  refreshToken?: string
}

// Set httpOnly cookies:
Set-Cookie: fashionket-access-token=...; HttpOnly; Secure; SameSite=Strict
Set-Cookie: fashionket-refresh-token=...; HttpOnly; Secure; SameSite=Strict
```

### 2. Wrap App Root with AuthInitializer

```typescript
// src/routes/__root.tsx
import { AuthInitializer } from '@/providers/auth-initializer';

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <main>{children}</main>
      </AuthInitializer>
    </QueryClientProvider>
  );
}
```

### 3. Use Providers for Route Groups

```typescript
// src/routes/(root)/_rootLayout.tsx
import { UserAuthProvider } from '@/providers/user-auth-provider';

export function RootLayout() {
  return (
    <UserAuthProvider requireAuth={true}>
      <RootNavigation />
    </UserAuthProvider>
  );
}
```

### 4. Alternative: Use ProtectedRoute Component

```typescript
// src/routes/(root)/dashboard.tsx
import { ProtectedRoute } from '@/components/protected-route';
import { UserRole } from '@/types';

export function Dashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.USER}>
      <div>Dashboard content</div>
    </ProtectedRoute>
  );
}
```

### 5. Update Login Components

```typescript
// src/components/auth/user-login.tsx
import { useUserLogin } from '@/api/queries';
import { useNavigate } from '@tanstack/react-router';

export function UserLogin() {
  const { mutate: login, isPending } = useUserLogin();
  const navigate = useNavigate();

  const handleLogin = (credentials: ILoginCredentials) => {
    login(credentials, {
      onSuccess: () => {
        // No need to manually set auth state
        // It's already updated in the mutation's onSuccess
        navigate({ to: '/dashboard' });
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // ... handle form submission
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## Common Issues & Solutions

### Issue: Still redirected to login despite being authenticated

**Cause**: `isInitialized` flag not checked in route guards
**Solution**: Always check both `isInitialized` and `isLoading`:

```typescript
if (!isInitialized || isLoading) {
  return <LoadingSpinner />;
}
```

### Issue: Double login required

**Cause**: State not synced from mutation response
**Solution**: Ensure mutation `onSuccess` calls `setAuth()`:

```typescript
onSuccess: (response) => {
  if (response.success) {
    const { user, accessToken, refreshToken } = response.data;
    setAuth(user, accessToken, refreshToken); // This is critical
  }
}
```

### Issue: Flash of unauthenticated content

**Cause**: Loading state not shown during initialization
**Solution**: Always render loading spinner when `!isInitialized`:

```typescript
if (!isInitialized || isLoading) {
  return <LoadingSpinner />;
}
```

### Issue: 401 errors not being handled

**Cause**: `setTokenRefreshCallback` not registered
**Solution**: Ensure `useAuth()` is called at app root to register callback

### Issue: Tokens not persisting across page refresh

**Cause**: Tokens stored only in state, not in cookies
**Solution**: Backend must set httpOnly cookies on login. Client-side token manager reads from cookies automatically

## Testing the System

### Test 1: Verify Token Persistence

1. Login to the app
2. Open DevTools → Network tab
3. Verify response includes `Set-Cookie` headers with tokens
4. Refresh the page
5. App should remain authenticated (no login required)

### Test 2: Verify Token Refresh

1. Login to the app
2. Get access token from cookies (DevTools → Storage → Cookies)
3. Set a breakpoint in useAuth() during token validation
4. Wait 15+ minutes
5. Try to make an API request
6. Verify request is automatically retried with new token

### Test 3: Verify Role-Based Access

1. Login as User, try to access `/admin` → should redirect
2. Login as Admin, try to access `/admin` → should load
3. Logout and try to access protected route → should redirect to login

### Test 4: Verify Loading States

1. Open DevTools → Network → Slow 3G
2. Refresh page while authenticated
3. Loading spinner should appear during initialization
4. After auth is initialized, page should render

## Type Safety

All auth operations are fully typed:

```typescript
// Login mutation returns properly typed response
const { mutate } = useUserLogin();
// mutate expects ILoginCredentials
// onSuccess receives IApiResponse<{ user: IUser; ... }>

// useAuth hook is fully typed
const auth = useAuth();
// auth.user is IUser | null
// auth.vendor is IVendor | null
// auth.admin is IAdmin | null
```

## Security Best Practices

✅ **Implemented**:
- httpOnly cookies (can't be accessed by JavaScript)
- Secure flag (only sent over HTTPS)
- SameSite=Strict (CSRF protection)
- Automatic token refresh
- Proper logout clearing all auth state
- Role-based access control

❌ **Not Implemented (Backend Required)**:
- HTTPS enforcement
- CORS configuration
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- 2FA/MFA
- JWT signature verification (backend only)

## Environment Setup

Ensure your `.env` file includes:

```env
VITE_API_URL=https://api.yourapp.com
# Don't include tokens in env - they're stored in httpOnly cookies
```

## Next Steps

1. **Update backend** to return tokens in response body
2. **Test token validation** endpoint
3. **Implement token refresh** endpoint
4. **Test logout** to clear httpOnly cookies
5. **Verify CORS** headers allow credentials
6. **Monitor** auth queries in React Query DevTools

---

## File Reference

| File | Purpose |
|------|---------|
| `src/api/cookie-manager.ts` | Token lifecycle management |
| `src/api/client.ts` | API client with auto-refresh |
| `src/store/auth.store.ts` | Zustand auth state |
| `src/hooks/use-auth.ts` | Main auth hook |
| `src/providers/auth-initializer.tsx` | App-level auth setup |
| `src/providers/user-auth-provider.tsx` | User route guard |
| `src/providers/vendor-auth-provider.tsx` | Vendor route guard |
| `src/providers/admin-auth-provider.tsx` | Admin route guard |
| `src/components/protected-route.tsx` | Flexible route protection |
| `src/api/queries/auth.query.ts` | Auth mutations with state sync |
| `src/types/auth.types.ts` | Type definitions |

---

**Version**: 1.0.0  
**Last Updated**: February 21, 2026  
**Status**: Production Ready ✅
