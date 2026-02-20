import React from 'react';
import { useAuth } from '@/hooks';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Auth Initializer - Initializes authentication state at app root
 * This component validates tokens and syncs auth state globally
 * All auth context flows from this single source of truth
 * 
 * Loading happens in background without blocking user view
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  // Auth loading happens in background via useAuth hook
  // No loading state shown to user - maintains smooth UX
  useAuth();

  return <>{children}</>;
};
