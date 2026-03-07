/**
 * SEO Shop Page Route
 * File: src/routes/shop/$slug.tsx
 *
 * TanStack Router file-based route for /shop/:slug
 * Handles:
 *  - Data loading via route loader (SSR-compatible)
 *  - Metadata injection
 *  - Canonical URL enforcement
 *  - Full SEO page rendering
 */

import React, { useState } from 'react';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { fetchSeoPage } from '../../lib/seo-api';
import { useSeoMeta } from '../../components/seo/useSeoMeta';
import {
  Breadcrumbs,
  ProductGrid,
  Pagination,
  RelatedLinks,
} from '../../components/seo/SeoPageComponents';

// ─── Search params schema ────────────────────────────────────────────────────

const searchSchema = z.object({
  page: z.number().int().positive().optional().default(1),
});

// ─── Route definition ────────────────────────────────────────────────────────

export const Route = createFileRoute('/(root)/_rootLayout/shop/slug')({
  validateSearch: searchSchema,

  // Loader runs on navigation — fetches SEO page data before render
  loader: async ({ params, search }) => {
    const data = await fetchSeoPage(params.slug, search.page ?? 1, 24);

    // Enforce canonical slug — redirect if slug is non-canonical
    if (data._redirect) {
      throw redirect({ to: data._redirect, replace: true });
    }

    return data;
  },

  // Error boundary
  errorComponent: ({ error }) => (
    <div className="seo-page__error">
      <h1>Page Not Found</h1>
      <p>We couldn't find products matching that selection.</p>
      <a href="/shop">Browse all products →</a>
    </div>
  ),

  component: SeoShopPage,
});

// ─── Page Component ──────────────────────────────────────────────────────────

function SeoShopPage() {
  const data = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { page } = Route.useSearch();
  const navigate = useNavigate();

  // Inject all metadata into <head>
  useSeoMeta(data.metadata);

  const handlePageChange = (newPage: number) => {
    navigate({ to: `/shop/${slug}`, search: { page: newPage } });
  };

  return (
    <main className="seo-page" data-slug={slug}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={data.breadcrumbs} />

      {/* Page header */}
      <header className="seo-page__header">
        <h1 className="seo-page__h1">{data.metadata.h1}</h1>
        <p className="seo-page__intro">{data.metadata.intro}</p>

        {/* Result count */}
        <p className="seo-page__count" aria-live="polite">
          {data.pagination.total.toLocaleString()} products found
        </p>
      </header>

      {/* Product grid */}
      <section className="seo-page__products" aria-label="Product results">
        <ProductGrid products={data.products} />
      </section>

      {/* Pagination */}
      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        slug={slug}
        onPageChange={handlePageChange}
      />

      {/* Related internal links — critical for SEO crawl graph */}
      <RelatedLinks links={data.relatedLinks} heading="Explore Related Styles" />

      {/* SEO content footer — keyword-rich text for crawlers */}
      <SeoContentFooter parsed={data.parsed} h1={data.metadata.h1} />
    </main>
  );
}

// ─── SEO Content Footer ───────────────────────────────────────────────────────
// Provides additional keyword-rich text below the fold for search engines.

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
  const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
  const category = cap(parsed.category) || 'Products';
  const gender = cap(parsed.gender);
  const material = cap(parsed.material);

  return (
    <footer className="seo-page__content-footer">
      <div className="seo-page__content-footer-inner">
        <h2>About Our {h1} Collection</h2>
        <p>
          FashionKet brings you a carefully curated selection of {h1.toLowerCase()}, sourced from
          trusted brands and independent designers.{' '}
          {gender && `Our ${gender.toLowerCase()}'s range is tailored to fit modern lifestyles. `}
          {material &&
            `Each piece is crafted using quality ${material.toLowerCase()} materials for lasting durability. `}
          Whether you're shopping for everyday wear or a special occasion, our {category.toLowerCase()}{' '}
          collection has the perfect option for every style and budget.
        </p>
        <p>
          Shop with confidence at FashionKet — free returns on all orders, fast UK delivery, and a
          dedicated customer service team ready to help. Explore our full range and discover why
          thousands of fashion lovers choose FashionKet every day.
        </p>
      </div>
    </footer>
  );
}