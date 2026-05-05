import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  ShoppingCart,
  Package,
  Shield,
  Truck,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/use-cart";
import { TAX_PERCENT } from "@/config/env.config";
import { CartItem, CartSummary } from "@/components/cart";

export const Route = createFileRoute("/(root)/_rootLayout/cart/")({
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    itemCount,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    isEmpty,
  } = useCart();

  const tax = subtotal * TAX_PERCENT;
  const total = subtotal + tax;

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
    itemId?: string,
  ) => {
    if (newQuantity < 1) {
      await removeFromCart(productId, itemId);
    } else {
      await updateCartItem(productId, newQuantity, itemId!);
    }
  };

  const handleRemoveItem = async (
    productId: string,
    itemId?: string,
  ) => {
    await removeFromCart(productId, itemId);
  };

  const handleClearCart = () => {
    toast.warn(
      <div className="space-y-3">
        <p className="text-sm text-brand-dark">Clear all items in cart?</p>
        <p className="text-xs text-brand-muted">
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              try {
                await clearCart();
                toast.dismiss();
                toast.success("Cart cleared successfully");
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Something went wrong",
                );
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );
  };

  // const handleApplyCoupon = async () => {
  //   if (!couponCode.trim()) {
  //     toast.error("Please enter a coupon code");
  //     return;
  //   }

  //   setIsApplyingCoupon(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     toast.success("Coupon applied successfully!");
  //     setCouponCode("");
  //   } catch (error) {
  //     toast.error("Invalid coupon code");
  //   } finally {
  //     setIsApplyingCoupon(false);
  //   }
  // };

  const handleProceedToCheckout = () => {
    if (isEmpty) {
      toast.error("Your cart is empty");
      return;
    }
    navigate({ to: "/checkout" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-surface py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary-soft border-t-brand-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-brand-surface py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-primary-soft mb-6">
              <ShoppingCart className="h-12 w-12 text-brand-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Your cart is empty
            </h1>
            <p className="text-brand-muted mb-8">
              Looks like you haven't added any items to your cart yet. Start
              shopping to add products.
            </p>
            <Button
              asChild
              className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300"
              size="lg"
            >
              <Link to="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-3 text-white/90 hover:text-white hover:bg-white/20 rounded-lg h-8 px-2 -ml-2"
                asChild
              >
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Shopping Cart
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white text-base sm:text-lg px-4 py-2 w-fit border-0">
              {formatCurrency(total)}
            </Badge>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-brand-surface"
            preserveAspectRatio="none"
            viewBox="0 0 1440 120"
          >
            <path
              fill="currentColor"
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-brand-dark">
                Cart Items ({itemCount})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-brand-error hover:text-brand-error hover:bg-brand-error/10 h-8 px-3 text-sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  showImage={true}
                  showQuantityControls={true}
                  showRemoveButton={true}
                  onQuantityChange={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg border border-brand-primary-soft p-3 text-center transition-all hover:shadow-md">
                <Shield className="h-6 w-6 text-brand-success mx-auto mb-1" />
                <div className="text-xs font-semibold text-brand-dark">
                  Secure Payment
                </div>
                <div className="text-[10px] text-brand-muted">
                  SSL Encryption
                </div>
              </div>
              <div className="bg-white rounded-lg border border-brand-primary-soft p-3 text-center transition-all hover:shadow-md">
                <Truck className="h-6 w-6 text-brand-primary mx-auto mb-1" />
                <div className="text-xs font-semibold text-brand-dark">
                  Free Shipping
                </div>
                <div className="text-[10px] text-brand-muted">Over ₦50,000</div>
              </div>
              <div className="bg-white rounded-lg border border-brand-primary-soft p-3 text-center transition-all hover:shadow-md">
                <Package className="h-6 w-6 text-brand-accent mx-auto mb-1" />
                <div className="text-xs font-semibold text-brand-dark">
                  Easy Returns
                </div>
                <div className="text-[10px] text-brand-muted">
                  14-Day Policy
                </div>
              </div>
              <div className="bg-white rounded-lg border border-brand-primary-soft p-3 text-center transition-all hover:shadow-md">
                <CreditCard className="h-6 w-6 text-brand-warning mx-auto mb-1" />
                <div className="text-xs font-semibold text-brand-dark">
                  Multiple Payments
                </div>
                <div className="text-[10px] text-brand-muted">
                  Paystack Secure
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <CartSummary onCheckout={handleProceedToCheckout} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
