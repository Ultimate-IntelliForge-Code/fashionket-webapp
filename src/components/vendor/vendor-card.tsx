import React from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone } from "lucide-react";
import type { IVendor } from "@/types";

interface VendorCardProps {
  vendor: IVendor;
  viewMode?: "grid" | "list";
}

export const VendorCard = React.forwardRef<HTMLDivElement, VendorCardProps>(
  ({ vendor, viewMode = "grid" }, ref) => {
    if (viewMode === "list") {
      return (
        <Card ref={ref} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Logo */}
              <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Logo
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground truncate">
                      {vendor.businessName}
                    </h3>

                    {vendor.verified && (
                      <Badge className="mt-1" variant="secondary">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {vendor.ratingAverage.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({vendor.ratingCount})
                      </span>
                    </div>
                  </div>
                </div>

                {vendor.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {vendor.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {vendor.location.city}, {vendor.location.state}
                    </span>
                  </div>
                  {vendor.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/vendors/$slug"
                  params={{ slug: vendor.slug }}
                  className="inline-block mt-4"
                >
                  <Button size="sm">View Vendor</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid view
    return (
      <Card
        ref={ref}
        className="overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Logo */}
        <div className="relative w-full h-40 bg-muted overflow-hidden">
          {vendor.logoUrl ? (
            <img
              src={vendor.logoUrl}
              alt={vendor.businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Logo
            </div>
          )}
          {vendor.verified && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Verified
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2">
            {vendor.businessName}
          </h3>

          {vendor.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {vendor.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">
                {vendor.ratingAverage.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({vendor.ratingCount} reviews)
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <MapPin className="w-3 h-3" />
            <span>
              {vendor.location.city}, {vendor.location.state}
            </span>
          </div>

          <Link
            to="/vendors/$slug"
            params={{ slug: vendor.slug }}
            className="w-full"
          >
            <Button variant="outline" size="sm" className="w-full">
              View Vendor
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  },
);

VendorCard.displayName = "VendorCard";
