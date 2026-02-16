import { IOrderListItem, OrderStatus } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { OrderCard } from "./order-card";

export function OrdersList({
  orders,
  searchStatus,
  statusFilters,
}: {
  orders: IOrderListItem[];
  searchStatus?: OrderStatus;
  statusFilters: any[];
}) {
  if (orders.length === 0) {
    const currentStatus = statusFilters.find((s) => s.value === searchStatus);
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6 sm:p-8 md:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 mb-3 sm:mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              No orders found
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              {!searchStatus
                ? "You haven't placed any orders yet."
                : `No orders with status "${currentStatus?.label}" found.`}
            </p>
            <Button
              asChild
              className="bg-mmp-primary hover:bg-mmp-primary2 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <Link to="/products">
                <ShoppingBag className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
