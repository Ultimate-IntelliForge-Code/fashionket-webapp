import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
  User,
  LogOut,
  X,
  ChevronRight,
  Store,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VendorSideBarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const vendorNavItems = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: Home,
    // badge: "updated",
    badgeVariant: "default" as const,
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: Package,
    // count: 24,
  },
  {
    title: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
    // count: 12,
    badgeVariant: "destructive" as const,
  },
  {
    title: "Wallet",
    href: "/vendor/wallet",
    icon: Wallet,
    // badge: "₦2.4k",
    badgeVariant: "secondary" as const,
  },
  {
    title: "Settings",
    href: "/vendor/settings",
    icon: Settings,
  },
];

export const VendorSideBar: React.FC<VendorSideBarProps> = ({
  isMobileOpen = false,
  onMobileClose,
}) => {
  const router = useRouter();
  const { vendor, logout } = useAuth();
  const currentPath = router.state.location.pathname;
  const [isHovered, setIsHovered] = React.useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      if (onMobileClose) onMobileClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavClick = () => {
    console.log("click");
    if (onMobileClose) onMobileClose();
  };

  const NavItem = ({ item }: { item: (typeof vendorNavItems)[0] }) => {
    const isActive =
      currentPath === item.href ||
      (item.href !== "/vendor" && currentPath.startsWith(item.href));

    const isItemHovered = isHovered === item.href;

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.href}
              onClick={handleNavClick}
              onMouseEnter={() => setIsHovered(item.href)}
              onMouseLeave={() => setIsHovered(null)}
              className={cn(
                "group relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-mmp-primary",
                isActive
                  ? "bg-white/20 text-white shadow-lg rounded-l-none border-l-3 border-mmp-accent"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
                isItemHovered && !isActive && "scale-[1.02]",
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive ? "text-white" : "text-white/60",
                      isItemHovered && "scale-110",
                    )}
                  />
                  {isActive && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-mmp-accent animate-pulse" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium truncate",
                    isActive && "font-semibold",
                  )}
                >
                  {item.title}
                </span>
              </div>

              {/* Badge or Count */}
              {/* {(item.count || item.badge) && (
                <Badge
                  variant={item.badgeVariant || "secondary"}
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-white text-mmp-primary hover:bg-white/90"
                      : "bg-white/20 text-white hover:bg-white/30",
                    isItemHovered && "scale-105",
                  )}
                >
                  {item.count || item.badge}
                </Badge>
              )} */}

              {/* Active Indicator */}
              {isActive && (
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mmp-accent animate-pulse" />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="hidden lg:block">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "shadow-2xl",
        )}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-mmp-primary2 to-mmp-primary min-h-0 overflow-hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div>
                <img src="/logo.png" alt="FashionKet Logo" />
                <span className="text-xs text-white/70 ml-4">Store Portal</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="text-white hover:bg-white/20 hover:scale-110 transition-all"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <nav className="space-y-1.5">
              {vendorNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-white/20 p-6 bg-gradient-to-t from-black/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4 group">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30 group-hover:scale-105 transition-transform">
                    <img src={vendor?.logoUrl || "/logo.png"} />
                  </div>
                  <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-400 fill-white/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate flex items-center gap-1">
                    {vendor?.businessName || "Store Name"}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    ID: {vendor?.auth_id?.toString().slice(-8) || "VEN-1234"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="justify-start py-5 text-red-600 hover:bg-red-600/20 hover:scale-[1.02] transition-all group relative overflow-hidden h-full rounded-sm"
                onClick={handleLogout}
              >
                {/* <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all" /> */}
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform text-red-600" />
                {/* <span>Logout</span> */}
              </Button>
            </div>

            {/* Version Info */}
            <div className="mt-4 text-center">
              <span className="text-[10px] text-white/40">
                v2.0.0 • Store Portal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-mmp-primary2 to-mmp-primary overflow-hidden">
          <div className="flex-1 flex flex-col pt-8 pb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 mb-10 group">
              <div>
                <img src="/logo.png" alt="FashionKet Logo" />
                <span className="text-xs text-white/70 flex items-center gap-1 ml-4">
                  <BadgeCheck className="h-3 w-3" />
                  Store Portal
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-2 flex-1 px-4 space-y-1.5">
              {vendorNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>

          {/* Profile Section */}
          <div className="flex-shrink-0 border-t border-white/20 p-6 bg-gradient-to-t from-black/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4 group">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30 group-hover:scale-105 transition-transform">
                    <img src={vendor?.logoUrl || "/logo.png"} />
                  </div>
                  <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-400 fill-white/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate flex items-center gap-1">
                    {vendor?.businessName || "Store Name"}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    ID: {vendor?.auth_id?.toString().slice(-8) || "VEN-1234"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="justify-start py-5 text-red-600 hover:bg-red-600/20 hover:scale-[1.02] transition-all group relative overflow-hidden h-full rounded-sm"
                onClick={handleLogout}
              >
                {/* <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all" /> */}
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform text-red-600" />
                {/* <span>Logout</span> */}
              </Button>
            </div>

            {/* Version Info */}
            <div className="mt-4 text-center">
              <span className="text-[10px] text-white/40">
                v2.0.0 • Store Portal
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
