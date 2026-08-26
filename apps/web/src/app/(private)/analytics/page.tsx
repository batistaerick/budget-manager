'use client';

import {
  BalanceBarChart,
  BalancePieChart,
  DatePickerDialog,
  Money,
} from '@/components';
import { SavingLocation, TransactionType } from '@/enums';
import { useSavings, useTransactions } from '@/hooks';
import type { Saving, Transaction } from '@/types';
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

const savingLocationLabels: Record<SavingLocation, string> = {
  [SavingLocation.CASH]: 'Cash',
  [SavingLocation.CHECKING_ACCOUNT]: 'Checking',
  [SavingLocation.SAVINGS_ACCOUNT]: 'Savings',
  [SavingLocation.INVESTMENT]: 'Investments',
  [SavingLocation.OTHER]: 'Other',
};

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

function getSavingsTotal(savings: Saving[]): number {
  return savings.reduce(
    (total: number, saving: Saving): number => total + saving.amount,
    0
  );
}

function getSavingsByLocation(
  savings: Saving[]
): Record<SavingLocation, number> {
  return savings.reduce(
    (
      totals: Record<SavingLocation, number>,
      saving: Saving
    ): Record<SavingLocation, number> => ({
      ...totals,
      [saving.location]: totals[saving.location] + saving.amount,
    }),
    {
      [SavingLocation.CASH]: 0,
      [SavingLocation.CHECKING_ACCOUNT]: 0,
      [SavingLocation.SAVINGS_ACCOUNT]: 0,
      [SavingLocation.INVESTMENT]: 0,
      [SavingLocation.OTHER]: 0,
    }
  );
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

  const { data: incomes } = useTransactions(TransactionType.INCOME, period, {
    loadAll: true,
    pageSize: 1000,
  });
  const { data: expenses } = useTransactions(TransactionType.EXPENSE, period, {
    loadAll: true,
    pageSize: 1000,
  });
  const { data: savings } = useSavings();
  const savingsList = savings ?? [];
  const totalSaved = getSavingsTotal(savingsList);
  const savingsByLocation = getSavingsByLocation(savingsList);
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
      <div className="flex w-full flex-col gap-3 rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-sm font-semibold text-[var(--ctp-text)]">
            Analytics period
          </span>
          <p className="text-xs text-[var(--ctp-subtext0)]">Monthly range</p>
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--ctp-surface1)] bg-[var(--ctp-base)] shadow-sm sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1 px-3 py-2">
            <span className="text-xs font-semibold text-[var(--ctp-subtext0)]">
              From
            </span>
            <DatePickerDialog
              date={startDate}
              setDate={setStartDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
          <div className="h-px bg-[var(--ctp-surface1)] sm:h-16 sm:w-px" />
          <div className="flex flex-col gap-1 px-3 py-2">
            <span className="text-xs font-semibold text-[var(--ctp-subtext0)]">
              To
            </span>
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
        <span className="text-sm text-[var(--ctp-red)]">
          Start date must be before or equal to end date.
        </span>
      )}

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-4 shadow-md">
          <span className="text-sm text-[var(--ctp-subtext1)]">
            Projected end balance
          </span>
          <Money
            className="text-2xl font-semibold"
            value={projectedEndBalance}
          />
        </div>
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-4 shadow-md">
          <span className="text-sm text-[var(--ctp-subtext1)]">
            Projected income
          </span>
          <Money className="text-2xl font-semibold" value={totalIncomes} />
        </div>
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-4 shadow-md">
          <span className="text-sm text-[var(--ctp-subtext1)]">
            Projected expenses
          </span>
          <Money className="text-2xl font-semibold" value={totalExpenses} />
        </div>
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-4 shadow-md">
          <span className="text-sm text-[var(--ctp-subtext1)]">
            Savings rate
          </span>
          <div className="text-2xl font-semibold">{savingsRate}%</div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-4 shadow-md">
          <span className="text-sm text-[var(--ctp-subtext1)]">
            Total saved
          </span>
          <Money className="text-2xl font-semibold" value={totalSaved} />
        </div>
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-4 shadow-md">
          <h2 className="mb-3 text-sm font-semibold text-[var(--ctp-subtext1)]">
            Saved money by location
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {Object.values(SavingLocation).map(
              (location: SavingLocation): JSX.Element => (
                <div key={location} className="min-w-0">
                  <div className="truncate text-xs text-[var(--ctp-subtext0)]">
                    {savingLocationLabels[location]}
                  </div>
                  <Money
                    className="text-sm font-semibold"
                    value={savingsByLocation[location]}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md">
          <h2 className="mb-2 text-sm font-semibold text-[var(--ctp-subtext1)]">
            Monthly cash flow
          </h2>
          {isInvalidDateRange ? (
            <div className="flex h-[260px] items-center justify-center text-[var(--ctp-subtext1)]">
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
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md">
          <h2 className="mb-2 text-sm font-semibold text-[var(--ctp-subtext1)]">
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
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md">
          <h2 className="mb-2 text-sm font-semibold text-[var(--ctp-subtext1)]">
            Expense mix
          </h2>
          <BalancePieChart
            transactions={expenses ?? []}
            typography="Expenses"
            height={220}
            width={260}
          />
        </div>
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md">
          <h2 className="mb-2 text-sm font-semibold text-[var(--ctp-subtext1)]">
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
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md">
          <h2 className="mb-3 text-sm font-semibold text-[var(--ctp-subtext1)]">
            Top expense categories
          </h2>
          <div className="space-y-3">
            {topExpenses.map(({ category, total }: CategoryTotal) => (
              <div key={category} className="grid grid-cols-[1fr_auto] gap-3">
                <span className="truncate text-sm text-[var(--ctp-text)]">
                  {category}
                </span>
                <Money className="text-sm font-semibold" value={total} />
              </div>
            ))}
            {!topExpenses.length && (
              <span className="text-sm text-[var(--ctp-subtext1)]">
                No expenses found.
              </span>
            )}
          </div>
        </div>
        <div className="rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-3 shadow-md">
          <h2 className="mb-3 text-sm font-semibold text-[var(--ctp-subtext1)]">
            Top income categories
          </h2>
          <div className="space-y-3">
            {topIncomes.map(({ category, total }: CategoryTotal) => (
              <div key={category} className="grid grid-cols-[1fr_auto] gap-3">
                <span className="truncate text-sm text-[var(--ctp-text)]">
                  {category}
                </span>
                <Money className="text-sm font-semibold" value={total} />
              </div>
            ))}
            {!topIncomes.length && (
              <span className="text-sm text-[var(--ctp-subtext1)]">
                No income found.
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
