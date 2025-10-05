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
    <div className="flex w-full cursor-default flex-col gap-2 rounded-xl bg-slate-700/90 p-3">
      <div className="flex">
        {expenses.length !== 0 ? (
          <PieChartTransactions transactions={expenses} typography="Expenses" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <span>No expense data available</span>
          </div>
        )}
        {incomes.length !== 0 ? (
          <PieChartTransactions transactions={incomes} typography="Incomes" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <span>No expense data available</span>
          </div>
        )}
      </div>
    </div>
  );
}
