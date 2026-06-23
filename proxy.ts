import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;

  const session = request.cookies.get('session')?.value;

  const isAuthenticated = !!(accessToken || session);

  const isProtectedRoute =
    pathname.startsWith('/vault') ||
    pathname.startsWith('/settings');

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL('/vault', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/vault/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};