import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { vendorDashboardStatsQuery, vendorChartsStatsQuery } from '@/api/queries';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { StatsCard } from '@/components/ui/stats-card';
import { OrdersTable } from '@/components/orders/order-table';
import type { IVendorDashboardStats, IVendorChartsStats } from '@/types';

export const Route = createFileRoute('/vendor/_vendorLayout/')({
  loader: async ({ context }) => {
    const queryClient = context.queryClient;

    // Prefetch vendor dashboard stats
    const [stats, charts] = await Promise.all([
      queryClient.ensureQueryData<IVendorDashboardStats>(vendorDashboardStatsQuery()),
      queryClient.ensureQueryData<IVendorChartsStats>(vendorChartsStatsQuery()),
    ]);

    return { stats, charts };
  },
  component: VendorDashboard,
  pendingComponent: LoadingState,
  errorComponent: ErrorState,
});

// Mock data for charts
function VendorDashboard() {
  const { data: stats } = useQuery<IVendorDashboardStats>(vendorDashboardStatsQuery());
  const { data: charts } = useQuery<IVendorChartsStats>(vendorChartsStatsQuery());

  const totals = stats;

  const recentOrders = totals?.recentOrders || [];
  const totalProducts = totals?.totalProducts || 0;
  const totalOrders = totals?.totalOrders || 0;
  const totalRevenue = totals?.totalRevenue || 0;

  // Financial breakdowns
  const netProfit = totalRevenue * 0.7; // 70% of revenue
  const balance = netProfit * 0.6; // 60% available
  const withdrawals = netProfit - balance;

  const salesData = charts?.salesData || [];
  const orderStatusData = charts?.orderStatusData || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-3">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Balance"
          value={formatCurrency(balance)}
          icon={Wallet}
        />
        <StatsCard
          title="Net Withdrawal"
          value={formatCurrency(withdrawals)}
          icon={ArrowDownToLine}
          trend={{ value: 5.4, isPositive: false }}
        />
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-3">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="products"
                  stroke="#1e40af"
                  strokeWidth={2}
                  name="Products Sold"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="profit"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Net Profit (₦)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
}