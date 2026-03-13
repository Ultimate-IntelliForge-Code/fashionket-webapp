import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PaymentStatus } from "@/types"
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string | null | undefined
  className?: string
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  [PaymentStatus.PENDING]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
    icon: Clock,
  },
  [PaymentStatus.SUCCESS]: {
    label: "Paid",
    className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
    icon: CheckCircle2,
  },
  [PaymentStatus.FAILED]: {
    label: "Failed",
    className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    icon: XCircle,
  },
  // Add fallback for undefined/unknown statuses
  'unknown': {
    label: "Unknown",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
    icon: AlertCircle,
  },
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  // Handle null/undefined status
  if (!status) {
    return (
      <Badge className={cn("bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200", className)}>
        <AlertCircle className="mr-1 h-3.5 w-3.5" />
        Unknown
      </Badge>
    )
  }

  // Convert status to string and get config
  const statusKey = String(status)
  const config = statusConfig[statusKey] || statusConfig['unknown']
  const Icon = config.icon

  return (
    <Badge className={cn(config.className, className)}>
      <Icon className="mr-1 h-3.5 w-3.5" />
      {config.label}
    </Badge>
  )
}