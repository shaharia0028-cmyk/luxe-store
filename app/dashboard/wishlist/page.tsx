'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

export default function DashboardWishlistPage() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-20">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square skeleton rounded-2xl" />
                <div className="h-4 skeleton rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/dashboard">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Wishlist</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {items.map((item, index) => (
                <ProductCard key={item.id} product={item.product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love by clicking the heart icon on products.
              </p>
              <Link href="/shop">
                <Button className="bg-orange hover:bg-orange-600">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
