'use client';

import { Balance, Charts, Transactions } from '@/components';
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
    <div className="flex min-h-0 flex-col gap-2 p-2 lg:h-[calc(100vh-61px)] lg:overflow-hidden">
      <div className="flex w-full shrink-0 flex-col justify-between gap-2 lg:flex-row">
        <Balance
          incomes={incomes ?? []}
          expenses={expenses ?? []}
          date={date}
          setDate={setDate}
        />
        <Charts
          expenses={expenses ?? []}
          incomes={incomes ?? []}
          startDate={monthRange.startDate}
          endDate={monthRange.endDate}
        />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col gap-2 lg:flex-row">
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
