import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — LUXE Store',
  description: 'Sign in to your LUXE Store account to track orders, manage your wishlist, and access exclusive member deals.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/auth' },
  openGraph: {
    title: 'Sign In — LUXE Store',
    description: 'Sign in to track orders, manage wishlist, and access exclusive deals.',
    url: 'https://luxe-store-58ny.vercel.app/auth',
    siteName: 'LUXE Store',
    type: 'website',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
