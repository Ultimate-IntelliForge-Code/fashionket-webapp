/**
 * SEO Page Components
 * Reusable UI blocks for programmatic SEO landing pages.
 */

import React from 'react';
import { Link } from '@tanstack/react-router';
import type { ProductSummary, InternalLink, Breadcrumb } from '../../lib/seo-api';

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, i) => (
          <li
            key={item.href}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {i < items.length - 1 ? (
              <Link to={item.href} itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span itemProp="name" aria-current="page">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(i + 1)} />
            {i < items.length - 1 && <span aria-hidden="true"> › </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] ?? '/placeholder-product.jpg';
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <article className="product-card" itemScope itemType="https://schema.org/Product">
      <Link to={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            width={300}
            height={400}
            itemProp="image"
            className="product-card__image"
          />
        </div>
        <div className="product-card__body">
          <p className="product-card__brand" itemProp="brand">
            {product.brand}
          </p>
          <h3 className="product-card__name" itemProp="name">
            {product.name}
          </h3>
          <div
            className="product-card__rating"
            aria-label={`Rating: ${product.rating} out of 5`}
          >
            <span aria-hidden="true">{stars}</span>
            <span className="product-card__rating-value">({product.rating.toFixed(1)})</span>
          </div>
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="product-card__price-wrapper"
          >
            <meta itemProp="priceCurrency" content="GBP" />
            <span className="product-card__price" itemProp="price">
              £{product.price.toFixed(2)}
            </span>
            <meta itemProp="availability" content="https://schema.org/InStock" />
          </div>
        </div>
      </Link>
    </article>
  );
}

// ─── Product Grid ─────────────────────────────────────────────────────────────

interface ProductGridProps {
  products: ProductSummary[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="product-grid product-grid--loading" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="product-card product-card--skeleton" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <p>No products found for this selection. Try a related category below.</p>
      </div>
    );
  }

  return (
    <div
      className="product-grid"
      role="list"
      aria-label="Product results"
    >
      {products.map((product) => (
        <div key={product._id} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  slug: string;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, slug, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Page navigation">
      {page > 1 && (
        <Link
          to={`/shop/${slug}`}
          search={{ page: page - 1 }}
          className="pagination__btn"
          rel="prev"
          onClick={() => onPageChange(page - 1)}
        >
          ← Previous
        </Link>
      )}
      <span className="pagination__info">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link
          to={`/shop/${slug}`}
          search={{ page: page + 1 }}
          className="pagination__btn"
          rel="next"
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

// ─── Related Links ────────────────────────────────────────────────────────────

interface RelatedLinksProps {
  links: InternalLink[];
  heading?: string;
}

export function RelatedLinks({ links, heading = 'Related Categories' }: RelatedLinksProps) {
  if (!links.length) return null;

  return (
    <section className="related-links" aria-label={heading}>
      <h2 className="related-links__heading">{heading}</h2>
      <ul className="related-links__list">
        {links.map((link) => (
          <li key={link.href} className="related-links__item">
            <Link to={link.href} className="related-links__link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}