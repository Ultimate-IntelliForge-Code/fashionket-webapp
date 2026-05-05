import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Store,
  Mail,
  Phone,
  MapPin,
  Star,
  FileText,
  Edit2,
  Check,
  X,
  Package,
  Building2,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Wallet,
  Info,
  Globe,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IVendor, IUpdateVendorPayload, AccountStatus } from "@/types";
import { toast } from "react-toastify";
import { useUpdateVendorProfile } from "@/api/queries";
import { vendorUpdateSchema } from "@/lib";
import { Link } from "@tanstack/react-router";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { useVendorProfile } from "@/api/hooks";

export const Route = createFileRoute("/vendor/_vendorLayout/settings/")({
  component: VendorAccountPage,
});

function VendorAccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateVendorProfile();

  const {
    data: profile,
    error: profileError,
    isLoading: isProfileLoading,
    refetch,
  } = useVendorProfile();

  const form = useForm<IUpdateVendorPayload>({
    resolver: zodResolver(vendorUpdateSchema as any),
    defaultValues: {
      fullName: profile?.fullName || "",
      businessName: profile?.businessName || "",
      description: profile?.description || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
      logoUrl: profile?.logoUrl || "",
      location: {
        street: profile?.location?.street || "",
        city: profile?.location?.city || "",
        state: profile?.location?.state || "",
        country: profile?.location?.country || "",
      },
    },
  });

  const onSubmit = async (data: IUpdateVendorPayload) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Business profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Business name or email already in use");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const vendor = profile as IVendor;

  const getStatusConfig = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return {
          variant: "default" as const,
          icon: CheckCircle2,
          label: "Active",
          color:
            "text-brand-success bg-brand-success/10 border-brand-success/20",
          description: "Your account is fully active and operational.",
        };
      case AccountStatus.UNDER_REVIEW:
        return {
          variant: "secondary" as const,
          icon: Clock,
          label: "Under Review",
          color:
            "text-brand-warning bg-brand-warning/10 border-brand-warning/20",
          description: "Your account is being reviewed by our team.",
        };
      case AccountStatus.SUSPENDED:
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Suspended",
          color: "text-brand-error bg-brand-error/10 border-brand-error/20",
          description:
            "Your account has been suspended. Please contact support.",
        };
      case AccountStatus.REJECTED:
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Rejected",
          color: "text-brand-error bg-brand-error/10 border-brand-error/20",
          description:
            "Your application was rejected. Please contact support for details.",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: Info,
          label: "Pending",
          color: "text-brand-muted bg-brand-surface border-brand-primary-soft",
          description: "Your account is being processed.",
        };
    }
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <ErrorState
              title="Unable to Load Settings Data"
              error={profileError}
              onRetry={() => {
                refetch();
              }}
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }
  const statusConfig = getStatusConfig(vendor.accountStatus);

  return (
    <div className="min-h-screen">
      {/* Account Status Alert */}
      {vendor.accountStatus !== AccountStatus.ACTIVE && (
        <Alert className={`mb-6 border ${statusConfig.color}`}>
          <statusConfig.icon className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {statusConfig.description}
          </AlertDescription>
        </Alert>
      )}

      {/* Business Profile Tab */}
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Business Information Form */}
          <Card className="lg:col-span-2 border-brand-primary-soft shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-brand-primary-soft bg-brand-surface/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-brand-dark flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand-primary" />
                    Business Information
                  </CardTitle>
                  <CardDescription className="text-brand-muted mt-1">
                    Update your business details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-brand-primary text-brand-primary hover:bg-brand-primary-soft"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="businessName"
                        className="text-brand-dark font-medium"
                      >
                        Business Name *
                      </Label>
                      <Input
                        id="businessName"
                        placeholder="Enter your business name"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                        {...form.register("businessName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-brand-dark font-medium"
                      >
                        Contact Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                        {...form.register("fullName")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-brand-dark font-medium"
                    >
                      Business Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell customers about your business, products, and values..."
                      rows={4}
                      className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20 resize-none"
                      {...form.register("description")}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-brand-dark font-medium"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="business@example.com"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                        {...form.register("email")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-brand-dark font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1 234 567 8900"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                        {...form.register("phone")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="logoUrl"
                      className="text-brand-dark font-medium"
                    >
                      Logo URL
                    </Label>
                    <Input
                      id="logoUrl"
                      placeholder="https://example.com/your-logo.png"
                      className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                      {...form.register("logoUrl")}
                    />
                    <p className="text-xs text-brand-muted">
                      Provide a URL for your business logo (recommended size:
                      200x200px)
                    </p>
                  </div>

                  <Separator className="bg-brand-primary-soft" />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-primary" />
                      Business Location
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          placeholder="123 Business St"
                          className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                          {...form.register("location.street")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                          {...form.register("location.city")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                          {...form.register("location.state")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary/20"
                          {...form.register("location.country")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-hover"
                    >
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Save All Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      className="border-brand-muted text-brand-dark hover:bg-brand-surface"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                    <Store className="w-5 h-5 text-brand-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                        Business Name
                      </p>
                      <p className="font-semibold text-brand-dark">
                        {vendor.businessName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-3 h-3 text-brand-muted" />
                        <p className="text-sm text-brand-muted">
                          Slug: {vendor.slug}
                        </p>
                      </div>
                    </div>
                  </div>

                  {vendor.description && (
                    <>
                      <Separator className="bg-brand-primary-soft" />
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                        <FileText className="w-5 h-5 text-brand-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                            Description
                          </p>
                          <p className="text-brand-dark leading-relaxed">
                            {vendor.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator className="bg-brand-primary-soft" />
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                    <Mail className="w-5 h-5 text-brand-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="text-brand-dark">{vendor.email}</p>
                    </div>
                  </div>

                  {vendor.phone && (
                    <>
                      <Separator className="bg-brand-primary-soft" />
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                        <Phone className="w-5 h-5 text-brand-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                            Phone
                          </p>
                          <p className="text-brand-dark">{vendor.phone}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {(vendor.location?.street || vendor.location?.city) && (
                    <>
                      <Separator className="bg-brand-primary-soft" />
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                        <MapPin className="w-5 h-5 text-brand-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-brand-muted uppercase tracking-wide mb-1">
                            Location
                          </p>
                          <p className="text-brand-dark">
                            {[
                              vendor.location?.street,
                              vendor.location?.city,
                              vendor.location?.state,
                              vendor.location?.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Not set"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <div className="space-y-6">
            <Card className="border-brand-primary-soft shadow-sm">
              <CardHeader className="border-b border-brand-primary-soft bg-brand-surface/50">
                <CardTitle className="text-brand-dark flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-primary" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 rounded-lg bg-brand-surface">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-brand-muted">
                      Verification Status
                    </p>
                    <Badge
                      variant={vendor.verified ? "default" : "secondary"}
                      className={
                        vendor.verified
                          ? "bg-brand-success/10 text-brand-success border-brand-success/20"
                          : "bg-brand-warning/10 text-brand-warning border-brand-warning/20"
                      }
                    >
                      {vendor.verified ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {vendor.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-brand-primary-soft" />

                <div className="p-4 rounded-lg bg-brand-surface">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-brand-muted">Account Status</p>
                    <Badge
                      variant={statusConfig.variant}
                      className={statusConfig.color}
                    >
                      <statusConfig.icon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-brand-primary-soft" />

                <div className="p-4 rounded-lg bg-brand-surface">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-5 h-5 text-brand-accent fill-brand-accent" />
                    <div>
                      <p className="text-sm text-brand-muted">Seller Rating</p>
                      <p className="text-xl font-bold text-brand-dark">
                        {vendor.ratingAverage.toFixed(1)}
                        <span className="text-sm font-normal text-brand-muted">
                          {" "}
                          / 5.0
                        </span>
                      </p>
                      <p className="text-xs text-brand-muted mt-1">
                        Based on {vendor.ratingCount} review
                        {vendor.ratingCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {vendor.logoUrl && (
                  <>
                    <Separator className="bg-brand-primary-soft" />
                    <div className="p-4 rounded-lg bg-brand-surface">
                      <p className="text-sm text-brand-muted mb-3">
                        Business Logo
                      </p>
                      <div className="relative inline-block">
                        <img
                          src={vendor.logoUrl}
                          alt={vendor.businessName}
                          className="w-24 h-24 rounded-xl object-cover border-2 border-brand-primary-soft shadow-sm"
                        />
                        <ImageIcon className="absolute -bottom-2 -right-2 w-5 h-5 text-brand-primary bg-white rounded-full p-1" />
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-brand-primary-soft" />

                <div className="p-4 rounded-lg bg-brand-surface">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-primary" />
                    <div>
                      <p className="text-sm text-brand-muted">Member Since</p>
                      <p className="font-semibold text-brand-dark">
                        {new Date(
                          vendor.createdAt || new Date(),
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-brand-primary-soft bg-gradient-to-br from-brand-primary-soft to-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-brand-dark text-lg">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-brand-muted">
                  Manage your store settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-brand-primary-soft hover:bg-brand-primary-soft"
                  asChild
                >
                  <Link to="/vendor/products/new">
                    <Package className="w-4 h-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-brand-primary-soft hover:bg-brand-primary-soft"
                  asChild
                >
                  <Link to="/vendor/orders">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Orders
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-brand-primary-soft hover:bg-brand-primary-soft"
                  asChild
                >
                  <Link to="/vendor/wallet">
                    <Wallet className="w-4 h-4 mr-2" />
                    Withdraw Earnings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
