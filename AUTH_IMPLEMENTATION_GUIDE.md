# Production Auth System - Developer Quick Start

## Most Common Tasks (Copy & Paste)

### 1️⃣ Protect a Route with Role Check

```typescript
// src/routes/admin/dashboard.tsx
import { ProtectedRoute } from '@/components/protected-route';
import { UserRole } from '@/types';

export function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div className="p-8">
        <h1>Admin Dashboard</h1>
        {/* Content */}
      </div>
    </ProtectedRoute>
  );
}
```

### 2️⃣ Show Loading During Auth Initialization

```typescript
import { useAuth } from '@/hooks';

function AuthDependentComponent() {
  const { isInitialized, isLoading } = useAuth();

  // ALWAYS check both flags
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return <YourComponent />;
}
```

### 3️⃣ Build a Login Form

```typescript
import { useUserLogin } from '@/api/queries';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { ILoginCredentials } from '@/types';

export function LoginForm() {
  const [credentials, setCredentials] = useState<ILoginCredentials>({
    email: '',
    password: '',
  });

  const { mutate: login, isPending, error } = useUserLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials, {
      onSuccess: () => {
        // Auth state is updated automatically
        navigate({ to: '/dashboard' });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      {error && <div className="text-red-500">{error.message}</div>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 4️⃣ Create User Menu with Logout

```typescript
import { useAuth } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import { useLogout } from '@/api/queries';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">{user.fullName}</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
```

### 5️⃣ Show Different UIs Based on Role

```typescript
import { useAuth } from '@/hooks';

export function Dashboard() {
  const { isInitialized, isLoading, isUser, isVendor, isAdmin } = useAuth();

  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  if (isUser) return <UserDashboard />;
  if (isVendor) return <VendorDashboard />;
  if (isAdmin) return <AdminDashboard />;

  return <div>Unknown role</div>;
}
```

### 6️⃣ Conditional Rendering Based on Auth

```typescript
import { useAuth } from '@/hooks';

export function Navigation() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <NavSkeleton />;

  return (
    <nav>
      <a href="/">Home</a>
      <a href="/products">Products</a>

      {isAuthenticated ? (
        <>
          <a href="/profile">{user?.fullName}</a>
          <a href="/logout">Logout</a>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </>
      )}
    </nav>
  );
}
```

### 7️⃣ Make an Authenticated API Call

```typescript
import { apiClient } from '@/api';
import { useQuery } from '@tanstack/react-query';

// The hook way (recommended)
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.getData('/user/profile'),
  });
};

