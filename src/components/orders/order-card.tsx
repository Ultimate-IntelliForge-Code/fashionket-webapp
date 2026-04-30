import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { PaymentStatusBadge } from "./payment-status-badge";
import { Calendar, Package, Eye, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { OrderStatus } from "@/types";

export function OrderCard({ order }: { order: any }) {
  const orderDate = new Date(order.createdAt);
  // const isDelivered = order.status === OrderStatus.DELIVERED;
  const isShipped = order.status === OrderStatus.SHIPPED;
  const isPendingPayment = order.status === OrderStatus.PENDING_PAYMENT;
  
  return (
    <Card className="group bg-white border-brand-primary-soft hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Order Info */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-brand-dark">
                Order #{order.orderNumber?.slice(-8) || order._id.slice(-8)}
              </h3>
              <OrderStatusBadge status={order.status} />
              {!order.paymentStatus?.isPaid && order.status !== OrderStatus.CANCELLED && (
                <PaymentStatusBadge status={order.paymentStatus?.status || "PENDING"} />
              )}
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-brand-muted">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Placed on {orderDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-brand-muted">
                <Package className="h-3.5 w-3.5" />
                <span>
                  {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
            
            {/* Payment Info */}
            {order.paidAt && (
              <div className="flex items-center gap-2 text-sm text-brand-success">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>
                  Paid on {new Date(order.paidAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
          
          {/* Price & Actions */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
            <div className="text-right">
              <p className="text-xl font-bold text-brand-primary">
                {formatCurrency(order.totalAmount)}
              </p>
              {order.totalDiscount > 0 && (
                <p className="text-xs text-brand-success">
                  Saved {formatCurrency(order.totalDiscount)}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-9 px-3 border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft"
              >
                <Link to="/orders/$orderId" params={{ orderId: order._id }}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  View
                </Link>
              </Button>
              
              {isShipped && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft"
                >
                  <Truck className="mr-1.5 h-3.5 w-3.5" />
                  Track
                </Button>
              )}
              
              {isPendingPayment && (
                <Button
                  size="sm"
                  className="h-9 px-4 bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}