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
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle, KeyRound } from 'lucide-react';
import { validatePassword } from '@/lib/validation.utils';
import { cn } from '@/lib/utils';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const validation = validatePassword(data.newPassword);
  return validation.valid;
}, {
  message: "Password must contain uppercase, lowercase, number, and special character",
  path: ["newPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const Route = createFileRoute('/(auth)/_auth/(root)/reset-password')({
  component: ResetPasswordPage,
  validateSearch: z.object({
    token: z.string().optional().catch(''),
  }),
});

function ResetPasswordPage() {
  const search = Route.useSearch();
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
  const confirmPassword = watch('confirmPassword');

  // Password strength checks
  const passwordChecks = {
    length: newPassword?.length >= 8,
    uppercase: /[A-Z]/.test(newPassword || ''),
    lowercase: /[a-z]/.test(newPassword || ''),
    number: /[0-9]/.test(newPassword || ''),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || ''),
  };

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPassword(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        setError('root', {
          type: 'manual',
          message: error.message || 'Failed to reset password. Please try again.',
        });
      },
    });
  };

  const footer = (
    <div className="text-center">
      <div className="text-sm text-brand-muted">
        Remember your password?{' '}
        <Link
          to="/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <AuthFormWrapper
        title="Password Reset Successful"
        description="Your password has been updated"
        footer={footer}
      >
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-brand-success/20 animate-ping" />
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-success/10">
                <CheckCircle className="h-8 w-8 text-brand-success" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-brand-dark">
              Success!
            </h3>
            <p className="text-sm text-brand-muted">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
          </div>

          <Button
            asChild
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm h-11"
          >
            <Link to="/login">Sign In Now</Link>
          </Button>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Set new password"
      description="Create a strong password for your account"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Root Error */}
        {errors.root && (
          <div className="flex items-start gap-2 p-3 bg-brand-error/10 border border-brand-error/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-brand-error mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-error">{errors.root.message}</p>
          </div>
        )}

        {/* Reset Token */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-brand-dark font-medium">
            Reset Token
          </Label>
          <Input
            id="token"
            type="text"
            placeholder="Enter reset token from email"
            {...register('token')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
              errors.token && "border-brand-error"
            )}
          />
          {errors.token && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.token.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-brand-dark font-medium">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('newPassword')}
              className={cn(
                "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft pr-10",
                errors.newPassword && "border-brand-error"
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1">
                {Object.values(passwordChecks).map((passed, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 h-1 rounded-full transition-all duration-300",
                      passed ? "bg-brand-success" : "bg-brand-primary-soft"
                    )}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {Object.entries(passwordChecks).map(([key, passed]) => (
                  <div key={key} className="flex items-center gap-1">
                    {passed ? (
                      <CheckCircle className="h-3 w-3 text-brand-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-brand-muted" />
                    )}
                    <span className={passed ? "text-brand-success" : "text-brand-muted"}>
                      {key === 'length' && '8+ characters'}
                      {key === 'uppercase' && 'Uppercase'}
                      {key === 'lowercase' && 'Lowercase'}
                      {key === 'number' && 'Number'}
                      {key === 'special' && 'Special character'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.newPassword && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-brand-dark font-medium">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={cn(
                "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft pr-10",
                (errors.confirmPassword || (confirmPassword && !passwordsMatch)) && "border-brand-error"
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className="flex items-center gap-1 text-xs">
              {passwordsMatch ? (
                <>
                  <CheckCircle className="h-3 w-3 text-brand-success" />
                  <span className="text-brand-success">Passwords match</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 text-brand-error" />
                  <span className="text-brand-error">Passwords do not match</span>
                </>
              )}
            </div>
          )}
          
          {errors.confirmPassword && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm h-11"
          disabled={isPending || !!(newPassword && !allChecksPassed)}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Resetting...
            </div>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}