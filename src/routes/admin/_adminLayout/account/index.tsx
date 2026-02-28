
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Shield,
  Edit2,
  Check,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IAdmin, IUpdateAdminPayload } from '@/types';
import { toast } from 'react-toastify';
import { adminProfile } from '@/api/queries';
import { useUpdateAdminProfile } from '@/api/queries';
import { adminUpdateSchema } from '@/lib';

export const Route = createFileRoute('/admin/_adminLayout/account/')({
  component: AdminAccountPage,
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
      return context.queryClient.ensureQueryData(adminProfile())
    },
});


function AdminAccountPage() {
  const profile  = Route.useLoaderData()
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateAdminProfile();

  const form = useForm<IUpdateAdminPayload>({
    resolver: zodResolver(adminUpdateSchema as any),
    defaultValues: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
      permissions: profile?.permissions || {
        manageProducts: true,
        manageOrders: true,
        managePayments: true,
      },
    },
  });

  const onSubmit = async (data: IUpdateAdminPayload) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Admin profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Email already in use');
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  const admin = profile as IAdmin;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your admin account and permissions
            </p>
          </div>
          <Badge variant="default" className="h-fit">
            <Shield className="w-3 h-3 mr-1" />
            {admin.role.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Admin Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
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
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Admin Name"
                        {...form.register('fullName')}
                      />
                    </div>

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
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{admin.fullName}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{admin.email}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{admin.phone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Role</p>
                  <Badge variant="outline">
                    <Shield className="w-3 h-3 mr-1" />
                    {admin.role.replace('_', ' ')}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(admin.createdAt || new Date()).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
              <CardDescription>
                Manage what actions you can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="manageProducts" className="text-base">
                    Manage Products
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Create, edit, and delete products
                  </p>
                </div>
                <Switch
                  id="manageProducts"
                  checked={admin.permissions.manageProducts}
                  disabled
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="manageOrders" className="text-base">
                    Manage Orders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    View and process customer orders
                  </p>
                </div>
                <Switch
                  id="manageOrders"
                  checked={admin.permissions.manageOrders}
                  disabled
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="managePayments" className="text-base">
                    Manage Payments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Handle payment transactions and refunds
                  </p>
                </div>
                <Switch
                  id="managePayments"
                  checked={admin.permissions.managePayments}
                  disabled
                />
              </div>
              
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Permission changes require super admin approval
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                View your recent actions and logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No recent activity to display
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}