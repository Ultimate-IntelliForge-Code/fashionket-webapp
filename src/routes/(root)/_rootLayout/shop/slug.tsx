import { useSeoMeta } from "@/api/hooks";
import { seoQuery } from "@/api/queries";
import { Breadcrumbs, RelatedLinks } from "@/components/seo/seo-client";
import { Pagination } from "@/components/ui/pagination";
import { ProductGrid } from "@/components/ui/product-card";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">
        We couldn't find products matching that selection.
      </p>
      <a href="/shop" className="text-blue-600 underline hover:text-blue-800">
        Browse all products →
      </a>
    </div>
  ),

  component: SeoShopPage,
});

function SeoShopPage() {
  const data = Route.useLoaderData();
  const { slug } = Route.useParams();
  // const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  useSeoMeta(data.metadata);

  // Build the paginationMeta shape the Pagination component expects
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
  }

  return (
    <main
      className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16"
      data-slug={slug}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs items={data.breadcrumbs} />

      {/* Page header */}
      <header className="my-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {data.metadata.h1}
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          {data.metadata.intro}
        </p>
        <p className="mt-2 text-sm text-gray-400" aria-live="polite">
          {data.products.length.toLocaleString()} products found
        </p>
      </header>

      {/* Product grid */}
      <section aria-label="Product results">
        <ProductGrid products={data.products} />
      </section>

      {/* Pagination */}
      <Pagination
        meta={paginationMeta}
        onPageChange={handlePageChange}
        showInfo
        className="bg-white rounded-lg border border-gray-200 p-4"
      />

      {/* Related internal links */}
      <RelatedLinks
        links={data.relatedLinks}
        heading="Explore Related Styles"
      />

      {/* SEO content footer */}
      <SeoContentFooter parsed={data.parsed} h1={data.metadata.h1} />
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
    <footer className="mt-16 pt-10 border-t border-gray-100">
      <div className="max-w-3xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          About Our {h1} Collection
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          FashionKet brings you a carefully curated selection of{" "}
          {h1.toLowerCase()}, sourced from trusted brands and independent
          designers.{" "}
          {gender &&
            `Our ${gender.toLowerCase()}'s range is tailored to fit modern lifestyles. `}
          {material &&
            `Each piece is crafted using quality ${material.toLowerCase()} materials for lasting durability. `}
          Whether you're shopping for everyday wear or a special occasion, our{" "}
          {category.toLowerCase()} collection has the perfect option for every
          style and budget.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Shop with confidence at FashionKet — free returns on all orders, fast
          UK delivery, and a dedicated customer service team ready to help.
          Explore our full range and discover why thousands of fashion lovers
          choose FashionKet every day.
        </p>
      </div>
    </footer>
  );
}
