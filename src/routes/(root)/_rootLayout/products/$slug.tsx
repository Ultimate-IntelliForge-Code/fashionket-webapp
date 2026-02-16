import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { productBySlugQuery, relatedProductsQuery } from "@/api/queries";
import type { IVariantOptions } from "@/types";
import { ProductCard } from "@/components/ui/product-card";

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

  const discountedPrice = product.price * (1 - product.discount / 100);
  const savings = product.price - discountedPrice;
  const isOutOfStock = product.stock === 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    // TODO: Implement buy now logic
    console.log("Buy now:", {
      product: product.name,
      quantity,
      size: variants.sizes,
      color: variants.colors,
      price: discountedPrice,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb - Mobile Optimized */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4">
          <nav className="flex items-center text-xs sm:text-sm overflow-x-auto pb-1 whitespace-nowrap scrollbar-hide">
            <Link
              to="/"
              className="text-gray-500 hover:text-mmp-primary flex-shrink-0"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 mx-1 text-gray-300 flex-shrink-0" />

            <Link
              to="/products"
              className="text-gray-500 hover:text-mmp-primary flex-shrink-0"
            >
              Products
            </Link>

            {product.category && (
              <>
                <ChevronRight className="h-3 w-3 mx-1 text-gray-300 flex-shrink-0" />
                <Link
                  to={`/categories/$slug`}
                  params={{ slug: product.category.slug ?? "" }}
                  className="text-gray-500 hover:text-mmp-primary flex-shrink-0"
                >
                  {product.category.name}
                </Link>
              </>
            )}

            <ChevronRight className="h-3 w-3 mx-1 text-gray-300 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="lg:sticky lg:top-8">
              {/* Back Button - Mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="mb-3 lg:hidden h-8 text-xs"
                asChild
              >
                <Link
                  to={product.category ? `/categories/$slug` : "/products"}
                  params={{ slug: product.category?.slug }}
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back to {product.category?.name || "Products"}
                </Link>
              </Button>

              {/* Main Image */}
              <div className="mb-3 sm:mb-4 overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Thumbnail Images - Horizontal Scroll on Mobile */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`flex-none overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-mmp-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="h-14 w-14 xs:h-16 xs:w-16 sm:h-20 sm:w-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            {/* Back Button - Desktop */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 hidden lg:inline-flex h-8 text-sm"
              asChild
            >
              <Link
                to={product.category ? "/categories/$slug" : "/products"}
                params={{ slug: product.category?.slug }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {product.category?.name || "Products"}
              </Link>
            </Button>

            {/* Product Header */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    className="rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              {/* Brand & Rating - Stack on mobile */}
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    ({Math.floor(product.viewCount / 100)} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price - Mobile Optimized */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatCurrency(discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base sm:text-xl text-gray-500 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="rounded-full bg-red-100 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-red-800">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
              {product.discount > 0 && (
                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  You save {formatCurrency(savings)}
                </p>
              )}
            </div>

            {/* Variant Selection */}
            <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
              {/* Size Selection */}
              {product.variantOptions.sizes && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm sm:text-base font-medium text-gray-900">
                      Size
                    </label>
                    <button
                      type="button"
                      className="text-xs sm:text-sm text-mmp-primary hover:text-mmp-primary2"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.variantOptions.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setVariants((prev) => ({
                            ...prev,
                            sizes: prev.sizes.includes(size)
                              ? prev.sizes.filter((s) => s !== size)
                              : [...prev.sizes, size],
                          }))
                        }
                        className={`min-w-[3rem] sm:min-w-[3.5rem] rounded-lg border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                          variants.sizes.includes(size)
                            ? "border-mmp-primary bg-mmp-primary text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.variantOptions.colors && (
                <div>
                  <label className="mb-2 block text-sm sm:text-base font-medium text-gray-900">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.variantOptions.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setVariants((prev) => ({
                            ...prev,
                            colors: prev.colors.includes(color)
                              ? prev.colors.filter((s) => s !== color)
                              : [...prev.colors, color],
                          }))
                        }
                        className={`flex items-center gap-1.5 sm:gap-2 rounded-lg border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-colors ${
                          variants.colors.includes(color)
                            ? "border-mmp-primary"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div
                          className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-gray-200"
                          style={{
                            backgroundColor: color.toLowerCase(),
                          }}
                        />
                        <span className="hidden xs:inline">{color}</span>
                        {variants.colors.includes(color) && (
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-mmp-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials Selection */}
              {product.variantOptions.materials && (
                <div>
                  <label className="mb-2 block text-sm sm:text-base font-medium text-gray-900">
                    Materials
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.variantOptions.materials.map((material) => (
                      <button
                        key={material}
                        type="button"
                        onClick={() =>
                          setVariants((prev) => ({
                            ...prev,
                            materials: prev.materials.includes(material)
                              ? prev.materials.filter((s) => s !== material)
                              : [...prev.materials, material],
                          }))
                        }
                        className={`flex items-center gap-1.5 sm:gap-2 rounded-lg border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-colors ${
                          variants.materials.includes(material)
                            ? "border-mmp-primary"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div
                          className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border border-gray-200"
                          style={{
                            backgroundColor: material.toLowerCase(),
                          }}
                        />
                        <span className="hidden xs:inline">{material}</span>
                        {variants.materials.includes(material) && (
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-mmp-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender Selection */}
              {product.variantOptions.genders && (
                <div>
                  <label className="mb-2 block text-sm sm:text-base font-medium text-gray-900">
                    Gender
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.variantOptions.genders.map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() =>
                          setVariants((prev) => ({
                            ...prev,
                            genders: prev.genders.includes(gender)
                              ? prev.genders.filter((s) => s !== gender)
                              : [...prev.genders, gender],
                          }))
                        }
                        className={`rounded-lg border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                          variants.genders.includes(gender)
                            ? "border-mmp-primary bg-mmp-primary text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <label className="mb-2 block text-sm sm:text-base font-medium text-gray-900">
                  Quantity
                </label>
                <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gray-300 w-fit">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {product.stock} items available
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 sm:mb-8 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <AddToCartButton
                  className="flex-1 bg-mmp-primary2 hover:bg-mmp-primary2 text-sm sm:text-base h-10 sm:h-11"
                  product={product}
                  quantity={quantity}
                  variantOptions={variants}
                  size="default"
                />

                <Button
                  size="default"
                  variant="outline"
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
              <p className="text-center text-xs sm:text-sm text-gray-600">
                Free shipping on orders over ₦50,000
              </p>
            </div>

            {/* Product Details */}
            <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
              {/* Description */}
              <div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold">
                  Description
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold">
                  Features
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Handcrafted with attention to detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Ethically sourced materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>1-year warranty included</span>
                  </li>
                </ul>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="mb-2 text-base sm:text-lg font-semibold">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Badges - Responsive Grid */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center">
                  <Truck className="mx-auto mb-1.5 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  <div className="text-xs sm:text-sm font-medium">
                    Free Shipping
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    Over ₦50,000
                  </div>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-1.5 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  <div className="text-xs sm:text-sm font-medium">
                    2-Year Warranty
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    Quality Guaranteed
                  </div>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <Check className="mx-auto mb-1.5 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  <div className="text-xs sm:text-sm font-medium">
                    Secure Payment
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    100% Secure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-12 md:mt-16">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Related Products
              </h2>
              <Link
                to="/categories/$slug"
                params={{ slug: product?.category?.slug ?? "" }}
                className="text-xs sm:text-sm text-mmp-primary hover:text-mmp-primary2 hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    className="flex-none w-48 xs:w-56 sm:w-64"
                  >
                    <ProductCard product={relatedProduct} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
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
