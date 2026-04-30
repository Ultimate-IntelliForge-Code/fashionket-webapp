import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PaymentStatus } from "@/types"
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string | null | undefined
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  [PaymentStatus.PENDING]: {
    label: "Pending",
    className: "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
    icon: Clock,
  },
  [PaymentStatus.SUCCESS]: {
    label: "Paid",
    className: "bg-brand-success/10 text-brand-success border-brand-success/20",
    icon: CheckCircle2,
  },
  [PaymentStatus.FAILED]: {
    label: "Failed",
    className: "bg-brand-error/10 text-brand-error border-brand-error/20",
    icon: XCircle,
  },
  unknown: {
    label: "Unknown",
    className: "bg-brand-muted/10 text-brand-muted border-brand-muted/20",
    icon: AlertCircle,
  },
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ 
  status, 
  className,
  showIcon = true 
}) => {
  if (!status) {
    return (
      <Badge className={cn("bg-brand-muted/10 text-brand-muted border-brand-muted/20", className)}>
        {showIcon && <AlertCircle className="mr-1.5 h-3.5 w-3.5" />}
        Unknown
      </Badge>
    )
  }

  const statusKey = String(status)
  const config = statusConfig[statusKey] || statusConfig['unknown']
  const Icon = config.icon

  return (
    <Badge className={cn(config.className, "font-medium", className)}>
      {showIcon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  )
}