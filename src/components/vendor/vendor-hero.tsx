import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCcw, Star, Store } from "lucide-react";
import type { IVendor } from "@/types";
import { Button } from "../ui/button";

interface VendorHeroProps {
  vendor: IVendor;
  refresh: () => void;
  isRefreshing: boolean;
}

export const VendorHero: React.FC<VendorHeroProps> = ({
  vendor,
  refresh,
  isRefreshing,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-mmp-primary2 to-mmp-primary py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex gap-2 mb:-1 md:mb-5">
          <Button onClick={() => window.history.back()} className="bg-white/0">
            {" "}
            <ArrowLeft /> Back
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <div className="flex flex-row gap-3 sm:gap-4 md:gap-6 items-center md:items-start text-center md:text-left">
          {/* Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg overflow-hidden bg-white shadow-lg flex-shrink-0 border-2 border-white/30">
            {vendor.logoUrl ? (
              <img
                src={vendor.logoUrl}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <Store className="h-8 w-8 sm:h-10 sm:w-10 text-mmp-primary2/60" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 py-1 text-left">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
              <div className="flex gap-1 items-center">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 drop-shadow-md">
                  {vendor.businessName}
                </h1>
                <div className="flex flex-wrap items-center justify-start gap-1.5">
                  {vendor.verified && (
                    <Badge className="bg-green-500/90 text-white border-0 text-[10px] sm:text-xs px-2 py-0.5 font-medium">
                      ✓ Verified
                    </Badge>
                  )}

                  {/* <Badge className="bg-white/20 text-white border-0 text-[10px] sm:text-xs px-2 py-0.5 backdrop-blur-sm font-medium">
                    {vendor.accountStatus}
                  </Badge> */}
                </div>
              </div>
            </div>

            {vendor.description && (
              <p className="text-white/90 text-xs sm:text-sm mb-3 max-w-2xl mx-auto md:mx-0 drop-shadow">
                {vendor.description}
              </p>
            )}

            {/* Rating and Stats */}
            <div className="flex items-center justify-start gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 flex gap-1 items-center">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-bold text-sm sm:text-base">
                    {vendor.ratingAverage.toFixed(1)}
                  </span>
                </div>
                <p className="text-white/80 text-[8px] sm:text-[10px]">
                  {vendor.ratingCount} reviews
                </p>
              </div>

              {/* {vendor.totalProducts && (
                <>
                  <div className="w-px h-6 bg-white/30" />
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5">
                    <div className="text-white font-bold text-sm sm:text-base">
                      {vendor.totalProducts}
                    </div>
                    <p className="text-white/80 text-[8px] sm:text-[10px]">
                      Products
                    </p>
                  </div>
                </>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
