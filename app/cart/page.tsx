'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function CartPage() {
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const shippingThreshold = 99;
  const shippingCost = cartTotal >= shippingThreshold ? 0 : 9.99;
  const taxRate = 0.08;
  const taxAmount = (cartTotal - discount) * taxRate;
  const orderTotal = cartTotal - discount + shippingCost + taxAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        setCouponError('Invalid coupon code');
        setCouponLoading(false);
        return;
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        setCouponError('This coupon has expired');
        setCouponLoading(false);
        return;
      }

      if (coupon.min_order_amount && cartTotal < coupon.min_order_amount) {
        setCouponError(`Minimum order amount is $${coupon.min_order_amount}`);
        setCouponLoading(false);
        return;
      }

      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = cartTotal * (coupon.discount_value / 100);
        if (coupon.max_discount_amount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      setDiscount(discountAmount);
      setAppliedCoupon(coupon.code);
    } catch {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view your cart</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to access your cart and checkout.
          </p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button onClick={() => router.push('/shop')} className="bg-orange hover:bg-orange-600">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 bg-card rounded-xl border"
                >
                  {/* Image */}
                  <Link href={`/product/${item.product.slug}`}>
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-medium hover:text-orange transition-colors truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link href="/shop">
                <Button variant="ghost">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Have a coupon?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium">{appliedCoupon}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="h-auto p-0 text-green-700 dark:text-green-400"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-sm text-red-500 mt-1">{couponError}</p>
                )}
              </div>

              <Separator className="mb-4" />

              {/* Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    <span>${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Free shipping progress */}
              {cartTotal < shippingThreshold && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Add ${(shippingThreshold - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-orange transition-all duration-500"
                      style={{ width: `${(cartTotal / shippingThreshold) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                className="w-full mt-6 bg-orange hover:bg-orange-600"
                size="lg"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
