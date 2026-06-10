import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'LUXE Store — Premium Shopping | Electronics, Fashion & Home',
    template: '%s | LUXE Store',
  },
  description: 'Shop curated premium products at LUXE Store. Electronics, fashion, home décor & more. Free shipping on orders over $99. Secure checkout.',
  keywords: ['luxury store', 'premium products', 'electronics', 'fashion', 'home decor'],
  openGraph: {
    title: 'LUXE Store — Premium Shopping',
    description: 'Curated premium products. Free shipping over $99.',
    url: 'https://luxe-store-58ny.vercel.app',
    siteName: 'LUXE Store',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXE Store — Premium Shopping',
    description: 'Curated premium products. Free shipping over $99.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
