import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  Minus,
  Plus,
  Check,
  ChevronRight,
  RefreshCw,
  Award,
} from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { productBySlugQuery, relatedProductsQuery } from "@/api/queries";
import type { IVariantOptions } from "@/types";
import { ProductCard } from "@/components/ui/product-card";
import { useCart } from "@/hooks";
import { toast } from "react-toastify";

export const Route = createFileRoute("/(root)/_rootLayout/products/$slug")({
  component: ProductDetailPage,
  validateSearch: z.object({}),
  params: {
    parse: (params) =>
      z
        .object({
          slug: z.string().min(1),
        })
        .parse(params),
  },
  loader: async ({ context, params }) => {
    const [product, relatedProducts] = await Promise.all([
      context.queryClient.ensureQueryData(productBySlugQuery(params.slug)),
      context.queryClient.ensureQueryData(relatedProductsQuery(params.slug, 8)),
    ]);
    return { product, relatedProducts };
  },
});

function ProductDetailPage() {
  const { product, relatedProducts } = Route.useLoaderData();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [variants, setVariants] = React.useState<IVariantOptions>({
    sizes: [],
    colors: [],
    genders: [],
    materials: [],
  });
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const discountedPrice = product.price * (1 - product.discount / 100);
  const savings = product.price - discountedPrice;
  const isOutOfStock = product.stock === 0;
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCart();

  const handleBuyNow = async () => {
    if (product.stock <= 0) {
      toast.error(`Only ${product.stock} left in stock`);
      return;
    }

    setIsAdding(cartLoading);
    try {
      const result = await addToCart(
        product._id,
        product.name,
        product.slug,
        product.price,
        product.images[0],
        1,
      );

      if (result.success) {
             navigate({ to: "/checkout" });

      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const updateVariant = (type: keyof IVariantOptions, value: string) => {
    setVariants((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Breadcrumb */}
      {/* <div className="border-b border-brand-primary-soft bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center text-xs sm:text-sm overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide">
            <Link to="/" className="text-brand-muted hover:text-brand-primary transition-colors flex-shrink-0">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 mx-1 text-brand-primary-soft flex-shrink-0" />
            
            <Link to="/products" className="text-brand-muted hover:text-brand-primary transition-colors flex-shrink-0">
              Products
            </Link>

            {product.category && (
              <>
                <ChevronRight className="h-3 w-3 mx-1 text-brand-primary-soft flex-shrink-0" />
                <Link
                  to="/categories/$slug"
                  params={{ slug: product.category.slug ?? "" }}
                  className="text-brand-muted hover:text-brand-primary transition-colors flex-shrink-0"
                >
                  {product.category.name}
                </Link>
              </>
            )}

            <ChevronRight className="h-3 w-3 mx-1 text-brand-primary-soft flex-shrink-0" />
            <span className="text-brand-dark font-medium truncate max-w-[150px] sm:max-w-[250px] md:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-24">
              {/* Mobile Back Button */}
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 lg:hidden h-9 text-sm text-brand-muted hover:text-brand-primary"
                asChild
              >
                <Link
                  to={product.category ? `/categories/$slug` : "/products"}
                  params={{ slug: product?.category?.slug }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {product.category?.name || "Products"}
                </Link>
              </Button>

              {/* Main Image */}
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-brand-surface aspect-square shadow-sm">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-brand-accent text-white px-2.5 py-1 rounded-lg text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`flex-none overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-brand-primary shadow-md"
                        : "border-brand-primary-soft hover:border-brand-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2">
            {/* Desktop Back Button */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 hidden lg:inline-flex h-9 text-sm text-brand-muted hover:text-brand-primary"
              asChild
            >
              <Link
                to={product.category ? `/categories/$slug` : "/products"}
                params={{ slug: product?.category?.slug }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {product.category?.name || "Products"}
              </Link>
            </Button>

            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark leading-tight flex-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="rounded-full p-2 hover:bg-brand-primary-soft transition-all duration-200 group"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`h-5 w-5 transition-all duration-200 ${
                        isWishlisted
                          ? "fill-brand-error text-brand-error"
                          : "text-brand-muted group-hover:text-brand-error"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-2 hover:bg-brand-primary-soft transition-all duration-200 group"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5 text-brand-muted group-hover:text-brand-primary" />
                  </button>
                </div>
              </div>

              {/* Brand & Rating */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {product.brand && (
                  <span className="text-sm font-medium text-brand-primary bg-brand-primary-soft px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-current text-brand-warning"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-brand-muted">
                    ({Math.floor(product.viewCount / 100)} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-6 p-4 bg-brand-primary-soft rounded-xl">
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-brand-primary">
                  {formatCurrency(discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-brand-muted line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-semibold text-brand-accent">
                      Save {formatCurrency(savings)}
                    </span>
                  </>
                )}
              </div>
              {product.discount > 0 && (
                <p className="mt-2 text-sm text-brand-success">
                  You save {formatCurrency(savings)} on this purchase!
                </p>
              )}
            </div>

            {/* Variant Selection */}
            <div className="mb-8 space-y-6">
              {/* Size Selection */}
              {product.variantOptions.sizes &&
                product.variantOptions.sizes.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-semibold text-brand-dark">
                        Select Size
                      </label>
                      <button
                        type="button"
                        className="text-xs text-brand-primary hover:text-brand-primary-hover transition-colors"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variantOptions.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateVariant("sizes", size)}
                          className={`
                          min-w-[3.5rem] rounded-lg border-2 px-4 py-2.5 text-sm font-medium 
                          transition-all duration-200 hover:scale-105
                          ${
                            variants.sizes.includes(size)
                              ? "border-brand-primary bg-brand-primary text-white shadow-md"
                              : "border-brand-primary-soft bg-white text-brand-dark hover:border-brand-primary hover:bg-brand-primary-soft"
                          }
                        `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Color Selection */}
              {product.variantOptions.colors &&
                product.variantOptions.colors.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-brand-dark">
                      Select Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.variantOptions.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => updateVariant("colors", color)}
                          className={`
                          flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm 
                          transition-all duration-200 hover:scale-105
                          ${
                            variants.colors.includes(color)
                              ? "border-brand-primary bg-brand-primary-soft"
                              : "border-brand-primary-soft bg-white hover:border-brand-primary"
                          }
                        `}
                        >
                          <div
                            className="h-5 w-5 rounded-full border border-brand-primary-soft shadow-sm"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          <span className="font-medium capitalize">
                            {color}
                          </span>
                          {variants.colors.includes(color) && (
                            <Check className="h-4 w-4 text-brand-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Quantity Selection */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-brand-dark">
                  Quantity
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center rounded-lg border-2 border-brand-primary-soft w-fit bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2.5 hover:bg-brand-primary-soft transition-colors disabled:opacity-50 rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-brand-dark" />
                    </button>
                    <span className="w-14 text-center font-semibold text-brand-dark">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2.5 hover:bg-brand-primary-soft transition-colors disabled:opacity-50 rounded-r-lg"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4 text-brand-dark" />
                    </button>
                  </div>
                  <div className="text-sm text-brand-muted">
                    <span className="font-semibold text-brand-dark">
                      {product.stock}
                    </span>{" "}
                    items available
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <AddToCartButton
                  className="flex-1 w-full bg-brand-primary hover:bg-brand-primary-hover text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  product={product}
                  quantity={quantity}
                  variantOptions={variants}
                  size="default"
                />
                <Button
                  size="default"
                  variant="outline"
                  className="flex-1 h-12 text-base font-semibold border-2 border-brand-primary text-brand-primary hover:bg-brand-primary-soft transition-all duration-200"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                >
                  { isAdding ? "Processing..." : "Buy Now"  }
                </Button>
              </div>
              <p className="text-center text-sm text-brand-muted">
                Free shipping on orders over ₦50,000
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mb-8 rounded-xl border border-brand-primary-soft bg-white p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center group">
                  <Truck className="mx-auto mb-2 h-6 w-6 text-brand-primary group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-sm font-semibold text-brand-dark">
                    Free Shipping
                  </div>
                  <div className="text-xs text-brand-muted">Over ₦50,000</div>
                </div>
                <div className="text-center group">
                  <Shield className="mx-auto mb-2 h-6 w-6 text-brand-primary group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-sm font-semibold text-brand-dark">
                    2-Year Warranty
                  </div>
                  <div className="text-xs text-brand-muted">
                    Quality Guaranteed
                  </div>
                </div>
                <div className="text-center group">
                  <RefreshCw className="mx-auto mb-2 h-6 w-6 text-brand-primary group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-sm font-semibold text-brand-dark">
                    Easy Returns
                  </div>
                  <div className="text-xs text-brand-muted">30 Days Return</div>
                </div>
                <div className="text-center group">
                  <Award className="mx-auto mb-2 h-6 w-6 text-brand-primary group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-sm font-semibold text-brand-dark">
                    Secure Payment
                  </div>
                  <div className="text-xs text-brand-muted">100% Secure</div>
                </div>
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="space-y-4">
              {/* Description */}
              <div className="rounded-xl border border-brand-primary-soft bg-white overflow-hidden">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-brand-dark hover:bg-brand-primary-soft transition-colors">
                    Product Description
                    <ChevronRight className="h-5 w-5 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <div className="p-5 pt-0 text-brand-muted leading-relaxed border-t border-brand-primary-soft">
                    <p>{product.description}</p>
                  </div>
                </details>
              </div>

              {/* Features */}
              <div className="rounded-xl border border-brand-primary-soft bg-white overflow-hidden">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-brand-dark hover:bg-brand-primary-soft transition-colors">
                    Key Features
                    <ChevronRight className="h-5 w-5 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <div className="p-5 pt-0 border-t border-brand-primary-soft">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-brand-success flex-shrink-0 mt-0.5" />
                        <span className="text-brand-muted">
                          Premium quality materials
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-brand-success flex-shrink-0 mt-0.5" />
                        <span className="text-brand-muted">
                          Handcrafted with attention to detail
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-brand-success flex-shrink-0 mt-0.5" />
                        <span className="text-brand-muted">
                          Ethically sourced materials
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-brand-success flex-shrink-0 mt-0.5" />
                        <span className="text-brand-muted">
                          1-year warranty included
                        </span>
                      </li>
                    </ul>
                  </div>
                </details>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="rounded-xl border border-brand-primary-soft bg-white p-5">
                  <h3 className="mb-3 font-semibold text-brand-dark">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-primary-soft px-3 py-1 text-sm text-brand-primary hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="mb-6 sm:mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-dark">
                  You Might Also Like
                </h2>
                <p className="text-sm text-brand-muted mt-1">
                  Customers who bought this also loved these items
                </p>
              </div>
              <Link
                to="/categories/$slug"
                params={{ slug: product?.category?.slug ?? "" }}
                className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
              >
                View All →
              </Link>
            </div>

            {/* Mobile Horizontal Scroll */}
            <div className="lg:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    className="flex-none w-56 sm:w-64"
                  >
                    <ProductCard product={relatedProduct} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
