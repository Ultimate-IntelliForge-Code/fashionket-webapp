import React from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompactPagination, Pagination } from "@/components/ui/pagination";
import { ErrorState, ServerError } from "@/components/ui/error-state";
import {
  Clock,
  RefreshCw,
  Truck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { OrderStatus } from "@/types";
import { ordersQuery, orderStatsQuery } from "@/api/queries/order.query";
import { LoadingState } from "@/components/ui/loading-state";
import { useOrdersQuery, useOrderStatsQuery } from "@/api/hooks";
import { OrdersHeader } from "@/components/orders/order-header";
import { OrdersLoadingSkeleton } from "@/components/orders/order-skeleton";
import { OrdersStats } from "@/components/orders/order-stats";
import { OrdersList } from "@/components/orders/order-list";
import { OrdersSidebar } from "@/components/orders/order-sidebar";
import { cn } from "@/lib/utils";
import { IOrderQueryFilters, orderSearchSchema } from "@/lib";
import { ensureAuthInitialized, getLoginPathFromLocation } from "@/lib/auth-init";
import { useAuthStore } from "@/store";

export const Route = createFileRoute(
  "/(root)/_rootLayout/_authenticated/orders/",
)({
  component: OrdersPage,
  validateSearch: orderSearchSchema,
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
  }),
  loader: async ({ context, deps, location }) => {
    await ensureAuthInitialized(context.queryClient);

    if (!useAuthStore.getState().isAuthenticated) {
      const pathname = location?.pathname ?? window.location.pathname;
      throw redirect({
        replace: true,
      });
    }

    const queryClient = context.queryClient;

    try {
      const [orders, stats] = await Promise.all([
        queryClient.fetchQuery(
          ordersQuery({
            page: deps.page,
            limit: deps.limit,
          }),
        ),
        queryClient.fetchQuery(orderStatsQuery()),
      ]);

      return {
        initialOrders: orders,
        initialStats: stats,
        page: deps.page,
        limit: deps.limit,
      };
    } catch (error) {
      console.error("Failed to load orders:", error);
      throw error;
    }
  },
  pendingComponent: LoadingState,
  errorComponent: ServerError,
});

