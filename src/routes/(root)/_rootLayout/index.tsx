import { createFileRoute } from '@tanstack/react-router'
import React, { useRef, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Shirt,
  Watch,
  Glasses,
  Sparkles,
  TrendingUp,
  Zap,
  Crown,
  Telescope,
  Gift,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { IProductListItem } from '@/types'
import type { HeroType } from '@/components/home'
import HeroCarousel from '@/components/home/hero-carousel'
import CategoriesCarousel from '@/components/ui/categories-carousel'
import { ProductCard } from '@/components/ui/product-card'
import { categoriesQuery, productsQuery } from '@/api/queries'

// Hero Carousel Data with theme colors
const heroSlides: HeroType[] = [
  {
    id: '1',
    title: 'Summer Collection 2024',
    subtitle: 'Discover the Latest Trends',
    description: 'Up to 50% off on selected items. Limited time offer.',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=600&fit=crop',
    cta: 'Shop Now',
    bgColor: 'from-brand-primary/90 to-brand-accent/70',
    textColor: 'text-white',
  },
  {
    id: '2',
    title: 'Premium Accessories',
    subtitle: 'Elevate Your Style',
    description: 'Handcrafted jewelry and luxury watches collection',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&h=600&fit=crop',
    cta: 'Explore',
    bgColor: 'from-brand-dark/90 to-brand-muted/70',
    textColor: 'text-white',
  },
  {
    id: '3',
    title: 'Sustainable Fashion',
    subtitle: 'Eco-Friendly Choices',
    description: 'Organic materials, ethical production, timeless designs',
    image:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=600&fit=crop',
    cta: 'Discover',
    bgColor: 'from-brand-accent/90 to-brand-primary/70',
    textColor: 'text-white',
  },
]

// Icon mapping with better organization
const iconMap: Record<string, any> = {
  Shirt,
  Watch,
  Glasses,
  Sparkles,
  TrendingUp,
  Zap,
  Crown,
  default: Gift,
}

export const Route = createFileRoute('/(root)/_rootLayout/')({
  component: HomeClient,
  loader: async ({ context }) => {
    const [categories, products] = await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery()),
      context.queryClient.ensureQueryData(productsQuery()),
    ])

    return { categories, products }
  },
})

