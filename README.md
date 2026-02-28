Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses CSS for styling.


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




## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).


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
