import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { CheckCircle, Clock, Eye, Package, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { OrderStatus } from "@/types";

export function OrderCard({ order }: { order: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-gray-200">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-1 sm:mb-2">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span>
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span>
                  {order.itemCount} {order.itemCount === 1 ? "item" : "items"} •
                  Total: {formatCurrency(order.totalAmount)}
                </span>
              </div>

              {order.paidAt && (
                <div className="flex items-center gap-1.5 sm:gap-2 text-green-600">
                  <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                  <span>
                    Paid on{" "}
                    {new Date(order.paidAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Link to="/orders/$orderId" params={{ orderId: order._id }}>
                <Eye className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                View Details
              </Link>
            </Button>
            {order.status === OrderStatus.SHIPPED && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm"
              >
                <Truck className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                Track
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
