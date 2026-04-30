import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'
import {
  Clock,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
} from 'lucide-react'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    className: string
  }
> = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-brand-warning/10 text-brand-warning border-brand-warning/20',
  },
  PENDING_PAYMENT: {
    label: 'Awaiting Payment',
    icon: CreditCard,
    className: 'bg-brand-warning/10 text-brand-warning border-brand-warning/20',
  },
  PROCESSING: {
    label: 'Processing',
    icon: RefreshCw,
    className: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  },
  SHIPPED: {
    label: 'Shipped',
    icon: Truck,
    className: 'bg-brand-info/10 text-brand-info border-brand-info/20',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle,
    className: 'bg-brand-success/10 text-brand-success border-brand-success/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-brand-error/10 text-brand-error border-brand-error/20',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: AlertCircle,
    className: 'bg-brand-muted/10 text-brand-muted border-brand-muted/20',
  },
  PAID: {
    label: 'Paid',
    icon: CheckCircle,
    className: 'bg-brand-success/10 text-brand-success border-brand-success/20',
  },
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  const config = statusConfig[status] || statusConfig.PENDING
  const Icon = config.icon

  return (
    <Badge className={cn(config.className, "font-medium", className)}>
      {showIcon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  )
}