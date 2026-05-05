import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { orderQuery } from "@/api/queries";
import { useUpdateOrderStatus } from "@/api/mutations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import type { OrderStatus, PaymentStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { PaymentStatusBadge } from "@/components/orders/payment-status-badge";
import { Separator } from "@/components/ui/separator";
import { useOrderQuery } from "@/api/hooks";

export const Route = createFileRoute("/vendor/_vendorLayout/orders/$orderId")({
  component: VendorOrderDetail,
});

const getStatusConfig = (status: OrderStatus) => {
  const configs: Record<OrderStatus, { color: string; bg: string; icon: any }> =
    {
      PENDING: {
        color: "text-brand-warning",
        bg: "bg-brand-warning/10",
        icon: Clock,
      },
      PROCESSING: {
        color: "text-brand-primary",
        bg: "bg-brand-primary-soft",
        icon: Package,
      },
      SHIPPED: {
        color: "text-brand-primary",
        bg: "bg-brand-primary-soft",
        icon: Truck,
      },
      DELIVERED: {
        color: "text-brand-success",
        bg: "bg-brand-success/10",
        icon: CheckCircle,
      },
      CANCELLED: {
        color: "text-brand-error",
        bg: "bg-brand-error/10",
        icon: AlertCircle,
      },
      REFUNDED: {
        color: "text-brand-muted",
        bg: "bg-brand-muted/10",
        icon: AlertCircle,
      },
    };
  return configs[status];
};

function VendorOrderDetail() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error, refetch } = useOrderQuery(orderId);
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Unable to Load Order Details"
              error={error}
              onRetry={() => {
                refetch();
              }}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateStatus({
        id: orderId,
        data: { status: newStatus },
      });
      toast.success("Order status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/vendor/orders" })}
            className="hover:bg-brand-primary-soft rounded-lg h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5 text-brand-dark" />
          </Button>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark">
                Order #{order.orderNumber}
              </h1>
              <Badge
                className={`${statusConfig.bg} ${statusConfig.color} border-0 px-3 py-1`}
              >
                <statusConfig.icon className="h-3 w-3 mr-1" />
                {order.status}
              </Badge>
              <PaymentStatusBadge
                status={order.paymentStatus as PaymentStatus}
              />
            </div>
            <div className="flex items-center gap-2 mt-2 text-brand-muted text-sm">
              <Calendar className="h-4 w-4" />
              <span>Placed on {format(new Date(order.createdAt!), "PPP")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Status Update */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <Card className="border-brand-primary-soft shadow-sm overflow-hidden">
            <CardHeader className="bg-brand-surface/50 border-b border-brand-primary-soft">
              <CardTitle className="flex items-center gap-2 text-brand-dark">
                <Package className="h-5 w-5 text-brand-primary" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-brand-primary-soft">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 hover:bg-brand-surface/30 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 rounded-lg bg-brand-surface flex items-center justify-center overflow-hidden border border-brand-primary-soft">
                      <img
                        src={
                          typeof item.productId === "object" &&
                          "images" in item.productId &&
                          item.productId.images?.length
                            ? item.productId.images[0]
                            : "/logo.png"
                        }
                        alt={item.nameSnapshot}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-brand-dark mb-1 line-clamp-2">
                        {item.nameSnapshot}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-brand-muted">
                        <span>Quantity: {item.quantity}</span>
                        <span>•</span>
                        <span>{formatCurrency(item.priceSnapshot)} each</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-brand-dark text-lg">
                        {formatCurrency(item.subtotal)}
                      </p>
                      <p className="text-xs text-brand-muted">Subtotal</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Update Status Card */}
          <Card className="border-brand-primary-soft shadow-sm">
            <CardHeader className="bg-brand-surface/50 border-b border-brand-primary-soft">
              <CardTitle className="text-brand-dark">
                Update Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-brand-dark font-semibold mb-2 block">
                    Change Status
                  </Label>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(value as OrderStatus)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING_PAYMENT">
                        Pending Payment
                      </SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  {isPending && (
                    <p className="text-sm text-brand-muted mt-2 flex items-center gap-1">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                      Updating status...
                    </p>
                  )}
                </div>

                {/* Status Timeline */}
                {/* <div className="pt-4">
                  <Label className="text-brand-dark font-semibold mb-3 block">
                    Order Timeline
                  </Label>
                  <div className="space-y-3">
                    {order.statusHistory?.map((history, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="relative">
                          <div className="h-2 w-2 mt-2 rounded-full bg-brand-primary" />
                          {idx !== order.statusHistory.length - 1 && (
                            <div className="absolute top-4 left-0.5 h-full w-0.5 bg-brand-primary-soft" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="font-medium text-brand-dark text-sm">
                            {history.status}
                          </p>
                          <p className="text-xs text-brand-muted">
                            {format(new Date(history.timestamp), "PPP p")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Payment Summary Card */}
          <Card className="border-brand-primary-soft shadow-sm">
            <CardHeader className="bg-brand-surface/50 border-b border-brand-primary-soft">
              <CardTitle className="flex items-center gap-2 text-brand-dark">
                <CreditCard className="h-5 w-5 text-brand-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span className="font-medium text-brand-dark">
                  {formatCurrency(order.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Shipping Fee</span>
                <span className="font-medium text-brand-dark">
                  {formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Tax</span>
                <span className="font-medium text-brand-dark">
                  {formatCurrency(order.taxAmount || 0)}
                </span>
              </div>
              <Separator className="my-2 bg-brand-primary-soft" />
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-brand-dark">Total</span>
                <span className="font-bold text-brand-primary text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          {/* {order.customer && (
            <Card className="border-brand-primary-soft shadow-sm">
              <CardHeader className="bg-brand-surface/50 border-b border-brand-primary-soft">
                <CardTitle className="flex items-center gap-2 text-brand-dark">
                  <User className="h-5 w-5 text-brand-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-brand-muted mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-dark">
                      {order.customer.fullName}
                    </p>
                    <p className="text-sm text-brand-muted">
                      Customer ID: {order.customer._id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-brand-muted" />
                  <p className="text-sm text-brand-dark">{order.customer.email}</p>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-brand-muted" />
                    <p className="text-sm text-brand-dark">{order.customer.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )} */}

          {/* Shipping Address Card */}
          {order.shippingAddress && (
            <Card className="border-brand-primary-soft shadow-sm">
              <CardHeader className="bg-brand-surface/50 border-b border-brand-primary-soft">
                <CardTitle className="flex items-center gap-2 text-brand-dark">
                  <MapPin className="h-5 w-5 text-brand-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <address className="not-italic text-sm text-brand-dark space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2 font-medium">
                    {order.shippingAddress.phone}
                  </p>
                </address>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
