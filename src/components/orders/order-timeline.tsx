import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatus, type IOrder } from '@/types';
import { 
  CheckCircle, 
  CreditCard, 
  Package, 
  Truck, 
  Home,
  XCircle,
  Clock
} from 'lucide-react';

interface OrderTimelineProps {
  order: IOrder;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const timelineSteps = [
    {
      id: 'order_placed',
      label: 'Order Placed',
      date: order.createdAt,
      icon: Package,
      condition: true,
    },
    {
      id: 'payment',
      label: 'Payment Confirmed',
      date: order.paidAt,
      icon: CreditCard,
      condition: !!order.paidAt,
    },
    {
      id: 'processing',
      label: 'Processing',
      date: order.createdAt,
      icon: Clock,
      condition: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status),
    },
    {
      id: 'shipped',
      label: 'Shipped',
      date: order.shippedAt,
      icon: Truck,
      condition: [OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(order.status),
    },
    {
      id: 'delivered',
      label: 'Delivered',
      date: order.deliveredAt,
      icon: Home,
      condition: order.status === OrderStatus.DELIVERED,
    },
  ];

  const cancelled = order.status === OrderStatus.CANCELLED;
  const activeSteps = timelineSteps.filter(step => step.condition);
  const currentStepIndex = activeSteps.length - 1;

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (cancelled) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-error/10 mb-4">
          <XCircle className="h-8 w-8 text-brand-error" />
        </div>
        <h3 className="text-lg font-semibold text-brand-dark mb-2">Order Cancelled</h3>
        <p className="text-sm text-brand-muted">
          This order was cancelled on {formatDate(order.cancelledAt)}
        </p>
        {order.cancellationReason && (
          <p className="text-sm text-brand-muted mt-2">
            Reason: {order.cancellationReason}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative py-4">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-brand-primary-soft" />
      
      <div className="relative space-y-6">
        {activeSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = true;
          const isCurrent = index === currentStepIndex;
          const date = formatDate(step.date);
          
          return (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Icon Circle */}
              <div className={cn(
                "relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                isCompleted && "bg-brand-success/10 ring-2 ring-brand-success/20",
                isCurrent && "bg-brand-primary/10 ring-2 ring-brand-primary/30 animate-pulse"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  isCompleted && "text-brand-success",
                  isCurrent && "text-brand-primary"
                )} />
                {isCompleted && index < activeSteps.length - 1 && (
                  <CheckCircle className="absolute -right-1 -top-1 h-4 w-4 text-brand-success bg-white rounded-full" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className={cn(
                    "font-semibold",
                    isCurrent ? "text-brand-primary" : "text-brand-dark"
                  )}>
                    {step.label}
                  </h4>
                  {date && (
                    <span className="text-xs text-brand-muted">
                      {date}
                    </span>
                  )}
                </div>
                
                {step.id === 'shipped' && order.trackingNumber && (
                  <p className="mt-2 text-sm text-brand-muted">
                    Tracking Number: <span className="font-mono text-brand-primary">{order.trackingNumber}</span>
                  </p>
                )}
                
                {isCurrent && (
                  <p className="mt-2 text-sm text-brand-muted">
                    {step.id === 'order_placed' && "Your order has been received and is being processed."}
                    {step.id === 'payment' && "Payment has been confirmed. We're preparing your order."}
                    {step.id === 'processing' && "Your order is being prepared for shipping."}
                    {step.id === 'shipped' && "Your order is on its way to you!"}
                    {step.id === 'delivered' && "Your order has been delivered. Enjoy!"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};