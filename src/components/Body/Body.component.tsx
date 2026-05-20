'use client';

import { Balance, Charts, Transactions } from '@/components';
import { TransactionType } from '@/enums';
import { useTransactions } from '@/hooks';
import type { TransactionSortKey, TransactionSortOrder } from '@/types';
import {
  getStartOfTheMonthAndEndOfTheMonth,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import type { JSX } from 'react';
import { useMemo, useState } from 'react';

interface TransactionSortState {
  key: TransactionSortKey;
  order: TransactionSortOrder;
}

export default function Body(): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const [incomeSort, setIncomeSort] = useState<TransactionSortState>({
    key: 'date',
    order: 'asc',
  });
  const [expenseSort, setExpenseSort] = useState<TransactionSortState>({
    key: 'date',
    order: 'asc',
  });

  const monthRange: { startDate: Date; endDate: Date } = useMemo(
    (): DateRangeTransactions => getStartOfTheMonthAndEndOfTheMonth(date),
    [date]
  );
  const {
    data: incomes,
    hasMore: hasMoreIncomes,
    isLoadingMore: isLoadingMoreIncomes,
    loadMore: loadMoreIncomes,
    mutate: incomesMutate,
  } = useTransactions(TransactionType.INCOME, monthRange, {
    sortKey: incomeSort.key,
    sortOrder: incomeSort.order,
  });
  const {
    data: expenses,
    hasMore: hasMoreExpenses,
    isLoadingMore: isLoadingMoreExpenses,
    loadMore: loadMoreExpenses,
    mutate: expensesMutate,
  } = useTransactions(TransactionType.EXPENSE, monthRange, {
    sortKey: expenseSort.key,
    sortOrder: expenseSort.order,
  });

  function toggleSort(
    key: TransactionSortKey,
    setSort: (value: TransactionSortState) => void,
    currentSort: TransactionSortState
  ): void {
    setSort(
      currentSort.key === key
        ? {
            key,
            order: currentSort.order === 'asc' ? 'desc' : 'asc',
          }
        : { key, order: 'asc' }
    );
  }

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
          hasMore={hasMoreIncomes}
          isLoadingMore={isLoadingMoreIncomes}
          loadMore={loadMoreIncomes}
          sortKey={incomeSort.key}
          sortOrder={incomeSort.order}
          transactions={incomes}
          transactionsMutate={incomesMutate}
          title="Incomes"
          selectedDate={date}
          toggleSort={(key: TransactionSortKey): void =>
            toggleSort(key, setIncomeSort, incomeSort)
          }
        />
        <Transactions
          hasMore={hasMoreExpenses}
          isLoadingMore={isLoadingMoreExpenses}
          loadMore={loadMoreExpenses}
          sortKey={expenseSort.key}
          sortOrder={expenseSort.order}
          transactions={expenses}
          transactionsMutate={expensesMutate}
          title="Expenses"
          selectedDate={date}
          toggleSort={(key: TransactionSortKey): void =>
            toggleSort(key, setExpenseSort, expenseSort)
          }
        />
      </div>
    </div>
  );
}
