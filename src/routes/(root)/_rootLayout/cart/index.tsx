import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Package,
  Shield,
  Truck,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/(root)/_rootLayout/cart/")({
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    itkwems,
    subtotal,
    itemCount,
    isLoading,
    updateCartItem,
    removeFromCart,
    clearCart,
    isEmpty,
  } = useCart();

  const [couponCode, setCouponCode] = React.useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);
  const shippingFee = itemCount > 0 ? 1500 : 0; // Fixed shipping fee
  const tax = subtotal * 0.025; // 2.5% VAT
  const total = subtotal + shippingFee + tax;

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
    itemId?: string,
  ) => {
    if (newQuantity < 1) {
      await removeFromCart(productId, itemId, "Item");
    } else {
      await updateCartItem(productId, newQuantity, itemId!);
    }
  };

  const handleRemoveItem = async (
    productId: string,
    productName: string,
    itemId?: string,
  ) => {
    await removeFromCart(productId, itemId, productName);
  };

  const handleClearCart = () => {
    toast.warn(
      <div className="space-y-3">
        <p className="text-sm text-gray-800">Clear all items in cart</p>

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
                toast.success("Action completed successfully");
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Something went wrong",
                );
              } finally {
              }
            }}
          >
            Confrim
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // TODO: Implement coupon validation API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    } catch (error) {
      toast.error("Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (isEmpty) {
      toast.error("Your cart is empty");
      return;
    }
    navigate({ to: "/checkout" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mmp-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-graysubtotal-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-mmp-primary/10 mb-6">
              <ShoppingCart className="h-12 w-12 text-mmp-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to add products.
            </p>
            <Button
              asChild
              className="bg-mmp-primary hover:bg-mmp-primary2"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-mmp-primary to-mmp-primary2">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 sm:mb-3 text-white/90 hover:text-white hover:bg-white/20 h-7 sm:h-8 text-xs sm:text-sm -ml-2 sm:ml-0"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Shopping Cart
              </h1>
              <p className="text-white/80 text-xs sm:text-sm">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Badge className="bg-white text-mmp-primary text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 w-fit">
              {formatCurrency(total)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            {/* Cart Header */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Cart Items ({itemCount})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <Trash2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Clear Cart
              </Button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${JSON.stringify(item.variantOptions)}`}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="xs:w-20 xs:h-20 sm:w-24 sm:h-24 w-full h-32 xs:h-auto">
                      <Link
                        to="/products/$slug"
                        params={{ slug: "product-slug" }} // You'll need to map productId to slug
                        className="block h-full"
                      >
                        <div className="w-full h-full rounded-md sm:rounded-lg bg-gray-100 overflow-hidden">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.nameSnapshot}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                        <div className="flex-1">
                          <Link
                            to="/products/$slug"
                            params={{ slug: "product-slug" }}
                            className="block"
                          >
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-mmp-primary line-clamp-2">
                              {item.nameSnapshot}
                            </h3>
                          </Link>

                          {/* Variant Options */}
                          {item.variantOptions && (
                            <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                              {item.variantOptions.sizes && (
                                <div className="text-xs sm:text-sm text-gray-600">
                                  Size:{" "}
                                  <span className="font-medium">
                                    {item.variantOptions.sizes}
                                  </span>
                                </div>
                              )}
                              {item.variantOptions.colors && (
                                <div className="text-xs sm:text-sm text-gray-600">
                                  Color:{" "}
                                  <span className="font-medium">
                                    {item.variantOptions.colors}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Price - Mobile */}
                          <div className="mt-2 xs:hidden">
                            <span className="text-base font-bold text-mmp-primary2">
                              {formatCurrency(item.priceSnapshot * (1 - (item.discount ?? 0) / 100))}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls & Price */}
                        <div className="flex xs:flex-col items-center xs:items-end gap-2 xs:gap-3">
                          {/* Price - Desktop */}
                          <div className="hidden xs:block">
                            <span className="text-sm sm:text-base font-bold text-mmp-primary2">
                              {formatCurrency(item.priceSnapshot * (1 - (item.discount ?? 0) / 100))}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item._id,
                                )
                              }
                            >
                              <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item._id,
                                )
                              }
                            >
                              <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-1"
                              onClick={() =>
                                handleRemoveItem(
                                  item.productId,
                                  item.nameSnapshot,
                                  item._id,
                                )
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="xs:mt-1">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900">
                              Total:{" "}
                              {formatCurrency(
                                item?.subtotal ?? 0,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges - Responsive Grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 text-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold">
                  Secure Payment
                </div>
                <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">
                  SSL Encryption
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 text-center">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold">
                  Free Shipping
                </div>
                <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">
                  Over ₦50,000
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 text-center">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold">
                  Easy Returns
                </div>
                <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">
                  14-Day Policy
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 text-center">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold">
                  Multiple Payment
                </div>
                <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">
                  Options Available
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-6 sm:mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-8">
              {/* Summary Card */}
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h3>

                {/* Coupon Code */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Tax (VAT 2.5%)</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <Separator className="my-2 sm:my-3" />
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-mmp-primary2">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-mmp-primary hover:bg-mmp-primary2 mb-3 sm:mb-4 h-10 sm:h-11 text-sm sm:text-base"
                  size="default"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                {/* Secure Payment Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                    <span>Secure payment processed by Paystack</span>
                  </div>
                </div>

                {/* Continue Shopping - Mobile */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 lg:hidden">
                  <Button
                    variant="outline"
                    className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                    asChild
                  >
                    <Link to="/products">
                      <ShoppingBag className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Order Notes - Mobile Optimized */}
              <div className="mt-3 sm:mt-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">
                  Need Help?
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-600 text-sm leading-none">
                      •
                    </span>
                    <span>Free shipping on orders over ₦50,000</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-600 text-sm leading-none">
                      •
                    </span>
                    <span>14-day return policy</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-600 text-sm leading-none">
                      •
                    </span>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-600 text-sm leading-none">
                      •
                    </span>
                    <span>Secure payment processing</span>
                  </li>
                </ul>
              </div>

              {/* Continue Shopping - Desktop */}
              <div className="hidden lg:block mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
