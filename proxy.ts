import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for DevVault
 * 
 * Responsibilities:
 * 1. Protect /vault routes - require valid JWT token
 * 2. Redirect authenticated users away from /login and /register
 * 3. Validate token presence (not validation - that happens in API layer)
 * 4. Handle token refresh if needed
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from localStorage via cookies
  // Note: localStorage isn't available in middleware, so we check Authorization header
  // or use a secure httpOnly cookie if you set it up
  const token = request.cookies.get('auth_token')?.value;

  // Protected routes - require authentication
  const isProtectedRoute = pathname.startsWith('/vault') || pathname.startsWith('/settings');
  
  // Auth routes - should redirect to /vault if already authenticated
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Handle protected routes
  if (isProtectedRoute) {
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Token exists, allow access
    return NextResponse.next();
  }

  // Handle auth routes
  if (isAuthRoute) {
    // If already authenticated, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/vault', request.url));
    }
    
    // Not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

/**
 * Configure which routes this middleware applies to
 * 
 * matcher patterns:
 * - /vault/:path* → all routes under /vault
 * - /settings/:path* → all routes under /settings
 * - /login → login page
 * - /register → register page
 * 
 * Exclude:
 * - /_next/* → Next.js internals
 * - /favicon.ico → favicon
 * - /public/* → public assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};