import React from 'react';
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/hooks';
import { UserRole } from '@/types';
import { Shield, AlertTriangle, Lock, Home, ArrowRight } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * AuthGuard - Route protection component
 * 
 * Features:
 * 1. Shows loading only during initial validation
 * 2. Uses isInitialized to prevent re-render loops
 * 3. Role-based access control from backend cookies
 * 4. Premium UI with brand theme tokens
 * 5. Responsive design for all screen sizes
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo,
}) => {
  const { isAuthenticated, role, isInitialized } = useAuth();
  const location = useLocation();

  // Loading state - shown only during initial auth initialization
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-surface">
        <div className="text-center max-w-md px-4">
          {/* Animated loader */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full bg-brand-primary-soft animate-ping" />
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-soft/50">
              <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
            </div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark mb-2">
            Verifying your session
          </h2>
          <p className="text-brand-muted text-sm sm:text-base">
            Please wait while we secure your access...
          </p>
          
          {/* Skeleton loader for better UX */}
          <div className="mt-8 space-y-3">
            <div className="h-2 bg-brand-primary-soft rounded-full animate-pulse" />
            <div className="h-2 bg-brand-primary-soft rounded-full animate-pulse w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Auth required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    const loginPath = location.pathname.startsWith('/admin')
      ? '/admin/login'
      : location.pathname.startsWith('/vendor')
        ? '/vendor/login'
        : '/login';

    return <Navigate to={redirectTo || loginPath} />;
  }

  // Auth not required (login/signup pages) but user is authenticated
  if (!requireAuth && isAuthenticated) {
    const redirectPath = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN
      ? '/admin'
      : role === UserRole.VENDOR
        ? '/vendor'
        : '/';

    return <Navigate to={redirectTo || redirectPath} />;
  }

  // Role-based access control - Access denied
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-surface p-4">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-brand-primary-soft overflow-hidden">
            {/* Decorative header */}
            <div className="h-2 bg-gradient-to-r from-brand-error via-brand-warning to-brand-error" />
            
            <div className="p-6 sm:p-8 text-center">
              {/* Access denied icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-brand-error/10 animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-error/10">
                  <Shield className="h-10 w-10 text-brand-error" />
                </div>
              </div>

              {/* Title and description */}
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
                Access Denied
              </h1>
              <p className="text-brand-muted text-sm sm:text-base mb-6">
                You don't have permission to access this page.
              </p>

              {/* Role requirement badge */}
              <div className="bg-brand-primary-soft rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-brand-primary" />
                  <span className="text-sm font-semibold text-brand-primary">
                    Required Role
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {allowedRoles.map((allowedRole, index) => (
                    <React.Fragment key={allowedRole}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-brand-primary border border-brand-primary-soft">
                        {allowedRole}
                      </span>
                      {index < allowedRoles.length - 1 && (
                        <span className="text-brand-muted">or</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Information message */}
              <div className="bg-brand-warning/10 border border-brand-warning/20 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-brand-warning mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-brand-dark mb-1">
                      Need access?
                    </p>
                    <p className="text-brand-muted">
                      If you believe this is a mistake, please contact your 
                      administrator or customer support for assistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <a
                  href="/"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary-hover transition-all duration-200 shadow-sm hover:shadow-md group"
                >
                  <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Go to Homepage</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-brand-dark border border-brand-primary-soft rounded-xl hover:bg-brand-primary-soft transition-all duration-200"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-brand-muted mt-6">
            If you're having trouble accessing your account, please{' '}
            <a href="/support" className="text-brand-primary hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
};