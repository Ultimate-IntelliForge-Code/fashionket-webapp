import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProductGrid, ProductListItem } from "@/components/ui/product-card";
import { CompactPagination, Pagination } from "@/components/ui/pagination";
import { Filter, Grid3X3, List, RefreshCcw, X, ChevronDown } from "lucide-react";
import { ProductFilters } from "@/components/ui/product-filters";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "@/components/ui/filter-badge";
import React from "react";
import { IProductQueryFilters } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { VendorProfile } from "@/components/vendor/vendor-profile";
import { useVendorBySlug, useVendorbySlugProducts } from "@/api/hooks";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

export const Route = createFileRoute("/(root)/_rootLayout/vendors/$slug")({
  component: VendorDetailPage,
  validateSearch: z
    .object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      brand: z.string().optional(),
      minPrice: z.coerce.number().optional(),
      maxPrice: z.coerce.number().optional(),
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
  params: {
    parse: (params) =>
      z
        .object({
          slug: z.string().min(1),
        })
        .parse(params),
  },
});

function VendorDetailPage() {
 
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
  const {data, isLoading, error, refetch } = useVendorbySlugProducts(Route.useParams().slug);
  const { data: vendor, isLoading: vendorLoading, error: vendorError } = useVendorBySlug(Route.useParams().slug);

    const products = data?.data || [];
      const meta = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0  };

      const brands = Array.from(
        new Set(products.map((p) => p.brand).filter(Boolean)),
      ) as string[];
      const tags = Array.from(new Set(products.flatMap((p) => p.tags)));
      const maxPrice = products.length
        ? Math.max(...products.map((p) => p.price ?? 0))
        : 0;
      
  
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

  const getCurrentSortValue = () => {
    const { sortBy, sortOrder } = search;
    if (sortBy === "price" && sortOrder === "asc") return "price";
    if (sortBy === "price" && sortOrder === "desc") return "price_desc";
    if (sortBy === "soldCount") return "popularity";
    if (sortBy === "name") return "name";
    return "createdAt";
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const totalProducts = meta?.total || 0;
  const startItem = Math.min((meta.page - 1) * meta.limit + 1, totalProducts);
  const endItem = Math.min(meta.page * meta.limit, totalProducts);


    if (isLoading || vendorLoading) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error || vendorError) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Unable to Load Orders"
              error={error}
              onRetry={() => {
                refetch();
              }}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Vendor Hero Section */}
      <VendorProfile
        vendor={vendor!}
        refresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Products Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                  <p className="text-sm text-brand-muted">
                    Showing {startItem}-{endItem} of {totalProducts} products
                    {search.search && ` for "${search.search}"`}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-brand-primary hover:text-brand-primary-hover text-xs h-7 px-2 justify-start w-fit"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
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
                        Object.keys(search).filter(
                          (k) =>
                            search[k as keyof typeof search] &&
                            !["page", "limit", "sortBy", "sortOrder"].includes(k),
                        ).length
                      }
                    </span>
                  )}
                </Button>

                {/* View Mode Toggle - Desktop */}
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
                    <Grid3X3 className="h-4 w-4" />
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
                      value={getCurrentSortValue()}
                      onChange={(e) => handleSortChange(e.target.value)}
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
                      onRemove={() => handleFilterChange({ brand: undefined })}
                      color="green"
                    />
                  )}
                  {(search.minPrice !== undefined || search.maxPrice !== undefined) && (
                    <FilterBadge
                      label="Price"
                      value={`${formatCurrency(search.minPrice || 0)} - ${formatCurrency(search.maxPrice || maxPrice)}`}
                      onRemove={() =>
                        handleFilterChange({ minPrice: undefined, maxPrice: undefined })
                      }
                      color="purple"
                    />
                  )}
                  {search.tags && (
                    <FilterBadge
                      label="Tag"
                      value={search.tags}
                      onRemove={() => handleFilterChange({ tags: undefined })}
                      color="amber"
                    />
                  )}
                  {/* {search.categoryId && (
                    <FilterBadge
                      label="Category"
                      value={search.categoryId}
                      onRemove={() => handleFilterChange({ categoryId: undefined })}
                      color="blue"
                    />
                  )} */}
                </div>
              )}
            </div>

            {/* Loading/Refresh State */}
            {isRefreshing ? (
              <div className="py-20 text-center">
                <RefreshCcw className="mx-auto h-10 w-10 animate-spin text-brand-primary" />
                <p className="mt-4 text-brand-muted">Refreshing products...</p>
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">
                  No products found
                </h3>
                <p className="text-brand-muted mb-6 max-w-md">
                  Try adjusting your filters or search terms to find what you're looking for.
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
                {/* Products Grid/List */}
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
                      Page {meta.page} of {meta.totalPages}
                      <span className="mx-2">•</span>
                      <span>{totalProducts.toLocaleString()} total products</span>
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