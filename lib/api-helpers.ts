import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient } from './supabase/server';

// Rate limiting store (in-memory — use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: NextRequest,
  { limit = 30, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > limit) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
    );
  }

  return null;
}

// Extract and verify the user from the Authorization header
export async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const supabase = createAuthClient(authHeader);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

// Require auth — returns user or sends 401
export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user, response: null };
}

// Require admin role
export async function requireAdmin(request: NextRequest) {
  const { user, response } = await requireAuth(request);
  if (response) return { user: null, response };

  const supabase = createAuthClient(request.headers.get('authorization')!);
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  if (profile?.role !== 'admin') {
    return { user: null, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user, response: null };
}

// Standard JSON success response
export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

// Standard error response
export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
