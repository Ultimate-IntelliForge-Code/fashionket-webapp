# FashionKet Architecture Diagrams

## 1. Authentication Provider Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Root (__root.tsx)                │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │            <QueryClientProvider>                          │   │
│ │            [React Query - API State Management]           │   │
│ │ ┌─────────────────────────────────────────────────────┐   │   │
│ │ │         <AuthInitializer>                           │   │   │
│ │ │  [Root Level - Validates token on app load]         │   │   │
│ │ │  - Calls useAuth() hook                             │   │   │
│ │ │  - Shows loading spinner while validating           │   │   │
│ │ │  - Single source of auth state initialization       │   │   │
│ │ │ ┌───────────────────────────────────────────────┐   │   │   │
│ │ │ │          <main> [All Routes]                  │   │   │   │
│ │ │ │ ┌─────────────────────────────────────────┐   │   │   │   │
│ │ │ │ │  (root) Layout                          │   │   │   │   │
│ │ │ │ │  ┌─────────────────────────────────────┐│   │   │   │   │
│ │ │ │ │  │  <UserAuthProvider>                 ││   │   │   │   │
│ │ │ │ │  │  [Protects user routes]             ││   │   │   │   │
│ │ │ │ │  │  - Checks: isAuthenticated && isUser││   │   │   │   │
│ │ │ │ │  │  - Redirects to: /login             ││   │   │   │   │
│ │ │ │ │  │  ┌──────────────────────────────┐   ││   │   │   │   │
│ │ │ │ │  │  │ <Header />                   │   ││   │   │   │   │
│ │ │ │ │  │  │ <Outlet />                   │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /products (public)       │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /vendors (public)        │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /vendors/$slug (public)  │   ││   │   │   │   │
│ │ │ │ │  │  │  └─ /_authenticated/* (auth) │   ││   │   │   │   │
│ │ │ │ │  │  │     ├─ /account ✓            │   ││   │   │   │   │
│ │ │ │ │  │  │     ├─ /orders ✓             │   ││   │   │   │   │
│ │ │ │ │  │  │     └─ /checkout ✓           │   ││   │   │   │   │
│ │ │ │ │  │  │ <Footer />                   │   ││   │   │   │   │
│ │ │ │ │  │  └──────────────────────────────┘   ││   │   │   │   │
│ │ │ │ │  └─────────────────────────────────────┘│   │   │   │   │
│ │ │ │ │                                         │   │   │   │   │
│ │ │ │ │  vendor/ Layout                         │   │   │   │   │
│ │ │ │ │  ┌─────────────────────────────────────┐│   │   │   │   │
│ │ │ │ │  │  <VendorAuthProvider>               ││   │   │   │   │
│ │ │ │ │  │  [Protects vendor routes]           ││   │   │   │   │
│ │ │ │ │  │  - Checks: isAuthenticated && isVendor││   │   │   │   │
│ │ │ │ │  │  - Redirects to: /vendor/login      ││   │   │   │   │
│ │ │ │ │  │  ┌──────────────────────────────┐   ││   │   │   │   │
│ │ │ │ │  │  │ <VendorSideBar />            │   ││   │   │   │   │
│ │ │ │ │  │  │ <VendorHeader />             │   ││   │   │   │   │
│ │ │ │ │  │  │ <Outlet />                   │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /account ✓              │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /products ✓             │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /orders ✓               │   ││   │   │   │   │
│ │ │ │ │  │  │  └─ /analytics ✓            │   ││   │   │   │   │
│ │ │ │ │  │  └──────────────────────────────┘   ││   │   │   │   │
│ │ │ │ │  └─────────────────────────────────────┘│   │   │   │   │
│ │ │ │ │                                         │   │   │   │   │
│ │ │ │ │  admin/ Layout                          │   │   │   │   │
│ │ │ │ │  ┌─────────────────────────────────────┐│   │   │   │   │
│ │ │ │ │  │  <AdminAuthProvider>                ││   │   │   │   │
│ │ │ │ │  │  [Protects admin routes]            ││   │   │   │   │
│ │ │ │ │  │  - Checks: isAuthenticated && isAdmin││   │   │   │   │
│ │ │ │ │  │  - Redirects to: /admin/login       ││   │   │   │   │
│ │ │ │ │  │  ┌──────────────────────────────┐   ││   │   │   │   │
│ │ │ │ │  │  │ <AdminSidebar />             │   ││   │   │   │   │
│ │ │ │ │  │  │ <AdminHeader />              │   ││   │   │   │   │
│ │ │ │ │  │  │ <Outlet />                   │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /account ✓              │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /users ✓                │   ││   │   │   │   │
│ │ │ │ │  │  │  ├─ /vendors ✓              │   ││   │   │   │   │
│ │ │ │ │  │  │  └─ /orders ✓               │   ││   │   │   │   │
│ │ │ │ │  │  └──────────────────────────────┘   ││   │   │   │   │
│ │ │ │ │  └─────────────────────────────────────┘│   │   │   │   │
│ │ │ │ └─────────────────────────────────────────┘   │   │   │   │
│ │ │ └───────────────────────────────────────────────┘   │   │   │
│ │ └─────────────────────────────────────────────────────┘   │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Authentication Flow Diagram

```
┌─────────────┐
│   User      │
│   Login     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ POST /api/auth/login     │
│ (email, password)        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│    Backend Validation                │
│    - Hash password check             │
│    - Generate JWT tokens             │
│    - Return user & tokens            │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend receives response:          │
│  {                                    │
│    access_token: "jwt...",            │
│    refresh_token: "jwt...",           │
│    user: { id, email, role, ... }    │
│  }                                    │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Store in localStorage                │
│  + Zustand (auth.store)               │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Page Refresh / App Load              │
│  AuthInitializer calls useAuth()      │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  useAuth() hook:                      │
│  - Gets token from localStorage       │
│  - Calls useValidateToken()           │
│  - Sets role based on user.role       │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  AuthProvider checks role             │
│  - isUser? ✓ Show user page           │
│  - isVendor? ✓ Show vendor page       │
│  - isAdmin? ✓ Show admin page         │
│  - None? ✗ Redirect to login          │
└──────────────────────────────────────┘
```

## 3. Role Isolation Matrix

```
┌────────────┬──────────────────┬──────────────────┬──────────────────┐
│   Role     │  Can Access      │  Cannot Access   │  Redirects To    │
├────────────┼──────────────────┼──────────────────┼──────────────────┤
│    USER    │ / (root)         │ /vendor/*        │ /login           │
│            │ /products        │ /admin/*         │                  │
│            │ /vendors         │                  │                  │
│            │ /_authenticated/*│                  │                  │
│            │ /account         │                  │                  │
│            │ /orders          │                  │                  │
│            │ /checkout        │                  │                  │
├────────────┼──────────────────┼──────────────────┼──────────────────┤
│  VENDOR    │ /vendor/*        │ / (root)         │ /vendor/login    │
│            │ /account         │ /admin/*         │                  │
│            │ /products        │ /products        │                  │
│            │ /orders          │ /vendors         │                  │
│            │ /analytics       │ /_authenticated/*│                  │
├────────────┼──────────────────┼──────────────────┼──────────────────┤
│   ADMIN    │ /admin/*         │ / (root)         │ /admin/login     │
│   (or      │ /dashboard       │ /vendor/*        │                  │
│  SUPER_    │ /users           │ /_authenticated/*│                  │
│  ADMIN)    │ /vendors         │                  │                  │
│            │ /orders          │                  │                  │
│            │ /analytics       │                  │                  │
└────────────┴──────────────────┴──────────────────┴──────────────────┘
```

## 4. useAuth() Hook State Machine

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              useAuth() Hook State Machine               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Initial State (on app load):                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ isLoading: true                                  │  │
│  │ isAuthenticated: false                           │  │
│  │ user, vendor, admin: null                        │  │
│  │ role: null                                       │  │
│  └──────────────────────────────────────────────────┘  │
│                         ▼                               │
│  Validation Query (useValidateToken):                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Check token in localStorage                      │  │
│  │ POST /api/auth/validate-token                    │  │
│  │ Receive: { valid, user, role }                   │  │
│  └──────────────────────────────────────────────────┘  │
│                         ▼                               │
│  Token Valid? ──NO──> Clearance:                       │
│        │              isAuthenticated: false            │
│       YES              role: null                       │
│        │               user, vendor, admin: null        │
│        ▼                                                │
│  Determine Role:                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ switch(user.role) {                              │  │
│  │   case 'USER':                                   │  │
│  │     setAuth(user)  → isUser = true               │  │
│  │   case 'VENDOR':                                 │  │
│  │     setAuthVendor(vendor) → isVendor = true      │  │
│  │   case 'ADMIN'|'SUPER_ADMIN':                    │  │
│  │     setAuthAdmin(admin) → isAdmin = true         │  │
│  │ }                                                │  │
│  │ isAuthenticated: true                            │  │
│  │ isLoading: false                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                         ▼                               │
│  Render Auth Providers:                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AuthProvider checks role flags:                  │  │
│  │ - UserAuthProvider: if !isUser → redirect        │  │
│  │ - VendorAuthProvider: if !isVendor → redirect    │  │
│  │ - AdminAuthProvider: if !isAdmin → redirect      │  │
│  │ Otherwise: render protected component            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 5. Data Flow Between Layers

```
┌──────────────────────────────────────────────────────────┐
│                    React Components                      │
│              (Account, Orders, Products, etc)           │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Custom Hooks (useAuth, etc)                │
│         (Trigger queries, manage state)                 │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│            React Query (useQuery)                        │
│         (Fetch, cache, synchronize data)                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                Zustand Store                             │
│    (isAuthenticated, user, vendor, admin, role)         │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Local Storage (Persistence)                 │
│    (tokens, user data - with validation on load)        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  Browser Storage                         │
│         (localStorage, sessionStorage)                   │
└──────────────────────────────────────────────────────────┘
```

## 6. Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                   Token Lifecycle                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  User Logs In                                           │
│  ────────────                                           │
│  Backend sends 2 tokens:                                │
│  • access_token (short-lived: 7 days)                   │
│  • refresh_token (long-lived: 30 days)                  │
│                                                         │
│       │                                                 │
│       ▼                                                 │
│  Stored in localStorage                                 │
│  ──────────────────────                                 │
│  Both tokens saved for session persistence              │
│                                                         │
│       │                                                 │
│       ▼                                                 │
│  API Requests                                           │
│  ────────────                                           │
│  access_token included in Authorization header          │
│  Bearer <access_token>                                  │
│                                                         │
│       │                                                 │
│       ├─ Request succeeds                               │
│       │  └─ Continue using same token                   │
│       │                                                 │
│       └─ Request fails (401)                            │
│          └─ Use refresh_token to get new access_token   │
│             POST /api/auth/refresh                      │
│             └─ Receive new access_token                 │
│                Retry original request                   │
│                                                         │
│       │                                                 │
│       ▼                                                 │
│  Token Expiration                                       │
│  ─────────────────                                      │
│  If refresh_token also expired:                         │
│  • Redirect to login page                               │
│  • Clear localStorage                                   │
│  • Clear Zustand store                                  │
│                                                         │
│       │                                                 │
│       ▼                                                 │
│  User Logs Out                                          │
│  ──────────────                                         │
│  • POST /api/auth/logout                                │
│  • Clear localStorage                                   │
│  • Clear Zustand store                                  │
│  • Redirect to /login                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 7. Component Composition for Protected Routes

```
User Wants to Access: /account (requires authentication)

    ▼
Is user in localhost?
    │
    ├─ YES: Continue
    │
    └─ NO: Cannot access (offline)

    ▼
AuthInitializer checks: isLoading?
    │
    ├─ YES: Show loading spinner
    │
    └─ NO: Continue
       (token validation done)

    ▼
App tries to render: <UserAuthProvider>
    
    ▼
UserAuthProvider checks:
    - isLoading? → Show spinner
    - !isAuthenticated? → Redirect to /login
    - !isUser? → Redirect to /login + error message
    - All good? → Render children

    ▼
Render: <AuthGuard requireAuth={true}>
    - Checks again: isAuthenticated && isUser
    - If fails: Show error
    - If passes: Render component

    ▼
Component uses useAuth() for data:
    - Access user object
    - Call logout() if needed
    - Check role flags

    ▼
Component calls API queries:
    - useUserProfile(true) - fetch user data
    - Results cached by React Query
    - Data displayed to user
```

---

This comprehensive set of diagrams illustrates how the authentication system works at every level of the FashionKet application. Use these as references when debugging, extending, or explaining the architecture to new team members.
