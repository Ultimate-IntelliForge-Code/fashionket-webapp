import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { IOrderStats } from '@/types';

interface OrdersStatsProps {
  stats?: IOrderStats;
  loading?: boolean;
}

export const OrdersStats: React.FC<OrdersStatsProps> = ({ stats, loading }) => {
  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.total || 0,
      icon: ShoppingBag,
      color: 'brand-primary',
      bgColor: 'bg-brand-primary-soft',
      trend: '+12%',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: TrendingUp,
      color: 'brand-success',
      bgColor: 'bg-brand-success/10',
    },
    {
      label: 'Pending Orders',
      value: (stats?.byStatus?.PENDING?.count || 0) + (stats?.byStatus?.PENDING_PAYMENT?.count || 0),
      icon: Clock,
      color: 'brand-warning',
      bgColor: 'bg-brand-warning/10',
    },
    {
      label: 'Delivered',
      value: stats?.byStatus?.DELIVERED?.count || 0,
      icon: CheckCircle2,
      color: 'brand-success',
      bgColor: 'bg-brand-success/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 sm:p-5 bg-white border-brand-primary-soft">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-brand-primary-soft rounded w-1/2" />
              <div className="h-6 bg-brand-primary-soft rounded w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="relative overflow-hidden bg-white border-brand-primary-soft shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            {/* Decorative gradient background */}
            <div className={cn(
              "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
              stat.bgColor
            )} />
            
            <div className="relative p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.bgColor
                )}>
                  <Icon className={cn("h-4 w-4", `text-${stat.color}`)} />
                </div>
                {stat.trend && (
                  <span className="text-xs font-medium text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full">
                    {stat.trend}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-brand-muted mb-1">
                {stat.label}
              </p>
              <p className={cn(
                "text-xl sm:text-2xl font-bold text-brand-dark",
                stat.value === 0 && "text-brand-muted"
              )}>
                {stat.value}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};