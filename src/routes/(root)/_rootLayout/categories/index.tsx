import { categoriesQuery } from '@/api/queries'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  Sparkles as SparklesIcon, 
  Zap, 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  Clock 
} from 'lucide-react'

export const Route = createFileRoute('/(root)/_rootLayout/categories/')({
  component: CategoriesPage,
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(categoriesQuery())
  },
})

function CategoriesPage() {
  const categories = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero Section - Premium gradient header */}
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4 sm:mb-6">
              <SparklesIcon className="w-4 h-4 text-brand-accent" />
              <span className="text-xs sm:text-sm font-medium text-white">Discover Your Style</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
              Explore All Categories
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              Browse through our extensive collection of products. We're constantly adding 
              new categories to bring you more options!
            </p>
          </div>
        </div>
        
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 text-brand-surface" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path fill="currentColor" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {categories.map((category) => {
              const imageUrl = category.icon || '/placeholder-category.png'

              return (
                <Link
                  key={category._id}
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-xl transition-all duration-200"
                >
                  <Card className="relative overflow-hidden bg-white border border-brand-primary-soft hover:border-brand-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0 h-full">
                    {/* Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-brand-surface">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-category.png'
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1">
                          <span className="text-[10px] sm:text-xs font-medium text-brand-primary">
                            Featured
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Info - Improved typography */}
                    <div className="p-3 sm:p-4 md:p-5">
                      <h3 className="font-semibold text-brand-dark text-sm sm:text-base md:text-lg mb-1 line-clamp-2 group-hover:text-brand-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-brand-muted text-xs sm:text-sm line-clamp-2">
                        Discover amazing products in this category
                      </p>
                      <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <span className="text-brand-primary text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Shop Now →
                        </span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-primary-soft flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-primary-soft mb-4">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-brand-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-brand-dark mb-2">
              No Categories Found
            </h3>
            <p className="text-brand-muted text-sm sm:text-base">
              Categories are being added. Check back soon!
            </p>
          </div>
        )}

        {/* Statistics Section - Premium stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-brand-primary-soft group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
              {categories.length}+
            </div>
            <div className="text-brand-muted text-xs sm:text-sm font-medium">Categories</div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-brand-primary-soft group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-accent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
              50+
            </div>
            <div className="text-brand-muted text-xs sm:text-sm font-medium">Coming Soon</div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-brand-primary-soft group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-success mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
              10K+
            </div>
            <div className="text-brand-muted text-xs sm:text-sm font-medium">Products</div>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-brand-primary-soft group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-warning mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-brand-muted text-xs sm:text-sm font-medium">Support</div>
          </div>
        </div>

        {/* Information Section - Enhanced feature cards */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark mb-3 sm:mb-4">
              Why Shop by Category?
            </h2>
            <p className="text-brand-muted text-sm sm:text-base max-w-2xl mx-auto">
              Experience a smarter way to shop with our organized category system
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 - Curated Selection */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-primary-soft hover:-translate-y-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-brand-primary-soft flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-brand-dark text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                Curated Selection
              </h3>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                Each category is carefully curated to bring you the best products 
                from trusted sellers, ensuring quality and variety.
              </p>
              <div className="mt-4 sm:mt-5 md:mt-6">
                <span className="text-brand-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more 
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Feature 2 - Fast Navigation */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-primary-soft hover:-translate-y-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-brand-primary-soft flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-brand-dark text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                Fast Navigation
              </h3>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                Quickly find what you're looking for with our organized category 
                structure and intelligent search filters.
              </p>
              <div className="mt-4 sm:mt-5 md:mt-6">
                <span className="text-brand-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse now
                  <Zap className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Feature 3 - Growing Daily */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-primary-soft hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-brand-primary-soft flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-brand-dark text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                Growing Daily
              </h3>
              <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                We add new categories regularly based on customer requests and 
                market trends to keep our selection fresh.
              </p>
              <div className="mt-4 sm:mt-5 md:mt-6">
                <span className="text-brand-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Stay updated
                  <Plus className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-brand-primary-soft to-brand-surface rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-dark mb-3 sm:mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-brand-muted text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto">
            Suggest a new category and help us improve your shopping experience
          </p>
          <Button className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-6 sm:px-8 py-2.5 sm:py-3">
            Suggest a Category
          </Button>
        </div>
      </div>
    </div>
  )
}