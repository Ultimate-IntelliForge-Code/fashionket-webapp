import React from "react";
import { useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Shield, Home, Package, ShoppingCart, Wallet, Settings, ChevronRight} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface VendorHeaderProps {
  onMobileOpen?: () => void;
}

// Map routes to page titles and icons
const pageConfig: Record<string, { title: string; icon: React.ElementType; description?: string; gradient?: string }> = {
  '/vendor': {
    title: 'Dashboard',
    icon: Home,
    description: 'Overview of your store performance',
    gradient: 'from-mmp-primary to-mmp-primary',
  },
  '/vendor/products': {
    title: 'Products',
    icon: Package,
    description: 'Manage your product catalog',
    gradient: 'from-mmp-primary to-mmp-secondary',
  },
  '/vendor/products/new': {
    title: 'Add New Product',
    icon: Package,
    description: 'Create a new product listing',
    gradient: 'from-mmp-primary to-mmp-neutral',
  },
  '/vendor/orders': {
    title: 'Orders',
    icon: ShoppingCart,
    description: 'Track and manage customer orders',
    gradient: 'from-mmp-secondary to-mmp-primary2',
  },
  '/vendor/wallet': {
    title: 'Wallet',
    icon: Wallet,
    description: 'Manage your earnings and transactions',
    gradient: 'from-mmp-primary to-mmp-secondary',
  },
  '/vendor/settings': {
    title: 'Settings',
    icon: Settings,
    description: 'Configure your store preferences',
    gradient: 'from-mmp-primary2 to-mmp-secondary',
  },
};

export const VendorHeader: React.FC<VendorHeaderProps> = ({ onMobileOpen }) => {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState(() => {
    const path = router.state.location.pathname;
    return pageConfig[path] || { title: 'Store Dashboard', icon: Shield, gradient: 'from-mmp-primary to-mmp-primary' };
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
              gradient: 'from-mmp-primary to-mmp-neutral',
            };
          } else {
            config = {
              title: 'Product Details',
              icon: Package,
              description: 'View product information',
              gradient: 'from-mmp-primary to-mmp-secondary',
            };
          }
        } else if (path.startsWith('/vendor/orders/')) {
          config = {
            title: 'Order Details',
            icon: ShoppingCart,
            description: 'View order information',
            gradient: 'from-mmp-secondary to-mmp-primary2',
          };
        }
      }

      setCurrentPage(config || { title: 'Store Dashboard', icon: Shield, gradient: 'from-mmp-primary to-mmp-primary' });
    });

    return () => unsubscribe();
  }, [router]);

  const PageIcon = currentPage.icon;
  const gradientClass = currentPage.gradient || 'from-mmp-primary to-mmp-primary';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-mmp-primary2/20"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileOpen}
              className="lg:hidden text-black hover:bg-mmp-primary2/20 transition-all duration-300 rounded-xl h-10 w-10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page Title with Icon */}
            <div className="hidden md:flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-black">
                    {currentPage.title}
                  </h1>
                  {currentPage.title === 'Dashboard' && (
                    <Badge variant="outline" className="text-[10px] h-5 border-mmp-primary/30 text-mmp-primary bg-mmp-primary/10 font-medium">
                      <span className="relative flex h-1.5 w-1.5 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mmp-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mmp-primary"></span>
                      </span>
                      Live
                    </Badge>
                  )}
                </div>
                {currentPage.description && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-black/60"
                  >
                    {currentPage.description}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Mobile Page Title */}
            <div className="md:hidden flex items-center gap-2">
              <span className="font-semibold text-xl text-black truncate max-w-[150px]">
                {currentPage.title}
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-black hover:bg-mmp-primary2/20 transition-all duration-300 rounded-xl h-10 w-10"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-mmp-primary to-mmp-neutral text-[10px] text-white flex items-center justify-center border-2 border-white font-bold shadow-sm"
                  >
                    3
                  </motion.span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 mt-2 bg-white border-mmp-primary2/20 shadow-xl rounded-xl p-0">
                <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-mmp-primary2/20">
                  <span className="text-base font-bold text-black">Notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-mmp-primary hover:text-mmp-primary/80 font-medium"
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i, idx) => (
                    <DropdownMenuItem key={idx} className="cursor-pointer p-3 hover:bg-mmp-primary2/5 transition-all duration-300 border-b border-mmp-primary2/10 last:border-0">
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-black">
                            {idx === 0 ? 'New Order Received' : idx === 1 ? 'Payment Received' : 'Product Out of Stock'}
                          </p>
                          {idx < 2 && (
                            <Badge className="text-[8px] h-4 bg-mmp-primary/10 text-mmp-primary border-mmp-primary/20">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-black/70">
                          {idx === 0 ? 'Order #ORD-78945 has been placed' : idx === 1 ? '₦45,000 added to wallet' : 'Update inventory for Product #123'}
                        </p>
                        <p className="text-[10px] text-black/40">
                          {idx === 0 ? '2 minutes ago' : idx === 1 ? '1 hour ago' : '3 hours ago'}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator className="bg-mmp-primary2/20" />
                <DropdownMenuItem className="justify-center cursor-pointer text-mmp-primary hover:text-mmp-primary/80 font-medium text-sm p-3">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {/* <AnimatePresence>
          {currentPage.title !== 'Dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="hidden lg:flex items-center gap-2 text-xs text-black/60 mt-1 pb-2 border-t border-mmp-primary2/10 pt-3"
            >
              <span className="text-black font-medium hover:text-mmp-primary transition-colors cursor-pointer">
                Vendor
              </span>
              <ChevronRight className="h-3 w-3 text-black/40" />
              <span className="text-black/80 font-medium">{currentPage.title}</span>
              {currentPage.description && (
                <>
                  <ChevronRight className="h-3 w-3 text-black/40" />
                  <span className="text-black/60">{currentPage.description}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </motion.header>
  );
};