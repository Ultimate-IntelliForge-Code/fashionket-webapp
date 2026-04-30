import React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAdminSignup } from '@/api/mutations';
import { useAuth } from '@/hooks';
import { AuthFormWrapper, GoogleAuthButton } from '@/components/auth';
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminSignupFormData, adminSignupSchema } from '@/lib';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/(auth)/_auth/admin/register')({
  component: AdminSignupPage,
});

function AdminSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { mutate: signup, isPending } = useAdminSignup();
  const { setAuthAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<AdminSignupFormData>({
    resolver: zodResolver(adminSignupSchema as any),
    defaultValues: {
      businessType: 'boutique',
      acceptTerms: false,
      requestPermissions: false,
    },
  });

  const password = watch('password');
  const businessType = watch('businessType');

  // Password strength checker
  const passwordChecks = {
    length: password?.length >= 8,
    lowercase: /(?=.*[a-z])/.test(password || ''),
    uppercase: /(?=.*[A-Z])/.test(password || ''),
    number: /(?=.*\d)/.test(password || ''),
    special: /(?=.*[@$!%*?&])/.test(password || ''),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const onSubmit = async (data: AdminSignupFormData) => {
    try {
      const { confirmPassword, acceptTerms, requestPermissions, ...signupData } = data;
      await signup(signupData, {
        onSuccess: (response) => {
          if (response.success) {
            setAuthAdmin(response.data);
            toast.success('Account created successfully!');
            navigate({ to: '/admin' });
          }
        },
        onError: (error: any) => {
          toast.error(error.message || 'Registration failed, Please try again.');
        },
      });
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Registration failed. Please try again.',
      });
    }
  };

  const footer = (
    <div className="text-center">
      <div className="text-sm text-brand-muted">
        Already have a business account?{' '}
        <Link
          to="/admin/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );

  return (
    <AuthFormWrapper
      title={
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-brand-primary" />
          <span className="text-brand-dark">Business Registration</span>
        </div>
      }
      description="Request access to manage your store on FashionKet"
      backLink="/"
      backText="Back to store"
      footer={footer}
    >
      {/* Approval Notice */}
      <div className="mb-6 p-4 bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-brand-dark mb-1">Approval Required</p>
            <p className="text-brand-muted text-xs">
              Business accounts require approval. You'll receive an email once your account is activated.
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

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-brand-dark font-medium">
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register('fullName')}
              className={cn(
                "border-brand-primary-soft focus:border-brand-primary",
                errors.fullName && "border-brand-error"
              )}
            />
            {errors.fullName && (
              <p className="text-sm text-brand-error">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-brand-dark font-medium">
              Store Name *
            </Label>
            <Input
              id="storeName"
              placeholder="Your Store Name"
              {...register('storeName')}
              className={cn(
                "border-brand-primary-soft focus:border-brand-primary",
                errors.storeName && "border-brand-error"
              )}
            />
            {errors.storeName && (
              <p className="text-sm text-brand-error">{errors.storeName.message}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-dark font-medium">
            Business Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@yourstore.com"
            {...register('email')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary",
              errors.email && "border-brand-error"
            )}
          />
          {errors.email && (
            <p className="text-sm text-brand-error">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-brand-dark font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary",
              errors.phone && "border-brand-error"
            )}
          />
          {errors.phone && (
            <p className="text-sm text-brand-error">{errors.phone.message}</p>
          )}
        </div>

        {/* Business Type */}
        <div className="space-y-2">
          <Label htmlFor="businessType" className="text-brand-dark font-medium">
            Business Type *
          </Label>
          <select
            id="businessType"
            {...register('businessType')}
            className="flex h-10 w-full rounded-lg border border-brand-primary-soft bg-white px-3 py-2 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary-soft"
          >
            <option value="boutique">Boutique</option>
            <option value="brand">Brand</option>
            <option value="retailer">Retailer</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Business Description (Conditional) */}
        {businessType === 'other' && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <Label htmlFor="businessDescription" className="text-brand-dark font-medium">
              Describe your business
            </Label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your business..."
              {...register('businessDescription')}
              className="min-h-[80px] border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
            />
          </div>
        )}

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-brand-dark font-medium">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={cn(
                  "pr-10 border-brand-primary-soft focus:border-brand-primary",
                  errors.password && "border-brand-error"
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-brand-error">{errors.password.message}</p>
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
        {password && (
          <div className="p-4 bg-brand-surface rounded-lg border border-brand-primary-soft">
            <p className="text-sm font-medium text-brand-dark mb-3">Password Requirements:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
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
            {passwordStrength === 5 && (
              <div className="mt-3 pt-3 border-t border-brand-primary-soft">
                <div className="flex items-center gap-2 text-xs text-brand-success">
                  <Shield className="h-3 w-3" />
                  <span>Strong password - Great security!</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="requestPermissions"
              {...register('requestPermissions')}
              className="mt-0.5 border-brand-primary-soft data-[state=checked]:bg-brand-primary"
            />
            <div className="space-y-1">
              <Label
                htmlFor="requestPermissions"
                className="text-sm font-normal text-brand-dark cursor-pointer"
              >
                Request special permissions
              </Label>
              <p className="text-xs text-brand-muted">
                Check if you need advanced permissions (bulk operations, analytics access, etc.)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptTerms"
              {...register('acceptTerms')}
              className="mt-0.5 border-brand-primary-soft data-[state=checked]:bg-brand-primary"
            />
            <div className="space-y-1">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal text-brand-dark cursor-pointer"
              >
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="text-brand-primary hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-brand-primary hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Label>
              {errors.acceptTerms && (
                <p className="text-sm text-brand-error">{errors.acceptTerms.message}</p>
              )}
            </div>
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
              Submitting Request...
            </>
          ) : (
            'Request Admin Access'
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

      <GoogleAuthButton variant="admin" disabled={isPending} />
    </AuthFormWrapper>
  );
}