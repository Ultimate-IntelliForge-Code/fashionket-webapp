import React from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Store, ChevronRight, Shield, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IVendor } from "@/types";

interface VendorCardProps {
  vendor: IVendor;
  viewMode?: "grid" | "list";
}

export const VendorCard = React.forwardRef<HTMLDivElement, VendorCardProps>(
  ({ vendor, viewMode = "grid" }, ref) => {
    // List View - Optimized for desktop and tablet
    if (viewMode === "list") {
      return (
        <Card 
          ref={ref} 
          className={cn(
            "group overflow-hidden transition-all duration-300",
            "border border-brand-primary-soft hover:border-brand-primary/30",
            "hover:shadow-lg hover:-translate-y-0.5"
          )}
        >
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6">
              {/* Logo Container */}
              <div className="relative w-full sm:w-24 md:w-28 lg:w-32 h-32 sm:h-24 md:h-28 lg:h-32 shrink-0">
                <div className="w-full h-full rounded-xl overflow-hidden bg-brand-primary-soft">
                  {vendor.logoUrl ? (
                    <img
                      src={vendor.logoUrl}
                      alt={`${vendor.businessName} logo`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-10 w-10 text-brand-muted" />
                    </div>
                  )}
                </div>
                
                {/* Verified Badge Overlay for List View */}
                {vendor.verified && (
                  <div className="absolute -top-1 -right-1 bg-brand-success rounded-full p-1 shadow-md">
                    <Shield className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand-dark group-hover:text-brand-primary transition-colors">
                        {vendor.businessName}
                      </h3>
                      {vendor.verified && (
                        <Badge 
                          variant="secondary" 
                          className="bg-brand-success/10 text-brand-success border-brand-success/20 text-xs px-2 py-0.5"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          Verified Seller
                        </Badge>
                      )}
                    </div>

                    {/* Rating - Mobile inline */}
                    <div className="flex items-center gap-2 sm:hidden mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
                        <span className="font-semibold text-sm text-brand-dark">
                          {vendor.ratingAverage?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <span className="text-xs text-brand-muted">
                        ({vendor.ratingCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Rating - Desktop */}
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 bg-brand-primary-soft px-3 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                      <span className="font-bold text-brand-dark">
                        {vendor.ratingAverage?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-xs text-brand-muted">
                        ({vendor.ratingCount || 0})
                      </span>
                    </div>
                   {vendor?.createdAt && (
                    <span className="text-xs text-brand-muted">
                      Seller since {new Date(vendor?.createdAt).getFullYear()}
                    </span>
                   )}
                  </div>
                </div>

                {/* Description */}
                {vendor.description && (
                  <p className="text-sm text-brand-muted mt-2 line-clamp-2">
                    {vendor.description}
                  </p>
                )}

                {/* Stats & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-brand-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {vendor.location?.city}, {vendor.location?.state}
                      </span>
                    </div>
                    {/* <div className="w-px h-3 bg-brand-primary-soft" /> */}
                    {/* <div className="text-brand-muted">
                      {vendor.productCount || 0} products
                    </div> */}
                  </div>

                  <Link
                    to="/vendors/$slug"
                    params={{ slug: vendor.slug }}
                    className="inline-block"
                  >
                    <Button 
                      size="sm" 
                      className="h-9 px-4 text-sm gap-1.5 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Visit Store
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid View - Optimized for mobile and desktop
    return (
      <Card
        ref={ref}
        className={cn(
          "group overflow-hidden transition-all duration-300 h-full flex flex-col",
          "border border-brand-primary-soft hover:border-brand-primary/30",
          "hover:shadow-xl hover:-translate-y-1 bg-white"
        )}
      >
        {/* Logo Container with Overlay */}
        <div className="relative aspect-square w-full bg-gradient-to-br from-brand-primary-soft to-brand-surface overflow-hidden">
          {vendor.logoUrl ? (
            <img
              src={vendor.logoUrl}
              alt={`${vendor.businessName} logo`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="h-12 w-12 sm:h-14 sm:w-14 text-brand-muted" />
            </div>
          )}
          
          {/* Verified Badge - Grid View */}
          {vendor.verified && (
            <div className="absolute top-3 right-3">
              <div className="bg-brand-success rounded-full p-1.5 shadow-md">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          )}

          {/* Rating Badge - Grid View */}
          <div className="absolute bottom-3 left-3 bg-brand-dark/80 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-md">
            <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
            <span className="text-white text-xs font-semibold">
              {vendor.ratingAverage?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Business Name */}
          <div className="mb-2">
            <h3 className="font-semibold text-brand-dark text-sm sm:text-base line-clamp-2 group-hover:text-brand-primary transition-colors">
              {vendor.businessName}
            </h3>
          </div>

          {/* Description - Hidden on very small screens */}
          {vendor.description && (
            <p className="hidden xs:block text-xs text-brand-muted line-clamp-2 mb-3">
              {vendor.description}
            </p>
          )}

          {/* Location & Product Count */}
          <div className="space-y-1.5 mb-4 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-brand-muted">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {vendor.location?.city}, {vendor.location?.state}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center gap-1.5">
                <Store className="h-3 w-3 text-brand-muted" />
                <span className="text-xs text-brand-muted">
                  {vendor.productCount || 0} products
                </span>
              </div> */}
              
              {/* Review Count - Mobile */}
              <span className="text-xs text-brand-muted">
                {vendor.ratingCount || 0} reviews
              </span>
            </div>
          </div>

          {/* View Button */}
          <Link
            to="/vendors/$slug"
            params={{ slug: vendor.slug }}
            className="w-full"
          >
            <Button 
              size="sm" 
              variant="outline"
              className="w-full h-9 text-sm gap-1.5 border-brand-primary-soft text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 group/btn"
            >
              <span>Visit Store</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  },
);

VendorCard.displayName = "VendorCard";