import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useUserGoogleAuth } from '@/api/mutations';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleAuthButtonProps {
  variant?: 'user' | 'admin';
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  variant = 'user',
  disabled = false,
  className,
  size = 'default',
}) => {
  const { isPending } = useUserGoogleAuth();

  const handleGoogleAuth = () => {
    const authUrl = variant === 'admin' 
      ? `${import.meta.env.VITE_API_URL}/auth/admin/google`
      : `${import.meta.env.VITE_API_URL}/auth/user/google`;
    
    // Add loading state before redirect
    window.location.href = authUrl;
  };

  // Size configurations
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    default: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  // Icon size mapping
  const iconSizes = {
    sm: 'h-4 w-4 mr-2',
    default: 'h-5 w-5 mr-2.5',
    lg: 'h-5 w-5 mr-3',
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full relative transition-all duration-300",
        "border-brand-primary-soft bg-white",
        "hover:bg-brand-surface hover:border-brand-primary/30 hover:shadow-md",
        "focus:ring-2 focus:ring-brand-primary/20 focus:outline-none",
        "active:scale-[0.98] active:transition-transform",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
        sizeClasses[size],
        className
      )}
      onClick={handleGoogleAuth}
      disabled={disabled || isPending}
      aria-label={`Continue with Google ${variant === 'admin' ? 'as admin' : ''}`}
    >
      {isPending ? (
        <>
          <Loader2 className={cn("animate-spin text-brand-primary", iconSizes[size])} />
          <span className="text-brand-muted">Redirecting to Google...</span>
        </>
      ) : (
        <>
          <FcGoogle className={iconSizes[size]} />
          <span className="font-medium text-brand-dark">
            Continue with Google
            {variant === 'admin' && (
              <span className="ml-1 text-xs text-brand-muted">(Admin)</span>
            )}
          </span>
        </>
      )}
    </Button>
  );
};