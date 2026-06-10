import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart — LUXE Store',
  description: 'Review your selected items and proceed to secure checkout. Free shipping on orders over $99.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/cart' },
  openGraph: {
    title: 'Your Cart — LUXE Store',
    description: 'Review your items and proceed to secure checkout.',
    url: 'https://luxe-store-58ny.vercel.app/cart',
    siteName: 'LUXE Store',
    type: 'website',
  },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
