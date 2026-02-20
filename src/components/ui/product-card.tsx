import React, { useState } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import type { IProductListItem } from '@/types'
import { Link, useNavigate } from '@tanstack/react-router'
import { AddToCartButton } from '../cart/add-to-cart-button'
import { useAuth } from '@/hooks'
import { UserRole } from '@/types'

interface ProductCardProps {
  product: IProductListItem
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'featured'
  onEdit?: (productId: string) => void
  onDelete?: (productId: string) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = 'md',
  variant = 'default',
  className,
  onEdit,
  onDelete,
}) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const navigate = useNavigate()
  const { role } = useAuth()

  const finalPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const showVendorActions = role === UserRole.VENDOR

  // Size configurations - optimized for e-commerce standards
  const sizeConfig = {
    sm: {
      imageHeight: 'h-28 xs:h-32',
      contentPadding: 'p-2 xs:p-3',
      nameSize: 'text-xs xs:text-sm',
      priceSize: 'text-sm xs:text-base',
      oldPriceSize: 'text-[10px] xs:text-xs',
      badgeSize: 'text-[8px] xs:text-[10px]',
      iconSize: 'h-3 w-3 xs:h-3.5 xs:w-3.5',
      showBrand: false,
      showRating: false,
      quickView: false,
    },
    md: {
      imageHeight: 'h-32 xs:h-36 sm:h-40',
      contentPadding: 'p-2 xs:p-3 sm:p-3',
      nameSize: 'text-xs xs:text-sm sm:text-sm',
      priceSize: 'text-sm xs:text-base sm:text-base',
      oldPriceSize: 'text-[10px] xs:text-xs sm:text-xs',
      badgeSize: 'text-[8px] xs:text-[10px] sm:text-[10px]',
      iconSize: 'h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4',
      showBrand: true,
      showRating: true,
      quickView: true,
    },
    lg: {
      imageHeight: 'h-40 xs:h-44 sm:h-48',
      contentPadding: 'p-3 xs:p-4 sm:p-4',
      nameSize: 'text-sm xs:text-base sm:text-lg',
      priceSize: 'text-base xs:text-lg sm:text-xl',
      oldPriceSize: 'text-xs xs:text-sm sm:text-sm',
      badgeSize: 'text-[10px] xs:text-xs sm:text-xs',
      iconSize: 'h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5',
      showBrand: true,
      showRating: true,
      quickView: true,
    },
  }

  const variantConfig = {
    default: {
      border: 'border-gray-200',
      hoverBorder: 'hover:border-mmp-primary/30',
      shadow: 'hover:shadow-md',
      rounded: 'rounded-lg',
    },
    compact: {
      border: 'border-gray-100',
      hoverBorder: 'hover:border-gray-300',
      shadow: 'hover:shadow-sm',
      rounded: 'rounded-md',
    },
    featured: {
      border: 'border-mmp-primary/20 border-2',
      hoverBorder: 'hover:border-mmp-primary',
      shadow: 'hover:shadow-lg',
      rounded: 'rounded-xl',
    },
  }

  const config = sizeConfig[size]
  const variantStyle = variantConfig[variant]

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Implement quick view modal logic
    console.log('Quick view:', product.slug)
  }

  // Determine product status
  const getProductStatus = () => {
    if (isOutOfStock)
      return { text: 'Out of Stock', className: 'bg-gray-100 text-gray-600' }
    if (isLowStock)
      return { text: 'Low Stock', className: 'bg-amber-100 text-amber-700' }
    return null
  }

  const status = getProductStatus()

  const productViewHandler = () => {
    if (showVendorActions) {
      navigate({
        to: '/vendor/products/$slug',
        params: {
          slug: product.slug,
        },
      })
    } else {
      navigate({
        to: '/products/$slug',
        params: {
          slug: product.slug,
        },
      })
    }
  }

  // Calculate rating (mock data - replace with actual rating)
  const rating = 4.5
  const reviewCount = product.soldCount || 0

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200 bg-white border',
        variantStyle.border,
        variantStyle.hoverBorder,
        variantStyle.shadow,
        variantStyle.rounded,
        'hover:translate-y-[-1px]',
        className,
      )}
    >
      {/* Image Container - Fixed aspect ratio for consistency */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Discount Badge */}
        {product.discount > 0 && (
          <Badge className={cn(
            "absolute top-2 left-2 z-10 bg-red-500 text-white border-0 font-semibold",
            config.badgeSize,
            "px-1.5 py-0.5"
          )}>
            -{product.discount}%
          </Badge>
        )}

        {/* Vendor Actions */}
        {showVendorActions && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            {onEdit && (
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(product._id.toString())
                }}
                className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm rounded-full"
              >
                <Edit className={cn("h-3 w-3", config.iconSize)} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(product._id.toString())
                }}
                className="h-7 w-7 bg-white/90 hover:bg-white text-red-600 shadow-sm rounded-full"
              >
                <Trash2 className={cn("h-3 w-3", config.iconSize)} />
              </Button>
            )}
          </div>
        )}

        {/* Favorite Button for users */}
        {!showVendorActions && (
          <Button
            variant="secondary"
            size="icon"
            onClick={handleFavorite}
            className={cn(
              'absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all',
              isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', isFavorite && 'fill-current')} />
          </Button>
        )}

        {/* Quick View Button - appears on hover */}
        {config.quickView && !showVendorActions && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickView}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 hover:bg-white text-xs h-7 px-2 shadow-sm"
          >
            <Eye className="h-3 w-3 mr-1" />
            Quick View
          </Button>
        )}

        {/* Product Image */}
        <Link
          to={showVendorActions ? "/vendor/products/$slug" : "/products/$slug"}
          params={{ slug: product.slug }}
          onClick={(e) => e.stopPropagation()}
          className="block w-full h-full"
        >
          <div className="w-full h-full relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </Link>
      </div>

      {/* Product Info - Clean and minimal */}
      <CardContent className={cn(config.contentPadding, "space-y-1.5")}>
        {/* Brand */}
        {config.showBrand && product.brand && (
          <div className="text-[10px] xs:text-xs text-gray-500 uppercase tracking-wide">
            {product.brand}
          </div>
        )}

        {/* Product Name */}
        <Link
          to={showVendorActions ? "/vendor/products/$slug" : "/products/$slug"}
          params={{ slug: product.slug }}
          onClick={(e) => e.stopPropagation()}
          className="block"
        >
          <h3 className={cn(
            "font-medium text-gray-900 hover:text-mmp-primary transition-colors line-clamp-2 leading-tight",
            config.nameSize
          )}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {config.showRating && reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "text-yellow-400",
                    config.iconSize,
                    star <= Math.floor(rating) ? 'fill-yellow-400' : 'fill-gray-200'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] xs:text-xs text-gray-500">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-bold text-gray-900", config.priceSize)}>
            {formatCurrency(finalPrice)}
          </span>
          {product.discount > 0 && (
            <span className={cn("text-gray-400 line-through", config.oldPriceSize)}>
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {status && (
          <div className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-full",
            status.className,
            config.badgeSize
          )}>
            {status.text}
            {isLowStock && ` • ${product.stock} left`}
          </div>
        )}

        {/* Add to Cart - Icon only for clean look */}
        {!showVendorActions && !isOutOfStock && (
          <div className="pt-1.5">
            <AddToCartButton
              product={product}
              size="sm"
              className="w-full h-8 xs:h-9 text-xs"
              showIcon={true}
              iconOnly={false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Product Grid Component
interface ProductGridProps {
  products: Array<ProductCardProps['product']>
  size?: ProductCardProps['size']
  variant?: ProductCardProps['variant']
  className?: string
  onEdit?: (productId: string) => void
  onDelete?: (productId: string) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  size = 'md',
  variant = 'default',
  className,
  onEdit,
  onDelete,
}) => {
  const gridCols = {
    sm: 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    md: 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    lg: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  }

  return (
    <div className={cn('grid gap-2 xs:gap-3 sm:gap-4', gridCols[size], className)}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          size={size}
          variant={variant}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// Product List Item for alternate view
export const ProductListItem: React.FC<{ product: any }> = ({ product }) => {
  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price
  
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Product Image */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="block shrink-0"
      >
        <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 overflow-hidden rounded-md bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {product.discount > 0 && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] xs:text-[10px] font-bold px-1 py-0.5 rounded-br-md">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="block"
            >
              <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-900 hover:text-mmp-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            
            {/* Mobile: Show brand and rating inline */}
            <div className="flex items-center gap-2 mt-1">
              {product.brand && (
                <span className="text-[10px] xs:text-xs text-gray-500 uppercase">
                  {product.brand}
                </span>
              )}
              {product.soldCount > 0 && (
                <>
                  <span className="text-[8px] xs:text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] xs:text-xs text-gray-500">
                    {product.soldCount} sold
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Price - Mobile: inline, Desktop: right aligned */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
            <span className="text-sm xs:text-base font-bold text-gray-900">
              {formatCurrency(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-[10px] xs:text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock status */}
        <div className="mt-2 flex items-center gap-2">
          {product.stock > 0 ? (
            product.stock < 5 ? (
              <span className="text-[10px] xs:text-xs text-amber-600 font-medium">
                Only {product.stock} left!
              </span>
            ) : (
              <span className="text-[10px] xs:text-xs text-green-600">In Stock</span>
            )
          ) : (
            <span className="text-[10px] xs:text-xs text-red-600">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons - Mobile optimized */}
        <div className="mt-3 flex items-center gap-2">
          <AddToCartButton
            product={product}
            size="sm"
            className="h-8 text-xs px-3"
            showIcon={true}
          />
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}