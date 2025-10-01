'use client';

import Balance from '@/components/Balance';
import Header from '@/components/Header';
import Transactions from '@/components/Transactions';
import { TransactionType } from '@/enums/transactionType.enum';
import useTransactions from '@/hooks/useTransactions';
import { useState, type JSX } from 'react';

export default function Home(): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const { data: incomes, mutate: incomesMutate } = useTransactions(
    TransactionType.INCOME,
    { startDate: date, endDate: date }
  );
  const { data: expenses, mutate: expensesMutate } = useTransactions(
    TransactionType.EXPENSE,
    { startDate: date, endDate: date }
  );

  return (
    <div className="flex h-screen flex-col">
      <Header date={date} setDate={setDate} />
      <main className="flex h-full w-full flex-col gap-2 px-2 py-3">
        <Balance incomes={incomes ?? []} expenses={expenses ?? []} />
        <Transactions
          transactions={incomes}
          transactionsMutate={incomesMutate}
          title="Incomes"
          selectedDate={date}
        />
        <Transactions
          transactions={expenses}
          transactionsMutate={expensesMutate}
          title="Expenses"
          selectedDate={date}
        />
      </main>
    </div>
  );
}
