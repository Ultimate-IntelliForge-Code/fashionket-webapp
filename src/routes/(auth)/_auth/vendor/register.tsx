import { createFileRoute, useNavigate, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks'
import { Eye, EyeOff, Loader2, Store, Mail, Phone, MapPin, Key, CheckCircle, Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useVendorSignup } from '@/api/mutations'
import { toast } from 'react-toastify'
import { AuthFormWrapper } from '@/components/auth'
import React from 'react'
import { cn, VendorSignupFormData, vendorSignupSchema } from '@/lib'
import { Modal, useModal, ModalBody, ModalActions } from '@/components/ui/modal'

export const Route = createFileRoute('/(auth)/_auth/vendor/register')({
  component: VendorSignup,
})

function VendorSignup() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [registrationData, setRegistrationData] = React.useState<{ businessName: string; email: string } | null>(null)

  const { isAuthenticated, isVendor } = useAuth()
  const navigate = useNavigate()
  const { mutateAsync: signup, isPending } = useVendorSignup()
  const successModal = useModal()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<VendorSignupFormData>({
    resolver: zodResolver(vendorSignupSchema as any),
    defaultValues: {
      location: {
        country: 'Nigeria',
      },
    },
  })

  const watchedPassword = watch('password')

  if (isAuthenticated && isVendor) {
    return <Navigate to="/vendor" />
  }

  const onSubmit = async (data: VendorSignupFormData) => {
    try {
      await signup(data, {
        onSuccess: (response) => {
          if (response.success) {
            // Store registration data for the modal
            setRegistrationData({
              businessName: data.businessName,
              email: data.email,
            })
            // Show success modal instead of navigating
            successModal.setOpen(true)
          }
        },
        onError: (error: any) => {
          console.error(error)
          toast.error(error.message || 'Registration failed. Please try again.')
          setError('root', { message: error.message || 'Registration failed' })
        },
      })
    } catch (error: any) {
      setError('root', {
        message: error.message || 'Something went wrong',
      })
    }
  }

  const handleModalClose = () => {
    successModal.setOpen(false)
    navigate({ to: '/' })
  }

  const footer = (
    <div className="text-center space-y-3">
      <div className="text-sm text-brand-muted">
        Already have a store account?{' '}
        <Link
          to="/vendor/login"
          className="font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
        >
          Sign in to your store
        </Link>
      </div>
      <div className="text-sm text-brand-muted pt-3 border-t border-brand-primary-soft">
        Are you a customer?{' '}
        <Link
          to="/signup"
          className="font-medium text-brand-accent hover:text-brand-accent/80 hover:underline transition-colors"
        >
          Customer Sign Up
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <AuthFormWrapper
        title={
          <div className="flex items-center justify-center gap-2">
            <Store className="h-6 w-6 text-brand-primary" />
            <span>Store Registration</span>
          </div>
        }
        description="Create your store account to start selling on FashionKet"
        backLink="/"
        backText="Back to home"
        footer={footer}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Root Error */}
          {errors.root && (
            <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20">
              <p className="text-sm text-brand-error">{errors.root.message}</p>
            </div>
          )}

          {/* Store Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-primary-soft">
              <Store className="h-5 w-5 text-brand-primary" />
              <h3 className="font-semibold text-brand-dark">Store Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-brand-dark font-medium">
                Store Name <span className="text-brand-error">*</span>
              </Label>
              <Input
                id="businessName"
                placeholder="Your Store Name"
                className="h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                {...register('businessName')}
                disabled={isPending}
              />
              {errors.businessName && (
                <p className="text-sm text-brand-error">{errors.businessName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-brand-dark font-medium">
                Store Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your store..."
                rows={3}
                className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                {...register('description')}
                disabled={isPending}
              />
              {errors.description && (
                <p className="text-sm text-brand-error">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-primary-soft">
              <Mail className="h-5 w-5 text-brand-primary" />
              <h3 className="font-semibold text-brand-dark">Contact Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-brand-dark font-medium">
                Full Name <span className="text-brand-error">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                className="h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-sm text-brand-error">{errors.fullName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-dark font-medium">
                  Email Address <span className="text-brand-error">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="store@example.com"
                    className="pl-9 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                    {...register('email')}
                    disabled={isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-brand-error">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-brand-dark font-medium">
                  Phone Number <span className="text-brand-error">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="pl-9 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                    {...register('phone')}
                    disabled={isPending}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-brand-error">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-primary-soft">
              <MapPin className="h-5 w-5 text-brand-primary" />
              <h3 className="font-semibold text-brand-dark">Store Location</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street" className="text-brand-dark font-medium">
                Street Address <span className="text-brand-error">*</span>
              </Label>
              <Input
                id="street"
                placeholder="123 Store Street"
                className="h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                {...register('location.street')}
                disabled={isPending}
              />
              {errors.location?.street && (
                <p className="text-sm text-brand-error">{errors.location.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-brand-dark font-medium">
                  City <span className="text-brand-error">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Lagos"
                  className="h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                  {...register('location.city')}
                  disabled={isPending}
                />
                {errors.location?.city && (
                  <p className="text-sm text-brand-error">{errors.location.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-brand-dark font-medium">
                  State <span className="text-brand-error">*</span>
                </Label>
                <Input
                  id="state"
                  placeholder="Lagos"
                  className="h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                  {...register('location.state')}
                  disabled={isPending}
                />
                {errors.location?.state && (
                  <p className="text-sm text-brand-error">{errors.location.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-brand-dark font-medium">
                  Country <span className="text-brand-error">*</span>
                </Label>
                <Input
                  id="country"
                  className="h-11 border-brand-primary-soft bg-brand-surface text-brand-muted"
                  {...register('location.country')}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-primary-soft">
              <Key className="h-5 w-5 text-brand-primary" />
              <h3 className="font-semibold text-brand-dark">Security</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-brand-dark font-medium">
                  Password <span className="text-brand-error">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10 h-11 border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                    {...register('password')}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-brand-error">{errors.password.message}</p>
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
                    disabled={isPending}
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

            {/* Password Requirements */}
            {watchedPassword && (
              <div className="p-4 rounded-xl bg-brand-primary-soft/30 border border-brand-primary-soft">
                <p className="text-sm font-medium text-brand-dark mb-3">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { check: watchedPassword.length >= 8, text: 'Minimum 8 characters' },
                    { check: /[a-z]/.test(watchedPassword), text: 'Lowercase letter' },
                    { check: /[A-Z]/.test(watchedPassword), text: 'Uppercase letter' },
                    { check: /\d/.test(watchedPassword), text: 'Number' },
                    { check: /[@$!%*?&]/.test(watchedPassword), text: 'Special character' },
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
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Store Account...
              </>
            ) : (
              'Create Store Account'
            )}
          </Button>
        </form>
      </AuthFormWrapper>

      {/* Success Modal */}
      <Modal
        open={successModal.open}
        onOpenChange={successModal.onOpenChange}
        title="Registration Submitted Successfully!"
        description="Your store account has been created and is pending approval"
        showCloseButton={false}
        closeOnOverlayClick={false}
        footer={
          <ModalActions className="flex justify-center w-full">
            <Button
              onClick={handleModalClose}
              className="bg-brand-primary w-full text-white hover:bg-brand-primary-hover px-8"
            >
             Got It
            </Button>
          </ModalActions>
        }
      >
        <ModalBody>
          <div className="text-center space-y-6 py-4">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle className="h-16 w-16 text-brand-success/30" />
                </div>
                <CheckCircle className="relative h-16 w-16 text-brand-success" />
              </div>
            </div>

            {/* Store Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-brand-dark">
                Hello {registrationData?.businessName || "Store Owner"}!
              </h3>
              <p className="text-brand-muted">
                Your registration has been received and is pending admin approval.
              </p>
            </div>

            {/* Pending Approval Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Pending Approval</span>
              </div>
              <p className="text-sm text-amber-600">
                You'll need to wait for admin verification before you can access your vendor dashboard.
              </p>
            </div>

            {/* Email Notice */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-brand-primary">
                <Mail className="h-5 w-5" />
                <span className="font-medium">Check Your Email</span>
              </div>
              <p className="text-sm text-brand-muted">
                We've sent a confirmation email to <strong className="text-brand-dark">{registrationData?.email}</strong>
              </p>
              <p className="text-xs text-brand-muted/70">
                You will receive another email once your account has been approved.
              </p>
            </div>

            {/* Additional Info */}
            <div className="pt-2">
              <p className="text-xs text-brand-muted/60">
                Approval typically takes 24-48 hours. You'll be notified via email once your account is activated.
              </p>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}