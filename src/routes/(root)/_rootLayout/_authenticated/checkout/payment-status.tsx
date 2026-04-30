import React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShoppingBag,
  Home,
  ArrowLeft,
  Package,
  CreditCard,
  Shield,
  Clock,
  Wallet,
  RefreshCw,
  Lock,
  Sparkles,
} from "lucide-react";
import { PaymentStatus } from "@/types";
import { toast } from "react-toastify";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";
import { useOrderQuery } from "@/api/hooks";
import { apiClient } from "@/api/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/(root)/_rootLayout/_authenticated/checkout/payment-status",
)({
  component: PaymentStatusPage,
  validateSearch: z.object({
    reference: z.string().optional(),
    trxref: z.string().optional(),
    orderId: z.string().optional(),
  }),
});

interface PaymentVerificationResult {
  status: PaymentStatus;
  message?: string;
  order?: any;
  reference?: string;
}

const VERIFICATION_TIMEOUT = 5 * 60 * 1000;
const POLL_INTERVAL = 10000;
const MAX_POLL_ATTEMPTS = Math.ceil(VERIFICATION_TIMEOUT / POLL_INTERVAL);

function PaymentStatusPage() {
  const {
    reference: urlReference,
    trxref,
    orderId: urlOrderId,
  } = Route.useSearch();
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>(
    PaymentStatus.PENDING,
  );
  const [verificationError, setVerificationError] = React.useState<string>("");
  const [isPolling, setIsPolling] = React.useState(false);
  const [pollAttempt, setPollAttempt] = React.useState(0);
  const [verificationStartTime, setVerificationStartTime] = React.useState<number | null>(null);
  const [showManualVerification, setShowManualVerification] = React.useState(false);
  const [manualVerificationLoading, setManualVerificationLoading] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState(VERIFICATION_TIMEOUT / 1000);

  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const verificationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const reference = urlReference || trxref;
  const orderId = urlOrderId || localStorage.getItem("last_order_id");
  const { data: orderData, isLoading: orderLoading } = useOrderQuery(orderId || "");

  const clearAllTimers = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
      verificationTimeoutRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const verifyPayment = async (paymentRef: string): Promise<PaymentVerificationResult> => {
    try {
      const response = await apiClient.get<PaymentVerificationResult>(
        `/payments/verify/${paymentRef}`,
      );

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to verify payment");
      }

      return response.data;
    } catch (error: any) {
      console.error("Payment verification error:", error);
      throw new Error(error.message || "Network error while verifying payment");
    }
  };

  React.useEffect(() => {
    if (!reference) {
      const storedReference = localStorage.getItem("last_payment_reference");
      if (storedReference) {
        startPaymentVerification(storedReference);
      } else {
        toast.error("No payment reference found");
        navigate({ to: "/checkout" });
      }
    } else {
      startPaymentVerification(reference);
    }
  }, [reference]);

  React.useEffect(() => {
    if (verificationStartTime && isPolling) {
      const elapsedTime = Date.now() - verificationStartTime;
      const timeRemaining = VERIFICATION_TIMEOUT - elapsedTime;

      if (timeRemaining <= 0) {
        handleVerificationTimeout();
      }
    }
  }, [pollAttempt, verificationStartTime, isPolling]);

  const startPaymentVerification = async (paymentRef: string) => {
    if (!paymentRef) {
      setVerificationError("Payment reference is required");
      setPaymentStatus(PaymentStatus.FAILED);
      return;
    }

    clearAllTimers();

    setVerificationStartTime(Date.now());
    setPaymentStatus(PaymentStatus.PENDING);
    setVerificationError("");
    setIsPolling(true);
    setPollAttempt(0);
    setShowManualVerification(false);
    setRemainingSeconds(VERIFICATION_TIMEOUT / 1000);

    // Timer for countdown display
    timerIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    verificationTimeoutRef.current = setTimeout(() => {
      handleVerificationTimeout();
    }, VERIFICATION_TIMEOUT);

    let attempts = 0;
    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      setPollAttempt(attempts);

      try {
        const result = await verifyPayment(paymentRef);

        if (result.status === PaymentStatus.SUCCESS) {
          handleVerificationSuccess(result);
          return;
        } else if (result.status === PaymentStatus.FAILED) {
          handleVerificationFailure(result.message || "Payment failed");
          return;
        }

        if (attempts >= MAX_POLL_ATTEMPTS) {
          handleVerificationTimeout();
        }
      } catch (error: any) {
        console.error("Polling error:", error);
        if (attempts >= MAX_POLL_ATTEMPTS) {
          handleVerificationFailure(error.message || "Verification failed after multiple attempts");
        }
      }
    }, POLL_INTERVAL);

    try {
      const result = await verifyPayment(paymentRef);
      if (result.status === PaymentStatus.SUCCESS) {
        handleVerificationSuccess(result);
        return;
      } else if (result.status === PaymentStatus.FAILED) {
        handleVerificationFailure(result.message || "Payment failed");
        return;
      }
    } catch (error: any) {
      console.error("Initial verification error:", error);
    }
  };

  const handleVerificationSuccess = (result: PaymentVerificationResult) => {
    clearAllTimers();
    setPaymentStatus(PaymentStatus.SUCCESS);
    setIsPolling(false);
    localStorage.removeItem("last_payment_reference");
    localStorage.removeItem("last_order_id");
    toast.success(result.message || "Payment verified successfully!");

    setTimeout(() => {
      navigate({ to: "/orders" });
    }, 5000);
  };

  const handleVerificationFailure = (errorMessage: string) => {
    clearAllTimers();
    setPaymentStatus(PaymentStatus.FAILED);
    setVerificationError(errorMessage);
    setIsPolling(false);
    setShowManualVerification(true);
    toast.error(errorMessage);
  };

  const handleVerificationTimeout = () => {
    clearAllTimers();
    setPaymentStatus(PaymentStatus.FAILED);
    setVerificationError("Payment verification timeout. Please verify your payment manually.");
    setIsPolling(false);
    setShowManualVerification(true);
    toast.error("Verification timeout after 5 minutes");
  };

  const handleManualVerification = async () => {
    if (!reference) return;
    setManualVerificationLoading(true);

    try {
      const result = await verifyPayment(reference);
      if (result.status === PaymentStatus.SUCCESS) {
        handleVerificationSuccess(result);
      } else {
        setVerificationError(result.message || "Payment verification failed");
        toast.error("Payment verification failed. Please check your payment status.");
      }
    } catch (error: any) {
      setVerificationError(error.message || "Manual verification failed");
      toast.error("Failed to verify payment. Please try again later.");
    } finally {
      setManualVerificationLoading(false);
    }
  };

  const handleRetryCheckout = () => navigate({ to: "/checkout" });
  const handleViewOrder = () => {
    if (orderId) navigate({ to: "/orders/$orderId", params: { orderId } });
    else navigate({ to: "/orders" });
  };
  const handleContinueShopping = () => navigate({ to: "/products" });

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = ((VERIFICATION_TIMEOUT - remainingSeconds * 1000) / VERIFICATION_TIMEOUT) * 100;

  const renderContent = () => {
    switch (paymentStatus) {
      case PaymentStatus.SUCCESS:
        return (
          <>
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full bg-brand-success/20 animate-ping" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-success/10">
                  <CheckCircle2 className="h-12 w-12 text-brand-success animate-in zoom-in duration-500" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-brand-dark mb-3">
                Payment Successful! 🎉
              </h1>
              <p className="text-lg text-brand-muted mb-2">
                Thank you for your order!
              </p>
              <p className="text-brand-muted mb-6">
                We've sent a confirmation email to your registered email address.
              </p>

              <div className="flex items-center justify-center gap-2 text-brand-success">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  Redirecting to orders in {Math.ceil(remainingSeconds)}s...
                </span>
              </div>
            </div>

            {orderData && !orderLoading && (
              <div className="bg-brand-surface rounded-xl p-6 mb-6 border border-brand-primary-soft">
                <h3 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-brand-primary" />
                  Order Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Order Number:</span>
                    <span className="font-medium text-brand-dark">
                      {orderData.orderNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Total Amount:</span>
                    <span className="font-semibold text-brand-primary">
                      {formatCurrency(orderData.totalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Payment Method:</span>
                    <span className="text-brand-dark">Paystack</span>
                  </div>
                  {reference && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-muted">Reference:</span>
                      <span className="font-mono text-xs text-brand-dark">
                        {reference.slice(-12)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleViewOrder}
                className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                View My Orders
              </Button>
              <Button
                variant="outline"
                className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
                size="lg"
                onClick={handleContinueShopping}
              >
                <Home className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </div>
          </>
        );

      case PaymentStatus.FAILED:
        return (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-error/10 mb-6">
                <XCircle className="h-12 w-12 text-brand-error" />
              </div>

              <h1 className="text-3xl font-bold text-brand-dark mb-3">
                Payment Verification Failed
              </h1>
              <p className="text-lg text-brand-muted mb-4">
                {verificationError || "We couldn't verify your payment."}
              </p>

              {showManualVerification && (
                <div className="mt-6">
                  <div className="bg-brand-warning/10 border border-brand-warning/20 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-brand-warning mt-1 flex-shrink-0" />
                      <div className="text-left">
                        <h4 className="font-semibold text-brand-dark mb-2">
                          Verify Payment Manually
                        </h4>
                        <p className="text-sm text-brand-muted mb-4">
                          If you've already sent money but verification failed,
                          click below to check your payment status manually.
                        </p>
                        <Button
                          onClick={handleManualVerification}
                          disabled={manualVerificationLoading}
                          className="w-full bg-brand-warning text-white hover:bg-brand-warning/90"
                        >
                          {manualVerificationLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Wallet className="mr-2 h-5 w-5" />
                              I've Sent Money - Verify Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!showManualVerification && (
              <div className="bg-brand-warning/10 border border-brand-warning/20 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-brand-warning mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-semibold text-brand-dark mb-2">
                      What could have happened?
                    </h4>
                    <ul className="space-y-2 text-sm text-brand-muted">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" />
                        Payment was declined by your bank
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" />
                        Insufficient funds in your account
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" />
                        Payment was cancelled
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" />
                        Network or technical issues
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {reference && (
              <div className="bg-brand-surface rounded-xl p-4 mb-6 border border-brand-primary-soft">
                <p className="text-sm text-brand-muted mb-1">Payment Reference:</p>
                <p className="font-mono text-sm text-brand-dark">{reference}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleRetryCheckout}
                className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Try Payment Again
              </Button>
              <Button variant="outline" className="w-full border-brand-primary-soft" size="lg" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-brand-muted hover:text-brand-dark"
                size="lg"
                onClick={handleContinueShopping}
              >
                <Home className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-brand-primary-soft animate-ping" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-primary-soft">
                  <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-brand-dark mb-3">
                Verifying Your Payment
              </h1>
              <p className="text-lg text-brand-muted mb-2">
                Please wait while we confirm your payment...
              </p>
              <p className="text-brand-muted">This usually takes 10-30 seconds.</p>
            </div>

            <div className="bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-primary" />
                    <span className="text-sm font-medium text-brand-dark">
                      Verification in progress
                    </span>
                  </div>
                  <Badge className="bg-brand-primary text-white">Live</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-muted">Time remaining:</span>
                  <span className="font-semibold text-brand-primary font-mono">
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="w-full bg-brand-primary-soft rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Attempt: {pollAttempt}/{MAX_POLL_ATTEMPTS}</span>
                  <span className="text-brand-muted">Interval: {POLL_INTERVAL / 1000}s</span>
                </div>

                <p className="text-xs text-brand-primary text-center font-medium">
                  Don't close or refresh this page
                </p>
              </div>
            </div>

            {reference && (
              <div className="bg-brand-surface rounded-xl p-4 mb-6 border border-brand-primary-soft">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-brand-muted">Payment Reference:</p>
                  <Badge variant="secondary" className="font-mono text-xs bg-brand-primary-soft">
                    {reference.slice(-12)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-muted">
                  <CreditCard className="h-4 w-4" />
                  <span>Processing via Paystack</span>
                </div>
              </div>
            )}

            <div className="bg-brand-warning/10 border border-brand-warning/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-brand-warning mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-brand-dark mb-2">
                    Taking too long?
                  </h4>
                  <p className="text-sm text-brand-muted mb-4">
                    Verification will timeout after 5 minutes. If you've already sent money:
                  </p>
                  <Button
                    onClick={handleManualVerification}
                    disabled={manualVerificationLoading}
                    variant="outline"
                    className="w-full border-brand-warning text-brand-warning hover:bg-brand-warning/10"
                  >
                    {manualVerificationLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Check Status Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-primary-soft">
              <h4 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                What's happening?
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-primary-soft">
                    <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-dark">Verifying Transaction</p>
                    <p className="text-sm text-brand-muted">Confirming payment details with your bank</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-primary-soft">
                    <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-dark">Updating Order Status</p>
                    <p className="text-sm text-brand-muted">Preparing your order for processing</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const getStatusColors = () => {
    if (paymentStatus === PaymentStatus.SUCCESS) {
      return {
        bg: "bg-brand-success/10",
        border: "border-brand-success/20",
        icon: CheckCircle2,
        iconColor: "text-brand-success",
      };
    }
    if (paymentStatus === PaymentStatus.FAILED) {
      return {
        bg: "bg-brand-error/10",
        border: "border-brand-error/20",
        icon: XCircle,
        iconColor: "text-brand-error",
      };
    }
    return {
      bg: "bg-brand-primary-soft",
      border: "border-brand-primary-soft",
      icon: Loader2,
      iconColor: "text-brand-primary",
    };
  };

  const statusColors = getStatusColors();
  const StatusIcon = statusColors.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-surface to-white">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
              Payment Status
            </h1>
            <p className="text-brand-muted">
              Track your payment and order status in real-time
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-primary-soft">
            {/* Status Banner */}
            <div className={cn("px-6 py-4 border-b", statusColors.bg, statusColors.border)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn("h-5 w-5", statusColors.iconColor, {
                    "animate-spin": paymentStatus === PaymentStatus.PENDING
                  })} />
                  <span className="font-semibold text-brand-dark">
                    {paymentStatus === PaymentStatus.SUCCESS
                      ? "Payment Verified"
                      : paymentStatus === PaymentStatus.FAILED
                        ? "Payment Failed"
                        : "Verifying Payment"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    paymentStatus === PaymentStatus.SUCCESS && "bg-brand-success/20 text-brand-success border-brand-success/30",
                    paymentStatus === PaymentStatus.FAILED && "bg-brand-error/20 text-brand-error border-brand-error/30",
                    paymentStatus === PaymentStatus.PENDING && "bg-brand-primary/20 text-brand-primary border-brand-primary/30"
                  )}>
                    {paymentStatus}
                  </Badge>
                  {isPolling && (
                    <Badge className="bg-brand-primary-soft text-brand-primary">
                      Polling...
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">{renderContent()}</div>

            {/* Footer */}
            <div className="px-6 py-4 bg-brand-surface border-t border-brand-primary-soft">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-brand-muted">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL Secure</span>
                </div>
                <div className="flex items-center gap-2 text-brand-muted">
                  <Shield className="h-4 w-4" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-muted">Powered by</span>
                  <span className="font-semibold text-brand-primary">Paystack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-brand-primary-soft p-4 text-center hover:shadow-md transition-shadow">
              <Package className="h-8 w-8 text-brand-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-brand-dark">Fast Processing</p>
              <p className="text-xs text-brand-muted">Orders processed within 24h</p>
            </div>
            <div className="bg-white rounded-xl border border-brand-primary-soft p-4 text-center hover:shadow-md transition-shadow">
              <Shield className="h-8 w-8 text-brand-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-brand-dark">Secure Payment</p>
              <p className="text-xs text-brand-muted">256-bit SSL encryption</p>
            </div>
            <div className="bg-white rounded-xl border border-brand-primary-soft p-4 text-center hover:shadow-md transition-shadow">
              <RefreshCw className="h-8 w-8 text-brand-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-brand-dark">Easy Returns</p>
              <p className="text-xs text-brand-muted">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}