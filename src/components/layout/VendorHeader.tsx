import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Menu,
  Shield,
  Home,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
  TrendingUp,
  Users,
  Star,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VendorHeaderProps {
  onMobileOpen?: () => void;
}

// Type definitions
interface PageConfig {
  title: string;
  icon: React.ElementType;
  description?: string;
  showLiveBadge?: boolean;
  gradient?: string;
}

// Map routes to page configurations
const pageConfig: Record<string, PageConfig> = {
  "/vendor/dashboard": {
    title: "Dashboard",
    icon: Home,
    description: "Overview of your store performance",
    showLiveBadge: true,
    gradient: "from-brand-primary to-brand-primary",
  },
  "/vendor": {
    title: "Dashboard",
    icon: Home,
    description: "Overview of your store performance",
    showLiveBadge: true,
    gradient: "from-brand-primary to-brand-primary",
  },
  "/vendor/products": {
    title: "Products",
    icon: Package,
    description: "Manage your product catalog",
    gradient: "from-brand-primary to-brand-accent",
  },
  "/vendor/products/new": {
    title: "Add New Product",
    icon: Package,
    description: "Create a new product listing",
    gradient: "from-brand-primary to-brand-muted",
  },
  "/vendor/orders": {
    title: "Orders",
    icon: ShoppingCart,
    description: "Track and manage customer orders",
    gradient: "from-brand-accent to-brand-primary",
  },
  "/vendor/wallet": {
    title: "Wallet",
    icon: Wallet,
    description: "Manage your earnings and transactions",
    gradient: "from-brand-primary to-brand-accent",
  },
  "/vendor/settings": {
    title: "Settings",
    icon: Settings,
    description: "Configure your store preferences",
    gradient: "from-brand-muted to-brand-accent",
  },
};

// Dynamic route patterns with regex matching
const dynamicRouteConfigs = [
  {
    pattern: /^\/vendor\/products\/edit\/\d+$/,
    getConfig: (): PageConfig => ({
      title: "Edit Product",
      icon: Package,
      description: "Update product details",
      gradient: "from-brand-primary to-brand-muted",
    }),
  },
  {
    pattern: /^\/vendor\/products\/\d+$/,
    getConfig: (): PageConfig => ({
      title: "Product Details",
      icon: Package,
      description: "View product information",
      gradient: "from-brand-primary to-brand-accent",
    }),
  },
  {
    pattern: /^\/vendor\/orders\/\d+$/,
    getConfig: (): PageConfig => ({
      title: "Order Details",
      icon: ShoppingCart,
      description: "View order information",
      gradient: "from-brand-accent to-brand-primary",
    }),
  },
  {
    pattern: /^\/vendor\/wallet\/transactions$/,
    getConfig: (): PageConfig => ({
      title: "Transactions",
      icon: Wallet,
      description: "View all wallet transactions",
      gradient: "from-brand-primary to-brand-accent",
    }),
  },
  {
    pattern: /^\/vendor\/products\/category\/[\w-]+$/,
    getConfig: (): PageConfig => ({
      title: "Category Products",
      icon: Package,
      description: "Browse products by category",
      gradient: "from-brand-primary to-brand-muted",
    }),
  },
];

// Mock notifications data (would come from API in production)
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  type: "order" | "payment" | "inventory" | "system";
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #ORD-78945 has been placed",
    time: "2 minutes ago",
    isNew: true,
    type: "order",
    actionUrl: "/vendor/orders/78945",
  },
  {
    id: "2",
    title: "Payment Received",
    message: "₦45,000 added to your wallet",
    time: "1 hour ago",
    isNew: true,
    type: "payment",
    actionUrl: "/vendor/wallet",
  },
  {
    id: "3",
    title: "Product Out of Stock",
    message: "Update inventory for Premium T-Shirt",
    time: "3 hours ago",
    isNew: false,
    type: "inventory",
    actionUrl: "/vendor/products/edit/123",
  },
];

