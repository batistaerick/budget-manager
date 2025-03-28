import { PrismaClient, type Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
> = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
