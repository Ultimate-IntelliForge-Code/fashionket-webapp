import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  className,
  variant = 'default',
  isLoading = false,
}) => {
  // Variant configurations
  const variants = {
    default: {
      card: 'border-brand-primary-soft hover:border-brand-primary/20',
      iconBg: 'bg-brand-primary-soft',
      iconColor: 'text-brand-primary',
      trendUp: 'text-brand-success',
      trendDown: 'text-brand-error',
    },
    primary: {
      card: 'border-brand-primary/20 hover:border-brand-primary/40',
      iconBg: 'bg-brand-primary/10',
      iconColor: 'text-brand-primary',
      trendUp: 'text-brand-success',
      trendDown: 'text-brand-error',
    },
    success: {
      card: 'border-brand-success/20 hover:border-brand-success/40',
      iconBg: 'bg-brand-success/10',
      iconColor: 'text-brand-success',
      trendUp: 'text-brand-success',
      trendDown: 'text-brand-error',
    },
    warning: {
      card: 'border-brand-warning/20 hover:border-brand-warning/40',
      iconBg: 'bg-brand-warning/10',
      iconColor: 'text-brand-warning',
      trendUp: 'text-brand-success',
      trendDown: 'text-brand-error',
    },
    accent: {
      card: 'border-brand-accent/20 hover:border-brand-accent/40',
      iconBg: 'bg-brand-accent/10',
      iconColor: 'text-brand-accent',
      trendUp: 'text-brand-success',
      trendDown: 'text-brand-error',
    },
  };

  const currentVariant = variants[variant];

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className={cn(
        'overflow-hidden animate-pulse border-brand-primary-soft',
        currentVariant.card,
        className
      )}>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3 sm:h-4 bg-brand-muted/20 rounded w-24"></div>
              <div className="h-6 sm:h-7 md:h-8 bg-brand-muted/20 rounded w-32"></div>
              {trend && <div className="h-3 bg-brand-muted/20 rounded w-28"></div>}
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-brand-muted/20"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
      'border bg-white',
      currentVariant.card,
      className
    )}>
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          {/* Text Content */}
          <div className="flex-1 space-y-1.5 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-brand-muted uppercase tracking-wide">
              {title}
            </p>
            
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark leading-tight">
              {value}
            </p>
            
            {subtitle && (
              <p className="text-xs text-brand-muted">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className={cn(
                'flex items-center gap-1.5 mt-1 sm:mt-2',
                trend.isPositive ? currentVariant.trendUp : currentVariant.trendDown
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                )}
                <span className="text-xs sm:text-sm font-semibold">
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-brand-muted">
                  {trend.label || 'vs last month'}
                </span>
              </div>
            )}
          </div>

          {/* Icon Container */}
          <div className={cn(
            'relative rounded-full flex items-center justify-center shrink-0',
            'transition-all duration-300 group-hover:scale-110',
            'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14',
            currentVariant.iconBg
          )}>
            <Icon className={cn(
              'h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7',
              currentVariant.iconColor,
              'transition-transform duration-300 group-hover:scale-110'
            )} />
            
            {/* Decorative ring on hover */}
            <div className={cn(
              'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300',
              'group-hover:opacity-100',
              currentVariant.iconBg
            )} style={{ transform: 'scale(1.15)' }} />
          </div>
        </div>

        {/* Progress Bar (Optional) */}
        {trend && trend.value > 0 && (
          <div className="mt-3 sm:mt-4">
            <div className="h-1 bg-brand-primary-soft rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  trend.isPositive ? 'bg-brand-success' : 'bg-brand-error'
                )}
                style={{ width: `${Math.min(Math.abs(trend.value), 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Additional variant for quick stats display
export const CompactStatsCard: React.FC<StatsCardProps> = (props) => {
  return (
    <StatsCard
      {...props}
      className={cn('hover:shadow-md', props.className)}
    />
  );
};

// Export with display name for better debugging
StatsCard.displayName = 'StatsCard';
CompactStatsCard.displayName = 'CompactStatsCard';