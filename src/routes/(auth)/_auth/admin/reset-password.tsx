// Admin Reset Password Page
import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/api/mutations';
import { AuthFormWrapper } from '@/components/auth';
import { Eye, EyeOff, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { ResetPasswordFormData, resetPasswordSchema } from '@/lib';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/(auth)/_auth/admin/reset-password')({
  component: AdminResetPasswordPage,
  validateSearch: z.object({
    token: z.string().optional().catch(''),
  }),
});

function AdminResetPasswordPage() {
  const search = Route.useSearch()
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema as any),
    defaultValues: {
      token: search.token || '',
    },
  });

  const newPassword = watch('newPassword');

  // Password strength checker
  const passwordChecks = {
    length: newPassword?.length >= 8,
    lowercase: /(?=.*[a-z])/.test(newPassword || ''),
    uppercase: /(?=.*[A-Z])/.test(newPassword || ''),
    number: /(?=.*\d)/.test(newPassword || ''),
    special: /(?=.*[@$!%*?&])/.test(newPassword || ''),
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data, {
        onSuccess: () => {
          setIsSubmitted(true);
          toast.success('Password reset successful');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Reset failed');
        },
      });
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to reset password. Please try again.',
      });
    }
  };

  const footer = (
    <div className="text-center">
      <div className="text-sm text-brand-muted">
        <Link
          to="/admin/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <AuthFormWrapper
        title={
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-brand-primary" />
            <span className="text-brand-dark">Password Updated</span>
          </div>
        }
        description="Your admin password has been successfully reset"
        footer={footer}
      >
        <div className="text-center space-y-6">
          {/* Success Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-brand-success/20 animate-ping" />
              <div className="relative p-4 bg-brand-success/10 rounded-full">
                <CheckCircle className="h-12 w-12 text-brand-success" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-brand-dark">
              Security Update Complete
            </h3>
            <p className="text-sm text-brand-muted">
              Your admin password has been successfully reset. You'll need to sign in with your new password.
            </p>
            
            {/* Security Tip */}
            <div className="p-4 bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl text-left">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-brand-dark mb-1">Security Tip</p>
                  <p className="text-brand-muted text-xs">
                    Consider using a password manager to securely store and generate strong passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md"
          >
            <Link to="/admin/login">Sign In with New Password</Link>
          </Button>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title={
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-brand-primary" />
          <span className="text-brand-dark">Set New Password</span>
        </div>
      }
      description="Create a new secure password for your admin account"
      footer={footer}
    >
      {/* Security Notice */}
      <div className="mb-6 p-4 bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-brand-dark mb-1">Security Requirements</p>
            <p className="text-brand-muted text-xs">
              Business passwords must meet higher security standards.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Root Error */}
        {errors.root && (
          <div className="flex items-start gap-2 p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-brand-error mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-error">{errors.root.message}</p>
          </div>
        )}

        {/* Token Field */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-brand-dark font-medium">
            Reset Token
          </Label>
          <Input
            id="token"
            type="text"
            placeholder="Paste the token from your email"
            {...register('token')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary",
              errors.token && "border-brand-error"
            )}
          />
          {errors.token && (
            <p className="text-sm text-brand-error">{errors.token.message}</p>
          )}
          <p className="text-xs text-brand-muted mt-1">
            Found in the password reset email
          </p>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-brand-dark font-medium">
              New Password *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('newPassword')}
                className={cn(
                  "pr-10 border-brand-primary-soft focus:border-brand-primary",
                  errors.newPassword && "border-brand-error"
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-brand-error">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-brand-dark font-medium">
              Confirm Password *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={cn(
                  "pr-10 border-brand-primary-soft focus:border-brand-primary",
                  errors.confirmPassword && "border-brand-error"
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-brand-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Password Requirements */}
        {newPassword && (
          <div className="p-4 bg-brand-surface rounded-lg border border-brand-primary-soft">
            <p className="text-sm font-medium text-brand-dark mb-3">Password Requirements:</p>
            <div className="space-y-2 text-xs">
              {Object.entries({
                length: 'At least 8 characters',
                lowercase: 'One lowercase letter',
                uppercase: 'One uppercase letter',
                number: 'One number',
                special: 'One special character (@$!%*?&)',
              }).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  {passwordChecks[key as keyof typeof passwordChecks] ? (
                    <CheckCircle className="h-3 w-3 text-brand-success" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-brand-muted" />
                  )}
                  <span className={cn(
                    "text-brand-muted",
                    passwordChecks[key as keyof typeof passwordChecks] && "text-brand-success"
                  )}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Important Note */}
        <div className="p-3 bg-brand-warning/10 border border-brand-warning/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-brand-warning mt-0.5 flex-shrink-0" />
            <p className="text-xs text-brand-warning">
              <strong>Important:</strong> After resetting your password, you'll be logged out of all other sessions for security.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300"
          disabled={isPending}
          size="lg"
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Updating Password...
            </>
          ) : (
            'Reset Admin Password'
          )}
        </Button>
      </form>
    </AuthFormWrapper>
  )
}