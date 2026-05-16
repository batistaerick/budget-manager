'use client';

import {
  BalanceBarChart,
  BalancePieChart,
  DatePickerDialog,
  Money,
} from '@/components';
import { TransactionType } from '@/enums';
import { useTransactions } from '@/hooks';
import type { Transaction } from '@/types';
import {
  getEndOfMonth,
  getStartOfMonth,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import {
  getProjectedTransactionTotal,
  getProjectedTransactionsTotal,
} from '@/utils/transactionProjection.util';
import { LineChart } from '@mui/x-charts';
import { addMonths, format, startOfMonth } from 'date-fns';
import { useMemo, useState, type JSX } from 'react';

interface CategoryTotal {
  category: string;
  total: number;
}

interface MonthlyTrend {
  balance: number;
  month: string;
}

interface TrendInput {
  endDate: Date;
  expenses: Transaction[];
  incomes: Transaction[];
  startDate: Date;
}

function getTopCategories(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): CategoryTotal[] {
  const totals = transactions.reduce(
    (accumulator: Record<string, number>, transaction: Transaction) => {
      const category = transaction.category.name;
      accumulator[category] =
        (accumulator[category] ?? 0) +
        getProjectedTransactionTotal(transaction, startDate, endDate);
      return accumulator;
    },
    {}
  );

  return Object.entries(totals)
    .map(([category, total]: [string, number]) => ({ category, total }))
    .filter(({ total }: CategoryTotal): boolean => total > 0)
    .sort((a: CategoryTotal, b: CategoryTotal): number => b.total - a.total)
    .slice(0, 5);
}

function getMonthlyTrend({
  endDate,
  expenses,
  incomes,
  startDate,
}: TrendInput): MonthlyTrend[] {
  const results: MonthlyTrend[] = [];
  let current = startOfMonth(startDate);
  let runningBalance = 0;

  while (current <= endDate) {
    const monthStart = getStartOfMonth(current);
    const monthEnd = getEndOfMonth(current);
    const income = getProjectedTransactionsTotal(incomes, monthStart, monthEnd);
    const expense = getProjectedTransactionsTotal(
      expenses,
      monthStart,
      monthEnd
    );

    runningBalance += income - expense;
    results.push({
      balance: runningBalance,
      month: format(current, 'MMM yyyy'),
    });
    current = addMonths(current, 1);
  }

  return results;
}

export default function AnalyticsPage(): JSX.Element {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const period: DateRangeTransactions = useMemo(
    (): DateRangeTransactions => ({
      startDate: getStartOfMonth(startDate),
      endDate: getEndOfMonth(endDate),
    }),
    [endDate, startDate]
  );
  const isInvalidDateRange = period.startDate > period.endDate;

  const { data: incomes } = useTransactions(TransactionType.INCOME, period);
  const { data: expenses } = useTransactions(TransactionType.EXPENSE, period);
  const totalIncomes = getProjectedTransactionsTotal(
    incomes ?? [],
    period.startDate,
    period.endDate
  );
  const totalExpenses = getProjectedTransactionsTotal(
    expenses ?? [],
    period.startDate,
    period.endDate
  );
  const projectedEndBalance = totalIncomes - totalExpenses;
  const savingsRate =
    totalIncomes > 0
      ? Math.round((projectedEndBalance / totalIncomes) * 100)
      : 0;
  const topExpenses = getTopCategories(
    expenses ?? [],
    period.startDate,
    period.endDate
  );
  const topIncomes = getTopCategories(
    incomes ?? [],
    period.startDate,
    period.endDate
  );
  const monthlyTrend = getMonthlyTrend({
    endDate: period.endDate,
    expenses: expenses ?? [],
    incomes: incomes ?? [],
    startDate: period.startDate,
  });

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="flex w-full flex-col gap-3 rounded bg-slate-700/90 p-3 md:flex-row md:items-center md:justify-between">
        <span className="text-sm font-semibold text-gray-300">
          Analytics period
        </span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2 rounded border border-slate-500 px-3 py-1">
            <span className="text-xs font-medium text-gray-400">Start</span>
            <DatePickerDialog
              date={startDate}
              setDate={setStartDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
          <div className="flex items-center gap-2 rounded border border-slate-500 px-3 py-1">
            <span className="text-xs font-medium text-gray-400">End</span>
            <DatePickerDialog
              date={endDate}
              setDate={setEndDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
        </div>
      </div>
      {isInvalidDateRange && (
        <span className="text-sm text-red-300">
          Start date must be before or equal to end date.
        </span>
      )}

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Projected end balance</span>
          <Money
            className="text-2xl font-semibold"
            value={projectedEndBalance}
          />
        </div>
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Projected income</span>
          <Money className="text-2xl font-semibold" value={totalIncomes} />
        </div>
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Projected expenses</span>
          <Money className="text-2xl font-semibold" value={totalExpenses} />
        </div>
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Savings rate</span>
          <div className="text-2xl font-semibold">{savingsRate}%</div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded bg-slate-700/90 p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-300">
            Monthly cash flow
          </h2>
          {isInvalidDateRange ? (
            <div className="flex h-[260px] items-center justify-center text-gray-300">
              Select a valid date range to view analytics.
            </div>
          ) : (
            <BalanceBarChart
              startDate={period.startDate}
              endDate={period.endDate}
              expenses={expenses ?? []}
              incomes={incomes ?? []}
              height={260}
              width={720}
            />
          )}
        </div>
        <div className="rounded bg-slate-700/90 p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-300">
            Balance trend
          </h2>
          <LineChart
            xAxis={[
              {
                data: monthlyTrend.map(
                  ({ month }: MonthlyTrend): string => month
                ),
                scaleType: 'point',
              },
            ]}
            series={[
              {
                data: monthlyTrend.map(
                  ({ balance }: MonthlyTrend): number => balance
                ),
                label: 'Balance',
              },
            ]}
            height={260}
            width={360}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded bg-slate-700/90 p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-300">
            Expense mix
          </h2>
          <BalancePieChart
            transactions={expenses ?? []}
            typography="Expenses"
            height={220}
            width={260}
          />
        </div>
        <div className="rounded bg-slate-700/90 p-3">
          <h2 className="mb-2 text-sm font-semibold text-gray-300">
            Income mix
          </h2>
          <BalancePieChart
            transactions={incomes ?? []}
            typography="Incomes"
            height={220}
            width={260}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded bg-slate-700/90 p-3">
          <h2 className="mb-3 text-sm font-semibold text-gray-300">
            Top expense categories
          </h2>
          <div className="space-y-3">
            {topExpenses.map(({ category, total }: CategoryTotal) => (
              <div key={category} className="grid grid-cols-[1fr_auto] gap-3">
                <span className="truncate text-sm text-gray-200">
                  {category}
                </span>
                <Money className="text-sm font-semibold" value={total} />
              </div>
            ))}
            {!topExpenses.length && (
              <span className="text-sm text-gray-300">No expenses found.</span>
            )}
          </div>
        </div>
        <div className="rounded bg-slate-700/90 p-3">
          <h2 className="mb-3 text-sm font-semibold text-gray-300">
            Top income categories
          </h2>
          <div className="space-y-3">
            {topIncomes.map(({ category, total }: CategoryTotal) => (
              <div key={category} className="grid grid-cols-[1fr_auto] gap-3">
                <span className="truncate text-sm text-gray-200">
                  {category}
                </span>
                <Money className="text-sm font-semibold" value={total} />
              </div>
            ))}
            {!topIncomes.length && (
              <span className="text-sm text-gray-300">No income found.</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
