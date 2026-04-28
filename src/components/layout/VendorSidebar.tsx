import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
  LogOut,
  X,
  ChevronRight,
  BadgeCheck,
  XIcon,
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
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
  },
  {
    title: "Wallet",
    href: "/vendor/wallet",
    icon: Wallet,
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
                "group relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mmp-primary focus-visible:ring-offset-2 focus-visible:ring-offset-mmp-primary2",
                isActive
                  ? "bg-mmp-secondary text-white shadow-md rounded-l-none border-l-4 border-white"
                  : "text-mmp-secondary/70 hover:bg-mmp-primary2/20 hover:text-mmp-secondary",
                isItemHovered && !isActive && "translate-x-1",
              )}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "text-mmp-primary" : "text-mmp-secondary",
                      isItemHovered &&
                        !isActive &&
                        "scale-110 text-mmp-secondary",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "font-medium transition-all duration-300",
                    isActive && "font-semibold",
                  )}
                >
                  {item.title}
                </span>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <ChevronRight className="h-4 w-4 text-mmp-primary animate-pulse" />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="hidden lg:block bg-mmp-primary text-white border-mmp-secondary2"
          >
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
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "shadow-2xl",
        )}
      >
        <div className="flex h-full flex-col bg-mmp-primary2 min-h-0 overflow-hidden relative">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-mmp-secondary/20 bg-mmp-primary2/95">
            <div className="flex flex-col items-start gap-3">
              <div className="">
                <img
                  src="/logo.png"
                  alt="FashionKet Logo"
                  className="h-auto w-[240px] rounded-lg"
                />
              </div>
              <div>
                <span className="text-xl text-mmp-secondary font-bold ">
                  Store Dashboard
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="text-white bg-mmp-secondary/10 hover:scale-110 transition-all absolute top-8 right-2 rounded-full"
              aria-label="Close menu"
            >
              <XIcon className="h-10 w-10 font-bold" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-mmp-primary/20 scrollbar-track-transparent">
            <nav className="space-y-2">
              {vendorNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>

          {/* Mobile Footer */}
          <div className="flex-shrink-0 border-t border-mmp-secondary p-6 bg-mmp-primary2/95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4 group">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-mmp-primary/10 flex items-center justify-center ring-2 ring-mmp-primary group-hover:ring-mmp-primary/40 transition-all">
                    <img
                      src={vendor?.logoUrl || "/logo.png"}
                      alt="Store logo"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 text-mmp-primary fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-mmp-secondary truncate flex items-center gap-1">
                    {vendor?.businessName || "Store Name"}
                  </p>
                  <p className="text-xs text-mmp-secondary/60 truncate">
                    ID: {vendor?.auth_id?.toString().slice(-8) || "VEN-1234"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="justify-start text-red-600 hover:bg-red-600/10 hover:scale-105 transition-all rounded-full h-10 w-10 p-0"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </Button>
            </div>

            {/* Version Info */}
            <div className="mt-4 text-center">
              <span className="text-[10px] text-mmp-secondary/40">
                v2.0.0 • Store Portal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-mmp-primary2 shadow-xl overflow-hidden">
          <div className="flex-1 flex flex-col pt-8 pb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-mmp-primary/20 scrollbar-track-transparent">
            {/* Logo Section */}
            <div className="flex flex-col items-start gap-3 px-6 mb-10 group">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="FashionKet Logo"
                  className="h-auto w-[280px] rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-mmp-secondary">
                  Store Portal
                </span>
                <span className="text-xs text-mmp-secondary/60">
                  Vendor Dashboard
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-2 flex-1 px-4 space-y-2">
              {vendorNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>

          {/* Profile Section */}
          <div className="flex-shrink-0 border-t border-mmp-secondary p-6 bg-mmp-primary2/95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-mmp-primary/10 flex items-center justify-center ring-2 ring-mmp-primary group-hover:ring-mmp-primary/40 transition-all">
                    <img
                      src={vendor?.logoUrl || "/logo.png"}
                      alt="Store logo"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 text-mmp-primary fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-mmp-secondary truncate">
                    {vendor?.businessName || "Store Name"}
                  </p>
                  <p className="text-xs text-mmp-secondary/60 truncate">
                    ID: {vendor?.auth_id?.toString().slice(-8) || "VEN-1234"}
                  </p>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-mmp-neutral hover:bg-red-600/10 hover:scale-105 transition-all rounded-full h-10 w-10 p-0"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-mmp-primary text-white"
                  >
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Version Info */}
            <div className="mt-4 pt-4 text-center border-t border-mmp-secondary/10">
              <span className="text-[10px] text-mmp-secondary/40">
                v2.0.0 • Store Portal
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
