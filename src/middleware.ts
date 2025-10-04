import type { NextConfig } from 'next';
import { type NextRequest, NextResponse } from 'next/server';

export default function middleware({
  cookies,
  nextUrl: { pathname, origin },
}: NextRequest): NextResponse<unknown> {
  const token: string | undefined = cookies.get('access_token')?.value;
  const protectedRoutes: string[] = ['/', '/profile'];

  if (
    !token &&
    protectedRoutes.some(
      (route: string): boolean =>
        pathname.startsWith(route) && pathname !== '/auth'
    )
  ) {
    return NextResponse.redirect(new URL('/auth', origin));
  }

  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/', origin));
  }
  return NextResponse.next();
}

export const config: NextConfig = { matcher: ['/', '/profile', '/auth'] };
