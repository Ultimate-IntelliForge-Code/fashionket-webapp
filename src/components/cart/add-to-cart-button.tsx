// Updated AddToCartButton with icon-only option
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks';
import type { IVariantOptions } from '@/types';

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
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
  disabled = false,
  onAddSuccess,
  onAddError,
}) => {
  const { addToCart, getItemQuantity, isLoading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentQuantity = getItemQuantity(product._id);
  const isOutOfStock = product.stock === 0;
  const isMaxReached = product.stock !== undefined && currentQuantity >= product.stock;
  const isDisabled = disabled || isAdding || isOutOfStock || isMaxReached || cartLoading;

  const handleAddToCart = async () => {
    if (isAdding || disabled) return;

    if (product.stock !== undefined) {
      const newTotal = currentQuantity + quantity;
      if (newTotal > product.stock) {
        onAddError?.(`Only ${product.stock - currentQuantity} left in stock`);
        return;
      }
    }

    setIsAdding(true);
    try {
      const result = await addToCart(
        product._id,
        product.name,
        product.price,
        product.images[0],
        quantity,
        variantOptions,
      );

      if (result.success) {
        setShowSuccess(true);
        onAddSuccess?.();
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        onAddError?.(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      onAddError?.(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  // Icon-only button for product cards
  if (iconOnly) {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled || isOutOfStock}
        size="icon"
        variant="secondary"
        className={cn(
          "h-8 w-8 rounded-full bg-white hover:bg-mmp-primary hover:text-white shadow-sm border border-gray-200",
          showSuccess && "bg-green-500 hover:bg-green-600 text-white border-green-500",
          className
        )}
      >
        {showSuccess ? (
          <Check className="h-3.5 w-3.5" />
        ) : isAdding ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ShoppingCart className="h-3.5 w-3.5" />
        )}
      </Button>
    );
  }

  // Standard button
  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      size={size}
      variant={variant}
      className={cn(
        'relative transition-all duration-200',
        variant === 'default' && 'bg-mmp-primary hover:bg-mmp-primary2',
        showSuccess && 'bg-green-600 hover:bg-green-700',
        className,
      )}
    >
      {showSuccess ? (
        <>
          <Check className={cn(showIcon && "mr-1.5", "h-3.5 w-3.5")} />
          {!iconOnly && "Added"}
        </>
      ) : isAdding ? (
        <>
          <Loader2 className={cn(showIcon && "mr-1.5", "h-3.5 w-3.5 animate-spin")} />
          {!iconOnly && "Adding..."}
        </>
      ) : isOutOfStock ? (
        "Out of Stock"
      ) : isMaxReached ? (
        "Max"
      ) : (
        <>
          {showIcon && <ShoppingCart className={cn(!iconOnly && "mr-1.5", "h-3.5 w-3.5")} />}
          {!iconOnly && "Add to Cart"}
        </>
      )}
    </Button>
  );
};