import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRequestPasswordReset } from '@/api/mutations'
import { AuthFormWrapper } from '@/components/auth'
import { CheckCircle, Shield, Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(auth)/_auth/vendor/forgot-password')({
  component: VendorForgotPasswordPage,
})

function VendorForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [resendCount, setResendCount] = React.useState(0)
  const { mutate: requestReset, isPending } = useRequestPasswordReset('vendor')

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
          setIsSubmitted(true)
          toast.success('Reset link sent! Check your email for instructions.')
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to send reset link. Please try again.')
          setError('root', { message: error.message })
        },
      })
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Failed to send reset email. Please try again.',
      })
    }
  }

  const handleResend = () => {
    if (resendCount >= 3) {
      toast.warning('Maximum resend attempts reached. Please try again later.')
      return
    }
    setResendCount(prev => prev + 1)
    // Trigger resend logic here
    toast.info('Resending reset link...')
  }

  const footer = (
    <div className="text-center">
      <Link
        to="/vendor/login"
        className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
    </div>
  )

  if (isSubmitted) {
    return (
      <AuthFormWrapper
        title={
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-brand-success" />
            <span>Check Your Email</span>
          </div>
        }
        description="We've sent password reset instructions to your email"
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
              Reset Link Sent
            </h3>
            <p className="text-sm text-brand-muted">
              For security reasons, password reset links are only sent to verified business email addresses.
            </p>
            <div className="p-4 rounded-xl bg-brand-primary-soft/30 border border-brand-primary-soft">
              <p className="text-sm text-brand-dark">
                <strong className="text-brand-primary">Security Note:</strong> The reset link will expire in 1 hour. 
                If you don't see it in your inbox, please check your spam folder.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              asChild
              className="w-full h-11 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
            >
              <Link to="/vendor/login">Return to Store Login</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
              onClick={handleResend}
              disabled={resendCount >= 3}
            >
              {resendCount >= 3 ? 'Maximum attempts reached' : 'Resend Reset Link'}
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
          <span>Reset Store Password</span>
        </div>
      }
      description="Enter your store email to receive a password reset link"
      footer={footer}
    >
      <div className="mb-6 p-4 rounded-xl bg-brand-primary-soft/30 border border-brand-primary-soft">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brand-dark">
            <strong className="text-brand-primary">Security:</strong> Password reset links are only sent to verified store email addresses.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20">
            <p className="text-sm text-brand-error">{errors.root.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-dark font-medium">
            Store Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
            <Input
              id="email"
              type="email"
              placeholder="store@yourbusiness.com"
              className={cn(
                "pl-9 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft",
                errors.email && "border-brand-error"
              )}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-brand-error">{errors.email.message}</p>
          )}
          <p className="text-xs text-brand-muted mt-1">
            Must be the email associated with your store account
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm transition-all duration-200"
          disabled={isPending}
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