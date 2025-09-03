import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('jwtToken')?.value;
  const { pathname } = req.nextUrl;
  const publicPages = ['/login', '/register'];

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
