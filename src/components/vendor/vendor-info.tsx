import React from "react";
import { MapPin, Phone, Info, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IVendor } from "@/types";
import { Badge } from "../ui/badge";

interface VendorInfoProps {
  vendor: IVendor;
}

export const VendorInfo: React.FC<VendorInfoProps> = ({ vendor }) => {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {/* Contact */}
          {vendor.phone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-xs lg:text-sm sm:text-base">Phone</h3>
              </div>
              <div className="pl-6 sm:pl-7">
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground break-all">
                  {vendor.phone}
                </p>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-xs lg:text-sm sm:text-base">Email</h3>
            </div>
            <div className="pl-6 sm:pl-7">
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground break-all">
                {vendor.email}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-xs lg:text-sm sm:text-base">Status</h3>
            </div>
            <div className="pl-6 sm:pl-7 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                  Active:
                </span>
                <Badge
                  variant={vendor.isActive ? "default" : "secondary"}
                  className="text-[10px] sm:text-[10px] px-2 py-0"
                >
                  {vendor.isActive ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                  Verified:
                </span>
                <Badge
                  variant={vendor.verified ? "default" : "secondary"}
                  className="text-[10px] sm:text-[10px] px-2 py-0"
                >
                  {vendor.verified ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-xs lg:text-sm sm:text-base">Location</h3>
            </div>
            <div className="pl-6 sm:pl-7">
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                {vendor.location.street}
              </p>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                {vendor.location.city}, {vendor.location.state}
              </p>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                {vendor.location.country}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
