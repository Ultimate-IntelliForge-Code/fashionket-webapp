import React from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks";
import { Button } from "../ui/button";

interface CartIconProps {
  showCount?: boolean;
}

export const CartIcon: React.FC<CartIconProps> = ({ showCount = true }) => {
  const { itemCount, isLoading } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-mmp-primary/20 relative group"
      aria-label="Notifications"
      asChild
    >
      <Link to="/cart">
        <div>
          {!isLoading && (
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-mmp-primary/30 to-mmp-accent/20 group-hover:from-mmp-accent/30 group-hover:to-mmp-secondary/20 transition-all">
              <ShoppingBag className="h-5 w-5 text-mmp-neutral" />
            </div>
          )}

          {showCount && itemCount > 0 && !isLoading && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-mmp-accent text-[8px] font-bold text-white items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </span>
          )}

          {isLoading && showCount && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-mmp-neutral border-t-transparent" />
          )}
        </div>
      </Link>
    </Button>
  );
};
