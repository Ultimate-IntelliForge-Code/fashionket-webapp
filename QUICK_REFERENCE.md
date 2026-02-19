# FashionKet Quick Reference Guide

## Directory Structure Quick Access

```bash
# Frontend Root
cd ~/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-webapp

# Backend Root
cd ~/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-api-service
```

## Frontend Commands

### Installation & Setup
```bash
# Install dependencies
pnpm install
# or
npm install

# Create .env file with API URL
echo "VITE_API_URL=http://localhost:3000/api" > .env.local

# Generate route types
pnpm run route:generate
```

### Development
```bash
# Start dev server (usually runs on http://localhost:5173)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint

# Check types
pnpm run typecheck
```

### Verification
```bash
# Verify auth setup
./verify-auth-setup.sh

# Check all auth providers exist
ls -la src/providers/

# View auth hook implementation
cat src/hooks/use-auth.ts
```

## Backend Commands

### Installation & Setup
```bash
# Install dependencies
pnpm install
# or
npm install

# Create .env file
cp .env.example .env

# Update .env with:
# MONGODB_URI=mongodb://localhost:27017/fashionket
# JWT_SECRET=your-secret-key
# JWT_EXPIRATION=7d
# REFRESH_TOKEN_EXPIRATION=30d
```

### Development
```bash
# Start dev server with watch mode
pnpm run start:dev

# Start production server
pnpm run start

# Build TypeScript
pnpm run build
```

### Database
```bash
# Run migrations (if configured)
pnpm run migrate

# Seed database (if seeder configured)
pnpm run seed

# Check database connection
npm run typeorm migration:show
```

### Testing
```bash
# Run unit tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Watch mode testing
pnpm run test:watch
```

## Docker Commands

### Frontend
```bash
# Build Docker image
docker build -f Dockerfile -t fashionket-webapp:latest .

# Run container
docker run -p 5173:5173 fashionket-webapp:latest

# Using docker-compose
docker-compose -f docker-compose.dev.yml up webapp
```

### Backend
```bash
# Build Docker image
docker build -f Dockerfile -t fashionket-api:latest .

# Run container with MongoDB
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017/fashionket \
  fashionket-api:latest

# Using docker-compose
docker-compose -f docker-compose.dev.yml up api
docker-compose -f docker-compose.dev.yml up db
```

### Full Stack
```bash
# Start entire stack (app + API + DB)
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

## API Testing

### Using cURL

```bash
# Get all vendors
curl http://localhost:3000/api/vendors

# Get vendor by slug
curl http://localhost:3000/api/vendors/nike-store

# Get vendor products
curl http://localhost:3000/api/vendors/nike-store/products

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get user profile (with token)
curl http://localhost:3000/api/auth/profile/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get vendor profile (with token)
curl http://localhost:3000/api/auth/profile/vendor \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get admin profile (with token)
curl http://localhost:3000/api/auth/profile/admin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Validate token
curl http://localhost:3000/api/auth/validate-token \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Create new collection "FashionKet"
2. Create requests:
   - GET /vendors
   - GET /vendors/:slug
   - POST /auth/login
   - GET /auth/profile/user
   - GET /auth/profile/vendor
   - GET /auth/profile/admin

3. Set variable: `{{base_url}}` = http://localhost:3000/api
4. Set variable: `{{token}}` = Your JWT token (from login response)

## File Locations Reference

### Key Frontend Files
```
src/
├── routes/
│   ├── __root.tsx                    [Auth initialization]
│   ├── (root)/
│   │   ├── _rootLayout.tsx           [User layout]
│   │   └── _authenticated.tsx        [Auth guard]
│   ├── vendor/
│   │   └── _vendorLayout.tsx         [Vendor layout]
│   └── admin/
│       └── _adminLayout.tsx          [Admin layout]
├── providers/
│   ├── auth-initializer.tsx          [Root auth setup]
│   ├── user-auth-provider.tsx        [User protection]
│   ├── vendor-auth-provider.tsx      [Vendor protection]
│   └── admin-auth-provider.tsx       [Admin protection]
├── hooks/
│   └── use-auth.ts                   [Central auth logic]
├── store/
│   └── auth.store.ts                 [Zustand state]
└── components/
    ├── vendor/
    │   ├── vendor-card.tsx
    │   ├── vendor-hero.tsx
    │   └── vendor-info.tsx
    └── auth/
        └── auth-guard.tsx
```

