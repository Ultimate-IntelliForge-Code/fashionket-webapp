import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { vendorBySlugQuery, vendorProductsBySlugQuery } from "@/api/queries";
import { VendorHero } from "@/components/vendor/vendor-hero";
import { VendorInfo } from "@/components/vendor/vendor-info";
import { ProductGrid, ProductListItem } from "@/components/ui/product-card";
import { CompactPagination, Pagination } from "@/components/ui/pagination";
import { Filter, Grid3X3, List, RefreshCcw, X } from "lucide-react";
import { ProductFilters } from "@/components/ui/product-filters";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "@/components/ui/filter-badge";
import React from "react";
import { IProductQueryFilters } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { VendorProfile } from "@/components/vendor/vendor-profile";

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
  params: {
    parse: (params) =>
      z
        .object({
          slug: z.string().min(1),
        })
        .parse(params),
  },
  loader: async ({ context, deps, params }) => {
    try {
      const [vendor, data] = await Promise.all([
        context.queryClient.ensureQueryData(vendorBySlugQuery(params.slug)),
        context.queryClient.ensureQueryData(
          vendorProductsBySlugQuery(params.slug, deps),
        ),
      ]);

      console.log({ vendor, data });

      const products = data.data;
      const meta = data.pagination;

      const brands = Array.from(
        new Set(products.map((p) => p.brand).filter(Boolean)),
      ) as string[];
      const tags = Array.from(new Set(products.flatMap((p) => p.tags)));
      const maxPrice = products.length
        ? Math.max(...products.map((p) => p.price ?? 0))
        : 0;
      return { vendor, products, meta, brands, tags, maxPrice };
    } catch (err) {
      console.error("Loader error:", err);
      throw err;
    }
  },
});

function VendorDetailPage() {
  const { vendor, products, meta, brands, tags, maxPrice } =
    Route.useLoaderData();

  const navigate = Route.useNavigate();
  const search = Route.useSearch();

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
    // Reset to page 1 when filters change
    const updatedFilters = { ...newFilters, page: 1 };
    navigate({
      search: (prev) => ({ ...prev, ...updatedFilters }),
      replace: true,
    });
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
      case "createdAt":
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
  };

  const handleClearFilters = () => {
    navigate({
      search: {
        search: "",
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      replace: true,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Vendor Hero Section */}
      <VendorProfile
        vendor={vendor}
        refresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Vendor Info Section */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-3 md:py-4">
        {/* <VendorInfo vendor={vendor} /> */}

        {/* Products Section */}
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block lg:w-64 xl:w-72">
              <div className="sticky top-4">
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
                className="w-full h-10 text-sm"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters & Sort
                {hasActiveFilters && (
                  <span className="ml-2 bg-mmp-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
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
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsFilterOpen(false)}
                />
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
              {/* Results Header - Mobile Optimized */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-3">
                  {/* Title and count */}
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      All Products
                    </h2>
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mt-1">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Showing{" "}
                        {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}
                        -{Math.min(meta.page * meta.limit, meta.total)} of{" "}
                        {meta.total}
                        {search.search && ` for "${search.search}"`}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="text-mmp-primary hover:text-mmp-primary2 text-xs h-6 px-2 justify-start w-fit"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center gap-2">
                    {/* View Mode Toggle - Mobile Horizontal */}
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
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
                        <Grid3X3 className="h-4 w-4" />
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

                    {/* Sort Dropdown */}
                    <div className="flex-1 sm:flex-none">
                      <select
                        className="w-full rounded-lg border border-gray-200 bg-white px-2 sm:px-3 py-2 text-xs sm:text-sm focus:border-mmp-primary focus:outline-none focus:ring-1 focus:ring-mmp-primary appearance-none bg-no-repeat"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: "right 0.5rem center",
                          backgroundSize: "1.2em 1.2em",
                          paddingRight: "2rem",
                        }}
                        value={search.sortBy || "createdAt"}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="createdAt">Newest</option>
                        <option value="price">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="popularity">Popularity</option>
                        <option value="name">Name: A to Z</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Active Filters - Scrollable on mobile */}
                {hasActiveFilters && (
                  <div className="mt-3 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 min-w-max">
                      <span className="text-xs text-gray-500 mr-1">
                        Filters:
                      </span>
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
                          color="blue"
                        />
                      )}
                      {(search.minPrice !== undefined ||
                        search.maxPrice !== undefined) && (
                        <FilterBadge
                          label="Price"
                          value={`${formatCurrency(search.minPrice || 0)}-${formatCurrency(search.maxPrice || maxPrice)}`}
                          onRemove={() =>
                            handleFilterChange({
                              minPrice: undefined,
                              maxPrice: undefined,
                            })
                          }
                          color="blue"
                        />
                      )}
                      {search.tags && (
                        <FilterBadge
                          label="Tag"
                          value={search.tags}
                          onRemove={() => handleFilterChange({ tags: "" })}
                          color="blue"
                        />
                      )}
                      {search.categoryId && (
                        <FilterBadge
                          label="Category"
                          value={search.categoryId}
                          onRemove={() =>
                            handleFilterChange({ categorySlug: undefined })
                          }
                          color="blue"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Products Grid/List */}
              {isRefreshing ? (
                <div className="py-12 sm:py-20 text-center">
                  <RefreshCcw className="mx-auto h-8 w-8 sm:h-12 sm:w-12 animate-spin text-mmp-primary" />
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
                    Refreshing products...
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="py-12 sm:py-20 text-center px-4">
                  <div className="text-gray-300 mb-3 sm:mb-4">
                    <Filter className="mx-auto h-12 w-12 sm:h-16 sm:w-16" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search term to find what
                    you're looking for.
                  </p>
                  {hasActiveFilters && (
                    <Button
                      onClick={handleClearFilters}
                      size="sm"
                      className="bg-mmp-primary hover:bg-mmp-primary2 h-9 px-4 text-sm"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                <ProductGrid products={products} />
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {products.map((product) => (
                    <ProductListItem key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta.totalPages > 1 && products.length > 0 && (
                <div className="mt-8 sm:mt-12">
                  {/* Desktop Pagination */}
                  <div className="hidden md:block">
                    <Pagination
                      meta={meta}
                      onPageChange={handlePageChange}
                      showInfo={false}
                      showPageSize={false}
                      className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
                    />
                  </div>
                  {/* Mobile Pagination */}
                  <div className="md:hidden">
                    <CompactPagination
                      meta={meta}
                      onPageChange={handlePageChange}
                      className="bg-white rounded-lg border border-gray-200 p-3"
                    />
                  </div>

                  {/* Page Info */}
                  <div className="mt-3 text-center text-xs sm:text-sm text-gray-600">
                    Page {meta.page} of {meta.totalPages}
                    <span className="mx-2">•</span>
                    <span>{meta.total.toLocaleString()} total products</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
