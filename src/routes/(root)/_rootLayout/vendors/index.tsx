import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter, Grid3x3, List, RefreshCw, X } from "lucide-react";
import { vendorsQuery } from "@/api/queries";
import { FilterBadge } from "@/components/ui/filter-badge";
import { VendorCard } from "@/components/vendor/vendor-card";
import type { IVendorQueryFilters } from "@/api/queries/vendor.query";

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
      sortOrder: deps.sortOrder as 'asc' | 'desc' | undefined,
      verified: deps.verified,
    };

    const data = await context.queryClient.ensureQueryData(vendorsQuery(filters));
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
      search.verified
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Vendors</h1>
          <p className="text-muted-foreground">
            Discover and shop from our verified vendors
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
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
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        )}

        {/* Vendor Grid/List */}
        {vendors.length > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-6 mb-8",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
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
              <Pagination
                meta={meta}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No vendors found</p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
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
