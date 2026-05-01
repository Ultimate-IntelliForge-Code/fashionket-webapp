You are an expert in TanStack Router v1, React Query, and secure cookie-based authentication.

I have a React + TanStack Router application where:

## Current problem
- When navigating inside the app, authenticated API requests work fine
- When reloading the page or opening a deep link directly, API requests fail with 401
- Cookies are not consistently included or auth state is not ready during loader execution
- I incorrectly tried to store auth state inside TanStack Router context
- Route loaders are calling protected endpoints before authentication is initialized
- Zustand is used for auth state management
- Backend uses httpOnly cookies (access_token + refresh_token)
- API calls use `fetch` with `credentials: 'include'`

## Architecture constraints
- Must keep httpOnly cookie-based authentication (no localStorage tokens)
- Must use TanStack Router loaders + React Query
- Must NOT store reactive auth state inside router context
- Must ensure loaders do NOT execute protected requests before auth is initialized
- Must fix reload (hard refresh) authentication failure

## Backend behavior
- /auth/validate returns current session user if cookie is valid
- /auth/refresh refreshes access token using refresh cookie
- Cookies are cross-origin (frontend: localhost:3000, backend: localhost:5100)

## What needs to be fixed
1. Fix TanStack Router context usage (remove auth from context)
2. Ensure router loaders wait for authentication initialization OR are protected properly
3. Prevent loaders from firing protected queries before auth is ready
4. Ensure React Query only runs protected queries after:
   - auth.isInitialized === true
   - auth.isAuthenticated === true
5. Fix race condition between app hydration and loader execution on page reload
6. Implement proper auth initialization flow using a top-level provider (AuthInitializer)
7. Ensure API requests always include credentials and handle 401 gracefully
8. Optionally implement automatic token refresh on 401

## Desired outcome
- Page reload should NOT break authentication
- Deep link navigation should work directly
- No 401 errors due to premature loader execution
- Auth state should initialize once on app boot
- Protected queries should only run after auth is ready

## Code areas to refactor
- router.ts (createRouter)
- root route context (createRootRouteWithContext)
- AuthInitializer
- useAuth hook
- useOrdersQuery / React Query usage
- loader functions in protected routes

Rewrite the architecture to follow best practices for TanStack Router + cookie-based auth.

Focus on correctness, race-condition prevention, and production readiness.

# File Tree: fashionket-webapp

**Generated:** 5/1/2026, 12:14:32 PM
**Root Path:** `/home/ultimate/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-webapp`

