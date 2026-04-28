import { useState, useEffect } from "react";
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
  { href: "/wishlist", title: "Wishlist", icon: Heart },
  { href: "/settings", title: "Settings", icon: Settings },
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
      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-mmp-primary"
            : "bg-white border-b border-mmp-primary2/10"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-3 lg:gap-8">
              {/* Mobile Menu Button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden hover:bg-mmp-primary transition-all duration-300 rounded-xl h-10 w-10"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5 text-mmp-secondary" />
                  </Button>
                </SheetTrigger>

                {/* Mobile Navigation - Slide from left */}
                <SheetContent
                  side="left"
                  className="w-[85vw] max-w-sm p-0 bg-mmp-primary2 border-r border-mmp-primary"
                >
                  <SheetHeader className="p-2 border-b border-mmp-primary bg-white backdrop-blur-sm">
                    <SheetTitle className="text-center">
                      <Link
                        to="/"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-start justify-start group"
                      >
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src="/logo.png"
                          alt="FashionKet Logo"
                          className="h-auto w-[200px] group-hover:animate-pulse transition-all duration-300"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="overflow-y-auto h-[calc(100vh-80px)] p-6">
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex flex-col space-y-6">
                        {/* Navigation Links */}
                        <nav className="space-y-2">
                          {navLinks.map((link, index) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                              <motion.div
                                key={link.href}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  to={link.href}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                                    active
                                      ? "bg-mmp-secondary/50 border-l-4 border-mmp-primary shadow-md"
                                      : "hover:bg-mmp-primary2/10"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg transition-all duration-300 ${
                                        active
                                          ? "bg-mmp-primary text-white shadow-md"
                                          : "text-mmp-secondary group-hover:bg-mmp-primary2/30"
                                      }`}
                                    >
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <span
                                      className={`font-medium ${
                                        active
                                          ? "text-white font-semibold"
                                          : "text-mmp-secondary/80"
                                      }`}
                                    >
                                      {link.title}
                                    </span>
                                  </div>
                                  <ChevronRight
                                    className={`h-4 w-4 transition-all duration-300 group-hover:translate-x-1 ${
                                      active
                                        ? "text-mmp-primary"
                                        : "text-mmp-secondary/40"
                                    }`}
                                  />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </nav>

                        {/* User Links */}
                        {isAuthenticated && (
                          <>
                            <Separator className="bg-mmp-primary" />
                            <nav className="space-y-2">
                              {userLinks.map((link, index) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                  <motion.div
                                    key={link.href}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: (index + 4) * 0.05 }}
                                  >
                                    <Link
                                      to={link.href}
                                      onClick={() => setIsSidebarOpen(false)}
                                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        active
                                          ? "bg-gradient-to-r from-mmp-primary/10 to-mmp-primary text-mmp-secondary font-semibold"
                                          : "text-mmp-secondary/80 hover:bg-mmp-primary2/10"
                                      }`}
                                    >
                                      <Icon className="h-5 w-5" />
                                      <span>{link.title}</span>
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </nav>
                          </>
                        )}
                      </div>

                      {/* User Info Section */}
                      {isAuthenticated ? (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex gap-3 mt-8"
                        >
                          <Link
                            to="/account"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-mmp-primary/10 to-mmp-primary rounded-xl flex-1 group transition-all duration-300 hover:shadow-md"
                          >
                            <Avatar className="h-12 w-12 ring-2 ring-mmp-primary/30 group-hover:ring-mmp-primary/50 transition-all">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-mmp-primary to-mmp-secondary text-white text-sm font-bold">
                                {getUserInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-mmp-secondary truncate">
                                {getUserDisplayName()}
                              </p>
                              <p className="text-xs text-mmp-secondary/60 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 rounded-xl h-12 w-12"
                          >
                            <LogOut className="h-5 w-5 text-red-600" />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="grid grid-cols-2 gap-3 mt-8"
                        >
                          <Button
                            variant="outline"
                            className="border-mmp-secondary text-mmp-secondary hover:bg-mmp-primary/10 transition-all duration-300 h-11 rounded-xl"
                            asChild
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Link to="/login">Login</Link>
                          </Button>
                          <Button
                            className="bg-mmp-primary text-white hover:shadow-lg transition-all duration-300 h-11 rounded-xl"
                            asChild
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <Link to="/signup">Register</Link>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/" className="flex items-center group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src="/logo.png"
                  alt="FashionKet Logo"
                  className="h-8 sm:h-10 lg:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center gap-2">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative px-5 py-2.5 font-medium rounded-t-lg transition-all duration-300 text-sm ${
                        active
                          ? "text-mmp-primary "
                          : "text-mmp-secondary hover:text-mmp-primary"
                      }`}
                    >
                      {link.title}
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-mmp-primary rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-mmp-primary transition-all duration-300 rounded-xl h-10 w-10"
                aria-label="Search"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <Search className="h-5 w-5 text-mmp-secondary" />
              </Button>

              {/* Desktop Search */}
              <div className="hidden lg:block relative">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-64 xl:w-80 pl-11 pr-4 h-11 bg-mmp-primary2/5 border-mmp-primary text-mmp-primary placeholder:text-mmp-secondary/50  focus-visible:ring-mmp-primary/5 rounded-xl text-sm focus:bg-white focus:border-mmp-primary/30 transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mmp-secondary/50" />
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
                      className="hover:bg-mmp-primary transition-all duration-300 rounded-xl relative h-10 w-10"
                    >
                      <Bell className="h-5 w-5 text-mmp-secondary" />
                      <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mmp-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-mmp-primary text-[10px] font-bold text-white items-center justify-center">
                          3
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80 mt-2 bg-white border-mmp-primary shadow-xl rounded-xl"
                  >
                    <DropdownMenuLabel className="text-mmp-secondary font-semibold px-4 py-3">
                      Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-mmp-primary" />
                    <div className="p-2 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-mmp-primary2/5 hover:bg-mmp-primary2/10 transition-all duration-300 cursor-pointer"
                        >
                          <p className="text-sm font-medium text-mmp-secondary">
                            Order Shipped
                          </p>
                          <p className="text-xs text-mmp-secondary/60 mt-1">
                            Your order #{12345 + i} has been shipped
                          </p>
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="hidden lg:flex gap-3 ml-2">
                  <Button
                    variant="ghost"
                    className="border border-mmp-primary text-mmp-secondary hover:bg-mmp-primary/10 transition-all duration-300 h-11 px-6 rounded-xl text-sm font-medium"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="bg-mmp-primary text-white hover:shadow-lg transition-all duration-300 h-11 px-6 rounded-xl text-sm font-medium"
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
                      className="hover:bg-mmp-primary transition-all duration-300 rounded-full h-11 px-2"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-mmp-primary/30 hover:ring-mmp-primary/50 transition-all">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-mmp-primary to-mmp-secondary text-white text-xs font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden xl:inline ml-2 text-mmp-secondary font-semibold text-sm max-w-[100px] truncate">
                        {getUserDisplayName()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 mt-2 bg-white border-mmp-primary shadow-xl rounded-xl"
                  >
                    <DropdownMenuLabel className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-mmp-primary/30">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-mmp-primary to-mmp-secondary text-white font-bold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-mmp-secondary truncate">
                            {user?.fullName}
                          </p>
                          <p className="text-xs text-mmp-secondary/60 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-mmp-primary" />

                    {isVendor && (
                      <>
                        <DropdownMenuItem
                          className="text-mmp-secondary hover:bg-mmp-primary2/10 cursor-pointer py-3 px-4 transition-all duration-300"
                          onClick={handleAdminDashboard}
                        >
                          <Shield className="h-4 w-4 text-mmp-primary mr-3" />
                          <span>Vendor Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-mmp-primary" />
                      </>
                    )}

                    {userLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <DropdownMenuItem
                          key={link.href}
                          asChild
                          className="text-mmp-secondary hover:bg-mmp-primary2/10 cursor-pointer py-3 px-4 transition-all duration-300"
                        >
                          <Link to={link.href} className="flex items-center">
                            <Icon className="h-4 w-4 text-mmp-secondary/60 mr-3" />
                            <span>{link.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}

                    <DropdownMenuSeparator className="bg-mmp-primary" />

                    <DropdownMenuItem
                      className="text-red-600 hover:bg-red-50 cursor-pointer py-3 px-4 transition-all duration-300"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden py-3"
              >
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-11 pr-4 h-11 bg-mmp-primary2/5 border-mmp-primary text-mmp-secondary placeholder:text-mmp-secondary/50 rounded-xl text-sm focus:bg-white focus:border-mmp-primary/30 transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mmp-secondary/50" />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
