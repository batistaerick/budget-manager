'use client';

import type { Transaction } from '@/types';
import { type JSX } from 'react';
import PieChartTransactions from '../PieChart/PieChart.component';

interface BalanceChartProps {
  expenses: Transaction[];
  incomes: Transaction[];
}

export default function BalanceChart({
  expenses,
  incomes,
}: Readonly<BalanceChartProps>): JSX.Element {
  return (
    <div className="flex w-full cursor-default flex-col gap-2 rounded-xl bg-slate-700/90 p-4">
      {expenses.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-gray-300">
          <span>No expense data available</span>
        </div>
      ) : (
        <div className="flex">
          <PieChartTransactions transactions={expenses} typography="Expenses" />
          <PieChartTransactions transactions={incomes} typography="Incomes" />
        </div>
      )}
    </div>
  );
}
