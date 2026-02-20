import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
// import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface VendorHeaderProps {
  onMenuClick?: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({ onMenuClick }) => {
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>(false);
  const [ isMobileSearchOpen, setIsMobileSearchOpen ] = React.useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md border-b border-mmp-primary/10">
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden text-mmp-primary2 hover:bg-mmp-primary/10 h-8 w-8 sm:h-9 sm:w-9"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Brand */}
            <div className="hidden md:flex items-center gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-mmp-primary to-mmp-primary2 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="font-bold text-sm sm:text-base text-mmp-primary2">
                Store Dashboard
              </span>
            </div>

            {/* Search - Hidden on small mobile */}
            <div className="hidden sm:block flex-1 max-w-md ml-2 sm:ml-4">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 transition-colors",
                    isSearchFocused ? "text-mmp-primary" : "text-gray-400",
                  )}
                />
                <Input
                  placeholder="Search products, orders..."
                  className="pl-9 sm:pl-10 h-8 sm:h-9 text-xs sm:text-sm bg-gray-50 border-gray-300 focus:border-mmp-primary focus:ring-mmp-primary"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-mmp-primary2 hover:bg-mmp-primary/10 h-8 w-8"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Help - Hidden on mobile */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex text-mmp-primary2 hover:bg-mmp-primary/10 h-8 w-8 sm:h-9 sm:w-9"
              asChild
            >
              <Link to="/vendor/help">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button> */}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-mmp-primary2 hover:bg-mmp-primary/10 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border-2 border-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 sm:w-80">
                <DropdownMenuLabel className="flex items-center justify-between p-3 sm:p-4">
                  <span className="text-sm sm:text-base">Notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="cursor-pointer p-2 sm:p-3">
                    <div className="space-y-1">
                      <p className="font-medium text-xs sm:text-sm">
                        New Order Received
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        Order #ORD-78945 has been placed
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-gray-500">
                        2 minutes ago
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer p-2 sm:p-3">
                    <div className="space-y-1">
                      <p className="font-medium text-xs sm:text-sm">
                        Payment Received
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        ₦45,000 added to wallet
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-gray-500">
                        1 hour ago
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer text-mmp-primary hover:text-mmp-primary2 text-xs sm:text-sm p-2">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar (Hidden by default, shown on search click) */}
        {isMobileSearchOpen && (
          <div className="sm:hidden mt-2 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 h-9 text-sm bg-gray-50 border-gray-300"
                autoFocus
                onBlur={() => setIsMobileSearchOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
