import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * AuthGuard - Route protection component
 * 
 * Improvements:
 * 1. Shows loading ONLY during initial validation (not on every navigation)
 * 2. Uses isInitialized to prevent re-render loops
 * 3. Blocks rendering until initialization completes
 * 4. Role-based access control from backend cookies
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo,
}) => {
  const { isAuthenticated, role, isInitialized } = useAuth();
  const location = useLocation();

  // CRITICAL: Block while loading ONLY if not initialized
  // Once initialized, no more loading screens on navigation
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
  if (requireAuth && !isAuthenticated) {
    const loginPath = location.pathname.startsWith('/admin')
      ? '/admin/login'
      : location.pathname.startsWith('/vendor')
        ? '/vendor/login'
        : '/login';

    return <Navigate to={redirectTo || loginPath} />;
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && isAuthenticated) {
    const redirectPath =
      role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
        ? '/admin'
        : role === UserRole.VENDOR
          ? '/vendor'
          : '/';

    return <Navigate to={redirectTo || redirectPath} />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Required role:{' '}
            {allowedRoles.join(' or ')}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
};