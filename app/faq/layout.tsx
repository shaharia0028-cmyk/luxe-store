import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — LUXE Store',
  description: 'Frequently asked questions about LUXE Store. Find answers about shipping, returns, payments, and more.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/faq' },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
