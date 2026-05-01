import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "react-toastify";
import { formatCurrency, cn } from "@/lib/utils";
import { orderQuery } from "@/api/queries/order.query";
import { useCancelOrder, useInitPayment } from "@/api/mutations";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import {
  ArrowLeft,
  Package,
  Truck,
  Download,
  Printer,
  MessageSquare,
  CreditCard,
  MapPin,
  User,
  Phone,
  Share2,
  Copy,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Receipt,
  HelpCircle,
  Shield,
  Store,
} from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/types";
import { PaymentStatusBadge } from "@/components/orders/payment-status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { useOrderQuery } from "@/api/hooks";
import { ConfirmToast } from "@/components/ui/cofirm-toast";

export const Route = createFileRoute(
  "/(root)/_rootLayout/_authenticated/orders/$orderId",
)({
  component: OrderDetailPage,
  loader: async ({ context, params }) => {
    try {
      const order = await context.queryClient.fetchQuery(
        orderQuery(params.orderId),
      );
      return { order };
    } catch (error) {
      console.error("Failed to load order:", error);
      throw error;
    }
  },
  pendingComponent: () => <LoadingState message="Loading order details..." />,
  errorComponent: ({ error, reset }) => (
    <ErrorState title="Failed to load order" error={error} onRetry={reset} />
  ),
});

