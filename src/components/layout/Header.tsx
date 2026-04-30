import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  Search,
  User,
  Home,
  Package,
  Tag,
  ChevronRight,
  LogOut,
  Heart,
  Settings,
  Shield,
  Bell,
  Store,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks";
import { CartIcon } from "../cart";
import { useLogout } from "@/api/mutations";
import { motion, AnimatePresence } from "framer-motion";

// Debounce utility for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Navigation links configuration
const navLinks = [
  { href: "/", title: "Home", icon: Home },
  { href: "/categories", title: "Categories", icon: Tag },
  { href: "/products", title: "Products", icon: Package },
  { href: "/vendors", title: "Vendors", icon: Store },
];

const userLinks = [
  { href: "/account", title: "My Profile", icon: User },
  { href: "/orders", title: "My Orders", icon: Package },
  // { href: "/wishlist", title: "Wishlist", icon: Heart },
  // { href: "/settings", title: "Settings", icon: Settings },
];

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouterState();
  const navigate = useNavigate();
  const { user, isAuthenticated, isVendor, logout } = useAuth();
  const { isPending: isLoggingOut } = useLogout();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search with debounced value
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      navigate({ to: "/search", search: { q: debouncedSearchQuery } });
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  }, [debouncedSearchQuery, navigate]);

  // Memoized active route check
  const isActive = useCallback(
    (href: string) => {
      return router.location.pathname === href;
    },
    [router.location.pathname],
  );

  // Memoized user data
  const userInitials = useMemo(() => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.fullName]);

  const userDisplayName = useMemo(() => {
    if (!user?.fullName) return "Welcome!";
    return user.fullName.split(" ")[0];
  }, [user?.fullName]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate({ to: "/search", search: { q: searchQuery } });
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    },
    [searchQuery, navigate],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);

  const handleAdminDashboard = useCallback(() => {
    navigate({ to: "/admin" });
    setIsSidebarOpen(false);
  }, [navigate]);

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-brand-primary/10"
          : "bg-white border-b border-brand-muted/10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Mobile Menu Button */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-brand-primary-soft transition-colors rounded-lg h-10 w-10"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-brand-dark" />
                </Button>
              </SheetTrigger>

              {/* Mobile Navigation */}
              <SheetContent
                side="left"
                className="w-[85vw] max-w-sm p-0 bg-brand-surface border-r border-brand-primary-soft"
              >
                <SheetHeader className="p-4 border-b border-brand-primary-soft bg-white">
                  <SheetTitle>
                    <Link
                      to="/"
                      onClick={() => setIsSidebarOpen(false)}
                      className="inline-block"
                    >
                      <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="overflow-y-auto h-[calc(100vh-73px)] p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-6">
                      {/* Navigation Links */}
                      <nav className="space-y-1">
                        {navLinks.map((link) => {
                          const Icon = link.icon;
                          const active = isActive(link.href);
                          return (
                            <Link
                              key={link.href}
                              to={link.href}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`
                                  flex items-center justify-between px-3 py-2.5 rounded-lg 
                                  transition-all duration-200 group
                                  ${
                                    active
                                      ? "bg-brand-primary-soft text-brand-primary"
                                      : "text-brand-dark hover:bg-brand-primary-soft/50"
                                  }
                                `}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  className={`h-5 w-5 ${active ? "text-brand-primary" : "text-brand-muted"}`}
                                />
                                <span
                                  className={`font-medium ${active && "text-brand-primary"}`}
                                >
                                  {link.title}
                                </span>
                              </div>
                              {active && (
                                <ChevronRight className="h-4 w-4 text-brand-primary" />
                              )}
                            </Link>
                          );
                        })}
                      </nav>

                      {/* User Links for Authenticated Users */}
                      {isAuthenticated && (
                        <>
                          <Separator className="bg-brand-primary-soft" />
                          <nav className="space-y-1">
                            {userLinks.map((link) => {
                              const Icon = link.icon;
                              const active = isActive(link.href);
                              return (
                                <Link
                                  key={link.href}
                                  to={link.href}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className={`
                                      flex items-center gap-3 px-3 py-2.5 rounded-lg 
                                      transition-all duration-200
                                      ${
                                        active
                                          ? "bg-brand-primary-soft text-brand-primary"
                                          : "text-brand-dark hover:bg-brand-primary-soft/50"
                                      }
                                    `}
                                >
                                  <Icon
                                    className={`h-5 w-5 ${active ? "text-brand-primary" : "text-brand-muted"}`}
                                  />
                                  <span>{link.title}</span>
                                </Link>
                              );
                            })}
                          </nav>
                        </>
                      )}
                    </div>

                    {/* User Info Section */}
                    <div className="pt-6 mt-6 border-t border-brand-primary-soft">
                      {isAuthenticated ? (
                        <div className="flex gap-3">
                          <Link
                            to="/account"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg flex-1 transition-shadow hover:shadow-md"
                          >
                            <Avatar className="h-10 w-10 ring-2 ring-brand-primary-soft">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-accent text-white text-sm font-bold">
                                {userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-brand-dark truncate text-sm">
                                {userDisplayName}
                              </p>
                              <p className="text-xs text-brand-muted truncate">
                                {user?.email}
                              </p>
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="bg-brand-error/10 hover:bg-brand-error/20 text-brand-error h-12 w-12 rounded-lg"
                          >
                            <LogOut className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="border-brand-primary text-brand-primary hover:bg-brand-primary-soft h-11 rounded-lg"
                            asChild
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Link to="/login">Sign In</Link>
                          </Button>
                          <Button
                            className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm h-11 rounded-lg"
                            asChild
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Link to="/signup">Sign Up</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8 sm:h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                        relative px-4 py-2 text-sm font-medium rounded-lg
                        transition-all duration-200
                        ${
                          active
                            ? "text-brand-primary bg-brand-primary-soft"
                            : "text-brand-dark hover:text-brand-primary hover:bg-brand-primary-soft/50"
                        }
                      `}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-brand-primary-soft rounded-lg h-10 w-10"
              aria-label="Search"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              {isSearchExpanded ? (
                <X className="h-5 w-5 text-brand-dark" />
              ) : (
                <Search className="h-5 w-5 text-brand-dark" />
              )}
            </Button>

            {/* Desktop Search */}
            <div className="hidden lg:block relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-64 xl:w-80 pl-10 pr-4 h-10 bg-brand-surface border-brand-primary-soft text-brand-dark placeholder:text-brand-muted focus:bg-white focus:border-brand-primary rounded-lg text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
              </form>
            </div>

            {/* Cart Icon */}
            <CartIcon showCount />

            {/* Notifications - Desktop only */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-brand-primary-soft rounded-lg h-10 w-10"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 text-brand-dark" />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-accent text-[10px] font-bold text-white items-center justify-center">
                        3
                      </span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 mt-2 bg-white border-brand-primary-soft shadow-lg rounded-lg"
                >
                  <DropdownMenuLabel className="text-brand-dark font-semibold px-4 py-3">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-brand-primary-soft" />
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-brand-surface transition-colors cursor-pointer border-b border-brand-primary-soft last:border-0"
                      >
                        <p className="text-sm font-medium text-brand-dark">
                          Order Shipped
                        </p>
                        <p className="text-xs text-brand-muted mt-1">
                          Your order #{12345 + i} has been shipped
                        </p>
                        <p className="text-xs text-brand-primary mt-2">
                          2 hours ago
                        </p>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Auth Section */}
            {!isAuthenticated ? (
              <div className="hidden lg:flex gap-2 ml-2">
                <Button
                  variant="ghost"
                  className="text-brand-primary hover:bg-brand-primary-soft h-10 px-4 rounded-lg text-sm font-medium"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm h-10 px-4 rounded-lg text-sm font-medium"
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-brand-primary-soft rounded-lg h-10 px-2 gap-2"
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-brand-primary-soft">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-accent text-white text-xs font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:inline text-brand-dark font-medium text-sm max-w-[100px] truncate">
                      {userDisplayName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 mt-2 bg-white border-brand-primary-soft shadow-lg rounded-lg"
                >
                  <DropdownMenuLabel className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-brand-primary-soft">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-accent text-white font-bold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-brand-dark truncate text-sm">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-brand-muted truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-brand-primary-soft" />

                  {isVendor && (
                    <>
                      <DropdownMenuItem
                        className="text-brand-dark hover:bg-brand-primary-soft cursor-pointer py-3 px-4"
                        onClick={handleAdminDashboard}
                      >
                        <Shield className="h-4 w-4 text-brand-primary mr-3" />
                        <span>Vendor Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-brand-primary-soft" />
                    </>
                  )}

                  {userLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <DropdownMenuItem
                        key={link.href}
                        asChild
                        className="text-brand-dark hover:bg-brand-primary-soft cursor-pointer py-3 px-4"
                      >
                        <Link to={link.href} className="flex items-center">
                          <Icon className="h-4 w-4 text-brand-muted mr-3" />
                          <span>{link.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}

                  <DropdownMenuSeparator className="bg-brand-primary-soft" />

                  <DropdownMenuItem
                    className="text-brand-error hover:bg-brand-error/10 cursor-pointer py-3 px-4"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Animated */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden pt-2 pb-4"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 h-11 bg-brand-surface border-brand-primary-soft text-brand-dark placeholder:text-brand-muted focus:bg-white focus:border-brand-primary rounded-lg text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
