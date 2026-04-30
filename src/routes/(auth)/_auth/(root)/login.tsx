import React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserLogin } from '@/api/mutations'
import { AuthFormWrapper, GoogleAuthButton } from '@/components/auth'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks'
import { LoginFormData, loginSchema } from '@/lib'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(auth)/_auth/(root)/login')({
  component: LoginPage,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})

function LoginPage() {
  const { setAuth } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const { mutate: login, isPending } = useUserLogin()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        if (response.success) {
          setAuth(response.data)
          toast.success(response.message || 'Welcome back!')
          navigate({ to: '/' })
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Login failed, Invalid credentials')
        setError('root', {
          type: 'manual',
          message: error.message || 'Invalid email or password. Please try again.',
        })
      },
    })
  }

  const footer = (
    <div className="text-center space-y-2">
      <div className="text-sm text-brand-muted">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Sign up
        </Link>
      </div>
      <div className="text-sm text-brand-muted">
        <Link
          to="/forgot-password"
          className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
      <div className="text-sm text-brand-muted">
        Are you a Store Owner?{' '}
        <Link
          to="/vendor/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          Store Login
        </Link>
      </div>
    </div>
  )

  return (
    <AuthFormWrapper
      title="Welcome back"
      description="Sign in to your account to continue shopping"
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
              errors.email && "border-brand-error focus:border-brand-error"
            )}
          />
          {errors.email && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-brand-dark font-medium">
              Password
            </Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={cn(
                "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft pr-10",
                errors.password && "border-brand-error focus:border-brand-error"
              )}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-brand-error flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
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
              Signing in...
            </div>
          ) : (
            'Sign in'
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
  )
}