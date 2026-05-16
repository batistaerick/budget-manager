'use client';

import { BalanceBarChart, DatePickerDialog, Money } from '@/components';
import { TransactionType } from '@/enums';
import { useTransactions } from '@/hooks';
import type { Transaction } from '@/types';
import { useState, type JSX } from 'react';

function totalTransactions(transactions: Transaction[]): number {
  return transactions.reduce(
    (sum: number, transaction: Transaction): number =>
      sum + Number(transaction.totalValue),
    0
  );
}

export default function AnalyticsPage(): JSX.Element {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const isInvalidDateRange = startDate > endDate;

  const { data: incomes } = useTransactions(TransactionType.INCOME, {
    startDate,
    endDate,
  });
  const { data: expenses } = useTransactions(TransactionType.EXPENSE, {
    startDate,
    endDate,
  });
  const totalIncomes = totalTransactions(incomes ?? []);
  const totalExpenses = totalTransactions(expenses ?? []);
  const netBalance = totalIncomes - totalExpenses;
  const savingsRate =
    totalIncomes > 0 ? Math.round((netBalance / totalIncomes) * 100) : 0;

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <span className="text-base font-semibold text-gray-300">
          Select Date Range
        </span>
        <div className="flex items-center rounded-full border border-gray-300 p-4 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Start Date
            </span>
            <DatePickerDialog
              date={startDate}
              setDate={setStartDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-500">End Date</span>
            <DatePickerDialog
              date={endDate}
              setDate={setEndDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
        </div>
        {isInvalidDateRange && (
          <span className="text-sm text-red-300">
            Start date must be before or equal to end date.
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex cursor-default items-center justify-start rounded-xl bg-slate-700/90 p-2">
          {isInvalidDateRange ? (
            <div className="flex h-[300px] w-[600px] items-center justify-center text-gray-300">
              Select a valid date range to view analytics.
            </div>
          ) : (
            <BalanceBarChart
              startDate={startDate}
              endDate={endDate}
              expenses={expenses ?? []}
              incomes={incomes ?? []}
              height={300}
              width={600}
            />
          )}
        </div>
      </div>
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Net balance</span>
          <Money className="text-2xl font-semibold" value={netBalance} />
        </div>
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Savings rate</span>
          <div className="text-2xl font-semibold">{savingsRate}%</div>
        </div>
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Expense ratio</span>
          <div className="text-2xl font-semibold">
            {totalIncomes > 0
              ? `${Math.round((totalExpenses / totalIncomes) * 100)}%`
              : '0%'}
          </div>
        </div>
      </section>
    </div>
  );
}
