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
      <Card className="border-brand-primary-soft shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-8 sm:p-10 md:p-12 lg:p-16">
          <div className="text-center max-w-md mx-auto">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-brand-primary-soft/30 blur-xl" />
              <div className="relative p-4 bg-brand-primary-soft rounded-full">
                <Package className="h-8 w-8 text-brand-primary" />
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold text-brand-dark mb-2">
              No orders found
            </h3>
            <p className="text-sm text-brand-muted mb-6">
              {!searchStatus
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `No orders with status "${currentStatus?.label}" found.`}
            </p>
            
            {!searchStatus ? (
              <Button
                asChild
                className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
              >
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  // Clear status filter logic here
                }}
                className="border-brand-primary text-brand-primary hover:bg-brand-primary-soft"
              >
                View All Orders
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}