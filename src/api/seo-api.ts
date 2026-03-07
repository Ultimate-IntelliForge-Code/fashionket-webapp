/**
 * SEO API Client
 * Typed wrappers around the NestJS SEO endpoints.
 * Use with TanStack Router loaders or TanStack Query.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.fashionket.com';

// ─── Types (mirror backend response) ────────────────────────────────────────

export interface ProductSummary {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  rating: number;
  images: string[];
  tags: string[];
  categorySlug: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  intro: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: string;
    siteName: string;
    image: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: object;
}

export interface InternalLink {
  label: string;
  href: string;
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface SeoPageData {
  slug: string;
  canonicalSlug: string;
  parsed: {
    gender?: string;
    material?: string;
    color?: string;
    category?: string;
    tag?: string;
    brand?: string;
    rawTokens: string[];
  };
  metadata: SeoMetadata;
  products: ProductSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  relatedLinks: InternalLink[];
  breadcrumbs: Breadcrumb[];
  _redirect?: string;
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function fetchSeoPage(
  slug: string,
  page = 1,
  limit = 24,
): Promise<SeoPageData> {
  const url = `${API_BASE}/seo/shop/${encodeURIComponent(slug)}?page=${page}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    // Cache at the HTTP layer for 10 minutes (CDN-friendly)
    next: { revalidate: 600 },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`SEO API error ${res.status} for slug: ${slug}`);
  }
  return res.json() as Promise<SeoPageData>;
}

export async function fetchRelatedLinks(
  slug: string,
): Promise<{ relatedLinks: InternalLink[]; breadcrumbs: Breadcrumb[] }> {
  const url = `${API_BASE}/seo/shop/${encodeURIComponent(slug)}/related`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Related links error ${res.status}`);
  return res.json();
}