function OrdersPage() {
  const loaderData = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const initialOrders = loaderData.initialOrders;
  const initialStats = loaderData.initialStats;
  const search = Route.useSearch();

  const {
    data: ordersData = initialOrders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrdersQuery({
    page: search.page,
    limit: search.limit,
    ...(search.status ? { status: search.status } : {}),
  });

  const {
    data: stats = initialStats,
    isLoading: statsLoading,
    error: statsError,
  } = useOrderStatsQuery();

  const updateSearchParams = React.useCallback(
    (updates: Partial<IOrderQueryFilters>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...updates,
        }),
      });
    },
    [navigate],
  );

  const handleStatusFilter = React.useCallback(
    (status: OrderStatus | "all") => {
      updateSearchParams({
        status: status === "all" ? undefined : status,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      updateSearchParams({ page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateSearchParams],
  );

  const handleRetry = React.useCallback(() => {
    window.location.reload();
  }, []);

  const orders = Array.isArray(ordersData?.data) ? ordersData.data : [];
  const paginationMeta = ordersData?.pagination ?? {
    total: 0,
    totalPages: 0,
    page: 1,
  };

  // Status filters with icons and colors
  const statusFilters = React.useMemo(() => {
    const filters: Array<{
      value: OrderStatus | "all";
      label: string;
      icon: React.ElementType;
      color: string;
      count?: number;
    }> = [
      {
        value: "all",
        label: "All Orders",
        icon: ShoppingBag,
        color: "brand-primary",
        count: stats?.total,
      },
      {
        value: OrderStatus.PENDING,
        label: "Pending",
        icon: Clock,
        color: "brand-warning",
        count: stats?.byStatus?.PENDING?.count,
      },
      {
        value: OrderStatus.PROCESSING,
        label: "Processing",
        icon: RefreshCw,
        color: "brand-primary",
        count: stats?.byStatus?.PROCESSING?.count,
      },
      {
        value: OrderStatus.SHIPPED,
        label: "Shipped",
        icon: Truck,
        color: "brand-info",
        count: stats?.byStatus?.SHIPPED?.count,
      },
      {
        value: OrderStatus.DELIVERED,
        label: "Delivered",
        icon: CheckCircle2,
        color: "brand-success",
        count: stats?.byStatus?.DELIVERED?.count,
      },
      {
        value: OrderStatus.CANCELLED,
        label: "Cancelled",
        icon: XCircle,
        color: "brand-error",
        count: stats?.byStatus?.CANCELLED?.count,
      },
    ];

    return filters;
  }, [stats]);

  const getStatusColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      "brand-primary": "bg-brand-primary text-white",
      "brand-warning": "bg-brand-warning text-white",
      "brand-success": "bg-brand-success text-white",
      "brand-error": "bg-brand-error text-white",
      "brand-info": "bg-brand-info text-white",
    };
    return colorMap[color] || "bg-brand-primary text-white";
  };

  // Show loading state for initial load
  if ((ordersLoading || statsLoading) && !orders.length) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <OrdersHeader loading />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <OrdersLoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show error state for initial errors
  if ((ordersError || statsError) && !orders.length) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <OrdersHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Unable to Load Orders"
              error={ordersError || statsError}
              onRetry={handleRetry}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <OrdersHeader stats={stats} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6 sm:space-y-8">
            {/* Stats Overview */}
            <OrdersStats stats={stats} />

            {/* Orders Section */}
            <div className="space-y-4 sm:space-y-5">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
                    Order History
                  </h2>
                  <p className="text-sm text-brand-muted mt-1">
                    Track and manage all your orders in one place
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-muted" />
                  <span className="text-sm text-brand-muted">
                    {paginationMeta?.total || 0} total orders
                  </span>
                </div>
              </div>

              {/* Status Filters */}
              <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0">
                <div className="flex gap-2 min-w-max px-4 sm:px-0">
                  {statusFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive =
                      search.status === filter.value ||
                      (filter.value === "all" && !search.status);
                    const isDisabled =
                      filter.count === 0 && filter.value !== "all";

                    return (
                      <Button
                        key={filter.value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusFilter(filter.value)}
                        disabled={isDisabled}
                        className={cn(
                          "h-9 sm:h-10 px-3 sm:px-4 rounded-lg transition-all duration-200",
                          isActive && getStatusColorClass(filter.color),
                          !isActive &&
                            "border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft",
                          isDisabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <Icon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm whitespace-nowrap">
                          {filter.label}
                        </span>
                        {filter.count !== undefined && filter.count > 0 && (
                          <Badge
                            variant={isActive ? "secondary" : "outline"}
                            className={cn(
                              "ml-2 text-xs font-medium",
                              isActive &&
                                "bg-white/20 text-white border-white/30",
                              !isActive &&
                                "border-brand-primary-soft text-brand-muted",
                            )}
                          >
                            {filter.count}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Orders List */}
              <OrdersList
                orders={ordersData?.data}
                searchStatus={search.status}
                statusFilters={statusFilters}
              />

              {/* Pagination */}
              {paginationMeta && paginationMeta.totalPages > 1 && (
                <div className="pt-4">
                  {/* Desktop Pagination */}
                  <div className="hidden sm:block">
                    <Pagination
                      meta={paginationMeta}
                      onPageChange={handlePageChange}
                      showInfo
                      className="bg-white rounded-xl border border-brand-primary-soft shadow-sm p-4"
                    />
                  </div>
                  {/* Mobile Pagination */}
                  <div className="sm:hidden">
                    <CompactPagination
                      meta={paginationMeta}
                      onPageChange={handlePageChange}
                      className="bg-white rounded-xl border border-brand-primary-soft shadow-sm p-3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <OrdersSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
