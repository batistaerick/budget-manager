import { BalanceBarChart, BalancePieChart } from '@/components';
import type { Transaction } from '@/types';
import type { JSX } from 'react';

interface ChartsProps {
  expenses: Transaction[];
  incomes: Transaction[];
  startDate: Date;
  endDate: Date;
}

export default function Charts({
  expenses,
  incomes,
  startDate,
  endDate,
}: Readonly<ChartsProps>): JSX.Element {
  return (
    <div className="flex w-full cursor-default items-center justify-start rounded-xl bg-slate-700/90 p-2">
      <BalanceBarChart
        startDate={startDate}
        endDate={endDate}
        expenses={expenses}
        incomes={incomes}
      />
      <BalancePieChart transactions={incomes} typography="Incomes" />
      <BalancePieChart transactions={expenses} typography="Expenses" />
    </div>
  );
}
