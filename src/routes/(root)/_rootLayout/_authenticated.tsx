import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AuthGuard } from '@/components/auth';
import { useAuthStore } from '@/store';

export const Route = createFileRoute('/(root)/_rootLayout/_authenticated')({
  beforeLoad: async ({ context }) => {
    const store = useAuthStore.getState();
    console.log('[Authenticated] Checking authentication in _authenticated layout, isAuthenticated:', store.isAuthenticated);
    // ✅ Auth is already initialized at ROOT level
    // If still not authenticated, redirect to login
    if (!store.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AuthGuard requireAuth={true}>
      <Outlet />
    </AuthGuard>
  );
}