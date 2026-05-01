'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react';
import type { IPaginationMeta } from '@/types';

interface PaginationProps {
  meta: IPaginationMeta | undefined;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  className?: string;
  showInfo?: boolean;
  showPageSize?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  onPageSizeChange,
  className,
  showInfo = true,
  showPageSize = false,
}) => {
  // Safety check for undefined meta
  if (!meta || meta.total === 0) return null;

  const { page, totalPages, total, limit } = meta;
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      pages.push(1);
      
      if (page > 3) {
        pages.push('ellipsis');
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeSelect = (newLimit: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newLimit);
    }
    onPageChange(1); // Reset to page 1 when changing limit
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Info Section */}
      {showInfo && (
        <div className="text-sm text-brand-muted text-center sm:text-left">
          Showing <span className="font-semibold text-brand-dark">{startItem}</span> 
          {' '}to <span className="font-semibold text-brand-dark">{endItem}</span> 
          {' '}of <span className="font-semibold text-brand-dark">{total}</span> items
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page Size Selector */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="font-medium">Show:</span>
            <select 
              className="border border-brand-primary-soft rounded-lg px-3 py-1.5 text-sm bg-white text-brand-dark focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer hover:border-brand-primary/50"
              value={limit}
              onChange={(e) => handlePageSizeSelect(Number(e.target.value))}
            >
              {[12, 24, 36, 48, 60].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "w-9 h-9 rounded-lg transition-all duration-200",
              "border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            )}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-brand-dark" />
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum, index) => (
            pageNum === 'ellipsis' ? (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-lg cursor-default hover:bg-transparent border-brand-primary-soft"
                disabled
                aria-label="More pages"
              >
                <MoreHorizontal className="w-4 h-4 text-brand-muted" />
              </Button>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="icon"
                className={cn(
                  "w-9 h-9 rounded-lg transition-all duration-200 text-sm font-medium",
                  pageNum === page 
                    ? "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm scale-105" 
                    : "border-brand-primary-soft text-brand-dark hover:border-brand-primary hover:bg-brand-primary-soft"
                )}
                onClick={() => handlePageChange(pageNum)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum}
              </Button>
            )
          ))}

          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "w-9 h-9 rounded-lg transition-all duration-200",
              "border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            )}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-brand-dark" />
          </Button>
        </div>

        {/* Jump to Page */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-brand-muted font-medium">Go to:</span>
          <div className="relative">
            <input
              type="number"
              min="1"
              max={totalPages}
              defaultValue={page}
              className="w-20 border border-brand-primary-soft rounded-lg px-3 py-1.5 text-sm text-brand-dark focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const inputPage = parseInt(e.currentTarget.value);
                  if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
                    handlePageChange(inputPage);
                    e.currentTarget.value = inputPage.toString();
                  } else {
                    e.currentTarget.value = page.toString();
                  }
                }
              }}
              onBlur={(e) => {
                const inputPage = parseInt(e.target.value);
                if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
                  if (inputPage !== page) handlePageChange(inputPage);
                }
                e.target.value = page.toString();
              }}
              aria-label="Jump to page number"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Compact Pagination for Mobile
interface CompactPaginationProps {
  meta: IPaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
  showPageInfo?: boolean;
}

export const CompactPagination: React.FC<CompactPaginationProps> = ({
  meta,
  onPageChange,
  className,
  showPageInfo = true,
}) => {
  const { page, totalPages, total, limit } = meta;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Page Info */}
      {showPageInfo && (
        <div className="text-center text-xs text-brand-muted">
          Showing {startItem} - {endItem} of {total} items
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 rounded-lg border-brand-primary-soft",
            "text-brand-dark hover:border-brand-primary hover:bg-brand-primary-soft",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brand-dark">
            {page}
          </span>
          <span className="text-sm text-brand-muted">of</span>
          <span className="text-sm font-medium text-brand-dark">
            {totalPages}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 rounded-lg border-brand-primary-soft",
            "text-brand-dark hover:border-brand-primary hover:bg-brand-primary-soft",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Quick Page Input for Mobile */}
      {totalPages > 3 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-xs text-brand-muted">Jump to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={page}
            className="w-16 border border-brand-primary-soft rounded-lg px-2 py-1 text-sm text-brand-dark text-center focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const inputPage = parseInt(e.currentTarget.value);
                if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
                  onPageChange(inputPage);
                }
                e.currentTarget.value = page.toString();
              }
            }}
            aria-label="Jump to page"
          />
        </div>
      )}
    </div>
  );
};

// Simple Pagination for minimal use cases
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-brand-dark">{currentPage}</span>
        <span className="text-sm text-brand-muted">/</span>
        <span className="text-sm text-brand-muted">{totalPages}</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg border-brand-primary-soft hover:border-brand-primary hover:bg-brand-primary-soft"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};