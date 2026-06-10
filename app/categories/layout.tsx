import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Categories — LUXE Store',
  description: 'Explore LUXE Store categories: Electronics, Fashion, Home & Living, Beauty, Sports and more. Find your perfect premium product.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/categories' },
  openGraph: {
    title: 'Product Categories — LUXE Store',
    description: 'Electronics, Fashion, Home & Living, Beauty, Sports and more.',
    url: 'https://luxe-store-58ny.vercel.app/categories',
    siteName: 'LUXE Store',
    type: 'website',
  },
}

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
