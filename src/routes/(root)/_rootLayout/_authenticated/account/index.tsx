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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Shield,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Home,
  Star,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUser, IUpdateUserPayload, IAddress } from "@/types";
import { toast } from "react-toastify";
import {
  addressesQuery,
  useUpdateUserProfile,
  userProfile,
} from "@/api/queries";
import {
  useAddAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/api/mutations";
import {
  ShippingAddressFormData,
  shippingAddressSchema,
  userUpdateSchema,
  queryClient,
  cn,
} from "@/lib";

export const Route = createFileRoute(
  "/(root)/_rootLayout/_authenticated/account/",
)({
  component: UserAccountPage,
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary mx-auto mb-3" />
          <p className="text-brand-muted text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  },
  errorComponent: () => {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="border-brand-error/20 bg-brand-error/10">
          <AlertCircle className="h-4 w-4 text-brand-error" />
          <AlertDescription className="text-brand-error">
            Failed to load profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  },
  loader: async ({ context }) => {
    const [profile, addresses] = await Promise.all([
      context.queryClient.ensureQueryData(userProfile()),
      context.queryClient.ensureQueryData(addressesQuery()),
    ]);

    return { profile, addresses };
  },
});

function UserAccountPage() {
  const { profile, addresses } = Route.useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses?.find((addr: IAddress) => addr.isDefault)?._id ||
      addresses?.[0]?._id ||
      null,
  );

  const { mutateAsync: addAddress, isPending: isAdding } = useAddAddress();
  const { mutateAsync: deleteAddress, isPending: isDeleting } =
    useDeleteAddress();
  const { mutateAsync: updateAddress, isPending: isUpdating } =
    useUpdateAddress();
  const updateProfile = useUpdateUserProfile();

  const form = useForm<IUpdateUserPayload>({
    resolver: zodResolver(userUpdateSchema as any),
    defaultValues: {
      fullName: profile?.fullName || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
    },
  });

  const addressForm = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema as any),
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data: IUpdateUserPayload) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 409) {
        toast.error("Email already in use");
      } else {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleAddNewAddress = async (data: ShippingAddressFormData) => {
    try {
      await addAddress(data);
      toast.success("Address added successfully");
      setIsAddingAddress(false);
      addressForm.reset();
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to add address, please try again");
    }
  };

  const handleUpdateAddress = async (
    addressId: string,
    data: ShippingAddressFormData,
  ) => {
    try {
      await updateAddress({ _id: addressId, ...data });
      toast.success("Address updated successfully");
      setEditingAddressId(null);
      addressForm.reset();
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    } catch (error: any) {
      toast.error(
        error.message || "Failed to update address, please try again",
      );
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (addresses.length <= 1) {
      toast.error("Cannot delete the last address");
      return;
    }

    try {
      await deleteAddress(addressId);
      toast.success("Address deleted successfully");

      if (selectedAddressId === addressId) {
        const remainingAddress = addresses.find(
          (addr: IAddress) => addr._id !== addressId,
        );
        if (remainingAddress) {
          setSelectedAddressId(remainingAddress._id);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    } catch (error: any) {
      toast.error(
        error.message || "Failed to delete address, please try again",
      );
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    const address = addresses.find((addr: IAddress) => addr._id === addressId);
    if (address && !address.isDefault) {
      await handleUpdateAddress(addressId, { ...address, isDefault: true });
      setSelectedAddressId(addressId);
    }
  };

  const handleEditAddress = (address: IAddress) => {
    setEditingAddressId(address._id);
    addressForm.reset({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode || "",
      isDefault: address.isDefault,
    });
  };

  const user = profile as IUser;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand-primary-soft rounded-lg">
            <User className="w-5 h-5 text-brand-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark">
            My Account
          </h1>
        </div>
        <p className="text-brand-muted text-sm sm:text-base ml-11">
          Manage your account settings, profile information, and saved addresses
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6 sm:space-y-8">
        {/* Tabs Navigation */}
        <TabsList className="inline-flex h-auto p-1 bg-brand-surface rounded-xl gap-1">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm text-brand-muted hover:text-brand-dark transition-all"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile Information</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm text-brand-muted hover:text-brand-dark transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Saved Addresses</span>
            <span className="sm:hidden">Addresses</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information Card */}
            <Card className="lg:col-span-2 border-brand-primary-soft shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl text-brand-dark">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-brand-muted text-sm">
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft hover:border-brand-primary"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-2">
                {isEditing ? (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-brand-dark font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                        {...form.register("fullName")}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-sm text-brand-error">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-brand-dark font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-brand-error">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-brand-dark font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+234 800 000 0000"
                        className="border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-sm text-brand-error">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Form Actions */}
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
                            Save Changes
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
                        className="flex-1 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Display Fields */}
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                      <User className="w-5 h-5 text-brand-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-brand-muted uppercase tracking-wide">Full Name</p>
                        <p className="text-base font-medium text-brand-dark mt-0.5">
                          {user.fullName || "Not set"}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-brand-primary-soft" />
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                      <Mail className="w-5 h-5 text-brand-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-brand-muted uppercase tracking-wide">Email Address</p>
                        <p className="text-base font-medium text-brand-dark mt-0.5 break-all">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-brand-primary-soft" />
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-surface transition-colors">
                      <Phone className="w-5 h-5 text-brand-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-brand-muted uppercase tracking-wide">Phone Number</p>
                        <p className="text-base font-medium text-brand-dark mt-0.5">
                          {user.phone || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card className="border-brand-primary-soft shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-brand-dark">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Badge */}
                <div>
                  <p className="text-xs text-brand-muted mb-2">Account Status</p>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={cn(
                      "px-3 py-1 text-sm font-medium",
                      user.isActive
                        ? "bg-brand-success/10 text-brand-success border-brand-success/20"
                        : "bg-brand-muted/10 text-brand-muted border-brand-muted/20"
                    )}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <Separator className="bg-brand-primary-soft" />
                
                {/* Member Since */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-brand-muted">Member Since</p>
                    <p className="text-sm font-medium text-brand-dark mt-0.5">
                      {new Date(user.createdAt || new Date()).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-brand-primary-soft" />
                
                {/* User Role */}
                <div>
                  <p className="text-xs text-brand-muted mb-2">Account Role</p>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-sm font-medium border-brand-primary-soft text-brand-primary bg-brand-primary-soft/30"
                  >
                    {user.role?.toUpperCase() || "CUSTOMER"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings Card */}
          <Card className="border-brand-primary-soft shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-primary" />
                <CardTitle className="text-lg text-brand-dark">Security Settings</CardTitle>
              </div>
              <CardDescription className="text-brand-muted">
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft"
              >
                <Settings className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-6">
          {/* Address Form (Add/Edit Mode) */}
          {(isAddingAddress || editingAddressId) && (
            <Card className="border-brand-primary-soft shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-brand-dark">
                  {editingAddressId ? "Edit Address" : "Add New Address"}
                </CardTitle>
                <CardDescription className="text-brand-muted">
                  {editingAddressId
                    ? "Update your delivery address details"
                    : "Enter your delivery address details below"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={addressForm.handleSubmit((data) => {
                    if (editingAddressId) {
                      handleUpdateAddress(editingAddressId, data);
                    } else {
                      handleAddNewAddress(data);
                    }
                  })}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="addressFullName" className="text-brand-dark font-medium">
                        Full Name <span className="text-brand-error">*</span>
                      </Label>
                      <Input
                        id="addressFullName"
                        placeholder="John Doe"
                        className="border-brand-primary-soft focus:border-brand-primary"
                        {...addressForm.register("fullName")}
                      />
                      {addressForm.formState.errors.fullName && (
                        <p className="text-sm text-brand-error">
                          {addressForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="addressPhone" className="text-brand-dark font-medium">
                        Phone Number <span className="text-brand-error">*</span>
                      </Label>
                      <Input
                        id="addressPhone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        className="border-brand-primary-soft focus:border-brand-primary"
                        {...addressForm.register("phone")}
                      />
                      {addressForm.formState.errors.phone && (
                        <p className="text-sm text-brand-error">
                          {addressForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1" className="text-brand-dark font-medium">
                      Street Address <span className="text-brand-error">*</span>
                    </Label>
                    <Input
                      id="addressLine1"
                      placeholder="123 Main Street"
                      className="border-brand-primary-soft focus:border-brand-primary"
                      {...addressForm.register("addressLine1")}
                    />
                    {addressForm.formState.errors.addressLine1 && (
                      <p className="text-sm text-brand-error">
                        {addressForm.formState.errors.addressLine1.message}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2" className="text-brand-dark font-medium">
                      Apartment, Suite, etc. (Optional)
                    </Label>
                    <Input
                      id="addressLine2"
                      placeholder="Apt 4B, Suite 100"
                      className="border-brand-primary-soft focus:border-brand-primary"
                      {...addressForm.register("addressLine2")}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-brand-dark font-medium">
                        City <span className="text-brand-error">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="Lagos"
                        className="border-brand-primary-soft focus:border-brand-primary"
                        {...addressForm.register("city")}
                      />
                      {addressForm.formState.errors.city && (
                        <p className="text-sm text-brand-error">
                          {addressForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-brand-dark font-medium">
                        State <span className="text-brand-error">*</span>
                      </Label>
                      <Input
                        id="state"
                        placeholder="Lagos"
                        className="border-brand-primary-soft focus:border-brand-primary"
                        {...addressForm.register("state")}
                      />
                      {addressForm.formState.errors.state && (
                        <p className="text-sm text-brand-error">
                          {addressForm.formState.errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-brand-dark font-medium">
                        Country <span className="text-brand-error">*</span>
                      </Label>
                      <Input
                        id="country"
                        placeholder="Nigeria"
                        className="border-brand-primary-soft focus:border-brand-primary"
                        {...addressForm.register("country")}
                      />
                      {addressForm.formState.errors.country && (
                        <p className="text-sm text-brand-error">
                          {addressForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-brand-dark font-medium">
                        ZIP / Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        placeholder="100001"
                        className="border-brand-primary-soft focus:border-brand-primary"
                        {...addressForm.register("postalCode")}
                      />
                      {addressForm.formState.errors.postalCode && (
                        <p className="text-sm text-brand-error">
                          {addressForm.formState.errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      className="w-4 h-4 rounded border-brand-primary-soft text-brand-primary focus:ring-brand-primary-soft"
                      {...addressForm.register("isDefault")}
                    />
                    <Label
                      htmlFor="isDefault"
                      className="text-sm text-brand-dark cursor-pointer"
                    >
                      Set as default shipping address
                    </Label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isAdding || isUpdating}
                      className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-hover"
                    >
                      {isAdding || isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {editingAddressId ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {editingAddressId ? "Update Address" : "Save Address"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddressId(null);
                        addressForm.reset();
                      }}
                      className="flex-1 border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Addresses List */}
          {addresses && addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address: IAddress) => (
                <Card
                  key={address._id}
                  className={cn(
                    "border-brand-primary-soft shadow-sm hover:shadow-md transition-all",
                    selectedAddressId === address._id && "ring-2 ring-brand-primary ring-offset-2"
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                          {address.isDefault && (
                            <Badge className="bg-brand-primary text-white px-2 py-0.5 text-xs">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Default
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-brand-primary-soft text-brand-muted text-xs">
                            <Home className="w-3 h-3 mr-1" />
                            Shipping Address
                          </Badge>
                        </div>

                        {/* Address Details */}
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-brand-dark">
                            {address.fullName && `${address.fullName} • `}
                            <span className="text-brand-muted font-normal">{address.phone}</span>
                          </p>
                          <p className="text-sm text-brand-dark">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-sm text-brand-dark">{address.addressLine2}</p>
                          )}
                          <p className="text-sm text-brand-muted">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-sm text-brand-muted">{address.country}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-start">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-brand-primary hover:bg-brand-primary-soft"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-brand-error hover:bg-brand-error/10"
                          onClick={() => handleDeleteAddress(address._id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs border-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft"
                            onClick={() => handleSetDefaultAddress(address._id)}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-brand-primary-soft">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-soft mb-4">
                  <MapPin className="w-8 h-8 text-brand-primary" />
                </div>
                <p className="text-brand-dark font-medium mb-2">No addresses saved</p>
                <p className="text-brand-muted text-sm mb-6">
                  Add a shipping address to make checkout faster and easier
                </p>
              </CardContent>
            </Card>
          )}

          {/* Add Address Button */}
          {!isAddingAddress && !editingAddressId && (
            <Button
              onClick={() => setIsAddingAddress(true)}
              variant="outline"
              className="w-full h-11 border-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}