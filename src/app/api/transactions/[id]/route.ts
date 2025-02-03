import getCurrentUser from '@/utils/getCurrentUser';
import { PrismaClient, type Transaction } from '@prisma/client';

interface TypeContext {
  params: Promise<{ id: string }>;
}

const prisma = new PrismaClient();

export async function GET(
  _: Request,
  { params }: TypeContext
): Promise<Response> {
  try {
    await getCurrentUser();
    const { id } = await params;
    const transaction: Transaction | null = await prisma.transaction.findUnique(
      { where: { id } }
    );

    if (!transaction) {
      return new Response('Transaction not found', { status: 404 });
    }
    return new Response(JSON.stringify(transaction));
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: TypeContext
): Promise<Response> {
  try {
    await getCurrentUser();
    const { id } = await params;
    await prisma.transaction.delete({ where: { id } });
    return new Response(undefined, { status: 204 });
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
