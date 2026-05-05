import React, { useState, useCallback, useMemo } from 'react'
import { cn, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Heart,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Truck,
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
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()
  const { role } = useAuth()

  const finalPrice = useMemo(() => 
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price,
    [product.price, product.discount]
  )

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const showVendorActions = role === UserRole.VENDOR

  // Size configurations with premium e-commerce standards
  const sizeConfig = {
    sm: {
      imageHeight: 'h-28 xs:h-32 sm:h-36',
      contentPadding: 'p-2 xs:p-3',
      nameSize: 'text-xs xs:text-sm font-medium',
      priceSize: 'text-sm xs:text-base font-bold',
      oldPriceSize: 'text-[10px] xs:text-xs',
      badgeSize: 'text-[9px] xs:text-[10px]',
      iconSize: 'h-3 w-3 xs:h-3.5 xs:w-3.5',
      spacing: 'gap-1 xs:gap-1.5',
      showBrand: false,
      showRating: false,
      quickView: false,
    },
    md: {
      imageHeight: 'h-32 xs:h-36 sm:h-44 md:h-48',
      contentPadding: 'p-2 xs:p-3 sm:p-4',
      nameSize: 'text-sm xs:text-base font-semibold',
      priceSize: 'text-base xs:text-lg font-bold',
      oldPriceSize: 'text-xs',
      badgeSize: 'text-[10px] xs:text-xs',
      iconSize: 'h-3.5 w-3.5 xs:h-4 xs:w-4',
      spacing: 'gap-1.5 xs:gap-2',
      showBrand: true,
      showRating: true,
      quickView: true,
    },
    lg: {
      imageHeight: 'h-40 xs:h-48 sm:h-56 md:h-64',
      contentPadding: 'p-3 xs:p-4 sm:p-5',
      nameSize: 'text-base xs:text-lg font-semibold',
      priceSize: 'text-lg xs:text-xl font-bold',
      oldPriceSize: 'text-sm',
      badgeSize: 'text-xs',
      iconSize: 'h-4 w-4 xs:h-5 xs:w-5',
      spacing: 'gap-2 xs:gap-2.5',
      showBrand: true,
      showRating: true,
      quickView: true,
    },
  }

  const variantConfig = {
    default: {
      wrapper: 'bg-white border-brand-primary-soft hover:shadow-xl',
      hoverBorder: 'hover:border-brand-primary/30',
      rounded: 'rounded-xl',
      transition: 'transform transition-all duration-300 ease-out',
    },
    compact: {
      wrapper: 'bg-brand-surface border-brand-primary-soft/50 hover:shadow-md',
      hoverBorder: 'hover:border-brand-primary/20',
      rounded: 'rounded-lg',
      transition: 'transform transition-all duration-200 ease-out',
    },
    featured: {
      wrapper: 'bg-white border-2 border-brand-accent/30 hover:border-brand-accent shadow-lg',
      hoverBorder: 'hover:shadow-xl',
      rounded: 'rounded-2xl',
      transition: 'transform transition-all duration-300 ease-out',
    },
  }

  const config = sizeConfig[size]
  const variantStyle = variantConfig[variant]

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(prev => !prev)
  }, [])

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Implement quick view modal
  }, [product.slug])

  const handleProductClick = useCallback(() => {
    const route = showVendorActions ? '/vendor/products/$slug' : '/products/$slug'
    navigate({
      to: route,
      params: { slug: product.slug },
    })
  }, [showVendorActions, navigate, product.slug])

  // Product status badges
  const statusBadge = useMemo(() => {
    if (isOutOfStock) {
      return { text: 'Out of Stock', className: 'bg-brand-error/10 text-brand-error border-brand-error/20' }
    }
    if (isLowStock) {
      return { text: 'Low Stock', className: 'bg-brand-warning/10 text-brand-warning border-brand-warning/20' }
    }
    if (product.discount > 20) {
      return { text: 'Hot Deal', className: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' }
    }
    return null
  }, [isOutOfStock, isLowStock, product.discount])

  // Rating display (mock - replace with actual data)
  const rating = 4.5
  const reviewCount = product.soldCount || 0

  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer',
        variantStyle.wrapper,
        variantStyle.hoverBorder,
        variantStyle.rounded,
        variantStyle.transition,
        'hover:-translate-y-1 hover:shadow-2xl',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Container with Premium Overlay */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-surface to-white">
        {/* Discount Badge - Premium Design */}
        {product.discount > 0 && (
          <Badge 
            className={cn(
              "absolute top-3 left-3 z-10 bg-gradient-to-r from-brand-accent to-brand-accent/80 text-white border-0 font-bold shadow-lg",
              config.badgeSize,
              "px-2 py-1 rounded-full"
            )}
          >
            -{product.discount}%
          </Badge>
        )}

        {/* Status Badge */}
        {statusBadge && !product.discount && (
          <Badge 
            className={cn(
              "absolute top-3 left-3 z-10 font-medium border",
              statusBadge.className,
              config.badgeSize,
              "px-2 py-1 rounded-full"
            )}
          >
            {statusBadge.text}
          </Badge>
        )}

        {/* Premium Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {/* Free Shipping Badge */}
          {finalPrice > 50 && !isOutOfStock && (
            <div className="bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <Truck className={cn("text-brand-primary", config.iconSize)} />
            </div>
          )}
          
          {/* Best Seller Badge */}
          {product.soldCount > 100 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-sm">
              <TrendingUp className={cn("text-brand-success", config.iconSize)} />
            </div>
          )}
        </div>

        {/* Vendor Actions */}
        {showVendorActions && (
          <div className="absolute top-3 right-3 z-10 flex gap-1.5">
            {onEdit && (
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(product._id.toString())
                }}
                className="h-8 w-8 bg-white/95 hover:bg-white shadow-md rounded-full transition-all hover:scale-110"
              >
                <Edit className={cn("text-brand-primary", config.iconSize)} />
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
                className="h-8 w-8 bg-white/95 hover:bg-brand-error/10 shadow-md rounded-full transition-all hover:scale-110"
              >
                <Trash2 className={cn("text-brand-error", config.iconSize)} />
              </Button>
            )}
          </div>
        )}

        {/* Favorite Button - Premium Animation */}
        {!showVendorActions && (
          <Button
            variant="secondary"
            size="icon"
            onClick={handleFavorite}
            className={cn(
              'absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md transition-all',
              'hover:scale-110 hover:shadow-lg',
              isFavorite && 'bg-brand-error/10'
            )}
          >
            <Heart 
              className={cn(
                "transition-all",
                config.iconSize,
                isFavorite 
                  ? "text-brand-error fill-brand-error scale-110" 
                  : "text-brand-muted hover:text-brand-error"
              )} 
            />
          </Button>
        )}

        {/* Quick View Overlay - Premium Reveal */}
        {config.quickView && !showVendorActions && (
          <div 
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 transition-all duration-300",
              isHovered && !isOutOfStock ? "translate-y-0" : "translate-y-full"
            )}
          >
            <Button
              variant="secondary"
              onClick={handleQuickView}
              className="w-full rounded-none bg-white/95 backdrop-blur-sm hover:bg-white text-brand-dark font-medium h-9 text-xs"
            >
              <Eye className="h-3.5 w-3.5 mr-2" />
              Quick View
            </Button>
          </div>
        )}

        {/* Product Image with Blur-up Effect */}
        <div className="w-full h-full relative">
          {/* Skeleton Loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-brand-surface via-white to-brand-surface animate-pulse" />
          )}
          
          {/* Main Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isHovered && "scale-105",
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Hover Gradient Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent transition-opacity duration-300",
            isHovered && "from-black/10"
          )} />
        </div>
      </div>

      {/* Product Information - Clean Premium Layout */}
      <CardContent className={cn(config.contentPadding, "space-y-2")}>
        {/* Brand and SKU */}
        {config.showBrand && (
          <div className="flex items-center justify-between">
            {product.brand && (
              <span className="text-[10px] xs:text-xs text-brand-muted uppercase tracking-wider font-medium">
                {product.brand}
              </span>
            )}
            {showVendorActions && (
              <span className="text-[9px] xs:text-[10px] text-brand-muted font-mono">
                SKU: {product._id.toString().slice(-6)}
              </span>
            )}
          </div>
        )}

        {/* Product Name with Line Clamp */}
        <h3 className={cn(
          "text-brand-dark hover:text-brand-primary transition-colors line-clamp-2 leading-tight group-hover:text-brand-primary",
          config.nameSize
        )}>
          {product.name}
        </h3>

        {/* Rating and Reviews Section */}
        {config.showRating && reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "transition-all",
                    config.iconSize,
                    star <= Math.floor(rating) 
                      ? "text-brand-accent fill-brand-accent" 
                      : "text-brand-muted/30 fill-brand-muted/10"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] xs:text-xs text-brand-muted">
              ({reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Price Section with Premium Typography */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={cn("text-brand-primary", config.priceSize)}>
            {formatCurrency(finalPrice)}
          </span>
          {product.discount > 0 && (
            <span className={cn("text-brand-muted line-through", config.oldPriceSize)}>
              {formatCurrency(product.price)}
            </span>
          )}
          {product.discount > 0 && (
            <span className="text-[10px] xs:text-xs text-brand-success font-medium bg-brand-success/10 px-1.5 py-0.5 rounded-full">
              Save {product.discount}%
            </span>
          )}
        </div>

        {/* Stock Status with Progress Bar */}
        {isLowStock && !isOutOfStock && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] xs:text-xs">
              <span className="text-brand-warning font-medium">Only {product.stock} left</span>
              <span className="text-brand-muted">Hurry up!</span>
            </div>
            <div className="w-full h-1 bg-brand-warning/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-warning to-brand-accent rounded-full transition-all duration-500"
                style={{ width: `${(product.stock / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Add to Cart Button - Premium CTA */}
        {!showVendorActions && !isOutOfStock && (
          <div className="pt-2">
            <AddToCartButton
              product={product}
              size={size === 'lg' ? 'default' : 'sm'}
              className={cn(
                "w-full font-semibold transition-all",
                size === 'sm' && "h-8 text-xs",
                size === 'md' && "h-9 text-sm",
                size === 'lg' && "h-10 text-base",
                "hover:scale-[0.98] active:scale-95"
              )}
              showIcon={true}
              iconOnly={false}
            />
          </div>
        )}

        {/* Out of Stock State */}
        {isOutOfStock && (
          <div className="pt-2">
            <Button
              disabled
              className="w-full bg-brand-muted/10 text-brand-muted cursor-not-allowed font-semibold"
              size={size === 'lg' ? 'default' : 'sm'}
            >
              Out of Stock
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Enhanced Product Grid Component
interface ProductGridProps {
  products: Array<ProductCardProps['product']>
  size?: ProductCardProps['size']
  variant?: ProductCardProps['variant']
  className?: string
  onEdit?: (productId: string) => void
  onDelete?: (productId: string) => void
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
  }
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  size = 'md',
  variant = 'default',
  className,
  onEdit,
  onDelete,
  columns = { mobile: 2, tablet: 3, desktop: 4, wide: 5 },
}) => {
  const gridColumns = cn(
    'grid gap-3 sm:gap-4 md:gap-5',
    `grid-cols-${columns.mobile || 2}`,
    `sm:grid-cols-${columns.tablet || 3}`,
    `md:grid-cols-${columns.desktop || 4}`,
    `lg:grid-cols-${columns.wide || 5}`
  )

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-muted">No products found</p>
      </div>
    )
  }

  return (
    <div className={cn(gridColumns, className)}>
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

// Product List Item for alternate view - Premium Design
export const ProductListItem: React.FC<{ product: IProductListItem }> = ({ product }) => {
  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price
  
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="flex gap-4 p-4 bg-white border border-brand-primary-soft rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
      {/* Product Image Container */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="block shrink-0"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden rounded-lg bg-brand-surface">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.discount > 0 && (
            <div className="absolute top-0 left-0 bg-gradient-to-r from-brand-accent to-brand-accent/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
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
              <h3 className="text-sm sm:text-base font-semibold text-brand-dark hover:text-brand-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            
            {/* Brand and Stats */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {product.brand && (
                <span className="text-xs text-brand-muted uppercase tracking-wide">
                  {product.brand}
                </span>
              )}
              {product.soldCount > 0 && (
                <>
                  <span className="text-xs text-brand-muted">•</span>
                  <span className="text-xs text-brand-muted">
                    {product.soldCount} sold
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
            <span className="text-base sm:text-lg font-bold text-brand-primary">
              {formatCurrency(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs sm:text-sm text-brand-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {isOutOfStock ? (
            <span className="text-xs text-brand-error font-medium">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-xs text-brand-warning font-medium">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="text-xs text-brand-success font-medium">In Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex items-center gap-2">
          <AddToCartButton
            product={product}
            size="sm"
            className="h-9 text-sm px-4 font-semibold bg-mmp-accent"
            showIcon={true}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft transition-all"
          >
            <Heart className="h-4 w-4 text-brand-muted hover:text-brand-error transition-colors" />
          </Button>
        </div>
      </div>
    </div>
  )
}