import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/checkout'];
// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];
// Routes to redirect away from if already logged in
const AUTH_ROUTES = ['/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Security Headers (applied to every response) ---
  const response = NextResponse.next();

  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.pexels.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // --- Route Protection ---
  const token = request.cookies.get('sb-access-token')?.value ||
    request.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`)?.value;

  // Redirect logged-in users away from auth page
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect dashboard and checkout
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes — full protection (role check happens in the page itself too)
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
