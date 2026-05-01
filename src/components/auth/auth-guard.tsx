import React from "react";
import { Button } from "../ui/button";
import { Navigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/store"; // ← read store directly, no query side-effects
import { UserRole } from "@/types";
import { Shield, AlertTriangle, Lock, Home, ArrowRight } from "lucide-react";

interface AccessDeniedScreenProps {
  allowedRoles: UserRole[];
  role: UserRole;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[]; // ← typed, not string[]
  redirectTo?: string;
}

const ROLE_HOME: Record<UserRole, string> = {
  [UserRole.ADMIN]: "/admin",
  [UserRole.SUPER_ADMIN]: "/admin",
  [UserRole.VENDOR]: "/vendor",
  [UserRole.USER]: "/",
};

const LOGIN_BY_ROLE: Record<UserRole, string> = {
  [UserRole.ADMIN]: "/admin/login",
  [UserRole.SUPER_ADMIN]: "/admin/login",
  [UserRole.VENDOR]: "/vendor/login",
  [UserRole.USER]: "/login",
};

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo,
}) => {
  // Read store directly — no queries, no side-effects.
  // useAuth() (and its useValidateToken) runs once in AuthInitializer.
  // By the time any route renders, the store is already populated.
  const { isAuthenticated, role, isInitialized } = useAuthStore();
  const location = useLocation();

  // Still initializing — block render until the one validate call resolves
  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  // Auth required but not authenticated → send to the right login page
  if (requireAuth && !isAuthenticated) {
    // Infer login path from where they're trying to go, not their (unknown) role
    const loginPath =
      redirectTo ??
      (location.pathname.startsWith("/admin")
        ? "/admin/login"
        : location.pathname.startsWith("/vendor")
          ? "/vendor/login"
          : "/login");

    return <Navigate to={loginPath} replace />;
  }

  // Public-only page (login/signup) but already authenticated → home for their role
  if (!requireAuth && isAuthenticated && role) {
    return <Navigate to={redirectTo ?? ROLE_HOME[role]} replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <AccessDeniedScreen allowedRoles={allowedRoles} role={role} />;
  }

  return <>{children}</>;
};

function AuthLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-surface">
      <div className="text-center max-w-md px-4">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full bg-brand-primary-soft animate-ping" />
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-soft/50">
            <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark mb-2">
          Verifying your session
        </h2>
        <p className="text-brand-muted text-sm sm:text-base">
          Please wait while we secure your access...
        </p>
        <div className="mt-8 space-y-3">
          <div className="h-2 bg-brand-primary-soft rounded-full animate-pulse" />
          <div className="h-2 bg-brand-primary-soft rounded-full animate-pulse w-3/4 mx-auto" />
        </div>
      </div>
    </div>
  );
}

function AccessDeniedScreen({ allowedRoles, role }: AccessDeniedScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-surface p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-primary-soft overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-brand-error via-brand-warning to-brand-error" />

          <div className="p-6 sm:p-8 text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-brand-error/10 animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-error/10">
                <Shield className="h-10 w-10 text-brand-error" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Access Denied
            </h1>
            <p className="text-brand-muted text-sm sm:text-base mb-6">
              You don't have permission to access this page.
            </p>

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

            <div className="bg-brand-warning/10 border border-brand-warning/20 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-brand-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-brand-dark mb-1">
                    Need access?
                  </p>
                  <p className="text-brand-muted">
                    Contact your administrator or{" "}
                    <a
                      href="/support"
                      className="text-brand-primary hover:underline"
                    >
                      customer support
                    </a>{" "}
                    if you believe this is a mistake.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart "go home" — sends them to their own role's home, not the root */}
            <div className="space-y-3">
              <a
                href={ROLE_HOME[role]}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary-hover transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>

              <Button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-brand-dark border border-brand-primary-soft rounded-xl hover:bg-brand-primary-soft transition-all duration-200"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-brand-muted mt-6">
          Signed in as{" "}
          <span className="font-medium text-brand-dark">{role}</span>
        </p>
      </div>
    </div>
  );
}
