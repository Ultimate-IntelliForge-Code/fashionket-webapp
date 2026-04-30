import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Home, ShoppingBag, TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export const OrdersHeader = ({
  stats,
  loading,
}: {
  stats?: any;
  loading?: boolean;
}) => {
  return (
    <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg h-8 px-3"
              asChild
            >
              <Link to="/">
                <Home className="mr-2 h-3.5 w-3.5" />
                Back to Home
              </Link>
            </Button>
            
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                My Orders
              </h1>
              <p className="text-white/80 text-sm">
                Track and manage all your purchases in one place
              </p>
            </div>
          </div>
          
          {loading ? (
            <Skeleton className="h-10 w-28 bg-white/20 rounded-full" />
          ) : (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-white/10 backdrop-blur-sm border border-white/20"
            )}>
              <ShoppingBag className="h-4 w-4 text-white/80" />
              <span className="font-semibold text-white">{stats?.total || 0}</span>
              <span className="text-white/60 text-sm">orders</span>
              {stats?.totalSpent && stats.totalSpent > 0 && (
                <>
                  <div className="w-px h-4 bg-white/20 mx-1" />
                  <TrendingUp className="h-3.5 w-3.5 text-white/80" />
                  <span className="text-white/80 text-sm">
                    ₦{stats.totalSpent.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 text-brand-surface" preserveAspectRatio="none" viewBox="0 0 1440 120">
          <path fill="currentColor" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
        </svg>
      </div>
    </div>
  );
}