import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — LUXE Store',
  description: 'Learn about LUXE Store\'s mission to make premium products accessible to everyone. Founded in 2020, serving 100,000+ customers across 50+ countries.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/about' },
  openGraph: {
    title: 'About Us — LUXE Store',
    description: 'Premium products accessible to everyone. 50+ countries. 100K+ happy customers.',
    url: 'https://luxe-store-58ny.vercel.app/about',
    siteName: 'LUXE Store',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}