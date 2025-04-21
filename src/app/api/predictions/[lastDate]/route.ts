import { prisma } from '@/libs/prisma';
import getCurrentUser from '@/utils/getCurrentUser';
import {
  RepeatInterval,
  TransactionType,
  type Transaction,
} from '@prisma/client';

interface TypeContext {
  params: Promise<{ lastDate: string }>;
}

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

    const incomeTransactions: Transaction[] = await prisma.transaction.findMany(
      {
        where: {
          userId: id,
          transactionType: TransactionType.INCOME,
          OR: [
            { repeats: RepeatInterval.MONTHLY },
            { date: { gte: startDate, lte: endDate } },
          ],
        },
      }
    );

    const expenseTransactions: Transaction[] =
      await prisma.transaction.findMany({
        where: {
          userId: id,
          transactionType: TransactionType.EXPENSE,
          OR: [
            { repeats: RepeatInterval.MONTHLY },
            { date: { gte: startDate, lte: endDate } },
          ],
        },
      });

    const monthsDifference: number =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const totalMonthlyIncomes: number =
      incomeTransactions
        .filter(
          (transaction: Transaction): boolean =>
            transaction.repeats === 'MONTHLY'
        )
        .reduce(
          (sum: number, transaction: Transaction): number =>
            sum + transaction.value,
          0
        ) * (monthsDifference !== 0 ? monthsDifference : 1);

    const totalIncome: number =
      incomeTransactions
        .filter((transaction: Transaction): boolean => !transaction.repeats)
        .reduce((sum: number, transaction: Transaction): number => {
          return sum + transaction.value;
        }, 0) + totalMonthlyIncomes;

    const totalMonthlyExpenses: number =
      expenseTransactions
        .filter(
          (transaction: Transaction): boolean =>
            transaction.repeats === 'MONTHLY'
        )
        .reduce(
          (sum: number, transaction: Transaction): number =>
            sum + transaction.value,
          0
        ) * (monthsDifference !== 0 ? monthsDifference : 1);

    const totalExpense: number =
      expenseTransactions
        .filter((transaction: Transaction): boolean => !transaction.repeats)
        .reduce((sum: number, transaction: Transaction): number => {
          return sum + transaction.value;
        }, 0) + totalMonthlyExpenses;

    const netPrediction: number = totalIncome - totalExpense;

    return new Response(JSON.stringify({ netPrediction }));
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
