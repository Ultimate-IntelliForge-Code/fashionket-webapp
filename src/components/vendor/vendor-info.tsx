import React from "react";
import { MapPin, Phone, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IVendor } from "@/types";

interface VendorInfoProps {
  vendor: IVendor;
}

export const VendorInfo: React.FC<VendorInfoProps> = ({ vendor }) => {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Location</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {vendor.location.street}
            </p>
            <p className="text-sm text-muted-foreground">
              {vendor.location.city}, {vendor.location.state} {vendor.location.country}
            </p>
          </div>

          {/* Contact */}
          {vendor.phone && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Phone</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {vendor.phone}
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Email</h3>
            </div>
            <p className="text-sm text-muted-foreground break-all">
              {vendor.email}
            </p>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-3">Status</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Active:</span>
                <span className="ml-2 font-medium">
                  {vendor.isActive ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Verified:</span>
                <span className="ml-2 font-medium">
                  {vendor.verified ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