```
├── 📁 .github
│   └── 📁 workflows
│       └── ⚙️ ci.yml
├── 📁 public
│   ├── 🖼️ android-chrome-192x192.png
│   ├── 🖼️ android-chrome-512x512.png
│   ├── 🖼️ apple-touch-icon.png
│   ├── ⚙️ categories.json
│   ├── 🖼️ favicon-16x16.png
│   ├── 🖼️ favicon-32x32.png
│   ├── 📄 favicon.ico
│   ├── 🖼️ logo.png
│   ├── 🖼️ logo192.png
│   ├── 🖼️ logo512.png
│   ├── ⚙️ manifest.json
│   ├── 🖼️ placeholder-category.png
│   └── 📄 robots.txt
├── 📁 src
│   ├── 📁 api
│   │   ├── 📁 hooks
│   │   │   ├── 📄 address.hook.ts
│   │   │   ├── 📄 cart.hook.ts
│   │   │   ├── 📄 category.hook.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 order.hook.ts
│   │   │   ├── 📄 payment.hook.ts
│   │   │   ├── 📄 product.hook.ts
│   │   │   ├── 📄 seometa.hook.ts
│   │   │   ├── 📄 vendor.hook.ts
│   │   │   └── 📄 wallet.hook.ts
│   │   ├── 📁 mutations
│   │   │   ├── 📄 address.mutation.ts
│   │   │   ├── 📄 auth.muatation.ts
│   │   │   ├── 📄 cart.mutation.ts
│   │   │   ├── 📄 category.mutation.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 order.mutation.ts
│   │   │   ├── 📄 payment.mutation.ts
│   │   │   ├── 📄 product.mutation.ts
│   │   │   ├── 📄 profile.muatation.ts
│   │   │   └── 📄 wallet.mutation.ts
│   │   ├── 📁 queries
│   │   │   ├── 📄 address.query.ts
│   │   │   ├── 📄 auth.query.ts
│   │   │   ├── 📄 cart.query.ts
│   │   │   ├── 📄 category.query.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 order.query.ts
│   │   │   ├── 📄 payment.query.ts
│   │   │   ├── 📄 product.query.ts
│   │   │   ├── 📄 profile.query.ts
│   │   │   ├── 📄 seo.query.ts
│   │   │   ├── 📄 stats.query.ts
│   │   │   ├── 📄 vendor.query.ts
│   │   │   └── 📄 wallet.query.ts
│   │   ├── 📄 cache-keys.ts
│   │   ├── 📄 client.ts
│   │   └── 📄 index.ts
│   ├── 📁 components
│   │   ├── 📁 auth
│   │   │   ├── 📄 auth-form-wrapper.tsx
│   │   │   ├── 📄 auth-guard.tsx
│   │   │   ├── 📄 google-auth-button.tsx
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 cart
│   │   │   ├── 📄 add-to-cart-button.tsx
│   │   │   ├── 📄 cart-badge.tsx
│   │   │   ├── 📄 cart-drawer.tsx
│   │   │   ├── 📄 cart-icon.tsx
│   │   │   ├── 📄 cart-item.tsx
│   │   │   ├── 📄 cart-summary.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 checkout
│   │   │   └── 📄 payment-modal.tsx
│   │   ├── 📁 forms
│   │   │   └── 📄 product-form.tsx
│   │   ├── 📁 home
│   │   │   ├── 📄 hero-carousel.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 layout
│   │   │   ├── 📄 AdminHeader.tsx
│   │   │   ├── 📄 AdminSidebar.tsx
│   │   │   ├── 📄 Footer.tsx
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 VendorHeader.tsx
│   │   │   └── 📄 VendorSidebar.tsx
│   │   ├── 📁 orders
│   │   │   ├── 📄 order-card.tsx
│   │   │   ├── 📄 order-header.tsx
│   │   │   ├── 📄 order-list.tsx
│   │   │   ├── 📄 order-sidebar.tsx
│   │   │   ├── 📄 order-skeleton.tsx
│   │   │   ├── 📄 order-stats.tsx
│   │   │   ├── 📄 order-status-badge.tsx
│   │   │   ├── 📄 order-table.tsx
│   │   │   ├── 📄 order-timeline.tsx
│   │   │   └── 📄 payment-status-badge.tsx
│   │   ├── 📁 seo
│   │   │   ├── 📄 seo-client.tsx
│   │   │   ├── 📄 seo-head.tsx
│   │   │   └── 🎨 seo-page.css
│   │   ├── 📁 ui
│   │   │   ├── 📄 NotFound.tsx
│   │   │   ├── 📄 alert-dialog.tsx
│   │   │   ├── 📄 alert.tsx
│   │   │   ├── 📄 avatar.tsx
│   │   │   ├── 📄 badge.tsx
│   │   │   ├── 📄 breadcrumb.tsx
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 carousel.tsx
│   │   │   ├── 📄 categories-carousel.tsx
│   │   │   ├── 📄 checkbox.tsx
│   │   │   ├── 📄 cofirm-toast.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   ├── 📄 error-state.tsx
│   │   │   ├── 📄 filter-badge.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 label.tsx
│   │   │   ├── 📄 loading-state.tsx
│   │   │   ├── 📄 navigation-menu.tsx
│   │   │   ├── 📄 pagination.tsx
│   │   │   ├── 📄 product-card.tsx
│   │   │   ├── 📄 product-filters.tsx
│   │   │   ├── 📄 radio-group.tsx
│   │   │   ├── 📄 scroll-area.tsx
│   │   │   ├── 📄 select.tsx
│   │   │   ├── 📄 separator.tsx
│   │   │   ├── 📄 sheet.tsx
│   │   │   ├── 📄 skeleton.tsx
│   │   │   ├── 📄 slider.tsx
│   │   │   ├── 📄 spinner.tsx
│   │   │   ├── 📄 stats-card.tsx
│   │   │   ├── 📄 switch.tsx
│   │   │   ├── 📄 table.tsx
│   │   │   ├── 📄 tabs.tsx
│   │   │   ├── 📄 textarea.tsx
│   │   │   ├── 📄 tooltip.tsx
│   │   │   └── 📄 withdrawal-status-badge.tsx
│   │   └── 📁 vendor
│   │       ├── 📄 vendor-card.tsx
│   │       ├── 📄 vendor-hero.tsx
│   │       ├── 📄 vendor-info.tsx
│   │       └── 📄 vendor-profile.tsx
│   ├── 📁 config
│   │   └── 📄 env.config.ts
│   ├── 📁 hooks
│   │   ├── 📄 index.ts
│   │   ├── 📄 use-auth.ts
│   │   ├── 📄 use-cart.ts
│   │   └── 📄 use-token-refresh.ts
│   ├── 📁 lib
│   │   ├── 📄 cart.utils.ts
│   │   ├── 📄 cookie.utils.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 queryClient.ts
│   │   ├── 📄 utils.ts
│   │   ├── 📄 validation.utils.ts
│   │   └── 📄 zod.ts
│   ├── 📁 providers
│   │   ├── 📄 auth-initializer.tsx
│   │   └── 📄 cart-provider.tsx
│   ├── 📁 routes
│   │   ├── 📁 (auth)
│   │   │   ├── 📁 _auth
│   │   │   │   ├── 📁 (root)
│   │   │   │   │   ├── 📄 forgot-password.tsx
│   │   │   │   │   ├── 📄 login.tsx
│   │   │   │   │   ├── 📄 reset-password.tsx
│   │   │   │   │   └── 📄 signup.tsx
│   │   │   │   ├── 📁 admin
│   │   │   │   │   ├── 📄 forgot-password.tsx
│   │   │   │   │   ├── 📄 login.tsx
│   │   │   │   │   ├── 📄 register.tsx
│   │   │   │   │   └── 📄 reset-password.tsx
│   │   │   │   └── 📁 vendor
│   │   │   │       ├── 📄 forgot-password.tsx
│   │   │   │       ├── 📄 login.tsx
│   │   │   │       ├── 📄 register.tsx
│   │   │   │       └── 📄 reset-password.tsx
│   │   │   └── 📄 _auth.tsx
│   │   ├── 📁 (root)
│   │   │   ├── 📁 _rootLayout
│   │   │   │   ├── 📁 _authenticated
│   │   │   │   │   ├── 📁 account
│   │   │   │   │   │   └── 📄 index.tsx
│   │   │   │   │   ├── 📁 checkout
│   │   │   │   │   │   ├── 📄 index.tsx
│   │   │   │   │   │   └── 📄 payment-status.tsx
│   │   │   │   │   ├── 📁 orders
│   │   │   │   │   │   ├── 📄 $orderId.tsx
│   │   │   │   │   │   └── 📄 index.tsx
│   │   │   │   │   └── 📁 wishlist
│   │   │   │   │       └── 📄 index.tsx
│   │   │   │   ├── 📁 cart
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 categories
│   │   │   │   │   ├── 📄 $slug.tsx
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 products
│   │   │   │   │   ├── 📄 $slug.tsx
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 shop
│   │   │   │   │   └── 📄 slug.tsx
│   │   │   │   ├── 📁 vendors
│   │   │   │   │   ├── 📄 $slug.tsx
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📄 _authenticated.tsx
│   │   │   │   ├── 📄 contact.tsx
│   │   │   │   ├── 📄 cookies.tsx
│   │   │   │   ├── 📄 index.tsx
│   │   │   │   ├── 📄 privacy.tsx
│   │   │   │   ├── 📄 search.tsx
│   │   │   │   ├── 📄 support.tsx
│   │   │   │   └── 📄 terms.tsx
│   │   │   └── 📄 _rootLayout.tsx
│   │   ├── 📁 admin
│   │   │   ├── 📁 _adminLayout
│   │   │   │   ├── 📁 account
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📄 index.tsx
│   │   │   │   └── 📄 products.tsx
│   │   │   └── 📄 _adminLayout.tsx
│   │   ├── 📁 vendor
│   │   │   ├── 📁 _vendorLayout
│   │   │   │   ├── 📁 account
│   │   │   │   ├── 📁 orders
│   │   │   │   │   ├── 📄 $orderId.tsx
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 products
│   │   │   │   │   ├── 📄 $slug.tsx
│   │   │   │   │   ├── 📄 index.tsx
│   │   │   │   │   └── 📄 new.tsx
│   │   │   │   ├── 📁 settings
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📁 wallet
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   └── 📄 index.tsx
│   │   │   └── 📄 _vendorLayout.tsx
│   │   └── 📄 __root.tsx
│   ├── 📁 store
│   │   ├── 📄 auth.store.ts
│   │   ├── 📄 cart.store.ts
│   │   └── 📄 index.ts
│   ├── 📁 types
│   │   ├── 📄 address.type.ts
│   │   ├── 📄 admin.types.ts
│   │   ├── 📄 api.types.ts
│   │   ├── 📄 auth.types.ts
│   │   ├── 📄 base.types.ts
│   │   ├── 📄 cart.types.ts
│   │   ├── 📄 category.types.ts
│   │   ├── 📄 constants.type.ts
│   │   ├── 📄 enums.ts
│   │   ├── 📄 guards.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 order.types.ts
│   │   ├── 📄 payment.types.ts
│   │   ├── 📄 product.types.ts
│   │   ├── 📄 stats.types.ts
│   │   ├── 📄 user.types.ts
│   │   ├── 📄 utility.types.ts
│   │   ├── 📄 vendor.type.ts
│   │   └── 📄 wallet.types.ts
│   ├── 📄 routeTree.gen.ts
│   ├── 📄 router.tsx
│   └── 🎨 styles.css
├── ⚙️ .cta.json
├── ⚙️ .gitignore
├── 📝 Codex.md
├── 📝 README.md
├── 📝 VISUAL_ARCHITECTURE.md
├── ⚙️ components.json
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
├── 📝 style.md
├── ⚙️ tsconfig.json
├── 📄 verify-auth-setup.sh
└── 📄 vite.config.ts
```

---
*Generated by FileTree Pro Extension*