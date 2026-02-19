# Auth Provider Integration & Route Isolation Guide

## Overview

This document outlines the auth provider architecture that ensures proper route isolation between USER, VENDOR, and ADMIN roles in the FashionKet application.

## Architecture

### Single Source of Truth: `useAuth()` Hook

The `useAuth()` hook in `/src/hooks/use-auth.ts` is the central authority for authentication state. It:

1. **Validates Tokens**: Uses `useValidateToken()` query to verify JWT validity
2. **Manages Auth State**: Maintains user/vendor/admin state in Zustand store
3. **Role Determination**: Provides role-based flags (`isAdmin`, `isVendor`, `isUser`, `isSuperAdmin`)
4. **Handles Logout**: Clears all auth data and redirects to login
5. **Syncs State**: Automatically updates Zustand store when token validation changes

```typescript
const {
  user,           // IUser or null
  vendor,         // IVendor or null
  admin,          // IAdmin or null
  isAuthenticated,// boolean
  isLoading,      // boolean (during token validation)
  role,           // UserRole enum
  isAdmin,        // boolean (ADMIN or SUPER_ADMIN)
  isVendor,       // boolean (VENDOR)
  isUser,         // boolean (USER)
  isSuperAdmin,   // boolean (SUPER_ADMIN)
  logout,         // async () => Promise<void>
} = useAuth();
```

### Provider Hierarchy

```
<html>
  <QueryClientProvider>  [Global queries]
    ├─ <AuthInitializer>  [Root-level auth validation]
    │  └─ <main>
    │     ├─ <UserAuthProvider>              [User routes only]
    │     │  ├─ <Header />
    │     │  ├─ <Outlet /> → (root)/_authenticated/* [LOGIN REQUIRED]
    │     │  └─ <Footer />
    │     │
    │     ├─ <VendorAuthProvider>            [Vendor routes only]
    │     │  ├─ <VendorSidebar />
    │     │  ├─ <VendorHeader />
    │     │  └─ <Outlet /> → /vendor/* [VENDOR ROLE REQUIRED]
    │     │
    │     ├─ <AdminAuthProvider>             [Admin routes only]
    │     │  ├─ <AdminSidebar />
    │     │  ├─ <AdminHeader />
    │     │  └─ <Outlet /> → /admin/* [ADMIN ROLE REQUIRED]
    │     │
    │     └─ <AuthGuard>                     [For mid-level protection]
    │        └─ <Outlet /> → (root)/_authenticated/*
    └─ <ToastContainer />
```

## Route Protection Layers

### Layer 1: AuthInitializer (Root)

**File**: `/src/providers/auth-initializer.tsx`  
**Purpose**: Initialize auth state globally before rendering any routes

**What it does**:
- Calls `useAuth()` to trigger token validation
- Shows loading screen while `isLoading = true`
- Once auth is loaded, renders children
- Ensures single auth validation point (no duplicate checks)

### Layer 2: Auth Providers (Layout Level)

#### UserAuthProvider

**File**: `/src/providers/user-auth-provider.tsx`  
**Location**: `/src/routes/(root)/_rootLayout.tsx`  
**Protected Routes**: `/` and all `(root)/_authenticated/*` routes

**Protection Rules**:
- ✅ Allows: USER role with valid token
- ❌ Blocks: Not authenticated users
- ❌ Blocks: VENDOR or ADMIN users trying to access user routes
- 🔁 Fallback: Shows "Go to login" message

```tsx
// In (root)/_rootLayout.tsx
<UserAuthProvider>
  <CartProvider>
    <Header />
    <div>
      <Outlet /> {/* Routes like /account, /orders, /checkout */}
    </div>
    <Footer />
  </CartProvider>
</UserAuthProvider>
```

#### VendorAuthProvider

**File**: `/src/providers/vendor-auth-provider.tsx`  
**Location**: `/src/routes/vendor/_vendorLayout.tsx`  
**Protected Routes**: `/vendor/*` routes

**Protection Rules**:
- ✅ Allows: VENDOR role with valid token
- ❌ Blocks: Not authenticated users
- ❌ Blocks: USER or ADMIN users trying to access vendor routes
- 🔁 Fallback: Redirects to `/vendor/login`

```tsx
// In /vendor/_vendorLayout.tsx
<VendorAuthProvider>
  {!isAuthenticated || !isVendor ? (
    <Navigate to="/vendor/login" />
  ) : (
    <VendorLayout>{children}</VendorLayout>
  )}
</VendorAuthProvider>
```

#### AdminAuthProvider

