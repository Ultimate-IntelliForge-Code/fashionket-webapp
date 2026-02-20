import { Badge } from './badge'
import { Sparkles } from 'lucide-react'
import { ScrollArea, ScrollBar } from './scroll-area'
import { Link } from '@tanstack/react-router'
import { Card } from './card'
import type { ICategory } from '@/types'

interface CategoryProps {
  categories: ICategory[]
}

const CategoriesCarousel = ({ categories }: CategoryProps) => {
  return (
    <section className="py-2 sm:py-3 md:py-4">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header Section - Responsive sizing */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Badge className="mb-1 sm:mb-2 bg-gradient-to-r from-mmp-primary/20 to-mmp-accent/20 text-mmp-primary border-0 text-[8px] sm:text-[10px] px-2 sm:px-3 py-0.5 sm:py-1">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
            Browse Collections
          </Badge>
          <h2 className="text-sm sm:text-base md:text-xl font-bold text-mmp-primary2">
            Shop By Category
          </h2>
        </div>

        {/* Categories Container */}        
        <div className="relative">
          <ScrollArea className="w-full">
            <div className="flex gap-2 sm:gap-3 pb-2 sm:pb-3 md:pb-0">
              {categories.map((category) => {
                // Use the icon field as image URL
                const imageUrl = category.icon || '/placeholder-category.png'
                
                return (
                  <Link
                    key={category._id}
                    to="/categories/$slug"
                    params={{ slug: category.slug }}
                    className="block flex-none focus:outline-none focus-visible:ring-2 focus-visible:ring-mmp-secondary focus-visible:ring-offset-2 rounded-lg sm:rounded-xl"
                  >
                    <Card className="h-full border-mmp-primary/10 hover:border-mmp-secondary/50 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-md active:scale-[0.98] p-0">
                      {/* Image Container - Responsive sizing */}
                      <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-category.png'
                          }}
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                        
                        {/* Category Name - Responsive text */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-2.5 sm:p-3">
                          <h3 className="font-semibold text-white text-[8px] xs:text-[10px] sm:text-xs md:text-sm leading-tight drop-shadow-md line-clamp-2">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" className="h-1.5 sm:h-1" />
          </ScrollArea>
        </div>

        {/* Optional: Show item count on larger screens */}
        <div className="text-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-mmp-neutral/60">
          {categories.length} categories to explore
        </div>
      </div>
    </section>
  )
}

export default CategoriesCarousel