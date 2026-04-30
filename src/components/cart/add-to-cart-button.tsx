import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Loader2, 
  Check, 
  Minus, 
  Plus,
  ShoppingBag,
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks';
import type { IVariantOptions } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock?: number;
  };
  quantity?: number;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variantOptions?: IVariantOptions;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  showIcon?: boolean;
  iconOnly?: boolean;
  showQuantitySelector?: boolean;
  disabled?: boolean;
  onAddSuccess?: () => void;
  onAddError?: (error: string) => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  variantOptions,
  className,
  size = 'default',
  variant = 'default',
  showIcon = true,
  iconOnly = false,
  showQuantitySelector = false,
  disabled = false,
  onAddSuccess,
  onAddError,
}) => {
  const { addToCart, getItemQuantity, isLoading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);

  const currentQuantity = getItemQuantity(product._id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock !== undefined && product.stock <= 5;
  const isMaxReached = product.stock !== undefined && currentQuantity >= product.stock;
  const remainingStock = product.stock !== undefined ? product.stock - currentQuantity : 0;
  
  const isDisabled = useMemo(() => 
    disabled || isAdding || isOutOfStock || isMaxReached || cartLoading,
    [disabled, isAdding, isOutOfStock, isMaxReached, cartLoading]
  );

  const handleAddToCart = useCallback(async () => {
    if (isAdding || disabled || isOutOfStock || isMaxReached) return;

    if (product.stock !== undefined) {
      const newTotal = currentQuantity + selectedQuantity;
      if (newTotal > product.stock) {
        onAddError?.(`Only ${remainingStock} left in stock`);
        return;
      }
    }

    setIsAdding(true);
    try {
      const result = await addToCart(
        product._id,
        product.name,
        product.slug,
        product.price,
        product.images[0],
        selectedQuantity,
        variantOptions,
      );

      if (result.success) {
        setShowSuccess(true);
        onAddSuccess?.();
        
        // Reset success state after animation
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } else {
        onAddError?.(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      onAddError?.(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  }, [
    isAdding, disabled, isOutOfStock, isMaxReached, product, 
    currentQuantity, selectedQuantity, remainingStock, 
    onAddError, addToCart, variantOptions, onAddSuccess
  ]);

  const handleQuantityChange = useCallback((delta: number) => {
    setSelectedQuantity(prev => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (product.stock && newQuantity > product.stock - currentQuantity) {
        return product.stock - currentQuantity;
      }
      return newQuantity;
    });
  }, [product.stock, currentQuantity]);

  // Size configurations
  const sizeConfig = {
    sm: { buttonSize: 'sm', iconSize: 'h-3.5 w-3.5', padding: 'px-3' },
    default: { buttonSize: 'default', iconSize: 'h-4 w-4', padding: 'px-4' },
    lg: { buttonSize: 'lg', iconSize: 'h-5 w-5', padding: 'px-6' },
    icon: { buttonSize: 'icon', iconSize: 'h-4 w-4', padding: '' },
  };

  const currentSize = sizeConfig[size];
  const buttonVariant = showSuccess ? 'default' : variant;

  // Premium icon-only button for product cards
  if (iconOnly) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleAddToCart}
              disabled={isDisabled}
              size="icon"
              variant="secondary"
              className={cn(
                "relative group transition-all duration-300 rounded-full",
                "bg-white hover:bg-gradient-to-br hover:from-brand-primary hover:to-brand-primary-hover",
                "shadow-md hover:shadow-xl border border-brand-primary-soft",
                "hover:scale-110 active:scale-95",
                showSuccess && "bg-gradient-to-br from-brand-success to-brand-success/80 hover:from-brand-success/90 hover:to-brand-success",
                isOutOfStock && "opacity-50 cursor-not-allowed hover:scale-100",
                className
              )}
              aria-label={showSuccess ? "Added to cart" : "Add to cart"}
            >
              {/* Ripple effect on click */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-300" />
              </span>
              
              {showSuccess ? (
                <Check className={cn("text-white animate-in zoom-in duration-200", currentSize.iconSize)} />
              ) : isAdding ? (
                <Loader2 className={cn("text-brand-primary animate-spin", currentSize.iconSize)} />
              ) : (
                <ShoppingCart className={cn(
                  "text-brand-muted group-hover:text-white transition-all duration-300",
                  currentSize.iconSize
                )} />
              )}
              
              {/* Success ring animation */}
              {showSuccess && (
                <span className="absolute inset-0 rounded-full animate-ping bg-brand-success/40" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-brand-dark text-white border-0 text-xs">
            <p>{isOutOfStock ? "Out of Stock" : isMaxReached ? "Max reached" : "Add to cart"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Premium standard button with quantity selector
  return (
    <div className="space-y-2">
      {/* Quantity Selector - Premium Design */}
      {showQuantitySelector && !isOutOfStock && !isMaxReached && (
        <div className="flex items-center justify-between gap-2 p-1 bg-brand-surface rounded-lg border border-brand-primary-soft">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={selectedQuantity <= 1}
            className="h-8 w-8 rounded-md hover:bg-brand-primary-soft hover:text-brand-primary transition-all"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          
          <span className="font-semibold text-brand-dark text-sm min-w-[40px] text-center">
            {selectedQuantity}
          </span>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={remainingStock <= selectedQuantity}
            className="h-8 w-8 rounded-md hover:bg-brand-primary-soft hover:text-brand-primary transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Stock Indicator */}
      {isLowStock && !isOutOfStock && !iconOnly && (
        <div className="flex items-center gap-1.5 text-xs text-brand-warning animate-pulse">
          <AlertCircle className="h-3 w-3" />
          <span>Only {remainingStock} left in stock</span>
        </div>
      )}

      {/* Main Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        size={currentSize.buttonSize as any}
        variant={buttonVariant as any}
        className={cn(
          'relative overflow-hidden transition-all duration-300 font-semibold',
          'transform active:scale-95 hover:shadow-lg',
          variant === 'default' && !showSuccess && 
            'bg-gradient-to-r from-brand-primary to-brand-primary-hover hover:from-brand-primary-hover hover:to-brand-primary shadow-md',
          showSuccess && 
            'bg-gradient-to-r from-brand-success to-brand-success/80 hover:from-brand-success/90 hover:to-brand-success shadow-md',
          variant === 'outline' && 
            'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary-soft hover:border-brand-primary-hover',
          variant === 'secondary' && 
            'bg-brand-surface text-brand-dark hover:bg-brand-primary-soft hover:text-brand-primary',
          isOutOfStock && 'opacity-60 cursor-not-allowed hover:opacity-60',
          currentSize.padding,
          className
        )}
        aria-label={showSuccess ? "Added to cart" : "Add to cart"}
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700" />
        </span>

        {/* Button Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {showSuccess ? (
            <>
              <Check className={cn("animate-in zoom-in duration-200", currentSize.iconSize)} />
              <span className="animate-in fade-in duration-200">Added!</span>
            </>
          ) : isAdding ? (
            <>
              <Loader2 className={cn("animate-spin", currentSize.iconSize)} />
              <span>Adding...</span>
            </>
          ) : isOutOfStock ? (
            <>
              <ShoppingBag className={currentSize.iconSize} />
              <span>Out of Stock</span>
            </>
          ) : isMaxReached ? (
            <>
              <Check className={currentSize.iconSize} />
              <span>Max Reached</span>
            </>
          ) : (
            <>
              {showIcon && <ShoppingCart className={currentSize.iconSize} />}
              <span>Add to Cart</span>
            </>
          )}
        </span>

        {/* Progress bar for adding state */}
        {isAdding && (
          <span 
            className="absolute bottom-0 left-0 h-0.5 bg-white/50 transition-all duration-300"
            style={{ width: '100%' }}
          />
        )}
      </Button>

      {/* Current cart quantity indicator */}
      {currentQuantity > 0 && !iconOnly && !isOutOfStock && (
        <div className="text-center text-xs text-brand-muted">
          {currentQuantity} in cart
        </div>
      )}
    </div>
  );
};

// Premium Quick Add Button variant for product cards
interface QuickAddButtonProps extends AddToCartButtonProps {
  showTooltip?: boolean;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  product,
  className,
  showTooltip = true,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative"
            >
              <AddToCartButton
                product={product}
                size="sm"
                variant="secondary"
                className={cn(
                  "transition-all duration-300",
                  isHovered && "bg-brand-primary text-white shadow-md",
                  className
                )}
                {...props}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-brand-dark text-white border-0">
            <p>Quick add to cart</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <AddToCartButton
      product={product}
      size="sm"
      variant="secondary"
      className={className}
      {...props}
    />
  );
};

// Bulk Add Button for multiple products
interface BulkAddButtonProps {
  products: Array<{ id: string; quantity: number }>;
  className?: string;
  onComplete?: () => void;
}

export const BulkAddButton: React.FC<BulkAddButtonProps> = ({
  products,
  className,
  onComplete,
}) => {
  const [isAddingAll, setIsAddingAll] = useState(false);
  const { addToCart } = useCart();

  const handleAddAll = useCallback(async () => {
    setIsAddingAll(true);
    try {
      // Add all products in parallel with Promise.all
      await Promise.all(products.map(product => addToCart(product.id, '', '', 0, '', product.quantity)));
      onComplete?.();
    } catch (error) {
      console.error('Failed to add products:', error);
    } finally {
      setIsAddingAll(false);
    }
  }, [products, addToCart, onComplete]);

  return (
    <Button
      onClick={handleAddAll}
      disabled={isAddingAll || products.length === 0}
      className={cn(
        "bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {isAddingAll ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding All...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add All ({products.length} items)
        </>
      )}
    </Button>
  );
};