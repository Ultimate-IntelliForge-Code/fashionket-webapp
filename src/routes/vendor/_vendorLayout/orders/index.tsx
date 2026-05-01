import { createFileRoute } from '@tanstack/react-router'
import { ordersQuery, orderStatsQuery } from '@/api/queries'
import { Package, Clock, CheckCircle, DollarSign } from 'lucide-react'
import { OrderStatus, PaymentStatus } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { LoadingState } from '@/components/ui/loading-state'
import { ServerError } from '@/components/ui/error-state'
import { StatsCard } from '@/components/ui/stats-card'
import { OrdersTable } from '@/components/orders/order-table'
import { formatCurrency, orderSearchSchema } from '@/lib'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/vendor/_vendorLayout/orders/')({
  validateSearch: (search) => {
    return orderSearchSchema.parse(search)
  },
  loaderDeps: ({ search }) => ({
    search: search,
  }),
  loader: async ({ context, deps }) => {
    const queryClient = context.queryClient
    const [orders, stats] = await Promise.all([
      queryClient.ensureQueryData(ordersQuery(deps.search)),
      queryClient.ensureQueryData(orderStatsQuery()),
    ])
    return { orders, stats }
  },
  component: VendorOrders,
  pendingComponent: LoadingState,
  errorComponent: ServerError,
})

function VendorOrders() {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const { orders: ordersData, stats } = Route.useLoaderData()

  const orders = ordersData?.data || []
  const meta = ordersData?.pagination

  const totalOrders = stats?.total || 0
  const totalRevenue = stats?.totalRevenue || 0
  const pendingOrders = stats?.byStatus?.PENDING?.count || 0
  const deliveredOrders = stats?.byStatus?.DELIVERED?.count || 0

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  const handleStatusFilter = (status: OrderStatus | 'all') => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: status === 'all' ? undefined : status,
        page: 1,
      }),
    })
  }

  const handlePaymentFilter = (paymentStatus: PaymentStatus | 'all') => {
    navigate({
      search: (prev) => ({
        ...prev,
        paymentStatus: paymentStatus === 'all' ? undefined : paymentStatus,
        page: 1,
      }),
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={Package}
          trend={{ value: 8.2, isPositive: true }}
          className="border-brand-primary-soft hover:shadow-md transition-all duration-300"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          className="border-brand-primary-soft hover:shadow-md transition-all duration-300"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          className="border-brand-warning/20 hover:shadow-md transition-all duration-300"
        />
        <StatsCard
          title="Completed"
          value={deliveredOrders}
          icon={CheckCircle}
          className="border-brand-success/20 hover:shadow-md transition-all duration-300"
        />
      </div>

      {/* Filters Section */}
      <Card className="border-brand-primary-soft">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-brand-dark text-sm font-medium mb-2 block">
                Order Status
              </Label>
              <Select
                value={search.status || 'all'}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-full border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-brand-dark text-sm font-medium mb-2 block">
                Payment Status
              </Label>
              <Select
                value={search.paymentStatus || 'all'}
                onValueChange={handlePaymentFilter}
              >
                <SelectTrigger className="w-full border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(search.status || search.paymentStatus) && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate({
                      search: {
                        page: 1,
                      },
                    })
                  }}
                  className="text-brand-muted hover:text-brand-primary hover:bg-brand-primary-soft"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-brand-primary-soft overflow-hidden">
        <CardContent className="p-0">
          <OrdersTable orders={orders} variant='vendor' />
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination meta={meta} onPageChange={handlePageChange} showInfo />
        </div>
      )}
    </div>
  )
}