// Helper function to format relative time
const formatRelativeTime = (timeString: string): string => {
  const minutes = parseInt(timeString);
  if (!isNaN(minutes)) {
    if (minutes < 60) return `${minutes} minutes ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return `${Math.floor(minutes / 1440)} days ago`;
  }
  return timeString;
};

export const VendorHeader: React.FC<VendorHeaderProps> = ({ onMobileOpen }) => {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Safe pathname access with fallback
  const currentPath = useMemo(() => {
    try {
      return router?.state?.location?.pathname || "/vendor";
    } catch (error) {
      console.error("Error accessing router path:", error);
      return "/vendor";
    }
  }, [router?.state?.location?.pathname]);

  // Memoized page detection based on current route
  const currentPageConfig = useMemo((): PageConfig => {
    // Add debug logging in development
    if (process.env.NODE_ENV === "development") {
      console.log("Current path:", currentPath);
    }

    // Check exact match first
    if (pageConfig[currentPath]) {
      return pageConfig[currentPath];
    }

    // Check dynamic routes with regex patterns
    for (const dynamicConfig of dynamicRouteConfigs) {
      if (dynamicConfig.pattern.test(currentPath)) {
        return dynamicConfig.getConfig();
      }
    }

    // Handle vendor sub-routes with prefix matching
    if (currentPath.startsWith("/vendor/")) {
      const subPath = currentPath.replace("/vendor/", "");
      const firstSegment = subPath.split("/")[0];

      const subRouteMap: Record<string, PageConfig> = {
        analytics: {
          title: "Analytics",
          icon: TrendingUp,
          description: "View your store analytics",
          gradient: "from-brand-primary to-brand-accent",
          showLiveBadge: true,
        },
        reviews: {
          title: "Reviews",
          icon: Star,
          description: "Manage customer reviews",
          gradient: "from-brand-primary to-brand-muted",
        },
        customers: {
          title: "Customers",
          icon: Users,
          description: "Manage your customers",
          gradient: "from-brand-accent to-brand-primary",
        },
      };

      if (subRouteMap[firstSegment]) {
        return subRouteMap[firstSegment];
      }
    }

    // Default fallback for vendor routes
    if (currentPath.startsWith("/vendor")) {
      return {
        title: "Vendor Dashboard",
        icon: Shield,
        description: "Manage your store",
        gradient: "from-brand-primary to-brand-primary",
        showLiveBadge: true,
      };
    }

    // Ultimate fallback
    return {
      title: "Dashboard",
      icon: Home,
      description: "Welcome to your dashboard",
      gradient: "from-brand-primary to-brand-primary",
      showLiveBadge: false,
    };
  }, [currentPath]);
  // Memoized unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isNew).length;
  }, [notifications]);

  // Simulate loading new notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In production, fetch from API here
      setIsLoading(false);
    };

    if (isNotificationsOpen) {
      fetchNotifications();
    }
  }, [isNotificationsOpen]);

  // Handle mark all as read
  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (notification.isNew) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isNew: false } : n,
          ),
        );
      }

      if (notification.actionUrl) {
        router.navigate({ to: notification.actionUrl });
        setIsNotificationsOpen(false);
      }
    },
    [router],
  );

  // Get icon color based on notification type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-3 w-3 text-brand-primary" />;
      case "payment":
        return <Wallet className="h-3 w-3 text-brand-success" />;
      case "inventory":
        return <Package className="h-3 w-3 text-brand-warning" />;
      default:
        return <Bell className="h-3 w-3 text-brand-muted" />;
    }
  };

  const PageIcon = currentPageConfig.icon;
  const gradientClass =
    currentPageConfig.gradient || "from-brand-primary to-brand-primary";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-brand-primary-soft">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileOpen}
              className="lg:hidden text-brand-dark hover:bg-brand-primary-soft transition-all duration-200 rounded-lg h-10 w-10 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page Title Section - Desktop */}
            <div className="hidden md:flex items-center gap-3 min-w-0">
              {/* Animated Icon Container */}
              <motion.div
                key={`${currentPath}-icon`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-sm shrink-0`}
              >
                <PageIcon className="h-5 w-5 text-white" />
              </motion.div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <motion.h1
                    key={`${currentPath}-title`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-xl text-brand-dark truncate"
                  >
                    {currentPageConfig.title}
                  </motion.h1>

                  {currentPageConfig.showLiveBadge && (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 border-brand-success/30 text-brand-success bg-brand-success/10 font-medium shrink-0"
                    >
                      <span className="relative flex h-1.5 w-1.5 mr-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-success"></span>
                      </span>
                      Live
                    </Badge>
                  )}
                </div>

                {currentPageConfig.description && (
                  <motion.p
                    key={`${currentPath}-desc`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs text-brand-muted mt-0.5"
                  >
                    {currentPageConfig.description}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Mobile Page Title */}
            <div className="md:hidden flex items-center gap-2 min-w-0">
              <motion.div
                key={`${currentPath}-mobile`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-8 w-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0`}
                >
                  <PageIcon className="h-4 w-4 text-white" />
                </div>
                <h1 className="font-bold text-lg text-brand-dark truncate">
                  {currentPageConfig.title}
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Notifications Dropdown */}
            <DropdownMenu
              open={isNotificationsOpen}
              onOpenChange={setIsNotificationsOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-brand-dark hover:bg-brand-primary-soft transition-all duration-200 rounded-lg h-10 w-10"
                  aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
                >
                  <Bell className="h-5 w-5" />

                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-[10px] text-white flex items-center justify-center border-2 border-white font-bold shadow-sm"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 mt-2 bg-white border-brand-primary-soft shadow-xl rounded-xl p-0 overflow-hidden"
              >
                <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-brand-primary-soft">
                  <span className="text-base font-bold text-brand-dark">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllRead}
                      className="h-auto p-0 text-xs text-brand-primary hover:text-brand-primary-hover font-medium"
                    >
                      Mark all read
                    </Button>
                  )}
                </DropdownMenuLabel>

                <ScrollArea className="max-h-80">
                  {isLoading ? (
                    <div className="py-12 text-center">
                      <Loader2 className="h-8 w-8 text-brand-primary animate-spin mx-auto mb-3" />
                      <p className="text-sm text-brand-muted">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="divide-y divide-brand-primary-soft">
                      {notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="cursor-pointer p-4 hover:bg-brand-primary-soft transition-colors duration-200 focus:bg-brand-primary-soft"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="space-y-1.5 w-full">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-sm text-brand-dark">
                                {notification.title}
                              </p>
                              {notification.isNew && (
                                <Badge className="text-[8px] h-4 bg-brand-primary-soft text-brand-primary border-brand-primary-soft">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-brand-muted leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-brand-muted/60">
                                {formatRelativeTime(notification.time)}
                              </p>
                              <div className="flex items-center gap-1">
                                {getNotificationIcon(notification.type)}
                                <span className="text-[10px] capitalize text-brand-muted">
                                  {notification.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="h-12 w-12 rounded-full bg-brand-primary-soft flex items-center justify-center mx-auto mb-3">
                        <Bell className="h-6 w-6 text-brand-muted" />
                      </div>
                      <p className="text-sm text-brand-muted">
                        No notifications
                      </p>
                      <p className="text-xs text-brand-muted/60 mt-1">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </ScrollArea>

                {/* {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="bg-brand-primary-soft" />
                    <DropdownMenuItem 
                      className="justify-center cursor-pointer text-brand-primary hover:text-brand-primary-hover font-medium text-sm py-3"
                      onClick={() => {
                        router.navigate({ to: '/vendor/notifications' });
                        setIsNotificationsOpen(false);
                      }}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )} */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Stats Indicator */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-brand-primary-soft">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary-soft/50 transition-all hover:bg-brand-primary-soft">
                <Users className="h-3.5 w-3.5 text-brand-primary" />
                <span className="text-xs font-medium text-brand-dark">
                  1,234
                </span>
                <span className="text-[10px] text-brand-muted">visitors</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-success/5 transition-all hover:bg-brand-success/10">
                <Star className="h-3.5 w-3.5 text-brand-accent" />
                <span className="text-xs font-medium text-brand-dark">4.8</span>
                <span className="text-[10px] text-brand-muted">rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

VendorHeader.displayName = "VendorHeader";
