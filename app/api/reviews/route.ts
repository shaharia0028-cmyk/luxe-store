import { NextRequest } from 'next/server';
import { createAuthClient } from '@/lib/supabase/server';
import { requireAuth, rateLimit, ok, err } from '@/lib/api-helpers';
import { z } from 'zod';

const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const { user, response } = await requireAuth(request);
  if (response) return response;

  let body: unknown;
  try { body = await request.json(); } catch { return err('Invalid request body'); }

  const result = reviewSchema.safeParse(body);
  if (!result.success) return err(result.error.errors[0].message);

  const supabase = createAuthClient(request.headers.get('authorization')!);

  // Check if user has purchased this product
  const { data: orderItem } = await supabase
    .from('order_items')
    .select('id, order:orders!inner(user_id, status)')
    .eq('product_id', result.data.product_id)
    .eq('order.user_id', user!.id)
    .eq('order.status', 'delivered')
    .limit(1)
    .single();

  const { error } = await supabase.from('reviews').insert({
    ...result.data,
    user_id: user!.id,
    is_verified_purchase: !!orderItem,
  });

  if (error) {
    if (error.code === '23505') return err('You have already reviewed this product');
    return err('Failed to submit review', 500);
  }

  return ok({ message: 'Review submitted successfully' }, 201);
}
