'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  query: 'featured' | 'new' | 'all';
  limit?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export function ProductsSection({
  title,
  subtitle,
  query,
  limit = 8,
  showViewAll = true,
  viewAllLink = '/shop',
}: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      let queryBuilder = supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('is_active', true)
        .limit(limit);

      if (query === 'featured') {
        queryBuilder = queryBuilder.eq('is_featured', true);
      } else if (query === 'new') {
        queryBuilder = queryBuilder.eq('is_new', true);
      }

      queryBuilder = queryBuilder.order('created_at', { ascending: false });

      const { data } = await queryBuilder;
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [query, limit]);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href={viewAllLink}>
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square skeleton rounded-2xl" />
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-4 skeleton rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        )}

        {/* Mobile View All */}
        {showViewAll && products.length > 0 && (
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href={viewAllLink}>
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
