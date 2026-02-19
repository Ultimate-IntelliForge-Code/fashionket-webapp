import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { IVendor } from "@/types";

interface VendorHeroProps {
  vendor: IVendor;
}

export const VendorHero: React.FC<VendorHeroProps> = ({ vendor }) => {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Logo */}
          <div className="w-40 h-40 rounded-lg overflow-hidden bg-white shadow-lg flex-shrink-0">
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

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {vendor.businessName}
                </h1>
                <div className="flex items-center gap-2">
                  {vendor.verified && (
                    <Badge variant="secondary">
                      ✓ Verified Vendor
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {vendor.accountStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {vendor.description && (
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                {vendor.description}
              </p>
            )}

            {/* Rating and Stats */}
            <div className="flex items-center gap-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {vendor.ratingAverage.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {vendor.ratingCount} reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
