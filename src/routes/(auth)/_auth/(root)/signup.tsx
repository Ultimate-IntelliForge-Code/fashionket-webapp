import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserSignup } from '@/api/mutations';
import { useAuth } from '@/hooks';
import { AuthFormWrapper, GoogleAuthButton } from '@/components/auth';
import { Eye, EyeOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { SignupFormData, signupSchema } from '@/lib';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/(auth)/_auth/(root)/signup')({
  component: SignupPage,
});

function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { mutate: signup, isPending } = useUserSignup();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema as any),
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Password strength checks
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ''),
    lowercase: /[a-z]/.test(password || ''),
    number: /[0-9]/.test(password || ''),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password || ''),
  };

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const onSubmit = (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      signup(signupData, {
        onSuccess: (response) => {
          if (response.success) {
            setAuth(response.data);
            toast.success('Account created successfully! Welcome aboard!');
            navigate({ to: '/' });
          }
        },
        onError: (error: any) => {
          setError('root', {
            type: 'manual',
            message: error.message || 'Signup failed. Please try again.',
          });
        },
      });
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Signup failed. Please try again.',
      });
    }
  };

  const footer = (
    <div className="text-center space-y-2">
      <div className="text-sm text-brand-muted">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Sign in
        </Link>
      </div>
      <div className="text-sm text-brand-muted">
        Are you a Business Owner?{' '}
        <Link
          to="/vendor/register"
          className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Business Registration
        </Link>
      </div>
    </div>
  );

  return (
    <AuthFormWrapper
      title="Create your account"
      description="Join FashionKet to start shopping for the latest fashion"
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

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-brand-dark font-medium">
            Full Name
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register('fullName')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
              errors.fullName && "border-brand-error"
            )}
          />
          {errors.fullName && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
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

        {/* Phone (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-brand-dark font-medium">
            Phone Number <span className="text-brand-muted text-xs">(Optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
            className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-brand-dark font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={cn(
                "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft pr-10",
                errors.password && "border-brand-error"
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
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
          
          {errors.password && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-brand-dark font-medium">
            Confirm Password
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
          disabled={isPending || !!(password && !allChecksPassed)}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-primary-soft"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-brand-muted">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton disabled={isPending} />
    </AuthFormWrapper>
  );
}