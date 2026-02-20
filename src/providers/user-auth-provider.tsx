import React from 'react';
import { useAuth } from '@/hooks';

interface UserAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * User Auth Provider - Protects user-only routes
 * Validates user is authenticated and has USER role
 * Used in (root)/_rootLayout routes
 * 
 * Loading happens in background - no loading state shown to user
 */
export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isUser, isAuthenticated } = useAuth();

  // If auth is required but user is not authenticated or doesn't have USER role
  if (requireAuth && (!isAuthenticated || !isUser)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {!isAuthenticated
              ? 'Please log in to access this page'
              : 'You do not have permission to access this page'}
          </p>
          <a href="/login" className="text-primary hover:underline">
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
