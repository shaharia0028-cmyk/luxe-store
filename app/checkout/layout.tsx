import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout — LUXE Store',
  description: 'Complete your purchase securely at LUXE Store. Multiple payment options including SSLCommerz. Fast delivery guaranteed.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/checkout' },
  openGraph: {
    title: 'Checkout — LUXE Store',
    description: 'Complete your purchase securely. Multiple payment options available.',
    url: 'https://luxe-store-58ny.vercel.app/checkout',
    siteName: 'LUXE Store',
    type: 'website',
  },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
