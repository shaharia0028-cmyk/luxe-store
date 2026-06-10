import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Dashboard — LUXE Store',
  description: 'Manage your LUXE Store account, track orders, manage addresses, and view your wishlist.',
  alternates: { canonical: 'https://luxe-store-58ny.vercel.app/dashboard' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
