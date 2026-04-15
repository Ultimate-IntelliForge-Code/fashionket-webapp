import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks';
import { toast } from 'react-toastify';
import {
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Power,
  Shield,
  Upload,
} from 'lucide-react';
import { SettingsFormData, settingsSchema } from '@/lib';

export const Route = createFileRoute('/vendor/_vendorLayout/settings/')({
  component: VendorSettings,
});


function VendorSettings() {
  const { vendor } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const defaultValues = useMemo(
    () => ({
      businessName: vendor?.businessName || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      description: vendor?.description || '',
      location: vendor?.location || {
        street: '',
        city: '',
        state: '',
        country: 'Nigeria',
      },
    }),
    [vendor]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema as any),
    defaultValues,
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsSaving(true);
      // In real app, call API here
      console.log('Settings update:', data);
      toast.success('Settings updated successfully');
      reset(data);
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    toast.info('Account deactivation request queued. Support will contact you shortly.');
  };

  const vendorInitials =
    vendor?.businessName
      ?.split(' ')
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VK';

  return (
    <div className="space-y-6 max-w-5xl">
      <Card className="border-mmp-primary/20 shadow-sm">
  <CardHeader className="bg-linear-to-r from-mmp-primary/5 to-transparent">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" className="size-16 ring-2 ring-mmp-primary/20">
                <AvatarImage src={vendor?.logoUrl || ''} alt={vendor?.businessName || 'Vendor'} />
                <AvatarFallback className="bg-mmp-primary/10 text-mmp-primary font-semibold text-lg">
                  {vendorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{vendor?.businessName || 'Vendor Profile'}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Manage how your business appears to customers.
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={vendor?.verified ? 'default' : 'secondary'} className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {vendor?.verified ? 'Verified Vendor' : 'Verification Pending'}
              </Badge>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Vendor Profile</DialogTitle>
                    <DialogDescription>
                      Update business information shown to customers in your storefront.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input id="businessName" {...register('businessName')} />
                      {errors.businessName && (
                        <p className="text-sm text-red-600">{errors.businessName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        {...register('description')}
                        rows={4}
                        placeholder="Tell customers about your business"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" {...register('email')} />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" type="tel" {...register('phone')} />
                        {errors.phone && (
                          <p className="text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input id="street" {...register('location.street')} />
                      {errors.location?.street && (
                        <p className="text-sm text-red-600">{errors.location.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" {...register('location.city')} />
                        {errors.location?.city && (
                          <p className="text-sm text-red-600">{errors.location.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" {...register('location.state')} />
                        {errors.location?.state && (
                          <p className="text-sm text-red-600">{errors.location.state.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input id="country" {...register('location.country')} />
                        {errors.location?.country && (
                          <p className="text-sm text-red-600">{errors.location.country.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <Label>Business Logo</Label>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG/JPG up to 5MB. Recommended square image.
                        </p>
                      </div>
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset(defaultValues);
                          setIsEditOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!isDirty || isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Power className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate vendor account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your products will be hidden from customers until reactivation.
                      You can contact support to restore access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDeactivate}>
                      Deactivate Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-mmp-primary" />
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{vendor?.email || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-mmp-primary" />
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{vendor?.phone || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-mmp-primary" />
              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {vendor?.location?.street || 'Not set'}
                </p>
                <p className="text-gray-700">
                  {[vendor?.location?.city, vendor?.location?.state, vendor?.location?.country]
                    .filter(Boolean)
                    .join(', ') || 'Not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-gray-700">
            {vendor?.description ||
              'Add a clear business description so customers understand your brand, quality, and value.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}