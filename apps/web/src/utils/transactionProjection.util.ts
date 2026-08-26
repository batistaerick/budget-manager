import { RepeatInterval } from '@/enums';
import type { Installment, Transaction } from '@/types';
import { parseApiDate } from '@/utils/globalFormats.util';

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isBetween(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

function monthDifference(startDate: Date, endDate: Date): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth()
  );
}

function countMonthlyOccurrences(
  transactionDate: Date,
  startDate: Date,
  endDate: Date
): number {
  const firstMonth = startOfMonth(
    transactionDate > startDate ? transactionDate : startDate
  );
  const lastMonth = startOfMonth(endDate);

  if (firstMonth > lastMonth) {
    return 0;
  }

  return monthDifference(firstMonth, lastMonth) + 1;
}

function totalInstallmentsInRange(
  installments: Installment[],
  startDate: Date,
  endDate: Date
): number {
  return installments.reduce(
    (sum: number, installment: Installment): number => {
      const dueDate = parseApiDate(installment.dueDate);

      if (!isBetween(dueDate, startDate, endDate)) {
        return sum;
      }

      return sum + Number(installment.amount);
    },
    0
  );
}

export function getProjectedTransactionTotal(
  transaction: Transaction,
  startDate: Date,
  endDate: Date
): number {
  if (transaction.installments?.length) {
    return totalInstallmentsInRange(
      transaction.installments,
      startDate,
      endDate
    );
  }

  const transactionDate = parseApiDate(transaction.date);

  if (transaction.repeats === RepeatInterval.MONTHLY) {
    return (
      countMonthlyOccurrences(transactionDate, startDate, endDate) *
      Number(transaction.totalValue)
    );
  }

  if (!isBetween(transactionDate, startDate, endDate)) {
    return 0;
  }

  return Number(transaction.totalValue);
}

export function getProjectedTransactionsTotal(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): number {
  return transactions.reduce(
    (sum: number, transaction: Transaction): number =>
      sum + getProjectedTransactionTotal(transaction, startDate, endDate),
    0
  );
}
