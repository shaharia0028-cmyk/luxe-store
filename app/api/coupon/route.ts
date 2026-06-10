import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireAuth, rateLimit, ok, err } from '@/lib/api-helpers';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1).max(50),
  orderAmount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const { response } = await requireAuth(request);
  if (response) return response;

  let body: unknown;
  try { body = await request.json(); } catch { return err('Invalid request body'); }

  const result = schema.safeParse(body);
  if (!result.success) return err(result.error.errors[0].message);

  const { code, orderAmount } = result.data;
  const supabase = createServerClient();

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (!coupon) return err('Invalid or expired coupon code');

  const now = new Date();
  if (coupon.valid_until && new Date(coupon.valid_until) < now) return err('This coupon has expired');
  if (coupon.valid_from && new Date(coupon.valid_from) > now) return err('This coupon is not yet active');
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return err('This coupon has reached its usage limit');
  if (orderAmount < coupon.min_order_amount) return err(`Minimum order amount is $${coupon.min_order_amount}`);

  let discount = coupon.discount_type === 'percentage'
    ? (orderAmount * coupon.discount_value) / 100
    : coupon.discount_value;

  if (coupon.max_discount_amount) discount = Math.min(discount, coupon.max_discount_amount);

  return ok({ discount: parseFloat(discount.toFixed(2)), coupon: { code: coupon.code, description: coupon.description } });
}
