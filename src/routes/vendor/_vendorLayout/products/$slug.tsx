import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productBySlugQuery, categoriesQuery } from '@/api/queries';
import { useDeleteProduct, useUpdateProduct } from '@/api/mutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Pencil,
  Power,
  PowerOff,
  Tag,
  Layers,
  Package,
  Eye,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ProductForm } from '@/components/forms/product-form';

export const Route = createFileRoute('/vendor/_vendorLayout/products/$slug')({
  loader: async ({ context, params }) => {
    const queryClient = context.queryClient;
    const [product, categories] = await Promise.all([
      queryClient.ensureQueryData(productBySlugQuery(params.slug)),
      queryClient.ensureQueryData(categoriesQuery()),
    ]);
    return { product, categories };
  },
  component: VendorProductDetail,
  pendingComponent: LoadingState,
  errorComponent: ErrorState,
});

function VendorProductDetail() {
  const { slug } = Route.useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: product } = useQuery(productBySlugQuery(slug));
  const { data: categories } = useQuery(categoriesQuery());
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  if (!product || !categories) return null;

  const priceInNaira = product.price / 100;
  const discountedPriceInNaira =
    product.discount > 0
      ? priceInNaira * (1 - product.discount / 100)
      : priceInNaira;

  const categoryName =
    typeof product.categoryId === 'object' && product.categoryId
      ? (product.categoryId as any).name
      : categories.find((c) => c._id?.toString() === product.categoryId?.toString())
          ?.name;

  const isBusy = isUpdating || isDeleting;

  const handleSubmit = async (data: FormData) => {
    try {
      await updateProduct({
        id: product._id.toString(),
        data,
      });
      toast.success('Product updated successfully');
      setIsEditMode(false);
      queryClient.invalidateQueries({ queryKey: ['products', 'slug', slug] });
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleToggleActive = async () => {
    try {
      await updateProduct({
        id: product._id.toString(),
        data: { isActive: !product.isActive },
      });
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['products', 'slug', slug] });
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product status');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this product permanently? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product._id.toString());
      toast.success('Product deleted successfully');
      navigate({ to: '/vendor/products' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/vendor/products' })}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            View all products
          </Button>
          <Badge variant={product.isActive ? 'default' : 'secondary'} className="text-sm">
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={isEditMode ? 'secondary' : 'default'}
            onClick={() => setIsEditMode((prev) => !prev)}
            disabled={isBusy}
          >
            <Pencil className="h-4 w-4 mr-2" />
            {isEditMode ? 'Cancel Edit' : 'Edit Product'}
          </Button>

          <Button
            variant="outline"
            onClick={handleToggleActive}
            disabled={isBusy}
            className={product.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
          >
            {product.isActive ? (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isBusy}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Views</div>
            <div className="text-2xl font-bold text-mmp-primary2">{product.viewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Sold</div>
            <div className="text-2xl font-bold text-mmp-primary2">{product.soldCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Stock</div>
            <div className="text-2xl font-bold text-mmp-primary2">{product.stock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="text-2xl font-bold text-mmp-primary2">
              ₦{(priceInNaira * product.soldCount).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditMode ? (
        <ProductForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          isUpdate
        />
      ) : (
        <div className="space-y-6">
          <Card className="border-mmp-primary/20 shadow-sm">
            <CardHeader className="bg-linear-to-r from-mmp-primary/5 to-transparent">
              <CardTitle className="text-mmp-primary2">Product Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              {product.description ? (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              ) : (
                <p className="text-gray-500 italic">No product description yet.</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Price</div>
                  <div className="text-lg font-semibold">₦{priceInNaira.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Final Price</div>
                  <div className="text-lg font-semibold text-mmp-primary2">
                    ₦{discountedPriceInNaira.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Category</div>
                  <div className="text-base font-medium">{categoryName || 'Not set'}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Brand</div>
                  <div className="text-base font-medium">{product.brand || 'Not set'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.length ? (
                    product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No tags added.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers className="h-4 w-4" /> Variant Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { label: 'Sizes', value: product.variantOptions?.sizes },
                  { label: 'Colors', value: product.variantOptions?.colors },
                  { label: 'Materials', value: product.variantOptions?.materials },
                  { label: 'Genders', value: product.variantOptions?.genders },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-gray-500">{label}</p>
                    <p className="font-medium text-gray-800">
                      {value?.length ? value.join(', ') : 'Not set'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" /> Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.images?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <a
                      href={image}
                      key={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-xl border"
                    >
                      <img
                        src={image}
                        alt={`${product.name} image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {index === 0 && (
                        <Badge className="absolute left-2 top-2 bg-mmp-primary">Main</Badge>
                      )}
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1 text-white">
                        <Eye className="h-3 w-3" />
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No images available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}