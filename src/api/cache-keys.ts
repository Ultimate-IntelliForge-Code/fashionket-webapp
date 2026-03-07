export const queryKeys = {
  auth: {
    validate: () => ['auth', 'validate'] as const,
    user: () => ['auth', 'user'] as const,
    admin: () => ['auth', 'admin'] as const,
    vendor: () => ['auth', 'vendor'] as const,
  },

  profile: {
    user: () => ['profile', 'user'] as const,
    admin: () => ['profile', 'admin'] as const,
    vendor: () => ['profile', 'vendor'] as const,
  },

  user: {
    all: () => ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },

  admin: {
    all: (filters?: Record<string, any>) => ['admins', 'list', filters] as const,
    detail: (id: string) => ['admins', 'detail', id] as const,
  },

  users: {
    all: (filters?: Record<string, any>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },

  vendor: {
    all: (filters?: Record<string, any>, slug?: string) => ['vendors', 'list', filters, slug] as const,
    detail: (id: string) => ['vendors', 'detail', id] as const,
    bySlug: (slug: string) => ['vendors', 'slug', slug] as const,
    products: (slug: string) => ['vendors', slug, 'products'] as const,
  },

  products: {
    all: (filters?: Record<string, any>) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    bySlug: (slug: string) => ['products', 'slug', slug] as const,
    featured: (limit?: number) => ['featured', 'limit', limit] as const,
    related: (id: string, limit?: number) => ['related', 'productId', id, 'slug', limit] as const,
  },

  categories: {
    all: (filters?: Record<string, any>) => ['categories', 'list', filters] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
    tree: () => ['categories', 'tree'] as const,
    bySlug: (slug: string) => ['categories', 'slug', slug] as const,
  },

  cart: {
    detail: () => ['cart'] as const,
  },

  orders: {
    all: (filters?: Record<string, any>) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    byNumber: (orderNumber: string) => ['orders', 'number', orderNumber] as const,
    stats: (userId?: string) => ['orders', 'stats', userId] as const,
  },
  addresses: {
    all: ['addresses'] as const,
    lists: () => [...queryKeys.addresses.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.addresses.all, 'detail', id] as const,
  },

  payments: {
    all: ['payments'] as const,
    lists: (filters?: Record<string, any>) => [...queryKeys.payments.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.payments.all, 'detail', id] as const,
  },
};