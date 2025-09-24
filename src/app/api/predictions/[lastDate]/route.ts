import prisma from '@/libs/prisma';
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

    const totalMonthlyIncomes: bigint =
      incomeTransactions
        .filter(
          (transaction: Transaction): boolean =>
            transaction.repeats === 'MONTHLY'
        )
        .reduce(
          (sum: bigint, transaction: Transaction): bigint =>
            sum + BigInt(transaction.value),
          0n
        ) * (monthsDifference !== 0 ? BigInt(monthsDifference) : 1n);

    const totalIncome: bigint =
      incomeTransactions
        .filter((transaction: Transaction): boolean => !transaction.repeats)
        .reduce((sum: bigint, transaction: Transaction): bigint => {
          return sum + BigInt(transaction.value);
        }, 0n) + totalMonthlyIncomes;

    const totalMonthlyExpenses: bigint =
      expenseTransactions
        .filter(
          (transaction: Transaction): boolean =>
            transaction.repeats === 'MONTHLY'
        )
        .reduce(
          (sum: bigint, transaction: Transaction): bigint =>
            sum + BigInt(transaction.value),
          0n
        ) * (monthsDifference !== 0 ? BigInt(monthsDifference) : 1n);

    const totalExpense: bigint =
      expenseTransactions
        .filter((transaction: Transaction): boolean => !transaction.repeats)
        .reduce((sum: bigint, transaction: Transaction): bigint => {
          return sum + BigInt(transaction.value);
        }, 0n) + totalMonthlyExpenses;

    const netPrediction: bigint = totalIncome - totalExpense;

    return new Response(JSON.stringify({ netPrediction }));
  } catch (error: unknown) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
