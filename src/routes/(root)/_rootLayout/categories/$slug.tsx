import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductGrid, ProductListItem } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Grid3x3, List, Filter, X } from "lucide-react";
import { ProductFilters } from "@/components/ui/product-filters";
import type { IProductQueryFilters } from "@/types";
import {
  categoriesQuery,
  categoryBySlugQuery,
  productsQuery,
} from "@/api/queries";
import { useProducts } from "@/api/hooks";
import { Pagination } from "@/components/ui/pagination";
import { FilterBadge } from "@/components/ui/filter-badge";
import { productSearchSchema } from "@/lib";


export const Route = createFileRoute("/(root)/_rootLayout/categories/$slug")({
  component: CategoryProductsPage,
  validateSearch: productSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, params, deps }) => {
    const categories =
      await context.queryClient.ensureQueryData(categoriesQuery());
    const category = await context.queryClient.ensureQueryData(
      categoryBySlugQuery(params.slug),
    );

    if (!category) {
      throw new Error("Category not found");
    }

    // Build filters from search params
    const filters: IProductQueryFilters = {
      categorySlug: params.slug,
      page: deps.search.page,
      limit: deps.search.limit,
      search: deps.search.search,
      brand: deps.search.brand,
      minPrice: deps.search.minPrice,
      maxPrice: deps.search.maxPrice,
      tags: deps.search.tags,
      sortBy: deps.search.sortBy,
      sortOrder: deps.search.sortOrder,
    };

    // Fetch products with filters
    const productsData = await context.queryClient.ensureQueryData(
      productsQuery(filters),
    );

    // Extract metadata from initial load (for filter options)
    const allProductsData = await context.queryClient.ensureQueryData(
      productsQuery({ categorySlug: params.slug, limit: 1000 }),
    );

    const allProducts = allProductsData.data;
    const brands = Array.from(
      new Set(allProducts.map((p) => p.brand).filter(Boolean)),
    ) as string[];
    const tags = Array.from(new Set(allProducts.flatMap((p) => p.tags)));
    const maxPrice = Math.max(...allProducts.map((p) => p.price), 0);

    return {
      categories,
      category,
      initialProducts: productsData.data,
      initialPagination: productsData.pagination,
      brands,
      tags,
      maxPrice,
    };
  },
});

