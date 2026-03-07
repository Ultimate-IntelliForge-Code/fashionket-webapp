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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  },
  errorComponent: () => {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-mmp-primary2">
          My Account
        </h1>
        <p className="text-xs sm:text-sm text-mmp-primary2/70 mt-1 sm:mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        {/* Mobile-Optimized Tabs */}
        <TabsList className="grid w-full grid-cols-2 h-auto  bg-mmp-primary/10">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-1 sm:py-1 data-[state=active]:bg-mmp-neutral data-[state=active]:shadow-sm text-mmp-primary2 data-[state=active]:text-mmp-primary2"
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="flex items-center justify-center gap-1.5 sm:gap-2 py-1 sm:py-1 data-[state=active]:bg-mmp-neutral data-[state=active]:shadow-sm text-mmp-primary2 data-[state=active]:text-mmp-primary2"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Addresses</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Info Card */}
            <Card className="lg:col-span-2 overflow-hidden border border-mmp-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2 sm:pb-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm sm:text-base text-mmp-primary2">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-xs text-mmp-primary2/70">
                    Update your personal details
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 sm:h-9 text-xs sm:text-sm border-mmp-primary/30 text-mmp-primary hover:bg-mmp-primary/10"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
                {isEditing ? (
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-5"
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                        {...form.register("fullName")}
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+234 800 000 0000"
                        className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                        {...form.register("phone")}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 pt-3 sm:pt-4">
                      <Button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-mmp-accent hover:bg-mmp-secondary text-white"
                      >
                        {updateProfile.isPending ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
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
                        className="flex-1 xs:flex-none h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/30 text-mmp-primary hover:bg-mmp-primary/10"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-mmp-secondary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-mmp-primary2/70">
                          Full Name
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-mmp-primary2 truncate">
                          {user.fullName || "Not set"}
                        </p>
                      </div>
                    </div>
                    <Separator className="bg-mmp-primary/10" />
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-mmp-secondary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-mmp-primary2/70">
                          Email
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-mmp-primary2 break-all">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Separator className="bg-mmp-primary/10" />
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-mmp-secondary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-mmp-primary2/70">
                          Phone
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-mmp-primary2">
                          {user.phone || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card className="border border-mmp-primary/10">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-sm sm:text-base text-mmp-primary2">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2 space-y-4 sm:space-y-5">
                <div>
                  <p className="text-[10px] sm:text-xs text-mmp-primary2/70 mb-1.5">
                    Status
                  </p>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={cn(
                      "text-[10px] sm:text-xs px-2 py-0.5",
                      user.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <Separator className="bg-mmp-primary/10" />
                <div className="flex items-start gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-mmp-secondary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-mmp-primary2/70">
                      Member Since
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-mmp-primary2">
                      {new Date(
                        user.createdAt || new Date(),
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Separator className="bg-mmp-primary/10" />
                <div>
                  <p className="text-[10px] sm:text-xs text-mmp-primary2/70 mb-1.5">
                    Role
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs px-2 py-0.5 border-mmp-accent/30 text-mmp-accent"
                  >
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <Card className="border border-mmp-primary/10">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-mmp-primary2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-mmp-secondary" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-xs text-mmp-primary2/70">
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs sm:text-sm border-mmp-primary/30 text-mmp-primary hover:bg-mmp-primary/10"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <div className="space-y-4 sm:space-y-6">
            {/* Add New Address Form */}
            {(isAddingAddress || editingAddressId) && (
              <Card className="border border-mmp-primary/10">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base text-mmp-primary2">
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </CardTitle>
                  <CardDescription className="text-xs text-mmp-primary2/70">
                    {editingAddressId
                      ? "Update your delivery address details"
                      : "Enter your delivery address details"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form
                    onSubmit={addressForm.handleSubmit((data) => {
                      console.log("Getting data", data);
                      if (editingAddressId) {
                        handleUpdateAddress(editingAddressId, data);
                      } else {
                        handleAddNewAddress(data);
                      }
                    })}
                    className="space-y-4 sm:space-y-5"
                  >
                    {/* Full Name */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        {...addressForm.register("fullName")}
                      />
                      {addressForm.formState.errors.fullName && (
                        <p className="text-xs text-red-500">
                          {addressForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="addressPhone"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="addressPhone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        {...addressForm.register("phone")}
                      />
                      {addressForm.formState.errors.phone && (
                        <p className="text-xs text-red-500">
                          {addressForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="addressLine1"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Street Address Line 1
                      </Label>
                      <Input
                        id="addressLine1"
                        placeholder="123 Main Street"
                        className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                        {...addressForm.register("addressLine1")}
                      />
                      {addressForm.formState.errors.addressLine1 && (
                        <p className="text-xs text-red-500">
                          {addressForm.formState.errors.addressLine1.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label
                        htmlFor="addressLine2"
                        className="text-xs sm:text-sm text-mmp-primary2"
                      >
                        Street Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="addressLine2"
                        placeholder="Apt, Suite, etc."
                        className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                        {...addressForm.register("addressLine2")}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="city"
                          className="text-xs sm:text-sm text-mmp-primary2"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="Lagos"
                          className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                          {...addressForm.register("city")}
                        />
                        {addressForm.formState.errors.city && (
                          <p className="text-xs text-red-500">
                            {addressForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="state"
                          className="text-xs sm:text-sm text-mmp-primary2"
                        >
                          State
                        </Label>
                        <Input
                          id="state"
                          placeholder="Lagos"
                          className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                          {...addressForm.register("state")}
                        />
                        {addressForm.formState.errors.state && (
                          <p className="text-xs text-red-500">
                            {addressForm.formState.errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="country"
                          className="text-xs sm:text-sm text-mmp-primary2"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          placeholder="Nigeria"
                          className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                          {...addressForm.register("country")}
                        />
                        {addressForm.formState.errors.country && (
                          <p className="text-xs text-red-500">
                            {addressForm.formState.errors.country.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="zipCode" // Fixed: changed from "postalCode"
                          className="text-xs sm:text-sm text-mmp-primary2"
                        >
                          ZIP Code
                        </Label>
                        <Input
                          id="zipCode" // Fixed: changed from "postalCode"
                          placeholder="100001"
                          className="h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/20 focus:border-mmp-accent focus:ring-mmp-accent/20"
                          {...addressForm.register("postalCode")} // Fixed: changed from "postalCode"
                        />
                        {addressForm.formState.errors.postalCode && ( // Fixed: changed from "zipCode"
                          <p className="text-xs text-red-500">
                            {addressForm.formState.errors.postalCode.message} //
                            Fixed: changed from "postalCode"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isDefault"
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-mmp-accent"
                        {...addressForm.register("isDefault")}
                      />
                      <Label
                        htmlFor="isDefault"
                        className="text-xs sm:text-sm cursor-pointer text-mmp-primary2"
                      >
                        Set as default address
                      </Label>
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 pt-3">
                      <Button
                        type="submit"
                        disabled={isAdding || isUpdating}
                        className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-mmp-accent hover:bg-mmp-secondary text-white"
                      >
                        {isAdding || isUpdating ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 animate-spin" />
                            {editingAddressId ? "Updating..." : "Adding..."}
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                            {editingAddressId
                              ? "Update Address"
                              : "Save Address"}
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
                        className="flex-1 xs:flex-none h-9 sm:h-10 text-xs sm:text-sm border-mmp-primary/30 text-mmp-primary hover:bg-mmp-primary/10"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Addresses List */}
            {addresses && addresses.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {addresses.map((address: IAddress) => (
                  <Card
                    key={address._id}
                    className={cn(
                      "overflow-hidden transition-all border border-mmp-primary/10",
                      selectedAddressId === address._id &&
                        "ring-1 ring-mmp-accent",
                    )}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {address.isDefault ? (
                              <Badge className="bg-mmp-accent text-white text-[10px] sm:text-xs px-2 py-0.5">
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 fill-current" />
                                Default
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs px-2 py-0.5 border-mmp-primary/20 text-mmp-primary2"
                              >
                                <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                Address
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs sm:text-sm font-medium text-mmp-primary2">
                              {address.addressLine1}
                            </p>
                            {address.addressLine2 && (
                              <p className="text-xs sm:text-sm text-mmp-primary2">
                                {address.addressLine2}
                              </p>
                            )}
                            <p className="text-[10px] sm:text-xs text-mmp-primary2/70">
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </p>
                            <p className="text-[10px] sm:text-xs text-mmp-primary2/70">
                              {address.country}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 self-end xs:self-start">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 text-mmp-primary hover:bg-mmp-primary/10"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAddress(address._id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 border-mmp-accent/30 text-mmp-accent hover:bg-mmp-accent/10"
                              onClick={() =>
                                handleSetDefaultAddress(address._id)
                              }
                            >
                              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
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
              <Card className="border border-mmp-primary/10">
                <CardContent className="p-8 sm:p-10">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-mmp-primary/10 mb-3 sm:mb-4">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-mmp-secondary" />
                    </div>
                    <p className="text-xs sm:text-sm text-mmp-primary2/70 mb-4">
                      No saved addresses. Add an address to make checkout
                      faster.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Address Button */}
            {!isAddingAddress && !editingAddressId && (
              <Button
                onClick={() => setIsAddingAddress(true)}
                variant="outline"
                className="w-full h-10 sm:h-11 text-xs sm:text-sm border-mmp-accent/30 text-mmp-accent hover:bg-mmp-accent/10"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Add New Address
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
