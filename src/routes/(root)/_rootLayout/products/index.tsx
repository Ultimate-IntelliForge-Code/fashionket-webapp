import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProductGrid, ProductListItem } from "@/components/ui/product-card";
import { ProductFilters } from "@/components/ui/product-filters";
import { Pagination, CompactPagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { IProductQueryFilters } from "@/types";
import { Filter, Grid3x3, List, RefreshCw, X, Sparkles } from "lucide-react";
import { productsQuery } from "@/api/queries";
import { FilterBadge } from "@/components/ui/filter-badge";

export const Route = createFileRoute("/(root)/_rootLayout/products/")({
  component: ProductsPage,
  validateSearch: z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      brand: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      tags: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .transform((s) => ({
      page: s.page ?? 1,
      limit: s.limit ?? 12,
      search: s.search ?? "",
      categoryId: s.categoryId,
      brand: s.brand,
      minPrice: s.minPrice,
      maxPrice: s.maxPrice,
      tags: s.tags,
      sortBy: s.sortBy ?? "createdAt",
      sortOrder: s.sortOrder ?? "desc",
    })),
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
    search: search.search,
    categoryId: search.categoryId,
    brand: search.brand,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    tags: search.tags,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
  }),
  loader: async ({ context, deps }) => {
    const data = await context.queryClient.ensureQueryData(productsQuery(deps));
    const products = data.data;
    const meta = data.pagination;

    const brands = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean)),
    ) as string[];
    const tags = Array.from(new Set(products.flatMap((p) => p.tags)));
    const maxPrice = Math.max(...products.map((p) => p.price), 0);

    return { products, meta, brands, tags, maxPrice };
  },
});

function ProductsPage() {
  const { products, meta, brands, tags, maxPrice } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
  
  const hasActiveFilters = React.useMemo(() => {
    return Boolean(
      search.search ||
      search.categoryId ||
      search.brand ||
      search.minPrice !== undefined ||
      search.maxPrice !== undefined ||
      search.tags ||
      search.sortBy !== "createdAt" ||
      search.sortOrder !== "desc",
    );
  }, [search]);

  const handleFilterChange = (newFilters: Partial<IProductQueryFilters>) => {
    const updatedFilters = { ...newFilters, page: 1 };
    navigate({
      search: (prev) => ({ ...prev, ...updatedFilters }),
      replace: true,
    });
    setIsFilterOpen(false);
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

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page }),
      replace: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    navigate({
      search: {
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      replace: true,
    });
    setIsFilterOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
  };

  const getSortValue = () => {
    const { sortBy, sortOrder } = search;
    if (sortBy === "price" && sortOrder === "asc") return "price";
    if (sortBy === "price" && sortOrder === "desc") return "price_desc";
    if (sortBy === "soldCount") return "popularity";
    if (sortBy === "name") return "name";
    return "createdAt";
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span className="text-xs sm:text-sm font-medium text-white">Premium Collection</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Our Collection
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-lg h-10 w-10 transition-all duration-200"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
            
            <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
              Discover premium fashion items from top brands. Filter by category, price, 
              brand, and more to find exactly what you're looking for.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {meta?.total?.toLocaleString() || products.length}+
                </div>
                <div className="text-xs sm:text-sm text-white/80">Products</div>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {brands.length}
                </div>
                <div className="text-xs sm:text-sm text-white/80">Brands</div>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {tags.length}
                </div>
                <div className="text-xs sm:text-sm text-white/80">Categories</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom curve */}
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
                filters={search}
                onFilterChange={handleFilterChange}
                brands={brands}
                tags={tags}
                maxPrice={maxPrice}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full h-11 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft hover:border-brand-primary transition-all"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters & Sort
              {hasActiveFilters && (
                <span className="ml-2 bg-brand-primary text-white rounded-full min-w-[20px] h-5 px-1.5 text-xs font-medium flex items-center justify-center">
                  {Object.keys(search).filter(
                    (k) =>
                      search[k as keyof typeof search] &&
                      !["page", "limit", "sortBy", "sortOrder"].includes(k)
                  ).length}
                </span>
              )}
            </Button>
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
                    <h3 className="text-lg font-semibold text-brand-dark">Filters</h3>
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
                    filters={search}
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
                  All Products
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <p className="text-sm text-brand-muted">
                    Showing {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}-
                    {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
                    {search.search && ` for "${search.search}"`}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-brand-primary hover:text-brand-primary-hover text-xs h-6 px-2"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 rounded-lg border border-brand-primary-soft p-1 bg-white">
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

                {/* Sort Dropdown */}
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
                      value={getSortValue()}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="price">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popularity">Most Popular</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {search.search && (
                    <FilterBadge
                      label="Search"
                      value={search.search}
                      onRemove={() => handleFilterChange({ search: "" })}
                      color="blue"
                    />
                  )}
                  {search.brand && (
                    <FilterBadge
                      label="Brand"
                      value={search.brand}
                      onRemove={() => handleFilterChange({ brand: "" })}
                      color="green"
                    />
                  )}
                  {(search.minPrice !== undefined || search.maxPrice !== undefined) && (
                    <FilterBadge
                      label="Price"
                      value={`${formatCurrency(search.minPrice || 0)} - ${formatCurrency(search.maxPrice || maxPrice)}`}
                      onRemove={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}
                      color="purple"
                    />
                  )}
                  {search.tags && (
                    <FilterBadge
                      label="Tag"
                      value={search.tags}
                      onRemove={() => handleFilterChange({ tags: "" })}
                      color="amber"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Loading/Refreshing State */}
            {isRefreshing ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-10 w-10 animate-spin text-brand-primary" />
                  <p className="mt-4 text-brand-muted">Refreshing products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">
                  No products found
                </h3>
                <p className="text-brand-muted mb-6 max-w-md">
                  Try adjusting your filters or search term to find what you're looking for.
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    className="bg-brand-primary text-white hover:bg-brand-primary-hover"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Products Display */}
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
                {meta.totalPages > 1 && (
                  <div className="mt-12 pt-4 border-t border-brand-primary-soft">
                    {/* Desktop Pagination */}
                    <div className="hidden md:block">
                      <Pagination
                        meta={meta}
                        onPageChange={handlePageChange}
                        showInfo={false}
                        showPageSize={false}
                      />
                    </div>
                    {/* Mobile Pagination */}
                    <div className="md:hidden">
                      <CompactPagination
                        meta={meta}
                        onPageChange={handlePageChange}
                      />
                    </div>

                    {/* Page Info */}
                    <div className="mt-4 text-center text-sm text-brand-muted">
                      Page {meta.page} of {meta.totalPages} •{' '}
                      {meta.total.toLocaleString()} total products
                    </div>
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