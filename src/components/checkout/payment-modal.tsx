import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  Lock,
  CreditCard,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { PaymentStatus } from '@/types'
import { useVerifyPaymentQuery } from '@/api/hooks'
import { cn } from '@/lib/utils'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentReference: string
  orderId: string
  onPaymentSuccess: () => void
  onPaymentFailure: (errorMessage?: string) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentReference,
  orderId,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>(
    PaymentStatus.PENDING,
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  const [isPolling, setIsPolling] = React.useState(false)
  const [pollAttempt, setPollAttempt] = React.useState(0)
  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Clear polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [])

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen && paymentReference) {
      setPaymentStatus(PaymentStatus.PENDING)
      setErrorMessage('')
      setIsPolling(false)
      setPollAttempt(0)
      
      const timer = setTimeout(() => {
        handleVerifyPayment()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, paymentReference])

  const verifyPayment = (reference: string) => {
    try {
      const response = useVerifyPaymentQuery(reference)
      return response
    } catch (error) {
      console.error('Payment verification error:', error)
      throw error
    }
  }

  const handleVerifyPayment = async () => {
    if (!paymentReference) {
      setPaymentStatus(PaymentStatus.FAILED)
      setErrorMessage('Payment reference not found')
      toast.error('Payment reference not found')
      return
    }

    setPaymentStatus(PaymentStatus.PENDING)
    setErrorMessage('')
    setIsPolling(true)
    setPollAttempt(0)

    startPaymentPolling()
  }

  const startPaymentPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    let pollCount = 0
    const maxPolls = 30

    pollingIntervalRef.current = setInterval(async () => {
      pollCount++
      setPollAttempt(pollCount)

      try {
        const result = verifyPayment(paymentReference)

        if (result?.data?.status === PaymentStatus.SUCCESS) {
          clearPolling()
          handlePaymentSuccess()
        } else if (result?.data?.status === PaymentStatus.FAILED) {
          clearPolling()
          setPaymentStatus(PaymentStatus.FAILED)
          setErrorMessage(result.error?.message || 'Payment verification failed')
          setIsPolling(false)
        } else if (pollCount >= maxPolls) {
          clearPolling()
          setPaymentStatus(PaymentStatus.FAILED)
          setErrorMessage('Payment verification timeout. Please contact support.')
          setIsPolling(false)
        }
      } catch (error: any) {
        console.error('Payment verification error:', error)

        if (pollCount >= maxPolls) {
          clearPolling()
          setPaymentStatus(PaymentStatus.FAILED)
          setErrorMessage('Unable to verify payment. Please contact support.')
          setIsPolling(false)
        }
      } finally {
        setIsLoading(false)
      }
    }, 2000)
  }

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  const handlePaymentSuccess = () => {
    setIsPolling(false)

    setTimeout(() => {
      setPaymentStatus(PaymentStatus.SUCCESS)

      toast.success('Payment verified successfully!', {
        position: 'top-center',
        autoClose: 2000,
      })

      setTimeout(() => {
        onPaymentSuccess()
      }, 2000)
    }, 500)
  }

  const handleRetry = () => {
    setPaymentStatus(PaymentStatus.PENDING)
    setErrorMessage('')
    setPollAttempt(0)

    localStorage.removeItem('payment_reference')
    localStorage.removeItem('order_id')
    sessionStorage.removeItem('payment_reference')
    sessionStorage.removeItem('order_id')

    onPaymentFailure('Please try the payment again')
    onClose()
  }

  const handleOpenPaymentPage = () => {
    if (paymentReference) {
      toast.info('Opening payment page...')
    }
  }

  const handleCancel = () => {
    clearPolling()
    onPaymentFailure('Payment verification cancelled')
    onClose()
  }

  const renderContent = () => {
    switch (paymentStatus) {
      case PaymentStatus.SUCCESS:
        return (
          <div className="text-center py-8">
            {/* Animated Success Icon */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-brand-success/20 animate-ping" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-success/10">
                <CheckCircle2 className="h-10 w-10 text-brand-success animate-in zoom-in duration-300" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-brand-dark mb-3 animate-in slide-in-from-bottom duration-300">
              Payment Successful!
            </h3>
            <p className="text-brand-muted mb-6 animate-in slide-in-from-bottom duration-300 delay-75">
              Your order has been confirmed and is being processed.
            </p>

            <div className="space-y-3 animate-in slide-in-from-bottom duration-300 delay-150 mb-6">
              <div className="bg-brand-success/5 border border-brand-success/20 rounded-xl p-4">
                <div className="text-sm text-brand-dark">
                  <div className="font-semibold mb-2 text-brand-success">Order Details:</div>
                  <div className="space-y-1 text-brand-muted">
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-mono text-xs">{paymentReference?.slice(-12)}</span>
                    </div>
                    {orderId && (
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-mono text-xs">{orderId.slice(-8)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-brand-success">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Redirecting to your orders...</span>
            </div>
          </div>
        )

      case PaymentStatus.FAILED:
        return (
          <div className="text-center py-8">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-error/10 mb-6">
              <XCircle className="h-10 w-10 text-brand-error" />
            </div>

            <h3 className="text-2xl font-bold text-brand-dark mb-3">
              Payment Verification Failed
            </h3>
            <p className="text-brand-muted mb-4">
              {errorMessage || 'We could not verify your payment.'}
            </p>

            {/* Help Section */}
            <div className="bg-brand-warning/10 border border-brand-warning/20 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-brand-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-brand-dark mb-2">What should I do?</p>
                  <ul className="space-y-1.5 text-brand-muted">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-warning mt-1.5" />
                      <span>Check if the payment was deducted from your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-warning mt-1.5" />
                      <span>Try verifying the payment again</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-warning mt-1.5" />
                      <span>Contact support if the issue persists</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
                onClick={handleRetry}
                size="lg"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
                onClick={handleCancel}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )

      case PaymentStatus.PENDING:
        return (
          <div className="text-center py-8">
            {/* Animated Loader */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-brand-primary-soft" />
              <div className="absolute inset-0 rounded-full border-4 border-t-brand-primary animate-spin" />
              <div className="relative inline-flex items-center justify-center w-20 h-20">
                <CreditCard className="h-10 w-10 text-brand-primary animate-pulse" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-brand-dark mb-3">
              Verifying Payment
            </h3>
            <p className="text-brand-muted mb-6">
              Please wait while we confirm your payment...
            </p>

            {/* Progress Section */}
            <div className="bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl p-5 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-muted">Verification attempt:</span>
                  <span className="font-semibold text-brand-primary">{pollAttempt}/30</span>
                </div>
                <div className="w-full bg-brand-primary-soft rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(pollAttempt / 30) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Loader2 className="h-3 w-3 animate-spin text-brand-primary" />
                  <p className="text-xs text-brand-muted">
                    This may take a few moments. Please don't close this window.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
              onClick={handleCancel}
              disabled={isPolling}
              size="lg"
            >
              Cancel Verification
            </Button>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            {/* Initial State Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary-soft mb-6">
              <Shield className="h-10 w-10 text-brand-primary" />
            </div>

            <h3 className="text-2xl font-bold text-brand-dark mb-3">
              Complete Your Payment
            </h3>
            <p className="text-brand-muted mb-6">
              Please complete your payment on the Paystack page, then verify it here.
            </p>

            {/* Instructions */}
            <div className="bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl p-5 mb-6 text-left">
              <div className="text-sm">
                <p className="font-semibold text-brand-dark mb-3">Payment Instructions:</p>
                <ol className="space-y-2.5">
                  {[
                    "Complete payment on the Paystack payment page",
                    "Return to this page after successful payment",
                    "Verification will start automatically",
                    "If verification doesn't start, click the button below"
                  ].map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-brand-muted">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary-soft text-brand-primary text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
                size="lg"
                onClick={handleVerifyPayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Starting Verification...
                  </>
                ) : (
                  'Verify Payment Now'
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
                onClick={handleOpenPaymentPage}
                size="lg"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Payment Page
              </Button>
              <Button
                variant="ghost"
                className="w-full text-brand-muted hover:text-brand-dark"
                onClick={handleCancel}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )
    }
  }

  const isPreventClosing = paymentStatus === PaymentStatus.PENDING || 
                           paymentStatus === PaymentStatus.SUCCESS

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPreventClosing) {
          onClose()
        }
      }}
    >
      <DialogContent
        className={cn(
          "sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl",
          "border-brand-primary-soft shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        onInteractOutside={(e) => {
          if (isPreventClosing) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isPreventClosing) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className={cn(
            "text-center text-xl font-bold",
            paymentStatus === PaymentStatus.SUCCESS && "text-brand-success",
            paymentStatus === PaymentStatus.FAILED && "text-brand-error",
            paymentStatus === PaymentStatus.PENDING && "text-brand-primary",
            (!paymentStatus || paymentStatus === PaymentStatus.PENDING) && "text-brand-dark"
          )}>
            {paymentStatus === PaymentStatus.SUCCESS
              ? 'Payment Successful! 🎉'
              : paymentStatus === PaymentStatus.FAILED
                ? 'Payment Verification Failed'
                : paymentStatus === PaymentStatus.PENDING
                  ? 'Verifying Payment'
                  : 'Complete Payment'}
          </DialogTitle>
          <DialogDescription className="text-center text-brand-muted">
            {paymentStatus === PaymentStatus.PENDING
              ? 'Processing your payment securely...'
              : 'Secured by Paystack'}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        <DialogFooter className="mt-6 pt-6 border-t border-brand-primary-soft">
          <div className="w-full text-center space-y-2">
            {/* Security Badges */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-brand-muted">
                <Lock className="h-3 w-3" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-muted">
                <Shield className="h-3 w-3" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-muted">
                <CreditCard className="h-3 w-3" />
                <span>Secured by Paystack</span>
              </div>
            </div>
            
            {/* Reference Number */}
            {paymentReference && (
              <p className="text-xs font-mono text-brand-muted/70 mt-2">
                Ref: {paymentReference.slice(-12)}
              </p>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}