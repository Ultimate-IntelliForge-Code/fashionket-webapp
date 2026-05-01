import React from 'react';
import { useAuth } from '@/hooks';
import { useTokenRefresh } from '@/hooks';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  useAuth();          // validate once on cold boot
  useTokenRefresh();  // start 14-min refresh loop once authenticated
  return <>{children}</>;
};