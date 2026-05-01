import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  BadgeCheck,
  X,
  TrendingUp,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface VendorSideBarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Navigation items with enhanced metadata
const vendorNavItems = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
    description: "Overview & statistics",
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: Package,
    description: "Manage your inventory",
    // badge: "New",
  },
  {
    title: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
    description: "Track and fulfill orders",
    // badge: "12",
  },
  {
    title: "Wallet",
    href: "/vendor/wallet",
    icon: CreditCard,
    description: "Earnings & transactions",
  },
  {
    title: "Settings",
    href: "/vendor/settings",
    icon: Settings,
    description: "Store preferences",
  },
];

// Individual navigation item component
const NavItem = ({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: typeof vendorNavItems[0]; 
  isActive: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "group relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
              isActive
                ? "bg-brand-primary-soft text-brand-primary shadow-sm"
                : "text-brand-dark hover:bg-brand-primary-soft/50 hover:text-brand-primary",
              isHovered && !isActive && "translate-x-0.5"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Icon with container */}
              <div className={cn(
                "relative transition-transform duration-200",
                isHovered && !isActive && "scale-110"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isActive ? "text-brand-primary" : "text-brand-muted",
                  isHovered && !isActive && "text-brand-primary"
                )} />
                
                {/* Badge for notifications */}
                {/* {item.badge && (
                  <span className={cn(
                    "absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white",
                    isActive ? "bg-brand-primary" : "bg-brand-accent"
                  )}>
                    {item.badge}
                  </span>
                )} */}
              </div>
              
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-sm transition-all duration-200 block",
                  isActive ? "font-semibold text-brand-primary" : "font-medium"
                )}>
                  {item.title}
                </span>
                {isActive && (
                  <span className="text-xs text-brand-muted block mt-0.5">
                    {item.description}
                  </span>
                )}
              </div>
            </div>

            {/* Active indicator chevron */}
            {isActive && (
              <ChevronRight className="h-4 w-4 text-brand-primary" />
            )}
          </Link>
        </TooltipTrigger>
        
        {/* Tooltip for collapsed/hover state */}
        <TooltipContent side="right" className="hidden lg:block bg-brand-dark text-white border-0 shadow-lg px-3 py-2">
          <p className="font-semibold text-sm">{item.title}</p>
          <p className="text-xs text-white/70 mt-0.5">{item.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Vendor information section component
const VendorInfo = ({ 
  vendor, 
  onLogout, 
  isMobile = false 
}: { 
  vendor: any; 
  onLogout: () => void;
  isMobile?: boolean;
}) => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer" onClick={()=>{
        navigate({to: '/vendor/settings'})
      }}>
        <div className="relative shrink-0">
          <div className="h-12 w-12 rounded-full bg-brand-primary-soft flex items-center justify-center ring-2 ring-brand-primary/20 group-hover:ring-brand-primary/40 transition-all duration-200">
            <img
              src={vendor?.logoUrl || "/logo512.png"}
              alt={`${vendor?.businessName || 'Store'} logo`}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-brand-primary bg-white rounded-full" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-dark truncate text-sm group-hover:text-brand-primary transition-colors">
            {vendor?.businessName || "Your Store"}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp className="h-3 w-3 text-brand-success" />
            <p className="text-xs text-brand-muted truncate">
              ID: {vendor?.auth_id?.toString().slice(-8) || "VEN-1234"}
            </p>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-brand-error hover:bg-brand-error/10 hover:scale-105 transition-all duration-200 rounded-lg h-9 w-9 shrink-0"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "top" : "right"} className="bg-brand-dark text-white border-0">
            <p>Sign out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const VendorSideBar: React.FC<VendorSideBarProps> = ({
  isMobileOpen = false,
  onMobileClose,
}) => {
  const router = useRouterState();
  const { vendor, logout } = useAuth();
  const currentPath = router.location.pathname;

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

  // Check if a nav item is active - handles nested routes properly
  const isNavActive = (href: string) => {
    if (href === "/vendor") {
      return currentPath === "/vendor";
    }
    // For nested routes like /vendor/products, /vendor/orders, etc.
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "shadow-2xl"
        )}
        role="dialog"
        aria-label="Mobile vendor menu"
      >
        <div className="flex h-full flex-col bg-white">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-5 py-6 border-b border-brand-primary-soft bg-brand-surface">
            <div className="space-y-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-auto"
              />
              <div>
                <h2 className="text-lg font-bold text-brand-dark">
                  Store Dashboard
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Manage your business
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="text-brand-dark hover:bg-brand-primary-soft hover:scale-105 transition-all duration-200 rounded-full h-10 w-10 shrink-0"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-1" aria-label="Vendor navigation">
              {vendorNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isNavActive(item.href)}
                  onClick={handleNavClick}
                />
              ))}
            </nav>
          </div>

          {/* Mobile Footer */}
          <div className="flex-shrink-0 border-t border-brand-primary-soft p-5 bg-brand-surface">
            <VendorInfo vendor={vendor} onLogout={handleLogout} isMobile />
            
            <Separator className="my-4 bg-brand-primary-soft" />
            
            <div className="text-center">
              <span className="text-[10px] font-mono text-brand-muted">
                v2.0.0 • Store Portal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-30" 
        aria-label="Vendor dashboard sidebar"
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-brand-primary-soft shadow-lg">
          {/* Logo Section */}
          <div className="flex-1 flex flex-col pt-8 pb-6 overflow-hidden">
            <div className="px-6 mb-8">
              <div className="space-y-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-brand-dark">
                    Store Portal
                  </h1>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Vendor Dashboard
                  </p>
                </div>
              </div>
            </div>

            <Separator className="mx-6 w-auto bg-brand-primary-soft" />

            {/* Navigation */}
            <nav className="mt-6 px-4 space-y-1" aria-label="Vendor navigation">
              {vendorNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isNavActive(item.href)}
                  onClick={handleNavClick}
                />
              ))}
            </nav>
          </div>

          {/* Profile Section */}
          <div className="flex-shrink-0 border-t border-brand-primary-soft p-6 bg-brand-surface">
            <VendorInfo vendor={vendor} onLogout={handleLogout} />
            
            <Separator className="my-4 bg-brand-primary-soft" />
            
            <div className="text-center">
              <span className="text-[10px] font-mono text-brand-muted">
                v2.0.0 • Store Portal
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};