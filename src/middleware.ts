import { auth } from '@/libs/auth';
import type { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(
  request: NextRequest
): Promise<NextResponse<unknown>> {
  const {
    nextUrl: { origin },
  } = request;
  const session: Session | null = await auth();

  if (!session) {
    return NextResponse.redirect(new URL('/auth', origin));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/analytics'] };
