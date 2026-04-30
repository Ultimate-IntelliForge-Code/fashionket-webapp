import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  RefreshCcw,
  Star,
  Store,
  MapPin,
  Phone,
  Clock,
  Shield,
  Mail,
  Package,
  ChevronRight,
  Truck,
  Award,
} from "lucide-react";
import type { IVendor } from "@/types";
import { cn } from "@/lib/utils";

interface VendorProfileProps {
  vendor: IVendor;
  refresh: () => void;
  isRefreshing: boolean;
  onContact?: () => void;
  onViewProducts?: () => void;
}

export const VendorProfile: React.FC<VendorProfileProps> = ({
  vendor,
  refresh,
  isRefreshing,
  onContact,
  onViewProducts,
}) => {
  // Format join date if available
  const joinDate = vendor.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  // Calculate total products if available
  // const totalProducts = vendor.products?.length || 0;

  return (
    <div className="relative bg-white">
      {/* Cover Photo Area - Premium gradient cover */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Navigation buttons - positioned absolutely on cover */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={() => window.history.back()}
              size="sm"
              variant="secondary"
              className="bg-white/5 backdrop-blur-sm hover:bg-white shadow-lg border-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/5 backdrop-blur-sm hover:bg-white shadow-lg border-0"
              onClick={refresh}
              disabled={isRefreshing}
            >
              <RefreshCcw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            </Button>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex gap-2">
            {onContact && (
              <Button
                onClick={onContact}
                className="bg-white/90 backdrop-blur-sm text-brand-dark hover:bg-white shadow-lg border-0"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
            {onViewProducts && (
              <Button
                onClick={onViewProducts}
                className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg"
              >
                <Package className="h-4 w-4 mr-2" />
                View Products
              </Button>
            )}
          </div>
        </div>

        {/* Bottom curve decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 text-white"
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

      {/* Profile Section - Facebook style overlapping profile */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col md:flex-row md:items-end gap-4 -mt-12 sm:-mt-16 md:-mt-20 pb-6">
          {/* Profile Picture */}
          <div className="md:ml-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-brand-surface">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary-soft to-brand-surface">
                    <Store className="h-10 w-10 sm:h-12 sm:w-12 text-brand-primary/40" />
                  </div>
                )}
              </div>

              {/* Verified badge overlay */}
              {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                  <Shield className="h-5 w-5 text-brand-success" />
                </div>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="flex-1 pb-2 md:pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark">
                    {vendor.businessName}
                  </h1>
                  {vendor.verified && (
                    <Badge className="bg-brand-success text-white border-0 px-3 py-1 gap-1">
                      <Shield className="w-3 h-3" />
                      Verified Seller
                    </Badge>
                  )}
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(vendor.ratingAverage)
                              ? "fill-brand-accent text-brand-accent"
                              : "text-brand-muted",
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-brand-dark">
                      {vendor.ratingAverage.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-brand-muted text-sm">
                    {vendor.ratingCount.toLocaleString()}{" "}
                    {vendor.ratingCount === 1 ? "review" : "reviews"}
                  </span>

                  {/* {totalProducts > 0 && (
                    <>
                      <span className="text-brand-muted">•</span>
                      <span className="text-brand-muted text-sm">
                        {totalProducts} {totalProducts === 1 ? "product" : "products"}
                      </span>
                    </>
                  )} */}
                </div>
              </div>

              {/* Mobile action buttons */}
              <div className="flex md:hidden gap-2">
                {onContact && (
                  <Button
                    onClick={onContact}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-brand-primary-soft text-brand-dark"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                )}
                {onViewProducts && (
                  <Button
                    onClick={onViewProducts}
                    size="sm"
                    className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-hover"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Shop
                  </Button>
                )}
              </div>
            </div>

            {/* Business Description */}
            {vendor.description && (
              <p className="text-brand-muted mt-3 max-w-3xl text-sm sm:text-base leading-relaxed">
                {vendor.description}
              </p>
            )}
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
          {/* Contact Card */}
          <Card className="group p-4 hover:shadow-md transition-all duration-300 border border-brand-primary-soft hover:border-brand-primary/30 hover:-translate-y-0.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary-soft group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                <Phone className="h-4 w-4 text-brand-primary group-hover:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Contact
                </h3>
                {vendor.phone && (
                  <p className="text-sm text-brand-dark font-medium truncate">
                    {vendor.phone}
                  </p>
                )}
                <p className="text-sm text-brand-muted truncate">
                  {vendor.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Location Card */}
          <Card className="group p-4 hover:shadow-md transition-all duration-300 border border-brand-primary-soft hover:border-brand-primary/30 hover:-translate-y-0.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary-soft group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                <MapPin className="h-4 w-4 text-brand-primary group-hover:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Location
                </h3>
                <p className="text-sm text-brand-dark font-medium">
                  {vendor.location.city}, {vendor.location.state}
                </p>
                <p className="text-sm text-brand-muted">
                  {vendor.location.country}
                </p>
              </div>
            </div>
          </Card>

          {/* Status Card */}
          <Card className="group p-4 hover:shadow-md transition-all duration-300 border border-brand-primary-soft hover:border-brand-primary/30 hover:-translate-y-0.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary-soft group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                <Clock className="h-4 w-4 text-brand-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Status
                </h3>
                <div className="flex flex-col gap-1">
                  <Badge
                    variant={vendor.isActive ? "default" : "secondary"}
                    className={cn(
                      "text-xs w-fit",
                      vendor.isActive && "bg-brand-success text-white",
                    )}
                  >
                    {vendor.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {joinDate && (
                    <span className="text-xs text-brand-muted">
                      Joined {joinDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping/Delivery Card */}
          <Card className="group p-4 hover:shadow-md transition-all duration-300 border border-brand-primary-soft hover:border-brand-primary/30 hover:-translate-y-0.5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary-soft group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                <Truck className="h-4 w-4 text-brand-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xs text-brand-muted uppercase tracking-wide mb-1">
                  Delivery
                </h3>
                <p className="text-sm text-brand-dark font-medium">
                  Nationwide Shipping
                </p>
                <p className="text-xs text-brand-muted">
                  Fast & reliable delivery
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Badges Section */}
        {vendor.verified && (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 mb-4 border-t border-brand-primary-soft">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-brand-primary" />
              <span className="text-xs text-brand-muted">
                Quality Guaranteed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-primary" />
              <span className="text-xs text-brand-muted">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-brand-primary" />
              <span className="text-xs text-brand-muted">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-brand-primary" />
              <span className="text-xs text-brand-muted">24/7 Support</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
