import { categoriesQuery } from '@/api/queries'
import { Card } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Sparkles as SparklesIcon, Zap, Plus } from 'lucide-react'

export const Route = createFileRoute('/(root)/_rootLayout/categories/')({
  component: CategoriesPage,
  loader: async ({ context }) => {
   return context.queryClient.ensureQueryData(categoriesQuery())
  },
})

function CategoriesPage() {
  const categories = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header - Responsive padding and text */}
      <div className="bg-gradient-to-r from-mmp-primary to-mmp-primary2 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
              Explore All Categories
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed">
              Browse through our extensive collection of products. We're
              constantly adding new categories to bring you more options!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Categories Grid - Fully responsive */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {categories.map((category) => {
            const imageUrl = category.icon || '/placeholder-category.png'

            return (
              <Link
                key={category._id}
                to="/categories/$slug"
                params={{ slug: category.slug }}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-mmp-secondary focus-visible:ring-offset-2 rounded-lg sm:rounded-xl"
              >
                <Card className="h-full border-mmp-primary/10 hover:border-mmp-secondary/50 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-lg hover:translate-y-[-2px] p-0">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-category.png'
                      }}
                    />
                    {/* Dark overlay with gradient - Adjusted for mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                    {/* Category Name with hover effect - Responsive sizing */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 transition-transform duration-300 group-hover:translate-y-[-2px] sm:group-hover:translate-y-[-4px]">
                      <h3 className="font-semibold text-white text-xs xs:text-sm sm:text-base md:text-lg leading-tight drop-shadow-lg line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-[8px] xs:text-[10px] sm:text-xs text-white/80 mt-0.5 sm:mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Shop Now →
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Stats Section - Responsive grid and text */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 my-8 sm:my-10 md:my-12">
          <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-mmp-primary mb-0.5 sm:mb-1">
              {categories.length}+
            </div>
            <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 truncate">Categories</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-mmp-accent mb-0.5 sm:mb-1">50+</div>
            <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 truncate">Coming Soon</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-mmp-secondary mb-0.5 sm:mb-1">
              10K+
            </div>
            <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 truncate">Products</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center shadow-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-500 mb-0.5 sm:mb-1">24/7</div>
            <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 truncate">New Additions</div>
          </div>
        </div>

        {/* Info Section - Responsive layout */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            How Categories Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-mmp-primary/10 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-mmp-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Curated Selection</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Each category is carefully curated to bring you the best
                products from trusted sellers.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-mmp-secondary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-mmp-secondary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Fast Navigation</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Quickly find what you're looking for with our organized category
                structure.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3 sm:col-span-2 md:col-span-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-mmp-accent/10 flex items-center justify-center">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-mmp-accent" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Growing Daily</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                We add new categories regularly based on customer requests and
                market trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}