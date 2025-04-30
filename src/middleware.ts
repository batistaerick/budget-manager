import { auth } from '@/libs/auth';
import type { NextConfig } from 'next';
import type { Session } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

export default async function middleware(
  request: NextRequest
): Promise<NextResponse<unknown>> {
  const { pathname, origin } = request.nextUrl;
  const session: Session | null = await auth();

  if (!session && ['/', '/analytics'].includes(pathname)) {
    return NextResponse.redirect(new URL('/auth', origin));
  }

  if (session && pathname === '/auth') {
    return NextResponse.redirect(new URL('/', origin));
  }
  return NextResponse.next();
}

export const config: NextConfig = { matcher: ['/', '/auth'] };
