import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRequestPasswordReset } from '@/api/mutations'
import { AuthFormWrapper } from '@/components/auth'
import { Shield, AlertCircle, Mail } from 'lucide-react'
import { toast } from 'react-toastify'
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(auth)/_auth/admin/forgot-password')({
  component: AdminForgotPasswordPage,
})

function AdminForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [submittedEmail, setSubmittedEmail] = React.useState('')
  const { mutate: requestReset, isPending } = useRequestPasswordReset('admin')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema as any),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await requestReset(data, {
        onSuccess: () => {
          setSubmittedEmail(data.email)
          setIsSubmitted(true)
          toast.success('Reset link sent to your email!')
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to send reset link')
        },
      })
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to send reset email. Please try again.',
      })
    }
  }

  const footer = (
    <div className="text-center">
      <div className="text-sm text-brand-muted">
        Remember your password?{' '}
        <Link
          to="/admin/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Back to Sign in
        </Link>
      </div>
    </div>
  )

  if (isSubmitted) {
    return (
      <AuthFormWrapper
        title={
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-brand-primary" />
            <span className="text-brand-dark">Check Your Email</span>
          </div>
        }
        description="We've sent password reset instructions to your admin email"
        footer={footer}
      >
        <div className="text-center space-y-6">
          {/* Success Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-brand-success/20 animate-ping" />
              <div className="relative p-4 bg-brand-success/10 rounded-full">
                <Mail className="h-12 w-12 text-brand-success" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-brand-dark">
              Reset Link Sent
            </h3>
            <p className="text-sm text-brand-muted">
              We've sent password reset instructions to{' '}
              <span className="font-medium text-brand-dark">{submittedEmail}</span>
            </p>
            
            {/* Security Note */}
            <div className="p-4 bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl text-left">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-brand-dark mb-1">Security Note</p>
                  <p className="text-brand-muted text-xs">
                    The reset link will expire in 1 hour. If you don't see it in your inbox, 
                    please check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md"
            >
              <Link to="/admin/login">Return to Sign In</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
              onClick={() => setIsSubmitted(false)}
            >
              Resend Reset Link
            </Button>
          </div>
        </div>
      </AuthFormWrapper>
    )
  }

  return (
    <AuthFormWrapper
      title={
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-brand-primary" />
          <span className="text-brand-dark">Reset Admin Password</span>
        </div>
      }
      description="Enter your admin email to receive a password reset link"
      footer={footer}
    >
      {/* Security Notice */}
      <div className="mb-6 p-4 bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-brand-dark mb-1">Secure Reset Process</p>
            <p className="text-brand-muted text-xs">
              Password reset links are only sent to verified admin email addresses for security.
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

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-dark font-medium">
            Admin Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@yourstore.com"
            {...register('email')}
            className={cn(
              "border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
              errors.email && "border-brand-error"
            )}
          />
          {errors.email && (
            <p className="text-sm text-brand-error">{errors.email.message}</p>
          )}
          <p className="text-xs text-brand-muted mt-1">
            Must be the email associated with your admin account
          </p>
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
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </Button>
      </form>
    </AuthFormWrapper>
  )
}