import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('authToken'); // Replace with your auth logic
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
  return NextResponse.next();
}