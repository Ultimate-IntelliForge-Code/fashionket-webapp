import React, { useState, memo, useCallback } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  CreditCard,
  Tag,
  LogOut,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Enhanced navigation items with metadata
const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Overview & metrics',
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage inventory',
    badge: '142',
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tag,
    description: 'Organize products',
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Track fulfillment',
    badge: '8',
    badgeColor: 'brand-accent',
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'User management',
    badge: '+24',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Sales insights',
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    description: 'Transactions',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration',
  },
];

// Separate footer items
const footerNavItems = [
  {
    title: 'Help Center',
    href: '/admin/help',
    icon: HelpCircle,
  },
  {
    title: 'Promotions',
    href: '/admin/promotions',
    icon: Gift,
  },
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Memoized NavItem for performance
const NavItem = memo(({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: typeof adminNavItems[0]; 
  isActive: boolean;
  onClick?: () => void;
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
              "group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
              isActive
                ? "bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 text-brand-primary shadow-sm"
                : "text-brand-dark hover:bg-brand-primary-soft/50 hover:text-brand-primary",
              isHovered && !isActive && "translate-x-0.5"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Icon className={cn(
                "h-5 w-5 transition-all duration-200 flex-shrink-0",
                isActive ? "text-brand-primary" : "text-brand-muted group-hover:text-brand-primary",
                isHovered && !isActive && "scale-110"
              )} />
              
              <span className={cn(
                "font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {item.title}
              </span>
            </div>

            {/* Badge */}
            {item.badge && (
              <Badge 
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "text-[10px] px-1.5 py-0 h-5",
                  isActive 
                    ? "bg-brand-primary text-white" 
                    : "bg-brand-primary-soft text-brand-primary"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="hidden lg:block bg-brand-dark text-white border-0 shadow-lg">
          <div>
            <p className="font-semibold text-sm">{item.title}</p>
            <p className="text-xs text-white/70">{item.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

NavItem.displayName = 'NavItem';

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isMobileOpen = false, 
  onMobileClose 
}) => {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const isNavActive = useCallback((href: string) => {
    return currentPath === href || currentPath.startsWith(href);
  }, [currentPath]);

  const handleNavClick = useCallback(() => {
    if (onMobileClose) onMobileClose();
  }, [onMobileClose]);

  const handleLogout = useCallback(() => {
    // Logout logic
    if (onMobileClose) onMobileClose();
  }, [onMobileClose]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              FashionKet
            </h1>
            <p className="text-xs text-brand-muted">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <Separator className="mx-6 w-auto bg-brand-primary-soft" />

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin">
        <nav className="space-y-1" aria-label="Admin navigation">
          {adminNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={isNavActive(item.href)}
              onClick={handleNavClick}
            />
          ))}
        </nav>

        {/* Footer Navigation */}
        <Separator className="my-6 bg-brand-primary-soft" />
        
        <nav className="space-y-1" aria-label="Support navigation">
          {footerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "text-brand-muted hover:text-brand-primary hover:bg-brand-primary-soft/50",
                  isActive && "text-brand-primary bg-brand-primary-soft"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="flex-shrink-0 border-t border-brand-primary-soft p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-brand-error hover:bg-brand-error/10 hover:text-brand-error transition-all duration-200 rounded-lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
        
        {/* Version Info */}
        <div className="mt-4 text-center">
          <p className="text-[10px] font-mono text-brand-muted">
            v2.0.0 • Admin Portal
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out",
          "bg-white shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-label="Mobile admin menu"
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0"
        aria-label="Admin sidebar"
      >
        <div className="flex flex-col h-full bg-white border-r border-brand-primary-soft shadow-sm">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};