import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { vendorBySlugQuery, vendorProductsBySlugQuery } from "@/api/queries";
import { VendorHero } from "@/components/vendor/vendor-hero";
import { VendorInfo } from "@/components/vendor/vendor-info";
import { ProductGrid } from "@/components/ui/product-card";
import { Pagination } from "@/components/ui/pagination";

export const Route = createFileRoute("/(root)/_rootLayout/vendors/$slug")({
  component: VendorDetailPage,
  validateSearch: z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
    })
    .transform((s) => ({
      page: s.page ?? 1,
      limit: s.limit ?? 12,
    })),
  params: {
    parse: (params) =>
      z
        .object({
          slug: z.string().min(1),
        })
        .parse(params),
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
  }),
  loader: async ({ context, deps, params }) => {
    const vendor = await context.queryClient.ensureQueryData(
      vendorBySlugQuery(params.slug),
    );

    const productsData = await context.queryClient.ensureQueryData(
      vendorProductsBySlugQuery(params.slug, deps.page, deps.limit),
    );

    return { vendor, products: productsData };
  },
});

function VendorDetailPage() {
  const { vendor, products } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { page: newPage, limit: 12 },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Vendor Hero Section */}
      <VendorHero vendor={vendor} />

      {/* Vendor Info Section */}
      <div className="container mx-auto px-4 py-8">
        <VendorInfo vendor={vendor} />

        {/* Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Products from {vendor.businessName}
          </h2>

          {products.data && products.data.length > 0 ? (
            <>
              <ProductGrid products={products.data} />

              {/* Pagination */}
              {products.pagination && products.pagination.pages > 1 && (
                <Pagination
                  meta={products.pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products available from this vendor yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