**File**: `/src/providers/admin-auth-provider.tsx`  
**Location**: `/src/routes/admin/_adminLayout.tsx`  
**Protected Routes**: `/admin/*` routes

**Protection Rules**:
- ✅ Allows: ADMIN or SUPER_ADMIN role with valid token
- ❌ Blocks: Not authenticated users
- ❌ Blocks: USER or VENDOR users trying to access admin routes
- 🔁 Fallback: Redirects to `/admin/login`

```tsx
// In /admin/_adminLayout.tsx
<AdminAuthProvider>
  {!isAuthenticated || !isAdmin ? (
    <Navigate to="/admin/login" />
  ) : (
    <AdminLayout>{children}</AdminLayout>
  )}
</AdminAuthProvider>
```

### Layer 3: AuthGuard Component (Route Level)

**File**: `/src/components/auth/auth-guard.tsx`  
**Purpose**: Fine-grained auth control for individual routes

**Usage**:
```tsx
// For protected user routes
<AuthGuard requireAuth={true}>
  <YourComponent />
</AuthGuard>

// For admin-only routes with role check
<AuthGuard requireAuth={true} allowedRoles={[UserRole.ADMIN]}>
  <YourComponent />
</AuthGuard>
```

## Route Structure

### User Routes (Public + Authenticated)

```
/ (root layout)
├─ /products
├─ /vendors
├─ /vendors/$slug
└─ /_authenticated/          [UserAuthProvider]
   ├─ /account               [Login required, USER role]
   ├─ /orders
   └─ /checkout
```

### Vendor Routes

```
/vendor/                      [VendorAuthProvider]
├─ /login                     [Public]
├─ /register                  [Public]
└─ /_vendorLayout             [Protected]
   ├─ /account               [VENDOR role required]
   ├─ /products
   ├─ /orders
   └─ /analytics
```

### Admin Routes

```
/admin/                       [AdminAuthProvider]
├─ /login                     [Public]
└─ /_adminLayout              [Protected]
   ├─ /account               [ADMIN/SUPER_ADMIN role required]
   ├─ /users
   ├─ /vendors
   ├─ /orders
   └─ /analytics
```

## Authentication Flow

### Login Flow

1. **User submits login form** → POST `/api/auth/login`
2. **Backend returns** → `{ access_token, refresh_token, user }`
3. **Frontend stores** → Tokens in localStorage, user in Zustand
4. **useAuth() updates** → Sets appropriate auth state (user/vendor/admin)
5. **Route renders** → Provider checks `isAuthenticated` and role

### Token Validation Flow

1. **Page load/refresh** → AuthInitializer calls `useAuth()`
2. **useAuth() triggers** → `useValidateToken()` query
3. **Backend validates** → Checks JWT signature and expiration
4. **Response received** → `{ valid: true, user: {...} }`
5. **useAuth() updates** → Sets auth state based on role
6. **Providers check** → Verify user has correct role
7. **Route renders** → If all checks pass, show page

### Logout Flow

1. **User clicks logout** → Calls `logout()` from `useAuth()`
2. **API call** → POST `/api/auth/logout`
3. **State cleared** → All auth data removed from Zustand
4. **Redirect** → Browser navigates to `/login` (or `/vendor/login`, etc.)

## Security Considerations

### ✅ What's Protected

1. **Backend Token Validation**: JWT signature + expiration checked on every request
2. **Role-Based Access**: Each provider verifies user has correct role
3. **Cross-Role Prevention**: User cannot see vendor/admin pages and vice versa
4. **Token Refresh**: Automatic token refresh via `useTokenRefresh()` hook
5. **Logout**: Complete auth state wipe on logout

### ⚠️ Implementation Notes

1. **Zustand Persistence**: Auth store uses localStorage with persistence
   - Allows session recovery on page refresh
   - Token validation still happens on every app load via AuthInitializer
   
2. **Multiple Auth States**: Store maintains separate user/vendor/admin objects
   - Only ONE is populated based on current user's role
   - Prevents data leakage between role types

3. **Route Matching**: React Router file-based routing ensures:
   - `/vendor/*` routes can only be wrapped with VendorAuthProvider
   - `/admin/*` routes can only be wrapped with AdminAuthProvider
   - User routes wrapped with UserAuthProvider

## Testing the Auth Isolation

### Manual Testing Checklist

#### Test 1: User Cannot Access Vendor Routes
```
1. Login as USER
2. Try to access /vendor/account directly
3. Expected: Redirected to /vendor/login
4. Status: ✓ PASS
```

