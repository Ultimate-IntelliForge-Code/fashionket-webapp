# Production Auth System - Implementation Checklist

## Pre-Implementation Review

- [ ] Review `PRODUCTION_AUTH_SYSTEM.md` for architecture overview
- [ ] Understand token flow diagrams
- [ ] Review security best practices section

## Backend Requirements

### Authentication Endpoints

- [ ] **POST /auth/user/signin**
  - Input: `{ email, password }`
  - Output: `{ user, accessToken, refreshToken }`
  - Sets httpOnly cookies: `fashionket-access-token`, `fashionket-refresh-token`
  - Access token: 15-minute expiry
  - Refresh token: 7-day expiry

- [ ] **POST /auth/user/signup**
  - Input: `{ email, password, fullName?, phone? }`
  - Output: `{ user, accessToken, refreshToken }`
  - Auto-login after signup

- [ ] **POST /auth/vendor/signin**
  - Input: `{ email, password }`
  - Output: `{ vendor, accessToken, refreshToken }`
  - Sets same httpOnly cookies

- [ ] **POST /auth/vendor/signup**
  - Input: `{ email, password, fullName?, phone? }`
  - Output: `{ vendor, accessToken, refreshToken }`

- [ ] **POST /auth/admin/signin**
  - Input: `{ email, password }`
  - Output: `{ admin, accessToken, refreshToken }`

- [ ] **GET /auth/validate**
  - Reads httpOnly cookies
  - Validates tokens
  - Output: `{ valid: boolean, user?, accessToken?, refreshToken? }`
  - Returns 401 if token expired and no refresh available

- [ ] **POST /auth/logout**
  - Clears httpOnly cookies
  - Invalidates refresh token
  - Output: `{ message: "Logged out" }`

### Cookie Configuration

- [ ] httpOnly flag set to true (not accessible via JS)
- [ ] Secure flag set to true (HTTPS only)
- [ ] SameSite=Strict (CSRF protection)
- [ ] Domain and path correctly configured
- [ ] Expiration dates set properly

### CORS Configuration

- [ ] `credentials: include` requests allowed
- [ ] `Access-Control-Allow-Credentials: true` header set
- [ ] `Access-Control-Allow-Origin` includes your domain (not `*`)

## Frontend Implementation

### 1. Setup Files

- [x] `src/api/cookie-manager.ts` - Created
- [x] `src/store/auth.store.ts` - Updated with token management
- [x] `src/hooks/use-auth.ts` - Enhanced with proper initialization
- [x] `src/api/client.ts` - Added token refresh callback
- [x] `src/providers/auth-initializer.tsx` - Already exists
- [x] `src/providers/user-auth-provider.tsx` - Updated
- [x] `src/providers/vendor-auth-provider.tsx` - Updated
- [x] `src/providers/admin-auth-provider.tsx` - Updated
- [x] `src/components/protected-route.tsx` - Created
- [x] `src/api/queries/auth.query.ts` - Enhanced with state sync
- [x] `src/types/auth.types.ts` - Updated response types

### 2. App Root Configuration

- [ ] Verify AuthInitializer wraps entire app
- [ ] Verify QueryClientProvider wraps AuthInitializer
- [ ] Test app loads without errors

### 3. Login/Signup Pages

- [ ] Update login form to use `useUserLogin()` mutation
- [ ] Update vendor login to use `useVendorLogin()` mutation
- [ ] Update admin login to use `useAdminLogin()` mutation
- [ ] Ensure form submission calls `mutate()` function
- [ ] Verify error handling shows user-friendly messages
- [ ] Test successful login redirects to dashboard

### 4. Protected Routes

Choose ONE approach (recommend ProtectedRoute for simplicity):

#### Option A: Use Providers (Recommended for Route Groups)

- [ ] Wrap route groups with `UserAuthProvider`, `VendorAuthProvider`, or `AdminAuthProvider`
- [ ] Test that loading spinner shows during initialization
- [ ] Test that unauthenticated users are redirected
- [ ] Test that wrong role users see permission error

Example:
```typescript
// src/routes/(root)/_rootLayout.tsx
export function RootLayout() {
  return (
    <UserAuthProvider requireAuth={true}>
      {/* Route content */}
    </UserAuthProvider>
  );
}
```

#### Option B: Use ProtectedRoute Component

- [ ] Wrap individual components with `<ProtectedRoute>`
- [ ] Test optional role checking
- [ ] Test fallback rendering

Example:
```typescript
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminDashboard />
</ProtectedRoute>
```

### 5. Navigation & Redirects

- [ ] Update login form success handler to navigate to `/dashboard`
- [ ] Update logout to navigate to `/login`
- [ ] Test back button doesn't show protected pages after logout
- [ ] Test deep linking to protected routes after login

