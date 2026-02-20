import { createFileRoute } from '@tanstack/react-router'
import React, { useRef } from 'react'
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

// Hero Carousel Data
const heroSlides: HeroType[] = [
  {
    id: '1',
    title: 'Summer Collection 2024',
    subtitle: 'Discover the Latest Trends',
    description: 'Up to 50% off on selected items. Limited time offer.',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=600&fit=crop',
    cta: 'Shop Now',
    bgColor: 'from-mmp-primary/90 to-mmp-accent/70',
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
    bgColor: 'from-mmp-primary2/90 to-mmp-secondary/70',
    textColor: 'text-mmp-neutral',
  },
  {
    id: '3',
    title: 'Sustainable Fashion',
    subtitle: 'Eco-Friendly Choices',
    description: 'Organic materials, ethical production, timeless designs',
    image:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=600&fit=crop',
    cta: 'Discover',
    bgColor: 'from-mmp-accent/90 to-mmp-secondary/70',
    textColor: 'text-white',
  },
]

// Icon mapping
const iconMap: Record<string, any> = {
  Shirt,
  Watch,
  Glasses,
  Sparkles,
  TrendingUp,
  Zap,
  Crown,
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

  const scrollLeft = (categoryId: string) => {
    const scrollContainer = scrollRefs.current[categoryId]
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -200, behavior: 'smooth' }) // Reduced scroll amount for mobile
    }
  }

  const scrollRight = (categoryId: string) => {
    const scrollContainer = scrollRefs.current[categoryId]
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 200, behavior: 'smooth' }) // Reduced scroll amount for mobile
    }
  }

  // Group products by category
  const productsByCategory = categories.reduce(
    (acc, category) => {
      acc[category._id] = products.data
        .filter((p) => p.categoryId === category._id)
        .slice(0, 10)

      return acc
    },
    {} as Record<string, IProductListItem[]>,
  )

  return (
    <div className="overflow-x-hidden"> {/* Prevent horizontal overflow */}
      {/* Hero Carousel */}
      <HeroCarousel heroSlides={heroSlides} />

      {/* Categories Section */}
      <CategoriesCarousel categories={categories} />

      {/* Featured Products by Category */}
      <section className="md:pb-16">
        <div className="container mx-auto px-3 sm:px-4">
          {categories.slice(0, 5).map((category) => (
            <div key={category._id} className="mb-8 md:mb-12">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {iconMap[category.icon] && (
                      <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-mmp-primary/10 to-mmp-accent/10 flex-shrink-0">
                        {React.createElement(iconMap[category.icon], {
                          className: 'h-4 w-4 sm:h-5 sm:w-5 text-mmp-accent',
                        })}
                      </div>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-mmp-primary2 truncate">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-mmp-accent text-[10px] sm:text-xs mt-1 truncate">
                    Discover our latest {category.name.toLowerCase()} collection
                  </p>
                </div>

                {/* Desktop View All Link */}
                <Link
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="hidden md:flex items-center gap-2 text-mmp-accent text-sm hover:text-mmp-secondary font-medium group flex-shrink-0 ml-4"
                >
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Products Grid - Horizontal Scroll */}
              <div className="relative">
                {/* Scroll Buttons for Desktop */}
                {productsByCategory[category._id].length > 3 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-mmp-neutral border-mmp-primary/20 hidden lg:flex"
                      onClick={() => scrollLeft(category._id)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-mmp-neutral border-mmp-primary/20 hidden lg:flex"
                      onClick={() => scrollRight(category._id)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Scrollable Products Container */}
                <ScrollArea className="w-full">
                  <div
                    // ref={(el) => (scrollRefs.current[category._id] = el)}
                    className="flex gap-3 sm:gap-4 pb-4"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {/* Products - First 5 */}
                    {productsByCategory[category._id]
                      ?.slice(0, 5)
                      .map((product) => (
                        <div key={product._id} className="flex-none w-[140px] sm:w-[180px] md:w-[200px]">
                          <ProductCard product={product} />
                        </div>
                      ))}

                    {/* Products - Next 5 (if available) */}
                    {productsByCategory[category._id]?.length > 5 && (
                      <>
                        {productsByCategory[category._id]
                          ?.slice(5, 10)
                          .map((product) => (
                            <div key={product._id} className="flex-none w-[140px] sm:w-[180px] md:w-[200px]">
                              <ProductCard product={product} />
                            </div>
                          ))}
                      </>
                    )}

                    {/* View More Card - Only show if there are products */}
                    {productsByCategory[category._id].length > 0 && (
                      <div className="flex-none w-[140px] sm:w-[180px] md:w-[200px]">
                        <Link
                          to="/categories/$slug"
                          params={{ slug: category.slug }}
                        >
                          <Card className="h-full border-mmp-primary/20 hover:border-mmp-secondary/50 transition-all duration-300 hover:shadow-lg group">
                            <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center h-full">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-mmp-primary/10 to-mmp-accent/10 flex items-center justify-center group-hover:from-mmp-accent/20 group-hover:to-mmp-secondary/20 transition-all">
                                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-mmp-accent group-hover:text-mmp-secondary transition-colors" />
                              </div>
                              <h3 className="text-xs sm:text-sm font-bold text-mmp-primary2 line-clamp-2">
                                View All {category.name}
                              </h3>
                              <p className="text-[10px] sm:text-xs text-mmp-neutral/60 mt-1 line-clamp-2">
                                Explore collection
                              </p>
                              <Badge className="mt-2 bg-gradient-to-r from-mmp-accent/20 to-mmp-secondary/20 text-mmp-accent border-0 text-[8px] sm:text-xs">
                                {productsByCategory[category._id]?.length}+ items
                              </Badge>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    )}

                    {/* Empty State */}
                    {productsByCategory[category._id].length <= 0 && (
                      <div className="flex-none w-full">
                        <Card className="border-mmp-primary/20">
                          <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full bg-gradient-to-br from-mmp-primary/10 to-mmp-accent/10 flex items-center justify-center">
                              <Telescope className="h-6 w-6 sm:h-8 sm:w-8 text-mmp-accent" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-mmp-primary2 mb-2">
                              Nothing here yet
                            </h3>
                            <p className="text-xs sm:text-sm text-mmp-accent mb-2">
                              We're adding new products behind the scenes.
                            </p>
                            <p className="text-[10px] sm:text-xs text-mmp-primary/70">
                              Check back soon — you won't miss out 👀
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                  <ScrollBar orientation="horizontal" className="flex" />
                </ScrollArea>
              </div>
              <Separator className="mt-2bg-gradient-to-r from-transparent via-mmp-primary/20 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-mmp-primary/5 to-mmp-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-3 md:mb-4 bg-gradient-to-r from-mmp-accent to-mmp-secondary text-white border-0 text-xs md:text-sm">
              <Crown className="h-3 w-3 mr-1" />
              Exclusive Membership
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-mmp-primary2 mb-3 md:mb-4">
              Join Our Fashion Community
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-mmp-neutral/60 mb-6 md:mb-8 px-4">
              Get early access to sales, personalized recommendations, and
              exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="default"
                className="bg-gradient-to-r from-mmp-accent to-mmp-secondary hover:opacity-90 text-white border-0 px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
              >
                Sign Up Free
              </Button>
              <Button
                size="default"
                variant="outline"
                className="border-2 border-mmp-primary/30 hover:border-mmp-secondary/50 px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
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