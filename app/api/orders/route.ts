import { NextRequest } from 'next/server';
import { createAuthClient, createServerClient } from '@/lib/supabase/server';
import { requireAuth, rateLimit, ok, err } from '@/lib/api-helpers';
import { z } from 'zod';

const addressSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postal_code: z.string().min(3),
  country: z.string().default('United States'),
});

const orderSchema = z.object({
  shipping_address: addressSchema,
  payment_method: z.string().default('card'),
  coupon_code: z.string().optional(),
  discount_amount: z.number().min(0).default(0),
  notes: z.string().max(500).optional(),
});

// GET /api/orders — list user's orders
export async function GET(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return response;

  const supabase = createAuthClient(request.headers.get('authorization')!);
  const { searchParams } = request.nextUrl;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50);
  const page = Math.max(parseInt(searchParams.get('page') ?? '1'), 1);
  const offset = (page - 1) * limit;

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(name, images))')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return err('Failed to fetch orders', 500);
  return ok({ orders: data });
}

// POST /api/orders — create an order from current cart
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const { user, response } = await requireAuth(request);
  if (response) return response;

  let body: unknown;
  try { body = await request.json(); } catch { return err('Invalid request body'); }

  const result = orderSchema.safeParse(body);
  if (!result.success) return err(result.error.errors[0].message);

  const { shipping_address, payment_method, coupon_code, discount_amount, notes } = result.data;

  const supabase = createAuthClient(request.headers.get('authorization')!);
  const serverSupabase = createServerClient();

  // Fetch cart items
  const { data: cartItems, error: cartError } = await supabase
    .from('cart')
    .select('*, product:products(id, name, price, images, quantity, is_active)')
    .eq('user_id', user!.id);

  if (cartError || !cartItems?.length) return err('Your cart is empty');

  // Validate stock
  for (const item of cartItems) {
    const product = Array.isArray(item.product) ? item.product[0] : item.product;
    if (!product?.is_active) return err(`${product?.name ?? 'A product'} is no longer available`);
    if (product.quantity < item.quantity) return err(`Insufficient stock for ${product.name}`);
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = Array.isArray(item.product) ? item.product[0] : item.product;
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const shippingCost = subtotal >= 99 ? 0 : 9.99;
  const taxAmount = (subtotal - discount_amount) * 0.08;
  const total = subtotal - discount_amount + shippingCost + taxAmount;
  const orderNumber = `LUX-${Date.now().toString(36).toUpperCase()}`;

  // Create order (using server client to bypass RLS for atomic insert)
  const { data: order, error: orderError } = await serverSupabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user!.id,
      status: 'processing',
      payment_status: 'paid',
      payment_method,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping_cost: parseFloat(shippingCost.toFixed(2)),
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      discount_amount: parseFloat(discount_amount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      coupon_code: coupon_code ?? null,
      shipping_address,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (orderError) return err('Failed to create order', 500);

  // Insert order items
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

  // Decrement stock
  for (const item of cartItems) {
    const product = Array.isArray(item.product) ? item.product[0] : item.product;
    await serverSupabase
      .from('products')
      .update({ quantity: product.quantity - item.quantity })
      .eq('id', product.id);
  }

  // Increment coupon usage
  if (coupon_code) {
    await serverSupabase.rpc('increment_coupon_usage', { coupon_code });
  }

  // Clear cart
  await serverSupabase.from('cart').delete().eq('user_id', user!.id);

  return ok({ order: { id: order.id, order_number: orderNumber, total: order.total } }, 201);
}
