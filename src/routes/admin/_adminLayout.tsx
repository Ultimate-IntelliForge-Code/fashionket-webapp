import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAuthProvider } from "@/providers/auth-provider";

export const Route = createFileRoute("/admin/_adminLayout")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <AdminAuthProvider>
      {!isAuthenticated || !isAdmin ? (
        <Navigate to="/admin/login" />
      ) : (
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </AdminAuthProvider>
  );
}
