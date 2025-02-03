import getCurrentUser from '@/utils/getCurrentUser';
import {
  PrismaClient,
  RepeatInterval,
  TransactionType,
  type Transaction,
  type User,
} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    const { id }: User = await getCurrentUser();
    const {
      value,
      category,
      notes,
      date,
      installments,
      transactionType,
      repeats,
    } = await request.json();

    const transaction: Transaction = await prisma.transaction.create({
      data: {
        userId: id,
        category,
        notes,
        value: Number(value),
        date,
        installments: installments ?? null,
        transactionType: transactionType as TransactionType,
        repeats: repeats as RepeatInterval | null,
      },
    });
    return new Response(JSON.stringify(transaction), { status: 201 });
  } catch (error: unknown) {
    return new Response(error instanceof Error ? error.message : 'Error', {
      status: 500,
    });
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    await getCurrentUser();
    const {
      id,
      category,
      notes,
      value,
      installments,
      transactionType,
      repeats,
    } = await request.json();

    const updatedTransaction: Transaction = await prisma.transaction.update({
      where: { id },
      data: {
        category: category,
        notes: notes,
        value: value,
        installments: installments ?? null,
        transactionType: transactionType as TransactionType,
        repeats: repeats as RepeatInterval | null,
      },
    });
    return new Response(JSON.stringify(updatedTransaction));
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { id }: User = await getCurrentUser();
    const url = new URL(request.url);

    const transactionType: TransactionType = url.searchParams.get(
      'type'
    ) as TransactionType;
    const startDate: string = url.searchParams.get('startDate') as string;
    const endDate: string = url.searchParams.get('endDate') as string;

    const transactions: Transaction[] | null =
      await prisma.transaction.findMany({
        where: {
          userId: id,
          transactionType,
          date: { gte: new Date(startDate), lte: new Date(endDate) },
        },
      });
    return new Response(JSON.stringify(transactions));
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
