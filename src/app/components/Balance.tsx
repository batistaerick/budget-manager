import Money from '@/app/components/Money';
import useTransactions from '@/hooks/useTransactions';
import { TransactionType, type Transaction } from '@prisma/client';
import { useMemo, type JSX } from 'react';
import { FcBearish, FcBullish } from 'react-icons/fc';

export default function Balance(): JSX.Element {
  const { data: incomesResponse } = useTransactions(TransactionType.INCOME);
  const { data: expensesResponse } = useTransactions(TransactionType.EXPENSE);

  function total(transactions: Transaction[] | undefined): number {
    if (transactions) {
      return transactions.reduce(
        (sum: number, transaction: Transaction): number =>
          sum + (transaction?.value ?? 0),
        0
      );
    }
    return 0;
  }

  const incomes: number = useMemo(
    (): number => total(incomesResponse),
    [incomesResponse]
  );
  const expenses: number = useMemo(
    (): number => total(expensesResponse),
    [expensesResponse]
  );

  return (
    <div className="flex w-full cursor-default flex-col gap-2 rounded-xl bg-slate-700 bg-opacity-60 p-3">
      <div className="flex items-center justify-between">
        <div>
          Total
          <Money className="text-left text-3xl" value={incomes - expenses} />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div className="text-left">
          Expenses
          <div className="flex items-end gap-1">
            <FcBearish size={35} />
            <Money value={expenses} />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="text-end">
            Incomes
            <div className="flex items-end justify-end gap-1">
              <Money value={incomes} />
              <FcBullish size={35} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
