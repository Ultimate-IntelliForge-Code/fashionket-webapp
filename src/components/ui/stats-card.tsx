import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 wrap-break-word">{title}</p>
            <p className="text-base sm:text-lg font-bold text-mmp-primary2 leading-tight">{value}</p>
            {trend && (
              <p
                className={cn(
                  'text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-1 sm:gap-1.5',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-gray-500">vs last month</span>
              </p>
            )}
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-mmp-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-mmp-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};