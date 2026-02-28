import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  AlertCircle,
  TrendingUp,
  Package,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IVendor, IUpdateVendorPayload, AccountStatus } from '@/types';
import { toast } from 'react-toastify';
import { vendorProfile } from '@/api/queries';
import { useUpdateVendorProfile } from '@/api/queries';
import { vendorUpdateSchema } from '@/lib';

export const Route = createFileRoute('/vendor/_vendorLayout/account/')({
  component: VendorAccountPage,
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
        return context.queryClient.ensureQueryData(vendorProfile())
      },
});


function VendorAccountPage() {
  const profile = Route.useLoaderData()
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateVendorProfile();

  const form = useForm<IUpdateVendorPayload>({
    resolver: zodResolver(vendorUpdateSchema as any),
    defaultValues: {
      fullName: profile?.fullName || '',
      businessName: profile?.businessName || '',
      description: profile?.description || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
      logoUrl: profile?.logoUrl || '',
      location: {
        street: profile?.location?.street || '',
        city: profile?.location?.city || '',
        state: profile?.location?.state || '',
        country: profile?.location?.country || '',
      },
    },
  });

  const onSubmit = async (data: IUpdateVendorPayload) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Business profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Business name or email already in use');
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  const vendor = profile as IVendor;

  const getStatusVariant = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'default';
      case AccountStatus.UNDER_REVIEW:
        return 'secondary';
      case AccountStatus.SUSPENDED:
        return 'destructive';
      case AccountStatus.REJECTED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your business profile and settings
            </p>
          </div>
          <Badge variant={getStatusVariant(vendor.accountStatus)} className="h-fit">
            {vendor.accountStatus.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Account Status Alert */}
      {vendor.accountStatus === AccountStatus.UNDER_REVIEW && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your vendor account is under review. You'll be notified once approved.
          </AlertDescription>
        </Alert>
      )}

      {vendor.accountStatus === AccountStatus.SUSPENDED && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your account has been suspended. Please contact support for assistance.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="business" className="gap-2">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Profile Tab */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Business Information */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Update your business details and contact information
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="My Store"
                          {...form.register('businessName')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Contact Name</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          {...form.register('fullName')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell customers about your business..."
                        rows={4}
                        {...form.register('description')}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register('email')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          {...form.register('phone')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        placeholder="https://example.com/logo.png"
                        {...form.register('logoUrl')}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Business Location</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            {...form.register('location.street')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            {...form.register('location.city')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            {...form.register('location.state')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            {...form.register('location.country')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="flex-1"
                      >
                        {updateProfile.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
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
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Store className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Business Name</p>
                        <p className="font-medium">{vendor.businessName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Slug: {vendor.slug}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{vendor.description || 'Not set'}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{vendor.email}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{vendor.phone || 'Not set'}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">
                          {[
                            vendor.location?.street,
                            vendor.location?.city,
                            vendor.location?.state,
                            vendor.location?.country
                          ].filter(Boolean).join(', ') || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Verification</p>
                    <Badge variant={vendor.verified ? 'default' : 'secondary'}>
                      {vendor.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-medium">
                        {vendor.ratingAverage.toFixed(1)} ({vendor.ratingCount} reviews)
                      </p>
                    </div>
                  </div>
                  <Separator />
                  {vendor.logoUrl && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Business Logo</p>
                        <img 
                          src={vendor.logoUrl} 
                          alt={vendor.businessName}
                          className="w-20 h-20 rounded-lg object-cover border"
                        />
                      </div>
                      <Separator />
                    </>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(vendor.createdAt || new Date()).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Business Analytics</CardTitle>
              <CardDescription>Track your business performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Analytics dashboard coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>My Products</CardTitle>
              <CardDescription>Manage your product listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No products listed yet
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Track your sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Earnings data will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}