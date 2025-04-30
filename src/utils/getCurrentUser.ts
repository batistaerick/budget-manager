import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';
import type { User } from '@prisma/client';
import type { Session } from 'next-auth';

export default async function getCurrentUser(): Promise<User> {
  const session: Session | null = await auth();

  if (!session?.user?.email) {
    throw new Error('Email: Not signed in');
  }
  const currentUser: User | null = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    throw new Error('Not signed in');
  }
  return currentUser;
}