function CategoryProductsPage() {
  const {
    category,
    initialProducts,
    initialPagination,
    brands,
    tags,
    maxPrice,
  } = Route.useLoaderData();

  const searchParams = Route.useSearch();
  const { slug } = Route.useParams();
  const navigate = Route.useNavigate();

  // Mobile filters state
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Initialize filters from URL search params
  const [filters, setFilters] = React.useState<IProductQueryFilters>({
    categorySlug: slug,
    page: searchParams.page || 1,
    limit: searchParams.limit || 12,
    search: searchParams.search,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    tags: searchParams.tags,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
  });

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Fetch products with current filters
  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useProducts(filters);

  // Use fetched products or fallback to initial
  const products = productsResponse?.data ?? initialProducts;
  const pagination = productsResponse?.pagination ?? initialPagination;

  // Sync filters with URL search params
  React.useEffect(() => {
    const newFilters: IProductQueryFilters = {
      categorySlug: slug,
      page: searchParams.page || 1,
      limit: searchParams.limit || 12,
      search: searchParams.search,
      brand: searchParams.brand,
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
      tags: searchParams.tags,
      sortBy: searchParams.sortBy,
      sortOrder: searchParams.sortOrder,
    };

    setFilters(newFilters);
  }, [
    slug,
    searchParams.page,
    searchParams.limit,
    searchParams.search,
    searchParams.brand,
    searchParams.minPrice,
    searchParams.maxPrice,
    searchParams.tags,
    searchParams.sortBy,
    searchParams.sortOrder,
  ]);

  /**
   * Update filters and URL search params
   */
  const handleFilterChange = (newFilters: Partial<IProductQueryFilters>) => {
    // Build updated search params
    const updatedSearch: Record<string, any> = {
      ...searchParams,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    };

    // Remove undefined values
    Object.keys(updatedSearch).forEach((key) => {
      if (updatedSearch[key] === undefined || updatedSearch[key] === "") {
        delete updatedSearch[key];
      }
    });

    // Update URL
    navigate({
      search: updatedSearch,
      replace: true,
    });

    // Close mobile filter drawer after applying
    setIsFilterOpen(false);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page }),
      replace: true,
    });
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (sortValue: string) => {
    let sortBy: string;
    let sortOrder: "asc" | "desc" = "asc";

    switch (sortValue) {
      case "price":
        sortBy = "price";
        sortOrder = "asc";
        break;
      case "price_desc":
        sortBy = "price";
        sortOrder = "desc";
        break;
      case "popularity":
        sortBy = "soldCount";
        sortOrder = "desc";
        break;
      case "name":
        sortBy = "name";
        sortOrder = "asc";
        break;
      case "createdAt":
      default:
        sortBy = "createdAt";
        sortOrder = "desc";
        break;
    }

    handleFilterChange({ sortBy, sortOrder });
  };

  /**
   * Get current sort value for select
   */
  const getCurrentSortValue = () => {
    const { sortBy, sortOrder } = filters;

    if (sortBy === "price" && sortOrder === "asc") return "price";
    if (sortBy === "price" && sortOrder === "desc") return "price_desc";
    if (sortBy === "soldCount") return "popularity";
    if (sortBy === "name") return "name";
    return "createdAt";
  };

  const totalProducts = pagination?.total || 0;
  const hasActiveFilters =
    filters.search ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.tags;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header - Responsive */}
      <div className="bg-gradient-to-r from-mmp-primary to-mmp-primary2">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <Button
                variant="ghost"
                size="sm"
                className="mb-3 sm:mb-4 text-white/90 hover:text-white hover:bg-white/20 -ml-2 sm:ml-0 h-8 sm:h-9 px-2 sm:px-3"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Back to Categories</span>
                </Link>
              </Button>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                {category.name}
              </h1>
              <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed">
                Explore our premium collection of {category.name.toLowerCase()}.
                Find the perfect items that match your style and budget.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:w-64 xl:w-72">
            <div className="sticky top-4">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                brands={brands}
                tags={tags}
                maxPrice={maxPrice}
              />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsFilterOpen(false)}
              />

              {/* Drawer - Slide from bottom on mobile */}
              <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto animate-slide-up">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-2xl">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 pb-8">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    brands={brands}
                    tags={tags}
                    maxPrice={maxPrice}
                    isMobile={true}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header - Mobile Optimized */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col gap-3">
                {/* Title and count */}
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {isFetching ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-mmp-primary" />
                        Loading...
                      </span>
                    ) : (
                      <>
                        Showing {products.length} of {totalProducts} products
                      </>
                    )}
                  </p>
                </div>

                {/* Mobile Controls Row */}
                <div className="flex items-center gap-2">
                  {/* Filter Button - Mobile Only */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-1.5 sm:ml-2 bg-mmp-primary text-white rounded-full min-w-[20px] h-5 px-1 text-xs flex items-center justify-center">
                        {
                          Object.keys(filters).filter(
                            (k) =>
                              filters[k as keyof IProductQueryFilters] &&
                              ![
                                "categorySlug",
                                "page",
                                "limit",
                                "sortBy",
                                "sortOrder",
                              ].includes(k),
                          ).length
                        }
                      </span>
                    )}
                  </Button>

                  {/* Sort Dropdown - Responsive */}
                  <div className="flex-1 lg:flex-none">
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 sm:px-3 py-2 text-xs sm:text-sm focus:border-mmp-primary focus:outline-none focus:ring-1 focus:ring-mmp-primary appearance-none bg-no-repeat bg-right"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 0.5rem center",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                      value={getCurrentSortValue()}
                      onChange={(e) => handleSortChange(e.target.value)}
                      disabled={isFetching}
                    >
                      <option value="createdAt">Newest</option>
                      <option value="price">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popularity">Popularity</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  {/* View Mode Toggle - Desktop Only */}
                  <div className="hidden lg:flex items-center gap-1 rounded-lg border border-gray-300 p-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      className={cn(
                        "h-8 w-8 p-0",
                        viewMode === "grid"
                          ? "bg-mmp-primary text-white hover:bg-mmp-primary2"
                          : "",
                      )}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={viewMode === "list" ? "default" : "ghost"}
                      className={cn(
                        "h-8 w-8 p-0",
                        viewMode === "list"
                          ? "bg-mmp-primary text-white hover:bg-mmp-primary2"
                          : "",
                      )}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters - Responsive */}
              {hasActiveFilters && (
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  {filters.search && (
                    <FilterBadge
                      label="Search"
                      value={filters.search}
                      onRemove={() => handleFilterChange({ search: undefined })}
                      color="blue"
                    />
                  )}
                  {filters.brand && (
                    <FilterBadge
                      label="Brand"
                      value={filters.brand}
                      onRemove={() => handleFilterChange({ brand: undefined })}
                      color="green"
                    />
                  )}
                  {(filters.minPrice !== undefined ||
                    filters.maxPrice !== undefined) && (
                    <FilterBadge
                      label="Price"
                      value={`${formatCurrency(filters.minPrice || 0)} - ${formatCurrency(filters.maxPrice || maxPrice)}`}
                      onRemove={() =>
                        handleFilterChange({
                          minPrice: undefined,
                          maxPrice: undefined,
                        })
                      }
                      color="purple"
                    />
                  )}
                  {filters.tags && (
                    <FilterBadge
                      label="Tag"
                      value={filters.tags}
                      onRemove={() => handleFilterChange({ tags: undefined })}
                      color="amber"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate({
                        search: { page: 1, limit: 12 },
                        replace: true,
                      });
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 h-6 sm:h-7 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && products.length === 0 && (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div className="text-center">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-3 border-gray-200 border-t-mmp-primary mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">
                    Loading products...
                  </p>
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4">
                <div className="mb-3 sm:mb-4 text-4xl sm:text-6xl">🔍</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <Button
                  size="sm"
                  className="h-9 sm:h-10 px-4 sm:px-6"
                  onClick={() => {
                    navigate({
                      search: { page: 1, limit: 12 },
                      replace: true,
                    });
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && products.length > 0 && (
              <>
                {viewMode === "grid" ? (
                  <ProductGrid products={products} />
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {products.map((product) => (
                      <ProductListItem key={product._id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      meta={pagination}
                      onPageChange={handlePageChange}
                      showInfo={true}
                      showPageSize={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
