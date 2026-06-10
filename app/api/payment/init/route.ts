import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient, createServerClient } from '@/lib/supabase/server';
import { requireAuth, rateLimit, err } from '@/lib/api-helpers';
import { z } from 'zod';

const schema = z.object({
  shipping_address: z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address_line1: z.string().min(5),
    address_line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postal_code: z.string().min(3),
    country: z.string().default('Bangladesh'),
  }),
  coupon_code: z.string().optional(),
  discount_amount: z.number().min(0).default(0),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const { user, response } = await requireAuth(request);
  if (response) return response;

  let body: unknown;
  try { body = await request.json(); } catch { return err('Invalid request body'); }

  const result = schema.safeParse(body);
  if (!result.success) return err(result.error.errors[0].message);

  const { shipping_address, coupon_code, discount_amount } = result.data;

  const supabase = createAuthClient(request.headers.get('authorization')!);
  const serverSupabase = createServerClient();

  const { data: cartItems } = await supabase
    .from('cart')
    .select('*, product:products(id, name, price, images, quantity, is_active)')
    .eq('user_id', user!.id);

  if (!cartItems?.length) return err('Your cart is empty');

  const subtotal = cartItems.reduce((sum, item) => {
    const product = Array.isArray(item.product) ? item.product[0] : item.product;
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const shippingCost = subtotal >= 99 ? 0 : 9.99;
  const taxAmount = (subtotal - discount_amount) * 0.08;
  const total = subtotal - discount_amount + shippingCost + taxAmount;
  const orderNumber = 'LUX-' + Date.now().toString(36).toUpperCase();

  const { data: order, error: orderError } = await serverSupabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user!.id,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'sslcommerz',
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping_cost: parseFloat(shippingCost.toFixed(2)),
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      discount_amount: parseFloat(discount_amount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      coupon_code: coupon_code ?? null,
      shipping_address,
    })
    .select()
    .single();

  if (orderError) return err('Failed to create order', 500);

  const orderItems = cartItems.map((item) => {
    const product = Array.isArray(item.product) ? item.product[0] : item.product;
    return {
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.images?.[0] ?? null,
      quantity: item.quantity,
      price: product.price,
      total: parseFloat((product.price * item.quantity).toFixed(2)),
    };
  });
  await serverSupabase.from('order_items').insert(orderItems);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';

  const sslUrl = isLive
    ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

  const params = new URLSearchParams({
    store_id: storeId!,
    store_passwd: storePassword!,
    total_amount: total.toFixed(2),
    currency: 'BDT',
    tran_id: orderNumber,
    success_url: siteUrl + '/api/payment/success',
    fail_url: siteUrl + '/api/payment/fail',
    cancel_url: siteUrl + '/api/payment/cancel',
    ipn_url: siteUrl + '/api/payment/ipn',
    cus_name: shipping_address.full_name,
    cus_email: shipping_address.email,
    cus_phone: shipping_address.phone,
    cus_add1: shipping_address.address_line1,
    cus_city: shipping_address.city,
    cus_state: shipping_address.state,
    cus_postcode: shipping_address.postal_code,
    cus_country: shipping_address.country,
    ship_name: shipping_address.full_name,
    ship_add1: shipping_address.address_line1,
    ship_city: shipping_address.city,
    ship_state: shipping_address.state,
    ship_postcode: shipping_address.postal_code,
    ship_country: shipping_address.country,
    product_name: 'LUXE Store Order',
    product_category: 'General',
    product_profile: 'general',
    value_a: order.id,
    value_b: user!.id,
  });

  const sslResponse = await fetch(sslUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const sslData = await sslResponse.json();

  if (sslData.status !== 'SUCCESS') {
    await serverSupabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    return err('Payment gateway error. Please try again.', 500);
  }

  return NextResponse.json({ redirect_url: sslData.GatewayPageURL });
}