// Or direct API call
async function fetchUserData() {
  try {
    // Token is automatically added from httpOnly cookie
    // If 401, token is auto-refreshed and request retried
    const data = await apiClient.getData('/user/profile');
    console.log(data);
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### 8️⃣ Wrap Route Group with Provider

```typescript
// src/routes/(root)/_rootLayout.tsx
import { UserAuthProvider } from '@/providers/user-auth-provider';
import { Outlet } from '@tanstack/react-router';

export function RootLayout() {
  return (
    <UserAuthProvider requireAuth={true}>
      <div className="layout">
        <Navigation />
        <Outlet />
        <Footer />
      </div>
    </UserAuthProvider>
  );
}
```

### 9️⃣ Handle Errors from Auth Mutations

```typescript
import { useUserLogin } from '@/api/queries';
import { ApiError } from '@/api';

export function LoginForm() {
  const { mutate: login, error, isPending } = useUserLogin();

  const handleLogin = () => {
    login(credentials, {
      onError: (err) => {
        if (err instanceof ApiError) {
          if (err.statusCode === 401) {
            alert('Invalid credentials');
          } else if (err.statusCode === 429) {
            alert('Too many login attempts. Try again later.');
          } else {
            alert(err.message);
          }
        }
      },
    });
  };

  return (
    <form>
      {/* Form fields */}
      {error && (
        <div className="text-red-500">
          {error instanceof ApiError ? error.message : 'Login failed'}
        </div>
      )}
      <button onClick={handleLogin} disabled={isPending}>
        Login
      </button>
    </form>
  );
}
```

### 🔟 Access Token Data Without Token String

```typescript
import { useAuth } from '@/hooks';

export function UserInfo() {
  const { user, vendor, admin, role } = useAuth();

  // You don't need to access the token string
  // useAuth provides the decoded user data directly

  if (role === 'user') {
    return <div>User ID: {user?._id}</div>;
  }

  if (role === 'vendor') {
    return <div>Shop: {vendor?.shopName}</div>;
  }

  if (role === 'admin') {
    return <div>Admin: {admin?.email}</div>;
  }
}
```

---

## Flow: From Login to Protected Route

```
1. User fills login form
   ↓
2. Call login mutation: login(credentials)
   ↓
3. API receives credentials, validates
   ↓
4. API sends httpOnly cookies + returns user data
   ↓
5. Mutation onSuccess fires
   ↓
6. Call setAuth(user, accessToken, refreshToken)
   ↓
7. Zustand store updates
   ↓
8. useAuth() returns updated state
   ↓
9. Components re-render with isAuthenticated: true
   ↓
10. Navigation component can now show logout button
    ↓
11. User navigates to protected route
    ↓
12. ProtectedRoute checks isInitialized && isAuthenticated
    ↓
13. Route renders successfully
```

---

## Important: Always Use This Pattern

```typescript
// ❌ WRONG - May redirect before auth is ready
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <LoginPage />;
return <Dashboard />;

// ✅ CORRECT - Waits for initialization
const { isInitialized, isLoading, isAuthenticated } = useAuth();
if (!isInitialized || isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <LoginPage />;
return <Dashboard />;
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/hooks/use-auth.ts` | Main auth hook - use this everywhere |
| `src/store/auth.store.ts` | Auth state (advanced usage only) |
| `src/providers/auth-initializer.tsx` | Wrap your app with this |
| `src/providers/user-auth-provider.tsx` | Wrap user route groups |
| `src/providers/vendor-auth-provider.tsx` | Wrap vendor route groups |
| `src/providers/admin-auth-provider.tsx` | Wrap admin route groups |
| `src/components/protected-route.tsx` | Wrap individual routes |
| `src/api/queries/auth.query.ts` | Login/logout mutations |
| `src/api/client.ts` | API client (handles tokens automatically) |
| `src/api/cookie-manager.ts` | Token utilities |

---

## Environment Variables

Create `.env` (or update existing):

```env
VITE_API_URL=http://localhost:3000/api
# Don't put tokens in env - they're in httpOnly cookies
```

---

## Troubleshooting

### Problem: Redirected to login despite being logged in

**Solution**: Check if you're checking `isInitialized`:

```typescript
// Add to your route guard
if (!isInitialized || isLoading) {
  return <LoadingSpinner />;
}
```

### Problem: Double login required

**Solution**: Ensure mutation's onSuccess calls `setAuth()`:

```typescript
onSuccess: (response) => {
  const { user, accessToken, refreshToken } = response.data;
  setAuth(user, accessToken, refreshToken); // Must call this
}
```

### Problem: Tokens not persisting on page refresh

**Solution**: Backend must set httpOnly cookies. Check:
1. Login response includes `Set-Cookie` headers
2. Cookies have `HttpOnly`, `Secure`, `SameSite=Strict` flags
3. `/auth/validate` endpoint reads cookies correctly

### Problem: 401 errors not being handled

**Solution**: Add console log in API client to debug:

```typescript
if (response.status === 401) {
  console.log('Got 401, attempting refresh...');
  await onTokenRefresh?.();
  console.log('Refresh successful, retrying request');
}
```

---

## Next Steps

1. **Wrap your app** with `<AuthInitializer>` in `__root.tsx`
2. **Update route groups** with auth providers
3. **Build login form** using `useUserLogin()` mutation
4. **Test login** and check browser cookies
5. **Test page refresh** - should stay logged in
6. **Test protected routes** - should redirect when logged out
7. **Test logout** - should clear state and redirect

---

**Still stuck?** Read `PRODUCTION_AUTH_SYSTEM.md` for detailed explanations.
