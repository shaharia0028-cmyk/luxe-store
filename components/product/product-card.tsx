'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/auth');
      return;
    }
    await toggleWishlist(product.id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/auth');
      return;
    }
    const result = await addToCart(product.id);
    if (result.success) {
      // Toast notification could be added here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div
          className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-orange/50 transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className={cn(
                  'object-cover transition-all duration-500',
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                  isHovered ? 'scale-110' : 'scale-100'
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.is_new && (
                <span className="bg-orange text-white text-xs font-medium px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Hover Actions */}
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 z-20"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlist}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                  inWishlist ? 'bg-orange text-white' : 'bg-white text-foreground'
                )}
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="w-12 h-12 rounded-full bg-white text-foreground flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
              <Link
                href={`/product/${product.slug}?quick=true`}
                className="w-12 h-12 rounded-full bg-white text-foreground flex items-center justify-center"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            {product.category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {product.category.name}
              </p>
            )}

            {/* Name */}
            <h3 className="font-medium text-foreground group-hover:text-orange transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-4 h-4',
                      star <= Math.round(product.rating_average)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted fill-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating_count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.quantity > 0 ? (
              product.quantity < 10 && (
                <p className="text-xs text-orange mt-2">
                  Only {product.quantity} left in stock
                </p>
              )
            ) : (
              <p className="text-xs text-red-500 mt-2">Out of stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
