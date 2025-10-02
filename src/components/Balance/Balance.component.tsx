'use client';
import { Money } from '@/components';
import type { Transaction } from '@/types';
import { useMemo, type JSX } from 'react';
import { FcBearish, FcBullish } from 'react-icons/fc';

interface BalanceProps {
  expenses: Transaction[];
  incomes: Transaction[];
}

export default function Balance({
  expenses,
  incomes,
}: Readonly<BalanceProps>): JSX.Element {
  function total(transactions: Transaction[]): bigint {
    return transactions.reduce(
      (sum: bigint, { totalValue }: Transaction): bigint =>
        sum + BigInt(totalValue),
      0n
    );
  }

  const totalIncomes: bigint = useMemo((): bigint => total(incomes), [incomes]);
  const totalExpenses: bigint = useMemo(
    (): bigint => total(expenses),
    [expenses]
  );

  return (
    <div className="flex w-full cursor-default flex-col gap-2 rounded-xl bg-slate-700/90 p-3">
      <div className="flex w-1/2 items-center justify-between">
        <div>
          Total
          <Money
            className="text-left text-3xl"
            value={totalIncomes - totalExpenses}
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
