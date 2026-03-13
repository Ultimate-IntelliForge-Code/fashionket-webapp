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
  Mail,
  Clock,
  Package,
  Truck,
  Shield,
  ChevronRight,
  LocateFixed,
} from "lucide-react";
import type { IVendor } from "@/types";

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

  return (
    <div className="relative">
      {/* Cover Photo Area - Facebook style gradient cover */}
      <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-mmp-primary2 to-mmp-primary relative">
        {/* Navigation buttons - positioned absolutely on cover */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Button
            onClick={() => window.history.back()}
            size="sm"
            className="bg-white/0 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white shadow-lg"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Profile Section - Facebook style overlapping profile */}
      <div className="container mx-auto px-4">
        <div className="relative flex flex-row md:items-end gap-4 -mt-16 sm:-mt-20 md:-mt-24 pb-4">
          {/* Profile Picture */}
          <div className="ml-0 md:ml-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
              {vendor.logoUrl ? (
                <img
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Store className="h-12 w-12 sm:h-16 sm:w-16 text-mmp-primary2/40" />
                </div>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="flex-1 md:pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {vendor.businessName}
                  </h1>
                  {vendor.verified && (
                    <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Rating - Prominently displayed like Facebook reviews */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(vendor.ratingAverage)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-mmp-accent"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-mmp-accent">
                      {vendor.ratingAverage.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-mmp-accent text-sm">
                    {vendor.ratingCount}{" "}
                    {vendor.ratingCount === 1 ? "review" : "reviews"}
                  </span>

                  {/* {vendor.totalProducts && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-sm">
                        <Package className="w-4 h-4 inline mr-1" />
                        {vendor.totalProducts} products
                      </span>
                    </>
                  )} */}
                </div>
              </div>

              {/* Action Buttons - Like Facebook's "Follow" and "Message" */}
              {/* <div className="flex gap-2">
                <Button
                  onClick={onContact}
                  variant="default"
                  className="bg-mmp-primary hover:bg-mmp-primary2"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button
                  onClick={onViewProducts}
                  variant="outline"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Products
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div> */}
            </div>

            {/* Business Description */}
            {vendor.description && (
              <p className="text-gray-600 mt-3 max-w-3xl">
                {vendor.description}
              </p>
            )}
          </div>
        </div>

        {/* Info Cards - Like Facebook's "About" section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
          {/* Contact Card */}
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-500 mb-1">
                  Contact
                </h3>
                {vendor.phone && (
                  <p className="text-sm text-gray-900 truncate">
                    {vendor.phone}
                  </p>
                )}
                <p className="text-sm text-gray-900 truncate">{vendor.email}</p>
              </div>
            </div>
          </Card>

          {/* Location Card */}
          <div className="grid grid-cols-2 md:flex gap-2">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">
                    Location
                  </h3>
                  <p className="text-sm text-gray-900">
                    {vendor.location.city}, {vendor.location.state}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {vendor.location.country}
                  </p>
                </div>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">
                    Status
                  </h3>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <Badge
                      variant={vendor.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {vendor.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {joinDate && (
                      <span className="text-xs text-gray-500">
                        Joined {joinDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Shipping/Delivery Card - E-commerce specific
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <LocateFixed className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Address</h3>
                   <p className="text-gray-900 text-sm">
                  {vendor.location.street}<br />
                  {vendor.location.city}, {vendor.location.state}<br />
                  {vendor.location.country}
                </p>
              </div>
            </div>
          </Card> */}
        </div>

        {/* Additional Info - Like Facebook's detailed about section (collapsible) */}
        {/* <details className="mb-8">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
            More about {vendor.businessName}
          </summary>
          <Card className="p-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3">
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-2">Address</h4>
            
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-500 mb-2">Business Details</h4>
                <dl className="space-y-1">
                  <div className="flex">
                    <dt className="w-24 text-sm text-gray-500">Tax ID:</dt>
                    <dd className="text-sm text-gray-900">{vendor.taxId || "Not provided"}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 text-sm text-gray-500">Founded:</dt>
                    <dd className="text-sm text-gray-900">{vendor.foundedYear || "N/A"}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-24 text-sm text-gray-500">Employees:</dt>
                    <dd className="text-sm text-gray-900">{vendor.employeeCount || "N/A"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </Card>
        </details> */}
      </div>
    </div>
  );
};
