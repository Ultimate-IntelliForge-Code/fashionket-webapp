import { useEffect } from "react";

interface OpenGraph {
  title: string;
  description: string;
  url: string;
  type: string;
  siteName: string;
  image: string;
}

interface Twitter {
  card: string;
  title: string;
  description: string;
  image: string;
}

export interface SeoMetaInput {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  intro: string;
  openGraph: OpenGraph;
  twitter: Twitter;
  jsonLd: object;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data: object) {
  const id = "seo-json-ld";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSeoMeta(metadata: SeoMetaInput | undefined) {
  useEffect(() => {
    if (!metadata) return;

    // Title
    document.title = metadata.title;

    // Standard
    upsertMeta("name", "description", metadata.description);
    upsertMeta("name", "robots", "index, follow");

    // Canonical
    upsertLink("canonical", metadata.canonical);

    // Open Graph
    upsertMeta("property", "og:title",       metadata.openGraph.title);
    upsertMeta("property", "og:description", metadata.openGraph.description);
    upsertMeta("property", "og:url",         metadata.openGraph.url);
    upsertMeta("property", "og:type",        metadata.openGraph.type);
    upsertMeta("property", "og:site_name",   metadata.openGraph.siteName);
    upsertMeta("property", "og:image",       metadata.openGraph.image);

    // Twitter
    upsertMeta("name", "twitter:card",        metadata.twitter.card);
    upsertMeta("name", "twitter:title",       metadata.twitter.title);
    upsertMeta("name", "twitter:description", metadata.twitter.description);
    upsertMeta("name", "twitter:image",       metadata.twitter.image);

    // JSON-LD
    upsertJsonLd(metadata.jsonLd);

    // Cleanup JSON-LD on unmount so stale data never persists across navigations
    return () => {
      document.getElementById("seo-json-ld")?.remove();
    };
  }, [metadata]);
}