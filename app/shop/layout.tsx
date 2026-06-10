import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Products — LUXE Store',
  description: 'Browse our full collection of premium electronics, fashion, home & living products. Filter by category, price, and rating. Free shipping over $99.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/shop' },
  openGraph: {
    title: 'Shop All Products — LUXE Store',
    description: 'Browse premium electronics, fashion, home & living. Free shipping over $99.',
    url: 'https://luxe-store-58ny.vercel.app/shop',
    siteName: 'LUXE Store',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products — LUXE Store',
    description: 'Browse premium electronics, fashion, home & living.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
