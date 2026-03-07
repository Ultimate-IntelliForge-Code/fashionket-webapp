import React from "react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, Shield, Home, Package, ShoppingCart, Wallet, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VendorHeaderProps {
  onMobileOpen?: () => void;
}

// Map routes to page titles and icons
const pageConfig: Record<string, { title: string; icon: React.ElementType; description?: string }> = {
  '/vendor': {
    title: 'Dashboard',
    icon: Home,
    description: 'Overview of your store performance',
  },
  '/vendor/products': {
    title: 'Products',
    icon: Package,
    description: 'Manage your product catalog',
  },
  '/vendor/products/new': {
    title: 'Add New Product',
    icon: Package,
    description: 'Create a new product listing',
  },
  '/vendor/orders': {
    title: 'Orders',
    icon: ShoppingCart,
    description: 'Track and manage customer orders',
  },
  '/vendor/wallet': {
    title: 'Wallet',
    icon: Wallet,
    description: 'Manage your earnings and transactions',
  },
  '/vendor/settings': {
    title: 'Settings',
    icon: Settings,
    description: 'Configure your store preferences',
  },
};

export const VendorHeader: React.FC<VendorHeaderProps> = ({ onMobileOpen }) => {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState(() => {
    const path = router.state.location.pathname;
    return pageConfig[path] || { title: 'Store Dashboard', icon: Shield };
  });

  // Update current page when route changes
  React.useEffect(() => {
    const unsubscribe = router.subscribe('onLoad', () => {
      const path = router.state.location.pathname;
      
      // Check exact match first, then check for dynamic routes
      let config = pageConfig[path];
      
      // Handle dynamic routes like /vendor/products/edit/123
      if (!config) {
        if (path.startsWith('/vendor/products/')) {
          if (path.includes('/edit/')) {
            config = {
              title: 'Edit Product',
              icon: Package,
              description: 'Update product details',
            };
          } else {
            config = {
              title: 'Product Details',
              icon: Package,
              description: 'View product information',
            };
          }
        } else if (path.startsWith('/vendor/orders/')) {
          config = {
            title: 'Order Details',
            icon: ShoppingCart,
            description: 'View order information',
          };
        }
      }

      setCurrentPage(config || { title: 'Store Dashboard', icon: Shield });
    });

    return () => unsubscribe();
  }, [router]);

  const PageIcon = currentPage.icon;

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
              onClick={onMobileOpen}
              className="lg:hidden text-mmp-primary2 hover:bg-mmp-primary/10 h-8 w-8 sm:h-9 sm:w-9"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Page Title with Icon */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-r from-mmp-primary to-mmp-primary2 flex items-center justify-center shadow-sm">
                  <PageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                {/* Active indicator */}
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-mmp-primary2">
                    {currentPage.title}
                  </h1>
                  {currentPage.title === 'Dashboard' && (
                    <Badge variant="outline" className="text-[10px] h-5 border-green-200 text-green-700 bg-green-50">
                      Live
                    </Badge>
                  )}
                </div>
                {currentPage.description && (
                  <p className="text-xs text-gray-500 hidden lg:block">
                    {currentPage.description}
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Page Title (simplified) */}
            <div className="md:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-r from-mmp-primary to-mmp-primary2 flex items-center justify-center">
                <PageIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm text-mmp-primary2 truncate max-w-[120px]">
                {currentPage.title}
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
                {/* Quick search indicator */}
                {!isSearchFocused && (
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">
                    <span>⌘</span>
                    <span>K</span>
                  </kbd>
                )}
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
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-mmp-primary2 hover:bg-mmp-primary/10 h-8 w-8 sm:h-9 sm:w-9"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center border border-white font-bold">
                    2
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 sm:w-80">
                <DropdownMenuLabel className="flex items-center justify-between p-3 sm:p-4">
                  <span className="text-sm sm:text-base font-semibold">Notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-mmp-primary hover:text-mmp-primary2"
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem className="cursor-pointer p-2 sm:p-3 hover:bg-blue-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-xs sm:text-sm">
                          New Order Received
                        </p>
                        <Badge variant="secondary" className="text-[8px] h-4">New</Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        Order #ORD-78945 has been placed
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-gray-500">
                        2 minutes ago
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer p-2 sm:p-3 hover:bg-blue-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-xs sm:text-sm">
                          Payment Received
                        </p>
                        <Badge variant="secondary" className="text-[8px] h-4">New</Badge>
                      </div>
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

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="sm:hidden mt-2 pb-2 animate-in slide-in-from-top duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products, orders..."
                className="pl-10 h-9 text-sm bg-gray-50 border-gray-300 focus:border-mmp-primary focus:ring-mmp-primary"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Breadcrumb - Optional, can be enabled if needed */}
        {/* <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 mt-1 pb-1 border-t border-gray-100 pt-2">
          <span className="text-mmp-primary">Vendor</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700">{currentPage.title}</span>
        </div> */}
      </div>
    </header>
  );
};