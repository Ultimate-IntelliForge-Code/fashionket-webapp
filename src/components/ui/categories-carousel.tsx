import { memo, useState, useCallback } from 'react'
import { Badge } from './badge'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { ScrollArea, ScrollBar } from './scroll-area'
import { Link } from '@tanstack/react-router'
import { Card } from './card'
import type { ICategory } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryProps {
  categories: ICategory[]
  isLoading?: boolean
}

// Skeleton loader for categories
const CategorySkeleton = () => (
  <div className="flex gap-2 sm:gap-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex-none">
        <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-lg bg-brand-surface animate-pulse" />
      </div>
    ))}
  </div>
)

// Individual category card component with memoization
const CategoryCard = memo(({ category }: { category: ICategory }) => {
  const [imageError, setImageError] = useState(false)
  const imageUrl = imageError ? '/placeholder-category.png' : (category.icon || '/placeholder-category.png')

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  return (
    <Link
      key={category._id}
      to="/categories/$slug"
      params={{ slug: category.slug }}
      className={cn(
        "block flex-none focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand-primary focus-visible:ring-offset-2",
        "rounded-lg transition-all duration-200"
      )}
      aria-label={`Browse ${category.name} category`}
    >
      <Card className={cn(
        "h-full border-brand-primary-soft overflow-hidden bg-white",
        "transition-all duration-300 p-0",
        "hover:shadow-lg hover:-translate-y-0.5",
        "active:scale-[0.98]"
      )}>
        {/* Image Container */}
        <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 overflow-hidden bg-brand-surface">
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
            sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/30 to-transparent" />
          
          {/* Category Name */}
          <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-2.5 sm:p-3">
            <h3 className={cn(
              "font-semibold text-white leading-tight drop-shadow-md",
              "text-[10px] xs:text-xs sm:text-sm md:text-base",
              "line-clamp-2"
            )}>
              {category.name}
            </h3>
          </div>
        </div>
      </Card>
    </Link>
  )
})

CategoryCard.displayName = 'CategoryCard'

const CategoriesCarousel = ({ categories, isLoading = false }: CategoryProps) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)

  // Handle scroll events to show/hide navigation buttons
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget
    setScrollPosition(scrollLeft)
    setMaxScroll(scrollWidth - clientWidth)
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = document.querySelector('.categories-scroll-container')
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-6 w-32 bg-brand-surface rounded-full mx-auto animate-pulse" />
            <div className="h-8 w-48 bg-brand-surface rounded-lg mx-auto mt-2 animate-pulse" />
          </div>
          <CategorySkeleton />
        </div>
      </section>
    )
  }

  // Don't render if no categories
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className="py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <Badge 
            variant="secondary"
            className={cn(
              "mb-2 sm:mb-3",
              "bg-brand-primary-soft text-brand-primary",
              "border-0 px-3 sm:px-4 py-1 sm:py-1.5",
              "text-[10px] sm:text-xs font-medium"
            )}
          >
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
            Browse Collections
          </Badge>
          
          <h2 className={cn(
            "font-bold text-brand-dark",
            "text-lg sm:text-xl md:text-2xl lg:text-4xl",
            "tracking-tight"
          )}>
            Shop By Category
          </h2>
          
          <p className={cn(
            "text-brand-muted mt-2 sm:mt-3",
            "text-xs sm:text-sm",
            "max-w-md mx-auto"
          )}>
            Discover products from your favorite categories
          </p>
        </div>

        {/* Categories Carousel */}
        <div className="relative group">
          {/* Navigation Buttons - Desktop only */}
          {scrollPosition > 0 && (
            <button
              onClick={() => scroll('left')}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                "hidden lg:flex items-center justify-center",
                "w-8 h-8 rounded-full bg-white shadow-lg",
                "border border-brand-primary-soft",
                "text-brand-dark hover:text-brand-primary",
                "transition-all duration-200 hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-brand-primary",
                "disabled:opacity-0"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <ScrollArea className="w-full">
            <div 
              className="categories-scroll-container flex gap-3 sm:gap-4 pb-4 overflow-x-auto scroll-smooth"
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'thin' }}
            >
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2 mt-1" />
          </ScrollArea>

          {scrollPosition < maxScroll && maxScroll > 0 && (
            <button
              onClick={() => scroll('right')}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                "hidden lg:flex items-center justify-center",
                "w-8 h-8 rounded-full bg-white shadow-lg",
                "border border-brand-primary-soft",
                "text-brand-dark hover:text-brand-primary",
                "transition-all duration-200 hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-brand-primary"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/categories"
            className={cn(
              "inline-flex items-center gap-2",
              "text-sm sm:text-base font-medium",
              "text-brand-primary hover:text-brand-primary-hover",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
              "rounded-lg px-4 py-2"
            )}
          >
            View All Categories
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CategoriesCarousel