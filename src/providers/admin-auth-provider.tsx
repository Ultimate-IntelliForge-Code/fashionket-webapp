import React from 'react';
import { useAuth } from '@/hooks';

interface AdminAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Admin Auth Provider - Protects admin-only routes
 * Validates admin is authenticated and has ADMIN or SUPER_ADMIN role
 * Used in /admin/_adminLayout routes
 * 
 * Loading happens in background - no loading state shown to user
 */
export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAdmin, isAuthenticated } = useAuth();

  // If auth is required but admin is not authenticated or doesn't have ADMIN role
  if (requireAuth && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {!isAuthenticated
              ? 'Please log in to access this page'
              : 'You do not have permission to access this page. Admin access required.'}
          </p>
          <a href="/admin/login" className="text-primary hover:underline">
            Go to admin login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
