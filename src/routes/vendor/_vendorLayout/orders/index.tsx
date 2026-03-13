import { createFileRoute } from '@tanstack/react-router'
import { ordersQuery, orderStatsQuery } from '@/api/queries'
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react'
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
import { ErrorState } from '@/components/ui/error-state'
import { StatsCard } from '@/components/ui/stats-card'
import { OrdersTable } from '@/components/orders/order-table'
import { formatCurrency, orderSearchSchema } from '@/lib'


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
  errorComponent: ErrorState,
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-3">
        <StatsCard title="Total Orders" value={totalOrders} icon={Package} />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
        />
        <StatsCard
          title="Pending"
          value={pendingOrders}
          icon={Clock}
          className="border-yellow-200"
        />
        <StatsCard
          title="Delivered"
          value={deliveredOrders}
          icon={CheckCircle}
          className="border-green-200"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={search.status || 'all'}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-52">
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

        <Select
          value={search.paymentStatus || 'all'}
          onValueChange={handlePaymentFilter}
        >
          <SelectTrigger className="w-52">
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

      {/* Orders Table */}
      <OrdersTable orders={orders} />

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onPageChange={handlePageChange} showInfo />
      )}
    </div>
  )
}
