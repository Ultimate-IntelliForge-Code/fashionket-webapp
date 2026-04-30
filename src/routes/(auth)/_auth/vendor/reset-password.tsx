import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/api/mutations';
import { AuthFormWrapper } from '@/components/auth';
import { Eye, EyeOff, CheckCircle, Shield, Key, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { ResetPasswordFormData, resetPasswordSchema } from '@/lib';
import { cn } from '@/lib/utils';
import z from 'zod';

export const Route = createFileRoute('/(auth)/_auth/vendor/reset-password')({
  component: VendorResetPasswordPage,
  validateSearch: z.object({
    token: z.string().optional().catch(''),
  }),
});

function VendorResetPasswordPage() {
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

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(data, {
        onSuccess: () => {
          setIsSubmitted(true);
          toast.success('Password reset successful!');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Reset failed. Please try again.');
          setError('root', { message: error.message });
        },
      });
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to reset password. Please try again.',
      });
    }
  };

  const footer = (
    <div className="text-center">
      <Link
        to="/vendor/login"
        className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Store Login
      </Link>
    </div>
  );

  if (isSubmitted) {
    return (
      <AuthFormWrapper
        title={
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-brand-success" />
            <span>Password Updated</span>
          </div>
        }
        description="Your store password has been successfully reset"
        footer={footer}
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-brand-success/10">
              <CheckCircle className="h-16 w-16 text-brand-success" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-brand-dark">
              Security Update Complete
            </h3>
            <p className="text-sm text-brand-muted">
              Your store password has been successfully reset. For security reasons, 
              you'll need to sign in again with your new password.
            </p>
            <div className="p-4 rounded-xl bg-brand-primary-soft/30 border border-brand-primary-soft">
              <p className="text-sm text-brand-dark">
                <strong className="text-brand-primary">Security Tip:</strong> Consider using a password manager 
                to securely store and generate strong passwords.
              </p>
            </div>
          </div>
          
          <Button
            asChild
            className="w-full h-11 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
          >
            <Link to="/vendor/login">Sign In with New Password</Link>
          </Button>
        </div>
      </AuthFormWrapper>
    );
  }

  const getStrengthColor = () => {
    if (!newPassword) return 'bg-brand-muted'
    let strength = 0
    if (newPassword.length >= 8) strength++
    if (/[a-z]/.test(newPassword)) strength++
    if (/[A-Z]/.test(newPassword)) strength++
    if (/\d/.test(newPassword)) strength++
    if (/[@$!%*?&]/.test(newPassword)) strength++
    
    if (strength <= 2) return 'bg-brand-error'
    if (strength <= 4) return 'bg-brand-warning'
    return 'bg-brand-success'
  }

  return (
    <AuthFormWrapper
      title={
        <div className="flex items-center justify-center gap-2">
          <Key className="h-6 w-6 text-brand-primary" />
          <span>Set New Password</span>
        </div>
      }
      description="Create a new secure password for your store account"
      footer={footer}
    >
      <div className="mb-6 p-4 rounded-xl bg-brand-primary-soft/30 border border-brand-primary-soft">
        <p className="text-sm text-brand-dark">
          <strong className="text-brand-primary">Security Requirements:</strong> Store passwords must meet higher security standards.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20">
            <p className="text-sm text-brand-error">{errors.root.message}</p>
          </div>
        )}

        {/* Reset Token */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-brand-dark font-medium">
            Reset Token <span className="text-brand-error">*</span>
          </Label>
          <Input
            id="token"
            type="text"
            placeholder="Paste the token from your email"
            className={cn(
              "h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
              errors.token && "border-brand-error"
            )}
            {...register('token')}
          />
          {errors.token && (
            <p className="text-sm text-brand-error">{errors.token.message}</p>
          )}
          <p className="text-xs text-brand-muted">
            Found in the password reset email we sent you
          </p>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-brand-dark font-medium">
              New Password <span className="text-brand-error">*</span>
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pr-10 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-brand-error">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-brand-dark font-medium">
              Confirm Password <span className="text-brand-error">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pr-10 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-brand-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-3 p-4 rounded-xl bg-brand-surface border border-brand-primary-soft">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-brand-dark font-medium">Password Strength</span>
                <span className="text-brand-muted">
                  {newPassword.length}/8+ characters
                </span>
              </div>
              <div className="h-1.5 w-full bg-brand-primary-soft rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-300 rounded-full", getStrengthColor())}
                  style={{ width: `${Math.min((newPassword.length / 12) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <p className="text-xs font-medium text-brand-dark mb-2">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { check: newPassword.length >= 8, text: 'Minimum 8 characters' },
                  { check: /[a-z]/.test(newPassword), text: 'Lowercase letter' },
                  { check: /[A-Z]/.test(newPassword), text: 'Uppercase letter' },
                  { check: /\d/.test(newPassword), text: 'Number' },
                  { check: /[@$!%*?&]/.test(newPassword), text: 'Special character' },
                ].map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      req.check ? "bg-brand-success" : "bg-brand-muted"
                    )} />
                    <span className={req.check ? "text-brand-dark" : "text-brand-muted"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 rounded-xl bg-brand-warning/10 border border-brand-warning/20">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-brand-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-dark">
              <strong className="text-brand-warning">Important:</strong> After resetting your password, 
              you'll be logged out of all other sessions for security.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm transition-all duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Updating Password...
            </>
          ) : (
            'Reset Store Password'
          )}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}