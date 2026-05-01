import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import '../styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ToastContainer } from 'react-toastify';
import type { QueryClient } from '@tanstack/react-query';
import { AuthInitializer } from '@/providers/auth-initializer';

import { ensureAuthInitialized } from '@/lib/auth-init';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    // ✅ Initialize auth at ROOT level before any child routes load
    // This ensures /auth/validate runs BEFORE protected routes redirect
    console.log('[ROOT] beforeLoad: Starting auth initialization...');
    await ensureAuthInitialized(context.queryClient);
    console.log('[ROOT] beforeLoad: Auth initialization complete');
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Welcome to FashionKet' },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  // ✅ No hooks here — this renders outside QueryClientProvider.
  // useTokenRefresh lives inside AuthInitializer → inside QueryClientProvider.
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            <main>{children}</main>
          </AuthInitializer>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </QueryClientProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  );
}