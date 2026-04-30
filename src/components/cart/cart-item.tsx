import React from 'react';
import { Minus, Plus, Trash2, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks';

interface CartItemProps {
  item: {
    _id?: string;
    productId: string;
    nameSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    productImage?: string;
    variantOptions?: {
      size?: string;
      color?: string;
      [key: string]: any;
    };
  };
  showImage?: boolean;
  showQuantityControls?: boolean;
  showRemoveButton?: boolean;
  className?: string;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string, itemId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  showImage = true,
  showQuantityControls = true,
  showRemoveButton = true,
  className,
  onQuantityChange,
  onRemove,
}) => {
  const { updateCartItem, removeFromCart, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Auto-hide success message
  React.useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) {
      setError('Maximum 99 items per product');
      return;
    }
    
    setError(null);
    setIsUpdating(true);
    
    try {
      await updateCartItem(item.productId, newQuantity, item._id!);
      onQuantityChange?.(item.productId, newQuantity);
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error('Failed to update quantity:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setError(null);
    setIsUpdating(true);
    
    try {
      await removeFromCart(item.productId, item._id!);
      onRemove?.(item.productId, item._id!);
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error('Failed to remove item:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const subtotal = item.priceSnapshot * item.quantity;

  return (
    <div
      className={cn(
        'group relative bg-white rounded-xl border border-brand-primary-soft',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:border-brand-primary/30 hover:-translate-y-0.5',
        isUpdating && 'opacity-60 pointer-events-none',
        className,
      )}
      role="listitem"
      aria-label={`Cart item: ${item.nameSnapshot}`}
    >
      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="bg-brand-success text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            Quantity updated
          </div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="bg-brand-error text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 p-4 sm:p-5">
        {/* Product Image */}
        {showImage && (
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden bg-brand-surface shadow-sm">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.nameSnapshot}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                    const fallback = document.createElement('div');
                    fallback.className = 'flex flex-col items-center justify-center gap-1';
                    fallback.innerHTML = '<div class="text-3xl">📦</div><span class="text-[10px] text-brand-muted">No image</span>';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-brand-surface to-brand-primary-soft">
                  <ShoppingBag className="h-8 w-8 text-brand-primary/40" />
                  <span className="text-[10px] font-medium text-brand-muted">No image</span>
                </div>
              )}
            </div>
            
            {/* Quantity Badge for mobile view */}
            {!showQuantityControls && (
              <div className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                {item.quantity}
              </div>
            )}
          </div>
        )}

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="space-y-2 sm:space-y-2.5">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand-dark text-base sm:text-lg line-clamp-2 group-hover:text-brand-primary transition-colors duration-200">
                  {item.nameSnapshot}
                </h3>
                
                {/* Unit Price */}
                <p className="text-sm text-brand-muted mt-1">
                  {formatCurrency(item.priceSnapshot)} each
                </p>
              </div>
              
              {/* Desktop Subtotal */}
              {!showQuantityControls && (
                <div className="text-right shrink-0">
                  <p className="text-xs text-brand-muted font-medium">Total</p>
                  <p className="font-bold text-brand-primary text-lg">
                    {formatCurrency(subtotal)}
                  </p>
                </div>
              )}
            </div>

            {/* Variant Options */}
            {item.variantOptions && (
              <div className="flex flex-wrap gap-2">
                {item.variantOptions.size && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary-soft">
                    <span className="text-xs text-brand-muted">Size:</span>
                    <span className="text-xs font-semibold text-brand-dark">{item.variantOptions.size}</span>
                  </div>
                )}
                {item.variantOptions.color && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary-soft">
                    <span className="text-xs text-brand-muted">Color:</span>
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="h-3 w-3 rounded-full ring-1 ring-brand-primary-soft"
                        style={{ backgroundColor: item.variantOptions.color.toLowerCase() }}
                      />
                      <span className="text-xs font-semibold text-brand-dark">{item.variantOptions.color}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Controls & Actions */}
            {showQuantityControls && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center rounded-lg border border-brand-primary-soft bg-white shadow-sm overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none hover:bg-brand-primary-soft hover:text-brand-primary transition-all duration-200"
                      onClick={() => handleQuantityChange(item.quantity - 1)}
                      disabled={isUpdating || isLoading || item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <div className="flex h-10 min-w-[52px] items-center justify-center px-2 text-sm font-semibold text-brand-dark bg-white">
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-primary" />
                      ) : (
                        item.quantity
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none hover:bg-brand-primary-soft hover:text-brand-primary transition-all duration-200"
                      onClick={() => handleQuantityChange(item.quantity + 1)}
                      disabled={isUpdating || isLoading || item.quantity >= 99}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  {showRemoveButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand-muted hover:text-brand-error hover:bg-brand-error/10 transition-all duration-200 gap-1.5 h-10 px-3"
                      onClick={handleRemove}
                      disabled={isUpdating || isLoading}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm">Remove</span>
                    </Button>
                  )}
                </div>

                {/* Subtotal */}
                <div className="text-right sm:text-left">
                  <p className="text-xs text-brand-muted font-medium">Subtotal</p>
                  <p className="font-bold text-brand-primary text-lg">
                    {formatCurrency(subtotal)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
          <div className="bg-white rounded-full shadow-lg p-2">
            <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

// Add animation wrapper component for smoother transitions
import { motion, AnimatePresence } from 'framer-motion';

// Wrapper component for list animations
export const CartItemWrapper: React.FC<{
  children: React.ReactNode;
  index: number;
}> = ({ children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};