'use client';

import { Balance, BalanceChart, Transactions } from '@/components';
import { TransactionType } from '@/enums';
import { useTransactions } from '@/hooks';
import {
  getStartOfTheMonthAndEndOfTheMonth,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import type { JSX } from 'react';
import { useMemo, useState } from 'react';

export default function Body(): JSX.Element {
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
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex h-full w-full flex-col justify-between gap-2 lg:flex-row">
        <Balance
          incomes={incomes ?? []}
          expenses={expenses ?? []}
          date={date}
          setDate={setDate}
        />
        <BalanceChart incomes={incomes ?? []} expenses={expenses ?? []} />
      </div>
      <div className="flex h-full w-full gap-2">
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
      </div>
    </div>
  );
}
