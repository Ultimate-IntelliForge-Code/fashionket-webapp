# Backend Auth Validation Fix Required

## Problem
When you reload an authenticated page:
1. Frontend's `ensureAuthInitialized()` calls `/auth/validate` 
2. Backend's `/auth/validate` endpoint requires `@CurrentUser()` guard (authentication)
3. If cookie is missing or JWT is invalid, the endpoint returns **401 Unauthorized** before reaching the controller
4. Frontend treats 401 as an error and clears auth
5. User gets redirected to login even though they might be authentic

## Root Cause
The `@CurrentUser()` guard on `/auth/validate` endpoint is too strict. This endpoint should:
- Check if there's a valid token/cookie
- Return `{ valid: false, user: null }` if invalid
- **NOT throw a 401 error** — that prevents the frontend from even getting a response

## Solution

### Current Backend Code (WRONG):
```typescript
@Controller('auth')
export class AuthController {
  @Get('validate')
  @HttpCode(HttpStatus.OK)
  validateToken(@CurrentUser() user: JwtPayload) {  // ← Throws 401 if user is null
    return {
      success: true,
      message: 'Validation',
      data: {
        valid: true,
        user: {
          auth_id: user?.auth_id,
          fullName: user?.fullName,
          email: user?.email,
          role: user?.role,
          isActive: user?.isActive,
        },
      }
    };
  }
}
```

### Fixed Backend Code (CORRECT):
```typescript
@Controller('auth')
export class AuthController {
  @Get('validate')
  @Public()  // ← Allow unauthenticated requests
  @HttpCode(HttpStatus.OK)
  validateToken(@CurrentUser() user?: JwtPayload) {  // ← Make user optional
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

## Changes Required in Backend

1. **Location**: `src/infrastructure/auth/auth.controller.ts`
2. **Method**: `validateToken()`
3. **Changes**:
   - Add `@Public()` decorator (remove `@CurrentUser()` requirement)
   - Make `user` parameter optional: `@CurrentUser() user?: JwtPayload`
   - Check if user exists before returning
   - Return `{ valid: false, user: null }` if not authenticated

## Why This Works

**Current Flow (BROKEN)**:
```
1. Reload page
2. /auth/validate endpoint hit
3. @CurrentUser() tries to extract user from JWT
4. JWT missing/invalid → throws 401
5. Frontend catches error → clears auth ❌
6. Redirects to login ❌
```

**Fixed Flow (WORKING)**:
```
1. Reload page
2. /auth/validate endpoint hit
3. @CurrentUser() tries to extract user from JWT
4. No user available → user is undefined
5. Endpoint returns { valid: false, user: null }
6. Frontend receives response (not error)
7. Treats as "not authenticated" → store.clearAuth() ✅
8. Routes check isAuthenticated
9. If logged in with cookie: next request has valid token
10. If not logged in: redirect to login ✅
```

## Frontend Already Fixed
The frontend `auth-init.ts` has been updated to:
1. Try to call `/auth/validate`
2. **If endpoint returns error** (401, etc.): treat as unauthenticated
3. **If endpoint returns `{ valid: false }`**: treat as unauthenticated
4. **If endpoint returns `{ valid: true, user }`**: set user in store

So the frontend is ready. Just need the backend endpoint to not throw 401.

## Testing After Fix
1. Go to dashboard (or any authenticated page) while logged in
2. **Hard refresh** (Ctrl+F5)
3. Check browser console:
   ```
   [AUTH-INIT] Starting /auth/validate request...
   [AUTH-INIT] Response received: { valid: true, hasUser: true, userRole: 'USER' }
   [AUTH-INIT] Token valid, setting user in store
   [AUTH-INIT] User set successfully: { isAuthenticated: true, role: 'USER' }
   [AUTH-INIT] Initialization complete
   ```
4. Page should NOT redirect to login ✅
5. Dashboard should load normally ✅

Then logout and test reload:
1. Logout
2. Go to /dashboard (should redirect to /login)
3. Hard refresh - should stay on /login ✅
