import { useSeoMeta } from "@/api/hooks";
import { seoQuery } from "@/api/queries";
import { Breadcrumbs, RelatedLinks } from "@/components/seo/seo-client";
import { Pagination } from "@/components/ui/pagination";
import { ProductGrid } from "@/components/ui/product-card";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Sparkles, TrendingUp, Shield, Truck } from "lucide-react";

export const Route = createFileRoute("/(root)/_rootLayout/shop/slug")({
  validateSearch: z.object({
    page: z.number().int().positive().optional().default(1),
  }),
  params: {
    parse: (params) =>
      z
        .object({
          slug: z.string().min(1),
        })
        .parse(params),
  },
  loaderDeps: ({ search }) => ({
    page: search.page
  }),
  loader: async ({ params, deps }) => {
    const data = await seoQuery(params.slug, deps.page ?? 1, 24);

    if (data._redirect) {
      throw redirect({ to: data._redirect, replace: true });
    }

    return data;
  },

  errorComponent: () => (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-24 h-24 rounded-full bg-brand-primary-soft flex items-center justify-center mx-auto mb-6">
        <span className="text-5xl">🔍</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
        Page Not Found
      </h1>
      <p className="text-brand-muted mb-8 max-w-md mx-auto">
        We couldn't find products matching that selection. Let's get you back on track.
      </p>
      <a 
        href="/shop" 
        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover font-medium underline-offset-4 hover:underline transition-colors"
      >
        Browse all products
        <TrendingUp className="h-4 w-4" />
      </a>
    </div>
  ),

  component: SeoShopPage,
});

