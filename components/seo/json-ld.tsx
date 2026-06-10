interface ProductJsonLdProps {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  image?: string;
  ratingValue?: number;
  reviewCount?: number;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock';
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  price,
  currency = 'USD',
  image,
  ratingValue,
  reviewCount,
  sku,
  brand,
  availability = 'InStock',
  url,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
    },
    aggregateRating:
      ratingValue && reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: ratingValue.toFixed(1),
            reviewCount,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd({ name, url }: { name: string; url: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name,
          url,
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${url}/shop?search={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  );
}
