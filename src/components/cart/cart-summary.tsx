import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBag, 
  Loader2, 
  Truck, 
  Shield, 
  Clock,
  ChevronRight,
  Sparkles 
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks';
import { useNavigate } from '@tanstack/react-router';
import { TAX_PERCENT } from '@/config/env.config';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  className,
  onCheckout,
}) => {
  const navigate = useNavigate();
  const { subtotal, itemCount, isEmpty, isLoading } = useCart();
  // Tax and shipping calculations
  const tax = subtotal * TAX_PERCENT;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate({ to: '/checkout' });
    }
  };

  if (isEmpty && !isLoading) {
    return (
      <div className={cn('rounded-2xl border border-brand-primary-soft bg-white p-8 shadow-sm', className)}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary-soft">
            <ShoppingBag className="h-10 w-10 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold text-brand-dark mb-2">
            Your cart is empty
          </h3>
          <p className="text-sm text-brand-muted mb-6">
            Looks like you haven't added any items yet
          </p>
          <Button
            onClick={() => navigate({ to: '/products' })}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover"
          >
            Start Shopping
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border border-brand-primary-soft bg-white shadow-sm', className)}>
      {/* Header */}
      <div className="p-6 border-b border-brand-primary-soft">
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-primary" />
          Order Summary
        </h2>
        <p className="text-sm text-brand-muted mt-1">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-muted">Subtotal</span>
          <span className="font-semibold text-brand-dark">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
            ) : (
              formatCurrency(subtotal)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-muted" />
            <span className="text-brand-muted">Tax ({(TAX_PERCENT * 100)}%)</span>
          </div>
          <span className="font-semibold text-brand-dark">
            {isLoading ? '-' : formatCurrency(tax)}
          </span>
        </div>

        <Separator className="bg-brand-primary-soft" />

        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-bold text-brand-dark">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-brand-primary">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin inline" />
              ) : (
                formatCurrency(total)
              )}
            </span>
            <p className="text-xs text-brand-muted mt-0.5">
              Including tax and shipping
            </p>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {/* {subtotal > 0 && subtotal < shippingThreshold && (
          <div className="mt-4 rounded-xl bg-brand-primary-soft/30 p-4 border border-brand-primary-soft">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Truck className="h-5 w-5 text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-dark mb-2">
                  Add <span className="font-bold text-brand-primary">{formatCurrency(amountToFreeShipping)}</span> more to get free shipping!
                </p>
                <div className="h-2 bg-brand-primary-soft rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
                    style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-brand-muted mt-2">
                  {Math.round((subtotal / shippingThreshold) * 100)}% towards free shipping
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Delivery Estimate */}
        {!isEmpty && !isLoading && (
          <div className="flex items-center gap-2 text-xs text-brand-muted pt-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Estimated delivery: 2-4 business days</span>
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <Button
            className="mt-6 w-full h-12 text-base font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300"
            size="lg"
            onClick={handleCheckout}
            disabled={isEmpty || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        )}

        {/* Continue Shopping Link */}
        <button
          className="mt-2 w-full text-center text-sm text-brand-muted hover:text-brand-primary transition-colors py-2"
          onClick={() => navigate({ to: '/products' })}
        >
          ← Continue Shopping
        </button>

        {/* Secure Checkout Note */}
        <div className="mt-4 pt-4 border-t border-brand-primary-soft text-center">
          <p className="text-xs text-brand-muted flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Secure checkout powered by FashionKet
          </p>
        </div>
      </div>
    </div>
  );
};