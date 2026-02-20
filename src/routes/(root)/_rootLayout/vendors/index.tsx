import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CompactPagination, Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter, Grid3x3, List, RefreshCw, Store, X } from "lucide-react";
import { vendorsQuery } from "@/api/queries";
import { FilterBadge } from "@/components/ui/filter-badge";
import { VendorCard } from "@/components/vendor/vendor-card";
import type { IVendorQueryFilters } from "@/api/queries/vendor.query";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/(root)/_rootLayout/vendors/")({
  component: VendorsPage,
  validateSearch: z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
      search: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      minRating: z.number().optional(),
      maxRating: z.number().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
      verified: z.boolean().optional(),
    })
    .transform((s) => ({
      page: s.page ?? 1,
      limit: s.limit ?? 12,
      search: s.search ?? "",
      city: s.city,
      state: s.state,
      minRating: s.minRating,
      maxRating: s.maxRating,
      sortBy: s.sortBy ?? "createdAt",
      sortOrder: s.sortOrder ?? "desc",
      verified: s.verified,
    })),
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
    search: search.search,
    city: search.city,
    state: search.state,
    minRating: search.minRating,
    maxRating: search.maxRating,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    verified: search.verified,
  }),
  loader: async ({ context, deps }) => {
    const filters: IVendorQueryFilters = {
      page: deps.page,
      limit: deps.limit,
      search: deps.search || undefined,
      city: deps.city,
      state: deps.state,
      minRating: deps.minRating,
      maxRating: deps.maxRating,
      sortBy: deps.sortBy,
      sortOrder: deps.sortOrder as "asc" | "desc" | undefined,
      verified: deps.verified,
    };

    const data = await context.queryClient.ensureQueryData(
      vendorsQuery(filters),
    );
    console.log(data);
    const vendors = data.data;
    const meta = data.pagination;

    return { vendors, meta };
  },
});

function VendorsPage() {
  const { vendors, meta } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);

  const hasActiveFilters = React.useMemo(() => {
    return Boolean(
      search.search ||
      search.city ||
      search.state ||
      search.minRating ||
      search.maxRating ||
      search.verified,
    );
  }, [search]);

  const handleFilterChange = (newFilters: Partial<typeof search>) => {
    navigate({
      search: { ...search, ...newFilters, page: 1 },
    });
  };

  const handlePageChange = (page: number) => {
    navigate({ search: { ...search, page } });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch logic here
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearFilters = () => {
    navigate({
      search: {
        page: 1,
        limit: 12,
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-mmp-primary2 to-mmp-primary -mx-3 sm:-mx-4 px-3 sm:px-4 py-4 sm:py-5 md:py-6 rounded-lg">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 drop-shadow-md">
                Our Vendors
              </h1>
              <p className="text-white/90 text-xs sm:text-sm drop-shadow">
                Discover and shop from our verified vendors
              </p>
            </div>

            {/* Optional Stats Badge */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 inline-flex items-center gap-2 self-start sm:self-auto">
              <Store className="w-4 h-4 text-white/90" />
              <span className="text-white font-semibold text-sm">
                {vendors?.length || 0} Vendors
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Filters and Actions - Mobile Optimized */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 sm:h-9 w-8 sm:w-9 p-0"
            >
              <RefreshCw
                className={cn(
                  "w-3.5 h-3.5 sm:w-4 sm:h-4",
                  isRefreshing && "animate-spin",
                )}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 sm:h-9 w-8 sm:w-9 p-0"
            >
              <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 sm:h-9 w-8 sm:w-9 p-0"
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-lg font-semibold">Filters</h3>
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
                {/* Filter content - Add your filter components here */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Search</h4>
                    <Input
                      placeholder="Search vendors..."
                      value={search.search}
                      onChange={(e) =>
                        handleFilterChange({ search: e.target.value })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Location</h4>
                    <Input
                      placeholder="City"
                      value={search.city}
                      onChange={(e) =>
                        handleFilterChange({ city: e.target.value })
                      }
                      className="h-9 text-sm mb-2"
                    />
                    <Input
                      placeholder="State"
                      value={search.state}
                      onChange={(e) =>
                        handleFilterChange({ state: e.target.value })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="verified"
                      checked={search.verified}
                      onCheckedChange={(checked) =>
                        handleFilterChange({
                          verified: checked ? true : undefined,
                        })
                      }
                    />
                    <Label htmlFor="verified" className="text-sm">
                      Verified only
                    </Label>
                  </div>
                  <Button
                    className="w-full bg-mmp-primary hover:bg-mmp-primary2"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display - Horizontal Scroll on Mobile */}
        {hasActiveFilters && (
          <div className="mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-3 sm:mx-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-max px-3 sm:px-0">
              {search.search && (
                <FilterBadge
                  label={`Search: ${search.search}`}
                  value={`Search: ${search.search}`}
                  onRemove={() => handleFilterChange({ search: "" })}
                  color="blue"
                />
              )}
              {search.city && (
                <FilterBadge
                  label={`City: ${search.city}`}
                  value={`City: ${search.city}`}
                  onRemove={() => handleFilterChange({ city: undefined })}
                  color="blue"
                />
              )}
              {search.state && (
                <FilterBadge
                  label={`State: ${search.state}`}
                  value={`State: ${search.state}`}
                  onRemove={() => handleFilterChange({ state: undefined })}
                  color="blue"
                />
              )}
              {search.verified && (
                <FilterBadge
                  label="Verified"
                  value="Verified"
                  onRemove={() => handleFilterChange({ verified: undefined })}
                  color="blue"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 text-xs gap-1 px-2"
              >
                <X className="w-3 h-3" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Vendor Grid/List */}
        {vendors.length > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1",
              )}
            >
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor._id}
                  vendor={vendor}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                {/* Desktop Pagination */}
                <div className="hidden sm:block">
                  <Pagination
                    meta={meta}
                    onPageChange={handlePageChange}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  />
                </div>
                {/* Mobile Pagination */}
                <div className="sm:hidden">
                  <CompactPagination
                    meta={meta}
                    onPageChange={handlePageChange}
                    className="bg-white rounded-lg border border-gray-200 p-3"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 mb-4">
              <Store className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              No vendors found
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                size="sm"
                className="h-9 text-sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
