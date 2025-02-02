import { prisma } from '@/libs/prisma';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function POST(request: Request): Promise<Response | undefined> {
  try {
    const { email, name, password } = await request.json();
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response('Error', { status: 422, statusText: 'Email taken' });
    }
    const hashedPassword: string = await bcrypt.hash(password, 12);
    const user: User = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        image: '',
      },
    });
    return new Response(JSON.stringify(user));
  } catch (error) {
    console.error(error);
  }
}
