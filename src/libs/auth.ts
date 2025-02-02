import { prisma } from '@/libs/prisma';
import { emailSchema, passwordSchema } from '@/utils/validators';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import type { SafeParseReturnType } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: { signIn: '/auth' },
  session: { strategy: 'jwt', maxAge: 604800 },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID ?? '',
      clientSecret: process.env.AUTH_FACEBOOK_SECRET ?? '',
    }),
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize,
    }),
  ],
});

async function authorize(
  credentials: Partial<Record<'email' | 'password', unknown>>
): Promise<User> {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Email and password required');
  }
  const email: SafeParseReturnType<string, string> = emailSchema.safeParse(
    credentials.email
  );
  const password: SafeParseReturnType<string, string> =
    passwordSchema.safeParse(credentials.password);

  if (email.error) {
    throw new Error(email.error.message);
  }
  if (password.error) {
    throw new Error(password.error.message);
  }
  const user: User | null = await prisma.user.findUnique({
    where: { email: email.data },
  });

  if (!user?.password) {
    throw new Error('Email does not exist');
  }
  const isCorrectPassword: boolean = await compare(
    password.data,
    user.password
  );

  if (!isCorrectPassword) {
    throw new Error('Incorrect password');
  }
  return user;
}
