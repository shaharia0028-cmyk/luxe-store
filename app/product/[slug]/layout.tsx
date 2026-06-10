import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, images, category:categories(name)')
    .eq('slug', params.slug)
    .single();

  if (!product) {
    return { title: 'Product Not Found | LUXE Store' };
  }

  const categoryName = Array.isArray(product.category)
    ? product.category[0]?.name
    : (product.category as { name: string } | null)?.name;

  return {
    title: `${product.name} | LUXE Store`,
    description: product.short_description ?? `Buy ${product.name} at LUXE Store`,
    keywords: [product.name, categoryName ?? '', 'LUXE Store', 'premium shopping'],
    openGraph: {
      title: `${product.name} | LUXE Store`,
      description: product.short_description ?? '',
      images: product.images?.[0] ? [{ url: product.images[0], width: 800, height: 600 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | LUXE Store`,
      description: product.short_description ?? '',
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
