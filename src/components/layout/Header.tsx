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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks";
import { CartIcon } from "../cart";
import { useLogout } from "@/api/queries";

// Navigation links configuration
const navLinks = [
  { href: "/", title: "Home", icon: Home },
  { href: "/categories", title: "Categories", icon: Tag },
  { href: "/products", title: "Products", icon: Package },
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
      {/* Premium Announcement Bar */}
      <div className="bg-gradient-to-r from-mmp-primary to-mmp-accent text-white py-2 px-4 overflow-hidden relative">
        <div className="container mx-auto flex justify-center items-center">
          <div className="flex items-center gap-2 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-sm font-medium tracking-wide">
              ✨ Exclusive Launch: New Collection Live Now
            </span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex ml-4 text-xs h-6 px-2 bg-white/20 hover:bg-white/30"
            asChild
          >
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>

        {/* Animated border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
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
                    <Menu className="h-5 w-5 text-mmp-neutral" />
                  </Button>
                </SheetTrigger>

                {/* Mobile Navigation - Slide from left */}
                <SheetContent
                  side="left"
                  className="w-[85vw] max-w-sm p-0 bg-mmp-primary2 border-r border-mmp-primary/30 text-white"
                >
                  <SheetHeader className="p-4 sm:p-5 border-b border-mmp-primary/30">
                    <SheetTitle className="text-center">
                      <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center"
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
                    {/* Admin Section */}
                    {isVendor && (
                      <>
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-xs font-semibold text-mmp-secondary/80 uppercase tracking-wider mb-2 px-2">
                            Admin Panel
                          </h3>
                          <nav className="space-y-1">
                            {adminLinks.map((link) => {
                              const Icon = link.icon;
                              return (
                                <Link
                                  key={link.href}
                                  to={link.href}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-mmp-primary/10 transition-colors"
                                >
                                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-mmp-secondary" />
                                  <span className="text-mmp-neutral text-sm sm:text-base">
                                    {link.title}
                                  </span>
                                </Link>
                              );
                            })}
                          </nav>
                        </div>
                        <Separator className="my-3 sm:my-4 bg-mmp-primary/30" />
                      </>
                    )}

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
                            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all group ${
                              active
                                ? "bg-gradient-to-r from-mmp-primary/30 to-mmp-accent/20 border-l-4 border-mmp-secondary"
                                : "hover:bg-mmp-primary/10"
                            }`}
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div
                                className={`p-1.5 sm:p-2 rounded-lg ${
                                  active
                                    ? "bg-mmp-secondary text-white"
                                    : "bg-mmp-primary/20 text-mmp-neutral"
                                }`}
                              >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              </div>
                              <span
                                className={`font-medium text-sm sm:text-base ${
                                  active
                                    ? "text-mmp-secondary"
                                    : "text-mmp-neutral"
                                }`}
                              >
                                {link.title}
                              </span>
                            </div>
                            <ChevronRight
                              className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 ${
                                active
                                  ? "text-mmp-secondary"
                                  : "text-mmp-neutral/60"
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </nav>

                    {/* User Links for authenticated users */}
                    {isAuthenticated && (
                      <>
                        <Separator className="my-4 sm:my-6 bg-mmp-primary/30" />
                        <nav className="space-y-1">
                          {userLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                              <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg transition-colors ${
                                  active
                                    ? "bg-mmp-primary/20 text-mmp-secondary"
                                    : "hover:bg-mmp-primary/10 text-mmp-neutral"
                                }`}
                              >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">
                                  {link.title}
                                </span>
                              </Link>
                            );
                          })}
                        </nav>
                      </>
                    )}

                    {/* User Info Section */}
                    {isAuthenticated ? (
                      <div className="flex gap-2 items-center mb-4 sm:mb-6">
                        <Link
                          to="/account"
                          onClick={() => setIsSidebarOpen(false)}
                          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-mmp-primary/10 rounded-xl flex-1"
                        >
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-white/20">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-mmp-accent to-mmp-secondary text-white text-sm sm:text-base">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-mmp-neutral text-sm sm:text-base truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs sm:text-sm text-mmp-secondary truncate">
                              {user?.email}
                            </p>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="bg-red-600/20 hover:bg-red-600/30 h-9 w-9 sm:h-10 sm:w-10"
                        >
                          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <Button
                          variant="outline"
                          className="border-mmp-primary/30 hover:bg-mmp-primary/10 h-10 sm:h-11 text-xs sm:text-sm"
                          asChild
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-mmp-accent to-mmp-secondary hover:opacity-90 h-10 sm:h-11 text-xs sm:text-sm"
                          asChild
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Link to="/signup">Register</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/logo.png"
                  alt="FashionKet Logo"
                  className="h-7 sm:h-8 md:h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative px-3 xl:px-5 py-2 rounded-lg font-medium transition-all duration-200 text-sm xl:text-base ${
                        active
                          ? "text-mmp-secondary"
                          : "text-mmp-neutral/80 hover:text-mmp-secondary"
                      }`}
                    >
                      {link.title}
                      {active && (
                        <>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-mmp-accent to-mmp-secondary rounded-full" />
                          <span className="absolute -top-1 -right-1">
                            <div className="relative">
                              <div className="absolute animate-ping h-1.5 w-1.5 rounded-full bg-mmp-secondary/40" />
                              <div className="relative h-1.5 w-1.5 rounded-full bg-mmp-secondary" />
                            </div>
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
              {/* Search - Mobile Expandable */}
              {isSearchExpanded ? (
                <div className="absolute inset-x-0 top-0 z-30 h-14 sm:h-16 bg-mmp-primary2/95 backdrop-blur-md px-3 sm:px-4 flex items-center md:relative md:inset-auto md:h-auto md:bg-transparent md:backdrop-blur-none">
                  <div className="flex-1 relative max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-20 h-10 sm:h-11 bg-mmp-primary/20 border-mmp-primary/40 focus:border-mmp-secondary focus:ring-mmp-secondary/20 rounded-lg text-sm text-mmp-neutral placeholder:text-mmp-neutral/60"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mmp-secondary" />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-mmp-neutral/60 hover:text-mmp-neutral h-7 px-2 text-xs"
                          onClick={() => setIsSearchExpanded(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="h-7 bg-gradient-to-r from-mmp-accent to-mmp-secondary hover:opacity-90 text-xs px-3"
                          size="sm"
                        >
                          Go
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Search */}
                  <div className="hidden md:flex items-center relative">
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[140px] lg:w-[180px] xl:w-[220px] pl-9 pr-3 h-9 lg:h-10 bg-mmp-primary/20 border-mmp-primary/40 focus:border-mmp-secondary focus:ring-mmp-secondary/20 rounded-lg text-sm text-mmp-neutral placeholder:text-mmp-neutral/60"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-mmp-secondary" />
                    </form>
                  </div>

                  {/* Mobile Search Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-mmp-primary/20 h-9 w-9"
                    aria-label="Search"
                    onClick={() => setIsSearchExpanded(true)}
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-mmp-neutral" />
                  </Button>
                </>
              )}

              {/* Shopping Cart */}
              <CartIcon showCount={true} />

              {/* Notifications (for authenticated users) */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-mmp-primary/20 relative h-9 w-9"
                      aria-label="Notifications"
                    >
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-mmp-primary/30 to-mmp-accent/20">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-mmp-neutral" />
                      </div>
                      <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] h-4 w-4 min-w-0 p-0 flex items-center justify-center border-2 border-mmp-primary2 rounded-full">
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 sm:w-72 bg-mmp-primary2 border-mmp-primary/30"
                  >
                    <DropdownMenuLabel className="text-mmp-neutral text-sm p-3">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-mmp-primary/30" />
                    <div className="p-2 sm:p-3">
                      <div className="space-y-2">
                        <div className="p-2 sm:p-3 rounded-lg bg-mmp-primary/10">
                          <p className="text-xs sm:text-sm font-medium text-mmp-neutral">
                            Order Shipped
                          </p>
                          <p className="text-[10px] sm:text-xs text-mmp-neutral/60">
                            Your order #12345 has been shipped
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* User Account / Auth Buttons */}
              {!isAuthenticated ? (
                <div className="hidden lg:flex gap-2 ml-2">
                  <Button
                    variant="outline"
                    className="px-3 xl:px-4 border-mmp-primary/30 hover:bg-mmp-primary/10 h-9 text-xs xl:text-sm"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="px-3 xl:px-4 bg-gradient-to-r from-mmp-accent to-mmp-secondary hover:opacity-90 h-9 text-xs xl:text-sm"
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
                      className="hover:bg-mmp-primary/20 px-2 sm:px-3 rounded-full h-9"
                      aria-label="User account"
                    >
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mr-1 sm:mr-2">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-mmp-accent to-mmp-secondary text-white text-xs sm:text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline text-mmp-neutral font-medium text-sm truncate max-w-[80px] xl:max-w-[120px]">
                        {getUserDisplayName()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 sm:w-64 bg-mmp-primary2 border-mmp-primary/30"
                  >
                    <DropdownMenuLabel className="text-mmp-neutral p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-mmp-accent to-mmp-secondary text-white text-xs sm:text-sm">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            {user?.fullName}
                          </p>
                          <p className="text-[10px] sm:text-xs text-mmp-neutral/60 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-mmp-primary/30" />

                    {/* Admin Quick Access */}
                    {isVendor && (
                      <>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="text-mmp-neutral hover:bg-mmp-primary/20 focus:bg-mmp-primary/20 cursor-pointer py-2 text-xs sm:text-sm"
                            onClick={handleAdminDashboard}
                          >
                            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mmp-secondary mr-2" />
                            <span>Admin Dashboard</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-mmp-primary/30" />
                      </>
                    )}

                    {/* User Links */}
                    <DropdownMenuGroup>
                      {userLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <DropdownMenuItem
                            key={link.href}
                            asChild
                            className="text-mmp-neutral hover:bg-mmp-primary/20 focus:bg-mmp-primary/20 cursor-pointer py-2 text-xs sm:text-sm"
                          >
                            <Link
                              to={link.href}
                              className="flex items-center gap-2"
                            >
                              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mmp-secondary" />
                              <span>{link.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-mmp-primary/30" />

                    <DropdownMenuItem
                      className="text-red-400 hover:bg-red-600/10 focus:bg-red-600/10 cursor-pointer py-2 text-xs sm:text-sm"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