### Key Backend Files
```
src/
├── vendor/
│   ├── vendor.module.ts              [Module registration]
│   ├── vendor.controller.ts          [HTTP endpoints]
│   ├── vendor.service.ts             [Business logic]
│   └── dto/
│       └── query-vendor.dto.ts       [Query filters]
├── auth/
│   ├── auth.controller.ts            [Auth endpoints]
│   └── auth.service.ts               [Auth logic]
├── models/
│   └── vendor.schema.ts              [Database schema]
└── app.module.ts                     [Module imports]
```

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=FashionKet
VITE_ENABLE_DEVTOOLS=true
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fashionket
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=7d
REFRESH_TOKEN_EXPIRATION=30d
CORS_ORIGIN=http://localhost:5173
```

## Route URLs

### Public Routes
```
/                           Home
/products                   Product listing
/vendors                    Vendor listing
/vendors/:slug              Vendor detail
/vendor/login               Vendor login
/vendor/register            Vendor registration
/admin/login                Admin login
/login                      User login
/register                   User registration
```

### User Protected Routes
```
/account                    User profile
/orders                     Order history
/checkout                   Cart checkout
```

### Vendor Protected Routes
```
/vendor/account             Vendor profile
/vendor/products            Manage products
/vendor/orders              Manage orders
/vendor/analytics           Sales analytics
```

### Admin Protected Routes
```
/admin/account              Admin profile
/admin/dashboard            Dashboard
/admin/users                User management
/admin/vendors              Vendor management
/admin/orders               Order management
/admin/analytics            Analytics
```

## Debugging Tips

### Check Auth State in Browser Console
```javascript
// Get current auth state from Zustand
import { useAuthStore } from '@/store'
const state = useAuthStore.getState()
console.log(state)

// Check if user is authenticated
console.log(state.isAuthenticated)
console.log(state.role)
console.log(state.user || state.vendor || state.admin)
```

### Check Local Storage
```javascript
// View stored tokens
console.log(localStorage.getItem('access_token'))
console.log(localStorage.getItem('refresh_token'))

// View auth store
console.log(localStorage.getItem('auth-store'))
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Look for:
   - `/auth/login` - Login request
   - `/auth/validate-token` - Token validation
   - `/auth/refresh` - Token refresh
   - Other API calls with `Authorization` header

### Check React Query Cache
```javascript
// In DevTools console
import { queryClient } from '@/lib/queryClient'
console.log(queryClient.getQueryCache())

// Clear cache
queryClient.clear()
```

## Common Issues & Solutions

### Issue: "Loading..." forever
**Solution**: Check if backend `/api/auth/validate-token` endpoint is working
```bash
curl http://localhost:3000/api/auth/validate-token \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Issue: Redirected to login loop
**Solution**: Re-login to get fresh token, check token expiration
```javascript
// Check token expiration in console
const token = localStorage.getItem('access_token')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log(new Date(payload.exp * 1000))
```

### Issue: Cross-role page access (Security issue!)
**Solution**: Run verification script
```bash
./verify-auth-setup.sh
```

### Issue: CORS errors
**Solution**: Check backend CORS config matches frontend URL
```bash
# Frontend URL: http://localhost:5173
# Backend CORS_ORIGIN: http://localhost:5173
```

### Issue: API 404 errors
**Solution**: Check backend is running and routes are registered
```bash
# Verify backend is running
curl http://localhost:3000/api/vendors

# Check console for route registration errors
```

## Performance Tips

### Frontend
- Use React DevTools Profiler to check render times
- Use Lighthouse for performance audit
- Check bundle size: `pnpm run build && du -sh dist/`

### Backend
- Monitor MongoDB connection pool
- Check slow queries in MongoDB logs
- Use database indexes (already configured for slug)

## Production Deployment Checklist

### Frontend
- [ ] Build optimized: `pnpm run build`
- [ ] Check bundle size
- [ ] Environment variables set
- [ ] API URL points to production
- [ ] DevTools disabled
- [ ] Build uploaded to CDN

### Backend
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] SSL/TLS certificates installed
- [ ] JWT_SECRET changed
- [ ] CORS_ORIGIN set to production domain
- [ ] Rate limiting configured
- [ ] Monitoring enabled

### Database
- [ ] Backups scheduled
- [ ] Indexes created
- [ ] Replication enabled
- [ ] Monitoring configured

## Useful Links

- **Frontend Repo**: `/home/ultimate/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-webapp`
- **Backend Repo**: `/home/ultimate/Desktop/UltimateIntelliForge.org/fashionket.com/fashionket-api-service`
- **Auth Guide**: See `AUTH_PROVIDER_INTEGRATION.md`
- **Architecture**: See `ARCHITECTURE_DIAGRAMS.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

## Getting Help

1. Check the documentation files
2. Run verification script: `./verify-auth-setup.sh`
3. Check console logs for errors
4. Review Network tab in DevTools
5. Check backend logs for API errors

---

**Last Updated**: 2026
**Status**: Production Ready ✅