#### Test 2: Vendor Cannot Access Admin Routes
```
1. Login as VENDOR
2. Try to access /admin/dashboard directly
3. Expected: Redirected to /admin/login
4. Status: ✓ PASS
```

#### Test 3: Admin Cannot Access Vendor Routes
```
1. Login as ADMIN
2. Try to access /vendor/account directly
3. Expected: Redirected to /vendor/login
4. Status: ✓ PASS
```

#### Test 4: Token Expiration Clears Auth
```
1. Login and get valid token
2. Set localStorage token to expired value
3. Refresh page
4. Expected: Redirected to appropriate login page, auth state cleared
5. Status: [PENDING]
```

#### Test 5: Token Refresh Works
```
1. Login and get tokens
2. Wait for/simulate access token expiration
3. Make API request
4. Expected: Access token refreshed automatically, request succeeds
5. Status: [PENDING]
```

#### Test 6: Role-Specific Data Loads
```
1. Login as USER
2. Visit /account
3. Expected: User profile loads from GET /api/auth/profile/user
4. Login as VENDOR
5. Visit /vendor/account
6. Expected: Vendor profile loads from GET /api/auth/profile/vendor
7. Login as ADMIN
8. Visit /admin/account
9. Expected: Admin profile loads from GET /api/auth/profile/admin
10. Status: [PENDING]
```

### Automated Testing (Future)

```typescript
// Example test structure
describe('Auth Provider Isolation', () => {
  
  it('should redirect USER to /login when accessing /vendor/account', async () => {
    // Setup: Login as USER
    // Action: Navigate to /vendor/account
    // Assert: Redirected to /vendor/login
  })

  it('should redirect VENDOR to /vendor/login when accessing /admin/dashboard', async () => {
    // Setup: Login as VENDOR
    // Action: Navigate to /admin/dashboard
    // Assert: Redirected to /admin/login
  })

  it('should show loading state while validating token', async () => {
    // Setup: AuthInitializer mounted
    // Assert: Loading spinner visible during useValidateToken() call
  })

  it('should clear auth state when logout is called', async () => {
    // Setup: Login as USER
    // Action: Call logout()
    // Assert: Zustand store cleared, isAuthenticated = false
  })
})
```

## Files Modified/Created

### New Files
- `/src/providers/auth-initializer.tsx` - Root-level auth initialization
- `/src/providers/user-auth-provider.tsx` - User route protection
- `/src/providers/vendor-auth-provider.tsx` - Vendor route protection
- `/src/providers/admin-auth-provider.tsx` - Admin route protection

### Modified Files
- `/src/routes/__root.tsx` - Added AuthInitializer wrapper
- `/src/routes/(root)/_rootLayout.tsx` - Already has UserAuthProvider
- `/src/routes/vendor/_vendorLayout.tsx` - Updated with VendorAuthProvider
- `/src/routes/admin/_adminLayout.tsx` - Updated with AdminAuthProvider

### Pre-existing Components
- `/src/hooks/use-auth.ts` - Central auth management
- `/src/store/auth.store.ts` - Zustand auth state
- `/src/components/auth/auth-guard.tsx` - Fine-grained route protection

## Troubleshooting

### Issue: "Loading..." spinner never disappears

**Cause**: `useValidateToken()` query never completes  
**Solution**: 
- Check backend `/api/auth/validate-token` endpoint
- Verify token is in localStorage
- Check browser network tab for 401/403 errors

### Issue: User redirected to /login loop

**Cause**: Token validation keeps failing  
**Solution**:
- Re-login to get fresh token
- Check token expiration time
- Verify backend returns valid JWT signature

### Issue: Wrong role data loading

**Cause**: useAuth() detecting wrong role  
**Solution**:
- Check backend returns correct `role` field
- Verify useAuth() useEffect syncs state correctly
- Check Zustand store has correct user/vendor/admin object

### Issue: Cross-role page access (Security Issue)

**Cause**: Provider not checking role correctly  
**Solution**:
- Verify provider uses `isAdmin`, `isVendor`, or `isUser` from useAuth()
- Ensure Navigate component redirects to correct login page
- Check layout wraps provider before Outlet

## Future Improvements

1. **Implement Role-Based Route Guards**: Centralized route guard logic
2. **Add Permission-Based Access**: Fine-grained permissions beyond roles
3. **Implement Token Refresh Interceptor**: Automatic token refresh for all API calls
4. **Add Auth Event Listeners**: Notify components when auth state changes
5. **Implement Session Timeout**: Warn users before token expiration
6. **Add Audit Logging**: Track auth events for security
