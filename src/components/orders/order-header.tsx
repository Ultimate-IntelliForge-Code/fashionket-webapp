import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Badge, Home } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export const OrdersHeader = ({
  stats,
  loading,
}: {
  stats?: any;
  loading?: boolean;
}) => {
  return (
    <div className="bg-gradient-to-r from-mmp-primary to-mmp-primary2">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 sm:mb-3 text-white/90 hover:text-white hover:bg-white/20 h-7 sm:h-8 text-xs sm:text-sm -ml-2 sm:ml-0"
              asChild
            >
              <Link to="/">
                <Home className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              My Orders
            </h1>
            <p className="text-white/80 text-xs sm:text-sm">
              Track and manage your purchases
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-8 sm:h-10 w-20 sm:w-24 bg-white/20 rounded-full" />
          ) : (
            <Badge className="bg-white text-mmp-primary text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 w-fit">
              {stats?.total || 0} Orders
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
