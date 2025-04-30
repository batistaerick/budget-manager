import { PrismaClient, type Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
export default prisma;
