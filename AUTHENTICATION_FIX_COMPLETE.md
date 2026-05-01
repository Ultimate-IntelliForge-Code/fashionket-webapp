# TanStack Router Page Reload Authentication Fix - Complete Solution

## 🔴 The Problem You Were Experiencing

When you reload an authenticated page (`/dashboard`, `/admin`, `/vendor`), you get redirected to login even though you're actually logged in. This happens because:

```
Page Reload Flow:
1. User reloads page at /dashboard
2. TanStack Router starts evaluating routes
3. ROOT beforeLoad executes: calls ensureAuthInitialized()
4. /auth/validate request sent to backend
5. ❌ Backend returns 401 (because @CurrentUser() guard requires auth)
6. Frontend catches error → treats as "not authenticated"
7. store.clearAuth() called
8. _authenticated layout checks: isAuthenticated = false
9. ❌ Redirects to /login
10. User sees: "Why am I logged out?!"
```

## ✅ The Solution (What Was Fixed)

### Part 1: Frontend Architecture Changes ✓ DONE

The frontend has been restructured to initialize auth at the **ROOT level** before any child routes execute:

**File: `/src/routes/__root.tsx`**
```typescript
export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    // ✅ This runs FIRST for all routes
    // Ensures /auth/validate completes before protected routes redirect
    await ensureAuthInitialized(context.queryClient);
  },
  // ...
});
```

**File: `/src/lib/auth-init.ts`**
```typescript
export const ensureAuthInitialized = async (queryClient?: QueryClient) => {
  if (state.isInitialized) return;  // Don't init twice
  await initializeAuth(queryClient);
};

async function executeAuthInit(queryClient?: QueryClient): Promise<void> {
  try {
    const data = await apiClient.getData<ITokenValidationResponse>('/auth/validate');
    
    if (!data?.valid) {
      store.clearAuth();
      return;
    }
    
    applyUserToStore(data.user);  // Set user in Zustand
  } catch (error) {
    // ✅ Handle 401 gracefully - treat as unauthenticated
    console.error('[AUTH-INIT] Error during auth validation:', error);
    store.clearAuth();
  }
}
```

### Part 2: Protected Route Guards ✓ DONE

All protected route layouts now rely on ROOT's initialization:

**File: `/src/routes/(root)/_rootLayout/_authenticated.tsx`**
```typescript
export const Route = createFileRoute('/(root)/_rootLayout/_authenticated')({
  beforeLoad: async ({ context }) => {
    // ✅ Auth already initialized at ROOT level
    const store = useAuthStore.getState();
    
    if (!store.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});
```

Same pattern applied to:
- `/src/routes/admin/_adminLayout.tsx`
- `/src/routes/vendor/_vendorLayout.tsx`

## 🔴 The Remaining Issue (Backend)

**IMPORTANT**: There is **ONE CRITICAL ISSUE on the backend** that needs to be fixed:

### Backend Problem:
The `/auth/validate` endpoint has `@CurrentUser()` guard which **throws 401 if the JWT is missing or invalid**. This prevents the endpoint from even reaching the controller.

```typescript
// Current (WRONG):
@Controller('auth')
export class AuthController {
  @Get('validate')
  @HttpCode(HttpStatus.OK)
  validateToken(@CurrentUser() user: JwtPayload) {  // ← Throws 401 if user is null
    // ...
  }
}
```

When the cookie is missing/invalid on page reload:
- Backend throws 401 before reaching the controller
- Frontend gets error response
- Error is treated as "not authenticated"
- Auth is cleared

**This creates a race condition** because:
1. The `/auth/validate` endpoint should ALWAYS return a response (never throw 401)
2. It should return `{ valid: false, user: null }` when unauthenticated
3. Not throw an error

### Backend Solution Required:

**File: `src/infrastructure/auth/auth.controller.ts`**

```typescript
@Controller('auth')
export class AuthController {
  @Get('validate')
  @Public()  // ← ADD THIS: Allow unauthenticated requests
  @HttpCode(HttpStatus.OK)
  validateToken(@CurrentUser() user?: JwtPayload) {  // ← Make optional
    if (!user) {
      return {
        success: true,
        message: 'Validation',
        data: {
          valid: false,
          user: null,
        }
      };
    }
    
    return {
      success: true,
      message: 'Validation',
      data: {
        valid: true,
        user: {
          auth_id: user.auth_id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      }
    };
  }
}
```

