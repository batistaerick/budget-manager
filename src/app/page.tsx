'use client';
import Balance from '@/app/components/Balance';
import Transactions from '@/app/components/Transactions';
import useTransactions from '@/hooks/useTransactions';
import { TransactionType } from '@prisma/client';
import type { JSX } from 'react';

export default function Home(): JSX.Element {
  const { data: incomes, mutate: incomesMutate } = useTransactions(
    TransactionType.INCOME
  );
  const { data: expenses, mutate: expensesMutate } = useTransactions(
    TransactionType.EXPENSE
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Balance />
      <Transactions
        transactions={incomes}
        transactionsMutate={incomesMutate}
        title="Incomes"
      />
      <Transactions
        transactions={expenses}
        transactionsMutate={expensesMutate}
        title="Expenses"
      />
    </div>
  );
}
