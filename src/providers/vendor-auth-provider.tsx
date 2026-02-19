import React from 'react';
import { useAuth } from '@/hooks';

interface VendorAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Vendor Auth Provider - Protects vendor-only routes
 * Validates vendor is authenticated and has VENDOR role
 * Used in /vendor/_vendorLayout routes
 * 
 * Loading happens in background - no loading state shown to user
 */
export const VendorAuthProvider: React.FC<VendorAuthProviderProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isVendor, isAuthenticated } = useAuth();

  // If auth is required but vendor is not authenticated or doesn't have VENDOR role
  if (requireAuth && (!isAuthenticated || !isVendor)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {!isAuthenticated
              ? 'Please log in to access this page'
              : 'You do not have permission to access this page. Vendor access required.'}
          </p>
          <a href="/vendor/login" className="text-primary hover:underline">
            Go to vendor login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
