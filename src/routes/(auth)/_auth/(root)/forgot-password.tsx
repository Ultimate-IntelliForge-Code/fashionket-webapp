import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRequestPasswordReset } from '@/api/mutations';
import { AuthFormWrapper } from '@/components/auth';
import { AlertCircle, Mail } from 'lucide-react';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/(auth)/_auth/(root)/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');
  const { mutate: requestReset, isPending } = useRequestPasswordReset('user');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema as any),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    requestReset(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        setError('root', {
          type: 'manual',
          message: error.message || 'Failed to send reset email. Please try again.',
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
        title="Check your email"
        description="We've sent you a password reset link"
        footer={footer}
      >
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-brand-success/20 animate-ping" />
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-success/10">
                <Mail className="h-8 w-8 text-brand-success" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-brand-dark">
              Reset link sent!
            </h3>
            <p className="text-sm text-brand-muted">
              We've sent a password reset link to{' '}
              <span className="font-medium text-brand-dark">{submittedEmail}</span>
            </p>
            <p className="text-xs text-brand-muted mt-3">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-brand-primary hover:underline font-medium"
              >
                try again
              </button>
            </p>
          </div>

          <Button
            asChild
            className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm h-11"
          >
            <Link to="/login">Back to Sign In</Link>
          </Button>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password."
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

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-dark font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
              errors.email && "border-brand-error"
            )}
          />
          {errors.email && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm h-11"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </div>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}