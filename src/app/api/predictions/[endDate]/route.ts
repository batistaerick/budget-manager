import getCurrentUser from '@/utils/getCurrentUser';
import {
  PrismaClient,
  RepeatInterval,
  TransactionType,
  type Transaction,
} from '@prisma/client';

interface TypeContext {
  params: Promise<{ lastDate: string }>;
}

const prisma = new PrismaClient();

export async function GET(
  _: Request,
  { params }: TypeContext
): Promise<Response> {
  try {
    const { id } = await getCurrentUser();
    const { lastDate } = await params;

    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(lastDate);
    endDate.setHours(23, 59, 59, 999);

    const monthsDifference: number =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const incomeTransactions: Transaction[] = await prisma.transaction.findMany(
      {
        where: {
          userId: id,
          transactionType: TransactionType.INCOME,
          date: { gte: startDate, lte: endDate },
        },
      }
    );

    const expenseTransactions: Transaction[] =
      await prisma.transaction.findMany({
        where: {
          userId: id,
          transactionType: TransactionType.EXPENSE,
          date: { gte: startDate, lte: endDate },
        },
      });

    const totalIncome: number = incomeTransactions.reduce(
      (sum: number, transaction: Transaction): number => {
        if (transaction.repeats === RepeatInterval.MONTHLY) {
          return sum + transaction.value * monthsDifference;
        }
        return sum + transaction.value;
      },
      0
    );

    const totalExpense: number = expenseTransactions.reduce(
      (sum: number, transaction: Transaction): number => {
        if (transaction.repeats === RepeatInterval.MONTHLY) {
          return sum + transaction.value * monthsDifference;
        }
        return sum + transaction.value;
      },
      0
    );

    const netPrediction: number = totalIncome - totalExpense;

    return new Response(JSON.stringify({ netPrediction }));
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
