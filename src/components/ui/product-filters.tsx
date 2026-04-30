import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
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
  const [expandedSections, setExpandedSections] = React.useState({
    search: true,
    price: true,
    brand: true,
    tags: true,
  });

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  React.useEffect(() => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || maxPrice]);
  }, [filters.minPrice, filters.maxPrice, maxPrice]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
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
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
    if (isMobile && onClose) onClose();
  };

  const hasActiveFilters = !!(filters.search || filters.brand || 
    filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.tags);

  const FilterSection: React.FC<{
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }> = ({ title, section, children }) => (
    <div className="border-b border-brand-primary-soft last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left hover:bg-brand-primary-soft/20 transition-colors rounded-lg px-2"
        onClick={() => toggleSection(section)}
      >
        <span className="font-semibold text-brand-dark text-sm">{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-brand-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-brand-muted" />
        )}
      </button>
      {expandedSections[section] && <div className="pt-1 pb-4 px-1">{children}</div>}
    </div>
  );

  const filterContent = (
    <div className="space-y-2">
      {/* Search Section */}
      <FilterSection title="Search Products" section="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <Input
            type="text"
            placeholder="Search by name, description..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 h-10 text-sm border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
          />
        </div>
      </FilterSection>

      {/* Price Range Section */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-5">
          <Slider
            min={0}
            max={maxPrice}
            step={1000}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="py-2"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-brand-muted mb-1 block">Min Price</Label>
              <Input
                type="number"
                min={0}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
                }}
                onBlur={handlePriceCommit}
                className="h-9 text-sm border-brand-primary-soft"
              />
            </div>
            <span className="text-brand-muted pt-5">to</span>
            <div className="flex-1">
              <Label className="text-xs text-brand-muted mb-1 block">Max Price</Label>
              <Input
                type="number"
                min={0}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
                }}
                onBlur={handlePriceCommit}
                className="h-9 text-sm border-brand-primary-soft"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-brand-primary">
              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(priceRange[0])}
            </span>
            <span className="text-brand-muted">—</span>
            <span className="text-brand-primary">
              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(priceRange[1])}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Brands Section */}
      {brands.length > 0 && (
        <FilterSection title="Brands" section="brand">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 py-1.5 cursor-pointer group hover:bg-brand-primary-soft/20 rounded-lg px-2 transition-colors"
              >
                <Checkbox
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) =>
                    onFilterChange({ brand: checked ? brand : undefined })
                  }
                  className="h-4 w-4 border-brand-primary-soft data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                />
                <span className="text-sm text-brand-dark group-hover:text-brand-primary transition-colors flex-1">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <FilterSection title="Tags" section="tags">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={filters.tags === tag ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'rounded-full h-8 px-3 text-xs transition-all duration-200',
                  filters.tags === tag
                    ? 'bg-brand-primary text-white hover:bg-brand-primary-hover border-brand-primary'
                    : 'border-brand-primary-soft text-brand-dark hover:border-brand-primary hover:text-brand-primary'
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
      <div className="pt-6 pb-2 flex gap-3">
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="flex-1 h-10 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft hover:border-brand-primary"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
        {isMobile && onClose && (
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 bg-brand-primary text-white hover:bg-brand-primary-hover"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );

  // Desktop View
  if (!isMobile) {
    return (
      <div className={cn('bg-white rounded-xl border border-brand-primary-soft shadow-sm', className)}>
        <div className="p-5 border-b border-brand-primary-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-brand-primary" />
              <h3 className="font-semibold text-brand-dark">Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-brand-primary hover:text-brand-primary-hover h-7 px-2"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
        <div className="p-5">{filterContent}</div>
      </div>
    );
  }

  // Mobile View (rendered within sheet)
  return <div className="divide-y divide-brand-primary-soft">{filterContent}</div>;
};