import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Menu, Search, User, X, Settings, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onMenuClick, 
  isMobileMenuOpen 
}) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      console.log('Searching for:', searchQuery);
    }
  }, [searchQuery]);

  const getUserInitials = useCallback(() => {
    if (!user?.fullName) return 'A';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.fullName]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-primary-soft shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-brand-primary-soft rounded-lg h-10 w-10 transition-all duration-200"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-brand-dark" />
            ) : (
              <Menu className="h-5 w-5 text-brand-dark" />
            )}
          </Button>

          {/* Admin Logo - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-sm">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Admin Portal
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:block relative">
            <div className={cn(
              "relative transition-all duration-200",
              isSearchFocused && "scale-[1.02]"
            )}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted transition-colors" />
              <Input
                type="search"
                placeholder="Search admin dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "w-80 pl-10 pr-4 h-10 bg-brand-surface border-brand-primary-soft",
                  "text-brand-dark placeholder:text-brand-muted",
                  "focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20",
                  "rounded-lg text-sm transition-all duration-200"
                )}
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-brand-primary-soft rounded-lg h-10 w-10"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-brand-dark" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-brand-primary-soft rounded-lg h-10 w-10 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-brand-dark" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent"></span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 mt-2 bg-white border-brand-primary-soft shadow-lg rounded-lg">
              <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-brand-dark">Notifications</span>
                <Badge variant="secondary" className="bg-brand-primary-soft text-brand-primary">
                  3 new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-brand-primary-soft" />
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-brand-surface transition-colors cursor-pointer border-b border-brand-primary-soft last:border-0"
                  >
                    <p className="text-sm font-medium text-brand-dark">New order received</p>
                    <p className="text-xs text-brand-muted mt-1">Order #{12345 + i} requires attention</p>
                    <p className="text-xs text-brand-primary mt-2">5 minutes ago</p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="gap-3 hover:bg-brand-primary-soft rounded-lg px-3 h-10 transition-all duration-200"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 ring-2 ring-brand-primary-soft hover:ring-brand-primary/30 transition-all">
                  <AvatarImage src={user?.fullName || "/logo512.png"} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-accent text-white text-xs font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-brand-dark leading-tight">
                    {user?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-brand-muted">System Administrator</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-2 bg-white border-brand-primary-soft shadow-lg rounded-lg">
              <DropdownMenuLabel className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-brand-primary-soft">
                    <AvatarImage src={user?.fullName || "/logo512.png"} />
                    <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-accent text-white font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-brand-dark">{user?.fullName || 'Admin User'}</p>
                    <p className="text-xs text-brand-muted">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-brand-primary-soft" />
              <DropdownMenuItem className="text-brand-dark hover:bg-brand-primary-soft cursor-pointer py-2.5 px-4 transition-colors">
                <User className="mr-3 h-4 w-4 text-brand-muted" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-brand-dark hover:bg-brand-primary-soft cursor-pointer py-2.5 px-4 transition-colors">
                <Settings className="mr-3 h-4 w-4 text-brand-muted" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-brand-primary-soft" />
              <DropdownMenuItem 
                onClick={logout} 
                className="text-brand-error hover:bg-brand-error/10 cursor-pointer py-2.5 px-4 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      <div className="lg:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <Input
            type="search"
            placeholder="Search admin dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-10 bg-brand-surface border-brand-primary-soft text-brand-dark placeholder:text-brand-muted focus:bg-white focus:border-brand-primary rounded-lg text-sm"
          />
        </form>
      </div>
    </header>
  );
};