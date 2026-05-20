'use client';

import { FinancialMovements, HeaderCell } from '@/components';
import type { Transaction } from '@/types';
import { parseApiDate } from '@/utils/globalFormats.util';
import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import type { KeyedMutator } from 'swr';

type SortKey = 'category' | 'notes' | 'date' | 'value';
type SortOrder = 'asc' | 'desc';

interface SingleTransactionProps {
  transactions?: Transaction[];
  transactionsMutate: KeyedMutator<Transaction[]>;
  selectedDate: Date;
  title: string;
}

export default function Transactions({
  transactions,
  transactionsMutate,
  selectedDate,
  title,
}: Readonly<SingleTransactionProps>): JSX.Element {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  function toggleSort(key: SortKey): void {
    if (sortKey === key) {
      setSortOrder(
        (prev: SortOrder): SortOrder => (prev === 'asc' ? 'desc' : 'asc')
      );
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  const sortedTransactions: Transaction[] = useMemo((): Transaction[] => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    function getAmount(transaction: Transaction): number {
      return transaction.installmentNumbers
        ? Number(transaction.installments?.[0]?.amount ?? 0)
        : Number(transaction.totalValue);
    }

    return transactions
      .slice()
      .sort((a: Transaction, b: Transaction): number => {
        let A: string | number = '';
        let B: string | number = '';

        switch (sortKey) {
          case 'category':
            A = a.category.name.toLowerCase();
            B = b.category.name.toLowerCase();
            break;
          case 'notes':
            A = (a.notes ?? '').toLowerCase();
            B = (b.notes ?? '').toLowerCase();
            break;
          case 'date':
            A = parseApiDate(a.date).getTime();
            B = parseApiDate(b.date).getTime();
            break;
          case 'value':
            A = getAmount(a);
            B = getAmount(b);
            break;
          default:
            return 0;
        }

        if (A < B) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (A > B) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [transactions, sortKey, sortOrder]);

  return (
    <div className="flex min-h-0 w-full flex-col rounded border border-[var(--ctp-surface1)] bg-[var(--ctp-base)]/95 px-3 py-3 shadow-md">
      <div className="mb-2 grid grid-cols-4 place-items-start rounded bg-[var(--ctp-crust)]/60 px-2 py-2">
        <HeaderCell
          label={title}
          keyName="category"
          sortKey={sortKey}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
        />
        <HeaderCell
          label="Notes"
          keyName="notes"
          sortKey={sortKey}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
        />
        <HeaderCell
          label="Date"
          keyName="date"
          sortKey={sortKey}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
        />
        <div className="flex w-full justify-end">
          <HeaderCell
            label="Value"
            keyName="value"
            sortKey={sortKey}
            sortOrder={sortOrder}
            toggleSort={toggleSort}
          />
        </div>
      </div>
      <div className="min-h-64 space-y-2 overflow-y-auto lg:min-h-0 lg:flex-1">
        {sortedTransactions.map(
          (transaction: Transaction): JSX.Element => (
            <FinancialMovements
              key={transaction.id}
              transaction={transaction}
              mutateOnDelete={transactionsMutate}
              selectedDate={selectedDate}
            />
          )
        )}
      </div>
    </div>
  );
}
