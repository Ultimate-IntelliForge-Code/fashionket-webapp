import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IProductQueryFilters } from '@/types';

interface ProductFiltersProps {
  filters: IProductQueryFilters;
  onFilterChange: (filters: Partial<IProductQueryFilters>) => void;
  brands: string[];
  tags: string[];
  maxPrice: number;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  brands,
  tags,
  maxPrice,
  className,
  isMobile = false,
  onClose,
}) => {
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || maxPrice,
  ]);
  const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    search: true,
    price: true,
    brand: true,
    tags: true,
  });

  // Debounced search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>(null);

  React.useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  React.useEffect(() => {
    setPriceRange([
      filters.minPrice || 0,
      filters.maxPrice || maxPrice,
    ]);
  }, [filters.minPrice, filters.maxPrice, maxPrice]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange({ search: value || undefined });
    }, 500);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceCommit = () => {
    onFilterChange({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < maxPrice ? priceRange[1] : undefined,
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    onFilterChange({
      search: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      tags: undefined,
    });
    if (isMobile && onClose) {
      onClose();
    }
  };

  const hasActiveFilters = 
    filters.search ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.tags;

  const FilterSection: React.FC<{
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }> = ({ title, section, children }) => (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 sm:py-4 text-left active:bg-gray-50 transition-colors rounded-lg px-1"
        onClick={() => toggleSection(section)}
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && <div className="pt-1 pb-3 sm:pb-4">{children}</div>}
    </div>
  );

  const filterContent = (
    <div className="space-y-1">
      {/* Search */}
      <FilterSection title="Search" section="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 h-9 sm:h-10 text-sm"
          />
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-4">
          <Slider
            min={0}
            max={maxPrice}
            step={1000}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="py-4"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <Label htmlFor="min-price" className="text-xs text-gray-600">
                Min
              </Label>
              <Input
                id="min-price"
                type="number"
                min={0}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= priceRange[1]) {
                    setPriceRange([value, priceRange[1]]);
                  }
                }}
                onBlur={handlePriceCommit}
                className="mt-1 h-8 sm:h-9 text-sm"
              />
            </div>
            <span className="text-gray-400 pt-5">-</span>
            <div className="flex-1">
              <Label htmlFor="max-price" className="text-xs text-gray-600">
                Max
              </Label>
              <Input
                id="max-price"
                type="number"
                min={0}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= priceRange[0]) {
                    setPriceRange([priceRange[0], value]);
                  }
                }}
                onBlur={handlePriceCommit}
                className="mt-1 h-8 sm:h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              {priceRange[0].toLocaleString('en-NG', {
                style: 'currency',
                currency: 'NGN',
                maximumFractionDigits: 0,
              })}
            </span>
            <span>
              {priceRange[1].toLocaleString('en-NG', {
                style: 'currency',
                currency: 'NGN',
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Brands" section="brand">
          <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center py-0.5">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) =>
                    onFilterChange({ brand: checked ? brand : undefined })
                  }
                  className="h-4 w-4 sm:h-4 sm:w-4"
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 sm:ml-3 cursor-pointer text-xs sm:text-sm text-gray-700 hover:text-gray-900 flex-1 truncate"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <FilterSection title="Tags" section="tags">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={filters.tags === tag ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'rounded-full h-7 sm:h-8 text-xs sm:text-sm px-2.5 sm:px-3',
                  filters.tags === tag
                    ? 'bg-mmp-primary text-white hover:bg-mmp-primary2'
                    : ''
                )}
                onClick={() =>
                  onFilterChange({ tags: filters.tags === tag ? undefined : tag })
                }
              >
                {tag}
              </Button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Action Buttons */}
      <div className="pt-4 pb-2 flex gap-2">
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Clear All
          </Button>
        )}
        {isMobile && onClose && (
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-mmp-primary hover:bg-mmp-primary2"
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className={cn('hidden lg:block', className)}>
        <div className="sticky top-24">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-8 px-2"
              >
                Clear all
              </Button>
            )}
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full relative h-9 sm:h-10 text-xs sm:text-sm">
              <Filter className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Filters & Sort
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-mmp-primary text-[10px] sm:text-xs font-bold text-white flex items-center justify-center">
                  {Object.keys(filters).filter(k => 
                    filters[k as keyof IProductQueryFilters] && 
                    !['categorySlug', 'page', 'limit', 'sortBy', 'sortOrder'].includes(k)
                  ).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
            <SheetHeader className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Filters</SheetTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>
            <div className="p-4 pb-8">{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};