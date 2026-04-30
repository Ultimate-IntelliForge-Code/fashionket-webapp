import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductGrid, ProductListItem } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Grid3x3, List, Filter, X, ChevronDown } from "lucide-react";
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
    const categories = await context.queryClient.ensureQueryData(categoriesQuery());
    const category = await context.queryClient.ensureQueryData(
      categoryBySlugQuery(params.slug),
    );

    if (!category) {
      throw new Error("Category not found");
    }

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

    const productsData = await context.queryClient.ensureQueryData(
      productsQuery(filters),
    );

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

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
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

  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useProducts(filters);

  const products = productsResponse?.data ?? initialProducts;
  const pagination = productsResponse?.pagination ?? initialPagination;

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

  const handleFilterChange = (newFilters: Partial<IProductQueryFilters>) => {
    const updatedSearch: Record<string, any> = {
      ...searchParams,
      ...newFilters,
      page: 1,
    };

    Object.keys(updatedSearch).forEach((key) => {
      if (updatedSearch[key] === undefined || updatedSearch[key] === "") {
        delete updatedSearch[key];
      }
    });

    navigate({
      search: updatedSearch,
      replace: true,
    });
    setIsFilterOpen(false);
  };

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page }),
      replace: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      default:
        sortBy = "createdAt";
        sortOrder = "desc";
        break;
    }

    handleFilterChange({ sortBy, sortOrder });
  };

  const getCurrentSortValue = () => {
    const { sortBy, sortOrder } = filters;
    if (sortBy === "price" && sortOrder === "asc") return "price";
    if (sortBy === "price" && sortOrder === "desc") return "price_desc";
    if (sortBy === "soldCount") return "popularity";
    if (sortBy === "name") return "name";
    return "createdAt";
  };

  const totalProducts = pagination?.total || 0;
  const hasActiveFilters = !!(filters.search || filters.brand || 
    filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.tags);

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="self-start text-white/90 hover:text-white hover:bg-white/20 rounded-lg h-9 px-3"
              asChild
            >
              <Link to="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
            
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                {category.name}
              </h1>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                Explore our premium collection of {category.name.toLowerCase()}. 
                Find the perfect items that match your style and budget.
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-brand-surface" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path fill="currentColor" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <div className="sticky top-24">
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
              <div
                className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto animate-slide-up">
                <div className="sticky top-0 bg-white border-b border-brand-primary-soft px-4 py-4 flex items-center justify-between rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-brand-primary" />
                    <h3 className="text-lg font-semibold text-brand-dark">
                      Filters
                    </h3>
                    {hasActiveFilters && (
                      <span className="text-xs bg-brand-primary-soft text-brand-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-brand-primary-soft"
                  >
                    <X className="h-4 w-4 text-brand-dark" />
                  </Button>
                </div>
                <div className="p-5 pb-8">
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
            {/* Results Header */}
            <div className="mb-6 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
                  {category.name}
                </h2>
                <p className="text-sm text-brand-muted mt-1">
                  {isFetching ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand-primary-soft border-t-brand-primary" />
                      Loading...
                    </span>
                  ) : (
                    `Showing ${products.length} of ${totalProducts} products`
                  )}
                </p>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="lg:hidden flex-1 h-10 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft hover:border-brand-primary"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-brand-primary text-white rounded-full min-w-[20px] h-5 px-1.5 text-xs flex items-center justify-center">
                      {
                        Object.keys(filters).filter(
                          (k) =>
                            filters[k as keyof IProductQueryFilters] &&
                            !["categorySlug", "page", "limit", "sortBy", "sortOrder"].includes(k)
                        ).length
                      }
                    </span>
                  )}
                </Button>

                <div className="flex-1 lg:flex-none min-w-[160px]">
                  <div className="relative">
                    <select
                      className="w-full rounded-lg border border-brand-primary-soft bg-white px-3 py-2 text-sm text-brand-dark focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary-soft appearance-none cursor-pointer hover:border-brand-primary transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 0.75rem center",
                        backgroundSize: "1.25em 1.25em",
                        paddingRight: "2.5rem",
                      }}
                      value={getCurrentSortValue()}
                      onChange={(e) => handleSortChange(e.target.value)}
                      disabled={isFetching}
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="price">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popularity">Most Popular</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted pointer-events-none" />
                  </div>
                </div>

                {/* View Toggle */}
                <div className="hidden lg:flex items-center gap-1 rounded-lg border border-brand-primary-soft p-1 bg-white">
                  <Button
                    type="button"
                    size="sm"
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    className={cn(
                      "h-8 w-8 p-0 transition-all duration-200",
                      viewMode === "grid" && "bg-brand-primary text-white hover:bg-brand-primary-hover"
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
                      "h-8 w-8 p-0 transition-all duration-200",
                      viewMode === "list" && "bg-brand-primary text-white hover:bg-brand-primary-hover"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2">
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
                  {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                    <FilterBadge
                      label="Price"
                      value={`${formatCurrency(filters.minPrice || 0)} - ${formatCurrency(filters.maxPrice || maxPrice)}`}
                      onRemove={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}
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
                      navigate({ search: { page: 1, limit: 12 }, replace: true });
                    }}
                    className="text-xs text-brand-muted hover:text-brand-dark h-7 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && products.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary-soft border-t-brand-primary mx-auto mb-4" />
                  <p className="text-brand-muted">Loading products...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">
                  No products found
                </h3>
                <p className="text-brand-muted mb-6 max-w-md">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <Button
                  onClick={() => navigate({ search: { page: 1, limit: 12 }, replace: true })}
                  className="bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Products Display */}
            {!isLoading && products.length > 0 && (
              <>
                {viewMode === "grid" ? (
                  <ProductGrid products={products} />
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <ProductListItem key={product._id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12 pt-4 border-t border-brand-primary-soft">
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