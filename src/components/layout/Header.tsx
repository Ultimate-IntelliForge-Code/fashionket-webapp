import { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  Search,
  User,
  Sparkles,
  Home,
  Package,
  Tag,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Heart,
  Settings,
  CreditCard,
  Shield,
  Bell,
  TrendingUp,
  Store,
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

// Navigation links configuration
const navLinks = [
  { href: "/", title: "Home", icon: Home },
  { href: "/categories", title: "Categories", icon: Tag },
  { href: "/products", title: "Products", icon: Package },
  { href: "/vendors", title: "Vendors", icon: Store },
  // { href: '/new-arrivals', title: 'New Arrivals', icon: Sparkles },
];

const userLinks = [
  { href: "/account", title: "My Profile", icon: User },
  { href: "/orders", title: "My Orders", icon: Package },
  { href: "/wishlist", title: "Wishlist", icon: Heart },
  { href: "/settings", title: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/admin", title: "Dashboard", icon: TrendingUp },
  { href: "/admin/products", title: "Products", icon: Package },
  { href: "/admin/orders", title: "Orders", icon: ShoppingBag },
  { href: "/admin/analytics", title: "Analytics", icon: CreditCard },
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check active route
  const isActive = (href: string) => {
    return router.location.pathname === href;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery } });
      setIsSearchExpanded(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAdminDashboard = () => {
    navigate({ to: "/admin" });
  };

  // User initials for avatar
  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // User display name
  const getUserDisplayName = () => {
    if (!user?.fullName) return "Welcome!";
    return user.fullName.split(" ")[0];
  };

  return (
    <>
      {/* Premium Announcement Bar - Mobile Optimized */}
      <div className="bg-gradient-to-r from-mmp-primary to-mmp-accent text-white py-2 px-3 overflow-hidden relative">
        <div className="container mx-auto flex flex-col xs:flex-row justify-center items-center gap-2 xs:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 animate-pulse-slow">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
            <span className="text-[10px] xs:text-xs sm:text-sm font-medium tracking-wide text-white drop-shadow">
              ✨ New Collection: Summer 2024
            </span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white bg-white/20 hover:bg-white/30 h-6 xs:h-7 text-[8px] xs:text-[10px] sm:text-xs px-2 rounded-full"
            asChild
          >
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>

        {/* Animated border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-mmp-primary2/95 backdrop-blur-md shadow-lg"
            : "bg-mmp-primary2"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
              {/* Mobile Menu Button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-mmp-primary/20 p-1.5 h-9 w-9"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5 text-white" />
                  </Button>
                </SheetTrigger>

                {/* Mobile Navigation - Slide from left */}
                <SheetContent
                  side="left"
                  className="w-[85vw] max-w-sm p-0 bg-mmp-primary2 border-r border-mmp-primary/30"
                >
                  <SheetHeader className="p-4 sm:p-5 border-b border-mmp-primary/30">
                    <SheetTitle className="text-center">
                      <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center justify-center"
                      >
                        <img
                          src="/logo.png"
                          alt="FashionKet Logo"
                          className="h-8 sm:h-10 w-auto"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="overflow-y-auto h-[calc(100vh-70px)] p-4 sm:p-5">
                    {/* User Info Section - Moved to top for better UX */}
                    {isAuthenticated ? (
                      <div className="flex gap-2 items-center mb-6">
                        <Link
                          to="/account"
                          onClick={() => setIsSidebarOpen(false)}
                          className="flex items-center gap-3 p-3 bg-mmp-primary/20 rounded-xl flex-1"
                        >
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-white/20">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-mmp-accent to-mmp-secondary text-white text-sm">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-white/70 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="bg-red-600/20 hover:bg-red-600/30 h-9 w-9"
                        >
                          <LogOut className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <Button
                          variant="ghost"
                          className="border-mmp-accent text-white hover:bg-white/10 h-11 text-sm"
                          asChild
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-mmp-accent to-mmp-secondary text-white hover:opacity-90 h-11 text-sm"
                          asChild
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Link to="/signup">Register</Link>
                        </Button>
                      </div>
                    )}

                    {/* Vendor Section */}
                    {isVendor && (
                      <>
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-mmp-secondary uppercase tracking-wider mb-2 px-2">
                            Vendor Panel
                          </h3>
                          <nav className="space-y-1">
                            {adminLinks.map((link) => {
                              const Icon = link.icon;
                              return (
                                <Link
                                  key={link.href}
                                  to={link.href}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  <Icon className="h-5 w-5 text-mmp-secondary" />
                                  <span className="text-white text-sm">
                                    {link.title}
                                  </span>
                                </Link>
                              );
                            })}
                          </nav>
                        </div>
                        <Separator className="my-4 bg-white/20" />
                      </>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center justify-between px-3 py-1 rounded-lg transition-all group ${
                              active
                                ? "bg-mmp-accent rounded-l-none border-l-4 border-mmp-neutral"
                                : "hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg  text-white ${
                                  active ?? "bg-white/10 text-white"
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <span
                                className={`font-medium text-sm ${
                                  active ? "text-white" : "text-white/80"
                                }`}
                              >
                                {link.title}
                              </span>
                            </div>
                            <ChevronRight
                              className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                                active ? "text-white" : "text-white/60"
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </nav>

                    {/* User Links */}
                    {isAuthenticated && (
                      <>
                        <Separator className="my-6 bg-white/20" />
                        <nav className="space-y-1">
                          {userLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                              <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "hover:bg-white/10 text-white/80"
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                                <span className="text-sm">{link.title}</span>
                              </Link>
                            );
                          })}
                        </nav>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="FashionKet Logo"
                  className="h-7 sm:h-8 md:h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm xl:text-base ${
                        active ? "text-white" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.title}
                      {active && (
                        <>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-mmp-accent to-mmp-secondary rounded-full" />
                          <span className="absolute -top-1 -right-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mmp-secondary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-mmp-secondary"></span>
                            </span>
                          </span>
                        </>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/10 h-9 w-9"
                aria-label="Search"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </Button>

              {/* Desktop Search */}
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-[180px] lg:w-[220px] pl-9 pr-3 h-9 lg:h-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-lg text-sm focus:bg-white/20 focus:border-white/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
                </form>
              </div>

              {/* Shopping Cart */}
              <CartIcon showCount={true} />

              {/* Notifications */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/10 relative h-9 w-9"
                    >
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-mmp-accent text-[8px] font-bold text-white items-center justify-center">
                          0
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 bg-mmp-primary2 border-white/20"
                  >
                    <DropdownMenuLabel className="text-white">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <div className="p-2">
                      <div className="p-3 rounded-lg bg-white/10">
                        <p className="text-sm font-medium text-white">
                          Order Shipped
                        </p>
                        <p className="text-xs text-white/70">
                          Your order #12345 has been shipped
                        </p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="hidden lg:flex gap-2 ml-2">
                  <Button
                    variant="ghost"
                    className="border-mmp-accent text-white hover:bg-white/10 h-9 px-3 text-sm"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-mmp-accent to-mmp-secondary text-white hover:opacity-90 h-9 px-3 text-sm"
                    asChild
                  >
                    <Link to="/signup">Register</Link>
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:bg-white/10 px-2 rounded-full h-9"
                    >
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-mmp-accent to-mmp-secondary text-white text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline ml-2 text-white font-medium text-sm max-w-[80px] truncate">
                        {getUserDisplayName()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-mmp-primary2 border-white/20"
                  >
                    <DropdownMenuLabel className="text-white p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-mmp-accent to-mmp-secondary text-white">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm truncate">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-white/70 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />

                    {isVendor && (
                      <>
                        <DropdownMenuItem
                          className="text-white hover:bg-white/10 cursor-pointer py-2"
                          onClick={handleAdminDashboard}
                        >
                          <Shield className="h-4 w-4 text-mmp-secondary mr-2" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/20" />
                      </>
                    )}

                    {userLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <DropdownMenuItem
                          key={link.href}
                          asChild
                          className="text-white hover:bg-white/10 cursor-pointer py-2"
                        >
                          <Link to={link.href} className="flex items-center">
                            <Icon className="h-4 w-4 text-mmp-secondary mr-2" />
                            <span>{link.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}

                    <DropdownMenuSeparator className="bg-white/20" />

                    <DropdownMenuItem
                      className="text-red-400 hover:bg-red-600/10 cursor-pointer py-2"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchExpanded && (
            <div className="md:hidden py-2">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 h-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-lg text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