function SeoShopPage() {
  const data = Route.useLoaderData();
  const { slug } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });

  useSeoMeta(data.metadata);

  const paginationMeta = {
    page: data.pagination.page,
    totalPages: data.pagination.totalPages,
    total: data.pagination.total,
    limit: data.pagination.limit,
  };

  function handlePageChange(newPage: number) {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
      replace: true,
    });
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasProducts = data.products && data.products.length > 0;

  return (
    <main className="min-h-screen bg-brand-surface">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Breadcrumbs - Enhanced styling */}
        <div className="mb-6">
          <Breadcrumbs items={data.breadcrumbs} />
        </div>

        {/* Hero Section - Premium Header */}
        <div className="relative mb-8 lg:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-soft/30 to-transparent rounded-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-brand-primary-soft rounded-full px-3 py-1 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
              <span className="text-xs font-medium text-brand-primary">Curated Collection</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-4 leading-tight">
              {data.metadata.h1}
            </h1>
            
            <p className="text-base sm:text-lg text-brand-muted max-w-3xl leading-relaxed mb-4">
              {data.metadata.intro}
            </p>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-brand-primary-soft">
                <span className="text-xs font-medium text-brand-dark">
                  {data.products.length.toLocaleString()} products
                </span>
              </div>
              {data.pagination.totalPages > 1 && (
                <div className="inline-flex items-center gap-1 text-xs text-brand-muted">
                  <span>•</span>
                  <span>{data.pagination.totalPages} pages</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <section aria-label="Product results" className="mb-10 lg:mb-12">
          {hasProducts ? (
            <>
              <ProductGrid products={data.products} />
              
              {/* Results count indicator */}
              <div className="mt-6 text-center">
                <p className="text-sm text-brand-muted">
                  Showing {data.products.length} of {data.pagination.total} products
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-brand-primary-soft">
              <div className="w-20 h-20 rounded-full bg-brand-primary-soft flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">
                No products found
              </h3>
              <p className="text-brand-muted max-w-md mx-auto">
                We couldn't find any products in this collection. Check back soon for new arrivals!
              </p>
            </div>
          )}
        </section>

        {/* Pagination with improved styling */}
        {hasProducts && data.pagination.totalPages > 1 && (
          <div className="mb-12 lg:mb-16">
            <Pagination
              meta={paginationMeta}
              onPageChange={handlePageChange}
              showInfo
              className="bg-white rounded-xl border border-brand-primary-soft shadow-sm p-4"
            />
          </div>
        )}

        {/* Related Internal Links */}
        {data.relatedLinks && data.relatedLinks.length > 0 && (
          <div className="mb-12 lg:mb-16">
            <RelatedLinks
              links={data.relatedLinks}
              heading="Explore Related Styles"
            />
          </div>
        )}

        {/* SEO Content Footer - Enhanced Design */}
        <SeoContentFooter parsed={data.parsed} h1={data.metadata.h1} />

        {/* Trust Badges Section */}
        <div className="mt-12 pt-8 border-t border-brand-primary-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-soft mb-2">
                <Truck className="h-5 w-5 text-brand-primary" />
              </div>
              <p className="text-xs font-medium text-brand-dark">Free Shipping</p>
              <p className="text-xs text-brand-muted">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-soft mb-2">
                <Shield className="h-5 w-5 text-brand-primary" />
              </div>
              <p className="text-xs font-medium text-brand-dark">Secure Payment</p>
              <p className="text-xs text-brand-muted">100% protected</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-soft mb-2">
                <TrendingUp className="h-5 w-5 text-brand-primary" />
              </div>
              <p className="text-xs font-medium text-brand-dark">Easy Returns</p>
              <p className="text-xs text-brand-muted">30-day guarantee</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-soft mb-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
              </div>
              <p className="text-xs font-medium text-brand-dark">24/7 Support</p>
              <p className="text-xs text-brand-muted">Dedicated team</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

interface SeoContentFooterProps {
  parsed: {
    gender?: string;
    material?: string;
    color?: string;
    category?: string;
    tag?: string;
  };
  h1: string;
}

function SeoContentFooter({ parsed, h1 }: SeoContentFooterProps) {
  const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
  const category = cap(parsed.category) || "Products";
  const gender = cap(parsed.gender);
  const material = cap(parsed.material);

  return (
    <footer className="bg-white rounded-xl border border-brand-primary-soft overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="max-w-4xl">
          {/* Section Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-brand-primary-soft rounded-full px-3 py-1 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
              <span className="text-xs font-medium text-brand-primary">About This Collection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
              About Our {h1} Collection
            </h2>
            <div className="w-12 h-1 bg-brand-primary rounded-full mt-3" />
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="text-sm sm:text-base">
              <span className="font-semibold text-brand-dark">FashionKet</span> brings you a carefully curated 
              selection of <span className="font-medium text-brand-dark">{h1.toLowerCase()}</span>, sourced from 
              trusted brands and independent designers. 
              {gender && (
                <> Our <span className="font-medium text-brand-dark">{gender.toLowerCase()}'s</span> range is 
                tailored to fit modern lifestyles.</>
              )}
              {material && (
                <> Each piece is crafted using quality <span className="font-medium text-brand-dark">
                {material.toLowerCase()}</span> materials for lasting durability.</>
              )}
            </p>
            
            <p className="text-sm sm:text-base">
              Whether you're shopping for everyday wear or a special occasion, our{" "}
              <span className="font-medium text-brand-dark">{category.toLowerCase()}</span> collection has the 
              perfect option for every style and budget. We carefully vet each product to ensure it meets our 
              high standards for quality, design, and value.
            </p>

            <p className="text-sm sm:text-base">
              Shop with confidence at FashionKet — <span className="font-medium text-brand-success">
              free returns</span> on all orders, <span className="font-medium text-brand-primary">
              fast delivery</span>, and a dedicated customer service team ready to help. 
              Explore our full range and discover why thousands of fashion lovers choose FashionKet every day.
            </p>
          </div>

          {/* Key Features List */}
          <div className="mt-6 pt-6 border-t border-brand-primary-soft">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                <span className="text-xs text-brand-muted">Premium quality guaranteed</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                <span className="text-xs text-brand-muted">Ethically sourced materials</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                <span className="text-xs text-brand-muted">Sustainable packaging</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                <span className="text-xs text-brand-muted">Carbon-neutral shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}