export default function HomeClient() {
  const { categories, products } = Route.useLoaderData()
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Scroll handlers with improved experience
  const scrollLeft = (categoryId: string) => {
    const scrollContainer = scrollRefs.current[categoryId]
    if (scrollContainer) {
      const scrollAmount = Math.min(320, scrollContainer.clientWidth)
      scrollContainer.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  const scrollRight = (categoryId: string) => {
    const scrollContainer = scrollRefs.current[categoryId]
    if (scrollContainer) {
      const scrollAmount = Math.min(320, scrollContainer.clientWidth)
      scrollContainer.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  // Group products by category and filter categories with products
  const { categoriesWithProducts, productsByCategory } = useMemo(() => {
    // First, group products by category
    const productsByCat = categories.reduce(
      (acc, category) => {
        acc[category._id] = products.data
          .filter((p) => p.categoryId === category._id)
          .slice(0, 10) // Limit to 10 products per category
        return acc
      },
      {} as Record<string, IProductListItem[]>
    )

    // Filter categories that have at least one product
    const filteredCategories = categories.filter(
      (category) => productsByCat[category._id]?.length > 0
    )

    return {
      categoriesWithProducts: filteredCategories,
      productsByCategory: productsByCat,
    }
  }, [categories, products.data])

  // Get icon with fallback
  const getCategoryIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || iconMap.default
    return Icon
  }

  // Check if scroll buttons should be shown
  const shouldShowScrollButtons = (productCount: number) => {
    return productCount > 3
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <HeroCarousel heroSlides={heroSlides} />

      {/* Categories Section - Only show if there are categories with products */}
      {categoriesWithProducts.length > 0 && (
        <CategoriesCarousel categories={categories} />
      )}

      {/* Featured Products by Category - Only categories with products */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {categoriesWithProducts.map((category, index) => {
            const categoryProducts = productsByCategory[category._id] || []
            const CategoryIcon = getCategoryIcon(category.icon)
            const showScrollButtons = shouldShowScrollButtons(categoryProducts.length)
            const productCount = categoryProducts.length
            
            return (
              <div key={category._id} className="mb-6 ">
                {/* Category Header */}
                <div className="flex items-start justify-between mb-6 md:mb-8">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      {CategoryIcon && (
                        <div className="p-2 rounded-lg bg-brand-primary-soft shrink-0">
                          <CategoryIcon className="h-4 w-4 md:h-5 md:w-5 text-brand-primary" />
                        </div>
                      )}
                      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-dark">
                        {category.name}
                      </h2>
                      <Badge 
                        variant="secondary" 
                        className="bg-brand-accent-soft text-brand-accent border-0 text-xs font-semibold"
                      >
                        {productCount} {productCount === 1 ? 'item' : 'items'}
                      </Badge>
                    </div>
                    <p className="text-brand-muted text-xs md:text-sm mt-2 line-clamp-2 max-w-2xl">
                      {category.description || `Discover our latest ${category.name.toLowerCase()} collection`}
                    </p>
                  </div>

                  {/* Desktop View All Link */}
                  <Link
                    to="/categories/$slug"
                    params={{ slug: category.slug }}
                    className="hidden md:flex items-center gap-2 text-brand-primary text-sm font-semibold hover:text-brand-primary-hover transition-colors group shrink-0 ml-4"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Products Section */}
                <div className="relative">
                  {/* Scroll Buttons - Desktop only */}
                  {showScrollButtons && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl border-brand-primary-soft hover:border-brand-primary rounded-full hidden lg:flex h-10 w-10"
                        onClick={() => scrollLeft(category._id)}
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-4 w-4 text-brand-dark" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl border-brand-primary-soft hover:border-brand-primary rounded-full hidden lg:flex h-10 w-10"
                        onClick={() => scrollRight(category._id)}
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-4 w-4 text-brand-dark" />
                      </Button>
                    </>
                  )}

                  {/* Scrollable Products Container */}
                  <ScrollArea className="w-full rounded-none">
                    <div
                      ref={(el) => {
                        if (el) scrollRefs.current[category._id] = el
                      }}
                      className="flex gap-4 md:gap-5 pb-6 overflow-x-auto scrollbar-hide"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {/* Product Cards */}
                      {categoryProducts.map((product) => (
                        <div 
                          key={product._id} 
                          className="flex-none w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}

                      {/* View More Card */}
                      <div className="flex-none w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px]">
                        <Link
                          to="/categories/$slug"
                          params={{ slug: category.slug }}
                          className="block h-full"
                        >
                          <Card className="h-full border-brand-primary-soft hover:border-brand-primary transition-all duration-300 hover:shadow-lg group cursor-pointer bg-gradient-to-br from-white to-brand-surface">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px] md:min-h-[340px]">
                              <div className="w-14 h-14 md:w-16 md:h-16 mb-4 rounded-full bg-brand-primary-soft flex items-center justify-center group-hover:bg-brand-primary transition-all duration-300 group-hover:scale-110">
                                <Package className="h-6 w-6 md:h-7 md:w-7 text-brand-primary group-hover:text-white transition-colors" />
                              </div>
                              <h3 className="text-sm md:text-base font-bold text-brand-dark mb-2">
                                View All {category.name}
                              </h3>
                              <p className="text-xs text-brand-muted mb-4 line-clamp-2">
                                Explore complete {category.name.toLowerCase()} collection
                              </p>
                              <Badge className="bg-brand-accent-soft text-brand-accent hover:bg-brand-accent-soft border-0 text-xs font-semibold">
                                {productCount}+ items
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-brand-primary group-hover:text-brand-primary-hover mt-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    </div>
                    <ScrollBar orientation="horizontal" className="lg:hidden" />
                  </ScrollArea>
                </div>

                {/* Mobile View All Link */}
                <div className="mt-3 text-center md:hidden">
                  <Link
                    to="/categories/$slug"
                    params={{ slug: category.slug }}
                    className="inline-flex items-center gap-2 text-brand-primary text-sm font-semibold hover:text-brand-primary-hover transition-colors"
                  >
                    View All {category.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Category Separator */}
                {index < categoriesWithProducts.length - 1 && (
                  <Separator className="mt-2 bg-gradient-to-r from-transparent via-brand-primary-soft to-transparent" />
                )}
              </div>
            )
          })}

          {/* Empty State - No categories with products */}
          {categoriesWithProducts.length === 0 && (
            <div className="text-center py-16 md:py-24">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-brand-primary-soft flex items-center justify-center">
                <Telescope className="h-10 w-10 md:h-12 md:w-12 text-brand-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-3">
                Coming Soon!
              </h3>
              <p className="text-brand-muted text-sm md:text-base max-w-md mx-auto">
                We're preparing amazing products for you. 
                Check back soon for our latest collections.
              </p>
              <Button 
                className="mt-6 bg-brand-primary text-white hover:bg-brand-primary-hover"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Premium Membership */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-brand-primary-soft to-brand-accent-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 md:mb-5 bg-gradient-to-r from-brand-accent to-brand-primary text-white border-0 text-xs md:text-sm px-3 py-1.5">
              <Crown className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1.5" />
              Exclusive Membership
            </Badge>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark mb-4 md:mb-5">
              Join Our Fashion Community
            </h2>
            
            <p className="text-brand-muted text-sm sm:text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
              Get early access to sales, personalized recommendations, and exclusive offers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base"
              >
                Sign Up Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-brand-primary/30 hover:border-brand-primary hover:bg-brand-primary-soft text-brand-dark transition-all duration-300 px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}