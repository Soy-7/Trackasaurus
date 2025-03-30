import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the user's authentication state from cookies
  const session = request.cookies.get('session');
  
  // Check if the user is accessing a protected route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If no session exists, redirect to sign in page
    if (!session) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: ['/dashboard/:path*']
};