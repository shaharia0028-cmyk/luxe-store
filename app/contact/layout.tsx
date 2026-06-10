import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — LUXE Store',
  description: 'Get in touch with LUXE Store. Available 24/7 to help with orders, returns, and product questions. Email: support@luxestore.com',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/contact' },
  openGraph: {
    title: 'Contact Us — LUXE Store',
    description: 'Available 24/7 for orders, returns, and product questions.',
    url: 'https://luxe-store-58ny.vercel.app/contact',
    siteName: 'LUXE Store',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
