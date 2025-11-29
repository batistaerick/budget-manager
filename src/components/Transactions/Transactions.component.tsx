'use client';

import { FinancialMovements, HeaderCell } from '@/components';
import type { Transaction } from '@/types';
import type { JSX } from 'react';
import { useCallback, useMemo, useState } from 'react';
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

  const createTransactionComparator = useCallback(
    (sortKey: SortKey, sortOrder: SortOrder) => {
      function getAmount(t: Transaction): number {
        return t.installmentNumbers
          ? Number(t.installments?.[0]?.amount ?? 0)
          : Number(t.totalValue);
      }

      return (a: Transaction, b: Transaction): number => {
        let A: string | number = '';
        let B: string | number = '';

        switch (sortKey) {
          case 'category':
            A = (a.category?.name ?? '').toLowerCase();
            B = (b.category?.name ?? '').toLowerCase();
            break;
          case 'notes':
            A = (a.notes ?? '').toLowerCase();
            B = (b.notes ?? '').toLowerCase();
            break;
          case 'date':
            A = Date.parse(a.date);
            B = Date.parse(b.date);
            break;
          case 'value':
            A = getAmount(a);
            B = getAmount(b);
            break;
          default:
            return 0;
        }
        let comparison: number = 0;

        if (A < B) {
          comparison = -1;
        } else if (A > B) {
          comparison = 1;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      };
    },
    []
  );

  const transactionComparator: (a: Transaction, b: Transaction) => number =
    useCallback(createTransactionComparator(sortKey, sortOrder), [
      sortKey,
      sortOrder,
    ]);

  const sortedTransactions: Transaction[] = useMemo((): Transaction[] => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    return transactions.slice().sort(transactionComparator);
  }, [transactions, sortKey, sortOrder]);

  return (
    <div className="w-full rounded bg-blue-950/90 px-3 py-3">
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
      <div
        className="space-y-2 overflow-y-auto"
        style={{ height: 'calc(100vh - 382px)' }}
      >
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
