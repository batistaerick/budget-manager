'use client';

import { RepeatInterval } from '@/enums';
import type { Installment, Transaction } from '@/types';
import { BarChart } from '@mui/x-charts';
import { addMonths, format, startOfMonth } from 'date-fns';
import type { JSX } from 'react';
import { useMemo } from 'react';

interface MonthlyBalance {
  month: string;
  income: number;
  expense: number;
}

interface ExpandTransaction {
  month: string;
  amount: number;
}

interface BalanceBarChartProps {
  expenses: Transaction[];
  incomes: Transaction[];
  startDate: Date;
  endDate: Date;
  height?: number;
  width?: number;
}

function expandTransaction(
  transaction: Transaction,
  startDate: Date,
  endDate: Date
): ExpandTransaction[] {
  if (transaction.installments && transaction.installments.length > 0) {
    return transaction.installments.map(
      ({ amount, dueDate }: Installment): ExpandTransaction => ({
        month: format(startOfMonth(new Date(dueDate)), 'MMM yyyy'),
        amount: Number(amount),
      })
    );
  }
  if (transaction.repeats === RepeatInterval.MONTHLY) {
    const results: ExpandTransaction[] = [];
    let current: Date = startOfMonth(
      new Date(transaction.date) < startDate
        ? startDate
        : new Date(transaction.date)
    );

    while (current <= endDate) {
      results.push({
        month: format(current, 'MMM yyyy'),
        amount: Number(transaction.totalValue),
      });
      current = addMonths(current, 1);
    }
    return results;
  }
  return [
    {
      month: format(startOfMonth(new Date(transaction.date)), 'MMM yyyy'),
      amount: Number(transaction.totalValue),
    },
  ];
}

function generateMonthsInRange(start: Date, end: Date): string[] {
  const months: string[] = [];
  let current: Date = startOfMonth(start);

  while (current <= end) {
    months.push(format(current, 'MMM yyyy'));
    current = addMonths(current, 1);
  }
  return months;
}

export default function BalanceBarChart({
  expenses,
  incomes,
  startDate,
  endDate,
  height = 170,
  width = 200,
}: Readonly<BalanceBarChartProps>): JSX.Element {
  const chartData: MonthlyBalance[] = useMemo((): MonthlyBalance[] => {
    const months: string[] = generateMonthsInRange(startDate, endDate);
    const monthly: Record<string, MonthlyBalance> = {};

    months.forEach((m: string): void => {
      monthly[m] = { month: m, income: 0, expense: 0 };
    });
    incomes.forEach((transaction: Transaction): void => {
      expandTransaction(transaction, startDate, endDate).forEach(
        ({ month, amount }: ExpandTransaction): void => {
          if (monthly[month]) {
            monthly[month].income += amount;
          }
        }
      );
    });
    expenses.forEach((transaction: Transaction): void => {
      expandTransaction(transaction, startDate, endDate).forEach(
        ({ month, amount }: ExpandTransaction): void => {
          if (monthly[month]) {
            monthly[month].expense += amount;
          }
        }
      );
    });
    return Object.values(monthly);
  }, [expenses, incomes, startDate, endDate]);

  return (
    <div className="w-full">
      <BarChart
        xAxis={[
          {
            data: chartData.map(({ month }: MonthlyBalance): string => month),
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: chartData.map(({ income }: MonthlyBalance): number => income),
            label: 'Incomes',
          },
          {
            data: chartData.map(
              ({ expense }: MonthlyBalance): number => expense
            ),
            label: 'Expenses',
          },
        ]}
        height={height}
        width={width}
      />
    </div>
  );
}
