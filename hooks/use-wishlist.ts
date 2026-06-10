'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './use-auth';
import type { Product } from '@/lib/types';

interface WishlistItem {
  id: string;
  product: Product;
}

export function useWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product:products (
            *,
            category:categories (*),
            brand:brands (*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      // Transform data to match WishlistItem type
      const wishlistItems = (data || []).map((item) => ({
        id: item.id,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      })) as WishlistItem[];
      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) return { error: 'Please sign in to use wishlist' };

    try {
      const existing = items.find((item) => item.product.id === productId);

      if (existing) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        return { removed: true };
      } else {
        const { error } = await supabase.from('wishlist').insert({
          user_id: user.id,
          product_id: productId,
        });
        if (error) throw error;

        const { data: product } = await supabase
          .from('products')
          .select('*, category:categories (*), brand:brands (*)')
          .eq('id', productId)
          .single();

        if (product) {
          setItems((prev) => [...prev, { id: '', product: product as Product }]);
        }

        return { added: true };
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { error: 'Failed to update wishlist' };
    }
  };

  return {
    items,
    loading,
    isInWishlist,
    toggleWishlist,
    wishlistCount: items.length,
    fetchWishlist,
  };
}
