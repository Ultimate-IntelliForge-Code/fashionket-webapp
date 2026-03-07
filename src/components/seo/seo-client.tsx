import { Breadcrumb, InternalLink } from '@/api/queries/seo.query';
import { Link } from '@tanstack/react-router';
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