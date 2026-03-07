import { IPaginationMeta, IProductListItem } from "@/types";
import { apiClient } from "../client";

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.fashionket.com';

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
  products: IProductListItem[];
  pagination: IPaginationMeta;
  relatedLinks: InternalLink[];
  breadcrumbs: Breadcrumb[];
  _redirect?: string;
}


export async function seoQuery(
  slug: string,
  page = 1,
  limit = 24,
): Promise<SeoPageData> {
  const response = await apiClient.get<SeoPageData>(`/seo/shop/${encodeURIComponent(slug)}?page=${page}&limit=${limit}`)

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function fetchRelatedLinksQuery(
  slug: string,
): Promise<{ relatedLinks: InternalLink[]; breadcrumbs: Breadcrumb[] }> {

   const response = await apiClient.get<SeoPageData>(`/seo/shop/${encodeURIComponent(slug)}/related`)

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}