import React from 'react';
import { useAuthStore } from '@/store';
import { Navigate } from '@tanstack/react-router';

interface AdminAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Admin Auth Provider - Protects admin-only routes
 * 
 * Improvements:
 * 1. Uses isInitialized to prevent premature checks
 * 2. Shows loading only during initial validation
 * 3. Redirects with Navigate component (proper routing)
 * 4. Role verified from backend cookies
 */
export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
  requireAuth = true,
}) => {
  const { admin, isAuthenticated, isInitialized } = useAuthStore();

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Auth check after initialization
  if (requireAuth && (!isAuthenticated || !admin)) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

interface UserAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * User Auth Provider - Protects user-only routes
 */
export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
  requireAuth = true,
}) => {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Auth check after initialization
  if (requireAuth && (!isAuthenticated || !user)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

interface VendorAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Vendor Auth Provider - Protects vendor-only routes
 */
export const VendorAuthProvider: React.FC<VendorAuthProviderProps> = ({
  children,
  requireAuth = true,
}) => {
  const { vendor, isAuthenticated, isInitialized } = useAuthStore();

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Auth check after initialization
  if (requireAuth && (!isAuthenticated || !vendor)) {
    return <Navigate to="/vendor/login" />;
  }

  return <>{children}</>;
};