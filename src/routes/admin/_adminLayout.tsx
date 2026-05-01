import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AuthGuard } from "@/components/auth";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types";

export const Route = createFileRoute("/admin/_adminLayout")({
  beforeLoad: async ({ context }) => {
    // ✅ Auth is already initialized at ROOT level
    const store = useAuthStore.getState();

    // Check both authenticated AND admin/super_admin role
    if (
      !store.isAuthenticated ||
      (store.role !== UserRole.ADMIN && store.role !== UserRole.SUPER_ADMIN)
    ) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
