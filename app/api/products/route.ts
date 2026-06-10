import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { rateLimit, ok, err } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { limit: 60 });
  if (limited) return limited;

  const { searchParams } = request.nextUrl;
  const supabase = createServerClient();

  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug), brand:brands(id,name,slug)')
    .eq('is_active', true);

  // Filters
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const isNew = searchParams.get('new');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') ?? 'created_at';
  const order = searchParams.get('order') === 'asc' ? true : false;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
  const page = Math.max(parseInt(searchParams.get('page') ?? '1'), 1);
  const offset = (page - 1) * limit;

  if (category) query = query.eq('category_id', category);
  if (brand) query = query.eq('brand_id', brand);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (isNew === 'true') query = query.eq('is_new', true);
  if (search) query = query.ilike('name', `%${search}%`);
  if (minPrice) query = query.gte('price', parseFloat(minPrice));
  if (maxPrice) query = query.lte('price', parseFloat(maxPrice));

  const validSortFields = ['price', 'created_at', 'rating_average', 'name'];
  const safeSort = validSortFields.includes(sort) ? sort : 'created_at';
  query = query.order(safeSort, { ascending: order }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return err('Failed to fetch products', 500);

  return ok({ products: data, total: count, page, limit });
}
