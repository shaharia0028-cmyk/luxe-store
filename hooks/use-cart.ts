'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './use-auth';

export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    quantity: number;
  };
  variant_id: string | null;
  quantity: number;
}

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          variant_id,
          product:products (
            id,
            name,
            slug,
            price,
            images,
            quantity
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      // Transform data to match CartItem type
      const items = (data || []).map((item) => ({
        id: item.id,
        quantity: item.quantity,
        variant_id: item.variant_id,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      })) as CartItem[];
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number = 1, variantId?: string) => {
    if (!user) return { error: 'Please sign in to add items to cart' };

    try {
      const { data: existing } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .is('variant_id', variantId || null)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cart').insert({
          user_id: user.id,
          product_id: productId,
          variant_id: variantId || null,
          quantity,
        });
        if (error) throw error;
      }

      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { error: 'Failed to add item to cart' };
    }
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(cartId);
    }

    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartId);
      if (error) throw error;
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { error: 'Failed to update quantity' };
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);
      if (error) throw error;
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { error: 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await supabase.from('cart').delete().eq('user_id', user.id);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    fetchCart,
  };
}