### 6. Hook Usage in Components

- [ ] Import `useAuth` from `@/hooks`
- [ ] Use `isAuthenticated` to show/hide auth-dependent UI
- [ ] Use `isLoading` to show loading states during requests
- [ ] Use `user`, `vendor`, `admin` to display user info
- [ ] Use `logout()` in logout buttons

Example:
```typescript
const { user, isLoading, logout } = useAuth();

if (isLoading) return <LoadingSpinner />;

return (
  <div>
    <p>Welcome, {user?.fullName}</p>
    <button onClick={logout}>Logout</button>
  </div>
);
```

## Testing Checklist

### Unit Tests

- [ ] Create test for `tokenManager.isTokenExpired()`
- [ ] Create test for `tokenManager.decodeToken()`
- [ ] Test useAuth hook initialization
- [ ] Test useAuth hook re-initialization on token refresh

### Integration Tests

- [ ] Test complete login flow
- [ ] Test complete logout flow
- [ ] Test protected route access
- [ ] Test route guarding with role checks
- [ ] Test token refresh on 401 response
- [ ] Test double-login doesn't occur
- [ ] Test token persistence on page refresh

### Manual Testing

- [ ] Test 1: Verify Token Persistence
  - [ ] Login
  - [ ] Check cookies in DevTools
  - [ ] Refresh page
  - [ ] Should stay logged in

- [ ] Test 2: Verify Token Refresh
  - [ ] Login
  - [ ] Wait for access token to expire (or modify exp in DevTools)
  - [ ] Make API request
  - [ ] Should auto-refresh and succeed

- [ ] Test 3: Verify Role-Based Access
  - [ ] Login as User, access /admin → redirect
  - [ ] Logout, login as Admin, access /admin → load
  - [ ] Logout, access /dashboard → redirect to login

- [ ] Test 4: Verify Loading States
  - [ ] Set Network to Slow 3G in DevTools
  - [ ] Refresh app while authenticated
  - [ ] Should show loading spinner
  - [ ] After init, page loads

- [ ] Test 5: Verify Error Handling
  - [ ] Invalid credentials → show error message
  - [ ] Network error → show retry option
  - [ ] Session expired → redirect to login

### E2E Tests (Cypress/Playwright)

- [ ] Test user signup and auto-login
- [ ] Test vendor login and access /vendor routes
- [ ] Test admin login and access /admin routes
- [ ] Test logout clears auth and redirects
- [ ] Test protected routes redirect when logged out
- [ ] Test deep links to protected routes after login work

## Performance Optimization

- [ ] Verify `staleTime` is set appropriately (10 mins for validate query)
- [ ] Verify token refresh callback doesn't retry infinitely
- [ ] Monitor React Query DevTools for unnecessary re-fetches
- [ ] Check that `useAuth` doesn't cause unnecessary re-renders
- [ ] Verify lazy loading works with protected routes

## Debugging

### Enable React Query DevTools

```typescript
// src/routes/__root.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to JSX:
<ReactQueryDevtools initialIsOpen={false} />
```

### Debug useAuth Hook

Add console logs in `useAuth()`:
```typescript
console.log('Auth State:', { isInitialized, isLoading, isAuthenticated, role });
```

### Monitor Token Refresh

Add logs in API client:
```typescript
if (response.status === 401) {
  console.log('Token expired, refreshing...');
  await onTokenRefresh?.();
  console.log('Token refreshed, retrying request...');
}
```

## Deployment Checklist

- [ ] Verify API_URL env var points to production API
- [ ] Verify CORS settings allow production domain
- [ ] Verify cookies are set with Secure flag (HTTPS only)
- [ ] Verify token expiry times are appropriate for production
- [ ] Verify no console logs or debug code remains
- [ ] Test logout clears all user data
- [ ] Monitor production logs for 401 errors
- [ ] Setup monitoring for authentication failures

## Post-Deployment

- [ ] Monitor error tracking (Sentry, etc.) for auth errors
- [ ] Check user session metrics in analytics
- [ ] Monitor token refresh rate (shouldn't be excessive)
- [ ] Get user feedback on login/signup UX
- [ ] Review security logs for suspicious activity

## Rollback Plan

If issues occur:
1. Revert to previous auth.store.ts, use-auth.ts, and queries
2. Keep API client changes (backward compatible)
3. Clear browser cookies for all users (they'll need to re-login)
4. Monitor error rates return to normal

---

**Priority**: 🔴 HIGH - Implement in order listed  
**Estimated Time**: 2-4 hours  
**Risk Level**: MEDIUM (test thoroughly)
