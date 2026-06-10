'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { items, loading, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h1>
          <Button onClick={() => router.push('/auth')} className="bg-orange hover:bg-orange-600">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square skeleton rounded-2xl" />
              <div className="h-4 skeleton rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Wishlist</h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {items.map((item, index) => (
                <div key={item.id} className="relative">
                  <ProductCard product={item.product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you like by clicking the heart icon.
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
