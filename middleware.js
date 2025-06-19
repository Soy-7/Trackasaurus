import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the user's authentication state from cookies
  const session = request.cookies.get('session');
  
  // If user is already authenticated and trying to access the landing page,
  // signin page, or signup page, redirect them to dashboard
  if (session) {
    if (request.nextUrl.pathname === '/' || 
        request.nextUrl.pathname === '/signin' || 
        request.nextUrl.pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // If user is not authenticated and trying to access protected routes
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: ['/', '/signin', '/signup', '/dashboard/:path*']
};