function OrderDetailPage() {
  const params = Route.useParams();
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  const { mutateAsync: initPayment, isPending: isInitializingPayment } =
    useInitPayment();

  const initialOrder = loaderData.order;

  const {
    data: order = initialOrder,
    isLoading,
    error,
    refetch,
  } = useOrderQuery(params.orderId);

  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const handleCopyOrderNumber = React.useCallback(() => {
    if (order) {
      navigator.clipboard
        .writeText(order.orderNumber)
        .then(() => {
          toast.success("Order number copied to clipboard");
        })
        .catch(() => {
          toast.error("Failed to copy order number");
        });
    }
  }, [order]);

  const handlePrintOrder = React.useCallback(() => {
    window.print();
  }, []);

  const handleShareOrder = React.useCallback(async () => {
    if (!order) return;

    const shareData = {
      title: `Order #${order.orderNumber}`,
      text: `Check out my order on FashionKet`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("Order shared successfully");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Order link copied to clipboard");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share order");
      }
    }
  }, [order]);

  const handleCancelOrder = React.useCallback(() => {
    return toast.info(
      <ConfirmToast
        message="You are about to cancel this order"
        onConfirm={() =>
          cancelOrder(
            { id: order._id },
            {
              onSuccess: (data) => {
                toast.success(data.message || "Order cancelled successfully");
                refetch();
              },
              onError: (error: any) => {
                toast.error(error.message || "Failed to cancel order");
              },
            },
          )
        }
      />,
      { autoClose: false },
    );
  }, [order, cancelOrder, refetch]);

  const handleDownloadInvoice = React.useCallback(() => {
    toast.info("Invoice download started");
  }, []);

  const handleCompletePayment = React.useCallback(async () => {
    try {
      const paymentData = await initPayment({
        orderId: order._id,
        callbackUrl: `${window.location.origin}/checkout/payment-status`,
      });
      window.location.href = paymentData.authorization_url;
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      toast.error(error.message || "Failed to process payment");
    }
  }, [initPayment, order?._id]);

  const handleRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading && !initialOrder) {
    return <OrderDetailLoadingSkeleton />;
  }

  if (error && !initialOrder) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <OrderDetailHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Failed to load order"
              error={error}
              onRetry={handleRetry}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <OrderDetailHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Order not found"
              message="The order you're looking for doesn't exist or you don't have permission to view it."
              onRetry={() => navigate({ to: "/orders" })}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface print:bg-white">
      <OrderDetailHeader order={order} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <OrderActions
              order={order}
              onCopyOrderNumber={handleCopyOrderNumber}
              onPrintOrder={handlePrintOrder}
              onShareOrder={handleShareOrder}
            />

            <OrderTimelineCard order={order} />

            <OrderItems order={order} />

            <OrderDetails order={order} />

            {order.notes && <OrderNotes notes={order.notes} />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 mt-6 lg:mt-0">
            <OrderSummary order={order} />

            <OrderActionsPanel
              order={order}
              isCancelling={isCancelling}
              onCancelOrder={handleCancelOrder}
              onDownloadInvoice={handleDownloadInvoice}
              onCompletePayment={handleCompletePayment}
              isLoadingPayment={isInitializingPayment}
            />

            <HelpCard />

            <ReturnPolicyCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// Header Component
function OrderDetailHeader({ order }: { order?: any }) {
  return (
    <div className="bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark print:bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-white/90 hover:text-white hover:bg-white/20 print:hidden"
              asChild
            >
              <Link to="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            {order ? (
              <>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 print:text-brand-dark">
                  Order Details
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-white/80 print:text-brand-muted font-mono text-sm">
                    #{order.orderNumber}
                  </p>
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge
                    status={order.paymentStatus as PaymentStatus}
                  />
                </div>
              </>
            ) : (
              <>
                <Skeleton className="h-10 w-48 bg-white/20 mb-2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32 bg-white/20" />
                  <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
                </div>
              </>
            )}
          </div>
          {order && (
            <Badge className="bg-white/20 text-white text-lg px-4 py-2 rounded-full print:bg-brand-surface print:text-brand-primary">
              {formatCurrency(order.totalAmount)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// Order Actions Component
function OrderActions({
  order,
  onCopyOrderNumber,
  onPrintOrder,
  onShareOrder,
}: {
  order: any;
  onCopyOrderNumber: () => void;
  onPrintOrder: () => void;
  onShareOrder: () => void;
}) {
  const actionButtons = [
    { icon: Copy, label: "Copy Order Number", onClick: onCopyOrderNumber },
    { icon: Printer, label: "Print Receipt", onClick: onPrintOrder },
    { icon: Share2, label: "Share Order", onClick: onShareOrder },
    { icon: MessageSquare, label: "Contact Support", href: "/contact" },
  ];

  return (
    <Card className="print:hidden border-brand-primary-soft shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-3">
          {actionButtons.map(({ icon: Icon, label, onClick, href }) => (
            <Button
              key={label}
              variant="outline"
              className="border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft hover:border-brand-primary"
              onClick={onClick}
              asChild={!!href}
            >
              {href ? (
                <Link to={href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Link>
              ) : (
                <>
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </>
              )}
            </Button>
          ))}
          {order.status === OrderStatus.SHIPPED && (
            <Button
              variant="outline"
              className="border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
            >
              <Truck className="mr-2 h-4 w-4" />
              Track Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Order Timeline Card Component
function OrderTimelineCard({ order }: { order: any }) {
  return (
    <Card className="border-brand-primary-soft shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-brand-dark">Order Timeline</CardTitle>
            <CardDescription className="text-brand-muted">
              Track your order progress
            </CardDescription>
          </div>
          <Clock className="h-5 w-5 text-brand-muted" />
        </div>
      </CardHeader>
      <CardContent>
        <OrderTimeline order={order} />
      </CardContent>
    </Card>
  );
}

// Order Items Component
function OrderItems({ order }: { order: any }) {
  return (
    <Card className="border-brand-primary-soft shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-brand-dark">
              Order Items ({order.items.length})
            </CardTitle>
            <CardDescription className="text-brand-muted">
              Products in your order
            </CardDescription>
          </div>
          <Package className="h-5 w-5 text-brand-muted" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-brand-primary-soft">
          {order.items.map((item: any, index: number) => (
            <div
              key={`${item.productId}-${index}`}
              className="flex gap-4 py-4 first:pt-0 last:pb-0"
            >
              {/* Product Image Placeholder */}
              <div className="w-20 h-20 rounded-xl bg-brand-surface border border-brand-primary-soft overflow-hidden shrink-0 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.nameSnapshot}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-brand-muted" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-brand-dark truncate">
                  {item.nameSnapshot}
                </h4>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2 text-sm text-brand-muted">
                    <span>Qty: {item.quantity}</span>
                    <span>×</span>
                    <span>{formatCurrency(item.priceSnapshot)}</span>
                  </div>
                  <span className="font-semibold text-brand-primary">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Order Details Component
function OrderDetails({ order }: { order: any }) {
  return (
    <Card className="border-brand-primary-soft shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-brand-dark">Order Information</CardTitle>
        <CardDescription className="text-brand-muted">
          Shipping and payment details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="shipping" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-brand-surface">
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shipping" className="mt-4">
            {order.addressId ? (
              <div className="space-y-3 bg-brand-surface/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand-dark">
                  <User className="h-4 w-4 text-brand-muted" />
                  <span className="font-medium">
                    {order.addressId.fullName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-brand-dark">
                  <Phone className="h-4 w-4 text-brand-muted" />
                  <span>{order.addressId.phone || "N/A"}</span>
                </div>
                <Separator className="bg-brand-primary-soft" />
                <div className="text-brand-muted space-y-1">
                  <p>{order.addressId.addressLine1}</p>
                  {order.addressId.addressLine2 && (
                    <p>{order.addressId.addressLine2}</p>
                  )}
                  <p>
                    {order.addressId.city}, {order.addressId.state}
                    {order.addressId.postalCode &&
                      ` ${order.addressId.postalCode}`}
                  </p>
                  <p>{order.addressId.country}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-2">
                <div className="flex gap-2">
                  <Store className="h-5 w-5 text-mmp-primary"/>
                  <span>Pick up order</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <div className="space-y-4 bg-brand-surface/30 rounded-xl p-4">
              <div>
                <p className="text-sm text-brand-muted mb-1">Payment Status</p>
                <div className="flex items-center gap-2">
                  <PaymentStatusBadge
                    status={order.paymentStatus as PaymentStatus}
                  />
                  {order.paidAt && (
                    <span className="text-xs text-brand-muted flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <Separator className="bg-brand-primary-soft" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="text-brand-dark">
                    {formatCurrency(order.subtotalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Shipping Fee</span>
                  <span className="text-brand-dark">
                    {formatCurrency(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Tax</span>
                  <span className="text-brand-dark">
                    {formatCurrency(order.taxAmount || 0)}
                  </span>
                </div>
                <Separator className="bg-brand-primary-soft" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-brand-dark">Total</span>
                  <span className="text-brand-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Order Notes Component
function OrderNotes({ notes }: { notes: string }) {
  return (
    <Card className="border-brand-primary-soft shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-primary" />
          <CardTitle className="text-brand-dark">Order Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-brand-muted whitespace-pre-wrap bg-brand-surface/30 rounded-xl p-4">
          {notes}
        </p>
      </CardContent>
    </Card>
  );
}

// Order Summary Component
function OrderSummary({ order }: { order: any }) {
  const summaryItems = [
    {
      label: "Order Number",
      value: order.orderNumber,
      icon: Receipt,
      monospace: true,
    },
    {
      label: "Order Date",
      value: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      icon: Calendar,
    },
  ];

  return (
    <Card className="border-brand-primary-soft shadow-sm sticky top-24">
      <CardHeader className="pb-3 bg-gradient-to-r from-brand-primary-soft/20 to-transparent">
        <CardTitle className="text-brand-dark">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3">
          {summaryItems.map(({ label, value, icon: Icon, monospace }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm text-brand-muted flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <span
                className={cn(
                  "text-sm text-brand-dark",
                  monospace && "font-mono",
                )}
              >
                {value}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-muted flex items-center gap-2">
              <Package className="h-4 w-4" />
              Status
            </span>
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge
                status={order.paymentStatus as PaymentStatus}
              />
            </div>
          </div>
          {order.trackingNumber && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-muted flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Tracking
              </span>
              <span className="text-sm font-mono text-brand-dark">
                {order.trackingNumber}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-brand-primary-soft" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">
              Items ({order.items.length})
            </span>
            <span className="text-brand-dark">
              {formatCurrency(order.subtotalAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Shipping</span>
            <span className="text-brand-dark">
              {formatCurrency(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Tax</span>
            <span className="text-brand-dark">
              {formatCurrency(order.taxAmount || 0)}
            </span>
          </div>
          <Separator className="bg-brand-primary-soft" />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-brand-dark">Total</span>
            <span className="text-brand-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Order Actions Panel Component
function OrderActionsPanel({
  order,
  isCancelling,
  onCancelOrder,
  onDownloadInvoice,
  onCompletePayment,
  isLoadingPayment,
}: {
  order: any;
  isCancelling: boolean;
  onCancelOrder: () => void;
  onDownloadInvoice: () => void;
  onCompletePayment: () => void;
  isLoadingPayment: boolean;
}) {
  const isCancellable = [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(
    order.status,
  );

  return (
    <Card className="border-brand-primary-soft shadow-sm print:hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-brand-dark">Quick Actions</CardTitle>
        <CardDescription className="text-brand-muted">
          Manage your order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.paymentStatus === PaymentStatus.PENDING && (
          <Button
            className="w-full bg-brand-success text-white hover:bg-brand-success/90 shadow-sm"
            onClick={onCompletePayment}
            disabled={isLoadingPayment}
          >
            {isLoadingPayment ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Complete Payment
              </>
            )}
          </Button>
        )}

        {order.status === OrderStatus.PROCESSING && (
          <Button
            variant="outline"
            className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
          >
            <Truck className="mr-2 h-4 w-4" />
            Track Shipment
          </Button>
        )}

        {order.status === OrderStatus.DELIVERED && (
          <Button
            variant="outline"
            className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Leave a Review
          </Button>
        )}

        {isCancellable && (
          <Button
            variant="outline"
            className="w-full text-brand-error hover:text-brand-error hover:bg-brand-error/10 border-brand-error/30"
            onClick={onCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
          onClick={onDownloadInvoice}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
      </CardContent>
    </Card>
  );
}

// Help Card Component
function HelpCard() {
  return (
    <Card className="border-brand-primary-soft shadow-sm print:hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-brand-primary-soft/10 to-transparent">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand-primary" />
          <CardTitle className="text-brand-dark">Need Help?</CardTitle>
        </div>
        <CardDescription className="text-brand-muted">
          We're here to assist you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
          asChild
        >
          <Link to="/contact">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with Support
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
          asChild
        >
          <a href="tel:0700FASHION">
            <Phone className="mr-2 h-4 w-4" />
            Call Support
          </a>
        </Button>
        <Separator className="bg-brand-primary-soft" />
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-brand-muted">
            <MessageSquare className="h-4 w-4" />
            <span>support@fashionket.com</span>
          </p>
          <p className="flex items-center gap-2 text-brand-muted">
            <Phone className="h-4 w-4" />
            <span>0700-FASHION (327-466)</span>
          </p>
          <p className="flex items-center gap-2 text-brand-muted">
            <Clock className="h-4 w-4" />
            <span>24/7 Customer Support</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Return Policy Card Component
function ReturnPolicyCard() {
  const policies = [
    "Eligible for returns within 14 days",
    "Items must be in original condition",
    "Refunds processed in 5-7 business days",
    "Contact support for return authorization",
  ];

  return (
    <Card className="border-brand-primary-soft shadow-sm print:hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-primary" />
          <CardTitle className="text-brand-dark">Return Policy</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {policies.map((policy, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-brand-success mt-0.5 shrink-0" />
              <span className="text-brand-muted">{policy}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Component
function OrderDetailLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <OrderDetailHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-28 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 rounded-full mt-1" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-20 h-20 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6 mt-6 lg:mt-0">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
