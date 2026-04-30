import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { useAuth, useCart } from "@/hooks";
import {
  useAddAddress,
  useCreateOrder,
  useDeleteAddress,
  useInitPayment,
} from "@/api/mutations";
import { addressesQuery } from "@/api/queries";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Loader2,
  MapPin,
  User,
  Phone,
  Mail,
  ShoppingCartIcon,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Truck,
  Store,
  Shield,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { FcAddressBook } from "react-icons/fc";
import { DeliveryMethod } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useShippingFeeQuery } from "@/api/hooks/address.hook";
import { ShippingAddressFormData, shippingAddressSchema } from "@/lib/zod";
import { TAX_PERCENT } from "@/config/env.config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/(root)/_rootLayout/_authenticated/checkout/",
)({
  component: CheckoutPage,
  loader: async ({ context }) => {
    return await context.queryClient.ensureQueryData(addressesQuery());
  },
});

function CheckoutPage() {
  const addresses = Route.useLoaderData();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { items, subtotal, itemCount, isEmpty } = useCart();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrder();
  const { mutateAsync: initPayment, isPending: isInitializingPayment } =
    useInitPayment();
  const { mutateAsync: addAddress } = useAddAddress();
  const { mutateAsync: deleteAddress } = useDeleteAddress();

  const [deliveryMethod, setDeliveryMethod] = React.useState<DeliveryMethod>(
    DeliveryMethod.DELIVERY,
  );
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("");
  const [showAddAddressDialog, setShowAddAddressDialog] = React.useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = React.useState(false);
  const [orderNotes, setOrderNotes] = React.useState("");

  const {
    data: shippingFeeData,
    isError: isShippingError,
  } = useShippingFeeQuery(selectedAddressId);

  // Calculate shipping fee
  const shippingFee = React.useMemo(() => {
    if (deliveryMethod !== DeliveryMethod.DELIVERY) return 0;
    if (!selectedAddressId) return 0;
    if (isShippingError) return 0;
    return shippingFeeData?.totalDeliveryFee ?? 0;
  }, [deliveryMethod, selectedAddressId, shippingFeeData, isShippingError]);

  // Calculate totals
  const tax = subtotal * TAX_PERCENT;
  const total = subtotal + tax + shippingFee;

  // Form for new addresses
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors, isValid: isAddressValid },
    reset: resetAddressForm,
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema as any),
    defaultValues: {
      country: "Nigeria",
      isDefault: false,
    },
    mode: "onChange",
  });

  // Auto-select first address if none selected
  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses, selectedAddressId]);

  const handleAddNewAddress = async (data: ShippingAddressFormData) => {
    try {
      setIsSubmittingAddress(true);
      const newAddress = await addAddress(data);
      toast.success("Address added successfully");

      setSelectedAddressId(newAddress._id);
      setShowAddAddressDialog(false);
      resetAddressForm();

      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to add address, please try again");
    } finally {
      setIsSubmittingAddress(false);
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
          (addr) => addr._id !== addressId,
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

  const handlePlaceOrder = async () => {
    if (isEmpty) {
      toast.error("Your cart is empty");
      return;
    }

    if (deliveryMethod === DeliveryMethod.DELIVERY && !selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    try {
      setIsProcessing(true);

      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        addressId:
          deliveryMethod === DeliveryMethod.DELIVERY
            ? selectedAddressId
            : undefined,
        deliveryMethod: deliveryMethod,
        notes: orderNotes || "",
      };

      const createdOrder = await createOrder(orderPayload);

      const paymentData = await initPayment({
        orderId: createdOrder._id,
        callbackUrl: `${window.location.origin}/checkout/payment-status`,
      });

      localStorage.setItem("last_order_id", createdOrder._id);
      localStorage.setItem("last_order_number", createdOrder.orderNumber);

      window.location.href = paymentData.authorization_url;
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.message || "Failed to process order, please try again");
      setIsProcessing(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-brand-surface py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-primary-soft mb-6">
              <ShoppingCartIcon className="h-12 w-12 text-brand-primary" />
            </div>
            <h1 className="text-3xl font-bold text-brand-dark mb-4">
              Your cart is empty
            </h1>
            <p className="text-brand-muted mb-8 max-w-md mx-auto">
              Add items to your cart before proceeding to checkout.
            </p>
            <Button
              asChild
              className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md"
              size="lg"
            >
              <Link to="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-dark overflow-hidden">
        {/* <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }} />
        </div> */}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-white/90 hover:text-white hover:bg-white/20 rounded-lg"
                asChild
              >
                <Link to="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Cart
                </Link>
              </Button>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Checkout
              </h1>
              <p className="text-white/80">
                Complete your purchase in just a few steps
              </p>
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2 text-base">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 text-brand-surface" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path fill="currentColor" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Delivery Method Card */}
            <div className="bg-white rounded-xl border border-brand-primary-soft shadow-sm overflow-hidden">
              <div className="p-6 border-b border-brand-primary-soft">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-primary-soft">
                    <Truck className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark">
                      Delivery Method
                    </h2>
                    <p className="text-brand-muted text-sm">
                      Choose how you'd like to receive your order
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <Tabs
                  value={deliveryMethod}
                  onValueChange={(value) =>
                    setDeliveryMethod(value as DeliveryMethod)
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-brand-surface p-1 rounded-lg">
                    <TabsTrigger 
                      value={DeliveryMethod.DELIVERY} 
                      className="gap-2 data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-md"
                    >
                      <Truck className="h-4 w-4" />
                      Home Delivery
                    </TabsTrigger>
                    <TabsTrigger 
                      value={DeliveryMethod.PICK_UP} 
                      className="gap-2 data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm rounded-md"
                    >
                      <Store className="h-4 w-4" />
                      Store Pickup
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="delivery" className="space-y-6">
                    <div className="bg-brand-primary-soft/30 border border-brand-primary-soft rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-brand-dark mb-1">
                            Home Delivery
                          </h4>
                          <p className="text-sm text-brand-muted">
                            Your order will be delivered to your selected address
                            within 2-5 business days.
                          </p>
                          <p className="text-sm font-medium text-brand-primary mt-2">
                            Delivery fee: {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pickup" className="space-y-6">
                    <div className="bg-brand-success/10 border border-brand-success/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Store className="h-5 w-5 text-brand-success mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-brand-dark mb-1">
                            Store Pickup
                          </h4>
                          <p className="text-sm text-brand-muted">
                            Pick up your order at our store location. We'll notify
                            you when it's ready.
                          </p>
                          <p className="text-sm font-medium text-brand-success mt-2">
                            Pickup fee: <span className="font-semibold">Free</span>
                          </p>
                          <div className="mt-3 pt-3 border-t border-brand-success/20">
                            <p className="text-sm font-semibold text-brand-dark mb-1">
                              Store Location:
                            </p>
                            <p className="text-sm text-brand-muted">
                              123 Main Street, Lagos, Nigeria
                            </p>
                            <p className="text-sm text-brand-muted">
                              Mon-Sat: 9:00 AM - 6:00 PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Shipping Address Card */}
            {deliveryMethod === DeliveryMethod.DELIVERY && (
              <div className="bg-white rounded-xl border border-brand-primary-soft shadow-sm overflow-hidden">
                <div className="p-6 border-b border-brand-primary-soft">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-brand-primary-soft">
                        <MapPin className="h-6 w-6 text-brand-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-brand-dark">
                          Shipping Address
                        </h2>
                        <p className="text-brand-muted text-sm">
                          Select or add a delivery address
                        </p>
                      </div>
                    </div>
                    <Dialog
                      open={showAddAddressDialog}
                      onOpenChange={setShowAddAddressDialog}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-brand-primary-soft text-brand-primary hover:bg-brand-primary-soft"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-brand-dark">
                            Add New Address
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleSubmitAddress(handleAddNewAddress)}
                          className="space-y-4 mt-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName" className="text-brand-dark font-medium">
                                Full Name
                              </Label>
                              <Input
                                id="fullName"
                                placeholder="John Doe"
                                {...registerAddress("fullName")}
                                className="border-brand-primary-soft focus:border-brand-primary"
                              />
                              {addressErrors.fullName && (
                                <p className="text-sm text-brand-error">
                                  {addressErrors.fullName.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-brand-dark font-medium">
                                Phone
                              </Label>
                              <Input
                                id="phone"
                                placeholder="08012345678"
                                {...registerAddress("phone")}
                                className="border-brand-primary-soft focus:border-brand-primary"
                              />
                              {addressErrors.phone && (
                                <p className="text-sm text-brand-error">
                                  {addressErrors.phone.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="addressLine1" className="text-brand-dark font-medium">
                              Address Line 1 *
                            </Label>
                            <Input
                              id="addressLine1"
                              placeholder="Street address, P.O. Box, company name"
                              {...registerAddress("addressLine1")}
                              className="border-brand-primary-soft focus:border-brand-primary"
                            />
                            {addressErrors.addressLine1 && (
                              <p className="text-sm text-brand-error">
                                {addressErrors.addressLine1.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="addressLine2" className="text-brand-dark font-medium">
                              Address Line 2 (Optional)
                            </Label>
                            <Input
                              id="addressLine2"
                              placeholder="Apartment, suite, unit, building, floor, etc."
                              {...registerAddress("addressLine2")}
                              className="border-brand-primary-soft focus:border-brand-primary"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city" className="text-brand-dark font-medium">
                                City *
                              </Label>
                              <Input
                                id="city"
                                {...registerAddress("city")}
                                className="border-brand-primary-soft focus:border-brand-primary"
                              />
                              {addressErrors.city && (
                                <p className="text-sm text-brand-error">
                                  {addressErrors.city.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state" className="text-brand-dark font-medium">
                                State *
                              </Label>
                              <Input
                                id="state"
                                {...registerAddress("state")}
                                className="border-brand-primary-soft focus:border-brand-primary"
                              />
                              {addressErrors.state && (
                                <p className="text-sm text-brand-error">
                                  {addressErrors.state.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postalCode" className="text-brand-dark font-medium">
                                Postal Code *
                              </Label>
                              <Input
                                id="postalCode"
                                {...registerAddress("postalCode")}
                                className="border-brand-primary-soft focus:border-brand-primary"
                              />
                              {addressErrors.postalCode && (
                                <p className="text-sm text-brand-error">
                                  {addressErrors.postalCode.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="country" className="text-brand-dark font-medium">
                              Country
                            </Label>
                            <Input
                              id="country"
                              {...registerAddress("country")}
                              disabled
                              className="bg-brand-surface border-brand-primary-soft"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isDefault"
                              {...registerAddress("isDefault")}
                              className="rounded border-brand-primary-soft text-brand-primary focus:ring-brand-primary"
                            />
                            <Label htmlFor="isDefault" className="text-sm text-brand-dark cursor-pointer">
                              Set as default address
                            </Label>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 border-brand-primary-soft"
                              onClick={() => setShowAddAddressDialog(false)}
                              disabled={isSubmittingAddress}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 bg-brand-primary text-white hover:bg-brand-primary-hover"
                              disabled={!isAddressValid || isSubmittingAddress}
                            >
                              {isSubmittingAddress ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Adding...
                                </>
                              ) : (
                                "Add Address"
                              )}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="p-6">
                  {addresses.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-brand-primary-soft rounded-xl">
                      <MapPin className="h-12 w-12 text-brand-muted mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-brand-dark mb-2">
                        No addresses saved
                      </h4>
                      <p className="text-brand-muted mb-4">
                        Add a shipping address to continue with checkout
                      </p>
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={setSelectedAddressId}
                      className="space-y-3"
                    >
                      {addresses.map((address) => (
                        <div key={address._id} className="relative">
                          <RadioGroupItem
                            value={address._id}
                            id={`address-${address._id}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`address-${address._id}`}
                            className={cn(
                              "flex items-start justify-between p-4 border-2 rounded-xl cursor-pointer transition-all",
                              "hover:border-brand-primary",
                              "peer-data-[state=checked]:border-brand-primary peer-data-[state=checked]:bg-brand-primary-soft/20"
                            )}
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-brand-surface">
                                <FcAddressBook className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="font-semibold text-brand-dark">
                                    {address.fullName}
                                  </span>
                                  {address.isDefault && (
                                    <Badge className="bg-brand-primary-soft text-brand-primary border-0 text-xs">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-0.5 text-sm text-brand-muted">
                                  <p>{address.addressLine1}</p>
                                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                                  <p>
                                    {address.city}, {address.state} {address.postalCode}
                                  </p>
                                  <p>{address.country}</p>
                                  <p className="mt-1">📞 {address.phone}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-brand-muted hover:text-brand-primary"
                                asChild
                              >
                                <Link to={`/account`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              {!address.isDefault && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-brand-error hover:text-brand-error hover:bg-brand-error/10"
                                  onClick={() => handleDeleteAddress(address._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information Card */}
            <div className="bg-white rounded-xl border border-brand-primary-soft shadow-sm overflow-hidden">
              <div className="p-6 border-b border-brand-primary-soft">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-primary-soft">
                    <User className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-dark">
                      Contact Information
                    </h2>
                    <p className="text-brand-muted text-sm">
                      We'll use this to contact you about your order
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-brand-primary-soft/20 border border-brand-primary-soft rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-brand-primary" />
                        <span className="text-brand-dark">{user?.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-brand-primary" />
                        <span className="text-brand-dark">{user?.email}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-brand-primary" />
                          <span className="text-brand-dark">{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-brand-primary hover:text-brand-primary-hover hover:bg-brand-primary-soft"
                    >
                      <Link to="/account">
                        <Edit className="mr-2 h-3 w-3" />
                        Update
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes Card */}
            <div className="bg-white rounded-xl border border-brand-primary-soft shadow-sm overflow-hidden">
              <div className="p-6 border-b border-brand-primary-soft">
                <h3 className="text-lg font-semibold text-brand-dark">
                  Order Notes
                </h3>
                <p className="text-brand-muted text-sm">
                  Any special instructions for your order
                </p>
              </div>
              <div className="p-6">
                <Textarea
                  placeholder="Any special instructions for delivery, packaging preferences, or delivery timing..."
                  className="min-h-[100px] resize-none border-brand-primary-soft focus:border-brand-primary focus:ring-brand-primary-soft"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
                <p className="text-xs text-brand-muted mt-2">
                  We'll do our best to accommodate your requests
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-xl border border-brand-primary-soft shadow-sm overflow-hidden">
                <div className="p-6 border-b border-brand-primary-soft bg-brand-surface">
                  <h3 className="text-xl font-bold text-brand-dark">
                    Order Summary
                  </h3>
                </div>

                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-brand-surface overflow-hidden shrink-0 border border-brand-primary-soft">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.nameSnapshot}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-brand-muted" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-brand-dark truncate text-sm">
                            {item.nameSnapshot}
                          </div>
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-brand-muted">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-semibold text-brand-primary">
                              {formatCurrency(item.priceSnapshot * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-center text-brand-muted text-sm py-2">
                        + {items.length - 3} more item
                        {items.length - 3 !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  <Separator className="my-4 bg-brand-primary-soft" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-muted">Subtotal</span>
                      <span className="font-medium text-brand-dark">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-muted">
                        {deliveryMethod === DeliveryMethod.DELIVERY ? "Shipping" : "Pickup"}
                      </span>
                      <span className="font-medium text-brand-dark">
                        {shippingFee > 0 ? formatCurrency(shippingFee) : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-muted">Tax ({TAX_PERCENT*100}%)</span>
                      <span className="font-medium text-brand-dark">
                        {formatCurrency(tax)}
                      </span>
                    </div>
                    
                    <Separator className="my-3 bg-brand-primary-soft" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-brand-dark">Total</span>
                      <span className="text-brand-primary">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-brand-primary text-white hover:bg-brand-primary-hover mt-6 shadow-md hover:shadow-lg transition-all duration-300"
                    size="lg"
                    disabled={
                      isProcessing ||
                      isCreatingOrder ||
                      isInitializingPayment ||
                      (deliveryMethod === DeliveryMethod.DELIVERY && !selectedAddressId)
                    }
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Place Order Securely
                      </>
                    )}
                  </Button>

                  {deliveryMethod === DeliveryMethod.DELIVERY && !selectedAddressId && (
                    <p className="mt-3 text-sm text-brand-error text-center">
                      Please select a shipping address
                    </p>
                  )}

                  <p className="text-xs text-brand-muted text-center mt-4">
                    By placing your order, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="text-brand-primary hover:underline"
                    >
                      Terms of Service
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security & Trust Card */}
              <div className="bg-white rounded-xl border border-brand-primary-soft shadow-sm p-6">
                <h4 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-success" />
                  Secure & Trusted Checkout
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-brand-muted">
                    <CheckCircle className="h-4 w-4 text-brand-success" />
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-muted">
                    <CheckCircle className="h-4 w-4 text-brand-success" />
                    <span>PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-muted">
                    <CheckCircle className="h-4 w-4 text-brand-success" />
                    <span>Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-muted">
                    <CheckCircle className="h-4 w-4 text-brand-success" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-brand-primary-soft/20 border border-brand-primary-soft rounded-xl p-6">
                <h4 className="font-semibold text-brand-dark mb-3">Need Help?</h4>
                <p className="text-sm text-brand-muted mb-4">
                  Our customer support team is here to assist you.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-brand-dark">
                    📞 <strong>Call:</strong> +234 800 123 4567
                  </p>
                  <p className="text-brand-dark">
                    ✉️ <strong>Email:</strong> support@example.com
                  </p>
                  <p className="text-brand-dark">
                    🕒 <strong>Hours:</strong> Mon-Sun, 8AM-8PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}