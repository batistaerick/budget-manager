import { hashPassword } from '@/libs/cyrpt';
import prisma from '@/libs/prisma';
import { UserRole, type User } from '@prisma/client';

export async function POST(request: Request): Promise<Response | undefined> {
  try {
    const { email, name, password } = await request.json();

    if (!email || !password) {
      return new Response('Missing email or password', { status: 400 });
    }
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response('Error', { status: 422, statusText: 'Email taken' });
    }
    const hashedPassword: string = await hashPassword(password);
    const user: User = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });
    return new Response(JSON.stringify(user));
  } catch (error: unknown) {
    return new Response(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
}
