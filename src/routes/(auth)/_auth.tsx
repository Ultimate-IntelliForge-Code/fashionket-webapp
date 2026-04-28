import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AuthGuard } from '@/components/auth';

export const Route = createFileRoute('/(auth)/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </AuthGuard>
  );
}