## 📋 Checklist for Final Fix

- [ ] **Backend**: Update `/auth/validate` endpoint
  - Add `@Public()` decorator
  - Make `user` parameter optional
  - Return `{ valid: false, user: null }` when user is null
  
- [ ] **Frontend**: Already fixed ✓
  - ROOT beforeLoad initializes auth
  - Protected routes depend on ROOT
  - Error handling in place

- [ ] **Testing**:
  - [ ] Login as user
  - [ ] Go to `/dashboard`
  - [ ] Hard refresh (Ctrl+F5)
  - [ ] Verify: Page loads without redirect ✅
  - [ ] Check console logs for `[AUTH-INIT]` messages
  - [ ] Logout
  - [ ] Go to `/dashboard`  
  - [ ] Verify: Redirects to `/login` ✅

## 🔄 The Correct Flow After Fix

```
Page Reload (Authenticated User):
1. Browser sends request to /dashboard
2. TanStack Router evaluates ROOT route
3. ROOT beforeLoad: ensureAuthInitialized()
   ├─ Calls /auth/validate
   ├─ Backend checks JWT cookie (exists ✓)
   ├─ Returns { valid: true, user: {...} }
   └─ Store updates with user data ✅
4. ROOT beforeLoad completes
5. Child route (_authenticated) evaluates
   ├─ Checks store.isAuthenticated (true ✅)
   └─ No redirect needed ✅
6. Component renders with user data ✅

Page Reload (Unauthenticated User):
1. Browser sends request to /dashboard
2. TanStack Router evaluates ROOT route
3. ROOT beforeLoad: ensureAuthInitialized()
   ├─ Calls /auth/validate
   ├─ Backend checks JWT cookie (missing ✗)
   ├─ Returns { valid: false, user: null }
   └─ Store cleared (isAuthenticated = false) ✅
4. ROOT beforeLoad completes
5. Child route (_authenticated) evaluates
   ├─ Checks store.isAuthenticated (false ✗)
   ├─ Redirects to /login ✅
6. User sees login page ✅
```

## Files Modified

### Frontend (✓ Already Fixed)
- `/src/routes/__root.tsx` - Added ROOT beforeLoad with auth initialization
- `/src/lib/auth-init.ts` - Better error handling and logging
- `/src/routes/(root)/_rootLayout/_authenticated.tsx` - Now depends on ROOT
- `/src/routes/admin/_adminLayout.tsx` - Now depends on ROOT
- `/src/routes/vendor/_vendorLayout.tsx` - Now depends on ROOT

### Backend (⚠️ NEEDS FIXING)
- `src/infrastructure/auth/auth.controller.ts` - `/auth/validate` endpoint
  - Change from `@CurrentUser()` (required) to `@Public()`
  - Handle null user case
  - See `AUTH_VALIDATION_FIX.md` for exact changes

## Why This Architecture Works

1. **Single Initialization**: Auth is initialized ONCE at ROOT level
2. **No Race Conditions**: All child routes wait for ROOT's beforeLoad
3. **Cookie Handling**: By the time child routes load, cookies have been checked
4. **Graceful Fallback**: If cookies are invalid, endpoint returns `{ valid: false }` (not error)
5. **Protected Routes**: All routes with role checks work consistently
6. **Navigation**: Client-side navigation still works (auth already in store)

## Common Issues & Solutions

### Issue: "Still getting redirected on reload"
**Solution**: Backend `/auth/validate` endpoint must be fixed to not throw 401

### Issue: "Console shows `isAuthenticated: false` even when logged in"
**Solution**: Check browser DevTools
- Open Network tab
- Reload page
- Look for `/auth/validate` request
- Check if it's returning 401 or { valid: false }
- Check if `access_token` cookie is present in request

### Issue: "Works on navigation but not on reload"
**Solution**: This is the classic auth initialization issue being fixed by ROOT beforeLoad

## Next Steps

1. **Apply backend fix** to `/auth/validate` endpoint
2. **Test** page reload scenarios
3. **Monitor** console logs for `[AUTH-INIT]` messages
4. **Verify** cookies are being sent and validated correctly

See `AUTH_VALIDATION_FIX.md` for complete backend implementation details.
