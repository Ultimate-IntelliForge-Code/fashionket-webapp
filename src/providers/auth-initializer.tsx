import React from 'react';
import { useAuth } from '@/hooks';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Auth Initializer - Initializes authentication state at app root
 * 
 * Key improvements:
 * 1. Validates token ONLY ONCE on app mount
 * 2. Uses isInitialized flag to prevent re-validation
 * 3. All auth context flows from this single source of truth
 * 4. No loading state shown - happens in background
 * 
 * This component should wrap your entire app in main.tsx:
 * <AuthInitializer>
 *   <RouterProvider router={router} />
 * </AuthInitializer>
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  // Auth validation happens automatically in useAuth
  // Only runs once on mount due to isInitialized flag
  // No loading state shown to user - maintains smooth UX
  useAuth();

  return <>{children}</>;
};