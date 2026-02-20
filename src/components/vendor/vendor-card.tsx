import React from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Store, ChevronRight } from "lucide-react";
import type { IVendor } from "@/types";

interface VendorCardProps {
  vendor: IVendor;
  viewMode?: "grid" | "list";
}

export const VendorCard = React.forwardRef<HTMLDivElement, VendorCardProps>(
  ({ vendor, viewMode = "grid" }, ref) => {
    if (viewMode === "list") {
      return (
        <Card 
          ref={ref} 
          className="hover:shadow-md transition-shadow border-gray-200 overflow-hidden"
        >
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
              {/* Logo */}
              <div className="w-full sm:w-20 md:w-24 lg:w-32 h-32 sm:h-20 md:h-24 lg:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Store className="h-8 w-8 sm:h-6 sm:w-6" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {vendor.businessName}
                      </h3>
                      {vendor.verified && (
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-green-100 text-green-800 border-0 shrink-0"
                        >
                          ✓ Verified
                        </Badge>
                      )}
                    </div>

                    {/* Rating - Mobile inline */}
                    <div className="flex items-center gap-2 sm:hidden mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-xs">
                          {vendor.ratingAverage.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500">
                        ({vendor.ratingCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Rating - Desktop */}
                  <div className="hidden sm:flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">
                      {vendor.ratingAverage.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({vendor.ratingCount})
                    </span>
                  </div>
                </div>

                {/* Description */}
                {vendor.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                    {vendor.description}
                  </p>
                )}

                {/* Location & Actions */}
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {vendor.location.city}, {vendor.location.state}
                    </span>
                  </div>

                  <Link
                    to="/vendors/$slug"
                    params={{ slug: vendor.slug }}
                    className="inline-block"
                  >
                    <Button 
                      size="sm" 
                      className="h-8 text-xs gap-1 xs:w-auto"
                    >
                      View Store
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid view - Mobile optimized
    return (
      <Card
        ref={ref}
        className="overflow-hidden hover:shadow-md transition-shadow border-gray-200 h-full flex flex-col"
      >
        {/* Logo */}
        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
          {vendor.logoUrl ? (
            <img
              src={vendor.logoUrl}
              alt={vendor.businessName}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Store className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
          )}
          
          {/* Verified Badge */}
          {vendor.verified && (
            <Badge 
              className="absolute top-2 right-2 bg-green-100 text-green-800 border-0 text-[10px] sm:text-xs px-1.5 py-0.5"
            >
              ✓ Verified
            </Badge>
          )}

          {/* Rating Badge - Mobile */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs font-medium">
              {vendor.ratingAverage.toFixed(1)}
            </span>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Business Name */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem] sm:min-h-[3rem]">
            {vendor.businessName}
          </h3>

          {/* Description - Hidden on smallest screens */}
          {vendor.description && (
            <p className="hidden xs:block text-xs text-gray-600 line-clamp-2 mb-2">
              {vendor.description}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 mb-3 mt-auto">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">
              {vendor.location.city}, {vendor.location.state}
            </span>
          </div>

          {/* Review Count - Mobile */}
          <div className="flex items-center justify-between mb-2 sm:hidden">
            <span className="text-[10px] text-gray-500">
              {vendor.ratingCount} reviews
            </span>
          </div>

          {/* View Button */}
          <Link
            to="/vendors/$slug"
            params={{ slug: vendor.slug }}
            className="w-full mt-auto"
          >
            <Button 
              size="sm" 
              className="w-full h-8 text-xs sm:h-9 sm:text-sm gap-1"
            >
              View Store
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  },
);

VendorCard.displayName = "VendorCard";