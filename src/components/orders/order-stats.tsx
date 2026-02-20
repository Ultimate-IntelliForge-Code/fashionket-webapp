import { CheckCircle2, DollarSign, Package, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "@/lib/utils";

export function OrdersStats({ stats }: { stats?: any }) {
  const statItems = [
    {
      label: "Total Orders",
      value: stats?.total || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Spent",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Processing",
      value: stats?.byStatus?.PROCESSING?.count || 0,
      icon: RefreshCw,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Delivered",
      value: stats?.byStatus?.DELIVERED?.count || 0,
      icon: CheckCircle2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="border-gray-200 hover:shadow-sm transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-base sm:text-lg md:text-xl font-bold ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-600">
                  {item.label}
                </div>
              </div>
              <div className={`p-1.5 sm:p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
