import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CompactPagination, Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Filter,
  Grid3x3,
  List,
  RefreshCw,
  Store,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
} from "lucide-react";
import { FilterBadge } from "@/components/ui/filter-badge";
import { VendorCard } from "@/components/vendor/vendor-card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useVendors } from "@/api/hooks";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

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
});

function VendorsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading, error, refetch } = useVendors(search);
  const vendors = data?.data || [];
  const meta = data?.pagination;
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = React.useState<boolean>(false);
  const [expandedSections, setExpandedSections] = React.useState({
    location: true,
    rating: true,
    verification: true,
  });

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
    setIsFilterOpen(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getSortLabel = () => {
    switch (search.sortBy) {
      case "createdAt":
        return "Newest First";
      case "rating":
        return "Highest Rated";
      case "name":
        return "Name A-Z";
      default:
        return "Sort by";
    }
  };

    if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Unable to Load Vendors"
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
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3 sm:mb-4">
                <Store className="w-4 h-4 text-brand-accent" />
                <span className="text-xs sm:text-sm font-medium text-white">
                  Trusted Sellers
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Our Vendors
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                Discover and shop from our curated network of verified vendors
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 inline-flex items-center gap-2 self-start sm:self-auto">
              <Store className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">
                {meta?.total || vendors?.length || 0} Vendors
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-brand-surface"
            preserveAspectRatio="none"
            viewBox="0 0 1440 120"
          >
            <path
              fill="currentColor"
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="gap-2 h-9 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 bg-white text-brand-primary rounded-full min-w-[20px] h-5 px-1.5 text-xs font-bold flex items-center justify-center">
                  {
                    Object.keys(search).filter(
                      (k) =>
                        [
                          "search",
                          "city",
                          "state",
                          "minRating",
                          "maxRating",
                          "verified",
                        ].includes(k) && search[k as keyof typeof search],
                    ).length
                  }
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 p-0 border-brand-primary-soft hover:bg-brand-primary-soft"
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
            </Button>

            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="gap-2 h-9 border-brand-primary-soft hover:bg-brand-primary-soft"
              >
                <span>{getSortLabel()}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    isSortOpen && "rotate-180",
                  )}
                />
              </Button>

              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSortOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-brand-primary-soft z-50 overflow-hidden">
                    {[
                      {
                        value: "createdAt",
                        label: "Newest First",
                        order: "desc",
                      },
                      {
                        value: "rating",
                        label: "Highest Rated",
                        order: "desc",
                      },
                      { value: "name", label: "Name A-Z", order: "asc" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleFilterChange({
                            sortBy: option.value,
                            sortOrder: option.order as "asc" | "desc",
                          });
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm transition-colors",
                          search.sortBy === option.value
                            ? "bg-brand-primary-soft text-brand-primary font-medium"
                            : "text-brand-dark hover:bg-brand-surface",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white rounded-lg border border-brand-primary-soft p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-8 w-8 p-0 transition-all duration-200",
                viewMode === "grid" &&
                  "bg-brand-primary text-white hover:bg-brand-primary-hover",
              )}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-8 w-8 p-0 transition-all duration-200",
                viewMode === "list" &&
                  "bg-brand-primary text-white hover:bg-brand-primary-hover",
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsFilterOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-brand-primary-soft px-5 py-4 flex items-center justify-between rounded-t-2xl">
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
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-5 pb-8 space-y-5">
                {/* Search */}
                <div>
                  <label className="font-medium text-brand-dark text-sm mb-2 block">
                    Search Vendors
                  </label>
                  <Input
                    placeholder="Search by name or description..."
                    value={search.search}
                    onChange={(e) =>
                      handleFilterChange({ search: e.target.value })
                    }
                    className="h-10 text-sm border-brand-primary-soft focus:border-brand-primary"
                  />
                </div>

                {/* Location Section */}
                <div className="border-b border-brand-primary-soft pb-3">
                  <button
                    onClick={() => toggleSection("location")}
                    className="flex w-full items-center justify-between py-2"
                  >
                    <span className="font-medium text-brand-dark">
                      Location
                    </span>
                    {expandedSections.location ? (
                      <ChevronUp className="h-4 w-4 text-brand-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-brand-muted" />
                    )}
                  </button>
                  {expandedSections.location && (
                    <div className="space-y-3 pt-3">
                      <Input
                        placeholder="City"
                        value={search.city}
                        onChange={(e) =>
                          handleFilterChange({
                            city: e.target.value || undefined,
                          })
                        }
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="State"
                        value={search.state}
                        onChange={(e) =>
                          handleFilterChange({
                            state: e.target.value || undefined,
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Rating Section */}
                <div className="border-b border-brand-primary-soft pb-3">
                  <button
                    onClick={() => toggleSection("rating")}
                    className="flex w-full items-center justify-between py-2"
                  >
                    <span className="font-medium text-brand-dark">Rating</span>
                    {expandedSections.rating ? (
                      <ChevronUp className="h-4 w-4 text-brand-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-brand-muted" />
                    )}
                  </button>
                  {expandedSections.rating && (
                    <div className="pt-3">
                      <Slider
                        min={0}
                        max={5}
                        step={0.5}
                        value={[search.minRating || 0, search.maxRating || 5]}
                        onValueChange={([min, max]) => {
                          handleFilterChange({
                            minRating: min,
                            maxRating: max,
                          });
                        }}
                        className="py-4"
                      />
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-brand-warning" />
                          {search.minRating || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-brand-warning" />
                          {search.maxRating || 5}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification */}
                <div>
                  <div className="flex items-center gap-3 py-2">
                    <Checkbox
                      id="verified-mobile"
                      checked={search.verified}
                      onCheckedChange={(checked) =>
                        handleFilterChange({
                          verified: checked ? true : undefined,
                        })
                      }
                      className="border-brand-primary-soft data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                    />
                    <Label
                      htmlFor="verified-mobile"
                      className="text-sm text-brand-dark flex items-center gap-2"
                    >
                      <Award className="w-4 h-4 text-brand-primary" />
                      Verified vendors only
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="flex-1 h-10 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 h-10 bg-brand-primary text-white hover:bg-brand-primary-hover"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {search.search && (
                <FilterBadge
                  label="Search"
                  value={search.search}
                  onRemove={() => handleFilterChange({ search: "" })}
                  color="blue"
                />
              )}
              {search.city && (
                <FilterBadge
                  label="City"
                  value={search.city}
                  onRemove={() => handleFilterChange({ city: undefined })}
                  color="green"
                />
              )}
              {search.state && (
                <FilterBadge
                  label="State"
                  value={search.state}
                  onRemove={() => handleFilterChange({ state: undefined })}
                  color="purple"
                />
              )}
              {(search.minRating !== undefined ||
                search.maxRating !== undefined) && (
                <FilterBadge
                  label="Rating"
                  value={`${search.minRating || 0} - ${search.maxRating || 5}★`}
                  onRemove={() =>
                    handleFilterChange({
                      minRating: undefined,
                      maxRating: undefined,
                    })
                  }
                  color="yellow"
                />
              )}
              {search.verified && (
                <FilterBadge
                  label="Status"
                  value="Verified"
                  onRemove={() => handleFilterChange({ verified: undefined })}
                  color="green"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 text-xs gap-1 px-2 text-brand-muted hover:text-brand-dark"
              >
                <X className="w-3 h-3" />
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Results Stats */}
        <div className="mb-5">
          <p className="text-sm text-brand-muted">
            Showing {vendors.length} of {meta?.total || vendors.length} vendors
          </p>
        </div>

        {/* Vendor Grid/List */}
        {vendors.length > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-4 sm:gap-5 lg:gap-6 mb-8",
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
            {meta && meta.totalPages > 1 && (
              <div className="mt-8 pt-4 border-t border-brand-primary-soft">
                <div className="hidden sm:block">
                  <Pagination meta={meta} onPageChange={handlePageChange} />
                </div>
                <div className="sm:hidden">
                  <CompactPagination
                    meta={meta}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 lg:py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary-soft mb-5">
              <Store className="h-10 w-10 text-brand-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-brand-dark mb-2">
              No vendors found
            </h3>
            <p className="text-brand-muted text-sm sm:text-base mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms to find vendors"
                : "Check back later as we're adding more vendors"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="border-brand-primary text-brand-primary hover:bg-brand-primary-soft"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
