'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  CreditCard, Truck, Shield, ChevronLeft, ChevronRight, Loader2, MapPin,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const { user, profile, session } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const [shippingForm, setShippingForm] = useState({
    full_name: '', email: '', phone: '',
    address_line1: '', address_line2: '',
    city: '', state: '', postal_code: '', country: 'Bangladesh',
  });

  const shippingCost = cartTotal >= 99 ? 0 : 9.99;
  const taxAmount = (cartTotal - discount) * 0.08;
  const orderTotal = cartTotal - discount + shippingCost + taxAmount;

  useEffect(() => {
    if (profile) {
      setShippingForm((prev) => ({
        ...prev,
        full_name: profile.full_name || '',
        email: profile.email,
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!user) router.push('/auth');
    else if (cartItems.length === 0) router.push('/cart');
  }, [user, cartItems, router]);

  if (!user || cartItems.length === 0) return null;

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg('');
    try {
      const token = session?.access_token;
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ code: couponCode, orderAmount: cartTotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discount);
        setCouponMsg('Coupon applied! -$' + data.discount.toFixed(2));
      } else {
        setCouponMsg(data.error);
      }
    } catch {
      setCouponMsg('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const res = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          shipping_address: shippingForm,
          coupon_code: couponCode || undefined,
          discount_amount: discount,
        }),
      });
      const data = await res.json();
      if (res.ok && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert(data.error || 'Payment failed. Please try again.');
      }
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground mb-4 hover:text-orange">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-orange text-white' : 'bg-muted text-muted-foreground'}`}>{s}</div>
              {s < 3 && <div className={`w-12 lg:w-24 h-1 mx-2 ${step > s ? 'bg-orange' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 lg:gap-24 mb-8 text-sm">
          <span className={step >= 1 ? 'text-orange font-medium' : 'text-muted-foreground'}>Shipping</span>
          <span className={step >= 2 ? 'text-orange font-medium' : 'text-muted-foreground'}>Coupon</span>
          <span className={step >= 3 ? 'text-orange font-medium' : 'text-muted-foreground'}>Review & Pay</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>

              {/* Step 1 - Shipping */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" /> Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={shippingForm.full_name} onChange={(e) => setShippingForm({ ...shippingForm, full_name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input value={shippingForm.phone} onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={shippingForm.email} onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Address Line 1</Label>
                      <Input value={shippingForm.address_line1} onChange={(e) => setShippingForm({ ...shippingForm, address_line1: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Address Line 2 (Optional)</Label>
                      <Input value={shippingForm.address_line2} onChange={(e) => setShippingForm({ ...shippingForm, address_line2: e.target.value })} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>State / Division</Label>
                        <Input value={shippingForm.state} onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code</Label>
                        <Input value={shippingForm.postal_code} onChange={(e) => setShippingForm({ ...shippingForm, postal_code: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={() => setStep(2)} className="w-full bg-orange hover:bg-orange-600">
                      Continue <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2 - Coupon */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Apply Coupon (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
                      <Button onClick={handleCoupon} disabled={couponLoading} variant="outline">
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                    {couponMsg && (
                      <p className={`text-sm ${discount > 0 ? 'text-green-500' : 'text-red-500'}`}>{couponMsg}</p>
                    )}
                    <Separator className="my-4" />
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <p className="text-sm text-muted-foreground">Your payment will be processed securely via SSLCommerz.</p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button onClick={() => setStep(3)} className="flex-1 bg-orange hover:bg-orange-600">
                        Review Order <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3 - Review & Pay */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" /> Review & Pay with SSLCommerz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingForm.full_name}<br />
                        {shippingForm.address_line1}<br />
                        {shippingForm.city}, {shippingForm.state} {shippingForm.postal_code}<br />
                        {shippingForm.country}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              {item.product.images[0] && (
                                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                      {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                      <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-500">Free</span> : '$' + shippingCost.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${taxAmount.toFixed(2)}</span></div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button onClick={handlePayment} disabled={loading} className="flex-1 bg-orange hover:bg-orange-600">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Pay Now via SSLCommerz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] && (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-500">Free</span> : '$' + shippingCost.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${taxAmount.toFixed(2)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-bold"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
