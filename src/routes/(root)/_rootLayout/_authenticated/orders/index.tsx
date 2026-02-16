import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompactPagination, Pagination } from "@/components/ui/pagination";
import { ErrorState } from "@/components/ui/error-state";
import {
  Package,
  Clock,
  RefreshCw,
  Truck as TruckIcon,
  CheckCircle2,
} from "lucide-react";
import { OrderStatus } from "@/types";
import { z } from "zod";
import { ordersQuery, orderStatsQuery } from "@/api/queries/order.query";
import { LoadingState } from "@/components/ui/loading-state";
import { useOrdersQuery, useOrderStatsQuery } from "@/api/hooks";
import { OrdersHeader } from "@/components/orders/order-header";
import { OrdersLoadingSkeleton } from "@/components/orders/order-skeleton";
import { OrdersStats } from "@/components/orders/order-stats";
import { OrdersList } from "@/components/orders/order-list";
import { OrdersSidebar } from "@/components/orders/order-sidebar";
import { cn } from "@/lib/utils";

// Search validation schema
const ordersSearchSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  status: z.nativeEnum(OrderStatus).optional(),
});

export const Route = createFileRoute(
  "/(root)/_rootLayout/_authenticated/orders/",
)({
  component: OrdersPage,
  validateSearch: ordersSearchSchema,
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
  }),
  loader: async ({ context, deps }) => {
    const queryClient = context.queryClient;

    try {
      // Fetch initial data in loader (best practice)
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
  pendingComponent: () => <LoadingState message="Loading your orders..." />,
  errorComponent: ({ error }) => (
    <ErrorState title="Failed to load orders" error={error} retryText="Retry" />
  ),
});

function OrdersPage() {
  const loaderData = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  // Use initial data from loader
  const initialOrders = loaderData.initialOrders;
  const initialStats = loaderData.initialStats;

  // Get search params
  const search = Route.useSearch();

  // Fetch fresh data with React Query (for real-time updates)
  const {
    data: ordersData = initialOrders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrdersQuery({
    page: search.page,
    limit: search.limit,
    status: search.status,
  });

  const {
    data: stats = initialStats,
    isLoading: statsLoading,
    error: statsError,
  } = useOrderStatsQuery();

  // Handle search param updates
  const updateSearchParams = React.useCallback(
    (updates: Partial<z.infer<typeof ordersSearchSchema>>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...updates,
        }),
      });
    },
    [navigate],
  );

  // Handle status filter change
  const handleStatusFilter = React.useCallback(
    (status: OrderStatus | "all") => {
      updateSearchParams({
        status: status === "all" ? undefined : status,
        page: 1, // Reset to first page when changing filters
      });
    },
    [updateSearchParams],
  );

  // Handle page change
  const handlePageChange = React.useCallback(
    (page: number) => {
      updateSearchParams({ page });
    },
    [updateSearchParams],
  );

  // Handle retry
  const handleRetry = React.useCallback(() => {
    window.location.reload();
  }, []);

  const orders = ordersData?.data || [];
  const paginationMeta = ordersData?.pagination;

  // Status filters
  const statusFilters = React.useMemo(() => {
    const filters = [
      {
        value: "all" as const,
        label: "All Orders",
        icon: Package,
        count: stats?.total,
      },
      {
        value: OrderStatus.PENDING_PAYMENT,
        label: "Pending Payment",
        icon: Clock,
        count: stats?.byStatus?.PENDING_PAYMENT?.count,
      },
      {
        value: OrderStatus.PENDING,
        label: "Pending",
        icon: Clock,
        count: stats?.byStatus?.PENDING?.count,
      },
      {
        value: OrderStatus.PROCESSING,
        label: "Processing",
        icon: RefreshCw,
        count: stats?.byStatus?.PROCESSING?.count,
      },
      {
        value: OrderStatus.SHIPPED,
        label: "Shipped",
        icon: TruckIcon,
        count: stats?.byStatus?.SHIPPED?.count,
      },
      {
        value: OrderStatus.DELIVERED,
        label: "Delivered",
        icon: CheckCircle2,
        count: stats?.byStatus?.DELIVERED?.count,
      },
      {
        value: OrderStatus.CANCELLED,
        label: "Cancelled",
        icon: Clock,
        count: stats?.byStatus?.CANCELLED?.count,
      },
    ];

    return filters.filter(
      (filter) => filter.count !== undefined || filter.value === "all",
    );
  }, [stats]);

  // Show loading state for subsequent loads
  if ((ordersLoading || statsLoading) && !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OrdersHeader loading />
        <div className="container mx-auto px-4 py-8">
          <OrdersLoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show error state for subsequent errors
  if ((ordersError || statsError) && !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OrdersHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Failed to load orders"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <OrdersHeader stats={stats} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Stats Overview - Responsive Grid */}
            <OrdersStats stats={stats} />

            {/* Filters Section */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Order History
                </h2>
                <span className="text-xs sm:text-sm text-gray-600">
                  {paginationMeta?.total || 0} orders
                </span>
              </div>

              {/* Status Filters - Horizontal Scroll on Mobile */}
              <div className="overflow-x-auto pb-2 -mx-3 sm:mx-0">
                <div className="flex gap-1.5 sm:gap-2 min-w-max px-3 sm:px-0">
                  {statusFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={
                        search.status === filter.value ||
                        (filter.value === "all" && !search.status)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusFilter(filter.value)}
                      className={cn(
                        "h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap",
                        search.status === filter.value ||
                          (filter.value === "all" && !search.status)
                          ? "bg-mmp-primary hover:bg-mmp-primary2"
                          : "",
                      )}
                      disabled={filter.count === 0 && filter.value !== "all"}
                    >
                      <filter.icon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {filter.label}
                      {filter.count !== undefined && filter.count > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1.5 sm:ml-2 bg-white/20 text-white text-[8px] sm:text-xs px-1 sm:px-1.5"
                        >
                          {filter.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders List */}

            <OrdersList
              orders={ordersData.data}
              searchStatus={search.status}
              statusFilters={statusFilters}
            />

            {/* Pagination */}
            {paginationMeta && paginationMeta.totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                {/* Desktop Pagination */}
                <div className="hidden sm:block">
                  <Pagination
                    meta={paginationMeta}
                    onPageChange={handlePageChange}
                    showInfo
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  />
                </div>
                {/* Mobile Pagination */}
                <div className="sm:hidden">
                  <CompactPagination
                    meta={paginationMeta}
                    onPageChange={handlePageChange}
                    className="bg-white rounded-lg border border-gray-200 p-3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 mt-6 sm:mt-8 lg:mt-0">
            <OrdersSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
