'use client';

import { Balance, Header, Transactions } from '@/components';
import { TransactionType } from '@/enums';
import { useTransactions } from '@/hooks';
import {
  getStartOfTheMonthAndEndOfTheMonth,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import { useMemo, useState, type JSX } from 'react';

export default function HomePage(): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());

  const monthRange: { startDate: Date; endDate: Date } = useMemo(
    (): DateRangeTransactions => getStartOfTheMonthAndEndOfTheMonth(date),
    [date]
  );

  const { data: incomes, mutate: incomesMutate } = useTransactions(
    TransactionType.INCOME,
    monthRange
  );
  const { data: expenses, mutate: expensesMutate } = useTransactions(
    TransactionType.EXPENSE,
    monthRange
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
