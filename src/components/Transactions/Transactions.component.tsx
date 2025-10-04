'use client';

import { FinancialMovements, HeaderCell } from '@/components';
import type { Transaction } from '@/types';
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
    if (!transactions) {
      return [];
    }
    return transactions.sort((a: Transaction, b: Transaction): 1 | -1 | 0 => {
      let A: string | number = '';
      let B: string | number = '';

      if (sortKey === 'category') {
        A = (a.category?.name ?? '').toLowerCase();
        B = (b.category?.name ?? '').toLowerCase();
      } else if (sortKey === 'notes') {
        A = (a.notes ?? '').toLowerCase();
        B = (b.notes ?? '').toLowerCase();
      } else if (sortKey === 'date') {
        A = new Date(a.date).getTime();
        B = new Date(b.date).getTime();
      } else if (sortKey === 'value') {
        function getAmount(t: Transaction): number {
          return t.installmentNumbers
            ? Number(t.installments?.[0]?.amount ?? 0)
            : Number(t.totalValue);
        }

        A = getAmount(a);
        B = getAmount(b);
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
    <div className="w-full rounded-xl bg-blue-950/90 px-3 py-3">
      <div className="mb-2 grid grid-cols-4 place-items-start">
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
        <HeaderCell
          label="Value"
          keyName="value"
          sortKey={sortKey}
          sortOrder={sortOrder}
          toggleSort={toggleSort}
        />
      </div>
      <div className="h-[35rem] space-y-2 overflow-y-auto">
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
