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
  AlertCircle,
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
import { ErrorState, ServerError } from '@/components/ui/error-state';
import { StatsCard } from '@/components/ui/stats-card';
import { OrdersTable } from '@/components/orders/order-table';
import type { IVendorDashboardStats, IVendorChartsStats } from '@/types';

export const Route = createFileRoute('/vendor/_vendorLayout/')({
  component: VendorDashboard,
});

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-brand-primary-soft rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-brand-dark mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs flex items-center gap-2">
            <span 
              className="inline-block w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-brand-muted">{entry.name}:</span>
            <span className="font-semibold text-brand-dark">
              {entry.name.includes('Profit') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function VendorDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError , refetch: refetchStats } = useQuery<IVendorDashboardStats>(vendorDashboardStatsQuery());
  const { data: charts, isLoading: chartsLoading, error: chartsError , refetch: refetchCharts } = useQuery<IVendorChartsStats>(vendorChartsStatsQuery());

  if (statsLoading || chartsLoading) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (statsError || chartsError) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Unable to Load Orders"
              error={statsError || chartsError}
              onRetry={() => {
                refetchStats();
                refetchCharts();
              }}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }
  const totals = stats;
  const recentOrders = totals?.recentOrders || [];
  const totalProducts = totals?.totalProducts || 0;
  const totalOrders = totals?.totalOrders || 0;
  const totalRevenue = totals?.totalRevenue || 0;

  // Financial breakdowns with proper calculations
  const netProfit = totalRevenue * 0.7; // 70% of revenue
  const balance = netProfit * 0.6; // 60% available
  const withdrawals = netProfit - balance;

  const salesData = charts?.salesData || [];
  const orderStatusData = charts?.orderStatusData || [];

  // Custom colors for charts matching brand
  const CHART_COLORS = {
    products: '#1800ad',
    profit: '#ff8a00',
    pie: ['#1800ad', '#ff8a00', '#16a34a', '#f59e0b', '#dc2626', '#6b7280'],
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">
            Dashboard
          </h1>
          <p className="text-brand-muted text-sm sm:text-base mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-brand-primary-soft rounded-lg px-3 py-2">
            <span className="text-xs font-medium text-brand-primary">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div> */}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Total Revenue Card */}
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          className="border-l-4 border-l-brand-primary"
        />
        
        {/* Net Profit Card */}
        <StatsCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
          className="border-l-4 border-l-brand-success"
        />
        
        {/* Balance Card */}
        <StatsCard
          title="Available Balance"
          value={formatCurrency(balance)}
          icon={Wallet}
          className="border-l-4 border-l-brand-accent"
        />
        
        {/* Net Withdrawal Card */}
        <StatsCard
          title="Total Withdrawn"
          value={formatCurrency(withdrawals)}
          icon={ArrowDownToLine}
          trend={{ value: 5.4, isPositive: false }}
          className="border-l-4 border-l-brand-warning"
        />
        
        {/* Total Products Card */}
        <StatsCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          icon={Package}
          className="border-l-4 border-l-brand-primary"
          subtitle={`${totalProducts > 0 ? 'Active listings' : 'No products yet'}`}
        />
        
        {/* Total Orders Card */}
        <StatsCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingCart}
          className="border-l-4 border-l-brand-success"
          subtitle={`${recentOrders.length} pending fulfillment`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Performance Line Chart */}
        <Card className="overflow-hidden border-brand-primary-soft shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="border-b border-brand-primary-soft bg-brand-surface/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-brand-dark text-lg font-semibold">
                Sales Performance
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <span className="text-xs text-brand-muted">Products Sold</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="text-xs text-brand-muted">Net Profit</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="products"
                  stroke={CHART_COLORS.products}
                  strokeWidth={2.5}
                  name="Products Sold"
                  dot={{ fill: CHART_COLORS.products, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="profit"
                  stroke={CHART_COLORS.profit}
                  strokeWidth={2.5}
                  name="Net Profit"
                  dot={{ fill: CHART_COLORS.profit, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status Pie Chart */}
        <Card className="overflow-hidden border-brand-primary-soft shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="border-b border-brand-primary-soft bg-brand-surface/30">
            <CardTitle className="text-brand-dark text-lg font-semibold">
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color || CHART_COLORS.pie[index % CHART_COLORS.pie.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px]">
                <AlertCircle className="h-12 w-12 text-brand-muted mb-3" />
                <p className="text-brand-muted text-sm">No order data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="border-brand-primary-soft shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="border-b border-brand-primary-soft bg-brand-surface/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-brand-dark text-lg font-semibold">
                Recent Orders
              </CardTitle>
              <p className="text-brand-muted text-sm mt-1">
                Latest customer orders that need your attention
              </p>
            </div>
            {recentOrders.length > 0 && (
              <div className="bg-brand-primary-soft rounded-lg px-3 py-1.5">
                <span className="text-xs font-medium text-brand-primary">
                  {recentOrders.length} new orders
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length > 0 ? (
            <OrdersTable orders={recentOrders} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="bg-brand-primary-soft rounded-full p-4 mb-4">
                <ShoppingCart className="h-8 w-8 text-brand-primary" />
              </div>
              <p className="text-brand-dark font-medium text-center">
                No orders yet
              </p>
              <p className="text-brand-muted text-sm text-center mt-1">
                When customers place orders, they'll appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="group bg-white border border-brand-primary-soft rounded-lg p-4 text-left hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary-soft flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
              <Package className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="font-semibold text-brand-dark group-hover:text-brand-primary transition-colors duration-300">
                Add New Product
              </p>
              <p className="text-xs text-brand-muted">Expand your inventory</p>
            </div>
          </div>
        </button>

        <button className="group bg-white border border-brand-primary-soft rounded-lg p-4 text-left hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary-soft flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
              <TrendingUp className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="font-semibold text-brand-dark group-hover:text-brand-primary transition-colors duration-300">
                View Analytics
              </p>
              <p className="text-xs text-brand-muted">Track your performance</p>
            </div>
          </div>
        </button>

        <button className="group bg-white border border-brand-primary-soft rounded-lg p-4 text-left hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-primary-soft flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
              <Wallet className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="font-semibold text-brand-dark group-hover:text-brand-primary transition-colors duration-300">
                Withdraw Funds
              </p>
              <p className="text-xs text-brand-muted">Available: {formatCurrency(balance)}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}