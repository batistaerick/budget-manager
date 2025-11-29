'use client';

import { DatePickerDialog, Money } from '@/components';
import type { Transaction } from '@/types';
import { useMemo, type Dispatch, type JSX, type SetStateAction } from 'react';
import { FcBearish, FcBullish } from 'react-icons/fc';

function total(transactions: Transaction[]): number {
  return transactions.reduce(
    (sum: number, { totalValue }: Transaction): number => sum + totalValue,
    0
  );
}

interface BalanceProps {
  expenses: Transaction[];
  incomes: Transaction[];
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

export default function Balance({
  expenses,
  incomes,
  date,
  setDate,
}: Readonly<BalanceProps>): JSX.Element {
  const totalIncomes: number = useMemo((): number => total(incomes), [incomes]);
  const totalExpenses: number = useMemo(
    (): number => total(expenses),
    [expenses]
  );

  return (
    <div className="flex w-full cursor-default flex-col justify-between gap-2 rounded bg-slate-700/90 p-2">
      <div className="flex w-full justify-between">
        <div>
          <span>Total</span>
          <Money
            className="text-left text-3xl"
            value={totalIncomes - totalExpenses}
          />
        </div>
        <div className="flex items-center rounded-full border border-gray-500 hover:border-gray-600">
          <DatePickerDialog
            date={date}
            setDate={setDate}
            dateFormat="MMMM/yyyy"
            showMonthYearPicker
            arrows
          />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div className="text-left">
          Expenses
          <div className="flex items-end gap-1">
            <FcBearish size={35} />
            <Money value={totalExpenses} />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="text-end">
            Incomes
            <div className="flex items-end justify-end gap-1">
              <Money value={totalIncomes} />
              <FcBullish size={35} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
